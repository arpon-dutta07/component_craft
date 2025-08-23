"use client";
import React from 'react'
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import TailwindCSS from '@/components/icons/tailwindcss';
import { BrowseComponentsButton } from '../ui/browse-button';
import { BrowseBlocksButton } from '../ui/browse-blocks';
import Features from './features';

const HeroSection = () => {
  return (
    <div className='mx-auto w-full max-w-7xl min-h-screen flex flex-col 
    lg:flex-row items-center justify-between gap-8 lg:gap-12 px-4 
    sm:px-6 py-12 md:py-16 lg:py-20'>

        <div className='w-full lg:w-[45%] flex-col items-start  text-left space-y-8'>        
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}>

            <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-zinc-900 dark:text-zinc-100'>
                Craft with <span className='bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-fuchsia-500 to-purple-500 dark:from-rose-400 dark:via-fuchsia-400 dark:to-purple-400'>precision</span><br/>
                build with <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-fuchsia-500 to-rose-500 dark:from-purple-400 dark:via-fuchsia-400 dark:to-rose-400'>ease</span>.
            </h1>

            <p className='mt-6 text-base md:text-xl text-zinc-700 dark:text-zinc-300 max-w-lg'>
                A curated collection of <span className='font-semibold'>100+ premium UI components</span> 
                crafted with 
                <span className='bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-fuchsia-500 dark:from-rose-400 dark:to-fuchsia-400'>Tailwind CSS</span> 
                and <span className='bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-500 dark:from-fuchsia-400 dark:to-purple-400'>shadcn/ui</span> 
                for modern React and Next.js applications.
            </p>
        </motion.div>

        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='flex flex-col justify-start w-full'
        > 
            <span className='text-sm text-zinc-500 dark:text-zinc-300 pb-3 text-start flex items-center gap-2'>
                <TailwindCSS className='w-4 h-4'/>
                <span className='flex items-center gap-1.5'>
                    Now updated for Tailwind CSS 4.0!
                    <span className='inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-900/30 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300'>
                        <Sparkles className='h-3 w-3 mr-1'/> New
                    </span>
                </span>
            </span>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3'>
                <BrowseComponentsButton/>
                <BrowseBlocksButton/>
            </div>
        </motion.div>

        <Features/>
        </div>
    </div>
  )
}

export default HeroSection
