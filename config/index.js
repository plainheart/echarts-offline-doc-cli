const path = require('node:path')
const os = require('node:os')

const DOC_REPO = 'https://github.com/apache/echarts-doc'

const PATH_DIST = path.resolve(__dirname, '../dist')
const PATH_TMP = path.resolve(os.tmpdir(), 'echarts-offline-doc-tmp')
const PATH_REPOS = path.resolve(PATH_TMP, './repos')
const PATH_REPOS_DIST = path.resolve(PATH_REPOS, './dist')
const PATH_REPO_DOC = path.resolve(PATH_REPOS, './echarts-doc')
const PATH_REPO_DOC_CONFIG = path.resolve(PATH_REPO_DOC, './config')
const PATH_REPO_DOC_SRC = path.resolve(PATH_REPO_DOC, './src')
const PATH_REPO_DOC_PUBLIC = path.resolve(PATH_REPO_DOC, './public')
const PATH_REPO_DOC_ASSETS = path.resolve(PATH_REPO_DOC_PUBLIC, './assets')

module.exports = {
  DOC_REPO,
  USE_CNPM: false,

  PATH_DIST,
  PATH_TMP,
  PATH_REPOS,
  PATH_REPOS_DIST,
  PATH_REPO_DOC,
  PATH_REPO_DOC_CONFIG,
  PATH_REPO_DOC_SRC,
  PATH_REPO_DOC_PUBLIC,
  PATH_REPO_DOC_ASSETS
}
