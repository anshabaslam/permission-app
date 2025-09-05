import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EmailScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <Text style={styles.description}>
          Connect to your email to unlock automatic receipt and invoice detection. No more forwarding or manual uploads.
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
              <Ionicons name="mail" size={24} color="#0078D4" />
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

      <View style={styles.bottomContent}>
        <View style={styles.securityNote}>
          <Ionicons name="lock-closed" size={20} color="#6B7280" />
          <Text style={styles.securityText}>
            We'll only scan for receipts - not your personal emails.{'\n'}Your credentials are never shared with us.
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
  providerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  providerCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  providerIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  outlookIcon: {
    backgroundColor: '#E6F3FF',
  },
  gmailLogo: {
    fontSize: 24,
    fontWeight: '600',
    color: '#DB4437',
  },
  providerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 2,
  },
  providerDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -16,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
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