import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { COLORS } from '../../constants/theme';

interface RoleGateProps {
  requiredRole: UserRole;
  children: React.ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({ requiredRole, children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/(auth)/login');
      return;
    }

    if (user.role !== requiredRole) {
      router.replace(
        user.role === 'employer' ? '/(employer)/dashboard' : '/(employee)/dashboard'
      );
    }
  }, [user, isLoading, requiredRole, router]);

  if (isLoading || !user || user.role !== requiredRole) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primaryAccent} />
        <Text style={styles.text}>Verifying session...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  text: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});
