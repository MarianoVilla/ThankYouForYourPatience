const config = {
    development: {
        backendUrl: 'http://localhost:3000',
        increment: 1,
        apiIntervalMillis: () => 100,
        updateProgressIntervalMillis: () => Math.floor(Math.random() * (100 - 50 + 1)) + 50,
        debug: true
    },
    production: {
        backendUrl: 'https://thankyouforyourpatience.onrender.com',
        increment: 1,
        apiIntervalMillis: () => 1000,
        updateProgressIntervalMillis: () => Math.floor(Math.random() * (1000 - 400 + 1)) + 400,
        debug: false
    }
};

const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.protocol === 'file:' ||
                     window.location.protocol === '';

const environment = isDevelopment ? 'development' : 'production';

window.APP_CONFIG = config[environment]; 