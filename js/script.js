document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    // Update this date to the actual wedding date
    const WEDDING_DATE = new Date('March 29, 2026 13:00:00').getTime();

    // --- Elements ---
    const hero = document.getElementById('hero');
    const envelope = document.getElementById('envelope');
    const mainContent = document.getElementById('main-content');


    // --- Envelope Interaction ---
    envelope.addEventListener('click', () => {
        const bgVideo = document.querySelector('.bg-video');
        if (bgVideo) {
            bgVideo.muted = true; // Ensure muted for autoplay policies
            bgVideo.play().catch(e => console.log("Video autoplay restrictions applied"));
        }

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
    function updateTimer() {
        const now = new Date().getTime();
        const distance = WEDDING_DATE - now;

        if (distance < 0) {
            // Welding passed
            document.getElementById('timer').innerHTML = "<p>Happily Married!</p>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    }

    setInterval(updateTimer, 1000);
    updateTimer(); // Initial call

    // --- Save the Date Button ---
    document.getElementById('save-date-btn').addEventListener('click', () => {
        const title = "Wedding%3A%20%5BYour%20Name%5D%20%26%20Fakiha";
        const dates = "20261212T130000Z/20261212T170000Z"; // UTC time (adjust as needed)
        const details = "Join%20us%20in%20celebrating%20our%20wedding%21";
        const location = "Lahore%2C%20Pakistan";

        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;

        window.open(calendarUrl, '_blank');
    });

});
