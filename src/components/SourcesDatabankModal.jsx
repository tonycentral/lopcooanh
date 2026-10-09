import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Sparkles, 
  ExternalLink, 
  PlusCircle, 
  CheckCircle2, 
  Database,
  Library
} from 'lucide-react';

export const OFFICIAL_SOURCES = [
  {
    id: "cambridge-official",
    title: "Cambridge IELTS Practice Tests (Cam 10 - 19)",
    author: "Cambridge Assessment English / Cambridge University Press",
    badge: "Chuẩn Đề Thi Thật 100%",
    description: "Bộ đề thi chính thức được phát hành bởi đơn vị đồng tổ chức kỳ thi IELTS quốc tế. Toàn bộ các đề Task 1 và Task 2 được cập nhật từ các đề thi thực tế trên toàn cầu.",
    coverage: "Đề thi thật 2015 - 2024+, cập nhật liên tục các chủ đề mới nhất của Cam 18 và Cam 19.",
    url: "https://www.cambridgeenglish.org/exams-and-tests/ielts/"
  },
  {
    id: "simon-liz",
    title: "IELTS Simon & IELTS Liz Examiner Archives",
    author: "Simon Corcoran (Ex-IELTS Examiner) & Elizabeth Ferguson",
    badge: "Tiêu Chuẩn Giám Khảo",
    description: "Kho đề thi và phương pháp phân tích bài viết học thuật từ hai cựu giám khảo chấm thi danh tiếng, cung cấp các cấu trúc lập luận chuẩn Band 8.0 - 9.0.",
    coverage: "Phân loại câu hỏi Discussion, Opinion, Two-part và phương pháp viết Overview Task 1 xúc tích.",
    url: "https://ielts-simon.com"
  },
  {
    id: "pauline-cullen",
    title: "Cambridge Vocabulary for IELTS Advanced",
    author: "Pauline Cullen (Tác giả Official Cambridge Guide to IELTS)",
    badge: "Từ Vựng Học Thuật C1-C2",
    description: "Nguồn từ vựng học thuật đỉnh cao theo chủ đề (Thematic Lexical Sets) kèm ngữ cảnh sử dụng, cụm collocations tự nhiên và phiên âm chuẩn IPA.",
    coverage: "Tập trung các cụm từ đắt giá giúp tối ưu hóa tiêu chí Lexical Resource vượt ngưỡng Band 7.5.",
    url: "https://www.cambridge.org"
  },
  {
    id: "oxford-awl",
    title: "Oxford Academic Word List (AWL) & Collocations",
    author: "Averil Coxhead & Oxford University Press",
    badge: "Học Thuật Quốc Tế",
    description: "Danh mục 570 nhóm từ vựng học thuật cốt lõi thường xuyên xuất hiện nhất trong các bài luận nghiên cứu và bài thi viết chuyên sâu.",
    coverage: "Bảo đảm tính trang trọng (formality), loại bỏ hoàn toàn các cấu trúc khẩu ngữ, tăng độ chính xác diễn đạt.",
    url: "https://www.oxfordlearnersdictionaries.com"
  }
];

export default function SourcesDatabankModal({ 
  isOpen, 
  onClose, 
  onAddCustomTopic,
  totalTopicsCount = 0,
  totalVocabCount = 0
}) {
  const [activeTab, setActiveTab] = useState('sources'); // 'sources' | 'add_custom'
  
  // Custom Topic Form State
  const [customTask, setCustomTask] = useState('task2');
  const [customTitle, setCustomTitle] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customVocabWords, setCustomVocabWords] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleCreateTopic = (e) => {
    e.preventDefault();
    if (!customTitle.trim() || !customPrompt.trim()) return;

    // Parse words from comma or line separated string
    const wordsList = customVocabWords
      .split(/[\n,]+/)
      .map(w => w.trim())
      .filter(Boolean);

    const newTopic = {
      id: `custom-${Date.now()}`,
      name: customTitle.trim(),
      vietnameseName: customTitle.trim(),
      tag: "Chủ đề tự thêm",
      ieltsPrompt: customPrompt.trim(),
      vocabularies: wordsList.map((w, idx) => ({
        id: `custom-v-${Date.now()}-${idx}`,
        word: w,
        ipa: "",
        partOfSpeech: "academic",
        meaning: `Từ vựng học thuật bổ sung cho chủ đề ${customTitle.trim()}`,
        synonyms: [],
        collocations: []
      }))
    };

    if (onAddCustomTopic) {
      onAddCustomTopic(newTopic, customTask);
    }

    setSuccessMsg(`Đã bổ sung thành công chủ đề "${customTitle.trim()}" vào ngân hàng đề!`);
    setCustomTitle('');
    setCustomPrompt('');
    setCustomVocabWords('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#24211E]/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF8F5] border border-[#E6E2D8] rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E6E2D8] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3E4F42]/10 text-[#3E4F42] flex items-center justify-center border border-[#3E4F42]/20 shrink-0">
              <Library className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-semibold text-[#24211E] flex items-center gap-2">
                <span>Nguồn Tài Liệu &amp; Bổ Sung Chủ Đề</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3E4F42]/10 text-[#3E4F42] border border-[#3E4F42]/20 font-mono font-medium">
                  Cambridge • Simon • Liz
                </span>
              </h2>
              <p className="text-xs text-[#7A7369]">
                Khám phá nguồn gốc đề thi chuẩn quốc tế và chủ động mở rộng ngân hàng từ vựng học thuật.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A7369] hover:text-[#24211E] hover:bg-[#F4EFEA] transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-5 pt-3 pb-1 border-b border-[#E6E2D8] flex items-center gap-2 shrink-0 bg-[#F4EFEA]">
          <button
            type="button"
            onClick={() => setActiveTab('sources')}
            className={`py-2 px-3.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sources'
                ? "bg-[#3E4F42] text-white shadow-xs"
                : "text-[#7A7369] hover:text-[#24211E] hover:bg-white"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Nguồn Đề Thi &amp; Từ Vựng Chính Thức</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('add_custom')}
            className={`py-2 px-3.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'add_custom'
                ? "bg-[#3E4F42] text-white shadow-xs"
                : "text-[#7A7369] hover:text-[#24211E] hover:bg-white"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Tự Bổ Sung Đề Mới &amp; Từ Vựng</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {activeTab === 'sources' ? (
            <div className="space-y-4">
              
              {/* Quick stats overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-white border border-[#E6E2D8]">
                <div className="text-center p-2 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
                  <span className="text-[10px] text-[#7A7369] uppercase font-medium block">Tổng Chủ Đề</span>
                  <span className="text-lg font-serif font-bold text-[#24211E]">{totalTopicsCount || "25+"}</span>
                </div>
                <div className="text-center p-2 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
                  <span className="text-[10px] text-[#7A7369] uppercase font-medium block">Từ Vựng Band 8.0</span>
                  <span className="text-lg font-serif font-bold text-[#3E4F42]">{totalVocabCount || "200+"}</span>
                </div>
                <div className="text-center p-2 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
                  <span className="text-[10px] text-[#7A7369] uppercase font-medium block">Bộ Đề Cambridge</span>
                  <span className="text-lg font-serif font-bold text-[#24211E]">Cam 10-19</span>
                </div>
                <div className="text-center p-2 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
                  <span className="text-[10px] text-[#7A7369] uppercase font-medium block">Chuẩn Chấm Điểm</span>
                  <span className="text-lg font-serif font-bold text-[#A67C52]">4 Tiêu Chí</span>
                </div>
              </div>

              {/* List of Official Sources */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7A7369] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#3E4F42]" />
                  <span>Các Nguồn Dữ Liệu Được Trích Xuất &amp; Chuẩn Hóa:</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {OFFICIAL_SOURCES.map((source) => (
                    <div 
                      key={source.id}
                      className="p-3.5 rounded-2xl bg-white border border-[#E6E2D8] hover:border-[#E6E2D8] transition flex flex-col justify-between space-y-2.5 shadow-xs"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-[#24211E] leading-snug">
                            {source.title}
                          </h4>
                          <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#3E4F42]/10 text-[#3E4F42] font-medium border border-[#3E4F42]/20 shrink-0">
                            {source.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7A7369] mt-0.5">
                          Tác giả: {source.author}
                        </p>
                        <p className="text-xs text-[#24211E] leading-relaxed mt-2 font-sans">
                          {source.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#E6E2D8] flex items-center justify-between text-[11px]">
                        <span className="text-[#7A7369] italic text-[10px] truncate max-w-[220px]">
                          {source.coverage}
                        </span>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[#3E4F42] hover:text-[#334237] font-medium transition shrink-0"
                        >
                          <span>Xem nguồn</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note on how to practice after mastering */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#A67C52]/30 space-y-1.5">
                <span className="text-xs font-semibold text-[#A67C52] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#A67C52]" />
                  <span>Lời khuyên của chuyên gia IELTS khi đã học hết từ vựng:</span>
                </span>
                <p className="text-xs text-[#24211E] leading-relaxed">
                  Học thuộc từ vựng chỉ là bước 1. Để thực sự biến từ vựng thành điểm số Band 7.5 - 8.5, bạn cần <strong>áp dụng ngay vào việc viết bài luận hoàn chỉnh (Tab 4: Viết Full Essay)</strong>. Khi viết bài thật dưới áp lực thời gian, não bộ sẽ kích hoạt phản xạ sử dụng từ vựng tự nhiên nhất.
                </p>
              </div>

            </div>
          ) : (
            /* Tab: Tự Bổ Sung Đề Mới & Từ Vựng */
            <form onSubmit={handleCreateTopic} className="space-y-4">
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#24211E] block">
                  1. Chọn Phần Thi IELTS:
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomTask('task2')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition cursor-pointer border ${
                      customTask === 'task2'
                        ? "bg-[#3E4F42] text-white border-[#3E4F42] shadow-xs"
                        : "bg-white text-[#7A7369] border-[#E6E2D8] hover:text-[#24211E]"
                    }`}
                  >
                    Task 2 (Essay - Luận học thuật)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomTask('task1')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition cursor-pointer border ${
                      customTask === 'task1'
                        ? "bg-[#3E4F42] text-white border-[#3E4F42] shadow-xs"
                        : "bg-white text-[#7A7369] border-[#E6E2D8] hover:text-[#24211E]"
                    }`}
                  >
                    Task 1 (Report - Phân tích số liệu)
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#24211E] block">
                  2. Tên Chủ Đề / Tiêu Đề Bài Viết:
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Ví dụ: AI in Modern Workplaces hoặc Cambridge 19 Test 1"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E6E2D8] text-[#24211E] placeholder-[#7A7369] text-xs focus:outline-none focus:border-[#3E4F42] transition shadow-2xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#24211E] block">
                  3. Câu Hỏi Đề Bài IELTS (Prompt):
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Nhập toàn văn đề bài IELTS của bạn (ví dụ: Some people believe that... Discuss both views and give your opinion.)"
                  rows={3}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E6E2D8] text-[#24211E] placeholder-[#7A7369] text-xs focus:outline-none focus:border-[#3E4F42] transition resize-none leading-relaxed shadow-2xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#24211E] block">
                  4. Danh Sách Từ Vựng Trọng Tâm Band 8.0 Muốn Học (Phân cách bằng dấu phẩy hoặc xuống dòng):
                </label>
                <textarea
                  value={customVocabWords}
                  onChange={(e) => setCustomVocabWords(e.target.value)}
                  placeholder="Ví dụ: pervasive, paradigm, unprecedented, alleviate, indispensable"
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E6E2D8] text-[#24211E] placeholder-[#7A7369] text-xs focus:outline-none focus:border-[#3E4F42] transition resize-none leading-relaxed shadow-2xs"
                />
                <p className="text-[10px] text-[#7A7369]">
                  Hệ thống sẽ tự động đối chiếu các từ này vào bài viết Full Essay ở Tab 4.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-xs transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Thêm Chủ Đề Này Vào Danh Sách Luyện Tập</span>
              </button>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E6E2D8] bg-white flex items-center justify-between text-xs text-[#7A7369] shrink-0">
          <span>Lớp cô Oanh • IELTS Writing Practice Databank</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#F4EFEA] hover:bg-[#E6E2D8] text-[#24211E] border border-[#E6E2D8] font-medium transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
