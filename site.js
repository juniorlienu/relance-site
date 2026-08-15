// Relance site interactions: scroll reveals, animated conversations, demo bubble.
(function(){
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
