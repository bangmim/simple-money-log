import React, {ReactElement} from 'react';
import {View, StyleSheet} from 'react-native';
import {Spacer} from '../Spacer';
import {scaleWidth} from '../../utils/responsive';
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
  return (
    <View
      style={{
        flexDirection: 'row',
        height: scaleWidth(56),
        borderBottomColor: 'gray',
        borderBottomWidth: StyleSheet.hairlineWidth,
        alignItems: 'center',
        marginHorizontal: scaleWidth(12),
      }}>
      <Spacer horizontal={true} space={scaleWidth(12)} />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {props.children}
      </View>
      <Spacer horizontal={true} space={scaleWidth(12)} />
    </View>
  );
};

Header.Title = HeaderTitle;
Header.Group = HeaderGroup;
Header.Icon = HeaderIcon;
