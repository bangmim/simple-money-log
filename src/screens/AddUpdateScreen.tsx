import React, {useCallback, useState} from 'react';
import {Image, Pressable, ScrollView, Text, View} from 'react-native';
import {Header} from '../components/Header/Header';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faClose, faPlus} from '@fortawesome/free-solid-svg-icons';
import {useRootNavigation, useRootRoute} from '../navigations/RootNavigation';
import {AccountBookHistory} from '../data/AccountBookHistory';
import {Spacer} from '../components/Spacer';
import {SingleLineInput} from '../components/SingleLineInput';
import {convertToDateString} from '../utils/DateUtils';
import {MultiLineInput} from '../components/MultiLineInput';
import {useAccountBookHistoryItem} from '../hooks/useAccountBookHistoryItem';

export const AddUpdateScreen: React.FC = () => {
  const navigation = useRootNavigation<'Add' | 'Update'>();
  const routes = useRootRoute<'Add' | 'Update'>();

  const {insertItem, updateItem} = useAccountBookHistoryItem();

  const [item, setItem] = useState<AccountBookHistory>(
    routes.params?.item ?? {
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
    navigation.push('TakePhoto', {
      onTakePhoto: url => {
        setItem(prevState => ({
          ...prevState,
          photoUrl: url,
        }));
      },
    });
  }, [navigation]);

  const onPressCalandar = useCallback(() => {
    navigation.push('CalendarSelect', {
      onSelectDay: date => {
        setItem(prevState => ({
          ...prevState,
          date: date,
        }));
      },
    });
  }, [navigation]);

  const onChangeComment = useCallback<(text: string) => void>(text => {
    setItem(prevState => ({
      ...prevState,
      comment: text,
    }));
  }, []);

  const onPressSave = useCallback(() => {
    if (routes.name === 'Add') {
      insertItem(item).then(() => navigation.goBack());
    }

    if (routes.name === 'Update') {
      updateItem(item).then(updateItem => {
        console.log('!!!!updateItem!!!', updateItem);
        routes.params?.onChangeData(updateItem);

        navigation.goBack();
      });
    }
  }, [insertItem, item, navigation, routes.name, routes.params, updateItem]);

  return (
    <View style={{flex: 1}}>
      <Header>
        <Header.Title title="Add/Update SCREEN"></Header.Title>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}>
          <FontAwesomeIcon icon={faClose} />
        </Pressable>
      </Header>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{paddingTop: 12, paddingHorizontal: 24}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Pressable onPress={() => onPressType('사용')}>
              <View
                style={{
                  backgroundColor: item.type === '사용' ? 'black' : 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 12,
                  borderTopLeftRadius: 12,
                  borderBottomLeftRadius: 12,
                }}>
                <Text
                  style={[
                    item.type === '사용' ? {color: 'white'} : {color: 'black'},
                    {fontSize: 16},
                  ]}>
                  사용
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={{flex: 1}}>
            <Pressable onPress={() => onPressType('수입')}>
              <View
                style={{
                  backgroundColor: item.type === '수입' ? 'black' : 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 12,
                  borderTopRightRadius: 12,
                  borderBottomRightRadius: 12,
                }}>
                <Text
                  style={[
                    item.type === '수입' ? {color: 'white'} : {color: 'black'},
                    {fontSize: 20},
                  ]}>
                  수입
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

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
            <Pressable onPress={onPressCalandar}>
              <View
                style={{
                  borderColor: 'lightgray',
                  borderWidth: 1,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                }}>
                <Text
                  style={[
                    item.date === 0 ? {color: 'lightgray'} : {color: 'gray'},
                    {fontSize: 16},
                  ]}>
                  {item.date !== 0
                    ? convertToDateString(item.date)
                    : '날짜를 선택하세요'}{' '}
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={{marginLeft: 24}}>
            <Pressable onPress={onPressPhoto}>
              {item.photoUrl ? (
                <Image
                  source={{uri: item?.photoUrl}}
                  width={100}
                  height={100}
                  style={{
                    borderRadius: 12,
                    backgroundColor: 'lightgray',
                    alignItems: 'center',
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 12,
                    backgroundColor: 'lightgray',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <FontAwesomeIcon icon={faPlus} size={24} color="gray" />
                </View>
              )}
            </Pressable>
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
        <Pressable onPress={onPressSave}>
          <View
            style={{
              paddingVertical: 12,
              backgroundColor: 'black',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}>
            <Text style={{fontSize: 16, color: 'white'}}>
              {routes.name === 'Add' ? '저장하기' : '수정하기'}
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
};
