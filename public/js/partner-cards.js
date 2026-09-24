// Advance the featured employer strip one card every four seconds.
(() => {
  const strip = document.querySelector('.hero-brand-strip');
  const viewport = strip?.querySelector('.marquee-slider-container');
  const cards = [...(strip?.querySelectorAll('.marquee-partner-card') || [])];
  if (!viewport || cards.length < 2) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const GAP = 12;
  const CARDS_VISIBLE = 3;
  let index = 0;
  let timer;

  const updateCardWidth = () => {
    const cardWidth = (viewport.clientWidth - GAP * (CARDS_VISIBLE - 1)) / CARDS_VISIBLE;
    strip.style.setProperty('--partner-card-w', `${cardWidth}px`);
  };

  const stop = () => {
    clearInterval(timer);
    timer = undefined;
  };
  const advance = () => {
    const step = cards[1].offsetLeft - cards[0].offsetLeft;
    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    if (step <= 0 || maxScroll <= 0) return;
    const lastIndex = Math.ceil(maxScroll / step);
    index = (index + 1) % (lastIndex + 1);
    viewport.scrollLeft = Math.min(index * step, maxScroll);
  };
  const start = () => {
    stop();
    if (!document.hidden && !reducedMotion.matches && !strip.matches(':hover, :focus-within')) {
      timer = setInterval(advance, 4000);
    }
  };

  strip.addEventListener('mouseenter', stop);
  strip.addEventListener('mouseleave', start);
  strip.addEventListener('focusin', stop);
  strip.addEventListener('focusout', () => setTimeout(start, 0));
  document.addEventListener('visibilitychange', start);
  reducedMotion.addEventListener('change', start);
  window.addEventListener('resize', () => {
    index = 0;
    updateCardWidth();
    viewport.scrollLeft = 0;
    start();
  });
  updateCardWidth();
  start();
})();
