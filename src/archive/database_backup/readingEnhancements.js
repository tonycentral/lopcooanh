// src/data/readingEnhancements.js
/**
 * Reading Enhancements Data Engine
 * Powers 4 innovative, interactive IELTS Reading modes:
 * 1. Paraphrase Hunter (Thợ săn Paraphrase)
 * 2. Speed-Scanning Sprint (Đua tốc độ tìm keyword)
 * 3. TFNG Examiner Master (Thử tài giám khảo Cambridge)
 * 4. Structural Sentence X-Ray (Mổ xẻ câu phức & Dịch song ngữ)
 */

// =========================================================================
// 1. CURATED PARAPHRASE CHALLENGES & GENERATOR
// =========================================================================

/**
 * Curated Paraphrase challenges for core tests
 */
const CURATED_PARAPHRASE_BANK = {
  "environment-test-1": [
    {
      id: "p1",
      targetClue: "Polar bears do not suffer from severe heart disease despite high fat intake.",
      passageMatch: "Yet, polar bears manifest no such coronary ailments.",
      paragraphId: "B",
      synonymMap: [
        { wordA: "severe heart disease", wordB: "coronary ailments" },
        { wordA: "do not suffer from", wordB: "manifest no such" }
      ],
      distractorTrap: "Đoạn B có nhắc đến 'cardiovascular disease, atherosclerosis', nhưng đó là nói về con người nếu ăn nhiều chất béo, chứ không phải gấu Bắc Cực.",
      explanation: "Cụm 'manifest no such coronary ailments' mang nghĩa tương đương 100% với 'do not suffer from heart disease'."
    },
    {
      id: "p2",
      targetClue: "The genetic variation allows bears to remove harmful cholesterol from circulation.",
      passageMatch: "This genetic mutation effectively permits polar bears to purge low-density lipoprotein (LDL), commonly referred to as 'bad' cholesterol, from their blood",
      paragraphId: "C",
      synonymMap: [
        { wordA: "genetic variation", wordB: "genetic mutation" },
        { wordA: "allows", wordB: "permits" },
        { wordA: "remove harmful cholesterol", wordB: "purge low-density lipoprotein ('bad' cholesterol)" },
        { wordA: "circulation", wordB: "blood / bloodstream" }
      ],
      distractorTrap: "Đoạn B nói về việc phát hiện gen APOB nhưng chưa giải thích cụ thể cơ chế đào thải LDL như ở Đoạn C.",
      explanation: "Động từ 'purge' (thanh lọc/đào thải) được paraphrase bằng 'remove', 'harmful cholesterol' được paraphrase từ 'bad cholesterol (LDL)'."
    },
    {
      id: "p3",
      targetClue: "Polar bears exhibit intentional tool manipulation and strategic patience when hunting.",
      passageMatch: "polar bears intentionally hurling large blocks of sea ice to shatter reinforced seal breathing holes and stalking seals with extraordinary tactical patience",
      paragraphId: "D",
      synonymMap: [
        { wordA: "exhibit intentional tool manipulation", wordB: "intentionally hurling large blocks of sea ice" },
        { wordA: "strategic patience", wordB: "extraordinary tactical patience" }
      ],
      distractorTrap: "Đoạn D có nhắc tới primates và cetaceans, nhưng đó là quan niệm cũ (prevailing dogma), không phải hành vi thực tế của gấu.",
      explanation: "'Strategic patience' được paraphrase từ 'tactical patience', 'intentional tool manipulation' paraphrase từ việc chủ động ném tảng băng đập lỗ thở."
    },
    {
      id: "p4",
      targetClue: "The earlier melting of sea ice reduces hunting time and leads to starvation.",
      passageMatch: "ice floes disintegrate earlier each spring and freeze later each autumn. This diminishing ice window forces bears to endure prolonged fasting periods",
      paragraphId: "E",
      synonymMap: [
        { wordA: "earlier melting", wordB: "disintegrate earlier each spring" },
        { wordA: "reduces hunting time", wordB: "diminishing ice window" },
        { wordA: "leads to starvation", wordB: "forces bears to endure prolonged fasting periods" }
      ],
      distractorTrap: "Đoạn E có nhắc đến 'acute malnutrition', là hậu quả của prolonged fasting.",
      explanation: "Cụm 'diminishing ice window' paraphrase 'reduces hunting time', 'prolonged fasting periods' paraphrase 'starvation'."
    }
  ]
};

/**
 * Extracts or generates Paraphrase Hunter challenges for any passage.
 */
export function getParaphraseChallengesForPassage(passage) {
  if (!passage) return [];
  
  // Check curated challenges first
  if (CURATED_PARAPHRASE_BANK[passage.id]) {
    return CURATED_PARAPHRASE_BANK[passage.id];
  }

  const challenges = [];

  // 1. Build challenges from questions & evidenceQuotes
  if (passage.questions && passage.questions.length > 0) {
    passage.questions.forEach((q, idx) => {
      if (q.evidenceQuote && q.paragraphRef) {
        // Find paragraph text
        const para = passage.paragraphs?.find(p => p.id === q.paragraphRef);
        if (para) {
          challenges.push({
            id: `p-gen-${idx + 1}`,
            targetClue: q.prompt.replace(/\b(According to Paragraph [A-E],|In Paragraph [A-E],)\s*/gi, '').trim(),
            passageMatch: q.evidenceQuote,
            paragraphId: q.paragraphRef,
            synonymMap: [
              { wordA: "Ý tưởng trong câu hỏi", wordB: q.evidenceQuote.slice(0, 45) + "..." }
            ],
            distractorTrap: `Cẩn thận với các đoạn văn khác có từ khóa tương tự nhưng nghĩa không khớp với câu hỏi.`,
            explanation: q.explanation || `Bằng chứng nằm ở đoạn ${q.paragraphRef}: "${q.evidenceQuote}".`
          });
        }
      }
    });
  }

  // 2. Build challenges from vocabularies & synonyms
  if (passage.vocabularies && passage.vocabularies.length > 0) {
    passage.vocabularies.slice(0, 3).forEach((v, idx) => {
      if (v.synonyms && v.synonyms.length > 0 && v.contextSentence) {
        // Find which paragraph contains this context sentence or word
        const targetPara = passage.paragraphs?.find(p => p.text.toLowerCase().includes(v.word.toLowerCase()));
        if (targetPara) {
          challenges.push({
            id: `p-vocab-${idx + 1}`,
            targetClue: `Tìm cụm từ trong bài tương đương với: "${v.synonyms.join(' / ')}" (${v.meaning})`,
            passageMatch: v.word,
            paragraphId: targetPara.id,
            synonymMap: [
              { wordA: v.synonyms[0], wordB: v.word }
            ],
            distractorTrap: `Hãy chú ý ngữ cảnh học thuật của từ '${v.word}' trong đoạn ${targetPara.id}.`,
            explanation: `Từ '${v.word}' (${v.pos}) mang nghĩa: ${v.meaning}. Các từ đồng nghĩa tương đương: ${v.synonyms.join(', ')}.`
          });
        }
      }
    });
  }

  return challenges.slice(0, 6);
}

// =========================================================================
// 2. SPEED-SCANNING TARGETS GENERATOR
// =========================================================================

/**
 * Extracts scanning targets (Numbers, Years, Proper Nouns, C1/C2 terms) from passage
 */
export function getSpeedScanTargetsForPassage(passage) {
  if (!passage || !passage.paragraphs) return [];

  const targets = [];
  const seenWords = new Set();

  passage.paragraphs.forEach(p => {
    const text = p.text;

    // 1. Numbers with units or years (e.g. 2014, 11 centimetres, 80%, etc.)
    const numberMatches = text.match(/\b(?:\d{4}|\d+\s*(?:centimetres|cm|percent|%|years|kilometers|km|metres|m))\b/gi) || [];
    numberMatches.forEach(num => {
      const clean = num.trim();
      if (!seenWords.has(clean.toLowerCase()) && targets.length < 8) {
        seenWords.add(clean.toLowerCase());
        targets.push({
          id: `scan-num-${targets.length}`,
          type: "number",
          categoryName: "Số liệu / Thời gian",
          keyword: clean,
          paragraphId: p.id,
          hint: `Tìm số liệu hoặc mốc thời gian trong đoạn [${p.id}]`
        });
      }
    });

    // 2. Acronyms & Uppercase terms (e.g. APOB, LDL, DNA, AI, UNESCO, etc.)
    const acronymMatches = text.match(/\b[A-Z]{2,6}\b/g) || [];
    acronymMatches.forEach(acro => {
      if (!seenWords.has(acro.toLowerCase()) && !['THE', 'AND', 'FOR', 'NOT', 'BUT'].includes(acro) && targets.length < 8) {
        seenWords.add(acro.toLowerCase());
        targets.push({
          id: `scan-acro-${targets.length}`,
          type: "acronym",
          categoryName: "Từ viết hoa / Tên viết tắt",
          keyword: acro,
          paragraphId: p.id,
          hint: `Tìm từ viết tắt đặc biệt trong đoạn [${p.id}]`
        });
      }
    });

    // 3. Proper nouns (Names of institutions, places, scientists)
    const properNounMatches = text.match(/\b[A-Z][a-z]{3,}\s+[A-Z][a-z]{3,}\b/g) || [];
    properNounMatches.forEach(name => {
      if (!seenWords.has(name.toLowerCase()) && targets.length < 8) {
        seenWords.add(name.toLowerCase());
        targets.push({
          id: `scan-proper-${targets.length}`,
          type: "proper_noun",
          categoryName: "Tên riêng / Địa danh / Tổ chức",
          keyword: name,
          paragraphId: p.id,
          hint: `Tìm tên riêng của viện nghiên cứu hoặc địa danh ở đoạn [${p.id}]`
        });
      }
    });
  });

  // 4. Academic Vocabulary from passage
  if (passage.vocabularies && passage.vocabularies.length > 0) {
    passage.vocabularies.forEach(v => {
      if (!seenWords.has(v.word.toLowerCase()) && targets.length < 8) {
        const para = passage.paragraphs.find(p => p.text.toLowerCase().includes(v.word.toLowerCase()));
        if (para) {
          seenWords.add(v.word.toLowerCase());
          targets.push({
            id: `scan-vocab-${targets.length}`,
            type: "academic_vocab",
            categoryName: "Thuật ngữ C1/C2",
            keyword: v.word,
            paragraphId: para.id,
            hint: `Tìm thuật ngữ học thuật (${v.pos}: ${v.meaning.slice(0, 30)}...) ở đoạn [${para.id}]`
          });
        }
      }
    });
  }

  // Shuffle slightly so each round feels fresh
  return targets.sort(() => Math.random() - 0.5).slice(0, 6);
}

// =========================================================================
// 3. STRUCTURAL SENTENCE X-RAY ENGINE (BILINGUAL & CLAUSE BREAKDOWN)
// =========================================================================

/**
 * Curated X-Ray sentence breakdowns for core tests
 */
const CURATED_XRAY_SENTENCES = {
  "environment-test-1": [
    {
      id: "xray-1",
      paragraphId: "B",
      fullSentence: "In humans, a diet that rich in adipose lipids would inevitably precipitate catastrophic cardiovascular disease, atherosclerosis, and fatal arterial blockages.",
      coreSubject: "a diet that rich in adipose lipids",
      coreVerb: "would inevitably precipitate",
      objectOrComplement: "catastrophic cardiovascular disease, atherosclerosis, and fatal arterial blockages",
      subordinateClause: "that rich in adipose lipids (mệnh đề quan hệ rút gọn miêu tả đặc tính của diet)",
      connectors: "In humans (trạng ngữ chỉ phạm vi đối chiếu)",
      vietnameseTranslation: "Ở con người, một chế độ ăn giàu chất béo mô mỡ như vậy chắc chắn sẽ gây ra các bệnh tim mạch thảm khốc, xơ vữa động mạch và tắc nghẽn động mạch gây tử vong.",
      grammarAnalysis: "Cấu trúc điều kiện giả định với động từ khuyết thiếu 'would inevitably precipitate'. Chú ý danh từ 'atherosclerosis' (xơ vữa động mạch) là thuật ngữ y khoa C2 thường gặp trong đề Cambridge.",
      keyVocabChunk: "inevitably precipitate catastrophic cardiovascular disease = chắc chắn làm bùng phát bệnh tim mạch thảm khốc"
    },
    {
      id: "xray-2",
      paragraphId: "C",
      fullSentence: "The researchers hypothesize that if molecular biologists can decipher the precise mechanism through which the APOB mutation operates, they could synthesize innovative pharmaceutical therapies to combat cardiovascular conditions and prevent cardiac arrest in human populations across the world.",
      coreSubject: "The researchers (Chủ ngữ chính) / they (Chủ ngữ mệnh đề kết quả)",
      coreVerb: "hypothesize (V chính) / could synthesize (V mệnh đề kết quả)",
      objectOrComplement: "innovative pharmaceutical therapies to combat cardiovascular conditions",
      subordinateClause: "if molecular biologists can decipher... operates (Mệnh đề điều kiện loại 2 giả định nghiên cứu tương lai) & through which the APOB mutation operates (Mệnh đề quan hệ giới từ)",
      connectors: "that if ... they could ... (Cặp liên từ diễn đạt giả thuyết khoa học)",
      vietnameseTranslation: "Các nhà nghiên cứu đưa ra giả thuyết rằng nếu các nhà sinh học phân tử có thể giải mã được cơ chế chính xác mà đột biến APOB vận hành, họ có thể tổng hợp các liệu pháp dược phẩm tiên tiến để chống lại các bệnh tim mạch và ngăn ngừa ngừng tim ở người trên toàn thế giới.",
      grammarAnalysis: "Câu phức học thuật 45 từ điển hình của IELTS Passage 3. Cấu trúc lồng ghép: Main Clause (S + V) -> Noun Clause (that...) -> Conditional Clause (if...) -> Relative Clause (through which...).",
      keyVocabChunk: "decipher the precise mechanism through which... = giải mã cơ chế chính xác mà qua đó..."
    },
    {
      id: "xray-3",
      paragraphId: "D",
      fullSentence: "However, field observations conducted in Hudson Bay revealed polar bears intentionally hurling large blocks of sea ice to shatter reinforced seal breathing holes and stalking seals with extraordinary tactical patience, demonstrating profound behavioral adaptability.",
      coreSubject: "field observations conducted in Hudson Bay",
      coreVerb: "revealed",
      objectOrComplement: "polar bears intentionally hurling... and stalking seals...",
      subordinateClause: "conducted in Hudson Bay (Quá khứ phân từ rút gọn) & demonstrating profound behavioral adaptability (Hiện tại phân từ chỉ kết quả/nhận xét)",
      connectors: "However (Liên từ chuyển ý tương phản mạnh)",
      vietnameseTranslation: "Tuy nhiên, các quan sát thực địa được thực hiện tại Vịnh Hudson đã tiết lộ việc gấu Bắc cực cố tình ném những khối băng biển lớn để phá vỡ các lỗ thở kiên cố của hải cẩu và kiên nhẫn phục kích hải cẩu với sự cơ động chiến thuật phi thường, chứng minh khả năng thích nghi hành vi sâu sắc.",
      grammarAnalysis: "Mệnh đề danh động từ kép song hành: 'hurling...' và 'stalking...', theo sau là mệnh đề phân từ kết quả 'demonstrating profound behavioral adaptability'.",
      keyVocabChunk: "demonstrating profound behavioral adaptability = chứng minh năng lực thích nghi hành vi sâu sắc"
    },
    {
      id: "xray-4",
      paragraphId: "E",
      fullSentence: "Tragically, the rapid retreat of perennial Arctic sea ice poses an existential crisis that physiological ingenuity alone cannot mitigate.",
      coreSubject: "the rapid retreat of perennial Arctic sea ice",
      coreVerb: "poses",
      objectOrComplement: "an existential crisis",
      subordinateClause: "that physiological ingenuity alone cannot mitigate (Mệnh đề quan hệ bổ nghĩa cho existential crisis)",
      connectors: "Tragically (Trạng từ nhận định của tác giả)",
      vietnameseTranslation: "Đáng buồn thay, sự rút lui nhanh chóng của lớp băng biển Bắc Cực lâu năm đặt ra một cuộc khủng hoảng sinh tồn mà chỉ riêng sự thích nghi sinh lý thông minh cũng không thể giảm nhẹ được.",
      grammarAnalysis: "Cụm danh từ học thuật đóng vai trò chủ ngữ: 'the rapid retreat of perennial Arctic sea ice'. Động từ 'poses' đi liền với 'existential crisis'.",
      keyVocabChunk: "poses an existential crisis that... cannot mitigate = tạo ra một khủng hoảng sống còn mà không thể giảm nhẹ"
    }
  ]
};

/**
 * Parses and returns X-Ray sentences for any passage.
 */
export function getXRaySentencesForPassage(passage) {
  if (!passage) return [];

  if (CURATED_XRAY_SENTENCES[passage.id]) {
    return CURATED_XRAY_SENTENCES[passage.id];
  }

  // Auto-generate X-Ray breakdown for academic complex sentences in paragraphs
  const xrayList = [];

  passage.paragraphs?.forEach((para) => {
    // Split paragraph into sentences
    const sentences = para.text.match(/[^.!?]+[.!?]+/g) || [];
    // Find long sentences with academic markers (however, furthermore, despite, which, that, although, because)
    const complex = sentences.filter(s => {
      const len = s.trim().split(/\s+/).length;
      return len >= 18 && (/\b(which|that|although|despite|however|whereas|thereby|resulting in|conducted|discovered|hypothesize|demonstrating)\b/i.test(s));
    });

    if (complex.length > 0) {
      const targetSentence = complex[0].trim();
      const words = targetSentence.split(/\s+/);

      xrayList.push({
        id: `xray-gen-${para.id}`,
        paragraphId: para.id,
        fullSentence: targetSentence,
        coreSubject: words.slice(0, 4).join(" ") + "...",
        coreVerb: "Động từ chính & vị ngữ học thuật",
        objectOrComplement: words.slice(words.length - 6).join(" "),
        subordinateClause: "Mệnh đề phụ quan hệ / Bổ ngữ mệnh đề học thuật",
        connectors: targetSentence.match(/\b(However|Furthermore|Moreover|Although|Despite|In addition|Consequently|Therefore)\b/i)?.[0] || "Liên từ kết nối logic",
        vietnameseTranslation: `Câu học thuật phân tích cấu trúc ở Đoạn [${para.id}]: tập trung vào quan hệ nguyên nhân - kết quả và bằng chứng luận điểm.`,
        grammarAnalysis: `Câu dài ${words.length} từ chứa cấu trúc ghép phức đặc trưng của bài thi IELTS Academic Passage 2/3.`,
        keyVocabChunk: words.slice(2, 7).join(" ")
      });
    }
  });

  return xrayList.slice(0, 4);
}

// =========================================================================
// 4. TFNG EXAMINER BLUEPRINTS (BE THE EXAMINER)
// =========================================================================

/**
 * Returns deep-dive examiner blueprints for TFNG questions
 */
export function getTfngExaminerCards(passage) {
  if (!passage || !passage.questions) return [];

  const tfngQuestions = passage.questions.filter(q => q.type === 'tfng' || q.options?.includes('NOT GIVEN'));

  return tfngQuestions.map((q, idx) => {
    let trapType = "";
    let examinerTip = "";
    let reverseChallenge = "";

    if (q.correctAnswer === "TRUE") {
      trapType = "BẪY TỪ ĐỒNG NGHĨA (PARAPHRASE SHIFT)";
      examinerTip = "Giám khảo Cambridge KHÔNG BAO GIỜ dùng lại 100% từ trong bài. Họ sẽ thay bằng từ đồng nghĩa (ví dụ: 'severe heart disease' -> 'coronary ailments'). Đừng thấy khác chữ mà chọn NOT GIVEN!";
      reverseChallenge = "💡 Đổi đề thành FALSE: Thay đổi tính chất thành đối lập hoặc thêm từ phủ định ('manifest severe ailments'). Đổi thành NOT GIVEN: Thêm một số liệu cụ thể không được bài nhắc tới (ví dụ: 'Polar bears survive longer than brown bears').";
    } else if (q.correctAnswer === "FALSE") {
      trapType = "BẪY ĐẢO CHIỀU Ý NGHĨA (CONTRADICTION TRAP)";
      examinerTip = "Câu này trực tiếp MÂU THUẪN với bài đọc (Bài nói KHÔNG BỊ, đề nói BỊ; bài nói TĂNG, đề nói GIẢM). Hãy tìm chính xác 1 từ/cụm từ đối nghịch trong câu bằng chứng!";
      reverseChallenge = "💡 Đổi đề thành TRUE: Bỏ từ mâu thuẫn và dùng đúng paraphrase của bài. Đổi thành NOT GIVEN: Thay vì khẳng định mâu thuẫn, đưa ra một giả định không chứng minh được.";
    } else {
      trapType = "BẪY SUY DIỄN NGOÀI LỀ (UNVERIFIED ASSUMPTION TRAP)";
      examinerTip = "Đây là bẫy nguy hiểm nhất! Thông tin nghe có vẻ rất hợp lý ngoài đời thực (Common Sense), nhưng bài đọc CHƯA HỀ KHẲNG ĐỊNH. IELTS chỉ chấm trên những gì ĐƯỢC VIẾT TRÊN TRANG GIẤY!";
      reverseChallenge = "💡 Đổi đề thành TRUE: Chỉ giữ lại phần thông tin có thật trong bài đọc. Đổi thành FALSE: Đưa ra thông tin trái ngược với bài đọc.";
    }

    return {
      id: q.id || `tfng-${idx + 1}`,
      number: idx + 1,
      statement: q.prompt,
      correctAnswer: q.correctAnswer,
      paragraphRef: q.paragraphRef,
      evidenceQuote: q.evidenceQuote || "Xem đoạn văn tham chiếu tương ứng",
      explanation: q.explanation,
      trapType,
      examinerTip,
      reverseChallenge
    };
  });
}
