// src/data/grammarData.js
// GIÁO TRÌNH NGỮ PHÁP TOÀN DIỆN CHO IELTS (COMPREHENSIVE IELTS GRAMMAR MODULE)
// Tích hợp từ "Understanding Grammar for IELTS - Sentence" (ZIM) & "Grammar Bible"
// Lộ trình 3 giai đoạn: FORMING (Tạo lập câu) -> DEVELOPING (Phát triển câu) -> MASTERING & PARAPHRASING (Biến hóa câu)

export const GRAMMAR_STAGES = [
  {
    id: "all",
    label: "Tất cả chuyên đề",
    shortLabel: "Tất cả",
    count: 17,
    description: "Toàn bộ lộ trình 17 chuyên đề ngữ pháp học thuật từ cơ bản đến đỉnh cao"
  },
  {
    id: "my_goal",
    label: "Theo mục tiêu của bạn",
    shortLabel: "Mục tiêu",
    description: "Tự động gợi ý các chuyên đề trọng tâm tương thích với Band điểm mục tiêu"
  },
  {
    id: "forming",
    label: "Giai đoạn 1: Tạo lập câu (Forming)",
    shortLabel: "1. Tạo lập câu",
    bandRange: "Band 5.0 - 6.0",
    color: "amber",
    description: "Nắm vững 5 thành phần câu, 5 thì cốt lõi trong IELTS, câu bị động, động từ khuyết thiếu và sự hòa hợp S-V."
  },
  {
    id: "developing",
    label: "Giai đoạn 2: Phát triển câu (Developing)",
    shortLabel: "2. Phát triển câu",
    bandRange: "Band 6.0 - 7.0",
    color: "emerald",
    description: "Mở rộng câu đơn thành câu ghép, câu phức, làm chủ bổ ngữ V-ing/to-V, so sánh kép và các loại mệnh đề phụ."
  },
  {
    id: "mastering",
    label: "Giai đoạn 3: Paraphrasing & Điêu luyện (Mastering)",
    shortLabel: "3. Paraphrasing & Đỉnh cao",
    bandRange: "Band 7.0 - 8.5+",
    color: "indigo",
    description: "4 kỹ thuật Paraphrasing cốt lõi, đảo ngữ học thuật, mệnh đề phân từ, câu chẻ, danh từ hóa và thể giả định."
  }
];

export const KUNGFU_RULES = [
  {
    title: "Must vs. Have to / Be required to trong Task 2",
    tag: "Khách quan học thuật",
    content: "Trong bài luận IELTS Writing Task 2, tránh lạm dụng 'must' vì mang tính chủ quan của người viết. Hãy ưu tiên 'have to' hoặc 'be required to' để thể hiện nghĩa vụ và tính quy chuẩn khách quan của luật pháp, chính sách."
  },
  {
    title: "Sự khác biệt sống còn: The number of vs. A number of",
    tag: "Task 1 & Task 2",
    content: "'The number of + N(số nhiều)' luôn chia động từ SỐ ÍT (vì chủ ngữ là con số). Ví dụ: 'The number of cars IS increasing'. Ngược lại, 'A number of + N(số nhiều)' mang nghĩa là 'many' nên chia động từ SỐ NHIỀU: 'A number of people ARE migrating'."
  },
  {
    title: "Tuyệt đối không dùng 'What' trong mệnh đề tính từ (quan hệ)",
    tag: "Lỗi cấm kỵ",
    content: "'What' chỉ dùng trong mệnh đề danh từ (làm chủ ngữ hoặc tân ngữ: 'What is needed is money'). Khi bổ nghĩa cho danh từ đứng trước, bắt buộc dùng WHO, WHICH hoặc THAT. Không bao giờ viết: 'The book what I read' (SAI)."
  },
  {
    title: "Lỗi Comma Splice (Dấu phẩy nối 2 mệnh đề độc lập)",
    tag: "Punctuation Control",
    content: "Không được nối 2 mệnh đề độc lập hoàn chỉnh chỉ bằng một dấu phẩy. Hãy dùng liên từ (and/but/so/whereas), dấu chấm phẩy (; however,) hoặc biến một vế thành mệnh đề phụ thuộc (Although/Since)."
  },
  {
    title: "Quy tắc so sánh hơn trong IELTS Task 1",
    tag: "Writing Task 1",
    content: "Để ăn trọn điểm GRA & Lexical trong biểu đồ: thay vì chỉ viết 'higher than', hãy dùng cấu trúc so sánh tỉ lệ: 'was twice as high as', 'outnumbered by a factor of 3', hoặc 'in stark contrast to'."
  },
  {
    title: "Trật tự tính từ đứng trước danh từ (OSASCOMP)",
    tag: "Cụm danh từ",
    content: "Khi có nhiều tính từ bổ nghĩa cho một danh từ: Opinion (Ý kiến) -> Size (Kích cỡ) -> Age (Độ tuổi) -> Shape (Hình dạng) -> Color (Màu sắc) -> Origin (Nguồn gốc) -> Material (Chất liệu) -> Purpose (Mục đích)."
  }
];

export const IELTS_GRAMMAR_LESSONS = [
  // =========================================================================
  // GIAI ĐOẠN 1: TẠO LẬP CÂU (FORMING A SENTENCE) - BAND 5.0 - 6.0
  // =========================================================================
  {
    id: "sentence_components",
    stage: "forming",
    bandTarget: "Band 5.0 - 6.0",
    minBand: 5.0,
    graCriterion: "Basic Sentence Formation & Parts of Speech",
    title: "1. Thành phần câu & 5 mô hình câu trần thuật cơ bản",
    summary: "Nền tảng của ngữ pháp tiếng Anh: làm chủ Chủ ngữ (S), Động từ (V), Tân ngữ (O), Bổ ngữ (C) và Trạng ngữ (A) để không bao giờ viết câu cụt hoặc sai cấu trúc.",
    kungfuNote: "Trong câu trần thuật học thuật, Chủ ngữ luôn đứng trước Động từ. Một câu hoàn chỉnh bắt buộc phải có đủ S và V có thì.",
    frequency: "Nền móng xuyên suốt cho cả Task 1, Task 2 và 3 Parts của Speaking",
    structures: [
      {
        name: "Mô hình S + V + C (Bổ ngữ cho chủ ngữ sau Linking Verbs)",
        formula: "Subject + Linking Verb (be, become, seem, appear) + Complement (Adj/Noun)",
        band6: "Education is good.",
        band8: "Quality tertiary education is indispensable to a nation's socio-economic progression.",
        explanation: "Bổ ngữ (Complement) đứng sau các động từ nối giúp làm rõ bản chất hoặc trạng thái của chủ ngữ."
      },
      {
        name: "Mô hình S + V + IO + DO (Động từ hai tân ngữ: Trực tiếp & Gián tiếp)",
        formula: "S + Verb + Indirect Object (người) + Direct Object (vật) = S + V + DO + to/for + IO",
        band6: "The school gave students many scholarships.",
        band8: "The university awarded merit-based scholarships to underprivileged undergraduates.",
        explanation: "Phân biệt chuyển đổi linh hoạt giữa 'award sb sth' và 'award sth to sb' để đa dạng hóa cú pháp."
      },
      {
        name: "Mô hình S + V + O + C (Bổ ngữ cho tân ngữ)",
        formula: "S + Verb (make, consider, find, render) + Object + Complement",
        band6: "Computers make student study easier.",
        band8: "Technological innovations have rendered international communication remarkably effortless.",
        explanation: "'Render + Object + Adj' là cấu trúc học thuật thay thế đắt giá cho 'make sth easier'."
      }
    ],
    exercises: [
      {
        id: "comp_ex_1",
        type: "correct",
        prompt: "Phát hiện và sửa lỗi thiếu thành phần trong câu: 'Careful driving one of the most effective solutions to reduce traffic accidents.'",
        hint: "Câu đang thiếu động từ chính (Verb). Cần bổ sung động từ to be.",
        expected: "Careful driving is one of the most effective solutions to reduce traffic accidents.",
        acceptableAlternatives: [
          "Careful driving is one of the most effective solutions to reduce road accidents.",
          "Careful driving remains one of the most effective solutions to reduce traffic accidents."
        ],
        explanation: "'Careful driving' mới chỉ là Cụm danh từ chủ ngữ, câu bắt buộc phải có động từ chính 'is' kết nối với vị ngữ."
      },
      {
        id: "comp_ex_2",
        type: "rewrite",
        prompt: "Viết lại câu sau dùng cấu trúc 'rendered + Object + Complement': 'Automated machines made many factory jobs obsolete.'",
        hint: "Bắt đầu với: 'Automated machines have rendered...'",
        expected: "Automated machines have rendered numerous routine factory positions obsolete.",
        acceptableAlternatives: [
          "Automated machines have rendered many factory jobs obsolete.",
          "Automation has rendered many factory jobs obsolete."
        ],
        explanation: "'Render + O + Adj' là cách viết học thuật chuẩn mực trong bài luận giải quyết nguyên nhân - hệ quả."
      }
    ]
  },
  {
    id: "verb_tenses_ielts",
    stage: "forming",
    bandTarget: "Band 5.5 - 6.0",
    minBand: 5.5,
    graCriterion: "Grammatical Accuracy: 5 Core IELTS Tenses",
    title: "2. 5 Thì động từ thực chiến trong IELTS Writing & Speaking",
    summary: "Trong 12 thì tiếng Anh, bài thi IELTS chủ yếu xoay quanh 5 thì: Quá khứ đơn (Task 1 số liệu lịch sử), Hiện tại đơn (Task 2 chân lý/luận điểm), Hiện tại tiếp diễn (xu hướng biến đổi), Hiện tại hoàn thành (ảnh hưởng kéo dài) và Tương lai đơn (dự báo xu hướng).",
    kungfuNote: "Lưu ý Task 1: Nếu biểu đồ ghi năm 2010 -> dùng Quá khứ đơn. Nếu ghi năm 2035 -> dùng cấu trúc dự báo 'is predicted / projected to + V' thay vì chỉ dùng 'will'.",
    frequency: "Quyết định tính chuẩn xác (Accuracy) trong 100% bài viết",
    structures: [
      {
        name: "Hiện tại tiếp diễn miêu tả xu hướng biến chuyển (Task 2 & Speaking)",
        formula: "S + is/are + currently + V-ing / witnessing an ongoing shift...",
        band6: "More people are overweight.",
        band8: "The proportion of overweight individuals is escalating alarmingly in numerous metropolitan centres.",
        explanation: "Dùng thì hiện tại tiếp diễn kèm các trạng từ chỉ xu hướng (increasingly, steadily) để diễn tả thực trạng đang thay đổi."
      },
      {
        name: "Hiện tại hoàn thành diễn tả hệ quả kéo dài đến hiện tại",
        formula: "S + has/have + V3/ed + since / over the past few decades",
        band6: "The Internet became very important in human lives.",
        band8: "The Internet has become an indispensable facet of modern human existence over the past two decades.",
        explanation: "Hành động xuất hiện trong quá khứ và để lại kết quả ảnh hưởng sâu sắc đến hiện tại."
      },
      {
        name: "Diễn đạt xu hướng tương lai trong Task 1 (Future Projections)",
        formula: "The figure for X + is projected / anticipated / expected to + V",
        band6: "Car sales will rise in 2030.",
        band8: "Automotive sales are projected to experience an exponential upsurge by the year 2030.",
        explanation: "Thay vì 'will', ngôn ngữ học thuật dùng dạng bị động dự báo 'is projected to' để giữ tính khách quan số liệu."
      }
    ],
    exercises: [
      {
        id: "tense_ex_1",
        type: "fill",
        prompt: "Chia động từ trong ngoặc: 'Since the introduction of strict environmental legislation, public awareness ____________ (increase) considerably.'",
        hint: "Mệnh đề 'Since...' chỉ mốc thời gian bắt đầu từ quá khứ kéo dài đến hiện tại -> dùng Hiện tại hoàn thành.",
        expected: "has increased",
        acceptableAlternatives: ["has increased considerably", "has been increasing"],
        explanation: "Cấu trúc 'Since + mốc thời gian' đòi hỏi mệnh đề chính chia ở thì Hiện tại hoàn thành (has increased)."
      },
      {
        id: "tense_ex_2",
        type: "rewrite",
        prompt: "Viết lại câu số liệu tương lai cho Task 1: 'The number of solar-powered vehicles will increase to 500,000 units by 2035.' (Dùng 'is projected to')",
        hint: "Bắt đầu bằng: 'The number of solar-powered vehicles is projected to...'",
        expected: "The number of solar-powered vehicles is projected to increase to 500,000 units by 2035.",
        acceptableAlternatives: [
          "The number of solar-powered vehicles is predicted to increase to 500,000 units by 2035.",
          "The number of solar-powered vehicles is expected to increase to 500,000 units by 2035."
        ],
        explanation: "Chuyển từ 'will' sang 'is projected to' giúp câu mang chuẩn phong thái báo cáo số liệu của Cambridge."
      }
    ]
  },
  {
    id: "modal_verbs",
    stage: "forming",
    bandTarget: "Band 5.5 - 6.5",
    minBand: 5.5,
    graCriterion: "Modality, Advisability & Academic Objectivity",
    title: "3. Động từ khuyết thiếu & Mức độ chắc chắn (Modal Verbs & Hedging)",
    summary: "Sử dụng can/could, may/might, should/ought to, have to/be required to để diễn đạt mức độ cần thiết, khả năng xảy ra và giữ tính khách quan cho luận điểm.",
    kungfuNote: "Tránh dùng 'must' khi đề xuất giải pháp Task 2 vì mang tính áp đặt độc đoán. Hãy dùng 'should', 'have to' hoặc 'be required to'.",
    frequency: "Xuất hiện trong câu giải pháp (Solutions) và phân tích nguyên nhân Task 2",
    structures: [
      {
        name: "have to vs. be required to (Nghĩa vụ pháp lý khách quan)",
        formula: "Citizens / Companies + are required to + V-bare",
        band6: "Every company must pay tax.",
        band8: "Commercial enterprises are legally required to comply with statutory corporate taxation regulations.",
        explanation: "'Be required to' khách quan hơn nhiều so với 'must', rất phù hợp với ngữ cảnh luật pháp chính sách."
      },
      {
        name: "may / might / could (Dự báo khả năng xảy ra không tuyệt đối hóa)",
        formula: "S + may/might/could + lead to / result in + Noun Phrase",
        band6: "Playing too many video games will make children aggressive.",
        band8: "Excessive exposure to violent interactive games could potentially foster aggressive behavioral patterns among minors.",
        explanation: "Sử dụng 'could potentially' (hedging) giúp bảo vệ luận điểm không bị quy chụp sai lệch."
      }
    ],
    exercises: [
      {
        id: "modal_ex_1",
        type: "rewrite",
        prompt: "Viết lại dùng 'be required to' để tăng tính khách quan: 'High school students must attend internship courses before graduation.'",
        hint: "Bắt đầu bằng: 'High school students are required to...'",
        expected: "High school students are required to attend internship courses before graduation.",
        acceptableAlternatives: [
          "High school students are required to participate in internship courses before graduation."
        ],
        explanation: "'Be required to' thay thế hoàn hảo cho 'must', tạo lập văn phong học thuật trung lập."
      }
    ]
  },
  {
    id: "passive_voice_process_map",
    stage: "forming",
    bandTarget: "Band 5.5 - 6.5",
    minBand: 5.5,
    graCriterion: "Passive Voice in Process & Map Reports",
    title: "4. Thể bị động trong quy trình (Process) & Bản đồ (Map) Task 1",
    summary: "Thể bị động tập trung vào hành động và đối tượng chịu tác động thay vì người thực hiện — là công cụ ngữ pháp bắt buộc khi viết bài miêu tả sơ đồ và quy trình.",
    kungfuNote: "Nội động từ (arrive, happen, occur, remain, fall) KHÔNG BAO GIỜ chia bị động. Tuyệt đối không viết: 'The accident was happened' (SAI).",
    frequency: "Chiếm 80% cấu trúc trong Writing Task 1 dạng Process (Quy trình sản xuất) và Map (Bản đồ)",
    structures: [
      {
        name: "Miêu tả các bước trong quy trình công nghiệp",
        formula: "First, [Object] is/are + V3/ed. Subsequently, they are transported to...",
        band6: "Workers collect plastic bottles and take them to the factory.",
        band8: "Discarded plastic bottles are systematically collected and transported to dedicated sorting facilities for chemical decontamination.",
        explanation: "Ẩn chủ ngữ chung chung 'Workers' để tập trung hoàn toàn vào vòng tuần hoàn của vật thể."
      },
      {
        name: "Miêu tả sự thay đổi công trình trong bản đồ (Map)",
        formula: "[Old building] was demolished / converted into [New facility] to make way for...",
        band6: "People destroyed the old library and built a new conference room.",
        band8: "The outdated library was demolished to make way for the construction of a state-of-the-art conference complex.",
        explanation: "'was demolished to make way for' là cụm collocation bị động kinh điển ăn trọn điểm Task 1 Map."
      }
    ],
    exercises: [
      {
        id: "pass_map_1",
        type: "rewrite",
        prompt: "Viết lại câu miêu tả Map dùng bị động 'was demolished to make way for': 'The university tore down the old student cafeteria and built a research laboratory in 2020.'",
        hint: "Bắt đầu với: 'The old student cafeteria was demolished...'",
        expected: "The old student cafeteria was demolished to make way for a modern research laboratory in 2020.",
        acceptableAlternatives: [
          "The old student cafeteria was demolished to make way for a research laboratory in 2020.",
          "The old student cafeteria was knocked down to make way for a research laboratory in 2020."
        ],
        explanation: "Cấu trúc bị động 'was demolished to make way for...' thể hiện chuẩn mực quy ước miêu tả bản đồ học thuật."
      }
    ]
  },
  {
    id: "noun_phrase_modifiers",
    stage: "forming",
    bandTarget: "Band 5.5 - 6.0",
    minBand: 5.5,
    graCriterion: "Noun Phrase Architecture & Determiners",
    title: "5. Cấu tạo Cụm danh từ học thuật & Trật tự tính từ (OSASCOMP)",
    summary: "Xây dựng cụm danh từ chuẩn xác: Hạn định từ (Determiner) + Lượng từ (Quantifiers) + Tính từ bổ nghĩa + Danh từ bổ nghĩa + Danh từ chính.",
    kungfuNote: "Danh từ đóng vai trò bổ nghĩa (Noun modifier) luôn ở DẠNG SỐ ÍT: 'shoe shop' (không phải 'shoes shop'), 'income tax rate' (không phải 'incomes tax rate').",
    frequency: "Tạo lập độ nén thông tin trong mở bài và câu chủ đề đoạn văn",
    structures: [
      {
        name: "Cấu trúc cụm danh từ đa thành phần",
        formula: "Determiner (the) + Quantifier (a number of) + Adjective + Noun Modifier + Head Noun",
        band6: "many good teachers of math",
        band8: "the government's new comprehensive educational development programmes",
        explanation: "Các thành phần bổ trợ xếp theo thứ tự chuẩn xác từ tính chất bao quát đến thực thể cụ thể."
      },
      {
        name: "Lượng từ (Quantifiers) và bẫy 'Most' vs 'Almost'",
        formula: "Most + Plural Noun (nói chung) vs. Most of the + Noun (cụ thể) | Almost all + Noun",
        band6: "Almost students in my class like sports. (SAI NGỮ PHÁP)",
        band8: "Almost all tertiary students recognize the pivotal significance of autonomous academic research.",
        explanation: "Tuyệt đối không dùng 'Almost + Noun'. Phải dùng 'Most students' hoặc 'Almost ALL students'."
      }
    ],
    exercises: [
      {
        id: "np_ex_1",
        type: "correct",
        prompt: "Sửa lỗi dùng từ hạn định trong câu sau: 'Almost young people nowadays rely excessively on social networking platforms.'",
        hint: "Sửa 'Almost' thành 'Most' hoặc 'Almost all'.",
        expected: "Most young people nowadays rely excessively on social networking platforms.",
        acceptableAlternatives: [
          "Almost all young people nowadays rely excessively on social networking platforms."
        ],
        explanation: "'Almost' là trạng từ, không thể bổ nghĩa trực tiếp cho danh từ 'young people'. Phải dùng 'Most' hoặc 'Almost all'."
      }
    ]
  },
  {
    id: "subject_verb_agreement",
    stage: "forming",
    bandTarget: "Band 5.5 - 6.0",
    minBand: 5.5,
    graCriterion: "Subject-Verb Concord & Complex Subjects",
    title: "6. Sự hòa hợp Chủ ngữ - Động từ (Subject-Verb Agreement)",
    summary: "Khắc phục triệt để lỗi mất điểm tai hại nhất: chia sai động từ khi chủ ngữ là cụm phân số, The number of, danh động từ V-ing, hoặc chủ ngữ kép.",
    kungfuNote: "Danh động từ V-ing hoặc Mệnh đề danh từ làm chủ ngữ luôn chia động từ ở DẠNG SỐ ÍT: 'Eating fast food regularly LEADS to obesity' (không phải lead).",
    frequency: "Tiêu chí tiên quyết để bài viết vượt qua ngưỡng Band 6.0",
    structures: [
      {
        name: "The number of (Số ít) vs. A number of (Số nhiều)",
        formula: "The number of + N(plural) + Verb(singular) | A number of + N(plural) + Verb(plural)",
        band6: "The number of private vehicles are rising fast. (SAI)",
        band8: "The number of private vehicles in metropolitan regions is escalating at an unprecedented pace.",
        explanation: "'The number' (con số) là chủ ngữ số ít, do đó động từ chính phải là 'is'."
      },
      {
        name: "Chủ ngữ kép với liên từ: As well as / Together with / Not only... but also",
        formula: "A, as well as B -> chia theo A | Not only A but also B -> chia theo B (danh từ gần nhất)",
        band6: "Alcohol, together with illicit drugs, are banned in many nations. (SAI)",
        band8: "Alcohol, together with other prohibited stimulants, is strictly regulated across multiple international jurisdictions.",
        explanation: "Khi nối bằng 'together with' hoặc 'as well as', động từ chia theo chủ ngữ đầu tiên (Alcohol -> is)."
      }
    ],
    exercises: [
      {
        id: "sva_ex_1",
        type: "correct",
        prompt: "Sửa lỗi hòa hợp chủ ngữ - động từ: 'The proportion of university graduates who fails to secure commensurate employment are climbing rapidly.'",
        hint: "Động từ theo sau 'who' chia theo 'graduates', động từ chính chia theo 'The proportion'.",
        expected: "The proportion of university graduates who fail to secure commensurate employment is climbing rapidly.",
        acceptableAlternatives: [
          "The percentage of university graduates who fail to secure commensurate employment is climbing rapidly."
        ],
        explanation: "'graduates who fail' (số nhiều), nhưng động từ chính của mệnh đề là 'is climbing' (hòa hợp với 'The proportion')."
      }
    ]
  },

  // =========================================================================
  // GIAI ĐOẠN 2: PHÁT TRIỂN CÂU (DEVELOPING A SENTENCE) - BAND 6.0 - 7.0
  // =========================================================================
  {
    id: "verb_complements",
    stage: "developing",
    bandTarget: "Band 6.0 - 7.0",
    minBand: 6.0,
    graCriterion: "Verb Complementation: Gerunds, Infinitives & Collocations",
    title: "7. Bổ ngữ của động từ (Gerunds, Infinitives & Verb + sb + to-V)",
    summary: "Làm chủ các động từ chỉ đi với V-ing (avoid, consider, risk), chỉ đi với to-V (decide, fail, struggle), và nhóm cấu trúc yêu cầu/cho phép (enable sb to V, require sb to V).",
    kungfuNote: "Nhóm động từ đặc biệt: make, let, help -> đi với V-bare (hoặc to-V với help): 'make them understand' (không dùng to understand).",
    frequency: "Viết câu mạch lạc khi diễn đạt động cơ, mục tiêu và lời khuyên chính sách",
    structures: [
      {
        name: "Cấu trúc xúc tác chính sách: enable / empower / encourage sb to V",
        formula: "Subject + enable / permit / empower + Object + to V-bare",
        band6: "Scholarships help students so they can study abroad.",
        band8: "Governmental educational bursaries empower underprivileged students to pursue prestigious tertiary degrees abroad.",
        explanation: "'Empower/enable sb to do sth' biến câu ghép rời rạc thành câu đơn học thuật có độ nén cao."
      },
      {
        name: "Nhóm động từ phòng tránh & cấm đoán: prohibit / prevent sb from V-ing",
        formula: "Subject + deter / prevent / prohibit + Object + from + V-ing",
        band6: "Laws stop people from hunting animals.",
        band8: "Rigorous statutory frameworks effectively deter commercial poachers from exploiting endangered wildlife species.",
        explanation: "Collocation chuẩn 'deter sb from V-ing' thay thế cho cấu trúc non nớt 'stop people from'."
      }
    ],
    exercises: [
      {
        id: "vc_ex_1",
        type: "rewrite",
        prompt: "Viết lại dùng cấu trúc 'enables students to + V': 'Online educational platforms give students the ability to learn at their own pace.'",
        hint: "Bắt đầu bằng: 'Online educational platforms enable students to...'",
        expected: "Online educational platforms enable students to acquire knowledge at their own pace.",
        acceptableAlternatives: [
          "Online educational platforms enable students to learn at their own pace.",
          "Online educational platforms enable students to study at their own pace."
        ],
        explanation: "'Enable somebody to do something' diễn đạt khả năng một cách súc tích, trang trọng."
      }
    ]
  },
  {
    id: "compound_sentences_cohesion",
    stage: "developing",
    bandTarget: "Band 6.0 - 7.0",
    minBand: 6.0,
    graCriterion: "Compound Sentences & Cohesive Device Precision",
    title: "8. Câu ghép & Liên từ đẳng lập (Coordinating Conjunctions & FANBOYS)",
    summary: "Kết hợp hai mệnh đề độc lập bằng FANBOYS (For, And, Nor, But, Or, Yet, So) và dấu chấm phẩy với trạng từ liên kết (; however, ; therefore, ; consequently,).",
    kungfuNote: "Tránh lạm dụng từ nối máy móc đầu câu. Hãy tích hợp từ nối ở giữa hai mệnh đề độc lập với dấu chấm phẩy: 'Clause 1; therefore, Clause 2'.",
    frequency: "Tiêu chí Coherence & Cohesion (CC) và Grammatical Range (GRA)",
    structures: [
      {
        name: "Liên kết hệ quả trang trọng (; therefore, / ; as a consequence,)",
        formula: "Independent Clause 1; therefore, Independent Clause 2",
        band6: "People use too many phones so they have weak social skills.",
        band8: "Excessive reliance on virtual communication platforms is widespread; therefore, younger demographics frequently exhibit diminished interpersonal competence.",
        explanation: "Dấu chấm phẩy kèm 'therefore,' nâng tầm văn phong vượt xa liên từ 'so' thông tục."
      },
      {
        name: "Cặp liên từ sóng đôi (Correlative Conjunctions)",
        formula: "Neither S1 nor S2 + Verb | Not only S1 but also S2 + Verb",
        band6: "Parents and the government must protect children.",
        band8: "Not only individual households but also state authorities bear the collective obligation to safeguard child welfare.",
        explanation: "Cặp liên từ sóng đôi giúp mở rộng dung lượng và tính đối xứng của câu văn."
      }
    ],
    exercises: [
      {
        id: "comp_s_1",
        type: "combine",
        prompt: "Nối 2 câu thành 1 câu ghép dùng dấu chấm phẩy và '; consequently,': 'Many newly graduated students lack practical workplace experience. They struggle to find employment.'",
        hint: "Dùng '; consequently,' ở giữa 2 mệnh đề.",
        expected: "Many newly graduated students lack practical workplace experience; consequently, they confront formidable obstacles in securing employment.",
        acceptableAlternatives: [
          "Many newly graduated students lack practical workplace experience; consequently, they struggle to find employment."
        ],
        explanation: "Dấu chấm phẩy kết hợp trạng từ chuyển tiếp '; consequently,' liên kết ý mạch lạc chuẩn học thuật."
      }
    ]
  },
  {
    id: "advanced_comparisons",
    stage: "developing",
    bandTarget: "Band 6.5 - 7.5",
    minBand: 6.5,
    graCriterion: "Complex Comparisons & Proportional Metrics",
    title: "9. Cấu trúc So sánh IELTS chuyên sâu (Task 1 & Task 2)",
    summary: "Tổng hợp từ ZIM & Grammar Bible: So sánh kép (The more... the more...), So sánh bội số (*twice as many as*, *outnumbered by a factor of X*), và cấu trúc so sánh tương đối (*compared with / in comparison with*).",
    kungfuNote: "Trong Task 1: Tuyệt đối không chỉ liệt kê số liệu đơn thuần. Luôn lồng ghép cấu trúc so sánh bội số hoặc so sánh tương phản để đạt Band 7+ Task Achievement và GRA.",
    frequency: "Xuất hiện trong 100% bài viết Writing Task 1 và câu lập luận tương quan Task 2",
    structures: [
      {
        name: "So sánh kép tương quan nhân quả (The more..., the more...)",
        formula: "The + comparative + S1 + V1, the + comparative + S2 + V2",
        band6: "When people work more, they feel more exhausted.",
        band8: "The more protracted the working hours become, the more severely employees experience psychological and physical exhaustion.",
        explanation: "Cấu trúc 'The more... the more...' phản ánh mối quan hệ tỷ lệ thuận/nghịch mà không cần dùng câu điều kiện rập khuôn."
      },
      {
        name: "So sánh bội số và tỉ lệ chênh lệch trong Writing Task 1",
        formula: "S + was / were + twice / three times as + adj/much + as... | outnumbered by a factor of X",
        band6: "Male students were 400 and female students were only 200.",
        band8: "The number of male undergraduates outnumbered that of their female counterparts by a factor of two, standing at 400 and 200 respectively.",
        explanation: "'outnumbered by a factor of two' hoặc 'twice as many as' là cách diễn đạt đẳng cấp của thí sinh 8.0+."
      },
      {
        name: "Cấu trúc Compared with / In comparison with",
        formula: "Compared with / In comparison with O1, S2 + V2 + comparative...",
        band6: "Life in the countryside is slow, but life in the city is very fast.",
        band8: "In comparison with the tranquil pace of rural existence, urban life proves substantially more demanding and frenetic.",
        explanation: "Mở đầu câu với 'In comparison with...' giúp tạo sự tương phản tức thì cho đoạn văn."
      }
    ],
    exercises: [
      {
        id: "comp_adv_1",
        type: "rewrite",
        prompt: "Viết lại theo cấu trúc 'The more..., the more...': 'When traffic density increases, urban air quality deteriorates accordingly.'",
        hint: "Bắt đầu với: 'The denser the urban traffic becomes,...'",
        expected: "The denser the urban traffic becomes, the more severely atmospheric air quality deteriorates.",
        acceptableAlternatives: [
          "The more urban traffic increases, the more air quality deteriorates.",
          "The denser urban traffic becomes, the more air quality deteriorates."
        ],
        explanation: "Cặp so sánh kép nhấn mạnh sự đồng biến thiên giữa mật độ giao thông và mức độ ô nhiễm không khí."
      },
      {
        id: "comp_adv_2",
        type: "rewrite",
        prompt: "Viết câu so sánh Task 1 dùng 'twice as many as': 'In 2010, there were 400 male engineers, while there were only 200 female engineers.'",
        hint: "Dùng: '...twice as many male engineers as female ones...'",
        expected: "In 2010, the college trained twice as many male engineers as female ones, recording 400 and 200 respectively.",
        acceptableAlternatives: [
          "In 2010, there were twice as many male engineers as female engineers.",
          "In 2010, the number of male engineers was twice as many as that of female engineers."
        ],
        explanation: "Sử dụng 'twice as many as' giúp báo cáo dữ liệu biến chuyển linh hoạt thay vì liệt kê thô."
      }
    ]
  },
  {
    id: "relative_clauses_advanced",
    stage: "developing",
    bandTarget: "Band 6.0 - 7.0",
    minBand: 6.0,
    graCriterion: "Relative Clauses & Punctuation Precision",
    title: "10. Mệnh đề quan hệ & 4 Lỗi sai cấm kỵ (Relative Clauses Mastery)",
    summary: "Làm chủ mệnh đề quan hệ xác định & không xác định (dấu phẩy), mệnh đề quan hệ với giới từ (*through which, in which*), sở hữu cách *whose*, và phòng tránh 4 lỗi: Thiếu động từ chính, Thiếu từ quan hệ, Thừa đối tượng và Chia sai động từ.",
    kungfuNote: "Lỗi thừa đối tượng: 'Children who they play sports' (SAI). Đại từ quan hệ 'who' đã làm chủ ngữ, tuyệt đối không chèn thêm 'they'.",
    frequency: "Chiếm tần suất dày đặc trong việc xây dựng câu phức",
    structures: [
      {
        name: "Non-defining Relative Clause với 'which' bổ nghĩa cho cả câu trước",
        formula: "Main clause, which + Verb (singular)...",
        band6: "Many people move to big cities and this makes traffic jams worse.",
        band8: "An increasing influx of rural laborers migrate to metropolitan regions, which exerts unprecedented strain on civic transportation infrastructures.",
        explanation: "Dấu phẩy + 'which' thay thế cho toàn bộ sự việc ở vế trước, luôn chia động từ số ít 'exerts'."
      },
      {
        name: "Mệnh đề quan hệ giới từ trang trọng (Prep + which / whom)",
        formula: "Noun + in / through / under which + S + V",
        band6: "Smartphones are tools. Students learn and communicate through them.",
        band8: "Smartphones represent versatile educational instruments through which modern students acquire knowledge and maintain academic collaboration.",
        explanation: "Đảo giới từ 'through' lên trước 'which' tạo nên phong thái trang trọng của bài báo khoa học."
      }
    ],
    exercises: [
      {
        id: "rel_adv_1",
        type: "correct",
        prompt: "Phát hiện và sửa lỗi thừa đối tượng: 'People who they exercise regularly have a stronger immune resistance.'",
        hint: "Bỏ đại từ thừa 'they' trong mệnh đề quan hệ.",
        expected: "People who exercise regularly have a stronger immune resistance.",
        acceptableAlternatives: [
          "Individuals who exercise regularly possess a stronger immune system."
        ],
        explanation: "'who' đã đóng vai trò là chủ ngữ đại diện cho 'People', việc chèn thêm 'they' là lỗi ngữ pháp nghiêm trọng."
      },
      {
        id: "rel_adv_2",
        type: "combine",
        prompt: "Nối 2 câu sau dùng ', which + V': 'The government allocated substantial funding to clean energy projects. This reduced municipal carbon emissions.'",
        hint: "Bắt đầu bằng: 'The government allocated substantial funding to clean energy projects, which...'",
        expected: "The government allocated substantial funding to clean energy projects, which substantially reduced municipal carbon emissions.",
        acceptableAlternatives: [
          "The government allocated substantial funding to clean energy projects, which reduced carbon emissions."
        ],
        explanation: "Dấu phẩy + 'which' kết nối kết quả một cách tự nhiên và liên tục."
      }
    ]
  },
  {
    id: "adverbial_clauses_types",
    stage: "developing",
    bandTarget: "Band 6.0 - 7.0",
    minBand: 6.0,
    graCriterion: "Subordinate Adverbial Clauses (Time, Cause, Purpose, Concession)",
    title: "11. 5 Loại mệnh đề trạng ngữ học thuật (Adverbial Clauses)",
    summary: "Xây dựng các mối quan hệ logic chặt chẽ: Mệnh đề thời gian (before, after, when, as soon as), Mệnh đề nguyên nhân (since, as, because), Mệnh đề mục đích (so that, in order that), Mệnh đề nhượng bộ (although, whereas, while), và Mệnh đề điều kiện (if, unless).",
    kungfuNote: "Sau 'Although / Even though' là một MỆNH ĐỀ (S + V). Sau 'Despite / In spite of' là một CỤM DANH TỪ (Noun Phrase) hoặc V-ing.",
    frequency: "Công cụ chính để viết các đoạn thân bài giải thích lập luận PEEL (Point - Explain - Example - Link)",
    structures: [
      {
        name: "Mệnh đề mục đích với 'in order that / so that + S + modal + V'",
        formula: "Main Clause + so that / in order that + S + could / would + V-bare",
        band6: "Governments should raise fuel prices so people will drive less.",
        band8: "Governments ought to escalate fuel levies in order that commuters would be motivated to utilize mass transit alternatives.",
        explanation: "'In order that + S + would/could + V' mang sắc thái trang trọng hơn 'so that'."
      },
      {
        name: "Mệnh đề nhượng bộ cân bằng (While / Whereas)",
        formula: "While S1 + V1, S2 + V2 | S1 + V1, whereas S2 + V2",
        band6: "Coal production went down. But solar power went up quickly.",
        band8: "While fossil fuel extraction witnessed a steep decline, clean solar energy generation surged exponentially over the decade.",
        explanation: "'While' và 'Whereas' cho phép đối chiếu 2 xu hướng song song trong cùng một câu phức mượt mà."
      }
    ],
    exercises: [
      {
        id: "adv_cl_1",
        type: "rewrite",
        prompt: "Viết lại câu sau dùng 'Despite + Noun Phrase': 'Although the state invested heavily in infrastructure, traffic bottlenecks persisted.'",
        hint: "Chuyển mệnh đề sau Although thành cụm danh từ: 'Despite heavy state investment in infrastructure,...'",
        expected: "Despite heavy state investment in infrastructure, urban traffic bottlenecks persisted.",
        acceptableAlternatives: [
          "Despite heavy state investment in infrastructure, traffic bottlenecks persisted.",
          "Despite substantial government investments in infrastructure, traffic congestion persisted."
        ],
        explanation: "Chuyển đổi từ 'Although + clause' sang 'Despite + Noun phrase' chứng minh khả năng biến hóa từ loại linh hoạt."
      }
    ]
  },

  // =========================================================================
  // GIAI ĐOẠN 3: PARAPHRASING & ĐIÊU LUYỆN (MASTERING) - BAND 7.0 - 8.5+
  // =========================================================================
  {
    id: "paraphrasing_techniques",
    stage: "mastering",
    bandTarget: "Band 7.0 - 8.5+",
    minBand: 7.0,
    graCriterion: "Academic Paraphrasing & Lexical-Grammatical Conversion",
    title: "12. 4 Kỹ thuật Paraphrasing bứt phá điểm số IELTS Writing",
    summary: "Từ cuốn ZIM Unit 7: Nắm vững 4 thủ thuật viết lại câu đề bài và câu luận điểm: 1. Đổi cấu trúc (Chủ động <-> Bị động); 2. Đổi dạng từ (Động từ -> Cụm danh từ); 3. Sử dụng chủ ngữ giả (It is / There is); 4. Mở rộng thành phần bổ nghĩa (Mệnh đề quan hệ giải nghĩa).",
    kungfuNote: "Khi paraphrase đề bài Task 2: Tuyệt đối không chỉ thay từng từ bằng từ đồng nghĩa máy móc (synonym swapping). Hãy đổi cấu trúc cú pháp (từ chủ động sang chủ ngữ giả 'It is widely believed that...') kết hợp danh từ hóa.",
    frequency: "Quyết định điểm số trong phần Mở bài (Introduction) và Kết bài (Conclusion) của Writing Task 1 & 2",
    structures: [
      {
        name: "Kỹ thuật 1: Chủ động sang Bị động khách quan với Chủ ngữ giả",
        formula: "Many people believe that S + V -> It is widely asserted / contended that S + V",
        band6: "Many people think that university education should be free.",
        band8: "It is widely contended that tertiary educational tuition should be completely subsidized by national authorities.",
        explanation: "Thay đổi hoàn toàn cấu trúc câu gốc, xóa bỏ đại từ 'Many people' để đưa câu về dạng khách quan."
      },
      {
        name: "Kỹ thuật 2: Đổi dạng từ kết hợp Collocation (Verb -> Noun phrase)",
        formula: "The government should support local businesses -> provide financial assistance to...",
        band6: "The government should support local companies.",
        band8: "Legislative authorities ought to provide comprehensive financial backing for domestic enterprise development.",
        explanation: "Biến động từ 'support' thành cụm danh từ 'financial backing / assistance'."
      },
      {
        name: "Kỹ thuật 3: Sử dụng chủ ngữ giả 'It is necessary for sb to V' hoặc 'There should be'",
        formula: "People need to protect the environment -> There is an urgent imperative to...",
        band6: "We must restrict violent TV shows.",
        band8: "There should be stringent state restrictions imposed on televised media broadcasting gratuitous violence.",
        explanation: "'There should be + Noun + imposed on...' thay thế câu mệnh lệnh chủ quan."
      }
    ],
    exercises: [
      {
        id: "para_ex_1",
        type: "rewrite",
        prompt: "Paraphrase câu đề bài sau dùng Chủ ngữ giả và Thể bị động: 'Many people believe that physical exercise is essential for children's healthy development.'",
        hint: "Bắt đầu bằng: 'It is widely acknowledged that...'",
        expected: "It is widely acknowledged that regular physical exercise plays a pivotal role in children's holistic development.",
        acceptableAlternatives: [
          "It is widely believed that physical exercise is essential for children's healthy development.",
          "It is commonly argued that physical activity is vital for children's overall development."
        ],
        explanation: "Cấu trúc 'It is widely acknowledged that...' là mẫu paraphrase kinh điển mở màn cho mọi bài Task 2 điểm cao."
      },
      {
        id: "para_ex_2",
        type: "rewrite",
        prompt: "Paraphrase câu sau bằng kỹ thuật Danh từ hóa (Nominalization): 'Because house prices are rising rapidly, young couples cannot purchase their own homes.'",
        hint: "Bắt đầu bằng: 'The rapid escalation in residential property valuations has prevented...'",
        expected: "The rapid escalation in residential property valuations has prevented young couples from acquiring their own homes.",
        acceptableAlternatives: [
          "Due to the rapid rise in house prices, young couples struggle to buy a home.",
          "The steep surge in housing prices makes it difficult for young couples to purchase their own homes."
        ],
        explanation: "Biến mệnh đề 'Because house prices are rising rapidly' thành cụm danh từ chủ ngữ 'The rapid escalation in property valuations'."
      }
    ]
  },
  {
    id: "noun_clauses_dummy",
    stage: "mastering",
    bandTarget: "Band 7.0 - 8.5",
    minBand: 7.0,
    graCriterion: "Syntactic Density: Subject Noun Clauses & Emphatic Framing",
    title: "13. Mệnh đề danh từ làm Chủ ngữ & Mở đầu câu với What/That",
    summary: "Đưa cả một mệnh đề lên làm chủ ngữ số ít: 'What + S + V + is...' hoặc 'That + S + V + demonstrates...'. Cấu trúc này tạo điểm nhấn học thuật sắc sảo ngay đầu đoạn văn.",
    kungfuNote: "Khi mệnh đề danh từ làm chủ ngữ, động từ chính luôn chia ở DẠNG SỐ ÍT: 'That the government implemented new laws IS significant' (không dùng are).",
    frequency: "Dùng cho Topic Sentence (Câu mở đoạn luận điểm) trong Writing Task 2",
    structures: [
      {
        name: "Mệnh đề 'What + S + V' làm chủ ngữ chính",
        formula: "What + S + V + is/was + [Core focal noun phrase / that clause]",
        band6: "Students need practical internship experience before graduation.",
        band8: "What modern undergraduates urgently require is direct immersion in authentic professional workplaces prior to degree completion.",
        explanation: "'What modern undergraduates urgently require' đóng vai trò là một khối chủ ngữ danh từ độc đáo."
      },
      {
        name: "Cấu trúc thực tế: 'The fact that + S + V + underscores / highlights...'",
        formula: "The fact that + S + V + [underscores / precipitates / confirms] that...",
        band6: "Obesity is rising among children. This proves junk food ads should be banned.",
        band8: "The fact that juvenile obesity rates continue an unprecedented ascent underscores the imperative for stringent restrictions on fast-food marketing.",
        explanation: "Biến một hiện tượng thực tế thành một luận chứng khoa học chặt chẽ."
      }
    ],
    exercises: [
      {
        id: "nc_ex_1",
        type: "rewrite",
        prompt: "Viết lại câu sau dùng 'What + S + V + is...': 'Society urgently needs clean and renewable energy alternatives.'",
        hint: "Bắt đầu với: 'What contemporary society urgently requires is...'",
        expected: "What contemporary society urgently requires is scalable and clean renewable energy alternatives.",
        acceptableAlternatives: [
          "What society urgently needs is clean and renewable energy alternatives.",
          "What modern society urgently requires is clean and renewable energy alternatives."
        ],
        explanation: "Mệnh đề danh từ mở đầu bằng 'What' định hình sự chú ý của người đọc vào giải pháp then chốt."
      }
    ]
  },
  {
    id: "cleft_sentences_focus",
    stage: "mastering",
    bandTarget: "Band 7.0 - 8.0",
    minBand: 7.0,
    graCriterion: "Emphatic Focus & Syntactic Highlighting",
    title: "14. Câu chẻ nhấn mạnh trọng tâm (It-cleft & Wh-cleft)",
    summary: "Cấu trúc phân tách câu để dồn toàn bộ sự chú ý của giám khảo vào đối tượng cốt lõi: 'It is X that Y' hoặc 'What S + V is...'.",
    kungfuNote: "Có thể dùng 'who' thay cho 'that' khi đối tượng được nhấn mạnh là người: 'It was my professor who guided me'.",
    frequency: "Dùng để chốt hạ giải pháp then chốt hoặc bác bỏ quan điểm đối lập",
    structures: [
      {
        name: "It-cleft (Nhấn mạnh chủ thể hoặc hành động cụ thể)",
        formula: "It is/was + [Emphasized Element] + that/who + ...",
        band6: "Strict legislation can stop illegal wildlife trafficking effectively.",
        band8: "It is stringent legislative enforcement, rather than mere public moral appeals, that serves as the ultimate deterrent against illicit wildlife trafficking.",
        explanation: "Nhấn mạnh vai trò của luật pháp thay vì chỉ kêu gọi đạo đức suông."
      },
      {
        name: "Wh-cleft nhấn mạnh hành động cần ưu tiên",
        formula: "What + S + ought to prioritize + is + [Noun Phrase]",
        band6: "Governments should allocate more budget to basic healthcare.",
        band8: "What national governments ought to prioritize is the equitable redistribution of budgetary allocations toward preventative healthcare infrastructure.",
        explanation: "Đặt mệnh đề 'What...' lên đầu câu tạo cảm giác thôi thúc và phong thái học thuật."
      }
    ],
    exercises: [
      {
        id: "cleft_ex_1",
        type: "rewrite",
        prompt: "Viết lại dùng 'It is... that': 'Parental guidance plays the most vital role in cultivating children's digital literacy.'",
        hint: "Bắt đầu với: 'It is parental guidance that...'",
        expected: "It is parental guidance that plays the most vital role in cultivating children's digital literacy.",
        acceptableAlternatives: [
          "It is parental guidance that plays the most vital role in developing children's digital literacy."
        ],
        explanation: "Câu chẻ It-cleft hướng toàn bộ sự chú ý của người đọc vào đối tượng 'parental guidance'."
      }
    ]
  },
  {
    id: "participle_clauses_reduced",
    stage: "mastering",
    bandTarget: "Band 7.5 - 8.5+",
    minBand: 7.5,
    graCriterion: "Clause Condensation: Present, Past & Perfect Participles",
    title: "15. Mệnh đề phân từ rút gọn (Participle Clauses & Reduced Adverbials)",
    summary: "Rút gọn hai mệnh đề có chung chủ ngữ bằng Present Participle (V-ing), Past Participle (V-ed/P2), và Perfect Participle (Having + V3). Đặc biệt là cấu trúc biểu thị hệ quả tất yếu: ', thereby + V-ing'.",
    kungfuNote: "Lỗi Dangling Modifier (Lạc chủ vị): Chủ ngữ của mệnh đề chính bắt buộc phải là thực thể trực tiếp thực hiện hành động phân từ. Không viết: 'Walking down the street, the building was seen' (SAI).",
    frequency: "Xuất hiện trong các câu nối nguyên nhân - kết quả và miêu tả Task 1",
    structures: [
      {
        name: "Present Participle (V-ing) biểu thị hệ quả tiếp nối với thereby / thus",
        formula: "Main clause, thereby / thus + V-ing...",
        band6: "Factories dump toxic waste into rivers, and this pollutes drinking water sources.",
        band8: "Manufacturing plants discharge untreated chemical effluent into local waterways, thereby contaminating municipal potable water supplies.",
        explanation: "Sử dụng ', thereby contaminating' để nối liền nguyên nhân và hệ quả mà không cần tách hai câu đơn."
      },
      {
        name: "Past Participle (V-ed/P2) rút gọn thể bị động đứng đầu câu",
        formula: "V-ed/P2 [Modifier]..., S + V...",
        band6: "Because it is supported by government grants, the space program made breakthroughs.",
        band8: "Subsidised substantially by state innovation grants, the aerospace venture achieved unprecedented technological breakthroughs.",
        explanation: "Rút gọn 'Because it was subsidised' thành 'Subsidised substantially by...'."
      },
      {
        name: "Perfect Participle (Having + V3) nhấn mạnh hành động xảy ra trước",
        formula: "Having + V3/ed..., S + V...",
        band6: "After they finished university, students struggle to find jobs.",
        band8: "Having completed tertiary academic degrees, numerous graduates nonetheless confront formidable hurdles in securing commensurate employment.",
        explanation: "Nhấn mạnh thứ tự thời gian hoàn thành trước khi hành động sau diễn ra."
      }
    ],
    exercises: [
      {
        id: "part_ex_1",
        type: "combine",
        prompt: "Gom 2 câu dùng mệnh đề phân từ ', thereby + V-ing': 'The enterprise automated its manufacturing lines. It curtailed operating expenditures by 30%.'",
        hint: "Kết thúc câu với: ', thereby curtailing operating expenditures by 30%.'",
        expected: "The enterprise automated its manufacturing lines, thereby curtailing operating expenditures by 30%.",
        acceptableAlternatives: [
          "The enterprise automated its manufacturing lines, thereby reducing operating expenditures by 30%."
        ],
        explanation: "', thereby + V-ing' là liên kết hoàn hảo biểu thị hệ quả tất yếu trong câu văn học thuật."
      }
    ]
  },
  {
    id: "inversion_academic",
    stage: "mastering",
    bandTarget: "Band 7.5 - 8.5+",
    minBand: 7.5,
    graCriterion: "Rhetorical Force & Syntactic Inversion",
    title: "16. Đảo ngữ học thuật tạo ấn tượng mạnh (Academic Inversion)",
    summary: "Đảo trợ động từ lên trước chủ ngữ khi đứng sau các trạng từ phủ định (Not only, Rarely, Seldom, Under no circumstances) hoặc điều kiện tiên quyết (Only by, Only when) và đảo ngữ câu điều kiện không dùng If (Had it not been for, Were it not for).",
    kungfuNote: "Học thuộc 2 mẫu đảo ngữ điều kiện cực đắt: 'Had it not been for X, S would have V3' (thay cho If it hadn't been for) và 'Were it not for X, S would V'.",
    frequency: "Dùng để nhấn mạnh quan điểm quyết định trong câu luận điểm chính và kết luận Task 2",
    structures: [
      {
        name: "Negative Adverbials: Not only... but also",
        formula: "Not only + Auxiliary + S + V, but S + also + V",
        band6: "Renewable energy protects the environment and it also creates new jobs.",
        band8: "Not only does renewable energy protect the ecosystem, but it also generates thousands of high-skilled employment opportunities.",
        explanation: "Đưa 'Not only' lên đầu câu, mượn trợ động từ 'does' đặt trước chủ ngữ 'renewable energy'."
      },
      {
        name: "Only by / Only when (Nhấn mạnh điều kiện tiên quyết duy nhất)",
        formula: "Only by + V-ing + can/will + S + V",
        band6: "We can only solve traffic congestion by investing in public transit.",
        band8: "Only by heavily subsidising mass public transit systems can metropolitan authorities alleviate perennial traffic congestion.",
        explanation: "Đảo ngữ với 'Only by' thể hiện giải pháp khả thi nhất cho các bài toán hóc búa."
      },
      {
        name: "Đảo ngữ điều kiện loại 3 không dùng IF: Had it not been for",
        formula: "Had it not been for + Noun Phrase, S + would have + V3/ed",
        band6: "If the internet had not been invented, globalization would not be so fast.",
        band8: "Had it not been for the advent of the Internet, the acceleration of global trade integration would have been severely constrained.",
        explanation: "Loại bỏ 'If', đảo 'Had' lên đầu câu tạo phong thái cực kỳ uyên bác."
      }
    ],
    exercises: [
      {
        id: "inv_ex_1",
        type: "rewrite",
        prompt: "Viết lại dùng 'Not only': 'Online education reduces study costs and it also allows students to study at their own pace.'",
        hint: "Bắt đầu bằng: 'Not only does online education reduce study costs, but...'",
        expected: "Not only does online education reduce study costs, but it also allows students to study at their own pace.",
        acceptableAlternatives: [
          "Not only does online education reduce study costs, but it also enables students to study at their own pace."
        ],
        explanation: "Đảo trợ động từ 'does' lên trước chủ ngữ 'online education', giữ nguyên động từ nguyên mẫu 'reduce'."
      },
      {
        id: "inv_ex_2",
        type: "rewrite",
        prompt: "Viết lại câu sau dùng 'Had it not been for': 'If state grants had not been provided, modern medical research would not have achieved these breakthroughs.'",
        hint: "Bắt đầu với: 'Had it not been for state grants,...'",
        expected: "Had it not been for state grants, modern medical research would not have achieved these breakthroughs.",
        acceptableAlternatives: [
          "Had it not been for state grants, medical research would not have achieved these breakthroughs."
        ],
        explanation: "Đảo ngữ điều kiện loại 3 thay thế hoàn toàn cấu trúc 'If' thông thường."
      }
    ]
  },
  {
    id: "nominalisation_density",
    stage: "mastering",
    bandTarget: "Band 8.0 - 8.5+",
    minBand: 7.5,
    graCriterion: "Lexical & Syntactic Density: Nominalisation",
    title: "17. Danh từ hóa học thuật (Academic Nominalisation & Density)",
    summary: "Kỹ thuật tối thượng trong viết văn học thuật: biến mệnh đề nguyên nhân - hệ quả hoặc chuỗi hành động thành các cụm danh từ trừu tượng cô đọng, loại bỏ đại từ chủ quan và nâng cao tính hàn lâm của bài luận.",
    kungfuNote: "Danh từ hóa giúp bạn tránh lặp từ (lexical repetition) và tạo ra độ nén thông tin (syntactic density) tương đương các bài nghiên cứu của Đại học Oxford và Cambridge.",
    frequency: "Đóng vai trò quyết định để bài thi chạm tới Band 8.0 - 9.0 tiêu chí Lexical Resource & Grammatical Range",
    structures: [
      {
        name: "Biến đổi Mệnh đề nhân quả thành Cụm danh từ chủ ngữ",
        formula: "Because S + V -> The [Noun] of X [precipitated / led to] Y",
        band6: "Because cities are growing very quickly, housing prices have increased significantly.",
        band8: "The unabated expansion of urban conurbations has directly precipitated a steep surge in residential property valuations.",
        explanation: "Thay vì dùng liên từ 'Because', biến hành động mở rộng thành cụm 'The unabated expansion'."
      },
      {
        name: "Khách quan hóa qua hậu tố danh từ (-tion, -ment, -ance, -ity)",
        formula: "Active verbal statement -> The rapid [Nominalised Noun] of X resulted in...",
        band6: "People burn more fossil fuels and this makes the planet heat up rapidly.",
        band8: "The excessive combustion of fossil fuels remains a primary determinant of accelerated global climate destabilization.",
        explanation: "Chuyển 'burn fossil fuels' thành 'The excessive combustion of fossil fuels'."
      }
    ],
    exercises: [
      {
        id: "nom_ex_1",
        type: "rewrite",
        prompt: "Danh từ hóa câu sau: 'Because factories emit untreated carbon gases, urban air pollution has become severe.'",
        hint: "Bắt đầu bằng cụm danh từ: 'The untreated emission of industrial carbon gases has precipitated...'",
        expected: "The untreated emission of industrial carbon gases has precipitated severe urban air pollution.",
        acceptableAlternatives: [
          "The untreated emission of carbon gases has caused severe urban air pollution.",
          "The emission of untreated industrial gases has aggravated urban air pollution."
        ],
        explanation: "Chuyển hành động phát thải thành cụm danh từ 'The untreated emission of industrial carbon gases'."
      }
    ]
  }
];
