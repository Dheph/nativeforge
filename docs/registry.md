# NativeForge Registry

This document lists all available components, services, and templates currently provided by the NativeForge registry. You can add any of these to your project using the NativeForge CLI.

## Adding Components

To add components interactively, simply run:
```bash
npx nativeforge add
```

If you know the exact name of the component, you can pass it directly:
```bash
npx nativeforge add ui-button service-firebase-auth
```

---

## 🧩 UI Components

These are foundational, re-usable interface elements. They are designed to be easily customizable with TailwindCSS (NativeWind).

### `ui-button`
A highly customizable button component with different variants (default, outline, ghost) and sizes. Supports loading states and icons.
- **Dependencies**: `react-native`, `expo-router`
- **Location**: `components/ui-button`

### `ui-input`
A standardized text input component that supports labels, placeholder text, secure entry (passwords), and error messages.
- **Dependencies**: `react-native`
- **Location**: `components/ui-input`

---

## ⚙️ Services

Services provide core business logic and integrations for your app.

### `service-auth`
A generic abstract layer and Zustand store for authentication. Useful if you want to implement your own provider from scratch while keeping the NativeForge Auth state pattern.
- **Dependencies**: `zustand`, `@react-native-async-storage/async-storage`
- **Location**: `services/auth`

### `service-firebase-auth`
A complete Firebase Authentication integration using the NativeForge Auth state pattern. Includes email/password login, registration, password reset, and session persistence.
- **Dependencies**: `firebase`, `zustand`, `@react-native-async-storage/async-storage`
- **Location**: `services/firebase-auth` (mapped to `services/auth` in your project)

### `service-supabase-auth`
A Supabase Authentication integration mock. Ready to be connected to your Supabase project.
- **Dependencies**: `@supabase/supabase-js`, `zustand`, `@react-native-async-storage/async-storage`
- **Location**: `services/supabase-auth` (mapped to `services/auth` in your project)

### `service-api-auth`
A custom REST API Authentication integration mock. Ideal for integrating with your own custom backend (Node.js, Python, Ruby, etc.).
- **Dependencies**: `axios` (optional), `zustand`, `@react-native-async-storage/async-storage`
- **Location**: `services/api-auth` (mapped to `services/auth` in your project)

---

## 📦 Templates

Templates are full-featured, interconnected screens and flows that give you a massive head start.

### `template-auth`
A complete authentication flow built with Expo Router. It automatically wires up the screens with your chosen authentication service.

**What's included:**
- **App Routes**: `(auth)/login`, `(auth)/register`, `(auth)/forgot-password`, `(app)/profile`
- **Auth Provider Context**: Automatically protects `(app)` routes from unauthenticated users and redirects logged-in users away from `(auth)` routes.
- **UI Components**: Automatically pulls in `ui-button` and `ui-input`.
- **Service Integration**: Works seamlessly with any selected `service-*` component.

**Screens:**
- **Login**: Email/password form with links to register and forgot password.
- **Register**: Account creation form.
- **Forgot Password**: Password reset request screen.
- **Profile**: A protected screen displaying the logged-in user's data and a logout button.
