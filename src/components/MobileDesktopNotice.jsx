import React from 'react';
import { Laptop, BookOpen, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';

export default function MobileDesktopNotice({
  targetModule = "writing", // 'writing' | 'reading'
  onGoVocab,
  onGoFlashcard,
  onBypass
}) {
  const isWriting = targetModule === 'writing';

  return (
    <div className="min-h-[82vh] flex flex-col items-center justify-center p-4 text-center select-none animate-fadeIn pb-24">
      <div className="w-full max-w-sm bg-white border border-[#E6E2D8] rounded-3xl p-6 shadow-sm space-y-4">
        
        {/* Laptop Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-[#EDF3EE] border border-[#3E4F42]/20 text-[#3E4F42] flex items-center justify-center mx-auto shadow-2xs">
          <Laptop className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF5EE] text-[#A67C52] border border-[#E6E2D8] text-[11px] font-semibold">
            <span>Dành cho Máy tính &amp; Laptop</span>
          </div>
          <h2 className="text-lg font-bold font-title text-[#24211E] pt-1">
            {isWriting ? "Luyện Viết IELTS Tối Ưu Trên Máy Tính" : "Thi Đọc IELTS Tối Ưu Trên Máy Tính"}
          </h2>
          <p className="text-xs text-[#7A7369] leading-relaxed pt-1">
            {isWriting 
              ? "Giao diện làm bài viết (soạn thảo bài luận Task 1 & Task 2 250 từ, tra cứu biểu đồ và chấm điểm ngữ pháp) không phù hợp với màn hình điện thoại nhỏ."
              : "Bài đọc học thuật IELTS dài 1.000 từ kèm bảng câu hỏi trắc nghiệm chia 2 cột song song được thiết kế chuyên biệt cho màn hình máy tính."}
          </p>
        </div>

        {/* Highlight Mobile Feature Card */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] text-left space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#3E4F42]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tính năng trọng tâm trên Điện thoại:</span>
          </div>
          <p className="text-[11px] text-[#7A7369] leading-relaxed">
            Trên điện thoại, bạn hãy tập trung học <strong>Từ vựng C1-C2</strong> (nghe phát âm, tra collocations) và <strong>Luyện Flashcards phản xạ</strong> để đạt hiệu quả cao nhất!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onGoVocab}
            className="w-full py-3 px-4 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <BookOpen className="w-4 h-4" />
            <span>📚 Chuyển sang Luyện Từ Vựng</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onGoFlashcard}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#24211E] border border-[#D1DDD3] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4 text-[#3E4F42]" />
            <span>🗂️ Mở Thẻ Flashcards Phản Xạ</span>
          </button>
        </div>

        {/* Optional Bypass link */}
        {onBypass && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onBypass}
              className="text-[11px] text-[#A67C52] hover:text-[#24211E] underline transition cursor-pointer"
            >
              Tôi vẫn muốn tiếp tục xem trên điện thoại &rarr;
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
