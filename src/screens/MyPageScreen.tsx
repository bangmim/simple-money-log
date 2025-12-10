import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Pressable, ScrollView, View} from 'react-native';
import {Header} from '../components/Header/Header';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faClose, faUser} from '@fortawesome/free-solid-svg-icons';
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

export const MyPageScreen: React.FC = () => {
  const navigation = useRootNavigation();
  const {user, signOut, deleteAccount, updateNickname} = useAuth();
  const [nickname, setNickname] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [loading, setLoading] = useState(false);

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
          paddingHorizontal: spacing.horizontal,
          paddingVertical: spacing.vertical,
        }}>
        {/* 사용자 정보 섹션 */}
        <View
          style={{
            marginBottom: spacing.vertical,
            padding: spacing.vertical,
            borderRadius: 12,
            backgroundColor: colors.backgroundSecondary,
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}>
            <FontAwesomeIcon
              icon={faUser}
              size={40}
              color={colors.textInverse}
            />
          </View>
          <Typography variant="bodyBold" fontSize={18}>
            {user?.email || '사용자'}
          </Typography>
        </View>

        {/* 닉네임 수정 섹션 */}
        <View
          style={{
            marginBottom: spacing.vertical,
            padding: spacing.vertical,
            borderRadius: 12,
            backgroundColor: colors.backgroundSecondary,
          }}>
          <Typography variant="bodyBold" style={{marginBottom: 12}}>
            닉네임
          </Typography>
          {isEditingNickname ? (
            <View>
              <Input
                value={nickname}
                onChangeText={setNickname}
                placeholder="닉네임을 입력하세요"
              />
              <View
                style={{
                  flexDirection: 'row',
                  gap: 8,
                  marginTop: 12,
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
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Typography variant="body" color={colors.textSecondary}>
                {nickname || '닉네임이 없습니다'}
              </Typography>
              <Pressable
                onPress={() => setIsEditingNickname(true)}
                hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: colors.primary,
                }}>
                <Typography variant="caption" color={colors.textInverse}>
                  수정
                </Typography>
              </Pressable>
            </View>
          )}
        </View>

        {/* 로그아웃 버튼 */}
        <View style={{marginBottom: 12}}>
          <Button title="로그아웃" onPress={handleLogout} variant="secondary" />
        </View>

        {/* 회원 탈퇴 버튼 */}
        <Button
          title="회원 탈퇴"
          onPress={handleDeleteAccount}
          variant="danger"
          disabled={loading}
        />
      </ScrollView>
      {/* 배너 광고 */}
      <BannerAdView />
    </SafeAreaView>
  );
};
