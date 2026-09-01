// Relance site interactions: scroll reveals, animated conversations, demo bubble.
(function(){
  // ---- industry selector modal ----
  // Two uses: once on a first visit, and any time someone asks to watch the demo.
  var TRADES = [
    {key:'heating', page:'heating.html', img:'ind-heating.svg', name:'Heat Pump &amp; Boiler Installations', sub:'ASHP &middot; oil swaps &middot; boiler replacements'},
    {key:'solar',   page:'solar.html',   img:'ind-solar.svg',   name:'Solar &amp; Battery Installations',    sub:'Solar PV &middot; battery storage &middot; retrofits'}
  ];

  function buildModal(opts){
    var back=document.createElement('div'); back.className='ibackdrop';
    back.innerHTML='<div class="imodal" role="dialog" aria-modal="true" aria-label="Choose your industry">'+
      '<div class="itop"><button class="iclose" type="button" aria-label="Close">&times;</button></div>'+
      '<h2>'+opts.title+'</h2>'+
      '<p class="isub">'+opts.sub+'</p>'+
      '<div class="icards">'+ TRADES.map(function(i){
        return '<a class="icard" href="'+opts.hrefFor(i)+'" data-ind="'+i.key+'">'+
          '<img class="iimg" src="'+i.img+'" alt="" aria-hidden="true">'+
          '<span class="iscrim"></span>'+
          '<h3>'+i.name+' <span>&rsaquo;</span></h3><p>'+i.sub+'</p></a>';
      }).join('') +'</div>'+
      '<a class="iother" href="'+opts.otherHref+'">'+opts.otherLabel+'</a>'+
      '<p class="ifoot">'+opts.foot+'</p>'+
      '</div>';
    document.body.appendChild(back);
    requestAnimationFrame(function(){ back.classList.add('show'); });
    function remember(v){ if(!opts.remember) return; try{ localStorage.setItem('relance-industry', v||'skipped'); }catch(e){} }
    function close(){ remember('skipped'); back.classList.remove('show'); setTimeout(function(){ back.remove(); },300); }
    back.querySelector('.iclose').addEventListener('click', close);
    back.addEventListener('click', function(e){ if(e.target===back) close(); });
    document.addEventListener('keydown', function esc(e){ if(e.key==='Escape'){ close(); document.removeEventListener('keydown', esc);} });
    back.querySelectorAll('.icard, .iother').forEach(function(a){
      a.addEventListener('click', function(){ remember(a.getAttribute('data-ind')||'other'); });
    });
  }

  // First visit: point people at the page for their trade.
  function industryModal(){
    if(document.body.hasAttribute('data-no-modal')) return;
    try{ if(localStorage.getItem('relance-industry')) return; }catch(e){}
    buildModal({
      title: 'We built <span style="color:var(--amber)">Relance</span> specifically for businesses like yours',
      sub: 'Choose your industry and see what it recovers.',
      hrefFor: function(i){ return i.page; },
      otherHref: 'book.html',
      otherLabel: "I'm in a different industry &rarr;",
      foot: 'We remember your choice so you only see this once.',
      remember: true
    });
  }
  setTimeout(industryModal, 900);

  // Watch the demo: same modal, but every card goes to the film for that trade.
  function demoModal(){
    buildModal({
      title: 'Which film do you want to see?',
      sub: 'Pick your trade and we will show you Relance working in it.',
      hrefFor: function(i){ return 'see-it.html?ind=' + i.key; },
      otherHref: 'see-it.html?ind=other',
      otherLabel: "I'm in a different industry &rarr;",
      foot: 'Two minutes. No sales call attached.',
      remember: false
    });
  }
  document.addEventListener('click', function(e){
    var t = e.target.closest ? e.target.closest('[data-demo-picker]') : null;
    if(!t) return;
    e.preventDefault();
    demoModal();
  });

  // ---- scroll reveals ----
  // Legacy, still used by the vertical pages. The homepage does not use it.
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{threshold:.15});
  document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });

  // ---- editorial entrances ----
  // Deliberately an attribute, not a class, and used exactly three times on
  // the homepage. If this ever needs a fourth, the answer is probably no.
  var enterIO = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('seen'); enterIO.unobserve(e.target); } });
  },{threshold:.25});
  document.querySelectorAll('[data-enter]').forEach(function(el){ enterIO.observe(el); });

  // ---- animated phone conversations ----
  var CONVOS = {
    heating: {name:'Meridian Heating', sub:'replies in seconds', tag:'Flagged urgent, passed to you',
      m:[['in',"Sorry we missed your call, this is Meridian Heating. What can we help with?"],
         ['out',"My boiler's leaking and I've got no hot water"],
         ['in',"Sorry to hear that. Is anyone in the house elderly, unwell or very young?"],
         ['out',"Yes, my son is 8"],
         ['in',"Thank you for telling us. The on-call engineer will ring you within the hour."]]},
    solar: {name:'Westfield Renewables', sub:'replies in seconds', tag:'Survey booked',
      m:[['in',"Sorry we missed your call, this is Westfield Renewables. What can we help with?"],
         ['out',"Looking at solar panels, maybe a battery too"],
         ['in',"Happy to help. Are you mainly looking to bring the bills down, or to store power for the evenings as well?"],
         ['out',"Bills mostly, they've gone mad"],
         ['in',"That's the right reason to look at it. A surveyor needs to see the roof to size it properly. We have Thursday at 10am or Friday at 2pm, which suits you?"],
         ['out',"Thursday please"],
         ['in',"Booked for Thursday at 10am. You'll get a confirmation by text, and the surveyor will ring when he sets off."]]},
    aesthetics: {name:'Lumiere Aesthetics', sub:'replies in seconds', tag:'Consultation booked',
      m:[['in',"Sorry we missed you, this is Lumiere Aesthetics. How can we help?"],
         ['out',"How much is lip filler?"],
         ['in',"Lip filler is from 180 to 280 pounds depending on volume, with a consultation first. Would you like us to call you to book one in?"],
         ['out',"Yes please, after 5pm"],
         ['in',"Lovely. The team will ring you after 5 to get you booked."]]},
    clinics: {name:'AM Sports Clinic', sub:'replies in seconds', tag:'Assessment booked',
      m:[['in',"Sorry we missed your call, this is AM Sports Clinic. What can we help with?"],
         ['out',"I've pulled something in my lower back, it's bad"],
         ['in',"That sounds painful. A first visit is 65 pounds for a full hour including assessment. The practitioner will call you between patients to get you seen."],
         ['out',"How soon can I come in?"],
         ['in',"Evening slots go quickly, so they'll ring shortly with the earliest time."]]}
  };

  function runPhone(el){
    var kinds = (el.dataset.convo || 'heating').split(',');
    var head = el.querySelector('.pname'), sub = el.querySelector('.psub'),
        av = el.querySelector('.pav'), box = el.querySelector('.pmsgs'),
        tag = el.querySelector('.ptag');
    // The four stages read alongside the phone are the product, not decoration.
    // They light in step with the conversation so the workflow is watched
    // rather than explained: rings out, answered, qualified, booked.
    var unit = el.parentElement,
        stages = unit ? unit.querySelectorAll('.stages li') : [],
        miss = el.querySelector('.pmiss');
    function stage(n){
      for(var s = 0; s < stages.length; s++){ stages[s].classList.toggle('on', s <= n); }
    }
    var ki = 0;
    function cycle(){
      var c = CONVOS[kinds[ki % kinds.length]]; ki++;
      head.textContent = c.name; sub.textContent = c.sub;
      av.textContent = c.name.charAt(0);
      box.innerHTML = ''; if(tag){ tag.classList.remove('show'); }
      // A missed call is what starts all of this, so the thread says so first
      // and everything else waits a beat behind it.
      if(miss){ miss.classList.remove('show'); setTimeout(function(){ miss.classList.add('show'); }, 260); }
      stage(0);
      var qualifiedAt = Math.max(1, c.m.length - 3);
      var i = 0;
      function next(){
        if(i >= c.m.length){ if(tag){ tag.textContent = c.tag; tag.classList.add('show'); } stage(3); setTimeout(cycle, 3400); return; }
        if(i === 1) stage(1);
        if(i === qualifiedAt) stage(2);
        var m = c.m[i++];
        if(m[0] === 'in'){
          var t = document.createElement('div'); t.className = 'pb in typing show';
          t.innerHTML = '<i></i><i></i><i></i>'; box.appendChild(t);
          setTimeout(function(){
            t.classList.remove('typing'); t.innerHTML = ''; t.textContent = m[1];
            setTimeout(next, 1500 + m[1].length * 8);
          }, 900);
        } else {
          var b = document.createElement('div'); b.className = 'pb out'; b.textContent = m[1];
          box.appendChild(b); requestAnimationFrame(function(){ b.classList.add('show'); });
          setTimeout(next, 1300);
        }
      }
      next();
    }
    var seen = new IntersectionObserver(function(es){
      if(es[0].isIntersecting){ seen.disconnect(); cycle(); }
    },{threshold:.3});
    seen.observe(el);
  }
  document.querySelectorAll('.phone[data-convo]').forEach(runPhone);


  // ---- mobile menu ----
  // The nav collapses to a single CTA under 640px, so this is the only route
  // to the rest of the site on a phone. A disclosure, not a takeover.
  (function(){
    var nav = document.querySelector('nav'),
        btn = nav && nav.querySelector('.menubtn');
    if(!btn) return;
    function set(open){
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    btn.addEventListener('click', function(){ set(!nav.classList.contains('open')); });
    nav.querySelectorAll('.menupanel a').forEach(function(a){
      a.addEventListener('click', function(){ set(false); });
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && nav.classList.contains('open')){ set(false); btn.focus(); }
    });
    document.addEventListener('click', function(e){
      if(nav.classList.contains('open') && !nav.contains(e.target)) set(false);
    });
  })();

  // ---- floating demo bubble ----
  if(!document.body.hasAttribute('data-no-fab')){
    // Each vertical has its own sub-account and its own number. A page can name
    // its own with data-demo-tel and data-demo-num; the heating line is the default.
    var demoTel = document.body.getAttribute('data-demo-tel') || '+447576584993';
    var demoNum = document.body.getAttribute('data-demo-num') || '+44 7576 584993';
    var fab = document.createElement('div'); fab.className = 'fab';
    fab.innerHTML = '<div class="fab-pop"><b>See it answer for real</b>'+
      '<p>Ring our demo line, let it ring out, and watch the reply land on your phone in seconds.</p>'+
      '<a href="tel:'+demoTel+'">Call '+demoNum+'</a></div>'+
      '<button class="fab-btn" type="button">Try the live demo</button>';
    document.body.appendChild(fab);
    fab.querySelector('.fab-btn').addEventListener('click', function(){ fab.classList.toggle('open'); });
  }
})();
