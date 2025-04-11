document.addEventListener('DOMContentLoaded', () => {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const messageElement = document.querySelector('.message');
    const githubLink = document.querySelector('.github-link');
    const heading = document.querySelector('h1');
    let progress = 0;
    let isPaused = false;
    let resetCount = 0;
    let currentMessageIndex = -1;

    const BACKEND_URL = window.APP_CONFIG.backendUrl;

    setTimeout(() => {
        heading.style.animation = 'none';
        heading.style.transform = 'translateY(0)';
        heading.style.opacity = '1';
        
        setTimeout(() => {
            heading.style.opacity = '0';
            setTimeout(() => {
                heading.textContent = 'Thank you for your patience';
                heading.style.opacity = '1';
            }, 500);
        }, 500);
    }, 5000);

    async function updateMessage(progress) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/message?setIndex=${resetCount}&progress=${progress}`);
            const data = await response.json();
            
            if (data.message !== null) {
                messageElement.textContent = data.message;
                messageElement.classList.remove('visible');
                void messageElement.offsetWidth;
                messageElement.classList.add('visible');
            }

            if (progress >= 25 && !githubLink.classList.contains('visible')) {
                githubLink.classList.add('visible');
            }
        } catch (error) {
            console.error('Error fetching message:', error);
        }
    }

    function updateProgress() {
        if (isPaused) return;

        progress += window.APP_CONFIG.increment;
        
        if (progress >= 99) {
            isPaused = true;
            resetCount++;
            messageElement.textContent = "Just a few more seconds...";
            messageElement.classList.remove('visible');
            void messageElement.offsetWidth;
            messageElement.classList.add('visible');

            setTimeout(() => {
                progress = 0;
                isPaused = false;
                messageElement.textContent = "Oops! Let's try again...";
                messageElement.classList.remove('visible');
                void messageElement.offsetWidth;
                messageElement.classList.add('visible');
                currentMessageIndex = -1;
                githubLink.classList.remove('visible');
            }, 3000);
        }

        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.floor(progress)}%`;
        updateMessage(progress);
    }

    setTimeout(() => {
        setInterval(updateProgress, 100);
    }, 1500);
}); 