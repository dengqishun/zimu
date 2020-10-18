module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    proxyTable: {
        '/api': {
          target: 'http://localhost:28673',
          debugger: true,
          pathRewrite: {
            '^/api': '/'
          }
        }
      },
    // 添加下面这行代码: 表示在开发环境下请求的服务器端接口  http://localhost:28673/getMovies/5/10
    API_ROOT: ' "http://localhost:28673/" '   
  })