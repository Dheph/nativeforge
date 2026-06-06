import fs from 'fs-extra';
import path from 'path';
import { intro, outro, spinner, text, confirm } from '@clack/prompts';
import { getRegistryComponent, getRegistryIndex } from '../utils/registry.js';

export async function addCommand(components: string[], options?: { cwd?: string; skipPrompts?: boolean; socialProviders?: string[]; authProvider?: string }) {
  const targetCwd = options?.cwd || process.cwd();
  
  if (!options?.skipPrompts) {
    intro(`Installing components...`);
  }

  if (!components || components.length === 0) {
    const s = spinner();
    s.start('Fetching available components from registry...');
    let registryIndex;
    try {
      registryIndex = await getRegistryIndex();
      s.stop('Registry fetched successfully!');
    } catch (e: any) {
      s.stop('Failed to fetch registry.');
      console.error(e.message);
      process.exit(1);
    }

    registryIndex.sort((a, b) => {
      if (a.type !== b.type) return a.type.localeCompare(b.type);
      return a.name.localeCompare(b.name);
    });

    const { multiselect } = await import('@clack/prompts');
    const input = await multiselect({
      message: 'Which components would you like to add? (Space to select, Enter to confirm)',
      options: registryIndex.map((item) => ({
        value: item.name,
        label: `${item.name} [${item.type}]`,
      })),
      required: true,
    });
    
    if (typeof input === 'symbol') {
      process.exit(0);
    }

    components = input as string[];
  }

  // Ensure authProvider and socialProviders are asked if template-auth is added manually
  if ((components.includes('template-auth') || components.includes('service-auth')) && !options?.authProvider) {
    const { select, multiselect } = await import('@clack/prompts');
    const providerInput = await select({
      message: 'Which authentication provider do you want to use?',
      options: [
        { value: 'service-firebase-auth', label: 'Firebase' },
        { value: 'service-supabase-auth', label: 'Supabase (Mock)' },
        { value: 'service-api-auth', label: 'Custom API (Mock)' },
      ],
    });
    if (typeof providerInput !== 'symbol') {
      options = { ...options, authProvider: providerInput as string };
    }

    if (!options?.socialProviders && components.includes('template-auth')) {
      const socialInput = await multiselect({
        message: 'Which social login providers do you want to include?',
        options: [
          { value: 'google', label: 'Google' },
          { value: 'apple', label: 'Apple' },
          { value: 'github', label: 'GitHub' },
        ],
        required: false,
      });
      if (typeof socialInput !== 'symbol') {
        options = { ...options, socialProviders: socialInput as string[] };
      }
    }
  }

  const queue = [...components];
  const processed = new Set<string>();
  const npmDependencies = new Set<string>();

  while (queue.length > 0) {
    const component = queue.shift()!;
    if (processed.has(component)) continue;
    processed.add(component);

    const s = spinner();
    s.start(`Fetching ${component} from registry...`);

    try {
      const item = await getRegistryComponent(component);
      s.stop(`Found ${component}!`);

      // Escrever arquivos do componente
      for (const file of item.files) {
        const targetPath = path.resolve(targetCwd, 'src', file.path);
        
        await fs.ensureDir(path.dirname(targetPath));

        let shouldWrite = true;
        if (await fs.pathExists(targetPath) && !options?.skipPrompts) {
          const overwrite = await confirm({
            message: `File ${file.path} already exists. Overwrite?`,
            initialValue: false,
          });

          if (typeof overwrite === 'symbol' || !overwrite) {
            shouldWrite = false;
          }
        }

        if (shouldWrite) {
          let finalContent = file.content;
          
          if (item.name === 'template-auth' && options?.socialProviders) {
            const providers = options.socialProviders;
            if (providers.length === 0) {
              finalContent = finalContent.replace(/\{\/\*\s*IF_SOCIAL_AUTH_ANY\s*\*\/\}([\s\S]*?)\{\/\*\s*END_SOCIAL_AUTH_ANY\s*\*\/\}/g, '');
            }
            if (!providers.includes('google')) {
              finalContent = finalContent.replace(/\{\/\*\s*IF_SOCIAL_AUTH_GOOGLE\s*\*\/\}([\s\S]*?)\{\/\*\s*END_SOCIAL_AUTH_GOOGLE\s*\*\/\}/g, '');
            }
            if (!providers.includes('apple')) {
              finalContent = finalContent.replace(/\{\/\*\s*IF_SOCIAL_AUTH_APPLE\s*\*\/\}([\s\S]*?)\{\/\*\s*END_SOCIAL_AUTH_APPLE\s*\*\/\}/g, '');
            }
            if (!providers.includes('github')) {
              finalContent = finalContent.replace(/\{\/\*\s*IF_SOCIAL_AUTH_GITHUB\s*\*\/\}([\s\S]*?)\{\/\*\s*END_SOCIAL_AUTH_GITHUB\s*\*\/\}/g, '');
            }
            // Finally strip all the remaining markers since they're no longer needed
            finalContent = finalContent.replace(/\{\/\*\s*(IF|END)_SOCIAL_AUTH_[A-Z]+\s*\*\/\}\n?/g, '');
          }

          await fs.writeFile(targetPath, finalContent, 'utf-8');
          console.log(`✅ Written ${file.path}`);
        } else {
          console.log(`⏭️  Skipped ${file.path}`);
        }
      }

      // Adicionar registryDependencies à fila
      if (item.registryDependencies && item.registryDependencies.length > 0) {
        for (const dep of item.registryDependencies) {
          if (!processed.has(dep) && !queue.includes(dep)) {
            queue.push(dep);
          }
        }
      }

      // Se o componente for o service-auth genérico, instalar o provider escolhido
      if (item.name === 'service-auth' && options?.authProvider) {
        if (!processed.has(options.authProvider) && !queue.includes(options.authProvider)) {
          queue.push(options.authProvider);
        }
      }

      // Adicionar dependências NPM
      if (item.dependencies && item.dependencies.length > 0) {
        item.dependencies.forEach(d => npmDependencies.add(d));
      }

    } catch (error: any) {
      s.stop(`Failed to install ${component}: ${error.message}`);
    }
  }

  if (npmDependencies.size > 0) {
    const depsArray = Array.from(npmDependencies);
    console.log(`\n📦 Installing dependencies: ${depsArray.join(', ')}...`);
    const { execSync } = await import('child_process');
    try {
      execSync(`npx expo install ${depsArray.join(' ')}`, { stdio: 'inherit', cwd: targetCwd });
      console.log(`✅ Dependencies installed successfully!`);
    } catch (err: any) {
      console.error(`❌ Failed to install dependencies. You can install them manually:`);
      console.log(`   npx expo install ${depsArray.join(' ')}\n`);
    }
  }

  if (!options?.skipPrompts) {
    outro(`Done!`);
  }
}
