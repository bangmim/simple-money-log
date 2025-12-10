import React from 'react';
import {View} from 'react-native';
import {Typography} from './Typography';
import colors from '../theme/colors';

type MonthlySummaryItemProps = {
  label: string;
  expense: number;
  income: number;
};

export const MonthlySummaryItem: React.FC<MonthlySummaryItemProps> = ({
  label,
  expense,
  income,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
      }}>
      <Typography variant="caption" color={colors.textPrimary}>
        {label}
      </Typography>
      <Typography variant="caption" color={colors.textSecondary}>
        지출 {expense.toLocaleString()}원 / 수입 {income.toLocaleString()}원
      </Typography>
    </View>
  );
};
