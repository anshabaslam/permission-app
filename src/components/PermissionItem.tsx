import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PermissionItemProps {
  permission: any;
  onPress: () => void;
}

export default function PermissionItem({ permission, onPress }: PermissionItemProps) {
  const isGranted = permission.status?.granted || false;
  const statusText = permission.status === null ? "Unknown" : (isGranted ? "Granted" : "Denied");
  const statusColor = permission.status === null ? "#6B7280" : (isGranted ? "#10B981" : "#EF4444");
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <Ionicons name={permission.icon as any} size={24} color="#7C3AED" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{permission.name}</Text>
          <Text style={styles.description}>{permission.description}</Text>
        </View>
      </View>
      <View style={styles.rightContent}>
        <View style={[styles.statusIcon, isGranted ? styles.granted : styles.denied]}>
          {permission.status === null ? (
            <Text style={styles.statusEmoji}>❓</Text>
          ) : (
            <Text style={styles.statusEmoji}>{isGranted ? "✅" : "❌"}</Text>
          )}
        </View>
        <Text style={[styles.statusText, { color: statusColor }]}>
          {statusText}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
  },
  rightContent: {
    alignItems: 'center',
    minWidth: 80,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginBottom: 4,
  },
  statusEmoji: {
    fontSize: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  granted: {
    backgroundColor: '#10B981',
  },
  denied: {
    backgroundColor: '#EF4444',
  },
});