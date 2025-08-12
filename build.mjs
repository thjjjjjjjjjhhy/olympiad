import {cp, mkdir} from 'fs/promises';
const files=['index.html','planning.html','books.html','tutor.html','manifest.webmanifest','sw.js','robots.txt','sitemap.xml','favicon.svg'];
await mkdir('dist',{recursive:true});
for(const f of files){
  await cp(f,`dist/${f}`,{recursive:true});
}
await cp('assets','dist/assets',{recursive:true});
