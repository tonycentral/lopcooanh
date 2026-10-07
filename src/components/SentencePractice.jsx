import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Send, 
  RefreshCw, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  BarChart3, 
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  evaluateComprehensionTest, 
  evaluatePart2Translation, 
  evaluatePart3Translation 
} from '../services/evaluator';
import { evaluateWithGemini } from '../services/geminiService';
import { saveHistoryEntry } from '../services/storage';

/**
 * Component hiển thị chi tiết các phần nâng cấp:
 * Phân tích chuyên sâu từ vựng & cụm từ (IPA, từ loại, ngữ nghĩa, từ cơ bản thay thế),
 * ngữ pháp học thuật và kỹ thuật chuyển câu.
 */
function UpgradeDetailsBreakdown({ result, targetBand, isPart3 = false }) {
  if (!result) return null;
  const analysis = result.detailedAnalysis;
  const upgradeDetails = result.upgradeDetails || [];

  return (
    <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3.5 animate-fadeIn">
      
      {/* Title Ribbon */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <span className="text-xs font-black text-slate-200 flex items-center gap-1.5 uppercase tracking-wide">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          Chi tiết các phần nâng cấp chuẩn Band {targetBand}:
        </span>
        <span className="text-[10px] text-blue-300 bg-blue-500/10 px-2.5 py-0.5 rounded-full font-mono border border-blue-500/20 font-bold">
          {isPart3 ? "Cohesion & Lexical Breakdown" : "Lexical & Grammar Breakdown"}
        </span>
      </div>

      {/* 1. CHI TIẾT TỪ VỰNG & CỤM TỪ NÂNG CẤP (Kèm Phiên âm IPA & Ngữ nghĩa) */}
      {analysis?.vocabularyList && analysis.vocabularyList.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>📖</span> Từ vựng &amp; Cụm từ học thuật trong câu:
            </span>
            <span className="text-[10px] text-slate-400 italic">
              (Bao gồm phiên âm IPA &amp; giải nghĩa chi tiết)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {analysis.vocabularyList.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between gap-1.5 transition ${
                  item.isTarget 
                    ? "bg-blue-950/50 border-blue-500/50 ring-1 ring-blue-500/30" 
                    : "bg-slate-900/80 border-slate-800/90 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-1 flex-wrap">
                    <span className="font-black text-white text-sm tracking-tight">{item.word}</span>
                    <span className="text-[11px] font-mono text-blue-300 font-bold italic">{item.ipa}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400 px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700/60 font-mono">
                      {item.pos}
                    </span>
                    {item.isTarget && (
                      <span className="text-[9px] uppercase font-black text-blue-300 bg-blue-500/20 px-1.5 py-0.2 rounded border border-blue-500/40">
                        Từ đang luyện
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-slate-200 leading-relaxed font-sans">
                  <strong className="text-slate-300 font-bold">Nghĩa:</strong> {item.meaning}
                </div>

                {item.replaces && (
                  <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1 flex items-start gap-1">
                    <span className="text-emerald-400 font-bold shrink-0">🔄 Nâng cấp từ:</span>
                    <span className="italic text-slate-300">{item.replaces}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* 2. ĐIỂM SÁNG NGỮ PHÁP (Grammar Highlights) */}
      {analysis?.grammarPoints && analysis.grammarPoints.length > 0 && (
        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1.5 text-xs">
          <span className="font-bold text-blue-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <span>⚙️</span> Điểm sáng ngữ pháp (Grammar Architecture):
          </span>
          {analysis.grammarPoints.map((g, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="font-semibold text-slate-200">
                • <strong className="text-white">{g.title}:</strong>{" "}
                <code className="text-[10px] text-blue-300 bg-slate-950 px-1.5 py-0.5 rounded border border-blue-900/40 font-mono font-bold">
                  {g.formula}
                </code>
              </div>
              <p className="text-[11px] text-slate-400 pl-3 leading-relaxed">{g.detail}</p>
            </div>
          ))}
        </div>
      )}

      {/* 3. KỸ THUẬT CHUYỂN CÂU & MẠCH LẠC (Cohesion - Part 3) */}
      {analysis?.cohesionPoints && analysis.cohesionPoints.length > 0 && (
        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1.5 text-xs">
          <span className="font-bold text-sky-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <span>🔗</span> Kỹ thuật chuyển câu &amp; Mạch lạc (Cohesion &amp; Logic Transition):
          </span>
          {analysis.cohesionPoints.map((c, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="font-semibold text-slate-200 flex items-baseline gap-1.5 flex-wrap">
                <span>•</span>
                <strong className="text-white">{c.marker}</strong>
                <span className="text-[10px] font-mono text-sky-300 italic font-bold">{c.ipa}</span>
                <span className="text-[10px] text-slate-400">({c.type})</span>
              </div>
              <p className="text-[11px] text-slate-400 pl-3 leading-relaxed">{c.detail}</p>
            </div>
          ))}
        </div>
      )}

      {/* Fallback to text list if no detailedAnalysis */}
      {(!analysis || !analysis.vocabularyList) && upgradeDetails && upgradeDetails.length > 0 && (
        <ul className="space-y-1.5 text-xs text-slate-300">
          {upgradeDetails.map((detail, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-blue-400 font-bold">•</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}

export default function SentencePractice({ 
  topic, 
  targetBand = "7.0", 
  selectedVocab, 
  apiKey,
  studentEmail,
  activeTask,
  onOpenChartModal,
  onSentenceGraded 
}) {
  // 3-Part State: 1 = Hiểu từ, 2 = Dịch 1 câu, 3 = Dịch 2 câu & Chuyển câu
  const [activePart, setActivePart] = useState(1);

  // ================= STATE CHO PHẦN 1: CHẤM ĐIỂM HIỂU TỪ =================
  const [quizSelectedIndex, setQuizSelectedIndex] = useState(null);
  const [synonymInput, setSynonymInput] = useState("");
  const [part1Result, setPart1Result] = useState(null);

  // ================= STATE CHO PHẦN 2: DỊCH 1 CÂU =================
  const [part2Input, setPart2Input] = useState("");
  const [isEvaluatingPart2, setIsEvaluatingPart2] = useState(false);
  const [part2Result, setPart2Result] = useState(null);

  // ================= STATE CHO PHẦN 3: DỊCH 2 CÂU & CHUYỂN CÂU =================
  const [part3Input, setPart3Input] = useState("");
  const [isEvaluatingPart3, setIsEvaluatingPart3] = useState(false);
  const [part3Result, setPart3Result] = useState(null);

  // Copy status
  const [copiedKey, setCopiedKey] = useState(null);

  // Reset when selected vocabulary changes
  useEffect(() => {
    setQuizSelectedIndex(null);
    setSynonymInput("");
    setPart1Result(null);

    setPart2Input("");
    setIsEvaluatingPart2(false);
    setPart2Result(null);

    setPart3Input("");
    setIsEvaluatingPart3(false);
    setPart3Result(null);

    setActivePart(1);
  }, [selectedVocab]);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  // ---------------- HANDLER PHẦN 1: CHẤM ĐIỂM HIỂU TỪ ----------------
  const handleGradePart1 = () => {
    if (!selectedVocab) return;
    const res = evaluateComprehensionTest(selectedVocab, {
      selectedOptionIndex: quizSelectedIndex,
      synonymInput: synonymInput
    });
    setPart1Result(res);

    if (res.isCorrect) {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    }
  };

  // ---------------- HANDLER PHẦN 2: DỊCH 1 CÂU ----------------
  const handleGradePart2 = async () => {
    if (!selectedVocab || !part2Input.trim()) return;
    setIsEvaluatingPart2(true);

    try {
      let res = evaluatePart2Translation(part2Input, selectedVocab, targetBand);

      // Nếu người dùng cấu hình API Key trong Cài đặt, có thể tận dụng chấm điểm từ AI Examiner
      if (apiKey) {
        try {
          const aiRes = await evaluateWithGemini("translation_single", {
            targetBand,
            targetWord: selectedVocab.word,
            synonyms: selectedVocab.synonyms,
            topicName: topic?.name,
            vietnamesePrompt: sentencePracticeData.vietnamesePrompt,
            modelSentence: sentencePracticeData.modelTranslation,
            studentSentence: part2Input
          }, apiKey);

          if (aiRes && aiRes.scores) {
            res = {
              ...res,
              scores: aiRes.scores,
              isTargetMet: (aiRes.scores.overallBand || 0) >= parseFloat(targetBand),
              upgradedSentence: aiRes.upgradedSentence || res.upgradedSentence,
              strengths: aiRes.strengths?.length ? aiRes.strengths : res.strengths,
              improvements: aiRes.improvements?.length ? aiRes.improvements : res.improvements,
              isAiGraded: true
            };
          }
        } catch (aiErr) {
          console.warn("Lỗi gọi Gemini AI, tự động chuyển về bộ chấm NLP ngoại tuyến:", aiErr);
        }
      }

      setPart2Result(res);

      if (res.isTargetMet) {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
      }

      // Save to history
      saveHistoryEntry({
        studentEmail,
        type: "translation_single",
        topicName: topic?.name,
        targetWord: selectedVocab.word,
        userSentence: part2Input,
        scores: res.scores,
        targetBand,
        isTargetMet: res.isTargetMet
      });

      if (onSentenceGraded) onSentenceGraded();
    } finally {
      setIsEvaluatingPart2(false);
    }
  };

  // ---------------- HANDLER PHẦN 3: DỊCH 2 CÂU & CHUYỂN CÂU ----------------
  const handleGradePart3 = () => {
    if (!selectedVocab || !part3Input.trim()) return;
    setIsEvaluatingPart3(true);

    try {
      const res = evaluatePart3Translation(part3Input, selectedVocab, targetBand);
      setPart3Result(res);

      if (res.isTargetMet) {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      }

      // Save to history
      saveHistoryEntry({
        studentEmail,
        type: "translation_two_sentences_cohesion",
        topicName: topic?.name,
        targetWord: selectedVocab.word,
        userSentence: part3Input,
        scores: res.scores,
        targetBand,
        isTargetMet: res.isTargetMet
      });

      if (onSentenceGraded) onSentenceGraded();
    } finally {
      setIsEvaluatingPart3(false);
    }
  };

  const insertText = (text, partNum) => {
    if (partNum === 2) {
      setPart2Input(prev => prev ? `${prev} ${text}` : text);
    } else if (partNum === 3) {
      setPart3Input(prev => prev ? `${prev} ${text}` : text);
    }
  };

  if (!selectedVocab) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-900/60 rounded-2xl border border-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Chưa chọn từ vựng luyện tập</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Hãy chọn một từ vựng ở danh sách bên cạnh và nhấn nút "Luyện tập" để bắt đầu quy trình học 3 phần chuẩn Band mục tiêu!
          </p>
        </div>
      </div>
    );
  }

  // Pre-extracted data from enriched vocabulary
  const quiz = selectedVocab.vietnameseQuiz || {
    question: `Nghĩa tiếng Việt chuẩn xác nhất của "${selectedVocab.word}" là gì?`,
    options: [selectedVocab.meaning, "Làm gia tăng rủi ro", "Giữ nguyên trạng thái", "Bỏ qua vấn đề"],
    correctIndex: 0
  };

  const sentencePracticeData = selectedVocab.sentencePractice || {};
  const twoSentencePracticeData = selectedVocab.twoSentencePractice || {};

  return (
    <div className="space-y-4">
      
      {/* Target Word Overview Ribbon */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-[10px] uppercase font-black text-blue-400 tracking-wider bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
            Từ Đang Luyện
          </span>
          <span className="text-lg font-black text-white">{selectedVocab.word}</span>
          {selectedVocab.ipa && (
            <span className="text-xs font-mono text-blue-300 italic font-bold">
              {selectedVocab.ipa}
            </span>
          )}
          <span className="text-xs text-slate-400">({selectedVocab.partOfSpeech})</span>
        </div>

        {/* Quick action: Xem Bar Chart if Task 1 */}
        {activeTask === 'task1' && onOpenChartModal && (
          <button
            type="button"
            onClick={onOpenChartModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition cursor-pointer self-start sm:self-auto"
            title="Xem bảng số liệu biểu đồ Task 1"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Xem Bar Chart</span>
          </button>
        )}
      </div>

      {/* 3-Part Navigation Switcher */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
        {/* Tab Phần 1 */}
        <button
          onClick={() => setActivePart(1)}
          className={`py-2 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
            activePart === 1
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-black shrink-0">1</span>
          <span className="truncate">Hiểu từ</span>
          {part1Result && part1Result.isCorrect && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          )}
        </button>

        {/* Tab Phần 2 */}
        <button
          onClick={() => setActivePart(2)}
          className={`py-2 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
            activePart === 2
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-black shrink-0">2</span>
          <span className="truncate">Dịch 1 câu</span>
          {part2Result && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          )}
        </button>

        {/* Tab Phần 3 */}
        <button
          onClick={() => setActivePart(3)}
          className={`py-2 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
            activePart === 3
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-black shrink-0">3</span>
          <span className="truncate">Dịch 2 câu & Chuyển</span>
          {part3Result && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ==================== PHẦN 1: CHẤM ĐIỂM HIỂU TỪ VỰNG ===================== */}
      {/* ========================================================================= */}
      {activePart === 1 && (
        <div className="space-y-4 animate-fadeIn">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-blue-400 font-extrabold text-xs sm:text-sm">
                <HelpCircle className="w-4 h-4" />
                <span>Phần 1: Chấm điểm hiểu từ "{selectedVocab.word}"</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                Trắc nghiệm nghĩa HOẶC điền từ đồng nghĩa
              </span>
            </div>

            {/* Lựa chọn A: Trắc nghiệm nghĩa tiếng Việt */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>Cách 1: Chọn nghĩa tiếng Việt chính xác của</span>
                <span className="text-blue-400 font-extrabold underline">{selectedVocab.word}</span>:
              </label>

              <div className="grid grid-cols-1 gap-2">
                {quiz.options.map((option, idx) => {
                  const isChecked = quizSelectedIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setQuizSelectedIndex(idx);
                        setSynonymInput(""); // clear synonym if quiz picked
                      }}
                      className={`p-3 rounded-xl text-xs text-left transition border cursor-pointer flex items-center justify-between gap-2 ${
                        isChecked
                          ? "bg-blue-600/20 border-blue-500 text-white font-bold ring-1 ring-blue-400"
                          : "bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300"
                      }`}
                    >
                      <span className="flex-1">{String.fromCharCode(65 + idx)}. {option}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lựa chọn B: Điền từ đồng nghĩa tiếng Anh */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>Cách 2: HOẶC điền 1 từ đồng nghĩa (synonym) tiếng Anh của</span>
                <span className="text-blue-400 font-extrabold">{selectedVocab.word}</span>:
              </label>
              
              <input
                type="text"
                value={synonymInput}
                onChange={(e) => {
                  setSynonymInput(e.target.value);
                  setQuizSelectedIndex(null); // clear quiz if typing synonym
                }}
                placeholder={`Ví dụ: ${selectedVocab.synonyms?.[0] || "alleviate"}, ${selectedVocab.synonyms?.[1] || "lessen"}...`}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            {/* Nút bấm chấm điểm hiểu từ */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setQuizSelectedIndex(null);
                  setSynonymInput("");
                  setPart1Result(null);
                }}
                className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                Làm lại
              </button>

              <button
                type="button"
                onClick={handleGradePart1}
                disabled={quizSelectedIndex === null && !synonymInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chấm điểm hiểu từ</span>
              </button>
            </div>
          </div>

          {/* KẾT QUẢ CHẤM ĐIỂM HIỂU TỪ */}
          {part1Result && (
            <div className={`p-4 rounded-2xl border space-y-3 animate-fadeIn ${
              part1Result.isCorrect
                ? "bg-emerald-950/30 border-emerald-500/40"
                : "bg-amber-950/30 border-amber-500/40"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {part1Result.isCorrect ? (
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {part1Result.isCorrect ? "Đạt chuẩn hiểu từ: 100% (Band 8.0+)" : "Cần lưu ý lại nghĩa của từ (40%)"}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">{part1Result.feedbackMessage}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePart(2)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <span>Sang Phần 2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Collocations & Synonyms gợi ý nâng cao */}
              {selectedVocab.collocations && selectedVocab.collocations.length > 0 && (
                <div className="pt-2 border-t border-slate-800 text-xs space-y-1">
                  <span className="text-slate-400 font-semibold">Cụm từ học thuật đi kèm (Collocations):</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedVocab.collocations.map((col, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800/80 text-blue-300 text-[11px] font-mono">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* ==================== PHẦN 2: DỊCH 1 CÂU CÓ DÙNG TỪ ====================== */}
      {/* ========================================================================= */}
      {activePart === 2 && (
        <div className="space-y-4 animate-fadeIn">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5 shadow-lg">
            
            {/* Header Phần 2 */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-blue-400 font-extrabold text-xs sm:text-sm">
                <BookOpen className="w-4 h-4" />
                <span>Phần 2: Dịch câu mẫu sang tiếng Anh</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                Mục tiêu: Band {targetBand}
              </span>
            </div>

            {/* Câu tiếng Việt mẫu do Web đưa ra */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-500/30 space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">
                🇻🇳 Câu Tiếng Việt Cần Dịch:
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed select-text">
                "{sentencePracticeData.vietnamesePrompt}"
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400">Bắt buộc dùng từ:</span>
                <button
                  type="button"
                  onClick={() => insertText(selectedVocab.word, 2)}
                  className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-xs font-mono font-bold hover:bg-blue-500/30 transition cursor-pointer"
                  title="Nhấn để chèn từ này vào ô dịch"
                >
                  + {selectedVocab.word}
                </button>
              </div>
            </div>

            {/* Khung nhập câu dịch tiếng Anh */}
            <div className="relative">
              <textarea
                rows={3}
                value={part2Input}
                onChange={(e) => setPart2Input(e.target.value)}
                placeholder={`Dịch câu trên sang tiếng Anh có sử dụng từ "${selectedVocab.word}"...`}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs sm:text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-y leading-relaxed"
              />
              <div className="absolute right-2.5 bottom-2.5 text-[10px] text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded">
                {part2Input.split(/\s+/).filter(Boolean).length} từ
              </div>
            </div>

            {/* Gợi ý từ đồng nghĩa chèn nhanh */}
            {selectedVocab.synonyms && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px]">Từ đồng nghĩa có thể dùng:</span>
                {selectedVocab.synonyms.map((syn, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => insertText(syn, 2)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 text-[11px] font-mono transition cursor-pointer"
                  >
                    + {syn}
                  </button>
                ))}
              </div>
            )}

            {/* Nút hành động */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setPart2Input("")}
                className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                Xóa làm lại
              </button>

              <button
                type="button"
                onClick={handleGradePart2}
                disabled={isEvaluatingPart2 || !part2Input.trim()}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {isEvaluatingPart2 ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang chấm điểm...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Chấm điểm & Nâng cấp câu</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* KẾT QUẢ CHẤM ĐIỂM & CÂU NÂNG CẤP ĐÚNG SỐ BAND (PHẦN 2) */}
          {part2Result && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-blue-500/40 shadow-xl space-y-4 animate-fadeIn">
              
              {/* Header Điểm */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black ${
                    part2Result.isTargetMet
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                  }`}>
                    <span className="text-[9px] uppercase tracking-wider opacity-80">BAND</span>
                    <span className="text-xl leading-none">{part2Result.scores?.overallBand}</span>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {part2Result.isTargetMet ? "Đạt chuẩn mục tiêu!" : "Cần hoàn thiện thêm để chạm Band mục tiêu"}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Lexical: {part2Result.scores?.lexicalResource} • Grammar: {part2Result.scores?.grammarRange}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePart(3)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-600/25"
                >
                  <span>Tiếp tục Phần 3</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* CÂU NÂNG CẤP ĐÚNG THEO BAND MỤC TIÊU */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>CÂU NÂNG CẤP CHUẨN BAND {targetBand}:</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(part2Result.upgradedSentence, "part2_upgraded")}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition cursor-pointer"
                  >
                    {copiedKey === "part2_upgraded" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === "part2_upgraded" ? "Đã copy" : "Copy câu"}</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-mono text-emerald-300 italic font-semibold leading-relaxed">
                  "{part2Result.upgradedSentence}"
                </p>
              </div>

              {/* CHI TIẾT CÁC PHẦN NÂNG CẤP */}
              <UpgradeDetailsBreakdown result={part2Result} targetBand={targetBand} isPart3={false} />

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* ==================== PHẦN 3: DỊCH 2 CÂU CÓ DÙNG CHUYỂN CÂU ============== */}
      {/* ========================================================================= */}
      {activePart === 3 && (
        <div className="space-y-4 animate-fadeIn">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-blue-500/30 space-y-3.5 shadow-lg">
            
            {/* Header Phần 3 */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-blue-400 font-extrabold text-xs sm:text-sm">
                <Layers className="w-4 h-4" />
                <span>Phần 3: Dịch 2 câu & Chuyển câu (Cohesion)</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                Mục tiêu: Band {targetBand}
              </span>
            </div>

            {/* Đoạn 2 câu tiếng Việt mẫu do Web đưa ra */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-500/30 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">
                🇻🇳 Đoạn 2 Câu Tiếng Việt Cần Dịch &amp; Móc Nối:
              </span>
              
              <div className="space-y-1 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                <p>
                  <strong className="text-blue-300 font-bold">Câu 1:</strong> "{twoSentencePracticeData.sentence1Vietnamese}"
                </p>
                <p>
                  <strong className="text-blue-400 font-bold">Câu 2 (Chuyển câu):</strong> "{twoSentencePracticeData.sentence2Vietnamese}"
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[11px] text-slate-400">Bắt buộc dùng từ:</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">
                  {selectedVocab.word}
                </span>
              </div>
            </div>

            {/* Gợi ý liên từ chuyển câu (Cohesion) chèn nhanh */}
            {twoSentencePracticeData.linkingSuggestions && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-400" /> Nhấn để chèn liên từ chuyển câu:
                </span>
                {twoSentencePracticeData.linkingSuggestions.map((link, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => insertText(link, 3)}
                    className="px-2 py-0.5 rounded bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-[11px] font-mono transition cursor-pointer"
                  >
                    + {link}
                  </button>
                ))}
              </div>
            )}

            {/* Khung nhập bài dịch 2 câu tiếng Anh */}
            <div className="relative">
              <textarea
                rows={4}
                value={part3Input}
                onChange={(e) => setPart3Input(e.target.value)}
                placeholder={`Dịch cả 2 câu trên sang tiếng Anh, dùng từ "${selectedVocab.word}" và liên từ chuyển câu học thuật (ví dụ: Consequently, Therefore...)...`}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs sm:text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-y leading-relaxed"
              />
              <div className="absolute right-2.5 bottom-2.5 text-[10px] text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded">
                {part3Input.split(/\s+/).filter(Boolean).length} từ
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setPart3Input("")}
                className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                Xóa làm lại
              </button>

              <button
                type="button"
                onClick={handleGradePart3}
                disabled={isEvaluatingPart3 || !part3Input.trim()}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {isEvaluatingPart3 ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang chấm điểm...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Chấm điểm Cohesion & Nâng cấp</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* KẾT QUẢ CHẤM ĐIỂM & CẶP CÂU NÂNG CẤP ĐÚNG SỐ BAND (PHẦN 3) */}
          {part3Result && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-blue-500/40 shadow-xl space-y-4 animate-fadeIn">
              
              {/* Header Điểm */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black ${
                    part3Result.isTargetMet
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                  }`}>
                    <span className="text-[9px] uppercase tracking-wider opacity-80">BAND</span>
                    <span className="text-xl leading-none">{part3Result.scores?.overallBand}</span>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {part3Result.isTargetMet ? "Tuyệt vời! Đạt chuẩn Coherence & Cohesion" : "Hoàn thành bài tập chuyển câu"}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Cohesion: {part3Result.scores?.coherenceCohesion} • Lexical: {part3Result.scores?.lexicalResource} • Grammar: {part3Result.scores?.grammarRange}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                  Đã lưu lịch sử
                </span>
              </div>

              {/* CẶP CÂU NÂNG CẤP ĐÚNG THEO BAND MỤC TIÊU */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>CẶP CÂU NÂNG CẤP CHUẨN BAND {targetBand}:</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(part3Result.upgradedPair, "part3_upgraded")}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition cursor-pointer"
                  >
                    {copiedKey === "part3_upgraded" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === "part3_upgraded" ? "Đã copy" : "Copy cặp câu"}</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-mono text-emerald-300 italic font-semibold leading-relaxed">
                  "{part3Result.upgradedPair}"
                </p>
              </div>

              {/* CHI TIẾT CÁC PHẦN NÂNG CẤP */}
              <UpgradeDetailsBreakdown result={part3Result} targetBand={targetBand} isPart3={true} />

            </div>
          )}

        </div>
      )}

    </div>
  );
}
