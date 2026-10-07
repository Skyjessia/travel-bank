/* ═══════════════════════════════════════════
   Travel Bank · 记忆页统一编辑模块 (editor.js)
   用法：页面引入 <script src="../editor.js"></script>
         并在之前设 window.ME_JSON = 'memory/2026-xxx/memories.json'
   能力：story 即时本地存 · 💾一键固化到仓库 · 刷新自动加载
   ═══════════════════════════════════════════ */
(function(){
  var CFG = {
    owner: 'Skyjessia', repo: 'travel-bank', branch: 'main',
    json: window.ME_JSON || ''
  };
  function tok(){ return localStorage.getItem('gh_up_token'); }
  function stories(){ return Array.prototype.slice.call(document.querySelectorAll(window.ME_SEL || '.story')); }
  function draftKey(i){ return 'me_draft_' + CFG.json + '_' + i; }

  /* ---- 1. 打开时：云端 → 页面（本地草稿优先，云端兜底） ---- */
  function render(i, text){
    var el = stories()[i]; if(!el || !text) return;
    el.textContent = text;
    el.style.whiteSpace = 'pre-wrap';
    var ph = el.querySelector('.placeholder'); if(ph) ph.remove();
  }
  function loadCloud(){
    if(!CFG.json) return;
    fetch('https://api.github.com/repos/' + CFG.owner + '/' + CFG.repo +
      '/contents/' + CFG.json + '?ref=' + CFG.branch)
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(f){
      if(!f || !f.content) return;
      var data = JSON.parse(decodeURIComponent(escape(atob(f.content.replace(/\n/g,'')))));
      (data.texts || []).forEach(function(t, i){
        var draft = localStorage.getItem(draftKey(i));
        render(i, draft || t);   /* 本机草稿没保存过的更动，以本地为准 */
      });
    }).catch(function(){});
  }

  /* ---- 2. 编辑时：本地即时存（断网/没token也不丢） ---- */
  function bindLocal(){
    stories().forEach(function(el, i){
      el.style.whiteSpace = 'pre-wrap';
      var k = draftKey(i);
      var saved = localStorage.getItem(k);
      if(saved){ render(i, saved); }
      el.addEventListener('input', function(){
        localStorage.setItem(k, el.innerText);
        bump();
      });
    });
  }

  /* ---- 3. 保存条 UI ---- */
  function bar(){
    if(document.getElementById('meBar')) return;
    var d = document.createElement('div');
    d.id = 'meBar';
    d.style.cssText = 'position:fixed;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:10px;z-index:998;align-items:center';
    d.innerHTML =
      '<span id="meState" style="font-size:11px;color:#8a8378;background:rgba(255,253,249,.95);padding:4px 10px;border-radius:14px;box-shadow:0 1px 6px rgba(0,0,0,.08)"></span>' +
      '<button onclick="ME.save()" style="background:#c8a24a;color:#fff;border:none;border-radius:22px;padding:10px 24px;font-size:14px;font-weight:bold;box-shadow:0 4px 14px rgba(180,130,40,.4);cursor:pointer">💾 固化到云端</button>' +
      '<button onclick="ME.askTok()" title="GitHub 口令" style="background:#fffdf9;border:1px solid #e0d8c4;border-radius:22px;padding:10px 14px;font-size:14px;cursor:pointer">🔑</button>';
    document.body.appendChild(d);
    var s = stories().filter(function(el){ return el.innerText.trim().length; }).length;
    if(s){ document.getElementById('meState').textContent = '本机已存 ' + s + ' 段'; }
  }
  var bumpT;
  function bump(){
    var el = document.getElementById('meState');
    if(el) el.textContent = '✏️ 有未固化的修改';
    clearTimeout(bumpT);
  }

  /* ---- 4. 固化：收集 → commit 进仓库 ---- */
  function b64(s){ return btoa(unescape(encodeURIComponent(s))); }
  function save(){
    if(!tok()){ askTok(); return; }
    if(!CFG.json){ alert('页面未配置 ME_JSON'); return; }
    var texts = stories().map(function(el){ return el.innerText.trim(); });
    var payload = { updated: new Date().toISOString().slice(0,16).replace('T',' '), texts: texts };
    var url = 'https://api.github.com/repos/' + CFG.owner + '/' + CFG.repo + '/contents/' + CFG.json;
    state('⏳ 正在固化…');
    fetch(url + '?ref=' + CFG.branch, { headers: { 'Authorization': 'token ' + tok() } })
    .then(function(r){ return r.ok ? r.json() : (r.status === 404 ? {} : Promise.reject('读取失败 ' + r.status)); })
    .then(function(cur){
      var body = {
        message: '✍️ 回忆固化 ' + payload.updated + '（页面编辑）',
        content: b64(JSON.stringify(payload, null, 2)),
        branch: CFG.branch
      };
      if(cur.sha) body.sha = cur.sha;
      return fetch(url, {
        method: 'PUT',
        headers: { 'Authorization': 'token ' + tok(), 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    })
    .then(function(r){
      if(r.ok){
        stories().forEach(function(el, i){ localStorage.setItem(draftKey(i), el.innerText.trim()); });
        state('✅ 已固化进仓库');
        alert('✅ 已保存到仓库\n\n1-2 分钟后 GitHub Pages 生效，重新打开或刷新页面，内容都在。');
      } else { r.text().then(function(t){ alert('保存失败 ' + r.status + '\n' + t.slice(0,200)); state('❌ 失败'); }); }
    })
    .catch(function(e){ alert('保存失败：' + e); state('❌ 失败'); });
  }
  function state(s){ var el = document.getElementById('meState'); if(el) el.textContent = s; }

  /* ---- 5. 口令 ---- */
  function askTok(){
    var t = prompt('首次配置：粘贴 GitHub token\n(fine-grained · 只授权 travel-bank · Contents读写)\n生成: github.com/settings/personal-access-tokens/new');
    if(t && t.length > 20){ localStorage.setItem('gh_up_token', t.trim()); alert('已保存本机浏览器'); }
  }

  window.ME = { save: save, askTok: askTok, load: loadCloud };
  function boot(){ if(!stories().length) return; bindLocal(); loadCloud(); bar(); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
