// src/data/speakingData.js
// Bộ ngân hàng đề thi IELTS Speaking dự đoán & Khung trả lời chuẩn Band 8.0+

export const IELTS_SPEAKING_TOPICS = [
  {
    id: "spk_topic_1",
    topicName: "Artificial Intelligence & Future of Work",
    category: "Technology & Society",
    part1: [
      {
        question: "Do you frequently use artificial intelligence tools in your daily routine?",
        band8Answer: "Without a doubt, yes. I would say generative AI has integrated seamlessly into my daily workflow, particularly for proofreading academic papers and organizing complex project schedules. It essentially serves as a digital cognitive assistant.",
        vocabularyHighlights: ["integrated seamlessly", "workflow", "cognitive assistant", "proofreading"],
        frameworkNote: "Mô hình Answer directly + Elaborate frequency + Specific use cases."
      },
      {
        question: "Do you think children should be taught how to use AI at school?",
        band8Answer: "Absolutely. Rather than imposing outright bans, educational institutions ought to equip youngsters with AI literacy. Teaching prompt engineering and critical discernment ensures they become prudent creators rather than passive consumers.",
        vocabularyHighlights: ["AI literacy", "critical discernment", "prudent creators", "passive consumers"],
        frameworkNote: "Mô hình Point of view + Reason + Forward-looking contrast."
      }
    ],
    part2CueCard: {
      cueTitle: "Describe an innovative piece of technology that you find exceptionally useful.",
      bulletPoints: [
        "What the technology is",
        "When and how you first discovered it",
        "How you utilize it in your daily affairs",
        "And explain why you consider it so profoundly impactful."
      ],
      band8Answer: `
I would like to elaborate on an AI-powered voice transcription tool called Otter that I stumbled upon approximately two years ago while conducting research for an international seminar.

Prior to adopting this software, recording and transcribing extensive bilingual interviews was an agonizingly tedious endeavor. However, this application harnesses advanced natural language processing to convert live spoken dialogue into remarkably accurate written scripts in real time, even distinguishing between different interlocutors.

I now rely on it continuously during conferences and collaborative brainstorming sessions. Instead of frantically scribbling fragmented notes, I can remain completely immersed in the conversation, secure in the knowledge that every analytical insight is being cataloged and indexed. What makes it exceptionally indispensable is its automated summary feature, which condenses hour-long deliberations into five salient bullet points, fundamentally multiplying my daily productivity.
      `.trim(),
      vocabularyHighlights: [
        "stumbled upon", 
        "agonizingly tedious endeavor", 
        "natural language processing", 
        "interlocutors", 
        "cataloged and indexed", 
        "salient bullet points"
      ],
      structureBlueprint: "1. Giới thiệu & hoàn cảnh phát hiện -> 2. So sánh thực trạng trước và sau -> 3. Cách ứng dụng thực tế -> 4. Lý do đánh giá cao (tính đột phá)."
    },
    part3: [
      {
        question: "Will advanced robotics and automation inevitably lead to widespread unemployment?",
        band8Answer: "While it is undeniable that mechanical automation will render certain routine, repetitive occupations obsolete, historical precedent suggests technological revolutions ultimately spawn entirely new job sectors. The critical challenge lies not in technological deceleration, but in national reskilling initiatives to transition the workforce toward creative, analytical, and empathetic roles that machines cannot easily replicate.",
        vocabularyHighlights: [
          "render obsolete", 
          "historical precedent", 
          "technological deceleration", 
          "reskilling initiatives", 
          "empathetic roles"
        ],
        framework: "Mô hình AREA: Answer (Cân bằng 2 vế) -> Reason (Lịch sử chứng minh) -> Example (Sự chuyển đổi lao động) -> Alternative/Solution (Đào tạo lại kỹ năng)."
      },
      {
        question: "Should governments introduce stricter ethical regulations on algorithmic decision-making?",
        band8Answer: "Unquestionably. When automated algorithms dictate credit ratings, recruitment screening, or medical priority, embedded societal biases can be inadvertently amplified. Proactive state oversight is paramount to guarantee algorithmic transparency and accountability.",
        vocabularyHighlights: [
          "automated algorithms", 
          "inadvertently amplified", 
          "proactive state oversight", 
          "algorithmic transparency"
        ],
        framework: "Mô hình AREA: Direct assertion -> High-stakes examples -> Potential peril -> Necessary intervention."
      }
    ]
  },
  {
    id: "spk_topic_2",
    topicName: "Environmental Conservation & Urban Green Spaces",
    category: "Environment & Urban Planning",
    part1: [
      {
        question: "Are there many parks or public gardens in your neighborhood?",
        band8Answer: "Fortunately, yes. My district boasts several well-maintained municipal botanical reserves, featuring leafy pedestrian promenades and recreational ponds where local residents unwind after arduous workdays.",
        vocabularyHighlights: ["municipal botanical reserves", "pedestrian promenades", "arduous workdays"],
        frameworkNote: "Miêu tả chi tiết danh từ & tính từ miêu tả cảnh quan."
      }
    ],
    part2CueCard: {
      cueTitle: "Describe a public park or green area that you frequently visit.",
      bulletPoints: [
        "Where this place is located",
        "What features it possesses",
        "What activities you usually engage in there",
        "And explain why this green area is so meaningful to you."
      ],
      band8Answer: `
I'd like to talk about Thong Nhat Park, a sprawling urban sanctuary situated in the heart of Hanoi that has served as a cherished weekend haven throughout my adult life.

Occupying dozens of hectares, the park is anchored by a vast tranquil lake, enveloped by mature shade trees and meticulously landscaped flower beds. What strikes me most is its vibrant communal atmosphere: early in the morning, one can observe elderly citizens practicing Tai Chi alongside enthusiastic joggers and young families picnicking on the lawns.

Whenever the pressures of academic research become overwhelming, I retreat to this park to read, listen to podcasts, or simply stroll along the lakeside boardwalks. In a bustling, congested metropolis where skyscrapers dominate the skyline, having access to such a verdant natural lung is nothing short of rejuvenating.
      `.trim(),
      vocabularyHighlights: [
        "urban sanctuary", 
        "cherished weekend haven", 
        "tranquil lake", 
        "verdant natural lung", 
        "rejuvenating"
      ],
      structureBlueprint: "1. Tên & vị trí -> 2. Cảnh quan & sinh hoạt cộng đồng -> 3. Hoạt động cá nhân -> 4. Giá trị tinh thần đối với cuộc sống."
    },
    part3: [
      {
        question: "Do municipal authorities allocate sufficient fiscal resources to public parks?",
        band8Answer: "Regrettably, in numerous rapidly developing metropolises, green infrastructure is frequently relegated to an afterthought in favor of lucrative commercial real estate. Urban planners must recognize that public greenery is not an aesthetic luxury, but a vital public health necessity that mitigates the urban heat island effect and enhances mental wellbeing.",
        vocabularyHighlights: [
          "green infrastructure", 
          "relegated to an afterthought", 
          "lucrative commercial real estate", 
          "urban heat island effect"
        ],
        framework: "Mô hình AREA: Problem identification -> Misconception vs Reality -> Ecological & health proof."
      }
    ]
  }
];
