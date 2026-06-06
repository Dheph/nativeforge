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
    name: 'service-auth',
    type: 'service',
    dependencies: ['zustand', '@react-native-async-storage/async-storage'],
    registryDependencies: [],
    files: [
      {
        path: 'services/auth/index.tsx',
        target: 'services/auth/index.tsx'
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
        target: 'services/auth/provider.tsx'
      }
    ]
  },
  {
    name: 'service-supabase-auth',
    type: 'service',
    dependencies: ['zustand', '@react-native-async-storage/async-storage'],
    registryDependencies: [],
    files: [
      {
        path: 'services/supabase-auth/index.tsx',
        target: 'services/auth/provider.tsx'
      }
    ]
  },
  {
    name: 'service-api-auth',
    type: 'service',
    dependencies: ['zustand', '@react-native-async-storage/async-storage'],
    registryDependencies: [],
    files: [
      {
        path: 'services/api-auth/index.tsx',
        target: 'services/auth/provider.tsx'
      }
    ]
  },
  {
    name: 'template-auth',
    type: 'template',
    dependencies: ['expo-router', 'react-native-safe-area-context', 'react-native-screens'],
    registryDependencies: ['ui-button', 'ui-input', 'service-auth'],
    files: [
      { path: 'templates/login/components/templates/login/index.tsx', target: 'components/templates/login/index.tsx' },
      { path: 'templates/login/components/templates/register/index.tsx', target: 'components/templates/register/index.tsx' },
      { path: 'templates/login/components/templates/forgot-password/index.tsx', target: 'components/templates/forgot-password/index.tsx' },
      { path: 'templates/login/app/_layout.tsx', target: 'app/_layout.tsx' },
      { path: 'templates/login/app/(auth)/_layout.tsx', target: 'app/(auth)/_layout.tsx' },
      { path: 'templates/login/app/(auth)/login.tsx', target: 'app/(auth)/login.tsx' },
      { path: 'templates/login/app/(auth)/register.tsx', target: 'app/(auth)/register.tsx' },
      { path: 'templates/login/app/(auth)/forgot-password.tsx', target: 'app/(auth)/forgot-password.tsx' },
      { path: 'templates/login/app/(app)/_layout.tsx', target: 'app/(app)/_layout.tsx' },
      { path: 'templates/login/app/(app)/index.tsx', target: 'app/(app)/index.tsx' },
      { path: 'templates/login/app/(app)/profile.tsx', target: 'app/(app)/profile.tsx' }
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
