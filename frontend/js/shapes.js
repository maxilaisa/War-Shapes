// SHAPE ARENA - Shape Definitions with Balance System

export const SHAPES = {
    CIRCLE: {
        name: "Circle",
        type: "Rolling Loop",
        counters: ["Triangle", "Square"],
        weaknesses: ["Star", "Heart"],
        neutral: ["Spiral"],
        description: "Wall bounce farming combos"
    },
    TRIANGLE: {
        name: "Triangle",
        type: "Edge Cut",
        counters: ["Square", "Spiral"],
        weaknesses: ["Circle", "Star"],
        neutral: ["Heart"],
        description: "Dash + angle + wall + re-hit chains"
    },
    SQUARE: {
        name: "Square",
        type: "Ground Lock",
        counters: ["Star", "Heart"],
        weaknesses: ["Triangle", "Circle"],
        neutral: ["Spiral"],
        description: "Trap between wall and body"
    },
    SPIRAL: {
        name: "Spiral",
        type: "Vortex Chain",
        counters: ["Circle", "Star"],
        weaknesses: ["Triangle", "Heart"],
        neutral: ["Square"],
        description: "Movement loop control combos"
    },
    STAR: {
        name: "Star",
        type: "Burst Link",
        counters: ["Heart", "Triangle"],
        weaknesses: ["Square", "Spiral"],
        neutral: ["Circle"],
        description: "Fast multi-hit spike combos"
    },
    HEART: {
        name: "Heart",
        type: "Survival Chain",
        counters: ["Spiral", "Circle"],
        weaknesses: ["Star", "Square"],
        neutral: ["Triangle"],
        description: "Defensive counter-based combos"
    }
};
