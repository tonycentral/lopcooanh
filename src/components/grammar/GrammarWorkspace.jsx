// src/components/grammar/GrammarWorkspace.jsx
import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  RefreshCw, 
  Layers, 
  Lightbulb, 
  AlertTriangle,
  Award,
  ChevronRight,
  Filter,
  Search,
  Target,
  Check,
  RotateCcw,
  Eye,
  Info,
  Zap,
  X,
  Compass,
  ArrowRight
} from 'lucide-react';
import { IELTS_GRAMMAR_LESSONS, GRAMMAR_STAGES, KUNGFU_RULES } from '../../data/grammarData';

export default function GrammarWorkspace({ targetBand = "7.0", onOpenBandModal }) {
  const [selectedLessonId, setSelectedLessonId] = useState(IELTS_GRAMMAR_LESSONS[0].id);
  const [exerciseAnswers, setExerciseAnswers] = useState({});
  const [exerciseResults, setExerciseResults] = useState({});
  const [revealedHints, setRevealedHints] = useState({});
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [activeStageFilter, setActiveStageFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showKungfuModal, setShowKungfuModal] = useState(false);

  // Determine user's recommended stage based on targetBand
  const userTargetNum = parseFloat(targetBand) || 7.0;
  const recommendedStage = useMemo(() => {
    if (userTargetNum <= 6.0) return 'forming';
    if (userTargetNum <= 7.0) return 'developing';
    return 'mastering';
  }, [userTargetNum]);

  // Filter lessons
  const filteredLessons = useMemo(() => {
    return IELTS_GRAMMAR_LESSONS.filter(lesson => {
      // Stage filter
      if (activeStageFilter === 'my_goal') {
        if (lesson.stage !== recommendedStage) return false;
      } else if (activeStageFilter !== 'all' && lesson.stage !== activeStageFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = lesson.title.toLowerCase().includes(query);
        const matchesSummary = lesson.summary.toLowerCase().includes(query);
        const matchesCriterion = (lesson.graCriterion || "").toLowerCase().includes(query);
        return matchesTitle || matchesSummary || matchesCriterion;
      }

      return true;
    });
  }, [activeStageFilter, recommendedStage, searchQuery]);

  // Current selected lesson
  const currentLesson = useMemo(() => {
    const found = IELTS_GRAMMAR_LESSONS.find(l => l.id === selectedLessonId);
    if (found) return found;
    return filteredLessons[0] || IELTS_GRAMMAR_LESSONS[0];
  }, [selectedLessonId, filteredLessons]);

  // Count completed exercises
  const completedExercisesCount = useMemo(() => {
    return Object.values(exerciseResults).filter(r => r.isCorrect).length;
  }, [exerciseResults]);

  // Intelligent Answer Checker
  const handleCheckAnswer = (exercise) => {
    const rawUserAnswer = (exerciseAnswers[exercise.id] || "").trim();
    if (!rawUserAnswer) return;

    const normalize = (text) => {
      return text
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
        .replace(/\s+/g, " ")
        .trim();
    };

    const normUser = normalize(rawUserAnswer);
    const normExpected = normalize(exercise.expected);

    let isCorrect = normUser === normExpected;

    if (!isCorrect && exercise.acceptableAlternatives && exercise.acceptableAlternatives.length > 0) {
      isCorrect = exercise.acceptableAlternatives.some(alt => normalize(alt) === normUser);
    }

    if (!isCorrect && normUser.length > 12) {
      const userWords = new Set(normUser.split(' '));
      const expectedWords = normExpected.split(' ');
      let overlap = 0;
      expectedWords.forEach(w => {
        if (userWords.has(w)) overlap++;
      });
      const ratio = overlap / expectedWords.length;
      if (ratio >= 0.82) {
        isCorrect = true;
      }
    }

    setExerciseResults(prev => ({
      ...prev,
      [exercise.id]: {
        checked: true,
        isCorrect,
        expected: exercise.expected,
        explanation: exercise.explanation
      }
    }));
  };

  const handleResetAnswer = (exerciseId) => {
    setExerciseAnswers(prev => ({ ...prev, [exerciseId]: "" }));
    setExerciseResults(prev => {
      const updated = { ...prev };
      delete updated[exerciseId];
      return updated;
    });
    setRevealedAnswers(prev => ({ ...prev, [exerciseId]: false }));
  };

  const toggleRevealAnswer = (exerciseId) => {
    setRevealedAnswers(prev => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  };

  const toggleRevealHint = (exerciseId) => {
    setRevealedHints(prev => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  };

  const getStageBadge = (stage) => {
    switch (stage) {
      case 'forming':
        return { label: 'Tạo lập (5.0 - 6.0)', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'developing':
        return { label: 'Phát triển (6.0 - 7.0)', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'mastering':
        return { label: 'Đỉnh cao (7.0 - 8.5+)', bg: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      default:
        return { label: 'IELTS Grammar', bg: 'bg-[#EDF3EE] text-[#3E4F42] border-[#D1DDD3]' };
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#F8F6F1] text-[#24211E] overflow-hidden select-none">
      
      {/* Top Banner Ribbon */}
      <div className="bg-white border-b border-[#E6E2D8] px-4 sm:px-6 py-3 shrink-0 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] flex items-center justify-center font-bold text-sm shadow-2xs">
            <Sparkles className="w-5 h-5 text-[#3E4F42]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-title font-bold text-base sm:text-lg text-[#24211E] leading-tight">
                Luyện Ngữ Pháp Học Thuật IELTS
              </h1>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold border bg-[#EDF3EE] text-[#3E4F42] border-[#D1DDD3]">
                Theo chuẩn ZIM &amp; Grammar Bible
              </span>
            </div>
            <p className="text-xs text-[#7A7369] mt-0.5">
              17 chuyên đề cấu trúc phức &amp; kỹ thuật Paraphrasing — thích ứng theo mục tiêu điểm số của bạn
            </p>
          </div>
        </div>

        {/* Action Controls & Adaptive Target */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowKungfuModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF5EE] hover:bg-[#F2E8DC] text-[#A67C52] border border-[#E6E2D8] text-xs font-semibold transition cursor-pointer shadow-2xs"
            title="Xem các lưu ý quan trọng từ giám khảo"
          >
            <Zap className="w-3.5 h-3.5 text-[#A67C52]" />
            <span className="hidden sm:inline">Cẩm nang</span> Kungfu
          </button>

          <button
            type="button"
            onClick={onOpenBandModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EDF3EE] text-[#24211E] border border-[#E6E2D8] text-xs font-semibold transition cursor-pointer shadow-2xs group"
            title="Nhấn để đổi mục tiêu Band"
          >
            <Target className="w-3.5 h-3.5 text-[#3E4F42] group-hover:scale-110 transition-transform" />
            <span>Mục tiêu:</span>
            <strong className="text-[#3E4F42] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-[#D1DDD3]">
              Band {targetBand}
            </strong>
          </button>

          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] text-xs font-mono font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Đã đạt: {completedExercisesCount} câu đúng</span>
          </div>
        </div>
      </div>

      {/* Main Workspace: 2 Columns */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 p-3 sm:p-4 overflow-hidden">
        
        {/* Left Col: Menu Danh sách chuyên đề & Bộ lọc thích ứng (4 cols) */}
        <div className="md:col-span-4 h-full bg-white border border-[#E6E2D8] rounded-2xl p-3 flex flex-col overflow-hidden shadow-xs">
          
          {/* Search & Adaptive Filter Tabs */}
          <div className="space-y-2 pb-2.5 border-b border-[#E6E2D8] shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7A7369]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài học, đảo ngữ, bị động, mệnh đề..."
                className="w-full bg-[#FAF8F5] border border-[#E6E2D8] rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-[#24211E] placeholder:text-[#7A7369] outline-none focus:border-[#3E4F42] transition"
              />
            </div>

            {/* Stage Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
              <button
                type="button"
                onClick={() => setActiveStageFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                  activeStageFilter === 'all'
                    ? "bg-[#3E4F42] text-white shadow-2xs"
                    : "bg-[#FAF8F5] text-[#7A7369] hover:bg-white hover:text-[#24211E] border border-[#E6E2D8]"
                }`}
              >
                Tất cả ({IELTS_GRAMMAR_LESSONS.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveStageFilter('my_goal')}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                  activeStageFilter === 'my_goal'
                    ? "bg-[#3E4F42] text-white shadow-2xs"
                    : "bg-[#EDF3EE] text-[#3E4F42] hover:bg-[#E3EDE5] border border-[#D1DDD3]"
                }`}
                title={`Lọc theo giai đoạn khuyên học cho Band ${targetBand}`}
              >
                <Target className="w-3 h-3" />
                <span>Band {targetBand}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStageFilter('forming')}
                className={`px-2 py-1 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                  activeStageFilter === 'forming'
                    ? "bg-amber-700 text-white shadow-2xs"
                    : "bg-[#FAF8F5] text-[#7A7369] hover:bg-white border border-[#E6E2D8]"
                }`}
              >
                1. Tạo lập câu
              </button>

              <button
                type="button"
                onClick={() => setActiveStageFilter('developing')}
                className={`px-2 py-1 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                  activeStageFilter === 'developing'
                    ? "bg-emerald-700 text-white shadow-2xs"
                    : "bg-[#FAF8F5] text-[#7A7369] hover:bg-white border border-[#E6E2D8]"
                }`}
              >
                2. Phát triển
              </button>

              <button
                type="button"
                onClick={() => setActiveStageFilter('mastering')}
                className={`px-2 py-1 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                  activeStageFilter === 'mastering'
                    ? "bg-indigo-700 text-white shadow-2xs"
                    : "bg-[#FAF8F5] text-[#7A7369] hover:bg-white border border-[#E6E2D8]"
                }`}
              >
                3. Đỉnh cao
              </button>
            </div>
          </div>

          {/* Lessons List */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-2 py-2 pr-1 scrollbar-thin">
            {filteredLessons.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#7A7369]">
                Không tìm thấy chuyên đề phù hợp với "{searchQuery}".
              </div>
            ) : (
              filteredLessons.map((lesson) => {
                const isSelected = lesson.id === currentLesson.id;
                const badge = getStageBadge(lesson.stage);
                const isRecommended = lesson.stage === recommendedStage;

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={`w-full p-2.5 sm:p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? "bg-[#EDF3EE] border-[#3E4F42] shadow-xs ring-1 ring-[#3E4F42]"
                        : "bg-[#FAF8F5] hover:bg-white border-[#E6E2D8]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-bold text-xs text-[#24211E] truncate">
                        {lesson.title}
                      </span>
                      {isRecommended && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#3E4F42] text-white font-mono font-bold shrink-0">
                          Mục tiêu
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-1 text-[10px]">
                      <span className={`px-2 py-0.5 rounded-md border font-semibold ${badge.bg}`}>
                        {lesson.bandTarget}
                      </span>
                      <span className="text-[#7A7369] font-mono">
                        {lesson.exercises ? `${lesson.exercises.length} bài tập` : ''}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#7A7369] line-clamp-2 leading-relaxed">
                      {lesson.summary}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Nội dung chi tiết chuyên đề & Bài tập thực hành (8 cols) */}
        <div className="md:col-span-8 h-full bg-white border border-[#E6E2D8] rounded-2xl p-4 flex flex-col overflow-hidden shadow-xs">
          
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-5 scrollbar-thin select-text">
            
            {/* Header chuyên đề */}
            <div className="space-y-2 pb-3.5 border-b border-[#E6E2D8]">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-[#24211E]">
                  {currentLesson.title}
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full border text-xs font-mono font-bold ${getStageBadge(currentLesson.stage).bg}`}>
                    {currentLesson.bandTarget}
                  </span>
                  {currentLesson.stage === recommendedStage && (
                    <span className="px-2 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] text-[11px] font-bold">
                      ⭐ Khuyên học cho Band {targetBand}
                    </span>
                  )}
                </div>
              </div>

              {currentLesson.graCriterion && (
                <div className="text-[11px] font-mono text-[#3E4F42] bg-[#EDF3EE]/60 px-2.5 py-1 rounded-lg border border-[#D1DDD3] inline-flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#3E4F42] shrink-0" />
                  <span>{currentLesson.graCriterion}</span>
                </div>
              )}

              <p className="text-xs text-[#7A7369] leading-relaxed">
                {currentLesson.summary}
              </p>

              {/* Kungfu Note Callout */}
              {currentLesson.kungfuNote && (
                <div className="p-3 rounded-xl bg-[#FAF5EE] border border-[#E6E2D8] text-xs space-y-1">
                  <div className="font-bold text-[#A67C52] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#A67C52]" />
                    <span>KUNGFU NOTES / Lưu ý phòng thi:</span>
                  </div>
                  <p className="text-[11px] text-[#24211E] leading-relaxed">
                    {currentLesson.kungfuNote}
                  </p>
                </div>
              )}

              <div className="text-[11px] font-semibold text-[#A67C52] flex items-center gap-1.5 pt-0.5">
                <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                <span>Ứng dụng thực chiến: {currentLesson.frequency}</span>
              </div>
            </div>

            {/* Danh sách các cấu trúc & So sánh Band thường gặp vs Band Nâng cấp */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#3E4F42] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Công thức &amp; Mẫu câu nâng tầm điểm số:</span>
              </h3>

              {currentLesson.structures.map((st, sIdx) => (
                <div key={sIdx} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-bold text-xs text-[#24211E]">{st.name}</span>
                    <span className="text-[11px] font-mono text-[#3E4F42] bg-[#EDF3EE] px-2 py-0.5 rounded-md border border-[#D1DDD3] font-semibold">
                      {st.formula}
                    </span>
                  </div>

                  {/* Bảng so sánh Band thường gặp vs Band Nâng cấp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-[#E6E2D8] space-y-1">
                      <div className="text-[10px] font-bold text-[#7A7369] uppercase">
                        🔴 Câu thường gặp (Band 5.5 - 6.0):
                      </div>
                      <div className="text-[#24211E] italic">"{st.band6}"</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#EDF3EE]/60 border border-[#D1DDD3] space-y-1">
                      <div className="text-[10px] font-bold text-[#3E4F42] uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#3E4F42]" />
                        <span>🟢 Nâng cấp học thuật ({currentLesson.bandTarget}):</span>
                      </div>
                      <div className="text-[#3E4F42] font-semibold">"{st.band8}"</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#7A7369] leading-relaxed pt-1 border-t border-[#F4EFEA]">
                    <strong className="text-[#24211E]">Phân tích kỹ thuật:</strong> {st.explanation}
                  </div>
                </div>
              ))}
            </div>

            {/* Bài tập thực hành tương tác */}
            {currentLesson.exercises && currentLesson.exercises.length > 0 && (
              <div className="space-y-3.5 pt-3 border-t border-[#E6E2D8]">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#A67C52] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Bài tập thực hành tương tác ({currentLesson.exercises.length} câu):</span>
                  </h3>
                  <span className="text-[11px] font-mono text-[#7A7369]">
                    Nhập câu hoàn chỉnh và bấm "Kiểm tra"
                  </span>
                </div>

                {currentLesson.exercises.map((ex, exIdx) => {
                  const result = exerciseResults[ex.id];
                  const hasAnswered = !!(exerciseAnswers[ex.id] || "").trim();
                  const isHintShown = revealedHints[ex.id];
                  const isAnswerShown = revealedAnswers[ex.id];

                  const typeLabel = ex.type === 'combine' 
                    ? 'Nối 2 câu thành câu phức' 
                    : ex.type === 'correct' 
                    ? 'Phát hiện & sửa lỗi sai' 
                    : ex.type === 'fill'
                    ? 'Điền từ / Chia động từ'
                    : 'Viết lại câu nâng cấp cấu trúc';

                  return (
                    <div key={ex.id} className="p-3.5 rounded-xl border border-[#E6E2D8] bg-[#FAF8F5] space-y-2.5 shadow-2xs">
                      
                      {/* Exercise Header */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-[#E6E2D8] text-[#3E4F42]">
                          Bài {exIdx + 1}: {typeLabel}
                        </span>
                        {ex.hint && (
                          <button
                            type="button"
                            onClick={() => toggleRevealHint(ex.id)}
                            className="text-[11px] text-[#A67C52] hover:text-[#8C6339] font-medium flex items-center gap-1 transition cursor-pointer"
                          >
                            <HelpCircle className="w-3 h-3" />
                            <span>{isHintShown ? "Ẩn gợi ý" : "Xem gợi ý"}</span>
                          </button>
                        )}
                      </div>

                      {/* Prompt */}
                      <div className="text-xs font-bold text-[#24211E] leading-relaxed">
                        {ex.prompt}
                      </div>

                      {/* Hint Banner */}
                      {isHintShown && ex.hint && (
                        <div className="text-[11px] text-[#7A7369] italic bg-white p-2.5 rounded-xl border border-[#E6E2D8] flex items-center gap-1.5 animate-fadeIn">
                          <HelpCircle className="w-3.5 h-3.5 text-[#A67C52] shrink-0" />
                          <span><strong>Gợi ý:</strong> {ex.hint}</span>
                        </div>
                      )}

                      {/* Input & Action buttons */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={exerciseAnswers[ex.id] || ""}
                          onChange={(e) => setExerciseAnswers({ ...exerciseAnswers, [ex.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCheckAnswer(ex);
                          }}
                          placeholder="Nhập câu tiếng Anh của bạn vào đây..."
                          className="flex-1 bg-white border border-[#E6E2D8] rounded-xl px-3 py-2 text-xs text-[#24211E] outline-none focus:border-[#3E4F42] transition shadow-2xs"
                        />
                        
                        <button
                          type="button"
                          onClick={() => handleCheckAnswer(ex)}
                          disabled={!hasAnswered}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs shrink-0 flex items-center gap-1 ${
                            hasAnswered
                              ? "bg-[#3E4F42] hover:bg-[#334237] text-white"
                              : "bg-[#E6E2D8] text-[#7A7369] cursor-not-allowed"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Kiểm tra</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleRevealAnswer(ex.id)}
                          className="px-2.5 py-2 rounded-xl bg-white hover:bg-[#FAF5EE] text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8] text-xs transition cursor-pointer shrink-0"
                          title="Xem đáp án mẫu"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {(result || hasAnswered) && (
                          <button
                            type="button"
                            onClick={() => handleResetAnswer(ex.id)}
                            className="p-2 rounded-xl bg-white hover:bg-red-50 text-[#7A7369] hover:text-red-700 border border-[#E6E2D8] transition cursor-pointer shrink-0"
                            title="Làm lại câu này"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Result Feedback Banner */}
                      {result && result.checked && (
                        <div className={`p-3 rounded-xl text-xs space-y-1.5 animate-fadeIn border ${
                          result.isCorrect 
                            ? "bg-[#EDF3EE] border-[#D1DDD3] text-[#3E4F42]" 
                            : "bg-[#FAF5EE] border-[#E6E2D8] text-[#A67C52]"
                        }`}>
                          <div className="font-bold flex items-center gap-1.5">
                            {result.isCorrect ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-[#3E4F42]" />
                                <span>Tuyệt vời! Cấu trúc câu chuẩn xác theo tiêu chí Grammatical Range.</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-4 h-4 text-[#A67C52]" />
                                <span>Chưa hoàn toàn chuẩn xác. Xem câu mẫu chuẩn học thuật bên dưới:</span>
                              </>
                            )}
                          </div>

                          <div className="font-mono text-[11px] bg-white p-2.5 rounded-lg border border-[#E6E2D8] text-[#24211E] select-text leading-relaxed">
                            <strong className="text-[#3E4F42]">Câu mẫu chuẩn:</strong> {result.expected}
                          </div>

                          {result.explanation && (
                            <div className="text-[11px] text-[#7A7369] pt-1 border-t border-[#E6E2D8]/50">
                              <strong className="text-[#24211E]">Giải thích:</strong> {result.explanation}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Revealed Model Answer Toggle */}
                      {isAnswerShown && (!result || !result.checked) && (
                        <div className="p-3 rounded-xl bg-white border border-[#E6E2D8] text-xs space-y-1.5 animate-fadeIn">
                          <div className="font-mono text-[11px] text-[#24211E] select-text leading-relaxed">
                            <strong className="text-[#3E4F42]">Đáp án mẫu tham khảo:</strong> {ex.expected}
                          </div>
                          {ex.explanation && (
                            <div className="text-[11px] text-[#7A7369] pt-1 border-t border-[#E6E2D8]">
                              <strong className="text-[#24211E]">Giải thích:</strong> {ex.explanation}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Kungfu Notes Modal */}
      {showKungfuModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white border border-[#E6E2D8] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#E6E2D8] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] text-[#A67C52] border border-[#E6E2D8] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#A67C52]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#24211E]">
                    Cẩm Nang Kungfu &amp; Bí Kíp Ngữ Pháp IELTS
                  </h3>
                  <p className="text-[11px] text-[#7A7369]">
                    Tổng hợp từ ZIM &amp; Grammar Bible — Các lưu ý phòng thi sống còn
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowKungfuModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#E6E2D8] text-[#7A7369] hover:text-[#24211E] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 scrollbar-thin">
              {KUNGFU_RULES.map((rule, rIdx) => (
                <div key={rIdx} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-[#24211E]">{rule.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-[#D1DDD3] text-[#3E4F42] font-semibold">
                      {rule.tag}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A7369] leading-relaxed">
                    {rule.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#FAF8F5] border-t border-[#E6E2D8] flex justify-end">
              <button
                type="button"
                onClick={() => setShowKungfuModal(false)}
                className="px-4 py-1.5 rounded-xl bg-[#3E4F42] text-white text-xs font-bold transition cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
