import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Cloud,
  Laptop,
  Smartphone,
  Save,
  KeyRound
} from 'lucide-react';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle 
} from '../services/authService';
import { 
  isSupabaseConfigured, 
  getSupabaseConfig, 
  saveSupabaseConfig 
} from '../services/supabaseClient';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onAuthSuccess,
  isRequired = false 
}) {
  const [tab, setTab] = useState('login'); // 'login' | 'signup' | 'config'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Manual Supabase credentials input if not yet set in .env
  const currentConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(currentConfig.anonKey);
  const [configSaved, setConfigSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isSupabaseConfigured && tab !== 'config') {
      setErrorMessage("Vui lòng kết nối Supabase URL và Anon Key trước khi đăng nhập!");
      setTab('config');
      return;
    }

    if (!email || !password) {
      setErrorMessage("Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }

    setLoading(true);

    try {
      if (tab === 'signup') {
        const { data, error } = await signUpWithEmail(email, password, fullName);
        if (error) {
          setErrorMessage(error.message || "Lỗi khi đăng ký tài khoản");
        } else {
          setSuccessMessage("Đăng ký thành công! Hãy kiểm tra hòm thư nếu Supabase yêu cầu xác minh.");
          if (onAuthSuccess && data?.user) {
            onAuthSuccess(data.user);
            setTimeout(onClose, 1200);
          }
        }
      } else {
        const { data, error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMessage(error.message || "Email hoặc Mật khẩu không chính xác");
        } else {
          setSuccessMessage("Đăng nhập thành công! Đang đồng bộ dữ liệu...");
          if (onAuthSuccess && data?.user) {
            onAuthSuccess(data.user);
            setTimeout(onClose, 800);
          }
        }
      }
    } catch (err) {
      setErrorMessage(err.message || "Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured) {
      setErrorMessage("Vui lòng cấu hình Supabase trước khi dùng Google Login!");
      setTab('config');
      return;
    }
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMessage(error.message || "Lỗi khi đăng nhập bằng Google");
      setLoading(false);
    }
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      setErrorMessage("Vui lòng nhập đầy đủ Supabase URL và Anon Key!");
      return;
    }

    saveSupabaseConfig(supabaseUrl, supabaseAnonKey);
    setConfigSaved(true);
    setSuccessMessage("Đã lưu cấu hình Supabase! Đang tải lại trang...");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => {
        if (!isRequired) onClose();
      }}
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-md max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black">
              <Cloud className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  Tài Khoản Lớp Cô Oanh
                </h3>
                {isRequired && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Bắt buộc
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {isRequired 
                  ? "Vui lòng đăng nhập hoặc tạo tài khoản để vào học" 
                  : "Đồng bộ đám mây Supabase • Học mọi lúc mọi nơi"}
              </p>
            </div>
          </div>

          {!isRequired && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tab Switcher: Đăng Nhập / Đăng Ký / Cấu Hình */}
        <div className="px-5 sm:px-6 pt-4 shrink-0">
          <div className="flex p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => { setTab('login'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl font-bold transition cursor-pointer ${
                tab === 'login'
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => { setTab('signup'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl font-bold transition cursor-pointer ${
                tab === 'signup'
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Tạo Tài Khoản
            </button>
            {!isSupabaseConfigured && (
              <button
                onClick={() => { setTab('config'); setErrorMessage(''); }}
                className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer ${
                  tab === 'config'
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                    : "text-amber-400 hover:text-amber-300"
                }`}
                title="Cài đặt kết nối Supabase"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Khóa API</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Error / Success Alerts */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB: CẤU HÌNH SUPABASE (Nếu chưa kết nối) */}
          {tab === 'config' ? (
            <form onSubmit={handleSaveConfig} className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-amber-400" />
                  Kết nối tài khoản Supabase miễn phí:
                </div>
                <p className="text-[11px] leading-relaxed">
                  Lấy URL và Anon Key từ trang quản trị <strong>Supabase &gt; Project Settings &gt; API</strong> rồi dán vào đây:
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Project URL (Supabase URL):</label>
                <input
                  type="url"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Anon Public Key:</label>
                <textarea
                  rows={3}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Cấu Hình &amp; Khởi Động Supabase</span>
              </button>
            </form>
          ) : (
            /* TAB: ĐĂNG NHẬP / ĐĂNG KÝ */
            <div className="space-y-4">
              
              {/* Email & Password Form (Mặc định dùng được ngay) */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {tab === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Họ và tên học viên:</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Email học viên:</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="hocvien@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Mật khẩu:</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Tối thiểu 6 ký tự"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1 active:scale-98"
                >
                  <span>{loading ? "Đang xử lý..." : tab === 'signup' ? "Tạo Tài Khoản Mới" : "Đăng Nhập Ngay"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Hoặc bằng Google */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-800"></div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Hoặc Google</span>
                  <div className="flex-1 h-px bg-slate-800"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-2.5 shadow-sm cursor-pointer active:scale-98"
                  title="Yêu cầu bật Google Provider trong Supabase Dashboard"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Đăng nhập bằng Google</span>
                </button>
              </div>

              {/* Cloud Benefits Visualizer */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Lợi ích khi có tài khoản đám mây:
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Học trên điện thoại</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-blue-400" />
                    <span>Viết bài trên laptop</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 pt-0.5">
                  ✓ Toàn bộ từ vựng Flashcard, điểm số và bài viết sẽ tự động đồng bộ xuyên suốt.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer: Enforced Student Policy */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Chỉ dành cho học viên có tài khoản Lớp Cô Oanh</span>
          </div>

          {!isSupabaseConfigured && tab !== 'config' && (
            <button
              type="button"
              onClick={() => setTab('config')}
              className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              Cấu hình Supabase &rarr;
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
