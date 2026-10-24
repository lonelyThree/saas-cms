'use strict'

let buildType = process.argv.slice(2)[0] || 'prod'
buildType = buildType == '--inline' ? 'dev' : buildType ;

console.log('----------------building '+buildType+ ' 环境 ------------------' )

module.exports = {
  NODE_ENV: '"production"',
  MIAO_ENV: '"' + buildType + '"'
}
