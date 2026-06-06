import fs from 'fs-extra';
import path from 'path';
import { intro, outro, spinner, text, confirm } from '@clack/prompts';
import { getRegistryComponent } from '../utils/registry.js';

export async function addCommand(components: string[], options?: { cwd?: string, skipPrompts?: boolean }) {
  const targetCwd = options?.cwd || process.cwd();
  
  if (!options?.skipPrompts) {
    intro(`Installing components...`);
  }

  if (!components || components.length === 0) {
    const input = await text({
      message: 'Which components would you like to add? (comma-separated)',
      placeholder: 'template-login, button',
    });
    
    if (typeof input === 'symbol') {
      process.exit(0);
    }

    components = input.split(',').map((c) => c.trim());
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
        let targetPath = path.resolve(targetCwd, 'src', file.path);
        
        // NativeForge Router Injection Support
        if (file.path.startsWith('app/')) {
          targetPath = path.resolve(targetCwd, file.path);
        }
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
          await fs.writeFile(targetPath, file.content, 'utf-8');
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

      // Adicionar dependências NPM
      if (item.dependencies && item.dependencies.length > 0) {
        item.dependencies.forEach(d => npmDependencies.add(d));
      }

    } catch (error: any) {
      s.stop(`Failed to install ${component}: ${error.message}`);
    }
  }

  if (npmDependencies.size > 0) {
    console.log(`\n📦 Don't forget to install these dependencies:`);
    console.log(`   pnpm add ${Array.from(npmDependencies).join(' ')}\n`);
  }

  if (!options?.skipPrompts) {
    outro(`Done!`);
  }
}
