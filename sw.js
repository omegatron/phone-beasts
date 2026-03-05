const CACHE_NAME = 'phone-beasts-v5';
const ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './js/main.js',
    './js/data/moves.js',
    './js/data/beasts.js',
    './js/data/maps.js',
    './js/engine/SpriteGenerator.js',
    './js/engine/PlayerState.js',
    './js/engine/BattleEngine.js',
    './js/engine/DialogManager.js',
    './js/engine/Multiplayer.js',
    './js/ui/TouchControls.js',
    './js/ui/BattleUI.js',
    './js/ui/MenuUI.js',
    './js/scenes/BootScene.js',
    './js/scenes/IntroScene.js',
    './js/scenes/StarterSelectScene.js',
    './js/scenes/TownScene.js',
    './js/scenes/RouteScene.js',
    './js/scenes/WorldMapScene.js',
    './js/scenes/GymCityScene.js',
    './js/scenes/BattleScene.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
