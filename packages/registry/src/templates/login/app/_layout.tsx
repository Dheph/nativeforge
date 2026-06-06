import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../src/services/firebase-auth';

export default function RootLayout() {
  const { user, initialized } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // User is not signed in and trying to access an authenticated screen
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // User is signed in and trying to access auth screens (e.g. login)
      router.replace('/');
    }
  }, [user, initialized, segments]);

  return <Slot />;
}
