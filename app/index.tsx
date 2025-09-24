
import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFonts, Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import * as SplashScreen from 'expo-splash-screen';
import Icon from '../components/Icon';
import { useLanguage } from '../contexts/LanguageContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
  });

  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const navigateToAlphabet = () => {
    console.log('Navigating to Learn Alphabet');
    router.push('/learnAlphabet');
  };

  const navigateToPronunciation = () => {
    console.log('Navigating to Pronunciation Practice');
    router.push('/pronunciationPractice');
  };

  const navigateToSurah = () => {
    console.log('Navigating to Read Surah');
    router.push('/readSurah');
  };

  const navigateToProgress = () => {
    console.log('Navigating to Progress');
    router.push('/progress');
  };

  const navigateToReadingChapters = () => {
    console.log('Navigating to Reading Chapters');
    router.push('/readingChapters');
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    console.log('Language toggled to:', newLanguage);
  };

  const isRTL = language === 'ar';

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Language Toggle */}
        <View style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: 20,
          paddingTop: 10,
        }}>
          <TouchableOpacity
            onPress={toggleLanguage}
            style={{
              backgroundColor: colors.lightBlue,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Text style={{
              color: colors.primary,
              fontSize: 14,
              fontWeight: '600'
            }}>
              {language === 'en' ? 'عربي' : 'EN'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Header Section */}
        <View style={commonStyles.homeHeader}>
          <Text style={[
            commonStyles.arabicTitle,
            {
              textAlign: 'center',
              writingDirection: 'rtl',
            }
          ]}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </Text>
          <Text style={[commonStyles.title, { color: colors.primary, marginTop: 16 }]}>
            {language === 'en' ? 'Learn to Read the Qur\'an' : 'تعلم قراءة القرآن'}
          </Text>
          <Text style={[commonStyles.text, { fontSize: 18, color: colors.textLight, textAlign: 'center', marginTop: 8 }]}>
            {language === 'en' 
              ? 'Step by step — from letters to beautiful recitation!' 
              : 'خطوة بخطوة — من الحروف إلى التلاوة الجميلة!'
            }
          </Text>
        </View>

        {/* Islamic Pattern Background */}
        <View style={{
          backgroundColor: colors.lightBlue,
          marginHorizontal: 20,
          borderRadius: 20,
          padding: 20,
          marginBottom: 30,
        }}>
          <Text style={[
            commonStyles.arabicText, 
            { 
              fontSize: 20, 
              color: colors.primary,
              textAlign: 'center',
              writingDirection: 'rtl',
            }
          ]}>
            وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا
          </Text>
          <Text style={[commonStyles.text, { fontSize: 14, fontStyle: 'italic', marginTop: 8 }]}>
            {language === 'en' ? '"And He taught Adam all the names"' : '"وعلم آدم الأسماء كلها"'}
          </Text>
        </View>

        {/* Main Action Buttons */}
        <View style={commonStyles.homeButtons}>
          <TouchableOpacity
            style={[buttonStyles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={navigateToAlphabet}
            activeOpacity={0.8}
          >
            <View style={{ 
              flexDirection: isRTL ? 'row-reverse' : 'row', 
              alignItems: 'center', 
              gap: 12 
            }}>
              <Icon name="library-outline" size={24} color={colors.backgroundAlt} />
              <Text style={{
                color: colors.backgroundAlt,
                fontSize: 18,
                fontWeight: '700',
                fontFamily: isRTL ? 'Amiri_700Bold' : undefined,
              }}>
                {language === 'en' ? 'Learn the Alphabet' : 'تعلم الأبجدية'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.secondaryButton, { backgroundColor: colors.secondary }]}
            onPress={navigateToReadingChapters}
            activeOpacity={0.8}
          >
            <View style={{ 
              flexDirection: isRTL ? 'row-reverse' : 'row', 
              alignItems: 'center', 
              gap: 12 
            }}>
              <Icon name="book-outline" size={24} color={colors.backgroundAlt} />
              <Text style={{
                color: colors.backgroundAlt,
                fontSize: 18,
                fontWeight: '700',
                fontFamily: isRTL ? 'Amiri_700Bold' : undefined,
              }}>
                {language === 'en' ? 'Reading Chapters' : 'فصول القراءة'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.secondaryButton, { backgroundColor: colors.warning }]}
            onPress={navigateToPronunciation}
            activeOpacity={0.8}
          >
            <View style={{ 
              flexDirection: isRTL ? 'row-reverse' : 'row', 
              alignItems: 'center', 
              gap: 12 
            }}>
              <Icon name="mic-outline" size={24} color={colors.backgroundAlt} />
              <Text style={{
                color: colors.backgroundAlt,
                fontSize: 18,
                fontWeight: '700',
                fontFamily: isRTL ? 'Amiri_700Bold' : undefined,
              }}>
                {language === 'en' ? 'Pronunciation Practice' : 'تدريب النطق'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.primaryButton, { backgroundColor: colors.accent }]}
            onPress={navigateToSurah}
            activeOpacity={0.8}
          >
            <View style={{ 
              flexDirection: isRTL ? 'row-reverse' : 'row', 
              alignItems: 'center', 
              gap: 12 
            }}>
              <Icon name="book-outline" size={24} color={colors.text} />
              <Text style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: '700',
                fontFamily: isRTL ? 'Amiri_700Bold' : undefined,
              }}>
                {language === 'en' ? 'Read a Surah' : 'اقرأ سورة'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.secondaryButton, { backgroundColor: colors.gold }]}
            onPress={navigateToProgress}
            activeOpacity={0.8}
          >
            <View style={{ 
              flexDirection: isRTL ? 'row-reverse' : 'row', 
              alignItems: 'center', 
              gap: 12 
            }}>
              <Icon name="star-outline" size={24} color={colors.text} />
              <Text style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: '700',
                fontFamily: isRTL ? 'Amiri_700Bold' : undefined,
              }}>
                {language === 'en' ? 'My Progress' : 'تقدمي'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Encouraging Message */}
        <View style={{
          backgroundColor: colors.card,
          marginHorizontal: 20,
          marginTop: 30,
          marginBottom: 20,
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.accent,
        }}>
          <Text style={[
            commonStyles.text, 
            { 
              color: colors.primary, 
              fontWeight: '600', 
              fontSize: 16,
              textAlign: isRTL ? 'right' : 'left',
              fontFamily: isRTL ? 'Amiri_700Bold' : undefined,
            }
          ]}>
            {language === 'en' 
              ? '🌟 Start your beautiful journey of learning Arabic today!' 
              : '🌟 ابدأ رحلتك الجميلة في تعلم العربية اليوم!'
            }
          </Text>
          <Text style={[
            commonStyles.text, 
            { 
              fontSize: 14, 
              marginTop: 8, 
              color: colors.textLight,
              textAlign: isRTL ? 'right' : 'left',
              fontFamily: isRTL ? 'Amiri_400Regular' : undefined,
            }
          ]}>
            {language === 'en'
              ? 'Every letter you learn brings you closer to understanding the Qur\'an.'
              : 'كل حرف تتعلمه يقربك من فهم القرآن.'
            }
          </Text>
        </View>

        {/* Made by Hamzah Alfarra */}
        <View style={{
          backgroundColor: colors.lightBlue,
          marginHorizontal: 20,
          marginBottom: 20,
          borderRadius: 12,
          padding: 16,
          alignItems: 'center',
        }}>
          <Text style={[commonStyles.text, { 
            fontSize: 14, 
            color: colors.textLight, 
            fontStyle: 'italic',
            textAlign: 'center'
          }]}>
            {language === 'en' ? 'Made by Hamzah Alfarra' : 'صنع بواسطة حمزة الفرا'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
