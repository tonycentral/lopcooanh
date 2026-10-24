import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Droplets, 
  Award,
  Volume2,
  Check,
  Zap,
  TrendingUp,
  Flame
} from 'lucide-react';
import { sounds } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { nurtureTopicEntity } from '../../services/harvestTownService';
import AreaEntitySprite from './AreaEntitySprite';

// Rich Curated Question Bank per (Skill x Topic)
const PRACTICE_BANKS = {
  // 1. READING (VƯỜN CÂY)
  reading: {
    environment: [
      {
        id: 'rd_env_1',
        type: 'quiz',
        passage: "Polar bears are increasingly endangered due to shrinking Arctic sea ice, which they rely upon as hunting platforms for ringed seals. Without adequate sea ice coverage, bears are compelled to swim unprecedented distances, resulting in severe physical exhaustion and high cub mortality rates.",
        question: "According to the passage, why are polar bears forced to swim longer distances?",
        options: [
          "Because they need to escape warmer currents",
          "Because diminishing Arctic sea ice deprives them of hunting platforms",
          "Because ringed seals have migrated to deeper Atlantic waters",
          "Because human maritime activities have disrupted their dens"
        ],
        correctIndex: 1,
        explanation: "Passage state: 'Polar bears are increasingly endangered due to shrinking Arctic sea ice, which they rely upon as hunting platforms... Without adequate sea ice coverage, bears are compelled to swim unprecedented distances'."
      },
      {
        id: 'rd_env_2',
        type: 'quiz',
        passage: "Deforestation in tropical rainforests releases billions of tonnes of carbon dioxide annually, transforming crucial carbon sinks into active carbon emitters. Furthermore, soil erosion accelerates rapidly once the canopy is decimated.",
        question: "What is the primary consequence of tropical rainforest deforestation discussed?",
        options: [
          "It converts carbon absorption sinks into net greenhouse gas emitters",
          "It permanently cools regional terrestrial microclimates",
          "It enriches soil quality through organic decomposition",
          "It prevents solar radiation from penetrating the understory"
        ],
        correctIndex: 0,
        explanation: "Passage state: 'transforming crucial carbon sinks into active carbon emitters'."
      }
    ],
    technology: [
      {
        id: 'rd_tech_1',
        type: 'quiz',
        passage: "Deep learning algorithms, although remarkably adept at pattern recognition across immense datasets, frequently suffer from the 'black box' problem, where even the engineers who created them cannot trace the exact computational rationale behind their decisions.",
        question: "What constitutes the 'black box' problem in deep learning?",
        options: [
          "The hardware requires exorbitant electricity consumption",
          "The inner reasoning behind algorithmic decisions is opaque and difficult to trace",
          "Deep learning models cannot operate on structured databases",
          "The algorithms are strictly restricted to military defense applications"
        ],
        correctIndex: 1,
        explanation: "Passage notes: 'where even the engineers who created them cannot trace the exact computational rationale behind their decisions'."
      }
    ],
    education: [
      {
        id: 'rd_edu_1',
        type: 'quiz',
        passage: "Cognitive psychologists have long established that spaced repetition and active retrieval practice significantly outperform passive review methods such as re-reading textbooks or highlighting sentences.",
        question: "Which learning technique is identified as superior to passive highlighting?",
        options: [
          "Cramming the night before major examinations",
          "Spaced repetition coupled with active retrieval practice",
          "Memorizing phonetic symbols without context",
          "Transcribing lecture recordings word-for-word"
        ],
        correctIndex: 1,
        explanation: "Passage clearly affirms: 'spaced repetition and active retrieval practice significantly outperform passive review methods'."
      }
    ],
    default: [
      {
        id: 'rd_def_1',
        type: 'quiz',
        passage: "Academic discourse relies extensively on nuanced hedging devices (such as 'tends to', 'suggests', 'potentially') rather than absolute assertions, reflecting the complex and contingent nature of empirical findings.",
        question: "Why do academic authors frequently employ hedging devices?",
        options: [
          "To satisfy minimum word count requirements",
          "To reflect the contingent and nuanced nature of scholarly evidence",
          "To deliberately confuse lay readers",
          "To conceal methodological mistakes"
        ],
        correctIndex: 1,
        explanation: "Hedging allows researchers to make measured, accurate claims without over-generalizing."
      }
    ]
  },

  // 2. VOCABULARY (RUỘNG LÚA)
  vocab: {
    environment: [
      {
        id: 'vc_env_1',
        type: 'quiz',
        word: 'mitigate',
        ipa: '/ˈmɪt.ɪ.ɡeɪt/',
        partOfSpeech: 'verb',
        question: "Từ vựng học thuật 'mitigate' (Band 7.5+) có ý nghĩa tiếng Việt chính xác là gì?",
        options: [
          "Làm dịu bớt, giảm nhẹ mức độ nghiêm trọng hoặc tác hại",
          "Làm trầm trọng thêm và gia tăng xung đột",
          "Bảo tồn nguyên vẹn không cho thay đổi",
          "Kêu gọi đóng góp tài chính cho cộng đồng"
        ],
        correctIndex: 0,
        explanation: "'mitigate' = to make something less severe, harmful, or painful (e.g., mitigate environmental damage)."
      },
      {
        id: 'vc_env_2',
        type: 'quiz',
        word: 'biodiversity',
        ipa: '/ˌbaɪ.oʊ.daɪˈvɜːr.sə.ti/',
        partOfSpeech: 'noun',
        question: "Collocation nào sau đây thể hiện 'sự suy giảm đa dạng sinh học trầm trọng' chuẩn Band 8.0?",
        options: [
          "a catastrophic decline in biodiversity",
          "a quick drop of animal kinds",
          "a slow minus of living species",
          "a minor pause in environmental nature"
        ],
        correctIndex: 0,
        explanation: "'a catastrophic decline in biodiversity' là collocation học thuật đắt giá trong IELTS Writing & Speaking."
      }
    ],
    technology: [
      {
        id: 'vc_tech_1',
        type: 'quiz',
        word: 'ubiquitous',
        ipa: '/juːˈbɪk.wə.t̬əs/',
        partOfSpeech: 'adjective',
        question: "Từ 'ubiquitous' trong ngữ cảnh công nghệ mang nghĩa là gì?",
        options: [
          "Có mặt ở khắp mọi nơi, phổ biến rộng rãi",
          "Lỗi thời và không còn hữu dụng",
          "Đắt đỏ vượt quá khả năng chi trả của dân thường",
          "Bị cấm lưu hành vì vi phạm bản quyền"
        ],
        correctIndex: 0,
        explanation: "'ubiquitous' = present, appearing, or found everywhere (e.g., ubiquitous smartphones)."
      }
    ],
    default: [
      {
        id: 'vc_def_1',
        type: 'quiz',
        word: 'predominantly',
        ipa: '/prɪˈdɑː.mə.nənt.li/',
        partOfSpeech: 'adverb',
        question: "Từ 'predominantly' đồng nghĩa với từ/cụm từ nào sau đây?",
        options: [
          "mainly / mostly (chiếm phần lớn, chủ yếu)",
          "rarely / seldom (hiếm khi)",
          "accidentally (tình cờ)",
          "secretly (bí mật)"
        ],
        correctIndex: 0,
        explanation: "'predominantly' mang nghĩa chủ đạo, phần lớn (Band 7.5+ adverb)."
      }
    ]
  },

  // 3. WRITING (NHÀ KÍNH)
  writing: {
    environment: [
      {
        id: 'wr_env_1',
        type: 'quiz',
        question: "Trong Writing Task 2 về Môi trường, câu nào dưới đây thể hiện lập luận và từ vựng đạt tiêu chuẩn Band 8.0+ nhất?",
        options: [
          "Enacting stringent carbon taxation is an indispensable imperative to compel corporations to adopt clean manufacturing processes.",
          "Government should make companies pay tax so they will not make smoke anymore.",
          "Tax is good because when people have to pay money, they stop doing bad things to trees.",
          "Companies like making money so government must stop them with big fines and loud warnings."
        ],
        correctIndex: 0,
        explanation: "Câu A sử dụng các cấu trúc học thuật C1/C2: 'Enacting stringent carbon taxation' (Danh từ hóa), 'indispensable imperative', 'compel corporations to adopt'."
      }
    ],
    default: [
      {
        id: 'wr_def_1',
        type: 'quiz',
        question: "Từ nối (Cohesive Device) nào dưới đây diễn đạt quan hệ nhân quả học thuật nâng cấp từ 'So / Because of this'?",
        options: [
          "Consequently, / As a direct corollary,",
          "And also,",
          "Next thing,",
          "Because why not,"
        ],
        correctIndex: 0,
        explanation: "'Consequently' và 'As a direct corollary' là các linking words học thuật chuẩn xác cho bài luận IELTS Task 2."
      }
    ]
  },

  // 4. SPEAKING (AO HỒ)
  speaking: {
    environment: [
      {
        id: 'sp_env_1',
        type: 'quiz',
        question: "IELTS Speaking Part 3: 'What can individuals do to combat environmental degradation?' - Cụm thành ngữ/idiom tự nhiên nào phù hợp nhất?",
        options: [
          "do our bit / lead by example (đóng góp phần việc của mình / nêu gương)",
          "rain cats and dogs (mưa như trút)",
          "break a leg (chúc may mắn)",
          "piece of cake (dễ như ăn kẹo)"
        ],
        correctIndex: 0,
        explanation: "'do one's bit' là thành ngữ tự nhiên C1 trong Speaking: 'Everyone ought to do their bit by recycling and reducing single-use plastics'."
      }
    ],
    default: [
      {
        id: 'sp_def_1',
        type: 'quiz',
        question: "Kỹ thuật kéo dài câu trả lời (Elaboration) hiệu quả nhất trong Speaking Part 1 là gì?",
        options: [
          "Trả lời trực tiếp (Direct answer) + Đưa lý do (Reason) + Ví dụ cá nhân (Personal example)",
          "Chỉ trả lời đúng 'Yes' hoặc 'No' để tránh sai ngữ pháp",
          "Nói thật nhanh không ngắt nghỉ",
          "Học thuộc lòng bài mẫu 2 phút không cần nghe câu hỏi"
        ],
        correctIndex: 0,
        explanation: "Mô hình Answer + Reason + Example giúp câu trả lời lưu loát, tự nhiên và đạt điểm Lexical Resource & Fluency."
      }
    ]
  },

  // 5. LISTENING (CHĂN NUÔI)
  listening: {
    environment: [
      {
        id: 'ls_env_1',
        type: 'quiz',
        question: "Trong bài nghe Section 4 về bảo tồn động vật, khi người nói dùng cụm 'Contrary to popular belief...', thông tin tiếp theo thường là gì?",
        options: [
          "Một sự thật bất ngờ trái ngược với điều số đông hay nghĩ",
          "Một lời cảm ơn ban tổ chức",
          "Thông tin lặp lại quan điểm cũ",
          "Danh sách tài liệu tham khảo cuối bài"
        ],
        correctIndex: 0,
        explanation: "'Contrary to popular belief' là signpost quan trọng báo hiệu thông tin đối lập bất ngờ - thường là đáp án IELTS Listening Section 4."
      }
    ],
    default: [
      {
        id: 'ls_def_1',
        type: 'quiz',
        question: "Trong bài nghe IELTS Section 1 khi nghe đánh vần họ tên hoặc địa chỉ, số kép (ví dụ: 'double seven') biểu thị điều gì?",
        options: [
          "Hai chữ số 7 đứng liền nhau (77)",
          "Số 14 (7 x 2)",
          "Số 70",
          "Số 7 lặp lại 3 lần"
        ],
        correctIndex: 0,
        explanation: "Trong tiếng Anh Anh (British English), 'double 7' nghĩa là hai chữ số 7 liền nhau (77)."
      }
    ]
  }
};

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

  // Retrieve questions for this skill & topic
  const skillBank = PRACTICE_BANKS[skillKey] || PRACTICE_BANKS.vocab;
  const questionsList = skillBank[topicKey] || skillBank.default || PRACTICE_BANKS.vocab.default;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [rewardResult, setRewardResult] = useState(null);

  const currentQ = questionsList[currentIndex] || questionsList[0];

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
    if (currentIndex + 1 < questionsList.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      // Practice completed! Calculate score
      const finalScore = Math.round(((correctCount + (isCorrect ? 0 : 0)) / questionsList.length) * 100);
      const score = Math.max(70, finalScore); // Base passing score
      
      const res = nurtureTopicEntity(entity.areaId, entity.topicId, score, studentEmail);
      setRewardResult(res);
      setIsFinished(true);

      sounds.playFanfare();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      if (onPracticeCompleted) {
        onPracticeCompleted(res);
      }
    }
  };

  const handleClose = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setCorrectCount(0);
    setIsFinished(false);
    setRewardResult(null);
    onClose();
  };

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
          
          {/* SUCCESS SCREEN */}
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
                  {entity.name} đã được hấp thụ dinh dưỡng tri thức và phục hồi trạng thái xanh tốt!
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
                  <div className="text-[7.5px] text-[#663931] mt-0.5">Luyện tập đều đặn giúp cây không bị héo úa và sản sinh tài nguyên liên tục!</div>
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
            /* ACTIVE QUESTION VIEW */
            <div className="space-y-3">
              
              {/* Progress Tracker */}
              <div className="flex items-center justify-between text-[8px] text-[#663931] border-b-2 border-[#45283c] pb-1.5 font-bold">
                <span>CÂU {currentIndex + 1} / {questionsList.length}</span>
                <span className="flex items-center gap-1 text-[#4b692f]">
                  <i className="pixelart-icons-font-check text-xs"></i> ĐÚNG: {correctCount}
                </span>
              </div>

              {/* Reading Passage (if Reading skill) */}
              {currentQ.passage && (
                <div className="p-2.5 border-2 border-[#45283c] bg-[#d7b594] text-[#2c1b18] text-[8px] sm:text-[9px] leading-relaxed max-h-32 overflow-y-auto font-sans">
                  <div className="flex items-center gap-1 text-[#663931] font-bold mb-1 text-[8px] font-pixel">
                    <i className="pixelart-icons-font-book-open text-xs"></i> ĐOẠN TRÍCH (READING):
                  </div>
                  {currentQ.passage}
                </div>
              )}

              {/* Vocabulary Word Highlight (if Vocab skill) */}
              {currentQ.word && (
                <div className="p-2 border-2 border-[#45283c] bg-[#d7b594] flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs sm:text-sm font-bold text-[#2c1b18]">{currentQ.word}</span>
                      <span className="text-[9px] text-[#663931] font-mono">{currentQ.ipa}</span>
                    </div>
                    <span className="text-[7px] uppercase font-bold text-[#8f563b]">{currentQ.partOfSpeech}</span>
                  </div>
                  <div className="p-1 border-2 border-[#45283c] bg-[#4b692f] text-white text-[7.5px] font-bold">
                    BAND 7.5+
                  </div>
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
                    {currentQ.explanation}
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
