import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import {Header} from '../components/Header/Header';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faClose} from '@fortawesome/free-solid-svg-icons';
import {StackedBarChartView} from '../components/StackedBarChartView';
import {useRootNavigation} from '../navigations/RootNavigation';
import {useAccountBookHistoryItem} from '../hooks/useAccountBookHistoryItem';
import {AccountBookHistory} from '../data/AccountBookHistory';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SegmentToggle} from '../components/SegmentToggle';
import {EmptyState} from '../components/EmptyState';
import colors from '../theme/colors';
import {spacing} from '../theme/spacing';
import {scaleWidth} from '../utils/responsive';
import {BannerAdView} from '../components/BannerAdView';
import {Spacer} from '../components/Spacer';
import {MonthlySummaryCard} from '../components/MonthlySummaryCard';

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
        // price가 유효한 숫자인지 확인
        const price = Number(item.price) || 0;
        if (item.type === '지출') {
          current.expense += price;
        } else {
          current.income += price;
        }
      });

      const labels = months.map(m => m.label);
      // 차트에는 금액을 1,000으로 나눈 값(단위: 천원)을 사용
      // NaN 방지를 위해 숫자 검증 추가
      const data = months.map(m => {
        const s = summary.get(m.key)!;
        const expense = Number.isFinite(s.expense) ? s.expense : 0;
        const income = Number.isFinite(s.income) ? s.income : 0;
        return [expense / 1000, income / 1000];
      });

      // 빈 데이터 체크
      const hasData = data.some(
        ([expense, income]) => expense > 0 || income > 0,
      );

      if (hasData) {
        setChartData({labels, data});
      } else {
        setChartData({labels: [], data: []});
      }

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
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <Header>
        <Header.Title title="월별 통계 (단위: 천원)" />
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <FontAwesomeIcon icon={faClose} />
        </Pressable>
      </Header>
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: spacing.horizontal,
          paddingVertical: spacing.vertical,
        }}>
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
            <SegmentToggle
              options={[
                {value: '3m', label: '최근 3개월'},
                {value: '1y', label: '올해 전체'},
              ]}
              selectedValue={period}
              onValueChange={setPeriod}
            />

            {/* 상단 요약 카드 */}
            <MonthlySummaryCard
              monthlySummary={monthlySummary}
              period={period}
            />

            {/* 막대 그래프 */}
            {chartData.labels.length > 0 && chartData.data.length > 0 ? (
              <ScrollView
                horizontal
                bounces={false}
                showsHorizontalScrollIndicator={false}>
                <StackedBarChartView
                  labels={chartData.labels}
                  data={chartData.data}
                  width={Math.max(
                    period === '1y'
                      ? scaleWidth(chartData.labels.length * 50)
                      : width,
                    scaleWidth(chartData.labels.length * 50),
                  )}
                  height={260}
                  hideLegend={false}
                  barPercentage={0.7}
                  paddingRight={0}
                />
              </ScrollView>
            ) : (
              <EmptyState message="표시할 데이터가 없습니다." height={260} />
            )}
          </View>
        )}
      </ScrollView>
      {period === '1y' && <Spacer space={scaleWidth(16)} />}
      <BannerAdView />
    </SafeAreaView>
  );
};
