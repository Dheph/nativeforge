import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../components/ui-button';
import { useAuthStore } from '../../services/auth';

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuthStore();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={styles.email}>{user?.email || 'User'}</Text>
        <Text style={styles.userId}>ID: {user?.uid || user?.id || 'Unknown'}</Text>
      </View>

      <Button 
        label="Log Out" 
        variant="outline" 
        onPress={signOut} 
        isLoading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#64748b',
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  userId: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
