'use strict';
const ExerciseData=(()=>{
 const names=['Dreifireglan','Þættir og tvær breytur','Margfalda veldi','Þrír liðir í sviga','Sameina og setja inn gildi','Mínus og innsetning','Fleiri stæður','Rúmmál og yfirborðsflatarmál','Ummál og flatarmál','Rétthyrningur í hlutum'];
 const starts=[0,2,4,6,7,11,13,15,17,19],coreCount=15,coreGroups=7;
 const variants=[
  {intro:[3,2,5],power:[3,2],cross:[2,4,3],right:[2,5,3],high:[4,3,2],mixed:[1,3,2],three:[2,3,4,5],sums:[2,3,2,4,3,2,1,2,1,2,3,-2],dec:[3,4,2,5,3,1,4,20,-4],pair:[4,3,2,5,-3],constant:[11,3,2,4],two:[3,2,4],box:[3,2],rectangle:7,grid:[5,8]},
  {intro:[4,3,2],power:[2,5],cross:[3,2,5],right:[3,4,2],high:[3,4,5],mixed:[2,2,5],three:[3,2,5,4],sums:[3,2,1,2,2,3,2,3,2,1,4,-3],dec:[2,3,3,4,2,1,5,30,-2],pair:[3,4,5,2,-2],constant:[9,2,4,3],two:[5,2,3],box:[2,3],rectangle:4,grid:[3,9]},
  {intro:[5,2,3],power:[4,3],cross:[4,3,2],right:[4,2,3],high:[2,5,3],mixed:[3,2,4],three:[4,1,3,2],sums:[2,4,3,5,3,2,1,1,1,4,2,-2],dec:[4,2,1,6,5,2,3,15,-3],pair:[2,5,3,4,-4],constant:[8,4,3,2],two:[2,3,5],box:[4,1],rectangle:6,grid:[4,7]}
 ];
 const clean=n=>Number(n.toFixed(10)),fmt=n=>String(typeof n==='number'?clean(n):n).replace('.',',').replace('-','−');
 const mn=n=>`<mn>${fmt(n)}</mn>`,mi=s=>`<mi>${s}</mi>`,mo=s=>`<mo>${s}</mo>`;
 const pow=(s,n)=>`<msup><mrow>${s}</mrow>${mn(n)}</msup>`,br=s=>mo('(')+s+mo(')');
 const variable=s=>[...s.matchAll(/([a-zA-Z])([²³⁴]?)/g)].map(([,v,e])=>e?pow(mi(v),{'²':2,'³':3,'⁴':4}[e]):mi(v)).join('');
 function poly(coefs,vars){let out='';coefs.forEach((n,i)=>{const c=clean(n);if(!c)return;const v=variable(vars[i]);out+=(c<0?mo('−'):out?mo('+'):'')+(v&&Math.abs(c)===1?'':mn(Math.abs(c)))+v;});return out||mn(0);}
 const math=s=>`<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow>${s}</mrow></math>`;
 const splitMath=(...s)=>`<span class="math-parts">${s.map(math).join('')}</span>`;
 const work=(...s)=>`<div class="working">${s.map(x=>Array.isArray(x)?splitMath(...x):math(x)).join('')}</div>`;
 const given=(...s)=>`<div class="given-list">${s.map(x=>`<p>${x}</p>`).join('')}</div>`;
 const factor=(k,v,coefs,vars)=>poly([k],[v])+br(poly(coefs,vars));
 const coeff=(part,title,prompt,board,answer,vars,explain,hints,wrong)=>({part,title,prompt,board,type:'coefficients',answer:answer.map(clean),labels:vars.map(v=>v?'Stuðull við '+v:'Fasti'),explain,hints,wrong,help:'Fasti er liður án breytu. Skráðu tölur með formerkjum. Skráðu 0 ef liður fellur út. Komma og punktur eru bæði leyfð.'});
 const number=(part,title,prompt,board,value,explain,hints)=>({part,title,prompt,board,type:'number',answer:[clean(value)],labels:['Gildi stæðunnar'],explain,hints});
 const choice=(part,title,prompt,board,options,correct,explain,hints,wrong)=>({part,title,prompt,board,type:'choice',options,correct,explain,hints,wrong});
 const geoNote=v=>`<p class="geometry-note">Allar lengdir eru í cm og ${v} &gt; 0.</p>`;
 function box(m,c){return `<svg class="geometry" viewBox="0 0 460 340" role="img" aria-label="Rétthyrndur kassi. Breidd og hæð eru x og dýpt er ${m}x + ${c}."><path class="edge" d="M80 95L190 35H380L270 95Z" fill="#fbefd1"/><path class="edge" d="M270 95L380 35V225L270 285Z" fill="#dbe4bd"/><path class="edge" d="M80 95H270V285H80Z" fill="#f5dba0"/><path class="hidden-edge" d="M190 35V225H380M190 225L80 285"/><text x="175" y="317">x</text><text x="46" y="198">x</text><text x="355" y="286">${m}x + ${c}</text></svg>${geoNote('x')}`;}
 function rectangle(c){return `<svg class="geometry" viewBox="0 0 500 280" role="img" aria-label="Rétthyrningur með hliðarlengdir x og x + ${c}."><path class="edge" d="M100 70H440V230H100Z" fill="#f5dfad"/><text x="270" y="48">x + ${c}</text><text x="65" y="159">x</text></svg>${geoNote('x')}`;}
 function grid(h,w){return `<svg class="geometry" viewBox="0 0 500 340" role="img" aria-label="Rétthyrningur skiptur í fjóra hluta. Breiddin er y + ${w} og hæðin y + ${h}. Innri línur eru ekki hluti af ytra ummáli."><path d="M95 70H235V165H95Z" fill="#dce5c1"/><path d="M235 70H435V165H235Z" fill="#f5dba0"/><path d="M95 165H235V285H95Z" fill="#fbefd1"/><path d="M235 165H435V285H235Z" fill="#d7e6eb"/><path class="edge" d="M95 70H435V285H95ZM235 70V285M95 165H435" fill="none"/><text x="165" y="49">y</text><text x="335" y="49">${w}</text><text x="65" y="124">${h}</text><text x="65" y="233">y</text></svg>${geoNote('y')}`;}
 function tasks(seed){
  const d=variants[seed],q=[];
  let [k,a,b]=d.intro;
  q.push(choice(0,'Margfaldaðu við báða liðina','Hvaða stæða fæst þegar margfaldað er inn í svigann?',math(factor(k,'',[a,b],['x',''])),[
   math(poly([k*a,b],['x',''])),math(poly([k*a,k*b],['x',''])),math(poly([k+a,b],['x','']))],1,
   work(mn(k)+mo('·')+poly([a],['x'])+mo('+')+mn(k)+mo('·')+mn(b),mo('=')+poly([k*a,k*b],['x',''])),
   ['Þátturinn utan svigans margfaldar alla liði innan hans.','Bæði x-liðurinn og fastinn eiga að margfaldast með sömu tölu.'],'Margfalda þarf bæði x-liðinn og fastann með tölunni utan svigans.'));
  [k,a]=d.power;
  q.push(coeff(0,'Bókstafur utan svigans','Margfaldaðu inn í svigann og skráðu stuðlana.',math(factor(k,'x',[a,1],['','x²'])),[k,k*a],['x³','x'],
   work(poly([k*a,k],['x','x³']),mo('=')+poly([k,k*a],['x³','x'])),['Margfaldaðu bæði fastann og x² með öllum þættinum utan svigans.','x · x² = x³. Stuðlarnir margfaldast líka.']));
  [k,a,b]=d.cross;
  q.push(coeff(1,'Tvær breytur í sviga','Margfaldaðu inn í svigann. Skráðu stuðlana við x² og xy.',math(factor(k,'x',[a,-b],['x','y'])),[k*a,-k*b],['x²','xy'],
   work([poly([k],['x'])+mo('·')+poly([a],['x']),mo('−')+poly([k],['x'])+mo('·')+poly([b],['y'])],mo('=')+poly([k*a,-k*b],['x²','xy'])),['Margfaldaðu stuðla saman og bókstafahluta saman.','x · x = x², en x · y = xy. Mínusmerkið helst við seinni liðinn.']));
  [a,b,k]=d.right;
  q.push(coeff(1,'Þátturinn hægra megin','Margfaldaðu inn í svigann og skráðu stuðlana.',math(br(poly([a,-b],['x²','x']))+poly([k],['x'])),[a*k,-b*k],['x³','x²'],
   work([poly([a],['x²'])+mo('·')+poly([k],['x']),mo('−')+poly([b],['x'])+mo('·')+poly([k],['x'])],mo('=')+poly([a*k,-b*k],['x³','x²'])),['Þátturinn utan svigans getur staðið hægra megin líka.','Margfaldaðu hvorn lið innan svigans með þættinum hægra megin.']));
  [k,a,b]=d.high;
  q.push(coeff(2,'Hærri veldi','Margfaldaðu inn í svigann. Skráðu fyrst stuðulinn við y⁴ og síðan við y³.',math(factor(k,'y²',[a,-b],['y','y²'])),[-k*b,k*a],['y⁴','y³'],
   work(poly([k*a,-k*b],['y³','y⁴']),mo('=')+poly([-k*b,k*a],['y⁴','y³'])),['Við margföldun velda með sama veldisstofni leggjast veldisvísarnir saman.','y² · y = y³ og y² · y² = y⁴. Athugaðu formerki liðanna.']));
  [k,a,b]=d.mixed;
  q.push(coeff(2,'Fylgstu með báðum bókstöfunum','Margfaldaðu inn í svigann. Skráðu stuðlana við a³x og ax⁴.',math(factor(k,'ax',[a,-b],['a²','x³'])),[k*a,-k*b],['a³x','ax⁴'],
   work([poly([k],['ax'])+mo('·')+poly([a],['a²']),mo('−')+poly([k],['ax'])+mo('·')+poly([b],['x³'])],mo('=')+poly([k*a,-k*b],['a³x','ax⁴'])),['Allur þátturinn utan svigans margfaldar hvorn lið.','a · a² = a³ í fyrra margfeldinu. Í því síðara er x · x³ = x⁴; a er áfram með.']));
  let c;
  [k,a,b,c]=d.three;
  q.push(coeff(3,'Enginn liður má gleymast','Margfaldaðu inn í svigann og skráðu alla þrjá stuðlana.',math(factor(k,'x',[a,-b,c],['x²','x',''])),[k*a,-k*b,k*c],['x³','x²','x'],
   work([poly([k*a],['x³']),poly([-k*b],['x²'])+mo('+')+poly([k*c],['x'])]),['Dreifireglan gildir líka þegar þrír liðir eru í sviganum.','Margfaldaðu við x²-liðinn, x-liðinn og fastann.']));
  const [K,A,B,C,L,E,F,G,M,H,J,v]=d.sums;
  const sumCo=[K*A-L*E,K*B+L*F+M*H,K*C+L*G-M*J],sumVars=['y³','y²','y'];
  const sumBoard=splitMath(factor(K,'y',[A,B,C],['y²','y','']),mo('−')+factor(L,'y',[E,-F,-G],['y²','y','']),mo('+')+factor(M,'y',[H,-J],['y','']));
  q.push(coeff(4,'Margfaldaðu og sameinaðu','Einfaldaðu alla stæðuna. Skráðu stuðlana, einnig 0 ef liður fellur út.',sumBoard,sumCo,sumVars,
   work([poly([K*A,K*B,K*C],sumVars),poly([-L*E,L*F,L*G],sumVars),mo('+')+poly([M*H,-M*J],['y²','y'])],mo('=')+poly(sumCo,sumVars)),
   ['Margfaldaðu inn í hvern sviga áður en þú sameinar líka liði.','Mínusmerkið fyrir framan svigann í miðjunni fylgir þættinum utan hans. Við margföldunina skiptir hver liður innan svigans um formerki.']));
  let value=sumCo[0]*v**3+sumCo[1]*v*v+sumCo[2]*v;
  q.push(number(4,'Notaðu einfölduðu stæðuna',`Reiknaðu gildið þegar y = ${fmt(v)}.`,given(math(poly(sumCo,sumVars)),math(mi('y')+mo('=')+mn(v))),value,
   work(poly([sumCo[0]*v**3,sumCo[1]*v*v,sumCo[2]*v],['','','']),mo('=')+mn(value)),['Settu gefna tölu í stað y alls staðar í einfölduðu stæðunni.','Önnur veldi neikvæðra talna eru jákvæð, en þriðju veldi þeirra eru neikvæð.']));
  const [P,T,Q,U,W,R,Z,S,t]=d.dec,p=P/10,j=Q/10,r=R/10;
  const decCo=[(-P+Q*U-R*Z)/10,(P*T-Q*W)/10,R*S/10],decVars=['t²','t',''];
  q.push(coeff(4,'Stuðlar sem eru tugabrot','Margfaldaðu inn í svigana, sameinaðu líka liði og skráðu stuðlana og fastann.',splitMath(factor(p,'t',[T,-1],['','t']),mo('+')+factor(j,'t',[U,-W],['t','']),mo('−')+factor(r,'',[Z,-S],['t²',''])),decCo,decVars,
   work([poly([-p,p*T],['t²','t']),mo('+')+poly([j*U,-j*W],['t²','t']),poly([-r*Z,r*S],['t²',''])],mo('=')+poly(decCo,decVars)),
   ['Margfaldaðu þáttinn utan svigans við hvern lið innan hans.','Dragðu saman t²-liðina, t-liðina og fastana. Mínus fyrir síðasta sviga nær til beggja liða hans.']));
  value=decCo[0]*t*t+decCo[1]*t+decCo[2];
  q.push(number(4,'Settu inn neikvætt gildi',`Reiknaðu gildi einfölduðu stæðunnar þegar t = ${fmt(t)}.`,given(math(poly(decCo,decVars)),math(mi('t')+mo('=')+mn(t))),value,
   work(poly([decCo[0]*t*t,decCo[1]*t,decCo[2]],['','','']),mo('=')+mn(value)),['Reiknaðu t² áður en þú margfaldar með stuðlinum.','Athugaðu formerki hvers liðar og dragðu síðan saman.']));
  const [u,h,w,z,x]=d.pair,pairCo=[u+w,u*h-w*z],pairVars=['x²','x'];
  q.push(coeff(5,'Neikvæður þáttur fyrir sviga','Margfaldaðu inn í báða svigana og einfaldaðu.',splitMath(factor(u,'x',[1,h],['x','']),mo('−')+factor(w,'x',[z,-1],['','x'])),pairCo,pairVars,
   work([poly([u,u*h],pairVars),poly([-w*z,w],['x','x²'])],mo('=')+poly(pairCo,pairVars)),['Líttu á mínusmerkið og þáttinn fyrir framan seinni svigann sem eina heild.','Margföldun tveggja neikvæðra þátta gefur jákvætt margfeldi.']));
  value=pairCo[0]*x*x+pairCo[1]*x;
  q.push(number(5,'Reiknaðu eftir einföldun',`Reiknaðu gildið þegar x = ${fmt(x)}.`,given(math(poly(pairCo,pairVars)),math(mi('x')+mo('=')+mn(x))),value,
   work(poly([pairCo[0]*x*x,pairCo[1]*x],['','']),mo('=')+mn(value)),['Settu gildið inn í einfölduðu stæðuna.','Talan í öðru veldi og talan í fyrsta veldi hafa ekki endilega sama formerki.']));
  [a,k,b,c]=d.constant;
  q.push(coeff(6,'Fastinn utan svigans','Einfaldaðu. Skráðu stuðulinn við x og fastann.',math(mn(a)+mo('−')+factor(k,'',[b,-c],['','x'])),[k*c,a-k*b],['x',''],
   work(poly([a,-k*b,k*c],['','','x']),mo('=')+poly([k*c,a-k*b],['x',''])),['Fastinn fremst er lagður við það sem fæst úr margfölduninni. Hann margfaldar ekki svigann.','Neikvæði þátturinn fyrir sviganum margfaldar báða liðina.']));
  [a,k,b]=d.two;
  q.push(coeff(6,'Dragðu saman líka liði','Margfaldaðu inn í svigana og einfaldaðu. Skráðu stuðlana við x², xy og y².',splitMath(factor(a,'x',[1,-k],['x','y']),mo('+')+factor(b,'y',[1,-k],['x','y'])),[a,b-a*k,-b*k],['x²','xy','y²'],
   work([poly([a,-a*k],['x²','xy']),mo('+')+poly([b,-b*k],['xy','y²'])],mo('=')+poly([a,b-a*k,-b*k],['x²','xy','y²'])),['Margfaldaðu inn í báða svigana. Mundu að yx og xy hafa sama gildi.','Sameinaðu xy-liðina. x² og y² eru ólíkir liðir og sameinast ekki.']));
  const [m,n]=d.box;
  q.push(coeff(7,'Rúmmál kassans','Skrifaðu einfaldaða stæðu fyrir rúmmál kassans í cm³. Skráðu stuðlana.',box(m,n),[m,n],['x³','x²'],
   work(mi('R')+mo('=')+mi('x')+mo('·')+mi('x')+mo('·')+br(poly([m,n],['x',''])),mo('=')+poly([m,n],['x³','x²']))+' cm³.',
   ['Rúmmál kassa er lengd · breidd · hæð.','Margfaldaðu fyrst x · x. Margfaldaðu síðan x² inn í svigann.'],'Notaðu allar þrjár brúnarlengdirnar í margfeldi fyrir rúmmál.'));
  q.push(coeff(7,'Allir sex fletirnir','Skrifaðu einfaldaða stæðu fyrir yfirborðsflatarmál kassans í cm².',box(m,n),[2+4*m,4*n],['x²','x'],
   work([mi('YF')+mo('=')+poly([2],['x²']),mo('+')+factor(4,'x',[m,n],['x',''])],mo('=')+poly([2+4*m,4*n],['x²','x']))+' cm².',
   ['Kassinn hefur sex fleti: tvo ferninga með hlið x og fjóra rétthyrninga með hliðar x og '+m+'x + '+n+'.','Leggðu saman flatarmálin: 2x² + 4x('+m+'x + '+n+'). Margfaldaðu svo inn í svigann.'],'Yfirborðsflatarmálið er samanlagt flatarmál allra sex flata kassans.'));
  c=d.rectangle;
  q.push(coeff(8,'Ummál rétthyrnings','Skrifaðu einfaldaða stæðu fyrir ummál rétthyrningsins í cm.',rectangle(c),[4,2*c],['x',''],
   work(mi('U')+mo('=')+poly([2],['x'])+mo('+')+factor(2,'',[1,c],['x','']),mo('=')+poly([4,2*c],['x','']))+' cm.',
   ['Ummál er summa lengda allra fjögurra hliðanna.','Tvær hliðar eru x og tvær eru x + '+c+'.'],'Leggðu saman lengdir allra fjögurra hliðanna.'));
  q.push(coeff(8,'Flatarmál rétthyrnings','Skrifaðu einfaldaða stæðu fyrir flatarmál rétthyrningsins í cm².',rectangle(c),[1,c],['x²','x'],
   work(mi('F')+mo('=')+factor(1,'x',[1,c],['x','']),mo('=')+poly([1,c],['x²','x']))+' cm².',
   ['Flatarmál rétthyrnings er lengd · breidd.','Margfaldaðu x við báða liðina í x + '+c+'.'],'Margfaldaðu lengd rétthyrningsins með breidd hans.'));
  const [gh,gw]=d.grid;
  q.push(coeff(9,'Ummál ytri jaðarsins','Skrifaðu einfaldaða stæðu fyrir ummál alls rétthyrningsins í cm.',grid(gh,gw),[4,2*(gh+gw)],['y',''],
   work([mi('U')+mo('=')+factor(2,'',[1,gh],['y','']),mo('+')+factor(2,'',[1,gw],['y',''])],mo('=')+poly([4,2*(gh+gw)],['y','']))+' cm.',
   ['Finndu heildarbreiddina og heildarhæðina með því að leggja hluta hliðanna saman.','Teldu aðeins ytri jaðarinn. Innri strikin teljast ekki með í ummálinu.'],'Notaðu heildarlengdir ytri hliðanna; innri strikin teljast ekki með.'));
  q.push(coeff(9,'Flatarmál fjögurra hluta','Finndu flatarmál hvers hluta og leggðu saman. Skráðu stuðla einfaldaðrar stæðu fyrir allt flatarmálið í cm².',grid(gh,gw),[1,gh+gw,gh*gw],['y²','y',''],
   work([mi('F')+mo('=')+poly([1,gh],['y²','y']),mo('+')+poly([gw,gh*gw],['y',''])],mo('=')+poly([1,gh+gw,gh*gw],['y²','y','']))+' cm².',
   ['Hver litaður hluti er rétthyrningur. Margfaldaðu hliðarlengdir hans.','Flatarmálin eru y², '+gh+'y, '+gw+'y og '+(gh*gw)+'. Leggðu saman líka liði.'],'Leggðu saman flatarmál allra fjögurra lituðu hlutanna.'));
  return q;
 }
 return {names,starts,coreCount,coreGroups,variants,tasks,group:pos=>starts.findLastIndex(x=>pos>=x),fmt};
})();
