'use strict';
const ExerciseData=(()=>{
 const names=['Skrifa á staðalformi','Skrifa án tugvelda','Margfalda og deila','Reikna með tölum án tugvelda','Milljónir og milljarðar','Finna fjölda agna','Notkun á ári','Rúmmál kúlu','Flatarmál á mann'];
 const starts=[0,2,4,6,8,11,13,14,16],coreCount=14,coreGroups=7;
 const variants=[
  {large:6720000,small:.0000486,plainBig:[7.35,4],plainSmall:[6.4,-5],mul:[4,6,7,-3],div:[5,4,8,-2],ordinaryProd:[720000,.000025],ordinaryDiv:[.00000048,.08],millions:[3,.0024],billions:[2.4,600000],particles:[.84,4.2,-24],daily:240,radius:1.8e6,land:[8e5,25,4e6,10]},
  {large:91300,small:.000000735,plainBig:[4.16,6],plainSmall:[2.7,-8],mul:[6,4,5,-2],div:[6.3,6,9,-3],ordinaryProd:[56000,.000045],ordinaryDiv:[.00000072,.03],millions:[5,.0018],billions:[3.6,800000],particles:[1.2,3,-25],daily:320,radius:2.4e6,land:[9e5,40,6e6,24]},
  {large:41800000,small:.0000918,plainBig:[8.25,3],plainSmall:[9.2,-11],mul:[8,7,3,-4],div:[4.8,5,6,-4],ordinaryProd:[900000,.0000032],ordinaryDiv:[.00000063,.09],millions:[7,.0012],billions:[5.4,900000],particles:[1.05,3.5,-23],daily:180,radius:3.5e6,land:[6e5,35,5e6,12.5]}
 ];
 const fmt=(n,digits)=>typeof n==='string'?n:String(digits?n.toPrecision(digits):n).replace('.',',').replace('-','−');
 const decimal=n=>n.toLocaleString('en-US',{useGrouping:false,maximumFractionDigits:15}).replace('.',',');
 const readable=n=>{const [whole,fraction]=decimal(n).split(',');return whole.replace(/\B(?=(\d{3})+(?!\d))/g,' ')+(fraction===undefined?'':','+fraction);};
 const mn=n=>`<mn>${fmt(n)}</mn>`,mi=s=>`<mi>${s}</mi>`,mo=s=>`<mo>${s}</mo>`;
 const ten=n=>`<msup>${mn(10)}${mn(n)}</msup>`,sf=(c,n,digits)=>mn(fmt(c,digits))+mo('·')+ten(n);
 const fraction=(a,b)=>`<mfrac><mrow>${a}</mrow><mrow>${b}</mrow></mfrac>`;
 const math=s=>`<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow>${s}</mrow></math>`;
 const normalize=value=>{let n=Math.floor(Math.log10(value));let c=Number((value/10**n).toPrecision(12));if(c>=10){c/=10;n++;}return [c,n];};
 const normalMath=value=>math(sf(...normalize(value)));
 const work=(...lines)=>`<div class="working">${lines.map(s=>math(s)).join('')}</div>`;
 const given=(...lines)=>`<div class="given-list">${lines.map(s=>`<p>${s}</p>`).join('')}</div>`;
 const science=(part,title,prompt,board,value,explain,hints,sig)=>{
  let [c,n]=normalize(value);if(sig){c=Number(c.toPrecision(sig));if(c>=10){c/=10;n++;}}
  return {part,title,prompt,board,type:'science',answer:[c,n],labels:['Stuðull','Veldisvísir á 10'],sig,explain:explain||normalMath(value),hints,
   help:sig?'Skráðu stuðulinn með þremur markverðum tölustöfum. Þú mátt nota kommu eða punkt.':'Svarið er stuðull · 10<sup>veldisvísir</sup>. Þú mátt nota kommu eða punkt.'};
 };
 const number=(part,title,prompt,board,value,label,explain,hints)=>({part,title,prompt,board,type:'number',answer:[value],labels:[label],explain,hints});
 const choice=(part,title,prompt,board,options,correct,explain,hints)=>({part,title,prompt,board,type:'choice',options,correct,explain,hints});
 function sphere(radius){return `<svg viewBox="0 0 520 300" role="img" aria-label="Kúla með radíus ${readable(radius)} metra. Strik liggur frá miðju að yfirborði."><circle cx="260" cy="145" r="110" fill="#eaf0e0" stroke="#81503b" stroke-width="2"/><ellipse cx="260" cy="145" rx="110" ry="35" fill="none" stroke="#9aa8a0" stroke-dasharray="6 5"/><path d="M260 145L348 79" stroke="#ac572e" stroke-width="3"/><circle cx="260" cy="145" r="4" fill="#24343b"/><text x="292" y="91" class="sphere-label">r</text></svg>`;}
 function tasks(seed){
  const d=variants[seed],q=[];
  q.push(science(0,'Stór tala á staðalformi','Skrifaðu töluna á staðalformi. Skráðu stuðulinn í fyrri reitinn og veldisvísinn í þann síðari.',math(mn(readable(d.large))),d.large,
   work(mn(readable(d.large))+mo('=')+sf(...normalize(d.large))),['Stuðullinn á að vera að minnsta kosti 1 og minni en 10.','Færðu kommuna til vinstri. Fjöldi sæta verður jákvæður veldisvísir.']));
  q.push(science(0,'Lítil tala á staðalformi','Skrifaðu töluna á staðalformi.',math(mn(decimal(d.small))),d.small,
   work(mn(decimal(d.small))+mo('=')+sf(...normalize(d.small))),['Stuðullinn á að vera að minnsta kosti 1 og minni en 10.','Færðu kommuna til hægri. Veldisvísirinn verður neikvæður.']));
  let [c,n]=d.plainBig,value=c*10**n;
  q.push(number(1,'Án tugvelda','Skrifaðu töluna á venjulegum rithætti, án tugvelda.',math(sf(c,n)),value,'Talan',work(sf(c,n)+mo('=')+mn(readable(value))),['Þegar veldisvísirinn á 10 er jákvæður stækkar talan við margföldunina.',`Færðu kommuna ${n} sæti til hægri.`]));
  [c,n]=d.plainSmall;value=Number((c*10**n).toPrecision(12));
  q.push(number(1,'Tugveldi með neikvæðum veldisvísi','Skrifaðu töluna án tugvelda. Gættu að núllunum á undan fyrsta tölustafnum.',math(sf(c,n)),value,'Talan',work(sf(c,n)+mo('=')+mn(decimal(value))),['Tugveldi með neikvæðum veldisvísi er milli 0 og 1.',`Færðu kommuna ${-n} sæti til vinstri.`]));
  let [a,m,b,k]=d.mul;value=a*b*10**(m+k);
  q.push(science(2,'Margfaldaðu og skrifaðu á staðalformi','Reiknaðu margfeldið og skráðu svarið á staðalformi.',math(sf(a,m)+mo('·')+sf(b,k)),value,
   work(sf(a*b,m+k),mo('=')+sf(...normalize(value))),['Margfaldaðu stuðlana og leggðu veldisvísana saman.','Ef stuðullinn verður 10 eða stærri færirðu kommuna til vinstri og hækkar veldisvísinn um einn fyrir hvert sæti.']));
  [a,m,b,k]=d.div;value=a/b*10**(m-k);
  q.push(science(2,'Deiling með tölu á staðalformi','Reiknaðu kvótann og skráðu svarið á staðalformi.',math(fraction(sf(a,m),sf(b,k))),value,
   work(sf(Number((a/b).toPrecision(12)),m-k),mo('=')+sf(...normalize(value))),['Deildu stuðlunum. Dragðu veldisvísi nefnarans frá veldisvísi teljarans.',`Hér verður veldisvísirinn fyrst ${m} − (${fmt(k)}). Ef stuðullinn er minni en 1 færirðu kommuna til hægri og lækkar veldisvísinn um einn fyrir hvert sæti.`]));
  [a,b]=d.ordinaryProd;value=Number((a*b).toPrecision(12));
  q.push(science(3,'Byrjaðu með tölur án tugvelda','Reiknaðu og skráðu svarið á staðalformi.',math(mn(readable(a))+mo('·')+mn(decimal(b))),value,
   work(sf(...normalize(a))+mo('·')+sf(...normalize(b)),mo('=')+sf(...normalize(value))),['Skrifaðu fyrst hvora tölu á staðalformi.','Margfaldaðu stuðlana og leggðu veldisvísana saman. Skrifaðu niðurstöðuna á staðalformi að lokum.']));
  [a,b]=d.ordinaryDiv;value=Number((a/b).toPrecision(12));
  q.push(science(3,'Deiling lítilla talna','Reiknaðu kvótann og skráðu svarið á staðalformi.',math(fraction(mn(decimal(a)),mn(decimal(b)))),value,
   work(fraction(sf(...normalize(a)),sf(...normalize(b))),mo('=')+sf(...normalize(value))),['Breyttu báðum tölum í staðalform.','Deildu stuðlunum og dragðu veldisvísa tugveldanna frá.']));
  [a,b]=d.millions;value=Number((a*1e6*b).toPrecision(12));
  q.push(science(4,'Margfeldi með milljónum','Reiknaðu margfeldið og skráðu svarið á staðalformi.',given(`${a} milljónir · ${decimal(b)}`),value,
   work(sf(a,6)+mo('·')+sf(...normalize(b)),mo('=')+sf(...normalize(value))),['Ein milljón er 10⁶.','Skrifaðu litlu töluna á staðalformi og margfaldaðu.']));
  [a,b]=d.billions;value=a*1e9/b;
  q.push(choice(4,'Veldu kvótann','Finndu rétta uppsetningu fyrir kvóta talnanna. Fyrri tölunni er deilt með þeirri síðari.',given(`${fmt(a)} milljarðar og ${readable(b)}`),
   [math(fraction(sf(a,6),mn(readable(b)))),math(fraction(sf(a,9),mn(readable(b)))),math(sf(a,9)+mo('·')+mn(readable(b)))],1,
   'Einn milljarður er 10⁹. Kvóti merkir útkomu úr deilingu.', ['Milljarður er þúsund milljónir.','Settu fyrri töluna í teljara og seinni töluna í nefnara.']));
  q.push(science(4,'Reiknaðu kvótann','Skráðu svarið á staðalformi.',math(fraction(sf(a,9),mn(readable(b)))),value,
   work(fraction(sf(a,9),sf(...normalize(b))),mo('=')+sf(...normalize(value))),['Skrifaðu nefnarann á staðalformi.','Deildu stuðlunum og dragðu veldisvísana frá.']));
  const [mass,particle,e]=d.particles;value=mass/(particle*10**e);
  const particleBoard=given(`Heildarmassi: ${math(mn(fmt(mass)))} kg`,`Massi einnar agnar: ${math(sf(particle,e))} kg`);
  q.push(choice(5,'Hvernig finnurðu fjöldann?','Í þessu dæmi hafa allar agnir sama massa. Hvaða aðgerð finnur fjölda agna í safninu?',particleBoard,
   ['Massi einnar agnar deilt með heildarmassa.','Heildarmassi margfaldaður með massa einnar agnar.','Heildarmassi deilt með massa einnar agnar.'],2,
   'Fjöldi fæst með því að deila heildarmassanum með massa hverrar agnar.', ['Hugsaðu um hve oft massi einnar agnar gengur upp í heildarmassann.','Báðir massarnir eru í kg, svo einingarnar eru þegar samræmdar.']));
  q.push(science(5,'Hve margar agnir?','Reiknaðu fjöldann og skráðu hann á staðalformi.',particleBoard,value,
   work(fraction(mn(fmt(mass)),sf(particle,e)),mo('=')+sf(...normalize(value)))+' Þetta er fjöldi agna.', ['Skrifaðu heildarmassann á staðalformi.','Deildu með massa einnar agnar. Fjöldinn á að vera mjög stór.']));
  value=d.daily*365;
  q.push(science(6,'Vatnsnotkun á ári','Vökvunarkerfi notar sama magn vatns á hverjum degi. Reiknaðu ársnotkun í lítrum og skráðu hana á staðalformi.',given(`${d.daily} l á dag`,'Miðaðu við 365 daga.'),value,
   work(mn(d.daily)+mo('·')+mn(365)+mo('=')+mn(readable(value)),mo('=')+sf(...normalize(value)))+' lítrar.', ['Margfaldaðu daglega notkun með fjölda daga.','Skrifaðu síðan útkomuna á staðalformi.']));
  const radius=normalMath(d.radius);
  const formula=fraction(mn(4),mn(3))+mi('π')+`<msup>${mi('r')}${mn(3)}</msup>`;
  q.push(choice(7,'Rúmmál kúlu','Kúla hefur radíus (geisla) r. Veldu rétta rúmmálsformúlu.',sphere(d.radius),
   [math(mi('R')+mo('=')+formula),math(mi('R')+mo('=')+mi('π')+`<msup>${mi('r')}${mn(2)}</msup>`),math(mi('R')+mo('=')+mn(2)+mi('π')+mi('r'))],0,
   'Rúmmál kúlu er fjórir þriðju af π sinnum radíus í þriðja veldi.', ['Rúmmál hefur þrjár víddir. Radíusinn er því hafinn í þriðja veldi.','Stuðullinn á undan π er fjórir þriðju.']));
  value=4/3*Math.PI*d.radius**3;
  let [rc,rn]=normalize(value);rc=Number(rc.toPrecision(3));
  q.push(science(7,'Rúmmál á staðalformi','Notaðu reiknivél og π-hnappinn. Skráðu rúmmálið í m³ á staðalformi með þremur markverðum tölustöfum.',given(`Radíus: ${radius} m`,math(mi('R')+mo('=')+formula)),value,
   work(mi('R')+mo('≈')+sf(rc,rn,3))+' m³. Námundaðu aðeins lokasvarið.', ['Settu radíusinn í sviga og reiknaðu þriðja veldi hans.','Bæði stuðullinn og tugveldið eru hafin í þriðja veldi. Haltu þremur markverðum tölustöfum í lokin.'],3));
  const [total,percent,population,eventArea]=d.land;
  value=total*(percent/100)*1e6/population;
  q.push(science(8,'Land á hvern íbúa','Í þessu tilbúna dæmi er hluti svæðisins land. Hve margir fermetrar lands eru að meðaltali á hvern íbúa? Skráðu svarið á staðalformi.',
   given(`Heildarflatarmál: ${normalMath(total)} km²`,`${percent}% svæðisins er land.`,`Íbúar: ${normalMath(population)}`),value,
   work(mn(readable(total*percent/100))+mo('·')+ten(6)+mo('=')+sf(...normalize(total*percent/100*1e6)),
   fraction(sf(...normalize(total*percent/100*1e6)),sf(...normalize(population)))+mo('=')+sf(...normalize(value)))+' m² á mann.',
   ['Finndu fyrst flatarmál landsins með því að margfalda heildarflatarmálið með prósentunni sem hundraðshluta.','1 km² = 10⁶ m². Breyttu í m² og deildu svo með fjölda íbúa.']));
  const space=eventArea*1e6/population;
  q.push(number(8,'Flatarmál á mann','Sami íbúafjöldi á að safnast saman á öðru svæði. Hve margir fermetrar verða á mann? Skráðu tölu án tugvelda.',given(`Svæðið: ${fmt(eventArea)} km²`,`Fjöldi fólks: ${normalMath(population)}`),space,'Fermetrar á mann',
   work(fraction(mn(readable(eventArea*1e6)),mn(readable(population)))+mo('=')+mn(fmt(space)))+' m² á mann.', ['Breyttu flatarmálinu úr km² í m².','Deildu fermetrafjöldanum með fjölda fólks.']));
  q.push(choice(8,'Dugar svæðið?','Í skipulagningunni er miðað við að hver maður þurfi að minnsta kosti 3 m². Dugar svæðið samkvæmt því viðmiði?',given(`Útreiknað flatarmál: ${fmt(space)} m² á mann`,'Viðmið: 3 m² á mann'),
   ['Já, útreiknað flatarmál er að minnsta kosti 3 m² á mann.','Nei, útreiknað flatarmál er minna en 3 m² á mann.','Það nægir að flatarmálið sé stór tala.'],space>=3?0:1,
   space>=3?'Já, flatarmálið á mann nær gefnu viðmiði.':'Nei, flatarmálið á mann nær ekki gefnu viðmiði.', ['Berðu saman flatarmálið á mann og gefið viðmið.','Niðurstaðan um hvort svæði dugi þarf að byggja á skýru viðmiði.']));
  return q;
 }
 return {names,starts,coreCount,coreGroups,variants,tasks,group:pos=>starts.findLastIndex(x=>pos>=x),fmt};
})();
