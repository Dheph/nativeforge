# NativeForge

A modular, highly scalable CLI for scaffolding React Native and Expo applications. Built with domain-driven design, robust infrastructure setups (Firebase, Supabase, etc), and ready-to-use premium UI components.

## 🚀 Features

- **Project Scaffolding**: Create a new Expo project with a fully configured routing structure in seconds.
- **Dynamic Authentication Templates**: Inject a complete authentication flow (Login, Register, Forgot Password, Profile) using Expo Router and Tabs.
- **Provider Agnostic Auth**: Automatically injects your choice of Auth Provider (Firebase, Supabase mock, Custom API mock) keeping the UI completely abstracted using `zustand`.
- **Auto-Installation**: Dependencies are seamlessly installed via `npx expo install`, ensuring maximum compatibility with Expo SDKs.
- **Premium UI Components**: Bring in highly-customizable primitive UI components (`ui-button`, `ui-input`) inspired by Shadcn UI.

## 📦 Monorepo Structure

- `packages/cli`: The NativeForge CLI engine.
- `packages/registry`: The truth source for structural templates, modules, and UI components.

## 🛠 Getting Started

You can use the CLI directly to scaffold your project or add components.

### 1. Initialize a new project
```sh
npx nativeforge init
```
* You'll be prompted for a project name.
* You can choose an empty project or the **Auth Flow** template.
* If choosing the Auth Flow, the CLI will ask for your preferred Auth Provider (e.g., Firebase) and automatically generate the protected routes (`(app)`) and public routes (`(auth)`).

### 2. Add components to an existing project
```sh
npx nativeforge add
```
* Or add directly: `npx nativeforge add ui-button ui-input template-auth`
* The CLI will automatically resolve dependencies and run `npx expo install` to keep your project ready to run.

## 🧬 Templates & Structure

### `template-auth`
A complete template leveraging **Expo Router**.
- **`app/(auth)`**: Public routes for Login, Register, and Forgot Password.
- **`app/(app)`**: Protected routes (Home, Profile) using bottom Tabs.
- **`app/_layout.tsx`**: Dynamic redirection depending on the user's auth state.
- **`services/auth`**: Zustand abstract store injected dynamically with your chosen provider.

## 💻 Development

### Building the CLI and Registry
To build the project locally:
```sh
pnpm install
pnpm run build
```

*(Note: Ensure you build both packages when making changes to the registry templates.)*
