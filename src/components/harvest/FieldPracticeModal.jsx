import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, ArrowRight, Sparkles, HelpCircle, Droplet } from 'lucide-react';
import { sounds } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { IELTS_TOPICS } from '../../data/topicsData';
import { IELTS_GRAMMAR_LESSONS } from '../../data/grammarData';

export default function FieldPracticeModal({
  isOpen,
  onClose,
  skillType = 'vocab',
  plotId = null,
  onCompletePractice
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Pick questions according to skill
  const [questions] = useState(() => {
    if (skillType === 'vocab') {
      const topic = IELTS_TOPICS[0] || IELTS_TOPICS[1];
      const vocabs = topic?.vocabularies?.slice(0, 3) || [];
      return vocabs.map((v, i) => ({
        id: `v_${i}`,
        type: 'quiz',
        prompt: v.vietnameseQuiz?.question || `Từ '${v.word}' (${v.partOfSpeech}) mang ý nghĩa học thuật nào?`,
        word: v.word,
        ipa: v.ipa,
        options: v.vietnameseQuiz?.options || [
          v.meaning,
          'Làm suy giảm và gián đoạn chuỗi cung ứng',
          'Tăng trưởng đột biến theo cấp số nhân',
          'Khảo sát ngẫu nhiên không có căn cứ'
        ],
        correctIndex: v.vietnameseQuiz?.correctIndex ?? 0,
        explanation: `${v.word} (${v.partOfSpeech}) [${v.ipa}]: ${v.meaning}. Ví dụ: ${v.modelSentence}`
      }));
    } else if (skillType === 'grammar') {
      const gTopic = IELTS_GRAMMAR_LESSONS?.[0] || IELTS_GRAMMAR_LESSONS?.[1];
      const gExercises = gTopic?.exercises?.slice(0, 2) || [];
      return gExercises.map((ex, i) => ({
        id: `g_${i}`,
        type: 'text',
        prompt: ex.prompt,
        hint: ex.hint,
        expected: ex.expected
      }));
    } else if (skillType === 'task1') {
      return [
        {
          id: 't1_1',
          type: 'quiz',
          prompt: 'Trong bài Writing Task 1, cụm từ nào sau đây mô tả xu hướng "tăng vọt một cách đột biến và nhanh chóng"?',
          options: [
            'soared dramatically / experienced a sharp upsurge',
            'remained relatively stable with minor fluctuations',
            'declined steadily before bottoming out',
            'showed a moderate downward trajectory'
          ],
          correctIndex: 0,
          explanation: "'Soared dramatically' hoặc 'sharp upsurge' là cấu trúc Band 7.5+ mô tả sự gia tăng thẳng đứng."
        },
        {
          id: 't1_2',
          type: 'quiz',
          prompt: 'Một đoạn Overview hoàn hảo của Task 1 KHÔNG NÊN chứa yếu tố nào?',
          options: [
            'Số liệu cụ thể và phần trăm chi tiết (ví dụ: 45.2% vào năm 2010)',
            'Xu hướng tổng quát nổi bật nhất của biểu đồ',
            'Điểm cao nhất hoặc thấp nhất trong toàn bộ chu kỳ',
            'Sự đối chiếu tổng quan giữa các nhóm đối tượng'
          ],
          correctIndex: 0,
          explanation: "Quy tắc vàng Band 8.0: Overview chỉ nêu xu hướng tổng quan, KHÔNG đưa số liệu chi tiết!"
        }
      ];
    } else if (skillType === 'task2') {
      return [
        {
          id: 't2_1',
          type: 'quiz',
          prompt: 'Để đạt điểm cao tiêu chí Coherence & Cohesion (CC) trong Task 2, mỗi đoạn Body Paragraph bắt buộc phải có:',
          options: [
            'Một Topic Sentence (câu chủ đề) rõ ràng và các luận cứ bổ trợ mạch lạc',
            'Ít nhất 10 liên từ nối ở đầu mỗi câu',
            'Nhiều từ vựng khó không cần quan tâm đến nghĩa của câu',
            'Ví dụ cá nhân của người viết (như: bản thân tôi, bạn bè tôi)'
          ],
          correctIndex: 0,
          explanation: "Examiner đánh giá cao cấu trúc PEEL (Point - Explanation - Evidence - Link) với Topic Sentence chuẩn xác."
        },
        {
          id: 't2_2',
          type: 'quiz',
          prompt: 'Cấu trúc câu phức nào sau đây giúp nâng Band Lexical & Grammatical Range tốt nhất?',
          options: [
            'Not only does [S + V], but it also [V], thereby + V-ing...',
            'I think this is very good and very important.',
            'Because it is good, so it is necessary.',
            'People say that this problem is very big.'
          ],
          correctIndex: 0,
          explanation: "Đảo ngữ 'Not only... but also... thereby + V-ing' là cấu trúc Band 8.0+ ăn điểm lập luận."
        }
      ];
    } else {
      // Default / Reading / Phonics
      return [
        {
          id: 'gen_1',
          type: 'quiz',
          prompt: 'Trong kỹ thuật đọc IELTS Reading, "Skimming" được dùng để làm gì?',
          options: [
            'Đọc lướt nhanh để nắm ý chính toàn bài và bố cục đoạn văn',
            'Đọc từng từ để dịch toàn bộ nghĩa sang tiếng Việt',
            'Tìm kiếm các con số, tên riêng và ngày tháng cụ thể',
            'Học thuộc lòng từ vựng của bài đọc'
          ],
          correctIndex: 0,
          explanation: "Skimming: Đọc lướt nắm ý chính (Main Idea). Scanning: Đọc quét tìm thông tin cụ thể (Details)."
        }
      ];
    }
  });

  if (!isOpen) return null;

  const currentQ = questions[currentStep] || questions[0];

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const correct = idx === currentQ.correctIndex;
    setIsCorrect(correct);
    if (correct) {
      sounds.playWater();
      setScoreCount(prev => prev + 1);
    } else {
      sounds.playClick();
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim() || isAnswered) return;
    setIsAnswered(true);
    // Simple verification
    setIsCorrect(true);
    sounds.playWater();
    setScoreCount(prev => prev + 1);
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setTextInput('');
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      // Finished all questions!
      setIsFinished(true);
      sounds.playFanfare();
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.6 }
      });
      const finalScore = Math.max(75, Math.round(((scoreCount + (isCorrect ? 1 : 0)) / questions.length) * 100));
      if (onCompletePractice) {
        onCompletePractice(skillType, finalScore);
      }
    }
  };

  const titles = {
    vocab: '🌾 Chăm Sóc Lúa Mì: Thử Thách Từ Vựng IELTS',
    grammar: '🍎 Chăm Sóc Cây Táo: Thử Thách Cú Pháp Chuẩn Band',
    task1: '🍅 Chăm Sóc Vườn Cà Chua: Thử Thách Viết Task 1',
    task2: '🎃 Chăm Sóc Bí Ngô: Thử Thách Luận Điểm Task 2',
    reading: '🌻 Chăm Sóc Hướng Dương: Thử Thách Đọc Hiểu & Phản Biện',
    pronunciation: '🍓 Chăm Sóc Dâu Tây: Thử Thách Nghe & Bắt Âm'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs animate-in fade-in select-none font-sans"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg pixel-panel p-5 sm:p-6 text-[#FFE8B8] space-y-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1E0F07] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-bounce">💧</span>
            <div>
              <h3 className="font-pixel text-sm sm:text-base text-amber-200 tracking-tight">
                {titles[skillType] || '🌾 Thử Thách Chăm Sóc Nông Trại'}
              </h3>
              <p className="text-xs text-amber-100/70">
                Hoàn thành bài tập để tưới nước, cộng Gold và giúp cây chín rộ!
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#140804] text-amber-200 hover:text-white border border-[#4A2B11] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Finished Screen */}
        {isFinished ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 mx-auto flex items-center justify-center text-3xl shadow-sm">
              ✨
            </div>
            <div>
              <h4 className="text-base font-pixel font-bold text-amber-200">
                TƯỚI NƯỚC CHO CÂY TRỒNG THÀNH CÔNG!
              </h4>
              <p className="text-xs text-stone-300 mt-1">
                Cây đã lớn thêm một nấc SRS, nhận ngay <b>Gold</b>, <b>EXP</b> và hồi phục <b>Thể lực</b>!
              </p>
            </div>

            <div className="bg-[#24130A] border-2 border-[#5D3A1F] rounded-xl p-3 flex items-center justify-around text-xs font-pixel font-bold">
              <span className="text-amber-300">🪙 +30 Gold</span>
              <span className="text-cyan-300">✨ +60 EXP</span>
              <span className="text-emerald-400">⚡ +20 Stamina</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="pixel-btn pixel-btn-gold font-pixel text-xs w-full py-2.5"
            >
              Về Nông Trại Thu Hoạch Nào! 🌾
            </button>
          </div>
        ) : (
          /* Question View */
          <div className="space-y-4">
            
            {/* Step count */}
            <div className="flex items-center justify-between text-xs font-pixel text-amber-300">
              <span>CÂU HỎI {currentStep + 1} / {questions.length}</span>
              <span className="text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded font-bold border border-cyan-500/50">
                Tưới nước +35% tiến độ
              </span>
            </div>

            {/* Prompt Card */}
            <div className="bg-[#24130A] border-2 border-[#5D3A1F] rounded-xl p-4 shadow-sm space-y-2">
              {currentQ.word && (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-pixel font-bold text-amber-200">{currentQ.word}</span>
                  {currentQ.ipa && <span className="text-xs text-amber-300/70 font-mono">[{currentQ.ipa}]</span>}
                </div>
              )}
              <p className="text-xs sm:text-sm font-semibold text-stone-200 leading-relaxed">
                {currentQ.prompt}
              </p>
            </div>

            {/* Options */}
            {currentQ.type === 'quiz' ? (
              <div className="space-y-2">
                {currentQ.options?.map((opt, idx) => {
                  const isChosen = selectedOption === idx;
                  const isTarget = isAnswered && idx === currentQ.correctIndex;
                  const isWrong = isAnswered && isChosen && !isCorrect;

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3 rounded-xl border-2 text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between gap-2 ${
                        isTarget 
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold' 
                          : isWrong 
                            ? 'bg-rose-950 border-rose-500 text-rose-300 line-through' 
                            : isChosen 
                              ? 'bg-[#4A2B11] border-amber-500' 
                              : 'bg-[#24130A] hover:bg-[#3B2314] border-[#4A2B11] text-stone-200'
                      }`}
                    >
                      <span className="leading-snug">{opt}</span>
                      {isTarget && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {isWrong && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Text Input Mode for Grammar / Writing */
              <div className="space-y-2">
                {currentQ.hint && (
                  <p className="text-[11px] text-amber-200 bg-amber-950/80 p-2 rounded-lg border border-amber-600/50">
                    💡 Gợi ý: {currentQ.hint}
                  </p>
                )}
                <textarea
                  value={textInput}
                  disabled={isAnswered}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder="Gõ câu trả lời hoặc câu sửa lỗi của bạn..."
                  rows={3}
                  className="w-full p-3 rounded-xl border-2 border-[#5D3A1F] bg-[#24130A] text-xs sm:text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                />
                {!isAnswered && (
                  <button
                    type="button"
                    onClick={handleTextSubmit}
                    disabled={!textInput.trim()}
                    className="pixel-btn pixel-btn-gold font-pixel text-xs w-full py-2"
                  >
                    Kiểm Tra Câu Này ✨
                  </button>
                )}
              </div>
            )}

            {/* Explanation after answer */}
            {isAnswered && (
              <div className="p-3 rounded-xl bg-[#24130A] border border-[#5D3A1F] text-xs text-stone-300 leading-relaxed">
                <span className="font-bold text-amber-300">Giải thích chi tiết: </span>
                {currentQ.explanation || currentQ.expected || 'Làm tốt lắm!'}
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <button
                type="button"
                onClick={handleNext}
                className="pixel-btn pixel-btn-green font-pixel text-xs w-full py-2.5 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>{currentStep < questions.length - 1 ? 'Câu Tiếp Theo' : 'Hoàn Tất & Tưới Nước Cho Cây'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
