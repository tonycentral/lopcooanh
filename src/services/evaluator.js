// Evaluator for IELTS Writing Sentences
// Checks Grammar, Lexical Resource, and Coherence & Cohesion

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

function generateUpgradedVersions(userSentence, targetWord, currentWord) {
  return {
    band75: `Furthermore, it is widely acknowledged that ${userSentence.replace(/^[A-Z]/, c => c.toLowerCase()).replace(/\.$/, '')}, thereby underscoring its pivotal role.`,
    band85: `Not only does this phenomenon highlight how critical it is to ${targetWord}, but it also serves as an indispensable prerequisite for long-term sustainability.`,
    explanation: "Phiên bản nâng cấp áp dụng kỹ thuật liên kết mệnh đề nguyên nhân - hệ quả (thereby + V-ing) và cấu trúc đảo ngữ (Not only does... but it also...) để thể hiện vốn ngữ pháp Band 8.0+."
  };
}
