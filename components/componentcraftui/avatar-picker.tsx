"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bot, Gamepad2, Camera, Music, Code } from "lucide-react";

interface Avatar {
    id: number;
    icon: React.ReactNode;
    name: string;
    gradient: string;
    description: string;
}

const avatars: Avatar[] = [
    {
        id: 1,
        icon: <User className="w-6 h-6" />,
        name: "Professional",
        gradient: "from-slate-600 to-slate-800",
        description: "Clean & Corporate"
    },
    {
        id: 2,
        icon: <Bot className="w-6 h-6" />,
        name: "Tech",
        gradient: "from-blue-500 to-cyan-600",
        description: "Digital & Modern"
    },
    {
        id: 3,
        icon: <Gamepad2 className="w-6 h-6" />,
        name: "Gaming",
        gradient: "from-purple-500 to-pink-600",
        description: "Fun & Playful"
    },
    {
        id: 4,
        icon: <Camera className="w-6 h-6" />,
        name: "Creative",
        gradient: "from-orange-500 to-red-600",
        description: "Artistic & Visual"
    },
    {
        id: 5,
        icon: <Music className="w-6 h-6" />,
        name: "Artist",
        gradient: "from-green-500 to-emerald-600",
        description: "Musical & Expressive"
    },
    {
        id: 6,
        icon: <Code className="w-6 h-6" />,
        name: "Developer",
        gradient: "from-indigo-500 to-purple-600",
        description: "Logic & Innovation"
    },
];

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function AvatarPicker() {
    const [selectedAvatar, setSelectedAvatar] = useState<Avatar>(avatars[0]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.21, 1, 0.23, 1] }}
                className="w-full max-w-md"
            >
                {/* Dark professional card */}
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
                    
                    {/* Header section */}
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ 
                            duration: 0.8, 
                            ease: [0.21, 1, 0.23, 1],
                            delay: 0.2 
                        }}
                        className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 px-8 py-6 border-b border-slate-700/50"
                    >
                        <h1 className="text-2xl font-semibold text-white text-center">
                            Profile Avatar
                        </h1>
                        <p className="text-slate-400 text-center mt-1 text-sm">
                            Choose your identity
                        </p>
                    </motion.div>

                    <div className="p-8">
                        {/* Main avatar display */}
                        <motion.div className="flex justify-center mb-8">
                            <motion.div
                                className={cn(
                                    "relative w-28 h-28 rounded-full border-4 border-slate-700 shadow-2xl flex items-center justify-center text-white",
                                    "bg-gradient-to-br",
                                    selectedAvatar.gradient
                                )}
                                key={selectedAvatar.id}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 200, 
                                    damping: 20 
                                }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <motion.div
                                    initial={{ rotate: -90, scale: 0 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    transition={{ 
                                        type: "spring", 
                                        stiffness: 150, 
                                        damping: 12,
                                        delay: 0.1
                                    }}
                                >
                                    {selectedAvatar.icon}
                                </motion.div>
                                
                                {/* Professional glow effect */}
                                <motion.div
                                    className={cn(
                                        "absolute inset-0 rounded-full ring-4 ring-blue-500/50 ring-offset-4 ring-offset-slate-900"
                                    )}
                                    initial={{ opacity: 0, scale: 1.2 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                />

                                {/* Subtle pulse animation */}
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-white/10"
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        opacity: [0.1, 0.2, 0.1],
                                    }}
                                    transition={{
                                        duration: 3,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                    }}
                                />
                            </motion.div>
                        </motion.div>

                        {/* Selected avatar info */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedAvatar.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="text-center mb-8"
                            >
                                <h3 className="text-xl font-semibold text-white">
                                    {selectedAvatar.name}
                                </h3>
                                <p className="text-slate-400 text-sm mt-1">
                                    {selectedAvatar.description}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Avatar grid */}
                        <motion.div
                            className="grid grid-cols-6 gap-3 mb-8"
                            initial="initial"
                            animate="animate"
                            variants={{
                                initial: { opacity: 0 },
                                animate: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.08,
                                        delayChildren: 0.3,
                                    },
                                },
                            }}
                        >
                            {avatars.map((avatar) => (
                                <motion.button
                                    key={avatar.id}
                                    onClick={() => setSelectedAvatar(avatar)}
                                    className={cn(
                                        "relative w-14 h-14 rounded-xl border-2 transition-all duration-300 flex items-center justify-center text-white",
                                        "bg-gradient-to-br",
                                        avatar.gradient,
                                        selectedAvatar.id === avatar.id 
                                            ? "border-blue-400 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/30" 
                                            : "border-slate-700/50 hover:border-slate-600 hover:shadow-lg"
                                    )}
                                    variants={{
                                        initial: {
                                            opacity: 0,
                                            scale: 0.6,
                                            y: 20,
                                        },
                                        animate: {
                                            opacity: 1,
                                            scale: 1,
                                            y: 0,
                                            transition: {
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 20,
                                            },
                                        },
                                    }}
                                    whileHover={{ 
                                        scale: 1.1,
                                        y: -3,
                                        transition: { duration: 0.2 }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        animate={selectedAvatar.id === avatar.id ? {
                                            rotate: [0, 10, -10, 0],
                                        } : {}}
                                        transition={{ 
                                            duration: 2,
                                            ease: "easeInOut",
                                            repeat: selectedAvatar.id === avatar.id ? Infinity : 0,
                                        }}
                                    >
                                        {avatar.icon}
                                    </motion.div>

                                    {/* Selection glow */}
                                    {selectedAvatar.id === avatar.id && (
                                        <motion.div
                                            className="absolute inset-0 bg-blue-500/20 rounded-xl"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </motion.div>

                        {/* Professional dark action buttons */}
                        <motion.div
                            className="space-y-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                        >
                            <motion.button
                                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Apply Selection
                            </motion.button>
                            
                            <motion.button
                                className="w-full py-3 px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all duration-200"
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Reset to Default
                            </motion.button>
                        </motion.div>
                    </div>
                </div>

                {/* Professional status indicator */}
                <motion.div
                    className="text-center mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/60 backdrop-blur-sm rounded-full border border-slate-700/50 shadow-lg">
                        <div className="w-2 h-2 bg-green-400 rounded-full">
                            <motion.div
                                className="w-2 h-2 bg-green-400 rounded-full"
                                animate={{
                                    opacity: [1, 0.3, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                }}
                            />
                        </div>
                        <span className="text-sm text-slate-300 font-medium">
                            Profile Ready
                        </span>
                    </div>
                </motion.div>
            </motion.div>

            {/* Subtle dark background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 12,
                        ease: "easeInOut",
                        repeat: Infinity,
                    }}
                />
                
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.08, 0.15, 0.08],
                    }}
                    transition={{
                        duration: 15,
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: 2,
                    }}
                />

                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="h-full w-full" style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px'
                    }} />
                </div>
            </div>
        </div>
    );
}