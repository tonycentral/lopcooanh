/**
 * Comprehensive IELTS Skill Practice Banks for MochiFarm
 * Dedicated Exercise Formats per Farm Area / Skill:
 * 1. VOCABULARY (Ruộng Lúa - Paddy): Word card + IPA + Audio TTS + Academic Collocations & Context Fill
 * 2. READING (Vườn Cây - Orchard): Academic Reading Passage + True/False/Not Given & Inference Locator
 * 3. LISTENING (Chăn Nuôi - Pasture): Audio Player (TTS Speech) + Note Completion & Distractor Trap
 * 4. SPEAKING (Ao Hồ - Pond): IELTS Cue Card + Native Model Audio + Lexical Fluency & Idiom Upgrade
 * 5. WRITING (Nhà Kính - Greenhouse): Task 1/2 Prompt + Band 5.5 Draft -> Band 8.0+ Sentence Transformation
 */

// Native Web Speech Synthesizer Helper
export const playSpeechText = (text, lang = 'en-GB') => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.includes(lang.slice(0, 2))) || voices[0];
    if (voice) utterance.voice = voice;
    
    window.speechSynthesis.speak(utterance);
    return utterance;
  }
  return null;
};

export const stopSpeechText = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const PRACTICE_SKILL_BANKS = {
  // =========================================================================
  // 1. VOCABULARY (RUỘNG LÚA - PADDY)
  // Format: Academic Word + IPA + Audio + Collocations + Contextual Fill
  // =========================================================================
  vocab: {
    environment: [
      {
        id: 'vc_env_1',
        skill: 'vocab',
        word: 'mitigate',
        ipa: '/ˈmɪt.ɪ.ɡeɪt/',
        partOfSpeech: 'verb (Band 7.5+)',
        collocation: 'mitigate the catastrophic effects of climate change',
        example: 'Governments must enforce renewable energy mandates to mitigate environmental degradation.',
        question: "Chọn từ vựng học thuật điền vào chỗ trống: 'Immediate international action is needed to ______ the adverse impacts of rising sea levels.'",
        options: [
          "mitigate (làm giảm nhẹ tác hại)",
          "aggravate (làm trầm trọng thêm)",
          "deteriorate (suy đồi, xuống cấp)",
          "replicate (sao chép lại)"
        ],
        correctIndex: 0,
        explanation: "'mitigate' = làm dịu bớt hoặc giảm thiểu tác hại nghiêm trọng (Band 7.5+ verb, cực kỳ đắt giá cho chủ đề Môi Trường)."
      },
      {
        id: 'vc_env_2',
        skill: 'vocab',
        word: 'biodiversity',
        ipa: '/ˌbaɪ.oʊ.daɪˈvɜːr.sə.ti/',
        partOfSpeech: 'noun (Band 8.0+)',
        collocation: 'a catastrophic decline in terrestrial biodiversity',
        example: 'Deforestation causes irrecoverable loss of biodiversity across Amazonian rainforests.',
        question: "Collocation học thuật nào dưới đây diễn đạt 'sự suy thoái đa dạng sinh học ở mức thảm họa' chuẩn Band 8.0?",
        options: [
          "a catastrophic loss of biodiversity",
          "a big reduction in animal kinds",
          "a quick drop of green nature",
          "a negative subtraction of biology"
        ],
        correctIndex: 0,
        explanation: "'a catastrophic loss of biodiversity' là cụm danh từ học thuật chuẩn xác được các giám khảo IELTS đánh giá rất cao."
      }
    ],

    technology: [
      {
        id: 'vc_tech_1',
        skill: 'vocab',
        word: 'ubiquitous',
        ipa: '/juːˈbɪk.wə.t̬əs/',
        partOfSpeech: 'adjective (Band 8.0+)',
        collocation: 'ubiquitous computing / ubiquitous smartphone adoption',
        example: 'Artificial intelligence has become ubiquitous in modern computational infrastructure.',
        question: "Từ 'ubiquitous' trong câu 'Smartphones have become ubiquitous across all demographic strata' mang ý nghĩa gì?",
        options: [
          "Phổ biến rộng rãi, hiện diện ở khắp mọi nơi",
          "Lỗi thời và đắt đỏ không cần thiết",
          "Được bảo mật bằng thuật toán cấp cao",
          "Gây hại nghiêm trọng cho sức khỏe người dùng"
        ],
        correctIndex: 0,
        explanation: "'ubiquitous' = present, appearing, or found everywhere (đồng nghĩa với omnipresent / pervasive)."
      }
    ],

    education: [
      {
        id: 'vc_edu_1',
        skill: 'vocab',
        word: 'pedagogical',
        ipa: '/ˌped.əˈɡɑː.dʒɪ.kəl/',
        partOfSpeech: 'adjective (Band 8.0+)',
        collocation: 'pedagogical methodology / pedagogical efficacy',
        example: 'Interactive simulations enhance the pedagogical efficacy of university science curricula.',
        question: "Thuật ngữ 'pedagogical approach' trong bài luận Giáo dục nghĩa là gì?",
        options: [
          "Phương pháp sư phạm / giáo dục học",
          "Hình thức kỷ luật học sinh nghiêm khắc",
          "Quy trình thu học phí định kỳ",
          "Chế độ học bổng toàn phần"
        ],
        correctIndex: 0,
        explanation: "'pedagogical' liên quan đến phương pháp và nghệ thuật giảng dạy sư phạm."
      }
    ],

    default: [
      {
        id: 'vc_def_1',
        skill: 'vocab',
        word: 'predominantly',
        ipa: '/prɪˈdɑː.mə.nənt.li/',
        partOfSpeech: 'adverb (Band 7.5+)',
        collocation: 'predominantly driven by economic considerations',
        example: 'The contemporary workforce is predominantly urbanized.',
        question: "Từ nối học thuật 'predominantly' đồng nghĩa với từ nào sau đây?",
        options: [
          "largely / primarily (phần lớn, chủ yếu)",
          "sporadically (thỉnh thoảng, rải rác)",
          "superficially (hời hợt bề ngoài)",
          "reluctantly (miễn cưỡng)"
        ],
        correctIndex: 0,
        explanation: "'predominantly' = mostly or mainly. Dùng thay cho 'mostly' để tăng band điểm Lexical Resource."
      }
    ]
  },

  // =========================================================================
  // 2. READING (VƯỜN CÂY - ORCHARD)
  // Format: Academic Passage + True/False/Not Given & Evidence Locator
  // =========================================================================
  reading: {
    environment: [
      {
        id: 'rd_env_1',
        skill: 'reading',
        passage: "Polar bears in Hudson Bay depend fundamentally on Arctic sea ice as hunting platforms for ringed seals. Over the past four decades, regional ice break-up has been advancing by approximately five days per decade. Consequently, bears are forced ashore earlier in summer and must fast for progressively extended periods, resulting in demonstrable declines in cub survival rates. However, empirical studies reveal that polar bear predatory behavior on terrestrial food sources remains an inadequate substitute for marine lipids.",
        evidence: "Text states: 'ice break-up has been advancing by approximately five days per decade... bears are forced ashore earlier... and must fast for progressively extended periods'.",
        question: "True, False, or Not Given: 'Polar bears are able to successfully replace marine seals with land animals during extended summers.'",
        options: [
          "FALSE (Bài khẳng định thức ăn trên cạn không thể thay thế dinh dưỡng từ hải cẩu biển)",
          "TRUE (Bài xác nhận gấu đã thích nghi thành công săn thú trên cạn)",
          "NOT GIVEN (Bài đọc không đề cập đến việc săn bắt thức ăn trên cạn)"
        ],
        correctIndex: 0,
        explanation: "Đoạn văn viết: 'terrestrial food sources remains an inadequate substitute for marine lipids' (thức ăn trên cạn là sự thay thế không đủ). Do đó câu khẳng định gấu thay thế thành công là FALSE."
      },
      {
        id: 'rd_env_2',
        skill: 'reading',
        passage: "Tropical rainforest canopies sequester gigatonnes of atmospheric carbon annually. However, catastrophic deforestation not only halts this sequestration mechanism but also releases centuries of stored carbon via slash-and-burn clearing, transforming these biomes into active net carbon sources. Furthermore, deforested soil experiences accelerated nutrient leaching, rendering agricultural reuse short-lived.",
        evidence: "Text states: 'transforming these biomes into active net carbon sources'.",
        question: "According to the passage, what is the net climatic consequence of clear-cutting tropical rainforests?",
        options: [
          "It converts essential carbon sinks into active net greenhouse gas emitters.",
          "It permanently reduces local surface temperatures due to solar reflection.",
          "It enriches the soil's topsoil layer for multi-decade agricultural harvests.",
          "It eliminates the possibility of seasonal monsoon precipitation in temperate zones."
        ],
        correctIndex: 0,
        explanation: "Bài đọc nêu rõ: 'transforming these biomes into active net carbon sources' - biến các bể chứa carbon thành nguồn phát thải khí nhà kính."
      }
    ],

    technology: [
      {
        id: 'rd_tech_1',
        skill: 'reading',
        passage: "Deep convolutional neural networks exhibit remarkable efficacy in radiological diagnostics, often outperforming human clinicians in detecting malignant tissue. Nevertheless, they frequently encounter the 'interpretability dilemma'—their billions of internal weight parameters preclude clinicians from reverse-engineering the exact diagnostic reasoning behind automated triage decisions.",
        evidence: "Text states: 'preclude clinicians from reverse-engineering the exact diagnostic reasoning behind automated triage decisions'.",
        question: "What primary limitation of deep learning in medicine is highlighted by the author?",
        options: [
          "The internal algorithmic decision-making process is opaque and difficult to verify.",
          "The computational hardware is too fragile for sterile hospital environments.",
          "Convolutional networks make more diagnostic errors than novice medical students.",
          "Clinicians refuse to adopt automated diagnostic tools due to trade union strikes."
        ],
        correctIndex: 0,
        explanation: "'preclude clinicians from reverse-engineering... exact diagnostic reasoning' chứng minh tính chất 'black box' khó giải trình của thuật toán."
      }
    ],

    default: [
      {
        id: 'rd_def_1',
        skill: 'reading',
        passage: "Scholarly discourse utilizes strategic hedging devices—including modal auxiliaries and tentative verbs such as 'appears to indicate'—to communicate empirical findings with precision. Rather than weakness, hedging reflects intellectual rigor, acknowledging that scientific conclusions are contingent upon contextual variables and reproducible data.",
        evidence: "Text states: 'hedging reflects intellectual rigor, acknowledging that scientific conclusions are contingent upon contextual variables'.",
        question: "Why do academic researchers deliberately employ hedging language in their papers?",
        options: [
          "To demonstrate intellectual rigor and avoid unverified absolute claims",
          "To satisfy arbitrary word counts imposed by university publishers",
          "To conceal methodological shortcomings from peer review committees",
          "To deliberately confuse competitor research laboratories"
        ],
        correctIndex: 0,
        explanation: "Hedging thể hiện sự cẩn trọng học thuật, phản ánh tính chính xác và khiêm tốn khoa học."
      }
    ]
  },

  // =========================================================================
  // 3. LISTENING (CHĂN NUÔI - PASTURE)
  // Format: Audio Player (TTS Speech) + Note Completion & Distractor Trap
  // =========================================================================
  listening: {
    environment: [
      {
        id: 'ls_env_1',
        skill: 'listening',
        audioText: "Welcome to the Wildlife Sanctuary briefing. The conservation project initially budgeted thirty-five thousand pounds for wetland restoration. However, following the latest governmental biodiversity grant, the finalized operational budget was increased to fifty thousand pounds. Please note that volunteers will assemble at the North Gate at eight-fifteen, rather than eight-forty-five as previously scheduled.",
        audioSpeaker: "Briefing Officer (British Accent)",
        audioDuration: "16s",
        question: "IELTS Listening Section 2: What is the finalized budget allocated to the wetland restoration project?",
        options: [
          "£50,000 (Ngân sách chính thức được duyệt sau khi nhận tài trợ bổ sung)",
          "£35,000 (Bẫy thông tin: Đây chỉ là mức dự toán ban đầu)",
          "£85,000 (Bẫy cộng dồn hai con số)",
          "£15,000 (Bẫy số nhầm lẫn từ mốc giờ 8:15)"
        ],
        correctIndex: 0,
        explanation: "Người nói dùng từ nối tương phản 'However... increased to £50,000'. £35,000 chỉ là số ban đầu ('initially budgeted') - đây là dạng bẫy Distractor kinh điển trong IELTS Listening."
      },
      {
        id: 'ls_env_2',
        skill: 'listening',
        audioText: "For the nocturnal owl survey, volunteers must bring high-visibility jackets and rechargeable headlamps. Although digital voice recorders were recommended in your handbook, our field team will supply specialized directional microphones on site, so you do not need to purchase recording gear.",
        audioSpeaker: "Field Supervisor",
        audioDuration: "14s",
        question: "Which item will be provided directly by the sanctuary team on site?",
        options: [
          "Specialized directional microphones",
          "High-visibility jackets",
          "Rechargeable headlamps",
          "Digital voice recorders"
        ],
        correctIndex: 0,
        explanation: "Người nói nêu: 'our field team will supply specialized directional microphones on site'. Các vật dụng khác tình nguyện viên phải tự mang theo."
      }
    ],

    technology: [
      {
        id: 'ls_tech_1',
        skill: 'listening',
        audioText: "In our automated sorting facility, sensors scan approximately twelve hundred packages per minute. While early prototypes suffered a six percent error rate, the upgraded optical recognition system has brought rejection rates down to just point two percent.",
        audioSpeaker: "Tech Operations Director",
        audioDuration: "13s",
        question: "What is the current error rate achieved by the upgraded optical recognition system?",
        options: [
          "0.2% (Tỷ lệ lỗi chính xác của hệ thống đã nâng cấp)",
          "6% (Bẫy: Tỷ lệ lỗi cũ của bản thử nghiệm sơ khai)",
          "12% (Bẫy số từ con số 1200 kiện hàng)",
          "2.0% (Bẫy nghe nhầm dấu phẩy thập phân)"
        ],
        correctIndex: 0,
        explanation: "Thông tin mấu chốt: 'upgraded optical recognition system has brought rejection rates down to just point two percent (0.2%)'."
      }
    ],

    default: [
      {
        id: 'ls_def_1',
        skill: 'listening',
        audioText: "Good morning, Oxford Student Housing Office. The standard student en-suite room rent is one hundred and twenty pounds weekly, which covers high-speed internet and heating utilities. However, laundry tokens must be purchased separately at two pounds fifty each.",
        audioSpeaker: "Housing Advisor",
        audioDuration: "15s",
        question: "According to the advisor, which utility service is included in the weekly rental fee?",
        options: [
          "Heating utilities & high-speed internet",
          "Weekly laundry token allowances",
          "Daily catered dining hall meals",
          "Private airport taxi transfers"
        ],
        correctIndex: 0,
        explanation: "Người nói xác nhận: 'covers high-speed internet and heating utilities. Laundry tokens must be purchased separately'."
      }
    ]
  },

  // =========================================================================
  // 4. SPEAKING (AO HỒ - POND)
  // Format: IELTS Cue Card + Native Model Audio + Lexical Fluency & Idioms
  // =========================================================================
  speaking: {
    environment: [
      {
        id: 'sp_env_1',
        skill: 'speaking',
        part: 'Part 3: Discussion',
        cueCard: "Do you believe individuals can make a tangible difference in combatting climate change?",
        modelSpeech: "Without a shadow of a doubt. While multinational corporations bear the lion's share of accountability for global carbon emissions, individual grassroots initiatives remain vital. When consumers consciously boycott single-use plastics and embrace sustainable transit, it exerts commercial pressure on businesses to green their supply chains. Ultimately, collective civic action sets the benchmark for legislative policy shifts.",
        modelSpeaker: "Band 8.5 Native Model (British Accent)",
        modelDuration: "22s",
        question: "Cụm thành ngữ học thuật (Idiomatic Expression) nào trong câu trả lời mẫu diễn đạt 'chiếm phần lớn nhất trách nhiệm' đạt điểm 8.0+ Lexical Resource?",
        options: [
          "bear the lion's share of accountability",
          "take a very big part of blame",
          "have a lot of fault on their head",
          "make rain and thunder in the factory"
        ],
        correctIndex: 0,
        explanation: "'bear the lion's share of something' = chiếm phần lớn nhất (thành ngữ tự nhiên C2 được giám khảo IELTS đánh giá rất cao trong Speaking Part 3)."
      },
      {
        id: 'sp_env_2',
        skill: 'speaking',
        part: 'Part 1: Interview',
        cueCard: "How often do you visit parks or natural gardens in your city?",
        modelSpeech: "To be completely candid, as a university student swamped with coursework, I can only visit green spaces on a fortnightly basis. Whenever I do manage to escape the hustle and bustle of downtown, spending an hour amidst lush foliage serves as an indispensable breath of fresh air that recharges my mental batteries.",
        modelSpeaker: "Band 8.5 Native Model",
        modelDuration: "18s",
        question: "Cụm Collocation tự nhiên nào được người nói sử dụng để diễn đạt 'thoát khỏi nhịp sống ồn ào vội vã của đô thị'?",
        options: [
          "escape the hustle and bustle of downtown",
          "run away from noisy cars and high houses",
          "avoid the loud sound of people walking",
          "delete the busy town from my eyes"
        ],
        correctIndex: 0,
        explanation: "'escape the hustle and bustle' là collocation kinh điển C1/C2 dùng để miêu tả sự giải tỏa khỏi chốn thị thành tấp nập."
      }
    ],

    technology: [
      {
        id: 'sp_tech_1',
        skill: 'speaking',
        part: 'Part 3: Discussion',
        cueCard: "Will artificial intelligence completely replace human educators in the near future?",
        modelSpeech: "In my estimation, that is highly improbable. Although generative AI can personalize drill exercises and deliver instantaneous feedback with razor-sharp precision, it fundamentally lacks emotional empathy and mentorship. Teaching is not merely information dissemination; it revolves around inspiring grit and nurturing social intelligence, which algorithms cannot emulate.",
        modelSpeaker: "Band 8.5 Native Model",
        modelDuration: "20s",
        question: "Người nói sử dụng lập luận đắt giá nào để chứng minh AI không thể thay thế hoàn toàn người thầy?",
        options: [
          "Teaching requires emotional empathy and mentorship, which algorithms cannot emulate.",
          "Computers consume too much electricity during classroom hours.",
          "Robots are physically unable to write on traditional blackboards.",
          "Students always break computer screens during recess breaks."
        ],
        correctIndex: 0,
        explanation: "Luận điểm cốt lõi: 'Teaching is not merely information dissemination; it revolves around inspiring grit and emotional empathy'."
      }
    ],

    default: [
      {
        id: 'sp_def_1',
        skill: 'speaking',
        part: 'Fluency Strategy',
        cueCard: "How to maintain natural fluency when answering unexpected IELTS Speaking Part 3 questions?",
        modelSpeech: "Well, that is an intriguing angle that I haven't contemplated in depth before. Off the top of my head, I would argue that...",
        modelSpeaker: "Native Conversational Starter",
        modelDuration: "8s",
        question: "Cụm câu nào giúp bạn kéo dài 2-3 giây suy nghĩ tự nhiên mà không bị ngập ngừng 'ờ, à'?",
        options: [
          "'That's an intriguing question. Off the top of my head, I'd say that...'",
          "'Please wait teacher, my brain is thinking right now.'",
          "Im lặng hoàn toàn nhìn trần nhà 5 giây",
          "Lặp lại câu hỏi của giám khảo 4 lần liên tiếp"
        ],
        correctIndex: 0,
        explanation: "Sử dụng Discourse Fillers học thuật ('That's an intriguing angle...') giúp học viên giữ điểm Fluency & Coherence thay vì ngắc ngứ."
      }
    ]
  },

  // =========================================================================
  // 5. WRITING (NHÀ KÍNH - GREENHOUSE)
  // Format: Task 1/2 Prompt + Band 5.5 Draft -> Band 8.0+ Sentence Transformation
  // =========================================================================
  writing: {
    environment: [
      {
        id: 'wr_env_1',
        skill: 'writing',
        taskType: 'IELTS Writing Task 2 (Problem & Solution)',
        prompt: "Governments should levy heavy carbon taxes on polluting corporations. To what extent do you agree or disagree?",
        originalDraft: "Band 5.5 Draft: 'Government must make bad companies pay money because they make smoke and dirty the air so they will stop doing it.'",
        upgradedGoal: "Nominalization (Danh từ hóa) + Advanced Academic Lexis + Complex Sentence Structure",
        question: "Phiên bản nâng cấp nào đạt chuẩn tiêu chí Band 8.0+ Lexical Resource & Grammatical Range?",
        options: [
          "Enacting stringent carbon taxation serves as an indispensable imperative to compel corporations to transition towards renewable manufacturing paradigms.",
          "Government should make heavy tax bills so that industrial companies are very scared of making dirty air.",
          "Because pollution is bad, charging money to factories is a great idea that everyone loves.",
          "Factories make air dirty, therefore governments have to ask them for lots of dollars every year."
        ],
        correctIndex: 0,
        explanation: "Phương án A sử dụng: Danh từ hóa 'Enacting stringent carbon taxation' làm chủ ngữ, cụm C2 'indispensable imperative', động từ C1 'compel corporations to transition'."
      },
      {
        id: 'wr_env_2',
        skill: 'writing',
        taskType: 'IELTS Writing Task 1 (Academic Graph Description)',
        prompt: "The line graph illustrates carbon dioxide emissions across four European nations between 1990 and 2020.",
        originalDraft: "Band 5.5 Draft: 'The line of UK went down from 10 tonnes to 5 tonnes and it was very fast.'",
        upgradedGoal: "Noun Phrase with Adverbial Modifier + Precision Data Integration",
        question: "Cách diễn đạt nào miêu tả xu hướng giảm mạnh chuẩn văn phong học thuật IELTS Writing Task 1 Band 8.0?",
        options: [
          "The UK witnessed a precipitous decline in per capita emissions, plummeting from 10 to 5 tonnes over the designated timeframe.",
          "The number of UK went down very steeply and it dropped 5 tonnes quickly.",
          "UK carbon dropped down like a stone between 1990 and 2020.",
          "There was a big decrease of UK smoke and gas from 10 to 5."
        ],
        correctIndex: 0,
        explanation: "'witnessed a precipitous decline... plummeting from X to Y' là cấu trúc Task 1 mẫu mực đạt Band 8.0+ cho tiêu chí Lexical Resource & Coherence."
      }
    ],

    technology: [
      {
        id: 'wr_tech_1',
        skill: 'writing',
        taskType: 'IELTS Writing Task 2 (Discussion)',
        prompt: "Some argue that automated algorithms will surpass human intelligence and cause severe societal disruption.",
        originalDraft: "Band 5.5 Draft: 'Robots are getting very smart and they will take all people jobs so people will have no money.'",
        upgradedGoal: "Passive voice + Subordinate clause + Academic terminology",
        question: "Chọn câu viết lại đạt chuẩn Band 8.0 Academic Coherence:",
        options: [
          "Widespread automation threatens to displace substantial segments of the workforce, potentially precipitating unprecedented socioeconomic volatility.",
          "Robots and computers will steal human jobs and cause very bad things to happen in society.",
          "Because machines are too clever, human workers will be fired and stay home without cash.",
          "People losing jobs is caused by computers which are smarter than common workers."
        ],
        correctIndex: 0,
        explanation: "'threatens to displace substantial segments of the workforce, potentially precipitating unprecedented socioeconomic volatility' đạt điểm tối đa tiêu chí Task Achievement & Lexical Resource."
      }
    ],

    default: [
      {
        id: 'wr_def_1',
        skill: 'writing',
        taskType: 'IELTS Cohesive Device Upgrade',
        prompt: "How to upgrade basic conjunctions ('Because of this', 'And also') in Academic Essays?",
        originalDraft: "Band 5.5 Draft: 'And also, because of this, many people agree.'",
        upgradedGoal: "Formal Cause-and-Effect Discourse Marker",
        question: "Từ nối học thuật nào thay thế hoàn hảo cho 'Because of this / So' ở đầu câu luận điểm?",
        options: [
          "Consequently, / As a direct corollary, / By extension,",
          "Next thing I want to say is,",
          "And why not think that,",
          "Plus also another point is,"
        ],
        correctIndex: 0,
        explanation: "'Consequently' và 'As a direct corollary' tạo liên kết logic chặt chẽ, tối ưu hóa điểm số Coherence & Cohesion trong IELTS Writing."
      }
    ]
  }
};

/**
 * Retrieves the specific exercise bank for an Area & Topic
 */
export function getSkillExercises(skillKey = 'vocab', topicKey = 'environment') {
  const bank = PRACTICE_SKILL_BANKS[skillKey] || PRACTICE_SKILL_BANKS.vocab;
  return bank[topicKey] || bank.default || PRACTICE_SKILL_BANKS.vocab.default;
}
