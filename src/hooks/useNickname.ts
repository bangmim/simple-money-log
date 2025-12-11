import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {supabase} from '../config/supabase';
import {useAuth} from './useAuth';

export const useNickname = () => {
  const {user, updateNickname: updateNicknameAuth} = useAuth();
  const [nickname, setNickname] = useState('');
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

  // 닉네임 업데이트
  const updateNickname = useCallback(
    async (newNickname: string) => {
      if (!newNickname.trim()) {
        Alert.alert('알림', '닉네임을 입력해주세요.');
        return {success: false};
      }

      setLoading(true);
      try {
        const {error} = await updateNicknameAuth(newNickname.trim());
        if (error) {
          Alert.alert('오류', error.message || '닉네임 수정에 실패했습니다.');
          return {success: false};
        } else {
          Alert.alert('성공', '닉네임이 수정되었습니다.');
          setNickname(newNickname.trim());
          return {success: true};
        }
      } catch (error: any) {
        Alert.alert('오류', error.message || '닉네임 수정에 실패했습니다.');
        return {success: false};
      } finally {
        setLoading(false);
      }
    },
    [updateNicknameAuth],
  );

  // 원래 닉네임 가져오기
  const getOriginalNickname = useCallback(() => {
    return user?.user_metadata?.nickname || '';
  }, [user]);

  return {
    nickname,
    setNickname,
    loading,
    updateNickname,
    getOriginalNickname,
  };
};
