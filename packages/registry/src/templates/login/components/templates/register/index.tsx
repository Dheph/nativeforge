import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../ui-button';
import { Input } from '../../ui-input';

export default function RegisterTemplate() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' }}>
        Create an Account
      </Text>
      
      <Input placeholder="Email" keyboardType="email-address" autoCapitalize="none" />
      <View style={{ height: 16 }} />
      <Input placeholder="Password" secureTextEntry />
      <View style={{ height: 16 }} />
      <Input placeholder="Confirm Password" secureTextEntry />
      <View style={{ height: 24 }} />
      
      <Button onPress={() => {}}>Sign Up</Button>
      
      <Button variant="ghost" onPress={() => router.back()} style={{ marginTop: 16 }}>
        Already have an account? Log in
      </Button>
    </View>
  );
}
