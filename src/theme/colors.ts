/**
 * 앱 전체에서 사용하는 색상 상수
 * 가계부 앱에 적합한 색상 팔레트
 */

// 옵션 1: 블루 계열 (신뢰감, 안정감) - 추천
export const colors = {
  // Primary Colors
  primary: '#4A90E2', // 부드러운 블루
  primaryDark: '#357ABD', // 진한 블루
  primaryLight: '#6BA3E8', // 밝은 블루

  // Secondary Colors
  secondary: '#7B68EE', // 미디엄 슬레이트 블루
  secondaryDark: '#5B4FC7',
  secondaryLight: '#9B88F0',

  // Accent Colors
  accent: '#50C878', // 성공/수입 색상
  danger: '#FF6B6B', // 위험/지출 색상
  warning: '#FFA500',
  info: '#4ECDC4',

  // Neutral Colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F7FA',
  backgroundTertiary: '#E8ECF0',

  // Text Colors
  textPrimary: '#1A1A1A',
  textSecondary: '#6C757D',
  textTertiary: '#ADB5BD',
  textInverse: '#FFFFFF',

  // Border Colors
  border: '#DEE2E6',
  borderFocused: '#4A90E2',
  borderLight: '#E9ECEF',

  // Chart Colors
  chartExpense: '#FF6B6B', // 지출
  chartIncome: '#50C878', // 수입
};

// 옵션 2: 그린 계열 (돈, 성장, 긍정적)
export const colorsGreen = {
  // Primary Colors
  primary: '#2ECC71', // 성공 그린
  primaryDark: '#27AE60',
  primaryLight: '#58D68D',
  // Secondary Colors
  secondary: '#16A085', // 틸 그린
  secondaryDark: '#138D75',
  secondaryLight: '#48C9B0',
  // Accent Colors
  accent: '#F39C12', // 골드
  danger: '#E74C3C',
  warning: '#FFA500',
  info: '#4ECDC4',
  // Neutral Colors
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundTertiary: '#E8ECF0',
  // Text Colors
  textPrimary: '#1A1A1A',
  textSecondary: '#6C757D',
  textTertiary: '#ADB5BD',
  textInverse: '#FFFFFF',
  // Border Colors
  border: '#DEE2E6',
  borderFocused: '#2ECC71',
  borderLight: '#E9ECEF',
  // Chart Colors
  chartExpense: '#E74C3C', // 지출
  chartIncome: '#2ECC71', // 수입
};

// 옵션 3: 퍼플 계열 (프리미엄, 세련됨)
export const colorsPurple = {
  // Primary Colors
  primary: '#9B59B6', // 퍼플
  primaryDark: '#7D3C98',
  primaryLight: '#BB8FCE',
  // Secondary Colors
  secondary: '#6C5CE7', // 인디고
  secondaryDark: '#5A4FCF',
  secondaryLight: '#8B7FEF',
  // Accent Colors
  accent: '#00B894', // 틸
  danger: '#E74C3C',
  warning: '#FFA500',
  info: '#4ECDC4',
  // Neutral Colors
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundTertiary: '#E8ECF0',
  // Text Colors
  textPrimary: '#1A1A1A',
  textSecondary: '#6C757D',
  textTertiary: '#ADB5BD',
  textInverse: '#FFFFFF',
  // Border Colors
  border: '#DEE2E6',
  borderFocused: '#9B59B6',
  borderLight: '#E9ECEF',
  // Chart Colors
  chartExpense: '#E74C3C', // 지출
  chartIncome: '#00B894', // 수입
};

// 옵션 4: 다크 모던 (미니멀, 모던)
export const colorsDark = {
  primary: '#2C3E50', // 다크 블루 그레이
  primaryDark: '#1A252F',
  primaryLight: '#34495E',
  secondary: '#95A5A6', // 라이트 그레이
  accent: '#3498DB', // 블루
  danger: '#E74C3C',
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  textPrimary: '#1A1A1A',
  textSecondary: '#6C757D',
  border: '#DEE2E6',
  borderFocused: '#2C3E50',
  chartExpense: '#E74C3C',
  chartIncome: '#3498DB',
};

// 현재 사용할 색상 팔레트 (옵션 1: 블루 계열 - 기본)
export default colors;
