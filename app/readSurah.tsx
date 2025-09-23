
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import Icon from '../components/Icon';

const surahs = {
  fatiha: {
    name: 'Al-Fatiha',
    arabicName: 'الفاتحة',
    verses: [
      {
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: 'Bismillahi r-rahmani r-raheem',
        translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
        words: ['بِسْمِ', 'اللَّهِ', 'الرَّحْمَٰنِ', 'الرَّحِيمِ'],
        phonetic: 'bis.mil.laː.hir.raħ.maː.nir.ra.ħiːm'
      },
      {
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteration: 'Alhamdu lillahi rabbi l-alameen',
        translation: 'All praise is due to Allah, Lord of all the worlds',
        words: ['الْحَمْدُ', 'لِلَّهِ', 'رَبِّ', 'الْعَالَمِينَ'],
        phonetic: 'ʔal.ħam.du lil.laː.hi rab.bil.ʕaː.la.miːn'
      },
      {
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: 'Ar-rahmani r-raheem',
        translation: 'The Most Gracious, the Most Merciful',
        words: ['الرَّحْمَٰنِ', 'الرَّحِيمِ'],
        phonetic: 'ʔar.raħ.maː.nir.ra.ħiːm'
      },
      {
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        transliteration: 'Maliki yawmi d-deen',
        translation: 'Master of the Day of Judgment',
        words: ['مَالِكِ', 'يَوْمِ', 'الدِّينِ'],
        phonetic: 'maː.li.ki yaw.mid.diːn'
      },
      {
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transliteration: 'Iyyaka na\'budu wa iyyaka nasta\'een',
        translation: 'You alone we worship, and You alone we ask for help',
        words: ['إِيَّاكَ', 'نَعْبُدُ', 'وَإِيَّاكَ', 'نَسْتَعِينُ'],
        phonetic: 'ʔiy.yaː.ka naʕ.bu.du wa ʔiy.yaː.ka nas.ta.ʕiːn'
      },
      {
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        transliteration: 'Ihdina s-sirata l-mustaqeem',
        translation: 'Guide us on the straight path',
        words: ['اهْدِنَا', 'الصِّرَاطَ', 'الْمُسْتَقِيمَ'],
        phonetic: 'ʔih.di.naːs.si.raː.tal.mus.ta.qiːm'
      },
      {
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        transliteration: 'Sirata l-ladhina an\'amta \'alayhim ghayri l-maghdubi \'alayhim wa la d-dalleen',
        translation: 'The path of those You have blessed, not of those who have incurred Your wrath, nor of those who have gone astray',
        words: ['صِرَاطَ', 'الَّذِينَ', 'أَنْعَمْتَ', 'عَلَيْهِمْ', 'غَيْرِ', 'الْمَغْضُوبِ', 'عَلَيْهِمْ', 'وَلَا', 'الضَّالِّينَ'],
        phonetic: 'si.raː.tal.la.ðiː.na ʔan.ʕam.ta ʕa.lay.him ɣay.ril.maɣ.duː.bi ʕa.lay.him wa.laːd.dˤaːl.liːn'
      }
    ]
  },
  ikhlas: {
    name: 'Al-Ikhlas',
    arabicName: 'الإخلاص',
    verses: [
      {
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: 'Bismillahi r-rahmani r-raheem',
        translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
        words: ['بِسْمِ', 'اللَّهِ', 'الرَّحْمَٰنِ', 'الرَّحِيمِ'],
        phonetic: 'bis.mil.laː.hir.raħ.maː.nir.ra.ħiːm'
      },
      {
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        transliteration: 'Qul huwa Allahu ahad',
        translation: 'Say: He is Allah, the One',
        words: ['قُلْ', 'هُوَ', 'اللَّهُ', 'أَحَدٌ'],
        phonetic: 'qul hu.wal.laː.hu ʔa.ħad'
      },
      {
        arabic: 'اللَّهُ الصَّمَدُ',
        transliteration: 'Allahu s-samad',
        translation: 'Allah, the Eternal, Absolute',
        words: ['اللَّهُ', 'الصَّمَدُ'],
        phonetic: 'ʔal.laː.hus.sˤa.mad'
      },
      {
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        transliteration: 'Lam yalid wa lam yulad',
        translation: 'He begets not, nor is He begotten',
        words: ['لَمْ', 'يَلِدْ', 'وَلَمْ', 'يُولَدْ'],
        phonetic: 'lam ya.lid wa.lam yu.lad'
      },
      {
        arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transliteration: 'Wa lam yakun lahu kufuwan ahad',
        translation: 'And there is none comparable to Him',
        words: ['وَلَمْ', 'يَكُن', 'لَّهُ', 'كُفُوًا', 'أَحَدٌ'],
        phonetic: 'wa.lam ya.kun la.hu ku.fu.wan ʔa.ħad'
      }
    ]
  }
};

export default function ReadSurahScreen() {
  const [selectedSurah, setSelectedSurah] = useState<'fatiha' | 'ikhlas'>('fatiha');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const goBack = () => {
    console.log('Going back to home');
    router.back();
  };

  const playWord = async (word: string) => {
    console.log('Playing word:', word);
    setSelectedWord(word);
    
    try {
      // Enhanced Arabic pronunciation with better settings
      await Speech.speak(word, {
        language: 'ar-SA', // Saudi Arabic for better Quranic pronunciation
        pitch: 0.85,
        rate: 0.5, // Very slow for learning
        quality: 'enhanced',
      });
    } catch (error) {
      console.log('Enhanced Arabic speech error, trying standard Arabic:', error);
      try {
        // Fallback to standard Arabic
        await Speech.speak(word, {
          language: 'ar',
          pitch: 0.85,
          rate: 0.5,
        });
      } catch (error2) {
        console.log('Standard Arabic speech error:', error2);
      }
    }
    
    // Clear selection after a delay
    setTimeout(() => setSelectedWord(null), 1000);
  };

  const playFullVerse = async (verse: any) => {
    console.log('Playing full verse:', verse.arabic);
    
    try {
      // Enhanced Arabic pronunciation with better settings
      await Speech.speak(verse.arabic, {
        language: 'ar-SA', // Saudi Arabic for better Quranic pronunciation
        pitch: 0.85,
        rate: 0.4, // Very slow for learning
        quality: 'enhanced',
      });
    } catch (error) {
      console.log('Enhanced Arabic speech error, trying standard Arabic:', error);
      try {
        // Fallback to standard Arabic
        await Speech.speak(verse.arabic, {
          language: 'ar',
          pitch: 0.85,
          rate: 0.4,
        });
      } catch (error2) {
        console.log('Standard Arabic speech error, using phonetic pronunciation:', error2);
        // Final fallback to phonetic pronunciation
        if (verse.phonetic) {
          await Speech.speak(verse.phonetic, {
            language: 'en',
            pitch: 0.8,
            rate: 0.6,
          });
        }
      }
    }
  };

  const currentSurah = surahs[selectedSurah];

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
        <Text style={commonStyles.pageTitle}>Read a Surah</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Surah Selection */}
        <View style={[commonStyles.card, { marginBottom: 20 }]}>
          <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 16, fontSize: 16, fontWeight: '600' }]}>
            Choose a Surah to practice:
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={[
                buttonStyles.primaryButton,
                {
                  flex: 1,
                  backgroundColor: selectedSurah === 'fatiha' ? colors.primary : colors.grey,
                }
              ]}
              onPress={() => setSelectedSurah('fatiha')}
            >
              <Text style={{
                color: colors.backgroundAlt,
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
              }}>
                Al-Fatiha
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                buttonStyles.primaryButton,
                {
                  flex: 1,
                  backgroundColor: selectedSurah === 'ikhlas' ? colors.primary : colors.grey,
                }
              ]}
              onPress={() => setSelectedSurah('ikhlas')}
            >
              <Text style={{
                color: colors.backgroundAlt,
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
              }}>
                Al-Ikhlas
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Surah Header */}
        <View style={[commonStyles.card, { marginBottom: 20, backgroundColor: colors.lightBlue }]}>
          <Text style={[commonStyles.arabicText, { fontSize: 28, textAlign: 'center', marginBottom: 8 }]}>
            سورة {currentSurah.arabicName}
          </Text>
          <Text style={[commonStyles.title, { fontSize: 20, textAlign: 'center' }]}>
            Surah {currentSurah.name}
          </Text>
        </View>

        {/* Instructions */}
        <View style={[commonStyles.card, { marginBottom: 20 }]}>
          <Text style={[commonStyles.text, { textAlign: 'center', color: colors.primary, fontWeight: '600' }]}>
            📖 Tap on any word to hear its pronunciation
          </Text>
          <Text style={[commonStyles.text, { textAlign: 'center', fontSize: 14, marginTop: 8 }]}>
            Listen carefully and try to follow along with the recitation
          </Text>
        </View>

        {/* Verses */}
        {currentSurah.verses.map((verse, verseIndex) => (
          <View key={verseIndex} style={[commonStyles.card, { marginBottom: 20 }]}>
            {/* Verse Number */}
            <View style={{
              backgroundColor: colors.primary,
              borderRadius: 20,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              marginBottom: 16,
            }}>
              <Text style={{
                color: colors.backgroundAlt,
                fontSize: 16,
                fontWeight: '700',
              }}>
                {verseIndex + 1}
              </Text>
            </View>

            {/* Arabic Text with Clickable Words */}
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: 16,
              gap: 8,
            }}>
              {verse.words.map((word, wordIndex) => (
                <TouchableOpacity
                  key={wordIndex}
                  onPress={() => playWord(word)}
                  style={{
                    backgroundColor: selectedWord === word ? colors.accent : 'transparent',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}
                >
                  <Text style={[
                    commonStyles.arabicText,
                    {
                      fontSize: 24,
                      color: selectedWord === word ? colors.backgroundAlt : colors.arabicText,
                    }
                  ]}>
                    {word}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Transliteration */}
            <Text style={[
              commonStyles.text,
              {
                textAlign: 'center',
                fontStyle: 'italic',
                color: colors.textLight,
                marginBottom: 8,
              }
            ]}>
              {verse.transliteration}
            </Text>

            {/* Phonetic Guide */}
            {verse.phonetic && (
              <Text style={[
                commonStyles.text,
                {
                  textAlign: 'center',
                  fontSize: 12,
                  color: colors.textLight,
                  marginBottom: 8,
                }
              ]}>
                Phonetic: {verse.phonetic}
              </Text>
            )}

            {/* Translation */}
            <Text style={[
              commonStyles.text,
              {
                textAlign: 'center',
                color: colors.text,
                marginBottom: 16,
              }
            ]}>
              {verse.translation}
            </Text>

            {/* Play Full Verse Button */}
            <TouchableOpacity
              style={[buttonStyles.secondaryButton, { backgroundColor: colors.secondary }]}
              onPress={() => playFullVerse(verse)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="play" size={20} color={colors.backgroundAlt} />
                <Text style={{
                  color: colors.backgroundAlt,
                  fontSize: 14,
                  fontWeight: '600',
                }}>
                  Play Full Verse
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}

        {/* Encouragement */}
        <View style={[commonStyles.card, { backgroundColor: colors.card, marginBottom: 20 }]}>
          <Text style={[commonStyles.text, { color: colors.primary, fontWeight: '600', textAlign: 'center' }]}>
            🌟 Excellent work practicing the Qur'an!
          </Text>
          <Text style={[commonStyles.text, { fontSize: 14, textAlign: 'center', marginTop: 8 }]}>
            Keep practicing to improve your recitation and understanding.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
