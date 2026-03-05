var BEASTS = {
    emberon: {
        id: 'emberon', name: 'Emberon', type: 'fire',
        baseStats: { hp: 45, atk: 52, def: 38, spd: 45 },
        baseXP: 64,
        defaultMoves: ['tackle', 'ember', 'growl'],
        learnableMoves: { 10: 'flameClaw', 18: 'inferno' },
        desc: 'A small flame lizard with a fiery tail.',
        colors: { primary: '#e74c3c', secondary: '#f39c12', accent: '#c0392b' }
    },
    tidalin: {
        id: 'tidalin', name: 'Tidalin', type: 'water',
        baseStats: { hp: 50, atk: 42, def: 50, spd: 38 },
        baseXP: 64,
        defaultMoves: ['tackle', 'splashJet', 'shellGuard'],
        learnableMoves: { 10: 'tidalWave', 18: 'hydroBlast' },
        desc: 'A sturdy water otter that loves to swim.',
        colors: { primary: '#3498db', secondary: '#2ecc71', accent: '#2980b9' }
    },
    thornleaf: {
        id: 'thornleaf', name: 'Thornleaf', type: 'grass',
        baseStats: { hp: 42, atk: 45, def: 42, spd: 52 },
        baseXP: 64,
        defaultMoves: ['tackle', 'vineLash', 'quickDash'],
        learnableMoves: { 10: 'razorLeaf', 18: 'solarBloom' },
        desc: 'A swift leaf fox that darts through forests.',
        colors: { primary: '#27ae60', secondary: '#f1c40f', accent: '#229954' }
    },
    sparkit: {
        id: 'sparkit', name: 'Sparkit', type: 'electric',
        baseStats: { hp: 38, atk: 48, def: 32, spd: 55 },
        baseXP: 52,
        defaultMoves: ['zap', 'tackle', 'quickDash'],
        learnableMoves: { 12: 'thunderSpark' },
        desc: 'A tiny spark mouse that crackles with energy.',
        colors: { primary: '#f1c40f', secondary: '#e67e22', accent: '#d4ac0d' }
    },
    pebblor: {
        id: 'pebblor', name: 'Pebblor', type: 'ground',
        baseStats: { hp: 52, atk: 45, def: 55, spd: 25 },
        baseXP: 56,
        defaultMoves: ['rockToss', 'tackle', 'harden'],
        learnableMoves: { 12: 'dig' },
        desc: 'A tough little rock creature.',
        colors: { primary: '#95a5a6', secondary: '#7f8c8d', accent: '#6c7a7a' }
    },
    breezlet: {
        id: 'breezlet', name: 'Breezlet', type: 'normal',
        baseStats: { hp: 35, atk: 40, def: 30, spd: 58 },
        baseXP: 44,
        defaultMoves: ['peck', 'gust', 'quickDash'],
        learnableMoves: {},
        desc: 'A quick little bird that rides the wind.',
        colors: { primary: '#85c1e9', secondary: '#f0e68c', accent: '#5dade2' }
    },
    flickerbug: {
        id: 'flickerbug', name: 'Flickerbug', type: 'fire',
        baseStats: { hp: 40, atk: 50, def: 28, spd: 50 },
        baseXP: 48,
        defaultMoves: ['ember', 'bugBite', 'flash'],
        learnableMoves: { 14: 'flameClaw' },
        desc: 'A glowing firefly that leaves trails of light.',
        colors: { primary: '#e67e22', secondary: '#f39c12', accent: '#ff6347' }
    },
    pudlop: {
        id: 'pudlop', name: 'Pudlop', type: 'water',
        baseStats: { hp: 55, atk: 38, def: 45, spd: 30 },
        baseXP: 52,
        defaultMoves: ['splashJet', 'tackle', 'mudSlap'],
        learnableMoves: { 14: 'tidalWave' },
        desc: 'A plump little frog that splashes happily.',
        colors: { primary: '#2ecc71', secondary: '#3498db', accent: '#1abc9c' }
    },
    vinewhip: {
        id: 'vinewhip', name: 'Vinewhip', type: 'grass',
        baseStats: { hp: 40, atk: 50, def: 40, spd: 48 },
        baseXP: 52,
        defaultMoves: ['vineLash', 'bite', 'coil'],
        learnableMoves: { 14: 'razorLeaf' },
        desc: 'A coiled vine snake with sharp thorns.',
        colors: { primary: '#2ecc71', secondary: '#8e44ad', accent: '#27ae60' }
    },
    dustmole: {
        id: 'dustmole', name: 'Dustmole', type: 'ground',
        baseStats: { hp: 48, atk: 52, def: 48, spd: 35 },
        baseXP: 56,
        defaultMoves: ['dig', 'scratch', 'sandVeil'],
        learnableMoves: {},
        desc: 'A burrowing mole that kicks up dust clouds.',
        colors: { primary: '#a0522d', secondary: '#deb887', accent: '#8b4513' }
    },
    zappfly: {
        id: 'zappfly', name: 'Zappfly', type: 'electric',
        baseStats: { hp: 35, atk: 55, def: 30, spd: 60 },
        baseXP: 60,
        defaultMoves: ['zap', 'buzz', 'thunderSpark'],
        learnableMoves: {},
        desc: 'An electric dragonfly that moves in a flash.',
        colors: { primary: '#f1c40f', secondary: '#00bcd4', accent: '#ff9800' }
    },
    shellbit: {
        id: 'shellbit', name: 'Shellbit', type: 'water',
        baseStats: { hp: 48, atk: 40, def: 58, spd: 28 },
        baseXP: 58,
        defaultMoves: ['splashJet', 'shellGuard', 'headbutt'],
        learnableMoves: { 15: 'tidalWave' },
        desc: 'A small turtle with an incredibly hard shell.',
        colors: { primary: '#1abc9c', secondary: '#2c3e50', accent: '#16a085' }
    }
};

// Encounter tables per location
var ENCOUNTERS = {
    route1: [
        { id: 'sparkit',    minLevel: 3, maxLevel: 5, weight: 25 },
        { id: 'pebblor',    minLevel: 3, maxLevel: 6, weight: 20 },
        { id: 'breezlet',   minLevel: 2, maxLevel: 4, weight: 30 },
        { id: 'flickerbug', minLevel: 4, maxLevel: 6, weight: 25 }
    ],
    worldMap: [
        { id: 'pudlop',   minLevel: 6,  maxLevel: 8,  weight: 20 },
        { id: 'vinewhip', minLevel: 6,  maxLevel: 9,  weight: 20 },
        { id: 'dustmole', minLevel: 7,  maxLevel: 9,  weight: 20 },
        { id: 'zappfly',  minLevel: 7,  maxLevel: 10, weight: 15 },
        { id: 'shellbit', minLevel: 8,  maxLevel: 10, weight: 15 },
        { id: 'sparkit',  minLevel: 6,  maxLevel: 8,  weight: 10 }
    ]
};

// Trainer definitions
var TRAINERS = {
    route1_trainer1: {
        name: 'Youngster Billy',
        dialog: ["Hey! You look like a new trainer!", "Let's battle!"],
        defeatDialog: ["Wow, you're strong!"],
        team: [
            { id: 'breezlet', level: 4, moves: ['peck', 'gust', 'quickDash'] },
            { id: 'pebblor', level: 5, moves: ['rockToss', 'tackle', 'harden'] }
        ]
    },
    route1_trainer2: {
        name: 'Lass Jenny',
        dialog: ["I've been training hard!", "Prepare yourself!"],
        defeatDialog: ["I need to train more..."],
        team: [
            { id: 'sparkit', level: 5, moves: ['zap', 'tackle', 'quickDash'] }
        ]
    },
    gymLeader: {
        name: 'Leader Marina',
        dialog: [
            "Welcome to the Tidepool Gym!",
            "I am Marina, master of Water-type beasts.",
            "Show me the bond between you and your beasts!"
        ],
        defeatDialog: [
            "Incredible! Your bond with your beasts is truly strong.",
            "You've earned the Tidepool Badge!",
            "This is just the beginning of your journey..."
        ],
        team: [
            { id: 'pudlop',  level: 12, moves: ['splashJet', 'mudSlap', 'tackle'] },
            { id: 'shellbit', level: 13, moves: ['splashJet', 'shellGuard', 'headbutt'] },
            { id: 'tidalin', level: 15, moves: ['splashJet', 'tidalWave', 'shellGuard', 'tackle'] }
        ]
    }
};
