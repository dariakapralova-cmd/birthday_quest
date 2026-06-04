// НАСТРОЙКИ
const CONFIG = {
    devName: "Вова" // ← Имя именинника
};

// Состояние
let currentLevel = 1;
let bugsFixed = 0;
const totalBugs = 5;
let sliderPos = 0;
let sliderDir = 1;
let buildInterval;

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('dev-name').textContent = CONFIG.devName;
    initLevel1();
    startTimer();
});

function startTimer() {
    let sec = 0;
    setInterval(() => {
        sec++;
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        document.getElementById('timer').textContent = `${m}:${s}`;
    }, 1000);
}

// === LEVEL 1: CSS BUGS ===
function initLevel1() {
    const bugs = [
        { id: 'bug-nav', fix: () => { document.getElementById('bug-nav').style.opacity = '1'; document.getElementById('bug-nav').style.zIndex = '10'; } },
        { id: 'bug-hero', fix: () => { document.getElementById('bug-hero').style.marginTop = '0'; } },
        { id: 'bug-text', fix: () => { document.getElementById('bug-text').style.whiteSpace = 'normal'; } },
        { id: 'bug-image', fix: () => { 
            const img = document.getElementById('bug-image');
            img.innerHTML = '🖼️ Красивое фото';
            img.style.background = '#e8f5e9';
            img.style.color = '#2e7d32';
        }},
        { id: 'bug-button', fix: () => { document.getElementById('bug-button').style.transform = 'none'; } }
    ];

    bugs.forEach(bug => {
        const el = document.getElementById(bug.id);
        el.addEventListener('click', function() {
            if (this.classList.contains('fixed')) return;
            
            this.classList.add('fixed');
            bug.fix();
            bugsFixed++;
            document.getElementById('bugs-left').textContent = totalBugs - bugsFixed;
            
            // Эффект починки
            const flash = document.createElement('div');
            flash.textContent = '✅ FIXED';
            flash.style.cssText = 'position:fixed; color:#4ec9b0; font-weight:bold; pointer-events:none; animation:fadeIn 0.5s;';
            flash.style.left = (this.getBoundingClientRect().left + 20) + 'px';
            flash.style.top = this.getBoundingClientRect().top + 'px';
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 1000);
            
            if (bugsFixed === totalBugs) {
                setTimeout(() => nextLevel(), 1000);
            }
        });
    });
}

// === LEVEL 2: CODE REVIEW ===
function checkBug(isBug, element) {
    const result = document.getElementById('review-result');
    
    if (isBug) {
        // Симуляция infinite loop
        result.innerHTML = '<div class="output-line error">⚠ Warning: Maximum update depth exceeded</div>';
        element.style.background = '#f48771';
        element.style.color = '#000';
        
        let count = 0;
        const loop = setInterval(() => {
            result.innerHTML += `<div class="output-line error">React encountered an error > ${count++}</div>`;
            if (count > 4) {
                clearInterval(loop);
                result.innerHTML += '<div class="output-line success">✓ Правильно! Пропущен [] в useEffect!</div>';
                setTimeout(() => nextLevel(), 1500);
            }
        }, 300);
    } else {
        result.innerHTML = '<div class="output-line">Это не баг, это фича. Продолжай поиск...</div>';
        element.style.background = '#264f78';
        setTimeout(() => {
            element.style.background = '';
        }, 500);
    }
}

// === LEVEL 3: BUILD ===
function startLevel3() {
    const slider = document.getElementById('build-slider');
    const warning = document.getElementById('memory-warning');
    
    buildInterval = setInterval(() => {
        sliderPos += 1.5 * sliderDir;
        if (sliderPos >= 85) sliderDir = -1;
        if (sliderPos <= 0) sliderDir = 1;
        slider.style.left = sliderPos + '%';
        
        // Иногда показываем warning если далеко от цели
        if (Math.abs(sliderPos - 60) > 30 && Math.random() > 0.95) {
            warning.style.display = 'block';
            setTimeout(() => warning.style.display = 'none', 1000);
        }
    }, 20);
}

function tryDeploy() {
    const btn = document.getElementById('build-btn');
    const result = document.getElementById('build-result');
    const bar = document.querySelector('.terminal');
    
    // Success zone: от 60% до 76% (примерно)
    const inZone = sliderPos >= 60 && sliderPos <= 76;
    
    if (inZone) {
        clearInterval(buildInterval);
        btn.disabled = true;
        result.innerHTML = '<div class="output-line success">✓ Build succeeded! 42 chunks generated.<br>✓ Deployed to Vercel in 3s</div>';
        
        // Confetti из символов
        createConfetti();
        setTimeout(() => nextLevel(), 2000);
    } else {
        result.innerHTML = '<div class="output-line error">✗ Build failed: JavaScript heap out of memory<br>✗ node_modules deleted itself</div>';
        bar.style.animation = 'shake 0.5s';
        setTimeout(() => bar.style.animation = '', 500);
        
        // Штрафная пауза
        btn.disabled = true;
        setTimeout(() => {
            btn.disabled = false;
            result.innerHTML = '';
        }, 1500);
    }
}

function createConfetti() {
    const symbols = ['🎉', '✨', '💻', '☕', '🐛', '⚛️', '📦'];
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const el = document.createElement('div');
            el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            el.style.position = 'fixed';
            el.style.left = Math.random() * 100 + 'vw';
            el.style.top = '-50px';
            el.style.fontSize = (20 + Math.random() * 20) + 'px';
            el.style.pointerEvents = 'none';
            el.style.zIndex = '9999';
            el.style.animation = `fall ${3 + Math.random() * 2}s linear forwards`;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 5000);
        }, i * 50);
    }
}

// Добавим анимацию падения в CSS через JS
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to { transform: translateY(100vh) rotate(360deg); }
    }
`;
document.head.appendChild(style);

// === NAVIGATION ===
function nextLevel() {
    document.querySelector('.level.active').classList.remove('active');
    currentLevel++;
    
    if (currentLevel <= 3) {
        document.getElementById('level-num').textContent = currentLevel;
        document.getElementById(`level-${currentLevel}`).classList.add('active');
        
        if (currentLevel === 3) startLevel3();
    } else {
        document.getElementById('final').classList.add('active');
        launchFinalConfetti();
    }
}

function launchFinalConfetti() {
    // Дополнительный эффект для финала
    const cake = document.querySelector('.cake');
    cake.style.animation = 'bounce 0.5s infinite';
}
