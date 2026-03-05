// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function() {});
}

// Phaser game configuration
var config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    pixelArt: true,
    roundPixels: true,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 320,
        height: 480,
        min: {
            width: 240,
            height: 360
        },
        max: {
            width: 640,
            height: 960
        }
    },
    scene: [
        BootScene,
        IntroScene,
        StarterSelectScene,
        TownScene,
        RouteScene,
        WorldMapScene,
        GymCityScene,
        BattleScene
    ],
    input: {
        activePointers: 3
    },
    render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true
    }
};

// Launch the game
var game = new Phaser.Game(config);

// Prevent iOS bounce/zoom
document.addEventListener('touchmove', function(e) {
    if (e.target.closest('#game-container') || e.target.closest('#touch-controls')) {
        e.preventDefault();
    }
}, { passive: false });

// Fullscreen button
var fsBtn = document.createElement('div');
fsBtn.className = 'fullscreen-btn';
fsBtn.innerHTML = '\u26F6';
fsBtn.addEventListener('click', function() {
    var doc = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (doc.requestFullscreen) doc.requestFullscreen();
        else if (doc.webkitRequestFullscreen) doc.webkitRequestFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
});
document.body.appendChild(fsBtn);

// Prevent context menu on long press
document.addEventListener('contextmenu', function(e) { e.preventDefault(); });

// Handle visibility change (pause when backgrounded)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        PlayerState.save();
    }
});
