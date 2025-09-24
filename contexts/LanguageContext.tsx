
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

interface LanguageContextProps {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    back: 'Back',
    home: 'Home',
    
    // Reading Chapters
    readingChapters: 'Reading Chapters',
    chapter: 'Chapter',
    of: 'of',
    completed: 'Completed',
    locked: 'Locked',
    
    // Chapter Content
    listen: 'Listen',
    record: 'Record',
    repeatAfterMe: 'Repeat After Me',
    nextChapter: 'Next Chapter',
    previousChapter: 'Previous Chapter',
    resetChapter: 'Reset Chapter',
    
    // Feedback
    excellent: 'Excellent!',
    good: 'Good!',
    needsImprovement: 'Needs Improvement',
    tryAgain: 'Try Again',
    
    // Instructions
    tapToListen: 'Tap to listen to the pronunciation',
    holdToRecord: 'Hold to record your voice',
    releaseToStop: 'Release to stop recording',
    
    // Progress
    correctPronunciation: 'Correct Pronunciation',
    closeButImprove: 'Close, but needs improvement',
    incorrectPronunciation: 'Incorrect Pronunciation',
  },
  ar: {
    // Navigation
    back: 'رجوع',
    home: 'الرئيسية',
    
    // Reading Chapters
    readingChapters: 'فصول القراءة',
    chapter: 'الفصل',
    of: 'من',
    completed: 'مكتمل',
    locked: 'مقفل',
    
    // Chapter Content
    listen: 'استمع',
    record: 'سجل',
    repeatAfterMe: 'كرر ورائي',
    nextChapter: 'الفصل التالي',
    previousChapter: 'الفصل السابق',
    resetChapter: 'إعادة تعيين الفصل',
    
    // Feedback
    excellent: 'ممتاز!',
    good: 'جيد!',
    needsImprovement: 'يحتاج تحسين',
    tryAgain: 'حاول مرة أخرى',
    
    // Instructions
    tapToListen: 'اضغط للاستماع إلى النطق',
    holdToRecord: 'اضغط مع الاستمرار لتسجيل صوتك',
    releaseToStop: 'اتركه لإيقاف التسجيل',
    
    // Progress
    correctPronunciation: 'نطق صحيح',
    closeButImprove: 'قريب، لكن يحتاج تحسين',
    incorrectPronunciation: 'نطق غير صحيح',
  },
};

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    // Load saved language preference
    if (Platform.OS === 'web') {
      const savedLanguage = localStorage.getItem('app_language') as 'en' | 'ar';
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  const handleSetLanguage = (lang: 'en' | 'ar') => {
    setLanguage(lang);
    if (Platform.OS === 'web') {
      localStorage.setItem('app_language', lang);
    }
    console.log('Language changed to:', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
