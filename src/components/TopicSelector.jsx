import React, { useState } from 'react';
import { 
  Shuffle, 
  Search, 
  Leaf, 
  GraduationCap, 
  Cpu, 
  HeartPulse, 
  ShieldAlert, 
  Globe, 
  Building2, 
  Landmark, 
  ArrowRight,
  BookOpen,
  Sparkles,
  TrendingUp,
  BarChart3,
  Layers,
  Map
} from 'lucide-react';
import { IELTS_TOPICS } from '../data/topicsData';

const ICON_MAP = {
  Leaf,
  GraduationCap,
  Cpu,
  HeartPulse,
  ShieldAlert,
  Globe,
  Building2,
  Landmark,
  TrendingUp,
  BarChart3,
  Layers,
  Map
};

export default function TopicSelector({ 
  selectedTopic, 
  onSelectTopic, 
  onRandomTopic,
  topics = IELTS_TOPICS,
  activeTask = "task2"
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isShuffling, setIsShuffling] = useState(false);

  const topicList = topics && topics.length > 0 ? topics : IELTS_TOPICS;

  const filteredTopics = topicList.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.vietnameseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRandomClick = () => {
    setIsShuffling(true);
    setTimeout(() => {
      onRandomTopic();
      setIsShuffling(false);
    }, 400);
  };

  return (
    <div className="space-y-4">
      {/* Top bar with Search and Randomizer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Chọn Chủ Đề Luyện Viết
          </h2>
          <p className="text-xs text-slate-400">
            Mỗi chủ đề tích hợp bộ từ vựng học thuật C1/C2 và thử thách Coherence Task 2
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm chủ đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Random Topic Button */}
          <button
            onClick={handleRandomClick}
            disabled={isShuffling}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 transition cursor-pointer shrink-0 ${
              isShuffling ? "animate-pulse opacity-80" : ""
            }`}
          >
            <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? "animate-spin" : ""}`} />
            <span>{isShuffling ? "Đang chọn..." : "Chọn Ngẫu Nhiên"}</span>
          </button>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredTopics.map((topic) => {
          const IconComponent = ICON_MAP[topic.icon] || BookOpen;
          const isSelected = selectedTopic?.id === topic.id;

          return (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-800/95 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xl shadow-indigo-950/40"
                  : "bg-slate-800/50 hover:bg-slate-800/90 border-slate-700/70 hover:border-slate-600 shadow-md"
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "bg-slate-700/60 text-indigo-400 group-hover:bg-indigo-600/20"
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition leading-snug">
                        {topic.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        {topic.vietnameseName}
                      </p>
                    </div>
                  </div>

                  {topic.tag && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-700/70 text-slate-300 shrink-0">
                      {topic.tag}
                    </span>
                  )}
                </div>

                {/* Prompt preview */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed bg-slate-900/40 p-2 rounded-lg border border-slate-800/80 mb-3">
                  <span className="font-semibold text-slate-300">Prompt: </span>
                  {topic.ieltsPrompt}
                </p>
              </div>

              {/* Bottom stats row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="text-indigo-400 font-medium">
                    {topic.vocabularies?.length || 0} Từ vựng
                  </span>
                  <span>•</span>
                  <span className="text-pink-400 font-medium">
                    {topic.coherenceChallenges?.length || 0} Coherence
                  </span>
                </div>

                <div className="flex items-center gap-1 font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>{isSelected ? "Đang chọn" : "Bắt đầu"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
