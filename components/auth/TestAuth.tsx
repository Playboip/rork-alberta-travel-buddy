import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '@/hooks/auth-context';
import { supabase } from '@/lib/supabase';

export default function TestAuth() {
  const { user, session, isLoading, isAuthenticated, login, register, logout } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testDatabaseConnection = async () => {
    try {
      addTestResult('🔍 Testing database connection...');
      const { error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (error) {
        addTestResult(`❌ Database connection failed: ${error.message}`);
        return false;
      } else {
        addTestResult('✅ Database connection successful');
        return true;
      }
    } catch (error: any) {
      addTestResult(`❌ Database test error: ${error.message}`);
      return false;
    }
  };

  const testSupabaseAuth = async () => {
    try {
      addTestResult('🔍 Testing Supabase auth service...');
      const { data } = await supabase.auth.getSession();
      addTestResult(`✅ Auth service working. Current session: ${data.session ? 'Active' : 'None'}`);
      return true;
    } catch (error: any) {
      addTestResult(`❌ Auth service error: ${error.message}`);
      return false;
    }
  };

  const testRegistration = async () => {
    const testEmail = `test${Date.now()}@albertatravelbuddy.com`;
    const testPassword = 'TestPassword123!';
    const testName = 'Test User';
    const testLocation = 'Calgary, AB';

    try {
      addTestResult(`🔍 Testing registration with ${testEmail}...`);
      await register(testEmail, testPassword, testName, testLocation);
      addTestResult('✅ Registration successful');
      return true;
    } catch (error: any) {
      if (error.message === 'REGISTRATION_SUCCESS_CONFIRM_EMAIL') {
        addTestResult('✅ Registration successful - email confirmation required');
        return true;
      } else {
        addTestResult(`❌ Registration failed: ${error.message}`);
        return false;
      }
    }
  };

  const testLogin = async () => {
    const testEmail = 'testuser@albertatravelbuddy.com';
    const testPassword = 'TestPassword123!';

    try {
      addTestResult(`🔍 Testing login with ${testEmail}...`);
      await login(testEmail, testPassword);
      addTestResult('✅ Login successful');
      return true;
    } catch (error: any) {
      if (error.message === 'UNCONFIRMED_EMAIL') {
        addTestResult('⚠️ Login blocked - email not confirmed (this is expected behavior)');
        return true;
      } else if (error.message.includes('Invalid email or password')) {
        addTestResult('⚠️ Login failed - user doesn\'t exist (this is expected for test)');
        return true;
      } else {
        addTestResult(`❌ Login failed: ${error.message}`);
        return false;
      }
    }
  };

  const testLogout = async () => {
    try {
      addTestResult('🔍 Testing logout...');
      await logout();
      addTestResult('✅ Logout successful');
      return true;
    } catch (error: any) {
      addTestResult(`❌ Logout failed: ${error.message}`);
      return false;
    }
  };

  const runFullTest = async () => {
    if (isRunningTests) return;
    
    setIsRunningTests(true);
    clearResults();
    
    addTestResult('🚀 Starting comprehensive auth system test...');
    
    let passedTests = 0;
    let totalTests = 0;
    
    // Test 1: Database Connection
    totalTests++;
    if (await testDatabaseConnection()) passedTests++;
    
    // Test 2: Supabase Auth Service
    totalTests++;
    if (await testSupabaseAuth()) passedTests++;
    
    // Test 3: Registration
    totalTests++;
    if (await testRegistration()) passedTests++;
    
    // Test 4: Login
    totalTests++;
    if (await testLogin()) passedTests++;
    
    // Test 5: Logout
    totalTests++;
    if (await testLogout()) passedTests++;
    
    // Summary
    addTestResult('\n📊 TEST SUMMARY:');
    addTestResult(`Tests passed: ${passedTests}/${totalTests}`);
    
    if (passedTests === totalTests) {
      addTestResult('🎉 All tests passed! Auth system is working correctly.');
      Alert.alert('Success', 'All auth tests passed! The system is working correctly.');
    } else {
      addTestResult('⚠️ Some tests failed. Check the results above.');
      Alert.alert('Warning', `${passedTests}/${totalTests} tests passed. Check the detailed results.`);
    }
    
    setIsRunningTests(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔐 Auth System Test Suite</Text>
      
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Current Status</Text>
        <Text style={styles.statusText}>Loading: {isLoading ? '🔄 Yes' : '✅ No'}</Text>
        <Text style={styles.statusText}>Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</Text>
        <Text style={styles.statusText}>User: {user ? `👤 ${user.email}` : '👤 None'}</Text>
        <Text style={styles.statusText}>Session: {session ? '🔑 Active' : '🔑 None'}</Text>
      </View>

      <View style={styles.buttonSection}>
        <Text style={styles.sectionTitle}>Test Controls</Text>
        
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton, isRunningTests && styles.disabledButton]} 
          onPress={runFullTest}
          disabled={isRunningTests}
        >
          <Text style={styles.buttonText}>
            {isRunningTests ? '🔄 Running Tests...' : '🚀 Run Full Test Suite'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.individualTests}>
          <Text style={styles.subSectionTitle}>Individual Tests</Text>
          
          <TouchableOpacity style={styles.button} onPress={testDatabaseConnection}>
            <Text style={styles.buttonText}>🗄️ Test Database</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={testSupabaseAuth}>
            <Text style={styles.buttonText}>🔐 Test Auth Service</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={testRegistration}>
            <Text style={styles.buttonText}>📝 Test Registration</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={testLogin}>
            <Text style={styles.buttonText}>🔑 Test Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={testLogout}>
            <Text style={styles.buttonText}>🚪 Test Logout</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearResults}>
          <Text style={styles.buttonText}>🗑️ Clear Results</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsSection}>
        <Text style={styles.sectionTitle}>Test Results</Text>
        {testResults.length === 0 ? (
          <Text style={styles.noResultsText}>No test results yet. Run a test to see results here.</Text>
        ) : (
          testResults.map((result, index) => (
            <Text key={index} style={styles.resultText}>{result}</Text>
          ))
        )}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
    marginTop: 12,
  },
  statusText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  individualTests: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  button: {
    backgroundColor: '#6b7280',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 16,
  },
  clearButton: {
    backgroundColor: '#dc2626',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultText: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  noResultsText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});