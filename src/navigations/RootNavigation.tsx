import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React, {useEffect, useRef} from 'react';
import {MainScreen} from '../screens/MainScreen';
import {AddUpdateScreen} from '../screens/AddUpdateScreen';
import {MonthlyScreen} from '../screens/MonthlyScreen';
import {DetailScreen} from '../screens/DetailScreen';
import {
  RouteProp,
  useNavigation,
  useRoute,
  useNavigationState,
} from '@react-navigation/native';
import {CalendarSelectScreen} from '../screens/CalendarSelectScreen';
import {TakePhotoScreen} from '../screens/TakePhotoScreen';
import {SelectPhotoScreen} from '../screens/SelectPhotoScreen';
import {LoginScreen} from '../screens/LoginScreen';
import {MyPageScreen} from '../screens/MyPageScreen';
import {useAuth} from '../hooks/useAuth';
import {useInterstitialAd} from '../hooks/useInterstitialAd';
import {ScreenParams, ROUTES} from './routes';

const Stack = createNativeStackNavigator();

export const RootNavigation = () => {
  const {isAuthenticated, loading} = useAuth();
  const {showAd, isAdLoaded} = useInterstitialAd();
  const navigationState = useNavigationState(state => state);
  const lastRouteNameRef = useRef<string | undefined>(undefined);
  const adShowCountRef = useRef(0);

  useEffect(() => {
    if (!navigationState) {
      return;
    }

    const currentRoute = navigationState.routes[navigationState.index];
    const currentRouteName = currentRoute?.name;

    // 로그인 화면에서는 광고 표시 안 함
    if (currentRouteName === ROUTES.LOGIN) {
      lastRouteNameRef.current = currentRouteName;
      return;
    }

    // 이전 화면과 다른 화면으로 이동했을 때만 광고 표시
    if (
      lastRouteNameRef.current &&
      lastRouteNameRef.current !== currentRouteName &&
      isAdLoaded
    ) {
      // 일정 확률로 광고 표시 (30% 확률)
      const shouldShowAd = Math.random() < 0.3;

      if (shouldShowAd) {
        // 약간의 지연 후 광고 표시 (화면 전환 애니메이션 완료 후)
        setTimeout(() => {
          const shown = showAd();
          if (shown) {
            adShowCountRef.current += 1;
            console.log(
              '[RootNavigation] Interstitial ad shown, count:',
              adShowCountRef.current,
            );
          }
        }, 500);
      }
    }

    lastRouteNameRef.current = currentRouteName;
  }, [navigationState, isAdLoaded, showAd]);

  if (loading) {
    // 로딩 중일 때는 아무것도 표시하지 않거나 로딩 화면 표시
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, presentation: 'containedModal'}}>
      {!isAuthenticated ? (
        <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name={ROUTES.MAIN} component={MainScreen} />
          <Stack.Screen name={ROUTES.ADD} component={AddUpdateScreen} />
          <Stack.Screen name={ROUTES.UPDATE} component={AddUpdateScreen} />
          <Stack.Screen
            name={ROUTES.MONTHLY_AVERAGE}
            component={MonthlyScreen}
          />
          <Stack.Screen name={ROUTES.DETAIL} component={DetailScreen} />
          <Stack.Screen name={ROUTES.MY_PAGE} component={MyPageScreen} />
          <Stack.Screen
            name={ROUTES.CALENDAR_SELECT}
            component={CalendarSelectScreen}
            options={{presentation: 'transparentModal', animation: 'fade'}}
          />
          <Stack.Screen name={ROUTES.TAKE_PHOTO} component={TakePhotoScreen} />
          <Stack.Screen
            name={ROUTES.SELECT_PHOTO}
            component={SelectPhotoScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export const useRootNavigation = <RouteName extends keyof ScreenParams>() =>
  useNavigation<NativeStackNavigationProp<ScreenParams, RouteName>>();

export const useRootRoute = <RouteName extends keyof ScreenParams>() =>
  useRoute<RouteProp<ScreenParams, RouteName>>();
