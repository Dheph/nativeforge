import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../../ui-input';
import { Button } from '../../ui-button';
import { useAuthStore } from '../../../services/auth';

export default function LoginTemplate() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  // Pegando estados e funções globais da nossa store Zustand agnóstica
  const { 
    signIn, 
    isLoading, 
    error,
    signInWithGoogle,
    signInWithApple,
    signInWithGithub 
  } = useAuthStore();

  const handleLogin = () => {
    signIn(email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      
      {error && <Text style={styles.globalError}>{error}</Text>}

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
        
        <Button 
          label="Log In" 
          onPress={handleLogin} 
          isLoading={isLoading} 
        />

{/* IF_SOCIAL_AUTH_ANY */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Or continue with</Text>
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
          <Button variant="ghost" onPress={() => router.push('/forgot-password')}>
            Forgot Password?
          </Button>
          
          <Button variant="ghost" onPress={() => router.push('/register')}>
            Create an Account
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
