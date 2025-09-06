import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProfileScreenProps {
  onDrawerOpen?: (type: 'achievement' | 'workType' | 'sector', title: string, options: string[], currentValue: string, onSelect: (value: string) => void) => void;
}

export default function ProfileScreen({ onDrawerOpen }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const [achievement, setAchievement] = useState('Separate personal and business expenses');
  const [workType, setWorkType] = useState('Freelancer / Independent Contractor');
  const [sector, setSector] = useState('Real Estate (Agents, Property Management)');

  const achievementOptions = [
    'Separate personal and business expenses',
    'Track tax deductible expenses',
    'Monitor cash flow and budgeting',
    'Prepare for tax season',
    'Organize receipts digitally'
  ];

  const workTypeOptions = [
    'Freelancer / Independent Contractor',
    'Small Business Owner',
    'Consultant',
    'Real Estate Agent',
    'Sales Representative',
    'Self-Employed Professional'
  ];

  const sectorOptions = [
    'Real Estate (Agents, Property Management)',
    'Technology / Software',
    'Healthcare / Medical',
    'Marketing / Advertising',
    'Construction / Trades',
    'Retail / E-commerce',
    'Finance / Accounting',
    'Education / Training',
    'Other'
  ];

  const openDrawer = (type: 'achievement' | 'workType' | 'sector') => {
    if (onDrawerOpen) {
      const options = getCurrentOptionsForType(type);
      const title = getTitleForType(type);
      const currentValue = getCurrentValueForType(type);
      
      onDrawerOpen(type, title, options, currentValue, (selectedValue) => {
        selectOptionByType(type, selectedValue);
      });
    }
  };

  const selectOptionByType = (type: 'achievement' | 'workType' | 'sector', option: string) => {
    if (type === 'achievement') {
      setAchievement(option);
    } else if (type === 'workType') {
      setWorkType(option);
    } else if (type === 'sector') {
      setSector(option);
    }
  };

  const getCurrentOptionsForType = (type: 'achievement' | 'workType' | 'sector') => {
    if (type === 'achievement') return achievementOptions;
    if (type === 'workType') return workTypeOptions;
    if (type === 'sector') return sectorOptions;
    return [];
  };

  const getTitleForType = (type: 'achievement' | 'workType' | 'sector') => {
    if (type === 'achievement') return 'What are you hoping to achieve?';
    if (type === 'workType') return 'Who are you, how do you work?';
    if (type === 'sector') return 'What sector do you primarily operate in?';
    return '';
  };

  const getCurrentValueForType = (type: 'achievement' | 'workType' | 'sector') => {
    if (type === 'achievement') return achievement;
    if (type === 'workType') return workType;
    if (type === 'sector') return sector;
    return '';
  };


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
            <TouchableOpacity style={styles.dropdown} onPress={() => openDrawer('achievement')}>
              <Text style={styles.dropdownText} numberOfLines={1} ellipsizeMode="tail">{achievement}</Text>
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
            <TouchableOpacity style={styles.dropdown} onPress={() => openDrawer('workType')}>
              <Text style={styles.dropdownText} numberOfLines={1} ellipsizeMode="tail">{workType}</Text>
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
            <TouchableOpacity style={styles.dropdown} onPress={() => openDrawer('sector')}>
              <Text style={styles.dropdownText} numberOfLines={1} ellipsizeMode="tail">{sector}</Text>
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
    borderWidth: 0.7,
    borderColor: '#9CA3AF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
  },
  dropdownText: {
    fontSize: 13,
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