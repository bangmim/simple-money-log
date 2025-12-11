import React from 'react';
import {Pressable, View, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {IconDefinition} from '@fortawesome/free-solid-svg-icons';
import {Typography} from '../Typography';
import colors from '../../theme/colors';
import {spacing} from '../../theme/spacing';

type SectionItemProps = {
  icon: IconDefinition;
  iconColor?: string;
  iconBgColor?: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  disabled?: boolean;
  showLoading?: boolean;
  rightElement?: React.ReactNode;
  borderBottom?: boolean;
  backgroundColor?: string;
};

export const SectionItem: React.FC<SectionItemProps> = ({
  icon,
  iconColor = colors.primary,
  iconBgColor = colors.primary + '20',
  title,
  subtitle,
  onPress,
  disabled = false,
  showLoading = false,
  rightElement,
  borderBottom = false,
  backgroundColor,
}) => {
  const content = (
    <View
      style={[
        styles.container,
        borderBottom && styles.borderBottom,
        backgroundColor ? {backgroundColor} : undefined,
      ]}>
      <View style={[styles.iconContainer, {backgroundColor: iconBgColor}]}>
        <FontAwesomeIcon icon={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Typography variant="body" color={colors.textPrimary}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color={colors.textSecondary}>
            {subtitle}
          </Typography>
        )}
      </View>
      {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || showLoading}
        style={({pressed}) => [
          styles.pressable,
          pressed && styles.pressed,
          (disabled || showLoading) && styles.disabled,
        ]}>
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,
  },
  pressable: {
    backgroundColor: 'transparent',
  },
  pressed: {
    backgroundColor: colors.backgroundTertiary,
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.medium,
  },
  textContainer: {
    flex: 1,
  },
  rightElement: {
    marginLeft: spacing.small,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
});
