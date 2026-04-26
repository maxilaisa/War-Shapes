// SHAPE ARENA - Input Handling

export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.isMobile = this.detectMobile();
        
        this.setupListeners();
        if (this.isMobile) {
            this.setupMobileControls();
        }
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
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

    setupMobileControls() {
        const mobileBtns = {
            btnUp: 'w',
            btnDown: 's',
            btnLeft: 'a',
            btnRight: 'd',
            btnLight: 'q',
            btnMedium: 'e',
            btnHeavy: 'r',
            btnUlt: 'f',
            btnDodge: ' '
        };

        for (const [btnId, key] of Object.entries(mobileBtns)) {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.handleInput(key);
                });
                btn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.keys[key] = false;
                });
            }
        }
    }

    handleInput(key) {
        if (this.game.fighters.length < 2) return;
        
        // In online mode, only control your own fighter
        const myFighter = this.game.isOnline ? this.game.fighters[this.game.playerIndex] : this.game.fighters[0];
        
        if (!myFighter) return;
        
        // Player controls (WASD - same for both players in online mode)
        switch (key.toLowerCase()) {
            case "w": myFighter.move(0, -5); break;
            case "s": myFighter.move(0, 5); break;
            case "a": myFighter.move(-5, 0); myFighter.facing = -1; break;
            case "d": myFighter.move(5, 0); myFighter.facing = 1; break;
            case "q": 
                if (myFighter.abilities[0].canUse()) {
                    myFighter.abilities[0].use();
                    myFighter.isAttacking = true;
                }
                break;
            case "e":
                if (myFighter.abilities[1].canUse()) {
                    myFighter.abilities[1].use();
                    myFighter.isAttacking = true;
                }
                break;
            case "r":
                if (myFighter.abilities[2].canUse()) {
                    myFighter.abilities[2].use();
                    myFighter.isAttacking = true;
                }
                break;
            case "f":
                myFighter.activateUltimate();
                break;
            case " ":
                myFighter.isDodging = true;
                setTimeout(() => myFighter.isDodging = false, 300);
                break;
        }
    }
}
