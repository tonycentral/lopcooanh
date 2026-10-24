import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Droplets, 
  Sun, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  Flame, 
  HelpCircle,
  Award
} from 'lucide-react';
import { sounds } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { completeAlmanacRound } from '../../services/harvestTownService';

export default function DailyAlmanacModal({
  isOpen,
  onClose,
  almanacState,
  onAlmanacUpdated,
  studentEmail
}) {
  const [activeTab, setActiveTab] = useState('water'); // 'water' | 'sunlight' | 'seed' | 'fertilizer'
  
  // Water Round state (SRS scheduled quick retrieval)
  const [waterIndex, setWaterIndex] = useState(0);
  const [waterAnswered, setWaterAnswered] = useState(false);
  const [waterSelected, setWaterSelected] = useState(null);

  // Sunlight Round state (Listening / comprehension)
  const [sunlightAnswered, setSunlightAnswered] = useState(false);
  const [sunlightSelected, setSunlightSelected] = useState(null);

  // Seed Round state (New words intake)
  const [seedStep, setSeedStep] = useState(0);

  // Fertilizer Round state (Sentence production)
  const [fertilizerInput, setFertilizerInput] = useState('');
  const [fertilizerSubmitted, setFertilizerSubmitted] = useState(false);

  if (!isOpen) return null;

  // 1. Water Round: Quick retrieval test
  const waterCards = [
    {
      word: 'Ubiquitous',
      ipa: '/juːˈbɪk.wə.təs/',
      prompt: 'Từ "Ubiquitous" trong ngữ cảnh học thuật IELTS mang ý nghĩa chính xác nào?',
      options: [
        'Có mặt ở khắp mọi nơi, rất phổ biến (omnipresent)',
        'Hiếm khi xuất hiện, cần bảo tồn đặc biệt',
        'Gây tranh cãi dữ dội trong dư luận',
        'Tăng trưởng chậm dần theo chu kỳ'
      ],
      correctIndex: 0,
      context: 'Smartphones have become truly ubiquitous in modern urban societies.'
    },
    {
      word: 'Substantiate',
      ipa: '/səbˈstæn.ʃi.eɪt/',
      prompt: 'Khi viết Body Paragraph Task 2, từ "Substantiate" có nghĩa là:',
      options: [
        'Thay thế hoàn toàn một giả thuyết cũ',
        'Cung cấp bằng chứng/dữ liệu xác thực để chứng minh luận điểm',
        'Tóm tắt ngắn gọn phần mở bài',
        'Chỉ trích quan điểm của đối phương'
      ],
      correctIndex: 1,
      context: 'The candidate failed to substantiate their assertions with empirical evidence.'
    }
  ];

  // 2. Sunlight Round: Short audio / listening comprehension
  const sunlightClip = {
    title: 'IELTS Listening Section 4 Micro-Clip',
    speaker: 'Giáo sư khảo cổ học Cambridge',
    transcript: '"...Recent excavations in Mesopotamia revealed an unprecedented agricultural irrigation network, substantiating the theory that early civilizations were remarkably proficient in water management."',
    question: 'Theo đoạn trích, phát hiện mới nhất tại Lưỡng Hà đã chứng minh điều gì?',
    options: [
      'Các nền văn minh cổ đại rất thành thạo trong việc quản lý hệ thống tưới tiêu',
      'Người cổ đại chưa biết cách canh tác nông nghiệp',
      'Chiến tranh đã tàn phá toàn bộ các kênh thủy lợi cổ'
    ],
    correctIndex: 0
  };

  // 3. Seed Round: 3 new academic words
  const newSeeds = [
    {
      word: 'Deteriorate',
      ipa: '/dɪˈtɪə.ri.ə.reɪt/',
      meaning: 'Xấu đi, suy giảm chất lượng nghiêm trọng',
      collocation: 'deteriorate rapidly / environmental conditions deteriorate',
      example: 'Air quality in major metropolitan areas continues to deteriorate at an alarming rate.'
    },
    {
      word: 'Mitigate',
      ipa: '/ˈmɪt.ɪ.ɡeɪt/',
      meaning: 'Làm giảm nhẹ, xoa dịu tác hại',
      collocation: 'mitigate climate change / mitigate negative impacts',
      example: 'Strict urban planning regulations can effectively mitigate traffic congestion.'
    },
    {
      word: 'Exemplify',
      ipa: '/ɪɡˈzem.plɪ.faɪ/',
      meaning: 'Làm ví dụ điển hình, minh họa sinh động',
      collocation: 'exemplify the trend / serve to exemplify',
      example: 'Singapore exemplifies how technological adoption can transform public transportation.'
    }
  ];

  // 4. Fertilizer Round: Production task
  const fertilizerPrompt = {
    instruction: 'Ứng dụng từ "Mitigate" hoặc "Deteriorate" để viết 1 câu hoàn chỉnh nêu giải pháp cho vấn đề ô nhiễm môi trường (Writing Task 2):',
    hint: 'Gợi ý: Governments should implement stricter regulations to mitigate air pollution in industrialized cities.',
    sampleSolution: 'Governments should invest heavily in renewable energy to mitigate the adverse effects of greenhouse gases.'
  };

  // Handlers
  const handleWaterAnswer = (idx) => {
    if (waterAnswered) return;
    setWaterSelected(idx);
    setWaterAnswered(true);
    const curr = waterCards[waterIndex];
    if (idx === curr.correctIndex) {
      sounds.playCoin();
    } else {
      sounds.playClick();
    }
  };

  const handleNextWater = () => {
    if (waterIndex + 1 < waterCards.length) {
      setWaterIndex(waterIndex + 1);
      setWaterAnswered(false);
      setWaterSelected(null);
    } else {
      // Complete Water Round!
      const res = completeAlmanacRound('water', 90, studentEmail);
      if (res.success) {
        sounds.playFanfare();
        confetti({ particleCount: 30, spread: 60 });
        if (onAlmanacUpdated) onAlmanacUpdated(res.state);
        setActiveTab('sunlight');
      }
    }
  };

  const handleSunlightAnswer = (idx) => {
    if (sunlightAnswered) return;
    setSunlightSelected(idx);
    setSunlightAnswered(true);
    if (idx === sunlightClip.correctIndex) {
      sounds.playCoin();
      const res = completeAlmanacRound('sunlight', 90, studentEmail);
      if (res.success && onAlmanacUpdated) onAlmanacUpdated(res.state);
    }
  };

  const handleNextSeed = () => {
    if (seedStep + 1 < newSeeds.length) {
      setSeedStep(seedStep + 1);
      sounds.playClick();
    } else {
      // Complete Seed Round!
      const res = completeAlmanacRound('seed', 95, studentEmail);
      if (res.success) {
        sounds.playFanfare();
        if (onAlmanacUpdated) onAlmanacUpdated(res.state);
        setActiveTab('fertilizer');
      }
    }
  };

  const handleFertilizerSubmit = (e) => {
    e.preventDefault();
    if (!fertilizerInput.trim() || fertilizerInput.trim().length < 15) {
      alert('Vui lòng viết một câu tiếng Anh hoàn chỉnh (ít nhất 5-6 từ)!');
      return;
    }
    setFertilizerSubmitted(true);
    sounds.playBloomBonus();
    confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } });
    const res = completeAlmanacRound('fertilizer', 95, studentEmail);
    if (res.success && onAlmanacUpdated) {
      onAlmanacUpdated(res.state);
    }
  };

  const isWaterDone = almanacState?.waterRoundDone;
  const isSunlightDone = almanacState?.sunlightRoundDone;
  const isSeedDone = almanacState?.seedRoundDone;
  const isFertilizerDone = almanacState?.fertilizerRoundDone;
  const isAllDone = isWaterDone && isSunlightDone && isSeedDone && isFertilizerDone;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-3xl max-h-[92vh] flex flex-col pixel-parchment rounded-xl overflow-hidden shadow-2xl relative font-sans text-[#2D1A0D]"
        onClick={e => e.stopPropagation()}
      >
        {/* Almanac Leather Book Header */}
        <div className="bg-[#3B2314] text-[#FFE8B8] px-4 sm:px-6 py-3 border-b-4 border-[#1E0F07] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#5D3A1F] border-2 border-[#8D5B32] flex items-center justify-center text-xl shadow-inner">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-pixel text-base sm:text-lg font-bold text-amber-200 tracking-wide">
                  MORNING ALMANAC • CUỐN NIÊN GIÁM NÔNG TRẠI
                </h2>
                {isAllDone && (
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-pixel text-[10px] tracking-wider animate-pulse">
                    BLOOM BONUS X1.5
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-100/70">
                Cánh Cổng Học Tập Hàng Ngày — Nguồn Năng Lượng Duy Nhất Tạo Ra Focus Points (FP)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#24130A] text-amber-200 hover:text-white border border-[#5D3A1F] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Study Gate Rounds Progress Tabs */}
        <div className="bg-[#DFC99F] px-3 sm:px-6 py-2.5 border-b-2 border-[#A88C5E] flex items-center gap-2 overflow-x-auto">
          {/* Round 1: Water Round */}
          <button
            onClick={() => setActiveTab('water')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-pixel text-xs border-2 transition cursor-pointer shrink-0 ${
              activeTab === 'water'
                ? 'bg-[#3B2314] text-amber-200 border-[#1E0F07] shadow'
                : isWaterDone
                ? 'bg-emerald-700 text-white border-emerald-900'
                : 'bg-[#CDB384] text-[#3B2314] border-[#9E8256]'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>1. Water Round</span>
            {isWaterDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 ml-1" />}
          </button>

          {/* Round 2: Sunlight Round */}
          <button
            onClick={() => setActiveTab('sunlight')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-pixel text-xs border-2 transition cursor-pointer shrink-0 ${
              activeTab === 'sunlight'
                ? 'bg-[#3B2314] text-amber-200 border-[#1E0F07] shadow'
                : isSunlightDone
                ? 'bg-emerald-700 text-white border-emerald-900'
                : 'bg-[#CDB384] text-[#3B2314] border-[#9E8256]'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>2. Sunlight Round</span>
            {isSunlightDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 ml-1" />}
          </button>

          {/* Round 3: Seed Round */}
          <button
            onClick={() => setActiveTab('seed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-pixel text-xs border-2 transition cursor-pointer shrink-0 ${
              activeTab === 'seed'
                ? 'bg-[#3B2314] text-amber-200 border-[#1E0F07] shadow'
                : isSeedDone
                ? 'bg-emerald-700 text-white border-emerald-900'
                : 'bg-[#CDB384] text-[#3B2314] border-[#9E8256]'
            }`}
          >
            <span className="text-xs">🌱</span>
            <span>3. Seed Round</span>
            {isSeedDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 ml-1" />}
          </button>

          {/* Round 4: Fertilizer Round */}
          <button
            onClick={() => setActiveTab('fertilizer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-pixel text-xs border-2 transition cursor-pointer shrink-0 ${
              activeTab === 'fertilizer'
                ? 'bg-[#3B2314] text-amber-200 border-[#1E0F07] shadow'
                : isFertilizerDone
                ? 'bg-emerald-700 text-white border-emerald-900'
                : 'bg-[#CDB384] text-[#3B2314] border-[#9E8256]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>4. Fertilizer Round</span>
            {isFertilizerDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 ml-1" />}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Minimum Viable Day Gating Rule Notification */}
          <div className="bg-[#EFE2C6] border-2 border-[#CBB385] p-3 rounded-lg flex items-center justify-between text-xs text-[#5D3A1F]">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-600 animate-bounce" />
              <span>
                <strong>Luật Cổng Học Tập:</strong> Chỉ cần hoàn thành <strong>Water Round (3 phút)</strong> là đạt <em>Mức Ngày Tối Thiểu</em> (+50% FP, giữ nguyên chuỗi Streak). Hoàn thành cả 4 vòng để nhận <strong>100% FP + Bloom Bonus</strong>!
              </span>
            </div>
          </div>

          {/* TAB 1: WATER ROUND (SRS RETRIEVAL) */}
          {activeTab === 'water' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-pixel text-sm font-bold text-[#3B2314]">
                    💧 VÒNG 1: TƯỚI NƯỚC TRI THỨC (RETRIEVAL PRACTICE)
                  </h3>
                  <p className="text-xs text-[#6B4B29]">
                    Gợi nhớ từ vựng định kỳ SRS để rễ cây đâm sâu vào đất. Câu hỏi {waterIndex + 1}/{waterCards.length}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#DFC99F] font-pixel text-xs text-[#3B2314]">
                  +50 FP (Cổng Tối Thiểu)
                </span>
              </div>

              {/* Flashcard Question Card */}
              <div className="p-4 rounded-xl bg-white border-2 border-[#D4C3A3] shadow-inner space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-lg font-bold text-[#1B4D27]">
                    {waterCards[waterIndex].word}
                  </span>
                  <span className="font-mono text-xs text-[#7A5A35]">
                    {waterCards[waterIndex].ipa}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-xs text-amber-950 italic">
                  "{waterCards[waterIndex].context}"
                </div>

                <div className="font-semibold text-xs text-[#3B2314] pt-1">
                  {waterCards[waterIndex].prompt}
                </div>

                <div className="grid grid-cols-1 gap-2 pt-2">
                  {waterCards[waterIndex].options.map((opt, idx) => {
                    let btnStyle = 'bg-[#FAF6EC] hover:bg-[#F3ECD9] border-[#D4C3A3] text-[#3B2314]';
                    if (waterAnswered) {
                      if (idx === waterCards[waterIndex].correctIndex) {
                        btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                      } else if (idx === waterSelected) {
                        btnStyle = 'bg-rose-100 border-rose-500 text-rose-950 line-through';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleWaterAnswer(idx)}
                        disabled={waterAnswered}
                        className={`w-full text-left p-3 rounded-lg border-2 text-xs transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {waterAnswered && idx === waterCards[waterIndex].correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {waterAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextWater}
                    className="pixel-btn pixel-btn-green font-pixel text-xs py-2.5 px-4 flex items-center gap-1.5"
                  >
                    <span>{waterIndex + 1 < waterCards.length ? 'Câu Tiếp Theo' : 'Hoàn Thành Water Round & Mở Khóa FP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SUNLIGHT ROUND (LISTENING) */}
          {activeTab === 'sunlight' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-pixel text-sm font-bold text-[#3B2314]">
                    ☀️ VÒNG 2: ÁNH NẮNG QUANG HỢP (SHORT LISTENING COMPREHENSION)
                  </h3>
                  <p className="text-xs text-[#6B4B29]">
                    Lắng nghe ngữ cảnh học thuật và bắt từ khóa chính xác
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#DFC99F] font-pixel text-xs text-[#3B2314]">
                  +20 FP
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border-2 border-[#D4C3A3] shadow-inner space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#A67C52]">
                  <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>{sunlightClip.title} — {sunlightClip.speaker}</span>
                </div>

                <div className="p-3 rounded-lg bg-[#FAF6EC] border border-[#D4C3A3] text-xs text-[#3B2314] leading-relaxed font-serif">
                  {sunlightClip.transcript}
                </div>

                <div className="font-semibold text-xs text-[#3B2314] pt-2">
                  {sunlightClip.question}
                </div>

                <div className="space-y-2 pt-1">
                  {sunlightClip.options.map((opt, idx) => {
                    let btnStyle = 'bg-[#FAF6EC] hover:bg-[#F3ECD9] border-[#D4C3A3] text-[#3B2314]';
                    if (sunlightAnswered) {
                      if (idx === sunlightClip.correctIndex) {
                        btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                      } else if (idx === sunlightSelected) {
                        btnStyle = 'bg-rose-100 border-rose-500 text-rose-950 line-through';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSunlightAnswer(idx)}
                        disabled={sunlightAnswered}
                        className={`w-full text-left p-3 rounded-lg border-2 text-xs transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {sunlightAnswered && idx === sunlightClip.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {sunlightAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveTab('seed')}
                    className="pixel-btn pixel-btn-green font-pixel text-xs py-2 px-4 flex items-center gap-1.5"
                  >
                    <span>Sang Vòng 3: Seed Round</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SEED ROUND (VOCAB INTAKE) */}
          {activeTab === 'seed' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-pixel text-sm font-bold text-[#3B2314]">
                    🌱 VÒNG 3: NẠP HẠT GIỐNG MỚI (VOCABULARY INTAKE)
                  </h3>
                  <p className="text-xs text-[#6B4B29]">
                    Tiếp thu 3 từ vựng học thuật trong ngữ cảnh tự nhiên ({seedStep + 1}/3)
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#DFC99F] font-pixel text-xs text-[#3B2314]">
                  +20 FP + Hạt Giống
                </span>
              </div>

              <div className="p-5 rounded-xl bg-white border-2 border-[#D4C3A3] shadow-inner space-y-3">
                <div className="flex items-center justify-between border-b border-[#EFE2C6] pb-2">
                  <div>
                    <h4 className="font-pixel text-xl font-bold text-[#2E7D32]">
                      {newSeeds[seedStep].word}
                    </h4>
                    <span className="font-mono text-xs text-[#7A5A35]">
                      {newSeeds[seedStep].ipa}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-pixel text-xs border border-emerald-200">
                    Hạt Giống Cấp C1
                  </span>
                </div>

                <div className="text-sm font-bold text-[#3B2314]">
                  {newSeeds[seedStep].meaning}
                </div>

                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-1.5 text-xs text-amber-950">
                  <div className="font-bold flex items-center gap-1 text-[#8D5B32]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Collocation Thường Gặp:</span>
                  </div>
                  <div className="font-mono text-[11px] text-[#5D3A1F]">
                    {newSeeds[seedStep].collocation}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#FAF6EC] border border-[#D4C3A3] text-xs text-[#3B2314] leading-relaxed">
                  <strong>Ví dụ Task 2:</strong> "{newSeeds[seedStep].example}"
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextSeed}
                  className="pixel-btn pixel-btn-green font-pixel text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <span>{seedStep + 1 < newSeeds.length ? 'Xem Hạt Giống Tiếp Theo' : 'Hoàn Thành Seed Round & Nhận Hạt Giống'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: FERTILIZER ROUND (PRODUCTION) */}
          {activeTab === 'fertilizer' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-pixel text-sm font-bold text-[#3B2314]">
                    🧪 VÒNG 4: BÓN PHÂN ỨNG DỤNG (OUTPUT HYPOTHESIS)
                  </h3>
                  <p className="text-xs text-[#6B4B29]">
                    Ứng dụng từ mới vào câu viết thực tế để hoàn tất 100% Morning Almanac
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#DFC99F] font-pixel text-xs text-[#3B2314]">
                  +25 FP + Bloom Bonus
                </span>
              </div>

              <form onSubmit={handleFertilizerSubmit} className="space-y-3">
                <div className="p-4 rounded-xl bg-white border-2 border-[#D4C3A3] shadow-inner space-y-3">
                  <div className="text-xs text-[#3B2314] font-semibold leading-relaxed">
                    {fertilizerPrompt.instruction}
                  </div>

                  <div className="text-[11px] text-[#7A5A35] italic">
                    {fertilizerPrompt.hint}
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Viết câu tiếng Anh của bạn tại đây..."
                    value={fertilizerInput}
                    onChange={e => setFertilizerInput(e.target.value)}
                    disabled={fertilizerSubmitted}
                    className="w-full p-3 rounded-lg border-2 border-[#D4C3A3] bg-[#FAF8F5] text-xs text-[#2D1A0D] placeholder-[#A88C5E] focus:outline-none focus:border-[#2E7D32] resize-none"
                  />
                </div>

                {fertilizerSubmitted ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 space-y-2">
                    <div className="font-pixel text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>XUẤT SẮC! CÂU VIẾT ĐÃ ĐƯỢC CHẤM ĐẠT CHUẨN COHERENCE</span>
                    </div>
                    <p className="text-xs">
                      <strong>Câu mẫu Band 8.0:</strong> "{fertilizerPrompt.sampleSolution}"
                    </p>
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={onClose}
                        className="pixel-btn pixel-btn-gold font-pixel text-xs py-2 px-4"
                      >
                        Trở Về Nông Trại Chăm Bón
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="pixel-btn pixel-btn-gold font-pixel text-xs py-2.5 px-5 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Nộp Câu & Nhận BLOOM BONUS!</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
