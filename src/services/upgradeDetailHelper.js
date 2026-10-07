// Helper service to generate detailed, educational upgrade breakdowns
// including IPA phonetics, Vietnamese meanings, Band 5-6 replacements, and grammar analysis.

export const ACADEMIC_LEXICON = {
  // Common High-Band Vocabulary in IELTS Upgrades
  "disproportionately": {
    word: "disproportionately",
    ipa: "/ˌdɪs.prəˈpɔː.ʃən.ət.li/",
    pos: "adverb",
    meaning: "Một cách không cân xứng, quá mức so với tương quan thông thường",
    replaces: "not fairly / too much (Band 5-6)"
  },
  "imperative": {
    word: "imperative",
    ipa: "/ɪmˈper.ə.tɪv/",
    pos: "adjective / noun",
    meaning: "Cấp bách, mang tính bắt buộc sống còn, không thể trì hoãn",
    replaces: "very important / necessary (Band 5-6)"
  },
  "paramount": {
    word: "paramount",
    ipa: "/ˈpær.ə.maʊnt/",
    pos: "adjective",
    meaning: "Tối quan trọng, có ý nghĩa tối cao vượt trội",
    replaces: "most important (Band 5)"
  },
  "indispensable": {
    word: "indispensable",
    ipa: "/ˌɪn.dɪˈspen.sə.bəl/",
    pos: "adjective",
    meaning: "Thiết yếu tuyệt đối, không thể thiếu được",
    replaces: "needed / must-have (Band 5)"
  },
  "statutory framework": {
    word: "statutory framework",
    ipa: "/ˈstætʃ.ə.tər.i ˈfreɪm.wɜːk/",
    pos: "noun phrase",
    meaning: "Khuôn khổ luật định, hệ thống khung pháp lý chính thức",
    replaces: "laws / legal rules (Band 5)"
  },
  "statutory": {
    word: "statutory",
    ipa: "/ˈstætʃ.ə.tər.i/",
    pos: "adjective",
    meaning: "Do luật quy định, mang tính pháp chế",
    replaces: "legal (Band 5)"
  },
  "enforce": {
    word: "enforce",
    ipa: "/ɪnˈfɔːs/",
    pos: "verb",
    meaning: "Thực thi triệt để, bắt buộc tuân thủ (luật lệ/quy định)",
    replaces: "make people follow (Band 5)"
  },
  "enacting": {
    word: "enacting",
    ipa: "/ɪˈnæk.tɪŋ/",
    pos: "verb (gerund)",
    meaning: "Việc ban hành chính thức (đạo luật/chính sách)",
    replaces: "making laws (Band 5)"
  },
  "adverse consequences": {
    word: "adverse consequences",
    ipa: "/ˈæd.vɜːs ˈkɒn.sɪ.kwən.sɪz/",
    pos: "noun phrase",
    meaning: "Những hệ lụy tiêu cực, tác động bất lợi khôn lường",
    replaces: "bad results (Band 5-6)"
  },
  "adverse": {
    word: "adverse",
    ipa: "/ˈæd.vɜːs/",
    pos: "adjective",
    meaning: "Bất lợi, tiêu cực, đi ngược lại mong muốn",
    replaces: "bad / harmful (Band 5)"
  },
  "ramifications": {
    word: "ramifications",
    ipa: "/ˌræm.ɪ.fɪˈkeɪ.ʃənz/",
    pos: "noun",
    meaning: "Những phân nhánh hệ lụy phức tạp kéo theo",
    replaces: "effects / problems (Band 5-6)"
  },
  "catastrophic": {
    word: "catastrophic",
    ipa: "/ˌkæt.əˈstrɒf.ɪk/",
    pos: "adjective",
    meaning: "Mang tính thảm họa, tàn khốc khôn lường",
    replaces: "very bad / terrible (Band 5)"
  },
  "systemic vulnerabilities": {
    word: "systemic vulnerabilities",
    ipa: "/sɪˈstem.ɪk ˌvʌl.nər.əˈbɪl.ə.tiz/",
    pos: "noun phrase",
    meaning: "Những lỗ hổng, điểm yếu mang tính hệ thống",
    replaces: "weak points (Band 5)"
  },
  "vulnerabilities": {
    word: "vulnerabilities",
    ipa: "/ˌvʌl.nər.əˈbɪl.ə.tiz/",
    pos: "noun",
    meaning: "Những điểm yếu dễ bị tổn thương, khiếm khuyết",
    replaces: "weaknesses (Band 5)"
  },
  "deficiencies": {
    word: "deficiencies",
    ipa: "/dɪˈfɪʃ.ən.siz/",
    pos: "noun",
    meaning: "Sự thiếu hụt, khiếm khuyết cấu trúc nghiêm trọng",
    replaces: "lacks / flaws (Band 5)"
  },
  "equilibrium": {
    word: "equilibrium",
    ipa: "/ˌiː.kwɪˈlɪb.ri.əm/",
    pos: "noun",
    meaning: "Trạng thái cân bằng, thế ổn định vĩ mô",
    replaces: "balance (Band 5)"
  },
  "macroeconomic": {
    word: "macroeconomic",
    ipa: "/ˌmæk.rəʊ.iː.kəˈnɒm.ɪk/",
    pos: "adjective",
    meaning: "Thuộc về kinh tế vĩ mô trên bình diện toàn nền kinh tế",
    replaces: "big economic (Band 5)"
  },
  "intervention": {
    word: "intervention",
    ipa: "/ˌɪn.təˈven.ʃən/",
    pos: "noun",
    meaning: "Sự can thiệp chính sách kịp thời từ cơ quan quản lý",
    replaces: "action / involvement (Band 5)"
  },
  "proactive": {
    word: "proactive",
    ipa: "/prəʊˈæk.tɪv/",
    pos: "adjective",
    meaning: "Chủ động đi trước đón đầu, hành động trước khi rủi ro phát tác",
    replaces: "taking early action (Band 6)"
  },
  "socioeconomic": {
    word: "socioeconomic",
    ipa: "/ˌsəʊ.si.əʊ.iː.kəˈnɒm.ɪk/",
    pos: "adjective",
    meaning: "Thuộc về kinh tế - xã hội đan xen",
    replaces: "social and money (Band 5)"
  },
  "escalation": {
    word: "escalation",
    ipa: "/ˌes.kəˈleɪ.ʃən/",
    pos: "noun",
    meaning: "Sự leo thang căng thẳng, gia tăng nhanh chóng",
    replaces: "increase / growing (Band 5)"
  },
  "relentless": {
    word: "relentless",
    ipa: "/rɪˈlent.ləs/",
    pos: "adjective",
    meaning: "Không ngừng nghỉ, dữ dội và liên tục",
    replaces: "non-stop / continuous (Band 5)"
  },
  "unprecedented": {
    word: "unprecedented",
    ipa: "/ʌnˈpres.ɪ.den.tɪd/",
    pos: "adjective",
    meaning: "Chưa từng có tiền lệ trong lịch sử",
    replaces: "never seen before (Band 5)"
  },
  "consequently": {
    word: "consequently",
    ipa: "/ˈkɒn.sɪ.kwənt.li/",
    pos: "adverb / linking word",
    meaning: "Do đó, như một hệ quả tất yếu (chỉ quan hệ nhân quả mạnh)",
    replaces: "so / therefore (Band 5-6)"
  },
  "as a direct consequence": {
    word: "as a direct consequence",
    ipa: "/æz ə daɪˈrekt ˈkɒn.sɪ.kwəns/",
    pos: "phrase / linking phrase",
    meaning: "Như một hệ quả trực tiếp từ sự việc nói trên",
    replaces: "because of this (Band 5)"
  },
  "in light of this": {
    word: "in light of this",
    ipa: "/ɪn laɪt əv ðɪs/",
    pos: "phrase / linking phrase",
    meaning: "Xét theo bối cảnh này, trước tình hình đó",
    replaces: "knowing this (Band 5)"
  },
  "multilateral": {
    word: "multilateral",
    ipa: "/ˌmʌl.tiˈlæt.ər.əl/",
    pos: "adjective",
    meaning: "Mang tính đa phương, giữa nhiều quốc gia/chính phủ",
    replaces: "many countries (Band 5)"
  },
  "harmonization": {
    word: "harmonization",
    ipa: "/ˌhɑː.mə.naɪˈzeɪ.ʃən/",
    pos: "noun",
    meaning: "Sự hài hòa hóa, đồng bộ hóa quy chuẩn chính sách",
    replaces: "making things match (Band 5)"
  },
  "stringent": {
    word: "stringent",
    ipa: "/ˈstrɪn.dʒənt/",
    pos: "adjective",
    meaning: "Nghiêm ngặt, chặt chẽ, khắt khe (về luật pháp/quy định)",
    replaces: "strict / tight (Band 5-6)"
  },
  "mitigate": {
    word: "mitigate",
    ipa: "/ˈmɪt.ɪ.ɡeɪt/",
    pos: "verb",
    meaning: "Làm dịu bớt, giảm nhẹ tác hại hoặc mức độ nghiêm trọng",
    replaces: "reduce / lessen (Band 5-6)"
  },
  "exacerbate": {
    word: "exacerbate",
    ipa: "/ɪɡˈzæs.ər.beɪt/",
    pos: "verb",
    meaning: "Làm trầm trọng thêm, khiến tình hình tồi tệ hơn nhiều",
    replaces: "make worse (Band 5-6)"
  },
  "detrimental": {
    word: "detrimental",
    ipa: "/ˌdet.rɪˈmen.təl/",
    pos: "adjective",
    meaning: "Gây tổn hại nghiêm trọng, có hại đối với sự phát triển",
    replaces: "harmful / bad (Band 5-6)"
  },
  "sustainable": {
    word: "sustainable",
    ipa: "/səˈsteɪ.nə.bəl/",
    pos: "adjective",
    meaning: "Bền vững, có thể duy trì lâu dài mà không tổn hại tài nguyên",
    replaces: "green / long-term (Band 6)"
  },
  "proliferation": {
    word: "proliferation",
    ipa: "/prəˌlɪf.ərˈeɪ.ʃən/",
    pos: "noun",
    meaning: "Sự gia tăng bùng nổ, nhân rộng nhanh chóng",
    replaces: "rapid growth (Band 5)"
  },
  "discharged": {
    word: "discharged",
    ipa: "/dɪsˈtʃɑːdʒd/",
    pos: "verb (past participle)",
    meaning: "Được xả thải, phóng thích ra môi trường",
    replaces: "released / dumped (Band 5)"
  },
  "deterioration": {
    word: "deterioration",
    ipa: "/dɪˌtɪə.ri.əˈreɪ.ʃən/",
    pos: "noun",
    meaning: "Sự suy thoái, xuống cấp dần về chất lượng",
    replaces: "getting worse (Band 5)"
  },
  "ubiquitous": {
    word: "ubiquitous",
    ipa: "/juːˈbɪk.wɪ.təs/",
    pos: "adjective",
    meaning: "Phổ biến khắp nơi, nhan nhản mọi lúc mọi nơi",
    replaces: "everywhere / very common (Band 5-6)"
  },
  "substantially": {
    word: "substantially",
    ipa: "/səbˈstæn.ʃəl.i/",
    pos: "adverb",
    meaning: "Một cách đáng kể, với số lượng hoặc mức độ lớn",
    replaces: "a lot / significantly (Band 5-6)"
  },
  "drastically": {
    word: "drastically",
    ipa: "/ˈdræs.tɪ.kli/",
    pos: "adverb",
    meaning: "Một cách quyết liệt, mạnh mẽ, thay đổi đột ngột",
    replaces: "strongly / heavily (Band 5)"
  },
  "foster": {
    word: "foster",
    ipa: "/ˈfɒs.tər/",
    pos: "verb",
    meaning: "Nuôi dưỡng, thúc đẩy, tạo điều kiện phát triển tích cực",
    replaces: "encourage / help grow (Band 5-6)"
  },
  "deplete": {
    word: "deplete",
    ipa: "/dɪˈpliːt/",
    pos: "verb",
    meaning: "Làm cạn kiệt nguồn tài nguyên hoặc dự trữ",
    replaces: "use up / run out of (Band 5)"
  },
  "biodiversity": {
    word: "biodiversity",
    ipa: "/ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/",
    pos: "noun",
    meaning: "Đa dạng sinh học, tính phong phú của hệ sinh thái",
    replaces: "variety of animals/plants (Band 5)"
  },
  "contamination": {
    word: "contamination",
    ipa: "/kənˌtæm.ɪˈneɪ.ʃən/",
    pos: "noun",
    meaning: "Sự làm nhiễm bẩn, ô nhiễm độc hại",
    replaces: "pollution / dirt (Band 5)"
  },
  "irreversible": {
    word: "irreversible",
    ipa: "/ˌɪr.ɪˈvɜː.sə.bəl/",
    pos: "adjective",
    meaning: "Không thể đảo ngược lại, không thể cứu vãn",
    replaces: "cannot be changed back (Band 5)"
  },
  "ecological": {
    word: "ecological",
    ipa: "/ˌiː.kəˈlɒdʒ.ɪ.kəl/",
    pos: "adjective",
    meaning: "Thuộc về hệ sinh thái và môi trường tự nhiên",
    replaces: "environmental (Band 5)"
  },
  "articulate": {
    word: "articulate",
    ipa: "/ɑːˈtɪk.jə.leɪt/",
    pos: "verb",
    meaning: "Diễn đạt rõ ràng, gãy gọn các lập luận phức tạp",
    replaces: "express / say clearly (Band 5-6)"
  },
  "persuasively": {
    word: "persuasively",
    ipa: "/pəˈsweɪ.sɪv.li/",
    pos: "adverb",
    meaning: "Một cách đầy sức thuyết phục và chặt chẽ",
    replaces: "convincingly / well (Band 5)"
  },
  "critical thinking": {
    word: "critical thinking",
    ipa: "/ˌkrɪt.ɪ.kəl ˈθɪŋ.kɪŋ/",
    pos: "noun phrase",
    meaning: "Tư duy phản biện, phân tích lập luận đa chiều",
    replaces: "good thinking (Band 5)"
  },
  "pedagogical": {
    word: "pedagogical",
    ipa: "/ˌped.əˈɡɒdʒ.ɪ.kəl/",
    pos: "adjective",
    meaning: "Thuộc về phương pháp sư phạm và nghệ thuật giảng dạy",
    replaces: "teaching (Band 5)"
  },
  "holistic": {
    word: "holistic",
    ipa: "/həʊˈlɪs.tɪk/",
    pos: "adjective",
    meaning: "Toàn diện, nhìn nhận tổng thể đa diện",
    replaces: "full / comprehensive (Band 5-6)"
  },
  "obsolete": {
    word: "obsolete",
    ipa: "/ˈɒb.sə.liːt/",
    pos: "adjective",
    meaning: "Lỗi thời, không còn phù hợp trong bối cảnh mới",
    replaces: "old-fashioned / out of date (Band 5-6)"
  },
  "curriculum": {
    word: "curriculum",
    ipa: "/kəˈrɪk.jə.ləm/",
    pos: "noun",
    meaning: "Chương trình khung đào tạo giảng dạy",
    replaces: "study plan / subjects (Band 5)"
  },
  "autonomy": {
    word: "autonomy",
    ipa: "/ɔːˈtɒn.ə.mi/",
    pos: "noun",
    meaning: "Tính tự chủ, quyền tự quyết độc lập",
    replaces: "independence (Band 5)"
  },
  "collaborative": {
    word: "collaborative",
    ipa: "/kəˈlæb.ər.ə.tɪv/",
    pos: "adjective",
    meaning: "Mang tính cộng tác và phối hợp đa bên",
    replaces: "teamwork / working together (Band 5)"
  },
  "empowering": {
    word: "empowering",
    ipa: "/ɪmˈpaʊ.ər.ɪŋ/",
    pos: "verb (gerund)",
    meaning: "Trao quyền, tiếp thêm năng lực chủ động",
    replaces: "helping / allowing (Band 5)"
  },
  "multifaceted": {
    word: "multifaceted",
    ipa: "/ˌmʌl.tiˈfæs.ɪ.tɪd/",
    pos: "adjective",
    meaning: "Đa chiều, có nhiều khía cạnh phức tạp",
    replaces: "complex / many-sided (Band 5-6)"
  },
  "resilience": {
    word: "resilience",
    ipa: "/rɪˈzɪl.jəns/",
    pos: "noun",
    meaning: "Khả năng chống chịu, phục hồi dẻo dai trước áp lực",
    replaces: "strength / bouncing back (Band 5)"
  }
};

/**
 * Phân tích sâu câu nâng cấp: Trích xuất chi tiết từ vựng (kèm IPA & nghĩa), ngữ pháp và kỹ thuật chuyển câu.
 */
export function analyzeUpgradeDetails({ upgradedSentence = "", vocab = {}, targetBand = "7.0", isPart3 = false }) {
  const sentenceLower = upgradedSentence.toLowerCase();

  // 1. Phân tích từ vựng mục tiêu (Target Word)
  const targetItem = {
    word: vocab.word || "Từ vựng mục tiêu",
    ipa: vocab.ipa || (ACADEMIC_LEXICON[vocab.word?.toLowerCase()]?.ipa) || "/---/",
    pos: vocab.partOfSpeech || (ACADEMIC_LEXICON[vocab.word?.toLowerCase()]?.pos) || "từ vựng",
    meaning: vocab.meaning || (ACADEMIC_LEXICON[vocab.word?.toLowerCase()]?.meaning) || "Nghĩa học thuật chuẩn",
    replaces: vocab.basicEquivalent || (ACADEMIC_LEXICON[vocab.word?.toLowerCase()]?.replaces) || "từ cơ bản Band 5-6",
    isTarget: true
  };

  const vocabularyList = [targetItem];

  // 2. Tìm kiếm các từ vựng học thuật nâng cao khác xuất hiện trong câu nâng cấp
  const detectedKeys = new Set([vocab.word?.toLowerCase()]);

  // Sắp xếp các từ khóa theo độ dài giảm dần để ưu tiên phrase dài trước
  const lexiconKeys = Object.keys(ACADEMIC_LEXICON).sort((a, b) => b.length - a.length);

  for (const key of lexiconKeys) {
    if (detectedKeys.has(key)) continue;

    // Kiểm tra sự xuất hiện của từ/cụm từ trong câu
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(sentenceLower)) {
      vocabularyList.push({
        ...ACADEMIC_LEXICON[key],
        isTarget: false
      });
      detectedKeys.add(key);
      if (vocabularyList.length >= 4) break; // Lấy tối đa 4 từ nổi bật nhất để giao diện gọn gàng
    }
  }

  // Nếu số từ vựng tìm thấy ít, bổ sung các collocation tiêu biểu của từ vựng mục tiêu nếu có
  if (vocabularyList.length < 3 && vocab.collocations && vocab.collocations.length > 0) {
    const col = vocab.collocations[0];
    vocabularyList.push({
      word: col,
      ipa: vocab.ipa ? `${vocab.ipa} + collocations` : "/kɒl.əˈkeɪ.ʃən/",
      pos: "collocation C1/C2",
      meaning: `Cụm từ kết hợp chuẩn mực cùng "${vocab.word}"`,
      replaces: "cách diễn đạt rời rạc thiếu tự nhiên (Band 5-6)",
      isTarget: false
    });
  }

  // 3. Phân tích cấu trúc Ngữ pháp (Grammar Highlights)
  const grammarPoints = [];

  if (/it is (imperative|essential|vital|paramount) that/i.test(sentenceLower)) {
    grammarPoints.push({
      title: "Thể giả định thức học thuật (Subjunctive Mood)",
      formula: "It is imperative / paramount that + S + V(nguyên thể)",
      detail: "Cấu trúc khách quan trang trọng giúp câu văn mang tính học thuật cao, thay thế cho lối diễn đạt trực tiếp 'People must / Leaders should'."
    });
  } else if (/enacting|implementing|fostering/i.test(sentenceLower) && sentenceLower.startsWith("enacting") || sentenceLower.startsWith("implementing")) {
    grammarPoints.push({
      title: "Kỹ thuật Danh từ hóa (Nominalization)",
      formula: "Gerund Phrase (V-ing / The implementation of...) làm Chủ ngữ",
      detail: "Biến đổi hành động thành một khái niệm trừu tượng làm chủ ngữ, giúp câu văn cô đọng và trang trọng đạt chuẩn Band 8.0+."
    });
  } else if (/not only does|not only do/i.test(sentenceLower)) {
    grammarPoints.push({
      title: "Cấu trúc Đảo ngữ nhấn mạnh (Negative Inversion)",
      formula: "Not only do/does + S + V-bare..., but it also...",
      detail: "Thể hiện khả năng kiểm soát ngữ pháp phức tạp (Grammatical Range Band 8.5) để làm nổi bật tác động kép của vấn đề."
    });
  } else if (/thereby \w+ing/i.test(sentenceLower)) {
    grammarPoints.push({
      title: "Mệnh đề phân từ rút gọn (Participle Clause)",
      formula: ", thereby + V-ing (hệ quả tất yếu)",
      detail: "Kết nối hệ quả logic trực tiếp mà không cần dùng thêm mệnh đề phụ rườm rà, tạo nhịp điệu trôi chảy cho câu văn chuẩn Band 8.0+."
    });
  } else if (/serves to \w+/i.test(sentenceLower)) {
    grammarPoints.push({
      title: "Cấu trúc mục đích học thuật (Academic Infinitive Construction)",
      formula: "Subject + serves to + V-bare",
      detail: "Khẳng định công năng và vai trò cốt lõi của chủ ngữ trong văn cảnh trang trọng (Band 8.0-8.5)."
    });
  } else if (/^by (actively|ensuring|\w+ing)/i.test(sentenceLower)) {
    grammarPoints.push({
      title: "Cụm giới từ phân từ đầu câu (Prepositional Gerund Framing)",
      formula: "By + V-ing..., Main Clause",
      detail: "Nhấn mạnh giải pháp hoặc phương thức hành động ngay từ đầu câu, tạo sự mạch lạc cao trong bài thi IELTS."
    });
  } else if (/it is incumbent upon/i.test(sentenceLower)) {
    grammarPoints.push({
      title: "Cấu trúc nghĩa vụ khách quan (Academic Duty Structure)",
      formula: "It is incumbent upon + O + to V",
      detail: "Sử dụng từ vựng C2 chỉ bổn phận và trách nhiệm bắt buộc, nâng cao độ trang trọng tuyệt đối."
    });
  } else {
    grammarPoints.push({
      title: `Cấu trúc câu phức chuẩn Band ${targetBand}`,
      formula: "Complex Academic Sentence Architecture",
      detail: "Sử dụng các mệnh đề quan hệ và bị động học thuật để tối ưu hóa tính mạch lạc và độ chính xác của ngữ pháp."
    });
  }

  // 4. Phân tích chuyển câu & mạch lạc (Cohesion Analysis - cho Phần 3 hoặc câu có liên từ)
  const cohesionPoints = [];
  if (isPart3) {
    if (/consequently/i.test(sentenceLower)) {
      cohesionPoints.push({
        marker: "Consequently,",
        ipa: "/ˈkɒn.sɪ.kwənt.li/",
        type: "Liên từ chuyển tiếp chỉ hệ quả (Result Marker)",
        detail: "Biểu thị hệ quả tất yếu xuất phát trực tiếp từ nguyên nhân ở câu trước, có sắc thái học thuật và sức nặng lập luận cao hơn 'So' hoặc 'Therefore'."
      });
    } else if (/as a direct consequence/i.test(sentenceLower)) {
      cohesionPoints.push({
        marker: "As a direct consequence,",
        ipa: "/æz ə daɪˈrekt ˈkɒn.sɪ.kwəns/",
        type: "Cụm trạng từ chuyển tiếp nhân quả nâng cao",
        detail: "Móc xích chặt chẽ nguyên nhân ở Câu 1 với hành động bắt buộc ở Câu 2, nâng điểm Coherence & Cohesion lên 8.0+."
      });
    } else if (/therefore/i.test(sentenceLower)) {
      cohesionPoints.push({
        marker: "Therefore,",
        ipa: "/ˈðeə.fɔːr/",
        type: "Liên từ chuyển câu chỉ suy luận logic",
        detail: "Đóng vai trò cầu nối logic giữa tiền đề được đưa ra và kết luận tương xứng."
      });
    } else {
      cohesionPoints.push({
        marker: "Academic Transition Marker",
        ipa: "/trænˈzɪʃ.ən/",
        type: "Liên kết mạch lạc liên câu (Inter-sentential Cohesion)",
        detail: "Tạo liên kết hữu cơ giữa tiền đề (vấn đề) ở câu 1 và giải pháp/hệ quả ở câu 2."
      });
    }

    cohesionPoints.push({
      marker: "Phép quy chiếu (Demonstrative Referencing)",
      ipa: "/ˈref.ər.əns.ɪŋ/",
      type: "Kỹ thuật móc xích đại từ chỉ định",
      detail: "Sử dụng các cụm danh từ quy chiếu như 'these challenges', 'such measures' để liên kết nội dung câu 2 với câu 1 mà không bị lặp từ."
    });
  }

  return {
    vocabularyList,
    grammarPoints,
    cohesionPoints
  };
}
