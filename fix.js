const fs=require('fs'); 
let h=fs.readFileSync('public/index.html','utf8'); 
h=h.replace('Alfa - Chefe: Cerqueira',''); 
fs.writeFileSync('public/index.html',h,'utf8'); 
console.log('OK'); 
