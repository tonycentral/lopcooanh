import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Layers, 
  Maximize2, 
  CheckCircle2, 
  Sparkles,
  MapPin
} from 'lucide-react';

export default function Task1Visualizer({ topic, onExpandChart, isCompact = false }) {
  if (!topic) return null;

  const chartType = topic.chartType || (topic.id === 'task1-bar-chart' ? 'bar' : topic.id === 'task1-line-graph' ? 'line' : 'process');

  // ================= 0. IMAGE-BASED VISUALIZER (MAPS & COMPLEX PROCESSES) =================
  if (topic.imageUrl || chartType === 'image' || chartType === 'map') {
    const title = topic.chartData?.title || topic.title || topic.name || "Bản đồ / Sơ đồ minh họa";
    const keyNotes = topic.chartData?.keyNotes || topic.keyNotes || [];

    return (
      <div className="flex flex-col h-full bg-white rounded-2xl border border-[#E6E2D8] p-3.5 sm:p-4 space-y-3.5 overflow-y-auto scrollbar-thin text-[#24211E] shadow-sm">
        {/* Title Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-[#E6E2D8] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FAF5EE] text-[#A67C52] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#24211E] leading-tight">
                {title}
              </h3>
              <p className="text-[11px] text-[#7A7369]">Hình ảnh đề bài gốc</p>
            </div>
          </div>

          {onExpandChart && (
            <button
              onClick={onExpandChart}
              className="p-1.5 rounded-lg bg-[#F4EFEA] hover:bg-[#E6E2D8] text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8] transition cursor-pointer"
              title="Phóng to ảnh"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Image Container */}
        <div 
          onClick={onExpandChart}
          className="relative rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E6E2D8] group cursor-pointer shrink-0 flex items-center justify-center p-2"
        >
          <img
            src={topic.imageUrl}
            alt={title}
            className="w-full max-h-72 object-contain mx-auto rounded-lg group-hover:scale-[1.02] transition-transform duration-300"
          />
          {onExpandChart && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-[2px]">
              <Maximize2 className="w-4 h-4" />
              <span>Nhấn để phóng to toàn màn hình</span>
            </div>
          )}
        </div>

        {/* Key Features / Notes for Maps & Process */}
        {keyNotes.length > 0 && (
          <div className="p-3 rounded-xl bg-[#FAF5EE] border border-[#E6E2D8] space-y-1.5 shrink-0 text-[#24211E]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#A67C52]">
              <Sparkles className="w-3.5 h-3.5 text-[#A67C52]" />
              <span>Đặc điểm chính cần đưa vào bài viết (Overview & Body):</span>
            </div>
            <ul className="space-y-1 text-xs text-[#7A7369]">
              {keyNotes.map((note, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#A67C52] shrink-0 mt-0.5" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // ================= 1. BAR CHART VISUALIZER =================
  if (chartType === 'bar' || topic.id === 'task1-bar-chart') {
    const data = topic.chartData || {
      title: "Household Budget Share across 5 Countries (2023)",
      unit: "%",
      categories: [
        { key: "housing", label: "Housing (Nhà ở)", color: "#3E4F42", bgClass: "bg-blue-600", textClass: "text-blue-400" },
        { key: "education", label: "Education (Giáo dục)", color: "#A67C52", bgClass: "bg-emerald-500", textClass: "text-emerald-400" },
        { key: "recreation", label: "Recreation (Giải trí)", color: "#6B5B4D", bgClass: "bg-amber-500", textClass: "text-amber-400" }
      ],
      series: [
        { country: "Country A", housing: 38, education: 28, recreation: 14 },
        { country: "Country B", housing: 35, education: 22, recreation: 12 },
        { country: "Country C", housing: 32, education: 26, recreation: 10 },
        { country: "Country D", housing: 30, education: 18, recreation: 15 },
        { country: "Country E", housing: 24, education: 32, recreation: 6 }
      ],
      keyNotes: [
        "Housing là khoản chi áp đảo ở 4/5 quốc gia (30% - 38%), cao nhất ở Country A.",
        "Country E là ngoại lệ duy nhất khi chi phí Giáo dục (32%) vượt qua Nhà ở (24%).",
        "Recreation luôn là hạng mục có tỉ trọng thấp nhất ở mọi quốc gia (từ 6% đến 15%)."
      ]
    };

    const maxVal = 40;

    return (
      <div className={`flex flex-col h-full bg-white rounded-2xl border border-[#E6E2D8] ${
        isCompact ? "p-2.5 sm:p-3 space-y-2" : "p-3.5 sm:p-4 space-y-3"
      } overflow-y-auto scrollbar-thin text-[#24211E] shadow-sm`}>
        {/* Title Bar */}
        <div className="flex items-center justify-between pb-1.5 border-b border-[#E6E2D8] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#24211E] leading-tight">
                {data.title}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#7A7369]">Đơn vị đo: {data.unit || "%"}</p>
            </div>
          </div>

          {onExpandChart && (
            <button
              onClick={onExpandChart}
              className="p-1.5 rounded-lg bg-[#F4EFEA] hover:bg-[#E6E2D8] text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8] transition cursor-pointer shrink-0"
              title="Phóng to biểu đồ"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 py-1.5 bg-[#FAF8F5] rounded-xl border border-[#E6E2D8] text-[10px] sm:text-[11px] font-semibold shrink-0">
          {data.categories.map((cat) => (
            <div key={cat.key} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded ${cat.bgClass || 'bg-[#3E4F42]'}`} />
              <span className="text-[#7A7369]">{cat.label}</span>
            </div>
          ))}
        </div>

        {/* The Bar Chart Canvas */}
        <div className={`bg-[#FAF8F5] rounded-xl ${isCompact ? "p-2 space-y-1" : "p-3 space-y-2"} border border-[#E6E2D8] shrink-0`}>
          {/* Y-Axis Reference lines (40%, 30%, 20%, 10%, 0%) */}
          <div className={`relative ${isCompact ? "h-28 sm:h-32 pt-2 pb-4" : "h-36 sm:h-44 pt-3 pb-5"} w-full flex items-end justify-between px-1 sm:px-3`}>
            {/* Horizontal Grid lines */}
            <div className={`absolute inset-x-0 ${isCompact ? "top-2 bottom-4" : "top-3 bottom-5"} flex flex-col justify-between pointer-events-none opacity-40`}>
              <div className="border-b border-[#E6E2D8] w-full flex justify-end pr-1 text-[9px] text-[#7A7369]">40%</div>
              <div className="border-b border-[#E6E2D8] w-full flex justify-end pr-1 text-[9px] text-[#7A7369]">30%</div>
              <div className="border-b border-[#E6E2D8] w-full flex justify-end pr-1 text-[9px] text-[#7A7369]">20%</div>
              <div className="border-b border-[#E6E2D8] w-full flex justify-end pr-1 text-[9px] text-[#7A7369]">10%</div>
              <div className="border-b border-[#E6E2D8] w-full flex justify-end pr-1 text-[9px] text-[#7A7369]">0%</div>
            </div>

            {/* Bars for Each Country */}
            {data.series.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center z-10 flex-1 max-w-[68px] sm:max-w-[76px] px-0.5">
                {/* 3 grouped bars */}
                <div className={`w-full flex items-end justify-center gap-0.5 sm:gap-1 ${isCompact ? "h-20 sm:h-24" : "h-28 sm:h-36"}`}>
                  {/* Housing bar */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    <span className="text-[10px] font-bold text-[#3E4F42] opacity-90 group-hover:opacity-100 transition mb-0.5">
                      {item.housing}%
                    </span>
                    <div 
                      style={{ height: `${(item.housing / maxVal) * 100}%` }}
                      className="w-full bg-[#3E4F42] hover:bg-[#334237] rounded-t transition-all shadow-sm"
                      title={`${item.country} - Housing: ${item.housing}%`}
                    />
                  </div>

                  {/* Education bar */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    <span className="text-[10px] font-bold text-[#3E4F42] opacity-90 group-hover:opacity-100 transition mb-0.5">
                      {item.education}%
                    </span>
                    <div 
                      style={{ height: `${(item.education / maxVal) * 100}%` }}
                      className="w-full bg-[#3E4F42] hover:bg-[#334237] rounded-t transition-all shadow-sm"
                      title={`${item.country} - Education: ${item.education}%`}
                    />
                  </div>

                  {/* Recreation bar */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    <span className="text-[10px] font-bold text-[#A67C52] opacity-90 group-hover:opacity-100 transition mb-0.5">
                      {item.recreation}%
                    </span>
                    <div 
                      style={{ height: `${(item.recreation / maxVal) * 100}%` }}
                      className="w-full bg-[#A67C52] hover:bg-[#A67C52] rounded-t transition-all shadow-sm"
                      title={`${item.country} - Recreation: ${item.recreation}%`}
                    />
                  </div>
                </div>

                {/* Country label */}
                <span className="mt-2 text-[10px] sm:text-xs font-bold text-[#24211E] tracking-tight text-center truncate w-full">
                  {item.country}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features for IELTS Writing */}
        {data.keyNotes && data.keyNotes.length > 0 && (
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1.5 shrink-0 text-[#24211E]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#3E4F42]">
              <Sparkles className="w-3.5 h-3.5 text-[#3E4F42]" />
              <span>Đặc điểm chính cần đưa vào bài viết (Overview & Body):</span>
            </div>
            <ul className="space-y-1 text-xs text-[#7A7369]">
              {data.keyNotes.map((note, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3E4F42] shrink-0 mt-0.5" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // ================= 2. LINE GRAPH VISUALIZER =================
  if (chartType === 'line' || topic.id === 'task1-line-graph') {
    return (
      <div className={`flex flex-col h-full bg-white rounded-2xl border border-[#E6E2D8] ${
        isCompact ? "p-2.5 sm:p-3 space-y-2" : "p-3.5 sm:p-4 space-y-3"
      } overflow-y-auto scrollbar-thin text-[#24211E] shadow-sm`}>
        <div className="flex items-center justify-between pb-1.5 border-b border-[#E6E2D8] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#24211E] leading-tight">
                Renewable vs Fossil Fuels (2000 - 2030)
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#7A7369]">Tỉ trọng tiêu thụ (%) qua 3 thập kỷ</p>
            </div>
          </div>
          {onExpandChart && (
            <button
              onClick={onExpandChart}
              className="p-1.5 rounded-lg bg-[#F4EFEA] hover:bg-[#E6E2D8] text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8] transition cursor-pointer shrink-0"
              title="Phóng to biểu đồ"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 py-1.5 bg-[#FAF8F5] rounded-xl border border-[#E6E2D8] text-[10px] sm:text-xs font-semibold shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#A67C52] rounded" />
            <span className="text-[#A67C52]">Nhiên liệu hóa thạch</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#3E4F42] rounded" />
            <span className="text-[#3E4F42]">Năng lượng tái tạo</span>
          </div>
        </div>

        {/* SVG Line Graph */}
        <div className={`bg-[#FAF8F5] rounded-xl ${isCompact ? "p-2" : "p-3"} border border-[#E6E2D8] shrink-0`}>
          <svg viewBox="0 0 400 180" className={`w-full ${isCompact ? "h-28 sm:h-32" : "h-36 sm:h-44"}`}>
            {/* Grid */}
            <line x1="40" y1="20" x2="380" y2="20" stroke="#E6E2D8" strokeDasharray="3 3" />
            <text x="35" y="24" fill="#7A7369" fontSize="9" textAnchor="end">80%</text>

            <line x1="40" y1="60" x2="380" y2="60" stroke="#E6E2D8" strokeDasharray="3 3" />
            <text x="35" y="64" fill="#7A7369" fontSize="9" textAnchor="end">60%</text>

            <line x1="40" y1="100" x2="380" y2="100" stroke="#E6E2D8" strokeDasharray="3 3" />
            <text x="35" y="104" fill="#7A7369" fontSize="9" textAnchor="end">40%</text>

            <line x1="40" y1="140" x2="380" y2="140" stroke="#E6E2D8" strokeDasharray="3 3" />
            <text x="35" y="144" fill="#7A7369" fontSize="9" textAnchor="end">20%</text>

            {/* X-Axis Years */}
            <text x="60" y="165" fill="#24211E" fontSize="10" fontWeight="bold">2000</text>
            <text x="160" y="165" fill="#24211E" fontSize="10" fontWeight="bold">2010</text>
            <text x="260" y="165" fill="#24211E" fontSize="10" fontWeight="bold">2020</text>
            <text x="360" y="165" fill="#24211E" fontSize="10" fontWeight="bold">2030 (proj.)</text>

            {/* Fossil Line (78% -> 68% -> 52% -> 38%) */}
            <polyline
              fill="none"
              stroke="#A67C52"
              strokeWidth="3.5"
              points="75,24 175,44 275,76 375,104"
            />
            <circle cx="75" cy="24" r="4.5" fill="#A67C52" />
            <text x="75" y="16" fill="#A67C52" fontSize="9" fontWeight="bold" textAnchor="middle">78%</text>

            <circle cx="175" cy="44" r="4.5" fill="#A67C52" />
            <text x="175" y="38" fill="#A67C52" fontSize="9" fontWeight="bold" textAnchor="middle">68%</text>

            <circle cx="275" cy="76" r="4.5" fill="#A67C52" />
            <text x="275" y="70" fill="#A67C52" fontSize="9" fontWeight="bold" textAnchor="middle">52%</text>

            <circle cx="375" cy="104" r="4.5" fill="#A67C52" />
            <text x="375" y="98" fill="#A67C52" fontSize="9" fontWeight="bold" textAnchor="middle">38%</text>

            {/* Renewable Line (12% -> 22% -> 39% -> 58%) */}
            <polyline
              fill="none"
              stroke="#3E4F42"
              strokeWidth="3.5"
              points="75,156 175,136 275,102 375,64"
            />
            <circle cx="75" cy="156" r="4.5" fill="#3E4F42" />
            <text x="75" y="150" fill="#3E4F42" fontSize="9" fontWeight="bold" textAnchor="middle">12%</text>

            <circle cx="175" cy="136" r="4.5" fill="#3E4F42" />
            <text x="175" y="130" fill="#3E4F42" fontSize="9" fontWeight="bold" textAnchor="middle">22%</text>

            <circle cx="275" cy="102" r="4.5" fill="#3E4F42" />
            <text x="275" y="96" fill="#3E4F42" fontSize="9" fontWeight="bold" textAnchor="middle">39%</text>

            <circle cx="375" cy="64" r="4.5" fill="#3E4F42" />
            <text x="375" y="58" fill="#3E4F42" fontSize="9" fontWeight="bold" textAnchor="middle">58%</text>

            {/* Intersection Annotation */}
            <circle cx="320" cy="85" r="5" fill="#A67C52" stroke="#ffffff" strokeWidth="1.5" />
            <text x="320" y="78" fill="#A67C52" fontSize="8" fontWeight="bold" textAnchor="middle">Giao điểm ~2027</text>
          </svg>
        </div>

        {/* Key Features */}
        <div className="p-3 rounded-xl bg-[#EDF3EE] border border-[#D1DDD3] space-y-1 text-xs text-[#24211E] shrink-0">
          <div className="font-bold text-[#3E4F42] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#3E4F42]" />
            <span>Đặc điểm chính cho Overview:</span>
          </div>
          <p>• Nhiên liệu hóa thạch giảm liên tục từ 78% xuống còn 38%.</p>
          <p>• Năng lượng sạch tăng trưởng bứt phá (12% lên 58%), vượt hóa thạch vào năm 2027.</p>
        </div>
      </div>
    );
  }

  // ================= 3. PROCESS DIAGRAM VISUALIZER =================
  return (
    <div className={`flex flex-col h-full bg-white rounded-2xl border border-[#E6E2D8] ${
      isCompact ? "p-2.5 sm:p-3 space-y-2" : "p-3.5 sm:p-4 space-y-3.5"
    } overflow-y-auto scrollbar-thin text-[#24211E] shadow-sm`}>
      <div className="flex items-center justify-between pb-1.5 border-b border-[#E6E2D8] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FAF5EE] text-[#A67C52] flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#24211E] leading-tight">
              Quy trình Tái chế Giấy Công nghiệp
            </h3>
            <p className="text-[11px] text-[#7A7369]">5 giai đoạn liên hoàn khép kín</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 shrink-0">
        {[
          { step: "Giai đoạn 1", title: "Thu gom & Phân loại", desc: "Thu hồi giấy phế liệu và tách bỏ rác thải, keo dán, băng dính" },
          { step: "Giai đoạn 2", title: "Tách mực & Tạo bột giấy", desc: "Ngâm dung dịch kiềm nóng và khuấy cơ học thành bột sợi" },
          { step: "Giai đoạn 3", title: "Lọc & Làm sạch", desc: "Lọc cặn bẩn ly tâm để loại bỏ tạp chất siêu nhỏ" },
          { step: "Giai đoạn 4", title: "Cán trục & Ép nhiệt", desc: "Đưa bột giấy qua hệ thống trục lăn sấy nhiệt để ép phẳng" },
          { step: "Giai đoạn 5", title: "Đóng gói bao bì", desc: "Cuộn thành phẩm và đóng gói thành bìa carton thương mại" }
        ].map((item, idx) => (
          <div key={idx} className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-[#EDF3EE] text-[#3E4F42] font-bold text-xs flex items-center justify-center shrink-0">
              {idx + 1}
            </span>
            <div>
              <h4 className="text-xs font-bold text-[#24211E]">{item.title}</h4>
              <p className="text-[11px] text-[#7A7369]">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
