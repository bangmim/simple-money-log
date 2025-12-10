import React, {useCallback, useEffect, useState} from 'react';
import {Alert, FlatList, Image, Platform, Pressable, View} from 'react-native';
import {Header} from '../components/Header/Header';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faClose} from '@fortawesome/free-solid-svg-icons';
import {useRootNavigation, useRootRoute} from '../navigations/RootNavigation';
import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  PERMISSIONS,
  request,
  RESULTS,
  check,
  PermissionStatus,
} from 'react-native-permissions';
import colors from '../theme/colors';
import {Typography} from '../components/Typography';
import {scaleWidth} from '../utils/responsive';

export const SelectPhotoScreen: React.FC = () => {
  const navigation = useRootNavigation<'SelectPhoto'>();
  const routes = useRootRoute<'SelectPhoto'>();
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        // 권한 확인 및 요청
        let permissionStatus: PermissionStatus;

        if (Platform.OS === 'android') {
          const permission =
            Platform.Version >= 33
              ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
              : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

          permissionStatus = await check(permission);

          if (permissionStatus !== RESULTS.GRANTED) {
            permissionStatus = await request(permission);
          }
        } else {
          permissionStatus = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);

          if (permissionStatus !== RESULTS.GRANTED) {
            permissionStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
          }
        }

        if (permissionStatus !== RESULTS.GRANTED) {
          Alert.alert(
            '권한 필요',
            '앨범에서 사진을 선택하려면 앨범 접근 권한이 필요합니다.',
            [{text: '확인', onPress: () => navigation.goBack()}],
          );
          return;
        }

        // 권한이 허용된 경우 사진 로드
        const result = await CameraRoll.getPhotos({
          first: scaleWidth(100),
          assetType: 'Photos',
        });
        setPhotos(result.edges);
      } catch (error) {
        console.warn('Failed to load photos', error);
        Alert.alert('오류', '사진을 불러오는 중 오류가 발생했습니다.', [
          {text: '확인'},
        ]);
      }
    };

    loadPhotos();
  }, [navigation]);

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
        <Pressable
          onPress={navigation.goBack}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
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
