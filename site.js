// Relance site: the phone demo, the mobile menu, the film picker, three reveals.
// No first-visit modal and no floating bubble: one door at a time.
(function(){
  // Each conversation is the whole journey: the missed call, the survey, the quote
  // chased, the Monday text. A ['scene', label] entry changes the header line and
  // clears the thread; a ['card', text] entry is the owner's Monday message.
  var CONVOS = {
    heating: {name:'Westfield Renewables', sub:'replies in about eight seconds',
      m:[['scene','Missed call','19:42'],
         ['in',"Thanks for getting in touch with Westfield Renewables. Sorry we missed you. What can we help with?"],
         ['out',"We're on oil and the bills are painful. Thinking about a heat pump"],
         ['in',"That's usually where a heat pump makes the biggest difference. Is it your own home, and roughly when were you hoping to have it sorted?"],
         ['out',"Own home. Before winter ideally"],
         ['in',"Our surveyor can come out Thursday at 10:00 or Friday at 14:00. Which suits?"],
         ['out',"Thursday please"],
         ['in',"Booked for Thursday at 10:00. Reply if anything changes."],
         ['stage',1],
         ['scene','Two days after the quote','Day 2'],
         ['in',"Hi James, did the quote come through all right? Happy to talk any of it through."],
         ['out',"It did. Let's go ahead"],
         ['in',"Brilliant. I'll get the install date over to you today."],
         ['stage',2],
         ['scene','Your phone','Mon 08:00'],
         ['card',"Morning. Your week with Lance:\n- 14 enquiries answered, 9 out of hours\n- 4 surveys in the diary\n- 6 quotes chased, 1 signed\n- 3 old leads re-opened"],
         ['stage',3]]},
    solar: {name:'Westfield Renewables', sub:'replies in about eight seconds',
      m:[['scene','Missed call','19:42'],
         ['in',"Thanks for getting in touch with Westfield Renewables. Sorry we missed you. What can we help with?"],
         ['out',"Looking at solar panels, maybe a battery too"],
         ['in',"Happy to help. Are you mainly after lower bills, or storing power for the evenings as well?"],
         ['out',"Bills mostly, they've gone mad"],
         ['in',"Our surveyor needs to see the roof to size it properly. We have Thursday at 10:00 or Friday at 14:00, which suits?"],
         ['out',"Thursday"],
         ['in',"Booked for Thursday at 10:00. Reply if anything changes."],
         ['stage',1],
         ['scene','Two days after the quote','Day 2'],
         ['in',"Hi Priya, did the quote come through all right? Happy to talk any of it through."],
         ['out',"Yes thanks. We'd like to go ahead"],
         ['in',"Brilliant. I'll get the install date over to you today."],
         ['stage',2],
         ['scene','Your phone','Mon 08:00'],
         ['card',"Morning. Your week with Lance:\n- 14 enquiries answered, 9 out of hours\n- 4 surveys in the diary\n- 6 quotes chased, 1 signed\n- 3 old leads re-opened"],
         ['stage',3]]}
  };

  function runPhone(el){
    var kinds = (el.dataset.convo || 'heating').split(',');
    var head = el.querySelector('.pname'), sub = el.querySelector('.psub'),
        av = el.querySelector('.pav'), box = el.querySelector('.pmsgs'),
        miss = el.querySelector('.pmiss'), missLabel = miss && miss.querySelector('span'), missTime = miss && miss.querySelector('time');
    var unit = el.parentElement, stages = unit ? unit.querySelectorAll('.stages li') : [];
    function stage(n){ for(var s = 0; s < stages.length; s++){ stages[s].classList.toggle('on', s <= n); } }
    var ki = 0;
    function cycle(){
      var c = CONVOS[kinds[ki % kinds.length]]; ki++;
      head.textContent = c.name; sub.textContent = c.sub; av.textContent = c.name.charAt(0);
      box.innerHTML = ''; stage(-1);
      var i = 0;
      function next(){
        if(i >= c.m.length){ setTimeout(cycle, 4200); return; }
        var m = c.m[i++];
        if(m[0] === 'scene'){
          box.innerHTML = '';
          if(miss){ miss.classList.remove('show'); if(missLabel) missLabel.textContent = m[1]; if(missTime) missTime.textContent = m[2]; setTimeout(function(){ miss.classList.add('show'); }, 200); }
          if(i === 1) stage(0);
          setTimeout(next, 900); return;
        }
        if(m[0] === 'stage'){ stage(m[1]); setTimeout(next, 2200); return; }
        if(m[0] === 'card'){
          var k = document.createElement('div'); k.className = 'pb card'; k.textContent = m[1];
          box.appendChild(k); requestAnimationFrame(function(){ k.classList.add('show'); });
          setTimeout(next, 900); return;
        }
        if(m[0] === 'in'){
          var t = document.createElement('div'); t.className = 'pb in typing show';
          t.innerHTML = '<i></i><i></i><i></i>'; box.appendChild(t);
          setTimeout(function(){ t.classList.remove('typing'); t.innerHTML = ''; t.textContent = m[1]; setTimeout(next, 1400 + m[1].length * 8); }, 900);
        } else {
          var b = document.createElement('div'); b.className = 'pb out'; b.textContent = m[1];
          box.appendChild(b); requestAnimationFrame(function(){ b.classList.add('show'); });
          setTimeout(next, 1300);
        }
      }
      next();
    }
    var seen = new IntersectionObserver(function(es){ if(es[0].isIntersecting){ seen.disconnect(); cycle(); } },{threshold:.3});
    seen.observe(el);
  }
  document.querySelectorAll('.phone[data-convo]').forEach(runPhone);

  // Headline: split the three words into letters and light them one at a time,
  // one line after another. The underline draws once the last word is lit.
  (function(){
    var h = document.querySelector('.hero h1.anim'); if(!h) return;
    var words = h.querySelectorAll('.w'), letters = [];
    words.forEach(function(w){
      var text = w.textContent; w.textContent = '';
      for(var i = 0; i < text.length; i++){ var el = document.createElement('i'); el.textContent = text[i]; w.appendChild(el); letters.push({el: el, word: w}); }
    });
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce){ letters.forEach(function(l){ l.el.classList.add('on'); }); words.forEach(function(w){ w.classList.add('on'); }); return; }
    var t = 700, lastWord = null;
    letters.forEach(function(l){
      if(lastWord && l.word !== lastWord) t += 320;
      lastWord = l.word;
      (function(el, at){ setTimeout(function(){ el.classList.add('on'); }, at); })(l.el, t);
      t += 75;
    });
    setTimeout(function(){ words.forEach(function(w){ w.classList.add('on'); }); }, t + 150);
  })();

  // Reveals: used a handful of times on the homepage, nowhere else.
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('seen'); io.unobserve(e.target); } }); },{threshold:.2});
  document.querySelectorAll('[data-enter]').forEach(function(el){ io.observe(el); });

  // Mobile menu
  (function(){
    var nav = document.querySelector('nav.top'), btn = nav && nav.querySelector('.menubtn');
    if(!btn) return;
    function set(open){ nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    btn.addEventListener('click', function(){ set(!nav.classList.contains('open')); });
    nav.querySelectorAll('.menupanel a').forEach(function(a){ a.addEventListener('click', function(){ set(false); }); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && nav.classList.contains('open')){ set(false); btn.focus(); } });
    document.addEventListener('click', function(e){ if(nav.classList.contains('open') && !nav.contains(e.target)) set(false); });
  })();

  // Sound toggle: loops are muted so they can autoplay; one tap turns the sound
  // on for that loop and off for any other, so two never play over each other.
  document.querySelectorAll('.film .sound').forEach(function(btn){
    btn.addEventListener('click', function(){
      var v = btn.parentElement.querySelector('video'); if(!v) return;
      var on = v.muted;
      document.querySelectorAll('.film video').forEach(function(o){ if(o !== v){ o.muted = true; } });
      document.querySelectorAll('.film .sound').forEach(function(b){ if(b !== btn){ b.setAttribute('aria-pressed','false'); b.textContent = 'Sound off'; b.setAttribute('aria-label','Turn sound on'); } });
      v.muted = !on; v.volume = 1;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.textContent = on ? 'Sound on' : 'Sound off';
      btn.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
      if(on){ v.currentTime = 0; v.play().catch(function(){}); }
    });
  });

  // Autoplaying product loops only play when on screen. Saves data on a phone.
  (function(){
    var vids = document.querySelectorAll('video[data-loop]'); if(!vids.length) return;
    var vio = new IntersectionObserver(function(es){ es.forEach(function(e){ var v = e.target; if(e.isIntersecting){ v.play().catch(function(){}); } else { v.pause(); } }); },{threshold:.35});
    vids.forEach(function(v){ vio.observe(v); });
  })();
})();
