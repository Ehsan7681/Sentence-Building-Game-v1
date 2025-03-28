document.addEventListener('DOMContentLoaded', () => {
    // اعمال تم ذخیره شده به صفحه - اجرای سریع برای جلوگیری از چشمک زدن
    applyTheme();
    
    const startButton = document.getElementById('start-button');
    const settingsButton = document.getElementById('settings-button');
    const exitButton = document.getElementById('exit-button');

    startButton.addEventListener('click', () => {
        // هدایت به صفحه بازی جمله‌سازی
        window.location.href = 'game.html';
    });

    settingsButton.addEventListener('click', () => {
        // هدایت به صفحه تنظیمات
        window.location.href = 'settings.html';
    });

    exitButton.addEventListener('click', () => {
        if(confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
            // بدون نمایش alert که باعث کندی می‌شود
            // در اینجا می‌توان عملیات خروج را انجام داد
        }
    });
    
    // تابع اعمال تم
    function applyTheme() {
        const theme = localStorage.getItem('theme') || 'default';
        const body = document.body;
        
        // پاک کردن کلاس‌های تم قبلی
        body.classList.remove('theme-default', 'theme-dark', 'theme-nature', 'theme-sunset', 'theme-white', 'theme-skyblue', 'theme-purple');
        
        // اضافه کردن کلاس تم جدید
        body.classList.add(`theme-${theme}`);
        
        // تنظیم استایل پس‌زمینه بر اساس تم - با کد فشرده‌تر برای سرعت بیشتر
        const backgrounds = {
            'default': 'linear-gradient(45deg, #3498db, #e74c3c)',
            'dark': 'linear-gradient(45deg, #2c3e50, #34495e)',
            'nature': 'linear-gradient(45deg, #27ae60, #2ecc71)',
            'sunset': 'linear-gradient(45deg, #f39c12, #e74c3c)',
            'white': 'rgba(255, 255, 255, 0.7)',
            'skyblue': 'linear-gradient(45deg, #48c6ef, #6f86d6)',
            'purple': 'linear-gradient(45deg, #8e44ad, #9b59b6)'
        };
        
        body.style.background = backgrounds[theme] || backgrounds['default'];
        
        if (theme === 'white') {
            document.documentElement.style.setProperty('--glass-opacity', '0.8');
            document.documentElement.style.setProperty('--glass-blur', '15px');
        }
    }
}); 