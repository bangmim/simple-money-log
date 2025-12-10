// 화면에 표시할 타입지정

export type AccountBookHistory = {
  id?: number;
  type: '지출' | '수입';
  price: number;
  comment: string;
  date: number;
  createdAt: number;
  updatedAt: number;
  photoUrl: string | null;
};
