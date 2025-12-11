import React from 'react';
import {Pressable} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {scaleWidth} from '../../utils/responsive';
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
        size={scaleWidth(20)}
        color="black"
      />
    </Pressable>
  );
};
