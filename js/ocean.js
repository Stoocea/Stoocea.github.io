(() => {
  const canvas = document.querySelector('.ocean-surface')
  const ctx = canvas?.getContext('2d')
  if (!ctx) return

  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  let width, height, ink, glint, seawater, drySand, wetSand
  let elapsed = 0
  let lastFrame = 0
  let frame = 0
  let visible = false

  // A gliding gull, drawn once at its native pixel resolution.
  const gull = document.createElement('canvas')
  const plumage = { '#': '#515b5b', '+': '#969e99', o: '#d6d6cb', W: '#fbfaf4', B: '#bf9973' }
  const pixels = [
    '##                    ',
    ' ##+                  ',
    '  ++o          ##     ',
    '   +oo        #+      ',
    '    ooW      +o       ',
    '     oWW    oW        ',
    '      oWW  oW    WW   ',
    '     ++oWWWWWWWWWW#B  ',
    '   ++ooWWWWWWWWWW     ',
    '    oooWWoooo         ',
  ]
  gull.width = pixels[0].length
  gull.height = pixels.length
  const sprite = gull.getContext('2d')
  pixels.forEach((line, y) => [...line].forEach((pixel, x) => {
    if (pixel === ' ') return
    sprite.fillStyle = plumage[pixel]
    sprite.fillRect(x, y, 1, 1)
  }))

  function drawGull(x, y, size, phase) {
    const glide = elapsed * .42 + phase
    ctx.drawImage(gull, Math.round(width * x + Math.sin(glide) * 13),
      Math.round(height * y + Math.sin(glide * 1.6) * 5), gull.width * size, gull.height * size)
  }

  function drawShore() {
    const unit = 2
    for (let x = Math.floor(width * .43 / unit) * unit; x < width; x += unit) {
      const u = (x / width - .43) / .57
      const wash = Math.sin(u * 12 - elapsed * .85) * 2 + Math.sin(u * 31 + elapsed * .55)
      const shore = Math.round((height * (1.04 - .23 * u + .022 * Math.sin(u * 8)) + wash) / unit) * unit
      ctx.fillStyle = glint
      ctx.fillRect(x, shore, unit, 3)
      ctx.fillStyle = wetSand
      ctx.fillRect(x, shore + 3, unit, 4)
      ctx.fillStyle = drySand
      ctx.fillRect(x, shore + 7, unit, Math.max(0, height - shore - 7))
      // Sparse, fixed grains stay on the beach as the waterline advances.
      const seed = Math.imul(x + 157, 2654435761) >>> 0
      const grainY = height * (.78 + .22 * (seed % 193) / 193)
      if (seed % 3 === 0 && grainY > shore + 9) {
        ctx.fillStyle = wetSand
        ctx.fillRect(x, grainY, unit * 2, unit)
      }
    }
  }

  function paint() {
    ctx.clearRect(0, 0, width, height)
    const horizon = height * .24
    const span = Math.max(640, width)
    const step = Math.max(4, width / 180)
    const points = []

    // Draw the sea from back to front. Each nearer swell hides the water behind it.
    for (let row = 0; row < 56; row++) {
      const depth = row / 55
      const perspective = .12 + depth * depth
      const baseline = horizon + height * depth * depth * .87
      const amplitude = height * .135 * perspective
      for (let i = 0, x = -step; x < width + step * 2; x += step, i++) {
        const across = (x - width * .7) / span
        const phase = across * 18 / (.52 + depth) + row * .44 - elapsed * .94
        const cross = across * 34 / (.65 + depth) - row * .28 + elapsed * .61
        const swell = Math.sin(phase + .45 * Math.sin(cross * .46))
        const ripple = Math.sin(cross) * .24 + Math.sin(phase * 2.8 + cross * .8) * .08
        const crest = Math.max(0, swell)
        const y = baseline - amplitude * (swell * .62 + crest ** 3 * .72 + ripple)
        points[i] = { x, y, sheen: Math.cos(phase + .38 * Math.sin(cross)) + .55 * Math.cos(cross),
          foam: crest ** 5 * (.58 + .42 * Math.sin(cross + phase * .34)) }
      }
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (const point of points) ctx.lineTo(point.x, point.y)
      ctx.lineTo(width + step * 2, height + amplitude)
      ctx.lineTo(-step, height + amplitude)
      ctx.closePath()
      ctx.globalAlpha = 1
      ctx.fillStyle = seawater
      ctx.fill()
      const face = ctx.createLinearGradient(0, baseline - amplitude * 1.5, 0, baseline + amplitude)
      face.addColorStop(0, ink)
      face.addColorStop(.66, seawater)
      face.addColorStop(1, ink)
      ctx.globalAlpha = .24 + depth * .22
      ctx.fillStyle = face
      ctx.fill()

      // Thin, broken reflections in the distance broaden into whitecaps near the viewer.
      ctx.strokeStyle = glint
      ctx.lineWidth = .5 + depth * .6
      ctx.globalAlpha = .18 + depth * .23
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (const point of points) {
        if (point.sheen > -.12) ctx.lineTo(point.x, point.y)
        else ctx.moveTo(point.x, point.y)
      }
      ctx.stroke()
      ctx.fillStyle = glint
      for (const point of points) {
        if (point.foam < .13) continue
        ctx.globalAlpha = point.foam * (.5 + depth * .48)
        ctx.fillRect(point.x, point.y - depth, step * (.32 + point.foam * .7), .7 + perspective * 1.5)
      }
    }
    ctx.globalAlpha = 1
    drawShore()
    drawGull(.76, .10, 1.7, 1)
    drawGull(.87, .18, 1.45, 3)
    drawGull(.62, .29, width < 600 ? 2 : 2.8, 5)
  }

  function resize() {
    width = canvas.clientWidth
    height = canvas.clientHeight
    const ratio = .5
    canvas.width = Math.round(width * ratio)
    canvas.height = Math.round(height * ratio)
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.imageSmoothingEnabled = false
    updateColors()
  }

  function updateColors() {
    const style = getComputedStyle(canvas)
    ink = style.color
    glint = style.getPropertyValue('--wave-glint').trim()
    seawater = style.getPropertyValue('--seawater').trim()
    drySand = style.getPropertyValue('--dry-sand').trim()
    wetSand = style.getPropertyValue('--wet-sand').trim()
    paint()
  }

  function tick(now) {
    if (now - lastFrame >= 40) {
      if (lastFrame) elapsed += Math.min(now - lastFrame, 100) / 1000
      lastFrame = now
      paint()
    }
    frame = requestAnimationFrame(tick)
  }

  function updatePlayback() {
    cancelAnimationFrame(frame)
    lastFrame = 0
    if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(tick)
  }

  resize()
  new ResizeObserver(resize).observe(canvas)
  new MutationObserver(updateColors).observe(document.documentElement, { attributes: true, attributeFilter: ['color-mode'] })
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    updatePlayback()
  }).observe(canvas)
  reduced.addEventListener('change', updatePlayback)
  document.addEventListener('visibilitychange', updatePlayback)
})()
