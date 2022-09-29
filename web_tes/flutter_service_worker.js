'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "4e9f3f8941ea43de7dfb49895e4079f1",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/images/buttonBG1@3x.png": "57322df5d64e923997860dfe151d8999",
"assets/images/buttonBG2@3x.png": "7e5d13ed2a0bfbc180b85c5f4fb6326d",
"assets/images/buttonBG3@3x(1).png": "1fecef540873e9d7a2af6040a1a99d5e",
"assets/images/buttonBG4@3x.png": "3d1b598f3c8efb8111f7d970bcf85ea5",
"assets/images/comments@3x.png": "0b3cd0783e353bcf55fc85243fbfc0d1",
"assets/images/ETH@3x.png": "f214fc92b8473a26ecfff0c92382416b",
"assets/images/fenxiang@3x.png": "794e6a236d9ccda64dc97f07b87a9cb5",
"assets/images/gouxuan@3x.png": "0232625c3e5ef8c5e81cae655bcf9ef6",
"assets/images/headeImg.png": "41aaf69bd357ac6a010d401bc4e2c36f",
"assets/images/headImage4@3x.png": "b3083e369c266aa9742f57f8f914d08d",
"assets/images/lianjie@3x.png": "04e22c2134f03004f6ea49581e12ea11",
"assets/images/LOGO3x.png": "3f5578d8d4ff618a809a3bd005c40a01",
"assets/images/QrCode.png": "ffc00cc49d8641918b8db799a5db5d05",
"assets/images/qrcode@3x.png": "c67f5275fa3b3bf27ce6cba6ea2d6a5f",
"assets/images/quchu@3x.png": "3802a7a408898896b8abe0c9af698e1a",
"assets/images/share@3x.png": "b68a2293ae38e60a3ccfddfbdd5c07ee",
"assets/images/shouji@3x.png": "3a25ee972ce599ca804dc7bc7d2c41cc",
"assets/images/shoujihao@3x.png": "026b42b6af9509943f2b7bf9790cf3fc",
"assets/images/sjjiantou3x.png": "2871a246e66a07c8783083743186c7f1",
"assets/images/wakuangpeizhi2@3x.png": "8f70982e0aa6a9457d4b0505861a7bab",
"assets/images/wakuangpeizhi@3x.png": "636b5ffb7eab5a7bc8ea56e45c471c5a",
"assets/images/wenhaoxiao@3x.png": "c78ce8e073cdca1c446472068bec9b98",
"assets/images/xiazai@3x.png": "3bc708746f20a3fab137d93d3b58b35e",
"assets/images/xin(1)@3x.png": "76ddd148f2058430dd0ac70f6cf4bc37",
"assets/images/z13@3x.png": "0db2cbf46834862241d7f241b3dc947a",
"assets/images/z14@3x.png": "e8776ed51deef4ef2262861ef9478b02",
"assets/images/z15@3x.png": "b24fd80f1157f9e315ce5c422d21fd91",
"assets/images/z16@3x.png": "e4967c75514035ad29a0e318f5068b8e",
"assets/images/z17@3x.png": "e0d90fed2aada82726484e34518b6e7f",
"assets/images/z18@3x.png": "e1e6212dac88b1bda4a54d5928794660",
"assets/images/z4@3x.png": "8e36e81d47cbe7374f4516dcb275c65b",
"assets/NOTICES": "72889acf317415ac7f0e963f338e2f1a",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "6333b551ea27fd9d8e1271e92def26a9",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"index.html": "e294e206a1e8ffb858aa05ef8598375a",
"/": "e294e206a1e8ffb858aa05ef8598375a",
"main.dart.js": "81c305934da3aa74135ea3fc68c1bc05",
"manifest.json": "7cd5dcfe7eb4791651288ac2c5cf0405",
"version.json": "deb4f08dd80cd3923d1b989fcb59f469"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
