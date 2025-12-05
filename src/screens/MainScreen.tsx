import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {Header} from '../components/Header/Header';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus, faTrash, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import {AccountBookHistory} from '../data/AccountBookHistory';
import {useRootNavigation} from '../navigations/RootNavigation';
import {AccountBookHistoryListItemView} from '../components/AccountHistoryListItemView';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAccountBookHistoryItem} from '../hooks/useAccountBookHistoryItem';
import {useFocusEffect} from '@react-navigation/native';
import {StackedBarChartView} from '../components/StackedBarChartView';
import {convertToDateString} from '../utils/DateUtils';
import {RectButton, Swipeable} from 'react-native-gesture-handler';
import {useAuth} from '../hooks/useAuth';
import {EmptyState} from '../components/EmptyState';
import {confirmDialog} from '../utils/confirmDialog';
import colors from '../theme/colors';
import {spacing} from '../theme/spacing';
import {Typography} from '../components/Typography';

export const MainScreen: React.FC = () => {
  const safeAreaInset = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const navigation = useRootNavigation();
  const {signOut} = useAuth();
  const [list, setList] = useState<AccountBookHistory[]>([]);
  const {getList, deleteItem} = useAccountBookHistoryItem();
  const swipeableRefs = useRef<Map<string, Swipeable | null>>(
    new Map<string, Swipeable | null>(),
  );
  const fetchList = useCallback(async () => {
    const data = await getList();
    setList(data);
  }, [getList]);

  useFocusEffect(
    useCallback(() => {
      fetchList();
    }, [fetchList]),
  );

  const dailyChart = useMemo(() => {
    // 이번 달 1일부터 말일까지 일별 통계 (단위: 천원)
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const expense = Array(daysInMonth).fill(0);
    const income = Array(daysInMonth).fill(0);

    list.forEach(item => {
      const time = item.date !== 0 ? item.date : item.createdAt;
      if (!time) {
        return;
      }
      const d = new Date(time);
      if (d.getFullYear() !== year || d.getMonth() !== month) {
        return;
      }
      const idx = d.getDate() - 1;
      if (idx < 0 || idx >= daysInMonth) {
        return;
      }
      if (item.type === '사용') {
        expense[idx] += item.price;
      } else {
        income[idx] += item.price;
      }
    });

    const labels = Array.from({length: daysInMonth}, (_, i) => `${i + 1}`);
    // 차트에는 금액을 1,000으로 나눈 값(단위: 천원)을 사용
    const data = labels.map((_, i) => [expense[i] / 1000, income[i] / 1000]);
    const hasData = data.some(([e, inc]) => e !== 0 || inc !== 0);

    return {labels, data, hasData};
  }, [list]);

  type DailyGroup = {
    key: string;
    date: number;
    totalExpense: number;
    totalIncome: number;
    items: AccountBookHistory[];
  };

  const dailyGroups = useMemo<DailyGroup[]>(() => {
    const map = new Map<number, DailyGroup>();

    list.forEach(item => {
      const time = item.date !== 0 ? item.date : item.createdAt;
      if (!time) {
        return;
      }

      const d = new Date(time);
      d.setHours(0, 0, 0, 0);
      const dayTs = d.getTime();

      if (!map.has(dayTs)) {
        map.set(dayTs, {
          key: String(dayTs),
          date: dayTs,
          totalExpense: 0,
          totalIncome: 0,
          items: [],
        });
      }

      const group = map.get(dayTs)!;
      group.items.push(item);
      if (item.type === '사용') {
        group.totalExpense += item.price;
      } else {
        group.totalIncome += item.price;
      }
    });

    // 최신 날짜 순으로 정렬
    return Array.from(map.values()).sort((a, b) => b.date - a.date);
  }, [list]);

  const handleDelete = useCallback(
    (history: AccountBookHistory) => {
      if (typeof history.id === 'undefined') {
        return;
      }
      confirmDialog({
        title: '삭제',
        message: '해당 내역을 삭제하시겠어요?',
        confirmText: '삭제',
        onConfirm: async () => {
          await deleteItem(history.id as number);
          fetchList();
        },
      });
    },
    [deleteItem, fetchList],
  );
  const handleLogout = useCallback(async () => {
    confirmDialog({
      title: '로그아웃',
      message: '정말 로그아웃 하시겠습니까?',
      confirmText: '로그아웃',
      onConfirm: async () => {
        await signOut();
      },
    });
  }, [signOut]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <Header>
        <Header.Title title="가계부" />
        <Pressable onPress={handleLogout}>
          <FontAwesomeIcon
            icon={faSignOutAlt}
            size={20}
            color={colors.textSecondary}
          />
        </Pressable>
      </Header>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: spacing.horizontal,
            paddingVertical: 8,
          }}>
          <Typography variant="title" fontSize={18}>
            일별 통계 (
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
            })}
            , 단위: 천원)
          </Typography>
          <Pressable
            onPress={() => {
              if (list.length === 0) {
                Alert.alert('알림', '표시할 데이터가 없습니다.');
                return;
              }
              navigation.push('MonthlyAverage');
            }}>
            <Typography variant="caption" color={colors.primary}>
              자세히 보기
            </Typography>
          </Pressable>
        </View>
        {dailyChart.hasData ? (
          <ScrollView
            horizontal
            style={{backgroundColor: colors.backgroundSecondary}}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 8,
            }}>
            <StackedBarChartView
              labels={dailyChart.labels}
              data={dailyChart.data}
              width={Math.max(width, dailyChart.labels.length * 40)}
              height={220}
              hideLegend
            />
          </ScrollView>
        ) : (
          <EmptyState message="이번 달 일별 데이터가 없습니다." height={220} />
        )}
      </View>
      <FlatList
        data={dailyGroups}
        keyExtractor={item => item.key}
        renderItem={({item}) => {
          const dateLabel = convertToDateString(item.date).split(' ')[0];
          return (
            <View
              style={{
                paddingHorizontal: spacing.horizontal,
                paddingVertical: 12,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}>
                <Typography variant="bodyBold">{dateLabel}</Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  사용 {item.totalExpense.toLocaleString()}원 / 수입{' '}
                  {item.totalIncome.toLocaleString()}원
                </Typography>
              </View>

              {item.items.map(history => {
                const historyKey =
                  history.id !== undefined && history.id !== null
                    ? String(history.id)
                    : `${history.createdAt}-${history.comment}`;

                return (
                  <Swipeable
                    key={historyKey}
                    ref={ref => {
                      swipeableRefs.current.set(historyKey, ref);
                    }}
                    onSwipeableWillOpen={() => {
                      swipeableRefs.current.forEach((ref, key) => {
                        if (key !== historyKey && ref && ref.close) {
                          ref.close();
                        }
                      });
                    }}
                    renderRightActions={() => (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: 20,
                        }}>
                        <RectButton
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={() => handleDelete(history)}>
                          <FontAwesomeIcon
                            icon={faTrash}
                            size={20}
                            color={colors.danger}
                          />
                        </RectButton>
                      </View>
                    )}>
                    <AccountBookHistoryListItemView
                      item={history}
                      onPressItem={clicked => {
                        navigation.push('Detail', {item: clicked});
                      }}
                    />
                  </Swipeable>
                );
              })}
            </View>
          );
        }}
      />

      <Pressable
        style={{
          position: 'absolute',
          right: 12,
          bottom: 12 + safeAreaInset.bottom,
        }}
        onPress={() => {
          navigation.push('Add', {});
        }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <FontAwesomeIcon icon={faPlus} size={30} color="white" />
        </View>
      </Pressable>
    </SafeAreaView>
  );
};
