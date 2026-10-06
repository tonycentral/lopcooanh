import React from 'react';
import { X, BarChart3 } from 'lucide-react';
import Task1Visualizer from './Task1Visualizer';

export default function Task1ChartModal({ isOpen, onClose, topic }) {
  if (!isOpen || !topic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                Biểu Đồ Số Liệu Chi Tiết - Task 1
              </h2>
              <p className="text-xs text-slate-400">
                {topic.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto">
          {/* Prompt reminder */}
          <div className="mb-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
            <span className="font-bold text-indigo-400 mr-2">ĐỀ BÀI:</span>
            "{topic.ieltsPrompt}"
          </div>

          <div className="h-[460px]">
            <Task1Visualizer topic={topic} onExpandChart={null} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition cursor-pointer"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
}
