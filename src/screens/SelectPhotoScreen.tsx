import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Image, Pressable, Text, View} from 'react-native';
import {Header} from '../components/Header/Header';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faClose} from '@fortawesome/free-solid-svg-icons';
import {useRootNavigation, useRootRoute} from '../navigations/RootNavigation';
import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../theme/colors';
import {Typography} from '../components/Typography';
import {scaleWidth} from '../utils/responsive';

export const SelectPhotoScreen: React.FC = () => {
  const navigation = useRootNavigation<'SelectPhoto'>();
  const routes = useRootRoute<'SelectPhoto'>();
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);

  useEffect(() => {
    CameraRoll.getPhotos({
      first: scaleWidth(100),
      assetType: 'Photos',
    })
      .then(result => {
        setPhotos(result.edges);
      })
      .catch(error => {
        console.warn('Failed to load photos', error);
      });
  }, []);

  const handleSelect = useCallback(
    (uri: string) => {
      routes.params.onSelectPhoto(uri);
      navigation.goBack();
    },
    [navigation, routes.params],
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <Header>
        <Header.Title title="앨범에서 선택" />
        <Pressable onPress={navigation.goBack}>
          <FontAwesomeIcon icon={faClose} />
        </Pressable>
      </Header>
      <FlatList
        data={photos}
        numColumns={3}
        keyExtractor={item => item.node.image.uri}
        contentContainerStyle={{padding: scaleWidth(8)}}
        renderItem={({item}) => (
          <Pressable
            onPress={() => handleSelect(item.node.image.uri)}
            style={{margin: scaleWidth(4)}}>
            <Image
              source={{uri: item.node.image.uri}}
              style={{
                width: scaleWidth(110),
                height: scaleWidth(110),
                borderRadius: scaleWidth(8),
              }}
            />
          </Pressable>
        )}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Typography variant="caption">표시할 사진이 없습니다.</Typography>
          </View>
        }
      />
    </SafeAreaView>
  );
};
