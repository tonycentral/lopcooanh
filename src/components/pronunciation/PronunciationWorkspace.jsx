// src/components/pronunciation/PronunciationWorkspace.jsx
import React, { useState } from 'react';
import { 
  Volume2, 
  Sparkles, 
  Mic, 
  Play, 
  RotateCcw, 
  BookOpen, 
  Headphones, 
  Layers, 
  CheckCircle2, 
  Award,
  Zap
} from 'lucide-react';
import { IPA_CHART_DATA, PRONUNCIATION_PILLARS } from '../../data/pronunciationData';

export default function PronunciationWorkspace() {
  const [activeTab, setActiveTab] = useState('ipa'); // 'ipa' | 'stress' | 'connected' | 'shadowing'
  const [selectedIpaSound, setSelectedIpaSound] = useState(IPA_CHART_DATA.monophthongs[0]);

  // Pronunciation audio synthesis helper
  const playSound = (wordOrText) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanWord = wordOrText.split('/')[0].trim();
      const utterance = new SpeechSynthesisUtterance(cleanWord);
      utterance.lang = 'en-GB'; // Standard British English
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#F8F6F1] text-[#24211E] overflow-hidden select-none">
      
      {/* Top Banner */}
      <div className="bg-white border-b border-[#E6E2D8] px-4 sm:px-6 py-3 shrink-0 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] flex items-center justify-center font-bold text-sm shadow-2xs">
            <Headphones className="w-5 h-5 text-[#3E4F42]" />
          </div>
          <div>
            <h1 className="font-title font-bold text-base sm:text-lg text-[#24211E] leading-tight">
              Luyện Phát Âm &amp; Ngữ Điệu (IELTS Pronunciation &amp; Phonics)
            </h1>
            <p className="text-xs text-[#7A7369] mt-0.5">
              Bảng phiên âm quốc tế 44 âm IPA, trọng âm, nối âm tự nhiên và bài tập Shadowing
            </p>
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center p-1 rounded-xl bg-[#F4EFEA] border border-[#E6E2D8] text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('ipa')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'ipa' ? "bg-[#3E4F42] text-white shadow-xs" : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            Bảng 44 Âm IPA
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stress')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'stress' ? "bg-[#3E4F42] text-white shadow-xs" : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            Trọng Âm Từ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('connected')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'connected' ? "bg-[#3E4F42] text-white shadow-xs" : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            Nối Âm (Connected)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shadowing')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'shadowing' ? "bg-[#3E4F42] text-white shadow-xs" : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            Luyện Shadowing
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-hidden">
        
        {/* TAB 1: BẢNG PHIÊN ÂM IPA */}
        {activeTab === 'ipa' && (
          <div className="h-full grid grid-cols-1 md:grid-cols-12 gap-3 overflow-hidden">
            
            {/* Interactive Soundboard (8 cols) */}
            <div className="md:col-span-8 h-full bg-white border border-[#E6E2D8] rounded-2xl p-4 flex flex-col overflow-hidden shadow-xs">
              <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 scrollbar-thin">
                
                {/* 1. Monophthongs (Nguyên âm đơn) */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#A67C52] uppercase tracking-wider flex items-center gap-1.5">
                    <span>1. Monophthongs (12 Nguyên âm đơn)</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {IPA_CHART_DATA.monophthongs.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedIpaSound(item);
                          playSound(item.example);
                        }}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          selectedIpaSound?.ipa === item.ipa 
                            ? "bg-[#3E4F42] text-white border-[#3E4F42] shadow-xs" 
                            : "bg-[#FAF8F5] hover:bg-[#EDF3EE] border-[#E6E2D8] text-[#24211E]"
                        }`}
                      >
                        <span className="font-serif font-black text-base">/{item.ipa}/</span>
                        <span className={`text-[10px] truncate max-w-full font-mono ${
                          selectedIpaSound?.ipa === item.ipa ? "text-gray-200" : "text-[#7A7369]"
                        }`}>
                          {item.example.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Diphthongs (Nguyên âm đôi) */}
                <div className="space-y-2 pt-2 border-t border-[#F4EFEA]">
                  <div className="text-xs font-bold text-[#A67C52] uppercase tracking-wider">
                    2. Diphthongs (8 Nguyên âm đôi)
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {IPA_CHART_DATA.diphthongs.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedIpaSound(item);
                          playSound(item.example);
                        }}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          selectedIpaSound?.ipa === item.ipa 
                            ? "bg-[#3E4F42] text-white border-[#3E4F42] shadow-xs" 
                            : "bg-[#FAF8F5] hover:bg-[#EDF3EE] border-[#E6E2D8] text-[#24211E]"
                        }`}
                      >
                        <span className="font-serif font-black text-base">/{item.ipa}/</span>
                        <span className={`text-[10px] truncate max-w-full font-mono ${
                          selectedIpaSound?.ipa === item.ipa ? "text-gray-200" : "text-[#7A7369]"
                        }`}>
                          {item.example.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Consonants (Phụ âm) */}
                <div className="space-y-2 pt-2 border-t border-[#F4EFEA]">
                  <div className="text-xs font-bold text-[#3E4F42] uppercase tracking-wider">
                    3. Consonants (24 Phụ âm vô thanh &amp; hữu thanh)
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {IPA_CHART_DATA.consonants.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedIpaSound(item);
                          playSound(item.example);
                        }}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          selectedIpaSound?.ipa === item.ipa 
                            ? "bg-[#3E4F42] text-white border-[#3E4F42] shadow-xs" 
                            : "bg-[#FAF8F5] hover:bg-[#EDF3EE] border-[#E6E2D8] text-[#24211E]"
                        }`}
                      >
                        <span className="font-serif font-black text-base">/{item.ipa}/</span>
                        <span className={`text-[10px] truncate max-w-full font-mono ${
                          selectedIpaSound?.ipa === item.ipa ? "text-gray-200" : "text-[#7A7369]"
                        }`}>
                          {item.example.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Sound Detail & Mouth Guide (4 cols) */}
            <div className="md:col-span-4 h-full bg-white border border-[#E6E2D8] rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-xs">
              {selectedIpaSound ? (
                <div className="space-y-4">
                  <div className="text-center p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-2">
                    <span className="text-4xl font-serif font-black text-[#3E4F42]">
                      /{selectedIpaSound.ipa}/
                    </span>
                    <div className="text-xs font-bold text-[#24211E]">
                      Từ ví dụ: <span className="font-mono text-[#A67C52]">{selectedIpaSound.example}</span>
                    </div>
                    {selectedIpaSound.type && (
                      <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3]">
                        {selectedIpaSound.type}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#A67C52] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Hướng dẫn đặt khẩu hình miệng:</span>
                    </h4>
                    <p className="text-xs text-[#24211E] leading-relaxed bg-[#FAF8F5] p-3 rounded-xl border border-[#E6E2D8]">
                      {selectedIpaSound.tip}
                    </p>
                  </div>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => selectedIpaSound && playSound(selectedIpaSound.example)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs mt-3"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe phát âm chuẩn bản xứ</span>
              </button>
            </div>

          </div>
        )}

        {/* TAB 2 & 3: TRỌNG ÂM & NỐI ÂM */}
        {(activeTab === 'stress' || activeTab === 'connected') && (
          <div className="h-full bg-white border border-[#E6E2D8] rounded-2xl p-4 overflow-y-auto scrollbar-thin space-y-4">
            {PRONUNCIATION_PILLARS.filter(p => activeTab === 'stress' ? p.id === 'stress' : p.id === 'connected_speech').map((pillar) => (
              <div key={pillar.id} className="space-y-3">
                <div>
                  <h3 className="text-base font-bold text-[#24211E]">{pillar.title}</h3>
                  <p className="text-xs text-[#7A7369] mt-0.5">{pillar.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pillar.rules.map((r, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-2.5">
                      <div className="font-bold text-xs text-[#3E4F42]">{r.name}</div>
                      <p className="text-xs text-[#7A7369] leading-relaxed">{r.explanation || r.formula}</p>
                      
                      <div className="space-y-1.5 pt-1 border-t border-[#F4EFEA]">
                        {r.examples.map((ex, eIdx) => (
                          <div key={eIdx} className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E6E2D8] text-xs">
                            <div>
                              <span className="font-bold text-[#24211E]">{ex.word || ex.text}</span>
                              <span className="font-mono text-[11px] text-[#A67C52] ml-2">{ex.ipa || ex.transcription}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => playSound(ex.word || ex.text)}
                              className="p-1 rounded-lg text-[#3E4F42] hover:bg-[#EDF3EE] transition cursor-pointer"
                              title="Nghe phát âm"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: LUYỆN SHADOWING */}
        {activeTab === 'shadowing' && (
          <div className="h-full bg-white border border-[#E6E2D8] rounded-2xl p-4 overflow-y-auto scrollbar-thin space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#24211E]">3. Bài tập Shadowing (Nói đuổi Band 8.0+)</h3>
              <p className="text-xs text-[#7A7369] mt-0.5">
                Bật audio, lắng nghe nhịp điệu và ngữ điệu rồi lập tức lặp lại đuổi theo giọng đọc bản xứ.
              </p>
            </div>

            <div className="space-y-3">
              {PRONUNCIATION_PILLARS.find(p => p.id === 'shadowing')?.passages?.map((pass) => (
                <div key={pass.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#24211E]">{pass.topic}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] font-bold">
                      {pass.level}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#24211E] font-serif leading-relaxed bg-white p-3.5 rounded-xl border border-[#E6E2D8]">
                    "{pass.script}"
                  </p>

                  <div className="text-[11px] text-[#7A7369] flex items-center justify-between gap-2 flex-wrap">
                    <span>💡 <strong>Điểm cần lưu ý:</strong> {pass.focusAreas}</span>
                    <button
                      type="button"
                      onClick={() => playSound(pass.script)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Nghe mẫu &amp; Luyện nói</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
