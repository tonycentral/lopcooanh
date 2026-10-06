export const IELTS_TOPICS = [
  {
    id: "environment",
    name: "Environment & Climate Change",
    vietnameseName: "Môi trường & Biến đổi khí hậu",
    tag: "Phổ biến nhất",
    icon: "Leaf",
    ieltsPrompt: "Some people believe that climate change is an inevitable consequence of economic growth, while others argue that sustainable development is achievable. Discuss both views and give your opinion.",
    vocabularies: [
      {
        id: "env-1",
        word: "mitigate",
        partOfSpeech: "verb",
        meaning: "Làm dịu bớt, giảm nhẹ tác hại hoặc mức độ nghiêm trọng",
        basicEquivalent: "reduce / lessen (Band 5-6)",
        synonyms: ["alleviate", "lessen", "diminish", "curb"],
        collocations: ["mitigate environmental degradation", "mitigate climate risks", "mitigate carbon emissions"],
        modelSentence: "Governments must enforce stringent environmental laws to mitigate the detrimental effects of global warming."
      },
      {
        id: "env-2",
        word: "exacerbate",
        partOfSpeech: "verb",
        meaning: "Làm trầm trọng thêm, khiến tình hình tồi tệ hơn",
        basicEquivalent: "make worse (Band 5-6)",
        synonyms: ["worsen", "aggravate", "intensify", "compound"],
        collocations: ["exacerbate the crisis", "exacerbate air pollution", "exacerbate water scarcity"],
        modelSentence: "Unchecked industrial discharge into natural water bodies continues to exacerbate aquatic pollution."
      },
      {
        id: "env-3",
        word: "detrimental",
        partOfSpeech: "adjective",
        meaning: "Gây tổn hại nghiêm trọng, có hại",
        basicEquivalent: "harmful / bad (Band 5-6)",
        synonyms: ["deleterious", "damaging", "destructive", "pernicious"],
        collocations: ["detrimental impact on", "detrimental to wildlife", "have detrimental ramifications"],
        modelSentence: "Deforestation exerts a detrimental influence on biodiversity by obliterating natural habitats."
      },
      {
        id: "env-4",
        word: "sustainable",
        partOfSpeech: "adjective",
        meaning: "Bền vững, có thể duy trì lâu dài mà không cạn kiệt tài nguyên",
        basicEquivalent: "eco-friendly / green (Band 6)",
        synonyms: ["renewable", "viable", "enduring", "self-sustaining"],
        collocations: ["sustainable practices", "sustainable energy transition", "sustainable consumption"],
        modelSentence: "Investing in renewable energy is an imperative step toward building a sustainable future for upcoming generations."
      },
      {
        id: "env-5",
        word: "imperative",
        partOfSpeech: "adjective / noun",
        meaning: "Cấp bách, mang tính chất bắt buộc, không thể trì hoãn",
        basicEquivalent: "very important / necessary (Band 5-6)",
        synonyms: ["paramount", "vital", "crucial", "indispensable"],
        collocations: ["it is imperative to", "moral imperative", "environmental imperative"],
        modelSentence: "It is an absolute imperative that authorities subsidize clean energy infrastructure without delay."
      }
    ],
    coherenceChallenges: [
      {
        id: "env-cc-1",
        sentenceA: "Rapid industrial expansion in emerging economies has significantly heightened atmospheric carbon concentrations.",
        sentenceARole: "Nêu thực trạng / Nguyên nhân chính (Premise & Cause)",
        prompt: "Viết câu tiếp theo (Sentence B) chỉ ra HỆ QUẢ NGHIÊM TRỌNG của tình trạng trên đối với hệ sinh thái toàn cầu.",
        linkingSuggestions: ["Consequently,", "As a direct consequence,", "This alarming trend in turn leads to", "Owing to this,"],
        modelSentenceB: "Consequently, extreme weather anomalies and prolonged droughts have increasingly threatened food security worldwide.",
        coherenceExplanation: "Câu B dùng liên từ chỉ kết quả 'Consequently' kết hợp với cụm quy chiếu 'extreme weather anomalies' để cụ thể hoá hệ quả của lượng carbon tăng cao từ câu A."
      },
      {
        id: "env-cc-2",
        sentenceA: "Transitioning toward renewable energy often requires monumental upfront capital investment that developing nations can scarcely afford.",
        sentenceARole: "Nêu rào cản / Khó khăn (Counter-argument / Limitation)",
        prompt: "Viết câu tiếp theo (Sentence B) đưa ra GIẢI PHÁP HỖ TRỢ từ cộng đồng quốc tế để giải quyết rào cản này.",
        linkingSuggestions: ["To address this dilemma,", "Therefore, affluent nations should", "In light of this obstacle,", "Nevertheless,"],
        modelSentenceB: "To overcome this financial hurdle, international monetary institutions must provide concessionary loans and technological transfers to vulnerable states.",
        coherenceExplanation: "Cụm 'To overcome this financial hurdle' móc nối trực tiếp với 'monumental upfront capital' ở câu A, giúp mạch văn liền mạch và chặt chẽ."
      }
    ]
  },
  {
    id: "education",
    name: "Education & Modern Learning",
    vietnameseName: "Giáo dục & Phương pháp học hiện đại",
    tag: "Chủ đề cốt lõi",
    icon: "GraduationCap",
    ieltsPrompt: "With the rise of online learning and AI tutors, some believe traditional classrooms will soon become obsolete. To what extent do you agree or disagree?",
    vocabularies: [
      {
        id: "edu-1",
        word: "foster",
        partOfSpeech: "verb",
        meaning: "Nuôi dưỡng, thúc đẩy, tạo điều kiện phát triển",
        basicEquivalent: "encourage / help develop (Band 5-6)",
        synonyms: ["cultivate", "nurture", "promote", "stimulate"],
        collocations: ["foster critical thinking", "foster collaboration", "foster intellectual curiosity"],
        modelSentence: "Classroom debates foster critical thinking and help students articulate complex arguments persuasively."
      },
      {
        id: "edu-2",
        word: "obsolete",
        partOfSpeech: "adjective",
        meaning: "Lỗi thời, không còn được sử dụng do có thứ tiên tiến hơn thay thế",
        basicEquivalent: "old-fashioned / out of date (Band 5-6)",
        synonyms: ["outdated", "archaic", "superseded", "redundant"],
        collocations: ["render something obsolete", "become obsolete", "obsolete pedagogical methods"],
        modelSentence: "While artificial intelligence offers personalized study plans, it will never render human mentors obsolete."
      },
      {
        id: "edu-3",
        word: "holistic",
        partOfSpeech: "adjective",
        meaning: "Toàn diện, xem xét tổng thể mọi khía cạnh",
        basicEquivalent: "complete / comprehensive (Band 6)",
        synonyms: ["comprehensive", "all-encompassing", "integrated", "well-rounded"],
        collocations: ["holistic education", "holistic development", "holistic assessment"],
        modelSentence: "A truly holistic curriculum nurtures not only academic prowess but also emotional resilience and ethical values."
      },
      {
        id: "edu-4",
        word: "paramount",
        partOfSpeech: "adjective",
        meaning: "Tối quan trọng, có tầm quan trọng tối cao",
        basicEquivalent: "most important (Band 5-6)",
        synonyms: ["crucial", "preeminent", "indispensable", "vital"],
        collocations: ["of paramount importance", "play a paramount role", "paramount consideration"],
        modelSentence: "Equipping graduates with practical digital literacy is of paramount importance in the contemporary job market."
      },
      {
        id: "edu-5",
        word: "disparity",
        partOfSpeech: "noun",
        meaning: "Sự chênh lệch, sự bất bình đẳng rõ rệt",
        basicEquivalent: "difference / inequality (Band 5-6)",
        synonyms: ["inequality", "gap", "imbalance", "divergence"],
        collocations: ["educational disparity", "socioeconomic disparity", "widen the disparity"],
        modelSentence: "Unequal access to high-speed internet threatens to widen educational disparities between urban and rural learners."
      }
    ],
    coherenceChallenges: [
      {
        id: "edu-cc-1",
        sentenceA: "Digital learning platforms grant students unparalleled autonomy over their study schedules and pace of comprehension.",
        sentenceARole: "Nêu ưu điểm lớn (Strong Advantage)",
        prompt: "Viết câu tiếp theo (Sentence B) đưa ra MẶT TRÁI HOẶC THÁCH THỨC (ví dụ: thiếu tương tác xã hội hoặc giảm tính kỷ luật).",
        linkingSuggestions: ["However, this flexibility can be a double-edged sword because", "Conversely,", "Nevertheless, excessive virtual study may", "Despite these advantages,"],
        modelSentenceB: "However, without disciplined self-regulation, such autonomy often leads to procrastination and diminished academic performance.",
        coherenceExplanation: "Cụm 'However' và 'such autonomy' liên kết khéo léo với 'unparalleled autonomy' của câu A, tạo sự chuyển ý phản biện sắc bén."
      },
      {
        id: "edu-cc-2",
        sentenceA: "Interactive face-to-face instruction remains essential for imparting soft skills and interpersonal communication.",
        sentenceARole: "Khẳng định giá trị của lớp học truyền thống (Supporting Argument)",
        prompt: "Viết câu tiếp theo (Sentence B) DẪN CHỨNG HOẶC GIẢI THÍCH cách học sinh rèn luyện kỹ năng làm việc nhóm.",
        linkingSuggestions: ["For instance,", "Specifically, collaborative group projects enable", "In a physical classroom setting,", "A salient example of this is"],
        modelSentenceB: "For instance, collaborative group discussions compel learners to resolve conflicting perspectives and refine their negotiation skills.",
        coherenceExplanation: "Dùng 'For instance' và cụm từ 'collaborative group discussions' để minh chứng cụ thể cho 'interpersonal communication' đã nêu."
      }
    ]
  },
  {
    id: "technology",
    name: "Artificial Intelligence & Automation",
    vietnameseName: "Trí tuệ nhân tạo & Tự động hoá",
    tag: "Thời sự & Xu hướng",
    icon: "Cpu",
    ieltsPrompt: "Artificial intelligence and automation are predicted to replace millions of jobs across various sectors. Do the advantages of this technological revolution outweigh the disadvantages?",
    vocabularies: [
      {
        id: "tech-1",
        word: "ubiquitous",
        partOfSpeech: "adjective",
        meaning: "Phổ biến khắp nơi, có mặt ở mọi chỗ",
        basicEquivalent: "common / everywhere (Band 5-6)",
        synonyms: ["omnipresent", "pervasive", "widespread", "prevalent"],
        collocations: ["ubiquitous presence", "become ubiquitous in daily life", "ubiquitous computing"],
        modelSentence: "Automated algorithms have become ubiquitous across finance, manufacturing, and consumer services."
      },
      {
        id: "tech-2",
        word: "supersede",
        partOfSpeech: "verb",
        meaning: "Thay thế vị trí của cái cũ bằng cái mới ưu việt hơn",
        basicEquivalent: "replace (Band 5-6)",
        synonyms: ["supplant", "replace", "displace", "overtake"],
        collocations: ["supersede manual labor", "be superseded by autonomous systems"],
        modelSentence: "Predictive AI models are poised to supersede routine administrative tasks formerly executed by human clerks."
      },
      {
        id: "tech-3",
        word: "profound",
        partOfSpeech: "adjective",
        meaning: "Sâu sắc, có tầm ảnh hưởng to lớn và toàn diện",
        basicEquivalent: "deep / great (Band 5-6)",
        synonyms: ["momentous", "far-reaching", "immense", "significant"],
        collocations: ["profound implications", "profound transformation", "profound impact on"],
        modelSentence: "The widespread adoption of generative AI has provoked profound transformations in the creative and technical industries."
      },
      {
        id: "tech-4",
        word: "upskill",
        partOfSpeech: "verb",
        meaning: "Học nâng cao kỹ năng mới để thích ứng với thị trường lao động",
        basicEquivalent: "learn new skills (Band 5-6)",
        synonyms: ["retrain", "enhance competence", "acquire advanced capabilities"],
        collocations: ["upskill the workforce", "need to upskill continuously", "upskilling programs"],
        modelSentence: "To remain competitive alongside robotic systems, professionals must proactively upskill in creative and strategic domains."
      },
      {
        id: "tech-5",
        word: "ethical",
        partOfSpeech: "adjective",
        meaning: "Thuộc về đạo đức, phù hợp với chuẩn mực luân lý",
        basicEquivalent: "moral / good (Band 5-6)",
        synonyms: ["moral", "principled", "scrupulous", "virtuous"],
        collocations: ["ethical dilemmas", "ethical framework", "ethical considerations"],
        modelSentence: "Developing transparent algorithms is essential to navigate the ethical dilemmas surrounding automated decision-making."
      }
    ],
    coherenceChallenges: [
      {
        id: "tech-cc-1",
        sentenceA: "Generative artificial intelligence has streamlined content creation and drastically lowered corporate operating expenses.",
        sentenceARole: "Nêu lợi ích kinh tế (Economic Benefit)",
        prompt: "Viết câu tiếp theo (Sentence B) phân tích MỐI LO NGẠI VỀ NẠN THẤT NGHIỆP hoặc sự dịch chuyển việc làm của lao động.",
        linkingSuggestions: ["Conversely, this surge in automation threatens", "However, these efficiency gains come at the cost of", "Nevertheless,", "On the other hand,"],
        modelSentenceB: "However, these remarkable efficiency gains come at the cost of widespread displacement among entry-level creative professionals.",
        coherenceExplanation: "Cụm 'these remarkable efficiency gains' tóm lược lại toàn bộ ý của câu A, sau đó dẫn vào vế phản biện 'come at the cost of' rất đắt giá."
      }
    ]
  },
  {
    id: "health",
    name: "Health, Lifestyle & Public Healthcare",
    vietnameseName: "Sức khoẻ, Lối sống & Y tế",
    tag: "Chủ đề quen thuộc",
    icon: "HeartPulse",
    ieltsPrompt: "Sedentary lifestyles and fast food consumption have caused unprecedented surges in obesity and chronic illnesses. Should governments impose taxes on unhealthy foods to promote public health?",
    vocabularies: [
      {
        id: "health-1",
        word: "sedentary",
        partOfSpeech: "adjective",
        meaning: "Ngồi nhiều một chỗ, thụ động, ít vận động thể chất",
        basicEquivalent: "inactive / sitting a lot (Band 5-6)",
        synonyms: ["inactive", "sluggish", "desk-bound", "torpid"],
        collocations: ["sedentary lifestyle", "sedentary desk job", "sedentary habits"],
        modelSentence: "A sedentary lifestyle combined with diets high in processed sugars drastically elevates cardiovascular mortality."
      },
      {
        id: "health-2",
        word: "deterrent",
        partOfSpeech: "noun",
        meaning: "Biện pháp răn đe, yếu tố ngăn chặn hành vi tiêu cực",
        basicEquivalent: "prevention / barrier (Band 5-6)",
        synonyms: ["disincentive", "curb", "impediment", "restraint"],
        collocations: ["act as a deterrent", "effective deterrent against", "financial deterrent"],
        modelSentence: "Heavier taxation on sugary beverages acts as a potent financial deterrent against excessive consumption."
      },
      {
        id: "health-3",
        word: "alleviate",
        partOfSpeech: "verb",
        meaning: "Làm giảm nhẹ bớt gánh nặng, cơn đau hoặc áp lực",
        basicEquivalent: "ease / make less painful (Band 5-6)",
        synonyms: ["ease", "relieve", "mitigate", "assuage"],
        collocations: ["alleviate the burden on healthcare", "alleviate chronic symptoms", "alleviate poverty"],
        modelSentence: "Promoting preventative wellness programs can substantially alleviate pressure on overwhelmed national hospitals."
      },
      {
        id: "health-4",
        word: "prevalent",
        partOfSpeech: "adjective",
        meaning: "Thịnh hành, phổ biến rộng rãi trong một cộng đồng",
        basicEquivalent: "common / widespread (Band 5-6)",
        synonyms: ["widespread", "rampant", "pervasive", "ubiquitous"],
        collocations: ["prevalent among youth", "prevalent chronic condition", "increasingly prevalent"],
        modelSentence: "Type 2 diabetes is becoming increasingly prevalent among adolescents due to poor dietary habits."
      }
    ],
    coherenceChallenges: [
      {
        id: "health-cc-1",
        sentenceA: "Imposing punitive excise taxes on junk food has proven remarkably effective in dampening consumer demand in several European countries.",
        sentenceARole: "Nêu chính sách & hiệu quả (Policy & Evidence)",
        prompt: "Viết câu tiếp theo (Sentence B) đề xuất CÁCH SỬ DỤNG NGUỒN THU THUẾ NÀY (ví dụ: tái đầu tư vào bữa ăn học đường hoặc cơ sở thể thao).",
        linkingSuggestions: ["The fiscal revenues generated from this policy can subsequently be allocated to", "Furthermore, these tax proceeds could be channeled into", "Consequently,"],
        modelSentenceB: "Furthermore, the tax proceeds generated from these measures can be channeled directly into subsidizing organic farm produce and public athletic facilities.",
        coherenceExplanation: "Cụm 'the tax proceeds generated from these measures' liên kết chính xác với 'punitive excise taxes' ở câu A, giúp đoạn văn đạt điểm Cohesion tối đa."
      }
    ]
  },
  {
    id: "crime",
    name: "Crime, Law & Rehabilitation",
    vietnameseName: "Tội phạm, Pháp luật & Cải tạo",
    tag: "Chủ đề nâng cao",
    icon: "ShieldAlert",
    ieltsPrompt: "Some people believe that long prison sentences are the best way to reduce crime, while others argue that rehabilitation and education are more effective. Discuss both views and give your opinion.",
    vocabularies: [
      {
        id: "crime-1",
        word: "rehabilitate",
        partOfSpeech: "verb",
        meaning: "Cải tạo, giáo dục phục hồi nhân phẩm cho người lầm lỡ",
        basicEquivalent: "help reform / change (Band 5-6)",
        synonyms: ["reform", "reintegrate", "reclaim", "restore"],
        collocations: ["rehabilitate ex-convicts", "rehabilitate offenders", "rehabilitation programs"],
        modelSentence: "Vocational training behind bars is crucial to rehabilitate offenders and prepare them for lawful societal reintegration."
      },
      {
        id: "crime-2",
        word: "recidivism",
        partOfSpeech: "noun",
        meaning: "Tỷ lệ tái phạm tội của người từng thụ án",
        basicEquivalent: "re-offending rate (Band 6)",
        synonyms: ["re-offending", "relapse into crime"],
        collocations: ["reduce recidivism rates", "high rate of recidivism", "combat recidivism"],
        modelSentence: "Prisons that prioritize counseling over severe punishment report markedly lower rates of recidivism."
      },
      {
        id: "crime-3",
        word: "stringent",
        partOfSpeech: "adjective",
        meaning: "Nghiêm ngặt, chặt chẽ, khắt khe",
        basicEquivalent: "strict / tough (Band 5-6)",
        synonyms: ["rigorous", "draconian", "tight", "exacting"],
        collocations: ["stringent penalties", "stringent regulations", "stringent legislative measures"],
        modelSentence: "Enacting stringent penalties for financial fraud serves as a powerful warning to potential white-collar criminals."
      },
      {
        id: "crime-4",
        word: "reintegrate",
        partOfSpeech: "verb",
        meaning: "Tái hòa nhập cộng đồng sau một thời gian cách ly",
        basicEquivalent: "fit back into society (Band 5-6)",
        synonyms: ["assimilate back", "reincorporate", "re-enter mainstream life"],
        collocations: ["reintegrate into society", "reintegrate into the labor market", "smooth reintegration"],
        modelSentence: "Community support systems help former inmates reintegrate into society and secure lawful employment."
      }
    ],
    coherenceChallenges: [
      {
        id: "crime-cc-1",
        sentenceA: "Prolonged incarceration often hardens first-time offenders rather than reforming their criminal mindsets.",
        sentenceARole: "Nêu mặt trái của hình phạt tù (Critique of Incarceration)",
        prompt: "Viết câu tiếp theo (Sentence B) giải thích LÝ DO (ví dụ: bị ảnh hưởng bởi tội phạm nguy hiểm trong tù và thiếu kỹ năng sống).",
        linkingSuggestions: ["This is primarily because", "In prison environments,", "Deprived of social ties,", "Consequently, upon release,"],
        modelSentenceB: "This is primarily because exposure to hardened convicts inside penitentiaries often deepens antisocial tendencies and severs vital familial connections.",
        coherenceExplanation: "Dùng 'This is primarily because' để mở ra lời giải thích trực tiếp cho hiện tượng 'hardens first-time offenders' đã chỉ ra ở câu A."
      }
    ]
  },
  {
    id: "globalization",
    name: "Globalization, Culture & Heritage",
    vietnameseName: "Toàn cầu hoá & Bản sắc văn hoá",
    tag: "Chủ đề học thuật sâu",
    icon: "Globe",
    ieltsPrompt: "As the world becomes more globalized, local cultures, traditions, and minority languages are in danger of disappearing. To what extent do you agree with this statement?",
    vocabularies: [
      {
        id: "glob-1",
        word: "homogenize",
        partOfSpeech: "verb",
        meaning: "Đồng nhất hóa, làm cho mọi thứ trở nên giống hệt nhau, mất đi nét riêng",
        basicEquivalent: "make the same (Band 5-6)",
        synonyms: ["standardize", "uniformize", "assimilate"],
        collocations: ["cultural homogenization", "homogenize global customs", "homogenized identity"],
        modelSentence: "The dominance of multinational brands threatens to homogenize distinct architectural and culinary traditions."
      },
      {
        id: "glob-2",
        word: "indigenous",
        partOfSpeech: "adjective",
        meaning: "Bản địa, thuộc về nguồn gốc nguyên bản của một vùng đất",
        basicEquivalent: "local / native (Band 5-6)",
        synonyms: ["native", "aboriginal", "autochthonous"],
        collocations: ["indigenous languages", "indigenous heritage", "indigenous communities"],
        modelSentence: "Safeguarding indigenous dialects preserves irreplaceable repositories of botanical and ecological wisdom."
      },
      {
        id: "glob-3",
        word: "preserve",
        partOfSpeech: "verb",
        meaning: "Bảo tồn, gìn giữ cho thế hệ mai sau",
        basicEquivalent: "protect / keep (Band 5-6)",
        synonyms: ["safeguard", "conserve", "perpetuate", "sustain"],
        collocations: ["preserve cultural heritage", "preserve folk arts", "preserve historic monuments"],
        modelSentence: "Government funding is essential to preserve ancient historical monuments from urban encroachment."
      },
      {
        id: "glob-4",
        word: "erosion",
        partOfSpeech: "noun",
        meaning: "Sự xói mòn, mai một dần theo thời gian",
        basicEquivalent: "loss / weakening (Band 5-6)",
        synonyms: ["deterioration", "degradation", "decline", "dissolution"],
        collocations: ["erosion of traditional values", "erosion of cultural identity", "gradual erosion"],
        modelSentence: "The influx of foreign media content has triggered a noticeable erosion of traditional ancestral customs among youth."
      }
    ],
    coherenceChallenges: [
      {
        id: "glob-cc-1",
        sentenceA: "International tourism generates substantial revenue that municipal councils can reinvest into historical preservation.",
        sentenceARole: "Nêu lợi ích kinh tế của du lịch (Positive Aspect)",
        prompt: "Viết câu tiếp theo (Sentence B) đưa ra MẶT TRÁI (ví dụ: thương mại hoá quá mức làm biến chất văn hoá truyền thống).",
        linkingSuggestions: ["Nonetheless, unregulated commercialization risks", "However, excessive commercial pressure can", "Conversely,"],
        modelSentenceB: "Nonetheless, rampant commercialization risks commodifying sacred rituals into superficial spectacles staged solely for travelers.",
        coherenceExplanation: "Sử dụng 'Nonetheless' kết hợp với 'rampant commercialization' đối chiếu tương phản sâu sắc với ý doanh thu du lịch ở câu A."
      }
    ]
  }
];

export const IELTS_TASK2_TOPICS = IELTS_TOPICS;

export const IELTS_TASK1_TOPICS = [
  {
    id: "task1-line-graph",
    name: "Line Graph: Renewable vs Fossil Energy (2000-2030)",
    vietnameseName: "Biểu đồ đường: Năng lượng tái tạo vs Nhiên liệu hóa thạch",
    tag: "Task 1: Xu hướng thời gian",
    icon: "TrendingUp",
    ieltsPrompt: "The line graph below shows the changes in energy consumption between fossil fuels and renewable energy sources from 2000 to 2030 (including projections). Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    vocabularies: [
      {
        id: "t1-lg-1",
        word: "outstrip",
        partOfSpeech: "verb",
        meaning: "Vượt xa, vượt trội hơn về số lượng hoặc tốc độ tăng",
        basicEquivalent: "exceed / surpass (Band 5-6)",
        synonyms: ["surpass", "eclipse", "overtake"],
        collocations: ["outstrip demand", "dramatically outstrip", "projected to outstrip"],
        modelSentence: "By 2028, renewable electricity generation is projected to outstrip coal consumption globally."
      },
      {
        id: "t1-lg-2",
        word: "plateau",
        partOfSpeech: "verb / noun",
        meaning: "Đạt trạng thái bình ổn, đi ngang sau giai đoạn tăng nhanh",
        basicEquivalent: "stay unchanged / level off (Band 5-6)",
        synonyms: ["level off", "stabilize", "flatten out"],
        collocations: ["reach a plateau", "plateau at approximately 40%"],
        modelSentence: "After experiencing rapid gains during the initial decade, petroleum reliance plateaued at around 45%."
      },
      {
        id: "t1-lg-3",
        word: "fluctuate",
        partOfSpeech: "verb",
        meaning: "Dao động lên xuống thất thường qua các mốc thời gian",
        basicEquivalent: "go up and down (Band 5)",
        synonyms: ["oscillate", "vary erratically", "shift"],
        collocations: ["fluctuate between 20% and 30%", "experience wild fluctuations"],
        modelSentence: "Natural gas production fluctuated mildly before commencing a steep downward trend."
      },
      {
        id: "t1-lg-4",
        word: "trajectory",
        partOfSpeech: "noun",
        meaning: "Quỹ đạo, chiều hướng phát triển liên tục",
        basicEquivalent: "trend / direction (Band 6)",
        synonyms: ["upward trend", "course", "pathway"],
        collocations: ["upward trajectory", "downward trajectory", "follow an identical trajectory"],
        modelSentence: "Solar and wind power maintained an uninterrupted upward trajectory throughout the surveyed period."
      }
    ],
    coherenceChallenges: [
      {
        id: "t1-lg-cc-1",
        sentenceA: "Overall, fossil fuel consumption followed an overall downward trajectory over the three-decade timeframe.",
        sentenceARole: "Nêu xu hướng tổng quan của đối tượng 1 (Overview part 1)",
        prompt: "Viết câu tiếp theo (Sentence B) đối chiếu với xu hướng tăng trưởng vượt bậc của nguồn năng lượng tái tạo (Overview part 2).",
        linkingSuggestions: ["In stark contrast,", "Conversely,", "By comparison, renewable energy sources witnessed"],
        modelSentenceB: "In stark contrast, green energy generation experienced exponential growth, outstripping conventional sources by the end of the period.",
        coherenceExplanation: "Cụm nối đối lập 'In stark contrast' tạo sự tương phản rõ rệt giữa hai xu hướng ngược chiều trong phần Overview của Task 1."
      }
    ]
  },
  {
    id: "task1-bar-chart",
    name: "Bar Chart: Household Spending on Education & Leisure",
    vietnameseName: "Biểu đồ cột: Chi tiêu hộ gia đình cho giáo dục & giải trí",
    tag: "Task 1: Biểu đồ so sánh",
    icon: "BarChart3",
    ieltsPrompt: "The bar chart illustrates the proportion of household budgets spent on education, housing, and recreation across five countries in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    vocabularies: [
      {
        id: "t1-bc-1",
        word: "allocate",
        partOfSpeech: "verb",
        meaning: "Phân bổ, dành ngân sách hay tài nguyên cho một mục đích",
        basicEquivalent: "spend / give money to (Band 5)",
        synonyms: ["earmark", "apportion", "distribute"],
        collocations: ["allocate funds to", "budget allocated for education"],
        modelSentence: "Households in Country A allocated nearly a third of their total earnings to academic tuition."
      },
      {
        id: "t1-bc-2",
        word: "disproportionately",
        partOfSpeech: "adverb",
        meaning: "Không tương xứng, chiếm tỉ trọng vượt trội hoặc áp đảo",
        basicEquivalent: "much more / unbalanced (Band 5-6)",
        synonyms: ["excessively", "unevenly", "overwhelmingly"],
        collocations: ["disproportionately high", "spent disproportionately more"],
        modelSentence: "Recreational expenses accounted for a disproportionately small fraction of expenditure in developing nations."
      },
      {
        id: "t1-bc-3",
        word: "disparity",
        partOfSpeech: "noun",
        meaning: "Sự chênh lệch, khoảng cách khác biệt giữa các số liệu",
        basicEquivalent: "difference / gap (Band 5-6)",
        synonyms: ["divergence", "gap", "inequality"],
        collocations: ["substantial disparity", "marginal disparity between nations"],
        modelSentence: "A substantial disparity is observable between capital city dwellers and rural families regarding education outlay."
      }
    ],
    coherenceChallenges: [
      {
        id: "t1-bc-cc-1",
        sentenceA: "Housing remained the most dominant expenditure category in four out of the five evaluated nations, averaging roughly 38%.",
        sentenceARole: "Nêu hạng mục dẫn đầu (Dominant feature)",
        prompt: "Viết câu tiếp theo (Sentence B) chỉ ra hạng mục có tỉ trọng thấp nhất và so sánh sự chênh lệch.",
        linkingSuggestions: ["At the opposite end of the spectrum,", "Conversely, expenditure on leisure constituted", "In contrast,"],
        modelSentenceB: "At the opposite end of the spectrum, recreational activities constituted a negligible proportion, hovering beneath 8% overall.",
        coherenceExplanation: "Cụm 'At the opposite end of the spectrum' là cách diễn đạt C1 liên kết tương phản giữa mức chi tiêu cao nhất và thấp nhất."
      }
    ]
  },
  {
    id: "task1-process",
    name: "Process Diagram: Industrial Paper Recycling Flow",
    vietnameseName: "Quy trình: Các giai đoạn tái chế giấy công nghiệp",
    tag: "Task 1: Sơ đồ quy trình",
    icon: "Layers",
    ieltsPrompt: "The diagram illustrates how waste paper is collected, treated, and recycled into commercial packaging. Summarise the information by selecting and reporting the main features.",
    vocabularies: [
      {
        id: "t1-pr-1",
        word: "commence",
        partOfSpeech: "verb",
        meaning: "Bắt đầu, khởi sự một quy trình công nghiệp",
        basicEquivalent: "start / begin (Band 5)",
        synonyms: ["initiate", "set in motion", "kick off"],
        collocations: ["the procedure commences with", "commence sorting"],
        modelSentence: "The recycling loop commences with the systematic collection of used cardboard from urban recovery centers."
      },
      {
        id: "t1-pr-2",
        word: "undergo",
        partOfSpeech: "verb",
        meaning: "Trải qua một công đoạn xử lý vật lý hoặc hóa học",
        basicEquivalent: "experience / go through (Band 5-6)",
        synonyms: ["subject to", "experience", "pass through"],
        collocations: ["undergo chemical treatment", "undergo thorough filtration"],
        modelSentence: "The soaked paper pulp undergoes extensive de-inking and mechanical cleaning before being rolled."
      },
      {
        id: "t1-pr-3",
        word: "subsequently",
        partOfSpeech: "adverb",
        meaning: "Sau đó, ở giai đoạn tiếp theo của tiến trình",
        basicEquivalent: "then / after that (Band 5)",
        synonyms: ["consequently", "thereafter", "next"],
        collocations: ["subsequently transferred to", "subsequently pressed"],
        modelSentence: "The bleached fiber slurry is subsequently squeezed through heavy heated rollers to evaporate residual moisture."
      }
    ],
    coherenceChallenges: [
      {
        id: "t1-pr-cc-1",
        sentenceA: "Initial sorting removes non-recyclable contaminants such as plastic liners and adhesive tapes from raw paper bales.",
        sentenceARole: "Mô tả công đoạn sơ chế ban đầu (Initial stage)",
        prompt: "Viết câu tiếp theo (Sentence B) chuyển tiếp sang giai đoạn ngâm ủ dung dịch hóa chất để tạo bột giấy.",
        linkingSuggestions: ["Following this preliminary step,", "Once sorted, the refined paper is subsequently", "Thereafter,"],
        modelSentenceB: "Following this preliminary step, the cleaned sheets are submerged into an alkaline liquid chamber to be broken down into fiber pulp.",
        coherenceExplanation: "Cụm 'Following this preliminary step' tạo sự kết nối thời gian và tiến trình cực kỳ mượt mà, đúng chuẩn Task 1 Process."
      }
    ]
  }
];

