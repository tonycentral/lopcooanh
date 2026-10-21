// src/components/speaking/SpeakingWorkspace.jsx
import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { IELTS_SPEAKING_TOPICS } from '../../data/speakingData';

export default function SpeakingWorkspace() {
  const [selectedTopicId, setSelectedTopicId] = useState(IELTS_SPEAKING_TOPICS[0].id);
  const [activePart, setActivePart] = useState('part1'); // 'part1' | 'part2' | 'part3'
  
  // Part 2 Prep & Speaking Timers
  const [prepTimeLeft, setPrepTimeLeft] = useState(60);
  const [isPrepRunning, setIsPrepRunning] = useState(false);
  const [speakTimeLeft, setSpeakTimeLeft] = useState(120);
  const [isSpeakRunning, setIsSpeakRunning] = useState(false);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);

  const currentTopic = IELTS_SPEAKING_TOPICS.find(t => t.id === selectedTopicId) || IELTS_SPEAKING_TOPICS[0];

  // 1-min preparation countdown
  useEffect(() => {
    let timer = null;
    if (isPrepRunning && prepTimeLeft > 0) {
      timer = setInterval(() => setPrepTimeLeft(prev => prev - 1), 1000);
    } else if (prepTimeLeft === 0) {
      setIsPrepRunning(false);
    }
    return () => clearInterval(timer);
  }, [isPrepRunning, prepTimeLeft]);

  // 2-min speaking countdown
  useEffect(() => {
    let timer = null;
    if (isSpeakRunning && speakTimeLeft > 0) {
      timer = setInterval(() => setSpeakTimeLeft(prev => prev - 1), 1000);
    } else if (speakTimeLeft === 0) {
      setIsSpeakRunning(false);
    }
    return () => clearInterval(timer);
  }, [isSpeakRunning, speakTimeLeft]);

  // Voice playback
  const playSampleAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      // Create mock audio playback url
      setRecordedAudioUrl("mock_recorded");
    } else {
      setIsRecording(true);
      setRecordedAudioUrl(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#F8F6F1] text-[#24211E] overflow-hidden select-none">
      
      {/* Top Banner */}
      <div className="bg-white border-b border-[#E6E2D8] px-4 sm:px-6 py-3 shrink-0 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] flex items-center justify-center font-bold text-sm shadow-2xs">
            <Mic className="w-5 h-5 text-[#3E4F42]" />
          </div>
          <div>
            <h1 className="font-title font-bold text-base sm:text-lg text-[#24211E] leading-tight">
              Luyện Nói IELTS Speaking (Bộ đề dự đoán Band 8.0+)
            </h1>
            <p className="text-xs text-[#7A7369] mt-0.5">
              Khung trả lời AREA, bài mẫu Band 8.5 kèm từ vựng &amp; bấm giờ phòng thi Part 1 - 2 - 3
            </p>
          </div>
        </div>

        {/* Part 1, 2, 3 Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#F4EFEA] border border-[#E6E2D8] text-xs">
          <button
            type="button"
            onClick={() => setActivePart('part1')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activePart === 'part1' ? "bg-[#3E4F42] text-white shadow-xs" : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            Part 1: Phỏng vấn
          </button>
          <button
            type="button"
            onClick={() => setActivePart('part2')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activePart === 'part2' ? "bg-[#3E4F42] text-white shadow-xs" : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            Part 2: Cue Card
          </button>
          <button
            type="button"
            onClick={() => setActivePart('part3')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activePart === 'part3' ? "bg-[#3E4F42] text-white shadow-xs" : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            Part 3: Thảo luận sâu
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 p-3 sm:p-4 overflow-hidden">
        
        {/* Left Col: Chọn chủ đề Speaking (4 cols) */}
        <div className="md:col-span-4 h-full bg-white border border-[#E6E2D8] rounded-2xl p-4 flex flex-col overflow-hidden shadow-xs">
          <div className="pb-2.5 border-b border-[#E6E2D8] flex items-center justify-between shrink-0">
            <span className="text-xs font-bold text-[#A67C52] uppercase tracking-wider">
              Chủ đề thi Speaking
            </span>
            <span className="text-[10px] font-mono text-[#7A7369]">
              Dự đoán Cambridge
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto py-2 space-y-2 pr-1 scrollbar-thin">
            {IELTS_SPEAKING_TOPICS.map((topic) => {
              const isSelected = topic.id === currentTopic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`w-full p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                    isSelected 
                      ? "bg-[#EDF3EE] border-[#3E4F42] shadow-xs ring-1 ring-[#3E4F42]" 
                      : "bg-[#FAF8F5] hover:bg-white border-[#E6E2D8]"
                  }`}
                >
                  <div className="font-bold text-xs text-[#24211E]">
                    {topic.topicName}
                  </div>
                  <div className="text-[10px] text-[#A67C52] font-semibold">
                    {topic.category}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Microphone Recorder */}
          <div className="pt-3 border-t border-[#E6E2D8] flex flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleRecord}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs ${
                isRecording 
                  ? "bg-rose-600 text-white animate-pulse" 
                  : "bg-[#3E4F42] hover:bg-[#334237] text-white"
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isRecording ? "Đang ghi âm (Bấm để dừng)..." : "Bật Mic Ghi Âm Câu Trả Lời"}</span>
            </button>

            {recordedAudioUrl && (
              <div className="p-2 rounded-xl bg-[#EDF3EE] border border-[#D1DDD3] text-[11px] text-[#3E4F42] font-bold flex items-center justify-between">
                <span>Đã lưu bản ghi âm của bạn</span>
                <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-[#D1DDD3]">Sẵn sàng nghe lại</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Nội dung Part 1 / Part 2 / Part 3 (8 cols) */}
        <div className="md:col-span-8 h-full bg-white border border-[#E6E2D8] rounded-2xl p-4 flex flex-col overflow-hidden shadow-xs">
          
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 scrollbar-thin select-text">
            
            {/* PART 1 */}
            {activePart === 'part1' && (
              <div className="space-y-4">
                <div className="pb-2 border-b border-[#E6E2D8]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#3E4F42]">
                    Part 1: Khởi động &amp; Phỏng vấn đời thường (4-5 phút)
                  </h3>
                </div>

                {currentTopic.part1.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-2.5">
                    <div className="text-xs sm:text-sm font-bold text-[#24211E]">
                      Q: {item.question}
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#E6E2D8] text-xs text-[#24211E] font-serif leading-relaxed">
                      "{item.band8Answer}"
                    </div>

                    <div className="flex items-center justify-between gap-2 flex-wrap pt-1 text-[11px]">
                      <div className="flex flex-wrap gap-1">
                        {item.vocabularyHighlights.map((v, vIdx) => (
                          <span key={vIdx} className="px-2 py-0.5 rounded bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] font-mono text-[10px]">
                            {v}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => playSampleAudio(item.band8Answer)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#3E4F42] hover:bg-[#334237] text-white font-bold text-xs transition cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Nghe Audio mẫu</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PART 2 */}
            {activePart === 'part2' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E6E2D8] flex-wrap gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#A67C52]">
                    Part 2: Thuyết trình theo Cue Card (1 phút chuẩn bị • 2 phút nói)
                  </h3>

                  {/* 2 Timers */}
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setIsPrepRunning(prev => !prev)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-mono font-bold transition cursor-pointer ${
                        isPrepRunning 
                          ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse" 
                          : "bg-[#FAF8F5] text-[#7A7369] border-[#E6E2D8]"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Chuẩn bị: {prepTimeLeft}s</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsSpeakRunning(prev => !prev)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-mono font-bold transition cursor-pointer ${
                        isSpeakRunning 
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300 animate-pulse" 
                          : "bg-[#FAF8F5] text-[#7A7369] border-[#E6E2D8]"
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Nói: {speakTimeLeft}s</span>
                    </button>
                  </div>
                </div>

                {/* Cue Card Frame */}
                <div className="p-4 rounded-xl bg-[#FAF5EE] border-2 border-[#A67C52]/30 space-y-2.5 shadow-2xs">
                  <h4 className="font-bold text-sm text-[#24211E]">
                    {currentTopic.part2CueCard.cueTitle}
                  </h4>
                  <div className="text-xs text-[#7A7369]">You should say:</div>
                  <ul className="list-disc list-inside text-xs text-[#24211E] space-y-1">
                    {currentTopic.part2CueCard.bulletPoints.map((pt, pIdx) => (
                      <li key={pIdx}>{pt}</li>
                    ))}
                  </ul>
                </div>

                {/* Band 8.5 Model Speech */}
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#3E4F42] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Bài nói mẫu Band 8.5 chuẩn Examiner:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => playSampleAudio(currentTopic.part2CueCard.band8Answer)}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#3E4F42] hover:bg-[#334237] text-white font-bold text-xs transition cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe toàn bộ bài nói</span>
                    </button>
                  </div>

                  <p className="p-3.5 bg-white rounded-xl border border-[#E6E2D8] text-xs font-serif leading-relaxed text-[#24211E] whitespace-pre-line">
                    {currentTopic.part2CueCard.band8Answer}
                  </p>

                  <div className="text-[11px] text-[#7A7369] pt-1">
                    🏗️ <strong>Khung tư duy triển khai:</strong> {currentTopic.part2CueCard.structureBlueprint}
                  </div>
                </div>
              </div>
            )}

            {/* PART 3 */}
            {activePart === 'part3' && (
              <div className="space-y-4">
                <div className="pb-2 border-b border-[#E6E2D8]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#3E4F42]">
                    Part 3: Thảo luận học thuật &amp; Trừu tượng (Mô hình AREA)
                  </h3>
                </div>

                {currentTopic.part3.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-2.5">
                    <div className="text-xs sm:text-sm font-bold text-[#24211E]">
                      Q: {item.question}
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#E6E2D8] text-xs text-[#24211E] font-serif leading-relaxed">
                      "{item.band8Answer}"
                    </div>

                    <div className="p-2 rounded-lg bg-[#EDF3EE] border border-[#D1DDD3] text-[11px] text-[#3E4F42] leading-relaxed">
                      <strong>Cấu trúc AREA:</strong> {item.framework}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex flex-wrap gap-1">
                        {item.vocabularyHighlights.map((v, vIdx) => (
                          <span key={vIdx} className="px-2 py-0.5 rounded bg-white text-[#A67C52] border border-[#E6E2D8] font-mono text-[10px]">
                            {v}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => playSampleAudio(item.band8Answer)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#3E4F42] hover:bg-[#334237] text-white font-bold text-xs transition cursor-pointer shrink-0"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Nghe Audio</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
