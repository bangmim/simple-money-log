import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {Header} from '../components/Header/Header';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {AccountBookHistory} from '../data/AccountBookHistory';
import {useRootNavigation} from '../navigations/RootNavigation';
import {AccountBookHistoryListItemView} from '../components/AccountHistoryListItemView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SQLite from 'react-native-sqlite-storage';
import {useAccountBookHistoryItem} from '../hooks/useAccountBookHistoryItem';
import {useFocusEffect} from '@react-navigation/native';
import {StackedBarChart} from 'react-native-chart-kit';

export const MainScreen: React.FC = () => {
  const safeAreaInset = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  useEffect(() => {
    SQLite.openDatabase(
      {
        name: 'accoutn_history.db',
        createFromLocation: '~www/account_history.db',
        location: 'default',
      },
      () => {
        console.log('open Success');
      },
      () => {
        console.log('open Failure');
      },
    );
  }, []);

  const navigation = useRootNavigation();
  const [list, setList] = useState<AccountBookHistory[]>([]);
  //   const [list] = useState<AccountBookHistory[]>([]);
  const {getList} = useAccountBookHistoryItem();

  const fetchList = useCallback(async () => {
    const data = await getList();
    setList(data);
  }, [getList]);

  useFocusEffect(
    useCallback(() => {
      fetchList();
    }, [fetchList]),
  );
  return (
    <View style={{flex: 1}}>
      <Header>
        <Header.Title title="Main SCREEN"></Header.Title>
      </Header>

      <FlatList
        data={list}
        ListHeaderComponent={
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}>
              <Text style={{fontSize: 18, fontWeight: '600'}}>월별 통계</Text>
              <Pressable
                onPress={() => {
                  navigation.push('MonthlyAverage');
                }}>
                <Text style={{color: 'blue', fontSize: 14}}>자세히 보기</Text>
              </Pressable>
            </View>
            <StackedBarChart
              data={{
                labels: ['10월', '11월', '12월'],
                legend: ['사용', '수입'],
                data: [
                  [60, 60],
                  [30, 30],
                  [130, 130],
                ],
                barColors: ['#dfe4ea', '#a4b0be'],
              }}
              hideLegend
              width={width}
              height={220}
              chartConfig={{
                backgroundColor: 'white',
                backgroundGradientFrom: 'lightgray',
                backgroundGradientTo: 'gray',
                color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              }}
            />
          </View>
        }
        renderItem={({item}) => {
          return (
            <AccountBookHistoryListItemView
              item={item}
              onPressItem={clicked => {
                console.log('clickedItem', clicked);
                navigation.push('Detail', {item: clicked});
              }}
            />
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
          navigation.push('Add');
        }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <FontAwesomeIcon icon={faPlus} size={30} color="white" />
        </View>
      </Pressable>
    </View>
  );
};
