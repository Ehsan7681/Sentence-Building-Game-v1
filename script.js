document.addEventListener('DOMContentLoaded', () => {
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
            alert('از بازی خارج شدید!');
            // در اینجا می‌توان عملیات خروج را انجام داد
        }
    });
    
    // اعمال تم ذخیره شده به صفحه
    applyTheme();
    
    // تابع اعمال تم
    function applyTheme() {
        const theme = localStorage.getItem('theme') || 'default';
        const body = document.body;
        
        // پاک کردن کلاس‌های تم قبلی
        body.classList.remove('theme-default', 'theme-dark', 'theme-nature', 'theme-sunset');
        
        // اضافه کردن کلاس تم جدید
        body.classList.add(`theme-${theme}`);
        
        // تنظیم استایل پس‌زمینه بر اساس تم
        switch (theme) {
            case 'default':
                body.style.background = 'linear-gradient(45deg, #3498db, #e74c3c)';
                break;
            case 'dark':
                body.style.background = 'linear-gradient(45deg, #2c3e50, #34495e)';
                break;
            case 'nature':
                body.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
                break;
            case 'sunset':
                body.style.background = 'linear-gradient(45deg, #f39c12, #e74c3c)';
                break;
        }
    }
}); 