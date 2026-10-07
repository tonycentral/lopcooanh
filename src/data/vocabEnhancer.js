// Helper to enrich vocabulary with 3-part practice data (Comprehension quiz, Single sentence translation, Two-sentence translation with cohesion)

const DEFAULT_LINKING_SUGGESTIONS = [
  "Consequently,", 
  "Therefore,", 
  "As a direct consequence,", 
  "In stark contrast,", 
  "Owing to this,"
];

/**
 * Generates Band-appropriate upgrades (6.5, 7.0, 7.5, 8.0, 8.5) strictly grounded
 * on the exact semantic meaning and context of the given Vietnamese/Model sentence.
 */
export function generateBandUpgrades(modelSentence, vocab = {}) {
  if (!modelSentence) return {};

  const clean = modelSentence.trim().replace(/\.+$/, '');
  const word = (vocab.word || '').toLowerCase();

  // Band 7.5: The curated standard model sentence (gold-standard translation)
  const band75 = `${clean}.`;

  // Band 7.0: A clean, standard formal academic translation
  let band70 = clean;
  if (/^Governments?\s+must\s+/i.test(band70)) {
    band70 = band70.replace(/^Governments?\s+must\s+/i, 'Governments should ');
  } else if (/^Authorities\s+must\s+/i.test(band70)) {
    band70 = band70.replace(/^Authorities\s+must\s+/i, 'Authorities should ');
  } else if (/^Schools?\s+must\s+/i.test(band70)) {
    band70 = band70.replace(/^Schools?\s+must\s+/i, 'Schools should ');
  } else if (/^Teachers?\s+must\s+/i.test(band70)) {
    band70 = band70.replace(/^Teachers?\s+must\s+/i, 'Teachers should ');
  }
  band70 = `${band70}.`;

  // Band 6.5: Direct, clear foundational phrasing with simpler coordination
  let band65 = clean;
  if (/\barticulate complex arguments persuasively\b/i.test(band65)) {
    band65 = band65.replace(/\barticulate complex arguments persuasively\b/i, 'present complex arguments persuasively');
  } else if (/\b(detrimental effects|adverse effects)\b/i.test(band65)) {
    band65 = band65.replace(/\b(detrimental effects|adverse effects)\b/gi, 'negative effects');
  } else if (/\b(vital|imperative|paramount)\b/i.test(band65)) {
    band65 = band65.replace(/\b(vital|imperative|paramount)\b/gi, 'very important');
  } else if (/^Governments?\s+(must|should)\s+/i.test(band65)) {
    band65 = band65.replace(/^Governments?\s+(must|should)\s+/i, 'It is important for governments to ');
  }
  band65 = `${band65}.`;

  // Band 8.0: Complex grammatical elevation (Participle clause / Subjunctive / Gerund framing)
  let band80 = clean;
  if (/\b(and help|and helps|and enables?|and allows?)\b/i.test(clean)) {
    band80 = clean.replace(/\b(and help|and helps|and enables?|and allows?)\s+([a-zA-Z]+)\s+to\s+/i, ', thereby enabling $2 to ')
                  .replace(/\b(and help|and helps|and enables?|and allows?)\s+([a-zA-Z]+)\s+([a-z]+)\b/i, ', thereby enabling $2 to $3');
  } else if (/\band\s+(?:also\s+)?([a-z]+s|[a-z]+ed|[a-z]+)\b/i.test(clean) && !clean.includes(', thereby')) {
    const match = clean.match(/\band\s+(?:also\s+)?([a-z]+)\b/i);
    const v = match ? match[1] : null;
    if (v && !['the', 'a', 'an', 'their', 'its', 'our', 'more', 'less', 'not'].includes(v.toLowerCase())) {
      const gerund = v.endsWith('e') && !v.endsWith('ee') ? v.slice(0, -1) + 'ing' : v.endsWith('y') ? v + 'ing' : v.endsWith('ing') ? v : v + 'ing';
      band80 = clean.replace(new RegExp(`\\band\\s+(?:also\\s+)?${v}\\b`, 'i'), `, thereby ${gerund}`);
    }
  }

  if (band80 === clean) {
    if (/^Governments?\s+(must|should)\s+/i.test(clean)) {
      band80 = clean.replace(/^Governments?\s+(must|should)\s+/i, 'It is incumbent upon governments to ');
    } else if (/^(Schools?|Institutions?|Authorities|Organizations?|Teachers?)\s+(must|should)\s+/i.test(clean)) {
      band80 = clean.replace(/^(Schools?|Institutions?|Authorities|Organizations?|Teachers?)\s+(must|should)\s+/i, (m, p1) => `It is imperative that ${p1.toLowerCase()} `);
    } else if (/^While\b|^Although\b/i.test(clean)) {
      band80 = `${clean}, thereby reaffirming this fundamental principle`;
    } else if (/^[A-Z][a-z]+ing\b/.test(clean)) {
      band80 = `By actively ${clean.charAt(0).toLowerCase() + clean.slice(1)}, stakeholders can achieve more sustainable outcomes`;
    } else {
      band80 = `Evidence demonstrates that ${clean.charAt(0).toLowerCase() + clean.slice(1)}, thereby yielding substantial long-term benefits`;
    }
  }
  band80 = `${band80.replace(/\s+,/, ',')}.`;

  // Band 8.5: High academic register, nominalization, nuanced phrasing
  let band85 = clean;
  if (/^While\b|^Although\b/i.test(clean)) {
    band85 = `Notwithstanding prevailing conventions, ${clean.charAt(0).toLowerCase() + clean.slice(1)}, an outcome that serves as an indispensable prerequisite for systemic progress`;
  } else if (/^It is an absolute imperative that\b/i.test(clean)) {
    band85 = clean.replace(/^It is an absolute imperative that\b/i, 'The implementation of decisive policies has become an absolute imperative to ensure that');
  } else if (clean.toLowerCase().includes('classroom debates')) {
    band85 = 'Engaging rigorously in classroom debates serves to foster critical thinking, thereby empowering students to articulate complex arguments with formidable persuasive clarity';
  } else if (/^Governments?\s+(must|should)\s+/i.test(clean)) {
    band85 = clean.replace(/^Governments?\s+(must|should)\s+(\w+)\s+/i, (m, p1, vb) => `Enacting decisive institutional reforms to ${vb} `) + ' has become an imperative of paramount importance';
  } else if (/^[A-Z][a-z]+ing\b/.test(clean)) {
    band85 = `The strategic commitment to ${clean.charAt(0).toLowerCase() + clean.slice(1)} serves as an enduring cornerstone for institutional excellence`;
  } else {
    band85 = `Empirical academic discourse confirms that ${clean.charAt(0).toLowerCase() + clean.slice(1)}, thereby establishing a vital benchmark for enduring progress`;
  }
  band85 = `${band85.replace(/\s+,/, ',')}.`;

  return {
    "6.5": band65.replace(/\.+$/, '.'),
    "7.0": band70.replace(/\.+$/, '.'),
    "7.5": band75.replace(/\.+$/, '.'),
    "8.0": band80.replace(/\.+$/, '.'),
    "8.5": band85.replace(/\.+$/, '.')
  };
}

/**
 * Generates topic-appropriate 2-sentence context for Part 3 practice.
 */
function generatePart3Practice(vocab, topicName = "IELTS Writing") {
  const word = vocab.word || "";
  const meaning = vocab.meaning || "";
  const collocation = vocab.collocations?.[0] || word;

  const topicLower = topicName.toLowerCase();

  let s1VN = "Sự chuyển biến nhanh chóng trong bối cảnh phát triển hiện đại đang đặt ra nhiều yêu cầu mới cho các lĩnh vực xã hội.";
  let s2VN = `Do đó, các bên liên quan cần chủ động phối hợp hành động nhằm ${meaning.toLowerCase()}.`;
  let s1EN = "Rapid transformations across contemporary societal paradigms present substantial challenges for institutional development.";
  let s2EN = `Consequently, relevant stakeholders must coordinate collaborative initiatives to ${word} ${collocation !== word ? collocation.replace(new RegExp(`^${word}\\s*`, 'i'), '') : 'essential capabilities'} effectively.`;

  if (topicLower.includes("education") || topicLower.includes("learning")) {
    s1VN = "Các phương pháp giáo dục truyền thống thường đối mặt với thách thức trong việc duy trì sự hứng thú và tính chủ động của người học.";
    s2VN = `Do đó, các nhà giáo dục cần đổi mới mô hình lớp học nhằm ${meaning.toLowerCase()}.`;
    s1EN = "Traditional educational methodologies frequently face challenges in maintaining active learner engagement.";
    s2EN = `Consequently, educators must innovate pedagogical models to ${word} ${collocation !== word ? collocation.replace(new RegExp(`^${word}\\s*`, 'i'), '') : 'academic proficiencies'} effectively.`;
  } else if (topicLower.includes("environment") || topicLower.includes("climate")) {
    s1VN = "Sự suy thoái môi trường và biến đổi khí hậu đang đe dọa trực tiếp đến sự cân bằng sinh thái trên quy mô toàn cầu.";
    s2VN = `Do đó, các cơ quan chức năng phải ban hành những chính sách kiên quyết nhằm ${meaning.toLowerCase()}.`;
    s1EN = "Environmental degradation and climate disruptions pose immediate threats to ecological stability on a global scale.";
    s2EN = `Consequently, regulatory authorities must enact decisive environmental policies to ${word} ${collocation !== word ? collocation.replace(new RegExp(`^${word}\\s*`, 'i'), '') : 'ecological risks'} effectively.`;
  } else if (topicLower.includes("tech") || topicLower.includes("intelligence") || topicLower.includes("ai")) {
    s1VN = "Sự bùng nổ của chuyển đổi số đang đặt ra những yêu cầu mới đối với phương thức làm việc và học tập.";
    s2VN = `Do đó, các tổ chức hiện đại cần nhanh chóng điều chỉnh quy trình nhằm ${meaning.toLowerCase()}.`;
    s1EN = "The rapid expansion of digital transformation presents novel demands for modern professional and academic paradigms.";
    s2EN = `Consequently, modern organizations must proactively adapt operational workflows to ${word} ${collocation !== word ? collocation.replace(new RegExp(`^${word}\\s*`, 'i'), '') : 'digital capabilities'} efficiently.`;
  } else if (topicLower.includes("health") || topicLower.includes("wellbeing")) {
    s1VN = "Áp lực cuộc sống hiện đại và cường độ làm việc cao khiến tình trạng sức khỏe của nhiều người bị suy giảm nghiêm trọng.";
    s2VN = `Do đó, mỗi cá nhân và cộng đồng cần xây dựng thói quen tích cực nhằm ${meaning.toLowerCase()}.`;
    s1EN = "Modern societal pressures and intensive work commitments have exacerbated long-term physical and psychological exhaustion.";
    s2EN = `Consequently, individuals and communities must adopt balanced lifestyle practices to ${word} ${collocation !== word ? collocation.replace(new RegExp(`^${word}\\s*`, 'i'), '') : 'holistic wellbeing'} sustainably.`;
  } else if (topicLower.includes("work") || topicLower.includes("career")) {
    s1VN = "Thị trường lao động cạnh tranh đòi hỏi các doanh nghiệp phải không ngừng cải thiện môi trường làm việc.";
    s2VN = `Do đó, ban lãnh đạo cần thực hiện các cải cách thiết thực nhằm ${meaning.toLowerCase()}.`;
    s1EN = "A highly competitive labor market compels corporate enterprises to continuously enhance workplace culture.";
    s2EN = `Consequently, organizational leaders must implement tangible reforms to ${word} ${collocation !== word ? collocation.replace(new RegExp(`^${word}\\s*`, 'i'), '') : 'workplace cohesion'} effectively.`;
  }

  const modelTranslation = `${s1EN} ${s2EN}`;

  return {
    sentence1Vietnamese: s1VN,
    sentence2Vietnamese: s2VN,
    linkingSuggestions: DEFAULT_LINKING_SUGGESTIONS,
    modelTranslation,
    bandUpgrades: {
      "6.5": `${s1EN} Therefore, it is important to ${word} these concerns.`,
      "7.0": `${s1EN} Consequently, stakeholders should implement suitable measures to ${word} these priorities.`,
      "7.5": modelTranslation,
      "8.0": `${s1EN} As a direct consequence, designated authorities are compelled to coordinate strategic interventions to ${word} emerging priorities.`,
      "8.5": `${s1EN} In light of these critical developments, governing institutions are obligated to enact rigorous measures to systematically ${word} structural priorities before adverse tipping points are reached.`
    },
    upgradeDetails: [
      `Từ vựng mục tiêu: "${vocab.word}" ${vocab.ipa || ''} (${vocab.partOfSpeech || 'từ vựng'}) - Nghĩa: ${vocab.meaning || ''}.`,
      `Cách chuyển câu (Cohesion): Liên từ C1 "Consequently," (Do đó, như một hệ quả tất yếu) chỉ quan hệ nhân quả mạnh mẽ thay cho 'so/therefore'.`,
      `Đại từ quy chiếu (Referencing): Móc xích nguyên nhân ở Câu 1 với giải pháp ở Câu 2 mà không bị lặp từ.`,
      `Mạch lập luận logic: Câu 1 nêu thực trạng/tiền đề, Câu 2 đóng vai trò giải pháp trực tiếp liên quan đến "${vocab.word}".`
    ]
  };
}

export function enrichVocabulary(vocab, topicName = "IELTS Writing") {
  if (!vocab) return null;

  const word = vocab.word || "";
  const ipa = vocab.ipa || "";
  const meaning = vocab.meaning || "Hiểu nghĩa từ";
  const partOfSpeech = vocab.partOfSpeech || "từ vựng";

  // 1. Comprehension Quiz Data
  const quiz = vocab.vietnameseQuiz || {
    question: `Nghĩa tiếng Việt chuẩn xác nhất của từ "${word}" là gì?`,
    options: [
      meaning,
      "Làm gia tăng áp lực và rủi ro không lường trước",
      "Duy trì nguyên trạng mà không có sự đổi mới",
      "Bỏ qua hoặc coi nhẹ tính nghiêm trọng của vấn đề"
    ],
    correctIndex: 0
  };

  // 2. Single Sentence Translation Practice Data (Part 2)
  // Strictly grounded on vocab.vietnameseSentence and vocab.modelSentence
  const vietnamesePrompt = vocab.vietnameseSentence || `Các chuyên gia cần có hành động cụ thể để ${meaning.toLowerCase()} trong bối cảnh hiện nay.`;
  const modelTranslation = vocab.modelSentence || `Experts must take decisive action to ${word} current challenges in contemporary society.`;
  
  // Band upgrades must ALWAYS derive from the actual model translation, not unrelated mock text
  const bandUpgrades = vocab.bandUpgrades || generateBandUpgrades(modelTranslation, vocab);

  const sentencePractice = vocab.sentencePractice || {
    vietnamesePrompt,
    targetWord: word,
    modelTranslation,
    bandUpgrades,
    upgradeDetails: vocab.upgradeDetails || [
      `Từ vựng mục tiêu: "${word}" ${ipa} (${partOfSpeech}) - Nghĩa: ${meaning}.`,
      vocab.collocations?.[0]
        ? `Collocation chuẩn mực: "${vocab.collocations[0]}" (Cụm từ kết hợp tự nhiên C1/C2).`
        : `Sắc thái học thuật: Chuẩn mực C1/C2 nâng cao khả năng diễn đạt học thuật chính xác.`,
      `Ngữ pháp nâng cấp: Cấu trúc câu phức chuẩn Band mục tiêu, tối ưu hóa tính mạch lạc và độ chính xác ngữ pháp.`,
      `Sắc thái học thuật: Diễn đạt trang trọng, khách quan, sát nghĩa 100% với câu tiếng Việt gốc.`
    ]
  };

  // 3. Two-Sentence Translation with Cohesive Device Data (Part 3)
  const twoSentencePractice = vocab.twoSentencePractice || generatePart3Practice(vocab, topicName);

  return {
    ...vocab,
    vietnameseQuiz: quiz,
    sentencePractice,
    twoSentencePractice
  };
}
