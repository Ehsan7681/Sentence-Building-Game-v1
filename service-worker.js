// نام و نسخه کش برای ذخیره آفلاین
const CACHE_NAME = 'sentence-game-v1';
const STATIC_CACHE = 'static-cache-v1';
const FONT_CACHE = 'font-cache-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';

// لیست فایل‌هایی که باید کش شوند
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/game.html',
    '/settings.html',
    '/style.css',
    '/game-style.css',
    '/settings-style.css',
    '/script.js',
    '/game.js',
    '/settings.js',
    '/icon-192.png',
    '/icon-512.png',
    '/manifest.json',
    '/favicon.ico'
];

const FONT_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap&text=آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی۰۱۲۳۴۵۶۷۸۹ :.،؛',
    'https://fonts.gstatic.com/s/vazirmatn/v13/Fqk9XhOzO33GsQPfG2I3APTrSFpVRfpNPeMj.woff2'
];

// نصب سرویس ورکر با کش پیشرفته
self.addEventListener('install', event => {
    // کش کردن فایل‌های اصلی
    event.waitUntil(
        Promise.all([
            // کش استاتیک
            caches.open(STATIC_CACHE)
                .then(cache => {
                    console.log('کش فایل‌های استاتیک...');
                    return cache.addAll(STATIC_ASSETS);
                }),
            
            // کش فونت‌ها
            caches.open(FONT_CACHE)
                .then(cache => {
                    console.log('کش فونت‌ها...');
                    return cache.addAll(FONT_ASSETS);
                })
        ])
        .then(() => self.skipWaiting())
    );
});

// فعال‌سازی سرویس ورکر با پاکسازی کش‌های قدیمی
self.addEventListener('activate', event => {
    // پاک کردن کش‌های قدیمی
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== STATIC_CACHE && 
                        cache !== FONT_CACHE && 
                        cache !== DYNAMIC_CACHE) {
                        console.log('پاک کردن کش قدیمی:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
        .then(() => self.clients.claim())
    );
});

// استراتژی Cache First برای فونت‌ها و فایل‌های استاتیک
// استراتژی Network First برای محتوای پویا
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // استراتژی Cache First برای فونت‌ها
    if (event.request.url.includes('fonts.googleapis.com') || 
        event.request.url.includes('fonts.gstatic.com')) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request)
                        .then(fetchResponse => {
                            return caches.open(FONT_CACHE)
                                .then(cache => {
                                    cache.put(event.request, fetchResponse.clone());
                                    return fetchResponse;
                                });
                        });
                })
        );
        return;
    }
    
    // استراتژی Cache First برای فایل‌های استاتیک
    if (STATIC_ASSETS.includes(url.pathname) || 
        url.pathname.endsWith('.css') || 
        url.pathname.endsWith('.js') || 
        url.pathname.endsWith('.png') || 
        url.pathname.endsWith('.ico')) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request)
                        .then(fetchResponse => {
                            return caches.open(STATIC_CACHE)
                                .then(cache => {
                                    cache.put(event.request, fetchResponse.clone());
                                    return fetchResponse;
                                });
                        });
                })
        );
        return;
    }
    
    // استراتژی Network First برای سایر درخواست‌ها
    event.respondWith(
        fetch(event.request)
            .then(response => {
                return caches.open(DYNAMIC_CACHE)
                    .then(cache => {
                        // کش کردن پاسخ
                        cache.put(event.request, response.clone());
                        return response;
                    });
            })
            .catch(() => {
                return caches.match(event.request)
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // اگر درخواست برای یک صفحه HTML باشد و آفلاین هستیم، صفحه آفلاین را نمایش بده
                        if (event.request.url.match(/\.(html)$/)) {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// مدیریت پیام‌ها (مثلاً برای به‌روزرسانی)
self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
}); 