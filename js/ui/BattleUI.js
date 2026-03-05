var BattleUI = {
    drawHPBar: function(scene, x, y, currentHP, maxHP, width, height) {
        var container = scene.add.container(x, y);
        container.setDepth(100);

        // Background
        var bg = scene.add.graphics();
        bg.fillStyle(0x333333, 1);
        bg.fillRect(0, 0, width, height);
        container.add(bg);

        // HP fill
        var hpPercent = Math.max(0, currentHP / maxHP);
        var color = hpPercent > 0.5 ? 0x2ecc71 : (hpPercent > 0.2 ? 0xf39c12 : 0xe74c3c);

        var fill = scene.add.graphics();
        fill.fillStyle(color, 1);
        fill.fillRect(1, 1, (width - 2) * hpPercent, height - 2);
        container.add(fill);

        // Border
        var border = scene.add.graphics();
        border.lineStyle(1, 0xffffff, 0.5);
        border.strokeRect(0, 0, width, height);
        container.add(border);

        return container;
    },

    drawBeastInfo: function(scene, x, y, beast, isPlayer) {
        var container = scene.add.container(x, y);
        container.setDepth(100);

        // Background panel
        var bg = scene.add.graphics();
        bg.fillStyle(0x000000, 0.7);
        bg.fillRoundedRect(0, 0, 140, 50, 4);
        container.add(bg);

        // Name and level
        var nameText = scene.add.text(8, 4, beast.name, {
            fontSize: '12px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold'
        });
        container.add(nameText);

        var lvlText = scene.add.text(130, 4, 'L' + beast.level, {
            fontSize: '11px', fontFamily: 'monospace', color: '#f1c40f'
        }).setOrigin(1, 0);
        container.add(lvlText);

        // HP bar
        var maxHP = PlayerState.calcStats(BEASTS[beast.id].baseStats, beast.level).hp + beast.level;
        var hpBar = this.drawHPBar(scene, 8, 22, beast.currentHP, maxHP, 124, 8);
        container.add(hpBar);

        // HP text
        var hpText = scene.add.text(8, 33, beast.currentHP + '/' + maxHP, {
            fontSize: '9px', fontFamily: 'monospace', color: '#bdc3c7'
        });
        container.add(hpText);

        container.hpBar = hpBar;
        container.hpText = hpText;
        container.maxHP = maxHP;

        return container;
    },

    updateHPBar: function(scene, infoContainer, beast) {
        if (!infoContainer) return;

        var maxHP = infoContainer.maxHP;
        // Remove old HP bar
        if (infoContainer.hpBar) infoContainer.hpBar.destroy();

        // Draw new HP bar
        var hpBar = this.drawHPBar(scene, 8, 22, beast.currentHP, maxHP, 124, 8);
        infoContainer.add(hpBar);
        infoContainer.hpBar = hpBar;

        // Update text
        if (infoContainer.hpText) {
            infoContainer.hpText.setText(beast.currentHP + '/' + maxHP);
        }
    },

    // State for d-pad navigable menus
    activeMenu: null,   // 'action' or 'move'
    selectedIndex: 0,
    menuCallback: null,
    menuOptionCount: 0,
    menuColumns: 1,

    drawMoveMenu: function(scene, beast, x, y, callback) {
        var container = scene.add.container(x, y);
        container.setDepth(200);

        // Position above touch controls (top 55% of screen)
        var cam = scene.cameras.main;
        var menuW = cam.width - 16;
        var menuH = 90;
        container.y = Math.min(y, cam.height * 0.55 - menuH - 8);

        // Background
        var bg = scene.add.graphics();
        bg.fillStyle(0x000000, 0.9);
        bg.fillRoundedRect(0, 0, menuW, menuH, 6);
        bg.lineStyle(2, 0xffffff, 0.6);
        bg.strokeRoundedRect(0, 0, menuW, menuH, 6);
        container.add(bg);

        var typeColors = {
            normal: '#a8a878', fire: '#f08030', water: '#6890f0', grass: '#78c850',
            electric: '#f8d030', ground: '#e0c068'
        };

        var moves = beast.moves;
        var colW = menuW / 2;

        container._moveButtons = [];
        container._moveBgs = [];

        for (var i = 0; i < 4; i++) {
            var mx = (i % 2) * colW + 10;
            var my = Math.floor(i / 2) * 38 + 8;

            if (i < moves.length) {
                var move = MOVES[moves[i]];
                var pp = beast.pp[moves[i]] || 0;
                var isSelected = (i === 0);

                var moveBtn = scene.add.graphics();
                var btnColor = Phaser.Display.Color.HexStringToColor(typeColors[move.type] || '#888').color;
                moveBtn.fillStyle(btnColor, isSelected ? 0.6 : 0.3);
                moveBtn.fillRoundedRect(mx, my, colW - 20, 32, 4);
                moveBtn.lineStyle(isSelected ? 2 : 1, isSelected ? 0xffffff : btnColor, isSelected ? 1 : 0.8);
                moveBtn.strokeRoundedRect(mx, my, colW - 20, 32, 4);
                container.add(moveBtn);
                container._moveBgs.push({ gfx: moveBtn, x: mx, y: my, w: colW - 20, color: btnColor });

                var moveText = scene.add.text(mx + 6, my + 4, move.name, {
                    fontSize: '11px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold'
                });
                container.add(moveText);

                var ppText = scene.add.text(mx + colW - 26, my + 18, 'PP:' + pp, {
                    fontSize: '8px', fontFamily: 'monospace', color: '#bdc3c7'
                }).setOrigin(1, 0);
                container.add(ppText);

                var typeText = scene.add.text(mx + 6, my + 18, move.type.toUpperCase(), {
                    fontSize: '8px', fontFamily: 'monospace', color: typeColors[move.type] || '#888'
                });
                container.add(typeText);

                // Hit area for touch
                var hitArea = scene.add.rectangle(mx + (colW - 20) / 2, my + 16, colW - 20, 32, 0x000000, 0)
                    .setInteractive();
                container.add(hitArea);
                (function(idx) {
                    hitArea.on('pointerdown', function() { callback(idx); });
                })(i);

                container._moveButtons.push(i);
            }
        }

        // Set up d-pad navigation state
        this.activeMenu = 'move';
        this.selectedIndex = 0;
        this.menuCallback = callback;
        this.menuOptionCount = Math.min(moves.length, 4);
        this.menuColumns = 2;
        this._moveContainer = container;

        return container;
    },

    drawActionMenu: function(scene, x, y, options, callback) {
        var cam = scene.cameras.main;
        var container = scene.add.container(0, 0);
        container.setDepth(200);

        var menuW = 130;
        var menuH = options.length * 28 + 10;
        // Position above touch controls area (top 55%) and right-aligned
        var menuX = cam.width - menuW - 8;
        var menuY = cam.height * 0.55 - menuH - 8;

        var bg = scene.add.graphics();
        bg.fillStyle(0x000000, 0.9);
        bg.fillRoundedRect(menuX, menuY, menuW, menuH, 6);
        bg.lineStyle(2, 0xffffff, 0.6);
        bg.strokeRoundedRect(menuX, menuY, menuW, menuH, 6);
        container.add(bg);

        container._optionTexts = [];
        for (var i = 0; i < options.length; i++) {
            var oy = menuY + i * 28 + 8;
            var prefix = (i === 0) ? '> ' : '  ';
            var optText = scene.add.text(menuX + 12, oy, prefix + options[i], {
                fontSize: '13px', fontFamily: 'monospace',
                color: (i === 0) ? '#f1c40f' : '#ffffff'
            }).setInteractive();
            container.add(optText);
            container._optionTexts.push(optText);
            (function(idx) {
                optText.on('pointerdown', function() { callback(idx); });
            })(i);
        }

        // Set up d-pad navigation state
        this.activeMenu = 'action';
        this.selectedIndex = 0;
        this.menuCallback = callback;
        this.menuOptionCount = options.length;
        this.menuColumns = 1;
        this._actionContainer = container;
        this._actionOptions = options;

        return container;
    },

    clearMenu: function() {
        this.activeMenu = null;
        this.menuCallback = null;
    },

    handleInput: function() {
        if (!this.activeMenu) return false;

        var oldIndex = this.selectedIndex;

        if (this.activeMenu === 'action') {
            if (TouchControls.justPressed('up')) {
                this.selectedIndex = Math.max(0, this.selectedIndex - 1);
            }
            if (TouchControls.justPressed('down')) {
                this.selectedIndex = Math.min(this.menuOptionCount - 1, this.selectedIndex + 1);
            }
            if (TouchControls.justPressed('b')) {
                // B = Run (last option)
                this.selectedIndex = this.menuOptionCount - 1;
            }
        } else if (this.activeMenu === 'move') {
            // 2-column grid navigation
            if (TouchControls.justPressed('left') && this.selectedIndex % 2 === 1) {
                this.selectedIndex--;
            }
            if (TouchControls.justPressed('right') && this.selectedIndex % 2 === 0 && this.selectedIndex + 1 < this.menuOptionCount) {
                this.selectedIndex++;
            }
            if (TouchControls.justPressed('up') && this.selectedIndex >= 2) {
                this.selectedIndex -= 2;
            }
            if (TouchControls.justPressed('down') && this.selectedIndex + 2 < this.menuOptionCount) {
                this.selectedIndex += 2;
            }
            if (TouchControls.justPressed('b')) {
                // B goes back to action menu
                var cb = this.menuCallback;
                this.clearMenu();
                return 'back';
            }
        }

        // Update visual selection
        if (oldIndex !== this.selectedIndex) {
            this._updateSelection();
        }

        // A confirms
        if (TouchControls.justPressed('a')) {
            var idx = this.selectedIndex;
            var cb = this.menuCallback;
            this.clearMenu();
            if (cb) cb(idx);
            return true;
        }

        return false;
    },

    _updateSelection: function() {
        if (this.activeMenu === 'action' && this._actionContainer) {
            var texts = this._actionContainer._optionTexts;
            if (texts) {
                for (var i = 0; i < texts.length; i++) {
                    var prefix = (i === this.selectedIndex) ? '> ' : '  ';
                    texts[i].setText(prefix + this._actionOptions[i]);
                    texts[i].setColor(i === this.selectedIndex ? '#f1c40f' : '#ffffff');
                }
            }
        } else if (this.activeMenu === 'move' && this._moveContainer) {
            var bgs = this._moveContainer._moveBgs;
            if (bgs) {
                for (var i = 0; i < bgs.length; i++) {
                    var b = bgs[i];
                    var sel = (i === this.selectedIndex);
                    b.gfx.clear();
                    b.gfx.fillStyle(b.color, sel ? 0.6 : 0.3);
                    b.gfx.fillRoundedRect(b.x, b.y, b.w, 32, 4);
                    b.gfx.lineStyle(sel ? 2 : 1, sel ? 0xffffff : b.color, sel ? 1 : 0.8);
                    b.gfx.strokeRoundedRect(b.x, b.y, b.w, 32, 4);
                }
            }
        }
    }
};
