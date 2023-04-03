const { officialWebsitePath } = require('./env.local')

module.exports = function(lang) {
  return `
    <script>
      var $header = document.querySelector('#header');
      var link = document.createElement('a');
      link.href = 'javascript:void(0)';
      link.target = '_blank';
      link.innerText = '${lang === 'zh' ? '在线文档' : 'View Online'}';
      link.style.cssText = 'float:right;color:#29d;line-height:50px;margin-right:20px;text-decoration:none;';
      link.addEventListener('click', function(e) {
        e.preventDefault();
        location.href = '${officialWebsitePath}/${lang}/' + location.pathname.split('/').pop() + location.search + location.hash;
      });
      $header.appendChild(link);
    </script>
  `
}
