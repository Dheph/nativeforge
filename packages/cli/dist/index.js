#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";

// package.json
var package_default = {
  name: "nativeforge",
  version: "0.1.0",
  description: "The ultimate CLI for scaffolding React Native and Expo architectures.",
  type: "module",
  main: "dist/index.js",
  bin: {
    nativeforge: "./dist/index.js"
  },
  scripts: {
    build: "tsup",
    dev: "tsup --watch",
    test: "vitest run",
    clean: "rm -rf dist"
  },
  keywords: [
    "react-native",
    "expo",
    "cli",
    "architecture",
    "shadcn"
  ],
  author: "",
  license: "MIT",
  dependencies: {
    "@clack/prompts": "^0.7.0",
    commander: "^12.0.0",
    ofetch: "^1.5.1",
    zod: "^3.22.0",
    "fs-extra": "^11.2.0"
  },
  devDependencies: {
    "@types/fs-extra": "^11.0.4",
    "@types/node": "^20.0.0",
    tsup: "^8.0.0",
    typescript: "^5.0.0",
    vitest: "^1.0.0"
  }
};

// src/commands/init.ts
import { intro as intro2, outro as outro2, select, text as text2, spinner as spinner2 } from "@clack/prompts";
import { execSync } from "child_process";
import path2 from "path";

// src/commands/add.ts
import fs from "fs-extra";
import path from "path";
import { intro, outro, spinner, text, confirm } from "@clack/prompts";

// src/utils/registry.ts
import { ofetch } from "ofetch";
import { z } from "zod";
var REGISTRY_URL = process.env.NATIVEFORGE_REGISTRY_URL || "https://raw.githubusercontent.com/Dheph/nativeforge/main/packages/registry/dist";
var registryItemFileSchema = z.object({
  path: z.string(),
  content: z.string()
});
var registryItemSchema = z.object({
  name: z.string(),
  type: z.enum(["component", "template", "hook", "service"]),
  dependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema)
});
var registryIndexSchema = z.array(
  z.object({
    name: z.string(),
    type: z.enum(["component", "template", "hook", "service"]),
    dependencies: z.array(z.string()).optional(),
    registryDependencies: z.array(z.string()).optional()
  })
);
async function getRegistryComponent(name) {
  try {
    const data = await ofetch(`${REGISTRY_URL}/components/${name}.json`);
    return registryItemSchema.parse(data);
  } catch (error) {
    throw new Error(`Failed to fetch component ${name} from registry.`);
  }
}

// src/commands/add.ts
async function addCommand(components, options) {
  const targetCwd = options?.cwd || process.cwd();
  if (!options?.skipPrompts) {
    intro(`Installing components...`);
  }
  if (!components || components.length === 0) {
    const input = await text({
      message: "Which components would you like to add? (comma-separated)",
      placeholder: "template-login, button"
    });
    if (typeof input === "symbol") {
      process.exit(0);
    }
    components = input.split(",").map((c) => c.trim());
  }
  const queue = [...components];
  const processed = /* @__PURE__ */ new Set();
  const npmDependencies = /* @__PURE__ */ new Set();
  while (queue.length > 0) {
    const component = queue.shift();
    if (processed.has(component)) continue;
    processed.add(component);
    const s = spinner();
    s.start(`Fetching ${component} from registry...`);
    try {
      const item = await getRegistryComponent(component);
      s.stop(`Found ${component}!`);
      for (const file of item.files) {
        const targetPath = path.resolve(targetCwd, "src", file.path);
        await fs.ensureDir(path.dirname(targetPath));
        let shouldWrite = true;
        if (await fs.pathExists(targetPath) && !options?.skipPrompts) {
          const overwrite = await confirm({
            message: `File ${file.path} already exists. Overwrite?`,
            initialValue: false
          });
          if (typeof overwrite === "symbol" || !overwrite) {
            shouldWrite = false;
          }
        }
        if (shouldWrite) {
          await fs.writeFile(targetPath, file.content, "utf-8");
          console.log(`\u2705 Written ${file.path}`);
        } else {
          console.log(`\u23ED\uFE0F  Skipped ${file.path}`);
        }
      }
      if (item.registryDependencies && item.registryDependencies.length > 0) {
        for (const dep of item.registryDependencies) {
          if (!processed.has(dep) && !queue.includes(dep)) {
            queue.push(dep);
          }
        }
      }
      if (item.dependencies && item.dependencies.length > 0) {
        item.dependencies.forEach((d) => npmDependencies.add(d));
      }
    } catch (error) {
      s.stop(`Failed to install ${component}: ${error.message}`);
    }
  }
  if (npmDependencies.size > 0) {
    console.log(`
\u{1F4E6} Don't forget to install these dependencies:`);
    console.log(`   pnpm add ${Array.from(npmDependencies).join(" ")}
`);
  }
  if (!options?.skipPrompts) {
    outro(`Done!`);
  }
}

// src/commands/init.ts
async function initCommand() {
  intro2(`Initializing NativeForge Project...`);
  const projectName = await text2({
    message: "What is your project named?",
    placeholder: "my-app",
    initialValue: "my-app"
  });
  if (typeof projectName === "symbol") {
    process.exit(0);
  }
  const templateOption = await select({
    message: "Do you want to start with a base template?",
    options: [
      { value: "template-login", label: "Login Template (Firebase Auth + UI Base)" },
      { value: "none", label: "Empty Project" }
    ]
  });
  if (typeof templateOption === "symbol") {
    process.exit(0);
  }
  const s = spinner2();
  s.start(`Creating Expo project ${projectName}... (this may take a minute)`);
  try {
    execSync(`npx create-expo-app@latest ${projectName} --template blank-typescript -y`, {
      stdio: "ignore"
    });
    s.stop(`Expo project ${projectName} created successfully!`);
    const projectDir = path2.resolve(process.cwd(), projectName);
    if (templateOption !== "none") {
      console.log(`
Adding ${templateOption} to your project...`);
      await addCommand([templateOption], { cwd: projectDir, skipPrompts: true });
      if (templateOption === "template-login") {
        const fs2 = await import("fs-extra");
        const appTsxPath = path2.join(projectDir, "App.tsx");
        if (await fs2.pathExists(appTsxPath)) {
          const appContent = `import { SafeAreaView } from 'react-native';
import LoginTemplate from './src/components/templates/login';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <LoginTemplate />
    </SafeAreaView>
  );
}
`;
          await fs2.writeFile(appTsxPath, appContent, "utf-8");
        }
      }
    }
    outro2(`Your project is ready! Run: cd ${projectName} && npx expo start`);
  } catch (error) {
    s.stop(`Failed to create project: ${error.message}`);
    process.exit(1);
  }
}

// src/index.ts
var { version } = package_default;
var program = new Command();
program.name("nativeforge").description("The ultimate CLI for scaffolding React Native and Expo architectures.").version(version);
program.command("add [components...]").description("Add components to your project").action(addCommand);
program.command("init").description("Initialize a new NativeForge project").action(initCommand);
program.parse();
//# sourceMappingURL=index.js.map