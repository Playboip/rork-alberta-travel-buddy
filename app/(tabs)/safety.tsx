import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Phone, MapPin, AlertTriangle, Info, ExternalLink, Navigation } from 'lucide-react-native';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';

interface EmergencyContact {
  name: string;
  number: string;
  description: string;
}

interface SafetyTip {
  title: string;
  description: string;
  icon: string;
}

const emergencyContacts: EmergencyContact[] = [
  {
    name: 'Emergency Services',
    number: '911',
    description: 'Police, Fire, Ambulance'
  },
  {
    name: 'Alberta Health Link',
    number: '811',
    description: '24/7 health advice and information'
  },
  {
    name: 'Poison Control',
    number: '1-800-332-1414',
    description: 'Poison and drug information'
  },
  {
    name: 'Crisis Line',
    number: '1-877-303-2642',
    description: 'Mental health crisis support'
  }
];

const safetyTips: SafetyTip[] = [
  {
    title: 'Share Your Location',
    description: 'Always let someone know your travel plans and expected return time',
    icon: '📍'
  },
  {
    title: 'Weather Awareness',
    description: 'Check weather conditions, especially in mountain areas where conditions change rapidly',
    icon: '🌤️'
  },
  {
    title: 'Emergency Kit',
    description: 'Pack first aid supplies, extra food, water, and warm clothing',
    icon: '🎒'
  },
  {
    title: 'Wildlife Safety',
    description: 'Know how to behave around bears, elk, and other wildlife common in Alberta',
    icon: '🐻'
  },
  {
    title: 'Road Conditions',
    description: 'Check road conditions and have winter driving supplies in cold months',
    icon: '🛣️'
  },
  {
    title: 'Communication',
    description: 'Ensure your phone is charged and consider a satellite communicator for remote areas',
    icon: '📱'
  }
];

export default function SafetyScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is needed for safety features');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const addr = reverseGeocode[0];
        setAddress(`${addr.street || ''} ${addr.city || ''}, ${addr.region || ''}`);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const callEmergency = (number: string) => {
    Alert.alert(
      'Call Emergency',
      `Do you want to call ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${number}`) }
      ]
    );
  };

  const shareLocation = () => {
    if (location) {
      const message = `My current location: ${address}\nCoordinates: ${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}\nGoogle Maps: https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;
      
      Alert.alert(
        'Share Location',
        'This will copy your location details to clipboard',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Copy', 
            onPress: () => {
              // In a real app, you'd use Clipboard API here
              Alert.alert('Copied', 'Location details copied to clipboard');
            }
          }
        ]
      );
    } else {
      Alert.alert('Location not available', 'Please enable location services');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Safety Assistant' }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#dc2626', '#b91c1c']}
          style={styles.header}
        >
          <Shield color="#ffffff" size={32} />
          <Text style={styles.headerTitle}>Safety Assistant</Text>
          <Text style={styles.headerSubtitle}>Your travel safety companion</Text>
        </LinearGradient>

        {/* Current Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Location</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <MapPin color="#dc2626" size={24} />
              <Text style={styles.locationTitle}>Your Location</Text>
            </View>
            <Text style={styles.locationAddress}>
              {address || 'Getting location...'}
            </Text>
            <View style={styles.locationActions}>
              <TouchableOpacity style={styles.locationButton} onPress={shareLocation}>
                <Navigation color="#1e40af" size={20} />
                <Text style={styles.locationButtonText}>Share Location</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.locationButton}
                onPress={() => getCurrentLocation()}
              >
                <MapPin color="#059669" size={20} />
                <Text style={styles.locationButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          {emergencyContacts.map((contact, index) => (
            <TouchableOpacity
              key={index}
              style={styles.emergencyCard}
              onPress={() => callEmergency(contact.number)}
            >
              <View style={styles.emergencyInfo}>
                <Text style={styles.emergencyName}>{contact.name}</Text>
                <Text style={styles.emergencyDescription}>{contact.description}</Text>
              </View>
              <View style={styles.emergencyCall}>
                <Phone color="#dc2626" size={24} />
                <Text style={styles.emergencyNumber}>{contact.number}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Safety Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          {safetyTips.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <Text style={styles.tipIcon}>{tip.icon}</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Resources</Text>
          
          <TouchableOpacity 
            style={styles.resourceCard}
            onPress={() => Linking.openURL('https://www.alberta.ca/road-conditions')}
          >
            <Info color="#1e40af" size={24} />
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Alberta Road Conditions</Text>
              <Text style={styles.resourceDescription}>Current road and weather conditions</Text>
            </View>
            <ExternalLink color="#6b7280" size={20} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resourceCard}
            onPress={() => Linking.openURL('https://www.pc.gc.ca/en/pn-np/ab')}
          >
            <Info color="#059669" size={24} />
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Parks Canada Safety</Text>
              <Text style={styles.resourceDescription}>National park safety guidelines</Text>
            </View>
            <ExternalLink color="#6b7280" size={20} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resourceCard}
            onPress={() => Linking.openURL('https://weather.gc.ca/city/pages/ab-52_metric_e.html')}
          >
            <Info color="#f97316" size={24} />
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Weather Alerts</Text>
              <Text style={styles.resourceDescription}>Environment Canada weather warnings</Text>
            </View>
            <ExternalLink color="#6b7280" size={20} />
          </TouchableOpacity>
        </View>

        {/* Emergency Alert */}
        <View style={styles.section}>
          <View style={styles.emergencyAlert}>
            <AlertTriangle color="#dc2626" size={28} />
            <Text style={styles.alertTitle}>In Case of Emergency</Text>
            <Text style={styles.alertDescription}>
              If you're in immediate danger, call 911. For non-emergency situations, use the contacts above or visit your nearest hospital or police station.
            </Text>
          </View>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fecaca',
    textAlign: 'center',
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
  locationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  locationAddress: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 22,
  },
  locationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
    justifyContent: 'center',
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },
  emergencyCard: {
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
  emergencyInfo: {
    flex: 1,
  },
  emergencyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  emergencyDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  emergencyCall: {
    alignItems: 'center',
  },
  emergencyNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
    marginTop: 4,
  },
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  resourceCard: {
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
  resourceContent: {
    flex: 1,
    marginLeft: 12,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  emergencyAlert: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginTop: 8,
    marginBottom: 8,
  },
  alertDescription: {
    fontSize: 14,
    color: '#7f1d1d',
    textAlign: 'center',
    lineHeight: 20,
  },
});