/**
 * 앱 전체에서 사용하는 간격 상수
 */
import {scaleWidth} from '../utils/responsive';

export const spacing = {
  // 기본 좌우 여백
  horizontal: scaleWidth(24),
  // 기본 상하 여백
  vertical: scaleWidth(16),
  // 작은 간격
  small: scaleWidth(8),
  // 중간 간격
  medium: scaleWidth(16),
  // 큰 간격
  large: scaleWidth(24),
  // 매우 큰 간격
  xlarge: scaleWidth(32),
};

