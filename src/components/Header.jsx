import React, { useState, useRef, useEffect } from 'react';
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
  Check
} from 'lucide-react';

export default function Header({ 
  targetBand, 
  current7DayScore,
  onOpenBandModal, 
  onGoWelcome,
  onOpenFlashcard,
  onGoPractice,
  currentUser,
  onOpenAuth,
  onSignOut,
  studentEmail,
  activeTask,
  onToggleTask,
  currentView
}) {
  const [isFunctionDropdownOpen, setIsFunctionDropdownOpen] = useState(false);
  const [isTaskDropdownOpen, setIsTaskDropdownOpen] = useState(false);

  const functionDropdownRef = useRef(null);
  const taskDropdownRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (functionDropdownRef.current && !functionDropdownRef.current.contains(e.target)) {
        setIsFunctionDropdownOpen(false);
      }
      if (taskDropdownRef.current && !taskDropdownRef.current.contains(e.target)) {
        setIsTaskDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate progress towards target band
  const targetNum = parseFloat(targetBand) || 7.0;
  const currentNum = current7DayScore !== null ? current7DayScore : 0;
  const progressPercent = Math.min(100, Math.round((currentNum / targetNum) * 100));

  // Definition of learning features (easily extensible for future features)
  const LEARNING_FEATURES = [
    {
      id: 'practice',
      title: 'Luyện Viết',
      subtitle: 'Writing Practice (Câu & Full Essay)',
      icon: PenTool,
      action: () => {
        setIsFunctionDropdownOpen(false);
        if (onGoPractice) onGoPractice();
      }
    },
    {
      id: 'flashcard',
      title: 'Flashcard',
      subtitle: 'Phản xạ từ vựng học thuật',
      icon: Layers,
      action: () => {
        setIsFunctionDropdownOpen(false);
        if (onOpenFlashcard) onOpenFlashcard();
      }
    }
  ];

  // Definition of 3 distinct practice sections
  const PRACTICE_SECTIONS = [
    {
      id: 'task1',
      title: 'Task 1',
      subtitle: 'Biểu đồ, Bản đồ & Quy trình',
      icon: BarChart3
    },
    {
      id: 'task2',
      title: 'Task 2',
      subtitle: 'Bài luận Essay học thuật',
      icon: FileText
    },
    {
      id: 'vocab',
      title: 'Từ vựng (Vocabulary)',
      subtitle: 'Kho từ vựng & Collocations theo chủ đề',
      icon: BookOpen
    }
  ];

  const currentFeature = currentView === 'flashcard' 
    ? LEARNING_FEATURES.find(f => f.id === 'flashcard')
    : LEARNING_FEATURES.find(f => f.id === 'practice');

  const currentSection = PRACTICE_SECTIONS.find(s => s.id === activeTask) || PRACTICE_SECTIONS[1];

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

        {/* Center: Dropdown 1 (Chức năng), Dropdown 2 (3 Phần Luyện Tập), Unified Progress Widget */}
        <div className="flex items-center gap-2">
          
          {/* Home button */}
          {(currentView === 'practice' || currentView === 'flashcard') && (
            <button
              onClick={onGoWelcome}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-xs font-medium text-[#7A7369] hover:text-[#24211E] transition cursor-pointer"
              title="Quay lại Trang Chào Mừng"
            >
              <Home className="w-3.5 h-3.5 text-[#3E4F42]" />
              <span>Trang chủ</span>
            </button>
          )}

          {/* ================= DROPDOWN 1: CHỨC NĂNG HỌC (Luyện viết / Flashcard / ...) ================= */}
          <div className="relative" ref={functionDropdownRef}>
            <button
              onClick={() => {
                setIsFunctionDropdownOpen(prev => !prev);
                setIsTaskDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] hover:border-[#3E4F42]/30 text-xs font-medium text-[#24211E] transition cursor-pointer shadow-2xs select-none"
              title="Chọn chức năng học tập"
            >
              {currentFeature && <currentFeature.icon className="w-3.5 h-3.5 text-[#3E4F42]" />}
              <span>{currentFeature ? currentFeature.title : "Chức năng"}</span>
              <ChevronDown className={`w-3 h-3 text-[#7A7369] transition-transform duration-200 ${isFunctionDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isFunctionDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-60 bg-white border border-[#E6E2D8] rounded-2xl shadow-lg p-1.5 z-50 animate-in fade-in-50 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-semibold text-[#7A7369] uppercase tracking-wider">
                  Chức năng học tập
                </div>
                <div className="space-y-0.5">
                  {LEARNING_FEATURES.map((feature) => {
                    const isActive = currentView === feature.id;
                    const Icon = feature.icon;
                    return (
                      <button
                        key={feature.id}
                        onClick={feature.action}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition cursor-pointer ${
                          isActive 
                            ? "bg-[#EDF3EE] text-[#3E4F42] font-semibold" 
                            : "text-[#24211E] hover:bg-[#FAF8F5]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                            isActive ? "bg-[#3E4F42] text-white" : "bg-[#F4EFEA] text-[#7A7369]"
                          }`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="leading-tight font-medium">{feature.title}</div>
                            <div className="text-[10px] text-[#7A7369] leading-tight mt-0.5">{feature.subtitle}</div>
                          </div>
                        </div>
                        {isActive && <Check className="w-3.5 h-3.5 text-[#3E4F42] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ================= DROPDOWN 2: PHÂN MỤC LUYỆN TẬP (Task 1 / Task 2 / Từ vựng) ================= */}
          {onToggleTask && (
            <div className="relative" ref={taskDropdownRef}>
              <button
                onClick={() => {
                  setIsTaskDropdownOpen(prev => !prev);
                  setIsFunctionDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] hover:border-[#3E4F42]/30 text-xs font-medium text-[#24211E] transition cursor-pointer shadow-2xs select-none"
                title="Chọn phần luyện tập (Task 1 / Task 2 / Từ vựng)"
              >
                {currentSection && <currentSection.icon className="w-3.5 h-3.5 text-[#3E4F42]" />}
                <span>{currentSection ? currentSection.title : "Luyện tập"}</span>
                <ChevronDown className={`w-3 h-3 text-[#7A7369] transition-transform duration-200 ${isTaskDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isTaskDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-64 bg-white border border-[#E6E2D8] rounded-2xl shadow-lg p-1.5 z-50 animate-in fade-in-50 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-semibold text-[#7A7369] uppercase tracking-wider">
                    Phần luyện tập
                  </div>
                  <div className="space-y-0.5">
                    {PRACTICE_SECTIONS.map((section) => {
                      const isActive = activeTask === section.id;
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => {
                            setIsTaskDropdownOpen(false);
                            onToggleTask(section.id);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition cursor-pointer ${
                            isActive 
                              ? "bg-[#EDF3EE] text-[#3E4F42] font-semibold" 
                              : "text-[#24211E] hover:bg-[#FAF8F5]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                              isActive ? "bg-[#3E4F42] text-white" : "bg-[#F4EFEA] text-[#7A7369]"
                            }`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="leading-tight font-medium">{section.title}</div>
                              <div className="text-[10px] text-[#7A7369] leading-tight mt-0.5">{section.subtitle}</div>
                            </div>
                          </div>
                          {isActive && <Check className="w-3.5 h-3.5 text-[#3E4F42] shrink-0" />}
                        </button>
                      );
                    })}
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
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#24211E] transition cursor-pointer shadow-2xs"
                title="Tài khoản học viên"
              >
                <Cloud className="w-3.5 h-3.5 text-[#3E4F42] shrink-0" />
                <span className="font-medium text-[#24211E] max-w-[120px] sm:max-w-[160px] truncate">
                  {currentUser?.user_metadata?.full_name || currentUser?.email}
                </span>
              </button>

              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="p-1.5 sm:p-2 rounded-xl text-[#7A7369] hover:text-[#A67C52] hover:bg-[#FAF8F5] transition cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
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
