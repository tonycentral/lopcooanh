import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Server, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Terminal, 
  Sparkles, 
  Rocket, 
  ShieldCheck 
} from 'lucide-react';

export default function DeploymentGuideModal({ isOpen, onClose }) {
  const [copiedText, setCopiedText] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Hướng Dẫn Chạy Local &amp; Đưa Lên Online Miễn Phí
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  100% Free
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Các giải pháp Hosting và Tên Miền (Domain) miễn phí vĩnh viễn tốt nhất hiện nay
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          
          {/* Section 1: Localhost */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-base">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <span>1. Chạy Web Trên Localhost (Máy Của Bạn)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ứng dụng đang được cấu hình đầy đủ trong thư mục hiện tại. Để khởi động máy chủ thử nghiệm trên máy tính của bạn:
            </p>

            <div className="p-3 rounded-lg bg-black/60 border border-slate-800 font-mono text-xs text-emerald-400 flex items-center justify-between">
              <span>npm run dev</span>
              <button
                onClick={() => handleCopy("npm run dev", "devCmd")}
                className="p-1 rounded text-slate-400 hover:text-white"
                title="Copy lệnh"
              >
                {copiedText === "devCmd" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Sau khi chạy lệnh trên, mở trình duyệt truy cập: <span className="text-indigo-400 font-mono">http://localhost:5173</span>
            </p>
          </div>

          {/* Section 2: Free Hosting & Free Subdomains */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-base">
              <Rocket className="w-5 h-5 text-purple-400" />
              <span>2. Các Nền Tảng Hosting &amp; Domain Miễn Phí Tốt Nhất</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Các dịch vụ này cho phép bạn đưa website lên online mà không tốn bất kỳ chi phí nào, tự động cấp chứng chỉ bảo mật HTTPS:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              {/* Vercel */}
              <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Vercel (Khuyên dùng #1)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    Tốc độ cực nhanh
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Cung cấp tên miền miễn phí dạng: <code className="text-indigo-300 font-mono">ten-web.vercel.app</code>
                </p>
                <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                  <li>Tự động build và deploy chỉ bằng 1 cú click từ GitHub</li>
                  <li>Máy chủ CDN tốc độ cao tại Singapore/Việt Nam</li>
                  <li>Không giới hạn thời hạn sử dụng</li>
                </ul>
              </div>

              {/* Cloudflare Pages */}
              <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span> Cloudflare Pages
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    Không giới hạn
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Cung cấp tên miền miễn phí dạng: <code className="text-amber-300 font-mono">ten-web.pages.dev</code>
                </p>
                <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                  <li>Không giới hạn băng thông truy cập hàng tháng</li>
                  <li>Bảo mật chống tấn công DDoS hàng đầu thế giới</li>
                  <li>Hỗ trợ gán tên miền tùy chỉnh miễn phí</li>
                </ul>
              </div>

              {/* Netlify */}
              <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400"></span> Netlify
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                    Kéo thả trực tiếp
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Cung cấp tên miền miễn phí dạng: <code className="text-sky-300 font-mono">ten-web.netlify.app</code>
                </p>
                <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                  <li>Cho phép kéo thả trực tiếp thư mục <code className="text-slate-200">dist</code> lên web</li>
                  <li>Không bắt buộc phải biết dùng lệnh Git</li>
                </ul>
              </div>

              {/* GitHub Pages */}
              <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span> GitHub Pages
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                    Trực tiếp từ Repo
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Cung cấp tên miền miễn phí: <code className="text-purple-300 font-mono">user.github.io/lopcooanh</code>
                </p>
                <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                  <li>Hoàn toàn miễn phí đi kèm với tài khoản GitHub</li>
                  <li>Thích hợp cho dự án mã nguồn mở và lưu trữ lâu dài</li>
                </ul>
              </div>

            </div>
          </div>

          {/* Section 3: Free Domain Providers */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-base">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>3. Các Dịch Vụ Tên Miền Miễn Phí (Free DNS / Domains)</span>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Nếu bạn muốn một tên miền ngắn riêng biệt trỏ về máy chủ hosting của mình:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-indigo-400">DuckDNS (duckdns.org): </span>
                  <span className="text-slate-300">Cho phép tạo 5 domain miễn phí dạng <code className="text-slate-200">*.duckdns.org</code>, hỗ trợ SSL và cập nhật IP tự động.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-indigo-400">FreeDNS (freedns.afraid.org): </span>
                  <span className="text-slate-300">Hệ thống chia sẻ hơn 50.000 tên miền miễn phí từ cộng đồng, không bao giờ thu phí.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-indigo-400">EU.org: </span>
                  <span className="text-slate-300">Cấp tên miền miễn phí dạng <code className="text-slate-200">*.eu.org</code> có đầy đủ NameServer như một tên miền quốc tế thật.</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
              💡 <span className="font-semibold">Mẹo tiết kiệm:</span> Nếu muốn tên miền riêng thương hiệu ngắn đẹp (như <code className="text-white">ielts-writing.xyz</code> hoặc <code className="text-white">lopcooanh.top</code>), giá chỉ khoảng <strong>$1 - $2 / năm</strong> (khoảng 30.000đ - 50.000đ) trên Porkbun hoặc Namecheap, sau đó gắn miễn phí vào Vercel chỉ trong 1 phút!
            </div>
          </div>

          {/* Section 4: 3-Step Deployment Guide */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 to-purple-950/40 border border-indigo-500/40 space-y-2.5">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Cách đưa web lên online trong 3 bước (Khuyên dùng Vercel)
            </h4>
            <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>Mở terminal, gõ lệnh <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">npm run build</code> để tạo thư mục xuất bản <code className="text-slate-200">dist</code>.</li>
              <li>Đẩy mã nguồn lên tài khoản GitHub của bạn.</li>
              <li>Vào trang <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-sky-400 underline font-semibold">vercel.com</a>, đăng nhập bằng GitHub và nhấn <strong>"Add New Project"</strong> &gt; chọn dự án này &gt; nhấn <strong>"Deploy"</strong>.</li>
            </ol>
            <p className="text-[11px] text-emerald-400 font-medium pt-1">
              ✓ Bạn sẽ nhận được đường link như <code className="text-white">https://lopcooanh-ielts.vercel.app</code> dùng được ngay trên điện thoại và máy tính!
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition cursor-pointer"
          >
            Đóng Hướng Dẫn
          </button>
        </div>
      </div>
    </div>
  );
}
