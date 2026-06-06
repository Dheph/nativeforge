import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../ui-button';
import { Input } from '../../ui-input';

export default function ForgotPasswordTemplate() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
        Reset Password
      </Text>
      <Text style={{ fontSize: 14, color: '#666', marginBottom: 24, textAlign: 'center' }}>
        Enter your email address and we'll send you a link to reset your password.
      </Text>
      
      <Input placeholder="Email address" keyboardType="email-address" autoCapitalize="none" />
      <View style={{ height: 24 }} />
      
      <Button onPress={() => {}}>Send Reset Link</Button>
      
      <Button variant="ghost" onPress={() => router.back()} style={{ marginTop: 16 }}>
        Back to Login
      </Button>
    </View>
  );
}
