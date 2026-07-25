import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  lightColor?: string;
  subtitle?: string;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = COLORS.primaryAccent,
  lightColor = COLORS.primaryLight,
  subtitle,
  onPress,
}) => {
  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: lightColor }]}>
          {icon}
        </View>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    flex: 1,
    minWidth: 140,
    ...SHADOWS.small,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginVertical: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
});
