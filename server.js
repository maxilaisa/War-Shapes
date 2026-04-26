// SHAPE ARENA - Backend Server (Express + Socket.io)
const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'SHAPE ARENA Server is running' });
});

// Game state storage (in-memory for now, can be upgraded to Redis/Database)
let gameState = {
    activeGames: {},
    playerStats: {}
};

// Create a new game room
app.post('/api/games', (req, res) => {
    const { player1Shape, player2Shape } = req.body;
    const gameId = Date.now().toString();
    
    gameState.activeGames[gameId] = {
        id: gameId,
        player1Shape: player1Shape || 'CIRCLE',
        player2Shape: player2Shape || 'TRIANGLE',
        status: 'waiting',
        createdAt: new Date()
    };
    
    res.json({ gameId, game: gameState.activeGames[gameId] });
});

// Get game state
app.get('/api/games/:gameId', (req, res) => {
    const game = gameState.activeGames[req.params.gameId];
    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
});

// Update game state
app.put('/api/games/:gameId', (req, res) => {
    const game = gameState.activeGames[req.params.gameId];
    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }
    
    gameState.activeGames[req.params.gameId] = { ...game, ...req.body, updatedAt: new Date() };
    res.json(gameState.activeGames[req.params.gameId]);
});

// Delete game
app.delete('/api/games/:gameId', (req, res) => {
    if (!gameState.activeGames[req.params.gameId]) {
        return res.status(404).json({ error: 'Game not found' });
    }
    
    delete gameState.activeGames[req.params.gameId];
    res.json({ message: 'Game deleted' });
});

// Get all active games
app.get('/api/games', (req, res) => {
    res.json(Object.values(gameState.activeGames));
});

// Player stats
app.post('/api/stats', (req, res) => {
    const { playerId, shape, wins, losses } = req.body;
    
    if (!gameState.playerStats[playerId]) {
        gameState.playerStats[playerId] = {
            playerId,
            shape,
            wins: 0,
            losses: 0,
            gamesPlayed: 0
        };
    }
    
    if (wins !== undefined) gameState.playerStats[playerId].wins += wins;
    if (losses !== undefined) gameState.playerStats[playerId].losses += losses;
    gameState.playerStats[playerId].gamesPlayed++;
    
    res.json(gameState.playerStats[playerId]);
});

app.get('/api/stats/:playerId', (req, res) => {
    const stats = gameState.playerStats[req.params.playerId];
    if (!stats) {
        return res.status(404).json({ error: 'Player stats not found' });
    }
    res.json(stats);
});

// ============================================
// SOCKET.IO - Real-time Multiplayer
// ============================================

// Store waiting players and active games
const waitingPlayers = [];
const activeGames = {};

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    // Player joins lobby
    socket.on('joinLobby', (data) => {
        const { playerName, shapeType } = data;
        
        // Check if there's a waiting player
        if (waitingPlayers.length > 0) {
            const opponent = waitingPlayers.shift();
            
            // Create a new game room
            const roomId = `game_${Date.now()}`;
            
            // Create game state
            activeGames[roomId] = {
                id: roomId,
                player1: {
                    id: socket.id,
                    name: playerName,
                    shape: shapeType,
                    position: { x: 200, y: 300 },
                    hp: 100,
                    velocity: { x: 0, y: 0 }
                },
                player2: {
                    id: opponent.socket.id,
                    name: opponent.name,
                    shape: opponent.shape,
                    position: { x: 600, y: 300 },
                    hp: 100,
                    velocity: { x: 0, y: 0 }
                },
                status: 'playing',
                createdAt: new Date()
            };
            
            // Join both players to the room
            socket.join(roomId);
            opponent.socket.join(roomId);
            
            // Notify both players that game started
            io.to(roomId).emit('gameStart', {
                roomId,
                player1: activeGames[roomId].player1,
                player2: activeGames[roomId].player2
            });
            
            console.log(`Game started: ${roomId}`);
        } else {
            // Add to waiting list
            waitingPlayers.push({
                socket,
                name: playerName,
                shape: shapeType
            });
            
            socket.emit('waiting', { message: 'Waiting for opponent...' });
            console.log(`Player ${playerName} waiting for opponent`);
        }
    });

    // Player movement update
    socket.on('playerMove', (data) => {
        const { roomId, playerId, position, velocity } = data;
        
        if (activeGames[roomId]) {
            const game = activeGames[roomId];
            
            // Update player state
            if (game.player1.id === playerId) {
                game.player1.position = position;
                game.player1.velocity = velocity;
            } else if (game.player2.id === playerId) {
                game.player2.position = position;
                game.player2.velocity = velocity;
            }
            
            // Broadcast to other player in room
            socket.to(roomId).emit('opponentMove', {
                playerId,
                position,
                velocity
            });
        }
    });

    // Player hit
    socket.on('playerHit', (data) => {
        const { roomId, attackerId, defenderId, damage, hitType } = data;
        
        if (activeGames[roomId]) {
            const game = activeGames[roomId];
            
            // Update defender HP
            if (game.player1.id === defenderId) {
                game.player1.hp = Math.max(0, game.player1.hp - damage);
            } else if (game.player2.id === defenderId) {
                game.player2.hp = Math.max(0, game.player2.hp - damage);
            }
            
            // Broadcast hit to both players
            io.to(roomId).emit('playerHit', {
                attackerId,
                defenderId,
                damage,
                hitType,
                player1Hp: game.player1.hp,
                player2Hp: game.player2.hp
            });
            
            // Check for game over
            if (game.player1.hp <= 0 || game.player2.hp <= 0) {
                const winner = game.player1.hp > 0 ? game.player1 : game.player2;
                game.status = 'ended';
                game.winner = winner;
                
                io.to(roomId).emit('gameOver', {
                    winner: winner.id,
                    winnerName: winner.name
                });
                
                // Clean up game after delay
                setTimeout(() => {
                    delete activeGames[roomId];
                }, 5000);
            }
        }
    });

    // Player disconnect
    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        
        // Remove from waiting list
        const waitingIndex = waitingPlayers.findIndex(p => p.socket.id === socket.id);
        if (waitingIndex !== -1) {
            waitingPlayers.splice(waitingIndex, 1);
        }
        
        // Handle active game disconnection
        for (const roomId in activeGames) {
            const game = activeGames[roomId];
            if (game.player1.id === socket.id || game.player2.id === socket.id) {
                io.to(roomId).emit('playerDisconnected', {
                    disconnectedId: socket.id
                });
                delete activeGames[roomId];
                break;
            }
        }
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`SHAPE ARENA Server running on port ${PORT}`);
});
