import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, MapPin, Bell, Shield, Info, Settings, LogOut, Edit, Crown, CreditCard, Mail } from 'lucide-react-native';
import { Stack, router } from 'expo-router';
import { useAuth } from '@/hooks/auth-context';
import { useSubscription } from '@/hooks/subscription-context';
import { APP_CONFIG } from '@/constants/app-config';
import * as Linking from 'expo-linking';

interface UserPreferences {
  notifications: boolean;
  locationSharing: boolean;
  emergencyAlerts: boolean;
}

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const { getCurrentTier, cancelSubscription, isLoading } = useSubscription();
  const [preferences, setPreferences] = useState<UserPreferences>({
    notifications: true,
    locationSharing: false,
    emergencyAlerts: true,
  });

  const currentTier = getCurrentTier();

  const updatePreference = (key: keyof UserPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const editProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const manageSubscription = () => {
    if (currentTier.id === 'free') {
      router.push('/subscription');
    } else {
      Alert.alert(
        'Manage Subscription',
        'What would you like to do?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Change Plan', onPress: () => router.push('/subscription') },
          { 
            text: 'Cancel Subscription', 
            style: 'destructive',
            onPress: () => handleCancelSubscription()
          }
        ]
      );
    }
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        { 
          text: 'Cancel Subscription', 
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelSubscription();
              Alert.alert('Success', 'Your subscription has been canceled.');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel subscription. Please try again.');
            }
          }
        }
      ]
    );
  };

  const showAbout = () => {
    Alert.alert(
      'About Alberta Travel Buddy',
      `Version ${APP_CONFIG.version}

Your intelligent travel companion for exploring Alberta's hidden gems. Discover unique accommodations, local experiences, and plan your complete adventure.

Developed with ❤️ for Alberta travelers.`,
      [{ text: 'OK' }]
    );
  };

  const contactSupport = () => {
    if (!user) return;
    
    const subject = encodeURIComponent('Alberta Travel Buddy - Support Request');
    const body = encodeURIComponent(`Hi Alberta Travel Buddy Support,

I need help with:

[Please describe your issue here]

User: ${user.email || 'Not logged in'}
App Version: ${APP_CONFIG.version}

Thank you!`);
    const mailtoUrl = `mailto:${APP_CONFIG.emails.support}?subject=${subject}&body=${body}`;
    
    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert(
        'Contact Support',
        `Please email us at: ${APP_CONFIG.emails.support}`,
        [{ text: 'OK' }]
      );
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout }
      ]
    );
  };

  if (!user) return null;

  return (
    <>
      <Stack.Screen options={{ title: 'Profile' }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={['#1e40af', '#7c3aed']}
          style={styles.header}
        >
          <View style={styles.profileImageContainer}>
            <User color="#ffffff" size={48} />
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <View style={styles.locationRow}>
            <MapPin color="#e2e8f0" size={16} />
            <Text style={styles.profileLocation}>{user.location}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={editProfile}>
            <Edit color="#1e40af" size={16} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Subscription Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <TouchableOpacity style={styles.subscriptionCard} onPress={manageSubscription}>
            <View style={styles.subscriptionInfo}>
              <View style={styles.subscriptionHeader}>
                <Crown color={currentTier.id === 'free' ? '#6b7280' : '#f97316'} size={24} />
                <View style={styles.subscriptionDetails}>
                  <Text style={styles.subscriptionTier}>{currentTier.name}</Text>
                  <Text style={styles.subscriptionPrice}>
                    {currentTier.price === 0 ? 'Free' : `$${currentTier.price}/month`}
                  </Text>
                </View>
              </View>
              <Text style={styles.subscriptionStatus}>
                Status: {user.subscriptionStatus === 'active' ? 'Active' : 'Free'}
              </Text>
            </View>
            <CreditCard color="#6b7280" size={20} />
          </TouchableOpacity>
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <View style={styles.contactCard}>
            <Shield color="#dc2626" size={24} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Primary Emergency Contact</Text>
              <Text style={styles.contactNumber}>
                {user.emergencyContact || 'Not set'}
              </Text>
            </View>
            <TouchableOpacity onPress={editProfile}>
              <Edit color="#6b7280" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceRow}>
              <Bell color="#f97316" size={24} />
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>Push Notifications</Text>
                <Text style={styles.preferenceDescription}>Receive travel alerts and updates</Text>
              </View>
              <Switch
                value={preferences.notifications}
                onValueChange={(value) => updatePreference('notifications', value)}
                trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
                thumbColor={preferences.notifications ? '#1e40af' : '#f3f4f6'}
              />
            </View>
          </View>

          <View style={styles.preferenceCard}>
            <View style={styles.preferenceRow}>
              <MapPin color="#059669" size={24} />
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>Location Sharing</Text>
                <Text style={styles.preferenceDescription}>Share location with emergency contacts</Text>
              </View>
              <Switch
                value={preferences.locationSharing}
                onValueChange={(value) => updatePreference('locationSharing', value)}
                trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
                thumbColor={preferences.locationSharing ? '#1e40af' : '#f3f4f6'}
              />
            </View>
          </View>

          <View style={styles.preferenceCard}>
            <View style={styles.preferenceRow}>
              <Shield color="#dc2626" size={24} />
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>Emergency Alerts</Text>
                <Text style={styles.preferenceDescription}>Receive safety and weather alerts</Text>
              </View>
              <Switch
                value={preferences.emergencyAlerts}
                onValueChange={(value) => updatePreference('emergencyAlerts', value)}
                trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
                thumbColor={preferences.emergencyAlerts ? '#1e40af' : '#f3f4f6'}
              />
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingCard}>
            <Settings color="#6b7280" size={24} />
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>App Settings</Text>
              <Text style={styles.settingDescription}>Customize your app experience</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingCard} onPress={contactSupport}>
            <Mail color="#6b7280" size={24} />
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Contact Support</Text>
              <Text style={styles.settingDescription}>Get help with your account or bookings</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingCard} onPress={showAbout}>
            <Info color="#6b7280" size={24} />
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>About</Text>
              <Text style={styles.settingDescription}>App version and information</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Travel Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Trips Planned</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Destinations</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Days Traveled</Text>
            </View>
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
            <LogOut color="#dc2626" size={24} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileLocation: {
    fontSize: 16,
    color: '#e2e8f0',
    marginLeft: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginLeft: 6,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  subscriptionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subscriptionDetails: {
    marginLeft: 12,
  },
  subscriptionTier: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  subscriptionPrice: {
    fontSize: 14,
    color: '#6b7280',
  },
  subscriptionStatus: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  contactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  preferenceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  settingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginLeft: 8,
  },
});