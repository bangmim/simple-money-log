import React, {useCallback, useState} from 'react';
import {Alert, Modal, Pressable, ScrollView, View} from 'react-native';
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

export const AddUpdateScreen: React.FC = () => {
  const navigation = useRootNavigation<'Add' | 'Update'>();
  const routes = useRootRoute<'Add' | 'Update'>();

  const {insertItem, updateItem} = useAccountBookHistoryItem();

  const [item, setItem] = useState<AccountBookHistory>(
    (routes.params && 'item' in routes.params ? routes.params.item : null) ?? {
      type: '사용',
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
      if (routes.name === 'Update') {
        return;
      }
      setItem(prevItem => {
        return {
          ...prevItem,
          type: type,
        };
      });
    },
    [routes.name],
  );
  const onChangePrice = useCallback<(text: string) => void>(text => {
    setItem(prevState => ({
      ...prevState,
      price: parseInt(text),
    }));
  }, []);

  const onPressPhoto = useCallback(() => {
    Alert.alert('사진 추가', '어떤 방법으로 사진을 추가할까요?', [
      {
        text: '카메라로 촬영',
        onPress: () => {
          navigation.push('TakePhoto', {
            onTakePhoto: url => {
              setItem(prevState => ({
                ...prevState,
                photoUrl: url,
              }));
            },
          });
        },
      },
      {
        text: '앨범에서 선택',
        onPress: () => {
          navigation.push('SelectPhoto', {
            onSelectPhoto: url => {
              setItem(prevState => ({
                ...prevState,
                photoUrl: url,
              }));
            },
          });
        },
      },
      {
        text: '취소',
        style: 'cancel',
      },
    ]);
  }, [navigation]);
  const [modalVisible, setModalVisible] = useState(false);
  const onPressCalandar = useCallback(() => {
    setModalVisible(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const params = routes.params as any;
      if (params?.selectedDate) {
        setItem(prevState => ({
          ...prevState,
          date: params.selectedDate,
        }));
        navigation.setParams({...params, selectedDate: undefined} as any);
      }
    }, [routes.params, navigation]),
  );

  const onChangeComment = useCallback<(text: string) => void>(text => {
    setItem(prevState => ({
      ...prevState,
      comment: text,
    }));
  }, []);

  const onPressSave = useCallback(async () => {
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
          }}>
          <FontAwesomeIcon icon={faClose} />
        </Pressable>
      </Header>
      <ScrollView
        style={{flex: 1, backgroundColor: colors.background}}
        contentContainerStyle={{
          paddingTop: 12,
          paddingHorizontal: spacing.horizontal,
        }}>
        <TypeSelector
          selectedType={item.type}
          onSelectType={onPressType}
          disabled={routes.name === 'Update'}
        />

        <Spacer space={20} />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <SingleLineInput
              value={item.price === 0 ? '' : item.price.toString()}
              placeholder="금액을 입력해주세요"
              onChangeText={onChangePrice}
              keyboardType="number-pad"
              fontSize={16}
            />
            <Spacer space={24} />
            <DatePickerButton
              date={item.date}
              onPress={onPressCalandar}
              placeholder="날짜를 선택하세요"
            />
          </View>

          <View style={{marginLeft: 24}}>
            <PhotoPicker photoUrl={item.photoUrl} onPress={onPressPhoto} />
          </View>
        </View>

        <Spacer space={12} />

        <MultiLineInput
          value={item.comment}
          height={100}
          onChangeText={onChangeComment}
          placeholder="어떤 일인가요?"
          onSubmitEditing={() => {}}
        />

        <Spacer space={64} />
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
