#!/usr/bin/env node

'use strict'

const program = require('commander')
const { version, scripts } = require('../package.json')

const config = require('../config')

program
  .helpOption('-h, --help', '查看帮助信息')
  .version(version, '-v, --version')
  .usage('[options]')
  .option('-b, --build', '构建离线文档')
  // .option('-t, --target', '离线文档存储目录')
  .option('-p, --proxy [url]', 'echarts-doc 文档仓库代理镜像地址')
  .option('-c, --cnpm', '使用 `cnpm` 安装依赖')
  .option('-s, --serve', '开启一个 HTTP Server 查看离线文档')
  .option('-l, --local', '本地查看离线文档')
  .option('--verbose', '输出调试日志')
  .parse(process.argv)

const options = program.opts()

if (options.build) {
  if (options.proxy) {
    config.DOC_REPO = options.proxy
  }

  config.USE_CNPM = options.cnpm

  // TODO
  // if (options.target) {}

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


