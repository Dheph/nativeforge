import { Tabs } from 'expo-router';
import { Button } from '../../src/components/ui-button';
import { useAuthStore } from '../../src/services/firebase-auth';

export default function AppLayout() {
  const { signOut } = useAuthStore();

  return (
    <Tabs>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          headerRight: () => (
            <Button variant="ghost" onPress={signOut} style={{ paddingHorizontal: 16 }}>
              Logout
            </Button>
          )
        }} 
      />
    </Tabs>
  );
}
