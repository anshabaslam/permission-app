import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Alert, Image, Platform, Animated, Dimensions, PanResponder, ScrollView, AppState } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { PermissionsAndroid } from 'react-native';
import ProfileScreen from '../screens/ProfileScreen';
import PermissionsScreen from '../screens/PermissionsScreenNew';
import EmailScreen from '../screens/EmailScreen';

const { height: screenHeight } = Dimensions.get('window');

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState<'Profile' | 'Permission' | 'Email'>('Permission');
  const insets = useSafeAreaInsets();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  
  // Global drawer state
  const [isGlobalDrawerVisible, setIsGlobalDrawerVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('');
  const [drawerOptions, setDrawerOptions] = useState<string[]>([]);
  const [drawerOnSelect, setDrawerOnSelect] = useState<((value: string) => void) | null>(null);
  
  // Global permission state - pre-loaded
  const [globalPermissionStatuses, setGlobalPermissionStatuses] = useState({
    camera: { granted: false, canAskAgain: true },
    location: { granted: false, canAskAgain: true },
    photos: { granted: false, canAskAgain: true },
    messages: { granted: false, canAskAgain: true },
  });
  
  const drawerAnimValue = useRef(new Animated.Value(0)).current;
  const backdropAnimValue = useRef(new Animated.Value(0)).current;
  const lastCameraPermissionRef = useRef<boolean | null>(null);

  // Global permission checking function
  const checkGlobalPermissionStatuses = async () => {
    try {
      const [locationStatus, mediaLibraryStatus, smsPermissionStatus] = await Promise.all([
        Location.getForegroundPermissionsAsync().catch(() => ({ granted: false, canAskAgain: true })),
        MediaLibrary.getPermissionsAsync().catch((error) => {
          console.log('Media library permission check limited in Expo Go:', error.message);
          return { granted: false, canAskAgain: true };
        }),
        Platform.OS === 'android' 
          ? PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS).then(result => {
              console.log('📱 Android SMS permission check result:', result, typeof result);
              console.log('📱 PermissionsAndroid.RESULTS.GRANTED:', PermissionsAndroid.RESULTS.GRANTED);
              // Handle both boolean true and 'granted' string results
              const isGranted = result === true || String(result) === 'granted' || String(result) === PermissionsAndroid.RESULTS.GRANTED;
              console.log('📱 SMS permission isGranted:', isGranted);
              return isGranted;
            }).catch((error) => {
              console.log('❌ Android SMS permission check error:', error);
              return false;
            })
          : Promise.resolve(false), // iOS SMS permission not supported without package
      ]);

      // Check for camera permission stability to prevent rapid toggling
      const currentCameraGranted = cameraPermission?.granted === true;
      
      // Add stability check - don't allow rapid on/off toggling
      if (lastCameraPermissionRef.current !== null && lastCameraPermissionRef.current !== currentCameraGranted) {
        console.log(`⚠️ Camera permission changed from ${lastCameraPermissionRef.current} to ${currentCameraGranted}`);
        
        // If camera was granted but now appears denied, skip this update to prevent flickering
        if (lastCameraPermissionRef.current === true && currentCameraGranted === false) {
          console.log('⚠️ Camera permission revoke detected - skipping update to prevent toggle flickering');
          // Skip this update entirely - the permission is likely still granted in device settings
          return;
        }
      }
      lastCameraPermissionRef.current = currentCameraGranted;

      const newStatuses = {
        camera: {
          granted: currentCameraGranted,
          canAskAgain: cameraPermission?.canAskAgain !== false,
        },
        location: {
          granted: locationStatus.granted,
          canAskAgain: locationStatus.canAskAgain,
        },
        photos: {
          granted: mediaLibraryStatus.granted,
          canAskAgain: mediaLibraryStatus.canAskAgain,
        },
        messages: { 
          granted: smsPermissionStatus === true, 
          canAskAgain: smsPermissionStatus !== true
        },
      };

      // Only update if any status has actually changed - with more stable comparison
      const hasChanged = Object.keys(newStatuses).some(key => {
        const oldStatus = globalPermissionStatuses[key as keyof typeof globalPermissionStatuses];
        const newStatus = newStatuses[key as keyof typeof newStatuses];
        const changed = oldStatus?.granted !== newStatus?.granted || oldStatus?.canAskAgain !== newStatus?.canAskAgain;
        
        if (changed) {
          console.log(`Permission ${key} changed: granted ${oldStatus?.granted} -> ${newStatus?.granted}, canAskAgain ${oldStatus?.canAskAgain} -> ${newStatus?.canAskAgain}`);
        }
        
        // Debug camera permission specifically
        if (key === 'camera') {
          console.log(`Camera permission debug - Hook: granted=${cameraPermission?.granted}, canAskAgain=${cameraPermission?.canAskAgain}, Status: granted=${newStatus?.granted}`);
        }
        
        // Debug SMS permission specifically
        if (key === 'messages') {
          console.log(`SMS permission debug - Platform: ${Platform.OS}, Raw status: ${smsPermissionStatus}, Type: ${typeof smsPermissionStatus}, Final granted: ${newStatus?.granted}`);
        }
        
        return changed;
      });

      if (hasChanged) {
        console.log('Updating global permission statuses');
        setGlobalPermissionStatuses(newStatuses);
      }
    } catch (error) {
      console.error('❌ Error checking global permissions:', error);
    }
  };

  // Check permissions immediately when app loads
  useEffect(() => {
    const checkImmediately = async () => {
      await checkGlobalPermissionStatuses();
    };
    checkImmediately();

    // Set up interval for periodic checks - reduced frequency to avoid conflicts
    const interval = setInterval(() => {
      checkGlobalPermissionStatuses();
    }, 30000); // Check every 30 seconds (increased to prevent camera flickering)

    return () => clearInterval(interval);
  }, [cameraPermission]); // Add cameraPermission as dependency

  // Update permissions when camera permission hook updates - with debounce and stability check
  useEffect(() => {
    if (cameraPermission && cameraPermission.granted !== undefined) {
      console.log('Camera permission hook updated:', cameraPermission);
      // Add a longer delay to ensure permission state is stable
      const timeout = setTimeout(() => {
        checkGlobalPermissionStatuses();
      }, 2000); // Further increased delay for camera stability
      
      return () => clearTimeout(timeout);
    }
  }, [cameraPermission?.granted, cameraPermission?.canAskAgain]); // Only depend on specific properties

  // Handle app state changes - check permissions when app becomes active
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        console.log('📱 App became active - checking all permissions...');
        // Check immediately when app becomes active (user might have changed settings)
        setTimeout(() => {
          checkGlobalPermissionStatuses();
        }, 500);
        // Double-check after a longer delay for SMS specifically
        setTimeout(() => {
          console.log('🔄 Double-checking SMS permission after app became active...');
          checkGlobalPermissionStatuses();
        }, 2000);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, []);

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

  // Global permission request function
  const handleGlobalPermissionRequest = async (permissionId: string) => {
    try {      
      switch (permissionId) {
        case 'camera':
          await requestCameraPermission();
          break;
        case 'location':
          await Location.requestForegroundPermissionsAsync();
          break;
        case 'photos':
          try {
            await MediaLibrary.requestPermissionsAsync();
          } catch (error: any) {
            if (error.message?.includes('Expo Go')) {
              Alert.alert(
                'Limited in Expo Go', 
                'Photo permissions have limited functionality in Expo Go. For full testing, create a development build.',
                [{ text: 'OK' }]
              );
            } else {
              throw error;
            }
          }
          break;
        case 'messages':
          try {
            if (Platform.OS === 'android') {
              console.log('🔄 Starting Android SMS permission request process...');
              
              // First check current permission status
              const currentStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
              console.log('📋 Current SMS permission status:', currentStatus);
              
              if (currentStatus) {
                console.log('✅ SMS permission already granted');
                Alert.alert(
                  'Permission Already Granted',
                  'SMS permission is already enabled for this app.',
                  [{ text: 'OK' }]
                );
                // Force update the UI state
                setTimeout(() => checkGlobalPermissionStatuses(), 500);
                return;
              }
              
              console.log('🔑 Requesting SMS permission from user...');
              const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_SMS,
                {
                  title: 'SMS Permission Required',
                  message: 'This app needs access to your SMS messages to automatically detect receipt confirmations and transaction messages.',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'Allow',
                }
              );
              console.log('📱 Android SMS permission request result:', result, typeof result);
              
              // Handle all possible results
              if (result === 'granted' || result === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('✅ SMS permission granted successfully!');
                Alert.alert(
                  'Permission Granted! 🎉',
                  'SMS permission has been granted. The app can now detect receipt confirmations.',
                  [{ 
                    text: 'Great!',
                    onPress: () => {
                      // Force immediate UI update
                      setTimeout(() => checkGlobalPermissionStatuses(), 100);
                    }
                  }]
                );
              } else if (result === 'denied' || result === PermissionsAndroid.RESULTS.DENIED) {
                console.log('❌ SMS permission denied by user');
                Alert.alert(
                  'Permission Denied',
                  'SMS permission was denied. You can enable it later in Settings.',
                  [{ text: 'OK' }]
                );
              } else if (result === 'never_ask_again' || result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                console.log('❌ SMS permission denied permanently');
                Alert.alert(
                  'Permission Required',
                  'SMS permission was denied permanently. Please enable it manually:\n\nSettings > Apps > Permission Manager > Permissions > SMS',
                  [{ text: 'OK' }]
                );
              } else {
                console.log('❓ Unknown SMS permission result:', result);
                Alert.alert(
                  'Unknown Response',
                  `Permission request returned: ${result}. Please check device settings manually.`,
                  [{ text: 'OK' }]
                );
              }
            } else {
              // iOS SMS permission not supported without additional packages
              console.log('📱 iOS SMS permission not supported');
              Alert.alert(
                'iOS Not Supported',
                'SMS permission is only supported on Android devices in this app.',
                [{ text: 'OK' }]
              );
            }
          } catch (smsError) {
            console.error('❌ SMS permission request failed with error:', smsError);
            Alert.alert(
              'SMS Permission Error',
              `Unable to request SMS permission: ${(smsError as Error)?.message || String(smsError)}. Please try again or enable it manually in device settings.`,
              [{ text: 'OK' }]
            );
          }
          break;
        default:
          return;
      }

      // Force immediate permission state update after request
      setTimeout(() => {
        console.log('📊 Force checking permissions after request...');
        checkGlobalPermissionStatuses();
      }, 100);
      
      // Double-check after a longer delay to ensure state is synced
      setTimeout(() => {
        console.log('🔄 Double-checking permissions...');
        checkGlobalPermissionStatuses();
      }, 1000);
    } catch (error) {
      console.error('Error requesting permission:', error);
      Alert.alert('Permission Error', 'Unable to request permission. Try on a physical device for full functionality.');
    }
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'Profile':
        return <ProfileScreen onDrawerOpen={handleGlobalDrawerOpen} />;
      case 'Permission':
        return <PermissionsScreen 
          globalPermissionStatuses={globalPermissionStatuses}
          onPermissionRequest={handleGlobalPermissionRequest}
          onRefreshPermissions={() => {
            console.log('🔄 Manual permission refresh requested...');
            checkGlobalPermissionStatuses();
          }}
        />;
      case 'Email':
        return <EmailScreen />;
      default:
        return <PermissionsScreen 
          globalPermissionStatuses={globalPermissionStatuses}
          onPermissionRequest={handleGlobalPermissionRequest}
          onRefreshPermissions={() => {
            console.log('🔄 Manual permission refresh requested...');
            checkGlobalPermissionStatuses();
          }}
        />;
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
            
            <ScrollView 
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {drawerOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    index === drawerOptions.length - 1 && { borderBottomWidth: 0 }
                  ]}
                  onPress={() => selectGlobalOption(option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#C7B9ED" />
                </TouchableOpacity>
              ))}
            </ScrollView>
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
    maxHeight: '45%',
    minHeight: '35%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  drawerHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#C7B9ED',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0FF',
  },
  drawerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    letterSpacing: -0.2,
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F3F0FF',
  },
  optionsList: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    maxHeight: 280,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0FF',
    borderRadius: 8,
    marginVertical: 2,
    backgroundColor: '#FEFEFE',
  },
  optionText: {
    fontSize: 15,
    color: '#1F2937',
    flex: 1,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
});