import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Play, 
  ArrowRight, 
  RotateCcw, 
  Calculator, 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  Flag, 
  HelpCircle,
  TrendingUp,
  History
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
    setViewingScorecard 
  } = useApp();

  // Test Runner State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [visitedQuestions, setVisitedQuestions] = useState<string[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');

  // Filter available tests for active exam
  const availableTests = SAMPLE_MOCK_TESTS.filter(t => t.examId === selectedExam);

  // Initialize test timer when test starts
  useEffect(() => {
    if (activeExamTest) {
      setSecondsRemaining(activeExamTest.durationMinutes * 60);
      setUserAnswers({});
      setMarkedForReview([]);
      setVisitedQuestions([activeExamTest.questions[0]?.id || '']);
      setCurrentQuestionIndex(0);
    }
  }, [activeExamTest]);

  // Countdown timer effect
  useEffect(() => {
    if (!activeExamTest) return;

    if (secondsRemaining <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExamTest, secondsRemaining]);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleClearResponse = (questionId: string) => {
    setUserAnswers(prev => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
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
      }
    });

    totalScore = Math.max(0, Math.round(totalScore * 100) / 100);
    const maxScore = activeExamTest.totalMarks;
    const percentage = Math.round((totalScore / maxScore) * 100);
    const accuracy = correctCount + incorrectCount > 0 
      ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) 
      : 0;

    // Estimated percentile curve
    const percentile = Math.min(99.9, Math.max(45, Math.round((percentage * 0.95 + 10) * 10) / 10));
    const rankEstimate = Math.max(1, Math.round((100 - percentile) * 1200));

    const timeSpent = (activeExamTest.durationMinutes * 60) - secondsRemaining;

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

  const handleAutoSubmit = () => {
    handleFinalSubmit();
  };

  // Calculator evaluation
  const evalCalc = (val: string) => {
    try {
      // Safe math eval with standard operators
      const sanitized = val.replace(/[^0-9+\-*/().]/g, '');
      const res = Function(`'use strict'; return (${sanitized})`)();
      setCalcResult(res.toString());
    } catch {
      setCalcResult('Error');
    }
  };

  // 1. LIVE EXAM INTERFACE
  if (activeExamTest) {
    const currentQ = activeExamTest.questions[currentQuestionIndex];
    const isAnswered = !!userAnswers[currentQ?.id];
    const isMarked = markedForReview.includes(currentQ?.id);

    return (
      <div className="fixed inset-0 bg-[#0b0f12] z-50 flex flex-col text-white select-none">
        {/* Exam Header */}
        <header className="h-14 px-4 bg-[#10161b] border-b border-[#1D8676]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-[#2dd4bf]">{activeExamTest.title}</span>
            <span className="hidden sm:inline text-xs text-slate-400">| Q {currentQuestionIndex + 1} of {activeExamTest.questions.length}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown Clock */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border font-mono text-sm font-bold ${
              secondsRemaining < 300 
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse'
                : 'bg-slate-900 border-[#1D8676]/40 text-[#2dd4bf]'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>

            {/* Virtual Calculator Toggle */}
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center gap-1.5"
              title="Virtual Scientific Calculator"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden md:inline">Calculator</span>
            </button>

            {/* Submit Exam Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-1.5 rounded-xl bg-[#1D8676] hover:bg-[#176f62] text-white text-xs font-bold shadow-md shadow-[#1D8676]/30 transition-all"
            >
              Submit Test
            </button>
          </div>
        </header>

        {/* Exam Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          {/* Question Solving Area */}
          <main className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
            {currentQ ? (
              <div className="max-w-3xl w-full mx-auto space-y-6">
                {/* Question Info Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Question No. {currentQuestionIndex + 1}
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-400 font-semibold">+{currentQ.marks} Correct</span>
                    <span className="text-slate-500">/</span>
                    <span className="text-rose-400 font-semibold">-{currentQ.negativeMarks} Negative</span>
                  </div>
                </div>

                {/* Question Statement */}
                <div className="text-base font-medium text-slate-100 leading-relaxed">
                  {currentQ.questionText}
                </div>

                {/* Multiple Choice Options */}
                {currentQ.type === 'mcq' && currentQ.options && (
                  <div className="space-y-3 pt-2">
                    {currentQ.options.map(opt => {
                      const isSelected = userAnswers[currentQ.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption(currentQ.id, opt.id)}
                          className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left text-sm font-medium transition-all ${
                            isSelected
                              ? 'bg-[#1D8676]/20 border-[#1D8676] text-[#2dd4bf]'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            isSelected ? 'bg-[#1D8676] text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {opt.id}
                          </div>
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Numerical Input */}
                {currentQ.type === 'nat' && (
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">
                      Enter Your Numerical Answer:
                    </label>
                    <input
                      type="text"
                      value={userAnswers[currentQ.id] || ''}
                      onChange={(e) => handleSelectOption(currentQ.id, e.target.value)}
                      placeholder="e.g. 9 or 36.5"
                      className="w-64 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-[#1D8676] text-white font-mono text-sm outline-none"
                    />
                  </div>
                )}
              </div>
            ) : null}

            {/* Bottom Actions Bar */}
            <div className="max-w-3xl w-full mx-auto pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleReview(currentQ.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isMarked
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {isMarked ? 'Marked for Review' : 'Mark for Review'}
                </button>
                <button
                  onClick={() => handleClearResponse(currentQ.id)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Clear Response
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => currentQuestionIndex > 0 && handleNavigateQuestion(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-40 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleSaveAndNext}
                  className="px-4 py-2 rounded-xl bg-[#1D8676] hover:bg-[#176f62] text-white text-xs font-bold shadow-md shadow-[#1D8676]/30 flex items-center gap-1.5 transition-all"
                >
                  <span>Save & Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </main>

          {/* Question Palette Sidebar */}
          <aside className="w-full md:w-72 bg-[#101519] border-t md:border-t-0 md:border-l border-slate-800 p-4 flex flex-col justify-between overflow-y-auto">
            <div>
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Question Palette
              </h5>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-700" />
                  <span>Not Visited</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span>Not Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-purple-500" />
                  <span>Review</span>
                </div>
              </div>

              {/* Question Buttons Matrix */}
              <div className="grid grid-cols-5 gap-2">
                {activeExamTest.questions.map((q, idx) => {
                  const answered = !!userAnswers[q.id];
                  const marked = markedForReview.includes(q.id);
                  const visited = visitedQuestions.includes(q.id);
                  const isCurrent = idx === currentQuestionIndex;

                  let bg = 'bg-slate-800 text-slate-400';
                  if (marked) {
                    bg = 'bg-purple-600 text-white font-bold';
                  } else if (answered) {
                    bg = 'bg-[#1D8676] text-white font-bold';
                  } else if (visited) {
                    bg = 'bg-amber-600/80 text-white';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => handleNavigateQuestion(idx)}
                      className={`h-9 rounded-lg text-xs transition-all flex items-center justify-center relative ${bg} ${
                        isCurrent ? 'ring-2 ring-white ring-offset-2 ring-offset-[#101519]' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-4 text-[11px] text-slate-400 text-center">
              Candidate: <span className="text-white font-semibold">Pratham</span>
            </div>
          </aside>
        </div>

        {/* Floating Scientific Calculator Modal */}
        {showCalculator && (
          <div className="absolute right-4 bottom-4 w-72 bg-[#162026] border border-[#1D8676]/50 rounded-2xl p-4 shadow-2xl z-50">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700">
              <span className="text-xs font-bold text-[#2dd4bf] flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" />
                <span>Virtual Calculator</span>
              </span>
              <button
                onClick={() => setShowCalculator(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              value={calcInput}
              onChange={(e) => setCalcInput(e.target.value)}
              placeholder="e.g. 54 * 108 / 162"
              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm mb-2 outline-none"
            />
            {calcResult && (
              <div className="text-right font-mono text-base font-bold text-emerald-400 mb-2">
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
                  className={`p-2 rounded-md ${
                    k === '=' 
                      ? 'bg-[#1D8676] text-white font-bold col-span-1' 
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
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
                className="col-span-4 p-1.5 rounded-md bg-rose-600/30 text-rose-300 text-xs font-semibold hover:bg-rose-600/50 mt-1"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Submit Confirmation Dialog */}
        {showSubmitModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#12181d] border border-[#1D8676]/40 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-base font-bold text-white mb-2">Ready to Submit Exam?</h3>
              <p className="text-xs text-slate-400 mb-4">
                Please review your question attempts before final submission. Your scorecard will be generated immediately.
              </p>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900 text-center text-xs mb-6">
                <div>
                  <div className="text-base font-bold text-emerald-400">
                    {Object.keys(userAnswers).length}
                  </div>
                  <span className="text-[10px] text-slate-400">Answered</span>
                </div>
                <div>
                  <div className="text-base font-bold text-amber-400">
                    {activeExamTest.questions.length - Object.keys(userAnswers).length}
                  </div>
                  <span className="text-[10px] text-slate-400">Unanswered</span>
                </div>
                <div>
                  <div className="text-base font-bold text-purple-400">
                    {markedForReview.length}
                  </div>
                  <span className="text-[10px] text-slate-400">Marked</span>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Continue Test
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="px-5 py-2 rounded-xl bg-[#1D8676] hover:bg-[#176f62] text-white text-xs font-bold shadow-md shadow-[#1D8676]/30"
                >
                  Yes, Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. DETAILED SCORECARD ANALYSIS VIEW
  if (viewingScorecard) {
    const sc = viewingScorecard;
    const testDef = SAMPLE_MOCK_TESTS.find(t => t.id === sc.testId) || SAMPLE_MOCK_TESTS[0];

    return (
      <div className="space-y-6 animate-in fade-in">
        {/* Header with Back button */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1D8676]/20">
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
            className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Tests</span>
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
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Correct Questions</span>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{sc.correctAnswers}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20">
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <div>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Incorrect Questions</span>
                <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{sc.incorrectAnswers}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40">
              <AlertCircle className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <div>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Unattempted (Skipped)</span>
                <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{sc.unattemptedAnswers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Question-by-Question Detailed Review with Solutions */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Question-by-Question Solution Review
          </h4>

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
              <div key={q.id} className="p-5 rounded-2xl bg-white dark:bg-[#10161b] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-[#1D8676] dark:text-[#2dd4bf]">
                    Question {idx + 1} • {q.difficulty} • +{q.marks} Marks
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                    !isAttempted
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      : isCorrect
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/40'
                  }`}>
                    {!isAttempted ? 'SKIPPED' : isCorrect ? 'CORRECT' : 'INCORRECT'}
                  </span>
                </div>

                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {q.questionText}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Your Response:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {userAns || 'No Answer Given'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-teal-50/60 dark:bg-[#1D8676]/10 border border-[#1D8676]/25 dark:border-[#1D8676]/30">
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Official Answer:</span>
                    <span className="font-mono font-bold text-[#1D8676] dark:text-[#2dd4bf]">
                      {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  <strong className="text-slate-900 dark:text-white block mb-1">Detailed Explanation:</strong>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. TESTS LISTING / DASHBOARD VIEW
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1D8676]/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/25 dark:border-[#1D8676]/30">
              REAL EXAM SIMULATOR
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Timed tests with negative marking</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {currentExamData.name} Mock Tests & Speed Drills
          </h2>
        </div>
      </div>

      {/* Available Tests Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableTests.map((test) => (
          <div
            key={test.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#10161b] border border-slate-200 dark:border-[#1D8676]/30 hover:border-[#1D8676] transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/25 dark:border-[#1D8676]/40">
                  {test.type}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#1D8676]" />
                  {test.durationMinutes} Minutes
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
                {test.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pattern matches latest {currentExamData.name} notification with official calculator support.
              </p>

              <div className="flex items-center gap-4 my-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[10px]">QUESTIONS</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{test.totalQuestions} Questions</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">MARKS</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{test.totalMarks} Total</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">MARKING</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">+{test.positiveMarks}</span> / <span className="text-rose-600 dark:text-rose-400">-{test.negativeMarks}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => startMockTest(test)}
              className="w-full py-2.5 rounded-xl bg-[#1D8676] hover:bg-[#176f62] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 group"
            >
              <Play className="w-4 h-4 fill-white group-hover:scale-105 transition-transform" />
              <span>Start Test Simulator</span>
            </button>
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
          <div className="p-6 text-center bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs shadow-sm">
            No mock tests completed yet. Start your first mock test above to view detailed scorecards!
          </div>
        ) : (
          <div className="space-y-3">
            {testHistory.map((sub) => (
              <div
                key={sub.id}
                onClick={() => setViewingScorecard(sub)}
                className="p-4 rounded-xl bg-white dark:bg-[#10161b] border border-slate-200 dark:border-slate-800 hover:border-[#1D8676]/60 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
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
