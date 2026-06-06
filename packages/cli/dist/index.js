#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";
import { intro, outro, select, text } from "@clack/prompts";

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
    test: "vitest run"
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
    commander: "^12.0.0",
    "@clack/prompts": "^0.7.0"
  },
  devDependencies: {
    typescript: "^5.0.0",
    tsup: "^8.0.0",
    vitest: "^1.0.0",
    "fs-extra": "^11.2.0",
    "@types/fs-extra": "^11.0.4",
    "@types/node": "^20.0.0"
  }
};

// src/index.ts
var { version } = package_default;
var program = new Command();
program.name("nativeforge").description("The ultimate CLI for scaffolding React Native and Expo architectures.").version(version);
program.command("init").description("Initialize a new NativeForge project").action(async () => {
  intro(`Welcome to NativeForge v${version}`);
  const projectType = await select({
    message: "Which framework do you want to use?",
    options: [
      { value: "expo", label: "Expo (Recommended)" },
      { value: "rn-cli", label: "React Native CLI" }
    ]
  });
  if (typeof projectType === "symbol") {
    process.exit(0);
  }
  const projectName = await text({
    message: "What is your project named?",
    placeholder: "my-app",
    initialValue: "my-app"
  });
  if (typeof projectName === "symbol") {
    process.exit(0);
  }
  outro(`Successfully initialized ${String(projectName)} with ${String(projectType)}! (Dummy output)`);
});
program.parse();
//# sourceMappingURL=index.js.map