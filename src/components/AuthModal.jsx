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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2B2826]/45 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => {
        if (!isRequired) onClose();
      }}
    >
      <div 
        className="bg-[#FAF8F5] border border-[#E7E2D9] rounded-3xl w-full max-w-md max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#E7E2D9] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#4A5D4E]/10 text-[#4A5D4E] border border-[#4A5D4E]/20 flex items-center justify-center font-bold">
              <Cloud className="w-5 h-5 text-[#4A5D4E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-semibold text-base text-[#2B2826]">
                  Tài Khoản Lớp Cô Oanh
                </h3>
                {isRequired && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#4A5D4E]/10 text-[#4A5D4E] border border-[#4A5D4E]/20 font-sans">
                    Bắt buộc
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#7A7267]">
                {isRequired 
                  ? "Vui lòng đăng nhập hoặc tạo tài khoản để vào học" 
                  : "Đồng bộ đám mây Supabase • Học mọi lúc mọi nơi"}
              </p>
            </div>
          </div>

          {!isRequired && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#7A7267] hover:text-[#2B2826] hover:bg-[#F4EFEA] transition cursor-pointer"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tab Switcher: Đăng Nhập / Đăng Ký / Cấu Hình */}
        <div className="px-5 sm:px-6 pt-4 shrink-0">
          <div className="flex p-1 rounded-2xl bg-[#F4EFEA] border border-[#E7E2D9] text-xs">
            <button
              onClick={() => { setTab('login'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl font-medium transition cursor-pointer ${
                tab === 'login'
                  ? "bg-[#4A5D4E] text-white shadow-xs"
                  : "text-[#7A7267] hover:text-[#2B2826]"
              }`}
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => { setTab('signup'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl font-medium transition cursor-pointer ${
                tab === 'signup'
                  ? "bg-[#4A5D4E] text-white shadow-xs"
                  : "text-[#7A7267] hover:text-[#2B2826]"
              }`}
            >
              Tạo Tài Khoản
            </button>
            {!isSupabaseConfigured && (
              <button
                onClick={() => { setTab('config'); setErrorMessage(''); }}
                className={`px-3 py-2 rounded-xl font-medium transition flex items-center gap-1 cursor-pointer ${
                  tab === 'config'
                    ? "bg-[#B88758] text-white shadow-xs"
                    : "text-[#B88758] hover:text-[#9A6D42]"
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
        <div className="p-5 sm:px-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Error / Success Alerts */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB: CẤU HÌNH SUPABASE (Nếu chưa kết nối) */}
          {tab === 'config' ? (
            <form onSubmit={handleSaveConfig} className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#B88758]/30 text-[#2B2826] space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-[#B88758]">
                  <Database className="w-4 h-4 text-[#B88758]" />
                  Kết nối tài khoản Supabase miễn phí:
                </div>
                <p className="text-[11px] leading-relaxed text-[#7A7267]">
                  Lấy URL và Anon Key từ trang quản trị <strong>Supabase &gt; Project Settings &gt; API</strong> rồi dán vào đây:
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#2B2826]">Project URL (Supabase URL):</label>
                <input
                  type="url"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E7E2D9] text-xs text-[#2B2826] placeholder-[#B0A89F] focus:outline-none focus:border-[#4A5D4E] font-mono shadow-2xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#2B2826]">Anon Public Key:</label>
                <textarea
                  rows={3}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E7E2D9] text-[11px] text-[#2B2826] placeholder-[#B0A89F] focus:outline-none focus:border-[#4A5D4E] font-mono resize-none shadow-2xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#4A5D4E] hover:bg-[#3D4D40] text-white font-medium text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
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
                    <label className="text-[11px] font-medium text-[#2B2826]">Họ và tên học viên:</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#7A7267] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-[#E7E2D9] text-xs text-[#2B2826] placeholder-[#B0A89F] focus:outline-none focus:border-[#4A5D4E] shadow-2xs"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[#2B2826]">Email học viên:</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7A7267] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="hocvien@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-[#E7E2D9] text-xs text-[#2B2826] placeholder-[#B0A89F] focus:outline-none focus:border-[#4A5D4E] shadow-2xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[#2B2826]">Mật khẩu:</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#7A7267] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Tối thiểu 6 ký tự"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white border border-[#E7E2D9] text-xs text-[#2B2826] placeholder-[#B0A89F] focus:outline-none focus:border-[#4A5D4E] font-mono shadow-2xs"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7267] hover:text-[#2B2826]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-[#4A5D4E] hover:bg-[#3D4D40] text-white font-medium text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                >
                  <span>{loading ? "Đang xử lý..." : tab === 'signup' ? "Tạo Tài Khoản Mới" : "Đăng Nhập Ngay"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Hoặc bằng Google */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#E7E2D9]"></div>
                  <span className="text-[10px] text-[#7A7267] uppercase font-medium">Hoặc Google</span>
                  <div className="flex-1 h-px bg-[#E7E2D9]"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#F4EFEA] border border-[#E7E2D9] text-[#2B2826] font-medium text-xs transition flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer"
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
              <div className="p-3.5 rounded-2xl bg-white border border-[#E7E2D9] space-y-2 shadow-xs">
                <div className="text-[11px] font-semibold text-[#4A5D4E] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Lợi ích khi có tài khoản đám mây:
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-[#2B2826]">
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-[#4A5D4E]" />
                    <span>Học trên điện thoại</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-[#4A5D4E]" />
                    <span>Viết bài trên laptop</span>
                  </div>
                </div>
                <p className="text-[10px] text-[#7A7267] pt-0.5">
                  ✓ Toàn bộ từ vựng Flashcard, điểm số và bài viết sẽ tự động đồng bộ xuyên suốt.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer: Enforced Student Policy */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-[#E7E2D9] bg-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#7A7267] text-[11px]">
            <Lock className="w-3.5 h-3.5 text-[#4A5D4E] shrink-0" />
            <span>Chỉ dành cho học viên có tài khoản Lớp Cô Oanh</span>
          </div>

          {!isSupabaseConfigured && tab !== 'config' && (
            <button
              type="button"
              onClick={() => setTab('config')}
              className="text-[#B88758] hover:text-[#9A6D42] font-medium cursor-pointer"
            >
              Cấu hình Supabase &rarr;
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
