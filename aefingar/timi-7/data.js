'use strict';
const ExerciseData=(()=>{
 const names=['Fyrri ferningsreglan','Seinni ferningsreglan','Tvær breytur','Stuðlar og röð liða','Fasti sem er brot','Stuðull sem er brot','Fjórir fletir í ferningi','Reglur í lengri stæðum'];
 const starts=[0,2,4,6,8,11,14,16],coreCount=14,coreGroups=6;
 const variants=[
  {unitPlus:6,plus:[4,3],unitMinus:7,minus:[2,7],twoPlus:[2,5],twoMinus:[3,4],reverse:[7,2],scaled:[4,6],fractionConstant:[2,3],decimalConstant:[3,.4],reverseFraction:[3,5,2],decimal:[.3,1.5],fractionMinus:[2,3,2],fractionPlus:[3,4,2],combined:5,long:[3,2,5,2,3,2,3,2,1]},
  {unitPlus:8,plus:[3,5],unitMinus:6,minus:[5,2],twoPlus:[4,3],twoMinus:[2,5],reverse:[8,3],scaled:[2,8],fractionConstant:[1,3],decimalConstant:[5,.2],reverseFraction:[2,5,4],decimal:[.6,1.2],fractionMinus:[3,5,2],fractionPlus:[2,3,3],combined:3,long:[4,3,2,3,2,3,2,4,1]},
  {unitPlus:5,plus:[2,6],unitMinus:8,minus:[3,5],twoPlus:[5,2],twoMinus:[4,5],reverse:[6,3],scaled:[5,7],fractionConstant:[3,5],decimalConstant:[2,.6],reverseFraction:[4,5,3],decimal:[.5,1.8],fractionMinus:[4,5,3],fractionPlus:[5,6,2],combined:6,long:[2,4,3,2,4,1,4,2,3]}
 ];
 const clean=n=>Number(n.toFixed(10)),fmt=n=>String(typeof n==='number'?clean(n):n).replace('.',',').replace('-','−');
 const mn=n=>`<mn>${fmt(n)}</mn>`,mi=s=>`<mi>${s}</mi>`,mo=s=>`<mo>${s}</mo>`;
 const pow=(s,n=2)=>`<msup><mrow>${s}</mrow>${mn(n)}</msup>`,br=s=>mo('(')+s+mo(')');
 const frac=(a,b)=>`<mfrac><mrow>${a}</mrow><mrow>${b}</mrow></mfrac>`;
 function rational(n){for(let d=1;d<=1000;d++)if(Math.abs(n*d-Math.round(n*d))<1e-8)return d===1?mn(Math.round(n)):frac(mn(Math.round(n*d)),mn(d));throw new Error('No exact small fraction for '+n);}
 const variable=s=>[...s.matchAll(/([a-zA-Z])([²³⁴]?)/g)].map(([,v,e])=>e?pow(mi(v),{'²':2,'³':3,'⁴':4}[e]):mi(v)).join('');
 function poly(coefs,vars,exact=false){let out='';coefs.forEach((n,i)=>{if(!n)return;const v=variable(vars[i]);out+=(n<0?mo('−'):out?mo('+'):'')+(v&&Math.abs(n)===1?'':(exact?rational:mn)(Math.abs(n)))+v;});return out||mn(0);}
 const math=s=>`<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow>${s}</mrow></math>`;
 const splitMath=(...s)=>`<span class="math-parts">${s.map(math).join('')}</span>`;
 const work=(...s)=>`<div class="working">${s.map(x=>Array.isArray(x)?splitMath(...x):math(x)).join('')}</div>`;
 const square=(u,v,minus=false)=>pow(br(u+mo(minus?'−':'+')+v));
 const conj=(u,v)=>br(u+mo('+')+v)+br(u+mo('−')+v);
 const squareAnswer=(m,n,minus=false)=>[clean(m*m),clean((minus?-2:2)*m*n),clean(n*n)];
 function explanation(u,v,answer,vars,minus=false,exact=false){
  return work([pow(br(u)),mo(minus?'−':'+')+mn(2)+mo('·')+br(u)+mo('·')+br(v),mo('+')+pow(br(v))],mo('=')+poly(answer,vars,exact));
 }
 const coeff=(part,title,prompt,board,answer,vars,explain,hints)=>({part,title,prompt,board,type:'coefficients',answer,labels:vars.map(v=>v?'Stuðull við '+v:'Fasti'),explain,hints,help:'Fasti er liður án breytu. Skráðu tölur með formerkjum; 0 ef liður fellur út. Þú mátt nota kommu, punkt eða brot, t.d. 3/4.'});
 const choice=(part,title,prompt,board,options,correct,explain,hints,wrong)=>({part,title,prompt,board,type:'choice',options,correct,explain,hints,wrong});
 function squareModel(labels=false){
  return `<svg class="geometry square-model" viewBox="30 12 350 350" role="img" aria-label="Ferningur með hlið p + q skiptist í ferning með hlið p, ferning með hlið q og tvo rétthyrninga með hliðar p og q."><path d="M80 65H240V225H80Z" fill="#fbefd1"/><path d="M240 65H330V225H240Z" fill="#dce5c1"/><path d="M80 225H240V315H80Z" fill="#dce5c1"/><path d="M240 225H330V315H240Z" fill="#f5dba0"/><path class="edge" d="M80 65H330V315H80ZM240 65V315M80 225H330" fill="none"/><text x="160" y="43">p</text><text x="285" y="43">q</text><text x="52" y="154">p</text><text x="52" y="279">q</text>${labels?'<text class="inner-label" x="160" y="154">p²</text><text class="inner-label" x="285" y="154">pq</text><text class="inner-label" x="160" y="279">pq</text><text class="inner-label" x="285" y="279">q²</text>':''}</svg><p class="area-caption">p &gt; 0 og q &gt; 0. Allir fjórir fletirnir teljast með.</p>`;
 }
 function tasks(seed){
  const d=variants[seed],q=[];let a=d.unitPlus,u=mi('x'),v=mn(a),vars=['x²','x',''];
  q.push(choice(0,'Tvíliða margfölduð með sjálfri sér','Hvaða margfeldi er jafngilt stæðunni?',math(square(u,v)),[math(conj(u,v)),math(br(u+mo('+')+v)+br(u+mo('+')+v)),math(mn(2)+br(u+mo('+')+v))],1,
   '<p>Annað veldi merkir að tvíliðan er margfölduð með sjálfri sér. Miðliðurinn kemur úr tveimur margfeldum.</p>'+work([poly([1,a],['x²','x']),mo('+')+poly([a,a*a],['x',''])],mo('=')+poly([1,2*a,a*a],vars)),['Veldisvísirinn 2 segir að margfalda eigi tvo eins þætti.','Báðir þættirnir þurfa að vera x + '+a+'. Ekki breyta plúsnum í mínus.'],'Þegar tvíliða er hafin í annað veldi er hún margfölduð með sjálfri sér. Báðir þættirnir eiga því að vera eins.'));
  let [m,n]=d.plus;u=poly([m],['x']);v=mn(n);let ans=squareAnswer(m,n);
  q.push(coeff(0,'Miðliðurinn þarf að vera með','Notaðu fyrri ferningsregluna og einfaldaðu.',math(square(u,v)),ans,vars,explanation(u,v,ans,vars),['Fyrri ferningsreglan er (a + b)² = a² + 2ab + b².','Miðliðurinn er tvöfalt margfeldi beggja liðanna. Stuðullinn við x þarf að vera með í því margfeldi.']));
  a=d.unitMinus;u=mi('x');v=mn(a);ans=[1,-2*a,a*a];
  q.push(choice(1,'Formerki í seinni ferningsreglunni','Hvaða stæða fæst með seinni ferningsreglunni?',math(square(u,v,true)),[math(poly(ans,vars)),math(poly([1,-a*a],['x²',''])),math(poly([1,-2*a,-a*a],vars))],0,
   '<p>Mínus er á undan miðliðnum. Síðasti liðurinn er jákvæður því neikvæði fastinn margfaldast við sjálfan sig.</p>'+work([poly([1,-a],['x²','x']),poly([-a,a*a],['x',''])],mo('=')+poly(ans,vars)),['Seinni ferningsreglan er (a − b)² = a² − 2ab + b².','Margfeldi tveggja neikvæðra talna er jákvætt. Miðliðurinn hverfur ekki.'],'Mínus er á undan miðliðnum og plús á undan síðasta liðnum. Ekki rugla ferningsreglu saman við samokareglu.'));
  [m,n]=d.minus;u=poly([m],['x']);v=mn(n);ans=squareAnswer(m,n,true);
  q.push(coeff(1,'Mínus á undan miðliðnum','Notaðu seinni ferningsregluna og einfaldaðu.',math(square(u,v,true)),ans,vars,explanation(u,v,ans,vars,true),['Reiknaðu annað veldi fyrri liðarins, dragðu frá tvöfalt margfeldi liðanna og leggðu við annað veldi seinni liðarins.','Miðliðurinn inniheldur bæði stuðul x-liðarins og fastann.']));
  [m,n]=d.twoPlus;u=poly([m],['a']);v=poly([n],['b']);ans=squareAnswer(m,n);const twoVars=['a²','ab','b²'];
  q.push(coeff(2,'Tvær breytur með plús','Notaðu ferningsreglu og skráðu stuðlana.',math(square(u,v)),ans,twoVars,explanation(u,v,ans,twoVars),['a², ab og b² eru þrír ólíkir bókstafahlutar.','Miðliðurinn inniheldur ab. Margfaldaðu báða stuðlana og tvöfaldaðu margfeldið.']));
  [m,n]=d.twoMinus;u=poly([m],['a']);v=poly([n],['b']);ans=squareAnswer(m,n,true);
  q.push(coeff(2,'Tvær breytur með mínus','Notaðu seinni ferningsregluna.',math(square(u,v,true)),ans,twoVars,explanation(u,v,ans,twoVars,true),['Síðasti liðurinn inniheldur b² og hefur plús fyrir framan.','ab-liðurinn hefur mínus fyrir framan. Margfaldaðu stuðlana saman og tvöfaldaðu.']));
  [a,m]=d.reverse;u=mn(a);v=poly([m],['x']);ans=squareAnswer(m,a);
  q.push(coeff(3,'Fastinn kemur fyrst','Notaðu ferningsreglu. Skráðu stuðla við x² og x og síðan fastann.',math(square(u,v)),ans,vars,explanation(u,v,ans,vars),['Þú getur notað regluna í gefinni röð eða endurraðað summunni.','Annað veldi bókstafaliðarins gefur x²-lið. Tvöfalt margfeldi fastans og bókstafaliðarins gefur miðliðinn.']));
  [m,n]=d.scaled;u=poly([m],['a']);v=mn(n);ans=squareAnswer(m,n,true);const aVars=['a²','a',''];
  q.push(coeff(3,'Allur stuðullinn fylgir með','Notaðu ferningsreglu og einfaldaðu.',math(square(u,v,true)),ans,aVars,explanation(u,v,ans,aVars,true),['Reiknaðu annað veldi bæði stuðulsins og a.','Miðliðurinn er −2 sinnum fyrri liður sinnum seinni liður. Fastinn fæst með því að hefja seinni liðinn í annað veldi.']));
  let [num,den]=d.fractionConstant;u=mi('a');v=frac(mn(num),mn(den));ans=[1,-2*num/den,num*num/(den*den)];
  q.push(coeff(4,'Fastinn er almennt brot','Notaðu ferningsreglu. Skráðu nákvæm svör, án námundunar.',math(square(u,v,true)),ans,aVars,explanation(u,v,ans,aVars,true,true),['Í miðliðnum tvöfaldarðu brotið og margfaldar með a.','Þegar brotið fer í annað veldi fara bæði teljari og nefnari í annað veldi.']));
  [m,n]=d.decimalConstant;u=poly([m],['y']);v=mn(n);ans=squareAnswer(m,n,true);const yVars=['y²','y',''];
  q.push(coeff(4,'Fastinn er tugabrot','Notaðu seinni ferningsregluna. Haltu tugabrotunum nákvæmum.',math(square(u,v,true)),ans,yVars,explanation(u,v,ans,yVars,true),['Miðliðurinn fæst með −2 sinnum stuðulinn sinnum tugabrotið.','Annað veldi tugabrots er tugabrotið sinnum sjálft sig. Ekki tvöfalda það.']));
  [num,den,m]=d.reverseFraction;u=frac(mn(num),mn(den));v=poly([m],['a']);ans=[m*m,-2*num*m/den,num*num/(den*den)];
  q.push(coeff(4,'Brot fyrst og bókstafaliður á eftir','Notaðu ferningsreglu. Skráðu svar í röðinni a²-liður, a-liður og fasti.',math(square(u,v,true)),ans,aVars,explanation(u,v,ans,aVars,true,true),['Seinni ferningsreglan gildir líka þegar fyrri liðurinn er brot.','Plús er á undan a²-liðnum og mínus á undan a-liðnum. Fastinn fæst með því að hefja brotið í annað veldi.']));
  [m,n]=d.decimal;u=poly([m],['x']);v=mn(n);ans=squareAnswer(m,n);
  q.push(coeff(5,'Stuðull og fasti sem eru tugabrot','Notaðu fyrri ferningsregluna. Ekki námunda.',math(square(u,v)),ans,vars,explanation(u,v,ans,vars),['Reiknaðu þrjá liði: annað veldi fyrri liðarins, tvöfalt margfeldi liðanna og annað veldi seinni liðarins.','Bæði tugabrotin koma fyrir í miðliðnum. Stuðullinn við x² fæst með því að hefja stuðulinn við x innan svigans í annað veldi.']));
  [num,den,n]=d.fractionMinus;u=frac(poly([num],['a']),mn(den));v=mn(n);ans=[num*num/(den*den),-2*num*n/den,n*n];
  q.push(coeff(5,'Stuðull sem er brot · mínus','Notaðu ferningsreglu. Þú mátt skrá jafngild brot.',math(square(u,v,true)),ans,aVars,explanation(u,v,ans,aVars,true,true),['Stuðullinn, sem er brot, er hafinn í annað veldi í fyrsta liðnum.','Í miðliðnum tvöfaldarðu margfeldi stuðulsins, sem er brot, og fastans. Þar er ekki verið að hefja brotið í annað veldi.']));
  [num,den,n]=d.fractionPlus;u=frac(poly([num],['b']),mn(den));v=mn(n);ans=[num*num/(den*den),2*num*n/den,n*n];const bVars=['b²','b',''];
  q.push(coeff(5,'Stuðull sem er brot · plús','Notaðu fyrri ferningsregluna og haltu svörunum nákvæmum.',math(square(u,v)),ans,bVars,explanation(u,v,ans,bVars,false,true),['Reiknaðu annað veldi alls fyrri liðarins, bæði brotsins og bókstafsins.','Miðliðurinn er tvöfalt margfeldi liðanna. Skráðu almennt brot ef tugabrotið endar ekki.']));
  q.push(choice(6,'Flatarmál alls ferningsins','Hliðarlengd stóra ferningsins er p + q. Hvaða stæða gefur flatarmál hans?',squareModel(),[math(pow(mi('p'))+mo('+')+pow(mi('q'))),math(mn(2)+br(mi('p')+mo('+')+mi('q'))),math(square(mi('p'),mi('q')))],2,
   '<p>Flatarmál fernings er hliðarlengd sinnum hliðarlengd. Hér er því flatarmálið (p + q)(p + q) = (p + q)².</p>',
   ['Öll hliðin er p + q. Báðar hliðarlengdirnar þurfa að margfaldast saman.','Ferningar með hliðar p og q ná ekki einir yfir allan stóra ferninginn. Rétthyrningarnir tveir teljast líka með.'],'Notaðu alla hliðarlengdina p + q þegar þú reiknar flatarmálið.'));
  q.push(coeff(6,'Fjórir fletir gefa þrjá liði','Leggðu saman flatarmál hlutanna fjögurra. Skráðu stuðlana við p², pq og q².',squareModel(true),[1,2,1],['p²','pq','q²'],
   '<p>Rétthyrningarnir tveir hafa hvor um sig flatarmálið pq. Saman gefa þeir miðliðinn 2pq. Flatarmál hlutanna er jafnt flatarmáli stóra ferningsins:</p>'+work(pow(mi('p'))+mo('+')+mi('p')+mi('q')+mo('+')+mi('p')+mi('q')+mo('+')+pow(mi('q')),mo('=')+poly([1,2,1],['p²','pq','q²']),mo('=')+square(mi('p'),mi('q'))),
   ['Teldu báða rétthyrningana, ekki aðeins annan þeirra.','p² og q² koma hvort fyrir einu sinni. pq kemur fyrir tvisvar.']));
  const c=d.combined;u=mi('a');v=mn(c);ans=[1,0,3*c*c];
  q.push(coeff(7,'Ferningsreglur og samokaregla','Notaðu viðeigandi reglu á hvern hluta. Skráðu 0 fyrir lið sem fellur út.',splitMath(square(u,v),mo('+')+square(u,v,true),mo('−')+conj(u,v)),ans,aVars,
   work(poly([1,2*c,c*c],aVars),mo('+')+br(poly([1,-2*c,c*c],aVars)),mo('−')+br(poly([1,-c*c],['a²',''])),[mo('=')+poly([2,2*c*c],['a²','']),poly([-1,c*c],['a²',''])],mo('=')+poly(ans,aVars)),['Fyrri hluti notar fyrri ferningsreglu, næsti seinni ferningsreglu og sá síðasti samokareglu.','Mínusinn á undan síðasta margfeldinu breytir formerkjum beggja liða í niðurstöðu þess.']));
  const [P,Q,R,M,S,T,N,U,V]=d.long,first=[Q,P*Q-R,-P*R],full=[Q+M*S*S+N*U*U,P*Q-R-2*M*S*T+2*N*U*V,-P*R+M*T*T+N*V*V];
  const product=br(poly([1,P],['y','']))+br(poly([Q,-R],['y','']));
  q.push(coeff(7,'Byrjaðu á margfeldinu','Tvíliðurnar eru hvorki eins né samoka. Margfaldaðu þær saman og einfaldaðu.',math(product),first,yVars,
   work([poly([Q,-R],['y²','y']),mo('+')+poly([P*Q,-P*R],['y',''])],mo('=')+poly(first,yVars)),['Margfaldaðu hvorn lið fyrri svigans við báða liði seinni svigans.','Reiknaðu fjögur margfeldi. Dragðu síðan y-liðina tvo saman.']));
  q.push(coeff(7,'Einfaldaðu alla stæðuna','Margfeldið úr fyrra skrefi er þegar einfaldað hér. Notaðu ferningsreglurnar, margfaldaðu með þáttunum utan sviganna og dragðu saman líka liði.',splitMath(poly(first,yVars),mo('+')+mn(M)+square(poly([S],['y']),mn(T),true),mo('+')+mn(N)+square(poly([U],['y']),mn(V))),full,yVars,
   work(poly(first,yVars),mo('+')+mn(M)+br(poly([S*S,-2*S*T,T*T],yVars)),mo('+')+mn(N)+br(poly([U*U,2*U*V,V*V],yVars)),mo('=')+poly(full,yVars)),['Notaðu ferningsreglu á hvora stæðu áður en þú margfaldar með þættinum framan við hana.','Þátturinn utan svigans margfaldast við alla þrjá liði. Dragðu síðan saman y²-liðina, y-liðina og fastana.']));
  q[15].wrong='Teldu alla fjóra fletina. Báðir rétthyrningarnir hafa flatarmálið pq.';
  q[16].wrong='Veldu reglu fyrir hvern hluta. Haltu svigum utan um niðurstöðu síðasta margfeldisins þegar þú dregur hana frá.';
  q[17].wrong='Margfaldaðu hvorn lið fyrri svigans við báða liði seinni svigans. Þessar tvíliður eru hvorki eins né samoka.';
  q[18].wrong='Notaðu ferningsreglurnar fyrst og margfaldaðu svo þættina utan sviganna við alla þrjá liði í hvorum sviga.';
  return q;
 }
 const group=index=>Math.max(0,starts.findLastIndex(n=>n<=Math.min(index,18)));
 return {names,starts,coreCount,coreGroups,tasks,group};
})();
