module.exports = {
    proxy: {
        '/api': {
            target: 'https://api.yctang.net/', //接口域名
            secure: false,
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/api',
            },
        },
    },
}
