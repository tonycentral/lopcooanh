# IELTS WriteMaster Pro - Lớp Cô Oanh

Ứng dụng web chuyên biệt để luyện viết câu và phát triển đoạn văn **IELTS Writing Task 2** chuẩn Band mục tiêu.

---

## 🌟 Các Tính Năng Nổi Bật

1. **Chọn Band Mục Tiêu (Target Band 5.5 - 8.5+):**
   - Lưu tự động vào `localStorage` của trình duyệt cho mọi phiên học sau mà không bị mất.
   - Hiển thị chi tiết tiêu chuẩn IELTS Examiner cho từng Band (Lexical Resource, Grammatical Range & Accuracy, Coherence & Cohesion).

2. **Chủ Đề Đa Dạng & Chọn Ngẫu Nhiên (Random Topic):**
   - Đầy đủ các chủ đề IELTS Task 2 cốt lõi: *Environment & Climate Change, Education, AI & Automation, Public Health, Crime & Law, Globalization & Culture, etc.*
   - Kèm theo đề bài tiểu luận mẫu (Essay Prompt) sát với đề thi thật.
   - Nút **"Chọn Ngẫu Nhiên"** giúp học sinh luyện phản xạ với các chủ đề bất ngờ.

3. **Luyện Viết Câu Theo Quy Trình 2 Bước:**
   - **Bước 1 - Tập viết với từ vựng & từ đồng nghĩa (Vocab & Synonyms Drill):**
     - Học từ vựng học thuật C1/C2 (meaning, IPA, collocations, so sánh từ Band 6 vs Band 7.5+).
     - Viết câu hoàn chỉnh với từ trọng tâm hoặc từ đồng nghĩa.
     - Hệ thống NLP tự động phân tích: nhận diện từ mục tiêu, kiểm tra câu phức/bị động/mệnh đề quan hệ, cảnh báo từ thông tục viết tắt, và **gợi ý 2 phiên bản câu nâng cấp chuẩn Band 7.5 & 8.5**!
   - **Bước 2 - Viết câu tiếp theo & chấm Coherence (Sentence Chaining & Cohesion):**
     - Hiện ra câu mẫu chuẩn Band (Model Sentence A).
     - Giao nhiệm vụ viết câu tiếp theo (Sentence B) để đưa ra hệ quả, giải pháp hoặc phản biện.
     - Cung cấp sẵn các từ nối học thuật (Consequently, However, A salient example of this is, etc.).
     - Chấm điểm **Coherence & Cohesion (CC)**, kiểm tra tính mạch lạc và kỹ thuật quy chiếu (*this, such measures*).
     - Ghép và hiển thị toàn bộ đoạn văn hoàn chỉnh (Sentence A + Sentence B) kèm câu mẫu chuẩn Band 8.5.

4. **Bộ Chấm Điểm Kép (Dual Scoring Engine):**
   - **NLP Rule-based Engine:** Hoạt động ngoại tuyến 100% không cần mạng hay cài đặt thêm gì.
   - **Gemini AI Examiner:** Hỗ trợ kết nối miễn phí qua Google AI Studio API Key nếu muốn chấm điểm AI chi tiết như giám khảo bản ngữ.

5. **Lịch Sử & Thống Kê Học Tập:**
   - Theo dõi số câu đã viết, tỷ lệ đạt mục tiêu Band, và xem lại lịch sử các câu đã chấm.

---

## 🚀 Cách Chạy Ứng Dụng Trên Localhost

### Cách 1: Chạy nhanh bằng 1 click (Khuyên dùng)
- Nhấp đúp vào file `start.bat` trong thư mục dự án. Trình duyệt sẽ tự động mở tại `http://localhost:5173`.

### Cách 2: Chạy bằng Terminal
```bash
# Cài đặt thư viện (nếu mới tải về)
npm install

# Khởi động máy chủ dev
npm run dev
```
Sau đó mở trình duyệt và truy cập: `http://localhost:5173`.

---

## 🌐 Hướng Dẫn Đưa Lên Online Miễn Phí (Free Hosting & Free Domains)

Khi bạn muốn chia sẻ ứng dụng này cho học sinh hoặc bạn bè truy cập online qua điện thoại hay máy tính bất cứ lúc nào, bạn có thể dùng các nền tảng **hoàn toàn miễn phí 100%**:

### 1. Nền tảng Hosting Miễn Phí Vĩnh Viễn Tốt Nhất
| Nền tảng | Domain miễn phí đi kèm | Điểm mạnh |
|---|---|---|
| **Vercel** *(Khuyên dùng)* | `ten-ung-dung.vercel.app` | Cực nhanh, tự động deploy từ GitHub, có HTTPS miễn phí, CDN tối ưu toàn cầu. |
| **Cloudflare Pages** | `ten-ung-dung.pages.dev` | Không giới hạn băng thông truy cập, bảo mật chống DDoS cao nhất thế giới. |
| **Netlify** | `ten-ung-dung.netlify.app` | Cho phép kéo thả trực tiếp thư mục `dist` lên trang web không cần Git. |
| **GitHub Pages** | `username.github.io/lopcooanh` | Miễn phí vĩnh viễn trực tiếp từ kho lưu trữ GitHub. |

### 2. Các Dịch Vụ Cung Cấp Tên Miền Miễn Phí (Free Domains)
- **DuckDNS (`duckdns.org`):** Cấp miễn phí 5 tên miền dạng `*.duckdns.org`, hỗ trợ HTTPS.
- **FreeDNS (`freedns.afraid.org`):** Cho phép tạo tên miền con miễn phí trên hơn 50.000 domain cộng đồng.
- **EU.org (`eu.org`):** Tên miền cấp 1 miễn phí (`*.eu.org`) có đầy đủ Nameserver độc lập.
- **Tên miền riêng giá rẻ ($1 - $2 / năm):** Mua tên miền đuôi `.xyz`, `.top`, `.site` trên Porkbun hoặc Namecheap với giá chỉ khoảng 25.000đ - 50.000đ/năm và gán trực tiếp vào Vercel chỉ trong 1 phút.

### 3. Quy Trình 3 Bước Đưa Lên Vercel (Trong 3 Phút)
1. Chạy lệnh đóng gói:
   ```bash
   npm run build
   ```
2. Đẩy dự án lên một kho lưu trữ GitHub của bạn.
3. Đăng nhập vào [vercel.com](https://vercel.com) bằng tài khoản GitHub &rarr; chọn **"Add New Project"** &rarr; chọn repo &rarr; nhấn **"Deploy"**.
4. Bạn sẽ có ngay đường link online như `https://ielts-lopcooanh.vercel.app` để sử dụng vĩnh viễn!
