import React from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';
import colors from '../theme/colors';
import {textStyles} from '../theme/typography';
import {scaleWidth} from '../utils/responsive';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}) => {
  const backgroundColor =
    variant === 'danger'
      ? colors.danger
      : variant === 'secondary'
      ? colors.textSecondary
      : disabled || loading
      ? colors.textSecondary
      : colors.primary;

  return (
    <Pressable onPress={onPress} disabled={disabled || loading}>
      <View
        style={[
          styles.button,
          {
            backgroundColor,
          },
        ]}>
        <Text style={styles.buttonText}>{loading ? '처리 중...' : title}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: scaleWidth(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleWidth(8),
  },
  buttonText: {
    ...textStyles.bodyBold,
    color: colors.textInverse,
  },
});
