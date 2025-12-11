import React from 'react';
import {View, StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import {spacing} from '../../theme/spacing';

type SectionCardProps = {
  children: React.ReactNode;
  style?: any;
};

export const SectionCard: React.FC<SectionCardProps> = ({children, style}) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.large,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
