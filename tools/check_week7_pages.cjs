const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
let chromium;
try { ({chromium} = require('playwright')); }
catch { ({chromium} = require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))); }

const BASE = process.env.LESSON_BASE_URL || 'http://127.0.0.1:4194';
const ROOT = path.resolve(__dirname,'..');
const OUT = process.env.TEST_OUTPUT_DIR || path.join(require('node:os').tmpdir(),'ntsomnii-week7-acceptance');
fs.mkdirSync(OUT, { recursive: true });
const langs = ['en', 'ru', 'zh-Hans', 'he'];
const clean = x => x.replace(/\r\n/g, '\n').trim();

async function downloadText(page, click) {
  const waiting = page.waitForEvent('download');
  await click();
  const download = await waiting;
  const file = path.join(OUT, download.suggestedFilename());
  await download.saveAs(file);
  return fs.readFileSync(file, 'utf8');
}

async function noOverflow(page, description) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, description + ' overflows');
}

async function clipboardShim(context) {
  await context.addInitScript(() => {
    window.__copied = '';
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { window.__copied = value; } } });
  });
}

async function coding(browser, year) {
  const context = await browser.newContext({ acceptDownloads: true });
  await clipboardShim(context);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  let teacherFetches = 0;
  page.on('request', request => { if (request.url().includes('/teacher-guide.json')) teacherFetches++; });
  await page.goto(`${BASE}/year-${year}/week-7-pedestrian-crossing/`);
  await page.locator('[data-action="begin"]').waitFor();
  assert.equal(teacherFetches, 0, `Y${year} fetched teacher material for a student`);
  assert.equal(await page.locator('.teacher-panel').count(), 0);
  assert.equal(await page.locator('.teacher-code').count(), 0);
  const teacherSource = clean(fs.readFileSync(path.join(ROOT, `crossing-lab/teacher-sources/year${year}-solution.${year === 7 ? 'ino' : 'py'}`), 'utf8'));
  assert.equal((await page.locator('body').innerText()).includes(teacherSource), false);

  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 850 });
    for (const lang of langs) {
      await page.locator('#language').selectOption(lang);
      assert.equal(await page.locator('html').getAttribute('lang'), lang);
      assert.equal(await page.locator('html').getAttribute('dir'), lang === 'he' ? 'rtl' : 'ltr');
      await noOverflow(page, `Y${year}/${lang}/${width} home`);
      await page.locator('[data-tab="2"]').click();
      await page.locator('.setup-help summary').click();
      await noOverflow(page, `Y${year}/${lang}/${width} challenge/setup`);
      assert.equal(await page.locator('.teacher-code').count(), 0);
      await page.locator('[data-tab="0"]').click();
    }
  }
  await page.locator('#language').selectOption('en');
  await page.locator('[data-step="0"]').click();
  await page.locator('[data-action="try"]').first().click();
  await page.locator('#checked').check();
  await page.locator('[data-tab="2"]').click();
  await page.locator('[data-test="0"]').check();
  await page.locator('[data-field="observation"][data-index="0"]').fill('Observed request was remembered.');
  await page.locator('.evidence summary').click();
  await page.locator('[data-field="solution"]').fill('My own partial crossing code.');
  await page.locator('[data-field="change"]').fill('Changed the red pause.');
  await page.locator('[data-tab="5"]').click();
  await page.locator('[data-field="exit"][data-index="0"]').fill('The car red comes first.');
  const notes = await downloadText(page, () => page.locator('[data-action="download"]').click());
  for (const text of ['Observed request was remembered.', 'My own partial crossing code.', 'Changed the red pause.', 'The car red comes first.']) assert.ok(notes.includes(text), `Y${year} missing note in download`);
  await page.reload();
  assert.equal(await page.locator('[data-field="exit"][data-index="0"]').inputValue(), 'The car red comes first.');
  const saved = await page.evaluate(year => JSON.parse(localStorage.getItem(`ntsomnii-y${year}-w7-crossing-v1`)), year);
  assert.equal(saved.checks[0], true);
  assert.equal(saved.tests[0], true);
  assert.equal(saved.solution, 'My own partial crossing code.');
  assert.equal(teacherFetches, 0);

  await page.locator('[data-tab="2"]').click();
  await page.locator('[data-action="teacher"]').first().click();
  await page.locator('.teacher-code summary').click();
  assert.equal(teacherFetches, 1);
  assert.equal(clean(await page.locator('.teacher-code code').innerText()), teacherSource, `Y${year} teacher example differs from checked source`);
  assert.ok(teacherSource.includes(year === 7 ? '#include "crossing.h"' : 'from crossing import pause'));
  assert.equal(teacherSource.includes(year === 7 ? 'from machine import Pin' : 'void setup()'), false);
  await page.locator('[data-action="copy-teacher"]').click();
  assert.equal(clean(await page.evaluate(() => window.__copied)), teacherSource);
  await page.locator('[data-action="teacher"]').first().click();
  assert.equal(await page.locator('.teacher-panel').count(), 0);
  await page.locator('[data-action="teacher"]').first().click();
  await page.reload();
  assert.equal(await page.locator('.teacher-panel').count(), 0, 'Teacher mode persisted after reload');
  assert.equal(await page.locator('[data-action="teacher"]').first().getAttribute('aria-pressed'), 'false');
  assert.equal(teacherFetches, 1, 'Reload fetched teacher material while teacher mode was off');
  assert.deepEqual(errors, []);
  await page.screenshot({path:path.join(OUT, `year-${year}-390.png`), fullPage:true});
  console.log(`PASS Y${year}: four languages at 320/390, no teacher prefetch, correct isolated teacher source, saved checks/notes/download, teacher reload reset.`);
  await context.close();
}

async function hub(browser, date, releasedCount, interactive = false) {
  const context = await browser.newContext({ acceptDownloads: true });
  await clipboardShim(context);
  const page = await context.newPage();
  await page.clock.install({time:new Date(date)});
  const errors=[];
  page.on('pageerror', e=>errors.push(e.message));
  let teacherFetches=0;
  page.on('request', request=>{if(request.url().includes('/teacher-guide.json'))teacherFetches++;});
  await page.goto(`${BASE}/community-project/smart-beehive/`);
  await page.locator('.topic-card').first().waitFor();
  assert.equal(await page.locator('.topic-card').count(),6);
  assert.equal(await page.locator('.topic-card:not([disabled])').count(),releasedCount, `Wrong release count at ${date}`);
  for(let i=0;i<6;i++) assert.equal(await page.locator(`.topic-card[data-topic="${i}"]`).isEnabled(),i<releasedCount);
  assert.equal(teacherFetches,0);
  if(interactive){
    for(const width of [320,390]){
      await page.setViewportSize({width,height:850});
      for(const lang of langs){
        await page.locator('#language').selectOption(lang);
        await noOverflow(page,`Hub/${lang}/${width}`);
      }
    }
    await page.locator('#language').selectOption('en');
    await page.locator('[data-action="teacher"]').first().click();
    await page.locator('.teacher-panel').waitFor();
    assert.equal(teacherFetches,1);
    assert.equal(await page.locator('.topic-card:not([disabled])').count(),6);
    await page.locator('.topic-card[data-topic="5"]').click();
    assert.equal(await page.locator('main h1').innerText(),'Test and improve with evidence');
    await page.locator('[data-action="teacher"]').first().click();
    assert.equal(await page.locator('.topic-card').count(),6);
    assert.equal(await page.locator('.topic-card:not([disabled])').count(),releasedCount);
    assert.equal(await page.locator('.teacher-panel').count(),0);
    await page.locator('.topic-card[data-topic="0"]').click();
    await page.locator('[data-action="try"]').first().click();
    await page.locator('#topic-checked').check();
    await page.locator('[data-team]').fill('Team Cedar');
    await page.locator('[data-card="owner"]').fill('Builder');
    await page.locator('[data-card="due"]').fill('2026-11-13');
    await page.locator('[data-card="notes"]').fill('Our community needs a clear hive inspection record.');
    await page.locator('[data-card="source"]').fill('https://example.com/evidence');
    await page.locator('[data-card="next"]').fill('Ask the beekeeper one question.');
    await page.locator('[data-card="list"]').selectOption('Doing');
    await page.locator('[data-action="copy-card"]').click();
    const copied=await page.evaluate(()=>window.__copied);
    for(const text of ['Team Cedar','Builder','2026-11-13','Our community needs a clear hive inspection record.','Ask the beekeeper one question.','Doing'])assert.ok(copied.includes(text));
    const backup=JSON.parse(await downloadText(page,()=>page.locator('[data-action="download-cards"]').click()));
    assert.equal(backup.format,'ntsomnii-smart-beehive-cards-v1');
    assert.equal(backup.team,'Team Cedar');
    assert.equal(backup.cards['7'].list,'Doing');
    assert.equal(backup.checks['7'],true);
    await page.locator('[data-team]').fill('Changed team');
    await page.locator('#card-file').setInputFiles({name:'restore.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
    await page.waitForFunction(()=>document.querySelector('[data-team]')?.value==='Team Cedar');
    assert.equal(await page.locator('#topic-checked').isChecked(),true);
    const beforeBad=await page.evaluate(()=>localStorage.getItem('ntsomnii-community-smart-beehive-v1'));
    const previousToast=await page.locator('#toast').innerText();
    await page.locator('#card-file').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"format":"bad"}')});
    await page.waitForFunction(previous=>document.querySelector('#toast')?.textContent.length>0&&document.querySelector('#toast').textContent!==previous,previousToast);
    assert.equal(await page.evaluate(()=>localStorage.getItem('ntsomnii-community-smart-beehive-v1')),beforeBad,'Invalid backup mutated saved cards');
    await page.locator('[data-action="teacher"]').first().click();
    await page.locator('.topic-sidenav [data-topic="5"]').click();
    await page.reload();
    assert.equal(await page.locator('.teacher-panel').count(),0);
    assert.equal(await page.locator('.topic-card:not([disabled])').count(),releasedCount,'Reload retained teacher preview');
    assert.equal(teacherFetches,1);
    await page.screenshot({path:path.join(OUT,'community-390.png'),fullPage:true});
  }
  assert.deepEqual(errors,[]);
  console.log(`PASS hub ${date}: ${releasedCount}/6 topics open${interactive?', teacher preview resets/relocks, four languages/mobile, clipboard and valid/invalid backup checked':''}.`);
  await context.close();
}

async function navigation(browser){
  const page=await browser.newPage();
  for(const [url,href] of [['/','community-project/smart-beehive/'],['/year-7/','../community-project/smart-beehive/'],['/year-8/','../community-project/smart-beehive/']]){
    await page.goto(BASE+url);
    assert.equal(await page.locator(`a[href="${href}"]`).count(),1,`Missing/duplicate shared hub entry at ${url}`);
    const resolved=await page.locator(`a[href="${href}"]`).evaluate(a=>a.href);
    assert.equal(resolved,BASE+'/community-project/smart-beehive/');
    for(const width of [320,390]){
      await page.setViewportSize({width,height:850});
      await noOverflow(page,'Class hub '+url+'/'+width);
    }
    await page.setViewportSize({width:1280,height:900});
  }
  for(const year of [7,8]){
    await page.goto(`${BASE}/year-${year}/curriculum-map/`);
    assert.equal(await page.locator('#community-project a').evaluate(a=>a.href),BASE+'/community-project/smart-beehive/');
    await page.goto(`${BASE}/year-${year}/week-7-pedestrian-crossing/`);
    assert.equal(await page.locator('.section-tabs a').nth(2).evaluate(a=>a.href),BASE+'/community-project/smart-beehive/');
  }
  console.log('PASS cross-site navigation: one root/class hub entry, correct map and coding-page shared URLs.');
  await page.close();
}

(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    await coding(browser,7);
    await coding(browser,8);
    await hub(browser,'2026-11-08T12:00:00Z',1,true);
    await hub(browser,'2026-11-16T12:00:00Z',2);
    await hub(browser,'2026-12-14T12:00:00Z',6);
    await navigation(browser);
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
