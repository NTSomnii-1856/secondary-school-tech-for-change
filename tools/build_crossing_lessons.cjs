/* Rebuild static lesson data after editing source-content or release.json. */
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),lab=path.join(root,'crossing-lab');
const hub=path.join(root,'community-project/smart-beehive');
const read=name=>JSON.parse(fs.readFileSync(path.join(lab,'source-content',name),'utf8'));
const coding=read('crossing-content.json'),codingTranslations=read('crossing-translations.json');
const beehive=read('beehive-content.json'),beehiveTranslations=read('beehive-translations.json');
const languages=['ru','zh-Hans','he'];
function localise(value,other,key=''){
  if(typeof value==='string'){
    if(key==='code')return value;
    if(other.some(x=>typeof x!=='string'))throw Error('Missing translation: '+key);
    return [value,...other];
  }
  if(Array.isArray(value))return value.map((x,i)=>localise(x,other.map(t=>t?.[i]),String(i)));
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,localise(v,other.map(t=>t?.[k]),k)]));
  return value;
}
function student(value){
  if(Array.isArray(value))return value.map(student);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([key])=>!key.startsWith('teacher')).map(([key,v])=>[key,student(v)]));
  return value;
}
const prompt=(entry,code='')=>({question:entry.teacherQuestion,watch:entry.teacherWatch,code});
const lessons={},teacherGuide={};
for(const year of [7,8]){
  const d=localise(coding[year],languages.map(lang=>codingTranslations[lang][year]));
  lessons[year]={year,week:7,lesson:7,...student(d)};
  const solution=fs.readFileSync(path.join(lab,'teacher-sources',`year${year}-solution.${year===7?'ino':'py'}`),'utf8');
  teacherGuide[year]={overview:prompt(d.stages[0]),stages:d.stages.map((s,i)=>prompt(s,i===3?solution:'')),project:prompt(d.project,solution)};
}
fs.writeFileSync(path.join(lab,'lessons.js'),'window.CROSSING_LESSONS='+JSON.stringify(lessons)+';\n');
fs.writeFileSync(path.join(lab,'teacher-guide.json'),JSON.stringify(teacherGuide)+'\n');
const release=JSON.parse(fs.readFileSync(path.join(hub,'release.json'),'utf8'));
if(!/^\d{4}-\d{2}-\d{2}$/.test(release.startDate)||release.daysBetweenTopics<1)throw Error('Invalid release schedule');
const merged=localise(beehive,languages.map(lang=>beehiveTranslations[lang]));
const lesson=student(merged),start=Date.parse(release.startDate+'T12:00:00Z');
lesson.topics.forEach((topic,i)=>{topic.lesson=i+1;topic.opensOn=new Date(start+i*release.daysBetweenTopics*86400000).toISOString().slice(0,10);});
fs.writeFileSync(path.join(hub,'topics.js'),'window.BEEHIVE_LESSON='+JSON.stringify(lesson)+';\nwindow.BEEHIVE_RELEASE='+JSON.stringify(release)+';\n');
fs.writeFileSync(path.join(hub,'teacher-guide.json'),JSON.stringify({overview:prompt(merged.topics[0]),topics:merged.topics.map(topic=>prompt(topic))})+'\n');
for(const year of [7,8]){
  const dir=path.join(root,`year-${year}/week-7-pedestrian-crossing`);fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lesson 7: Pedestrian crossing · Year ${year} · NTSOMNII</title><link rel="stylesheet" href="../../project-lab/project.css?v=3"><link rel="stylesheet" href="../../crossing-lab/crossing.css?v=3"><link rel="stylesheet" href="../../assets/classroom.css?v=3"><script defer src="../../assets/photos/photos.js?v=3"></script><script defer src="../../crossing-lab/ui.js?v=3"></script><script defer src="../../crossing-lab/base.js?v=3"></script><script defer src="../../crossing-lab/lessons.js?v=3"></script><script defer src="../../crossing-lab/app.js?v=3"></script></head><body data-year="${year}"><div id="app"></div><noscript>Enable JavaScript to use the guide.</noscript></body></html>\n`);
}
fs.writeFileSync(path.join(hub,'index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tech for Change Community Project: Smart Beehive</title><link rel="stylesheet" href="../../project-lab/project.css?v=3"><link rel="stylesheet" href="../../crossing-lab/crossing.css?v=3"><link rel="stylesheet" href="../../assets/classroom.css?v=3"><script defer src="../../assets/photos/photos.js?v=3"></script><script defer src="../../crossing-lab/ui.js?v=3"></script><script defer src="../../crossing-lab/base.js?v=3"></script><script defer src="topics.js?v=3"></script><script defer src="app.js?v=3"></script></head><body data-space="beehive"><div id="app"></div><noscript>Enable JavaScript to use the project topics.</noscript></body></html>\n`);
const photoRoot=path.join(root,'assets/photos'),photos=JSON.parse(fs.readFileSync(path.join(photoRoot,'credits.json'),'utf8'));
fs.writeFileSync(path.join(photoRoot,'photos.js'),'window.LESSON_PHOTOS='+JSON.stringify(photos)+';\n');
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const [relative,prefix] of [['index.html','assets/photos/'],['year-7/index.html','../assets/photos/'],['year-8/index.html','../assets/photos/']]){
  const file=path.join(root,relative);let html=fs.readFileSync(file,'utf8');
  for(const photo of photos){
    const cls=relative==='index.html'?'hub-photo':'lesson-photo';
    const figure=`<figure class="space-photo" data-photo="${photo.file}"><img class="${cls}" src="${prefix+photo.file}" alt="${escape(photo.caption)}" width="${photo.width}" height="${photo.height}" decoding="async"><figcaption><a target="_blank" rel="noopener" href="${escape(photo.sourcePage)}">Photo: ${escape(photo.author)}</a> · <a target="_blank" rel="noopener" href="${escape(photo.licenseURL)}">${escape(photo.license)}</a></figcaption></figure>`;
    const existing=new RegExp('<figure class="space-photo" data-photo="'+photo.file.replaceAll('.','\\.')+'">[\\s\\S]*?</figure>');
    const image=new RegExp('<img class="'+cls+'"[^>]*src="[^"]*'+photo.file.replaceAll('.','\\.')+'"[^>]*>');
    html=existing.test(html)?html.replace(existing,figure):html.replace(image,figure);
  }
  if(!html.includes('assets/classroom.css'))html=html.replace('</head>',`<link rel="stylesheet" href="${relative==='index.html'?'assets/':'../assets/'}classroom.css?v=3"></head>`);
  fs.writeFileSync(file,html);
}
fs.writeFileSync(path.join(photoRoot,'README.md'),'# Photograph credits\n\nThese photographs retain their individual licences; those licences apply to the photographs, not the website code.\n\n'+photos.map(p=>`- **${p.file}** — ${p.author}. [Source](${p.sourcePage}), [${p.license}](${p.licenseURL}). ${p.changes}`).join('\n')+'\n');
console.log('Built Year 7 Arduino C++, Year 8 Pico MicroPython, and the shared weekly Smart Beehive hub.');
