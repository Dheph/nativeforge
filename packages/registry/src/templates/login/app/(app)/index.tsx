import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Welcome to NativeForge!</Text>
      <Text style={{ color: '#666', marginTop: 8 }}>You are successfully authenticated.</Text>
    </View>
  );
}
