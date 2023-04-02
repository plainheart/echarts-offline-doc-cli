const path = require('node:path')

module.exports = {
  officialWebsitePath: 'https://echarts.apache.org',
  galleryViewPath: 'https://echarts.apache.org/examples/${lang}/view.html?c=',
  galleryEditorPath: 'https://echarts.apache.org/examples/${lang}/editor.html?c=',
  handbookPath: 'https://echarts.apache.org/handbook/${lang}/',
  websitePath: './',
  imagePath: 'asset/img/',
  gl: {
    imagePath: 'asset/gl/img/'
  },
  releaseDestDir: path.resolve(__dirname, '../public'),
  ecWWWGeneratedDir: path.resolve(__dirname, '../public')
}
