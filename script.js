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
    let pageLoadTime = Date.now();

    const { backendUrl, increment, apiIntervalMillis, updateProgressIntervalMillis, debug } = window.APP_CONFIG;

    // Set a page reload identifier in session storage
    if (sessionStorage.getItem('pageLoadTimestamp')) {
        // This is a reload, add a custom header to help the server detect reloads
        sessionStorage.setItem('isReload', 'true');
    }
    sessionStorage.setItem('pageLoadTimestamp', pageLoadTime.toString());
    
    // Clear session storage on page unload to ensure fresh start
    window.addEventListener('beforeunload', () => {
        // We intentionally don't clear sessionStorage here so the server 
        // can detect this was a reload on the next page load
    });

    // Show debug controls in development mode
    if (debug) {
        debugControls.style.display = 'block';
    }

    // Skip to end button functionality
    skipToEndButton?.addEventListener('click', async () => {
        try {
            skipToEndButton.disabled = true;
            skipToEndButton.textContent = 'Loading...';
            
            const response = await fetch(`${backendUrl}/api/debug/skip-to-end`, {
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
            
            // Get the end message and token for animation
            const messageResponse = await fetch(`${backendUrl}/api/message`, {
                credentials: 'include'
            });
            
            const messageData = await messageResponse.json();
            
            // Trigger the end animation
            if (messageData.endMessage) {
                triggerServerEndAnimation(messageData.endMessage, messageData.verificationToken || data.token);
                
                // Add debug info about token if in debug mode
                if (debug) {
                    const debugInfo = document.createElement('div');
                    debugInfo.className = 'debug-info';
                    debugInfo.textContent = `Debug: Token = ${messageData.verificationToken || data.token}`;
                    debugControls.appendChild(debugInfo);
                }
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
                // Add custom headers to help server detect reloads
                const headers = {
                    'X-Page-Load-Time': pageLoadTime.toString()
                };
                
                // Add reload header if this is a reload
                if (sessionStorage.getItem('isReload') === 'true') {
                    headers['If-Modified-Since'] = 'reload-detected';
                    // Clear the reload flag after first API call
                    sessionStorage.removeItem('isReload');
                }
                
                const response = await fetch(`${backendUrl}/api/message`, {
                    credentials: 'include',
                    headers
                });
                const data = await response.json();
                
                if (data.endMessage) {
                    // Request the end animation from the server
                    triggerServerEndAnimation(data.endMessage, data.verificationToken);
                    return;
                }
                
                if (data.message !== null) {
                    messageElement.textContent = data.message;
                    messageElement.classList.remove('visible');
                    void messageElement.offsetWidth;
                    messageElement.classList.add('visible');
                }
                if(data.hexColor != null){
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

    // Request end animation from server instead of storing it in client code
    async function triggerServerEndAnimation(endMessage, token) {
        isPaused = true;
        
        // Set progress bar to 100%
        progress = 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.floor(progress)}%`;
        progressFill.style.backgroundColor = '#FFD700';
        
        // Display end message
        messageElement.textContent = endMessage;
        messageElement.classList.remove('visible');
        
        // Change heading
        heading.style.opacity = '0';
        setTimeout(() => {
            heading.textContent = 'Mission Complete!';
            heading.style.opacity = '1';
        }, 500);
        
        try {
            // Request the animation elements from server with verification token
            const response = await fetch(`${backendUrl}/api/end-animation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ token })
            });
            
            if (!response.ok) {
                console.error('Could not load end animation');
                return;
            }
            
            const animationData = await response.json();
            
            // Apply the animation CSS and scripts
            if (animationData.css) {
                const style = document.createElement('style');
                style.textContent = animationData.css;
                document.head.appendChild(style);
            }
            
            // Apply any animation classes
            if (animationData.classes) {
                Object.entries(animationData.classes).forEach(([selector, className]) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        element.classList.add(className);
                    }
                });
            }
            
            // Execute animation function if provided
            if (animationData.animationScript) {
                const script = document.createElement('script');
                script.textContent = animationData.animationScript;
                document.body.appendChild(script);
            }
            
            // Hide debug controls after animation is triggered
            if (debug) {
                debugControls.style.display = 'none';
            }
        } catch (error) {
            console.error('Error loading end animation:', error);
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
        updateMessage(progress);
    }

    setTimeout(() => {
        setInterval(updateProgress, updateProgressIntervalMillis());
    }, 1500);
}); 