import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Play, 
  ArrowRight, 
  Calculator, 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  Flag, 
  Bookmark,
  Sparkles,
  BookOpen,
  History,
  RotateCcw,
  Check,
  X,
  Lightbulb,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SAMPLE_MOCK_TESTS } from '../data/mockData';
import { MockTest, PYQQuestion, TestSubmission } from '../types';

export const TestsPage: React.FC = () => {
  const { 
    selectedExam, 
    currentExamData, 
    activeExamTest, 
    startMockTest, 
    exitMockTest, 
    saveTestSubmission, 
    testHistory, 
    viewingScorecard, 
    setViewingScorecard,
    bookmarkedQuestions,
    toggleBookmarkQuestion,
    markQuestionAnswered,
    theme,
    setTheme
  } = useApp();

  // Test Runner Mode: 'exam' (timed, answers after submit) vs 'practice' (instant feedback)
  const [testMode, setTestMode] = useState<'exam' | 'practice'>('exam');
  
  // Test Runner State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [visitedQuestions, setVisitedQuestions] = useState<string[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');

  // Practice Mode state: tracks which questions have had their answer checked
  const [checkedPracticeQuestions, setCheckedPracticeQuestions] = useState<Record<string, boolean>>({});

  // Palette Filter Chunk state (e.g., 'all', '1-5', '6-10')
  const [activeChunk, setActiveChunk] = useState<string>('all');
  const [jumpInput, setJumpInput] = useState('');

  // Year filter for tests list
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('all');

  // Filter available tests for active exam
  const availableTests = SAMPLE_MOCK_TESTS.filter(t => {
    if (t.examId !== selectedExam) return false;
    if (selectedYearFilter === 'all') return true;
    if (selectedYearFilter === '2022') {
      return t.id.includes('2022') || t.title.includes('2022');
    }
    return true;
  });

  // Initialize test runner when test starts
  useEffect(() => {
    if (activeExamTest) {
      setSecondsRemaining(activeExamTest.durationMinutes * 60);
      setStopwatchSeconds(0);
      setUserAnswers({});
      setMarkedForReview([]);
      setVisitedQuestions([activeExamTest.questions[0]?.id || '']);
      setCurrentQuestionIndex(0);
      setCheckedPracticeQuestions({});
      setActiveChunk('all');
      setJumpInput('');
    }
  }, [activeExamTest]);

  // Exam Mode: Countdown timer
  useEffect(() => {
    if (!activeExamTest || testMode !== 'exam') return;

    if (secondsRemaining <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExamTest, testMode, secondsRemaining]);

  // Practice Mode: Stopwatch timer
  useEffect(() => {
    if (!activeExamTest || testMode !== 'practice') return;

    const timer = setInterval(() => {
      setStopwatchSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExamTest, testMode]);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = (test: MockTest, mode: 'exam' | 'practice') => {
    setTestMode(mode);
    startMockTest(test);
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    // In practice mode, if already checked, do not change unless clearing
    if (testMode === 'practice' && checkedPracticeQuestions[questionId]) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleClearResponse = (questionId: string) => {
    setUserAnswers(prev => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    if (testMode === 'practice') {
      setCheckedPracticeQuestions(prev => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  const handleToggleReview = (questionId: string) => {
    setMarkedForReview(prev => 
      prev.includes(questionId) ? prev.filter(id => id !== questionId) : [...prev, questionId]
    );
  };

  const handleNavigateQuestion = (index: number) => {
    if (!activeExamTest) return;
    const qId = activeExamTest.questions[index]?.id;
    if (qId && !visitedQuestions.includes(qId)) {
      setVisitedQuestions(prev => [...prev, qId]);
    }
    setCurrentQuestionIndex(index);
  };

  const handleSaveAndNext = () => {
    if (!activeExamTest) return;
    if (currentQuestionIndex < activeExamTest.questions.length - 1) {
      handleNavigateQuestion(currentQuestionIndex + 1);
    }
  };

  // Practice Mode: Check Answer handler
  const handleCheckPracticeAnswer = (q: PYQQuestion) => {
    const ans = userAnswers[q.id];
    if (!ans) return;

    let isCorrect = false;
    if (q.type === 'mcq') {
      isCorrect = ans === q.correctAnswer;
    } else if (q.type === 'nat') {
      const uNum = parseFloat(ans);
      const cNum = parseFloat(q.correctAnswer as string);
      isCorrect = Math.abs(uNum - cNum) <= (q.numericalTolerance || 0);
    }

    setCheckedPracticeQuestions(prev => ({ ...prev, [q.id]: true }));
    // Update daily goal / statistics
    markQuestionAnswered(q.id, isCorrect, ans);
  };

  const handleJumpToQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeExamTest) return;
    const qNum = parseInt(jumpInput, 10);
    if (!isNaN(qNum) && qNum >= 1 && qNum <= activeExamTest.questions.length) {
      handleNavigateQuestion(qNum - 1);
      setJumpInput('');
    }
  };

  const handleCalculateScore = (): TestSubmission => {
    if (!activeExamTest) throw new Error('No active test');

    let totalScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    activeExamTest.questions.forEach(q => {
      const ans = userAnswers[q.id];
      if (!ans || ans === '') {
        unattemptedCount++;
      } else {
        let isCorrect = false;
        if (q.type === 'mcq') {
          isCorrect = ans === q.correctAnswer;
        } else if (q.type === 'nat') {
          const uNum = parseFloat(ans);
          const cNum = parseFloat(q.correctAnswer as string);
          isCorrect = Math.abs(uNum - cNum) <= (q.numericalTolerance || 0);
        }

        if (isCorrect) {
          correctCount++;
          totalScore += q.marks;
        } else {
          incorrectCount++;
          totalScore -= q.negativeMarks;
        }

        // Also mark in daily goals
        markQuestionAnswered(q.id, isCorrect, ans);
      }
    });

    totalScore = Math.max(0, Math.round(totalScore * 100) / 100);
    const maxScore = activeExamTest.totalMarks;
    const percentage = Math.round((totalScore / maxScore) * 100);
    const accuracy = correctCount + incorrectCount > 0 
      ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) 
      : 0;

    const percentile = Math.min(99.9, Math.max(45, Math.round((percentage * 0.95 + 10) * 10) / 10));
    const rankEstimate = Math.max(1, Math.round((100 - percentile) * 1200));

    const timeSpent = testMode === 'exam' 
      ? (activeExamTest.durationMinutes * 60) - secondsRemaining
      : stopwatchSeconds;

    const submission: TestSubmission = {
      id: `sub-${Date.now()}`,
      testId: activeExamTest.id,
      testTitle: activeExamTest.title,
      examId: activeExamTest.examId,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timeSpentSeconds: timeSpent,
      score: totalScore,
      maxScore,
      percentage,
      percentile,
      rankEstimate,
      totalQuestions: activeExamTest.questions.length,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unattemptedAnswers: unattemptedCount,
      accuracy,
      subjectBreakdown: [
        {
          subjectName: currentExamData.name + ' Core',
          score: totalScore,
          maxScore,
          accuracy
        }
      ],
      userResponses: userAnswers
    };

    return submission;
  };

  const handleFinalSubmit = () => {
    const submission = handleCalculateScore();
    saveTestSubmission(submission);
    setShowSubmitModal(false);
    exitMockTest();
    setViewingScorecard(submission);
  };

  // Safe Calculator Evaluation
  const evalCalc = (val: string) => {
    try {
      const sanitized = val.replace(/[^0-9+\-*/().]/g, '');
      const res = Function(`'use strict'; return (${sanitized})`)();
      setCalcResult(res.toString());
    } catch {
      setCalcResult('Error');
    }
  };

  // ==========================================
  // 1. LIVE TEST RUNNER (Exam & Practice Modes)
  // ==========================================
  if (activeExamTest) {
    const currentQ = activeExamTest.questions[currentQuestionIndex];
    const isAnswered = !!userAnswers[currentQ?.id];
    const isMarked = markedForReview.includes(currentQ?.id);
    const isBookmarked = bookmarkedQuestions.includes(currentQ?.id);
    const isPracticeChecked = testMode === 'practice' && checkedPracticeQuestions[currentQ?.id];
    const answeredCount = Object.keys(userAnswers).length;
    const progressPercent = Math.round((answeredCount / activeExamTest.questions.length) * 100);

    // Compute question chunks of 5 (e.g. 1-5, 6-10)
    const chunkSize = 5;
    const totalChunks = Math.ceil(activeExamTest.questions.length / chunkSize);
    const chunkTabs: { label: string; start: number; end: number }[] = [];
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize + 1;
      const end = Math.min((i + 1) * chunkSize, activeExamTest.questions.length);
      chunkTabs.push({ label: `${start}-${end}`, start, end });
    }

    // Filter questions shown in palette if a chunk is selected
    const visiblePaletteIndices = activeExamTest.questions.map((_, idx) => idx).filter(idx => {
      if (activeChunk === 'all') return true;
      const [startStr, endStr] = activeChunk.split('-');
      const s = parseInt(startStr, 10);
      const e = parseInt(endStr, 10);
      return (idx + 1) >= s && (idx + 1) <= e;
    });

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 dark:bg-[#0b0f12] text-slate-800 dark:text-slate-100 select-none overflow-hidden transition-colors">
        {/* Top Header Bar */}
        <header className="h-16 px-4 sm:px-6 bg-white dark:bg-[#10161b] border-b border-slate-200 dark:border-[#1D8676]/25 flex items-center justify-between gap-4 shrink-0 shadow-sm">
          {/* Left: Test title & mode pill */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#1D8676]/10 dark:bg-[#1D8676]/20 border border-[#1D8676]/25 flex items-center justify-center text-[#1D8676] dark:text-[#2dd4bf] shrink-0">
              {testMode === 'exam' ? <Award className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                  {activeExamTest.title}
                </h1>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                  testMode === 'exam'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                    : 'bg-[#1D8676]/10 text-[#1D8676] dark:text-[#2dd4bf] border-[#1D8676]/30'
                }`}>
                  {testMode === 'exam' ? 'Exam Simulator' : 'Practice Mode'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Questions 1-{activeExamTest.questions.length} • Marks: {activeExamTest.totalMarks} Total
              </p>
            </div>
          </div>

          {/* Right: Controls (Timer, Calc, Theme, Exit, Submit) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Timer or Stopwatch */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs sm:text-sm font-bold shadow-sm ${
              testMode === 'exam'
                ? secondsRemaining < 300 
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-[#1D8676]/40 text-slate-800 dark:text-[#2dd4bf]'
                : 'bg-teal-50 dark:bg-slate-900 border-[#1D8676]/30 text-[#1D8676] dark:text-[#2dd4bf]'
            }`}>
              <Clock className="w-4 h-4 text-[#1D8676]" />
              <span>{testMode === 'exam' ? formatTimer(secondsRemaining) : formatTimer(stopwatchSeconds)}</span>
            </div>

            {/* Virtual Scientific Calculator Toggle */}
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Virtual Scientific Calculator"
            >
              <Calculator className="w-4 h-4 text-[#1D8676]" />
              <span className="hidden md:inline">Calculator</span>
            </button>

            {/* Theme Toggle in Exam Runner */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all shadow-sm"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Exit Test Button */}
            <button
              onClick={() => setShowExitModal(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              Exit
            </button>

            {/* Submit / Finish Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-1.5 rounded-xl bg-[#1D8676] hover:bg-[#176f62] text-white text-xs font-bold shadow-md shadow-[#1D8676]/30 transition-all"
            >
              {testMode === 'exam' ? 'Submit Test' : 'Finish Practice'}
            </button>
          </div>
        </header>

        {/* Thin Progress Bar Strip */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 relative overflow-hidden">
          <div 
            className="h-full bg-[#1D8676] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Main Workspace Body */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Question Solving Area (Left Column ~72%) */}
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between">
            {currentQ ? (
              <div className="max-w-4xl w-full mx-auto space-y-6 pb-6">
                {/* Question Card Container */}
                <div className="relative rounded-2xl bg-white dark:bg-[#10161b] border border-slate-200/90 dark:border-[#1D8676]/25 p-5 sm:p-7 shadow-sm overflow-hidden">
                  {/* Subtle light-mode gaussian blur fade */}
                  <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#1D8676]/5 dark:bg-[#1D8676]/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Question Header Strip */}
                  <div className="relative flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#1D8676] text-white shadow-sm font-mono">
                        Q {currentQuestionIndex + 1}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/25 uppercase font-mono">
                        {currentQ.type.toUpperCase()}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        +{currentQ.marks} Correct / -{currentQ.negativeMarks} Neg
                      </span>
                      {currentQ.chapterId && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                          • {currentQ.chapterId}
                        </span>
                      )}
                    </div>

                    {/* Bookmark Star Toggle */}
                    <button
                      onClick={() => toggleBookmarkQuestion(currentQ.id)}
                      className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-xs ${
                        isBookmarked
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                      title="Bookmark Question"
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                      <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                    </button>
                  </div>

                  {/* Question Statement */}
                  <div className="relative text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed font-sans mb-6">
                    {currentQ.questionText}
                  </div>

                  {/* Multiple Choice Options List */}
                  {currentQ.type === 'mcq' && currentQ.options && (
                    <div className="relative space-y-3 pt-1">
                      {currentQ.options.map(opt => {
                        const isSelected = userAnswers[currentQ.id] === opt.id;
                        const isCorrectAnswer = opt.id === currentQ.correctAnswer;
                        
                        let cardStyle = 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200';
                        let badgeStyle = 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400';

                        // Practice Mode Instant Feedback Styling
                        if (testMode === 'practice' && isPracticeChecked) {
                          if (isCorrectAnswer) {
                            cardStyle = 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold shadow-sm';
                            badgeStyle = 'bg-emerald-500 text-white';
                          } else if (isSelected && !isCorrectAnswer) {
                            cardStyle = 'bg-rose-50 dark:bg-rose-500/15 border-rose-500 text-rose-900 dark:text-rose-200 line-through';
                            badgeStyle = 'bg-rose-500 text-white';
                          }
                        } else if (isSelected) {
                          // Standard Selected Style (both Exam Mode and Practice Mode before check)
                          cardStyle = 'bg-teal-50 dark:bg-[#1D8676]/20 border-[#1D8676] text-[#1D8676] dark:text-[#2dd4bf] font-semibold shadow-sm ring-1 ring-[#1D8676]';
                          badgeStyle = 'bg-[#1D8676] text-white';
                        }

                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleSelectOption(currentQ.id, opt.id)}
                            className={`w-full flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left text-sm font-medium transition-all ${cardStyle}`}
                          >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${badgeStyle}`}>
                              {opt.id}
                            </div>
                            <span className="flex-1 leading-snug">{opt.text}</span>
                            {testMode === 'practice' && isPracticeChecked && isCorrectAnswer && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            )}
                            {testMode === 'practice' && isPracticeChecked && isSelected && !isCorrectAnswer && (
                              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Numerical Answer (NAT) Input */}
                  {currentQ.type === 'nat' && (
                    <div className="relative space-y-3 pt-2">
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Enter Your Numerical Answer:
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={userAnswers[currentQ.id] || ''}
                          disabled={isPracticeChecked}
                          onChange={(e) => handleSelectOption(currentQ.id, e.target.value)}
                          placeholder="e.g. 5.67 or 5000"
                          className="w-full sm:w-72 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-[#1D8676] text-slate-900 dark:text-white font-mono text-sm outline-none shadow-sm"
                        />
                        {testMode === 'practice' && isPracticeChecked && (
                          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            Accepted: {currentQ.correctAnswer} (±{currentQ.numericalTolerance || 0})
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Practice Mode: Instant Solution & Explanation Reveal */}
                  {testMode === 'practice' && isPracticeChecked && (
                    <div className="relative mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/30 uppercase flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Official Solution</span>
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          Correct Answer: <strong className="text-slate-900 dark:text-white">{currentQ.correctAnswer}</strong>
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                        {currentQ.explanation}
                      </div>

                      {currentQ.keyFormula && (
                        <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-[#0e1d1b] border border-[#1D8676]/30 text-xs font-mono text-[#1D8676] dark:text-[#2dd4bf]">
                          💡 <strong className="font-sans font-semibold">Key Takeaway:</strong> {currentQ.keyFormula}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Question Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleReview(currentQ.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 shadow-sm ${
                        isMarked
                          ? 'bg-purple-600/15 border-purple-500/50 text-purple-700 dark:text-purple-300'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Flag className={`w-3.5 h-3.5 ${isMarked ? 'fill-current' : ''}`} />
                      <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
                    </button>

                    <button
                      onClick={() => handleClearResponse(currentQ.id)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shadow-sm"
                    >
                      Clear Response
                    </button>

                    {/* Practice Mode: "Check Answer" Button */}
                    {testMode === 'practice' && !isPracticeChecked && (
                      <button
                        onClick={() => handleCheckPracticeAnswer(currentQ)}
                        disabled={!userAnswers[currentQ.id]}
                        className="px-4 py-2 rounded-xl bg-[#1D8676] hover:bg-[#176f62] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Check Answer</span>
                      </button>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => currentQuestionIndex > 0 && handleNavigateQuestion(currentQuestionIndex - 1)}
                      disabled={currentQuestionIndex === 0}
                      className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-40 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    {currentQuestionIndex < activeExamTest.questions.length - 1 ? (
                      <button
                        onClick={handleSaveAndNext}
                        className="px-4 py-2 rounded-xl bg-[#1D8676] hover:bg-[#176f62] text-white text-xs font-bold shadow-md shadow-[#1D8676]/30 flex items-center gap-1.5 transition-all"
                      >
                        <span>{testMode === 'exam' ? 'Save & Next' : 'Next Question'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowSubmitModal(true)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                      >
                        <span>Submit Final Test</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </main>

          {/* Question Palette Sidebar (Right Column ~28%) */}
          <aside className="w-full lg:w-80 bg-white dark:bg-[#101519] border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto shrink-0 shadow-sm">
            <div>
              {/* Palette Header & Jump Form */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Question Palette
                </h2>
                <span className="text-[11px] text-slate-500 font-mono">
                  {answeredCount}/{activeExamTest.questions.length} Attempted
                </span>
              </div>

              {/* Jump to Question Quick Form */}
              <form onSubmit={handleJumpToQ} className="flex items-center gap-2 mb-3">
                <input
                  type="number"
                  min="1"
                  max={activeExamTest.questions.length}
                  value={jumpInput}
                  onChange={(e) => setJumpInput(e.target.value)}
                  placeholder={`Jump (1-${activeExamTest.questions.length})`}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-[#1D8676]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-[#1D8676] text-white text-xs font-bold hover:bg-[#176f62] transition-colors"
                >
                  Go
                </button>
              </form>

              {/* Chunk Filter Tabs (1-5, 6-10 etc. inspired by screenshot) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
                <button
                  onClick={() => setActiveChunk('all')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                    activeChunk === 'all'
                      ? 'bg-[#1D8676] text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                {chunkTabs.map(tab => (
                  <button
                    key={tab.label}
                    onClick={() => setActiveChunk(tab.label)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold whitespace-nowrap transition-all ${
                      activeChunk === tab.label
                        ? 'bg-[#1D8676] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Status Legend */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 dark:text-slate-400 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                  <span>Review ({markedForReview.length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span>Not Answered ({visitedQuestions.length - answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                  <span>Not Visited</span>
                </div>
              </div>

              {/* Question Buttons Matrix */}
              <div className="grid grid-cols-5 gap-2 max-h-[320px] overflow-y-auto pr-1">
                {visiblePaletteIndices.map(idx => {
                  const q = activeExamTest.questions[idx];
                  const answered = !!userAnswers[q.id];
                  const marked = markedForReview.includes(q.id);
                  const visited = visitedQuestions.includes(q.id);
                  const isCurrent = idx === currentQuestionIndex;

                  let style = 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60';
                  if (marked) {
                    style = 'bg-purple-600 text-white font-bold border-purple-600 shadow-sm';
                  } else if (answered) {
                    style = 'bg-[#1D8676] text-white font-bold border-[#1D8676] shadow-sm';
                  } else if (visited) {
                    style = 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-semibold';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => handleNavigateQuestion(idx)}
                      className={`h-9 rounded-xl text-xs font-semibold transition-all flex items-center justify-center relative ${style} ${
                        isCurrent ? 'ring-2 ring-[#1D8676] ring-offset-2 ring-offset-white dark:ring-offset-[#101519] scale-105' : 'hover:scale-102'
                      }`}
                    >
                      {idx + 1}
                      {bookmarkedQuestions.includes(q.id) && (
                        <span className="absolute -top-1 -right-1 text-amber-500 text-[10px]">★</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Candidate Summary Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Aspirant Session</span>
              <span className="font-bold text-slate-900 dark:text-white">{currentExamData.name} Target</span>
            </div>
          </aside>
        </div>

        {/* Floating Scientific Calculator Modal */}
        {showCalculator && (
          <div className="absolute right-4 bottom-4 w-72 bg-white dark:bg-[#162026] border border-slate-300 dark:border-[#1D8676]/50 rounded-2xl p-4 shadow-2xl z-50 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-[#1D8676] dark:text-[#2dd4bf] flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" />
                <span>Virtual Calculator</span>
              </span>
              <button
                onClick={() => setShowCalculator(false)}
                className="text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              value={calcInput}
              onChange={(e) => setCalcInput(e.target.value)}
              placeholder="e.g. 54 * 108 / 162"
              className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm mb-2 outline-none"
            />
            {calcResult && (
              <div className="text-right font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                = {calcResult}
              </div>
            )}

            <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
              {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'].map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    if (k === '=') {
                      evalCalc(calcInput);
                    } else {
                      setCalcInput(prev => prev + k);
                    }
                  }}
                  className={`p-2 rounded-md transition-colors ${
                    k === '=' 
                      ? 'bg-[#1D8676] text-white font-bold' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {k}
                </button>
              ))}
              <button
                onClick={() => {
                  setCalcInput('');
                  setCalcResult('');
                }}
                className="col-span-4 p-1.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-300 text-xs font-semibold hover:bg-rose-500/25 mt-1 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Exit Confirmation Dialog */}
        {showExitModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#12181d] border border-slate-200 dark:border-[#1D8676]/40 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Exit Test Simulator?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                Are you sure you want to exit? Your progress for this session will not be submitted to your scorecards.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Resume
                </button>
                <button
                  onClick={() => {
                    setShowExitModal(false);
                    exitMockTest();
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
                >
                  Yes, Exit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Confirmation Dialog */}
        {showSubmitModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#12181d] border border-slate-200 dark:border-[#1D8676]/40 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Ready to Submit Exam?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Please review your question attempts before final submission. Your official scorecard and verified solution analysis will be generated immediately.
              </p>

              <div className="grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-center text-xs mb-6 border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {answeredCount}
                  </div>
                  <span className="text-[10px] text-slate-500">Answered</span>
                </div>
                <div>
                  <div className="text-base font-bold text-amber-500 dark:text-amber-400 font-mono">
                    {activeExamTest.questions.length - answeredCount}
                  </div>
                  <span className="text-[10px] text-slate-500">Unanswered</span>
                </div>
                <div>
                  <div className="text-base font-bold text-purple-600 dark:text-purple-400 font-mono">
                    {markedForReview.length}
                  </div>
                  <span className="text-[10px] text-slate-500">Marked</span>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Continue Test
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="px-5 py-2 rounded-xl bg-[#1D8676] hover:bg-[#176f62] text-white text-xs font-bold shadow-md shadow-[#1D8676]/30"
                >
                  Submit & View Scorecard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // 2. DETAILED SCORECARD ANALYSIS VIEW
  // ==========================================
  if (viewingScorecard) {
    const sc = viewingScorecard;
    const testDef = SAMPLE_MOCK_TESTS.find(t => t.id === sc.testId) || SAMPLE_MOCK_TESTS[0];

    return (
      <div className="space-y-6 animate-in fade-in">
        {/* Header with Back button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1D8676]/20">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/25 dark:border-[#1D8676]/30">
              OFFICIAL PERFORMANCE SCORECARD
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {sc.testTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Attempted on {sc.timestamp} • Time Spent: {Math.round(sc.timeSpentSeconds / 60)} mins
            </p>
          </div>

          <button
            onClick={() => setViewingScorecard(null)}
            className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm self-start sm:self-center"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Tests</span>
          </button>
        </div>

        {/* Top Summary Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#10161b] border border-slate-200 dark:border-[#1D8676]/30 shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Final Score</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1D8676] dark:text-[#2dd4bf] font-mono mt-1">
              {sc.score} <span className="text-xs text-slate-400 font-sans font-normal">/ {sc.maxScore}</span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{sc.percentage}% Total Marks</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#10161b] border border-slate-200 dark:border-[#1D8676]/30 shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estimated Percentile</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 dark:text-amber-400 font-mono mt-1">
              {sc.percentile} %ile
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">AIR ~{sc.rankEstimate} estimate</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#10161b] border border-slate-200 dark:border-[#1D8676]/30 shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Accuracy Rate</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
              {sc.accuracy}%
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{sc.correctAnswers} of {sc.correctAnswers + sc.incorrectAnswers} attempted</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#10161b] border border-slate-200 dark:border-[#1D8676]/30 shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pace per Question</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mono mt-1">
              {Math.round(sc.timeSpentSeconds / sc.totalQuestions)}s
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Recommended: ~120s</span>
          </div>
        </div>

        {/* Detailed Breakdown: Correct vs Incorrect vs Skipped */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#10161b] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#1D8676]" />
            <span>Attempt Analysis Breakdown</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Correct Questions</span>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{sc.correctAnswers}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20">
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <div>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Incorrect Questions</span>
                <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{sc.incorrectAnswers}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40">
              <AlertCircle className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <div>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Unattempted (Skipped)</span>
                <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{sc.unattemptedAnswers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Question-by-Question Solution Review with Answers Revealed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Question-by-Question Verified Solutions
            </h4>
            <span className="text-xs text-slate-500">Official answers revealed post-exam</span>
          </div>

          {testDef.questions.map((q, idx) => {
            const userAns = sc.userResponses[q.id];
            const isAttempted = !!userAns;
            let isCorrect = false;

            if (q.type === 'mcq') {
              isCorrect = userAns === q.correctAnswer;
            } else if (q.type === 'nat') {
              isCorrect = Math.abs(parseFloat(userAns || '0') - parseFloat(q.correctAnswer as string)) <= (q.numericalTolerance || 0);
            }

            return (
              <div key={q.id} className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#10161b] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-[#1D8676] dark:text-[#2dd4bf]">
                    Question {idx + 1} • {q.difficulty} • +{q.marks} Marks
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                    !isAttempted
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      : isCorrect
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/40'
                  }`}>
                    {!isAttempted ? 'SKIPPED' : isCorrect ? 'CORRECT' : 'INCORRECT'}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {q.questionText}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Your Response:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {userAns || 'No Answer Given'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-[#1D8676]/10 border border-[#1D8676]/25 dark:border-[#1D8676]/30">
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Official Answer:</span>
                    <span className="font-mono font-bold text-[#1D8676] dark:text-[#2dd4bf]">
                      {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                  <strong className="text-slate-900 dark:text-white block mb-1">Detailed Explanation & Concepts:</strong>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. TESTS LISTING / DASHBOARD VIEW
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1D8676]/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/25 dark:border-[#1D8676]/30">
              OFFICIAL EXAM SIMULATOR & PRACTICE
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Choose between Timed Exam Simulator and Self-Paced Practice</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {currentExamData.name} Mock Tests & Speed Drills
          </h2>
        </div>

        {/* Year Filter Chips */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Filter:</span>
          {['all', '2022'].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYearFilter(yr)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedYearFilter === yr
                  ? 'bg-[#1D8676] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-[#1D8676]'
              }`}
            >
              {yr === 'all' ? 'All Tests' : `${yr} Papers`}
            </button>
          ))}
        </div>
      </div>

      {/* Available Tests Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {availableTests.map((test) => (
          <div
            key={test.id}
            className="relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#10161b] border border-slate-200 dark:border-[#1D8676]/30 hover:border-[#1D8676] transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
          >
            {/* Subtle Gaussian fade for bright mode */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#1D8676]/5 dark:bg-[#1D8676]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/25 dark:border-[#1D8676]/40">
                  {test.type}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#1D8676]" />
                  {test.durationMinutes} Minutes
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
                {test.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Pattern aligned with latest official notifications. Calculator support and detailed analytics included.
              </p>

              {/* Meta specifications */}
              <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">QUESTIONS</span>
                  <span className="font-semibold text-slate-900 dark:text-white font-mono">{test.totalQuestions} Qs</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">MARKS</span>
                  <span className="font-semibold text-slate-900 dark:text-white font-mono">{test.totalMarks} Total</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">MARKING</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">+{test.positiveMarks}</span> / <span className="text-rose-600 dark:text-rose-400 font-mono">-{test.negativeMarks}</span>
                </div>
              </div>
            </div>

            {/* TWO Launch Action Buttons: Exam Mode & Practice Mode */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {/* Button 1: Start Exam Simulator (Answers after submission) */}
              <button
                onClick={() => handleStartExam(test, 'exam')}
                className="w-full py-2.5 rounded-xl bg-[#1D8676] hover:bg-[#176f62] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 group"
                title="Timed exam with negative marking. Answers shown after submission."
              >
                <Play className="w-3.5 h-3.5 fill-white group-hover:scale-110 transition-transform" />
                <span>Start Exam</span>
              </button>

              {/* Button 2: Practice Mode (Instant Answers & Solutions) */}
              <button
                onClick={() => handleStartExam(test, 'practice')}
                className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/70 dark:bg-slate-900 dark:hover:bg-[#1D8676]/20 border border-slate-300 dark:border-slate-700 hover:border-[#1D8676] text-slate-700 dark:text-slate-200 hover:text-[#1D8676] dark:hover:text-[#2dd4bf] text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                title="Practice at your own pace with instant verified answers after each question."
              >
                <Lightbulb className="w-3.5 h-3.5 text-[#1D8676]" />
                <span>Practice Mode</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Past Test Attempts & Scorecard History */}
      <div className="pt-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <History className="w-4 h-4 text-[#1D8676]" />
          <span>Past Test Attempts & Scorecards ({testHistory.length})</span>
        </h3>

        {testHistory.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs shadow-sm">
            No mock tests completed yet. Choose a test above and start an Exam Simulator session to unlock detailed scorecards!
          </div>
        ) : (
          <div className="space-y-3">
            {testHistory.map((sub) => (
              <div
                key={sub.id}
                onClick={() => setViewingScorecard(sub)}
                className="p-4 rounded-xl bg-white dark:bg-[#10161b] border border-slate-200 dark:border-slate-800 hover:border-[#1D8676]/60 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{sub.testTitle}</span>
                    <span className="text-[10px] text-slate-400">• {sub.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>Score: <strong className="text-[#1D8676] dark:text-[#2dd4bf]">{sub.score}/{sub.maxScore}</strong></span>
                    <span>Percentile: <strong className="text-amber-500 dark:text-amber-400">{sub.percentile}%ile</strong></span>
                    <span>Accuracy: <strong className="text-emerald-600 dark:text-emerald-400">{sub.accuracy}%</strong></span>
                  </div>
                </div>

                <button className="px-3 py-1.5 rounded-lg bg-[#1D8676]/10 dark:bg-[#1D8676]/15 text-[#1D8676] dark:text-[#2dd4bf] text-xs font-semibold flex items-center gap-1 hover:bg-[#1D8676] hover:text-white transition-all self-end sm:self-center">
                  <span>View Scorecard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
