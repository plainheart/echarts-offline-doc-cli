const path = require('path')

module.exports = {
  galleryViewPath: 'https://echarts.apache.org/examples/${lang}/view.html?c=',
  galleryEditorPath: 'https://echarts.apache.org/examples/${lang}/editor.html?c=',
  officialWebsitePath: 'https://echarts.apache.org',
  websitePath: './',
  imagePath: 'asset/img/',
  gl: {
    imagePath: 'asset/gl/img/'
  },
  releaseDestDir: path.resolve(__dirname, '../public'),
  ecWWWGeneratedDir: path.resolve(__dirname, '../public')
}
