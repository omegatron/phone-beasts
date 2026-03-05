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

    drawMoveMenu: function(scene, beast, x, y, callback) {
        var container = scene.add.container(x, y);
        container.setDepth(200);

        var menuW = scene.cameras.main.width - 16;
        var menuH = 90;

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

        for (var i = 0; i < 4; i++) {
            var mx = (i % 2) * colW + 10;
            var my = Math.floor(i / 2) * 38 + 8;

            if (i < moves.length) {
                var move = MOVES[moves[i]];
                var pp = beast.pp[moves[i]] || 0;

                var moveBtn = scene.add.graphics();
                moveBtn.fillStyle(Phaser.Display.Color.HexStringToColor(typeColors[move.type] || '#888').color, 0.3);
                moveBtn.fillRoundedRect(mx, my, colW - 20, 32, 4);
                moveBtn.lineStyle(1, Phaser.Display.Color.HexStringToColor(typeColors[move.type] || '#888').color, 0.8);
                moveBtn.strokeRoundedRect(mx, my, colW - 20, 32, 4);
                container.add(moveBtn);

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

                // Hit area
                var hitArea = scene.add.rectangle(mx + (colW - 20) / 2, my + 16, colW - 20, 32, 0x000000, 0)
                    .setInteractive();
                container.add(hitArea);
                (function(idx) {
                    hitArea.on('pointerdown', function() { callback(idx); });
                })(i);
            }
        }

        return container;
    },

    drawActionMenu: function(scene, x, y, options, callback) {
        var container = scene.add.container(x, y);
        container.setDepth(200);

        var menuW = 130;
        var menuH = options.length * 28 + 10;

        var bg = scene.add.graphics();
        bg.fillStyle(0x000000, 0.9);
        bg.fillRoundedRect(0, 0, menuW, menuH, 6);
        bg.lineStyle(2, 0xffffff, 0.6);
        bg.strokeRoundedRect(0, 0, menuW, menuH, 6);
        container.add(bg);

        for (var i = 0; i < options.length; i++) {
            var oy = i * 28 + 8;
            var optText = scene.add.text(12, oy, options[i], {
                fontSize: '13px', fontFamily: 'monospace', color: '#ffffff'
            }).setInteractive();
            container.add(optText);
            (function(idx) {
                optText.on('pointerdown', function() { callback(idx); });
            })(i);
        }

        return container;
    }
};
