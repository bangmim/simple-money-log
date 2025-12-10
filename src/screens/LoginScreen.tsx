import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Header} from '../components/Header/Header';
import {SingleLineInput} from '../components/Input';
import {Spacer} from '../components/Spacer';
import {useAuth} from '../hooks/useAuth';
import {PasswordInput} from '../components/PasswordInput';
import {Button} from '../components/Button';
import colors from '../theme/colors';
import {Typography} from '../components/Typography';
import {scaleWidth} from '../utils/responsive';

export const LoginScreen: React.FC = () => {
  const {
    signInWithUsername,
    signUp,
    checkEmailDuplicate,
    checkUsernameDuplicate,
  } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [identifier, setIdentifier] = useState(''); // 로그인 시 아이디, 이메일 또는 닉네임
  const [username, setUsername] = useState(''); // 회원가입 시 아이디
  const [email, setEmail] = useState(''); // 회원가입 시 이메일
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState(''); // 회원가입 시 닉네임
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const emailCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const usernameCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const usernameInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const usernameViewRef = useRef<View>(null);
  const emailViewRef = useRef<View>(null);

  // 함수들을 ref로 저장하여 dependency 문제 해결
  const checkEmailDuplicateRef = useRef(checkEmailDuplicate);
  const checkUsernameDuplicateRef = useRef(checkUsernameDuplicate);

  useEffect(() => {
    checkEmailDuplicateRef.current = checkEmailDuplicate;
  }, [checkEmailDuplicate]);

  useEffect(() => {
    checkUsernameDuplicateRef.current = checkUsernameDuplicate;
  }, [checkUsernameDuplicate]);

  // 이메일 실시간 중복 체크 (debounce)
  useEffect(() => {
    if (!isSignUp || !email || email.trim() === '') {
      setEmailError(null);
      setCheckingEmail(false);
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError(null); // 형식이 맞지 않으면 중복 체크 안 함
      setCheckingEmail(false);
      return;
    }

    // 기존 타이머 취소
    if (emailCheckTimeoutRef.current) {
      clearTimeout(emailCheckTimeoutRef.current);
    }

    setCheckingEmail(true);
    setEmailError(null);

    // 300ms 후에 체크 (더 빠른 피드백)
    const timeoutId = setTimeout(async () => {
      try {
        const result = await checkEmailDuplicateRef.current(email);
        setCheckingEmail(false);
        if (result.isDuplicate && result.error) {
          setEmailError(result.error.message);
        } else {
          setEmailError(null);
        }
      } catch (err) {
        console.error('Email check error:', err);
        setCheckingEmail(false);
        setEmailError(null);
      }
    }, 300);

    emailCheckTimeoutRef.current = timeoutId;

    return () => {
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current);
      }
      emailCheckTimeoutRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, isSignUp]);

  // 아이디 실시간 중복 체크 (debounce)
  useEffect(() => {
    if (!isSignUp || !username || username.trim() === '') {
      setUsernameError(null);
      setCheckingUsername(false);
      return;
    }

    // 아이디 최소 길이 체크 (예: 3자 이상)
    if (username.trim().length < 3) {
      setUsernameError(null); // 너무 짧으면 중복 체크 안 함
      setCheckingUsername(false);
      return;
    }

    // 기존 타이머 취소
    if (usernameCheckTimeoutRef.current) {
      clearTimeout(usernameCheckTimeoutRef.current);
    }

    setCheckingUsername(true);
    setUsernameError(null);

    // 300ms 후에 체크 (더 빠른 피드백)
    const timeoutId = setTimeout(async () => {
      try {
        const result = await checkUsernameDuplicateRef.current(username);
        setCheckingUsername(false);
        if (result.isDuplicate && result.error) {
          setUsernameError(result.error.message);
        } else {
          setUsernameError(null);
        }
      } catch (err) {
        console.error('Username check error:', err);
        setCheckingUsername(false);
        setUsernameError(null);
      }
    }, 300);

    usernameCheckTimeoutRef.current = timeoutId;

    return () => {
      if (usernameCheckTimeoutRef.current) {
        clearTimeout(usernameCheckTimeoutRef.current);
      }
      usernameCheckTimeoutRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, isSignUp]);

  const handleSubmit = useCallback(async () => {
    if (isSignUp) {
      // 회원가입 검증
      if (!email || !username || !password) {
        Alert.alert('오류', '이메일, 아이디, 비밀번호를 모두 입력해주세요.');
        return;
      }
      if (password.length < 6) {
        Alert.alert('오류', '비밀번호는 6자 이상이어야 합니다.');
        return;
      }
      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('오류', '올바른 이메일 형식을 입력해주세요.');
        return;
      }
      // 중복 체크 에러 확인
      if (usernameError) {
        // 오류가 있으면 포커스 이동
        usernameViewRef.current?.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({
              y: Math.max(0, y - 20),
              animated: true,
            });
            setTimeout(() => {
              usernameInputRef.current?.focus();
            }, 100);
          },
          () => {
            usernameInputRef.current?.focus();
          },
        );
        return;
      }
      if (emailError) {
        // 오류가 있으면 포커스 이동
        emailViewRef.current?.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({
              y: Math.max(0, y - 20),
              animated: true,
            });
            setTimeout(() => {
              emailInputRef.current?.focus();
            }, 100);
          },
          () => {
            emailInputRef.current?.focus();
          },
        );
        return;
      }
      // 체크 중이면 대기
      if (checkingEmail || checkingUsername) {
        Alert.alert('알림', '중복 확인 중입니다. 잠시 후 다시 시도해주세요.');
        return;
      }
    } else {
      // 로그인 검증
      if (!identifier || !password) {
        Alert.alert(
          '오류',
          '아이디, 이메일 또는 닉네임과 비밀번호를 입력해주세요.',
        );
        return;
      }
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const {error} = await signUp(email, password, username, nickname);
        if (error) {
          Alert.alert('회원가입 실패', error.message);
        } else {
          Alert.alert('성공', '회원가입이 완료되었습니다!');
          setIsSignUp(false);
          setEmail('');
          setUsername('');
          setPassword('');
          setNickname('');
        }
      } else {
        // 공백 제거
        const trimmedIdentifier = identifier.trim();
        const trimmedPassword = password.trim();

        if (!trimmedIdentifier || !trimmedPassword) {
          Alert.alert(
            '오류',
            '아이디, 이메일 또는 닉네임과 비밀번호를 입력해주세요.',
          );
          setLoading(false);
          return;
        }

        const {error} = await signInWithUsername(
          trimmedIdentifier,
          trimmedPassword,
        );
        if (error) {
          console.error('Login error:', error);
          Alert.alert('로그인 실패', error.message || '로그인에 실패했습니다.');
        }
        // 성공 시 useAuth의 onAuthStateChange가 자동으로 처리
      }
    } catch (error: any) {
      Alert.alert('오류', error.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [
    email,
    identifier,
    username,
    password,
    nickname,
    isSignUp,
    signInWithUsername,
    signUp,
    checkingEmail,
    checkingUsername,
    emailError,
    usernameError,
  ]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Header>
          <Header.Title title={isSignUp ? '회원가입' : '로그인'} />
        </Header>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            flexGrow: 1,
            marginHorizontal: scaleWidth(24),
          }}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled">
          <Spacer space={scaleWidth(48)} />

          <View>
            <Typography
              variant="h2"
              style={{
                marginBottom: scaleWidth(8),
              }}>
              {isSignUp
                ? '새 계정 만들기'
                : '딱, 가계부에 오신 것을 환영합니다'}
            </Typography>
            <Typography
              variant="body"
              color={colors.textSecondary}
              style={{
                marginBottom: scaleWidth(32),
              }}>
              {isSignUp
                ? '이메일, 아이디, 비밀번호를 입력해주세요'
                : '아이디, 이메일 또는 닉네임과 비밀번호를 입력해주세요'}
            </Typography>

            {isSignUp ? (
              <>
                <View ref={usernameViewRef}>
                  <SingleLineInput
                    ref={usernameInputRef}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="아이디"
                    fontSize={scaleWidth(16)}
                    error={!!usernameError}
                  />
                  {checkingUsername && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: scaleWidth(4),
                      }}>
                      <ActivityIndicator size="small" color={colors.primary} />
                      <Typography
                        variant="caption"
                        color={colors.textSecondary}
                        style={{marginLeft: scaleWidth(8)}}>
                        확인 중...
                      </Typography>
                    </View>
                  )}
                  {usernameError && (
                    <Typography
                      variant="caption"
                      color={colors.danger}
                      style={{marginTop: scaleWidth(4)}}>
                      {usernameError}
                    </Typography>
                  )}
                </View>
                <Spacer space={scaleWidth(16)} />
                <View ref={emailViewRef}>
                  <SingleLineInput
                    ref={emailInputRef}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="이메일"
                    keyboardType="email-address"
                    fontSize={scaleWidth(16)}
                    error={!!emailError}
                  />
                  {checkingEmail && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: scaleWidth(4),
                      }}>
                      <ActivityIndicator size="small" color={colors.primary} />
                      <Typography
                        variant="caption"
                        color={colors.textSecondary}
                        style={{marginLeft: scaleWidth(8)}}>
                        확인 중...
                      </Typography>
                    </View>
                  )}
                  {emailError && (
                    <Typography
                      variant="caption"
                      color={colors.danger}
                      style={{marginTop: scaleWidth(4)}}>
                      {emailError}
                    </Typography>
                  )}
                </View>
                <Spacer space={scaleWidth(16)} />
                <SingleLineInput
                  value={nickname}
                  onChangeText={setNickname}
                  placeholder="닉네임 (선택)"
                  fontSize={scaleWidth(16)}
                />
                <Spacer space={scaleWidth(16)} />
              </>
            ) : (
              <SingleLineInput
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="아이디, 이메일 또는 닉네임"
                fontSize={scaleWidth(16)}
              />
            )}
            <Spacer space={scaleWidth(16)} />

            <PasswordInput
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호 (6자 이상)"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              focused={passwordFocused}
              error={isSignUp && password.length > 0 && password.length < 6}
            />

            <Spacer space={scaleWidth(32)} />

            <Button
              title={isSignUp ? '회원가입' : '로그인'}
              disabled={
                isSignUp &&
                !loading &&
                (!!emailError ||
                  !!usernameError ||
                  checkingEmail ||
                  checkingUsername)
              }
              onPress={() => {
                // 비활성화된 상태에서도 클릭 시 오류 필드로 포커스 이동
                if (
                  isSignUp &&
                  !loading &&
                  (!!emailError ||
                    !!usernameError ||
                    checkingEmail ||
                    checkingUsername)
                ) {
                  if (usernameError) {
                    usernameViewRef.current?.measureLayout(
                      scrollViewRef.current as any,
                      (x, y) => {
                        scrollViewRef.current?.scrollTo({
                          y: Math.max(0, y - 20),
                          animated: true,
                        });
                        setTimeout(() => {
                          usernameInputRef.current?.focus();
                        }, 100);
                      },
                      () => {
                        usernameInputRef.current?.focus();
                      },
                    );
                  } else if (emailError) {
                    emailViewRef.current?.measureLayout(
                      scrollViewRef.current as any,
                      (x, y) => {
                        scrollViewRef.current?.scrollTo({
                          y: Math.max(0, y - 20),
                          animated: true,
                        });
                        setTimeout(() => {
                          emailInputRef.current?.focus();
                        }, 100);
                      },
                      () => {
                        emailInputRef.current?.focus();
                      },
                    );
                  }
                  return;
                }
                handleSubmit();
              }}
              loading={loading}
            />

            <Spacer space={scaleWidth(16)} />

            <Pressable
              onPress={() => {
                if (isSignUp) {
                  // 회원가입에서 로그인으로 전환 시 모든 입력 데이터 초기화
                  setUsername('');
                  setEmail('');
                  setPassword('');
                  setNickname('');
                  setEmailError(null);
                  setUsernameError(null);
                  setCheckingEmail(false);
                  setCheckingUsername(false);
                }
                setIsSignUp(!isSignUp);
              }}
              style={({pressed}) => [
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: scaleWidth(8),
                  opacity: pressed ? 0.7 : 1,
                },
              ]}>
              <Typography variant="caption" color={colors.textSecondary}>
                {isSignUp ? '이미 계정이 있으신가요? ' : '계정이 없으신가요? '}
              </Typography>
              <Typography
                variant="caption"
                color={colors.primary}
                style={{
                  fontWeight: '700',
                  textDecorationLine: 'underline',
                }}>
                {isSignUp ? '로그인' : '회원가입'}
              </Typography>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
