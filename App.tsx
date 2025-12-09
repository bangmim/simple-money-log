import 'react-native-url-polyfill/auto';
import {NavigationContainer} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {RootNavigation} from './src/navigations/RootNavigation';
import {SplashScreen} from './src/components/SplashScreen';
import {useAuth} from './src/hooks/useAuth';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {loading} = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [minDisplayTimeElapsed, setMinDisplayTimeElapsed] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // 최소 표시 시간 (1.5초)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinDisplayTimeElapsed(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // 인증 로딩이 완료되고 최소 표시 시간이 지나면 스플래시 숨기기
  useEffect(() => {
    if (!loading && minDisplayTimeElapsed) {
      setShowSplash(false);
    }
  }, [loading, minDisplayTimeElapsed]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <NavigationContainer>
          <RootNavigation />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
