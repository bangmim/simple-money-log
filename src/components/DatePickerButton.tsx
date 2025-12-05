import React from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';
import {convertToDateString} from '../utils/DateUtils';
import colors from '../theme/colors';
import {textStyles} from '../theme/typography';

type DatePickerButtonProps = {
  date: number;
  onPress: () => void;
  placeholder?: string;
};

export const DatePickerButton: React.FC<DatePickerButtonProps> = ({
  date,
  onPress,
  placeholder = '날짜를 선택하세요',
}) => {
  const hasDate = date !== 0;

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <Text style={[styles.text, !hasDate && styles.placeholder]}>
          {hasDate ? convertToDateString(date) : placeholder}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: colors.border,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  text: {
    ...textStyles.body,
    color: colors.textSecondary,
  },
  placeholder: {
    ...textStyles.body,
    color: colors.textTertiary,
  },
});
