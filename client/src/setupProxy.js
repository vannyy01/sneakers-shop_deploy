const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api/*',
        createProxyMiddleware('/api/*', {
            changeOrigin: true,
            target: 'http://localhost:5000',
        })
    );
    app.use(
        '/auth/google',
        createProxyMiddleware( {
            target: 'http://localhost:5000',
        })
    );
};