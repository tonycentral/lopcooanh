import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Settings, 
  User, 
  Mail, 
  Cloud, 
  Target, 
  Trash2, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Bot, 
  LogOut, 
  Sparkles,
  History,
  Clock,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  ArrowRight,
  Layers,
  BookMarked
} from 'lucide-react';
import { BAND_OPTIONS } from '../data/bandDescriptors';
import { clearHistory } from '../services/storage';
import { analyzeRecurrentMistakes, getUserTestHistory } from '../services/mistakeAnalysisService';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  currentUser,
  studentEmail,
  onUpdateFullName,
  targetBand, 
  onSelectBand, 
  current7DayScore,
  apiKey, 
  onSaveApiKey,
  onResetData,
  onSignOut,
  onGoView,
  initialTab = 'profile'
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'profile' | 'history' | 'mistakes'
  const [historyFilter, setHistoryFilter] = useState('ALL'); // 'ALL' | 'reading' | 'writing'

  const [fullNameInput, setFullNameInput] = useState(
    currentUser?.user_metadata?.full_name || ""
  );
  const [isNameSaving, setIsNameSaving] = useState(false);
  const [nameSavedSuccess, setNameSavedSuccess] = useState(false);

  const [inputKey, setInputKey] = useState(apiKey || "");
  const [keySavedSuccess, setKeySavedSuccess] = useState(false);

  // Analysis of test attempts and recurrent mistakes
  const analysisData = useMemo(() => {
    if (!isOpen) return { totalAttempts: 0, readingCount: 0, writingCount: 0, averageBand: "--", recurrentMistakes: [], attempts: [] };
    return analyzeRecurrentMistakes(currentUser?.email || studentEmail);
  }, [isOpen, currentUser?.email, studentEmail]);

  useEffect(() => {
    if (currentUser?.user_metadata?.full_name) {
      setFullNameInput(currentUser.user_metadata.full_name);
    }
  }, [currentUser]);

  useEffect(() => {
    if (apiKey) {
      setInputKey(apiKey);
    }
  }, [apiKey]);

  if (!isOpen) return null;

  const handleSaveName = async () => {
    if (!fullNameInput.trim()) return;
    setIsNameSaving(true);
    if (onUpdateFullName) {
      await onUpdateFullName(fullNameInput.trim());
    }
    setIsNameSaving(false);
    setNameSavedSuccess(true);
    setTimeout(() => setNameSavedSuccess(false), 2000);
  };

  const handleSaveApiKey = () => {
    if (onSaveApiKey) {
      onSaveApiKey(inputKey.trim());
    }
    setKeySavedSuccess(true);
    setTimeout(() => setKeySavedSuccess(false), 2000);
  };

  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn đặt lại dữ liệu lịch sử và làm mới thống kê trên thiết bị này?")) {
      clearHistory();
      if (onResetData) onResetData();
      onClose();
    }
  };

  const displayName = currentUser?.user_metadata?.full_name || studentEmail || "Học viên";
  const initial = displayName.charAt(0).toUpperCase();

  // Filter attempts
  const filteredAttempts = (analysisData.attempts || []).filter(item => {
    if (historyFilter === 'ALL') return true;
    if (historyFilter === 'reading') return item.type === 'reading';
    if (historyFilter === 'writing') return item.type === 'writing' || item.type === 'coherence';
    return true;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#24211E]/55 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#FAF8F5] border border-[#E6E2D8] rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl text-[#24211E] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= MODAL HEADER ================= */}
        <div className="px-6 py-4 border-b border-[#E6E2D8] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center border border-[#D1DDD3] shadow-2xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-title font-bold text-[#24211E]">
                Hồ Sơ Học Viên &amp; Tiến Độ
              </h2>
              <p className="text-xs text-[#7A7369]">
                {currentUser?.email || studentEmail || "Tài khoản cá nhân"} • Mục tiêu Band {targetBand}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A7369] hover:text-[#24211E] hover:bg-[#F4EFEA] transition cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= TABS NAVIGATION BAR ================= */}
        <div className="px-6 pt-3 bg-white border-b border-[#E6E2D8] flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'profile'
                ? "border-[#3E4F42] text-[#3E4F42]"
                : "border-transparent text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Hồ sơ &amp; Cài đặt</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'history'
                ? "border-[#3E4F42] text-[#3E4F42]"
                : "border-transparent text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Lịch sử làm bài ({analysisData.totalAttempts})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mistakes')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'mistakes'
                ? "border-[#3E4F42] text-[#3E4F42]"
                : "border-transparent text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Phân tích lỗi sai lặp lại</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </button>
        </div>

        {/* ================= MODAL BODY ================= */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-[#24211E] scrollbar-thin flex-1 min-h-0">
          
          {/* TAB 1: HỒ SƠ & CÀI ĐẶT */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* 1. Thông tin học viên */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3E4F42] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Hồ Sơ Học Viên
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] text-[11px] font-semibold border border-[#D1DDD3]">
                    <Cloud className="w-3 h-3" />
                    <span>Đã đồng bộ Cloud</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 pt-1">
                  <div className="w-12 h-12 rounded-2xl bg-[#3E4F42] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={fullNameInput}
                        onChange={(e) => setFullNameInput(e.target.value)}
                        placeholder="Nhập họ và tên của bạn..."
                        className="flex-1 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs font-semibold text-[#24211E] focus:outline-none focus:border-[#3E4F42] focus:bg-white"
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={isNameSaving}
                        className="px-3 py-1.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white text-xs font-medium transition cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        {nameSavedSuccess ? <Check className="w-3.5 h-3.5" /> : "Lưu"}
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#7A7369] mt-1.5 truncate">
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate">{currentUser?.email || studentEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E6E2D8] text-[11px] text-[#7A7369] leading-relaxed flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#A67C52] shrink-0" />
                  <span>Tiến độ học tập, bài thi Reading và lịch sử bài viết được lưu trữ an toàn.</span>
                </div>
              </div>

              {/* 2. Mục tiêu Band IELTS */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#3E4F42] flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    Mục Tiêu Band Điểm
                  </label>
                  {current7DayScore !== null && (
                    <span className="text-[11px] text-[#7A7369]">
                      Điểm 7 ngày qua: <strong className="text-[#3E4F42]">{current7DayScore.toFixed(1)}</strong>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5 pt-1">
                  {BAND_OPTIONS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => onSelectBand && onSelectBand(b)}
                      className={`py-2 rounded-xl font-bold text-xs border transition cursor-pointer ${
                        b === targetBand
                          ? "bg-[#3E4F42] border-[#3E4F42] text-white shadow-xs"
                          : "bg-[#FAF8F5] border-[#E6E2D8] text-[#24211E] hover:bg-white hover:border-[#D1DDD3]"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Google Gemini API Key */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#3E4F42] flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5" />
                    Google Gemini API Key (Tuỳ chọn)
                  </label>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF5EE] text-[#A67C52] font-semibold border border-[#E6E2D8]">
                    Miễn phí
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#24211E] placeholder-[#7A7369] focus:outline-none focus:border-[#3E4F42] font-mono focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleSaveApiKey}
                    className="px-4 py-2 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    {keySavedSuccess ? <Check className="w-3.5 h-3.5 text-white" /> : "Lưu Key"}
                  </button>
                </div>
              </div>

              {/* 4. Reset & Logout */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#7A7369]">
                  <ShieldCheck className="w-4 h-4 text-[#3E4F42] shrink-0" />
                  <span>Dữ liệu cấu hình cục bộ được bảo mật an toàn.</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[#A67C52] hover:underline font-medium shrink-0 cursor-pointer"
                >
                  Đặt lại dữ liệu máy
                </button>
              </div>

              {onSignOut && (
                <div className="pt-2 border-t border-[#E6E2D8] flex justify-between items-center">
                  <span className="text-[#7A7369] text-xs">Tài khoản: <strong>{currentUser?.email || studentEmail}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSignOut();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#A67C52] hover:bg-[#FAF5EE] border border-[#E6E2D8] transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LỊCH SỬ LÀM BÀI (TEST ATTEMPT HISTORY) */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Summary Scorecard */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-white rounded-2xl border border-[#E6E2D8] shadow-2xs">
                  <div className="text-[10px] text-[#7A7369] font-medium uppercase">Tổng lượt thi &amp; viết</div>
                  <div className="text-lg font-bold text-[#3E4F42] mt-0.5">{analysisData.totalAttempts}</div>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-[#E6E2D8] shadow-2xs">
                  <div className="text-[10px] text-[#7A7369] font-medium uppercase">Band trung bình</div>
                  <div className="text-lg font-bold text-[#A67C52] mt-0.5">Band {analysisData.averageBand}</div>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-[#E6E2D8] shadow-2xs">
                  <div className="text-[10px] text-[#7A7369] font-medium uppercase">Đề Reading đã thi</div>
                  <div className="text-lg font-bold text-[#24211E] mt-0.5">{analysisData.readingCount} đề</div>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-[#E6E2D8] shadow-2xs">
                  <div className="text-[10px] text-[#7A7369] font-medium uppercase">Bài Writing đã nộp</div>
                  <div className="text-lg font-bold text-[#24211E] mt-0.5">{analysisData.writingCount} bài</div>
                </div>
              </div>

              {/* Filter selector */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setHistoryFilter('ALL')}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      historyFilter === 'ALL'
                        ? "bg-[#3E4F42] text-white"
                        : "bg-white text-[#7A7369] border border-[#E6E2D8] hover:text-[#24211E]"
                    }`}
                  >
                    Tất cả ({analysisData.totalAttempts})
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryFilter('reading')}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      historyFilter === 'reading'
                        ? "bg-[#3E4F42] text-white"
                        : "bg-white text-[#7A7369] border border-[#E6E2D8] hover:text-[#24211E]"
                    }`}
                  >
                    Reading ({analysisData.readingCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryFilter('writing')}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      historyFilter === 'writing'
                        ? "bg-[#3E4F42] text-white"
                        : "bg-white text-[#7A7369] border border-[#E6E2D8] hover:text-[#24211E]"
                    }`}
                  >
                    Writing ({analysisData.writingCount})
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('mistakes')}
                  className="text-xs text-[#3E4F42] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Xem phân tích lỗi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Attempts List */}
              <div className="space-y-2.5">
                {filteredAttempts.length === 0 ? (
                  <div className="p-10 rounded-2xl bg-white border border-[#E6E2D8] text-center text-[#7A7369]">
                    <Clock className="w-8 h-8 text-[#A8A299] mx-auto mb-2 opacity-60" />
                    <p className="font-semibold text-[#24211E]">Chưa có lượt làm bài nào</p>
                    <p className="text-xs mt-1">Các bài thi Reading và bài luyện viết của bạn sẽ tự động được lưu lại tại đây.</p>
                  </div>
                ) : (
                  filteredAttempts.map((attempt) => (
                    <div 
                      key={attempt.id}
                      className="p-3.5 rounded-2xl bg-white border border-[#E6E2D8] shadow-2xs hover:border-[#3E4F42]/30 transition space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            attempt.type === 'reading'
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3]"
                          }`}>
                            {attempt.typeLabel}
                          </span>
                          <span className="font-semibold text-xs text-[#24211E] truncate">
                            {attempt.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {attempt.score && (
                            <span className="text-[11px] font-mono text-[#7A7369] bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#E6E2D8]">
                              {attempt.score}
                            </span>
                          )}
                          <span className="px-2.5 py-0.5 rounded-lg bg-[#3E4F42] text-white font-bold text-xs">
                            Band {attempt.band}
                          </span>
                        </div>
                      </div>

                      {/* Content snippet or feedback preview */}
                      {attempt.contentSnippet && (
                        <p className="text-xs font-serif italic text-[#4A453E] bg-[#FAF8F5] p-2 rounded-xl border border-[#E6E2D8] line-clamp-2">
                          "{attempt.contentSnippet}"
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-[#7A7369] pt-1">
                        <span>Thời gian: {attempt.dateFormatted}</span>
                        {attempt.elapsedSeconds > 0 && (
                          <span>Thời lượng làm: {Math.floor(attempt.elapsedSeconds / 60)} phút</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PHÂN TÍCH LỖI SAI LẶP LẠI (RECURRENT MISTAKES ANALYSIS) */}
          {activeTab === 'mistakes' && (
            <div className="space-y-4">
              {/* Diagnostic Intro Banner */}
              <div className="p-4 rounded-2xl bg-[#EDF3EE] border border-[#3E4F42]/20 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#3E4F42] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-bold text-xs text-[#24211E]">
                    Chẩn Đoán Điểm Yếu &amp; Bẫy Phòng Thi Cần Lưu Ý
                  </h3>
                  <p className="text-[11px] text-[#7A7369] leading-relaxed">
                    Dựa trên các bài thi Reading và câu văn bạn đã luyện, hệ thống tự động nhận diện các mẫu lỗi lặp lại có thể kéo tụt điểm Band để bạn chủ động phòng tránh trước khi thi.
                  </p>
                </div>
              </div>

              {/* Recurrent Mistakes Cards */}
              <div className="space-y-3">
                {analysisData.recurrentMistakes.map((mistake, idx) => (
                  <div 
                    key={mistake.id || idx}
                    className="p-4 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs space-y-3 hover:border-[#3E4F42]/30 transition"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-800 font-bold flex items-center justify-center text-xs shrink-0 border border-amber-200">
                          #{idx + 1}
                        </span>
                        <h4 className="font-bold text-xs text-[#24211E]">
                          {mistake.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF8F5] text-[#7A7369] border border-[#E6E2D8]">
                          Kỹ năng: {mistake.skill}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          mistake.severity === 'High'
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          Mức độ: {mistake.severity === 'High' ? 'Cao' : 'Trung bình'}
                        </span>
                      </div>
                    </div>

                    {/* Biểu hiện lỗi */}
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1 text-xs">
                      <div className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider">
                        Biểu hiện thực tế:
                      </div>
                      <p className="text-[#4A453E] leading-relaxed">
                        {mistake.evidence}
                      </p>
                    </div>

                    {/* Chiến lược khắc phục */}
                    <div className="p-2.5 rounded-xl bg-[#EDF3EE]/60 border border-[#3E4F42]/20 space-y-1 text-xs">
                      <div className="text-[10px] font-bold text-[#3E4F42] uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#3E4F42]" />
                        Chiến lược khắc phục mục tiêu:
                      </div>
                      <p className="text-[#24211E] leading-relaxed">
                        {mistake.remedy}
                      </p>
                    </div>

                    {/* Action link */}
                    {mistake.recommendedModule && onGoView && (
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onGoView(mistake.recommendedModule);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#3E4F42]/30 text-[#3E4F42] font-semibold text-xs transition cursor-pointer shadow-2xs group"
                        >
                          <span>{mistake.recommendedLabel || "Xem bài học khắc phục"}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ================= MODAL FOOTER ================= */}
        <div className="px-6 py-3.5 border-t border-[#E6E2D8] bg-white flex justify-between items-center shrink-0">
          <div className="text-xs text-[#7A7369]">
            {activeTab === 'mistakes' ? (
              <span>Khuyến nghị bám sát tiêu chí chấm thi IELTS</span>
            ) : activeTab === 'history' ? (
              <span>Tổng cộng {analysisData.totalAttempts} bài tập &amp; đề thi</span>
            ) : (
              <span>Cài đặt được lưu tự động theo Email học viên</span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-xs transition cursor-pointer shadow-2xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
