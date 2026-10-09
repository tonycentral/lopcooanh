import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  BarChart3, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Move, 
  Eye, 
  EyeOff,
  Compass
} from 'lucide-react';
import Task1Visualizer from './Task1Visualizer';

export default function Task1ChartModal({ isOpen, onClose, topic }) {
  if (!isOpen || !topic) return null;

  const isImageBased = Boolean(topic.imageUrl || topic.chartType === 'image' || topic.chartType === 'map');
  const title = topic.chartData?.title || topic.title || topic.name || "Bản đồ / Sơ đồ chi tiết Task 1";
  const keyNotes = topic.chartData?.keyNotes || topic.keyNotes || [];

  // Interactive Zoom & Pan State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const containerRef = useRef(null);

  // Reset zoom & pan when topic changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setIsDragging(false);
    }
  }, [isOpen, topic?.id]);

  // Keyboard shortcut listener (Esc, +, -, 0, f)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, onClose]);

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 3.5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(Number((prev - 0.25).toFixed(2)), 0.75);
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse Wheel Zoom
  const handleWheel = (e) => {
    if (!isImageBased) return;
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((prev) => Math.min(Number((prev + 0.15).toFixed(2)), 3.5));
    } else {
      setZoom((prev) => {
        const next = Math.max(Number((prev - 0.15).toFixed(2)), 0.75);
        if (next <= 1) setPan({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Mouse Drag & Pan handlers
  const handleMouseDown = (e) => {
    if (!isImageBased) return;
    if (e.button !== 0) return; // Left mouse button only
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Double Click Zoom
  const handleDoubleClick = () => {
    if (!isImageBased) return;
    if (zoom > 1.2) {
      handleResetZoom();
    } else {
      setZoom(1.8);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${
      isFullscreen ? "p-0" : "p-2 sm:p-4"
    } bg-[#24211E]/65 backdrop-blur-xs animate-fadeIn`}>
      
      <div 
        className={`w-full ${
          isFullscreen 
            ? "h-full rounded-none" 
            : "max-w-7xl h-[94vh] max-h-[96vh] rounded-3xl"
        } bg-[#FAF8F5] border border-[#E6E2D8] shadow-2xl flex flex-col overflow-hidden transition-all duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= MODAL HEADER ================= */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-[#E6E2D8] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#FAF5EE] text-[#A67C52] border border-[#E6E2D8] flex items-center justify-center shrink-0">
              {isImageBased ? <Compass className="w-5 h-5" /> : <BarChart3 className="w-5 h-5 text-[#3E4F42]" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3]">
                  {topic.tag || 'IELTS Writing Task 1'}
                </span>
                <span className="text-xs font-semibold text-[#A67C52]">
                  {topic.categoryVietnameseName || 'Chủ đề'}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-serif font-bold text-[#24211E] truncate mt-0.5">
                {title}
              </h2>
            </div>
          </div>

          {/* Action Buttons: Toggle Sidebar, Fullscreen, Close */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Toggle Analysis Sidebar */}
            <button
              type="button"
              onClick={() => setShowSidebar(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                showSidebar 
                  ? "bg-[#FAF5EE] text-[#A67C52] border-[#D1DDD3]" 
                  : "bg-white text-[#7A7369] hover:text-[#24211E] border-[#E6E2D8]"
              }`}
              title={showSidebar ? "Thu gọn bảng phân tích để xem ảnh rộng hơn" : "Mở bảng phân tích đề bài"}
            >
              {showSidebar ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{showSidebar ? "Ẩn phân tích" : "Hiện phân tích"}</span>
            </button>

            {/* Toggle Fullscreen */}
            <button
              type="button"
              onClick={() => setIsFullscreen(prev => !prev)}
              className="p-2 rounded-xl text-[#7A7369] hover:text-[#24211E] hover:bg-[#F4EFEA] border border-[#E6E2D8] transition cursor-pointer"
              title={isFullscreen ? "Thu nhỏ lại cửa sổ (Esc)" : "Toàn màn hình"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#7A7369] hover:text-[#24211E] hover:bg-[#F4EFEA] transition cursor-pointer ml-1"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= MODAL BODY: STAGE + SIDEBAR ================= */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* MAIN STAGE: HIGH-RESOLUTION INTERACTIVE MAP & CHART CANVAS */}
          <div 
            ref={containerRef}
            className="flex-1 h-full min-h-0 relative overflow-hidden bg-[#F5F2EB] flex flex-col select-none"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDoubleClick}
            style={{
              cursor: isImageBased ? (zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in') : 'default'
            }}
          >
            {isImageBased ? (
              <>
                {/* Floating Map Zoom & Pan Control Bar */}
                <div 
                  className="absolute top-4 inset-x-0 mx-auto w-fit z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E6E2D8] shadow-md text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.75}
                    className="p-1.5 rounded-lg hover:bg-[#FAF8F5] text-[#7A7369] hover:text-[#24211E] disabled:opacity-40 transition cursor-pointer"
                    title="Thu nhỏ (-)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#EDF3EE] text-[#3E4F42] font-mono font-bold text-xs border border-[#E6E2D8] transition cursor-pointer"
                    title="Nhấn để đưa về kích thước chuẩn 100%"
                  >
                    {Math.round(zoom * 100)}%
                  </button>

                  <button
                    type="button"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3.5}
                    className="p-1.5 rounded-lg hover:bg-[#FAF8F5] text-[#7A7369] hover:text-[#24211E] disabled:opacity-40 transition cursor-pointer"
                    title="Phóng to (+)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  <div className="h-4 w-px bg-[#E6E2D8] mx-0.5" />

                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#FAF8F5] text-[#7A7369] hover:text-[#24211E] transition cursor-pointer"
                    title="Vừa khung màn hình"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium hidden sm:inline">Vừa khung</span>
                  </button>

                  <div className="hidden md:flex items-center gap-1 text-[11px] text-[#A67C52] bg-[#FAF5EE] px-2 py-0.5 rounded-md ml-1 border border-[#E6E2D8]">
                    <Move className="w-3 h-3" />
                    <span>Lăn chuột hoặc kéo để di chuyển</span>
                  </div>
                </div>

                {/* The Map / Chart Viewport */}
                <div className="w-full h-full flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={topic.imageUrl}
                    alt={title}
                    draggable={false}
                    className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-md transition-transform duration-75"
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                      transformOrigin: 'center center'
                    }}
                  />
                </div>
              </>
            ) : (
              // Dynamic SVG/CSS Chart Container (Full height & spacious)
              <div className="w-full h-full p-4 sm:p-6 overflow-y-auto scrollbar-thin">
                <div className="h-full min-h-[500px]">
                  <Task1Visualizer topic={topic} onExpandChart={null} />
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT SIDEBAR: PROMPT & KEY ANALYSIS ================= */}
          {showSidebar && (
            <div className="w-full lg:w-96 shrink-0 h-auto lg:h-full bg-white border-t lg:border-t-0 lg:border-l border-[#E6E2D8] p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto scrollbar-thin shadow-xs">
              
              {/* Prompt Reminder */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#3E4F42]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>ĐỀ BÀI TASK 1:</span>
                </div>
                <p className="text-xs sm:text-[13px] text-[#24211E] font-serif leading-relaxed select-text">
                  "{topic.ieltsPrompt}"
                </p>
              </div>

              {/* Key Features / Notes for Maps & Processes */}
              {keyNotes.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#FAF5EE] border border-[#E6E2D8] space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#A67C52]">
                    <Sparkles className="w-4 h-4 text-[#A67C52]" />
                    <span>Đặc điểm chính cần đưa vào bài viết:</span>
                  </div>
                  <ul className="space-y-2 text-xs text-[#24211E]">
                    {keyNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#A67C52] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Analysis & Observation Guide */}
              <div className="p-3.5 rounded-2xl bg-[#EDF3EE]/60 border border-[#D1DDD3] space-y-1.5 text-xs text-[#3E4F42]">
                <span className="font-bold">💡 Mẹo quan sát bản đồ / quy trình:</span>
                <p className="text-[11px] text-[#7A7369] leading-relaxed">
                  • Phóng to (Zoom) để xem rõ các địa danh, tên đường, khu dân cư hoặc các công đoạn kỹ thuật.<br />
                  • Chú ý so sánh giữa 2 mốc thời gian: Những công trình nào được <strong>xây mới</strong>, công trình nào được <strong>mở rộng/hiện đại hóa</strong>, và những yếu tố nào được <strong>giữ nguyên</strong>.
                </p>
              </div>

              {/* Quick Close / Done Button */}
              <div className="mt-auto pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#E6E2D8] text-[#24211E] border border-[#E6E2D8] text-xs font-semibold transition cursor-pointer text-center"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
