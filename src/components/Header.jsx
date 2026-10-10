import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Target, 
  Home, 
  FileText, 
  BarChart3, 
  Layers, 
  PenTool, 
  BookOpen,
  ChevronDown, 
  User, 
  Cloud, 
  LogOut,
  Check,
  Settings,
  Sparkles,
  FileEdit
} from 'lucide-react';

export default function Header({ 
  targetBand, 
  current7DayScore,
  onOpenBandModal, 
  onGoWelcome,
  onOpenFlashcard,
  onGoVocabPractice,
  onGoFullEssay,
  onGoPractice,
  currentUser,
  onOpenAuth,
  onOpenSettings,
  onSignOut,
  studentEmail,
  activeTask,
  onToggleTask,
  currentView,
  activeWritingStep,
  onSelectWritingStep
}) {
  const [isFunctionDropdownOpen, setIsFunctionDropdownOpen] = useState(false);
  const [isTaskDropdownOpen, setIsTaskDropdownOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const functionDropdownRef = useRef(null);
  const taskDropdownRef = useRef(null);
  const accountMenuRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (functionDropdownRef.current && !functionDropdownRef.current.contains(e.target)) {
        setIsFunctionDropdownOpen(false);
      }
      if (taskDropdownRef.current && !taskDropdownRef.current.contains(e.target)) {
        setIsTaskDropdownOpen(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate progress towards target band
  const targetNum = parseFloat(targetBand) || 7.0;
  const currentNum = current7DayScore !== null ? current7DayScore : 0;
  const progressPercent = Math.min(100, Math.round((currentNum / targetNum) * 100));

  // Definition of unified progressive structure: 1. Học viết (1.1 -> 1.2 -> 1.3 -> 1.4) & 2. Flashcards
  const UNIFIED_SECTIONS = [
    {
      group: "1. HỌC VIẾT",
      items: [
        {
          id: '1.1',
          title: '1.1 Học từ vựng',
          subtitle: 'Nắm nghĩa & collocations theo 10 chủ đề',
          icon: BookOpen,
          action: () => {
            setIsFunctionDropdownOpen(false);
            if (onSelectWritingStep) onSelectWritingStep('1.1');
            else if (onGoVocabPractice) onGoVocabPractice();
            else if (onGoPractice) onGoPractice();
          }
        },
        {
          id: '1.2',
          title: '1.2 Học viết 1 câu',
          subtitle: 'Dịch & áp dụng từ vựng vào câu đơn',
          icon: FileEdit,
          action: () => {
            setIsFunctionDropdownOpen(false);
            if (onSelectWritingStep) onSelectWritingStep('1.2');
            else if (onGoVocabPractice) onGoVocabPractice();
            else if (onGoPractice) onGoPractice();
          }
        },
        {
          id: '1.3',
          title: '1.3 Học viết một đoạn',
          subtitle: 'Viết đoạn văn PEEL với liên từ mạch lạc',
          icon: Layers,
          action: () => {
            setIsFunctionDropdownOpen(false);
            if (onSelectWritingStep) onSelectWritingStep('1.3');
            else if (onGoVocabPractice) onGoVocabPractice();
            else if (onGoPractice) onGoPractice();
          }
        },
        {
          id: '1.4',
          title: '1.4 Học viết một bài',
          subtitle: 'Viết full bài luận Task 1 & Task 2 kèm bài mẫu',
          icon: PenTool,
          action: () => {
            setIsFunctionDropdownOpen(false);
            if (onSelectWritingStep) onSelectWritingStep('1.4');
            else if (onGoFullEssay) onGoFullEssay();
          }
        }
      ]
    },
    {
      group: "2. FLASHCARDS",
      items: [
        {
          id: '2.0',
          title: '2. Flashcards',
          subtitle: 'Phản xạ từ vựng học thuật qua thẻ ghi nhớ',
          icon: Sparkles,
          action: () => {
            setIsFunctionDropdownOpen(false);
            if (onOpenFlashcard) onOpenFlashcard();
          }
        }
      ]
    }
  ];

  // Determine current active step ID (1.1, 1.2, 1.3, 1.4, 2.0)
  const currentStepId = useMemo(() => {
    if (currentView === 'flashcard') return '2.0';
    if (currentView === 'full_essay') return '1.4';
    if (activeWritingStep) return activeWritingStep;
    return '1.1';
  }, [currentView, activeWritingStep]);

  const currentItem = useMemo(() => {
    for (const group of UNIFIED_SECTIONS) {
      const found = group.items.find(it => it.id === currentStepId);
      if (found) return found;
    }
    return UNIFIED_SECTIONS[0].items[0];
  }, [currentStepId]);

  return (
    <header className="sticky top-0 z-40 bg-[#F8F6F1]/95 backdrop-blur-md border-b border-[#E6E2D8] shadow-[0_1px_3px_rgba(0,0,0,0.03)] shrink-0">
      <div className="w-full px-3 sm:px-5 h-14 flex items-center justify-between gap-2.5">
        
        {/* Logo & Brand title only - No extra badges or subtitles */}
        <div 
          onClick={onGoWelcome}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          title="Trang chủ Lớp Cô Oanh"
        >
          <div className="w-8 h-8 rounded-xl bg-white border border-[#E6E2D8] p-0.5 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
            <img 
              src="./logo.png" 
              alt="Logo Lớp cô Oanh" 
              className="w-full h-full object-contain" 
            />
          </div>
          <span className="font-serif font-bold text-base sm:text-lg text-[#24211E] group-hover:text-[#3E4F42] transition leading-none">
            Lớp cô Oanh
          </span>
        </div>

        {/* Center: Dropdown 1 (Cơ cấu học thống nhất 1.1 - 1.4 & 2. Flashcards), Dropdown 2 (Chỉ hiện Task 1/2 khi ở 1.4) */}
        <div className="flex items-center gap-2">
          
          {/* Home button */}
          {(currentView === 'practice' || currentView === 'vocab_practice' || currentView === 'full_essay' || currentView === 'flashcard') && (
            <button
              onClick={onGoWelcome}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-xs font-medium text-[#7A7369] hover:text-[#24211E] transition cursor-pointer"
              title="Quay lại Trang Chào Mừng"
            >
              <Home className="w-3.5 h-3.5 text-[#3E4F42]" />
              <span>Trang chủ</span>
            </button>
          )}

          {/* ================= DROPDOWN 1: CƠ CẤU MỤC HỌC THỐNG NHẤT ================= */}
          <div className="relative" ref={functionDropdownRef}>
            <button
              onClick={() => {
                setIsFunctionDropdownOpen(prev => !prev);
                setIsTaskDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] hover:border-[#3E4F42]/30 text-xs font-semibold text-[#24211E] transition cursor-pointer shadow-2xs select-none"
              title="Chọn mục học tập (1.1 Từ vựng, 1.2 Viết câu, 1.3 Viết đoạn, 1.4 Viết một bài, 2. Flashcards)"
            >
              {currentItem && <currentItem.icon className="w-3.5 h-3.5 text-[#3E4F42]" />}
              <span>{currentItem ? currentItem.title : "1. Học viết"}</span>
              <ChevronDown className={`w-3 h-3 text-[#7A7369] transition-transform duration-200 ${isFunctionDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isFunctionDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-white border border-[#E6E2D8] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in-50 duration-150">
                {UNIFIED_SECTIONS.map((section, sIdx) => (
                  <div key={section.group} className={sIdx > 0 ? "pt-2 mt-1 border-t border-[#E6E2D8]" : ""}>
                    <div className="px-2.5 py-1 text-[10px] font-bold text-[#A67C52] uppercase tracking-wider">
                      {section.group}
                    </div>
                    <div className="space-y-0.5 mt-0.5">
                      {section.items.map((item) => {
                        const isActive = item.id === currentStepId;
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={item.action}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition cursor-pointer ${
                              isActive 
                                ? "bg-[#EDF3EE] text-[#3E4F42] font-bold" 
                                : "text-[#24211E] hover:bg-[#FAF8F5]"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                isActive ? "bg-[#3E4F42] text-white" : "bg-[#F4EFEA] text-[#7A7369]"
                              }`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="leading-tight truncate">{item.title}</div>
                                <div className="text-[10px] text-[#7A7369] leading-tight truncate mt-0.5">{item.subtitle}</div>
                              </div>
                            </div>
                            {isActive && <Check className="w-3.5 h-3.5 text-[#3E4F42] shrink-0 ml-1.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ================= DROPDOWN 2: CHỈ HIỂN THỊ KHI Ở 1.4 HỌC VIẾT MỘT BÀI ================= */}
          {currentView === 'full_essay' && onToggleTask && (
            <div className="relative" ref={taskDropdownRef}>
              <button
                onClick={() => {
                  setIsTaskDropdownOpen(prev => !prev);
                  setIsFunctionDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] hover:border-[#3E4F42]/30 text-xs font-semibold text-[#3E4F42] transition cursor-pointer shadow-2xs select-none"
                title="Chọn dạng đề thi (Task 1 hoặc Task 2)"
              >
                {activeTask === 'task1' ? <BarChart3 className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                <span>{activeTask === 'task1' ? "Task 1 (Biểu đồ)" : "Task 2 (Bài luận)"}</span>
                <ChevronDown className={`w-3 h-3 text-[#7A7369] transition-transform duration-200 ${isTaskDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isTaskDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-60 bg-white border border-[#E6E2D8] rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in-50 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-[#A67C52] uppercase tracking-wider">
                    Dạng bài luận IELTS
                  </div>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsTaskDropdownOpen(false);
                        onToggleTask('task1');
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition cursor-pointer ${
                        activeTask === 'task1' ? "bg-[#EDF3EE] text-[#3E4F42] font-bold" : "text-[#24211E] hover:bg-[#FAF8F5]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-3.5 h-3.5 text-[#3E4F42]" />
                        <div>
                          <div>Task 1 (Report)</div>
                          <div className="text-[10px] text-[#7A7369]">Biểu đồ, Bản đồ & Quy trình</div>
                        </div>
                      </div>
                      {activeTask === 'task1' && <Check className="w-3.5 h-3.5 text-[#3E4F42]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsTaskDropdownOpen(false);
                        onToggleTask('task2');
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition cursor-pointer ${
                        activeTask === 'task2' ? "bg-[#EDF3EE] text-[#3E4F42] font-bold" : "text-[#24211E] hover:bg-[#FAF8F5]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#3E4F42]" />
                        <div>
                          <div>Task 2 (Essay)</div>
                          <div className="text-[10px] text-[#7A7369]">Bài luận nghị luận học thuật</div>
                        </div>
                      </div>
                      {activeTask === 'task2' && <Check className="w-3.5 h-3.5 text-[#3E4F42]" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= MERGED PROGRESS WIDGET: MỤC TIÊU & HIỆN TRẠNG ================= */}
          <div 
            onClick={onOpenBandModal}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] hover:border-[#3E4F42]/30 transition cursor-pointer select-none text-xs shadow-2xs group"
            title={`Tiến độ Band: Hiện tại ${current7DayScore !== null ? current7DayScore.toFixed(1) : '--'} / Mục tiêu ${targetBand}. Nhấn để đổi Band mục tiêu.`}
          >
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#3E4F42] shrink-0 group-hover:scale-105 transition-transform" />
              <span className="text-[#7A7369] hidden sm:inline">Tiến độ:</span>
              <span className="font-semibold text-[#24211E]">
                {current7DayScore !== null ? current7DayScore.toFixed(1) : '--'}
                <span className="text-[#7A7369] font-normal mx-0.5">/</span>
                {targetBand}
              </span>
            </div>

            {/* Mini Progress Bar */}
            <div className="w-12 sm:w-16 h-1.5 bg-[#F4EFEA] rounded-full overflow-hidden border border-[#E6E2D8]">
              <div 
                className="h-full bg-[#3E4F42] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {current7DayScore !== null && (
              <span className="text-[10px] font-mono text-[#7A7369] hidden md:inline">
                {progressPercent}%
              </span>
            )}
          </div>

        </div>

        {/* Right Area: User Account Only */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen(prev => !prev)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] hover:border-[#3E4F42]/30 text-xs text-[#24211E] transition cursor-pointer shadow-2xs select-none"
                title="Tài khoản & Cài đặt"
              >
                <div className="w-5 h-5 rounded-lg bg-[#3E4F42] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  {(currentUser?.user_metadata?.full_name || studentEmail || "H").charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-[#24211E] max-w-[110px] sm:max-w-[150px] truncate">
                  {currentUser?.user_metadata?.full_name || currentUser?.email}
                </span>
                <ChevronDown className={`w-3 h-3 text-[#7A7369] transition-transform duration-200 ${isAccountMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Account Dropdown Menu */}
              {isAccountMenuOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-64 bg-white border border-[#E6E2D8] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in-50 duration-150">
                  {/* Account Header */}
                  <div className="px-3 py-2.5 bg-[#FAF8F5] rounded-xl border border-[#E6E2D8] mb-1.5">
                    <div className="font-bold text-xs text-[#24211E] truncate">
                      {currentUser?.user_metadata?.full_name || "Học viên"}
                    </div>
                    <div className="text-[11px] text-[#7A7369] truncate">
                      {currentUser?.email || studentEmail}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#3E4F42] mt-1.5">
                      <Cloud className="w-3 h-3" />
                      <span>Đã kết nối đám mây Supabase</span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        if (onOpenSettings) onOpenSettings();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs text-[#24211E] hover:bg-[#FAF8F5] hover:text-[#3E4F42] transition cursor-pointer font-medium"
                    >
                      <div className="w-6 h-6 rounded-lg bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center shrink-0">
                        <Settings className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#24211E]">Cài đặt tài khoản &amp; AI</div>
                        <div className="text-[10px] text-[#7A7369]">Hồ sơ, Gemini Key, Dữ liệu</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        if (onOpenBandModal) onOpenBandModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs text-[#24211E] hover:bg-[#FAF8F5] transition cursor-pointer font-medium"
                    >
                      <div className="w-6 h-6 rounded-lg bg-[#FAF5EE] text-[#A67C52] flex items-center justify-center shrink-0">
                        <Target className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div>Mục tiêu: <strong className="text-[#3E4F42]">Band {targetBand}</strong></div>
                        <div className="text-[10px] text-[#7A7369]">Chỉnh sửa mục tiêu điểm số</div>
                      </div>
                    </button>

                    <div className="h-px bg-[#E6E2D8] my-1" />

                    {onSignOut && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          onSignOut();
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs text-[#A67C52] hover:bg-[#FAF5EE] transition cursor-pointer font-semibold"
                      >
                        <div className="w-6 h-6 rounded-lg bg-[#FAF5EE] text-[#A67C52] flex items-center justify-center shrink-0">
                          <LogOut className="w-3.5 h-3.5" />
                        </div>
                        <span>Đăng xuất tài khoản</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-xs transition cursor-pointer shadow-xs shrink-0"
              title="Đăng nhập"
            >
              <User className="w-3.5 h-3.5" />
              <span>Đăng Nhập</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
