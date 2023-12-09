const path = require('node:path')
const crypto = require('node:crypto')
const fs = require('fs-extra')
const download = require('download')
const globby = require('globby')

const md5 = str => crypto.createHash('md5').update(str).digest('hex')

const {
  PATH_REPO_DOC_ASSETS,
  PATH_REPO_DOC_PUBLIC,
  PATH_REPO_DOC_SRC,
  URL_ECHARTS_LOGO,
  URL_ECHARTS_FAVICON
} = require('../config')

function addProtocol(url) {
  if (url.startsWith('//')) {
    url = 'https:' + url
  }
  return url
}

async function findDownloadList() {
  const globbyOptions = {
    cwd: PATH_REPO_DOC_PUBLIC,
    ignore: '**/documents/**',
    onlyFiles: true,
    absolute: true
  }

  const htmlPages = await globby('**/*.html', globbyOptions)

  const downloadSet = new Set()
  const reg = /['"]{1}((?:https?:)?\/\/.*\.(?:css|js))['"]{1}/g

  for (const html of htmlPages) {
    const content = fs.readFileSync(html, 'utf-8')
    const matches = content.matchAll(reg)
    for (const match of matches) {
      downloadSet.add(match[1])
    }
  }

  const files = await globby('**/*.{js,vue}', {
    ...globbyOptions,
    cwd: PATH_REPO_DOC_SRC
  })
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8')
    const matches = content.matchAll(reg)
    for (const match of matches) {
      downloadSet.add(match[1])
    }
    // TODO url in local CSS files
  }

  return Array.from(downloadSet)
    // PENDING
    .filter(url => !url.includes('.jsdelivr.net'))
}

async function downloadAll() {
  const downloadList = await findDownloadList()

  downloadList.push(
    URL_ECHARTS_LOGO,
    URL_ECHARTS_FAVICON
  )

  const fileMappings = {}

  const REG_URL_CSS = /url\s*\(['"]?((?:https?:\/\/)?[^'"]+)['"]?\)/g

  async function makeDownloadPromise(resourceUrl) {
    const idx = resourceUrl.lastIndexOf('.')
    const queryMarkIdx = resourceUrl.lastIndexOf('?')
    const ext = resourceUrl.slice(idx, queryMarkIdx === -1 ? void 0 : queryMarkIdx)
    const filename = md5(resourceUrl) + ext
    const downloadUrl = addProtocol(resourceUrl)

    await download(downloadUrl, PATH_REPO_DOC_ASSETS, { filename })

    const localPath = path.resolve(PATH_REPO_DOC_ASSETS, filename)

    // PENDING
    if (ext.endsWith('css')) {
      let cssContent = fs.readFileSync(localPath, 'utf8')
      const root = downloadUrl.slice(0, downloadUrl.lastIndexOf('/') + 1)
      const matches = cssContent.matchAll(REG_URL_CSS)
      for (const match of matches) {
        let t = match[1]
        if (t.startsWith('data:')) {
          continue
        }

        const idx = t.lastIndexOf('.')
        const queryMarkIdx = t.lastIndexOf('?')
        const ext = t.slice(idx, queryMarkIdx === -1 ? void 0 : queryMarkIdx)
        const filename = md5(t) + ext
        if (!t.startsWith('http')) {
          t = root + t
        }
        fs.writeFileSync(
          path.resolve(PATH_REPO_DOC_ASSETS, filename),
          await download(t)
        )
        cssContent = cssContent.replace(match[1], filename)
        fs.writeFileSync(localPath, cssContent, 'utf8')
      }
    }

    fileMappings[resourceUrl] = {
      localPath,
      downloadUrl,
      filename
    }
  }

  await Promise.all(
    downloadList.map(downloadItem => makeDownloadPromise(downloadItem))
  )

  return fileMappings
}

module.exports = downloadAll
