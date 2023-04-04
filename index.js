const path = require('node:path')
const spawn = require('cross-spawn')
const fs = require('fs-extra')
const chalk = require('chalk')
const globby = require('globby')
const Spinnies = require('spinnies')

const {
  PATH_DIST, PATH_TMP, PATH_REPO_DOC, PATH_REPO_DOC_CONFIG, PATH_REPO_DOC_PUBLIC,
  DOC_REPO, USE_CNPM
} = require('./config')

// the process to clone doc repo
let cloneProcess
// the process to install dependencies
let installProcess
// the process to build site
let buildSiteProcess
// the process to build doc
let buildProcess

// spinners
const spinners = new Spinnies({
  succeedPrefix : '✔️',
  failPrefix: '❌'
})

const SPINNER_MAIN = 'spinner-main'
const SPINNER_CHILD = 'spinner-child'

/**
 * To clone the documentation repository
 */
async function cloneDocRepo() {
  spinners.add(SPINNER_MAIN, { color: 'yellow' })
  spinners.add(SPINNER_CHILD, { color: 'white' })

  spinners.update(SPINNER_MAIN, {
    text: 'Cloning doc repo from ' + DOC_REPO + '...'
  })

  const clonePromise = new Promise((resolve, reject) => {
    cloneProcess = spawn(
      'git',
      ['clone', '--depth', 1, '--progress', DOC_REPO, '-b', 'master', PATH_REPO_DOC],
      {
        windowsHide: true,
        detached: false
      }
    )

    cloneProcess.stderr.on('data', data => {
      data = String(data)
      if (data.startsWith('fatal: ')) {
        reject(data)
      } else {
        spinners.update(SPINNER_CHILD, {
          text: data
        })
      }
    })

    cloneProcess.on('close', (code) => {
      code
        ? reject('failed to clone doc repo with code ' + code)
        : resolve()
    })

    cloneProcess.on('error', reject)
  })

  try {
    await clonePromise

    spinners.update(SPINNER_CHILD, {
      text: '',
      status: 'stopped'
    })

    // remove .git
    fs.removeSync(path.resolve(PATH_REPO_DOC, '.git'))

    spinners.succeed(SPINNER_MAIN, {
      text: 'Clone doc repo, done.'
    })
  }
  catch (e) {
    spinners.fail(SPINNER_MAIN, {
      color: 'red'
    })

    throw e
  }
}

async function install() {
  spinners.add(SPINNER_MAIN, {
    color: 'yellow',
    text: 'Installing dependencies...'
  })

  const installPromise = new Promise((resolve, reject) => {
    installProcess = spawn(
      USE_CNPM ? 'cnpm' : 'npm', ['ci'],
      {
        cwd: PATH_REPO_DOC,
        stdio: 'ignore',
        windowsHide: true,
        detached: false
      }
    )

    installProcess.on('close', (code) => {
      code
        ? reject('failed to install dependencies with code ' + code)
        : resolve()
    })

    installProcess.on('error', reject)
  })

  try {
    await installPromise

    spinners.succeed(SPINNER_MAIN, {
      text: 'Install dependencies, done.'
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
    if (parseInt(process.version.split('.')[0]) > 16) {
      process.env.NODE_OPTIONS = '--openssl-legacy-provider'
    }
  }

  const buildPromise = new Promise((resolve, reject) => {
    buildSiteProcess = spawn(
      'npm', ['run', 'build:site'],
      {
        cwd: PATH_REPO_DOC,
        stdio: 'ignore',
        windowsHide: true,
        detached: false
      }
    )

    buildSiteProcess.on('close', (code) => {
      if (code === 0) {
        buildProcess = spawn(
          'node', ['build.js', '--env', 'local'],
          {
            cwd: PATH_REPO_DOC,
            stdio: 'ignore',
            windowsHide: true,
            detached: false
          }
        )
        buildProcess.on('close', (code) => {
          code
            ? reject('failed to build with code ' + code)
            : resolve()
        })

        buildProcess.on('error', reject)
      }
      else {
        reject('failed to build with code ' + code)
      }
    })

    buildSiteProcess.on('error', reject)
  })

  try {
    await buildPromise

    const publicDist = path.resolve(PATH_DIST, './public')
    // copy to dist
    fs.copySync(PATH_REPO_DOC_PUBLIC, publicDist)
    // copy index redirect
    fs.copySync(
      path.resolve(__dirname, 'config/index-redirect.html'),
      path.resolve(PATH_DIST, 'index.html')
    )

    const options = {
      cwd: publicDist,
      absolute: true,
      onlyFiles: true
    }

    const deleteFiles = await globby(['**/*-content.html'], options)
    deleteFiles.forEach(file => fs.removeSync(file))

    const viewOnlineJS = require('./config/view-online')
    // inject view-online script
    const htmls = await globby(['**/*.html'], options)
    htmls.forEach(html => {
      let content = fs.readFileSync(html, { encoding: 'utf8' })
      content = content.replace('<\/body>', viewOnlineJS(html.indexOf('/zh/') !== -1 ? 'zh' : 'en') + '</body>')
      fs.writeFileSync(html, content, { encoding: 'utf8' })
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
function cleanup() {
  try {
    // remove tmp files
    fs.removeSync(PATH_TMP)
  } catch (e) {
    console.error(chalk.red('failed to clean up'), e)
    throw e
  }
}

process.on('beforeExit', code => {
  cleanup()
  process.exit(code)
})

process.on('uncaughtException', e => {
  console.error(chalk.red('An uncaught error occurred'))
  console.error(chalk.red(e))
  process.exit(-2)
})

module.exports = async function run() {
  try {
    // cleanup first
    cleanup()

    // clone doc repo
    await cloneDocRepo()

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
    process.exit(-1)
  }
}
