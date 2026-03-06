var MOVES = {
    // Basic normal moves
    tackle:       { name: 'Tackle',       type: 'normal',   power: 40, accuracy: 100, pp: 35, effect: null },
    peck:         { name: 'Peck',         type: 'normal',   power: 35, accuracy: 100, pp: 35, effect: null },
    bugBite:      { name: 'Bug Bite',     type: 'normal',   power: 40, accuracy: 100, pp: 25, effect: null },
    bite:         { name: 'Bite',         type: 'normal',   power: 50, accuracy: 100, pp: 20, effect: null },
    scratch:      { name: 'Scratch',      type: 'normal',   power: 40, accuracy: 100, pp: 35, effect: null },
    headbutt:     { name: 'Headbutt',     type: 'normal',   power: 55, accuracy: 95,  pp: 20, effect: null },
    gust:         { name: 'Gust',         type: 'normal',   power: 40, accuracy: 100, pp: 30, effect: null },
    buzz:         { name: 'Buzz',         type: 'normal',   power: 45, accuracy: 100, pp: 25, effect: null },
    slam:         { name: 'Slam',         type: 'normal',   power: 65, accuracy: 90,  pp: 15, effect: null },
    bodyPress:    { name: 'Body Press',   type: 'normal',   power: 70, accuracy: 95,  pp: 10, effect: null },

    // Fire moves
    ember:        { name: 'Ember',        type: 'fire',     power: 45, accuracy: 100, pp: 25, effect: null },
    flameClaw:    { name: 'Flame Claw',   type: 'fire',     power: 65, accuracy: 95,  pp: 15, effect: null },
    inferno:      { name: 'Inferno',      type: 'fire',     power: 85, accuracy: 85,  pp: 5,  effect: null },
    lavaBurst:    { name: 'Lava Burst',   type: 'fire',     power: 75, accuracy: 90,  pp: 10, effect: null },
    blazeWing:    { name: 'Blaze Wing',   type: 'fire',     power: 70, accuracy: 95,  pp: 15, effect: null },

    // Water moves
    splashJet:    { name: 'Splash Jet',   type: 'water',    power: 45, accuracy: 100, pp: 25, effect: null },
    tidalWave:    { name: 'Tidal Wave',   type: 'water',    power: 65, accuracy: 95,  pp: 15, effect: null },
    hydroBlast:   { name: 'Hydro Blast',  type: 'water',    power: 85, accuracy: 85,  pp: 5,  effect: null },
    aquaSlam:     { name: 'Aqua Slam',    type: 'water',    power: 75, accuracy: 90,  pp: 10, effect: null },

    // Grass moves
    vineLash:     { name: 'Vine Lash',    type: 'grass',    power: 45, accuracy: 100, pp: 25, effect: null },
    razorLeaf:    { name: 'Razor Leaf',   type: 'grass',    power: 65, accuracy: 95,  pp: 15, effect: null },
    solarBloom:   { name: 'Solar Bloom',  type: 'grass',    power: 85, accuracy: 85,  pp: 5,  effect: null },
    thornStorm:   { name: 'Thorn Storm',  type: 'grass',    power: 75, accuracy: 90,  pp: 10, effect: null },

    // Electric moves
    zap:          { name: 'Zap',          type: 'electric', power: 45, accuracy: 100, pp: 25, effect: null },
    thunderSpark: { name: 'Thunder Spark',type: 'electric', power: 60, accuracy: 90,  pp: 15, effect: null },
    voltCrush:    { name: 'Volt Crush',   type: 'electric', power: 75, accuracy: 90,  pp: 10, effect: null },
    stormSurge:   { name: 'Storm Surge',  type: 'electric', power: 80, accuracy: 85,  pp: 5,  effect: null },

    // Ground moves
    rockToss:     { name: 'Rock Toss',    type: 'ground',   power: 50, accuracy: 90,  pp: 15, effect: null },
    mudSlap:      { name: 'Mud Slap',     type: 'ground',   power: 35, accuracy: 100, pp: 20, effect: null },
    dig:          { name: 'Dig',          type: 'ground',   power: 60, accuracy: 100, pp: 10, effect: null },
    earthShatter: { name: 'Earth Shatter',type: 'ground',   power: 75, accuracy: 85,  pp: 10, effect: null },

    // Status moves
    growl:      { name: 'Growl',       type: 'normal',   power: 0, accuracy: 100, pp: 40, effect: { stat: 'atk', target: 'enemy', amount: -0.1 } },
    shellGuard: { name: 'Shell Guard', type: 'normal',   power: 0, accuracy: 100, pp: 30, effect: { stat: 'def', target: 'self', amount: 0.2 } },
    quickDash:  { name: 'Quick Dash',  type: 'normal',   power: 0, accuracy: 100, pp: 30, effect: { stat: 'spd', target: 'self', amount: 0.2 } },
    harden:     { name: 'Harden',      type: 'normal',   power: 0, accuracy: 100, pp: 30, effect: { stat: 'def', target: 'self', amount: 0.2 } },
    coil:       { name: 'Coil',        type: 'normal',   power: 0, accuracy: 100, pp: 20, effect: { stat: 'atk', target: 'self', amount: 0.2 } },
    flash:      { name: 'Flash',       type: 'fire',     power: 0, accuracy: 95,  pp: 20, effect: { stat: 'accuracy', target: 'enemy', amount: -0.1 } },
    sandVeil:   { name: 'Sand Veil',   type: 'ground',   power: 0, accuracy: 100, pp: 15, effect: { stat: 'def', target: 'self', amount: 0.2 } },
    toxicSpore: { name: 'Toxic Spore', type: 'grass',    power: 0, accuracy: 90,  pp: 20, effect: { stat: 'def', target: 'enemy', amount: -0.15 } },
    galeForce:  { name: 'Gale Force',  type: 'normal',   power: 0, accuracy: 100, pp: 15, effect: { stat: 'spd', target: 'self', amount: 0.3 } }
};
