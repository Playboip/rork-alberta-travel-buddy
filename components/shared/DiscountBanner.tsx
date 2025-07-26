import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Percent, Clock, Users, Star, Gift } from 'lucide-react-native';

interface DiscountBannerProps {
  discount: {
    percentage: number;
    code?: string;
    validUntil?: string;
    description: string;
    type: 'early_bird' | 'last_minute' | 'loyalty' | 'group' | 'seasonal' | 'partner';
  };
  onPress?: () => void;
}

export default function DiscountBanner({ discount, onPress }: DiscountBannerProps) {
  const getDiscountIcon = () => {
    switch (discount.type) {
      case 'early_bird':
        return <Clock color="#ffffff" size={16} />;
      case 'last_minute':
        return <Clock color="#ffffff" size={16} />;
      case 'loyalty':
        return <Star color="#ffffff" size={16} />;
      case 'group':
        return <Users color="#ffffff" size={16} />;
      case 'seasonal':
        return <Gift color="#ffffff" size={16} />;
      case 'partner':
        return <Percent color="#ffffff" size={16} />;
      default:
        return <Percent color="#ffffff" size={16} />;
    }
  };

  const getGradientColors = (): [string, string] => {
    switch (discount.type) {
      case 'early_bird':
        return ['#10b981', '#059669'];
      case 'last_minute':
        return ['#f59e0b', '#d97706'];
      case 'loyalty':
        return ['#8b5cf6', '#7c3aed'];
      case 'group':
        return ['#3b82f6', '#2563eb'];
      case 'seasonal':
        return ['#ec4899', '#db2777'];
      case 'partner':
        return ['#f97316', '#ea580c'];
      default:
        return ['#6366f1', '#4f46e5'];
    }
  };

  const getDiscountLabel = () => {
    switch (discount.type) {
      case 'early_bird':
        return 'Early Bird';
      case 'last_minute':
        return 'Last Minute';
      case 'loyalty':
        return 'Loyalty Reward';
      case 'group':
        return 'Group Discount';
      case 'seasonal':
        return 'Seasonal Offer';
      case 'partner':
        return 'Partner Deal';
      default:
        return 'Special Offer';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={getGradientColors()}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.content}>
          <View style={styles.leftSection}>
            <View style={styles.iconContainer}>
              {getDiscountIcon()}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.discountLabel}>{getDiscountLabel()}</Text>
              <Text style={styles.description}>{discount.description}</Text>
              {discount.validUntil && (
                <Text style={styles.validUntil}>
                  Valid until {new Date(discount.validUntil).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.percentage}>{discount.percentage}%</Text>
            <Text style={styles.offText}>OFF</Text>
            {discount.code && (
              <View style={styles.codeContainer}>
                <Text style={styles.codeText}>{discount.code}</Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  discountLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 16,
  },
  validUntil: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'center',
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 28,
  },
  offText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: -2,
  },
  codeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  },
  codeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'monospace',
  },
});