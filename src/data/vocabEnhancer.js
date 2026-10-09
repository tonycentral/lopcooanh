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
 * Generates full academic paragraph (3-4 sentences PEEL/TEEL) for Paragraph Practice.
 * Replaces the previous 2-sentence practice with a complete IELTS body/analytical paragraph.
 */
export function generateParagraphPractice(vocab, topicName = "IELTS Writing") {
  const word = vocab.word || "";
  const ipa = vocab.ipa || "";
  const pos = vocab.partOfSpeech || "từ vựng";
  const meaning = vocab.meaning || "";
  const collocation = vocab.collocations?.[0] || word;
  const topicLower = (topicName || "").toLowerCase();

  let tsVN = "Sự chuyển biến nhanh chóng trong bối cảnh phát triển hiện đại đang đặt ra nhiều yêu cầu mới cho các lĩnh vực xã hội.";
  let exVN = `Để thích ứng hiệu quả, các cơ quan hữu quan cần chủ động phối hợp hành động nhằm ${meaning.toLowerCase()}.`;
  let evVN = "Các dữ liệu thực nghiệm đã chứng minh rằng những tổ chức đi đầu trong cải cách luôn duy trì được tính bền vững và sức cạnh tranh vượt trội.";
  let csVN = "Tóm lại, đây là chiến lược then chốt giúp cộng đồng vượt qua thách thức và đạt được sự thịnh vượng lâu dài.";

  let tsEN = "Rapid transformations across contemporary societal paradigms present substantial challenges for institutional development.";
  let exEN = `To adapt effectively, relevant authorities must coordinate strategic initiatives to ${word} ${collocation !== word ? collocation.replace(new RegExp(`^${word}\\s*`, 'i'), '') : 'systemic challenges'} efficiently.`;
  let evEN = "Empirical data consistently demonstrates that institutions pioneering institutional reforms maintain superior resilience and long-term viability.";
  let csEN = "In summary, proactive structural adaptation represents an indispensable cornerstone for enduring societal progress.";

  if (topicLower.includes("education") || topicLower.includes("giáo dục") || topicLower.includes("learning")) {
    tsVN = "Các phương pháp giáo dục hiện đại cần chuyển trọng tâm từ việc truyền thụ lý thuyết thụ động sang phát triển năng lực tư duy độc lập.";
    exVN = `Khi các nhà sư phạm đổi mới mô hình lớp học, học sinh sẽ có cơ hội thuận lợi để ${meaning.toLowerCase()}.`;
    evVN = "Một ví dụ điển hình là các buổi thảo luận đa chiều giúp người học rèn luyện phản xạ phản biện và tự tin bảo vệ quan điểm cá nhân.";
    csVN = "Tóm lại, việc đổi mới giáo dục toàn diện chính là nền tảng cốt lõi để đào tạo nguồn nhân lực chất lượng cao.";

    tsEN = "Modern educational methodologies must shift focus from passive theoretical instruction to the active cultivation of independent critical thinking.";
    exEN = `By innovating pedagogical frameworks, educators empower learners to ${word} ${collocation !== word ? collocation.replace(new RegExp(`^${word}\\s*`, 'i'), '') : 'academic proficiencies'} with greater autonomy.`;
    evEN = "A prime example is the implementation of structured debates, which markedly enhances students' analytical reasoning and argumentative clarity.";
    csEN = "In conclusion, comprehensive pedagogical reform constitutes an indispensable prerequisite for preparing a competitive future workforce.";
  } else if (topicLower.includes("environment") || topicLower.includes("môi trường") || topicLower.includes("climate")) {
    tsVN = "Sự suy thoái môi trường và biến đổi khí hậu đang đe dọa trực tiếp đến sự cân bằng sinh thái trên quy mô toàn cầu.";
    exVN = `Do đó, các cơ quan chức năng phải khẩn trương ban hành các chính sách kiểm soát nghiêm ngặt nhằm ${meaning.toLowerCase()}.`;
    evVN = "Nhiều quốc gia áp dụng thuế carbon và năng lượng tái tạo đã giảm thiểu đáng kể lượng khí thải độc hại mà không làm gián đoạn tăng trưởng kinh tế.";
    csVN = "Nhìn chung, việc dung hòa giữa phát triển kinh tế và bảo vệ thiên nhiên là mục tiêu sống còn của nhân loại.";

    tsEN = "Environmental degradation and climate disruptions pose immediate threats to ecological stability on an unprecedented global scale.";
    exEN = `Consequently, regulatory authorities must enact stringent statutory frameworks to ${word} ${collocation !== word ? collocation.replace(new RegExp(`^${word}\\s*`, 'i'), '') : 'ecological risks'} effectively.`;
    evEN = "For instance, jurisdictions that instituted carbon pricing mechanisms have substantially reduced industrial emissions without sacrificing economic growth.";
    csEN = "Ultimately, harmonizing industrial progress with environmental preservation represents a paramount imperative for humanity.";
  } else if (topicLower.includes("tech") || topicLower.includes("công nghệ") || topicLower.includes("ai") || topicLower.includes("intelligence")) {
    tsVN = "Sự bùng nổ của trí tuệ nhân tạo và tự động hóa đang tái định hình căn bản phương thức làm việc và tương tác xã hội.";
    exVN = `Để duy trì lợi thế cạnh tranh, các tổ chức hiện đại buộc phải nâng cấp cơ sở hạ tầng nhằm ${meaning.toLowerCase()}.`;
    evVN = "Thực tế cho thấy những doanh nghiệp sớm ứng dụng quy trình số hóa đã tối ưu hóa hiệu suất làm việc lên gấp nhiều lần.";
    csVN = "Có thể khẳng định rằng việc làm chủ công nghệ mới chính là chìa khóa mở ra tiềm năng phát triển đột phá.";

    tsEN = "The rapid proliferation of artificial intelligence and automation is fundamentally reshaping conventional professional and social paradigms.";
    exEN = `To retain a competitive edge, contemporary enterprises are compelled to upgrade digital infrastructure to ${word} ${collocation !== word ? collocation.replace(new RegExp(`^${word}\\s*`, 'i'), '') : 'operational workflows'} efficiently.`;
    evEN = "Evidence shows that organizations pioneering algorithmic integration have realized twofold productivity gains while eliminating operational redundancies.";
    csEN = "Undeniably, mastering technological breakthroughs serves as a definitive catalyst for transformative socioeconomic development.";
  } else if (topicLower.includes("health") || topicLower.includes("sức khỏe") || topicLower.includes("y tế")) {
    tsVN = "Lối sống ít vận động và áp lực công việc gia tăng đang đẩy sức khỏe thể chất lẫn tinh thần của người dân vào tình trạng báo động.";
    exVN = `Mỗi cá nhân và hệ thống y tế công cộng cần thiết lập những thói quen chủ động nhằm ${meaning.toLowerCase()}.`;
    evVN = "Các chương trình thể thao cộng đồng và tư vấn dinh dưỡng tại chỗ đã giúp giảm thiểu rõ rệt tỷ lệ mắc các bệnh mãn tính.";
    csVN = "Tóm lại, đầu tư cho y tế dự phòng mang lại lợi ích sức khỏe lâu dài và giảm tải áp lực tài chính cho xã hội.";

    tsEN = "Sedentary lifestyles combined with escalating occupational stress have precipitated severe physical and psychological health crises.";
    exEN = `Consequently, individuals and public health agencies must adopt preventive protocols to ${word} ${collocation !== word ? collocation.replace(new RegExp(`^${word}\\s*`, 'i'), '') : 'holistic wellbeing'} sustainably.`;
    evEN = "Community-based wellness initiatives and nutritional counseling have proven highly instrumental in curtailing the incidence of chronic lifestyle diseases.";
    csEN = "In summary, prioritizing preventative healthcare yields enduring well-being dividends while mitigating acute strain on healthcare infrastructure.";
  } else if (topicLower.includes("work") || topicLower.includes("công việc") || topicLower.includes("career")) {
    tsVN = "Thị trường lao động cạnh tranh khốc liệt đòi hỏi người lao động phải liên tục nâng cao kỹ năng chuyên môn.";
    exVN = `Đồng thời, ban lãnh đạo doanh nghiệp cần xây dựng văn hóa làm việc minh bạch nhằm ${meaning.toLowerCase()}.`;
    evVN = "Một môi trường làm việc khuyến khích sáng tạo và đãi ngộ xứng đáng luôn ghi nhận mức độ gắn kết nhân viên cao hơn hẳn.";
    csVN = "Như vậy, sự gắn kết giữa quyền lợi của người lao động và mục tiêu của doanh nghiệp là yếu tố then chốt tạo nên thành công.";

    tsEN = "An intensely competitive global labor market necessitates continuous professional upskilling and career adaptability.";
    exEN = `Simultaneously, corporate leaders must cultivate transparent organizational cultures to ${word} ${collocation !== word ? collocation.replace(new RegExp(`^${word}\\s*`, 'i'), '') : 'employee retention'} effectively.`;
    evEN = "Workplaces that champion meritocracy and ongoing talent development consistently exhibit higher employee satisfaction and lower attrition rates.";
    csEN = "Thus, aligning workforce development with strategic corporate objectives is vital for sustainable commercial prosperity.";
  } else if (topicLower.includes("society") || topicLower.includes("xã hội") || topicLower.includes("crime") || topicLower.includes("tội phạm")) {
    tsVN = "Sự phân hóa giàu nghèo và bất bình đẳng xã hội là một trong những nguyên nhân gốc rễ làm gia tăng các vấn đề bất ổn xã hội.";
    exVN = `Các nhà hoạch định chính sách cần phân bổ ngân sách công một cách công bằng nhằm ${meaning.toLowerCase()}.`;
    evVN = "Việc cải thiện phúc lợi xã hội và tạo cơ hội việc làm bình đẳng đã giúp giảm thiểu đáng kể tỷ lệ tội phạm ở nhiều đô thị lớn.";
    csVN = "Tóm lại, xây dựng một xã hội công bằng và nhân văn là nền tảng vững chắc nhất cho sự an bình xã hội.";

    tsEN = "Socioeconomic inequality and wealth disparity constitute fundamental root causes of urban instability and antisocial behaviors.";
    exEN = `Policy architects must allocate public resources equitably to ${word} ${collocation !== word ? collocation.replace(new RegExp(`^${word}\\s*`, 'i'), '') : 'societal disparities'} comprehensively.`;
    evEN = "Empirical evidence reveals that expanding civic welfare and vocational training programs significantly reduces recidivism rates in major metropolitan areas.";
    csEN = "In essence, fostering inclusive social equity remains the most enduring safeguard for long-term communal stability.";
  }

  const vietnamesePrompt = `${tsVN} ${exVN} ${evVN} ${csVN}`;
  const modelParagraph = `${tsEN} ${exEN} ${evEN} ${csEN}`;

  const band65 = `Firstly, ${tsEN.replace(/^The\s+/i, 'the ')} Furthermore, it is important for stakeholders to ${word} these concerns. For example, some organizations have tried this and seen positive results. In short, this practice brings many benefits.`;
  const band70 = `${tsEN} Consequently, relevant authorities should implement decisive measures to ${word} these emerging challenges. A notable example is that systematic interventions have improved long-term outcomes significantly. Overall, this approach is vital for sustainable development.`;
  const band75 = modelParagraph;
  const band80 = `${tsEN} As a direct consequence, designated authorities are compelled to coordinate strategic interventions to ${word} ${collocation !== word ? collocation.replace(new RegExp(`^${word}\\s*`, 'i'), '') : 'structural priorities'}, thereby preventing systemic disruption. Empirical investigations confirm that institutional reforms yield substantial returns, which reinforces the necessity of proactive long-term planning.`;
  const band85 = `It is widely acknowledged that ${tsEN.charAt(0).toLowerCase() + tsEN.slice(1).replace(/\.$/, '')}, an exigency that necessitates decisive institutional action. By systematically ${word.endsWith('e') && !word.endsWith('ee') ? word.slice(0, -1) + 'ing' : word + 'ing'} ${collocation !== word ? collocation.replace(new RegExp(`^${word}\\s*`, 'i'), '') : 'underlying bottlenecks'}, governing bodies can optimize resource distribution with formidable precision. In light of these empirical realities, such structural adaptations serve as an indispensable cornerstone for enduring institutional excellence.`;

  return {
    vietnamesePrompt,
    topicSentenceVN: tsVN,
    explanationVN: exVN,
    evidenceVN: evVN,
    conclusionVN: csVN,
    modelParagraph,
    targetWord: word,
    structure: {
      ts: tsEN,
      ex: exEN,
      ev: evEN,
      cs: csEN
    },
    linkingSuggestions: [
      "Consequently,", 
      "As a direct consequence,", 
      "Empirical evidence demonstrates that", 
      "For instance,", 
      "In light of these developments,"
    ],
    bandUpgrades: {
      "6.5": band65,
      "7.0": band70,
      "7.5": band75,
      "8.0": band80,
      "8.5": band85
    },
    upgradeDetails: [
      `Từ vựng mục tiêu: "${word}" ${ipa} (${pos}) - Nghĩa: ${meaning}.`,
      collocation !== word 
        ? `Collocation học thuật C1/C2: "${collocation}" kết hợp tự nhiên trong văn cảnh bài viết.`
        : `Sắc thái học thuật: Sử dụng từ ngữ chính xác, trang trọng, tương thích hoàn toàn với văn phong IELTS Writing.`,
      `Cấu trúc đoạn văn (PEEL Architecture): Topic Sentence (Luận điểm) &rarr; Explanation (Phân tích có từ vựng) &rarr; Evidence (Dẫn chứng/Hệ quả) &rarr; Conclusion (Đúc kết giải pháp).`,
      `Liên từ & Mạch lạc (Cohesive Devices): Sự phối hợp linh hoạt của 'Consequently', 'For instance', 'In summary' tạo dòng chảy lập luận chặt chẽ.`
    ]
  };
}

/**
 * Generates topic-appropriate 2-sentence context for Part 3 practice (backwards compatibility).
 */
function generatePart3Practice(vocab, topicName = "IELTS Writing") {
  const paragraph = generateParagraphPractice(vocab, topicName);
  return {
    sentence1Vietnamese: paragraph.topicSentenceVN,
    sentence2Vietnamese: paragraph.explanationVN,
    linkingSuggestions: paragraph.linkingSuggestions,
    modelTranslation: `${paragraph.structure.ts} ${paragraph.structure.ex}`,
    bandUpgrades: paragraph.bandUpgrades,
    upgradeDetails: paragraph.upgradeDetails
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

  // 3. Paragraph Practice (PEEL Academic Paragraph - replacing 2-sentence practice)
  const paragraphPractice = vocab.paragraphPractice || generateParagraphPractice(vocab, topicName);
  const twoSentencePractice = vocab.twoSentencePractice || paragraphPractice;

  return {
    ...vocab,
    vietnameseQuiz: quiz,
    sentencePractice,
    paragraphPractice,
    twoSentencePractice
  };
}

