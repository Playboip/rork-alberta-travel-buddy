import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import TestAuth from '@/components/auth/TestAuth';
import TestTRPC from '@/components/backend/TestTRPC';

export default function TestScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Test Setup' }} />
      <ScrollView style={styles.container}>
        <TestTRPC />
        <TestAuth />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});