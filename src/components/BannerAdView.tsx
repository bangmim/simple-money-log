import React, {useEffect, useState} from 'react';
import {Platform, View, useWindowDimensions} from 'react-native';
import mobileAds, {
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import {scaleWidth} from '../utils/responsive';

// 개발 중에는 테스트 광고 ID 사용, 프로덕션에서는 실제 광고 ID로 변경
const AD_UNIT_ID = __DEV__
  ? 'ca-app-pub-3940256099942544/6300978111' // Google 테스트 배너 광고 ID
  : 'ca-app-pub-6066778698509308/7282939667'; // 실제 광고 ID

export const BannerAdView: React.FC = () => {
  const {width} = useWindowDimensions();
  const [isAdMobAvailable, setIsAdMobAvailable] = useState(false);

  useEffect(() => {
    // AdMob은 Android에서만 사용
    if (Platform.OS !== 'android') {
      // console.log('[BannerAdView] Not Android, skipping AdMob initialization');
      return;
    }

    // console.log('[BannerAdView] Starting AdMob initialization...');
    try {
      mobileAds()
        .initialize()
        .then(() => {
          // console.log(
          //   '[BannerAdView] AdMob initialized successfully',
          //   adapterStatuses,
          // );
          setIsAdMobAvailable(true);
        })
        .catch(() => {
          // console.warn('[BannerAdView] AdMob initialization failed:', error);
          setIsAdMobAvailable(false);
        });
    } catch (error) {
      // console.warn('[BannerAdView] AdMob module not available:', error);
      setIsAdMobAvailable(false);
    }
  }, []);

  if (Platform.OS !== 'android') {
    // console.log('[BannerAdView] Not Android platform, returning null');
    return null;
  }

  if (!isAdMobAvailable) {
    // console.log('[BannerAdView] AdMob not available yet, returning null');
    return null;
  }

  return (
    <View
      style={{
        alignItems: 'center',
        marginTop: scaleWidth(16),
        marginBottom: scaleWidth(8),
        paddingHorizontal: scaleWidth(16),
      }}>
      <View
        style={{
          width: width - scaleWidth(32),
          overflow: 'hidden',
        }}>
        <BannerAd
          unitId={AD_UNIT_ID}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdLoaded={() => {
            // console.log('[BannerAdView] Ad loaded successfully');
          }}
          onAdFailedToLoad={() => {
            // console.error('[BannerAdView] Ad failed to load:', error);
          }}
        />
      </View>
    </View>
  );
};
