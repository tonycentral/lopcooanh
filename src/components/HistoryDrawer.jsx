import React from 'react';
import { X, Trash2, Clock, CheckCircle2, AlertTriangle, Layers, BookMarked } from 'lucide-react';
import { getStoredHistory, clearHistory } from '../services/storage';

export default function HistoryDrawer({ isOpen, onClose, onRefreshStats }) {
  const [history, setHistory] = React.useState([]);

  React.useEffect(() => {
    if (isOpen) {
      setHistory(getStoredHistory());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClear = () => {
    if (window.confirm("Bạn có chắc chắn muốn xoá toàn bộ lịch sử luyện tập không?")) {
      clearHistory();
      setHistory([]);
      if (onRefreshStats) onRefreshStats();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#2B2826]/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF8F5] border-l border-[#E7E2D9] w-full max-w-md h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E7E2D9] bg-white flex items-center justify-between">
          <div>
            <h3 className="font-serif font-semibold text-[#2B2826] text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#4A5D4E]" />
              Lịch Sử Bài Viết
            </h3>
            <p className="text-xs text-[#7A7267]">
              {history.length} câu đã hoàn thành
            </p>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={handleClear}
                className="p-2 rounded-lg text-[#7A7267] hover:text-[#B95C48] hover:bg-[#F4EFEA] transition cursor-pointer"
                title="Xoá lịch sử"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#7A7267] hover:text-[#2B2826] hover:bg-[#F4EFEA] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="py-20 text-center text-[#7A7267] text-xs">
              Chưa có lịch sử bài viết nào. Hãy bắt đầu viết câu đầu tiên!
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-white border border-[#E7E2D9] space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#4A5D4E] flex items-center gap-1">
                    {item.type === "coherence" ? (
                      <><Layers className="w-3.5 h-3.5 text-[#B88758]" /> Coherence Practice</>
                    ) : (
                      <><BookMarked className="w-3.5 h-3.5 text-[#4A5D4E]" /> Từ vựng: {item.targetWord}</>
                    )}
                  </span>
                  
                  <span className={`font-medium px-2 py-0.5 rounded text-[11px] ${
                    item.isTargetMet 
                      ? "bg-[#4A5D4E]/10 text-[#4A5D4E] border border-[#4A5D4E]/20" 
                      : "bg-[#B88758]/10 text-[#B88758] border border-[#B88758]/20"
                  }`}>
                    Band {item.scores?.overallBand || "6.5"} (Mục tiêu: {item.targetBand})
                  </span>
                </div>

                <p className="text-xs text-[#2B2826] font-serif italic bg-[#FAF8F5] p-2 rounded-lg border border-[#E7E2D9] line-clamp-3">
                  "{item.sentence || item.sentenceB}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-[#7A7267] pt-1">
                  <span>Chủ đề: {item.topicName}</span>
                  <span>{new Date(item.timestamp).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
