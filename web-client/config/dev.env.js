var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    // API_ROOT: '"http://dream.iborge.cn"'
    API_ROOT: '"http://127.0.0.1:3000"'

})