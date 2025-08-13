if(typeof document!=='undefined'){
  document.addEventListener('DOMContentLoaded',()=>{
  const root=document.documentElement;
  const themeBtn=document.getElementById('theme-toggle');
  const storedTheme=localStorage.getItem('theme');
  if(storedTheme) root.dataset.theme=storedTheme;
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

  // mark current page
  document.querySelectorAll('#site-nav a').forEach(a=>{
    const href=a.getAttribute('href');
    if(href&&location.pathname.endsWith(href)) a.setAttribute('aria-current','page');
  });

  // search form submit
  const searchForm=document.getElementById('search-form');
  if(searchForm){
    function problemRedirect(q){
      const ql=q.toLowerCase();
      const tokens=(ql.match(/\w+/g)||[]);
      let year,problem,exam,grade,variant;

      for(const t of tokens){
        if(/^(19|20)\d{2}$/.test(t)) year=t;
      }

      if(tokens.some(t=>t.includes('amc'))){
        let combo=tokens.find(t=>/^amc(8|10|12)([ab])?$/i.test(t));
        if(combo){
          const m=combo.match(/^amc(8|10|12)([ab])?$/i);
          grade=m[1];
          variant=m[2];
        }else{
          combo=tokens.find(t=>/^(8|10|12)([ab])?$/i.test(t));
          if(combo){
            const m=combo.match(/^(8|10|12)([ab])?$/i);
            grade=m[1];
            variant=m[2];
          }
        }
        if(!grade){
          const g=tokens.find(t=>/^(8|10|12)$/i.test(t));
          if(g) grade=g;
        }
        if(!variant){
          const v=tokens.find(t=>/^[ab]$/i.test(t));
          if(v) variant=v;
        }
        if(grade) exam=`AMC_${grade}${variant?variant.toUpperCase():''}`;
      }else if(tokens.includes('aime')){
        exam='AIME';
        const v=tokens.find(t=>/^(i{1,3}|1|2)$/i.test(t));
        if(v){
          const vv=v.toLowerCase();
          if(vv==='1'||vv==='i') exam='AIME_I';
          else if(vv==='2'||vv==='ii') exam='AIME_II';
          else exam=`AIME_${vv.toUpperCase()}`;
          variant=vv;
        }
      }else if(tokens.some(t=>t==='usamo'||t==='usmo')){
        exam='USAMO';
      }else if(tokens.some(t=>t==='usajmo'||(t==='usa'&&tokens.includes('jmo')))){
        exam='USAJMO';
      }

      if(!problem){
        for(const t of tokens){
          if(/^\d{1,2}$/.test(t)&&t!==year&&t!==grade&&t!==variant){problem=t;break;}
        }
      }

      if(exam&&year&&problem){
        location.href=`https://artofproblemsolving.com/wiki/index.php/${year}_${exam}_Problems/Problem_${Number(problem)}`;
        return true;
      }
      if(exam&&year){
        location.href=`https://artofproblemsolving.com/wiki/index.php/${year}_${exam}_Problems`;
        return true;
      }
      return false;
    }

    searchForm.addEventListener('submit',e=>{
      const q=searchForm.querySelector('input[name="q"]').value.trim();
      if(!q){e.preventDefault();return;}
      if(problemRedirect(q)){
        e.preventDefault();
        return;
      }
      if(q.toLowerCase().startsWith('aops:')){
        e.preventDefault();
        const query=encodeURIComponent(q.slice(5).trim());
        location.href=`https://www.google.com/search?q=site:artofproblemsolving.com+${query}`;
      }
    });
  }

  // search results page
  const resultsEl=document.getElementById('search-results');
  if(resultsEl){
    const params=new URLSearchParams(location.search);
    const q=params.get('q')||'';
    document.getElementById('search-term').textContent=q;
    if(!q){
      resultsEl.textContent='Please enter a search query.';
    }else{
      fetch('assets/search-index.json').then(r=>r.ok?r.json():Promise.reject()).then(data=>{
        const ql=q.toLowerCase();
        const matches=data.filter(it=>`${it.title} ${(it.tags||[]).join(' ')}`.toLowerCase().includes(ql));
        if(matches.length){
          const ul=document.createElement('ul');
          matches.forEach(m=>{
            const li=document.createElement('li');
            li.innerHTML=`<a href="${m.url}">${m.title}</a><p>${m.summary||''}</p>`;
            ul.appendChild(li);
          });
          resultsEl.appendChild(ul);
        }else{
          resultsEl.textContent='No results found.';
        }
      }).catch(()=>{
        location.href=`https://www.google.com/search?q=site:thjjjjjjjjjhhy.github.io/olympiad+${encodeURIComponent(q)}`;
      });
    }
  }

  // books page
  const grid=document.getElementById('books-grid');
  if(grid){
    const fallback=grid.innerHTML;
    fetch('assets/books.json').then(r=>r.ok?r.json():Promise.reject()).then(render).catch(()=>{grid.innerHTML=fallback;});
    function amazonLink(b){
      if(b.amazon_url) return b.amazon_url;
      if(b.asin) return `https://www.amazon.com/dp/${b.asin}`;
      if(b.isbn13) return `https://www.amazon.com/s?k=${encodeURIComponent(b.isbn13)}`;
      return `https://www.amazon.com/s?k=${encodeURIComponent(b.title+' Art of Problem Solving')}`;
    }
    function render(list){
      grid.innerHTML='';
      list.forEach(b=>{
        const card=document.createElement('article');
        card.className='card';
        const tags=(b.level||[]).map(t=>`<span class="tag">${t}</span>`).join('');
        card.innerHTML=`<h2>${b.title}</h2><p>${b.author}</p><div class="tags">${tags}</div><a href="${amazonLink(b)}" target="_blank" rel="noopener noreferrer nofollow">Amazon</a>`;
        grid.appendChild(card);
      });
    }
  }

  // tutor form
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

  // diagnostic button
  const diagBtn=document.getElementById('diagnostic-btn');
  diagBtn&&diagBtn.addEventListener('click',()=>{location.href='diagnostic.html';});

  // diagnostic page
  const diagForm=document.getElementById('diagnostic-form');
  if(diagForm){
    const prefExam=document.getElementById('target-exam');
    const prefDate=document.getElementById('target-date');
    const prefMinutes=document.getElementById('daily-minutes');
    const PREF_KEY='diagnosticPrefs';
    const savedPrefs=JSON.parse(localStorage.getItem(PREF_KEY)||'{}');
    if(savedPrefs.target_exam) prefExam.value=savedPrefs.target_exam;
    if(savedPrefs.target_date) prefDate.value=savedPrefs.target_date;
    if(savedPrefs.daily_minutes) prefMinutes.value=savedPrefs.daily_minutes;
    function savePrefs(){
      localStorage.setItem(PREF_KEY,JSON.stringify({
        target_exam:prefExam.value,
        target_date:prefDate.value,
        daily_minutes:prefMinutes.value
      }));
    }
    [prefExam,prefDate,prefMinutes].forEach(el=>el.addEventListener('change',savePrefs));

    let questionBank=null;
    async function loadQuestions(){
      questionBank=await fetch('assets/diagnostic_bank.json').then(r=>r.json());
      renderQuestions();
    }
    function renderQuestions(){
      if(!questionBank) return;
      const container=document.getElementById('questions-container');
      let questions=[];
      const exam=prefExam.value;
      if(exam==='AIME'){
        questions=questionBank.AMC.slice(0,10).concat(questionBank.AIME.slice(0,5));
      }else if(exam==='USAMO'){
        questions=questionBank.AIME.slice(0,15);
      }else{
        questions=questionBank.AMC.slice(0,15);
      }
      container.innerHTML='';
      const sections={};
      questions.forEach(q=>{(sections[q.section]=sections[q.section]||[]).push(q);});
      let idx=1;
      Object.entries(sections).forEach(([section,qs])=>{
        const sec=document.createElement('section');
        const h2=document.createElement('h2');
        h2.textContent=section;
        sec.appendChild(h2);
        qs.forEach(q=>{
          const div=document.createElement('div');
          div.className='question';
          div.dataset.skill=q.skill;
          div.dataset.difficulty=q.difficulty;
          const fieldset=document.createElement('fieldset');
          const legend=document.createElement('legend');
          legend.textContent=`${idx}. ${q.problem}`;
          fieldset.appendChild(legend);
          q.choices.forEach((choice,i)=>{
            const label=document.createElement('label');
            const input=document.createElement('input');
            input.type='radio';
            input.name=`q${idx}`;
            input.value=choice;
            if(i===q.answer) input.dataset.correct='1';
            label.appendChild(input);
            label.appendChild(document.createTextNode(choice));
            fieldset.appendChild(label);
          });
          div.appendChild(fieldset);
          sec.appendChild(div);
          idx++;
        });
        container.appendChild(sec);
      });
      container.querySelectorAll('.question').forEach(q=>{
        q.addEventListener('focusin',()=>{if(!q.dataset.start) q.dataset.start=Date.now();});
      });
    }
    prefExam.addEventListener('change',renderQuestions);
    loadQuestions();

    document.getElementById('finish-diagnostic').addEventListener('click',async()=>{
      const responses=[];
      diagForm.querySelectorAll('.question').forEach(q=>{
        const choice=q.querySelector('input:checked');
        const start=q.dataset.start?Number(q.dataset.start):Date.now();
        const time_sec=(Date.now()-start)/1000;
        responses.push({
          correct:!!(choice&&choice.dataset.correct),
          time_sec:Number(time_sec.toFixed(1)),
          skill:q.dataset.skill,
          difficulty:q.dataset.difficulty
        });
      });
      const results={user:{
        target_exam:prefExam.value,
        target_date:prefDate.value,
        daily_minutes:Number(prefMinutes.value||0)
      },responses};
      if(window.OlympiadEngine&&typeof window.OlympiadEngine.planFromDiagnostic==='function'){
        try{
          const [skills,bank,map,policy]=await Promise.all([
            fetch('assets/skills_graph.json').then(r=>r.json()),
            fetch('assets/practice_bank.json').then(r=>r.json()),
            fetch('assets/aops_map.json').then(r=>r.json()),
            fetch('assets/policy.json').then(r=>r.json())
          ]);
          const plan=await window.OlympiadEngine.planFromDiagnostic(results,{skills,bank,map,policy});

          location.href='study-plan.html';
        }catch(err){
          console.error(err);
          alert('Could not generate plan.');
        }
      }else{

      }
    });
  }

  // study plan page
  const planDisplay=document.getElementById('plan-display');
  if(planDisplay){
    const planJson=localStorage.getItem('studyPlanJson');
    if(planJson){
      const plan=JSON.parse(planJson);
      planDisplay.innerHTML='';
      plan.forEach(day=>{
        const sec=document.createElement('section');
        const h2=document.createElement('h2');
        h2.textContent=new Date(day.date).toDateString();
        sec.appendChild(h2);
        const ul=document.createElement('ul');
        day.blocks.forEach(b=>{
          const li=document.createElement('li');
          li.textContent=`${b.title} (${b.minutes} min)`;
          ul.appendChild(li);
        });
        sec.appendChild(ul);
        planDisplay.appendChild(sec);
      });
    }else{
      planDisplay.textContent='No plan found. Please take the diagnostic first.';
    }
  }

  // dev link checker
  if(location.search.includes('debug=1')){
    document.querySelectorAll('a[href]').forEach(a=>{
      const href=a.getAttribute('href');
      if(!href||href.includes('javascript:')||(!href.startsWith('http')&&!href.startsWith('/')&&!href.startsWith('#')&&!href.endsWith('.html')&&!href.startsWith('mailto:'))){
        console.warn('Potential bad link:',href,a);
      }
    });
  }

  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js');
  }
});
}

