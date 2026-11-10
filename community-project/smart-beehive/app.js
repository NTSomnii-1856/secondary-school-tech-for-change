(() => {
  'use strict';
  const H=window.CrossingUI, {esc,t,u,button,list}=H;
  const D=window.BEEHIVE_LESSON, R=window.BEEHIVE_RELEASE;
  const key='ntsomnii-community-smart-beehive-v1';
  const initial={topic:-1,phase:'learn',team:'',cards:{},checks:{},big:false};
  const S=H.read(key,initial);
  const lessonOne={
    look:['Look closely','Рассмотрите внимательно','仔细观察','התבוננו מקרוב'],
    observe:['Find one visible detail in each photo. What would you need to check before calling it a problem?','Найдите по одной видимой детали на каждом фото. Что нужно проверить, прежде чем назвать это проблемой?','在每张照片里找出一个看得见的细节。把它称为问题之前，还需要核实什么？','מצאו פרט אחד שאפשר לראות בכל תמונה. מה צריך לבדוק לפני שקוראים לו בעיה?'],
    outside:['A · Hive boxes outdoors','A · Ульи снаружи','A · 户外的蜂箱','A · כוורות בחוץ'],
    outsideAlt:['A row of wooden hive boxes with lids outdoors.','Ряд деревянных ульев с крышками на открытом воздухе.','户外一排带盖的木制蜂箱。','שורה של כוורות עץ עם מכסים בחוץ.'],
    inspection:['B · A beekeeper checks a frame','B · Пчеловод осматривает рамку','B · 养蜂人检查蜂框','B · דבוראי בודק מסגרת'],
    inspectionAlt:['A beekeeper holds a hive frame during an inspection.','Пчеловод держит рамку во время осмотра улья.','养蜂人在检查蜂箱时拿着一块蜂框。','דבוראי מחזיק מסגרת בזמן בדיקת הכוורת.'],
    cycle:['Engineering design cycle','Цикл инженерного проектирования','工程设计循环','מחזור התכנון ההנדסי'],
    today:['Start with Ask. You can revisit a step as you learn.','Начните с вопроса. Новые сведения могут вернуть вас к предыдущему шагу.','从提问开始。学到新内容时，可以回到前面的步骤。','מתחילים בשאלה. כשמגלים משהו חדש, אפשר לחזור לשלב קודם.'],
    print:['Printables','Материалы для печати','打印材料','חומרים להדפסה'],
    worksheet:['Student worksheet · English PDF','Рабочий лист · PDF на английском','学生练习单 · 英文 PDF','דף עבודה לתלמידים · PDF באנגלית'],
    printCycle:['Print the cycle · English PDF','Распечатать цикл · PDF на английском','打印设计循环 · 英文 PDF','הדפסת המחזור · PDF באנגלית'],
    teacherGuide:['Teacher guide · English PDF','Руководство для учителя · PDF на английском','教师指南 · 英文 PDF','מדריך למורה · PDF באנגלית'],
  };
  if(!S.cards||typeof S.cards!=='object'||Array.isArray(S.cards))S.cards={};
  if(!S.checks||typeof S.checks!=='object'||Array.isArray(S.checks))S.checks={};
  if(!Number.isInteger(S.topic)||S.topic< -1||S.topic>=D.topics.length)S.topic=-1;
  let teacher=false,teacherData=null,loadingTeacher=false;
  const save=()=>H.save(key,S);
  function today(){
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:R.timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const value=type=>parts.find(x=>x.type===type).value;
    return `${value('year')}-${value('month')}-${value('day')}`;
  }
  const released=topic=>topic.week<=R.initialReleasedWeek||today()>=topic.opensOn;
  const accessible=topic=>teacher||released(topic);
  const dateLabel=date=>new Intl.DateTimeFormat(H.getLang(),{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));
  function card(topic){return S.cards[topic.week]??={owner:'',due:'',notes:'',source:'',next:'',list:'To do'};}
  const textarea=(label,name,value)=>`<label class="field">${esc(label)}<textarea data-card="${name}">${esc(value)}</textarea></label>`;
  function topicButton(topic,index,side=false){
    const open=released(topic),selected=S.topic===index,status=open?u('released'):teacher?u('preview')+' · '+dateLabel(topic.opensOn):u('locked')+' '+dateLabel(topic.opensOn);
    if(side)return `<button data-topic="${index}" class="${selected?'active':''}" ${!accessible(topic)?'disabled':''} ${selected?'aria-current="page"':''}><small>${esc(u('lesson'))} ${topic.lesson} · ${esc(status)}</small>${t(topic.title)}</button>`;
    return `<button class="topic-card ${!open?'locked':''} ${selected?'active':''}" data-topic="${index}" ${!accessible(topic)?'disabled':''}><span class="topic-week">${esc(u('lesson'))} ${topic.lesson}</span><b>${t(topic.title)}</b><span class="topic-status">${esc(status)}</span></button>`;
  }
  function home(){
    return `<div class="lesson-cover"><div><p class="eyebrow">${esc(u('projectSpace'))}</p><h1>${esc(u('beehiveTitle'))}</h1><p class="lead">${t(D.intro)}</p></div>${H.photo('beehive')}</div><div class="topic-list">${D.topics.map((x,i)=>topicButton(x,i)).join('')}</div><p class="small">${esc(u('releaseNote'))}</p><div class="actions">${button(u('downloadCard'),'download-cards')}${button(u('loadCards'),'load-cards')}</div>`;
  }
  function sources(){
    return `<details class="paper"><summary>${esc(u('sources'))}</summary><div class="sources"><a class="btn" target="_blank" rel="noopener" href="https://bees.caes.uga.edu/beekeeping-resources/getting-started-topics/getting-started-beekeeping-equipment.html">University of Georgia · Hive parts ↗</a><a class="btn" target="_blank" rel="noopener" href="https://www.bbka.org.uk/becoming-a-beekeeper">British Beekeepers Association ↗</a><a class="btn" target="_blank" rel="noopener" href="https://www.teachengineering.org/popular-topics/engineering-design-process">TeachEngineering · Design process ↗</a></div></details>`;
  }
  function cardForm(topic){
    const c=card(topic);
    return `<section class="paper card-form"><h2>${esc(u('card'))}</h2><p><strong>${t(topic.cardTitle)}</strong></p><p class="small">${esc(u('cardNote'))}</p><details><summary>${t(topic.cardTitle)}</summary>${list(topic.cardChecklist)}</details><label class="field">${esc(u('team'))}<input data-team value="${esc(S.team)}" maxlength="100" autocomplete="off"></label><div class="card-row"><label class="field">${esc(u('owner'))}<input data-card="owner" value="${esc(c.owner)}" maxlength="100" autocomplete="off"></label><label class="field">${esc(u('due'))}<input data-card="due" type="date" value="${esc(c.due)}"></label></div>${textarea(u('response'),'notes',c.notes)}<label class="field">${esc(u('source'))}<input data-card="source" type="url" value="${esc(c.source)}" dir="ltr" placeholder="https://"></label>${textarea(u('nextJob'),'next',c.next)}<label class="field">Trello · ${esc(u('list'))}<select data-card="list">${['To do','Doing','Check','Done'].map(x=>`<option ${c.list===x?'selected':''}>${x}</option>`).join('')}</select></label><div class="actions">${button(u('copyCard'),'copy-card',true)}${button(u('downloadCard'),'download-cards')}</div></section>`;
  }
  function lessonOnePhoto(file,caption,alt){
    const entry=window.LESSON_PHOTOS?.find(item=>item.file===file);
    if(!entry)return '';
    return `<figure class="lesson-one-photo"><img src="../../assets/photos/${file}" alt="${t(alt)}" width="${esc(entry.width)}" height="${esc(entry.height)}" decoding="async"><figcaption><strong>${t(caption)}</strong><span class="image-credit"><a target="_blank" rel="noopener" href="${esc(entry.sourcePage)}">${esc(u('photo'))}: ${esc(entry.author)}</a> · <a target="_blank" rel="noopener" href="${esc(entry.licenseURL)}">${esc(entry.license)}</a></span></figcaption></figure>`;
  }
  function lessonOneCycle(topic){
    if(Array.isArray(topic.cycle)&&topic.cycle.length===7)return topic.cycle.map(H.text);
    // Older lesson data wrote the seven labels at the start of the Learn text.
    const line=topic.learn.map(H.text).find(value=>value.split('→').length===7);
    return line?line.split(/[.!?。！？]/,1)[0].split('→').map(value=>value.trim()):[];
  }
  function lessonOneLearn(topic){
    const photos=[lessonOnePhoto('beehive.jpg',lessonOne.outside,lessonOne.outsideAlt),lessonOnePhoto('hive-inspection.jpg',lessonOne.inspection,lessonOne.inspectionAlt)].filter(Boolean);
    const stages=lessonOneCycle(topic);
    const labels=stages.join(' → ');
    const english=H.getLang()==='en';
    const observation=photos.length?`<section class="lesson-one-observation" aria-labelledby="lesson-one-look">
      <h2 id="lesson-one-look">${t(lessonOne.look)}</h2>
      <p>${t(lessonOne.observe)}</p>
      <div class="lesson-one-photos ${photos.length===1?'single':''}">${photos.join('')}</div>
    </section>`:'';
    const stageList=stages.map((stage,i)=>`<li><span aria-hidden="true">${i+1}</span>${esc(stage)}</li>`).join('');
    const cycle=stages.length?`<figure class="lesson-one-cycle" aria-labelledby="lesson-one-cycle-heading">
      <h2 id="lesson-one-cycle-heading">${t(lessonOne.cycle)}</h2>
      ${english?`<img class="cycle-diagram" src="lesson-1/engineering-cycle.svg" alt="${esc(labels)}" decoding="async">`:''}
      <ol class="lesson-one-cycle-steps ${english?'cycle-small':''}">${stageList}</ol>
      <figcaption>${t(lessonOne.today)}</figcaption>
    </figure>`:'';
    // The diagram already communicates the cycle. Retain any other teaching text.
    const text=topic.learn.map(H.text).map(value=>labels&&value.startsWith(labels)?value.slice(labels.length).replace(/^[\s.!?。！？]+/,''):value).filter(Boolean);
    return `${observation}${cycle}<div class="learning-text">${text.map(value=>`<p>${esc(value)}</p>`).join('')}</div>`;
  }
  const lessonOneDownload=(file,label)=>`<a class="btn" href="lesson-1/${file}" download>${t(label)} ↓</a>`;
  function lessonOnePrintables(){
    return `<div class="actions lesson-one-printables" role="group" aria-label="${t(lessonOne.print)}">${lessonOneDownload('student-worksheet.pdf',lessonOne.worksheet)}${lessonOneDownload('engineering-cycle.pdf',lessonOne.printCycle)}</div>`;
  }
  function topicView(){
    const topic=D.topics[S.topic];
    const first=topic.lesson===1;
    return `<div class="topic-return">${button('← '+u('returnTopics'),'home')}</div><p class="eyebrow">${esc(u('lesson'))} ${topic.lesson}${!released(topic)?' · '+esc(u('preview')):''}</p><h1>${t(topic.title)}</h1><div class="phase">${button(u('learn'),'learn',S.phase==='learn',`aria-pressed="${S.phase==='learn'}"`)}${button(u('try'),'try',S.phase==='try',`aria-pressed="${S.phase==='try'}"`)}</div><article class="paper guidecard">${S.phase==='learn'?`${first?lessonOneLearn(topic):`<div class="learning-text">${topic.learn.map(x=>`<p>${t(x)}</p>`).join('')}</div>`}<div class="actions">${button(u('try')+' →','try',true)}</div>`:`<ol class="steps">${topic.steps.map(x=>`<li>${t(x)}</li>`).join('')}</ol><aside class="check"><h3>${esc(u('expected'))}</h3><p>${t(topic.result)}</p><label class="checklabel"><input id="topic-checked" type="checkbox" ${S.checks[topic.week]?'checked':''}>${esc(u('cardReady'))}</label></aside>${first?lessonOnePrintables():''}`}</article>${S.phase==='try'?cardForm(topic):''}${topic.week>=8?sources():''}`;
  }
  function teacherEntry(){return S.topic<0?teacherData?.overview:teacherData?.topics[S.topic];}
  function boardKit(){
    return ['Tech for Change Community Project: Smart Beehive','PRIVATE TEACHER BOARD','Lists: To do | Doing | Check | Done','',...D.topics.flatMap(topic=>[u('lesson')+' '+topic.lesson+': '+H.text(topic.cardTitle),'Owner: [team responsibility]','Due: [agreed date]','Checklist:',...topic.cardChecklist.map(x=>'- '+H.text(x)), ''])].join('\n');
  }
  function teacherBoard(){
    return `<details class="paper teacher-board"><summary>${esc(u('boardSetup'))}</summary><p>${esc(u('trelloAge'))} <a target="_blank" rel="noopener" href="https://www.atlassian.com/legal/atlassian-customer-agreement">Atlassian · §3.4 ↗</a></p><p>${esc(u('boardSteps'))}</p><div class="actions"><a class="btn" target="_blank" rel="noopener" href="https://trello.com/">${esc(u('openTrello'))}</a>${button(u('boardKit'),'copy-kit')}</div><p class="small">${esc(u('teacherReleaseNote'))}</p><table class="release-table"><tbody>${D.topics.map(x=>`<tr><td>${esc(u('week'))} ${x.week} / ${esc(u('lesson'))} ${x.lesson}</td><td>${t(x.title)}</td><td>${esc(dateLabel(x.opensOn))}</td></tr>`).join('')}</tbody></table></details>`;
  }
  async function toggleTeacher(){
    if(teacher){teacher=false;if(S.topic>=0&&!released(D.topics[S.topic]))S.topic=-1;render(true);return;}
    if(loadingTeacher)return;
    if(!teacherData){loadingTeacher=true;try{
      const response=await fetch('teacher-guide.json?v=4');if(!response.ok)throw Error('unavailable');
      const data=await response.json();if(!Array.isArray(data.topics)||data.topics.length!==D.topics.length)throw Error('invalid');teacherData=data;
    }catch{H.toast(u('teacherFailed'));return;}finally{loadingTeacher=false;}}
    teacher=true;render(true);document.querySelector('.teacher-panel')?.scrollIntoView({block:'nearest'});
  }
  function render(focus=false){
    if(S.topic>=0&&!accessible(D.topics[S.topic]))S.topic=-1;
    H.documentLanguage();document.body.classList.toggle('large',S.big);document.title=H.text(D.title)+' · NTSOMNII';
    const teacherContent=teacher?H.teacherPanel(teacherEntry())+(D.topics[S.topic]?.lesson===1?`<div class="actions lesson-one-teacher-download">${lessonOneDownload('teacher-guide.pdf',lessonOne.teacherGuide)}</div>`:'')+teacherBoard():'';
    document.getElementById('app').innerHTML=H.header({teacher,big:S.big,hub:true})+`<div class="shell"><aside><nav class="topic-sidenav" aria-label="${esc(u('topics'))}">${D.topics.map((x,i)=>topicButton(x,i,true)).join('')}</nav></aside><main id="main" tabindex="-1">${S.topic<0?home():topicView()}${teacherContent}${H.footer()}</main></div><p id="toast" role="status"></p><input id="card-file" type="file" accept="application/json,.json" hidden>`;
    save();if(focus)document.getElementById('main').focus();
  }
  function cardText(){
    const topic=D.topics[S.topic],c=card(topic);
    return [u('lesson')+' '+topic.lesson+' · '+H.text(topic.cardTitle),u('team')+': '+S.team,u('owner')+': '+c.owner,u('due')+': '+c.due,'Trello: '+c.list,'',...topic.cardChecklist.map(x=>'- [ ] '+H.text(x)),'',u('response')+':',c.notes,u('source')+': '+c.source,u('nextJob')+': '+c.next].join('\n');
  }
  function downloadCards(){H.download('Smart-Beehive-team-cards.json',JSON.stringify({format:'ntsomnii-smart-beehive-cards-v1',team:S.team,cards:S.cards,checks:S.checks},null,2),'application/json');}
  function validateBackup(value){
    if(value?.format!=='ntsomnii-smart-beehive-cards-v1'||typeof value.team!=='string'||!value.cards||typeof value.cards!=='object'||Array.isArray(value.cards))throw Error('invalid');
    const cards={};for(const topic of D.topics){const x=value.cards[topic.week];if(!x)continue;if(typeof x!=='object'||Array.isArray(x))throw Error('invalid');cards[topic.week]={};for(const field of ['owner','due','notes','source','next','list']){if(typeof x[field]!=='string'||x[field].length>20000)throw Error('invalid');cards[topic.week][field]=x[field];}if(!['To do','Doing','Check','Done'].includes(x.list))throw Error('invalid');}
    const checks={};for(const topic of D.topics)checks[topic.week]=Boolean(value.checks?.[topic.week]);
    return {team:value.team.slice(0,100),cards,checks};
  }
  document.addEventListener('click',async event=>{
    const el=event.target.closest('button');if(!el)return;
    if(el.dataset.topic!==undefined){const i=Number(el.dataset.topic);if(accessible(D.topics[i])){S.topic=i;S.phase='learn';render(true);}return;}
    const action=el.dataset.action;
    if(action==='teacher'){await toggleTeacher();return;}
    if(action==='copy-card'){await H.copy(cardText());return;}
    if(action==='copy-kit'){if(teacher)await H.copy(boardKit());return;}
    if(action==='download-cards'){downloadCards();return;}
    if(action==='load-cards'){document.getElementById('card-file').click();return;}
    if(action==='home')S.topic=-1;
    if(action==='learn'||action==='try')S.phase=action;
    if(action==='big')S.big=!S.big;
    if(action)render(true);
  });
  document.addEventListener('change',async event=>{
    const el=event.target;
    if(el.id==='language'){H.setLang(el.value);render();}
    if(el.id==='topic-checked'){S.checks[D.topics[S.topic].week]=el.checked;save();}
    if(el.dataset.card==='list'){card(D.topics[S.topic]).list=el.value;save();}
    if(el.id==='card-file'&&el.files[0]){
      try{const file=el.files[0];if(file.size>1024*1024)throw Error('large');const restored=validateBackup(JSON.parse(await file.text()));Object.assign(S,restored);save();render();H.toast(u('restored'));}catch{H.toast(u('invalidBackup'));}
    }
  });
  document.addEventListener('input',event=>{
    const el=event.target;
    if(el.hasAttribute('data-team'))S.team=el.value;
    else if(el.dataset.card&&S.topic>=0)card(D.topics[S.topic])[el.dataset.card]=el.value;
    else return;save();
  });
  render();
})();
