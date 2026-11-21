(() => {
  const nav = document.querySelector('.reading-toc');
  if (!nav) return;

  const list = nav.querySelector('#reading-sections');
  const button = nav.querySelector('button');
  const label = nav.querySelector('.current-section');
  const article = nav.closest('article');
  const sections = Array.from(list.querySelectorAll('a[href^="#"]'), link => ({
    link,
    heading: document.getElementById(decodeURIComponent(link.hash.slice(1)))
  })).filter(section => section.heading);
  if (!sections.length) return;

  let current;
  let pending = false;
  nav.classList.add('enhanced');

  function revealCurrent() {
    if (!current || !list.clientHeight) return;
    const bounds = list.getBoundingClientRect();
    const item = current.link.getBoundingClientRect();
    if (item.top < bounds.top) list.scrollTop += item.top - bounds.top;
    else if (item.bottom > bounds.bottom) list.scrollTop += item.bottom - bounds.bottom;
  }

  function trackSection() {
    pending = false;
    const offset = parseFloat(getComputedStyle(sections[0].heading).scrollMarginTop) + 2;
    let first = 0;
    let end = sections.length;
    while (first < end) {
      const middle = Math.floor((first + end) / 2);
      if (sections[middle].heading.getBoundingClientRect().top <= offset) first = middle + 1;
      else end = middle;
    }
    const atEnd = window.scrollY > 0 && article.getBoundingClientRect().bottom <= window.innerHeight + 1;
    const next = sections[atEnd ? sections.length - 1 : Math.max(0, first - 1)];
    if (next === current) return;
    if (current) current.link.removeAttribute('aria-current');
    current = next;
    current.link.setAttribute('aria-current', 'location');
    label.textContent = current.link.textContent.trim();
    revealCurrent();
  }

  function scheduleUpdate() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(trackSection);
  }

  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    if (open) revealCurrent();
  });
  list.addEventListener('click', event => {
    if (event.target.closest('a[href]')) button.setAttribute('aria-expanded', 'false');
  });
  nav.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.offsetWidth && button.getAttribute('aria-expanded') === 'true') {
      button.setAttribute('aria-expanded', 'false');
      button.focus();
    }
  });

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('pageshow', scheduleUpdate);
  new ResizeObserver(scheduleUpdate).observe(article);
  trackSection();
})();
