import React from 'react';
import { 
  X, 
  Check, 
  Compass, 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EXAMS_LIST } from '../data/mockData';
import { ExamId } from '../types';

export const ExamSelectorModal: React.FC = () => {
  const { 
    selectedExam, 
    setSelectedExam, 
    isExamSelectorOpen, 
    setIsExamSelectorOpen,
    userProfile,
    triggerCelebration
  } = useApp();

  if (!isExamSelectorOpen) return null;

  const handleSelectExam = (examId: ExamId) => {
    setSelectedExam(examId);
    triggerCelebration();
    setIsExamSelectorOpen(false);
  };

  const upcomingExams = [
    { name: 'UPSC CSE', desc: 'Civil Services Examination (IAS/IPS)', status: 'Adding in Q2' },
    { name: 'CAT', desc: 'Common Admission Test for IIMs', status: 'Adding in Q2' }
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#12181d] border border-[#1D8676]/40 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 my-8">
        {/* Close Button */}
        <button
          onClick={() => setIsExamSelectorOpen(false)}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-lg mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D8676]/20 border border-[#1D8676]/40 text-[#2dd4bf] text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Customize Your Study Environment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Select Your Target Exam
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Switching your exam instantly adapts all subjects, high-yield digital notes, previous year questions (PYQs), and timed mock tests.
          </p>
        </div>

        {/* Available Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {EXAMS_LIST.map((exam) => {
            const isSelected = selectedExam === exam.id;

            return (
              <div
                key={exam.id}
                onClick={() => handleSelectExam(exam.id)}
                className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#162725] to-[#10191c] border-[#1D8676] ring-2 ring-[#1D8676]/30 shadow-xl shadow-[#1D8676]/20'
                    : 'bg-[#101519] border-slate-800 hover:border-[#1D8676]/50 hover:bg-[#131b20]'
                }`}
              >
                {/* Active check pill */}
                {isSelected && (
                  <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-[#1D8676] text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                    <Check className="w-3 h-3" />
                    <span>ACTIVE</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1D8676]/20 text-[#2dd4bf] border border-[#1D8676]/30">
                      {exam.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#2dd4bf] transition-colors">
                    {exam.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {exam.fullName}
                  </p>

                  {/* Exam Specs */}
                  <div className="space-y-1.5 my-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-[#1D8676]" />
                      <span>{exam.subjects.length} Major Subjects</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#1D8676]" />
                      <span>{exam.durationMinutes} Min Exam Duration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-[#1D8676]" />
                      <span>{exam.totalMarks} Marks Total</span>
                    </div>
                  </div>
                </div>

                <button
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#1D8676] text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 group-hover:bg-[#1D8676]/20 group-hover:text-[#2dd4bf]'
                  }`}
                >
                  <span>{isSelected ? 'Currently Selected' : 'Choose Exam'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Future Expandable Exams Note */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>More Exams Arriving Soon</span>
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {upcomingExams.map((ue, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-slate-300">
                <div>
                  <span className="font-semibold text-white">{ue.name}</span>
                  <p className="text-[10px] text-slate-400">{ue.desc}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-700/60 text-slate-300">
                  {ue.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
