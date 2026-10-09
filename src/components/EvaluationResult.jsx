import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  Bot, 
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
    <div className="space-y-4 animate-in fade-in-50 duration-200 text-[#24211E]">
      
      {/* Top Banner: Overall Score & Target Status */}
      <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs ${
        isTargetMet
          ? "bg-[#EDF3EE] border-[#3E4F42]/30"
          : "bg-[#FAF5EE] border-[#A67C52]/30"
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-bold shadow-xs shrink-0 ${
            isTargetMet
              ? "bg-[#3E4F42] text-white"
              : "bg-[#A67C52] text-white"
          }`}>
            <span className="text-[10px] uppercase font-medium tracking-wider -mb-0.5 opacity-90">BAND</span>
            <span className="text-2xl sm:text-3xl leading-none font-serif">{scores?.overallBand || "6.5"}</span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                isTargetMet
                  ? "bg-white text-[#3E4F42] border-[#3E4F42]/20"
                  : "bg-white text-[#A67C52] border-[#A67C52]/20"
              }`}>
                {isTargetMet ? "Đạt mục tiêu Band " + result.targetBand : "Chưa đạt mục tiêu Band " + result.targetBand}
              </span>

              {isAiGraded && (
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-white text-[#7A7369] border border-[#E6E2D8] flex items-center gap-1">
                  <Bot className="w-3 h-3 text-[#3E4F42]" /> Chấm bởi AI
                </span>
              )}
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-[#24211E]">
              {isTargetMet 
                ? "Câu văn đạt tiêu chuẩn học thuật rất tốt." 
                : "Xem chi tiết gợi ý để nâng band!"}
            </h4>
          </div>
        </div>

        {/* Sub-scores breakdown */}
        <div className="flex items-center gap-2 sm:gap-4 bg-white p-2.5 rounded-xl border border-[#E6E2D8] shadow-xs">
          {scores?.lexicalResource !== undefined && (
            <div className="text-center px-2">
              <div className="text-[10px] text-[#7A7369] font-medium uppercase">Lexical</div>
              <div className="text-base sm:text-lg font-bold text-[#3E4F42]">{scores.lexicalResource}</div>
            </div>
          )}
          {scores?.grammarRange !== undefined && (
            <div className="text-center px-2 border-l border-[#E6E2D8]">
              <div className="text-[10px] text-[#7A7369] font-medium uppercase">Grammar</div>
              <div className="text-base sm:text-lg font-bold text-[#A67C52]">{scores.grammarRange}</div>
            </div>
          )}
          {scores?.coherenceCohesion !== undefined && (
            <div className="text-center px-2 border-l border-[#E6E2D8]">
              <div className="text-[10px] text-[#7A7369] font-medium uppercase">Coherence</div>
              <div className="text-base sm:text-lg font-bold text-[#A67C52]">{scores.coherenceCohesion}</div>
            </div>
          )}
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        
        {/* Strengths */}
        <div className="p-4 rounded-xl bg-white border border-[#3E4F42]/20 space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 text-[#3E4F42] font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4 text-[#3E4F42]" />
            <span>Điểm sáng trong câu</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#24211E]">
            {strengths && strengths.length > 0 ? (
              strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#3E4F42] font-bold mt-0.5">•</span>
                  <span>{str}</span>
                </li>
              ))
            ) : (
              <li className="text-[#7A7369] italic">Không có lỗi ngữ pháp căn bản.</li>
            )}
          </ul>
        </div>

        {/* Improvements */}
        <div className="p-4 rounded-xl bg-white border border-[#A67C52]/20 space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 text-[#A67C52] font-semibold text-sm">
            <AlertTriangle className="w-4 h-4 text-[#A67C52]" />
            <span>Điểm cần hoàn thiện</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#24211E]">
            {improvements && improvements.length > 0 ? (
              improvements.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#A67C52] font-bold mt-0.5">•</span>
                  <span>{imp}</span>
                </li>
              ))
            ) : (
              <li className="text-[#7A7369] italic">Câu chuẩn xác, không có lỗi cần sửa.</li>
            )}
          </ul>
        </div>

      </div>

      {/* Upgraded Sentences */}
      {upgradeSuggestion && (
        <div className="p-4 rounded-xl bg-white border border-[#E6E2D8] space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#3E4F42] font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-[#3E4F42]" />
              <span>Gợi ý nâng cấp câu</span>
            </div>
            <span className="text-xs text-[#7A7369]">Chuẩn Band cao</span>
          </div>

          <div className="space-y-2.5">
            {upgradeSuggestion.version1 && (
              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8] flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#EDF3EE] text-[#3E4F42] border border-[#3E4F42]/20">
                    Band {upgradeSuggestion.band1 || "7.5"}
                  </span>
                  <p className="text-xs text-[#24211E] font-serif italic leading-relaxed pt-1">
                    "{upgradeSuggestion.version1}"
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(upgradeSuggestion.version1, "v1")}
                  className="p-1.5 rounded-lg text-[#7A7369] hover:text-[#24211E] hover:bg-white shrink-0 transition"
                  title="Copy câu mẫu"
                >
                  {copiedKey === "v1" ? <Check className="w-3.5 h-3.5 text-[#3E4F42]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {upgradeSuggestion.version2 && (
              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8] flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#FAF5EE] text-[#A67C52] border border-[#A67C52]/20">
                    Band {upgradeSuggestion.band2 || "8.5"}
                  </span>
                  <p className="text-xs text-[#24211E] font-serif italic leading-relaxed pt-1">
                    "{upgradeSuggestion.version2}"
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(upgradeSuggestion.version2, "v2")}
                  className="p-1.5 rounded-lg text-[#7A7369] hover:text-[#24211E] hover:bg-white shrink-0 transition"
                  title="Copy câu mẫu"
                >
                  {copiedKey === "v2" ? <Check className="w-3.5 h-3.5 text-[#3E4F42]" /> : <Copy className="w-3.5 h-3.5" />}
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
        <div className="p-4 rounded-xl bg-white border border-[#E6E2D8] space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#3E4F42] font-semibold text-sm">
              <Layers className="w-4 h-4 text-[#3E4F42]" />
              <span>Câu mẫu tiếp theo (Model Follow-up)</span>
            </div>
            <span className="text-xs text-[#7A7369]">Coherence &amp; Cohesion</span>
          </div>

          <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8] flex items-start justify-between gap-3">
            <p className="text-xs text-[#24211E] font-serif italic leading-relaxed">
              "{modelFollowUp}"
            </p>
            <button
              onClick={() => handleCopy(modelFollowUp, "modelB")}
              className="p-1.5 rounded-lg text-[#7A7369] hover:text-[#24211E] hover:bg-white shrink-0 transition"
              title="Copy câu mẫu"
            >
              {copiedKey === "modelB" ? <Check className="w-3.5 h-3.5 text-[#3E4F42]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {explanation && (
            <p className="text-xs text-[#7A7369] leading-relaxed bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E6E2D8]">
              <span className="font-semibold text-[#24211E]">Phân tích liên kết: </span>
              {explanation}
            </p>
          )}
        </div>
      )}

      {/* Navigation action buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-[#7A7369] hover:text-[#24211E] text-xs font-medium transition cursor-pointer shadow-xs"
        >
          Viết Lại
        </button>

        {onNextStep && (
          <button
            onClick={onNextStep}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white text-xs font-medium shadow-xs transition cursor-pointer"
          >
            <span>{type === "vocabulary" ? "Tiếp Tục: Luyện Liên Kết Câu" : "Luyện Câu Tiếp Theo"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
