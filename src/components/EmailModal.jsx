import React, { useState } from 'react';
import { Mail, ArrowRight, AlertCircle, BookOpen } from 'lucide-react';
import { isValidEmail } from '../services/userService';

export default function EmailModal({ isOpen, onSaveEmail }) {
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = emailInput.trim();

    if (!trimmed) {
      setError("Vui lòng điền email của học viên để tiếp tục.");
      return;
    }

    if (!isValidEmail(trimmed)) {
      setError("Email không đúng định dạng. Vui lòng nhập đúng định dạng (VD: hocvien@gmail.com).");
      return;
    }

    setError("");
    onSaveEmail(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Lớp cô Oanh
          </h2>
          <p className="text-xs sm:text-sm text-indigo-300 font-semibold">
            Vui lòng điền email của học viên để tiếp tục
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 block">
              Địa chỉ Email học viên:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                autoFocus
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  if (error) setError("");
                }}
                placeholder="VD: hocvien@gmail.com"
                className={`w-full pl-10 pr-4 py-3 bg-slate-950 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition ${
                  error 
                    ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/30" 
                    : "border-slate-800 focus:border-indigo-500"
                }`}
              />
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Tiếp tục</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-500">
          Hệ thống sẽ tự động lưu và khôi phục cài đặt Band &amp; Task cho email này ở các lần truy cập sau.
        </p>

      </div>
    </div>
  );
}
