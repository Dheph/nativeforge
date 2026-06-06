import { intro, outro, select, multiselect, text, spinner } from '@clack/prompts';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import { addCommand } from './add.js';

export async function initCommand(options: { name?: string, template?: string }) {
  intro(`Initializing NativeForge Project...`);

  let projectName = options.name;
  if (!projectName) {
    const input = await text({
      message: 'What is your project named?',
      placeholder: 'my-app',
      initialValue: 'my-app',
    });
    if (typeof input === 'symbol') process.exit(0);
    projectName = input;
  }

  let templateOption = options.template;
  if (!templateOption) {
    const input = await select({
      message: 'Do you want to start with a base template?',
      options: [
        { value: 'template-auth', label: 'Auth Flow (Router, Login, Register + Firebase)' },
        { value: 'none', label: 'Empty Project (Expo Router)' },
      ],
    });
    if (typeof input === 'symbol') process.exit(0);
    templateOption = input as string;
  }

  let socialProviders: string[] = [];
  let authProvider = 'service-firebase-auth';

  if (templateOption === 'template-auth') {
    if (process.env.CI_TEST) {
      socialProviders = ['google', 'apple']; // Mock selected values
      authProvider = 'service-firebase-auth';
    } else {
      const providerInput = await select({
        message: 'Which authentication provider do you want to use?',
        options: [
          { value: 'service-firebase-auth', label: 'Firebase' },
          { value: 'service-supabase-auth', label: 'Supabase (Mock)' },
          { value: 'service-api-auth', label: 'Custom API (Mock)' },
        ],
      });
      if (typeof providerInput !== 'symbol') {
        authProvider = providerInput as string;
      }

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
        socialProviders = socialInput as string[];
      }
    }
  }

  const s = spinner();
  s.start(`Creating Expo project ${projectName}... (this may take a minute)`);

  try {
    // Usa o template default do Expo que já vem com Expo Router (app/ diretório)
    // O prefixo CI=1 evita que o create-expo-app pergunte sobre repositório git (o que pode travar o processo)
    execSync(`CI=1 npx create-expo-app@latest ${projectName} -y`, { stdio: 'ignore' });
    s.stop(`Expo project ${projectName} created successfully!`);

    const projectDir = path.resolve(process.cwd(), projectName);

    if (templateOption !== 'none') {
      if (templateOption === 'template-auth') {
        // Limpar o boilerplate padrão do Expo Router para injetar o nosso
        const fs = await import('fs-extra');
        const defaultAppDir = path.join(projectDir, 'src', 'app');
        if (await fs.pathExists(defaultAppDir)) {
          await fs.emptyDir(defaultAppDir);
        }
      }

      console.log(`\nAdding ${templateOption} to your project...`);
      await addCommand([templateOption as string], { cwd: projectDir, skipPrompts: true, socialProviders, authProvider });
    }

    outro(`Your project is ready! Run: cd ${projectName} && npx expo start`);
  } catch (error: any) {
    s.stop(`Failed to create project: ${error.message}`);
    process.exit(1);
  }
}
