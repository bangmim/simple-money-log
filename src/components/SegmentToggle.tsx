import React from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';
import colors from '../theme/colors';
import {textStyles} from '../theme/typography';
import {scaleWidth} from '../utils/responsive';

type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentToggleProps<T extends string> = {
  options: SegmentOption<T>[];
  selectedValue: T;
  onValueChange: (value: T) => void;
};

export const SegmentToggle = <T extends string>({
  options,
  selectedValue,
  onValueChange,
}: SegmentToggleProps<T>) => {
  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        const isSelected = option.value === selectedValue;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <Pressable
            key={option.value}
            style={[
              styles.button,
              isFirst && styles.firstButton,
              isLast && styles.lastButton,
              isSelected && styles.selectedButton,
            ]}
            onPress={() => onValueChange(option.value)}>
            <Text
              style={[styles.buttonText, isSelected && styles.selectedText]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: scaleWidth(12),
    borderRadius: scaleWidth(999),
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: scaleWidth(6),
    paddingHorizontal: scaleWidth(16),
    backgroundColor: colors.background,
  },
  firstButton: {},
  lastButton: {},
  selectedButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    ...textStyles.caption,
    fontSize: scaleWidth(13), // 13px은 caption(14px)보다 작으므로 override
    color: colors.textPrimary,
  },
  selectedText: {
    ...textStyles.caption,
    fontSize: 13,
    color: colors.textInverse,
  },
});
