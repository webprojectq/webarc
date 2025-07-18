const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://backend:8000',
      changeOrigin: true,
    })
  );
  
  app.use(
    '/admin',
    createProxyMiddleware({
      target: 'http://backend:8000',
      changeOrigin: true,
    })
  );
};