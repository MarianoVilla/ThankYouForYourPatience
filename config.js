
const config = {
    development: {
        backendUrl: 'http://localhost:3000',
        increment: 1,
        apiIntervalMillis: 500
    },
    production: {
        backendUrl: 'https://thankyouforyourpatience.onrender.com',
        increment: 0.5,
        apiIntervalMillis: 1000
    }
};

const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.protocol === 'file:';

const environment = isDevelopment ? 'development' : 'production';

window.APP_CONFIG = config[environment]; 