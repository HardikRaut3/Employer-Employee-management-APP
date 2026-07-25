import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/common/Header';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useRouter } from 'expo-router';
import { User, Phone, Mail, ShieldAlert, LogOut, Check } from 'lucide-react-native';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=250&auto=format&fit=crop&q=80',
];

export default function EmployeeProfileScreen() {
  const { user, updateProfile, logout } = useAuth();
  const router = useRouter();

  const [phone, setPhone] = useState<string>(user?.phone || '+1 (555) 345-6789');
  const [avatarUrl, setAvatarUrl] = useState<string>(
    user?.avatarUrl || AVATAR_OPTIONS[0]
  );
  const [successMsg, setSuccessMsg] = useState<string>('');

  const handleSave = async () => {
    await updateProfile({ phone, avatarUrl });
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Header title="Personal Profile" subtitle="Manage account settings & emergency info" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.position}>{user?.position}</Text>
          <Text style={styles.dept}>{user?.department} • {user?.employeeId}</Text>
          <View style={styles.badgeWrapper}>
            <Badge label="Active Employee" variant="success" size="md" />
          </View>

          {/* Avatar Selector */}
          <Text style={styles.avatarSelectTitle}>Choose Profile Avatar</Text>
          <View style={styles.avatarRow}>
            {AVATAR_OPTIONS.map((url, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setAvatarUrl(url)}
                style={[styles.avatarOption, avatarUrl === url && styles.selectedAvatarOption]}
              >
                <Image source={{ uri: url }} style={styles.smallAvatar} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {successMsg ? <Text style={styles.successBanner}>{successMsg}</Text> : null}

        {/* Editable Details Form */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Editable Contact Info</Text>

          <Input
            label="Mobile Phone Number"
            value={phone}
            onChangeText={setPhone}
            icon={<Phone size={18} color={COLORS.textMuted} />}
          />

          <Input
            label="Work Email (Read Only)"
            value={user?.email || 'alex.morgan@company.com'}
            editable={false}
            icon={<Mail size={18} color={COLORS.textMuted} />}
            style={{ color: COLORS.textMuted }}
          />

          <Button title="Save Profile Changes" onPress={handleSave} variant="primary" size="md" />
        </View>

        {/* Read Only Employment Metadata */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Company File Information</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Department</Text>
            <Text style={styles.metaVal}>{user?.department}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Employee ID</Text>
            <Text style={styles.metaVal}>{user?.employeeId}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Access Role</Text>
            <Text style={styles.metaVal}>Standard Employee</Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <View style={styles.logoutWrapper}>
          <Button
            title="Sign Out of Account"
            onPress={handleLogout}
            variant="danger"
            size="lg"
            fullWidth
            icon={<LogOut size={18} color="#FFF" />}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.medium,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  position: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dept: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  badgeWrapper: {
    marginTop: SPACING.sm,
  },
  avatarSelectTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  avatarOption: {
    padding: 2,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatarOption: {
    borderColor: COLORS.primaryAccent,
  },
  smallAvatar: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
  },
  successBanner: {
    fontSize: 13,
    color: COLORS.success,
    backgroundColor: COLORS.successLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
    textAlign: 'center',
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  metaLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  metaVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  logoutWrapper: {
    marginVertical: SPACING.md,
  },
});
