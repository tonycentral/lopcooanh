// src/components/listening/ListeningWorkspace.jsx
import React, { useState, useRef } from 'react';
import { 
  Headphones, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Award,
  ChevronRight
} from 'lucide-react';
import { IELTS_LISTENING_TESTS } from '../../data/listeningData';

export default function ListeningWorkspace() {
  const [selectedTest, setSelectedTest] = useState(IELTS_LISTENING_TESTS[0]);
  const [selectedSectionIdx, setSelectedSectionIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [gradedResults, setGradedResults] = useState(null);

  const currentSection = selectedTest.sections[selectedSectionIdx] || selectedTest.sections[0];

  // Web Speech audio playback simulation
  const handleTogglePlay = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentSection.audioScript);
      utterance.lang = 'en-GB';
      utterance.rate = playbackRate;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleStopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const handleGradeSection = () => {
    let score = 0;
    const details = {};

    currentSection.questions.forEach((q) => {
      const userVal = (userAnswers[q.id] || "").trim().toLowerCase();
      const correctVal = q.answer.trim().toLowerCase();
      const isCorrect = userVal === correctVal;
      if (isCorrect) score += 1;
      details[q.id] = {
        isCorrect,
        expected: q.answer,
        explanation: q.explanation
      };
    });

    setGradedResults({
      score,
      total: currentSection.questions.length,
      details
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#F8F6F1] text-[#24211E] overflow-hidden select-none">
      
      {/* Top Banner & Audio Control Bar */}
      <div className="bg-white border-b border-[#E6E2D8] px-4 sm:px-6 py-3 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] flex items-center justify-center font-bold text-sm shadow-2xs">
            <Headphones className="w-5 h-5 text-[#3E4F42]" />
          </div>
          <div>
            <h1 className="font-title font-bold text-base sm:text-lg text-[#24211E] leading-tight">
              Luyện Nghe IELTS (IELTS Listening Academic)
            </h1>
            <p className="text-xs text-[#7A7369] mt-0.5">
              {selectedTest.title} • {currentSection.title}
            </p>
          </div>
        </div>

        {/* Audio Player Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] gap-1 text-xs">
            <button
              type="button"
              onClick={handleTogglePlay}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                isPlaying 
                  ? "bg-amber-600 text-white shadow-xs" 
                  : "bg-[#3E4F42] hover:bg-[#334237] text-white shadow-xs"
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? "Tạm dừng" : "Phát Audio"}</span>
            </button>

            <button
              type="button"
              onClick={handleStopAudio}
              className="p-1.5 rounded-lg text-[#7A7369] hover:text-[#24211E] hover:bg-white transition cursor-pointer"
              title="Dừng lại"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Playback speed selector */}
            <select
              value={playbackRate}
              onChange={(e) => {
                const newRate = parseFloat(e.target.value);
                setPlaybackRate(newRate);
                if (isPlaying) {
                  handleStopAudio();
                }
              }}
              className="bg-transparent text-[11px] font-mono text-[#7A7369] outline-none cursor-pointer px-1 font-bold"
            >
              <option value="0.8">0.8x</option>
              <option value="1.0">1.0x</option>
              <option value="1.2">1.2x</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowTranscript(prev => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
              showTranscript 
                ? "bg-[#EDF3EE] text-[#3E4F42] border-[#D1DDD3]" 
                : "bg-white text-[#7A7369] border-[#E6E2D8] hover:text-[#24211E]"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{showTranscript ? "Ẩn Transcript" : "Xem Transcript"}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 p-3 sm:p-4 overflow-hidden">
        
        {/* Left Col: Bảng câu hỏi tương tác (7 cols) */}
        <div className="md:col-span-7 h-full bg-white border border-[#E6E2D8] rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-xs">
          
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 scrollbar-thin">
            <div className="pb-2.5 border-b border-[#E6E2D8]">
              <div className="text-xs font-bold text-[#A67C52] uppercase tracking-wider">
                {currentSection.title}
              </div>
              <p className="text-xs text-[#7A7369] mt-0.5">
                {currentSection.context}
              </p>
            </div>

            {/* Questions List */}
            <div className="space-y-3.5">
              {currentSection.questions.map((q, idx) => {
                const res = gradedResults?.details?.[q.id];
                return (
                  <div key={q.id} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-2">
                    <div className="text-xs font-bold text-[#24211E]">
                      {q.label}
                    </div>

                    {q.type === 'fill' ? (
                      <input
                        type="text"
                        value={userAnswers[q.id] || ""}
                        onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                        placeholder="Điền từ cần điền vào đây..."
                        className="w-full bg-white border border-[#E6E2D8] rounded-xl px-3 py-1.5 text-xs text-[#24211E] outline-none focus:border-[#3E4F42] transition"
                      />
                    ) : (
                      <div className="space-y-1">
                        {q.options?.map((opt, oIdx) => {
                          const optKey = opt.charAt(0);
                          const isChosen = userAnswers[q.id] === optKey;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => setUserAnswers({ ...userAnswers, [q.id]: optKey })}
                              className={`w-full text-left p-2 rounded-lg text-xs transition cursor-pointer border ${
                                isChosen 
                                  ? "bg-[#EDF3EE] text-[#3E4F42] border-[#D1DDD3] font-bold" 
                                  : "bg-white hover:bg-[#FAF8F5] text-[#24211E] border-[#E6E2D8]"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Graded Result & Proof */}
                    {res && (
                      <div className={`p-2 rounded-lg text-xs border animate-fadeIn ${
                        res.isCorrect ? "bg-[#EDF3EE] border-[#D1DDD3] text-[#3E4F42]" : "bg-[#FAF5EE] border-[#E6E2D8] text-[#A67C52]"
                      }`}>
                        <div className="font-bold flex items-center gap-1">
                          {res.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                          <span>Đáp án chuẩn: <strong>{res.expected}</strong></span>
                        </div>
                        <div className="text-[11px] text-[#7A7369] mt-0.5">
                          💡 Giải thích: {res.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions: Nộp bài chấm điểm */}
          <div className="pt-3 border-t border-[#E6E2D8] flex items-center justify-between gap-3 shrink-0">
            {gradedResults ? (
              <div className="text-xs font-bold text-[#3E4F42] flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>Kết quả: {gradedResults.score} / {gradedResults.total} câu đúng</span>
              </div>
            ) : (
              <span className="text-[11px] text-[#7A7369]">
                Lắng nghe audio kỹ và điền đáp án trước khi bấm nộp bài
              </span>
            )}

            <button
              type="button"
              onClick={handleGradeSection}
              className="py-2 px-5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-bold text-xs transition cursor-pointer shadow-xs"
            >
              Nộp bài &amp; Chấm điểm
            </button>
          </div>

        </div>

        {/* Right Col: Audio Transcript hoặc Danh mục Sections (5 cols) */}
        <div className="md:col-span-5 h-full bg-white border border-[#E6E2D8] rounded-2xl p-4 flex flex-col overflow-hidden shadow-xs">
          <div className="pb-2.5 border-b border-[#E6E2D8] flex items-center justify-between shrink-0">
            <span className="text-xs font-bold text-[#A67C52] uppercase tracking-wider">
              {showTranscript ? "Audio Script & Tra từ vựng" : "Chọn Section nghe"}
            </span>
            <span className="text-[10px] font-mono text-[#7A7369]">
              Cambridge Listening
            </span>
          </div>

          {showTranscript ? (
            <div className="flex-1 min-h-0 overflow-y-auto py-2 pr-1 space-y-2 text-xs leading-relaxed font-sans text-[#24211E] scrollbar-thin select-text">
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E6E2D8] whitespace-pre-line font-mono text-[11px]">
                {currentSection.audioScript}
              </div>
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto py-2 space-y-2 scrollbar-thin">
              {selectedTest.sections.map((sec, idx) => {
                const isSelected = idx === selectedSectionIdx;
                return (
                  <button
                    key={sec.sectionNumber}
                    type="button"
                    onClick={() => {
                      handleStopAudio();
                      setSelectedSectionIdx(idx);
                      setGradedResults(null);
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                      isSelected 
                        ? "bg-[#EDF3EE] border-[#3E4F42] shadow-xs ring-1 ring-[#3E4F42]" 
                        : "bg-[#FAF8F5] hover:bg-white border-[#E6E2D8]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#24211E]">
                        {sec.title}
                      </span>
                      <span className="text-[10px] font-mono text-[#3E4F42] font-bold">
                        {sec.questions.length} câu
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A7369] line-clamp-2">
                      {sec.context}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
