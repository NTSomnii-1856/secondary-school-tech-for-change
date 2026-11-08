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
  lessons[year]={year,week:7,...student(d)};
  const solution=fs.readFileSync(path.join(lab,'teacher-sources',`year${year}-solution.${year===7?'ino':'py'}`),'utf8');
  teacherGuide[year]={overview:prompt(d.stages[0]),stages:d.stages.map((s,i)=>prompt(s,i===3?solution:'')),project:prompt(d.project,solution)};
}
fs.writeFileSync(path.join(lab,'lessons.js'),'window.CROSSING_LESSONS='+JSON.stringify(lessons)+';\n');
fs.writeFileSync(path.join(lab,'teacher-guide.json'),JSON.stringify(teacherGuide)+'\n');
const release=JSON.parse(fs.readFileSync(path.join(hub,'release.json'),'utf8'));
if(!/^\d{4}-\d{2}-\d{2}$/.test(release.startDate)||release.daysBetweenTopics<1)throw Error('Invalid release schedule');
const merged=localise(beehive,languages.map(lang=>beehiveTranslations[lang]));
const lesson=student(merged),start=Date.parse(release.startDate+'T12:00:00Z');
lesson.topics.forEach((topic,i)=>topic.opensOn=new Date(start+i*release.daysBetweenTopics*86400000).toISOString().slice(0,10));
fs.writeFileSync(path.join(hub,'topics.js'),'window.BEEHIVE_LESSON='+JSON.stringify(lesson)+';\nwindow.BEEHIVE_RELEASE='+JSON.stringify(release)+';\n');
fs.writeFileSync(path.join(hub,'teacher-guide.json'),JSON.stringify({overview:prompt(merged.topics[0]),topics:merged.topics.map(topic=>prompt(topic))})+'\n');
for(const year of [7,8]){
  const dir=path.join(root,`year-${year}/week-7-pedestrian-crossing`);fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pedestrian crossing · Year ${year} · NTSOMNII</title><link rel="stylesheet" href="../../project-lab/project.css?v=1"><link rel="stylesheet" href="../../crossing-lab/crossing.css?v=1"><script defer src="../../crossing-lab/ui.js?v=1"></script><script defer src="../../crossing-lab/base.js?v=1"></script><script defer src="../../crossing-lab/lessons.js?v=1"></script><script defer src="../../crossing-lab/app.js?v=1"></script></head><body data-year="${year}"><div id="app"></div><noscript>Enable JavaScript to use the guide.</noscript></body></html>\n`);
}
fs.writeFileSync(path.join(hub,'index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tech for Change Community Project: Smart Beehive</title><link rel="stylesheet" href="../../project-lab/project.css?v=1"><link rel="stylesheet" href="../../crossing-lab/crossing.css?v=1"><script defer src="../../crossing-lab/ui.js?v=1"></script><script defer src="../../crossing-lab/base.js?v=1"></script><script defer src="topics.js?v=1"></script><script defer src="app.js?v=1"></script></head><body><div id="app"></div><noscript>Enable JavaScript to use the project topics.</noscript></body></html>\n`);
console.log('Built Year 7 Arduino C++, Year 8 Pico MicroPython, and the shared weekly Smart Beehive hub.');
