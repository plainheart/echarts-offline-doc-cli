#!/usr/bin/env node

'use strict'

const program = require('commander')
const { version, scripts } = require('../package.json')

const config = require('../config')

program
  .version(version, '-v, --version')
  .usage('[options]')
  .option('-b, --build', 'build/rebuild the offline documentation')
  .option('-p, --proxy [url]', 'URL of the proxy repo to be used when building the offline documentation')
  .option('-c, --cnpm', 'whether to use `cnpm` to install dependencies when building the offline documentation')
  .option('-s, --serve', 'start an HTTP server and open the default browser to view the documentation')
  .option('-l, --local', 'open the static pages locally without a server')
  .parse(process.argv)

const options = program.opts()

if (options.build) {
  if (options.proxy) {
    config.DOC_REPO = options.proxy
  }

  config.USE_CNPM = options.cnpm

  require('..')()
}
else {
  require('cross-spawn')
    .spawn(scripts[options.local ? 'local' : 'serve'], {
      cwd: require('node:path').resolve(__dirname, '../'),
      stdio: 'inherit',
      windowsHide: true,
      detached: false
    })
}


