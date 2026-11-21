(() => {
  'use strict';

  const {lesson, ui, links} = window.FOCUSED_LESSON;
  const languages = [['en', 'English'], ['ru', 'Русский'], ['zh-Hans', '简体中文'], ['he', 'עברית']];
  const app = document.getElementById('app');
  let language = 'en';
  let notebookOpen = window.matchMedia('(min-width: 960px)').matches;
  let teacherOpen = false;
  const stageIndexes = {main: 0, extra: 0};
  try { language = localStorage.getItem('ntsomnii-language') || 'en'; } catch {}

  const stageLabels = {
    stage: ['Build step', 'Шаг сборки', '制作步骤', 'שלב בנייה'],
    previous: ['Previous step', 'Предыдущий шаг', '上一步', 'השלב הקודם'],
    next: ['Next step', 'Следующий шаг', '下一步', 'השלב הבא'],
    check: ['Run and check', 'Запусти и проверь', '运行并检查', 'הריצו ובדקו'],
    snippet: ['Code for this step', 'Код для этого шага', '本步骤代码', 'הקוד לשלב הזה'],
    teacher: ['Teacher', 'Учитель', '教师', 'מורה'],
    solution: ['Show worked program', 'Показать готовую программу', '显示完整示例', 'הציגו תוכנית לדוגמה'],
    hide: ['Close teacher guide', 'Закрыть руководство', '关闭教师指南', 'סגרו את מדריך המורה'],
    setup: ['Circuit and pin setup', 'Схема и настройка выводов', '电路和引脚设置', 'מעגל והגדרת פינים'],
    index: ['List position', 'Позиция в списке', '列表位置', 'מיקום ברשימה'],
    led: ['LED', 'Светодиод', 'LED', 'נורית'],
    digit: ['Player types', 'Игрок вводит', '玩家输入', 'השחקן מקליד'],
    red: ['Red', 'Красный', '红', 'אדום'],
    yellow: ['Yellow', 'Жёлтый', '黄', 'צהוב'],
    green: ['Green', 'Зелёный', '绿', 'ירוק']
  };

  function text(value) {
    return value[languages.findIndex(([code]) => code === language)] ?? value[0];
  }

  function escape(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  const translate = value => escape(text(value));
  const label = name => translate(ui[name]);
  const stageLabel = name => translate(stageLabels[name]);

  function currentTask() {
    const key = location.hash === '#challenge' ? 'extra' : 'main';
    const task = lesson[key];
    const index = stageIndexes[key];
    return {key, task, index, stage: task.stages?.[index]};
  }

  function notebook(challenge) {
    const examples = cards => `<dl class="command-list">${cards.map(({command, meaning, example}) => `
      <div class="command-card"><dt><code dir="ltr">${escape(command)}</code></dt>
      <dd><p>${translate(meaning)}</p><pre dir="ltr"><code>${escape(example)}</code></pre></dd></div>`).join('')}</dl>`;
    const {main, extra} = lesson.notebook;
    const cards = currentTask().stage?.notebook || (challenge && lesson.extra.notebook ? lesson.extra.notebook : main);
    return `<aside class="code-notebook" aria-labelledby="notebook-title">
      <details ${notebookOpen ? 'open' : ''}>
        <summary id="notebook-title">${label('notebook')}</summary>
        <div class="notebook-entries">${examples(cards)}
          ${challenge && extra.length && !currentTask().stage ? `<h2>${label('notebookExtra')}</h2>${examples(extra)}` : ''}
        </div>
      </details>
    </aside>`;
  }

  function picture(task) {
    const {file, caption} = task.figure;
    const url = `../../lesson-focus/diagrams/${escape(file)}`;
    return `<figure class="task-figure"><a href="${url}" target="_blank" rel="noopener"><img src="${url}" alt="${translate(caption)}"></a><figcaption>${translate(caption)}</figcaption></figure>`;
  }

  function signalSequence(task) {
    if (!task.signalSequence) return '';
    return `<ol class="signal-sequence">${task.signalSequence.map(({lights, label}) => `
      <li><span class="signal-lights" aria-hidden="true">${['red', 'yellow', 'green'].map(light =>
        `<span class="signal-light${lights.includes(light) ? ` ${light}` : ''}"></span>`).join('')}</span><span>${translate(label)}</span></li>`).join('')}</ol>`;
  }

  function steps(task) {
    return `<ol class="steps">${task.steps.map((step, index) =>
      `<li>${translate(step)}${task.notes?.[index] ? `<span class="step-note">${translate(task.notes[index])}</span>` : ''}</li>`).join('')}</ol>`;
  }

  function buildStage(task, index) {
    const stage = task.stages[index];
    return `<nav class="build-stages" aria-label="${stageLabel('stage')}">
      ${task.stages.map((item, number) => `<button class="btn${number === index ? ' primary' : ''}" type="button" data-stage="${number}" ${number === index ? 'aria-current="step"' : ''}>${number + 1}. ${translate(item.title)}</button>`).join('')}
      </nav>
      <section class="paper build-stage" aria-labelledby="build-title">
        <p class="stage-progress">${stageLabel('stage')} <bdi>${index + 1} / ${task.stages.length}</bdi></p>
        <h2 id="build-title" tabindex="-1">${translate(stage.title)}</h2>
        <p>${translate(stage.learn)}</p>
        ${stage.showMap ? ledMap() : ''}
        ${steps(stage)}
        ${stage.hint ? `<p class="step-note">${translate(stage.hint)}</p>` : ''}
        <p class="snippet-label">${stageLabel('snippet')}</p>
        <div class="codebox"><pre dir="ltr"><code>${escape(stage.snippet)}</code></pre></div>
        <button class="btn" type="button" data-copy="stage">${label('copy')}</button>
        <p class="check"><strong>${stageLabel('check')}</strong>${translate(stage.check)}</p>
        <div class="stage-controls">
          ${index > 0 ? `<button class="btn" type="button" data-stage="${index - 1}">${stageLabel('previous')}</button>` : ''}
          ${index < task.stages.length - 1 ? `<button class="btn primary" type="button" data-stage="${index + 1}">${stageLabel('next')}</button>` : `<a class="btn primary" href="${location.hash === '#challenge' ? '#main-task' : '#challenge'}">${label(location.hash === '#challenge' ? 'back' : 'extraLink')}</a>`}
        </div>
      </section>`;
  }

  function ledMap() {
    return `<table class="led-map"><thead><tr><th scope="col">${stageLabel('index')}</th><th scope="col">${stageLabel('led')}</th><th scope="col">${stageLabel('digit')}</th></tr></thead><tbody>
      ${[['red', 'GP15'], ['yellow', 'GP13'], ['green', 'GP14']].map(([colour, pin], index) => `<tr><th scope="row"><code>${index}</code></th><td>${stageLabel(colour)} <code>${pin}</code></td><td><code>${index + 1}</code></td></tr>`).join('')}
      </tbody></table>`;
  }

  function teacherPanel(challenge) {
    if (!teacherOpen || !lesson.teacher) return '';
    const code = challenge ? lesson.teacher.challengeCode : lesson.teacher.code;
    return `<section class="paper teacher-guide" aria-labelledby="teacher-title">
      <h2 id="teacher-title" tabindex="-1">${translate(lesson.teacher.title)}</h2>
      <p>${translate(lesson.teacher.guide)}</p>
      <details class="code-help"><summary>${stageLabel('solution')}</summary>
        <div class="codebox"><pre dir="ltr"><code>${escape(code)}</code></pre></div>
        <button class="btn" type="button" data-copy="teacher">${label('copy')}</button>
      </details>
      <button class="btn" type="button" data-teacher>${stageLabel('hide')}</button>
    </section>`;
  }

  function stagedTask(task, project) {
    return `<p>${translate(task.start)}</p>
      ${project ? `<a class="btn launch" href="${escape(project)}" target="_blank" rel="noopener">${translate(task.open)} ↗</a>` : ''}
      <details class="paper stage-setup">
        <summary>${stageLabel('setup')}</summary>
        ${circuitSetup(task)}
        ${picture(task)}
        ${starter(task)}
      </details>
      ${buildStage(task, currentTask().index)}`;
  }

  function codeHelp(task, copyKey = 'code') {
    return `<details class="code-help">
      <summary>${label('help')}</summary>
      <p>${translate(task.facts)}</p>
      <div class="codebox"><pre dir="ltr"><code>${escape(task.code)}</code></pre></div>
      <button class="btn" type="button" data-copy="${copyKey}">${label('copy')}</button>
    </details>`;
  }

  function optionalChallenge(task, key) {
    if (!task[key]) return '';
    const bonus = task[key];
    const className = key === 'bonus' ? 'score-challenge' : 'shuffle-challenge';
    const definitions = bonus.definitions || [];
    return `<details class="paper ${className}"><summary>${translate(bonus.title)}</summary>
      <p>${translate(bonus.start)}</p><p><strong>${label('learn')}</strong> ${translate(bonus.learn)}</p>
      ${steps(bonus)}
      ${definitions.length ? `<ul>${definitions.map(item => `<li><code dir="ltr">${escape(item.command)}</code>: ${translate(item.meaning)}</li>`).join('')}</ul>` : ''}
      ${codeHelp(bonus, key)}
      <p class="check"><strong>${label('show')}</strong> ${translate(bonus.done)}</p></details>`;
  }

  function starter(task) {
    if (!task.starter) return '';
    return `<details class="code-help"><summary>${label('starter')}</summary>
      <div class="codebox"><pre dir="ltr"><code>${escape(task.starter)}</code></pre></div>
      <button class="btn" type="button" data-copy="starter">${label('copy')}</button></details>`;
  }

  function circuitSetup(task) {
    if (!task.circuit) return '';
    return `<details class="code-help" ${task.circuit.open ? 'open' : ''}>
      <summary>${translate(task.circuit.label)}</summary>
      <p>${translate(task.circuit.instructions)}</p>
      <button class="btn" type="button" data-copy="diagram">${translate(task.circuit.copy)}</button>
      <span id="circuit-feedback" role="status"></span>
      <details class="code-help"><summary>${translate(task.circuit.show)}</summary>
        <div class="codebox"><pre dir="ltr"><code>${escape(task.circuit.json)}</code></pre></div>
      </details>
    </details>`;
  }

  function handout(task, title, name) {
    const link = task.project && links[task.project];
    const website = lesson.url;
    return `<section class="print-sheet">
      <p class="sheet-meta">Year ${lesson.year} · Lesson ${lesson.lesson} · ${translate(lesson.platform)} · ${label(name)}</p>
      <h1>${translate(title)}</h1>
      <p><strong>${label('learn')}</strong> ${translate(task.learn)}</p>
      <p>${translate(task.start)}</p>
      ${signalSequence(task)}
      ${task.printFigure === false ? '' : picture(task)}
      ${task.stages ? task.stages.map((stage, index) => `<section class="print-stage"><h2>${index + 1}. ${translate(stage.title)}</h2><p>${translate(stage.learn)}</p>${steps(stage)}<pre dir="ltr"><code>${escape(stage.snippet)}</code></pre><p><strong>${stageLabel('check')}</strong> ${translate(stage.check)}</p></section>`).join('') : `${steps(task)}<div class="print-help"><strong>${label('help')}</strong> ${translate(task.facts)}<pre dir="ltr"><code>${escape(task.code)}</code></pre></div>`}
      <p class="check"><strong>${label('show')}</strong> ${translate(task.done)}</p>
      <p class="sheet-links"><a href="${escape(website)}">${label(task.starter ? 'starterOnline' : 'online')}</a>${link ? ` · <a href="${escape(link)}">${translate(task.open)}</a>` : ''}<br>${escape(website)}</p>
    </section>`;
  }

  function render(focus = false) {
    const challenge = location.hash === '#challenge';
    const task = challenge ? lesson.extra : lesson.main;
    const heading = challenge ? task.title : lesson.title;
    const project = task.project ? links[task.project] : null;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.title = `Year ${lesson.year} · Lesson ${lesson.lesson} · ${text(lesson.title)}`;
    app.innerHTML = `
      <header class="top focus-header">
        <a class="brand" href="../">NTSOMNII · TECH FOR CHANGE</a>
        <div class="tools">${lesson.teacher ? `<button class="btn" type="button" data-teacher aria-pressed="${teacherOpen}">${stageLabel('teacher')}</button>` : ''}<button class="btn" type="button" data-print>${label('print')}</button>
        <label class="langlabel">Language<select id="language">${languages.map(([code, name]) =>
          `<option value="${code}"${code === language ? ' selected' : ''}>${name}</option>`).join('')}</select></label>
        </div>
      </header>
      <div class="lesson-layout">
      ${notebook(challenge)}
      <main class="focus-lesson" id="main" tabindex="-1">
        <p class="lesson-number">Year ${lesson.year} · Lesson ${lesson.lesson} · ${translate(lesson.platform)}</p>
        <nav class="task-nav" aria-label="Lesson tasks">
          <a class="btn ${challenge ? '' : 'primary'}" href="#main-task" ${challenge ? '' : 'aria-current="page"'}>${label('main')}</a>
          <a class="btn ${challenge ? 'primary' : ''}" href="#challenge" ${challenge ? 'aria-current="page"' : ''}>${label('challenge')}</a>
        </nav>
        <h1>${translate(heading)}</h1>
        <p class="lesson-learn"><strong>${label('learn')}</strong> ${translate(task.learn)}</p>
        ${task.stages ? stagedTask(task, project) : `<article class="paper task-card">
          <p>${translate(task.start)}</p>
          ${signalSequence(task)}
          ${project ? `<a class="btn primary launch" href="${escape(project)}" target="_blank" rel="noopener">${translate(task.open)} ↗</a>` : ''}
          ${circuitSetup(task)}
          ${picture(task)}
          ${steps(task)}
          ${starter(task)}
          ${codeHelp(task)}
          <p class="check"><strong>${label('show')}</strong> ${translate(task.done)}</p>
        </article>`}
        ${optionalChallenge(task, 'bonus')}${optionalChallenge(task, 'shuffle')}
        ${teacherPanel(challenge)}
        <a class="btn" href="${challenge ? '#main-task' : '#challenge'}">${label(challenge ? 'back' : 'extraLink')}</a>
        <p id="toast" role="status"></p>
      </main>
      </div>
      <div class="print-handout">${handout(lesson.main, lesson.title, 'main')}${handout(lesson.extra, lesson.extra.title, 'challenge')}${lesson.extra.bonus ? handout(lesson.extra.bonus, lesson.extra.bonus.title, 'scoreChallenge') : ''}${lesson.extra.shuffle ? handout(lesson.extra.shuffle, lesson.extra.shuffle.title, 'shuffleChallenge') : ''}</div>`;
    if (focus) document.getElementById('main').focus();
    app.querySelector('.code-notebook details').addEventListener('toggle', event => {
      notebookOpen = event.currentTarget.open;
    });

    app.querySelector('[data-print]').addEventListener('click', async () => {
      await Promise.allSettled([...app.querySelectorAll('.print-handout img')].map(img => img.decode()));
      window.print();
    });
    for (const button of app.querySelectorAll('[data-copy]')) button.addEventListener('click', async () => {
      const diagram = button.dataset.copy === 'diagram';
      const message = document.getElementById(diagram ? 'circuit-feedback' : 'toast');
      try {
        const source = button.dataset.copy;
        const code = source === 'stage' ? currentTask().stage.snippet
          : source === 'teacher' ? lesson.teacher[challenge ? 'challengeCode' : 'code']
          : diagram ? task.circuit.json
          : ['bonus', 'shuffle'].includes(source) ? task[source].code : task[source];
        await navigator.clipboard.writeText(code);
        message.textContent = diagram ? text(task.circuit.copied) : text(ui.copied);
      } catch {
        message.textContent = diagram ? text(task.circuit.copyFail) : text(ui.copyFail);
      }
    });
  }

  app.addEventListener('click', event => {
    const stageButton = event.target.closest('[data-stage]');
    if (stageButton) {
      const {key, task} = currentTask();
      const index = Number(stageButton.dataset.stage);
      if (!Number.isInteger(index) || index < 0 || index >= task.stages.length) return;
      stageIndexes[key] = index;
      render();
      document.getElementById('build-title').focus();
    }
    if (event.target.closest('[data-teacher]')) {
      teacherOpen = !teacherOpen;
      render();
      document.getElementById(teacherOpen ? 'teacher-title' : 'main').focus();
    }
  });

  app.addEventListener('change', event => {
    if (event.target.id !== 'language') return;
    language = event.target.value;
    try { localStorage.setItem('ntsomnii-language', language); } catch {}
    render();
    document.getElementById('language').focus();
  });

  if (!languages.some(([code]) => code === language)) language = 'en';
  window.addEventListener('hashchange', () => render(true));
  render();
})();
