document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    // Update this date to the actual wedding date
    const WEDDING_DATE = new Date('March 29, 2026 13:00:00').getTime();

    // --- Elements ---
    const hero = document.getElementById('hero');
    const envelope = document.getElementById('envelope');
    const mainContent = document.getElementById('main-content');

    // --- Check if invite was already opened via Cookie ---
    const inviteOpened = document.cookie.split('; ').find(row => row.startsWith('inviteOpened='));

    if (inviteOpened) {
        hero.style.display = 'none';
        mainContent.classList.remove('hidden');
        mainContent.classList.add('visible');
        document.body.style.overflowY = 'auto';
        window.scrollTo(0, 0);
    }

    // --- Background Video Slow Down ---
    const bgVideo = document.querySelector('.bg-video');
    if (bgVideo) {
        bgVideo.playbackRate = 0.5; // Slow down the video for a cinematic effect
    }

    // --- Envelope Interaction ---
    envelope.addEventListener('click', () => {
        // 1. Animate Envelope Opening
        envelope.classList.add('open');

        // 2. Wait for open animation then fade out hero
        setTimeout(() => {
            hero.classList.add('fade-out');

            // 3. Show Main Content
            mainContent.classList.remove('hidden');
            window.scrollTo(0, 0); // Ensure we start at the top

            // Trigger reflow to ensure transition happens
            void mainContent.offsetWidth;
            mainContent.classList.add('visible');

            // 4. Enable Scroll
            document.body.style.overflowY = 'auto';

            // 5. Remember for next time via Cookie (expires in 1 year)
            const expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            document.cookie = `inviteOpened=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;

        }, 1200); // Wait 1.2s for envelope open + card slide
    });

    // --- Scroll Observer (Reveal Animation) ---
    const observerOptions = {
        threshold: 0.15 // Trigger when 15% of element is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // --- Countdown Timer ---
    // --- Countdown Timer with Count-up Animation ---
    let timerInterval;

    function getTimeRemaining() {
        const now = new Date().getTime();
        const distance = WEDDING_DATE - now;
        if (distance < 0) {
            return { total: distance, days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return {
            total: distance,
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
        };
    }

    function updateDisplay(t) {
        document.getElementById('days').innerText = String(t.days).padStart(2, '0');
        document.getElementById('hours').innerText = String(t.hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(t.minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(t.seconds).padStart(2, '0');
    }

    function startCountdown() {
        // Run immediately then interval
        const t = getTimeRemaining();
        if (t.total < 0) {
            document.getElementById('timer').innerHTML = "<p>Happily Married!</p>";
            return;
        }
        updateDisplay(t);
        timerInterval = setInterval(() => {
            const t = getTimeRemaining();
            if (t.total < 0) {
                clearInterval(timerInterval);
                document.getElementById('timer').innerHTML = "<p>Happily Married!</p>";
            } else {
                updateDisplay(t);
            }
        }, 1000);
    }

    function animateCountUp() {
        const target = getTimeRemaining();
        if (target.total < 0) {
            startCountdown();
            return;
        }

        const duration = 3000; // Slower: 3 seconds
        const frameRate = 30;
        const totalFrames = (duration / 1000) * frameRate;
        let frame = 0;

        const interval = setInterval(() => {
            frame++;
            const progress = frame / totalFrames; // 0 to 1

            // Simple ease-out
            const ease = 1 - Math.pow(1 - progress, 3);

            const current = {
                days: Math.floor(target.days * ease),
                hours: Math.floor(target.hours * ease),
                minutes: Math.floor(target.minutes * ease),
                seconds: Math.floor(target.seconds * ease)
            };

            updateDisplay(current);

            if (frame >= totalFrames) {
                clearInterval(interval);
                startCountdown(); // Switch to real timer
            }
        }, 1000 / frameRate);
    }

    // Observe Countdown Section
    const countdownSection = document.getElementById('countdown');
    const countdownObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    animateCountUp();
                }, 500);
                countdownObserver.unobserve(entry.target); // Run once
            }
        });
    }, { threshold: 0.5 });

    if (countdownSection) {
        countdownObserver.observe(countdownSection);
    }

    // --- Save the Date Button ---
    const handleSaveDate = () => {
        const title = "Wedding%3A%20Paul%20%26%20Fakiha";
        const dates = "20260329T130000/20260329T170000";
        const details = "Join%20us%20in%20celebrating%20our%20wedding%21";
        const location = "Diva%20Restaurant%2C%20Eye%20View%20Park%2C%20Phase%207%20Bahria%20Town%2C%20Rawalpindi";

        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;

        window.open(calendarUrl, '_blank');
    };

    document.querySelectorAll('.save-date-btn').forEach(btn => {
        btn.addEventListener('click', handleSaveDate);
    });

    // --- Share Photos Button ---
    const SHARE_PHOTOS_DATE = new Date('March 29, 2026 00:00:00').getTime();
    const sharePhotosBtn = document.getElementById('share-photos-btn');

    if (sharePhotosBtn) {
        const now = new Date().getTime();
        if (now >= SHARE_PHOTOS_DATE) {
            sharePhotosBtn.style.display = 'inline-block';
        }

        sharePhotosBtn.addEventListener('click', () => {
            window.open('https://auraweddings.github.io/photosharing/', '_blank');
        });
    }

});
