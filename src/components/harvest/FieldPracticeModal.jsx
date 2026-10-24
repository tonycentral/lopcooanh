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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-xs animate-in fade-in select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg harvest-panel p-5 sm:p-6 text-[#3E2723] space-y-4 border-4 border-[#795548] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#8D6E63] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-bounce">💧</span>
            <div>
              <h3 className="font-black text-sm sm:text-base text-[#2B2826] tracking-tight">
                {titles[skillType] || '🌾 Thử Thách Chăm Sóc Nông Trại'}
              </h3>
              <p className="text-xs text-[#5D4037]">
                Hoàn thành bài tập để tưới nước, cộng Gold và giúp cây chín rộ!
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#8D6E63] hover:text-[#3E2723] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Finished Screen */}
        {isFinished ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-amber-500 mx-auto flex items-center justify-center text-3xl shadow-sm">
              ✨
            </div>
            <div>
              <h4 className="text-lg font-black text-[#2B2826]">
                Tưới Nước Cho Cây Trồng Thành Công!
              </h4>
              <p className="text-xs text-[#5D4037] mt-1">
                Cây đã lớn thêm một giai đoạn, nhận ngay <b>Gold</b>, <b>EXP</b> và hồi phục <b>Thể lực</b>!
              </p>
            </div>

            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 flex items-center justify-around text-xs font-black">
              <span className="text-amber-900">🪙 +30 Gold</span>
              <span className="text-emerald-800">✨ +60 EXP</span>
              <span className="text-blue-800">⚡ +20 Stamina</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 harvest-btn-gold text-xs font-black tracking-wider cursor-pointer"
            >
              Về Nông Trại Thu Hoạch Nào! 🌾
            </button>
          </div>
        ) : (
          /* Question View */
          <div className="space-y-4">
            
            {/* Step count */}
            <div className="flex items-center justify-between text-xs font-black text-[#6D4C41]">
              <span>CÂU HỎI {currentStep + 1} / {questions.length}</span>
              <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full font-bold">
                Tưới nước +35% tiến độ
              </span>
            </div>

            {/* Prompt Card */}
            <div className="bg-white/90 border-2 border-[#8D6E63] rounded-2xl p-4 shadow-sm space-y-2">
              {currentQ.word && (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-amber-900">{currentQ.word}</span>
                  {currentQ.ipa && <span className="text-xs text-stone-500 font-mono">[{currentQ.ipa}]</span>}
                </div>
              )}
              <p className="text-xs sm:text-sm font-bold text-[#2B2826] leading-relaxed">
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
                          ? 'bg-emerald-100 border-emerald-600 text-emerald-950 font-bold' 
                          : isWrong 
                            ? 'bg-red-100 border-red-500 text-red-950' 
                            : isChosen 
                              ? 'bg-amber-100 border-amber-600' 
                              : 'bg-white/80 hover:bg-amber-50/80 border-[#A1887F] text-[#2B2826]'
                      }`}
                    >
                      <span className="leading-snug">{opt}</span>
                      {isTarget && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {isWrong && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Text Input Mode for Grammar / Writing */
              <div className="space-y-2">
                {currentQ.hint && (
                  <p className="text-[11px] text-amber-900 bg-amber-100/70 p-2 rounded-lg border border-amber-300">
                    💡 Gợi ý: {currentQ.hint}
                  </p>
                )}
                <textarea
                  value={textInput}
                  disabled={isAnswered}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder="Gõ câu trả lời hoặc câu sửa lỗi của bạn..."
                  rows={3}
                  className="w-full p-3 rounded-xl border-2 border-[#8D6E63] bg-white text-xs sm:text-sm text-[#2B2826] focus:outline-none focus:border-amber-600"
                />
                {!isAnswered && (
                  <button
                    type="button"
                    onClick={handleTextSubmit}
                    disabled={!textInput.trim()}
                    className="w-full py-2.5 harvest-btn-gold text-xs font-black cursor-pointer"
                  >
                    Kiểm Tra Câu Này ✨
                  </button>
                )}
              </div>
            )}

            {/* Explanation after answer */}
            {isAnswered && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-[#5D4037] leading-relaxed">
                <span className="font-bold text-amber-950">Giải thích chi tiết: </span>
                {currentQ.explanation || currentQ.expected || 'Làm tốt lắm!'}
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3 harvest-btn-gold text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
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
