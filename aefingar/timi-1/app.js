'use strict';
const $=id=>document.getElementById(id),D=ExerciseData,KEY='ggj-lota30-timi01-aefing-v1';
const CORE=12,COUNT=15;
const cleanState=(seed=0)=>({version:1,seed,index:0,last:0,steps:Array.from({length:COUNT},()=>({choice:null,answers:[],verified:false,hints:0,attempts:0}))});
const integer=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
function parseNumber(value){const s=value.trim().replace('−','-').replace(',','.');return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)&&Number.isFinite(Number(s))?Number(s):null;}
function isCorrect(t,s){return t.type==='choice'?s.choice===t.correct:t.answer.every((n,i)=>parseNumber(s.answers[i]||'')!==null&&Math.abs(parseNumber(s.answers[i])-n)<1e-9);}
function validState(s){
  if(!s||s.version!==1||!integer(s.seed,0,2)||!integer(s.index,0,COUNT)||!integer(s.last,0,COUNT-1)||!Array.isArray(s.steps)||s.steps.length!==COUNT)return false;
  const tasks=D.tasks(s.seed);
  return s.steps.every((v,i)=>v&&typeof v==='object'&&!Array.isArray(v)&&(v.choice===null||integer(v.choice,0,(tasks[i].options?.length||1)-1))&&Array.isArray(v.answers)&&v.answers.length<=2&&v.answers.every(x=>typeof x==='string'&&x.length<=80)&&typeof v.verified==='boolean'&&integer(v.hints,0,tasks[i].hints.length)&&integer(v.attempts,0,100000)&&(!v.verified||isCorrect(tasks[i],v)));
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
  $('progress').innerHTML=D.names.map((_,i)=>`<i class="${doneGroup(i)?'done ':''}${D.group(state.index)===i&&state.index<COUNT?'current':''}"${i>=7?' title="Valfrjáls viðbót"':''}></i>`).join('');
  $('progress').setAttribute('aria-label',`${D.starts.slice(0,7).filter((_,i)=>doneGroup(i)).length} af 7 kjarnahlutum lokið`);
  if(state.index===COUNT){renderSummary();if(focus)$('heading').focus({preventScroll:true});return;}
  const t=D.tasks(state.seed)[state.index],s=state.steps[state.index],g=t.part,phase=state.index-D.starts[g]+1,total=(D.starts[g+1]??COUNT)-D.starts[g];
  $('stepcount').textContent=g<7?`Hluti ${g+1} af 7`:`Valfrjáls viðbót ${g-6} af 2`;
  $('subcount').textContent=`Skref ${phase} af ${total}`;
  let input=t.type==='choice'?`<div class="choices" role="group" aria-label="Svarmöguleikar">${t.options.map((c,i)=>`<button class="choice ${s.choice===i?'selected ':''}${s.verified&&s.choice===i?'correct':''}" data-choice="${i}" aria-pressed="${s.choice===i}" ${s.verified?'disabled':''}><span class="letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span>${c}</span></button>`).join('')}</div>`
    :`<div class="answer-fields">${t.answer.map((_,i)=>`<div class="answer-field"><label for="answer-${i}">${t.answer.length===1?'Gildi brotsins':i===0?'Stuðull':`Veldisvísir á ${t.variable}`}</label><input id="answer-${i}" data-answer="${i}" type="text" inputmode="decimal" maxlength="80" autocomplete="off" aria-describedby="inputHelp" value="${esc(s.answers[i]||'')}" ${s.verified?'readonly':''}></div>`).join('')}</div><p class="input-help" id="inputHelp">Þú mátt nota kommu eða punkt í tugabroti.</p>`;
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
  else if(t.type==='numbers'&&t.answer.some((_,i)=>parseNumber(s.answers[i]||'')===null))message='Skráðu tölu í hvern svarreit.';
  else{
    s.attempts=Math.min(100000,s.attempts+1);s.verified=isCorrect(t,s);
    if(!s.verified){
      if(t.type==='numbers'&&t.answer.length===2){
        const c=Math.abs(parseNumber(s.answers[0])-t.answer[0])<1e-9,e=Math.abs(parseNumber(s.answers[1])-t.answer[1])<1e-9;
        message=c?'Stuðullinn er réttur. Skoðaðu veldisvísinn aftur.':e?'Veldisvísirinn er réttur. Reiknaðu stuðulinn aftur.':'Reiknaðu stuðul og veldisvísi sitt í hvoru lagi. Vísbending getur hjálpað.';
      }else message='Reyndu aftur og skoðaðu hvaða aðgerð á við. Þú getur fengið vísbendingu.';
    }
  }
  render();
  $('announcer').textContent=$('feedback').textContent;
  if(s.verified)$('check').focus({preventScroll:true});else document.querySelector('[data-answer]')?.focus({preventScroll:true});
}
function renderSummary(){
  const done=state.steps.slice(0,CORE).filter(s=>s.verified).length,complete=done===CORE,extra=state.steps.slice(CORE).filter(s=>s.verified).length;
  $('stepcount').textContent='Yfirlit';$('subcount').textContent=`${done} af ${CORE} kjarnaskrefum lokið`;$('hint').hidden=true;$('check').hidden=true;$('back').disabled=false;
  $('exercise').innerHTML=`<div class="summary"><div class="seal" aria-hidden="true">${complete?'✓':'↗'}</div><div class="eyebrow">Algebra VI · 1. tími</div><h1 id="heading" tabindex="-1">${complete?'Vel gert. Kjarnaæfingunni er lokið.':'Haltu áfram að æfa þig.'}</h1><p class="intro">${complete?'Þú hefur æft veldareglur og notað þær við reikning með stæðum, flatarmáli og rúmmáli.':'Veldu ólokinn hluta í yfirlitinu eða haltu áfram hér.'}</p><ul class="summary-list">${D.names.filter((_,i)=>i<7&&doneGroup(i)).map(n=>`<li>${n}</li>`).join('')}</ul>${complete?`<p class="callout">Valfrjáls viðbót: ${extra} af 3 skrefum lokið.</p><button class="primary" id="extra">${extra===3?'Skoða viðbótina aftur':'Prófa pipruðu viðbótina'} →</button><button class="quiet restart" id="again">Æfa aftur með nýjum tölum</button>`:'<button class="primary" id="continue">Halda áfram →</button>'}<p class="storage-note">${storageNote()}</p></div>`;
  if($('extra'))$('extra').onclick=()=>{state.index=CORE;message='';render(true);};
  if($('again'))$('again').onclick=()=>{state=cleanState((state.seed+1)%3);message='';render(true);};
  if($('continue'))$('continue').onclick=()=>{state.index=state.steps.findIndex((s,i)=>i<CORE&&!s.verified);message='';render(true);};
}
$('check').onclick=check;
$('hint').onclick=()=>{const t=D.tasks(state.seed)[state.index],s=state.steps[state.index];s.hints=Math.min(s.hints+1,t.hints.length);render();$('announcer').textContent=$('hints').textContent;};
$('back').onclick=()=>{state.index=state.index===COUNT?state.last:Math.max(0,state.index-1);message='';render(true);};
$('outline').onclick=()=>{
  $('outlineItems').innerHTML=D.names.map((n,i)=>`<button class="outline-item" data-goto="${D.starts[i]}"><span>${i<7?i+1:'+'}</span>${n}${i>=7?' (valfrjálst)':''}<small>${doneGroup(i)?'Lokið':''}</small></button>`).join('');
  $('outlineDialog').querySelector('.storage-note').textContent=storageNote();
  document.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>{state.index=Number(b.dataset.goto);message='';$('outlineDialog').close();render(true);});$('outlineDialog').showModal();
};
$('closeDialog').onclick=()=>$('outlineDialog').close();
render();
