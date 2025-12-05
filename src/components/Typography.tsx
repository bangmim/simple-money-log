import React from 'react';
import {Text as RNText, TextStyle} from 'react-native';
import {textStyles} from '../theme/typography';
import colors from '../theme/colors';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyMedium'
  | 'bodyBold'
  | 'caption'
  | 'captionMedium'
  | 'captionBold'
  | 'small'
  | 'title';

export const Typography: React.FC<{
  variant?: TypographyVariant;
  color?: string;
  fontSize?: number;
  numberOfLines?: number;
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
}> = props => {
  const variant = props.variant || 'body';
  const baseStyle = textStyles[variant];

  return (
    <RNText
      style={[
        baseStyle,
        {
          color: props.color ?? colors.textPrimary,
        },
        props.fontSize ? {fontSize: props.fontSize} : undefined,
        props.style,
      ]}
      numberOfLines={props.numberOfLines}>
      {props.children}
    </RNText>
  );
};
