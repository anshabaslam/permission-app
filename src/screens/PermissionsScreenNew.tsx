import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, AppState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';

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
          size={26} 
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
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 'camera',
      name: 'Camera',
      description: 'To instantly scan paper receipts without manual uploads',
      icon: 'camera',
      status: null,
    },
    {
      id: 'photos',
      name: 'Photos',
      description: 'To detect and organize receipts already saved in your phone\'s gallery',
      icon: 'images',
      status: null,
    },
    {
      id: 'messages',
      name: 'Messages',
      description: 'To auto-detect receipts and confirmations sent via text — no searching required',
      icon: 'chatbubble',
      status: null,
    },
    {
      id: 'location',
      name: 'Location',
      description: 'To log where transactions happen and auto-tag trips or visits',
      icon: 'location',
      status: null,
    },
  ]);

  const checkPermissionStatuses = async () => {
    try {
      const [cameraStatus, locationStatus, mediaLibraryStatus] = await Promise.all([
        Camera.getCameraPermissionsAsync(),
        Location.getForegroundPermissionsAsync(),
        MediaLibrary.getPermissionsAsync(),
      ]);

      setPermissions(prev => prev.map(permission => {
        let newStatus;
        
        switch (permission.id) {
          case 'camera':
            newStatus = {
              granted: cameraStatus.granted,
              canAskAgain: cameraStatus.canAskAgain,
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
            newStatus = { granted: false, canAskAgain: true };
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
    }
  };

  const requestPermission = async (permissionId: string) => {
    try {
      let result;
      
      switch (permissionId) {
        case 'camera':
          result = await Camera.requestCameraPermissionsAsync();
          break;
        case 'location':
          result = await Location.requestForegroundPermissionsAsync();
          break;
        case 'photos':
          result = await MediaLibrary.requestPermissionsAsync();
          break;
        case 'messages':
          Alert.alert('Messages Permission', 'Message permissions would be handled by the system.');
          return;
        default:
          return;
      }

      if (result) {
        setPermissions(prev => prev.map(permission => 
          permission.id === permissionId
            ? {
                ...permission,
                status: {
                  granted: result.granted,
                  canAskAgain: result.canAskAgain,
                },
              }
            : permission
        ));
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      Alert.alert('Permission Error', 'Unable to request permission. Try on a physical device for full functionality.');
    }
  };

  const handlePermissionPress = (permission: Permission) => {
    if (!permission.status?.granted) {
      requestPermission(permission.id);
    }
  };

  useEffect(() => {
    checkPermissionStatuses();
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        setTimeout(() => {
          checkPermissionStatuses();
        }, 100);
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
          Enable access to automate receipt capture and mileage tracking. No manual uploads.
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

      <View style={styles.bottomContent}>
        <View style={styles.securityNote}>
          <Ionicons name="lock-closed" size={20} color="#6B7280" />
          <Text style={styles.securityText}>
            You'll now see system permission popups.{'\n'}Please allow access to keep things automatic and organized from day one.
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
  },
  topContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  bottomContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  permissionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 60,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 3,
    letterSpacing: -0.1,
  },
  permissionDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  toggleContainer: {
    marginLeft: 12,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EF4444',
    position: 'relative',
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#34D399',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  toggleThumbActive: {
    left: 22,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  securityText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 8,
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  continueButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: -0.2,
  },
});