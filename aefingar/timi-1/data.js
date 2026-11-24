'use strict';
const ExerciseData = (() => {
  const names=['Margfalda veldi','Deila veldum','Núll og ósýnilegur veldisvísir','Margfalda fleiri þætti','Hefja lið í veldi','Rúmmál kassa','Flatarmál rétthyrnings','Fleiri breytur','Margfeldi eða summa'];
  const starts=[0,2,4,6,7,8,10,12,13];
  const variants=[
    {prod:[3,2,4,5],quot:[21,6,7,2],inverse:[12,2,18,5],zero:4,recip:3,factors:[2,1.5,4,2,1,3],square:[4,2],box:[2,3,7],area:[2.4,3],multi:[24,3,2,8,2,4],sum:[4,2,5,3]},
    {prod:[2,3,7,4],quot:[32,7,8,3],inverse:[15,3,25,5],zero:6,recip:4,factors:[3,0.5,5,1,2,2],square:[3,3],box:[3,4,5],area:[1.5,5],multi:[30,4,2,6,2,3],sum:[3,4,7,2]},
    {prod:[5,2,3,4],quot:[45,8,9,3],inverse:[14,2,21,6],zero:5,recip:5,factors:[2,2.5,3,3,1,2],square:[6,2],box:[2,5,8],area:[2.5,4],multi:[42,4,3,7,2,5],sum:[6,2,4,4]}
  ];
  const fmt=n=>String(n).replace('.',',');
  const mn=n=>`<mn>${fmt(n)}</mn>`,mi=v=>`<mi>${v}</mi>`,mo=x=>`<mo>${x}</mo>`;
  const pow=(v,n)=>n===1?mi(v):`<msup>${mi(v)}${mn(n)}</msup>`;
  const term=(c,v,n)=>`${c===1?'':mn(c)}${pow(v,n)}`;
  const frac=(a,b)=>`<mfrac><mrow>${a}</mrow><mrow>${b}</mrow></mfrac>`;
  const math=s=>`<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow>${s}</mrow></math>`;
  const equation=(a,b)=>math(a+mo('=')+b);
  const group=pos=>starts.findLastIndex(x=>pos>=x);
  const choice=(part,title,prompt,board,options,correct,explain,hints)=>({part,title,prompt,board,type:'choice',options,correct,explain,hints});
  const numbers=(part,title,prompt,board,answer,explain,hints,variable='x')=>({part,title,prompt,board,type:'numbers',answer,variable,explain,hints});
  function figure(type,values) {
    const labels=values.map(v=>fmt(v)+'x');
    const svg=type==='box'
      ?`<path d="M100 105L175 48H405L330 105Z" fill="#f8ebca"/><path d="M330 105L405 48V195L330 252Z" fill="#c9d5ad"/><path d="M100 105H330V252H100Z" fill="#f2d49b"/><path d="M100 105L175 48H405V195L330 252H100ZM100 105H330L405 48M330 105V252" fill="none" stroke="#81503b" stroke-width="2"/><path d="M175 48V195L100 252M175 195H405" fill="none" stroke="#81503b" stroke-dasharray="6 5"/><text x="215" y="284">${labels[0]}</text><text x="390" y="250">${labels[1]}</text><text x="65" y="182">${labels[2]}</text>`
      :`<rect x="120" y="55" width="280" height="175" fill="#f8ebca" stroke="#81503b" stroke-width="2"/><text x="260" y="267">${labels[0]}</text><text x="75" y="149">${labels[1]}</text>`;
    const description=type==='box'?`Rétthyrndur kassi með brúnarlengdirnar ${labels.join(', ')} sentímetra.`:`Rétthyrningur með hliðarlengdirnar ${labels.join(' og ')} sentímetra.`;
    return `<svg viewBox="0 0 520 310" role="img" aria-label="${description}"><g class="algebra-figure">${svg}</g></svg><p class="figure-note">Lengdir eru í cm. Myndin er ekki í réttum hlutföllum.</p>`;
  }
  function tasks(seed) {
    const d=variants[seed],out=[];
    let [a,m,b,n]=d.prod;
    let product=term(a,'x',m)+mo('·')+term(b,'x',n);
    out.push(choice(0,'Hvaða regla á við?','Þú ert að margfalda veldi með sama veldisstofni.',math(product),['Margfalda veldisvísana.','Leggja veldisvísana saman.','Draga veldisvísana frá.'],1,'Veldisstofninn helst og veldisvísarnir eru lagðir saman.', ['Hugsaðu um veldin sem endurtekna margföldun.','Teldu alla x-þættina í margfeldinu.']));
    out.push(numbers(0,'Finndu stuðul og veldisvísi','Einfaldaðu margfeldið. Skráðu stuðulinn og veldisvísinn í sitt hvorn reit.',math(product),[a*b,m+n],equation(product,term(a*b,'x',m+n)),['Margfaldaðu stuðlana hvorn við annan.',`Leggðu saman veldisvísana ${m} og ${n}.`]));
    [a,m,b,n]=d.quot;
    let quotient=frac(term(a,'x',m),term(b,'x',n));
    out.push(numbers(1,'Deildu stuðlum og veldum','Einfaldaðu brotið. Hér er x ekki núll.',math(quotient),[a/b,m-n],equation(quotient,term(a/b,'x',m-n)),[`Deildu ${a} með ${b}.`,`Dragðu veldisvísi nefnarans frá veldisvísi teljarans: ${m} − ${n}.`]));
    [a,m,b,n]=d.inverse;
    const gcd=(x,y)=>y?gcd(y,x%y):x,g=gcd(a,b),p=a/g,q=b/g;
    quotient=frac(term(a,'x',m),term(b,'x',n));
    const answer=frac(mn(p),term(q,'x',n-m));
    out.push(choice(1,'Hvar verða x-þættirnir eftir?','Veldu einfaldasta formið með jákvæðum veldisvísum. Hér er x ekki núll.',math(quotient),[math(frac(term(p,'x',n-m),mn(q))),math(frac(mn(p),term(q,'x',m+n))),math(answer)],2,equation(quotient,answer)+' Fleiri x-þættir eru í nefnaranum en teljaranum.', ['Styttu talnahlutann fyrst.',`Styttu ${m} x-þætti úr teljara og nefnara. Þá eru ${n-m} x-þættir eftir í nefnaranum.`]));
    quotient=frac(pow('x',d.zero),pow('x',d.zero));
    out.push(numbers(2,'Sama veldi í teljara og nefnara','Skráðu gildi brotsins. Hér er x ekki núll.',math(quotient),[1],equation(quotient,mn(1))+' Tala sem er ekki núll deilt með sjálfri sér er 1. Því er x⁰ = 1.', ['Teljari og nefnari hafa sama gildi.','Deiling í sjálft sig gefur 1.']));
    quotient=frac(mi('x'),pow('x',d.recip));
    out.push(choice(2,'Ósýnilegi veldisvísirinn','Mundu að x merkir x¹. Veldu rétt svar; x er ekki núll.',math(quotient),[math(frac(mn(1),pow('x',d.recip-1))),math(pow('x',d.recip-1)),math(frac(mn(1),pow('x',d.recip)))],0,equation(quotient,frac(mn(1),pow('x',d.recip-1))), ['Styttu einn x-þátt úr teljara og nefnara.','Teljarinn verður 1. Hve margir x-þættir eru eftir í nefnaranum?']));
    const [c1,c2,c3,e1,e2,e3]=d.factors;
    product=term(c1,'t',e1)+mo('·')+term(c2,'t',e2)+mo('·')+term(c3,'t',e3);
    out.push(numbers(3,'Þrír þættir','Margfaldaðu stuðlana og sameinaðu veldin.',math(product),[c1*c2*c3,e1+e2+e3],equation(product,term(c1*c2*c3,'t',e1+e2+e3)),[`Reiknaðu ${fmt(c1)} · ${fmt(c2)} · ${fmt(c3)}.`,`Leggðu saman veldisvísana ${e1}, ${e2} og ${e3}.`],'t'));
    [a,m]=d.square;
    const squared=`<msup><mrow>${mo('(')}${term(a,'a',m)}${mo(')')}</mrow>${mn(2)}</msup>`;
    out.push(numbers(4,'Allur liðurinn í öðru veldi','Sviginn sýnir hvað er hafið í veldi.',math(squared),[a*a,m*2],equation(squared,term(a*a,'a',m*2)),['Veldisvísirinn 2 merkir að margfalda allan liðinn með sjálfum sér.',`Reiknaðu ${a} · ${a} og leggðu saman ${m} + ${m}.`],'a'));
    const [l,w,h]=d.box,volume=l*w*h;
    out.push(choice(5,'Veldu aðferð fyrir rúmmál','Allar þrjár brúnarlengdirnar eru gefnar. Hvaða aðgerð finnur rúmmálið?',figure('box',d.box),['Leggja saman lengd, breidd og hæð.','Margfalda lengd, breidd og hæð.','Margfalda lengd og breidd.'],1,'Rúmmál rétthyrnds kassa er lengd · breidd · hæð.', ['Hugsaðu um grunnflöt kassans fyrst.','Margfaldaðu flatarmál grunnflatarins með hæðinni.']));
    out.push(numbers(5,'Reiknaðu rúmmál kassans','Skráðu stuðul og veldisvísi. Rúmmálið er gefið í cm³.',figure('box',d.box),[volume,3],equation(term(l,'x',1)+mo('·')+term(w,'x',1)+mo('·')+term(h,'x',1),term(volume,'x',3))+' cm³.', ['Settu allar þrjár lengdirnar inn í margfeldið.','Þrír x-þættir gefa x³.']));
    [a,b]=d.area;
    out.push(choice(6,'Veldu aðferð fyrir flatarmál','Hvernig finnur þú flatarmál rétthyrningsins?',figure('rectangle',d.area),['Margfalda lengd og breidd.','Leggja saman lengd og breidd.','Tvöfalda summu lengdar og breiddar.'],0,'Flatarmál rétthyrnings er lengd · breidd.',['Flatarmál segir til um stærð flatarins.','Ummál er lengd jaðarsins; hér er spurt um flatarmál.']));
    const area=Math.round(a*b*100)/100;
    out.push(numbers(6,'Reiknaðu flatarmálið','Skráðu stuðul og veldisvísi. Flatarmálið er gefið í cm².',figure('rectangle',d.area),[area,2],equation(term(a,'x',1)+mo('·')+term(b,'x',1),term(area,'x',2))+' cm².', [`Margfaldaðu ${fmt(a)} með ${fmt(b)}.`, 'x · x = x².']));
    const [ac,ap,aq,bc,bp,bq]=d.multi, coeff=ac/bc;
    quotient=frac(term(ac,'p',ap)+pow('q',aq),term(bc,'p',bp)+pow('q',bq));
    const multiAnswer=frac(term(coeff,'p',ap-bp),pow('q',bq-aq));
    out.push(choice(7,'Tvær breytur í sama broti','Einfaldaðu. Hér eru p og q ekki núll.',math(quotient),[math(term(coeff,'p',ap-bp)+pow('q',bq-aq)),math(multiAnswer),math(frac(term(coeff,'q',bq-aq),pow('p',ap-bp)))],1,equation(quotient,multiAnswer),['Styttu stuðlana og skoðaðu síðan hvora breytu fyrir sig.','p-þættir verða eftir í teljara en q-þættir í nefnara.']));
    [a,m,b,n]=d.sum;
    product=term(a,'x',m)+mo('·')+term(b,'x',n);
    out.push(numbers(8,'Fyrst margfeldi','Margföldunarmerkið ræður aðferðinni.',math(product),[a*b,m+n],equation(product,term(a*b,'x',m+n)),['Margfaldaðu stuðlana.','Leggðu veldisvísana saman.']));
    const sum=term(a,'x',m)+mo('+')+term(b,'x',n);
    out.push(choice(8,'Síðan summa','Nú er plúsmerki á milli sömu liða. Hvað á við?',math(sum),['Leggja saman stuðla og veldisvísa.','Nota sama svar og við margföldunina.','Liðirnir eru ekki líkir og því má ekki sameina þá.'],2,'Veldisvísarnir eru ólíkir, svo liðirnir eru ekki líkir. Stæðan helst '+math(sum)+'.',['Við samlagningu er aðeins hægt að sameina líka liði.','Berðu saman veldisvísa liðanna.']));
    return out;
  }
  return {names,starts,variants,tasks,group,fmt};
})();
