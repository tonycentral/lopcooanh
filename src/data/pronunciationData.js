// src/data/pronunciationData.js
// Bộ cẩm nang & dữ liệu Luyện Phát âm chuẩn Quốc tế cho IELTS Speaking (Band 7.0 - 8.5)

export const IPA_CHART_DATA = {
  monophthongs: [
    { ipa: "iː", example: "sheep /ʃiːp/", type: "Long vowel", tip: "Môi mở bè sang hai bên như đang mỉm cười nhẹ, kéo dài hơi." },
    { ipa: "ɪ", example: "ship /ʃɪp/", type: "Short vowel", tip: "Âm ngắn, dứt khoát, vị trí lưỡi thấp hơn âm /iː/ một chút." },
    { ipa: "ʊ", example: "good /ɡʊd/", type: "Short vowel", tip: "Môi hơi tròn, phát âm dứt khoát từ vòm họng." },
    { ipa: "uː", example: "shoot /ʃuːt/", type: "Long vowel", tip: "Chu môi tròn như đang huýt sáo, giữ âm ngân dài." },
    { ipa: "e", example: "bed /bed/", type: "Short vowel", tip: "Mở miệng vừa phải, lưỡi đặt tự nhiên." },
    { ipa: "ə", example: "teacher /ˈtiːtʃə/", type: "Schwa sound", tip: "Âm phổ biến nhất trong tiếng Anh, thả lỏng toàn bộ cơ miệng." },
    { ipa: "ɜː", example: "bird /bɜːd/", type: "Long vowel", tip: "Lưỡi hơi cong lên chạm nhẹ vòm họng trên, ngân dài." },
    { ipa: "ɔː", example: "door /dɔː/", type: "Long vowel", tip: "Môi tròn, lưỡi kéo sâu về phía sau cuống họng." },
    { ipa: "æ", example: "cat /kæt/", type: "Short vowel", tip: "Hạ cằm xuống sâu, mở rộng miệng theo chiều dọc." },
    { ipa: "ʌ", example: "up /ʌp/", type: "Short vowel", tip: "Âm phát ra từ đáy cổ họng, miệng mở hình bầu dục." },
    { ipa: "ɑː", example: "far /fɑː/", type: "Long vowel", tip: "Mở miệng to, hạ thấp lưỡi, ngân dài từ họng." },
    { ipa: "ɒ", example: "on /ɒn/", type: "Short vowel", tip: "Tròn môi nhẹ, phát âm ngắn dứt khoát." }
  ],
  diphthongs: [
    { ipa: "ɪə", example: "here /hɪə/", tip: "Chuyển mượt mà từ âm /ɪ/ sang âm /ə/." },
    { ipa: "eɪ", example: "wait /weɪt/", tip: "Chuyển từ /e/ sang /ɪ/, mở nhẹ sang hai bên." },
    { ipa: "ʊə", example: "tour /tʊə/", tip: "Chuyển từ /ʊ/ sang /ə/." },
    { ipa: "ɔɪ", example: "boy /bɔɪ/", tip: "Chuyển từ /ɔː/ sang /ɪ/." },
    { ipa: "əʊ", example: "show /ʃəʊ/", tip: "Chuyển từ /ə/ sang /ʊ/." },
    { ipa: "eə", example: "hair /heə/", tip: "Chuyển từ /e/ sang /ə/." },
    { ipa: "aɪ", example: "my /maɪ/", tip: "Chuyển từ /ɑː/ sang /ɪ/." },
    { ipa: "aʊ", example: "cow /kaʊ/", tip: "Chuyển từ /ɑː/ sang /ʊ/." }
  ],
  consonants: [
    { ipa: "p", example: "pen /pen/", type: "Voiceless", tip: "Mím chặt 2 môi rồi bật hơi mạnh, thanh quản không rung." },
    { ipa: "b", example: "bed /bed/", type: "Voiced", tip: "Mím 2 môi rồi bật âm, thanh quản rung rõ." },
    { ipa: "t", example: "tea /tiː/", type: "Voiceless", tip: "Đầu lưỡi chạm nướu răng trên rồi bật hơi dứt khoát." },
    { ipa: "d", example: "did /dɪd/", type: "Voiced", tip: "Đầu lưỡi chạm nướu trên, thanh quản rung." },
    { ipa: "tʃ", example: "church /tʃɜːtʃ/", type: "Voiceless", tip: "Chu môi, đầu lưỡi chạm ngạc cứng rồi bật mạnh." },
    { ipa: "dʒ", example: "judge /dʒʌdʒ/", type: "Voiced", tip: "Khẩu hình giống /tʃ/ nhưng thanh quản rung mạnh." },
    { ipa: "k", example: "cat /kæt/", type: "Voiceless", tip: "Cuống lưỡi nâng chạm ngạc mềm rồi bật hơi." },
    { ipa: "ɡ", example: "get /ɡet/", type: "Voiced", tip: "Cuống lưỡi nâng, thanh quản rung." },
    { ipa: "f", example: "fall /fɔːl/", type: "Voiceless", tip: "Răng cửa trên chạm nhẹ môi dưới, đẩy hơi qua khe răng." },
    { ipa: "v", example: "voice /vɔɪs/", type: "Voiced", tip: "Khẩu hình như /f/ nhưng dây thanh quản rung." },
    { ipa: "θ", example: "think /θɪŋk/", type: "Voiceless", tip: "Đầu lưỡi đặt giữa 2 hàm răng, thổi luồng hơi nhẹ qua kẽ răng." },
    { ipa: "ð", example: "this /ðɪs/", type: "Voiced", tip: "Khẩu hình như /θ/ nhưng phát ra rung âm rõ rệt." },
    { ipa: "s", example: "see /siː/", type: "Voiceless", tip: "Hai hàm răng khép nhẹ, đẩy luồng hơi xì sắc bén." },
    { ipa: "z", example: "zoo /zuː/", type: "Voiced", tip: "Khẩu hình như /s/ nhưng tạo âm rung như tiếng ong kêu." },
    { ipa: "ʃ", example: "she /ʃiː/", type: "Voiceless", tip: "Chu môi tròn về phía trước, đẩy hơi mạnh." },
    { ipa: "ʒ", example: "vision /ˈvɪʒ.ən/", type: "Voiced", tip: "Khẩu hình như /ʃ/ nhưng dây thanh quản rung." },
    { ipa: "m", example: "man /mæn/", type: "Nasal Voiced", tip: "Ngậm môi, luồng hơi thoát ra qua đường mũi." },
    { ipa: "n", example: "no /nəʊ/", type: "Nasal Voiced", tip: "Đầu lưỡi chạm nướu trên, hơi thoát qua mũi." },
    { ipa: "ŋ", example: "sing /sɪŋ/", type: "Nasal Voiced", tip: "Cuống lưỡi nâng chạm vòm họng mềm, hơi thoát qua mũi." },
    { ipa: "h", example: "hat /hæt/", type: "Voiceless", tip: "Mở miệng tự nhiên, thở hơi nhẹ từ cổ họng." },
    { ipa: "l", example: "leg /leɡ/", type: "Voiced", tip: "Đầu lưỡi chạm nướu trên, luồng hơi thoát qua 2 bên rìa lưỡi." },
    { ipa: "r", example: "red /red/", type: "Voiced", tip: "Lưỡi uốn cong về phía sau nhưng không chạm vòm trên." },
    { ipa: "w", example: "wet /wet/", type: "Voiced", tip: "Tròn môi như chuẩn bị phát âm /uː/ rồi bung nhanh." },
    { ipa: "j", example: "yes /jes/", type: "Voiced", tip: "Nâng thân lưỡi lên gần ngạc cứng, lướt nhanh sang nguyên âm sau." }
  ]
};

export const PRONUNCIATION_PILLARS = [
  {
    id: "stress",
    title: "1. Trọng âm từ & Nhịp điệu (Word & Sentence Stress)",
    description: "Nhấn đúng trọng âm quyết định 50% độ tự nhiên và điểm Pronunciation trong IELTS Speaking.",
    rules: [
      {
        name: "Quy tắc Danh từ vs Động từ 2 âm tiết",
        explanation: "Hầu hết danh từ 2 âm tiết nhấn âm 1, trong khi động từ 2 âm tiết nhấn âm 2.",
        examples: [
          { word: "PREsent (Noun: Món quà)", ipa: "/ˈprez.ənt/", note: "Nhấn âm 1" },
          { word: "preSENT (Verb: Trình bày)", ipa: "/prɪˈzent/", note: "Nhấn âm 2" },
          { word: "REcord (Noun: Bản ghi)", ipa: "/ˈrek.ɔːd/", note: "Nhấn âm 1" },
          { word: "reCORD (Verb: Thu âm)", ipa: "/rɪˈkɔːd/", note: "Nhấn âm 2" }
        ]
      },
      {
        name: "Quy tắc Hậu tố (Suffixes)",
        explanation: "Các từ có đuôi -tion, -sion, -ic, -ical nhấn vào âm tiết NGAY TRƯỚC NÓ.",
        examples: [
          { word: "EduCAtion", ipa: "/ˌedʒ.uˈkeɪ.ʃən/", note: "Nhấn trước -tion" },
          { word: "EcoNOMic", ipa: "/ˌiː.kəˈnɒm.ɪk/", note: "Nhấn trước -ic" },
          { word: "PhoTOgraphy", ipa: "/fəˈtɒɡ.rə.fi/", note: "Đuôi -y nhấn âm 3 từ dưới lên" }
        ]
      }
    ]
  },
  {
    id: "connected_speech",
    title: "2. Nối âm & Nuốt âm (Connected Speech)",
    description: "Người bản xứ không bao giờ nói từng từ rời rạc. Thành thạo nối âm sẽ giúp bạn đạt từ Band 7.5 trở lên.",
    rules: [
      {
        name: "Linking Consonant to Vowel (Phụ âm nối Nguyên âm)",
        formula: "Từ kết thúc bằng phụ âm + Từ bắt đầu bằng nguyên âm",
        examples: [
          { text: "Hold on", transcription: "Hol-don /həʊl.dɒn/", meaning: "Đợi một chút" },
          { text: "First of all", transcription: "Firs-to-fall /fɜːst.əv.ɔːl/", meaning: "Trước hết" },
          { text: "As a matter of fact", transcription: "A-za-ma-te-ro-fact", meaning: "Thực tế là" }
        ]
      },
      {
        name: "Intrusive /r/ and /w/ (Âm chèn tự nhiên)",
        formula: "Nguyên âm gặp Nguyên âm -> Tự động chèn nhẹ /w/ hoặc /r/",
        examples: [
          { text: "Go out", transcription: "Go-(w)-out /ɡəʊ.waʊt/", note: "Chèn nhẹ âm /w/" },
          { text: "Law and order", transcription: "Law-(r)-and order", note: "Chèn nhẹ âm /r/ trong Anh-Anh" }
        ]
      },
      {
        name: "Elision (Nuốt âm /t/ và /d/ khi đứng giữa 2 phụ âm)",
        formula: "Consonant + /t/ or /d/ + Consonant -> Bỏ phát âm /t/ hoặc /d/",
        examples: [
          { text: "Next door", transcription: "Nex' door /neks.dɔː/", note: "Nuốt âm /t/" },
          { text: "You and me", transcription: "You 'n me /juː.ən.miː/", note: "Nuốt âm /d/" }
        ]
      }
    ]
  },
  {
    id: "shadowing",
    title: "3. Bài luyện Shadowing (Nói đuổi theo giọng Bản xứ)",
    description: "Phương pháp luyện cơ miệng và ngữ điệu tự nhiên số 1 thế giới được các chuyên gia ngôn ngữ khuyên dùng.",
    passages: [
      {
        id: "shad_1",
        topic: "Technological Impact",
        level: "Band 8.0+",
        script: "From my perspective, artificial intelligence is not merely a transient novelty; rather, it represents a fundamental paradigm shift in how human knowledge is generated, synthesized, and deployed across contemporary industries.",
        focusAreas: "Nhấn mạnh các từ mang nội dung: 'fundamental', 'paradigm shift', 'generated', 'synthesized'. Nối âm ở 'is not merely', 'represents a'."
      },
      {
        id: "shad_2",
        topic: "Environmental Sustainability",
        level: "Band 8.0+",
        script: "Unless municipal governments take decisive legislative measures to curb industrial emissions, urban populations will inevitably suffer from chronic respiratory ailments in the foreseeable future.",
        focusAreas: "Ngữ điệu hạ giọng cuối câu khẳng định; nhấn mạnh tính cấp bách ở 'decisive legislative measures'."
      }
    ]
  }
];
