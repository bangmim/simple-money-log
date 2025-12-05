import React, {ReactElement} from 'react';
import {View, useWindowDimensions} from 'react-native';
import {Spacer} from '../Spacer';
import {HeaderTitle} from './HeaderTitle';
import {HeaderGroup} from './HeaderGroup';
import {HeaderIcon} from './HeaderIcon';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

type CompoundComposition = {
  Title: React.FC<{title: string}>;
  Group: React.FC<{children: ReactElement[]}>;
  Icon: React.FC<{onPress: () => void; iconName: IconProp}>;
};

export const Header: React.FC<{
  children: ReactElement | ReactElement[];
}> &
  CompoundComposition = props => {
  const {width} = useWindowDimensions();

  return (
    <View
      style={{
        width: width,
        flexDirection: 'row',
        height: 56,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        alignItems: 'center',
      }}>
      <Spacer horizontal={true} space={12} />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {props.children}
      </View>
      <Spacer horizontal={true} space={12} />
    </View>
  );
};

Header.Title = HeaderTitle;
Header.Group = HeaderGroup;
Header.Icon = HeaderIcon;
