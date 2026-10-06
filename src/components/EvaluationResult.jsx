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
    <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
      
      {/* Top Banner: Overall Score & Target Status */}
      <div className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl ${
        isTargetMet
          ? "bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border-emerald-500/40 shadow-emerald-950/30"
          : "bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border-amber-500/40 shadow-amber-950/30"
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black shadow-lg ${
            isTargetMet
              ? "bg-emerald-600 text-white shadow-emerald-600/30"
              : "bg-amber-600 text-white shadow-amber-600/30"
          }`}>
            <span className="text-[10px] uppercase font-bold tracking-wider -mb-1 opacity-90">BAND</span>
            <span className="text-3xl leading-none">{scores?.overallBand || "6.5"}</span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                isTargetMet
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}>
                {isTargetMet ? "Đạt Mục Tiêu Band " + result.targetBand : "Chưa Đạt Mục Tiêu Band " + result.targetBand}
              </span>

              {isAiGraded && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
                  <Bot className="w-3 h-3" /> Chấm bởi Gemini AI
                </span>
              )}
            </div>
            <h4 className="text-base font-bold text-white">
              {isTargetMet 
                ? "Xuất sắc! Câu văn của bạn đạt tiêu chuẩn học thuật rất tốt." 
                : "Câu viết tương đối ổn, xem chi tiết gợi ý để nâng band!"}
            </h4>
          </div>
        </div>

        {/* Sub-scores breakdown */}
        <div className="flex items-center gap-2 sm:gap-4 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          {scores?.lexicalResource !== undefined && (
            <div className="text-center px-2">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Lexical</div>
              <div className="text-lg font-black text-indigo-400">{scores.lexicalResource}</div>
            </div>
          )}
          {scores?.grammarRange !== undefined && (
            <div className="text-center px-2 border-l border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Grammar</div>
              <div className="text-lg font-black text-purple-400">{scores.grammarRange}</div>
            </div>
          )}
          {scores?.coherenceCohesion !== undefined && (
            <div className="text-center px-2 border-l border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Coherence</div>
              <div className="text-lg font-black text-pink-400">{scores.coherenceCohesion}</div>
            </div>
          )}
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        
        {/* Strengths */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Điểm sáng trong câu (Strengths)</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {strengths && strengths.length > 0 ? (
              strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-400 font-bold mt-0.5">•</span>
                  <span>{str}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">Không có lỗi ngữ pháp căn bản.</li>
            )}
          </ul>
        </div>

        {/* Improvements */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Điểm cần hoàn thiện (To Improve)</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {improvements && improvements.length > 0 ? (
              improvements.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-400 font-bold mt-0.5">•</span>
                  <span>{imp}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">Câu đã chuẩn xác, không có lỗi cần sửa.</li>
            )}
          </ul>
        </div>

      </div>

      {/* Upgraded Sentences for Step 1 */}
      {upgradeSuggestion && (
        <div className="p-4 rounded-xl bg-slate-800/80 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Gợi ý nâng cấp câu chuẩn Band cao (Sentence Upgrade)</span>
            </div>
            <span className="text-xs text-slate-400">Cách viết học thuật bản xứ</span>
          </div>

          <div className="space-y-2.5">
            {upgradeSuggestion.version1 && (
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Mức Band {upgradeSuggestion.band1 || "7.5"}
                  </span>
                  <p className="text-xs text-slate-200 font-mono italic leading-relaxed pt-1">
                    "{upgradeSuggestion.version1}"
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(upgradeSuggestion.version1, "v1")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 shrink-0 transition"
                  title="Copy câu mẫu"
                >
                  {copiedKey === "v1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {upgradeSuggestion.version2 && (
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    Mức Band {upgradeSuggestion.band2 || "8.5"}
                  </span>
                  <p className="text-xs text-slate-200 font-mono italic leading-relaxed pt-1">
                    "{upgradeSuggestion.version2}"
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(upgradeSuggestion.version2, "v2")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 shrink-0 transition"
                  title="Copy câu mẫu"
                >
                  {copiedKey === "v2" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {upgradeSuggestion.explanation && (
            <p className="text-xs text-slate-400 italic pt-1 leading-relaxed">
              💡 {upgradeSuggestion.explanation}
            </p>
          )}
        </div>
      )}

      {/* Model Follow-up & Coherence for Step 2 */}
      {modelFollowUp && (
        <div className="p-4 rounded-xl bg-slate-800/80 border border-pink-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
              <Layers className="w-4 h-4" />
              <span>Câu mẫu tiếp theo chuẩn Band 8.5 (Model Follow-up)</span>
            </div>
            <span className="text-xs text-slate-400">Coherence &amp; Cohesion</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3">
            <p className="text-xs text-slate-200 font-mono italic leading-relaxed">
              "{modelFollowUp}"
            </p>
            <button
              onClick={() => handleCopy(modelFollowUp, "modelB")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 shrink-0 transition"
              title="Copy câu mẫu"
            >
              {copiedKey === "modelB" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {explanation && (
            <p className="text-xs text-slate-400 leading-relaxed bg-pink-950/20 p-2.5 rounded-lg border border-pink-900/30">
              <span className="font-semibold text-pink-300">Phân tích liên kết: </span>
              {explanation}
            </p>
          )}
        </div>
      )}

      {/* Navigation action buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
        >
          Viết Lại / Thử Câu Khác
        </button>

        {onNextStep && (
          <button
            onClick={onNextStep}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            <span>{type === "vocabulary" ? "Tiếp Tục: Luyện Coherence với Câu Mới" : "Luyện Thêm Thử Thách Mới"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
