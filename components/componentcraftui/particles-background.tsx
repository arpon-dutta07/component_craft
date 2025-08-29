"use client"

import { useEffect, useRef, useMemo } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

type FlowDirection =
  | "ltr" // left-to-right
  | "rtl" // right-to-left
  | "ttb" // top-to-bottom
  | "btt" // bottom-to-top
  | "radial-out"
  | "radial-in"

interface FlowFieldBackgroundProps {
  title?: string
  subtitle?: string
  particleCount?: number
  noiseScale?: number // how finely we sample the noise field
  speed?: number // base particle speed
  lineLength?: number // how long each step is drawn (creates trails)
  flowDirection?: FlowDirection
  particleSize?: { min: number; max: number }
  className?: string
}

function createNoise() {
  const permutation = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240,
    21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88,
    237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83,
    111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80,
    73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64,
    52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182,
    189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22,
    39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210,
    144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84,
    204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78,
    66, 215, 61, 156, 180,
  ]
  const p = new Array<number>(512)
  for (let i = 0; i < 256; i++) p[256 + i] = p[i] = permutation[i]

  function fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }
  function lerp(t: number, a: number, b: number) {
    return a + t * (b - a)
  }
  function grad(hash: number, x: number, y: number, z: number) {
    const h = hash & 15
    const u = h < 8 ? x : y
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
  }

  return {
    simplex3(x: number, y: number, z: number) {
      const X = Math.floor(x) & 255
      const Y = Math.floor(y) & 255
      const Z = Math.floor(z) & 255

      x -= Math.floor(x)
      y -= Math.floor(y)
      z -= Math.floor(z)

      const u = fade(x)
      const v = fade(y)
      const w = fade(z)

      const A = p[X] + Y
      const AA = p[A] + Z
      const AB = p[A + 1] + Z
      const B = p[X + 1] + Y
      const BA = p[B] + Z
      const BB = p[B + 1] + Z

      return lerp(
        w,
        lerp(
          v,
          lerp(u, grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z)),
          lerp(u, grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z)),
        ),
        lerp(
          v,
          lerp(u, grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1)),
          lerp(u, grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1)),
        ),
      )
    },
  }
}

interface Particle {
  x: number
  y: number
  px: number
  py: number
  size: number
  life: number
  maxLife: number
  colorIndex: number
}

export default function FlowFieldBackground({
  title = "Flow Field",
  subtitle = "Monochrome particles with directional drift",
  particleCount = 1200,
  noiseScale = 0.0025,
  speed = 1.4,
  lineLength = 2.0,
  flowDirection = "rtl",
  particleSize = { min: 0.6, max: 1.8 },
  className,
}: FlowFieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const noise = useMemo(createNoise, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const w = parent.clientWidth
      const h = parent.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()

    const palette = ["#60a5fa", "#22d3ee"] as const
    const hexToRgba = (hex: string, alpha: number) => {
      const h = hex.replace("#", "")
      const r = Number.parseInt(h.substring(0, 2), 16)
      const g = Number.parseInt(h.substring(2, 4), 16)
      const b = Number.parseInt(h.substring(4, 6), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    const lineColors = palette.map((c) => hexToRgba(c, 0.14))
    const dotColors = palette.map((c) => hexToRgba(c, 0.28))

    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * (canvas.width / dpr),
      y: Math.random() * (canvas.height / dpr),
      px: 0,
      py: 0,
      size: rand(particleSize.min, particleSize.max),
      life: rand(0, 100),
      maxLife: rand(120, 220),
      colorIndex: Math.floor(Math.random() * palette.length),
    }))

    const fadeBlack = "rgba(0,0,0,0.08)"

    let raf = 0
    const step = () => {
      ctx.fillStyle = fadeBlack
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr)

      const t = performance.now() * 0.00015

      for (const p of particles) {
        p.life += 1
        if (p.life > p.maxLife) {
          p.life = 0
          p.x = Math.random() * (canvas.width / dpr)
          p.y = Math.random() * (canvas.height / dpr)
          p.colorIndex = Math.floor(Math.random() * palette.length)
        }

        p.px = p.x
        p.py = p.y

        const n = noise.simplex3(p.x * noiseScale, p.y * noiseScale, t)
        const baseAngle = n * Math.PI * 2
        const dirBias = Math.atan2(p.y - (canvas.height / dpr) * 0.5, p.x - (canvas.width / dpr) * 0.5)
        const angle = baseAngle * 0.6 + dirBias * 0.4

        const v = speed * (0.6 + p.size * 0.4)
        p.x += Math.cos(angle) * v * lineLength
        p.y += Math.sin(angle) * v * lineLength

        const W = canvas.width / dpr
        const H = canvas.height / dpr
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0

        ctx.strokeStyle = lineColors[p.colorIndex]
        ctx.lineWidth = p.size
        ctx.beginPath()
        ctx.moveTo(p.px, p.py)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()

        if ((p.life | 0) % 28 === 0) {
          ctx.fillStyle = dotColors[p.colorIndex]
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(step)
    }

    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr)

    step()

    const onResize = () => {
      resize()
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [particleCount, noiseScale, speed, lineLength, flowDirection, particleSize, noise])

  const initialOffset = (() => {
    switch (flowDirection) {
      case "ltr":
        return { x: -40, y: 0 }
      case "rtl":
        return { x: 40, y: 0 }
      case "ttb":
        return { x: 0, y: -40 }
      case "btt":
        return { x: 0, y: 40 }
      case "radial-in":
        return { scale: 1.06 }
      case "radial-out":
        return { scale: 0.94 }
      default:
        return { y: 20 }
    }
  })()

  return (
    <div className={cn("relative w-full h-screen overflow-hidden", "bg-black", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <motion.div
          initial={{ opacity: 0, ...initialOffset }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-4 px-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white text-balance tracking-tight">{title}</h1>
          <p className="text-lg md:text-2xl text-white/70 max-w-xl mx-auto leading-relaxed">{subtitle}</p>
        </motion.div>
      </div>
    </div>
  )
}
