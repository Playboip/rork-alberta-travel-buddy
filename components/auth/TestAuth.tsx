import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { useAuth } from '@/hooks/auth-context';
import { supabase } from '@/lib/supabase';

export default function TestAuth() {
  const { user, session, isLoading, isAuthenticated, register, login } = useAuth();
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('testpass123');
  const [testName, setTestName] = useState('Test User');
  const [testLocation, setTestLocation] = useState('Calgary, AB');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testConnection = async () => {
    setTesting(true);
    addLog('Starting connection test...');
    
    try {
      addLog('Testing Supabase connection...');
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        addLog(`Connection test failed: ${error.message}`);
        Alert.alert('Connection Test', `Failed: ${error.message}`);
      } else {
        addLog('Connection test successful!');
        Alert.alert('Connection Test', 'Supabase connection successful!');
      }
    } catch (error: any) {
      addLog(`Connection test error: ${error.message}`);
      Alert.alert('Connection Test', 'Connection failed');
    } finally {
      setTesting(false);
    }
  };

  const testAuth = async () => {
    setTesting(true);
    addLog('Starting auth test...');
    
    try {
      addLog('Testing auth connection...');
      const { data: authData, error: authError } = await supabase.auth.getSession();
      if (authError) {
        throw new Error(`Auth connection failed: ${authError.message}`);
      }
      
      addLog('Auth connection successful');
      Alert.alert('Auth Test', 'Authentication service is working!');
      
    } catch (error: any) {
      addLog(`Auth test failed: ${error.message}`);
      Alert.alert('Auth Test Failed', error.message);
    } finally {
      setTesting(false);
    }
  };

  const testRegistration = async () => {
    setTesting(true);
    addLog('Starting registration test...');
    
    try {
      addLog(`Attempting to register: ${testEmail}`);
      await register(testEmail, testPassword, testName, testLocation);
      addLog('Registration successful!');
      Alert.alert('Registration Test', 'Registration successful!');
    } catch (error: any) {
      addLog(`Registration failed: ${error.message}`);
      Alert.alert('Registration Test Failed', error.message);
    } finally {
      setTesting(false);
    }
  };

  const testLogin = async () => {
    setTesting(true);
    addLog('Starting login test...');
    
    try {
      addLog(`Attempting to login: ${testEmail}`);
      await login(testEmail, testPassword);
      addLog('Login successful!');
      Alert.alert('Login Test', 'Login successful!');
    } catch (error: any) {
      addLog(`Login failed: ${error.message}`);
      Alert.alert('Login Test Failed', error.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Authentication Debug</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.label}>Loading: {isLoading ? 'Yes' : 'No'}</Text>
        <Text style={styles.label}>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</Text>
        <Text style={styles.label}>User ID: {user?.id || 'None'}</Text>
        <Text style={styles.label}>User Name: {user?.name || 'None'}</Text>
        <Text style={styles.label}>Session: {session ? 'Active' : 'None'}</Text>
      </View>

      <View style={styles.testForm}>
        <Text style={styles.formTitle}>Test Registration Data:</Text>
        <TextInput
          style={styles.input}
          placeholder="Test Email"
          value={testEmail}
          onChangeText={setTestEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Test Password"
          value={testPassword}
          onChangeText={setTestPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Test Name"
          value={testName}
          onChangeText={setTestName}
        />
        <TextInput
          style={styles.input}
          placeholder="Test Location"
          value={testLocation}
          onChangeText={setTestLocation}
        />
      </View>

      <TouchableOpacity 
        style={styles.testButton} 
        onPress={testConnection}
        disabled={testing}
      >
        <Text style={styles.testButtonText}>
          {testing ? 'Testing...' : 'Test Database Connection'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.testButton} 
        onPress={testAuth}
        disabled={testing}
      >
        <Text style={styles.testButtonText}>
          {testing ? 'Testing...' : 'Test Auth Service'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.testButton} 
        onPress={testRegistration}
        disabled={testing}
      >
        <Text style={styles.testButtonText}>
          {testing ? 'Testing...' : 'Test Registration'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.testButton} 
        onPress={testLogin}
        disabled={testing}
      >
        <Text style={styles.testButtonText}>
          {testing ? 'Testing...' : 'Test Login'}
        </Text>
      </TouchableOpacity>

      {/* Logs Section */}
      <View style={styles.logsContainer}>
        <View style={styles.logsHeader}>
          <Text style={styles.logsTitle}>Debug Logs</Text>
          <TouchableOpacity onPress={clearLogs} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.logsScroll} nestedScrollEnabled>
          {logs.map((log, index) => (
            <Text key={index} style={styles.logText}>{log}</Text>
          ))}
          {logs.length === 0 && (
            <Text style={styles.noLogsText}>No logs yet. Run a test to see debug information.</Text>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  statusContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#374151',
  },
  testForm: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    fontSize: 14,
  },
  testButton: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  logsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    maxHeight: 300,
  },
  logsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  clearButton: {
    backgroundColor: '#ef4444',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  logsScroll: {
    maxHeight: 200,
  },
  logText: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  noLogsText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});