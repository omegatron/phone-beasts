var IntroScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { key: 'IntroScene' });
    },

    create: function() {
        var cam = this.cameras.main;
        var w = cam.width, h = cam.height;
        var self = this;

        // Black background
        this.cameras.main.setBackgroundColor('#1a1a2e');

        // Title fade in
        var title = this.add.text(w / 2, h * 0.15, 'PHONE BEASTS', {
            fontSize: '28px', fontFamily: 'monospace', color: '#f1c40f',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: title,
            alpha: 1,
            duration: 1500,
            onComplete: function() {
                self.time.delayedCall(1000, function() {
                    self._showProfessor();
                });
            }
        });

        // Hide touch d-pad during intro, show A button for advancing
        TouchControls.show();

        this.inputCooldown = 0;
    },

    _showProfessor: function() {
        var cam = this.cameras.main;
        var w = cam.width, h = cam.height;
        var self = this;

        // Professor sprite
        var prof = this.add.image(w / 2, h * 0.35, 'npc_professor_down').setScale(4).setAlpha(0);
        this.tweens.add({
            targets: prof,
            alpha: 1,
            duration: 800,
            onComplete: function() {
                self._startMonologue();
            }
        });
    },

    _startMonologue: function() {
        var self = this;

        DialogManager.init(this);

        var monologue = [
            "Hello there! Welcome to the world of Phone Beasts!",
            "My name is Professor Elm. People call me the Beast Professor.",
            "This world is inhabited by creatures called Beasts.",
            "They come in many shapes and sizes, each with unique elemental powers.",
            "Some people keep Beasts as pets. Others use them for battling.",
            "As for myself... I study Beasts as a profession.",
            "But first, tell me about yourself.",
        ];

        DialogManager.showDialog(monologue, function() {
            self._askName();
        });
    },

    _askName: function() {
        var self = this;
        var names = ['Ash', 'Red', 'Blue', 'Luna'];

        DialogManager.showChoice('What is your name?', names, function(index) {
            PlayerState.name = names[index];
            self._confirmName();
        });
    },

    _confirmName: function() {
        var self = this;

        DialogManager.showDialog([
            "So your name is " + PlayerState.name + "!",
            PlayerState.name + "! Your very own beast adventure is about to begin!",
            "Come visit my lab to pick your first beast partner!",
            "A world of dreams and adventures awaits! Let's go!"
        ], function() {
            self.cameras.main.fadeOut(1000, 0, 0, 0);
            self.time.delayedCall(1000, function() {
                self.scene.start('StarterSelectScene');
            });
        });
    },

    update: function(time, delta) {
        this.inputCooldown -= delta;
        if (this.inputCooldown > 0) return;

        if (DialogManager.isShowing()) {
            if (TouchControls.justPressed('a') || TouchControls.justPressed('b')) {
                if (DialogManager.choiceMode) {
                    if (TouchControls.keys.up) DialogManager.updateChoiceSelection('up');
                    if (TouchControls.keys.down) DialogManager.updateChoiceSelection('down');
                    DialogManager.confirmChoice();
                } else {
                    DialogManager.advance();
                }
                this.inputCooldown = 200;
            }
            if (DialogManager.choiceMode) {
                if (TouchControls.justPressed('up')) {
                    DialogManager.updateChoiceSelection('up');
                    this.inputCooldown = 150;
                }
                if (TouchControls.justPressed('down')) {
                    DialogManager.updateChoiceSelection('down');
                    this.inputCooldown = 150;
                }
            }
        }
    }
});
