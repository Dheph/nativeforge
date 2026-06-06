import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { registryIndexSchema, registryItemSchema, RegistryItem } from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_DIR = path.resolve(__dirname, '../src');
const DIST_DIR = path.resolve(__dirname, '../dist');
const DIST_COMPONENTS_DIR = path.join(DIST_DIR, 'components');

const componentsToBuild = [
  {
    name: 'ui-button',
    type: 'component',
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: 'components/ui-button/index.tsx',
        target: 'components/ui-button/index.tsx'
      }
    ]
  },
  {
    name: 'ui-input',
    type: 'component',
    dependencies: ['lucide-react-native'],
    registryDependencies: [],
    files: [
      {
        path: 'components/ui-input/index.tsx',
        target: 'components/ui-input/index.tsx'
      }
    ]
  },
  {
    name: 'service-firebase-auth',
    type: 'service',
    dependencies: ['firebase', 'zustand', '@react-native-async-storage/async-storage'],
    registryDependencies: [],
    files: [
      {
        path: 'services/firebase-auth/index.tsx',
        target: 'services/firebase-auth/index.tsx'
      }
    ]
  },
  {
    name: 'template-login',
    type: 'template',
    dependencies: [],
    registryDependencies: ['ui-button', 'ui-input', 'service-firebase-auth'],
    files: [
      {
        path: 'templates/login/index.tsx',
        target: 'components/templates/login/index.tsx'
      }
    ]
  }
];

async function buildRegistry() {
  console.log('Building NativeForge Registry...');

  await fs.ensureDir(DIST_COMPONENTS_DIR);

  const index: any[] = [];

  for (const comp of componentsToBuild) {
    const itemFiles = [];

    for (const fileDef of comp.files) {
      const filePath = path.join(REGISTRY_DIR, fileDef.path);
      const content = await fs.readFile(filePath, 'utf-8');
      
      itemFiles.push({
        path: fileDef.target,
        content,
      });
    }

    const itemData: RegistryItem = {
      name: comp.name,
      type: comp.type as any,
      dependencies: comp.dependencies,
      registryDependencies: comp.registryDependencies,
      files: itemFiles,
    };

    // Validate
    const parsedItem = registryItemSchema.parse(itemData);

    // Write individual JSON
    await fs.writeJSON(
      path.join(DIST_COMPONENTS_DIR, `${comp.name}.json`),
      parsedItem,
      { spaces: 2 }
    );

    // Push to index
    index.push({
      name: comp.name,
      type: comp.type,
      dependencies: comp.dependencies,
      registryDependencies: comp.registryDependencies,
    });
  }

  // Validate Index
  const parsedIndex = registryIndexSchema.parse(index);

  // Write Index JSON
  await fs.writeJSON(path.join(DIST_DIR, 'index.json'), parsedIndex, { spaces: 2 });

  console.log('Registry built successfully!');
}

buildRegistry().catch((err) => {
  console.error('Failed to build registry:', err);
  process.exit(1);
});
