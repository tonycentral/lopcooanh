// src/components/reading/ReadingWorkspace.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Shuffle, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  Layers, 
  Check, 
  CheckCircle2, 
  X, 
  Send, 
  FileText, 
  GraduationCap, 
  Cpu, 
  Leaf, 
  Car, 
  HeartPulse, 
  Briefcase, 
  TrendingUp, 
  Users, 
  Scale, 
  Landmark,
  ArrowRight
} from 'lucide-react';

import { 
  READING_TOPICS, 
  getPassagesByTopic, 
  getPassageById, 
  calculateReadingBand 
} from '../../data/readingData';
import ReadingPassageViewer from './ReadingPassageViewer';
import ReadingQuestionsViewer from './ReadingQuestionsViewer';
import ReadingVocabDrawer from './ReadingVocabDrawer';
import ReadingResultModal from './ReadingResultModal';
import { saveHistoryEntry } from '../../services/storage';

// Icon mapping for 10 topic categories
const TOPIC_ICON_MAP = {
  education: GraduationCap,
  technology: Cpu,
  environment: Leaf,
  transport: Car,
  health: HeartPulse,
  work_career: Briefcase,
  business: TrendingUp,
  society_family: Users,
  crime_law: Scale,
  culture_arts: Landmark
};

export default function ReadingWorkspace({
  studentEmail,
  targetBand = "7.0",
  onReadingGraded,
  onGoWelcome,
  onOpenFlashcard
}) {
  // Selected Topic (out of 10 Master Topics)
  const [selectedTopicId, setSelectedTopicId] = useState("environment");
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
  const [isTestDropdownOpen, setIsTestDropdownOpen] = useState(false);

  // Selected Test Number (1 to 50)
  const [selectedTestNum, setSelectedTestNum] = useState(1);

  // Mode: 'practice' (Luyện tập: Vừa đọc vừa click tra từ vựng) | 'test' (Thi thử: Chỉ đọc đề & làm bài bấm giờ)
  const [readingMode, setReadingMode] = useState("practice");

  // Font size for passage
  const [fontSize, setFontSize] = useState("base");

  // Answers & UI state
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  // Interactive Vocab peek state
  const [activeVocab, setActiveVocab] = useState(null);
  const [isVocabDrawerOpen, setIsVocabDrawerOpen] = useState(false);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(20 * 60); // 20 minutes countdown for Test mode
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Submission & Results
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  // Fetch all 50 passages for currently selected topic
  const topicPassages = useMemo(() => {
    return getPassagesByTopic(selectedTopicId);
  }, [selectedTopicId]);

  // Current passage
  const currentPassage = useMemo(() => {
    const found = topicPassages.find(p => p.testNumber === selectedTestNum);
    return found || topicPassages[0] || null;
  }, [topicPassages, selectedTestNum]);

  // Reset state when changing passage
  useEffect(() => {
    setUserAnswers({});
    setFlaggedQuestions(new Set());
    setActiveQuestionId(null);
    setIsSubmitted(false);
    setTestResult(null);
    setIsResultModalOpen(false);
    setActiveVocab(null);
    setIsVocabDrawerOpen(false);
    setTimerSeconds(20 * 60);
    setElapsedSeconds(0);
    setIsTimerRunning(true);
  }, [selectedTopicId, selectedTestNum]);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning || isSubmitted) return;
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
      if (readingMode === 'test') {
        setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, isSubmitted, readingMode]);

  // Format time display
  const formatTimeDisplay = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle answering question
  const handleAnswerChange = (qId, answerValue) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: answerValue
    }));
  };

  // Toggle flag on question
  const handleToggleFlag = (qId) => {
    setFlaggedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  // Reset answers
  const handleResetAnswers = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ câu trả lời để làm lại đề này?")) {
      setUserAnswers({});
      setFlaggedQuestions(new Set());
      setIsSubmitted(false);
      setTestResult(null);
    }
  };

  // When user clicks a vocab word in the passage
  const handleSelectVocab = (vocab) => {
    setActiveVocab(vocab);
    setIsVocabDrawerOpen(true);
  };

  // Submit and grade test
  const handleSubmitTest = () => {
    if (!currentPassage?.questions) return;

    let correctCount = 0;
    const totalCount = currentPassage.questions.length;

    currentPassage.questions.forEach(q => {
      const userAns = (userAnswers[q.id] || "").trim();
      if (q.type === 'sentence_completion') {
        const cleanUser = userAns.toLowerCase();
        const acceptable = (q.acceptableAnswers || [q.correctAnswer]).map(a => a.toLowerCase().trim());
        if (acceptable.includes(cleanUser)) correctCount++;
      } else {
        if (userAns.toUpperCase() === (q.correctAnswer || '').trim().toUpperCase()) {
          correctCount++;
        }
      }
    });

    const bandResult = calculateReadingBand(correctCount, totalCount);
    setTestResult(bandResult);
    setIsSubmitted(true);
    setIsTimerRunning(false);
    setIsResultModalOpen(true);

    // Save to test history
    saveHistoryEntry({
      studentEmail,
      type: "ielts_reading",
      topicName: currentPassage.topicName,
      targetWord: currentPassage.title,
      scores: {
        overallBand: bandResult.band,
        lexicalResource: bandResult.band,
        grammarRange: bandResult.band
      },
      targetBand,
      isTargetMet: parseFloat(bandResult.band) >= parseFloat(targetBand)
    });

    if (onReadingGraded) onReadingGraded();
  };

  // Navigate to random test
  const handleRandomTest = () => {
    const randNum = Math.floor(Math.random() * 50) + 1;
    setSelectedTestNum(randNum);
  };

  // Navigate to next test
  const handleNextTest = () => {
    setSelectedTestNum(prev => (prev < 50 ? prev + 1 : 1));
    setIsResultModalOpen(false);
  };

  // Current active topic meta
  const currentTopic = useMemo(() => {
    return READING_TOPICS.find(t => t.id === selectedTopicId) || READING_TOPICS[0];
  }, [selectedTopicId]);

  const TopicIcon = TOPIC_ICON_MAP[currentTopic.id] || Leaf;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F6F1] overflow-hidden text-[#24211E]">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & WORKSPACE TOOLBAR */}
      {/* ========================================================================= */}
      <div className="bg-white border-b border-[#E6E2D8] px-3 sm:px-5 py-2.5 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs">
        
        {/* Left: Topic & Test Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Dropdown Chọn 1 Trong 10 Chủ Đề */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsTopicDropdownOpen(prev => !prev);
                setIsTestDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFEA] border border-[#E6E2D8] text-xs font-semibold text-[#24211E] transition cursor-pointer shadow-2xs"
            >
              <TopicIcon className="w-4 h-4 text-[#3E4F42]" />
              <span>{currentTopic.vietnameseName}</span>
              <span className="text-[10px] text-[#7A7369] font-mono">({topicPassages.length} đề)</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#7A7369] transition-transform ${isTopicDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isTopicDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-72 bg-white border border-[#E6E2D8] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in-50 duration-150 max-h-96 overflow-y-auto">
                <div className="px-2 py-1 text-[10px] font-bold text-[#A67C52] uppercase tracking-wider">
                  10 Chủ Đề IELTS Reading (50 Đề / Chủ Đề)
                </div>
                <div className="space-y-0.5 mt-1">
                  {READING_TOPICS.map((topic) => {
                    const isSelected = topic.id === selectedTopicId;
                    const Icon = TOPIC_ICON_MAP[topic.id] || Leaf;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => {
                          setSelectedTopicId(topic.id);
                          setSelectedTestNum(1);
                          setIsTopicDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition cursor-pointer ${
                          isSelected 
                            ? "bg-[#EDF3EE] text-[#3E4F42] font-bold" 
                            : "text-[#24211E] hover:bg-[#FAF8F5]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-[#3E4F42]" />
                          <div>
                            <div>{topic.vietnameseName}</div>
                            <div className="text-[10px] text-[#7A7369]">{topic.name}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-[#7A7369] bg-white px-1.5 py-0.2 rounded border border-[#E6E2D8]">
                          50 đề
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Dropdown Chọn Đề (1 đến 50) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsTestDropdownOpen(prev => !prev);
                setIsTopicDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#D1DDD3] text-xs font-bold text-[#3E4F42] transition cursor-pointer shadow-2xs font-mono"
            >
              <span>Đề #{selectedTestNum} / 50</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#7A7369] transition-transform ${isTestDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isTestDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-80 bg-white border border-[#E6E2D8] rounded-2xl shadow-xl p-3 z-50 animate-in fade-in-50 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#E6E2D8]">
                  <span className="text-[11px] font-bold text-[#A67C52] uppercase tracking-wider">
                    Chọn nhanh Đề luyện (1 - 50)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      handleRandomTest();
                      setIsTestDropdownOpen(false);
                    }}
                    className="text-[10px] text-[#3E4F42] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Ngẫu nhiên</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-1.5 mt-2 max-h-60 overflow-y-auto p-1">
                  {Array.from({ length: 50 }, (_, i) => i + 1).map((n) => {
                    const isSelected = n === selectedTestNum;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          setSelectedTestNum(n);
                          setIsTestDropdownOpen(false);
                        }}
                        className={`py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                          isSelected 
                            ? "bg-[#3E4F42] text-white shadow-2xs" 
                            : "bg-[#FAF8F5] hover:bg-[#EDF3EE] text-[#24211E] border border-[#E6E2D8]"
                        }`}
                      >
                        #{n}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Nút Đổi Đề Ngẫu Nhiên */}
          <button
            type="button"
            onClick={handleRandomTest}
            className="p-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-[#7A7369] hover:text-[#24211E] transition cursor-pointer shadow-2xs"
            title="Chọn một đề đọc ngẫu nhiên"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: 2 Chế Độ Làm Bài (Luyện Tập Tương Tác vs Thi Thử Bấm Giờ) & Timer */}
        <div className="flex items-center gap-2.5">
          
          {/* Toggle Chuyển 2 Chế Độ */}
          <div className="flex items-center p-0.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs font-semibold">
            <button
              type="button"
              onClick={() => setReadingMode("practice")}
              className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                readingMode === "practice"
                  ? "bg-[#3E4F42] text-white shadow-xs font-bold"
                  : "text-[#7A7369] hover:text-[#24211E]"
              }`}
              title="Vừa đọc vừa click tra cứu từ vựng học thuật"
            >
              <Sparkles className="w-3 h-3" />
              <span>Luyện tập (Tra từ)</span>
            </button>

            <button
              type="button"
              onClick={() => setReadingMode("test")}
              className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                readingMode === "test"
                  ? "bg-[#A67C52] text-white shadow-xs font-bold"
                  : "text-[#7A7369] hover:text-[#24211E]"
              }`}
              title="Đọc đề và làm bài thi bấm giờ chuẩn phòng thi"
            >
              <Clock className="w-3 h-3" />
              <span>Thi thử (Bấm giờ)</span>
            </button>
          </div>

          {/* Đồng Hồ Bấm Giờ */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] font-mono text-xs font-bold text-[#24211E]">
            <Clock className={`w-3.5 h-3.5 ${readingMode === 'test' ? 'text-[#A67C52]' : 'text-[#3E4F42]'}`} />
            <span>
              {readingMode === 'test' ? formatTimeDisplay(timerSeconds) : formatTimeDisplay(elapsedSeconds)}
            </span>
            {!isSubmitted && (
              <button
                type="button"
                onClick={() => setIsTimerRunning(prev => !prev)}
                className="ml-1 text-[#7A7369] hover:text-[#24211E] cursor-pointer"
                title={isTimerRunning ? "Tạm dừng đồng hồ" : "Tiếp tục đồng hồ"}
              >
                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            )}
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN SPLIT-PANE WORKSPACE: BÀI ĐỌC (TRÁI) & CÂU HỎI (PHẢI) */}
      {/* ========================================================================= */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 sm:p-4 overflow-hidden relative">
        
        {/* CỘT TRÁI: BÀI ĐỌC (PASSAGE VIEWER) */}
        <div className={`h-full overflow-hidden transition-all duration-200 ${
          isVocabDrawerOpen ? "lg:col-span-5" : "lg:col-span-6"
        }`}>
          <ReadingPassageViewer
            passage={currentPassage}
            mode={readingMode}
            selectedVocab={activeVocab}
            onSelectVocab={handleSelectVocab}
            isSubmitted={isSubmitted}
            questions={currentPassage?.questions || []}
            fontSize={fontSize}
            onChangeFontSize={setFontSize}
          />
        </div>

        {/* CỘT PHẢI: CÂU HỎI (QUESTIONS VIEWER) */}
        <div className={`h-full overflow-hidden transition-all duration-200 ${
          isVocabDrawerOpen ? "lg:col-span-4" : "lg:col-span-6"
        }`}>
          <ReadingQuestionsViewer
            questions={currentPassage?.questions || []}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            isSubmitted={isSubmitted}
            flaggedQuestions={flaggedQuestions}
            onToggleFlag={handleToggleFlag}
            onResetAnswers={handleResetAnswers}
            onSubmitTest={handleSubmitTest}
            activeQuestionId={activeQuestionId}
            onSelectQuestion={setActiveQuestionId}
          />
        </div>

        {/* TAB / DRAWER TRA TỪ VỰNG TƯƠNG TÁC (KHI CLICK TỪ TRÊN BÀI ĐỌC) */}
        {isVocabDrawerOpen && activeVocab && (
          <div className="lg:col-span-3 h-full overflow-hidden animate-fadeIn">
            <ReadingVocabDrawer
              vocab={activeVocab}
              isOpen={isVocabDrawerOpen}
              onClose={() => setIsVocabDrawerOpen(false)}
              studentEmail={studentEmail}
              topicName={currentPassage?.topicName}
              onSearchWord={(word) => {
                // Search in current passage vocabularies
                const found = currentPassage?.vocabularies?.find(v => v.word.toLowerCase() === word.toLowerCase());
                if (found) {
                  setActiveVocab(found);
                } else {
                  setActiveVocab({
                    word: word,
                    ipa: "",
                    pos: "từ tra cứu",
                    meaning: `Tra cứu nghĩa cho từ: "${word}"`,
                    definition: `Contextual lookup for "${word}"`,
                    contextSentence: `Word found in reading passage.`
                  });
                }
              }}
            />
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM QUESTION PALETTE & TEST PROGRESS */}
      {/* ========================================================================= */}
      <div className="bg-white border-t border-[#E6E2D8] px-3 sm:px-5 py-2 shrink-0 flex items-center justify-between gap-2 overflow-x-auto">
        
        {/* Quick Question Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-[11px] font-semibold text-[#7A7369] mr-1 shrink-0">
            Câu hỏi:
          </span>
          {currentPassage?.questions?.map((q, idx) => {
            const qNum = idx + 1;
            const hasAnswer = Boolean((userAnswers[q.id] || '').trim());
            const isFlagged = flaggedQuestions.has(q.id);
            const isActive = activeQuestionId === q.id;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setActiveQuestionId(q.id);
                  const el = document.getElementById(`question-card-${q.id}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition cursor-pointer shrink-0 flex items-center justify-center relative ${
                  isActive
                    ? "ring-2 ring-[#3E4F42] bg-[#3E4F42] text-white shadow-xs"
                    : isSubmitted
                    ? "bg-[#FAF8F5] text-[#24211E] border border-[#E6E2D8]"
                    : hasAnswer
                    ? "bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3]"
                    : "bg-[#FAF8F5] text-[#7A7369] border border-[#E6E2D8] hover:bg-[#F4EFEA]"
                }`}
                title={`Câu ${qNum}${hasAnswer ? ' (Đã làm)' : ' (Chưa làm)'}${isFlagged ? ' • Có cờ' : ''}`}
              >
                <span>{qNum}</span>
                {isFlagged && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52] absolute top-0.5 right-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmitTest}
              className="px-4 py-1.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-semibold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Nộp bài</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsResultModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] font-semibold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <span>Xem Band: {testResult?.band}</span>
              </button>

              <button
                type="button"
                onClick={handleNextTest}
                className="px-3.5 py-1.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-semibold text-xs shadow-xs transition cursor-pointer flex items-center gap-1"
              >
                <span>Đề tiếp theo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL KẾT QUẢ & CHẤM ĐIỂM BAND */}
      {/* ========================================================================= */}
      <ReadingResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        result={testResult}
        passage={currentPassage}
        targetBand={targetBand}
        timeSpentSeconds={elapsedSeconds}
        onRetakeTest={() => {
          setIsResultModalOpen(false);
          setUserAnswers({});
          setFlaggedQuestions(new Set());
          setIsSubmitted(false);
          setTestResult(null);
          setTimerSeconds(20 * 60);
          setElapsedSeconds(0);
          setIsTimerRunning(true);
        }}
        onNextTest={handleNextTest}
      />

    </div>
  );
}
