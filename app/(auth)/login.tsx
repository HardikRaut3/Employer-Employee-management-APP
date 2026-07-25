import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { UserRole } from '../../types';
import { Briefcase, Lock, Mail, ShieldCheck, UserCheck } from 'lucide-react-native';
// Demo credentials removed from UI — use empty defaults for sign-in

export default function LoginScreen() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('employer');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<string>('EMP-002');
  const [error, setError] = useState<string>('');
  
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleRoleSwitch = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    if (role === 'employer') {
      setEmail('');
      setPassword('');
      setEmployeeId('');
    } else {
      setEmail('');
      setEmployeeId('EMP-002');
    }
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (selectedRole === 'employee') {
      if (!employeeId.trim()) {
        setError('Please enter your Employee ID.');
        return;
      }
    } else {
      if (!password.trim()) {
        setError('Please enter your password.');
        return;
      }
    }
    setError('');
    const credential = selectedRole === 'employee' ? employeeId.trim() : password;
    const result = await login(email, credential, selectedRole);
    if (result.success) {
      if (result.mustResetPassword) {
        router.replace('/(auth)/reset');
        return;
      }

      if (selectedRole === 'employer') {
        router.replace('/(employer)/dashboard');
      } else {
        router.replace('/(employee)/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBanner}>
          <View style={styles.logoCircle}>
            <Briefcase size={28} color={COLORS.primaryAccent} />
          </View>
          <Text style={styles.brandTitle}>HR CONNECT</Text>
          <Text style={styles.brandSubtitle}>Employer & Employee Management Portal</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.formTitle}>Select Portal & Sign In</Text>

          {/* Role Switcher Tabs */}
          <View style={styles.roleTabs}>
            <TouchableOpacity
              style={[styles.roleTab, selectedRole === 'employer' && styles.activeTab]}
              onPress={() => handleRoleSwitch('employer')}
              activeOpacity={0.8}
            >
              <ShieldCheck
                size={16}
                color={selectedRole === 'employer' ? COLORS.primaryAccent : COLORS.textMuted}
              />
              <Text
                style={[
                  styles.tabText,
                  selectedRole === 'employer' && styles.activeTabText,
                ]}
              >
                Employer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleTab, selectedRole === 'employee' && styles.activeTab]}
              onPress={() => handleRoleSwitch('employee')}
              activeOpacity={0.8}
            >
              <UserCheck
                size={16}
                color={selectedRole === 'employee' ? COLORS.primaryAccent : COLORS.textMuted}
              />
              <Text
                style={[
                  styles.tabText,
                  selectedRole === 'employee' && styles.activeTabText,
                ]}
              >
                Employee
              </Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          <Input
            label="Work Email"
            value={email}
            onChangeText={setEmail}
            placeholder="e.g. sarah@company.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Mail size={18} color={COLORS.textMuted} />}
          />

          {selectedRole === 'employee' ? (
            <>
              <Input
                label="Employee ID"
                value={employeeId}
                onChangeText={setEmployeeId}
                placeholder="EMP-002"
                autoCapitalize="characters"
                icon={<Lock size={18} color={COLORS.textMuted} />}
              />
              <Text style={styles.hintText}>
                Employees sign in with Work Email + Employee ID.
              </Text>
            </>
          ) : (
            <>
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                icon={<Lock size={18} color={COLORS.textMuted} />}
              />
              <Text style={styles.hintText}>
                Employer accounts sign in with email and password.
              </Text>
            </>
          )}

          <Button
            title={`Sign In as ${selectedRole === 'employer' ? 'Employer' : 'Employee'}`}
            onPress={handleLogin}
            isLoading={isLoading}
            fullWidth
            size="lg"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerBanner: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.medium,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  activeTab: {
    backgroundColor: COLORS.card,
    ...SHADOWS.small,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  activeTabText: {
    color: COLORS.primaryAccent,
    fontWeight: '700',
  },
  errorBanner: {
    fontSize: 12,
    color: COLORS.danger,
    backgroundColor: COLORS.dangerLight,
    padding: SPACING.sm,
    borderRadius: RADIUS.xs,
    marginBottom: SPACING.md,
  },
  hintText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
});
