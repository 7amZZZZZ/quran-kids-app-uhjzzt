
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../components/Icon';
import Svg, { Circle } from 'react-native-svg';

const achievements = [
  {
    id: 1,
    title: 'First Steps',
    description: 'Learned your first Arabic letter',
    icon: 'star',
    earned: true,
    date: '2024-01-15'
  },
  {
    id: 2,
    title: 'Alphabet Master',
    description: 'Completed the Arabic alphabet',
    icon: 'library',
    earned: true,
    date: '2024-01-20'
  },
  {
    id: 3,
    title: 'First Recitation',
    description: 'Read your first Surah',
    icon: 'book',
    earned: true,
    date: '2024-01-22'
  },
  {
    id: 4,
    title: 'Pronunciation Pro',
    description: 'Completed 10 pronunciation exercises',
    icon: 'mic',
    earned: false,
    date: null
  },
  {
    id: 5,
    title: 'Consistent Learner',
    description: 'Practiced for 7 days in a row',
    icon: 'calendar',
    earned: false,
    date: null
  },
  {
    id: 6,
    title: 'Quranic Scholar',
    description: 'Memorized 5 Surahs',
    icon: 'school',
    earned: false,
    date: null
  }
];

const progressData = {
  alphabetProgress: 28, // out of 28 letters
  surahsRead: 2,
  pronunciationScore: 150,
  daysStreak: 3,
  totalStars: 15
};

export default function ProgressScreen() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements'>('overview');

  const goBack = () => {
    console.log('Going back to home');
    router.back();
  };

  const CircularProgress = ({ progress, total, size = 120, strokeWidth = 8, color = colors.primary }: {
    progress: number;
    total: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progressPercentage = (progress / total) * 100;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.grey}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 0 }]}>
            {progress}
          </Text>
          <Text style={[commonStyles.text, { fontSize: 14, color: colors.textLight }]}>
            of {total}
          </Text>
        </View>
      </View>
    );
  };

  const AchievementCard = ({ achievement }: { achievement: typeof achievements[0] }) => (
    <View style={[
      commonStyles.card,
      {
        flexDirection: 'row',
        alignItems: 'center',
        opacity: achievement.earned ? 1 : 0.6,
        backgroundColor: achievement.earned ? colors.card : colors.backgroundAlt,
        borderColor: achievement.earned ? colors.gold : colors.grey,
        borderWidth: achievement.earned ? 2 : 1,
      }
    ]}>
      <View style={{
        backgroundColor: achievement.earned ? colors.gold : colors.grey,
        borderRadius: 25,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
      }}>
        <Icon 
          name={achievement.icon as any} 
          size={24} 
          color={achievement.earned ? colors.text : colors.textLight} 
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[
          commonStyles.text,
          {
            fontSize: 16,
            fontWeight: '600',
            color: achievement.earned ? colors.text : colors.textLight,
            marginBottom: 4,
          }
        ]}>
          {achievement.title}
        </Text>
        <Text style={[
          commonStyles.text,
          {
            fontSize: 14,
            color: colors.textLight,
            marginBottom: achievement.earned && achievement.date ? 4 : 0,
          }
        ]}>
          {achievement.description}
        </Text>
        {achievement.earned && achievement.date && (
          <Text style={[
            commonStyles.text,
            {
              fontSize: 12,
              color: colors.primary,
              fontWeight: '500',
            }
          ]}>
            Earned on {new Date(achievement.date).toLocaleDateString()}
          </Text>
        )}
      </View>
      {achievement.earned && (
        <Icon name="checkmark-circle" size={24} color={colors.success} />
      )}
    </View>
  );

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
        <Text style={commonStyles.pageTitle}>My Progress</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Tab Navigation */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: colors.backgroundAlt,
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 12,
        padding: 4,
      }}>
        <TouchableOpacity
          style={[
            {
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
            },
            selectedTab === 'overview' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setSelectedTab('overview')}
        >
          <Text style={{
            color: selectedTab === 'overview' ? colors.backgroundAlt : colors.text,
            fontWeight: '600',
          }}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            {
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
            },
            selectedTab === 'achievements' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setSelectedTab('achievements')}
        >
          <Text style={{
            color: selectedTab === 'achievements' ? colors.backgroundAlt : colors.text,
            fontWeight: '600',
          }}>
            Achievements
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {selectedTab === 'overview' ? (
          <>
            {/* Stars and Streak */}
            <View style={[commonStyles.card, { marginBottom: 20, backgroundColor: colors.lightBlue }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={[commonStyles.title, { fontSize: 32, color: colors.gold, marginBottom: 4 }]}>
                    {progressData.totalStars}
                  </Text>
                  <Text style={[commonStyles.text, { fontSize: 16, fontWeight: '600' }]}>
                    ⭐ Total Stars
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={[commonStyles.title, { fontSize: 32, color: colors.primary, marginBottom: 4 }]}>
                    {progressData.daysStreak}
                  </Text>
                  <Text style={[commonStyles.text, { fontSize: 16, fontWeight: '600' }]}>
                    🔥 Day Streak
                  </Text>
                </View>
              </View>
            </View>

            {/* Alphabet Progress */}
            <View style={[commonStyles.card, { marginBottom: 20, alignItems: 'center' }]}>
              <Text style={[commonStyles.title, { fontSize: 20, marginBottom: 20 }]}>
                Arabic Alphabet
              </Text>
              <CircularProgress 
                progress={progressData.alphabetProgress} 
                total={28}
                color={colors.primary}
              />
              <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                You've mastered all {progressData.alphabetProgress} Arabic letters! 🎉
              </Text>
            </View>

            {/* Surah Reading Progress */}
            <View style={[commonStyles.card, { marginBottom: 20, alignItems: 'center' }]}>
              <Text style={[commonStyles.title, { fontSize: 20, marginBottom: 20 }]}>
                Surah Reading
              </Text>
              <CircularProgress 
                progress={progressData.surahsRead} 
                total={10}
                color={colors.secondary}
              />
              <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                You've read {progressData.surahsRead} Surahs. Keep going!
              </Text>
            </View>

            {/* Pronunciation Score */}
            <View style={[commonStyles.card, { marginBottom: 20 }]}>
              <Text style={[commonStyles.title, { fontSize: 20, marginBottom: 16, textAlign: 'center' }]}>
                Pronunciation Score
              </Text>
              <View style={{
                backgroundColor: colors.lightBlue,
                borderRadius: 12,
                padding: 20,
                alignItems: 'center',
              }}>
                <Text style={[commonStyles.title, { fontSize: 36, color: colors.primary, marginBottom: 8 }]}>
                  {progressData.pronunciationScore}
                </Text>
                <Text style={[commonStyles.text, { fontSize: 16, fontWeight: '600' }]}>
                  🎤 Pronunciation Points
                </Text>
                <Text style={[commonStyles.text, { fontSize: 14, marginTop: 8, textAlign: 'center' }]}>
                  Great job on your pronunciation practice!
                </Text>
              </View>
            </View>

            {/* Encouraging Message */}
            <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
              <Text style={[commonStyles.arabicText, { fontSize: 20, textAlign: 'center', marginBottom: 12 }]}>
                بَارَكَ اللَّهُ فِيكَ
              </Text>
              <Text style={[commonStyles.text, { textAlign: 'center', fontStyle: 'italic', marginBottom: 8 }]}>
                "May Allah bless you"
              </Text>
              <Text style={[commonStyles.text, { textAlign: 'center', color: colors.primary, fontWeight: '600' }]}>
                You're making excellent progress in your Quranic studies!
              </Text>
            </View>
          </>
        ) : (
          <>
            {/* Achievements Header */}
            <View style={[commonStyles.card, { marginBottom: 20, backgroundColor: colors.lightBlue }]}>
              <Text style={[commonStyles.title, { fontSize: 20, textAlign: 'center', marginBottom: 8 }]}>
                🏆 Your Achievements
              </Text>
              <Text style={[commonStyles.text, { textAlign: 'center' }]}>
                {achievements.filter(a => a.earned).length} of {achievements.length} earned
              </Text>
            </View>

            {/* Achievement Cards */}
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}

            {/* Motivation */}
            <View style={[commonStyles.card, { backgroundColor: colors.card, marginTop: 20 }]}>
              <Text style={[commonStyles.text, { color: colors.primary, fontWeight: '600', textAlign: 'center', marginBottom: 8 }]}>
                🌟 Keep Learning!
              </Text>
              <Text style={[commonStyles.text, { fontSize: 14, textAlign: 'center' }]}>
                Complete more lessons to unlock new achievements and earn more stars!
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
