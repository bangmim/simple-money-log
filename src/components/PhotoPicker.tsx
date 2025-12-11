import React from 'react';
import {Image, Pressable, View, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus, faTimes} from '@fortawesome/free-solid-svg-icons';
import colors from '../theme/colors';
import {iconSizes} from '../theme/spacing';
import {scaleWidth} from '../utils/responsive';

type PhotoPickerProps = {
  photoUrl: string | null;
  onPress: () => void;
  onDelete?: () => void;
  size?: number;
};

export const PhotoPicker: React.FC<PhotoPickerProps> = ({
  photoUrl,
  onPress,
  onDelete,
  size = scaleWidth(100),
}) => {
  return (
    <View style={{position: 'relative'}}>
      <Pressable onPress={onPress}>
        {photoUrl ? (
          <Image
            source={{uri: photoUrl}}
            style={[styles.image, {width: size, height: size}]}
          />
        ) : (
          <View style={[styles.placeholder, {width: size, height: size}]}>
            <FontAwesomeIcon
              icon={faPlus}
              size={scaleWidth(24)}
              color={colors.textSecondary}
            />
          </View>
        )}
      </Pressable>
      {photoUrl &&
        typeof photoUrl === 'string' &&
        photoUrl.trim().length > 0 &&
        onDelete && (
          <Pressable
            onPress={onDelete}
            style={[
              styles.deleteButton,
              {width: size * 0.3, height: size * 0.3},
            ]}
            hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}>
            <FontAwesomeIcon
              icon={faTimes}
              size={iconSizes.photoPickerCloseButton}
              color={colors.textInverse}
            />
          </Pressable>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: scaleWidth(12),
    backgroundColor: colors.backgroundTertiary,
  },
  placeholder: {
    borderRadius: scaleWidth(12),
    backgroundColor: colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: -scaleWidth(8),
    right: -scaleWidth(8),
    backgroundColor: colors.danger,
    borderRadius: scaleWidth(15),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
});
