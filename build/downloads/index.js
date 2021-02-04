const fs = require('fs-extra')
const path = require('path')
const download = require('download')
const globby = require('globby')
const md5 = require('blueimp-md5')

const {
  PATH_REPO_DOC_ASSETS,
  PATH_REPO_DOC_PUBLIC,
  PATH_REPO_DOC_SRC,
  REG_URL_CSS
} = require('../../config')

function addProtocol(url) {
  if (url.startsWith('//')) {
    url = 'https:' + url
  }
  return url
}

async function findDownloadList() {
  const htmlPages = await globby(['**/*.html'], {
    cwd: PATH_REPO_DOC_PUBLIC,
    onlyFiles: true,
    absolute: true
  })

  const downloadMap = new Set()
  const reg = /(https?:)?\/\/.*\.(css|js)/g
  htmlPages.forEach(page => {
    const html = fs.readFileSync(page, {
      encoding: 'utf8'
    })
    const matches = html.matchAll(reg)
    for (const match of matches) {
      downloadMap.add(match[0])
    }
  })

  const configJS = fs.readFileSync(
    path.resolve(PATH_REPO_DOC_SRC, './config.js'),
    { encoding: 'utf8' }
  )
  const matches = configJS.matchAll(reg)
  for (const match of matches) {
    downloadMap.add(match[0])
  }

  return Array.from(downloadMap)
}

async function downloadAll() {
  const downloadList = await findDownloadList()

  const fileMappings = {}

  async function makeDownloadPromise(resourceUrl) {
    let idx = resourceUrl.lastIndexOf('.')
    let queryMarkIdx = resourceUrl.lastIndexOf('?')
    let ext = resourceUrl.slice(idx, queryMarkIdx === -1 ? void 0 : queryMarkIdx)
    let filename = md5(resourceUrl) + ext
    const downloadUrl = addProtocol(resourceUrl)

    await download(downloadUrl, PATH_REPO_DOC_ASSETS, { filename })

    const localPath = path.resolve(PATH_REPO_DOC_ASSETS, filename)

    // PENDING
    if (ext.endsWith('css')) {
      let cssContent = fs.readFileSync(localPath, { encoding: 'utf8' })
      const root = downloadUrl.slice(0, downloadUrl.lastIndexOf('/') + 1)
      const matches = cssContent.matchAll(REG_URL_CSS)
      for (const match of matches) {
        let t = match[1]
        let idx = t.lastIndexOf('.')
        let queryMarkIdx = t.lastIndexOf('?')
        let ext = t.slice(idx, queryMarkIdx === -1 ? void 0 : queryMarkIdx)
        let filename = md5(t) + ext
        if (!t.startsWith('http')) {
          t = root + t
        }
        fs.writeFileSync(
          path.resolve(PATH_REPO_DOC_ASSETS, filename),
          await download(t)
        )
        cssContent = cssContent.replace(match[1], filename)
        fs.writeFileSync(localPath, cssContent, { encoding: 'utf8' })
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

  console.log(fileMappings)

  return fileMappings
}

module.exports = downloadAll
