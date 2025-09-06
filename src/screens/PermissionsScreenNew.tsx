import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    }
    // Note: No longer checking permissions here - handled globally in MainScreen
  };

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
          <Ionicons name="lock-closed" size={16} color="#6B7280" style={styles.lockIcon} />
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  lockIcon: {
    marginBottom: 6,
  },
  securityText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
    letterSpacing: -0.1,
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