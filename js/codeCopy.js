(() => {
  const figures = document.querySelectorAll('.markdown-body figure.highlight');
  for (const figure of figures) {
    const code = figure.querySelector('.code pre');
    if (!code) continue;
    const caption = figure.querySelector('figcaption') || document.createElement('figcaption');
    if (!caption.parentElement) figure.prepend(caption);
    if (!caption.textContent.trim()) caption.textContent = [...figure.classList].find(name => name !== 'highlight') || 'Code';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-code';
    button.textContent = '复制';
    button.setAttribute('aria-label', '复制代码');
    button.setAttribute('aria-live', 'polite');
    caption.append(button);
  }
  const clipboard = new ClipboardJS('.copy-code', {
    text: button => button.closest('figure').querySelector('.code pre').innerText
  });
  const timers = new WeakMap();
  function feedback(event, label) {
    const button = event.trigger;
    clearTimeout(timers.get(button));
    button.textContent = label;
    button.setAttribute('aria-label', label);
    timers.set(button, setTimeout(() => {
      button.textContent = '复制';
      button.setAttribute('aria-label', '复制代码');
    }, 1600));
  }
  clipboard.on('success', event => feedback(event, '已复制'));
  clipboard.on('error', event => feedback(event, '复制失败'));
})();
