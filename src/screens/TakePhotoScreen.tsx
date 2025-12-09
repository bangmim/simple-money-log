import React, {useCallback, useEffect, useRef} from 'react';
import {Platform, Pressable, View} from 'react-native';
import {Header} from '../components/Header/Header';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faClose} from '@fortawesome/free-solid-svg-icons';
import {useRootNavigation, useRootRoute} from '../navigations/RootNavigation';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import colors from '../theme/colors';
import {scaleWidth} from '../utils/responsive';

export const TakePhotoScreen: React.FC = () => {
  const navigation = useRootNavigation<'TakePhoto'>();
  const routes = useRootRoute<'TakePhoto'>();
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('back');

  useEffect(() => {
    Camera.requestCameraPermission();
  }, []);

  const onPressTakePhoto = useCallback(async () => {
    const result = await cameraRef.current?.takePhoto({
      enableShutterSound: false,
    });
    if (result) {
      const path = `${Platform.OS === 'android' ? 'file://' : ''}${
        result.path
      }`;

      await CameraRoll.save(path, {
        type: 'photo',
        album: 'simplemoneylog',
      });

      routes.params.onTakePhoto(path);
    }
    navigation.goBack();
  }, [routes.params, navigation]);
  if (device == null) return;

  return (
    <View style={{flex: 1, backgroundColor: colors.background}}>
      <Header>
        <Header.Title title="사진 찍기"></Header.Title>
        <Pressable
          onPress={navigation.goBack}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <FontAwesomeIcon icon={faClose} />
        </Pressable>
      </Header>

      <View style={{flex: 1}}>
        <View style={{flex: 2}}>
          {device !== null && (
            <Camera
              ref={cameraRef}
              style={{flex: 1}}
              device={device}
              isActive={true}
              photo={true}
            />
          )}
        </View>
        <View style={{flex: 1}}>
          <Pressable onPress={onPressTakePhoto}>
            <View
              style={{
                width: scaleWidth(100),
                height: scaleWidth(100),
                borderRadius: scaleWidth(50),
                backgroundColor: 'black',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: scaleWidth(80),
                  height: scaleWidth(80),
                  borderRadius: scaleWidth(40),
                  backgroundColor: 'white',
                }}></View>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
