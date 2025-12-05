import React, {useCallback} from 'react';
import {Pressable, Text, TouchableWithoutFeedback, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faX} from '@fortawesome/free-solid-svg-icons';
import {useRootNavigation} from '../navigations/RootNavigation';
import {Calendar} from 'react-native-calendars';
import {convertToDateString} from '../utils/DateUtils';
import colors from '../theme/colors';
import {Typography} from '../components/Typography';

const today = new Date();
today.setHours(0);
today.setMinutes(0);

type CalendarSelectScreenProps = {
  onSelectDate?: (date: number) => void;
  onClose?: () => void;
};

export const CalendarSelectScreen: React.FC<CalendarSelectScreenProps> = ({
  onSelectDate,
  onClose,
}) => {
  const navigation = useRootNavigation<'CalendarSelect'>();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      navigation.goBack();
    }
  }, [navigation, onClose]);

  const handleDayPress = useCallback(
    (day: any) => {
      if (onSelectDate) {
        // Modal에서 사용하는 경우
        onSelectDate(day.timestamp);
        if (onClose) {
          onClose();
        }
      } else {
        // Navigation에서 사용하는 경우 (기존 방식)
        const state = navigation.getState();
        const currentIndex = state.index;
        if (currentIndex > 0) {
          const prevRoute = state.routes[currentIndex - 1];
          if (prevRoute.name === 'Add') {
            navigation.navigate('Add', {
              selectedDate: day.timestamp,
            });
          } else if (prevRoute.name === 'Update') {
            navigation.navigate('Update', {
              ...(prevRoute.params as any),
              selectedDate: day.timestamp,
            });
          } else {
            handleClose();
          }
        } else {
          handleClose();
        }
      }
    },
    [navigation, handleClose, onSelectDate, onClose],
  );

  return (
    <TouchableWithoutFeedback onPress={handleClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View
            style={{
              width: '88%',
              borderRadius: 16,
              backgroundColor: colors.background,
              paddingBottom: 16,
              overflow: 'hidden',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#e0e0e0',
              }}>
              <Typography variant="bodyBold">날짜 선택</Typography>
              <Pressable onPress={handleClose}>
                <FontAwesomeIcon icon={faX} />
              </Pressable>
            </View>
            <Calendar
              onDayPress={handleDayPress}
              maxDate={convertToDateString(today.getTime())}
              style={{marginTop: 4}}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};
