# echarts-offline-doc-cli
[![NPM version](https://img.shields.io/npm/v/echarts-offline-doc-cli.svg?style=flat)](https://www.npmjs.org/package/echarts-offline-doc-cli)
[![Auto Deploy](https://github.com/plainheart/echarts-offline-doc-cli/actions/workflows/deploy.yaml/badge.svg)](https://github.com/plainheart/echarts-offline-doc-cli/actions/workflows/deploy.yaml)
[![NPM Downloads](https://img.shields.io/npm/dm/echarts-offline-doc-cli.svg)](https://npmcharts.com/compare/echarts-offline-doc-cli?minimal=true)
[![License](https://img.shields.io/npm/l/echarts-offline-doc-cli.svg)](https://github.com/plainheart/echarts-offline-doc-cli/blob/main/LICENSE)

A CLI tool for offline documentation of Apache ECharts.

[Preview on GitHub Pages](https://plainheart.github.io/echarts-offline-doc-cli)

![Screenshot](https://user-images.githubusercontent.com/26999792/229869304-4a782121-4324-4e68-9f3d-a956d0c60ee6.png)

# Get Started

## Install Globally

```sh
npm i echarts-offline-doc-cli -g
```

### Build Offline Documentation

```sh
echarts-offline-doc --build
# Equivalent to:
echarts-offline-doc -b

# If it's slow to clone the echarts-doc repo
# you can specify a proxy URL
echarts-offline-doc --build --proxy https://hub.fgit.cf/apache/echarts-doc
# Equivalent to:
echarts-offline-doc -b -p https://hub.fgit.cf/apache/echarts-doc

# If it's slow to install dependencies
# you can optionally use `cnpm`
echarts-offline-doc --build --cnpm
# Equivalent to:
echarts-offline-doc -b -c

# View Help
echarts-offline-doc --help
# Equivalent to:
echarts-offline-doc -h
```

### View Offline Documentation With an HTTP Server

```sh
echarts-offline-doc
# Equivalent to:
echarts-offline-doc --serve
# Equivalent to:
echarts-offline-doc -s
```

### View Offline Documentation Locally

```sh
echarts-offline-doc --local
# Equivalent to:
echarts-offline-doc -l
```

## Build From Source

```sh
# clone the repo
git clone https://github.com/plainheart/echarts-offline-doc-cli --depth=1

# install dependencies
npm i

# build offline documentation
npm run build

# If it's slow to clone the echarts-doc repo
# you can specify a proxy URL
npm run build -- --proxy https://hub.fgit.cf/apache/echarts-doc
# Equivalent to:
npm run build -- -p https://hub.fgit.cf/apache/echarts-doc

# If it's slow to install dependencies
# you can optionally use `cnpm`
npm run build -- --cnpm
# Equivalent to:
npm run build -- -c

# start an HTTP server to view the documentation offline
npm start
# Equivalent to:
npm run serve

# or run the following command to open the static pages locally without a server
npm run local
```

## Download From GitHub Pages

If you don't want the build step or install the npm package, you may also download the zip archive from the [**gh-pages**](https://github.com/plainheart/echarts-offline-doc-cli/archive/gh-pages.zip) branch.

# License

MIT &copy; 2021-2023 [plainheart](https://github.com/plainheart).
