
const config = {
    development: {
        backendUrl: 'http://localhost:3000',
        increment: 1
    },
    production: {
        backendUrl: 'https://thankyouforyourpatience.onrender.com',
        increment: .1
    }
};

const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const environment = isDevelopment ? 'development' : 'production';

window.APP_CONFIG = config[environment]; 