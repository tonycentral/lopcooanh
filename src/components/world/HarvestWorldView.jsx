import React, { useState } from 'react';
import { 
  Compass, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  LogOut, 
  LogIn, 
  Sparkles, 
  Sprout, 
  Send, 
  Volume2, 
  CheckCircle2, 
  Coins
} from 'lucide-react';
import { getAllTopics, getAllVocabularies } from '../../data/databank/databankService';
import { speakSentence } from '../../services/speechService';
import { evaluateVocabularySentence } from '../../services/evaluator';
import { GameContainer } from '../../features/farm';

// 4 Contextual Villagers for SLA Interaction
const VILLAGE_NPCS = [
  {
    id: 'elena',
    name: 'Elena',
    title: 'Nhà Thực Vật Học (Town Botanist)',
    avatar: '🌿',
    specialty: 'Môi Trường & Sinh Thái',
    topicId: 'environment',
    greeting: 'Chào bạn! Khu vườn sinh thái đang cần bổ sung dưỡng chất và đo lường sự biến đổi khí hậu.',
    currentTask: 'Mô tả nguyên nhân khiến nhiệt độ toàn cầu gia tăng bằng ít nhất một từ vựng học thuật.',
    targetVocab: ['biodiversity', 'degradation', 'sustainable', 'emissions'],
    affinity: 3
  },
  {
    id: 'marcus',
    name: 'Marcus',
    title: 'Kỹ Sư Trưởng Đô Thị (Urban Engineer)',
    avatar: '⚙️',
    specialty: 'Công Nghệ & Hạ Tầng',
    topicId: 'technology',
    greeting: 'Hệ thống vận tải và tự động hóa của thị trấn đang được nâng cấp toàn diện.',
    currentTask: 'Đưa ra ý kiến về tác động của trí tuệ nhân tạo đối với năng suất làm việc.',
    targetVocab: ['automation', 'efficiency', 'breakthrough', 'obsolete'],
    affinity: 2
  },
  {
    id: 'sophia',
    name: 'Sophia',
    title: 'Học Giả Thư Viện (Academy Scholar)',
    avatar: '📚',
    specialty: 'Giáo Dục & Xã Hội',
    topicId: 'education',
    greeting: 'Tri thức là nền tảng để thị trấn hưng thịnh. Hôm nay bạn muốn nghiên cứu tài liệu gì?',
    currentTask: 'Giải thích tại sao giáo dục đại học cần chú trọng phát triển tư duy phản biện.',
    targetVocab: ['pedagogy', 'curriculum', 'comprehensive', 'foster'],
    affinity: 4
  },
  {
    id: 'tobias',
    name: 'Tobias',
    title: 'Thương Nhân Chợ Phiên (Market Trader)',
    avatar: '⚖️',
    specialty: 'Kinh Tế & Thương Mại',
    topicId: 'business',
    greeting: 'Hàng hóa nông sản mùa này rất được giá. Bạn có muốn trao đổi thỏa thuận buôn bán không?',
    currentTask: 'Đề xuất một giải pháp để cân bằng lợi nhuận kinh doanh với trách nhiệm xã hội.',
    targetVocab: ['allocate', 'commodity', 'revenue', 'equilibrium'],
    affinity: 1
  }
];

export default function HarvestWorldView({
  studentEmail,
  currentUser,
  onOpenTargetBandModal,
  onOpenAuthModal,
  onOpenSettingsModal,
  onSignOut
}) {
  const [activeTab, setActiveTab] = useState('field'); // 'field' | 'dialogue' | 'bulletin' | 'lexicon'
  const [selectedNpc, setSelectedNpc] = useState(VILLAGE_NPCS[0]);
  const [userInput, setUserInput] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'npc',
      text: VILLAGE_NPCS[0].greeting,
      timestamp: 'Buổi sáng'
    }
  ]);
  const [evaluationFeedback, setEvaluationFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [goldCoins, setGoldCoins] = useState(150);

  // Switch NPC
  const handleSelectNpc = (npc) => {
    setSelectedNpc(npc);
    setChatLog([
      {
        sender: 'npc',
        text: `${npc.greeting} Nhiệm vụ hôm nay: "${npc.currentTask}"`,
        timestamp: 'Hiện tại'
      }
    ]);
    setEvaluationFeedback(null);
    setUserInput('');
  };

  // Submit response to NPC
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsSubmitting(true);
    const userText = userInput.trim();

    // Add user message to log
    const updatedLog = [
      ...chatLog,
      { sender: 'player', text: userText, timestamp: 'Vừa xong' }
    ];
    setChatLog(updatedLog);
    setUserInput('');

    // Evaluate response using the retained offline NLP engine
    setTimeout(() => {
      const evalResult = evaluateVocabularySentence(
        userText, 
        selectedNpc.targetVocab[0], 
        selectedNpc.targetVocab.slice(1), 
        "7.5"
      );

      setEvaluationFeedback(evalResult);

      let npcReply = '';
      if (evalResult?.isValid && (evalResult.isBandTargetMet || evalResult.score >= 70)) {
        npcReply = `Xuất sắc! Ý tưởng của bạn rất thuyết phục và sử dụng ngôn ngữ chuẩn xác. (+25 Gold, +1 Độ Thân Mật)`;
        setGoldCoins(prev => prev + 25);
      } else {
        npcReply = evalResult?.error || `Tôi hiểu ý bạn, nhưng câu văn sẽ mạch lạc hơn nếu bạn áp dụng thêm cấu trúc câu phức hoặc liên từ học thuật. Hãy cùng tôi thử lại nhé!`;
      }

      setChatLog(prev => [
        ...prev,
        { sender: 'npc', text: npcReply, timestamp: 'Vừa xong' }
      ]);
      setIsSubmitting(false);
    }, 400);
  };

  const handleSpeak = (text) => {
    speakSentence(text);
  };

  const allVocabCount = getAllVocabularies().length;
  const allTopicsCount = getAllTopics().length;

  return (
    <div className="flex h-full w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="w-72 bg-slate-900/90 border-r border-slate-800 flex flex-col shrink-0 select-none">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
              🌾
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide text-white">Harvest SLA</h1>
              <p className="text-xs text-slate-400">Nông Trại Tri Thức 2.0</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Coins className="w-3.5 h-3.5" />
            <span>{goldCoins}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-3 space-y-1">
          <button
            onClick={() => setActiveTab('dialogue')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'dialogue' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Đối Thoại Dân Làng</span>
          </button>

          <button
            onClick={() => setActiveTab('bulletin')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'bulletin' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Bảng Tin Nhiệm Vụ (TBLT)</span>
          </button>

          <button
            onClick={() => setActiveTab('field')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'field' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Khu Vực Canh Tác</span>
          </button>

          <button
            onClick={() => setActiveTab('lexicon')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'lexicon' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Kho Tàng Từ Vựng C1/C2</span>
          </button>
        </nav>

        {/* NPC Roster */}
        <div className="p-3 flex-1 overflow-y-auto">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Nhân Vật Trong Thị Trấn
          </div>
          <div className="space-y-1">
            {VILLAGE_NPCS.map((npc) => (
              <button
                key={npc.id}
                onClick={() => handleSelectNpc(npc)}
                className={`w-full text-left p-2.5 rounded-xl flex items-center gap-3 transition-all ${
                  selectedNpc.id === npc.id 
                    ? 'bg-slate-800 border border-slate-700 text-white' 
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <div className="text-2xl w-8 h-8 flex items-center justify-center shrink-0">
                  {npc.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">{npc.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{npc.specialty}</div>
                </div>
                <div className="text-xs text-amber-400 font-medium">★{npc.affinity}</div>
              </button>
            ))}
          </div>
        </div>

        {/* User Status & Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs">
              {(currentUser?.email || studentEmail || 'H').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-slate-200 truncate">
                {currentUser?.user_metadata?.full_name || (studentEmail ? studentEmail.split('@')[0] : 'Học viên')}
              </div>
              <button 
                onClick={onOpenTargetBandModal}
                className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
              >
                Band Mục Tiêu
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenSettingsModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Cài đặt"
            >
              <Settings className="w-4 h-4" />
            </button>
            {currentUser ? (
              <button
                onClick={onSignOut}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="p-1.5 rounded-lg text-emerald-400 hover:bg-slate-800 transition-colors"
                title="Đăng nhập"
              >
                <LogIn className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT VIEWPORT ================= */}
      <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
        
        {/* VIEW 1: NPC DIALOGUE & INTERACTION */}
        {activeTab === 'dialogue' && (
          <div className="flex-1 flex flex-col h-full max-h-full overflow-hidden">
            
            {/* NPC Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedNpc.avatar}</span>
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    {selectedNpc.name}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                      {selectedNpc.title}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Chủ đề tương tác: <span className="text-emerald-400 font-medium">{selectedNpc.specialty}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Độ thân thiết</div>
                  <div className="text-xs font-semibold text-amber-400">Cấp độ {selectedNpc.affinity} / 5</div>
                </div>
              </div>
            </div>

            {/* Conversation Log */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              
              {/* Task Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                    Thử Thách Giao Tiếp Thực Tế (TBLT Mission)
                  </div>
                  <div className="text-sm text-slate-200 mt-0.5">
                    {selectedNpc.currentTask}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-400">Từ vựng gợi ý:</span>
                    {selectedNpc.targetVocab.map((w) => (
                      <span key={w} className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              {chatLog.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.sender === 'player' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xl rounded-2xl p-4 space-y-1.5 shadow-md ${
                    msg.sender === 'player' 
                      ? 'bg-emerald-600 text-white rounded-br-none' 
                      : 'bg-slate-800 border border-slate-700/60 text-slate-200 rounded-bl-none'
                  }`}>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[11px] font-semibold opacity-75">
                        {msg.sender === 'player' ? 'Bạn' : selectedNpc.name}
                      </span>
                      {msg.sender === 'npc' && (
                        <button 
                          onClick={() => handleSpeak(msg.text)}
                          className="opacity-60 hover:opacity-100 transition-opacity"
                          title="Nghe phát âm"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="text-sm leading-relaxed">{msg.text}</div>
                  </div>
                </div>
              ))}

              {/* Evaluation Feedback Panel */}
              {evaluationFeedback && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Đánh Giá Ngôn Ngữ Học Thuật</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Điểm: {evaluationFeedback.score || 80}/100
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    {evaluationFeedback.feedback || "Câu viết thể hiện ngữ nghĩa rõ ràng và tự nhiên."}
                  </p>

                  {evaluationFeedback.upgradedSentence && (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="text-slate-400 font-medium">Phiên bản nâng cấp gợi ý (Band 8.0+):</div>
                      <div className="text-emerald-300 italic font-sans">{evaluationFeedback.upgradedSentence}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-900/60 flex gap-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={`Nhập câu trả lời bằng tiếng Anh để giao tiếp với ${selectedNpc.name}...`}
                disabled={isSubmitting}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting || !userInput.trim()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all"
              >
                <span>Gửi</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* VIEW 2: TASK-BASED BULLETIN BOARD */}
        {activeTab === 'bulletin' && (
          <div className="flex-1 p-8 overflow-y-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Bảng Tin Thị Trấn (Community Quests)</h2>
              <p className="text-sm text-slate-400">
                Thực hiện các nhiệm vụ giao tiếp dựa trên văn cảnh (Task-Based Language Teaching) để thu thập tài nguyên và nâng cao điểm danh tiếng.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VILLAGE_NPCS.map((npc) => (
                <div key={npc.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{npc.avatar}</span>
                      <div>
                        <div className="text-sm font-semibold text-white">{npc.name}</div>
                        <div className="text-xs text-slate-400">{npc.title}</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold">
                      +40 Gold
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    "{npc.currentTask}"
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-400">
                      Chủ đề: <span className="text-emerald-400">{npc.specialty}</span>
                    </span>
                    <button
                      onClick={() => {
                        handleSelectNpc(npc);
                        setActiveTab('dialogue');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-xs font-semibold transition-all"
                    >
                      Nhận Nhiệm Vụ &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: 2D PHASER FARM CANVAS VIEWPORT */}
        {activeTab === 'field' && (
          <div className="flex-1 w-full h-full relative overflow-hidden">
            <GameContainer userId={currentUser?.id} />
          </div>
        )}

        {/* VIEW 4: ACADEMIC LEXICON REPOSITORY */}
        {activeTab === 'lexicon' && (
          <div className="flex-1 p-8 overflow-y-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Kho Tàng Từ Vựng Học Thuật C1/C2</h2>
              <p className="text-sm text-slate-400">
                Ngân hàng dữ liệu gồm {allVocabCount} từ vựng học thuật được chuẩn hóa qua {allTopicsCount} nhóm chủ đề lớn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getAllVocabularies().slice(0, 15).map((v) => (
                <div key={v.id || v.word} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-400 font-mono">{v.word}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">
                      Band 7.5+
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">{v.meaning}</div>
                  {v.collocations && v.collocations.length > 0 && (
                    <div className="text-[11px] text-slate-500 italic">
                      Collocation: {v.collocations[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
