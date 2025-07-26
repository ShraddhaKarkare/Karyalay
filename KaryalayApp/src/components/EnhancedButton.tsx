import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface EnhancedButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient' | 'rounded' | 'pill';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled,
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle: any[] = [styles.button, styles[size], styles[variant]];
    
    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    return [styles.text, styles[`${size}Text`], styles[`${variant}Text`], textStyle];
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' || variant === 'gradient' ? '#fff' : '#007AFF'} 
          size="small"
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Size variants
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  
  // Style variants
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#6c757d',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  gradient: {
    backgroundColor: '#667eea',
  },
  rounded: {
    borderRadius: 25,
  },
  pill: {
    borderRadius: 50,
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  // Text colors for different variants
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#fff',
  },
  outlineText: {
    color: '#007AFF',
  },
  gradientText: {
    color: '#fff',
  },
  roundedText: {
    color: '#fff',
  },
  pillText: {
    color: '#fff',
  },
  
  disabled: {
    opacity: 0.6,
  },
});

export default EnhancedButton; 