import { promises as fs } from "fs";
import path from "path";

const COMPONENTS_PATH = "components/componentcraftui";
const REGISTRY_OUTPUT_PATH = "registry/generated-registry.ts";

interface RegistryEntry {
    name: string;
    type: "registry:component";
    dependencies?: string[];
    registryDependencies?: string[];
    files: Array<{
        path: string;
        type: "registry:component" | "registry:hook";
    }>;
}

// Common dependencies based on file content
const COMMON_DEPENDENCIES: Record<string, string[]> = {
    "lucide-react": ["import.*from.*['\"]lucide-react['\"]"],
    "motion": ["import.*from.*['\"]motion", "import.*from.*['\"]framer-motion"],
    "class-variance-authority": ["cva\\(", "import.*cva"],
    "clsx": ["import.*clsx", "import.*from.*['\"]clsx['\"]"],
    "@radix-ui/react-dialog": ["import.*from.*['\"]@radix-ui/react-dialog['\"]"],
    "@radix-ui/react-dropdown-menu": ["import.*from.*['\"]@radix-ui/react-dropdown-menu['\"]"],
    "next-themes": ["import.*from.*['\"]next-themes['\"]"],
    "react-hook-form": ["import.*from.*['\"]react-hook-form['\"]"],
    "zod": ["import.*from.*['\"]zod['\"]"],
};

const REGISTRY_DEPENDENCIES = [
    "button", "input", "textarea", "card", "dialog", "dropdown-menu", 
    "tooltip", "popover", "sheet", "accordion", "tabs", "select",
    "checkbox", "radio-group", "switch", "slider", "progress",
    "alert", "badge", "avatar", "separator", "scroll-area"
];

async function analyzeFile(filePath: string): Promise<{dependencies: string[], registryDependencies: string[], hooks: string[]}> {
    const content = await fs.readFile(filePath, "utf-8");
    const dependencies: string[] = [];
    const registryDependencies: string[] = [];
    const hooks: string[] = [];

    // Check for common dependencies
    for (const [dep, patterns] of Object.entries(COMMON_DEPENDENCIES)) {
        if (patterns.some(pattern => new RegExp(pattern).test(content))) {
            dependencies.push(dep);
        }
    }

    // Check for registry dependencies (UI components)
    for (const regDep of REGISTRY_DEPENDENCIES) {
        const patterns = [
            `import.*from.*['\"]@/components/ui/${regDep}['\"]`,
            `<${regDep.charAt(0).toUpperCase() + regDep.slice(1).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())}`,
        ];
        if (patterns.some(pattern => new RegExp(pattern, "i").test(content))) {
            registryDependencies.push(regDep);
        }
    }

    // Check for custom hooks
    const hookMatches = content.match(/import.*{.*}.*from.*['\"]@\/hooks\/([\w-]+)['\"]|useAutoResizeTextarea|useClickOutside|useCopyToClipboard|useDebounce|useFileInput|useIntersection|useMobile|useTags/g);
    if (hookMatches) {
        hookMatches.forEach(match => {
            if (match.includes("useAutoResizeTextarea")) {
                hooks.push("hooks/use-auto-resize-textarea.tsx");
            } else if (match.includes("useClickOutside")) {
                hooks.push("hooks/use-click-outside.ts");
            } else if (match.includes("useCopyToClipboard")) {
                hooks.push("hooks/use-copy-to-clipboard.ts");
            } else if (match.includes("useDebounce")) {
                hooks.push("hooks/use-debounce.ts");
            } else if (match.includes("useFileInput")) {
                hooks.push("hooks/use-file-input.ts");
            } else if (match.includes("useIntersection")) {
                hooks.push("hooks/use-intersection.ts");
            } else if (match.includes("useMobile")) {
                hooks.push("hooks/use-mobile.ts");
            } else if (match.includes("useTags")) {
                hooks.push("hooks/use-tags.ts");
            }
        });
    }

    return { dependencies, registryDependencies, hooks };
}

function generateComponentName(filePath: string): string {
    const relativePath = path.relative(COMPONENTS_PATH, filePath);
    const parsed = path.parse(relativePath);
    
    // Handle nested directories
    if (parsed.dir) {
        const dirName = parsed.dir.split(path.sep).pop() || "";
        const fileName = parsed.name;
        return `${dirName}-${fileName}`.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
    }
    
    return parsed.name.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
}

async function getAllTsxFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    async function walkDir(currentDir: string) {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            
            if (entry.isDirectory()) {
                await walkDir(fullPath);
            } else if (entry.name.endsWith('.tsx')) {
                files.push(fullPath.replace(/\\/g, '/'));
            }
        }
    }
    
    await walkDir(dir);
    return files;
}

async function generateRegistryEntries(): Promise<RegistryEntry[]> {
    // Get all tsx files in componentcraftui
    const files = await getAllTsxFiles(COMPONENTS_PATH);
    
    const registryEntries: RegistryEntry[] = [];

    for (const filePath of files) {
        const analysis = await analyzeFile(filePath);
        const componentName = generateComponentName(filePath);
        
        const files: Array<{path: string, type: "registry:component" | "registry:hook"}> = [
            {
                path: filePath,
                type: "registry:component"
            }
        ];

        // Add hook files
        for (const hook of analysis.hooks) {
            files.push({
                path: hook,
                type: "registry:hook"
            });
        }

        const entry: RegistryEntry = {
            name: componentName,
            type: "registry:component",
            files
        };

        // Only add dependencies if they exist
        if (analysis.dependencies.length > 0) {
            entry.dependencies = [...new Set(analysis.dependencies)];
        }
        if (analysis.registryDependencies.length > 0) {
            entry.registryDependencies = [...new Set(analysis.registryDependencies)];
        }

        registryEntries.push(entry);
    }

    return registryEntries;
}

async function writeRegistryFile(entries: RegistryEntry[]) {
    const content = `// Auto-generated registry file
// Run: npx tsx scripts/generate-missing-registry.ts

import type { Registry } from "./schema";

export const generatedComponents: Registry = [
${entries.map(entry => `    {
        name: "${entry.name}",
        type: "${entry.type}",${entry.dependencies ? `
        dependencies: ${JSON.stringify(entry.dependencies)},` : ''}${entry.registryDependencies ? `
        registryDependencies: ${JSON.stringify(entry.registryDependencies)},` : ''}
        files: [
${entry.files.map(file => `            {
                path: "${file.path}",
                type: "${file.type}",
            }`).join(',\n')}
        ],
    }`).join(',\n')}
];
`;

    await fs.writeFile(REGISTRY_OUTPUT_PATH, content, "utf-8");
    console.log(`Generated registry with ${entries.length} components`);
    console.log(`Written to: ${REGISTRY_OUTPUT_PATH}`);
}

async function main() {
    try {
        console.log("Analyzing componentcraftui files...");
        const entries = await generateRegistryEntries();
        
        console.log(`Found ${entries.length} components`);
        entries.forEach(entry => {
            console.log(`- ${entry.name} (${entry.files.length} files)`);
        });
        
        await writeRegistryFile(entries);
        console.log("Registry generation complete!");
        
    } catch (error) {
        console.error("Error generating registry:", error);
    }
}

main();
