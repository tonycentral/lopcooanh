import React, { useState } from 'react';
import { Mail, ArrowRight, AlertCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24211E]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#FAF8F5] border border-[#E6E2D8] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#24211E] space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white p-1 border border-[#E6E2D8] flex items-center justify-center mx-auto shadow-2xs">
            <img 
              src="./logo.png" 
              alt="Lớp cô Oanh" 
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#24211E] tracking-tight">
            Lớp cô Oanh
          </h2>
          <p className="text-xs text-[#7A7369]">
            Nhập email của bạn để lưu tiến độ học tập
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#24211E] block">
              Địa chỉ Email học viên:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A7369]">
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
                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm text-[#24211E] placeholder-[#7A7369] focus:outline-none transition ${
                  error 
                    ? "border-red-400 focus:border-red-500" 
                    : "border-[#E6E2D8] focus:border-[#3E4F42]"
                }`}
              />
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-sm transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Tiếp tục</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-[11px] text-[#7A7369]">
          Hệ thống sẽ tự động lưu và khôi phục cài đặt Band &amp; Task cho email này.
        </p>

      </div>
    </div>
  );
}
