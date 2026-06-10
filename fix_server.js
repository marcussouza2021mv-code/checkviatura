const fs=require('fs'); 
let s=fs.readFileSync('server.js','utf8'); 
let rota="// APROVAR CHECKLIST\napp.post('/api/checklists/:id/aprovar',(req,res)=>{\n  const db=readDB();\n  const idx=db.checklists.findIndex(c=>String(c.id)===String(req.params.id));\n  if(idx===-1)return res.status(404).json({error:'Nao encontrado'});\n  db.checklists[idx]={...db.checklists[idx],...req.body};\n  writeDB(db);\n  res.json(db.checklists[idx]);\n});\n// EXPORT CSV"; 
s=s.replace('// EXPORT CSV',rota); 
fs.writeFileSync('server.js',s,'utf8'); 
console.log('OK'); 
