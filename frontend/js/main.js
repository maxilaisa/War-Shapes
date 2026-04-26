// SHAPE ARENA - Main Initialization

import { Game } from './game.js';
import { InputHandler } from './input.js';

let game;
let inputHandler;

window.onload = function() {
    game = new Game("gameCanvas");
    
    // Add two fighters
    game.addFighter("CIRCLE", 200, 300);
    game.addFighter("TRIANGLE", 600, 300);
    
    inputHandler = new InputHandler(game);
    
    // Start the game
    setTimeout(() => game.start(), 1000);
};
