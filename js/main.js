// Global error handler - shows errors on screen with reset option
window.onerror = function(msg, url, line, col, error) {
    var overlay = document.getElementById('error-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'error-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);color:#ff6b6b;z-index:99999;padding:20px;font-family:monospace;font-size:14px;overflow:auto;box-sizing:border-box;';
        document.body.appendChild(overlay);
    }
    var file = url ? url.split('/').pop() : '?';
    overlay.innerHTML = '<h2 style="color:#ff6b6b;margin:0 0 10px">Phone Beasts Error</h2>' +
        '<p style="color:#fff;word-break:break-all">' + msg + '</p>' +
        '<p style="color:#aaa">File: ' + file + ' Line: ' + line + '</p>' +
        (error && error.stack ? '<pre style="color:#888;font-size:11px;white-space:pre-wrap">' + error.stack + '</pre>' : '') +
        '<br><button onclick="localStorage.removeItem(\'phoneBeasts_save\');location.reload()" style="padding:10px 20px;font-size:16px;margin:5px;cursor:pointer;background:#c0392b;color:#fff;border:none;border-radius:4px">Reset Save &amp; Reload</button>' +
        '<button onclick="location.reload()" style="padding:10px 20px;font-size:16px;margin:5px;cursor:pointer;background:#2980b9;color:#fff;border:none;border-radius:4px">Reload</button>';
    return true;
};

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
        InteriorScene,
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
