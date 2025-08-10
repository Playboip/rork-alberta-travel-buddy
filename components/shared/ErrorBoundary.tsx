import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ErrorBoundaryState { hasError: boolean; errorMessage: string; }

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message = typeof error === 'object' && error && 'message' in error ? String((error as any).message) : 'Unexpected error';
    return { hasError: true, errorMessage: message };
  }

  componentDidCatch(error: unknown) {
    console.error('ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container} testID="error-boundary">
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>{this.state.errorMessage}</Text>
        </View>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff1f2' },
  title: { fontSize: 18, fontWeight: '700', color: '#be123c', marginBottom: 8 },
  message: { fontSize: 14, color: '#881337', textAlign: 'center' },
});