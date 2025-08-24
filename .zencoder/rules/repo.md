---
description: Repository Information Overview
alwaysApply: true
---

# ComponentCraft Information

## Summary
ComponentCraft is a Next.js project that provides a collection of UI components and templates. It uses the App Router architecture and is built with TypeScript, React, and Tailwind CSS. The project includes a documentation system using Fumadocs MDX for content management.

## Structure
- **app/**: Next.js App Router directory containing page components and API routes
- **components/**: UI components organized by category (ui, landing, layout, etc.)
- **content/**: Documentation content in MDX format
- **config/**: Site configuration and navigation settings
- **hooks/**: Custom React hooks for various functionalities
- **lib/**: Utility functions and shared code
- **public/**: Static assets like images and SVGs

## Language & Runtime
**Language**: TypeScript
**Version**: ES2017 target with modern module resolution
**Framework**: Next.js 15.5.0
**React**: 19.1.0
**Build System**: Next.js build system
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- Next.js 15.5.0 (React framework)
- React 19.1.0 (UI library)
- Radix UI components (accessible UI primitives)
- Fumadocs (documentation system)
- Framer Motion (animation library)
- Tailwind CSS (utility-first CSS framework)
- Lucide React (icon library)
- Zod (schema validation)

**Development Dependencies**:
- TypeScript 5.x
- ESLint 9.x
- Tailwind CSS 4.x

## Build & Installation
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## Testing
No dedicated testing framework was found in the repository. The project appears to rely on manual testing and development-time validation.

## Project Features
- **Component Library**: Extensive collection of UI components built with Radix UI primitives
- **Documentation System**: Uses Fumadocs for MDX-based documentation
- **Theming**: Supports light and dark mode via next-themes
- **Responsive Design**: Mobile and desktop layouts with responsive components
- **TypeScript**: Full TypeScript support with strict type checking