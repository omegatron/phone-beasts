var SpriteGenerator = {
    _beastShapes: {},

    generateAll: function(scene) {
        this.generateTiles(scene);
        this.generatePlayerSprite(scene);
        this.generateNPCSprites(scene);
        this.generateBeastSprites(scene);
        this.generateUIElements(scene);
    },

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
            'tile_flowers':    function(c) { c.fillStyle='#4a8c3f'; c.fillRect(0,0,S,S); c.fillStyle='#e74c3c'; c.fillRect(3,4,3,3); c.fillStyle='#f1c40f'; c.fillRect(10,8,3,3); c.fillStyle='#9b59b6'; c.fillRect(6,12,3,3); },
            'tile_heal_roof':  function(c) { c.fillStyle='#ff8a9e'; c.fillRect(0,0,S,S); c.fillStyle='#ff6b81'; c.fillRect(0,S-2,S,2); for(var i=0;i<S;i+=4) c.fillRect(i,0,2,S); c.fillStyle='#fff'; c.fillRect(6,3,4,1); c.fillRect(7,2,2,3); },
            'tile_heal_wall':  function(c) { c.fillStyle='#fce4ec'; c.fillRect(0,0,S,S); c.fillStyle='#f8bbd0'; c.fillRect(0,0,S,1); c.fillRect(0,S-1,S,1); c.fillRect(0,0,1,S); c.fillRect(S-1,0,1,S); },
            'tile_machine':    function(c) { c.fillStyle='#546e7a'; c.fillRect(0,0,S,S); c.fillStyle='#37474f'; c.fillRect(1,1,S-2,S-2); c.fillStyle='#4caf50'; c.fillRect(3,3,4,3); c.fillRect(9,3,4,3); c.fillStyle='#81c784'; c.fillRect(3,8,10,2); c.fillStyle='#e0e0e0'; c.fillRect(5,11,6,3); },
            'tile_counter':    function(c) { c.fillStyle='#6d4c41'; c.fillRect(0,0,S,S); c.fillStyle='#5d4037'; c.fillRect(0,0,S,2); c.fillRect(0,S-2,S,2); c.fillStyle='#8d6e63'; c.fillRect(2,4,S-4,S-8); },
            'tile_bookshelf':  function(c) { c.fillStyle='#5d4037'; c.fillRect(0,0,S,S); c.fillStyle='#e74c3c'; c.fillRect(1,1,4,6); c.fillStyle='#3498db'; c.fillRect(6,1,4,6); c.fillStyle='#27ae60'; c.fillRect(11,1,4,6); c.fillStyle='#f39c12'; c.fillRect(1,9,4,6); c.fillStyle='#9b59b6'; c.fillRect(6,9,4,6); c.fillStyle='#1abc9c'; c.fillRect(11,9,4,6); },
            'tile_rug':        function(c) { c.fillStyle='#d4a76a'; c.fillRect(0,0,S,S); c.fillStyle='#c62828'; c.fillRect(2,2,S-4,S-4); c.fillStyle='#b71c1c'; c.fillRect(4,4,S-8,S-8); },
            'tile_mountain':   function(c) { c.fillStyle='#6b6b6b'; c.fillRect(0,0,S,S); c.fillStyle='#5a5a5a'; c.fillRect(0,0,S,2); c.fillRect(0,0,2,S); c.fillStyle='#7a7a7a'; c.fillRect(4,4,4,4); c.fillRect(10,8,4,4); c.fillStyle='#555'; c.fillRect(2,10,3,3); c.fillRect(8,2,3,3); },
            'tile_chest':      function(c) { c.fillStyle='#6b6b6b'; c.fillRect(0,0,S,S); c.fillStyle='#8B4513'; c.fillRect(3,5,10,9); c.fillStyle='#A0522D'; c.fillRect(4,6,8,7); c.fillStyle='#f1c40f'; c.fillRect(7,8,2,2); c.fillStyle='#DAA520'; c.fillRect(3,5,10,2); }
        };

        for (var key in tiles) {
            this.makeTexture(scene, key, S, S, tiles[key]);
        }
    },

    generatePlayerSprite: function(scene) {
        var W = 16, H = 20;
        var dirs = ['down', 'left', 'right', 'up'];
        var frames = 3;
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
            'npc_shopkeep':  { hair: '#4a235a', skin: '#f5d6ba', shirt: '#2e86c1', pants: '#1b4f72', hat: null },
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
        var wobble = frame === 1 ? -1 : (frame === 2 ? 1 : 0);
        ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(3, h-3, 10, 3);
        ctx.fillStyle = colors.pants;
        if (dir === 'down' || dir === 'up') { ctx.fillRect(5+wobble,14,3,4); ctx.fillRect(8-wobble,14,3,4); }
        else { ctx.fillRect(6,14,4,4); }
        ctx.fillStyle = colors.shirt; ctx.fillRect(4,8,8,7);
        if (dir === 'left') { ctx.fillRect(3,9,3,5); }
        else if (dir === 'right') { ctx.fillRect(10,9,3,5); }
        else { ctx.fillRect(2,9+wobble,3,5); ctx.fillRect(11,9-wobble,3,5); }
        ctx.fillStyle = colors.skin; ctx.fillRect(4,2,8,7);
        ctx.fillStyle = colors.hair;
        if (dir === 'up') { ctx.fillRect(4,1,8,5); }
        else { ctx.fillRect(4,1,8,3); if (dir==='left') ctx.fillRect(3,1,3,6); if (dir==='right') ctx.fillRect(10,1,3,6); }
        if (colors.hat) { ctx.fillStyle = colors.hat; ctx.fillRect(3,0,10,3); if (dir==='down'||dir==='left') ctx.fillRect(2,2,12,2); }
        if (dir !== 'up') {
            ctx.fillStyle = '#2c3e50';
            if (dir==='down') { ctx.fillRect(6,5,1,2); ctx.fillRect(9,5,1,2); }
            else if (dir==='left') { ctx.fillRect(5,5,1,2); }
            else { ctx.fillRect(10,5,1,2); }
        }
    },

    generateBeastSprites: function(scene) {
        for (var beastId in BEASTS) {
            var beast = BEASTS[beastId];
            (function(id, b) {
                SpriteGenerator.makeTexture(scene, 'beast_' + id + '_front', 64, 64, function(c) {
                    SpriteGenerator._drawBeast(c, 64, 64, b, 'front');
                });
                SpriteGenerator.makeTexture(scene, 'beast_' + id + '_back', 64, 64, function(c) {
                    SpriteGenerator._drawBeast(c, 64, 64, b, 'back');
                });
                SpriteGenerator.makeTexture(scene, 'beast_' + id + '_icon', 32, 32, function(c) {
                    SpriteGenerator._drawBeast(c, 32, 32, b, 'front');
                });
            })(beastId, beast);
        }
    },

    _drawBeast: function(ctx, w, h, beast, view) {
        ctx.save();
        var shape = this._beastShapes[beast.id];
        if (shape) { shape.call(this, ctx, w, h, beast.colors, view); }
        else { this._drawGenericBeast(ctx, w, h, beast.colors, view); }
        ctx.restore();
    },

    _p: function(ctx, x, y, s, color) { ctx.fillStyle = color; ctx.fillRect(x*s, y*s, s, s); },

    _drawGenericBeast: function(ctx, w, h, c, view) {
        var s = w/16, p = this._p;
        for (var y=4;y<12;y++) for (var x=4;x<12;x++) p(ctx,x,y,s,c.primary);
        for (var y=2;y<5;y++) for (var x=5;x<11;x++) p(ctx,x,y,s,c.primary);
        if (view==='front') { p(ctx,6,3,s,'#111'); p(ctx,9,3,s,'#111'); }
        p(ctx,4,12,s,c.accent); p(ctx,5,12,s,c.accent); p(ctx,10,12,s,c.accent); p(ctx,11,12,s,c.accent);
    },

    // ===== SHAPE TEMPLATES =====
    _drawLizardT: function(ctx,w,h,c,view,evo) {
        var s=w/16, p=this._p, b=evo?1:0;
        for(var y=5-b;y<12+b;y++) for(var x=5-b;x<11+b;x++) p(ctx,x,y,s,c.primary);
        for(var y=2-b;y<6;y++) for(var x=5-b;x<11+b;x++) p(ctx,x,y,s,c.primary);
        p(ctx,11+b,8,s,c.secondary); p(ctx,12+b,7,s,c.secondary); p(ctx,13,6,s,'#ff6347');
        p(ctx,12,8,s,c.secondary); p(ctx,13,7,s,'#ff6347');
        p(ctx,5,12+b,s,c.accent); p(ctx,6,12+b,s,c.accent); p(ctx,9+b,12+b,s,c.accent); p(ctx,10+b,12+b,s,c.accent);
        if(evo){p(ctx,5,13,s,c.accent);p(ctx,10+b,13,s,c.accent);}
        if(view==='front'){p(ctx,6,3,s,'#fff');p(ctx,9+b,3,s,'#fff');p(ctx,6,4,s,'#111');p(ctx,9+b,4,s,'#111');}
        for(var y=7;y<11;y++){p(ctx,7,y,s,c.secondary);p(ctx,8,y,s,c.secondary);}
        if(evo){p(ctx,5,1,s,c.accent);p(ctx,10+b,1,s,c.accent);p(ctx,4,0,s,c.accent);p(ctx,11+b,0,s,c.accent);}
    },
    _drawOtterT: function(ctx,w,h,c,view,evo) {
        var s=w/16, p=this._p, b=evo?1:0;
        for(var y=5-b;y<13+b;y++) for(var x=4-b;x<12+b;x++) p(ctx,x,y,s,c.primary);
        for(var y=1;y<6;y++) for(var x=4;x<12;x++) p(ctx,x,y,s,c.primary);
        p(ctx,4,0,s,c.primary);p(ctx,11,0,s,c.primary);
        p(ctx,12,10,s,c.accent);p(ctx,13,11,s,c.accent);p(ctx,14,11,s,c.accent);
        for(var y=6;y<12;y++){p(ctx,6,y,s,c.secondary);p(ctx,7,y,s,c.secondary);p(ctx,8,y,s,c.secondary);}
        if(view==='front'){p(ctx,5,3,s,'#fff');p(ctx,10,3,s,'#fff');p(ctx,6,3,s,'#111');p(ctx,9,3,s,'#111');}
        p(ctx,4,13,s,c.accent);p(ctx,5,13,s,c.accent);p(ctx,10,13,s,c.accent);p(ctx,11,13,s,c.accent);
        if(evo){p(ctx,3,7,s,c.accent);p(ctx,3,8,s,c.accent);p(ctx,12,7,s,c.accent);p(ctx,12,8,s,c.accent);}
    },
    _drawFoxT: function(ctx,w,h,c,view,evo) {
        var s=w/16, p=this._p;
        for(var y=6;y<12;y++) for(var x=4;x<11;x++) p(ctx,x,y,s,c.primary);
        for(var y=2;y<7;y++) for(var x=5;x<11;x++) p(ctx,x,y,s,c.primary);
        p(ctx,5,0,s,c.primary);p(ctx,5,1,s,c.primary);p(ctx,10,0,s,c.primary);p(ctx,10,1,s,c.primary);
        p(ctx,5,0,s,c.secondary);p(ctx,10,0,s,c.secondary);
        p(ctx,11,8,s,c.primary);p(ctx,12,7,s,c.primary);p(ctx,13,6,s,c.primary);
        p(ctx,12,8,s,c.secondary);p(ctx,13,7,s,c.secondary);
        p(ctx,14,5,s,c.accent);p(ctx,14,6,s,c.accent);p(ctx,13,5,s,c.accent);
        if(view==='front'){p(ctx,6,3,s,'#fff');p(ctx,9,3,s,'#fff');p(ctx,7,4,s,'#111');p(ctx,9,4,s,'#111');}
        p(ctx,4,12,s,c.accent);p(ctx,5,12,s,c.accent);p(ctx,9,12,s,c.accent);p(ctx,10,12,s,c.accent);
        if(evo){p(ctx,3,5,s,'#f1c40f');p(ctx,12,5,s,'#f1c40f');p(ctx,14,4,s,'#f1c40f');p(ctx,15,5,s,'#f1c40f');}
    },
    _drawDogT: function(ctx,w,h,c,view,evo) {
        var s=w/16, p=this._p, b=evo?1:0;
        for(var y=6-b;y<11+b;y++) for(var x=4-b;x<12+b;x++) p(ctx,x,y,s,c.primary);
        for(var y=2;y<7;y++) for(var x=5;x<11;x++) p(ctx,x,y,s,c.primary);
        p(ctx,7,5,s,c.secondary);p(ctx,8,5,s,c.secondary);p(ctx,8,6,s,'#111');
        p(ctx,5,1,s,c.primary);p(ctx,10,1,s,c.primary);
        if(evo){p(ctx,5,0,s,c.accent);p(ctx,10,0,s,c.accent);}
        p(ctx,4,11+b,s,c.accent);p(ctx,5,11+b,s,c.accent);p(ctx,5,12+b,s,c.accent);
        p(ctx,10,11+b,s,c.accent);p(ctx,11,11+b,s,c.accent);p(ctx,10,12+b,s,c.accent);
        p(ctx,12+b,7,s,c.secondary);p(ctx,13+b,6,s,c.secondary);
        if(evo) p(ctx,14,5,s,c.secondary);
        if(view==='front'){p(ctx,6,3,s,'#fff');p(ctx,9,3,s,'#fff');p(ctx,6,4,s,'#111');p(ctx,9,4,s,'#111');}
        for(var y=8;y<11;y++){p(ctx,6,y,s,c.secondary);p(ctx,7,y,s,c.secondary);p(ctx,8,y,s,c.secondary);}
    },
    _drawFishT: function(ctx,w,h,c,view,evo) {
        var s=w/16, p=this._p, b=evo?1:0;
        for(var y=5-b;y<11+b;y++) for(var x=4-b;x<12+b;x++) {
            if(Math.abs(x-8)+Math.abs(y-8)<6+b) p(ctx,x,y,s,c.primary);
        }
        p(ctx,3-b,7,s,c.accent);p(ctx,2-b,6,s,c.accent);p(ctx,2-b,8,s,c.accent);
        p(ctx,12+b,7,s,c.accent);p(ctx,13+b,6,s,c.accent);p(ctx,13+b,8,s,c.accent);
        p(ctx,8,11+b,s,c.secondary);p(ctx,7,12+b,s,c.secondary);p(ctx,9,12+b,s,c.secondary);
        if(view==='front'){p(ctx,6,6,s,'#fff');p(ctx,9,6,s,'#fff');p(ctx,6,7,s,'#111');p(ctx,9,7,s,'#111');}
        if(evo){p(ctx,5,4,s,c.accent);p(ctx,10,4,s,c.accent);p(ctx,3,3,s,'#f1c40f');p(ctx,12,3,s,'#f1c40f');}
    },
    _drawMushroomT: function(ctx,w,h,c,view,evo) {
        var s=w/16, p=this._p, b=evo?1:0;
        for(var y=8;y<13+b;y++) for(var x=6;x<10;x++) p(ctx,x,y,s,c.secondary);
        for(var y=2-b;y<9;y++) for(var x=3-b;x<13+b;x++) {
            if(Math.abs(x-8)+Math.abs(y-5)<6+b) p(ctx,x,y,s,c.primary);
        }
        p(ctx,5,4,s,c.accent);p(ctx,10,4,s,c.accent);p(ctx,7,3,s,c.accent);
        if(view==='front'){p(ctx,7,7,s,'#111');p(ctx,9,7,s,'#111');}
        p(ctx,5,13+b,s,c.secondary);p(ctx,10,13+b,s,c.secondary);
        if(evo){p(ctx,2,3,s,c.accent);p(ctx,13,3,s,c.accent);p(ctx,4,1,s,c.accent);p(ctx,11,1,s,c.accent);}
    },
    _drawCatT: function(ctx,w,h,c,view,evo) {
        var s=w/16, p=this._p, b=evo?1:0;
        for(var y=6-b;y<11+b;y++) for(var x=5-b;x<11+b;x++) p(ctx,x,y,s,c.primary);
        for(var y=2;y<7;y++) for(var x=5;x<11;x++) p(ctx,x,y,s,c.primary);
        p(ctx,5,1,s,c.primary);p(ctx,4,0,s,c.secondary);p(ctx,10,1,s,c.primary);p(ctx,11,0,s,c.secondary);
        p(ctx,11+b,9,s,c.primary);p(ctx,12+b,8,s,c.primary);p(ctx,13,7,s,c.secondary);
        if(evo){p(ctx,14,6,s,c.secondary);p(ctx,14,7,s,c.secondary);}
        if(view==='front'){p(ctx,6,4,s,c.secondary);p(ctx,9,4,s,c.secondary);p(ctx,7,4,s,'#111');p(ctx,10,4,s,'#111');}
        p(ctx,5,11+b,s,c.accent);p(ctx,10,11+b,s,c.accent);
        if(evo){p(ctx,4,12,s,c.accent);p(ctx,11,12,s,c.accent);}
    },
    _drawBatT: function(ctx,w,h,c,view,evo) {
        var s=w/16, p=this._p, b=evo?1:0;
        for(var y=5;y<10;y++) for(var x=6;x<10;x++) p(ctx,x,y,s,c.primary);
        for(var y=2;y<6;y++) for(var x=6;x<10;x++) p(ctx,x,y,s,c.primary);
        p(ctx,6,1,s,c.primary);p(ctx,5,0,s,c.primary);p(ctx,9,1,s,c.primary);p(ctx,10,0,s,c.primary);
        for(var i=0;i<4+b;i++){
            p(ctx,5-i,6+i,s,c.secondary);p(ctx,4-i,5+i,s,c.secondary);
            p(ctx,10+i,6+i,s,c.secondary);p(ctx,11+i,5+i,s,c.secondary);
        }
        if(view==='front'){p(ctx,7,3,s,'#ff0');p(ctx,8,3,s,'#ff0');}
        p(ctx,7,5,s,'#fff');p(ctx,8,5,s,'#fff');
        if(evo){p(ctx,1,9,s,c.accent);p(ctx,14,9,s,c.accent);p(ctx,0,10,s,c.accent);p(ctx,15,10,s,c.accent);}
    },
    _drawWormT: function(ctx,w,h,c,view,evo) {
        var s=w/16, p=this._p, n=evo?8:6;
        for(var i=0;i<n;i++){
            var x=7+Math.round(Math.sin(i*0.6)*2), y=4+i;
            var col=i%2===0?c.primary:c.secondary;
            p(ctx,x,y,s,col);p(ctx,x+1,y,s,col);
        }
        for(var x=6;x<10;x++){p(ctx,x,3,s,c.primary);p(ctx,x,2,s,c.primary);}
        if(view==='front'){p(ctx,7,2,s,'#fff');p(ctx,8,2,s,'#fff');}
        p(ctx,7,4,s,c.accent);p(ctx,8,4,s,c.accent);
        if(evo){p(ctx,5,4,s,c.accent);p(ctx,10,4,s,c.accent);p(ctx,4,3,s,c.accent);p(ctx,11,3,s,c.accent);}
    },
    _drawCoralT: function(ctx,w,h,c,view,evo) {
        var s=w/16, p=this._p, b=evo?1:0;
        for(var y=6-b;y<13+b;y++) for(var x=4-b;x<12+b;x++) {
            if(Math.abs(x-8)+Math.abs(y-9)<5+b) p(ctx,x,y,s,c.primary);
        }
        p(ctx,5,3,s,c.primary);p(ctx,5,4,s,c.primary);p(ctx,5,5,s,c.primary);
        p(ctx,10,3,s,c.primary);p(ctx,10,4,s,c.primary);p(ctx,10,5,s,c.primary);
        p(ctx,4,2,s,c.accent);p(ctx,6,2,s,c.accent);p(ctx,9,2,s,c.accent);p(ctx,11,2,s,c.accent);
        if(evo){p(ctx,3,4,s,c.primary);p(ctx,12,4,s,c.primary);p(ctx,2,3,s,c.accent);p(ctx,13,3,s,c.accent);}
        if(view==='front'){p(ctx,6,8,s,'#fff');p(ctx,9,8,s,'#fff');p(ctx,7,8,s,'#111');p(ctx,10,8,s,'#111');}
        for(var x=5;x<11;x++) p(ctx,x,13+b,s,c.secondary);
    },
    _drawRockBugT: function(ctx,w,h,c,view,evo) {
        var s=w/16, p=this._p, b=evo?1:0;
        for(var y=5-b;y<12+b;y++) for(var x=4-b;x<12+b;x++) {
            if(Math.abs(x-8)+Math.abs(y-8)<5+b) p(ctx,x,y,s,c.primary);
        }
        p(ctx,4,8,s,c.secondary);p(ctx,12,8,s,c.secondary);p(ctx,5,5,s,c.secondary);p(ctx,11,5,s,c.secondary);
        p(ctx,3-b,7,s,c.accent);p(ctx,3-b,9,s,c.accent);p(ctx,3-b,11,s,c.accent);
        p(ctx,12+b,7,s,c.accent);p(ctx,12+b,9,s,c.accent);p(ctx,12+b,11,s,c.accent);
        if(view==='front'){p(ctx,6,6,s,'#fff');p(ctx,9,6,s,'#fff');p(ctx,6,7,s,'#111');p(ctx,9,7,s,'#111');}
        p(ctx,6,4-b,s,c.primary);p(ctx,5,3-b,s,c.accent);p(ctx,10,4-b,s,c.primary);p(ctx,11,3-b,s,c.accent);
        if(evo){p(ctx,7,3,s,'#f1c40f');p(ctx,8,2,s,'#f1c40f');p(ctx,9,3,s,'#f1c40f');}
    },
    _drawCrystalT: function(ctx,w,h,c,view) {
        var s=w/16, p=this._p;
        for(var y=3;y<13;y++) for(var x=3;x<13;x++) {
            if(Math.abs(x-8)+Math.abs(y-8)<5) p(ctx,x,y,s,c.primary);
        }
        p(ctx,8,3,s,c.secondary);p(ctx,8,4,s,c.secondary);p(ctx,5,8,s,c.secondary);p(ctx,11,8,s,c.secondary);
        p(ctx,7,5,s,c.accent);p(ctx,9,5,s,c.accent);p(ctx,6,7,s,c.accent);p(ctx,10,7,s,c.accent);
        if(view==='front'){p(ctx,7,7,s,'#5dade2');p(ctx,9,7,s,'#5dade2');}
        p(ctx,4,5,s,'#f1c40f');p(ctx,12,5,s,'#f1c40f');p(ctx,3,8,s,'#f1c40f');p(ctx,13,8,s,'#f1c40f');
        p(ctx,6,12,s,c.accent);p(ctx,7,13,s,c.accent);p(ctx,9,12,s,c.accent);p(ctx,10,13,s,c.accent);
    },
    _drawSeedT: function(ctx,w,h,c,view) {
        var s=w/16, p=this._p;
        for(var y=5;y<13;y++) for(var x=4;x<12;x++) {
            if(Math.abs(x-8)+Math.abs(y-9)<5) p(ctx,x,y,s,c.primary);
        }
        p(ctx,7,3,s,'#27ae60');p(ctx,8,3,s,'#27ae60');p(ctx,7,4,s,'#2ecc71');p(ctx,8,4,s,'#2ecc71');
        p(ctx,6,2,s,'#27ae60');p(ctx,9,2,s,'#27ae60');
        if(view==='front'){p(ctx,6,8,s,'#111');p(ctx,9,8,s,'#111');}
        for(var x=6;x<10;x++) p(ctx,x,12,s,c.secondary);
    },

    // ===== EXISTING BEAST-SPECIFIC SHAPES =====
    _drawMouseT: function(ctx,w,h,c,view) {
        var s=w/16, p=this._p;
        for(var y=6;y<12;y++) for(var x=5;x<11;x++) p(ctx,x,y,s,c.primary);
        for(var y=3;y<7;y++) for(var x=5;x<11;x++) p(ctx,x,y,s,c.primary);
        p(ctx,4,2,s,c.primary);p(ctx,5,1,s,c.primary);p(ctx,5,2,s,c.secondary);
        p(ctx,11,2,s,c.primary);p(ctx,10,1,s,c.primary);p(ctx,10,2,s,c.secondary);
        p(ctx,11,9,s,c.secondary);p(ctx,12,8,s,c.secondary);p(ctx,13,9,s,c.secondary);p(ctx,14,8,s,c.secondary);
        if(view==='front'){p(ctx,6,4,s,'#111');p(ctx,9,4,s,'#111');}
        p(ctx,5,5,s,'#ff6347');p(ctx,10,5,s,'#ff6347');
        p(ctx,5,12,s,c.accent);p(ctx,10,12,s,c.accent);
    },
    _drawVoltrodeT: function(ctx,w,h,c,view) {
        var s=w/16, p=this._p;
        for(var y=5;y<12;y++) for(var x=4;x<12;x++) p(ctx,x,y,s,c.primary);
        for(var y=2;y<6;y++) for(var x=4;x<12;x++) p(ctx,x,y,s,c.primary);
        p(ctx,3,1,s,c.primary);p(ctx,4,0,s,c.primary);p(ctx,4,1,s,c.secondary);
        p(ctx,12,1,s,c.primary);p(ctx,11,0,s,c.primary);p(ctx,11,1,s,c.secondary);
        p(ctx,12,8,s,c.secondary);p(ctx,13,7,s,'#e74c3c');p(ctx,14,8,s,'#e74c3c');p(ctx,15,7,s,'#ff6347');
        if(view==='front'){p(ctx,5,4,s,'#111');p(ctx,10,4,s,'#111');}
        p(ctx,4,5,s,'#ff6347');p(ctx,11,5,s,'#ff6347');
        p(ctx,4,12,s,c.accent);p(ctx,5,12,s,c.accent);p(ctx,10,12,s,c.accent);p(ctx,11,12,s,c.accent);
        p(ctx,3,8,s,'#e74c3c');p(ctx,12,6,s,'#e74c3c');
    },
    _drawRockT: function(ctx,w,h,c,view) {
        var s=w/16, p=this._p;
        for(var y=4;y<13;y++) for(var x=3;x<13;x++) {
            if(Math.abs(x-8)+Math.abs(y-8)<7) p(ctx,x,y,s,c.primary);
        }
        p(ctx,6,6,s,c.secondary);p(ctx,7,7,s,c.secondary);p(ctx,9,5,s,c.secondary);
        p(ctx,5,9,s,c.accent);p(ctx,10,8,s,c.accent);
        if(view==='front'){p(ctx,5,6,s,'#111');p(ctx,10,6,s,'#111');}
        p(ctx,4,13,s,c.accent);p(ctx,5,13,s,c.accent);p(ctx,10,13,s,c.accent);p(ctx,11,13,s,c.accent);
    },
    _drawBouldrakeT: function(ctx,w,h,c,view) {
        var s=w/16, p=this._p;
        for(var y=3;y<14;y++) for(var x=2;x<14;x++) {
            if(Math.abs(x-8)+Math.abs(y-8)<7) p(ctx,x,y,s,c.primary);
        }
        p(ctx,5,5,s,c.secondary);p(ctx,7,6,s,c.secondary);p(ctx,10,5,s,c.secondary);
        if(view==='front'){p(ctx,5,5,s,'#fff');p(ctx,10,5,s,'#fff');p(ctx,6,5,s,'#111');p(ctx,10,6,s,'#111');}
        p(ctx,3,14,s,c.accent);p(ctx,4,14,s,c.accent);p(ctx,11,14,s,c.accent);p(ctx,12,14,s,c.accent);
        p(ctx,6,8,s,c.secondary);p(ctx,9,10,s,c.secondary);p(ctx,7,12,s,c.secondary);
    },

    generateUIElements: function(scene) {
        this.makeTexture(scene, 'ui_dialog', 320, 80, function(c) {
            c.fillStyle = 'rgba(0, 0, 0, 0.85)'; c.fillRect(0, 0, 320, 80);
            c.strokeStyle = '#fff'; c.lineWidth = 2; c.strokeRect(2, 2, 316, 76);
        });
        this.makeTexture(scene, 'ui_battle_bg', 320, 240, function(c) {
            var grad = c.createLinearGradient(0, 0, 0, 120);
            grad.addColorStop(0, '#87CEEB'); grad.addColorStop(1, '#b8e6b8');
            c.fillStyle = grad; c.fillRect(0, 0, 320, 120);
            c.fillStyle = '#7cba6d'; c.fillRect(0, 120, 320, 120);
        });
        var typeColors = { normal:'#a8a878', fire:'#f08030', water:'#6890f0', grass:'#78c850', electric:'#f8d030', ground:'#e0c068' };
        for (var type in typeColors) {
            (function(t, col) {
                SpriteGenerator.makeTexture(scene, 'type_' + t, 48, 16, function(c) {
                    c.fillStyle = col; c.fillRect(0, 0, 48, 16);
                    c.fillStyle = '#fff'; c.font = '9px monospace'; c.textAlign = 'center';
                    c.fillText(t.toUpperCase(), 24, 12);
                });
            })(type, typeColors[type]);
        }
        this.makeTexture(scene, 'ui_trap', 16, 16, function(c) {
            c.fillStyle='#e74c3c'; c.beginPath(); c.arc(8,8,7,0,Math.PI,true); c.fill();
            c.fillStyle='#ecf0f1'; c.beginPath(); c.arc(8,8,7,Math.PI,0,true); c.fill();
            c.fillStyle='#2c3e50'; c.fillRect(1,7,14,2);
            c.beginPath(); c.arc(8,8,3,0,Math.PI*2); c.fill();
            c.fillStyle='#fff'; c.beginPath(); c.arc(8,8,1.5,0,Math.PI*2); c.fill();
        });
        this.makeTexture(scene, 'ui_potion', 16, 16, function(c) {
            c.fillStyle='#9b59b6'; c.fillRect(6,2,4,4);
            c.fillStyle='#8e44ad'; c.fillRect(4,6,8,8);
            c.fillStyle='#c39bd3'; c.fillRect(5,7,3,3);
        });
    }
};

// Register beast shape mappings
(function() {
    var S = SpriteGenerator, sh = S._beastShapes;
    sh.emberon = function(c,w,h,co,v){S._drawLizardT(c,w,h,co,v,false);};
    sh.inferox = function(c,w,h,co,v){S._drawLizardT(c,w,h,co,v,true);};
    sh.tidalin = function(c,w,h,co,v){S._drawOtterT(c,w,h,co,v,false);};
    sh.tsunotter = function(c,w,h,co,v){S._drawOtterT(c,w,h,co,v,true);};
    sh.thornleaf = function(c,w,h,co,v){S._drawFoxT(c,w,h,co,v,false);};
    sh.briarvix = function(c,w,h,co,v){S._drawFoxT(c,w,h,co,v,true);};
    sh.sparkit = function(c,w,h,co,v){S._drawMouseT(c,w,h,co,v);};
    sh.voltrode = function(c,w,h,co,v){S._drawVoltrodeT(c,w,h,co,v);};
    sh.pebblor = function(c,w,h,co,v){S._drawRockT(c,w,h,co,v);};
    sh.bouldrake = function(c,w,h,co,v){S._drawBouldrakeT(c,w,h,co,v);};
    sh.breezlet = function(ctx,w,h,c,view) {
        var s=w/16, p=S._p;
        for(var y=6;y<11;y++) for(var x=5;x<11;x++) p(ctx,x,y,s,c.primary);
        for(var y=3;y<7;y++) for(var x=6;x<10;x++) p(ctx,x,y,s,c.primary);
        p(ctx,3,7,s,c.accent);p(ctx,4,7,s,c.accent);p(ctx,3,8,s,c.accent);
        p(ctx,12,7,s,c.accent);p(ctx,11,7,s,c.accent);p(ctx,12,8,s,c.accent);
        p(ctx,8,5,s,'#f39c12');p(ctx,8,4,s,'#f39c12');
        if(view==='front'){p(ctx,7,4,s,'#111');p(ctx,9,4,s,'#111');}
        p(ctx,7,11,s,c.accent);p(ctx,8,11,s,c.accent);p(ctx,8,12,s,c.accent);
        p(ctx,6,11,s,'#f39c12');p(ctx,9,11,s,'#f39c12');
    };
    sh.galewing = function(ctx,w,h,c,view) {
        var s=w/16, p=S._p;
        for(var y=5;y<11;y++) for(var x=5;x<11;x++) p(ctx,x,y,s,c.primary);
        for(var y=2;y<6;y++) for(var x=5;x<11;x++) p(ctx,x,y,s,c.primary);
        for(var i=0;i<4;i++){p(ctx,4-i,6+i,s,c.secondary);p(ctx,3-i,5+i,s,c.secondary);p(ctx,11+i,6+i,s,c.secondary);p(ctx,12+i,5+i,s,c.secondary);}
        p(ctx,8,4,s,'#f39c12');p(ctx,8,3,s,'#f39c12');
        if(view==='front'){p(ctx,6,3,s,'#111');p(ctx,9,3,s,'#111');}
        p(ctx,7,11,s,c.accent);p(ctx,8,11,s,c.secondary);p(ctx,2,7,s,'#27ae60');p(ctx,13,7,s,'#27ae60');
    };
    sh.flickerbug = function(ctx,w,h,c,view) {
        var s=w/16, p=S._p;
        for(var y=8;y<13;y++) for(var x=5;x<11;x++) p(ctx,x,y,s,c.secondary);
        for(var y=5;y<9;y++) for(var x=6;x<10;x++) p(ctx,x,y,s,c.primary);
        for(var y=2;y<6;y++) for(var x=6;x<10;x++) p(ctx,x,y,s,c.primary);
        p(ctx,4,6,s,'rgba(255,255,255,0.5)');p(ctx,3,5,s,'rgba(255,255,255,0.5)');
        p(ctx,11,6,s,'rgba(255,255,255,0.5)');p(ctx,12,5,s,'rgba(255,255,255,0.5)');
        p(ctx,6,1,s,c.primary);p(ctx,5,0,s,c.accent);p(ctx,9,1,s,c.primary);p(ctx,10,0,s,c.accent);
        if(view==='front'){p(ctx,7,3,s,'#ff0');p(ctx,8,3,s,'#ff0');}
        p(ctx,7,10,s,c.accent);p(ctx,8,10,s,c.accent);
    };
    sh.blazemoth = function(ctx,w,h,c,view) {
        var s=w/16, p=S._p;
        for(var y=6;y<11;y++) for(var x=5;x<11;x++) p(ctx,x,y,s,c.primary);
        for(var y=2;y<7;y++) for(var x=6;x<10;x++) p(ctx,x,y,s,c.primary);
        for(var i=0;i<4;i++){p(ctx,4-i,5+i,s,c.secondary);p(ctx,3-i,4+i,s,c.secondary);p(ctx,11+i,5+i,s,c.secondary);p(ctx,12+i,4+i,s,c.secondary);}
        p(ctx,1,7,s,c.accent);p(ctx,14,7,s,c.accent);
        p(ctx,6,1,s,c.primary);p(ctx,5,0,s,'#f1c40f');p(ctx,9,1,s,c.primary);p(ctx,10,0,s,'#f1c40f');
        if(view==='front'){p(ctx,7,3,s,'#ff0');p(ctx,8,3,s,'#ff0');}
        p(ctx,7,9,s,c.accent);p(ctx,8,9,s,c.accent);p(ctx,2,4,s,'#f1c40f');p(ctx,13,4,s,'#f1c40f');
    };
    sh.pudlop = function(ctx,w,h,c,view) {
        var s=w/16, p=S._p;
        for(var y=5;y<12;y++) for(var x=3;x<13;x++) p(ctx,x,y,s,c.primary);
        for(var y=2;y<6;y++) for(var x=3;x<13;x++) p(ctx,x,y,s,c.primary);
        p(ctx,4,1,s,'#fff');p(ctx,5,1,s,'#fff');p(ctx,4,2,s,'#fff');p(ctx,5,2,s,'#111');
        p(ctx,10,1,s,'#fff');p(ctx,11,1,s,'#fff');p(ctx,11,2,s,'#fff');p(ctx,10,2,s,'#111');
        for(var y=6;y<11;y++) for(var x=5;x<11;x++) p(ctx,x,y,s,c.secondary);
        p(ctx,2,11,s,c.accent);p(ctx,3,12,s,c.accent);p(ctx,4,12,s,c.accent);
        p(ctx,13,11,s,c.accent);p(ctx,12,12,s,c.accent);p(ctx,11,12,s,c.accent);
    };
    sh.toxitoad = function(ctx,w,h,c,view) {
        var s=w/16, p=S._p;
        for(var y=4;y<13;y++) for(var x=2;x<14;x++) p(ctx,x,y,s,c.primary);
        for(var y=1;y<5;y++) for(var x=3;x<13;x++) p(ctx,x,y,s,c.primary);
        p(ctx,3,0,s,'#fff');p(ctx,4,0,s,'#fff');p(ctx,3,1,s,'#fff');p(ctx,4,1,s,'#111');
        p(ctx,11,0,s,'#fff');p(ctx,12,0,s,'#fff');p(ctx,12,1,s,'#fff');p(ctx,11,1,s,'#111');
        for(var y=6;y<12;y++) for(var x=5;x<11;x++) p(ctx,x,y,s,c.secondary);
        p(ctx,3,6,s,c.accent);p(ctx,12,7,s,c.accent);p(ctx,4,10,s,c.accent);p(ctx,11,9,s,c.accent);
        p(ctx,1,12,s,c.accent);p(ctx,2,13,s,c.accent);p(ctx,14,12,s,c.accent);p(ctx,13,13,s,c.accent);
    };
    sh.vinewhip = function(ctx,w,h,c,view) {
        var s=w/16, p=S._p;
        for(var i=0;i<12;i++){var x=7+Math.round(Math.cos(i*0.8)*3);p(ctx,x,3+i,s,c.primary);p(ctx,x+1,3+i,s,c.primary);p(ctx,x-1,3+i,s,c.primary);}
        for(var y=2;y<5;y++) for(var x=5;x<10;x++) p(ctx,x,y,s,c.primary);
        p(ctx,7,6,s,c.secondary);p(ctx,8,8,s,c.secondary);p(ctx,6,10,s,c.secondary);
        if(view==='front'){p(ctx,6,3,s,c.accent);p(ctx,8,3,s,c.accent);}
        p(ctx,7,5,s,'#e74c3c');p(ctx,7,6,s,'#e74c3c');
    };
    sh.thornboa = function(ctx,w,h,c,view) {
        var s=w/16, p=S._p;
        for(var i=0;i<13;i++){var x=7+Math.round(Math.cos(i*0.7)*4);p(ctx,x,2+i,s,c.primary);p(ctx,x+1,2+i,s,c.primary);p(ctx,x-1,2+i,s,c.primary);p(ctx,x+2,2+i,s,c.primary);}
        for(var y=1;y<4;y++) for(var x=4;x<11;x++) p(ctx,x,y,s,c.primary);
        if(view==='front'){p(ctx,5,2,s,c.accent);p(ctx,9,2,s,c.accent);}
        p(ctx,7,4,s,'#e74c3c');p(ctx,3,6,s,c.accent);p(ctx,12,8,s,c.accent);p(ctx,4,10,s,c.accent);
    };
    sh.dustmole = function(ctx,w,h,c,view) {
        var s=w/16, p=S._p;
        for(var y=5;y<13;y++) for(var x=4;x<12;x++) p(ctx,x,y,s,c.primary);
        for(var y=2;y<6;y++) for(var x=5;x<11;x++) p(ctx,x,y,s,c.primary);
        p(ctx,8,3,s,'#e91e63');p(ctx,7,3,s,'#e91e63');
        p(ctx,3,9,s,c.secondary);p(ctx,2,10,s,c.secondary);p(ctx,3,11,s,c.secondary);
        p(ctx,12,9,s,c.secondary);p(ctx,13,10,s,c.secondary);p(ctx,12,11,s,c.secondary);
        if(view==='front'){p(ctx,6,4,s,'#111');p(ctx,9,4,s,'#111');}
        for(var y=7;y<12;y++){p(ctx,6,y,s,c.secondary);p(ctx,7,y,s,c.secondary);p(ctx,8,y,s,c.secondary);}
    };
    sh.terraclaw = function(ctx,w,h,c,view) {
        var s=w/16, p=S._p;
        for(var y=4;y<14;y++) for(var x=3;x<13;x++) p(ctx,x,y,s,c.primary);
        for(var y=1;y<5;y++) for(var x=4;x<12;x++) p(ctx,x,y,s,c.primary);
        p(ctx,8,2,s,'#e91e63');p(ctx,7,2,s,'#e91e63');
        p(ctx,2,8,s,c.secondary);p(ctx,1,9,s,c.secondary);p(ctx,2,10,s,c.secondary);p(ctx,1,7,s,c.secondary);
        p(ctx,13,8,s,c.secondary);p(ctx,14,9,s,c.secondary);p(ctx,13,10,s,c.secondary);p(ctx,14,7,s,c.secondary);
        if(view==='front'){p(ctx,5,3,s,'#111');p(ctx,10,3,s,'#111');}
        for(var y=6;y<13;y++){p(ctx,6,y,s,c.secondary);p(ctx,7,y,s,c.secondary);p(ctx,8,y,s,c.secondary);p(ctx,9,y,s,c.secondary);}
    };
    sh.zappfly = function(ctx,w,h,c,view) {
        var s=w/16, p=S._p;
        for(var y=3;y<13;y++){p(ctx,7,y,s,c.primary);p(ctx,8,y,s,c.primary);}
        for(var x=6;x<10;x++){p(ctx,x,2,s,c.primary);p(ctx,x,3,s,c.primary);}
        p(ctx,5,2,s,c.accent);p(ctx,6,2,s,c.accent);p(ctx,10,2,s,c.accent);p(ctx,9,2,s,c.accent);
        for(var i=0;i<3;i++){p(ctx,4-i,5+i,s,c.secondary);p(ctx,5-i,5+i,s,c.secondary);p(ctx,11+i,5+i,s,c.secondary);p(ctx,10+i,5+i,s,c.secondary);p(ctx,4-i,8+i,s,c.secondary);p(ctx,5-i,8+i,s,c.secondary);p(ctx,11+i,8+i,s,c.secondary);p(ctx,10+i,8+i,s,c.secondary);}
        p(ctx,7,13,s,c.accent);p(ctx,8,13,s,c.accent);p(ctx,6,6,s,'#ff0');p(ctx,9,9,s,'#ff0');
    };
    sh.stormwing = function(ctx,w,h,c,view) {
        var s=w/16, p=S._p;
        for(var y=3;y<13;y++){p(ctx,7,y,s,c.primary);p(ctx,8,y,s,c.primary);}
        for(var x=5;x<11;x++){p(ctx,x,2,s,c.primary);p(ctx,x,3,s,c.primary);}
        p(ctx,4,1,s,c.accent);p(ctx,5,1,s,c.accent);p(ctx,10,1,s,c.accent);p(ctx,11,1,s,c.accent);
        for(var i=0;i<4;i++){p(ctx,4-i,5+i,s,c.secondary);p(ctx,3-i,4+i,s,c.secondary);p(ctx,11+i,5+i,s,c.secondary);p(ctx,12+i,4+i,s,c.secondary);}
        p(ctx,7,13,s,c.accent);p(ctx,8,13,s,c.accent);p(ctx,7,14,s,'#2980b9');p(ctx,8,14,s,'#2980b9');
        p(ctx,5,6,s,'#ff0');p(ctx,10,8,s,'#ff0');
    };
    sh.shellbit = function(ctx,w,h,c,view) {
        var s=w/16, p=S._p;
        for(var y=4;y<12;y++) for(var x=3;x<13;x++){if(Math.abs(x-8)+Math.abs(y-8)<7) p(ctx,x,y,s,c.secondary);}
        p(ctx,7,6,s,c.accent);p(ctx,8,6,s,c.accent);p(ctx,9,6,s,c.accent);
        p(ctx,6,8,s,c.accent);p(ctx,8,8,s,c.accent);p(ctx,10,8,s,c.accent);
        for(var y=2;y<5;y++) for(var x=5;x<9;x++) p(ctx,x,y,s,c.primary);
        if(view==='front'){p(ctx,6,3,s,'#fff');p(ctx,7,3,s,'#111');}
        p(ctx,3,10,s,c.primary);p(ctx,4,11,s,c.primary);p(ctx,12,10,s,c.primary);p(ctx,11,11,s,c.primary);
        p(ctx,8,12,s,c.primary);p(ctx,8,13,s,c.primary);
    };
    sh.fortortus = function(ctx,w,h,c,view) {
        var s=w/16, p=S._p;
        for(var y=3;y<13;y++) for(var x=2;x<14;x++){if(Math.abs(x-8)+Math.abs(y-8)<7) p(ctx,x,y,s,c.secondary);}
        p(ctx,5,4,s,c.accent);p(ctx,10,4,s,c.accent);p(ctx,4,7,s,c.accent);p(ctx,11,7,s,c.accent);
        p(ctx,6,6,s,c.accent);p(ctx,9,6,s,c.accent);p(ctx,7,9,s,c.accent);p(ctx,8,9,s,c.accent);
        for(var y=1;y<4;y++) for(var x=4;x<10;x++) p(ctx,x,y,s,c.primary);
        if(view==='front'){p(ctx,5,2,s,'#fff');p(ctx,8,2,s,'#fff');p(ctx,6,2,s,'#111');p(ctx,9,2,s,'#111');}
        p(ctx,2,11,s,c.primary);p(ctx,3,12,s,c.primary);p(ctx,13,11,s,c.primary);p(ctx,12,12,s,c.primary);
        p(ctx,8,13,s,c.primary);p(ctx,7,13,s,c.primary);
    };
    // New lines
    sh.cinderpup = function(c,w,h,co,v){S._drawDogT(c,w,h,co,v,false);};
    sh.blazehound = function(c,w,h,co,v){S._drawDogT(c,w,h,co,v,true);};
    sh.frostfin = function(c,w,h,co,v){S._drawFishT(c,w,h,co,v,false);};
    sh.glacidon = function(c,w,h,co,v){S._drawFishT(c,w,h,co,v,true);};
    sh.mossprout = function(c,w,h,co,v){S._drawMushroomT(c,w,h,co,v,false);};
    sh.fungrowth = function(c,w,h,co,v){S._drawMushroomT(c,w,h,co,v,true);};
    sh.shadowkit = function(c,w,h,co,v){S._drawCatT(c,w,h,co,v,false);};
    sh.umbrawolf = function(c,w,h,co,v){S._drawCatT(c,w,h,co,v,true);};
    sh.pyrobat = function(c,w,h,co,v){S._drawBatT(c,w,h,co,v,false);};
    sh.infernowing = function(c,w,h,co,v){S._drawBatT(c,w,h,co,v,true);};
    sh.glimworm = function(c,w,h,co,v){S._drawWormT(c,w,h,co,v,false);};
    sh.luminare = function(c,w,h,co,v){S._drawWormT(c,w,h,co,v,true);};
    sh.coralite = function(c,w,h,co,v){S._drawCoralT(c,w,h,co,v,false);};
    sh.reefguard = function(c,w,h,co,v){S._drawCoralT(c,w,h,co,v,true);};
    sh.pebblit = function(c,w,h,co,v){S._drawRockBugT(c,w,h,co,v,false);};
    sh.geomite = function(c,w,h,co,v){S._drawRockBugT(c,w,h,co,v,true);};
    sh.seedpod = function(c,w,h,co,v){S._drawSeedT(c,w,h,co,v);};
    sh.crysteel = function(c,w,h,co,v){S._drawCrystalT(c,w,h,co,v);};
    sh.anthropobeast = function(ctx,w,h,c,view) {
        var s=w/16, p=S._p;
        // Brown curly hair
        for(var x=5;x<11;x++) p(ctx,x,1,s,c.primary);
        for(var x=4;x<12;x++) p(ctx,x,2,s,c.primary);
        p(ctx,4,3,s,c.primary);p(ctx,5,3,s,c.primary);p(ctx,10,3,s,c.primary);p(ctx,11,3,s,c.primary);
        // Hair curls
        p(ctx,3,2,s,c.primary);p(ctx,12,2,s,c.primary);p(ctx,3,3,s,c.primary);p(ctx,12,3,s,c.primary);
        // Face
        for(var y=3;y<7;y++) for(var x=5;x<11;x++) p(ctx,x,y,s,c.secondary);
        // Eyes
        if(view==='front'){p(ctx,6,4,s,'#2c3e50');p(ctx,9,4,s,'#2c3e50');}
        // Smile
        p(ctx,7,5,s,'#c0392b');p(ctx,8,5,s,'#c0392b');
        // Body (coat/suit)
        for(var y=7;y<12;y++) for(var x=4;x<12;x++) p(ctx,x,y,s,c.accent);
        // Shirt collar
        p(ctx,7,7,s,'#ecf0f1');p(ctx,8,7,s,'#ecf0f1');
        // Arms
        for(var y=7;y<11;y++){p(ctx,3,y,s,c.accent);p(ctx,12,y,s,c.accent);}
        // Hands
        p(ctx,3,11,s,c.secondary);p(ctx,12,11,s,c.secondary);
        // Legs
        p(ctx,6,12,s,'#2c3e50');p(ctx,7,12,s,'#2c3e50');p(ctx,8,12,s,'#2c3e50');p(ctx,9,12,s,'#2c3e50');
        p(ctx,6,13,s,'#2c3e50');p(ctx,7,13,s,'#2c3e50');p(ctx,8,13,s,'#2c3e50');p(ctx,9,13,s,'#2c3e50');
        // Aura glow
        p(ctx,2,5,s,'rgba(241,196,15,0.3)');p(ctx,13,5,s,'rgba(241,196,15,0.3)');
        p(ctx,2,8,s,'rgba(52,152,219,0.3)');p(ctx,13,8,s,'rgba(52,152,219,0.3)');
    };
})();
