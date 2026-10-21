import React from 'react';
import { 
  Home, 
  BookOpen, 
  CheckCircle2, 
  Volume2, 
  Sparkles, 
  Headphones, 
  Mic, 
  BookOpenCheck, 
  PenTool, 
  Brain, 
  Shield, 
  Database, 
  History, 
  FileSpreadsheet, 
  Settings, 
  Target, 
  PanelLeftClose, 
  PanelLeft, 
  BarChart3, 
  FileText, 
  Check, 
  ChevronRight
} from 'lucide-react';

export default function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
  currentView = 'welcome',
  practiceActivePart = 1,
  readingMode = 'practice',
  activeTask = 'task2',
  onToggleTask,
  targetBand = '7.0',
  currentUser,
  studentEmail,
  onGoWelcome,
  onGoView,
  onSelectWritingStep,
  onSelectReadingMode,
  onOpenFlashcard,
  onOpenSourcesModal,
  onOpenHistoryDrawer,
  onOpenCohesiveGuide,
  onOpenBandModal,
  onOpenSettings,
  onOpenAuth
}) {
  // Navigation Sections Definition (Web Desktop IELTS Master Platform)
  const NAV_SECTIONS = [
    {
      group: null,
      items: [
        {
          id: 'welcome',
          title: 'Trang chủ',
          subtitle: 'Màn hình chính & Lộ trình',
          icon: Home,
          isActive: currentView === 'welcome',
          action: () => {
            if (onGoWelcome) onGoWelcome();
          }
        }
      ]
    },
    {
      group: 'I. NỀN TẢNG NGÔN NGỮ',
      items: [
        {
          id: 'vocab',
          title: '1. Luyện từ vựng',
          subtitle: '10 chủ đề học thuật Cambridge & AWL',
          icon: BookOpen,
          isActive: (currentView === 'vocab_practice' || currentView === 'practice') && practiceActivePart === 1,
          action: () => {
            if (onSelectWritingStep) onSelectWritingStep('1.1');
            else if (onGoView) onGoView('vocab_practice');
          }
        },
        {
          id: 'grammar',
          title: '2. Luyện ngữ pháp (Band 7+)',
          subtitle: 'Đảo ngữ, câu chẻ, danh từ hoá',
          icon: CheckCircle2,
          isActive: currentView === 'grammar',
          action: () => {
            if (onGoView) onGoView('grammar');
          }
        },
        {
          id: 'pronunciation',
          title: '3. Luyện phát âm & IPA',
          subtitle: '44 âm IPA, trọng âm & Shadowing',
          icon: Volume2,
          isActive: currentView === 'pronunciation',
          action: () => {
            if (onGoView) onGoView('pronunciation');
          }
        },
        {
          id: 'flashcard',
          title: '4. Flashcards phản xạ',
          subtitle: 'Luyện nhớ từ qua thẻ & minigame',
          icon: Sparkles,
          isActive: currentView === 'flashcard',
          action: () => {
            if (onOpenFlashcard) onOpenFlashcard();
          }
        }
      ]
    },
    {
      group: 'II. 4 KỸ NĂNG IELTS',
      items: [
        {
          id: 'listening',
          title: '5. Luyện Nghe (Listening)',
          subtitle: 'Section 1-4 Cambridge, audio & script',
          icon: Headphones,
          isActive: currentView === 'listening',
          action: () => {
            if (onGoView) onGoView('listening');
          }
        },
        {
          id: 'speaking',
          title: '6. Luyện Nói (Speaking)',
          subtitle: 'Phòng thi Part 1-2-3 & mẫu Band 8.5',
          icon: Mic,
          isActive: currentView === 'speaking',
          action: () => {
            if (onGoView) onGoView('speaking');
          }
        },
        {
          id: 'reading',
          title: '7. Luyện Đọc (Reading)',
          subtitle: '50 đề thi thử, tra từ & bấm giờ',
          icon: BookOpenCheck,
          isActive: currentView === 'reading',
          isReadingGroup: true,
          action: () => {
            if (onSelectReadingMode) onSelectReadingMode(readingMode || 'practice');
            else if (onGoView) onGoView('reading');
          }
        },
        {
          id: 'writing',
          title: '8. Luyện Viết (Writing)',
          subtitle: 'Viết câu, đoạn PEEL, Task 1 & 2',
          icon: PenTool,
          isActive: currentView === 'full_essay' || ((currentView === 'vocab_practice' || currentView === 'practice') && (practiceActivePart === 2 || practiceActivePart === 3)),
          isWritingGroup: true,
          action: () => {
            if (onSelectWritingStep) onSelectWritingStep('1.4');
            else if (onGoView) onGoView('full_essay');
          }
        }
      ]
    },
    {
      group: 'III. TƯ DUY & CHIẾN THUẬT',
      items: [
        {
          id: 'thinking',
          title: '9. Tư duy phản biện & Ý tưởng',
          subtitle: 'Đa góc nhìn kinh tế, xã hội, đạo đức',
          icon: Brain,
          isActive: currentView === 'thinking',
          action: () => {
            if (onGoView) onGoView('thinking');
          }
        },
        {
          id: 'tactics',
          title: '10. Chiến thuật phòng thi',
          subtitle: 'Bẫy T/F/NG, phân bổ giờ & bí quyết',
          icon: Shield,
          isActive: currentView === 'tactics',
          action: () => {
            if (onGoView) onGoView('tactics');
          }
        }
      ]
    },
    {
      group: 'TIỆN ÍCH & NGUỒN HỌC',
      items: [
        {
          id: 'sources',
          title: 'Kho đề & Nguồn bổ sung',
          subtitle: 'Cambridge, Simon & AWL',
          icon: Database,
          action: () => {
            if (onOpenSourcesModal) onOpenSourcesModal();
          }
        },
        {
          id: 'history',
          title: 'Lịch sử làm bài',
          subtitle: 'Xem lại điểm số & câu đã chấm',
          icon: History,
          action: () => {
            if (onOpenHistoryDrawer) onOpenHistoryDrawer();
          }
        },
        {
          id: 'cohesive',
          title: 'Hướng dẫn liên kết câu',
          subtitle: 'Kho liên từ & cấu trúc 7.0-8.5',
          icon: FileSpreadsheet,
          action: () => {
            if (onOpenCohesiveGuide) onOpenCohesiveGuide();
          }
        }
      ]
    }
  ];

  // Helper render item
  const renderItem = (item) => {
    const Icon = item.icon;
    const isActive = item.isActive;

    if (isCollapsed) {
      return (
        <div key={item.id} className="relative group flex justify-center py-1">
          <button
            type="button"
            onClick={item.action}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition cursor-pointer relative ${
              isActive 
                ? "bg-[#3E4F42] text-white shadow-xs font-bold" 
                : "text-[#7A7369] hover:bg-white hover:text-[#24211E] border border-transparent hover:border-[#E6E2D8]"
            }`}
            title={`${item.title}${item.subtitle ? ` - ${item.subtitle}` : ''}`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {isActive && (
              <span className="absolute -left-2 top-2.5 bottom-2.5 w-1 bg-[#3E4F42] rounded-r-full" />
            )}
          </button>

          {/* Tooltip on hover for collapsed mode */}
          <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#24211E] text-white text-xs rounded-xl shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
            <div className="font-semibold">{item.title}</div>
            {item.subtitle && (
              <div className="text-[10px] text-gray-300 font-normal">{item.subtitle}</div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div key={item.id} className="space-y-1">
        <button
          type="button"
          onClick={item.action}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition cursor-pointer group relative ${
            isActive
              ? "bg-[#EDF3EE] text-[#3E4F42] font-bold shadow-2xs"
              : "text-[#24211E] hover:bg-white hover:shadow-2xs"
          }`}
        >
          {isActive && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#3E4F42] rounded-r-md" />
          )}

          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition ${
              isActive 
                ? "bg-[#3E4F42] text-white" 
                : "bg-white text-[#7A7369] group-hover:text-[#3E4F42] border border-[#E6E2D8]"
            }`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="truncate leading-tight">{item.title}</div>
              {item.subtitle && (
                <div className="text-[10px] text-[#7A7369] group-hover:text-[#24211E] leading-tight truncate mt-0.5 font-normal">
                  {item.subtitle}
                </div>
              )}
            </div>
          </div>

          {isActive && (
            <Check className="w-3.5 h-3.5 text-[#3E4F42] shrink-0 ml-1.5" />
          )}
        </button>

        {/* Sub-selector for Reading when Reading is active */}
        {item.isReadingGroup && isActive && !isCollapsed && (
          <div className="ml-9 mr-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#E6E2D8] flex gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectReadingMode) onSelectReadingMode('practice');
              }}
              className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-bold text-center transition cursor-pointer ${
                readingMode === 'practice'
                  ? "bg-[#3E4F42] text-white shadow-2xs"
                  : "text-[#7A7369] hover:text-[#24211E] hover:bg-white"
              }`}
            >
              Đọc tra từ
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectReadingMode) onSelectReadingMode('test');
              }}
              className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-bold text-center transition cursor-pointer ${
                readingMode === 'test'
                  ? "bg-[#3E4F42] text-white shadow-2xs"
                  : "text-[#7A7369] hover:text-[#24211E] hover:bg-white"
              }`}
            >
              Thi thử 50 đề
            </button>
          </div>
        )}

        {/* Sub-selector for Writing when Writing is active */}
        {item.isWritingGroup && isActive && !isCollapsed && (
          <div className="ml-9 mr-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#E6E2D8] flex flex-col gap-1">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectWritingStep) onSelectWritingStep('1.2');
                }}
                className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-bold text-center transition cursor-pointer ${
                  currentView === 'vocab_practice' && practiceActivePart === 2
                    ? "bg-[#3E4F42] text-white shadow-2xs"
                    : "text-[#7A7369] hover:text-[#24211E] hover:bg-white"
                }`}
                title="Luyện viết 1 câu đơn với từ vựng"
              >
                Viết câu
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectWritingStep) onSelectWritingStep('1.3');
                }}
                className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-bold text-center transition cursor-pointer ${
                  currentView === 'vocab_practice' && practiceActivePart === 3
                    ? "bg-[#3E4F42] text-white shadow-2xs"
                    : "text-[#7A7369] hover:text-[#24211E] hover:bg-white"
                }`}
                title="Luyện viết 1 đoạn văn chuẩn PEEL"
              >
                Viết đoạn
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectWritingStep) onSelectWritingStep('1.4');
                }}
                className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-bold text-center transition cursor-pointer ${
                  currentView === 'full_essay'
                    ? "bg-[#3E4F42] text-white shadow-2xs"
                    : "text-[#7A7369] hover:text-[#24211E] hover:bg-white"
                }`}
                title="Luyện viết toàn bộ bài Task 1 & Task 2"
              >
                Toàn bài
              </button>
            </div>

            {/* Task 1 / Task 2 toggle when inside Full Essay */}
            {currentView === 'full_essay' && onToggleTask && (
              <div className="flex gap-1 pt-1 border-t border-[#E6E2D8]/80">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTask('task1');
                  }}
                  className={`flex-1 flex items-center justify-center gap-1 py-0.5 rounded-md text-[9px] font-bold transition cursor-pointer ${
                    activeTask === 'task1'
                      ? "bg-[#3E4F42] text-white shadow-2xs"
                      : "text-[#7A7369] hover:text-[#24211E] hover:bg-white"
                  }`}
                >
                  <BarChart3 className="w-3 h-3" />
                  <span>Task 1</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTask('task2');
                  }}
                  className={`flex-1 flex items-center justify-center gap-1 py-0.5 rounded-md text-[9px] font-bold transition cursor-pointer ${
                    activeTask === 'task2'
                      ? "bg-[#3E4F42] text-white shadow-2xs"
                      : "text-[#7A7369] hover:text-[#24211E] hover:bg-white"
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span>Task 2</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`h-full flex flex-col bg-[#F8F6F1] border-r border-[#E6E2D8] select-none transition-all duration-200 ease-in-out shrink-0 ${
      isCollapsed ? "w-18" : "w-64"
    }`}>
      
      {/* Top Brand & Header */}
      <div className={`h-14 border-b border-[#E6E2D8] flex items-center px-3 shrink-0 ${
        isCollapsed ? "justify-center" : "justify-between"
      }`}>
        {/* Brand Logo & Title */}
        <div 
          onClick={onGoWelcome}
          className="flex items-center gap-2.5 cursor-pointer group min-w-0"
          title="Trang chủ Lớp Cô Oanh"
        >
          <div className="w-8 h-8 rounded-xl bg-white border border-[#E6E2D8] p-0.5 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
            <img 
              src="./logo.png" 
              alt="Logo Lớp cô Oanh" 
              className="w-full h-full object-contain" 
            />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="font-title font-bold text-sm sm:text-base text-[#24211E] group-hover:text-[#3E4F42] transition leading-none truncate block">
                Lớp cô Oanh
              </span>
              <span className="text-[10px] text-[#7A7369] font-medium leading-tight truncate block mt-0.5">
                Hệ thống luyện thi IELTS toàn diện
              </span>
            </div>
          )}
        </div>

        {/* Toggle Collapse Button (Desktop) */}
        {onToggleCollapse && !isCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl text-[#7A7369] hover:text-[#24211E] hover:bg-white transition cursor-pointer border border-transparent hover:border-[#E6E2D8]"
            title="Thu gọn menu bên trái"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* If collapsed on desktop: show expand button right below header */}
      {isCollapsed && onToggleCollapse && (
        <div className="py-2 flex justify-center border-b border-[#E6E2D8] shrink-0">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-2 rounded-xl text-[#7A7369] hover:text-[#24211E] hover:bg-white border border-[#E6E2D8] transition cursor-pointer shadow-2xs"
            title="Mở rộng menu bên trái"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Menu Items (Scrollable) */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 py-3 space-y-3.5 scrollbar-thin">
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={section.group || `sec_${sIdx}`} className="space-y-1">
            {section.group && !isCollapsed && (
              <div className="px-3 py-1 text-[10px] font-bold text-[#A67C52] uppercase tracking-wider">
                {section.group}
              </div>
            )}
            {section.group && isCollapsed && (
              <div className="h-px bg-[#E6E2D8] my-2 mx-2" />
            )}
            <div className="space-y-1">
              {section.items.map(renderItem)}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer Section: Target Band & Settings / Account */}
      <div className="p-2 border-t border-[#E6E2D8] bg-[#FAF8F5] shrink-0 space-y-1">
        {/* Target Band Mini Card */}
        {!isCollapsed ? (
          <button
            type="button"
            onClick={onOpenBandModal}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] hover:border-[#3E4F42]/30 text-xs transition cursor-pointer shadow-2xs group"
            title="Nhấn để đổi mục tiêu điểm Band"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#FAF5EE] text-[#A67C52] flex items-center justify-center shrink-0">
                <Target className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-[#7A7369] leading-tight">Mục tiêu</div>
                <div className="font-bold text-[#3E4F42] leading-tight">Band {targetBand}</div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#7A7369] group-hover:translate-x-0.5 transition-transform" />
          </button>
        ) : (
          <div className="flex justify-center py-1">
            <button
              type="button"
              onClick={onOpenBandModal}
              className="w-10 h-10 rounded-xl bg-white border border-[#E6E2D8] text-[#A67C52] flex items-center justify-center hover:bg-[#FAF5EE] transition cursor-pointer shadow-2xs"
              title={`Mục tiêu Band ${targetBand}. Nhấn để thay đổi.`}
            >
              <Target className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* User Account / Settings */}
        {!isCollapsed ? (
          <button
            type="button"
            onClick={currentUser ? onOpenSettings : onOpenAuth}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white text-xs transition cursor-pointer border border-transparent hover:border-[#E6E2D8]"
            title={currentUser ? "Cài đặt tài khoản & AI" : "Đăng nhập tài khoản"}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-[#3E4F42] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                {(currentUser?.user_metadata?.full_name || studentEmail || "H").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 text-left">
                <div className="font-semibold text-[#24211E] truncate leading-tight">
                  {currentUser?.user_metadata?.full_name || currentUser?.email || "Học viên"}
                </div>
                <div className="text-[10px] text-[#7A7369] truncate leading-tight mt-0.5">
                  {currentUser ? "Cài đặt & Đồng bộ Cloud" : "Chưa đăng nhập"}
                </div>
              </div>
            </div>
            <Settings className="w-3.5 h-3.5 text-[#7A7369]" />
          </button>
        ) : (
          <div className="flex justify-center py-1">
            <button
              type="button"
              onClick={currentUser ? onOpenSettings : onOpenAuth}
              className="w-10 h-10 rounded-xl bg-white border border-[#E6E2D8] text-[#3E4F42] flex items-center justify-center hover:bg-[#EDF3EE] transition cursor-pointer shadow-2xs"
              title={currentUser ? `Tài khoản: ${currentUser?.email}. Nhấn để mở cài đặt.` : "Đăng nhập"}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

    </aside>
  );
}
