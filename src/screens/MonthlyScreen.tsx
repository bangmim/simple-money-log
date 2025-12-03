import React from 'react';
import {Pressable, View, useWindowDimensions} from 'react-native';
import {Header} from '../components/Header/Header';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faClose} from '@fortawesome/free-solid-svg-icons';
import {StackedBarChart} from 'react-native-chart-kit';
import {useRootNavigation} from '../navigations/RootNavigation';

export const MonthlyScreen: React.FC = () => {
  const navigation = useRootNavigation();
  const {width} = useWindowDimensions();

  // TODO: 나중에 실제 DB 데이터를 기반으로 교체
  const chartData = {
    labels: ['7월', '8월', '9월', '10월', '11월', '12월'],
    legend: ['사용', '수입'],
    data: [
      [120, 80],
      [90, 70],
      [150, 110],
      [130, 100],
      [170, 140],
      [160, 150],
    ],
    barColors: ['#ff6b6b', '#4ecdc4'],
  };

  return (
    <View style={{flex: 1}}>
      <Header>
        <Header.Title title="MonthlyScreen"></Header.Title>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}>
          <FontAwesomeIcon icon={faClose} />
        </Pressable>
      </Header>
      <View style={{flex: 1, padding: 16}}>
        <StackedBarChart
          data={chartData}
          width={width - 32}
          height={260}
          hideLegend={false}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#f1f2f6',
            backgroundGradientTo: '#dfe4ea',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            barPercentage: 0.5,
          }}
          style={{
            borderRadius: 12,
          }}
        />
      </View>
    </View>
  );
};
