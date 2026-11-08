(() => {
  'use strict';
  const langs = ['en', 'ru', 'zh-Hans', 'he'];
  const names = ['English', 'Русский', '简体中文', 'עברית'];
  let lang = 'en', storage = true;
  try { lang = localStorage.getItem('ntsomnii-language') || 'en'; } catch { storage = false; }
  if (!langs.includes(lang)) lang = 'en';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const text = value => Array.isArray(value) ? value[langs.indexOf(lang)] ?? value[0] : String(value ?? '');
  const t = value => esc(text(value));
  const u = key => text(window.CROSSING_UI[key]);
  const button = (label, action, primary = false, attrs = '') => `<button class="btn ${primary ? 'primary' : ''}" data-action="${action}" ${attrs}>${esc(label)}</button>`;
  const list = items => `<ul class="points">${items.map(x => `<li>${t(x)}</li>`).join('')}</ul>`;
  function read(key, initial) {
    try { return {...initial, ...JSON.parse(localStorage.getItem(key) || 'null')}; }
    catch { storage = false; return initial; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); localStorage.setItem('ntsomnii-language', lang); }
    catch { storage = false; }
  }
  function setLang(value) { if (langs.includes(value)) lang = value; }
  function documentLanguage() { document.documentElement.lang = lang; document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr'; }
  function toast(message) { const el = document.getElementById('toast'); if (el) el.textContent = message; }
  async function copy(value) { try { await navigator.clipboard.writeText(value); toast(u('copied')); } catch { toast(u('copyFail')); } }
  function download(filename, value, mime = 'text/plain;charset=utf-8') {
    const url = URL.createObjectURL(new Blob([value], {type:mime}));
    const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function header({year, teacher, big, hub = false}) {
    return `<a class="skip" href="#main">${esc(u(hub ? 'topics' : 'learn'))}</a>
      <header class="top"><a href="${hub ? '../../' : '../'}" class="brand"><span class="brandmark" aria-hidden="true">↯</span><span>NTSOMNII<br><b>TECH FOR CHANGE</b></span></a>
      <div class="tools"><span class="badge">${hub ? 'COMMUNITY PROJECT' : 'YEAR '+year+' · WEEK 7'}</span><label class="langlabel">Language<select id="language">${langs.map((x,i) => `<option value="${x}" ${x===lang?'selected':''}>${names[i]}</option>`).join('')}</select></label>${button(u('big'),'big',false,`aria-pressed="${big}"`)}${button(u('teacher'),'teacher',teacher,`aria-pressed="${teacher}"`)}</div></header>
      <nav class="section-tabs" aria-label="Tech for Change"><a href="../../year-7/" ${year===7?'aria-current="page"':''}>Year 7 · Arduino C++</a><a href="../../year-8/" ${year===8?'aria-current="page"':''}>Year 8 · Pico Python</a><a href="../../community-project/smart-beehive/" ${hub?'aria-current="page"':'target="_blank" rel="noopener"'}>${esc(u('community'))}</a></nav>`;
  }
  function codebox(code) { return `<div class="codebox"><div class="codehead"><b>${esc(u('worked'))}</b>${button(u('copy'),'copy-teacher')}</div><pre dir="ltr"><code>${esc(code)}</code></pre></div>`; }
  function teacherPanel(entry) {
    if (!entry) return '';
    return `<section class="paper teacher-panel"><p class="eyebrow">${esc(u('teacherOn'))}</p><h2>${esc(u('guidance'))}</h2><p><strong>${esc(u('ask'))}</strong> ${t(entry.question)}</p><p><strong>${esc(u('watch'))}</strong> ${t(entry.watch)}</p>${entry.code?`<details class="teacher-code"><summary>${esc(u('worked'))}</summary><p class="small">${esc(u('workedNote'))}</p>${codebox(entry.code)}</details>`:''}<div class="actions">${button(u('teacherOff'),'teacher')}</div></section>`;
  }
  function footer() { return `<footer><p role="status">${esc(u(storage?'saved':'unsaved'))}</p></footer>`; }
  window.CrossingUI = {langs, text, t, esc, u, button, list, read, save, setLang, documentLanguage, toast, copy, download, header, codebox, teacherPanel, footer, getLang:()=>lang};
})();
