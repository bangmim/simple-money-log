import React from 'react';
import {StackedBarChart} from 'react-native-chart-kit';
import colors from '../theme/colors';

type StackedBarChartViewProps = {
  labels: string[];
  data: number[][];
  width: number;
  height: number;
  hideLegend?: boolean;
  barColors?: string[];
  backgroundColor?: string;
  backgroundGradientFrom?: string;
  backgroundGradientTo?: string;
  barPercentage?: number;
  paddingRight?: number;
};

export const StackedBarChartView: React.FC<StackedBarChartViewProps> = ({
  labels,
  data,
  width,
  height,
  hideLegend = false,
  barColors = [colors.chartExpense, colors.chartIncome],
  backgroundColor = colors.background,
  backgroundGradientFrom = colors.backgroundSecondary,
  backgroundGradientTo = colors.backgroundTertiary,
  barPercentage,
  paddingRight,
}) => {
  // 0일 때는 null로 설정하여 막대 위 값이 표시되지 않도록 함
  const processedData = data.map(([expense, income]) => [
    expense === 0 ? (null as any) : expense,
    income === 0 ? (null as any) : income,
  ]) as any;

  const chartConfig: any = {
    backgroundColor,
    backgroundGradientFrom,
    backgroundGradientTo,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    decimalPlaces: 0,
    formatYLabel: (value: string) => {
      const num = parseFloat(value);
      if (isNaN(num) || num === 0) {
        return '';
      }
      return value;
    },
    formatTopBarValue: (value: number) => {
      // 0일 때는 빈 문자열 반환하여 막대 위 값 숨김
      if (value === 0 || value < 0.01) {
        return '';
      }
      return Math.round(value).toString();
    },
  };

  if (barPercentage !== undefined) {
    chartConfig.barPercentage = barPercentage;
  }

  if (paddingRight !== undefined) {
    chartConfig.paddingRight = paddingRight;
  }

  return (
    <StackedBarChart
      data={{
        labels,
        legend: ['지출', '수입'],
        data: processedData,
        barColors,
      }}
      width={width}
      height={height}
      hideLegend={hideLegend}
      chartConfig={chartConfig}
    />
  );
};
