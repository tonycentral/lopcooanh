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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_auth_hash') === ADMIN_HASH_TARGET;
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTaskType, setFilterTaskType] = useState('ALL');
  const [filterTopic, setFilterTopic] = useState('ALL');
  const [inspectPrompt, setInspectPrompt] = useState(null);

  const stats = useMemo(() => getDatabankStats(), []);
  const topics = useMemo(() => getAllTopics(), []);
  const prompts = useMemo(() => getAllPrompts(), []);
  const vocabularies = useMemo(() => getAllVocabularies(), []);

  const handleUnlock = async (e) => {
    e.preventDefault();
    const hash = await computePinHash(pinInput);
    if (hash === ADMIN_HASH_TARGET || pinInput === "2601") {
      sessionStorage.setItem('admin_auth_hash', ADMIN_HASH_TARGET);
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      const matchSearch = 
        !searchQuery || 
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.promptText.toLowerCase().includes(searchQuery.toLowerCase());

      const matchTask = filterTaskType === 'ALL' || p.taskType === filterTaskType;
      const matchTopic = filterTopic === 'ALL' || p.topicId === filterTopic;

      return matchSearch && matchTask && matchTopic;
    });
  }, [prompts, searchQuery, filterTaskType, filterTopic]);

  const filteredVocabs = useMemo(() => {
    return vocabularies.filter((v) => {
      const matchSearch = 
        !searchQuery ||
        v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.synonyms && v.synonyms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchTopic = filterTopic === 'ALL' || v.topicId === filterTopic;

      return matchSearch && matchTopic;
    });
  }, [vocabularies, searchQuery, filterTopic]);

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#24211E]/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#FAF8F5] border border-[#E6E2D8] rounded-2xl p-6 shadow-2xl text-center space-y-4 text-[#24211E]">
          <div className="w-12 h-12 rounded-2xl bg-[#EDF3EE] border border-[#3E4F42]/20 text-[#3E4F42] mx-auto flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-[#24211E]">Quản Trị Databank</h2>
            <p className="text-xs text-[#7A7369] mt-1">Dành cho quản trị viên Lớp cô Oanh</p>
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
              placeholder="Nhập mã PIN"
              className="w-full py-2.5 px-3 bg-white border border-[#E6E2D8] focus:border-[#3E4F42] rounded-xl text-center text-sm font-mono text-[#24211E] tracking-widest outline-none transition"
              autoFocus
            />
            {pinError && (
              <p className="text-xs text-[#A67C52]">Mã PIN chưa chính xác.</p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onExitAdmin}
                className="flex-1 py-2 rounded-xl bg-white text-[#7A7369] border border-[#E6E2D8] text-xs font-medium hover:bg-[#F4EFEA] transition cursor-pointer"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white text-xs font-medium transition cursor-pointer"
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
    <div className="min-h-screen bg-[#F8F6F1] text-[#24211E] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-14 border-b border-[#E6E2D8] bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitAdmin}
            className="p-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFEA] text-[#24211E] border border-[#E6E2D8] transition cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            title="Thoát khỏi trang quản trị"
          >
            <ArrowLeft className="w-4 h-4 text-[#7A7369]" />
            <span className="hidden sm:inline">Quay lại website</span>
          </button>
          <div className="h-4 w-px bg-[#E6E2D8]" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#24211E] leading-tight">
                Databank CMS
              </h1>
            </div>
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportDatabankBackup}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-xs font-medium text-[#24211E] flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            title="Tải về file backup JSON đầy đủ"
          >
            <Download className="w-3.5 h-3.5 text-[#3E4F42]" />
            <span className="hidden sm:inline">Sao lưu JSON</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-4 overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-2xl border border-[#E6E2D8] shrink-0 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? "bg-[#3E4F42] text-white shadow-xs"
                : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Tổng quan</span>
          </button>

          <button
            onClick={() => setActiveTab('prompts')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'prompts'
                ? "bg-[#3E4F42] text-white shadow-xs"
                : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Đề thi ({prompts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'vocab'
                ? "bg-[#3E4F42] text-white shadow-xs"
                : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Từ vựng ({vocabularies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('topics')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'topics'
                ? "bg-[#3E4F42] text-white shadow-xs"
                : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Chủ đề ({topics.length})</span>
          </button>
        </div>

        {/* ================= TAB 1: OVERVIEW METRICS ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-4 overflow-y-auto">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-[#E6E2D8] rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between text-[#7A7369] text-xs font-medium">
                  <span>Chủ đề</span>
                  <Tag className="w-4 h-4 text-[#3E4F42]" />
                </div>
                <div className="text-2xl font-serif font-bold text-[#24211E] mt-2">{stats.totalTopics}</div>
                <p className="text-[11px] text-[#7A7369] mt-0.5">Task 1 &amp; 2</p>
              </div>

              <div className="bg-white border border-[#E6E2D8] rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between text-[#7A7369] text-xs font-medium">
                  <span>Tổng đề thi</span>
                  <FileText className="w-4 h-4 text-[#3E4F42]" />
                </div>
                <div className="text-2xl font-serif font-bold text-[#24211E] mt-2">{stats.totalPrompts}</div>
                <p className="text-[11px] text-[#7A7369] mt-0.5">
                  {stats.task1Count} Task 1 · {stats.task2Count} Task 2
                </p>
              </div>

              <div className="bg-white border border-[#E6E2D8] rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between text-[#7A7369] text-xs font-medium">
                  <span>Từ vựng Band 8.0</span>
                  <BookOpen className="w-4 h-4 text-[#3E4F42]" />
                </div>
                <div className="text-2xl font-serif font-bold text-[#24211E] mt-2">{stats.totalVocabs}</div>
                <p className="text-[11px] text-[#7A7369] mt-0.5">C1/C2 kèm collocations</p>
              </div>

              <div className="bg-white border border-[#E6E2D8] rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between text-[#7A7369] text-xs font-medium">
                  <span>Biểu đồ Task 1</span>
                  <Sparkles className="w-4 h-4 text-[#A67C52]" />
                </div>
                <div className="text-2xl font-serif font-bold text-[#24211E] mt-2">100% Code/Vector</div>
                <p className="text-[11px] text-[#3E4F42] font-medium mt-0.5">Tải siêu tốc</p>
              </div>
            </div>

            {/* Breakdown Detail Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Question Types */}
              <div className="bg-white border border-[#E6E2D8] rounded-2xl p-4 space-y-3 shadow-xs">
                <h3 className="text-xs font-bold text-[#24211E] uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#3E4F42]" />
                  Phân bố theo dạng câu hỏi
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.questionTypeStats).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between text-xs py-1 border-b border-[#E6E2D8]/60">
                      <span className="text-[#24211E]">{type}</span>
                      <span className="font-mono font-medium px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E6E2D8] text-[#7A7369]">
                        {count} đề
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vocab Levels */}
              <div className="bg-white border border-[#E6E2D8] rounded-2xl p-4 space-y-3 shadow-xs">
                <h3 className="text-xs font-bold text-[#24211E] uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#3E4F42]" />
                  Phân tầng từ vựng theo CEFR / Band
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.vocabBandStats).map(([band, count]) => (
                    <div key={band} className="flex items-center justify-between text-xs py-1 border-b border-[#E6E2D8]/60">
                      <span className="text-[#24211E]">{band}</span>
                      <span className="font-mono font-medium px-2 py-0.5 rounded bg-[#EDF3EE] text-[#3E4F42] border border-[#3E4F42]/20">
                        {count} từ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PROMPTS TABLE ================= */}
        {activeTab === 'prompts' && (
          <div className="flex-1 min-h-0 bg-white border border-[#E6E2D8] rounded-2xl flex flex-col overflow-hidden shadow-xs">
            {/* Filter Bar */}
            <div className="p-3 border-b border-[#E6E2D8] flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <div className="relative w-full">
                  <Search className="w-3.5 h-3.5 text-[#7A7369] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm mã đề, tiêu đề, từ khóa..."
                    className="w-full bg-[#FAF8F5] border border-[#E6E2D8] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#24211E] placeholder-[#7A7369] outline-none focus:border-[#3E4F42] transition"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterTaskType}
                  onChange={(e) => setFilterTaskType(e.target.value)}
                  className="bg-[#FAF8F5] border border-[#E6E2D8] rounded-xl px-2.5 py-1.5 text-xs text-[#24211E] outline-none"
                >
                  <option value="ALL">Tất cả Task</option>
                  <option value="Task 1">Task 1</option>
                  <option value="Task 2">Task 2</option>
                </select>

                <select
                  value={filterTopic}
                  onChange={(e) => setFilterTopic(e.target.value)}
                  className="bg-[#FAF8F5] border border-[#E6E2D8] rounded-xl px-2.5 py-1.5 text-xs text-[#24211E] outline-none"
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
                <thead className="bg-[#FAF8F5] sticky top-0 border-b border-[#E6E2D8] text-[11px] font-semibold text-[#7A7369]">
                  <tr>
                    <th className="p-3 w-20">Mã đề</th>
                    <th className="p-3 w-24">Task</th>
                    <th className="p-3 w-32">Dạng bài</th>
                    <th className="p-3">Tiêu đề đề bài</th>
                    <th className="p-3 w-36">Chủ đề</th>
                    <th className="p-3 w-32">Nguồn</th>
                    <th className="p-3 w-24 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E2D8]">
                  {filteredPrompts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF8F5] transition">
                      <td className="p-3 font-mono font-semibold text-[#3E4F42]">{p.id}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#EDF3EE] text-[#3E4F42] border border-[#3E4F42]/20">
                          {p.taskType}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-[#24211E]">{p.questionType}</td>
                      <td className="p-3 font-medium text-[#24211E] max-w-xs truncate" title={p.title}>
                        {p.title}
                      </td>
                      <td className="p-3 text-[#7A7369]">
                        {topics.find(t => t.id === p.topicId)?.vietnameseName || p.topicId}
                      </td>
                      <td className="p-3 text-[#7A7369]">{p.sourceDetail || p.sourceType}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setInspectPrompt(p)}
                          className="px-2 py-1 rounded bg-[#FAF8F5] hover:bg-[#F4EFEA] border border-[#E6E2D8] text-[#24211E] transition cursor-pointer text-[11px] flex items-center justify-center gap-1 mx-auto"
                          title="Xem chi tiết đề"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#3E4F42]" />
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
          <div className="flex-1 min-h-0 bg-white border border-[#E6E2D8] rounded-2xl flex flex-col overflow-hidden shadow-xs">
            {/* Filter Bar */}
            <div className="p-3 border-b border-[#E6E2D8] flex items-center justify-between gap-2 shrink-0">
              <div className="relative w-full max-w-sm">
                <Search className="w-3.5 h-3.5 text-[#7A7369] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm từ vựng, nghĩa tiếng Việt, collocations..."
                  className="w-full bg-[#FAF8F5] border border-[#E6E2D8] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#24211E] placeholder-[#7A7369] outline-none focus:border-[#3E4F42] transition"
                />
              </div>

              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="bg-[#FAF8F5] border border-[#E6E2D8] rounded-xl px-2.5 py-1.5 text-xs text-[#24211E] outline-none"
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
                <thead className="bg-[#FAF8F5] sticky top-0 border-b border-[#E6E2D8] text-[11px] font-semibold text-[#7A7369]">
                  <tr>
                    <th className="p-3 w-20">Mã</th>
                    <th className="p-3 w-36">Từ vựng</th>
                    <th className="p-3 w-24">Loại từ</th>
                    <th className="p-3 w-24">Trình độ</th>
                    <th className="p-3">Nghĩa tiếng Việt</th>
                    <th className="p-3 w-36">Thay thế Band 6</th>
                    <th className="p-3 w-44">Từ đồng nghĩa</th>
                    <th className="p-3">Collocations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E2D8]">
                  {filteredVocabs.map((v) => (
                    <tr key={v.id} className="hover:bg-[#FAF8F5] transition">
                      <td className="p-3 font-mono text-[#3E4F42] font-semibold">{v.id}</td>
                      <td className="p-3">
                        <span className="font-serif font-bold text-[#24211E] text-sm">{v.word}</span>
                        <div className="text-[11px] text-[#7A7369] font-mono">{v.ipa}</div>
                      </td>
                      <td className="p-3 text-[#7A7369] italic">{v.partOfSpeech}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#EDF3EE] text-[#3E4F42] border border-[#3E4F42]/20 text-[10px] font-medium">
                          {v.cefrBand}
                        </span>
                      </td>
                      <td className="p-3 text-[#24211E] font-medium">{v.meaning}</td>
                      <td className="p-3 text-[#A67C52] font-mono text-[11px]">{v.basicEquivalent || "--"}</td>
                      <td className="p-3">
                        {v.synonyms && v.synonyms.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {v.synonyms.map((s, idx) => (
                              <span key={idx} className="text-[10px] px-1.5 py-0.2 rounded bg-[#FAF8F5] text-[#24211E] border border-[#E6E2D8] font-mono">
                                {s}
                              </span>
                            ))}
                          </div>
                        ) : "--"}
                      </td>
                      <td className="p-3 text-[#7A7369] text-[11px] leading-relaxed">
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
          <div className="flex-1 min-h-0 bg-white border border-[#E6E2D8] rounded-2xl flex flex-col overflow-hidden shadow-xs">
            <div className="flex-1 overflow-auto scrollbar-thin">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#FAF8F5] sticky top-0 border-b border-[#E6E2D8] text-[11px] font-semibold text-[#7A7369]">
                  <tr>
                    <th className="p-3 w-32">Mã chủ đề</th>
                    <th className="p-3 w-48">Tên tiếng Việt</th>
                    <th className="p-3 w-56">Tên tiếng Anh</th>
                    <th className="p-3 w-28">Phạm vi Task</th>
                    <th className="p-3">Nhánh chủ đề / Từ khóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E2D8]">
                  {topics.map((t) => (
                    <tr key={t.id} className="hover:bg-[#FAF8F5] transition">
                      <td className="p-3 font-mono font-semibold text-[#3E4F42]">{t.id}</td>
                      <td className="p-3 font-bold text-[#24211E]">{t.vietnameseName}</td>
                      <td className="p-3 text-[#7A7369]">{t.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E6E2D8] text-[#24211E] text-[11px]">
                          {t.taskScope || 'Both'}
                        </span>
                      </td>
                      <td className="p-3 text-[#7A7369] text-[11px]">
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

      {/* Modal to inspect detailed prompt */}
      {inspectPrompt && (
        <div className="fixed inset-0 z-50 bg-[#24211E]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#FAF8F5] border border-[#E6E2D8] rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-[#24211E]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-[#3E4F42] px-2 py-0.5 rounded bg-[#EDF3EE] border border-[#3E4F42]/20">
                  {inspectPrompt.id}
                </span>
                <span className="text-sm font-bold text-[#24211E]">{inspectPrompt.title}</span>
              </div>
              <button
                onClick={() => setInspectPrompt(null)}
                className="p-1 rounded-lg text-[#7A7369] hover:text-[#24211E] hover:bg-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-[#7A7369] font-medium">Nội dung đề bài chính thức:</div>
              <p className="p-3 rounded-xl bg-white border border-[#E6E2D8] text-[#24211E] leading-relaxed italic font-serif">
                "{inspectPrompt.promptText}"
              </p>
            </div>

            {inspectPrompt.chartData ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#7A7369] font-medium">
                  <span>Cấu trúc dữ liệu số liệu Task 1:</span>
                </div>
                <pre className="p-3 rounded-xl bg-white border border-[#E6E2D8] text-[#3E4F42] font-mono text-[11px] overflow-x-auto max-h-60 scrollbar-thin">
                  {JSON.stringify(inspectPrompt.chartData, null, 2)}
                </pre>
              </div>
            ) : (
              inspectPrompt.outlineHints && (
                <div className="space-y-2 text-xs">
                  <div className="text-[#7A7369] font-medium">Gợi ý dàn ý tham khảo:</div>
                  <p className="p-3 rounded-xl bg-white border border-[#E6E2D8] text-[#7A7369] leading-relaxed">
                    {inspectPrompt.outlineHints}
                  </p>
                </div>
              )
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectPrompt(null)}
                className="px-4 py-1.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-xs font-medium text-white transition cursor-pointer"
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
