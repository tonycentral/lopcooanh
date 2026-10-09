import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  FileText, 
  BarChart3, 
  Sparkles, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Award, 
  ChevronRight, 
  Plus, 
  Check, 
  Copy, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  Lightbulb, 
  ArrowRight,
  Filter,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  Compass,
  FileEdit,
  Send,
  Zap,
  Target,
  TrendingUp,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { evaluateFullEssay } from '../services/evaluator';
import { saveHistoryEntry } from '../services/storage';
import { deconstructModelEssay } from '../services/essayProposalHelper';
import { getBandModelEssay, BAND_LEVELS, normalizeBand } from '../services/bandModelEssayService';
import Task1Visualizer from './Task1Visualizer';

const AVAILABLE_BANDS = ["6.5", "7.0", "7.5", "8.0", "8.5"];

export default function FullEssayWorkspace({
  topics = [],
  selectedTopic,
  onSelectTopic,
  activeTask = 'task2',
  onToggleTask,
  targetBand = '7.0',
  studentEmail,
  onOpenChartModal,
  onEssayGraded
}) {
  const isTask1 = activeTask === 'task1';
  const minWordsRequired = isTask1 ? 150 : 250;

  // 4 Sub-Modes of Full Essay Practice:
  // 'freestyle' (Tự viết không cần hướng dẫn)
  // 'guided' (Viết theo hướng dẫn bóc tách từng giai đoạn)
  // 'proposal_translation' (Viết theo từng câu/từng đoạn dịch theo đề xuất)
  // 'band_models' (Bài mẫu chuẩn theo Band kèm chấm điểm & phân tích)
  const [essaySubMode, setEssaySubMode] = useState('freestyle');

  // Selected Band for Sub-mode 4 (Bài mẫu theo Band: 6.5, 7.5, 8.5)
  const [selectedModelBand, setSelectedModelBand] = useState(() => normalizeBand(targetBand));

  // Sync selectedModelBand when targetBand prop changes
  useEffect(() => {
    setSelectedModelBand(normalizeBand(targetBand));
  }, [targetBand]);

  const currentBandModel = useMemo(() => {
    return getBandModelEssay(selectedTopic, activeTask, selectedModelBand);
  }, [selectedTopic, activeTask, selectedModelBand]);

  // Timer countdown
  const [timeLeft, setTimeLeft] = useState(isTask1 ? 20 * 60 : 40 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Reset timer & editor when task or topic changes
  useEffect(() => {
    setTimeLeft(isTask1 ? 20 * 60 : 40 * 60);
    setIsTimerRunning(false);
  }, [isTask1, selectedTopic?.id]);

  // ================= SUB-MODE 1: FREESTYLE (TỰ VIẾT TỰ DO) =================
  const [freestyleInput, setFreestyleInput] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const freestyleWords = useMemo(() => {
    return freestyleInput.trim().split(/\s+/).filter(Boolean);
  }, [freestyleInput]);

  const freestyleParagraphs = useMemo(() => {
    if (!freestyleInput.trim()) return 0;
    const paras = freestyleInput.split(/\n\s*\n|\r\n\s*\r\n/).map(p => p.trim()).filter(Boolean);
    return paras.length > 0 ? paras.length : 1;
  }, [freestyleInput]);

  // Quick Scaffold Inserters
  const insertFreestyleScaffold = () => {
    if (isTask1) {
      const scaffold = `Introduction & Overview:
The supplied chart illustrates the proportion of...
Overall, it is immediately apparent that...

Body Paragraph 1:
In terms of the leading categories,...

Body Paragraph 2:
By contrast, the figures for the remaining sectors...`;
      setFreestyleInput(scaffold);
    } else {
      const scaffold = `Introduction:
In contemporary discourse, the subject of... has provoked substantial controversy. While some contend that..., I firmly maintain that...

Body Paragraph 1:
On the one hand, compelling arguments substantiate the former viewpoint. The primary justification is that...

Body Paragraph 2:
On the other hand, the merits of the opposing stance appear markedly more persuasive. Specifically,...

Conclusion:
In conclusion, although valid points underpin both perspectives, I reaffirm my conviction that...`;
      setFreestyleInput(scaffold);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  // ================= SUB-MODE 2: GUIDED STAGE-BY-STAGE =================
  const [stageDrafts, setStageDrafts] = useState({
    intro: '',
    body1: '',
    body2: '',
    conclusion: ''
  });
  const [activeStageTab, setActiveStageTab] = useState('intro');

  const stageWordCounts = useMemo(() => ({
    intro: stageDrafts.intro.trim().split(/\s+/).filter(Boolean).length,
    body1: stageDrafts.body1.trim().split(/\s+/).filter(Boolean).length,
    body2: stageDrafts.body2.trim().split(/\s+/).filter(Boolean).length,
    conclusion: stageDrafts.conclusion.trim().split(/\s+/).filter(Boolean).length,
  }), [stageDrafts]);

  const totalGuidedWords = useMemo(() => {
    return stageWordCounts.intro + stageWordCounts.body1 + stageWordCounts.body2 + stageWordCounts.conclusion;
  }, [stageWordCounts]);

  const handleAssembleGuidedEssay = () => {
    const fullText = [
      stageDrafts.intro.trim(),
      stageDrafts.body1.trim(),
      stageDrafts.body2.trim(),
      !isTask1 ? stageDrafts.conclusion.trim() : ''
    ].filter(Boolean).join('\n\n');

    if (!fullText) {
      alert("Vui lòng hoàn thành ít nhất 1 giai đoạn trước khi tổng hợp thành bài hoàn chỉnh!");
      return;
    }

    setFreestyleInput(fullText);
    setEssaySubMode('freestyle');
  };

  // ================= SUB-MODE 3: PROPOSAL-ASSISTED TRANSLATION =================
  // Toggle between 'paragraphs' and 'sentences' translation
  const [translationUnitMode, setTranslationUnitMode] = useState('paragraphs');
  const proposalData = useMemo(() => {
    return deconstructModelEssay(selectedTopic, activeTask);
  }, [selectedTopic, activeTask]);

  // Drafts for translation mode
  const [paraTranslationDrafts, setParaTranslationDrafts] = useState({});
  const [sentTranslationDrafts, setSentTranslationDrafts] = useState({});
  const [selectedUpgradeBandMap, setSelectedUpgradeBandMap] = useState({});

  const handleAssembleTranslationEssay = () => {
    let fullText = "";
    if (translationUnitMode === 'paragraphs') {
      fullText = proposalData.paragraphs.map((p, idx) => {
        return (paraTranslationDrafts[idx] || p.englishModel).trim();
      }).filter(Boolean).join('\n\n');
    } else {
      let currentParaIdx = 1;
      let paraSentences = [];
      const paras = [];
      proposalData.allSentences.forEach((s, idx) => {
        const text = (sentTranslationDrafts[idx] || s.englishModel).trim();
        if (s.paragraphIndex !== currentParaIdx) {
          if (paraSentences.length > 0) paras.push(paraSentences.join(' '));
          paraSentences = [text];
          currentParaIdx = s.paragraphIndex;
        } else {
          paraSentences.push(text);
        }
      });
      if (paraSentences.length > 0) paras.push(paraSentences.join(' '));
      fullText = paras.join('\n\n');
    }

    if (!fullText) {
      alert("Vui lòng dịch ít nhất một phần trước khi ghép toàn bài!");
      return;
    }

    setFreestyleInput(fullText);
    setEssaySubMode('freestyle');
  };

  // ================= EVALUATE ESSAY =================
  const handleGradeEssay = () => {
    const textToGrade = freestyleInput.trim();
    if (freestyleWords.length < 25) {
      alert(`Bài viết quá ngắn (${freestyleWords.length} từ). Vui lòng viết ít nhất 25 từ để hệ thống chấm điểm!`);
      return;
    }

    setIsEvaluating(true);
    try {
      const res = evaluateFullEssay(textToGrade, selectedTopic, targetBand, activeTask);
      setEvaluationResult(res);

      if ((res.scores?.overallBand || 0) >= parseFloat(targetBand)) {
        confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
      }

      // Save to history
      saveHistoryEntry({
        studentEmail,
        type: isTask1 ? "full_report_task1" : "full_essay_task2",
        topicName: selectedTopic?.name || selectedTopic?.title,
        promptText: selectedTopic?.ieltsPrompt,
        userSentence: textToGrade,
        scores: res.scores,
        targetBand,
        isTargetMet: (res.scores?.overallBand || 0) >= parseFloat(targetBand)
      });

      if (onEssayGraded) onEssayGraded();
    } finally {
      setIsEvaluating(false);
    }
  };

  // Topic filter helper for prompt switcher
  const [promptFilterType, setPromptFilterType] = useState('all');
  const filteredPrompts = useMemo(() => {
    if (!topics || topics.length === 0) return [];
    if (promptFilterType === 'all') return topics;
    return topics.filter(t => {
      const q = (t.questionType || t.tag || '').toLowerCase();
      return q.includes(promptFilterType.toLowerCase());
    });
  }, [topics, promptFilterType]);

  // Topic vocabularies for insertion
  const topicVocabs = useMemo(() => selectedTopic?.vocabularies || [], [selectedTopic]);

  const insertWordIntoFreestyle = (word) => {
    setFreestyleInput(prev => {
      if (!prev) return word;
      if (prev.endsWith(" ") || prev.endsWith("\n")) return `${prev}${word}`;
      return `${prev} ${word}`;
    });
  };

  return (
    <div className="h-full flex flex-col gap-3 overflow-hidden text-[#24211E]">
      
      {/* ================= HEADER RIBBON: PROMPT SELECTOR & TIMER ================= */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        
        {/* Left: Task Indicator & Prompt Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] flex items-center justify-center shrink-0 shadow-xs">
            {isTask1 ? <BarChart3 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase font-black px-2 py-0.5 rounded-full bg-[#3E4F42] text-white tracking-wider">
                {isTask1 ? "IELTS Task 1 Report" : "IELTS Task 2 Full Essay"}
              </span>
              <span className="text-[11px] font-bold text-[#7A7369]">
                Mục tiêu: <strong className="text-[#3E4F42]">Band {targetBand}</strong>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E6E2D8] text-[#7A7369] font-mono">
                {selectedTopic?.questionType || selectedTopic?.tag || "Academic Writing"}
              </span>
            </div>

            <h2 className="text-sm font-extrabold text-[#24211E] truncate mt-0.5">
              {selectedTopic?.name || selectedTopic?.title || "Chủ đề luyện viết IELTS"}
            </h2>
          </div>
        </div>

        {/* Center / Right: Countdown Timer & Prompt Switcher */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          
          {/* Timer Widget */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#E6E2D8] shadow-xs">
            <Clock className="w-4 h-4 text-[#A67C52] shrink-0" />
            <span className={`font-mono text-sm font-bold ${timeLeft < 300 ? "text-[#A67C52] animate-pulse" : "text-[#A67C52]"}`}>
              {formatTimer(timeLeft)}
            </span>
            <button
              type="button"
              onClick={() => setIsTimerRunning(prev => !prev)}
              className="p-1 rounded-lg bg-white hover:bg-[#F4EFEA] text-[#24211E] border border-[#E6E2D8] transition cursor-pointer"
              title={isTimerRunning ? "Tạm dừng đồng hồ" : "Bắt đầu tính giờ thi thật"}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsTimerRunning(false);
                setTimeLeft(isTask1 ? 20 * 60 : 40 * 60);
              }}
              className="p-1 rounded-lg bg-white hover:bg-[#F4EFEA] text-[#7A7369] border border-[#E6E2D8] transition cursor-pointer"
              title="Đặt lại đồng hồ"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Task 1 / Task 2 toggle */}
          {onToggleTask && (
            <div className="flex items-center p-0.5 rounded-xl bg-[#F4EFEA] border border-[#E6E2D8] text-xs shadow-xs">
              <button
                type="button"
                onClick={() => onToggleTask('task1')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  isTask1 ? "bg-[#3E4F42] text-white shadow-xs" : "text-[#7A7369] hover:text-[#24211E]"
                }`}
              >
                Task 1
              </button>
              <button
                type="button"
                onClick={() => onToggleTask('task2')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  !isTask1 ? "bg-[#3E4F42] text-white shadow-xs" : "text-[#7A7369] hover:text-[#24211E]"
                }`}
              >
                Task 2
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ================= PROMPT & TASK 1 VISUALIZER BANNER ================= */}
      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] shadow-xs flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between text-[11px] text-[#7A7369]">
          <span className="font-bold uppercase tracking-wider text-[#3E4F42] flex items-center gap-1.5">
            <span>📌</span> Đề thi chính thức ({isTask1 ? "Yêu cầu: >= 150 từ • 20 phút" : "Yêu cầu: >= 250 từ • 40 phút"}):
          </span>
          {isTask1 && onOpenChartModal && (
            <button
              type="button"
              onClick={onOpenChartModal}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#FAF8F5] border border-[#D1DDD3] text-[#3E4F42] text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <Eye className="w-3.5 h-3.5 text-[#3E4F42]" />
              <span>Phóng to Biểu đồ</span>
            </button>
          )}
        </div>

        <p className="text-xs sm:text-sm text-[#24211E] font-medium italic leading-relaxed pl-3 border-l-2 border-[#3E4F42]">
          "{selectedTopic?.ieltsPrompt || 'Đề bài chưa được cập nhật'}"
        </p>

        {/* Task 1 Compact Visualizer if activeTask === 'task1' */}
        {isTask1 && selectedTopic && (
          <div className="mt-1 pt-2 border-t border-[#E6E2D8]/60 max-h-44 overflow-hidden rounded-xl">
            <Task1Visualizer 
              topic={selectedTopic} 
              onExpandChart={onOpenChartModal} 
              isCompact={true} 
            />
          </div>
        )}
      </div>

      {/* ================= 4 PRACTICE SUB-MODES TABS ================= */}
      <div className="p-1 rounded-2xl bg-[#F4EFEA] border border-[#E6E2D8] shadow-xs grid grid-cols-2 lg:grid-cols-4 gap-1 shrink-0 text-xs">
        
        {/* Sub-mode 1 */}
        <button
          type="button"
          onClick={() => setEssaySubMode('freestyle')}
          className={`py-2 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
            essaySubMode === 'freestyle'
              ? "bg-[#3E4F42] text-white shadow-xs"
              : "text-[#7A7369] hover:text-[#24211E]"
          }`}
        >
          <FileEdit className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">1. Tự viết tự do (Phòng thi)</span>
        </button>

        {/* Sub-mode 2 */}
        <button
          type="button"
          onClick={() => setEssaySubMode('guided')}
          className={`py-2 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
            essaySubMode === 'guided'
              ? "bg-[#3E4F42] text-white shadow-xs"
              : "text-[#7A7369] hover:text-[#24211E]"
          }`}
        >
          <Compass className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">2. Viết theo hướng dẫn</span>
        </button>

        {/* Sub-mode 3 */}
        <button
          type="button"
          onClick={() => setEssaySubMode('proposal_translation')}
          className={`py-2 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
            essaySubMode === 'proposal_translation'
              ? "bg-[#3E4F42] text-white shadow-xs"
              : "text-[#7A7369] hover:text-[#24211E]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">3. Dịch câu/đoạn đề xuất</span>
        </button>

        {/* Sub-mode 4: Bài mẫu chuẩn theo Band kèm chấm điểm */}
        <button
          type="button"
          onClick={() => setEssaySubMode('band_models')}
          className={`py-2 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
            essaySubMode === 'band_models'
              ? "bg-[#3E4F42] text-white shadow-xs"
              : "text-[#7A7369] hover:text-[#24211E]"
          }`}
        >
          <Award className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">4. Bài mẫu Band & Chấm điểm</span>
        </button>

      </div>

      {/* ================= WORKSPACE BODY CONTENT ================= */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin">
        
        {/* ========================================================================= */}
        {/* 1. TỰ VIẾT KHÔNG CẦN HƯỚNG DẪN (FREESTYLE WRITING) ====================== */}
        {/* ========================================================================= */}
        {essaySubMode === 'freestyle' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E2D8] space-y-3.5 shadow-xs">
              
              {/* Quick Vocabularies Toolbar */}
              {topicVocabs.length > 0 && (
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#7A7369]">
                    <span className="font-bold text-[#3E4F42] uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#A67C52]" />
                      Từ vựng Band 8.0 của chủ đề (Bấm để chèn nhanh vào bài):
                    </span>
                    <span className="italic">(Collocation & Academic Lexicon)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1 scrollbar-thin">
                    {topicVocabs.slice(0, 18).map(v => (
                      <button
                        key={v.id || v.word}
                        type="button"
                        onClick={() => insertWordIntoFreestyle(v.word)}
                        className="px-2 py-0.5 rounded-lg bg-white hover:bg-[#EDF3EE] border border-[#E6E2D8] hover:border-[#D1DDD3] text-[#7A7369] hover:text-[#24211E] text-xs font-mono transition cursor-pointer flex items-center gap-1"
                        title={`Nghĩa: ${v.meaning}`}
                      >
                        <Plus className="w-3 h-3 text-[#7A7369]" />
                        <span>{v.word}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Scaffold Toolbar */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={insertFreestyleScaffold}
                  className="px-3 py-1.5 rounded-xl bg-[#EDF3EE] hover:bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#3E4F42]" />
                  <span>Chèn Khung Dàn Ý {isTask1 ? "Report Task 1" : "Essay 4 Đoạn Tiêu Chuẩn"}</span>
                </button>
              </div>

              {/* Full Textarea */}
              <div className="space-y-2">
                <textarea
                  value={freestyleInput}
                  onChange={(e) => setFreestyleInput(e.target.value)}
                  placeholder={
                    isTask1
                      ? "Soạn thảo toàn văn bài báo cáo Task 1 tại đây (tối thiểu 150 từ)... Tập trung phân tích xu hướng tổng quan, số liệu cao nhất, thấp nhất và so sánh tương quan."
                      : "Soạn thảo toàn văn bài luận Task 2 tại đây (tối thiểu 250 từ)... Chia thành 4 đoạn văn mạch lạc: Mở bài (Bối cảnh & Luận điểm), Thân bài 1, Thân bài 2 và Kết bài."
                  }
                  rows={14}
                  className="w-full p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] focus:border-[#3E4F42] focus:ring-1 focus:ring-[#3E4F42] text-[#24211E] placeholder-[#7A7369] font-sans text-xs sm:text-sm leading-relaxed outline-none transition resize-y shadow-inner"
                />

                {/* Bottom Bar: Word Counter & Submit */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className={`px-2.5 py-1 rounded-lg font-mono font-bold border flex items-center gap-1.5 ${
                      freestyleWords.length >= minWordsRequired
                        ? "bg-[#EDF3EE] border-[#D1DDD3] text-[#3E4F42]"
                        : "bg-[#FAF5EE] border-[#E6E2D8] text-[#A67C52]"
                    }`}>
                      {freestyleWords.length >= minWordsRequired ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3E4F42]" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-[#A67C52]" />
                      )}
                      <span>{freestyleWords.length} / {minWordsRequired} từ</span>
                      {freestyleWords.length < minWordsRequired && (
                        <span className="text-[10px] text-[#A67C52]">
                          (cần thêm {minWordsRequired - freestyleWords.length} từ)
                        </span>
                      )}
                    </span>

                    <span className="text-[11px] text-[#7A7369]">
                      Đoạn văn: <strong className="text-[#24211E]">{freestyleParagraphs}</strong> đoạn
                    </span>

                    {freestyleInput.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này để làm lại từ đầu?")) {
                            setFreestyleInput("");
                            setEvaluationResult(null);
                          }
                        }}
                        className="text-[11px] text-[#7A7369] hover:text-[#A67C52] transition underline cursor-pointer ml-1"
                      >
                        Xóa làm lại
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleGradeEssay}
                    disabled={isEvaluating || freestyleWords.length < 25}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-xs cursor-pointer ${
                      freestyleWords.length < 25
                        ? "bg-[#F4EFEA] text-[#7A7369] cursor-not-allowed border border-[#E6E2D8]"
                        : "bg-[#3E4F42] hover:bg-[#334237] text-white active:scale-95"
                    }`}
                  >
                    {isEvaluating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Giám khảo AI đang chấm 4 tiêu chí...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#EDF3EE]" />
                        <span>Nộp bài &amp; Chấm điểm chuẩn IELTS</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Evaluation Results Rendered Below Textarea */}
            {evaluationResult && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D1DDD3] space-y-4 shadow-xs animate-fadeIn">
                <div className="p-4 rounded-xl bg-[#EDF3EE] border border-[#D1DDD3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#3E4F42] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#7A7369] tracking-wider">
                        Kết quả đánh giá 4 tiêu chí {isTask1 ? 'Task 1' : 'Task 2'}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#24211E] font-mono">
                          Band {evaluationResult.scores?.overallBand || "6.5"}
                        </span>
                        <span className="text-xs text-[#7A7369]">
                          (Mục tiêu của bạn: Band {targetBand})
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    (evaluationResult.scores?.overallBand || 0) >= parseFloat(targetBand)
                      ? "bg-white text-[#3E4F42] border-[#D1DDD3]"
                      : "bg-white text-[#A67C52] border-[#E6E2D8]"
                  }`}>
                    {(evaluationResult.scores?.overallBand || 0) >= parseFloat(targetBand)
                      ? "✓ Đạt mục tiêu đề ra"
                      : "Cần cải thiện thêm"}
                  </span>
                </div>

                {/* 4 IELTS Criteria */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1">
                    <span className="text-[10px] font-bold text-[#7A7369] uppercase tracking-wider block">
                      {isTask1 ? "Task Achievement (TA)" : "Task Response (TR)"}
                    </span>
                    <div className="text-lg font-black text-[#3E4F42] font-mono">
                      {evaluationResult.scores?.taskResponse?.toFixed(1) || "6.5"}
                    </div>
                    <span className="text-[10px] text-[#7A7369] block">
                      {evaluationResult.wordCount} từ • {evaluationResult.paragraphCount} đoạn
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1">
                    <span className="text-[10px] font-bold text-[#7A7369] uppercase tracking-wider block">
                      Coherence &amp; Cohesion (CC)
                    </span>
                    <div className="text-lg font-black text-[#3E4F42] font-mono">
                      {evaluationResult.scores?.coherenceCohesion?.toFixed(1) || "6.5"}
                    </div>
                    <span className="text-[10px] text-[#7A7369] block">
                      {evaluationResult.detectedCohesiveDevices?.length || 0} liên từ mạch lạc
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1">
                    <span className="text-[10px] font-bold text-[#7A7369] uppercase tracking-wider block">
                      Lexical Resource (LR)
                    </span>
                    <div className="text-lg font-black text-[#A67C52] font-mono">
                      {evaluationResult.scores?.lexicalResource?.toFixed(1) || "6.5"}
                    </div>
                    <span className="text-[10px] text-[#7A7369] block">
                      {evaluationResult.usedTargetWords?.length || 0} từ Band 8.0
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1">
                    <span className="text-[10px] font-bold text-[#7A7369] uppercase tracking-wider block">
                      Grammar Accuracy (GRA)
                    </span>
                    <div className="text-lg font-black text-[#A67C52] font-mono">
                      {evaluationResult.scores?.grammarRange?.toFixed(1) || "6.5"}
                    </div>
                    <span className="text-[10px] text-[#7A7369] block">
                      {evaluationResult.detectedStructures?.length || 0} cấu trúc phức hợp
                    </span>
                  </div>
                </div>

                {/* Feedback */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#EDF3EE]/60 border border-[#D1DDD3] space-y-1.5">
                    <span className="font-bold text-[#3E4F42] uppercase text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Điểm mạnh của bài viết:
                    </span>
                    <ul className="space-y-1 text-[#24211E] list-disc pl-4">
                      {evaluationResult.strengths?.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF5EE] border border-[#E6E2D8] space-y-1.5">
                    <span className="font-bold text-[#A67C52] uppercase text-[11px] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Góp ý cải thiện chuẩn Band {targetBand}:
                    </span>
                    <ul className="space-y-1 text-[#24211E] list-disc pl-4">
                      {evaluationResult.improvements?.map((imp, idx) => (
                        <li key={idx}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. VIẾT THEO HƯỚNG DẪN (BÓC TÁCH TỪNG GIAI ĐOẠN - GUIDED STAGES) ========= */}
        {/* ========================================================================= */}
        {essaySubMode === 'guided' && (
          <div className="space-y-3.5 animate-fadeIn">
            
            {/* Stage Selector Tabs */}
            <div className="p-2 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveStageTab('intro')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                    activeStageTab === 'intro'
                      ? "bg-[#3E4F42] text-white shadow-xs"
                      : "bg-[#FAF8F5] text-[#7A7369] hover:bg-[#F4EFEA]"
                  }`}
                >
                  <span>1. Mở bài &amp; {isTask1 ? "Overview" : "Thesis"}</span>
                  <span className="text-[10px] font-mono opacity-80">({stageWordCounts.intro}t)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStageTab('body1')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                    activeStageTab === 'body1'
                      ? "bg-[#3E4F42] text-white shadow-xs"
                      : "bg-[#FAF8F5] text-[#7A7369] hover:bg-[#F4EFEA]"
                  }`}
                >
                  <span>2. Thân bài 1 (Body 1)</span>
                  <span className="text-[10px] font-mono opacity-80">({stageWordCounts.body1}t)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStageTab('body2')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                    activeStageTab === 'body2'
                      ? "bg-[#3E4F42] text-white shadow-xs"
                      : "bg-[#FAF8F5] text-[#7A7369] hover:bg-[#F4EFEA]"
                  }`}
                >
                  <span>3. Thân bài 2 (Body 2)</span>
                  <span className="text-[10px] font-mono opacity-80">({stageWordCounts.body2}t)</span>
                </button>

                {!isTask1 && (
                  <button
                    type="button"
                    onClick={() => setActiveStageTab('conclusion')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                      activeStageTab === 'conclusion'
                        ? "bg-[#3E4F42] text-white shadow-xs"
                        : "bg-[#FAF8F5] text-[#7A7369] hover:bg-[#F4EFEA]"
                    }`}
                  >
                    <span>4. Kết bài (Conclusion)</span>
                    <span className="text-[10px] font-mono opacity-80">({stageWordCounts.conclusion}t)</span>
                  </button>
                )}
              </div>

              {/* Assemble Full Essay Action Button */}
              <button
                type="button"
                onClick={handleAssembleGuidedEssay}
                className="py-1.5 px-3.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-extrabold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                title="Ghép các phần đã viết thành một bài essay hoàn chỉnh"
              >
                <Zap className="w-3.5 h-3.5 text-[#F4EFEA]" />
                <span>⚡ Ghép toàn bài ({totalGuidedWords} từ) &rarr;</span>
              </button>
            </div>

            {/* Active Stage Panel */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E2D8] space-y-4 shadow-xs">
              
              {activeStageTab === 'intro' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-[#3E4F42] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      Giai đoạn 1: Mở bài &amp; {isTask1 ? "Tổng quan (Overview)" : "Luận điểm (Thesis Statement)"}
                    </h3>
                    <p className="text-xs text-[#7A7369] leading-relaxed">
                      {isTask1
                        ? "Paraphrase lại câu đề bài bằng ngôn ngữ học thuật, sau đó viết câu Overview chỉ ra 2 xu hướng nổi bật nhất (không đưa số liệu chi tiết vào Overview)."
                        : "Dẫn nhập bối cảnh đề tài (1 câu paraphrase) và đưa ra quan điểm cá nhân rõ ràng ngay tại câu cuối của Mở bài (Thesis Statement)."}
                    </p>
                  </div>

                  {/* Sentence Starters */}
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1.5">
                    <span className="text-[11px] font-bold text-[#7A7369] uppercase block">
                      💡 Mẫu câu gợi ý (Sentence Starters - Bấm để chèn):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        isTask1 ? "The chart illustrates..." : "It is often argued that...",
                        isTask1 ? "Overall, it is evident that..." : "While some believe that..., I would contend that...",
                        isTask1 ? "A closer inspection reveals that..." : "This essay will examine both perspectives before concluding that..."
                      ].map((starter, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => setStageDrafts(prev => ({
                            ...prev,
                            intro: prev.intro ? `${prev.intro} ${starter}` : starter
                          }))}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#EDF3EE] border border-[#E6E2D8] text-xs text-[#24211E] transition cursor-pointer"
                        >
                          + {starter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={stageDrafts.intro}
                    onChange={(e) => setStageDrafts(prev => ({ ...prev, intro: e.target.value }))}
                    placeholder="Viết đoạn Mở bài tại đây (khoảng 35 - 55 từ)..."
                    rows={6}
                    className="w-full p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] focus:border-[#3E4F42] text-xs sm:text-sm leading-relaxed outline-none"
                  />
                </div>
              )}

              {activeStageTab === 'body1' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-[#3E4F42] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      Giai đoạn 2: Thân bài 1 (Body Paragraph 1)
                    </h3>
                    <p className="text-xs text-[#7A7369] leading-relaxed">
                      {isTask1
                        ? "Phân tích nhóm số liệu nổi bật đầu tiên (số liệu cao nhất, xu hướng tăng mạnh). Luôn đi kèm số liệu cụ thể và đơn vị đo."
                        : "Bắt đầu bằng câu chủ đề (Topic Sentence) nêu luận điểm 1. Giải thích lý do (Explanation) và đưa ra dẫn chứng hoặc ví dụ cụ thể (Evidence / Example)."}
                    </p>
                  </div>

                  {/* Sentence Starters */}
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1.5">
                    <span className="text-[11px] font-bold text-[#7A7369] uppercase block">
                      💡 Mẫu câu &amp; Liên từ Thân bài 1:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        isTask1 ? "In terms of..." : "On the one hand, proponents argue that...",
                        isTask1 ? "Looking first at the figures for..." : "The primary justification for this is...",
                        "For instance, empirical evidence demonstrates that...",
                        "Consequently, this leads to substantial improvements in..."
                      ].map((starter, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => setStageDrafts(prev => ({
                            ...prev,
                            body1: prev.body1 ? `${prev.body1} ${starter}` : starter
                          }))}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#EDF3EE] border border-[#E6E2D8] text-xs text-[#24211E] transition cursor-pointer"
                        >
                          + {starter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={stageDrafts.body1}
                    onChange={(e) => setStageDrafts(prev => ({ ...prev, body1: e.target.value }))}
                    placeholder="Viết đoạn Thân bài 1 tại đây (khoảng 80 - 110 từ)..."
                    rows={7}
                    className="w-full p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] focus:border-[#3E4F42] text-xs sm:text-sm leading-relaxed outline-none"
                  />
                </div>
              )}

              {activeStageTab === 'body2' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-[#3E4F42] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      Giai đoạn 3: Thân bài 2 (Body Paragraph 2)
                    </h3>
                    <p className="text-xs text-[#7A7369] leading-relaxed">
                      {isTask1
                        ? "Phân tích nhóm số liệu đối chiếu còn lại (số liệu thấp hơn, xu hướng giảm hoặc không đổi). Sử dụng từ nối tương phản (By contrast, On the contrary)."
                        : "Phát triển luận điểm 2 (quan điểm đối trọng hoặc đào sâu chiều sâu lập luận). Củng cố lập trường cá nhân bằng các lập luận logic chặt chẽ."}
                    </p>
                  </div>

                  {/* Sentence Starters */}
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1.5">
                    <span className="text-[11px] font-bold text-[#7A7369] uppercase block">
                      💡 Mẫu câu &amp; Liên từ Thân bài 2:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        isTask1 ? "By contrast, the figures for..." : "On the other hand, it is compelling that...",
                        isTask1 ? "A reverse trend was witnessed in..." : "Furthermore, opponents often emphasize that...",
                        "In stark contrast, however,...",
                        "This phenomenon reinforces the necessity of..."
                      ].map((starter, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => setStageDrafts(prev => ({
                            ...prev,
                            body2: prev.body2 ? `${prev.body2} ${starter}` : starter
                          }))}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#EDF3EE] border border-[#E6E2D8] text-xs text-[#24211E] transition cursor-pointer"
                        >
                          + {starter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={stageDrafts.body2}
                    onChange={(e) => setStageDrafts(prev => ({ ...prev, body2: e.target.value }))}
                    placeholder="Viết đoạn Thân bài 2 tại đây (khoảng 80 - 110 từ)..."
                    rows={7}
                    className="w-full p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] focus:border-[#3E4F42] text-xs sm:text-sm leading-relaxed outline-none"
                  />
                </div>
              )}

              {activeStageTab === 'conclusion' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-[#3E4F42] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      Giai đoạn 4: Kết bài (Conclusion)
                    </h3>
                    <p className="text-xs text-[#7A7369] leading-relaxed">
                      Tóm tắt lại các luận điểm chính đã phân tích ở 2 đoạn thân bài mà không đưa thêm ý mới, sau đó tái khẳng định lập trường vững chắc.
                    </p>
                  </div>

                  {/* Sentence Starters */}
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1.5">
                    <span className="text-[11px] font-bold text-[#7A7369] uppercase block">
                      💡 Mẫu câu Kết bài:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "In conclusion, while valid arguments exist on both sides,...",
                        "Overall, I am convinced that...",
                        "Taking all factors into account, it is paramount that..."
                      ].map((starter, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => setStageDrafts(prev => ({
                            ...prev,
                            conclusion: prev.conclusion ? `${prev.conclusion} ${starter}` : starter
                          }))}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#EDF3EE] border border-[#E6E2D8] text-xs text-[#24211E] transition cursor-pointer"
                        >
                          + {starter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={stageDrafts.conclusion}
                    onChange={(e) => setStageDrafts(prev => ({ ...prev, conclusion: e.target.value }))}
                    placeholder="Viết đoạn Kết bài tại đây (khoảng 30 - 45 từ)..."
                    rows={5}
                    className="w-full p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] focus:border-[#3E4F42] text-xs sm:text-sm leading-relaxed outline-none"
                  />
                </div>
              )}

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. VIẾT THEO TỪNG CÂU/ĐOẠN DỊCH THEO ĐỀ XUẤT CỦA WEBSITE ================= */}
        {/* ========================================================================= */}
        {essaySubMode === 'proposal_translation' && (
          <div className="space-y-3.5 animate-fadeIn">
            
            {/* Unit Switcher: Từng Đoạn vs Từng Câu */}
            <div className="p-3 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#7A7369]">Hình thức dịch đề xuất:</span>
                <div className="flex items-center p-0.5 rounded-xl bg-[#F4EFEA] border border-[#E6E2D8] text-xs shadow-xs">
                  <button
                    type="button"
                    onClick={() => setTranslationUnitMode('paragraphs')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      translationUnitMode === 'paragraphs'
                        ? "bg-[#3E4F42] text-white shadow-xs"
                        : "text-[#7A7369] hover:text-[#24211E]"
                    }`}
                  >
                    Dịch theo từng đoạn ({proposalData.totalParagraphs} đoạn)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTranslationUnitMode('sentences')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      translationUnitMode === 'sentences'
                        ? "bg-[#3E4F42] text-white shadow-xs"
                        : "text-[#7A7369] hover:text-[#24211E]"
                    }`}
                  >
                    Dịch theo từng câu ({proposalData.totalSentences} câu)
                  </button>
                </div>
              </div>

              {/* Action Button: Ghép toàn bài */}
              <button
                type="button"
                onClick={handleAssembleTranslationEssay}
                className="py-1.5 px-3.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                title="Tập hợp toàn bộ bản dịch thành một bài văn hoàn chỉnh"
              >
                <Zap className="w-3.5 h-3.5 text-[#F4EFEA]" />
                <span>⚡ Ghép toàn bài hoàn chỉnh &rarr;</span>
              </button>
            </div>

            {/* DỊCH THEO TỪNG ĐOẠN VĂN (PARAGRAPHS) */}
            {translationUnitMode === 'paragraphs' && (
              <div className="space-y-3">
                {proposalData.paragraphs.map((p, pIdx) => {
                  const activeBand = selectedUpgradeBandMap[`p_${pIdx}`] || targetBand;
                  const currentUpgradeText = p.bandUpgrades?.[activeBand] || p.englishModel;

                  return (
                    <div key={pIdx} className="p-4 rounded-2xl bg-white border border-[#E6E2D8] space-y-3 shadow-xs">
                      
                      {/* Header of paragraph */}
                      <div className="flex items-center justify-between pb-2 border-b border-[#E6E2D8]">
                        <span className="text-xs font-black text-[#3E4F42] uppercase tracking-wide flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-[#A67C52]" />
                          {p.roleTitle}
                        </span>
                        <span className="text-[10px] text-[#7A7369] font-mono">
                          Đoạn {pIdx + 1} / {proposalData.totalParagraphs}
                        </span>
                      </div>

                      {/* Vietnamese Proposal by Website */}
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1">
                        <span className="text-[11px] font-bold text-[#A67C52] uppercase flex items-center gap-1">
                          <span>🇻🇳</span> Đề xuất ý tưởng tiếng Việt của website:
                        </span>
                        <p className="text-xs sm:text-sm text-[#24211E] leading-relaxed">
                          {p.vietnameseProposal}
                        </p>
                      </div>

                      {/* Band Upgrades Selector Buttons */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-[#7A7369]">
                          <span className="font-semibold text-[#7A7369] flex items-center gap-1">
                            <span>✨</span> Xem câu/đoạn nâng cấp theo Band điểm mục tiêu:
                          </span>
                          <span className="text-[10px] italic">Bấm chọn để xem cách diễn đạt từng Band</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {AVAILABLE_BANDS.map(band => (
                            <button
                              key={band}
                              type="button"
                              onClick={() => setSelectedUpgradeBandMap(prev => ({
                                ...prev,
                                [`p_${pIdx}`]: band
                              }))}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                                activeBand === band
                                  ? "bg-[#3E4F42] text-white shadow-xs"
                                  : "bg-[#FAF8F5] hover:bg-[#F4EFEA] text-[#7A7369] border border-[#E6E2D8]"
                              }`}
                            >
                              <span>Band {band}</span>
                              {activeBand === band && <Check className="w-3 h-3" />}
                            </button>
                          ))}
                        </div>

                        {/* Display of upgraded model for this band */}
                        <div className="p-2.5 rounded-xl bg-[#EDF3EE]/50 border border-[#D1DDD3] text-xs space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-[#3E4F42] font-bold">
                            <span>Bản mẫu tiếng Anh chuẩn Band {activeBand}:</span>
                            <button
                              type="button"
                              onClick={() => {
                                setParaTranslationDrafts(prev => ({
                                  ...prev,
                                  [pIdx]: currentUpgradeText
                                }));
                              }}
                              className="text-[#3E4F42] hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Áp dụng vào bản dịch</span>
                            </button>
                          </div>
                          <p className="text-[#24211E] font-sans leading-relaxed italic">
                            "{currentUpgradeText}"
                          </p>
                        </div>
                      </div>

                      {/* Student Translation Input */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-[#7A7369]">
                          Bản dịch tiếng Anh của bạn cho đoạn này:
                        </span>
                        <textarea
                          value={paraTranslationDrafts[pIdx] || ''}
                          onChange={(e) => setParaTranslationDrafts(prev => ({
                            ...prev,
                            [pIdx]: e.target.value
                          }))}
                          placeholder="Nhập bản dịch tiếng Anh của bạn tại đây..."
                          rows={4}
                          className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] focus:border-[#3E4F42] text-xs sm:text-sm leading-relaxed outline-none"
                        />
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* DỊCH THEO TỪNG CÂU (SENTENCES) */}
            {translationUnitMode === 'sentences' && (
              <div className="space-y-3">
                {proposalData.allSentences.map((s, sIdx) => {
                  const activeBand = selectedUpgradeBandMap[`s_${sIdx}`] || targetBand;
                  const currentUpgradeText = s.bandUpgrades?.[activeBand] || s.englishModel;

                  return (
                    <div key={sIdx} className="p-4 rounded-2xl bg-white border border-[#E6E2D8] space-y-2.5 shadow-xs">
                      
                      {/* Header */}
                      <div className="flex items-center justify-between pb-1.5 border-b border-[#E6E2D8]">
                        <span className="text-xs font-black text-[#3E4F42] uppercase tracking-wide flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#A67C52]" />
                          {s.role} • {s.paragraphRole}
                        </span>
                        <span className="text-[10px] text-[#7A7369] font-mono">
                          Câu {sIdx + 1} / {proposalData.totalSentences}
                        </span>
                      </div>

                      {/* Vietnamese proposal */}
                      <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs">
                        <span className="text-[10px] font-bold text-[#A67C52] uppercase block mb-0.5">
                          🇻🇳 Câu tiếng Việt cần dịch:
                        </span>
                        <p className="text-[#24211E] font-medium leading-relaxed">
                          {s.vietnameseProposal}
                        </p>
                      </div>

                      {/* Band upgrades */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-semibold text-[#7A7369]">Chọn câu nâng cấp:</span>
                          {AVAILABLE_BANDS.map(band => (
                            <button
                              key={band}
                              type="button"
                              onClick={() => setSelectedUpgradeBandMap(prev => ({
                                ...prev,
                                [`s_${sIdx}`]: band
                              }))}
                              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                                activeBand === band
                                  ? "bg-[#3E4F42] text-white shadow-xs"
                                  : "bg-[#FAF8F5] text-[#7A7369] border border-[#E6E2D8]"
                              }`}
                            >
                              Band {band}
                            </button>
                          ))}
                        </div>

                        <div className="p-2 rounded-xl bg-[#EDF3EE]/50 border border-[#D1DDD3] text-xs flex items-start justify-between gap-2">
                          <p className="text-[#24211E] italic text-xs leading-relaxed">
                            "{currentUpgradeText}"
                          </p>
                          <button
                            type="button"
                            onClick={() => setSentTranslationDrafts(prev => ({
                              ...prev,
                              [sIdx]: currentUpgradeText
                            }))}
                            className="text-[10px] text-[#3E4F42] hover:underline cursor-pointer shrink-0 font-bold"
                          >
                            Áp dụng &rarr;
                          </button>
                        </div>
                      </div>

                      {/* Student input */}
                      <textarea
                        value={sentTranslationDrafts[sIdx] || ''}
                        onChange={(e) => setSentTranslationDrafts(prev => ({
                          ...prev,
                          [sIdx]: e.target.value
                        }))}
                        placeholder="Nhập bản dịch tiếng Anh của bạn..."
                        rows={2}
                        className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] focus:border-[#3E4F42] text-xs sm:text-sm leading-relaxed outline-none"
                      />

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. BÀI MẪU THEO BAND KÈM PHÂN TÍCH CHẤM ĐIỂM (BAND MODEL ESSAYS) ======= */}
        {/* ========================================================================= */}
        {essaySubMode === 'band_models' && (
          <div className="space-y-4 animate-fadeIn pb-8">
            
            {/* Top Control Banner: Band Selector & Word Count Adherence */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#E6E2D8]">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#24211E] flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#3E4F42]" />
                    <span>Bài mẫu chuẩn theo Band & Phân tích điểm IELTS Examiner</span>
                  </h3>
                  <p className="text-xs text-[#7A7369] mt-0.5">
                    Viết đúng & đủ số từ cần thiết (không viết lan man) • Giải thích chi tiết theo 4 tiêu chí chấm thi chính thức
                  </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(currentBandModel.fullEssayText, 'full_model_essay')}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFEA] border border-[#E6E2D8] text-[#24211E] text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                    title="Sao chép bài viết hoàn chỉnh"
                  >
                    {copiedKey === 'full_model_essay' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#7A7369]" />
                        <span>Sao chép bài mẫu</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFreestyleInput(currentBandModel.fullEssayText);
                      setEssaySubMode('freestyle');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#3E4F42] hover:bg-[#2F3C32] text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                    title="Đưa bài mẫu này vào khung tự viết để sửa và làm bài thi"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Đưa vào phòng thi luyện tập</span>
                  </button>
                </div>
              </div>

              {/* Band Pills & Word Count Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* 3 Band Pills */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs">
                  {BAND_LEVELS.map((lvl) => {
                    const isSelected = selectedModelBand === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setSelectedModelBand(lvl.id)}
                        className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-[#3E4F42] text-white shadow-xs"
                            : "text-[#7A7369] hover:text-[#24211E] hover:bg-white/80"
                        }`}
                      >
                        <span>{lvl.id === '6.5' ? '🎯' : lvl.id === '7.5' ? '⭐' : '💎'}</span>
                        <span>{lvl.label}</span>
                        <span className="hidden md:inline text-[10px] opacity-80 font-normal">({lvl.title})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Word Count Adherence Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EDF3EE] border border-[#D1DDD3] text-xs text-[#24211E]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-[#3E4F42]">{currentBandModel.actualWordCount} từ</span>
                    <span className="text-[#7A7369] ml-1.5 font-medium">• Chuẩn {isTask1 ? 'Task 1' : 'Task 2'} ({currentBandModel.idealRange})</span>
                  </div>
                  <span className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold ml-1">
                    Đủ từ - Không thừa
                  </span>
                </div>
              </div>
            </div>

            {/* Official Examiner Scorecard Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FAF8F5] to-[#F4EFEA] border border-[#E6E2D8] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6E2D8]">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#3E4F42] text-white flex flex-col items-center justify-center shadow-sm shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Band</span>
                    <span className="text-xl font-extrabold leading-tight">{currentBandModel.scorecard?.overall || selectedModelBand}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-[#24211E]">
                        {currentBandModel.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3E4F42]/10 text-[#3E4F42]">
                        IELTS Official Scale
                      </span>
                    </div>
                    <p className="text-xs text-[#7A7369] mt-0.5">
                      Đối tượng: <strong className="text-[#24211E]">{currentBandModel.targetAudience}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-xs text-[#7A7369] bg-white/80 px-3 py-2 rounded-xl border border-[#E6E2D8] shrink-0">
                  <div className="font-bold text-[#3E4F42] flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    <span>Lưu ý về độ dài từ:</span>
                  </div>
                  <p className="text-[11px] text-[#24211E] mt-0.5">
                    {isTask1 
                      ? "165-185 từ: Đủ 4 đoạn báo cáo sâu sắc, tránh viết >220 từ gây thiếu giờ Task 2."
                      : "260-285 từ: Độ dài vàng đủ phát triển 2 luận điểm đa chiều, tránh dài dòng >350 từ."}
                  </p>
                </div>
              </div>

              {/* 4 Criteria Scores Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {/* Criterion 1 */}
                <div className="p-3 rounded-xl bg-white border border-[#E6E2D8] shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#7A7369]">
                      {isTask1 ? 'Task Achievement' : 'Task Response'}
                    </span>
                    <span className="text-xs font-extrabold text-[#3E4F42] px-1.5 py-0.5 rounded bg-[#FAF8F5]">
                      {currentBandModel.scorecard?.criterion1Score}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#7A7369] line-clamp-2">
                    {isTask1 ? 'Mô tả số liệu & Overview' : 'Phát triển luận điểm & Lập trường'}
                  </p>
                </div>

                {/* Criterion 2 */}
                <div className="p-3 rounded-xl bg-white border border-[#E6E2D8] shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#7A7369]">Coherence & Cohesion</span>
                    <span className="text-xs font-extrabold text-[#3E4F42] px-1.5 py-0.5 rounded bg-[#FAF8F5]">
                      {currentBandModel.scorecard?.criterion2Score}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#7A7369] line-clamp-2">
                    Bố cục đoạn & Mạch liên kết ý
                  </p>
                </div>

                {/* Criterion 3 */}
                <div className="p-3 rounded-xl bg-white border border-[#E6E2D8] shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#7A7369]">Lexical Resource</span>
                    <span className="text-xs font-extrabold text-[#3E4F42] px-1.5 py-0.5 rounded bg-[#FAF8F5]">
                      {currentBandModel.scorecard?.criterion3Score}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#7A7369] line-clamp-2">
                    Vốn từ học thuật & Collocations
                  </p>
                </div>

                {/* Criterion 4 */}
                <div className="p-3 rounded-xl bg-white border border-[#E6E2D8] shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#7A7369]">Grammatical Range</span>
                    <span className="text-xs font-extrabold text-[#3E4F42] px-1.5 py-0.5 rounded bg-[#FAF8F5]">
                      {currentBandModel.scorecard?.criterion4Score}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#7A7369] line-clamp-2">
                    Cấu trúc câu phức & Độ chính xác
                  </p>
                </div>
              </div>
            </div>

            {/* Model Essay & Examiner Rationale Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Left Column: 4-Paragraph Model Essay (7 Cols on desktop) */}
              <div className="lg:col-span-7 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#3E4F42] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Nội dung bài viết mẫu ({currentBandModel.paragraphs.length} đoạn chuẩn mực)</span>
                  </h4>
                  <span className="text-[11px] text-[#7A7369]">
                    Tổng cộng: <strong>{currentBandModel.actualWordCount} từ</strong>
                  </span>
                </div>

                {/* Paragraphs List */}
                <div className="space-y-3">
                  {currentBandModel.paragraphs.map((p, pIdx) => {
                    const pWords = p.text.trim().split(/\s+/).filter(Boolean).length;
                    const pKey = `model_para_${selectedModelBand}_${pIdx}`;
                    return (
                      <div 
                        key={pIdx}
                        className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E6E2D8] hover:border-[#3E4F42]/40 transition shadow-xs space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-2 py-0.5 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8] font-bold text-[#3E4F42] text-[11px]">
                            {p.role}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#7A7369] font-medium">
                              {pWords} từ
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(p.text, pKey)}
                              className="p-1 rounded-md text-[#7A7369] hover:text-[#24211E] hover:bg-[#FAF8F5] transition cursor-pointer"
                              title="Sao chép đoạn này"
                            >
                              {copiedKey === pKey ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-[#24211E] leading-relaxed font-normal select-text">
                          {p.text}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Key Academic Vocabularies Table */}
                {currentBandModel.keyVocabularies && currentBandModel.keyVocabularies.length > 0 && (
                  <div className="p-4 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-[#3E4F42] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Từ vựng & Collocations đắt giá giúp ghi điểm Band {currentBandModel.band}</span>
                      </h5>
                    </div>

                    <div className="space-y-2">
                      {currentBandModel.keyVocabularies.map((vocab, vIdx) => (
                        <div 
                          key={vIdx}
                          className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#24211E] text-xs sm:text-sm">
                                {vocab.word}
                              </span>
                              {vocab.ipa && (
                                <span className="text-[11px] text-[#7A7369] italic font-mono">
                                  {vocab.ipa}
                                </span>
                              )}
                              {vocab.pos && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E6E2D8]/60 text-[#7A7369] font-medium">
                                  {vocab.pos}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#3E4F42] font-medium">
                              Nghĩa: {vocab.meaning}
                            </p>
                          </div>

                          {vocab.note && (
                            <span className="text-[10px] sm:max-w-xs text-right text-[#7A7369] bg-white px-2 py-1 rounded-lg border border-[#E6E2D8]/80 shrink-0">
                              💡 {vocab.note}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: In-Depth Examiner Scoring Justification (5 Cols on desktop) */}
              <div className="lg:col-span-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#3E4F42] flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    <span>Giải thích chi tiết theo cách chấm điểm IELTS</span>
                  </h4>
                </div>

                {/* Examiner Rationale Cards */}
                <div className="space-y-3">
                  
                  {/* Why this Band */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Tại sao bài này thuộc Band {currentBandModel.band}?</span>
                    </div>
                    <p className="text-xs text-[#24211E] leading-relaxed">
                      {currentBandModel.examinerRationale?.whyThisBand}
                    </p>
                  </div>

                  {/* Why not higher */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Tại sao bài này chưa đạt Band cao hơn?</span>
                    </div>
                    <p className="text-xs text-[#24211E] leading-relaxed">
                      {currentBandModel.examinerRationale?.whyNotHigher}
                    </p>
                  </div>

                  {/* Upgrade Advice */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#EDF3EE] border border-[#D1DDD3] shadow-xs space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#3E4F42]">
                      <TrendingUp className="w-4 h-4 text-[#3E4F42] shrink-0" />
                      <span>Lời khuyên thăng hạng Band (Upgrade Takeaways)</span>
                    </div>
                    <p className="text-xs text-[#24211E] leading-relaxed font-medium">
                      {currentBandModel.examinerRationale?.upgradeAdvice}
                    </p>
                  </div>

                  {/* 4 Criteria Breakdown Accordion/Cards */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs space-y-3">
                    <h5 className="text-xs font-bold text-[#24211E] flex items-center gap-1.5 pb-2 border-b border-[#E6E2D8]">
                      <span>📊</span>
                      <span>Đánh giá cụ thể theo từng tiêu chí chấm</span>
                    </h5>

                    {/* TA/TR Breakdown */}
                    {(currentBandModel.criteriaBreakdown?.ta || currentBandModel.criteriaBreakdown?.tr) && (
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-[#3E4F42]">
                          <span>1. {isTask1 ? 'Task Achievement' : 'Task Response'}</span>
                          <span className="px-1.5 py-0.2 rounded bg-[#FAF8F5] text-[11px]">
                            {currentBandModel.criteriaBreakdown?.ta?.score || currentBandModel.criteriaBreakdown?.tr?.score}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#24211E] bg-[#FAF8F5] p-2 rounded-lg border border-[#E6E2D8]/60">
                          <strong className="text-emerald-700">✓ Điểm mạnh: </strong>
                          {currentBandModel.criteriaBreakdown?.ta?.strengths || currentBandModel.criteriaBreakdown?.tr?.strengths}
                          <br />
                          <strong className="text-amber-700">⚠ Hạn chế: </strong>
                          {currentBandModel.criteriaBreakdown?.ta?.weaknesses || currentBandModel.criteriaBreakdown?.tr?.weaknesses}
                        </p>
                      </div>
                    )}

                    {/* CC Breakdown */}
                    {currentBandModel.criteriaBreakdown?.cc && (
                      <div className="space-y-1 text-xs pt-1">
                        <div className="flex items-center justify-between font-bold text-[#3E4F42]">
                          <span>2. Coherence & Cohesion</span>
                          <span className="px-1.5 py-0.2 rounded bg-[#FAF8F5] text-[11px]">
                            {currentBandModel.criteriaBreakdown?.cc?.score}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#24211E] bg-[#FAF8F5] p-2 rounded-lg border border-[#E6E2D8]/60">
                          <strong className="text-emerald-700">✓ Điểm mạnh: </strong>
                          {currentBandModel.criteriaBreakdown?.cc?.strengths}
                          <br />
                          <strong className="text-amber-700">⚠ Hạn chế: </strong>
                          {currentBandModel.criteriaBreakdown?.cc?.weaknesses}
                        </p>
                      </div>
                    )}

                    {/* LR Breakdown */}
                    {currentBandModel.criteriaBreakdown?.lr && (
                      <div className="space-y-1 text-xs pt-1">
                        <div className="flex items-center justify-between font-bold text-[#3E4F42]">
                          <span>3. Lexical Resource</span>
                          <span className="px-1.5 py-0.2 rounded bg-[#FAF8F5] text-[11px]">
                            {currentBandModel.criteriaBreakdown?.lr?.score}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#24211E] bg-[#FAF8F5] p-2 rounded-lg border border-[#E6E2D8]/60">
                          <strong className="text-emerald-700">✓ Điểm mạnh: </strong>
                          {currentBandModel.criteriaBreakdown?.lr?.strengths}
                          <br />
                          <strong className="text-amber-700">⚠ Hạn chế: </strong>
                          {currentBandModel.criteriaBreakdown?.lr?.weaknesses}
                        </p>
                      </div>
                    )}

                    {/* GRA Breakdown */}
                    {currentBandModel.criteriaBreakdown?.gra && (
                      <div className="space-y-1 text-xs pt-1">
                        <div className="flex items-center justify-between font-bold text-[#3E4F42]">
                          <span>4. Grammatical Range & Accuracy</span>
                          <span className="px-1.5 py-0.2 rounded bg-[#FAF8F5] text-[11px]">
                            {currentBandModel.criteriaBreakdown?.gra?.score}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#24211E] bg-[#FAF8F5] p-2 rounded-lg border border-[#E6E2D8]/60">
                          <strong className="text-emerald-700">✓ Điểm mạnh: </strong>
                          {currentBandModel.criteriaBreakdown?.gra?.strengths}
                          <br />
                          <strong className="text-amber-700">⚠ Hạn chế: </strong>
                          {currentBandModel.criteriaBreakdown?.gra?.weaknesses}
                        </p>
                      </div>
                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
