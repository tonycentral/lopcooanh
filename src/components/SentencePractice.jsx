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
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  FileEdit,
  FileText,
  Award,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  evaluateComprehensionTest, 
  evaluatePart2Translation, 
  evaluatePart3Translation,
  evaluateFullEssay
} from '../services/evaluator';
import { evaluateWithGemini } from '../services/geminiService';
import { analyzeUpgradeDetails } from '../services/upgradeDetailHelper';
import { saveHistoryEntry } from '../services/storage';
import WritingProcessModal from './WritingProcessModal';

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
  // 4-Part State: 1 = Hiểu từ, 2 = Dịch 1 câu, 3 = Dịch 2 câu & Chuyển câu, 4 = Full Essay / Report
  const [internalActivePart, setInternalActivePart] = useState(1);
  const activePart = controlledActivePart !== undefined ? controlledActivePart : internalActivePart;
  const setActivePart = (newPart) => {
    setInternalActivePart(newPart);
    if (onPartChange) onPartChange(newPart);
  };

  // ================= STATE CHO PHẦN 1: CHẤM ĐIỂM HIỂU TỪ =================
  const [quizSelectedIndex, setQuizSelectedIndex] = useState(null);
  const [synonymInput, setSynonymInput] = useState("");
  const [part1Result, setPart1Result] = useState(null);

  // ================= STATE CHO PHẦN 2: DỊCH 1 CÂU =================
  const [part2Input, setPart2Input] = useState("");
  const [isEvaluatingPart2, setIsEvaluatingPart2] = useState(false);
  const [part2Result, setPart2Result] = useState(null);
  const [part2ViewBand, setPart2ViewBand] = useState(null);

  // ================= STATE CHO PHẦN 3: DỊCH 2 CÂU & CHUYỂN CÂU =================
  const [part3Input, setPart3Input] = useState("");
  const [isEvaluatingPart3, setIsEvaluatingPart3] = useState(false);
  const [part3Result, setPart3Result] = useState(null);
  const [part3ViewBand, setPart3ViewBand] = useState(null);

  // ================= STATE CHO PHẦN 4: FULL ESSAY / FULL REPORT =================
  const isTask1 = activeTask === 'task1';
  const minWordsRequired = isTask1 ? 150 : 250;
  const [essayInput, setEssayInput] = useState("");
  const [isEvaluatingEssay, setIsEvaluatingEssay] = useState(false);
  const [essayResult, setEssayResult] = useState(null);
  const [essayTimeLeft, setEssayTimeLeft] = useState(isTask1 ? 20 * 60 : 40 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showModelEssay, setShowModelEssay] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const hasAutoOpenedModalRef = useRef(false);

  // Tự động hiện pop-up quy trình viết bài khi học viên vào mục số 4 (Tab 4)
  useEffect(() => {
    if (activePart === 4 && !hasAutoOpenedModalRef.current) {
      setIsProcessModalOpen(true);
      hasAutoOpenedModalRef.current = true;
    }
  }, [activePart]);

  // Timer countdown for essay
  useEffect(() => {
    let timer;
    if (isTimerRunning && essayTimeLeft > 0) {
      timer = setInterval(() => {
        setEssayTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    } else if (essayTimeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, essayTimeLeft]);

  // Reset essay state when topic changes
  useEffect(() => {
    setEssayInput("");
    setIsEvaluatingEssay(false);
    setEssayResult(null);
    setEssayTimeLeft(isTask1 ? 20 * 60 : 40 * 60);
    setIsTimerRunning(false);
    setShowModelEssay(false);
  }, [topic?.id, activeTask]);

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
    setPart2ViewBand(null);

    setPart3Input("");
    setIsEvaluatingPart3(false);
    setPart3Result(null);
    setPart3ViewBand(null);

    if (activePart !== 4) {
      setActivePart(1);
    }
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
    } else if (partNum === 4) {
      insertIntoEssay(text);
    }
  };

  // Helper for Part 4 essay
  const topicVocabs = useMemo(() => topic?.vocabularies || [], [topic]);

  const isWordUsed = (word, synonyms = []) => {
    if (!essayInput.trim() || !word) return false;
    const cleanWord = word.trim().toLowerCase();
    const regex = new RegExp(`\\b${cleanWord.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i');
    if (regex.test(essayInput)) return true;
    const lowerInput = essayInput.toLowerCase();
    return (synonyms || []).some(s => s && lowerInput.includes(s.toLowerCase()));
  };

  const usedWordsCount = useMemo(() => {
    return topicVocabs.filter(v => isWordUsed(v.word, v.synonyms)).length;
  }, [topicVocabs, essayInput]);

  const essayWords = useMemo(() => {
    return essayInput.trim().split(/\s+/).filter(Boolean);
  }, [essayInput]);

  const currentWordCount = essayWords.length;

  const essayParagraphCount = useMemo(() => {
    if (!essayInput.trim()) return 0;
    const paras = essayInput.split(/\n\s*\n|\r\n\s*\r\n/).map(p => p.trim()).filter(Boolean);
    return paras.length > 0 ? paras.length : 1;
  }, [essayInput]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const insertIntoEssay = (text) => {
    setEssayInput(prev => {
      if (!prev) return text;
      if (prev.endsWith(" ") || prev.endsWith("\n")) return `${prev}${text}`;
      return `${prev} ${text}`;
    });
  };

  const insertOutlineScaffold = () => {
    if (isTask1) {
      const scaffold = `Introduction & Overview:
The chart illustrates the changes in... Overall, it is evident that...

Body Paragraph 1:
Looking first at..., the figure for... was... Furthermore,...

Body Paragraph 2:
Turning to the remaining categories,..., whereas...`;
      insertIntoEssay(scaffold);
    } else {
      const scaffold = `Introduction:
It is often argued that... However, I firmly maintain that...

Body Paragraph 1:
On the one hand, it is undeniable that... Specifically,... For example,... Consequently,...

Body Paragraph 2:
On the other hand, there are compelling reasons to argue that... Furthermore,... For instance,... Therefore,...

Conclusion:
In conclusion, while..., I believe that...`;
      insertIntoEssay(scaffold);
    }
  };

  const quickConnectors = isTask1 ? [
    { text: "The chart illustrates", tip: "Mở bài Task 1" },
    { text: "Overall, it is evident that", tip: "Mở đầu câu Overview" },
    { text: "In terms of", tip: "Mở đoạn thân bài" },
    { text: "Compared to", tip: "So sánh số liệu" },
    { text: "Stood at approximately", tip: "Nêu số liệu cụ thể" },
    { text: "In stark contrast,", tip: "Đối lập số liệu" }
  ] : [
    { text: "On the one hand,", tip: "Mở đoạn Thân bài 1" },
    { text: "On the other hand,", tip: "Mở đoạn Thân bài 2" },
    { text: "Furthermore,", tip: "Bổ sung luận điểm" },
    { text: "Consequently,", tip: "Chỉ ra hệ quả tất yếu" },
    { text: "In light of this,", tip: "Liên hệ mạch lạc" },
    { text: "In conclusion,", tip: "Mở đoạn Kết bài" }
  ];

  const handleGradeEssay = async () => {
    if (!essayInput.trim()) return;
    setIsEvaluatingEssay(true);

    try {
      let res = evaluateFullEssay(essayInput, topic, targetBand, activeTask);
      if (!res.isValid) {
        alert(res.error);
        return;
      }

      if (apiKey) {
        try {
          const aiRes = await evaluateWithGemini("full_essay", {
            targetBand,
            activeTask,
            topicName: topic?.name,
            ieltsPrompt: topic?.ieltsPrompt,
            targetWords: topicVocabs.map(v => v.word),
            essayText: essayInput
          }, apiKey);

          if (aiRes && aiRes.scores) {
            res = {
              ...res,
              scores: aiRes.scores,
              strengths: aiRes.strengths?.length ? aiRes.strengths : res.strengths,
              improvements: aiRes.improvements?.length ? aiRes.improvements : res.improvements,
              paragraphFeedbacks: aiRes.paragraphFeedbacks?.length ? aiRes.paragraphFeedbacks : res.paragraphFeedbacks,
              isAiGraded: true
            };
          }
        } catch (aiErr) {
          console.warn("Lỗi gọi Gemini AI examiner, sử dụng bộ chấm IELTS ngoại tuyến:", aiErr);
        }
      }

      setEssayResult(res);

      if (res.scores && res.scores.overallBand >= parseFloat(targetBand)) {
        confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } });
      }

      saveHistoryEntry({
        studentEmail,
        type: "full_essay",
        topicName: topic?.name,
        targetWord: `${usedWordsCount}/${topicVocabs.length} từ chủ đề`,
        userSentence: essayInput,
        scores: res.scores,
        targetBand,
        isTargetMet: (res.scores?.overallBand || 0) >= parseFloat(targetBand)
      });

      if (onSentenceGraded) onSentenceGraded();
    } finally {
      setIsEvaluatingEssay(false);
    }
  };

  const getModelEssayText = () => {
    if (topic?.modelEssay) return topic.modelEssay;
    if (isTask1) {
      return `The presented illustration provides an overview of the data concerning ${topic?.name || 'the given subject'}. Overall, what stands out from the visual representation is that significant differences are observable between the surveyed metrics throughout the designated timeframe.\n\nIn terms of the prominent indicators, the figures registered substantial activity, where key categories commanded a notable proportion of the total. Furthermore, steady progression was maintained across several parameters.\n\nTurning to the secondary details, comparative analysis highlights distinct variations between the remaining sectors, with certain values stabilizing towards the conclusion of the survey period.`;
    }

    return `It is widely asserted that the issue surrounding ${topic?.name || 'the given phenomenon'} represents a matter of considerable debate in contemporary society. While some individuals argue that certain factors contribute fundamentally to this trend, I firmly believe that a balanced and multidimensional approach is essential.\n\nOn the one hand, proponents of the first perspective contend that tangible benefits can be attained through targeted interventions. In particular, when relevant stakeholders implement systematic measures, they can effectively mitigate underlying challenges and stimulate sustainable progress. For instance, empirical evidence suggests that structured reforms often yield enduring societal gains.\n\nOn the other hand, compelling arguments can also be advanced regarding alternative considerations. Crucially, addressing root causes rather than superficial symptoms fosters long-term stability and resilience. Consequently, modern communities must adopt prudent policies to avoid exacerbating systemic vulnerabilities.\n\nIn conclusion, having analyzed both viewpoints, it is apparent that although individual aspects merit serious attention, holistic and cohesive strategies remain the most viable roadmap forward.`;
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

  // Relaxed empty state: if no vocab is selected and user is not in Part 4
  if (!selectedVocab && activePart !== 4) {
    return (
      <div className="space-y-4 text-[#24211E]">
        {/* Navigation Switcher to still allow switching to Tab 4 */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-[#F4EFEA] border border-[#E6E2D8] shadow-xs">
          <button
            onClick={() => setActivePart(1)}
            className="py-2 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold text-[#7A7369] hover:text-[#24211E] transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full bg-black/10 text-[10px] flex items-center justify-center font-black">1</span>
            <span className="truncate">Hiểu từ</span>
          </button>
          <button
            onClick={() => setActivePart(2)}
            className="py-2 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold text-[#7A7369] hover:text-[#24211E] transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full bg-black/10 text-[10px] flex items-center justify-center font-black">2</span>
            <span className="truncate">Dịch 1 câu</span>
          </button>
          <button
            onClick={() => setActivePart(3)}
            className="py-2 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold text-[#7A7369] hover:text-[#24211E] transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full bg-black/10 text-[10px] flex items-center justify-center font-black">3</span>
            <span className="truncate">Dịch 2 câu</span>
          </button>
          <button
            onClick={() => setActivePart(4)}
            className="py-2 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold bg-[#3E4F42] text-white shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-black">4</span>
            <span className="truncate">{activeTask === 'task1' ? "Full Report" : "Full Essay"}</span>
          </button>
        </div>

        <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3.5 bg-white rounded-2xl border border-[#E6E2D8] shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#24211E]">Chưa chọn từ vựng luyện tập</h4>
            <p className="text-xs text-[#7A7369] mt-1 max-w-sm">
              Hãy chọn một từ vựng ở danh sách bên cạnh và nhấn nút "Luyện tập" để học 3 bước (Hiểu từ &rarr; Dịch 1 câu &rarr; Dịch 2 câu), hoặc chuyển sang Tab 4 để viết Full {activeTask === 'task1' ? 'Report' : 'Essay'} theo toàn bộ chủ đề!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActivePart(4)}
            className="mt-2 px-4 py-2 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <FileEdit className="w-4 h-4" />
            <span>Viết Full {activeTask === 'task1' ? 'Report' : 'Essay'} ngay (Tab 4)</span>
          </button>
        </div>
      </div>
    );
  }

  // Pre-extracted data from enriched vocabulary
  const quiz = selectedVocab?.vietnameseQuiz || {
    question: `Nghĩa tiếng Việt chuẩn xác nhất của "${selectedVocab?.word || ''}" là gì?`,
    options: [selectedVocab?.meaning || '', "Làm gia tăng rủi ro", "Giữ nguyên trạng thái", "Bỏ qua vấn đề"],
    correctIndex: 0
  };

  return (
    <div className="space-y-4 text-[#24211E]">
      
      {/* Target Word Overview Ribbon OR Full Essay Topic Ribbon */}
      {activePart === 4 ? (
        <div className="p-3.5 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] uppercase font-black text-[#A67C52] tracking-wider bg-[#FAF5EE] px-2.5 py-0.5 rounded-md border border-[#E6E2D8]">
              {activeTask === 'task1' ? "Task 1 Report Practice" : "Task 2 Full Essay"}
            </span>
            <span className="text-sm sm:text-base font-black text-[#24211E]">{topic?.name || "Chủ đề học thuật"}</span>
            <span className="text-xs text-[#7A7369] font-medium">
              (Mục tiêu: Band {targetBand} • Tối thiểu {activeTask === 'task1' ? '150' : '250'} từ)
            </span>
          </div>

          {activeTask === 'task1' && onOpenChartModal && (
            <button
              type="button"
              onClick={onOpenChartModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#EDF3EE] hover:bg-[#EDF3EE] text-[#334237] border border-[#D1DDD3] text-xs font-bold transition cursor-pointer self-start sm:self-auto shadow-xs"
              title="Xem bảng số liệu biểu đồ Task 1"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#3E4F42]" />
              <span>Xem Biểu Đồ Số Liệu</span>
            </button>
          )}
        </div>
      ) : (
        selectedVocab && (
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

            {/* Từ đồng nghĩa (Synonyms) - Đồng bộ với Flashcard */}
            {selectedVocab.synonyms && selectedVocab.synonyms.length > 0 && (
              <div className="pt-2 border-t border-[#E6E2D8] flex items-center gap-2 flex-wrap">
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
        )
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

            {/* Trắc nghiệm nghĩa tiếng Việt */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#24211E] block">
                Nghĩa tiếng Việt của từ:
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
                        setSynonymInput("");
                      }}
                      className={`p-3 rounded-xl text-xs text-left transition border cursor-pointer flex items-center justify-between gap-2 ${
                        isChecked
                          ? "bg-[#EDF3EE] border-[#D1DDD3] text-[#24211E] font-medium"
                          : "bg-white hover:bg-[#FAF8F5] border-[#E6E2D8] text-[#24211E]"
                      }`}
                    >
                      <span className="flex-1">{String.fromCharCode(65 + idx)}. {option}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-[#3E4F42] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hoặc điền từ đồng nghĩa tiếng Anh */}
            <div className="pt-2 border-t border-[#E6E2D8] space-y-2">
              <label className="text-xs font-medium text-[#24211E] block">
                Hoặc điền từ đồng nghĩa (synonym):
              </label>
              
              <input
                type="text"
                value={synonymInput}
                onChange={(e) => {
                  setSynonymInput(e.target.value);
                  setQuizSelectedIndex(null);
                }}
                placeholder={`Ví dụ: ${selectedVocab.synonyms?.[0] || "alleviate"}...`}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E6E2D8] text-[#24211E] text-xs font-mono focus:outline-none focus:border-[#3E4F42] transition placeholder-[#7A7369]"
              />
            </div>

            {/* Nút hành động */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setQuizSelectedIndex(null);
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
                disabled={quizSelectedIndex === null && !synonymInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-xs shadow-xs transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <span>Kiểm tra</span>
              </button>
            </div>
          </div>

          {/* KẾT QUẢ CHẤM ĐIỂM HIỂU TỪ */}
          {part1Result && (
            <div className={`p-4 rounded-2xl border space-y-3 animate-fadeIn shadow-xs ${
              part1Result.isCorrect
                ? "bg-[#EDF3EE] border-[#D1DDD3]"
                : "bg-[#FAF5EE] border-[#E6E2D8]"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {part1Result.isCorrect ? (
                    <div className="w-8 h-8 rounded-xl bg-white text-[#3E4F42] border border-[#D1DDD3] flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-white text-[#A67C52] border border-[#E6E2D8] flex items-center justify-center shadow-xs">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#24211E]">
                      {part1Result.isCorrect ? "Đạt chuẩn hiểu từ: 100% (Band 8.0+)" : "Cần lưu ý lại nghĩa của từ (40%)"}
                    </h4>
                    <p className="text-xs text-[#7A7369] mt-0.5">{part1Result.feedbackMessage}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePart(2)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
                >
                  <span>Sang Phần 2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
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
