const processEnv = require('./env.js')
module.exports = {
    proxy: {
        '/api': {
            //将www.exaple.com印射为/apis
            target: `http://${JSON.parse(processEnv.BASE_IP)}`, // 服务器服务
            secure: false, // 如果是https接口，需要配置这个参数
            changeOrigin: true
        }
    }
}
