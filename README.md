# echarts-offline-doc-cli
A CLI tool for offline documentation of Apache ECharts.

# Build Steps

```sh
# clone the repo
git clone https://github.com/plainheart/echarts-offline-doc-cli.git

# install dependencies
npm i

# build offline documentation
npm run build

# If it's slow to clone the echarts-doc repo or install dependencies
# you can specify a proxy url or use `cnpm`
npm run build -- --proxy=https://ghproxy.com/https://github.com/apache/echarts-doc.git

# If it's slow to install dependencies
# you can optionally use `cnpm`
npm run build -- --cnpm

# start a local server to view the documentation offline
npm run start:server

# or run the following command to open the static pages without a server
npm run start
```


