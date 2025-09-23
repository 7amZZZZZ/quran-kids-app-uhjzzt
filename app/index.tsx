
import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFonts, Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import * as SplashScreen from 'expo-splash-screen';
import Icon from '../components/Icon';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
  });

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

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={commonStyles.homeHeader}>
          <Text style={commonStyles.arabicTitle}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </Text>
          <Text style={[commonStyles.title, { color: colors.primary, marginTop: 16 }]}>
            Learn to Read the Qur'an
          </Text>
          <Text style={[commonStyles.text, { fontSize: 18, color: colors.textLight, textAlign: 'center', marginTop: 8 }]}>
            Step by step — from letters to beautiful recitation!
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
          <Text style={[commonStyles.arabicText, { fontSize: 20, color: colors.primary }]}>
            وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا
          </Text>
          <Text style={[commonStyles.text, { fontSize: 14, fontStyle: 'italic', marginTop: 8 }]}>
            "And He taught Adam all the names"
          </Text>
        </View>

        {/* Main Action Buttons */}
        <View style={commonStyles.homeButtons}>
          <TouchableOpacity
            style={[buttonStyles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={navigateToAlphabet}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Icon name="library-outline" size={24} color={colors.backgroundAlt} />
              <Text style={{
                color: colors.backgroundAlt,
                fontSize: 18,
                fontWeight: '700',
              }}>
                Learn the Alphabet
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.secondaryButton, { backgroundColor: colors.secondary }]}
            onPress={navigateToPronunciation}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Icon name="mic-outline" size={24} color={colors.backgroundAlt} />
              <Text style={{
                color: colors.backgroundAlt,
                fontSize: 18,
                fontWeight: '700',
              }}>
                Pronunciation Practice
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.primaryButton, { backgroundColor: colors.accent }]}
            onPress={navigateToSurah}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Icon name="book-outline" size={24} color={colors.text} />
              <Text style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: '700',
              }}>
                Read a Surah
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.secondaryButton, { backgroundColor: colors.gold }]}
            onPress={navigateToProgress}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Icon name="star-outline" size={24} color={colors.text} />
              <Text style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: '700',
              }}>
                My Progress
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
          <Text style={[commonStyles.text, { color: colors.primary, fontWeight: '600', fontSize: 16 }]}>
            🌟 Start your beautiful journey of learning Arabic today!
          </Text>
          <Text style={[commonStyles.text, { fontSize: 14, marginTop: 8, color: colors.textLight }]}>
            Every letter you learn brings you closer to understanding the Qur'an.
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
            Made by Hamzah Alfarra
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
