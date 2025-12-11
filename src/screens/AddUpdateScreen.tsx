import React, {useCallback, useState} from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  View,
  Platform,
} from 'react-native';
import {Header} from '../components/Header/Header';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faClose} from '@fortawesome/free-solid-svg-icons';
import {useRootNavigation, useRootRoute} from '../navigations/RootNavigation';
import {AccountBookHistory} from '../data/AccountBookHistory';
import {Spacer} from '../components/Spacer';
import {SingleLineInput, MultiLineInput} from '../components/Input';
import {TypeSelector} from '../components/TypeSelector';
import {PhotoPicker} from '../components/PhotoPicker';
import {DatePickerButton} from '../components/DatePickerButton';
import {Button} from '../components/Button';
import colors from '../theme/colors';
import {spacing} from '../theme/spacing';
import {useAccountBookHistoryItem} from '../hooks/useAccountBookHistoryItem';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {CalendarSelectScreen} from './CalendarSelectScreen';
import {scaleWidth} from '../utils/responsive';
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  MediaType,
} from 'react-native-image-picker';
import {
  PERMISSIONS,
  request,
  RESULTS,
  check,
  PermissionStatus,
} from 'react-native-permissions';

export const AddUpdateScreen: React.FC = () => {
  const navigation = useRootNavigation<'Add' | 'Update'>();
  const routes = useRootRoute<'Add' | 'Update'>();

  const {insertItem, updateItem} = useAccountBookHistoryItem();

  const [item, setItem] = useState<AccountBookHistory>(
    (routes.params && 'item' in routes.params ? routes.params.item : null) ?? {
      type: '지출',
      price: 0,
      comment: '',
      date: 0,
      createdAt: 0,
      updatedAt: 0,
      photoUrl: null,
    },
  );

  const onPressType = useCallback<(type: AccountBookHistory['type']) => void>(
    type => {
      setItem(prevItem => {
        return {
          ...prevItem,
          type: type,
        };
      });
    },
    [],
  );
  const onChangePrice = useCallback<(text: string) => void>(text => {
    setItem(prevState => ({
      ...prevState,
      price: parseInt(text, 10) || 0,
    }));
  }, []);

  const onPressPhoto = useCallback(() => {
    Alert.alert('사진 추가', '어떤 방법으로 사진을 추가할까요?', [
      {
        text: '카메라로 촬영',
        onPress: async () => {
          // 카메라 권한 확인 및 요청
          if (Platform.OS === 'android') {
            let permissionStatus: PermissionStatus = await check(
              PERMISSIONS.ANDROID.CAMERA,
            );

            if (permissionStatus !== RESULTS.GRANTED) {
              permissionStatus = await request(PERMISSIONS.ANDROID.CAMERA);
            }

            if (permissionStatus !== RESULTS.GRANTED) {
              Alert.alert(
                '권한 필요',
                '카메라로 사진을 촬영하려면 카메라 권한이 필요합니다.',
              );
              return;
            }
          } else {
            let permissionStatus: PermissionStatus = await check(
              PERMISSIONS.IOS.CAMERA,
            );

            if (permissionStatus !== RESULTS.GRANTED) {
              permissionStatus = await request(PERMISSIONS.IOS.CAMERA);
            }

            if (permissionStatus !== RESULTS.GRANTED) {
              Alert.alert(
                '권한 필요',
                '카메라로 사진을 촬영하려면 카메라 권한이 필요합니다.',
              );
              return;
            }
          }

          // 권한이 허용된 경우 카메라 실행
          launchCamera(
            {
              mediaType: 'photo' as MediaType,
              quality: 0.8,
              saveToPhotos: true,
            },
            (response: ImagePickerResponse) => {
              if (response.didCancel) {
                return;
              }
              if (response.errorMessage) {
                Alert.alert('오류', response.errorMessage);
                return;
              }
              if (response.assets && response.assets[0]) {
                const uri = response.assets[0].uri;
                if (uri) {
                  setItem(prevState => ({
                    ...prevState,
                    photoUrl: Platform.OS === 'android' ? `file://${uri}` : uri,
                  }));
                }
              }
            },
          );
        },
      },
      {
        text: '앨범에서 선택',
        onPress: () => {
          launchImageLibrary(
            {
              mediaType: 'photo' as MediaType,
              selectionLimit: 1,
              quality: 0.8,
            },
            (response: ImagePickerResponse) => {
              if (response.didCancel) {
                return;
              }
              if (response.errorMessage) {
                Alert.alert('오류', response.errorMessage);
                return;
              }
              if (response.assets && response.assets[0]) {
                const uri = response.assets[0].uri;
                if (uri) {
                  setItem(prevState => ({
                    ...prevState,
                    photoUrl: Platform.OS === 'android' ? `file://${uri}` : uri,
                  }));
                }
              }
            },
          );
        },
      },
      {
        text: '취소',
        style: 'cancel',
      },
    ]);
  }, []);
  const [modalVisible, setModalVisible] = useState(false);
  const onPressCalandar = useCallback(() => {
    setModalVisible(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const params = routes.params as any;

      // 수정 모드일 때 item이 전달되면 업데이트
      if (routes.name === 'Update' && params?.item) {
        setItem(params.item);
      }

      // 날짜 선택 업데이트
      if (params?.selectedDate) {
        setItem(prevState => ({
          ...prevState,
          date: params.selectedDate,
        }));
        navigation.setParams({...params, selectedDate: undefined} as any);
      }
    }, [routes.params, routes.name, navigation]),
  );

  const onChangeComment = useCallback<(text: string) => void>(text => {
    setItem(prevState => ({
      ...prevState,
      comment: text,
    }));
  }, []);

  const onPressSave = useCallback(async () => {
    // 유효성 검사
    if (!item.price || item.price <= 0) {
      Alert.alert('입력 오류', '금액을 입력해주세요.');
      return;
    }

    if (!item.comment || item.comment.trim() === '') {
      Alert.alert('입력 오류', '내용을 입력해주세요.');
      return;
    }

    try {
      if (routes.name === 'Add') {
        await insertItem(item);
        navigation.goBack();
      } else if (routes.name === 'Update') {
        const updatedItem = await updateItem(item);
        if (routes.params && 'onChangeData' in routes.params) {
          routes.params.onChangeData(updatedItem);
        }
        navigation.goBack();
      }
    } catch (error: any) {
      Alert.alert('오류', error.message || '저장 중 오류가 발생했습니다.');
    }
  }, [insertItem, item, navigation, routes.name, routes.params, updateItem]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <Header>
        <Header.Title
          title={routes.name === 'Add' ? '내역 추가' : '내역 수정'}
        />
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <FontAwesomeIcon icon={faClose} />
        </Pressable>
      </Header>
      <ScrollView
        style={{flex: 1, backgroundColor: colors.background}}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: scaleWidth(12),
          paddingHorizontal: spacing.horizontal,
        }}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled">
        <TypeSelector
          selectedType={item.type}
          onSelectType={onPressType}
          disabled={false}
        />

        <Spacer space={scaleWidth(20)} />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <SingleLineInput
              value={item.price === 0 ? '' : item.price.toString()}
              placeholder="금액을 입력해주세요"
              onChangeText={onChangePrice}
              keyboardType="number-pad"
              fontSize={scaleWidth(16)}
            />
            <Spacer space={scaleWidth(24)} />
            <DatePickerButton
              date={item.date}
              onPress={onPressCalandar}
              placeholder="날짜를 선택하세요"
            />
          </View>

          <View style={{marginLeft: scaleWidth(24)}}>
            <PhotoPicker
              photoUrl={item.photoUrl}
              onPress={onPressPhoto}
              onDelete={
                item.photoUrl
                  ? () => {
                      setItem(prevState => ({
                        ...prevState,
                        photoUrl: null,
                      }));
                    }
                  : undefined
              }
            />
          </View>
        </View>

        <Spacer space={scaleWidth(12)} />

        <MultiLineInput
          value={item.comment}
          height={scaleWidth(100)}
          onChangeText={onChangeComment}
          placeholder="어떤 일인가요?"
          onSubmitEditing={() => {}}
        />

        <Spacer space={scaleWidth(64)} />
        <Button
          title={routes.name === 'Add' ? '저장하기' : '수정하기'}
          onPress={onPressSave}
          variant="primary"
        />
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}>
          <CalendarSelectScreen
            onSelectDate={date => {
              setItem(prevState => ({
                ...prevState,
                date: date,
              }));
              setModalVisible(false);
            }}
            onClose={() => setModalVisible(false)}
          />
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};
