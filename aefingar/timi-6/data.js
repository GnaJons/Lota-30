'use strict';
const ExerciseData=(()=>{
 const names=['Samoka tvíliður','Röð liða og stuðlar','Endurröðun og brot','Á reglan við?','Mínus framan við margfeldi','Einföldun og innsetning','Flatarmál og samokaregla','Lengri stæða í hlutum'];
 const starts=[0,2,5,8,11,13,15,18],coreCount=15,coreGroups=6;
 const variants=[
  {simple:7,scaled:[5,3],reverse:[8,3],two:[4,7],decimal:[.2,.7],reorder:[7,2],fractionConstant:[2,5],fractionCoefficient:[3,4,2],non:[3,4],reverseDecimal:[.4,.7],difference:[3,7],outside:[7,3,4],combined:[2,4,3,2,7,-3],area:[9,4],long:[3,4,2,2,6,4,3,2,5]},
  {simple:9,scaled:[4,6],reverse:[7,2],two:[3,8],decimal:[.3,.8],reorder:[6,5],fractionConstant:[3,4],fractionCoefficient:[2,5,3],non:[2,5],reverseDecimal:[.5,.2],difference:[4,9],outside:[9,2,6],combined:[3,5,2,3,4,-2],area:[11,3],long:[2,5,3,3,4,2,2,7,6]},
  {simple:6,scaled:[6,7],reverse:[9,4],two:[5,2],decimal:[.4,.3],reorder:[8,3],fractionConstant:[3,5],fractionCoefficient:[5,6,4],non:[5,2],reverseDecimal:[.2,.9],difference:[2,8],outside:[4,5,3],combined:[4,2,1,6,3,-3],area:[8,5],long:[4,3,2,5,3,3,2,4,7]}
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
 const conj=(u,v,reverse=false)=>br(u+mo(reverse?'−':'+')+v)+br(u+mo(reverse?'+':'−')+v);
 const explanation=(u,v,answer,vars,exact=false)=>work(pow(br(u))+mo('−')+pow(br(v)),mo('=')+poly(answer,vars,exact));
 const coeff=(part,title,prompt,board,answer,vars,explain,hints,labels)=>({part,title,prompt,board,type:'coefficients',answer,labels:labels||vars.map(v=>v?'Stuðull við '+v:'Fasti'),explain,hints,help:'Fasti er liður án breytu. Skráðu tölur með formerkjum; 0 ef liður fellur út. Þú mátt nota kommu, punkt eða brot, t.d. 3/4.'});
 const choice=(part,title,prompt,board,options,correct,explain,hints,wrong)=>({part,title,prompt,board,type:'choice',options,correct,explain,hints,wrong});
 function areaModel(rectangle=false){
  const shapes=rectangle?'<path d="M80 60H320L160 220H80Z" fill="#f5dba0"/><path d="M320 60H400V220H160Z" fill="#d7e6eb"/><path class="edge" d="M80 60H400V220H80ZM320 60L160 220" fill="none"/><text x="240" y="255">p + q</text><text x="450" y="150">p − q</text>':'<path d="M80 60L240 220V300H80Z" fill="#f5dba0"/><path d="M80 60H320V220H240Z" fill="#d7e6eb"/><path class="edge" d="M80 60H320V300H80ZM80 60L240 220V300M240 220H320" fill="none"/><text x="200" y="38">p</text><text x="50" y="190">p</text><text x="345" y="266">q</text><text x="280" y="329">q</text>';
  return `<svg class="geometry area-model" viewBox="${rectangle?'45 28 450 260':'30 5 350 345'}" role="img" aria-label="${rectangle?'Sömu tveir lituðu hlutarnir mynda rétthyrning með hliðar p + q og p − q.':'Ferningur með hlið p. Hvítur ferningur með hlið q er í neðra hægra horni. Afgangurinn er litaður gulur og blár.'}">${shapes}</svg><p class="area-caption">p &gt; q &gt; 0. Báðir litirnir teljast með.</p>`;
 }
 function tasks(seed){
  const d=variants[seed],q=[];let a=d.simple;
  q.push(choice(0,'Miðliðirnir falla út','Hvaða stæða fæst með samokareglunni?',math(conj(mi('x'),mn(a))),[math(poly([1,a*a],['x²',''])),math(poly([1,-a*a],['x²',''])),math(poly([1,-2*a,a*a],['x²','x','']))],1,
   '<p>Miðliðirnir hafa gagnstæða stuðla og summan er 0.</p>'+work([poly([1,-a],['x²','x']),mo('+')+poly([a,-a*a],['x',''])],mo('=')+poly([1,-a*a],['x²',''])),['Samokareglan er (a + b)(a − b) = a² − b².','Reiknaðu x · x og síðan '+a+' · (−'+a+'). x-liðirnir tveir falla út.'],'Tvíliðurnar eru samoka. Reiknaðu annað veldi liðarins sem er eins í báðum svigum og dragðu frá annað veldi hins liðarins.'));
  let [m,n]=d.scaled,u=poly([m],['x']),v=mn(n),ans=[m*m,0,-n*n];
  q.push(coeff(0,'Allur liðurinn í annað veldi','Notaðu samokaregluna. Skráðu 0 fyrir lið sem fellur út.',math(conj(u,v)),ans,['x²','x',''],explanation(u,v,ans,['x²','x','']),['Stuðullinn og bókstafurinn mynda einn lið. Reiknaðu annað veldi beggja.','Miðliðurinn fellur út. Fastinn verður neikvæður.']));
  [a,m]=d.reverse;u=mn(a);v=poly([m],['a']);ans=[-m*m,a*a];
  q.push(coeff(1,'Fastinn er sameiginlegi liðurinn','Notaðu samokaregluna og skráðu stuðul við a² og fastann.',math(conj(u,v,true)),ans,['a²',''],explanation(u,v,ans,['a²','']),['Fastinn er eins í báðum svigum. Stuðlar bókstafaliðarins hafa gagnstæð formerki.','Reiknaðu annað veldi fastans og dragðu frá annað veldi bókstafaliðarins. Stuðull við a² verður neikvæður.']));
  [m,n]=d.two;u=poly([m],['a']);v=poly([n],['b']);ans=[m*m,-n*n];
  q.push(coeff(1,'Tvær breytur','Margfaldaðu með samokareglunni.',math(conj(u,v,true)),ans,['a²','b²'],explanation(u,v,ans,['a²','b²']),['Bókstafaliðurinn með a er eins í báðum svigum.','Báðir stuðlarnir fara í annað veldi. a² og b² eru ólíkir bókstafahlutar.']));
  [m,n]=d.decimal;u=poly([m],['a']);v=mn(n);ans=[clean(m*m),clean(-n*n)];
  q.push(coeff(1,'Tugabrot fara líka í annað veldi','Notaðu samokaregluna. Reiknaðu nákvæmlega.',splitMath(br(u+mo('+')+v),mo('·')+br(u+mo('−')+v)),ans,['a²',''],explanation(u,v,ans,['a²','']),['Reiknaðu tugabrotið sinnum sjálft sig. Ekki tvöfalda það.','Þú mátt skrá nákvæmt tugabrot eða jafngilt almennt brot.']));
  [a,m]=d.reorder;u=poly([m],['y']);v=mn(a);ans=[m*m,-a*a];
  q.push(coeff(2,'Finndu liðinn sem er eins','Röð liða er ólík í svigunum. Notaðu samokaregluna.',math(br(v+mo('+')+u)+br(u+mo('−')+v)),ans,['y²',''],work(conj(u,v),pow(br(u))+mo('−')+pow(v),mo('=')+poly(ans,['y²',''])),['Þú mátt endurraða liðum í summu. Formerkin fylgja liðunum.','Plús er á undan y-liðnum í báðum svigum. Fastinn hefur gagnstæð formerki.']));
  let [num,den]=d.fractionConstant;u=mi('a');v=frac(mn(num),mn(den));ans=[1,-num*num/(den*den)];
  q.push(coeff(2,'Brot í seinni liðnum','Notaðu samokaregluna. Skráðu nákvæmt svar.',math(conj(u,v)),ans,['a²',''],explanation(u,v,ans,['a²',''],true),['Þegar brot fer í annað veldi fara bæði teljari og nefnari í annað veldi.','Skráðu neikvætt brot sem fasta, t.d. −3/4. Ekki námunda.']));
  [num,den,n]=d.fractionCoefficient;u=frac(poly([num],['x']),mn(den));v=mn(n);ans=[num*num/(den*den),-n*n];
  q.push(coeff(2,'Stuðull sem er brot og endurröðun','Margfaldaðu og skráðu stuðul við x² sem nákvæmt brot eða nákvæmt tugabrot.',math(br(u+mo('−')+v)+br(v+mo('+')+u)),ans,['x²',''],explanation(u,v,ans,['x²',''],true),['Brotaliðurinn er eins í báðum svigum. Hann kemur fyrst í samokareglunni.','Reiknaðu annað veldi teljarans og nefnarans. x fer líka í annað veldi.']));
  [m,n]=d.non;const nonProduct=br(poly([m,n],['x','y']))+br(poly([m,-n],['y','x']));
  q.push(choice(3,'Gættu að stuðlunum','Má nota samokaregluna beint á þetta margfeldi?',math(nonProduct),['Já, því annar sviginn hefur plús og hinn mínus.','Nei, stuðlarnir við x og y passa ekki milli sviganna.','Já, tvær breytur nægja til að nota regluna.'],1,
   '<p>Tvíliðurnar eru ekki samoka. Bæði bókstafahluti og stuðull þurfa að passa. Hér margfaldarðu hvorn lið fyrri svigans við báða liði seinni svigans.</p>',
   ['Berðu allan x-liðinn saman í svigunum tveimur. Gerðu það sama við y-liðinn.','Stuðlarnir '+m+' og '+n+' skipta um hlutverk í seinni sviganum.'],'Plús og mínus nægja ekki. Samokareglan krefst summu og mismunar sömu liða.'));
  ans=[-m*n,m*m-n*n,m*n];
  q.push(coeff(3,'Margfaldaðu lið fyrir lið','Tvíliðurnar eru ekki samoka. Margfaldaðu og dragðu saman líka liði.',math(nonProduct),ans,['x²','xy','y²'],
   work([poly([-m*n,m*m],['x²','xy']),poly([-n*n,m*n],['xy','y²'])],mo('=')+poly(ans,['x²','xy','y²'])),['Margfaldaðu hvorn lið fyrri svigans við báða liði seinni svigans.','Sameinaðu aðeins xy-liðina. Þeir falla ekki út í þessu dæmi.']));
  [m,n]=d.reverseDecimal;u=poly([n],['y']);v=poly([m],['x']);ans=[clean(-m*m),clean(n*n)];
  q.push(coeff(3,'Þessar tvíliður eru samoka','Finndu liðinn sem er eins í báðum svigum og notaðu samokaregluna.',splitMath(br(v+mo('+')+u),mo('·')+br(u+mo('−')+v)),ans,['x²','y²'],explanation(u,v,ans,['x²','y²']),['Plús er á undan y-liðnum í báðum svigum; stuðlar x-liðarins hafa gagnstæð formerki.','Reiknaðu annað veldi y-liðarins og dragðu frá annað veldi x-liðarins. Haltu tugabrotunum nákvæmum.']));
  [m,n]=d.difference;ans=[n*n-m*m];
  q.push(coeff(4,'Mismunur tveggja margfelda','Einfaldaðu alla stæðuna. Svarið verður ein tala.',splitMath(conj(mi('x'),mn(m)),mo('−')+conj(mi('x'),mn(n),true)),ans,[''],
   work([poly([1,-m*m],['x²','']),mo('−')+br(poly([1,-n*n],['x²','']))],[poly([1,-m*m],['x²','']),poly([-1,n*n],['x²',''])],mo('=')+mn(ans[0])),['Notaðu samokaregluna á hvort margfeldi fyrir sig.','Settu sviga utan um niðurstöðu seinna margfeldisins áður en þú dregur hana frá.'],['Gildi stæðunnar']));
  let [k,r,c]=d.outside;ans=[-r,k+r*c*c];
  q.push(coeff(4,'Mínus og þáttur utan sviga','Notaðu samokaregluna og einfaldaðu síðan.',splitMath(mn(k),mo('−')+mn(r)+conj(mi('x'),mn(c))),ans,['x²',''],
   work(mn(k)+mo('−')+mn(r)+br(poly([1,-c*c],['x²',''])),poly([k,-r,r*c*c],['','x²','']),mo('=')+poly(ans,['x²',''])),['Einfaldaðu fyrst margfeldi sviganna.','Neikvæði þátturinn margfaldast við báða liði niðurstöðunnar. Fastinn utan margfeldisins bætist svo við.']));
  const [A,B,C,E,F,value]=d.combined,total=[A+C,-A*B*B-C*E*E-F];
  const combinedBoard=splitMath(mn(A)+conj(mi('a'),mn(B)),mo('+')+mn(C)+conj(mi('a'),mn(E),true),mo('−')+mn(F));
  q.push(coeff(5,'Einfaldaðu áður en þú setur inn','Notaðu samokaregluna á bæði margfeldin og einfaldaðu.',combinedBoard,total,['a²',''],
   work([mn(A)+br(poly([1,-B*B],['a²',''])),mo('+')+mn(C)+br(poly([1,-E*E],['a²',''])),mo('−')+mn(F)],[poly([A,-A*B*B],['a²','']),mo('+')+poly([C,-C*E*E-F],['a²',''])],mo('=')+poly(total,['a²',''])),['Notaðu samokaregluna á hvort margfeldi fyrir sig.','Margfaldaðu með þáttunum utan sviganna. Dragðu síðan saman a²-liðina og fastana.']));
  const val=total[0]*value*value+total[1];
  q.push(coeff(5,'Settu inn neikvætt gildi','Reiknaðu gildi einfölduðu stæðunnar þegar a = '+value+'.',math(poly(total,['a²',''])),[val],[''],work(mn(total[0])+mo('·')+pow(br(mn(value)))+mo('−')+mn(-total[1]),poly([total[0]*value*value,total[1]],['','']),mo('=')+mn(val)),['Settu sviga utan um neikvæða gildið áður en þú reiknar annað veldi þess.','Reiknaðu veldið fyrst, síðan margföldunina og loks mismuninn.'],['Gildi stæðunnar']));
  q.push(choice(6,'Flatarmál lituðu hlutanna','Lítill hvítur ferningur er tekinn frá stórum ferningi. Hver er summa flatarmála gula og bláa hlutans?',areaModel(),[math(pow(mi('p'))+mo('−')+pow(mi('q'))),math(pow(br(mi('p')+mo('−')+mi('q')))),math(pow(mi('p'))+mo('+')+pow(mi('q')))],0,
   '<p>Stóri ferningurinn hefur flatarmálið p². Hvíti ferningurinn hefur flatarmálið q². Báðir lituðu hlutarnir saman hafa því flatarmálið p² − q².</p>',
   ['Finndu flatarmál alls stóra ferningsins.','Dragðu flatarmál hvíta ferningsins frá. Ekki reikna aðeins annan litinn.'],'Báðir litirnir teljast með. Aðeins litli hvíti ferningurinn er tekinn frá.'));
  q.push(choice(6,'Sömu hlutum endurraðað','Sömu tveimur lituðu hlutunum hefur verið raðað í rétthyrning. Hvaða margfeldi gefur flatarmál hans?',areaModel(true),[math(pow(br(mi('p')+mo('+')+mi('q')))),math(conj(mi('p'),mi('q'))),math(pow(br(mi('p')+mo('−')+mi('q'))))],1,
   '<p>Flatarmál er lengd sinnum breidd. Hlutarnir eru þeir sömu og áður, svo flatarmálið breytist ekki. Þess vegna gildir samokareglan:</p>'+work(pow(mi('p'))+mo('−')+pow(mi('q')),mo('=')+conj(mi('p'),mi('q'))),
   ['Önnur hliðin er p + q og hin er p − q.','Margfaldaðu lengdir hliðanna saman. Þetta er sama flatarmál og í fyrri myndinni.'],'Reiknaðu flatarmál rétthyrningsins með því að margfalda hliðarlengdir hans saman.'));
  const [pval,qval]=d.area,area=pval*pval-qval*qval;
  q.push(coeff(6,'Tvær leiðir að sama flatarmáli','Hér er p = '+pval+' cm og q = '+qval+' cm. Reiknaðu flatarmál lituðu hlutanna saman.',areaModel(true),[area],[''],
   work(pow(mn(pval))+mo('−')+pow(mn(qval))+mo('=')+mn(area),br(mn(pval)+mo('+')+mn(qval))+br(mn(pval)+mo('−')+mn(qval)),mo('=')+mn(pval+qval)+mo('·')+mn(pval-qval)+mo('=')+mn(area))+'<p>Báðar leiðir gefa '+area+' cm².</p>',
   ['Þú getur reiknað p² − q² eða (p + q)(p − q).','Settu tölurnar í stað p og q. Þær uppfylla p > q > 0.'],['Flatarmál (cm²)']));
  const [L,M,N,O,P,Q,R,S,T]=d.long,first=[-L*N+O,L*M,-O*P*P],full=[first[0]-Q*R*R-1,first[1],first[2]+Q*S*S+T*T];
  const firstParts=[poly([L],['a'])+br(poly([M,-N],['','a'])),mo('+')+mn(O)+conj(mi('a'),mn(P))];
  q.push(coeff(7,'Byrjaðu á tveimur hlutum','Einfaldaðu þessa tvo fyrstu hluta lengri stæðu.',splitMath(...firstParts),first,['a²','a',''],
   work([poly([-L*N,L*M],['a²','a']),mo('+')+poly([O,-O*P*P],['a²',''])],mo('=')+poly(first,['a²','a',''])),['Notaðu dreifiregluna í fyrsta hlutanum og samokaregluna í þeim næsta.','Margfaldaðu þáttinn framan við margfeldi samoka tvíliðanna við alla niðurstöðuna. Dragðu saman líka liði.']));
  const rest=[mo('−')+mn(Q)+conj(poly([R],['a']),mn(S)),mo('−')+conj(mi('a'),mn(T),true)];
  q.push(coeff(7,'Sameinaðu alla stæðuna','Fyrstu tveir hlutarnir eru þegar einfaldaðir hér. Einfaldaðu margfeldin sem eftir eru og dragðu saman líka liði.',splitMath(poly(first,['a²','a','']),...rest),full,['a²','a',''],
   work(poly(first,['a²','a','']),mo('−')+mn(Q)+br(poly([R*R,-S*S],['a²',''])),mo('−')+br(poly([1,-T*T],['a²',''])),[mo('=')+poly([first[0],first[1],first[2]],['a²','a','']),poly([-Q*R*R,Q*S*S],['a²','']),poly([-1,T*T],['a²',''])],mo('=')+poly(full,['a²','a',''])),
   ['Notaðu samokaregluna á hvort margfeldi. Haltu svigum utan um niðurstöðurnar.', 'Mínusmerkin framan við margfeldin breyta formerkjum beggja liða í hvorri niðurstöðu.']));
  q[9].wrong='Margfaldaðu hvorn lið fyrri svigans við báða liði seinni svigans. Tvíliðurnar eru ekki samoka.';
  q[18].wrong='Notaðu dreifiregluna í fyrsta hlutanum og samokaregluna í þeim næsta. Dragðu síðan saman líka liði.';
  q[19].wrong='Haltu svigum utan um niðurstöðu hvers margfeldis. Mínus framan við sviga breytir formerki allra liða innan hans.';
  return q;
 }
 const group=index=>Math.max(0,starts.findLastIndex(n=>n<=Math.min(index,19)));
 return {names,starts,coreCount,coreGroups,tasks,group};
})();
