import React, { useState, useLayoutEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';

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
        <Text style={[
          styles.permissionStatus,
          permission.status?.granted ? styles.permissionStatusGranted : styles.permissionStatusDenied
        ]}>
          {permission.status?.granted ? 'Granted' : 'Denied'}
        </Text>
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

interface PermissionsScreenProps {
  globalPermissionStatuses?: {
    camera: { granted: boolean; canAskAgain: boolean };
    location: { granted: boolean; canAskAgain: boolean };
    photos: { granted: boolean; canAskAgain: boolean };
    messages: { granted: boolean; canAskAgain: boolean };
  };
  onPermissionRequest?: (permissionId: string) => void;
}

export default function PermissionsScreen({ 
  globalPermissionStatuses, 
  onPermissionRequest
}: PermissionsScreenProps) {
  const insets = useSafeAreaInsets();
  const [needsScroll, setNeedsScroll] = useState(false);
  const screenHeight = Dimensions.get('window').height;

  useLayoutEffect(() => {
    // Calculate if content needs scrolling
    const availableHeight = screenHeight - insets.top - insets.bottom;
    const estimatedContentHeight = 
      100 + // description and margins
      (permissions.length * 62) + // permission items
      40 + // security note  
      80; // continue button and padding
    
    setNeedsScroll(estimatedContentHeight > availableHeight);
  }, [screenHeight, insets]);
  
  // Use global permission statuses - already pre-loaded from MainScreen
  const permissions: Permission[] = [
    {
      id: 'camera',
      name: 'Camera',
      description: 'Scan paper receipts instantly',
      icon: 'camera',
      status: globalPermissionStatuses?.camera || { granted: false, canAskAgain: true },
    },
    {
      id: 'photos',
      name: 'Photos',
      description: 'Organize receipts from gallery',
      icon: 'images',
      status: globalPermissionStatuses?.photos || { granted: false, canAskAgain: true },
    },
    {
      id: 'messages',
      name: 'Messages',
      description: 'Auto-detect receipt confirmations',
      icon: 'chatbubble',
      status: globalPermissionStatuses?.messages || { granted: false, canAskAgain: true },
    },
    {
      id: 'location',
      name: 'Location',
      description: 'Log transaction locations',
      icon: 'location',
      status: globalPermissionStatuses?.location || { granted: false, canAskAgain: true },
    },
  ];

  const requestPermission = async (permissionId: string) => {
    if (onPermissionRequest) {
      onPermissionRequest(permissionId);
    }
  };

  const handlePermissionPress = (permission: Permission) => {
    // For messages permission, if granted, do nothing (no popup)
    if (permission.id === 'messages' && permission.status?.granted) {
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
    }
  };

  const renderContent = () => (
    <>
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

      {!needsScroll && <View style={styles.spacer} />}

      <View style={[styles.bottomContent, { paddingBottom: 20 + insets.bottom }]}>
        <View style={styles.securityNote}>
          <Ionicons name="lock-closed" size={16} color="#6B7280" style={styles.lockIcon} />
          <Text style={styles.securityText}>
            You'll see system permission popups. Please allow access.
          </Text>
        </View>
        
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {needsScroll ? (
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
        </ScrollView>
      ) : (
        renderContent()
      )}
    </View>
  );
}