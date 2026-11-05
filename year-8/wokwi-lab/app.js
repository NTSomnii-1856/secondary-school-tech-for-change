(() => {
  'use strict';
  const week = Number(document.body.dataset.week) === 7 ? 7 : 6;
  const root = new URL('../wokwi-lab/', location.href);
  const key = `ntsomnii-y8-w${week}-wokwi-v2`;
  const languages = {en:'English', ru:'Русский', 'zh-Hans':'简体中文', he:'עברית'};
  let state = {step:0, route:'guide', checked:[], link:'', note:'', large:false, focus:false};
  let language = 'en', storage = true, codeCache = new Map(), renderId = 0;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved && typeof saved === 'object') state = {...state, ...saved};
    language = localStorage.getItem('ntsomnii-language') || 'en';
  } catch { storage = false; }
  const original = window.WOKWI_LESSONS[week];
  state.step = Math.max(0, Math.min(original.steps.length - 1, Number(state.step) || 0));
  state.checked = Array.isArray(state.checked) ? state.checked.slice(0, original.steps.length).map(Boolean) : [];
  state.route = state.route === 'project' ? 'project' : 'guide';
  state.link = typeof state.link === 'string' ? state.link : '';
  state.note = typeof state.note === 'string' ? state.note : '';
  if (!languages[language]) language = 'en';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Keep inline Python expressions readable within right-to-left prose too.
  const prose = value => esc(String(value ?? '').replace(/\b(?:pattern\s*=\s*\[[\d,\s]+\]|pattern\[\w+\]|len\(pattern\)|range\([\d.]+\)|sleep\([\d.]+\)|main\.py|lights\.py|red\.off\(\)|score\s*=\s*score\s*\+\s*1)/g, '\u2066$&\u2069'));
  const resource = file => new URL('resources/' + file, root).href;
  const words = () => ({d:window.WOKWI_I18N?.[language]?.lessons?.[week] || original, u:window.WOKWI_I18N?.[language]?.ui || window.WOKWI_UI});
  const save = () => {
    try { localStorage.setItem(key, JSON.stringify(state)); localStorage.setItem('ntsomnii-language', language); }
    catch { storage = false; }
  };
  const button = (label, action, cls='', extra='') => `<button type="button" class="btn ${cls}" data-action="${action}" ${extra}>${esc(label)}</button>`;
  const list = items => `<ul>${items.map(x=>`<li>${prose(x)}</li>`).join('')}</ul>`;
  const codebox = (file,u) => `<div class="codebox"><div class="codehead"><strong>${esc(u.code)}</strong>${button(u.copy,'copy','',`data-file="${file}"`)}</div><pre dir="ltr"><code data-code="${file}"></code></pre></div>`;
  function figure(kind,u) {
    if (kind === 'wiring') return `<figure class="diagram"><img src="${resource('wiring.svg')}" alt="${esc(u.diagramAlt)}"><figcaption dir="ltr">GP15 → 330Ω → 1 RED · GP16 → 330Ω → 2 AMBER · GP17 → 330Ω → 3 GREEN · LED C → GND</figcaption></figure>`;
    if (kind === 'pattern') return `<figure class="pattern"><div class="pattern-label" dir="ltr">${esc(u.pattern)}</div><div class="pattern-grid" dir="ltr">${[1,3,2].map((n,i)=>`<div><small>[${i}]</small><span class="lamp lamp-${n}">${n}</span></div>`).join('')}</div></figure>`;
    if (kind === 'traffic') return `<figure class="flow" aria-label="${esc(u.traffic)}" dir="ltr"><span class="pill red">1 RED</span><span>→</span><span class="pill green">3 GREEN</span><span>→</span><span class="pill amber">2 AMBER</span><span>↻</span></figure>`;
    return `<figure class="flow text-flow"><p>${esc(u[kind] || u.game)}</p></figure>`;
  }
  function notes(u) {
    return `<section class="paper"><h2>${esc(u.saveTitle)}</h2><label for="project-link">${esc(u.projectLink)}</label><input id="project-link" type="url" inputmode="url" value="${esc(state.link)}" placeholder="https://wokwi.com/projects/…"><label for="reflection">${esc(u.reflection)}</label><textarea id="reflection" rows="3" placeholder="${esc(u.notesPlaceholder)}">${esc(state.note)}</textarea>${button(u.download,'download')}<p class="small" id="save-status" role="status">${esc(storage?u.saved:u.unsaved)}</p></section>`;
  }
  function project(d,u) {
    return `<p class="eyebrow">${esc(u.week)} ${week} · ${esc(u.final)}</p><h1>${esc(d.projectTitle)}</h1><p class="lead">${esc(d.projectBrief)}</p>${figure(week===6?'traffic':'game',u)}<section class="paper"><h2>${esc(u.requirements)}</h2>${list(d.requirements)}<h2>${esc(u.tests)}</h2>${list(d.tests)}<p class="small">${esc(u.localNote)}</p><a class="btn primary" href="https://wokwi.com/projects/478696813355602945" target="_blank" rel="noopener">${esc(u.open)}</a><p class="small">${esc(u.restart)}</p><details><summary>${esc(u.hint)}</summary><p>${esc(d.projectHint)}</p></details><details><summary>${esc(u.solution)}</summary><p>${esc(u.solutionNote)}</p>${codebox(d.solution,u)}</details><details><summary>${esc(u.diagram)}</summary>${figure('wiring',u)}</details></section>${notes(u)}<details class="paper"><summary>${esc(u.extension)}</summary><p>${esc(d.extension)}</p>${week===7?`<a class="btn" href="legacy.html">${esc(u.previous)}</a>`:''}</details>`;
  }
  function guide(d,u) {
    const s = d.steps[state.step];
    return `<p class="eyebrow">${esc(d.sessions[s.session])} · ${esc(s.minutes)}</p><div class="step-line"><span>${esc(u.step)} ${state.step+1} ${esc(u.of)} ${d.steps.length}</span><span>${state.checked.filter(Boolean).length}/${d.steps.length} ${esc(u.progress)}</span></div><progress max="${d.steps.length}" value="${state.checked.filter(Boolean).length}" aria-label="${esc(u.progress)}"></progress><h1>${esc(s.title)}</h1><p class="lead">${prose(s.purpose)}</p>${figure(s.visual,u)}<article class="paper task"><p class="file-label">${esc(u.file)}</p><ol class="actions-list">${s.actions.map(x=>`<li>${prose(x)}</li>`).join('')}</ol>${state.step===0?`<a class="btn primary" href="https://wokwi.com/projects/478696813355602945" target="_blank" rel="noopener">${esc(u.open)}</a>`:''}${s.code?codebox(s.code,u):''}<aside class="checkpoint"><h2>${esc(u.expected)}</h2><p>${prose(s.expected)}</p><label class="check-label"><input id="checked" type="checkbox" ${state.checked[state.step]?'checked':''}>${esc(u.done)}</label></aside><details><summary>${esc(u.hint)}</summary><p>${prose(s.hint)}</p></details>${s.notes?`<details><summary>${esc(u.explain)}</summary><dl>${s.notes.map(([code,explain])=>`<dt dir="ltr"><code>${esc(code)}</code></dt><dd>${prose(explain)}</dd>`).join('')}</dl></details>`:''}<div class="step-nav">${state.step?button('← '+u.back,'prev'):''}${button(s.final?u.finish:u.next+' →',s.final?'project':'next','primary')}</div></article><details class="step-picker"><summary>${esc(u.helpSteps)}</summary><nav aria-label="${esc(u.guide)}">${d.steps.map((s,i)=>button(`${i+1}. ${s.title}`, 'step','',`data-step="${i}" ${i===state.step?'aria-current="step"':''}`)).join('')}</nav><p class="small">${esc(u.noGate)}</p>${button(u.reset,'reset')}</details>`;
  }
  async function hydrateCode(id) {
    for (const el of document.querySelectorAll('[data-code]')) {
      const file = el.dataset.code;
      if (!codeCache.has(file)) {
        try { const response = await fetch(resource(file)); if(!response.ok) throw Error(); codeCache.set(file, await response.text()); }
        catch { if (id===renderId) { const a=document.createElement('a');a.href=resource(file);a.textContent=file;el.replaceChildren(a); } continue; }
      }
      if (id === renderId) el.textContent = codeCache.get(file);
    }
  }
  function render(focus=false) {
    const {d,u}=words();const id=++renderId;
    document.documentElement.lang=language;document.documentElement.dir=language==='he'?'rtl':'ltr';
    document.body.classList.toggle('large',!!state.large);document.body.classList.toggle('focus-mode',!!state.focus);
    document.title=d.title+' · Year 8 · NTSOMNII';
    document.getElementById('app').innerHTML=`<a class="skip" href="#main">${esc(u.guide)}</a><header class="top"><a class="brand" href="../">NTSOMNII <span>TECH FOR CHANGE</span></a><div class="tools"><label>Language <select id="language">${Object.entries(languages).map(([id,name])=>`<option value="${id}" ${id===language?'selected':''}>${name}</option>`).join('')}</select></label>${button(u.large,'large','',`aria-pressed="${!!state.large}"`)}${button(u.focus,'focus','',`aria-pressed="${!!state.focus}"`)}</div></header><div class="layout"><aside class="route"><p class="eyebrow">${esc(u.lesson)}</p><h2>${esc(d.title)}</h2><p>${esc(d.intro)}</p><h3>${esc(u.choose)}</h3>${button(u.guide,'guide',state.route==='guide'?'primary':'',`aria-pressed="${state.route==='guide'}"`)}${button(u.jump,'project',state.route==='project'?'primary':'',`aria-pressed="${state.route==='project'}"`)}<p class="small">${esc(u.routeNote)}</p><div class="prior"><strong>${esc(u.known)}</strong><p dir="ltr">${esc(u.knownText)}</p></div><nav class="weeks"><a href="../week-6-light-memory-game/">${esc(u.week6)}</a><a href="../week-7-copy-the-lights/">${esc(u.week7)}</a></nav></aside><main id="main" tabindex="-1">${state.route==='project'?project(d,u):guide(d,u)}<footer><details><summary>${esc(u.backup)}</summary><p>${esc(u.backupText)}</p><div class="recovery"><a class="btn" href="${resource('starter-project.zip')}" download>${esc(u.zip)}</a><a href="https://wokwi.com/projects/new/micropython-pi-pico" target="_blank" rel="noopener">${esc(u.newProject)}</a></div></details><p class="small">${esc(storage?u.saved:u.unsaved)}</p><a href="https://docs.wokwi.com/guides/micropython" target="_blank" rel="noopener">${esc(u.official)}</a></footer></main></div><p class="toast" id="toast" role="status" aria-live="polite"></p>`;
    save();hydrateCode(id);
    if(focus)document.getElementById('main').focus({preventScroll:true});
    if(focus)window.scrollTo({top:0,behavior:'instant'});
  }
  document.addEventListener('click',async event=>{
    const b=event.target.closest('button[data-action]');if(!b)return;
    const action=b.dataset.action,{d,u}=words();
    if(action==='copy') {
      try { const file=b.dataset.file;if(!codeCache.has(file)){const res=await fetch(resource(file));if(!res.ok)throw Error();codeCache.set(file,await res.text());}await navigator.clipboard.writeText(codeCache.get(file));document.getElementById('toast').textContent=u.copied; }
      catch {document.getElementById('toast').textContent=u.copyFail;} return;
    }
    if(action==='download') {
      const text=`NTSOMNII · Year 8 · Week ${week}\n${d.title}\n\n${u.progress}: ${state.checked.map((v,i)=>`${i+1}: ${v?'✓':'—'}`).join(', ')}\n\n${u.projectLink}\n${state.link}\n\n${u.reflection}\n${state.note}\n`;
      const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`Year8-Week${week}-my-work.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;
    }
    if(action==='reset'){if(!confirm(u.resetConfirm))return;state.checked=[];}
    if(action==='guide'||action==='project')state.route=action;
    if(action==='next')state.step=Math.min(d.steps.length-1,state.step+1);
    if(action==='prev')state.step=Math.max(0,state.step-1);
    if(action==='step'){state.step=Number(b.dataset.step);state.route='guide';}
    if(action==='large')state.large=!state.large;
    if(action==='focus')state.focus=!state.focus;
    render(true);
  });
  document.addEventListener('change',event=>{
    if(event.target.id==='language'){language=event.target.value;render();}
    if(event.target.id==='checked'){state.checked[state.step]=event.target.checked;save();const count=state.checked.filter(Boolean).length;document.querySelector('progress').value=count;document.querySelector('.step-line span:last-child').textContent=`${count}/${original.steps.length} ${words().u.progress}`;}
  });
  document.addEventListener('input',event=>{
    if(event.target.id==='project-link')state.link=event.target.value;
    else if(event.target.id==='reflection')state.note=event.target.value;
    else return;save();const el=document.getElementById('save-status');if(el)el.textContent=words().u[storage?'saved':'unsaved'];
  });
  render();
})();
