import React, {useState, forwardRef} from 'react';
import {View, TextInput, TextInputProps, StyleSheet} from 'react-native';
import colors from '../theme/colors';
import {getFontFamily} from '../theme/typography';
import {scaleWidth} from '../utils/responsive';

type InputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: TextInputProps['keyboardType'];
  onSubmitEditing?: () => void;
  fontSize?: number;
  multiline?: boolean;
  height?: number;
  error?: boolean;
  errorPressed?: boolean;
};

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      value,
      onChangeText,
      placeholder,
      keyboardType,
      onSubmitEditing,
      fontSize = scaleWidth(20),
      multiline = false,
      height,
      error = false,
      errorPressed = false,
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);

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
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          onSubmitEditing={onSubmitEditing}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          style={[
            styles.input,
            {fontSize},
            ...(multiline && height ? [{height}] : []),
          ]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
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
    paddingVertical: 0,
    fontFamily: getFontFamily(),
  },
});

// 하위 호환성을 위한 별칭
export const SingleLineInput = forwardRef<TextInput, Omit<InputProps, 'multiline' | 'height'>>(
  (props, ref) => <Input {...props} ref={ref} multiline={false} />,
);

export const MultiLineInput = forwardRef<
  TextInput,
  Omit<InputProps, 'multiline'> & {height?: number}
>((props, ref) => <Input {...props} ref={ref} multiline={true} />);
