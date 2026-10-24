// src/data/tacticsData.js
// Bộ chiến thuật & Bí kíp xử lý bẫy phòng thi IELTS (Exam Strategies & Tactics Masterclass)

export const EXAM_TACTICS_DATA = [
  {
    skill: "reading",
    skillName: "Chiến thuật IELTS Reading",
    tactics: [
      {
        id: "tac_tfng",
        title: "Bí kíp xử lý dạng True / False / Not Given (Chuẩn xác 100%)",
        rule: "Phân biệt rạch ròi giữa 'False' (Thông tin trong bài đối nghịch trực tiếp với đề) và 'Not Given' (Bài không khẳng định cũng không phủ định).",
        trapAlert: "Bẫy từ chỉ mức độ tuyệt đối (Absolute Qualifiers): always, never, completely, all, solely. Nếu đề bài dùng từ tuyệt đối mà trong bài chỉ nói mức độ tương đối (often, may, tends to), đáp án thường là FALSE.",
        steps: [
          "Bước 1: Đọc câu hỏi, gạch chân từ khóa khó bị paraphrase (Tên riêng, số liệu, năm, thuật ngữ chuyên ngành).",
          "Bước 2: Quét (Scan) định vị đoạn văn chứa thông tin trong bài đọc.",
          "Bước 3: Đọc kỹ câu chứa từ khóa và 1 câu liền kề trước/sau.",
          "Bước 4: Đối chiếu ý nghĩa tổng thể. Nếu bài viết nói A, đề nói KHÔNG PHẢI A -> FALSE. Nếu bài viết nói A, đề nói A TỐT HƠN B (nhưng bài không nhắc gì tới B) -> NOT GIVEN."
        ],
        example: {
          passage: "Studies indicate that regular physical exercise reduces the risk of cardiovascular disease in adults.",
          statement: "Exercise is the only effective way to prevent heart disease.",
          verdict: "FALSE (Bởi vì bài viết chỉ nói 'reduces the risk', không hề khẳng định 'the only effective way')."
        }
      },
      {
        id: "tac_heading",
        title: "Chiến thuật xử lý Matching Headings (Nối tiêu đề đoạn)",
        rule: "Không đọc từ đầu đến cuối đoạn. Đọc theo khung xương đoạn văn (Paragraph Skeleton).",
        trapAlert: "Bẫy từ vựng trùng lặp (Word Matching Trap). Tiêu đề nào chứa y nguyên từ vựng xuất hiện trong đoạn thường là bẫy gây nhiễu.",
        steps: [
          "Bước 1: Luôn làm dạng bài Matching Headings ĐẦU TIÊN để nắm bắt cấu trúc toàn bài.",
          "Bước 2: Gạch chân từ khóa cốt lõi trong danh sách tiêu đề (Roman numerals).",
          "Bước 3: Đọc câu đầu tiên (Topic sentence) và câu cuối cùng (Concluding/Transition sentence) của đoạn văn.",
          "Bước 4: Nếu đoạn văn bắt đầu bằng liên từ tương phản (However, Nevertheless, On the contrary), luận điểm chính thường nằm ngay sau liên từ này."
        ]
      },
      {
        id: "tac_time_rd",
        title: "Chiến thuật phân bổ 60 phút Reading tối ưu (Quy tắc 15 - 20 - 25)",
        rule: "Độ khó của 3 Passages tăng dần. Đừng chia đều 20 phút cho mỗi bài.",
        steps: [
          "Passage 1 (15 phút): Dễ nhất, chủ đề đời thường. Làm nhanh, hạn chế chần chừ.",
          "Passage 2 (20 phút): Độ khó trung bình, nhiều câu hỏi nối thông tin.",
          "Passage 3 (25 phút): Bài đọc học thuật phức tạp, nhiều bẫy trừu tượng. Cần tối đa thời gian để suy luận.",
          "Quy tắc vàng: Điền đáp án trực tiếp vào Answer Sheet, không đợi hết giờ mới chuyển."
        ]
      }
    ]
  },
  {
    skill: "listening",
    skillName: "Chiến thuật IELTS Listening",
    tactics: [
      {
        id: "tac_distractors",
        title: "Chiến thuật bắt bẫy 'Sửa lời' (Distractor Trap)",
        rule: "Người nói trong audio thường đưa ra thông tin giả trước khi tự đính chính thông tin thật.",
        trapAlert: "Cảnh giác cao độ với các tín hiệu chuyển hướng: 'Actually...', 'Wait a second...', 'I thought so, but...', 'No, sorry, that was last year'.",
        steps: [
          "Bước 1: Trong 30 giây chuẩn bị, gạch chân từ khóa và dự đoán loại từ cần điền (danh từ, số điện thoại, ngày tháng, động từ).",
          "Bước 2: Khi nghe thấy đáp án tiềm năng, không vội viết ngay nếu chưa nghe hết câu.",
          "Bước 3: Lắng nghe âm điệu sửa lời để chốt đáp án chính xác sau cùng."
        ]
      },
      {
        id: "tac_maps",
        title: "Chiến thuật xử lý bản đồ (Map / Plan Labelling)",
        rule: "Định vị vị trí đứng xuất phát (Starting point) và xoay chuyển theo phương hướng người nói.",
        steps: [
          "Bước 1: Tìm ngay điểm xuất phát (thường là 'Main Entrance', 'Reception', 'You are here').",
          "Bước 2: Ghi nhớ các mốc cố định và phương hướng La bàn (North, South, East, West).",
          "Bước 3: Lần theo ngón tay trên bản đồ theo lời chỉ dẫn: 'Turn left at the junction', 'Directly opposite to', 'On your far right'."
        ]
      }
    ]
  },
  {
    skill: "writing",
    skillName: "Chiến thuật IELTS Writing (Task 1 & Task 2)",
    tactics: [
      {
        id: "tac_t1_overview",
        title: "Công thức viết đoạn Overview ăn trọn Band 7.0+ Task 1",
        rule: "Overview là trái tim của Task 1. Thiếu Overview không bao giờ vượt qua Band 5.0 tiêu chí Task Achievement.",
        steps: [
          "Không đưa số liệu chi tiết vào đoạn Overview.",
          "Công thức 2 đặc điểm nổi bật nhất: Nhìn toàn cảnh từ đầu năm đến cuối năm (Xu hướng chung: tăng/giảm) và Đối tượng nổi trội nhất (Cao nhất/thấp nhất).",
          "Mẫu câu mẫu: 'Overall, it is readily apparent that while [Category A] experienced an upward trajectory, the reverse was true for [Category B]. Additionally, [Category C] remained the dominant contributor throughout the observed timeframe.'"
        ]
      },
      {
        id: "tac_t2_planning",
        title: "Quy tắc 5 phút Lập dàn ý (Task 2 Outline Blueprint)",
        rule: "Dành trọn vẹn 5 phút đầu tiên để brainstorm và lập outline trước khi đặt bút viết bài.",
        steps: [
          "Bước 1: Phân tích kỹ dạng đề (Agree/Disagree, Discussion, Problem-Solution, Two-part question).",
          "Bước 2: Xác định quan điểm (Thesis Statement) dứt khoát.",
          "Bước 3: Chọn đúng 2 luận điểm mạnh nhất cho 2 đoạn thân bài.",
          "Bước 4: Viết nháp 2 cụm từ vựng Band 8 và 1 ví dụ cụ thể cho mỗi luận điểm."
        ]
      }
    ]
  },
  {
    skill: "speaking",
    skillName: "Chiến thuật IELTS Speaking (Part 1, 2, 3)",
    tactics: [
      {
        id: "tac_spk_filler",
        title: "Kỹ thuật 'Mua thời gian' khi bí ý tưởng (Natural Fillers)",
        rule: "Tuyệt đối không để xảy ra im lặng chết (Dead air) quá 3 giây. Sử dụng các cụm từ đệm tự nhiên để câu giờ suy nghĩ.",
        examples: [
          "That's quite an intriguing question; I haven't genuinely pondered it before, but...",
          "Well, looking at it from an objective standpoint, I'd say that...",
          "It's somewhat difficult to generalize, but predominantly speaking..."
        ]
      },
      {
        id: "tac_spk_p2_1min",
        title: "Phương pháp ghi chú 1 phút Part 2 (Kỹ thuật Quá khứ - Hiện tại - Cảm xúc)",
        rule: "Không viết cả câu hoàn chỉnh trong 1 phút chuẩn bị. Chỉ viết 4-5 từ khóa cốt lõi.",
        steps: [
          "Viết theo trục thời gian: Background (Bối cảnh xảy ra) -> Main action (Hành động kịch tính) -> Reflection (Bài học và cảm xúc đọng lại).",
          "Chuẩn bị sẵn 2-3 collocations đắt giá để cài cắm vào bài nói."
        ]
      }
    ]
  }
];
