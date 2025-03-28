document.addEventListener('DOMContentLoaded', () => {
    // المان‌های اصلی
    const themeOptions = document.querySelectorAll('.theme-option');
    const difficultyOptions = document.querySelectorAll('input[name="difficulty"]');
    const saveButton = document.getElementById('save-settings');
    const backToMenuButton = document.getElementById('back-to-menu');
    const backButton = document.getElementById('back-button');
    
    // تنظیم مقادیر پیش‌فرض
    let selectedTheme = localStorage.getItem('theme') || 'default';
    let selectedDifficulty = localStorage.getItem('difficulty') || 'easy';
    
    // تنظیم حالت انتخاب شده برای تم
    themeOptions.forEach(option => {
        const theme = option.dataset.theme;
        if (theme === selectedTheme) {
            option.classList.add('selected');
        }
        
        option.addEventListener('click', () => {
            // برداشتن کلاس selected از همه گزینه‌ها
            themeOptions.forEach(opt => opt.classList.remove('selected'));
            // اضافه کردن کلاس selected به گزینه انتخاب شده
            option.classList.add('selected');
            selectedTheme = theme;
        });
    });
    
    // تنظیم حالت انتخاب شده برای سختی
    difficultyOptions.forEach(option => {
        if (option.value === selectedDifficulty) {
            option.checked = true;
        }
        
        option.addEventListener('change', () => {
            if (option.checked) {
                selectedDifficulty = option.value;
            }
        });
    });
    
    // ذخیره تنظیمات
    saveButton.addEventListener('click', () => {
        localStorage.setItem('theme', selectedTheme);
        localStorage.setItem('difficulty', selectedDifficulty);
        
        // نمایش پیام موفقیت
        alert('تنظیمات با موفقیت ذخیره شد.');
        
        // اعمال تم به صفحه فعلی
        applyTheme(selectedTheme);
    });
    
    // بازگشت به منو
    backToMenuButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // برگشت به صفحه قبلی
    backButton.addEventListener('click', () => {
        window.history.back();
    });
    
    // اعمال تم به صفحه فعلی
    applyTheme(selectedTheme);
    
    // تابع اعمال تم
    function applyTheme(theme) {
        const body = document.body;
        
        // پاک کردن کلاس‌های تم قبلی
        body.classList.remove('theme-default', 'theme-dark', 'theme-nature', 'theme-sunset', 'theme-white', 'theme-skyblue', 'theme-purple');
        
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
            case 'white':
                body.style.background = 'rgba(255, 255, 255, 0.7)';
                document.documentElement.style.setProperty('--glass-opacity', '0.8');
                document.documentElement.style.setProperty('--glass-blur', '15px');
                break;
            case 'skyblue':
                body.style.background = 'linear-gradient(45deg, #48c6ef, #6f86d6)';
                break;
            case 'purple':
                body.style.background = 'linear-gradient(45deg, #8e44ad, #9b59b6)';
                break;
        }
    }
}); 