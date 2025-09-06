import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
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
    marginBottom: 25,
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
    borderRadius:12
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