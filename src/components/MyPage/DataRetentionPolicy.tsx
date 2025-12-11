import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Typography} from '../Typography';
import colors from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {scaleWidth} from '../../utils/responsive';

export const DataRetentionPolicy: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Typography
          variant="caption"
          color={colors.warning}
          style={styles.warningIcon}>
          ⚠️
        </Typography>
        <View style={styles.textContainer}>
          <Typography
            variant="caption"
            color={colors.textSecondary}
            style={styles.text}>
            데이터 보관 정책{'\n'}
            가계부 내역은 1년 단위로 자동 삭제됩니다.
          </Typography>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.backgroundTertiary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningIcon: {
    marginRight: scaleWidth(8),
  },
  textContainer: {
    flex: 1,
  },
  text: {
    lineHeight: 20,
  },
});
