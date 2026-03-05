var GymCityScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { key: 'GymCityScene' });
    },

    create: function() {
        OverworldMixin.initOverworld.call(this, 'gymCity');
    },

    update: function(time, delta) {
        OverworldMixin.updateOverworld.call(this, time, delta);
    }
});
