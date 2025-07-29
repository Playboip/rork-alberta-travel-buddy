import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, User, MapPin, Eye, EyeOff } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useAuth } from '@/hooks/auth-context';

interface RegisterScreenProps {
  onSwitchToLogin: () => void;
}

export default function RegisterScreen({ onSwitchToLogin }: RegisterScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [detectedLocation, setDetectedLocation] = useState('Calgary, AB'); // Default location
  const [showPassword, setShowPassword] = useState(false);
  const [locationStatus, setLocationStatus] = useState('Detecting your location...');
  const { register, isLoading } = useAuth();

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    try {
      setLocationStatus('Detecting your location...');
      
      if (Platform.OS === 'web') {
        // Use web geolocation API
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                const address = await reverseGeocodeWeb(latitude, longitude);
                if (address) {
                  setDetectedLocation(address);
                  setLocationStatus(`📍 ${address}`);
                } else {
                  setLocationStatus('📍 Calgary, AB (default)');
                }
              } catch (error) {
                console.log('Web location detection failed:', error);
                setLocationStatus('📍 Calgary, AB (default)');
              }
            },
            (error) => {
              console.log('Web geolocation error:', error);
              setLocationStatus('📍 Calgary, AB (default)');
            },
            { timeout: 10000, enableHighAccuracy: false, maximumAge: 300000 }
          );
        } else {
          setLocationStatus('📍 Calgary, AB (default)');
        }
        return;
      }

      // Mobile location detection
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        setLocationStatus('📍 Calgary, AB (default)');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const reverseGeocodeResult = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (reverseGeocodeResult.length > 0) {
        const addr = reverseGeocodeResult[0];
        let locationString = '';
        
        if (addr.city) {
          locationString = addr.city;
        } else if (addr.subregion) {
          locationString = addr.subregion;
        }
        
        if (addr.region) {
          locationString += locationString ? `, ${addr.region}` : addr.region;
        }
        
        if (locationString) {
          setDetectedLocation(locationString);
          setLocationStatus(`📍 ${locationString}`);
        } else {
          setLocationStatus('📍 Calgary, AB (default)');
        }
      } else {
        setLocationStatus('📍 Calgary, AB (default)');
      }
    } catch (error) {
      console.log('Location detection failed:', error);
      setLocationStatus('📍 Calgary, AB (default)');
    }
  };

  const reverseGeocodeWeb = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      
      if (data.city && data.principalSubdivision) {
        return `${data.city}, ${data.principalSubdivision}`;
      } else if (data.locality && data.principalSubdivision) {
        return `${data.locality}, ${data.principalSubdivision}`;
      }
      return '';
    } catch (error) {
      console.log('Reverse geocoding failed:', error);
      return '';
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    // Validation
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (name.trim().length < 2) {
      Alert.alert('Error', 'Name must be at least 2 characters');
      return;
    }

    try {
      console.log('Starting registration process...');
      const result = await register(email.trim(), password, name.trim(), detectedLocation.trim());
      
      // Check if email confirmation is required
      if (result?.requiresEmailConfirmation) {
        Alert.alert(
          'Registration Successful!', 
          'Your account has been created successfully. Please check your email and click the confirmation link to activate your account before signing in.',
          [
            { text: 'OK', onPress: () => onSwitchToLogin() }
          ]
        );
        return;
      }
      
      // If we get here, registration was successful and user is logged in
      Alert.alert('Success', 'Account created successfully!');
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('email') || error.message.includes('already registered')) {
          errorMessage = 'This email is already registered. Please use a different email or try signing in.';
        } else if (error.message.includes('password')) {
          errorMessage = 'Password is too weak. Please use a stronger password.';
        } else if (error.message.includes('Database connection')) {
          errorMessage = 'Unable to connect to our servers. Please check your internet connection and try again.';
        } else if (error.message.includes('duplicate key') || error.message.includes('already exists')) {
          errorMessage = 'An account with this email already exists. Please try signing in instead.';
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert('Registration Failed', errorMessage);
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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <MapPin color="#ffffff" size={48} />
            <Text style={styles.title}>Join Alberta Travel Buddy</Text>
            <Text style={styles.subtitle}>Start your adventure today</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <User color="#6b7280" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#9ca3af"
                value={name}
                onChangeText={setName}
                testID="name-input"
                autoCorrect={false}
                autoComplete="name"
              />
            </View>

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
                placeholder="Password (min 6 characters)"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                testID="password-input"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff color="#6b7280" size={20} />
                ) : (
                  <Eye color="#6b7280" size={20} />
                )}
              </TouchableOpacity>
            </View>

            {/* Location Status Display */}
            <View style={styles.locationStatus}>
              <Text style={styles.locationStatusText}>{locationStatus}</Text>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              testID="register-button"
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSwitchToLogin}>
              <Text style={styles.switchText}>
                Already have an account? <Text style={styles.switchLink}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
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
  locationStatus: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  locationStatusText: {
    fontSize: 14,
    color: '#e2e8f0',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
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