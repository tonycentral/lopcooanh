import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  Copy, 
  Check, 
  Bot, 
  BookOpen,
  Layers
} from 'lucide-react';

export default function EvaluationResult({ 
  result, 
  type = "vocabulary", 
  onNextStep, 
  onRetry 
}) {
  const [copiedKey, setCopiedKey] = React.useState(null);

  if (!result || !result.isValid) return null;

  const { scores, strengths, improvements, upgradeSuggestion, modelFollowUp, explanation, isAiGraded } = result;
  const isTargetMet = result.isTargetMet;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 text-[#2B2826]">
      
      {/* Top Banner: Overall Score & Target Status */}
      <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs ${
        isTargetMet
          ? "bg-[#EDF3EE] border-[#CAD8C8]"
          : "bg-[#FAF4EE] border-[#EADBCC]"
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-black shadow-xs shrink-0 ${
            isTargetMet
              ? "bg-[#4A5D4E] text-white"
              : "bg-[#B88758] text-white"
          }`}>
            <span className="text-[10px] uppercase font-bold tracking-wider -mb-0.5 opacity-90">BAND</span>
            <span className="text-2xl sm:text-3xl leading-none">{scores?.overallBand || "6.5"}</span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                isTargetMet
                  ? "bg-white text-[#3D5240] border-[#CAD8C8]"
                  : "bg-white text-[#8C5D33] border-[#EADBCC]"
              }`}>
                {isTargetMet ? "Đạt Mục Tiêu Band " + result.targetBand : "Chưa Đạt Mục Tiêu Band " + result.targetBand}
              </span>

              {isAiGraded && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white text-[#5A524A] border border-[#DDD6CB] flex items-center gap-1">
                  <Bot className="w-3 h-3 text-[#4A5D4E]" /> Chấm bởi Gemini AI
                </span>
              )}
            </div>
            <h4 className="text-sm sm:text-base font-bold text-[#2B2826]">
              {isTargetMet 
                ? "Xuất sắc! Câu văn của bạn đạt tiêu chuẩn học thuật rất tốt." 
                : "Câu viết tương đối ổn, xem chi tiết gợi ý để nâng band!"}
            </h4>
          </div>
        </div>

        {/* Sub-scores breakdown */}
        <div className="flex items-center gap-2 sm:gap-4 bg-white p-2.5 rounded-xl border border-[#E7E2D9] shadow-xs">
          {scores?.lexicalResource !== undefined && (
            <div className="text-center px-2">
              <div className="text-[10px] text-[#7A7369] font-semibold uppercase">Lexical</div>
              <div className="text-base sm:text-lg font-black text-[#4A5D4E]">{scores.lexicalResource}</div>
            </div>
          )}
          {scores?.grammarRange !== undefined && (
            <div className="text-center px-2 border-l border-[#E7E2D9]">
              <div className="text-[10px] text-[#7A7369] font-semibold uppercase">Grammar</div>
              <div className="text-base sm:text-lg font-black text-[#B88758]">{scores.grammarRange}</div>
            </div>
          )}
          {scores?.coherenceCohesion !== undefined && (
            <div className="text-center px-2 border-l border-[#E7E2D9]">
              <div className="text-[10px] text-[#7A7369] font-semibold uppercase">Coherence</div>
              <div className="text-base sm:text-lg font-black text-[#B95C48]">{scores.coherenceCohesion}</div>
            </div>
          )}
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        
        {/* Strengths */}
        <div className="p-4 rounded-xl bg-white border border-[#CAD8C8] space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 text-[#3D5240] font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-[#4A5D4E]" />
            <span>Điểm sáng trong câu (Strengths)</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#2B2826]">
            {strengths && strengths.length > 0 ? (
              strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#4A5D4E] font-bold mt-0.5">•</span>
                  <span>{str}</span>
                </li>
              ))
            ) : (
              <li className="text-[#7A7369] italic">Không có lỗi ngữ pháp căn bản.</li>
            )}
          </ul>
        </div>

        {/* Improvements */}
        <div className="p-4 rounded-xl bg-white border border-[#EADBCC] space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 text-[#8C5D33] font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-[#B88758]" />
            <span>Điểm cần hoàn thiện (To Improve)</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#2B2826]">
            {improvements && improvements.length > 0 ? (
              improvements.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#B88758] font-bold mt-0.5">•</span>
                  <span>{imp}</span>
                </li>
              ))
            ) : (
              <li className="text-[#7A7369] italic">Câu đã chuẩn xác, không có lỗi cần sửa.</li>
            )}
          </ul>
        </div>

      </div>

      {/* Upgraded Sentences for Step 1 */}
      {upgradeSuggestion && (
        <div className="p-4 rounded-xl bg-white border border-[#E7E2D9] space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#4A5D4E] font-bold text-sm">
              <Sparkles className="w-4 h-4 text-[#4A5D4E]" />
              <span>Gợi ý nâng cấp câu chuẩn Band cao (Sentence Upgrade)</span>
            </div>
            <span className="text-xs text-[#7A7369]">Cách viết học thuật bản xứ</span>
          </div>

          <div className="space-y-2.5">
            {upgradeSuggestion.version1 && (
              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EDF3EE] text-[#3D5240] border border-[#CAD8C8]">
                    Mức Band {upgradeSuggestion.band1 || "7.5"}
                  </span>
                  <p className="text-xs text-[#2B2826] font-mono italic leading-relaxed pt-1">
                    "{upgradeSuggestion.version1}"
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(upgradeSuggestion.version1, "v1")}
                  className="p-1.5 rounded-lg text-[#7A7369] hover:text-[#2B2826] hover:bg-white shrink-0 transition"
                  title="Copy câu mẫu"
                >
                  {copiedKey === "v1" ? <Check className="w-3.5 h-3.5 text-[#4A5D4E]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {upgradeSuggestion.version2 && (
              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF4EE] text-[#8C5D33] border border-[#EADBCC]">
                    Mức Band {upgradeSuggestion.band2 || "8.5"}
                  </span>
                  <p className="text-xs text-[#2B2826] font-mono italic leading-relaxed pt-1">
                    "{upgradeSuggestion.version2}"
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(upgradeSuggestion.version2, "v2")}
                  className="p-1.5 rounded-lg text-[#7A7369] hover:text-[#2B2826] hover:bg-white shrink-0 transition"
                  title="Copy câu mẫu"
                >
                  {copiedKey === "v2" ? <Check className="w-3.5 h-3.5 text-[#4A5D4E]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {upgradeSuggestion.explanation && (
            <p className="text-xs text-[#7A7369] italic pt-1 leading-relaxed">
              💡 {upgradeSuggestion.explanation}
            </p>
          )}
        </div>
      )}

      {/* Model Follow-up & Coherence for Step 2 */}
      {modelFollowUp && (
        <div className="p-4 rounded-xl bg-white border border-[#E7E2D9] space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#B88758] font-bold text-sm">
              <Layers className="w-4 h-4 text-[#B88758]" />
              <span>Câu mẫu tiếp theo chuẩn Band 8.5 (Model Follow-up)</span>
            </div>
            <span className="text-xs text-[#7A7369]">Coherence &amp; Cohesion</span>
          </div>

          <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] flex items-start justify-between gap-3">
            <p className="text-xs text-[#2B2826] font-mono italic leading-relaxed">
              "{modelFollowUp}"
            </p>
            <button
              onClick={() => handleCopy(modelFollowUp, "modelB")}
              className="p-1.5 rounded-lg text-[#7A7369] hover:text-[#2B2826] hover:bg-white shrink-0 transition"
              title="Copy câu mẫu"
            >
              {copiedKey === "modelB" ? <Check className="w-3.5 h-3.5 text-[#4A5D4E]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {explanation && (
            <p className="text-xs text-[#7A7369] leading-relaxed bg-[#FAF4EE] p-2.5 rounded-lg border border-[#EADBCC]">
              <span className="font-semibold text-[#8C5D33]">Phân tích liên kết: </span>
              {explanation}
            </p>
          )}
        </div>
      )}

      {/* Navigation action buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E7E2D9] text-[#5A524A] hover:text-[#2B2826] text-xs font-semibold transition cursor-pointer shadow-xs"
        >
          Viết Lại / Thử Câu Khác
        </button>

        {onNextStep && (
          <button
            onClick={onNextStep}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A5D4E] hover:bg-[#3D4E41] text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <span>{type === "vocabulary" ? "Tiếp Tục: Luyện Coherence với Câu Mới" : "Luyện Thêm Thử Thách Mới"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
