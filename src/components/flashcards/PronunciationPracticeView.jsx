// src/components/flashcards/PronunciationPracticeView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Volume1, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Award,
  Zap,
  Info
} from 'lucide-react';
import { 
  isSpeechRecognitionSupported, 
  createSpeechRecognizer, 
  speakSentence, 
  evaluatePronunciation 
} from '../../services/speechService';
import { playCorrectSound, playVictorySound } from '../../services/soundEffects';

export default function PronunciationPracticeView({ 
  card, 
  onNextWord, 
  soundEnabled = true 
}) {
  const [practiceMode, setPracticeMode] = useState('word'); // 'word' | 'sentence'
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [evalResult, setEvalResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [recordDuration, setRecordDuration] = useState(0);

  const recognizerRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const targetWord = (card?.word || '').trim();
  const targetSentence = (card?.exampleSentence || card?.modelSentence || targetWord).trim();
  const currentTargetText = practiceMode === 'word' ? targetWord : targetSentence;

  const isSupported = isSpeechRecognitionSupported();

  // Reset when card changes
  useEffect(() => {
    stopRecording();
    setSpokenTranscript('');
    setEvalResult(null);
    setErrorMessage('');
    setRecordDuration(0);
  }, [card?.id, card?.word, practiceMode]);

  // Clean up recording on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  if (!card) return null;

  const handleListenNative = (rate = 0.9) => {
    speakSentence(currentTargetText, rate, 'en-US');
  };

  const startRecording = () => {
    if (!isSupported) {
      setErrorMessage('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói. Hãy dùng Google Chrome hoặc Microsoft Edge.');
      return;
    }

    setErrorMessage('');
    setSpokenTranscript('');
    setEvalResult(null);
    setIsRecording(true);
    setRecordDuration(0);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        setRecordDuration(Math.round((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);

    const recognizer = createSpeechRecognizer({
      lang: 'en-US',
      onResult: ({ transcript, isFinal }) => {
        setSpokenTranscript(transcript);
        if (isFinal) {
          stopRecording();
          finishEvaluation(transcript);
        }
      },
      onError: (err) => {
        console.warn('Speech err:', err);
        if (err === 'not-allowed') {
          setErrorMessage('Vui lòng cấp quyền truy cập Microphone cho trình duyệt để luyện nói.');
        } else if (err === 'no-speech') {
          setErrorMessage('Chưa nghe thấy giọng nói. Hãy thử đọc to và rõ ràng hơn nhé!');
        } else {
          setErrorMessage(`Lỗi nhận diện âm thanh (${err}). Hãy thử lại!`);
        }
        stopRecording();
      },
      onEnd: () => {
        setIsRecording(false);
      }
    });

    if (recognizer) {
      recognizerRef.current = recognizer;
      try {
        recognizer.start();
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch (e) {}
      recognizerRef.current = null;
    }
    setIsRecording(false);
  };

  const finishEvaluation = (transcriptToEval) => {
    const textToCompare = transcriptToEval || spokenTranscript;
    if (!textToCompare.trim()) {
      setErrorMessage('Chưa ghi nhận được âm thanh. Hãy bấm mic và đọc to rõ ràng hơn nhé!');
      return;
    }

    const durationMs = startTimeRef.current ? (Date.now() - startTimeRef.current) : 3000;
    const result = evaluatePronunciation(currentTargetText, textToCompare, durationMs);
    setEvalResult(result);

    if (result.pronScore >= 80) {
      if (soundEnabled) playCorrectSound();
    }
  };

  const handleManualStop = () => {
    stopRecording();
    finishEvaluation(spokenTranscript);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-text">
      
      <div className="w-full bg-white border border-[#E6E2D8] rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
        
        {/* Header: Mode Title & Target Selection */}
        <div className="flex items-center justify-between gap-2 border-b border-[#E6E2D8] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">
              <Mic className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Chấm Điểm Phát Âm &amp; Shadowing
              </span>
              <h4 className="text-xs text-[#7A7369]">Công nghệ AI chấm điểm phát âm &amp; độ trôi chảy tức thì</h4>
            </div>
          </div>

          {/* Toggle Word vs Sentence */}
          <div className="flex items-center p-0.5 rounded-xl bg-[#F4EFEA] border border-[#E6E2D8] text-[11px]">
            <button
              type="button"
              onClick={() => setPracticeMode('word')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                practiceMode === 'word' ? "bg-[#3E4F42] text-white shadow-2xs" : "text-[#7A7369]"
              }`}
            >
              Phát âm Từ
            </button>
            <button
              type="button"
              onClick={() => setPracticeMode('sentence')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                practiceMode === 'sentence' ? "bg-[#3E4F42] text-white shadow-2xs" : "text-[#7A7369]"
              }`}
            >
              Shadowing Câu
            </button>
          </div>
        </div>

        {/* Target Text Display Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] text-center space-y-2">
          {practiceMode === 'word' ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24211E] tracking-tight">
                {targetWord}
              </h2>
              {card.ipa && (
                <p className="font-mono text-sm text-[#3E4F42] font-semibold italic">
                  {card.ipa}
                </p>
              )}
              <p className="text-xs text-[#7A7369]">{card.meaning}</p>
            </>
          ) : (
            <>
              <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider block">
                Câu mẫu học thuật Band 8.5:
              </span>
              <p className="text-sm sm:text-base font-semibold text-[#24211E] leading-relaxed">
                "{targetSentence}"
              </p>
              <p className="text-xs text-[#7A7369] italic pt-1 border-t border-[#E6E2D8]/50">
                Ý nghĩa: {card.meaning}
              </p>
            </>
          )}

          {/* Native Audio Buttons */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleListenNative(0.9)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Nghe mẫu (1.0x)</span>
            </button>
            <button
              type="button"
              onClick={() => handleListenNative(0.75)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#7A7369] border border-[#E6E2D8] text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              <Volume1 className="w-3.5 h-3.5" />
              <span>Nghe chậm (0.75x)</span>
            </button>
          </div>
        </div>

        {/* Microphone Recording Action */}
        <div className="flex flex-col items-center justify-center py-2 space-y-3">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="group relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#3E4F42] hover:bg-[#334237] text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              title="Bấm để bắt đầu đọc"
            >
              <Mic className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleManualStop}
              className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600 text-white shadow-lg animate-pulse transition-all cursor-pointer"
              title="Bấm để kết thúc và chấm điểm"
            >
              <MicOff className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-400 animate-ping" />
            </button>
          )}

          <div className="text-center">
            <span className="text-xs font-bold text-[#24211E] block">
              {isRecording ? `Đang lắng nghe... (${recordDuration}s) - Bấm lại để dừng` : "Bấm Micro và đọc to câu trên"}
            </span>
            <span className="text-[11px] text-[#7A7369]">
              {isSupported ? "AI sẽ so khớp giọng nói của bạn với chuẩn phát âm bản xứ" : "Trình duyệt không hỗ trợ micro"}
            </span>
          </div>

          {/* Real-time live transcript */}
          {spokenTranscript && (
            <div className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-center text-xs">
              <span className="text-[10px] text-[#7A7369] block mb-0.5">Giọng bạn nhận diện được:</span>
              <p className="font-semibold text-[#24211E]">"{spokenTranscript}"</p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* OpenQuiz-style Pronunciation Scorecard */}
        {evalResult && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E2D8] shadow-sm space-y-4 animate-fadeIn">
            
            {/* Top Score Summary */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold font-mono border-2 shadow-sm ${
                  evalResult.pronScore >= 80 
                    ? "bg-emerald-50 text-emerald-800 border-emerald-400" 
                    : evalResult.pronScore >= 60
                    ? "bg-amber-50 text-amber-800 border-amber-400"
                    : "bg-rose-50 text-rose-800 border-rose-400"
                }`}>
                  <span className="text-xl leading-none">{evalResult.pronScore}</span>
                  <span className="text-[9px] uppercase tracking-tighter opacity-70">PronScore</span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#24211E] flex items-center gap-1.5">
                    {evalResult.pronScore >= 80 ? (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Xuất sắc! Phát âm rất chuẩn</span>
                      </>
                    ) : evalResult.pronScore >= 60 ? (
                      <>
                        <span>Khá tốt! Cần chú ý thêm ngữ điệu</span>
                      </>
                    ) : (
                      <>
                        <span>Cần luyện tập thêm một chút!</span>
                      </>
                    )}
                  </h4>
                  <p className="text-[11px] text-[#7A7369]">
                    {evalResult.accuracy >= 80 ? "Độ chuẩn xác âm tiết cao, nghe rõ từng âm." : "Có một số âm tiết chưa nhận diện rõ."}
                  </p>
                </div>
              </div>

              {onNextWord && (
                <button
                  type="button"
                  onClick={onNextWord}
                  className="px-3.5 py-1.5 rounded-xl bg-[#3E4F42] text-white font-bold text-xs hover:bg-[#334237] transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Từ sau</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 4 Pillars Breakdown (Accuracy, Fluency, Completeness, Prosody) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-center">
                <span className="text-[10px] text-[#7A7369] uppercase font-bold block">Accuracy</span>
                <span className="text-base font-bold font-mono text-[#24211E]">{evalResult.accuracy}/100</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-center">
                <span className="text-[10px] text-[#7A7369] uppercase font-bold block">Fluency</span>
                <span className="text-base font-bold font-mono text-[#24211E]">{evalResult.fluency}/100</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-center">
                <span className="text-[10px] text-[#7A7369] uppercase font-bold block">Completeness</span>
                <span className="text-base font-bold font-mono text-[#24211E]">{evalResult.completeness}/100</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-center">
                <span className="text-[10px] text-[#7A7369] uppercase font-bold block">Prosody</span>
                <span className="text-base font-bold font-mono text-[#24211E]">{evalResult.prosody}/100</span>
              </div>
            </div>

            {/* Word-by-Word Color Breakdown */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7369] block">
                Phân tích chi tiết từng từ (Word Breakdown):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {evalResult.words.map((item, idx) => {
                  let badgeClass = "bg-rose-50 text-rose-800 border-rose-300";
                  if (item.status === 'excellent') {
                    badgeClass = "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold";
                  } else if (item.status === 'good') {
                    badgeClass = "bg-emerald-50/70 text-emerald-700 border-emerald-200";
                  } else if (item.status === 'fair') {
                    badgeClass = "bg-amber-50 text-amber-800 border-amber-300";
                  }

                  return (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded-lg border text-xs font-mono flex items-center gap-1 ${badgeClass}`}
                      title={`Độ chuẩn xác: ${item.score}/100`}
                    >
                      <span>{item.word}</span>
                      <span className="text-[9px] opacity-70">({item.score})</span>
                    </span>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
