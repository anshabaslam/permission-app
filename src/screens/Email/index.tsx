import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';

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