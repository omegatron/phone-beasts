var RouteScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { key: 'RouteScene' });
    },

    create: function() {
        OverworldMixin.initOverworld.call(this, 'route1');
    },

    update: function(time, delta) {
        OverworldMixin.updateOverworld.call(this, time, delta);
    }
});
