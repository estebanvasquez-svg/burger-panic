const CACHE_NAME = 'burgerpanic-mobile-v94';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './assets/title_cover.png',
  './assets/chef_atlas.png',
  './assets/peter_atlas.png',
  './assets/enemies_atlas.png',
  './assets/items_atlas.png',
  './assets/kiloburner_atlas.png',
  './assets/bg_stage3_kiloburner.png',
  './assets/bg_stage4_octopus.png',
  './assets/bg_stage5_coffee.png',
  './assets/bg_stage6_cat.png',
  './assets/bg_stage7_castle.png',
  './assets/bg_stage8_dragon.png',
  './assets/bg_stage9_submarine.png',
  './assets/bg_stage10_penguin.png',
  './assets/bg_stage11_toaster.png',
  './assets/bg_stage12_panda.png',
  './assets/bg_stage13_ufo.png',
  './assets/bg_stage14_dino.png',
  './assets/bg_stage15_crown.png',
  './js/chef_atlas.js',
  './js/enemies_atlas.js',
  './js/items_atlas.js',
  './js/kiloburner_atlas.js',
  './js/audio.js',
  './js/sprites.js',
  './js/kiloburner.js',
  './js/map.js',
  './js/burger.js',
  './js/entities.js',
  './js/stage_themes.js',
  './js/controls.js',
  './js/godot_gfx_engine.js',
  './js/game.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request).then((res) => res || caches.match('./index.html')))
  );
});
