#!/usr/bin/env node

import { Command } from 'commander';
import { intro, outro, select, text } from '@clack/prompts';
import pkg from '../package.json';
const { version } = pkg;
import { addCommand } from './commands/add.js';
import { initCommand } from './commands/init.js';

const program = new Command();

program
  .name('nativeforge')
  .description('The ultimate CLI for scaffolding React Native and Expo architectures.')
  .version(version);

program
  .command('add [components...]')
  .description('Add components to your project')
  .action(addCommand);

program
  .command('init [name]')
  .description('Initialize a new NativeForge project')
  .option('-t, --template <template>', 'Base template (e.g. template-auth)')
  .action(async (name, options) => {
    if (process.env.CI_TEST) {
      name = 'test';
      options.template = 'template-auth';
    }
    await initCommand({ name, ...options });
  });

program.parse();
