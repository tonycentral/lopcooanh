// Helper to enrich vocabulary with 3-part practice data (Comprehension quiz, Single sentence translation, Two-sentence translation with cohesion)

const DEFAULT_LINKING_SUGGESTIONS = [
  "Consequently,", 
  "Therefore,", 
  "As a direct consequence,", 
  "In stark contrast,", 
  "Owing to this,"
];

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
  const sentencePractice = vocab.sentencePractice || {
    vietnamesePrompt: vocab.vietnameseSentence || `Các nhà hoạch định chính sách cần có hành động quyết liệt để ${meaning.toLowerCase()} trong bối cảnh phát triển hiện nay.`,
    targetWord: word,
    modelTranslation: vocab.modelSentence || `Policymakers must take decisive actions to ${word} potential challenges in contemporary society.`,
    bandUpgrades: vocab.bandUpgrades || {
      "6.5": `Leaders should take action to ${word} issues in modern life.`,
      "7.0": `It is essential that governments implement practical measures to ${word} pressing societal problems.`,
      "7.5": `It is imperative that authorities enforce comprehensive statutory frameworks to ${word} adverse consequences effectively.`,
      "8.0": `Enacting decisive structural reforms has become an absolute imperative to ${word} systemic vulnerabilities without compromise.`,
      "8.5": `Implementing proactive macroeconomic interventions is of paramount importance to thoroughly ${word} structural deficiencies and safeguard societal equilibrium.`
    },
    upgradeDetails: vocab.upgradeDetails || [
      `Từ vựng mục tiêu: "${word}" ${ipa} (${partOfSpeech}) - Nghĩa: ${meaning} (thay thế cho từ cơ bản Band 5-6).`,
      `Từ vựng nâng cấp đi kèm: "statutory framework" /ˈstætʃ.ə.tər.i ˈfreɪm.wɜːk/ (khung pháp lý) & "adverse consequences" /ˈæd.vɜːs ˈkɒn.sɪ.kwən.sɪz/ (hệ lụy tiêu cực).`,
      `Ngữ pháp: Cấu trúc giả định thức "It is imperative that + S + V-bare" hoặc danh từ hóa "Enacting decisive reforms...".`,
      `Sắc thái học thuật: Chuyển đổi giọng văn từ informal/văn nói sang học thuật khách quan chuẩn C1/C2.`
    ]
  };

  // 3. Two-Sentence Translation with Cohesive Device Data (Part 3)
  const twoSentencePractice = vocab.twoSentencePractice || {
    sentence1Vietnamese: `Sự gia tăng nhanh chóng của các áp lực kinh tế - xã hội đang đặt ra thách thức chưa từng có đối với ${topicName}.`,
    sentence2Vietnamese: `Do đó, các tổ chức quốc tế cần chủ động áp dụng các giải pháp bền vững nhằm ${meaning.toLowerCase()}.`,
    linkingSuggestions: vocab.linkingSuggestions || DEFAULT_LINKING_SUGGESTIONS,
    modelTranslation: `The rapid escalation of socioeconomic pressures is posing unprecedented challenges to ${topicName}. Consequently, international institutions must proactively adopt sustainable measures to ${word} acute systemic risks.`,
    bandUpgrades: {
      "6.5": `Socioeconomic pressures are growing fast in ${topicName}. Therefore, global groups must act to ${word} these problems.`,
      "7.0": `The rapid growth of socioeconomic challenges exerts considerable strain on ${topicName}. Consequently, international bodies should implement sustainable policies to ${word} these concerns.`,
      "7.5": `The relentless escalation of socioeconomic pressures poses formidable challenges to ${topicName}. As a direct consequence, multilateral organizations must coordinate strategic interventions to ${word} escalating vulnerabilities.`,
      "8.0": `The unprecedented acceleration of socioeconomic headwinds is placing extraordinary pressure on ${topicName}. In light of this dilemma, global institutions are obligated to enact comprehensive measures to effectively ${word} pervasive systemic instability.`,
      "8.5": `Rampant socioeconomic volatility has exacerbated unprecedented systemic strains across ${topicName}. Consequently, governing bodies must spearhead multilateral policy harmonization to comprehensively ${word} these existential ramifications before catastrophic thresholds are breached.`
    },
    upgradeDetails: [
      `Từ vựng mục tiêu: "${word}" ${ipa} (${partOfSpeech}) - Nghĩa: ${meaning}.`,
      `Cách chuyển câu (Cohesion): Liên từ C1 "Consequently," /ˈkɒn.sɪ.kwənt.li/ (Do đó, như một hệ quả tất yếu) chỉ quan hệ nhân quả mạnh mẽ thay cho 'so/therefore'.`,
      `Đại từ quy chiếu (Referencing): Sử dụng "these escalating vulnerabilities" /ˌvʌl.nər.əˈbɪl.ə.tiz/ (những lỗ hổng ngày càng tăng) để móc xích với tiền đề ở Câu 1.`,
      `Từ vựng nâng cấp: "socioeconomic escalation" /ˌsəʊ.si.əʊ.iː.kəˈnɒm.ɪk ˌes.kəˈleɪ.ʃən/ (sự leo thang kinh tế - xã hội).`
    ]
  };

  return {
    ...vocab,
    vietnameseQuiz: quiz,
    sentencePractice,
    twoSentencePractice
  };
}
