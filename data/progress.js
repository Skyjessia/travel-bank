/* ═══════════════════════════════════════════
   愿望清单进度 · 数据自动计算（10/7 定稿）
   加了国家或城市 → 重开页面进度条自动刷新
   洲按 country 映射 · 洋按 city 映射（保守：没映射不计入，宁缺勿错）
   ═══════════════════════════════════════════ */
var CONTINENTS = ["亚洲","欧洲","非洲","大洋洲","北美洲","南美洲","南极洲"];
var OCEANS = ["太平洋","大西洋","印度洋","北冰洋"];

var COUNTRY_CONT = {
  "柬埔寨":"亚洲","新加坡":"亚洲","马来西亚":"亚洲","泰国":"亚洲","越南":"亚洲","中国":"亚洲",
  "韩国":"亚洲","日本":"亚洲","以色列":"亚洲","约旦":"亚洲","巴勒斯坦":"亚洲","尼泊尔":"亚洲",
  "英国":"欧洲","荷兰":"欧洲","克罗地亚":"欧洲","黑山":"欧洲","意大利":"欧洲","梵蒂冈":"欧洲","俄罗斯":"欧洲",
  "埃及":"非洲","新西兰":"大洋洲"
};

var CITY_OCEAN = {
  /* 太平洋：日本全境水系 · 新西兰（南太平洋）· 台湾 · 新加坡（南海侧） */
  "东京":"太平洋","札幌":"太平洋","函馆":"太平洋","小樽":"太平洋","旭川":"太平洋","富良野":"太平洋","美瑛":"太平洋","登别":"太平洋","洞爷湖町":"太平洋","阿寒湖":"太平洋","高松":"太平洋","直岛":"太平洋","丰岛":"太平洋","仓敷":"太平洋",
  "奥克兰":"太平洋","基督城":"太平洋","惠灵顿":"太平洋","皇后镇":"太平洋","瓦纳卡":"太平洋","蒂卡波湖":"太平洋","陶波":"太平洋","罗托鲁阿":"太平洋","旺格努伊":"太平洋","汤加里罗":"太平洋","玛塔玛塔":"太平洋","怀托摩":"太平洋",
  "台北":"太平洋","九份":"太平洋","北投":"太平洋","高雄":"太平洋","花莲":"太平洋","新加坡":"太平洋",
  /* 印度洋 */
  "普吉岛":"印度洋",
  /* 大西洋：亚得里亚海 · 地中海 · 北海 */
  "威尼斯":"大西洋","米兰":"大西洋","罗马":"大西洋","佛罗伦萨":"大西洋","梵蒂冈城":"大西洋",
  "杜布罗夫尼克":"大西洋","斯普利特":"大西洋","扎达尔":"大西洋","希贝尼克":"大西洋","特罗吉尔":"大西洋","哈瓦尔岛":"大西洋","萨格勒布":"大西洋",
  "特拉维夫":"大西洋","海法":"大西洋",
  "伦敦":"大西洋","巴斯":"大西洋","爱丁堡":"大西洋","阿姆斯特丹":"大西洋",
  /* 北冰洋 */
  "摩尔曼斯克":"北冰洋"
};

var OCEAN_TAG = {
  "北冰洋":"北冰洋（捷里别尔卡·巴伦支海）","太平洋":"太平洋（日本·新西兰·台湾）",
  "大西洋":"大西洋水系（地中海·亚得里亚海·北海）","印度洋":"印度洋（普吉岛·安达曼海）"
};

function renderProgress(){
  var visited = PLACE_BANK.filter(function(p){ return p.status === "visited"; });
  var conts = {}, oceans = {};
  visited.forEach(function(p){
    var c = COUNTRY_CONT[p.country];
    if(c) conts[c] = true;
    var o = CITY_OCEAN[p.city];
    if(o) oceans[o] = true;
  });
  function fill(barId, pcId, list, total){
    var n = Object.keys(list).length;
    var bar = document.getElementById(barId), pc = document.getElementById(pcId);
    if(!bar || !pc) return;
    bar.style.width = (n/total*100) + "%";
    bar.style.background = n >= total ? "linear-gradient(90deg,#c8a24a,#e8c878)" : "";
    pc.textContent = n + " / " + total + (n >= total ? " ✅" : "");
    return n;
  }
  fill("contBar","contPc",conts,CONTINENTS.length);
  fill("oceanBar","oceanPc",oceans,OCEANS.length);
  var lit = CONTINENTS.filter(function(c){return conts[c];}).join(" · ");
  var todo = CONTINENTS.filter(function(c){return !conts[c];}).join(" · ");
  var olit = OCEANS.filter(function(o){return oceans[o];}).map(function(o){return OCEAN_TAG[o]||o;}).join(" · ");
  var otodo = OCEANS.filter(function(o){return !oceans[o];}).join(" · ");
  var el = document.getElementById("progressDetail");
  if(el) el.innerHTML = "已点亮：" + lit + " ｜ " + olit +
    "<br>待点亮：" + todo + " · " + otodo;
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderProgress);
else renderProgress();
