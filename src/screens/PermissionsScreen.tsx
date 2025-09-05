import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, AppState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import PermissionItem from '../components/PermissionItem';
import { Permission } from '../types';

export default function PermissionsScreen() {
  const [demoMode, setDemoMode] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>('');
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 'camera',
      name: 'Camera',
      description: 'To instantly scan paper receipts without manual uploads',
      icon: 'camera',
      status: null,
    },
    {
      id: 'storage',
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
      console.log('🔍 Checking permission statuses...');
      
      const [cameraStatus, locationStatus, mediaLibraryStatus] = await Promise.all([
        Camera.getCameraPermissionsAsync(),
        Location.getForegroundPermissionsAsync(),
        MediaLibrary.getPermissionsAsync(),
      ]);

      console.log('📱 Permission Status Check Results:');
      console.log('Camera:', cameraStatus.granted ? '✅ GRANTED' : '❌ DENIED');
      console.log('Location:', locationStatus.granted ? '✅ GRANTED' : '❌ DENIED');
      console.log('Storage:', mediaLibraryStatus.granted ? '✅ GRANTED' : '❌ DENIED');

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
          case 'storage':
            newStatus = {
              granted: mediaLibraryStatus.granted,
              canAskAgain: mediaLibraryStatus.canAskAgain,
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
      
      // Update last checked time
      setLastChecked(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('❌ Error checking permissions:', error);
    }
  };

  useEffect(() => {
    console.log('🚀 Component mounted - checking permissions');
    checkPermissionStatuses();
  }, []);


  // Check permissions when app comes back from background
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        console.log('📱 App became active - checking permissions');
        setTimeout(() => {
          checkPermissionStatuses();
        }, 100); // Small delay to ensure the app is fully active
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, []);

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
        case 'storage':
          result = await MediaLibrary.requestPermissionsAsync();
          break;
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

        if (!result.granted && !result.canAskAgain) {
          Alert.alert(
            'Permission Permanently Denied',
            'This permission has been permanently denied. To enable it:\n\n1. Go to Settings → Privacy & Security\n2. Find the permission type (Camera/Location/Photos)\n3. Enable access for this app',
            [{ text: 'OK' }]
          );
        } else if (!result.granted && result.canAskAgain) {
          Alert.alert(
            'Permission Denied',
            'Permission was denied. You can try requesting it again or enable it in Settings.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      
      // More specific error handling
      const permissionName = permissionId.charAt(0).toUpperCase() + permissionId.slice(1);
      Alert.alert(
        `${permissionName} Permission Error`,
        `Unable to request ${permissionName.toLowerCase()} permission. This may be due to:\n\n• Running in web browser (permissions need physical device)\n• iOS Simulator limitations\n• System restrictions\n\nTry running on a physical device for full permission functionality.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleDemoPermission = (permissionId: string) => {
    setPermissions(prev => prev.map(permission => 
      permission.id === permissionId
        ? {
            ...permission,
            status: {
              granted: !permission.status?.granted,
              canAskAgain: true,
            },
          }
        : permission
    ));
  };

  const handlePermissionPress = (permission: Permission) => {
    if (demoMode) {
      handleDemoPermission(permission.id);
    } else if (!permission.status?.granted) {
      requestPermission(permission.id);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Tab Bar */}
      <View style={styles.topTabBar}>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Email</Text>
        </TouchableOpacity>
      </View>

      {/* Header with refresh and demo buttons */}
      <View style={styles.header}>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={checkPermissionStatuses}
          >
            <Text style={styles.refreshButtonText}>🔄</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.demoButton, demoMode && styles.demoButtonActive]}
            onPress={() => setDemoMode(!demoMode)}
          >
            <Text style={[styles.demoButtonText, demoMode && styles.demoButtonTextActive]}>
              {demoMode ? '🧪 Demo' : '📱 Live'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>
          {demoMode 
            ? '🧪 Demo Mode: Tap permissions to toggle status instantly (for testing UI)' 
            : 'Enable access to automate receipt capture and mileage tracking. No manual uploads.'
          }
          {lastChecked && !demoMode && (
            <Text style={styles.lastCheckedText}>
              {'\n'}Last checked: {lastChecked} 🔄
            </Text>
          )}
        </Text>
        
        {permissions.map((permission) => (
          <PermissionItem
            key={permission.id}
            permission={permission}
            onPress={() => handlePermissionPress(permission)}
          />
        ))}
        
        <View style={styles.securityNote}>
          <Text style={styles.securityText}>
            🔒 You'll now see system permission popups. Please allow access to keep things automatic and organized from day one.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  topTabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#7C3AED',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  refreshButtonText: {
    fontSize: 14,
  },
  demoButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  demoButtonActive: {
    backgroundColor: '#EDE9FE',
    borderColor: '#7C3AED',
  },
  demoButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  demoButtonTextActive: {
    color: '#7C3AED',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#F8F9FA',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  lastCheckedText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  securityNote: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  securityText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});