import { promises as fs } from "fs";
import path from "path";

const COMPONENTS_PATH = "components/componentcraftui";
const PUBLIC_FOLDER_BASE_PATH = "public/r";

interface RegistryEntry {
    name: string;
    type: "registry:component";
    dependencies?: string[];
    registryDependencies?: string[];
    files: Array<{
        type: "registry:component" | "registry:hook";
        content: string;
        path: string;
        target: string;
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
    "@radix-ui/react-accordion": ["import.*from.*['\"]@radix-ui/react-accordion['\"]"],
    "@radix-ui/react-tabs": ["import.*from.*['\"]@radix-ui/react-tabs['\"]"],
    "@radix-ui/react-popover": ["import.*from.*['\"]@radix-ui/react-popover['\"]"],
    "@radix-ui/react-tooltip": ["import.*from.*['\"]@radix-ui/react-tooltip['\"]"],
    "@radix-ui/react-sheet": ["import.*from.*['\"]@radix-ui/react-sheet['\"]"],
    "next-themes": ["import.*from.*['\"]next-themes['\"]"],
    "react-hook-form": ["import.*from.*['\"]react-hook-form['\"]"],
    "zod": ["import.*from.*['\"]zod['\"]"],
    "date-fns": ["import.*from.*['\"]date-fns['\"]"],
    "recharts": ["import.*from.*['\"]recharts['\"]"],
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
    
    // Clean filename to use as component name
    let name = parsed.name;
    
    // Remove common suffixes that might be duplicated
    name = name.replace(/^(ai-input-|btn-|card-|alert-|text-|input-|pricing-|faq-|profile-|list-)/, '');
    
    // Handle nested directories - use the filename directly for most cases
    if (parsed.dir) {
        const dirName = parsed.dir.split(path.sep).pop() || "";
        // For nested files, use directory-filename format
        name = `${dirName}-${parsed.name}`;
    }
    
    return name.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
}

async function getAllTsxFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    async function walkDir(currentDir: string) {
        try {
            const entries = await fs.readdir(currentDir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(currentDir, entry.name);
                
                if (entry.isDirectory()) {
                    await walkDir(fullPath);
                } else if (entry.name.endsWith('.tsx')) {
                    files.push(fullPath.replace(/\\/g, '/'));
                }
            }
        } catch (error) {
            console.warn(`Could not read directory ${currentDir}:`, error);
        }
    }
    
    await walkDir(dir);
    return files;
}

async function writeFileRecursive(filePath: string, data: string) {
    const dir = path.dirname(filePath);

    try {
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(filePath, data, "utf-8");
        console.log(`File written to ${filePath}`);
    } catch (error) {
        console.error(`Error writing file ${filePath}:`, error);
    }
}

async function generateComponentJSON(filePath: string): Promise<void> {
    try {
        const analysis = await analyzeFile(filePath);
        const componentName = generateComponentName(filePath);
        const content = await fs.readFile(filePath, "utf-8");
        
        // Get filename for target path
        const fileName = path.basename(filePath);
        
        // Build files array
        const files: Array<{type: "registry:component" | "registry:hook", content: string, path: string, target: string}> = [
            {
                type: "registry:component",
                content: content,
                path: `${filePath}`,
                target: `components/componentcraft/${fileName}`
            }
        ];

        // Add hook files
        for (const hook of analysis.hooks) {
            try {
                const hookContent = await fs.readFile(hook, "utf-8");
                const hookFileName = path.basename(hook);
                files.push({
                    type: "registry:hook",
                    content: hookContent,
                    path: `${hook}`,
                    target: `${hook}`
                });
            } catch (hookError) {
                console.warn(`Could not read hook file ${hook}:`, hookError);
            }
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

        const json = JSON.stringify(entry, null, 2);
        const jsonPath = path.join(PUBLIC_FOLDER_BASE_PATH, `${componentName}.json`);
        
        await writeFileRecursive(jsonPath, json);
        
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
    }
}

async function main() {
    try {
        console.log("Scanning componentcraftui directory...");
        const files = await getAllTsxFiles(COMPONENTS_PATH);
        
        console.log(`Found ${files.length} component files`);
        
        // Process each file individually
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log(`Processing ${i + 1}/${files.length}: ${file}`);
            await generateComponentJSON(file);
        }
        
        console.log(`\n✅ Successfully generated ${files.length} JSON files!`);
        console.log(`📁 All files saved to: ${PUBLIC_FOLDER_BASE_PATH}/`);
        
    } catch (error) {
        console.error("Error generating JSON files:", error);
    }
}

main();
