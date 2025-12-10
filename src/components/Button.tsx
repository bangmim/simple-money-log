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

  // disabled일 때도 클릭 가능하도록 하기 위해 Pressable의 disabled는 loading일 때만 true
  // disabled는 색상만 변경하는 용도로 사용
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({pressed}) => [
        {
          opacity: pressed && !loading ? 0.7 : 1,
        },
      ]}>
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
