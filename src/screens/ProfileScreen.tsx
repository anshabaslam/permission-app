import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [achievement] = useState('Separate personal and business...');
  const [workType] = useState('Freelancer / Independent Contr...');
  const [sector] = useState('Real Estate (Agents, Property M...');

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <Text style={styles.description}>
          We use this info to tailor categorization and suggest smart rules based on your work.
        </Text>

        <View style={styles.formSection}>
          <View style={styles.dropdownContainer}>
            <View style={styles.labelContainer}>
              <View style={styles.labelBackground} />
              <Text style={styles.label}>What are you hoping to achieve?</Text>
            </View>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{achievement}</Text>
              <Ionicons name="chevron-down" size={18} color="#6366F1" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.dropdownContainer}>
            <View style={styles.labelContainer}>
              <View style={styles.labelBackground} />
              <Text style={styles.label}>Who are you, how do you work?</Text>
            </View>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{workType}</Text>
              <Ionicons name="chevron-down" size={18} color="#6366F1" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.dropdownContainer}>
            <View style={styles.labelContainer}>
              <View style={styles.labelBackground} />
              <Text style={styles.label}>What sector do you primarily operate in?</Text>
            </View>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{sector}</Text>
              <Ionicons name="chevron-down" size={18} color="#6366F1" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.spacer} />

      <View style={[styles.bottomContent, { paddingBottom: 16 + insets.bottom }]}>
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
  formSection: {
    marginBottom: 18,
  },
  dropdownContainer: {
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    top: -8,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 5,
        zIndex: 5,
      },
      ios: {
        zIndex: 2,
      },
    }),
  },
  labelBackground: {
    position: 'absolute',
    top: -1,
    left: -4,
    right: -4,
    height: 18,
    backgroundColor: '#F3F0FF',
    ...Platform.select({
      android: {
        elevation: 5,
        zIndex: 5,
      },
      ios: {
        zIndex: 1,
      },
    }),
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    paddingHorizontal: 4,
    position: 'relative',
    ...Platform.select({
      android: {
        elevation: 6,
        zIndex: 6,
      },
      ios: {
        zIndex: 3,
      },
    }),
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
    ...Platform.select({
      android: {
        elevation: 1,
      },
    }),
  },
  dropdownText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#6366F1',
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});