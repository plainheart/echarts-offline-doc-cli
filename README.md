# echarts-offline-doc-cli
[![NPM version](https://img.shields.io/npm/v/echarts-offline-doc-cli.svg?style=flat)](https://www.npmjs.org/package/echarts-offline-doc-cli)
[![Auto Deploy](https://github.com/plainheart/echarts-offline-doc-cli/actions/workflows/deploy.yaml/badge.svg)](https://github.com/plainheart/echarts-offline-doc-cli/actions/workflows/deploy.yaml)
[![NPM Downloads](https://img.shields.io/npm/dm/echarts-offline-doc-cli.svg)](https://npmcharts.com/compare/echarts-offline-doc-cli?minimal=true)
[![License](https://img.shields.io/npm/l/echarts-offline-doc-cli.svg)](https://github.com/plainheart/echarts-offline-doc-cli/blob/main/LICENSE)

Apache ECharts 中文离线文档生成工具

[GitHub Pages 预览](https://plainheart.github.io/echarts-offline-doc-cli)

![示例](https://user-images.githubusercontent.com/26999792/229869304-4a782121-4324-4e68-9f3d-a956d0c60ee6.png)

# 开始使用

## 全局安装

```sh
npm i echarts-offline-doc-cli -g
```

### 生成离线文档

```sh
echarts-offline-doc --build
# 等价于：
echarts-offline-doc -b

# 如果拉取代码速度较慢，可以指定一个快速的代理镜像地址
echarts-offline-doc --build --proxy https://hub.fgit.cf/apache/echarts-doc
# 等价于：
echarts-offline-doc -b -p https://hub.fgit.cf/apache/echarts-doc

# 如果依赖安装速度较慢，可以考虑使用 cnpm
echarts-offline-doc --build --cnpm
# 等价于：
echarts-offline-doc -b -c

# 查看帮助信息
echarts-offline-doc --help
# 等价于：
echarts-offline-doc -h
```

### 使用 HTTP Server 查看离线文档

```sh
echarts-offline-doc
# 等价于：
echarts-offline-doc --serve
# 等价于：
echarts-offline-doc -s
```

### 本地查看离线文档

```sh
echarts-offline-doc --local
# 等价于：
echarts-offline-doc -l
```

## 从源码构建

```sh
# 拉取本项目代码仓库
git clone https://github.com/plainheart/echarts-offline-doc-cli --depth=1

# 安装依赖
npm i

# 构建离线文档
npm run build

# 如果拉取代码速度较慢，可以指定一个快速的代理镜像地址
npm run build -- -- --proxy https://hub.fgit.cf/apache/echarts-doc
# 等价于：
npm run build -- -- -p https://hub.fgit.cf/apache/echarts-doc

# 如果依赖安装速度较慢，可以考虑使用 cnpm
npm run build -- -- --cnpm
# 等价于：
npm run build -- -- -c

# 开启一个 HTTP Server 查看离线文档
npm start
# 等价于：
npm run serve

# 也可以不用开启 HTTP Server，直接打开来查看离线文档
npm run local
```

## 从 GitHub Pages 下载离线文档

如果不想麻烦去安装或者手动构建，可以直接从 [**gh-pages**](https://github.com/plainheart/echarts-offline-doc-cli/archive/gh-pages.zip) 分支下载定期生自动生成和更新的 zip 压缩包，解压后打开根目录下的 `index.html` 即可。

# License

MIT &copy; 2021-2023 [plainheart](https://github.com/plainheart).
