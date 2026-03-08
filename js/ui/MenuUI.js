var MenuUI = {
    isOpen: false,
    container: null,
    scene: null,
    selectedIndex: 0,
    subMenu: null,

    open: function(scene) {
        if (this.isOpen) return;
        this.isOpen = true;
        this.scene = scene;
        this.selectedIndex = 0;
        this._draw();
    },

    close: function() {
        this.isOpen = false;
        if (this.container) { this.container.destroy(); this.container = null; }
        if (this.subMenu) { this.subMenu.destroy(); this.subMenu = null; }
    },

    _draw: function() {
        var scene = this.scene;
        var cam = scene.cameras.main;
        var w = cam.width;

        if (this.container) this.container.destroy();
        this.container = scene.add.container(0, 0).setDepth(500).setScrollFactor(0);

        // Dim overlay
        var overlay = scene.add.graphics();
        overlay.fillStyle(0x000000, 0.5);
        overlay.fillRect(0, 0, cam.width, cam.height);
        overlay.setInteractive(new Phaser.Geom.Rectangle(0, 0, cam.width, cam.height), Phaser.Geom.Rectangle.Contains);
        this.container.add(overlay);

        // Menu panel
        var panelW = 180, panelH = 375;
        var px = w - panelW - 10, py = 10;

        var bg = scene.add.graphics();
        bg.fillStyle(0x1a1a2e, 0.95);
        bg.fillRoundedRect(px, py, panelW, panelH, 8);
        bg.lineStyle(2, 0xf1c40f, 0.8);
        bg.strokeRoundedRect(px, py, panelW, panelH, 8);
        this.container.add(bg);

        // Title
        this.container.add(scene.add.text(px + panelW / 2, py + 12, 'MENU', {
            fontSize: '14px', fontFamily: 'monospace', color: '#f1c40f', fontStyle: 'bold'
        }).setOrigin(0.5));

        // Menu items
        var items = ['Team', 'Bag', 'Monsterdex', 'Map', 'Badges', 'Save', 'Multiplayer', 'Fullscreen', 'Close'];
        this.menuItems = [];

        for (var i = 0; i < items.length; i++) {
            var iy = py + 35 + i * 36;
            var color = i === this.selectedIndex ? '#f1c40f' : '#ecf0f1';
            var prefix = i === this.selectedIndex ? '> ' : '  ';

            var itemText = scene.add.text(px + 15, iy, prefix + items[i], {
                fontSize: '13px', fontFamily: 'monospace', color: color
            }).setInteractive();
            this.container.add(itemText);
            this.menuItems.push(itemText);

            (function(idx) {
                itemText.on('pointerdown', function() {
                    MenuUI.selectedIndex = idx;
                    MenuUI._selectItem(idx);
                });
            })(i);
        }

        // Player info at bottom
        this.container.add(scene.add.text(px + 10, py + panelH - 30, PlayerState.name + ' | Badges: ' + PlayerState.badges.length, {
            fontSize: '9px', fontFamily: 'monospace', color: '#7f8c8d'
        }));
    },

    _selectItem: function(idx) {
        switch(idx) {
            case 0: this._showTeam(); break;
            case 1: this._showBag(); break;
            case 2: this._showMonsterdex(); break;
            case 3: this._showMap(); break;
            case 4: this._showBadges(); break;
            case 5: this._saveGame(); break;
            case 6: this._showMultiplayer(); break;
            case 7: this._toggleFullscreen(); break;
            case 8: this.close(); break;
        }
    },

    _showTeam: function() {
        var scene = this.scene;
        var cam = scene.cameras.main;
        if (this.subMenu) this.subMenu.destroy();

        this.subMenu = scene.add.container(0, 0).setDepth(600).setScrollFactor(0);

        var bg = scene.add.graphics();
        bg.fillStyle(0x1a1a2e, 0.97);
        bg.fillRect(0, 0, cam.width, cam.height);
        this.subMenu.add(bg);

        this.subMenu.add(scene.add.text(cam.width / 2, 15, 'YOUR TEAM', {
            fontSize: '16px', fontFamily: 'monospace', color: '#f1c40f', fontStyle: 'bold'
        }).setOrigin(0.5));

        for (var i = 0; i < PlayerState.team.length; i++) {
            var beast = PlayerState.team[i];
            var base = BEASTS[beast.id];
            var maxHP = PlayerState.calcStats(base.baseStats, beast.level).hp + beast.level;
            var by = 40 + i * 58;

            // Beast icon
            this.subMenu.add(scene.add.image(30, by + 20, 'beast_' + beast.id + '_icon').setScale(0.8));

            // Info
            this.subMenu.add(scene.add.text(55, by, beast.name + ' L' + beast.level, {
                fontSize: '12px', fontFamily: 'monospace', color: '#fff', fontStyle: 'bold'
            }));

            var hpColor = beast.currentHP / maxHP > 0.5 ? '#2ecc71' : (beast.currentHP / maxHP > 0.2 ? '#f39c12' : '#e74c3c');
            this.subMenu.add(scene.add.text(55, by + 16, 'HP: ' + beast.currentHP + '/' + maxHP, {
                fontSize: '10px', fontFamily: 'monospace', color: hpColor
            }));

            this.subMenu.add(scene.add.text(55, by + 30, 'ATK:' + beast.stats.atk + ' DEF:' + beast.stats.def + ' SPD:' + beast.stats.spd, {
                fontSize: '9px', fontFamily: 'monospace', color: '#7f8c8d'
            }));

            var movesStr = beast.moves.map(function(m) { return MOVES[m] ? MOVES[m].name : m; }).join(', ');
            this.subMenu.add(scene.add.text(55, by + 42, movesStr, {
                fontSize: '8px', fontFamily: 'monospace', color: '#95a5a6'
            }));
        }

        // Close button
        var closeBtn = scene.add.text(cam.width / 2, cam.height - 30, '[ Back ]', {
            fontSize: '14px', fontFamily: 'monospace', color: '#e74c3c'
        }).setOrigin(0.5).setInteractive();
        closeBtn.on('pointerdown', function() {
            if (MenuUI.subMenu) { MenuUI.subMenu.destroy(); MenuUI.subMenu = null; }
        });
        this.subMenu.add(closeBtn);
    },

    _showBag: function() {
        var scene = this.scene;
        var cam = scene.cameras.main;
        if (this.subMenu) this.subMenu.destroy();

        this.subMenu = scene.add.container(0, 0).setDepth(600).setScrollFactor(0);

        var bg = scene.add.graphics();
        bg.fillStyle(0x1a1a2e, 0.97);
        bg.fillRect(0, 0, cam.width, cam.height);
        this.subMenu.add(bg);

        this.subMenu.add(scene.add.text(cam.width / 2, 20, 'BAG', {
            fontSize: '16px', fontFamily: 'monospace', color: '#f1c40f', fontStyle: 'bold'
        }).setOrigin(0.5));

        this.subMenu.add(scene.add.text(30, 60, 'Potions: ' + PlayerState.inventory.potions + '  (Heals 20 HP)', {
            fontSize: '12px', fontFamily: 'monospace', color: '#ecf0f1'
        }));

        this.subMenu.add(scene.add.text(30, 85, 'Friendship Orbs: ' + (PlayerState.inventory.friendshipOrbs || 0), {
            fontSize: '12px', fontFamily: 'monospace', color: '#ecf0f1'
        }));

        this.subMenu.add(scene.add.text(30, 110, 'Simple Orbs: ' + (PlayerState.inventory.simpleFriendshipOrbs || 0), {
            fontSize: '12px', fontFamily: 'monospace', color: '#ecf0f1'
        }));

        this.subMenu.add(scene.add.text(30, 135, 'XP Gains: ' + (PlayerState.inventory.xpGains || 0), {
            fontSize: '12px', fontFamily: 'monospace', color: '#ecf0f1'
        }));

        if (PlayerState.inventory.xpGains > 0) {
            var useXPBtn = scene.add.text(30, 158, '[ Use XP Gain ]', {
                fontSize: '12px', fontFamily: 'monospace', color: '#2ecc71'
            }).setInteractive();
            this.subMenu.add(useXPBtn);

            useXPBtn.on('pointerdown', function() {
                MenuUI._showXPGainTarget();
            });
        }

        var closeBtn = scene.add.text(cam.width / 2, cam.height - 30, '[ Back ]', {
            fontSize: '14px', fontFamily: 'monospace', color: '#e74c3c'
        }).setOrigin(0.5).setInteractive();
        closeBtn.on('pointerdown', function() {
            if (MenuUI.subMenu) { MenuUI.subMenu.destroy(); MenuUI.subMenu = null; }
        });
        this.subMenu.add(closeBtn);
    },

    _showXPGainTarget: function() {
        var scene = this.scene;
        var cam = scene.cameras.main;
        if (this.subMenu) this.subMenu.destroy();

        this.subMenu = scene.add.container(0, 0).setDepth(600).setScrollFactor(0);

        var bg = scene.add.graphics();
        bg.fillStyle(0x1a1a2e, 0.97);
        bg.fillRect(0, 0, cam.width, cam.height);
        this.subMenu.add(bg);

        this.subMenu.add(scene.add.text(cam.width / 2, 20, 'USE XP GAIN', {
            fontSize: '16px', fontFamily: 'monospace', color: '#f1c40f', fontStyle: 'bold'
        }).setOrigin(0.5));

        this.subMenu.add(scene.add.text(cam.width / 2, 45, 'Choose a beast to level up:', {
            fontSize: '11px', fontFamily: 'monospace', color: '#95a5a6'
        }).setOrigin(0.5));

        for (var i = 0; i < PlayerState.team.length; i++) {
            var beast = PlayerState.team[i];
            var by = 70 + i * 45;
            var canUse = beast.currentHP > 0 && beast.level < 50;
            var color = canUse ? '#2ecc71' : '#7f8c8d';

            var btn = scene.add.text(30, by, beast.name + ' L' + beast.level + (canUse ? ' [ Level Up ]' : ' (can\'t use)'), {
                fontSize: '12px', fontFamily: 'monospace', color: color
            }).setInteractive();
            this.subMenu.add(btn);

            if (canUse) {
                (function(idx) {
                    btn.on('pointerdown', function() {
                        var result = PlayerState.useXPGain(idx);
                        if (result) {
                            var beast = PlayerState.team[idx];
                            var msgs = [beast.name + ' grew to level ' + beast.level + '!'];
                            if (result.evolved) {
                                msgs.push('What? ' + beast.name + ' is evolving!');
                                msgs.push('Congratulations! Your beast evolved into ' + beast.name + '!');
                            }
                            PlayerState.save();
                            if (MenuUI.subMenu) { MenuUI.subMenu.destroy(); MenuUI.subMenu = null; }
                            MenuUI.close();
                            DialogManager.showDialog(msgs);
                        }
                    });
                })(i);
            }
        }

        var closeBtn = scene.add.text(cam.width / 2, cam.height - 30, '[ Back ]', {
            fontSize: '14px', fontFamily: 'monospace', color: '#e74c3c'
        }).setOrigin(0.5).setInteractive();
        closeBtn.on('pointerdown', function() {
            if (MenuUI.subMenu) { MenuUI.subMenu.destroy(); MenuUI.subMenu = null; }
            MenuUI._showBag();
        });
        this.subMenu.add(closeBtn);
    },

    _showMonsterdex: function() {
        var scene = this.scene;
        var cam = scene.cameras.main;
        if (this.subMenu) this.subMenu.destroy();

        this.subMenu = scene.add.container(0, 0).setDepth(600).setScrollFactor(0);

        var bg = scene.add.graphics();
        bg.fillStyle(0x1a1a2e, 0.97);
        bg.fillRect(0, 0, cam.width, cam.height);
        this.subMenu.add(bg);

        // Build ordered beast list (exclude anthropobeast from normal dex)
        var beastOrder = [];
        for (var key in BEASTS) {
            if (key === 'anthropobeast') continue;
            beastOrder.push(key);
        }

        // Sort: base forms first, then evolutions follow their base
        var visited = {};
        var sorted = [];
        function addChain(id) {
            if (visited[id]) return;
            visited[id] = true;
            var b = BEASTS[id];
            // Find root of chain
            if (b.evolvesFrom && BEASTS[b.evolvesFrom] && !visited[b.evolvesFrom]) {
                addChain(b.evolvesFrom);
                if (!visited[id]) { visited[id] = true; sorted.push(id); }
                return;
            }
            sorted.push(id);
            // Add evolutions
            if (b.evolvesTo && BEASTS[b.evolvesTo]) {
                addChain(b.evolvesTo);
            }
        }
        for (var i = 0; i < beastOrder.length; i++) addChain(beastOrder[i]);

        // Add anthropobeast at end if seen/caught
        if (PlayerState.seenBeasts.indexOf('anthropobeast') >= 0 || PlayerState.caughtBeasts.indexOf('anthropobeast') >= 0) {
            sorted.push('anthropobeast');
        }

        var totalBeasts = sorted.length;
        var caughtCount = 0;
        for (var i = 0; i < sorted.length; i++) {
            if (PlayerState.caughtBeasts.indexOf(sorted[i]) >= 0) caughtCount++;
        }

        // Pagination
        var perPage = 7;
        this._dexPage = this._dexPage || 0;
        var maxPage = Math.max(0, Math.ceil(totalBeasts / perPage) - 1);
        if (this._dexPage > maxPage) this._dexPage = maxPage;
        var startIdx = this._dexPage * perPage;

        // Title
        this.subMenu.add(scene.add.text(cam.width / 2, 12, 'MONSTERDEX', {
            fontSize: '16px', fontFamily: 'monospace', color: '#f1c40f', fontStyle: 'bold'
        }).setOrigin(0.5));

        // Count
        this.subMenu.add(scene.add.text(cam.width / 2, 32, 'Caught: ' + caughtCount + ' / ' + totalBeasts, {
            fontSize: '10px', fontFamily: 'monospace', color: '#95a5a6'
        }).setOrigin(0.5));

        var typeColors = {
            fire: '#e74c3c', water: '#3498db', grass: '#2ecc71', electric: '#f1c40f',
            ground: '#95a5a6', normal: '#bdc3c7'
        };

        for (var i = startIdx; i < Math.min(startIdx + perPage, totalBeasts); i++) {
            var beastId = sorted[i];
            var beast = BEASTS[beastId];
            var seen = PlayerState.seenBeasts.indexOf(beastId) >= 0;
            var caught = PlayerState.caughtBeasts.indexOf(beastId) >= 0;
            var row = i - startIdx;
            var ry = 50 + row * 52;

            // Dex number
            var dexNum = '#' + String(i + 1);
            while (dexNum.length < 4) dexNum = dexNum.charAt(0) + '0' + dexNum.substring(1);
            this.subMenu.add(scene.add.text(8, ry + 2, dexNum, {
                fontSize: '9px', fontFamily: 'monospace', color: '#7f8c8d'
            }));

            if (caught) {
                // Full info with icon
                this.subMenu.add(scene.add.image(45, ry + 18, 'beast_' + beastId + '_icon').setScale(0.7));
                this.subMenu.add(scene.add.text(65, ry, beast.name, {
                    fontSize: '12px', fontFamily: 'monospace', color: '#ecf0f1', fontStyle: 'bold'
                }));
                var typeStr = beast.type.charAt(0).toUpperCase() + beast.type.slice(1);
                if (beast.type2) typeStr += ' / ' + beast.type2.charAt(0).toUpperCase() + beast.type2.slice(1);
                this.subMenu.add(scene.add.text(65, ry + 16, typeStr, {
                    fontSize: '9px', fontFamily: 'monospace', color: typeColors[beast.type] || '#bdc3c7'
                }));

                // Tap for detail
                var detailBtn = scene.add.text(65, ry + 30, '[ Details ]', {
                    fontSize: '8px', fontFamily: 'monospace', color: '#3498db'
                }).setInteractive();
                this.subMenu.add(detailBtn);
                (function(bid) {
                    detailBtn.on('pointerdown', function() {
                        MenuUI._showDexDetail(bid);
                    });
                })(beastId);
            } else if (seen) {
                // Name visible but dimmed, no icon detail
                this.subMenu.add(scene.add.text(45, ry + 8, '?', {
                    fontSize: '20px', fontFamily: 'monospace', color: '#555'
                }));
                this.subMenu.add(scene.add.text(65, ry, beast.name, {
                    fontSize: '12px', fontFamily: 'monospace', color: '#7f8c8d'
                }));
                this.subMenu.add(scene.add.text(65, ry + 16, 'Seen - not caught', {
                    fontSize: '9px', fontFamily: 'monospace', color: '#555'
                }));
            } else {
                // Unknown
                this.subMenu.add(scene.add.text(45, ry + 8, '?', {
                    fontSize: '20px', fontFamily: 'monospace', color: '#333'
                }));
                this.subMenu.add(scene.add.text(65, ry, '???', {
                    fontSize: '12px', fontFamily: 'monospace', color: '#444'
                }));
            }
        }

        // Page nav
        var pageText = 'Page ' + (this._dexPage + 1) + '/' + (maxPage + 1);
        this.subMenu.add(scene.add.text(cam.width / 2, cam.height - 55, pageText, {
            fontSize: '10px', fontFamily: 'monospace', color: '#95a5a6'
        }).setOrigin(0.5));

        if (this._dexPage > 0) {
            var prevBtn = scene.add.text(30, cam.height - 55, '< Prev', {
                fontSize: '11px', fontFamily: 'monospace', color: '#3498db'
            }).setInteractive();
            prevBtn.on('pointerdown', function() {
                MenuUI._dexPage--;
                MenuUI._showMonsterdex();
            });
            this.subMenu.add(prevBtn);
        }

        if (this._dexPage < maxPage) {
            var nextBtn = scene.add.text(cam.width - 30, cam.height - 55, 'Next >', {
                fontSize: '11px', fontFamily: 'monospace', color: '#3498db'
            }).setOrigin(1, 0).setInteractive();
            nextBtn.on('pointerdown', function() {
                MenuUI._dexPage++;
                MenuUI._showMonsterdex();
            });
            this.subMenu.add(nextBtn);
        }

        // Back button
        var closeBtn = scene.add.text(cam.width / 2, cam.height - 30, '[ Back ]', {
            fontSize: '14px', fontFamily: 'monospace', color: '#e74c3c'
        }).setOrigin(0.5).setInteractive();
        closeBtn.on('pointerdown', function() {
            MenuUI._dexPage = 0;
            if (MenuUI.subMenu) { MenuUI.subMenu.destroy(); MenuUI.subMenu = null; }
        });
        this.subMenu.add(closeBtn);
    },

    _showDexDetail: function(beastId) {
        var scene = this.scene;
        var cam = scene.cameras.main;
        if (this.subMenu) this.subMenu.destroy();

        this.subMenu = scene.add.container(0, 0).setDepth(600).setScrollFactor(0);

        var bg = scene.add.graphics();
        bg.fillStyle(0x1a1a2e, 0.97);
        bg.fillRect(0, 0, cam.width, cam.height);
        this.subMenu.add(bg);

        var beast = BEASTS[beastId];

        // Beast sprite
        this.subMenu.add(scene.add.image(cam.width / 2, 70, 'beast_' + beastId + '_front').setScale(3));

        // Name
        this.subMenu.add(scene.add.text(cam.width / 2, 120, beast.name, {
            fontSize: '18px', fontFamily: 'monospace', color: '#f1c40f', fontStyle: 'bold'
        }).setOrigin(0.5));

        // Type
        var typeStr = beast.type.charAt(0).toUpperCase() + beast.type.slice(1);
        if (beast.type2) typeStr += ' / ' + beast.type2.charAt(0).toUpperCase() + beast.type2.slice(1);
        this.subMenu.add(scene.add.text(cam.width / 2, 140, typeStr, {
            fontSize: '11px', fontFamily: 'monospace', color: '#bdc3c7'
        }).setOrigin(0.5));

        // Description
        this.subMenu.add(scene.add.text(cam.width / 2, 162, beast.desc, {
            fontSize: '10px', fontFamily: 'monospace', color: '#95a5a6',
            wordWrap: { width: cam.width - 40 }, align: 'center'
        }).setOrigin(0.5, 0));

        // Base stats
        var statsY = 200;
        this.subMenu.add(scene.add.text(cam.width / 2, statsY, 'BASE STATS', {
            fontSize: '11px', fontFamily: 'monospace', color: '#f1c40f', fontStyle: 'bold'
        }).setOrigin(0.5));

        var stats = beast.baseStats;
        var statNames = ['HP', 'ATK', 'DEF', 'SPD'];
        var statVals = [stats.hp, stats.atk, stats.def, stats.spd];
        for (var i = 0; i < 4; i++) {
            var sy = statsY + 18 + i * 18;
            this.subMenu.add(scene.add.text(40, sy, statNames[i], {
                fontSize: '10px', fontFamily: 'monospace', color: '#bdc3c7'
            }));
            this.subMenu.add(scene.add.text(80, sy, '' + statVals[i], {
                fontSize: '10px', fontFamily: 'monospace', color: '#ecf0f1', fontStyle: 'bold'
            }));
            // Stat bar
            var barGfx = scene.add.graphics();
            var barW = Math.min(statVals[i], 120);
            barGfx.fillStyle(0x333333, 1);
            barGfx.fillRect(110, sy + 2, 120, 8);
            var barColor = statVals[i] >= 80 ? 0x2ecc71 : (statVals[i] >= 50 ? 0xf1c40f : 0xe74c3c);
            barGfx.fillStyle(barColor, 1);
            barGfx.fillRect(110, sy + 2, barW, 8);
            this.subMenu.add(barGfx);
        }

        // Evolution chain
        var evoY = statsY + 95;
        var chain = [];
        // Find root
        var root = beastId;
        while (BEASTS[root] && BEASTS[root].evolvesFrom) root = BEASTS[root].evolvesFrom;
        // Walk forward
        var cur = root;
        while (cur && BEASTS[cur]) {
            chain.push(cur);
            cur = BEASTS[cur].evolvesTo || null;
        }

        if (chain.length > 1) {
            this.subMenu.add(scene.add.text(cam.width / 2, evoY, 'EVOLUTION', {
                fontSize: '11px', fontFamily: 'monospace', color: '#f1c40f', fontStyle: 'bold'
            }).setOrigin(0.5));

            var evoSpacing = Math.min(80, (cam.width - 40) / chain.length);
            var evoStartX = cam.width / 2 - ((chain.length - 1) * evoSpacing) / 2;
            for (var e = 0; e < chain.length; e++) {
                var ex = evoStartX + e * evoSpacing;
                var ey = evoY + 25;
                var eName = BEASTS[chain[e]].name;
                var isCurrent = chain[e] === beastId;

                this.subMenu.add(scene.add.image(ex, ey, 'beast_' + chain[e] + '_icon').setScale(0.6));
                this.subMenu.add(scene.add.text(ex, ey + 18, eName, {
                    fontSize: '7px', fontFamily: 'monospace', color: isCurrent ? '#f1c40f' : '#7f8c8d'
                }).setOrigin(0.5));

                if (e < chain.length - 1) {
                    var evoLevel = BEASTS[chain[e]].evolvesAt;
                    this.subMenu.add(scene.add.text(ex + evoSpacing / 2, ey - 4, 'L' + evoLevel, {
                        fontSize: '7px', fontFamily: 'monospace', color: '#555'
                    }).setOrigin(0.5));
                    this.subMenu.add(scene.add.text(ex + evoSpacing / 2, ey + 4, '\u2192', {
                        fontSize: '10px', fontFamily: 'monospace', color: '#555'
                    }).setOrigin(0.5));
                }
            }
        }

        // Back button
        var closeBtn = scene.add.text(cam.width / 2, cam.height - 30, '[ Back ]', {
            fontSize: '14px', fontFamily: 'monospace', color: '#e74c3c'
        }).setOrigin(0.5).setInteractive();
        closeBtn.on('pointerdown', function() {
            MenuUI._showMonsterdex();
        });
        this.subMenu.add(closeBtn);
    },

    _showMap: function() {
        var scene = this.scene;
        var cam = scene.cameras.main;
        if (this.subMenu) this.subMenu.destroy();

        this.subMenu = scene.add.container(0, 0).setDepth(600).setScrollFactor(0);

        var bg = scene.add.graphics();
        bg.fillStyle(0x1a1a2e, 0.97);
        bg.fillRect(0, 0, cam.width, cam.height);
        this.subMenu.add(bg);

        this.subMenu.add(scene.add.text(cam.width / 2, 15, 'WORLD MAP', {
            fontSize: '16px', fontFamily: 'monospace', color: '#f1c40f', fontStyle: 'bold'
        }).setOrigin(0.5));

        // Determine current exterior map for highlighting
        var currentMap = PlayerState.position.map;
        if (typeof MAPS !== 'undefined' && MAPS[currentMap] && MAPS[currentMap].isInterior) {
            currentMap = MAPS[currentMap].exteriorMap || currentMap;
        }

        // Node definitions with layout positions (relative to cam center)
        var cx = cam.width / 2;
        var mapH = cam.height - 80; // usable height (below title, above back button)
        var topY = 45;
        var stepY = mapH / 9;

        var nodes = [
            { key: 'town',       name: 'Breezeholm',       x: cx,        y: topY + stepY * 0.5, color: 0xf1c40f },
            { key: 'route1',     name: 'Route 1',          x: cx,        y: topY + stepY * 1.3, color: 0xecf0f1 },
            { key: 'route2',     name: 'Route 2',          x: cx,        y: topY + stepY * 2.1, color: 0xecf0f1 },
            { key: 'mistyWoods', name: 'Misty Woods',      x: cx - 30,   y: topY + stepY * 3.0, color: 0x2ecc71 },
            { key: 'mountainPath', name: 'Crystal Peak',    x: cx - 80,  y: topY + stepY * 3.9, color: 0x95a5a6 },
            { key: 'route3',     name: 'Route 3',          x: cx + 40,   y: topY + stepY * 3.9, color: 0xecf0f1 },
            { key: 'gymCity',    name: 'Tidepool City',     x: cx + 40,  y: topY + stepY * 4.9, color: 0xf1c40f },
            { key: 'route4',     name: 'Route 4',          x: cx + 40,  y: topY + stepY * 5.9, color: 0xecf0f1 },
            { key: 'stormridgeCity', name: 'Stormridge City', x: cx + 40, y: topY + stepY * 6.9, color: 0xf1c40f }
        ];

        // Build lookup for drawing connections
        var nodeMap = {};
        for (var i = 0; i < nodes.length; i++) {
            nodeMap[nodes[i].key] = nodes[i];
        }

        // Connections between nodes
        var connections = [
            ['town', 'route1'],
            ['route1', 'route2'],
            ['route2', 'mistyWoods'],
            ['mistyWoods', 'mountainPath'],
            ['mistyWoods', 'route3'],
            ['route3', 'gymCity'],
            ['gymCity', 'route4'],
            ['route4', 'stormridgeCity']
        ];

        // Draw connection lines
        var lineGfx = scene.add.graphics();
        lineGfx.lineStyle(2, 0x7f8c8d, 0.6);
        for (var c = 0; c < connections.length; c++) {
            var a = nodeMap[connections[c][0]];
            var b = nodeMap[connections[c][1]];
            if (a && b) {
                lineGfx.beginPath();
                lineGfx.moveTo(a.x, a.y);
                lineGfx.lineTo(b.x, b.y);
                lineGfx.strokePath();
            }
        }
        this.subMenu.add(lineGfx);

        // Draw nodes
        var nodeGfx = scene.add.graphics();
        for (var n = 0; n < nodes.length; n++) {
            var node = nodes[n];
            var isCurrent = (node.key === currentMap);
            var radius = isCurrent ? 8 : 5;

            if (isCurrent) {
                // Glow ring for current location
                nodeGfx.lineStyle(3, 0xf39c12, 0.7);
                nodeGfx.strokeCircle(node.x, node.y, 12);
            }

            nodeGfx.fillStyle(node.color, isCurrent ? 1 : 0.7);
            nodeGfx.fillCircle(node.x, node.y, radius);

            // Label
            var labelColor = isCurrent ? '#f1c40f' : '#bdc3c7';
            var labelStyle = isCurrent ? 'bold' : '';
            var label = scene.add.text(node.x, node.y + radius + 6, node.name, {
                fontSize: '9px', fontFamily: 'monospace', color: labelColor, fontStyle: labelStyle
            }).setOrigin(0.5, 0);
            this.subMenu.add(label);

            if (isCurrent) {
                var arrow = scene.add.text(node.x, node.y - radius - 10, '\u25BC', {
                    fontSize: '10px', fontFamily: 'monospace', color: '#f39c12'
                }).setOrigin(0.5, 1);
                this.subMenu.add(arrow);

                // Pulse the arrow
                scene.tweens.add({
                    targets: arrow,
                    y: arrow.y - 4,
                    duration: 600,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        }
        this.subMenu.add(nodeGfx);

        // Back button
        var closeBtn = scene.add.text(cam.width / 2, cam.height - 30, '[ Back ]', {
            fontSize: '14px', fontFamily: 'monospace', color: '#e74c3c'
        }).setOrigin(0.5).setInteractive();
        closeBtn.on('pointerdown', function() {
            if (MenuUI.subMenu) { MenuUI.subMenu.destroy(); MenuUI.subMenu = null; }
        });
        this.subMenu.add(closeBtn);
    },

    _showBadges: function() {
        var scene = this.scene;
        var cam = scene.cameras.main;
        if (this.subMenu) this.subMenu.destroy();

        this.subMenu = scene.add.container(0, 0).setDepth(600).setScrollFactor(0);

        var bg = scene.add.graphics();
        bg.fillStyle(0x1a1a2e, 0.97);
        bg.fillRect(0, 0, cam.width, cam.height);
        this.subMenu.add(bg);

        this.subMenu.add(scene.add.text(cam.width / 2, 15, 'BADGES', {
            fontSize: '16px', fontFamily: 'monospace', color: '#f1c40f', fontStyle: 'bold'
        }).setOrigin(0.5));

        var allBadges = [
            { key: 'tidepool', name: 'Tidepool Badge', leader: 'Marina', type: 'Water', color: 0x3498db, accent: '#3498db' },
            { key: 'stormridge', name: 'Stormridge Badge', leader: 'Volt', type: 'Electric', color: 0xf1c40f, accent: '#f1c40f' }
        ];

        var cx = cam.width / 2;
        var startY = 55;

        for (var i = 0; i < allBadges.length; i++) {
            var badge = allBadges[i];
            var earned = PlayerState.badges.indexOf(badge.key) >= 0;
            var by = startY + i * 100;

            // Badge shape (octagonal gem)
            var badgeGfx = scene.add.graphics();
            if (earned) {
                badgeGfx.fillStyle(badge.color, 1);
                badgeGfx.lineStyle(2, 0xffffff, 0.8);
            } else {
                badgeGfx.fillStyle(0x333333, 0.5);
                badgeGfx.lineStyle(2, 0x555555, 0.5);
            }
            // Draw octagon
            var bx = cx - 60, bcy = by + 30, br = 22;
            var points = [];
            for (var a = 0; a < 8; a++) {
                var angle = (a * Math.PI * 2 / 8) - Math.PI / 8;
                points.push({ x: bx + Math.cos(angle) * br, y: bcy + Math.sin(angle) * br });
            }
            badgeGfx.beginPath();
            badgeGfx.moveTo(points[0].x, points[0].y);
            for (var p = 1; p < points.length; p++) badgeGfx.lineTo(points[p].x, points[p].y);
            badgeGfx.closePath();
            badgeGfx.fillPath();
            badgeGfx.strokePath();

            // Inner diamond
            if (earned) {
                badgeGfx.fillStyle(0xffffff, 0.3);
                badgeGfx.fillRect(bx - 6, bcy - 6, 12, 12);
            }
            this.subMenu.add(badgeGfx);

            // Badge name and info
            var nameColor = earned ? badge.accent : '#555555';
            var descColor = earned ? '#bdc3c7' : '#444444';
            this.subMenu.add(scene.add.text(cx, by + 8, badge.name, {
                fontSize: '13px', fontFamily: 'monospace', color: nameColor, fontStyle: 'bold'
            }).setOrigin(0.5, 0));

            this.subMenu.add(scene.add.text(cx, by + 26, 'Leader: ' + badge.leader + ' (' + badge.type + '-type)', {
                fontSize: '10px', fontFamily: 'monospace', color: descColor
            }).setOrigin(0.5, 0));

            this.subMenu.add(scene.add.text(cx, by + 42, earned ? 'EARNED' : 'Not yet earned', {
                fontSize: '10px', fontFamily: 'monospace', color: earned ? '#2ecc71' : '#7f8c8d',
                fontStyle: earned ? 'bold' : ''
            }).setOrigin(0.5, 0));

            // Shimmer effect on earned badges
            if (earned) {
                var star = scene.add.text(bx, bcy, '\u2605', {
                    fontSize: '14px', color: '#fff'
                }).setOrigin(0.5);
                this.subMenu.add(star);
                scene.tweens.add({
                    targets: star, alpha: 0.3, duration: 800,
                    yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
                });
            }
        }

        // Total count
        this.subMenu.add(scene.add.text(cx, cam.height - 60, PlayerState.badges.length + ' / ' + allBadges.length + ' Badges', {
            fontSize: '12px', fontFamily: 'monospace', color: '#95a5a6'
        }).setOrigin(0.5));

        var closeBtn = scene.add.text(cam.width / 2, cam.height - 30, '[ Back ]', {
            fontSize: '14px', fontFamily: 'monospace', color: '#e74c3c'
        }).setOrigin(0.5).setInteractive();
        closeBtn.on('pointerdown', function() {
            if (MenuUI.subMenu) { MenuUI.subMenu.destroy(); MenuUI.subMenu = null; }
        });
        this.subMenu.add(closeBtn);
    },

    _saveGame: function() {
        PlayerState.save();
        var scene = this.scene;
        var cam = scene.cameras.main;

        var saveText = scene.add.text(cam.width / 2, cam.height / 2, 'Game Saved!', {
            fontSize: '18px', fontFamily: 'monospace', color: '#2ecc71', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(700).setScrollFactor(0);

        scene.tweens.add({
            targets: saveText,
            alpha: 0,
            y: saveText.y - 30,
            duration: 1500,
            onComplete: function() { saveText.destroy(); }
        });
    },

    _showMultiplayer: function() {
        var scene = this.scene;
        var cam = scene.cameras.main;
        if (this.subMenu) this.subMenu.destroy();

        this.subMenu = scene.add.container(0, 0).setDepth(600).setScrollFactor(0);

        var bg = scene.add.graphics();
        bg.fillStyle(0x1a1a2e, 0.97);
        bg.fillRect(0, 0, cam.width, cam.height);
        this.subMenu.add(bg);

        this.subMenu.add(scene.add.text(cam.width / 2, 20, 'MULTIPLAYER', {
            fontSize: '16px', fontFamily: 'monospace', color: '#f1c40f', fontStyle: 'bold'
        }).setOrigin(0.5));

        // Create Room button
        var createBtn = scene.add.text(cam.width / 2, 80, '[ Create Room ]', {
            fontSize: '14px', fontFamily: 'monospace', color: '#2ecc71'
        }).setOrigin(0.5).setInteractive();
        this.subMenu.add(createBtn);

        var statusText = scene.add.text(cam.width / 2, 120, '', {
            fontSize: '11px', fontFamily: 'monospace', color: '#ecf0f1',
            wordWrap: { width: cam.width - 40 }, align: 'center'
        }).setOrigin(0.5);
        this.subMenu.add(statusText);

        var peerIdText = scene.add.text(cam.width / 2, 160, '', {
            fontSize: '9px', fontFamily: 'monospace', color: '#7f8c8d',
            wordWrap: { width: cam.width - 40 }, align: 'center'
        }).setOrigin(0.5);
        this.subMenu.add(peerIdText);

        createBtn.on('pointerdown', function() {
            statusText.setText('Creating room...');
            Multiplayer.createRoom(function(code, fullId) {
                statusText.setText('Room Code: ' + code + '\nShare this with your opponent!\n\nFull ID (for joining):');
                peerIdText.setText(fullId);

                Multiplayer.onConnect = function() {
                    statusText.setText('Opponent connected! Starting battle...');
                    scene.time.delayedCall(1000, function() {
                        MenuUI.close();
                        Multiplayer.sendTeamInfo(PlayerState.team);
                        scene.scene.start('BattleScene', {
                            type: 'pvp',
                            isHost: true
                        });
                    });
                };
            });
        });

        // Join room
        this.subMenu.add(scene.add.text(cam.width / 2, 210, 'Or enter opponent\'s full Peer ID:', {
            fontSize: '10px', fontFamily: 'monospace', color: '#95a5a6'
        }).setOrigin(0.5));

        // Simple text input area
        var joinBtn = scene.add.text(cam.width / 2, 250, '[ Join Room ]', {
            fontSize: '14px', fontFamily: 'monospace', color: '#3498db'
        }).setOrigin(0.5).setInteractive();
        this.subMenu.add(joinBtn);

        joinBtn.on('pointerdown', function() {
            var peerId = prompt('Enter opponent\'s Peer ID:');
            if (peerId) {
                statusText.setText('Connecting...');
                Multiplayer.joinRoom(peerId, function() {});
                Multiplayer.onConnect = function() {
                    statusText.setText('Connected! Starting battle...');
                    Multiplayer.sendTeamInfo(PlayerState.team);
                    scene.time.delayedCall(1000, function() {
                        MenuUI.close();
                        scene.scene.start('BattleScene', {
                            type: 'pvp',
                            isHost: false
                        });
                    });
                };
            }
        });

        // Close
        var closeBtn = scene.add.text(cam.width / 2, cam.height - 30, '[ Back ]', {
            fontSize: '14px', fontFamily: 'monospace', color: '#e74c3c'
        }).setOrigin(0.5).setInteractive();
        closeBtn.on('pointerdown', function() {
            if (MenuUI.subMenu) { MenuUI.subMenu.destroy(); MenuUI.subMenu = null; }
        });
        this.subMenu.add(closeBtn);
    },

    _toggleFullscreen: function() {
        var doc = document.documentElement;
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (doc.requestFullscreen) doc.requestFullscreen();
            else if (doc.webkitRequestFullscreen) doc.webkitRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        }
    },

    handleInput: function() {
        if (!this.isOpen) return false;

        if (this.subMenu) {
            if (TouchControls.justPressed('b')) {
                this.subMenu.destroy();
                this.subMenu = null;
                return true;
            }
            return true;
        }

        if (TouchControls.justPressed('up')) {
            this.selectedIndex = Math.max(0, this.selectedIndex - 1);
            this._draw();
        }
        if (TouchControls.justPressed('down')) {
            this.selectedIndex = Math.min(8, this.selectedIndex + 1);
            this._draw();
        }
        if (TouchControls.justPressed('a')) {
            this._selectItem(this.selectedIndex);
        }
        if (TouchControls.justPressed('b')) {
            this.close();
        }
        return true;
    }
};
