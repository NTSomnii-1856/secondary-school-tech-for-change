(() => {
  'use strict';

  const {lesson, ui, links} = window.FOCUSED_LESSON;
  const languages = [['en', 'English'], ['ru', 'Русский'], ['zh-Hans', '简体中文'], ['he', 'עברית']];
  const app = document.getElementById('app');
  let language = 'en';
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

  function codeHelp(task) {
    return `<details class="code-help">
      <summary>${label('help')}</summary>
      <p>${translate(task.facts)}</p>
      <div class="codebox"><pre dir="ltr"><code>${escape(task.code)}</code></pre></div>
      <button class="btn" type="button" data-copy>${label('copy')}</button>
    </details>`;
  }

  function render(focus = false) {
    const challenge = location.hash === '#challenge';
    const task = challenge ? lesson.extra : lesson.main;
    const heading = challenge ? task.title : lesson.title;
    const project = task.project ? links[task.project] : null;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.title = `${text(heading)} · Year ${lesson.year} · Lesson ${lesson.lesson}`;
    app.innerHTML = `
      <header class="top focus-header">
        <a class="brand" href="../">NTSOMNII · TECH FOR CHANGE</a>
        <label class="langlabel">Language<select id="language">${languages.map(([code, name]) =>
          `<option value="${code}"${code === language ? ' selected' : ''}>${name}</option>`).join('')}</select></label>
      </header>
      <main class="focus-lesson" id="main" tabindex="-1">
        <p class="lesson-number">Year ${lesson.year} · Lesson ${lesson.lesson}</p>
        <nav class="task-nav" aria-label="Lesson tasks">
          <a class="btn ${challenge ? '' : 'primary'}" href="#main-task" ${challenge ? '' : 'aria-current="page"'}>${label('main')}</a>
          <a class="btn ${challenge ? 'primary' : ''}" href="#challenge" ${challenge ? 'aria-current="page"' : ''}>${label('challenge')}</a>
        </nav>
        <h1>${translate(heading)}</h1>
        <p class="lesson-learn"><strong>${label('learn')}</strong> ${translate(task.learn)}</p>
        <article class="paper task-card">
          <p>${translate(task.start)}</p>
          ${project ? `<a class="btn primary launch" href="${escape(project)}" target="_blank" rel="noopener">${translate(task.open)} ↗</a>` : ''}
          <ol class="steps">${task.steps.map(step => `<li>${translate(step)}</li>`).join('')}</ol>
          ${codeHelp(task)}
          <p class="check"><strong>${label('show')}</strong> ${translate(task.done)}</p>
        </article>
        <a class="btn" href="${challenge ? '#main-task' : '#challenge'}">${label(challenge ? 'back' : 'extraLink')}</a>
        <p id="toast" role="status"></p>
      </main>`;
    if (focus) document.getElementById('main').focus();

    app.querySelector('[data-copy]').addEventListener('click', async () => {
      const message = document.getElementById('toast');
      try {
        await navigator.clipboard.writeText(task.code);
        message.textContent = text(ui.copied);
      } catch {
        message.textContent = text(ui.copyFail);
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
