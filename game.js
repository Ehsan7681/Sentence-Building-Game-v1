document.addEventListener('DOMContentLoaded', () => {
    // بهینه‌سازی برای موبایل
    setupMobileOptimization();
    
    // ثبت سرویس ورکر برای PWA
    registerServiceWorker();
    
    // راه‌اندازی دکمه تمام‌صفحه
    setupFullscreenButton();
    
    // المان‌های اصلی
    const wordBank = document.getElementById('word-bank');
    const sentenceBuilder = document.getElementById('sentence-builder');
    const checkButton = document.getElementById('check-button');
    const hintButton = document.getElementById('hint-button');
    const backToMenuButton = document.getElementById('back-to-menu');
    const scoreElement = document.getElementById('score');
    const resultModal = document.getElementById('result-modal');
    const resultMessage = document.getElementById('result-message');
    const resultDetails = document.getElementById('result-details');
    
    // المان‌های مربوط به مراحل و پیشرفت
    const currentLevelElement = document.getElementById('current-level');
    const totalLevelsElement = document.getElementById('total-levels');
    const progressBarElement = document.getElementById('progress-bar');
    const levelCompleteModal = document.getElementById('level-complete-modal');
    const levelCompleteDetails = document.getElementById('level-complete-details');
    const nextLevelButton = document.getElementById('next-level-button');
    const stars = document.querySelectorAll('.star');
    
    // المان‌های صوتی
    const correctSound = document.getElementById('correct-sound');
    const wrongSound = document.getElementById('wrong-sound');
    const celebrationSound = document.getElementById('celebration-sound');
    
    // متغیرهای بازی
    let currentSentence = [];
    let currentWords = [];
    let correctOrder = [];
    let score = 0;
    let hintUsed = false;
    let hintCount = 0; // شمارنده تعداد دفعات استفاده از راهنمایی در هر مرحله
    let currentLevel = 1;
    let totalLevels = 10; // تعداد مراحل در هر سطح
    let levelSentences = []; // جملات برای مراحل بازی
    
    // متغیر برای کنترل فعال بودن صدا
    let soundEnabled = true;
    
    // تابع تبدیل اعداد انگلیسی به فارسی
    function toFarsiNumber(n) {
        const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return n.toString().replace(/\d/g, x => farsiDigits[x]);
    }
    
    // جملات نمونه برای بازی
    const sentences = {
        easy: [
            // جملات سه و چهار کلمه‌ای
            "من به مدرسه می‌روم",
            "هوا آفتابی است",
            "این کتاب جالب است",
            "او دوست خوبی است",
            "غذا خیلی خوشمزه است",
            "پدرم خانه آمد",
            "مادرم غذا پخت",
            "علی توپ خرید",
            "سارا نقاشی کشید",
            "بهار فصل زیباست",
            "پاییز برگ‌ها می‌ریزند",
            "زمستان هوا سرد است",
            "تابستان بسیار گرم است",
            "آب خیلی گوارا است",
            "درخت سیب پربار است",
            "گربه شیر خورد",
            "پرنده پرواز کرد",
            "ماه امشب می‌درخشد زیبا",
            "خورشید طلوع کرد",
            "کودک خواب رفت",
            "آسمان آبی است",
            "کلاس درس شروع شد",
            "امروز هوا ابری شد",
            "رود آرام می‌گذرد",
            "باد برگ‌ها را برد",
            "بازی فوتبال تمام شد",
            "کوه پوشیده از برف است",
            "دریا موج دارد امروز",
            "قطار به ایستگاه رسید",
            "دانش‌آموز درس خواند",
            "او سیب می‌خورد",
            "ما فردا برمی‌گردیم",
            "آنها به مسافرت رفتند",
            "هوا امروز آفتابی است",
            "پدرم به خانه آمد",
            "مادرم غذا پخته است",
            "علی توپ جدید خرید",
            "سارا نقاشی زیبا کشید",
            "بهار فصل زیبایی است",
            "او کتاب را خواند",
            "آنها به پارک رفتند",
            "ما فیلم جالبی دیدیم",
            "دوستم هدیه آورده بود",
            "معلم درس را داد",
            "باران دیروز شدید بارید",
            "برف همه‌جا را پوشاند",
            "رنگین‌کمان در آسمان است",
            "گل‌ها شکوفه داده‌اند",
            "پرنده لانه ساخت",
            "روباه زیرک است",
        ],
        medium: [
            // جملات پنج و شش کلمه‌ای
            "کتاب را روی میز گذاشتم",
            "فردا به پارک خواهیم رفت",
            "پدر و مادرم به سفر رفته‌اند",
            "مریم هر روز ورزش می‌کند",
            "این غذا بسیار خوشمزه است",
            "علی دیروز به مدرسه نرفت",
            "ما فردا به سینما می‌رویم",
            "او هر روز کتاب می‌خواند",
            "آنها در باغ قدم می‌زنند",
            "شهر ما بسیار زیبا است",
            "درختان در باد تکان می‌خورند",
            "کودکان در پارک بازی می‌کنند",
            "من نامه را پست کردم",
            "او برای مسابقه آماده می‌شود",
            "ما برای امتحان درس می‌خوانیم",
            "آنها خانه جدیدی خریده‌اند",
            "جشن تولد فردا برگزار می‌شود",
            "همه برای مهمانی آماده شدند",
            "دوستم از سفر برگشته است",
            "باران تمام روز می‌بارید",
            "دانش‌آموزان به اردو خواهند رفت",
            "ماهی‌ها در آب شنا می‌کنند",
            "او دیشب خواب بدی دید",
            "ساعت روی دیوار کار نمی‌کند",
            "میوه‌ها را در یخچال گذاشتم",
            "نان تازه خیلی خوشمزه است",
            "رایانه‌ام امروز خراب شده است",
            "دوچرخه‌ی جدیدم خیلی سریع است",
            "تلفن همراهم شارژ تمام کرد",
            "کفش‌های نو خریدم دیروز",
            "من هر روز به مدرسه می‌روم",
            "او کتاب را روی میز گذاشت",
            "آنها فردا به مسافرت خواهند رفت",
            "ما در پارک قدم می‌زنیم",
            "کودکان در حیاط مدرسه بازی می‌کنند",
            "معلم درس جدید را توضیح داد",
            "پدرم هر روز صبح ورزش می‌کند",
            "مادرم برای ما غذا پخته است",
            "دوستم برای تولدم هدیه آورد",
            "علی در مسابقات ورزشی برنده شد",
            "سارا با دوستانش به سینما رفت",
            "من برای امتحان فردا درس می‌خوانم",
            "آنها خانه جدیدی در شهر خریدند",
            "باران دیشب تمام شهر را خیس کرد",
            "برف همه جای کوچه را پوشاند",
            "کتابخانه مدرسه کتاب‌های زیادی دارد",
            "آهنگ جدید خواننده محبوبم منتشر شد",
            "من هر هفته کتاب جدیدی می‌خوانم",
            "آنها به کنسرت هفته آینده می‌روند",
            "ما در کلاس نقاشی شرکت می‌کنیم",
        ],
        hard: [
            // جملات هفت و هشت کلمه‌ای
            "آن دختر در مدرسه بسیار باهوش است",
            "علی برای امتحان فردا با دقت درس می‌خواند",
            "ما امشب مهمان‌های زیادی در خانه داریم",
            "در فصل بهار درختان شکوفه‌های زیبایی دارند",
            "کتاب جدیدی که خریدم بسیار آموزنده است",
            "دوستم از سفر خارج به کشور بازگشت",
            "مادرم برای مهمانی غذاهای مختلفی پخته است",
            "معلم به دانش‌آموزان تکالیف زیادی داده است",
            "پدرم دیشب دیر از سر کار آمد",
            "ما در تعطیلات به شمال کشور سفر کردیم",
            "آنها برای جشن تولد کیک بزرگی خریدند",
            "هنرمند مشهور تابلوی زیبایی نقاشی کرده است",
            "کتابخانه شهر ما کتاب‌های قدیمی زیادی دارد",
            "ورزشکاران برای مسابقه فردا تمرین سختی می‌کنند",
            "نویسنده کتاب جدیدش را معرفی خواهد کرد",
            "دانشجویان در کلاس درس با دقت گوش می‌دهند",
            "پژوهشگران مقاله علمی مهمی منتشر کرده‌اند",
            "باغبان گل‌های زیبایی در باغچه کاشته است",
            "خواننده جوان آهنگ جدیدی اجرا خواهد کرد",
            "شاعر از طبیعت زیبای روستا الهام گرفت",
            "مسابقه فوتبال دیشب با برد تیم ما پایان یافت",
            "ستاره‌های آسمان در شب صاف به خوبی می‌درخشند",
            "آبشار بلندی از دل کوه‌های سرسبز جاری است",
            "دایناسورها میلیون‌ها سال پیش روی زمین زندگی می‌کردند",
            "انسان‌های اولیه برای شکار از ابزار سنگی استفاده می‌کردند",
            "جنگل‌های بارانی خانه حیوانات و گیاهان بسیاری هستند",
            "یک روباه زیرک برای شکار موش به دشت آمد",
            "کوه‌نوردان برف و یخ را برای رسیدن به قله پیمودند",
            "دانش‌آموزان برای المپیاد علمی سخت تلاش می‌کنند",
            "غروب خورشید صحنه زیبایی در ساحل دریا ایجاد می‌کند",
            "دانش‌آموزان هر روز صبح به مدرسه می‌روند",
            "معلم کتاب داستان جدیدی به کلاس آورده است",
            "ما در تعطیلات تابستان به سفر خواهیم رفت",
            "پدرم بعد از سال‌ها کار سخت بازنشسته شد",
            "مادرم در آشپزخانه غذای خوشمزه‌ای درست می‌کند",
            "هنرمند مشهور در موزه نمایشگاه بزرگی برگزار کرد",
            "کشاورزان هر سال محصولات زیادی برداشت می‌کنند",
            "دانشمندان در آزمایشگاه پروژه جدیدی را آغاز کردند",
            "نویسنده بعد از سال‌ها کتاب جدیدی منتشر کرد",
            "ورزشکار ایرانی در مسابقات جهانی مدال طلا گرفت",
            "هوا امروز بسیار سرد است و برف می‌بارد",
            "کودکان در حیاط مدرسه با شادی بازی می‌کنند",
            "معلم به دانش‌آموزان درباره تاریخ کشور درس می‌دهد",
            "پزشکان در بیمارستان شبانه روز به بیماران کمک می‌کنند",
            "دانشجویان برای امتحانات پایان ترم درس می‌خوانند",
            "مهندسان ساختمان بزرگی در مرکز شهر می‌سازند",
            "خبرنگاران از سراسر جهان به محل حادثه آمدند",
            "هنرمند جوان برای اولین بار کنسرت برگزار کرد",
            "گردشگران از مناظر زیبای طبیعت عکس می‌گیرند",
            "نقاش مشهور تابلوی زیبایی از طبیعت کشیده است",
        ]
    };
    
    // اعمال تم ذخیره شده به صفحه
    applyTheme();
    
    // شروع بازی
    initGame();
    
    // اتصال event listeners
    checkButton.addEventListener('click', checkSentence);
    hintButton.addEventListener('click', showHint);
    backToMenuButton.addEventListener('click', confirmBackToMenu);
    nextLevelButton.addEventListener('click', nextLevel);
    
    // راه‌اندازی پشتیبانی لمسی برای موبایل
    setupTouchEvents();
    
    // تابع شروع بازی
    function initGame() {
        // بررسی وجود داده ذخیره شده
        if (localStorage.getItem('gameProgress')) {
            loadGameProgress();
        } else {
            // بازنشانی متغیرها
            score = 0; // شروع با امتیاز صفر
            currentLevel = 1;
            
            // انتخاب جملات برای مراحل بازی
            selectLevelSentences();
        }
        
        // به‌روزرسانی المان‌های نمایشی
        scoreElement.textContent = toFarsiNumber(score);
        currentLevelElement.textContent = toFarsiNumber(currentLevel);
        totalLevelsElement.textContent = toFarsiNumber(totalLevels);
        updateProgressBar();
        
        // شروع مرحله
        getNewSentence();
    }
    
    // تابع ذخیره پیشرفت بازی
    function saveGameProgress() {
        const gameProgress = {
            score: score,
            currentLevel: currentLevel,
            levelSentences: levelSentences,
            hintCount: hintCount
        };
        
        localStorage.setItem('gameProgress', JSON.stringify(gameProgress));
    }
    
    // تابع بازیابی پیشرفت بازی
    function loadGameProgress() {
        const gameProgress = JSON.parse(localStorage.getItem('gameProgress'));
        
        score = gameProgress.score;
        currentLevel = gameProgress.currentLevel;
        levelSentences = gameProgress.levelSentences;
        hintCount = gameProgress.hintCount || 0; // برای سازگاری با نسخه‌های قبلی
    }
    
    // تابع تایید بازگشت به منو
    function confirmBackToMenu() {
        showConfirmModal(
            'بازگشت به منو',
            'با بازگشت به منو، تمام پیشرفت شما در این بازی پاک خواهد شد. آیا مطمئن هستید؟',
            function() {
                // پاک کردن پیشرفت بازی
                localStorage.removeItem('gameProgress');
                
                // بازگشت به منو
                backToMenu();
            },
            null,
            'بله، بازگشت به منو',
            'خیر، ادامه بازی',
            true
        );
    }
    
    // تابع انتخاب جملات برای مراحل بازی
    function selectLevelSentences() {
        // دریافت سطح سختی بازی
        const difficulty = localStorage.getItem('difficulty') || 'easy';
        
        // انتخاب تصادفی جملات بر اساس سطح سختی
        const availableSentences = [...sentences[difficulty]];
        levelSentences = [];
        
        // انتخاب تصادفی totalLevels جمله از آرایه جملات
        for (let i = 0; i < totalLevels; i++) {
            if (availableSentences.length === 0) break;
            
            const randomIndex = Math.floor(Math.random() * availableSentences.length);
            levelSentences.push(availableSentences[randomIndex]);
            availableSentences.splice(randomIndex, 1);
        }
        
        // اگر جملات کافی نبود، کل آرایه را برمی‌گردانیم
        if (levelSentences.length < totalLevels) {
            levelSentences = sentences[difficulty].slice(0, totalLevels);
        }
    }
    
    // تابع به‌روزرسانی نوار پیشرفت
    function updateProgressBar() {
        const progressPercentage = (currentLevel - 1) / totalLevels * 100;
        progressBarElement.style.width = `${progressPercentage}%`;
    }
    
    // تابع رفتن به مرحله بعدی
    function nextLevel() {
        levelCompleteModal.style.display = 'none';
        
        if (currentLevel < totalLevels) {
            currentLevel++;
            currentLevelElement.textContent = toFarsiNumber(currentLevel);
            updateProgressBar();
            hintCount = 0; // ریست کردن شمارنده راهنمایی برای مرحله جدید
            saveGameProgress(); // ذخیره پیشرفت بازی
            getNewSentence();
        } else {
            // اتمام تمام مراحل
            showGameCompleteScreen();
            localStorage.removeItem('gameProgress'); // پاک کردن پیشرفت بازی بعد از اتمام
        }
    }
    
    // تابع نمایش صفحه پایان بازی با جشن و کانفتی
    function showGameCompleteScreen() {
        // نمایش امتیاز نهایی
        const finalScoreElement = document.getElementById('final-score-details');
        finalScoreElement.textContent = `امتیاز نهایی شما: ${toFarsiNumber(score)}`;
        
        // اضافه کردن رویداد برای دکمه بازگشت به منو
        const backToMenuFinalButton = document.getElementById('back-to-menu-final');
        backToMenuFinalButton.addEventListener('click', backToMenu);
        
        // ایجاد افکت کانفتی
        createConfetti();
        
        // پخش صدای جشن
        playCelebrationSound();
        
        // نمایش مودال
        const gameCompleteModal = document.getElementById('game-complete-modal');
        gameCompleteModal.style.display = 'flex';
    }
    
    // تابع ایجاد افکت کانفتی
    function createConfetti() {
        const confettiContainer = document.getElementById('confetti-container');
        confettiContainer.innerHTML = ''; // پاک کردن کانفتی‌های قبلی
        
        const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590', '#277da1'];
        const confettiCount = 150; // تعداد کانفتی
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // تنظیم رنگ تصادفی
            const colorIndex = Math.floor(Math.random() * colors.length);
            confetti.style.backgroundColor = colors[colorIndex];
            
            // تنظیم اندازه تصادفی
            const size = Math.random() * 10 + 5;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            
            // تنظیم موقعیت تصادفی
            const startPositionX = Math.random() * 100;
            confetti.style.left = `${startPositionX}%`;
            
            // تنظیم سرعت افتادن تصادفی
            const fallDuration = Math.random() * 5 + 3;
            confetti.style.animation = `confetti-fall ${fallDuration}s linear infinite`;
            
            // تنظیم تأخیر تصادفی برای شروع انیمیشن
            const startDelay = Math.random() * 5;
            confetti.style.animationDelay = `${startDelay}s`;
            
            // تنظیم شکل تصادفی (مربع یا دایره)
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }
            
            confettiContainer.appendChild(confetti);
        }
    }
    
    // تابع نمایش مودال تکمیل مرحله
    function showLevelCompleteModal(earnedPoints) {
        levelCompleteDetails.textContent = `شما مرحله ${toFarsiNumber(currentLevel)} را با ${toFarsiNumber(earnedPoints)} امتیاز به پایان رساندید.`;
        
        // فعال کردن ستاره‌ها بر اساس استفاده از راهنمایی
        const starsToShow = hintUsed ? 2 : 3;
        
        // ریست کردن ستاره‌ها
        stars.forEach(star => star.classList.remove('active'));
        
        // فعال کردن ستاره‌ها با تأخیر برای ایجاد انیمیشن
        for (let i = 0; i < starsToShow; i++) {
            setTimeout(() => {
                stars[i].classList.add('active');
            }, i * 300);
        }
        
        levelCompleteModal.style.display = 'flex';
    }
    
    // تابع گرفتن جملۀ جدید
    function getNewSentence() {
        // پاک‌سازی فضای بازی
        wordBank.innerHTML = '';
        sentenceBuilder.innerHTML = '';
        hintUsed = false;
        hintCount = 0; // ریست کردن شمارنده راهنمایی برای جمله جدید
        
        // انتخاب جمله برای مرحله فعلی
        const sentence = levelSentences[currentLevel - 1];
        
        // تقسیم جمله به کلمات
        currentSentence = sentence.split(' ');
        correctOrder = [...currentSentence];
        
        // به هم ریختن ترتیب کلمات
        currentWords = shuffle([...currentSentence]);
        
        // نمایش کلمات در word bank
        currentWords.forEach(word => {
            const wordElement = createWordElement(word);
            wordBank.appendChild(wordElement);
            
            // اضافه کردن قابلیت drag and drop
            wordElement.draggable = true;
            wordElement.addEventListener('dragstart', dragStart);
            wordElement.addEventListener('click', moveWord);
        });
        
        // تنظیم drag and drop برای sentence builder
        sentenceBuilder.addEventListener('dragover', dragOver);
        sentenceBuilder.addEventListener('drop', drop);
        wordBank.addEventListener('dragover', dragOver);
        wordBank.addEventListener('drop', drop);
        
        // ذخیره پیشرفت بازی بعد از گرفتن جمله جدید
        saveGameProgress();
    }
    
    // تابع ایجاد المان کلمه
    function createWordElement(word) {
        const wordElement = document.createElement('div');
        wordElement.className = 'word-item';
        wordElement.textContent = word;
        wordElement.dataset.word = word;
        return wordElement;
    }
    
    // توابع مربوط به drag and drop
    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.word);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
            e.target.style.opacity = '0.4';
        }, 0);
    }
    
    function dragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
    
    function drop(e) {
        e.preventDefault();
        const word = e.dataTransfer.getData('text/plain');
        const wordElement = document.querySelector(`.word-item[data-word="${word}"]`);
        
        if (wordElement) {
            wordElement.style.opacity = '1';
            if (e.currentTarget.id === 'sentence-builder' && wordElement.parentElement.id === 'word-bank') {
                sentenceBuilder.appendChild(wordElement);
            } else if (e.currentTarget.id === 'word-bank' && wordElement.parentElement.id === 'sentence-builder') {
                wordBank.appendChild(wordElement);
            }
        }
    }
    
    // تابع کلیک روی کلمه
    function moveWord(e) {
        const wordElement = e.target;
        if (wordElement.parentElement.id === 'word-bank') {
            sentenceBuilder.appendChild(wordElement);
        } else if (wordElement.parentElement.id === 'sentence-builder') {
            wordBank.appendChild(wordElement);
        }
    }
    
    // تابع بررسی صحت جمله
    function checkSentence() {
        if (sentenceBuilder.childElementCount === 0) {
            showModal('خطا', 'لطفا ابتدا جمله‌ای بسازید!');
            return;
        }
        
        const userSentence = Array.from(sentenceBuilder.children).map(word => word.dataset.word);
        const isCorrect = arraysEqual(userSentence, correctOrder);
        
        // محاسبه امتیاز بر اساس سختی بازی
        const difficulty = localStorage.getItem('difficulty') || 'easy';
        let basePoints;
        
        switch (difficulty) {
            case 'easy':
                basePoints = 10;
                break;
            case 'medium':
                basePoints = 15;
                break;
            case 'hard':
                basePoints = 20;
                break;
            default:
                basePoints = 10;
        }
        
        if (isCorrect) {
            // پخش صدای جواب درست
            playCorrectSound();
            
            // کاهش امتیاز در صورت استفاده از راهنمایی
            const points = hintUsed ? Math.floor(basePoints / 2) : basePoints;
            score += points;
            scoreElement.textContent = toFarsiNumber(score);
            
            saveGameProgress(); // ذخیره پیشرفت بازی
            
            sentenceBuilder.classList.add('correct-answer');
            
            setTimeout(() => {
                sentenceBuilder.classList.remove('correct-answer');
                
                // نمایش مودال تکمیل مرحله
                showLevelCompleteModal(points);
            }, 1000);
        } else {
            // پخش صدای جواب اشتباه
            playWrongSound();
            
            showModal('اشتباه!', 'جمله درست نیست. دوباره تلاش کنید.');
            sentenceBuilder.classList.add('wrong-answer');
            setTimeout(() => {
                sentenceBuilder.classList.remove('wrong-answer');
            }, 1500);
        }
    }
    
    // تابع نمایش راهنمایی
    function showHint() {
        // بررسی تعداد دفعات استفاده از راهنمایی
        if (hintCount >= 2) {
            showModal('محدودیت راهنمایی', 'شما در این مرحله بیش از ۲ بار نمی‌توانید از راهنمایی استفاده کنید.');
            return;
        }
        
        // بررسی امتیاز کافی
        if (score < 2) {
            showModal('خطا', 'امتیاز کافی برای استفاده از راهنمایی ندارید. حداقل ۲ امتیاز نیاز است.');
            return;
        }
        
        // نمایش پنجره تأیید
        showConfirmModal(
            'استفاده از راهنمایی',
            'استفاده از راهنمایی ۲ امتیاز از شما کسر خواهد کرد. آیا مطمئن هستید؟',
            function() {
                // کم کردن امتیاز
                score -= 2;
                scoreElement.textContent = toFarsiNumber(score);
                
                // افزایش شمارنده راهنمایی
                hintCount++;
                
                // فعال کردن فلگ استفاده از راهنمایی
                hintUsed = true;
                
                // ذخیره پیشرفت بازی
                saveGameProgress();
                
                // نمایش راهنمایی
                showHintAction();
            },
            null,
            'بله، نمایش راهنمایی',
            'خیر، انصراف'
        );
    }
    
    // تابع اجرای عمل راهنمایی
    function showHintAction() {
        if (sentenceBuilder.childElementCount === 0) {
            // جایگذاری اولین کلمه صحیح
            const correctFirstWord = correctOrder[0];
            const wordElement = document.querySelector(`.word-item[data-word="${correctFirstWord}"]`);
            
            if (wordElement && wordElement.parentElement.id === 'word-bank') {
                sentenceBuilder.appendChild(wordElement);
            }
        } else {
            // جایگذاری کلمه بعدی صحیح
            const userSentence = Array.from(sentenceBuilder.children).map(word => word.dataset.word);
            if (userSentence.length < correctOrder.length) {
                const nextCorrectIndex = userSentence.length;
                const nextCorrectWord = correctOrder[nextCorrectIndex];
                const wordElement = document.querySelector(`.word-item[data-word="${nextCorrectWord}"]`);
                
                if (wordElement && wordElement.parentElement.id === 'word-bank') {
                    sentenceBuilder.appendChild(wordElement);
                }
            }
        }
    }
    
    // تابع بازگشت به منو
    function backToMenu() {
        window.location.href = 'index.html';
    }
    
    // توابع کمکی
    function arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }
    
    function shuffle(array) {
        let currentIndex = array.length;
        let randomIndex;
        
        // تا زمانی که المانی باقی مانده است
        while (currentIndex !== 0) {
            // انتخاب یک المان باقی‌مانده
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            
            // تعویض با المان فعلی
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        
        return array;
    }
    
    // نمایش مودال پیشرفته با دکمه‌های مختلف
    function showConfirmModal(title, message, confirmCallback, cancelCallback = null, confirmText = 'تأیید', cancelText = 'انصراف', isDanger = false) {
        // تنظیم متن سرتیتر و پیام
        resultMessage.textContent = title;
        resultDetails.textContent = message;
        
        // حذف دکمه‌های قبلی
        const oldButtons = document.querySelector('.modal-buttons');
        if (oldButtons) {
            oldButtons.remove();
        }
        
        // ایجاد کانتینر دکمه‌ها
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'modal-buttons';
        
        // ایجاد دکمه تأیید
        const confirmButton = document.createElement('button');
        confirmButton.className = isDanger ? 'modal-button danger' : 'modal-button';
        confirmButton.textContent = confirmText;
        confirmButton.onclick = function() {
            resultModal.style.display = 'none';
            if (confirmCallback) confirmCallback();
        };
        
        // ایجاد دکمه لغو
        const cancelButton = document.createElement('button');
        cancelButton.className = 'modal-button cancel';
        cancelButton.textContent = cancelText;
        cancelButton.onclick = function() {
            resultModal.style.display = 'none';
            if (cancelCallback) cancelCallback();
        };
        
        // اضافه کردن دکمه‌ها به کانتینر (ابتدا لغو، سپس تأیید)
        buttonsContainer.appendChild(cancelButton);
        buttonsContainer.appendChild(confirmButton);
        
        // اضافه کردن کانتینر دکمه‌ها به مودال
        const modalContent = document.querySelector('#result-modal .modal-content');
        modalContent.appendChild(buttonsContainer);
        
        // نمایش مودال
        resultModal.style.display = 'flex';
    }
    
    // نمایش مودال ساده با یک دکمه
    function showModal(title, message) {
        // تنظیم متن سرتیتر و پیام
        resultMessage.textContent = title;
        resultDetails.textContent = message;
        
        // حذف دکمه‌های قبلی
        const oldButtons = document.querySelector('.modal-buttons');
        if (oldButtons) {
            oldButtons.remove();
        }
        
        // ایجاد کانتینر دکمه‌ها
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'modal-buttons';
        
        // ایجاد دکمه تأیید
        const confirmButton = document.createElement('button');
        confirmButton.className = 'modal-button';
        confirmButton.textContent = 'ادامه';
        confirmButton.onclick = function() {
            resultModal.style.display = 'none';
        };
        
        // اضافه کردن دکمه به کانتینر
        buttonsContainer.appendChild(confirmButton);
        
        // اضافه کردن کانتینر دکمه‌ها به مودال
        const modalContent = document.querySelector('#result-modal .modal-content');
        modalContent.appendChild(buttonsContainer);
        
        // نمایش مودال
        resultModal.style.display = 'flex';
    }
    
    // تابع اعمال تم
    function applyTheme() {
        const theme = localStorage.getItem('theme') || 'default';
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
    
    // تابع بهینه‌سازی برای موبایل
    function setupMobileOptimization() {
        // جلوگیری از زوم در موبایل برای UX بهتر
        document.addEventListener('touchmove', function (event) {
            if (event.scale !== 1) {
                event.preventDefault();
            }
        }, { passive: false });
        
        // حل مشکل تأخیر 300ms در کلیک روی موبایل
        document.documentElement.style.touchAction = 'manipulation';
        
        // ایجاد نمای تمام صفحه برای موبایل
        const goFullScreen = () => {
            // استفاده از تابع toggleFullScreen به جای کد قبلی
            const docElm = document.documentElement;
            if (!document.fullscreenElement && docElm.requestFullscreen) {
                docElm.requestFullscreen().catch(err => {
                    console.log(`خطا در رفتن به حالت تمام صفحه: ${err.message}`);
                });
            } else if (!document.webkitFullscreenElement && docElm.webkitRequestFullscreen) {
                docElm.webkitRequestFullscreen();
            } else if (!document.mozFullScreenElement && docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            } else if (!document.msFullscreenElement && docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
            }
        };
        
        // ایجاد حالت تمام صفحه با اولین تعامل کاربر
        document.addEventListener('touchstart', function() {
            goFullScreen();
        }, { once: true });
        
        // حالت چرخش صفحه
        window.addEventListener('orientationchange', function() {
            // به‌روزرسانی چیدمان بعد از چرخش
            setTimeout(() => {
                updateLayoutAfterRotation();
            }, 200);
        });
        
        // اعمال تنظیمات برای بهبود تجربه اپ
        if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
            // حالت PWA فعال
            document.body.classList.add('pwa-mode');
        }
    }
    
    // به‌روزرسانی چیدمان بعد از چرخش صفحه
    function updateLayoutAfterRotation() {
        // اعمال تنظیمات لازم برای چیدمان بعد از چرخش
        const isLandscape = window.matchMedia('(orientation: landscape)').matches;
        const gameControls = document.querySelector('.game-controls');
        
        if (isLandscape) {
            gameControls.style.flexDirection = 'row';
        } else {
            gameControls.style.flexDirection = 'column';
        }
        
        // اصلاح اندازه و موقعیت المان‌ها
        window.scrollTo(0, 0);
    }
    
    // ثبت سرویس ورکر
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('service-worker.js')
                    .then(registration => {
                        console.log('Service Worker ثبت شد:', registration);
                    })
                    .catch(error => {
                        console.log('خطا در ثبت Service Worker:', error);
                    });
            });
        }
    }
    
    // اضافه کردن پشتیبانی لمسی برای موبایل
    function setupTouchEvents() {
        let touchedElement = null;
        let originalParent = null;
        let touchStartX = 0;
        let touchStartY = 0;
        
        // مدیریت شروع لمس
        document.addEventListener('touchstart', function(e) {
            if (e.target.classList.contains('word-item')) {
                touchedElement = e.target;
                originalParent = touchedElement.parentElement;
                
                // ذخیره موقعیت شروع لمس
                const touch = e.touches[0];
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                
                // نمایش وضعیت "انتخاب شده"
                touchedElement.style.opacity = '0.7';
                touchedElement.style.transform = 'scale(1.05)';
                touchedElement.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
            }
        }, { passive: false });
        
        // مدیریت حرکت انگشت
        document.addEventListener('touchmove', function(e) {
            if (touchedElement) {
                e.preventDefault(); // جلوگیری از اسکرول صفحه
                
                // ذخیره موقعیت فعلی لمس
                const touch = e.touches[0];
                const currentX = touch.clientX;
                const currentY = touch.clientY;
                
                // ایجاد افکت جابجایی با CSS Transform
                const deltaX = currentX - touchStartX;
                const deltaY = currentY - touchStartY;
                touchedElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
            }
        }, { passive: false });
        
        // مدیریت پایان لمس
        document.addEventListener('touchend', function(e) {
            if (touchedElement) {
                // بازگرداندن استایل به حالت عادی
                touchedElement.style.opacity = '1';
                touchedElement.style.transform = 'scale(1)';
                touchedElement.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                
                // بررسی موقعیت رها کردن
                const elementRect = touchedElement.getBoundingClientRect();
                const sentenceBuilderRect = sentenceBuilder.getBoundingClientRect();
                const wordBankRect = wordBank.getBoundingClientRect();
                
                // تشخیص محل رها کردن
                if (
                    elementRect.top + elementRect.height / 2 > sentenceBuilderRect.top &&
                    elementRect.bottom - elementRect.height / 2 < sentenceBuilderRect.bottom &&
                    elementRect.left + elementRect.width / 2 > sentenceBuilderRect.left &&
                    elementRect.right - elementRect.width / 2 < sentenceBuilderRect.right &&
                    originalParent.id === 'word-bank'
                ) {
                    // انتقال به sentence-builder
                    sentenceBuilder.appendChild(touchedElement);
                } else if (
                    elementRect.top + elementRect.height / 2 > wordBankRect.top &&
                    elementRect.bottom - elementRect.height / 2 < wordBankRect.bottom &&
                    elementRect.left + elementRect.width / 2 > wordBankRect.left &&
                    elementRect.right - elementRect.width / 2 < wordBankRect.right &&
                    originalParent.id === 'sentence-builder'
                ) {
                    // انتقال به word-bank
                    wordBank.appendChild(touchedElement);
                } else {
                    // بازگشت به مکان اصلی
                    originalParent.appendChild(touchedElement);
                }
                
                touchedElement = null;
                originalParent = null;
            }
        }, { passive: false });
        
        // لغو تعامل لمسی هنگام خروج از صفحه
        document.addEventListener('touchcancel', function() {
            if (touchedElement) {
                touchedElement.style.opacity = '1';
                touchedElement.style.transform = 'scale(1)';
                touchedElement.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                touchedElement = null;
                originalParent = null;
            }
        }, { passive: false });
    }
    
    // راه‌اندازی دکمه تمام‌صفحه
    function setupFullscreenButton() {
        const fullscreenButton = document.getElementById('fullscreen-button');
        
        // بررسی پشتیبانی مرورگر از API تمام‌صفحه
        const isFullscreenSupported = document.fullscreenEnabled || 
            document.webkitFullscreenEnabled || 
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled;
        
        // نمایش دکمه فقط در صورت پشتیبانی مرورگر
        if (!isFullscreenSupported) {
            fullscreenButton.style.display = 'none';
            return;
        }
        
        // بررسی وضعیت فعلی تمام‌صفحه
        function updateFullscreenButtonIcon() {
            if (document.fullscreenElement || 
                document.webkitFullscreenElement || 
                document.mozFullScreenElement ||
                document.msFullscreenElement) {
                fullscreenButton.classList.add('fullscreen-exit');
            } else {
                fullscreenButton.classList.remove('fullscreen-exit');
            }
        }
        
        // تغییر وضعیت تمام‌صفحه با کلیک روی دکمه
        fullscreenButton.addEventListener('click', () => {
            toggleFullScreen();
        });
        
        // رویداد تغییر حالت تمام‌صفحه
        document.addEventListener('fullscreenchange', updateFullscreenButtonIcon);
        document.addEventListener('webkitfullscreenchange', updateFullscreenButtonIcon);
        document.addEventListener('mozfullscreenchange', updateFullscreenButtonIcon);
        document.addEventListener('MSFullscreenChange', updateFullscreenButtonIcon);
        
        // تابع تغییر وضعیت تمام‌صفحه
        function toggleFullScreen() {
            if (document.fullscreenElement || 
                document.webkitFullscreenElement || 
                document.mozFullScreenElement ||
                document.msFullscreenElement) {
                // خروج از حالت تمام‌صفحه
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                // ورود به حالت تمام‌صفحه
                const docElm = document.documentElement;
                if (docElm.requestFullscreen) {
                    docElm.requestFullscreen();
                } else if (docElm.webkitRequestFullscreen) {
                    docElm.webkitRequestFullscreen();
                } else if (docElm.mozRequestFullScreen) {
                    docElm.mozRequestFullScreen();
                } else if (docElm.msRequestFullscreen) {
                    docElm.msRequestFullscreen();
                }
            }
        }
    }
    
    // توابع برای پخش صدا
    function playSound(soundElement) {
        if (soundEnabled && soundElement) {
            // بررسی اینکه آیا فایل صوتی بارگذاری شده است
            if (soundElement.readyState === 0) {
                console.warn("فایل صوتی بارگذاری نشده است.");
                return;
            }
            
            // ریست کردن صدا قبل از پخش برای اطمینان از پخش مجدد
            soundElement.pause();
            soundElement.currentTime = 0;
            
            // تلاش برای پخش صدا با catch کردن خطاهای احتمالی
            const playPromise = soundElement.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("خطا در پخش صدا:", error);
                });
            }
        }
    }
    
    // توابع اختصاصی پخش صدا
    function playCorrectSound() {
        playSound(correctSound);
    }
    
    function playWrongSound() {
        playSound(wrongSound);
    }
    
    function playCelebrationSound() {
        playSound(celebrationSound);
    }
}); 