const path = require('node:path')

const DOC_REPO = 'https://github.com/apache/echarts-doc.git'
const DOC_REPO_MIRROR = 'https://hub.fgit.gq/apache/echarts-doc.git'
const DOC_REPO_BRANCH = 'master'

const PATH_DIST = path.resolve(__dirname, '../dist')
const PATH_TMP = path.resolve(__dirname, '../node_modules/.cache/echarts-doc-tmp')
const PATH_REPOS = path.resolve(PATH_TMP, './repos')
const PATH_REPOS_DIST = path.resolve(PATH_REPOS, './dist')
const PATH_REPO_DOC = path.resolve(PATH_REPOS, './echarts-doc')
const PATH_REPO_DOC_CONFIG = path.resolve(PATH_REPO_DOC, './config')
const PATH_REPO_DOC_SRC = path.resolve(PATH_REPO_DOC, './src')
const PATH_REPO_DOC_PUBLIC = path.resolve(PATH_REPO_DOC, './public')
const PATH_REPO_DOC_ASSETS = path.resolve(PATH_REPO_DOC_PUBLIC, './assets')
const PATH_REPO_EXAMPLE = path.resolve(PATH_REPOS, './echarts-examples')

const SPINNER_MAIN = 'spinner-main'
const SPINNER_CHILD = 'spinner-child'

const REG_URL_CSS = /url\s*\((\s*[A-Za-z0-9\-\_\.\/\:]+\s*)\)\s*;?/gi

module.exports = {
  DOC_REPO,
  DOC_REPO_MIRROR,
  DOC_REPO_BRANCH,
  USE_CNPM: false,

  PATH_DIST,
  PATH_TMP,
  PATH_REPOS,
  PATH_REPOS_DIST,
  PATH_REPO_DOC,
  PATH_REPO_DOC_CONFIG,
  PATH_REPO_DOC_SRC,
  PATH_REPO_DOC_PUBLIC,
  PATH_REPO_DOC_ASSETS,
  PATH_REPO_EXAMPLE,

  SPINNER_MAIN,
  SPINNER_CHILD,

  REG_URL_CSS
}
