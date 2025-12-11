import React, {useCallback, useState} from 'react';
import {Alert, Pressable, ScrollView} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faClose,
  faFileExport,
  faEnvelope,
  faSignOutAlt,
  faUserSlash,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import {Header} from '../components/Header/Header';
import {useRootNavigation} from '../navigations/RootNavigation';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../hooks/useAuth';
import {confirmDialog} from '../utils/confirmDialog';
import colors from '../theme/colors';
import {spacing} from '../theme/spacing';
import {BannerAdView} from '../components/BannerAdView';
import {useAccountBookHistoryItem} from '../hooks/useAccountBookHistoryItem';
import {exportToExcel} from '../utils/exportData';
import {openEmailContact} from '../utils/emailContact';
import {useNickname} from '../hooks/useNickname';
import {SectionCard} from '../components/MyPage/SectionCard';
import {SectionHeader} from '../components/MyPage/SectionHeader';
import {SectionItem} from '../components/MyPage/SectionItem';
import {UserInfoSection} from '../components/MyPage/UserInfoSection';
import {NicknameEditModal} from '../components/MyPage/NicknameEditModal';
import {DataRetentionPolicy} from '../components/MyPage/DataRetentionPolicy';
import {ActivityIndicator} from 'react-native';

export const MyPageScreen: React.FC = () => {
  const navigation = useRootNavigation();
  const {user, signOut, deleteAccount} = useAuth();
  const {getList} = useAccountBookHistoryItem();
  const {
    nickname,
    setNickname,
    loading: nicknameLoading,
    updateNickname,
    getOriginalNickname,
  } = useNickname();
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

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

  const handleUpdateNickname = useCallback(async () => {
    const result = await updateNickname(nickname);
    if (result.success) {
      setIsEditingNickname(false);
    }
  }, [nickname, updateNickname]);

  const handleExportData = useCallback(async () => {
    setExporting(true);
    try {
      const list = await getList();
      await exportToExcel(list);
    } catch (error: any) {
      // 사용자가 공유를 취소한 경우는 에러로 처리하지 않음
      if (error.message === 'User did not share') {
        // 조용히 처리 (에러 로그 없이)
        return;
      }
      console.error('Export error:', error);
      Alert.alert('오류', '데이터 내보내기에 실패했습니다.');
    } finally {
      setExporting(false);
    }
  }, [getList]);

  const handleContact = useCallback(async () => {
    await openEmailContact();
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
        <UserInfoSection nickname={nickname} email={user?.email || ''} />

        {/* 계정 설정 섹션 */}
        <SectionCard>
          <SectionHeader title="계정 설정" />
          <SectionItem
            icon={faEdit}
            title="닉네임"
            subtitle={nickname || '닉네임이 없습니다'}
            onPress={() => setIsEditingNickname(true)}
            rightElement={
              <FontAwesomeIcon
                icon={faEdit}
                size={16}
                color={colors.textTertiary}
              />
            }
          />
        </SectionCard>

        {/* 데이터 관리 섹션 */}
        <SectionCard>
          <SectionHeader title="데이터 관리" />
          <DataRetentionPolicy />
          <SectionItem
            icon={faFileExport}
            title={exporting ? '내보내는 중...' : '데이터 내보내기'}
            subtitle="엑셀 파일로 내보내기"
            onPress={handleExportData}
            disabled={exporting || loading || nicknameLoading}
            showLoading={exporting}
            rightElement={
              exporting ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : undefined
            }
          />
        </SectionCard>

        {/* 지원 섹션 */}
        <SectionCard>
          <SectionHeader title="지원" />
          <SectionItem
            icon={faEnvelope}
            iconColor={colors.info}
            iconBgColor={colors.info + '20'}
            title="문의하기"
            subtitle="이메일로 문의하기"
            onPress={handleContact}
          />
        </SectionCard>

        {/* 계정 관리 섹션 */}
        <SectionCard>
          <SectionHeader title="계정 관리" />
          <SectionItem
            icon={faSignOutAlt}
            iconColor={colors.textSecondary}
            iconBgColor={colors.textSecondary + '20'}
            title="로그아웃"
            onPress={handleLogout}
            borderBottom
          />
          <SectionItem
            icon={faUserSlash}
            iconColor={colors.danger}
            iconBgColor={colors.danger + '20'}
            title="회원 탈퇴"
            subtitle="모든 데이터가 삭제됩니다"
            onPress={handleDeleteAccount}
            disabled={loading}
          />
        </SectionCard>
      </ScrollView>
      {/* 배너 광고 */}
      <BannerAdView />

      {/* 닉네임 수정 모달 */}
      <NicknameEditModal
        visible={isEditingNickname}
        nickname={nickname}
        onNicknameChange={setNickname}
        onSave={handleUpdateNickname}
        onCancel={() => {
          setIsEditingNickname(false);
          setNickname(getOriginalNickname());
        }}
        loading={nicknameLoading}
        originalNickname={getOriginalNickname()}
      />
    </SafeAreaView>
  );
};
