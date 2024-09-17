// client/src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use((req, res, next) => {
      console.log(`${req.method} request for ${req.url}`);
      next();
  });
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://www.maskawasub.com/api/data',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Remove /api from the beginning of the path
      },
    })
  );
};