var StarterSelectScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { key: 'StarterSelectScene' });
    },

    create: function() {
        var cam = this.cameras.main;
        var w = cam.width, h = cam.height;
        var self = this;

        this.cameras.main.setBackgroundColor('#2c3e50');
        this.cameras.main.fadeIn(800, 0, 0, 0);

        // Title
        this.add.text(w / 2, 30, 'Choose Your Beast!', {
            fontSize: '20px', fontFamily: 'monospace', color: '#f1c40f', fontStyle: 'bold'
        }).setOrigin(0.5);

        // Professor text
        this.add.text(w / 2, 60, 'Prof. Elm: "Pick one to be your partner!"', {
            fontSize: '11px', fontFamily: 'monospace', color: '#ecf0f1',
            wordWrap: { width: w - 40 }
        }).setOrigin(0.5);

        // Starters
        var starters = ['emberon', 'tidalin', 'thornleaf'];
        var typeColors = { fire: '#e74c3c', water: '#3498db', grass: '#27ae60' };
        this.selectedIndex = 0;
        this.starters = starters;
        this.cards = [];

        var cardW = Math.min(90, (w - 40) / 3);
        var startX = w / 2 - (cardW * 3 + 20) / 2 + cardW / 2;

        for (var i = 0; i < starters.length; i++) {
            var beast = BEASTS[starters[i]];
            var cx = startX + i * (cardW + 10);
            var cy = h * 0.4;

            var card = this.add.container(cx, cy);

            // Card background
            var bg = this.add.graphics();
            bg.fillStyle(0x34495e, 1);
            bg.fillRoundedRect(-cardW / 2, -60, cardW, 140, 8);
            bg.lineStyle(2, i === 0 ? 0xf1c40f : 0x7f8c8d, 1);
            bg.strokeRoundedRect(-cardW / 2, -60, cardW, 140, 8);
            card.add(bg);
            card.bgGraphics = bg;

            // Beast sprite
            var sprite = this.add.image(0, -20, 'beast_' + starters[i] + '_front').setScale(1.2);
            card.add(sprite);

            // Name
            var nameText = this.add.text(0, 25, beast.name, {
                fontSize: '12px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold'
            }).setOrigin(0.5);
            card.add(nameText);

            // Type
            var typeText = this.add.text(0, 42, beast.type.toUpperCase(), {
                fontSize: '10px', fontFamily: 'monospace',
                color: typeColors[beast.type] || '#fff'
            }).setOrigin(0.5);
            card.add(typeText);

            // Stats preview
            var statsText = this.add.text(0, 58, 'HP:' + beast.baseStats.hp + ' ATK:' + beast.baseStats.atk, {
                fontSize: '8px', fontFamily: 'monospace', color: '#bdc3c7'
            }).setOrigin(0.5);
            card.add(statsText);

            this.cards.push(card);

            // Make interactive
            var hitArea = this.add.rectangle(cx, cy, cardW, 140, 0x000000, 0).setInteractive();
            (function(idx) {
                hitArea.on('pointerdown', function() {
                    self.selectedIndex = idx;
                    self._updateSelection();
                    self._confirmSelection();
                });
            })(i);
        }

        // Description area
        this.descText = this.add.text(w / 2, h * 0.7, '', {
            fontSize: '11px', fontFamily: 'monospace', color: '#ecf0f1',
            wordWrap: { width: w - 40 }, align: 'center'
        }).setOrigin(0.5);

        // Instructions
        this.add.text(w / 2, h - 30, '\u25C0 \u25B6 to browse  |  A to select', {
            fontSize: '10px', fontFamily: 'monospace', color: '#7f8c8d'
        }).setOrigin(0.5);

        this._updateSelection();
        this.confirmed = false;
        this.inputCooldown = 0;

        DialogManager.init(this);
    },

    _updateSelection: function() {
        for (var i = 0; i < this.cards.length; i++) {
            var bg = this.cards[i].bgGraphics;
            bg.clear();
            var cardW = Math.min(90, (this.cameras.main.width - 40) / 3);
            bg.fillStyle(i === this.selectedIndex ? 0x4a6785 : 0x34495e, 1);
            bg.fillRoundedRect(-cardW / 2, -60, cardW, 140, 8);
            bg.lineStyle(2, i === this.selectedIndex ? 0xf1c40f : 0x7f8c8d, 1);
            bg.strokeRoundedRect(-cardW / 2, -60, cardW, 140, 8);

            // Scale effect
            this.cards[i].setScale(i === this.selectedIndex ? 1.05 : 1);
        }

        var beast = BEASTS[this.starters[this.selectedIndex]];
        this.descText.setText(beast.desc + '\nDEF:' + beast.baseStats.def + ' SPD:' + beast.baseStats.spd);
    },

    _confirmSelection: function() {
        if (this.confirmed) return;
        var self = this;
        var beast = BEASTS[this.starters[this.selectedIndex]];

        DialogManager.showChoice('Choose ' + beast.name + '?', ['Yes!', 'No, wait...'], function(idx) {
            if (idx === 0) {
                self.confirmed = true;
                // Create beast instance and add to team
                var instance = PlayerState.createBeastInstance(self.starters[self.selectedIndex], 5);
                PlayerState.addBeastToTeam(instance);
                PlayerState.hasStarter = true;
                PlayerState.save();

                DialogManager.showDialog([
                    "You chose " + beast.name + "!",
                    beast.name + " seems excited to join you!",
                    "Now head out and start your adventure!",
                    "But be careful in the tall grass - wild Beasts lurk there!"
                ], function() {
                    self.cameras.main.fadeOut(800, 0, 0, 0);
                    self.time.delayedCall(800, function() {
                        self.scene.start('TownScene');
                    });
                });
            }
        });
    },

    update: function(time, delta) {
        if (this.confirmed) {
            // Still handle dialog advancement
            if (DialogManager.isShowing() && TouchControls.justPressed('a')) {
                DialogManager.advance();
            }
            return;
        }

        this.inputCooldown -= delta;
        if (this.inputCooldown > 0) return;

        if (DialogManager.isShowing()) {
            if (TouchControls.justPressed('a')) {
                if (DialogManager.choiceMode) {
                    DialogManager.confirmChoice();
                } else {
                    DialogManager.advance();
                }
                this.inputCooldown = 200;
            }
            if (DialogManager.choiceMode) {
                if (TouchControls.justPressed('up')) { DialogManager.updateChoiceSelection('up'); this.inputCooldown = 150; }
                if (TouchControls.justPressed('down')) { DialogManager.updateChoiceSelection('down'); this.inputCooldown = 150; }
            }
            return;
        }

        if (TouchControls.justPressed('left')) {
            this.selectedIndex = Math.max(0, this.selectedIndex - 1);
            this._updateSelection();
            this.inputCooldown = 200;
        }
        if (TouchControls.justPressed('right')) {
            this.selectedIndex = Math.min(2, this.selectedIndex + 1);
            this._updateSelection();
            this.inputCooldown = 200;
        }
        if (TouchControls.justPressed('a')) {
            this._confirmSelection();
            this.inputCooldown = 200;
        }
    }
});
