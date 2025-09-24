
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { router, useLocalSearchParams } from 'expo-router';
import Icon from '../components/Icon';
import { useLanguage } from '../contexts/LanguageContext';
import { allReadingChapters, ReadingChapter } from '../data/readingChaptersData';
import * as Speech from 'expo-speech';
import Voice from '@react-native-community/voice';

interface PronunciationFeedback {
  wordIndex: number;
  status: 'correct' | 'close' | 'incorrect';
  confidence: number;
}

export default function ChapterDetailScreen() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const { language, t } = useLanguage();
  const [chapter, setChapter] = useState<ReadingChapter | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pronunciationFeedback, setPronunciationFeedback] = useState<PronunciationFeedback[]>([]);
  const [isRepeatMode, setIsRepeatMode] = useState(false);
  const [recordingText, setRecordingText] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (chapterId) {
      const foundChapter = allReadingChapters.find(c => c.id === parseInt(chapterId));
      if (foundChapter) {
        setChapter(foundChapter);
        console.log('Loaded chapter:', foundChapter.title.en);
      }
    }

    // Initialize Voice
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [chapterId]);

  const goBack = () => {
    console.log('Going back from Chapter Detail');
    router.back();
  };

  const playAudio = async () => {
    if (!chapter) return;
    
    setIsPlaying(true);
    const currentContent = chapter.content[currentContentIndex];
    
    try {
      // Animate the text while playing
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      await Speech.speak(currentContent.text, {
        language: 'ar',
        pitch: 1.0,
        rate: 0.8,
        onDone: () => {
          setIsPlaying(false);
          console.log('Audio playback completed');
        },
        onError: (error) => {
          console.log('Speech error:', error);
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.log('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setPronunciationFeedback([]);
      setRecordingText('');
      
      await Voice.start('ar-SA');
      console.log('Started recording');
      
      // Visual feedback for recording
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } catch (error) {
      console.log('Error starting recording:', error);
      setIsRecording(false);
      
      // Fallback: Show alert that voice recognition is not available
      Alert.alert(
        language === 'en' ? 'Voice Recognition Unavailable' : 'التعرف على الصوت غير متاح',
        language === 'en' 
          ? 'Voice recognition is not supported on this platform. Please use the audio playback feature to practice pronunciation.'
          : 'التعرف على الصوت غير مدعوم على هذه المنصة. يرجى استخدام ميزة تشغيل الصوت لممارسة النطق.'
      );
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
      fadeAnim.stopAnimation();
      fadeAnim.setValue(1);
      console.log('Stopped recording');
    } catch (error) {
      console.log('Error stopping recording:', error);
      setIsRecording(false);
    }
  };

  const onSpeechStart = () => {
    console.log('Speech recognition started');
  };

  const onSpeechEnd = () => {
    console.log('Speech recognition ended');
    setIsRecording(false);
    fadeAnim.stopAnimation();
    fadeAnim.setValue(1);
  };

  const onSpeechResults = (event: any) => {
    if (event.value && event.value.length > 0) {
      const recognizedText = event.value[0];
      setRecordingText(recognizedText);
      console.log('Recognized text:', recognizedText);
      
      // Simulate AI feedback (in a real app, this would be sent to an AI service)
      provideFeedback(recognizedText);
    }
  };

  const onSpeechError = (event: any) => {
    console.log('Speech recognition error:', event.error);
    setIsRecording(false);
    fadeAnim.stopAnimation();
    fadeAnim.setValue(1);
  };

  const provideFeedback = (recognizedText: string) => {
    if (!chapter) return;
    
    const currentContent = chapter.content[currentContentIndex];
    const targetText = currentContent.text;
    
    // Simple similarity check (in a real app, use more sophisticated AI)
    const similarity = calculateSimilarity(recognizedText, targetText);
    
    let status: 'correct' | 'close' | 'incorrect';
    if (similarity > 0.8) {
      status = 'correct';
    } else if (similarity > 0.5) {
      status = 'close';
    } else {
      status = 'incorrect';
    }
    
    const feedback: PronunciationFeedback = {
      wordIndex: 0,
      status,
      confidence: similarity,
    };
    
    setPronunciationFeedback([feedback]);
    
    // Show feedback message
    const messages = {
      correct: language === 'en' ? 'Excellent pronunciation!' : 'نطق ممتاز!',
      close: language === 'en' ? 'Good, but try again for better pronunciation.' : 'جيد، لكن حاول مرة أخرى للحصول على نطق أفضل.',
      incorrect: language === 'en' ? 'Try listening again and repeat.' : 'حاول الاستماع مرة أخرى والتكرار.',
    };
    
    Alert.alert(
      language === 'en' ? 'Pronunciation Feedback' : 'تقييم النطق',
      messages[status]
    );
  };

  const calculateSimilarity = (text1: string, text2: string): number => {
    // Simple similarity calculation (in a real app, use more sophisticated algorithms)
    const words1 = text1.toLowerCase().split(' ');
    const words2 = text2.toLowerCase().split(' ');
    
    let matches = 0;
    const maxLength = Math.max(words1.length, words2.length);
    
    for (let i = 0; i < Math.min(words1.length, words2.length); i++) {
      if (words1[i] === words2[i]) {
        matches++;
      }
    }
    
    return matches / maxLength;
  };

  const repeatAfterMe = async () => {
    setIsRepeatMode(true);
    
    // First play the audio
    await playAudio();
    
    // Wait a moment, then start recording
    setTimeout(() => {
      if (!isRecording) {
        startRecording();
      }
    }, 1000);
    
    setIsRepeatMode(false);
  };

  const nextContent = () => {
    if (!chapter) return;
    
    if (currentContentIndex < chapter.content.length - 1) {
      setCurrentContentIndex(currentContentIndex + 1);
      setPronunciationFeedback([]);
      setRecordingText('');
    } else {
      // Chapter completed
      Alert.alert(
        language === 'en' ? 'Chapter Completed!' : 'تم إكمال الفصل!',
        language === 'en' ? 'Great job! Ready for the next chapter?' : 'عمل رائع! هل أنت مستعد للفصل التالي؟',
        [
          {
            text: language === 'en' ? 'Stay Here' : 'البقاء هنا',
            style: 'cancel'
          },
          {
            text: language === 'en' ? 'Next Chapter' : 'الفصل التالي',
            onPress: () => {
              // Mark chapter as completed and unlock next
              markChapterCompleted();
              goToNextChapter();
            }
          }
        ]
      );
    }
  };

  const previousContent = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1);
      setPronunciationFeedback([]);
      setRecordingText('');
    }
  };

  const markChapterCompleted = () => {
    // In a real app, this would save to persistent storage
    console.log('Chapter completed:', chapter?.id);
  };

  const goToNextChapter = () => {
    if (!chapter) return;
    
    const nextChapter = allReadingChapters.find(c => c.id === chapter.id + 1);
    if (nextChapter) {
      router.replace({
        pathname: '/chapterDetail',
        params: { chapterId: nextChapter.id.toString() }
      });
    } else {
      router.back();
    }
  };

  const resetChapter = () => {
    Alert.alert(
      language === 'en' ? 'Reset Chapter' : 'إعادة تعيين الفصل',
      language === 'en' ? 'Are you sure you want to restart this chapter?' : 'هل أنت متأكد من أنك تريد إعادة تشغيل هذا الفصل؟',
      [
        { text: language === 'en' ? 'Cancel' : 'إلغاء', style: 'cancel' },
        {
          text: language === 'en' ? 'Reset' : 'إعادة تعيين',
          onPress: () => {
            setCurrentContentIndex(0);
            setPronunciationFeedback([]);
            setRecordingText('');
            console.log('Chapter reset');
          }
        }
      ]
    );
  };

  const getFeedbackColor = (status: 'correct' | 'close' | 'incorrect') => {
    switch (status) {
      case 'correct': return colors.success;
      case 'close': return colors.warning;
      case 'incorrect': return colors.error;
      default: return colors.text;
    }
  };

  if (!chapter) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={commonStyles.text}>
            {language === 'en' ? 'Chapter not found' : 'الفصل غير موجود'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentContent = chapter.content[currentContentIndex];
  const isRTL = language === 'ar';

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={[
        commonStyles.navigationHeader,
        { flexDirection: isRTL ? 'row-reverse' : 'row' }
      ]}>
        <TouchableOpacity
          onPress={goBack}
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Icon 
            name={isRTL ? "chevron-forward" : "chevron-back"} 
            size={24} 
            color={colors.primary} 
          />
          <Text style={[commonStyles.backButtonText, { color: colors.primary }]}>
            {t('back')}
          </Text>
        </TouchableOpacity>

        <Text style={[
          commonStyles.pageTitle,
          { 
            fontFamily: isRTL ? 'Amiri_700Bold' : undefined,
            textAlign: 'center',
            fontSize: 16
          }
        ]}>
          {chapter.title[language]}
        </Text>

        <TouchableOpacity onPress={resetChapter}>
          <Icon name="refresh" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Progress Indicator */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
      }}>
        <Text style={[
          commonStyles.text,
          { fontSize: 16, color: colors.textLight }
        ]}>
          {currentContentIndex + 1} / {chapter.content.length}
        </Text>
        <View style={{
          flex: 1,
          height: 4,
          backgroundColor: colors.grey,
          borderRadius: 2,
          marginHorizontal: 16,
        }}>
          <View style={{
            width: `${((currentContentIndex + 1) / chapter.content.length) * 100}%`,
            height: '100%',
            backgroundColor: colors.primary,
            borderRadius: 2,
          }} />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Main Content */}
        <Animated.View style={[
          commonStyles.card,
          {
            alignItems: 'center',
            padding: 30,
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          }
        ]}>
          <Text style={[
            commonStyles.arabicText,
            {
              fontSize: 36,
              color: pronunciationFeedback.length > 0 
                ? getFeedbackColor(pronunciationFeedback[0].status)
                : colors.arabicText,
              textAlign: 'center',
              marginBottom: 20,
              lineHeight: 50,
              writingDirection: 'rtl',
            }
          ]}>
            {currentContent.text}
          </Text>

          {currentContent.phonetic && (
            <Text style={[
              commonStyles.text,
              {
                fontSize: 18,
                color: colors.textLight,
                fontStyle: 'italic',
                textAlign: 'center',
                marginBottom: 10,
              }
            ]}>
              [{currentContent.phonetic}]
            </Text>
          )}

          {currentContent.translation && (
            <Text style={[
              commonStyles.text,
              {
                fontSize: 16,
                color: colors.textLight,
                textAlign: 'center',
                marginBottom: 20,
                fontFamily: isRTL ? 'Amiri_400Regular' : undefined,
              }
            ]}>
              {currentContent.translation}
            </Text>
          )}

          {/* Pronunciation Feedback */}
          {pronunciationFeedback.length > 0 && (
            <View style={{
              backgroundColor: getFeedbackColor(pronunciationFeedback[0].status) + '20',
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: getFeedbackColor(pronunciationFeedback[0].status),
            }}>
              <Text style={{
                color: getFeedbackColor(pronunciationFeedback[0].status),
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
                fontFamily: isRTL ? 'Amiri_700Bold' : undefined,
              }}>
                {pronunciationFeedback[0].status === 'correct' && t('correctPronunciation')}
                {pronunciationFeedback[0].status === 'close' && t('closeButImprove')}
                {pronunciationFeedback[0].status === 'incorrect' && t('incorrectPronunciation')}
              </Text>
              {recordingText && (
                <Text style={{
                  color: colors.textLight,
                  fontSize: 14,
                  textAlign: 'center',
                  marginTop: 8,
                  fontStyle: 'italic',
                }}>
                  {language === 'en' ? 'You said:' : 'قلت:'} "{recordingText}"
                </Text>
              )}
            </View>
          )}
        </Animated.View>

        {/* Control Buttons */}
        <View style={{ gap: 16, marginTop: 20 }}>
          <TouchableOpacity
            style={[
              buttonStyles.primaryButton,
              {
                backgroundColor: isPlaying ? colors.warning : colors.primary,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                gap: 12,
              }
            ]}
            onPress={playAudio}
            disabled={isPlaying}
          >
            <Icon 
              name={isPlaying ? "volume-high" : "play"} 
              size={24} 
              color={colors.backgroundAlt} 
            />
            <Text style={{
              color: colors.backgroundAlt,
              fontSize: 18,
              fontWeight: '700',
              fontFamily: isRTL ? 'Amiri_700Bold' : undefined,
            }}>
              {isPlaying ? (language === 'en' ? 'Playing...' : 'يتم التشغيل...') : t('listen')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              buttonStyles.secondaryButton,
              {
                backgroundColor: isRecording ? colors.error : colors.secondary,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                gap: 12,
              }
            ]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Icon 
              name={isRecording ? "stop" : "mic"} 
              size={24} 
              color={colors.backgroundAlt} 
            />
            <Text style={{
              color: colors.backgroundAlt,
              fontSize: 18,
              fontWeight: '700',
              fontFamily: isRTL ? 'Amiri_700Bold' : undefined,
            }}>
              {isRecording 
                ? (language === 'en' ? 'Recording...' : 'يتم التسجيل...') 
                : t('record')
              }
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              buttonStyles.primaryButton,
              {
                backgroundColor: colors.accent,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                gap: 12,
              }
            ]}
            onPress={repeatAfterMe}
            disabled={isPlaying || isRecording}
          >
            <Icon name="repeat" size={24} color={colors.text} />
            <Text style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: '700',
              fontFamily: isRTL ? 'Amiri_700Bold' : undefined,
            }}>
              {t('repeatAfterMe')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Buttons */}
        <View style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          justifyContent: 'space-between',
          marginTop: 30,
          gap: 16,
        }}>
          <TouchableOpacity
            style={[
              buttonStyles.secondaryButton,
              {
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.grey,
                flex: 1,
                opacity: currentContentIndex === 0 ? 0.5 : 1,
              }
            ]}
            onPress={previousContent}
            disabled={currentContentIndex === 0}
          >
            <Text style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: '600',
              fontFamily: isRTL ? 'Amiri_700Bold' : undefined,
            }}>
              {language === 'en' ? 'Previous' : 'السابق'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              buttonStyles.primaryButton,
              {
                backgroundColor: colors.primary,
                flex: 1,
              }
            ]}
            onPress={nextContent}
          >
            <Text style={{
              color: colors.backgroundAlt,
              fontSize: 16,
              fontWeight: '600',
              fontFamily: isRTL ? 'Amiri_700Bold' : undefined,
            }}>
              {currentContentIndex === chapter.content.length - 1 
                ? (language === 'en' ? 'Complete Chapter' : 'إكمال الفصل')
                : (language === 'en' ? 'Next' : 'التالي')
              }
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
