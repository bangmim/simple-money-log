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

export const SelectPhotoScreen: React.FC = () => {
  const navigation = useRootNavigation<'SelectPhoto'>();
  const routes = useRootRoute<'SelectPhoto'>();
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);

  useEffect(() => {
    CameraRoll.getPhotos({
      first: 100,
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
    <SafeAreaView style={{flex: 1}}>
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
        contentContainerStyle={{padding: 8}}
        renderItem={({item}) => (
          <Pressable
            onPress={() => handleSelect(item.node.image.uri)}
            style={{margin: 4}}>
            <Image
              source={{uri: item.node.image.uri}}
              style={{width: 110, height: 110, borderRadius: 8}}
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
            <Text>표시할 사진이 없습니다.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};
