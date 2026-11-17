import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ExamId, 
  UserProfile, 
  DailyGoal, 
  TestSubmission, 
  Achievement, 
  MockTest,
  PYQQuestion
} from '../types';
import { 
  EXAMS_LIST, 
  SAMPLE_PYQS, 
  INITIAL_ACHIEVEMENTS, 
  SAMPLE_MOCK_TESTS 
} from '../data/mockData';

export type NavTab = 'home' | 'tests' | 'short-notes' | 'focus' | 'goals' | 'exam-info' | 'profile' | 'settings';

interface AppContextType {
  selectedExam: ExamId;
  setSelectedExam: (exam: ExamId) => void;
  currentExamData: typeof EXAMS_LIST[0];
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userProfile: UserProfile;
  completeOnboarding: (name: string, exam: ExamId, targetYear: number) => void;
  dailyGoal: DailyGoal;
  solvedQuestions: Record<string, { status: 'correct' | 'incorrect'; selected: string }>;
  markQuestionAnswered: (questionId: string, isCorrect: boolean, selected: string) => void;
  bookmarkedQuestions: string[];
  toggleBookmarkQuestion: (questionId: string) => void;
  bookmarkedNotes: string[];
  toggleBookmarkNote: (noteId: string) => void;
  testHistory: TestSubmission[];
  saveTestSubmission: (submission: TestSubmission) => void;
  achievements: Achievement[];
  isFocusModeActive: boolean;
  setIsFocusModeActive: (active: boolean) => void;
  logFocusMinutes: (mins: number) => void;
  activeExamTest: MockTest | null;
  startMockTest: (test: MockTest) => void;
  exitMockTest: () => void;
  viewingScorecard: TestSubmission | null;
  setViewingScorecard: (submission: TestSubmission | null) => void;
  isExamSelectorOpen: boolean;
  setIsExamSelectorOpen: (open: boolean) => void;
  triggerCelebration: () => void;
  blockedPopupsCount: number;
  triggerNotification: (title: string, message: string) => void;
  notificationsList: { id: string; title: string; message: string; time: string; read: boolean }[];
  clearNotifications: () => void;
  // Interactive tour states
  isTourActive: boolean;
  tourStep: number;
  startTour: () => void;
  nextTourStep: () => void;
  stopTour: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('gradeup_theme') as 'dark' | 'light') || 'dark';
  });

  // Selected Exam state
  const [selectedExam, setSelectedExamState] = useState<ExamId>(() => {
    return (localStorage.getItem('gradeup_selected_exam') as ExamId) || 'gate';
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Modal states
  const [isExamSelectorOpen, setIsExamSelectorOpen] = useState(false);
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [blockedPopupsCount, setBlockedPopupsCount] = useState(0);

  // Active Test state
  const [activeExamTest, setActiveExamTest] = useState<MockTest | null>(null);
  const [viewingScorecard, setViewingScorecard] = useState<TestSubmission | null>(null);

  // Interactive tour state
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // User Profile: Starts with 0 stats and uncompleted onboarding if fresh
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('gradeup_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      name: '',
      email: '',
      targetYear: 2026,
      selectedExam: 'gate',
      streakDays: 0,
      xpPoints: 0,
      gems: 0,
      totalQuestionsSolved: 0,
      totalFocusMinutes: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      rankTitle: 'Aspirant',
      hasCompletedOnboarding: false
    };
  });

  // Daily Goal: Initialized to 0 completed
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>(() => {
    const saved = localStorage.getItem('gradeup_daily_goal');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      questionsTarget: 30,
      questionsCompleted: 0,
      studyTimeMinutesTarget: 180,
      studyTimeMinutesCompleted: 0,
      date: new Date().toISOString().split('T')[0],
      isGoalReached: false
    };
  });

  // Solved Questions tracker: Starts empty
  const [solvedQuestions, setSolvedQuestions] = useState<Record<string, { status: 'correct' | 'incorrect'; selected: string }>>(() => {
    const saved = localStorage.getItem('gradeup_solved_questions');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {};
  });

  // Bookmarks: Starts empty
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<string[]>(() => {
    const saved = localStorage.getItem('gradeup_bookmarked_questions');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookmarkedNotes, setBookmarkedNotes] = useState<string[]>(() => {
    const saved = localStorage.getItem('gradeup_bookmarked_notes');
    return saved ? JSON.parse(saved) : [];
  });

  // Test History: Starts empty
  const [testHistory, setTestHistory] = useState<TestSubmission[]>(() => {
    const saved = localStorage.getItem('gradeup_test_history');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  // Achievements: Starts with 0 progress
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('gradeup_achievements');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_ACHIEVEMENTS.map(a => ({
      ...a,
      isUnlocked: false,
      progress: 0
    }));
  });

  // Notifications
  const [notificationsList, setNotificationsList] = useState<{ id: string; title: string; message: string; time: string; read: boolean }[]>([
    { id: '1', title: 'Welcome to GradeUp! 🚀', message: 'Set up your daily goal and start your first practice session.', time: 'Just now', read: false }
  ]);

  // Sync theme to HTML root element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('gradeup_theme', theme);
  }, [theme]);

  // Persist selections
  useEffect(() => {
    localStorage.setItem('gradeup_selected_exam', selectedExam);
  }, [selectedExam]);

  useEffect(() => {
    localStorage.setItem('gradeup_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('gradeup_daily_goal', JSON.stringify(dailyGoal));
  }, [dailyGoal]);

  useEffect(() => {
    localStorage.setItem('gradeup_solved_questions', JSON.stringify(solvedQuestions));
  }, [solvedQuestions]);

  useEffect(() => {
    localStorage.setItem('gradeup_bookmarked_questions', JSON.stringify(bookmarkedQuestions));
  }, [bookmarkedQuestions]);

  useEffect(() => {
    localStorage.setItem('gradeup_bookmarked_notes', JSON.stringify(bookmarkedNotes));
  }, [bookmarkedNotes]);

  useEffect(() => {
    localStorage.setItem('gradeup_test_history', JSON.stringify(testHistory));
  }, [testHistory]);

  const setSelectedExam = (exam: ExamId) => {
    setSelectedExamState(exam);
    setUserProfile(prev => ({ ...prev, selectedExam: exam }));
  };

  const completeOnboarding = (name: string, exam: ExamId, targetYear: number) => {
    setUserProfile(prev => ({
      ...prev,
      name,
      selectedExam: exam,
      targetYear,
      hasCompletedOnboarding: true
    }));
    setSelectedExamState(exam);
    triggerCelebration();

    // Auto-trigger guided interactive tour
    setTimeout(() => {
      setTourStep(0);
      setIsTourActive(true);
    }, 400);
  };

  const startTour = () => {
    setActiveTab('home');
    setTourStep(0);
    setIsTourActive(true);
  };

  const nextTourStep = () => {
    setTourStep(prev => prev + 1);
  };

  const stopTour = () => {
    setIsTourActive(false);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1D8676', '#38d4bc', '#10b981', '#f59e0b', '#ffffff']
    });
  };

  const markQuestionAnswered = (questionId: string, isCorrect: boolean, selected: string) => {
    const statusVal: 'correct' | 'incorrect' = isCorrect ? 'correct' : 'incorrect';
    setSolvedQuestions(prev => {
      const next: Record<string, { status: 'correct' | 'incorrect'; selected: string }> = { 
        ...prev, 
        [questionId]: { status: statusVal, selected } 
      };
      return next;
    });

    // Update goals & XP
    const xpGained = isCorrect ? 15 : 5;
    setUserProfile(prev => ({
      ...prev,
      xpPoints: prev.xpPoints + xpGained,
      totalQuestionsSolved: prev.totalQuestionsSolved + 1,
      gems: prev.gems + (isCorrect ? 1 : 0),
      streakDays: prev.streakDays === 0 ? 1 : prev.streakDays
    }));

    setDailyGoal(prev => {
      const newCompleted = prev.questionsCompleted + 1;
      const reached = newCompleted >= prev.questionsTarget;
      if (reached && !prev.isGoalReached) {
        triggerCelebration();
      }
      return {
        ...prev,
        questionsCompleted: newCompleted,
        isGoalReached: reached
      };
    });
  };

  const toggleBookmarkQuestion = (questionId: string) => {
    setBookmarkedQuestions(prev => 
      prev.includes(questionId) ? prev.filter(id => id !== questionId) : [...prev, questionId]
    );
  };

  const toggleBookmarkNote = (noteId: string) => {
    setBookmarkedNotes(prev => 
      prev.includes(noteId) ? prev.filter(id => id !== noteId) : [...prev, noteId]
    );
  };

  const saveTestSubmission = (submission: TestSubmission) => {
    setTestHistory(prev => [submission, ...prev]);
    setUserProfile(prev => ({
      ...prev,
      xpPoints: prev.xpPoints + 150,
      gems: prev.gems + 10,
      streakDays: prev.streakDays === 0 ? 1 : prev.streakDays
    }));
    triggerCelebration();
  };

  const logFocusMinutes = (mins: number) => {
    setUserProfile(prev => ({
      ...prev,
      totalFocusMinutes: prev.totalFocusMinutes + mins,
      xpPoints: prev.xpPoints + Math.round(mins * 1.5),
      streakDays: prev.streakDays === 0 ? 1 : prev.streakDays
    }));
    setDailyGoal(prev => ({
      ...prev,
      studyTimeMinutesCompleted: prev.studyTimeMinutesCompleted + mins
    }));
  };

  const startMockTest = (test: MockTest) => {
    setActiveExamTest(test);
    setViewingScorecard(null);
  };

  const exitMockTest = () => {
    setActiveExamTest(null);
  };

  const triggerNotification = (title: string, message: string) => {
    if (isFocusModeActive) {
      setBlockedPopupsCount(c => c + 1);
      return;
    }
    setNotificationsList(prev => [
      { id: Date.now().toString(), title, message, time: 'Just now', read: false },
      ...prev
    ]);
  };

  const clearNotifications = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const currentExamData = EXAMS_LIST.find(e => e.id === selectedExam) || EXAMS_LIST[0];

  return (
    <AppContext.Provider
      value={{
        selectedExam,
        setSelectedExam,
        currentExamData,
        theme,
        setTheme,
        activeTab,
        setActiveTab,
        userProfile,
        completeOnboarding,
        dailyGoal,
        solvedQuestions,
        markQuestionAnswered,
        bookmarkedQuestions,
        toggleBookmarkQuestion,
        bookmarkedNotes,
        toggleBookmarkNote,
        testHistory,
        saveTestSubmission,
        achievements,
        isFocusModeActive,
        setIsFocusModeActive,
        logFocusMinutes,
        activeExamTest,
        startMockTest,
        exitMockTest,
        viewingScorecard,
        setViewingScorecard,
        isExamSelectorOpen,
        setIsExamSelectorOpen,
        triggerCelebration,
        blockedPopupsCount,
        triggerNotification,
        notificationsList,
        clearNotifications,
        isTourActive,
        tourStep,
        startTour,
        nextTourStep,
        stopTour
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
