import React from 'react';
import {AccountBookHistory} from '../data/AccountBookHistory';
import {Image, Pressable, Text, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleMinus, faCirclePlus} from '@fortawesome/free-solid-svg-icons';
import {Spacer} from './Spacer';
import {convertToDateString} from '../utils/DateUtils';
import colors from '../theme/colors';
import {Typography} from './Typography';
import {spacing} from '../theme/spacing';

export const AccountBookHistoryListItemView: React.FC<{
  item: AccountBookHistory;
  onPressItem: (item: AccountBookHistory) => void;
}> = props => {
  const IconStyle = props.item.type === '사용' ? faCircleMinus : faCirclePlus;
  const IconColor =
    props.item.type === '사용' ? colors.danger : colors.accent;
  return (
    <Pressable onPress={() => props.onPressItem(props.item)}>
      <View
        style={{
          paddingVertical: 12,
          paddingHorizontal: spacing.horizontal,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <FontAwesomeIcon icon={IconStyle} size={24} color={IconColor} />
        <View style={{flex: 1, marginLeft: 12}}>
          <Typography variant="body" color={colors.textPrimary}>
            {props.item.price.toLocaleString()}원{' '}
          </Typography>
          <Typography variant="body" color={colors.textSecondary}>
            {props.item.comment}
          </Typography>
          <Spacer space={4} />
          <Typography variant="small" color={colors.textTertiary}>
            {convertToDateString(
              props.item.date !== 0 ? props.item.date : props.item.createdAt,
            )}{' '}
          </Typography>
        </View>
        {props.item.photoUrl !== null && (
          <Image
            source={{uri: props.item.photoUrl}}
            width={100}
            height={100}
            style={{borderRadius: 10}}
          />
        )}
      </View>
    </Pressable>
  );
};
