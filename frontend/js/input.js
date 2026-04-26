// SHAPE ARENA - Input Handler

export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = {};
        
        this.setupListeners();
    }

    setupListeners() {
        window.addEventListener("keydown", (e) => {
            this.keys[e.key] = true;
            this.handleInput(e.key);
        });
        
        window.addEventListener("keyup", (e) => {
            this.keys[e.key] = false;
        });
    }

    handleInput(key) {
        if (this.game.fighters.length < 2) return;
        
        const [f1, f2] = this.game.fighters;
        
        // Player 1 controls (WASD)
        switch (key.toLowerCase()) {
            case "w": f1.move(0, -5); break;
            case "s": f1.move(0, 5); break;
            case "a": f1.move(-5, 0); f1.facing = -1; break;
            case "d": f1.move(5, 0); f1.facing = 1; break;
            case "q": 
                if (f1.abilities[0].canUse()) {
                    f1.abilities[0].use();
                    f1.isAttacking = true;
                }
                break;
            case "e":
                if (f1.abilities[1].canUse()) {
                    f1.abilities[1].use();
                    f1.isAttacking = true;
                }
                break;
            case "r":
                if (f1.abilities[2].canUse()) {
                    f1.abilities[2].use();
                    f1.isAttacking = true;
                }
                break;
            case "f":
                f1.activateUltimate();
                break;
            case " ":
                f1.isDodging = true;
                setTimeout(() => f1.isDodging = false, 300);
                break;
        }
        
        // Player 2 controls (Arrow keys)
        switch (key) {
            case "ArrowUp": f2.move(0, -5); break;
            case "ArrowDown": f2.move(0, 5); break;
            case "ArrowLeft": f2.move(-5, 0); f2.facing = -1; break;
            case "ArrowRight": f2.move(5, 0); f2.facing = 1; break;
            case "/":
                if (f2.abilities[0].canUse()) {
                    f2.abilities[0].use();
                    f2.isAttacking = true;
                }
                break;
            case ".":
                if (f2.abilities[1].canUse()) {
                    f2.abilities[1].use();
                    f2.isAttacking = true;
                }
                break;
            case "'":
                if (f2.abilities[2].canUse()) {
                    f2.abilities[2].use();
                    f2.isAttacking = true;
                }
                break;
            case "Enter":
                f2.activateUltimate();
                break;
            case "Shift":
                f2.isDodging = true;
                setTimeout(() => f2.isDodging = false, 300);
                break;
        }
    }
}
