import React from 'react';
import { X, BarChart3 } from 'lucide-react';
import Task1Visualizer from './Task1Visualizer';

export default function Task1ChartModal({ isOpen, onClose, topic }) {
  if (!isOpen || !topic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2B2826]/45 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-3xl max-h-[90vh] bg-[#FAF8F5] border border-[#E7E2D9] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#E7E2D9] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#4A5D4E]/10 text-[#4A5D4E] border border-[#4A5D4E]/20 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-semibold text-[#2B2826]">
                Biểu Đồ Số Liệu Chi Tiết - Task 1
              </h2>
              <p className="text-xs text-[#7A7267]">
                {topic.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A7267] hover:text-[#2B2826] hover:bg-[#F4EFEA] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto">
          {/* Prompt reminder */}
          <div className="mb-4 p-3.5 rounded-xl bg-white border border-[#E7E2D9] text-xs sm:text-sm text-[#2B2826] font-sans leading-relaxed shadow-xs">
            <span className="font-bold text-[#4A5D4E] mr-2">ĐỀ BÀI:</span>
            "{topic.ieltsPrompt}"
          </div>

          <div className="h-[460px]">
            <Task1Visualizer topic={topic} onExpandChart={null} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#E7E2D9] bg-white flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#F4EFEA] hover:bg-[#EAE4DB] text-[#2B2826] border border-[#E7E2D9] text-xs font-medium transition cursor-pointer"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
}
