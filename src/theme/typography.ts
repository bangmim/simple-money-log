/**
 * 앱 전체에서 사용하는 타이포그래피 상수
 */
import {Platform} from 'react-native';

// 프리텐다드 폰트 설정
// iOS는 'Pretendard', Android는 'Pretendard-Regular' 또는 시스템 폰트 사용
export const fontFamily = Platform.select({
  ios: 'Pretendard',
  android: 'Pretendard-Regular',
  default: 'System',
});

// 폰트가 없을 경우를 대비한 fallback
export const getFontFamily = () => {
  return fontFamily || 'System';
};

// 텍스트 스타일 헬퍼
// React Native에서 fontWeight는 숫자 문자열 또는 'normal', 'bold'를 지원
// Regular: 400, Medium: 500, SemiBold: 600, Bold: 700
// iOS는 숫자 문자열 지원, Android는 'normal', 'bold'만 확실히 지원
export const textStyles = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const, // Bold
    fontFamily: getFontFamily(),
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const, // Bold
    fontFamily: getFontFamily(),
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const, // SemiBold
    fontFamily: getFontFamily(),
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const, // Regular
    fontFamily: getFontFamily(),
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const, // Medium
    fontFamily: getFontFamily(),
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '700' as const, // Bold
    fontFamily: getFontFamily(),
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const, // Regular
    fontFamily: getFontFamily(),
  },
  captionMedium: {
    fontSize: 14,
    fontWeight: '500' as const, // Medium
    fontFamily: getFontFamily(),
  },
  captionBold: {
    fontSize: 14,
    fontWeight: '700' as const, // Bold
    fontFamily: getFontFamily(),
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const, // Regular
    fontFamily: getFontFamily(),
  },
  // 추가 스타일
  title: {
    fontSize: 18,
    fontWeight: '600' as const, // SemiBold
    fontFamily: getFontFamily(),
  },
};
