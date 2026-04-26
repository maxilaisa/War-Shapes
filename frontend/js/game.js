// SHAPE ARENA - Game Class

import { PhysicsEngine } from './physics.js';
import { Fighter } from './fighter.js';
import { CONFIG } from './config.js';

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        
        this.physicsEngine = new PhysicsEngine();
        
        // Arena bounds
        this.bounds = {
            left: 50,
            right: 750,
            top: 50,
            bottom: 550
        };
        
        // Game state
        this.fighters = [];
        this.gameState = "ready"; // ready, fighting, ended
        this.winner = null;
        
        // Initialize
        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas.width = 800;
        this.canvas.height = 600;
    }

    addFighter(shapeType, startX, startY) {
        const fighter = new Fighter(shapeType, startX, startY);
        this.fighters.push(fighter);
        return fighter;
    }

    start() {
        this.gameState = "fighting";
        this.gameLoop();
    }

    // ============================================
    // COMBAT SYSTEM
    // ============================================
    checkCollision(fighter1, fighter2) {
        const dx = fighter2.position.x - fighter1.position.x;
        const dy = fighter2.position.y - fighter1.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < 40; // Hitbox size
    }

    processHit(attacker, defender, hitType) {
        // Calculate knockback
        const angle = Math.atan2(
            defender.position.y - attacker.position.y,
            defender.position.x - attacker.position.x
        );
        
        const knockback = this.physicsEngine.calculateKnockback(
            attacker,
            defender,
            angle,
            hitType === "WALL_HIT"
        );
        
        // Apply damage (only physical contact deals damage)
        let damage = 10;
        if (attacker.ultimateActive) {
            damage *= 1.5;
        }
        damage *= attacker.getComboMultiplier();
        
        const isDead = defender.takeDamage(damage, knockback);
        
        // Update attacker's combo
        if (attacker.comboCount === 0) {
            attacker.startCombo();
        } else {
            attacker.extendCombo(hitType);
        }
        
        // Add ultimate charge
        attacker.addUltimateCharge(hitType);
        
        // Check for counter hit
        if (defender.isDodging) {
            attacker.extendCombo("COUNTER_HIT");
            attacker.addUltimateCharge("COUNTER_HIT");
        }
        
        return isDead;
    }

    // ============================================
    // GAME LOOP
    // ============================================
    update() {
        if (this.gameState !== "fighting") return;
        
        // Update each fighter
        for (const fighter of this.fighters) {
            fighter.updatePhysics(this.bounds, this.physicsEngine);
            
            // Check for out of bounds
            if (fighter.isOutOfBounds(this.bounds)) {
                this.endGame(this.fighters.find(f => f !== fighter));
                return;
            }
            
            // Check for death
            if (fighter.hp <= 0) {
                this.endGame(this.fighters.find(f => f !== fighter));
                return;
            }
        }
        
        // Check fighter collisions
        if (this.fighters.length >= 2) {
            const [f1, f2] = this.fighters;
            if (this.checkCollision(f1, f2)) {
                // Determine hit type based on context
                let hitType = "CLEAN_HIT";
                
                // Check wall proximity
                const nearWall = 
                    f2.position.x <= this.bounds.left + 20 ||
                    f2.position.x >= this.bounds.right - 20 ||
                    f2.position.y <= this.bounds.top + 20 ||
                    f2.position.y >= this.bounds.bottom - 20;
                
                if (nearWall) hitType = "WALL_HIT";
                
                // Process hit
                const isDead = this.processHit(f1, f2, hitType);
                if (isDead) {
                    this.endGame(f1);
                    return;
                }
            }
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = "#1a1a2e";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw arena bounds
        this.ctx.strokeStyle = "#4a4a6a";
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(
            this.bounds.left,
            this.bounds.top,
            this.bounds.right - this.bounds.left,
            this.bounds.bottom - this.bounds.top
        );
        
        // Draw fighters
        for (const fighter of this.fighters) {
            this.drawFighter(fighter);
        }
        
        // Draw UI
        this.drawUI();
    }

    drawFighter(fighter) {
        const ctx = this.ctx;
        const x = fighter.position.x;
        const y = fighter.position.y;
        
        // Set color based on shape
        const colors = {
            CIRCLE: "#ff6b6b",
            OVAL: "#ffa502",
            ELLIPSE: "#ff7f50",
            TRIANGLE: "#4ecdc4",
            SQUARE: "#45b7d1",
            RECTANGLE: "#5f9ea0",
            PARALLELOGRAM: "#9b59b6",
            RHOMBUS: "#e056fd",
            TRAPEZOID: "#f0932b",
            KITE: "#6ab04c",
            PENTAGON: "#be2edd",
            HEXAGON: "#22a6b3",
            STAR: "#ffeaa7",
            HEART: "#fd79a8",
            CRESCENT: "#a29bfe",
            DIAMOND: "#00d2d3",
            SPIRAL: "#96ceb4",
            SPHERE: "#ff6b6b",
            CUBE: "#45b7d1",
            CONE: "#4ecdc4",
            CYLINDER: "#5f9ea0",
            TORUS: "#96ceb4",
            CAPSULE: "#fd79a8",
            ICOSAHEDRON: "#00d2d3",
            DODECAHEDRON: "#22a6b3"
        };
        
        ctx.fillStyle = colors[fighter.shapeType] || "#ffffff";
        
        // Draw based on shape type
        ctx.beginPath();
        
        switch (fighter.shapeType) {
            case "CIRCLE":
            case "SPHERE":
                ctx.arc(x, y, 20, 0, Math.PI * 2);
                break;
            case "OVAL":
                ctx.ellipse(x, y, 25, 15, 0, 0, Math.PI * 2);
                break;
            case "ELLIPSE":
                ctx.ellipse(x, y, 28, 12, Math.PI / 4, 0, Math.PI * 2);
                break;
            case "TRIANGLE":
            case "CONE":
                ctx.moveTo(x, y - 20);
                ctx.lineTo(x + 20, y + 15);
                ctx.lineTo(x - 20, y + 15);
                ctx.closePath();
                break;
            case "SQUARE":
            case "CUBE":
                ctx.rect(x - 18, y - 18, 36, 36);
                break;
            case "RECTANGLE":
            case "CYLINDER":
                ctx.rect(x - 25, y - 12, 50, 24);
                break;
            case "PARALLELOGRAM":
                ctx.moveTo(x - 15, y - 15);
                ctx.lineTo(x + 5, y - 15);
                ctx.lineTo(x + 15, y + 15);
                ctx.lineTo(x - 5, y + 15);
                ctx.closePath();
                break;
            case "RHOMBUS":
                ctx.moveTo(x, y - 20);
                ctx.lineTo(x + 18, y);
                ctx.lineTo(x, y + 20);
                ctx.lineTo(x - 18, y);
                ctx.closePath();
                break;
            case "TRAPEZOID":
                ctx.moveTo(x - 20, y - 15);
                ctx.lineTo(x + 20, y - 15);
                ctx.lineTo(x + 12, y + 15);
                ctx.lineTo(x - 12, y + 15);
                ctx.closePath();
                break;
            case "KITE":
                ctx.moveTo(x, y - 22);
                ctx.lineTo(x + 18, y);
                ctx.lineTo(x, y + 12);
                ctx.lineTo(x - 18, y);
                ctx.closePath();
                break;
            case "PENTAGON":
                this.drawPolygon(ctx, x, y, 5, 20);
                break;
            case "HEXAGON":
            case "DODECAHEDRON":
                this.drawPolygon(ctx, x, y, 6, 20);
                break;
            case "SPIRAL":
            case "TORUS":
                for (let i = 0; i < 3; i++) {
                    ctx.arc(x, y, 8 + i * 6, 0, Math.PI * 2);
                }
                break;
            case "STAR":
                this.drawStar(ctx, x, y, 5, 20, 10);
                break;
            case "HEART":
            case "CAPSULE":
                this.drawHeart(ctx, x, y, 20);
                break;
            case "CRESCENT":
                this.drawCrescent(ctx, x, y, 20);
                break;
            case "DIAMOND":
            case "ICOSAHEDRON":
                this.drawDiamond(ctx, x, y, 20);
                break;
        }
        
        ctx.fill();
        
        // Ultimate glow effect
        if (fighter.ultimateActive) {
            ctx.shadowColor = "#ffd700";
            ctx.shadowBlur = 20;
            ctx.strokeStyle = "#ffd700";
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        
        // Draw combo indicator
        if (fighter.comboCount > 0) {
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 16px Arial";
            ctx.textAlign = "center";
            ctx.fillText(`${fighter.comboCount} HIT`, x, y - 30);
            
            if (fighter.comboTier) {
                ctx.fillStyle = "#ffd700";
                ctx.font = "12px Arial";
                ctx.fillText(CONFIG.COMBO_TIERS[fighter.comboTier].name, x, y - 45);
            }
        }
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        
        ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
    }

    drawHeart(ctx, x, y, size) {
        ctx.moveTo(x, y + size / 4);
        ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
        ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.75, x, y + size);
        ctx.bezierCurveTo(x, y + size * 0.75, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
        ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
    }

    drawPolygon(ctx, x, y, sides, radius) {
        const angle = (Math.PI * 2) / sides;
        ctx.moveTo(x + radius * Math.cos(-Math.PI / 2), y + radius * Math.sin(-Math.PI / 2));
        for (let i = 1; i <= sides; i++) {
            ctx.lineTo(
                x + radius * Math.cos(angle * i - Math.PI / 2),
                y + radius * Math.sin(angle * i - Math.PI / 2)
            );
        }
        ctx.closePath();
    }

    drawCrescent(ctx, x, y, size) {
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.arc(x + 8, y - 5, size * 0.8, 0, Math.PI * 2, true);
    }

    drawDiamond(ctx, x, y, size) {
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size * 0.6, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x - size * 0.6, y);
        ctx.closePath();
    }

    drawUI() {
        const ctx = this.ctx;
        
        // Draw HP bars and ultimate bars for each fighter
        this.fighters.forEach((fighter, index) => {
            const yOffset = 20 + index * 60;
            
            // Fighter name
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 16px Arial";
            ctx.textAlign = "left";
            ctx.fillText(fighter.shapeData.name, 20, yOffset);
            
            // HP bar background
            ctx.fillStyle = "#333333";
            ctx.fillRect(150, yOffset - 15, 200, 20);
            
            // HP bar fill
            const hpPercent = fighter.hp / fighter.maxHp;
            ctx.fillStyle = hpPercent > 0.5 ? "#4ade80" : hpPercent > 0.25 ? "#fbbf24" : "#ef4444";
            ctx.fillRect(150, yOffset - 15, 200 * hpPercent, 20);
            
            // HP text
            ctx.fillStyle = "#ffffff";
            ctx.font = "12px Arial";
            ctx.fillText(`${fighter.hp}/${fighter.maxHp}`, 360, yOffset);
            
            // Ultimate bar background
            ctx.fillStyle = "#333333";
            ctx.fillRect(150, yOffset + 10, 200, 10);
            
            // Ultimate bar fill
            const ultPercent = fighter.ultimateCharge / CONFIG.ULTIMATE_THRESHOLD;
            ctx.fillStyle = "#ffd700";
            ctx.fillRect(150, yOffset + 10, 200 * ultPercent, 10);
            
            // Ultimate status
            ctx.fillStyle = fighter.ultimateReady ? "#ffd700" : "#888888";
            ctx.font = "12px Arial";
            ctx.fillText(fighter.ultimateReady ? "ULT READY" : "ULT", 360, yOffset + 20);
        });
        
        // Game state text
        if (this.gameState === "ready") {
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 48px Arial";
            ctx.textAlign = "center";
            ctx.fillText("READY", this.canvas.width / 2, this.canvas.height / 2);
        } else if (this.gameState === "ended") {
            ctx.fillStyle = "#ffd700";
            ctx.font = "bold 48px Arial";
            ctx.textAlign = "center";
            ctx.fillText(`${this.winner.shapeData.name} WINS!`, this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    gameLoop() {
        this.update();
        this.render();
        
        if (this.gameState === "fighting") {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    endGame(winner) {
        this.gameState = "ended";
        this.winner = winner;
        this.render();
    }

    // ============================================
    // BALANCE CHECK
    // ============================================
    getMatchupAdvantage(fighter1, fighter2) {
        const f1Counters = fighter1.shapeData.counters;
        const f1Weaknesses = fighter1.shapeData.weaknesses;
        
        if (f1Counters.includes(fighter2.shapeType)) {
            return "ADVANTAGE";
        } else if (f1Weaknesses.includes(fighter2.shapeType)) {
            return "DISADVANTAGE";
        } else {
            return "NEUTRAL";
        }
    }
}
