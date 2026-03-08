var BEASTS = {
    // ===== STARTERS =====
    emberon: {
        id: 'emberon', name: 'Emberon', type: 'fire',
        baseStats: { hp: 45, atk: 52, def: 38, spd: 45 },
        baseXP: 64,
        defaultMoves: ['tackle', 'ember', 'growl'],
        learnableMoves: { 10: 'flameClaw', 18: 'inferno' },
        evolvesAt: 16, evolvesTo: 'inferox',
        desc: 'A small flame lizard with a fiery tail.',
        colors: { primary: '#e74c3c', secondary: '#f39c12', accent: '#c0392b' }
    },
    inferox: {
        id: 'inferox', name: 'Inferox', type: 'fire', type2: 'ground',
        baseStats: { hp: 70, atk: 80, def: 60, spd: 68 },
        baseXP: 180,
        defaultMoves: ['flameClaw', 'lavaBurst', 'dig', 'ember'],
        learnableMoves: { 22: 'earthShatter', 28: 'inferno' },
        evolvesFrom: 'emberon',
        desc: 'A fearsome lava dragon that shakes the earth.',
        colors: { primary: '#922b21', secondary: '#e67e22', accent: '#641e16' }
    },
    tidalin: {
        id: 'tidalin', name: 'Tidalin', type: 'water',
        baseStats: { hp: 50, atk: 42, def: 50, spd: 38 },
        baseXP: 64,
        defaultMoves: ['tackle', 'splashJet', 'shellGuard'],
        learnableMoves: { 10: 'tidalWave', 18: 'hydroBlast' },
        evolvesAt: 16, evolvesTo: 'tsunotter',
        desc: 'A sturdy water otter that loves to swim.',
        colors: { primary: '#3498db', secondary: '#2ecc71', accent: '#2980b9' }
    },
    tsunotter: {
        id: 'tsunotter', name: 'Tsunotter', type: 'water', type2: 'normal',
        baseStats: { hp: 78, atk: 65, def: 75, spd: 58 },
        baseXP: 180,
        defaultMoves: ['tidalWave', 'aquaSlam', 'shellGuard', 'headbutt'],
        learnableMoves: { 22: 'hydroBlast', 28: 'bodyPress' },
        evolvesFrom: 'tidalin',
        desc: 'A powerful sea otter clad in natural armor.',
        colors: { primary: '#1a5276', secondary: '#1abc9c', accent: '#154360' }
    },
    thornleaf: {
        id: 'thornleaf', name: 'Thornleaf', type: 'grass',
        baseStats: { hp: 42, atk: 45, def: 42, spd: 52 },
        baseXP: 64,
        defaultMoves: ['tackle', 'vineLash', 'quickDash'],
        learnableMoves: { 10: 'razorLeaf', 18: 'solarBloom' },
        evolvesAt: 16, evolvesTo: 'briarvix',
        desc: 'A swift leaf fox that darts through forests.',
        colors: { primary: '#27ae60', secondary: '#f1c40f', accent: '#229954' }
    },
    briarvix: {
        id: 'briarvix', name: 'Briarvix', type: 'grass', type2: 'electric',
        baseStats: { hp: 65, atk: 70, def: 62, spd: 80 },
        baseXP: 180,
        defaultMoves: ['razorLeaf', 'thornStorm', 'thunderSpark', 'quickDash'],
        learnableMoves: { 22: 'solarBloom', 28: 'voltCrush' },
        evolvesFrom: 'thornleaf',
        desc: 'An electric forest guardian wreathed in thorns and sparks.',
        colors: { primary: '#1e8449', secondary: '#d4ac0d', accent: '#196f3d' }
    },

    // ===== ROUTE 1 BEASTS =====
    sparkit: {
        id: 'sparkit', name: 'Sparkit', type: 'electric',
        baseStats: { hp: 38, atk: 48, def: 32, spd: 55 },
        baseXP: 52,
        defaultMoves: ['zap', 'tackle', 'quickDash'],
        learnableMoves: { 12: 'thunderSpark' },
        evolvesAt: 15, evolvesTo: 'voltrode',
        desc: 'A tiny spark mouse that crackles with energy.',
        colors: { primary: '#f1c40f', secondary: '#e67e22', accent: '#d4ac0d' }
    },
    voltrode: {
        id: 'voltrode', name: 'Voltrode', type: 'electric', type2: 'fire',
        baseStats: { hp: 58, atk: 75, def: 50, spd: 82 },
        baseXP: 160,
        defaultMoves: ['thunderSpark', 'voltCrush', 'ember', 'quickDash'],
        learnableMoves: { 20: 'flameClaw', 25: 'stormSurge' },
        evolvesFrom: 'sparkit',
        desc: 'A blazing rodent crackling with fire and lightning.',
        colors: { primary: '#d4ac0d', secondary: '#e74c3c', accent: '#b7950b' }
    },
    pebblor: {
        id: 'pebblor', name: 'Pebblor', type: 'ground',
        baseStats: { hp: 52, atk: 45, def: 55, spd: 25 },
        baseXP: 56,
        defaultMoves: ['rockToss', 'tackle', 'harden'],
        learnableMoves: { 12: 'dig' },
        evolvesAt: 15, evolvesTo: 'bouldrake',
        desc: 'A tough little rock creature.',
        colors: { primary: '#95a5a6', secondary: '#7f8c8d', accent: '#6c7a7a' }
    },
    bouldrake: {
        id: 'bouldrake', name: 'Bouldrake', type: 'ground', type2: 'water',
        baseStats: { hp: 80, atk: 70, def: 82, spd: 38 },
        baseXP: 165,
        defaultMoves: ['dig', 'earthShatter', 'splashJet', 'harden'],
        learnableMoves: { 20: 'tidalWave', 25: 'bodyPress' },
        evolvesFrom: 'pebblor',
        desc: 'A massive boulder drake with river water flowing through its cracks.',
        colors: { primary: '#5d6d7e', secondary: '#2e86c1', accent: '#4a5568' }
    },
    breezlet: {
        id: 'breezlet', name: 'Breezlet', type: 'normal',
        baseStats: { hp: 35, atk: 40, def: 30, spd: 58 },
        baseXP: 44,
        defaultMoves: ['peck', 'gust', 'quickDash'],
        learnableMoves: {},
        evolvesAt: 12, evolvesTo: 'galewing',
        desc: 'A quick little bird that rides the wind.',
        colors: { primary: '#85c1e9', secondary: '#f0e68c', accent: '#5dade2' }
    },
    galewing: {
        id: 'galewing', name: 'Galewing', type: 'normal', type2: 'grass',
        baseStats: { hp: 55, atk: 62, def: 48, spd: 85 },
        baseXP: 145,
        defaultMoves: ['peck', 'gust', 'razorLeaf', 'quickDash'],
        learnableMoves: { 18: 'slam', 22: 'thornStorm' },
        evolvesFrom: 'breezlet',
        desc: 'A majestic wind bird with leaf-patterned wings.',
        colors: { primary: '#5dade2', secondary: '#27ae60', accent: '#2e86c1' }
    },
    flickerbug: {
        id: 'flickerbug', name: 'Flickerbug', type: 'fire',
        baseStats: { hp: 40, atk: 50, def: 28, spd: 50 },
        baseXP: 48,
        defaultMoves: ['ember', 'bugBite', 'flash'],
        learnableMoves: { 14: 'flameClaw' },
        evolvesAt: 15, evolvesTo: 'blazemoth',
        desc: 'A glowing firefly that leaves trails of light.',
        colors: { primary: '#e67e22', secondary: '#f39c12', accent: '#ff6347' }
    },
    blazemoth: {
        id: 'blazemoth', name: 'Blazemoth', type: 'fire', type2: 'electric',
        baseStats: { hp: 60, atk: 75, def: 45, spd: 78 },
        baseXP: 158,
        defaultMoves: ['flameClaw', 'zap', 'blazeWing', 'flash'],
        learnableMoves: { 20: 'thunderSpark', 25: 'inferno' },
        evolvesFrom: 'flickerbug',
        desc: 'A radiant moth with electrified flame wings.',
        colors: { primary: '#d35400', secondary: '#f1c40f', accent: '#e74c3c' }
    },
    seedpod: {
        id: 'seedpod', name: 'Seedpod', type: 'grass',
        baseStats: { hp: 45, atk: 35, def: 50, spd: 30 },
        baseXP: 38,
        defaultMoves: ['tackle', 'vineLash', 'harden'],
        learnableMoves: { 10: 'razorLeaf' },
        desc: 'A docile seed creature often found in meadows.',
        colors: { primary: '#58d68d', secondary: '#a0522d', accent: '#2ecc71' }
    },

    // ===== ROUTE 2 / FOREST BEASTS =====
    cinderpup: {
        id: 'cinderpup', name: 'Cinderpup', type: 'fire',
        baseStats: { hp: 45, atk: 50, def: 35, spd: 50 },
        baseXP: 55,
        defaultMoves: ['tackle', 'ember', 'bite'],
        learnableMoves: { 12: 'flameClaw', 15: 'quickDash' },
        evolvesAt: 16, evolvesTo: 'blazehound',
        desc: 'A playful fire puppy with smoldering paws.',
        colors: { primary: '#e74c3c', secondary: '#fdebd0', accent: '#922b21' }
    },
    blazehound: {
        id: 'blazehound', name: 'Blazehound', type: 'fire', type2: 'ground',
        baseStats: { hp: 72, atk: 78, def: 58, spd: 75 },
        baseXP: 175,
        defaultMoves: ['flameClaw', 'lavaBurst', 'bite', 'dig'],
        learnableMoves: { 22: 'earthShatter', 26: 'inferno' },
        evolvesFrom: 'cinderpup',
        desc: 'A fierce fire hound that leaves scorched earth in its wake.',
        colors: { primary: '#922b21', secondary: '#1c1c1c', accent: '#e67e22' }
    },
    frostfin: {
        id: 'frostfin', name: 'Frostfin', type: 'water',
        baseStats: { hp: 42, atk: 38, def: 48, spd: 45 },
        baseXP: 50,
        defaultMoves: ['splashJet', 'tackle', 'shellGuard'],
        learnableMoves: { 12: 'tidalWave' },
        evolvesAt: 16, evolvesTo: 'glacidon',
        desc: 'A shimmering fish with ice-crystal fins.',
        colors: { primary: '#85c1e9', secondary: '#d6eaf8', accent: '#2e86c1' }
    },
    glacidon: {
        id: 'glacidon', name: 'Glacidon', type: 'water', type2: 'electric',
        baseStats: { hp: 68, atk: 60, def: 72, spd: 70 },
        baseXP: 170,
        defaultMoves: ['tidalWave', 'zap', 'aquaSlam', 'shellGuard'],
        learnableMoves: { 22: 'stormSurge', 26: 'hydroBlast' },
        evolvesFrom: 'frostfin',
        desc: 'An armored aquatic beast that commands storms.',
        colors: { primary: '#2e86c1', secondary: '#d4efdf', accent: '#1b4f72' }
    },
    mossprout: {
        id: 'mossprout', name: 'Mossprout', type: 'grass',
        baseStats: { hp: 48, atk: 42, def: 45, spd: 38 },
        baseXP: 48,
        defaultMoves: ['tackle', 'vineLash', 'harden'],
        learnableMoves: { 10: 'razorLeaf' },
        evolvesAt: 14, evolvesTo: 'fungrowth',
        desc: 'A mossy sprout that grows on damp rocks.',
        colors: { primary: '#27ae60', secondary: '#6d4c41', accent: '#1e8449' }
    },
    fungrowth: {
        id: 'fungrowth', name: 'Fungrowth', type: 'grass', type2: 'ground',
        baseStats: { hp: 75, atk: 65, def: 70, spd: 52 },
        baseXP: 155,
        defaultMoves: ['razorLeaf', 'dig', 'toxicSpore', 'vineLash'],
        learnableMoves: { 20: 'thornStorm', 24: 'earthShatter' },
        evolvesFrom: 'mossprout',
        desc: 'A towering mushroom beast rooted deep in the earth.',
        colors: { primary: '#6d4c41', secondary: '#27ae60', accent: '#f39c12' }
    },
    shadowkit: {
        id: 'shadowkit', name: 'Shadowkit', type: 'normal',
        baseStats: { hp: 42, atk: 48, def: 38, spd: 55 },
        baseXP: 52,
        defaultMoves: ['scratch', 'bite', 'quickDash'],
        learnableMoves: { 12: 'slam' },
        evolvesAt: 16, evolvesTo: 'umbrawolf',
        desc: 'A sly shadow cat that hunts at dusk.',
        colors: { primary: '#5d6d7e', secondary: '#8e44ad', accent: '#2c3e50' }
    },
    umbrawolf: {
        id: 'umbrawolf', name: 'Umbrawolf', type: 'normal', type2: 'ground',
        baseStats: { hp: 68, atk: 75, def: 58, spd: 80 },
        baseXP: 172,
        defaultMoves: ['bite', 'dig', 'slam', 'quickDash'],
        learnableMoves: { 22: 'earthShatter', 26: 'bodyPress' },
        evolvesFrom: 'shadowkit',
        desc: 'A powerful shadow wolf that prowls the deep woods.',
        colors: { primary: '#2c3e50', secondary: '#8e44ad', accent: '#1a1a2e' }
    },

    // ===== MISTY WOODS / DEEPER BEASTS =====
    pudlop: {
        id: 'pudlop', name: 'Pudlop', type: 'water',
        baseStats: { hp: 55, atk: 38, def: 45, spd: 30 },
        baseXP: 52,
        defaultMoves: ['splashJet', 'tackle', 'mudSlap'],
        learnableMoves: { 14: 'tidalWave' },
        evolvesAt: 15, evolvesTo: 'toxitoad',
        desc: 'A plump little frog that splashes happily.',
        colors: { primary: '#2ecc71', secondary: '#3498db', accent: '#1abc9c' }
    },
    toxitoad: {
        id: 'toxitoad', name: 'Toxitoad', type: 'water', type2: 'grass',
        baseStats: { hp: 82, atk: 58, def: 68, spd: 48 },
        baseXP: 162,
        defaultMoves: ['tidalWave', 'vineLash', 'toxicSpore', 'mudSlap'],
        learnableMoves: { 20: 'hydroBlast', 24: 'thornStorm' },
        evolvesFrom: 'pudlop',
        desc: 'A massive toxic toad oozing with nature energy.',
        colors: { primary: '#1e8449', secondary: '#8e44ad', accent: '#117a65' }
    },
    vinewhip: {
        id: 'vinewhip', name: 'Vinewhip', type: 'grass',
        baseStats: { hp: 40, atk: 50, def: 40, spd: 48 },
        baseXP: 52,
        defaultMoves: ['vineLash', 'bite', 'coil'],
        learnableMoves: { 14: 'razorLeaf' },
        evolvesAt: 15, evolvesTo: 'thornboa',
        desc: 'A coiled vine snake with sharp thorns.',
        colors: { primary: '#2ecc71', secondary: '#8e44ad', accent: '#27ae60' }
    },
    thornboa: {
        id: 'thornboa', name: 'Thornboa', type: 'grass', type2: 'ground',
        baseStats: { hp: 62, atk: 78, def: 60, spd: 72 },
        baseXP: 165,
        defaultMoves: ['razorLeaf', 'dig', 'thornStorm', 'coil'],
        learnableMoves: { 20: 'solarBloom', 24: 'earthShatter' },
        evolvesFrom: 'vinewhip',
        desc: 'An enormous thorned serpent that burrows through rock.',
        colors: { primary: '#196f3d', secondary: '#6d4c41', accent: '#145a32' }
    },
    pyrobat: {
        id: 'pyrobat', name: 'Pyrobat', type: 'fire',
        baseStats: { hp: 38, atk: 52, def: 32, spd: 55 },
        baseXP: 54,
        defaultMoves: ['ember', 'gust', 'bite'],
        learnableMoves: { 12: 'flameClaw' },
        evolvesAt: 15, evolvesTo: 'infernowing',
        desc: 'A dark bat with smoldering wing tips.',
        colors: { primary: '#922b21', secondary: '#1c1c1c', accent: '#e67e22' }
    },
    infernowing: {
        id: 'infernowing', name: 'Infernowing', type: 'fire', type2: 'grass',
        baseStats: { hp: 60, atk: 78, def: 50, spd: 82 },
        baseXP: 172,
        defaultMoves: ['flameClaw', 'razorLeaf', 'blazeWing', 'gust'],
        learnableMoves: { 20: 'inferno', 24: 'thornStorm' },
        evolvesFrom: 'pyrobat',
        desc: 'A fearsome bat with burning leaf-blade wings.',
        colors: { primary: '#641e16', secondary: '#27ae60', accent: '#e74c3c' }
    },
    glimworm: {
        id: 'glimworm', name: 'Glimworm', type: 'electric',
        baseStats: { hp: 35, atk: 45, def: 30, spd: 52 },
        baseXP: 46,
        defaultMoves: ['zap', 'flash', 'tackle'],
        learnableMoves: { 12: 'thunderSpark' },
        evolvesAt: 15, evolvesTo: 'luminare',
        desc: 'A softly glowing worm found in dark forests.',
        colors: { primary: '#f7dc6f', secondary: '#82e0aa', accent: '#f4f6f7' }
    },
    luminare: {
        id: 'luminare', name: 'Luminare', type: 'electric', type2: 'normal',
        baseStats: { hp: 58, atk: 70, def: 50, spd: 80 },
        baseXP: 162,
        defaultMoves: ['thunderSpark', 'headbutt', 'voltCrush', 'flash'],
        learnableMoves: { 20: 'stormSurge', 24: 'bodyPress' },
        evolvesFrom: 'glimworm',
        desc: 'A radiant creature that illuminates the night.',
        colors: { primary: '#f4f6f7', secondary: '#f7dc6f', accent: '#d4ac0d' }
    },
    coralite: {
        id: 'coralite', name: 'Coralite', type: 'water',
        baseStats: { hp: 50, atk: 40, def: 55, spd: 28 },
        baseXP: 50,
        defaultMoves: ['splashJet', 'harden', 'tackle'],
        learnableMoves: { 12: 'tidalWave' },
        evolvesAt: 15, evolvesTo: 'reefguard',
        desc: 'A colorful coral creature from shallow waters.',
        colors: { primary: '#f1948a', secondary: '#f7f9f9', accent: '#e74c3c' }
    },
    reefguard: {
        id: 'reefguard', name: 'Reefguard', type: 'water', type2: 'ground',
        baseStats: { hp: 78, atk: 62, def: 82, spd: 42 },
        baseXP: 168,
        defaultMoves: ['tidalWave', 'rockToss', 'shellGuard', 'aquaSlam'],
        learnableMoves: { 20: 'hydroBlast', 24: 'earthShatter' },
        evolvesFrom: 'coralite',
        desc: 'A massive reef fortress that guards the coast.',
        colors: { primary: '#cb4335', secondary: '#1abc9c', accent: '#7f8c8d' }
    },

    // ===== MORE BEASTS =====
    dustmole: {
        id: 'dustmole', name: 'Dustmole', type: 'ground',
        baseStats: { hp: 48, atk: 52, def: 48, spd: 35 },
        baseXP: 56,
        defaultMoves: ['dig', 'scratch', 'sandVeil'],
        learnableMoves: {},
        evolvesAt: 15, evolvesTo: 'terraclaw',
        desc: 'A burrowing mole that kicks up dust clouds.',
        colors: { primary: '#a0522d', secondary: '#deb887', accent: '#8b4513' }
    },
    terraclaw: {
        id: 'terraclaw', name: 'Terraclaw', type: 'ground', type2: 'normal',
        baseStats: { hp: 72, atk: 78, def: 72, spd: 52 },
        baseXP: 168,
        defaultMoves: ['dig', 'earthShatter', 'headbutt', 'sandVeil'],
        learnableMoves: { 20: 'bodyPress', 24: 'slam' },
        evolvesFrom: 'dustmole',
        desc: 'A fearsome burrowing terror with massive claws.',
        colors: { primary: '#6d4c41', secondary: '#d7ccc8', accent: '#3e2723' }
    },
    zappfly: {
        id: 'zappfly', name: 'Zappfly', type: 'electric',
        baseStats: { hp: 35, atk: 55, def: 30, spd: 60 },
        baseXP: 60,
        defaultMoves: ['zap', 'buzz', 'thunderSpark'],
        learnableMoves: {},
        evolvesAt: 15, evolvesTo: 'stormwing',
        desc: 'An electric dragonfly that moves in a flash.',
        colors: { primary: '#f1c40f', secondary: '#00bcd4', accent: '#ff9800' }
    },
    stormwing: {
        id: 'stormwing', name: 'Stormwing', type: 'electric', type2: 'water',
        baseStats: { hp: 55, atk: 82, def: 48, spd: 88 },
        baseXP: 175,
        defaultMoves: ['thunderSpark', 'stormSurge', 'splashJet', 'buzz'],
        learnableMoves: { 20: 'voltCrush', 24: 'hydroBlast' },
        evolvesFrom: 'zappfly',
        desc: 'A massive storm dragonfly that commands rain and lightning.',
        colors: { primary: '#d4ac0d', secondary: '#2980b9', accent: '#f39c12' }
    },
    shellbit: {
        id: 'shellbit', name: 'Shellbit', type: 'water',
        baseStats: { hp: 48, atk: 40, def: 58, spd: 28 },
        baseXP: 58,
        defaultMoves: ['splashJet', 'shellGuard', 'headbutt'],
        learnableMoves: { 15: 'tidalWave' },
        evolvesAt: 15, evolvesTo: 'fortortus',
        desc: 'A small turtle with an incredibly hard shell.',
        colors: { primary: '#1abc9c', secondary: '#2c3e50', accent: '#16a085' }
    },
    fortortus: {
        id: 'fortortus', name: 'Fortortus', type: 'water', type2: 'ground',
        baseStats: { hp: 72, atk: 60, def: 85, spd: 42 },
        baseXP: 170,
        defaultMoves: ['tidalWave', 'rockToss', 'shellGuard', 'aquaSlam'],
        learnableMoves: { 20: 'hydroBlast', 24: 'earthShatter' },
        evolvesFrom: 'shellbit',
        desc: 'A fortress turtle with a stone-reinforced shell.',
        colors: { primary: '#117a65', secondary: '#5d6d7e', accent: '#0e6251' }
    },

    // ===== MOUNTAIN BEASTS =====
    pebblit: {
        id: 'pebblit', name: 'Pebblit', type: 'ground',
        baseStats: { hp: 40, atk: 48, def: 52, spd: 30 },
        baseXP: 50,
        defaultMoves: ['rockToss', 'tackle', 'harden'],
        learnableMoves: { 12: 'dig' },
        evolvesAt: 15, evolvesTo: 'geomite',
        desc: 'A tiny rock bug that skitters across stones.',
        colors: { primary: '#bdc3c7', secondary: '#95a5a6', accent: '#7f8c8d' }
    },
    geomite: {
        id: 'geomite', name: 'Geomite', type: 'ground', type2: 'electric',
        baseStats: { hp: 62, atk: 72, def: 78, spd: 48 },
        baseXP: 165,
        defaultMoves: ['dig', 'zap', 'earthShatter', 'rockToss'],
        learnableMoves: { 20: 'thunderSpark', 24: 'voltCrush' },
        evolvesFrom: 'pebblit',
        desc: 'A crystal-studded rock insect charged with geomagnetic energy.',
        colors: { primary: '#7f8c8d', secondary: '#f1c40f', accent: '#5d6d7e' }
    },
    crysteel: {
        id: 'crysteel', name: 'Crysteel', type: 'ground', type2: 'electric',
        baseStats: { hp: 65, atk: 72, def: 70, spd: 60 },
        baseXP: 180,
        defaultMoves: ['rockToss', 'zap', 'thunderSpark', 'earthShatter'],
        learnableMoves: { 18: 'voltCrush', 22: 'stormSurge' },
        desc: 'A rare crystalline beast found only on mountain summits.',
        colors: { primary: '#d5d8dc', secondary: '#5dade2', accent: '#aeb6bf' }
    },
    // ===== THREE-STAGE EVOLUTION CHAINS =====
    // Electric chain: Zaplet → Boltara → Thundrix
    zaplet: {
        id: 'zaplet', name: 'Zaplet', type: 'electric',
        baseStats: { hp: 40, atk: 48, def: 35, spd: 55 },
        baseXP: 52,
        defaultMoves: ['zap', 'tackle', 'quickDash'],
        learnableMoves: { 8: 'thunderSpark', 12: 'headbutt' },
        evolvesAt: 14, evolvesTo: 'boltara',
        desc: 'A tiny sparkling critter that crackles with static.',
        colors: { primary: '#f9e74a', secondary: '#ff9800', accent: '#fff176' }
    },
    boltara: {
        id: 'boltara', name: 'Boltara', type: 'electric',
        baseStats: { hp: 58, atk: 68, def: 52, spd: 72 },
        baseXP: 130,
        defaultMoves: ['thunderSpark', 'zap', 'quickDash', 'headbutt'],
        learnableMoves: { 20: 'voltCrush', 26: 'slam' },
        evolvesAt: 30, evolvesTo: 'thundrix',
        evolvesFrom: 'zaplet',
        desc: 'An agile electric beast wrapped in crackling arcs.',
        colors: { primary: '#fbc02d', secondary: '#ff6f00', accent: '#f57f17' }
    },
    thundrix: {
        id: 'thundrix', name: 'Thundrix', type: 'electric', type2: 'normal',
        baseStats: { hp: 85, atk: 95, def: 75, spd: 100 },
        baseXP: 210,
        defaultMoves: ['voltCrush', 'stormSurge', 'slam', 'quickDash'],
        learnableMoves: { 36: 'bodyPress', 42: 'thunderSpark' },
        evolvesFrom: 'boltara',
        desc: 'A thunderous titan whose strikes split the sky.',
        colors: { primary: '#f57f17', secondary: '#1a1a2e', accent: '#ffeb3b' }
    },

    // Water chain: Drople → Torrental → Abyssurge
    drople: {
        id: 'drople', name: 'Drople', type: 'water',
        baseStats: { hp: 48, atk: 40, def: 45, spd: 42 },
        baseXP: 50,
        defaultMoves: ['splashJet', 'tackle', 'shellGuard'],
        learnableMoves: { 8: 'tidalWave', 12: 'mudSlap' },
        evolvesAt: 14, evolvesTo: 'torrental',
        desc: 'A cheerful water droplet beast that bounces along streams.',
        colors: { primary: '#4fc3f7', secondary: '#b3e5fc', accent: '#0288d1' }
    },
    torrental: {
        id: 'torrental', name: 'Torrental', type: 'water',
        baseStats: { hp: 68, atk: 60, def: 65, spd: 58 },
        baseXP: 135,
        defaultMoves: ['tidalWave', 'splashJet', 'mudSlap', 'shellGuard'],
        learnableMoves: { 20: 'aquaSlam', 26: 'dig' },
        evolvesAt: 30, evolvesTo: 'abyssurge',
        evolvesFrom: 'drople',
        desc: 'A surging water beast that commands rushing currents.',
        colors: { primary: '#0288d1', secondary: '#80deea', accent: '#01579b' }
    },
    abyssurge: {
        id: 'abyssurge', name: 'Abyssurge', type: 'water', type2: 'ground',
        baseStats: { hp: 95, atk: 88, def: 90, spd: 72 },
        baseXP: 215,
        defaultMoves: ['hydroBlast', 'aquaSlam', 'earthShatter', 'shellGuard'],
        learnableMoves: { 36: 'dig', 42: 'bodyPress' },
        evolvesFrom: 'torrental',
        desc: 'An abyssal leviathan that reshapes coastlines with each step.',
        colors: { primary: '#01579b', secondary: '#004d40', accent: '#0d47a1' }
    },

    // Grass chain: Sproutik → Thornox → Floratitan
    sproutik: {
        id: 'sproutik', name: 'Sproutik', type: 'grass',
        baseStats: { hp: 45, atk: 42, def: 48, spd: 40 },
        baseXP: 50,
        defaultMoves: ['vineLash', 'tackle', 'harden'],
        learnableMoves: { 8: 'razorLeaf', 12: 'rockToss' },
        evolvesAt: 14, evolvesTo: 'thornox',
        desc: 'A tiny seedling with stubby legs and bright leaves.',
        colors: { primary: '#66bb6a', secondary: '#a5d6a7', accent: '#2e7d32' }
    },
    thornox: {
        id: 'thornox', name: 'Thornox', type: 'grass', type2: 'ground',
        baseStats: { hp: 65, atk: 62, def: 70, spd: 55 },
        baseXP: 130,
        defaultMoves: ['razorLeaf', 'vineLash', 'rockToss', 'harden'],
        learnableMoves: { 20: 'thornStorm', 26: 'dig' },
        evolvesAt: 30, evolvesTo: 'floratitan',
        evolvesFrom: 'sproutik',
        desc: 'A thorny plant beast with roots that crack stone.',
        colors: { primary: '#2e7d32', secondary: '#8d6e63', accent: '#1b5e20' }
    },
    floratitan: {
        id: 'floratitan', name: 'Floratitan', type: 'grass', type2: 'ground',
        baseStats: { hp: 100, atk: 85, def: 95, spd: 65 },
        baseXP: 220,
        defaultMoves: ['solarBloom', 'thornStorm', 'earthShatter', 'harden'],
        learnableMoves: { 36: 'bodyPress', 42: 'dig' },
        evolvesFrom: 'thornox',
        desc: 'An ancient forest titan wreathed in vines and boulders.',
        colors: { primary: '#1b5e20', secondary: '#4e342e', accent: '#33691e' }
    },

    anthropobeast: {
        id: 'anthropobeast', name: 'Anthropobeast', type: 'water', type2: 'fire',
        baseStats: { hp: 120, atk: 120, def: 120, spd: 120 },
        baseXP: 255,
        defaultMoves: ['opus', 'sonnet', 'haiku', 'hydroBlast'],
        learnableMoves: {},
        desc: 'A mysterious humanoid beast with curly brown hair. Legends say it thinks deeply about everything.',
        colors: { primary: '#8B6914', secondary: '#F5DEB3', accent: '#4a3000' }
    }
};

// Encounter tables per location
var ENCOUNTERS = {
    route1: [
        { id: 'sparkit',    minLevel: 3, maxLevel: 5, weight: 25 },
        { id: 'pebblor',    minLevel: 3, maxLevel: 6, weight: 20 },
        { id: 'breezlet',   minLevel: 2, maxLevel: 4, weight: 30 },
        { id: 'flickerbug', minLevel: 4, maxLevel: 6, weight: 15 },
        { id: 'seedpod',    minLevel: 2, maxLevel: 4, weight: 10 }
    ],
    route2: [
        { id: 'cinderpup',  minLevel: 6, maxLevel: 8, weight: 20 },
        { id: 'frostfin',   minLevel: 6, maxLevel: 8, weight: 20 },
        { id: 'mossprout',  minLevel: 5, maxLevel: 7, weight: 20 },
        { id: 'shadowkit',  minLevel: 7, maxLevel: 9, weight: 15 },
        { id: 'breezlet',   minLevel: 5, maxLevel: 7, weight: 15 },
        { id: 'seedpod',    minLevel: 5, maxLevel: 7, weight: 10 }
    ],
    mistyWoods: [
        { id: 'pyrobat',    minLevel: 9, maxLevel: 11, weight: 16 },
        { id: 'glimworm',   minLevel: 8, maxLevel: 10, weight: 16 },
        { id: 'coralite',   minLevel: 9, maxLevel: 11, weight: 14 },
        { id: 'shadowkit',  minLevel: 10, maxLevel: 12, weight: 12 },
        { id: 'vinewhip',   minLevel: 8, maxLevel: 10, weight: 14 },
        { id: 'pudlop',     minLevel: 8, maxLevel: 10, weight: 16 },
        { id: 'sproutik',   minLevel: 8, maxLevel: 10, weight: 12 }
    ],
    mountainPath: [
        { id: 'pebblit',    minLevel: 10, maxLevel: 13, weight: 30 },
        { id: 'dustmole',   minLevel: 11, maxLevel: 14, weight: 25 },
        { id: 'pebblor',    minLevel: 10, maxLevel: 12, weight: 25 },
        { id: 'crysteel',   minLevel: 12, maxLevel: 15, weight: 8 },
        { id: 'glimworm',   minLevel: 10, maxLevel: 13, weight: 12 }
    ],
    route3: [
        { id: 'cinderpup',  minLevel: 10, maxLevel: 12, weight: 14 },
        { id: 'frostfin',   minLevel: 10, maxLevel: 12, weight: 14 },
        { id: 'zappfly',    minLevel: 11, maxLevel: 13, weight: 14 },
        { id: 'shellbit',   minLevel: 10, maxLevel: 12, weight: 12 },
        { id: 'pudlop',     minLevel: 10, maxLevel: 12, weight: 12 },
        { id: 'dustmole',   minLevel: 10, maxLevel: 13, weight: 10 },
        { id: 'pyrobat',    minLevel: 11, maxLevel: 13, weight: 10 },
        { id: 'drople',     minLevel: 10, maxLevel: 12, weight: 14 }
    ],
    route4: [
        { id: 'zappfly',    minLevel: 13, maxLevel: 16, weight: 16 },
        { id: 'sparkit',    minLevel: 13, maxLevel: 15, weight: 12 },
        { id: 'glimworm',   minLevel: 14, maxLevel: 16, weight: 14 },
        { id: 'dustmole',   minLevel: 13, maxLevel: 16, weight: 12 },
        { id: 'cinderpup',  minLevel: 14, maxLevel: 16, weight: 12 },
        { id: 'shellbit',   minLevel: 13, maxLevel: 15, weight: 12 },
        { id: 'zaplet',     minLevel: 13, maxLevel: 16, weight: 14 },
        { id: 'drople',     minLevel: 13, maxLevel: 15, weight: 8 }
    ],
    // Keep worldMap for backwards compat with old saves
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
    route2_trainer1: {
        name: 'Hiker Marcus',
        dialog: ["The forest trails toughen you up!", "Let me test your mettle!"],
        defeatDialog: ["Ha! You've got the spirit of an adventurer!"],
        team: [
            { id: 'cinderpup', level: 8, moves: ['ember', 'tackle', 'bite'] },
            { id: 'mossprout', level: 7, moves: ['vineLash', 'tackle', 'harden'] }
        ]
    },
    route2_trainer2: {
        name: 'Bug Catcher Wes',
        dialog: ["My beasts are tougher than they look!"],
        defeatDialog: ["Aw man, back to catching bugs..."],
        team: [
            { id: 'flickerbug', level: 8, moves: ['ember', 'bugBite', 'flash'] },
            { id: 'seedpod', level: 7, moves: ['vineLash', 'tackle', 'harden'] },
            { id: 'breezlet', level: 8, moves: ['peck', 'gust', 'quickDash'] }
        ]
    },
    mistyWoods_trainer1: {
        name: 'Ranger Faye',
        dialog: ["These woods are my domain.", "Think you can handle the mist?"],
        defeatDialog: ["The mist parts for the worthy..."],
        team: [
            { id: 'shadowkit', level: 11, moves: ['scratch', 'bite', 'quickDash'] },
            { id: 'pyrobat', level: 11, moves: ['ember', 'gust', 'bite'] },
            { id: 'glimworm', level: 12, moves: ['zap', 'flash', 'tackle'] }
        ]
    },
    route3_trainer1: {
        name: 'Ace Trainer Kai',
        dialog: ["I train near the gym to stay sharp.", "Show me what you've got!"],
        defeatDialog: ["Not bad! You might give Marina trouble."],
        team: [
            { id: 'cinderpup', level: 12, moves: ['ember', 'flameClaw', 'bite', 'quickDash'] },
            { id: 'frostfin', level: 12, moves: ['splashJet', 'tidalWave', 'shellGuard'] },
            { id: 'dustmole', level: 13, moves: ['dig', 'scratch', 'sandVeil'] }
        ]
    },
    route3_trainer2: {
        name: 'Swimmer Lana',
        dialog: ["I love water-type beasts!", "Let's make a splash!"],
        defeatDialog: ["You're making waves!"],
        team: [
            { id: 'coralite', level: 12, moves: ['splashJet', 'harden', 'tackle'] },
            { id: 'shellbit', level: 13, moves: ['splashJet', 'shellGuard', 'headbutt'] }
        ]
    },
    // Tidepool Gym members
    gymCityGym_trainer1: {
        name: 'Swimmer Coral',
        dialog: ["The gym leader awaits beyond us!", "But first you'll have to get past me!"],
        defeatDialog: ["You're strong enough... maybe you can beat Marina!"],
        team: [
            { id: 'coralite', level: 12, moves: ['splashJet', 'harden', 'tackle'] },
            { id: 'frostfin', level: 12, moves: ['splashJet', 'shellGuard', 'tackle'] }
        ]
    },
    gymCityGym_trainer2: {
        name: 'Sailor Reed',
        dialog: ["Marina taught me everything I know!", "Let's see what you've got!"],
        defeatDialog: ["Wow, you might actually challenge Marina!"],
        team: [
            { id: 'shellbit', level: 13, moves: ['splashJet', 'shellGuard', 'headbutt'] },
            { id: 'pudlop',   level: 13, moves: ['splashJet', 'mudSlap', 'tackle'] }
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
            { id: 'pudlop',   level: 14, moves: ['splashJet', 'mudSlap', 'tackle', 'tidalWave'] },
            { id: 'coralite', level: 14, moves: ['splashJet', 'harden', 'tidalWave', 'headbutt'] },
            { id: 'shellbit', level: 15, moves: ['splashJet', 'shellGuard', 'headbutt', 'tidalWave'] },
            { id: 'tidalin',  level: 17, moves: ['splashJet', 'tidalWave', 'shellGuard', 'aquaSlam'] }
        ]
    },
    // Route 4 trainers
    route4_trainer1: {
        name: 'Electrician Watts',
        dialog: ["I keep the power lines running.", "My beasts keep me charged up!"],
        defeatDialog: ["Looks like I'm out of juice..."],
        team: [
            { id: 'sparkit', level: 15, moves: ['zap', 'thunderSpark', 'tackle', 'quickDash'] },
            { id: 'glimworm', level: 15, moves: ['zap', 'thunderSpark', 'flash'] },
            { id: 'zappfly', level: 16, moves: ['zap', 'thunderSpark', 'buzz'] }
        ]
    },
    route4_trainer2: {
        name: 'Ranger Storm',
        dialog: ["Thunder Pass is dangerous!", "Only the strong survive here!"],
        defeatDialog: ["The pass bows to the strong..."],
        team: [
            { id: 'dustmole', level: 15, moves: ['dig', 'scratch', 'sandVeil'] },
            { id: 'cinderpup', level: 16, moves: ['ember', 'flameClaw', 'bite', 'quickDash'] }
        ]
    },
    // Stormridge Gym members
    stormridgeGym_trainer1: {
        name: 'Technician Spark',
        dialog: ["Leader Volt's power is legendary!", "But you have to beat us first!"],
        defeatDialog: ["Shocking... you're really strong!"],
        team: [
            { id: 'sparkit', level: 16, moves: ['zap', 'thunderSpark', 'tackle', 'quickDash'] },
            { id: 'zappfly', level: 17, moves: ['zap', 'thunderSpark', 'buzz'] }
        ]
    },
    stormridgeGym_trainer2: {
        name: 'Engineer Amp',
        dialog: ["Our gym runs on pure electricity!", "Can you handle the voltage?"],
        defeatDialog: ["You've got more power than I thought!"],
        team: [
            { id: 'glimworm', level: 17, moves: ['zap', 'thunderSpark', 'flash', 'tackle'] },
            { id: 'sparkit',  level: 17, moves: ['zap', 'thunderSpark', 'quickDash', 'tackle'] }
        ]
    },
    gymLeader2: {
        name: 'Leader Volt',
        dialog: [
            "Welcome to the Stormridge Gym!",
            "I am Volt, the Lightning Master!",
            "Feel the shock of my electric beasts!"
        ],
        defeatDialog: [
            "Thunderous! You've weathered my storm!",
            "You've earned the Stormridge Badge!",
            "Your journey continues... stronger than ever!"
        ],
        team: [
            { id: 'sparkit',  level: 18, moves: ['thunderSpark', 'zap', 'quickDash', 'tackle'] },
            { id: 'zappfly',  level: 18, moves: ['thunderSpark', 'buzz', 'zap', 'quickDash'] },
            { id: 'glimworm', level: 19, moves: ['thunderSpark', 'voltCrush', 'flash', 'zap'] },
            { id: 'voltrode', level: 21, moves: ['voltCrush', 'stormSurge', 'flameClaw', 'quickDash'] }
        ]
    }
};
