
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import Icon from '../components/Icon';

const arabicLetters = [
  { letter: 'ا', name: 'Alif', pronunciation: 'alif', sound: 'aa' },
  { letter: 'ب', name: 'Baa', pronunciation: 'baa', sound: 'ba' },
  { letter: 'ت', name: 'Taa', pronunciation: 'taa', sound: 'ta' },
  { letter: 'ث', name: 'Thaa', pronunciation: 'thaa', sound: 'tha' },
  { letter: 'ج', name: 'Jeem', pronunciation: 'jeem', sound: 'ja' },
  { letter: 'ح', name: 'Haa', pronunciation: 'haa', sound: 'ha' },
  { letter: 'خ', name: 'Khaa', pronunciation: 'khaa', sound: 'kha' },
  { letter: 'د', name: 'Daal', pronunciation: 'daal', sound: 'da' },
  { letter: 'ذ', name: 'Dhaal', pronunciation: 'dhaal', sound: 'dha' },
  { letter: 'ر', name: 'Raa', pronunciation: 'raa', sound: 'ra' },
  { letter: 'ز', name: 'Zaay', pronunciation: 'zaay', sound: 'za' },
  { letter: 'س', name: 'Seen', pronunciation: 'seen', sound: 'sa' },
  { letter: 'ش', name: 'Sheen', pronunciation: 'sheen', sound: 'sha' },
  { letter: 'ص', name: 'Saad', pronunciation: 'saad', sound: 'sa' },
  { letter: 'ض', name: 'Daad', pronunciation: 'daad', sound: 'da' },
  { letter: 'ط', name: 'Taa', pronunciation: 'taa', sound: 'ta' },
  { letter: 'ظ', name: 'Dhaa', pronunciation: 'dhaa', sound: 'dha' },
  { letter: 'ع', name: 'Ayn', pronunciation: 'ayn', sound: 'a' },
  { letter: 'غ', name: 'Ghayn', pronunciation: 'ghayn', sound: 'gha' },
  { letter: 'ف', name: 'Faa', pronunciation: 'faa', sound: 'fa' },
  { letter: 'ق', name: 'Qaaf', pronunciation: 'qaaf', sound: 'qa' },
  { letter: 'ك', name: 'Kaaf', pronunciation: 'kaaf', sound: 'ka' },
  { letter: 'ل', name: 'Laam', pronunciation: 'laam', sound: 'la' },
  { letter: 'م', name: 'Meem', pronunciation: 'meem', sound: 'ma' },
  { letter: 'ن', name: 'Noon', pronunciation: 'noon', sound: 'na' },
  { letter: 'ه', name: 'Haa', pronunciation: 'haa', sound: 'ha' },
  { letter: 'و', name: 'Waaw', pronunciation: 'waaw', sound: 'wa' },
  { letter: 'ي', name: 'Yaa', pronunciation: 'yaa', sound: 'ya' },
];

export default function LearnAlphabetScreen() {
  const [selectedLetter, setSelectedLetter] = useState<number | null>(null);
  const [animatedValue] = useState(new Animated.Value(1));

  const goBack = () => {
    console.log('Going back to home');
    router.back();
  };

  const playLetterSound = async (letter: typeof arabicLetters[0]) => {
    console.log('Playing sound for letter:', letter.letter);
    
    // Animate the letter
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Use text-to-speech for Arabic pronunciation
    try {
      await Speech.speak(letter.sound, {
        language: 'ar',
        pitch: 1.0,
        rate: 0.8,
      });
    } catch (error) {
      console.log('Speech error, using fallback:', error);
      // Fallback to English pronunciation
      await Speech.speak(letter.pronunciation, {
        language: 'en',
        pitch: 1.0,
        rate: 0.8,
      });
    }
  };

  const LetterCard = ({ letter, index }: { letter: typeof arabicLetters[0], index: number }) => {
    const isSelected = selectedLetter === index;
    
    return (
      <TouchableOpacity
        style={[
          commonStyles.letterCard,
          {
            backgroundColor: isSelected ? colors.accent : colors.card,
            borderColor: isSelected ? colors.primary : colors.accent,
            transform: selectedLetter === index ? [{ scale: animatedValue }] : [{ scale: 1 }],
          }
        ]}
        onPress={() => {
          setSelectedLetter(index);
          playLetterSound(letter);
        }}
        activeOpacity={0.8}
      >
        <Animated.Text style={[
          commonStyles.arabicText,
          {
            fontSize: 36,
            color: isSelected ? colors.backgroundAlt : colors.arabicText,
            marginBottom: 8,
          }
        ]}>
          {letter.letter}
        </Animated.Text>
        <Text style={[
          commonStyles.text,
          {
            fontSize: 14,
            fontWeight: '600',
            color: isSelected ? colors.backgroundAlt : colors.text,
          }
        ]}>
          {letter.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={commonStyles.navigationHeader}>
        <TouchableOpacity
          onPress={goBack}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
          <Text style={commonStyles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={commonStyles.pageTitle}>Learn the Alphabet</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Instructions */}
        <View style={[commonStyles.card, { marginBottom: 20 }]}>
          <Text style={[commonStyles.arabicText, { fontSize: 20, marginBottom: 12 }]}>
            الحروف العربية
          </Text>
          <Text style={[commonStyles.text, { textAlign: 'center' }]}>
            Tap on each letter to hear its pronunciation. Listen carefully and try to repeat!
          </Text>
        </View>

        {/* Letters Grid */}
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          gap: 8,
        }}>
          {arabicLetters.map((letter, index) => (
            <LetterCard key={index} letter={letter} index={index} />
          ))}
        </View>

        {/* Selected Letter Details */}
        {selectedLetter !== null && (
          <View style={[commonStyles.card, { marginTop: 20, backgroundColor: colors.lightBlue }]}>
            <Text style={[commonStyles.arabicText, { fontSize: 48, textAlign: 'center', marginBottom: 16 }]}>
              {arabicLetters[selectedLetter].letter}
            </Text>
            <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 8 }]}>
              {arabicLetters[selectedLetter].name}
            </Text>
            <Text style={[commonStyles.text, { fontSize: 16, marginBottom: 16 }]}>
              Pronunciation: {arabicLetters[selectedLetter].pronunciation}
            </Text>
            <TouchableOpacity
              style={[buttonStyles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={() => playLetterSound(arabicLetters[selectedLetter])}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="volume-high" size={20} color={colors.backgroundAlt} />
                <Text style={{ color: colors.backgroundAlt, fontSize: 16, fontWeight: '600' }}>
                  Play Sound
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Progress Encouragement */}
        <View style={[commonStyles.card, { marginTop: 20, backgroundColor: colors.card }]}>
          <Text style={[commonStyles.text, { color: colors.primary, fontWeight: '600', textAlign: 'center' }]}>
            🌟 Great job learning the Arabic alphabet!
          </Text>
          <Text style={[commonStyles.text, { fontSize: 14, textAlign: 'center', marginTop: 8 }]}>
            Practice makes perfect. Keep listening and repeating!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
