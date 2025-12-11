import {Alert, Linking} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const SUPPORT_EMAIL = 'akiyun10@gmail.com';
const EMAIL_SUBJECT = '딱,가계부 문의';
const EMAIL_BODY = '안녕하세요.\n\n문의 내용을 작성해주세요.\n\n감사합니다.';

export const openEmailContact = async (): Promise<void> => {
  const subject = encodeURIComponent(EMAIL_SUBJECT);
  const body = encodeURIComponent(EMAIL_BODY);
  const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

  try {
    // 먼저 이메일 앱이 있는지 확인
    const canOpen = await Linking.canOpenURL(mailtoUrl).catch(() => false);

    if (canOpen) {
      // 이메일 앱이 있으면 열기
      await Linking.openURL(mailtoUrl);
    } else {
      // 이메일 앱이 없는 경우: 클립보드에 복사 또는 Gmail 웹 열기
      Alert.alert(
        '이메일 앱 없음',
        `이메일 앱이 설치되어 있지 않습니다.\n\n이메일 주소: ${SUPPORT_EMAIL}`,
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '이메일 주소 복사',
            onPress: () => {
              Clipboard.setString(SUPPORT_EMAIL);
              Alert.alert(
                '복사 완료',
                '이메일 주소가 클립보드에 복사되었습니다.',
              );
            },
          },
          {
            text: 'Gmail 웹 열기',
            onPress: () => {
              const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(
                SUPPORT_EMAIL,
              )}&su=${subject}&body=${body}`;
              Linking.openURL(gmailUrl).catch(() => {
                Alert.alert('오류', 'Gmail 웹을 열 수 없습니다.');
              });
            },
          },
        ],
      );
    }
  } catch (error: any) {
    console.error('Failed to open email:', error);
    // 에러 발생 시 클립보드에 복사
    Clipboard.setString(SUPPORT_EMAIL);
    Alert.alert(
      '이메일 앱 열기 실패',
      `이메일 앱을 열 수 없습니다.\n\n이메일 주소가 클립보드에 복사되었습니다: ${SUPPORT_EMAIL}`,
    );
  }
};
