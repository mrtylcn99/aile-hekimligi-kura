import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from './Colors';

const {width, height} = Dimensions.get('window');

export const GlobalStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  safeContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  contentContainer: {
    flex: 1,
    padding: 16,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Card Styles
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Button Styles
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },

  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  // Text Styles
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },

  bodyText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },

  caption: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  // Form Styles
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text,
  },

  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
  },

  inputError: {
    borderColor: Colors.error,
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },

  // Layout Helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  spaceBetween: {
    justifyContent: 'space-between',
  },

  spacingXS: {
    margin: 4,
  },

  spacingS: {
    margin: 8,
  },

  spacingM: {
    margin: 16,
  },

  spacingL: {
    margin: 24,
  },

  // Shadow
  shadow: {
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Healthcare Specific
  healthcareCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  statusBadgeActive: {
    backgroundColor: Colors.success,
  },

  statusBadgePending: {
    backgroundColor: Colors.warning,
  },

  statusBadgeInactive: {
    backgroundColor: Colors.error,
  },

  statusText: {
    color: Colors.textOnPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
});

// Responsive helpers
export const isTablet = width >= 768;
export const screenWidth = width;
export const screenHeight = height;