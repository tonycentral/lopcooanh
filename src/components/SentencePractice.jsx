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
  Award
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
  const twoSentencePracticeData = selectedVocab?.twoSentencePractice;

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

  // Mức Band đang xem và cặp câu nâng cấp tương ứng (Phần 3)
  const currentPart3Band = part3ViewBand || targetBand;
  const currentPart3Pair = useMemo(() => {
    if (!part3Result) return "";
    return (
      part3Result.bandUpgrades?.[currentPart3Band] ||
      twoSentencePracticeData?.bandUpgrades?.[currentPart3Band] ||
      (currentPart3Band === targetBand ? part3Result.upgradedPair : "") ||
      part3Result.upgradedPair ||
      ""
    );
  }, [part3Result, currentPart3Band, twoSentencePracticeData, targetBand]);

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
      <div className="space-y-4">
        {/* Navigation Switcher to still allow switching to Tab 4 */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
          <button
            onClick={() => setActivePart(1)}
            className="py-2 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold text-slate-400 hover:text-white transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-black">1</span>
            <span className="truncate">Hiểu từ</span>
          </button>
          <button
            onClick={() => setActivePart(2)}
            className="py-2 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold text-slate-400 hover:text-white transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-black">2</span>
            <span className="truncate">Dịch 1 câu</span>
          </button>
          <button
            onClick={() => setActivePart(3)}
            className="py-2 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold text-slate-400 hover:text-white transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-black">3</span>
            <span className="truncate">Dịch 2 câu</span>
          </button>
          <button
            onClick={() => setActivePart(4)}
            className="py-2 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-black">4</span>
            <span className="truncate">{activeTask === 'task1' ? "Full Report" : "Full Essay"}</span>
          </button>
        </div>

        <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3.5 bg-slate-900/60 rounded-2xl border border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Chưa chọn từ vựng luyện tập</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Hãy chọn một từ vựng ở danh sách bên cạnh và nhấn nút "Luyện tập" để học 3 bước (Hiểu từ &rarr; Dịch 1 câu &rarr; Dịch 2 câu), hoặc chuyển sang Tab 4 để viết Full {activeTask === 'task1' ? 'Report' : 'Essay'} theo toàn bộ chủ đề!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActivePart(4)}
            className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
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
    <div className="space-y-4">
      
      {/* Target Word Overview Ribbon OR Full Essay Topic Ribbon */}
      {activePart === 4 ? (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-slate-900 border border-indigo-500/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] uppercase font-black text-indigo-300 tracking-wider bg-indigo-500/20 px-2.5 py-0.5 rounded-md border border-indigo-500/30">
              {activeTask === 'task1' ? "Task 1 Report Practice" : "Task 2 Full Essay"}
            </span>
            <span className="text-sm sm:text-base font-black text-white">{topic?.name || "Chủ đề học thuật"}</span>
            <span className="text-xs text-indigo-200/80 font-medium">
              (Mục tiêu: Band {targetBand} • Tối thiểu {activeTask === 'task1' ? '150' : '250'} từ)
            </span>
          </div>

          {activeTask === 'task1' && onOpenChartModal && (
            <button
              type="button"
              onClick={onOpenChartModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition cursor-pointer self-start sm:self-auto"
              title="Xem bảng số liệu biểu đồ Task 1"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Xem Biểu Đồ Số Liệu</span>
            </button>
          )}
        </div>
      ) : (
        selectedVocab && (
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
        )
      )}

      {/* 4-Part Navigation Switcher */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
        {/* Tab Phần 1 */}
        <button
          onClick={() => setActivePart(1)}
          className={`py-2 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${
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
          className={`py-2 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${
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
          className={`py-2 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${
            activePart === 3
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-black shrink-0">3</span>
          <span className="truncate">Dịch 2 câu</span>
          {part3Result && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          )}
        </button>

        {/* Tab Phần 4: Full Essay / Report */}
        <button
          onClick={() => setActivePart(4)}
          className={`py-2 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${
            activePart === 4
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-black shrink-0">4</span>
          <span className="truncate">{activeTask === 'task1' ? "Full Report" : "Full Essay"}</span>
          {essayResult && (
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

              {/* CÂU NÂNG CẤP ĐÚNG THEO BAND MỤC TIÊU & CHỌN BAND CAO HƠN */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-blue-500/30 space-y-3">
                {/* Header thanh công cụ câu nâng cấp */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>CÂU NÂNG CẤP CHUẨN BAND {currentPart2Band}:</span>
                    </div>

                    {parseFloat(currentPart2Band) > parseFloat(targetBand) ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold flex items-center gap-1">
                        <span>🚀</span> Nâng cấp cao hơn (+{(parseFloat(currentPart2Band) - parseFloat(targetBand)).toFixed(1)})
                      </span>
                    ) : currentPart2Band === targetBand ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                        🎯 Band mục tiêu
                      </span>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(currentPart2Sentence, `part2_upgraded_${currentPart2Band}`)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    {copiedKey === `part2_upgraded_${currentPart2Band}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === `part2_upgraded_${currentPart2Band}` ? "Đã copy" : "Copy câu"}</span>
                  </button>
                </div>

                {/* Thanh Nút Chọn Xem Theo Các Mức Band */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
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
                                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400"
                                : "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                              : isHigher
                                ? "bg-slate-950 text-purple-300 hover:bg-purple-950/60 hover:text-purple-200 border border-purple-500/30"
                                : isTarget
                                  ? "bg-slate-950 text-blue-300 hover:bg-slate-800 border border-blue-500/40"
                                  : "bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
                          }`}
                          title={`Xem câu nâng cấp chuẩn Band ${band}${isTarget ? ' (Mục tiêu của bạn)' : isHigher ? ' (Cao hơn mục tiêu)' : ''}`}
                        >
                          <span>Band {band}</span>
                          {isHigher && !isSelected && <span className="text-[9px]">⭐</span>}
                          {isTarget && !isSelected && <span className="text-[9px] text-blue-400">•</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Nội dung câu nâng cấp */}
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80">
                  <p className="text-xs sm:text-sm font-mono text-emerald-300 italic font-semibold leading-relaxed">
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

              {/* CẶP CÂU NÂNG CẤP ĐÚNG THEO BAND MỤC TIÊU & CHỌN BAND CAO HƠN */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-blue-500/30 space-y-3">
                {/* Header thanh công cụ cặp câu nâng cấp */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>CẶP CÂU NÂNG CẤP CHUẨN BAND {currentPart3Band}:</span>
                    </div>

                    {parseFloat(currentPart3Band) > parseFloat(targetBand) ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold flex items-center gap-1">
                        <span>🚀</span> Nâng cấp cao hơn (+{(parseFloat(currentPart3Band) - parseFloat(targetBand)).toFixed(1)})
                      </span>
                    ) : currentPart3Band === targetBand ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                        🎯 Band mục tiêu
                      </span>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(currentPart3Pair, `part3_upgraded_${currentPart3Band}`)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    {copiedKey === `part3_upgraded_${currentPart3Band}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === `part3_upgraded_${currentPart3Band}` ? "Đã copy" : "Copy cặp câu"}</span>
                  </button>
                </div>

                {/* Thanh Nút Chọn Xem Theo Các Mức Band */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
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
                                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400"
                                : "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                              : isHigher
                                ? "bg-slate-950 text-purple-300 hover:bg-purple-950/60 hover:text-purple-200 border border-purple-500/30"
                                : isTarget
                                  ? "bg-slate-950 text-blue-300 hover:bg-slate-800 border border-blue-500/40"
                                  : "bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
                          }`}
                          title={`Xem cặp câu nâng cấp chuẩn Band ${band}${isTarget ? ' (Mục tiêu của bạn)' : isHigher ? ' (Cao hơn mục tiêu)' : ''}`}
                        >
                          <span>Band {band}</span>
                          {isHigher && !isSelected && <span className="text-[9px]">⭐</span>}
                          {isTarget && !isSelected && <span className="text-[9px] text-blue-400">•</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Nội dung cặp câu nâng cấp */}
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80">
                  <p className="text-xs sm:text-sm font-mono text-emerald-300 italic font-semibold leading-relaxed">
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

      {/* ========================================================================= */}
      {/* ==================== PHẦN 4: VIẾT FULL ESSAY / FULL REPORT ============== */}
      {/* ========================================================================= */}
      {activePart === 4 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Main Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
            
            {/* Header: Title + Timer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-sm sm:text-base">
                  <FileText className="w-4 h-4" />
                  <span>Phần 4: Viết Full {isTask1 ? "Report (Task 1)" : "Essay (Task 2)"}</span>
                </div>
                <p className="text-xs text-slate-400">
                  Vận dụng toàn diện từ vựng Band 8.0 của chủ đề để hoàn thiện bài viết hoàn chỉnh.
                </p>
              </div>

              {/* Countdown Timer Widget */}
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className={`font-mono text-sm font-bold ${essayTimeLeft < 300 ? "text-red-400 animate-pulse" : "text-amber-300"}`}>
                  {formatTimer(essayTimeLeft)}
                </span>
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(prev => !prev)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                  title={isTimerRunning ? "Tạm dừng đồng hồ" : "Bắt đầu tính giờ"}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setEssayTimeLeft(isTask1 ? 20 * 60 : 40 * 60);
                  }}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Đặt lại đồng hồ về ban đầu"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Banner Khuyên Dùng: Pop-up Quy Trình Bóc Tách Từng Bước */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/90 via-blue-950/80 to-purple-950/90 border border-indigo-500/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-black text-white">Quy Trình Bóc Tách Viết Bài Chuẩn Giám Khảo</span>
                    <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full font-bold border border-indigo-400/30">
                      {isTask1 ? "6 Bước Task 1" : "7 Bước Task 2"}
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-400/30">
                      ⭐ Khuyên xem trước khi viết
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                    Trình tự các bước chuẩn thi thật: Phân tích đề &rarr; Dàn ý &amp; Từ vựng &rarr; Mở bài &rarr; Thân bài 1 &rarr; Thân bài 2 &rarr; Kết bài &rarr; Soát lỗi.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsProcessModalOpen(true)}
                className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-950/50 transition cursor-pointer shrink-0 ring-1 ring-white/20 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Mở Pop-up Quy Trình Luyện</span>
              </button>
            </div>

            {/* Prompt Quote Display */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                  <span>📌</span> Đề bài chính thức ({topic?.tag || (isTask1 ? 'IELTS Academic Task 1' : 'IELTS Writing Task 2')}):
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Yêu cầu tối thiểu: {minWordsRequired} từ
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium italic leading-relaxed pl-2 border-l-2 border-blue-500/50">
                "{topic?.ieltsPrompt || 'Đề bài chưa được cập nhật'}"
              </p>
            </div>

            {/* Live Target Words Checklist Tracker */}
            <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Theo dõi từ vựng Band 8.0 trong bài ({usedWordsCount}/{topicVocabs.length}):
                </span>
                <span className="text-[10px] text-slate-400 italic">
                  (Bấm vào từ để chèn nhanh vào bài)
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1 scrollbar-thin">
                {topicVocabs.map((vocab) => {
                  const used = isWordUsed(vocab.word, vocab.synonyms);
                  return (
                    <button
                      key={vocab.id || vocab.word}
                      type="button"
                      onClick={() => insertIntoEssay(vocab.word)}
                      className={`text-[11px] px-2 py-1 rounded-lg border font-mono transition cursor-pointer flex items-center gap-1 ${
                        used
                          ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-bold shadow-sm"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:border-blue-500/50 hover:text-white"
                      }`}
                      title={`Nghĩa: ${vocab.meaning || ''} • Bấm để chèn`}
                    >
                      {used ? <Check className="w-3 h-3 text-emerald-400" /> : <Plus className="w-3 h-3 text-slate-500" />}
                      <span>{vocab.word}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Writing Scaffold / Outline quick inserters */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <span>⚡</span> Khung dàn ý &amp; Liên từ học thuật hỗ trợ viết nhanh:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => insertOutlineScaffold()}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isTask1 ? "Chèn Khung Task 1 (3-4 đoạn)" : "Chèn Khung Essay (4 đoạn tiêu chuẩn)"}</span>
                </button>

                {quickConnectors.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => insertIntoEssay(item.text)}
                    className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-medium transition cursor-pointer"
                    title={item.tip}
                  >
                    + {item.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-2">
              <div className="relative">
                <textarea
                  value={essayInput}
                  onChange={(e) => setEssayInput(e.target.value)}
                  placeholder={
                    isTask1
                      ? "Bắt đầu viết bài Report Task 1 tại đây (tối thiểu 150 từ)... Vận dụng các từ vựng Band 8.0 và liên từ chuyển tiếp."
                      : "Bắt đầu viết bài Full Essay Task 2 tại đây (tối thiểu 250 từ)... Hãy chia bài viết thành 4 đoạn văn mạch lạc: Mở bài, Thân bài 1, Thân bài 2 và Kết bài."
                  }
                  rows={14}
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-600 font-sans text-xs sm:text-sm leading-relaxed outline-none transition resize-y shadow-inner"
                />
              </div>

              {/* Bottom Bar: Word Count Tracker & Submit Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold border flex items-center gap-1.5 ${
                    currentWordCount >= minWordsRequired
                      ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                      : "bg-amber-950/60 border-amber-500/50 text-amber-300"
                  }`}>
                    {currentWordCount >= minWordsRequired ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>{currentWordCount} / {minWordsRequired} từ</span>
                    {currentWordCount < minWordsRequired && (
                      <span className="text-[10px] font-normal text-amber-400/80">
                        (cần thêm {minWordsRequired - currentWordCount} từ)
                      </span>
                    )}
                  </span>

                  <span className="text-[11px] text-slate-400">
                    Đoạn văn: <strong className="text-white">{essayParagraphCount}</strong> đoạn
                  </span>

                  {essayInput.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này để làm lại từ đầu không?")) {
                          setEssayInput("");
                          setEssayResult(null);
                        }
                      }}
                      className="text-[11px] text-slate-400 hover:text-red-400 transition underline cursor-pointer ml-1"
                    >
                      Xóa làm lại
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleGradeEssay}
                  disabled={isEvaluatingEssay || currentWordCount < 25}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg cursor-pointer ${
                    currentWordCount < 25
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
                      : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-indigo-600/30 ring-1 ring-white/20 active:scale-95"
                  }`}
                >
                  {isEvaluatingEssay ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Giám khảo AI đang chấm 4 tiêu chí...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Nộp bài &amp; Chấm điểm chuẩn IELTS</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* ================= ESSAY EVALUATION RESULTS ================= */}
          {essayResult && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-fadeIn">
              
              {/* Overall Band Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shrink-0">
                    <Award className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Kết quả chấm điểm toàn diện {isTask1 ? 'Task 1' : 'Task 2'}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white font-mono">
                        Band {essayResult.scores?.overallBand || "6.5"}
                      </span>
                      <span className="text-xs text-slate-400">
                        (Mục tiêu của bạn: Band {targetBand})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    (essayResult.scores?.overallBand || 0) >= parseFloat(targetBand)
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  }`}>
                    {(essayResult.scores?.overallBand || 0) >= parseFloat(targetBand)
                      ? "✓ Đạt mục tiêu đề ra"
                      : "Cần cải thiện thêm"}
                  </span>
                </div>
              </div>

              {/* 4 IELTS Criteria Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* TR / TA */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isTask1 ? "Task Achievement (TA)" : "Task Response (TR)"}
                  </span>
                  <div className="text-lg font-black text-blue-400 font-mono">
                    {essayResult.scores?.taskResponse?.toFixed(1) || "6.5"}
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {essayResult.wordCount} từ • {essayResult.paragraphCount} đoạn
                  </span>
                </div>

                {/* CC */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Coherence &amp; Cohesion (CC)
                  </span>
                  <div className="text-lg font-black text-emerald-400 font-mono">
                    {essayResult.scores?.coherenceCohesion?.toFixed(1) || "6.5"}
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {essayResult.detectedCohesiveDevices?.length || 0} liên từ mạch lạc
                  </span>
                </div>

                {/* LR */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Lexical Resource (LR)
                  </span>
                  <div className="text-lg font-black text-purple-400 font-mono">
                    {essayResult.scores?.lexicalResource?.toFixed(1) || "6.5"}
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {essayResult.usedTargetWords?.length || 0} từ Band 8.0
                  </span>
                </div>

                {/* GRA */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Grammar Range (GRA)
                  </span>
                  <div className="text-lg font-black text-amber-400 font-mono">
                    {essayResult.scores?.grammarRange?.toFixed(1) || "6.5"}
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {essayResult.detectedStructures?.length || 0} cấu trúc phức hợp
                  </span>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Strengths */}
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Điểm mạnh của bài viết (Strengths):
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {essayResult.strengths?.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Điểm cần tối ưu nâng Band (Improvements):
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {essayResult.improvements?.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Paragraph-by-paragraph examiner feedback */}
              {essayResult.paragraphFeedbacks && essayResult.paragraphFeedbacks.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wide flex items-center gap-1.5">
                    <span>📑</span> Nhận xét chi tiết cấu trúc từng đoạn văn:
                  </span>
                  <div className="space-y-2.5">
                    {essayResult.paragraphFeedbacks.map((pf) => (
                      <div key={pf.index} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-blue-600/30 text-blue-300 text-[10px] flex items-center justify-center font-bold">
                              {pf.index}
                            </span>
                            {pf.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {pf.wordCount} từ • {pf.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 pl-5 leading-relaxed">
                          💡 <strong>Lời khuyên giám khảo:</strong> {pf.tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Model Essay toggle */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModelEssay(prev => !prev)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>Bài mẫu tham khảo Band 8.5+ cho đề bài này</span>
                  </span>
                  <span>{showModelEssay ? "Thu gọn ▲" : "Xem bài mẫu ▼"}</span>
                </button>

                {showModelEssay && (
                  <div className="mt-2.5 p-4 rounded-xl bg-slate-950/90 border border-purple-500/30 space-y-3 text-xs leading-relaxed animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                        Sample Model Essay (Exemplary Band 8.5+ Answer)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(getModelEssayText(), 'model-essay')}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'model-essay' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Sao chép bài mẫu</span>
                      </button>
                    </div>

                    <div className="text-slate-300 space-y-2 whitespace-pre-line font-serif text-xs sm:text-sm">
                      {getModelEssayText()}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* Pop-up Quy Trình Viết Bài Từng Bước Chuẩn Giám Khảo */}
      <WritingProcessModal
        isOpen={isProcessModalOpen}
        onClose={() => setIsProcessModalOpen(false)}
        topic={topic}
        activeTask={activeTask}
        targetBand={targetBand}
        onInsertStepText={(text) => insertIntoEssay(text)}
        onApplyFullDraft={(fullText) => setEssayInput(fullText)}
      />

    </div>
  );
}
