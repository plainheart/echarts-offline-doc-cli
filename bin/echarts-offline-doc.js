#!/usr/bin/env node

const program = require('commander')
const { version } = require('../package.json')

const config = require('../config')

program
  .version(version, '-v, --version')
  .usage('[options]')
  .option('-p, --proxy [url]', 'URL of the proxy repo')
  .option('-c, --cnpm', 'Whether to use `cnpm` to install dependencies')
  .parse(process.argv)

const options = program.opts()

if (options.proxy) {
  config.DOC_REPO = options.proxy
}

config.USE_CNPM = options.cnpm

require('..')()
