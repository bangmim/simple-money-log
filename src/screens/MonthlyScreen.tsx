import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {Header} from '../components/Header/Header';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faClose} from '@fortawesome/free-solid-svg-icons';
import {StackedBarChart} from 'react-native-chart-kit';
import {useRootNavigation} from '../navigations/RootNavigation';
import {useAccountBookHistoryItem} from '../hooks/useAccountBookHistoryItem';
import {AccountBookHistory} from '../data/AccountBookHistory';
import {SafeAreaView} from 'react-native-safe-area-context';

type MonthlySummary = {
  key: string;
  label: string;
  expense: number;
  income: number;
};

export const MonthlyScreen: React.FC = () => {
  const navigation = useRootNavigation();
  const {width} = useWindowDimensions();
  const {getList} = useAccountBookHistoryItem();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<{
    labels: string[];
    data: number[][];
  }>({labels: [], data: []});
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary[]>([]);
  const [period, setPeriod] = useState<'3m' | '1y'>('3m');

  const buildMonthlyData = useCallback(
    (items: AccountBookHistory[]) => {
      const now = new Date();

      // 기간에 따라 months 생성
      const months: {key: string; label: string}[] = [];

      if (period === '3m') {
        // 최근 3개월 (현재월 포함, 과거 -> 현재 순)
        for (let i = 2; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${d.getMonth()}`; // year-monthIndex
          const label = `${d.getMonth() + 1}월`;
          months.push({key, label});
        }
      } else {
        // 올해 전체 1~12월
        for (let m = 0; m < 12; m++) {
          const d = new Date(now.getFullYear(), m, 1);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          const label = `${d.getMonth() + 1}월`;
          months.push({key, label});
        }
      }

      const summary = new Map<
        string,
        {
          expense: number;
          income: number;
        }
      >();

      months.forEach(m => {
        summary.set(m.key, {expense: 0, income: 0});
      });

      items.forEach(item => {
        // 날짜가 없으면 createdAt 기준으로 처리
        const time = item.date !== 0 ? item.date : item.createdAt;
        if (!time) {
          return;
        }
        const d = new Date(time);
        const key = `${d.getFullYear()}-${d.getMonth()}`;

        if (!summary.has(key)) {
          return;
        }

        const current = summary.get(key)!;
        if (item.type === '사용') {
          current.expense += item.price;
        } else {
          current.income += item.price;
        }
      });

      const labels = months.map(m => m.label);
      // 차트에는 금액을 1,000으로 나눈 값(단위: 천원)을 사용
      const data = months.map(m => {
        const s = summary.get(m.key)!;
        return [s.expense / 1000, s.income / 1000];
      });

      setChartData({labels, data});

      const summaryList: MonthlySummary[] = months.map(m => {
        const s = summary.get(m.key)!;
        return {
          key: m.key,
          label: m.label,
          expense: s.expense,
          income: s.income,
        };
      });
      setMonthlySummary(summaryList);
    },
    [period],
  );

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const list = await getList();
      buildMonthlyData(list);
      setLoading(false);
    };

    fetch();
  }, [buildMonthlyData, getList]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header>
        <Header.Title title="월별 통계 (단위: 천원)" />
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}>
          <FontAwesomeIcon icon={faClose} />
        </Pressable>
      </Header>
      <View style={{flex: 1, padding: 16}}>
        {loading ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator />
          </View>
        ) : (
          <View style={{flex: 1}}>
            {/* 기간 토글 */}
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginBottom: 12,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: '#ced6e0',
                overflow: 'hidden',
              }}>
              <Pressable
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 16,
                  backgroundColor: period === '3m' ? '#2f3542' : 'white',
                }}
                onPress={() => setPeriod('3m')}>
                <Text
                  style={{
                    fontSize: 13,
                    color: period === '3m' ? 'white' : '#2f3542',
                  }}>
                  최근 3개월
                </Text>
              </Pressable>
              <Pressable
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 16,
                  backgroundColor: period === '1y' ? '#2f3542' : 'white',
                }}
                onPress={() => setPeriod('1y')}>
                <Text
                  style={{
                    fontSize: 13,
                    color: period === '1y' ? 'white' : '#2f3542',
                  }}>
                  올해 전체
                </Text>
              </Pressable>
            </View>

            {/* 상단 요약 카드 */}
            <View
              style={{
                marginBottom: 16,
                padding: 16,
                borderRadius: 12,
                backgroundColor: '#f1f2f6',
              }}>
              {monthlySummary.length > 0 ? (
                <>
                  <Text
                    style={{fontSize: 16, fontWeight: '600', marginBottom: 8}}>
                    최근 3개월 요약
                  </Text>
                  {monthlySummary.map(summary => (
                    <View
                      key={summary.key}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 4,
                      }}>
                      <Text style={{fontSize: 14}}>{summary.label}</Text>
                      <Text style={{fontSize: 14, color: 'gray'}}>
                        사용 {summary.expense.toLocaleString()}원 / 수입{' '}
                        {summary.income.toLocaleString()}원
                      </Text>
                    </View>
                  ))}
                </>
              ) : (
                <Text style={{fontSize: 14, color: 'gray'}}>
                  최근 3개월에 대한 데이터가 없습니다.
                </Text>
              )}
            </View>

            {/* 막대 그래프 */}
            <ScrollView
              horizontal
              bounces={false}
              showsHorizontalScrollIndicator={false}>
              <StackedBarChart
                data={{
                  labels: chartData.labels,
                  legend: ['사용', '수입'],
                  data: chartData.data,
                  barColors: ['#ff6b6b', '#4ecdc4'],
                }}
                width={period === '1y' ? chartData.labels.length * 50 : width}
                height={260}
                hideLegend={false}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#f1f2f6',
                  backgroundGradientTo: '#dfe4ea',
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  barPercentage: 0.7,
                  decimalPlaces: 0,
                  paddingRight: 0,
                }}
                style={{
                  borderRadius: 12,
                }}
              />
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
