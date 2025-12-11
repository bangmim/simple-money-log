import React from 'react';
import {Pressable} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {iconSizes} from '../../theme/spacing';
export const HeaderIcon: React.FC<{
  onPress: () => void;
  iconName: IconProp;
}> = props => {
  return (
    <Pressable
      onPress={props.onPress}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
      <FontAwesomeIcon
        icon={props.iconName}
        size={iconSizes.headerCloseButton}
        color="black"
      />
    </Pressable>
  );
};
