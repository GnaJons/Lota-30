'use strict';
const ExerciseData=(()=>{
 const names=['Fjögur margfeldi','Fleiri breytur','Röð liða og stuðlar','Ólíkir bókstafahlutar','Stuðlar sem eru tugabrot','Liðir falla út','Þrjár reglur','Lengri stæður í hlutum'];
 const starts=[0,3,5,7,9,11,13,17],coreCount=13,coreGroups=6;
 const variants=[
  {intro:[5,8],negative:[6,4],both:[3,8],four:[2,-1,1,3],shared:[2,-3],reverse:[5,8],weighted:[2,-3,3,-5],distinct:[2,3,1,-4],mixed:[2,3,5,-2],decimal:[3,-2,2,1.5],mixedDec:[2,3,.4,-5],conj:[3,2],reverseConj:[6,2],plus:[2,3],minus:[3,4],ruleConj:[5,2],long:[3,2,4,2,3,2,3],fractions:[36,18,36,3,2,6]},
  {intro:[2,7],negative:[5,2],both:[2,5],four:[3,2,1,-2],shared:[-3,-2],reverse:[7,4],weighted:[4,-5,2,3],distinct:[3,-2,1,5],mixed:[3,-2,4,5],decimal:[2,1.2,4,-.5],mixedDec:[3,-2,.5,4],conj:[4,5],reverseConj:[5,3],plus:[3,2],minus:[2,5],ruleConj:[4,3],long:[4,3,5,1,2,3,2],fractions:[16,8,64,4,4,8]},
  {intro:[3,6],negative:[4,7],both:[5,7],four:[1,-2,2,-3],shared:[4,2],reverse:[4,6],weighted:[3,4,5,-2],distinct:[1,4,2,-3],mixed:[5,2,2,-3],decimal:[.5,-3,6,-2],mixedDec:[4,5,.3,-2],conj:[2,6],reverseConj:[7,2],plus:[4,1],minus:[4,3],ruleConj:[3,5],long:[5,2,3,3,4,2,4],fractions:[25,50,100,5,5,10]}
 ];
 const clean=n=>Number(n.toFixed(10)),fmt=n=>String(typeof n==='number'?clean(n):n).replace('.',',').replace('-','−');
 const mn=n=>`<mn>${fmt(n)}</mn>`,mi=s=>`<mi>${s}</mi>`,mo=s=>`<mo>${s}</mo>`;
 const pow=(s,n=2)=>`<msup><mrow>${s}</mrow>${mn(n)}</msup>`,br=s=>mo('(')+s+mo(')');
 const fraction=(a,b)=>`<mfrac><mrow>${a}</mrow><mrow>${b}</mrow></mfrac>`;
 const rational=n=>Number.isInteger(n)?mn(n):fraction(mn(n*2),mn(2));
 const variable=s=>[...s.matchAll(/([a-zA-Z])([²³⁴]?)/g)].map(([,v,e])=>e?pow(mi(v),{'²':2,'³':3,'⁴':4}[e]):mi(v)).join('');
 function poly(coefs,vars,exact=false){let out='';coefs.forEach((n,i)=>{const c=clean(n);if(!c)return;const v=variable(vars[i]);out+=(c<0?mo('−'):out?mo('+'):'')+(v&&Math.abs(c)===1?'':(exact?rational:mn)(Math.abs(c)))+v;});return out||mn(0);}
 const math=s=>`<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow>${s}</mrow></math>`;
 const splitMath=(...s)=>`<span class="math-parts">${s.map(math).join('')}</span>`;
 const work=(...s)=>`<div class="working">${s.map(x=>Array.isArray(x)?splitMath(...x):math(x)).join('')}</div>`;
 const given=(...s)=>`<div class="given-list">${s.map(x=>`<p>${x}</p>`).join('')}</div>`;
 const product=(co,vars1=['x',''],vars2=vars1)=>br(poly(co.slice(0,2),vars1))+br(poly(co.slice(2),vars2));
 const fourProducts=([a,b,c,d])=>[a*c,a*d,b*c,b*d];
 const quadratic=([a,b,c,d])=>[a*c,a*d+b*c,b*d];
 const coeff=(part,title,prompt,board,answer,vars,explain,hints,wrong)=>({part,title,prompt,board,type:'coefficients',answer:answer.map(clean),labels:vars.map(v=>v?'Stuðull við '+v:'Fasti'),explain,hints,wrong,help:'Fasti er liður án breytu. Skráðu tölur með formerkjum; 0 ef liður fellur út. Þú mátt nota kommu, punkt eða brot, t.d. 3/4.'});
 const choice=(part,title,prompt,board,options,correct,explain,hints,wrong)=>({part,title,prompt,board,type:'choice',options,correct,explain,hints,wrong});
 function introGrid(a,b){return `<svg class="geometry intro-grid" viewBox="0 0 500 310" role="img" aria-label="Rétthyrningur með hliðar x + ${a} og x + ${b}. Fjórir litafletir sýna skiptingu hans."><path d="M100 65H280V180H100Z" fill="#fbefd1"/><path d="M280 65H440V180H280Z" fill="#dce5c1"/><path d="M100 180H280V270H100Z" fill="#d7e6eb"/><path d="M280 180H440V270H280Z" fill="#f5dba0"/><path class="edge" d="M100 65H440V270H100ZM280 65V270M100 180H440" fill="none"/><text x="190" y="45">x</text><text x="360" y="45">${b}</text><text x="65" y="130">x</text><text x="65" y="233">${a}</text></svg><p class="geometry-note">Skýringarmynd fyrir x &gt; 0.</p>`;}
 const expandExplanation=(co,vars=['x²','x',''])=>{
  const f=fourProducts(co),v=[vars[0],vars[1],vars[1],vars[2]];
  return work([poly(f.slice(0,2),v.slice(0,2)),(f[2]>=0?mo('+'):'')+poly(f.slice(2),v.slice(2))],mo('=')+poly(quadratic(co),vars));
 };
 function tasks(seed){
  const d=variants[seed],q=[],xvars=['x²','x',''];let [a,b]=d.intro;
  q.push(choice(0,'Hver liður við báða liðina','Hvaða útreikningur hefur öll fjögur margfeldin? Skoðaðu líka litafletina fjóra.',math(product([1,a,1,b]))+introGrid(a,b),[
   math(poly([1,a*b],['x²',''])),splitMath(poly([1,b],['x²','x']),mo('+')+mn(a*b)),splitMath(poly([1,b],['x²','x']),mo('+')+poly([a,a*b],['x','']))],2,
   expandExplanation([1,a,1,b]),['Margfaldaðu hvorn lið fyrri svigans við báða liði seinni svigans.','Þú þarft x · x, x · '+b+', '+a+' · x og '+a+' · '+b+'.'], 'Öll fjögur margfeldin þurfa að vera með, áður en líkir liðir eru sameinaðir.'));
  [a,b]=d.negative;let co=[1,a,1,-b];
  q.push(coeff(0,'Plús í öðrum, mínus í hinum','Margfaldaðu tvíliðurnar og dragðu saman líka liði.',math(product(co)),quadratic(co),xvars,expandExplanation(co),['Reiknaðu fjögur margfeldi. Formerkið fylgir liðnum.','Fastinn í seinni sviganum er neikvæður. Hann margfaldast við báða liði fyrri svigans.']));
  [a,b]=d.both;co=[1,-a,1,-b];
  q.push(coeff(0,'Mínus í báðum svigum','Margfaldaðu tvíliðurnar og skráðu stuðlana og fastann.',math(product(co)),quadratic(co),xvars,expandExplanation(co),['Margfaldaðu hvorn lið fyrri svigans við báða liði seinni svigans.','Margfeldi neikvæðu fastanna er jákvætt. Stuðlar x-liðanna tveggja eru neikvæðir.']));
  co=d.four;const fv=fourProducts(co),fvars=['ax','bx','ay','by'];
  q.push(coeff(1,'Fjórir ólíkir bókstafahlutar','Margfaldaðu tvíliðurnar. Skráðu stuðul við hvern bókstafahluta.',math(product(co,['x','y'],['a','b'])),fv,fvars,
   work([poly(fv.slice(0,2),fvars.slice(0,2)),(fv[2]>=0?mo('+'):'')+poly(fv.slice(2),fvars.slice(2))]),['Hver liður fyrri svigans margfaldast við báða liði seinni svigans.','Hér eru engir líkir liðir til að sameina. Röð þátta breytir ekki margfeldi: xa = ax.']));
  [a,b]=d.shared;const shared=[1,a,b,a*b],sharedVars=['y²','ay','by','ab'];
  q.push(coeff(1,'Einn bókstafur í báðum svigum','Margfaldaðu tvíliðurnar. Sameinaðu aðeins líka liði.',math(product([1,a,1,b],['y','a'],['y','b'])),shared,sharedVars,
   work([poly(shared.slice(0,2),sharedVars.slice(0,2)),(b>=0?mo('+'):'')+poly(shared.slice(2),sharedVars.slice(2))]),['y margfaldast bæði við y og við b-liðinn.','ay og by eru ólíkir bókstafahlutar. Þeir sameinast ekki.']));
  [a,b]=d.reverse;co=[-1,a,1,b];
  q.push(coeff(2,'Fastinn kemur fyrst','Margfaldaðu tvíliðurnar. Gættu að mínusnum fyrir x.',math(br(poly([a,-1],['','x']))+br(poly([1,b],['x','']))),quadratic(co),xvars,
   work([poly([a,a*b],['x','']),poly([-1,-b],['x²','x'])],mo('=')+poly(quadratic(co),xvars)),['Röð liðanna innan svigans breytir ekki aðferðinni.','Liðurinn með mínusmerki fyrir framan x margfaldast við báða liði seinni svigans.']));
  co=d.weighted;
  q.push(coeff(2,'Stuðlar við báða x-liði','Margfaldaðu tvíliðurnar og einfaldaðu.',math(product(co)),quadratic(co),xvars,expandExplanation(co),['Margfaldaðu stuðlana saman og bókstafahlutana saman.','Báðir x-liðirnir sem fást í miðjunni þurfa að vera með áður en þú dregur þá saman.']));
  co=d.distinct;const av=fourProducts(co),avars=['xy','x','y',''];
  q.push(coeff(3,'x í öðrum sviga og y í hinum','Margfaldaðu tvíliðurnar. Skráðu þrjá stuðla og fastann.',math(product(co,['x',''],['y',''])),av,avars,
   work([poly(av.slice(0,2),avars.slice(0,2)),(av[2]>=0?mo('+'):'')+poly(av.slice(2),avars.slice(2))]),['x · y verður xy. Haltu því aðskildu frá x-lið, y-lið og fasta.','Reiknaðu margfeldin fjögur og skráðu stuðlana og fastann í rétta reiti.']));
  co=d.mixed;const mixedVars=['a²','ab','b²'];
  q.push(coeff(3,'Sameinaðu ab-liðina','Margfaldaðu tvíliðurnar og einfaldaðu.',math(product(co,['a','b'])),quadratic(co),mixedVars,expandExplanation(co,mixedVars),['Fyrsta margfeldið inniheldur a² og það síðasta b².','Hin tvö margfeldin innihalda bæði ab. Dragðu stuðla þeirra saman með réttum formerkjum.']));
  co=d.decimal;
  q.push(coeff(4,'Tugabrot í tvíliðu','Margfaldaðu tvíliðurnar. Haltu tugabrotunum nákvæmum.',math(product(co)),quadratic(co),xvars,expandExplanation(co),['Notaðu sömu aðferð og fyrir heilar tölur.','Reiknaðu bæði margfeldin sem innihalda x áður en þú leggur þau saman.']));
  co=d.mixedDec;const decVars=['x²','bx','b²'];
  q.push(coeff(4,'Tugabrot og tvær breytur','Margfaldaðu tvíliðurnar og dragðu saman líka liði.',math(product(co,['x','b'])),quadratic(co),decVars,expandExplanation(co,decVars),['Margfaldaðu stuðlana nákvæmlega. Ekki námunda milliskref.','xb og bx hafa sama gildi. Sameinaðu þessa tvo liði og haltu x² og b² aðskildum.']));
  [a,b]=d.conj;co=[a,b,a,-b];
  q.push(coeff(5,'Hvað verður um x-liðina?','Margfaldaðu tvíliðurnar. Skráðu 0 ef liður fellur út.',math(product(co)),quadratic(co),xvars,expandExplanation(co),['Reiknaðu fjögur margfeldi eins og áður.','x-liðirnir tveir verða með gagnstæðum stuðlum.']));
  [a,b]=d.reverseConj;co=[b,a,-b,a];const yvars=['y²','y',''];
  q.push(coeff(5,'Skoðaðu röðina og formerkin','Margfaldaðu tvíliðurnar. Skráðu stuðlana við y² og y og síðan fastann.',math(br(poly([a,b],['','y']))+br(poly([a,-b],['','y']))),quadratic(co),yvars,expandExplanation(co,yvars),['Margfaldaðu hvorn lið fyrri svigans við báða liði seinni svigans.','Stuðlarnir við y hafa gagnstæð formerki. Stuðullinn við y² verður því neikvæður.']));
  q.push(choice(6,'Þrjár reglur','Pipraða viðbótin notar reglurnar úr 6. og 7. tíma. Í hvaða röð passa heitin við A, B og C?',
   '<div class="rule-list"><p>A: '+math(pow(br(poly([1,1],['a','b']))))+'</p><p>B: '+math(pow(br(poly([1,-1],['a','b']))))+'</p><p>C: '+math(product([1,1,1,-1],['a','b']))+'</p></div>',
   ['Samokareglan · Ferningsregla 1 · Ferningsregla 2','Ferningsregla 1 · Ferningsregla 2 · Samokareglan','Ferningsregla 2 · Ferningsregla 1 · Samokareglan'],1,
   '<p>A: Ferningsregla 1.</p><p>B: Ferningsregla 2.</p><p>C: Samokareglan.</p>',
   ['Ferningsreglurnar fjalla um tvíliðu sem er hafin í annað veldi.','Ferningsregla 1 hefur plús í sviganum. Ferningsregla 2 hefur mínus. Samokareglan tengir summu og mismun sömu liða.'],'Skoðaðu hvort tvíliða er hafin í annað veldi eða hvort tvær samoka tvíliður eru margfaldaðar saman.'));
  [a,b]=d.plus;co=[a,b,a,b];
  q.push(coeff(6,'Ferningsregla 1 í verki','Einfaldaðu stæðuna. Þú mátt líka margfalda tvíliðuna við sjálfa sig.',math(pow(br(poly([a,b],['x',''])))),quadratic(co),xvars,
   expandExplanation(co),['(a + b)² = a² + 2ab + b².','Miðliðurinn er tvöfalt margfeldi liðanna innan svigans.']));
  [a,b]=d.minus;co=[a,-b,a,-b];
  q.push(coeff(6,'Ferningsregla 2 í verki','Einfaldaðu stæðuna og gættu að mínusmerkinu á undan miðliðnum.',math(pow(br(poly([a,-b],['x',''])))),quadratic(co),xvars,
   expandExplanation(co),['(a − b)² = a² − 2ab + b².','Mínus er á undan miðliðnum og plús á undan síðasta liðnum.']));
  [a,b]=d.ruleConj;co=[a,b,a,-b];
  q.push(coeff(6,'Samokareglan í verki','Einfaldaðu stæðuna. Skráðu 0 fyrir lið sem fellur út.',math(product(co)),quadratic(co),xvars,
   work(pow(poly([a],['x']))+mo('−')+pow(mn(b)),mo('=')+poly(quadratic(co),xvars)),['(a + b)(a − b) = a² − b².','Reiknaðu annað veldi stuðulsins og annað veldi bókstafsins í fyrri liðnum.']));
  const [A,B,C,D,E,F,G]=d.long,longVars=['x²','xy','y²'];
  const first=[A,B-C,D];
  const firstParts=[mi('x')+br(poly([A,B],['x','y'])),mo('−')+mi('y')+br(poly([C,-D],['x','y']))];
  q.push(coeff(7,'Byrjaðu á tveimur hlutum','Þessi stæða er fyrsti hluti lengra dæmis. Margfaldaðu inn í svigana og einfaldaðu.',splitMath(...firstParts),first,longVars,
   work([poly([A,B],['x²','xy']),poly([-C,D],['xy','y²'])],mo('=')+poly(first,longVars)),['Reiknaðu hvort margfeldi fyrir sig.','Mínusinn fyrir seinna margfeldinu fylgir y. Sameinaðu síðan xy-liðina.']));
  const total=[A-1+F*F+G*G,B-C-2*F+2*G,D+E*E+2];
  const remaining=[mo('+')+product([E,1,E,-1],['y','x']),mo('+')+pow(br(poly([F,-1],['x','y']))),mo('+')+pow(br(poly([1,G],['y','x'])))];
  q.push(coeff(7,'Sameinaðu allt dæmið','Fyrsti hlutinn er þegar einfaldaður hér. Notaðu reglurnar á hina þrjá hlutana og dragðu saman líka liði.',splitMath(poly(first,longVars),...remaining),total,longVars,
   work(poly(first,longVars),poly([-1,E*E],['x²','y²']),mo('+')+poly([F*F,-2*F,1],longVars),mo('+')+poly([G*G,2*G,1],longVars),mo('=')+poly(total,longVars)),
   ['Notaðu samokaregluna á margfeldi sviganna og ferningsreglurnar á stæðurnar tvær sem eru hafnar í annað veldi.','Safnaðu stuðlum x², xy og y² hverjum fyrir sig. Haltu öllum formerkjum.']));
  const [P,Q,R,dn,en,fn]=d.fractions;
  const xp=fraction(mi('x'),mn(en)),fc=fraction(mn(1),mn(fn));
  const lastProduct=br(xp+mo('+')+fc)+br(fc+mo('−')+xp),last=[R/(en*en),-R/(fn*fn)];
  q.push(coeff(7,'Mínus framan við allt margfeldið','Einfaldaðu þennan hluta lengra dæmis. Skráðu stuðulinn við x² og fastann.',math(mo('−')+mn(R)+lastProduct),last,['x²',''],
   work([mo('−')+mn(R)+mo('·')+br(fraction(mn(1),mn(fn*fn))+mo('−')+fraction(variable('x²'),mn(en*en)))],mo('=')+poly(last,['x²',''],true)),
   ['Tvíliðurnar eru samoka. Reiknaðu annað veldi fastans og dragðu frá annað veldi x-liðarins.','Margfaldaðu síðan neikvæða þáttinn utan sviganna við alla niðurstöðuna.']));
  const full=[P+Q/(dn*dn)+R/(en*en),(-2*P+Q)/dn,P/(dn*dn)+Q/4-R/(fn*fn)];
  const fractionBoard=splitMath(mn(P)+pow(br(mi('x')+mo('−')+fraction(mn(1),mn(dn)))),mo('+')+mn(Q)+pow(br(fraction(mn(1),mn(2))+mo('+')+fraction(mi('x'),mn(dn)))),mo('−')+mn(R)+lastProduct);
  q.push(coeff(7,'Reglur, brot og sameining','Einfaldaðu allt dæmið. Síðasti hlutinn er sá sem þú varst að vinna. Þú mátt skrá stuðla sem brot eða tugabrot; ekki námunda.',fractionBoard,full,xvars,
   work(poly([P,-2*P/dn,P/(dn*dn)],xvars,true),mo('+')+br(poly([Q/(dn*dn),Q/dn,Q/4],xvars,true)),mo('+')+br(poly(last,['x²',''],true)),mo('=')+poly(full,xvars,true)),
   ['Notaðu ferningsreglu á hvora stæðu innan sviga fyrir sig. Margfaldaðu síðan með þættinum framan við svigann.','Notaðu nákvæm brot í milliskrefum og leggðu saman stuðla við x², stuðla við x og fasta.']));
  return q;
 }
 return {names,starts,coreCount,coreGroups,variants,tasks,group:pos=>starts.findLastIndex(x=>pos>=x),fmt};
})();
