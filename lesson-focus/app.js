(() => {
  'use strict';

  const {lesson, ui, links} = window.FOCUSED_LESSON;
  const languages = [['en', 'English'], ['ru', 'Русский'], ['zh-Hans', '简体中文'], ['he', 'עברית']];
  const app = document.getElementById('app');
  let language = 'en';
  let notebookOpen = window.matchMedia('(min-width: 960px)').matches;
  try { language = localStorage.getItem('ntsomnii-language') || 'en'; } catch {}

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

  function notebook(challenge) {
    const examples = cards => `<dl class="command-list">${cards.map(({command, meaning, example}) => `
      <div class="command-card"><dt><code dir="ltr">${escape(command)}</code></dt>
      <dd><p>${translate(meaning)}</p><pre dir="ltr"><code>${escape(example)}</code></pre></dd></div>`).join('')}</dl>`;
    const {main, extra} = lesson.notebook;
    const cards = challenge && lesson.extra.notebook ? lesson.extra.notebook : main;
    return `<aside class="code-notebook" aria-labelledby="notebook-title">
      <details ${notebookOpen ? 'open' : ''}>
        <summary id="notebook-title">${label('notebook')}</summary>
        <div class="notebook-entries">${examples(cards)}
          ${challenge && extra.length ? `<h2>${label('notebookExtra')}</h2>${examples(extra)}` : ''}
        </div>
      </details>
    </aside>`;
  }

  function picture(task) {
    const {file, caption} = task.figure;
    const url = `../../lesson-focus/diagrams/${escape(file)}`;
    return `<figure class="task-figure"><a href="${url}" target="_blank" rel="noopener"><img src="${url}" alt="${translate(caption)}"></a><figcaption>${translate(caption)}</figcaption></figure>`;
  }

  function steps(task) {
    return `<ol class="steps">${task.steps.map((step, index) =>
      `<li>${translate(step)}<span class="step-note">${translate(task.notes[index])}</span></li>`).join('')}</ol>`;
  }

  function codeHelp(task) {
    return `<details class="code-help">
      <summary>${label('help')}</summary>
      <p>${translate(task.facts)}</p>
      <div class="codebox"><pre dir="ltr"><code>${escape(task.code)}</code></pre></div>
      <button class="btn" type="button" data-copy="code">${label('copy')}</button>
    </details>`;
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
      <p class="sheet-meta">Year ${lesson.year} · Week ${lesson.lesson} · ${translate(lesson.platform)} · ${label(name)}</p>
      <h1>${translate(title)}</h1>
      <p><strong>${label('learn')}</strong> ${translate(task.learn)}</p>
      <p>${translate(task.start)}</p>
      ${picture(task)}
      ${steps(task)}
      <div class="print-help"><strong>${label('help')}</strong> ${translate(task.facts)}<pre dir="ltr"><code>${escape(task.code)}</code></pre></div>
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
    document.title = `Year ${lesson.year} · Week ${lesson.lesson} · ${text(lesson.title)}`;
    app.innerHTML = `
      <header class="top focus-header">
        <a class="brand" href="../">NTSOMNII · TECH FOR CHANGE</a>
        <div class="tools"><button class="btn" type="button" data-print>${label('print')}</button>
        <label class="langlabel">Language<select id="language">${languages.map(([code, name]) =>
          `<option value="${code}"${code === language ? ' selected' : ''}>${name}</option>`).join('')}</select></label>
        </div>
      </header>
      <div class="lesson-layout">
      ${notebook(challenge)}
      <main class="focus-lesson" id="main" tabindex="-1">
        <p class="lesson-number">Year ${lesson.year} · Week ${lesson.lesson} · ${translate(lesson.platform)}</p>
        <nav class="task-nav" aria-label="Lesson tasks">
          <a class="btn ${challenge ? '' : 'primary'}" href="#main-task" ${challenge ? '' : 'aria-current="page"'}>${label('main')}</a>
          <a class="btn ${challenge ? 'primary' : ''}" href="#challenge" ${challenge ? 'aria-current="page"' : ''}>${label('challenge')}</a>
        </nav>
        <h1>${translate(heading)}</h1>
        <p class="lesson-learn"><strong>${label('learn')}</strong> ${translate(task.learn)}</p>
        <article class="paper task-card">
          <p>${translate(task.start)}</p>
          ${project ? `<a class="btn primary launch" href="${escape(project)}" target="_blank" rel="noopener">${translate(task.open)} ↗</a>` : ''}
          ${circuitSetup(task)}
          ${picture(task)}
          ${steps(task)}
          ${starter(task)}
          ${codeHelp(task)}
          <p class="check"><strong>${label('show')}</strong> ${translate(task.done)}</p>
        </article>
        <a class="btn" href="${challenge ? '#main-task' : '#challenge'}">${label(challenge ? 'back' : 'extraLink')}</a>
        <p id="toast" role="status"></p>
      </main>
      </div>
      <div class="print-handout">${handout(lesson.main, lesson.title, 'main')}${handout(lesson.extra, lesson.extra.title, 'challenge')}</div>`;
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
        await navigator.clipboard.writeText(diagram ? task.circuit.json : task[button.dataset.copy]);
        message.textContent = diagram ? text(task.circuit.copied) : text(ui.copied);
      } catch {
        message.textContent = diagram ? text(task.circuit.copyFail) : text(ui.copyFail);
      }
    });
  }

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
