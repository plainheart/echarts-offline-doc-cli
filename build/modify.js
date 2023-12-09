const path = require('node:path')
const fs = require('node:fs')
const globby = require('globby')

const {
  PATH_REPO_DOC_ASSETS,
  PATH_REPO_DOC_PUBLIC,
  PATH_REPO_DOC_SRC,
  PATH_REPO_DOC_BUILD_ENTRY,
  URL_ECHARTS_FAVICON,
  PATH_REPO_DOC
} = require('../config')

function getRelativePath(assetPath) {
  return path.relative(assetPath, PATH_REPO_DOC_ASSETS).replace(/\\/g, '/')
}

/**
 * modify assets path
 */
async function modify(assetsMapping) {
  const mappings = Object.keys(assetsMapping)

  const pages = await globby(['**/*.html'], {
    cwd: PATH_REPO_DOC_PUBLIC,
    ignore: '**/documents/**',
    onlyFiles: true,
    absolute: true
  })

  // rewrite the URLs in html pages
  pages.forEach(page => {
    const relativePathRoot = getRelativePath(path.dirname(page)) + '/'
    let content = fs.readFileSync(page, 'utf8')
    mappings.forEach(mapping => {
      const relativePath = relativePathRoot + assetsMapping[mapping].filename
      content = content.replace(mapping, relativePath)
    })
    const faviconPath = relativePathRoot + assetsMapping[URL_ECHARTS_FAVICON].filename
    content = content.replace('<head>', `<head>\n<link rel="shortcut icon" href="${faviconPath}" type="image/png">`)
    fs.writeFileSync(page, content, 'utf8')
  })

  // rewrite the URLs in source files
  const relativePathRoot = getRelativePath(require(PATH_REPO_DOC_BUILD_ENTRY).output.path) + '/'
  const files = await globby('**/*.{js,vue}', {
    cwd: PATH_REPO_DOC_SRC,
    ignore: '**/documents/**',
    onlyFiles: true,
    absolute: true,
  })
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8')
    mappings.forEach(mapping => {
      const relativePath = relativePathRoot + assetsMapping[mapping].filename
      content = content.replace(mapping, relativePath)
    })
    fs.writeFileSync(file, content, 'utf8')
  }

  const buildScriptPath = path.resolve(PATH_REPO_DOC, 'build.js')
  const buildScriptContent = fs.readFileSync(buildScriptPath, 'utf8')
  fs.writeFileSync(
    buildScriptPath,
    buildScriptContent.replace(`languages = ['zh', 'en']`, `languages = ['zh']`),
    'utf8'
  )
}

module.exports = modify
