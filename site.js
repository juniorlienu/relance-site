// Relance site interactions: scroll reveals, animated conversations, demo bubble.
(function(){
  // ---- industry selector modal ----
  // Two uses: once on a first visit, and any time someone asks to watch the demo.
  var TRADES = [
    {key:'heating',    page:'heating.html',    img:'ind-heating.svg',    name:'Heating &amp; Home Services', sub:'Boilers &middot; heat pumps &middot; plumbing'},
    {key:'aesthetics', page:'aesthetics.html', img:'ind-aesthetics.svg', name:'Beauty &amp; Aesthetics',     sub:'Clinics &middot; injectors &middot; academies'},
    {key:'clinics',    page:'clinics.html',    img:'ind-clinics.svg',    name:'Clinics &amp; Therapists',    sub:'Chiropractors &middot; physios &middot; sports injury'}
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
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{threshold:.15});
  document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });

  // ---- animated phone conversations ----
  var CONVOS = {
    heating: {name:'Meridian Heating', sub:'replies in seconds', tag:'Lead recovered',
      m:[['in',"Sorry we missed your call. What can we help with?"],
         ['out',"My boiler's leaking and I've got no hot water"],
         ['in',"We'll get an engineer to you as quickly as we can. Is anyone vulnerable in the property?"],
         ['out',"Yes, my son is 8"],
         ['in',"Thanks for letting us know. The team will call you shortly to get someone out."]]},
    aesthetics: {name:'Lumiere Aesthetics', sub:'replies in seconds', tag:'Consultation booked',
      m:[['in',"Sorry we missed you. How can we help?"],
         ['out',"How much is lip filler?"],
         ['in',"Lip filler is from 180 to 280 pounds depending on volume, with a consultation first. Would you like us to call you to book one in?"],
         ['out',"Yes please, after 5pm"],
         ['in',"Lovely. The team will ring you after 5 to get you booked."]]},
    clinics: {name:'AM Sports Clinic', sub:'replies in seconds', tag:'Assessment booked',
      m:[['in',"Sorry we missed your call. What can we help with?"],
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
    var ki = 0;
    function cycle(){
      var c = CONVOS[kinds[ki % kinds.length]]; ki++;
      head.textContent = c.name; sub.textContent = c.sub;
      av.textContent = c.name.charAt(0);
      box.innerHTML = ''; if(tag){ tag.classList.remove('show'); }
      var i = 0;
      function next(){
        if(i >= c.m.length){ if(tag){ tag.textContent = c.tag; tag.classList.add('show'); } setTimeout(cycle, 3400); return; }
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

  // ---- floating demo bubble ----
  if(!document.body.hasAttribute('data-no-fab')){
    var fab = document.createElement('div'); fab.className = 'fab';
    fab.innerHTML = '<div class="fab-pop"><b>See it answer for real</b>'+
      '<p>Ring our demo line, let it ring out, and watch the reply land on your phone in seconds.</p>'+
      '<a href="tel:+447576584993">Call +44 7576 584993</a></div>'+
      '<button class="fab-btn" type="button">&#128222;&nbsp; Try the live demo</button>';
    document.body.appendChild(fab);
    fab.querySelector('.fab-btn').addEventListener('click', function(){ fab.classList.toggle('open'); });
  }
})();
