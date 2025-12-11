import React, {useCallback} from 'react';
import {Pressable, TouchableWithoutFeedback, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {useRootNavigation} from '../navigations/RootNavigation';
import {Calendar} from 'react-native-calendars';
import {convertToDateString} from '../utils/DateUtils';
import colors from '../theme/colors';
import {Typography} from '../components/Typography';
import {scaleWidth} from '../utils/responsive';

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
              borderRadius: scaleWidth(16),
              backgroundColor: colors.background,
              paddingBottom: scaleWidth(16),
              overflow: 'hidden',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: scaleWidth(16),
                paddingVertical: scaleWidth(12),
                borderBottomWidth: 1,
                borderBottomColor: '#e0e0e0',
              }}>
              <Typography variant="bodyBold">날짜 선택</Typography>
              <Pressable
                onPress={handleClose}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <FontAwesomeIcon
                  icon={faTimes}
                  size={scaleWidth(18)}
                  color="black"
                />
              </Pressable>
            </View>
            <Calendar
              onDayPress={handleDayPress}
              maxDate={convertToDateString(today.getTime())}
              style={{marginTop: scaleWidth(4)}}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};
