import React, {useState} from 'react';
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
};

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  onSubmitEditing,
  fontSize = scaleWidth(20),
  multiline = false,
  height,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.focusedContainer]}>
      <TextInput
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
};

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
  input: {
    paddingVertical: 0,
    fontFamily: getFontFamily(),
  },
});

// 하위 호환성을 위한 별칭
export const SingleLineInput: React.FC<
  Omit<InputProps, 'multiline' | 'height'>
> = props => <Input {...props} multiline={false} />;

export const MultiLineInput: React.FC<
  Omit<InputProps, 'multiline'> & {height?: number}
> = props => <Input {...props} multiline={true} />;
