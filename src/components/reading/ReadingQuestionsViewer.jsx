// src/components/reading/ReadingQuestionsViewer.jsx
import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Flag, 
  RotateCcw, 
  Send, 
  Sparkles,
  Info,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function ReadingQuestionsViewer({
  questions = [],
  userAnswers = {},
  onAnswerChange,
  isSubmitted = false,
  flaggedQuestions = new Set(),
  onToggleFlag,
  onResetAnswers,
  onSubmitTest,
  activeQuestionId,
  onSelectQuestion
}) {
  const answeredCount = Object.keys(userAnswers).filter(k => (userAnswers[k] || '').trim()).length;
  const totalCount = questions.length;

  // Calculate question sections (Cambridge IELTS standard groupings)
  const sections = [];
  let currentSection = null;

  questions.forEach((q, idx) => {
    if (!currentSection || currentSection.type !== q.type) {
      currentSection = {
        type: q.type,
        startIndex: idx,
        endIndex: idx,
        startNum: idx + 1,
        endNum: idx + 1
      };
      sections.push(currentSection);
    } else {
      currentSection.endIndex = idx;
      currentSection.endNum = idx + 1;
    }
  });

  const sectionStarts = new Map();
  sections.forEach(sec => {
    sectionStarts.set(sec.startIndex, sec);
  });

  return (
    <div className="flex flex-col h-full bg-white border border-[#E6E2D8] rounded-2xl shadow-xs overflow-hidden">
      
      {/* Top Header */}
      <div className="p-3 sm:p-3.5 border-b border-[#E6E2D8] bg-[#FAF8F5] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FAF5EE] text-[#A67C52] flex items-center justify-center font-bold text-xs">
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#24211E] uppercase tracking-wider">Cambridge IELTS Reading</h3>
            <p className="text-[10px] text-[#7A7369]">
              {isSubmitted ? `Đã nộp bài • ${totalCount} câu hỏi chuẩn Cambridge` : `Đã hoàn thành ${answeredCount}/${totalCount} câu`}
            </p>
          </div>
        </div>

        {/* Progress Bar & Reset Button */}
        <div className="flex items-center gap-2">
          {!isSubmitted && (
            <button
              type="button"
              onClick={onResetAnswers}
              className="p-1.5 rounded-lg text-[#7A7369] hover:text-[#24211E] hover:bg-[#F4EFEA] transition cursor-pointer text-xs flex items-center gap-1"
              title="Làm lại từ đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Làm lại</span>
            </button>
          )}

          <div className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-[#E6E2D8] font-bold text-[#3E4F42]">
            {Math.round((answeredCount / (totalCount || 1)) * 100)}%
          </div>
        </div>
      </div>

      {/* Computer-Delivered IELTS Quick Question Palette (1 - 13) */}
      <div className="px-3 py-2 border-b border-[#E6E2D8] bg-white flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        <span className="text-[10px] font-bold text-[#7A7369] uppercase tracking-wider shrink-0 mr-0.5">
          Câu:
        </span>
        {questions.map((q, idx) => {
          const qNum = idx + 1;
          const userVal = userAnswers[q.id] || "";
          const isFlagged = flaggedQuestions.has(q.id);
          const isAnswered = Boolean(userVal.trim());
          const isActive = activeQuestionId === q.id;

          let statusClass = "bg-[#FAF8F5] text-[#7A7369] border-[#E6E2D8] hover:border-[#3E4F42]";
          if (isSubmitted) {
            let isCorrect = false;
            if (q.type === 'sentence_completion') {
              const cleanUser = userVal.toLowerCase().trim();
              const acceptable = (q.acceptableAnswers || [q.correctAnswer]).map(a => a.toLowerCase().trim());
              isCorrect = acceptable.includes(cleanUser);
            } else {
              isCorrect = userVal.trim().toUpperCase() === (q.correctAnswer || '').trim().toUpperCase();
            }
            statusClass = isCorrect 
              ? "bg-[#EDF3EE] text-[#3E4F42] border-[#3E4F42] font-bold" 
              : "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA] font-bold";
          } else if (isAnswered) {
            statusClass = "bg-[#3E4F42] text-white border-[#3E4F42] font-bold";
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                onSelectQuestion && onSelectQuestion(q.id);
                const el = document.getElementById(`question-card-${q.id}`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className={`relative min-w-[28px] h-7 px-1.5 rounded-lg border text-xs font-mono transition cursor-pointer flex items-center justify-center ${statusClass} ${
                isActive ? "ring-2 ring-[#A67C52] ring-offset-1" : ""
              }`}
              title={`Câu ${qNum} (${q.type === 'tfng' ? 'TFNG' : q.type === 'multiple_choice' ? 'MCQ' : 'Điền từ'})`}
            >
              <span>{qNum}</span>
              {isFlagged && !isSubmitted && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#A67C52]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Questions Scrollable List */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-5 scrollbar-thin">
        
        {questions.map((q, idx) => {
          const qNum = idx + 1;
          const userVal = userAnswers[q.id] || "";
          const isFlagged = flaggedQuestions.has(q.id);
          const section = sectionStarts.get(idx);

          // Evaluation for submitted test
          let isCorrect = false;
          if (isSubmitted) {
            if (q.type === 'sentence_completion') {
              const cleanUser = userVal.toLowerCase().trim();
              const acceptable = (q.acceptableAnswers || [q.correctAnswer]).map(a => a.toLowerCase().trim());
              isCorrect = acceptable.includes(cleanUser);
            } else {
              isCorrect = userVal.trim().toUpperCase() === (q.correctAnswer || '').trim().toUpperCase();
            }
          }

          return (
            <React.Fragment key={q.id}>
              {/* Cambridge Section Instruction Banner */}
              {section && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#D1DDD3] text-[#24211E] space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-[#E6E2D8] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3E4F42]" />
                      <h4 className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-[#3E4F42]">
                        Questions {section.startNum}–{section.endNum}
                      </h4>
                    </div>
                    <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded bg-white text-[#7A7369] border border-[#E6E2D8]">
                      {section.type === 'tfng' 
                        ? 'TRUE / FALSE / NOT GIVEN' 
                        : section.type === 'sentence_completion' 
                        ? 'Sentence Completion' 
                        : 'Multiple Choice (A, B, C, D)'}
                    </span>
                  </div>

                  {section.type === 'tfng' && (
                    <div className="space-y-2 text-xs">
                      <p className="font-serif italic text-xs text-[#57534E]">
                        Do the following statements agree with the information given in the Reading Passage?
                      </p>
                      <p className="text-[11px] text-[#7A7369]">
                        In boxes {section.startNum}–{section.endNum} on your answer sheet, choose:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono pt-1">
                        <div className="p-2 rounded-xl bg-white border border-[#E6E2D8] leading-tight">
                          <strong className="text-[#3E4F42] block mb-0.5">TRUE</strong>
                          <span className="text-[10px] text-[#7A7369]">if the statement agrees with the information</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white border border-[#E6E2D8] leading-tight">
                          <strong className="text-[#B45309] block mb-0.5">FALSE</strong>
                          <span className="text-[10px] text-[#7A7369]">if the statement contradicts the information</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white border border-[#E6E2D8] leading-tight">
                          <strong className="text-[#7A7369] block mb-0.5">NOT GIVEN</strong>
                          <span className="text-[10px] text-[#7A7369]">if there is no information on this</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.type === 'sentence_completion' && (
                    <div className="space-y-1 text-xs">
                      <p className="font-serif italic text-xs text-[#57534E]">
                        Complete the sentences below.
                      </p>
                      <p className="text-xs text-[#24211E]">
                        Choose <strong className="underline decoration-[#3E4F42] decoration-2">NO MORE THAN TWO WORDS</strong> from the passage for each answer.
                      </p>
                      <p className="text-[11px] text-[#7A7369]">
                        Write your answers in boxes {section.startNum}–{section.endNum} on your answer sheet.
                      </p>
                    </div>
                  )}

                  {section.type === 'multiple_choice' && (
                    <div className="space-y-1 text-xs">
                      <p className="font-serif italic text-xs text-[#57534E]">
                        Choose the correct letter, <strong className="text-[#3E4F42]">A</strong>, <strong className="text-[#3E4F42]">B</strong>, <strong className="text-[#3E4F42]">C</strong> or <strong className="text-[#3E4F42]">D</strong>.
                      </p>
                      <p className="text-[11px] text-[#7A7369]">
                        In boxes {section.startNum}–{section.endNum} on your answer sheet, choose the correct letter.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div 
                id={`question-card-${q.id}`}
                onClick={() => onSelectQuestion && onSelectQuestion(q.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition ${
                  activeQuestionId === q.id 
                    ? "ring-2 ring-[#3E4F42] border-[#3E4F42]" 
                    : "border-[#E6E2D8] bg-[#FAF8F5]/50 hover:bg-[#FAF8F5]"
                }`}
              >
                {/* Question Header */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                    isSubmitted
                      ? isCorrect
                        ? "bg-[#3E4F42] text-white"
                        : "bg-[#B45309] text-white"
                      : userVal
                      ? "bg-[#3E4F42] text-white"
                      : "bg-[#E6E2D8] text-[#24211E]"
                  }`}>
                    {qNum}
                  </span>

                  <span className="text-[10px] uppercase font-bold font-mono px-1.5 py-0.5 rounded bg-white text-[#7A7369] border border-[#E6E2D8]">
                    {q.type === 'tfng' ? 'True / False / Not Given' : q.type === 'multiple_choice' ? 'Multiple Choice' : 'Điền từ'}
                  </span>
                </div>

                {!isSubmitted && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFlag(q.id);
                    }}
                    className={`p-1 rounded-md transition cursor-pointer ${
                      isFlagged 
                        ? "text-[#A67C52] bg-[#FAF5EE]" 
                        : "text-[#7A7369] hover:text-[#24211E]"
                    }`}
                    title={isFlagged ? "Bỏ cờ đánh dấu" : "Đánh dấu xem lại sau"}
                  >
                    <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-[#A67C52]' : ''}`} />
                  </button>
                )}
              </div>

              {/* Prompt Question */}
              <div className="text-xs sm:text-sm font-serif text-[#24211E] font-medium leading-relaxed mb-3 select-text">
                {q.prompt}
              </div>

              {/* Input Area based on type */}
              
              {/* 1. True / False / Not Given */}
              {q.type === 'tfng' && (
                <div className="grid grid-cols-3 gap-2">
                  {["TRUE", "FALSE", "NOT GIVEN"].map((opt) => {
                    const isSelected = userVal.toUpperCase() === opt;
                    const isOptionCorrect = q.correctAnswer === opt;

                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => onAnswerChange(q.id, opt)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer flex items-center justify-center gap-1 ${
                          isSubmitted
                            ? isOptionCorrect
                              ? "bg-[#EDF3EE] text-[#3E4F42] border-2 border-[#3E4F42]"
                              : isSelected
                              ? "bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] line-through"
                              : "bg-white text-[#7A7369] border border-[#E6E2D8] opacity-60"
                            : isSelected
                            ? "bg-[#3E4F42] text-white shadow-2xs"
                            : "bg-white hover:bg-[#FAF8F5] text-[#24211E] border border-[#E6E2D8]"
                        }`}
                      >
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 2. Multiple Choice */}
              {q.type === 'multiple_choice' && (
                <div className="space-y-1.5">
                  {q.options?.map((opt) => {
                    const optLetter = opt.trim().charAt(0).toUpperCase();
                    const isSelected = userVal.toUpperCase() === optLetter;
                    const isOptionCorrect = q.correctAnswer === optLetter;

                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => onAnswerChange(q.id, optLetter)}
                        className={`w-full p-2.5 rounded-xl text-xs text-left transition cursor-pointer flex items-start gap-2.5 ${
                          isSubmitted
                            ? isOptionCorrect
                              ? "bg-[#EDF3EE] text-[#3E4F42] border-2 border-[#3E4F42] font-bold"
                              : isSelected
                              ? "bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]"
                              : "bg-white text-[#7A7369] border border-[#E6E2D8] opacity-60"
                            : isSelected
                            ? "bg-[#EDF3EE] text-[#3E4F42] border-2 border-[#3E4F42] font-semibold shadow-2xs"
                            : "bg-white hover:bg-[#FAF8F5] text-[#24211E] border border-[#E6E2D8]"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                          isSelected ? "bg-[#3E4F42] text-white" : "bg-[#FAF8F5] text-[#7A7369] border border-[#E6E2D8]"
                        }`}>
                          {optLetter}
                        </span>
                        <span className="leading-snug select-text pt-0.5">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 3. Sentence Completion */}
              {q.type === 'sentence_completion' && (
                <div className="relative">
                  <input
                    type="text"
                    disabled={isSubmitted}
                    value={userVal}
                    onChange={(e) => onAnswerChange(q.id, e.target.value)}
                    placeholder="Nhập từ chính xác từ bài đọc..."
                    className={`w-full p-2.5 rounded-xl text-xs sm:text-sm font-mono border transition ${
                      isSubmitted
                        ? isCorrect
                          ? "bg-[#EDF3EE] text-[#3E4F42] border-[#3E4F42] font-bold"
                          : "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]"
                        : "bg-white text-[#24211E] border-[#E6E2D8] focus:border-[#3E4F42] focus:outline-none"
                    }`}
                  />
                </div>
              )}

              {/* Solution & Explanation Box when Submitted */}
              {isSubmitted && (
                <div className="mt-3 p-3 rounded-xl bg-white border border-[#E6E2D8] space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[#E6E2D8]">
                    <span className="font-bold text-[#A67C52] flex items-center gap-1 text-[11px] uppercase tracking-wider">
                      <span>💡</span> Giải thích chi tiết:
                    </span>
                    <span className="font-mono text-[11px] text-[#3E4F42] font-bold">
                      Đáp án đúng: <strong>{q.correctAnswer}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-[#24211E] leading-relaxed">
                    {q.explanation}
                  </p>

                  {q.evidenceQuote && (
                    <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8] text-[11px] text-[#7A7369] space-y-0.5">
                      <span className="font-bold text-[#3E4F42] block">
                        Chứng cứ trong bài (Đoạn {q.paragraphRef || 'trong bài'}):
                      </span>
                      <p className="font-serif italic text-[#24211E] leading-relaxed select-text">
                        "{q.evidenceQuote}"
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </React.Fragment>
        );
      })}

      </div>

      {/* Bottom Submit Action Bar */}
      {!isSubmitted && (
        <div className="p-3 border-t border-[#E6E2D8] bg-[#FAF8F5] shrink-0 flex items-center justify-between gap-2">
          <div className="text-xs text-[#7A7369]">
            <span>Đã làm: <strong>{answeredCount}</strong> / {totalCount} câu</span>
          </div>

          <button
            type="button"
            onClick={onSubmitTest}
            disabled={answeredCount === 0}
            className="px-5 py-2 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-semibold text-xs shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Nộp bài &amp; Chấm điểm</span>
          </button>
        </div>
      )}

    </div>
  );
}
