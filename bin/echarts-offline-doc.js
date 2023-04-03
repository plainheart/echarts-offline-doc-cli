#!/usr/bin/env node

const program = require('commander')
const { version } = require('../package.json')

const config = require('../config')

program
  .version(version, '-v, --version')
  .usage('[options]')
  .option('-p, --proxy [url]', 'URL of the proxy repo. Default proxy: ' + config.DOC_REPO_MIRROR)
  .option('-c, --cnpm', 'Whether to use cnpm to install dependencies')
  .parse(process.argv)

const options = program.opts()

if (options.proxy) {
  config.DOC_REPO = typeof options.proxy === 'string'
    ? options.proxy
    : config.DOC_REPO_MIRROR
}

config.USE_CNPM = options.cnpm

require('..')()
