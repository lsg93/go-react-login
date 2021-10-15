const createProxyMiddleware = require('http-proxy-middleware');
module.exports = (app) => {
    app.use(
        createProxyMiddleware('/api', {
            target: 'http://[::1]:8000/',
            secure: false,
            changeOrigin: true,
            headers: {
                "Connection": "keep-alive"
            },
        }),
    );
};