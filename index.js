const path = require('node:path')
const spawn = require('cross-spawn')
const fs = require('fs-extra')
const chalk = require('chalk')
const globby = require('globby')
const Spinnies = require('spinnies')

const {
  PATH_DIST,
  PATH_TMP,
  PATH_REPO_DOC,
  PATH_REPO_DOC_CONFIG,
  PATH_REPO_DOC_PUBLIC,
  DOC_REPO, USE_CNPM
} = require('./config')

const spinners = new Spinnies({
  succeedPrefix : '✔️',
  failPrefix: '❌'
})

const SPINNER_MAIN = 'spinner-main'

/**
 * @param {string} command
 * @param {string[]} args
 * @param {string} cwd
 * @param {string} processName
 * @returns {Promise<void>}
 */
function createSpawn(command, args, cwd, processName) {
  return new Promise((resolve, reject) => {
    spawn(
      command, args,
      {
        cwd,
        stdio: 'ignore',
        windowsHide: true,
        detached: false
      }
    )
    .on('error', reject)
    .on('close', (code) => {
      code
        ? reject(`failed to ${processName} with code: ${code}`)
        : resolve()
    })
  })
}

async function checkoutDocRepo() {
  spinners.add(SPINNER_MAIN, {
    color: 'yellow',
    text: 'Checking out doc repo from ' + DOC_REPO + '...'
  })

  const cwd = PATH_REPO_DOC
  const processName = 'check out doc repo'

  try {
    await fs.ensureDir(cwd)

    await createSpawn('git', ['init'], cwd, processName)

    await createSpawn(
      'git', ['remote', 'add', 'origin', DOC_REPO],
      cwd,
      processName
    )

    await createSpawn(
      'git', ['config', 'core.sparseCheckout', 'true'],
      cwd,
      processName
    )

    const checkoutList = [
      '/zh/',
      '/src/',
      '/public/lib/',
      '/public/zh/',
      '/config/',
      '/dep/',
      '/build/',
      '/tool/',
      // FIXME has unused large files
      '/asset/',
      '/package.json',
      '/package-lock.json',
      '/build.js'
    ]

    await fs.writeFile(
      path.resolve(cwd, '.git/info/sparse-checkout'),
      checkoutList.join('\n'),
      'utf-8'
    )

    await createSpawn(
      'git', ['fetch', '--depth=1', '--filter', 'blob:none'],
      cwd,
      processName
    )

    await createSpawn(
      'git', ['pull', '--depth=1', 'origin', 'master'],
      cwd,
      processName
    )

    spinners.succeed(SPINNER_MAIN, {
      text: 'Check out doc repo, done.'
    })
    console.log()
  }
  catch (e) {
    spinners.fail(SPINNER_MAIN, {
      color: 'red'
    })

    // TODO wrap error
    throw e
  }
}

async function install() {
  spinners.add(SPINNER_MAIN, {
    color: 'yellow',
    text: 'Installing dependencies...'
  })

  const processName = 'install dependencies'

  try {
    await createSpawn(
      USE_CNPM ? 'cnpm' : 'npm', ['ci'],
      PATH_REPO_DOC,
      processName
    )

    spinners.succeed(SPINNER_MAIN, {
      text: 'Install dependencies, done.'
    })
    console.log()
  }
  catch (e) {
    spinners.fail(SPINNER_MAIN, {
      color: 'red'
    })

    // TODO wrap error
    throw e
  }
}

async function build() {
  spinners.add(SPINNER_MAIN, {
    color: 'yellow',
    text: 'Building...'
  })

  await fs.remove(PATH_DIST)

  const configFileName = 'env.local.js'
  // copy config
  await fs.copy(
    path.resolve(__dirname, `./config/${configFileName}`),
    path.resolve(PATH_REPO_DOC_CONFIG, configFileName)
  )

  if (!process.env.GITHUB_ACTIONS) {
    // FIXME echarts-doc has compatibility issues with node >= 16
    if (+process.version.slice(1).split('.')[0] > 16) {
      process.env.NODE_OPTIONS = '--openssl-legacy-provider'
    }
  }

  const processName = 'build'

  try {
    await createSpawn(
      'npm', ['run', 'build:site'],
      PATH_REPO_DOC,
      processName
    )

    await createSpawn(
      'node', ['build.js', '--env', 'local'],
      PATH_REPO_DOC,
      processName
    )

    const publicDist = path.resolve(PATH_DIST, './public')
    await Promise.all([
      // copy to dist
      fs.copy(PATH_REPO_DOC_PUBLIC, publicDist),
      // copy index redirect
      fs.copy(
        path.resolve(__dirname, 'config/index-redirect.html'),
        path.resolve(PATH_DIST, 'index.html')
      )
    ])

    const options = {
      cwd: publicDist,
      absolute: true,
      onlyFiles: true
    }

    const deleteFiles = await globby(['**/*-content.html'], options)
    deleteFiles.forEach(file => fs.removeSync(file))

    const viewOnlineJS = require('./config/view-online')
    const htmls = await globby(['**/*.html'], options)
    htmls.forEach(html => {
      let content = fs.readFileSync(html, 'utf8')
      content = content
        // hide lang switcher
        .replace('<head>', `<head><style>#header .lang{display:none!important}</style>`)
        // inject view online button
        .replace('<\/body>', viewOnlineJS() + '</body>')
      fs.writeFileSync(html, content, 'utf8')
    })

    spinners.succeed(SPINNER_MAIN, {
      text: 'Build, done.'
    })
    console.log()
  }
  catch (e) {
    spinners.fail(SPINNER_MAIN, {
      color: 'red'
    })
    throw e
  }
}

/**
 * clean up temporary files
 */
async function cleanup(suppressError) {
  spinners.add(SPINNER_MAIN, {
    color: 'yellow',
    text: 'Cleaning up temp files...'
  })

  try {
    // remove tmp files
    await fs.remove(PATH_TMP)

    spinners.succeed(SPINNER_MAIN, {
      text: 'Clean up temp files, done.'
    })
    console.log()
  } catch (e) {
    spinners.fail(SPINNER_MAIN, {
      color: 'red'
    })

    if (!suppressError) {
      throw e
    }
  }
}

process.on('uncaughtException', e => {
  console.error(chalk.red('An uncaught error occurred'))
  console.error(chalk.red(e))
  process.exit(-2)
})

module.exports = async function run() {
  try {
    // cleanup first
    await cleanup()

    // checkout doc repo
    await checkoutDocRepo()

    // install necessary dependencies
    await install()

    // download
    const download = require('./build/download')
    const fileMappings = await download()

    // do some modifications
    const modify = require('./build/modify')
    await modify(fileMappings)

    // build
    await build()
  } catch (e) {
    console.error(chalk.red(e))
  } finally {
    await cleanup(true)
  }
}
