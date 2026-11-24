'use strict';
const $=id=>document.getElementById(id),D=ExerciseData,KEY='ggj-lota30-timi05-aefing-v1';
const CORE=D.coreCount,COUNT=D.tasks(0).length,CORE_GROUPS=D.coreGroups;
const cleanState=(seed=0)=>({version:1,seed,index:0,last:0,steps:Array.from({length:COUNT},()=>({choice:null,answers:[],verified:false,hints:0,attempts:0}))});
const integer=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
function parseNumber(value){
  const s=value.trim().replace(/[\s\u00a0\u202f]/g,'').replaceAll('−','-').replace(',','.');
  const numeric=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
  if(numeric.test(s)){const n=Number(s);return Number.isFinite(n)?n:null;}
  const parts=s.match(/^([+-]?\d+)\/([+-]?\d+)$/);
  if(!parts)return null;
  const numerator=Number(parts[1]),denominator=Number(parts[2]),n=numerator/denominator;
  return Number.isFinite(numerator)&&Number.isFinite(denominator)&&denominator!==0&&Number.isFinite(n)?n:null;
}
function sameNumber(a,b){return a!==null&&Number.isFinite(a)&&(b===0?a===0:Math.abs(a-b)<=Math.abs(b)*1e-10);}
function isCorrect(t,s){return t.type==='choice'?s.choice===t.correct:t.answer.every((n,i)=>sameNumber(parseNumber(s.answers[i]||''),n));}
function validState(s){
  if(!s||s.version!==1||!integer(s.seed,0,2)||!integer(s.index,0,COUNT)||!integer(s.last,0,COUNT-1)||!Array.isArray(s.steps)||s.steps.length!==COUNT)return false;
  const tasks=D.tasks(s.seed);
  return s.steps.every((v,i)=>v&&typeof v==='object'&&!Array.isArray(v)&&(v.choice===null||integer(v.choice,0,(tasks[i].options?.length||1)-1))&&Array.isArray(v.answers)&&v.answers.length<=(tasks[i].answer?.length||0)&&v.answers.every(x=>typeof x==='string'&&x.length<=80)&&typeof v.verified==='boolean'&&integer(v.hints,0,tasks[i].hints.length)&&integer(v.attempts,0,100000)&&(!v.verified||isCorrect(tasks[i],v)));
}
let state,storageWorks=true;
try{state=JSON.parse(localStorage.getItem(KEY));if(!validState(state))state=cleanState();}catch(e){state=cleanState();if(e.name!=='SyntaxError')storageWorks=false;}
let message='';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{storageWorks=false;}};
const storageNote=()=>storageWorks?'Framvindan geymist í þessum vafra. Svör eru ekki send til kennara.':'Vafrinn leyfir ekki vistun. Framvindan helst á meðan þessi síða er opin.';
const doneGroup=i=>state.steps.slice(D.starts[i],D.starts[i+1]??COUNT).every(s=>s.verified);
function render(focus=false){
  save();
  $('progress').innerHTML=D.names.map((_,i)=>`<i class="${i>=CORE_GROUPS?'optional ':''}${i===CORE_GROUPS?'optional-first ':''}${doneGroup(i)?'done ':''}${D.group(state.index)===i&&state.index<COUNT?'current':''}"${i>=CORE_GROUPS?' title="Valfrjáls viðbót"':''}></i>`).join('');
  $('progress').setAttribute('aria-label',`${D.starts.slice(0,CORE_GROUPS).filter((_,i)=>doneGroup(i)).length} af ${CORE_GROUPS} kjarnahlutum lokið`);
  if(state.index===COUNT){renderSummary();if(focus)$('heading').focus({preventScroll:true});return;}
  const t=D.tasks(state.seed)[state.index],s=state.steps[state.index],g=t.part,phase=state.index-D.starts[g]+1,total=(D.starts[g+1]??COUNT)-D.starts[g];
  $('stepcount').textContent=g<CORE_GROUPS?`Hluti ${g+1} af ${CORE_GROUPS}`:`Valfrjáls viðbót ${g-CORE_GROUPS+1} af ${D.names.length-CORE_GROUPS}`;
  $('subcount').textContent=`Skref ${phase} af ${total}`;
  let input=t.type==='choice'?`<div class="choices" role="group" aria-label="Svarmöguleikar">${t.options.map((c,i)=>`<button class="choice ${s.choice===i?'selected ':''}${s.verified&&s.choice===i?'correct':''}" data-choice="${i}" aria-pressed="${s.choice===i}" ${s.verified?'disabled':''}><span class="letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span>${c}</span></button>`).join('')}</div>`
    :`<div class="answer-fields">${t.answer.map((_,i)=>`<div class="answer-field"><label for="answer-${i}">${t.labels[i]}</label><input id="answer-${i}" data-answer="${i}" type="text" inputmode="text" maxlength="80" autocomplete="off" aria-describedby="inputHelp" value="${esc(s.answers[i]||'')}" ${s.verified?'readonly':''}></div>`).join('')}</div><p class="input-help" id="inputHelp">${t.help||"Þú mátt nota kommu, punkt eða almennt brot, t.d. 3/4. Mundu mínusmerki þegar við á."}</p>`;
  $('exercise').innerHTML=`<div class="eyebrow">${D.names[g]}</div><h1 id="heading" tabindex="-1">${t.title}</h1><p class="intro">${t.prompt}</p><div class="board algebra-board">${t.board}</div>${input}<div id="feedback" aria-live="polite" aria-atomic="true"></div><div id="hints" aria-live="polite">${s.hints?`<div class="hint-box"><strong>Vísbending ${s.hints}</strong>${t.hints.slice(0,s.hints).join('<br>')}</div>`:''}</div>`;
  if(s.verified||message)$('feedback').innerHTML=`<div class="feedback ${s.verified?'success':''}"><strong>${s.verified?'Rétt hjá þér':'Skoðum þetta aðeins'}</strong>${s.verified?t.explain:message}</div>`;
  $('back').disabled=state.index===0;$('hint').hidden=false;$('hint').disabled=s.verified||s.hints>=t.hints.length;$('check').hidden=false;
  $('check').textContent=s.verified?(state.index===CORE-1?'Ljúka kjarnaæfingu':state.index===COUNT-1?'Sjá yfirlit':'Áfram →'):'Athuga svar →';
  document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{s.choice=Number(b.dataset.choice);message='';render();document.querySelector(`[data-choice="${s.choice}"]`).focus({preventScroll:true});});
  document.querySelectorAll('[data-answer]').forEach(input=>{
    input.oninput=()=>{while(s.answers.length<t.answer.length)s.answers.push('');s.answers[Number(input.dataset.answer)]=input.value;message='';$('feedback').innerHTML='';save();};
    input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();check();}};
  });
  if(focus)$('heading').focus({preventScroll:true});
}
function check(){
  if(state.index===COUNT)return;
  const t=D.tasks(state.seed)[state.index],s=state.steps[state.index];
  if(s.verified){state.last=state.index;state.index=(state.index===CORE-1||state.index===COUNT-1)?COUNT:state.index+1;message='';render(true);window.scrollTo(0,0);return;}
  if(t.type==='choice'&&s.choice===null)message='Veldu svarmöguleika fyrst.';
  else if(t.type!=='choice'&&t.answer.some((_,i)=>parseNumber(s.answers[i]||'')===null))message='Skráðu tölu eða gilt brot í hvern svarreit.';
  else{
    s.attempts=Math.min(100000,s.attempts+1);s.verified=isCorrect(t,s);
    if(!s.verified){
      if(t.type==='coefficients'){
        const misses=t.answer.map((n,i)=>sameNumber(parseNumber(s.answers[i]||''),n)?null:i).filter(i=>i!==null);
        if(misses.length===1)message=`Skoðaðu þennan reit aftur: ${t.labels[misses[0]]}. ${t.answer.length===2?'Hinn reiturinn er réttur.':'Hinir reitirnir eru réttir.'}`;
        else message=t.wrong||'Margfaldaðu hvorn lið fyrri svigans við báða liði seinni svigans. Dragðu síðan saman líka liði.';
      }else message=t.wrong||'Settu gildið inn alls staðar í stæðunni. Reiknaðu veldi á undan margföldun og samlagningu.';
    }
  }
  render();
  $('announcer').textContent=$('feedback').textContent;
  if(s.verified)$('check').focus({preventScroll:true});else document.querySelector('[data-answer]')?.focus({preventScroll:true});
}
function renderSummary(){
  const done=state.steps.slice(0,CORE).filter(s=>s.verified).length,complete=done===CORE,extra=state.steps.slice(CORE).filter(s=>s.verified).length;
  $('stepcount').textContent='Yfirlit';$('subcount').textContent=`${done} af ${CORE} kjarnaskrefum lokið`;$('hint').hidden=true;$('check').hidden=true;$('back').disabled=false;
  $('exercise').innerHTML=`<div class="summary"><div class="seal" aria-hidden="true">${complete?'✓':'↗'}</div><div class="eyebrow">Algebra VI · 5. tími</div><h1 id="heading" tabindex="-1">${complete?'Vel gert. Kjarnaæfingunni er lokið.':'Haltu áfram að æfa þig.'}</h1><p class="intro">${complete?'Þú hefur æft margföldun tvíliða með formerkjum, ólíkum breytum og stuðlum sem eru tugabrot.':'Veldu ólokinn hluta í yfirlitinu eða haltu áfram hér.'}</p><ul class="summary-list">${D.names.filter((_,i)=>i<CORE_GROUPS&&doneGroup(i)).map(n=>`<li>${n}</li>`).join('')}</ul>${complete?`<p class="callout">Pipraða viðbótin byggir á samokareglu og ferningsreglum úr <a href="../../#timi-6" target="_top">6. tíma</a> og <a href="../../#timi-7" target="_top">7. tíma</a>.</p><p class="callout">Valfrjáls viðbót: ${extra} af ${COUNT-CORE} skrefum lokið.</p><button class="primary" id="extra">${extra===COUNT-CORE?'Skoða viðbótina aftur':'Prófa pipruðu viðbótina'} →</button><button class="quiet restart" id="again">Æfa aftur með nýjum tölum</button>`:'<button class="primary" id="continue">Halda áfram →</button>'}<p class="storage-note">${storageNote()}</p></div>`;
  if($('extra'))$('extra').onclick=()=>{state.index=CORE;message='';render(true);};
  if($('again'))$('again').onclick=()=>{state=cleanState((state.seed+1)%3);message='';render(true);};
  if($('continue'))$('continue').onclick=()=>{state.index=state.steps.findIndex((s,i)=>i<CORE&&!s.verified);message='';render(true);};
}
$('check').onclick=check;
$('hint').onclick=()=>{const t=D.tasks(state.seed)[state.index],s=state.steps[state.index];s.hints=Math.min(s.hints+1,t.hints.length);render();$('announcer').textContent=$('hints').textContent;};
$('back').onclick=()=>{state.index=state.index===COUNT?state.last:Math.max(0,state.index-1);message='';render(true);};
$('outline').onclick=()=>{
  $('outlineItems').innerHTML=D.names.map((n,i)=>`<button class="outline-item" data-goto="${D.starts[i]}"><span>${i<CORE_GROUPS?i+1:'+'}</span>${n}${i>=CORE_GROUPS?' (valfrjálst)':''}<small>${doneGroup(i)?'Lokið':''}</small></button>`).join('');
  $('outlineDialog').querySelector('.storage-note').textContent=storageNote();
  document.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>{state.index=Number(b.dataset.goto);message='';$('outlineDialog').close();render(true);});$('outlineDialog').showModal();
};
$('closeDialog').onclick=()=>$('outlineDialog').close();
render();
