import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {InterstitialAd, AdEventType} from 'react-native-google-mobile-ads';

const AD_UNIT_ID = __DEV__
  ? 'ca-app-pub-3940256099942544/1033173712' // Google 테스트 전면 광고 ID
  : 'ca-app-pub-6066778698509308/1843174055'; // 실제 전면 광고 ID (AdMob에서 전면 광고 단위 생성 후 ID 입력)

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
          setIsAdLoaded(true);
        },
      );

      const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, () => {
        setIsAdLoaded(false);
      });

      const unsubscribeClosed = ad.addAdEventListener(
        AdEventType.CLOSED,
        () => {
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
    } catch (error) {}
  }, []);

  const showAd = () => {
    if (Platform.OS !== 'android' || !interstitialAd || !isAdLoaded) {
      return false;
    }

    try {
      interstitialAd.show();
      return true;
    } catch (error) {
      return false;
    }
  };

  return {showAd, isAdLoaded};
};
