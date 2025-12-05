import React from 'react';
import {Pressable} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
export const HeaderIcon: React.FC<{
  onPress: () => void;
  iconName: IconProp;
}> = props => {
  return (
    <Pressable onPress={props.onPress}>
      <FontAwesomeIcon icon={props.iconName} size={28} color="black" />
    </Pressable>
  );
};
