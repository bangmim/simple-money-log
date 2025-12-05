import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

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
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    color: 'gray',
  },
});
