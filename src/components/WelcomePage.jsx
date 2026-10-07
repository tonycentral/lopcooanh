import { 
  ArrowRight, 
  Check, 
  PhoneCall, 
  Mail,
  Layers 
} from 'lucide-react';
import { BAND_OPTIONS } from '../data/bandDescriptors';

export default function WelcomePage({ 
  onStartPractice, 
  onStartFlashcard,
  onOpenContactModal,
  onChangeEmail,
  studentEmail,
  targetBand = "7.0",
  selectedTask = "task2",
  onSettingsChange
}) {
  const [justSaved, setJustSaved] = useState(false);

  const handleSelectBand = (band) => {
    if (onSettingsChange) {
      onSettingsChange({ targetBand: band, selectedTask });
    }
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  };

  const handleSelectTask = (task) => {
    if (onSettingsChange) {
      onSettingsChange({ targetBand, selectedTask: task });
    }
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  };

  const formattedPhone = "0899.488.299";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6">
      
      {/* Top Header */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/40 p-0.5 flex items-center justify-center shrink-0 overflow-hidden bg-slate-950 shadow-md shadow-blue-950/40">
            <img src="./logo.png" alt="Logo Lớp cô Oanh" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base text-white leading-tight">Lớp cô Oanh</div>
            <div className="text-[11px] text-slate-400">Website chuyên cải thiện writing</div>
          </div>
        </div>

        {/* Student Email Display & Switcher */}
        {studentEmail && (
          <button
            onClick={onChangeEmail}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition cursor-pointer max-w-[220px]"
            title="Đổi địa chỉ email học viên"
          >
            <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">{studentEmail}</span>
            <span className="text-[10px] text-slate-500 shrink-0">• Đổi</span>
          </button>
        )}
      </header>

      {/* Main Minimalist Center Container */}
      <main className="max-w-xl w-full mx-auto my-auto py-6 sm:py-8 space-y-6">
        
        {/* Title & Mascot Logo */}
        <div className="text-center space-y-2">
          {/* American Mascot Badge */}
          <div className="flex justify-center mb-2">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-blue-600/15 border-2 border-blue-500/40 p-2 shadow-2xl shadow-blue-600/25 ring-4 ring-blue-500/10 flex items-center justify-center bg-slate-900/90 hover:scale-105 transition-transform duration-300">
              <img 
                src="./logo.png" 
                alt="Wolf Mascot Logo" 
                className="w-full h-full object-contain drop-shadow-md" 
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Lớp cô Oanh
          </h1>
          <p className="text-xs sm:text-sm text-blue-400 font-bold uppercase tracking-wider">
            Website chuyên cải thiện writing • Chuẩn học thuật
          </p>
          {justSaved && (
            <p className="text-[11px] text-emerald-400 font-medium pt-1 animate-pulse">
              ✓ Đã lưu cài đặt cho {studentEmail}
            </p>
          )}
        </div>

        {/* Minimalist Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-blue-950/20">
          
          {/* Thanh Bar Chọn Band */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Chọn Band:</span>
              <span className="font-bold text-blue-400">Band {targetBand}</span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800/80">
              {BAND_OPTIONS.map((band) => {
                const isSelected = band === targetBand;
                return (
                  <button
                    key={band}
                    onClick={() => handleSelectBand(band)}
                    className={`py-2.5 px-1 text-center rounded-xl text-xs font-bold transition cursor-pointer select-none ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    {band}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nút Chọn Task 1 hoặc Task 2 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Chọn Task:</span>
              <span className="font-bold text-blue-400">{selectedTask === "task1" ? "Task 1" : "Task 2"}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800/80">
              <button
                type="button"
                onClick={() => handleSelectTask("task1")}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedTask === "task1"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                {selectedTask === "task1" && <Check className="w-3.5 h-3.5" />}
                <span>Task 1</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTask("task2")}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedTask === "task2"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                {selectedTask === "task2" && <Check className="w-3.5 h-3.5" />}
                <span>Task 2</span>
              </button>
            </div>
          </div>

          {/* Nút Bắt Đầu Luyện Tập & Học Nhanh Flashcard */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={onStartPractice}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Luyện viết câu (Band {targetBand} • {selectedTask === "task1" ? "Task 1" : "Task 2"})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onStartFlashcard && (
              <button
                type="button"
                onClick={onStartFlashcard}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Layers className="w-4 h-4" />
                <span>Học nhanh Flashcard từ vựng (Kiểu Duolingo)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-black">
                  Mới
                </span>
              </button>
            )}
          </div>

        </div>

        {/* Nút Liên Hệ Cô Oanh Để Học Trực Tiếp */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onOpenContactModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 hover:text-white border border-blue-500/30 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-sm"
          >
            <PhoneCall className="w-4 h-4 text-blue-400" />
            <span>Liên hệ cô Oanh để học trực tiếp (Zalo: {formattedPhone})</span>
          </button>
        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-[11px] text-slate-500">
        Lớp cô Oanh - website chuyên cải thiện writing • Hotline/Zalo: {formattedPhone}
      </footer>

    </div>
  );
}
