import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Typography} from '../Typography';
import colors from '../../theme/colors';
import {spacing} from '../../theme/spacing';

type SectionHeaderProps = {
  title: string;
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({title}) => {
  return (
    <View style={styles.container}>
      <Typography variant="bodyBold" fontSize={16}>
        {title}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
});
