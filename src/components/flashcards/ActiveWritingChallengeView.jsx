// src/components/flashcards/ActiveWritingChallengeView.jsx
// Inspired by OpenQuiz.ai's "Use words to speak/write actively"
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Lightbulb, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  ArrowRight,
  Zap,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playCorrectSound, playIncorrectSound } from '../../services/soundEffects';

// Common grammatical traps in Vietnamese learner sentences
function detectCommonGrammarFlaws(sentence) {
  const flaws = [];
  const lower = sentence.toLowerCase();

  // Double past tense: "did not went", "did not gave", "didn't had", etc.
  const doublePastRegex = /\b(did not|didn't|does not|doesn't)\s+(went|gave|saw|had|took|came|made|bought|ate|drank|wrote|felt)\b/i;
  const doublePastMatch = sentence.match(doublePastRegex);
  if (doublePastMatch) {
    flaws.push({
      type: 'double_tense',
      title: 'Lỗi chia thì quá khứ 2 lần (Double Past Tense)',
      detail: `Bạn dùng "${doublePastMatch[0]}" - Trợ động từ "did/didn't" đã mang thì quá khứ, động từ theo sau phải là nguyên mẫu (bare infinitive).`,
      hint: `Sửa thành "${doublePastMatch[1]} + động từ nguyên mẫu"`
    });
  }

  // Subject-verb agreement basics: "they is", "people is", "he don't"
  if (/\b(they|we|people|children|students)\s+is\b/i.test(lower)) {
    flaws.push({
      type: 'sv_agreement',
      title: 'Chủ ngữ số nhiều đi với "is"',
      detail: 'Chủ ngữ số nhiều cần đi với động từ to be "are" hoặc "were".'
    });
  }
  if (/\b(he|she|it|everyone|everybody)\s+don't\b/i.test(lower)) {
    flaws.push({
      type: 'sv_agreement',
      title: 'Chủ ngữ số ít đi với "don\'t"',
      detail: 'Chủ ngữ ngôi thứ ba số ít cần đi với "doesn\'t".'
    });
  }

  // Very + extreme adjective (e.g. very exorbitant, very colossal, very crucial)
  if (/\bvery\s+(exorbitant|colossal|astronomical|indispensable|paramount|crucial|essential)\b/i.test(lower)) {
    flaws.push({
      type: 'collocation',
      title: 'Không dùng "very" trước tính từ tuyệt đối',
      detail: 'Các tính từ cấp độ C1 như exorbitant, colossal đã mang nghĩa "rất lớn/rất đắt". Không cần thêm "very".'
    });
  }

  return flaws;
}

export default function ActiveWritingChallengeView({
  card,
  topic,
  onNextWord,
  soundEnabled = true
}) {
  const [studentSentence, setStudentSentence] = useState('');
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showBandUpgrade, setShowBandUpgrade] = useState(false);
  const textareaRef = useRef(null);

  const targetWord = (card?.word || '').trim();
  const collocations = card?.collocations || [];
  const modelSentence = card?.exampleSentence || card?.modelSentence || '';

  // Reset when card changes
  useEffect(() => {
    setStudentSentence('');
    setIsEvaluated(false);
    setEvaluationFeedback(null);
    setCopied(false);
    setShowBandUpgrade(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [card?.id, card?.word]);

  if (!card) return null;

  // Real-time checks
  const isTargetWordUsed = useMemo(() => {
    if (!studentSentence.trim() || !targetWord) return false;
    const cleanSentence = studentSentence.toLowerCase();
    const cleanWord = targetWord.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    
    // Check main word or its word stems
    return cleanSentence.includes(cleanWord) || 
      (cleanWord.length > 5 && cleanSentence.includes(cleanWord.slice(0, -2)));
  }, [studentSentence, targetWord]);

  // Generate dynamic contextual prompt
  const scenarioPrompt = useMemo(() => {
    if (card.taskType === 'Task 1' || (card.topicId && card.topicId.includes('task1'))) {
      return `Hãy viết 1 câu mô tả xu hướng biểu đồ hoặc so sánh dữ liệu trong bài thi IELTS Task 1, bắt buộc sử dụng từ vựng "${targetWord}".`;
    }
    const topicTitle = topic?.vietnameseName || topic?.name || "Xã hội & Đời sống";
    return `Hãy viết 1 câu nghị luận học thuật về chủ đề ${topicTitle}, bắt buộc sử dụng từ vựng "${targetWord}".`;
  }, [card, topic, targetWord]);

  const handleEvaluate = (e) => {
    if (e) e.preventDefault();
    const text = studentSentence.trim();
    if (!text) return;

    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const flaws = detectCommonGrammarFlaws(text);
    const hasTarget = isTargetWordUsed;

    let scoreBand = "6.5";
    let isSuccess = false;

    if (hasTarget && flaws.length === 0 && wordCount >= 10) {
      scoreBand = wordCount >= 18 ? "8.5" : "7.5";
      isSuccess = true;
    } else if (hasTarget && flaws.length === 0) {
      scoreBand = "7.0";
      isSuccess = true;
    } else {
      scoreBand = "6.0";
    }

    const feedback = {
      scoreBand,
      isSuccess,
      wordCount,
      hasTarget,
      flaws,
      upgradedSentence: modelSentence || `In terms of contemporary developments, ${targetWord} plays a pivotal role in driving sustainable progress.`
    };

    setEvaluationFeedback(feedback);
    setIsEvaluated(true);

    if (isSuccess) {
      if (soundEnabled) playCorrectSound();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } else {
      if (soundEnabled) playIncorrectSound();
    }
  };

  const handleCopyUpgraded = () => {
    if (!evaluationFeedback?.upgradedSentence) return;
    navigator.clipboard.writeText(evaluationFeedback.upgradedSentence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center select-text">
      
      <div className="w-full bg-white border border-[#E6E2D8] rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
        
        {/* Header Tag */}
        <div className="flex items-center justify-between gap-2 border-b border-[#E6E2D8] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Thử Thách Viết Câu Học Thuật (Active Writing Challenge)
              </span>
              <h4 className="text-xs text-[#7A7369]">
                Lấy cảm hứng từ OpenQuiz: Đừng chỉ học vẹt — hãy ép bản thân viết thành câu hoàn chỉnh!
              </h4>
            </div>
          </div>

          <span className="text-[11px] font-mono text-[#3E4F42] bg-[#EDF3EE] px-2.5 py-0.5 rounded-full font-bold border border-[#D1DDD3]">
            Band 8.5 Focus
          </span>
        </div>

        {/* Mission Requirement Card */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67C52] flex items-center gap-1.5">
              <span>🎯</span> Nhiệm vụ viết câu của bạn:
            </span>
            <span className="text-[11px] text-[#7A7369] font-mono">
              Từ bắt buộc: <strong className="text-[#24211E] underline">{targetWord}</strong>
            </span>
          </div>

          <p className="text-sm font-semibold text-[#24211E] leading-relaxed">
            {scenarioPrompt}
          </p>

          {/* Target Word Specs & Collocation Pills */}
          <div className="pt-2 border-t border-[#E6E2D8]/60 flex items-center gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-1 text-[#3E4F42] bg-white px-2.5 py-1 rounded-xl border border-[#D1DDD3] font-medium">
              <span className="font-bold">{targetWord}</span>
              {card.ipa && <span className="font-mono text-[11px] text-[#7A7369] italic">({card.ipa})</span>}
            </div>

            <span className="text-[11px] text-[#7A7369]">: {card.meaning}</span>

            {collocations.length > 0 && (
              <div className="w-full pt-1 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-[#A67C52] uppercase">Collocations gợi ý:</span>
                {collocations.slice(0, 2).map((col, idx) => (
                  <span key={idx} className="text-[10px] bg-white text-[#7A7369] px-2 py-0.5 rounded-lg border border-[#E6E2D8] font-mono">
                    {col}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Interactive Textarea Form */}
        <form onSubmit={handleEvaluate} className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-[#24211E]">Câu viết của bạn (English):</label>
              
              {/* Real-time Indicator Badge */}
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className={`px-2 py-0.5 rounded-lg flex items-center gap-1 transition ${
                  isTargetWordUsed 
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold" 
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}>
                  {isTargetWordUsed ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-amber-600" />}
                  <span>{isTargetWordUsed ? `Đã dùng "${targetWord}"` : `Chưa dùng "${targetWord}"`}</span>
                </span>

                <span className="text-[#7A7369]">
                  {studentSentence.trim().split(/\s+/).filter(Boolean).length} từ
                </span>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              rows={3}
              value={studentSentence}
              onChange={(e) => setStudentSentence(e.target.value)}
              placeholder={`Viết câu tiếng Anh chứa từ "${targetWord}" tại đây...`}
              className="w-full p-3.5 rounded-2xl border border-[#E6E2D8] bg-[#FAF8F5] focus:bg-white focus:border-[#3E4F42] text-sm text-[#24211E] outline-none transition leading-relaxed"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowBandUpgrade(prev => !prev)}
              className="px-3 py-1.5 rounded-xl border border-[#E6E2D8] bg-white text-xs text-[#7A7369] hover:text-[#24211E] transition flex items-center gap-1.5 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-[#A67C52]" />
              <span>{showBandUpgrade ? "Ẩn câu mẫu gợi ý" : "Xem câu mẫu Band 8.5"}</span>
            </button>

            <button
              type="submit"
              disabled={!studentSentence.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Kiểm tra &amp; Chấm câu</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Model Sentence Peek */}
        {showBandUpgrade && modelSentence && (
          <div className="p-3.5 rounded-2xl bg-[#EDF3EE] border border-[#D1DDD3] text-xs space-y-1 animate-fadeIn">
            <span className="font-bold text-[#3E4F42] uppercase text-[10px] tracking-wider block">
              Gợi ý câu mẫu chuẩn Band 8.5:
            </span>
            <p className="text-[#24211E] font-medium leading-relaxed italic">
              "{modelSentence}"
            </p>
          </div>
        )}

        {/* OpenQuiz-style Instant Feedback Card */}
        {isEvaluated && evaluationFeedback && (
          <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 animate-fadeIn ${
            evaluationFeedback.isSuccess ? "bg-emerald-50/70 border-emerald-300" : "bg-amber-50/70 border-amber-300"
          }`}>
            
            <div className="flex items-center justify-between pb-2 border-b border-[#E6E2D8]/60">
              <div className="flex items-center gap-2">
                {evaluationFeedback.isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                )}
                <div>
                  <span className={`font-bold text-sm block ${
                    evaluationFeedback.isSuccess ? "text-emerald-900" : "text-amber-900"
                  }`}>
                    {evaluationFeedback.isSuccess ? "Ứng dụng từ vựng rất tốt!" : "Cần tinh chỉnh một chút!"}
                  </span>
                  <span className="text-[11px] text-[#7A7369]">
                    Ước tính chất lượng câu: <strong className="text-[#3E4F42]">Band {evaluationFeedback.scoreBand}</strong>
                  </span>
                </div>
              </div>

              {onNextWord && (
                <button
                  type="button"
                  onClick={onNextWord}
                  className="px-3.5 py-1.5 rounded-xl bg-[#3E4F42] text-white font-bold text-xs hover:bg-[#334237] transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Từ sau</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Grammar Flaws (Like OpenQuiz's witty correction) */}
            {evaluationFeedback.flaws.length > 0 && (
              <div className="space-y-1.5 p-3 rounded-xl bg-white border border-rose-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                  Phát hiện lỗi ngữ pháp cần tránh:
                </span>
                {evaluationFeedback.flaws.map((flaw, idx) => (
                  <div key={idx} className="text-xs text-[#24211E] space-y-0.5">
                    <p className="font-bold text-rose-800">• {flaw.title}:</p>
                    <p className="text-[#7A7369] pl-3">{flaw.detail}</p>
                    {flaw.hint && <p className="text-emerald-700 pl-3 font-semibold">👉 {flaw.hint}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Upgraded Sentence Comparison */}
            <div className="p-3 rounded-xl bg-white border border-[#E6E2D8] text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#3E4F42] uppercase tracking-wider">
                  Phiên bản nâng cấp gợi ý (Band 8.5):
                </span>
                <button
                  type="button"
                  onClick={handleCopyUpgraded}
                  className="text-[10px] text-[#7A7369] hover:text-[#24211E] flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Đã copy" : "Copy"}</span>
                </button>
              </div>

              <p className="text-[#24211E] font-medium leading-relaxed italic bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E6E2D8]/60">
                "{evaluationFeedback.upgradedSentence}"
              </p>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
