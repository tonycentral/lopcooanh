// Helper to deconstruct IELTS Model Essays into sentence-by-sentence and paragraph-by-paragraph proposals
// with Vietnamese prompts and Band 6.5 -> 8.5 upgrades for Translation-Assisted Practice.

import { generateBandUpgrades } from '../data/vocabEnhancer.js';

/**
 * Splits text into clean sentences.
 */
function splitIntoSentences(text) {
  if (!text) return [];
  return text
    .replace(/([.?!])\s*(?=[A-Z0-9])/g, "$1|###|")
    .split("|###|")
    .map(s => s.trim())
    .filter(s => s.length > 5);
}

/**
 * Generates Vietnamese proposal and band upgrades for an academic paragraph.
 */
function enrichParagraphProposal(englishPara, roleTitle, roleIndex, promptText) {
  const sentences = splitIntoSentences(englishPara);

  // Generate Vietnamese translation summary based on role
  let vietnameseProposal = "";
  if (roleIndex === 0) {
    vietnameseProposal = "Mở bài: Paraphrase lại câu đề bài bằng ngôn ngữ học thuật trang trọng, sau đó nêu rõ quan điểm cá nhân / luận điểm trọng tâm (Thesis Statement) sẽ được phân tích xuyên suốt bài viết.";
  } else if (roleIndex === 1) {
    vietnameseProposal = "Thân bài 1: Nêu câu chủ đề (Topic Sentence) khẳng định khía cạnh đầu tiên, phân tích nguyên nhân - bản chất vấn đề và đưa ra dẫn chứng / tác động thực tế để minh chứng luận điểm.";
  } else if (roleIndex === 2) {
    vietnameseProposal = "Thân bài 2: Triển khai quan điểm đối trọng hoặc đào sâu khía cạnh tiếp theo, sử dụng liên từ tương phản hoặc bổ sung, đồng thời củng cố tính xác thực bằng phân tích logic chặt chẽ.";
  } else {
    vietnameseProposal = "Kết bài: Khái quát lại các luận cứ chính đã bàn luận ở hai đoạn thân bài mà không lặp từ vựng, tái khẳng định lập trường vững chắc của bài viết.";
  }

  // Generate sentence-level breakdown
  const sentenceProposals = sentences.map((sent, sIdx) => {
    let sentRole = `Câu ${sIdx + 1}`;
    let sentVN = "";

    if (roleIndex === 0) {
      if (sIdx === 0) {
        sentRole = "Câu 1: Paraphrase đề bài";
        sentVN = "Trong bối cảnh hiện đại, vấn đề được đề cập đang thu hút nhiều sự quan tâm và tranh luận sâu sắc trong xã hội.";
      } else {
        sentRole = "Câu 2: Thesis Statement (Luận điểm)";
        sentVN = "Theo quan điểm của tôi, mặc dù có những ý kiến trái chiều, tôi hoàn toàn ủng hộ tính cần thiết của giải pháp này.";
      }
    } else if (roleIndex === 1) {
      if (sIdx === 0) {
        sentRole = "Câu 1: Topic Sentence (Chủ đề)";
        sentVN = "Một mặt, lý do hàng đầu thúc đẩy xu hướng này bắt nguồn từ những lợi ích thiết thực đối với sự phát triển lâu dài.";
      } else if (sIdx === 1) {
        sentRole = "Câu 2: Explanation (Giải thích)";
        sentVN = "Cụ thể hơn, việc áp dụng biện pháp này giúp tối ưu hóa hiệu quả hoạt động và giảm thiểu các rủi ro không đáng có.";
      } else {
        sentRole = "Câu 3: Evidence (Dẫn chứng)";
        sentVN = "Nhiều nghiên cứu thực tiễn đã chứng minh rằng các chính sách đồng bộ luôn mang lại kết quả tích cực và bền vững.";
      }
    } else if (roleIndex === 2) {
      if (sIdx === 0) {
        sentRole = "Câu 1: Topic Sentence (Mở rộng)";
        sentVN = "Mặt khác, không thể phủ nhận tầm quan trọng của việc xem xét kỹ lưỡng các khía cạnh đối lập hoặc tác động tiêu cực tiềm ẩn.";
      } else if (sIdx === 1) {
        sentRole = "Câu 2: Explanation (Phân tích)";
        sentVN = "Nếu thiếu sự kiểm soát chặt chẽ, tình trạng này có thể dẫn đến những hệ lụy phức tạp cho cộng đồng và nền kinh tế.";
      } else {
        sentRole = "Câu 3: Solution / Impact (Giải pháp)";
        sentVN = "Do đó, các bên liên quan cần chủ động phối hợp để giải quyết triệt để vấn đề trước khi tác hại lan rộng.";
      }
    } else {
      if (sIdx === 0) {
        sentRole = "Câu 1: Summary (Tóm tắt ý)";
        sentVN = "Tóm lại, mặc dù cả hai quan điểm đều có cơ sở nhất định, việc kết hợp hài hòa các giải pháp là con đường tối ưu.";
      } else {
        sentRole = "Câu 2: Final Outlook (Khẳng định)";
        sentVN = "Chỉ khi có sự cam kết hành động kiên quyết từ các cấp thẩm quyền, mục tiêu phát triển bền vững mới có thể đạt được trọn vẹn.";
      }
    }

    const upgrades = generateBandUpgrades(sent);

    return {
      sentenceIndex: sIdx + 1,
      role: sentRole,
      vietnameseProposal: sentVN,
      englishModel: sent,
      bandUpgrades: upgrades
    };
  });

  // Paragraph-level upgrades
  const band65 = sentences.map((s, idx) => {
    if (idx === 0) return `Firstly, ${s.replace(/^[A-Z]/, c => c.toLowerCase())}`;
    if (idx === 1) return `Furthermore, ${s.replace(/^[A-Z]/, c => c.toLowerCase())}`;
    return `Therefore, ${s.replace(/^[A-Z]/, c => c.toLowerCase())}`;
  }).join(' ');

  const band75 = englishPara;

  const band85 = sentences.map((s, idx) => {
    if (idx === 0) return `It is widely substantiated that ${s.replace(/^[A-Z]/, c => c.toLowerCase()).replace(/\.$/, '')}, an imperative of paramount importance.`;
    if (idx === 1) return `By systematically addressing this concern, stakeholders can optimize structural outcomes with exceptional efficiency.`;
    return `Empirical evidence definitively reinforces this conclusion, thereby establishing a benchmark for sustainable progress.`;
  }).join(' ');

  return {
    paragraphIndex: roleIndex + 1,
    roleTitle,
    vietnameseProposal,
    englishModel: englishPara,
    sentenceProposals,
    bandUpgrades: {
      "6.5": band65,
      "7.0": `${englishPara.replace(/^In many\b/i, 'It is noticeable that in many')}`,
      "7.5": band75,
      "8.0": `${englishPara.replace(/\.\s+/g, ', thereby reinforcing institutional stability. ')}`,
      "8.5": band85
    }
  };
}

/**
 * Deconstructs a prompt and its model essay into proposal units for Translation Mode.
 */
export function deconstructModelEssay(topic, activeTask = 'task2') {
  const isTask1 = activeTask === 'task1';
  const defaultModelEssay = topic?.modelEssay || (
    isTask1
      ? "The provided chart illustrates the proportion of household expenditure across five different categories in various countries. Overall, it is clear that housing accounted for the largest percentage of spending, while clothing and recreation represented the smallest portions. In terms of housing, the figures were significantly higher in developed economies. By contrast, recreational spending remained minimal across all surveyed nations."
      : "In contemporary society, the issue in question has elicited widespread debate among sociologists and policy architects. While opponents argue against this trend due to immediate economic costs, I would contend that the long-term societal advantages are far more compelling. The primary justification for this stance lies in the enhancement of public welfare and sustainable development. For instance, empirical research indicates that nations investing proactively in these areas achieve superior quality of life and enduring communal resilience. In conclusion, despite notable fiscal challenges, prioritizing this developmental paradigm remains an imperative for modern societies."
  );

  // Split into paragraphs
  const rawParagraphs = defaultModelEssay
    .split(/\n\s*\n|\r\n\s*\r\n/)
    .map(p => p.trim())
    .filter(Boolean);

  const roleTitles = isTask1
    ? [
        "Đoạn 1: Mở bài (Introduction) - Paraphrase đề bài",
        "Đoạn 2: Tổng quan (Overview) - 2 đặc điểm nổi bật nhất",
        "Đoạn 3: Thân bài 1 (Body 1) - Phân tích chi tiết nhóm số liệu cao",
        "Đoạn 4: Thân bài 2 (Body 2) - So sánh đối chiếu nhóm số liệu thấp"
      ]
    : [
        "Đoạn 1: Mở bài (Introduction) - Bối cảnh & Thesis Statement",
        "Đoạn 2: Thân bài 1 (Body Paragraph 1) - Luận điểm thứ nhất",
        "Đoạn 3: Thân bài 2 (Body Paragraph 2) - Luận điểm thứ hai",
        "Đoạn 4: Kết bài (Conclusion) - Tóm lược & Khẳng định lập trường"
      ];

  const paragraphs = rawParagraphs.map((para, idx) => {
    const roleTitle = roleTitles[idx] || `Đoạn ${idx + 1}: Thân bài mở rộng`;
    return enrichParagraphProposal(para, roleTitle, idx, topic?.ieltsPrompt || '');
  });

  // Flatten all sentences for sentence-by-sentence translation mode
  const allSentences = [];
  paragraphs.forEach((p, pIdx) => {
    p.sentenceProposals.forEach((s, sIdx) => {
      allSentences.push({
        globalIndex: allSentences.length + 1,
        paragraphIndex: pIdx + 1,
        paragraphRole: p.roleTitle,
        ...s
      });
    });
  });

  return {
    isTask1,
    promptText: topic?.ieltsPrompt || '',
    totalParagraphs: paragraphs.length,
    totalSentences: allSentences.length,
    paragraphs,
    allSentences
  };
}
