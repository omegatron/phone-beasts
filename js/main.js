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
    var errorDetails = msg + '\nFile: ' + file + ' Line: ' + line + (error && error.stack ? '\n' + error.stack : '');
    overlay.innerHTML = '<h2 style="color:#ff6b6b;margin:0 0 10px">Phone Beasts Error</h2>' +
        '<p style="color:#fff;word-break:break-all">' + msg + '</p>' +
        '<p style="color:#aaa">File: ' + file + ' Line: ' + line + '</p>' +
        (error && error.stack ? '<pre style="color:#888;font-size:11px;white-space:pre-wrap">' + error.stack + '</pre>' : '') +
        '<br><button onclick="navigator.clipboard.writeText(this.dataset.err).then(function(){alert(\'Copied!\')}).catch(function(){})" data-err="' + errorDetails.replace(/"/g, '&quot;') + '" style="padding:10px 20px;font-size:16px;margin:5px;cursor:pointer;background:#8e44ad;color:#fff;border:none;border-radius:4px">Copy Error</button>' +
        '<button onclick="localStorage.removeItem(\'phoneBeasts_save\');location.reload()" style="padding:10px 20px;font-size:16px;margin:5px;cursor:pointer;background:#c0392b;color:#fff;border:none;border-radius:4px">Reset Save &amp; Reload</button>' +
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
        GenericMapScene,
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

// Konami Code Easter Egg: Up Up Down Down Left Right Left Right B A
(function() {
    var konamiSeq = [38,38,40,40,37,39,37,39,66,65]; // Arrow keys + B + A
    var konamiIdx = 0;
    var konamiTriggered = false;

    document.addEventListener('keydown', function(e) {
        if (konamiTriggered) return;
        if (e.keyCode === konamiSeq[konamiIdx]) {
            konamiIdx++;
            if (konamiIdx === konamiSeq.length) {
                konamiTriggered = true;
                // Check if player has starter and Anthropobeast isn't already on team
                if (!PlayerState.hasStarter) return;
                for (var i = 0; i < PlayerState.team.length; i++) {
                    if (PlayerState.team[i].id === 'anthropobeast') return;
                }
                if (PlayerState.team.length >= 6) return;

                // Create and give the Anthropobeast
                var anthro = PlayerState.createBeastInstance('anthropobeast', 100);
                if (anthro && PlayerState.addBeastToTeam(anthro)) {
                    PlayerState.save();
                    // Trigger cutscene in the active scene
                    var activeScene = game.scene.getScenes(true)[0];
                    if (activeScene) {
                        var cam = activeScene.cameras.main;
                        // Flash screen
                        cam.flash(1000, 255, 215, 0);
                        cam.shake(500, 0.02);

                        // Cutscene overlay
                        var overlay = activeScene.add.graphics().setDepth(2000).setScrollFactor(0);
                        overlay.fillStyle(0x000000, 0.85);
                        overlay.fillRect(0, 0, cam.width, cam.height);

                        var title = activeScene.add.text(cam.width / 2, cam.height * 0.15, '???', {
                            fontSize: '20px', fontFamily: 'monospace', color: '#f1c40f', fontStyle: 'bold'
                        }).setOrigin(0.5).setDepth(2001).setScrollFactor(0);

                        var beastImg = activeScene.add.image(cam.width / 2, cam.height * 0.4, 'beast_anthropobeast_front')
                            .setScale(3).setDepth(2001).setScrollFactor(0);

                        var msg1 = activeScene.add.text(cam.width / 2, cam.height * 0.6, 'A strange presence appears...', {
                            fontSize: '12px', fontFamily: 'monospace', color: '#ecf0f1'
                        }).setOrigin(0.5).setDepth(2001).setScrollFactor(0);

                        var msg2 = activeScene.add.text(cam.width / 2, cam.height * 0.68, 'A Lv.100 Anthropobeast joined your team!', {
                            fontSize: '11px', fontFamily: 'monospace', color: '#2ecc71', fontStyle: 'bold'
                        }).setOrigin(0.5).setDepth(2001).setScrollFactor(0).setAlpha(0);

                        var msg3 = activeScene.add.text(cam.width / 2, cam.height * 0.76, '"I think, therefore I battle."', {
                            fontSize: '10px', fontFamily: 'monospace', color: '#95a5a6', fontStyle: 'italic'
                        }).setOrigin(0.5).setDepth(2001).setScrollFactor(0).setAlpha(0);

                        var dismiss = activeScene.add.text(cam.width / 2, cam.height * 0.88, '[ Tap to continue ]', {
                            fontSize: '11px', fontFamily: 'monospace', color: '#7f8c8d'
                        }).setOrigin(0.5).setDepth(2001).setScrollFactor(0).setAlpha(0);

                        // Animate in sequence
                        activeScene.time.delayedCall(500, function() { title.setText('KONAMI CODE ACTIVATED'); });
                        activeScene.tweens.add({ targets: beastImg, scaleX: 3.2, scaleY: 3.2, duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
                        activeScene.tweens.add({ targets: msg2, alpha: 1, delay: 1500, duration: 500 });
                        activeScene.tweens.add({ targets: msg3, alpha: 1, delay: 2200, duration: 500 });
                        activeScene.tweens.add({ targets: dismiss, alpha: 1, delay: 3000, duration: 500 });

                        // Dismiss on click/tap after delay
                        activeScene.time.delayedCall(3000, function() {
                            var zone = activeScene.add.zone(0, 0, cam.width, cam.height).setOrigin(0).setDepth(2002).setScrollFactor(0).setInteractive();
                            var dismissFn = function() {
                                overlay.destroy(); title.destroy(); beastImg.destroy();
                                msg1.destroy(); msg2.destroy(); msg3.destroy(); dismiss.destroy();
                                zone.destroy();
                            };
                            zone.on('pointerdown', dismissFn);
                            // Also dismiss with keyboard
                            var keyHandler = function(e) {
                                dismissFn();
                                document.removeEventListener('keydown', keyHandler);
                            };
                            document.addEventListener('keydown', keyHandler);
                        });
                    }
                }
            }
        } else {
            konamiIdx = 0;
        }
    });
})();
