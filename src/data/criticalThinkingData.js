// src/data/criticalThinkingData.js
// Ngân hàng ý tưởng & Kỹ thuật Tư duy phản biện đa chiều (Critical Thinking & Brainstorming Bank)

export const CRITICAL_THINKING_TOPICS = [
  {
    id: "ct_education",
    topicName: "Giáo dục & Đại học (Education & Higher Learning)",
    icon: "GraduationCap",
    coreQuestion: "Should university education be entirely free for all citizens, funded by taxpayers?",
    perspectives: [
      {
        angle: "Góc nhìn Kinh tế (Economic Perspective)",
        argumentsFor: [
          "Xóa bỏ rào cản tài chính giúp phát hiện và bồi dưỡng nhân tài từ mọi tầng lớp xã hội.",
          "Lực lượng lao động có trình độ đại học đóng góp thuế thu nhập cao hơn và gia tăng GDP quốc gia trong dài hạn."
        ],
        argumentsAgainst: [
          "Gây áp lực tài khóa khổng lồ lên ngân sách nhà nước, buộc phải tăng thuế thu nhập của toàn dân.",
          "Dẫn đến hiện tượng lạm phát bằng cấp (Degree inflation) và dư thừa cử nhân trong khi thiếu hụt lao động tay nghề kỹ thuật."
        ]
      },
      {
        angle: "Góc nhìn Xã hội & Đạo đức (Social & Ethical Perspective)",
        argumentsFor: [
          "Thúc đẩy công bằng xã hội (Social mobility), ngăn ngừa việc phân tầng giàu nghèo qua con đường học vấn.",
          "Giáo dục bậc cao được xem là một quyền cơ bản của con người hơn là một hàng hóa thương mại."
        ],
        argumentsAgainst: [
          "Sinh viên có thể thiếu động lực và trách nhiệm học tập nghiêm túc nếu không phải trả học phí.",
          "Người nghèo không học đại học vẫn phải gánh thuế để tài trợ cho sinh viên gia đình khá giả (Regressive taxation)."
        ]
      }
    ],
    synthesisSolution: "Chính sách hỗn hợp: Nhà nước nên miễn giảm học phí có điều kiện cho các ngành khoa học công nghệ trọng yếu (STEM) và hỗ trợ học bổng toàn phần dựa trên hoàn cảnh (need-based aid) kết hợp chính sách vay vốn ưu đãi trả dần sau khi có việc làm.",
    band8Collocations: [
      "social mobility (sự dịch chuyển xã hội)",
      "degree inflation (lạm phát bằng cấp)",
      "fiscal strain (áp lực tài khóa)",
      "need-based subsidies (trợ cấp dựa trên nhu cầu)",
      "meritocratic allocation (phân bổ theo năng lực)"
    ]
  },
  {
    id: "ct_technology",
    topicName: "Trí tuệ nhân tạo & Quyền riêng tư (AI & Digital Privacy)",
    icon: "Cpu",
    coreQuestion: "Should governments introduce stringent regulations on AI surveillance and facial recognition in public spaces?",
    perspectives: [
      {
        angle: "Góc nhìn An ninh Công cộng (Public Security Perspective)",
        argumentsFor: [
          "Giúp cơ quan thực thi pháp luật phát hiện và ngăn chặn kịp thời các hành vi tội phạm, khủng bố và tìm kiếm người mất tích.",
          "Tự động hóa quản lý giao thông và trật tự đô thị với chi phí nhân lực tối thiểu."
        ],
        argumentsAgainst: [
          "Xâm phạm nghiêm trọng quyền tự do cá nhân và sự ẩn danh hợp pháp của công dân nơi công cộng.",
          "Nguy cơ rò rỉ dữ liệu sinh trắc học cá nhân không thể đảo ngược nếu hệ thống bị xâm nhập."
        ]
      },
      {
        angle: "Góc nhìn Đạo đức & Sai số thuật toán (Ethical & Algorithmic Perspective)",
        argumentsFor: [
          "Thuật toán nhận diện khuôn mặt có thể bị sai lệch (algorithmic bias) đối với các nhóm thiểu số.",
          "Tạo ra hiệu ứng răn đe quá mức (chilling effect), hạn chế quyền tụ tập và bày tỏ chính kiến hòa bình."
        ],
        argumentsAgainst: [
          "Công nghệ nhận diện ngày càng đạt độ chính xác gần như tuyệt đối nhờ mạng nơ-ron học sâu."
        ]
      }
    ],
    synthesisSolution: "Ban hành khung pháp lý minh bạch: Chỉ cho phép áp dụng nhận diện AI có lệnh tư pháp tại các khu vực nguy cơ cao (sân bay, biên giới) và yêu cầu kiểm toán độc lập định kỳ thuật toán để loại bỏ thiên vị.",
    band8Collocations: [
      "algorithmic bias (thiên vị thuật toán)",
      "civil liberties (quyền tự do dân sự)",
      "mass surveillance (giám sát hàng loạt)",
      "chilling effect (hiệu ứng cản trở tự do)",
      "biometric data integrity (tính toàn vẹn dữ liệu sinh trắc học)"
    ]
  },
  {
    id: "ct_environment",
    topicName: "Môi trường & Thuế Carbon (Environment & Carbon Taxes)",
    icon: "Leaf",
    coreQuestion: "Is imposing high carbon taxes on fossil fuel companies the most effective way to combat global warming?",
    perspectives: [
      {
        angle: "Cơ chế Khuyến khích Thị trường (Market Incentive)",
        argumentsFor: [
          "Nguyên tắc 'Người gây ô nhiễm phải trả tiền' (Polluter Pays Principle) buộc doanh nghiệp chuyển hướng sang năng lượng sạch.",
          "Tạo nguồn thu ngân sách tái đầu tư trực tiếp vào hạ tầng điện gió, điện mặt trời và giao thông công cộng."
        ],
        argumentsAgainst: [
          "Doanh nghiệp thường chuyển toàn bộ chi phí thuế này sang người tiêu dùng thông qua việc tăng giá xăng dầu và hàng hóa.",
          "Gây tổn thất năng lực cạnh tranh cho doanh nghiệp nội địa nếu các quốc gia láng giềng không áp dụng thuế tương đương."
        ]
      }
    ],
    synthesisSolution: "Kết hợp thuế carbon với 'Cổ tức khí hậu' (Carbon Dividend): Hoàn trả trực tiếp doanh thu thuế carbon cho các hộ gia đình thu nhập thấp để bù đắp chi phí sinh hoạt, đồng thời bảo hộ biên giới carbon (CBAM).",
    band8Collocations: [
      "polluter pays principle (nguyên tắc người gây ô nhiễm phải trả tiền)",
      "carbon dividend (cổ tức khí hậu)",
      "market distortion (biến dạng thị trường)",
      "renewable transition (chuyển dịch sang năng lượng tái tạo)"
    ]
  }
];

export const CRITICAL_THINKING_FRAMEWORKS = [
  {
    id: "fw_peel",
    name: "Mô hình PEEL (Point - Explain - Evidence - Link)",
    usage: "Khung chuẩn mực để viết đoạn văn thân bài IELTS Writing Task 2 điểm 8.0+",
    steps: [
      { step: "P (Point)", desc: "Câu chủ đề ngắn gọn nêu trực diện luận điểm duy nhất của đoạn." },
      { step: "E (Explain)", desc: "Giải thích cơ chế logic 'Tại sao điều đó lại diễn ra?' (Sử dụng liên từ cause-and-effect)." },
      { step: "E (Evidence)", desc: "Đưa ra dẫn chứng thực tế, số liệu nghiên cứu hoặc case study điển hình để tăng tính thuyết phục." },
      { step: "L (Link)", desc: "Câu chốt kết nối luận điểm này trở lại với câu hỏi đề bài và quan điểm xuyên suốt." }
    ]
  },
  {
    id: "fw_multi_angle",
    name: "Kỹ thuật Phân tích Đa chiều (SPELT: Social - Political - Economic - Legal - Tech)",
    usage: "Phương pháp brainstorm ý tưởng khi gặp đề bài hóc búa, không bị bí từ hoặc cạn ý",
    angles: [
      "Social (Xã hội & Tâm lý con người)",
      "Political (Chính trị & Quan hệ quốc tế)",
      "Economic (Tài chính, Chi phí & Việc làm)",
      "Legal (Luật pháp & Quy định nhà nước)",
      "Technological (Đổi mới công nghệ & Tự động hóa)"
    ]
  }
];
