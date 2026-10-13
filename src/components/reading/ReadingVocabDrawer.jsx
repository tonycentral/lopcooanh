// src/components/reading/ReadingVocabDrawer.jsx
import React, { useState } from 'react';
import { 
  X, 
  Volume2, 
  Sparkles, 
  BookOpen, 
  BookmarkPlus, 
  Check, 
  ExternalLink,
  Search,
  Tag
} from 'lucide-react';
import { saveFlashcardWord } from '../../services/flashcardService';

export default function ReadingVocabDrawer({ 
  vocab, 
  onClose, 
  isOpen = true,
  studentEmail,
  topicName,
  onSearchWord
}) {
  const [isSavedToFlashcard, setIsSavedToFlashcard] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!isOpen || !vocab) return null;

  // Speak word using Web Speech API
  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  // Add word to student's Flashcard bank
  const handleSaveToFlashcard = () => {
    if (!vocab.word) return;
    try {
      saveFlashcardWord({
        studentEmail: studentEmail || "guest",
        word: vocab.word,
        ipa: vocab.ipa || "",
        pos: vocab.pos || "noun",
        meaning: vocab.meaning || vocab.vietnameseMeaning || "",
        topicName: topicName || "IELTS Reading",
        exampleSentence: vocab.contextSentence || vocab.example || "",
        synonyms: vocab.synonyms || []
      });
      setIsSavedToFlashcard(true);
      setTimeout(() => setIsSavedToFlashcard(false), 3000);
    } catch (e) {
      console.error("Error saving flashcard:", e);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim() && onSearchWord) {
      onSearchWord(searchInput.trim());
      setSearchInput("");
    }
  };

  return (
    <div className="w-full md:w-80 lg:w-96 bg-white border-l border-[#E6E2D8] flex flex-col h-full shadow-lg z-30 animate-fadeIn text-[#24211E]">
      
      {/* Top Header */}
      <div className="p-3.5 border-b border-[#E6E2D8] bg-[#FAF8F5] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center font-bold text-xs">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#24211E] uppercase tracking-wider">Tab Tra Từ Vựng</h4>
            <p className="text-[10px] text-[#7A7369]">Luyện tập song song với bài đọc</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-[#7A7369] hover:text-[#24211E] hover:bg-[#F4EFEA] transition cursor-pointer"
          title="Đóng tab từ vựng"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tra cứu nhanh từ bất kỳ */}
      <div className="p-2.5 border-b border-[#E6E2D8] bg-white shrink-0">
        <form onSubmit={handleManualSearch} className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tra cứu từ khác trong bài..."
            className="w-full pl-8 pr-12 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#24211E] placeholder-[#7A7369] focus:outline-none focus:border-[#3E4F42] transition"
          />
          <Search className="w-3.5 h-3.5 text-[#7A7369] absolute left-2.5 top-2.5" />
          {searchInput.trim() && (
            <button
              type="submit"
              className="absolute right-1 top-1 px-2 py-1 rounded bg-[#3E4F42] text-white text-[10px] font-semibold hover:bg-[#334237] transition cursor-pointer"
            >
              Tra
            </button>
          )}
        </form>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin">
        
        {/* Word Card Banner */}
        <div className="p-3.5 rounded-2xl bg-[#EDF3EE]/60 border border-[#D1DDD3] space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <h3 className="text-xl font-bold font-serif text-[#24211E]">{vocab.word}</h3>
                {vocab.ipa && (
                  <span className="text-xs font-mono font-medium text-[#3E4F42] italic">
                    {vocab.ipa}
                  </span>
                )}
              </div>
              {vocab.pos && (
                <span className="inline-block mt-1 text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded bg-white text-[#7A7369] border border-[#E6E2D8]">
                  {vocab.pos}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleSpeak(vocab.word)}
              disabled={isSpeaking}
              className="p-2 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#D1DDD3] text-[#3E4F42] shadow-2xs transition cursor-pointer"
              title="Phát âm từ vựng"
            >
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-[#A67C52]' : ''}`} />
            </button>
          </div>

          {/* Nghĩa tiếng Việt */}
          <div className="pt-1 border-t border-[#D1DDD3]/60">
            <span className="text-[10px] uppercase font-bold text-[#A67C52] tracking-wider block">
              Nghĩa tiếng Việt:
            </span>
            <p className="text-sm font-semibold text-[#24211E] mt-0.5 leading-snug">
              {vocab.meaning || vocab.vietnameseMeaning}
            </p>
          </div>
        </div>

        {/* English Definition */}
        {vocab.definition && (
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#7A7369] tracking-wider block">
              English Definition:
            </span>
            <p className="text-xs text-[#24211E] italic leading-relaxed">
              "{vocab.definition}"
            </p>
          </div>
        )}

        {/* Ngữ cảnh trong bài đọc (Context sentence) */}
        {vocab.contextSentence && (
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#3E4F42] tracking-wider flex items-center gap-1">
              <span>📖</span> Ngữ cảnh trong bài đọc:
            </span>
            <p className="text-xs font-serif text-[#24211E] leading-relaxed pl-2 border-l-2 border-[#3E4F42] italic">
              "{vocab.contextSentence}"
            </p>
          </div>
        )}

        {/* Collocations */}
        {vocab.collocations && vocab.collocations.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#7A7369] tracking-wider block">
              Cụm từ đi kèm (Collocations C1/C2):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {vocab.collocations.map((col, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-lg bg-white border border-[#E6E2D8] text-[11px] font-medium text-[#3E4F42] shadow-2xs"
                >
                  • {col}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Từ đồng nghĩa (Synonyms) */}
        {vocab.synonyms && vocab.synonyms.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#7A7369] tracking-wider block">
              Từ đồng nghĩa học thuật (Synonyms):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {vocab.synonyms.map((syn, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSearchWord && onSearchWord(syn)}
                  className="px-2 py-0.5 rounded-md bg-[#FAF5EE] hover:bg-[#F3EADF] border border-[#E6E2D8] text-[11px] font-mono text-[#A67C52] transition cursor-pointer"
                  title={`Tra cứu "${syn}"`}
                >
                  {syn}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-[#E6E2D8] bg-[#FAF8F5] shrink-0 space-y-2">
        <button
          type="button"
          onClick={handleSaveToFlashcard}
          disabled={isSavedToFlashcard}
          className={`w-full py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs ${
            isSavedToFlashcard
              ? "bg-[#3E4F42] text-white"
              : "bg-white hover:bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3]"
          }`}
        >
          {isSavedToFlashcard ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Đã lưu vào Flashcards!</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Lưu vào Flashcard để ôn tập</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
