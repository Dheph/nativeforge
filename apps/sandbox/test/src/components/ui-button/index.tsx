import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return styles.containerSecondary;
      case 'outline':
        return styles.containerOutline;
      case 'ghost':
        return styles.containerGhost;
      case 'primary':
      default:
        return styles.containerPrimary;
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'secondary':
        return styles.textSecondary;
      case 'outline':
      case 'ghost':
        return styles.textOutline;
      case 'primary':
      default:
        return styles.textPrimary;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return styles.sizeSm;
      case 'lg':
        return styles.sizeLg;
      case 'md':
      default:
        return styles.sizeMd;
    }
  };

  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[
        styles.baseContainer,
        getContainerStyle(),
        getSizeStyle(),
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#0f172a'} />
      ) : (
        <>
          {leftIcon}
          <Text style={[styles.baseText, getTextStyle()]}>{label}</Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: 8,
  },
  baseText: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  // Variants
  containerPrimary: {
    backgroundColor: '#0f172a',
  },
  textPrimary: {
    color: '#ffffff',
  },
  containerSecondary: {
    backgroundColor: '#f1f5f9',
  },
  textSecondary: {
    color: '#0f172a',
  },
  containerOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  containerGhost: {
    backgroundColor: 'transparent',
  },
  textOutline: {
    color: '#0f172a',
  },
  // Sizes
  sizeSm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sizeMd: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  sizeLg: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
});
