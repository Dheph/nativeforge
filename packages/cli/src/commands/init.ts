import { intro, outro, select, text, spinner } from '@clack/prompts';
import { execSync } from 'child_process';
import path from 'path';
import { addCommand } from './add.js';

export async function initCommand() {
  intro(`Initializing NativeForge Project...`);

  // Defaulting to Expo as decided in the architecture plan
  const projectName = await text({
    message: 'What is your project named?',
    placeholder: 'my-app',
    initialValue: 'my-app',
  });

  if (typeof projectName === 'symbol') {
    process.exit(0);
  }

  const templateOption = await select({
    message: 'Do you want to start with a base template?',
    options: [
      { value: 'template-login', label: 'Login Template (Firebase Auth + UI Base)' },
      { value: 'none', label: 'Empty Project' },
    ],
  });

  if (typeof templateOption === 'symbol') {
    process.exit(0);
  }

  const s = spinner();
  s.start(`Creating Expo project ${projectName}... (this may take a minute)`);

  try {
    // Scaffold Expo app silently
    execSync(`npx create-expo-app@latest ${projectName} --template blank-typescript -y`, { 
      stdio: 'ignore' 
    });
    s.stop(`Expo project ${projectName} created successfully!`);

    const projectDir = path.resolve(process.cwd(), projectName);

    if (templateOption !== 'none') {
      console.log(`\nAdding ${templateOption} to your project...`);
      await addCommand([templateOption as string], { cwd: projectDir, skipPrompts: true });

      if (templateOption === 'template-login') {
        const fs = await import('fs-extra');
        const appTsxPath = path.join(projectDir, 'App.tsx');
        if (await fs.pathExists(appTsxPath)) {
          const appContent = `import { SafeAreaView } from 'react-native';
import LoginTemplate from './src/components/templates/login';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <LoginTemplate />
    </SafeAreaView>
  );
}
`;
          await fs.writeFile(appTsxPath, appContent, 'utf-8');
        }
      }
    }

    outro(`Your project is ready! Run: cd ${projectName} && npx expo start`);
  } catch (error: any) {
    s.stop(`Failed to create project: ${error.message}`);
    process.exit(1);
  }
}
