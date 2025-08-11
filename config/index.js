const path = require('node:path')
const os = require('node:os')

const DOC_REPO = 'https://github.com/apache/echarts-doc'

const PATH_DIST = path.resolve(__dirname, '../dist')
const PATH_TMP = path.resolve(os.tmpdir(), 'echarts-offline-doc-tmp')
const PATH_REPOS = path.resolve(PATH_TMP, './repos')
const PATH_REPO_DOC = path.resolve(PATH_REPOS, './echarts-doc')
const PATH_REPO_DOC_CONFIG = path.resolve(PATH_REPO_DOC, './config')
const PATH_REPO_DOC_SRC = path.resolve(PATH_REPO_DOC, './src')
const PATH_REPO_DOC_PUBLIC = path.resolve(PATH_REPO_DOC, './public')
const PATH_REPO_DOC_ASSETS = path.resolve(PATH_REPO_DOC_PUBLIC, './assets')
const PATH_REPO_DOC_BUILD = path.resolve(PATH_REPO_DOC, './build')
const PATH_REPO_DOC_BUILD_ENTRY = path.resolve(PATH_REPO_DOC_BUILD, './webpack.config.js')

const URL_ECHARTS_LOGO = 'https://echarts.apache.org/zh/images/logo.png'
const URL_ECHARTS_FAVICON = 'https://echarts.apache.org/zh/images/favicon.png'

module.exports = {
  DOC_REPO,
  USE_CNPM: false,

  PATH_DIST,
  PATH_TMP,
  PATH_REPOS,
  PATH_REPO_DOC,
  PATH_REPO_DOC_CONFIG,
  PATH_REPO_DOC_SRC,
  PATH_REPO_DOC_PUBLIC,
  PATH_REPO_DOC_ASSETS,
  PATH_REPO_DOC_BUILD,
  PATH_REPO_DOC_BUILD_ENTRY,

  URL_ECHARTS_LOGO,
  URL_ECHARTS_FAVICON
}
