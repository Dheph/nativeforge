#!/usr/bin/env node

import { Command } from 'commander';
import { intro, outro, select, text } from '@clack/prompts';
import pkg from '../package.json';
const { version } = pkg;
const program = new Command();

program
  .name('nativeforge')
  .description('The ultimate CLI for scaffolding React Native and Expo architectures.')
  .version(version);

program
  .command('init')
  .description('Initialize a new NativeForge project')
  .action(async () => {
    intro(`Welcome to NativeForge v${version}`);

    const projectType = await select({
      message: 'Which framework do you want to use?',
      options: [
        { value: 'expo', label: 'Expo (Recommended)' },
        { value: 'rn-cli', label: 'React Native CLI' },
      ],
    });

    if (typeof projectType === 'symbol') {
      process.exit(0);
    }

    const projectName = await text({
      message: 'What is your project named?',
      placeholder: 'my-app',
      initialValue: 'my-app',
    });

    if (typeof projectName === 'symbol') {
      process.exit(0);
    }

    outro(`Successfully initialized ${String(projectName)} with ${String(projectType)}! (Dummy output)`);
  });

program.parse();
