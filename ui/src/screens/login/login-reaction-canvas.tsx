import { useEffect, useRef, type RefObject } from 'react'
import { useReducedMotion } from 'motion/react'
import { cn } from '~/utils/cn'

interface Reaction {
  x: number; y: number; vx: number; vy: number; radius: number
  angle: number; alpha: number; rest: number; sprite: HTMLCanvasElement
}
interface Collider { x: number; y: number; width: number; height: number; radius: number }
const EMOJI = ['🍿', '😂', '😭', '❤️', '😱', '🔥', '👀', '🥹', '💀', '✨']
// The final friend avatar settles at 1.88s; leave a short pause before the rain.
const RAIN_DELAY_SECONDS = 2.2
// Tailwind's md breakpoint, where the splash switches from its phone layout.
const DESKTOP = 768

export function LoginReactionCanvas({ stage, state, resting = false }: { stage: RefObject<HTMLElement | null>; state: string; resting?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const currentState = useRef(state)
  const kick = useRef<() => void>(() => {})
  const refresh = useRef<() => void>(() => {})
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    currentState.current = state
    refresh.current()
    if (state === 'connecting' || state === 'welcome' || (resting && state === 'wrong')) kick.current()
  }, [state, resting])
  useEffect(() => {
    const root = stage.current, surface = canvas.current
    if (!root || !surface || reducedMotion) return
    const context = surface.getContext('2d')
    if (!context) return
    const sprites = EMOJI.map(emoji => {
      const sprite = document.createElement('canvas')
      sprite.width = sprite.height = 128
      const ctx = sprite.getContext('2d')!
      ctx.font = '100px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(emoji, 64, 71)
      return sprite
    })
    const reactions: Reaction[] = []
    const rainStartTick = Math.round(RAIN_DELAY_SECONDS * 60)
    let width = 0, height = 0, floor = 0, ratio = 1, tick = 0, frame = 0, last = performance.now(), accumulator = 0
    let colliders: Collider[] = []
    let pointer: { x: number; y: number; vx: number; vy: number } | null = null
    const measure = () => {
      const bounds = root.getBoundingClientRect()
      const resized = width !== bounds.width || height !== bounds.height
      width = bounds.width; height = bounds.height; ratio = Math.min(window.devicePixelRatio || 1, 2)
      const form = resting && width < DESKTOP ? root.querySelector('form')?.getBoundingClientRect() : null
      // On mobile the pile rests above the form, leaving the controls clear.
      floor = form ? form.top - bounds.top : height
      const pixelWidth = Math.round(width * ratio), pixelHeight = Math.round(height * ratio)
      // Assigning either dimension clears the canvas, even if its value is unchanged.
      if (surface.width !== pixelWidth) surface.width = pixelWidth
      if (surface.height !== pixelHeight) surface.height = pixelHeight
      colliders = Array.from(root.querySelectorAll<HTMLElement>('[data-reaction-shelf]')).flatMap(element => {
        const range = document.createRange()
        range.selectNodeContents(element)
        const solid = element.matches('button, input, [data-reaction-solid]')
        const boxes = solid ? [element.getBoundingClientRect()] : Array.from(range.getClientRects())
        return boxes.filter(rect => rect.width > 4).map(rect => ({
          x: rect.left - bounds.left, y: rect.top - bounds.top + (solid ? 0 : rect.height * .17),
          width: rect.width, height: rect.height * (solid ? 1 : .68),
          radius: solid ? Math.min(rect.height / 2, parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0) : 0,
        }))
      })
      if (resting && resized) seed()
    }
    const collide = (reaction: Reaction, box: Collider) => {
      const x = Math.max(box.x + box.radius, Math.min(reaction.x, box.x + box.width - box.radius))
      const y = Math.max(box.y + box.radius, Math.min(reaction.y, box.y + box.height - box.radius))
      let dx = reaction.x - x, dy = reaction.y - y
      const radius = reaction.radius + box.radius, squared = dx * dx + dy * dy
      if (squared >= radius * radius) return
      let distance = Math.sqrt(squared)
      if (distance < .001) { dx = 0; dy = -1; distance = 1 }
      const nx = dx / distance, ny = dy / distance
      reaction.x = x + nx * radius; reaction.y = y + ny * radius
      const velocity = reaction.vx * nx + reaction.vy * ny
      if (velocity < 0) { reaction.vx = (reaction.vx - 1.3 * velocity * nx) * .94; reaction.vy -= 1.3 * velocity * ny }
    }
    const step = () => {
      tick++
      if (!resting && tick >= rainStartTick && (tick - rainStartTick) % 18 === 0 && reactions.length < 30 && currentState.current !== 'welcome') {
        const radius = width >= DESKTOP ? 20 + Math.random() * 8 : 15 + Math.random() * 6
        // Send 40% to each outer quarter and 20% to the middle half.
        const lane = Math.random(), laneStart = lane < .4 ? 0 : lane < .8 ? .75 : .25
        const laneWidth = lane < .8 ? .25 : .5
        reactions.push({ x: radius + (laneStart + Math.random() * laneWidth) * (width - radius * 2), y: -radius - Math.random() * 40,
          vx: (Math.random() - .5) * 3, vy: 0, radius, angle: (Math.random() - .5) * .6,
          alpha: 1, rest: 0, sprite: sprites[Math.floor(Math.random() * sprites.length)] })
      }
      for (const reaction of reactions) {
        reaction.vx *= .995; reaction.vy = (reaction.vy + .38) * .995
        if (pointer) {
          const dx = reaction.x - pointer.x, dy = reaction.y - pointer.y
          const distance = Math.hypot(dx, dy), radius = reaction.radius + 46
          if (distance > 0 && distance < radius) {
            const force = (radius - distance) / radius
            reaction.vx += dx / distance * force * 2.4 + pointer.vx * .1 * force
            reaction.vy += dy / distance * force * 2.4 + pointer.vy * .1 * force
          }
        }
        reaction.x += reaction.vx; reaction.y += reaction.vy; reaction.angle += reaction.vx / reaction.radius * .5
      }
      if (pointer) { pointer.vx *= .5; pointer.vy *= .5 }
      for (let iteration = 0; iteration < 2; iteration++) {
        for (let i = 0; i < reactions.length; i++) {
          for (let j = i + 1; j < reactions.length; j++) {
            const a = reactions[i], b = reactions[j], dx = b.x - a.x, dy = b.y - a.y, radius = a.radius + b.radius
            const distance = Math.hypot(dx, dy)
            if (!distance || distance >= radius) continue
            const nx = dx / distance, ny = dy / distance, overlap = (radius - distance) / 2
            a.x -= nx * overlap; a.y -= ny * overlap; b.x += nx * overlap; b.y += ny * overlap
            const velocity = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
            if (velocity < 0) {
              const impulse = velocity * .55
              a.vx += nx * impulse; a.vy += ny * impulse; b.vx -= nx * impulse; b.vy -= ny * impulse
            }
          }
        }
        for (const reaction of reactions) {
          if (currentState.current !== 'welcome') colliders.forEach(box => collide(reaction, box))
          if (reaction.y > floor - reaction.radius) {
            reaction.y = floor - reaction.radius
            if (reaction.vy > 0) reaction.vy *= -.25
            reaction.vx *= .92
          }
          if (reaction.x < reaction.radius) { reaction.x = reaction.radius; reaction.vx = Math.abs(reaction.vx) * .5 }
          if (reaction.x > width - reaction.radius) { reaction.x = width - reaction.radius; reaction.vx = -Math.abs(reaction.vx) * .5 }
        }
      }
      for (let i = reactions.length - 1; i >= 0; i--) {
        const reaction = reactions[i]
        if (!resting && Math.abs(reaction.vx) + Math.abs(reaction.vy) < .8) {
          const lifetime = reaction.y > height - reaction.radius - 2 ? 150 : 540
          if (++reaction.rest > lifetime) reaction.alpha -= .04
        } else reaction.rest = 0
        if (reaction.alpha <= 0) reactions.splice(i, 1)
      }
    }
    const seed = () => {
      reactions.length = 0
      const desktop = width >= DESKTOP, spacing = desktop ? 50 : 36
      const columns = Math.max(1, Math.floor((width - 20) / spacing))
      const subtitle = root.querySelector('[data-reaction-layout]')?.getBoundingClientRect()
      const top = subtitle ? subtitle.bottom - root.getBoundingClientRect().top + 24 : 0
      for (let i = 0; i < (desktop ? 64 : 34); i++) {
        const radius = (desktop ? 20 : 15) + Math.random() * (desktop ? 8 : 6)
        const row = Math.floor(i / columns)
        reactions.push({
          x: Math.min(width - radius, 10 + radius + (i % columns) * spacing + (row % 2 ? spacing / 2 : 0)),
          y: Math.max(top, floor - radius - row * spacing * .9), vx: 0, vy: 0, radius,
          angle: (Math.random() - .5) * .6, alpha: 1, rest: 0, sprite: sprites[i % sprites.length],
        })
      }
      // Settle before the first frame rather than raining onto the code field.
      for (let i = 0; i < 240; i++) step()
    }
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw)
      if (document.hidden) { last = now; return }
      accumulator += Math.min(100, now - last); last = now
      let steps = 0
      while (accumulator >= 1000 / 60 && steps < 3) { step(); accumulator -= 1000 / 60; steps++ }
      if (steps === 3) accumulator = 0
      context.setTransform(1, 0, 0, 1, 0, 0); context.clearRect(0, 0, surface.width, surface.height)
      for (const reaction of reactions) {
        const cosine = Math.cos(reaction.angle) * ratio, sine = Math.sin(reaction.angle) * ratio
        context.setTransform(cosine, sine, -sine, cosine, reaction.x * ratio, reaction.y * ratio)
        context.globalAlpha = reaction.alpha
        const size = reaction.radius * 2.2
        context.drawImage(reaction.sprite, -size / 2, -size / 2, size, size)
      }
      context.globalAlpha = 1
    }
    const move = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect(), x = event.clientX - bounds.left, y = event.clientY - bounds.top
      pointer = { x, y, vx: pointer ? x - pointer.x : 0, vy: pointer ? y - pointer.y : 0 }
    }
    const leave = () => { pointer = null }
    refresh.current = measure
    kick.current = () => {
      const button = colliders.find(box => box.radius > 0)
      for (const reaction of reactions) {
        if (resting && currentState.current === 'wrong') {
          reaction.vy = -3 - Math.random() * 4; reaction.vx += (Math.random() - .5) * 3
        } else if (currentState.current === 'welcome' || (button && reaction.x > button.x && reaction.x < button.x + button.width && reaction.y < button.y + 4 && reaction.y > button.y - 90)) {
          reaction.vy = -7 - Math.random() * 4; reaction.vx = (Math.random() - .5) * 8
        }
      }
    }
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    // Subtitle wrapping can move the button without adding a collision surface.
    root.querySelectorAll<HTMLElement>('[data-reaction-shelf], [data-reaction-layout]').forEach(element => observer.observe(element))
    if (resting) {
      const form = root.querySelector('form')
      if (form) observer.observe(form)
    }
    root.addEventListener('pointermove', move); root.addEventListener('pointerleave', leave); root.addEventListener('pointerup', leave)
    let mounted = true
    document.fonts?.ready.then(() => { if (mounted) measure() })
    measure(); frame = requestAnimationFrame(draw)
    return () => {
      mounted = false; cancelAnimationFrame(frame); observer.disconnect()
      root.removeEventListener('pointermove', move); root.removeEventListener('pointerleave', leave); root.removeEventListener('pointerup', leave)
      kick.current = () => {}
      refresh.current = () => {}
    }
  }, [stage, reducedMotion, resting])
  return <canvas ref={canvas} data-testid="login-reactions" aria-hidden="true"
    className={cn('pointer-events-none absolute inset-0 size-full motion-reduce:hidden', resting ? 'z-1' : 'z-3')} />
}
