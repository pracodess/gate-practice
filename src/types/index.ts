export type ExamId = 'gate' | 'jee' | 'neet' | 'upsc' | 'cat';

export interface ExamInfo {
  id: ExamId;
  name: string;
  category: string;
  fullName: string;
  badge: string;
  accentColor: string;
  description: string;
  totalMarks: number;
  durationMinutes: number;
  negativeMarking: string;
  subjects: Subject[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  totalChapters: number;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  name: string;
  subjectId: string;
  pyqCount: number;
  solvedCount?: number;
  weightagePercent?: number;
}

export interface PYQQuestion {
  id: string;
  examId: ExamId;
  subjectId: string;
  chapterId: string;
  year: number;
  examShift?: string;
  questionText: string;
  questionCode?: string;
  imageUrl?: string;
  type: 'mcq' | 'nat' | 'msq'; // Single choice, Numerical answer, Multiple select
  options?: {
    id: string;
    text: string;
  }[];
  correctAnswer: string | string[]; // Option ID or numerical value/range
  numericalTolerance?: number;
  explanation: string;
  keyFormula?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  negativeMarks: number;
  userStatus?: 'unattempted' | 'correct' | 'incorrect';
  isBookmarked?: boolean;
}

export interface DigitalBook {
  id: string;
  examId: ExamId;
  title: string;
  subtitle: string;
  tag: string;
  badgeText: string;
  coverGradient: string;
  rating: number;
  readersCount: string;
  pagesCount: number;
  subject: string;
  filePreview?: string;
  highlights: string[];
}

export interface ShortNote {
  id: string;
  examId: ExamId;
  subjectId: string;
  chapterId: string;
  chapterName: string;
  subjectName: string;
  title: string;
  readTime: string;
  isBookmarked: boolean;
  sections: {
    heading: string;
    content: string;
    keyPoints?: string[];
    formula?: string;
    examTip?: string;
  }[];
}

export interface MockTest {
  id: string;
  examId: ExamId;
  title: string;
  type: 'Full Mock' | 'Subject Test' | 'Chapter Test' | 'Speed Test';
  subject?: string;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  positiveMarks: number;
  negativeMarks: number;
  questions: PYQQuestion[];
}

export interface TestSubmission {
  id: string;
  testId: string;
  testTitle: string;
  examId: ExamId;
  timestamp: string;
  timeSpentSeconds: number;
  score: number;
  maxScore: number;
  percentage: number;
  percentile: number;
  rankEstimate: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattemptedAnswers: number;
  accuracy: number;
  subjectBreakdown: {
    subjectName: string;
    score: number;
    maxScore: number;
    accuracy: number;
  }[];
  userResponses: Record<string, string>; // questionId -> optionId or numerical answer
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  xpReward: number;
  progress: number;
  maxProgress: number;
}

export interface DailyGoal {
  questionsTarget: number;
  questionsCompleted: number;
  studyTimeMinutesTarget: number;
  studyTimeMinutesCompleted: number;
  date: string;
  isGoalReached: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  targetYear: number;
  selectedExam: ExamId;
  streakDays: number;
  xpPoints: number;
  gems: number;
  totalQuestionsSolved: number;
  totalFocusMinutes: number;
  lastActiveDate: string;
  rankTitle: string;
}
