/* ═══════════════════════════════════════════
   Travel Bank · 记忆页统一编辑模块 (editor.js) v2
   用法：页面引入 <script src="../memory/editor.js"></script>
         并在之前设 window.ME_JSON = 'guide/memories/xxx.json'
   能力：story 即时本地存 · 💾一键固化 · 冲突自动重试 · 📷照片档位
   v2 更新：409 冲突自动重试（GET 禁缓存）+ 照片上传/压缩/照片墙
   ═══════════════════════════════════════════ */
(function(){
  var st = document.createElement('style');
  st.textContent = '[contenteditable="true"]:hover{outline:1.5px dashed #c8a24a;outline-offset:3px;cursor:text;border-radius:4px}' +
    '[contenteditable="true"]:focus{outline:2px solid #c8a24a;outline-offset:3px;background:#fffdf5;border-radius:6px}' +
    '.me-photos{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;align-items:center}' +
    '.me-photos img{width:96px;height:96px;object-fit:cover;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.15);cursor:zoom-in;border:1px solid #e8e0d0}' +
    '.me-photo-btn{background:#fffdf9;border:1px dashed #c8a24a;color:#a8862f;border-radius:16px;padding:5px 12px;font-size:12px;cursor:pointer;margin-top:8px}' +
    '.me-photo-btn:hover{background:#faf3e0}' +
    '.me-photo-note{font-size:11px;color:#8a8378;margin-top:4px}';
  document.head.appendChild(st);
  var CFG = {
    owner: 'Skyjessia', repo: 'travel-bank', branch: 'main',
    json: window.ME_JSON || ''
  };
  function tok(){ return localStorage.getItem('gh_up_token'); }
  function stories(){ return Array.prototype.slice.call(document.querySelectorAll(window.ME_SEL || '.story')); }
  function todos(){ return Array.prototype.slice.call(document.querySelectorAll('.todo')); }
  function draftKey(i){ return 'me_draft_' + CFG.json + '_' + i; }
  function photoKey(){ return 'me_photos_' + CFG.json; }
  function apiUrl(path){ return 'https://api.github.com/repos/' + CFG.owner + '/' + CFG.repo + '/contents/' + path; }

  /* ---- 1. 打开时：云端 → 页面（本地草稿优先，云端兜底） ---- */
  function render(i, text){
    var el = stories()[i]; if(!el || !text) return;
    el.textContent = text;
    el.style.whiteSpace = 'pre-wrap';
  }
  function loadCloud(){
    if(!CFG.json) return;
    fetch(apiUrl(CFG.json) + '?ref=' + CFG.branch + '&t=' + Date.now(), { cache: 'no-store' })
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(f){
      if(!f || !f.content) return;
      var data = JSON.parse(decodeURIComponent(escape(atob(f.content.replace(/\n/g,'')))));
      (data.texts || []).forEach(function(t, i){
        var draft = localStorage.getItem(draftKey(i));
        render(i, draft || t);
      });
      /* 照片墙：本地记录优先，云端兜底 */
      var local = readLocalPhotos();
      var src = Object.keys(local).length ? local : (data.photos || {});
      Object.keys(src).forEach(function(k){
        var el = todos()[parseInt(k,10)];
        if(el) renderWall(el, src[k]);
      });
    }).catch(function(){});
  }
  function readLocalPhotos(){
    try { return JSON.parse(localStorage.getItem(photoKey()) || '{}'); }
    catch(e){ return {}; }
  }

  /* ---- 2. 编辑时：本地即时存（断网/没token也不丢） ---- */
  function bindLocal(){
    stories().forEach(function(el, i){
      el.style.whiteSpace = 'pre-wrap';
      try { el.contentEditable = 'true'; } catch(e){}
      el.spellcheck = false;
      el.setAttribute('title', '点击编辑·写完点💾固化');
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
  function editCss(){
    if(document.getElementById('meCss')) return;
    var s = document.createElement('style');
    s.id = 'meCss';
    s.textContent = '[contenteditable="true"]{cursor:text;border-radius:4px;transition:outline .15s,background .15s}' +
      '[contenteditable="true"]:hover{outline:1.5px dashed rgba(200,162,74,.75);outline-offset:3px}' +
      '[contenteditable="true"]:focus{outline:2px solid #c8a24a;outline-offset:3px;background:rgba(255,252,238,.92)}';
    document.head.appendChild(s);
  }
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
  function state(s){ var el = document.getElementById('meState'); if(el) el.textContent = s; }

  /* ---- 4. 固化：收集 → commit 进仓库（v2：冲突自动重试） ---- */
  function b64(s){ return btoa(unescape(encodeURIComponent(s))); }
  function getSha(path){
    return fetch(apiUrl(path) + '?ref=' + CFG.branch + '&t=' + Date.now(), {
      cache: 'no-store', headers: { 'Authorization': 'token ' + tok() }
    })
    .then(function(r){ return r.ok ? r.json() : (r.status === 404 ? {} : Promise.reject('读取失败 ' + r.status)); })
    .then(function(f){ return f.sha || null; });
  }
  function putFile(path, contentB64, message, sha){
    var body = { message: message, content: contentB64, branch: CFG.branch };
    if(sha) body.sha = sha;
    return fetch(apiUrl(path), {
      method: 'PUT',
      headers: { 'Authorization': 'token ' + tok(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  }
  function collectPayload(){
    var texts = stories().map(function(el){ return el.innerText.trim(); });
    return {
      updated: new Date().toISOString().slice(0,16).replace('T',' '),
      texts: texts,
      photos: readLocalPhotos()
    };
  }
  function save(){
    if(!tok()){ askTok(); return; }
    if(!CFG.json){ alert('页面未配置 ME_JSON'); return; }
    state('⏳ 正在固化…');
    var payload = collectPayload();
    var msg = '✍️ 回忆固化 ' + payload.updated + '（页面编辑）';
    getSha(CFG.json)
    .then(function(sha){ return putFile(CFG.json, b64(JSON.stringify(payload, null, 2)), msg, sha); })
    .then(function(r){
      if(r.ok) return finishSave(payload);
      if(r.status === 409){
        /* 冲突自动重试：重取 sha 再来一次 */
        state('↻ 检测到版本冲突，自动重试…');
        return getSha(CFG.json)
        .then(function(sha){ return putFile(CFG.json, b64(JSON.stringify(payload, null, 2)), msg, sha); })
        .then(function(r2){
          if(r2.ok) return finishSave(payload);
          return r2.text().then(function(t){ failSave(r2.status + '\n' + t.slice(0,150) + '\n\n若反复出现：刷新页面后再点固化'); });
        });
      }
      return r.text().then(function(t){ failSave(r.status + '\n' + t.slice(0,200)); });
    })
    .catch(function(e){ failSave(e); });
  }
  function finishSave(payload){
    stories().forEach(function(el, i){ localStorage.setItem(draftKey(i), el.innerText.trim()); });
    state('✅ 已固化进仓库');
    alert('✅ 已保存到仓库\n\n1-2 分钟后 GitHub Pages 生效，重新打开或刷新页面，内容都在。');
  }
  function failSave(t){ alert('保存失败 ' + t); state('❌ 失败'); }

  /* ---- 5. 📷 照片档位：选图 → 压缩 → 上传 → 照片墙 ---- */
  function bindPhotos(){
    if(!CFG.json) return;
    todos().forEach(function(el, idx){
      el.setAttribute('data-me-todo', idx);
      var wall = document.createElement('div');
      wall.className = 'me-photos';
      wall.id = 'meWall' + idx;
      var btn = document.createElement('button');
      btn.className = 'me-photo-btn';
      btn.textContent = '📷 传照片';
      btn.addEventListener('click', function(){ pickFiles(idx); });
      var note = document.createElement('div');
      note.className = 'me-photo-note';
      note.id = 'meNote' + idx;
      el.parentNode.insertBefore(wall, el.nextSibling);
      wall.parentNode.insertBefore(btn, wall.nextSibling);
      btn.parentNode.insertBefore(note, btn.nextSibling);
    });
    var input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.multiple = true;
    input.id = 'meFileInput'; input.style.display = 'none';
    document.body.appendChild(input);
    input.addEventListener('change', function(){
      if(input.files && input.files.length) addPhotos(input.files, input.getAttribute('data-idx'));
      input.value = '';
    });
  }
  var fileInput;
  function pickFiles(idx){
    fileInput = document.getElementById('meFileInput');
    fileInput.setAttribute('data-idx', idx);
    fileInput.click();
  }
  function compress(file){
    return new Promise(function(resolve, reject){
      var reader = new FileReader();
      reader.onload = function(e){
        var img = new Image();
        img.onload = function(){
          var MAX = 1600;
          var w = img.width, h = img.height;
          var scale = Math.min(1, MAX / Math.max(w, h));
          var cv = document.createElement('canvas');
          cv.width = Math.round(w * scale); cv.height = Math.round(h * scale);
          var ctx = cv.getContext('2d');
          ctx.drawImage(img, 0, 0, cv.width, cv.height);
          resolve(cv.toDataURL('image/jpeg', 0.85).split(',')[1]);
        };
        img.onerror = function(){ reject(new Error('图片读取失败（请用 JPG/PNG）')); };
        img.src = e.target.result;
      };
      reader.onerror = function(){ reject(new Error('文件读取失败')); };
      reader.readAsDataURL(file);
    });
  }
  function wallEl(idx){ return document.getElementById('meWall' + idx); }
  function noteEl(idx){ return document.getElementById('meNote' + idx); }
  function renderWall(el, urls){
    var idx = parseInt(el.getAttribute('data-me-todo'), 10);
    var wall = wallEl(idx); if(!wall) return;
    wall.innerHTML = '';
    (urls || []).forEach(function(u){
      var a = document.createElement('a');
      a.href = u; a.target = '_blank';
      var img = document.createElement('img');
      img.src = u;
      a.appendChild(img); wall.appendChild(a);
    });
  }
  function addPhotos(files, idx){
    if(!tok()){ askTok(); return; }
    idx = parseInt(idx, 10);
    var dir = 'photos/' + CFG.json.replace('guide/memories/','').replace('.json','');
    var local = readLocalPhotos();
    if(!local[idx]) local[idx] = [];
    var list = Array.prototype.slice.call(files);
    var done = 0;
    noteEl(idx).textContent = '⏳ 正在上传 0/' + list.length + '…';
    list.reduce(function(p, file){
      return p.then(function(){
        return compress(file).then(function(b64img){
          var name = 'd' + idx + '-' + Date.now() + '-' + done + '.jpg';
          return putFile(dir + '/' + name, b64img, '📷 照片 ' + name, null)
          .then(function(r){
            if(!r.ok) return r.text().then(function(){ throw new Error('上传失败 ' + r.status); });
            done++;
            noteEl(idx).textContent = '⏳ 正在上传 ' + done + '/' + list.length + '…';
            local[idx].push('../' + dir + '/' + name);
            localStorage.setItem(photoKey(), JSON.stringify(local));
            renderWall(todos()[idx], local[idx]);
            bump();
          });
        });
      });
    }, Promise.resolve())
    .then(function(){
      noteEl(idx).textContent = '✅ ' + done + ' 张已上传·点💾固化后所有设备可见';
      bump();
    })
    .catch(function(e){
      noteEl(idx).textContent = '❌ ' + (e.message || e);
      alert('照片上传失败：' + (e.message || e));
    });
  }

  /* ---- 6. 口令 ---- */
  function askTok(){
    var t = prompt('首次配置：粘贴 GitHub token\n(fine-grained · 只授权 travel-bank · Contents读写)\n生成: github.com/settings/personal-access-tokens/new');
    if(t && t.length > 20){ localStorage.setItem('gh_up_token', t.trim()); alert('已保存本机浏览器'); }
  }

  window.ME = { save: save, askTok: askTok, load: loadCloud };
  function boot(){ if(!stories().length) return; editCss(); bindLocal(); bindPhotos(); loadCloud(); bar(); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
