import {Dimensions} from 'react-native';

const FIGMA_WINDOW_WIDTH = 375;

export const width: number = Number(
  (Dimensions.get('window').width * (1 / FIGMA_WINDOW_WIDTH)).toFixed(2),
);

export const scaleWidth = (size: number): number => {
  return size * width;
};
