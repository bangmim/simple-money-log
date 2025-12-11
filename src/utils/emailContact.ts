import {Alert, Linking} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const SUPPORT_EMAIL = 'akiyun10@gmail.com';
const EMAIL_SUBJECT = '딱,가계부 문의';
const EMAIL_BODY = '안녕하세요.\n\n문의 내용을 작성해주세요.\n\n감사합니다.';

export const openEmailContact = async (): Promise<void> => {
  const subject = encodeURIComponent(EMAIL_SUBJECT);
  const body = encodeURIComponent(EMAIL_BODY);

  try {
    // Gmail 앱 URL 생성
    const gmailUrl = `googlegmail://co?to=${encodeURIComponent(
      SUPPORT_EMAIL,
    )}&subject=${subject}&body=${body}`;

    // Gmail 앱이 설치되어 있는지 확인
    const canOpenGmail = await Linking.canOpenURL(gmailUrl).catch(() => false);

    if (canOpenGmail) {
      // Gmail 앱 열기
      await Linking.openURL(gmailUrl);
      return;
    }

    // Gmail 앱이 없으면 Gmail 웹으로 열기 (앱이 설치되어 있으면 자동으로 앱으로 열림)
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(
      SUPPORT_EMAIL,
    )}&su=${subject}&body=${body}`;
    await Linking.openURL(gmailWebUrl);
  } catch (error: any) {
    console.error('Failed to open Gmail:', error);
    // 에러 발생 시 클립보드에 복사
    Clipboard.setString(SUPPORT_EMAIL);
    Alert.alert(
      'Gmail 열기 실패',
      `Gmail을 열 수 없습니다.\n\n이메일 주소가 클립보드에 복사되었습니다: ${SUPPORT_EMAIL}`,
    );
  }
};
