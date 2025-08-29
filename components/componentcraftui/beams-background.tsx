"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AnimatedGradientBackgroundProps {
    className?: string;
    children?: React.ReactNode;
    intensity?: "subtle" | "medium" | "strong";
}

interface Beam {
    x: number;
    y: number;
    width: number;
    length: number;
    angle: number;
    speed: number;
    opacity: number;
    hue: number;
    pulse: number;
    pulseSpeed: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    opacity: number;
    size: number;
    hue: number;
}

function createBeam(width: number, height: number): Beam {
    const angle = -40 + Math.random() * 8;
    return {
        x: Math.random() * width * 1.3 - width * 0.15,
        y: Math.random() * height * 1.3 - height * 0.15,
        width: 15 + Math.random() * 25,
        length: height * 2,
        angle: angle,
        speed: 0.2 + Math.random() * 0.3,
        opacity: 0.06 + Math.random() * 0.08,
        hue: 200 + Math.random() * 80,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.015,
    };
}

function createParticle(width: number, height: number): Particle {
    return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: 0.3 + Math.random() * 0.7,
        size: 0.5 + Math.random() * 1.5,
        hue: 200 + Math.random() * 60,
    };
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function BeamsBackground({
    className,
    intensity = "medium",
}: AnimatedGradientBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const beamsRef = useRef<Beam[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number>(0);
    const timeRef = useRef<number>(0);

    const opacityMap = {
        subtle: 0.5,
        medium: 0.7,
        strong: 1,
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const updateCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            const w = window.innerWidth;
            const h = window.innerHeight;
            
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.scale(dpr, dpr);

            beamsRef.current = Array.from({ length: 12 }, () => createBeam(w, h));
            particlesRef.current = Array.from({ length: 80 }, () => createParticle(w, h));
        };

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);

        function resetBeam(beam: Beam) {
            if (!canvas) return beam;
            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);
            
            beam.y = h + 300;
            beam.x = Math.random() * w;
            beam.width = 20 + Math.random() * 30;
            beam.speed = 0.25 + Math.random() * 0.35;
            beam.hue = 210 + Math.random() * 70;
            beam.opacity = 0.08 + Math.random() * 0.1;
            return beam;
        }

        function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam, time: number) {
            ctx.save();
            ctx.translate(beam.x, beam.y);
            ctx.rotate((beam.angle * Math.PI) / 180);

            const pulsingOpacity =
                beam.opacity *
                (0.85 + Math.sin(beam.pulse + time * 0.001) * 0.15) *
                opacityMap[intensity];

            const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);

            gradient.addColorStop(0, `hsla(${beam.hue}, 70%, 75%, 0)`);
            gradient.addColorStop(0.1, `hsla(${beam.hue}, 70%, 75%, ${pulsingOpacity * 0.2})`);
            gradient.addColorStop(0.3, `hsla(${beam.hue}, 70%, 75%, ${pulsingOpacity * 0.8})`);
            gradient.addColorStop(0.7, `hsla(${beam.hue}, 70%, 75%, ${pulsingOpacity})`);
            gradient.addColorStop(0.9, `hsla(${beam.hue}, 70%, 75%, ${pulsingOpacity * 0.4})`);
            gradient.addColorStop(1, `hsla(${beam.hue}, 70%, 75%, 0)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
            ctx.restore();
        }

        function drawParticle(ctx: CanvasRenderingContext2D, particle: Particle, time: number) {
            const twinkle = 0.7 + Math.sin(time * 0.003 + particle.x * 0.01) * 0.3;
            ctx.save();
            
            ctx.globalAlpha = particle.opacity * twinkle * 0.6;
            ctx.fillStyle = `hsl(${particle.hue}, 60%, 80%)`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }

        function animate() {
            if (!canvas || !ctx) return;
            
            timeRef.current += 16;
            const time = timeRef.current;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw particles first (behind beams)
            particlesRef.current.forEach((particle) => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                const w = canvas.width / (window.devicePixelRatio || 1);
                const h = canvas.height / (window.devicePixelRatio || 1);
                
                if (particle.x < 0 || particle.x > w || particle.y < 0 || particle.y > h) {
                    particle.x = Math.random() * w;
                    particle.y = Math.random() * h;
                    particle.vx = (Math.random() - 0.5) * 0.5;
                    particle.vy = (Math.random() - 0.5) * 0.5;
                }
                
                drawParticle(ctx, particle, time);
            });

            // Draw beams with enhanced blur effect
            ctx.filter = "blur(1px)";
            beamsRef.current.forEach((beam, index) => {
                beam.y -= beam.speed;
                beam.pulse += beam.pulseSpeed;

                if (beam.y + beam.length < -300) {
                    resetBeam(beam);
                }

                drawBeam(ctx, beam, time);
            });

            ctx.filter = "none";
            animationFrameRef.current = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener("resize", updateCanvasSize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [intensity]);

    return (
        <div
            className={cn(
                "relative min-h-screen w-full overflow-hidden",
                "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950",
                className
            )}
        >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-indigo-950/40" />
            
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
                style={{ mixBlendMode: 'screen' }}
            />

            {/* Animated mesh gradient overlay */}
            <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                    background: `
                        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
                    `
                }}
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 12,
                    ease: "easeInOut",
                    repeat: Infinity,
                }}
            />

            <div className="relative z-10 flex h-screen w-full items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-12 px-6 text-center max-w-5xl">
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ 
                            duration: 1.5, 
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    >
                        <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter leading-[0.9] relative">
                            <span className="relative inline-block">
                                Beautiful
                                <motion.div
                                    className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-lg opacity-30"
                                    animate={{
                                        opacity: [0.2, 0.4, 0.2],
                                        scale: [0.98, 1.02, 0.98],
                                    }}
                                    transition={{
                                        duration: 3,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                    }}
                                />
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative">
                                Experiences
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-20 blur-xl"
                                    animate={{
                                        opacity: [0.1, 0.3, 0.1],
                                    }}
                                    transition={{
                                        duration: 4,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                    }}
                                />
                            </span>
                        </h1>
                    </motion.div>
                    
                    <motion.p
                        className="text-2xl md:text-3xl text-slate-300/90 font-light tracking-wide max-w-3xl leading-relaxed"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                            duration: 1.5, 
                            delay: 0.3,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    >
                        Crafted with cutting-edge design and smooth animations that captivate and inspire
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-6 mt-12"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                            duration: 1.5, 
                            delay: 0.6,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    >
                        <motion.button 
                            className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg overflow-hidden shadow-2xl shadow-blue-500/25"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                            <span className="relative z-10">Explore Now</span>
                            <motion.div
                                className="absolute inset-0 bg-white"
                                initial={{ scale: 0, borderRadius: "100%" }}
                                whileHover={{ 
                                    scale: 1.5, 
                                    opacity: [0, 0.1, 0],
                                    borderRadius: "0%" 
                                }}
                                transition={{ duration: 0.6 }}
                            />
                        </motion.button>
                        
                        <motion.button 
                            className="group px-12 py-4 border-2 border-slate-600/50 backdrop-blur-xl bg-white/5 text-white rounded-2xl font-semibold text-lg hover:border-slate-400/70 hover:bg-white/10 transition-all duration-300 shadow-xl"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <span className="relative z-10">Learn More</span>
                        </motion.button>
                    </motion.div>

                    {/* Floating elements */}
                    <motion.div
                        className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 6,
                            ease: "easeInOut",
                            repeat: Infinity,
                        }}
                    />
                    
                    <motion.div
                        className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-full blur-xl"
                        animate={{
                            y: [0, 15, 0],
                            x: [0, -10, 0],
                            opacity: [0.4, 0.7, 0.4],
                        }}
                        transition={{
                            duration: 8,
                            ease: "easeInOut",
                            repeat: Infinity,
                            delay: 1,
                        }}
                    />
                </div>
            </div>

            {/* Enhanced mesh gradient background */}
            <div className="absolute inset-0 opacity-40">
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(circle at 10% 20%, rgba(120, 119, 198, 0.4) 0%, transparent 40%),
                            radial-gradient(circle at 90% 10%, rgba(255, 119, 198, 0.3) 0%, transparent 40%),
                            radial-gradient(circle at 50% 90%, rgba(120, 219, 255, 0.3) 0%, transparent 40%),
                            radial-gradient(circle at 70% 60%, rgba(167, 139, 250, 0.2) 0%, transparent 40%)
                        `
                    }}
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        ease: "easeInOut",
                        repeat: Infinity,
                    }}
                />
            </div>

            {/* Subtle grid overlay with animation */}
            <motion.div 
                className="absolute inset-0 opacity-[0.03]"
                animate={{
                    opacity: [0.02, 0.05, 0.02],
                }}
                transition={{
                    duration: 10,
                    ease: "easeInOut",
                    repeat: Infinity,
                }}
            >
                <div className="h-full w-full" style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px'
                }} />
            </motion.div>

            {/* Vignette effect */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-950/60" />
        </div>
    );
}