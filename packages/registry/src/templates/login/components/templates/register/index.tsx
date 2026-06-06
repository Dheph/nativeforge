import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../../ui-input';
import { Button } from '../../ui-button';
import { useAuthStore } from '../../../services/auth';

export default function RegisterTemplate() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const router = useRouter();
  
  const { 
    signUp, 
    isLoading, 
    error,
    signInWithGoogle,
    signInWithApple,
    signInWithGithub 
  } = useAuthStore();

  const handleRegister = () => {
    setValidationError('');
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    signUp(email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      {(error || validationError) ? (
        <Text style={styles.globalError}>{validationError || error}</Text>
      ) : null}

      <View style={styles.form}>
        <Input
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        
        <Button 
          label="Sign Up" 
          onPress={handleRegister} 
          isLoading={isLoading} 
        />

{/* IF_SOCIAL_AUTH_ANY */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Or register with</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialButtonsContainer}>
{/* END_SOCIAL_AUTH_ANY */}

{/* IF_SOCIAL_AUTH_GOOGLE */}
          <Button 
            label="Google" 
            variant="outline" 
            onPress={signInWithGoogle} 
          />
{/* END_SOCIAL_AUTH_GOOGLE */}

{/* IF_SOCIAL_AUTH_APPLE */}
          <Button 
            label="Apple" 
            variant="outline" 
            onPress={signInWithApple} 
          />
{/* END_SOCIAL_AUTH_APPLE */}

{/* IF_SOCIAL_AUTH_GITHUB */}
          <Button 
            label="GitHub" 
            variant="outline" 
            onPress={signInWithGithub} 
          />
{/* END_SOCIAL_AUTH_GITHUB */}

{/* IF_SOCIAL_AUTH_ANY */}
        </View>
{/* END_SOCIAL_AUTH_ANY */}
        
        <View style={styles.linksContainer}>
          <Button variant="ghost" onPress={() => router.back()}>
            Already have an account? Log In
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
    marginBottom: 32,
    textAlign: 'center',
    color: '#0f172a',
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
  linksContainer: {
    marginTop: 8,
    gap: 8,
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#64748b',
    fontSize: 14,
  },
  socialButtonsContainer: {
    gap: 12,
  }
});
