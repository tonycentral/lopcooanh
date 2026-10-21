// src/components/grammar/GrammarWorkspace.jsx
import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  RefreshCw, 
  Layers, 
  Lightbulb, 
  AlertTriangle,
  Award,
  ChevronRight
} from 'lucide-react';
import { IELTS_GRAMMAR_LESSONS } from '../../data/grammarData';

export default function GrammarWorkspace() {
  const [selectedLessonId, setSelectedLessonId] = useState(IELTS_GRAMMAR_LESSONS[0].id);
  const [exerciseAnswers, setExerciseAnswers] = useState({});
  const [exerciseResults, setExerciseResults] = useState({});

  const currentLesson = IELTS_GRAMMAR_LESSONS.find(l => l.id === selectedLessonId) || IELTS_GRAMMAR_LESSONS[0];

  const handleCheckAnswer = (exerciseId, expectedAnswer) => {
    const userAnswer = (exerciseAnswers[exerciseId] || "").trim().toLowerCase();
    const cleanExpected = expectedAnswer.trim().toLowerCase();
    
    // Flexible matching: check if core key structures match
    const isCorrect = userAnswer.length > 10 && (
      userAnswer === cleanExpected || 
      userAnswer.includes(cleanExpected.slice(0, Math.floor(cleanExpected.length * 0.7)))
    );

    setExerciseResults(prev => ({
      ...prev,
      [exerciseId]: {
        checked: true,
        isCorrect,
        expected: expectedAnswer
      }
    }));
  };

  return (
    <div className="h-full flex flex-col bg-[#F8F6F1] text-[#24211E] overflow-hidden select-none">
      
      {/* Top Banner Ribbon */}
      <div className="bg-white border-b border-[#E6E2D8] px-4 sm:px-6 py-3 shrink-0 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] flex items-center justify-center font-bold text-sm shadow-2xs">
            <Sparkles className="w-5 h-5 text-[#3E4F42]" />
          </div>
          <div>
            <h1 className="font-title font-bold text-base sm:text-lg text-[#24211E] leading-tight">
              Luyện Ngữ Pháp Học Thuật (IELTS Grammar Band 7.0 - 8.5+)
            </h1>
            <p className="text-xs text-[#7A7369] mt-0.5">
              Chinh phục tiêu chí Grammatical Range &amp; Accuracy với các cấu trúc bứt phá điểm số
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EE] text-[#A67C52] border border-[#E6E2D8] text-xs font-mono font-bold">
          <Award className="w-3.5 h-3.5" />
          <span>6 Chuyên đề trọng tâm</span>
        </div>
      </div>

      {/* Main Workspace: 2 Columns */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 p-3 sm:p-4 overflow-hidden">
        
        {/* Left Col: Menu Danh sách 6 chuyên đề (4 cols) */}
        <div className="md:col-span-4 h-full bg-white border border-[#E6E2D8] rounded-2xl p-3 flex flex-col overflow-hidden shadow-xs">
          <div className="pb-2.5 border-b border-[#E6E2D8] flex items-center justify-between shrink-0">
            <span className="text-xs font-bold text-[#A67C52] uppercase tracking-wider">
              Danh mục chuyên đề ngữ pháp
            </span>
            <span className="text-[10px] font-mono text-[#7A7369]">
              {IELTS_GRAMMAR_LESSONS.length} bài học
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto space-y-2 py-2 pr-1 scrollbar-thin">
            {IELTS_GRAMMAR_LESSONS.map((lesson) => {
              const isSelected = lesson.id === currentLesson.id;
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`w-full p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? "bg-[#EDF3EE] border-[#3E4F42] shadow-xs ring-1 ring-[#3E4F42]"
                      : "bg-[#FAF8F5] hover:bg-white border-[#E6E2D8]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-[#24211E] truncate">
                      {lesson.title}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white text-[#3E4F42] border border-[#D1DDD3] font-mono font-bold shrink-0">
                      {lesson.bandTarget}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A7369] line-clamp-2 leading-relaxed">
                    {lesson.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Nội dung chi tiết chuyên đề & Bài tập thực hành (8 cols) */}
        <div className="md:col-span-8 h-full bg-white border border-[#E6E2D8] rounded-2xl p-4 flex flex-col overflow-hidden shadow-xs">
          
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-5 scrollbar-thin select-text">
            
            {/* Header chuyên đề */}
            <div className="space-y-1.5 pb-3 border-b border-[#E6E2D8]">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-[#24211E]">
                  {currentLesson.title}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] text-xs font-mono font-bold">
                  Mục tiêu: {currentLesson.bandTarget}
                </span>
              </div>
              <p className="text-xs text-[#7A7369] leading-relaxed">
                {currentLesson.summary}
              </p>
              <div className="text-[11px] font-semibold text-[#A67C52] flex items-center gap-1.5 pt-0.5">
                <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                <span>Ứng dụng: {currentLesson.frequency}</span>
              </div>
            </div>

            {/* Danh sách các cấu trúc & So sánh Band 6 vs Band 8 */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#3E4F42] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Các mẫu câu nâng cấp điểm số:</span>
              </h3>

              {currentLesson.structures.map((st, sIdx) => (
                <div key={sIdx} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-bold text-xs text-[#24211E]">{st.name}</span>
                    <span className="text-[11px] font-mono text-[#3E4F42] bg-[#EDF3EE] px-2 py-0.5 rounded-md border border-[#D1DDD3] font-semibold">
                      {st.formula}
                    </span>
                  </div>

                  {/* Bảng so sánh Band 6 vs Band 8 */}
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
                        <span>🟢 Nâng cấp học thuật (Band 7.5 - 8.5):</span>
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
              <div className="space-y-3 pt-3 border-t border-[#E6E2D8]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#A67C52] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Bài tập thực hành tương tác:</span>
                </h3>

                {currentLesson.exercises.map((ex) => {
                  const result = exerciseResults[ex.id];
                  return (
                    <div key={ex.id} className="p-3.5 rounded-xl border border-[#E6E2D8] bg-[#FAF8F5] space-y-2.5">
                      <div className="text-xs font-bold text-[#24211E]">
                        {ex.prompt}
                      </div>

                      {ex.hint && (
                        <div className="text-[11px] text-[#7A7369] italic flex items-center gap-1">
                          <HelpCircle className="w-3 h-3 text-[#A67C52]" />
                          <span>Gợi ý: {ex.hint}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={exerciseAnswers[ex.id] || ""}
                          onChange={(e) => setExerciseAnswers({ ...exerciseAnswers, [ex.id]: e.target.value })}
                          placeholder="Nhập câu viết lại của bạn vào đây..."
                          className="flex-1 bg-white border border-[#E6E2D8] rounded-xl px-3 py-2 text-xs text-[#24211E] outline-none focus:border-[#3E4F42] transition"
                        />
                        <button
                          type="button"
                          onClick={() => handleCheckAnswer(ex.id, ex.expected)}
                          className="px-3.5 py-2 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white text-xs font-bold transition cursor-pointer shadow-xs shrink-0"
                        >
                          Kiểm tra
                        </button>
                      </div>

                      {result && result.checked && (
                        <div className={`p-2.5 rounded-xl text-xs space-y-1 animate-fadeIn border ${
                          result.isCorrect 
                            ? "bg-[#EDF3EE] border-[#D1DDD3] text-[#3E4F42]" 
                            : "bg-[#FAF5EE] border-[#E6E2D8] text-[#A67C52]"
                        }`}>
                          <div className="font-bold flex items-center gap-1.5">
                            {result.isCorrect ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-[#3E4F42]" />
                                <span>Rất tốt! Cấu trúc câu chuẩn xác Band cao.</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-4 h-4 text-[#A67C52]" />
                                <span>Chưa hoàn toàn chuẩn xác. Xem câu mẫu chuẩn bên dưới:</span>
                              </>
                            )}
                          </div>
                          <div className="font-mono text-[11px] bg-white p-2 rounded-lg border border-[#E6E2D8] text-[#24211E] select-text">
                            {result.expected}
                          </div>
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

    </div>
  );
}
