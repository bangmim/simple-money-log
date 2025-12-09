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
  CalendarSelect: {selectedDate?: number};
  TakePhoto: {onTakePhoto: (url: string) => void};
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
  CALENDAR_SELECT: 'CalendarSelect',
  TAKE_PHOTO: 'TakePhoto',
  SELECT_PHOTO: 'SelectPhoto',
} as const;
