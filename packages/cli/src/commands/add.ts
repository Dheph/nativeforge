import fs from 'fs-extra';
import path from 'path';
import { intro, outro, spinner, text, confirm } from '@clack/prompts';
import { getRegistryComponent } from '../utils/registry.js';

export async function addCommand(components: string[]) {
  intro(`Installing components...`);

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

  for (const component of components) {
    const s = spinner();
    s.start(`Fetching ${component} from registry...`);

    try {
      const item = await getRegistryComponent(component);
      s.stop(`Found ${component}!`);

      for (const file of item.files) {
        // Here we can use a target path resolution, for now let's write to current dir
        // e.g. ./src/components/...
        const targetPath = path.resolve(process.cwd(), 'src', file.path);
        
        await fs.ensureDir(path.dirname(targetPath));

        let shouldWrite = true;
        if (await fs.pathExists(targetPath)) {
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

      if (item.dependencies && item.dependencies.length > 0) {
        console.log(`\n📦 Don't forget to install dependencies:`);
        console.log(`   pnpm add ${item.dependencies.join(' ')}\n`);
      }

    } catch (error: any) {
      s.stop(`Failed to install ${component}: ${error.message}`);
    }
  }

  outro(`Done!`);
}
