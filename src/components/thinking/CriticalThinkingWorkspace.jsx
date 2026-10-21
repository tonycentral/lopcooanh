// src/components/thinking/CriticalThinkingWorkspace.jsx
import React, { useState } from 'react';
import { 
  Lightbulb, 
  BrainCircuit, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Scale, 
  Compass, 
  ArrowRight,
  BookOpen,
  Award
} from 'lucide-react';
import { CRITICAL_THINKING_TOPICS, CRITICAL_THINKING_FRAMEWORKS } from '../../data/criticalThinkingData';

export default function CriticalThinkingWorkspace() {
  const [selectedTopicId, setSelectedTopicId] = useState(CRITICAL_THINKING_TOPICS[0].id);
  const [activeTab, setActiveTab] = useState('perspectives'); // 'perspectives' | 'frameworks'

  const currentTopic = CRITICAL_THINKING_TOPICS.find(t => t.id === selectedTopicId) || CRITICAL_THINKING_TOPICS[0];

  return (
    <div className="h-full flex flex-col bg-[#F8F6F1] text-[#24211E] overflow-hidden select-none">
      
      {/* Top Banner */}
      <div className="bg-white border-b border-[#E6E2D8] px-4 sm:px-6 py-3 shrink-0 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] flex items-center justify-center font-bold text-sm shadow-2xs">
            <BrainCircuit className="w-5 h-5 text-[#3E4F42]" />
          </div>
          <div>
            <h1 className="font-title font-bold text-base sm:text-lg text-[#24211E] leading-tight">
              Tư Duy Phản Biện &amp; Kho Ý Tưởng (Critical Thinking &amp; Idea Bank)
            </h1>
            <p className="text-xs text-[#7A7369] mt-0.5">
              Phát triển luận điểm đa chiều (Kinh tế - Xã hội - Đạo đức) cho Writing Task 2 &amp; Speaking Part 3
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#F4EFEA] border border-[#E6E2D8] text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('perspectives')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'perspectives' ? "bg-[#3E4F42] text-white shadow-xs" : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            Kho Luận Điểm Đa Chiều
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('frameworks')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'frameworks' ? "bg-[#3E4F42] text-white shadow-xs" : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            Mô Hình PEEL &amp; SPELT
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-hidden">
        {activeTab === 'perspectives' ? (
          <div className="h-full grid grid-cols-1 md:grid-cols-12 gap-3 overflow-hidden">
            
            {/* Left Col: Danh mục chủ đề tranh luận (4 cols) */}
            <div className="md:col-span-4 h-full bg-white border border-[#E6E2D8] rounded-2xl p-4 flex flex-col overflow-hidden shadow-xs">
              <div className="pb-2.5 border-b border-[#E6E2D8] flex items-center justify-between shrink-0">
                <span className="text-xs font-bold text-[#A67C52] uppercase tracking-wider">
                  Chủ đề tranh luận hóc búa
                </span>
                <span className="text-[10px] font-mono text-[#7A7369]">
                  {CRITICAL_THINKING_TOPICS.length} Topics
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto py-2 space-y-2 pr-1 scrollbar-thin">
                {CRITICAL_THINKING_TOPICS.map((topic) => {
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
                      <span className="font-bold text-xs text-[#24211E]">
                        {topic.topicName}
                      </span>
                      <p className="text-[11px] text-[#7A7369] line-clamp-2">
                        {topic.coreQuestion}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Col: Phân tích đa chiều luận điểm (8 cols) */}
            <div className="md:col-span-8 h-full bg-white border border-[#E6E2D8] rounded-2xl p-4 flex flex-col overflow-hidden shadow-xs">
              
              <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 scrollbar-thin select-text">
                
                {/* Topic Core Prompt Banner */}
                <div className="p-3.5 rounded-xl bg-[#FAF5EE] border border-[#A67C52]/30 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67C52]">
                    Câu hỏi nghị luận trung tâm:
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-[#24211E]">
                    "{currentTopic.coreQuestion}"
                  </h2>
                </div>

                {/* Multi-angle Perspectives Breakdown */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#3E4F42] flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    <span>Lăng kính phân tích đa chiều (Perspectives):</span>
                  </h3>

                  {currentTopic.perspectives.map((p, pIdx) => (
                    <div key={pIdx} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-2.5">
                      <div className="font-bold text-xs text-[#3E4F42] flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-[#A67C52]" />
                        <span>{p.angle}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {/* For */}
                        <div className="p-2.5 bg-white rounded-lg border border-[#E6E2D8] space-y-1.5">
                          <span className="text-[10px] font-bold text-[#3E4F42] uppercase block">
                            ✅ Luận cứ Ủng hộ (Arguments FOR):
                          </span>
                          <ul className="list-disc list-inside text-[#24211E] space-y-1 text-[11px] leading-relaxed">
                            {p.argumentsFor.map((arg, aIdx) => (
                              <li key={aIdx}>{arg}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Against */}
                        <div className="p-2.5 bg-white rounded-lg border border-[#E6E2D8] space-y-1.5">
                          <span className="text-[10px] font-bold text-[#A67C52] uppercase block">
                            ⚠️ Luận cứ Phản biện (Arguments AGAINST):
                          </span>
                          <ul className="list-disc list-inside text-[#24211E] space-y-1 text-[11px] leading-relaxed">
                            {p.argumentsAgainst.map((arg, aIdx) => (
                              <li key={aIdx}>{arg}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Synthesis Solution */}
                {currentTopic.synthesisSolution && (
                  <div className="p-3.5 rounded-xl bg-[#EDF3EE] border border-[#D1DDD3] space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#3E4F42] flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Giải pháp cân bằng đắt giá (Synthesis / Balanced View Band 8+):</span>
                    </span>
                    <p className="text-xs text-[#24211E] leading-relaxed font-medium">
                      {currentTopic.synthesisSolution}
                    </p>
                  </div>
                )}

                {/* Band 8 Collocations */}
                {currentTopic.band8Collocations && (
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E6E2D8] space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7369]">
                      Cụm từ vựng học thuật nên dùng cho đề này:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentTopic.band8Collocations.map((col, cIdx) => (
                        <span key={cIdx} className="px-2 py-0.5 rounded bg-white text-[#3E4F42] border border-[#D1DDD3] font-mono text-[10px] font-bold">
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        ) : (
          /* TAB 2: MÔ HÌNH PEEL & SPELT */
          <div className="h-full bg-white border border-[#E6E2D8] rounded-2xl p-4 overflow-y-auto scrollbar-thin space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#24211E]">Khung tư duy logic chuẩn quốc tế cho IELTS</h2>
              <p className="text-xs text-[#7A7369] mt-0.5">
                Áp dụng nhất quán giúp bài viết Task 2 và câu trả lời Speaking Part 3 luôn mạch lạc, chặt chẽ và không bao giờ lạc đề.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CRITICAL_THINKING_FRAMEWORKS.map((fw) => (
                <div key={fw.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-3">
                  <div className="font-bold text-sm text-[#3E4F42]">{fw.name}</div>
                  <p className="text-xs text-[#7A7369]">{fw.usage}</p>

                  {fw.steps && (
                    <div className="space-y-2 pt-2 border-t border-[#E6E2D8]">
                      {fw.steps.map((st, sIdx) => (
                        <div key={sIdx} className="p-2.5 bg-white rounded-lg border border-[#E6E2D8] text-xs">
                          <strong className="text-[#3E4F42] font-mono">{st.step}:</strong>
                          <span className="text-[#24211E] ml-1.5 leading-relaxed">{st.desc}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {fw.angles && (
                    <div className="space-y-1.5 pt-2 border-t border-[#E6E2D8]">
                      {fw.angles.map((ang, aIdx) => (
                        <div key={aIdx} className="p-2 bg-white rounded-lg border border-[#E6E2D8] text-xs font-medium text-[#24211E]">
                          🔹 {ang}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
