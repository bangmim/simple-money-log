import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Share,
  View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {Header} from '../components/Header/Header';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faClose,
  faUser,
  faFileExport,
  faEnvelope,
  faSignOutAlt,
  faUserSlash,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import {useRootNavigation} from '../navigations/RootNavigation';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../hooks/useAuth';
import {confirmDialog} from '../utils/confirmDialog';
import colors from '../theme/colors';
import {spacing} from '../theme/spacing';
import {Typography} from '../components/Typography';
import {Button} from '../components/Button';
import {Input} from '../components/Input';
import {supabase} from '../config/supabase';
import {BannerAdView} from '../components/BannerAdView';
import {useAccountBookHistoryItem} from '../hooks/useAccountBookHistoryItem';
import {convertToDateString} from '../utils/DateUtils';
import {scaleWidth} from '../utils/responsive';

export const MyPageScreen: React.FC = () => {
  const navigation = useRootNavigation();
  const {user, signOut, deleteAccount, updateNickname} = useAuth();
  const {getList} = useAccountBookHistoryItem();
  const [nickname, setNickname] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // 닉네임 가져오기
  useEffect(() => {
    const fetchNickname = async () => {
      if (!user?.id) {
        return;
      }

      // 1. user_metadata에서 먼저 확인
      const metadataNickname = user.user_metadata?.nickname;
      if (metadataNickname) {
        setNickname(metadataNickname);
        return;
      }

      // 2. users 테이블에서 가져오기
      try {
        const {data, error} = await supabase
          .from('users')
          .select('nickname')
          .eq('id', user.id)
          .single();

        if (!error && data?.nickname) {
          setNickname(data.nickname);
        }
      } catch (error) {
        console.warn('Failed to fetch nickname:', error);
      }
    };

    fetchNickname();
  }, [user]);

  const handleUpdateNickname = useCallback(async () => {
    if (!nickname.trim()) {
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const {error} = await updateNickname(nickname.trim());
      if (error) {
        Alert.alert('오류', error.message || '닉네임 수정에 실패했습니다.');
      } else {
        Alert.alert('성공', '닉네임이 수정되었습니다.');
        setIsEditingNickname(false);
      }
    } catch (error: any) {
      Alert.alert('오류', error.message || '닉네임 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [nickname, updateNickname]);

  const handleLogout = useCallback(async () => {
    confirmDialog({
      title: '로그아웃',
      message: '정말 로그아웃 하시겠습니까?',
      confirmText: '로그아웃',
      onConfirm: async () => {
        const {error} = await signOut();
        if (error) {
          Alert.alert('오류', error.message || '로그아웃에 실패했습니다.');
        }
      },
    });
  }, [signOut]);

  const handleDeleteAccount = useCallback(async () => {
    confirmDialog({
      title: '회원 탈퇴',
      message:
        '정말 회원 탈퇴를 하시겠습니까?\n모든 데이터가 삭제되며 복구할 수 없습니다.',
      confirmText: '탈퇴하기',
      onConfirm: async () => {
        setLoading(true);
        try {
          const {error} = await deleteAccount();
          if (error) {
            Alert.alert('오류', error.message || '회원 탈퇴에 실패했습니다.');
          }
        } catch (error: any) {
          Alert.alert('오류', error.message || '회원 탈퇴에 실패했습니다.');
        } finally {
          setLoading(false);
        }
      },
    });
  }, [deleteAccount]);

  const handleExportData = useCallback(async () => {
    setExporting(true);
    try {
      const list = await getList();
      if (list.length === 0) {
        Alert.alert('알림', '내보낼 데이터가 없습니다.');
        setExporting(false);
        return;
      }

      // CSV 헤더 (엑셀에서 열면 표로 보임)
      const csvHeader = '날짜,유형,금액,내용,생성일시\n';

      // CSV 데이터 변환 (엑셀 호환 형식)
      const csvRows = list.map(item => {
        const date = item.date !== 0 ? item.date : item.createdAt;
        const dateStr = convertToDateString(date);
        const type = item.type === '지출' ? '지출' : '수입';
        // 금액은 숫자만 저장 (엑셀에서 숫자로 인식되도록)
        const price = item.price;
        // 내용에 쉼표나 줄바꿈이 있으면 큰따옴표로 감싸기
        let comment = item.comment || '';
        if (
          comment.includes(',') ||
          comment.includes('\n') ||
          comment.includes('"')
        ) {
          comment = `"${comment.replace(/"/g, '""')}"`;
        }
        const createdAt = convertToDateString(item.createdAt);
        return `${dateStr},${type},${price},${comment},${createdAt}`;
      });

      const csvContent = csvHeader + csvRows.join('\n');

      // 파일명 생성 (현재 날짜 포함)
      const now = new Date();
      const fileName = `가계부_내역_${now.getFullYear()}${String(
        now.getMonth() + 1,
      ).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.csv`;

      // Share API로 공유
      const result = await Share.share({
        message: csvContent,
        title: fileName,
      });

      if (result.action === Share.sharedAction) {
        Alert.alert('성공', '데이터가 내보내졌습니다.');
      }
    } catch (error: any) {
      console.error('Export error:', error);
      Alert.alert('오류', '데이터 내보내기에 실패했습니다.');
    } finally {
      setExporting(false);
    }
  }, [getList]);

  const handleContact = useCallback(async () => {
    const email = 'akiyun10@gmail.com';
    const subject = encodeURIComponent('딱,가계부 문의');
    const body = encodeURIComponent(
      '안녕하세요.\n\n문의 내용을 작성해주세요.\n\n감사합니다.',
    );
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

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
          `이메일 앱이 설치되어 있지 않습니다.\n\n이메일 주소: ${email}`,
          [
            {
              text: '취소',
              style: 'cancel',
            },
            {
              text: '이메일 주소 복사',
              onPress: () => {
                Clipboard.setString(email);
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
                  email,
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
      Clipboard.setString(email);
      Alert.alert(
        '이메일 앱 열기 실패',
        `이메일 앱을 열 수 없습니다.\n\n이메일 주소가 클립보드에 복사되었습니다: ${email}`,
      );
    }
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <Header>
        <Header.Title title="마이페이지" />
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <FontAwesomeIcon icon={faClose} />
        </Pressable>
      </Header>
      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: spacing.horizontal,
          paddingTop: spacing.vertical,
          paddingBottom: spacing.xlarge,
        }}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}>
        {/* 사용자 정보 섹션 */}
        <View
          style={{
            marginBottom: spacing.large,
            padding: spacing.large,
            borderRadius: 16,
            backgroundColor: colors.backgroundSecondary,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.medium,
            }}>
            <FontAwesomeIcon
              icon={faUser}
              size={50}
              color={colors.textInverse}
            />
          </View>
          <Typography variant="h3" style={{marginBottom: scaleWidth(4)}}>
            {nickname || '사용자'}
          </Typography>
          <Typography variant="caption" color={colors.textSecondary}>
            {user?.email || ''}
          </Typography>
        </View>

        {/* 계정 설정 섹션 */}
        <View
          style={{
            marginBottom: spacing.large,
            borderRadius: 16,
            backgroundColor: colors.backgroundSecondary,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}>
          <View
            style={{
              paddingHorizontal: spacing.medium,
              paddingVertical: spacing.medium,
              borderBottomWidth: 1,
              borderBottomColor: colors.borderLight,
            }}>
            <Typography variant="bodyBold" fontSize={16}>
              계정 설정
            </Typography>
          </View>

          {/* 닉네임 수정 */}
          <Pressable
            onPress={() => setIsEditingNickname(true)}
            style={({pressed}) => [
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: spacing.medium,
                paddingVertical: spacing.medium,
                backgroundColor: pressed
                  ? colors.backgroundTertiary
                  : 'transparent',
              },
            ]}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.primary + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: spacing.medium,
                }}>
                <FontAwesomeIcon
                  icon={faEdit}
                  size={18}
                  color={colors.primary}
                />
              </View>
              <View style={{flex: 1}}>
                <Typography variant="body" color={colors.textPrimary}>
                  닉네임
                </Typography>
                <Typography
                  variant="caption"
                  color={colors.textSecondary}
                  numberOfLines={1}>
                  {nickname || '닉네임이 없습니다'}
                </Typography>
              </View>
            </View>
            <FontAwesomeIcon
              icon={faEdit}
              size={16}
              color={colors.textTertiary}
            />
          </Pressable>
        </View>

        {/* 데이터 관리 섹션 */}
        <View
          style={{
            marginBottom: spacing.large,
            borderRadius: 16,
            backgroundColor: colors.backgroundSecondary,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}>
          <View
            style={{
              paddingHorizontal: spacing.medium,
              paddingVertical: spacing.medium,
              borderBottomWidth: 1,
              borderBottomColor: colors.borderLight,
            }}>
            <Typography variant="bodyBold" fontSize={16}>
              데이터 관리
            </Typography>
          </View>

          {/* 데이터 보관 정책 안내 */}
          <View
            style={{
              paddingHorizontal: spacing.medium,
              paddingVertical: spacing.medium,
              borderBottomWidth: 1,
              borderBottomColor: colors.borderLight,
              backgroundColor: colors.backgroundTertiary,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}>
              <Typography
                variant="caption"
                color={colors.warning}
                style={{marginRight: scaleWidth(8)}}>
                ⚠️
              </Typography>
              <View style={{flex: 1}}>
                <Typography
                  variant="caption"
                  color={colors.textSecondary}
                  style={{lineHeight: 20}}>
                  데이터 보관 정책{'\n'}
                  가계부 내역은 1년 단위로 자동 삭제됩니다.
                </Typography>
              </View>
            </View>
          </View>

          {/* 데이터 내보내기 */}
          <Pressable
            onPress={handleExportData}
            disabled={exporting || loading}
            style={({pressed}) => [
              {
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: spacing.medium,
                paddingVertical: spacing.medium,
                backgroundColor: pressed
                  ? colors.backgroundTertiary
                  : 'transparent',
                opacity: exporting || loading ? 0.5 : 1,
              },
            ]}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.primary + '20',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.medium,
              }}>
              <FontAwesomeIcon
                icon={faFileExport}
                size={18}
                color={colors.primary}
              />
            </View>
            <View style={{flex: 1}}>
              <Typography variant="body" color={colors.textPrimary}>
                {exporting ? '내보내는 중...' : '데이터 내보내기'}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                CSV 파일로 내보내기
              </Typography>
            </View>
            {exporting && (
              <View style={{marginLeft: spacing.small}}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}
          </Pressable>
        </View>

        {/* 지원 섹션 */}
        <View
          style={{
            marginBottom: spacing.large,
            borderRadius: 16,
            backgroundColor: colors.backgroundSecondary,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}>
          <View
            style={{
              paddingHorizontal: spacing.medium,
              paddingVertical: spacing.medium,
              borderBottomWidth: 1,
              borderBottomColor: colors.borderLight,
            }}>
            <Typography variant="bodyBold" fontSize={16}>
              지원
            </Typography>
          </View>

          {/* 문의하기 */}
          <Pressable
            onPress={handleContact}
            style={({pressed}) => [
              {
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: spacing.medium,
                paddingVertical: spacing.medium,
                backgroundColor: pressed
                  ? colors.backgroundTertiary
                  : 'transparent',
              },
            ]}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.info + '20',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.medium,
              }}>
              <FontAwesomeIcon
                icon={faEnvelope}
                size={18}
                color={colors.info}
              />
            </View>
            <View style={{flex: 1}}>
              <Typography variant="body" color={colors.textPrimary}>
                문의하기
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                이메일로 문의하기
              </Typography>
            </View>
          </Pressable>
        </View>

        {/* 계정 관리 섹션 */}
        <View
          style={{
            marginBottom: spacing.large,
            borderRadius: 16,
            backgroundColor: colors.backgroundSecondary,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}>
          <View
            style={{
              paddingHorizontal: spacing.medium,
              paddingVertical: spacing.medium,
              borderBottomWidth: 1,
              borderBottomColor: colors.borderLight,
            }}>
            <Typography variant="bodyBold" fontSize={16}>
              계정 관리
            </Typography>
          </View>

          {/* 로그아웃 */}
          <Pressable
            onPress={handleLogout}
            style={({pressed}) => [
              {
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: spacing.medium,
                paddingVertical: spacing.medium,
                backgroundColor: pressed
                  ? colors.backgroundTertiary
                  : 'transparent',
                borderBottomWidth: 1,
                borderBottomColor: colors.borderLight,
              },
            ]}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.textSecondary + '20',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.medium,
              }}>
              <FontAwesomeIcon
                icon={faSignOutAlt}
                size={18}
                color={colors.textSecondary}
              />
            </View>
            <View style={{flex: 1}}>
              <Typography variant="body" color={colors.textPrimary}>
                로그아웃
              </Typography>
            </View>
          </Pressable>

          {/* 회원 탈퇴 */}
          <Pressable
            onPress={handleDeleteAccount}
            disabled={loading}
            style={({pressed}) => [
              {
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: spacing.medium,
                paddingVertical: spacing.medium,
                backgroundColor: pressed
                  ? colors.backgroundTertiary
                  : 'transparent',
                opacity: loading ? 0.5 : 1,
              },
            ]}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.danger + '20',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.medium,
              }}>
              <FontAwesomeIcon
                icon={faUserSlash}
                size={18}
                color={colors.danger}
              />
            </View>
            <View style={{flex: 1}}>
              <Typography variant="body" color={colors.danger}>
                회원 탈퇴
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                모든 데이터가 삭제됩니다
              </Typography>
            </View>
          </Pressable>
        </View>
      </ScrollView>
      {/* 배너 광고 */}
      <BannerAdView />

      {/* 닉네임 수정 모달 */}
      <Modal
        visible={isEditingNickname}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditingNickname(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: spacing.horizontal,
          }}>
          <View
            style={{
              backgroundColor: colors.background,
              borderRadius: 16,
              padding: spacing.large,
              width: '100%',
              maxWidth: 400,
            }}>
            <Typography
              variant="h3"
              style={{marginBottom: spacing.medium, textAlign: 'center'}}>
              닉네임 수정
            </Typography>
            <Input
              value={nickname}
              onChangeText={setNickname}
              placeholder="닉네임을 입력하세요"
            />
            <View
              style={{
                flexDirection: 'row',
                gap: spacing.small,
                marginTop: spacing.medium,
              }}>
              <View style={{flex: 1}}>
                <Button
                  title="저장"
                  onPress={handleUpdateNickname}
                  disabled={loading}
                />
              </View>
              <View style={{flex: 1}}>
                <Button
                  title="취소"
                  onPress={() => {
                    setIsEditingNickname(false);
                    // 원래 닉네임으로 복원
                    const metadataNickname =
                      user?.user_metadata?.nickname || '';
                    setNickname(metadataNickname);
                  }}
                  variant="secondary"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
