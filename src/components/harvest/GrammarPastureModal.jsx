import React, { useState } from 'react';
import { X, Heart, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { sounds } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { LIVESTOCK_CONFIG, careForLivestock } from '../../services/harvestTownService';

export default function GrammarPastureModal({
  isOpen,
  onClose,
  livestockState,
  onCareCompleted,
  studentEmail
}) {
  const [selectedAnimalKey, setSelectedAnimalKey] = useState('chickens');
  
  // Active Challenge State
  const [isSolving, setIsSolving] = useState(false);
  const [solvedSuccess, setSolvedSuccess] = useState(false);

  // 1. Chickens Task: Word Tile Arranging (SVO)
  const chickenTask = {
    prompt: 'Nhặt trứng vàng: Sắp xếp các mảnh từ thành một câu học thuật hoàn chỉnh (Subject + Verb + Object + Adverbial):',
    targetSentence: 'Technological innovations have significantly transformed modern healthcare systems.',
    tiles: ['modern healthcare systems.', 'Technological innovations', 'have significantly transformed'],
    correctOrder: [1, 2, 0]
  };
  const [selectedTileIndices, setSelectedTileIndices] = useState([]);

  // 2. Cows Task: Tense Timeline
  const cowTask = {
    prompt: 'Vắt sữa dòng thời gian: Chọn thì thích hợp để hoàn thiện câu mô tả xu hướng kéo dài từ quá khứ đến hiện tại:',
    sentence: 'Over the past decade, renewable energy sources ________ dramatically worldwide.',
    options: [
      'have expanded (Hiện tại hoàn thành — Tiếp diễn hệ quả đến nay)',
      'expanded (Quá khứ đơn — Đã chấm dứt trong quá khứ)',
      'expand (Hiện tại đơn — Sự thật hiển nhiên)'
    ],
    correctIndex: 0
  };
  const [cowSelected, setCowSelected] = useState(null);

  // 3. Sheep Task: Articles a / an / the / zero
  const sheepTask = {
    prompt: 'Xén lông cừu mạo từ: Phân loại danh từ sau vào chuồng mạo từ chính xác trong câu: "____ European Union has implemented new policies."',
    options: ['The (Xác định)', 'An (Bắt đầu bằng nguyên âm E)', 'A (Phát âm /jʊə.rəˈpiː.ən/ là phụ âm)', 'Zero article (Không mạo từ)'],
    correctIndex: 0
  };
  const [sheepSelected, setSheepSelected] = useState(null);

  // 4. Bees Task: Conjunctions & Linking Words
  const beeTask = {
    prompt: 'Làm mật ong liên kết: Chọn liên từ tương phản C1 để nối 2 ý: "[____] online education offers great flexibility, it may lack spontaneous face-to-face interaction."',
    options: ['While / Whereas', 'However', 'Therefore', 'Because'],
    correctIndex: 0
  };
  const [beeSelected, setBeeSelected] = useState(null);

  if (!isOpen) return null;

  const currentConf = LIVESTOCK_CONFIG[selectedAnimalKey] || LIVESTOCK_CONFIG.chickens;
  const currentAnimalState = livestockState?.[selectedAnimalKey] || { happiness: 80, ready: true };

  const handleTileClick = (idx) => {
    if (selectedTileIndices.includes(idx)) {
      setSelectedTileIndices(selectedTileIndices.filter(i => i !== idx));
    } else {
      setSelectedTileIndices([...selectedTileIndices, idx]);
    }
  };

  const handleCheckChicken = () => {
    if (selectedTileIndices.length !== chickenTask.tiles.length) return;
    const isCorrect = selectedTileIndices.every((val, i) => val === chickenTask.correctOrder[i]);
    if (isCorrect) {
      completeAnimalSuccess();
    } else {
      sounds.playClick();
      alert('Thứ tự câu chưa chuẩn cú pháp SVO, hãy thử lại nhé!');
      setSelectedTileIndices([]);
    }
  };

  const handleSelectCow = (idx) => {
    setCowSelected(idx);
    if (idx === cowTask.correctIndex) {
      completeAnimalSuccess();
    } else {
      sounds.playClick();
    }
  };

  const handleSelectSheep = (idx) => {
    setSheepSelected(idx);
    if (idx === sheepTask.correctIndex) {
      completeAnimalSuccess();
    } else {
      sounds.playClick();
    }
  };

  const handleSelectBee = (idx) => {
    setBeeSelected(idx);
    if (idx === beeTask.correctIndex) {
      completeAnimalSuccess();
    } else {
      sounds.playClick();
    }
  };

  const completeAnimalSuccess = () => {
    sounds.playAnimalCare();
    confetti({ particleCount: 40, spread: 70 });
    setSolvedSuccess(true);
    const res = careForLivestock(selectedAnimalKey, 95, studentEmail);
    if (res.success && onCareCompleted) {
      onCareCompleted(res.state);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-3xl max-h-[92vh] flex flex-col pixel-panel rounded-xl overflow-hidden shadow-2xl relative font-sans"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#2D1A0D] text-[#FFE8B8] px-4 sm:px-6 py-3 border-b-4 border-[#140804] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏡</span>
            <div>
              <h2 className="font-pixel text-base sm:text-lg font-bold text-amber-200">
                GRAMMAR LIVESTOCK • CHUỒNG VẬT NUÔI NGỮ PHÁP
              </h2>
              <p className="text-xs text-amber-100/70">
                "Từ vựng là khu vườn. Ngữ pháp là bầy vật nuôi cần được chăm sóc hàng ngày."
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#140804] text-amber-200 hover:text-white border border-[#4A2B11] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Animal Selector Shelf */}
        <div className="bg-[#24130A] px-3 sm:px-6 py-2.5 border-b-2 border-[#3D2312] flex items-center gap-2 overflow-x-auto">
          {Object.keys(LIVESTOCK_CONFIG).map(key => {
            const a = LIVESTOCK_CONFIG[key];
            const aState = livestockState?.[key] || { happiness: 75, ready: true };
            const isSelected = selectedAnimalKey === key;

            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedAnimalKey(key);
                  setIsSolving(false);
                  setSolvedSuccess(false);
                  setSelectedTileIndices([]);
                  setCowSelected(null);
                  setSheepSelected(null);
                  setBeeSelected(null);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-pixel text-xs border-2 transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#8D5B32] text-amber-100 border-amber-400 shadow-md'
                    : 'bg-[#3B2314] text-stone-300 border-[#1E0F07] hover:border-[#8D5B32]'
                }`}
              >
                <span className="text-xl">{a.icon}</span>
                <div className="text-left">
                  <div className="font-bold">{a.name}</div>
                  <div className="text-[10px] text-amber-300 flex items-center gap-1 font-sans">
                    <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
                    <span>{aState.happiness}% Vui vẻ</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Animal Care Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-[#2D1B13] text-[#FFE8B8]">
          
          {/* Animal Profile Banner */}
          <div className="p-4 rounded-xl bg-[#3E2723] border-2 border-[#5D4037] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#5D4037] border-2 border-[#8D6E63] flex items-center justify-center text-3xl shadow-inner animate-bounce">
                {currentConf.icon}
              </div>
              <div>
                <h3 className="font-pixel text-base text-amber-200">{currentConf.name}</h3>
                <p className="text-xs text-stone-300">
                  Lĩnh vực: <strong className="text-amber-400">{currentConf.domain}</strong>
                </p>
                <p className="text-[11px] text-stone-400 italic">
                  Sản phẩm: {currentConf.productName} (Trị giá {currentConf.productPrice} Gold)
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className={`px-2.5 py-1 rounded font-pixel text-xs ${
                currentAnimalState.ready 
                  ? 'bg-amber-500 text-[#2D1A0D] animate-pulse' 
                  : 'bg-stone-700 text-stone-300'
              }`}>
                {currentAnimalState.ready ? '★ SẴN SÀNG CHĂM SÓC' : '✓ ĐÃ CHĂM HÔM NAY'}
              </span>
            </div>
          </div>

          {/* Grammar Challenge Card */}
          <div className="p-5 rounded-xl bg-[#4A2B11] border-2 border-[#6D421D] space-y-4 shadow-inner">
            <div className="font-pixel text-xs text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Thử Thách Chăm Bón: {currentConf.careAction}</span>
            </div>

            {/* CHICKENS: Word Tile Arranging */}
            {selectedAnimalKey === 'chickens' && (
              <div className="space-y-3">
                <p className="text-xs text-stone-200">{chickenTask.prompt}</p>

                {/* Selected result preview */}
                <div className="min-h-[44px] p-3 rounded-lg bg-[#24130A] border-2 border-[#5D3A1F] text-xs font-mono text-amber-200 flex items-center gap-2 flex-wrap">
                  {selectedTileIndices.length === 0 ? (
                    <span className="text-stone-500 italic">Nhấp vào các mảnh từ bên dưới để xếp câu...</span>
                  ) : (
                    selectedTileIndices.map(idx => (
                      <span key={idx} className="px-2 py-1 rounded bg-amber-700 text-white font-sans text-xs">
                        {chickenTask.tiles[idx]}
                      </span>
                    ))
                  )}
                </div>

                {/* Clickable Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {chickenTask.tiles.map((tile, idx) => {
                    const isPicked = selectedTileIndices.includes(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleTileClick(idx)}
                        disabled={solvedSuccess}
                        className={`p-2.5 rounded-lg border-2 text-xs font-sans text-left transition cursor-pointer ${
                          isPicked
                            ? 'bg-stone-800 text-stone-500 border-stone-900 opacity-60'
                            : 'bg-[#5D3A1F] hover:bg-[#7A4B27] text-white border-[#3B2314]'
                        }`}
                      >
                        {tile}
                      </button>
                    );
                  })}
                </div>

                {!solvedSuccess && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleCheckChicken}
                      disabled={selectedTileIndices.length !== chickenTask.tiles.length}
                      className="pixel-btn pixel-btn-gold font-pixel text-xs py-2 px-4"
                    >
                      Kiểm Tra Cú Pháp & Thu Hoạch Trứng
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* COWS: Tense Timeline */}
            {selectedAnimalKey === 'cows' && (
              <div className="space-y-3">
                <p className="text-xs text-stone-200">{cowTask.prompt}</p>
                <div className="p-3 rounded-lg bg-[#24130A] border border-[#5D3A1F] text-xs font-serif text-amber-200">
                  {cowTask.sentence}
                </div>
                <div className="space-y-2 pt-1">
                  {cowTask.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectCow(idx)}
                      disabled={solvedSuccess}
                      className={`w-full text-left p-3 rounded-lg border-2 text-xs transition cursor-pointer ${
                        cowSelected === idx
                          ? idx === cowTask.correctIndex
                            ? 'bg-emerald-900 border-emerald-500 text-emerald-200'
                            : 'bg-rose-950 border-rose-600 text-rose-300'
                          : 'bg-[#3B2314] hover:bg-[#5D3A1F] text-stone-200 border-[#24130A]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SHEEP: Articles a/an/the */}
            {selectedAnimalKey === 'sheep' && (
              <div className="space-y-3">
                <p className="text-xs text-stone-200">{sheepTask.prompt}</p>
                <div className="space-y-2 pt-1">
                  {sheepTask.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSheep(idx)}
                      disabled={solvedSuccess}
                      className={`w-full text-left p-3 rounded-lg border-2 text-xs transition cursor-pointer ${
                        sheepSelected === idx
                          ? idx === sheepTask.correctIndex
                            ? 'bg-emerald-900 border-emerald-500 text-emerald-200'
                            : 'bg-rose-950 border-rose-600 text-rose-300'
                          : 'bg-[#3B2314] hover:bg-[#5D3A1F] text-stone-200 border-[#24130A]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* BEES: Conjunctions */}
            {selectedAnimalKey === 'bees' && (
              <div className="space-y-3">
                <p className="text-xs text-stone-200">{beeTask.prompt}</p>
                <div className="space-y-2 pt-1">
                  {beeTask.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectBee(idx)}
                      disabled={solvedSuccess}
                      className={`w-full text-left p-3 rounded-lg border-2 text-xs transition cursor-pointer ${
                        beeSelected === idx
                          ? idx === beeTask.correctIndex
                            ? 'bg-emerald-900 border-emerald-500 text-emerald-200'
                            : 'bg-rose-950 border-rose-600 text-rose-300'
                          : 'bg-[#3B2314] hover:bg-[#5D3A1F] text-stone-200 border-[#24130A]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Success Banner */}
            {solvedSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 space-y-2 animate-in fade-in">
                <div className="font-pixel text-xs font-bold flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>CHĂM BÓN HOÀN TẤT! VẬT NUÔI RẤT HẠNH PHÚC</span>
                </div>
                <p className="text-xs text-stone-200">
                  Bạn nhận được <strong>1 {currentConf.productName}</strong> (giá trị {currentConf.productPrice} Gold) đã được chuyển vào Túi Đồ để xuất khẩu!
                </p>
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={onClose}
                    className="pixel-btn pixel-btn-gold font-pixel text-xs py-2 px-4"
                  >
                    Trở Về Nông Trại
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
