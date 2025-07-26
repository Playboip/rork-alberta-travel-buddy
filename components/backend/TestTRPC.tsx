import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { trpc } from '@/lib/trpc';

export default function TestTRPC() {
  const [name, setName] = useState<string>('World');
  const [result, setResult] = useState<string>('');

  const hiMutation = trpc.example.hi.useMutation({
    onSuccess: (data) => {
      setResult(`Hello ${data.hello}! Response received at: ${data.date}`);
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  const handleTest = () => {
    hiMutation.mutate({ name });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>tRPC Backend Test</Text>
      <Text style={styles.description}>
        Test the backend connection by sending a &quot;hi&quot; message
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          testID="name-input"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, hiMutation.isPending && styles.buttonDisabled]}
        onPress={handleTest}
        disabled={hiMutation.isPending}
        testID="test-button"
      >
        <Text style={styles.buttonText}>
          {hiMutation.isPending ? 'Sending...' : 'Test Backend'}
        </Text>
      </TouchableOpacity>

      {result ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Response:</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      ) : null}

      {hiMutation.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error: {hiMutation.error.message}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 14,
    color: '#0c4a6e',
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    lineHeight: 20,
  },
});