// SHAPE ARENA - Configuration Constants

export const CONFIG = {
    MAX_HP: 100,
    COMBO_TIMEOUT: 2500, // 2.5 seconds
    ULTIMATE_THRESHOLD: 10,
    COOLDOWNS: {
        LIGHT: { min: 3000, max: 5000 },
        MEDIUM: { min: 6000, max: 9000 },
        HEAVY: { min: 10000, max: 14000 }
    },
    ULTIMATE_CHARGE_VALUES: {
        LIGHT_HIT: 1,
        CLEAN_HIT: 2,
        WALL_HIT: 3,
        COUNTER_HIT: 4
    },
    COMBO_GAIN_VALUES: {
        BODY_HIT: 1,
        WALL_BOUNCE: 2,
        AIR_HIT: 2,
        COUNTER_HIT: 3
    },
    COMBO_TIERS: {
        LIGHT_CHAIN: { min: 1, max: 3, name: "Light Chain" },
        MOMENTUM_CHAIN: { min: 4, max: 6, name: "Momentum Chain" },
        IMPACT_CHAIN: { min: 7, max: 9, name: "Impact Chain" },
        OVERDRIVE_CHAIN: { min: 10, max: Infinity, name: "Overdrive Chain" }
    }
};
