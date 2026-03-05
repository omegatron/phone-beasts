var SpriteGenerator = {
    generateAll: function(scene) {
        this.generateTiles(scene);
        this.generatePlayerSprite(scene);
        this.generateNPCSprites(scene);
        this.generateBeastSprites(scene);
        this.generateUIElements(scene);
    },

    // Create a canvas, draw on it, return as Phaser texture
    makeTexture: function(scene, key, width, height, drawFn) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        drawFn(ctx, width, height);
        if (scene.textures.exists(key)) scene.textures.remove(key);
        scene.textures.addCanvas(key, canvas);
    },

    generateTiles: function(scene) {
        var S = TILE_SIZE;
        var tiles = {
            'tile_grass':      function(c) { c.fillStyle='#4a8c3f'; c.fillRect(0,0,S,S); c.fillStyle='#5a9c4f'; c.fillRect(2,2,2,2); c.fillRect(8,6,2,2); c.fillRect(4,12,2,2); c.fillRect(12,10,2,2); },
            'tile_path':       function(c) { c.fillStyle='#c4a86b'; c.fillRect(0,0,S,S); c.fillStyle='#b89d60'; c.fillRect(3,3,2,1); c.fillRect(10,8,2,1); c.fillRect(6,13,3,1); },
            'tile_tallgrass':  function(c) { c.fillStyle='#4a8c3f'; c.fillRect(0,0,S,S); c.fillStyle='#2d6b2e'; for(var i=0;i<S;i+=3){ c.fillRect(i,4,1,8); c.fillRect(i+1,2,1,10); } },
            'tile_water':      function(c) { c.fillStyle='#2980b9'; c.fillRect(0,0,S,S); c.fillStyle='#3498db'; c.fillRect(2,4,4,2); c.fillRect(10,8,4,2); },
            'tile_wall':       function(c) { c.fillStyle='#8e6f3e'; c.fillRect(0,0,S,S); c.fillStyle='#7d6135'; c.fillRect(0,0,S,1); c.fillRect(0,S-1,S,1); c.fillRect(0,0,1,S); c.fillRect(S-1,0,1,S); },
            'tile_roof':       function(c) { c.fillStyle='#c0392b'; c.fillRect(0,0,S,S); c.fillStyle='#a93226'; c.fillRect(0,S-2,S,2); for(var i=0;i<S;i+=4) c.fillRect(i,0,2,S); },
            'tile_door':       function(c) { c.fillStyle='#8e6f3e'; c.fillRect(0,0,S,S); c.fillStyle='#5d4e37'; c.fillRect(3,2,10,14); c.fillStyle='#f1c40f'; c.fillRect(10,8,2,2); },
            'tile_floor':      function(c) { c.fillStyle='#d4a76a'; c.fillRect(0,0,S,S); c.fillStyle='#c49a5c'; c.fillRect(0,0,8,8); c.fillRect(8,8,8,8); },
            'tile_tree':       function(c) { c.fillStyle='#4a8c3f'; c.fillRect(0,0,S,S); c.fillStyle='#5d4037'; c.fillRect(6,10,4,6); c.fillStyle='#2e7d32'; c.fillRect(2,1,12,10); c.fillStyle='#388e3c'; c.fillRect(4,0,8,8); },
            'tile_sign':       function(c) { c.fillStyle='#4a8c3f'; c.fillRect(0,0,S,S); c.fillStyle='#5d4037'; c.fillRect(7,8,2,8); c.fillStyle='#8d6e63'; c.fillRect(3,3,10,6); c.fillStyle='#6d4c41'; c.fillRect(4,4,8,4); },
            'tile_fence':      function(c) { c.fillStyle='#4a8c3f'; c.fillRect(0,0,S,S); c.fillStyle='#8d6e63'; c.fillRect(0,6,S,2); c.fillRect(0,10,S,2); c.fillRect(1,4,2,10); c.fillRect(7,4,2,10); c.fillRect(13,4,2,10); },
            'tile_flowers':    function(c) { c.fillStyle='#4a8c3f'; c.fillRect(0,0,S,S); c.fillStyle='#e74c3c'; c.fillRect(3,4,3,3); c.fillStyle='#f1c40f'; c.fillRect(10,8,3,3); c.fillStyle='#9b59b6'; c.fillRect(6,12,3,3); }
        };

        for (var key in tiles) {
            this.makeTexture(scene, key, S, S, tiles[key]);
        }
    },

    generatePlayerSprite: function(scene) {
        var W = 16, H = 20;
        var dirs = ['down', 'left', 'right', 'up'];
        var frames = 3; // stand, walk1, walk2

        for (var d = 0; d < dirs.length; d++) {
            for (var f = 0; f < frames; f++) {
                var key = 'player_' + dirs[d] + '_' + f;
                (function(dir, frame) {
                    SpriteGenerator.makeTexture(scene, key, W, H, function(c) {
                        SpriteGenerator._drawCharacter(c, W, H, dir, frame, {
                            hair: '#2c3e50', skin: '#f5d6ba', shirt: '#e74c3c', pants: '#2c3e50', hat: '#e74c3c'
                        });
                    });
                })(dirs[d], f);
            }
        }
    },

    generateNPCSprites: function(scene) {
        var W = 16, H = 20;
        var npcs = {
            'npc_professor': { hair: '#ecf0f1', skin: '#f5d6ba', shirt: '#ecf0f1', pants: '#7f8c8d', hat: null },
            'npc_male':      { hair: '#8b4513', skin: '#f5d6ba', shirt: '#3498db', pants: '#34495e', hat: null },
            'npc_female':    { hair: '#e67e22', skin: '#f5d6ba', shirt: '#e91e63', pants: '#8e24aa', hat: null },
            'npc_healer':    { hair: '#ff69b4', skin: '#f5d6ba', shirt: '#fff', pants: '#fff', hat: null },
            'npc_trainer':   { hair: '#2c3e50', skin: '#f5d6ba', shirt: '#f39c12', pants: '#2c3e50', hat: '#f39c12' },
            'npc_gymleader': { hair: '#1abc9c', skin: '#f5d6ba', shirt: '#2980b9', pants: '#1a5276', hat: null }
        };

        var dirs = ['down', 'left', 'right', 'up'];
        for (var npcKey in npcs) {
            for (var d = 0; d < dirs.length; d++) {
                var texKey = npcKey + '_' + dirs[d];
                (function(colors, dir) {
                    SpriteGenerator.makeTexture(scene, texKey, W, H, function(c) {
                        SpriteGenerator._drawCharacter(c, W, H, dir, 0, colors);
                    });
                })(npcs[npcKey], dirs[d]);
            }
        }
    },

    _drawCharacter: function(ctx, w, h, dir, frame, colors) {
        // Simple top-down RPG character
        var cx = Math.floor(w / 2);
        // Body offset for walking animation
        var wobble = frame === 1 ? -1 : (frame === 2 ? 1 : 0);

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(3, h - 3, 10, 3);

        // Legs
        ctx.fillStyle = colors.pants;
        if (dir === 'down' || dir === 'up') {
            ctx.fillRect(5 + wobble, 14, 3, 4);
            ctx.fillRect(8 - wobble, 14, 3, 4);
        } else {
            ctx.fillRect(6, 14, 4, 4);
        }

        // Body/shirt
        ctx.fillStyle = colors.shirt;
        ctx.fillRect(4, 8, 8, 7);

        // Arms
        if (dir === 'left') {
            ctx.fillRect(3, 9, 3, 5);
        } else if (dir === 'right') {
            ctx.fillRect(10, 9, 3, 5);
        } else {
            ctx.fillRect(2, 9 + wobble, 3, 5);
            ctx.fillRect(11, 9 - wobble, 3, 5);
        }

        // Head
        ctx.fillStyle = colors.skin;
        ctx.fillRect(4, 2, 8, 7);

        // Hair
        ctx.fillStyle = colors.hair;
        if (dir === 'up') {
            ctx.fillRect(4, 1, 8, 5);
        } else {
            ctx.fillRect(4, 1, 8, 3);
            if (dir === 'left') ctx.fillRect(3, 1, 3, 6);
            if (dir === 'right') ctx.fillRect(10, 1, 3, 6);
        }

        // Hat
        if (colors.hat) {
            ctx.fillStyle = colors.hat;
            ctx.fillRect(3, 0, 10, 3);
            if (dir === 'down' || dir === 'left') ctx.fillRect(2, 2, 12, 2);
        }

        // Eyes (only when facing down or sideways)
        if (dir !== 'up') {
            ctx.fillStyle = '#2c3e50';
            if (dir === 'down') {
                ctx.fillRect(6, 5, 1, 2);
                ctx.fillRect(9, 5, 1, 2);
            } else if (dir === 'left') {
                ctx.fillRect(5, 5, 1, 2);
            } else {
                ctx.fillRect(10, 5, 1, 2);
            }
        }
    },

    generateBeastSprites: function(scene) {
        for (var beastId in BEASTS) {
            var beast = BEASTS[beastId];
            // Front sprite (for enemy/display)
            (function(id, b) {
                SpriteGenerator.makeTexture(scene, 'beast_' + id + '_front', 64, 64, function(c) {
                    SpriteGenerator._drawBeast(c, 64, 64, b, 'front');
                });
                // Back sprite (for player's beast in battle)
                SpriteGenerator.makeTexture(scene, 'beast_' + id + '_back', 64, 64, function(c) {
                    SpriteGenerator._drawBeast(c, 64, 64, b, 'back');
                });
                // Small icon for menus
                SpriteGenerator.makeTexture(scene, 'beast_' + id + '_icon', 32, 32, function(c) {
                    SpriteGenerator._drawBeast(c, 32, 32, b, 'front');
                });
            })(beastId, beast);
        }
    },

    _drawBeast: function(ctx, w, h, beast, view) {
        var colors = beast.colors;
        var type = beast.type;
        var cx = w / 2, cy = h / 2;

        // Different shapes based on beast type/characteristics
        ctx.save();

        // Body shape varies by beast
        switch (beast.id) {
            case 'emberon': this._drawLizard(ctx, w, h, colors, view); break;
            case 'tidalin': this._drawOtter(ctx, w, h, colors, view); break;
            case 'thornleaf': this._drawFox(ctx, w, h, colors, view); break;
            case 'sparkit': this._drawMouse(ctx, w, h, colors, view); break;
            case 'pebblor': this._drawRock(ctx, w, h, colors, view); break;
            case 'breezlet': this._drawBird(ctx, w, h, colors, view); break;
            case 'flickerbug': this._drawBug(ctx, w, h, colors, view); break;
            case 'pudlop': this._drawFrog(ctx, w, h, colors, view); break;
            case 'vinewhip': this._drawSnake(ctx, w, h, colors, view); break;
            case 'dustmole': this._drawMole(ctx, w, h, colors, view); break;
            case 'zappfly': this._drawDragonfly(ctx, w, h, colors, view); break;
            case 'shellbit': this._drawTurtle(ctx, w, h, colors, view); break;
            default: this._drawGeneric(ctx, w, h, colors, view); break;
        }

        ctx.restore();
    },

    _pixel: function(ctx, x, y, s, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * s, y * s, s, s);
    },

    _drawLizard: function(ctx, w, h, c, view) {
        var s = w / 16;
        var p = this._pixel.bind(this, ctx);
        // Body
        for (var y = 5; y < 12; y++)
            for (var x = 5; x < 11; x++) p(x, y, s, c.primary);
        // Head
        for (var y = 2; y < 6; y++)
            for (var x = 5; x < 11; x++) p(x, y, s, c.primary);
        // Tail (flame)
        p(11, 8, s, c.secondary); p(12, 7, s, c.secondary); p(13, 6, s, '#ff6347');
        p(12, 8, s, c.secondary); p(13, 7, s, '#ff6347');
        // Legs
        p(5, 12, s, c.accent); p(6, 12, s, c.accent); p(9, 12, s, c.accent); p(10, 12, s, c.accent);
        p(5, 13, s, c.accent); p(10, 13, s, c.accent);
        // Eyes
        if (view === 'front') { p(6, 3, s, '#fff'); p(9, 3, s, '#fff'); p(6, 4, s, '#111'); p(9, 4, s, '#111'); }
        // Belly
        for (var y = 7; y < 11; y++) { p(7, y, s, c.secondary); p(8, y, s, c.secondary); }
    },

    _drawOtter: function(ctx, w, h, c, view) {
        var s = w / 16;
        var p = this._pixel.bind(this, ctx);
        // Round body
        for (var y = 5; y < 13; y++)
            for (var x = 4; x < 12; x++) p(x, y, s, c.primary);
        // Head
        for (var y = 1; y < 6; y++)
            for (var x = 4; x < 12; x++) p(x, y, s, c.primary);
        // Ears
        p(4, 0, s, c.primary); p(11, 0, s, c.primary);
        // Tail
        p(12, 10, s, c.accent); p(13, 11, s, c.accent); p(14, 11, s, c.accent);
        // Belly
        for (var y = 6; y < 12; y++) { p(6, y, s, c.secondary); p(7, y, s, c.secondary); p(8, y, s, c.secondary); }
        // Eyes
        if (view === 'front') { p(5, 3, s, '#fff'); p(10, 3, s, '#fff'); p(6, 3, s, '#111'); p(9, 3, s, '#111'); }
        // Feet
        p(4, 13, s, c.accent); p(5, 13, s, c.accent); p(10, 13, s, c.accent); p(11, 13, s, c.accent);
    },

    _drawFox: function(ctx, w, h, c, view) {
        var s = w / 16;
        var p = this._pixel.bind(this, ctx);
        // Body
        for (var y = 6; y < 12; y++)
            for (var x = 4; x < 11; x++) p(x, y, s, c.primary);
        // Head (triangular)
        for (var y = 2; y < 7; y++)
            for (var x = 5; x < 11; x++) p(x, y, s, c.primary);
        // Ears (tall/pointed)
        p(5, 0, s, c.primary); p(5, 1, s, c.primary);
        p(10, 0, s, c.primary); p(10, 1, s, c.primary);
        p(5, 0, s, c.secondary); p(10, 0, s, c.secondary);
        // Tail (bushy)
        p(11, 8, s, c.primary); p(12, 7, s, c.primary); p(13, 6, s, c.primary);
        p(12, 8, s, c.secondary); p(13, 7, s, c.secondary);
        // Leaf on tail
        p(14, 5, s, c.accent); p(14, 6, s, c.accent); p(13, 5, s, c.accent);
        // Eyes
        if (view === 'front') { p(6, 3, s, '#fff'); p(9, 3, s, '#fff'); p(7, 4, s, '#111'); p(9, 4, s, '#111'); }
        // Legs
        p(4, 12, s, c.accent); p(5, 12, s, c.accent); p(9, 12, s, c.accent); p(10, 12, s, c.accent);
    },

    _drawMouse: function(ctx, w, h, c, view) {
        var s = w / 16;
        var p = this._pixel.bind(this, ctx);
        // Small round body
        for (var y = 6; y < 12; y++)
            for (var x = 5; x < 11; x++) p(x, y, s, c.primary);
        // Head
        for (var y = 3; y < 7; y++)
            for (var x = 5; x < 11; x++) p(x, y, s, c.primary);
        // Big round ears
        p(4, 2, s, c.primary); p(5, 1, s, c.primary); p(5, 2, s, c.secondary);
        p(11, 2, s, c.primary); p(10, 1, s, c.primary); p(10, 2, s, c.secondary);
        // Lightning bolt tail
        p(11, 9, s, c.secondary); p(12, 8, s, c.secondary); p(13, 9, s, c.secondary); p(14, 8, s, c.secondary);
        // Eyes
        if (view === 'front') { p(6, 4, s, '#111'); p(9, 4, s, '#111'); }
        // Cheeks (electric)
        p(5, 5, s, '#ff6347'); p(10, 5, s, '#ff6347');
        // Feet
        p(5, 12, s, c.accent); p(10, 12, s, c.accent);
    },

    _drawRock: function(ctx, w, h, c, view) {
        var s = w / 16;
        var p = this._pixel.bind(this, ctx);
        // Rocky body (irregular)
        for (var y = 4; y < 13; y++)
            for (var x = 3; x < 13; x++) {
                if (Math.abs(x - 8) + Math.abs(y - 8) < 7) p(x, y, s, c.primary);
            }
        // Cracks
        p(6, 6, s, c.secondary); p(7, 7, s, c.secondary); p(9, 5, s, c.secondary);
        p(5, 9, s, c.accent); p(10, 8, s, c.accent);
        // Eyes
        if (view === 'front') { p(5, 6, s, '#111'); p(10, 6, s, '#111'); }
        // Feet
        p(4, 13, s, c.accent); p(5, 13, s, c.accent); p(10, 13, s, c.accent); p(11, 13, s, c.accent);
    },

    _drawBird: function(ctx, w, h, c, view) {
        var s = w / 16;
        var p = this._pixel.bind(this, ctx);
        // Body
        for (var y = 6; y < 11; y++)
            for (var x = 5; x < 11; x++) p(x, y, s, c.primary);
        // Head
        for (var y = 3; y < 7; y++)
            for (var x = 6; x < 10; x++) p(x, y, s, c.primary);
        // Wings
        p(3, 7, s, c.accent); p(4, 7, s, c.accent); p(3, 8, s, c.accent);
        p(12, 7, s, c.accent); p(11, 7, s, c.accent); p(12, 8, s, c.accent);
        // Beak
        p(8, 5, s, '#f39c12'); p(8, 4, s, '#f39c12');
        // Eyes
        if (view === 'front') { p(7, 4, s, '#111'); p(9, 4, s, '#111'); }
        // Tail
        p(7, 11, s, c.accent); p(8, 11, s, c.accent); p(8, 12, s, c.accent);
        // Feet
        p(6, 11, s, '#f39c12'); p(9, 11, s, '#f39c12');
    },

    _drawBug: function(ctx, w, h, c, view) {
        var s = w / 16;
        var p = this._pixel.bind(this, ctx);
        // Abdomen (glowing)
        for (var y = 8; y < 13; y++)
            for (var x = 5; x < 11; x++) p(x, y, s, c.secondary);
        // Thorax
        for (var y = 5; y < 9; y++)
            for (var x = 6; x < 10; x++) p(x, y, s, c.primary);
        // Head
        for (var y = 2; y < 6; y++)
            for (var x = 6; x < 10; x++) p(x, y, s, c.primary);
        // Wings
        p(4, 6, s, 'rgba(255,255,255,0.5)'); p(3, 5, s, 'rgba(255,255,255,0.5)');
        p(11, 6, s, 'rgba(255,255,255,0.5)'); p(12, 5, s, 'rgba(255,255,255,0.5)');
        // Antennae
        p(6, 1, s, c.primary); p(5, 0, s, c.accent);
        p(9, 1, s, c.primary); p(10, 0, s, c.accent);
        // Eyes
        if (view === 'front') { p(7, 3, s, '#ff0'); p(8, 3, s, '#ff0'); }
        // Glow effect
        p(7, 10, s, c.accent); p(8, 10, s, c.accent);
    },

    _drawFrog: function(ctx, w, h, c, view) {
        var s = w / 16;
        var p = this._pixel.bind(this, ctx);
        // Chunky body
        for (var y = 5; y < 12; y++)
            for (var x = 3; x < 13; x++) p(x, y, s, c.primary);
        // Head (wide)
        for (var y = 2; y < 6; y++)
            for (var x = 3; x < 13; x++) p(x, y, s, c.primary);
        // Big eyes on top
        p(4, 1, s, '#fff'); p(5, 1, s, '#fff'); p(4, 2, s, '#fff'); p(5, 2, s, '#111');
        p(10, 1, s, '#fff'); p(11, 1, s, '#fff'); p(11, 2, s, '#fff'); p(10, 2, s, '#111');
        // Belly
        for (var y = 6; y < 11; y++)
            for (var x = 5; x < 11; x++) p(x, y, s, c.secondary);
        // Legs
        p(2, 11, s, c.accent); p(3, 12, s, c.accent); p(4, 12, s, c.accent);
        p(13, 11, s, c.accent); p(12, 12, s, c.accent); p(11, 12, s, c.accent);
    },

    _drawSnake: function(ctx, w, h, c, view) {
        var s = w / 16;
        var p = this._pixel.bind(this, ctx);
        // Coiled body
        for (var i = 0; i < 12; i++) {
            var x = 7 + Math.round(Math.cos(i * 0.8) * 3);
            var y = 3 + i;
            p(x, y, s, c.primary); p(x + 1, y, s, c.primary); p(x - 1, y, s, c.primary);
        }
        // Head
        for (var y = 2; y < 5; y++)
            for (var x = 5; x < 10; x++) p(x, y, s, c.primary);
        // Pattern
        p(7, 6, s, c.secondary); p(8, 8, s, c.secondary); p(6, 10, s, c.secondary);
        // Eyes
        if (view === 'front') { p(6, 3, s, c.accent); p(8, 3, s, c.accent); }
        // Tongue
        p(7, 5, s, '#e74c3c'); p(7, 6, s, '#e74c3c');
    },

    _drawMole: function(ctx, w, h, c, view) {
        var s = w / 16;
        var p = this._pixel.bind(this, ctx);
        // Round body
        for (var y = 5; y < 13; y++)
            for (var x = 4; x < 12; x++) p(x, y, s, c.primary);
        // Head
        for (var y = 2; y < 6; y++)
            for (var x = 5; x < 11; x++) p(x, y, s, c.primary);
        // Nose
        p(8, 3, s, '#e91e63'); p(7, 3, s, '#e91e63');
        // Claws
        p(3, 9, s, c.secondary); p(2, 10, s, c.secondary); p(3, 11, s, c.secondary);
        p(12, 9, s, c.secondary); p(13, 10, s, c.secondary); p(12, 11, s, c.secondary);
        // Tiny eyes
        if (view === 'front') { p(6, 4, s, '#111'); p(9, 4, s, '#111'); }
        // Belly
        for (var y = 7; y < 12; y++) { p(6, y, s, c.secondary); p(7, y, s, c.secondary); p(8, y, s, c.secondary); }
    },

    _drawDragonfly: function(ctx, w, h, c, view) {
        var s = w / 16;
        var p = this._pixel.bind(this, ctx);
        // Long body
        for (var y = 3; y < 13; y++) { p(7, y, s, c.primary); p(8, y, s, c.primary); }
        // Head
        for (var x = 6; x < 10; x++) { p(x, 2, s, c.primary); p(x, 3, s, c.primary); }
        // Big eyes
        p(5, 2, s, c.accent); p(6, 2, s, c.accent);
        p(10, 2, s, c.accent); p(9, 2, s, c.accent);
        // Wings (4)
        for (var i = 0; i < 3; i++) {
            p(4 - i, 5 + i, s, c.secondary); p(5 - i, 5 + i, s, c.secondary);
            p(11 + i, 5 + i, s, c.secondary); p(10 + i, 5 + i, s, c.secondary);
            p(4 - i, 8 + i, s, c.secondary); p(5 - i, 8 + i, s, c.secondary);
            p(11 + i, 8 + i, s, c.secondary); p(10 + i, 8 + i, s, c.secondary);
        }
        // Tail tip
        p(7, 13, s, c.accent); p(8, 13, s, c.accent);
        // Electric sparks
        p(6, 6, s, '#ff0'); p(9, 9, s, '#ff0');
    },

    _drawTurtle: function(ctx, w, h, c, view) {
        var s = w / 16;
        var p = this._pixel.bind(this, ctx);
        // Shell
        for (var y = 4; y < 12; y++)
            for (var x = 3; x < 13; x++) {
                if (Math.abs(x - 8) + Math.abs(y - 8) < 7) p(x, y, s, c.secondary);
            }
        // Shell pattern
        p(7, 6, s, c.accent); p(8, 6, s, c.accent); p(9, 6, s, c.accent);
        p(6, 8, s, c.accent); p(8, 8, s, c.accent); p(10, 8, s, c.accent);
        // Head
        for (var y = 2; y < 5; y++)
            for (var x = 5; x < 9; x++) p(x, y, s, c.primary);
        // Eyes
        if (view === 'front') { p(6, 3, s, '#fff'); p(7, 3, s, '#111'); }
        // Legs
        p(3, 10, s, c.primary); p(4, 11, s, c.primary);
        p(12, 10, s, c.primary); p(11, 11, s, c.primary);
        // Tail
        p(8, 12, s, c.primary); p(8, 13, s, c.primary);
    },

    _drawGeneric: function(ctx, w, h, c, view) {
        var s = w / 16;
        var p = this._pixel.bind(this, ctx);
        for (var y = 4; y < 12; y++)
            for (var x = 4; x < 12; x++) p(x, y, s, c.primary);
        if (view === 'front') { p(6, 6, s, '#111'); p(9, 6, s, '#111'); }
    },

    generateUIElements: function(scene) {
        // Dialog box background
        this.makeTexture(scene, 'ui_dialog', 320, 80, function(c) {
            c.fillStyle = 'rgba(0, 0, 0, 0.85)';
            c.fillRect(0, 0, 320, 80);
            c.strokeStyle = '#fff';
            c.lineWidth = 2;
            c.strokeRect(2, 2, 316, 76);
        });

        // Battle background
        this.makeTexture(scene, 'ui_battle_bg', 320, 240, function(c) {
            // Sky gradient
            var grad = c.createLinearGradient(0, 0, 0, 120);
            grad.addColorStop(0, '#87CEEB');
            grad.addColorStop(1, '#b8e6b8');
            c.fillStyle = grad;
            c.fillRect(0, 0, 320, 120);
            // Ground
            c.fillStyle = '#7cba6d';
            c.fillRect(0, 120, 320, 120);
            // Line
            c.strokeStyle = '#5a9c4f';
            c.lineWidth = 2;
            c.beginPath();
            c.moveTo(0, 120);
            c.lineTo(320, 120);
            c.stroke();
        });

        // Type color badges
        var typeColors = {
            normal: '#a8a878', fire: '#f08030', water: '#6890f0', grass: '#78c850',
            electric: '#f8d030', ground: '#e0c068'
        };
        for (var type in typeColors) {
            (function(t, col) {
                SpriteGenerator.makeTexture(scene, 'type_' + t, 48, 16, function(c) {
                    c.fillStyle = col;
                    c.fillRect(0, 0, 48, 16);
                    c.fillStyle = '#fff';
                    c.font = '9px monospace';
                    c.textAlign = 'center';
                    c.fillText(t.toUpperCase(), 24, 12);
                });
            })(type, typeColors[type]);
        }

        // Beast ball / trap icon
        this.makeTexture(scene, 'ui_trap', 16, 16, function(c) {
            c.fillStyle = '#e74c3c';
            c.beginPath();
            c.arc(8, 8, 7, 0, Math.PI, true);
            c.fill();
            c.fillStyle = '#ecf0f1';
            c.beginPath();
            c.arc(8, 8, 7, Math.PI, 0, true);
            c.fill();
            c.fillStyle = '#2c3e50';
            c.fillRect(1, 7, 14, 2);
            c.beginPath();
            c.arc(8, 8, 3, 0, Math.PI * 2);
            c.fill();
            c.fillStyle = '#fff';
            c.beginPath();
            c.arc(8, 8, 1.5, 0, Math.PI * 2);
            c.fill();
        });

        // Potion icon
        this.makeTexture(scene, 'ui_potion', 16, 16, function(c) {
            c.fillStyle = '#9b59b6';
            c.fillRect(6, 2, 4, 4);
            c.fillStyle = '#8e44ad';
            c.fillRect(4, 6, 8, 8);
            c.fillStyle = '#c39bd3';
            c.fillRect(5, 7, 3, 3);
        });
    }
};
