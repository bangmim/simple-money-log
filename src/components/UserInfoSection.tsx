import React from 'react';
import {View, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {Typography} from './Typography';
import colors from '../theme/colors';
import {spacing} from '../theme/spacing';
import {scaleWidth} from '../utils/responsive';

type UserInfoSectionProps = {
  nickname: string;
  email: string;
};

export const UserInfoSection: React.FC<UserInfoSectionProps> = ({
  nickname,
  email,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <FontAwesomeIcon icon={faUser} size={50} color={colors.textInverse} />
      </View>
      <Typography variant="h3" style={styles.nickname}>
        {nickname || '사용자'}
      </Typography>
      <Typography variant="caption" color={colors.textSecondary}>
        {email || ''}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.large,
    padding: spacing.large,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.medium,
  },
  nickname: {
    marginBottom: scaleWidth(4),
  },
});
