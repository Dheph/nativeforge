#!/usr/bin/env node

import { Command } from 'commander';
import { intro, outro, select, text } from '@clack/prompts';
import pkg from '../package.json';
const { version } = pkg;
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';

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
  .command('init')
  .description('Initialize a new NativeForge project')
  .option('-n, --name <name>', 'Project name')
  .option('-t, --template <template>', 'Base template (e.g. template-login)')
  .action(initCommand);

program.parse();
