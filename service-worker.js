// نام و نسخه کش برای ذخیره آفلاین
const CACHE_NAME = 'sentence-game-v1';

// لیست فایل‌هایی که باید کش شوند
const CACHE_ASSETS = [
    '/',
    '/index.html',
    '/game.html',
    '/style.css',
    '/game-style.css',
    '/game.js',
    '/icon-192.png',
    '/icon-512.png',
    '/manifest.json',
    '/favicon.ico'
];

// نصب سرویس ورکر
self.addEventListener('install', event => {
    // کش کردن فایل‌های اصلی
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('فایل‌ها در حال کش شدن هستند...');
                return cache.addAll(CACHE_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// فعال‌سازی سرویس ورکر
self.addEventListener('activate', event => {
    // پاک کردن کش‌های قدیمی
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('پاک کردن کش قدیمی:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    
    // اطمینان از اینکه سرویس ورکر بلافاصله کنترل صفحات را به دست می‌گیرد
    return self.clients.claim();
});

// مدیریت درخواست‌های شبکه
self.addEventListener('fetch', event => {
    // استراتژی "Cache First, then Network"
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // اگر منبع در کش یافت شد، آن را برگردان
                if (response) {
                    return response;
                }
                
                // اگر منبع در کش یافت نشد، از شبکه دریافت کن
                return fetch(event.request)
                    .then(networkResponse => {
                        // بررسی پاسخ معتبر
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        
                        // کپی پاسخ (چون stream فقط یک بار قابل استفاده است)
                        const responseToCache = networkResponse.clone();
                        
                        // ذخیره پاسخ جدید در کش
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return networkResponse;
                    });
            })
            .catch(() => {
                // اگر درخواست برای یک صفحه HTML باشد و آفلاین هستیم، صفحه آفلاین را نمایش بده
                if (event.request.url.match(/\.(html)$/)) {
                    return caches.match('/index.html');
                }
            })
    );
});

// مدیریت پیام‌ها (مثلاً برای به‌روزرسانی)
self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
}); 