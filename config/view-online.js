const { officialWebsitePath } = require('./env.local')

module.exports = function(lang) {
  return `
    <script>
      var $header = document.querySelector('#header');
      var link = document.createElement('a');
      link.href = 'javascript:void(0)';
      link.target = '_blank';
      link.innerText = '${lang === 'zh' ? '在线文档' : 'View Online'}';
      link.style.cssText = 'float:right;color:#fff;line-height:40px;margin-right:50px;text-decoration:none;';
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var win = window.open();
        win.location.href = '${officialWebsitePath}/${lang}/' + location.pathname.split('/').pop() + location.search + location.hash;
      });
      $header.appendChild(link);
    </script>
  `
}
