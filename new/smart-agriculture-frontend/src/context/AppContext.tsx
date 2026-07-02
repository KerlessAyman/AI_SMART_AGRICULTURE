import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User } from '../types/index';
import { useAuthStore } from '../store/authStore';
import i18n from '../i18n';

interface AppContextType {
  user: User | null;
  language: 'ar' | 'en';
  isSidebarOpen: boolean;
  setUser: (user: User | null) => void;
  setLanguage: (lang: 'ar' | 'en') => void;
  toggleSidebar: () => void;
  toggleLanguage: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const normalizeLang = (lng: string): 'ar' | 'en' => (lng === 'en' ? 'en' : 'ar');

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // بيانات اليوزر بتيجي من authStore (Zustand) بتاعك بدل ما تتكرر
  const authUser = useAuthStore((state) => state.user);

  const [user, setUser] = useState<User | null>(null);
  // i18next is the single source of truth for language. This state just
  // mirrors it so components using useApp() re-render when it changes.
  const [language, setLanguageState] = useState<'ar' | 'en'>(normalizeLang(i18n.language));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // كل ما authStore يتغير، نزامن الـ user هنا تلقائيًا
  useEffect(() => {
    if (authUser) {
      setUser({
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        role: (authUser.role as User['role']) || 'farmer',
      });
    } else {
      setUser(null);
    }
  }, [authUser]);

  // Apply direction whenever the language changes
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Listen to i18next directly. This is what actually drives `language`,
  // regardless of which button (Navbar's or PublicLayout's) triggers the
  // change — both call i18n.changeLanguage(...) under the hood.
  useEffect(() => {
    const handleI18nChange = (lng: string) => setLanguageState(normalizeLang(lng));
    // Sync once on mount in case i18next finished detecting the language
    // after this component's initial state was computed.
    handleI18nChange(i18n.language);
    i18n.on('languageChanged', handleI18nChange);
    return () => {
      i18n.off('languageChanged', handleI18nChange);
    };
  }, []);

  const setLanguage = useCallback((lang: 'ar' | 'en') => {
    i18n.changeLanguage(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    i18n.changeLanguage(normalizeLang(i18n.language) === 'ar' ? 'en' : 'ar');
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      language,
      isSidebarOpen,
      setUser,
      setLanguage,
      toggleSidebar,
      toggleLanguage,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};