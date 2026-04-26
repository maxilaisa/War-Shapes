// SHAPE ARENA - Network Client (Socket.io)

export class NetworkClient {
    constructor() {
        this.socket = null;
        this.roomId = null;
        this.playerId = null;
        this.isOnline = false;
        this.callbacks = {};
    }

    connect() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            this.playerId = this.socket.id;
            console.log('Connected to server:', this.playerId);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.isOnline = false;
            if (this.callbacks.onDisconnect) {
                this.callbacks.onDisconnect();
            }
        });

        this.socket.on('waiting', (data) => {
            console.log('Waiting for opponent:', data.message);
            if (this.callbacks.onWaiting) {
                this.callbacks.onWaiting(data);
            }
        });

        this.socket.on('gameStart', (data) => {
            console.log('Game started:', data);
            this.roomId = data.roomId;
            this.isOnline = true;
            if (this.callbacks.onGameStart) {
                this.callbacks.onGameStart(data);
            }
        });

        this.socket.on('opponentMove', (data) => {
            if (this.callbacks.onOpponentMove) {
                this.callbacks.onOpponentMove(data);
            }
        });

        this.socket.on('playerHit', (data) => {
            if (this.callbacks.onPlayerHit) {
                this.callbacks.onPlayerHit(data);
            }
        });

        this.socket.on('gameOver', (data) => {
            console.log('Game over:', data);
            if (this.callbacks.onGameOver) {
                this.callbacks.onGameOver(data);
            }
        });

        this.socket.on('playerDisconnected', (data) => {
            console.log('Player disconnected:', data);
            if (this.callbacks.onPlayerDisconnected) {
                this.callbacks.onPlayerDisconnected(data);
            }
        });
    }

    joinLobby(playerName, shapeType) {
        if (this.socket) {
            this.socket.emit('joinLobby', { playerName, shapeType });
        }
    }

    sendMove(position, velocity) {
        if (this.socket && this.roomId && this.isOnline) {
            this.socket.emit('playerMove', {
                roomId: this.roomId,
                playerId: this.playerId,
                position,
                velocity
            });
        }
    }

    sendHit(attackerId, defenderId, damage, hitType) {
        if (this.socket && this.roomId && this.isOnline) {
            this.socket.emit('playerHit', {
                roomId: this.roomId,
                attackerId,
                defenderId,
                damage,
                hitType
            });
        }
    }

    // Callback registration
    on(event, callback) {
        this.callbacks[event] = callback;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
