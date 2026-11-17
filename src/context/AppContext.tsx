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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('marks_theme') as 'dark' | 'light') || 'dark';
  });

  // Selected Exam state
  const [selectedExam, setSelectedExamState] = useState<ExamId>(() => {
    return (localStorage.getItem('marks_selected_exam') as ExamId) || 'gate';
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

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('marks_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      name: 'Pratham',
      email: 'pratham.engg@domain.com',
      targetYear: 2026,
      selectedExam: 'gate',
      streakDays: 7,
      xpPoints: 1240,
      gems: 85,
      totalQuestionsSolved: 142,
      totalFocusMinutes: 340,
      lastActiveDate: new Date().toISOString().split('T')[0],
      rankTitle: 'Grandmaster Aspirant'
    };
  });

  // Daily Goal
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>(() => {
    const saved = localStorage.getItem('marks_daily_goal');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      questionsTarget: 30,
      questionsCompleted: 14,
      studyTimeMinutesTarget: 180,
      studyTimeMinutesCompleted: 85,
      date: new Date().toISOString().split('T')[0],
      isGoalReached: false
    };
  });

  // Solved Questions tracker
  const [solvedQuestions, setSolvedQuestions] = useState<Record<string, { status: 'correct' | 'incorrect'; selected: string }>>(() => {
    const saved = localStorage.getItem('marks_solved_questions');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      'gate-2024-q1': { status: 'correct', selected: 'A' }
    };
  });

  // Bookmarks
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<string[]>(() => {
    const saved = localStorage.getItem('marks_bookmarked_questions');
    return saved ? JSON.parse(saved) : ['gate-2024-q1', 'gate-2023-q1'];
  });

  const [bookmarkedNotes, setBookmarkedNotes] = useState<string[]>(() => {
    const saved = localStorage.getItem('marks_bookmarked_notes');
    return saved ? JSON.parse(saved) : ['note-dsa-trees'];
  });

  // Test History
  const [testHistory, setTestHistory] = useState<TestSubmission[]>(() => {
    const saved = localStorage.getItem('marks_test_history');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'test-rec-1',
        testId: 'mock-gate-speed-dsa',
        testTitle: 'DSA & Algorithms Rapid Speed Test',
        examId: 'gate',
        timestamp: new Date(Date.now() - 86400000 * 2).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timeSpentSeconds: 1140,
        score: 4,
        maxScore: 5,
        percentage: 80,
        percentile: 94.2,
        rankEstimate: 128,
        totalQuestions: 4,
        correctAnswers: 3,
        incorrectAnswers: 1,
        unattemptedAnswers: 0,
        accuracy: 75,
        subjectBreakdown: [
          { subjectName: 'Data Structures & Algorithms', score: 4, maxScore: 5, accuracy: 75 }
        ],
        userResponses: { 'gate-2024-q1': 'A', 'gate-2024-q2': '9' }
      }
    ];
  });

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('marks_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  // Notifications
  const [notificationsList, setNotificationsList] = useState<{ id: string; title: string; message: string; time: string; read: boolean }[]>([
    { id: '1', title: 'Daily Goal Checkpoint', message: 'You are 16 questions away from today\'s goal!', time: '10m ago', read: false },
    { id: '2', title: 'Streak Preserved 🔥', message: 'You have maintained your 7-day streak!', time: '1h ago', read: false },
    { id: '3', title: 'New PYQs Added', message: '2024 GATE CS Solutions are now verified.', time: 'Yesterday', read: true }
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
    localStorage.setItem('marks_theme', theme);
  }, [theme]);

  // Persist selections
  useEffect(() => {
    localStorage.setItem('marks_selected_exam', selectedExam);
  }, [selectedExam]);

  useEffect(() => {
    localStorage.setItem('marks_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('marks_daily_goal', JSON.stringify(dailyGoal));
  }, [dailyGoal]);

  useEffect(() => {
    localStorage.setItem('marks_solved_questions', JSON.stringify(solvedQuestions));
  }, [solvedQuestions]);

  useEffect(() => {
    localStorage.setItem('marks_bookmarked_questions', JSON.stringify(bookmarkedQuestions));
  }, [bookmarkedQuestions]);

  useEffect(() => {
    localStorage.setItem('marks_bookmarked_notes', JSON.stringify(bookmarkedNotes));
  }, [bookmarkedNotes]);

  useEffect(() => {
    localStorage.setItem('marks_test_history', JSON.stringify(testHistory));
  }, [testHistory]);

  const setSelectedExam = (exam: ExamId) => {
    setSelectedExamState(exam);
    setUserProfile(prev => ({ ...prev, selectedExam: exam }));
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
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
      gems: prev.gems + (isCorrect ? 1 : 0)
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
    // Award test XP
    setUserProfile(prev => ({
      ...prev,
      xpPoints: prev.xpPoints + 150,
      gems: prev.gems + 10
    }));
    triggerCelebration();
  };

  const logFocusMinutes = (mins: number) => {
    setUserProfile(prev => ({
      ...prev,
      totalFocusMinutes: prev.totalFocusMinutes + mins,
      xpPoints: prev.xpPoints + Math.round(mins * 1.5)
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
      // Popups and notifications are strictly suppressed during focus mode
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
        clearNotifications
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
