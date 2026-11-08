(() => {
  'use strict';
  const H = window.CrossingUI;
  const {esc,t,u,button,list} = H;
  const year = Number(document.body.dataset.year), D = window.CROSSING_LESSONS[year];
  const LAB = '../../crossing-lab';
  const key = `ntsomnii-y${year}-w7-crossing-v1`;
  const initial = {tab:0,step:0,phase:'learn',checks:[false,false,false,false],tests:[false,false,false],observations:['','',''],solution:'',change:'',exit:['',''],big:false};
  const S = H.read(key, initial);
  if (![0,1,2,4,5].includes(S.tab)) S.tab = 0;
  if (!Number.isInteger(S.step) || S.step < 0 || S.step > 3) S.step = 0;
  for (const field of ['checks','tests','observations','exit']) if (!Array.isArray(S[field]) || S[field].length !== initial[field].length) S[field] = [...initial[field]];
  let teacher = false, teacherData = null, loadingTeacher = false;
  const save = () => H.save(key,S);
  const notes = items => items.map(n => `<section class="command-note"><pre class="snippet" dir="ltr"><code>${esc(n.code)}</code></pre><p>${t(n.text)}</p></section>`).join('');
  const field = (label,name,value,extra='') => `<label class="field">${esc(label)}<textarea data-field="${name}" ${extra}>${esc(value)}</textarea></label>`;
  const starter = () => `<a class="btn" download href="${LAB}/resources/year-${year}/student-starter.zip">${esc(u('starter'))} ↓</a>`;
  const simulator = () => `<a class="btn" target="_blank" rel="noopener" href="https://wokwi.com/projects/new/${year===7?'arduino-uno':'micropython-pi-pico'}">${esc(u('simulator'))}</a>`;
  function wiring() {
    const pins = year===7 ? [8,9,10,6,7,2] : [15,16,17,18,19,20];
    const labels = ['carRed','carAmber','carGreen','pedRed','pedGreen','button'];
    return `<table class="pin-table"><thead><tr><th>${esc(u('output'))}</th><th>${esc(u('pin'))}</th></tr></thead><tbody>${labels.map((name,i) => `<tr><td>${esc(u(name))}</td><td dir="ltr">${year===8?'GP':''}${pins[i]}${i===5?' ↔ GND':''}</td></tr>`).join('')}</tbody></table><div class="wire-path">${esc(u('ledWire'))}</div><p>${esc(u('buttonWire'))}</p>${year===8?`<p class="small">${esc(u('gpio'))}</p>`:''}`;
  }
  function setup() {
    return `<details class="setup-help"><summary>${esc(u('setup'))}</summary><p class="starter-note"><strong>${esc(u('keepCode'))}</strong></p><div class="actions">${starter()+simulator()}</div><p>${esc(u(year===7?'arduinoFiles':'picoFiles'))}</p>${year===7?`<p>${esc(u('arduinoUpload'))}</p>`:''}<p>${esc(u('upload'))}</p><p class="small">${esc(u('physical'))}</p>${wiring()}</details>`;
  }
  function sequence() {
    return `<details class="sequence-help"><summary>${esc(u('sequence'))}</summary><p>${esc(u('normal'))}</p><p>${esc(u('request'))}</p><ol class="signal-sequence"><li>${esc(u('allRed'))}</li><li>${esc(u('walk'))}</li><li>${esc(u('resume'))}</li></ol>${year===8?`<p class="small">${esc(u('picoRounds'))}</p>`:''}</details>`;
  }
  function home() {
    return `<div class="lesson-cover"><div><p class="eyebrow">${esc(u('lesson'))} ${D.lesson}</p><h1>${t(D.title)}</h1><p class="platform">${year===7?'Arduino IDE · C++ · Arduino Uno':'Python · MicroPython · Raspberry Pi Pico'}</p><p class="lead">${t(D.intro)}</p></div>${H.photo(year)}</div><article class="paper"><h2>${esc(u('goals'))}</h2>${list(D.goals)}<div class="actions">${button(u('begin'),'begin',true)}${button(u('project'),'challenge')}</div></article><div class="path">${D.stages.map((s,i)=>`<button data-step="${i}"><span>${i+1}</span>${t(s.title)}</button>`).join('')}</div>`;
  }
  function guide() {
    const s = D.stages[S.step];
    return `<p class="eyebrow">${esc(u('part'))} ${S.step+1} / 4</p><h1>${t(s.title)}</h1><label class="selectstep">${t(window.CROSSING_UI.tabs[1])}<select id="step">${D.stages.map((x,i)=>`<option value="${i}" ${S.step===i?'selected':''}>${i+1}. ${t(x.title)}</option>`).join('')}</select></label><div class="phase">${button(u('learn'),'learn',S.phase==='learn',`aria-pressed="${S.phase==='learn'}"`)}${button(u('try'),'try',S.phase==='try',`aria-pressed="${S.phase==='try'}"`)}</div><article class="paper guidecard">${S.phase==='learn'?`${notes(s.learn)}<div class="actions">${button(u('try')+' →','try',true)}</div>`:`<ol class="steps">${s.steps.map(x=>`<li>${t(x)}</li>`).join('')}</ol>${S.step===1?setup():''}${S.step===3?sequence():''}<aside class="check"><h3>${esc(u('expected'))}</h3><p>${t(s.result)}</p><label class="checklabel"><input id="checked" type="checkbox" ${S.checks[S.step]?'checked':''}>${esc(u('check'))}</label></aside><details><summary>${esc(u('help'))}</summary><p>${t(s.hint)}</p>${notes(s.learn)}</details><div class="actions">${S.step?button(u('back'),'previous'):''}${button(u('next')+' →',S.step<3?'next':'challenge',true)}</div>`}</article>`;
  }
  function challenge() {
    return `<p class="eyebrow">${t(window.CROSSING_UI.tabs[2])}</p><h1>${t(D.project.title)}</h1><article class="paper brief"><p class="lead">${t(D.project.brief)}</p>${list(D.project.requirements)}${setup()}${sequence()}<div class="actions">${button(t(D.stages[1].title),'connections',true)}</div></article><details class="paper tests" open><summary>${esc(u('tests'))}</summary>${D.project.tests.map((x,i)=>`<fieldset><legend>${i+1}. ${t(x)}</legend><label class="test-check"><input type="checkbox" data-test="${i}" ${S.tests[i]?'checked':''}>${esc(u('check'))}</label>${field(u('observation'),'observation',S.observations[i],`data-index="${i}"`)}</fieldset>`).join('')}</details><details class="paper evidence"><summary>${esc(u('evidence'))}</summary>${field(u('solution'),'solution',S.solution,'dir="ltr" class="solution"')}${field(u('change'),'change',S.change)}</details><div class="actions">${button(u('download'),'download',true)}${button(t(window.CROSSING_UI.tabs[5]),'exit')}</div>`;
  }
  function reference() {
    return `<h1>${t(window.CROSSING_UI.tabs[4])}</h1><article class="paper">${setup()}${sequence()}</article>${D.stages.map(s=>`<details class="paper reference"><summary>${t(s.title)}</summary>${notes(s.learn)}</details>`).join('')}`;
  }
  function exit() {
    return `<h1>${t(window.CROSSING_UI.tabs[5])}</h1><article class="paper">${D.exit.map((x,i)=>field(H.text(x),'exit',S.exit[i],`data-index="${i}"`)).join('')}<div class="actions">${button(u('download'),'download',true)}</div></article><p class="small">${esc(u('nextWeek'))}</p>`;
  }
  function currentTeacher() {
    const d = teacherData?.[year];
    if (!d) return null;
    if (S.tab===1) return d.stages[S.step];
    if (S.tab===2) return d.project;
    if (S.tab===4) return d.stages[2];
    if (S.tab===5) return d.stages[3];
    return d.overview;
  }
  async function toggleTeacher() {
    if (teacher) { teacher=false; render(true); return; }
    if (loadingTeacher) return;
    if (!teacherData) {
      loadingTeacher=true;
      try {
        const response=await fetch(`${LAB}/teacher-guide.json?v=1`);
        if (!response.ok) throw Error('unavailable');
        const data=await response.json();
        if (!Array.isArray(data[year]?.stages)) throw Error('invalid');
        teacherData=data;
      } catch { H.toast(u('teacherFailed')); return; }
      finally { loadingTeacher=false; }
    }
    teacher=true; render(true);
    document.querySelector('.teacher-panel')?.scrollIntoView({block:'nearest'});
  }
  function render(focus=false) {
    H.documentLanguage(); document.body.classList.toggle('large',S.big);
    document.title=H.text(D.title)+' · Year '+year+' · Lesson '+D.lesson+' · NTSOMNII';
    let visibleIndex=0;
    const nav=window.CROSSING_UI.tabs.map((x,i)=>i===3?'':`<button class="nav ${S.tab===i?'active':''}" data-tab="${i}" ${S.tab===i?'aria-current="page"':''}><span>0${++visibleIndex}</span>${t(x)}</button>`).join('');
    document.getElementById('app').innerHTML=H.header({year,teacher,big:S.big})+`<div class="shell"><aside><nav aria-label="Lesson">${nav}</nav><a class="scope-home" href="../">← ${esc(u('lessons'))} · Year ${year}</a><details class="help"><summary>${esc(u('starter'))}</summary><a download href="${LAB}/resources/year-${year}/student-starter.zip">${esc(u('starter'))} ↓</a></details></aside><main id="main" tabindex="-1">${S.tab===0?home():S.tab===1?guide():S.tab===2?challenge():S.tab===4?reference():exit()}${teacher?H.teacherPanel(currentTeacher()):''}${H.footer()}</main></div><p id="toast" role="status"></p>`;
    save(); if(focus) document.getElementById('main').focus();
  }
  function download() {
    const lines=[`NTSOMNII · Year ${year} · ${u('lesson')} ${D.lesson}`,H.text(D.title)];
    D.stages.forEach((s,i)=>lines.push(`${i+1}. ${H.text(s.title)}: ${S.checks[i]?'✓':'—'}`));
    D.project.tests.forEach((x,i)=>lines.push('\n'+H.text(x),S.tests[i]?'✓':'—',S.observations[i]));
    lines.push('\n'+u('solution'),S.solution,u('change'),S.change);
    D.exit.forEach((x,i)=>lines.push('\n'+H.text(x),S.exit[i]));
    H.download(`Year-${year}-Lesson-${D.lesson}-my-crossing.txt`,lines.join('\n'));
  }
  document.addEventListener('click',async event=>{
    const el=event.target.closest('button'); if(!el) return;
    if(el.dataset.tab!==undefined){S.tab=Number(el.dataset.tab);render(true);return;}
    if(el.dataset.step!==undefined){S.tab=1;S.step=Number(el.dataset.step);S.phase='learn';render(true);return;}
    const action=el.dataset.action;
    if(action==='teacher'){await toggleTeacher();return;}
    if(action==='copy-teacher'){if(teacher)await H.copy(currentTeacher()?.code||'');return;}
    if(action==='download'){download();return;}
    if(action==='begin'){S.tab=1;S.step=0;S.phase='learn';}
    if(action==='challenge')S.tab=2;
    if(action==='connections'){S.tab=1;S.step=1;S.phase='try';}
    if(action==='learn'||action==='try')S.phase=action;
    if(action==='next'){S.step=Math.min(3,S.step+1);S.phase='learn';}
    if(action==='previous'){S.step=Math.max(0,S.step-1);S.phase='learn';}
    if(action==='exit')S.tab=5;
    if(action==='big')S.big=!S.big;
    if(action)render(true);
  });
  document.addEventListener('change',event=>{
    const el=event.target;
    if(el.id==='language'){H.setLang(el.value);render();}
    if(el.id==='step'){S.step=Number(el.value);S.phase='learn';render();}
    if(el.id==='checked'){S.checks[S.step]=el.checked;save();}
    if(el.dataset.test!==undefined){S.tests[Number(el.dataset.test)]=el.checked;save();}
  });
  document.addEventListener('input',event=>{
    const el=event.target,field=el.dataset.field;if(!field)return;
    if(field==='observation')S.observations[Number(el.dataset.index)]=el.value;
    else if(field==='exit')S.exit[Number(el.dataset.index)]=el.value;
    else if(field==='solution'||field==='change')S[field]=el.value;
    save();
  });
  render();
})();
