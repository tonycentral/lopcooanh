import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  Copy, 
  Check, 
  Lightbulb, 
  Shuffle, 
  Eye, 
  EyeOff,
  BookOpen,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { evaluatePart2Translation } from '../../services/evaluator';
import { evaluateWithGemini } from '../../services/geminiService';
import { saveHistoryEntry } from '../../services/storage';
import { speakWord } from '../../services/soundEffects';

const AVAILABLE_BANDS = ["6.5", "7.0", "7.5", "8.0", "8.5"];

function UpgradeDetailsBreakdown({ result, targetBand }) {
  if (!result) return null;
  const analysis = result.detailedAnalysis;

  return (
    <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-3.5 animate-fadeIn text-[#24211E]">
      <div className="flex items-center justify-between pb-2 border-b border-[#E6E2D8]">
        <span className="text-xs font-bold text-[#24211E] flex items-center gap-1.5 uppercase tracking-wide">
          <Lightbulb className="w-4 h-4 text-[#A67C52]" />
          Chi tiết các phần nâng cấp chuẩn Band {targetBand}:
        </span>
        <span className="text-[10px] text-[#3E4F42] bg-[#EDF3EE] px-2.5 py-0.5 rounded-full font-mono border border-[#D1DDD3] font-bold">
          Lexical &amp; Grammar Breakdown
        </span>
      </div>

      {/* 1. Vocabulary & Collocations Breakdown */}
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
                    <span className="font-bold text-[#24211E] text-sm tracking-tight">{item.word}</span>
                    <span className="text-[11px] font-mono text-[#3E4F42] font-bold italic">{item.ipa}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] uppercase font-bold text-[#7A7369] px-1.5 py-0.2 rounded bg-[#F4EFEA] border border-[#E6E2D8] font-mono">
                      {item.pos}
                    </span>
                    {item.isTarget && (
                      <span className="text-[9px] uppercase font-bold text-[#3E4F42] bg-[#EDF3EE] px-1.5 py-0.2 rounded border border-[#D1DDD3]">
                        Từ đang luyện
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-[#24211E] leading-relaxed">
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

      {/* 2. Grammar Points */}
      {analysis?.grammarPoints && analysis.grammarPoints.length > 0 && (
        <div className="p-3 rounded-xl bg-white border border-[#E6E2D8] space-y-1.5 text-xs shadow-xs">
          <span className="font-bold text-[#3E4F42] flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <span>⚙️</span> Cấu trúc ngữ pháp học thuật:
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
    </div>
  );
}

export default function SentencePracticeView({
  vocab,
  topic,
  targetBand = "7.0",
  apiKey = "",
  studentEmail = "",
  onSentenceGraded
}) {
  const [userInput, setUserInput] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [viewBand, setViewBand] = useState(null);
  const [showModelSentence, setShowModelSentence] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // Variant management
  const sentenceVariants = useMemo(() => {
    if (vocab?.practiceSentences && vocab.practiceSentences.length > 0) {
      return vocab.practiceSentences;
    }
    if (vocab?.sentencePractice) {
      return [vocab.sentencePractice];
    }
    return [];
  }, [vocab]);

  const [activeVariantIdx, setActiveVariantIdx] = useState(0);

  // Reset when word changes
  useEffect(() => {
    setUserInput("");
    setIsEvaluating(false);
    setEvalResult(null);
    setViewBand(null);
    setShowModelSentence(false);
    setActiveVariantIdx(0);
  }, [vocab?.id, vocab?.word]);

  const activeSentenceData = useMemo(() => {
    if (sentenceVariants.length === 0) return vocab?.sentencePractice || null;
    return sentenceVariants[activeVariantIdx % sentenceVariants.length] || sentenceVariants[0];
  }, [sentenceVariants, activeVariantIdx, vocab]);

  const handleCycleVariant = () => {
    if (sentenceVariants.length <= 1) return;
    setActiveVariantIdx(prev => (prev + 1) % sentenceVariants.length);
    setUserInput("");
    setEvalResult(null);
    setViewBand(null);
    setShowModelSentence(false);
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleGrade = async () => {
    if (!vocab || !userInput.trim()) return;
    setIsEvaluating(true);

    try {
      let res = evaluatePart2Translation(userInput, vocab, targetBand, activeSentenceData);

      if (apiKey) {
        try {
          const aiRes = await evaluateWithGemini("translation_single", {
            targetBand,
            targetWord: vocab.word,
            synonyms: vocab.synonyms,
            topicName: topic?.name,
            vietnamesePrompt: activeSentenceData?.vietnamesePrompt || vocab.vietnamesePrompt,
            modelSentence: activeSentenceData?.modelTranslation || vocab.modelSentence,
            studentSentence: userInput
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

      setEvalResult(res);

      if (res.isTargetMet) {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
      }

      saveHistoryEntry({
        studentEmail,
        type: "translation_single",
        topicName: topic?.name,
        targetWord: vocab.word,
        userSentence: userInput,
        scores: res.scores,
        targetBand,
        isTargetMet: res.isTargetMet
      });

      if (onSentenceGraded) onSentenceGraded();
    } finally {
      setIsEvaluating(false);
    }
  };

  const currentViewBand = viewBand || targetBand;
  const currentUpgradedSentence = useMemo(() => {
    if (!evalResult) return "";
    return (
      activeSentenceData?.bandUpgrades?.[currentViewBand] ||
      vocab?.bandUpgrades?.[currentViewBand] ||
      evalResult.upgradedSentence ||
      activeSentenceData?.modelTranslation ||
      vocab?.modelSentence ||
      ""
    );
  }, [evalResult, currentViewBand, activeSentenceData, vocab]);

  if (!vocab) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 animate-fadeIn select-text">
      
      {/* Exercise Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E2D8] space-y-3.5 shadow-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#E6E2D8] gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-[#24211E] font-medium text-xs sm:text-sm">
            <BookOpen className="w-4 h-4 text-[#3E4F42]" />
            <span>Luyện dịch câu có từ: <strong className="font-serif text-[#3E4F42] text-base">{vocab.word}</strong></span>
          </div>

          {sentenceVariants.length > 1 && (
            <button
              type="button"
              onClick={handleCycleVariant}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[#3E4F42] bg-[#FAF8F5] hover:bg-[#EDF3EE] border border-[#D1DDD3] transition cursor-pointer shadow-2xs"
              title="Đổi sang câu luyện dịch khác"
            >
              <Shuffle className="w-3 h-3 text-[#3E4F42]" />
              <span>Đổi câu khác ({activeVariantIdx + 1}/{sentenceVariants.length})</span>
            </button>
          )}
        </div>

        {/* Vietnamese prompt */}
        <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A67C52]">
              Câu tiếng Việt cần dịch:
            </span>
            {activeSentenceData?.domain && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white text-[#3E4F42] border border-[#E6E2D8] font-medium">
                🏷️ {activeSentenceData.domain}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#24211E] leading-relaxed font-serif font-medium">
            "{activeSentenceData?.vietnamesePrompt || vocab.vietnamesePrompt || `Hãy dịch câu diễn đạt nghĩa của "${vocab.word}": ${vocab.meaning}`}"
          </p>

          <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#7A7369]">Từ bắt buộc:</span>
              <button
                type="button"
                onClick={() => setUserInput(prev => prev ? `${prev} ${vocab.word}` : vocab.word)}
                disabled={Boolean(evalResult)}
                className="px-2 py-0.5 rounded-md bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] text-xs font-mono font-bold hover:bg-[#D1DDD3] transition cursor-pointer disabled:opacity-50"
                title="Bấm để chèn từ này vào ô làm bài"
              >
                + {vocab.word}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowModelSentence(prev => !prev)}
              className="px-2.5 py-1 rounded-lg bg-[#FAF5EE] hover:bg-[#F3EADF] text-[#A67C52] border border-[#E6E2D8] text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              {showModelSentence ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showModelSentence ? "Ẩn câu mẫu" : "Xem câu mẫu"}</span>
            </button>
          </div>

          {/* Model Sentence Drawer */}
          {showModelSentence && (
            <div className="mt-2 p-3 rounded-lg bg-white border border-[#A67C52]/30 space-y-1.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67C52]">
                  Câu mẫu tham khảo (Academic Band 8.0+):
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(activeSentenceData?.modelTranslation || vocab.modelSentence || "", "model_single")}
                  className="p-1 rounded text-[#7A7369] hover:text-[#24211E] transition"
                  title="Copy câu mẫu"
                >
                  {copiedKey === "model_single" ? <Check className="w-3 h-3 text-[#3E4F42]" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-xs font-mono text-[#24211E] italic">
                "{activeSentenceData?.modelTranslation || vocab.modelSentence}"
              </p>
            </div>
          )}
        </div>

        {/* Translation textarea */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-[#7A7369] uppercase tracking-wider block">
            Bản dịch tiếng Anh của bạn:
          </label>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isEvaluating || Boolean(evalResult)}
            placeholder={`Gõ câu tiếng Anh hoàn chỉnh có chứa từ "${vocab.word}"...`}
            rows={3}
            className="w-full p-3 rounded-xl border border-[#E6E2D8] focus:border-[#3E4F42] focus:ring-1 focus:ring-[#3E4F42] bg-[#FAF8F5] text-xs sm:text-sm text-[#24211E] outline-none transition font-sans resize-none disabled:opacity-70"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setUserInput("");
              setEvalResult(null);
              setViewBand(null);
            }}
            className="px-4 py-2 rounded-xl border border-[#E6E2D8] bg-white hover:bg-[#FAF8F5] text-[#7A7369] hover:text-[#24211E] text-xs font-semibold transition cursor-pointer"
          >
            Làm lại
          </button>

          <button
            type="button"
            onClick={handleGrade}
            disabled={isEvaluating || Boolean(evalResult) || !userInput.trim()}
            className="px-5 py-2 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-semibold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Đang chấm điểm...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Chấm điểm câu (AI Examiner)</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Results & Upgraded Sentences */}
      {evalResult && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D1DDD3] shadow-xs space-y-4 animate-fadeIn">
          
          {/* Score Badge Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold ${
                evalResult.isTargetMet ? "bg-[#3E4F42] text-white" : "bg-[#A67C52] text-white"
              }`}>
                <span className="text-[9px] uppercase tracking-wider opacity-90">BAND</span>
                <span className="text-xl leading-none">{evalResult.scores?.overallBand}</span>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#24211E]">
                  {evalResult.isTargetMet ? "Đạt chuẩn Band mục tiêu!" : "Cần hoàn thiện thêm để chạm Band mục tiêu"}
                </h4>
                <p className="text-xs text-[#7A7369]">
                  Lexical: {evalResult.scores?.lexicalResource} • Grammar: {evalResult.scores?.grammarRange}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3]">
              Mục tiêu: Band {targetBand}
            </span>
          </div>

          {/* Upgraded Sentence Card */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#D1DDD3] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#E6E2D8]">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#3E4F42]">
                  <Sparkles className="w-3.5 h-3.5 text-[#3E4F42]" />
                  <span>CÂU NÂNG CẤP CHUẨN BAND {currentViewBand}:</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => speakWord(currentUpgradedSentence)}
                  className="p-1.5 rounded-lg bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-[#3E4F42] transition cursor-pointer"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(currentUpgradedSentence, `upgraded_${currentViewBand}`)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-[#7A7369] text-xs transition cursor-pointer shadow-xs"
                >
                  {copiedKey === `upgraded_${currentViewBand}` ? <Check className="w-3 h-3 text-[#3E4F42]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === `upgraded_${currentViewBand}` ? "Đã copy" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Band Level Selector */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-[#7A7369] mr-1">Xem câu theo Band:</span>
              {AVAILABLE_BANDS.map((b) => {
                const isSelected = b === currentViewBand;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setViewBand(b)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition cursor-pointer ${
                      isSelected
                        ? "bg-[#3E4F42] text-white shadow-xs"
                        : "bg-white text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8]"
                    }`}
                  >
                    Band {b}
                  </button>
                );
              })}
            </div>

            {/* Upgraded Sentence Content */}
            <div className="p-3 rounded-lg bg-white border border-[#E6E2D8] shadow-xs">
              <p className="text-xs sm:text-sm font-mono text-[#24211E] italic font-semibold leading-relaxed">
                "{currentUpgradedSentence}"
              </p>
            </div>
          </div>

          {/* Upgrade Breakdown Analysis */}
          <UpgradeDetailsBreakdown 
            result={{ 
              ...evalResult, 
              upgradedSentence: currentUpgradedSentence, 
              detailedAnalysis: evalResult.detailedAnalysis 
            }} 
            targetBand={currentViewBand} 
          />

        </div>
      )}

    </div>
  );
}
