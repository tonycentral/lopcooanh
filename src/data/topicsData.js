import { enrichVocabulary } from './vocabEnhancer';

const RAW_IELTS_TOPICS = [
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
        ipa: "/ˈmɪt.ɪ.ɡeɪt/",
        partOfSpeech: "verb",
        meaning: "Làm dịu bớt, giảm nhẹ tác hại hoặc mức độ nghiêm trọng",
        basicEquivalent: "reduce / lessen (Band 5-6)",
        synonyms: ["alleviate", "lessen", "diminish", "curb"],
        collocations: ["mitigate environmental degradation", "mitigate climate risks", "mitigate carbon emissions"],
        modelSentence: "Governments must enforce stringent environmental laws to mitigate the detrimental effects of global warming.",
        vietnameseSentence: "Chính phủ cần ban hành các đạo luật môi trường nghiêm ngặt để giảm nhẹ các tác động tiêu cực của sự nóng lên toàn cầu.",
        vietnameseQuiz: {
          question: "Nghĩa tiếng Việt chuẩn xác nhất của từ 'mitigate' là gì?",
          options: [
            "Làm dịu bớt, giảm nhẹ tác hại hoặc mức độ nghiêm trọng",
            "Làm trầm trọng thêm và gia tăng mức độ rủi ro",
            "Duy trì nguyên trạng mà không có sự can thiệp",
            "Phân chia đều tài nguyên cho các bên liên quan"
          ],
          correctIndex: 0
        },
        sentencePractice: {
          vietnamesePrompt: "Chính phủ cần ban hành các đạo luật môi trường nghiêm ngặt để giảm nhẹ các tác động tiêu cực của biến đổi khí hậu.",
          targetWord: "mitigate",
          modelTranslation: "Governments must enforce stringent environmental laws to mitigate the detrimental effects of climate change.",
          bandUpgrades: {
            "6.5": "Governments must pass strict environment laws to reduce the bad effects of climate change.",
            "7.0": "It is essential that governments enforce strict environmental regulations to mitigate the negative impacts of climate change.",
            "7.5": "It is imperative that authorities enforce stringent environmental legislation to effectively mitigate the detrimental consequences of global warming.",
            "8.0": "Enacting rigorous statutory frameworks has become an absolute imperative to mitigate the catastrophic ramifications of climate change.",
            "8.5": "The implementation of stringent environmental jurisprudence is of paramount importance to comprehensively mitigate irreversible anthropogenic climate degradation."
          },
          upgradeDetails: [
            "Từ vựng: 'giảm nhẹ' được nâng cấp thành động từ C1 'mitigate' kết hợp cùng danh từ 'consequences/ramifications'.",
            "Collocation: 'stringent environmental legislation' (luật môi trường nghiêm ngặt) thay vì 'strict laws'.",
            "Ngữ pháp: Cấu trúc giả định thức 'It is imperative that... enforce' hoặc danh từ hóa 'Enacting rigorous statutory frameworks'."
          ]
        },
        twoSentencePractice: {
          sentence1Vietnamese: "Sự bùng nổ của các khu công nghiệp đã xả một lượng lớn khí thải độc hại vào bầu khí quyển.",
          sentence2Vietnamese: "Do đó, các nhà máy buộc phải đầu tư công nghệ xanh nhằm giảm nhẹ mức độ ô nhiễm trước khi quá muộn.",
          linkingSuggestions: ["Consequently,", "As a direct consequence,", "Therefore,", "In light of this,"],
          modelTranslation: "The rapid expansion of industrial zones has released massive volumes of toxic emissions into the atmosphere. Consequently, manufacturing facilities must invest in green technologies to mitigate environmental degradation before it is too late.",
          bandUpgrades: {
            "6.5": "Industrial zones release a lot of pollution into the air. Therefore, factories must use green technology to reduce pollution.",
            "7.0": "The rapid growth of industrial zones has discharged huge volumes of toxic emissions into the air. Consequently, manufacturing plants should adopt clean technologies to mitigate environmental pollution.",
            "7.5": "Unregulated industrial proliferation has discharged substantial volumes of hazardous pollutants into the atmosphere. Consequently, industrial plants are compelled to deploy green innovations to effectively mitigate ecological damage.",
            "8.0": "Rampant industrial proliferation has discharged astronomical quantities of toxic effluents into the biosphere. As a direct consequence, conglomerates are obligated to integrate cutting-edge green technologies to mitigate severe ecological deterioration before tipping points are reached.",
            "8.5": "Unchecked industrial expansion has precipitated unprecedented atmospheric emissions of hazardous pollutants. Consequently, industrial conglomerates are duty-bound to pioneer sustainable technologies in order to systematically mitigate catastrophic ecological disruptions."
          },
          upgradeDetails: [
            "Cách chuyển câu (Cohesion): Sử dụng liên từ C1 'Consequently' hoặc 'As a direct consequence' để móc xích nguyên nhân ở Câu 1 với giải pháp ở Câu 2.",
            "Từ vựng học thuật: 'rampant industrial proliferation' (sự bùng nổ công nghiệp không kiểm soát), 'discharged' thay vì 'xả thải', 'ecological deterioration'.",
            "Mạch lập luận logic: Câu 1 nêu thực trạng khẩn cấp, Câu 2 dùng đại từ quy chiếu và mục đích kép để đạt điểm Task Response & Coherence Band 8.0+."
          ]
        }
      },
      {
        id: "env-2",
        word: "exacerbate",
        ipa: "/ɪɡˈzæs.ər.beɪt/",
        partOfSpeech: "verb",
        meaning: "Làm trầm trọng thêm, khiến tình hình tồi tệ hơn",
        basicEquivalent: "make worse (Band 5-6)",
        synonyms: ["worsen", "aggravate", "intensify", "compound"],
        collocations: ["exacerbate the crisis", "exacerbate air pollution", "exacerbate water scarcity"],
        modelSentence: "Unchecked industrial discharge into natural water bodies continues to exacerbate aquatic pollution.",
        vietnameseSentence: "Việc xả thải công nghiệp không kiểm soát vào các nguồn nước tự nhiên tiếp tục làm trầm trọng thêm tình trạng ô nhiễm nguồn nước.",
        vietnameseQuiz: {
          question: "Nghĩa tiếng Việt chuẩn xác nhất của từ 'exacerbate' là gì?",
          options: [
            "Làm trầm trọng thêm, khiến tình hình tồi tệ hơn",
            "Xoa dịu và cải thiện dần theo thời gian",
            "Dừng lại hoàn toàn một hoạt động sản xuất",
            "Kêu gọi sự đồng thuận từ các bên tham gia"
          ],
          correctIndex: 0
        }
      },
      {
        id: "env-3",
        word: "detrimental",
        ipa: "/ˌdet.rɪˈmen.təl/",
        partOfSpeech: "adjective",
        meaning: "Gây tổn hại nghiêm trọng, có hại",
        basicEquivalent: "harmful / bad (Band 5-6)",
        synonyms: ["deleterious", "damaging", "destructive", "pernicious"],
        collocations: ["detrimental impact on", "detrimental to wildlife", "have detrimental ramifications"],
        modelSentence: "Deforestation exerts a detrimental influence on biodiversity by obliterating natural habitats.",
        vietnameseSentence: "Nạn phá rừng gây ra ảnh hưởng bất lợi nghiêm trọng đến đa dạng sinh học bằng việc xóa sổ môi trường sống tự nhiên."
      },
      {
        id: "env-4",
        word: "sustainable",
        ipa: "/səˈsteɪ.nə.bəl/",
        partOfSpeech: "adjective",
        meaning: "Bền vững, có thể duy trì lâu dài mà không cạn kiệt tài nguyên",
        basicEquivalent: "eco-friendly / green (Band 6)",
        synonyms: ["renewable", "viable", "enduring", "self-sustaining"],
        collocations: ["sustainable practices", "sustainable energy transition", "sustainable consumption"],
        modelSentence: "Investing in renewable energy is an imperative step toward building a sustainable future for upcoming generations.",
        vietnameseSentence: "Đầu tư vào năng lượng tái tạo là một bước đi cấp bách hướng tới việc xây dựng tương lai bền vững cho các thế hệ mai sau."
      },
      {
        id: "env-5",
        word: "imperative",
        ipa: "/ɪmˈper.ə.tɪv/",
        partOfSpeech: "adjective / noun",
        meaning: "Cấp bách, mang tính chất bắt buộc, không thể trì hoãn",
        basicEquivalent: "very important / necessary (Band 5-6)",
        synonyms: ["paramount", "vital", "crucial", "indispensable"],
        collocations: ["it is imperative to", "moral imperative", "environmental imperative"],
        modelSentence: "It is an absolute imperative that authorities subsidize clean energy infrastructure without delay.",
        vietnameseSentence: "Chính quyền bắt buộc phải trợ cấp cho cơ sở hạ tầng năng lượng sạch ngay lập tức mà không được trì hoãn."
      },
      {
        id: "env-6",
        word: "deplete",
        ipa: "/dɪˈpliːt/",
        partOfSpeech: "verb",
        meaning: "Làm cạn kiệt nguồn tài nguyên thiên nhiên hoặc nguồn dự trữ",
        basicEquivalent: "run out of / use up (Band 5)",
        synonyms: ["exhaust", "drain", "diminish", "consume"],
        collocations: ["deplete natural resources", "severely deplete groundwater", "deplete fossil fuel reserves"],
        modelSentence: "Overexploitation of natural resources threatens to severely deplete freshwater reserves by 2050.",
        vietnameseSentence: "Khai thác quá mức tài nguyên thiên nhiên đe dọa làm cạn kiệt nghiêm trọng nguồn dự trữ nước ngọt vào năm 2050."
      },
      {
        id: "env-7",
        word: "biodiversity",
        ipa: "/ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/",
        partOfSpeech: "noun",
        meaning: "Đa dạng sinh học, sự phong phú của các loài động thực vật",
        basicEquivalent: "variety of animals and plants (Band 5)",
        synonyms: ["biological diversity", "ecological richness"],
        collocations: ["loss of biodiversity", "preserve terrestrial biodiversity", "threat to biodiversity"],
        modelSentence: "The catastrophic loss of biodiversity compromises the resilience of global ecosystems against climate shocks.",
        vietnameseSentence: "Sự suy giảm thảm khốc của đa dạng sinh học làm suy yếu khả năng chống chịu của hệ sinh thái toàn cầu trước các cú sốc khí hậu."
      },
      {
        id: "env-8",
        word: "irreversible",
        ipa: "/ˌɪr.ɪˈvɜː.sə.bəl/",
        partOfSpeech: "adjective",
        meaning: "Không thể đảo ngược hay khôi phục lại trạng thái ban đầu",
        basicEquivalent: "cannot be changed back (Band 5)",
        synonyms: ["permanent", "irrevocable", "incurable"],
        collocations: ["irreversible ecological damage", "irreversible tipping points", "lead to irreversible consequences"],
        modelSentence: "Delaying climate actions risks triggering irreversible environmental tipping points across polar regions.",
        vietnameseSentence: "Trì hoãn các hành động vì khí hậu có nguy cơ kích hoạt những điểm tới hạn sinh thái không thể cứu vãn trên khắp các vùng địa cực."
      },
      {
        id: "env-9",
        word: "contamination",
        ipa: "/kənˌtæm.ɪˈneɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Sự ô nhiễm, làm nhiễm bẩn độc hại",
        basicEquivalent: "pollution (Band 5)",
        synonyms: ["pollution", "adulteration", "poisoning", "taint"],
        collocations: ["groundwater contamination", "radioactive contamination", "chemical contamination"],
        modelSentence: "Widespread pesticide runoff causes extensive groundwater contamination, threatening rural drinking water.",
        vietnameseSentence: "Dư lượng thuốc trừ sâu rửa trôi gây ô nhiễm nguồn nước ngầm trên diện rộng, đe dọa nước sinh hoạt của nông thôn."
      },
      {
        id: "env-10",
        word: "ecological",
        ipa: "/ˌiː.kəˈlɒdʒ.ɪ.kəl/",
        partOfSpeech: "adjective",
        meaning: "Thuộc về hệ sinh thái và mối quan hệ sinh vật - môi trường",
        basicEquivalent: "environmental (Band 5)",
        synonyms: ["environmental", "biological", "ecosystemic"],
        collocations: ["ecological balance", "ecological footprint", "ecological catastrophe"],
        modelSentence: "Maintaining ecological balance is vital to ensuring sustainable agriculture for growing global populations.",
        vietnameseSentence: "Duy trì sự cân bằng sinh thái là điều tối quan trọng để đảm bảo nền nông nghiệp bền vững cho dân số ngày càng tăng."
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
        ipa: "/ˈfɒs.tər/",
        partOfSpeech: "verb",
        meaning: "Nuôi dưỡng, thúc đẩy, tạo điều kiện phát triển",
        basicEquivalent: "encourage / help develop (Band 5-6)",
        synonyms: ["cultivate", "nurture", "promote", "stimulate"],
        collocations: ["foster critical thinking", "foster collaboration", "foster intellectual curiosity"],
        modelSentence: "Classroom debates foster critical thinking and help students articulate complex arguments persuasively.",
        vietnameseSentence: "Các buổi tranh biện trong lớp học nuôi dưỡng tư duy phản biện và giúp học sinh trình bày các lập luận phức tạp một cách thuyết phục."
      },
      {
        id: "edu-2",
        word: "obsolete",
        ipa: "/ˈɒb.sə.liːt/",
        partOfSpeech: "adjective",
        meaning: "Lỗi thời, không còn được sử dụng do có thứ tiên tiến hơn thay thế",
        basicEquivalent: "old-fashioned / out of date (Band 5-6)",
        synonyms: ["outdated", "archaic", "superseded", "redundant"],
        collocations: ["render something obsolete", "become obsolete", "obsolete pedagogical methods"],
        modelSentence: "While artificial intelligence offers personalized study plans, it will never render human mentors obsolete.",
        vietnameseSentence: "Mặc dù trí tuệ nhân tạo cung cấp lộ trình học cá nhân hóa, nó sẽ không bao giờ khiến các người thầy trở nên lỗi thời."
      },
      {
        id: "edu-3",
        word: "holistic",
        ipa: "/həʊˈlɪs.tɪk/",
        partOfSpeech: "adjective",
        meaning: "Toàn diện, xem xét tổng thể thay vì chỉ nhìn vào từng bộ phận",
        basicEquivalent: "comprehensive / complete (Band 5-6)",
        synonyms: ["comprehensive", "all-encompassing", "integrative", "rounded"],
        collocations: ["holistic approach to education", "holistic development", "holistic evaluation"],
        modelSentence: "Schools should adopt a holistic approach that prioritizes emotional well-being alongside academic excellence.",
        vietnameseSentence: "Nhà trường nên áp dụng phương pháp giáo dục toàn diện ưu tiên sức khỏe cảm xúc song song với thành tích học tập."
      },
      {
        id: "edu-4",
        word: "pedagogical",
        ipa: "/ˌped.əˈɡɒdʒ.ɪ.kəl/",
        partOfSpeech: "adjective",
        meaning: "Thuộc về phương pháp sư phạm, cách thức giảng dạy",
        basicEquivalent: "teaching / educational (Band 5)",
        synonyms: ["instructional", "educational", "didactic", "academic"],
        collocations: ["pedagogical methodologies", "pedagogical skills", "innovative pedagogical practices"],
        modelSentence: "Teachers must adapt their pedagogical methodologies to engage digital-native students effectively.",
        vietnameseSentence: "Giáo viên cần thích ứng phương pháp sư phạm của mình để thu hút thế hệ học sinh bản địa số một cách hiệu quả."
      },
      {
        id: "edu-5",
        word: "curriculum",
        ipa: "/kəˈrɪk.jə.ləm/",
        partOfSpeech: "noun",
        meaning: "Khung chương trình học tập, giáo trình đào tạo chính quy",
        basicEquivalent: "subjects taught / syllabus (Band 5)",
        synonyms: ["syllabus", "course of study", "academic program"],
        collocations: ["integrate into the curriculum", "extracurricular activities", "national curriculum reform"],
        modelSentence: "Integrating financial literacy into the high school curriculum prepares young adults for independent life.",
        vietnameseSentence: "Tích hợp kỹ năng tài chính vào chương trình giảng dạy trung học phổ thông sẽ chuẩn bị tốt cho người trẻ cuộc sống tự lập."
      },
      {
        id: "edu-6",
        word: "autonomy",
        ipa: "/ɔːˈtɒn.ə.mi/",
        partOfSpeech: "noun",
        meaning: "Tính tự chủ, độc lập và khả năng tự quyết trong học tập",
        basicEquivalent: "independence (Band 5)",
        synonyms: ["independence", "self-direction", "self-reliance"],
        collocations: ["learner autonomy", "grant autonomy to students", "foster academic autonomy"],
        modelSentence: "E-learning platforms encourage learner autonomy by enabling students to regulate their own study schedules.",
        vietnameseSentence: "Các nền tảng học trực tuyến khuyến khích tính tự chủ của người học bằng cách cho phép sinh viên tự quản lý lịch học của mình."
      },
      {
        id: "edu-7",
        word: "literacy",
        ipa: "/ˈlɪt.ər.ə.si/",
        partOfSpeech: "noun",
        meaning: "Năng lực đọc viết hoặc khả năng hiểu biết thành thạo trong một lĩnh vực",
        basicEquivalent: "ability to read and write (Band 5)",
        synonyms: ["competence", "proficiency", "fluency"],
        collocations: ["digital literacy", "financial literacy", "scientific literacy"],
        modelSentence: "Digital literacy is no longer an optional luxury but a fundamental prerequisite for academic success.",
        vietnameseSentence: "Hiểu biết kỹ thuật số không còn là điều xa xỉ tùy chọn mà là điều kiện tiên quyết cho thành công học thuật."
      },
      {
        id: "edu-8",
        word: "inquisitive",
        ipa: "/ɪnˈkwɪz.ə.tɪv/",
        partOfSpeech: "adjective",
        meaning: "Ham học hỏi, có óc tò mò và khao khát khám phá tri thức",
        basicEquivalent: "curious / eager to learn (Band 5)",
        synonyms: ["curious", "investigative", "searching", "inquiry-driven"],
        collocations: ["inquisitive minds", "inquisitive nature", "stimulate an inquisitive attitude"],
        modelSentence: "An effective educator creates an environment that nurtures inquisitive minds rather than demanding rote memorization.",
        vietnameseSentence: "Một nhà giáo giỏi sẽ kiến tạo môi trường nuôi dưỡng những bộ óc ham học hỏi thay vì bắt học vẹt."
      },
      {
        id: "edu-9",
        word: "disparity",
        ipa: "/dɪˈspær.ə.ti/",
        partOfSpeech: "noun",
        meaning: "Sự chênh lệch, khoảng cách bất bình đẳng về cơ hội giáo dục",
        basicEquivalent: "inequality / gap (Band 5)",
        synonyms: ["inequality", "divergence", "gap", "imbalance"],
        collocations: ["educational disparity", "disparity between rural and urban schools", "narrow the disparity"],
        modelSentence: "Subsidizing laptops for underprivileged children is essential to eliminate the digital disparity in schools.",
        vietnameseSentence: "Trợ cấp máy tính cho trẻ em có hoàn cảnh khó khăn là cần thiết để xóa bỏ khoảng cách số trong các trường học."
      },
      {
        id: "edu-10",
        word: "intellectual",
        ipa: "/ˌɪn.təlˈek.tʃu.əl/",
        partOfSpeech: "adjective / noun",
        meaning: "Thuộc về trí tuệ, khả năng tư duy logic và lý luận trừu tượng",
        basicEquivalent: "mental / smart (Band 5)",
        synonyms: ["cognitive", "cerebral", "academic", "scholarly"],
        collocations: ["intellectual stimulation", "intellectual rigor", "intellectual curiosity"],
        modelSentence: "Higher education should provide intellectual stimulation that challenges prevailing assumptions.",
        vietnameseSentence: "Giáo dục bậc cao cần mang lại sự khơi gợi trí tuệ nhằm thách thức những định kiến sẵn có."
      }
    ]
  },
  {
    id: "technology",
    name: "Technology & Artificial Intelligence",
    vietnameseName: "Công nghệ & Trí tuệ nhân tạo",
    tag: "Chủ đề xu hướng",
    icon: "Cpu",
    ieltsPrompt: "Artificial intelligence and automation will transform the future of work. Do the advantages of this trend outweigh the disadvantages?",
    vocabularies: [
      {
        id: "tech-1",
        word: "breakthrough",
        ipa: "/ˈbreɪk.θruː/",
        partOfSpeech: "noun",
        meaning: "Bước đột phá quan trọng mang tính lịch sử",
        basicEquivalent: "big discovery / important advance (Band 5)",
        synonyms: ["milestone", "quantum leap", "revolutionary advance"],
        collocations: ["technological breakthrough", "scientific breakthrough", "major breakthrough in AI"],
        modelSentence: "Recent breakthroughs in generative algorithms have accelerated automation across cognitive industries.",
        vietnameseSentence: "Những bước đột phá gần đây trong thuật toán tạo sinh đã đẩy nhanh tiến trình tự động hóa các ngành tri thức."
      },
      {
        id: "tech-2",
        word: "streamline",
        ipa: "/ˈstriːm.laɪn/",
        partOfSpeech: "verb",
        meaning: "Tối ưu hóa quy trình làm việc, loại bỏ các bước thừa thãi",
        basicEquivalent: "make simpler / improve efficiency (Band 5-6)",
        synonyms: ["optimize", "rationalize", "simplify"],
        collocations: ["streamline operations", "streamline workflow", "streamline administrative procedures"],
        modelSentence: "Automating data processing allows corporate enterprises to streamline logistics and minimize human error.",
        vietnameseSentence: "Tự động hóa xử lý dữ liệu cho phép các tập đoàn tối ưu hóa quy trình vận hành và hạn chế tối đa sai sót của con người."
      },
      {
        id: "tech-3",
        word: "unprecedented",
        ipa: "/ʌnˈpres.ɪ.den.tɪd/",
        partOfSpeech: "adjective",
        meaning: "Chưa từng có tiền lệ trong lịch sử",
        basicEquivalent: "never happened before (Band 5)",
        synonyms: ["unparalleled", "unrivaled", "historic"],
        collocations: ["at an unprecedented pace", "unprecedented scale", "unprecedented access to information"],
        modelSentence: "The adoption of cloud infrastructure has democratized computing capacity at an unprecedented pace.",
        vietnameseSentence: "Việc ứng dụng hạ tầng đám mây đã phổ cập hóa năng lực tính toán với tốc độ chưa từng có trong lịch sử."
      },
      {
        id: "tech-4",
        word: "ethical",
        ipa: "/ˈeθ.ɪ.kəl/",
        partOfSpeech: "adjective",
        meaning: "Thuộc về đạo đức, luân lý và các chuẩn mực đạo lý xã hội",
        basicEquivalent: "moral / right (Band 5-6)",
        synonyms: ["moral", "principled", "scrupulous"],
        collocations: ["ethical dilemmas", "ethical implications", "ethical guidelines"],
        modelSentence: "Deploying autonomous weaponry raises grave ethical dilemmas regarding accountability during warfare.",
        vietnameseSentence: "Việc triển khai vũ khí tự hành đặt ra những tình thế tiến thoái lưỡng nan nghiêm trọng về mặt đạo đức đối với trách nhiệm pháp lý."
      },
      {
        id: "tech-5",
        word: "algorithm",
        ipa: "/ˈæl.ɡə.rɪ.ðəm/",
        partOfSpeech: "noun",
        meaning: "Thuật toán xử lý tính toán và ra quyết định tự động",
        basicEquivalent: "computer rules (Band 5)",
        synonyms: ["computational procedure", "logic routine"],
        collocations: ["predictive algorithms", "algorithmic bias", "recommendation algorithm"],
        modelSentence: "Regulators must prevent algorithmic bias from discriminating against job candidates based on demographic attributes.",
        vietnameseSentence: "Các cơ quan quản lý cần ngăn chặn sự thiên lệch của thuật toán gây phân biệt đối xử với ứng viên tìm việc."
      },
      {
        id: "tech-6",
        word: "ubiquitous",
        ipa: "/juːˈbɪk.wɪ.təs/",
        partOfSpeech: "adjective",
        meaning: "Phổ biến ở khắp mọi nơi, hiện diện mọi lúc",
        basicEquivalent: "everywhere / very common (Band 5)",
        synonyms: ["omnipresent", "pervasive", "universal"],
        collocations: ["ubiquitous smartphones", "ubiquitous connectivity", "become ubiquitous in modern life"],
        modelSentence: "Smart devices have become ubiquitous in modern households, blurring boundaries between work and personal life.",
        vietnameseSentence: "Thiết bị thông minh đã trở nên hiện diện khắp nơi trong các hộ gia đình, làm lu mờ ranh giới giữa công việc và đời sống riêng."
      },
      {
        id: "tech-7",
        word: "automation",
        ipa: "/ˌɔː.təˈmeɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Tự động hóa, việc vận hành máy móc thay thế sức người",
        basicEquivalent: "using machines instead of humans (Band 5)",
        synonyms: ["mechanization", "computerization", "robotization"],
        collocations: ["workplace automation", "industrial automation", "displaced by automation"],
        modelSentence: "While factory automation displaces manual laborers, it concurrently generates new roles in software maintenance.",
        vietnameseSentence: "Dù tự động hóa nhà máy làm mất việc lao động chân tay, nó đồng thời tạo ra các vị trí mới trong bảo trì phần mềm."
      },
      {
        id: "tech-8",
        word: "proliferation",
        ipa: "/prəˌlɪf.ərˈeɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Sự gia tăng, bùng nổ nhanh chóng về số lượng",
        basicEquivalent: "rapid increase (Band 5-6)",
        synonyms: ["rapid expansion", "multiplication", "burgeoning"],
        collocations: ["proliferation of digital gadgets", "nuclear proliferation", "proliferation of disinformation"],
        modelSentence: "The rapid proliferation of deepfake content poses unprecedented threats to journalistic integrity.",
        vietnameseSentence: "Sự bùng nổ nhanh chóng của nội dung deepfake đặt ra những mối đe dọa chưa từng có đối với tính trung thực báo chí."
      },
      {
        id: "tech-9",
        word: "disruptive",
        ipa: "/dɪsˈrʌp.tɪv/",
        partOfSpeech: "adjective",
        meaning: "Đột phá, làm đảo lộn và thay thế hoàn toàn cấu trúc truyền thống",
        basicEquivalent: "causing big change (Band 5)",
        synonyms: ["revolutionary", "groundbreaking", "radical"],
        collocations: ["disruptive innovation", "disruptive technology", "disruptive impact on markets"],
        modelSentence: "Ride-hailing apps served as a disruptive technology that transformed urban transport ecosystems worldwide.",
        vietnameseSentence: "Các ứng dụng gọi xe đóng vai trò như một công nghệ đột phá đã biến đổi toàn bộ hệ sinh thái giao thông đô thị."
      },
      {
        id: "tech-10",
        word: "cybersecurity",
        ipa: "/ˈsaɪ.bə.sɪˌkjʊə.rə.ti/",
        partOfSpeech: "noun",
        meaning: "An ninh mạng và bảo vệ dữ liệu số",
        basicEquivalent: "computer security (Band 5)",
        synonyms: ["information security", "digital defense", "data protection"],
        collocations: ["robust cybersecurity", "cybersecurity vulnerabilities", "breach of cybersecurity"],
        modelSentence: "Investing in robust cybersecurity frameworks is essential to safeguard critical national infrastructure against foreign hacks.",
        vietnameseSentence: "Đầu tư vào các khung an ninh mạng vững chắc là điều thiết yếu để bảo vệ cơ sở hạ tầng quốc gia trọng yếu."
      }
    ]
  },
  {
    id: "society",
    name: "Society & Urbanization",
    vietnameseName: "Xã hội & Đô thị hóa hiện đại",
    tag: "Đời sống xã hội",
    icon: "Users",
    ieltsPrompt: "In many countries, an increasing number of people are migrating from rural areas to major cities. Discuss the main causes and evaluate the consequences of this urban shift.",
    vocabularies: [
      {
        id: "soc-1",
        word: "infrastructure",
        ipa: "/ˈɪn.frəˌstrʌk.tʃər/",
        partOfSpeech: "noun",
        meaning: "Cơ sở hạ tầng kỹ thuật và công trình công cộng",
        basicEquivalent: "roads and buildings (Band 5)",
        synonyms: ["civic facilities", "public utilities", "transport networks"],
        collocations: ["transport infrastructure", "deteriorating infrastructure", "invest heavily in infrastructure"],
        modelSentence: "Mass migration strains metropolitan transport infrastructure, resulting in persistent gridlock and housing shortages.",
        vietnameseSentence: "Làn sóng di cư ồ ạt gây áp lực lên cơ sở hạ tầng giao thông đô thị, dẫn đến ùn tắc kéo dài và thiếu hụt nhà ở."
      },
      {
        id: "soc-2",
        word: "marginalize",
        ipa: "/ˈmɑː.dʒɪ.nəl.aɪz/",
        partOfSpeech: "verb",
        meaning: "Đẩy ra bên lề xã hội, cô lập và giảm tầm quan trọng của một nhóm người",
        basicEquivalent: "ignore / treat as unimportant (Band 5)",
        synonyms: ["alienate", "sidelined", "disenfranchise", "exclude"],
        collocations: ["marginalize vulnerable groups", "marginalized communities", "socially marginalized"],
        modelSentence: "Soaring property values risk marginalizing low-income families and forcing them into impoverished peripheries.",
        vietnameseSentence: "Giá nhà đất leo thang có nguy cơ đẩy các gia đình thu nhập thấp ra bên lề và buộc họ phải dạt về các vùng ven nghèo nàn."
      },
      {
        id: "soc-3",
        word: "demographic",
        ipa: "/ˌdem.əˈɡræf.ɪk/",
        partOfSpeech: "adjective / noun",
        meaning: "Thuộc về nhân khẩu học và cơ cấu phân bố dân số",
        basicEquivalent: "population data (Band 5)",
        synonyms: ["population profile", "census statistics"],
        collocations: ["demographic shift", "aging demographic", "demographic dividend"],
        modelSentence: "Developed nations face unprecedented pension shortfalls caused by an aging demographic structure.",
        vietnameseSentence: "Các quốc gia phát triển đối mặt với sự thâm hụt quỹ hưu trí chưa từng có do cơ cấu dân số già hóa."
      },
      {
        id: "soc-4",
        word: "cohesion",
        ipa: "/kəʊˈhiː.ʒən/",
        partOfSpeech: "noun",
        meaning: "Sự gắn kết, đoàn kết và tương trợ trong cộng đồng",
        basicEquivalent: "unity / togetherness (Band 5)",
        synonyms: ["solidarity", "social harmony", "unity"],
        collocations: ["social cohesion", "community cohesion", "erode social cohesion"],
        modelSentence: "Investing in neighborhood parks and recreational hubs strengthens social cohesion across multicultural neighborhoods.",
        vietnameseSentence: "Đầu tư vào các công viên khu dân cư và trung tâm sinh hoạt cộng đồng củng cố sự gắn kết xã hội."
      },
      {
        id: "soc-5",
        word: "stratification",
        ipa: "/ˌstræt.ɪ.fɪˈkeɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Sự phân tầng xã hội sâu sắc giữa các giai cấp",
        basicEquivalent: "division between rich and poor (Band 5)",
        synonyms: ["social division", "class hierarchy", "polarization"],
        collocations: ["social stratification", "wealth stratification", "deepen economic stratification"],
        modelSentence: "Unequal access to elite private academies reinforces generational social stratification.",
        vietnameseSentence: "Sự tiếp cận bất bình đẳng vào các trường tư thục danh giá củng cố thêm sự phân tầng xã hội qua nhiều thế hệ."
      },
      {
        id: "soc-6",
        word: "urbanization",
        ipa: "/ˌɜː.bən.aɪˈzeɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Quá trình đô thị hóa nông thôn thành thành phố",
        basicEquivalent: "city growth (Band 5)",
        synonyms: ["urban growth", "metropolitan expansion"],
        collocations: ["rapid urbanization", "unplanned urbanization", "consequences of urbanization"],
        modelSentence: "Rapid urbanization puts tremendous pressure on public hospitals, sanitation systems, and power grids.",
        vietnameseSentence: "Đô thị hóa thần tốc gây áp lực to lớn lên các bệnh viện công, hệ thống vệ sinh và lưới điện."
      },
      {
        id: "soc-7",
        word: "congestion",
        ipa: "/kənˈdʒes.tʃən/",
        partOfSpeech: "noun",
        meaning: "Tình trạng tắc nghẽn, đông đúc quá tải",
        basicEquivalent: "traffic jam / overcrowding (Band 5)",
        synonyms: ["bottleneck", "overcrowding", "gridlock"],
        collocations: ["traffic congestion", "congestion charge", "ease urban congestion"],
        modelSentence: "Levying a congestion charge on private automobiles has proved remarkably effective in reducing downtown emissions.",
        vietnameseSentence: "Thu phí chống ùn tắc với ô tô cá nhân đã chứng minh hiệu quả rõ rệt trong việc giảm khí thải trung tâm."
      },
      {
        id: "soc-8",
        word: "alleviate",
        ipa: "/əˈliː.vi.eɪt/",
        partOfSpeech: "verb",
        meaning: "Xoa dịu, giảm nhẹ gánh nặng hoặc khó khăn",
        basicEquivalent: "make easier / reduce pain (Band 5-6)",
        synonyms: ["ease", "relieve", "mitigate", "lessen"],
        collocations: ["alleviate poverty", "alleviate traffic pressure", "alleviate the housing shortage"],
        modelSentence: "Constructing high-density social housing projects can significantly alleviate the urban housing shortage.",
        vietnameseSentence: "Xây dựng các dự án nhà ở xã hội mật độ cao có thể xoa dịu đáng kể tình trạng thiếu hụt nhà ở đô thị."
      },
      {
        id: "soc-9",
        word: "inequality",
        ipa: "/ˌɪn.ɪˈkwɒl.ə.ti/",
        partOfSpeech: "noun",
        meaning: "Sự bất bình đẳng về cơ hội, thu nhập hoặc quyền lợi",
        basicEquivalent: "unfairness (Band 5)",
        synonyms: ["disparity", "imbalance", "asymmetry"],
        collocations: ["income inequality", "gender inequality", "reduce socioeconomic inequality"],
        modelSentence: "Progressive taxation on extreme wealth is regarded by many economists as a key tool to curb income inequality.",
        vietnameseSentence: "Đánh thuế lũy tiến lên khối tài sản khổng lồ được xem là công cụ then chốt để hạn chế bất bình đẳng thu nhập."
      },
      {
        id: "soc-10",
        word: "welfare",
        ipa: "/ˈwel.feər/",
        partOfSpeech: "noun",
        meaning: "Phúc lợi an sinh xã hội bảo đảm đời sống nhân dân",
        basicEquivalent: "social support (Band 5)",
        synonyms: ["social security", "well-being", "public assistance"],
        collocations: ["welfare system", "child welfare", "expand welfare provisions"],
        modelSentence: "A resilient social welfare system provides an indispensable safety net during macroeconomic recessions.",
        vietnameseSentence: "Một hệ thống an sinh xã hội vững chắc cung cấp lưới an toàn không thể thiếu trong các đợt suy thoái kinh tế."
      }
    ]
  },
  {
    id: "globalization",
    name: "Culture & Globalization",
    vietnameseName: "Văn hóa & Toàn cầu hóa",
    tag: "Văn hóa - Xã hội",
    icon: "Globe",
    ieltsPrompt: "Globalization has brought different cultures closer, but some fear it leads to the loss of cultural identity. Discuss both views and give your opinion.",
    vocabularies: [
      {
        id: "glob-1",
        word: "homogenization",
        ipa: "/həˌmɒdʒ.ɪ.naɪˈzeɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Sự đồng nhất hóa văn hóa, làm mất đi tính đa dạng độc đáo",
        basicEquivalent: "making everything the same (Band 5)",
        synonyms: ["standardization", "uniformity"],
        collocations: ["cultural homogenization", "risk of homogenization", "global homogenization"],
        modelSentence: "The global dominance of Western fast-food franchises accelerates the homogenization of culinary traditions worldwide.",
        vietnameseSentence: "Sự thống trị toàn cầu của các chuỗi thức ăn nhanh phương Tây đẩy nhanh sự đồng nhất hóa các truyền thống ẩm thực thế giới."
      },
      {
        id: "glob-2",
        word: "indigenous",
        ipa: "/ɪnˈdɪdʒ.ɪ.nəs/",
        partOfSpeech: "adjective",
        meaning: "Bản địa, thuộc về nguồn gốc nguyên bản của một vùng đất",
        basicEquivalent: "local / native (Band 5-6)",
        synonyms: ["native", "aboriginal", "autochthonous"],
        collocations: ["indigenous languages", "indigenous heritage", "indigenous communities"],
        modelSentence: "Safeguarding indigenous dialects preserves irreplaceable repositories of botanical and ecological wisdom.",
        vietnameseSentence: "Bảo tồn các phương ngữ bản địa giúp gìn giữ kho tàng vô giá về tri thức thực vật và sinh thái."
      },
      {
        id: "glob-3",
        word: "preserve",
        ipa: "/prɪˈzɜːv/",
        partOfSpeech: "verb",
        meaning: "Bảo tồn, gìn giữ cho thế hệ mai sau",
        basicEquivalent: "protect / keep (Band 5-6)",
        synonyms: ["safeguard", "conserve", "perpetuate", "sustain"],
        collocations: ["preserve cultural heritage", "preserve folk arts", "preserve historic monuments"],
        modelSentence: "Government funding is essential to preserve ancient historical monuments from urban encroachment.",
        vietnameseSentence: "Nguồn tài trợ của chính phủ là cần thiết để bảo tồn các di tích lịch sử cổ kính trước sự xâm lấn của đô thị."
      },
      {
        id: "glob-4",
        word: "erosion",
        ipa: "/ɪˈrəʊ.ʒən/",
        partOfSpeech: "noun",
        meaning: "Sự xói mòn, mai một dần theo thời gian",
        basicEquivalent: "loss / weakening (Band 5-6)",
        synonyms: ["deterioration", "degradation", "decline", "dissolution"],
        collocations: ["erosion of traditional values", "erosion of cultural identity", "gradual erosion"],
        modelSentence: "The influx of foreign media content has triggered a noticeable erosion of traditional ancestral customs among youth.",
        vietnameseSentence: "Làn sóng truyền thông nước ngoài tràn vào đã gây ra sự xói mòn rõ rệt các phong tục tổ tiên trong giới trẻ."
      },
      {
        id: "glob-5",
        word: "heritage",
        ipa: "/ˈher.ɪ.tɪdʒ/",
        partOfSpeech: "noun",
        meaning: "Di sản văn hóa vật thể hoặc phi vật thể được kế thừa",
        basicEquivalent: "tradition / history (Band 5)",
        synonyms: ["legacy", "cultural inheritance", "patrimony"],
        collocations: ["cultural heritage", "intangible heritage", "world heritage site"],
        modelSentence: "Folk music traditions represent an intangible cultural heritage that merits rigorous academic documentation.",
        vietnameseSentence: "Các truyền thống âm nhạc dân gian đại diện cho di sản văn hóa phi vật thể xứng đáng được lưu trữ học thuật kỹ lưỡng."
      },
      {
        id: "glob-6",
        word: "cosmopolitan",
        ipa: "/ˌkɒz.məˈpɒl.ɪ.tən/",
        partOfSpeech: "adjective",
        meaning: "Mang tính quốc tế, đa văn hóa và cởi mở với nhiều quốc gia",
        basicEquivalent: "international / global (Band 5)",
        synonyms: ["multicultural", "international", "worldly"],
        collocations: ["cosmopolitan city", "cosmopolitan atmosphere", "cosmopolitan outlook"],
        modelSentence: "Living in a cosmopolitan metropolis fosters intercultural tolerance and expands career horizons for youth.",
        vietnameseSentence: "Sống tại một đô thị đa văn hóa quốc tế nuôi dưỡng lòng bao dung giữa các nền văn hóa và mở rộng triển vọng nghề nghiệp."
      },
      {
        id: "glob-7",
        word: "assimilation",
        ipa: "/əˌsɪm.ɪˈleɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Sự đồng hóa văn hóa, hòa nhập hoàn toàn vào nền văn hóa chủ đạo",
        basicEquivalent: "fitting in / blending in (Band 5)",
        synonyms: ["integration", "acculturation", "incorporation"],
        collocations: ["cultural assimilation", "forced assimilation", "resist assimilation"],
        modelSentence: "Immigrant enclaves often resist total assimilation to maintain their native mother tongue and culinary rites.",
        vietnameseSentence: "Các cộng đồng người nhập cư thường phản kháng lại sự đồng hóa hoàn toàn để duy trì tiếng mẹ đẻ và tập quán ẩm thực."
      },
      {
        id: "glob-8",
        word: "diversity",
        ipa: "/daɪˈvɜː.sə.ti/",
        partOfSpeech: "noun",
        meaning: "Sự phong phú và đa dạng các phong tục tập quán",
        basicEquivalent: "variety (Band 5)",
        synonyms: ["multiplicity", "plurality", "variety"],
        collocations: ["cultural diversity", "linguistic diversity", "celebrate diversity"],
        modelSentence: "Embracing cultural diversity enriches artistic creativity and strengthens civil diplomacy across borders.",
        vietnameseSentence: "Đón nhận sự đa dạng văn hóa làm phong phú thêm sức sáng tạo nghệ thuật và thắt chặt ngoại giao nhân dân."
      },
      {
        id: "glob-9",
        word: "integration",
        ipa: "/ˌɪn.tɪˈɡreɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Sự hội nhập văn hóa và kinh tế toàn cầu",
        basicEquivalent: "joining together (Band 5)",
        synonyms: ["incorporation", "unification", "amalgamation"],
        collocations: ["economic integration", "global integration", "social integration"],
        modelSentence: "Global economic integration facilitates foreign direct investment while exposing domestic artisans to fierce competition.",
        vietnameseSentence: "Hội nhập kinh tế toàn cầu tạo điều kiện thu hút đầu tư nước ngoài đồng thời đẩy thợ thủ công trong nước vào cạnh tranh gay gắt."
      },
      {
        id: "glob-10",
        word: "custom",
        ipa: "/ˈkʌs.təm/",
        partOfSpeech: "noun",
        meaning: "Phong tục, tập quán truyền thống lâu đời",
        basicEquivalent: "tradition / habit (Band 5)",
        synonyms: ["tradition", "convention", "practice", "ritual"],
        collocations: ["ancient customs", "local customs", "observe religious customs"],
        modelSentence: "Observing local customs when traveling overseas demonstrates fundamental respect for host populations.",
        vietnameseSentence: "Tuân thủ các phong tục địa phương khi du lịch nước ngoài thể hiện sự tôn trọng cơ bản đối với người bản xứ."
      }
    ]
  }
];

export const IELTS_TASK2_TOPICS = RAW_IELTS_TOPICS.map(topic => ({
  ...topic,
  vocabularies: topic.vocabularies.map(v => enrichVocabulary(v, topic.name))
}));

export const IELTS_TOPICS = IELTS_TASK2_TOPICS;

const RAW_IELTS_TASK1_TOPICS = [
  {
    id: "task1-bar-chart",
    name: "Bar Chart: Household Spending on Education, Housing & Leisure",
    vietnameseName: "Biểu đồ cột: Chi tiêu hộ gia đình cho giáo dục & giải trí",
    tag: "Task 1: Biểu đồ so sánh cột",
    icon: "BarChart3",
    chartType: "bar",
    chartData: {
      title: "Proportion of Household Budgets Spent on 3 Categories in 5 Countries (2023)",
      unit: "% tổng chi tiêu",
      categories: [
        { key: "housing", label: "Housing (Nhà ở)", color: "#6366f1", bgClass: "bg-indigo-500", textClass: "text-indigo-400" },
        { key: "education", label: "Education (Giáo dục)", color: "#10b981", bgClass: "bg-emerald-500", textClass: "text-emerald-400" },
        { key: "recreation", label: "Recreation (Giải trí)", color: "#f59e0b", bgClass: "bg-amber-500", textClass: "text-amber-400" }
      ],
      series: [
        { country: "Country A", housing: 38, education: 28, recreation: 14 },
        { country: "Country B", housing: 35, education: 22, recreation: 12 },
        { country: "Country C", housing: 32, education: 26, recreation: 10 },
        { country: "Country D", housing: 30, education: 18, recreation: 15 },
        { country: "Country E", housing: 24, education: 32, recreation: 6 }
      ],
      keyNotes: [
        "Housing là khoản chi áp đảo nhất ở 4/5 quốc gia (30% - 38%), cao nhất ở Country A.",
        "Country E (Việt Nam) là ngoại lệ duy nhất khi chi phí Giáo dục (32%) vượt qua Nhà ở (24%).",
        "Recreation luôn là hạng mục có tỉ lệ thấp nhất ở tất cả các nước, thấp kỷ lục ở Country E (6%)."
      ]
    },
    ieltsPrompt: "The bar chart illustrates the proportion of household budgets spent on education, housing, and recreation across five countries in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    vocabularies: [
      {
        id: "t1-bc-1",
        word: "allocate",
        ipa: "/ˈæl.ə.keɪt/",
        partOfSpeech: "verb",
        meaning: "Phân bổ, dành ngân sách hay tài nguyên cho một mục đích",
        basicEquivalent: "spend / give money to (Band 5)",
        synonyms: ["earmark", "apportion", "distribute"],
        collocations: ["allocate funds to", "budget allocated for education"],
        modelSentence: "Households in Country A allocated nearly a third of their total earnings to academic tuition.",
        vietnameseSentence: "Các hộ gia đình ở Country A phân bổ gần một phần ba tổng thu nhập cho học phí giáo dục."
      },
      {
        id: "t1-bc-2",
        word: "disproportionately",
        ipa: "/ˌdɪs.prəˈpɔː.ʃən.ət.li/",
        partOfSpeech: "adverb",
        meaning: "Không tương xứng, chiếm tỉ trọng vượt trội hoặc áp đảo",
        basicEquivalent: "much more / unbalanced (Band 5-6)",
        synonyms: ["excessively", "unevenly", "overwhelmingly"],
        collocations: ["disproportionately high", "spent disproportionately more"],
        modelSentence: "Recreational expenses accounted for a disproportionately small fraction of expenditure in developing nations.",
        vietnameseSentence: "Chi tiêu cho giải trí chiếm một phần nhỏ không tương xứng trong tổng chi tiêu tại các quốc gia đang phát triển."
      },
      {
        id: "t1-bc-3",
        word: "disparity",
        ipa: "/dɪˈspær.ə.ti/",
        partOfSpeech: "noun",
        meaning: "Sự chênh lệch, khoảng cách khác biệt giữa các số liệu",
        basicEquivalent: "difference / gap (Band 5-6)",
        synonyms: ["divergence", "gap", "inequality"],
        collocations: ["substantial disparity", "marginal disparity between nations"],
        modelSentence: "A substantial disparity is observable between capital city dwellers and rural families regarding education outlay.",
        vietnameseSentence: "Một khoảng cách chênh lệch đáng kể có thể quan sát được giữa cư dân thủ đô và các gia đình nông thôn về chi phí giáo dục."
      },
      {
        id: "t1-bc-4",
        word: "constitute",
        ipa: "/ˈkɒn.stɪ.tʃuːt/",
        partOfSpeech: "verb",
        meaning: "Cấu thành, chiếm tỉ lệ bao nhiêu % trong biểu đồ",
        basicEquivalent: "make up / account for (Band 5)",
        synonyms: ["account for", "make up", "represent", "comprise"],
        collocations: ["constitute the largest proportion", "constitute approximately 38%"],
        modelSentence: "Housing costs constituted the single largest expenditure category in Country A at 38%.",
        vietnameseSentence: "Chi phí nhà ở cấu thành danh mục chi tiêu đơn lẻ lớn nhất ở Country A với 38%."
      },
      {
        id: "t1-bc-5",
        word: "dominate",
        ipa: "/ˈdɒm.ɪ.neɪt/",
        partOfSpeech: "verb",
        meaning: "Chiếm ưu thế áp đảo, dẫn đầu về tỉ trọng",
        basicEquivalent: "be the highest (Band 5)",
        synonyms: ["prevail", "lead", "command"],
        collocations: ["dominate household spending", "remain the dominant feature"],
        modelSentence: "Housing clearly dominated the budgetary distribution across four out of the five evaluated nations.",
        vietnameseSentence: "Nhà ở rõ ràng chiếm ưu thế áp đảo trong phân bổ ngân sách ở 4 trên 5 quốc gia được đánh giá."
      },
      {
        id: "t1-bc-6",
        word: "expenditure",
        ipa: "/ɪkˈspen.dɪ.tʃər/",
        partOfSpeech: "noun",
        meaning: "Tổng mức chi tiêu ngân sách",
        basicEquivalent: "spending / money spent (Band 5)",
        synonyms: ["outlay", "spending", "disbursement"],
        collocations: ["household expenditure", "recreational expenditure", "total expenditure"],
        modelSentence: "Recreational expenditure remained beneath fifteen percent in all surveyed countries.",
        vietnameseSentence: "Chi tiêu cho giải trí luôn duy trì dưới 15% ở tất cả các quốc gia được khảo sát."
      },
      {
        id: "t1-bc-7",
        word: "negligible",
        ipa: "/ˈneɡ.lɪ.dʒə.bəl/",
        partOfSpeech: "adjective",
        meaning: "Không đáng kể, chiếm tỉ lệ rất nhỏ",
        basicEquivalent: "very small / tiny (Band 5)",
        synonyms: ["insignificant", "marginal", "minimal"],
        collocations: ["negligible proportion", "negligible amount"],
        modelSentence: "In Country E, recreation represented a negligible proportion of only six percent.",
        vietnameseSentence: "Tại Country E, giải trí đại diện cho một tỉ lệ không đáng kể chỉ vỏn vẹn 6%."
      },
      {
        id: "t1-bc-8",
        word: "surpass",
        ipa: "/səˈpɑːs/",
        partOfSpeech: "verb",
        meaning: "Vượt qua mức số liệu của đối tượng khác",
        basicEquivalent: "be higher than / beat (Band 5)",
        synonyms: ["outstrip", "exceed", "eclipse"],
        collocations: ["surpass spending on housing", "surpass all other nations"],
        modelSentence: "In Country E, educational investment uniquely surpassed housing outlay by eight percentage points.",
        vietnameseSentence: "Ở Country E, đầu tư cho giáo dục là trường hợp duy nhất vượt qua chi phí nhà ở 8 điểm phần trăm."
      },
      {
        id: "t1-bc-9",
        word: "proportion",
        ipa: "/prəˈpɔː.ʃən/",
        partOfSpeech: "noun",
        meaning: "Tỉ lệ phần trăm so với tổng thể",
        basicEquivalent: "percentage / share (Band 5)",
        synonyms: ["percentage", "fraction", "share"],
        collocations: ["the highest proportion", "equal proportion", "fraction of budget"],
        modelSentence: "Country E registered the highest proportion of education outlay across all examined territories.",
        vietnameseSentence: "Country E ghi nhận tỉ lệ chi tiêu cho giáo dục cao nhất trong tất cả các lãnh thổ được xem xét."
      },
      {
        id: "t1-bc-10",
        word: "account for",
        ipa: "/əˈkaʊnt fɔːr/",
        partOfSpeech: "phrasal verb",
        meaning: "Chiếm bao nhiêu phần trăm trong biểu đồ",
        basicEquivalent: "take up / make up (Band 5)",
        synonyms: ["constitute", "represent", "comprise"],
        collocations: ["account for almost 40%", "account for the smallest share"],
        modelSentence: "Together, housing and education accounted for over two-thirds of household budgets in Country B.",
        vietnameseSentence: "Cùng nhau, nhà ở và giáo dục chiếm hơn hai phần ba ngân sách hộ gia đình tại Country B."
      }
    ]
  },
  {
    id: "task1-line-graph",
    name: "Line Graph: Renewable vs Fossil Energy (2000-2030)",
    vietnameseName: "Biểu đồ đường: Năng lượng tái tạo vs Nhiên liệu hóa thạch",
    tag: "Task 1: Xu hướng thời gian",
    icon: "TrendingUp",
    chartType: "line",
    chartData: {
      title: "Energy Consumption Trends: Fossil Fuels vs Renewable Energy (2000 - 2030)",
      unit: "% tổng năng lượng",
      years: ["2000", "2010", "2020", "2030 (proj.)"],
      series: [
        { name: "Fossil Fuels (Hóa thạch)", data: [78, 68, 52, 38], color: "#f43f5e" },
        { name: "Renewable Energy (Tái tạo)", data: [12, 22, 39, 58], color: "#10b981" }
      ],
      keyNotes: [
        "Fossil fuels giảm mạnh liên tục từ 78% năm 2000 xuống còn 38% năm 2030.",
        "Renewable energy tăng trưởng bứt phá từ 12% lên 58%, dự kiến vượt fossil fuels vào khoảng 2026-2028."
      ]
    },
    ieltsPrompt: "The line graph below shows the changes in energy consumption between fossil fuels and renewable energy sources from 2000 to 2030 (including projections). Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    vocabularies: [
      {
        id: "t1-lg-1",
        word: "outstrip",
        ipa: "/ˌaʊtˈstrɪp/",
        partOfSpeech: "verb",
        meaning: "Vượt xa, vượt trội hơn về số lượng hoặc tốc độ tăng",
        basicEquivalent: "exceed / surpass (Band 5-6)",
        synonyms: ["surpass", "eclipse", "overtake"],
        collocations: ["outstrip demand", "dramatically outstrip", "projected to outstrip"],
        modelSentence: "By 2028, renewable electricity generation is projected to outstrip coal consumption globally.",
        vietnameseSentence: "Đến năm 2028, sản lượng điện tái tạo được dự báo sẽ vượt xa lượng tiêu thụ than trên toàn cầu."
      },
      {
        id: "t1-lg-2",
        word: "plateau",
        ipa: "/ˈplæt.əʊ/",
        partOfSpeech: "verb / noun",
        meaning: "Đạt trạng thái bình ổn, đi ngang sau giai đoạn tăng nhanh",
        basicEquivalent: "stay unchanged / level off (Band 5-6)",
        synonyms: ["level off", "stabilize", "flatten out"],
        collocations: ["reach a plateau", "plateau at approximately 40%"],
        modelSentence: "After experiencing rapid gains during the initial decade, petroleum reliance plateaued at around 45%.",
        vietnameseSentence: "Sau khi tăng nhanh trong thập kỷ đầu, sự phụ thuộc vào dầu mỏ đã đi ngang ở mức khoảng 45%."
      },
      {
        id: "t1-lg-3",
        word: "fluctuate",
        ipa: "/ˈflʌk.tʃu.eɪt/",
        partOfSpeech: "verb",
        meaning: "Dao động lên xuống thất thường qua các mốc thời gian",
        basicEquivalent: "go up and down (Band 5)",
        synonyms: ["oscillate", "vary erratically", "shift"],
        collocations: ["fluctuate between 20% and 30%", "experience wild fluctuations"],
        modelSentence: "Natural gas production fluctuated mildly before commencing a steep downward trend.",
        vietnameseSentence: "Sản lượng khí tự nhiên dao động nhẹ trước khi bắt đầu xu hướng giảm dốc mạnh."
      },
      {
        id: "t1-lg-4",
        word: "trajectory",
        ipa: "/trəˈdʒek.tər.i/",
        partOfSpeech: "noun",
        meaning: "Quỹ đạo, chiều hướng phát triển liên tục",
        basicEquivalent: "trend / direction (Band 6)",
        synonyms: ["upward trend", "course", "pathway"],
        collocations: ["upward trajectory", "downward trajectory", "follow an identical trajectory"],
        modelSentence: "Solar and wind power maintained an uninterrupted upward trajectory throughout the surveyed period.",
        vietnameseSentence: "Năng lượng mặt trời và gió duy trì quỹ đạo đi lên không bị gián đoạn trong suốt giai đoạn khảo sát."
      },
      {
        id: "t1-lg-5",
        word: "exponential",
        ipa: "/ˌek.spəˈnen.ʃəl/",
        partOfSpeech: "adjective",
        meaning: "Tăng trưởng theo cấp số nhân, cực kỳ nhanh chóng",
        basicEquivalent: "very fast growth (Band 5)",
        synonyms: ["geometric", "rapid", "explosive"],
        collocations: ["exponential growth", "exponential increase"],
        modelSentence: "Renewable energy adoption experienced exponential growth between 2010 and 2030.",
        vietnameseSentence: "Việc ứng dụng năng lượng tái tạo đã trải qua mức tăng trưởng theo cấp số nhân giữa năm 2010 và 2030."
      },
      {
        id: "t1-lg-6",
        word: "plummet",
        ipa: "/ˈplʌm.ɪt/",
        partOfSpeech: "verb",
        meaning: "Lao dốc mạnh, sụt giảm nhanh và sâu",
        basicEquivalent: "drop very quickly (Band 5)",
        synonyms: ["plunge", "tumble", "slump"],
        collocations: ["plummet to 38%", "plummet dramatically"],
        modelSentence: "Fossil fuel dependency plummeted from 78% down to roughly 38% by the end of the projection.",
        vietnameseSentence: "Sự phụ thuộc vào nhiên liệu hóa thạch đã lao dốc từ 78% xuống còn khoảng 38% vào cuối kỳ dự báo."
      },
      {
        id: "t1-lg-7",
        word: "soar",
        ipa: "/sɔːr/",
        partOfSpeech: "verb",
        meaning: "Tăng vọt lên mức cao kỷ lục",
        basicEquivalent: "rise very high (Band 5)",
        synonyms: ["skyrocket", "surge", "climb sharply"],
        collocations: ["soar to nearly 60%", "soar rapidly"],
        modelSentence: "Clean power generation soared almost fivefold to peak at 58% in 2030.",
        vietnameseSentence: "Sản lượng điện sạch tăng vọt gần gấp 5 lần để đạt đỉnh 58% vào năm 2030."
      },
      {
        id: "t1-lg-8",
        word: "stabilize",
        ipa: "/ˈsteɪ.bəl.aɪz/",
        partOfSpeech: "verb",
        meaning: "Ổn định, giữ nguyên không biến động",
        basicEquivalent: "stay the same (Band 5)",
        synonyms: ["level off", "settle", "remain constant"],
        collocations: ["stabilize after a decline", "stabilize around 40%"],
        modelSentence: "After steep declines, coal imports stabilized around twenty percent in the final five years.",
        vietnameseSentence: "Sau những đợt sụt giảm mạnh, lượng than nhập khẩu đã ổn định ở mức khoảng 20% trong 5 năm cuối."
      },
      {
        id: "t1-lg-9",
        word: "moderate",
        ipa: "/ˈmɒd.ər.ət/",
        partOfSpeech: "adjective",
        meaning: "Mức độ vừa phải, tăng giảm nhẹ",
        basicEquivalent: "medium / small (Band 5)",
        synonyms: ["modest", "temperate", "reasonable"],
        collocations: ["moderate growth", "moderate decline"],
        modelSentence: "The first decade saw only moderate progress in green energy adoption.",
        vietnameseSentence: "Thập kỷ đầu tiên chỉ chứng kiến sự tiến bộ vừa phải trong việc ứng dụng năng lượng xanh."
      },
      {
        id: "t1-lg-10",
        word: "projection",
        ipa: "/prəˈdʒek.ʃən/",
        partOfSpeech: "noun",
        meaning: "Số liệu dự báo, ước tính cho tương lai",
        basicEquivalent: "forecast / future prediction (Band 5)",
        synonyms: ["forecast", "prediction", "estimate"],
        collocations: ["future projections", "according to projections"],
        modelSentence: "According to official projections, clean energy will dominate global grids by 2030.",
        vietnameseSentence: "Theo các dự báo chính thức, năng lượng sạch sẽ chiếm lĩnh các lưới điện toàn cầu vào năm 2030."
      }
    ]
  },
  {
    id: "task1-process",
    name: "Process Diagram: Industrial Paper Recycling Flow",
    vietnameseName: "Quy trình: Các giai đoạn tái chế giấy công nghiệp",
    tag: "Task 1: Sơ đồ quy trình",
    icon: "Layers",
    chartType: "process",
    ieltsPrompt: "The diagram illustrates how waste paper is collected, treated, and recycled into commercial packaging. Summarise the information by selecting and reporting the main features.",
    vocabularies: [
      {
        id: "t1-pr-1",
        word: "commence",
        ipa: "/kəˈmens/",
        partOfSpeech: "verb",
        meaning: "Bắt đầu, khởi sự một quy trình công nghiệp",
        basicEquivalent: "start / begin (Band 5)",
        synonyms: ["initiate", "set in motion", "kick off"],
        collocations: ["the procedure commences with", "commence sorting"],
        modelSentence: "The recycling loop commences with the systematic collection of used cardboard from urban recovery centers.",
        vietnameseSentence: "Vòng tuần hoàn tái chế bắt đầu bằng việc thu gom có hệ thống bìa carton đã qua sử dụng từ các trung tâm thu hồi đô thị."
      },
      {
        id: "t1-pr-2",
        word: "undergo",
        ipa: "/ˌʌn.dəˈɡəʊ/",
        partOfSpeech: "verb",
        meaning: "Trải qua một công đoạn xử lý vật lý hoặc hóa học",
        basicEquivalent: "experience / go through (Band 5-6)",
        synonyms: ["subject to", "experience", "pass through"],
        collocations: ["undergo chemical treatment", "undergo thorough filtration"],
        modelSentence: "The soaked paper pulp undergoes extensive de-inking and mechanical cleaning before being rolled.",
        vietnameseSentence: "Bột giấy ngâm ủ trải qua quá trình tách mực kỹ lưỡng và làm sạch cơ học trước khi được cán cuộn."
      },
      {
        id: "t1-pr-3",
        word: "subsequently",
        ipa: "/ˈsʌb.sɪ.kwənt.li/",
        partOfSpeech: "adverb",
        meaning: "Sau đó, ở giai đoạn tiếp theo của tiến trình",
        basicEquivalent: "then / after that (Band 5)",
        synonyms: ["consequently", "thereafter", "next"],
        collocations: ["subsequently transferred to", "subsequently pressed"],
        modelSentence: "The bleached fiber slurry is subsequently squeezed through heavy heated rollers to evaporate residual moisture.",
        vietnameseSentence: "Huyền phù sợi đã tẩy trắng sau đó được ép qua các trục lăn nhiệt nặng để làm bay hơi lượng ẩm còn lại."
      },
      {
        id: "t1-pr-4",
        word: "convert",
        ipa: "/kənˈvɜːt/",
        partOfSpeech: "verb",
        meaning: "Biến đổi hoặc chuyển hóa thành dạng vật chất mới",
        basicEquivalent: "change into (Band 5)",
        synonyms: ["transform", "turn into", "remodel"],
        collocations: ["convert waste into usable packaging", "convert raw fibers"],
        modelSentence: "Recycling plants convert recycled pulp into durable packaging material.",
        vietnameseSentence: "Các nhà máy tái chế biến đổi bột giấy tái sinh thành vật liệu đóng gói bền bỉ."
      },
      {
        id: "t1-pr-5",
        word: "extract",
        ipa: "/ɪkˈstrækt/",
        partOfSpeech: "verb",
        meaning: "Tách lấy, chiết xuất tạp chất hoặc phần tử hữu ích",
        basicEquivalent: "take out / remove (Band 5)",
        synonyms: ["separate", "remove", "isolate"],
        collocations: ["extract impurities", "extract glue and staples"],
        modelSentence: "Centrifugal filters extract adhesive particles and metallic staples from the slurry.",
        vietnameseSentence: "Các bộ lọc ly tâm tách bỏ các hạt keo dính và ghim kim loại ra khỏi huyền phù."
      },
      {
        id: "t1-pr-6",
        word: "culminate",
        ipa: "/ˈkʌl.mɪ.neɪt/",
        partOfSpeech: "verb",
        meaning: "Kết thúc ở bước hoàn tất thành phẩm sau cùng",
        basicEquivalent: "end with / finish at (Band 5-6)",
        synonyms: ["conclude with", "terminate in", "wind up"],
        collocations: ["culminate in the production of", "the process culminates with"],
        modelSentence: "The manufacturing loop culminates in the production of corrugated boxes ready for retail shipping.",
        vietnameseSentence: "Vòng sản xuất kết thúc ở việc sản xuất các hộp bìa carton gợn sóng sẵn sàng giao tới đại lý bán lẻ."
      },
      {
        id: "t1-pr-7",
        word: "facilitate",
        ipa: "/fəˈsɪl.ɪ.teɪt/",
        partOfSpeech: "verb",
        meaning: "Tạo điều kiện thuận lợi cho phản ứng hoặc bước xử lý diễn ra",
        basicEquivalent: "make easier / help (Band 5)",
        synonyms: ["enable", "assist", "expedite"],
        collocations: ["facilitate fiber breakdown", "facilitate de-inking"],
        modelSentence: "Heated chemical baths facilitate the breakdown of stubborn synthetic adhesives.",
        vietnameseSentence: "Bể hóa chất gia nhiệt tạo điều kiện thuận lợi cho sự phân rã của các chất keo tổng hợp cứng đầu."
      },
      {
        id: "t1-pr-8",
        word: "mechanical",
        ipa: "/məˈkæn.ɪ.kəl/",
        partOfSpeech: "adjective",
        meaning: "Xử lý bằng lực cơ học hoặc máy móc",
        basicEquivalent: "by machine (Band 5)",
        synonyms: ["physical", "automated", "machinery-driven"],
        collocations: ["mechanical agitation", "mechanical pressing"],
        modelSentence: "Mechanical pressing drives out trapped water droplets before thermal drying.",
        vietnameseSentence: "Lực ép cơ học đẩy hết các giọt nước mắc kẹt ra ngoài trước khi sấy nhiệt."
      },
      {
        id: "t1-pr-9",
        word: "consecutive",
        ipa: "/kənˈsek.jə.tɪv/",
        partOfSpeech: "adjective",
        meaning: "Diễn ra liên tiếp theo một trình tự xác định",
        basicEquivalent: "one after another (Band 5)",
        synonyms: ["successive", "sequential", "continuous"],
        collocations: ["five consecutive stages", "consecutive processing steps"],
        modelSentence: "The recycling procedure involves five consecutive stages from raw bale collection to finished cartons.",
        vietnameseSentence: "Quy trình tái chế bao gồm 5 giai đoạn liên tiếp từ thu gom kiện rác thô đến thùng carton thành phẩm."
      },
      {
        id: "t1-pr-10",
        word: "purify",
        ipa: "/ˈpjʊə.rɪ.faɪ/",
        partOfSpeech: "verb",
        meaning: "Làm sạch hoàn toàn, tinh lọc tạp chất",
        basicEquivalent: "clean thoroughly (Band 5)",
        synonyms: ["decontaminate", "filter", "refine"],
        collocations: ["purify the paper pulp", "purify wash water"],
        modelSentence: "Screening mechanisms purify the recycled slurry to guarantee industrial hygienic safety standards.",
        vietnameseSentence: "Hệ thống sàng lọc tinh chế huyền phù tái chế để đảm bảo các tiêu chuẩn an toàn vệ sinh công nghiệp."
      }
    ]
  }
];

export const IELTS_TASK1_TOPICS = RAW_IELTS_TASK1_TOPICS.map(topic => ({
  ...topic,
  vocabularies: topic.vocabularies.map(v => enrichVocabulary(v, topic.name))
}));
