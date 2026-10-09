// Evaluator for IELTS Writing Sentences
// Checks Grammar, Lexical Resource, and Coherence & Cohesion
import { analyzeUpgradeDetails } from './upgradeDetailHelper.js';

const INFORMAL_PATTERNS = [
  { regex: /\b(don't|doesn't|didn't|won't|can't|couldn't|shouldn't|isn't|aren't|wasn't|weren't)\b/gi, message: "Tránh dùng dạng viết tắt (contractions) trong IELTS Academic Writing. Nên viết rõ (do not, cannot, etc.)." },
  { regex: /\b(a lot of|lots of|tons of)\b/gi, message: "Cụm từ quá thông tục; hãy thay bằng 'a myriad of', 'a significant amount of', hoặc 'numerous'." },
  { regex: /\b(kids|childrens)\b/gi, message: "Nên dùng 'children', 'adolescents', hoặc 'youngsters' thay cho 'kids'." },
  { regex: /\b(bad|good|big|huge)\b/gi, message: "Các tính từ cơ bản (Band 5-6). Hãy nâng cấp lên 'detrimental', 'beneficial', 'substantial', hoặc 'profound'." },
  { regex: /\b(in my opinion, i think)\b/gi, message: "Cách diễn đạt ý kiến lặp lại; có thể dùng 'From an academic perspective,' hoặc 'It is argued that...'." },
];

const COMPLEX_STRUCTURES = [
  { regex: /\b(although|even though|whereas|while|whilst)\b/i, name: "Mệnh đề nhượng bộ (Concession Clause)" },
  { regex: /\b(because|since|as|inasmuch as|provided that)\b/i, name: "Mệnh đề chỉ nguyên nhân / điều kiện" },
  { regex: /\b(which|who|whose|whom|whereby|in which)\b/i, name: "Mệnh đề quan hệ (Relative Clause)" },
  { regex: /\b(not only\s+.+\s+but\s+(also)?)\b/i, name: "Cấu trúc đảo ngữ hoặc bổ sung kép (Not only... but also)" },
  { regex: /\b(if\s+.+,\s+.+|had\s+.+been|were\s+.+to)\b/i, name: "Câu điều kiện nâng cao (Conditional)" },
  { regex: /\b(is|are|was|were|been|being)\s+([a-z]+ed|[a-z]+en)\b/i, name: "Thể bị động học thuật (Passive Voice)" },
  { regex: /,\s*(thereby|thus|leading to|resulting in)\s+[a-z]+ing\b/i, name: "Mệnh đề phân từ rút gọn (Participle Clause)" },
];

const COHESIVE_MARKERS = [
  "consequently", "as a direct result", "this in turn", "therefore", "thus",
  "however", "nevertheless", "conversely", "on the contrary", "in contrast",
  "furthermore", "moreover", "in addition", "not only that", "what is more",
  "for instance", "for example", "a prime example", "to illustrate",
  "such measures", "this phenomenon", "these alarming", "the former", "the latter",
  "in light of", "owing to", "despite this", "to overcome this"
];

export function evaluateVocabularySentence(userSentence, targetWord, synonyms = [], targetBand = "7.0") {
  const sentence = (userSentence || "").trim();
  const words = sentence.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 4) {
    return {
      isValid: false,
      error: "Câu quá ngắn! Hãy viết một câu hoàn chỉnh có chủ ngữ và vị ngữ (tối thiểu 8 từ)."
    };
  }

  // 1. Target word & synonym detection
  const lowerSentence = sentence.toLowerCase();
  const cleanTarget = targetWord.toLowerCase().trim();
  const foundTargetWord = lowerSentence.includes(cleanTarget);
  
  const foundSynonym = synonyms.find(s => lowerSentence.includes(s.toLowerCase()));

  // 2. Informal detection
  const informalWarnings = [];
  INFORMAL_PATTERNS.forEach(rule => {
    if (rule.regex.test(sentence)) {
      informalWarnings.push(rule.message);
    }
  });

  // 3. Complex grammar structures found
  const detectedStructures = [];
  COMPLEX_STRUCTURES.forEach(struct => {
    if (struct.regex.test(sentence)) {
      detectedStructures.push(struct.name);
    }
  });

  // 4. Calculate Scores
  let lrScore = 6.0;
  let graScore = 6.0;

  // Lexical resource scoring
  if (foundTargetWord) lrScore += 1.0;
  else if (foundSynonym) lrScore += 0.8;
  else lrScore -= 0.5;

  if (informalWarnings.length === 0) lrScore += 0.5;
  else lrScore -= 0.5 * Math.min(informalWarnings.length, 2);

  if (wordCount >= 14 && wordCount <= 32) lrScore += 0.5;

  // Grammar scoring
  if (detectedStructures.length >= 2) graScore += 1.5;
  else if (detectedStructures.length === 1) graScore += 0.8;
  else graScore -= 0.3;

  if (sentence.endsWith(".") || sentence.endsWith("!") || sentence.endsWith("?")) {
    graScore += 0.2;
  } else {
    graScore -= 0.5;
  }

  // Cap scores between 5.0 and 8.5
  lrScore = Math.max(5.0, Math.min(8.5, Math.round(lrScore * 2) / 2));
  graScore = Math.max(5.0, Math.min(8.5, Math.round(graScore * 2) / 2));
  const overallBand = Math.round(((lrScore + graScore) / 2) * 2) / 2;

  // Generate constructive feedback
  const strengths = [];
  const improvements = [];

  if (foundTargetWord) {
    strengths.push(`Ứng dụng chuẩn xác từ vựng trọng tâm "${targetWord}".`);
  } else if (foundSynonym) {
    strengths.push(`Paraphrase thông minh bằng từ đồng nghĩa "${foundSynonym}".`);
  } else {
    improvements.push(`Chưa tìm thấy từ "${targetWord}" hoặc các từ đồng nghĩa đã gợi ý.`);
  }

  if (detectedStructures.length > 0) {
    strengths.push(`Cấu trúc ngữ pháp đa dạng: ${detectedStructures.join(", ")}.`);
  } else {
    improvements.push("Nên bổ sung mệnh đề phụ thuộc (Although, Because, Which...) để câu có độ phức tạp cao hơn.");
  }

  if (wordCount >= 14 && wordCount <= 30) {
    strengths.push(`Độ dài học thuật lý tưởng (${wordCount} từ), truyền tải trọn vẹn luận cứ.`);
  } else if (wordCount < 10) {
    improvements.push(`Câu hơi ngắn (${wordCount} từ). Hãy mở rộng thêm bối cảnh hoặc giải thích lý do.`);
  } else if (wordCount > 35) {
    improvements.push(`Câu khá dài (${wordCount} từ), lưu ý ngắt ý tránh lỗi câu lặp dài dòng (run-on sentence).`);
  }

  // Upgraded versions
  const targetBandNum = parseFloat(targetBand) || 7.0;
  const upgradedBand1 = (Math.max(7.5, targetBandNum)).toFixed(1);
  const upgradedBand2 = (Math.min(8.5, targetBandNum + 0.5)).toFixed(1);

  const upgradeSuggestion = generateUpgradedVersions(sentence, targetWord, foundSynonym || targetWord);

  return {
    isValid: true,
    sentence,
    wordCount,
    foundTargetWord,
    foundSynonym,
    scores: {
      overallBand,
      lexicalResource: lrScore,
      grammarRange: graScore,
    },
    targetBand,
    isTargetMet: overallBand >= targetBandNum,
    detectedStructures,
    informalWarnings,
    strengths,
    improvements,
    upgradeSuggestion: {
      band1: upgradedBand1,
      version1: upgradeSuggestion.band75,
      band2: upgradedBand2,
      version2: upgradeSuggestion.band85,
      explanation: upgradeSuggestion.explanation
    }
  };
}

export function evaluateCoherenceSentence(sentenceA, sentenceB, promptDetails = {}, targetBand = "7.0") {
  const sentB = (sentenceB || "").trim();
  const words = sentB.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 5) {
    return {
      isValid: false,
      error: "Câu tiếp theo quá ngắn! Hãy viết một câu phát triển ý hoàn chỉnh (tối thiểu 8 từ)."
    };
  }

  const lowerB = sentB.toLowerCase();
  
  // Cohesive Device Detection
  const detectedCohesiveDevices = COHESIVE_MARKERS.filter(marker => 
    lowerB.includes(marker)
  );

  // Reference Check (this, that, these, those, such)
  const hasReferencePronoun = /\b(this|these|such|the former|the latter|consequently|therefore)\b/i.test(sentB);

  // Complexity check
  const detectedStructures = [];
  COMPLEX_STRUCTURES.forEach(struct => {
    if (struct.regex.test(sentB)) {
      detectedStructures.push(struct.name);
    }
  });

  // Scoring
  let ccScore = 6.0;
  let lrScore = 6.0;
  let graScore = 6.0;

  if (detectedCohesiveDevices.length >= 1) ccScore += 1.2;
  else if (hasReferencePronoun) ccScore += 0.8;
  else ccScore -= 0.5;

  if (detectedStructures.length >= 1) graScore += 1.0;
  if (wordCount >= 12 && wordCount <= 32) lrScore += 0.8;

  ccScore = Math.max(5.5, Math.min(8.5, Math.round(ccScore * 2) / 2));
  lrScore = Math.max(5.5, Math.min(8.5, Math.round(lrScore * 2) / 2));
  graScore = Math.max(5.5, Math.min(graScore * 2) / 2, 8.5);

  const overallBand = Math.round(((ccScore * 1.5 + lrScore + graScore) / 3.5) * 2) / 2;
  const targetBandNum = parseFloat(targetBand) || 7.0;

  const strengths = [];
  const improvements = [];

  if (detectedCohesiveDevices.length > 0) {
    strengths.push(`Sử dụng từ nối chuyển tiếp chuẩn mực: "${detectedCohesiveDevices.join(", ")}".`);
  } else {
    improvements.push("Chưa sử dụng từ nối (Consequently, However, For instance...) để móc nối trực tiếp với câu A.");
  }

  if (hasReferencePronoun) {
    strengths.push("Sử dụng kỹ thuật quy chiếu (referencing with 'this/such/these') giúp tăng tính mạch lạc Cohesion.");
  } else {
    improvements.push("Thử áp dụng kỹ thuật 'this trend / such policies' để tránh lặp lại cụm từ ở câu A.");
  }

  if (detectedStructures.length > 0) {
    strengths.push(`Cấu trúc câu phong phú: ${detectedStructures.join(", ")}.`);
  }

  return {
    isValid: true,
    sentenceA,
    sentenceB: sentB,
    combinedParagraph: `${sentenceA} ${sentB}`,
    wordCount,
    scores: {
      overallBand,
      coherenceCohesion: ccScore,
      lexicalResource: lrScore,
      grammarRange: graScore,
    },
    targetBand,
    isTargetMet: overallBand >= targetBandNum,
    detectedCohesiveDevices,
    hasReferencePronoun,
    detectedStructures,
    strengths,
    improvements,
    modelFollowUp: promptDetails.modelSentenceB,
    explanation: promptDetails.coherenceExplanation
  };
}

function generateUpgradedVersions(userSentence, targetWord) {
  return {
    band75: `Furthermore, it is widely acknowledged that ${userSentence.replace(/^[A-Z]/, c => c.toLowerCase()).replace(/\.$/, '')}, thereby underscoring its pivotal role.`,
    band85: `Not only does this phenomenon highlight how critical it is to ${targetWord}, but it also serves as an indispensable prerequisite for long-term sustainability.`,
    explanation: "Phiên bản nâng cấp áp dụng kỹ thuật liên kết mệnh đề nguyên nhân - hệ quả (thereby + V-ing) và cấu trúc đảo ngữ (Not only does... but it also...) để thể hiện vốn ngữ pháp Band 8.0+."
  };
}

/**
 * PHẦN 1: Chấm điểm hiểu từ vựng (Comprehension Test)
 * Kiểm tra nghĩa tiếng Việt (trắc nghiệm) HOẶC từ đồng nghĩa tiếng Anh
 */
export function evaluateComprehensionTest(vocab, { selectedOptionIndex = null, synonymInput = "" }) {
  if (!vocab) {
    return { isValid: false, error: "Không tìm thấy từ vựng." };
  }

  const cleanSynonym = (synonymInput || "").trim().toLowerCase();
  const synonyms = (vocab.synonyms || []).map(s => s.toLowerCase().trim());
  const correctQuizIndex = vocab.vietnameseQuiz?.correctIndex ?? 0;

  let isCorrect = false;
  let testType = "quiz";
  let feedbackMessage = "";

  if (cleanSynonym) {
    testType = "synonym";
    // Check if input matches any of the synonyms or contains the root
    const matched = synonyms.some(s => s === cleanSynonym || cleanSynonym.includes(s) || s.includes(cleanSynonym));
    if (matched) {
      isCorrect = true;
      feedbackMessage = `Xuất sắc! "${synonymInput}" là từ đồng nghĩa học thuật rất chuẩn của "${vocab.word}".`;
    } else {
      isCorrect = false;
      feedbackMessage = `Từ "${synonymInput}" chưa phải là từ đồng nghĩa tiêu biểu. Các từ đồng nghĩa Band 7.5+ gồm: ${vocab.synonyms?.join(", ")}.`;
    }
  } else if (selectedOptionIndex !== null) {
    testType = "quiz";
    if (selectedOptionIndex === correctQuizIndex) {
      isCorrect = true;
      feedbackMessage = `Chính xác! Bạn đã hiểu đúng 100% nghĩa của từ "${vocab.word}" (${vocab.partOfSpeech}): "${vocab.meaning}".`;
    } else {
      isCorrect = false;
      const correctOption = vocab.vietnameseQuiz?.options?.[correctQuizIndex] || vocab.meaning;
      feedbackMessage = `Chưa chính xác! Nghĩa chuẩn của "${vocab.word}" là: "${correctOption}".`;
    }
  } else {
    return {
      isValid: false,
      error: "Vui lòng chọn 1 đáp án nghĩa tiếng Việt HOẶC nhập từ đồng nghĩa tiếng Anh."
    };
  }

  return {
    isValid: true,
    isCorrect,
    testType,
    score: isCorrect ? 100 : 40,
    feedbackMessage,
    word: vocab.word,
    ipa: vocab.ipa,
    meaning: vocab.meaning,
    collocations: vocab.collocations || [],
    synonyms: vocab.synonyms || []
  };
}

/**
 * PHẦN 2: Chấm điểm dịch 1 câu có sử dụng từ đang luyện tập
 * Đưa ra câu nâng cấp đúng với số Band mục tiêu + chi tiết các phần nâng cấp
 */
export function evaluatePart2Translation(userSentence, vocab, targetBand = "7.0") {
  const sentence = (userSentence || "").trim();
  const words = sentence.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 5) {
    return {
      isValid: false,
      error: "Bản dịch quá ngắn! Hãy viết một câu hoàn chỉnh có đầy đủ chủ vị (tối thiểu 6 từ)."
    };
  }

  const cleanTarget = (vocab.word || "").toLowerCase().trim();
  const lowerSentence = sentence.toLowerCase();
  const hasTargetWord = lowerSentence.includes(cleanTarget);
  const synonyms = (vocab.synonyms || []).map(s => s.toLowerCase().trim());
  const hasSynonym = synonyms.some(s => lowerSentence.includes(s));

  // Check informal words
  const informalWarnings = [];
  INFORMAL_PATTERNS.forEach(rule => {
    if (rule.regex.test(sentence)) informalWarnings.push(rule.message);
  });

  // Check complex structures
  const detectedStructures = [];
  COMPLEX_STRUCTURES.forEach(struct => {
    if (struct.regex.test(sentence)) detectedStructures.push(struct.name);
  });

  // Compute Scores
  let lrScore = 6.0;
  let graScore = 6.0;

  if (hasTargetWord) lrScore += 1.2;
  else if (hasSynonym) lrScore += 0.8;
  else lrScore -= 0.5;

  if (informalWarnings.length === 0) lrScore += 0.5;
  else lrScore -= 0.4;

  if (detectedStructures.length >= 2) graScore += 1.5;
  else if (detectedStructures.length === 1) graScore += 0.8;
  else graScore -= 0.2;

  if (sentence.endsWith(".") || sentence.endsWith("!") || sentence.endsWith("?")) graScore += 0.2;
  else graScore -= 0.4;

  lrScore = Math.max(5.0, Math.min(8.5, Math.round(lrScore * 2) / 2));
  graScore = Math.max(5.0, Math.min(8.5, Math.round(graScore * 2) / 2));
  const overallBand = Math.round(((lrScore + graScore) / 2) * 2) / 2;
  const targetBandNum = parseFloat(targetBand) || 7.0;

  // Retrieve upgraded sentence tailored to target band
  const practiceData = vocab.sentencePractice || {};
  const bandKey = parseFloat(targetBand) >= 8.5 ? "8.5" : parseFloat(targetBand) >= 8.0 ? "8.0" : parseFloat(targetBand) >= 7.5 ? "7.5" : parseFloat(targetBand) >= 7.0 ? "7.0" : "6.5";
  const upgradedSentence = practiceData.bandUpgrades?.[bandKey] || practiceData.bandUpgrades?.["7.5"] || practiceData.modelTranslation || vocab.modelSentence || "";

  // Generate deep breakdown of vocabulary (IPA + Vietnamese meaning), grammar & style
  const detailedAnalysis = analyzeUpgradeDetails({
    upgradedSentence,
    vocab,
    targetBand,
    isPart3: false
  });

  const upgradeDetails = practiceData.upgradeDetails || [
    `Từ vựng mục tiêu: "${vocab.word}" ${vocab.ipa || ''} (${vocab.partOfSpeech || 'từ vựng'}) - Nghĩa: ${vocab.meaning || ''}.`,
    detailedAnalysis.vocabularyList.find(v => !v.isTarget)
      ? `Từ vựng nâng cấp đi kèm: "${detailedAnalysis.vocabularyList.find(v => !v.isTarget).word}" ${detailedAnalysis.vocabularyList.find(v => !v.isTarget).ipa} (${detailedAnalysis.vocabularyList.find(v => !v.isTarget).pos}) - Nghĩa: ${detailedAnalysis.vocabularyList.find(v => !v.isTarget).meaning}.`
      : `Collocation chuẩn mực: ${vocab.collocations?.[0] || 'Cụm từ học thuật C1/C2 tự nhiên'}.`,
    `Ngữ pháp: ${detailedAnalysis.grammarPoints?.[0]?.title || 'Cấu trúc câu phức chuẩn Band ' + targetBand} - ${detailedAnalysis.grammarPoints?.[0]?.detail || ''}`,
    `Sắc thái học thuật: Nâng cấp diễn đạt từ mức cơ bản (Band 5-6) lên chuẩn mực C1/C2 với tính trang trọng và khách quan.`
  ];

  const strengths = [];
  const improvements = [];

  if (hasTargetWord) strengths.push(`Sử dụng chính xác từ mục tiêu: "${vocab.word}".`);
  else if (hasSynonym) strengths.push(`Sử dụng từ đồng nghĩa phù hợp: "${hasSynonym}".`);
  else improvements.push(`Bản dịch chưa xuất hiện từ vựng mục tiêu "${vocab.word}".`);

  if (detectedStructures.length > 0) strengths.push(`Cấu trúc ngữ pháp tốt: ${detectedStructures.join(", ")}.`);
  if (informalWarnings.length > 0) improvements.push(...informalWarnings);

  return {
    isValid: true,
    userSentence: sentence,
    wordCount,
    scores: {
      overallBand,
      lexicalResource: lrScore,
      grammarRange: graScore
    },
    targetBand,
    isTargetMet: overallBand >= targetBandNum,
    upgradedSentence,
    upgradeDetails,
    detailedAnalysis,
    strengths,
    improvements,
    detectedStructures,
    bandUpgrades: practiceData.bandUpgrades || {}
  };
}

/**
 * PHẦN 3: Chấm điểm dịch 2 câu có sử dụng từ đang luyện tập cùng cách chuyển câu (Cohesion)
 * Đưa ra cặp câu nâng cấp đúng với số Band mục tiêu + chi tiết các phần nâng cấp
 */
export function evaluatePart3Translation(userTranslation, vocab, targetBand = "7.0") {
  const text = (userTranslation || "").trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 10) {
    return {
      isValid: false,
      error: "Đoạn văn luyện viết quá ngắn! Hãy viết đầy đủ một đoạn văn học thuật (tối thiểu 10 từ, khuyến nghị 30 - 60 từ) có sử dụng từ vựng mục tiêu và các liên từ mạch lạc."
    };
  }

  const cleanTarget = (vocab.word || "").toLowerCase().trim();
  const lowerText = text.toLowerCase();
  const hasTargetWord = lowerText.includes(cleanTarget);

  // Detect Cohesive Devices
  const detectedCohesiveDevices = [];
  COHESIVE_MARKERS.forEach(marker => {
    if (lowerText.includes(marker)) detectedCohesiveDevices.push(marker);
  });

  // Check sentences presence
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 3).length;

  // Check complex structures
  const detectedStructures = [];
  COMPLEX_STRUCTURES.forEach(struct => {
    if (struct.regex.test(text)) detectedStructures.push(struct.name);
  });

  // Compute Scores
  let ccScore = 6.0;
  let lrScore = 6.0;
  let graScore = 6.0;

  if (detectedCohesiveDevices.length >= 2) ccScore += 1.5;
  else if (detectedCohesiveDevices.length === 1) ccScore += 1.0;
  else ccScore -= 0.5;

  if (sentenceCount >= 3) ccScore += 0.8;
  else if (sentenceCount >= 2) ccScore += 0.5;

  if (hasTargetWord) lrScore += 1.2;
  else lrScore -= 0.5;

  if (detectedStructures.length >= 2) graScore += 1.2;
  else if (detectedStructures.length === 1) graScore += 0.6;

  ccScore = Math.max(5.0, Math.min(8.5, Math.round(ccScore * 2) / 2));
  lrScore = Math.max(5.0, Math.min(8.5, Math.round(lrScore * 2) / 2));
  graScore = Math.max(5.0, Math.min(8.5, Math.round(graScore * 2) / 2));

  const overallBand = Math.round(((ccScore * 1.5 + lrScore + graScore) / 3.5) * 2) / 2;
  const targetBandNum = parseFloat(targetBand) || 7.0;

  // Retrieve upgraded paragraph/sentences tailored to target band
  const practiceData = vocab.paragraphPractice || vocab.twoSentencePractice || {};
  const bandKey = parseFloat(targetBand) >= 8.5 ? "8.5" : parseFloat(targetBand) >= 8.0 ? "8.0" : parseFloat(targetBand) >= 7.5 ? "7.5" : parseFloat(targetBand) >= 7.0 ? "7.0" : "6.5";
  const upgradedPair = practiceData.bandUpgrades?.[bandKey] || practiceData.bandUpgrades?.["7.5"] || practiceData.modelParagraph || practiceData.modelTranslation || "";

  // Generate deep breakdown of vocabulary (IPA + Vietnamese meaning), grammar & cohesion
  const detailedAnalysis = analyzeUpgradeDetails({
    upgradedSentence: upgradedPair,
    vocab,
    targetBand,
    isPart3: true
  });

  const upgradeDetails = practiceData.upgradeDetails || [
    `Từ vựng mục tiêu: "${vocab.word}" ${vocab.ipa || ''} (${vocab.partOfSpeech || 'từ vựng'}) - Nghĩa: ${vocab.meaning || ''}.`,
    detailedAnalysis.cohesionPoints?.[0]
      ? `Kỹ thuật liên kết (Cohesion): Liên từ "${detailedAnalysis.cohesionPoints[0].marker}" ${detailedAnalysis.cohesionPoints[0].ipa} - ${detailedAnalysis.cohesionPoints[0].detail}`
      : `Kỹ thuật liên kết (Cohesion): Phối hợp các liên từ học thuật nối câu mạch lạc, tạo dòng chảy lập luận tự nhiên.`,
    detailedAnalysis.vocabularyList.find(v => !v.isTarget)
      ? `Từ vựng nâng cấp đi kèm: "${detailedAnalysis.vocabularyList.find(v => !v.isTarget).word}" ${detailedAnalysis.vocabularyList.find(v => !v.isTarget).ipa} (${detailedAnalysis.vocabularyList.find(v => !v.isTarget).pos}) - Nghĩa: ${detailedAnalysis.vocabularyList.find(v => !v.isTarget).meaning}.`
      : `Cấu trúc đoạn văn (PEEL): Câu chủ đề (Topic Sentence) &rarr; Phân tích (Explanation) &rarr; Dẫn chứng (Evidence) &rarr; Đúc kết (Conclusion).`
  ];

  const strengths = [];
  const improvements = [];

  if (detectedCohesiveDevices.length > 0) {
    strengths.push(`Sử dụng liên từ chuyển tiếp học thuật: "${detectedCohesiveDevices.join(", ")}".`);
  } else {
    improvements.push("Chưa phát hiện liên từ chuyển câu rõ ràng (ví dụ: Consequently, Therefore, In contrast, For instance...).");
  }

  if (hasTargetWord) {
    strengths.push(`Sử dụng chính xác từ mục tiêu: "${vocab.word}".`);
  } else {
    improvements.push(`Bản viết chưa xuất hiện từ vựng mục tiêu "${vocab.word}".`);
  }

  if (sentenceCount >= 2) {
    strengths.push(`Cấu trúc đoạn văn phát triển ý tốt (${sentenceCount} câu), có sự liên kết chặt chẽ.`);
  } else {
    improvements.push("Nên mở rộng thành đoạn văn 2 - 4 câu để phát triển luận điểm đầy đủ (Câu mở đầu, giải thích, dẫn chứng).");
  }

  return {
    isValid: true,
    userSentence: text,
    wordCount,
    sentenceCount,
    scores: {
      overallBand,
      coherenceCohesion: ccScore,
      lexicalResource: lrScore,
      grammarRange: graScore
    },
    targetBand,
    isTargetMet: overallBand >= targetBandNum,
    upgradedPair,
    upgradeDetails,
    detailedAnalysis,
    detectedCohesiveDevices,
    strengths,
    improvements,
    detectedStructures,
    bandUpgrades: practiceData.bandUpgrades || {}
  };
}

export const evaluateParagraphTranslation = evaluatePart3Translation;


/**
 * Chấm điểm bài viết Full Essay (Task 2) hoặc Full Report (Task 1)
 * Đánh giá toàn diện theo 4 tiêu chí chuẩn IELTS:
 * 1. Task Achievement / Task Response (TR)
 * 2. Coherence & Cohesion (CC)
 * 3. Lexical Resource (LR) - đặc biệt theo dõi từ vựng trọng tâm Band 8.0 đã dùng
 * 4. Grammatical Range & Accuracy (GRA)
 */
export function evaluateFullEssay(essayText, topic = {}, targetBand = "7.0", activeTask = "task2") {
  const text = (essayText || "").trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const isTask1 = activeTask === 'task1';
  const minWords = isTask1 ? 150 : 250;

  if (wordCount < 25) {
    return {
      isValid: false,
      error: `Bài viết quá ngắn (${wordCount} từ). Vui lòng viết ít nhất ${minWords} từ để hệ thống chấm điểm đầy đủ và chính xác theo chuẩn IELTS!`
    };
  }

  // 1. Phân tích đoạn văn (Paragraphs)
  const paragraphs = text.split(/\n\s*\n|\r\n\s*\r\n/).map(p => p.trim()).filter(Boolean);
  const paragraphCount = paragraphs.length > 0 ? paragraphs.length : 1;

  // 2. Kiểm tra từ vựng trọng tâm trong chủ đề (Target Vocabularies Tracking)
  const targetVocabs = topic?.vocabularies || [];
  const lowerText = text.toLowerCase();
  const usedTargetWords = [];
  const missingTargetWords = [];

  targetVocabs.forEach(v => {
    if (!v?.word) return;
    const cleanWord = v.word.toLowerCase();
    const regex = new RegExp(`\\b${cleanWord.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i');
    const hasWord = regex.test(text);
    const hasSynonym = (v.synonyms || []).some(s => lowerText.includes(s.toLowerCase()));

    if (hasWord || hasSynonym) {
      usedTargetWords.push({
        word: v.word,
        ipa: v.ipa,
        meaning: v.meaning,
        partOfSpeech: v.partOfSpeech
      });
    } else {
      missingTargetWords.push({
        word: v.word,
        ipa: v.ipa,
        meaning: v.meaning,
        partOfSpeech: v.partOfSpeech
      });
    }
  });

  // 3. Phân tích ngữ pháp phức hợp (Complex Structures)
  const detectedStructures = [];
  COMPLEX_STRUCTURES.forEach(struct => {
    if (struct.regex.test(text)) {
      detectedStructures.push(struct.name);
    }
  });

  // 4. Phân tích liên từ và chuyển câu (Cohesive Devices)
  const detectedCohesiveDevices = [];
  COHESIVE_MARKERS.forEach(marker => {
    const regex = new RegExp(`\\b${marker}\\b`, "i");
    if (regex.test(text) && !detectedCohesiveDevices.includes(marker)) {
      detectedCohesiveDevices.push(marker);
    }
  });

  // 5. Cảnh báo từ ngữ thông tục (Informal Patterns)
  const informalWarnings = [];
  INFORMAL_PATTERNS.forEach(rule => {
    if (rule.regex.test(text)) {
      informalWarnings.push(rule.message);
    }
  });

  // 6. Tính điểm theo 4 tiêu chí IELTS chính thức
  // Task Response / Task Achievement (TR)
  let trScore = 6.0;
  if (wordCount >= minWords) trScore += 1.0;
  if (wordCount >= (isTask1 ? 180 : 280)) trScore += 0.5;
  if (wordCount < minWords) trScore -= 1.0;
  if (paragraphCount >= 4) trScore += 0.5;
  else if (paragraphCount < 3) trScore -= 0.5;

  // Coherence & Cohesion (CC)
  let ccScore = 6.0;
  if (detectedCohesiveDevices.length >= 5) ccScore += 1.5;
  else if (detectedCohesiveDevices.length >= 3) ccScore += 1.0;
  else if (detectedCohesiveDevices.length >= 1) ccScore += 0.5;
  if (paragraphCount >= 4) ccScore += 0.5;

  // Lexical Resource (LR)
  let lrScore = 6.0;
  if (usedTargetWords.length >= 5) lrScore += 2.0;
  else if (usedTargetWords.length >= 3) lrScore += 1.5;
  else if (usedTargetWords.length >= 1) lrScore += 0.5;
  if (informalWarnings.length === 0) lrScore += 0.5;
  else lrScore -= 0.5;

  // Grammatical Range & Accuracy (GRA)
  let graScore = 6.0;
  if (detectedStructures.length >= 4) graScore += 1.5;
  else if (detectedStructures.length >= 2) graScore += 1.0;
  else if (detectedStructures.length >= 1) graScore += 0.5;
  if (informalWarnings.length === 0) graScore += 0.5;

  // Giới hạn trong khoảng 5.0 - 9.0
  const clamp = (val) => Math.min(9.0, Math.max(5.0, Math.round(val * 2) / 2));
  trScore = clamp(trScore);
  ccScore = clamp(ccScore);
  lrScore = clamp(lrScore);
  graScore = clamp(graScore);

  // Overall band tính theo trung bình cộng và làm tròn theo quy tắc IELTS
  const rawAvg = (trScore + ccScore + lrScore + graScore) / 4;
  const decimal = rawAvg - Math.floor(rawAvg);
  let overallBand = Math.floor(rawAvg);
  if (decimal >= 0.75) {
    overallBand += 1.0;
  } else if (decimal >= 0.25) {
    overallBand += 0.5;
  }

  // Nhận xét chi tiết
  const strengths = [];
  const improvements = [];

  if (wordCount >= minWords) {
    strengths.push(`Độ dài bài viết tốt: ${wordCount} từ (đạt yêu cầu tối thiểu ${minWords} từ).`);
  } else {
    improvements.push(`Bài viết hiện có ${wordCount} từ, chưa đạt ngưỡng tối thiểu ${minWords} từ của IELTS ${isTask1 ? 'Task 1' : 'Task 2'} (bị trừ điểm tiêu chí Task Achievement).`);
  }

  if (usedTargetWords.length > 0) {
    strengths.push(`Đã vận dụng thành công ${usedTargetWords.length} từ vựng Band 8.0: "${usedTargetWords.map(w => w.word).join(', ')}".`);
  } else {
    improvements.push(`Chưa đưa được từ vựng trọng tâm Band 8.0 nào từ chủ đề này vào bài. Hãy tham khảo bảng gợi ý bên trên.`);
  }

  if (detectedCohesiveDevices.length >= 3) {
    strengths.push(`Sử dụng phong phú các liên từ chuyển tiếp học thuật: "${detectedCohesiveDevices.slice(0, 5).join(', ')}".`);
  } else {
    improvements.push(`Cần tăng cường các liên từ chuyển ý giữa các câu và các đoạn để nâng band Coherence & Cohesion.`);
  }

  if (detectedStructures.length >= 3) {
    strengths.push(`Vận dụng tốt các cấu trúc ngữ pháp học thuật: ${detectedStructures.slice(0, 3).join(', ')}.`);
  }

  if (informalWarnings.length > 0) {
    improvements.push(`Phát hiện từ ngữ thông tục: ${informalWarnings[0]}`);
  }

  // Nhận xét từng đoạn
  const paragraphFeedbacks = paragraphs.map((para, idx) => {
    const pWords = para.split(/\s+/).filter(Boolean).length;
    let title = `Đoạn ${idx + 1}`;
    let role = "Thân bài (Body Paragraph)";
    let tip = "Cần có câu chủ đề (Topic Sentence) rõ ràng và phát triển luận điểm với các dẫn chứng cụ thể.";
    if (idx === 0) {
      title = "Mở bài (Introduction)";
      role = isTask1 ? "Paraphrase câu đề bài" : "Dẫn nhập bối cảnh & Luận điểm trọng tâm (Thesis Statement)";
      tip = isTask1 ? "Paraphrase lại đề bài bằng các từ đồng nghĩa học thuật, tránh chép lại nguyên văn." : "Giới thiệu đề bài và nêu rõ quan điểm cá nhân ngay tại câu cuối của mở bài.";
    } else if (idx === paragraphs.length - 1 && paragraphs.length >= 3) {
      title = isTask1 ? "Overview / Kết luận" : "Kết bài (Conclusion)";
      role = isTask1 ? "Nêu 2-3 xu hướng nổi bật nhất" : "Tóm lược các luận điểm chính & Khẳng định lại quan điểm";
      tip = isTask1 ? "Tuyệt đối không đưa số liệu cụ thể vào phần Overview; chỉ nêu xu hướng bao quát." : "Không đưa ý mới vào kết bài; chỉ tổng kết lại các ý đã phân tích ở thân bài.";
    } else {
      title = `Thân bài ${idx} (Body ${idx})`;
      role = isTask1 ? "Phân tích số liệu và so sánh chi tiết" : "Phát triển luận điểm với ví dụ & phân tích nguyên nhân - kết quả";
      tip = "Đảm bảo mỗi câu triển khai đều giải thích mạch lạc cho câu chủ đề ở đầu đoạn.";
    }

    return {
      index: idx + 1,
      title,
      role,
      wordCount: pWords,
      tip,
      preview: para.length > 150 ? para.slice(0, 150) + "..." : para
    };
  });

  return {
    isValid: true,
    essayText: text,
    wordCount,
    paragraphCount,
    minWords,
    targetBand,
    scores: {
      overallBand,
      taskResponse: trScore,
      coherenceCohesion: ccScore,
      lexicalResource: lrScore,
      grammarRange: graScore
    },
    usedTargetWords,
    missingTargetWords,
    detectedCohesiveDevices,
    detectedStructures,
    informalWarnings,
    strengths,
    improvements,
    paragraphFeedbacks,
    timestamp: new Date().toISOString()
  };
}
