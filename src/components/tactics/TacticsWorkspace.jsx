// src/components/tactics/TacticsWorkspace.jsx
import React, { useState } from 'react';
import { 
  Target, 
  ShieldAlert, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  CheckCircle2, 
  Lightbulb, 
  AlertTriangle,
  Award,
  ChevronRight
} from 'lucide-react';
import { EXAM_TACTICS_DATA } from '../../data/tacticsData';

export default function TacticsWorkspace() {
  const [selectedSkill, setSelectedSkill] = useState('all'); // 'all' | 'reading' | 'listening' | 'writing' | 'speaking'

  const filteredTactics = selectedSkill === 'all' 
    ? EXAM_TACTICS_DATA 
    : EXAM_TACTICS_DATA.filter(t => t.skill === selectedSkill);

  return (
    <div className="h-full flex flex-col bg-[#F8F6F1] text-[#24211E] overflow-hidden select-none">
      
      {/* Top Banner */}
      <div className="bg-white border-b border-[#E6E2D8] px-4 sm:px-6 py-3 shrink-0 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] flex items-center justify-center font-bold text-sm shadow-2xs">
            <Target className="w-5 h-5 text-[#3E4F42]" />
          </div>
          <div>
            <h1 className="font-title font-bold text-base sm:text-lg text-[#24211E] leading-tight">
              Chiến Thuật Phòng Thi &amp; Phá Bẫy Điểm Số (Exam Tactics Masterclass)
            </h1>
            <p className="text-xs text-[#7A7369] mt-0.5">
              Bí kíp làm bài theo từng dạng câu hỏi, quản lý thời gian và nhận diện bẫy Cambridge
            </p>
          </div>
        </div>

        {/* Skill Filter Pills */}
        <div className="flex items-center p-1 rounded-xl bg-[#F4EFEA] border border-[#E6E2D8] text-xs">
          <button
            type="button"
            onClick={() => setSelectedSkill('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              selectedSkill === 'all' ? "bg-[#3E4F42] text-white shadow-xs" : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            Tất cả kỹ năng
          </button>
          <button
            type="button"
            onClick={() => setSelectedSkill('reading')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
              selectedSkill === 'reading' ? "bg-[#3E4F42] text-white shadow-xs" : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Reading</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedSkill('listening')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
              selectedSkill === 'listening' ? "bg-[#3E4F42] text-white shadow-xs" : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            <Headphones className="w-3 h-3" />
            <span>Listening</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedSkill('writing')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
              selectedSkill === 'writing' ? "bg-[#3E4F42] text-white shadow-xs" : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            <PenTool className="w-3 h-3" />
            <span>Writing</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedSkill('speaking')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
              selectedSkill === 'speaking' ? "bg-[#3E4F42] text-white shadow-xs" : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            <Mic className="w-3 h-3" />
            <span>Speaking</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-hidden">
        <div className="h-full bg-white border border-[#E6E2D8] rounded-2xl p-4 overflow-y-auto space-y-5 scrollbar-thin select-text">
          
          {filteredTactics.map((sec) => (
            <div key={sec.skill} className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E6E2D8]">
                <h2 className="text-sm sm:text-base font-bold text-[#3E4F42]">
                  {sec.skillName}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] font-bold">
                  {sec.tactics.length} chiến thuật
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {sec.tactics.map((tac) => (
                  <div key={tac.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-3">
                    <div className="font-bold text-xs sm:text-sm text-[#24211E]">
                      {tac.title}
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-[#E6E2D8] text-xs text-[#24211E] leading-relaxed">
                      <strong className="text-[#3E4F42]">Quy tắc vàng:</strong> {tac.rule}
                    </div>

                    {tac.trapAlert && (
                      <div className="p-2.5 rounded-lg bg-[#FAF5EE] border border-[#E6E2D8] text-xs text-[#A67C52] space-y-1">
                        <span className="font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#A67C52]" />
                          <span>Cảnh báo bẫy phòng thi:</span>
                        </span>
                        <p className="text-[11px] leading-relaxed">{tac.trapAlert}</p>
                      </div>
                    )}

                    {tac.steps && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7369]">
                          Các bước triển khai bài bản:
                        </span>
                        <div className="space-y-1">
                          {tac.steps.map((st, sIdx) => (
                            <div key={sIdx} className="p-2 rounded-lg bg-white border border-[#E6E2D8] text-[11px] text-[#24211E] leading-relaxed">
                              {st}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {tac.example && (
                      <div className="p-2.5 rounded-lg bg-[#EDF3EE] border border-[#D1DDD3] text-[11px] space-y-1 text-[#24211E]">
                        <div><strong className="text-[#3E4F42]">Trích đoạn bài đọc:</strong> "{tac.example.passage}"</div>
                        <div><strong className="text-[#3E4F42]">Câu hỏi đề bài:</strong> "{tac.example.statement}"</div>
                        <div className="font-bold text-[#3E4F42] pt-0.5">Phán quyết: {tac.example.verdict}</div>
                      </div>
                    )}

                    {tac.examples && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7369]">
                          Cụm từ áp dụng trực tiếp:
                        </span>
                        {tac.examples.map((ex, eIdx) => (
                          <div key={eIdx} className="p-1.5 rounded-md bg-white border border-[#E6E2D8] text-[11px] font-serif text-[#3E4F42]">
                            "{ex}"
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}
