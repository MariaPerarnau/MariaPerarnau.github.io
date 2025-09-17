(function() {
  const DURATION = 1600;

  function easeInOutQuad(t) {
    return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;
  }

  function scrollToY(targetY, duration, onDone) {
    const startY = window.pageYOffset;
    const maxScroll = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight;
    const destination = Math.min(targetY, maxScroll);
    let startTime = null;
    let rafId;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutQuad(progress);
      window.scrollTo(0, Math.round(startY + (destination - startY) * eased));
      if (elapsed < duration) {
        rafId = requestAnimationFrame(step);
      } else {
        if (typeof onDone === 'function') onDone();
      }
    }
    rafId = requestAnimationFrame(step);
    return function cancel() { if (rafId) cancelAnimationFrame(rafId); };
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const targetY = target.getBoundingClientRect().top + window.pageYOffset;
      scrollToY(targetY, DURATION, function() {
        try { target.setAttribute('tabindex','-1'); target.focus({preventScroll:true}); } catch(err){}
        history.pushState(null,'',href);
      });
    });
  });
})();

document.addEventListener("mousemove", function(e) {
  if (Math.random() > 0.7) {
    let sparkle = document.createElement("span");
    sparkle.className = "glitter";
    let x = e.pageX + (Math.random() * 10 - 5);
    let y = e.pageY + (Math.random() * 10 - 5);
    sparkle.style.left = x + "px";
    sparkle.style.top = y + "px";
    document.body.appendChild(sparkle);
    setTimeout(() => { sparkle.remove(); }, 800);
  }
});
