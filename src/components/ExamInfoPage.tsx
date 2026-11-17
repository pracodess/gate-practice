import React from 'react';
import { 
  Info, 
  BookOpen, 
  Award, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Compass,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ExamInfoPage: React.FC = () => {
  const { currentExamData, setIsExamSelectorOpen } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1D8676]/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1D8676]/20 text-[#2dd4bf] border border-[#1D8676]/30">
              OFFICIAL PATTERN & SYLLABUS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {currentExamData.fullName}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentExamData.description}
          </p>
        </div>

        <button
          onClick={() => setIsExamSelectorOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-[#1D8676]/15 hover:bg-[#1D8676]/25 border border-[#1D8676]/40 text-[#2dd4bf] text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-center"
        >
          <Compass className="w-4 h-4" />
          <span>Switch Target Exam</span>
        </button>
      </div>

      {/* Exam Quick Specs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#10161b] border border-[#1D8676]/30">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Award className="w-4 h-4 text-[#2dd4bf]" />
            <span>Total Marks</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {currentExamData.totalMarks} Marks
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Official full paper weightage</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#10161b] border border-[#1D8676]/30">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Clock className="w-4 h-4 text-[#2dd4bf]" />
            <span>Exam Duration</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {currentExamData.durationMinutes} Minutes
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{currentExamData.durationMinutes / 60} Hours continuous session</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#10161b] border border-[#1D8676]/30">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Marking Scheme</span>
          </div>
          <div className="text-xs font-medium text-slate-200 mt-1 leading-snug">
            {currentExamData.negativeMarking}
          </div>
        </div>
      </div>

      {/* Subjects & Chapter Weightage Breakdown */}
      <div className="space-y-4 pt-2">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#2dd4bf]" />
          <span>Subject-Wise Syllabus & Estimated Weightage</span>
        </h3>

        <div className="space-y-4">
          {currentExamData.subjects.map((sub) => (
            <div key={sub.id} className="p-5 rounded-2xl bg-[#10161b] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-sm font-bold text-white">{sub.name}</span>
                <span className="text-xs font-mono text-[#2dd4bf]">
                  {sub.chapters.length} High-Yield Chapters
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sub.chapters.map((ch) => (
                  <div key={ch.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-slate-200 block">{ch.name}</span>
                      <span className="text-[10px] text-slate-400">{ch.pyqCount} Past Questions in Bank</span>
                    </div>
                    {ch.weightagePercent && (
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#1D8676]/20 text-[#2dd4bf] border border-[#1D8676]/30">
                        ~{ch.weightagePercent}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
