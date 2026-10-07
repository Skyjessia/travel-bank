/* trips 自动加载器 · 所有行程数据一处维护（10/7）
   新加行程：data/trips/ 放文件 + 下面的列表加一行文件名（仅此一处）
   index.html 和 wishlist.html 都通过本文件加载，不用再改 */
(function(){
  var FILES = ["2020-xibei.js", "2025-guizhou.js", "2026-russia.js", "2026-shanxi.js", "2026-sichuan.js", "2025-egypt.js", "2024-italy.js", "2016-hokkaido.js", "2015-taiwan.js", "2017-balkan.js", "2018-holyland.js", "2019-newzealand.js", "2019-tokyo.js", "2015-uk.js", "2018-setouchi.js", "2024-xinjiang.js", "2021-shangrila.js", "2021-beijiang.js", "2023-nepal.js", "2008-cambodia.js", "2012-vietnam.js", "2010-xinmatai.js", "2013-gaoxiong-hualien.js", "2014-thailand.js", "2014-korea.js"];
  var root = (document.currentScript && document.currentScript.src || '').replace(/trips-loader\.js.*$/, '');
  if (typeof TRIP_BANK === "undefined" || typeof PLACE_BANK === "undefined") {
    document.write('<script src="' + root + 'data/bank.js"><' + '/script>');
  }
  FILES.forEach(function(f){ document.write('<script src="' + root + 'data/trips/' + f + '"><\/script>'); });
})();
/* rev 2 */
