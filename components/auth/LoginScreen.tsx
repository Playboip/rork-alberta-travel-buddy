import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, MapPin } from 'lucide-react-native';
import { useAuth } from '@/hooks/auth-context';

interface LoginScreenProps {
  onSwitchToRegister: () => void;
}

export default function LoginScreen({ onSwitchToRegister }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const { login, isLoading, resendConfirmation } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setShowResendButton(false);
      await login(email, password);
    } catch (error: any) {
      console.log('Login error caught:', error);
      const errorMessage = error?.message || 'An unexpected error occurred. Please try again.';
      
      // Handle email confirmation error specifically
      if (errorMessage === 'UNCONFIRMED_EMAIL_DELAYED') {
        setShowResendButton(true);
        Alert.alert(
          'Email Confirmation Delayed', 
          'Due to temporary email service restrictions, confirmation emails may be delayed. Your account may already be active - try logging in again in a few minutes.\n\nYou can also try resending the confirmation email using the button below.',
          [{ text: 'OK', style: 'default' }]
        );
      } else if (errorMessage.includes('If you recently registered')) {
        // Show resend button for potential unconfirmed email cases
        setShowResendButton(true);
        Alert.alert('Login Failed', errorMessage);
      } else {
        Alert.alert('Login Failed', errorMessage);
      }
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address first');
      return;
    }

    try {
      await resendConfirmation(email);
      Alert.alert(
        'Email Sent', 
        'A new confirmation email has been sent to your email address. Please check your inbox and click the confirmation link.',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error: any) {
      console.log('Resend confirmation error:', error);
      const errorMessage = error?.message || 'Failed to resend confirmation email. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#1e40af', '#7c3aed']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <MapPin color="#ffffff" size={48} />
          <Text style={styles.title}>Alberta Travel Buddy</Text>
          <Text style={styles.subtitle}>Your intelligent travel companion</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Mail color="#6b7280" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              testID="email-input"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock color="#6b7280" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="current-password"
              textContentType="password"
              testID="password-input"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff color="#6b7280" size={20} />
              ) : (
                <Eye color="#6b7280" size={20} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            testID="login-button"
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {showResendButton && (
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendConfirmation}
              testID="resend-confirmation-button"
            >
              <Text style={styles.resendButtonText}>
                Resend Confirmation Email (May Be Delayed)
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={onSwitchToRegister}>
            <Text style={styles.switchText}>
              Don&apos;t have an account? <Text style={styles.switchLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  loginButton: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  resendButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  switchText: {
    textAlign: 'center',
    color: '#e2e8f0',
    marginTop: 24,
  },
  switchLink: {
    color: '#ffffff',
    fontWeight: '600',
  },
});