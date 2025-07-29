import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface LogoProps {
  size?: number;
  style?: any;
}

export default function Logo({ size = 120, style }: LogoProps) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: 'https://r2-pub.rork.com/attachments/l2qk4ryqe5ibzsbobqeuw' }}
        style={[styles.logo, { width: size, height: size }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    borderRadius: 8,
  },
});