import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EmailScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <Text style={styles.description}>
          Connect to your email for automatic receipt detection.
        </Text>
        
        <View style={styles.providerRow}>
          <TouchableOpacity style={styles.providerCard}>
            <View style={styles.providerIcon}>
              <Text style={styles.gmailLogo}>G</Text>
            </View>
            <Text style={styles.providerTitle}>Connect Google</Text>
            <Text style={styles.providerTitle}>Workspace (Gmail)</Text>
            <Text style={styles.providerDescription}>Mail + Calendar</Text>
            <View style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.providerCard}>
            <View style={[styles.providerIcon, styles.outlookIcon]}>
              <Ionicons name="mail" size={20} color="#0078D4" />
            </View>
            <Text style={styles.providerTitle}>Connect Microsoft</Text>
            <Text style={styles.providerTitle}>365 (Outlook)</Text>
            <Text style={styles.providerDescription}>Mail + Calendar</Text>
            <View style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.spacer} />

      <View style={[styles.bottomContent, { paddingBottom: 16 + insets.bottom }]}>
        <View style={styles.securityNote}>
          <Ionicons name="lock-closed" size={16} color="#6B7280" style={styles.lockIcon} />
          <Text style={styles.securityText}>
            We'll only scan for receipts - not personal emails.
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
  providerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  providerCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 32,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  providerIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  outlookIcon: {
    backgroundColor: '#E6F3FF',
  },
  gmailLogo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#DB4437',
  },
  providerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 1,
  },
  providerDescription: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 2,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -14,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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