import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Typography} from './Typography';

type EmptyStateProps = {
  message: string;
  height?: number;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  height = 220,
}) => {
  return (
    <View style={[styles.container, {height}]}>
      <Typography variant="caption" color="gray">
        {message}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
