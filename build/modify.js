const path = require('node:path')
const fs = require('node:fs')
const globby = require('globby')

const {
  PATH_REPO_DOC_ASSETS,
  PATH_REPO_DOC_PUBLIC,
  PATH_REPO_DOC_SRC,
  PATH_REPO_DOC_BUILD_ENTRY,
  URL_ECHARTS_FAVICON
} = require('../config')

function getRelativePath(assetPath) {
  return path.relative(assetPath, PATH_REPO_DOC_ASSETS).replace(/\\/g, '/')
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

  // rewrite the URLs in html pages
  pages.forEach(page => {
    const relativePathRoot = getRelativePath(path.dirname(page)) + '/'
    let content = fs.readFileSync(page, { encoding: 'utf8' })
    mappings.forEach(mapping => {
      const relativePath = relativePathRoot + assetsMapping[mapping].filename
      content = content.replace(mapping, relativePath)
    })
    const faviconPath = relativePathRoot + assetsMapping[URL_ECHARTS_FAVICON].filename
    content = content.replace('<head>', `<head>\n<link rel="shortcut icon" href="${faviconPath}" type="image/png">`)
    fs.writeFileSync(page, content, { encoding: 'utf8' })
  })

  // rewrite the URLs in config.js
  const relativePathRoot = getRelativePath(require(PATH_REPO_DOC_BUILD_ENTRY).output.path) + '/'
  const configPath = path.resolve(PATH_REPO_DOC_SRC, './config.js')
  let configJS = fs.readFileSync(configPath, { encoding: 'utf8' })
  mappings.forEach(mapping => {
    const relativePath = relativePathRoot + assetsMapping[mapping].filename
    configJS = configJS.replace(mapping, relativePath)
  })

  fs.writeFileSync(configPath, configJS, { encoding: 'utf8' })
}

module.exports = modify
