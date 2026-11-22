(() => {
  'use strict';

  const lesson = window.GAME_LESSON;
  const app = document.getElementById('app');
  const languages = [['en', 'English'], ['ru', 'Русский'], ['zh-Hans', '简体中文'], ['he', 'עברית']];
  const words = {
    lesson: ['Lesson', 'Урок', '课程', 'שיעור'],
    pin: ['Teacher code', 'Код учителя', '教师代码', 'קוד מורה'],
    unlock: ['Unlock', 'Открыть', '解锁', 'פתיחה'],
    lock: ['Lock teacher view', 'Закрыть доступ учителя', '锁定教师页面', 'נעלו תצוגת מורה'],
    locked: ['Enter the teacher code to open the worked examples.', 'Введи код учителя, чтобы открыть готовые примеры.', '输入教师代码，查看参考示例。', 'הזינו קוד מורה כדי לפתוח את הדוגמאות.'],
    wrong: ['Check the teacher code and try again.', 'Проверь код учителя и попробуй снова.', '请检查教师代码，再试一次。', 'בדקו את קוד המורה ונסו שוב.'],
    opening: ['Opening…', 'Открываем…', '正在打开…', 'פותח…'],
    finish: ['Check your work', 'Проверь работу', '检查作品', 'בדקו את העבודה'],
    references: ['References', 'Источники', '参考资料', 'מקורות'],
    starter: ['Starter code', 'Стартовый код', '起始代码', 'קוד התחלה'],
    copyFail: ['Select the code and copy it.', 'Выдели код и скопируй.', '选中代码并复制。', 'סמנו את הקוד והעתיקו אותו.']
  };

  let language = 'en';
  let step = 0;
  let view = 'start';
  let printMode = 'guide';
  let teacherContent = lesson.teacherEncrypted ? null : {teacher: lesson.teacher, solutions: lesson.solutions};
  try { language = localStorage.getItem('ntsomnii-language') || 'en'; } catch {}
  if (!languages.some(([id]) => id === language)) language = 'en';

  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const text = value => Array.isArray(value) ? value[languages.findIndex(([id]) => id === language)] || value[0] : value;
  const translate = value => escape(text(value));
  const label = key => translate(lesson.ui[key]);
  const word = key => translate(words[key]);
  const code = value => `<pre dir="ltr"><code>${escape(value)}</code></pre>`;
  const hasChallenges = () => Boolean(lesson.challenges?.length);
  const list = (items = [], ordered = false) => `<${ordered ? 'ol' : 'ul'}>${items.map(item => `<li>${translate(item)}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>`;

  function picture(file, caption) {
    return file ? `<figure><a href="${escape(file)}" target="_blank" rel="noopener"><img src="${escape(file)}" alt="${translate(caption)}"></a><figcaption>${translate(caption)}</figcaption></figure>` : '';
  }

  function cards(ids) {
    return ids.filter(id => lesson.cards[id]).map(id => {
      const card = lesson.cards[id];
      return `<section class="concept"><h3>${translate(card.title)}</h3><p>${translate(card.meaning)}</p>${card.example ? code(card.example) : ''}</section>`;
    }).join('');
  }

  function notebook() {
    let ids = lesson.stages[step].concepts;
    if (view === 'challenges') ids = [...new Set(lesson.challenges.flatMap(challenge => challenge.concepts || []))];
    if (view === 'start') ids = lesson.notebookStart || lesson.stages[0].concepts;
    return `<aside class="lesson-notebook" aria-labelledby="notebook-title"><h2 id="notebook-title">${label('notebook')}</h2><div class="notebook-cards">${cards(ids)}</div></aside>`;
  }

  function launch() {
    return `<a class="button primary" href="${escape(lesson.launch.url)}" target="_blank" rel="noopener">${translate(lesson.launch.label)} ↗</a>`;
  }

  function rubric() {
    if (!lesson.rubric?.length) return '';
    return `<table><thead><tr><th>${label('level')}</th><th>${label('evidence')}</th></tr></thead><tbody>${lesson.rubric.map(row => `<tr><th>${translate(row[0])}</th><td>${translate(row[1])}</td></tr>`).join('')}</tbody></table>`;
  }

  function stage(item, index, printing = false) {
    return `<section class="${printing ? 'print-page' : 'stage'}">
      <p class="eyebrow">${label('step')} ${index + 1} / ${lesson.stages.length}</p>
      <h2 tabindex="-1" id="${printing ? `print-step-${index}` : 'step-title'}">${translate(item.title)}</h2>
      <p class="purpose">${translate(item.learn)}</p>
      ${printing ? `<div class="print-notes">${cards(item.concepts)}</div>` : ''}
      <article>${list(printing ? item.printTasks || item.tasks : item.tasks, true)}
        ${printing && item.printFigure === false ? '' : picture(item.figure, item.caption || item.title)}
        ${item.table ? `<div class="table-scroll"><table><thead><tr>${item.table.headers.map(heading => `<th>${translate(heading)}</th>`).join('')}</tr></thead><tbody>${item.table.rows.map(row => `<tr>${row.map(cell => `<td dir="auto">${translate(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}
        ${item.snippet ? `<p class="placement">${translate(item.place)}</p>${code(item.snippet)}${printing || item.exampleOnly ? '' : `<button class="button" data-copy="snippet">${label('copy')}</button>`}` : ''}
        ${item.full && !lesson.teacherEncrypted && !printing ? `<details><summary>${label('full')}</summary>${code(item.full)}<button class="button" data-copy="full">${label('copy')}</button></details>` : ''}
        <div class="check"><strong>${label('check')}</strong><p>${translate(item.check)}</p></div>
        ${item.hint && !printing ? `<details><summary>${label('stuck')}</summary><p>${translate(item.hint)}</p></details>` : ''}
      </article>
    </section>`;
  }

  function challenge(item, printing = false) {
    return `<section class="${printing ? 'print-page' : 'paper'}"><h2>${translate(item.title)}</h2><p>${translate(item.problem)}</p>${list(item.tasks, true)}${list(item.success)}${item.hint ? `<details><summary>${label('hint')}</summary><p>${translate(item.hint)}</p></details>` : ''}</section>`;
  }

  function start() {
    return `<section class="paper"><h1>${translate(lesson.title)}</h1><p class="lead">${translate(lesson.brief)}</p>
      ${lesson.objectives?.length ? `<h2>${label('intent')}</h2>${list(lesson.objectives)}` : ''}
      <div class="launch-links">${launch()}<a class="button" href="resources/student-guide.pdf?v=20261122-clear" target="_blank" rel="noopener">${label('offline')}</a></div>
      ${picture(lesson.figure, lesson.figureCaption)}
      <h2>${label('setup')}</h2>${list(lesson.setup, true)}
      ${lesson.diagram ? `<details class="wiring-panel" open><summary>${label('wiring')}</summary><button class="button" data-copy="diagram">${label('copyWiring')}</button><details><summary>diagram.json</summary>${code(lesson.diagram)}</details></details>` : ''}
      ${lesson.starter ? `<details class="starter-panel" open><summary>${word('starter')}</summary>${code(lesson.starter)}<button class="button" data-copy="starter">${label('copy')}</button></details>` : ''}
      <button class="button primary" data-view="build">${label('begin')}</button>
    </section>`;
  }

  function teacher() {
    if (!teacherContent) {
      return `<section class="paper"><h1>${label('teacher')}</h1><p>${word('locked')}</p>
        <form id="teacher-unlock"><label for="teacher-pin">${word('pin')}</label><input id="teacher-pin" type="password" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="off" required>
          <button class="button primary" type="submit">${word('unlock')}</button><p id="teacher-message" role="status"></p>
        </form></section>`;
    }
    return `<section class="paper"><div class="teacher-heading"><h1>${label('teacher')}</h1>${lesson.teacherEncrypted ? `<button class="button" data-lock>${word('lock')}</button>` : ''}</div>
      ${teacherContent.teacher.sections.map(section => `<h2>${translate(section.title)}</h2>${list(section.items)}`).join('')}
      <h2>${label('solutions')}</h2>${teacherContent.solutions.map((solution, index) => `<details><summary>${translate(solution.title)}</summary>${solution.code ? `${code(solution.code)}<button class="button" data-solution="${index}">${label('copy')}</button>` : `<p>${translate(solution.text)}</p>`}</details>`).join('')}
      <h2>${word('references')}</h2><ul>${lesson.sources.map(source => `<li><a href="${escape(source.url)}" target="_blank" rel="noopener">${escape(source.title)}</a></li>`).join('')}</ul>
    </section>`;
  }

  function printChoices() {
    return ['step', 'guide', ...(hasChallenges() ? ['challenges'] : []), 'notebook', ...(teacherContent ? ['teacher'] : [])];
  }

  function renderPrint() {
    if (!printChoices().includes(printMode)) {
      document.getElementById('printout').innerHTML = '';
      return false;
    }
    let body = '';
    if (printMode === 'step') body = stage(lesson.stages[step], step, true);
    if (printMode === 'guide') {
      body = `<section class="print-page"><p class="eyebrow">Year ${lesson.year} · ${word('lesson')} ${lesson.week}</p><h1>${translate(lesson.title)}</h1><p>${translate(lesson.brief)}</p>${list(lesson.objectives)}${picture(lesson.figure, lesson.figureCaption)}<h2>${label('setup')}</h2>${list(lesson.setup, true)}${lesson.starter ? code(lesson.starter) : ''}<p>${escape(lesson.url)}</p></section>`;
      body += lesson.stages.map((item, index) => stage(item, index, true)).join('');
    }
    if (printMode === 'challenges') body = lesson.challenges.map(item => challenge(item, true)).join('');
    if (printMode === 'notebook') body = `<section class="print-book"><h1>${label('notebook')}</h1>${cards(Object.keys(lesson.cards))}</section>`;
    if (printMode === 'teacher' && teacherContent) {
      body = `<section class="print-page"><h1>${label('teacher')}</h1>${teacherContent.teacher.sections.map(section => `<h2>${translate(section.title)}</h2>${list(section.items)}`).join('')}</section>`;
      body += teacherContent.solutions.map(solution => `<section class="print-page"><h2>${translate(solution.title)}</h2>${solution.code ? code(solution.code) : `<p>${translate(solution.text)}</p>`}</section>`).join('');
    }
    document.getElementById('printout').innerHTML = body;
    for (const detail of document.querySelectorAll('#printout details')) detail.open = true;
    return true;
  }

  function render(focus = false) {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.title = `Year ${lesson.year} · Lesson ${lesson.week} · ${text(lesson.title)}`;
    const tabs = ['start', 'build', ...(hasChallenges() ? ['challenges'] : []), 'teacher'];
    let body = '';
    if (view === 'start') body = start();
    if (view === 'build') {
      body = `<header class="build-head"><h1>${translate(lesson.title)}</h1></header>
        <nav class="step-nav" aria-label="${label('steps')}">${lesson.stages.map((item, index) => `<button class="button ${index === step ? 'active' : ''}" data-step="${index}" ${index === step ? 'aria-current="step"' : ''}>${index + 1}. ${translate(item.title)}</button>`).join('')}</nav>
        ${stage(lesson.stages[step], step)}
        <div class="step-actions">${step ? `<button class="button" data-step="${step - 1}">${label('back')}</button>` : ''}${step < lesson.stages.length - 1 ? `<button class="button primary" data-step="${step + 1}">${label('next')}</button>` : `<button class="button primary" data-view="${hasChallenges() ? 'challenges' : 'exit'}">${hasChallenges() ? label('challenges') : word('finish')}</button>`}</div>`;
    }
    if (view === 'challenges') body = `<h1>${label('challenges')}</h1><a class="button" href="resources/challenges.pdf?v=20261122-clear" target="_blank" rel="noopener">${label('challengePDF')}</a>${lesson.challenges.map(item => challenge(item)).join('')}`;
    if (view === 'notebook') body = `<section class="paper"><h1>${label('notebook')}</h1>${cards(Object.keys(lesson.cards))}</section>`;
    if (view === 'exit') body = `<section class="paper"><h1>${word('finish')}</h1>${list(lesson.exit, true)}${rubric()}</section>`;
    if (view === 'teacher') body = teacher();

    app.innerHTML = `<header class="site-head"><a href="../">NTSOMNII · TECH FOR CHANGE</a><div><label>${label('language')} <select id="language">${languages.map(([id, name]) => `<option value="${id}" ${id === language ? 'selected' : ''}>${name}</option>`).join('')}</select></label><button class="button" data-open-print>${label('print')}</button></div></header>
      <div class="lesson-shell"><p class="eyebrow">Year ${lesson.year} · ${word('lesson')} ${lesson.week} · ${translate(lesson.platform)}</p>
      <nav class="tabs" aria-label="${label('sections')}">${tabs.map(tab => `<button class="button ${tab === view ? 'active' : ''}" data-view="${tab}" ${tab === view ? 'aria-current="page"' : ''}>${label(tab)}</button>`).join('')}</nav>
      <div class="lesson-layout"><main id="main" class="lesson-content" tabindex="-1">${body}<p id="status" role="status"></p></main>${notebook()}</div></div>
      <dialog id="print-dialog"><form method="dialog"><h2>${label('print')}</h2><label>${label('choosePrint')}<select id="print-mode">${printChoices().map(mode => `<option value="${mode}" ${mode === printMode ? 'selected' : ''}>${label(mode)}</option>`).join('')}</select></label><button class="button primary" type="button" data-print>${label('print')}</button><button class="button">${label('close')}</button></form></dialog>
      <div id="printout"></div>`;
    if (focus) (view === 'build' ? document.getElementById('step-title') : document.getElementById('main')).focus();
  }

  async function unlock(pin) {
    const decode = value => Uint8Array.from(atob(value), character => character.charCodeAt(0));
    const encrypted = lesson.teacherEncrypted;
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({name: 'PBKDF2', salt: decode(encrypted.salt), iterations: encrypted.iterations, hash: 'SHA-256'}, material, {name: 'AES-GCM', length: 256}, false, ['decrypt']);
    const bytes = await crypto.subtle.decrypt({name: 'AES-GCM', iv: decode(encrypted.iv)}, key, decode(encrypted.data));
    teacherContent = JSON.parse(new TextDecoder().decode(bytes));
  }

  app.addEventListener('submit', async event => {
    if (event.target.id !== 'teacher-unlock') return;
    event.preventDefault();
    const button = event.target.querySelector('button');
    const message = document.getElementById('teacher-message');
    button.disabled = true;
    message.textContent = text(words.opening);
    try {
      await unlock(document.getElementById('teacher-pin').value);
      render(true);
    } catch {
      message.textContent = text(words.wrong);
      button.disabled = false;
      document.getElementById('teacher-pin')?.select();
    }
  });

  app.addEventListener('click', async event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.view) { view = button.dataset.view; render(true); }
    if (button.dataset.step !== undefined) { step = Number(button.dataset.step); view = 'build'; render(true); }
    if (button.hasAttribute('data-lock')) { teacherContent = null; printMode = 'guide'; render(true); }
    if (button.hasAttribute('data-open-print')) document.getElementById('print-dialog').showModal();
    if (button.hasAttribute('data-print')) {
      printMode = document.getElementById('print-mode').value;
      if (!renderPrint()) return;
      await Promise.allSettled([...document.querySelectorAll('#printout img')].map(img => img.decode()));
      document.getElementById('print-dialog').close();
      window.print();
    }
    if (button.dataset.copy || button.dataset.solution !== undefined) {
      const source = button.dataset.copy;
      const value = source === 'diagram' ? lesson.diagram : source === 'starter' ? lesson.starter
        : source ? lesson.stages[step][source] : teacherContent?.solutions[Number(button.dataset.solution)].code;
      if (!value) return;
      try { await navigator.clipboard.writeText(value); document.getElementById('status').textContent = text(lesson.ui.copied); }
      catch { document.getElementById('status').textContent = text(words.copyFail); }
    }
  });

  app.addEventListener('change', event => {
    if (event.target.id === 'language') {
      language = event.target.value;
      try { localStorage.setItem('ntsomnii-language', language); } catch {}
      render();
    }
    if (event.target.id === 'print-mode') printMode = event.target.value;
  });

  window.prepareLessonPrint = mode => { printMode = mode; return renderPrint(); };
  render();
})();
