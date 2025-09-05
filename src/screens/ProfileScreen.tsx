import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
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
              <View style={styles.labelBgLeft} />
              <View style={styles.labelBgRight} />
              <Text style={styles.label}>What are you hoping to achieve?</Text>
            </View>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{achievement}</Text>
              <Ionicons name="chevron-down" size={20} color="#6366F1" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.dropdownContainer}>
            <View style={styles.labelContainer}>
              <View style={styles.labelBgLeft} />
              <View style={styles.labelBgRight} />
              <Text style={styles.label}>Who are you, how do you work?</Text>
            </View>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{workType}</Text>
              <Ionicons name="chevron-down" size={20} color="#6366F1" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.dropdownContainer}>
            <View style={styles.labelContainer}>
              <View style={styles.labelBgLeft} />
              <View style={styles.labelBgRight} />
              <Text style={styles.label}>What sector do you primarily operate in?</Text>
            </View>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{sector}</Text>
              <Ionicons name="chevron-down" size={20} color="#6366F1" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.bottomContent}>
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
  formSection: {
    marginBottom: 24,
  },
  dropdownContainer: {
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    top: -8,
    left: 12,
    zIndex: 1,
    flexDirection: 'column',
  },
  labelBgLeft: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 8,
    backgroundColor: '#F3F0FF',
  },
  labelBgRight: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 6,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    paddingHorizontal: 4,
    zIndex: 2,
    position: 'relative',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  dropdownText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#6366F1',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});