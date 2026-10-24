import React, { useState, useEffect } from 'react';
import { sounds } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { nurtureTopicEntity } from '../../services/harvestTownService';
import { 
  getSkillExercises, 
  playSpeechText, 
  stopSpeechText 
} from '../../services/harvestSkillPracticeService';

export default function AreaTopicPracticeModal({
  isOpen,
  onClose,
  entity,
  activeArea,
  studentEmail,
  onPracticeCompleted
}) {
  if (!isOpen || !entity) return null;

  const skillKey = activeArea?.skill || 'vocab';
  const topicKey = entity.topicId || 'environment';

  // Specific Curated Questions for this (Skill x Topic)
  const questionsList = getSkillExercises(skillKey, topicKey);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [rewardResult, setRewardResult] = useState(null);

  // Audio Speech state for Listening & Speaking & Vocab
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const currentQ = questionsList[currentIndex] || questionsList[0];

  // Stop any audio when question changes or modal unmounts
  useEffect(() => {
    return () => {
      stopSpeechText();
    };
  }, [currentIndex, isOpen]);

  const handlePlayAudio = (textToSpeak, lang = 'en-GB') => {
    if (isPlayingAudio) {
      stopSpeechText();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const utter = playSpeechText(textToSpeak, lang);
      if (utter) {
        utter.onend = () => setIsPlayingAudio(false);
        utter.onerror = () => setIsPlayingAudio(false);
      }
    }
  };

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const correct = idx === currentQ.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      sounds.playSuccess();
      setCorrectCount(prev => prev + 1);
    } else {
      sounds.playFailure();
    }
  };

  const handleNextQuestion = () => {
    stopSpeechText();
    setIsPlayingAudio(false);
    setShowTranscript(false);

    if (currentIndex + 1 < questionsList.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      // Completed all questions in the bank
      const finalScore = Math.round(((correctCount + (isCorrect ? 1 : 0)) / questionsList.length) * 100);
      const score = Math.max(75, finalScore);
      
      const res = nurtureTopicEntity(entity.areaId, entity.topicId, score, studentEmail);
      setRewardResult(res);
      setIsFinished(true);

      sounds.playFanfare();
      confetti({
        particleCount: 90,
        spread: 65,
        origin: { y: 0.6 }
      });

      if (onPracticeCompleted) {
        onPracticeCompleted(res);
      }
    }
  };

  const handleClose = () => {
    stopSpeechText();
    setIsPlayingAudio(false);
    setShowTranscript(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setCorrectCount(0);
    setIsFinished(false);
    setRewardResult(null);
    onClose();
  };

  // Skill-specific badges
  const skillTitles = {
    vocab: { title: '🌾 BÀI TẬP TỪ VỰNG HỌC THUẬT (BAND 7.5 - 8.5+)', color: '#4b692f' },
    reading: { title: '🌳 BÀI TẬP ĐỌC HIỂU HỌC THUẬT (CAMBRIDGE READING)', color: '#8f563b' },
    listening: { title: '🐮 BÀI TẬP NGHE HIỂU & BẪY DISTRACTOR (IELTS LISTENING)', color: '#663931' },
    speaking: { title: '🐟 BÀI TẬP PHẢN XẠ NÓI & PHÁT ÂM (IELTS SPEAKING 8.5)', color: '#243b35' },
    writing: { title: '🏡 BÀI TẬP NÂNG CẤP CÂU & LIÊN KẾT (IELTS WRITING T1/T2)', color: '#45283c' },
    math: { title: '⚙️ BÀI TẬP TOÁN TƯ DUY & LOGIC SUY LUẬN', color: '#d9911e' },
    grammar: { title: '📜 BÀI TẬP NGỮ PHÁP CHUYÊN SÂU & ĐẢO NGỮ (BAND 8.0+)', color: '#663931' }
  };
  const currentSkillBadge = skillTitles[skillKey] || skillTitles.vocab;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in font-pixel select-none">
      <div 
        className="rpg-panel-paper max-w-xl w-full flex flex-col max-h-[92vh] overflow-hidden"
        style={{
          boxShadow: 'inset -4px -4px 0 #d7b594, inset 4px 4px 0 #f6e6cd, 0 8px 0 #2c1b18'
        }}
      >
        
        {/* Header Bar (Wood Frame) */}
        <div className="bg-[#663931] text-[#e8cfa6] px-3 py-2 border-b-4 border-[#45283c] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {/* Standardized 48x48px Slot */}
            <div className="pixel-slot-48 shrink-0">
              <span className="text-xl">{entity.topicIcon || '🌱'}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-bold text-[#e8cfa6]">
                  {entity.name}
                </span>
                <span className="px-1 py-0.5 border-2 border-[#45283c] bg-[#45283c] text-[#e8cfa6] text-[7px] font-bold">
                  CẤP {entity.level}/5
                </span>
              </div>
              <p className="text-[8px] text-[#d7b594] mt-0.5">
                {activeArea?.name} • KỸ NĂNG {activeArea?.skillName.toUpperCase()}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rpg-btn-wood-dark p-1 text-[8px] cursor-pointer"
            title="Đóng"
          >
            <i className="pixelart-icons-font-close text-sm"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-3">
          
          {/* =========================================================================
              SUCCESS REWARD SCREEN
              ========================================================================= */}
          {isFinished && rewardResult ? (
            <div className="text-center py-2 space-y-3 animate-fade-in">
              <div className="inline-block p-3 border-4 border-[#45283c] bg-[#4b692f] text-white animate-bounce shadow-md">
                <i className="pixelart-icons-font-check text-2xl"></i>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#2c1b18]">
                  {rewardResult.leveledUp ? '🎉 NÂNG CẤP THÀNH CÔNG!' : '🌿 CHĂM SÓC THÀNH CÔNG!'}
                </h3>
                <p className="text-[8px] sm:text-[9px] text-[#663931] mt-1 leading-relaxed">
                  {entity.name} đã được hấp thụ dinh dưỡng kỹ năng {activeArea?.skillName} và đạt trạng thái sung mãn!
                </p>
              </div>

              {/* Reward Cards (Strict 2 Currencies: Tiền 🪙 & Mana 🔮) */}
              <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
                <div className="border-4 border-[#45283c] bg-[#d7b594] p-2 flex flex-col items-center">
                  <i className="pixelart-icons-font-coins text-lg text-[#d9911e]"></i>
                  <span className="text-[10px] font-bold text-[#2c1b18] mt-0.5">+{rewardResult.goldGain || 35}</span>
                  <span className="text-[7px] text-[#663931] font-bold">TIỀN</span>
                </div>

                <div className="border-4 border-[#45283c] bg-[#d7b594] p-2 flex flex-col items-center">
                  <i className="pixelart-icons-font-zap text-lg text-[#663931]"></i>
                  <span className="text-[10px] font-bold text-[#2c1b18] mt-0.5">+{rewardResult.manaRestored || 25}</span>
                  <span className="text-[7px] text-[#663931] font-bold">MANA</span>
                </div>

                <div className="border-4 border-[#45283c] bg-[#d7b594] p-2 flex flex-col items-center">
                  <span className="text-lg">⭐</span>
                  <span className="text-[10px] font-bold text-[#2c1b18] mt-0.5">+{rewardResult.expGain || 40}</span>
                  <span className="text-[7px] text-[#663931] font-bold">EXP</span>
                </div>
              </div>

              {/* Status Update Banner */}
              <div className="p-2 border-2 border-[#45283c] bg-[#d7b594] text-left flex items-center gap-2">
                <div className="text-xl">🌱</div>
                <div className="text-[8px] text-[#2c1b18] leading-tight">
                  <div className="font-bold text-[#4b692f]">Trạng Thái: Khỏe Mạnh & Xanh Tốt</div>
                  <div className="text-[7.5px] text-[#663931] mt-0.5">Luyện tập kỹ năng đều đặn giúp nông trại phát triển và tích lũy phản xạ IELTS tự nhiên!</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="rpg-btn-gold w-full py-2.5 text-[9px] font-bold cursor-pointer"
              >
                TIẾP TỤC CANH TÁC MOCHIFARM
              </button>
            </div>
          ) : (
            /* =========================================================================
                ACTIVE SKILL PRACTICE VIEW
                ========================================================================= */
            <div className="space-y-3">
              
              {/* Skill Mode Banner */}
              <div 
                className="p-1.5 border-2 border-[#45283c] text-[7.5px] text-white font-bold text-center tracking-wide"
                style={{ backgroundColor: currentSkillBadge.color }}
              >
                {currentSkillBadge.title}
              </div>

              {/* Progress Tracker */}
              <div className="flex items-center justify-between text-[8px] text-[#663931] border-b-2 border-[#45283c] pb-1.5 font-bold">
                <span>CÂU {currentIndex + 1} / {questionsList.length}</span>
                <span className="flex items-center gap-1 text-[#4b692f]">
                  <i className="pixelart-icons-font-check text-xs"></i> ĐÚNG: {correctCount}
                </span>
              </div>

              {/* -----------------------------------------------------------------
                  1. SKILL: VOCABULARY (RUỘNG LÚA)
                  Flashcard headword + IPA + Audio TTS + Collocation
                  ----------------------------------------------------------------- */}
              {skillKey === 'vocab' && currentQ.word && (
                <div className="p-2.5 border-4 border-[#45283c] bg-[#d7b594] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm sm:text-base font-bold text-[#2c1b18]">{currentQ.word}</span>
                        <span className="text-[9px] text-[#663931] font-mono">{currentQ.ipa}</span>
                      </div>
                      <span className="text-[7px] uppercase font-bold text-[#8f563b]">{currentQ.partOfSpeech}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlayAudio(currentQ.word, 'en-GB')}
                      className="rpg-btn py-1 px-2 text-[8px] flex items-center gap-1 cursor-pointer"
                      title="Nghe phát âm chuẩn"
                    >
                      <span>🔊</span>
                      <span>PHÁT ÂM</span>
                    </button>
                  </div>

                  {currentQ.collocation && (
                    <div className="p-1.5 border-2 border-[#45283c] bg-[#e8cfa6] text-[8px] text-[#2c1b18] leading-tight font-sans">
                      <span className="font-bold text-[#8f563b] font-pixel text-[7px] mr-1">COLLOCATION:</span>
                      <span className="font-bold text-[#4b692f]">{currentQ.collocation}</span>
                    </div>
                  )}
                </div>
              )}

              {/* -----------------------------------------------------------------
                  2. SKILL: READING (VƯỜN CÂY)
                  Academic Cambridge Reading Passage + Evidence Locator
                  ----------------------------------------------------------------- */}
              {skillKey === 'reading' && currentQ.passage && (
                <div className="p-2.5 border-4 border-[#45283c] bg-[#d7b594] text-[#2c1b18] text-[8px] sm:text-[9px] leading-relaxed max-h-36 overflow-y-auto font-sans">
                  <div className="flex items-center gap-1 text-[#663931] font-bold mb-1.5 text-[8px] font-pixel">
                    <i className="pixelart-icons-font-book-open text-xs"></i>
                    <span>ĐOẠN TRÍCH HỌC THUẬT (ACADEMIC PASSAGE):</span>
                  </div>
                  <p className="leading-normal">{currentQ.passage}</p>
                </div>
              )}

              {/* -----------------------------------------------------------------
                  3. SKILL: LISTENING (CHĂN NUÔI)
                  Audio Player with Web Speech TTS + Sound Waveform + Transcript
                  ----------------------------------------------------------------- */}
              {skillKey === 'listening' && currentQ.audioText && (
                <div className="p-2.5 border-4 border-[#45283c] bg-[#d7b594] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(currentQ.audioText, 'en-GB')}
                        className={`rpg-btn py-1.5 px-3 text-[8px] flex items-center gap-1.5 cursor-pointer ${
                          isPlayingAudio ? 'rpg-btn-green' : 'rpg-btn-gold'
                        }`}
                      >
                        <span>{isPlayingAudio ? '⏹ DỪNG' : '▶ BẬT AUDIO BÀI GIẢNG'}</span>
                      </button>

                      {/* Sound Wave Visualizer */}
                      {isPlayingAudio && (
                        <div className="flex items-center gap-0.5 h-4">
                          <span className="w-1 bg-[#4b692f] h-4 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 bg-[#4b692f] h-2 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 bg-[#4b692f] h-3 animate-bounce" style={{ animationDelay: '300ms' }} />
                          <span className="w-1 bg-[#4b692f] h-4 animate-bounce" style={{ animationDelay: '450ms' }} />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowTranscript(s => !s)}
                      className="text-[7.5px] text-[#663931] underline font-bold cursor-pointer"
                    >
                      {showTranscript ? '[Ẩn Script]' : '[Hiện Script]'}
                    </button>
                  </div>

                  {showTranscript && (
                    <div className="p-2 border-2 border-[#45283c] bg-[#e8cfa6] text-[8px] text-[#2c1b18] leading-relaxed font-sans max-h-24 overflow-y-auto">
                      <span className="font-bold text-[#8f563b] font-pixel text-[7px] block mb-0.5">AUDIO SCRIPT:</span>
                      {currentQ.audioText}
                    </div>
                  )}
                </div>
              )}

              {/* -----------------------------------------------------------------
                  4. SKILL: SPEAKING (AO HỒ)
                  IELTS Cue Card + Model Native Speech Player
                  ----------------------------------------------------------------- */}
              {skillKey === 'speaking' && (
                <div className="p-2.5 border-4 border-[#45283c] bg-[#d7b594] space-y-2">
                  {currentQ.cueCard && (
                    <div className="p-2 border-2 border-[#45283c] bg-[#e8cfa6]">
                      <span className="text-[7px] text-[#8f563b] font-bold block">{currentQ.part || 'IELTS Speaking Question'}:</span>
                      <span className="text-[9px] font-bold text-[#2c1b18] font-sans">"{currentQ.cueCard}"</span>
                    </div>
                  )}

                  {currentQ.modelSpeech && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[7px] text-[#663931] font-bold">CÂU TRẢ LỜI MẪU (BAND 8.5 MODEL):</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(currentQ.modelSpeech, 'en-GB')}
                          className="rpg-btn py-1 px-2 text-[7.5px] flex items-center gap-1 cursor-pointer"
                        >
                          <span>🔊</span>
                          <span>{isPlayingAudio ? 'DỪNG' : 'NGHE MẪU'}</span>
                        </button>
                      </div>
                      <div className="p-2 border-2 border-[#45283c] bg-[#e8cfa6] text-[8px] text-[#2c1b18] leading-relaxed font-sans max-h-24 overflow-y-auto">
                        {currentQ.modelSpeech}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* -----------------------------------------------------------------
                  5. SKILL: WRITING (NHÀ KÍNH)
                  Task 1/2 Prompt + Band 5.5 Draft -> Band 8.0 Upgrade
                  ----------------------------------------------------------------- */}
              {skillKey === 'writing' && (
                <div className="p-2.5 border-4 border-[#45283c] bg-[#d7b594] space-y-2">
                  {currentQ.prompt && (
                    <div className="p-1.5 border-2 border-[#45283c] bg-[#e8cfa6]">
                      <span className="text-[7px] text-[#8f563b] font-bold block">{currentQ.taskType || 'IELTS Writing Task'}:</span>
                      <span className="text-[8.5px] font-bold text-[#2c1b18] font-sans">{currentQ.prompt}</span>
                    </div>
                  )}

                  {currentQ.originalDraft && (
                    <div className="p-1.5 border-2 border-[#45283c] bg-[#e8cfa6] text-[8px] text-[#663931] font-sans">
                      <span className="font-bold text-[#45283c] font-pixel text-[7px] block">CÂU GỐC (BAND 5.5 - 6.0 DRAFT):</span>
                      <span className="italic">{currentQ.originalDraft}</span>
                    </div>
                  )}
                </div>
              )}

              {/* -----------------------------------------------------------------
                  6. SKILL: MATH (XƯỞNG CƠ KHÍ)
                  Logic Thinking + Clue & Math Formula
                  ----------------------------------------------------------------- */}
              {skillKey === 'math' && (
                <div className="p-2.5 border-4 border-[#45283c] bg-[#d7b594] space-y-2">
                  {currentQ.topicCategory && (
                    <div className="flex items-center justify-between pb-1 border-b-2 border-[#8f563b]/30">
                      <span className="text-[7.5px] font-bold text-[#663931] uppercase">CHUYÊN ĐỀ LOGIC:</span>
                      <span className="text-[7.5px] font-bold text-[#d9911e] bg-[#45283c] px-1.5 py-0.5">{currentQ.topicCategory}</span>
                    </div>
                  )}

                  {currentQ.clue && (
                    <div className="p-2 border-2 border-[#45283c] bg-[#e8cfa6] text-[8.5px] text-[#2c1b18] font-sans">
                      <span className="text-[7px] text-[#8f563b] font-pixel font-bold block mb-0.5">DỮ KIỆN BÀI TOÁN:</span>
                      <span>{currentQ.clue}</span>
                    </div>
                  )}

                  {currentQ.mathFormula && (
                    <div className="p-1.5 border-2 border-[#45283c] bg-[#f6e6cd] text-[8px] text-[#45283c] font-sans flex items-center gap-1.5">
                      <span className="text-[9px]">⚙️</span>
                      <span className="font-bold font-mono">{currentQ.mathFormula}</span>
                    </div>
                  )}
                </div>
              )}

              {/* -----------------------------------------------------------------
                  7. SKILL: GRAMMAR (THƯ VIỆN CỔ)
                  Advanced Syntax Rules + Target Clause Breakdown
                  ----------------------------------------------------------------- */}
              {skillKey === 'grammar' && (
                <div className="p-2.5 border-4 border-[#45283c] bg-[#d7b594] space-y-2">
                  {currentQ.topicCategory && (
                    <div className="flex items-center justify-between pb-1 border-b-2 border-[#8f563b]/30">
                      <span className="text-[7.5px] font-bold text-[#663931] uppercase">CẤU TRÚC NGỮ PHÁP:</span>
                      <span className="text-[7.5px] font-bold text-[#e8cfa6] bg-[#45283c] px-1.5 py-0.5">{currentQ.topicCategory}</span>
                    </div>
                  )}

                  {currentQ.grammarRule && (
                    <div className="p-1.5 border-2 border-[#45283c] bg-[#e8cfa6] text-[8px] text-[#45283c] font-sans">
                      <span className="font-bold text-[#8f563b] font-pixel text-[7px] block mb-0.5">CÔNG THỨC CHUẨN XÁC:</span>
                      <span className="font-mono font-bold text-[#663931]">{currentQ.grammarRule}</span>
                    </div>
                  )}

                  {currentQ.targetClause && (
                    <div className="p-1.5 border-2 border-[#45283c] bg-[#f6e6cd] text-[8px] text-[#2c1b18] font-sans">
                      <span className="font-bold text-[#45283c] font-pixel text-[7px] block mb-0.5">Ý NGHĨA BIỂU ĐẠT:</span>
                      <span className="italic">"{currentQ.targetClause}"</span>
                    </div>
                  )}
                </div>
              )}

              {/* Question Prompt */}
              <div className="text-[9px] sm:text-[10px] font-bold text-[#2c1b18] leading-normal font-sans">
                {currentQ.question}
              </div>

              {/* Options List */}
              <div className="space-y-1.5 font-sans">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isAnswerCorrect = idx === currentQ.correctIndex;

                  let optionClass = 'rpg-btn-paper text-[#2c1b18]';
                  if (isAnswered) {
                    if (isAnswerCorrect) {
                      optionClass = 'rpg-btn-green text-white font-bold';
                    } else if (isSelected) {
                      optionClass = 'rpg-btn-wood-dark text-[#e8cfa6]';
                    } else {
                      optionClass = 'rpg-btn-paper opacity-50 cursor-not-allowed';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-2 border-4 border-[#45283c] text-left text-[9px] sm:text-[10px] transition flex items-center justify-between gap-2 cursor-pointer ${optionClass}`}
                    >
                      <span className="flex-1">{opt}</span>
                      {isAnswered && isAnswerCorrect && (
                        <i className="pixelart-icons-font-check text-sm text-[#ffffff] shrink-0"></i>
                      )}
                      {isAnswered && isSelected && !isAnswerCorrect && (
                        <i className="pixelart-icons-font-close text-sm text-[#e8cfa6] shrink-0"></i>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Step */}
              {isAnswered && (
                <div className="space-y-2 pt-1 animate-fade-in">
                  <div className={`p-2 border-2 border-[#45283c] text-[8px] sm:text-[9px] leading-relaxed font-sans ${
                    isCorrect 
                      ? 'bg-[#4b692f]/20 text-[#2c1b18]' 
                      : 'bg-[#663931]/20 text-[#2c1b18]'
                  }`}>
                    <div className="font-bold flex items-center gap-1 mb-0.5 font-pixel text-[8px]">
                      {isCorrect ? '✓ CHÍNH XÁC!' : '✕ CHƯA ĐÚNG!'}
                    </div>
                    <p>{currentQ.explanation}</p>
                    {currentQ.evidence && (
                      <p className="mt-1 text-[7.5px] text-[#4b692f] font-bold">
                        DẪN CHỨNG BÀI ĐỌC: {currentQ.evidence}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="rpg-btn-gold w-full py-2 text-[9px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>{currentIndex + 1 < questionsList.length ? 'CÂU KẾ TIẾP' : 'HOÀN TẤT & NHẬN THƯỞNG'}</span>
                    <i className="pixelart-icons-font-arrow-right text-xs"></i>
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
