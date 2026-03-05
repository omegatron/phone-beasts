// Tile legend:
// 0 = grass, 1 = path, 2 = tall grass (encounters), 3 = water
// 4 = wall, 5 = roof, 6 = door, 7 = floor, 8 = tree
// 9 = sign, 10 = fence, 11 = flowers
// Negative numbers = special tiles (NPCs, transitions)
// -1 = exit south, -2 = exit north, -3 = exit east, -4 = exit west
// -10 = player start, -11 = NPC professor, -12 = NPC townfolk
// -13 = NPC trainer1, -14 = NPC trainer2, -15 = NPC healer, -16 = NPC gym leader

var TILE_SIZE = 16;

var MAPS = {
    town: {
        name: 'Breezeholm',
        width: 20,
        height: 15,
        encounterRate: 0,
        music: 'town',
        data: [
            [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
            [8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 5, 5, 5, 0, 0, 0, 0, 1, 0, 0, 5, 5, 5, 0, 0, 0, 0, 8],
            [8, 0, 4, 4, 4, 0, 0, 0, 0, 1, 0, 0, 4, 4, 4, 0, 0,-12, 0, 8],
            [8, 0, 4, 7, 6, 0, 0, 0, 0, 1, 0, 0, 4, 7, 6, 0, 0, 0, 0, 8],
            [8, 0, 0,-10,1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 5, 5, 5, 5, 0, 0, 1, 0, 0, 0, 11, 0, 11, 0, 0, 0, 8],
            [8, 0, 0, 4, 4, 4, 4, 0, 0, 1, 0, 0, 0, 11, 0, 11, 0, 0, 0, 8],
            [8, 0, 0, 4, 7, 7, 6, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,-12, 0, 8],
            [8, 0, 0, 0,-11,0, 1, 1, 1, 1, 0, 0, 9, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 8, 8, 8, 8, 8, 8, 8, 8,-1, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
            [8, 8, 8, 8, 8, 8, 8, 8, 8,-1, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]
        ],
        npcs: {
            professor: { x: 4, y: 11, sprite: 'npc_professor', dir: 'down',
                dialog: [
                    "Ah, there you are!",
                    "Welcome to my lab.",
                    "Come see me when you're ready to pick your first beast!"
                ]
            },
            townfolk1: { x: 17, y: 3, sprite: 'npc_female', dir: 'left',
                dialog: ["Breezeholm is such a peaceful town.", "I hope it stays this way forever."]
            },
            townfolk2: { x: 17, y: 10, sprite: 'npc_male', dir: 'left',
                dialog: ["Did you hear? Professor Elm has new beasts!", "You should go visit the lab!"]
            }
        },
        signs: {
            '12,11': "Breezeholm Town\n\"Where gentle breezes blow\""
        },
        exits: {
            south: { targetMap: 'route1', targetX: 10, targetY: 1 }
        }
    },

    route1: {
        name: 'Route 1',
        width: 20,
        height: 30,
        encounterRate: 15,
        music: 'route',
        data: [
            [8, 8, 8, 8, 8, 8, 8, 8, 8,-2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
            [8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 2, 2, 2, 0, 0, 0, 0, 1, 0, 0, 0, 2, 2, 2, 0, 0, 0, 8],
            [8, 0, 2, 2, 2, 0, 0, 0, 0, 1, 0, 0, 0, 2, 2, 2, 0, 0, 0, 8],
            [8, 0, 2, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,-13, 0, 0, 8],
            [8, 0, 0, 0, 0, 8, 8, 0, 0, 1, 0, 0, 8, 8, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 0, 0, 8, 8, 0, 0, 1, 0, 0, 8, 8, 0, 0, 0, 0, 0, 8],
            [8, 0, 2, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 2, 0, 0, 8],
            [8, 0, 2, 2, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 2, 2, 0, 0, 8],
            [8, 0, 2, 2, 2, 2, 0, 0, 0, 1, 0, 0, 0, 2, 2, 2, 2, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 8],
            [8, 0, 2, 2, 0, 0, 0, 1, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 8],
            [8, 0, 2, 2, 0,-14, 0, 1, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 2, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 8, 8, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 8, 8, 0, 0, 1, 1, 1, 1, 0, 8, 8, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 8, 8, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 2, 2, 0, 0, 1, 0, 0, 2, 2, 2, 0, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 2, 2, 0, 0, 1, 0, 0, 2, 2, 2, 0, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 2, 2, 0, 0, 1, 0, 0, 0, 2, 2, 0, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 8, 8, 8, 8, 8, 8, 8, 8, 8,-1, 8, 8, 8, 8, 8, 8, 8, 8, 8],
            [8, 8, 8, 8, 8, 8, 8, 8, 8, 8,-1, 8, 8, 8, 8, 8, 8, 8, 8, 8]
        ],
        npcs: {},
        signs: {},
        exits: {
            north: { targetMap: 'town', targetX: 9, targetY: 12 },
            south: { targetMap: 'worldMap', targetX: 5, targetY: 1 }
        }
    },

    worldMap: {
        name: 'Overland',
        width: 30,
        height: 30,
        encounterRate: 12,
        music: 'route',
        data: (function() {
            var m = [];
            for (var y = 0; y < 30; y++) {
                var row = [];
                for (var x = 0; x < 30; x++) {
                    // Border
                    if (y === 0 || y === 29 || x === 0 || x === 29) {
                        if (y === 0 && x === 5) row.push(-2);       // North exit to Route 1
                        else if (y === 29 && x === 24) row.push(-1); // Won't use
                        else if (x === 29 && y === 20) row.push(-3); // East exit to GymCity
                        else row.push(8);
                    }
                    // Main path from north to east
                    else if ((x === 5 && y >= 1 && y <= 12) ||
                             (y === 12 && x >= 5 && x <= 24) ||
                             (x === 24 && y >= 12 && y <= 20)) {
                        row.push(1);
                    }
                    // Water lake area
                    else if (x >= 12 && x <= 16 && y >= 3 && y <= 7) {
                        row.push(3);
                    }
                    // Tall grass patches
                    else if ((x >= 2 && x <= 4 && y >= 4 && y <= 8) ||
                             (x >= 7 && x <= 10 && y >= 6 && y <= 9) ||
                             (x >= 18 && x <= 22 && y >= 14 && y <= 17) ||
                             (x >= 8 && x <= 11 && y >= 20 && y <= 24) ||
                             (x >= 20 && x <= 23 && y >= 22 && y <= 26)) {
                        row.push(2);
                    }
                    // Trees scattered
                    else if ((x === 10 && y === 3) || (x === 20 && y === 5) ||
                             (x === 3 && y === 15) || (x === 15 && y === 22) ||
                             (x === 27 && y === 8) || (x === 14 && y === 15) ||
                             (x === 8 && y === 16) || (x === 25 && y === 5)) {
                        row.push(8);
                    }
                    else {
                        row.push(0);
                    }
                }
                m.push(row);
            }
            return m;
        })(),
        npcs: {},
        signs: {},
        exits: {
            north: { targetMap: 'route1', targetX: 10, targetY: 27 },
            east: { targetMap: 'gymCity', targetX: 1, targetY: 10 }
        }
    },

    gymCity: {
        name: 'Tidepool City',
        width: 20,
        height: 20,
        encounterRate: 0,
        music: 'town',
        data: [
            [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
            [8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 5, 5, 5, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 4, 4, 4, 0, 0, 0, 0, 1, 0, 0, 5, 5, 5, 5, 5, 0, 0, 8],
            [8, 0, 4, 7, 6, 0, 0, 0, 0, 1, 0, 0, 4, 4, 4, 4, 4, 0, 0, 8],
            [8, 0, 0,-15,1, 1, 1, 1, 1, 1, 1, 1, 4, 7, 7, 7, 6, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 8],
            [8, 0, 0, 0, 11, 0, 11, 0, 0, 1, 0, 0, 0, 0,-16, 0, 1, 0, 0, 8],
           [-4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 9, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,-12, 0, 8],
            [8, 0, 0, 0, 0, 3, 3, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 0, 3, 3, 3, 3, 3, 1, 0, 0, 11, 0, 11, 0, 11, 0, 0, 8],
            [8, 0, 0, 0, 3, 3, 3, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 0, 0, 3, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
            [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]
        ],
        npcs: {
            healer: { x: 3, y: 5, sprite: 'npc_healer', dir: 'down',
                dialog: ["Welcome to the healing center!", "Let me restore your beasts to full health.", "...Your beasts are now fully healed!"],
                action: 'heal'
            },
            townfolk: { x: 17, y: 12, sprite: 'npc_female', dir: 'left',
                dialog: ["Leader Marina is tough!", "Make sure your beasts are well trained."]
            }
        },
        signs: {
            '3,12': "Tidepool City\n\"Where waves meet the shore\""
        },
        exits: {
            west: { targetMap: 'worldMap', targetX: 28, targetY: 20 }
        }
    }
};
