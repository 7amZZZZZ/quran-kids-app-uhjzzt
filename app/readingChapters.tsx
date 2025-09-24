
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { router } from 'expo-router';
import Icon from '../components/Icon';
import { useLanguage } from '../contexts/LanguageContext';
import { allReadingChapters, ReadingChapter } from '../data/readingChaptersData';
import Svg, { Circle } from 'react-native-svg';

export default function ReadingChaptersScreen() {
  const { language, setLanguage, t } = useLanguage();
  const [chapters, setChapters] = useState<ReadingChapter[]>(allReadingChapters);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  useEffect(() => {
    console.log('Reading Chapters screen loaded');
    // Unlock first chapter by default
    if (chapters[0] && !chapters[0].unlocked) {
      const updatedChapters = [...chapters];
      updatedChapters[0].unlocked = true;
      setChapters(updatedChapters);
    }
  }, []);

  const goBack = () => {
    console.log('Going back from Reading Chapters');
    router.back();
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    console.log('Language toggled to:', newLanguage);
  };

  const openChapter = (chapter: ReadingChapter) => {
    if (!chapter.unlocked) {
      Alert.alert(
        language === 'en' ? 'Chapter Locked' : 'الفصل مقفل',
        language === 'en' 
          ? 'Complete previous chapters to unlock this one.' 
          : 'أكمل الفصول السابقة لفتح هذا الفصل.'
      );
      return;
    }
    
    console.log('Opening chapter:', chapter.id);
    router.push({
      pathname: '/chapterDetail',
      params: { chapterId: chapter.id.toString() }
    });
  };

  const filteredChapters = selectedLevel === 'all' 
    ? chapters 
    : chapters.filter(chapter => chapter.level === selectedLevel);

  const getCompletedCount = () => {
    return chapters.filter(chapter => chapter.completed).length;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return colors.success;
      case 'intermediate': return colors.warning;
      case 'advanced': return colors.error;
      default: return colors.primary;
    }
  };

  const CircularProgress = ({ progress, total, size = 60 }: { progress: number; total: number; size?: number }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / total) * circumference;

    return (
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.grey}
          strokeWidth="4"
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primary}
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    );
  };

  const ChapterCard = ({ chapter }: { chapter: ReadingChapter }) => {
    const isRTL = language === 'ar';
    
    return (
      <TouchableOpacity
        style={[
          commonStyles.card,
          {
            marginHorizontal: 16,
            marginVertical: 8,
            opacity: chapter.unlocked ? 1 : 0.6,
            borderLeftWidth: isRTL ? 0 : 4,
            borderRightWidth: isRTL ? 4 : 0,
            borderLeftColor: isRTL ? 'transparent' : getLevelColor(chapter.level),
            borderRightColor: isRTL ? getLevelColor(chapter.level) : 'transparent',
          }
        ]}
        onPress={() => openChapter(chapter)}
        activeOpacity={0.7}
      >
        <View style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <View style={{ flex: 1 }}>
            <View style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              marginBottom: 8
            }}>
              <Text style={[
                commonStyles.text,
                {
                  fontSize: 14,
                  color: colors.textLight,
                  fontWeight: '600',
                  textAlign: isRTL ? 'right' : 'left'
                }
              ]}>
                {t('chapter')} {chapter.id} {t('of')} 52
              </Text>
              {chapter.completed && (
                <Icon 
                  name="checkmark-circle" 
                  size={16} 
                  color={colors.success} 
                  style={{ marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}
                />
              )}
            </View>
            
            <Text style={[
              commonStyles.text,
              {
                fontSize: 18,
                fontWeight: '700',
                color: colors.text,
                marginBottom: 4,
                textAlign: isRTL ? 'right' : 'left',
                fontFamily: isRTL ? 'Amiri_700Bold' : undefined,
              }
            ]}>
              {chapter.title[language]}
            </Text>
            
            <View style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 12
            }}>
              <View style={{
                backgroundColor: getLevelColor(chapter.level),
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}>
                <Text style={{
                  color: colors.backgroundAlt,
                  fontSize: 12,
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {chapter.level}
                </Text>
              </View>
              
              <View style={{
                backgroundColor: colors.lightBlue,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}>
                <Text style={{
                  color: colors.primary,
                  fontSize: 12,
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {chapter.category}
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name={i < chapter.difficulty ? "star" : "star-outline"}
                    size={12}
                    color={i < chapter.difficulty ? colors.gold : colors.grey}
                  />
                ))}
              </View>
            </View>
          </View>
          
          <View style={{ alignItems: 'center', marginLeft: isRTL ? 0 : 16, marginRight: isRTL ? 16 : 0 }}>
            {!chapter.unlocked ? (
              <Icon name="lock-closed" size={24} color={colors.grey} />
            ) : chapter.completed ? (
              <Icon name="checkmark-circle" size={32} color={colors.success} />
            ) : (
              <Icon name="play-circle" size={32} color={colors.primary} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={[
        commonStyles.navigationHeader,
        { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
      ]}>
        <TouchableOpacity
          onPress={goBack}
          style={{
            flexDirection: language === 'ar' ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Icon 
            name={language === 'ar' ? "chevron-forward" : "chevron-back"} 
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
            fontFamily: language === 'ar' ? 'Amiri_700Bold' : undefined,
            textAlign: 'center'
          }
        ]}>
          {t('readingChapters')}
        </Text>

        <TouchableOpacity
          onPress={toggleLanguage}
          style={{
            backgroundColor: colors.lightBlue,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
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

      {/* Progress Overview */}
      <View style={[
        commonStyles.card,
        { 
          marginHorizontal: 16, 
          marginVertical: 16,
          alignItems: 'center'
        }
      ]}>
        <CircularProgress progress={getCompletedCount()} total={52} size={80} />
        <Text style={[
          commonStyles.text,
          {
            fontSize: 24,
            fontWeight: '700',
            color: colors.primary,
            marginTop: 12
          }
        ]}>
          {getCompletedCount()}/52
        </Text>
        <Text style={[
          commonStyles.text,
          {
            fontSize: 16,
            color: colors.textLight,
            textAlign: 'center'
          }
        ]}>
          {t('completed')}
        </Text>
      </View>

      {/* Level Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 60 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      >
        {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => setSelectedLevel(level as any)}
            style={{
              backgroundColor: selectedLevel === level ? colors.primary : colors.card,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: selectedLevel === level ? colors.primary : colors.grey,
            }}
          >
            <Text style={{
              color: selectedLevel === level ? colors.backgroundAlt : colors.text,
              fontSize: 14,
              fontWeight: '600',
              textTransform: 'capitalize'
            }}>
              {level === 'all' ? (language === 'en' ? 'All' : 'الكل') : level}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Chapters List */}
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {filteredChapters.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
