const config = {
    development: {
        backendUrl: 'https://localhost:7281',
        increment: 1,
        apiIntervalMillis: () => 100,
        updateProgressIntervalMillis: () => Math.floor(Math.random() * (100 - 50 + 1)) + 50,
        debug: true
    },
    production: {
        backendUrl: 'https://thankyouforyourpatience-be-net.onrender.com',
        increment: 1,
        apiIntervalMillis: () => Math.floor(Math.random() * (7000 - 5000 + 1)) + 5000,
        updateProgressIntervalMillis: () => Math.floor(Math.random() * (800 - 400 + 1)) + 400,
        debug: false
    }
};

const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.protocol === 'file:' ||
                     window.location.protocol === '';

const environment = isDevelopment && false ? 'development' : 'production';

window.APP_CONFIG = config[environment]; 