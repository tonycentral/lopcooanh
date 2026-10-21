// src/data/grammarData.js
// Bộ cấu trúc ngữ pháp học thuật trọng tâm IELTS Band 7.0 - 8.5+

export const IELTS_GRAMMAR_LESSONS = [
  {
    id: "inversion",
    title: "1. Đảo ngữ (Inversion for Emphasis)",
    bandTarget: "Band 7.5 - 8.5",
    summary: "Kỹ thuật đảo trợ động từ lên trước chủ ngữ nhằm tạo ấn tượng mạnh mẽ cho giám khảo về khả năng kiểm soát cú pháp học thuật.",
    frequency: "Cực kỳ hữu ích trong Writing Task 2 & Speaking Part 3",
    structures: [
      {
        name: "Negative Adverbials (Not only... but also)",
        formula: "Not only + Auxiliary + S + V, but S + also + V",
        band6: "Renewable energy protects the environment and it also creates new jobs.",
        band8: "Not only does renewable energy protect the ecosystem, but it also generates thousands of high-skilled employment opportunities.",
        explanation: "Đưa 'Not only' lên đầu câu, mượn trợ động từ 'does' đặt trước chủ ngữ 'renewable energy'."
      },
      {
        name: "Under no circumstances / On no account",
        formula: "Under no circumstances + should/can + S + V",
        band6: "Governments should never cut spending on public healthcare.",
        band8: "Under no circumstances should governments compromise on national healthcare expenditures, especially during fiscal crises.",
        explanation: "Dùng để nhấn mạnh quan điểm dứt khoát trong câu kết luận hoặc câu luận điểm chính của Task 2."
      },
      {
        name: "Only by / Only when (Nhấn mạnh điều kiện tiên quyết)",
        formula: "Only by + V-ing + can/will + S + V",
        band6: "We can only solve traffic congestion by investing in public transit.",
        band8: "Only by heavily subsidising mass public transit systems can metropolitan authorities alleviate perennial traffic congestion.",
        explanation: "Đảo ngữ với 'Only by' thể hiện giải pháp khả thi nhất cho các bài toán hóc búa."
      },
      {
        name: "Rarely / Seldom / Little",
        formula: "Rarely/Seldom + Auxiliary + S + V",
        band6: "Young people rarely pay attention to traditional crafts nowadays.",
        band8: "Rarely do younger demographics exhibit genuine interest in heritage craftsmanships without targeted institutional advocacy.",
        explanation: "Dùng thay cho 'almost never' để câu văn mang sắc thái trang trọng chuẩn học thuật."
      }
    ],
    exercises: [
      {
        id: "inv_1",
        type: "rewrite",
        prompt: "Rewrite using 'Not only': 'Online education reduces study costs and it also allows students to study at their own pace.'",
        expected: "Not only does online education reduce study costs, but it also allows students to study at their own pace.",
        hint: "Bắt đầu bằng 'Not only does online education reduce...'"
      },
      {
        id: "inv_2",
        type: "rewrite",
        prompt: "Rewrite using 'Only by': 'Societies can preserve cultural identities only if they educate young people about history.'",
        expected: "Only by educating young people about history can societies preserve their cultural identities.",
        hint: "Bắt đầu bằng 'Only by educating...'"
      }
    ]
  },
  {
    id: "conditionals",
    title: "2. Câu điều kiện nâng cao & Đảo ngữ điều kiện",
    bandTarget: "Band 7.5 - 8.5",
    summary: "Sử dụng 'Were it not for', 'Had it not been for', 'Should it occur' thay cho 'If' thông thường.",
    frequency: "Xuất hiện trong các bài luận thảo luận tác động của chính sách hoặc hệ quả lịch sử",
    structures: [
      {
        name: "Đảo ngữ loại 2 (Were it not for)",
        formula: "Were it not for + Noun Phrase, S + would/could + V",
        band6: "If governments did not provide free vaccines, many citizens would die.",
        band8: "Were it not for universal immunization initiatives, countless vulnerable citizens would fall victim to preventable contagions.",
        explanation: "Thay thế 'If it weren't for' bằng cấu trúc trang trọng hơn, phù hợp ngữ cảnh vĩ mô."
      },
      {
        name: "Đảo ngữ loại 3 (Had it not been for)",
        formula: "Had it not been for + Noun Phrase, S + would have + V3/ed",
        band6: "If the internet had not been invented, globalization would not have happened so fast.",
        band8: "Had it not been for the advent of the internet, the pace of global market integration would have been severely constrained.",
        explanation: "Dùng khi lập luận về những sự kiện đã diễn ra trong quá khứ và phân tích nguyên nhân - kết quả."
      },
      {
        name: "Điều kiện hỗn hợp (Mixed Conditionals)",
        formula: "Had + S + V3/ed (Quá khứ), S + would + V (Hiện tại)",
        band6: "Because governments invested in green tech in the past, we have clean energy now.",
        band8: "Had past administrations committed adequate funding to solar R&D, contemporary urban centres would enjoy vastly superior air quality today.",
        explanation: "Liên kết trực tiếp giữa quyết sách trong quá khứ và thực trạng hiện tại."
      }
    ],
    exercises: [
      {
        id: "cond_1",
        type: "rewrite",
        prompt: "Rewrite using 'Had it not been for': 'If artificial intelligence had not emerged, medical diagnosis would not be this rapid.'",
        expected: "Had it not been for the emergence of artificial intelligence, medical diagnosis would not be this rapid.",
        hint: "Bắt đầu bằng 'Had it not been for...'"
      }
    ]
  },
  {
    id: "nominalisation",
    title: "3. Danh từ hóa học thuật (Nominalisation)",
    bandTarget: "Band 8.0+",
    summary: "Chuyển đổi động từ/tính từ thành cụm danh từ để câu văn cô đọng, khách quan và đạt chuẩn văn phong học thuật cao nhất.",
    frequency: "Tiêu chí Lexical Resource & Grammatical Range trong Writing Task 1 & Task 2",
    structures: [
      {
        name: "Chuyển mệnh đề nguyên nhân - kết quả thành cụm danh từ",
        formula: "Because S + V -> The [Noun] of X led to / resulted in Y",
        band6: "Because cities are growing very quickly, housing prices have increased significantly.",
        band8: "The unabated expansion of urban conurbations has directly precipitated a steep surge in residential property valuations.",
        explanation: "Thay vì dùng liên từ 'Because', biến hành động mở rộng thành cụm 'The unabated expansion'."
      },
      {
        name: "Khách quan hóa quan điểm cá nhân",
        formula: "When people consume too much sugar, they get diabetes -> High sugar consumption correlates with...",
        band6: "If people eat too much fast food, they will become obese easily.",
        band8: "Excessive dietary intake of ultra-processed food remains a prime determinant of elevated obesity incidences.",
        explanation: "Loại bỏ chủ ngữ mơ hồ 'people' / 'they', tập trung vào hiện tượng khoa học khách quan."
      }
    ],
    exercises: [
      {
        id: "nom_1",
        type: "rewrite",
        prompt: "Nominalise: 'Because people burn more fossil fuels, the Earth is heating up rapidly.'",
        expected: "The excessive combustion of fossil fuels has accelerated global temperature rise.",
        hint: "Biến 'burn fossil fuels' thành 'The combustion of fossil fuels'..."
      }
    ]
  },
  {
    id: "cleft_sentences",
    title: "4. Câu chẻ nhấn mạnh (Cleft Sentences)",
    bandTarget: "Band 7.0 - 8.0",
    summary: "Cấu trúc 'It is... that' hoặc 'What S + V is...' giúp định vị trọng tâm lập luận một cách sắc bén.",
    frequency: "Dùng để khẳng định giải pháp cốt lõi hoặc nguyên nhân quan trọng nhất",
    structures: [
      {
        name: "It-cleft",
        formula: "It is/was + [Thành phần cần nhấn mạnh] + that/who + ...",
        band6: "Strict legislation can stop illegal wildlife trafficking effectively.",
        band8: "It is stringent legislative enforcement, rather than mere public moral appeals, that serves as the ultimate deterrent against illicit wildlife trafficking.",
        explanation: "Nhấn mạnh vai trò của luật pháp thay vì chỉ kêu gọi đạo đức suông."
      },
      {
        name: "Wh-cleft (Pseudo-cleft)",
        formula: "What + S + V + is/was + [Thành phần trọng tâm]",
        band6: "Students need practical internship experience before graduation.",
        band8: "What modern undergraduates urgently require is direct exposure to authentic corporate workflows prior to entering the job market.",
        explanation: "Đặt 'What modern undergraduates urgently require' lên đầu câu tạo cảm giác thôi thúc và chuyên nghiệp."
      }
    ],
    exercises: [
      {
        id: "cleft_1",
        type: "rewrite",
        prompt: "Rewrite with 'It is': 'Parental guidance plays the most vital role in children's digital literacy.'",
        expected: "It is parental guidance that plays the most vital role in cultivating children's digital literacy.",
        hint: "It is parental guidance that..."
      }
    ]
  },
  {
    id: "participle_clauses",
    title: "5. Mệnh đề phân từ rút gọn (Participle Clauses)",
    bandTarget: "Band 7.5 - 8.5",
    summary: "Rút gọn hai mệnh đề có chung chủ ngữ bằng V-ing, V-ed hoặc Having + V3 để tăng tốc độ và sự liền mạch của bài viết.",
    frequency: "Cực kỳ đắc lực để mô tả biểu đồ Task 1 và dẫn chứng Task 2",
    structures: [
      {
        name: "Present Participle (V-ing) - Hệ quả tiếp nối",
        formula: "Main clause, thereby + V-ing / thus + V-ing",
        band6: "Factories dump toxic waste into rivers, and this pollutes drinking water sources.",
        band8: "Manufacturing plants discharge untreated chemical effluent into local waterways, thereby contaminating municipal potable water supplies.",
        explanation: "Sử dụng ', thereby contaminating' để nối liền nguyên nhân và hệ quả mà không cần tách hai câu đơn."
      },
      {
        name: "Past Participle (V-ed/P2) - Rút gọn bị động",
        formula: "V-ed/P2..., S + V...",
        band6: "Because it is supported by government grants, the space program has made great breakthroughs.",
        band8: "Subsidised substantially by state innovation grants, the aerospace venture has achieved unprecedented technological breakthroughs.",
        explanation: "Rút gọn 'Because it is subsidised' thành 'Subsidised substantially by...'."
      }
    ],
    exercises: [
      {
        id: "part_1",
        type: "rewrite",
        prompt: "Combine using a participle clause: 'The company automated its assembly line. It reduced labor expenses by 30%.'",
        expected: "By automating its assembly line, the enterprise successfully curtailed operating expenditure by 30%.",
        hint: "Bắt đầu với 'Having automated...' hoặc kết câu với ', thereby reducing...'"
      }
    ]
  },
  {
    id: "error_correction",
    title: "6. Phòng tránh 5 bẫy ngữ pháp thường gặp nhất (Band 6 -> 7)",
    bandTarget: "Khắc phục triệt để lỗi mất điểm",
    summary: "Rà soát và sửa các lỗi: Run-on sentence, Comma splice, Lạc chủ vị (Dangling modifier), Lỗi số ít số nhiều và Bất hòa hợp thời thì.",
    frequency: "Giúp bài viết đạt điểm tuyệt đối ở tiêu chí Grammatical Accuracy",
    structures: [
      {
        name: "Lỗi Comma Splice (Nối 2 mệnh đề độc lập chỉ bằng dấu phẩy)",
        formula: "Sai: Clause 1, Clause 2 -> Đúng: Clause 1; however, Clause 2 HOẶC Clause 1, whereas Clause 2",
        band6: "Electric cars are environmentally friendly, they still rely on electricity generated from coal.",
        band8: "While electric vehicles produce zero tailpipe emissions, their lifecycle eco-friendliness remains contingent on the purity of the national electricity grid.",
        explanation: "Không được dùng dấu phẩy đơn độc để nối hai câu hoàn chỉnh. Hãy dùng 'While', 'Whereas' hoặc dấu chấm phẩy."
      },
      {
        name: "Lỗi Dangling Modifier (Rút gọn sai chủ ngữ)",
        formula: "Sai: Walking down the street, the building was seen. -> Đúng: Walking down the street, I saw the building.",
        band6: "By implementing stricter regulations, pollution levels can decrease for citizens.",
        band8: "By implementing stricter regulations, environmental protection agencies can substantially curtail urban smog levels.",
        explanation: "Chủ ngữ của mệnh đề chính phải là thực thể trực tiếp thực hiện hành động rút gọn."
      }
    ],
    exercises: [
      {
        id: "err_1",
        type: "correct",
        prompt: "Spot and fix the error: 'Governments should invest in renewables, this decision will curb global warming.'",
        expected: "Governments should invest in renewables; this strategic policy would significantly curb global warming trends.",
        hint: "Dùng dấu chấm phẩy, hoặc liên từ 'as this will curb...'"
      }
    ]
  }
];
