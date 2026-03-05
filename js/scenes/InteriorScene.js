var InteriorScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { key: 'InteriorScene' });
    },

    create: function() {
        OverworldMixin.initOverworld.call(this, PlayerState.position.map);
    },

    update: function(time, delta) {
        OverworldMixin.updateOverworld.call(this, time, delta);
    }
});
