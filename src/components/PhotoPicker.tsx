import React from 'react';
import {Image, Pressable, View, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import colors from '../theme/colors';

type PhotoPickerProps = {
  photoUrl: string | null;
  onPress: () => void;
  size?: number;
};

export const PhotoPicker: React.FC<PhotoPickerProps> = ({
  photoUrl,
  onPress,
  size = 100,
}) => {
  return (
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
            size={24}
            color={colors.textSecondary}
          />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 12,
    backgroundColor: colors.backgroundTertiary,
  },
  placeholder: {
    borderRadius: 12,
    backgroundColor: colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
