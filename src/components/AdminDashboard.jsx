import React, { useState, useMemo } from 'react';
import { 
  Database, 
  BarChart3, 
  FileText, 
  BookOpen, 
  Tag, 
  Download, 
  ArrowLeft, 
  Search, 
  Lock, 
  CheckCircle2, 
  Layers,
  TrendingUp,
  Sparkles,
  Eye,
  X
} from 'lucide-react';

import { 
  getAllTopics, 
  getAllPrompts, 
  getAllVocabularies, 
  getDatabankStats, 
  exportDatabankBackup 
} from '../data/databank/databankService';

// Khóa băm mật mã SHA-256 (Salted Hash) bảo vệ khu vực quản trị viên
const ADMIN_HASH_TARGET = "9bd902d1804e959bb6ed9cea3b386422343f5e2601b8da68d2a7790fc61f5760";
const PIN_SALT = "lopcooanh_salt_2026";

async function computePinHash(pin) {
  if (!crypto?.subtle) return "";
  const encoder = new TextEncoder();
  const data = encoder.encode(PIN_SALT + pin.trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function AdminDashboard({ onExitAdmin }) {
  // Passcode protection với token băm trong sessionStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_auth_hash') === ADMIN_HASH_TARGET;
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Dashboard Tab state: 'overview' | 'prompts' | 'vocab' | 'topics'
  const [activeTab, setActiveTab] = useState('overview');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTaskType, setFilterTaskType] = useState('ALL');
  const [filterTopic, setFilterTopic] = useState('ALL');

  // Selected prompt modal to inspect raw code/text chartData
  const [inspectPrompt, setInspectPrompt] = useState(null);

  // Load static databank
  const topics = useMemo(() => getAllTopics(), []);
  const prompts = useMemo(() => getAllPrompts(), []);
  const vocabularies = useMemo(() => getAllVocabularies(), []);
  const stats = useMemo(() => getDatabankStats(), []);

  // Handle PIN unlock bằng thuật toán mật mã
  const handleUnlock = async (e) => {
    e.preventDefault();
    try {
      const computedHash = await computePinHash(pinInput);
      if (computedHash === ADMIN_HASH_TARGET) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_auth_hash', ADMIN_HASH_TARGET);
        setPinError(false);
      } else {
        setPinError(true);
      }
    } catch {
      setPinError(true);
    }
  };

  // Filtered Prompts
  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      const matchSearch = 
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.promptText.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTask = filterTaskType === 'ALL' || p.taskType === filterTaskType;
      const matchTopic = filterTopic === 'ALL' || p.topicId === filterTopic;
      return matchSearch && matchTask && matchTopic;
    });
  }, [prompts, searchQuery, filterTaskType, filterTopic]);

  // Filtered Vocabularies
  const filteredVocabs = useMemo(() => {
    return vocabularies.filter((v) => {
      const matchSearch = 
        v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.collocations && v.collocations.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchTopic = filterTopic === 'ALL' || v.topicId === filterTopic;
      return matchSearch && matchTopic;
    });
  }, [vocabularies, searchQuery, filterTopic]);

  // If not authenticated, show sleek minimal PIN lock screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Khu Vực Quản Trị Databank</h2>
            <p className="text-xs text-slate-400 mt-1">Dành riêng cho cô Oanh để quản lý ngân hàng đề</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="Nhập mã PIN bảo mật"
              className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-center text-sm font-mono text-white tracking-widest outline-none transition"
              autoFocus
            />
            {pinError && (
              <p className="text-xs text-rose-400">Mã PIN chưa chính xác. Vui lòng thử lại.</p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onExitAdmin}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
              >
                Mở khóa
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitAdmin}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Thoát khỏi trang quản trị"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Thoát trang quản trị</span>
          </button>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-tight">
                Databank CMS (Lớp Cô Oanh)
              </h1>
              <p className="text-[10px] text-slate-400 leading-none">Chế độ quản trị cục bộ siêu nhẹ</p>
            </div>
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportDatabankBackup}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
            title="Tải về file backup JSON đầy đủ"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Sao lưu JSON</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-4 overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-2xl border border-slate-800 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Thống kê tổng quan</span>
          </button>

          <button
            onClick={() => setActiveTab('prompts')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'prompts'
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Ngân hàng đề thi ({prompts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'vocab'
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Kho từ vựng ({vocabularies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('topics')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'topics'
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Danh mục chủ đề ({topics.length})</span>
          </button>
        </div>

        {/* ================= TAB 1: OVERVIEW METRICS ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-4 overflow-y-auto">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Chủ đề (Topics)</span>
                  <Tag className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-extrabold text-white mt-2">{stats.totalTopics}</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Phân cấp chuẩn Task 1 & 2</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Tổng đề thi (Prompts)</span>
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-extrabold text-white mt-2">{stats.totalPrompts}</div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {stats.task1Count} Task 1 · {stats.task2Count} Task 2
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Từ vựng Band 8.0</span>
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-white mt-2">{stats.totalVocabs}</div>
                <p className="text-[11px] text-slate-500 mt-0.5">C1/C2 kèm collocations</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Biểu đồ Task 1</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold text-white mt-2">100% Code/Text</div>
                <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">Không dùng file ảnh nặng</p>
              </div>
            </div>

            {/* Breakdown Detail Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Question Types */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Phân bố theo dạng câu hỏi (Question Types)
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.questionTypeStats).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60">
                      <span className="text-slate-300">{type}</span>
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                        {count} đề
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vocab Levels */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Phân tầng từ vựng theo CEFR / Band
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.vocabBandStats).map(([band, count]) => (
                    <div key={band} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60">
                      <span className="text-slate-300">{band}</span>
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-300">
                        {count} từ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Instruction on how AI updates files */}
            <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-2xl p-4 text-xs text-indigo-200 space-y-1.5">
              <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                Cơ chế tự động hóa cực nhanh của trợ lý AI:
              </div>
              <p className="text-slate-300 leading-relaxed">
                Mọi dữ liệu hiển thị ở bảng này được đọc trực tiếp từ các file JSON trong thư mục <code className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-300 font-mono">src/data/databank/</code>. Mỗi khi bạn yêu cầu trợ lý AI thêm đề, nạp từ vựng hoặc chỉnh sửa số liệu, AI sẽ ghi trực tiếp vào file và hệ thống sẽ tự cập nhật ngay lập tức mà không cần copy mã nguồn Apps Script nữa!
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PROMPTS TABLE ================= */}
        {activeTab === 'prompts' && (
          <div className="flex-1 min-h-0 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
            {/* Filter Bar */}
            <div className="p-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <div className="relative w-full">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm mã đề, tiêu đề, từ khóa..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterTaskType}
                  onChange={(e) => setFilterTaskType(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 outline-none"
                >
                  <option value="ALL">Tất cả Task</option>
                  <option value="Task 1">Task 1</option>
                  <option value="Task 2">Task 2</option>
                </select>

                <select
                  value={filterTopic}
                  onChange={(e) => setFilterTopic(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 outline-none"
                >
                  <option value="ALL">Tất cả chủ đề</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>{t.vietnameseName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto scrollbar-thin">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950/80 sticky top-0 border-b border-slate-800 text-[11px] font-bold text-slate-400">
                  <tr>
                    <th className="p-3 w-20">Mã đề</th>
                    <th className="p-3 w-24">Dạng Task</th>
                    <th className="p-3 w-32">Dạng bài</th>
                    <th className="p-3">Tiêu đề đề bài</th>
                    <th className="p-3 w-36">Chủ đề</th>
                    <th className="p-3 w-32">Nguồn đề</th>
                    <th className="p-3 w-24 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredPrompts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-mono font-bold text-indigo-400">{p.id}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.taskType === 'Task 1' 
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                            : 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                        }`}>
                          {p.taskType}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-300">{p.questionType}</td>
                      <td className="p-3 font-medium text-white max-w-xs truncate" title={p.title}>
                        {p.title}
                      </td>
                      <td className="p-3 text-slate-400">
                        {topics.find(t => t.id === p.topicId)?.vietnameseName || p.topicId}
                      </td>
                      <td className="p-3 text-slate-400">{p.sourceDetail || p.sourceType}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setInspectPrompt(p)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer text-[11px] flex items-center justify-center gap-1 mx-auto"
                          title="Xem chi tiết đề & cấu trúc dữ liệu"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Chi tiết</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: VOCABULARY TABLE ================= */}
        {activeTab === 'vocab' && (
          <div className="flex-1 min-h-0 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
            {/* Filter Bar */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
              <div className="relative w-full max-w-sm">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm từ vựng, nghĩa tiếng Việt, collocations..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition"
                />
              </div>

              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 outline-none"
              >
                <option value="ALL">Tất cả chủ đề</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>{t.vietnameseName}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto scrollbar-thin">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950/80 sticky top-0 border-b border-slate-800 text-[11px] font-bold text-slate-400">
                  <tr>
                    <th className="p-3 w-20">Mã từ</th>
                    <th className="p-3 w-36">Từ vựng</th>
                    <th className="p-3 w-24">Loại từ</th>
                    <th className="p-3 w-28">Trình độ</th>
                    <th className="p-3">Nghĩa tiếng Việt</th>
                    <th className="p-3 w-40">Thay thế Band 6</th>
                    <th className="p-3">Collocations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredVocabs.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-mono text-emerald-400 font-bold">{v.id}</td>
                      <td className="p-3">
                        <span className="font-bold text-white text-sm">{v.word}</span>
                        <div className="text-[11px] text-slate-400 font-mono">{v.ipa}</div>
                      </td>
                      <td className="p-3 text-slate-400 italic">{v.partOfSpeech}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">
                          {v.cefrBand}
                        </span>
                      </td>
                      <td className="p-3 text-slate-200 font-medium">{v.meaning}</td>
                      <td className="p-3 text-amber-400/90 font-mono text-[11px]">{v.basicEquivalent || "--"}</td>
                      <td className="p-3 text-slate-300 text-[11px] leading-relaxed">
                        {v.collocations ? v.collocations.join('; ') : '--'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 4: TOPICS TABLE ================= */}
        {activeTab === 'topics' && (
          <div className="flex-1 min-h-0 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto scrollbar-thin">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950/80 sticky top-0 border-b border-slate-800 text-[11px] font-bold text-slate-400">
                  <tr>
                    <th className="p-3 w-32">Mã chủ đề (topic_id)</th>
                    <th className="p-3 w-48">Tên tiếng Việt</th>
                    <th className="p-3 w-56">Tên tiếng Anh</th>
                    <th className="p-3 w-28">Phạm vi Task</th>
                    <th className="p-3">Nhánh chủ đề / Từ khóa (sub_topics)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {topics.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-mono font-bold text-indigo-400">{t.id}</td>
                      <td className="p-3 font-bold text-white">{t.vietnameseName}</td>
                      <td className="p-3 text-slate-300">{t.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-semibold">
                          {t.taskScope || 'Both'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 text-[11px]">
                        {t.subTopics ? t.subTopics.join(', ') : '--'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Modal to inspect detailed prompt & its structured text/code */}
      {inspectPrompt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                  {inspectPrompt.id}
                </span>
                <span className="text-sm font-bold text-white">{inspectPrompt.title}</span>
              </div>
              <button
                onClick={() => setInspectPrompt(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-slate-400 font-semibold">Nội dung đề bài chính thức:</div>
              <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed italic">
                "{inspectPrompt.promptText}"
              </p>
            </div>

            {inspectPrompt.chartData ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 font-semibold">
                  <span>Cấu trúc dữ liệu số liệu Task 1 (Dạng code/text JSON):</span>
                  <span className="text-[10px] text-emerald-400 font-mono">100% Vector Lightweight</span>
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-[11px] overflow-x-auto max-h-60 scrollbar-thin">
                  {JSON.stringify(inspectPrompt.chartData, null, 2)}
                </pre>
              </div>
            ) : (
              inspectPrompt.outlineHints && (
                <div className="space-y-2 text-xs">
                  <div className="text-slate-400 font-semibold">Gợi ý dàn ý tham khảo:</div>
                  <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                    {inspectPrompt.outlineHints}
                  </p>
                </div>
              )
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectPrompt(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
