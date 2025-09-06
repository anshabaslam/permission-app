import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, AppState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';

// SMS library temporarily disabled for build compatibility
// TODO: Re-enable after resolving build issues
// declare module '@maniac-tech/react-native-expo-read-sms' {
//   export function checkIfHasSMSPermission(): Promise<boolean | object>;
//   export function requestReadSMSPermission(): Promise<any>;
// }
// import { checkIfHasSMSPermission, requestReadSMSPermission } from '@maniac-tech/react-native-expo-read-sms';

interface Permission {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: { granted: boolean; canAskAgain: boolean } | null;
}

interface PermissionItemProps {
  permission: Permission;
  onPress: () => void;
}

function PermissionItem({ permission, onPress }: PermissionItemProps) {
  const getIconStyle = () => {
    switch (permission.id) {
      case 'camera':
        return { backgroundColor: '#E5E7EB', color: '#374151' };
      case 'photos':
        return { backgroundColor: '#FEF3C7', color: '#D97706' };
      case 'messages':
        return { backgroundColor: '#DBEAFE', color: '#2563EB' };
      case 'location':
        return { backgroundColor: '#DBEAFE', color: '#2563EB' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  const iconStyle = getIconStyle();

  return (
    <TouchableOpacity style={styles.permissionItem} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: iconStyle.backgroundColor }]}>
        <Ionicons 
          name={permission.icon as any} 
          size={20} 
          color={iconStyle.color} 
        />
      </View>
      <View style={styles.permissionInfo}>
        <Text style={styles.permissionName}>{permission.name}</Text>
        <Text style={styles.permissionDescription}>{permission.description}</Text>
      </View>
      <View style={styles.toggleContainer}>
        <View style={[
          styles.toggle,
          permission.status?.granted && styles.toggleActive
        ]}>
          <View style={[
            styles.toggleThumb,
            permission.status?.granted && styles.toggleThumbActive
          ]} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function PermissionsScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const insets = useSafeAreaInsets();
  
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 'camera',
      name: 'Camera',
      description: 'Scan paper receipts instantly',
      icon: 'camera',
      status: null,
    },
    {
      id: 'photos',
      name: 'Photos',
      description: 'Organize receipts from gallery',
      icon: 'images',
      status: null,
    },
    {
      id: 'messages',
      name: 'Messages',
      description: 'Auto-detect receipt confirmations',
      icon: 'chatbubble',
      status: null,
    },
    {
      id: 'location',
      name: 'Location',
      description: 'Log transaction locations',
      icon: 'location',
      status: null,
    },
  ]);

  const checkPermissionStatuses = async () => {
    try {
      const [locationStatus, mediaLibraryStatus, smsPermissionStatus] = await Promise.all([
        Location.getForegroundPermissionsAsync().catch(() => ({ granted: false, canAskAgain: true })),
        MediaLibrary.getPermissionsAsync().catch((error) => {
          // Handle Expo Go limitation gracefully
          console.log('Media library permission check limited in Expo Go:', error.message);
          return { granted: false, canAskAgain: true };
        }),
        // Temporarily disabled: checkIfHasSMSPermission().catch(() => false),
        Promise.resolve(false), // Fallback for SMS permission check
      ]);

      setPermissions(prev => prev.map(permission => {
        let newStatus;
        
        switch (permission.id) {
          case 'camera':
            newStatus = {
              granted: cameraPermission?.granted || false,
              canAskAgain: cameraPermission?.canAskAgain ?? true,
            };
            break;
          case 'location':
            newStatus = {
              granted: locationStatus.granted,
              canAskAgain: locationStatus.canAskAgain,
            };
            break;
          case 'photos':
            newStatus = {
              granted: mediaLibraryStatus.granted,
              canAskAgain: mediaLibraryStatus.canAskAgain,
            };
            break;
          case 'messages':
            // Use real SMS permission status
            newStatus = { 
              granted: smsPermissionStatus !== false, 
              canAskAgain: smsPermissionStatus === false
            };
            break;
          default:
            newStatus = permission.status;
        }

        return {
          ...permission,
          status: newStatus,
        };
      }));
    } catch (error) {
      console.error('❌ Error checking permissions:', error);
      // On error, keep existing status or set to default
    }
  };

  const requestPermission = async (permissionId: string) => {
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
          // Temporarily show placeholder for SMS permission (library disabled for build)
          Alert.alert(
            'SMS Permission',
            'SMS permission functionality is temporarily disabled. This will be enabled in the production build.',
            [{ text: 'OK' }]
          );
          return;
        default:
          return;
      }

      // After requesting, check all permissions to update state
      setTimeout(() => {
        checkPermissionStatuses();
      }, 100);
    } catch (error) {
      console.error('Error requesting permission:', error);
      Alert.alert('Permission Error', 'Unable to request permission. Try on a physical device for full functionality.');
    }
  };

  const handlePermissionPress = (permission: Permission) => {
    // For messages permission, if granted, inform user they need to go to settings to revoke
    if (permission.id === 'messages' && permission.status?.granted) {
      Alert.alert(
        'Messages Permission Granted',
        'SMS permissions are managed by the system. To revoke this permission, go to Settings > Apps > Permission App > Permissions.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Handle other permissions
    if (!permission.status?.granted) {
      if (permission.status?.canAskAgain === false) {
        // If permission was denied and can't ask again, show settings alert
        Alert.alert(
          'Permission Required',
          `${permission.name} permission is needed. Please enable it in Settings.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => {
                // This would open settings on a real device
                Alert.alert('Settings', 'On a real device, this would open system settings.');
              }
            }
          ]
        );
      } else {
        requestPermission(permission.id);
      }
    } else {
      // If already granted, check status again to ensure it's still granted
      checkPermissionStatuses();
    }
  };

  // Check permissions periodically while component is mounted
  useEffect(() => {
    checkPermissionStatuses();
    
    // Set up interval to check periodically while screen is active
    const interval = setInterval(() => {
      checkPermissionStatuses();
    }, 2000); // Check every 2 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Update permissions when camera permission hook updates
  useEffect(() => {
    if (cameraPermission) {
      checkPermissionStatuses();
    }
  }, [cameraPermission]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        // Check immediately when app becomes active
        checkPermissionStatuses();
        // Also check after a short delay in case permissions were changed
        setTimeout(() => {
          checkPermissionStatuses();
        }, 500);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <Text style={styles.description}>
          Enable access to automate receipt capture and mileage tracking.
        </Text>
        
        <View style={styles.permissionsCard}>
          {permissions.map((permission, index) => (
            <View key={permission.id}>
              <PermissionItem
                permission={permission}
                onPress={() => handlePermissionPress(permission)}
              />
              {index < permissions.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.spacer} />

      <View style={[styles.bottomContent, { paddingBottom: 20 + insets.bottom }]}>
        <View style={styles.securityNote}>
          <Ionicons name="lock-closed" size={16} color="#6B7280" />
          <Text style={styles.securityText}>
            You'll see system permission popups. Please allow access.
          </Text>
        </View>
        
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F0FF',
    justifyContent: 'space-between',
  },
  topContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  spacer: {
    flex: 1,
  },
  bottomContent: {
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  permissionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: 20,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    minHeight: 52,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 48,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  permissionInfo: {
    flex: 1,
    marginRight: 8,
  },
  permissionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  permissionDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    letterSpacing: -0.1,
    flexWrap: 'wrap',
  },
  toggleContainer: {
    marginLeft: 8,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EF4444',
    position: 'relative',
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#34D399',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  toggleThumbActive: {
    left: 20,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  securityText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    textAlign: 'center',
    lineHeight: 16,
    letterSpacing: -0.1,
    flex: 1,
  },
  continueButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: -0.2,
  },
});