import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  Check, 
  Copy, 
  Plus, 
  HelpCircle, 
  Layers, 
  Clock, 
  Lightbulb, 
  Award,
  PenTool,
  Send
} from 'lucide-react';

export default function WritingProcessModal({ 
  isOpen, 
  onClose, 
  topic, 
  activeTask = 'task2', 
  targetBand = '7.0',
  onInsertStepText,
  onApplyFullDraft
}) {
  const isTask1 = activeTask === 'task1';
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState(null);

  // Lưu trữ các câu/đoạn nháp của từng bước để học viên bóc tách luyện theo
  const [drafts, setDrafts] = useState({
    intro: '',
    body1: '',
    body2: '',
    conclusion: ''
  });

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleInsertDraft = (stepKey) => {
    const text = drafts[stepKey];
    if (text && text.trim() && onInsertStepText) {
      onInsertStepText(text.trim());
    }
  };

  // Tổng hợp toàn bộ các bước đã nháp thành một bài viết hoàn chỉnh
  const handleCompileFullEssay = () => {
    const fullText = [
      drafts.intro.trim(),
      drafts.body1.trim(),
      drafts.body2.trim(),
      !isTask1 ? drafts.conclusion.trim() : ''
    ].filter(Boolean).join('\n\n');

    if (fullText && onApplyFullDraft) {
      onApplyFullDraft(fullText);
      onClose();
    }
  };

  // =========================================================================
  // ================= CÁC BƯỚC CHO TASK 2 (FULL ESSAY - 40 PHÚT) ============
  // =========================================================================
  const task2Steps = useMemo(() => [
    {
      id: 'step1',
      key: 'analysis',
      number: 1,
      title: 'Bóc Tách & Phân Tích Đề Bài',
      subtitle: 'Xác định dạng bài, từ khóa cốt lõi và phạm vi bàn luận',
      timeAllocated: '2 - 3 phút',
      badge: 'Nền tảng TR Band 8.0+',
      icon: HelpCircle,
      goal: 'Hiểu chính xác 100% yêu cầu của giám khảo, tránh cạm bẫy lạc đề (Off-topic) hoặc trả lời thiếu một vế.',
      methodology: [
        {
          heading: '1. Xác định Dạng bài (Question Type)',
          content: 'Xác định thuộc 1 trong 5 dạng chính: Opinion (Agree/Disagree), Discussion (Discuss both views), Problem - Solution, Advantages - Disadvantages, hoặc Two-part question. Với dạng Discussion, bắt buộc phải phân tích cả 2 quan điểm trước khi đưa ra ý kiến cá nhân.'
        },
        {
          heading: '2. Bóc tách Từ khóa Trọng tâm (Keywords & Scope)',
          content: 'Tìm từ khóa chủ đề (Topic), từ khóa vi mô (Micro-keywords) và các từ hạn định chỉ phạm vi (ví dụ: "in developing nations", "for young children", "solely"). Tránh khái quát hóa thái quá (over-generalization).'
        },
        {
          heading: '3. Định vị Quan điểm Cá nhân (Personal Stance)',
          content: 'Quyết định lập trường của bạn ngay từ phút đầu tiên: Bạn đồng tình một phần (Balanced View) hay hoàn toàn nghiêng về một phía? Giám khảo đòi hỏi quan điểm phải nhất quán xuyên suốt từ Mở bài đến Kết bài.'
        }
      ],
      currentTopicApplication: {
        label: 'Áp dụng vào Đề bài đang chọn:',
        prompt: topic?.ieltsPrompt || 'Đề bài chưa cập nhật',
        tip: `Với đề bài này, hãy lưu ý từ khóa chính liên quan đến "${topic?.name || 'chủ đề'}". Hãy nêu rõ lập trường của bạn ngay từ câu thứ hai của Mở bài.`
      },
      templates: [
        { title: 'Nhận diện dạng bài Discussion', text: 'This topic requires a balanced discussion of two contrasting viewpoints followed by a clear, reasoned personal verdict.' },
        { title: 'Nhận diện dạng bài Opinion', text: 'This question demands a strong, consistent stance on whether the benefits outweigh the drawbacks throughout the whole essay.' }
      ]
    },
    {
      id: 'step2',
      key: 'brainstorming',
      number: 2,
      title: 'Brainstorm Luận Điểm & Chọn Từ Vựng Band 8.0',
      subtitle: 'Lập dàn ý 2 thân bài và chọn sẵn 4-6 từ vựng học thuật',
      timeAllocated: '4 - 5 phút',
      badge: 'Ý tưởng & Từ vựng',
      icon: Lightbulb,
      goal: 'Không bắt tay vào viết ngay khi chưa có dàn ý. Lập 2 luận điểm then chốt và chuẩn bị sẵn từ vựng để lắp ráp mượt mà.',
      methodology: [
        {
          heading: '1. Kỹ thuật "Idea Deepening" (Đào sâu thay vì liệt kê)',
          content: 'Quy tắc vàng của giám khảo IELTS: "1 luận điểm được phân tích sâu sắc bằng ví dụ luôn đạt điểm cao hơn 3 luận điểm liệt kê hời hợt". Mỗi thân bài chỉ cần 1 luận điểm trung tâm, sau đó dùng câu hỏi Why $\\rightarrow$ How $\\rightarrow$ Result để mở rộng.'
        },
        {
          heading: '2. Chuẩn bị Từ vựng Học thuật (Lexical Preparation)',
          content: 'Liệt kê 4-6 từ vựng chuyên sâu của chủ đề (đã học ở Tab 1, 2, 3) mà bạn dự định đưa vào bài viết. Việc chuẩn bị trước giúp bạn không bị bí từ hoặc dùng từ lặp lại khi đang bấm giờ viết.'
        }
      ],
      currentTopicApplication: {
        label: 'Bộ Từ Vựng Band 8.0 gợi ý cho đề này:',
        words: (topic?.vocabularies || []).map(v => ({ word: v.word, ipa: v.ipa, meaning: v.meaning })).slice(0, 8),
        tip: 'Hãy chọn ít nhất 4 từ bên dưới để chuẩn bị đưa vào Thân bài 1 và Thân bài 2.'
      },
      templates: [
        { title: 'Khung dàn ý Thân bài 1', text: 'Body 1: Focus on primary argument -> Explain underlying mechanism -> Provide concrete real-world example.' },
        { title: 'Khung dàn ý Thân bài 2', text: 'Body 2: Address alternative perspective -> Counter-argue with nuanced reasoning -> Conclude with enduring outcome.' }
      ]
    },
    {
      id: 'step3',
      key: 'intro',
      number: 3,
      title: 'Viết Mở Bài Chuẩn 2 Câu Vàng',
      subtitle: 'Paraphrase đề bài và đưa ra Thesis Statement dứt khoát',
      timeAllocated: '4 - 5 phút',
      badge: 'Introduction (40 - 50 từ)',
      icon: BookOpen,
      goal: 'Viết mở bài trong 2 câu chuẩn xác, trang trọng, không tốn quá nhiều thời gian nhưng khẳng định rõ mục tiêu bài viết.',
      methodology: [
        {
          heading: 'Câu 1: Paraphrase Đề bài (Lead-in Statement)',
          content: 'Diễn đạt lại câu đề bài bằng cách thay đổi cấu trúc câu (chuyển sang bị động, danh từ hóa) kết hợp với các từ đồng nghĩa học thuật. Tránh chép lại nguyên văn 3 từ liên tiếp của đề bài.'
        },
        {
          heading: 'Câu 2: Thesis Statement (Tuyên bố Luận điểm Cốt lõi)',
          content: 'Nêu rõ quan điểm cá nhân và định hướng của bài viết. Giám khảo đánh giá tiêu chí Task Response ngay tại câu này: Nếu thiếu Thesis Statement ở mở bài, bài viết thường khó vượt qua Band 6.5.'
        }
      ],
      templates: [
        {
          title: 'Mẫu 1: Dạng thảo luận 2 mặt (Discussion)',
          text: 'While some commentators hold the view that [Quan điểm 1], others contend that [Quan điểm 2]. In my perspective, I firmly align with the latter sentiment, primarily due to [Lý do then chốt].'
        },
        {
          title: 'Mẫu 2: Dạng đồng tình / phản đối (Opinion)',
          text: 'It is widely asserted that [Nội dung đề bài]. While this proposition is compelling to a certain extent, I firmly maintain that [Quan điểm cá nhân] owing to several multifaceted considerations.'
        }
      ],
      draftKey: 'intro',
      placeholder: 'Thử viết đoạn Mở bài (2 câu) cho đề bài này...'
    },
    {
      id: 'step4',
      key: 'body1',
      number: 4,
      title: 'Viết Thân Bài 1 Chuẩn Cấu Trúc P.E.E.L',
      subtitle: 'Point -> Explanation -> Evidence -> Link (90 - 110 từ)',
      timeAllocated: '10 - 12 phút',
      badge: 'Body Paragraph 1',
      icon: Layers,
      goal: 'Xây dựng một đoạn văn thân bài mạch lạc tuyệt đối với 4-5 câu được kết nối bằng các liên từ học thuật và từ vựng trọng tâm.',
      methodology: [
        {
          heading: 'P - Point (Topic Sentence):',
          content: 'Câu chủ đề nêu bật luận điểm 1 ngay tại đầu đoạn. Bắt đầu bằng: "On the one hand, proponents of [Quan điểm] emphasize that [Luận điểm]."'
        },
        {
          heading: 'E - Explanation (Giải thích chuyên sâu):',
          content: 'Giải thích tại sao luận điểm đó lại đúng, cơ chế tác động ra sao. Sử dụng liên từ chuyển câu: "Specifically,...", "In particular,...", "In other words,..."'
        },
        {
          heading: 'E - Evidence / Example (Dẫn chứng thực tiễn):',
          content: 'Đưa ra ví dụ minh họa cụ thể từ nghiên cứu, thực trạng xã hội hoặc mô hình điển hình: "For instance, empirical evidence demonstrates that..."'
        },
        {
          heading: 'L - Link / Result (Kết quả & Móc xích):',
          content: 'Chỉ ra kết quả tất yếu và móc nối về câu chủ đề: "Consequently, this underscores the necessity of [Giải pháp / Kết luận]."'
        }
      ],
      templates: [
        {
          title: 'Khung P.E.E.L Thân bài 1 hoàn chỉnh',
          text: 'On the one hand, it is undeniable that [Luận điểm chính]. Specifically, when [Chủ thể] initiates [Hành động], it directly precipitates [Hệ quả logic]. For instance, recent studies highlight that [Dẫn chứng thực tế]. Consequently, this development serves as a powerful catalyst for [Kết quả cuối cùng].'
        }
      ],
      draftKey: 'body1',
      placeholder: 'Thử viết đoạn Thân bài 1 theo cấu trúc P.E.E.L tại đây...'
    },
    {
      id: 'step5',
      key: 'body2',
      number: 5,
      title: 'Viết Thân Bài 2 & Kỹ Thuật Nhượng Bộ (Concession)',
      subtitle: 'Phát triển luận điểm thứ hai hoặc phản biện góc nhìn đối lập',
      timeAllocated: '10 - 12 phút',
      badge: 'Body Paragraph 2',
      icon: Layers,
      goal: 'Phát triển thân bài thứ hai với kỹ thuật nhượng bộ để chứng minh tư duy phản biện đa chiều đạt Band 8.0+ Task Response.',
      methodology: [
        {
          heading: 'Kỹ thuật Nhượng bộ (Concession & Rebuttal):',
          content: 'Bắt đầu bằng việc thừa nhận tính hợp lý của một khía cạnh, sau đó phản biện lại bằng một luận cứ vượt trội hơn. Cấu trúc ăn điểm: "Although critics may argue that..., the overarching reality remains that..."'
        },
        {
          heading: 'Đa dạng hóa Cấu trúc Ngữ pháp (Grammar Range):',
          content: 'Vận dụng ít nhất 1 câu điều kiện (Conditional), 1 mệnh đề quan hệ rút gọn (Reduced relative clause), hoặc 1 cấu trúc đảo ngữ (Inversion: "Not only does... but it also...") để kéo band GRA lên 8.0.'
        }
      ],
      templates: [
        {
          title: 'Khung Thân bài 2 Nhượng bộ & Phản biện',
          text: 'On the other hand, compelling arguments can be advanced regarding [Luận điểm 2]. While opponents might argue that [Góc nhìn phản bác], a more critical examination reveals that [Luận điểm mạnh hơn của bạn]. Furthermore, empirical evidence affirms that [Dẫn chứng bổ trợ]. Therefore, holistic measures must be instituted to ensure [Kết luận bền vững].'
        }
      ],
      draftKey: 'body2',
      placeholder: 'Thử viết đoạn Thân bài 2 tại đây...'
    },
    {
      id: 'step6',
      key: 'conclusion',
      number: 6,
      title: 'Viết Kết Bài Súc Tích & Tái Khẳng Định Luận Điểm',
      subtitle: 'Tóm lược 2 luận điểm và chốt lại quan điểm trong 1-2 câu',
      timeAllocated: '3 - 4 phút',
      badge: 'Conclusion (35 - 45 từ)',
      icon: CheckCircle2,
      goal: 'Khép lại bài viết một cách chuyên nghiệp, dứt khoát, không đưa ý mới nhưng tái khẳng định hoàn toàn lập trường.',
      methodology: [
        {
          heading: 'Quy tắc 1: Tuyệt đối KHÔNG đưa ý tưởng mới',
          content: 'Kết bài chỉ có nhiệm vụ tổng hợp lại những gì đã phân tích ở thân bài. Đưa một luận điểm mới vào kết bài sẽ bị trừ điểm Task Response vì luận điểm đó không được giải thích.'
        },
        {
          heading: 'Quy tắc 2: Paraphrase lại Thesis Statement',
          content: 'Sử dụng cấu trúc kết luận học thuật: "In conclusion, while [Tóm tắt mặt phụ], I firmly reiterate that [Khẳng định mặt chính]. Looking forward, [Lời kêu gọi hành động hoặc dự báo tương lai]."'
        }
      ],
      templates: [
        {
          title: 'Mẫu Kết bài Band 8.5+ Chuẩn',
          text: 'In conclusion, having analyzed both perspectives, it is apparent that although [Khía cạnh phụ] presents certain merits, [Khía cạnh chính] remains fundamentally indispensable. Moving forward, concerted collaboration between relevant stakeholders will be vital to ensuring enduring societal prosperity.'
        }
      ],
      draftKey: 'conclusion',
      placeholder: 'Thử viết đoạn Kết bài tại đây...'
    },
    {
      id: 'step7',
      key: 'proofreading',
      number: 7,
      title: 'Rà Soát Toàn Diện 4 Tiêu Chí Giám Khảo',
      subtitle: 'Dành 3-5 phút cuối cùng để lấy trọn vẹn điểm số',
      timeAllocated: '3 - 5 phút',
      badge: 'Proofreading Checklist',
      icon: Award,
      goal: 'Phát hiện và chỉnh sửa ngay các lỗi ngữ pháp nhỏ, lỗi chia thì, chính tả và đảm bảo đạt chuẩn số từ tối thiểu.',
      checklist: [
        { criteria: 'Task Response (TR)', check: 'Bài viết đã đạt tối thiểu 250 từ chưa? Đã trả lời trọn vẹn mọi yêu cầu của đề bài chưa? Quan điểm có nhất quán từ đầu đến cuối không?' },
        { criteria: 'Coherence & Cohesion (CC)', check: 'Bài viết đã chia thành 4 đoạn văn cân đối chưa? Mỗi đoạn thân bài có câu chủ đề rõ ràng không? Các liên từ chuyển tiếp có tự nhiên, không bị lạm dụng không?' },
        { criteria: 'Lexical Resource (LR)', check: 'Đã đưa được ít nhất 4-5 từ vựng Band 8.0 của chủ đề vào bài chưa? Có bị lặp lại những từ thông dụng (good, bad, very, increase) quá nhiều lần không?' },
        { criteria: 'Grammar Range & Accuracy (GRA)', check: 'Đã kiểm tra thì của động từ, danh từ số ít/số nhiều (s/es), mạo từ (a/an/the) chưa? Đã có câu phức và mệnh đề quan hệ chưa?' }
      ]
    }
  ], [topic]);

  // =========================================================================
  // ================= CÁC BƯỚC CHO TASK 1 (REPORT - 20 PHÚT) ================
  // =========================================================================
  const task1Steps = useMemo(() => [
    {
      id: 't1_step1',
      key: 'analysis',
      number: 1,
      title: 'Phân Tích Biểu Đồ & Xác Định Số Liệu Then Chốt',
      subtitle: 'Xác định loại biểu đồ, trục thời gian, đơn vị tính và thì động từ',
      timeAllocated: '2 - 3 phút',
      badge: 'Task 1: Visual Deconstruction',
      icon: HelpCircle,
      goal: 'Nắm chắc cấu trúc dữ liệu, không vội vàng viết ngay số liệu chi tiết mà phải hiểu quy luật vận động của biểu đồ.',
      methodology: [
        {
          heading: '1. Nhận diện Dạng Biểu đồ',
          content: 'Bar chart, Line graph, Pie chart, Table, Process hay Map? Nếu có yếu tố thời gian qua nhiều năm $\\rightarrow$ biểu đồ xu hướng (Trend). Nếu chỉ ở 1 thời điểm $\\rightarrow$ biểu đồ so sánh tỉ trọng (Comparative).'
        },
        {
          heading: '2. Xác định Thì của Động từ & Đơn vị tính',
          content: 'Nếu mốc thời gian hoàn toàn trong quá khứ $\\rightarrow$ dùng thì Quá khứ đơn (Past Simple). Nếu có năm tương lai (ví dụ 2030) $\\rightarrow$ dùng cấu trúc dự báo ("is projected to", "is anticipated to"). Đơn vị tính: % hay số lượng tuyệt đối?'
        }
      ],
      currentTopicApplication: {
        label: 'Áp dụng vào Đề bài Task 1 hiện tại:',
        prompt: topic?.ieltsPrompt || 'Đề bài chưa cập nhật',
        tip: 'Chú ý quan sát các nhóm số liệu cao nhất, thấp nhất và sự chênh lệch (disparity) giữa các hạng mục.'
      },
      templates: [
        { title: 'Ngữ pháp chỉ mốc thời gian', text: 'All data points are set in past years, requiring consistent past tense verbs (witnessed, stood at, plummeted).' }
      ]
    },
    {
      id: 't1_step2',
      key: 'overview_prep',
      number: 2,
      title: 'Xác Định 2 Xu Hướng Nổi Bật Cho Overview',
      subtitle: 'Tìm ra 2 điểm bao quát nhất mà không đưa số liệu chi tiết',
      timeAllocated: '2 - 3 phút',
      badge: 'Trọng tâm đạt Band 7.0+',
      icon: Lightbulb,
      goal: 'Đoạn Overview là tiêu chí quyết định bài Task 1 có vượt qua Band 6.0 hay không. Giám khảo chấm điểm Task Achievement dựa chủ yếu vào đoạn này.',
      methodology: [
        {
          heading: 'Quy tắc vàng của Overview:',
          content: 'Chỉ nêu 2 đặc điểm nổi bật nhất (ví dụ: Hạng mục nào luôn cao nhất? Xu hướng chung là tăng hay giảm?). TUYỆT ĐỐI KHÔNG đưa số liệu cụ thể (con số, %) vào đoạn Overview.'
        }
      ],
      templates: [
        { title: 'Công thức mở đầu câu Overview', text: 'Overall, what stands out from the visual illustration is that [Hạng mục cao nhất] commanded the predominant proportion throughout the surveyed timeframe, whereas [Hạng mục thấp nhất] registered negligible figures.' }
      ]
    },
    {
      id: 't1_step3',
      key: 'intro',
      number: 3,
      title: 'Viết Mở Bài Paraphrase (1 câu duy nhất)',
      subtitle: 'Thay thế các thành phần của đề bài bằng từ đồng nghĩa học thuật',
      timeAllocated: '2 - 3 phút',
      badge: 'Introduction Task 1',
      icon: BookOpen,
      goal: 'Viết mở bài trong 1 câu nhanh chóng (khoảng 20-25 từ) để tiết kiệm thời gian cho việc phân tích số liệu.',
      methodology: [
        {
          heading: 'Công thức Paraphrase Task 1:',
          content: 'The [loại biểu đồ] illustrates/compares/details the proportion of/the volume of [đối tượng] across [số lượng địa điểm] between [Năm A] and [Năm B].'
        }
      ],
      templates: [
        { title: 'Mẫu Mở bài Task 1 chuẩn', text: 'The provided illustration compares the breakdown of household expenditure across five distinct nations in the year 2023.' }
      ],
      draftKey: 'intro',
      placeholder: 'Thử viết câu Mở bài Paraphrase cho Task 1...'
    },
    {
      id: 't1_step4',
      key: 'body1',
      number: 4,
      title: 'Viết Đoạn Overview & Thân Bài 1 (Nhóm Số Liệu Chính)',
      subtitle: 'Phân tích các đối tượng dẫn đầu và so sánh tương quan',
      timeAllocated: '6 - 7 phút',
      badge: 'Overview & Body 1',
      icon: Layers,
      goal: 'Viết đoạn Overview hoàn chỉnh và đoạn Thân bài 1 nhóm các số liệu cao nhất lại với nhau.',
      methodology: [
        {
          heading: 'Chiến thuật gom nhóm số liệu (Grouping Data):',
          content: 'Đừng liệt kê từng quốc gia một! Hãy gom những nước/nhóm có cùng đặc điểm lại với nhau (ví dụ: nhóm chi tiêu nhà ở cao nhất chiếm từ 30% đến 38%).'
        }
      ],
      templates: [
        { title: 'Mẫu phân tích số liệu dẫn đầu', text: 'Looking first at the dominant category, housing costs constituted the single largest expenditure, accounting for 38% in Country A, closely followed by Country B at 35%.' }
      ],
      draftKey: 'body1',
      placeholder: 'Thử viết Thân bài 1 cho Task 1...'
    },
    {
      id: 't1_step5',
      key: 'body2',
      number: 5,
      title: 'Viết Thân Bài 2 (Nhóm Số Liệu Còn Lại & Điểm Bất Thường)',
      subtitle: 'So sánh các nhóm số liệu thứ cấp và nêu điểm ngoại lệ',
      timeAllocated: '5 - 6 phút',
      badge: 'Body Paragraph 2',
      icon: Layers,
      goal: 'Hoàn thiện nốt các số liệu thứ cấp, làm nổi bật điểm ngoại lệ (anomaly) để đạt điểm cao tiêu chí Task Achievement.',
      methodology: [
        {
          heading: 'Kỹ thuật so sánh đối lập:',
          content: 'Dùng các liên từ so sánh mạnh: "In stark contrast,", "Conversely,", "Compared to its counterpart," để móc xích các số liệu.'
        }
      ],
      templates: [
        { title: 'Mẫu phân tích điểm ngoại lệ', text: 'Turning to the remaining areas, recreation accounted for a disproportionately small fraction, dropping to a marginal 6% in Country E.' }
      ],
      draftKey: 'body2',
      placeholder: 'Thử viết Thân bài 2 cho Task 1...'
    },
    {
      id: 't1_step6',
      key: 'proofreading',
      number: 6,
      title: 'Rà Soát Số Liệu & Ngữ Pháp Task 1',
      subtitle: 'Đảm bảo đủ tối thiểu 150 từ và không nhầm lẫn số liệu',
      timeAllocated: '2 phút',
      badge: 'Final Check (>= 150 từ)',
      icon: Award,
      goal: 'Kiểm tra độ dài và đối chiếu lại số liệu trên biểu đồ để tránh mất điểm đáng tiếc.',
      checklist: [
        { criteria: 'Word Count', check: 'Bài viết đã đạt tối thiểu 150 từ chưa? (Nếu dưới 150 từ sẽ bị phạt điểm Task Achievement).' },
        { criteria: 'Accuracy', check: 'Số liệu trích xuất có hoàn toàn chính xác không? Đơn vị đo (% hay số tuyệt đối) có bị nhầm lẫn không?' },
        { criteria: 'Grammar', check: 'Động từ đã chia đúng thì quá khứ chưa? Không đưa quan điểm cá nhân ("I think", "In my opinion") vào Task 1!' }
      ]
    }
  ], [topic]);

  const currentSteps = isTask1 ? task1Steps : task2Steps;
  const currentStep = currentSteps[currentStepIndex] || currentSteps[0];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === currentSteps.length - 1;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-xs animate-fadeIn text-[#24211E]">
      <div 
        className="bg-white border border-[#E6E2D8] rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-xl animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= MODAL TOP HEADER ================= */}
        <div className="px-5 py-4 border-b border-[#E6E2D8] bg-[#FAF8F5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#3E4F42] border border-[#D1DDD3] flex items-center justify-center shrink-0 shadow-xs">
              <BookOpen className="w-5 h-5 text-[#3E4F42]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-[#24211E] leading-tight">
                  Quy Trình Bóc Tách Viết Bài Chuẩn Giám Khảo
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3]">
                  {isTask1 ? 'Task 1 (Report)' : 'Task 2 (Full Essay)'}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FAF5EE] text-[#A67C52] border border-[#E6E2D8]">
                  Chuẩn Band {targetBand}
                </span>
              </div>
              <p className="text-xs text-[#7A7369] mt-0.5">
                Bóc tách từng bước chi tiết để người học nắm vững phương pháp và luyện theo từng đoạn.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A7369] hover:text-[#24211E] hover:bg-[#F4EFEA] transition cursor-pointer"
            title="Đóng cửa sổ hướng dẫn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= STEPPER PROGRESS BAR ================= */}
        <div className="px-4 py-2.5 bg-[#F4EFEA] border-b border-[#E6E2D8] shrink-0 overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-1.5 min-w-max">
            {currentSteps.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
                    isActive
                      ? "bg-[#3E4F42] text-white"
                      : isPast
                        ? "bg-white hover:bg-[#FAF8F5] text-[#3E4F42] border border-[#D1DDD3]"
                        : "bg-white hover:bg-[#FAF8F5] text-[#7A7369] border border-[#E6E2D8]"
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black ${
                    isActive ? "bg-white/20 text-white" : isPast ? "bg-[#EDF3EE] text-[#3E4F42]" : "bg-[#F4EFEA] text-[#7A7369]"
                  }`}>
                    {isPast ? "✓" : step.number}
                  </span>
                  <span>{step.title.split(' ')[0]} {step.title.split(' ')[1] || ''}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= STEP DETAIL WORKSPACE ================= */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin">
          
          {/* Step Header Banner */}
          <div className="p-4 rounded-2xl bg-[#EDF3EE] border border-[#D1DDD3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase text-[#3E4F42] bg-white px-2.5 py-0.5 rounded-md border border-[#D1DDD3]">
                  Bước {currentStep.number} / {currentSteps.length}
                </span>
                <span className="text-xs text-[#A67C52] bg-[#FAF5EE] px-2 py-0.5 rounded-md border border-[#E6E2D8] font-mono font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Thời gian: {currentStep.timeAllocated}
                </span>
                <span className="text-xs text-[#3E4F42] bg-white px-2 py-0.5 rounded-md border border-[#D1DDD3] font-bold">
                  {currentStep.badge}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#24211E]">
                {currentStep.title}
              </h3>
              <p className="text-xs text-[#7A7369]">
                {currentStep.subtitle}
              </p>
            </div>

            {currentStep.goal && (
              <div className="sm:max-w-xs p-2.5 rounded-xl bg-white border border-[#D1DDD3] text-[11px] text-[#24211E] shadow-xs">
                <strong className="text-[#3E4F42] block mb-0.5 font-bold">🎯 Mục tiêu bước này:</strong>
                {currentStep.goal}
              </div>
            )}
          </div>

          {/* Phương pháp & Nguyên tắc bóc tách */}
          {currentStep.methodology && currentStep.methodology.length > 0 && (
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-3">
              <span className="text-xs font-bold text-[#3E4F42] uppercase tracking-wide flex items-center gap-1.5">
                <span>📚</span> Phương pháp &amp; Kỹ thuật thực hiện:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentStep.methodology.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-white border border-[#E6E2D8] space-y-1 text-xs shadow-xs">
                    <h4 className="font-bold text-[#24211E] flex items-center gap-1.5 text-[12px]">
                      <span className="text-[#3E4F42]">•</span>
                      <span>{m.heading}</span>
                    </h4>
                    <p className="text-[#7A7369] text-[11px] leading-relaxed pl-3">
                      {m.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Áp dụng vào đề bài hiện tại */}
          {currentStep.currentTopicApplication && (
            <div className="p-4 rounded-xl bg-[#EDF3EE] border border-[#D1DDD3] space-y-2.5">
              <span className="text-xs font-bold text-[#3E4F42] uppercase tracking-wide flex items-center gap-1.5">
                <span>📌</span> {currentStep.currentTopicApplication.label}
              </span>
              
              {currentStep.currentTopicApplication.prompt && (
                <div className="p-3 rounded-lg bg-white border border-[#D1DDD3] shadow-xs">
                  <p className="text-xs text-[#24211E] italic font-serif leading-relaxed">
                    "{currentStep.currentTopicApplication.prompt}"
                  </p>
                </div>
              )}

              {/* Danh sách từ vựng gợi ý ở Bước 2 */}
              {currentStep.currentTopicApplication.words && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] text-[#7A7369] font-semibold block">
                    Bấm vào từ vựng để copy vào nháp:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentStep.currentTopicApplication.words.map((w, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleCopy(w.word, `vocab_${idx}`)}
                        className="p-2 rounded-lg bg-white border border-[#E6E2D8] hover:border-[#D1DDD3] flex items-center justify-between text-xs cursor-pointer transition group shadow-xs"
                        title="Bấm để copy từ"
                      >
                        <div>
                          <span className="font-bold text-[#24211E] font-mono">{w.word}</span>
                          {w.ipa && <span className="text-[10px] text-[#3E4F42] ml-1.5 font-mono italic">{w.ipa}</span>}
                          <div className="text-[10px] text-[#7A7369] line-clamp-1">{w.meaning}</div>
                        </div>
                        <span className="text-[10px] text-[#3E4F42] group-hover:underline shrink-0">
                          {copiedKey === `vocab_${idx}` ? "Đã copy ✓" : "Copy"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep.currentTopicApplication.tip && (
                <p className="text-[11px] text-[#7A7369] bg-white p-2 rounded-lg border border-[#D1DDD3] leading-relaxed shadow-xs">
                  💡 <strong>Gợi ý giám khảo:</strong> {currentStep.currentTopicApplication.tip}
                </p>
              )}
            </div>
          )}

          {/* Các mẫu câu ăn điểm (Templates) */}
          {currentStep.templates && currentStep.templates.length > 0 && (
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-2.5">
              <span className="text-xs font-bold text-[#A67C52] uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A67C52]" />
                Mẫu câu học thuật chuẩn Band 8.0+ có thể áp dụng:
              </span>

              <div className="space-y-2">
                {currentStep.templates.map((tpl, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-white border border-[#E6E2D8] space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#24211E]">{tpl.title}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopy(tpl.text, `tpl_${idx}`)}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#F4EFEA] hover:bg-[#E6E2D8] text-[#7A7369] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === `tpl_${idx}` ? <Check className="w-3 h-3 text-[#3E4F42]" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === `tpl_${idx}` ? "Đã chép" : "Sao chép"}</span>
                        </button>
                        {onInsertStepText && (
                          <button
                            type="button"
                            onClick={() => onInsertStepText(tpl.text)}
                            className="text-[10px] px-2 py-0.5 rounded bg-[#EDF3EE] hover:bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] flex items-center gap-1 cursor-pointer font-bold"
                            title="Chèn mẫu này trực tiếp vào bài viết ở Tab 4"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Chèn vào Tab 4</span>
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs font-mono text-[#24211E] italic leading-relaxed pl-2 border-l-2 border-[#3E4F42]">
                      "{tpl.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ô Luyện Viết Nháp Cho Từng Bước (Interactive Drafting Pad) */}
          {currentStep.draftKey && (
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#D1DDD3] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#3E4F42] uppercase tracking-wide flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-[#3E4F42]" />
                  Ô Luyện Viết Bóc Tách Cho Bước {currentStep.number}:
                </span>
                <span className="text-[10px] text-[#7A7369]">
                  (Viết nháp riêng đoạn này để rèn luyện)
                </span>
              </div>

              <textarea
                value={drafts[currentStep.draftKey] || ''}
                onChange={(e) => setDrafts(prev => ({ ...prev, [currentStep.draftKey]: e.target.value }))}
                placeholder={currentStep.placeholder || 'Viết đoạn văn của bước này tại đây...'}
                rows={4}
                className="w-full p-3 rounded-xl bg-white border border-[#E6E2D8] focus:border-[#3E4F42] focus:ring-1 focus:ring-[#3E4F42] text-[#24211E] placeholder-[#7A7369] font-sans text-xs leading-relaxed outline-none transition resize-y shadow-xs"
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[11px] text-[#7A7369] font-mono">
                  Độ dài: <strong className="text-[#24211E]">{(drafts[currentStep.draftKey] || '').trim().split(/\s+/).filter(Boolean).length}</strong> từ
                </span>

                {onInsertStepText && drafts[currentStep.draftKey] && drafts[currentStep.draftKey].trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleInsertDraft(currentStep.draftKey)}
                    className="px-3 py-1.5 rounded-lg bg-[#EDF3EE] hover:bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#3E4F42]" />
                    <span>Chèn đoạn này vào Bài viết chính (Tab 4)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Checklist tự kiểm tra ở Bước Cuối (Proofreading) */}
          {currentStep.checklist && (
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-3">
              <span className="text-xs font-bold text-[#3E4F42] uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#3E4F42]" />
                Checklist 4 Tiêu Chí Chấm Thi:
              </span>
              <div className="space-y-2">
                {currentStep.checklist.map((chk, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-white border border-[#E6E2D8] flex items-start gap-2.5 text-xs shadow-xs">
                    <span className="text-[#3E4F42] font-bold shrink-0">✓</span>
                    <div>
                      <strong className="text-[#24211E] font-bold block mb-0.5">{chk.criteria}</strong>
                      <p className="text-[#7A7369] text-[11px] leading-relaxed">{chk.check}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ================= MODAL BOTTOM FOOTER & CONTROLS ================= */}
        <div className="px-5 py-3.5 border-t border-[#E6E2D8] bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isFirstStep}
              onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                isFirstStep
                  ? "bg-[#F4EFEA] text-[#7A7369] border border-[#E6E2D8] cursor-not-allowed"
                  : "bg-white hover:bg-[#FAF8F5] text-[#24211E] border border-[#E6E2D8] cursor-pointer shadow-xs"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Bước trước</span>
            </button>

            <button
              type="button"
              disabled={isLastStep}
              onClick={() => setCurrentStepIndex(prev => Math.min(currentSteps.length - 1, prev + 1))}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                isLastStep
                  ? "bg-[#F4EFEA] text-[#7A7369] border border-[#E6E2D8] cursor-not-allowed"
                  : "bg-[#EDF3EE] hover:bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] cursor-pointer shadow-xs"
              }`}
            >
              <span>Bước tiếp theo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Nếu học viên đã viết nháp ít nhất 1 bước -> cho phép gộp vào bài chính */}
            {Object.values(drafts).some(d => d && d.trim().length > 0) && onApplyFullDraft && (
              <button
                type="button"
                onClick={handleCompileFullEssay}
                className="px-3.5 py-2 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                title="Gộp các đoạn đã nháp ở trên thành bài viết hoàn chỉnh và đưa sang Tab 4"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gộp bản nháp sang Tab 4</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8] font-bold text-xs transition cursor-pointer shadow-xs"
            >
              Đóng hướng dẫn
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
