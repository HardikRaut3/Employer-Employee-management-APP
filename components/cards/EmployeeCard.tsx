import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { Employee } from '../../types';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { Badge } from '../common/Badge';
import { Mail, Phone, ChevronRight } from 'lucide-react-native';

interface EmployeeCardProps {
  employee: Employee;
  onPress: () => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onPress }) => {
  const handleEmail = (e: any) => {
    e.stopPropagation();
    Linking.openURL(`mailto:${employee.email}`);
  };

  const handlePhone = (e: any) => {
    e.stopPropagation();
    Linking.openURL(`tel:${employee.phone}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.header}>
        <Image source={{ uri: employee.avatarUrl }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{employee.name}</Text>
          <Text style={styles.position}>{employee.position}</Text>
          <Text style={styles.department}>{employee.department} • {employee.employeeId}</Text>
        </View>
        <Badge label={employee.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleEmail}>
            <Mail size={14} color={COLORS.primaryAccent} />
            <Text style={styles.actionText}>Email</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handlePhone}>
            <Phone size={14} color={COLORS.primaryAccent} />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
        </View>

        <ChevronRight size={18} color={COLORS.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    marginRight: SPACING.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  position: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  department: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xs,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryAccent,
  },
});
