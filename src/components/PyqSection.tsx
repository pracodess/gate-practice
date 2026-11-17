import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Bookmark, 
  Check, 
  X, 
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SAMPLE_PYQS } from '../data/mockData';
import { PYQQuestion } from '../types';

export const PyqSection: React.FC = () => {
  const { 
    selectedExam, 
    currentExamData, 
    solvedQuestions, 
    markQuestionAnswered, 
    bookmarkedQuestions, 
    toggleBookmarkQuestion 
  } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [activeQuestion, setActiveQuestion] = useState<PYQQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [numericalInput, setNumericalInput] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const examPyqs = SAMPLE_PYQS.filter((q) => q.examId === selectedExam);

  const subjectFiltered = selectedSubjectId === 'all'
    ? examPyqs
    : examPyqs.filter((q) => q.subjectId === selectedSubjectId);

  const filteredPyqs = selectedYear === 'all'
    ? subjectFiltered
    : subjectFiltered.filter((q) => q.year.toString() === selectedYear);

  const handleOpenQuestion = (q: PYQQuestion) => {
    setActiveQuestion(q);
    const existing = solvedQuestions[q.id];
    if (existing) {
      setSelectedOption(existing.selected);
      setNumericalInput(existing.selected);
      setShowExplanation(true);
    } else {
      setSelectedOption('');
      setNumericalInput('');
      setShowExplanation(false);
    }
  };

  const handleCheckAnswer = () => {
    if (!activeQuestion) return;

    let isCorrect = false;
    let submittedVal = '';

    if (activeQuestion.type === 'mcq') {
      if (!selectedOption) return;
      isCorrect = selectedOption === activeQuestion.correctAnswer;
      submittedVal = selectedOption;
    } else if (activeQuestion.type === 'nat') {
      if (!numericalInput) return;
      const userNum = parseFloat(numericalInput);
      const correctNum = parseFloat(activeQuestion.correctAnswer as string);
      const tol = activeQuestion.numericalTolerance || 0;
      isCorrect = Math.abs(userNum - correctNum) <= tol;
      submittedVal = numericalInput;
    }

    markQuestionAnswered(activeQuestion.id, isCorrect, submittedVal);
    setShowExplanation(true);
  };

  return (
    <section id="tour-pyq-bank" className="my-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Chapter-wise PYQ Bank</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/25 dark:border-[#1D8676]/30 font-mono">
              {filteredPyqs.length} Questions
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Practice real past exam questions with instant verified solutions and timer benchmarks.
          </p>
        </div>
      </div>

      {/* Subject Filter Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
        <button
          onClick={() => setSelectedSubjectId('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedSubjectId === 'all'
              ? 'bg-[#1D8676] text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60'
          }`}
        >
          <span>All Subjects</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-black/30 font-mono">
            {examPyqs.length}
          </span>
        </button>

        {currentExamData.subjects.map((sub) => {
          const count = examPyqs.filter((q) => q.subjectId === sub.id).length;
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedSubjectId === sub.id
                  ? 'bg-[#1D8676] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60'
              }`}
            >
              <span>{sub.name}</span>
              {count > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-black/30 font-mono">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Year Filter Chips */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Year:</span>
        {['all', '2024', '2023', '2022'].map((yr) => (
          <button
            key={yr}
            onClick={() => setSelectedYear(yr)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedYear === yr
                ? 'bg-[#1D8676]/10 dark:bg-[#1D8676]/30 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
            }`}
          >
            {yr === 'all' ? 'All Years' : yr}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredPyqs.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No PYQs found for this filter</p>
            <p className="text-xs text-slate-500 mt-1">Select "All Subjects" or switch year to see available practice questions.</p>
          </div>
        ) : (
          filteredPyqs.map((q) => {
            const isSolved = !!solvedQuestions[q.id];
            const isCorrect = solvedQuestions[q.id]?.status === 'correct';
            const isBookmarked = bookmarkedQuestions.includes(q.id);

            return (
              <div
                key={q.id}
                onClick={() => handleOpenQuestion(q)}
                className="group p-4 rounded-xl bg-white dark:bg-[#10161b] border border-slate-200 dark:border-[#1D8676]/20 hover:border-[#1D8676] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:shadow-md"
              >
                <div className="flex items-start gap-3 flex-1">
                  {/* Status Indicator */}
                  <div className="pt-0.5">
                    {isSolved ? (
                      isCorrect ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/40">
                          <X className="w-3.5 h-3.5" />
                        </div>
                      )
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-mono">Q</span>
                      </div>
                    )}
                  </div>

                  {/* Question details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/25 dark:border-[#1D8676]/30 uppercase">
                        {currentExamData.name} {q.year} {q.examShift && `• ${q.examShift}`}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        q.difficulty === 'Easy' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : q.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}>
                        {q.difficulty}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        +{q.marks} / -{q.negativeMarks} Marks
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                        {q.type.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium line-clamp-2 leading-relaxed">
                      {q.questionText}
                    </p>
                  </div>
                </div>

                {/* Right action button */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmarkQuestion(q.id);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isBookmarked
                        ? 'text-amber-500 bg-amber-500/10'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={isBookmarked ? 'Bookmarked' : 'Bookmark question'}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <button className="px-3 py-1.5 rounded-lg bg-[#1D8676]/10 dark:bg-[#1D8676]/20 group-hover:bg-[#1D8676] text-[#1D8676] dark:text-[#2dd4bf] group-hover:text-white text-xs font-bold flex items-center gap-1 transition-all">
                    <span>{isSolved ? 'Review' : 'Solve'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Question Solving Modal */}
      {activeQuestion && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#12181d] border border-slate-200 dark:border-[#1D8676]/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/25 dark:border-[#1D8676]/40">
                  {currentExamData.name} {activeQuestion.year}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {activeQuestion.marks} Marks • {activeQuestion.type.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setActiveQuestion(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Question Text */}
            <div className="my-5">
              <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                {activeQuestion.questionText}
              </h4>
            </div>

            {/* Multiple Choice Options */}
            {activeQuestion.type === 'mcq' && activeQuestion.options && (
              <div className="space-y-2.5 my-4">
                {activeQuestion.options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  const isCorrect = opt.id === activeQuestion.correctAnswer;
                  let borderStyle = 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200';

                  if (showExplanation) {
                    if (isCorrect) {
                      borderStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200';
                    } else if (isSelected && !isCorrect) {
                      borderStyle = 'border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-200';
                    }
                  } else if (isSelected) {
                    borderStyle = 'border-[#1D8676] bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf]';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => !showExplanation && setSelectedOption(opt.id)}
                      disabled={showExplanation}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${borderStyle}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        showExplanation && isCorrect 
                          ? 'bg-emerald-500 text-white'
                          : showExplanation && isSelected && !isCorrect
                          ? 'bg-rose-500 text-white'
                          : isSelected 
                          ? 'bg-[#1D8676] text-white' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {opt.id}
                      </div>
                      <span className="flex-1">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Numerical Answer Type (NAT) Input */}
            {activeQuestion.type === 'nat' && (
              <div className="my-4">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">
                  Enter Numerical Answer:
                </label>
                <input
                  type="text"
                  value={numericalInput}
                  onChange={(e) => setNumericalInput(e.target.value)}
                  disabled={showExplanation}
                  placeholder="e.g. 9 or 36"
                  className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-[#1D8676] text-slate-900 dark:text-white font-mono text-sm outline-none"
                />
              </div>
            )}

            {/* Actions: Submit & Check */}
            {!showExplanation && (
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setActiveQuestion(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckAnswer}
                  disabled={activeQuestion.type === 'mcq' ? !selectedOption : !numericalInput}
                  className="px-5 py-2.5 rounded-xl bg-[#1D8676] hover:bg-[#176f62] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <span>Submit Answer</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Detailed Explanation Reveal */}
            {showExplanation && (
              <div className="mt-5 p-4 rounded-xl bg-teal-50/40 dark:bg-slate-900/90 border border-[#1D8676]/30 animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1D8676] dark:text-[#2dd4bf] mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span>Step-by-Step Solution & Concept Trap</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {activeQuestion.explanation}
                </p>

                {activeQuestion.keyFormula && (
                  <div className="mt-3 p-2.5 rounded-lg bg-[#1D8676]/10 border border-[#1D8676]/25 text-xs font-mono text-[#1D8676] dark:text-[#2dd4bf]">
                    💡 <strong className="text-slate-900 dark:text-white">Key Formula:</strong> {activeQuestion.keyFormula}
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setShowExplanation(false);
                      setSelectedOption('');
                      setNumericalInput('');
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => setActiveQuestion(null)}
                    className="px-4 py-1.5 rounded-lg bg-[#1D8676] hover:bg-[#176f62] text-white text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
