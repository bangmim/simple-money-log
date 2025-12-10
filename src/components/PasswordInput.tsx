import React, {useState, forwardRef} from 'react';
import {Pressable, TextInput, View, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import colors from '../theme/colors';
import {getFontFamily} from '../theme/typography';
import {scaleWidth} from '../utils/responsive';

type PasswordInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  focused?: boolean;
  error?: boolean;
  errorPressed?: boolean;
};

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  (
    {
      value,
      onChangeText,
      placeholder = '비밀번호 (6자 이상)',
      onFocus,
      onBlur,
      focused: externalFocused = false,
      error = false,
      errorPressed = false,
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalFocused, setInternalFocused] = useState(false);

    // 외부에서 focused prop을 받지 않으면 내부 상태 사용
    const focused = externalFocused || internalFocused;

    return (
      <View
        style={[
          styles.container,
          focused && !error && !errorPressed && styles.focusedContainer,
          error && !errorPressed && styles.errorContainer,
          error && errorPressed && styles.errorPressedContainer,
        ]}>
        <TextInput
          ref={ref}
          autoCorrect={false}
          autoCapitalize="none"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={!showPassword}
          style={styles.input}
          onFocus={() => {
            setInternalFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setInternalFocused(false);
            onBlur?.();
          }}
        />
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconButton}>
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            size={scaleWidth(20)}
            color={colors.textSecondary}
          />
        </Pressable>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleWidth(8),
    borderRadius: scaleWidth(4),
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusedContainer: {
    borderColor: colors.borderFocused,
  },
  errorContainer: {
    borderColor: colors.danger,
  },
  errorPressedContainer: {
    borderColor: colors.danger,
    borderWidth: 2,
  },
  input: {
    fontSize: scaleWidth(16),
    paddingVertical: 0,
    flex: 1,
    fontFamily: getFontFamily(),
  },
  iconButton: {
    padding: scaleWidth(4),
  },
});
