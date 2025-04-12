document.addEventListener('DOMContentLoaded', () => {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const messageElement = document.querySelector('.message');
    const githubLink = document.querySelector('.github-link');
    const heading = document.querySelector('h1');
    const debugControls = document.getElementById('debug-controls');
    const skipToEndButton = document.getElementById('skip-to-end');
    
    let progress = 0;
    let isPaused = false;
    let currentMessageIndex = -1;
    let lastApiCallTime = 0;
    let endAnimationLoaded = false;

    const { backendUrl, increment, apiIntervalMillis, updateProgressIntervalMillis, debug } = window.APP_CONFIG;

    // Show debug controls in development mode
    if (debug) {
        debugControls.style.display = 'block';
    }

    // Skip to end button functionality
    skipToEndButton?.addEventListener('click', async () => {
        try {
            skipToEndButton.disabled = true;
            skipToEndButton.textContent = 'Loading...';
            
            const response = await fetch(`${backendUrl}/debug/skip-to-end`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                console.error('Failed to skip to end');
                skipToEndButton.textContent = 'Failed';
                setTimeout(() => {
                    skipToEndButton.disabled = false;
                    skipToEndButton.textContent = 'Skip to End';
                }, 2000);
                return;
            }
            
            const data = await response.json();
            
            const messageResponse = await fetch(`${backendUrl}/message`, {
                credentials: 'include'
            });
            
            const messageData = await messageResponse.json();
            
            if (messageData.endMessage) {
                triggerEndAnimation(messageData);
            }
        } catch (error) {
            console.error('Error skipping to end:', error);
            skipToEndButton.textContent = 'Error';
            setTimeout(() => {
                skipToEndButton.disabled = false;
                skipToEndButton.textContent = 'Skip to End';
            }, 2000);
        }
    });

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

    async function updateMessage() {
        const now = Date.now();

        if (now - lastApiCallTime >= apiIntervalMillis()) {
            try {
                const response = await fetch(`${backendUrl}/message`, {
                    credentials: 'include'
                });
                const data = await response.json();
                
                if (data.endMessage) {
                    triggerEndAnimation(data);
                    return;
                }
                
                if (data.text) {
                    messageElement.textContent = data.text;
                    messageElement.classList.remove('visible');
                    void messageElement.offsetWidth;
                    messageElement.classList.add('visible');
                }
                
                if (data.hexColor) {
                    progressFill.style.backgroundColor = data.hexColor;
                }

                if (progress >= 25 && !githubLink.classList.contains('visible')) {
                    githubLink.classList.add('visible');
                }
                
                lastApiCallTime = now;
            } catch (error) {
                console.error('Error fetching message:', error);
            }
        }
    }

    function triggerEndAnimation(data) {
        isPaused = true;
        
        progress = 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.floor(progress)}%`;
        
        messageElement.textContent = data.endMessage;
        messageElement.classList.remove('visible');
        
        heading.style.opacity = '0';
        setTimeout(() => {
            heading.textContent = 'Mission Complete!';
            heading.style.opacity = '1';
        }, 500);
        
        if (data.css) {
            const style = document.createElement('style');
            style.textContent = data.css;
            document.head.appendChild(style);
        }
        
        if (data.classes) {
            Object.entries(data.classes).forEach(([selector, className]) => {
                const element = document.querySelector(selector);
                if (element) {
                    element.classList.add(className);
                }
            });
        }
        
        if (data.animationScript) {
            const script = document.createElement('script');
            script.textContent = data.animationScript;
            document.body.appendChild(script);
        }
        
        if (debug) {
            debugControls.style.display = 'none';
        }
    }

    function updateProgress() {
        if (isPaused) return;

        progress += increment;
        
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
            }, 3000);
        }

        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.floor(progress)}%`;
        updateMessage();
    }

    setTimeout(() => {
        setInterval(updateProgress, updateProgressIntervalMillis());
    }, 1500);
}); 