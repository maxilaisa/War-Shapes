// SHAPE ARENA - Ability System

export class Ability {
    constructor(name, type, cooldown) {
        this.name = name;
        this.type = type; // LIGHT, MEDIUM, HEAVY
        this.cooldown = cooldown;
        this.lastUsed = 0;
    }

    canUse() {
        return Date.now() - this.lastUsed >= this.cooldown;
    }

    use() {
        this.lastUsed = Date.now();
    }

    getRemainingCooldown() {
        const elapsed = Date.now() - this.lastUsed;
        return Math.max(0, this.cooldown - elapsed);
    }
}
