// SHAPE ARENA - Fighter Class

import { CONFIG } from './config.js';
import { SHAPES } from './shapes.js';
import { Ability } from './ability.js';

export class Fighter {
    constructor(shapeType, startX, startY) {
        this.shapeType = shapeType;
        this.shapeData = SHAPES[shapeType];
        
        // Core stats
        this.hp = CONFIG.MAX_HP;
        this.maxHp = CONFIG.MAX_HP;
        this.mass = 1;
        
        // Position and movement
        this.position = { x: startX, y: startY };
        this.velocity = { x: 0, y: 0 };
        this.isGrounded = false;
        
        // Combat state
        this.isDodging = false;
        this.isAttacking = false;
        this.facing = 1; // 1 = right, -1 = left
        
        // Ultimate system
        this.ultimateCharge = 0;
        this.ultimateReady = false;
        this.ultimateActive = false;
        
        // Combo system
        this.comboCount = 0;
        this.comboTimer = null;
        this.comboTier = null;
        this.lastHitTime = 0;
        
        // Abilities
        this.abilities = [];
        this.rangedAttacks = [];
        
        // Initialize abilities based on shape
        this.initAbilities();
    }

    initAbilities() {
        // Each shape gets 3 abilities (light, medium, heavy)
        const lightCooldown = this.randomCooldown(CONFIG.COOLDOWNS.LIGHT);
        const mediumCooldown = this.randomCooldown(CONFIG.COOLDOWNS.MEDIUM);
        const heavyCooldown = this.randomCooldown(CONFIG.COOLDOWNS.HEAVY);
        
        this.abilities = [
            new Ability(`${this.shapeData.type} Light`, "LIGHT", lightCooldown),
            new Ability(`${this.shapeData.type} Medium`, "MEDIUM", mediumCooldown),
            new Ability(`${this.shapeData.type} Heavy`, "HEAVY", heavyCooldown)
        ];
    }

    randomCooldown(range) {
        return Math.floor(Math.random() * (range.max - range.min) + range.min);
    }

    takeDamage(amount, knockback) {
        this.hp = Math.max(0, this.hp - amount);
        
        if (knockback) {
            this.velocity.x += knockback.x;
            this.velocity.y += knockback.y;
        }
        
        return this.hp <= 0;
    }

    // ============================================
    // ULTIMATE SYSTEM
    // ============================================
    addUltimateCharge(type) {
        const chargeValue = CONFIG.ULTIMATE_CHARGE_VALUES[type];
        this.ultimateCharge += chargeValue;
        
        if (this.ultimateCharge >= CONFIG.ULTIMATE_THRESHOLD) {
            this.ultimateReady = true;
            this.ultimateCharge = CONFIG.ULTIMATE_THRESHOLD;
        }
    }

    activateUltimate() {
        if (this.ultimateReady && !this.ultimateActive) {
            this.ultimateActive = true;
            this.ultimateReady = false;
            this.ultimateCharge = 0;
            return true;
        }
        return false;
    }

    deactivateUltimate() {
        this.ultimateActive = false;
    }

    // ============================================
    // COMBO SYSTEM
    // ============================================
    startCombo() {
        this.comboCount = 1;
        this.lastHitTime = Date.now();
        this.updateComboTier();
        this.resetComboTimer();
    }

    extendCombo(gainType) {
        const now = Date.now();
        if (now - this.lastHitTime <= CONFIG.COMBO_TIMEOUT) {
            this.comboCount += CONFIG.COMBO_GAIN_VALUES[gainType];
            this.lastHitTime = now;
            this.updateComboTier();
            this.resetComboTimer();
            
            // Ultimate charge from combo (every 2 hits = +1)
            if (this.comboCount % 2 === 0) {
                this.addUltimateCharge("CLEAN_HIT");
            }
        } else {
            this.breakCombo();
            this.startCombo();
        }
    }

    breakCombo() {
        this.comboCount = 0;
        this.comboTier = null;
        if (this.comboTimer) {
            clearTimeout(this.comboTimer);
            this.comboTimer = null;
        }
    }

    resetComboTimer() {
        if (this.comboTimer) {
            clearTimeout(this.comboTimer);
        }
        this.comboTimer = setTimeout(() => {
            this.breakCombo();
        }, CONFIG.COMBO_TIMEOUT);
    }

    updateComboTier() {
        for (const [key, tier] of Object.entries(CONFIG.COMBO_TIERS)) {
            if (this.comboCount >= tier.min && this.comboCount <= tier.max) {
                this.comboTier = key;
                return;
            }
        }
    }

    getComboMultiplier() {
        if (!this.comboTier) return 1;
        
        switch (this.comboTier) {
            case "LIGHT_CHAIN":
                return 1;
            case "MOMENTUM_CHAIN":
                return 1.2; // Better control
            case "IMPACT_CHAIN":
                return 1.5; // Stronger knockback
            case "OVERDRIVE_CHAIN":
                return 2; // Enhanced everything
            default:
                return 1;
        }
    }

    // ============================================
    // RANGED ATTACK SYSTEM
    // ============================================
    fireRangedAttack(targetPosition) {
        // Ranged attacks don't damage, only affect movement
        const attack = {
            position: { ...this.position },
            velocity: {
                x: (targetPosition.x - this.position.x) * 0.1,
                y: (targetPosition.y - this.position.y) * 0.1
            },
            owner: this,
            damage: 0, // Ranged attacks do NOT damage
            knockback: { x: 2, y: 1 } // Small movement effect
        };
        
        this.rangedAttacks.push(attack);
        return attack;
    }

    // ============================================
    // MOVEMENT
    // ============================================
    move(dx, dy) {
        const multiplier = this.ultimateActive ? 1.5 : 1;
        this.velocity.x += dx * multiplier;
        this.velocity.y += dy * multiplier;
    }

    updatePhysics(bounds, physicsEngine) {
        // Apply gravity
        this.velocity.y += physicsEngine.gravity;
        
        // Apply friction
        this.velocity.x *= physicsEngine.friction;
        this.velocity.y *= physicsEngine.friction;
        
        // Update position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        // Wall interaction
        const wallResult = physicsEngine.applyWallInteraction(
            this.position, 
            this.velocity, 
            bounds
        );
        
        // Check grounded
        this.isGrounded = this.position.y >= bounds.bottom - 5;
        
        return wallResult;
    }

    isOutOfBounds(bounds) {
        return (
            this.position.x < bounds.left - 50 ||
            this.position.x > bounds.right + 50 ||
            this.position.y < bounds.top - 50 ||
            this.position.y > bounds.bottom + 50
        );
    }
}
