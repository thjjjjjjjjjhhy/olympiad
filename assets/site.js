document.addEventListener('DOMContentLoaded',()=>{
  const root=document.documentElement;
  const themeBtn=document.getElementById('theme-toggle');
  const stored=localStorage.getItem('theme');
  if(stored) root.dataset.theme=stored;
  themeBtn&&themeBtn.addEventListener('click',()=>{
    const next=root.dataset.theme==='dark'?'light':'dark';
    root.dataset.theme=next;
    localStorage.setItem('theme',next);
  });

  const menuBtn=document.getElementById('menu-button');
  const nav=document.getElementById('site-nav');
  let lastFocused;
  function toggleNav(show){
    nav.classList.toggle('open',show);
    menuBtn.setAttribute('aria-expanded',show);
    if(show){
      lastFocused=document.activeElement;
      const first=nav.querySelector('a,button');
      first&&first.focus();
    }else{
      lastFocused&&lastFocused.focus();
    }
  }
  menuBtn&&menuBtn.addEventListener('click',()=>toggleNav(!nav.classList.contains('open')));
  document.addEventListener('keydown',e=>{
    if(!nav.classList.contains('open')) return;
    if(e.key==='Escape'){
      toggleNav(false);
    }else if(e.key==='Tab'){
      const focusables=nav.querySelectorAll('a,button');
      const first=focusables[0];
      const last=focusables[focusables.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });

  const grid=document.getElementById('books-grid');
  if(grid){
    const defaults=[
      {title:'Art of Problem Solving Volume 1',why:'Comprehensive intro to contest math.',tags:['AMC'],link:'https://artofproblemsolving.com/store/book/aops-vol-1'},
      {title:'Competition Math for Middle School',why:'Great for early preparation.',tags:['AMC'],link:'https://www.amazon.com/dp/1463781541'},
      {title:'AIME Problem Series',why:'Focuses on AIME-style problems.',tags:['AIME'],link:'https://artofproblemsolving.com/store/aime-problems'},
      {title:'The IMO Compendium',why:'Advanced olympiad problems.',tags:['USAMO'],link:'https://imocompendium.com/'}
    ];
    fetch('assets/books.json').then(r=>r.ok?r.json():Promise.reject()).then(render).catch(()=>render(defaults));
    function render(list){
      grid.innerHTML='';
      list.forEach(b=>{
        const card=document.createElement('article');
        card.className='card';
        card.innerHTML=`<h2>${b.title}</h2><p>${b.why}</p><div class="tags">${b.tags.map(t=>`<span class=tag>${t}</span>`).join('')}</div><a href="${b.link}" target="_blank" rel="noopener">Learn more</a>`;
        grid.appendChild(card);
      });
    }
  }

  const form=document.getElementById('tutor-form');
  if(form){
    const status=document.getElementById('form-status');
    const fields=['name','email','goals'];
    const saved=JSON.parse(localStorage.getItem('tutorForm')||'{}');
    fields.forEach(f=>{if(saved[f]) form.elements[f].value=saved[f];});
    form.addEventListener('submit',e=>{
      e.preventDefault();
      let valid=true;const data={};
      fields.forEach(f=>{
        const input=form.elements[f];
        const err=document.getElementById(`${f}-error`);
        if(!input.value.trim()||(f==='email'&&!input.validity.valid)){
          err.textContent=`Please enter a valid ${f}.`;
          valid=false;
        }else{
          err.textContent='';
          data[f]=input.value.trim();
        }
      });
      if(valid){
        localStorage.setItem('tutorForm',JSON.stringify(data));
        form.reset();
        status.textContent='Thanks! You are on the waitlist.';
      }else{
        status.textContent='';
      }
    });
  }

  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js');
  }
});
