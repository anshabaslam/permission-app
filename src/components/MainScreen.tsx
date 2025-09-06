import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Alert, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from '../screens/ProfileScreen';
import PermissionsScreen from '../screens/PermissionsScreenNew';
import EmailScreen from '../screens/EmailScreen';

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState<'Profile' | 'Permission' | 'Email'>('Permission');
  const insets = useSafeAreaInsets();

  const renderScreen = () => {
    switch (activeTab) {
      case 'Profile':
        return <ProfileScreen />;
      case 'Permission':
        return <PermissionsScreen />;
      case 'Email':
        return <EmailScreen />;
      default:
        return <PermissionsScreen />;
    }
  };

  const getHeaderTitle = () => {
    if (activeTab === 'Permission') return 'Permissions';
    if (activeTab === 'Email') return 'Emails';
    return activeTab;
  };

  const handleHelpPress = () => {
    let title = 'Help';
    let message = '';
    
    switch (activeTab) {
      case 'Profile':
        title = 'Profile Help';
        message = 'Need help with your profile?\n\n• Fill out your work information to get personalized categorization\n• Select what you hope to achieve for better recommendations\n• Choose your work type and sector for tailored features\n• All information helps improve your experience';
        break;
      case 'Permission':
        title = 'Permissions Help';
        message = 'Need help with permissions?\n\n• Toggle permissions by tapping on them\n• Green toggles mean permissions are granted\n• Red toggles mean permissions need attention\n• Camera: For scanning paper receipts\n• Photos: To organize existing receipts\n• Messages: Auto-detect receipt confirmations\n• Location: Log transaction locations';
        break;
      case 'Email':
        title = 'Email Help';
        message = 'Need help connecting your email?\n\n• Connect Gmail or Outlook for automatic receipt detection\n• We only scan for receipts, not personal emails\n• Your credentials are never shared with us\n• Tap the + button to connect your email provider\n• No more manual forwarding or uploads needed';
        break;
    }
    
    Alert.alert(title, message, [{ text: 'Got it!' }]);
  };

  const handleProfilePress = () => {
    Alert.alert('Profile', 'Profile settings coming soon!', [{ text: 'OK' }]);
  };

  const getHeaderStyles = () => {
    return { backgroundColor: '#F3F0FF' }; // Purple theme for all screens
  };

  const getSafeAreaStyles = () => {
    return { backgroundColor: '#F3F0FF' }; // Purple theme for all screens
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={getHeaderStyles().backgroundColor} translucent={Platform.OS === 'android'} />
      <View style={[styles.statusBarSpacer, { height: Platform.OS === 'android' ? insets.top : 0, backgroundColor: getHeaderStyles().backgroundColor }]} />
      <SafeAreaView style={[styles.safeArea, getSafeAreaStyles()]}>
        {/* Header */}
        <View style={[styles.header, getHeaderStyles()]}>
          <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.helpButton} onPress={handleHelpPress}>
              <Ionicons name="help-circle-outline" size={24} color="#6366F1" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileAvatar} onPress={handleProfilePress}>
              <Image 
                source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/005/346/410/small_2x/close-up-portrait-of-smiling-handsome-young-caucasian-man-face-looking-at-camera-on-isolated-light-gray-studio-background-photo.jpg' }}
                style={styles.avatarImage}
              />
            </TouchableOpacity>
          </View>
        </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {['Profile', 'Permission', 'Email'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab as 'Profile' | 'Permission' | 'Email')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

        {/* Content */}
        <View style={styles.content}>
          {renderScreen()}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  statusBarSpacer: {
    width: '100%',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  helpButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#C7B9ED',
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 13,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8B7BB8',
    letterSpacing: -0.1,
  },
  activeTabText: {
    color: '#1F2937',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});