import React from 'react';
import {AccountBookHistory} from '../data/AccountBookHistory';
import {Image, Pressable, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleMinus, faCirclePlus} from '@fortawesome/free-solid-svg-icons';
import {Spacer} from './Spacer';
import {convertToDateString} from '../utils/DateUtils';
import colors from '../theme/colors';
import {Typography} from './Typography';
import {spacing} from '../theme/spacing';
import {scaleWidth} from '../utils/responsive';

export const AccountBookHistoryListItemView: React.FC<{
  item: AccountBookHistory;
  onPressItem: (item: AccountBookHistory) => void;
}> = props => {
  const IconStyle = props.item.type === '지출' ? faCircleMinus : faCirclePlus;
  const IconColor = props.item.type === '지출' ? colors.danger : colors.accent;
  return (
    <Pressable onPress={() => props.onPressItem(props.item)}>
      <View
        style={{
          paddingVertical: scaleWidth(12),
          paddingHorizontal: spacing.horizontal,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <FontAwesomeIcon
          icon={IconStyle}
          size={scaleWidth(24)}
          color={IconColor}
        />
        <View style={{flex: 1, marginLeft: scaleWidth(12)}}>
          <Typography variant="body" color={colors.textPrimary}>
            {props.item.price.toLocaleString()}원{' '}
          </Typography>
          <Typography
            numberOfLines={2}
            variant="body"
            color={colors.textSecondary}>
            {props.item.comment}
          </Typography>
          <Spacer space={scaleWidth(4)} />
          <Typography variant="small" color={colors.textTertiary}>
            {convertToDateString(
              props.item.date !== 0 ? props.item.date : props.item.createdAt,
            )}{' '}
          </Typography>
        </View>
        {props.item.photoUrl !== null && (
          <Image
            source={{uri: props.item.photoUrl}}
            width={scaleWidth(60)}
            height={scaleWidth(60)}
            style={{
              borderRadius: scaleWidth(8),
              marginLeft: scaleWidth(8),
            }}
          />
        )}
      </View>
    </Pressable>
  );
};
