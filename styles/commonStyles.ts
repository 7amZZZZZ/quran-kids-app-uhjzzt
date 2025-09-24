
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#2E7D32',      // Islamic Green
  secondary: '#4CAF50',    // Light Green
  accent: '#81C784',       // Soft Green
  background: '#F8F9FA',   // Light background for children
  backgroundAlt: '#FFFFFF', // Pure white
  text: '#2C3E50',         // Dark text for readability
  textLight: '#5D6D7E',    // Light text
  grey: '#BDC3C7',         // Light grey
  card: '#FFFFFF',         // White cards
  gold: '#FFD700',         // Gold for stars/achievements
  lightBlue: '#E3F2FD',    // Light blue accent
  success: '#4CAF50',      // Success green
  warning: '#FF9800',      // Warning orange
  error: '#F44336',        // Error red
  arabicText: '#1B4332',   // Dark green for Arabic text
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.grey,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 16,
    fontFamily: 'Amiri_400Regular',
  },
  arabicTitle: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.arabicText,
    marginBottom: 16,
    fontFamily: 'Amiri_700Bold',
    writingDirection: 'rtl',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  arabicText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.arabicText,
    textAlign: 'center',
    fontFamily: 'Amiri_400Regular',
    writingDirection: 'rtl',
    lineHeight: 40,
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.lightBlue,
  },
  letterCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    minHeight: 80,
    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.1)',
    elevation: 6,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
  homeHeader: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  homeButtons: {
    width: '100%',
    gap: 20,
    paddingHorizontal: 20,
  },
  navigationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    flex: 1,
  },
  // RTL Support Styles
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  ltrText: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  ltrRow: {
    flexDirection: 'row',
  },
});
