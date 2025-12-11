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

/**
 * 아이콘 사이즈 상수
 */
export const iconSizes = {
  // 일반 X 버튼 (닫기 버튼)
  closeButton: scaleWidth(18),
  // HeaderIcon (헤더용 X 버튼)
  headerCloseButton: scaleWidth(20),
  // PhotoPicker 작은 X 버튼 (이미지 위 작은 버튼)
  photoPickerCloseButton: scaleWidth(16),
};

/**
 * 기본 마진값 상수
 */
export const margins = {
  // 기본 마진
  default: scaleWidth(12),
  // 작은 마진
  small: scaleWidth(8),
  // 중간 마진
  medium: scaleWidth(16),
  // 큰 마진
  large: scaleWidth(24),
};
