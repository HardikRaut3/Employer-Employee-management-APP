import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  disabled = false,
  fullWidth = false,
}) => {
  let bg = COLORS.primaryAccent;
  let textColor = '#FFFFFF';
  let borderColor = 'transparent';

  switch (variant) {
    case 'primary':
      bg = COLORS.primaryAccent;
      textColor = '#FFFFFF';
      break;
    case 'secondary':
      bg = COLORS.primary;
      textColor = '#FFFFFF';
      break;
    case 'outline':
      bg = 'transparent';
      textColor = COLORS.textPrimary;
      borderColor = COLORS.border;
      break;
    case 'danger':
      bg = COLORS.danger;
      textColor = '#FFFFFF';
      break;
    case 'success':
      bg = COLORS.success;
      textColor = '#FFFFFF';
      break;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bg, borderColor },
        size === 'sm' && styles.sm,
        size === 'md' && styles.md,
        size === 'lg' && styles.lg,
        fullWidth && styles.fullWidth,
        (disabled || isLoading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text style={[styles.text, { color: textColor }, size === 'sm' && styles.smText]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  sm: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
  },
  md: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
  },
  lg: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: 6,
  },
  text: {
    fontWeight: '700',
    fontSize: 14,
  },
  smText: {
    fontSize: 12,
  },
});
