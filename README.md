## 딱,가계부 📒

**React Native 기반 가계부 앱으로, 월별 지출/수입을 Supabase로 관리하고 차트와 캘린더로 시각화한 프로젝트입니다.**  
포트폴리오용으로 설계/구현 과정을 잘 드러내기 위해 화면 구성, 아키텍처, 사용 기술을 정리했습니다.

## 구현 영상 (Preview)

| <img src="src/assets/preview.gif" width="300" /> |
[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/shorts/0iPpcSba0NE)

---

### 주요 기능 (Features)

- **로그인 화면**

  - 이메일/사용자명과 비밀번호로 로그인
  - 회원가입 기능 제공
  - Supabase 인증 연동

- **대시보드(메인 화면)**

  - 이번 달 **총 지출/수입 합계** 표시
  - 월별 통계 화면으로 이동 버튼 제공
  - 이번 달 사용 내역 리스트 노출
  - 하단 **`+` Floating Button** 을 통해 내역 추가 화면 이동
  - 리스트 아이템 탭 시 **상세 화면** 이동

- **내역 등록 화면**

  - **지출 / 수입 토글**로 타입 선택
  - 사용 내용(메모) 입력
  - 날짜/시간 선택을 위한 **DatePicker** 활용
  - 이미지 영역 터치 시 **카메라 촬영** (`react-native-vision-camera`)
    - 이미지가 없으면 **`+` 아이콘** 노출
  - 금액 입력 및 **등록 버튼**으로 Supabase DB에 저장

- **상세 화면**

  - 지출/수입 타입, 내용, 일시, 금액, 이미지 등 **저장된 상세 내역 조회**
  - **수정하기 버튼**으로 수정 화면 이동
  - **삭제 버튼** 클릭 시 한번 더 확인 후 삭제 처리

- **수정 화면**

  - 지출/수입 타입은 고정(변경 불가)
  - 내용, 일시, 이미지, 금액 수정 가능
  - 이미지가 없는 경우 **`+` 아이콘** 노출
  - **수정 완료 버튼**으로 Supabase DB 업데이트

- **월별 통계 화면**
  - **최근 3개월** 월별 사용 데이터를 **막대 그래프(Bar Chart)** 로 시각화
  - 각 월별 데이터 안에 **지출과 수입을 구분**하여 표시
  - 월 선택 시 해당 월 내역과 함께 통계 확인 가능

---

### 기술 스택 (Tech Stack)

- **Framework**

  - React 18, React Native 0.73
  - TypeScript

- **네비게이션**

  - `@react-navigation/native`
  - `@react-navigation/native-stack`
  - `@react-navigation/stack`

- **UI & UX**

  - `react-native-screens`, `react-native-safe-area-context`
  - 커스텀 컴포넌트: 버튼, 헤더, 입력 필드, 탭 아이콘 등 (`src/components`)

- **아이콘 & 그래픽**

  - `@fortawesome/react-native-fontawesome`
  - `@fortawesome/fontawesome-svg-core`
  - `@fortawesome/free-solid-svg-icons`
  - `react-native-svg`

- **차트 & 캘린더**

  - `react-native-chart-kit` (막대 그래프)
  - `react-native-calendars` (날짜 선택 / 캘린더 UI)

- **카메라 & 갤러리**

  - `react-native-vision-camera`
  - `@react-native-camera-roll/camera-roll`

- **데이터베이스 & 인증**

  - `@supabase/supabase-js` (Supabase 클라이언트)
  - `@react-native-async-storage/async-storage` (세션 저장)

- **광고**

  - `react-native-google-mobile-ads` (Google Mobile Ads)

- **테스트 & 품질**
  - Jest, React Test Renderer
  - ESLint, Prettier

---

### 아키텍처 & 디렉토리 구조

- **`App.tsx`**

  - `NavigationContainer` 와 `RootNavigation` 을 감싸는 루트 컴포넌트
  - 다크 모드 대응(`useColorScheme`) 및 `StatusBar` 설정

- **`src/`**

  - **`components/`**: 공통 UI 컴포넌트 (버튼, 헤더, 입력, 리스트 아이템 등)
  - **`screens/`**:
    - `LoginScreen`: 로그인/회원가입 화면
    - `MainScreen`: 이번 달 요약 및 리스트
    - `AddUpdateScreen`: 등록/수정 화면
    - `DetailScreen`: 상세 화면
    - `CalendarSelectScreen`: 날짜 선택 화면
    - `MonthlyScreen`: 월별 통계 화면
    - `TakePhotoScreen`: 촬영 화면
    - `SelectPhotoScreen`: 사진 선택 화면
  - **`data/AccountBookHistory.ts`**: 가계부 내역 타입 정의
  - **`hooks/`**:
    - `useAccountBookHistoryItem.ts`: history 아이템 관련 커스텀 훅
    - `useAuth.ts`: 인증 관련 커스텀 훅
  - **`config/supabase.ts`**: Supabase 클라이언트 설정
  - **`navigations/RootNavigation.tsx`**: 스택/탭 네비게이션 구조 정의
  - **`utils/`**:
    - `DateUtils.ts`: 날짜 포맷 및 유틸 함수
    - `confirmDialog.ts`: 확인 다이얼로그 유틸
    - `responsive.ts`: 반응형 유틸
  - **`theme/`**: 색상, 간격, 타이포그래피 테마 정의

---

### 설치 및 실행 (Getting Started)

#### 1. 클론 & 패키지 설치

```bash
git clone <this-repo-url>
cd simple-money-log
npm install
```

#### 2. 필수 라이브러리 (이미 `package.json`에 포함되어 있음)

아래 라이브러리들은 이미 프로젝트에 포함되어 있으며, `npm install` 실행 시 함께 설치됩니다.

- 네비게이션 관련  
  `@react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs`  
  `react-native-screens react-native-safe-area-context`

- 아이콘/그래픽  
  `@fortawesome/react-native-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons`  
  `react-native-svg`

- 캘린더 & 차트  
  `react-native-calendars`  
  `react-native-chart-kit`

- 카메라 & 갤러리  
  `react-native-vision-camera`  
  `@react-native-camera-roll/camera-roll`

#### 3. Supabase 설정

프로젝트는 Supabase를 사용합니다. `src/config/supabase.ts` 파일에 Supabase URL과 Anon Key가 설정되어 있습니다.  
필요한 경우 환경 변수로 관리하거나 별도 설정 파일로 분리할 수 있습니다.

#### 4. 플랫폼별 권한 설정

iOS/Android 플랫폼별로 **카메라, 앨범, 파일 접근 권한 설정**이 필요합니다:

- **iOS**: `ios/ACCOUNTBOOK/Info.plist`에 권한 설정
- **Android**: `android/app/src/main/AndroidManifest.xml`에 권한 설정

#### 5. 앱 실행

```bash
# iOS
npm run ios

# Android (에뮬레이터 또는 디바이스)
npm run android
```
