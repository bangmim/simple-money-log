import {AccountBookHistory} from '../data/AccountBookHistory';

export type ScreenParams = {
  // 받을 data 형태
  Login: undefined;
  Add: {selectedDate?: number};
  Main: undefined;
  Update: {
    item: AccountBookHistory;
    onChangeData: (nextItem: AccountBookHistory) => void;
    selectedDate?: number;
  };
  Detail: {item: AccountBookHistory};
  MonthlyAverage: undefined;
  MyPage: undefined;
  CalendarSelect: {selectedDate?: number};
  SelectPhoto: {onSelectPhoto: (url: string) => void};
};

// 화면 이름 상수
export const ROUTES = {
  LOGIN: 'Login',
  MAIN: 'Main',
  ADD: 'Add',
  UPDATE: 'Update',
  DETAIL: 'Detail',
  MONTHLY_AVERAGE: 'MonthlyAverage',
  MY_PAGE: 'MyPage',
  CALENDAR_SELECT: 'CalendarSelect',
  SELECT_PHOTO: 'SelectPhoto',
} as const;
