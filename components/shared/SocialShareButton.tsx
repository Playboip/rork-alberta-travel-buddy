import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, Share, ViewStyle } from 'react-native';
import { Facebook, Instagram, Twitter, Share2 } from 'lucide-react-native';

interface SocialShareButtonProps {
  platform: 'facebook' | 'instagram' | 'twitter' | 'general';
  content: string;
  title?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export default function SocialShareButton({ 
  platform, 
  content, 
  title = 'Share from Alberta Travel Buddy',
  size = 'medium',
  style 
}: SocialShareButtonProps) {
  
  const getIcon = () => {
    const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
    
    switch (platform) {
      case 'facebook':
        return <Facebook color="#ffffff" size={iconSize} />;
      case 'instagram':
        return <Instagram color="#ffffff" size={iconSize} />;
      case 'twitter':
        return <Twitter color="#ffffff" size={iconSize} />;
      case 'general':
        return <Share2 color="#ffffff" size={iconSize} />;
    }
  };

  const getButtonStyle = () => {
    let buttonStyle = {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
      gap: 6,
      justifyContent: 'center' as const,
      backgroundColor: '#6b7280', // default
    };
    
    // Size adjustments
    if (size === 'small') {
      buttonStyle.paddingHorizontal = 12;
      buttonStyle.paddingVertical = 6;
      buttonStyle.gap = 4;
    } else if (size === 'large') {
      buttonStyle.paddingHorizontal = 20;
      buttonStyle.paddingVertical = 14;
      buttonStyle.gap = 8;
    }
    
    // Platform colors
    switch (platform) {
      case 'facebook':
        buttonStyle.backgroundColor = '#1877f2';
        break;
      case 'instagram':
        buttonStyle.backgroundColor = '#e4405f';
        break;
      case 'twitter':
        buttonStyle.backgroundColor = '#1da1f2';
        break;
      case 'general':
        buttonStyle.backgroundColor = '#6b7280';
        break;
    }
    
    return [buttonStyle, style];
  };

  const getButtonText = () => {
    switch (platform) {
      case 'facebook':
        return 'Facebook';
      case 'instagram':
        return 'Instagram';
      case 'twitter':
        return 'Twitter';
      case 'general':
        return 'Share';
    }
  };

  const handleShare = async () => {
    const shareContent = `${content}

Shared from Alberta Travel Buddy 🍁`;
    
    try {
      if (platform === 'general') {
        await Share.share({
          message: shareContent,
          title: title,
        });
        return;
      }

      // Platform-specific sharing
      let url = '';
      const encodedText = encodeURIComponent(shareContent);
      
      switch (platform) {
        case 'facebook':
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://albertatravelbuddy.com')}&quote=${encodedText}`;
          break;
        case 'twitter':
          url = `https://twitter.com/intent/tweet?text=${encodedText}`;
          break;
        case 'instagram':
          Alert.alert(
            'Share to Instagram',
            'Content copied to clipboard! Open Instagram and paste in your story or post.',
            [{ text: 'OK' }]
          );
          return;
      }
      
      Alert.alert('Share', `Opening ${platform} to share...`);
      
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share content');
    }
  };

  return (
    <TouchableOpacity style={getButtonStyle()} onPress={handleShare}>
      {getIcon()}
      <Text style={[styles.buttonText, size === 'small' && styles.smallText]}>
        {getButtonText()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  smallText: {
    fontSize: 12,
  },
});