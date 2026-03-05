var WorldMapScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { key: 'WorldMapScene' });
    },

    create: function() {
        OverworldMixin.initOverworld.call(this, 'worldMap');
    },

    update: function(time, delta) {
        OverworldMixin.updateOverworld.call(this, time, delta);
    }
});
