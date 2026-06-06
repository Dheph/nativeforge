#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_commander = require("commander");

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
var import_prompts2 = require("@clack/prompts");
var import_child_process = require("child_process");
var import_path2 = __toESM(require("path"), 1);
var import_fs_extra2 = __toESM(require("fs-extra"), 1);

// src/commands/add.ts
var import_fs_extra = __toESM(require("fs-extra"), 1);
var import_path = __toESM(require("path"), 1);
var import_prompts = require("@clack/prompts");

// src/utils/registry.ts
var import_ofetch = require("ofetch");
var import_zod = require("zod");
var REGISTRY_URL = process.env.NATIVEFORGE_REGISTRY_URL || "https://raw.githubusercontent.com/Dheph/nativeforge/main/packages/registry/dist";
var registryItemFileSchema = import_zod.z.object({
  path: import_zod.z.string(),
  content: import_zod.z.string()
});
var registryItemSchema = import_zod.z.object({
  name: import_zod.z.string(),
  type: import_zod.z.enum(["component", "template", "hook", "service"]),
  dependencies: import_zod.z.array(import_zod.z.string()).optional(),
  registryDependencies: import_zod.z.array(import_zod.z.string()).optional(),
  files: import_zod.z.array(registryItemFileSchema)
});
var registryIndexSchema = import_zod.z.array(
  import_zod.z.object({
    name: import_zod.z.string(),
    type: import_zod.z.enum(["component", "template", "hook", "service"]),
    dependencies: import_zod.z.array(import_zod.z.string()).optional(),
    registryDependencies: import_zod.z.array(import_zod.z.string()).optional()
  })
);
async function getRegistryComponent(name) {
  const url = `${REGISTRY_URL}/components/${name}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText} at ${url}`);
    }
    const data = await response.json();
    return registryItemSchema.parse(data);
  } catch (error) {
    throw new Error(`Failed to fetch component ${name} from registry. Error: ${error.message}`);
  }
}

// src/commands/add.ts
async function addCommand(components, options) {
  const targetCwd = options?.cwd || process.cwd();
  if (!options?.skipPrompts) {
    (0, import_prompts.intro)(`Installing components...`);
  }
  if (!components || components.length === 0) {
    const input = await (0, import_prompts.text)({
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
    const s = (0, import_prompts.spinner)();
    s.start(`Fetching ${component} from registry...`);
    try {
      const item = await getRegistryComponent(component);
      s.stop(`Found ${component}!`);
      for (const file of item.files) {
        const targetPath = import_path.default.resolve(targetCwd, "src", file.path);
        await import_fs_extra.default.ensureDir(import_path.default.dirname(targetPath));
        let shouldWrite = true;
        if (await import_fs_extra.default.pathExists(targetPath) && !options?.skipPrompts) {
          const overwrite = await (0, import_prompts.confirm)({
            message: `File ${file.path} already exists. Overwrite?`,
            initialValue: false
          });
          if (typeof overwrite === "symbol" || !overwrite) {
            shouldWrite = false;
          }
        }
        if (shouldWrite) {
          await import_fs_extra.default.writeFile(targetPath, file.content, "utf-8");
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
    (0, import_prompts.outro)(`Done!`);
  }
}

// src/commands/init.ts
async function initCommand(options) {
  (0, import_prompts2.intro)(`Initializing NativeForge Project...`);
  let projectName = options.name;
  if (!projectName) {
    const input = await (0, import_prompts2.text)({
      message: "What is your project named?",
      placeholder: "my-app",
      initialValue: "my-app"
    });
    if (typeof input === "symbol") process.exit(0);
    projectName = input;
  }
  let templateOption = options.template;
  if (!templateOption) {
    const input = await (0, import_prompts2.select)({
      message: "Do you want to start with a base template?",
      options: [
        { value: "template-login", label: "Login Template (Firebase Auth + UI Base)" },
        { value: "none", label: "Empty Project" }
      ]
    });
    if (typeof input === "symbol") process.exit(0);
    templateOption = input;
  }
  const s = (0, import_prompts2.spinner)();
  s.start(`Creating Expo project ${projectName}... (this may take a minute)`);
  try {
    (0, import_child_process.execSync)(`npx create-expo-app@latest ${projectName} --template blank-typescript -y`, {
      stdio: "ignore"
    });
    s.stop(`Expo project ${projectName} created successfully!`);
    const projectDir = import_path2.default.resolve(process.cwd(), projectName);
    if (templateOption !== "none") {
      console.log(`
Adding ${templateOption} to your project...`);
      await addCommand([templateOption], { cwd: projectDir, skipPrompts: true });
      if (templateOption === "template-login") {
        const appTsxPath = import_path2.default.join(projectDir, "App.tsx");
        if (await import_fs_extra2.default.pathExists(appTsxPath)) {
          const appContent = `import LoginTemplate from './src/components/templates/login';

export default function App() {
  return <LoginTemplate />;
}
`;
          await import_fs_extra2.default.writeFile(appTsxPath, appContent, "utf-8");
        }
      }
    }
    (0, import_prompts2.outro)(`Your project is ready! Run: cd ${projectName} && npx expo start`);
  } catch (error) {
    s.stop(`Failed to create project: ${error.message}`);
    process.exit(1);
  }
}

// src/index.ts
var { version } = package_default;
var program = new import_commander.Command();
program.name("nativeforge").description("The ultimate CLI for scaffolding React Native and Expo architectures.").version(version);
program.command("add [components...]").description("Add components to your project").action(addCommand);
program.command("init").description("Initialize a new NativeForge project").option("-n, --name <name>", "Project name").option("-t, --template <template>", "Base template (e.g. template-login)").action(initCommand);
program.parse();
//# sourceMappingURL=index.cjs.map