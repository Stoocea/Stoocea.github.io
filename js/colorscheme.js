const themeButton = document.getElementById('switch-color-scheme')
const root = document.documentElement

function syncThemeButton() {
  themeButton.setAttribute('aria-pressed', String(root.getAttribute('color-mode') === 'dark'))
}

themeButton.addEventListener('click', () => {
  const mode = root.getAttribute('color-mode') === 'dark' ? 'light' : 'dark'
  root.setAttribute('color-mode', mode)
  localStorage.setItem('color-mode', mode)
  syncThemeButton()
})
syncThemeButton()
