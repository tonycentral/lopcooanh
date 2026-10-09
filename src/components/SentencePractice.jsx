import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Check,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  evaluateComprehensionMeaning, 
  evaluatePart2Translation, 
  evaluatePart3Translation
} from '../services/evaluator';
import { evaluateWithGemini } from '../services/geminiService';
import { analyzeUpgradeDetails } from '../services/upgradeDetailHelper';
import { saveHistoryEntry } from '../services/storage';

const AVAILABLE_BANDS = ["6.5", "7.0", "7.5", "8.0", "8.5"];

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
    <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-3.5 animate-fadeIn text-[#24211E]">
      
      {/* Title Ribbon */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E6E2D8]">
        <span className="text-xs font-black text-[#24211E] flex items-center gap-1.5 uppercase tracking-wide">
          <Lightbulb className="w-4 h-4 text-[#A67C52]" />
          Chi tiết các phần nâng cấp chuẩn Band {targetBand}:
        </span>
        <span className="text-[10px] text-[#3E4F42] bg-[#EDF3EE] px-2.5 py-0.5 rounded-full font-mono border border-[#D1DDD3] font-bold">
          {isPart3 ? "Cohesion & Lexical Breakdown" : "Lexical & Grammar Breakdown"}
        </span>
      </div>

      {/* 1. CHI TIẾT TỪ VỰNG & CỤM TỪ NÂNG CẤP (Kèm Phiên âm IPA & Ngữ nghĩa) */}
      {analysis?.vocabularyList && analysis.vocabularyList.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#3E4F42] uppercase tracking-wider flex items-center gap-1.5">
              <span>📖</span> Từ vựng &amp; Cụm từ học thuật trong câu:
            </span>
            <span className="text-[10px] text-[#7A7369] italic">
              (Bao gồm phiên âm IPA &amp; giải nghĩa chi tiết)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {analysis.vocabularyList.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between gap-1.5 transition ${
                  item.isTarget 
                    ? "bg-[#EDF3EE]/60 border-[#D1DDD3] ring-1 ring-[#D1DDD3]" 
                    : "bg-white border-[#E6E2D8] hover:border-[#D1DDD3]"
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-1 flex-wrap">
                    <span className="font-black text-[#24211E] text-sm tracking-tight">{item.word}</span>
                    <span className="text-[11px] font-mono text-[#3E4F42] font-bold italic">{item.ipa}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] uppercase font-bold text-[#7A7369] px-1.5 py-0.2 rounded bg-[#F4EFEA] border border-[#E6E2D8] font-mono">
                      {item.pos}
                    </span>
                    {item.isTarget && (
                      <span className="text-[9px] uppercase font-black text-[#3E4F42] bg-[#EDF3EE] px-1.5 py-0.2 rounded border border-[#D1DDD3]">
                        Từ đang luyện
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-[#24211E] leading-relaxed font-sans">
                  <strong className="text-[#7A7369] font-bold">Nghĩa:</strong> {item.meaning}
                </div>

                {item.replaces && (
                  <div className="text-[10px] text-[#7A7369] border-t border-[#E6E2D8] pt-1 flex items-start gap-1">
                    <span className="text-[#3E4F42] font-bold shrink-0">🔄 Nâng cấp từ:</span>
                    <span className="italic text-[#7A7369]">{item.replaces}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* 2. ĐIỂM SÁNG NGỮ PHÁP (Grammar Highlights) */}
      {analysis?.grammarPoints && analysis.grammarPoints.length > 0 && (
        <div className="p-3 rounded-xl bg-white border border-[#E6E2D8] space-y-1.5 text-xs shadow-xs">
          <span className="font-bold text-[#3E4F42] flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <span>⚙️</span> Điểm sáng ngữ pháp (Grammar Architecture):
          </span>
          {analysis.grammarPoints.map((g, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="font-semibold text-[#24211E]">
                • <strong className="text-[#24211E]">{g.title}:</strong>{" "}
                <code className="text-[10px] text-[#3E4F42] bg-[#EDF3EE] px-1.5 py-0.5 rounded border border-[#D1DDD3] font-mono font-bold">
                  {g.formula}
                </code>
              </div>
              <p className="text-[11px] text-[#7A7369] pl-3 leading-relaxed">{g.detail}</p>
            </div>
          ))}
        </div>
      )}

      {/* 3. KỸ THUẬT CHUYỂN CÂU & MẠCH LẠC (Cohesion - Part 3) */}
      {analysis?.cohesionPoints && analysis.cohesionPoints.length > 0 && (
        <div className="p-3 rounded-xl bg-white border border-[#E6E2D8] space-y-1.5 text-xs shadow-xs">
          <span className="font-bold text-[#A67C52] flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <span>🔗</span> Kỹ thuật chuyển câu &amp; Mạch lạc (Cohesion &amp; Logic Transition):
          </span>
          {analysis.cohesionPoints.map((c, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="font-semibold text-[#24211E] flex items-baseline gap-1.5 flex-wrap">
                <span>•</span>
                <strong className="text-[#24211E]">{c.marker}</strong>
                <span className="text-[10px] font-mono text-[#3E4F42] italic font-bold">{c.ipa}</span>
                <span className="text-[10px] text-[#7A7369]">({c.type})</span>
              </div>
              <p className="text-[11px] text-[#7A7369] pl-3 leading-relaxed">{c.detail}</p>
            </div>
          ))}
        </div>
      )}

      {/* Fallback to text list if no detailedAnalysis */}
      {(!analysis || !analysis.vocabularyList) && upgradeDetails && upgradeDetails.length > 0 && (
        <ul className="space-y-1.5 text-xs text-[#7A7369]">
          {upgradeDetails.map((detail, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-[#3E4F42] font-bold">•</span>
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
  activeTask = "task2",
  onOpenChartModal,
  onSentenceGraded,
  activePart: controlledActivePart,
  onPartChange
}) {
  // 3-Part State: 1 = Hiểu từ, 2 = Dịch 1 câu, 3 = Luyện viết đoạn văn
  const [internalActivePart, setInternalActivePart] = useState(1);
  const activePart = controlledActivePart !== undefined ? controlledActivePart : internalActivePart;
  const setActivePart = (newPart) => {
    setInternalActivePart(newPart);
    if (onPartChange) onPartChange(newPart);
  };

  // ================= STATE CHO PHẦN 1: ĐÁNH GIÁ NGHĨA TIẾNG VIỆT & TỪ ĐỒNG NGHĨA =================
  const [vietnameseMeaningInput, setVietnameseMeaningInput] = useState("");
  const [synonymInput, setSynonymInput] = useState("");
  const [isEvaluatingPart1, setIsEvaluatingPart1] = useState(false);
  const [part1Result, setPart1Result] = useState(null);

  // ================= STATE CHO PHẦN 2: DỊCH 1 CÂU =================
  const [part2Input, setPart2Input] = useState("");
  const [isEvaluatingPart2, setIsEvaluatingPart2] = useState(false);
  const [part2Result, setPart2Result] = useState(null);
  const [part2ViewBand, setPart2ViewBand] = useState(null);

  // ================= STATE CHO PHẦN 3: LUYỆN VIẾT ĐOẠN VĂN =================
  const [part3Input, setPart3Input] = useState("");
  const [isEvaluatingPart3, setIsEvaluatingPart3] = useState(false);
  const [part3Result, setPart3Result] = useState(null);
  const [part3ViewBand, setPart3ViewBand] = useState(null);

  // Copy status
  const [copiedKey, setCopiedKey] = useState(null);

  // Reset when selected vocabulary changes
  useEffect(() => {
    setVietnameseMeaningInput("");
    setSynonymInput("");
    setIsEvaluatingPart1(false);
    setPart1Result(null);

    setPart2Input("");
    setIsEvaluatingPart2(false);
    setPart2Result(null);
    setPart2ViewBand(null);

    setPart3Input("");
    setIsEvaluatingPart3(false);
    setPart3Result(null);
    setPart3ViewBand(null);

    setActivePart(1);
  }, [selectedVocab]);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  // ---------------- HANDLER PHẦN 1: ĐÁNH GIÁ NGHĨA TIẾNG VIỆT & TỪ ĐỒNG NGHĨA ----------------
  const handleGradePart1 = () => {
    if (!selectedVocab || (!vietnameseMeaningInput.trim() && !synonymInput.trim())) return;
    setIsEvaluatingPart1(true);
    try {
      const res = evaluateComprehensionMeaning(
        selectedVocab, 
        vietnameseMeaningInput.trim() || synonymInput.trim()
      );

      // Nếu có nhập thêm từ đồng nghĩa tiếng Anh, kiểm tra thêm độ chính xác
      if (synonymInput.trim() && selectedVocab.synonyms && selectedVocab.synonyms.length > 0) {
        const cleanSyn = synonymInput.trim().toLowerCase();
        const matchesSyn = selectedVocab.synonyms.some(s => s.toLowerCase() === cleanSyn || cleanSyn.includes(s.toLowerCase()));
        if (matchesSyn) {
          res.isSynonymCorrect = true;
          if (res.status === 'needs_review' && !vietnameseMeaningInput.trim()) {
            res.status = 'good';
            res.score = 80;
            res.isCorrect = true;
            res.feedbackMessage = `Chính xác! "${synonymInput.trim()}" là từ đồng nghĩa chuẩn của "${selectedVocab.word}".`;
          } else if (res.isCorrect) {
            res.feedbackMessage += ` Ngoài ra, từ đồng nghĩa "${synonymInput.trim()}" bạn điền rất chính xác!`;
          }
        } else {
          res.isSynonymCorrect = false;
        }
      }

      setPart1Result(res);

      if (res.isCorrect) {
        confetti({ particleCount: 35, spread: 65, origin: { y: 0.8 } });
      }
    } finally {
      setIsEvaluatingPart1(false);
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



  const sentencePracticeData = selectedVocab?.sentencePractice;
  const paragraphPracticeData = selectedVocab?.paragraphPractice || selectedVocab?.twoSentencePractice;
  const twoSentencePracticeData = paragraphPracticeData;

  // Mức Band đang xem và câu nâng cấp tương ứng (Phần 2)
  const currentPart2Band = part2ViewBand || targetBand;
  const currentPart2Sentence = useMemo(() => {
    if (!part2Result) return "";
    return (
      part2Result.bandUpgrades?.[currentPart2Band] ||
      sentencePracticeData?.bandUpgrades?.[currentPart2Band] ||
      (currentPart2Band === targetBand ? part2Result.upgradedSentence : "") ||
      part2Result.upgradedSentence ||
      ""
    );
  }, [part2Result, currentPart2Band, sentencePracticeData, targetBand]);

  const currentPart2Analysis = useMemo(() => {
    if (!part2Result || !currentPart2Sentence || !selectedVocab) return null;
    return analyzeUpgradeDetails({
      upgradedSentence: currentPart2Sentence,
      vocab: selectedVocab,
      targetBand: currentPart2Band,
      isPart3: false
    });
  }, [part2Result, currentPart2Sentence, selectedVocab, currentPart2Band]);

  // Mức Band đang xem và đoạn văn nâng cấp tương ứng (Phần 3)
  const currentPart3Band = part3ViewBand || targetBand;
  const currentPart3Pair = useMemo(() => {
    if (!part3Result) return "";
    return (
      part3Result.bandUpgrades?.[currentPart3Band] ||
      paragraphPracticeData?.bandUpgrades?.[currentPart3Band] ||
      (currentPart3Band === targetBand ? (part3Result.upgradedPair || part3Result.upgradedParagraph) : "") ||
      part3Result.upgradedPair ||
      paragraphPracticeData?.modelParagraph ||
      paragraphPracticeData?.modelTranslation ||
      ""
    );
  }, [part3Result, currentPart3Band, paragraphPracticeData, targetBand]);

  const currentPart3Analysis = useMemo(() => {
    if (!part3Result || !currentPart3Pair || !selectedVocab) return null;
    return analyzeUpgradeDetails({
      upgradedSentence: currentPart3Pair,
      vocab: selectedVocab,
      targetBand: currentPart3Band,
      isPart3: true
    });
  }, [part3Result, currentPart3Pair, selectedVocab, currentPart3Band]);

  // Relaxed empty state: if no vocab is selected
  if (!selectedVocab) {
    return (
      <div className="space-y-4 text-[#24211E]">
        {/* Navigation Switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-[#F4EFEA] border border-[#E6E2D8] shadow-xs">
          <button
            onClick={() => setActivePart(1)}
            className="py-2 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold text-[#7A7369] hover:text-[#24211E] transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full bg-black/10 text-[10px] flex items-center justify-center font-black">1</span>
            <span className="truncate">Hiểu từ vựng</span>
          </button>
          <button
            onClick={() => setActivePart(2)}
            className="py-2 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold text-[#7A7369] hover:text-[#24211E] transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full bg-black/10 text-[10px] flex items-center justify-center font-black">2</span>
            <span className="truncate">Luyện viết câu</span>
          </button>
          <button
            onClick={() => setActivePart(3)}
            className="py-2 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold text-[#7A7369] hover:text-[#24211E] transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full bg-black/10 text-[10px] flex items-center justify-center font-black">3</span>
            <span className="truncate">Luyện viết đoạn văn</span>
          </button>
        </div>

        <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3.5 bg-white rounded-2xl border border-[#E6E2D8] shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#24211E]">Chưa chọn từ vựng luyện tập</h4>
            <p className="text-xs text-[#7A7369] mt-1 max-w-sm">
              Hãy chọn một từ vựng ở danh sách bên cạnh và nhấn nút "Luyện tập" để học 3 bước (Hiểu từ &rarr; Luyện viết câu &rarr; Luyện viết đoạn văn)!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#24211E]">
      
      {/* Target Word Overview Ribbon */}
      {selectedVocab && (
        <div className="p-3.5 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs flex flex-col gap-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-black text-[#3E4F42] tracking-wider bg-[#EDF3EE] px-2 py-0.5 rounded-md border border-[#D1DDD3]">
                Từ Đang Luyện
              </span>
              <span className="text-lg font-black text-[#24211E]">{selectedVocab.word}</span>
              {selectedVocab.ipa && (
                <span className="text-xs font-mono text-[#3E4F42] italic font-bold">
                  {selectedVocab.ipa}
                </span>
              )}
              <span className="text-xs text-[#7A7369]">({selectedVocab.partOfSpeech})</span>
              {selectedVocab.meaning && (
                <span className="text-xs text-[#24211E] font-medium ml-1">
                  • <strong className="text-[#3E4F42] font-bold">Nghĩa:</strong> {selectedVocab.meaning}
                </span>
              )}
            </div>

            {activeTask === 'task1' && onOpenChartModal && (
              <button
                type="button"
                onClick={onOpenChartModal}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#EDF3EE] hover:bg-[#EDF3EE] text-[#334237] border border-[#D1DDD3] text-xs font-bold transition cursor-pointer self-start sm:self-auto shadow-xs"
                title="Xem bảng số liệu biểu đồ Task 1"
              >
                <BarChart3 className="w-3.5 h-3.5 text-[#3E4F42]" />
                <span>Xem Bar Chart</span>
              </button>
            )}
          </div>

          {/* Từ đồng nghĩa (Synonyms) - Hiển thị sau khi học viên kiểm tra hiểu từ hoặc khi ở Phần 2, 3 */}
          {(activePart > 1 || part1Result) && selectedVocab.synonyms && selectedVocab.synonyms.length > 0 && (
            <div className="pt-2 border-t border-[#E6E2D8] flex items-center gap-2 flex-wrap animate-fadeIn">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A67C52] flex items-center gap-1 shrink-0">
                <Tag className="w-3.5 h-3.5" />
                <span>Từ đồng nghĩa (Synonyms):</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedVocab.synonyms.map((syn, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 rounded-md bg-[#FAF5EE] border border-[#E6E2D8] text-[#A67C52] font-mono font-medium hover:bg-[#FAF5EE] transition select-text"
                    title={`Từ đồng nghĩa Band 7.5+ của "${selectedVocab.word}": ${syn}`}
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3-Part Navigation Switcher: Hiểu từ -> Luyện câu -> Luyện đoạn */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-[#F4EFEA] border border-[#E6E2D8] shadow-xs">
        {/* Tab Phần 1: Hiểu từ */}
        <button
          onClick={() => setActivePart(1)}
          className={`py-2 px-1 sm:px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
            activePart === 1
              ? "bg-[#3E4F42] text-white shadow-xs"
              : "text-[#7A7369] hover:text-[#24211E]"
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-black shrink-0">1</span>
          <span className="truncate">Hiểu từ vựng</span>
          {part1Result && part1Result.isCorrect && (
            <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
          )}
        </button>

        {/* Tab Phần 2: Luyện viết câu */}
        <button
          onClick={() => setActivePart(2)}
          className={`py-2 px-1 sm:px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
            activePart === 2
              ? "bg-[#3E4F42] text-white shadow-xs"
              : "text-[#7A7369] hover:text-[#24211E]"
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-black shrink-0">2</span>
          <span className="truncate">Luyện viết câu</span>
          {part2Result && (
            <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
          )}
        </button>

        {/* Tab Phần 3: Luyện viết đoạn văn */}
        <button
          onClick={() => setActivePart(3)}
          className={`py-2 px-1 sm:px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
            activePart === 3
              ? "bg-[#3E4F42] text-white shadow-xs"
              : "text-[#7A7369] hover:text-[#24211E]"
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-black shrink-0">3</span>
          <span className="truncate">Luyện viết đoạn văn</span>
          {part3Result && (
            <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ==================== PHẦN 1: CHẤM ĐIỂM HIỂU TỪ VỰNG ===================== */}
      {/* ========================================================================= */}
      {activePart === 1 && (
        <div className="space-y-4 animate-fadeIn">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E2D8] space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6E2D8]">
              <div className="flex items-center gap-2 text-[#24211E] font-medium text-xs sm:text-sm">
                <HelpCircle className="w-4 h-4 text-[#3E4F42]" />
                <span>Hiểu từ: <strong className="font-serif text-[#3E4F42]">{selectedVocab.word}</strong></span>
              </div>
            </div>

            {/* 1. Ghi nghĩa tiếng Việt của từ để hệ thống đánh giá */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#24211E] block">
                  1. Ghi nghĩa tiếng Việt của từ:
                </label>
                <span className="text-[11px] text-[#7A7369] italic">
                  (Hệ thống AI sẽ đối chiếu và đánh giá độ chính xác học thuật)
                </span>
              </div>

              <textarea
                value={vietnameseMeaningInput}
                onChange={(e) => setVietnameseMeaningInput(e.target.value)}
                placeholder="Ghi nghĩa tiếng Việt của từ theo cách hiểu của bạn..."
                rows={2}
                className="w-full p-3 rounded-xl bg-white border border-[#E6E2D8] text-[#24211E] text-xs sm:text-sm focus:outline-none focus:border-[#3E4F42] transition placeholder-[#7A7369] resize-none font-sans"
              />
            </div>

            {/* 2. Điền từ đồng nghĩa tiếng Anh (Synonym - Tùy chọn) - KHÔNG ĐỂ VÍ DỤ TRONG Ô */}
            <div className="pt-2 border-t border-[#E6E2D8] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#24211E] block">
                  2. Hoặc điền thêm từ đồng nghĩa (synonym) tiếng Anh:
                </label>
                <span className="text-[11px] text-[#7A7369] italic">
                  (Không bắt buộc)
                </span>
              </div>
              
              <input
                type="text"
                value={synonymInput}
                onChange={(e) => setSynonymInput(e.target.value)}
                placeholder="Nhập từ đồng nghĩa tiếng Anh..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E6E2D8] text-[#24211E] text-xs font-mono focus:outline-none focus:border-[#3E4F42] transition placeholder-[#7A7369]"
              />
            </div>

            {/* Nút hành động */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setVietnameseMeaningInput("");
                  setSynonymInput("");
                  setPart1Result(null);
                }}
                className="text-xs text-[#7A7369] hover:text-[#24211E] transition cursor-pointer"
              >
                Làm lại
              </button>

              <button
                type="button"
                onClick={handleGradePart1}
                disabled={!vietnameseMeaningInput.trim() && !synonymInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-xs shadow-xs transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <span>Kiểm tra &amp; Đánh giá</span>
              </button>
            </div>
          </div>

          {/* KẾT QUẢ CHẤM ĐIỂM HIỂU TỪ */}
          {part1Result && (
            <div className={`p-4 rounded-2xl border space-y-3 animate-fadeIn shadow-xs ${
              part1Result.status === 'excellent'
                ? "bg-[#EDF3EE] border-[#D1DDD3]"
                : part1Result.status === 'good'
                  ? "bg-[#F4F7F4] border-[#D1DDD3]"
                  : "bg-[#FAF5EE] border-[#E6E2D8]"
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  {part1Result.isCorrect ? (
                    <div className="w-8 h-8 rounded-xl bg-white text-[#3E4F42] border border-[#D1DDD3] flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-white text-[#A67C52] border border-[#E6E2D8] flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-[#24211E]">
                        {part1Result.status === 'excellent'
                          ? "Đạt chuẩn hiểu từ: 100% (Band 8.0+)"
                          : part1Result.status === 'good'
                            ? "Khá tốt: 80% (Nắm được nét nghĩa cơ bản)"
                            : "Cần lưu ý lại nghĩa của từ (40%)"}
                      </h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        part1Result.status === 'excellent'
                          ? "bg-[#3E4F42] text-white"
                          : part1Result.status === 'good'
                            ? "bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3]"
                            : "bg-[#FAF5EE] text-[#A67C52] border border-[#E6E2D8]"
                      }`}>
                        Điểm: {part1Result.score}/100
                      </span>
                    </div>
                    <p className="text-xs text-[#7A7369] mt-1 leading-relaxed">{part1Result.feedbackMessage}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePart(2)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
                >
                  <span>Sang Phần 2 (Luyện câu)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Định nghĩa chuẩn học thuật */}
              <div className="p-3 rounded-xl bg-white border border-[#E6E2D8] text-xs space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[#3E4F42]">📖 Định nghĩa chuẩn học thuật:</span>
                  <span className="font-black text-[#24211E]">{selectedVocab.word}</span>
                  {selectedVocab.ipa && <span className="text-[#7A7369] font-mono italic">[{selectedVocab.ipa}]</span>}
                  <span className="text-[#7A7369]">({selectedVocab.partOfSpeech})</span>
                </div>
                <p className="text-[#24211E] font-medium pl-2 border-l-2 border-[#3E4F42] leading-relaxed">
                  {selectedVocab.meaning}
                </p>
              </div>

              {/* Collocations & Synonyms gợi ý nâng cao */}
              {selectedVocab.collocations && selectedVocab.collocations.length > 0 && (
                <div className="pt-2 border-t border-[#E6E2D8] text-xs space-y-1">
                  <span className="text-[#7A7369] font-semibold">Cụm từ học thuật đi kèm (Collocations):</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedVocab.collocations.map((col, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-[#E6E2D8] text-[#3E4F42] text-[11px] font-mono">
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
          
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E2D8] space-y-3.5 shadow-xs">
            
            {/* Header Phần 2 */}
            <div className="flex items-center justify-between pb-2 border-b border-[#E6E2D8]">
              <div className="flex items-center gap-2 text-[#24211E] font-medium text-xs sm:text-sm">
                <BookOpen className="w-4 h-4 text-[#3E4F42]" />
                <span>Dịch câu có từ: <strong className="font-serif text-[#3E4F42]">{selectedVocab.word}</strong></span>
              </div>
            </div>

            {/* Câu tiếng Việt mẫu */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1.5">
              <span className="text-[10px] uppercase font-medium tracking-wider text-[#A67C52]">
                Câu cần dịch:
              </span>
              <p className="text-xs sm:text-sm text-[#24211E] leading-relaxed select-text font-serif">
                "{sentencePracticeData.vietnamesePrompt}"
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-[#7A7369]">Từ khóa bắt buộc:</span>
                <button
                  type="button"
                  onClick={() => insertText(selectedVocab.word, 2)}
                  className="px-2 py-0.5 rounded-md bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] text-xs font-mono font-medium hover:bg-[#EDF3EE] transition cursor-pointer"
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
                className="w-full p-3.5 rounded-xl bg-white border border-[#E6E2D8] text-[#24211E] text-xs sm:text-sm font-sans focus:outline-none focus:border-[#3E4F42] transition resize-y leading-relaxed placeholder-[#7A7369]"
              />
              <div className="absolute right-2.5 bottom-2.5 text-[10px] text-[#7A7369] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E6E2D8]">
                {part2Input.split(/\s+/).filter(Boolean).length} từ
              </div>
            </div>

            {/* Gợi ý từ đồng nghĩa chèn nhanh */}
            {selectedVocab.synonyms && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[#7A7369] text-[11px]">Từ đồng nghĩa:</span>
                {selectedVocab.synonyms.map((syn, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => insertText(syn, 2)}
                    className="px-2 py-0.5 rounded bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-[#3E4F42] text-[11px] font-mono transition cursor-pointer"
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
                className="text-xs text-[#7A7369] hover:text-[#24211E] transition cursor-pointer"
              >
                Xóa làm lại
              </button>

              <button
                type="button"
                onClick={handleGradePart2}
                disabled={isEvaluatingPart2 || !part2Input.trim()}
                className="px-5 py-2 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-xs shadow-xs transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {isEvaluatingPart2 ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang chấm...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Chấm câu & Gợi ý</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* KẾT QUẢ CHẤM ĐIỂM & CÂU NÂNG CẤP ĐÚNG SỐ BAND (PHẦN 2) */}
          {part2Result && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D1DDD3] shadow-xs space-y-4 animate-fadeIn">
              
              {/* Header Điểm */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black ${
                    part2Result.isTargetMet
                      ? "bg-[#3E4F42] text-white shadow-xs"
                      : "bg-[#A67C52] text-white shadow-xs"
                  }`}>
                    <span className="text-[9px] uppercase tracking-wider opacity-90">BAND</span>
                    <span className="text-xl leading-none">{part2Result.scores?.overallBand}</span>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#24211E]">
                      {part2Result.isTargetMet ? "Đạt chuẩn mục tiêu!" : "Cần hoàn thiện thêm để chạm Band mục tiêu"}
                    </h4>
                    <p className="text-xs text-[#7A7369]">
                      Lexical: {part2Result.scores?.lexicalResource} • Grammar: {part2Result.scores?.grammarRange}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePart(3)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>Tiếp tục Phần 3</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* CÂU NÂNG CẤP ĐÚNG THEO BAND MỤC TIÊU & CHỌN BAND CAO HƠN */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#D1DDD3] space-y-3">
                {/* Header thanh công cụ câu nâng cấp */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#E6E2D8]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#3E4F42]">
                      <Sparkles className="w-3.5 h-3.5 text-[#3E4F42]" />
                      <span>CÂU NÂNG CẤP CHUẨN BAND {currentPart2Band}:</span>
                    </div>

                    {parseFloat(currentPart2Band) > parseFloat(targetBand) ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF5EE] text-[#A67C52] border border-[#E6E2D8] font-bold flex items-center gap-1">
                        <span>🚀</span> Nâng cấp cao hơn (+{(parseFloat(currentPart2Band) - parseFloat(targetBand)).toFixed(1)})
                      </span>
                    ) : currentPart2Band === targetBand ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] font-bold">
                        🎯 Band mục tiêu
                      </span>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(currentPart2Sentence, `part2_upgraded_${currentPart2Band}`)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-[#7A7369] text-[10px] transition cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
                  >
                    {copiedKey === `part2_upgraded_${currentPart2Band}` ? <Check className="w-3 h-3 text-[#3E4F42]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === `part2_upgraded_${currentPart2Band}` ? "Đã copy" : "Copy câu"}</span>
                  </button>
                </div>

                {/* Thanh Nút Chọn Xem Theo Các Mức Band */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-white border border-[#E6E2D8] text-xs">
                  <span className="text-[11px] font-semibold text-[#7A7369] flex items-center gap-1">
                    <span>Chọn mức Band nâng cấp:</span>
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {AVAILABLE_BANDS.map((band) => {
                      const isSelected = band === currentPart2Band;
                      const isTarget = band === targetBand;
                      const isHigher = parseFloat(band) > parseFloat(targetBand);

                      return (
                        <button
                          key={band}
                          type="button"
                          onClick={() => setPart2ViewBand(band)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition cursor-pointer flex items-center gap-1 ${
                            isSelected
                              ? isHigher
                                ? "bg-[#A67C52] text-white shadow-xs"
                                : "bg-[#3E4F42] text-white shadow-xs"
                              : isHigher
                                ? "bg-[#FAF5EE] text-[#A67C52] hover:bg-[#FAF5EE] border border-[#E6E2D8]"
                                : isTarget
                                  ? "bg-[#EDF3EE] text-[#3E4F42] hover:bg-[#EDF3EE] border border-[#D1DDD3]"
                                  : "bg-white text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8]"
                          }`}
                          title={`Xem câu nâng cấp chuẩn Band ${band}${isTarget ? ' (Mục tiêu của bạn)' : isHigher ? ' (Cao hơn mục tiêu)' : ''}`}
                        >
                          <span>Band {band}</span>
                          {isHigher && !isSelected && <span className="text-[9px]">⭐</span>}
                          {isTarget && !isSelected && <span className="text-[9px] text-[#3E4F42]">•</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Nội dung câu nâng cấp */}
                <div className="p-3 rounded-lg bg-white border border-[#E6E2D8] shadow-xs">
                  <p className="text-xs sm:text-sm font-mono text-[#24211E] italic font-semibold leading-relaxed">
                    "{currentPart2Sentence}"
                  </p>
                </div>
              </div>

              {/* CHI TIẾT CÁC PHẦN NÂNG CẤP */}
              <UpgradeDetailsBreakdown 
                result={{ 
                  ...part2Result, 
                  upgradedSentence: currentPart2Sentence, 
                  detailedAnalysis: currentPart2Analysis 
                }} 
                targetBand={currentPart2Band} 
                isPart3={false} 
              />

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* ==================== PHẦN 3: LUYỆN VIẾT ĐOẠN VĂN (PARAGRAPH) ============ */}
      {/* ========================================================================= */}
      {activePart === 3 && (
        <div className="space-y-4 animate-fadeIn">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E2D8] space-y-3.5 shadow-xs">
            
            {/* Header Phần 3 */}
            <div className="flex items-center justify-between pb-2 border-b border-[#E6E2D8]">
              <div className="flex items-center gap-2 text-[#3E4F42] font-extrabold text-xs sm:text-sm">
                <Layers className="w-4 h-4" />
                <span>Phần 3: Luyện Viết Theo Đoạn Văn (Academic Paragraph)</span>
              </div>
              <span className="text-[10px] text-[#7A7369] bg-[#F4EFEA] px-2 py-0.5 rounded-full border border-[#E6E2D8]">
                Mục tiêu: Band {targetBand}
              </span>
            </div>

            {/* Đoạn văn tiếng Việt mẫu do Web đưa ra (chuẩn cấu trúc PEEL) */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#D1DDD3] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A67C52] flex items-center gap-1">
                  <span>📝</span> Đoạn văn tiếng Việt cần diễn đạt sang tiếng Anh:
                </span>
                <span className="text-[10px] text-[#7A7369] font-mono">
                  (Cấu trúc đoạn PEEL: 3 - 4 câu)
                </span>
              </div>
              
              <p className="text-xs sm:text-sm text-[#24211E] leading-relaxed font-serif italic pl-2 border-l-2 border-[#3E4F42]">
                "{paragraphPracticeData?.vietnamesePrompt || twoSentencePracticeData?.sentence1Vietnamese}"
              </p>

              {/* Bóc tách các câu cấu thành nếu có */}
              {paragraphPracticeData?.topicSentenceVN && (
                <div className="pt-2 border-t border-[#E6E2D8] space-y-1 text-xs text-[#7A7369]">
                  <div className="leading-snug"><strong className="text-[#3E4F42]">1. Câu chủ đề (Topic Sentence):</strong> {paragraphPracticeData.topicSentenceVN}</div>
                  <div className="leading-snug"><strong className="text-[#3E4F42]">2. Phân tích (Explanation):</strong> {paragraphPracticeData.explanationVN}</div>
                  <div className="leading-snug"><strong className="text-[#3E4F42]">3. Dẫn chứng/Hệ quả (Evidence):</strong> {paragraphPracticeData.evidenceVN}</div>
                  <div className="leading-snug"><strong className="text-[#3E4F42]">4. Đúc kết (Conclusion):</strong> {paragraphPracticeData.conclusionVN}</div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[11px] text-[#7A7369]">Từ vựng bắt buộc trong đoạn:</span>
                <span className="px-2 py-0.5 rounded-md bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] text-xs font-mono font-bold">
                  {selectedVocab.word}
                </span>
              </div>
            </div>

            {/* Gợi ý liên từ mạch lạc */}
            {paragraphPracticeData?.linkingSuggestions && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[#7A7369] text-[11px]">Gợi ý liên từ mạch lạc (Cohesive Devices):</span>
                {paragraphPracticeData.linkingSuggestions.map((link, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => insertText(link, 3)}
                    className="px-2 py-0.5 rounded-lg bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-[#3E4F42] text-[11px] font-mono transition cursor-pointer"
                  >
                    + {link}
                  </button>
                ))}
              </div>
            )}

            {/* Khung nhập bài viết đoạn văn tiếng Anh */}
            <div className="relative">
              <textarea
                rows={5}
                value={part3Input}
                onChange={(e) => setPart3Input(e.target.value)}
                placeholder={`Viết cả đoạn văn trên sang tiếng Anh (khoảng 35 - 65 từ), sử dụng từ "${selectedVocab.word}" và các liên từ chuyển câu học thuật...`}
                className="w-full p-3.5 rounded-xl bg-white border border-[#E6E2D8] text-[#24211E] text-xs sm:text-sm font-sans focus:outline-none focus:border-[#3E4F42] transition resize-y leading-relaxed placeholder-[#7A7369]"
              />
              <div className="absolute right-2.5 bottom-2.5 text-[10px] text-[#7A7369] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E6E2D8]">
                {part3Input.split(/\s+/).filter(Boolean).length} từ
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setPart3Input("")}
                className="text-xs text-[#7A7369] hover:text-[#24211E] transition cursor-pointer"
              >
                Xóa làm lại
              </button>

              <button
                type="button"
                onClick={handleGradePart3}
                disabled={isEvaluatingPart3 || !part3Input.trim()}
                className="px-5 py-2 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-xs shadow-xs transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {isEvaluatingPart3 ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang chấm đoạn văn...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Chấm đoạn văn &amp; Gợi ý</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* KẾT QUẢ CHẤM ĐIỂM & ĐOẠN VĂN NÂNG CẤP ĐÚNG SỐ BAND (PHẦN 3) */}
          {part3Result && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D1DDD3] shadow-xs space-y-4 animate-fadeIn">
              
              {/* Header Điểm */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black ${
                    part3Result.isTargetMet
                      ? "bg-[#3E4F42] text-white shadow-xs"
                      : "bg-[#A67C52] text-white shadow-xs"
                  }`}>
                    <span className="text-[9px] uppercase tracking-wider opacity-90">BAND</span>
                    <span className="text-xl leading-none">{part3Result.scores?.overallBand}</span>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#24211E]">
                      {part3Result.isTargetMet ? "Tuyệt vời! Đoạn văn đạt chuẩn Coherence & Lexical" : "Hoàn thành đoạn văn luyện viết"}
                    </h4>
                    <p className="text-xs text-[#7A7369]">
                      Cohesion: {part3Result.scores?.coherenceCohesion} • Lexical: {part3Result.scores?.lexicalResource} • Grammar: {part3Result.scores?.grammarRange}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] font-bold">
                  Đã lưu lịch sử
                </span>
              </div>

              {/* ĐOẠN VĂN NÂNG CẤP ĐÚNG THEO BAND MỤC TIÊU & CHỌN BAND CAO HƠN */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#D1DDD3] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#E6E2D8]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#3E4F42]">
                      <Sparkles className="w-3.5 h-3.5 text-[#3E4F42]" />
                      <span>ĐOẠN VĂN NÂNG CẤP CHUẨN BAND {currentPart3Band}:</span>
                    </div>

                    {parseFloat(currentPart3Band) > parseFloat(targetBand) ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF5EE] text-[#A67C52] border border-[#E6E2D8] font-bold flex items-center gap-1">
                        <span>🚀</span> Nâng cấp cao hơn (+{(parseFloat(currentPart3Band) - parseFloat(targetBand)).toFixed(1)})
                      </span>
                    ) : currentPart3Band === targetBand ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] font-bold">
                        🎯 Band mục tiêu
                      </span>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(currentPart3Pair, `part3_upgraded_${currentPart3Band}`)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-[#7A7369] text-[10px] transition cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
                  >
                    {copiedKey === `part3_upgraded_${currentPart3Band}` ? <Check className="w-3 h-3 text-[#3E4F42]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === `part3_upgraded_${currentPart3Band}` ? "Đã copy" : "Copy đoạn văn"}</span>
                  </button>
                </div>

                {/* Thanh Nút Chọn Xem Theo Các Mức Band */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-white border border-[#E6E2D8] text-xs">
                  <span className="text-[11px] font-semibold text-[#7A7369] flex items-center gap-1">
                    <span>Chọn mức Band nâng cấp:</span>
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {AVAILABLE_BANDS.map((band) => {
                      const isSelected = band === currentPart3Band;
                      const isTarget = band === targetBand;
                      const isHigher = parseFloat(band) > parseFloat(targetBand);

                      return (
                        <button
                          key={band}
                          type="button"
                          onClick={() => setPart3ViewBand(band)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition cursor-pointer flex items-center gap-1 ${
                            isSelected
                              ? isHigher
                                ? "bg-[#A67C52] text-white shadow-xs"
                                : "bg-[#3E4F42] text-white shadow-xs"
                              : isHigher
                                ? "bg-[#FAF5EE] text-[#A67C52] hover:bg-[#FAF5EE] border border-[#E6E2D8]"
                                : isTarget
                                  ? "bg-[#EDF3EE] text-[#3E4F42] hover:bg-[#EDF3EE] border border-[#D1DDD3]"
                                  : "bg-white text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8]"
                          }`}
                          title={`Xem đoạn văn nâng cấp chuẩn Band ${band}${isTarget ? ' (Mục tiêu của bạn)' : isHigher ? ' (Cao hơn mục tiêu)' : ''}`}
                        >
                          <span>Band {band}</span>
                          {isHigher && !isSelected && <span className="text-[9px]">⭐</span>}
                          {isTarget && !isSelected && <span className="text-[9px] text-[#3E4F42]">•</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Nội dung đoạn văn nâng cấp */}
                <div className="p-3 rounded-lg bg-white border border-[#E6E2D8] shadow-xs">
                  <p className="text-xs sm:text-sm font-mono text-[#24211E] italic font-semibold leading-relaxed">
                    "{currentPart3Pair}"
                  </p>
                </div>
              </div>

              {/* CHI TIẾT CÁC PHẦN NÂNG CẤP */}
              <UpgradeDetailsBreakdown 
                result={{ 
                  ...part3Result, 
                  upgradedPair: currentPart3Pair, 
                  detailedAnalysis: currentPart3Analysis 
                }} 
                targetBand={currentPart3Band} 
                isPart3={true} 
              />

            </div>
          )}

        </div>
      )}
    </div>
  );
}
