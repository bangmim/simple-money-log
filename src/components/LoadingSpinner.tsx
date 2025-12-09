import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../theme/colors';
import LottieView from 'lottie-react-native';
import {scaleWidth} from '../utils/responsive';

export const LoadingSpinner: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <LottieView
          source={require('../../assets/animations/loading_spinner.json')}
          autoPlay
          loop
          style={styles.spinner}
          speed={1.0}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: scaleWidth(100), // 캐릭터 크기에 맞춰 조절
    height: scaleWidth(100),
  },
});
