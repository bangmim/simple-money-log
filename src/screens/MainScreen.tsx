import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import {Header} from '../components/Header/Header';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faPlus,
  faTrash,
  faUser,
  faChevronLeft,
  faChevronRight,
  faCalendarAlt,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
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
import {spacing, iconSizes} from '../theme/spacing';
import {Typography} from '../components/Typography';
import {scaleWidth} from '../utils/responsive';
import {BannerAdView} from '../components/BannerAdView';
import {supabase} from '../config/supabase';
import {ROUTES} from '../navigations/routes';

export const MainScreen: React.FC = () => {
  const safeAreaInset = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const navigation = useRootNavigation();
  const {user, isNewlyRegistered, setIsNewlyRegistered} = useAuth();
  const [list, setList] = useState<AccountBookHistory[]>([]);
  const [nickname, setNickname] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth(),
  );
  const [showMonthSelector, setShowMonthSelector] = useState<boolean>(false);
  const {getList, deleteItem} = useAccountBookHistoryItem();
  const swipeableRefs = useRef<Map<string, Swipeable | null>>(
    new Map<string, Swipeable | null>(),
  );
  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getList();
      setList(data);
    } finally {
      setLoading(false);
    }
  }, [getList]);

  useFocusEffect(
    useCallback(() => {
      fetchList();
      // 회원가입 직후 플래그 리셋 (다음 포커스부터는 광고 표시)
      if (isNewlyRegistered) {
        setIsNewlyRegistered(false);
      }
    }, [fetchList, isNewlyRegistered, setIsNewlyRegistered]),
  );

  // 닉네임 가져오기
  useEffect(() => {
    const fetchNickname = async () => {
      if (!user?.id) {
        return;
      }

      // 1. user_metadata에서 먼저 확인
      const metadataNickname = user.user_metadata?.nickname;
      if (metadataNickname) {
        setNickname(metadataNickname);
        return;
      }

      // 2. users 테이블에서 가져오기
      try {
        const {data, error} = await supabase
          .from('users')
          .select('nickname')
          .eq('id', user.id)
          .single();

        if (!error && data?.nickname) {
          setNickname(data.nickname);
        }
      } catch (error) {
        console.warn('Failed to fetch nickname:', error);
      }
    };

    fetchNickname();
  }, [user]);

  const dailyChart = useMemo(() => {
    // 선택한 달 1일부터 말일까지 일별 통계 (단위: 천원)
    const year = selectedYear;
    const month = selectedMonth;

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
      if (item.type === '지출') {
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
  }, [list, selectedYear, selectedMonth]);

  type DailyGroup = {
    key: string;
    date: number;
    totalExpense: number;
    totalIncome: number;
    items: AccountBookHistory[];
  };

  const dailyGroups = useMemo<DailyGroup[]>(() => {
    const map = new Map<number, DailyGroup>();
    const year = selectedYear;
    const month = selectedMonth;

    list.forEach(item => {
      const time = item.date !== 0 ? item.date : item.createdAt;
      if (!time) {
        return;
      }

      const d = new Date(time);
      // 선택한 달 데이터만 표시
      if (d.getFullYear() !== year || d.getMonth() !== month) {
        return;
      }
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
      if (item.type === '지출') {
        group.totalExpense += item.price;
      } else {
        group.totalIncome += item.price;
      }
    });

    // 최신 날짜 순으로 정렬
    return Array.from(map.values()).sort((a, b) => b.date - a.date);
  }, [list, selectedYear, selectedMonth]);

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
  const handleMyPage = useCallback(() => {
    navigation.push(ROUTES.MY_PAGE);
  }, [navigation]);

  const handlePreviousMonth = useCallback(() => {
    if (selectedMonth === 0) {
      setSelectedYear(selectedYear - 1);
      setSelectedMonth(11);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  }, [selectedYear, selectedMonth]);

  const handleNextMonth = useCallback(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // 다음 달로 이동 가능한지 확인 (현재 달까지만)
    if (selectedYear > currentYear) {
      return;
    }
    if (selectedYear === currentYear && selectedMonth >= currentMonth) {
      return;
    }

    if (selectedMonth === 11) {
      setSelectedYear(selectedYear + 1);
      setSelectedMonth(0);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  }, [selectedYear, selectedMonth]);

  const handleResetToCurrentMonth = useCallback(() => {
    const now = new Date();
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth());
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <Header>
        <Header.Title title={nickname ? `${nickname}님의 가계부` : '가계부'} />
        <View style={{flexDirection: 'row', gap: scaleWidth(16)}}>
          <Pressable
            onPress={() => setShowMonthSelector(!showMonthSelector)}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <FontAwesomeIcon
              icon={faCalendarAlt}
              size={20}
              color={
                showMonthSelector
                  ? colors.primary
                  : selectedYear !== new Date().getFullYear() ||
                    selectedMonth !== new Date().getMonth()
                  ? colors.primary
                  : colors.textSecondary
              }
            />
          </Pressable>
          <Pressable
            onPress={handleMyPage}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <FontAwesomeIcon
              icon={faUser}
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>
      </Header>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <FlatList
            data={dailyGroups}
            keyExtractor={item => item.key}
            contentContainerStyle={{paddingBottom: scaleWidth(80)}}
            ListHeaderComponent={
              <View>
                {/* 월 선택 헤더 - showMonthSelector가 true일 때만 표시 */}
                {showMonthSelector && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: spacing.horizontal,
                      paddingVertical: spacing.medium,
                      backgroundColor: colors.backgroundSecondary,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.borderLight,
                    }}>
                    <Pressable
                      onPress={handlePreviousMonth}
                      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                      style={{
                        padding: scaleWidth(8),
                      }}>
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        size={20}
                        color={colors.textPrimary}
                      />
                    </Pressable>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: scaleWidth(8),
                      }}>
                      <Typography variant="bodyBold" fontSize={18}>
                        {new Date(
                          selectedYear,
                          selectedMonth,
                          1,
                        ).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </Typography>
                      {selectedYear !== new Date().getFullYear() ||
                      selectedMonth !== new Date().getMonth() ? (
                        <Pressable
                          onPress={() => {
                            handleResetToCurrentMonth();
                            setShowMonthSelector(false);
                          }}
                          style={{
                            paddingHorizontal: scaleWidth(12),
                            paddingVertical: scaleWidth(6),
                            borderRadius: 8,
                            backgroundColor: colors.primary + '20',
                          }}>
                          <Typography
                            variant="caption"
                            color={colors.primary}
                            style={{fontWeight: '600'}}>
                            이번 달로
                          </Typography>
                        </Pressable>
                      ) : null}
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: scaleWidth(8),
                      }}>
                      <Pressable
                        onPress={handleNextMonth}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        disabled={
                          selectedYear > new Date().getFullYear() ||
                          (selectedYear === new Date().getFullYear() &&
                            selectedMonth >= new Date().getMonth())
                        }
                        style={{
                          padding: scaleWidth(8),
                          opacity:
                            selectedYear > new Date().getFullYear() ||
                            (selectedYear === new Date().getFullYear() &&
                              selectedMonth >= new Date().getMonth())
                              ? 0.3
                              : 1,
                        }}>
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          size={20}
                          color={colors.textPrimary}
                        />
                      </Pressable>
                      <Pressable
                        onPress={() => setShowMonthSelector(false)}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        style={{
                          padding: scaleWidth(8),
                          marginLeft: scaleWidth(4),
                        }}>
                        <FontAwesomeIcon
                          icon={faTimes}
                          size={iconSizes.closeButton}
                          color={colors.textSecondary}
                        />
                      </Pressable>
                    </View>
                  </View>
                )}

                {/* 현재 선택된 월 표시 (월 선택 UI가 닫혀있을 때만) */}
                {!showMonthSelector && (
                  <View
                    style={{
                      paddingHorizontal: spacing.horizontal,
                      paddingVertical: scaleWidth(8),
                      backgroundColor: colors.background,
                    }}>
                    <Typography
                      variant="body"
                      color={colors.textSecondary}
                      fontSize={14}>
                      {new Date(
                        selectedYear,
                        selectedMonth,
                        1,
                      ).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                      })}
                      {selectedYear !== new Date().getFullYear() ||
                      selectedMonth !== new Date().getMonth() ? (
                        <Typography
                          variant="caption"
                          color={colors.primary}
                          style={{marginLeft: scaleWidth(4)}}>
                          {' '}
                          (이번 달 아님)
                        </Typography>
                      ) : null}
                    </Typography>
                  </View>
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: spacing.horizontal,
                    paddingVertical: 8,
                  }}>
                  <Typography variant="title" fontSize={18}>
                    일별 통계 (단위: 천원)
                  </Typography>
                  <Pressable
                    onPress={() => {
                      if (list.length === 0) {
                        Alert.alert('알림', '표시할 데이터가 없습니다.');
                        return;
                      }
                      navigation.push(ROUTES.MONTHLY_AVERAGE);
                    }}>
                    <Typography variant="caption" color={colors.primary}>
                      자세히 보기
                    </Typography>
                  </Pressable>
                </View>
                {dailyChart.hasData ? (
                  <ScrollView
                    horizontal
                    style={{backgroundColor: '#fff'}}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    contentContainerStyle={{
                      paddingVertical: 8,
                      paddingHorizontal: scaleWidth(24),
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
                  <EmptyState
                    message={`${new Date(
                      selectedYear,
                      selectedMonth,
                      1,
                    ).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                    })} 일별 데이터가 없습니다.`}
                    height={220}
                  />
                )}

                {!isNewlyRegistered && <BannerAdView />}
              </View>
            }
            renderItem={({item}) => {
              const dateLabel = convertToDateString(item.date).split(' ')[0];
              return (
                <View
                  style={{
                    paddingVertical: 12,
                  }}>
                  <Pressable
                    onPress={() => {
                      navigation.push(ROUTES.ADD, {selectedDate: item.date});
                    }}
                    style={({pressed}) => [
                      {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8,
                        paddingVertical: scaleWidth(4),
                        paddingHorizontal: spacing.horizontal,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}>
                    <Typography variant="bodyBold">{dateLabel}</Typography>
                    <Typography variant="caption" color={colors.textSecondary}>
                      지출 {item.totalExpense.toLocaleString()}원 / 수입{' '}
                      {item.totalIncome.toLocaleString()}원
                    </Typography>
                  </Pressable>

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
                            navigation.push(ROUTES.DETAIL, {item: clicked});
                          }}
                        />
                      </Swipeable>
                    );
                  })}
                </View>
              );
            }}
            showsVerticalScrollIndicator={true}
          />
          <Pressable
            style={{
              position: 'absolute',
              right: scaleWidth(12),
              bottom: scaleWidth(12) + safeAreaInset.bottom + scaleWidth(80), // 배너 광고 높이 고려 (약 80px)
            }}
            onPress={() => {
              navigation.push(ROUTES.ADD, {});
            }}>
            <View
              style={{
                width: scaleWidth(50),
                height: scaleWidth(50),
                borderRadius: scaleWidth(25),
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FontAwesomeIcon
                icon={faPlus}
                size={scaleWidth(30)}
                color="white"
              />
            </View>
          </Pressable>
        </>
      )}
      {!isNewlyRegistered && <BannerAdView />}
    </SafeAreaView>
  );
};
