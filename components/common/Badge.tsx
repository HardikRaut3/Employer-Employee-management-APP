import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant, size = 'sm' }) => {
  let bg = COLORS.surface;
  let text = COLORS.textSecondary;

  const normalized = label.toLowerCase();

  if (variant) {
    switch (variant) {
      case 'success':
        bg = COLORS.successLight;
        text = COLORS.success;
        break;
      case 'warning':
        bg = COLORS.warningLight;
        text = COLORS.warning;
        break;
      case 'danger':
        bg = COLORS.dangerLight;
        text = COLORS.danger;
        break;
      case 'info':
        bg = COLORS.infoLight;
        text = COLORS.info;
        break;
      case 'purple':
        bg = COLORS.purpleLight;
        text = COLORS.purple;
        break;
      default:
        bg = COLORS.surface;
        text = COLORS.textSecondary;
    }
  } else {
    // Auto color matching based on label string
    if (['approved', 'completed', 'present', 'active', 'low'].includes(normalized)) {
      bg = COLORS.successLight;
      text = COLORS.success;
    } else if (['pending', 'in progress', 'late', 'medium', 'on leave'].includes(normalized)) {
      bg = COLORS.warningLight;
      text = COLORS.warning;
    } else if (['rejected', 'absent', 'urgent', 'high', 'terminated'].includes(normalized)) {
      bg = COLORS.dangerLight;
      text = COLORS.danger;
    } else if (['company news', 'vacation', 'casual'].includes(normalized)) {
      bg = COLORS.infoLight;
      text = COLORS.info;
    } else if (['event', 'sick'].includes(normalized)) {
      bg = COLORS.purpleLight;
      text = COLORS.purple;
    }
  }

  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: bg }, isSmall ? styles.sm : styles.md]}>
      <Text style={[styles.text, { color: text }, isSmall ? styles.smText : styles.mdText]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: RADIUS.xs,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  md: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: {
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  smText: {
    fontSize: 11,
  },
  mdText: {
    fontSize: 13,
  },
});
