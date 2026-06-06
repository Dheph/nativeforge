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

### Add components

Add a component to your project:

```bash
npx nativeforge add ui-button
```

Or run `add` interactively to see and pick what's available!

```bash
npx nativeforge add
```

**Interactive Preview:**
```text
┌  Installing components...
│
◇  Registry fetched successfully!
│
◆  Which components would you like to add? (Space to select, Enter to confirm)
│  ◻ ui-button [component]
│  ◻ ui-input [component]
│  ◻ service-api-auth [service]
│  ◻ service-firebase-auth [service]
│  ◻ service-supabase-auth [service]
│  ◻ template-auth [template]
└
```

**Looking for the full list of components?**
Check out the [Registry Documentation](./docs/registry.md) for details on all available UI components, backend services, and templates.

---

### Local Testing (Contributors)

If you are contributing to NativeForge and want to test changes locally without publishing to NPM, follow these steps:

1. In the `packages/registry` directory, build the registry and start the local python server:
```bash
pnpm run build
cd dist
python3 -m http.server 8888
```

2. From any Expo project on your machine, or inside the root of the monorepo, point the CLI to the local server by setting the `NATIVEFORGE_REGISTRY_URL` environment variable:
```bash
NATIVEFORGE_REGISTRY_URL=http://localhost:8888 node /path/to/nativeforge/packages/cli/dist/index.js add
```

Alternatively, from the monorepo root, you can just use the helper script:
```bash
npm run nativeforge:local add
```

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
