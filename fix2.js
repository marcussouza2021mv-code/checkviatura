const fs=require('fs'); 
let h=fs.readFileSync('public/index.html','utf8'); 
let old = '      Selecione a equipe..."></option><option value="Alfa">Alfa \u2014 Chefe: Cerqueira</option><option value="Bravo">Bravo \u2014 Chefe: Savio"
h=h.replace(old,''); 
fs.writeFileSync('public/index.html',h,'utf8'); 
console.log('OK'); 
