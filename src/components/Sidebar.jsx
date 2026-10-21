import React from 'react';
import { 
  Home, 
  BookOpen, 
  BookOpenCheck, 
  FileEdit, 
  Layers, 
  PenTool, 
  Timer, 
  Sparkles, 
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
  User, 
  X,
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
  onSelectWritingStep,
  onOpenFlashcard,
  onOpenSourcesModal,
  onOpenHistoryDrawer,
  onOpenCohesiveGuide,
  onOpenBandModal,
  onOpenSettings,
  onOpenAuth,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer
}) {
  // Navigation Sections Definition
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
            if (onCloseMobileDrawer) onCloseMobileDrawer();
            if (onGoWelcome) onGoWelcome();
          }
        }
      ]
    },
    {
      group: '1. HỌC VIẾT',
      items: [
        {
          id: '1.1',
          title: '1.1 Học từ vựng',
          subtitle: '10 chủ đề, phát âm & collocations',
          icon: BookOpen,
          isActive: (currentView === 'vocab_practice' || currentView === 'practice') && practiceActivePart === 1,
          action: () => {
            if (onCloseMobileDrawer) onCloseMobileDrawer();
            if (onSelectWritingStep) onSelectWritingStep('1.1');
          }
        },
        {
          id: '1.2',
          title: '1.2 Học viết 1 câu',
          subtitle: 'Dịch & áp dụng từ vào câu đơn',
          icon: FileEdit,
          isActive: (currentView === 'vocab_practice' || currentView === 'practice') && practiceActivePart === 2,
          action: () => {
            if (onCloseMobileDrawer) onCloseMobileDrawer();
            if (onSelectWritingStep) onSelectWritingStep('1.2');
          }
        },
        {
          id: '1.3',
          title: '1.3 Học viết một đoạn',
          subtitle: 'Đoạn văn PEEL & liên từ mạch lạc',
          icon: Layers,
          isActive: (currentView === 'vocab_practice' || currentView === 'practice') && practiceActivePart === 3,
          action: () => {
            if (onCloseMobileDrawer) onCloseMobileDrawer();
            if (onSelectWritingStep) onSelectWritingStep('1.3');
          }
        },
        {
          id: '1.4',
          title: '1.4 Học viết một bài',
          subtitle: 'Task 1 & Task 2 kèm bài mẫu',
          icon: PenTool,
          isActive: currentView === 'full_essay',
          action: () => {
            if (onCloseMobileDrawer) onCloseMobileDrawer();
            if (onSelectWritingStep) onSelectWritingStep('1.4');
          },
          isFullEssay: true
        }
      ]
    },
    {
      group: '2. LUYỆN ĐỌC',
      items: [
        {
          id: '2.1',
          title: '2.1 Luyện đọc & Tra từ',
          subtitle: 'Đọc & tra từ bấm trên bài',
          icon: BookOpenCheck,
          isActive: currentView === 'reading' && readingMode === 'practice',
          action: () => {
            if (onCloseMobileDrawer) onCloseMobileDrawer();
            if (onSelectWritingStep) onSelectWritingStep('2.1');
          }
        },
        {
          id: '2.2',
          title: '2.2 Thi thử Reading',
          subtitle: '50 đề thi bấm giờ & tính điểm',
          icon: Timer,
          isActive: currentView === 'reading' && readingMode === 'test',
          action: () => {
            if (onCloseMobileDrawer) onCloseMobileDrawer();
            if (onSelectWritingStep) onSelectWritingStep('2.2');
          }
        }
      ]
    },
    {
      group: '3. FLASHCARDS',
      items: [
        {
          id: '3.0',
          title: '3. Flashcards phản xạ',
          subtitle: 'Luyện nhớ từ qua thẻ & minigame',
          icon: Sparkles,
          isActive: currentView === 'flashcard',
          action: () => {
            if (onCloseMobileDrawer) onCloseMobileDrawer();
            if (onOpenFlashcard) onOpenFlashcard();
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
            if (onCloseMobileDrawer) onCloseMobileDrawer();
            if (onOpenSourcesModal) onOpenSourcesModal();
          }
        },
        {
          id: 'history',
          title: 'Lịch sử làm bài',
          subtitle: 'Xem lại điểm số & câu đã chấm',
          icon: History,
          action: () => {
            if (onCloseMobileDrawer) onCloseMobileDrawer();
            if (onOpenHistoryDrawer) onOpenHistoryDrawer();
          }
        },
        {
          id: 'cohesive',
          title: 'Hướng dẫn liên kết câu',
          subtitle: 'Kho liên từ & cấu trúc 7.0-8.5',
          icon: FileSpreadsheet,
          action: () => {
            if (onCloseMobileDrawer) onCloseMobileDrawer();
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

    if (isCollapsed && !isMobileDrawerOpen) {
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

        {/* Sub-selector for Task 1 / Task 2 when 1.4 is active */}
        {item.isFullEssay && isActive && onToggleTask && (
          <div className="ml-9 mr-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#E6E2D8] flex gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleTask('task1');
              }}
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
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
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
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
    );
  };

  const sidebarContent = (
    <aside className={`h-full flex flex-col bg-[#F8F6F1] border-r border-[#E6E2D8] select-none transition-all duration-200 ease-in-out ${
      isMobileDrawerOpen 
        ? "w-72" 
        : isCollapsed 
        ? "w-18" 
        : "w-64"
    }`}>
      
      {/* Top Brand & Header */}
      <div className={`h-14 border-b border-[#E6E2D8] flex items-center px-3 shrink-0 ${
        isCollapsed && !isMobileDrawerOpen ? "justify-center" : "justify-between"
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
          {(!isCollapsed || isMobileDrawerOpen) && (
            <div className="min-w-0">
              <span className="font-title font-bold text-sm sm:text-base text-[#24211E] group-hover:text-[#3E4F42] transition leading-none truncate block">
                Lớp cô Oanh
              </span>
              <span className="text-[10px] text-[#7A7369] font-medium leading-tight truncate block mt-0.5">
                IELTS Writing &amp; Reading
              </span>
            </div>
          )}
        </div>

        {/* Toggle Collapse Button (Desktop) or Close Button (Mobile Drawer) */}
        {isMobileDrawerOpen ? (
          <button
            type="button"
            onClick={onCloseMobileDrawer}
            className="p-1.5 rounded-xl text-[#7A7369] hover:text-[#24211E] hover:bg-white transition cursor-pointer"
            title="Đóng thanh menu"
          >
            <X className="w-5 h-5" />
          </button>
        ) : onToggleCollapse && !isCollapsed ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl text-[#7A7369] hover:text-[#24211E] hover:bg-white transition cursor-pointer border border-transparent hover:border-[#E6E2D8]"
            title="Thu gọn menu bên trái"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* If collapsed on desktop: show expand button right below header */}
      {isCollapsed && !isMobileDrawerOpen && onToggleCollapse && (
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
            {section.group && (!isCollapsed || isMobileDrawerOpen) && (
              <div className="px-3 py-1 text-[10px] font-bold text-[#A67C52] uppercase tracking-wider">
                {section.group}
              </div>
            )}
            {section.group && isCollapsed && !isMobileDrawerOpen && (
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
        {(!isCollapsed || isMobileDrawerOpen) ? (
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
        {(!isCollapsed || isMobileDrawerOpen) ? (
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

  // If rendered as a mobile slide-out drawer
  if (isMobileDrawerOpen) {
    return (
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop overlay */}
        <div 
          onClick={onCloseMobileDrawer}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        />
        {/* Drawer slide-in */}
        <div className="relative z-50 h-full animate-in slide-in-from-left duration-200 shadow-2xl">
          {sidebarContent}
        </div>
      </div>
    );
  }

  // Normal desktop sidebar
  return sidebarContent;
}
