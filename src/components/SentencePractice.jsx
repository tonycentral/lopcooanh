import React, { useState, useEffect } from 'react';
import { 
  PenTool, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  HelpCircle, 
  ArrowRight, 
  Bot,
  Lightbulb,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { evaluateVocabularySentence, evaluateCoherenceSentence } from '../services/evaluator';
import { evaluateWithGemini } from '../services/geminiService';
import { saveHistoryEntry } from '../services/storage';
import EvaluationResult from './EvaluationResult';

export default function SentencePractice({ 
  topic, 
  targetBand, 
  selectedVocab, 
  onSelectVocab,
  apiKey,
  studentEmail,
  onSentenceGraded 
}) {
  const [activeStep, setActiveStep] = useState("vocab"); // "vocab" or "coherence"

  // Step 1: Vocab State
  const [vocabInput, setVocabInput] = useState("");
  const [isEvaluatingVocab, setIsEvaluatingVocab] = useState(false);
  const [vocabResult, setVocabResult] = useState(null);

  // Step 2: Coherence State
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [coherenceInput, setCoherenceInput] = useState("");
  const [isEvaluatingCoherence, setIsEvaluatingCoherence] = useState(false);
  const [coherenceResult, setCoherenceResult] = useState(null);

  const challenges = topic?.coherenceChallenges || [];
  const activeChallenge = challenges[currentChallengeIndex] || challenges[0];

  // Auto-fill sentence starter or sample if wanted
  useEffect(() => {
    setVocabResult(null);
    setCoherenceResult(null);
  }, [selectedVocab, topic]);

  // Handle Step 1 evaluation
  const handleEvaluateVocab = async () => {
    if (!vocabInput.trim()) return;

    setIsEvaluatingVocab(true);

    try {
      // 1. Try Gemini AI if API key is present
      let evalData = null;
      if (apiKey) {
        evalData = await evaluateWithGemini("vocabulary", {
          sentence: vocabInput,
          targetWord: selectedVocab?.word || "",
          synonyms: selectedVocab?.synonyms || [],
          topicName: topic.name,
          targetBand
        }, apiKey);
      }

      // 2. Fallback to built-in NLP engine
      if (!evalData) {
        evalData = evaluateVocabularySentence(
          vocabInput,
          selectedVocab?.word || "",
          selectedVocab?.synonyms || [],
          targetBand
        );
      }

      setVocabResult(evalData);

      // Trigger celebration if target band met
      if (evalData.isTargetMet) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }

      // Save to history
      saveHistoryEntry({
        studentEmail,
        type: "vocabulary",
        topicName: topic.name,
        targetWord: selectedVocab?.word,
        targetBand,
        sentence: vocabInput,
        scores: evalData.scores,
        isTargetMet: evalData.isTargetMet
      });

      if (onSentenceGraded) onSentenceGraded();
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluatingVocab(false);
    }
  };

  // Handle Step 2 evaluation
  const handleEvaluateCoherence = async () => {
    if (!coherenceInput.trim() || !activeChallenge) return;

    setIsEvaluatingCoherence(true);

    try {
      let evalData = null;
      if (apiKey) {
        evalData = await evaluateWithGemini("coherence", {
          sentenceA: activeChallenge.sentenceA,
          sentenceB: coherenceInput,
          topicName: topic.name,
          prompt: activeChallenge.prompt,
          targetBand
        }, apiKey);
      }

      if (!evalData) {
        evalData = evaluateCoherenceSentence(
          activeChallenge.sentenceA,
          coherenceInput,
          activeChallenge,
          targetBand
        );
      }

      setCoherenceResult(evalData);

      if (evalData.isTargetMet) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      saveHistoryEntry({
        studentEmail,
        type: "coherence",
        topicName: topic.name,
        targetBand,
        sentenceA: activeChallenge.sentenceA,
        sentenceB: coherenceInput,
        scores: evalData.scores,
        isTargetMet: evalData.isTargetMet
      });

      if (onSentenceGraded) onSentenceGraded();
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluatingCoherence(false);
    }
  };

  const insertText = (text, target) => {
    if (target === "vocab") {
      setVocabInput(prev => prev ? `${prev} ${text}` : text);
    } else {
      setCoherenceInput(prev => prev ? `${text} ${prev}` : `${text} `);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Steps Switcher Tabs */}
      <div className="flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
        <button
          onClick={() => setActiveStep("vocab")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeStep === "vocab"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>Bước 1: Tập Viết Với Từ Vựng &amp; Từ Đồng Nghĩa</span>
          {vocabResult && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveStep("coherence")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeStep === "coherence"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-pink-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Bước 2: Viết Câu Tiếp Theo &amp; Chấm Coherence</span>
          {coherenceResult && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* ================= STEP 1: VOCABULARY PRACTICE ================= */}
      {activeStep === "vocab" && (
        <div className="space-y-4">
          {/* Target Word Info Header */}
          {selectedVocab ? (
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-indigo-500/30 shadow-lg space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Từ Vựng Đang Luyện:</span>
                  <span className="text-lg font-black text-white">{selectedVocab.word}</span>
                  {selectedVocab.ipa && (
                    <span className="text-xs font-mono text-indigo-300 italic font-semibold">
                      {selectedVocab.ipa}
                    </span>
                  )}
                  <span className="text-xs text-slate-400">({selectedVocab.partOfSpeech})</span>
                </div>

                <div className="text-xs text-slate-300 font-medium">
                  {selectedVocab.meaning}
                </div>
              </div>

              {/* Synonym chips for quick insertion */}
              {selectedVocab.synonyms && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-700/60">
                  <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-pink-400" /> Nhấn để chèn từ đồng nghĩa:
                  </span>
                  {selectedVocab.synonyms.map((syn, idx) => (
                    <button
                      key={idx}
                      onClick={() => insertText(syn, "vocab")}
                      className="text-xs px-2.5 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 font-medium transition cursor-pointer"
                    >
                      + {syn}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Hãy chọn một từ vựng ở bảng trên để tập viết câu cùng từ đó!
            </div>
          )}

          {/* Writing Textarea */}
          <div className="relative">
            <textarea
              rows={4}
              value={vocabInput}
              onChange={(e) => setVocabInput(e.target.value)}
              placeholder={`Viết 1 câu học thuật về chủ đề "${topic.name}" sử dụng từ "${selectedVocab?.word || "từ vựng"}" hoặc từ đồng nghĩa của nó...`}
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition resize-y font-mono leading-relaxed"
            />

            <div className="absolute right-3 bottom-3 flex items-center gap-3 text-xs text-slate-400 bg-slate-900/90 px-2 py-1 rounded-lg">
              <span>{vocabInput.split(/\s+/).filter(Boolean).length} từ</span>
              <span>•</span>
              <span>{vocabInput.length} ký tự</span>
            </div>
          </div>

          {/* Quick Academic Transitions */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Gợi ý mở đầu câu:</span>
            {["It is imperative that", "Strict regulations can", "Critics contend that", "In order to mitigate"].map((starter, i) => (
              <button
                key={i}
                onClick={() => insertText(starter, "vocab")}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition cursor-pointer"
              >
                + {starter}
              </button>
            ))}
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setVocabInput("")}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              Xoá viết lại
            </button>

            <button
              onClick={handleEvaluateVocab}
              disabled={isEvaluatingVocab || !vocabInput.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 cursor-pointer"
            >
              {isEvaluatingVocab ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang chấm điểm câu...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Chấm Điểm &amp; Nâng Cấp Câu</span>
                </>
              )}
            </button>
          </div>

          {/* Evaluation Result */}
          {vocabResult && (
            <EvaluationResult
              result={vocabResult}
              type="vocabulary"
              onNextStep={() => setActiveStep("coherence")}
              onRetry={() => {
                setVocabResult(null);
                setVocabInput("");
              }}
            />
          )}
        </div>
      )}

      {/* ================= STEP 2: COHERENCE PRACTICE ================= */}
      {activeStep === "coherence" && (
        <div className="space-y-4">
          
          {/* Challenge Selector & Model Sentence A */}
          {activeChallenge && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-pink-500/30 shadow-xl space-y-4">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
                  <Layers className="w-4 h-4" />
                  <span>Thử Thách Coherence Task 2 #{currentChallengeIndex + 1}</span>
                </div>

                {challenges.length > 1 && (
                  <div className="flex items-center gap-1">
                    {challenges.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentChallengeIndex(idx);
                          setCoherenceResult(null);
                        }}
                        className={`w-6 h-6 rounded-lg text-xs font-bold transition cursor-pointer ${
                          currentChallengeIndex === idx
                            ? "bg-pink-600 text-white"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Model Sentence A */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    Câu Mẫu Chuẩn Band {targetBand} (Sentence A)
                  </span>
                  <span className="text-xs text-slate-400 italic">
                    {activeChallenge.sentenceARole}
                  </span>
                </div>
                <p className="text-sm text-slate-100 font-mono italic leading-relaxed pt-1">
                  "{activeChallenge.sentenceA}"
                </p>
              </div>

              {/* Prompt Instruction */}
              <div className="p-3 rounded-xl bg-pink-950/20 border border-pink-800/40 text-xs text-pink-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-pink-400" />
                  Nhiệm vụ viết Câu B tiếp theo:
                </div>
                <p className="leading-relaxed">
                  {activeChallenge.prompt}
                </p>
              </div>

              {/* Suggested Linking Devices */}
              {activeChallenge.linkingSuggestions && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Gợi ý từ nối chuyển tiếp (Nhấn để chèn vào đầu câu B):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeChallenge.linkingSuggestions.map((link, idx) => (
                      <button
                        key={idx}
                        onClick={() => insertText(link, "coherence")}
                        className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium transition cursor-pointer"
                      >
                        + {link}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Textarea for Sentence B */}
          <div className="relative">
            <textarea
              rows={4}
              value={coherenceInput}
              onChange={(e) => setCoherenceInput(e.target.value)}
              placeholder="Viết câu tiếp theo (Sentence B) có liên kết chặt chẽ với Câu A ở trên..."
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition resize-y font-mono leading-relaxed"
            />

            <div className="absolute right-3 bottom-3 flex items-center gap-3 text-xs text-slate-400 bg-slate-900/90 px-2 py-1 rounded-lg">
              <span>{coherenceInput.split(/\s+/).filter(Boolean).length} từ</span>
              <span>•</span>
              <span>{coherenceInput.length} ký tự</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setCoherenceInput("")}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              Xoá viết lại
            </button>

            <button
              onClick={handleEvaluateCoherence}
              disabled={isEvaluatingCoherence || !coherenceInput.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-pink-600/30 transition disabled:opacity-50 cursor-pointer"
            >
              {isEvaluatingCoherence ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang chấm Coherence...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Chấm Điểm Coherence &amp; Mạch Lạc</span>
                </>
              )}
            </button>
          </div>

          {/* Coherence Evaluation Result */}
          {coherenceResult && (
            <div className="space-y-4">
              {/* Preview Unified Mini-Paragraph */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Đoạn văn kết hợp hoàn chỉnh (Sentence A + Sentence B):
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-serif">
                  <span className="text-slate-400">{activeChallenge.sentenceA} </span>
                  <span className="text-emerald-300 font-semibold underline decoration-emerald-500/50">{coherenceInput}</span>
                </p>
              </div>

              <EvaluationResult
                result={coherenceResult}
                type="coherence"
                onNextStep={() => {
                  if (currentChallengeIndex < challenges.length - 1) {
                    setCurrentChallengeIndex(prev => prev + 1);
                    setCoherenceResult(null);
                    setCoherenceInput("");
                  } else {
                    setActiveStep("vocab");
                  }
                }}
                onRetry={() => {
                  setCoherenceResult(null);
                  setCoherenceInput("");
                }}
              />
            </div>
          )}
        </div>
      )}

    </div>
  );
}
