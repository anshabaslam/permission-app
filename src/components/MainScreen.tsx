import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Alert, Image, Platform, Animated, Dimensions, PanResponder } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from '../screens/ProfileScreen';
import PermissionsScreen from '../screens/PermissionsScreenNew';
import EmailScreen from '../screens/EmailScreen';

const { height: screenHeight } = Dimensions.get('window');

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState<'Profile' | 'Permission' | 'Email'>('Permission');
  const insets = useSafeAreaInsets();
  
  // Global drawer state
  const [isGlobalDrawerVisible, setIsGlobalDrawerVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('');
  const [drawerOptions, setDrawerOptions] = useState<string[]>([]);
  const [drawerOnSelect, setDrawerOnSelect] = useState<((value: string) => void) | null>(null);
  
  const drawerAnimValue = useRef(new Animated.Value(0)).current;
  const backdropAnimValue = useRef(new Animated.Value(0)).current;

  const handleGlobalDrawerOpen = (type: string, title: string, options: string[], currentValue: string, onSelect: (value: string) => void) => {
    setDrawerTitle(title);
    setDrawerOptions(options);
    setDrawerOnSelect(() => onSelect);
    setIsGlobalDrawerVisible(true);
    
    Animated.parallel([
      Animated.timing(drawerAnimValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnimValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeGlobalDrawer = () => {
    Animated.parallel([
      Animated.timing(drawerAnimValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnimValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsGlobalDrawerVisible(false);
      setDrawerTitle('');
      setDrawerOptions([]);
      setDrawerOnSelect(null);
    });
  };

  const selectGlobalOption = (option: string) => {
    if (drawerOnSelect) {
      drawerOnSelect(option);
    }
    closeGlobalDrawer();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (evt, gestureState) => {
        const dragDistance = Math.max(0, gestureState.dy);
        const dragPercentage = Math.min(dragDistance / 200, 1);
        drawerAnimValue.setValue(1 - dragPercentage);
        backdropAnimValue.setValue(1 - dragPercentage);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100) {
          closeGlobalDrawer();
        } else {
          Animated.parallel([
            Animated.spring(drawerAnimValue, {
              toValue: 1,
              useNativeDriver: true,
            }),
            Animated.spring(backdropAnimValue, {
              toValue: 1,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const renderScreen = () => {
    switch (activeTab) {
      case 'Profile':
        return <ProfileScreen onDrawerOpen={handleGlobalDrawerOpen} />;
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
      
      {/* Global Custom Bottom Drawer */}
      {isGlobalDrawerVisible && (
        <>
          <Animated.View 
            style={[
              styles.globalModalBackground,
              {
                opacity: backdropAnimValue,
              }
            ]}
          >
            <TouchableOpacity 
              style={StyleSheet.absoluteFill} 
              onPress={closeGlobalDrawer}
              activeOpacity={1}
            />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.globalDrawerContainer, 
              { 
                paddingBottom: insets.bottom,
                transform: [
                  {
                    translateY: drawerAnimValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [screenHeight * 0.5, 0],
                    })
                  }
                ]
              }
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.drawerHandle} />
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>{drawerTitle}</Text>
              <TouchableOpacity onPress={closeGlobalDrawer} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.optionsList}>
              {drawerOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionItem}
                  onPress={() => selectGlobalOption(option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </>
      )}
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
    paddingVertical: 8,
    paddingHorizontal: 12,
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
    fontSize: 13,
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
  // Global Drawer Styles
  globalModalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  globalDrawerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
    minHeight: '40%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1001,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  optionText: {
    fontSize: 15,
    color: '#1F2937',
    flex: 1,
    fontWeight: '400',
  },
});