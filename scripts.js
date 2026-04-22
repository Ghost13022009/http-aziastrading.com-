(function(){
    // theme toggle
    const root=document.documentElement, toggle=document.querySelector('[data-theme-toggle]');
    let theme=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
    root.setAttribute('data-theme',theme);
    const updateIcon=()=>{toggle.innerHTML=theme==='dark'?'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>':'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'};
    updateIcon();
    toggle.addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';root.setAttribute('data-theme',theme);updateIcon();});

    // reveal on scroll
    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('is-visible')})},{threshold:.14});
    document.querySelectorAll('[data-reveal]').forEach(el=>obs.observe(el));

    // parallax
    const pEls=document.querySelectorAll('[data-parallax]');
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!reduce&&pEls.length){
      const h=()=>{const s=window.scrollY;pEls.forEach(el=>{const sp=parseFloat(el.dataset.parallax||'0.12');el.style.setProperty('--shift',(s*sp).toFixed(2))})};
      h();window.addEventListener('scroll',h,{passive:true});
    }

// SERVICES redesigned scroll story
const ssVisual=document.getElementById('ssVisual');
const ssSteps=[...document.querySelectorAll('.ss-step')];
const ssTabs=[...document.querySelectorAll('.ss-tab')];
const ssGlow=ssVisual ? ssVisual.querySelector('.ss-glow') : null;
const ssRefs={
  heading:document.getElementById('ssHeading'), status:document.getElementById('ssStatus'),
  start:document.getElementById('ssStart'), mid:document.getElementById('ssMid'), end:document.getElementById('ssEnd'), truck:document.getElementById('ssTruckLabel'),
  a1:document.getElementById('ssCardA1'), a2:document.getElementById('ssCardA2'), a3:document.getElementById('ssCardA3'),
  b1:document.getElementById('ssCardB1'), b2:document.getElementById('ssCardB2'), b3:document.getElementById('ssCardB3'),
  c1:document.getElementById('ssCardC1'), c2:document.getElementById('ssCardC2'), c3:document.getElementById('ssCardC3')
};
const ssScenes=[
  {heading:'Оплата партии',status:'Начало работы',start:'Европа',mid:'Наш склад',end:'Клиент',truck:'EU',a1:'Оплата',a2:'Согласование партии',a3:'Фиксируем количество, стоимость и сроки поставки.',b1:'Этап',b2:'Старт сделки',b3:'Партия запускается после согласования оплаты.',c1:'Flow',c2:'Подготовка к отправке',c3:'Первый этап задает условия всей дальнейшей поставки.'},
  {heading:'Организация логистики',status:'Организация процесса',start:'Европа',mid:'Наш склад',end:'Клиент',truck:'EU',a1:'Маршрут',a2:'Построение логистики',a3:'Создаем маршрут для минимализации сроков поставки.',b1:'Документы',b2:'Поток согласований',b3:'Организовываем бухгалтерию и движение всех документов.',c1:'PREPARATION',c2:'Подготовка к приему',c3:'Подготавливаем документы и склад для приема партии.'},
  {heading:'Доставка на наш склад',status:'Контроль приема',start:'Европа',mid:'Наш склад',end:'Клиент',truck:'EU',a1:'Прием',a2:'Осмотр партии',a3:'После оплаты партия едет на наш склад для осмотра.',b1:'Склад',b2:'Переупаковка',b3:'Подготавливаем товар к дальнейшей доставке клиенту.',c1:'Control',c2:'Промежуточная точка',c3:'Склад помогает проверить и стабилизировать поставку перед финалом.'},
  {heading:'Отправка клиенту',status:'Финальная доставка',start:'Европа',mid:'Наш склад',end:'Клиент',truck:'OPS',a1:'Согласование',a2:'Время доставки',a3:'Согласовываем с клиентом удобное время приема.',b1:'Отправка',b2:'Финальный этап',b3:'Партия уходит на склад клиента после тщательного осмотра.',c1:'Result',c2:'Отгрузка клиенту',c3:'Финальная отправка завершает маршрут без лишних разрывов.'}
];
function ssApply(idx){
  if(!ssVisual || idx<0 || idx>=ssScenes.length) return;
  const s=ssScenes[idx];
  ssVisual.dataset.scene=String(idx);
  ssSteps.forEach((el,i)=>el.classList.toggle('is-active',i===idx));
  ssTabs.forEach((el,i)=>el.classList.toggle('is-active',i===idx));
  Object.entries(s).forEach(([k,v])=>{ if(ssRefs[k]) ssRefs[k].textContent=v; });
}
ssTabs.forEach((tab,i)=>tab.addEventListener('click',()=>ssApply(i)));
ssSteps.forEach((step,i)=>step.addEventListener('click',()=>step.scrollIntoView({behavior:'smooth',block:'center'})));
if(ssVisual){
  if(!reduce){
    const section=document.getElementById('services');
    let ticking=false;
    const update=()=>{
      const viewport=window.innerHeight;
      const rect=section.getBoundingClientRect();
      const total=Math.max(1,rect.height-viewport);
      const p=Math.min(1,Math.max(0,-rect.top/total));
      ssVisual.style.setProperty('--card-shift', `${(Math.sin(p*Math.PI)*14).toFixed(2)}px`);
      if(ssGlow){
        const glowX=(Math.sin(p*Math.PI)*18).toFixed(2);
        const glowY=(Math.cos(p*Math.PI)*-10).toFixed(2);
        ssGlow.style.transform=`translate(${glowX}px, ${glowY}px)`;
      }
      let best=0, bestDist=Infinity;
      const focus=viewport*0.38;
      ssSteps.forEach((step,i)=>{
        const r=step.getBoundingClientRect();
        const anchor=r.top+Math.min(120,r.height*.28);
        const dist=Math.abs(anchor-focus);
        if(dist<bestDist){best=i;bestDist=dist;}
      });
      ssApply(best);
      ticking=false;
    };
    const onScroll=()=>{ if(!ticking){ requestAnimationFrame(update); ticking=true; } };
    update();
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onScroll);
  } else {
    ssApply(0);
  }
}

// form
    document.getElementById('leadForm').addEventListener('submit',function(e){
      e.preventDefault();
      const d=new FormData(this);
      const name=(d.get('name')||'').toString().trim();
      const contact=(d.get('contact')||'').toString().trim();
      const msg=(d.get('message')||'').toString().trim();
      window.location.href='mailto:senkovets.a@me.com?subject='+encodeURIComponent('Новая заявка с сайта Азиастрейдинг')+'&body='+encodeURIComponent('Имя: '+name+'\nКонтакты: '+contact+'\n\nОписание:\n'+msg);
    });
  })();

// Horizontal scroll animation like user's Framer Motion
const hScrollSection = document.querySelector('.horizontal-scroll');
if (hScrollSection) {
  const container = hScrollSection.querySelector('.h-scroll-container');
  const progress = { current: 0 };

  const updateScroll = () => {
    const rect = hScrollSection.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = Math.max(1, rect.height - vh);
    progress.current = Math.min(1, Math.max(0, -rect.top / total));
    const x = progress.current * -66.6;
    container.style.transform = `translateX(${x}%)`;
  };

  updateScroll();
  window.addEventListener('scroll', updateScroll, { passive: true });
}