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
        var panelW = 180, panelH = 280;
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
        var items = ['Team', 'Bag', 'Save', 'Multiplayer', 'Fullscreen', 'Close'];
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
            case 2: this._saveGame(); break;
            case 3: this._showMultiplayer(); break;
            case 4: this._toggleFullscreen(); break;
            case 5: this.close(); break;
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
            this.selectedIndex = Math.min(5, this.selectedIndex + 1);
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
