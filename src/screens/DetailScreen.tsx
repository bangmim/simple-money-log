import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import {Header} from '../components/Header/Header';
import {faClose} from '@fortawesome/free-solid-svg-icons';
import {useRootNavigation, useRootRoute} from '../navigations/RootNavigation';
import {Spacer} from '../components/Spacer';
import {convertToDateString} from '../utils/DateUtils';
import {AccountBookHistory} from '../data/AccountBookHistory';
import {useAccountBookHistoryItem} from '../hooks/useAccountBookHistoryItem';
import {TypeSelector} from '../components/TypeSelector';
import {PhotoPicker} from '../components/PhotoPicker';
import {DatePickerButton} from '../components/DatePickerButton';
import {Button} from '../components/Button';
import {confirmDialog} from '../utils/confirmDialog';
import colors from '../theme/colors';
import {spacing} from '../theme/spacing';
import {Typography} from '../components/Typography';
import {SafeAreaView} from 'react-native-safe-area-context';

export const DetailScreen: React.FC = () => {
  const navigation = useRootNavigation();
  const routes = useRootRoute<'Detail'>();
  const [item, setItem] = useState<AccountBookHistory>(routes.params.item);
  const {deleteItem} = useAccountBookHistoryItem();

  const onPressUpdate = useCallback(() => {
    navigation.push('Update', {
      item: routes.params.item,
      onChangeData: nextItem => {
        setItem(nextItem);
      },
    });
  }, [navigation, routes.params.item]);

  const handleEditField = useCallback(() => {
    confirmDialog({
      title: '수정',
      message: '이 내역을 수정하시겠습니까?',
      confirmText: '수정',
      onConfirm: onPressUpdate,
    });
  }, [onPressUpdate]);

  const onPressDelete = useCallback(() => {
    if (typeof item.id === 'undefined') {
      return;
    }

    confirmDialog({
      title: '삭제',
      message: '정말 삭제하시겠어요?',
      confirmText: '삭제',
      onConfirm: async () => {
        await deleteItem(item.id as number);
        navigation.goBack();
      },
    });
  }, [deleteItem, item.id, navigation]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <Header>
        <Header.Title title="내역 상세" />
        <Header.Icon iconName={faClose} onPress={() => navigation.goBack()} />
      </Header>

      <ScrollView
        style={{flex: 1, backgroundColor: colors.background}}
        contentContainerStyle={{
          paddingTop: 12,
          paddingHorizontal: spacing.horizontal,
        }}>
        <TypeSelector
          selectedType={item.type}
          onSelectType={() => {}}
          disabled
        />

        <Spacer space={20} />

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <Pressable onPress={handleEditField}>
              <View
                style={{
                  borderColor: colors.border,
                  borderWidth: 1,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                }}>
                <Typography
                  variant="body"
                  color={
                    item.date === 0 ? colors.textTertiary : colors.textSecondary
                  }>
                  {item.price.toString() + '원'}
                </Typography>
              </View>
            </Pressable>

            <Spacer space={24} />

            <DatePickerButton
              date={item.date}
              onPress={handleEditField}
              placeholder="날짜를 선택하세요"
            />
          </View>

          <View style={{marginLeft: 24}}>
            <PhotoPicker photoUrl={item.photoUrl} onPress={handleEditField} />
          </View>
        </View>

        <Spacer space={12} />
        <Pressable onPress={handleEditField}>
          <View
            style={{
              alignSelf: 'stretch',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: colors.border,
              height: 100,
            }}>
            <Typography variant="h3" color={colors.textSecondary}>
              {item.comment}{' '}
            </Typography>
          </View>
        </Pressable>

        <Spacer space={64} />

        <Button title="수정하기" onPress={onPressUpdate} variant="primary" />

        <Spacer space={16} />

        <Button title="삭제하기" onPress={onPressDelete} variant="danger" />
      </ScrollView>
    </SafeAreaView>
  );
};
