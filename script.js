document.addEventListener('DOMContentLoaded', () => {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const messageElement = document.querySelector('.message');
    const githubLink = document.querySelector('.github-link');
    const heading = document.querySelector('h1');
    let progress = 0;
    let isPaused = false;
    let resetCount = 0;

    const messages = [
        { threshold: 10, text: "This might take a moment..." },
        { threshold: 25, text: "We're working on it..." },
        { threshold: 40, text: "Still processing..." },
        { threshold: 50, text: "Halfway there!" },
        { threshold: 65, text: "Just a bit longer..." },
        { threshold: 75, text: "It's worth the wait..." },
        { threshold: 80, text: "Almost done..." },
        { threshold: 90, text: "So close now..." },
        { threshold: 98, text: "Any second now..." }
    ];

    let currentMessageIndex = -1;

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

    function updateMessage(progress) {
        let newMessageIndex = -1;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (progress >= messages[i].threshold) {
                newMessageIndex = i;
                break;
            }
        }
        
        if (newMessageIndex !== currentMessageIndex) {
            currentMessageIndex = newMessageIndex;
            if (currentMessageIndex >= 0) {
                messageElement.textContent = messages[currentMessageIndex].text;
                messageElement.classList.remove('visible');
                void messageElement.offsetWidth;
                messageElement.classList.add('visible');
            }
        }
    }

    function updateProgress() {
        if (isPaused) return;

        progress += 0.1;
        
        if (progress >= 99) {
            isPaused = true;
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
                resetCount++; //This is not used for anything. That's not a bug. It's a feature.
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