// SHAPE ARENA - Main Initialization

import { Game } from './game.js';
import { InputHandler } from './input.js';

let game;
let inputHandler;

window.onload = function() {
    game = new Game("gameCanvas");
    inputHandler = new InputHandler(game);
    
    // Lobby handling
    const lobby = document.getElementById('lobby');
    const canvas = document.getElementById('gameCanvas');
    const joinBtn = document.getElementById('joinBtn');
    const playerNameInput = document.getElementById('playerName');
    const shapeSelect = document.getElementById('shapeSelect');
    const lobbyStatus = document.getElementById('lobbyStatus');
    
    joinBtn.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim() || 'Player';
        const shapeType = shapeSelect.value;
        
        lobbyStatus.textContent = 'Connecting...';
        joinBtn.disabled = true;
        
        game.joinOnlineGame(playerName, shapeType);
    });
    
    // Listen for game start to hide lobby and show canvas
    game.network.on('onGameStart', (data) => {
        lobby.style.display = 'none';
        canvas.style.display = 'block';
        lobbyStatus.textContent = '';
        
        // Show mobile controls if on mobile
        if (window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            document.getElementById('mobileControls').style.display = 'flex';
        }
    });
    
    game.network.on('onWaiting', (data) => {
        lobbyStatus.textContent = data.message;
    });
};
