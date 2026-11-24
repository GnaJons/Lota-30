'use strict';
const ExerciseData=(()=>{
 const names=['Setja gildi inn','Neikvætt gildi og veldi','Tugabrot í stæðu','Plús og mínus fyrir sviga','Draga saman líka liði','Fleiri liðir og formerki','Stæða lýsir aðstæðum','Hemlunarvegalengd','Samanburður forrita'];
 const starts=[0,2,4,5,7,9,12,13,14],coreCount=13,coreGroups=7;
 const variants=[
  {linear:[14,4,-2],quad:[3,4,-7,-2],decimal:[6,8,.25],bracket:[9,4,6],square:[7,2,4,9],two:[6,2,4,5],three:[12,5,4,2],cancel:[4,7],model:[120,6,1,4],brake:[.12,.006,60],program:[7,13,4,11,3000]},
  {linear:[17,5,-3],quad:[2,5,-9,-3],decimal:[7,4,.5],bracket:[8,3,5],square:[8,3,5,6],two:[3,7,5,2],three:[9,13,6,3],cancel:[6,8],model:[90,8,2,3],brake:[.18,.004,70],program:[6,15,2,12,2000]},
  {linear:[13,6,-1],quad:[4,3,-8,-1],decimal:[5,8,.75],bracket:[6,8,4],square:[4,5,7,2],two:[8,3,2,4],three:[16,7,3,5],cancel:[3,5],model:[100,5,1,6],brake:[.16,.003,80],program:[8,14,3,10,1500]}
 ];
 const fmt=n=>String(n).replace('.',',').replace('-','−');
 const readable=n=>{const [a,b]=String(n).split('.');return a.replace(/\B(?=(\d{3})+(?!\d))/g,' ')+(b===undefined?'':','+b);};
 const mn=n=>`<mn>${fmt(n)}</mn>`,mi=s=>`<mi>${s}</mi>`,mo=s=>`<mo>${s}</mo>`;
 const pow=(a,n)=>`<msup><mrow>${a}</mrow>${mn(n)}</msup>`,br=s=>mo('(')+s+mo(')');
 const math=s=>`<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow>${s}</mrow></math>`;
 const splitMath=(...s)=>`<span class="math-parts">${s.map(math).join('')}</span>`;
 const work=(...s)=>`<div class="working">${s.map(x=>Array.isArray(x)?splitMath(...x):math(x)).join('')}</div>`;
 const given=(...s)=>`<div class="given-list">${s.map(x=>`<p>${x}</p>`).join('')}</div>`;
 const variable=s=>s.endsWith('²')?pow(mi(s.slice(0,-1)),2):s.endsWith('³')?pow(mi(s.slice(0,-1)),3):s?mi(s):'';
 function poly(coefs,vars){let out='';coefs.forEach((c,i)=>{if(!c)return;const v=variable(vars[i]);out+=(c<0?mo('−'):out?mo('+'):'')+(v&&Math.abs(c)===1?'':mn(Math.abs(c)))+v;});return out||mn(0);}
 const signed=(n)=>n<0?br(mn(n)):mn(n);
 const calc=(coefs,value,powers)=>coefs.map((c,i)=>`${i?(c<0?mo('−'):mo('+')):c<0?mo('−'):''}${mn(Math.abs(c))}${powers[i]?mo('·')+(powers[i]===1?br(mn(value)):pow(br(mn(value)),powers[i])):''}`).join('');
 const splitCalc=(coefs,value,powers)=>splitMath(calc(coefs.slice(0,1),value,powers.slice(0,1)),(coefs[1]>=0?mo('+'):'')+calc(coefs.slice(1),value,powers.slice(1)));
 const number=(part,title,prompt,board,value,explain,hints,label='Gildi stæðunnar')=>({part,title,prompt,board,type:'number',answer:[Number(value.toPrecision(12))],labels:[label],explain,hints});
 const coeff=(part,title,prompt,board,answer,vars,explain,hints)=>({part,title,prompt,board,type:'coefficients',answer,labels:vars.map(v=>v?'Stuðull við '+v:'Fasti'),explain,hints,help:'Fasti er liður án breytu. Skráðu tölur með formerkjum. Skráðu 0 ef liður fellur út.'});
 const choice=(part,title,prompt,board,options,correct,explain,hints,wrong)=>({part,title,prompt,board,type:'choice',options,correct,explain,hints,wrong});
 function tasks(seed){
  const d=variants[seed],q=[];
  let [a,b,x]=d.linear;
  const linear=mn(a)+mo('−')+mn(b)+mi('x');
  q.push(number(0,'Þegar breytan er núll','Reiknaðu gildi stæðunnar þegar x = 0.',given(math(linear),math(mi('x')+mo('=')+mn(0))),a,
   work(mn(a)+mo('−')+mn(b)+mo('·')+mn(0),mo('=')+mn(a)),['Settu 0 í stað x.','Margföldun með 0 gefur 0. Reiknaðu hana áður en þú dregur frá.']));
  q.push(number(0,'Settu neikvætt gildi inn',`Reiknaðu gildi sömu stæðu þegar x = ${fmt(x)}.`,given(math(linear),math(mi('x')+mo('=')+mn(x))),a-b*x,
   work(mn(a)+mo('−')+mn(b)+mo('·')+br(mn(x)),mo('=')+mn(a)+mo('+')+mn(-b*x),mo('=')+mn(a-b*x)),['Settu neikvæðu töluna í sviga í stað x.','Margfaldaðu fyrst. Að draga neikvæða tölu frá er það sama og að leggja gagnstæða tölu við.']));
  let [A,B,C,z]=d.quad;
  const quad=poly([A,B,C],['a²','a','']);
  q.push(choice(1,'Veldu rétta innsetningu',`Hvaða lína sýnir rétta innsetningu þegar a = ${fmt(z)}?`,given(math(quad),math(mi('a')+mo('=')+mn(z))),[
   splitCalc([A,B,C],z,[1,1,0]),splitCalc([A,B,C],z,[2,1,0]),splitCalc([A,-B,C],z,[2,1,0])],1,
   'Settu gildið í stað a á báðum stöðum. Veldisvísirinn stendur utan svigans, svo öll neikvæða talan er hafin í annað veldi.',
   ['Settu gefna tölu í stað a á báðum stöðum.','Veldisvísirinn 2 á að ná yfir allt innsetta gildið.'], 'Gildið þarf að koma í stað a á báðum stöðum og veldisvísirinn á að vera utan svigans.'));
  let value=A*z*z+B*z+C;
  q.push(number(1,'Reiknaðu í réttri röð','Reiknaðu gildi stæðunnar. Byrjaðu á veldinu.',splitCalc([A,B,C],z,[2,1,0]),value,
   work(poly([A*z*z,B*z,C],['','','']),mo('=')+mn(value)),['Neikvæð tala í öðru veldi er jákvæð.','Reiknaðu margföldunina á eftir veldinu og dragðu síðan saman.']));
  let [p,r,t]=d.decimal;value=p*t-r*t*t;
  q.push(number(2,'Tugabrot í stað breytu',`Reiknaðu gildi stæðunnar þegar t = ${fmt(t)}.`,given(math(poly([p,-r],['t','t²'])),math(mi('t')+mo('=')+mn(t))),value,
   work(calc([p,-r],t,[1,2]),mo('=')+mn(p*t)+mo('−')+mn(r*t*t),mo('=')+mn(Number(value.toPrecision(12)))),['Settu tugabrotið í stað t á báðum stöðum.','Reiknaðu t² áður en þú margfaldar með stuðlinum. Þegar tala milli 0 og 1 er hafin í annað veldi verður útkoman minni en talan sjálf.']));
  [a,b,x]=d.bracket;
  const inner=poly([b,-x],['x','']);
  q.push(choice(3,'Plús fyrir framan sviga','Hvaða lína fæst þegar svigarnir eru fjarlægðir?',math(poly([a],['x'])+mo('+')+br(inner)),[
   math(poly([a,b,-x],['x','x',''])),math(poly([a,-b,x],['x','x',''])),math(poly([a,b,x],['x','x','']))],0,
   'Plús fyrir framan sviga breytir ekki formerkjum liðanna.', ['Skoðaðu merkið rétt fyrir framan svigann.','Við plús halda allir liðir innan svigans sínum formerkjum.'], 'Plús fyrir framan svigann breytir ekki formerkjunum inni í honum.'));
  q.push(coeff(3,'Mínus fyrir framan sviga','Einfaldaðu. Skráðu stuðulinn við x og fastann.',math(poly([a],['x'])+mo('−')+br(inner)),[a-b,x],['x',''],
   work(poly([a,-b,x],['x','x','']),mo('=')+poly([a-b,x],['x',''])),['Mínus fyrir framan sviga breytir formerki allra liðanna innan hans.','Dragðu síðan saman x-liðina. Neikvæði fastinn innan svigans verður jákvæður.']));
  [a,b,x,t]=d.square;
  q.push(choice(4,'Hvaða liði má draga saman?','Veldu parið með líkum liðum úr stæðunni.',math(poly([a,b,-x],['x²','x','x²'])),[
   given(math(poly([a],['x²']))+' og '+math(poly([b],['x']))),given(math(poly([b],['x']))+' og '+math(poly([-x],['x²']))),given(math(poly([a],['x²']))+' og '+math(poly([-x],['x²'])))],2,
   'Líkir liðir hafa sama bókstafahluta og sömu veldisvísa. Stuðlarnir mega vera ólíkir.', ['Bæði bókstafir og veldisvísar þurfa að passa.','x og x² eru ólíkir bókstafahlutar.'], 'Bókstafahlutinn og veldisvísarnir verða að vera eins í líkum liðum.'));
  q.push(coeff(4,'Dragðu saman líka liði','Fjarlægðu svigana og einfaldaðu. Skráðu stuðulinn við a² og fastann.',splitMath(br(poly([a,b],['a²',''])),mo('−')+br(poly([x,-t],['a²','']))),[a-x,b+t],['a²',''],
   work(poly([a,b,-x,t],['a²','','a²','']),mo('=')+poly([a-x,b+t],['a²',''])),['Mínusinn fyrir framan seinni svigann nær til beggja liðanna í honum.','Sameinaðu a²-liðina annars vegar og fastana hins vegar.']));
  [a,b,x,t]=d.two;
  q.push(coeff(5,'Tvær breytur','Einfaldaðu. Skráðu stuðlana við x² og y².',splitMath(br(poly([a,b],['x²','y²'])),mo('−')+br(poly([x,-t],['x²','y²']))),[a-x,b+t],['x²','y²'],
   work([poly([a,-x],['x²','x²']),mo('+')+br(poly([b,t],['y²','y²']))],mo('=')+poly([a-x,b+t],['x²','y²'])),['Skiptu um formerki á báðum liðum seinni svigans.','Dragðu x²-liðina saman og y²-liðina saman. Ekki sameina ólíka bókstafahluta.']));
  [a,b,x,t]=d.three;
  q.push(coeff(5,'Mínus nær til allra liðanna','Einfaldaðu. Skráðu stuðlana við x² og x og síðan fastann.',splitMath(mn(a),mo('−')+br(poly([b,-x,-t],['','x','x²']))),[t,x,a-b],['x²','x',''],
   work(poly([a,-b,x,t],['','','x','x²']),mo('=')+poly([t,x,a-b],['x²','x',''])),['Allir þrír liðirnir innan svigans skipta um formerki.','Sameinaðu fastana. Raðaðu svo svarinu með x²-lið fyrst og fastann síðast.']));
  [a,b]=d.cancel;
  q.push(coeff(5,'Þegar liðir falla út','Einfaldaðu. Skráðu stuðulinn við x² og fastann. Skráðu 0 ef x²-liðurinn fellur út.',math(poly([a],['x²'])+mo('+')+br(poly([-b,-a],['','x²']))),[0,-b],['x²',''],
   work(poly([a,-a,-b],['x²','x²','']),mo('=')+mn(-b)),['Plús fyrir framan svigann breytir ekki formerkjunum.','Líkir liðir með gagnstæðum stuðlum eyða hvor öðrum. Fastinn verður eftir.']));
  [a,b,x,t]=d.model;value=a*t+b*t*t-x*t*t*t;
  q.push(number(6,'Vatnsmagn samkvæmt líkani','Í tilbúnu líkani lýsir stæðan vatnsmagni í geymi, í lítrum, t mínútum frá upphafi. Hve margir lítrar eru í geyminum á gefnum tíma?',
   given(math(poly([a,b,-x],['t','t²','t³'])),math(mi('t')+mo('=')+mn(t))+' mínútur','Líkanið gildir fyrstu 8 mínúturnar.'),value,
   work(poly([a*t,b*t*t,-x*t*t*t],['','','']),mo('=')+mn(value))+' lítrar.', ['Settu gefinn tíma í stað t alls staðar í stæðunni.','Reiknaðu t² og t³ fyrst. Margfaldaðu síðan með stuðlunum og dragðu saman.'],'Lítrar'));
  [a,b,x]=d.brake;value=a*x+b*x*x;
  q.push(number(7,'Hemlunarvegalengd','Í einföldu reiknilíkani lýsir stæðan hemlunarvegalengd í metrum þegar hraðinn er x km/klst. Reiknaðu vegalengdina við gefinn hraða.',
   given(math(poly([a,b],['x','x²'])),math(mi('x')+mo('=')+mn(x))+' km/klst.'),value,
   work([calc([a],x,[1]),mo('+')+calc([b],x,[2])],mo('=')+mn(Number((a*x).toPrecision(12)))+mo('+')+mn(Number((b*x*x).toPrecision(12))),mo('=')+mn(Number(value.toPrecision(12))))+' m.',
   ['Settu hraðann í stað x á báðum stöðum.','Reiknaðu hraðann í öðru veldi áður en þú margfaldar með seinni stuðlinum.'],'Metrar'));
  const [pa,pb,qa,qb,N]=d.program,ca=pa-qa,cb=pb-qb;
  const programBoard=given('Forrit A: '+math(poly([pa,pb],['N²','N'])),'Forrit B: '+math(poly([qa,qb],['N²','N'])));
  q.push(coeff(8,'Hve miklu munar á forritunum?','Stæðurnar lýsa keyrslutíma í millisekúndum fyrir N nöfn. Einfaldaðu A − B til að sýna tímann sem sparast með B.',programBoard,[ca,cb],['N²','N'],
   work(br(poly([pa,pb],['N²','N'])),mo('−')+br(poly([qa,qb],['N²','N'])),mo('=')+poly([ca,cb],['N²','N'])),
   ['Dragðu allan keyrslutíma B frá keyrslutíma A.','Settu sviga utan um stæðu B. Báðir liðirnir í henni skipta um formerki.']));
  value=ca*N*N+cb*N;
  q.push(number(8,'Reiknaðu tímasparnaðinn','Notaðu einfaldaða stæðuna. Hve margar millisekúndur sparast með forriti B fyrir gefinn fjölda nafna? Reiknivél má nota.',
   given('Tímasparnaður: '+math(poly([ca,cb],['N²','N'])),math(mi('N')+mo('=')+mn(readable(N)))),value,
   work(mn(readable(ca*N*N))+mo('+')+mn(readable(cb*N)),mo('=')+mn(readable(value)))+' millisekúndur.',
   ['Settu fjölda nafna í stað N í báðum liðum.','Reiknaðu N² fyrst. Svarið er mismunur tímanna, í millisekúndum.'],'Millisekúndur'));
  return q;
 }
 return {names,starts,coreCount,coreGroups,variants,tasks,group:pos=>starts.findLastIndex(x=>pos>=x),fmt};
})();
