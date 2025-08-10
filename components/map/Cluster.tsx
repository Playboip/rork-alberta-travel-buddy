import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ClusterProps { count: number; color: string; }

function ClusterBase({ count, color }: ClusterProps) {
  return (
    <View style={[styles.container, { borderColor: color }]} testID="cluster">
      <View style={[styles.inner, { backgroundColor: color + '22' }]}> 
        <Text style={[styles.text, { color }]}>{count}</Text>
      </View>
    </View>
  );
}

export const Cluster = memo(ClusterBase);

const styles = StyleSheet.create({
  container: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' },
  inner: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 13, fontWeight: '700' },
});