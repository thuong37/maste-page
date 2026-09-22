// Rotate the Orion employer banner between three still images.
(() => {
  const showcase = document.querySelector('.hero-ad-showcase');
  const image = showcase?.querySelector('.spotlight-banner-img');
  const overlay = showcase?.querySelector('.spotlight-slide-overlay');
  const dots = [...(showcase?.querySelectorAll('.spotlight-slide-dot') || [])];
  if (!image || !overlay || dots.length !== 3) return;

  const slides = [
    {
      src: 'assets/banners/employer-spotlight-banner.jpg',
      alt: 'Đội ngũ Orion Technologies tại khuôn viên công nghệ',
      headline: '',
      subline: ''
    },
    {
      src: 'assets/banners/employer-spotlight-team.png',
      alt: 'Đội ngũ công nghệ cùng làm việc tại văn phòng Orion',
      headline: 'Cùng kiến tạo tương lai',
      subline: 'Gia nhập đội ngũ công nghệ Orion'
    },
    {
      src: 'assets/banners/employer-spotlight-innovation.png',
      alt: 'Các kỹ sư hợp tác trong phòng nghiên cứu công nghệ',
      headline: 'Biến ý tưởng thành hiện thực',
      subline: 'Khám phá những cơ hội mới tại Orion'
    }
  ];

  slides.slice(1).forEach(slide => { const preload = new Image(); preload.src = slide.src; });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let timer;

  const show = next => {
    index = next;
    const slide = slides[index];
    image.src = slide.src;
    image.alt = slide.alt;
    overlay.hidden = !slide.headline;
    overlay.querySelector('.spotlight-slide-headline').textContent = slide.headline;
    overlay.querySelector('.spotlight-slide-subline').textContent = slide.subline;
    dots.forEach((dot, dotIndex) => dot.setAttribute('aria-current', String(dotIndex === index)));
  };
  const stop = () => { clearInterval(timer); timer = undefined; };
  const start = () => {
    stop();
    if (!document.hidden && !reducedMotion.matches && !showcase.matches(':hover, :focus-within')) {
      timer = setInterval(() => show((index + 1) % slides.length), 5000);
    }
  };

  dots.forEach((dot, dotIndex) => dot.addEventListener('click', () => {
    show(dotIndex);
    start();
  }));
  showcase.addEventListener('mouseenter', stop);
  showcase.addEventListener('mouseleave', start);
  showcase.addEventListener('focusin', stop);
  showcase.addEventListener('focusout', () => setTimeout(start, 0));
  document.addEventListener('visibilitychange', start);
  reducedMotion.addEventListener('change', start);
  start();
})();
