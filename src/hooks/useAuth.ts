import {useState, useEffect} from 'react';
import {Session, User} from '@supabase/supabase-js';
import {supabase} from '../config/supabase';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // supabase가 제대로 초기화되지 않았을 때 처리
    if (!supabase || !supabase.auth) {
      console.warn('Supabase is not properly initialized');
      setLoading(false);
      return;
    }

    // 초기 세션 확인
    supabase.auth
      .getSession()
      .then((response: any) => {
        if (response && response.data) {
          setSession(response.data.session);
          setUser(response.data.session?.user ?? null);
        } else if (response && response.session) {
          // 다른 형태의 응답 구조 처리
          setSession(response.session);
          setUser(response.session?.user ?? null);
        }
        setLoading(false);
      })
      .catch((error: any) => {
        console.error('Failed to get session:', error);
        setLoading(false);
      });

    // 인증 상태 변경 리스너
    let subscription: any = null;
    try {
      const authStateChangeResponse = supabase.auth.onAuthStateChange(
        (_event: any, session: any) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        },
      );
      if (authStateChangeResponse && authStateChangeResponse.data) {
        subscription = authStateChangeResponse.data.subscription;
      }
    } catch (error) {
      console.error('Failed to set up auth state listener:', error);
      setLoading(false);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase || !supabase.auth) {
      return {data: null, error: {message: 'Supabase not configured'}};
    }
    try {
      const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return {data, error};
    } catch (error: any) {
      return {data: null, error: {message: error.message || 'Sign in failed'}};
    }
  };

  // 아이디로 이메일 찾기
  const findEmailByUsername = async (username: string) => {
    if (!supabase) {
      return {data: null, error: {message: 'Supabase not configured'}};
    }
    try {
      // .single() 대신 .maybeSingle() 사용 (결과가 없어도 에러 발생 안함)
      // 보안: username_lookup 뷰 사용 (email만 노출)
      const {data, error} = await supabase
        .from('username_lookup')
        .select('email')
        .eq('username', username)
        .maybeSingle();

      if (error) {
        console.error('findEmailByUsername error:', error);
        return {data: null, error};
      }

      // 데이터가 없으면 에러 반환
      if (!data) {
        return {
          data: null,
          error: {message: '아이디를 찾을 수 없습니다.'},
        };
      }

      return {data, error: null};
    } catch (error: any) {
      console.error('findEmailByUsername exception:', error);
      return {data: null, error: {message: error.message || 'User not found'}};
    }
  };

  // 아이디로 로그인
  const signInWithUsername = async (username: string, password: string) => {
    const {data: userData, error: findError} = await findEmailByUsername(
      username,
    );
    if (findError || !userData) {
      return {
        data: null,
        error: {message: '아이디를 찾을 수 없습니다.'},
      };
    }
    return signIn(userData.email, password);
  };

  const signUp = async (
    email: string,
    password: string,
    username: string,
    nickname?: string,
  ) => {
    if (!supabase || !supabase.auth) {
      return {data: null, error: {message: 'Supabase not configured'}};
    }
    try {
      // 1. Supabase Auth에 회원가입
      const {data: authData, error: authError} = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname: nickname || '',
            username: username,
          },
        },
      });

      if (authError || !authData.user) {
        return {data: null, error: authError || {message: 'Sign up failed'}};
      }

      // 2. users 테이블에 아이디-이메일 매핑 저장
      const {error: dbError} = await supabase.from('users').insert({
        id: authData.user.id,
        username: username,
        email: email,
        nickname: nickname || '',
      });

      if (dbError) {
        // users 테이블 저장 실패 시 에러 반환
        console.error('Failed to save username mapping:', dbError);
        return {
          data: null,
          error: {
            message:
              '회원가입은 완료되었지만 사용자 정보 저장에 실패했습니다. 관리자에게 문의하세요.',
          },
        };
      }

      return {data: authData, error: null};
    } catch (error: any) {
      return {data: null, error: {message: error.message || 'Sign up failed'}};
    }
  };

  const signOut = async () => {
    if (!supabase || !supabase.auth) {
      return {error: null};
    }
    try {
      const {error} = await supabase.auth.signOut();
      return {error};
    } catch (error: any) {
      return {error: {message: error.message || 'Sign out failed'}};
    }
  };

  const updateNickname = async (nickname: string) => {
    if (!supabase || !supabase.auth || !user?.id) {
      return {
        error: {message: 'Supabase not configured or user not authenticated'},
      };
    }
    try {
      // 1. user_metadata 업데이트
      const {error: metadataError} = await supabase.auth.updateUser({
        data: {nickname},
      });

      if (metadataError) {
        return {error: metadataError};
      }

      // 2. users 테이블 업데이트
      const {error: dbError} = await supabase
        .from('users')
        .update({nickname})
        .eq('id', user.id);

      if (dbError) {
        console.error('Failed to update nickname in users table:', dbError);
        return {error: dbError};
      }

      // 3. 로컬 user 상태 업데이트
      const updatedUser = {
        ...user,
        user_metadata: {
          ...user.user_metadata,
          nickname,
        },
      };
      setUser(updatedUser as User);

      return {error: null};
    } catch (error: any) {
      return {error: {message: error.message || 'Failed to update nickname'}};
    }
  };

  const deleteAccount = async () => {
    if (!supabase || !supabase.auth || !user?.id) {
      return {
        error: {message: 'Supabase not configured or user not authenticated'},
      };
    }
    try {
      // 1. account_history 테이블에서 사용자 데이터 삭제
      const {error: historyError} = await supabase
        .from('account_history')
        .delete()
        .eq('user_id', user.id);

      if (historyError) {
        throw new Error(historyError.message);
      }

      // 2. users 테이블에서 사용자 데이터 삭제
      const {error: dbError} = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (dbError) {
        throw new Error(dbError.message);
      }

      // 3. Database Function을 통해 auth.users 삭제
      // Supabase 에디터에서 delete_user_account 함수를 생성해야 합니다
      const {error: rpcError} = await supabase.rpc('delete_user_account');

      if (rpcError) {
        console.warn(
          'Database Function not available. Auth account may not be deleted:',
          rpcError,
        );
        // Database Function이 없어도 계속 진행 (데이터는 이미 삭제됨)
      }

      // 4. 로그아웃 처리
      const {error: signOutError} = await supabase.auth.signOut();

      if (signOutError) {
        return {error: signOutError};
      }

      return {error: null};
    } catch (error: any) {
      return {error: {message: error.message || 'Failed to delete account'}};
    }
  };

  return {
    session,
    user,
    loading,
    signIn,
    signInWithUsername,
    signUp,
    signOut,
    updateNickname,
    deleteAccount,
    isAuthenticated: !!session,
  };
};
