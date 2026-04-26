// SHAPE ARENA - Backend Server (Express)
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
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

// Start server
app.listen(PORT, () => {
    console.log(`SHAPE ARENA Server running on port ${PORT}`);
});
