(() => {
  'use strict';
  const d=window.GAME_LESSON, app=document.getElementById('app');
  const langs=[['en','English'],['ru','Русский'],['zh-Hans','简体中文'],['he','עברית']];
  let lang='en', step=0, view='start', printMode='guide';
  try {lang=localStorage.getItem('ntsomnii-language')||'en';} catch {}
  if(!langs.some(([id])=>id===lang))lang='en';
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const t=v=>esc(Array.isArray(v)?v[langs.findIndex(([id])=>id===lang)]||v[0]:v);
  const u=k=>t(d.ui[k]);
  const code=v=>`<pre dir="ltr"><code>${esc(v)}</code></pre>`;
  const image=(file,caption)=>file?`<figure><a href="${esc(file)}" target="_blank" rel="noopener"><img src="${esc(file)}" alt="${t(caption)}"></a><figcaption>${t(caption)}</figcaption></figure>`:'';
  const list=(items,ordered=false)=>`<${ordered?'ol':'ul'}>${items.map(x=>`<li>${t(x)}</li>`).join('')}</${ordered?'ol':'ul'}>`;
  const cards=ids=>ids.map(id=>{const c=d.cards[id];return `<section class="concept"><h3>${t(c.title)}</h3><p>${t(c.meaning)}</p>${c.example?code(c.example):''}</section>`;}).join('');
  const launch=()=>`<a class="button primary" target="_blank" rel="noopener" href="${esc(d.launch.url)}">${t(d.launch.label)} ↗</a>`;
  const rubric=()=>`<table><thead><tr><th>${u('level')}</th><th>${u('evidence')}</th></tr></thead><tbody>${d.rubric.map(r=>`<tr><th>${t(r[0])}</th><td>${t(r[1])}</td></tr>`).join('')}</tbody></table>`;
  function stage(s,n,printing=false){return `<section class="${printing?'print-page':'stage'}"><p class="eyebrow">${u('step')} ${n+1} / ${d.stages.length}</p><h2 tabindex="-1" id="${printing?'print-step-'+n:'step-title'}">${t(s.title)}</h2>${printing?`<p>${t(s.learn)}</p>`:`<p class="purpose">${t(s.learn)}</p>`}
    <div class="stage-grid"><aside aria-label="${u('learn')}"><h3>${u('learn')}</h3>${cards(s.concepts)}</aside><article><h3>${u('turn')}</h3>${list(printing?(s.printTasks||s.tasks):s.tasks,true)}
      ${printing&&s.printFigure===false?'':image(s.figure,s.caption||s.title)}${s.table?`<div class="table-scroll"><table><thead><tr>${s.table.headers.map(x=>`<th>${t(x)}</th>`).join('')}</tr></thead><tbody>${s.table.rows.map(r=>`<tr>${r.map(x=>`<td dir="auto">${t(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:''}
      ${s.snippet?`<p class="placement">${t(s.place)}</p>${code(s.snippet)}${printing||s.exampleOnly?'':`<button class="button" data-copy="snippet">${u('copy')}</button>`}`:''}
      ${s.full&&s.full!==s.snippet&&!printing?`<details><summary>${u('full')}</summary><p>${u('fullNote')}</p>${code(s.full)}<button class="button" data-copy="full">${u('copy')}</button></details>`:''}
      <div class="check"><strong>${u('check')}</strong><p>${t(s.check)}</p></div>
      ${s.hint&&!printing?`<details><summary>${u('stuck')}</summary><p>${t(s.hint)}</p></details>`:''}
    </article></div>${printing&&n===d.stages.length-1?`<section><h3>${u('exit')}</h3>${list(d.exit,true)}</section>`:''}</section>`;}
  function challenge(c,printing=false){return `<section class="${printing?'print-page':'paper'}"><p class="eyebrow">${u('optional')}</p><h2>${t(c.title)}</h2><p class="purpose">${t(c.problem)}</p>${list(c.tasks,true)}${list(c.success)}${c.hint?`<details><summary>${u('hint')}</summary><p>${t(c.hint)}</p></details>`:''}${c.concepts?.length?`<div class="challenge-notes">${cards(c.concepts)}</div>`:''}</section>`;}
  function start(){return `<section class="paper"><p class="eyebrow">${t(d.context)}</p><h1>${t(d.title)}</h1><p class="lead">${t(d.brief)}</p><h2>${u('intent')}</h2>${list(d.objectives)}${launch()} <a class="button" href="resources/student-guide.pdf" target="_blank" rel="noopener">${u('offline')}</a>${image(d.figure,d.figureCaption)}<h2>${u('setup')}</h2>${list(d.setup,true)}${d.diagram?`<details><summary>${u('wiring')}</summary><p>${u('wiringNote')}</p>${code(d.diagram)}<button class="button" data-copy="diagram">${u('copyWiring')}</button></details>`:''}<button class="button primary" data-view="build">${u('begin')}</button></section>`;}
  function teacher(){return `<section class="paper"><h1>${u('teacher')}</h1>${d.teacher.sections.map(s=>`<h2>${t(s.title)}</h2>${list(s.items)}`).join('')}<h2>${u('solutions')}</h2>${d.solutions.map((s,i)=>`<details><summary>${t(s.title)}</summary>${s.code?`${code(s.code)}<button class="button" data-solution="${i}">${u('copy')}</button>`:`<p>${t(s.text)}</p>`}</details>`).join('')}<h2>References</h2><ul>${d.sources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a></li>`).join('')}</ul></section>`;}
  function renderPrint(){let body='';const s=d.stages[step];
    if(printMode==='step')body=stage(s,step,true);
    if(printMode==='guide')body=`<section class="print-page"><p class="eyebrow">Year ${d.year} · Week ${d.week}</p><h1>${t(d.title)}</h1><p>${t(d.brief)}</p>${list(d.objectives)}${image(d.figure,d.figureCaption)}<h2>${u('setup')}</h2>${list(d.setup,true)}<p><a href="${esc(d.launch.url)}">${t(d.launch.label)}</a></p><p>${esc(d.url)}</p></section>`+d.stages.map((s,i)=>stage(s,i,true)).join('')+(d.codeMain?`<section class="print-page"><h2>${u('completeGame')}</h2><p>${u('fullNote')}</p>${code(d.codeMain)}</section>`:'');
    if(printMode==='challenges')body=d.challenges.map(c=>challenge(c,true)).join('')+`<section class="print-page"><h2>${u('self')}</h2>${rubric()}</section>`;
    if(printMode==='notebook')body=`<section class="print-book"><h1>${u('notebook')}</h1>${cards(Object.keys(d.cards))}</section>`;
    if(printMode==='teacher'){
      body=`<section class="print-page"><h1>${u('teacher')} · Year ${d.year} · Week ${d.week}</h1>${d.teacher.sections.map(s=>`<h2>${t(s.title)}</h2>${list(s.items)}`).join('')}</section>`;
      if(d.solutions.some(s=>s.code))body+=d.solutions.map(s=>`<section class="print-page"><h2>${t(s.title)}</h2>${s.code?code(s.code):`<p>${t(s.text)}</p>`}</section>`).join('');
      else body+=`<section class="print-page"><h2>${u('solutions')}</h2>${d.solutions.map(s=>`<h3>${t(s.title)}</h3><p>${t(s.text)}</p>`).join('')}</section>`;
    }
    document.getElementById('printout').innerHTML=body;
    for(const detail of document.querySelectorAll('#printout details'))detail.open=true;
  }
  function render(focus=false){
    document.documentElement.lang=lang;document.documentElement.dir=lang==='he'?'rtl':'ltr';
    document.title=`Year ${d.year} · Week ${d.week} · ${Array.isArray(d.title)?d.title[0]:d.title}`;
    let body='';
    if(view==='start')body=start();
    if(view==='build')body=`<header class="build-head"><h1>${t(d.title)}</h1>${launch()}</header><nav class="step-nav" aria-label="${u('steps')}">${d.stages.map((s,i)=>`<button class="button ${i===step?'active':''}" data-step="${i}" ${i===step?'aria-current="step"':''}>${i+1}. ${t(s.title)}</button>`).join('')}</nav>${stage(d.stages[step],step)}<div class="step-actions">${step?`<button class="button" data-step="${step-1}">${u('back')}</button>`:''}${step<d.stages.length-1?`<button class="button primary" data-step="${step+1}">${u('next')}</button>`:`<button class="button primary" data-view="challenges">${u('challenges')}</button>`}</div>`;
    if(view==='challenges')body=`<h1>${u('challenges')}</h1><p>${u('challengeIntro')}</p><a class="button" href="resources/challenges.pdf" target="_blank" rel="noopener">${u('challengePDF')}</a>${d.challenges.map(c=>challenge(c)).join('')}<section class="paper"><h2>${u('self')}</h2>${rubric()}</section>`;
    if(view==='notebook')body=`<section class="paper notebook"><h1>${u('notebook')}</h1><p>${u('bookIntro')}</p>${cards(Object.keys(d.cards))}</section>`;
    if(view==='exit')body=`<section class="paper"><h1>${u('exit')}</h1><p>${u('exitIntro')}</p>${list(d.exit,true)}<h2>${u('self')}</h2>${rubric()}</section>`;
    if(view==='teacher')body=teacher();
    app.innerHTML=`<header class="site-head"><a href="../">NTSOMNII · TECH FOR CHANGE</a><div><label>${u('language')} <select id="language">${langs.map(([id,name])=>`<option value="${id}" ${id===lang?'selected':''}>${name}</option>`).join('')}</select></label><button class="button" data-open-print>${u('print')}</button></div></header><main id="main" tabindex="-1"><p class="eyebrow">Year ${d.year} · Week ${d.week} · ${t(d.platform)}</p><nav class="tabs" aria-label="${u('sections')}">${['start','build','challenges','notebook','exit','teacher'].map(v=>`<button class="button ${v===view?'active':''}" data-view="${v}" ${v===view?'aria-current="page"':''}>${u(v)}</button>`).join('')}</nav>${body}<p id="status" role="status"></p></main><dialog id="print-dialog"><form method="dialog"><h2>${u('print')}</h2><label>${u('choosePrint')}<select id="print-mode">${['step','guide','challenges','notebook','teacher'].map(v=>`<option value="${v}" ${v===printMode?'selected':''}>${u(v)}</option>`).join('')}</select></label><p>${u('printHint')}</p><button class="button primary" type="button" data-print>${u('print')}</button><button class="button">${u('close')}</button></form></dialog><div id="printout"></div>`;
    if(focus)(view==='build'?document.getElementById('step-title'):document.getElementById('main')).focus();
  }
  app.addEventListener('click',async e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.view){view=b.dataset.view;render(true);}
    if(b.dataset.step!==undefined){step=Number(b.dataset.step);view='build';render(true);}
    if(b.hasAttribute('data-open-print'))document.getElementById('print-dialog').showModal();
    if(b.hasAttribute('data-print')){printMode=document.getElementById('print-mode').value;renderPrint();await Promise.allSettled([...document.querySelectorAll('#printout img')].map(x=>x.decode()));document.getElementById('print-dialog').close();window.print();}
    if(b.dataset.copy||b.dataset.solution!==undefined){const key=b.dataset.copy;const value=key==='diagram'?d.diagram:key?d.stages[step][key]:d.solutions[Number(b.dataset.solution)].code;try{await navigator.clipboard.writeText(value);document.getElementById('status').textContent=Array.isArray(d.ui.copied)?d.ui.copied[langs.findIndex(([id])=>id===lang)]:d.ui.copied;}catch{document.getElementById('status').textContent='Select the code and copy it.';}}
  });
  app.addEventListener('change',e=>{if(e.target.id==='language'){lang=e.target.value;try{localStorage.setItem('ntsomnii-language',lang);}catch{}render();}if(e.target.id==='print-mode')printMode=e.target.value;});
  // Browser QA can export exactly the same print view as the teacher's button.
  window.prepareLessonPrint=mode=>{printMode=mode;renderPrint();};
  render();
})();
