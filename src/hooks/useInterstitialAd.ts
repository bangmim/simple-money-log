import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {InterstitialAd, AdEventType} from 'react-native-google-mobile-ads';

// 개발 중에는 테스트 광고 ID 사용, 프로덕션에서는 실제 광고 ID로 변경
const AD_UNIT_ID = __DEV__
  ? 'ca-app-pub-3940256099942544/1033173712' // Google 테스트 전면 광고 ID
  : 'ca-app-pub-6066778698509308/7282939667'; // 실제 전면 광고 ID (실제 ID로 변경 필요)

export const useInterstitialAd = () => {
  const [interstitialAd, setInterstitialAd] = useState<InterstitialAd | null>(
    null,
  );
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      const ad = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
        requestNonPersonalizedAdsOnly: true,
      });

      const unsubscribeLoaded = ad.addAdEventListener(
        AdEventType.LOADED,
        () => {
          console.log('[InterstitialAd] Ad loaded');
          setIsAdLoaded(true);
        },
      );

      const unsubscribeError = ad.addAdEventListener(
        AdEventType.ERROR,
        error => {
          console.warn('[InterstitialAd] Ad error:', error);
          setIsAdLoaded(false);
        },
      );

      const unsubscribeClosed = ad.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          console.log('[InterstitialAd] Ad closed');
          setIsAdLoaded(false);
          // 광고가 닫힌 후 새로운 광고 로드
          ad.load();
        },
      );

      // 초기 로드
      ad.load();
      setInterstitialAd(ad);

      return () => {
        unsubscribeLoaded();
        unsubscribeError();
        unsubscribeClosed();
      };
    } catch (error) {
      console.warn('[InterstitialAd] Failed to create ad:', error);
    }
  }, []);

  const showAd = () => {
    if (Platform.OS !== 'android' || !interstitialAd || !isAdLoaded) {
      console.log('[InterstitialAd] Ad not ready to show');
      return false;
    }

    try {
      interstitialAd.show();
      return true;
    } catch (error) {
      console.warn('[InterstitialAd] Failed to show ad:', error);
      return false;
    }
  };

  return {showAd, isAdLoaded};
};
