var BootScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { key: 'BootScene' });
    },

    preload: function() {
        // Show loading bar
        var cam = this.cameras.main;
        var w = cam.width, h = cam.height;

        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(w / 2 - 110, h / 2 - 15, 220, 30);

        var progressBar = this.add.graphics();
        var loadText = this.add.text(w / 2, h / 2 - 40, 'Phone Beasts', {
            fontSize: '24px', fontFamily: 'monospace', color: '#ffffff'
        }).setOrigin(0.5);

        var percentText = this.add.text(w / 2, h / 2, 'Loading...', {
            fontSize: '14px', fontFamily: 'monospace', color: '#ffffff'
        }).setOrigin(0.5);

        // Simulate loading progress while generating assets
        var ticks = 0;
        var self = this;
        this.time.addEvent({
            delay: 50,
            repeat: 20,
            callback: function() {
                ticks++;
                var progress = ticks / 20;
                progressBar.clear();
                progressBar.fillStyle(0x4a8c3f, 1);
                progressBar.fillRect(w / 2 - 105, h / 2 - 10, 210 * Math.min(progress, 1), 20);
                percentText.setText(Math.floor(Math.min(progress, 1) * 100) + '%');
            }
        });
    },

    create: function() {
        // Generate all sprites programmatically
        SpriteGenerator.generateAll(this);

        // Initialize player state
        PlayerState.init();

        // Initialize touch controls
        TouchControls.init();

        // Small delay so player sees the loading screen
        var self = this;
        this.time.delayedCall(500, function() {
            // Check if player has a save
            if (PlayerState.hasStarter) {
                // Resume from saved position
                var mapKey = PlayerState.position.map;
                var mapData = MAPS[mapKey];
                if (mapData && mapData.isInterior) {
                    self.scene.start('InteriorScene');
                } else {
                    var sceneMap = {
                        'town': 'TownScene', 'route1': 'RouteScene',
                        'worldMap': 'WorldMapScene', 'gymCity': 'GymCityScene'
                    };
                    self.scene.start(sceneMap[mapKey] || 'GenericMapScene');
                }
            } else {
                self.scene.start('IntroScene');
            }
        });
    }
});
