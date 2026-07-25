import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { LogOut, ShieldCheck, UserCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {user?.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
          </View>
        )}
        <View style={styles.textContainer}>
          <View style={styles.roleRow}>
            {user?.role === 'employer' ? (
              <View style={[styles.roleBadge, { backgroundColor: COLORS.purpleLight }]}>
                <ShieldCheck size={12} color={COLORS.purple} />
                <Text style={[styles.roleText, { color: COLORS.purple }]}>Employer Portal</Text>
              </View>
            ) : (
              <View style={[styles.roleBadge, { backgroundColor: COLORS.primaryLight }]}>
                <UserCheck size={12} color={COLORS.primaryAccent} />
                <Text style={[styles.roleText, { color: COLORS.primaryAccent }]}>Employee Workspace</Text>
              </View>
            )}
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {title || `Welcome back, ${user?.name?.split(' ')[0] || 'User'}!`}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton} onPress={handleLogout} activeOpacity={0.7}>
          <LogOut size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    marginRight: SPACING.md,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
  },
  roleRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    gap: 4,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
