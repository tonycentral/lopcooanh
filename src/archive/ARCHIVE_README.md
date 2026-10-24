# BẢN LƯU TRỮ KIẾN TRÚC & HỆ THỐNG CŨ (LEGACY PLATFORM ARCHIVE)

> **Mốc thời gian lưu trữ:** Tháng 10/2026  
> **Dự án:** Website Lớp Cô Oanh  
> **Mục đích:** Lưu trữ bản thiết kế của nền tảng luyện đề & luyện viết truyền thống trước khi chuyển đổi toàn diện sang mô hình **Nông Trại Tri Thức (IELTS Harvest Farm - Gamification)**.

---

## 1. Các thành phần và module cốt lõi đã được lưu giữ & tích hợp vào Nông trại:

1. **Bộ Công Cụ Luyện Viết IELTS (IELTS Writing Engine):**
   - **Task 1 Visualizer & Practice Pad:** Luyện viết theo biểu đồ (Line, Bar, Pie, Table, Map, Process) với hơn 100 đề thi thật.
   - **Task 2 Step-by-Step Practice Pad:** Phân chia 4 phần viết: Mở bài (Paraphrase), Thân bài 1, Thân bài 2, Kết bài.
   - **Full Essay Workspace:** Không gian viết bài toàn bài (250+ từ) kèm đồng hồ đếm ngược 40 phút và máy chấm điểm AI tiêu chuẩn 4 tiêu chí.
   - *Tích hợp mới:* Kết nối thành **Cối Xay Gió Task 1 & Lò Bí Ngô Task 2** trên Nông trại. Mỗi câu viết đạt điểm cao là một gáo nước tưới cho cây cối mau chín!

2. **Ngân Hàng Dữ Liệu Từ Vựng Học Thuật (Academic Lexicon Databank):**
   - 2,595+ từ vựng học thuật chuẩn Band 7.5+ chia theo 10 chủ đề kinh điển.
   - Hệ thống Synonyms, Collocations, IPA và câu ví dụ văn cảnh Cambridge.
   - *Tích hợp mới:* Kết nối thành **Cánh Đồng Lúa Mì Từ Vựng**. Mỗi lần học từ vựng là một lần gieo hạt và gặt lúa!

3. **Chuyên Trang Flashcard Phản Xạ (Smart Interactive Flashcards):**
   - 4 chế độ rèn luyện: Lật thẻ kinh điển, Trắc nghiệm nhanh, Nối cặp từ đồng nghĩa, Điền từ vào chỗ trống.
   - *Tích hợp mới:* Là cơ chế chăm bón cây trồng hàng ngày.

4. **Hệ Thống Xác Thực & Đồng Bộ Đám Mây (Supabase Cloud Sync):**
   - Lưu trữ an toàn trên PostgreSQL: `profiles`, `writing_history`, `flashcard_progress`.
   - *Tích hợp mới:* Tự động đồng bộ thêm bảng trạng thái Nông trại (`farm_state`) để học sinh đổi máy tính, điện thoại vẫn giữ nguyên nông trại và kho thóc của mình.

---

Toàn bộ các file module cũ (`SentencePractice.jsx`, `VocabularyWorkspace.jsx`, `FullEssayWorkspace.jsx`, `ReadingWorkspace.jsx`, `GrammarWorkspace.jsx`) đều được bảo toàn nguyên vẹn và liên kết trực tiếp làm các phân khu hoạt động trong Nông trại!
