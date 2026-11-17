import React, { useState } from 'react';
import { BookOpen, Star, Users, FileText, ArrowRight, X, Bookmark, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DIGITAL_BOOKS } from '../data/mockData';
import { DigitalBook } from '../types';

export const DigitalBooks: React.FC = () => {
  const { selectedExam, currentExamData, setActiveTab } = useApp();
  const [selectedBook, setSelectedBook] = useState<DigitalBook | null>(null);

  // Filter books for active exam
  const examBooks = DIGITAL_BOOKS.filter((b) => b.examId === selectedExam);
  // Fallback to all if empty for the selected exam
  const displayBooks = examBooks.length > 0 ? examBooks : DIGITAL_BOOKS;

  return (
    <section className="my-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>Most Imp Digital Books for {currentExamData.name}</span>
          </h3>
          <p className="text-xs text-slate-400">
            No need to buy bulky physical books. High-yield formulas and verified question banks all in one place!
          </p>
        </div>
        <button
          onClick={() => setActiveTab('short-notes')}
          className="text-xs font-bold text-[#2dd4bf] hover:text-white uppercase tracking-wider transition-colors flex items-center gap-1"
        >
          <span>VIEW ALL</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Book Cards Grid / Horizontal Shelf */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => setSelectedBook(book)}
            className="group relative flex flex-col justify-between rounded-xl p-3.5 bg-gradient-to-b from-[#131b20] to-[#0e1418] border border-[#1D8676]/30 hover:border-[#1D8676] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1D8676]/20 cursor-pointer select-none"
          >
            {/* Book Spine Simulation Effect */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1D8676] rounded-l-xl opacity-80" />

            {/* Top Tag & Badge */}
            <div className="flex items-center justify-between gap-1 mb-3 pl-1">
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#1D8676]/20 text-[#2dd4bf] border border-[#1D8676]/40">
                {book.badgeText}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{book.rating}</span>
              </div>
            </div>

            {/* Book Cover Title Area */}
            <div className="my-2 pl-1">
              <div className="w-8 h-8 rounded-lg bg-[#1D8676]/15 flex items-center justify-center text-[#2dd4bf] mb-2 group-hover:scale-110 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-[#2dd4bf] transition-colors line-clamp-2 leading-tight">
                {book.title}
              </h4>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                {book.subtitle}
              </p>
            </div>

            {/* Book Meta Footer */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 pl-1">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-[#1D8676]" />
                {book.pagesCount}p
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                {book.readersCount}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Book Reader Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12181d] border border-[#1D8676]/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-18 rounded-lg bg-gradient-to-tr from-[#1D8676] to-[#25a895] flex items-center justify-center text-white shadow-lg p-2 text-center">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#1D8676]/20 text-[#2dd4bf] border border-[#1D8676]/40">
                  {selectedBook.badgeText}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedBook.title}</h3>
                <p className="text-xs text-slate-400">{selectedBook.subtitle}</p>
              </div>
            </div>

            <div className="space-y-3 my-4">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Book Highlights:</h5>
              <div className="space-y-2">
                {selectedBook.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <Check className="w-4 h-4 text-[#2dd4bf] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => {
                  setSelectedBook(null);
                  setActiveTab('short-notes');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#1D8676] hover:bg-[#176f62] text-white text-xs font-bold transition-all shadow-md shadow-[#1D8676]/30 flex items-center justify-center gap-2"
              >
                <span>Open Digital Notes & Formulas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
