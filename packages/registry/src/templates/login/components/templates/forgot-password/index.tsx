import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../../ui-input';
import { Button } from '../../ui-button';
import { useAuthStore } from '../../../services/auth';

export default function ForgotPasswordTemplate() {
  const [email, setEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();
  
  const { resetPassword, isLoading, error } = useAuthStore();

  const handleReset = async () => {
    setSuccessMsg('');
    await resetPassword(email);
    // Since resetPassword catches internally and sets error, we can check error
    // but the cleanest way is if error is null after
    const { error: currentError } = useAuthStore.getState();
    if (!currentError) {
      setSuccessMsg('A password reset link has been sent to your email.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you a link to reset your password.
      </Text>
      
      {error ? <Text style={styles.globalError}>{error}</Text> : null}
      {successMsg ? <Text style={styles.successMsg}>{successMsg}</Text> : null}

      <View style={styles.form}>
        <Input
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Button 
          label="Send Reset Link" 
          onPress={handleReset} 
          isLoading={isLoading} 
        />

        <View style={styles.linksContainer}>
          <Button variant="ghost" onPress={() => router.back()}>
            Back to Login
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  globalError: {
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
  },
  successMsg: {
    color: '#10b981',
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: '#ecfdf5',
    padding: 12,
    borderRadius: 8,
  },
  linksContainer: {
    marginTop: 8,
    alignItems: 'center',
  }
});
