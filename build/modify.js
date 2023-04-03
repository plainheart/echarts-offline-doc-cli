const path = require('node:path')
const fs = require('node:fs')
const globby = require('globby')

const {
  PATH_REPO_DOC_ASSETS,
  PATH_REPO_DOC_PUBLIC,
  PATH_REPO_DOC_SRC,
  PATH_REPO_DOC
} = require('../config')

const rootSplit = PATH_REPO_DOC.split(path.sep)
const rootLevel = rootSplit[rootSplit.length - 1]

const publicRootSplit = PATH_REPO_DOC_PUBLIC.split(path.sep)
const publicRootLevel = publicRootSplit[publicRootSplit.length - 1]

const assetsRootSplit = PATH_REPO_DOC_ASSETS.split(path.sep)
const assetsRootLevel = assetsRootSplit[assetsRootSplit.length - 1]

const srcRootSplit = PATH_REPO_DOC_SRC.split(path.sep)
const srcRootLevel = srcRootSplit[srcRootSplit.length - 1]

function getRelativePath(assetPath, isConfig) {
  const assetsPathSplit = path.resolve(assetPath).split(path.sep)

  let relativePath = ''
  let tmp = assetsPathSplit.pop()
  if (tmp === publicRootLevel) {
    relativePath = './'
  } else if (tmp === rootLevel) {
    relativePath = './' + publicRootLevel + '/'
  } else if (tmp === srcRootLevel) {
    relativePath = '../' + publicRootLevel + '/'
  }
  else {
    while (tmp && tmp !== rootLevel && tmp !== publicRootLevel && tmp !== srcRootLevel) {
      tmp = assetsPathSplit.pop()
      relativePath += '../'
    }
    relativePath += publicRootLevel + '/'
  }

  return relativePath + assetsRootLevel + '/'
}

/**
 * modify assets path
 */
async function modify(assetsMapping) {
  // get all pages to be modified
  const pages = await globby(['**/*.html'], {
    cwd: PATH_REPO_DOC_PUBLIC,
    onlyFiles: true,
    absolute: true
  })

  const mappings = Object.keys(assetsMapping)

  pages.forEach(page => {
    let content = fs.readFileSync(page, { encoding: 'utf8' })
    mappings.forEach(mapping => {
      const relativePath = getRelativePath(page, false) + assetsMapping[mapping].filename
      content = content.replace(mapping, relativePath)
    })
    fs.writeFileSync(page, content, { encoding: 'utf8' })
  })

  const configPath = path.resolve(PATH_REPO_DOC_SRC, './config.js')
  const pathRoot = '/' + publicRootLevel + '/' + assetsRootLevel + '/'
  let configJS = fs.readFileSync(configPath, { encoding: 'utf8' })

  mappings.forEach(mapping => {
    configJS = configJS.replace(mapping, pathRoot + assetsMapping[mapping].filename)
  })

  fs.writeFileSync(configPath, configJS, { encoding: 'utf8' })

}

module.exports = modify
