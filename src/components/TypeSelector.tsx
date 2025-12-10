import React from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';
import {AccountBookHistory} from '../data/AccountBookHistory';
import colors from '../theme/colors';
import {textStyles} from '../theme/typography';
import {scaleWidth} from '../utils/responsive';

type TypeSelectorProps = {
  selectedType: AccountBookHistory['type'];
  onSelectType: (type: AccountBookHistory['type']) => void;
  disabled?: boolean;
};

export const TypeSelector: React.FC<TypeSelectorProps> = ({
  selectedType,
  onSelectType,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable onPress={() => onSelectType('지출')} disabled={disabled}>
          <View
            style={[
              styles.button,
              styles.leftButton,
              selectedType === '지출' && styles.selectedButton,
            ]}>
            <Text
              style={[
                styles.buttonText,
                selectedType === '지출' && styles.selectedText,
              ]}>
              지출
            </Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable onPress={() => onSelectType('수입')} disabled={disabled}>
          <View
            style={[
              styles.button,
              styles.rightButton,
              selectedType === '수입' && styles.selectedButton,
            ]}>
            <Text
              style={[
                styles.buttonText,
                selectedType === '수입' && styles.selectedText,
              ]}>
              수입
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleWidth(12),
    backgroundColor: colors.background,
  },
  leftButton: {
    borderTopLeftRadius: scaleWidth(12),
    borderBottomLeftRadius: scaleWidth(12),
  },
  rightButton: {
    borderTopRightRadius: scaleWidth(12),
    borderBottomRightRadius: scaleWidth(12),
  },
  selectedButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    ...textStyles.body,
    color: colors.textPrimary,
  },
  selectedText: {
    ...textStyles.body,
    color: colors.textInverse,
  },
});
