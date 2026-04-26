// SHAPE ARENA - Physics Engine

export class PhysicsEngine {
    constructor() {
        this.gravity = 0.5;
        this.friction = 0.98;
        this.wallBounceFactor = 0.7;
    }

    calculateKnockback(attacker, defender, angle, wallInteraction = false) {
        const speed = attacker.velocity.length();
        const momentum = speed * attacker.mass;
        
        let knockback = momentum * 0.1;
        
        if (wallInteraction) {
            knockback *= 1.5; // Wall increases knockback
        }
        
        return {
            x: Math.cos(angle) * knockback,
            y: Math.sin(angle) * knockback
        };
    }

    applyWallInteraction(position, velocity, bounds) {
        let wallHit = false;
        let wallNormal = null;
        
        // Check left/right walls
        if (position.x <= bounds.left) {
            position.x = bounds.left;
            velocity.x *= -this.wallBounceFactor;
            wallHit = true;
            wallNormal = { x: 1, y: 0 };
        } else if (position.x >= bounds.right) {
            position.x = bounds.right;
            velocity.x *= -this.wallBounceFactor;
            wallHit = true;
            wallNormal = { x: -1, y: 0 };
        }
        
        // Check top/bottom walls
        if (position.y <= bounds.top) {
            position.y = bounds.top;
            velocity.y *= -this.wallBounceFactor;
            wallHit = true;
            wallNormal = { x: 0, y: 1 };
        } else if (position.y >= bounds.bottom) {
            position.y = bounds.bottom;
            velocity.y *= -this.wallBounceFactor;
            wallHit = true;
            wallNormal = { x: 0, y: -1 };
        }
        
        return { wallHit, wallNormal };
    }
}
