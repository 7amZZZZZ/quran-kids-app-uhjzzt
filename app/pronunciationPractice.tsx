
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import Icon from '../components/Icon';

const practiceWords = [
  {
    arabic: 'اللَّه',
    transliteration: 'Allah',
    meaning: 'God',
    difficulty: 'easy',
    phonetic: 'ʔallaːh'
  },
  {
    arabic: 'السَّلَامُ عَلَيْكُمْ',
    transliteration: 'As-salamu alaykum',
    meaning: 'Peace be upon you',
    difficulty: 'medium',
    phonetic: 'ʔas.sa.laː.mu ʕa.lay.kum'
  },
  {
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    meaning: 'In the name of Allah',
    difficulty: 'easy',
    phonetic: 'bis.mil.laːh'
  },
  {
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'All praise is due to Allah',
    difficulty: 'medium',
    phonetic: 'ʔal.ħam.du lil.laːh'
  },
  {
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhanallah',
    meaning: 'Glory be to Allah',
    difficulty: 'medium',
    phonetic: 'sub.ħaː.nal.laːh'
  },
  {
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    transliteration: 'La ilaha illa Allah',
    meaning: 'There is no god but Allah',
    difficulty: 'hard',
    phonetic: 'laː ʔi.laː.ha ʔil.lal.laːh'
  }
];

export default function PronunciationPracticeScreen() {
  const [selectedWord, setSelectedWord] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const goBack = () => {
    console.log('Going back to home');
    router.back();
  };

  const playTargetWord = async () => {
    const word = practiceWords[selectedWord];
    console.log('Playing target word:', word.arabic);
    
    try {
      // Enhanced Arabic pronunciation with better settings
      await Speech.speak(word.arabic, {
        language: 'ar-SA', // Saudi Arabic for better Quranic pronunciation
        pitch: 0.85,
        rate: 0.5, // Very slow for learning
        quality: 'enhanced',
      });
    } catch (error) {
      console.log('Enhanced Arabic speech error, trying standard Arabic:', error);
      try {
        // Fallback to standard Arabic
        await Speech.speak(word.arabic, {
          language: 'ar',
          pitch: 0.85,
          rate: 0.5,
        });
      } catch (error2) {
        console.log('Standard Arabic speech error, using phonetic pronunciation:', error2);
        // Final fallback to phonetic pronunciation
        await Speech.speak(word.phonetic || word.transliteration, {
          language: 'en',
          pitch: 0.8,
          rate: 0.6,
        });
      }
    }
  };

  const startListening = () => {
    console.log('Starting pronunciation practice');
    setIsListening(true);
    
    // Simulate listening and feedback (in a real app, this would use speech recognition)
    setTimeout(() => {
      setIsListening(false);
      provideFeedback();
    }, 3000);
  };

  const provideFeedback = () => {
    const feedbackOptions = [
      "Great pronunciation! 🌟",
      "Very good! Keep practicing! 👏",
      "Good effort! Try to pronounce it a bit slower. 📚",
      "Nice try! Listen to the example again and repeat. 🎯",
      "Excellent! Your pronunciation is improving! ⭐"
    ];
    
    const randomFeedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
    setFeedback(randomFeedback);
    
    // Increase score
    setScore(prev => prev + 10);
    
    // Clear feedback after 3 seconds
    setTimeout(() => setFeedback(null), 3000);
  };

  const nextWord = () => {
    if (selectedWord < practiceWords.length - 1) {
      setSelectedWord(prev => prev + 1);
    } else {
      setSelectedWord(0);
    }
    setFeedback(null);
  };

  const previousWord = () => {
    if (selectedWord > 0) {
      setSelectedWord(prev => prev - 1);
    } else {
      setSelectedWord(practiceWords.length - 1);
    }
    setFeedback(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return colors.success;
      case 'medium': return colors.warning;
      case 'hard': return colors.error;
      default: return colors.primary;
    }
  };

  const currentWord = practiceWords[selectedWord];

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
        <Text style={commonStyles.pageTitle}>Pronunciation Practice</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Score Display */}
        <View style={[commonStyles.card, { marginBottom: 20, backgroundColor: colors.lightBlue }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[commonStyles.text, { fontSize: 18, fontWeight: '600' }]}>
              Your Score: {score} points
            </Text>
            <View style={{
              backgroundColor: colors.gold,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}>
              <Text style={{ color: colors.text, fontWeight: '600' }}>
                ⭐ {Math.floor(score / 50)} stars
              </Text>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={[commonStyles.card, { marginBottom: 20 }]}>
          <Text style={[commonStyles.text, { textAlign: 'center', color: colors.primary, fontWeight: '600' }]}>
            🎤 Listen, then speak into your microphone
          </Text>
          <Text style={[commonStyles.text, { textAlign: 'center', fontSize: 14, marginTop: 8 }]}>
            Try to match the pronunciation as closely as possible
          </Text>
        </View>

        {/* Current Word Display */}
        <View style={[commonStyles.card, { marginBottom: 20, alignItems: 'center' }]}>
          {/* Difficulty Badge */}
          <View style={{
            backgroundColor: getDifficultyColor(currentWord.difficulty),
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
            marginBottom: 16,
          }}>
            <Text style={{
              color: colors.backgroundAlt,
              fontSize: 12,
              fontWeight: '600',
              textTransform: 'uppercase',
            }}>
              {currentWord.difficulty}
            </Text>
          </View>

          {/* Arabic Text */}
          <Text style={[commonStyles.arabicText, { fontSize: 36, marginBottom: 16 }]}>
            {currentWord.arabic}
          </Text>

          {/* Transliteration */}
          <Text style={[commonStyles.text, { fontSize: 18, fontStyle: 'italic', marginBottom: 8 }]}>
            {currentWord.transliteration}
          </Text>

          {/* Phonetic Guide */}
          {currentWord.phonetic && (
            <Text style={[commonStyles.text, { fontSize: 14, color: colors.textLight, marginBottom: 8 }]}>
              Phonetic: {currentWord.phonetic}
            </Text>
          )}

          {/* Meaning */}
          <Text style={[commonStyles.text, { fontSize: 16, color: colors.textLight, marginBottom: 20 }]}>
            Meaning: {currentWord.meaning}
          </Text>

          {/* Play Button */}
          <TouchableOpacity
            style={[buttonStyles.primaryButton, { backgroundColor: colors.primary, marginBottom: 16 }]}
            onPress={playTargetWord}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="volume-high" size={20} color={colors.backgroundAlt} />
              <Text style={{
                color: colors.backgroundAlt,
                fontSize: 16,
                fontWeight: '600',
              }}>
                Listen to Pronunciation
              </Text>
            </View>
          </TouchableOpacity>

          {/* Record Button */}
          <TouchableOpacity
            style={[
              buttonStyles.secondaryButton,
              {
                backgroundColor: isListening ? colors.error : colors.secondary,
                marginBottom: 16,
              }
            ]}
            onPress={startListening}
            disabled={isListening}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon 
                name={isListening ? "stop" : "mic"} 
                size={20} 
                color={colors.backgroundAlt} 
              />
              <Text style={{
                color: colors.backgroundAlt,
                fontSize: 16,
                fontWeight: '600',
              }}>
                {isListening ? 'Listening...' : 'Start Recording'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Feedback */}
          {feedback && (
            <View style={{
              backgroundColor: colors.success,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 12,
              marginTop: 8,
            }}>
              <Text style={{
                color: colors.backgroundAlt,
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
              }}>
                {feedback}
              </Text>
            </View>
          )}
        </View>

        {/* Navigation Buttons */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <TouchableOpacity
            style={[buttonStyles.primaryButton, { flex: 1, backgroundColor: colors.grey }]}
            onPress={previousWord}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="chevron-back" size={20} color={colors.text} />
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
                Previous
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.primaryButton, { flex: 1, backgroundColor: colors.primary }]}
            onPress={nextWord}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ color: colors.backgroundAlt, fontSize: 16, fontWeight: '600' }}>
                Next
              </Text>
              <Icon name="chevron-forward" size={20} color={colors.backgroundAlt} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View style={[commonStyles.card, { marginBottom: 20 }]}>
          <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 12 }]}>
            Word {selectedWord + 1} of {practiceWords.length}
          </Text>
          <View style={{
            backgroundColor: colors.grey,
            height: 8,
            borderRadius: 4,
            overflow: 'hidden',
          }}>
            <View style={{
              backgroundColor: colors.primary,
              height: '100%',
              width: `${((selectedWord + 1) / practiceWords.length) * 100}%`,
              borderRadius: 4,
            }} />
          </View>
        </View>

        {/* Tips */}
        <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
          <Text style={[commonStyles.text, { color: colors.primary, fontWeight: '600', textAlign: 'center', marginBottom: 12 }]}>
            💡 Pronunciation Tips
          </Text>
          <Text style={[commonStyles.text, { fontSize: 14, textAlign: 'center' }]}>
            • Listen carefully to the example pronunciation{'\n'}
            • Speak clearly into your microphone{'\n'}
            • Take your time - accuracy is more important than speed{'\n'}
            • Practice regularly to improve your recitation{'\n'}
            • Use the phonetic guide to help with difficult sounds
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
