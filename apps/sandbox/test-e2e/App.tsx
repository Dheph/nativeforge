import { SafeAreaView } from 'react-native';
import LoginTemplate from './src/components/templates/login';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <LoginTemplate />
    </SafeAreaView>
  );
}
