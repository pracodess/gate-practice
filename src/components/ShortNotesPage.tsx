import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  Copy, 
  Check, 
  Clock, 
  AlertTriangle, 
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SHORT_NOTES_DATA } from '../data/mockData';
import { ShortNote } from '../types';

export const ShortNotesPage: React.FC = () => {
  const { 
    selectedExam, 
    currentExamData, 
    bookmarkedNotes, 
    toggleBookmarkNote 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const examNotes = SHORT_NOTES_DATA.filter((n) => n.examId === selectedExam);

  const subjectNotes = selectedSubjectId === 'all' 
    ? examNotes 
    : examNotes.filter((n) => n.subjectId === selectedSubjectId);

  const filteredNotes = subjectNotes.filter((note) => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.chapterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.sections.some(s => s.content.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBookmark = !showBookmarksOnly || bookmarkedNotes.includes(note.id);
    return matchesSearch && matchesBookmark;
  });

  const [activeNote, setActiveNote] = useState<ShortNote | null>(examNotes[0] || null);

  const handleCopyFormula = (formula: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedFormula(formula);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1D8676]/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/25 dark:border-[#1D8676]/30">
              {currentExamData.name} QUICK REVISION NOTES
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Zero-fluff formulas & key concepts</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            High-Yield Short Notes & Formula Sheets
          </h2>
        </div>

        {/* Search & Bookmark Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formula, theorem, rule..."
              className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-[#1D8676] text-slate-900 dark:text-white text-xs w-48 sm:w-64 outline-none transition-colors"
            />
          </div>

          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              showBookmarksOnly
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Show Bookmarked"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subject Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedSubjectId('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedSubjectId === 'all'
              ? 'bg-[#1D8676] text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          All Subjects
        </button>
        {currentExamData.subjects.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setSelectedSubjectId(sub.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSubjectId === sub.id
                ? 'bg-[#1D8676] text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {sub.name}
          </button>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Notes List Column */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Available Chapters ({filteredNotes.length})
          </div>

          {filteredNotes.length === 0 ? (
            <div className="p-6 text-center bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
              No short notes found matching your filters.
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = activeNote?.id === note.id;
              const isBookmarked = bookmarkedNotes.includes(note.id);

              return (
                <div
                  key={note.id}
                  onClick={() => setActiveNote(note)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                    isSelected
                      ? 'bg-teal-50/60 dark:bg-[#131f24] border-[#1D8676] shadow-sm'
                      : 'bg-white dark:bg-[#101519] border-slate-200 dark:border-slate-800/80 hover:border-[#1D8676]/40 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#1D8676] dark:text-[#2dd4bf] uppercase">
                        {note.chapterName}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                        {note.title}
                      </h4>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmarkNote(note.id);
                      }}
                      className={`p-1 rounded transition-colors ${
                        isBookmarked ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#1D8676]" />
                      {note.readTime}
                    </span>
                    <span className="text-slate-500 group-hover:text-[#1D8676] dark:group-hover:text-[#2dd4bf] transition-colors flex items-center gap-0.5">
                      Read <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Active Note Reader Column */}
        <div className="lg:col-span-8">
          {activeNote ? (
            <div className="bg-white dark:bg-[#10161b] border border-slate-200 dark:border-[#1D8676]/30 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Header */}
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/25 dark:border-[#1D8676]/30 uppercase">
                      {activeNote.subjectName}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">• {activeNote.chapterName}</span>
                  </div>

                  <button
                    onClick={() => toggleBookmarkNote(activeNote.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      bookmarkedNotes.includes(activeNote.id)
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{bookmarkedNotes.includes(activeNote.id) ? 'Saved' : 'Save'}</span>
                  </button>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                  {activeNote.title}
                </h3>
              </div>

              {/* Note Sections */}
              <div className="space-y-6">
                {activeNote.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="text-sm font-bold text-[#1D8676] dark:text-[#2dd4bf] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1D8676]" />
                      <span>{sec.heading}</span>
                    </h4>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                      {sec.content}
                    </div>

                    {/* Formula Callout */}
                    {sec.formula && (
                      <div className="relative p-3.5 rounded-xl bg-teal-50/60 dark:bg-[#0e1d1b] border border-[#1D8676]/30 flex items-center justify-between gap-3 group">
                        <div className="font-mono text-xs sm:text-sm font-semibold text-[#1D8676] dark:text-[#2dd4bf] overflow-x-auto">
                          {sec.formula}
                        </div>
                        <button
                          onClick={() => handleCopyFormula(sec.formula!)}
                          className="px-2.5 py-1 rounded-lg bg-[#1D8676]/10 hover:bg-[#1D8676] text-[#1D8676] hover:text-white text-xs font-semibold flex items-center gap-1 transition-all shrink-0"
                          title="Copy Formula"
                        >
                          {copiedFormula === sec.formula ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Key points checklist */}
                    {sec.keyPoints && (
                      <div className="space-y-1.5">
                        {sec.keyPoints.map((pt, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                            <span className="text-[#1D8676] font-bold">✓</span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Exam Trap Warning Box */}
                    {sec.examTip && (
                      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-700 dark:text-amber-300 font-semibold uppercase tracking-wider text-[11px] block">
                            Exam Trap Alert:
                          </strong>
                          <span>{sec.examTip}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold">Select a chapter note from the left to start reading.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
