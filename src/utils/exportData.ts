import * as XLSX from 'xlsx';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import {Alert} from 'react-native';
import {AccountBookHistory} from '../data/AccountBookHistory';
import {convertToDateString} from './DateUtils';

type MonthlyData = {
  year: number;
  month: number;
  items: AccountBookHistory[];
};

export const exportToExcel = async (
  list: AccountBookHistory[],
): Promise<void> => {
  if (list.length === 0) {
    Alert.alert('알림', '내보낼 데이터가 없습니다.');
    return;
  }

  // 월별로 데이터 그룹화
  const monthlyMap = new Map<string, MonthlyData>();

  list.forEach(item => {
    const date = item.date !== 0 ? item.date : item.createdAt;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth();
    const key = `${year}-${month}`;

    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, {
        year,
        month,
        items: [],
      });
    }

    monthlyMap.get(key)!.items.push(item);
  });

  // 월별로 정렬 (최신순)
  const monthlyData = Array.from(monthlyMap.values()).sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year;
    }
    return b.month - a.month;
  });

  // 워크북 생성
  const wb = XLSX.utils.book_new();

  // 각 월별로 시트 생성
  monthlyData.forEach(({year, month, items}) => {
    // 엑셀 데이터 준비
    const excelData = items.map(item => {
      const date = item.date !== 0 ? item.date : item.createdAt;
      const dateStr = convertToDateString(date);
      const type = item.type === '지출' ? '지출' : '수입';
      const price = item.price;
      const comment = item.comment || '';
      const createdAt = convertToDateString(item.createdAt);
      return {
        날짜: dateStr,
        유형: type,
        금액: price,
        내용: comment,
        생성일시: createdAt,
      };
    });

    // 시트 생성
    const ws = XLSX.utils.json_to_sheet(excelData);

    // 컬럼 너비 조정
    const colWidths = [
      {wch: 12}, // 날짜
      {wch: 8}, // 유형
      {wch: 15}, // 금액
      {wch: 30}, // 내용
      {wch: 18}, // 생성일시
    ];
    ws['!cols'] = colWidths;

    // 시트 이름 생성 (엑셀 시트 이름은 31자 제한)
    const sheetName = `${year}년 ${month + 1}월`;

    // 시트 추가
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  // 파일명 생성 (현재 날짜 포함)
  const now = new Date();
  const fileName = `가계부_내역_${now.getFullYear()}${String(
    now.getMonth() + 1,
  ).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.xlsx`;

  // 임시 파일 경로 생성
  const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

  // Base64로 변환하여 파일에 저장
  const base64Data = XLSX.write(wb, {type: 'base64', bookType: 'xlsx'});
  await RNFS.writeFile(filePath, base64Data, 'base64');

  // react-native-share로 공유
  try {
    await Share.open({
      url: `file://${filePath}`,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      title: '가계부 데이터 내보내기',
      filename: fileName,
    });

    Alert.alert(
      '성공',
      `데이터가 엑셀 파일로 내보내졌습니다.\n총 ${monthlyData.length}개월의 데이터가 포함되어 있습니다.`,
    );
  } catch (error: any) {
    // 사용자가 공유를 취소한 경우는 정상적인 동작으로 처리
    if (error.message === 'User did not share') {
      // 조용히 처리 (에러 로그 없이)
      return;
    }
    // 다른 에러는 다시 throw
    throw error;
  }
};
