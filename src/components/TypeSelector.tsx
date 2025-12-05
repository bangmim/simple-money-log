import React from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';
import {AccountBookHistory} from '../data/AccountBookHistory';
import colors from '../theme/colors';

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
        <Pressable onPress={() => onSelectType('사용')} disabled={disabled}>
          <View
            style={[
              styles.button,
              styles.leftButton,
              selectedType === '사용' && styles.selectedButton,
            ]}>
            <Text
              style={[
                styles.buttonText,
                selectedType === '사용' && styles.selectedText,
              ]}>
              사용
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
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  leftButton: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  rightButton: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  selectedButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  selectedText: {
    color: colors.textInverse,
  },
});
