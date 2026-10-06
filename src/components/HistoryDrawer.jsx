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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Lịch Sử Bài Viết
            </h3>
            <p className="text-xs text-slate-400">
              {history.length} câu đã hoàn thành
            </p>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={handleClear}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                title="Xoá lịch sử"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-xs">
              Chưa có lịch sử bài viết nào. Hãy bắt đầu viết câu đầu tiên!
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-400 flex items-center gap-1">
                    {item.type === "coherence" ? (
                      <><Layers className="w-3.5 h-3.5 text-pink-400" /> Coherence Practice</>
                    ) : (
                      <><BookMarked className="w-3.5 h-3.5 text-indigo-400" /> Từ vựng: {item.targetWord}</>
                    )}
                  </span>
                  
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    item.isTargetMet 
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}>
                    Band {item.scores?.overallBand || "6.5"} (Mục tiêu: {item.targetBand})
                  </span>
                </div>

                <p className="text-xs text-slate-200 font-mono italic bg-slate-900/60 p-2 rounded-lg border border-slate-800 line-clamp-3">
                  "{item.sentence || item.sentenceB}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
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
