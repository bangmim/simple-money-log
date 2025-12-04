import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React from 'react';
import {MainScreen} from '../screens/MainScreen';
import {AddUpdateScreen} from '../screens/AddUpdateScreen';
import {MonthlyScreen} from '../screens/MonthlyScreen';
import {DetailScreen} from '../screens/DetailScreen';
import {AccountBookHistory} from '../data/AccountBookHistory';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {CalendarSelectScreen} from '../screens/CalendarSelectScreen';
import {TakePhotoScreen} from '../screens/TakePhotoScreen';
import {SelectPhotoScreen} from '../screens/SelectPhotoScreen';

type ScreenParams = {
  // 받을 data 형태
  Add: undefined;
  Main: undefined;
  Update: {
    item: AccountBookHistory;
    onChangeData: (nextItem: AccountBookHistory) => void;
  };
  Detail: {item: AccountBookHistory};
  MonthlyAverage: undefined;
  CalendarSelect: {onSelectDay: (date: number) => void};
  TakePhoto: {onTakePhoto: (url: string) => void};
  SelectPhoto: {onSelectPhoto: (url: string) => void};
};

const Stack = createNativeStackNavigator();

export const RootNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, presentation: 'containedModal'}}>
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="Add" component={AddUpdateScreen} />
      <Stack.Screen name="Update" component={AddUpdateScreen} />
      <Stack.Screen name="MonthlyAverage" component={MonthlyScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="CalendarSelect" component={CalendarSelectScreen} />
      <Stack.Screen name="TakePhoto" component={TakePhotoScreen} />
      <Stack.Screen name="SelectPhoto" component={SelectPhotoScreen} />
    </Stack.Navigator>
  );
};

// 화면이동 navigation 타입정리

// RouteName을 받아올건데, ScreenParams에 있는 키 값 중에 있는 것으로만 넣을 수 있다
export const useRootNavigation = <RouteName extends keyof ScreenParams>() =>
  useNavigation<NativeStackNavigationProp<ScreenParams, RouteName>>();

export const useRootRoute = <RouteName extends keyof ScreenParams>() =>
  useRoute<RouteProp<ScreenParams, RouteName>>();
