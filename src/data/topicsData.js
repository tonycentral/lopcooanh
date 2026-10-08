import { enrichVocabulary } from './vocabEnhancer.js';
import promptsData from './databank/prompts.json';
import vocabulariesData from './databank/vocabularies.json';
import { getMasterCategoryId, getMasterCategoryMeta, MASTER_TOPIC_CATEGORIES } from './topicCategories.js';

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
            "Từ vựng: 'mitigate' /ˈmɪt.ɪ.ɡeɪt/ (verb: làm dịu bớt, giảm nhẹ) thay thế cho 'reduce/lessen', kết hợp danh từ 'ramifications' /ˌræm.ɪ.fɪˈkeɪ.ʃənz/ (hệ lụy phức tạp).",
            "Collocation: 'stringent environmental legislation' (luật môi trường nghiêm ngặt) với 'stringent' /ˈstrɪn.dʒənt/ (nghiêm ngặt) thay vì 'strict laws'.",
            "Ngữ pháp: Cấu trúc giả định thức 'It is imperative that + S + V-bare' hoặc danh từ hóa 'Enacting rigorous statutory frameworks' (Ban hành khuôn khổ luật định khắt khe)."
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
            "Cách chuyển câu (Cohesion): Liên từ C1 'Consequently,' /ˈkɒn.sɪ.kwənt.li/ (Do đó, như một hệ quả tất yếu) để móc xích nguyên nhân ở Câu 1 với giải pháp ở Câu 2.",
            "Từ vựng học thuật: 'rampant industrial proliferation' /ˌræm.pənt ɪnˌdʌs.tri.əl prəˌlɪf.ərˈeɪ.ʃən/ (sự bùng nổ công nghiệp không kiểm soát), 'discharged' /dɪsˈtʃɑːdʒd/ (xả thải), 'ecological deterioration' /ˌiː.kəˈlɒdʒ.ɪ.kəl dɪˌtɪə.ri.əˈreɪ.ʃən/ (suy thoái sinh thái).",
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
  },
  {
    id: "health-2026",
    name: "Health, Self-Care & Mental Wellbeing (2026 Trend)",
    vietnameseName: "Sức khỏe tinh thần & Tự điều trị (2026)",
    tag: "Đề mới 2026",
    icon: "HeartPulse",
    ieltsPrompt: "These days, many people attempt to treat minor illnesses at home by themselves rather than consulting medical practitioners. Others argue that self-medication is hazardous. Discuss both views and give your opinion.",
    vocabularies: [
      {
        id: "hlth-1",
        word: "self-medication",
        ipa: "/ˌself.med.ɪˈkeɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Hành vi tự mua thuốc và tự điều trị mà không có chỉ định y khoa",
        basicEquivalent: "taking medicine by yourself (Band 5)",
        synonyms: ["unprescribed treatment", "self-treatment", "autonomous healing"],
        collocations: ["risks of self-medication", "practice self-medication", "curb self-medication"],
        modelSentence: "Rampant self-medication without professional oversight poses severe health risks and accelerates antibiotic resistance.",
        vietnameseSentence: "Việc tự ý dùng thuốc tràn lan mà không có sự giám sát của chuyên gia gây ra những rủi ro sức khỏe nghiêm trọng và đẩy nhanh tình trạng kháng kháng sinh."
      },
      {
        id: "hlth-2",
        word: "ailment",
        ipa: "/ˈeɪl.mənt/",
        partOfSpeech: "noun",
        meaning: "Chứng bệnh nhẹ, cảm sốt hoặc đau ốm thông thường",
        basicEquivalent: "minor illness / sickness (Band 5)",
        synonyms: ["indisposition", "affliction", "minor disorder", "complaint"],
        collocations: ["minor ailments", "common physical ailments", "treat seasonal ailments"],
        modelSentence: "While over-the-counter remedies may relieve minor ailments, underlying chronic disorders often remain untreated.",
        vietnameseSentence: "Mặc dù các loại thuốc không kê đơn có thể xoa dịu những chứng bệnh nhẹ, nhưng các rối loạn mãn tính tiềm ẩn thường bị bỏ sót."
      },
      {
        id: "hlth-3",
        word: "hazardous",
        ipa: "/ˈhæz.ə.dəs/",
        partOfSpeech: "adjective",
        meaning: "Hiểm nguy, tiềm ẩn rủi ro khôn lường đối với an toàn hoặc tính mạng",
        basicEquivalent: "dangerous / risky (Band 5-6)",
        synonyms: ["perilous", "precarious", "detrimental", "jeopardizing"],
        collocations: ["hazardous practice", "hazardous to health", "potentially hazardous substances"],
        modelSentence: "Relying exclusively on unverified health tips from social media can be exceptionally hazardous to patient recovery.",
        vietnameseSentence: "Chỉ dựa vào các mẹo sức khỏe chưa kiểm chứng trên mạng xã hội có thể cực kỳ nguy hiểm cho sự hồi phục của bệnh nhân."
      },
      {
        id: "hlth-4",
        word: "consultation",
        ipa: "/ˌkɒn.sʌlˈteɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Buổi thăm khám, hội chẩn hoặc tư vấn chuyên môn từ bác sĩ",
        basicEquivalent: "doctor visit / meeting a doctor (Band 5)",
        synonyms: ["clinical appointment", "medical examination", "professional advice"],
        collocations: ["medical consultation", "schedule a consultation", "undergo clinical consultation"],
        modelSentence: "Timely consultation with healthcare professionals ensures accurate diagnoses before conditions escalate into critical stages.",
        vietnameseSentence: "Việc thăm khám kịp thời với các chuyên gia y tế đảm bảo chẩn đoán chính xác trước khi bệnh tình diễn biến nguy kịch."
      },
      {
        id: "hlth-5",
        word: "preventative",
        ipa: "/prɪˈven.tə.tɪv/",
        partOfSpeech: "adjective",
        meaning: "Mang tính phòng ngừa trước khi phát sinh hậu quả hoặc biến chứng",
        basicEquivalent: "preventing / stopping before it happens (Band 5)",
        synonyms: ["prophylactic", "precautionary", "anticipatory"],
        collocations: ["preventative healthcare", "preventative measures", "preventative medicine"],
        modelSentence: "Allocating national budgets to preventative healthcare reduces the long-term economic strain on public hospitals.",
        vietnameseSentence: "Phân bổ ngân sách quốc gia cho y tế dự phòng giúp giảm bớt gánh nặng kinh tế lâu dài lên các bệnh viện công lập."
      },
      {
        id: "hlth-6",
        word: "wellbeing",
        ipa: "/ˈwelˌbiː.ɪŋ/",
        partOfSpeech: "noun",
        meaning: "Trạng thái khỏe mạnh và hạnh phúc toàn diện cả thể chất lẫn tinh thần",
        basicEquivalent: "health and happiness (Band 5)",
        synonyms: ["holistic health", "welfare", "vitality", "soundness"],
        collocations: ["mental wellbeing", "physical wellbeing", "enhance overall wellbeing"],
        modelSentence: "Modern corporate cultures must prioritize employee mental wellbeing to sustain productivity and mitigate chronic stress.",
        vietnameseSentence: "Văn hóa doanh nghiệp hiện đại phải ưu tiên sức khỏe tinh thần của nhân viên để duy trì năng suất và giảm thiểu căng thẳng mãn tính."
      },
      {
        id: "hlth-7",
        word: "burnout",
        ipa: "/ˈbɜːn.aʊt/",
        partOfSpeech: "noun",
        meaning: "Hội chứng kiệt sức thể chất và suy sụp tinh thần do căng thẳng kéo dài",
        basicEquivalent: "extreme tiredness from work (Band 5)",
        synonyms: ["physical exhaustion", "mental fatigue", "nervous collapse"],
        collocations: ["occupational burnout", "suffer from burnout", "mitigate workplace burnout"],
        modelSentence: "Prolonged overtime without sufficient psychological recuperation inevitably precipitates severe occupational burnout.",
        vietnameseSentence: "Làm thêm giờ kéo dài mà không có thời gian hồi phục tâm lý thỏa đáng chắc chắn sẽ dẫn đến tình trạng kiệt sức nghề nghiệp nghiêm trọng."
      },
      {
        id: "hlth-8",
        word: "remedy",
        ipa: "/ˈrem.ə.di/",
        partOfSpeech: "noun / verb",
        meaning: "Biện pháp chữa trị, bài thuốc hoặc giải pháp xoa dịu bệnh tình",
        basicEquivalent: "cure / treatment / solution (Band 5)",
        synonyms: ["therapeutic solution", "panacea", "antidote", "countermeasure"],
        collocations: ["herbal remedy", "effective remedy for", "remedy the deficiency"],
        modelSentence: "Natural remedies can complement conventional medical therapies but should never completely supplant scientifically validated prescriptions.",
        vietnameseSentence: "Các bài thuốc tự nhiên có thể bổ trợ cho liệu pháp y học nhưng không bao giờ được thay thế hoàn toàn đơn thuốc đã được kiểm chứng khoa học."
      },
      {
        id: "hlth-9",
        word: "sedentary",
        ipa: "/ˈsed.ən.tər.i/",
        partOfSpeech: "adjective",
        meaning: "Lối sống thụ động, ngồi nhiều một chỗ và ít vận động thể chất",
        basicEquivalent: "sitting too much / inactive (Band 5)",
        synonyms: ["inactive", "desk-bound", "dormant", "motionless"],
        collocations: ["sedentary lifestyle", "sedentary habits", "desk-bound sedentary occupations"],
        modelSentence: "Adopting a sedentary lifestyle dramatically increases the vulnerability of white-collar workers to cardiovascular complications.",
        vietnameseSentence: "Lối sống thụ động ngồi nhiều làm gia tăng đáng kể nguy cơ mắc các biến chứng tim mạch ở nhân viên văn phòng."
      },
      {
        id: "hlth-10",
        word: "diagnose",
        ipa: "/ˈdaɪ.əɡ.nəʊz/",
        partOfSpeech: "verb",
        meaning: "Chẩn đoán, xác định chính xác căn nguyên của bệnh tật",
        basicEquivalent: "find out what illness someone has (Band 5)",
        synonyms: ["identify", "pinpoint", "detect", "ascertain"],
        collocations: ["diagnose symptoms accurately", "diagnosed with chronic illness", "early clinical diagnosis"],
        modelSentence: "Advanced artificial intelligence algorithms assist clinicians to diagnose microscopic tumors at substantially earlier stages.",
        vietnameseSentence: "Các thuật toán trí tuệ nhân tạo tiên tiến hỗ trợ bác sĩ chẩn đoán các khối u siêu nhỏ ở những giai đoạn sớm hơn đáng kể."
      }
    ]
  },
  {
    id: "work-2026",
    name: "Modern Workplace & 4-Day Workweek (2026 Trend)",
    vietnameseName: "Văn hóa làm việc & Tuần làm 4 ngày (2026)",
    tag: "Đề mới 2026",
    icon: "Briefcase",
    ieltsPrompt: "In many countries, corporations and governments are experimenting with a four-day working week with no reduction in salaries. Do the advantages of this modern work policy outweigh its disadvantages?",
    vocabularies: [
      {
        id: "work-1",
        word: "productivity",
        ipa: "/ˌprɒd.ʌkˈtɪv.ə.ti/",
        partOfSpeech: "noun",
        meaning: "Năng suất lao động, hiệu suất tạo ra sản phẩm hoặc giá trị",
        basicEquivalent: "how much work gets done (Band 5)",
        synonyms: ["work output", "efficiency", "labor yield", "efficacy"],
        collocations: ["boost labor productivity", "maintain peak productivity", "productivity gains"],
        modelSentence: "Trials demonstrate that reducing weekly working hours elevates focus and boosts aggregate employee productivity.",
        vietnameseSentence: "Các thử nghiệm chứng minh rằng việc cắt giảm số giờ làm việc hàng tuần giúp nâng cao độ tập trung và tăng năng suất tổng thể của người lao động."
      },
      {
        id: "work-2",
        word: "telecommuting",
        ipa: "/ˈtel.ɪ.kəˌmjuː.tɪŋ/",
        partOfSpeech: "noun",
        meaning: "Hình thức làm việc từ xa tại nhà thông qua công nghệ mạng",
        basicEquivalent: "working from home (Band 5)",
        synonyms: ["remote work", "distance working", "home-based employment"],
        collocations: ["widespread telecommuting", "telecommuting arrangements", "adopt telecommuting"],
        modelSentence: "The widespread normalization of telecommuting has eliminated stressful commuting times and reduced carbon emissions in major cities.",
        vietnameseSentence: "Sự phổ biến của hình thức làm việc từ xa đã xóa bỏ thời gian đi lại căng thẳng và giảm lượng khí thải carbon ở các đô thị lớn."
      },
      {
        id: "work-3",
        word: "equilibrium",
        ipa: "/ˌiː.kwɪˈlɪb.ri.əm/",
        partOfSpeech: "noun",
        meaning: "Trạng thái cân bằng hài hòa, ổn định giữa các yếu tố đối lập",
        basicEquivalent: "balance (Band 5)",
        synonyms: ["harmony", "work-life balance", "stability", "parity"],
        collocations: ["work-life equilibrium", "restore psychological equilibrium", "delicate equilibrium"],
        modelSentence: "Compressing the workweek allows professionals to achieve a sustainable equilibrium between career ambitions and personal duties.",
        vietnameseSentence: "Rút ngắn tuần làm việc cho phép người lao động đạt được sự cân bằng bền vững giữa khát vọng sự nghiệp và nghĩa vụ cá nhân."
      },
      {
        id: "work-4",
        word: "flexibility",
        ipa: "/ˌflek.səˈbɪl.ə.ti/",
        partOfSpeech: "noun",
        meaning: "Tính linh hoạt, khả năng dễ dàng thích nghi với hoàn cảnh thay đổi",
        basicEquivalent: "being easy to change (Band 5)",
        synonyms: ["adaptability", "versatility", "elasticity"],
        collocations: ["schedule flexibility", "workplace flexibility", "greater operational flexibility"],
        modelSentence: "Offering greater schedule flexibility empowers working parents to harmonize professional responsibilities with childcare.",
        vietnameseSentence: "Trao cho nhân viên sự linh hoạt về thời gian giúp các bậc phụ huynh vừa hoàn thành công việc vừa chăm sóc con cái chu đáo."
      },
      {
        id: "work-5",
        word: "disillusionment",
        ipa: "/ˌdɪs.ɪˈluː.ʒən.mənt/",
        partOfSpeech: "noun",
        meaning: "Sự vỡ mộng, cảm giác hụt hẫng và mất nhiệt huyết cống hiến",
        basicEquivalent: "disappointment with work (Band 5)",
        synonyms: ["disenchantment", "alienation", "demoralization", "apathy"],
        collocations: ["workplace disillusionment", "grow into disillusionment", "overcome employee disillusionment"],
        modelSentence: "Excessive corporate bureaucracy and uncompensated overtime often breed cynicism and widespread disillusionment among junior staff.",
        vietnameseSentence: "Sự quan liêu của doanh nghiệp và việc làm thêm giờ không thù lao thường làm nảy sinh tâm lý chán nản và sự vỡ mộng của nhân viên cấp dưới."
      },
      {
        id: "work-6",
        word: "turnover",
        ipa: "/ˈtɜːnˌəʊ.vər/",
        partOfSpeech: "noun",
        meaning: "Tỷ lệ thay thế nhân sự hoặc tỷ lệ nghỉ việc của nhân viên",
        basicEquivalent: "people quitting jobs (Band 5)",
        synonyms: ["attrition rate", "staff churn", "employee departures"],
        collocations: ["high employee turnover", "curb staff turnover", "turnover rate"],
        modelSentence: "Instituting a condensed four-day work schedule noticeably curtails staff turnover and retains premier talent.",
        vietnameseSentence: "Áp dụng lịch làm việc rút gọn 4 ngày làm giảm rõ rệt tỷ lệ thay thế nhân sự và giữ chân các nhân tài hàng đầu."
      },
      {
        id: "work-7",
        word: "incentivize",
        ipa: "/ɪnˈsen.tɪ.vaɪz/",
        partOfSpeech: "verb",
        meaning: "Khuyến khích, tạo động lực bằng đãi ngộ hoặc phần thưởng cụ thể",
        basicEquivalent: "encourage with reward (Band 5-6)",
        synonyms: ["motivate", "stimulate", "reward", "spur"],
        collocations: ["incentivize employees", "financial packages that incentivize innovation", "strongly incentivized"],
        modelSentence: "Forward-thinking firms incentivize performance through generous autonomy rather than punitive surveillance measures.",
        vietnameseSentence: "Các công ty có tư duy đổi mới tạo động lực bằng cách trao quyền tự chủ rộng rãi thay vì áp dụng các biện pháp giám sát hà khắc."
      },
      {
        id: "work-8",
        word: "monotony",
        ipa: "/məˈnɒt.ən.i/",
        partOfSpeech: "noun",
        meaning: "Sự đơn điệu, sự nhàm chán do công việc lặp đi lặp lại không đổi",
        basicEquivalent: "sameness / boring routine (Band 5)",
        synonyms: ["tedium", "repetitiveness", "routine dullness", "drudgery"],
        collocations: ["break the monotony", "relieve daily monotony", "monotony of repetitive tasks"],
        modelSentence: "Longer weekends provide a vital psychological respite to break the exhausting monotony of repetitive corporate routines.",
        vietnameseSentence: "Những kỳ nghỉ cuối tuần dài hơn mang lại khoảng nghỉ tâm lý thiết yếu để phá vỡ sự đơn điệu mệt mỏi của thói quen công sở lặp đi lặp lại."
      },
      {
        id: "work-9",
        word: "efficiency",
        ipa: "/ɪˈfɪʃ.ən.si/",
        partOfSpeech: "noun",
        meaning: "Hiệu quả, khả năng tối ưu hóa nguồn lực mà không lãng phí thời gian",
        basicEquivalent: "working well without waste (Band 5)",
        synonyms: ["competence", "streamlined execution", "cost-effectiveness"],
        collocations: ["operational efficiency", "maximize energy efficiency", "time efficiency"],
        modelSentence: "Eliminating unnecessary meetings allows teams to achieve optimal operational efficiency within compressed working hours.",
        vietnameseSentence: "Cắt bỏ các cuộc họp không cần thiết cho phép các nhóm đạt hiệu quả vận hành tối ưu trong số giờ làm việc rút ngắn."
      },
      {
        id: "work-10",
        word: "collaborative",
        ipa: "/kəˈlæb.ər.ə.tɪv/",
        partOfSpeech: "adjective",
        meaning: "Mang tính cộng tác, dựa trên tinh thần phối hợp tập thể",
        basicEquivalent: "working together (Band 5)",
        synonyms: ["cooperative", "collective", "synergistic", "team-oriented"],
        collocations: ["collaborative environment", "collaborative tools", "foster collaborative culture"],
        modelSentence: "Virtual whiteboards and asynchronous messaging tools foster a vibrant collaborative culture across distributed teams.",
        vietnameseSentence: "Bảng trắng ảo và các công cụ nhắn tin không đồng bộ nuôi dưỡng văn hóa cộng tác sôi nổi giữa các nhóm làm việc từ xa."
      }
    ]
  },
  {
    id: "family-2026",
    name: "Aging Population & Modern Family Care (2026 Trend)",
    vietnameseName: "Già hóa dân số & Trách nhiệm gia đình (2026)",
    tag: "Đề mới 2026",
    icon: "Users",
    ieltsPrompt: "As life expectancy continues to rise worldwide, some argue that governments should assume primary financial and caregiving responsibility for elderly citizens, while others maintain that this duty rests strictly with families. Discuss both views and give your opinion.",
    vocabularies: [
      {
        id: "fam-1",
        word: "longevity",
        ipa: "/lɒnˈdʒev.ə.ti/",
        partOfSpeech: "noun",
        meaning: "Tuổi thọ cao, sự sống lâu của con người trong xã hội hiện đại",
        basicEquivalent: "long life (Band 5)",
        synonyms: ["life expectancy", "extended lifespan", "durability of life"],
        collocations: ["increased longevity", "human longevity", "demographic challenges of longevity"],
        modelSentence: "Unprecedented gains in human longevity have fundamentally transformed the demographic composition of developed economies.",
        vietnameseSentence: "Sự gia tăng chưa từng có về tuổi thọ của con người đã thay đổi căn bản cấu trúc nhân khẩu học của các nền kinh tế phát triển."
      },
      {
        id: "fam-2",
        word: "obligation",
        ipa: "/ˌɒb.lɪˈɡeɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Nghĩa vụ, bổn phận đạo lý hoặc trách nhiệm pháp lý bắt buộc",
        basicEquivalent: "duty / must do (Band 5)",
        synonyms: ["moral responsibility", "duty", "commitment", "imperative"],
        collocations: ["moral obligation", "statutory obligation", "fulfill family obligations"],
        modelSentence: "Adult offspring frequently feel an insurmountable moral obligation to nurture their aging parents through infirmity.",
        vietnameseSentence: "Con cái khi trưởng thành thường cảm nhận một nghĩa vụ đạo đức to lớn phải chăm sóc cha mẹ già lúc ốm đau."
      },
      {
        id: "fam-3",
        word: "caregiver",
        ipa: "/ˈkeəˌɡɪv.ər/",
        partOfSpeech: "noun",
        meaning: "Người trực tiếp chăm sóc người già, trẻ nhỏ hoặc bệnh nhân mất khả năng tự phục vụ",
        basicEquivalent: "person who looks after someone (Band 5)",
        synonyms: ["caretaker", "carer", "guardian", "attendant"],
        collocations: ["primary caregiver", "professional caregivers", "support for family caregivers"],
        modelSentence: "Without subsidized respite care, informal family caregivers risk experiencing profound physical and emotional depletion.",
        vietnameseSentence: "Nếu không có dịch vụ chăm sóc hỗ trợ được trợ cấp, những người thân chăm sóc trong gia đình có nguy cơ kiệt quệ thể chất và cảm xúc."
      },
      {
        id: "fam-4",
        word: "pension",
        ipa: "/ˈpen.ʃən/",
        partOfSpeech: "noun",
        meaning: "Chế độ lương hưu, khoản trợ cấp hưu trí chi trả định kỳ cho người cao tuổi",
        basicEquivalent: "retirement money (Band 5)",
        synonyms: ["retirement annuity", "superannuation", "state allowance"],
        collocations: ["pension scheme", "state pension fund", "adequate pension provisions"],
        modelSentence: "Demographic aging threatens the long-term solvency of public pension funds unless retirement ages are strategically adjusted.",
        vietnameseSentence: "Tình trạng già hóa dân số đe dọa khả năng thanh toán dài hạn của các quỹ hưu trí công trừ khi tuổi nghỉ hưu được điều chỉnh chiến lược."
      },
      {
        id: "fam-5",
        word: "alienation",
        ipa: "/ˌeɪ.li.əˈneɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Sự xa lánh, cảm giác bị cô lập và tách biệt khỏi gia đình hoặc cộng đồng",
        basicEquivalent: "feeling alone and separated (Band 5)",
        synonyms: ["estrangement", "isolation", "disconnection", "detachment"],
        collocations: ["emotional alienation", "social alienation among the elderly", "sense of alienation"],
        modelSentence: "Confining senior citizens to institutional nursing homes can trigger severe feelings of emotional alienation and neglect.",
        vietnameseSentence: "Việc đưa người cao tuổi vào các viện dưỡng lão có thể gây ra cảm giác xa lánh tình cảm và sự bỏ rơi sâu sắc."
      },
      {
        id: "fam-6",
        word: "cohesion",
        ipa: "/kəʊˈhiː.ʒən/",
        partOfSpeech: "noun",
        meaning: "Sự gắn kết, tình đoàn kết keo sơn giữa các thành viên hoặc trong xã hội",
        basicEquivalent: "staying closely together (Band 5)",
        synonyms: ["solidarity", "unity", "interconnectedness", "togetherness"],
        collocations: ["family cohesion", "social cohesion", "foster intergenerational cohesion"],
        modelSentence: "Multigenerational households strengthen familial cohesion by fostering daily interactions between grandparents and grandchildren.",
        vietnameseSentence: "Gia đình đa thế hệ củng cố sự gắn kết gia đình bằng cách nuôi dưỡng các tương tác hàng ngày giữa ông bà và con cháu."
      },
      {
        id: "fam-7",
        word: "demographic",
        ipa: "/ˌdem.əˈɡræf.ɪk/",
        partOfSpeech: "adjective / noun",
        meaning: "Thuộc về nhân khẩu học, sự biến đổi về số lượng và độ tuổi dân số",
        basicEquivalent: "about population numbers (Band 5)",
        synonyms: ["population-related", "census-related", "demographical"],
        collocations: ["demographic shift", "demographic crisis", "aging demographic"],
        modelSentence: "Developing nations must prepare infrastructure well in advance to accommodate this unprecedented demographic shift.",
        vietnameseSentence: "Các quốc gia đang phát triển phải chuẩn bị cơ sở hạ tầng từ sớm để thích ứng với sự chuyển dịch nhân khẩu học chưa từng có này."
      },
      {
        id: "fam-8",
        word: "intergenerational",
        ipa: "/ˌɪn.təˌdʒen.əˈreɪ.ʃən.əl/",
        partOfSpeech: "adjective",
        meaning: "Diễn ra giữa các thế hệ khác nhau trong gia đình hoặc xã hội",
        basicEquivalent: "between old and young generations (Band 5)",
        synonyms: ["cross-generational", "multigenerational"],
        collocations: ["intergenerational dialogue", "intergenerational wealth transfer", "intergenerational conflict"],
        modelSentence: "Encouraging intergenerational dialogue bridges cultural divides and preserves valuable oral traditions within communities.",
        vietnameseSentence: "Khuyến khích đối thoại giữa các thế hệ giúp thu hẹp khoảng cách văn hóa và bảo tồn các truyền thống quý báu trong cộng đồng."
      },
      {
        id: "fam-9",
        word: "solitude",
        ipa: "/ˈsɒl.ɪ.tʃuːd/",
        partOfSpeech: "noun",
        meaning: "Cảnh sống thui thủi một mình, tình trạng đơn độc tuổi xế chiều",
        basicEquivalent: "being alone (Band 5)",
        synonyms: ["seclusion", "loneliness", "isolation", "reclusion"],
        collocations: ["prolonged solitude", "live in solitude", "suffer in solitude"],
        modelSentence: "Community volunteer programs play an indispensable role in rescuing widowed seniors from the perils of chronic solitude.",
        vietnameseSentence: "Các chương trình tình nguyện cộng đồng đóng vai trò không thể thiếu trong việc cứu những người già góa bụa khỏi sự cô đơn mãn tính."
      },
      {
        id: "fam-10",
        word: "filial",
        ipa: "/ˈfɪl.i.əl/",
        partOfSpeech: "adjective",
        meaning: "Thuộc về đạo làm con cái, lòng hiếu thảo đối với cha mẹ",
        basicEquivalent: "about children's duty to parents (Band 5)",
        synonyms: ["dutiful", "devoted", "respectful"],
        collocations: ["filial piety", "filial duty", "filial devotion"],
        modelSentence: "In many Asian cultures, filial piety remains the moral bedrock guiding family structures and caregiving conventions.",
        vietnameseSentence: "Trong nhiều nền văn hóa Á Đông, lòng hiếu thảo vẫn là nền tảng đạo đức dẫn dắt cấu trúc gia đình và chuẩn mực phụng dưỡng cha mẹ."
      }
    ]
  },
  {
    id: "transport-2025",
    name: "Aviation, Transport & Environmental Impact (2025 Actual)",
    vietnameseName: "Hàng không & Giao thông bền vững (2025)",
    tag: "Đề thi 2025",
    icon: "Plane",
    ieltsPrompt: "Long-distance flights consume vast amounts of fuel and pollute the air. Some people believe that governments should discourage non-essential flights, such as tourism, rather than limiting the use of cars. To what extent do you agree or disagree?",
    vocabularies: [
      {
        id: "trans-1",
        word: "aviation",
        ipa: "/ˌeɪ.viˈeɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Ngành hàng không, hoạt động vận tải bằng máy bay",
        basicEquivalent: "flying / planes (Band 5)",
        synonyms: ["aeronautics", "air transport", "flight industry"],
        collocations: ["commercial aviation", "aviation emissions", "aviation sector"],
        modelSentence: "Commercial aviation accounts for a disproportionate share of global greenhouse gas emissions relative to passenger volume.",
        vietnameseSentence: "Ngành hàng không thương mại chiếm một tỷ trọng phát thải khí nhà kính toàn cầu lớn bất tương xứng so với lượng hành khách."
      },
      {
        id: "trans-2",
        word: "deterrent",
        ipa: "/dɪˈter.ənt/",
        partOfSpeech: "noun",
        meaning: "Biện pháp hoặc rào cản mang tính răn đe, ngăn ngừa hành vi tiêu cực",
        basicEquivalent: "something that stops people (Band 5)",
        synonyms: ["disincentive", "curb", "impediment", "restraint"],
        collocations: ["effective deterrent", "financial deterrent", "act as a deterrent against"],
        modelSentence: "Levying heavy carbon surcharges on long-haul tourist tickets serves as a powerful financial deterrent against frivolous flying.",
        vietnameseSentence: "Việc đánh phụ phí carbon nặng vào vé máy bay du lịch đường dài đóng vai trò như một biện pháp răn đe tài chính mạnh mẽ chống lại việc bay bừa bãi."
      },
      {
        id: "trans-3",
        word: "carbon-intensive",
        ipa: "/ˌkɑː.bən.ɪnˈten.sɪv/",
        partOfSpeech: "adjective",
        meaning: "Thâm dụng phát thải carbon, tiêu tốn nhiều nhiên liệu hóa thạch",
        basicEquivalent: "making lots of carbon pollution (Band 5)",
        synonyms: ["polluting", "emission-heavy", "fossil-dependent"],
        collocations: ["carbon-intensive travel", "carbon-intensive industries", "carbon-intensive lifestyles"],
        modelSentence: "Aviation represents the most carbon-intensive mode of passenger transport per kilometer traveled.",
        vietnameseSentence: "Hàng không là phương thức vận tải hành khách thâm dụng carbon nhiều nhất trên mỗi kilomet di chuyển."
      },
      {
        id: "trans-4",
        word: "subsidize",
        ipa: "/ˈsʌb.sɪ.daɪz/",
        partOfSpeech: "verb",
        meaning: "Trợ cấp kinh phí từ ngân sách nhà nước nhằm giảm giá thành",
        basicEquivalent: "give money to help pay (Band 5)",
        synonyms: ["fund", "underwrite", "finance", "support financially"],
        collocations: ["subsidize rail networks", "subsidize public transit", "heavily subsidized"],
        modelSentence: "Governments should heavily subsidize high-speed rail networks to present viable eco-friendly alternatives to regional flights.",
        vietnameseSentence: "Chính phủ nên trợ cấp mạnh mẽ cho mạng lưới đường sắt cao tốc để mang lại giải pháp thay thế thân thiện môi trường khả thi cho các chuyến bay khu vực."
      },
      {
        id: "trans-5",
        word: "curb",
        ipa: "/kɜːb/",
        partOfSpeech: "verb",
        meaning: "Kiềm chế, kiểm soát hoặc cắt giảm mức độ nghiêm trọng",
        basicEquivalent: "limit / control / stop (Band 5)",
        synonyms: ["restrain", "suppress", "rein in", "check"],
        collocations: ["curb carbon emissions", "curb frivolous consumption", "curb reliance on cars"],
        modelSentence: "Strict municipal policies are required to curb private automobile usage and mitigate chronic urban congestion.",
        vietnameseSentence: "Cần có các chính sách đô thị nghiêm ngặt để kiềm chế việc sử dụng ô tô cá nhân và giảm thiểu ùn tắc đô thị kinh niên."
      },
      {
        id: "trans-6",
        word: "feasibility",
        ipa: "/ˌfiː.zəˈbɪl.ə.ti/",
        partOfSpeech: "noun",
        meaning: "Tính khả thi, khả năng thực hiện thành công trong thực tế",
        basicEquivalent: "can it be done (Band 5)",
        synonyms: ["viability", "practicability", "workability"],
        collocations: ["economic feasibility", "technical feasibility", "assess the feasibility of"],
        modelSentence: "Critics question the economic feasibility of prohibiting leisure flights given the tourism industry's reliance on international visitors.",
        vietnameseSentence: "Các nhà phản biện hoài nghi tính khả thi kinh tế của việc cấm các chuyến bay du lịch do sự phụ thuộc của ngành du lịch vào du khách quốc tế."
      },
      {
        id: "trans-7",
        word: "indispensable",
        ipa: "/ˌɪn.dɪˈspen.sə.bəl/",
        partOfSpeech: "adjective",
        meaning: "Thiết yếu, không thể thiếu được đối với đời sống hoặc vận hành",
        basicEquivalent: "very important / must-have (Band 5)",
        synonyms: ["essential", "crucial", "vital", "imperative"],
        collocations: ["indispensable role", "indispensable to modern life", "remain indispensable"],
        modelSentence: "Personal vehicles remain indispensable for rural inhabitants who lack access to synchronized public transit options.",
        vietnameseSentence: "Phương tiện cá nhân vẫn không thể thiếu đối với cư dân nông thôn vốn không có khả năng tiếp cận các phương tiện giao thông công cộng đồng bộ."
      },
      {
        id: "trans-8",
        word: "counterproductive",
        ipa: "/ˌkaʊn.tə.prəˈdʌk.tɪv/",
        partOfSpeech: "adjective",
        meaning: "Phản tác dụng, đem lại kết quả tiêu cực trái ngược với mong muốn",
        basicEquivalent: "having opposite bad result (Band 5)",
        synonyms: ["detrimental", "ineffectual", "self-defeating"],
        collocations: ["prove counterproductive", "counterproductive policy", "highly counterproductive"],
        modelSentence: "Singling out vacationers while exempting business flights would prove fundamentally inequitable and counterproductive.",
        vietnameseSentence: "Việc chỉ nhắm vào khách du lịch trong khi miễn trừ các chuyến bay công vụ sẽ là điều bất công và phản tác dụng."
      },
      {
        id: "trans-9",
        word: "levy",
        ipa: "/ˈlev.i/",
        partOfSpeech: "verb / noun",
        meaning: "Đánh thuế hoặc thu các khoản phí chính thức bắt buộc",
        basicEquivalent: "charge tax (Band 5)",
        synonyms: ["impose", "exact", "charge"],
        collocations: ["levy eco-taxes on", "levy penalties", "levy a green tariff"],
        modelSentence: "Authorities ought to levy progressive green tariffs on frequent flyers rather than instituting blanket flight prohibitions.",
        vietnameseSentence: "Nhà chức trách nên đánh các loại thuế xanh lũy tiến vào người bay thường xuyên thay vì áp đặt các lệnh cấm bay toàn diện."
      },
      {
        id: "trans-10",
        word: "exponential",
        ipa: "/ˌek.spəˈnen.ʃəl/",
        partOfSpeech: "adjective",
        meaning: "Gia tăng theo cấp số nhân, tăng trưởng với tốc độ cực kỳ nhanh",
        basicEquivalent: "growing very fast (Band 5)",
        synonyms: ["rapid", "accelerated", "soaring"],
        collocations: ["exponential growth in air traffic", "exponential rise in emissions", "exponential expansion"],
        modelSentence: "The exponential expansion of budget airlines has made cross-border holidays affordable at severe ecological costs.",
        vietnameseSentence: "Sự phát triển theo cấp số nhân của các hãng hàng không giá rẻ đã khiến các kỳ nghỉ xuyên biên giới vừa túi tiền nhưng để lại cái giá sinh thái đắt đỏ."
      }
    ]
  },
  {
    id: "law-safety-2025",
    name: "Crime, Law Enforcement & Road Safety (2025 Actual)",
    vietnameseName: "Pháp luật & Ý thức an toàn (2025)",
    tag: "Đề thi 2025",
    icon: "ShieldAlert",
    ieltsPrompt: "In every country, driving laws exist to ensure road safety. However, many motorists continue to violate traffic regulations by speeding or using smartphones. What are the reasons for this, and what effective measures can be implemented to solve this problem?",
    vocabularies: [
      {
        id: "law-1",
        word: "enforcement",
        ipa: "/ɪnˈfɔːs.mənt/",
        partOfSpeech: "noun",
        meaning: "Sự thi hành, sự cưỡng chế thực hiện nghiêm minh luật lệ",
        basicEquivalent: "making people follow laws (Band 5)",
        synonyms: ["implementation", "execution", "imposition", "administration"],
        collocations: ["rigorous law enforcement", "enforcement of traffic rules", "strengthen enforcement"],
        modelSentence: "Lax enforcement of traffic statutes encourages motorists to disregard speed boundaries with relative impunity.",
        vietnameseSentence: "Việc thực thi các quy chế giao thông lỏng lẻo khiến người lái xe coi thường các giới hạn tốc độ mà không sợ bị trừng phạt."
      },
      {
        id: "law-2",
        word: "reckless",
        ipa: "/ˈrek.ləs/",
        partOfSpeech: "adjective",
        meaning: "Liều lĩnh, thiếu cẩn trọng và coi thường hậu quả nguy hiểm",
        basicEquivalent: "careless / dangerous (Band 5)",
        synonyms: ["rash", "irresponsible", "heedless", "audacious"],
        collocations: ["reckless driving", "reckless disregard for safety", "reckless behavior"],
        modelSentence: "Reckless texting while operating high-speed vehicles substantially heightens the probability of fatal road collisions.",
        vietnameseSentence: "Hành vi liều lĩnh nhắn tin khi điều khiển phương tiện tốc độ cao làm tăng đáng kể khả năng xảy ra va chạm giao thông chết người."
      },
      {
        id: "law-3",
        word: "penalize",
        ipa: "/ˈpiː.nəl.aɪz/",
        partOfSpeech: "verb",
        meaning: "Xử phạt, áp đặt hình phạt pháp lý đối với hành vi sai phạm",
        basicEquivalent: "punish (Band 5)",
        synonyms: ["punish", "sanction", "fine", "discipline"],
        collocations: ["penalize repeat offenders", "harshly penalized", "penalized under statutory law"],
        modelSentence: "Judicial systems must harshly penalize repeat offenders by revoking operator licenses and imposing heavy fines.",
        vietnameseSentence: "Hệ thống tư pháp phải trừng phạt nghiêm khắc những người tái phạm bằng cách tước giấy phép lái xe và phạt tiền nặng."
      },
      {
        id: "law-4",
        word: "complacency",
        ipa: "/kəmˈpleɪ.sən.si/",
        partOfSpeech: "noun",
        meaning: "Sự tự mãn, tâm lý chủ quan coi thường rủi ro nguy hiểm",
        basicEquivalent: "feeling too comfortable and safe (Band 5)",
        synonyms: ["overconfidence", "self-satisfaction", "carelessness"],
        collocations: ["driver complacency", "bred complacency", "shatter complacency"],
        modelSentence: "Experienced motorists frequently fall prey to dangerous complacency, falsely presuming their reflexes can avert accidents.",
        vietnameseSentence: "Những người lái xe có kinh nghiệm thường rơi vào tâm lý chủ quan nguy hiểm, ảo tưởng rằng phản xạ của họ có thể ngăn ngừa mọi tai nạn."
      },
      {
        id: "law-5",
        word: "surveillance",
        ipa: "/səˈveɪ.ləns/",
        partOfSpeech: "noun",
        meaning: "Hệ thống giám sát, việc theo dõi tự động bằng thiết bị công nghệ",
        basicEquivalent: "watching / security cameras (Band 5)",
        synonyms: ["monitoring", "observation", "scrutiny", "automated tracking"],
        collocations: ["traffic surveillance cameras", "radar surveillance", "round-the-clock surveillance"],
        modelSentence: "Installing automated speed surveillance cameras eliminates reliance on physical police patrols and catches violators systematically.",
        vietnameseSentence: "Lắp đặt camera giám sát tốc độ tự động giúp loại bỏ sự phụ thuộc vào tuần tra cảnh sát và bắt lỗi người vi phạm một cách có hệ thống."
      },
      {
        id: "law-6",
        word: "confiscate",
        ipa: "/ˈkɒn.fɪ.skeɪt/",
        partOfSpeech: "verb",
        meaning: "Tịch thu, tạm giữ phương tiện hoặc tài sản do vi phạm pháp luật",
        basicEquivalent: "take away by law (Band 5)",
        synonyms: ["seize", "impound", "appropriate"],
        collocations: ["confiscate driving licenses", "confiscate vehicles", "empowered to confiscate"],
        modelSentence: "Authorities should be legally empowered to confiscate vehicles from intoxicated drivers who jeopardize pedestrian lives.",
        vietnameseSentence: "Nhà chức trách cần được trao quyền hợp pháp để tịch thu phương tiện của những tài xế say rượu gây nguy hiểm cho tính mạng người đi bộ."
      },
      {
        id: "law-7",
        word: "fatal",
        ipa: "/ˈfeɪ.təl/",
        partOfSpeech: "adjective",
        meaning: "Gây tử vong, chết người, để lại hậu quả thảm khốc",
        basicEquivalent: "deadly / killing (Band 5)",
        synonyms: ["lethal", "mortal", "deadly", "catastrophic"],
        collocations: ["fatal accidents", "fatal casualties", "fatal impact"],
        modelSentence: "A momentary lapse in concentration caused by mobile notifications can trigger an irreversible fatal collision.",
        vietnameseSentence: "Một thoáng mất tập trung do thông báo trên điện thoại có thể dẫn đến vụ va chạm chết người không thể cứu vãn."
      },
      {
        id: "law-8",
        word: "negligence",
        ipa: "/ˈneɡ.lɪ.dʒəns/",
        partOfSpeech: "noun",
        meaning: "Sự tắc trách, sự sơ suất cẩu thả không hoàn thành bổn phận an toàn",
        basicEquivalent: "not caring / being careless (Band 5)",
        synonyms: ["carelessness", "dereliction", "inattention", "laxity"],
        collocations: ["criminal negligence", "gross negligence", "driver negligence"],
        modelSentence: "Holding motorists accountable for gross negligence sends an unmistakable societal signal that lives are sacrosanct.",
        vietnameseSentence: "Buộc người lái xe phải chịu trách nhiệm về sự tắc trách nghiêm trọng sẽ gửi đi thông điệp xã hội rõ ràng rằng tính mạng con người là bất khả xâm phạm."
      },
      {
        id: "law-9",
        word: "habitual",
        ipa: "/həˈbɪtʃ.u.əl/",
        partOfSpeech: "adjective",
        meaning: "Thành thói quen cố hữu, tái diễn liên tục theo thói quen",
        basicEquivalent: "doing something as a bad habit (Band 5)",
        synonyms: ["chronic", "persistent", "recurrent", "inveterate"],
        collocations: ["habitual speeding", "habitual offenders", "habitual violation"],
        modelSentence: "Educational campaigns must deconstruct the psychological roots of habitual speeding among young demographics.",
        vietnameseSentence: "Các chiến dịch giáo dục phải giải quyết tận gốc rễ tâm lý của thói quen phóng nhanh vượt ẩu ở giới trẻ."
      },
      {
        id: "law-10",
        word: "imperative",
        ipa: "/ɪmˈper.ə.tɪv/",
        partOfSpeech: "noun / adjective",
        meaning: "Nhiệm vụ cấp bách, mệnh lệnh sống còn không thể trì hoãn",
        basicEquivalent: "very urgent and necessary thing (Band 5)",
        synonyms: ["urgent priority", "necessity", "vital requirement"],
        collocations: ["moral imperative", "societal imperative", "it is imperative that"],
        modelSentence: "Establishing universally respected driving norms is a societal imperative to diminish premature road fatalities.",
        vietnameseSentence: "Thiết lập các chuẩn mực lái xe được tôn trọng toàn diện là một mệnh lệnh xã hội cấp bách nhằm giảm thiểu thương vong giao thông."
      }
    ]
  },
  {
    id: "museum-culture-2024",
    name: "Museums, Heritage & National Identity (2024 Actual)",
    vietnameseName: "Bảo tàng & Bản sắc văn hóa (2024)",
    tag: "Đề thi 2024",
    icon: "Landmark",
    ieltsPrompt: "Some people believe that museums and art galleries should focus on showcasing the history and culture of their own country rather than that of other nations. To what extent do you agree or disagree?",
    vocabularies: [
      {
        id: "mus-1",
        word: "indigenous",
        ipa: "/ɪnˈdɪdʒ.ɪ.nəs/",
        partOfSpeech: "adjective",
        meaning: "Thuộc về bản địa, nguồn gốc xuất xứ nguyên bản của địa phương",
        basicEquivalent: "local / native (Band 5)",
        synonyms: ["aboriginal", "native", "endemic", "autochthonous"],
        collocations: ["indigenous culture", "indigenous heritage", "indigenous artifacts"],
        modelSentence: "Museums fulfill a crucial educational role by exhibiting the tangible crafts of indigenous civilizations.",
        vietnameseSentence: "Các viện bảo tàng hoàn thành vai trò giáo dục quan trọng bằng cách trưng bày các sản phẩm thủ công hữu hình của các nền văn minh bản địa."
      },
      {
        id: "mus-2",
        word: "artifact",
        ipa: "/ˈɑː.tɪ.fækt/",
        partOfSpeech: "noun",
        meaning: "Hiện vật khảo cổ, cổ vật có giá trị văn hóa và lịch sử",
        basicEquivalent: "historical object (Band 5)",
        synonyms: ["relic", "antiquity", "historical specimen", "monument"],
        collocations: ["ancient artifacts", "preserve cultural artifacts", "valuable archaeological artifacts"],
        modelSentence: "Curators must meticulously preserve rare archaeological artifacts to convey historical narratives to posterity.",
        vietnameseSentence: "Các nhà giám tuyển phải bảo quản tỉ mỉ những hiện vật khảo cổ học quý hiếm để truyền tải các câu chuyện lịch sử cho hậu thế."
      },
      {
        id: "mus-3",
        word: "heritage",
        ipa: "/ˈher.ɪ.tɪdʒ/",
        partOfSpeech: "noun",
        meaning: "Di sản văn hóa, giá trị lịch sử và tinh thần được kế thừa",
        basicEquivalent: "tradition passed down (Band 5)",
        synonyms: ["legacy", "inheritance", "cultural patrimony"],
        collocations: ["cultural heritage", "national heritage", "safeguard intangible heritage"],
        modelSentence: "Showcasing national heritage fosters social cohesion and instills historical pride in younger generations.",
        vietnameseSentence: "Trưng bày di sản dân tộc thúc đẩy sự gắn kết xã hội và hun đúc lòng tự hào lịch sử ở thế hệ trẻ."
      },
      {
        id: "mus-4",
        word: "curate",
        ipa: "/kjʊəˈreɪt/",
        partOfSpeech: "verb",
        meaning: "Tuyển chọn, giám tuyển và tổ chức trưng bày tác phẩm nghệ thuật",
        basicEquivalent: "select and organize for exhibition (Band 5-6)",
        synonyms: ["organize", "assemble", "oversee", "exhibit"],
        collocations: ["curate an exhibition", "carefully curated collection", "curate historical displays"],
        modelSentence: "Galleries must thoughtfully curate international masterpieces to broaden the aesthetic appreciation of visitors.",
        vietnameseSentence: "Các phòng trưng bày phải giám tuyển chu đáo các kiệt tác quốc tế để mở rộng sự cảm thụ thẩm mỹ của khách tham quan."
      },
      {
        id: "mus-5",
        word: "parochial",
        ipa: "/pəˈrəʊ.ki.əl/",
        partOfSpeech: "adjective",
        meaning: "Thiển cận, mang tính cục bộ hạn hẹp chỉ nhìn vào địa phương mình",
        basicEquivalent: "narrow-minded / only caring about own place (Band 5)",
        synonyms: ["insular", "provincial", "narrow-minded", "myopic"],
        collocations: ["parochial mindset", "parochial perspective", "risk becoming parochial"],
        modelSentence: "Excluding foreign artistic masterpieces risks cultivating an insular and parochial worldview among citizens.",
        vietnameseSentence: "Việc loại trừ các kiệt tác nghệ thuật nước ngoài có nguy cơ hình thành thế giới quan thiển cận và cục bộ ở người dân."
      },
      {
        id: "mus-6",
        word: "intercultural",
        ipa: "/ˌɪn.təˈkʌl.tʃər.əl/",
        partOfSpeech: "adjective",
        meaning: "Liên văn hóa, sự giao thoa và đối thoại giữa các nền văn hóa",
        basicEquivalent: "between different cultures (Band 5)",
        synonyms: ["cross-cultural", "transcultural", "multicultural"],
        collocations: ["intercultural dialogue", "intercultural understanding", "foster intercultural empathy"],
        modelSentence: "Hosting exhibitions from overseas civilizations nurtures intercultural empathy and dispels xenophobic misconceptions.",
        vietnameseSentence: "Tổ chức các cuộc triển lãm từ các nền văn minh hải ngoại giúp nuôi dưỡng sự thấu hiểu liên văn hóa và xóa tan những định kiến bài ngoại."
      },
      {
        id: "mus-7",
        word: "custodian",
        ipa: "/kʌsˈtəʊ.di.ən/",
        partOfSpeech: "noun",
        meaning: "Người trông coi, người bảo vệ và gìn giữ di sản quý giá",
        basicEquivalent: "guardian / keeper (Band 5)",
        synonyms: ["guardian", "keeper", "protector", "steward"],
        collocations: ["custodians of cultural memory", "public custodians", "serve as custodians"],
        modelSentence: "Public galleries act as indispensable custodians of human civilization, safeguarding treasures across centuries.",
        vietnameseSentence: "Các phòng tranh công cộng đóng vai trò là những người gìn giữ không thể thiếu của nền văn minh nhân loại, bảo vệ các kho báu qua nhiều thế kỷ."
      },
      {
        id: "mus-8",
        word: "provenance",
        ipa: "/ˈprɒv.ən.əns/",
        partOfSpeech: "noun",
        meaning: "Nguồn gốc xuất xứ và lịch sử sở hữu đã được xác thực của cổ vật",
        basicEquivalent: "origin / history of an object (Band 5)",
        synonyms: ["origin", "lineage", "pedigree", "derivation"],
        collocations: ["establish the provenance", "disputed provenance", "flawless provenance"],
        modelSentence: "Documenting the ethical provenance of foreign antiquities prevents the illicit trafficking of stolen cultural property.",
        vietnameseSentence: "Việc ghi chép nguồn gốc đạo đức của các cổ vật nước ngoài ngăn chặn nạn buôn bán bất hợp pháp tài sản văn hóa bị đánh cắp."
      },
      {
        id: "mus-9",
        word: "repatriation",
        ipa: "/ˌriː.pæt.riˈeɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Sự hồi hương, sự trao trả cổ vật về đất nước cội nguồn",
        basicEquivalent: "sending back to home country (Band 5)",
        synonyms: ["return", "restitution", "restoration"],
        collocations: ["repatriation of stolen artifacts", "demand repatriation", "cultural repatriation"],
        modelSentence: "Ethical debates surrounding the repatriation of colonial-era antiquities have prompted major institutions to re-evaluate their collections.",
        vietnameseSentence: "Các cuộc tranh luận đạo đức xung quanh việc hồi hương cổ vật thời thuộc địa đã thúc đẩy các viện bảo tàng lớn đánh giá lại bộ sưu tập của họ."
      },
      {
        id: "mus-10",
        word: "cosmopolitan",
        ipa: "/ˌkɒz.məˈpɒl.ɪ.tən/",
        partOfSpeech: "adjective",
        meaning: "Mang tính quốc tế cởi mở, không bị giới hạn bởi biên giới quốc gia",
        basicEquivalent: "worldwide / open to the world (Band 5)",
        synonyms: ["global-minded", "worldly", "broad-minded", "universal"],
        collocations: ["cosmopolitan perspective", "cosmopolitan outlook", "foster a cosmopolitan society"],
        modelSentence: "A truly educational museum must embrace a cosmopolitan perspective that honors human diversity.",
        vietnameseSentence: "Một viện bảo tàng mang tính giáo dục thực thụ phải đón nhận một góc nhìn cởi mở mang tính toàn cầu nhằm tôn vinh sự đa dạng của con người."
      }
    ]
  },
  {
    id: "science-welfare-2023",
    name: "Science & Societal Progress (Cam 18 Test 1)",
    vietnameseName: "Khoa học & Đời sống (Cam 18)",
    tag: "Cambridge 18",
    icon: "Atom",
    ieltsPrompt: "The most important aim of science should be to improve people's lives. To what extent do you agree or disagree with this statement?",
    vocabularies: [
      {
        id: "sci-1",
        word: "ameliorate",
        ipa: "/əˈmiːl.jə.reɪt/",
        partOfSpeech: "verb",
        meaning: "Làm giảm nhẹ, cải thiện đáng kể hoàn cảnh khó khăn hoặc đời sống con người",
        basicEquivalent: "improve / make better (Band 5)",
        synonyms: ["enhance", "alleviate", "better", "upgrade"],
        collocations: ["ameliorate human suffering", "ameliorate living conditions", "ameliorate hardship"],
        modelSentence: "Scientific endeavors are fundamentally justified by their ability to ameliorate human suffering.",
        vietnameseSentence: "Các nỗ lực khoa học về căn bản được chứng minh tính chính đáng qua khả năng làm giảm nhẹ nỗi đau khổ của con người."
      },
      {
        id: "sci-2",
        word: "breakthrough",
        ipa: "/ˈbreɪk.θruː/",
        partOfSpeech: "noun",
        meaning: "Bước đột phá quan trọng, phát minh mang tính bước ngoặt",
        basicEquivalent: "big discovery / success (Band 5)",
        synonyms: ["quantum leap", "milestone", "innovation", "triumph"],
        collocations: ["scientific breakthrough", "medical breakthroughs", "achieve a breakthrough"],
        modelSentence: "Groundbreaking medical breakthroughs have successfully doubled human life expectancy over the past century.",
        vietnameseSentence: "Những bước đột phá y học mang tính cách mạng đã giúp nhân đôi tuổi thọ con người trong thế kỷ qua."
      },
      {
        id: "sci-3",
        word: "altruism",
        ipa: "/ˈæl.tru.ɪ.zəm/",
        partOfSpeech: "noun",
        meaning: "Lòng vị tha, tôn chỉ hành động hoàn toàn vì hạnh phúc của nhân loại",
        basicEquivalent: "kindness / helping others (Band 5)",
        synonyms: ["benevolence", "selflessness", "philanthropy", "humanitarianism"],
        collocations: ["pure altruism", "scientific altruism", "foster social altruism"],
        modelSentence: "Research motivated by pure altruism ensures that lifesaving vaccines are distributed equitably without exorbitant pricing.",
        vietnameseSentence: "Nghiên cứu được thúc đẩy bởi lòng vị tha thuần khiết bảo đảm rằng các vắc-xin cứu người được phân phối công bằng mà không bị đội giá cắt cổ."
      },
      {
        id: "sci-4",
        word: "eradicate",
        ipa: "/ɪˈræd.ɪ.keɪt/",
        partOfSpeech: "verb",
        meaning: "Triệt tiêu hoàn toàn, xóa sổ tận gốc rễ dịch bệnh hoặc đói nghèo",
        basicEquivalent: "destroy completely / wipe out (Band 5)",
        synonyms: ["eliminate", "wipe out", "exterminate", "annihilate"],
        collocations: ["eradicate fatal diseases", "eradicate extreme poverty", "eradicate epidemics"],
        modelSentence: "Biotechnological advancements have enabled healthcare professionals to virtually eradicate smallpox and polio.",
        vietnameseSentence: "Những tiến bộ công nghệ sinh học đã giúp các chuyên gia y tế gần như xóa sổ hoàn toàn bệnh đậu mùa và bại liệt."
      },
      {
        id: "sci-5",
        word: "paradigm",
        ipa: "/ˈpær.ə.daɪm/",
        partOfSpeech: "noun",
        meaning: "Mô hình kiểu mẫu, hệ hình lý thuyết nền tảng chi phối nghiên cứu",
        basicEquivalent: "model / system of ideas (Band 5-6)",
        synonyms: ["framework", "archetype", "standard model", "benchmark"],
        collocations: ["paradigm shift", "scientific paradigm", "shift the paradigm"],
        modelSentence: "The transition to renewable clean energy represents a monumental paradigm shift in applied physics.",
        vietnameseSentence: "Sự chuyển dịch sang năng lượng sạch tái tạo đại diện cho một bước chuyển đổi hệ hình vĩ đại trong vật lý ứng dụng."
      },
      {
        id: "sci-6",
        word: "pragmatic",
        ipa: "/præɡˈmæt.ɪk/",
        partOfSpeech: "adjective",
        meaning: "Mang tính thực dụng thực tiễn, giải quyết trực tiếp khó khăn đời sống",
        basicEquivalent: "practical / realistic (Band 5)",
        synonyms: ["utilitarian", "hands-on", "functional", "realistic"],
        collocations: ["pragmatic approach", "pragmatic solutions", "pragmatic application"],
        modelSentence: "Governments should allocate substantial research grants to pragmatic projects that yield tangible daily conveniences.",
        vietnameseSentence: "Chính phủ nên phân bổ ngân sách nghiên cứu đáng kể cho các dự án mang tính thực tiễn đem lại tiện ích đời sống hữu hình."
      },
      {
        id: "sci-7",
        word: "imperative",
        ipa: "/ɪmˈper.ə.tɪv/",
        partOfSpeech: "noun",
        meaning: "Yêu cầu tối khẩn cấp, trách nhiệm đạo đức bắt buộc không thể trì hoãn",
        basicEquivalent: "urgent necessity (Band 5)",
        synonyms: ["moral requirement", "pressing necessity", "obligation"],
        collocations: ["ethical imperative", "moral imperative", "social imperative"],
        modelSentence: "Harnessing scientific innovation to safeguard the biosphere has evolved into an inescapable moral imperative.",
        vietnameseSentence: "Khai thác đổi mới khoa học để bảo vệ sinh quyển đã phát triển thành một mệnh lệnh đạo đức không thể thoái thác."
      },
      {
        id: "sci-8",
        word: "theoretical",
        ipa: "/θɪəˈret.ɪ.kəl/",
        partOfSpeech: "adjective",
        meaning: "Thuộc về lý thuyết trừu tượng, nghiên cứu hàn lâm chưa ứng dụng ngay",
        basicEquivalent: "not practical / based on ideas (Band 5)",
        synonyms: ["abstract", "speculative", "academic", "conceptual"],
        collocations: ["theoretical physics", "theoretical framework", "purely theoretical"],
        modelSentence: "While purely theoretical physics may seem abstract, it frequently establishes the foundational bedrock for future technologies.",
        vietnameseSentence: "Mặc dù vật lý lý thuyết thuần túy có vẻ trừu tượng, nó thường xuyên thiết lập nền tảng vững chắc cho các công nghệ tương lai."
      },
      {
        id: "sci-9",
        word: "commercialize",
        ipa: "/kəˈmɜː.ʃəl.aɪz/",
        partOfSpeech: "verb",
        meaning: "Thương mại hóa, biến phát minh trong phòng thí nghiệm thành hàng hóa bán ra thị trường",
        basicEquivalent: "sell to make money (Band 5)",
        synonyms: ["monetize", "marketize", "exploit commercially"],
        collocations: ["commercialize innovations", "commercialize scientific discoveries", "rush to commercialize"],
        modelSentence: "Pharmaceutical giants frequently commercialize lifesaving drugs at premiums that exclude vulnerable populations.",
        vietnameseSentence: "Các tập đoàn dược phẩm khổng lồ thường thương mại hóa thuốc cứu người với mức giá cao loại trừ những đối tượng yếu thế."
      },
      {
        id: "sci-10",
        word: "well-being",
        ipa: "/ˌwelˈbiː.ɪŋ/",
        partOfSpeech: "noun",
        meaning: "Trạng thái thịnh vượng an lành toàn diện cả thể chất lẫn tinh thần",
        basicEquivalent: "happiness and health (Band 5)",
        synonyms: ["welfare", "quality of life", "prosperity"],
        collocations: ["human well-being", "societal well-being", "promote public well-being"],
        modelSentence: "The ultimate triumph of modern civilization lies in advancing the general well-being of its citizenry.",
        vietnameseSentence: "Thắng lợi sau cùng của nền văn minh hiện đại nằm ở việc nâng cao phúc lợi an lành toàn diện của người dân."
      }
    ]
  },
  {
    id: "risk-taking-2022",
    name: "Risk-Taking & Personal Growth (Cam 17 Test 1)",
    vietnameseName: "Chấp nhận rủi ro & Bản lĩnh (Cam 17)",
    tag: "Cambridge 17",
    icon: "TrendingUp",
    ieltsPrompt: "It is important for people to take risks, both in their professional lives and their personal lives. Do you think the advantages of taking risks outweigh the disadvantages?",
    vocabularies: [
      {
        id: "risk-1",
        word: "calculated",
        ipa: "/ˈkæl.kjə.leɪ.tɪd/",
        partOfSpeech: "adjective",
        meaning: "Được toan tính cẩn trọng, cân nhắc kỹ lưỡng mọi rủi ro trước khi hành động",
        basicEquivalent: "carefully planned (Band 5)",
        synonyms: ["deliberate", "premeditated", "measured", "judicious"],
        collocations: ["take calculated risks", "calculated gamble", "calculated move"],
        modelSentence: "Embracing calculated risks enables ambitious professionals to discover untapped career opportunities.",
        vietnameseSentence: "Dám chấp nhận những rủi ro có toan tính cho phép các chuyên gia giàu tham vọng khám phá những cơ hội nghề nghiệp chưa được khai phá."
      },
      {
        id: "risk-2",
        word: "resilience",
        ipa: "/rɪˈzɪl.jəns/",
        partOfSpeech: "noun",
        meaning: "Bản lĩnh phục hồi, sức bật kiên cường vượt qua thất bại và nghịch cảnh",
        basicEquivalent: "ability to recover (Band 5)",
        synonyms: ["toughness", "fortitude", "perseverance", "elasticity"],
        collocations: ["build emotional resilience", "demonstrate resilience", "remarkable resilience"],
        modelSentence: "Encountering setbacks through adventurous ventures ultimately cultivates enduring psychological resilience.",
        vietnameseSentence: "Đối mặt với những vấp ngã qua những cuộc dấn thân phiêu lưu sau cùng hun đúc nên bản lĩnh phục hồi tâm lý bền bỉ."
      },
      {
        id: "risk-3",
        word: "stagnation",
        ipa: "/stæɡˈneɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Sự trì trệ, tình trạng giẫm chân tại chỗ do sợ hãi thay đổi",
        basicEquivalent: "staying the same / no progress (Band 5)",
        synonyms: ["inactivity", "sluggishness", "paralysis", "inertia"],
        collocations: ["career stagnation", "intellectual stagnation", "fall into stagnation"],
        modelSentence: "An excessive obsession with security often traps capable individuals in perpetual career stagnation.",
        vietnameseSentence: "Sự ám ảnh thái quá với cảm giác an toàn thường giam cầm những cá nhân có năng lực trong sự trì trệ sự nghiệp triền miên."
      },
      {
        id: "risk-4",
        word: "complacency",
        ipa: "/kəmˈpleɪ.sən.si/",
        partOfSpeech: "noun",
        meaning: "Sự tự mãn, thỏa hiệp trong vùng an toàn mà không chịu phấn đấu",
        basicEquivalent: "being too satisfied with yourself (Band 5)",
        synonyms: ["smugness", "self-satisfaction", "contentment"],
        collocations: ["breed complacency", "fall into complacency", "danger of complacency"],
        modelSentence: "Remaining indefinitely within one's comfort zone breeds complacency and stifles personal innovation.",
        vietnameseSentence: "Ở yên mãi mãi trong vùng an toàn của bản thân sẽ nuôi dưỡng sự tự mãn và bóp nghẹt sự đổi mới cá nhân."
      },
      {
        id: "risk-5",
        word: "entrepreneurial",
        ipa: "/ˌɒn.trə.prəˈnɜː.ri.əl/",
        partOfSpeech: "adjective",
        meaning: "Mang tinh thần khởi nghiệp, dám dấn thân chấp nhận thử thách mới",
        basicEquivalent: "business-minded / daring (Band 5)",
        synonyms: ["enterprising", "innovative", "audacious", "bold"],
        collocations: ["entrepreneurial spirit", "entrepreneurial venture", "foster entrepreneurial instincts"],
        modelSentence: "Modern market economies thrive on the audacious entrepreneurial spirit of risk-tolerant founders.",
        vietnameseSentence: "Các nền kinh tế thị trường hiện đại phát triển mạnh mẽ nhờ vào tinh thần khởi nghiệp táo bạo của những nhà sáng lập dám chấp nhận rủi ro."
      },
      {
        id: "risk-6",
        word: "precipitate",
        ipa: "/prɪˈsɪp.ɪ.teɪt/",
        partOfSpeech: "verb",
        meaning: "Thúc đẩy nhanh, châm ngòi cho sự biến chuyển hoặc cơ hội phát triển",
        basicEquivalent: "cause to happen quickly (Band 5)",
        synonyms: ["trigger", "accelerate", "instigate", "hasten"],
        collocations: ["precipitate rapid growth", "precipitate a breakthrough", "precipitate a crisis"],
        modelSentence: "Venturing into uncharted career domains can precipitate profound transformative personal growth.",
        vietnameseSentence: "Dấn thân vào những lĩnh vực nghề nghiệp hoàn toàn mới có thể thúc đẩy sự trưởng thành cá nhân mang tính bước ngoặt sâu sắc."
      },
      {
        id: "risk-7",
        word: "catalyst",
        ipa: "/ˈkæt.əl.ɪst/",
        partOfSpeech: "noun",
        meaning: "Chất xúc tác, yếu tố kích thích mạnh mẽ sự thay đổi tích cực",
        basicEquivalent: "spark / reason for change (Band 5)",
        synonyms: ["spark", "stimulus", "impetus", "springboard"],
        collocations: ["act as a catalyst", "catalyst for innovation", "powerful catalyst"],
        modelSentence: "Taking bold initiatives serves as an indispensable catalyst for breaking through professional plateaus.",
        vietnameseSentence: "Đưa ra những sáng kiến táo bạo đóng vai trò là chất xúc tác không thể thiếu để bứt phá qua các giới hạn sự nghiệp."
      },
      {
        id: "risk-8",
        word: "reckless",
        ipa: "/ˈrek.ləs/",
        partOfSpeech: "adjective",
        meaning: "Liều lĩnh mù quáng, hành động bồng bột bất chấp nguy cơ tàn khốc",
        basicEquivalent: "careless / dangerous (Band 5)",
        synonyms: ["foolhardy", "heedless", "rash", "imprudent"],
        collocations: ["reckless speculation", "reckless gamble", "reckless disregard"],
        modelSentence: "Blindly pursuing hazards without adequate preparation constitutes reckless behavior that threatens financial stability.",
        vietnameseSentence: "Mù quáng theo đuổi các nguy cơ mà không có sự chuẩn bị chu đáo cấu thành hành vi liều lĩnh đe dọa sự ổn định tài chính."
      },
      {
        id: "risk-9",
        word: "trepidation",
        ipa: "/ˌtrep.ɪˈdeɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Nỗi âu lo ngần ngại, tâm trạng thắc thỏm bất an trước cái mới",
        basicEquivalent: "fear / hesitation (Band 5)",
        synonyms: ["apprehension", "dread", "anxiety", "hesitancy"],
        collocations: ["overcome trepidation", "sense of trepidation", "without trepidation"],
        modelSentence: "Overcoming innate trepidation is the crucial prerequisite for unlocking extraordinary latent talents.",
        vietnameseSentence: "Vượt qua nỗi âu lo ngần ngại bẩm sinh là tiền đề tối quan trọng để khai phóng những tài năng tiềm ẩn phi thường."
      },
      {
        id: "risk-10",
        word: "prosper",
        ipa: "/ˈprɒs.pər/",
        partOfSpeech: "verb",
        meaning: "Phát triển thịnh vượng, gặt hái thành công và tiến bộ vượt bậc",
        basicEquivalent: "succeed / do very well (Band 5)",
        synonyms: ["thrive", "flourish", "burgeon", "boom"],
        collocations: ["prosper in uncertainty", "prosper and flourish", "continue to prosper"],
        modelSentence: "Those capable of navigating uncertainty with poise are most likely to prosper in competitive environments.",
        vietnameseSentence: "Những người có khả năng chèo lái qua sự bất định với tâm thế vững vàng là những người có nhiều khả năng phát triển thịnh vượng nhất trong môi trường cạnh tranh."
      }
    ]
  },
  {
    id: "career-mobility-2021",
    name: "Career Mobility & Job Tenure (Cam 16 Test 3)",
    vietnameseName: "Gắn bó trọn đời vs Nhảy việc (Cam 16)",
    tag: "Cambridge 16",
    icon: "Briefcase",
    ieltsPrompt: "Some people think that it is best to work for the same organization for one's whole life. Others think that it is better to change jobs frequently. Discuss both views and give your opinion.",
    vocabularies: [
      {
        id: "job-1",
        word: "tenure",
        ipa: "/ˈten.jʊər/",
        partOfSpeech: "noun",
        meaning: "Thâm niên công tác, thời gian phục vụ chính thức tại một tổ chức",
        basicEquivalent: "time spent at a job (Band 5)",
        synonyms: ["incumbency", "period of service", "seniority"],
        collocations: ["long tenure", "secure tenure", "throughout one's tenure"],
        modelSentence: "A prolonged tenure within a prestigious corporation typically commands profound respect and managerial trust.",
        vietnameseSentence: "Thâm niên công tác lâu năm trong một tập đoàn uy tín thường mang lại sự kính trọng sâu sắc và lòng tin của ban quản lý."
      },
      {
        id: "job-2",
        word: "job-hopping",
        ipa: "/ˈdʒɒbˌhɒp.ɪŋ/",
        partOfSpeech: "noun",
        meaning: "Hiện tượng chuyển đổi công việc thường xuyên để tìm kiếm cơ hội mới",
        basicEquivalent: "changing jobs often (Band 5)",
        synonyms: ["career mobility", "frequent job transition", "occupational fluidity"],
        collocations: ["habitual job-hopping", "stigma of job-hopping", "strategic job-hopping"],
        modelSentence: "Strategic job-hopping has become a recognized accelerator for competitive compensation and broader perspectives.",
        vietnameseSentence: "Nhảy việc có tính chiến lược đã trở thành một đòn bẩy được công nhận để gia tăng thu nhập và mở rộng góc nhìn."
      },
      {
        id: "job-3",
        word: "diversify",
        ipa: "/daɪˈvɜː.sɪ.faɪ/",
        partOfSpeech: "verb",
        meaning: "Đa dạng hóa bộ kỹ năng, kinh nghiệm chuyên môn và mạng lưới quan hệ",
        basicEquivalent: "make varied / learn new things (Band 5)",
        synonyms: ["broaden", "expand", "variegate", "branch out"],
        collocations: ["diversify one's skill set", "diversify career experiences", "diversify expertise"],
        modelSentence: "Switching employers enables professionals to continuously diversify their practical skill sets across distinct corporate cultures.",
        vietnameseSentence: "Chuyển đổi nơi làm việc cho phép người đi làm liên tục đa dạng hóa bộ kỹ năng thực chiến qua nhiều nền văn hóa doanh nghiệp khác nhau."
      },
      {
        id: "job-4",
        word: "adaptability",
        ipa: "/əˌdæp.təˈbɪl.ə.ti/",
        partOfSpeech: "noun",
        meaning: "Năng lực thích ứng linh hoạt trước những thay đổi và thách thức mới",
        basicEquivalent: "ability to change / adjust (Band 5)",
        synonyms: ["flexibility", "versatility", "resilience", "agility"],
        collocations: ["demonstrate adaptability", "career adaptability", "exceptional adaptability"],
        modelSentence: "Navigating diverse professional environments fosters acute adaptability essential in today's turbulent economic landscape.",
        vietnameseSentence: "Trải nghiệm qua nhiều môi trường làm việc khác nhau giúp rèn luyện khả năng thích ứng sắc bén, điều tối cần thiết trong bối cảnh kinh tế biến động ngày nay."
      },
      {
        id: "job-5",
        word: "attrition",
        ipa: "/əˈtrɪʃ.ən/",
        partOfSpeech: "noun",
        meaning: "Tỷ lệ hao hụt nhân sự do nhân viên nghỉ việc hoặc chuyển công ty",
        basicEquivalent: "staff leaving rate (Band 5)",
        synonyms: ["employee turnover", "staff reduction", "staff exodus"],
        collocations: ["high employee attrition", "rate of attrition", "reduce staff attrition"],
        modelSentence: "High rates of voluntary attrition impose substantial onboarding expenses and disrupt team coherence.",
        vietnameseSentence: "Tỷ lệ hao hụt nhân viên tự nguyện cao gây ra chi phí đào tạo hội nhập đáng kể và làm gián đoạn sự gắn kết của đội ngũ."
      },
      {
        id: "job-6",
        word: "advancement",
        ipa: "/ədˈvɑːns.mənt/",
        partOfSpeech: "noun",
        meaning: "Sự thăng tiến lên các nấc thang nghề nghiệp và vị trí lãnh đạo cao hơn",
        basicEquivalent: "getting promoted (Band 5)",
        synonyms: ["career progression", "promotion", "elevation", "upward mobility"],
        collocations: ["career advancement", "opportunities for advancement", "professional advancement"],
        modelSentence: "Ambitious employees frequently seek outside offers when internal avenues for career advancement become obstructed.",
        vietnameseSentence: "Những nhân viên giàu tham vọng thường tìm kiếm lời mời bên ngoài khi các con đường thăng tiến nội bộ bị tắc nghẽn."
      },
      {
        id: "job-7",
        word: "loyalty",
        ipa: "/ˈlɔɪ.əl.ti/",
        partOfSpeech: "noun",
        meaning: "Lòng trung thành và sự cống hiến gắn bó sắc son với cơ quan",
        basicEquivalent: "faithfulness / staying with company (Band 5)",
        synonyms: ["allegiance", "fidelity", "commitment", "devotion"],
        collocations: ["organizational loyalty", "unwavering loyalty", "reward employee loyalty"],
        modelSentence: "Fostering organizational loyalty yields a cohesive workforce that withstands external market volatility.",
        vietnameseSentence: "Nuôi dưỡng lòng trung thành với tổ chức tạo ra một lực lượng lao động gắn kết vững vàng vượt qua những biến động của thị trường bên ngoài."
      },
      {
        id: "job-8",
        word: "versatility",
        ipa: "/ˌvɜː.səˈtɪl.ə.ti/",
        partOfSpeech: "noun",
        meaning: "Tính linh hoạt đa năng, khả năng xử lý nhiều nghiệp vụ khác nhau",
        basicEquivalent: "ability to do many things (Band 5)",
        synonyms: ["resourcefulness", "multitasking ability", "all-round competence"],
        collocations: ["exceptional versatility", "professional versatility", "demand versatility"],
        modelSentence: "Exposure to varied industries equips seasoned consultants with invaluable cross-functional versatility.",
        vietnameseSentence: "Sự cọ xát với nhiều ngành nghề khác nhau trang bị cho các chuyên gia tư vấn kỳ cựu sự đa năng liên phòng ban vô giá."
      },
      {
        id: "job-9",
        word: "stagnate",
        ipa: "/stæɡˈneɪt/",
        partOfSpeech: "verb",
        meaning: "Bị trì trệ, cùn mòn tư duy và giẫm chân tại chỗ do làm việc lặp lại",
        basicEquivalent: "stop growing / stay still (Band 5)",
        synonyms: ["deteriorate", "languish", "plateau", "atrophy"],
        collocations: ["skills stagnate", "career begins to stagnate", "risk stagnating"],
        modelSentence: "Remaining in a comfortable yet unchallenging post for decades risks letting critical professional competencies stagnate.",
        vietnameseSentence: "Ở yên trong một vị trí êm ấm nhưng thiếu thử thách suốt hàng chục năm có nguy cơ khiến năng lực chuyên môn cốt lõi bị trì trệ."
      },
      {
        id: "job-10",
        word: "lucrative",
        ipa: "/ˈluː.krə.tɪv/",
        partOfSpeech: "adjective",
        meaning: "Mang lại nguồn thu nhập hậu hĩnh, lợi nhuận hoặc đãi ngộ tài chính cao",
        basicEquivalent: "paying a lot of money (Band 5)",
        synonyms: ["profitable", "rewarding", "well-paid", "remunerative"],
        collocations: ["lucrative remuneration", "lucrative career opportunities", "lucrative contract"],
        modelSentence: "Transitioning to booming technology sectors often unlocks lucrative compensation packages unavailable in legacy firms.",
        vietnameseSentence: "Chuyển sang các lĩnh vực công nghệ đang bùng nổ thường mở ra các gói đãi ngộ hậu hĩnh mà các công ty truyền thống không có được."
      }
    ]
  },
  {
    id: "housing-ownership-2020",
    name: "Home Ownership vs Renting (Cam 15 Test 1)",
    vietnameseName: "Sở hữu nhà riêng vs Thuê nhà (Cam 15)",
    tag: "Cambridge 15",
    icon: "Landmark",
    ieltsPrompt: "In some countries, owning a home rather than renting one is very important for people. Why might this be the case? Do you think this is a positive or negative situation?",
    vocabularies: [
      {
        id: "house-1",
        word: "mortgage",
        ipa: "/ˈmɔː.ɡɪdʒ/",
        partOfSpeech: "noun",
        meaning: "Khoản vay thế chấp mua nhà dài hạn từ ngân hàng",
        basicEquivalent: "bank loan to buy house (Band 5)",
        synonyms: ["property loan", "home loan", "secured debt"],
        collocations: ["take out a mortgage", "pay off the mortgage", "mortgage repayments"],
        modelSentence: "Securing a thirty-year mortgage allows young couples to transition from transient tenancy to permanent homeownership.",
        vietnameseSentence: "Vay một khoản thế chấp kỳ hạn 30 năm cho phép các cặp vợ chồng trẻ chuyển từ việc thuê nhà tạm bợ sang sở hữu nhà vĩnh viễn."
      },
      {
        id: "house-2",
        word: "equity",
        ipa: "/ˈek.wɪ.ti/",
        partOfSpeech: "noun",
        meaning: "Giá trị tài sản ròng tích lũy sau khi trừ đi dư nợ ngân hàng",
        basicEquivalent: "value of what you own (Band 5-6)",
        synonyms: ["net worth", "ownership value", "accumulated wealth"],
        collocations: ["build home equity", "accumulate equity", "equity value"],
        modelSentence: "Paying monthly mortgage installments systematically builds substantial financial equity over time.",
        vietnameseSentence: "Trả các khoản trả góp thế chấp hàng tháng giúp tích lũy một khối tài sản ròng đáng kể một cách có hệ thống theo thời gian."
      },
      {
        id: "house-3",
        word: "appreciate",
        ipa: "/əˈpriː.ʃi.eɪt/",
        partOfSpeech: "verb",
        meaning: "Tăng giá trị tài sản qua thời gian do sự phát triển kinh tế",
        basicEquivalent: "increase in price / value (Band 5)",
        synonyms: ["gain value", "escalate", "grow in worth"],
        collocations: ["appreciate in value", "property appreciates", "steadily appreciate"],
        modelSentence: "Real estate properties in prime metropolitan areas typically appreciate at rates exceeding standard inflation.",
        vietnameseSentence: "Bất động sản tại các vị trí đắc địa ở vùng đô thị thường tăng giá với tốc độ vượt xa mức lạm phát thông thường."
      },
      {
        id: "house-4",
        word: "unaffordable",
        ipa: "/ˌʌn.əˈfɔː.də.bəl/",
        partOfSpeech: "adjective",
        meaning: "Đắt đỏ phi lý vượt xa khả năng chi trả thu nhập của người dân",
        basicEquivalent: "too expensive to buy (Band 5)",
        synonyms: ["prohibitively expensive", "exorbitant", "unattainable", "priced out"],
        collocations: ["prohibitively unaffordable", "unaffordable housing", "render housing unaffordable"],
        modelSentence: "Runaway property price speculation has rendered urban housing prohibitively unaffordable for entry-level workers.",
        vietnameseSentence: "Sự đầu cơ giá nhà đất tràn lan đã khiến nhà ở đô thị trở nên đắt đỏ vượt quá khả năng chi trả của những người mới đi làm."
      },
      {
        id: "house-5",
        word: "mobility",
        ipa: "/məʊˈbɪl.ə.ti/",
        partOfSpeech: "noun",
        meaning: "Tính cơ động linh hoạt, khả năng dễ dàng chuyển nơi ở theo cơ hội việc làm",
        basicEquivalent: "ability to move easily (Band 5)",
        synonyms: ["geographic flexibility", "movement", "maneuverability"],
        collocations: ["geographic mobility", "labor mobility", "hamper geographic mobility"],
        modelSentence: "Renting affords professionals geographic mobility to relocate swiftly whenever lucrative career prospects emerge.",
        vietnameseSentence: "Thuê nhà mang lại cho giới chuyên môn sự cơ động về địa lý để nhanh chóng chuyển nơi ở bất cứ khi nào có cơ hội sự nghiệp hấp dẫn xuất hiện."
      },
      {
        id: "house-6",
        word: "speculation",
        ipa: "/ˌspek.jəˈleɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Hoạt động đầu cơ tài chính, mua đi bán lại để thổi giá kiếm lời",
        basicEquivalent: "buying to sell for profit (Band 5)",
        synonyms: ["profiteering", "gambling", "arbitrage"],
        collocations: ["property speculation", "curb real estate speculation", "rampant speculation"],
        modelSentence: "Rampant real estate speculation artificially distorts the housing market and deprives young families of shelter.",
        vietnameseSentence: "Nạn đầu cơ bất động sản tràn lan làm méo mó thị trường nhà ở một cách nhân tạo và tước đoạt chốn an cư của các gia đình trẻ."
      },
      {
        id: "house-7",
        word: "tenancy",
        ipa: "/ˈten.ən.si/",
        partOfSpeech: "noun",
        meaning: "Tình trạng đi thuê nhà, hợp đồng và thời hạn thuê mướn bất động sản",
        basicEquivalent: "renting a house (Band 5)",
        synonyms: ["leasehold", "rental agreement", "occupancy"],
        collocations: ["secure tenancy", "terms of tenancy", "prolonged tenancy"],
        modelSentence: "Unstable private tenancy agreements frequently subject vulnerable tenants to arbitrary evictions and sudden rent hikes.",
        vietnameseSentence: "Các hợp đồng thuê nhà tư nhân bấp bênh thường đẩy người thuê yếu thế vào nguy cơ bị đuổi bất ngờ và tăng giá thuê vô tội vạ."
      },
      {
        id: "house-8",
        word: "gentrification",
        ipa: "/ˌdʒen.trɪ.fɪˈkeɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Quá trình chỉnh trang nâng cấp đô thị đẩy bật tầng lớp lao động ra ngoài",
        basicEquivalent: "rebuilding that makes areas too expensive (Band 5-6)",
        synonyms: ["urban renewal", "neighborhood upscale", "urban transformation"],
        collocations: ["rapid gentrification", "consequences of gentrification", "spurred by gentrification"],
        modelSentence: "Rapid gentrification revitalizes deteriorating suburbs but inadvertently displaces historical working-class residents.",
        vietnameseSentence: "Sự chỉnh trang đô thị nhanh chóng làm hồi sinh các khu ngoại ô xuống cấp nhưng vô tình đẩy bật những cư dân lao động lâu năm đi nơi khác."
      },
      {
        id: "house-9",
        word: "stability",
        ipa: "/stəˈbɪl.ə.ti/",
        partOfSpeech: "noun",
        meaning: "Sự ổn định lâu dài, cảm giác an cư lạc nghiệp vững vàng",
        basicEquivalent: "safety / firmness / staying secure (Band 5)",
        synonyms: ["permanence", "security", "solidity", "steadiness"],
        collocations: ["residential stability", "emotional stability", "long-term stability"],
        modelSentence: "Securing a permanent home instills a profound sense of psychological stability and civic belonging.",
        vietnameseSentence: "Có được một ngôi nhà cố định hun đúc nên cảm giác ổn định tâm lý sâu sắc và sự gắn kết công dân với địa phương."
      },
      {
        id: "house-10",
        word: "asset",
        ipa: "/ˈæs.et/",
        partOfSpeech: "noun",
        meaning: "Khối tài sản có giá trị kinh tế tích lũy bảo hộ trước rủi ro",
        basicEquivalent: "valuable possession (Band 5)",
        synonyms: ["tangible holding", "wealth", "resource", "investment"],
        collocations: ["tangible asset", "appreciating asset", "valuable financial asset"],
        modelSentence: "A residential dwelling represents the single most valuable tangible asset in an average family's investment portfolio.",
        vietnameseSentence: "Một ngôi nhà ở đại diện cho tài sản hữu hình có giá trị nhất trong danh mục đầu tư của một gia đình trung lưu."
      }
    ]
  },
  {
    id: "adversity-betterment-2019",
    name: "Adversity: Acceptance vs Betterment (Cam 14 Test 1)",
    vietnameseName: "Nghịch cảnh: Cam chịu vs Vươn lên (Cam 14)",
    tag: "Cambridge 14",
    icon: "ShieldAlert",
    ieltsPrompt: "Some people believe that it is best to accept a bad situation, such as an unsatisfactory job or shortage of money. Others argue that it is better to try and improve such situations. Discuss both these views and give your own opinion.",
    vocabularies: [
      {
        id: "adv-1",
        word: "fatalism",
        ipa: "/ˈfeɪ.təl.ɪ.zəm/",
        partOfSpeech: "noun",
        meaning: "Thuyết định mệnh, tâm lý cam chịu bất lực trước số phận nghiệt ngã",
        basicEquivalent: "giving up to fate (Band 5)",
        synonyms: ["defeatism", "passivity", "predeterminism", "resignation"],
        collocations: ["succumb to fatalism", "paralyzing fatalism", "passive fatalism"],
        modelSentence: "Succumbing to passive fatalism blinds impoverished communities to viable avenues of upward socioeconomic mobility.",
        vietnameseSentence: "Quy phục trước thuyết định mệnh thụ động làm mờ mắt các cộng đồng nghèo khó trước những con đường vươn lên trong xã hội."
      },
      {
        id: "adv-2",
        word: "resignation",
        ipa: "/ˌrez.ɪɡˈneɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Sự buông xuôi, thái độ phục tùng chấp nhận hoàn cảnh cay đắng",
        basicEquivalent: "accepting bad things sadly (Band 5)",
        synonyms: ["surrender", "submission", "acquiescence", "compliance"],
        collocations: ["sense of quiet resignation", "accept with resignation", "attitude of resignation"],
        modelSentence: "Enduring an unfulfilling job with quiet resignation inevitably drains personal ambition and vitality.",
        vietnameseSentence: "Cam chịu một công việc bất toại nguyện trong sự buông xuôi lặng lẽ tất yếu sẽ bào mòn tham vọng và sức sống cá nhân."
      },
      {
        id: "adv-3",
        word: "ameliorate",
        ipa: "/əˈmiːl.jə.reɪt/",
        partOfSpeech: "verb",
        meaning: "Cải thiện, tích cực hành động để làm dịu bớt khó khăn thiếu thốn",
        basicEquivalent: "make better / improve (Band 5)",
        synonyms: ["enhance", "upgrade", "relieve", "rectify"],
        collocations: ["ameliorate hardship", "ameliorate one's financial plight", "seek to ameliorate"],
        modelSentence: "Proactive workers constantly upskill in order to ameliorate their precarious economic circumstances.",
        vietnameseSentence: "Những người lao động chủ động luôn không ngừng nâng cao kỹ năng để cải thiện hoàn cảnh kinh tế bấp bênh của mình."
      },
      {
        id: "adv-4",
        word: "adversity",
        ipa: "/ədˈvɜː.sə.ti/",
        partOfSpeech: "noun",
        meaning: "Nghịch cảnh, hoàn cảnh khó khăn thử thách bản lĩnh con người",
        basicEquivalent: "hard times / difficulty (Band 5)",
        synonyms: ["hardship", "tribulation", "misfortune", "predicament"],
        collocations: ["overcome severe adversity", "face adversity", "triumph over adversity"],
        modelSentence: "Triumphing over acute financial adversity serves as the ultimate crucible for building character.",
        vietnameseSentence: "Chiến thắng nghịch cảnh tài chính khắc nghiệt đóng vai trò là lò lửa tôi luyện nhân cách con người."
      },
      {
        id: "adv-5",
        word: "proactive",
        ipa: "/prəʊˈæk.tɪv/",
        partOfSpeech: "adjective",
        meaning: "Mang tính chủ động, tự mình hành động kiểm soát tình thế thay vì chờ đợi",
        basicEquivalent: "taking action early (Band 5)",
        synonyms: ["enterprising", "forward-looking", "initiating", "driven"],
        collocations: ["proactive approach", "take proactive measures", "proactive problem solver"],
        modelSentence: "Adopting a proactive approach empowers individuals to transform professional setbacks into competitive advantages.",
        vietnameseSentence: "Áp dụng phương pháp tiếp cận chủ động trao quyền cho các cá nhân biến những vấp ngã nghề nghiệp thành lợi thế cạnh tranh."
      },
      {
        id: "adv-6",
        word: "complacency",
        ipa: "/kəmˈpleɪ.sən.si/",
        partOfSpeech: "noun",
        meaning: "Sự tự mãn, bằng lòng an phận trong sự thiếu thốn bất toàn",
        basicEquivalent: "being too satisfied with poor status (Band 5)",
        synonyms: ["smugness", "passivity", "stagnant contentment"],
        collocations: ["fall into complacency", "danger of complacency", "breed complacency"],
        modelSentence: "Mistaking coping mechanisms for permanent satisfaction risks trapping capable workers in chronic complacency.",
        vietnameseSentence: "Nhầm lẫn cơ chế chống đỡ tâm lý với sự thỏa mãn lâu dài có nguy cơ giam cầm những người lao động có năng lực trong sự an phận mãn tính."
      },
      {
        id: "adv-7",
        word: "perseverance",
        ipa: "/ˌpɜː.sɪˈvɪə.rəns/",
        partOfSpeech: "noun",
        meaning: "Lòng kiên trì bền bỉ, sự nhẫn nại vượt qua mọi chông gai thử thách",
        basicEquivalent: "keeping going / never giving up (Band 5)",
        synonyms: ["persistence", "tenacity", "doggedness", "resolve"],
        collocations: ["unwavering perseverance", "demonstrate perseverance", "reward perseverance"],
        modelSentence: "Unyielding perseverance remains the indispensable prerequisite for escaping generational poverty traps.",
        vietnameseSentence: "Lòng kiên trì bất khuất vẫn là tiền đề không thể thiếu để thoát khỏi những chiếc bẫy nghèo đói mang tính thế hệ."
      },
      {
        id: "adv-8",
        word: "stagnate",
        ipa: "/stæɡˈneɪt/",
        partOfSpeech: "verb",
        meaning: "Bị trì trệ, chôn chân đứng yên một chỗ do không chịu hành động",
        basicEquivalent: "stop growing / stay still (Band 5)",
        synonyms: ["languish", "deteriorate", "fossilize", "atrophy"],
        collocations: ["allow life to stagnate", "wages stagnate", "career begins to stagnate"],
        modelSentence: "Those who passively resign themselves to mediocre employment will inevitably watch their skills stagnate.",
        vietnameseSentence: "Những người thụ động buông xuôi chấp nhận công việc tầm thường sẽ tất yếu chứng kiến các kỹ năng của mình bị trì trệ."
      },
      {
        id: "adv-9",
        word: "transformative",
        ipa: "/trænsˈfɔː.mə.tɪv/",
        partOfSpeech: "adjective",
        meaning: "Mang tính chuyển biến sâu sắc, tạo nên bước ngoặt thay đổi cuộc đời",
        basicEquivalent: "life-changing (Band 5)",
        synonyms: ["revolutionary", "groundbreaking", "metamorphic", "epoch-making"],
        collocations: ["transformative experience", "transformative impact", "catalyze transformative change"],
        modelSentence: "Refusing to accept substandard conditions frequently catalyzes transformative breakthroughs in personal careers.",
        vietnameseSentence: "Từ chối chấp nhận những điều kiện dưới chuẩn thường châm ngòi cho những bước đột phá thay đổi cuộc đời trong sự nghiệp cá nhân."
      },
      {
        id: "adv-10",
        word: "grit",
        ipa: "/ɡrɪt/",
        partOfSpeech: "noun",
        meaning: "Bản lĩnh kiên định, sự bền bỉ sắt đá theo đuổi mục tiêu dài hạn",
        basicEquivalent: "mental toughness / bravery (Band 5)",
        synonyms: ["fortitude", "backbone", "indomitable spirit", "stamina"],
        collocations: ["sheer grit", "display remarkable grit", "grit and determination"],
        modelSentence: "True socioeconomic ascent is forged not by passive endurance, but by sheer grit and disciplined daily toil.",
        vietnameseSentence: "Sự thăng tiến kinh tế xã hội thực sự không được tạo dựng bằng sự cam chịu thụ động, mà bằng bản lĩnh kiên định và sự lao động kỷ luật mỗi ngày."
      }
    ]
  },
  {
    id: "language-barrier-2018",
    name: "Language Barriers & Cultural Assimilation (Cam 13 Test 1)",
    vietnameseName: "Rào cản ngôn ngữ & Định cư (Cam 13)",
    tag: "Cambridge 13",
    icon: "Globe",
    ieltsPrompt: "Living in a country where you have to speak a foreign language can cause serious social problems, as well as practical problems. To what extent do you agree or disagree with this statement?",
    vocabularies: [
      {
        id: "lang-1",
        word: "assimilation",
        ipa: "/əˌsɪm.ɪˈleɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Sự hòa nhập, quá trình đồng hóa văn hóa vào xã hội bản địa",
        basicEquivalent: "fitting into a new culture (Band 5)",
        synonyms: ["integration", "acculturation", "adaptation", "inclusion"],
        collocations: ["cultural assimilation", "linguistic assimilation", "impede assimilation"],
        modelSentence: "Inadequate command of the host tongue severely impedes cultural assimilation and civic involvement.",
        vietnameseSentence: "Vốn ngoại ngữ bản xứ không đầy đủ cản trở nghiêm trọng quá trình hòa nhập văn hóa và sự tham gia công dân."
      },
      {
        id: "lang-2",
        word: "linguistic",
        ipa: "/lɪŋˈɡwɪs.tɪk/",
        partOfSpeech: "adjective",
        meaning: "Thuộc về ngôn ngữ, các yếu tố ngữ âm và giao tiếp bằng lời",
        basicEquivalent: "language-related (Band 5)",
        synonyms: ["verbal", "lingual", "semantic", "idiomatic"],
        collocations: ["linguistic barrier", "linguistic proficiency", "linguistic competence"],
        modelSentence: "Confronting persistent linguistic barriers heightens anxiety during mundane bureaucratic interactions.",
        vietnameseSentence: "Đối mặt với những rào cản ngôn ngữ dai dẳng làm gia tăng sự lo lắng trong các giao dịch thủ tục hành chính thường nhật."
      },
      {
        id: "lang-3",
        word: "alienation",
        ipa: "/ˌeɪ.li.əˈneɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Cảm giác xa lánh, tình trạng cô lập tâm lý khỏi cộng đồng xung quanh",
        basicEquivalent: "feeling left out / alone (Band 5)",
        synonyms: ["isolation", "estrangement", "detachment", "disaffection"],
        collocations: ["social alienation", "sense of alienation", "prevent alienation"],
        modelSentence: "Inability to engage in casual neighborhood conversations readily breeds intense feelings of social alienation.",
        vietnameseSentence: "Việc không thể tham gia vào các cuộc trò chuyện thân tình với hàng xóm rất dễ nuôi dưỡng cảm giác xa lánh xã hội gay gắt."
      },
      {
        id: "lang-4",
        word: "miscommunication",
        ipa: "/ˌmɪs.kəˌmjuː.nɪˈkeɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Sự hiểu lầm, đứt gãy thông điệp dẫn đến mâu thuẫn trong đời sống",
        basicEquivalent: "misunderstanding (Band 5)",
        synonyms: ["misunderstanding", "misinterpretation", "cross-purposes"],
        collocations: ["frequent miscommunication", "cause miscommunication", "avoid miscommunication"],
        modelSentence: "Chronic miscommunication in healthcare facilities can precipitate catastrophic medical diagnoses.",
        vietnameseSentence: "Sự hiểu lầm giao tiếp kéo dài tại các cơ sở y tế có thể dẫn đến những chẩn đoán y khoa tai hại khôn lường."
      },
      {
        id: "lang-5",
        word: "proficiency",
        ipa: "/prəˈfɪʃ.ən.si/",
        partOfSpeech: "noun",
        meaning: "Sự thành thạo, trình độ điêu luyện và lưu loát trong việc sử dụng ngôn ngữ",
        basicEquivalent: "skill / fluency (Band 5)",
        synonyms: ["fluency", "competence", "mastery", "expertise"],
        collocations: ["language proficiency", "demonstrate proficiency", "attain proficiency"],
        modelSentence: "Attaining professional language proficiency is the foremost catalyst for securing gainful employment abroad.",
        vietnameseSentence: "Đạt được trình độ ngôn ngữ chuyên nghiệp là chất xúc tác hàng đầu để có được việc làm xứng đáng ở nước ngoài."
      },
      {
        id: "lang-6",
        word: "friction",
        ipa: "/ˈfrɪk.ʃən/",
        partOfSpeech: "noun",
        meaning: "Sự va chạm ma sát, mâu thuẫn xã hội phát sinh do bất đồng văn hóa",
        basicEquivalent: "conflict / disagreement (Band 5)",
        synonyms: ["conflict", "discord", "tension", "antagonism"],
        collocations: ["social friction", "cause friction", "minimize friction"],
        modelSentence: "Mutual incomprehension between native residents and migrant enclaves frequently engenders avoidable social friction.",
        vietnameseSentence: "Sự bất khả thông hiểu lẫn nhau giữa cư dân bản địa và các cộng đồng di dân thường sinh ra những va chạm xã hội đáng tiếc."
      },
      {
        id: "lang-7",
        word: "acculturate",
        ipa: "/əˈkʌl.tʃə.reɪt/",
        partOfSpeech: "verb",
        meaning: "Tiếp biến văn hóa, học hỏi và thích nghi dần với phong tục tập quán sở tại",
        basicEquivalent: "learn local culture (Band 5)",
        synonyms: ["adapt culturally", "conform", "integrate"],
        collocations: ["acculturate into society", "help immigrants acculturate", "slowly acculturate"],
        modelSentence: "Government-subsidized immersion courses help newly arrived refugees acculturate into host communities smoothly.",
        vietnameseSentence: "Các khóa học hòa nhập được chính phủ trợ cấp giúp người tị nạn mới đến tiếp biến văn hóa vào cộng đồng sở tại một cách êm thấm."
      },
      {
        id: "lang-8",
        word: "marginalize",
        ipa: "/ˈmɑː.dʒɪ.nəl.aɪz/",
        partOfSpeech: "verb",
        meaning: "Đẩy ra bên lề, cô lập hóa khiến một nhóm người bị tước đoạt quyền lợi",
        basicEquivalent: "push away / make powerless (Band 5)",
        synonyms: ["isolate", "disenfranchise", "exclude", "sidelined"],
        collocations: ["marginalize immigrant workers", "risk being marginalized", "marginalized groups"],
        modelSentence: "Immigrants who lack foreign language fluency risk being permanently marginalized in low-wage gig economies.",
        vietnameseSentence: "Những người nhập cư thiếu khả năng ngoại ngữ lưu loát có nguy cơ bị vĩnh viễn đẩy ra bên lề trong các nền kinh tế thời vụ lương thấp."
      },
      {
        id: "lang-9",
        word: "bilingual",
        ipa: "/baɪˈlɪŋ.ɡwəl/",
        partOfSpeech: "adjective",
        meaning: "Năng lực song ngữ, sử dụng lưu loát hai ngôn ngữ trong đời sống và học thuật",
        basicEquivalent: "speaking two languages (Band 5)",
        synonyms: ["dual-language", "polyglot"],
        collocations: ["bilingual workforce", "bilingual education", "become fully bilingual"],
        modelSentence: "Cultivating a versatile bilingual workforce strengthens national trade diplomacy across globalized markets.",
        vietnameseSentence: "Xây dựng lực lượng lao động song ngữ linh hoạt giúp tăng cường ngoại giao thương mại quốc gia trên các thị trường toàn cầu hóa."
      },
      {
        id: "lang-10",
        word: "cohesion",
        ipa: "/kəʊˈhiː.ʒən/",
        partOfSpeech: "noun",
        meaning: "Sự gắn kết xã hội, tính keo sơn đoàn kết giữa người bản xứ và người nhập cư",
        basicEquivalent: "unity / staying together (Band 5)",
        synonyms: ["social solidarity", "harmony", "connectedness"],
        collocations: ["foster social cohesion", "community cohesion", "threat to cohesion"],
        modelSentence: "Effective bilingual public signage and community language classes foster inclusive social cohesion.",
        vietnameseSentence: "Biển chỉ dẫn công cộng song ngữ hiệu quả và các lớp ngôn ngữ cộng đồng giúp thúc đẩy sự gắn kết xã hội bao trùm."
      }
    ]
  },
  {
    id: "youth-demographics-2017",
    name: "Youth Population & Economic Growth (Cam 12 Test 5)",
    vietnameseName: "Cơ cấu dân số trẻ (Cam 12)",
    tag: "Cambridge 12",
    icon: "Users",
    ieltsPrompt: "At the present time, the population of some countries includes a relatively large number of young people, compared with the number of older people. Do the advantages of this situation outweigh the disadvantages?",
    vocabularies: [
      {
        id: "dem-1",
        word: "demographic",
        ipa: "/ˌdem.əˈɡræf.ɪk/",
        partOfSpeech: "noun / adjective",
        meaning: "Thuộc về nhân khẩu học hoặc nhóm dân số thống kê",
        basicEquivalent: "population group / structure (Band 5)",
        synonyms: ["population group", "socio-demographic profile"],
        collocations: ["demographic dividend", "demographic transition", "favorable demographic"],
        modelSentence: "A burgeoning demographic of energetic youths represents immense potential for economic takeoff.",
        vietnameseSentence: "Nhóm nhân khẩu học thanh niên đang phát triển mạnh mẽ đại diện cho tiềm năng to lớn cho sự cất cánh kinh tế."
      },
      {
        id: "dem-2",
        word: "dividend",
        ipa: "/ˈdɪv.ɪ.dend/",
        partOfSpeech: "noun",
        meaning: "Lợi tức nhân khẩu học, lợi ích kinh tế thu được từ cơ cấu dân số",
        basicEquivalent: "economic benefit / bonus (Band 5-6)",
        synonyms: ["economic windfall", "demographic bonus", "gain"],
        collocations: ["demographic dividend", "reap dividends", "long-term dividend"],
        modelSentence: "Developing countries can reap a demographic dividend only if they invest vigorously in vocational education.",
        vietnameseSentence: "Các nước đang phát triển chỉ có thể gặt hái lợi tức nhân khẩu học nếu đầu tư mạnh mẽ vào giáo dục nghề nghiệp."
      },
      {
        id: "dem-3",
        word: "fertility",
        ipa: "/fəˈtɪl.ə.ti/",
        partOfSpeech: "noun",
        meaning: "Mức sinh, tỷ lệ sinh sản trong một cộng đồng dân cư",
        basicEquivalent: "birth rate (Band 5)",
        synonyms: ["birth rate", "fecundity"],
        collocations: ["fertility rate", "declining fertility", "high fertility"],
        modelSentence: "Sustained high fertility rates guarantee an expanding labor pool but impose immense strain on local primary schools.",
        vietnameseSentence: "Mức sinh duy trì ở mức cao đảm bảo nguồn cung lao động mở rộng nhưng gây áp lực to lớn lên các trường tiểu học địa phương."
      },
      {
        id: "dem-4",
        word: "workforce",
        ipa: "/ˈwɜːk.fɔːs/",
        partOfSpeech: "noun",
        meaning: "Lực lượng lao động sẵn có trong nền kinh tế",
        basicEquivalent: "workers / labor (Band 5)",
        synonyms: ["labor force", "working population", "human resources"],
        collocations: ["enter the workforce", "skilled workforce", "youth workforce"],
        modelSentence: "A youthful workforce injects vitality into labor-intensive manufacturing sectors and technological startups.",
        vietnameseSentence: "Lực lượng lao động trẻ tuổi tiếp thêm sinh khí cho các ngành sản xuất thâm dụng lao động và các công ty công nghệ khởi nghiệp."
      },
      {
        id: "dem-5",
        word: "dependency",
        ipa: "/dɪˈpen.dən.si/",
        partOfSpeech: "noun",
        meaning: "Tỷ lệ phụ thuộc kinh tế (tỷ lệ người không đi làm so với người trong độ tuổi lao động)",
        basicEquivalent: "reliance on others (Band 5)",
        synonyms: ["reliance", "dependent ratio"],
        collocations: ["dependency ratio", "economic dependency", "reduce dependency"],
        modelSentence: "A low dependency ratio allows national governments to channel fiscal reserves into innovation rather than elder care.",
        vietnameseSentence: "Tỷ lệ phụ thuộc thấp cho phép các chính phủ chuyển dự trữ tài khóa sang đổi mới sáng tạo thay vì chăm sóc người già."
      },
      {
        id: "dem-6",
        word: "underemployment",
        ipa: "/ˌʌn.ɪmˈplɔɪ.mənt/",
        partOfSpeech: "noun",
        meaning: "Tình trạng thiếu việc làm hoặc làm công việc dưới mức trình độ đào tạo",
        basicEquivalent: "not having enough work (Band 5)",
        synonyms: ["sub-employment", "job inadequacy"],
        collocations: ["youth underemployment", "widespread underemployment", "curb underemployment"],
        modelSentence: "Widespread graduate underemployment can easily breed socio-political unrest and disillusionment among young citizens.",
        vietnameseSentence: "Tình trạng cử nhân thiếu việc làm tràn lan có thể dễ dàng gây ra bất ổn chính trị-xã hội và sự vỡ mộng trong giới trẻ."
      },
      {
        id: "dem-7",
        word: "harness",
        ipa: "/ˈhɑː.nəs/",
        partOfSpeech: "verb",
        meaning: "Khai thác triệt để và định hướng tiềm năng vào mục đích hữu ích",
        basicEquivalent: "use / utilize (Band 5-6)",
        synonyms: ["leverage", "utilize", "tap into", "exploit"],
        collocations: ["harness the potential", "harness youth energy", "harness demographic trends"],
        modelSentence: "National planners must build modern digital infrastructure to harness the productive capacity of the new generation.",
        vietnameseSentence: "Các nhà hoạch định quốc gia phải xây dựng hạ tầng kỹ thuật số hiện đại để khai thác tối đa năng lực sản xuất của thế hệ mới."
      },
      {
        id: "dem-8",
        word: "unprecedented",
        ipa: "/ʌnˈpres.ɪ.den.tɪd/",
        partOfSpeech: "adjective",
        meaning: "Chưa từng có tiền lệ trong lịch sử",
        basicEquivalent: "never seen before (Band 5)",
        synonyms: ["unparalleled", "novel", "groundbreaking"],
        collocations: ["unprecedented influx", "unprecedented growth", "unprecedented scale"],
        modelSentence: "An unprecedented influx of young jobseekers may overwhelm urban employment markets if economic growth stagnates.",
        vietnameseSentence: "Dòng người tìm việc trẻ tuổi chưa từng có tiền lệ có thể làm quá tải thị trường việc làm đô thị nếu tăng trưởng kinh tế đình trệ."
      },
      {
        id: "dem-9",
        word: "dynamism",
        ipa: "/ˈdaɪ.nə.mɪ.zəm/",
        partOfSpeech: "noun",
        meaning: "Tính năng động, sự sôi nổi và khả năng thích ứng cao",
        basicEquivalent: "energy and activity (Band 5)",
        synonyms: ["vitality", "vigor", "agility", "resourcefulness"],
        collocations: ["economic dynamism", "youth dynamism", "entrepreneurial dynamism"],
        modelSentence: "The entrepreneurial dynamism of youth fosters disruptive digital innovations and flourishing small businesses.",
        vietnameseSentence: "Tính năng động khởi nghiệp của giới trẻ thúc đẩy các sáng tạo kỹ thuật số đột phá và các doanh nghiệp nhỏ phát đạt."
      },
      {
        id: "dem-10",
        word: "sustainable",
        ipa: "/səˈsteɪ.nə.bəl/",
        partOfSpeech: "adjective",
        meaning: "Bền vững, có thể duy trì lâu dài mà không gây kiệt quệ tài nguyên",
        basicEquivalent: "lasting / can continue (Band 5)",
        synonyms: ["viable", "durable", "long-lasting"],
        collocations: ["sustainable economic growth", "sustainable development", "sustainable demographic trajectory"],
        modelSentence: "Equipping young minds with green and technical competencies ensures long-term sustainable economic prosperity.",
        vietnameseSentence: "Trang bị cho thế hệ trẻ năng lực kỹ thuật và kỹ năng xanh sẽ bảo đảm sự thịnh vượng kinh tế bền vững lâu dài."
      }
    ]
  },
  {
    id: "heritage-restoration-2016",
    name: "Historic Buildings & Urban Regeneration (Cam 11 Test 3)",
    vietnameseName: "Trùng tu di sản kiến trúc & Quy hoạch đô thị (Cam 11)",
    tag: "Cambridge 11",
    icon: "Landmark",
    ieltsPrompt: "The restoration of old buildings in major cities throughout the world involves enormous expenditure. This money would bring more benefits if it was used to provide new housing and road development. To what extent do you agree or disagree?",
    vocabularies: [
      {
        id: "her-1",
        word: "restoration",
        ipa: "/ˌres.təˈreɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Sự phục hồi, trùng tu công trình lịch sử về trạng thái ban đầu",
        basicEquivalent: "repairing / fixing old things (Band 5)",
        synonyms: ["refurbishment", "renovation", "rehabilitation", "conservation"],
        collocations: ["historic restoration", "architectural restoration", "undergo extensive restoration"],
        modelSentence: "The meticulous restoration of medieval cathedrals demands astronomical financial investments and specialized craftsmanship.",
        vietnameseSentence: "Việc trùng tu tỉ mỉ các nhà thờ thời trung cổ đòi hỏi nguồn vốn đầu tư khổng lồ và tay nghề thủ công bậc thầy."
      },
      {
        id: "her-2",
        word: "architectural",
        ipa: "/ˌɑː.kɪˈtek.tʃər.əl/",
        partOfSpeech: "adjective",
        meaning: "Thuộc về kiến trúc, liên quan đến nghệ thuật thiết kế và xây dựng công trình",
        basicEquivalent: "building design (Band 5)",
        synonyms: ["structural", "constructive", "design-related"],
        collocations: ["architectural heritage", "architectural landmark", "architectural integrity"],
        modelSentence: "Demolishing colonial façades strips metropolitan centers of their distinct architectural character.",
        vietnameseSentence: "Việc phá bỏ các mặt tiền thời thuộc địa làm tước đi nét đặc trưng kiến trúc độc đáo của các trung tâm đô thị."
      },
      {
        id: "her-3",
        word: "dilapidated",
        ipa: "/dɪˈlæp.ɪ.deɪ.tɪd/",
        partOfSpeech: "adjective",
        meaning: "Xuống cấp, đổ nát do tuổi thọ và sự thiếu vắng bảo trì qua thời gian",
        basicEquivalent: "broken down / very old (Band 5)",
        synonyms: ["ramshackle", "derelict", "crumbling", "decrepit"],
        collocations: ["dilapidated state", "dilapidated historic mansions", "dilapidated structures"],
        modelSentence: "Allowing heritage landmarks to languish in a dilapidated state poses hazards to passersby and diminishes civic pride.",
        vietnameseSentence: "Để các danh thắng di sản nằm trong tình trạng đổ nát gây nguy hiểm cho người đi đường và làm giảm sút lòng tự hào dân tộc."
      },
      {
        id: "her-4",
        word: "expenditure",
        ipa: "/ɪkˈspen.dɪ.tʃər/",
        partOfSpeech: "noun",
        meaning: "Mức chi tiêu, tổng số tiền hoặc ngân sách công được giải ngân",
        basicEquivalent: "spending / money spent (Band 5)",
        synonyms: ["outlay", "disbursement", "fiscal spending"],
        collocations: ["enormous expenditure", "public expenditure", "curtail expenditure"],
        modelSentence: "Critics argue that exorbitant expenditure on antique façades could be better redirected into affordable public housing.",
        vietnameseSentence: "Những người chỉ trích cho rằng việc chi tiêu quá mức vào các mặt tiền cổ kính nên được tái phân bổ vào nhà ở xã hội giá rẻ."
      },
      {
        id: "her-5",
        word: "gentrification",
        ipa: "/ˌdʒen.trɪ.fɪˈkeɪ.ʃən/",
        partOfSpeech: "noun",
        meaning: "Sự chỉnh trang đô thị, quá trình nâng cấp khu phố cổ làm tăng giá trị bất động sản",
        basicEquivalent: "making areas fancy (Band 5-6)",
        synonyms: ["urban renewal", "neighborhood upgrading", "bourgeoisification"],
        collocations: ["urban gentrification", "catalyst for gentrification", "resist gentrification"],
        modelSentence: "While restoration spurs economic revitalization, unchecked gentrification frequently prices out vulnerable legacy residents.",
        vietnameseSentence: "Dù công tác trùng tu thúc đẩy hồi sinh kinh tế, sự chỉnh trang đô thị mất kiểm soát thường đẩy những cư dân bản địa lâu năm ra ngoài vì giá cả đắt đỏ."
      },
      {
        id: "her-6",
        word: "obsolete",
        ipa: "/ˌɒb.səˈliːt/",
        partOfSpeech: "adjective",
        meaning: "Lỗi thời, không còn phù hợp với công năng và chuẩn mực kỹ thuật hiện đại",
        basicEquivalent: "outdated / no longer useful (Band 5)",
        synonyms: ["outmoded", "antiquated", "anachronistic", "archaic"],
        collocations: ["obsolete infrastructure", "render obsolete", "obsolete plumbing"],
        modelSentence: "Antique mansions often feature obsolete electrical wiring and inadequate insulation for contemporary living standards.",
        vietnameseSentence: "Các dinh thự cổ thường có hệ thống dây điện lỗi thời và khả năng cách nhiệt không đáp ứng tiêu chuẩn sống hiện đại."
      },
      {
        id: "her-7",
        word: "redevelopment",
        ipa: "/ˌriː.dɪˈvel.əp.mənt/",
        partOfSpeech: "noun",
        meaning: "Sự tái phát triển đô thị, quy hoạch xây dựng mới trên nền khu vực cũ",
        basicEquivalent: "building new things in old areas (Band 5)",
        synonyms: ["urban regeneration", "renewal", "restructuring"],
        collocations: ["urban redevelopment", "redevelopment scheme", "commercial redevelopment"],
        modelSentence: "Comprehensive urban redevelopment projects must striking an equilibrium between road widening and conservation.",
        vietnameseSentence: "Các dự án tái phát triển đô thị toàn diện phải tìm được điểm cân bằng giữa việc mở rộng lòng đường và bảo tồn di sản."
      },
      {
        id: "her-8",
        word: "tangible",
        ipa: "/ˈtæn.dʒə.bəl/",
        partOfSpeech: "adjective",
        meaning: "Hữu hình, có thể nhìn thấy, chạm vào và cảm nhận rõ rệt",
        basicEquivalent: "real / clear to see (Band 5)",
        synonyms: ["palpable", "concrete", "material", "perceptible"],
        collocations: ["tangible heritage", "tangible benefits", "tangible link to history"],
        modelSentence: "Historic edifices serve as tangible reminders of ancestors' architectural ingenuity and historical triumphs.",
        vietnameseSentence: "Các công trình lịch sử đóng vai trò là bằng chứng hữu hình về sự tài hoa kiến trúc và những chiến tích lịch sử của tiền nhân."
      },
      {
        id: "her-9",
        word: "reconcile",
        ipa: "/ˈrek.ən.saɪl/",
        partOfSpeech: "verb",
        meaning: "Dung hòa, tìm tiếng nói chung giữa bảo tồn di sản và hiện đại hóa",
        basicEquivalent: "balance together (Band 5-6)",
        synonyms: ["harmonize", "accommodate", "synthesize", "align"],
        collocations: ["reconcile conservation with progress", "reconcile heritage with modernization", "reconcile competing demands"],
        modelSentence: "City planners must reconcile conservation with progress by converting historic warehouses into modern innovation hubs.",
        vietnameseSentence: "Các nhà quy hoạch đô thị phải dung hòa giữa bảo tồn và tiến bộ bằng cách chuyển đổi các nhà kho lịch sử thành các trung tâm đổi mới hiện đại."
      },
      {
        id: "her-10",
        word: "sustainable",
        ipa: "/səˈsteɪ.nə.bəl/",
        partOfSpeech: "adjective",
        meaning: "Bền vững, hài hòa giữa tăng trưởng kinh tế, bản sắc văn hóa và an sinh xã hội",
        basicEquivalent: "long-term / lasting (Band 5)",
        synonyms: ["viable", "durable", "enduring"],
        collocations: ["sustainable urban development", "sustainable conservation", "sustainable tourism"],
        modelSentence: "Adaptive reuse represents the most sustainable conservation strategy, preserving architectural memory while meeting civic housing needs.",
        vietnameseSentence: "Tái sử dụng thích ứng là chiến lược bảo tồn bền vững nhất, vừa giữ gìn ký ức kiến trúc vừa đáp ứng nhu cầu nhà ở dân sinh."
      }
    ]
  },
  {
    id: "higher-education-utility-2015",
    name: "Academic Freedom vs Market Utility in Higher Education (Cam 10 Test 2)",
    vietnameseName: "Chọn ngành đại học: Đam mê vs Thị trường (Cam 10)",
    tag: "Cambridge 10",
    icon: "GraduationCap",
    ieltsPrompt: "Some people think that all university students should study whatever they like. Others believe that they should only be allowed to study subjects that will be useful in the future, such as those related to science and technology. Discuss both these views and give your opinion.",
    vocabularies: [
      {
        id: "edu-util-1",
        word: "pragmatism",
        ipa: "/ˈpræɡ.mə.tɪ.zəm/",
        partOfSpeech: "noun",
        meaning: "Chủ nghĩa thực dụng, việc định hướng giáo dục bám sát nhu cầu tuyển dụng",
        basicEquivalent: "practical focus (Band 5)",
        synonyms: ["utilitarianism", "practicality", "realism"],
        collocations: ["educational pragmatism", "economic pragmatism", "narrow pragmatism"],
        modelSentence: "Excessive educational pragmatism threatens to sideline vital humanities that cultivate critical civic thought.",
        vietnameseSentence: "Chủ nghĩa thực dụng giáo dục quá mức có nguy cơ gạt ra bên lề các ngành nhân văn thiết yếu vốn nuôi dưỡng tư duy công dân phản biện."
      },
      {
        id: "edu-util-2",
        word: "autonomous",
        ipa: "/ɔːˈtɒn.ə.məs/",
        partOfSpeech: "adjective",
        meaning: "Tự chủ, có quyền tự quyết định độc lập không bị cưỡng ép",
        basicEquivalent: "free to choose (Band 5)",
        synonyms: ["independent", "self-determining", "sovereign"],
        collocations: ["autonomous decision-making", "autonomous learners", "remain autonomous"],
        modelSentence: "Undergraduates should remain autonomous agents empowered to select disciplines aligning with their intrinsic talents.",
        vietnameseSentence: "Sinh viên đại học cần được trao quyền là những chủ thể tự chủ được chọn ngành học phù hợp với tài năng nội tại của mình."
      },
      {
        id: "edu-util-3",
        word: "employability",
        ipa: "/ɪmˌplɔɪ.əˈbɪl.ə.ti/",
        partOfSpeech: "noun",
        meaning: "Khả năng được tuyển dụng, bộ kỹ năng giúp sinh viên dễ xin việc sau tốt nghiệp",
        basicEquivalent: "chance to get a job (Band 5)",
        synonyms: ["job readiness", "marketability", "workplace competence"],
        collocations: ["enhance employability", "graduate employability", "employability skills"],
        modelSentence: "Curricula embedded with practical coding and data analytics substantially enhance graduate employability.",
        vietnameseSentence: "Chương trình giảng dạy tích hợp lập trình thực tế và phân tích dữ liệu giúp nâng cao đáng kể khả năng xin việc của sinh viên."
      },
      {
        id: "edu-util-4",
        word: "humanities",
        ipa: "/hjuːˈmæn.ə.tiz/",
        partOfSpeech: "noun",
        meaning: "Các ngành khoa học nhân văn (triết học, lịch sử, văn học)",
        basicEquivalent: "arts and literature subjects (Band 5)",
        synonyms: ["liberal arts", "humanistic studies"],
        collocations: ["humanities disciplines", "study the humanities", "decline of the humanities"],
        modelSentence: "Discarding the humanities in pursuit of purely technocratic degrees impoverishes a nation's moral and cultural conscience.",
        vietnameseSentence: "Bỏ rơi các ngành nhân văn để mải miết chạy theo các bằng cấp kỹ trị sẽ làm nghèo nàn lương tri đạo đức và văn hóa của một quốc gia."
      },
      {
        id: "edu-util-5",
        word: "lucrative",
        ipa: "/ˈluː.krə.tɪv/",
        partOfSpeech: "adjective",
        meaning: "Sinh lợi cao, mang lại thu nhập và lợi nhuận kinh tế dồi dào",
        basicEquivalent: "well-paid / making lots of money (Band 5)",
        synonyms: ["remunerative", "profitable", "financially rewarding"],
        collocations: ["lucrative career", "lucrative sector", "lucrative employment prospects"],
        modelSentence: "Software engineering and artificial intelligence offer exceptionally lucrative career pathways for ambitious youth.",
        vietnameseSentence: "Kỹ thuật phần mềm và trí tuệ nhân tạo mang lại những con đường sự nghiệp sinh lợi đặc biệt cao cho giới trẻ tham vọng."
      },
      {
        id: "edu-util-6",
        word: "oversupply",
        ipa: "/ˌəʊ.və.səˈplaɪ/",
        partOfSpeech: "noun",
        meaning: "Tình trạng dư thừa cung, số lượng cử nhân vượt quá sức chứa thị trường lao động",
        basicEquivalent: "too many people having the same degree (Band 5)",
        synonyms: ["surplus", "glut", "excess"],
        collocations: ["labor oversupply", "graduate oversupply", "suffer an oversupply"],
        modelSentence: "An uncoordinated rush toward trendy academic fields can easily provoke a catastrophic graduate oversupply.",
        vietnameseSentence: "Làn sóng đổ xô mất kiểm soát vào các ngành học thời thượng có thể dễ dàng gây ra sự dư thừa cử nhân trầm trọng."
      },
      {
        id: "edu-util-7",
        word: "technocratic",
        ipa: "/ˌtek.nəˈkræt.ɪk/",
        partOfSpeech: "adjective",
        meaning: "Mang tính kỹ trị, dựa thuần túy vào các chuyên gia kỹ thuật và hiệu quả kinh tế",
        basicEquivalent: "technical-focused (Band 5)",
        synonyms: ["technology-driven", "expert-ruled"],
        collocations: ["technocratic mindset", "technocratic elite", "technocratic vision of education"],
        modelSentence: "A purely technocratic educational system reduces human beings to mere cogs in an industrial machine.",
        vietnameseSentence: "Một hệ thống giáo dục mang tính kỹ trị thuần túy sẽ biến con người thành những bánh răng giản đơn trong cỗ máy công nghiệp."
      },
      {
        id: "edu-util-8",
        word: "holistic",
        ipa: "/həʊˈlɪs.tɪk/",
        partOfSpeech: "adjective",
        meaning: "Toàn diện, nhìn nhận và phát triển trọn vẹn mọi khía cạnh của con người",
        basicEquivalent: "complete / all-round (Band 5)",
        synonyms: ["comprehensive", "all-encompassing", "integrative"],
        collocations: ["holistic education", "holistic development", "holistic perspective"],
        modelSentence: "Prestigious universities champion holistic learning that harmonizes scientific rigor with philosophical ethics.",
        vietnameseSentence: "Các trường đại học danh tiếng luôn cổ vũ nền giáo dục toàn diện dung hòa giữa tính chuẩn mực khoa học và đạo đức triết học."
      },
      {
        id: "edu-util-9",
        word: "propensity",
        ipa: "/prəˈpen.sə.ti/",
        partOfSpeech: "noun",
        meaning: "Xu hướng, thiên hướng tự nhiên hoặc niềm say mê sẵn có",
        basicEquivalent: "natural liking / tendency (Band 5)",
        synonyms: ["predilection", "inclination", "aptitude", "tendency"],
        collocations: ["natural propensity", "intellectual propensity", "propensity for research"],
        modelSentence: "Compelling individuals to study subjects counter to their natural propensity fosters disengagement and mental burnout.",
        vietnameseSentence: "Ép buộc các cá nhân theo học những môn đi ngược lại thiên hướng tự nhiên sẽ chỉ gây ra sự chán chường và kiệt quệ tinh thần."
      },
      {
        id: "edu-util-10",
        word: "flourish",
        ipa: "/ˈflʌr.ɪʃ/",
        partOfSpeech: "verb",
        meaning: "Phát triển thịnh vượng, nở rộ tiềm năng và thăng hoa rực rỡ",
        basicEquivalent: "grow well / succeed (Band 5)",
        synonyms: ["thrive", "prosper", "burgeon"],
        collocations: ["flourish academically", "flourish in one's chosen career", "enable youth to flourish"],
        modelSentence: "Scholars flourish when granted intellectual liberty to delve deeply into topics they genuinely revere.",
        vietnameseSentence: "Các học giả phát triển rực rỡ nhất khi được trao sự tự do học thuật để đào sâu vào những đề tài mà họ thực tâm say mê."
      }
    ]
  },
  {
    id: "ai-workforce-cam19",
    name: "AI & Workforce Automation (Cambridge 19)",
    vietnameseName: "Trí tuệ nhân tạo & Lao động tương lai (Cam 19)",
    tag: "Cambridge 19 (Mới nhất)",
    icon: "Cpu",
    ieltsPrompt: "In many countries, artificial intelligence and automation are increasingly replacing human labor across various sectors. Some people believe this development will create more opportunities, while others fear it will lead to widespread unemployment. Discuss both views and give your opinion.",
    vocabularies: [
      {
        id: "ai-cam19-1",
        word: "displace",
        ipa: "/dɪsˈpleɪs/",
        partOfSpeech: "verb",
        meaning: "Thay thế, tước đoạt vị trí công việc của người lao động",
        basicEquivalent: "replace / take jobs (Band 5)",
        synonyms: ["supplant", "supersede", "oust"],
        collocations: ["displace human labor", "displace traditional workers", "risk displacing millions"],
        modelSentence: "Generative artificial intelligence threatens to displace routine administrative personnel across multiple industries.",
        vietnameseSentence: "Trí tuệ nhân tạo tạo sinh đe dọa thay thế nhân viên hành chính xử lý công việc lặp lại ở nhiều ngành công nghiệp."
      },
      {
        id: "ai-cam19-2",
        word: "ubiquitous",
        ipa: "/juːˈbɪk.wɪ.təs/",
        partOfSpeech: "adjective",
        meaning: "Phổ biến ở mọi nơi, hiện diện khắp chốn trong đời sống",
        basicEquivalent: "very common / everywhere (Band 5)",
        synonyms: ["omnipresent", "pervasive", "prevalent"],
        collocations: ["ubiquitous technology", "become ubiquitous", "ubiquitous presence of algorithms"],
        modelSentence: "Algorithmic decision-making has become ubiquitous in contemporary corporate management.",
        vietnameseSentence: "Việc ra quyết định bằng thuật toán đã trở nên hiện diện khắp mọi nơi trong quản trị doanh nghiệp đương đại."
      },
      {
        id: "ai-cam19-3",
        word: "obsolescence",
        ipa: "/ˌɒb.səˈles.əns/",
        partOfSpeech: "noun",
        meaning: "Sự lỗi thời, tình trạng bị đào thải do công nghệ mới ra đời",
        basicEquivalent: "becoming out of date (Band 5)",
        synonyms: ["outdatedness", "supersession"],
        collocations: ["occupational obsolescence", "technological obsolescence", "face rapid obsolescence"],
        modelSentence: "Workers who refuse to embrace digital literacy face immediate occupational obsolescence.",
        vietnameseSentence: "Những người lao động từ chối tiếp cận kỹ năng số sẽ đối mặt với nguy cơ bị đào thải nghề nghiệp ngay lập tức."
      },
      {
        id: "ai-cam19-4",
        word: "unprecedented",
        ipa: "/ʌnˈpres.ɪ.den.tɪd/",
        partOfSpeech: "adjective",
        meaning: "Chưa từng có tiền lệ trong lịch sử",
        basicEquivalent: "never seen before (Band 5)",
        synonyms: ["unmatched", "unparalleled", "novel"],
        collocations: ["unprecedented speed", "unprecedented disruption", "unprecedented economic shift"],
        modelSentence: "The transition towards automated manufacturing is occurring at an unprecedented pace.",
        vietnameseSentence: "Quá trình chuyển dịch sang sản xuất tự động hóa đang diễn ra với tốc độ chưa từng có tiền lệ."
      },
      {
        id: "ai-cam19-5",
        word: "reskill",
        ipa: "/ˌriːˈskɪl/",
        partOfSpeech: "verb",
        meaning: "Đào tạo lại kỹ năng để đáp ứng nhu cầu thời đại mới",
        basicEquivalent: "train again (Band 5)",
        synonyms: ["retrain", "upskill", "re-educate"],
        collocations: ["reskill the workforce", "reskill displaced workers", "proactive reskilling initiatives"],
        modelSentence: "Governments must sponsor initiatives to reskill factory workers into higher-value analytical roles.",
        vietnameseSentence: "Chính phủ cần tài trợ các chương trình đào tạo lại kỹ năng cho công nhân nhà máy sang các vai trò phân tích giá trị cao hơn."
      },
      {
        id: "ai-cam19-6",
        word: "augment",
        ipa: "/ɔːɡˈment/",
        partOfSpeech: "verb",
        meaning: "Gia tăng, bổ trợ và tăng cường năng lực cho con người",
        basicEquivalent: "make stronger / help (Band 5)",
        synonyms: ["enhance", "supplement", "boost"],
        collocations: ["augment human productivity", "augment cognitive capabilities", "augment decision-making"],
        modelSentence: "Rather than outright substitution, automation can augment physician diagnostics and reduce surgical mistakes.",
        vietnameseSentence: "Thay vì thay thế hoàn toàn, tự động hóa có thể bổ trợ việc chẩn đoán của bác sĩ và giảm bớt sai sót phẫu thuật."
      },
      {
        id: "ai-cam19-7",
        word: "synergy",
        ipa: "/ˈsɪn.ə.dʒi/",
        partOfSpeech: "noun",
        meaning: "Sự cộng hưởng, hợp lực tương hỗ giữa người và máy móc",
        basicEquivalent: "teamwork / working together (Band 5)",
        synonyms: ["collaboration", "cooperation", "symbiosis"],
        collocations: ["human-AI synergy", "create synergy", "exploit technological synergy"],
        modelSentence: "Firms that master human-AI synergy consistently outcompete counterparts relying exclusively on manual workflows.",
        vietnameseSentence: "Các công ty làm chủ được sự cộng hưởng giữa người và AI luôn vượt trội hơn những đối thủ thuần túy dựa vào quy trình thủ công."
      },
      {
        id: "ai-cam19-8",
        word: "disproportionate",
        ipa: "/ˌdɪs.prəˈpɔː.ʃən.ət/",
        partOfSpeech: "adjective",
        meaning: "Không cân xứng, gây tổn thương bất bình đẳng lên nhóm yếu thế",
        basicEquivalent: "uneven / unfair (Band 5)",
        synonyms: ["unequal", "unbalanced", "excessive"],
        collocations: ["disproportionate burden", "disproportionate impact", "disproportionately affected"],
        modelSentence: "Low-income assembly workers inevitably bear a disproportionate burden during robotic automation rollouts.",
        vietnameseSentence: "Lao động lắp ráp thu nhập thấp chắc chắn gánh chịu thiệt hại không tương xứng trong các đợt triển khai robot tự động."
      },
      {
        id: "ai-cam19-9",
        word: "catalyst",
        ipa: "/ˈkæt.əl.ɪst/",
        partOfSpeech: "noun",
        meaning: "Chất xúc tác đẩy nhanh sự biến chuyển kinh tế - xã hội",
        basicEquivalent: "something that causes change (Band 5)",
        synonyms: ["impetus", "stimulus", "accelerator"],
        collocations: ["serve as a catalyst", "catalyst for job creation", "catalyst for innovation"],
        modelSentence: "Technological disruption acts as a powerful catalyst for emerging sectors like renewable energy and data engineering.",
        vietnameseSentence: "Sự đột phá công nghệ đóng vai trò như một chất xúc tác mạnh mẽ cho các ngành mới nổi như năng lượng tái tạo và kỹ thuật dữ liệu."
      },
      {
        id: "ai-cam19-10",
        word: "paradigm",
        ipa: "/ˈpær.ə.daɪm/",
        partOfSpeech: "noun",
        meaning: "Mô hình kiểu mẫu, khuôn khổ tư duy và phương thức vận hành",
        basicEquivalent: "model / system (Band 5)",
        synonyms: ["framework", "archetype", "pattern"],
        collocations: ["paradigm shift", "new employment paradigm", "economic paradigm"],
        modelSentence: "The proliferation of synthetic intelligence represents an irreversible paradigm shift in global employment dynamics.",
        vietnameseSentence: "Sự phổ biến của trí tuệ nhân tạo tổng hợp đại diện cho một bước chuyển dịch mô hình không thể đảo ngược trong động lực việc làm toàn cầu."
      }
    ]
  }
,
  {
    id: "t2-elderly-care-funding",
    name: "Elderly Care: State Pension & Nursing Homes vs Family Duty",
    vietnameseName: "Chăm sóc người cao tuổi: Trách nhiệm chu cấp của Nhà nước vs Bổn phận gia đình",
    tag: "Xã hội & Dân số già",
    icon: "HeartHandshake",
    ieltsPrompt: "In Britain, when someone gets old they often go to live in a home with other old people where there are nurses to look after them. Sometimes the government has to pay for this care. Who do you think should pay for this care - the government or the family?",
    modelEssay: "In many developed nations, the aging population has led to a growing reliance on specialized residential nursing homes. Whether the state or the family should shoulder the financial burden of eldercare is a subject of ongoing debate. In my view, while families bear a moral obligation to contribute, the government must guarantee foundational financial support to ensure dignified care for all senior citizens.\n\nOn the one hand, proponents of family responsibility argue that filial duty is a cornerstone of society. Children have been nurtured and supported by their parents throughout their youth; therefore, providing for parents in their frailest years is a fundamental ethical duty. Moreover, relying entirely on public coffers would place an unsustainable strain on state budgets, especially as demographic aging accelerates and the workforce shrinks. If affluent households are required to fund nursing care privately, public funds can be safeguarded for underprivileged families who genuinely lack the means.\n\nOn the other hand, there is a compelling case for government provision. Senior citizens have paid taxes and contributed productive labor to the national economy over decades of employment. Access to compassionate healthcare in old age should be viewed as an earned social entitlement rather than an act of charity. Furthermore, modern economic pressures—such as escalating living costs and high mortgages—mean that many working adults simply cannot afford exorbitant monthly nursing home fees without jeopardizing their own children's future.\n\nIn conclusion, rather than placing the entire obligation on either party, I believe an equitable co-payment model is the most sustainable approach. The state should finance medical treatments and subsidize low-income seniors, while families who possess the means should contribute toward accommodation and daily living expenses.",
    vocabularies: [
      {
        id: "t2-eld-1",
        word: "residential nursing home",
        ipa: "/ˌrezɪˈdenʃl ˈnɜːsɪŋ həʊm/",
        partOfSpeech: "noun",
        meaning: "Viện dưỡng lão có y tá chăm sóc toàn diện",
        basicEquivalent: "home for old people (Band 5)",
        synonyms: ["assisted living facility", "eldercare home", "geriatric institution"],
        collocations: ["admit into a residential nursing home", "nursing home fees"],
        modelSentence: "Placing aging relatives into a residential nursing home ensures round-the-clock medical oversight.",
        vietnameseSentence: "Đưa người thân lớn tuổi vào viện dưỡng lão đảm bảo sự theo dõi y tế suốt ngày đêm."
      },
      {
        id: "t2-eld-2",
        word: "filial duty",
        ipa: "/ˈfɪliəl ˈdjuːti/",
        partOfSpeech: "noun",
        meaning: "Bổn phận hiếu thảo của con cái đối với cha mẹ",
        basicEquivalent: "duty to parents (Band 5)",
        synonyms: ["filial piety", "familial obligation", "moral duty"],
        collocations: ["honor filial duty", "uphold filial duty"],
        modelSentence: "In traditional Asian societies, filial duty requires offspring to support parents financially in retirement.",
        vietnameseSentence: "Trong các xã hội Châu Á truyền thống, bổn phận hiếu thảo đòi hỏi con cái phải phụng dưỡng cha mẹ về tài chính khi về hưu."
      },
      {
        id: "t2-eld-3",
        word: "social entitlement",
        ipa: "/ˈsəʊʃl ɪnˈtaɪtlmənt/",
        partOfSpeech: "noun",
        meaning: "Quyền lợi an sinh xã hội chính đáng được hưởng",
        basicEquivalent: "right to get help (Band 5)",
        synonyms: ["welfare right", "public benefit entitlement"],
        collocations: ["earned social entitlement", "guarantee social entitlements"],
        modelSentence: "State healthcare for the elderly should be respected as an earned social entitlement rather than state charity.",
        vietnameseSentence: "Dịch vụ y tế nhà nước cho người già nên được tôn trọng như một quyền lợi an sinh xứng đáng hơn là sự bố thí từ thiện."
      },
      {
        id: "t2-eld-4",
        word: "demographic aging",
        ipa: "/ˌdeməˈɡræfɪk ˈeɪdʒɪŋ/",
        partOfSpeech: "noun",
        meaning: "Sự già hóa dân số nhân khẩu học",
        basicEquivalent: "more old people (Band 5)",
        synonyms: ["graying population", "population aging"],
        collocations: ["accelerating demographic aging", "tackle demographic aging"],
        modelSentence: "Rapid demographic aging places unprecedented fiscal pressure on public pension systems.",
        vietnameseSentence: "Sự già hóa dân số diễn ra nhanh chóng tạo nên áp lực tài chính chưa từng có lên các hệ thống hưu trí công."
      },
      {
        id: "t2-eld-5",
        word: "co-payment model",
        ipa: "/kəʊ ˈpeɪmənt ˈmɒdl/",
        partOfSpeech: "noun",
        meaning: "Mô hình đồng chi trả (giữa nhà nước và gia đình)",
        basicEquivalent: "paying together (Band 5)",
        synonyms: ["cost-sharing framework", "shared funding system"],
        collocations: ["implement a co-payment model", "equitable co-payment model"],
        modelSentence: "An equitable co-payment model relieves pressure on taxpayers while protecting impoverished pensioners.",
        vietnameseSentence: "Mô hình đồng chi trả công bằng giải tỏa áp lực cho người nộp thuế đồng thời bảo vệ những người hưu trí nghèo khó."
      },
      {
        id: "t2-eld-6",
        word: "frail",
        ipa: "/freɪl/",
        partOfSpeech: "adjective",
        meaning: "Yếu ớt, già yếu suy giảm thể lực",
        basicEquivalent: "weak (Band 5)",
        synonyms: ["debilitated", "infirm", "vulnerable"],
        collocations: ["frail elderly", "in frail health"],
        modelSentence: "Frail seniors suffering from dementia require intensive nursing care that families cannot provide at home.",
        vietnameseSentence: "Những người cao tuổi già yếu mắc chứng mất trí nhớ đòi hỏi sự chăm sóc y tế chuyên sâu mà gia đình không thể đáp ứng tại nhà."
      },
      {
        id: "t2-eld-7",
        word: "public coffers",
        ipa: "/ˈpʌblɪk ˈkɒfəz/",
        partOfSpeech: "noun",
        meaning: "Ngân khố quốc gia / công quỹ nhà nước",
        basicEquivalent: "state money (Band 5)",
        synonyms: ["state treasury", "national treasury", "public exchequer"],
        collocations: ["drain public coffers", "strain on public coffers"],
        modelSentence: "Funding lifelong residential care solely through public coffers would exhaust treasury reserves.",
        vietnameseSentence: "Chi trả toàn bộ viện dưỡng lão suốt đời chỉ từ công quỹ nhà nước sẽ làm cạn kiệt dự trữ ngân khố."
      },
      {
        id: "t2-eld-8",
        word: "dignified old age",
        ipa: "/ˈdɪɡnɪfaɪd əʊld eɪdʒ/",
        partOfSpeech: "noun",
        meaning: "Tuổi già sống trong danh dự và được tôn trọng",
        basicEquivalent: "good old life (Band 5)",
        synonyms: ["graceful retirement", "dignity in old age"],
        collocations: ["guarantee a dignified old age", "enjoy a dignified old age"],
        modelSentence: "Every senior citizen deserves to live a comfortable and dignified old age after a lifetime of labor.",
        vietnameseSentence: "Mỗi người cao tuổi đều xứng đáng được hưởng một tuổi già an nhàn và được tôn trọng sau cả cuộc đời lao động."
      }
    ]
  },
  {
    id: "t2-brain-drain-migration",
    name: "Brain Drain: Skilled Medical & Professional Emigration from Developing Countries",
    vietnameseName: "Chảy máu chất xám: Làn sóng di cư của y bác sĩ và chuyên gia từ các nước đang phát triển",
    tag: "Toàn cầu hóa & Di cư",
    icon: "Globe",
    ieltsPrompt: "Many qualified doctors, nurses, and academics emigrate from developing countries to work in developed nations. Some consider this as stealing talent from poor countries, while others feel that this is only part of the natural movement of workers around the world. Discuss both views and give your opinion.",
    modelEssay: "The migration of skilled professionals, particularly doctors, nurses, and researchers, from developing territories to industrialized economies is an intensifying global phenomenon. While critics argue that this brain drain constitutes an exploitative deprivation of vital talent from developing countries, others maintain that it represents the legitimate, voluntary movement of global labor. In my view, while individuals possess the fundamental right to seek optimal career prospects, rich recipient nations should compensate source nations through structured development assistance.\n\nOn the one hand, detractors view the recruitment of qualified specialists as detrimental to developing countries. Poorer nations invest substantial public resources into subsidizing medical faculties and universities. When newly minted physicians emigrate en masse to affluent nations like the UK or Australia, the source country forfeits its return on investment. More critically, this exodus cripples domestic infrastructure, leaving local hospitals chronically understaffed and compounding humanitarian crises in vulnerable communities.\n\nOn the other hand, defenders of skilled migration view this trend as a natural corollary of globalisation and personal autonomy. Every professional possesses an intrinsic human right to pursue superior living standards, fair compensation, and professional advancement that may be unavailable in their homeland. Furthermore, skilled emigrants frequently send back substantial financial remittances, which directly bolster local households and stimulate foreign exchange reserves. Many also eventually return with international expertise, fostering technological innovation in their native countries.\n\nIn conclusion, while freedom of movement must be safeguarded for individual professionals, developed countries should not passively strip poorer nations of indispensable human capital. Ethical recruitment policies and reciprocal investment in source nations' training infrastructure are essential to achieve equitable global balance.",
    vocabularies: [
      {
        id: "t2-brain-1",
        word: "brain drain",
        ipa: "/ˈbreɪn dreɪn/",
        partOfSpeech: "noun",
        meaning: "Hiện tượng chảy máu chất xám (nhân tài di cư ra nước ngoài)",
        basicEquivalent: "smart people leaving (Band 5)",
        synonyms: ["human capital flight", "skilled emigration", "talent exodus"],
        collocations: ["suffer from brain drain", "mitigate brain drain"],
        modelSentence: "Developing economies continue to suffer from chronic brain drain in critical medical specialties.",
        vietnameseSentence: "Các nền kinh tế đang phát triển tiếp tục phải hứng chịu tình trạng chảy máu chất xám kéo dài ở các chuyên khoa y tế trọng yếu."
      },
      {
        id: "t2-brain-2",
        word: "financial remittances",
        ipa: "/faɪˈnænʃl rɪˈmɪtnsɪz/",
        partOfSpeech: "noun",
        meaning: "Kiều hối (tiền người lao động ở nước ngoài gửi về quê nhà)",
        basicEquivalent: "money sent home (Band 5)",
        synonyms: ["migrant remittances", "inward remittances"],
        collocations: ["send back remittances", "depend on foreign remittances"],
        modelSentence: "Financial remittances sent home by overseas doctors often exceed official developmental aid.",
        vietnameseSentence: "Nguồn kiều hối tài chính do các bác sĩ ở nước ngoài gửi về thường vượt qua cả viện trợ phát triển chính thức."
      },
      {
        id: "t2-brain-3",
        word: "human capital flight",
        ipa: "/ˈhjuːmən ˈkæpɪtl flaɪt/",
        partOfSpeech: "noun",
        meaning: "Sự thất thoát nguồn vốn con người / nhân lực chất lượng cao",
        basicEquivalent: "loss of educated workers (Band 5)",
        synonyms: ["brain drain", "talent depletion"],
        collocations: ["reverse human capital flight", "curb human capital flight"],
        modelSentence: "Governments must offer competitive research grants to counteract human capital flight.",
        vietnameseSentence: "Các chính phủ phải đưa ra các khoản tài trợ nghiên cứu cạnh tranh để ngăn chặn sự thất thoát nguồn vốn con người."
      },
      {
        id: "t2-brain-4",
        word: "return on investment",
        ipa: "/rɪˈtɜːn ɒn ɪnˈvestmənt/",
        partOfSpeech: "noun",
        meaning: "Tỷ suất hoàn vốn đầu tư (vào đào tạo nhân lực)",
        basicEquivalent: "money gained back (Band 5)",
        synonyms: ["yield on educational expenditure", "social return"],
        collocations: ["forfeit return on investment", "maximize return on investment"],
        modelSentence: "When certified engineers emigrate immediately after graduation, public universities lose their return on investment.",
        vietnameseSentence: "Khi các kỹ sư tốt nghiệp di cư ngay sau khi ra trường, các trường đại học công lập mất đi khoản hoàn vốn đầu tư xã hội."
      },
      {
        id: "t2-brain-5",
        word: "chronically understaffed",
        ipa: "/ˈkrɒnɪkli ˌʌndəˈstɑːft/",
        partOfSpeech: "adjective",
        meaning: "Thiếu hụt nhân sự kinh niên kéo dài",
        basicEquivalent: "always not enough workers (Band 5)",
        synonyms: ["perpetually short-staffed", "critically depleted"],
        collocations: ["hospitals remain understaffed", "chronically understaffed wards"],
        modelSentence: "Provincial healthcare facilities remain chronically understaffed because graduates seek overseas contracts.",
        vietnameseSentence: "Các cơ sở y tế tuyến tỉnh vẫn thiếu hụt nhân sự triền miên do sinh viên ra trường tìm kiếm hợp đồng ở nước ngoài."
      },
      {
        id: "t2-brain-6",
        word: "reciprocal investment",
        ipa: "/rɪˈsɪprəkl ɪnˈvestmənt/",
        partOfSpeech: "noun",
        meaning: "Sự đầu tư có đi có lại, tương hỗ song phương",
        basicEquivalent: "giving back help (Band 5)",
        synonyms: ["mutual reinvestment", "bilateral aid"],
        collocations: ["commit to reciprocal investment", "reciprocal cooperation"],
        modelSentence: "Wealthy nations hiring foreign doctors should commit to reciprocal investment in overseas teaching hospitals.",
        vietnameseSentence: "Các quốc gia giàu có thuê bác sĩ nước ngoài nên cam kết đầu tư tương hỗ vào các bệnh viện thực hành ở nước sở tại."
      },
      {
        id: "t2-brain-7",
        word: "exodus",
        ipa: "/ˈeksədəs/",
        partOfSpeech: "noun",
        meaning: "Làn sóng rời đi hàng loạt của một nhóm người",
        basicEquivalent: "many people leaving (Band 5)",
        synonyms: ["mass departure", "outpouring", "migration wave"],
        collocations: ["mass exodus of talent", "stem the exodus"],
        modelSentence: "Without tax incentives, developing countries will be powerless to stem the mass exodus of technicians.",
        vietnameseSentence: "Nếu thiếu các ưu đãi thuế, các nước đang phát triển sẽ bất lực trong việc ngăn chặn làn sóng kỹ thuật viên rời đi hàng loạt."
      },
      {
        id: "t2-brain-8",
        word: "personal autonomy",
        ipa: "/ˈpɜːsənl ɔːˈtɒnəmi/",
        partOfSpeech: "noun",
        meaning: "Quyền tự quyết định con đường của bản thân",
        basicEquivalent: "freedom of choice (Band 5)",
        synonyms: ["individual liberty", "self-determination"],
        collocations: ["exercise personal autonomy", "infringe on personal autonomy"],
        modelSentence: "Denying skilled workers passports would gravely violate fundamental rights to personal autonomy.",
        vietnameseSentence: "Việc cấm cấp hộ chiếu cho người lao động có tay nghề sẽ vi phạm nghiêm trọng quyền tự quyết cá nhân cơ bản."
      }
    ]
  },
  {
    id: "t2-sports-income-disparity",
    name: "Income Disparity: Astronomical Sports Star Earnings vs Essential Public Workers",
    vietnameseName: "Chênh lệch thu nhập: Mức lương khổng lồ của ngôi sao thể thao vs Nghề thiết yếu",
    tag: "Việc làm & Đạo đức xã hội",
    icon: "Coins",
    ieltsPrompt: "Successful sports professionals can earn a great deal more money than people in other important professions such as doctors, nurses, and teachers. Some people think this is fully justified while others think it is unfair. Discuss both these views and give your own opinion.",
    modelEssay: "The staggering compensation awarded to elite athletic figures in modern sports frequently dwarfs the wages of professionals in vital public services such as healthcare and education. While many argue that these astronomical incomes are legitimately earned through market forces and rare talent, others condemn this gap as deeply unjust. In my opinion, whilst high sports earnings are commercially understandable, government tax mechanisms must redistribute excess wealth to adequately reward critical public servants.\n\nOn the one hand, those who defend sports remuneration point to free-market economics. Professional athletics generates billions of dollars globally through commercial sponsorships, broadcasting rights, and merchandise sales. Since top athletes are the primary entertainers driving this multi-billion-dollar industry, they are entitled to a proportionate share of the profits. Furthermore, athletic careers are notoriously precarious and brief, usually terminating before the age of thirty-five, with constant risk of career-ending injuries. Athletes also possess unique physiological abilities that only a fraction of the world population can replicate, commanding scarcity-driven wages.\n\nOn the other hand, the argument for unfairness centers on societal utility and moral justice. Doctors save human lives, nurses care for the vulnerable, and teachers cultivate the minds of future generations. These occupations form the bedrock of civilization, yet their salaries often fail to reflect the immense emotional and practical value they deliver. By contrast, athletic entertainment is superfluous to human survival. When a football striker earns more in a solitary week than an experienced cardiac surgeon earns in a lifetime, society risks distorting its moral compass by glorifying celebrity entertainment above humanitarian commitment.\n\nIn conclusion, although exorbitant sports wages reflect the realities of global commercial entertainment, the profound contribution of public service workers cannot be overlooked. Governments should levy progressive windfall taxes on elite entertainment contracts to augment the salaries of teachers and healthcare professionals.",
    vocabularies: [
      {
        id: "t2-sport-1",
        word: "astronomical income",
        ipa: "/ˌæstrəˈnɒmɪkl ˈɪnkʌm/",
        partOfSpeech: "noun",
        meaning: "Thu nhập khổng lồ, cao ngất ngưởng",
        basicEquivalent: "very huge money (Band 5)",
        synonyms: ["exorbitant salary", "staggering remuneration", "colossal earnings"],
        collocations: ["earn an astronomical income", "command astronomical incomes"],
        modelSentence: "Elite footballers command astronomical incomes exceeding several hundred thousand dollars per week.",
        vietnameseSentence: "Các cầu thủ bóng đá hàng đầu nhận mức thu nhập khổng lồ vượt quá hàng trăm nghìn đô la mỗi tuần."
      },
      {
        id: "t2-sport-2",
        word: "societal utility",
        ipa: "/səˈsaɪətl juːˈtɪləti/",
        partOfSpeech: "noun",
        meaning: "Giá trị công năng / mức độ hữu ích thực sự cho xã hội",
        basicEquivalent: "usefulness for people (Band 5)",
        synonyms: ["public value", "social necessity", "humanitarian worth"],
        collocations: ["evaluate societal utility", "rank by societal utility"],
        modelSentence: "Remuneration structures should ideally reflect the true societal utility of each profession.",
        vietnameseSentence: "Cơ cấu thù lao lý tưởng nhất nên phản ánh giá trị hữu ích thực sự cho xã hội của từng nghề nghiệp."
      },
      {
        id: "t2-sport-3",
        word: "commercial sponsorship",
        ipa: "/kəˈmɜːʃl ˈspɒnsəʃɪp/",
        partOfSpeech: "noun",
        meaning: "Hợp đồng tài trợ thương mại",
        basicEquivalent: "company support money (Band 5)",
        synonyms: ["corporate endorsement", "marketing contract"],
        collocations: ["secure commercial sponsorships", "lucrative sponsorships"],
        modelSentence: "Athletic franchises generate colossal cash reserves through television rights and commercial sponsorships.",
        vietnameseSentence: "Các câu lạc bộ thể thao tạo ra nguồn dự trữ tiền mặt khổng lồ qua bản quyền truyền hình và tài trợ thương mại."
      },
      {
        id: "t2-sport-4",
        word: "career-ending injury",
        ipa: "/kəˈrɪər ˈendɪŋ ˈɪndʒəri/",
        partOfSpeech: "noun",
        meaning: "Chấn thương chấm dứt sự nghiệp thi đấu",
        basicEquivalent: "hurt that stops playing forever (Band 5)",
        synonyms: ["debilitating sports injury", "permanent trauma"],
        collocations: ["suffer a career-ending injury", "risk of career-ending injury"],
        modelSentence: "A solitary career-ending injury can extinguish an athlete's earning potential overnight.",
        vietnameseSentence: "Chỉ một chấn thương chấm dứt sự nghiệp duy nhất có thể dập tắt tiềm năng kiếm tiền của một vận động viên chỉ sau một đêm."
      },
      {
        id: "t2-sport-5",
        word: "bedrock of civilization",
        ipa: "/ˈbedrɒk əv ˌsɪvəlaɪˈzeɪʃn/",
        partOfSpeech: "noun",
        meaning: "Nền tảng vững chắc của nền văn minh nhân loại",
        basicEquivalent: "foundation of world (Band 5)",
        synonyms: ["cornerstone of society", "vital pillars"],
        collocations: ["form the bedrock of civilization", "undermine the bedrock"],
        modelSentence: "Educators and medical personnel constitute the bedrock of modern civilized civilization.",
        vietnameseSentence: "Các nhà giáo và nhân viên y tế cấu thành nên nền tảng vững chắc của nền văn minh hiện đại."
      },
      {
        id: "t2-sport-6",
        word: "distort the moral compass",
        ipa: "/dɪˈstɔːt ðə ˈmɒrəl ˈkʌmpəs/",
        partOfSpeech: "verb",
        meaning: "Làm lệch lạc thước đo chuẩn mực đạo đức xã hội",
        basicEquivalent: "make values wrong (Band 5)",
        synonyms: ["warp societal values", "pervert moral standards"],
        collocations: ["risks distorting the moral compass", "distort social values"],
        modelSentence: "Paying performers thousands of times more than doctors risks distorting the moral compass of younger generations.",
        vietnameseSentence: "Trả lương cho người biểu diễn cao gấp hàng nghìn lần bác sĩ có nguy cơ làm lệch lạc chuẩn mực đạo đức của thế hệ trẻ."
      },
      {
        id: "t2-sport-7",
        word: "windfall tax",
        ipa: "/ˈwɪndfɔːl tæks/",
        partOfSpeech: "noun",
        meaning: "Thuế đánh vào thu nhập siêu lợi nhuận / lợi tức bất thường",
        basicEquivalent: "tax on rich money (Band 5)",
        synonyms: ["super-profit levy", "progressive surtax"],
        collocations: ["levy a windfall tax", "redistribute via windfall taxes"],
        modelSentence: "Governments could levy a modest windfall tax on mega sports contracts to subsidize nursing wages.",
        vietnameseSentence: "Chính phủ có thể đánh thuế siêu lợi tức khiêm tốn vào các hợp đồng thể thao khổng lồ để trợ cấp tiền lương cho y tá."
      },
      {
        id: "t2-sport-8",
        word: "superfluous",
        ipa: "/suːˈpɜːfluəs/",
        partOfSpeech: "adjective",
        meaning: "Không thiết yếu, xa xỉ thừa thãi so với sinh tồn cơ bản",
        basicEquivalent: "not really needed (Band 5)",
        synonyms: ["non-essential", "redundant", "dispensable"],
        collocations: ["superfluous entertainment", "superfluous to survival"],
        modelSentence: "While athletic spectacles enrich culture, they remain strictly superfluous to biological survival.",
        vietnameseSentence: "Dù các màn trình diễn thể thao làm phong phú văn hóa, chúng hoàn toàn không mang tính thiết yếu đối với sự sinh tồn sinh học."
      }
    ]
  },
  {
    id: "t2-gap-year-benefits",
    name: "Gap Year: Career Exploration & Independence vs Academic Disruption",
    vietnameseName: "Năm nghỉ ngắt quãng (Gap Year): Rèn luyện tự lập & trải nghiệm vs Gián đoạn học tập",
    tag: "Giáo dục & Thanh thiếu niên",
    icon: "Compass",
    ieltsPrompt: "In some countries young people are encouraged to work or travel for a year between finishing high school and starting university studies. Discuss the advantages and disadvantages for young people who decide to do this.",
    modelEssay: "In recent decades, taking a gap year between secondary schooling and tertiary education has become a prevalent trend worldwide. While this hiatus from formal study presents distinct hazards regarding academic continuity, I believe the advantages in maturity, practical competence, and self-discovery far outweigh the downsides.\n\nOn the one hand, deferring university enrollment carries real drawbacks. The most immediate challenge is the loss of academic momentum. Students who spend twelve months disconnected from scholastic discipline often struggle to readapt to rigorous study schedules, complex assignments, and examination pressure. Furthermore, young people who secure entry-level employment during their gap year may become seduced by immediate financial independence, leading them to abandon higher education altogether in favor of dead-end jobs that offer limited long-term career progression.\n\nOn the other hand, the merits of a productive gap year are invaluable. Firstly, high school graduates who immediately transition into university often lack practical life skills and worldly perspective. By working or travelling, young adults learn budgeting, cross-cultural communication, and emotional resilience under real-world pressures. Secondly, a year of vocational exploration clarifies academic purpose. Many school-leavers choose unsuitable majors simply because they have never experienced actual workplace environments. Exposure to diverse industries prevents costly course changes later on and yields highly motivated undergraduates who comprehend exactly why they are studying.\n\nIn conclusion, although taking time off can disrupt educational routines and tempt students away from academia, a structured gap year enriches personal maturity and clarifies life goals. So long as it is intentionally planned, a gap year constitutes an immensely empowering investment in young people's future.",
    vocabularies: [
      {
        id: "t2-gap-1",
        word: "academic momentum",
        ipa: "/ˌækəˈdemɪk məˈmentəm/",
        partOfSpeech: "noun",
        meaning: "Quán tính / đà học tập liên tục",
        basicEquivalent: "study habit (Band 5)",
        synonyms: ["scholastic drive", "learning continuity"],
        collocations: ["lose academic momentum", "maintain academic momentum"],
        modelSentence: "Taking twelve months off can cause school leavers to lose crucial academic momentum.",
        vietnameseSentence: "Nghỉ ngơi mười hai tháng có thể khiến học sinh mới tốt nghiệp đánh mất đà học tập quan trọng."
      },
      {
        id: "t2-gap-2",
        word: "worldly perspective",
        ipa: "/ˈwɜːldli pəˈspektɪv/",
        partOfSpeech: "noun",
        meaning: "Vốn sống và góc nhìn hiểu biết thực tế về cuộc đời",
        basicEquivalent: "life experience (Band 5)",
        synonyms: ["broad horizons", "worldly wisdom", "cosmopolitan outlook"],
        collocations: ["acquire a worldly perspective", "broaden worldly perspective"],
        modelSentence: "Traveling independently across foreign cultures equips young adults with an invaluable worldly perspective.",
        vietnameseSentence: "Đi du lịch độc lập qua các nền văn hóa nước ngoài trang bị cho thanh niên một vốn sống thực tế vô giá."
      },
      {
        id: "t2-gap-3",
        word: "scholastic discipline",
        ipa: "/skəˈlæstɪk ˈdɪsəplɪn/",
        partOfSpeech: "noun",
        meaning: "Tính kỷ luật và nề nếp trong học tập học thuật",
        basicEquivalent: "school rules (Band 5)",
        synonyms: ["academic rigor", "study discipline"],
        collocations: ["readapt to scholastic discipline", "instill scholastic discipline"],
        modelSentence: "Returning undergraduates often find it tough to submit to rigorous scholastic discipline once more.",
        vietnameseSentence: "Sinh viên quay lại trường thường thấy khó khăn khi phải khép mình vào nề nếp kỷ luật học tập nghiêm ngặt một lần nữa."
      },
      {
        id: "t2-gap-4",
        word: "vocational exploration",
        ipa: "/vəʊˈkeɪʃənl ˌekspləˈreɪʃn/",
        partOfSpeech: "noun",
        meaning: "Sự trải nghiệm khám phá các ngành nghề thực tế",
        basicEquivalent: "trying jobs (Band 5)",
        synonyms: ["career discovery", "occupational trial"],
        collocations: ["engage in vocational exploration", "period of vocational exploration"],
        modelSentence: "A period of vocational exploration enables students to select majors aligned with their genuine talents.",
        vietnameseSentence: "Một giai đoạn trải nghiệm nghề nghiệp cho phép sinh viên chọn các chuyên ngành phù hợp với năng khiếu thực sự của họ."
      },
      {
        id: "t2-gap-5",
        word: "dead-end job",
        ipa: "/ˌded ˈend dʒɒb/",
        partOfSpeech: "noun",
        meaning: "Công việc không có tương lai thăng tiến",
        basicEquivalent: "bad job without future (Band 5)",
        synonyms: ["stagnant employment", "unskilled job"],
        collocations: ["trapped in dead-end jobs", "settle for dead-end jobs"],
        modelSentence: "Without higher qualifications, young workers often become trapped in low-paid, dead-end jobs.",
        vietnameseSentence: "Nếu thiếu bằng cấp cao hơn, những lao động trẻ thường bị mắc kẹt trong những công việc lương thấp không có tương lai."
      },
      {
        id: "t2-gap-6",
        word: "defer enrollment",
        ipa: "/dɪˈfɜːr ɪnˈrəʊlmənt/",
        partOfSpeech: "verb",
        meaning: "Bảo lưu kết quả trúng tuyển, hoãn nhập học",
        basicEquivalent: "delay going to university (Band 5)",
        synonyms: ["postpone matriculation", "delay admission"],
        collocations: ["defer university enrollment", "granted permission to defer"],
        modelSentence: "Prestigious universities now encourage accepted candidates to defer enrollment for one academic year.",
        vietnameseSentence: "Các trường đại học danh tiếng hiện nay khuyến khích thí sinh trúng tuyển bảo lưu hoãn nhập học trong một năm."
      },
      {
        id: "t2-gap-7",
        word: "self-discovery",
        ipa: "/ˌself dɪˈskʌvəri/",
        partOfSpeech: "noun",
        meaning: "Hành trình thấu hiểu và khám phá bản thân",
        basicEquivalent: "learning about oneself (Band 5)",
        synonyms: ["personal introspection", "identity formation"],
        collocations: ["journey of self-discovery", "foster self-discovery"],
        modelSentence: "Volunteering abroad serves as a transformative catalyst for emotional maturation and self-discovery.",
        vietnameseSentence: "Hoạt động tình nguyện ở nước ngoài đóng vai trò như một chất xúc tác chuyển hóa cho sự trưởng thành cảm xúc và khám phá bản thân."
      },
      {
        id: "t2-gap-8",
        word: "hiatus",
        ipa: "/haɪˈeɪtəs/",
        partOfSpeech: "noun",
        meaning: "Khoảng thời gian tạm nghỉ, gián đoạn ngắn",
        basicEquivalent: "break time (Band 5)",
        synonyms: ["intermission", "pause", "interlude"],
        collocations: ["take a brief hiatus", "year-long hiatus"],
        modelSentence: "A year-long hiatus from homework provides exhausted teenagers with essential psychological rejuvenation.",
        vietnameseSentence: "Khoảng thời gian tạm nghỉ một năm khỏi bài tập về nhà mang lại cho thanh thiếu niên kiệt sức sự hồi phục tâm lý thiết yếu."
      }
    ]
  },
  {
    id: "t2-routine-vs-change",
    name: "Psychology: Comfort of Familiar Routine vs Embracing Constant Change",
    vietnameseName: "Tâm lý học: Sự an toàn của nếp sống quen thuộc vs Sẵn sàng đón nhận thay đổi",
    tag: "Tâm lý & Lối sống",
    icon: "RefreshCw",
    ieltsPrompt: "Some people prefer to spend their lives doing the same things and avoiding change. Others, however, think that change is always a good thing. Discuss both these views and give your own opinion.",
    modelEssay: "Human attitudes toward personal lifestyle and career paths vary greatly: some individuals seek solace in consistency and routine, while others champion perpetual change as inherently beneficial. While a stable routine provides psychological security and mastery, embracing prudent transformation prevents stagnation. In my opinion, a fulfilling life requires a harmonious balance between fundamental stability and deliberate adaptation.\n\nOn the one hand, the preference for routine is rooted in profound human psychological needs. Sticking to familiar occupations and living environments dramatically minimizes chronic anxiety and decision fatigue. Consistency allows individuals to refine specific proficiencies over decades, attaining true mastery in their trade or craft. Furthermore, predictable daily patterns foster strong community cohesion and provide dependable domestic environments for rearing children, who thrive on emotional and economic stability.\n\nOn the other hand, the belief that change is unconditionally positive reflects an appreciation for human dynamism. Reluctance to adapt inevitably breeds complacency and intellectual calcification. In an era dominated by technological disruption and economic flux, individuals who resist change risk becoming obsolete in the labor market. Moreover, stepping outside one's comfort zone stimulates neural plasticity and exposes individuals to fresh ideas, diverse cultures, and unforeseen opportunities for personal enrichment.\n\nNonetheless, treating change as an unmitigated virtue can be dangerous. Excessive disruption often manifests as restlessness, eroding long-term commitments and inducing emotional burnout. The most resilient individuals maintain a steadfast anchor of core personal values while remaining agile enough to embrace constructive transformation when circumstances demand it.\n\nIn conclusion, neither static aversion to change nor reckless pursuit of novelty offers an optimal life strategy. The secret to long-term fulfillment lies in cultivating reliable routines while remaining courageous enough to navigate new horizons.",
    vocabularies: [
      {
        id: "t2-rout-1",
        word: "decision fatigue",
        ipa: "/dɪˈsɪʒn fəˈtiːɡ/",
        partOfSpeech: "noun",
        meaning: "Sự kiệt sức tâm lý vì phải đưa ra quá nhiều lựa chọn",
        basicEquivalent: "tiredness from choosing (Band 5)",
        synonyms: ["cognitive overload", "mental exhaustion"],
        collocations: ["alleviate decision fatigue", "suffer from decision fatigue"],
        modelSentence: "Adopting uniform daily routines significantly alleviates mental anxiety and decision fatigue.",
        vietnameseSentence: "Áp dụng các nề nếp thói quen hàng ngày đồng nhất giúp giảm bớt đáng kể sự lo âu tâm lý và tình trạng kiệt sức vì lựa chọn."
      },
      {
        id: "t2-rout-2",
        word: "complacency",
        ipa: "/kəmˈpleɪsnsi/",
        partOfSpeech: "noun",
        meaning: "Sự tự mãn, thỏa mãn quá sớm dẫn đến trì trệ",
        basicEquivalent: "being too satisfied (Band 5)",
        synonyms: ["smugness", "unwarranted contentment", "stagnation"],
        collocations: ["breed complacency", "fall into complacency"],
        modelSentence: "Excessive reliance on past triumphs breeds complacency and leaves organizations vulnerable to disruption.",
        vietnameseSentence: "Sự phụ thuộc quá mức vào các thành công trong quá khứ sẽ sinh ra thói tự mãn và khiến các tổ chức dễ bị đổ vỡ."
      },
      {
        id: "t2-rout-3",
        word: "comfort zone",
        ipa: "/ˈkʌmfət zəʊn/",
        partOfSpeech: "noun",
        meaning: "Vùng an toàn quen thuộc của bản thân",
        basicEquivalent: "safe place (Band 5)",
        synonyms: ["familiar territory", "sphere of comfort"],
        collocations: ["step outside one's comfort zone", "venture beyond the comfort zone"],
        modelSentence: "Venturing beyond one's comfort zone catalyzes cognitive resilience and creative problem-solving.",
        vietnameseSentence: "Dấn thân vượt ra ngoài vùng an toàn của bản thân giúp kích hoạt sự kiên cường nhận thức và tư duy giải quyết vấn đề sáng tạo."
      },
      {
        id: "t2-rout-4",
        word: "intellectual calcification",
        ipa: "/ˌɪntəˈlektʃuəl ˌkælsɪfɪˈkeɪʃn/",
        partOfSpeech: "noun",
        meaning: "Sự xơ cứng về tư duy, bảo thủ không chịu đổi mới",
        basicEquivalent: "mind becoming hard and old (Band 5)",
        synonyms: ["mental rigidity", "dogmatic obstinacy"],
        collocations: ["prevent intellectual calcification", "risk of calcification"],
        modelSentence: "Lifelong curiosity shields professionals from the perils of intellectual calcification in old age.",
        vietnameseSentence: "Sự tò mò học hỏi suốt đời bảo vệ các chuyên gia khỏi những hiểm họa xơ cứng tư duy khi về già."
      },
      {
        id: "t2-rout-5",
        word: "psychological security",
        ipa: "/ˌsaɪkəˈlɒdʒɪkl sɪˈkjʊərəti/",
        partOfSpeech: "noun",
        meaning: "Cảm giác an toàn và vững tâm về mặt tâm lý",
        basicEquivalent: "feeling safe inside (Band 5)",
        synonyms: ["emotional peace", "mental serenity"],
        collocations: ["foster psychological security", "provide psychological security"],
        modelSentence: "Predictable workplace expectations cultivate psychological security and enhance team retention.",
        vietnameseSentence: "Những kỳ vọng rõ ràng tại nơi làm việc nuôi dưỡng sự an tâm về tâm lý và nâng cao tỷ lệ gắn bó của đội ngũ."
      },
      {
        id: "t2-rout-6",
        word: "unmitigated virtue",
        ipa: "/ʌnˈmɪtɪɡeɪtɪd ˈvɜːtʃuː/",
        partOfSpeech: "noun",
        meaning: "Một điều tốt đẹp tuyệt đối không chút nhược điểm",
        basicEquivalent: "completely good thing (Band 5)",
        synonyms: ["flawless benefit", "unqualified good"],
        collocations: ["view as an unmitigated virtue", "not an unmitigated virtue"],
        modelSentence: "Constant organizational restructuring should not be romanticized as an unmitigated virtue.",
        vietnameseSentence: "Việc liên tục tái cấu trúc tổ chức không nên được lý tưởng hóa như một điều tốt đẹp hoàn hảo tuyệt đối."
      },
      {
        id: "t2-rout-7",
        word: "emotional burnout",
        ipa: "/ɪˈməʊʃənl ˈbɜːnaʊt/",
        partOfSpeech: "noun",
        meaning: "Sự kiệt quệ cảm xúc do căng thẳng kéo dài",
        basicEquivalent: "too tired feeling (Band 5)",
        synonyms: ["nervous exhaustion", "chronic mental fatigue"],
        collocations: ["induce emotional burnout", "recover from burnout"],
        modelSentence: "Coping with perpetual workplace volatility frequently induces severe emotional burnout.",
        vietnameseSentence: "Đối phó với sự biến động không ngừng tại nơi làm việc thường xuyên gây ra tình trạng kiệt quệ cảm xúc nghiêm trọng."
      },
      {
        id: "t2-rout-8",
        word: "steadfast anchor",
        ipa: "/ˈstedfɑːst ˈæŋkər/",
        partOfSpeech: "noun",
        meaning: "Mỏ neo vững chắc giữ cho tâm trí không bị chao đảo",
        basicEquivalent: "strong hold (Band 5)",
        synonyms: ["unshakable pillar", "grounding foundation"],
        collocations: ["serve as a steadfast anchor", "maintain a steadfast anchor"],
        modelSentence: "Cherished family traditions serve as a steadfast anchor amidst tumultuous sociopolitical upheavals.",
        vietnameseSentence: "Những truyền thống gia đình quý báu đóng vai trò như một mỏ neo vững chắc giữa những biến động chính trị xã hội đầy bão táp."
      }
    ]
  },
  {
    id: "t2-celebrity-media-privacy",
    name: "Mass Media: Celebrity Voyeurism & Commercial Profit vs Inherent Privacy Rights",
    vietnameseName: "Truyền thông đại chúng: Sự tò mò đời tư người nổi tiếng vs Quyền riêng tư cơ bản",
    tag: "Truyền thông & Đạo đức báo chí",
    icon: "Eye",
    ieltsPrompt: "Many newspapers, magazines, and social media channels feature intrusive stories about the private lives of famous people. We are shown what they eat, who they date, and their private family moments. To what extent should the media respect the privacy of public figures?",
    modelEssay: "The relentless media obsession with the private affairs of celebrities—ranging from romantic relationships to family disputes—has become a hallmark of contemporary tabloid journalism. While proponents claim that public visibility is the natural price of fame, I firmly believe that the press must respect reasonable boundaries of privacy, and that the exploitation of intimate personal lives causes profound psychological harm.\n\nOn the one hand, sensationalist publications argue that scrutiny is part of the unspoken bargain of stardom. High-profile actors, musicians, and athletes deliberately court publicity to elevate their commercial brand, secure corporate endorsements, and boost album or ticket sales. Having willingly leveraged public curiosity to attain immense wealth and influence, critics argue they cannot suddenly demand complete opacity when media coverage turns inconvenient. Furthermore, in cases involving public morality, lawbreaking, or hypocritical behavior, investigative reporting serves a legitimate whistleblowing function.\n\nOn the other hand, the entitlement to basic human dignity and psychological safety does not vanish upon achieving fame. The relentless pursuit by paparazzi and paparazzi drones crosses ethical lines into stalking and harassment. Relentless intrusion into intimate domestic realms strips individuals of their fundamental sanctuary, frequently provoking severe depression, substance abuse, and even physical endangerment. More deplorably, media intrusion routinely targets celebrities' innocent children, who never chose public life and deserve uncompromised shielding from toxic public voyeurism.\n\nIn conclusion, a clear distinction must be established between public professional activities and inviolable domestic sanctuaries. While journalists have every right to critique an artist's professional output or expose genuine malfeasance, stalking their private homes and harassing their families represents an unacceptable abuse of press freedom that warrants stringent regulatory penalties.",
    vocabularies: [
      {
        id: "t2-celeb-1",
        word: "tabloid journalism",
        ipa: "/ˈtæblɔɪd ˈdʒɜːnəlɪzəm/",
        partOfSpeech: "noun",
        meaning: "Báo chí lá cải, chuyên giật gân soi mói đời tư",
        basicEquivalent: "gossip newspaper (Band 5)",
        synonyms: ["yellow journalism", "sensationalist press", "gossip rags"],
        collocations: ["hallmark of tabloid journalism", "victims of tabloid journalism"],
        modelSentence: "Tabloid journalism relentlessly trades intimate celebrity suffering for advertising clicks.",
        vietnameseSentence: "Báo chí lá cải không ngừng đánh đổi nỗi đau đớn riêng tư của người nổi tiếng lấy lượt bấm quảng cáo."
      },
      {
        id: "t2-celeb-2",
        word: "intrusive scrutiny",
        ipa: "/ɪnˈtruːsɪv ˈskruːtəni/",
        partOfSpeech: "noun",
        meaning: "Sự soi mói xâm phạm đời tư quá mức",
        basicEquivalent: "too much looking into life (Band 5)",
        synonyms: ["invasive surveillance", "unwarranted snooping"],
        collocations: ["subjected to intrusive scrutiny", "escape intrusive scrutiny"],
        modelSentence: "Constant intrusive scrutiny prevents high-profile artists from enjoying peaceful family outings.",
        vietnameseSentence: "Sự soi mói xâm phạm đời tư liên miên ngăn cản các nghệ sĩ tên tuổi tận hưởng những buổi đi chơi gia đình yên bình."
      },
      {
        id: "t2-celeb-3",
        word: "paparazzi",
        ipa: "/ˌpæpəˈrætsi/",
        partOfSpeech: "noun",
        meaning: "Tay săn ảnh người nổi tiếng",
        basicEquivalent: "photo hunters (Band 5)",
        synonyms: ["freelance celebrity photographers", "press hounds"],
        collocations: ["hounded by paparazzi", "paparazzi harassment"],
        modelSentence: "Reckless motorcycle pursuits by aggressive paparazzi present grave hazards to road users.",
        vietnameseSentence: "Những cuộc rượt đuổi bằng xe máy liều lĩnh của các tay săn ảnh hung hãn gây ra những mối nguy hiểm nghiêm trọng cho người tham gia giao thông."
      },
      {
        id: "t2-celeb-4",
        word: "domestic sanctuary",
        ipa: "/dəˈmestɪk ˈsæŋktʃuəri/",
        partOfSpeech: "noun",
        meaning: "Chốn bình yên riêng tư bất khả xâm phạm tại gia đình",
        basicEquivalent: "safe private home (Band 5)",
        synonyms: ["private refuge", "intimate haven"],
        collocations: ["inviolable domestic sanctuary", "breach a domestic sanctuary"],
        modelSentence: "Every human being requires an inviolable domestic sanctuary where cameras cannot penetrate.",
        vietnameseSentence: "Mỗi con người đều cần một chốn bình yên tại gia bất khả xâm phạm, nơi mà máy ảnh không thể thâm nhập."
      },
      {
        id: "t2-celeb-5",
        word: "sensationalist",
        ipa: "/senˈseɪʃənəlɪst/",
        partOfSpeech: "adjective",
        meaning: "Giật gân, câu khách rẻ tiền",
        basicEquivalent: "shocking on purpose (Band 5)",
        synonyms: ["lurid", "scandal-mongering", "yellow"],
        collocations: ["sensationalist headlines", "sensationalist reporting"],
        modelSentence: "Sensationalist websites fabricate scandalous break-ups simply to manipulate engagement algorithms.",
        vietnameseSentence: "Các trang web giật gân bịa đặt những vụ chia tay bê bối chỉ đơn giản để thao túng thuật toán tương tác."
      },
      {
        id: "t2-celeb-6",
        word: "unspoken bargain",
        ipa: "/ʌnˈspəʊkən ˈbɑːɡən/",
        partOfSpeech: "noun",
        meaning: "Thỏa thuận ngầm định không nói ra",
        basicEquivalent: "secret deal (Band 5)",
        synonyms: ["implicit pact", "tacit contract"],
        collocations: ["part of the unspoken bargain", "unspoken bargain of fame"],
        modelSentence: "Some claim that surrendering personal privacy is part of the unspoken bargain of high celebrity compensation.",
        vietnameseSentence: "Một số người cho rằng việc từ bỏ sự riêng tư cá nhân là một phần của thỏa thuận ngầm định đổi lấy thù lao ngôi sao kếch xù."
      },
      {
        id: "t2-celeb-7",
        word: "whistleblowing",
        ipa: "/ˈwɪslbləʊɪŋ/",
        partOfSpeech: "noun",
        meaning: "Sự tố giác, vạch trần cái sai vì lợi ích công chúng",
        basicEquivalent: "telling the truth about crimes (Band 5)",
        synonyms: ["investigative exposure", "public interest reporting"],
        collocations: ["legitimate whistleblowing", "whistleblowing function"],
        modelSentence: "Investigative journalists perform crucial whistleblowing when exposing corrupt donations among civic leaders.",
        vietnameseSentence: "Các nhà báo điều tra thực hiện chức năng tố giác trọng yếu khi vạch trần các khoản quyên góp tham nhũng trong giới lãnh đạo dân sự."
      },
      {
        id: "t2-celeb-8",
        word: "public voyeurism",
        ipa: "/ˈpʌblɪk vɔɪˈjɜːrɪzəm/",
        partOfSpeech: "noun",
        meaning: "Thói tò mò thích nhìn trộm đời tư người khác của công chúng",
        basicEquivalent: "watching others' private life (Band 5)",
        synonyms: ["mass snooping", "morbid curiosity"],
        collocations: ["feed public voyeurism", "toxic public voyeurism"],
        modelSentence: "Broadcasting unvetted footage of celebrities' grief merely serves toxic public voyeurism.",
        vietnameseSentence: "Phát sóng các thước phim chưa được kiểm chứng về nỗi đau buồn của người nổi tiếng chỉ nhằm phục vụ thói tò mò nhìn trộm độc hại của đám đông."
      }
    ]
  }
,
  {
    id: "t2-media-violence-censorship",
    name: "Media Ethics: Violent Content in Television & Video Games - Censorship vs Freedom",
    vietnameseName: "Đạo đức truyền thông: Cảnh bạo lực trên Tivi & Trò chơi điện tử - Kiểm duyệt vs Tự do",
    tag: "Truyền thông & Đạo đức xã hội",
    icon: "ShieldAlert",
    ieltsPrompt: "Many programs on television and computer games include violent scenes, especially action and horror movies. Some believe they should not be allowed, while others disagree. Discuss both sides and give your opinion.",
    modelEssay: "Nobody would dispute the fact that many programs on television and computer games include violent scenes, especially action and horror movies. I hold the view that they should not be allowed, however many people disagree with this opinion. In this essay, I will discuss both sides and give reasons for my opinion.\n\nFirstly, research suggests that people who watch violent programs and play violent computer games may worry more about their own safety, which can lead to problems in society. For instance, when people are worried about their safety, they are more likely to react aggressively towards strangers. Secondly, few people would contest that some children copy what they see on television and in computer games. Hence, if they are watching and interacting with violence on a daily basis it is likely that they may become desensitized to violent acts or even copy them at school or in the streets.\n\nHowever, there are those who argue that violence is not something we learn from television and computer games. For example, nobody would contest the fact that there were murders before television and videogames were invented. In addition, it is often claimed that children cannot watch violent programs and play inappropriate videogames easily. For instance, there are restrictions for some programs and games, and many parents do not allow their children to watch television after a certain time.\n\nTo conclude, although there are some reasonable arguments against higher restrictions on violent videogames and programs for children, there can be no doubt that the potential disadvantages of children copying what they see and hear in these programs and games far outweigh the advantages of having free access to them. Furthermore, current restrictions are ineffective and need to be tightened.",
    vocabularies: [
      {
        id: "t2-mv-1",
        word: "desensitization to violence",
        ipa: "/diːˌsensətaɪˈzeɪʃn tuː ˈvaɪələns/",
        partOfSpeech: "noun",
        meaning: "Hiện tượng chai sạn cảm xúc trước các hành vi bạo lực",
        basicEquivalent: "getting used to violence (Band 5)",
        synonyms: ["emotional numbing", "callousness toward brutality"],
        collocations: ["lead to desensitization to violence", "exhibit desensitization"],
        modelSentence: "Chronic exposure to graphic horror movies leads to gradual desensitization to real-world violence among adolescents.",
        vietnameseSentence: "Việc tiếp xúc triền miên với phim kinh dị rùng rợn dẫn tới sự chai sạn cảm xúc dần dần trước bạo lực đời thực ở thanh thiếu niên."
      },
      {
        id: "t2-mv-2",
        word: "imitative behavior",
        ipa: "/ˈɪmɪtətɪv bɪˈheɪvjə/",
        partOfSpeech: "noun",
        meaning: "Hành vi sao chép, bắt chước theo khuôn mẫu quan sát được",
        basicEquivalent: "copying what you see (Band 5)",
        synonyms: ["emulative actions", "mimetic conduct"],
        collocations: ["trigger imitative behavior", "copycat violence"],
        modelSentence: "Psychologists caution that graphic fight simulations frequently trigger dangerous imitative behavior on school playgrounds.",
        vietnameseSentence: "Các nhà tâm lý học cảnh báo rằng mô phỏng đấm đá bạo lực thường kích hoạt hành vi bắt chước nguy hiểm trên sân trường."
      },
      {
        id: "t2-mv-3",
        word: "age-gate verification",
        ipa: "/ˈeɪdʒ ɡeɪt ˌverɪfɪˈkeɪʃn/",
        partOfSpeech: "noun",
        meaning: "Cơ chế xác thực độ tuổi nghiêm ngặt trên nền tảng kỹ thuật số",
        basicEquivalent: "checking age before playing (Band 5)",
        synonyms: ["age-verification hurdle", "digital identity check"],
        collocations: ["enforce age-gate verification", "robust age-gate verification"],
        modelSentence: "Online video platforms should enforce stringent biometric age-gate verification to shield minors from explicit media.",
        vietnameseSentence: "Các nền tảng video trực tuyến nên thực thi cơ chế xác thực độ tuổi sinh trắc học nghiêm ngặt để bảo vệ trẻ vị thành niên khỏi nội dung nhạy cảm."
      },
      {
        id: "t2-mv-4",
        word: "amplify public anxiety",
        ipa: "/ˈæmplɪfaɪ ˈpʌblɪk æŋˈzaɪəti/",
        partOfSpeech: "phrase",
        meaning: "Khuếch đại nỗi hoang mang lo âu của công chúng",
        basicEquivalent: "make people more scared (Band 5)",
        synonyms: ["heighten collective fear", "fuel social paranoia"],
        collocations: ["tend to amplify public anxiety", "media amplify public anxiety"],
        modelSentence: "Sensationalist media crime broadcasts amplify public anxiety regarding everyday personal safety.",
        vietnameseSentence: "Các chương trình tội phạm giật gân khuếch đại nỗi lo âu của công chúng về an toàn thường nhật."
      },
      {
        id: "t2-mv-5",
        word: "unfounded assertion",
        ipa: "/ʌnˈfaʊndɪd əˈsɜːʃn/",
        partOfSpeech: "noun",
        meaning: "Lời khẳng định vô căn cứ thiếu dữ liệu thực nghiệm",
        basicEquivalent: "saying things without proof (Band 5)",
        synonyms: ["baseless claim", "unsubstantiated allegation"],
        collocations: ["dismiss as an unfounded assertion", "make unfounded assertions"],
        modelSentence: "Claiming that video games are the sole cause of youth delinquency is an unfounded assertion.",
        vietnameseSentence: "Khẳng định rằng trò chơi điện tử là nguyên nhân duy nhất dẫn đến phạm pháp vị thành niên là một lời khẳng định vô căn cứ."
      }
    ]
  },
  {
    id: "t2-space-exploration-funding",
    name: "Public Spending: Astronomical Space Exploration Budgets vs Urgent Terrestrial Needs",
    vietnameseName: "Chi tiêu công: Ngân sách thám hiểm không gian vũ trụ vs Nhu cầu cấp bách trên Trái Đất",
    tag: "Chính phủ & Khoa học vũ trụ",
    icon: "Rocket",
    ieltsPrompt: "Some people think that more money should be invested into space exploration as it is a vital form of investigation for the future of humanity, while others believe it is a waste of vital funding which could otherwise be used towards more important projects here on earth. Discuss both views and give your opinion.",
    modelEssay: "The allocation of colossal national budgets toward space exploration remains one of the most contentious geopolitical debates. While detractors argue that financing interstellar missions is an unconscionable luxury when acute crises persist on Earth, proponents contend that astronomical research is indispensable for our species' long-term preservation. In my opinion, while humanitarian needs must remain paramount, prudent investment in space science yields technological spin-offs that actively benefit terrestrial civilization.\n\nOn the one hand, critics of space exploration articulate a compelling moral case centered on immediate planetary crises. Millions of people across underdeveloped regions endure severe food deprivation, precarious healthcare systems, and degraded infrastructure. Funneling hundreds of billions of dollars into Martian orbiters and lunar probes appears inexcusably wasteful when such capital could eradicate preventable diseases or accelerate the global transition to renewable energy. From this perspective, governments have a fundamental duty to resolve terrestrial emergencies before pursuing cosmic ambitions that offer no immediate return to vulnerable populations.\n\nOn the other hand, defenders of cosmic research argue that space investigation is the supreme catalyst for human scientific advancement. Crucial innovations that modern society takes for granted—such as satellite telecommunications, global meteorological tracking, water purification technologies, and lightweight solar cells—were originally conceived as solutions for aerospace challenges. Furthermore, Earth possesses finite mineral resources and remains vulnerable to catastrophic asteroid impacts or environmental collapse. Pioneering extraterrestrial habitats and asteroid mining provides a vital survival buffer against existential risks that could otherwise extinguish human civilization.\n\nIn conclusion, rather than viewing space research and terrestrial welfare as mutually exclusive endeavors, governments should adopt a hybrid model. Public funding should primarily focus on resolving immediate socio-economic inequalities, while space initiatives should be co-financed through private-public partnerships to maximize innovation without straining public coffers.",
    vocabularies: [
      {
        id: "t2-space-1",
        word: "terrestrial priorities",
        ipa: "/təˈrestriəl praɪˈɒrətiz/",
        partOfSpeech: "noun",
        meaning: "Các mục tiêu cấp bách cần ưu tiên giải quyết trên Trái Đất",
        basicEquivalent: "earth problems (Band 5)",
        synonyms: ["planetary emergencies", "domestic welfare needs"],
        collocations: ["address terrestrial priorities", "focus on terrestrial priorities"],
        modelSentence: "Opponents of Mars expeditions argue that taxpayer billions should directly target urgent terrestrial priorities like famine.",
        vietnameseSentence: "Những người phản đối thám hiểm sao Hỏa cho rằng tiền thuế hàng tỷ đô nên nhắm thẳng vào các mục tiêu ưu tiên trên Trái Đất như nạn đói."
      },
      {
        id: "t2-space-2",
        word: "astronomical fiscal burden",
        ipa: "/ˌæstrəˈnɒmɪkl ˈfɪskl ˈbɜːdn/",
        partOfSpeech: "noun",
        meaning: "Gánh nặng tài khóa khổng lồ đè nặng lên ngân sách nhà nước",
        basicEquivalent: "huge cost for country (Band 5)",
        synonyms: ["colossal budgetary drain", "monumental public expenditure"],
        collocations: ["impose an astronomical fiscal burden", "alleviate astronomical burdens"],
        modelSentence: "Financing deep-space colonization missions imposes an astronomical fiscal burden on heavily indebted public treasuries.",
        vietnameseSentence: "Tài trợ cho các sứ mệnh định cư ngoài vũ trụ sâu đè nặng một gánh nặng tài khóa khổng lồ lên ngân khố quốc gia đang nợ nần."
      },
      {
        id: "t2-space-3",
        word: "technological spin-off",
        ipa: "/ˌteknəˈlɒdʒɪkl ˈspɪn ɒf/",
        partOfSpeech: "noun",
        meaning: "Sản phẩm công nghệ phụ phát sinh hữu ích cho đời sống",
        basicEquivalent: "useful byproduct invention (Band 5)",
        synonyms: ["ancillary breakthrough", "derivative innovation"],
        collocations: ["produce valuable technological spin-offs", "civilian spin-offs"],
        modelSentence: "Aerospace research produced myriad technological spin-offs, including memory foam and advanced water purification filtration.",
        vietnameseSentence: "Nghiên cứu hàng không vũ trụ đã tạo ra vô số phát minh phụ hữu ích, bao gồm bọt đệm hoạt tính và lọc nước tinh khiết tân tiến."
      },
      {
        id: "t2-space-4",
        word: "public-private consortium",
        ipa: "/ˈpʌblɪk ˈpraɪvət kənˈsɔːtiəm/",
        partOfSpeech: "noun",
        meaning: "Liên danh hợp tác giữa chính phủ và khối doanh nghiệp tư",
        basicEquivalent: "government and company team (Band 5)",
        synonyms: ["joint public-private syndicate", "collaborative venture"],
        collocations: ["form a public-private consortium", "financed by a consortium"],
        modelSentence: "Commercial space exploration is increasingly financed through a public-private consortium rather than solely by state coffers.",
        vietnameseSentence: "Thám hiểm không gian thương mại đang ngày càng được tài trợ qua liên danh công-tư thay vì chỉ dựa vào ngân sách nhà nước."
      },
      {
        id: "t2-space-5",
        word: "existential buffer",
        ipa: "/ˌeɡzɪˈstenʃl ˈbʌfə/",
        partOfSpeech: "noun",
        meaning: "Vùng đệm phòng ngừa nguy cơ tuyệt chủng của nhân loại",
        basicEquivalent: "way to save humans (Band 5)",
        synonyms: ["civilizational safeguard", "survival backup"],
        collocations: ["provide an existential buffer", "serve as an existential buffer"],
        modelSentence: "Establishing self-sustaining extraterrestrial colonies provides an existential buffer against catastrophic planetary collisions.",
        vietnameseSentence: "Thành lập các tiền đồn ngoài hành tinh tự duy trì tạo ra một vùng đệm sinh tồn phòng ngừa các vụ va chạm thiên thể thảm khốc."
      }
    ]
  },
  {
    id: "t2-sedentary-lifestyle-health",
    name: "Public Health: The Paradox of Proliferating Gyms and Widespread Sedentary Lifestyles",
    vietnameseName: "Y tế công cộng: Nghịch lý bùng nổ phòng gym nhưng lối sống lười vận động vẫn lan rộng",
    tag: "Sức khỏe cộng đồng & Đô thị",
    icon: "HeartPulse",
    ieltsPrompt: "Despite a large number of gyms and fitness centers, a sedentary lifestyle is gaining popularity in the contemporary world. What problems are associated with this? What solutions can you suggest?",
    modelEssay: "In recent decades, urban centers have witnessed an unprecedented boom in fitness clubs and commercial wellness centers. Paradoxically, public health data indicates that hypokinetic and sedentary lifestyles are more entrenched than ever. This disconnect fosters grave physiological vulnerabilities and calls for comprehensive systemic interventions rather than superficial consumer remedies.\n\nThe repercussions of widespread physical inactivity are profound and multifaceted. At an individual physiological level, protracted sitting is inextricably linked to non-communicable illnesses, including cardiovascular diseases, type 2 diabetes, postural deformities, and morbid obesity. In addition to physical deterioration, prolonged inactivity exacerbates chronic mental health conditions such as workplace anxiety and depressive disorders, as human neurobiology relies heavily on regular exertion to regulate endorphins and cortisol. At a macro-economic level, this physical malaise places an unsustainable strain on state medical budgets and undermines workplace productivity through escalating sick leave and chronic fatigue.\n\nTo dismantle this sedentary trend, a multifaceted strategy is imperative. Firstly, corporate employers must radically reconfigure modern office environments. Because long desk hours are the primary driver of physical inertia, businesses should introduce ergonomic standing desks, mandate structured movement breaks, and sponsor active commuting programs. Secondly, municipal authorities must invest aggressively in active urban architecture. While commercial gyms charge prohibitive membership subscriptions that exclude lower-income demographics, cities should build accessible pedestrian promenades, segregated cycling networks, and open-air public workout parks. Transforming everyday movement into an effortless, cost-free default option eliminates the behavioral barriers associated with private gym attendance.\n\nIn conclusion, the proliferation of private fitness facilities cannot mask the urgent public health crisis posed by sedentary habits. Only by integrating active movement into corporate structures and urban planning can societies reverse physical stagnation and foster lasting public vitality.",
    vocabularies: [
      {
        id: "t2-sed-1",
        word: "hypokinetic diseases",
        ipa: "/ˌhaɪpəʊkɪˈnetɪk dɪˈziːzɪz/",
        partOfSpeech: "noun",
        meaning: "Các bệnh lý mãn tính phát sinh do thiếu hụt vận động thể chất",
        basicEquivalent: "illnesses from not moving (Band 5)",
        synonyms: ["inactivity-induced ailments", "sedentary afflictions"],
        collocations: ["suffer from hypokinetic diseases", "combat hypokinetic conditions"],
        modelSentence: "Cardiovascular disorders and hypertension are prominent hypokinetic diseases afflicting sedentary desk-bound executives.",
        vietnameseSentence: "Rối loạn tim mạch và cao huyết áp là những bệnh lý thiếu vận động nổi cộm đang hành hạ giới văn phòng ngồi nhiều."
      },
      {
        id: "t2-sed-2",
        word: "screen dependency",
        ipa: "/skriːn dɪˈpendənsi/",
        partOfSpeech: "noun",
        meaning: "Hội chứng lệ thuộc quá mức vào màn hình kỹ thuật số",
        basicEquivalent: "looking at phones too much (Band 5)",
        synonyms: ["digital fixation", "electronic addiction"],
        collocations: ["alleviate screen dependency", "severe screen dependency"],
        modelSentence: "Unchecked screen dependency severely curtails the daily physical activity of contemporary adolescents.",
        vietnameseSentence: "Hội chứng lệ thuộc màn hình không kiểm soát làm cắt giảm nghiêm trọng hoạt động thể chất hàng ngày của thanh thiếu niên thời nay."
      },
      {
        id: "t2-sed-3",
        word: "ergonomic workplace intervention",
        ipa: "/ˌɜːɡəˈnɒmɪk ˈwɜːkpleɪs ˌɪntəˈvenʃn/",
        partOfSpeech: "noun",
        meaning: "Giải pháp can thiệp công thái học cải thiện môi trường làm việc",
        basicEquivalent: "making office healthy (Band 5)",
        synonyms: ["occupational postural reform", "workplace health design"],
        collocations: ["implement ergonomic workplace interventions", "subsidize ergonomic changes"],
        modelSentence: "Introducing sit-stand workstations is a cost-effective ergonomic workplace intervention that combats spinal compression.",
        vietnameseSentence: "Áp dụng bàn làm việc đứng-ngồi là một can thiệp công thái học tiết kiệm chi phí giúp chống lại chứng chèn ép cột sống."
      },
      {
        id: "t2-sed-4",
        word: "inextricably linked",
        ipa: "/ˌɪnɪkˈstrɪkəbli lɪŋkt/",
        partOfSpeech: "phrase",
        meaning: "Gắn kết hữu cơ chặt chẽ không thể tách rời",
        basicEquivalent: "connected strongly (Band 5)",
        synonyms: ["inseparable", "integrally tied"],
        collocations: ["are inextricably linked with", "inextricably interwoven"],
        modelSentence: "Mental equilibrium and regular physical exertion are inextricably linked within human evolutionary biology.",
        vietnameseSentence: "Sự cân bằng tâm thần và hoạt động thể chất thường xuyên gắn kết chặt chẽ không thể tách rời trong sinh học tiến hóa."
      },
      {
        id: "t2-sed-5",
        word: "active urban architecture",
        ipa: "/ˈæktɪv ˈɜːbən ˈɑːkɪtektʃə/",
        partOfSpeech: "noun",
        meaning: "Quy hoạch kiến trúc đô thị khuyến khích vận động thể chất",
        basicEquivalent: "city design for walking (Band 5)",
        synonyms: ["pedestrian-centric urbanism", "walkable city design"],
        collocations: ["invest in active urban architecture", "principles of active urban architecture"],
        modelSentence: "Cities investing in active urban architecture boast lower cardiovascular hospitalization rates among citizens.",
        vietnameseSentence: "Các thành phố đầu tư vào kiến trúc đô thị khuyến khích vận động ghi nhận tỷ lệ nhập viện vì tim mạch thấp hơn ở người dân."
      }
    ]
  },
  {
    id: "t2-corruption-capital-flight",
    name: "Governance & Economics: Institutional Corruption and Capital Flight in Developing Nations",
    vietnameseName: "Quản trị công & Kinh tế: Nạn tham nhũng thể chế và dòng vốn tháo chạy ở các nước nghèo",
    tag: "Kinh tế vĩ mô & Quản trị công",
    icon: "Landmark",
    ieltsPrompt: "In many developing nations, institutional corruption and the rapid outflow of private investments represent the greatest impediments to economic prosperity. What are the consequences of these issues, and how can governments effectively mitigate them?",
    modelEssay: "For emerging economies striving for sustainable modern development, structural integrity and financial stability are fundamental prerequisites. However, systemic corruption within positions of power, coupled with the rapid flight of private capital, continues to cripple economic growth across developing nations. Addressing these formidable barriers requires vigorous institutional reforms and transparent fiscal management.\n\nThe ramifications of unchecked institutional graft and investment flight are devastating for national progress. Firstly, political and bureaucratic corruption misallocates vital public funds away from schools, hospitals, and critical transport networks into the private pockets of corrupt officials. This systemic malfeasance distorts market competition and erodes the rule of law. Consequently, international corporations and domestic entrepreneurs lose confidence in the regulatory landscape; fearing extortion and arbitrary confiscation, they withdraw liquid assets, precipitating rapid capital flight. As foreign and domestic capital flees overseas, currency reserves depreciate, unemployment accelerates, and vulnerable populations are pushed deeper into generational poverty.\n\nTo effectively neutralize these crises, governments must implement uncompromising administrative overhauls. The primary measure is the total digitization of public procurement, tax collection, and commercial licensing. By deploying transparent electronic portals and automated audit algorithms, administrations can eliminate human discretion—the primary breeding ground for illicit bribery. Furthermore, states must guarantee genuine judicial independence and establish autonomous anti-corruption commissions empowered to prosecute high-ranking offenders without political interference. In tandem with strict enforcement, governments should establish stable macroeconomic policies, including robust property rights and tax incentives for domestic reinvestment, thereby reassuring investors that their capital remains secure within national borders.\n\nIn conclusion, corruption in official corridors and the ensuing loss of investment represent existential threats to developing economies. Through aggressive digital transparency, uncompromising legal enforcement, and investor protection, nations can restore institutional credibility and establish a resilient foundation for long-term prosperity.",
    vocabularies: [
      {
        id: "t2-corr-1",
        word: "institutional graft",
        ipa: "/ˌɪnstɪˈtjuːʃənl ɡrɑːft/",
        partOfSpeech: "noun",
        meaning: "Tình trạng tham nhũng ăn sâu vào bộ máy thể chế công quyền",
        basicEquivalent: "corruption in offices (Band 5)",
        synonyms: ["systemic venality", "bureaucratic embezzlement"],
        collocations: ["combat institutional graft", "endemic institutional graft"],
        modelSentence: "Endemic institutional graft severely depresses the efficiency of capital allocation across state infrastructure contracts.",
        vietnameseSentence: "Nạn tham nhũng thể chế thâm căn cố đế làm suy giảm nghiêm trọng hiệu quả phân bổ vốn trong các dự án hạ tầng công."
      },
      {
        id: "t2-corr-2",
        word: "illicit capital flight",
        ipa: "/ɪˈlɪsɪt ˈkæpɪtl flaɪt/",
        partOfSpeech: "noun",
        meaning: "Hiện tượng tháo chạy dòng vốn bất hợp pháp ra nước ngoài",
        basicEquivalent: "money running out illegally (Band 5)",
        synonyms: ["unauthorized asset relocation", "clandestine wealth drainage"],
        collocations: ["halt illicit capital flight", "accelerate capital flight"],
        modelSentence: "Developing economies lose billions each year due to illicit capital flight shielded behind complex offshore banking havens.",
        vietnameseSentence: "Các nền kinh tế đang phát triển thất thoát hàng tỷ đô mỗi năm do dòng vốn tháo chạy phi pháp ẩn sau các thiên đường thuế bí mật."
      },
      {
        id: "t2-corr-3",
        word: "judicial independence",
        ipa: "/dʒuːˈdɪʃl ˌɪndɪˈpendəns/",
        partOfSpeech: "noun",
        meaning: "Tính độc lập không bị chi phối chính trị của ngành tòa án",
        basicEquivalent: "judges being fair (Band 5)",
        synonyms: ["autonomous judiciary", "unbiased legal administration"],
        collocations: ["uphold judicial independence", "threaten judicial independence"],
        modelSentence: "Foreign investors demand rock-solid judicial independence before committing long-term private manufacturing capital.",
        vietnameseSentence: "Các nhà đầu tư nước ngoài đòi hỏi tính độc lập tư pháp vững chắc như bàn thạch trước khi cam kết rót vốn sản xuất dài hạn."
      },
      {
        id: "t2-corr-4",
        word: "precipitate rapid flight",
        ipa: "/prɪˈsɪpɪteɪt ˈræpɪd flaɪt/",
        partOfSpeech: "phrase",
        meaning: "Làm bùng phát cuộc tháo chạy tài sản đột ngột",
        basicEquivalent: "cause money to run away (Band 5)",
        synonyms: ["trigger asset exodus", "spark capital withdrawal"],
        collocations: ["political instability precipitates rapid flight", "tax hikes precipitate flight"],
        modelSentence: "Threats of arbitrary asset expropriation precipitate rapid flight of foreign venture funding.",
        vietnameseSentence: "Các nguy cơ quốc hữu hóa tài sản tùy tiện làm bùng phát cuộc tháo chạy nhanh chóng của vốn đầu tư mạo hiểm nước ngoài."
      },
      {
        id: "t2-corr-5",
        word: "dismantle systemic bribery",
        ipa: "/dɪsˈmæntl sɪˈstemɪk ˈbraɪbəri/",
        partOfSpeech: "phrase",
        meaning: "Triệt tiêu nạn đưa nhận hối lộ có hệ thống",
        basicEquivalent: "stop bribery everywhere (Band 5)",
        synonyms: ["eradicate institutional kickbacks", "purge corrupt practices"],
        collocations: ["measures to dismantle systemic bribery", "campaign to dismantle bribery"],
        modelSentence: "Deploying automated procurement portals helped the ministry dismantle systemic bribery within road construction contracts.",
        vietnameseSentence: "Việc triển khai cổng đấu thầu tự động đã giúp bộ triệt tiêu nạn đưa hối lộ có hệ thống trong các gói thầu làm đường."
      }
    ]
  },
  {
    id: "t2-journalism-ethics-distortion",
    name: "Media Literacy: Distortion of Truth in Commercial Journalism vs Public Accountability",
    vietnameseName: "Tư duy truyền thông: Sự bóp méo sự thật trong báo chí thương mại vs Trách nhiệm giải trình",
    tag: "Báo chí & Đạo đức truyền thông",
    icon: "Newspaper",
    ieltsPrompt: "It is often argued that newspapers and modern digital media channels frequently distort the truth to pursue commercial profit, thereby misleading the general public. To what extent do you agree or disagree with this view?",
    modelEssay: "It is probably true to say that newspapers, digital publishers, and social media newsfeeds frequently distort the truth in contemporary society. In an era dominated by instantaneous digital circulation and commercial advertising metrics, the temptation to sensationalize reporting has compromised journalistic integrity. While I agree that profit incentives routinely skew media narratives, it is important to recognize that responsible, truth-seeking journalism still plays a vital democratic role.\n\nThe commercial model of 21st-century media undeniably incentivizes the manipulation of facts. Traditional print publications once depended on loyal subscriptions, but contemporary digital platforms survive purely on algorithmic engagement, user clicks, and viral sharing. Because shocking headlines and partisan controversies trigger far greater emotional reactions than nuanced analysis, media corporations frequently employ hyperbolic phrasing, quote out of context, and omit countervailing evidence. Furthermore, media consolidation has placed influential broadcasting networks into the hands of corporate conglomerates and political oligarchs who deliberately manufacture public consent to protect their vested financial interests.\n\nNevertheless, dismissing all journalistic output as dishonest fabrications would be an unwarranted oversimplification. Reputable news organizations and independent investigative journalists continue to adhere to strict ethical codes, rigorous fact-checking, and cross-verification before publishing sensitive stories. Across history and within modern societies, intrepid reporters have risked personal safety to expose governmental corruption, environmental crimes, and corporate malpractice. Without dedicated investigative journalists holding powerful entities accountable, democratic oversight would collapse entirely.\n\nIn conclusion, while commercial pressures and engagement algorithms undoubtedly induce many news outlets to distort reality for financial gain, legitimate investigative journalism remains a foundational bulwark of a free society. Rather than succumbing to cynical mistrust, citizens must cultivate sharp media literacy skills to distinguish between sensationalist manipulation and rigorous, evidence-based reporting.",
    vocabularies: [
      {
        id: "t2-journ-1",
        word: "sensationalist distortion",
        ipa: "/senˈseɪʃənəlɪst dɪˈstɔːʃn/",
        partOfSpeech: "noun",
        meaning: "Sự bóp méo tin tức giật gân rẻ tiền để câu kéo tương tác",
        basicEquivalent: "making news shocking on purpose (Band 5)",
        synonyms: ["tabloid hyperbole", "lurid misrepresentation"],
        collocations: ["rely on sensationalist distortion", "criticize sensationalist distortions"],
        modelSentence: "Sensationalist distortion of medical breakthroughs generates unwarranted euphoria followed by public disillusionment.",
        vietnameseSentence: "Sự bóp méo giật gân các đột phá y học tạo ra tâm lý phấn khích vô căn cứ rồi kéo theo sự vỡ mộng của công chúng."
      },
      {
        id: "t2-journ-2",
        word: "media literacy",
        ipa: "/ˈmiːdiə ˈlɪtərəsi/",
        partOfSpeech: "noun",
        meaning: "Năng lực tư duy phản biện và thẩm định thông tin truyền thông",
        basicEquivalent: "knowing how to spot fake news (Band 5)",
        synonyms: ["information appraisal competence", "analytical news awareness"],
        collocations: ["cultivate critical media literacy", "incorporate media literacy"],
        modelSentence: "Secondary schools should teach media literacy so young citizens can recognize biased political disinformation.",
        vietnameseSentence: "Các trường trung học nên giảng dạy năng lực thẩm định truyền thông để học sinh nhận biết các thông tin chính trị sai lệch."
      },
      {
        id: "t2-journ-3",
        word: "investigative journalism",
        ipa: "/ɪnˈvestɪɡətɪv ˈdʒɜːnəlɪzəm/",
        partOfSpeech: "noun",
        meaning: "Nền báo chí điều tra chuyên sâu phanh phui tiêu cực",
        basicEquivalent: "deep research on crimes (Band 5)",
        synonyms: ["watchdog reporting", "in-depth public interest exposés"],
        collocations: ["vital role of investigative journalism", "undercover investigative journalism"],
        modelSentence: "Fearless investigative journalism is indispensable for uncovering corporate dumping of hazardous manufacturing byproducts.",
        vietnameseSentence: "Nền báo chí điều tra quả cảm là không thể thiếu để phanh phui hành vi xả thải chất độc hại của các doanh nghiệp sản xuất."
      },
      {
        id: "t2-journ-4",
        word: "erode public confidence",
        ipa: "/ɪˈrəʊd ˈpʌblɪk ˈkɒnfɪdəns/",
        partOfSpeech: "phrase",
        meaning: "Làm xói mòn niềm tin của công chúng vào xã hội",
        basicEquivalent: "make people lose trust (Band 5)",
        synonyms: ["undermine public trust", "corrode popular faith"],
        collocations: ["partisan rhetoric erodes public confidence", "scandals erode confidence"],
        modelSentence: "Retracting fabricated news stories repeatedly erodes public confidence in traditional journalistic institutions.",
        vietnameseSentence: "Việc liên tục phải đính chính các bài báo bịa đặt làm xói mòn niềm tin của công chúng vào các định chế báo chí truyền thống."
      },
      {
        id: "t2-journ-5",
        word: "manufacture public consent",
        ipa: "/ˌmænjuˈfæktʃə ˈpʌblɪk kənˈsent/",
        partOfSpeech: "phrase",
        meaning: "Thao túng truyền thông để định hướng sự đồng thuận giả tạo của đám đông",
        basicEquivalent: "make everyone agree by tricks (Band 5)",
        synonyms: ["engineer collective agreement", "manipulate mass opinion"],
        collocations: ["media used to manufacture public consent", "mechanisms that manufacture consent"],
        modelSentence: "Biased coverage was orchestrated across regional networks to manufacture public consent for unpopular mining concessions.",
        vietnameseSentence: "Việc đưa tin thiên lệch đã được sắp đặt trên các kênh địa phương nhằm tạo ra sự đồng thuận giả tạo của công chúng cho các nhượng bộ khai khoáng."
      }
    ]
  },
  {
    id: "t2-university-vs-gap-year",
    name: "Higher Education: Direct University Matriculation vs The Merits of an Experiential Gap Year",
    vietnameseName: "Giáo dục đại học: Học thẳng đại học vs Giá trị của một năm gap year trải nghiệm thực tế",
    tag: "Đại học & Định hướng nghề nghiệp",
    icon: "GraduationCap",
    ieltsPrompt: "Some people believe that it is better to take a gap year before going to university, while others think that this can be a waste of time and that going straight into higher education is the best option. Discuss both views and give your opinion.",
    modelEssay: "The transition between secondary education and tertiary academia is a defining crossroad in a student's life. While traditionalists argue that matriculating directly into higher education maintains academic discipline and accelerates career entry, an increasing body of opinion favors taking a structured gap year. In my view, provided it is approached with deliberate purpose, an experiential gap year enriches personal maturity and yields significantly more focused undergraduates.\n\nOn the one hand, proponents of continuous education emphasize scholastic momentum and economic efficiency. Students transitioning directly from high school retain active study habits, examination techniques, and intellectual discipline, allowing them to adapt quickly to university-level academic rigor. In contrast, those who take a twelve-month sabbatical frequently suffer cognitive rustiness and struggle to re-establish rigorous study routines. Furthermore, immediate enrollment ensures that students graduate at a younger age, allowing them to enter the competitive labor market earlier, accumulate professional seniority, and begin building long-term financial stability without incurring gap-year living expenses.\n\nOn the other hand, the benefits of a productive hiatus are profound. High school graduates who enter tertiary institutions immediately often do so out of unexamined social expectation, possessing minimal worldly experience or vocational self-awareness. Consequently, vast numbers of undergraduates experience burnout, change majors mid-way through their degree, or drop out after squandering substantial tuition fees. By contrast, young adults who spend a gap year working entry-level jobs, volunteering abroad, or mastering practical languages gain emotional resilience, financial literacy, and cultural adaptability. These transformative experiences clarify their professional passions, enabling them to select their degree specialization with genuine conviction.\n\nIn conclusion, although an unstructured gap year risks breeding complacency and academic detachment, a purposeful twelve-month period of work or exploration offers immense developmental dividends. Direct university enrollment guarantees efficiency, but an intentional gap year produces mature, resilient students equipped to maximize their university education.",
    vocabularies: [
      {
        id: "t2-ugy-1",
        word: "scholastic momentum",
        ipa: "/skəˈlæstɪk məˈmentəm/",
        partOfSpeech: "noun",
        meaning: "Quán tính và nề nếp học tập không bị gián đoạn",
        basicEquivalent: "habit of studying continuously (Band 5)",
        synonyms: ["academic continuity", "unbroken study discipline"],
        collocations: ["maintain scholastic momentum", "loss of scholastic momentum"],
        modelSentence: "Matriculating directly into university allows undergraduates to maintain uninterrupted scholastic momentum.",
        vietnameseSentence: "Nhập học đại học trực tiếp cho phép sinh viên duy trì được quán tính học tập liên tục không bị ngắt quãng."
      },
      {
        id: "t2-ugy-2",
        word: "experiential maturity",
        ipa: "/ɪkˌspɪəriˈenʃl məˈtʃʊərəti/",
        partOfSpeech: "noun",
        meaning: "Sự chín chắn và vốn sống tích lũy qua trải nghiệm thực tế",
        basicEquivalent: "growing up from life (Band 5)",
        synonyms: ["worldly wisdom", "practical adult competence"],
        collocations: ["foster experiential maturity", "gain experiential maturity"],
        modelSentence: "Spending a gap year independently managing personal living finances develops invaluable experiential maturity.",
        vietnameseSentence: "Dành một năm gap year tự quản lý tài chính sinh hoạt cá nhân giúp rèn luyện sự chín chắn trải nghiệm vô giá."
      },
      {
        id: "t2-ugy-3",
        word: "vocational clarity",
        ipa: "/vəʊˈkeɪʃənl ˈklærəti/",
        partOfSpeech: "noun",
        meaning: "Sự thấu suốt và định hướng rõ ràng về con đường nghề nghiệp",
        basicEquivalent: "knowing what job you want (Band 5)",
        synonyms: ["career certainty", "professional purpose"],
        collocations: ["achieve vocational clarity", "lack vocational clarity"],
        modelSentence: "Real-world apprenticeships during a gap year grant school-leavers vocational clarity before selecting university degrees.",
        vietnameseSentence: "Thực tập thực tế trong kỳ gap year mang lại cho học sinh sự thấu suốt nghề nghiệp trước khi lựa chọn chuyên ngành đại học."
      },
      {
        id: "t2-ugy-4",
        word: "academic detachment",
        ipa: "/ˌækəˈdemɪk dɪˈtætʃmənt/",
        partOfSpeech: "noun",
        meaning: "Tâm lý xa rời, mất liên kết với môi trường học thuật",
        basicEquivalent: "getting bored of school (Band 5)",
        synonyms: ["scholastic disengagement", "intellectual alienation"],
        collocations: ["risk breeding academic detachment", "suffer academic detachment"],
        modelSentence: "Unstructured gap years lacking intellectual stimulation often induce lingering academic detachment.",
        vietnameseSentence: "Những năm gap year vô định thiếu kích thích trí tuệ thường dẫn tới sự xa rời môi trường học thuật kéo dài."
      },
      {
        id: "t2-ugy-5",
        word: "enrich personal maturity",
        ipa: "/ɪnˈrɪtʃ ˈpɜːsənl məˈtʃʊərəti/",
        partOfSpeech: "phrase",
        meaning: "Làm phong phú và trưởng thành bản thân",
        basicEquivalent: "help someone grow up (Band 5)",
        synonyms: ["cultivate adult character", "deepen personal growth"],
        collocations: ["experiential challenges enrich maturity", "travel enriches personal maturity"],
        modelSentence: "Independent solo travel through developing territories enriches personal maturity and cross-cultural empathy.",
        vietnameseSentence: "Du lịch bụi độc lập qua các vùng đất đang phát triển làm giàu thêm sự chín chắn cá nhân và lòng thấu cảm đa văn hóa."
      }
    ]
  }
];
const TOPIC_ICONS = {
  education: 'GraduationCap',
  technology: 'Cpu',
  environment: 'Leaf',
  transport: 'Car',
  health: 'HeartPulse',
  work_career: 'Briefcase',
  business: 'TrendingUp',
  society_family: 'Users',
  crime_law: 'Scale',
  culture_arts: 'Landmark'
};

// Map vocabularies by master category for rich, diverse vocabulary pools
const vocabsByTopic = {};
vocabulariesData.forEach(v => {
  const masterCat = getMasterCategoryId(v);
  if (!vocabsByTopic[masterCat]) vocabsByTopic[masterCat] = [];
  vocabsByTopic[masterCat].push(v);
  if (!vocabsByTopic[v.topicId]) vocabsByTopic[v.topicId] = [];
  vocabsByTopic[v.topicId].push(v);
});

// Helper to check if a prompt from promptsData is already covered in RAW_IELTS_TOPICS
function findMatchingCuratedTopic(prompt) {
  const normPrompt = prompt.promptText.trim().slice(0, 35).toLowerCase();
  return RAW_IELTS_TOPICS.find(t => 
    t.id.toLowerCase() === prompt.id.toLowerCase() ||
    (t.ieltsPrompt && t.ieltsPrompt.toLowerCase().includes(normPrompt)) ||
    (t.name && t.name.toLowerCase() === prompt.title.toLowerCase())
  );
}

// Generate topics for all Task 2 prompts in promptsData
const task2Prompts = promptsData.filter(p => p.taskType === 'Task 2');
const matchedCuratedIds = new Set();

// Pre-enrich vocabularies per category for maximum performance and instant access
const ENRICHED_VOCABS_BY_CATEGORY = {};

function getEnrichedVocabsForCategory(catId, categoryName) {
  if (!ENRICHED_VOCABS_BY_CATEGORY[catId]) {
    const rawList = vocabsByTopic[catId] || [];
    ENRICHED_VOCABS_BY_CATEGORY[catId] = rawList.map((v, i) => enrichVocabulary({
      id: v.id || `${catId}-v${i + 1}`,
      word: v.word,
      ipa: v.ipa,
      partOfSpeech: v.partOfSpeech,
      meaning: v.meaning,
      basicEquivalent: v.basicEquivalent,
      synonyms: v.synonyms,
      collocations: v.collocations,
      modelSentence: v.exampleSentence || v.modelSentence || "",
      vietnameseSentence: v.meaning
    }, categoryName || catId));
  }
  return ENRICHED_VOCABS_BY_CATEGORY[catId];
}

const allTask2TopicsRaw = task2Prompts.map(p => {
  const existing = findMatchingCuratedTopic(p);
  const masterCatId = getMasterCategoryId(p);
  const masterMeta = getMasterCategoryMeta(masterCatId);

  const categoryVocabs = getEnrichedVocabsForCategory(masterCatId, masterMeta.name);
  let finalVocabs = categoryVocabs;

  if (existing && existing.vocabularies && existing.vocabularies.length > 0) {
    const enrichedExisting = existing.vocabularies.map(v => enrichVocabulary(v, existing.name));
    const existingWords = new Set(enrichedExisting.map(v => v.word.toLowerCase().trim()));
    const remaining = categoryVocabs.filter(v => !existingWords.has(v.word.toLowerCase().trim()));
    finalVocabs = [...enrichedExisting, ...remaining];
  }

  if (existing) {
    matchedCuratedIds.add(existing.id);
    return {
      ...existing,
      yearDate: p.yearDate || existing.yearDate || 'Kinh điển',
      topicCategory: masterCatId,
      categoryName: masterMeta.name,
      categoryVietnameseName: masterMeta.vietnameseName,
      difficulty: p.difficulty || existing.difficulty || 'Trung bình (Band 6.5 - 7.0)',
      outlineHints: p.outlineHints || existing.outlineHints || '',
      sourceDetail: p.sourceDetail || existing.tag,
      vocabularies: finalVocabs
    };
  }

  return {
    id: p.id,
    name: p.title,
    vietnameseName: p.title,
    tag: p.yearDate ? `${p.sourceType || 'IELTS'} ${p.yearDate}` : (p.sourceDetail || 'IELTS'),
    icon: masterMeta.icon || TOPIC_ICONS[masterCatId] || 'BookOpen',
    ieltsPrompt: p.promptText,
    yearDate: p.yearDate || 'Kinh điển',
    topicCategory: masterCatId,
    categoryName: masterMeta.name,
    categoryVietnameseName: masterMeta.vietnameseName,
    difficulty: p.difficulty || 'Trung bình (Band 6.5 - 7.0)',
    outlineHints: p.outlineHints || '',
    sourceDetail: p.sourceDetail || '',
    vocabularies: finalVocabs
  };
});

// Include foundational curated topics that may not have had a 1-to-1 prompt id match
const remainingCurated = RAW_IELTS_TOPICS.filter(t => !matchedCuratedIds.has(t.id)).map(t => {
  const masterCatId = getMasterCategoryId(t);
  const masterMeta = getMasterCategoryMeta(masterCatId);
  const categoryVocabs = getEnrichedVocabsForCategory(masterCatId, masterMeta.name);
  const enrichedExisting = (t.vocabularies || []).map(v => enrichVocabulary(v, t.name));
  const existingWords = new Set(enrichedExisting.map(v => v.word.toLowerCase().trim()));
  const remaining = categoryVocabs.filter(v => !existingWords.has(v.word.toLowerCase().trim()));
  const finalVocabs = [...enrichedExisting, ...remaining];

  return {
    ...t,
    yearDate: t.yearDate || 'Kinh điển',
    topicCategory: masterCatId,
    categoryName: masterMeta.name,
    categoryVietnameseName: masterMeta.vietnameseName,
    vocabularies: finalVocabs
  };
});

const UNIFIED_RAW_TASK2_TOPICS = [
  ...allTask2TopicsRaw,
  ...remainingCurated
];

export { MASTER_TOPIC_CATEGORIES, getMasterCategoryId, getMasterCategoryMeta };

export const IELTS_TASK2_TOPICS = UNIFIED_RAW_TASK2_TOPICS;

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
  },
  {
    id: "task1-pie-chart",
    name: "Pie Charts: Power Generation by Source (2010 vs 2025) - Cam 19",
    vietnameseName: "Biểu đồ tròn: Cơ cấu nguồn phát điện (2010 so với 2025) - Cam 19",
    tag: "Task 1: Biểu đồ tròn so sánh (Cam 19)",
    icon: "PieChart",
    chartType: "pie",
    chartData: {
      title: "Global Electricity Output by Energy Source (2010 vs 2025 Projections)",
      unit: "% tổng sản lượng",
      categories: [
        { key: "coal", label: "Coal (Than đá)", color: "#ef4444", bgClass: "bg-red-500", textClass: "text-red-400" },
        { key: "gas", label: "Natural Gas (Khí đốt)", color: "#f59e0b", bgClass: "bg-amber-500", textClass: "text-amber-400" },
        { key: "renewables", label: "Renewables (Tái tạo)", color: "#10b981", bgClass: "bg-emerald-500", textClass: "text-emerald-400" },
        { key: "nuclear", label: "Nuclear (Hạt nhân)", color: "#6366f1", bgClass: "bg-indigo-500", textClass: "text-indigo-400" }
      ],
      series: [
        { country: "2010", coal: 42, gas: 25, renewables: 18, nuclear: 15 },
        { country: "2025 (Dự báo)", coal: 22, gas: 28, renewables: 38, nuclear: 12 }
      ],
      keyNotes: [
        "Than đá (Coal) từng chiếm tỉ trọng áp đảo năm 2010 (42%), nhưng dự kiến sụt giảm gần một nửa xuống còn 22% vào năm 2025.",
        "Năng lượng tái tạo (Renewables) có bước tăng trưởng ngoạn mục hơn gấp đôi từ 18% lên 38%, trở thành nguồn điện chủ đạo nhất vào năm 2025.",
        "Điện hạt nhân (Nuclear) chiếm tỉ lệ khiêm tốn và thu hẹp nhẹ từ 15% xuống 12%."
      ]
    },
    ieltsPrompt: "The two pie charts compare the proportion of global electricity generation from four distinct energy sources in 2010 and the projected breakdown for 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    vocabularies: [
      {
        id: "t1-pie-1",
        word: "account for",
        ipa: "/əˈkaʊnt fɔːr/",
        partOfSpeech: "verb phrase",
        meaning: "Chiếm tỉ lệ bao nhiêu % trong tổng thể biểu đồ",
        basicEquivalent: "make up (Band 5)",
        synonyms: ["constitute", "represent", "comprise"],
        collocations: ["account for the lion's share", "account for 42% of total output"],
        modelSentence: "Coal accounted for the largest share of global electricity output in 2010 at 42%.",
        vietnameseSentence: "Than đá chiếm tỉ trọng lớn nhất trong sản lượng điện toàn cầu năm 2010 ở mức 42%."
      },
      {
        id: "t1-pie-2",
        word: "predominant",
        ipa: "/prɪˈdɒm.ɪ.nənt/",
        partOfSpeech: "adjective",
        meaning: "Chiếm ưu thế chủ đạo, giữ vị trí số một trong cơ cấu",
        basicEquivalent: "main / biggest (Band 5)",
        synonyms: ["dominant", "primary", "foremost"],
        collocations: ["predominant energy source", "predominant contributor"],
        modelSentence: "Renewable energy is projected to become the predominant power source by 2025.",
        vietnameseSentence: "Năng lượng tái tạo được dự báo sẽ trở thành nguồn cung cấp điện chủ đạo vào năm 2025."
      },
      {
        id: "t1-pie-3",
        word: "contraction",
        ipa: "/kənˈtræk.ʃən/",
        partOfSpeech: "noun",
        meaning: "Sự co hẹp, suy giảm đáng kể về thị phần hoặc tỉ trọng",
        basicEquivalent: "decrease / shrinking (Band 5)",
        synonyms: ["reduction", "decline", "diminution"],
        collocations: ["experience a sharp contraction", "contraction in coal reliance"],
        modelSentence: "The chart highlights a sharp contraction in fossil fuel reliance, dropping from 42% to 22%.",
        vietnameseSentence: "Biểu đồ nhấn mạnh sự co hẹp mạnh mẽ trong sự phụ thuộc vào nhiên liệu hóa thạch, giảm từ 42% xuống 22%."
      },
      {
        id: "t1-pie-4",
        word: "counterpart",
        ipa: "/ˈkaʊn.tə.pɑːt/",
        partOfSpeech: "noun",
        meaning: "Đối tượng tương đương hoặc thời điểm đối chiếu để so sánh",
        basicEquivalent: "the other one (Band 5)",
        synonyms: ["equivalent", "corresponding figure"],
        collocations: ["compared to its 2010 counterpart", "exceed its counterpart"],
        modelSentence: "The 2025 projection for green energy stands more than double its 2010 counterpart.",
        vietnameseSentence: "Dự báo năm 2025 cho năng lượng xanh cao hơn gấp đôi so với số liệu đối chiếu của nó năm 2010."
      },
      {
        id: "t1-pie-5",
        word: "negligible",
        ipa: "/ˈneɡ.lɪ.dʒə.bəl/",
        partOfSpeech: "adjective",
        meaning: "Không đáng kể, chiếm tỉ lệ rất nhỏ trong tổng thể",
        basicEquivalent: "very small / tiny (Band 5)",
        synonyms: ["marginal", "insignificant", "minimal"],
        collocations: ["negligible variation", "remain negligible"],
        modelSentence: "The decline in nuclear power represents a relatively negligible shift of only three percentage points.",
        vietnameseSentence: "Sự suy giảm của điện hạt nhân đại diện cho một sự thay đổi tương đối không đáng kể chỉ 3 điểm phần trăm."
      },
      {
        id: "t1-pie-6",
        word: "surge",
        ipa: "/sɜːdʒ/",
        partOfSpeech: "verb / noun",
        meaning: "Tăng vọt đột biến và nhanh chóng",
        basicEquivalent: "go up quickly (Band 5)",
        synonyms: ["soar", "rocket", "escalate"],
        collocations: ["surge from 18% to 38%", "experience a remarkable surge"],
        modelSentence: "The proportion of renewable electricity is expected to surge by twenty percentage points.",
        vietnameseSentence: "Tỉ trọng điện tái tạo dự kiến sẽ tăng vọt thêm hai mươi điểm phần trăm."
      },
      {
        id: "t1-pie-7",
        word: "diminish",
        ipa: "/dɪˈmɪn.ɪʃ/",
        partOfSpeech: "verb",
        meaning: "Thu hẹp dần, giảm sút liên tục",
        basicEquivalent: "reduce / become less (Band 5)",
        synonyms: ["dwindle", "wane", "subside"],
        collocations: ["diminish considerably", "diminish in prominence"],
        modelSentence: "The prominence of conventional coal plants will diminish considerably over the 15-year projection.",
        vietnameseSentence: "Tầm vóc của các nhà máy than truyền thống sẽ giảm sút đáng kể trong giai đoạn dự báo 15 năm."
      },
      {
        id: "t1-pie-8",
        word: "discrepancy",
        ipa: "/dɪˈskrep.ən.si/",
        partOfSpeech: "noun",
        meaning: "Khoảng cách chênh lệch giữa hai số liệu",
        basicEquivalent: "difference (Band 5)",
        synonyms: ["gap", "divergence", "variance"],
        collocations: ["wide discrepancy", "discrepancy between energy forms"],
        modelSentence: "A substantial discrepancy emerges between surging green power and dwindling coal reliance.",
        vietnameseSentence: "Một khoảng cách chênh lệch đáng kể xuất hiện giữa năng lượng xanh đang tăng vọt và sự phụ thuộc than đá đang suy giảm."
      },
      {
        id: "t1-pie-9",
        word: "plurality",
        ipa: "/plʊəˈræl.ə.ti/",
        partOfSpeech: "noun",
        meaning: "Tỉ lệ lớn nhất trong các nhóm khảo sát",
        basicEquivalent: "the biggest part (Band 5)",
        synonyms: ["majority share", "relative majority"],
        collocations: ["command a plurality", "capture a plurality of 38%"],
        modelSentence: "By 2025, clean energy will command a commanding plurality of all generated wattage.",
        vietnameseSentence: "Đến năm 2025, năng lượng sạch sẽ nắm giữ tỉ lệ áp đảo lớn nhất trong tất cả sản lượng điện năng được tạo ra."
      },
      {
        id: "t1-pie-10",
        word: "equilibrium",
        ipa: "/ˌek.wɪˈlɪb.ri.əm/",
        partOfSpeech: "noun",
        meaning: "Trạng thái cân bằng tương đối giữa các thành phần",
        basicEquivalent: "balance (Band 5)",
        synonyms: ["balance", "parity"],
        collocations: ["reach an equilibrium", "maintain energetic equilibrium"],
        modelSentence: "Natural gas generation maintains a near equilibrium, oscillating modestly around 25% to 28%.",
        vietnameseSentence: "Sản lượng điện từ khí tự nhiên duy trì trạng thái gần như cân bằng, chỉ dao động nhẹ quanh mức 25% đến 28%."
      }
    ]
  }
,
  {
    id: "task1-zim-01-tunnels",
    name: "Diagram & Maps: Sydney & Brisbane Road Tunnels (08/09/2018)",
    vietnameseName: "Sơ đồ & Bản đồ: So sánh hai đường hầm giao thông Sydney & Brisbane (08/09/2018)",
    tag: "Task 1: Sơ đồ so sánh (Diagram / Maps)",
    icon: "MapPin",
    chartType: "image",
    imageUrl: "/charts/task1/task1_zim-01-tunnels.png",
    chartData: {
      title: "Diagram & Maps: Sydney & Brisbane Road Tunnels (08/09/2018)",
      imageUrl: "/charts/task1/task1_zim-01-tunnels.png",
      keyNotes: [
        "Thời gian xây dựng & chiều dài: Hầm Sydney dài hơn (1.8km vs 1.4km), thi công trong 6 năm (1998-2004), trong khi hầm Brisbane chỉ mất 4 năm (2008-2011).",
        "Chi phí xây dựng: Hầm Brisbane tốn kém gấp gần 3 lần hầm Sydney ($3.2 tỷ AUD so với $1.1 tỷ AUD).",
        "Lưu lượng & Mức phí: Hầm Brisbane đón lượng phương tiện đông hơn (45,000 xe/ngày vs 38,000 xe/ngày) và có mức phí cầu đường cao hơn ($4.50 AUD vs $3.00 AUD)."
]
    },
    ieltsPrompt: "The diagrams below give information about two road tunnels in two Australian cities. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    keyNotes: [
        "Thời gian xây dựng & chiều dài: Hầm Sydney dài hơn (1.8km vs 1.4km), thi công trong 6 năm (1998-2004), trong khi hầm Brisbane chỉ mất 4 năm (2008-2011).",
        "Chi phí xây dựng: Hầm Brisbane tốn kém gấp gần 3 lần hầm Sydney ($3.2 tỷ AUD so với $1.1 tỷ AUD).",
        "Lưu lượng & Mức phí: Hầm Brisbane đón lượng phương tiện đông hơn (45,000 xe/ngày vs 38,000 xe/ngày) và có mức phí cầu đường cao hơn ($4.50 AUD vs $3.00 AUD)."
],
    modelEssay: "The given maps illustrate two different underground tunnel systems for cars in two Australian cities.\n\nOverall, there are a number of differences between the two road tunnels, with the Brisbane tunnel having higher costs, shorter construction time, and carrying more daily traffic despite being shorter in total length.\n\nIn terms of construction, the Sydney tunnel took six years to build, from 1998 to 2004, and measures 1.8 kilometres in length. In contrast, the Brisbane tunnel was completed in just four years between 2008 and 2011, and was slightly shorter at 1.4 kilometres. However, despite its smaller scale and shorter construction period, the Brisbane tunnel required a staggering budget of 3.2 billion AUD, which was nearly triple the 1.1 billion AUD expended on the Sydney project.\n\nRegarding vehicular usage and operating fees, the tunnel in Brisbane accommodates approximately 45,000 vehicles each day, noticeably higher than the 38,000 cars recorded in Sydney. Furthermore, commuters using the Brisbane tunnel are charged a 4.50 AUD toll, compared to a lower charge of 3.00 AUD in Sydney.",
    vocabularies: [
      {
        id: "t1-zim01-1",
        word: "underground tunnel",
        ipa: "/ˈʌndəɡraʊnd ˈtʌnl/",
        partOfSpeech: "noun",
        meaning: "Đường hầm ngầm dưới lòng đất",
        basicEquivalent: "subway road (Band 5)",
        synonyms: ["subterranean passage", "tunnel system", "underground passageway"],
        collocations: ["construct an underground tunnel", "traffic tunnel"],
        modelSentence: "The underground tunnel was designed to relieve chronic surface traffic congestion.",
        vietnameseSentence: "Tuyến đường hầm ngầm được thiết kế nhằm giải tỏa tình trạng ùn tắc giao thông bề mặt kéo dài."
      },
      {
        id: "t1-zim01-2",
        word: "construction period",
        ipa: "/kənˈstrʌkʃn ˈpɪəriəd/",
        partOfSpeech: "noun",
        meaning: "Thời gian thi công xây dựng",
        basicEquivalent: "building time (Band 5)",
        synonyms: ["building timeframe", "construction duration"],
        collocations: ["span a construction period", "shorten the construction period"],
        modelSentence: "The Brisbane project boasted a significantly shorter construction period of only four years.",
        vietnameseSentence: "Dự án Brisbane nổi bật với thời gian thi công ngắn hơn đáng kể, chỉ kéo dài bốn năm."
      },
      {
        id: "t1-zim01-3",
        word: "capital expenditure",
        ipa: "/ˈkæpɪtl ɪkˈspendɪtʃər/",
        partOfSpeech: "noun",
        meaning: "Chi phí đầu tư vốn xây dựng cơ sở hạ tầng",
        basicEquivalent: "building cost (Band 5)",
        synonyms: ["construction cost", "investment budget", "financial outlay"],
        collocations: ["incur heavy capital expenditure", "initial expenditure"],
        modelSentence: "The capital expenditure for the Brisbane tunnel was nearly triple that of the Sydney project.",
        vietnameseSentence: "Chi phí đầu tư vốn cho hầm Brisbane cao gấp gần ba lần so với dự án ở Sydney."
      },
      {
        id: "t1-zim01-4",
        word: "vehicular traffic",
        ipa: "/viˈhɪkjələr ˈtræfɪk/",
        partOfSpeech: "noun",
        meaning: "Lưu lượng xe cộ qua lại",
        basicEquivalent: "car traffic (Band 5)",
        synonyms: ["motor traffic", "vehicle volume", "traffic flow"],
        collocations: ["accommodate vehicular traffic", "heavy vehicular traffic"],
        modelSentence: "The modern bypass accommodates an average of 45,000 vehicular traffic units on a daily basis.",
        vietnameseSentence: "Tuyến đường vòng hiện đại đáp ứng lưu lượng xe trung bình 45.000 phương tiện mỗi ngày."
      },
      {
        id: "t1-zim01-5",
        word: "toll fee",
        ipa: "/təʊl fiː/",
        partOfSpeech: "noun",
        meaning: "Phí cầu đường / phí qua hầm",
        basicEquivalent: "road price (Band 5)",
        synonyms: ["toll charge", "transit levy", "road fee"],
        collocations: ["levy a toll fee", "pay the toll fee"],
        modelSentence: "Motorists must pay a mandatory toll fee of 4.50 AUD upon entering the tunnel.",
        vietnameseSentence: "Người điều khiển phương tiện phải trả mức phí cầu đường bắt buộc là 4.50 AUD khi đi vào hầm."
      },
      {
        id: "t1-zim01-6",
        word: "completion timeframe",
        ipa: "/kəmˈpliːʃn ˈtreɪmfeɪm/",
        partOfSpeech: "noun",
        meaning: "Khung thời gian hoàn thành công trình",
        basicEquivalent: "time to finish (Band 5)",
        synonyms: ["completion schedule", "delivery timeline"],
        collocations: ["meet the completion timeframe", "expedite completion"],
        modelSentence: "The engineering team maintained an ambitious completion timeframe despite challenging bedrock excavation.",
        vietnameseSentence: "Đội ngũ kỹ thuật đã duy trì khung thời gian hoàn thành đầy tham vọng bất chấp việc đào bới nền đá phức tạp."
      },
      {
        id: "t1-zim01-7",
        word: "commuter",
        ipa: "/kəˈmjuːtər/",
        partOfSpeech: "noun",
        meaning: "Người tham gia giao thông đi lại hằng ngày",
        basicEquivalent: "driver / traveler (Band 5)",
        synonyms: ["daily traveler", "motorist", "road user"],
        collocations: ["daily commuters", "urban commuters"],
        modelSentence: "Thousands of urban commuters benefit daily from the newly opened bypass.",
        vietnameseSentence: "Hàng ngàn người tham gia giao thông hằng ngày được hưởng lợi từ tuyến đường tránh mới thông xe."
      },
      {
        id: "t1-zim01-8",
        word: "exorbitant",
        ipa: "/ɪɡˈzɔːbɪtənt/",
        partOfSpeech: "adjective",
        meaning: "Đắt đỏ, tốn kém vượt trội",
        basicEquivalent: "very expensive (Band 5)",
        synonyms: ["hefty", "astronomical", "costly"],
        collocations: ["exorbitant cost", "exorbitant financial budget"],
        modelSentence: "Despite its exorbitant construction expense, the tunnel resolved critical arterial bottlenecks.",
        vietnameseSentence: "Dù chi phí thi công vô cùng đắt đỏ, đường hầm đã giải quyết dứt điểm các điểm nghẽn giao thông trọng yếu."
      }
    ]
  },
  {
    id: "task1-zim-02-fruits",
    name: "Pie & Bar: Fresh Citrus Fruit Exports in 2010 (11/10/2018)",
    vietnameseName: "Biểu đồ kết hợp: Xuất khẩu các loại quả có múi tươi năm 2010 (11/10/2018)",
    tag: "Task 1: Biểu đồ kết hợp (Pie & Bar)",
    icon: "BarChart3",
    chartType: "image",
    imageUrl: "/charts/task1/task1_zim-02-fruits.png",
    chartData: {
      title: "Pie & Bar: Fresh Citrus Fruit Exports in 2010 (11/10/2018)",
      imageUrl: "/charts/task1/task1_zim-02-fruits.png",
      keyNotes: [
        "Tỷ trọng các loại quả: Cam (Oranges) áp đảo hoàn toàn thị trường xuất khẩu quả có múi, vượt xa chanh (lemons/limes) và bưởi (grapefruits).",
        "Xuất khẩu cam: Nam Phi và Tây Ban Nha là hai quốc gia xuất khẩu cam lớn nhất thế giới, vượt mốc 1.000 nghìn tấn mỗi nước.",
        "Xuất khẩu chanh & bưởi: Mexico dẫn đầu tuyệt đối về xuất khẩu chanh, trong khi Mỹ và Thổ Nhĩ Kỳ chiếm ưu thế trong thị trường bưởi tươi."
]
    },
    ieltsPrompt: "The charts show fresh fruit exports in 2010. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    keyNotes: [
        "Tỷ trọng các loại quả: Cam (Oranges) áp đảo hoàn toàn thị trường xuất khẩu quả có múi, vượt xa chanh (lemons/limes) và bưởi (grapefruits).",
        "Xuất khẩu cam: Nam Phi và Tây Ban Nha là hai quốc gia xuất khẩu cam lớn nhất thế giới, vượt mốc 1.000 nghìn tấn mỗi nước.",
        "Xuất khẩu chanh & bưởi: Mexico dẫn đầu tuyệt đối về xuất khẩu chanh, trong khi Mỹ và Thổ Nhĩ Kỳ chiếm ưu thế trong thị trường bưởi tươi."
],
    modelEssay: "The charts compare different types of citrus fruit exports from a number of different countries in 2010.\n\nOverall, oranges were by far the fruit that was exported in the greatest volume among the citrus varieties examined. Additionally, while South Africa and Spain dominated orange shipments, Mexico spearheaded the lemon and lime sector, and the United States led grapefruit exports.\n\nIn terms of orange exports, total global trade exceeded 6,000 thousand tons. South Africa and Spain emerged as the two foremost exporters, supplying roughly 1,050 and 1,020 thousand tons respectively. Turkey, the United States, and Egypt also contributed substantial volumes, each exporting between 500 and 800 thousand tons.\n\nBy contrast, exports of lemons, limes, and grapefruits remained significantly lower. Mexico dominated lemon and lime exports with approximately 500 thousand tons, followed by Spain and Argentina at around 250 thousand tons each. For grapefruits, the United States stood as the premier supplier at nearly 250 thousand tons, while South Africa and Turkey recorded lower figures between 150 and 200 thousand tons.",
    vocabularies: [
      {
        id: "t1-zim02-1",
        word: "citrus fruit",
        ipa: "/ˈsɪtrəs fruːt/",
        partOfSpeech: "noun",
        meaning: "Trái cây họ cam quýt có múi",
        basicEquivalent: "orange-like fruits (Band 5)",
        synonyms: ["citrus varieties", "citrus produce"],
        collocations: ["citrus fruit exports", "citrus production"],
        modelSentence: "Global trade in citrus fruit experienced robust expansion throughout 2010.",
        vietnameseSentence: "Thương mại toàn cầu đối với trái cây họ cam quýt chứng kiến mức tăng trưởng mạnh mẽ trong suốt năm 2010."
      },
      {
        id: "t1-zim02-2",
        word: "export volume",
        ipa: "/ˈekspɔːt ˈvɒljuːm/",
        partOfSpeech: "noun",
        meaning: "Sản lượng / khối lượng xuất khẩu",
        basicEquivalent: "amount of exported goods (Band 5)",
        synonyms: ["export tonnage", "shipment volume", "outbound tonnage"],
        collocations: ["recorded export volume", "surge in export volume"],
        modelSentence: "South Africa registered an impressive export volume exceeding one million metric tons.",
        vietnameseSentence: "Nam Phi ghi nhận sản lượng xuất khẩu ấn tượng vượt trên một triệu tấn."
      },
      {
        id: "t1-zim02-3",
        word: "dominate",
        ipa: "/ˈdɒmɪneɪt/",
        partOfSpeech: "verb",
        meaning: "Chiếm ưu thế áp đảo",
        basicEquivalent: "be the biggest (Band 5)",
        synonyms: ["command the market", "lead by a wide margin", "monopolize"],
        collocations: ["dominate the export share", "dominate global trade"],
        modelSentence: "Oranges heavily dominated the chart, outstripping all other fruit categories combined.",
        vietnameseSentence: "Cam áp đảo mạnh mẽ trên biểu đồ, vượt xa tất cả các nhóm trái cây khác cộng lại."
      },
      {
        id: "t1-zim02-4",
        word: "premier supplier",
        ipa: "/ˈpremiər səˈplaɪər/",
        partOfSpeech: "noun",
        meaning: "Nhà cung cấp hàng đầu",
        basicEquivalent: "top seller (Band 5)",
        synonyms: ["leading exporter", "foremost producer", "primary source"],
        collocations: ["act as the premier supplier", "emerge as premier supplier"],
        modelSentence: "Mexico emerged as the premier supplier of fresh limes to international markets.",
        vietnameseSentence: "Mexico đã vươn lên thành nhà cung cấp chanh tươi hàng đầu cho các thị trường quốc tế."
      },
      {
        id: "t1-zim02-5",
        word: "spearhead",
        ipa: "/ˈspɪəhed/",
        partOfSpeech: "verb",
        meaning: "Dẫn đầu, giữ vai trò mũi nhọn tiên phong",
        basicEquivalent: "lead (Band 5)",
        synonyms: ["pioneer", "lead the way", "head"],
        collocations: ["spearhead the sector", "spearhead export growth"],
        modelSentence: "Spain spearheaded European citrus shipments with over a million tons exported.",
        vietnameseSentence: "Tây Ban Nha dẫn đầu các chuyến hàng xuất khẩu cam quýt của Châu Âu với hơn một triệu tấn được xuất khẩu."
      },
      {
        id: "t1-zim02-6",
        word: "dwarf",
        ipa: "/dwɔːf/",
        partOfSpeech: "verb",
        meaning: "Làm cho cái khác trở nên nhỏ bé, áp đảo hoàn toàn",
        basicEquivalent: "be much bigger than (Band 5)",
        synonyms: ["overshadow", "eclipse", "surpass significantly"],
        collocations: ["dwarf other categories", "dwarf competing figures"],
        modelSentence: "The volume of oranges dwarfed the modest output generated by lemon cultivators.",
        vietnameseSentence: "Khối lượng cam đã áp đảo hoàn toàn sản lượng khiêm tốn do những người trồng chanh tạo ra."
      },
      {
        id: "t1-zim02-7",
        word: "breakdown",
        ipa: "/ˈbreɪkdaʊn/",
        partOfSpeech: "noun",
        meaning: "Sự phân chia chi tiết tỉ lệ từng phần",
        basicEquivalent: "division of data (Band 5)",
        synonyms: ["composition", "proportional distribution", "segmentation"],
        collocations: ["percentage breakdown", "detailed breakdown"],
        modelSentence: "The pie chart outlines a clear breakdown of global consumer demand across three fruits.",
        vietnameseSentence: "Biểu đồ tròn phác thảo sự phân chia tỉ lệ rõ ràng về nhu cầu tiêu dùng toàn cầu đối với ba loại quả."
      },
      {
        id: "t1-zim02-8",
        word: "outstrip",
        ipa: "/aʊtˈstrɪp/",
        partOfSpeech: "verb",
        meaning: "Vượt trội hơn, bỏ xa",
        basicEquivalent: "be higher than (Band 5)",
        synonyms: ["exceed", "surpass", "outrun"],
        collocations: ["outstrip demand", "outstrip rival nations"],
        modelSentence: "South African fruit shipments outstripped Spanish totals by a slim margin of 30 thousand tons.",
        vietnameseSentence: "Lượng hàng trái cây của Nam Phi đã vượt qua tổng số của Tây Ban Nha với khoảng cách sít sao 30 nghìn tấn."
      }
    ]
  },
  {
    id: "task1-zim-03-igloo",
    name: "Process: How an Igloo is Built from Snow (02/03/2019)",
    vietnameseName: "Quy trình: Kỹ thuật xây dựng lều tuyết Igloo truyền thống (02/03/2019)",
    tag: "Task 1: Sơ đồ quy trình (Process)",
    icon: "Layers",
    chartType: "image",
    imageUrl: "/charts/task1/task1_zim-03-igloo.png",
    chartData: {
      title: "Process: How an Igloo is Built from Snow (02/03/2019)",
      imageUrl: "/charts/task1/task1_zim-03-igloo.png",
      keyNotes: [
        "Các giai đoạn chính: 5 công đoạn liên tiếp từ việc nén tuyết, cưa các khối băng, xếp vòng xoắn ốc tạo vòm, đục lỗ thông hơi & đường hầm lối vào, đến việc trát tuyết mịn làm kín khe hở.",
        "Nguyên vật liệu & Dụng cụ: Sử dụng hoàn toàn băng tuyết tự nhiên, dao/cưa cầm tay chuyên dụng để định hình các khối tuyết.",
        "Đặc điểm cấu trúc: Cấu trúc mái vòm chịu lực dạng xoắn ốc (spiral) cùng một hầm thông gió chìm giúp giữ nhiệt độ ấm áp bên trong."
]
    },
    ieltsPrompt: "The illustration shows information about how an igloo is built from snow. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    keyNotes: [
        "Các giai đoạn chính: 5 công đoạn liên tiếp từ việc nén tuyết, cưa các khối băng, xếp vòng xoắn ốc tạo vòm, đục lỗ thông hơi & đường hầm lối vào, đến việc trát tuyết mịn làm kín khe hở.",
        "Nguyên vật liệu & Dụng cụ: Sử dụng hoàn toàn băng tuyết tự nhiên, dao/cưa cầm tay chuyên dụng để định hình các khối tuyết.",
        "Đặc điểm cấu trúc: Cấu trúc mái vòm chịu lực dạng xoắn ốc (spiral) cùng một hầm thông gió chìm giúp giữ nhiệt độ ấm áp bên trong."
],
    modelEssay: "The diagram illustrates the process that is used to build an igloo from snow.\n\nThere are five main stages in this process, starting with the harvesting and cutting of hard-packed snow blocks and culminating in the sealing and smoothing of the dome shelter.\n\nFirst of all, hard-packed snow is collected and cut into large rectangular blocks using a saw. The builder then begins laying these blocks in a circular foundation on the ground. As the building progresses, the blocks are laid in an ascending spiral pattern, with each successive layer leaning slightly inward to gradually form a dome shape.\n\nOnce the main dome is enclosed, a small ventilation hole is carved at the very top of the roof to allow smoke and stale air to escape while admitting fresh air. Next, the builder digs an underground entrance tunnel beneath the wall, which prevents freezing wind from entering the living quarters. Finally, soft snow is shoveled over the exterior to pack into crevices and seal any openings, before the outer surface is carefully smoothed to ensure structural stability and thermal insulation.",
    vocabularies: [
      {
        id: "t1-zim03-1",
        word: "hard-packed snow",
        ipa: "/hɑːd pækt snəʊ/",
        partOfSpeech: "noun",
        meaning: "Tuyết được nén cứng, đóng tảng chắc chắn",
        basicEquivalent: "hard snow (Band 5)",
        synonyms: ["compressed snow", "dense snowpack"],
        collocations: ["cut hard-packed snow", "harvest hard-packed snow"],
        modelSentence: "Only dense, hard-packed snow possesses sufficient structural integrity to build an igloo.",
        vietnameseSentence: "Chỉ có tuyết nén cứng và đậm đặc mới có đủ độ bền kết cấu để xây dựng lều tuyết."
      },
      {
        id: "t1-zim03-2",
        word: "spiral pattern",
        ipa: "/ˈspaɪrəl ˈpætn/",
        partOfSpeech: "noun",
        meaning: "Khuôn mẫu vòng xoắn ốc",
        basicEquivalent: "circle shape (Band 5)",
        synonyms: ["spiral formation", "helical arrangement"],
        collocations: ["laid in a spiral pattern", "ascending spiral pattern"],
        modelSentence: "The snow blocks are arranged in an ascending spiral pattern to create a self-supporting dome.",
        vietnameseSentence: "Các khối tuyết được sắp đặt theo khuôn mẫu vòng xoắn ốc nâng dần để tạo nên mái vòm tự chịu lực."
      },
      {
        id: "t1-zim03-3",
        word: "ventilation hole",
        ipa: "/ˌventɪˈleɪʃn həʊl/",
        partOfSpeech: "noun",
        meaning: "Lỗ thông hơi, khe thông gió",
        basicEquivalent: "air hole (Band 5)",
        synonyms: ["air vent", "ventilation opening", "chimney flue"],
        collocations: ["carve a ventilation hole", "rooftop ventilation hole"],
        modelSentence: "A small ventilation hole is carved at the apex to prevent suffocation inside the shelter.",
        vietnameseSentence: "Một lỗ thông hơi nhỏ được khoét ở phần đỉnh để chống ngạt thở bên trong nơi trú ẩn."
      },
      {
        id: "t1-zim03-4",
        word: "entrance tunnel",
        ipa: "/ˈentrəns ˈtʌnl/",
        partOfSpeech: "noun",
        meaning: "Đường hầm lối ra vào",
        basicEquivalent: "door way (Band 5)",
        synonyms: ["sunken passageway", "entry corridor"],
        collocations: ["dig an entrance tunnel", "submerged entrance tunnel"],
        modelSentence: "The entrance tunnel is purposely excavated below ground level to trap warm air indoors.",
        vietnameseSentence: "Đường hầm lối vào được cố ý đào chìm dưới mặt đất để giữ không khí ấm bên trong."
      },
      {
        id: "t1-zim03-5",
        word: "thermal insulation",
        ipa: "/ˈθɜːml ˌɪnsjʊˈleɪʃn/",
        partOfSpeech: "noun",
        meaning: "Khả năng cách nhiệt, giữ ấm",
        basicEquivalent: "warm keeping (Band 5)",
        synonyms: ["heat retention", "thermal barrier"],
        collocations: ["provide thermal insulation", "enhance thermal insulation"],
        modelSentence: "Packing snow into exterior crevices greatly enhances the structure's thermal insulation.",
        vietnameseSentence: "Trát tuyết vào các khe hở bên ngoài giúp nâng cao đáng kể khả năng cách nhiệt của công trình."
      },
      {
        id: "t1-zim03-6",
        word: "crevice",
        ipa: "/ˈkrevɪs/",
        partOfSpeech: "noun",
        meaning: "Khe hở, kẽ nứt giữa các khối đá/băng",
        basicEquivalent: "crack / hole (Band 5)",
        synonyms: ["crack", "fissure", "gap", "chink"],
        collocations: ["seal crevices", "fill tiny crevices"],
        modelSentence: "Loose powdery snow is firmly packed into remaining crevices to deflect biting winds.",
        vietnameseSentence: "Tuyết xốp tơi được nén chặt vào các khe nứt còn lại để ngăn những luồng gió buốt giá."
      },
      {
        id: "t1-zim03-7",
        word: "culminate in",
        ipa: "/ˈkʌlmɪneɪt ɪn/",
        partOfSpeech: "verb",
        meaning: "Kết thúc bằng, đạt đến đỉnh điểm ở bước",
        basicEquivalent: "end with (Band 5)",
        synonyms: ["conclude with", "climax in", "finish with"],
        collocations: ["culminate in the final stage", "culminate in completion"],
        modelSentence: "The assembly culminates in the smoothing of the exterior dome with handheld wooden trowels.",
        vietnameseSentence: "Quy trình xây dựng kết thúc bằng việc làm mịn bề mặt vòm ngoài bằng bàn chà gỗ cầm tay."
      },
      {
        id: "t1-zim03-8",
        word: "dome-shaped",
        ipa: "/dəʊm ʃeɪpt/",
        partOfSpeech: "adjective",
        meaning: "Có hình dạng mái vòm tròn",
        basicEquivalent: "round like a ball (Band 5)",
        synonyms: ["hemispherical", "vaulted", "curved"],
        collocations: ["dome-shaped shelter", "dome-shaped architecture"],
        modelSentence: "The dome-shaped structure successfully withstands howling blizzards and seismic tremors.",
        vietnameseSentence: "Cấu trúc hình mái vòm có khả năng chống chịu thành công những trận bão tuyết dữ dội và rung chấn."
      }
    ]
  },
  {
    id: "task1-zim-04-driving-license",
    name: "Flowchart: US Driving License Examination Procedures (14/03/2019)",
    vietnameseName: "Lưu đồ quy trình: Các bước thi lấy bằng lái xe tại Mỹ (14/03/2019)",
    tag: "Task 1: Lưu đồ quy trình (Flowchart)",
    icon: "Layers",
    chartType: "image",
    imageUrl: "/charts/task1/task1_zim-04-driving-license.png",
    chartData: {
      title: "Flowchart: US Driving License Examination Procedures (14/03/2019)",
      imageUrl: "/charts/task1/task1_zim-04-driving-license.png",
      keyNotes: [
        "Ba bài kiểm tra bắt buộc: Kiểm tra thị lực (eyesight test), thi lý thuyết viết (written theoretical test), và thi thực hành lái xe trên đường (road test).",
        "Điều kiện tiên quyết: Trượt kiểm tra mắt sẽ bị loại ngay từ đầu; nếu đỗ mới được nộp lệ phí để thi lý thuyết.",
        "Quy chế thi lại & Cấp bằng: Thí sinh được thi lại lý thuyết tối đa 2 lần. Cần vượt qua cả lý thuyết và thực hành để chính thức nhận bằng lái xe."
]
    },
    ieltsPrompt: "The flow chart below shows the procedures to get a driving license in US. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    keyNotes: [
        "Ba bài kiểm tra bắt buộc: Kiểm tra thị lực (eyesight test), thi lý thuyết viết (written theoretical test), và thi thực hành lái xe trên đường (road test).",
        "Điều kiện tiên quyết: Trượt kiểm tra mắt sẽ bị loại ngay từ đầu; nếu đỗ mới được nộp lệ phí để thi lý thuyết.",
        "Quy chế thi lại & Cấp bằng: Thí sinh được thi lại lý thuyết tối đa 2 lần. Cần vượt qua cả lý thuyết và thực hành để chính thức nhận bằng lái xe."
],
    modelEssay: "The given diagram details the process of obtaining a driving license in the US.\n\nIn general, it can be seen that there are three tests that need to be passed in order to get a driving license, which are an eyesight test, a written theoretical examination, and a practical driving road test.\n\nThe first thing one needs to do to get a driver's license is to register at a driving license centre and fill out the appropriate application forms. After that, an eyesight test is required. If the applicant fails this vision screening, the application is rejected immediately; however, if they pass, they are permitted to proceed to the next stage.\n\nAfter paying the prescribed administrative fees, candidates take a written theoretical test, with up to two extra chances to retake the test if they fail initially. Once the written examination is successfully cleared, candidates must undertake a practical on-road examination. It is obligatory to pass both the theory and practical tests in order to receive the driving license. Should an applicant fail the road test, they are required to pay the fees once more and reattempt the examination.",
    vocabularies: [
      {
        id: "t1-zim04-1",
        word: "eyesight test",
        ipa: "/ˈaɪsaɪt test/",
        partOfSpeech: "noun",
        meaning: "Bài kiểm tra thị lực / kiểm tra mắt",
        basicEquivalent: "eye check (Band 5)",
        synonyms: ["vision screening", "ocular examination"],
        collocations: ["undergo an eyesight test", "pass the eyesight test"],
        modelSentence: "Passing the mandatory eyesight test is a prerequisite before booking any theory exam.",
        vietnameseSentence: "Vượt qua bài kiểm tra thị lực bắt buộc là điều kiện tiên quyết trước khi đăng ký thi bất kỳ bài lý thuyết nào."
      },
      {
        id: "t1-zim04-2",
        word: "theoretical examination",
        ipa: "/ˌθɪəˈretɪkl ɪɡˌzæmɪˈneɪʃn/",
        partOfSpeech: "noun",
        meaning: "Kỳ thi lý thuyết luật giao thông",
        basicEquivalent: "paper test (Band 5)",
        synonyms: ["written test", "theory examination", "knowledge assessment"],
        collocations: ["sit a theoretical examination", "written theoretical test"],
        modelSentence: "The theoretical examination evaluates the applicant's grasp of traffic regulations and road signs.",
        vietnameseSentence: "Kỳ thi lý thuyết đánh giá mức độ am hiểu của người nộp đơn về luật lệ và biển báo giao thông."
      },
      {
        id: "t1-zim04-3",
        word: "practical road exam",
        ipa: "/ˈpræktɪkl rəʊd ɪɡˈzæm/",
        partOfSpeech: "noun",
        meaning: "Bài thi thực hành lái xe trên đường thực tế",
        basicEquivalent: "driving test (Band 5)",
        synonyms: ["behind-the-wheel assessment", "on-road driving test"],
        collocations: ["conduct a practical road exam", "road evaluation"],
        modelSentence: "Examiners observe lane discipline and safety reflexes during the practical road exam.",
        vietnameseSentence: "Các giám khảo quan sát kỹ năng đi đúng làn đường và phản xạ an toàn trong suốt bài thi thực hành lái xe."
      },
      {
        id: "t1-zim04-4",
        word: "obligatory",
        ipa: "/əˈblɪɡətri/",
        partOfSpeech: "adjective",
        meaning: "Có tính chất bắt buộc theo luật định",
        basicEquivalent: "must do (Band 5)",
        synonyms: ["compulsory", "mandatory", "imperative"],
        collocations: ["it is obligatory to pass", "obligatory requirement"],
        modelSentence: "It is obligatory for candidates to pass both assessments prior to receiving full driving privileges.",
        vietnameseSentence: "Người thi bắt buộc phải vượt qua cả hai bài kiểm tra trước khi được nhận đầy đủ quyền điều khiển phương tiện."
      },
      {
        id: "t1-zim04-5",
        word: "retake",
        ipa: "/ˌriːˈteɪk/",
        partOfSpeech: "verb",
        meaning: "Thi lại (sau khi bị trượt)",
        basicEquivalent: "do the test again (Band 5)",
        synonyms: ["resit", "reattempt"],
        collocations: ["retake the exam", "eligible to retake"],
        modelSentence: "Applicants who fail the written section are permitted to retake it twice within ninety days.",
        vietnameseSentence: "Những ứng viên trượt phần thi viết được phép thi lại hai lần trong vòng chín mươi ngày."
      },
      {
        id: "t1-zim04-6",
        word: "application form",
        ipa: "/ˌæplɪˈkeɪʃn fɔːm/",
        partOfSpeech: "noun",
        meaning: "Mẫu đơn xin cấp / hồ sơ đăng ký",
        basicEquivalent: "signup paper (Band 5)",
        synonyms: ["registration document", "filing document"],
        collocations: ["submit an application form", "fill out the application form"],
        modelSentence: "Prospective motorists must first complete and sign an official application form.",
        vietnameseSentence: "Những người có nguyện vọng lái xe trước hết phải điền và ký vào mẫu đơn đăng ký chính thức."
      },
      {
        id: "t1-zim04-7",
        word: "administrative fee",
        ipa: "/ədˈmɪnɪstrətɪv fiː/",
        partOfSpeech: "noun",
        meaning: "Phí quản lý hành chính / lệ phí hồ sơ",
        basicEquivalent: "service price (Band 5)",
        synonyms: ["licensing fee", "processing surcharge"],
        collocations: ["pay the administrative fee", "non-refundable administrative fee"],
        modelSentence: "Each reattempt incurs a standard administrative fee payable at the reception kiosk.",
        vietnameseSentence: "Mỗi lần thi lại đều phải nộp một khoản lệ phí hành chính tiêu chuẩn tại quầy tiếp tân."
      },
      {
        id: "t1-zim04-8",
        word: "prerequisite",
        ipa: "/ˌpriːˈrekwəzɪt/",
        partOfSpeech: "noun",
        meaning: "Điều kiện tiên quyết phải đạt trước",
        basicEquivalent: "first requirement (Band 5)",
        synonyms: ["essential condition", "precondition"],
        collocations: ["a prerequisite for getting a license", "essential prerequisite"],
        modelSentence: "Passing visual acuity tests functions as an absolute prerequisite for subsequent examinations.",
        vietnameseSentence: "Vượt qua bài đo độ sắc nét thị giác đóng vai trò là điều kiện tiên quyết tuyệt đối cho các kỳ thi sau."
      }
    ]
  },
  {
    id: "task1-zim-05-teacher-salaries",
    name: "Table: High School Teachers Salaries in 5 Countries (20/03/2019)",
    vietnameseName: "Bảng số liệu: Tiền lương giáo viên trung học phổ thông năm 2009 (20/03/2019)",
    tag: "Task 1: Bảng số liệu (Table)",
    icon: "BarChart3",
    chartType: "image",
    imageUrl: "/charts/task1/task1_zim-05-teacher-salaries.png",
    chartData: {
      title: "Table: High School Teachers Salaries in 5 Countries (20/03/2019)",
      imageUrl: "/charts/task1/task1_zim-05-teacher-salaries.png",
      keyNotes: [
        "Mức lương cao nhất & thấp nhất: Giáo viên tại Luxembourg nhận mức đãi ngộ cao vượt trội ($80,000 khởi điểm đến $119,000 tối đa). Ngược lại, Australia ghi nhận mức lương khởi điểm thấp nhất ($28,000).",
        "Mức lương sau 15 năm: Giáo viên Luxembourg nhận $119,000, giáo viên Nhật Bản nhận $65,000, trong khi giáo viên tại Australia và Hàn Quốc chỉ đạt $48,000.",
        "Thời gian chạm đỉnh lương: Giáo viên ở Australia và Đan Mạch mất ít thời gian nhất (dưới 10 năm) để đạt mức lương kịch trần, trong khi các nước còn lại phải mất ít nhất 30 năm."
]
    },
    ieltsPrompt: "The table below shows the salaries of secondary/high school teachers in 2009. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    keyNotes: [
        "Mức lương cao nhất & thấp nhất: Giáo viên tại Luxembourg nhận mức đãi ngộ cao vượt trội ($80,000 khởi điểm đến $119,000 tối đa). Ngược lại, Australia ghi nhận mức lương khởi điểm thấp nhất ($28,000).",
        "Mức lương sau 15 năm: Giáo viên Luxembourg nhận $119,000, giáo viên Nhật Bản nhận $65,000, trong khi giáo viên tại Australia và Hàn Quốc chỉ đạt $48,000.",
        "Thời gian chạm đỉnh lương: Giáo viên ở Australia và Đan Mạch mất ít thời gian nhất (dưới 10 năm) để đạt mức lương kịch trần, trong khi các nước còn lại phải mất ít nhất 30 năm."
],
    modelEssay: "The table compares secondary and high school teachers' salaries in five countries in 2009.\n\nOverall, while teachers in Luxembourg were by far the most well-paid across all career stages, those from Australia received the lowest compensation. Additionally, it took educators in Australia and Denmark significantly less time to attain their maximum salary compared to teachers in the other surveyed nations.\n\nSecondary and high school educators in Luxembourg commenced with a handsome starting salary of $80,000 per annum, which was nearly double the figure for Danish teachers ($45,000). By contrast, an inexperienced teacher in Australia, Japan, and Korea started with noticeably lower earnings, hovering around $28,000 to $34,000.\n\nAfter 15 years of service, educators in Luxembourg saw their compensation climb to $119,000, which also represented their ceiling. Meanwhile, counterparts in Japan and Denmark made $65,000 and $54,000 respectively, while Australian and Korean teachers with equivalent seniority earned the lowest remuneration at $48,000. Remarkably, teachers in Australia and Denmark reached their top earning tier in under 10 years, whereas educators in Japan and Korea had to wait for at least 30 to 37 years.",
    vocabularies: [
      {
        id: "t1-zim05-1",
        word: "well-paid",
        ipa: "/ˌwel ˈpeɪd/",
        partOfSpeech: "adjective",
        meaning: "Được trả lương cao, thu nhập hậu hĩnh",
        basicEquivalent: "get high money (Band 5)",
        synonyms: ["highly compensated", "lucrative", "generously remunerated"],
        collocations: ["most well-paid profession", "well-paid educators"],
        modelSentence: "Luxembourgish teachers were consistently the most well-paid among the surveyed nations.",
        vietnameseSentence: "Giáo viên tại Luxembourg luôn là những người được trả lương cao nhất trong số các quốc gia được khảo sát."
      },
      {
        id: "t1-zim05-2",
        word: "starting salary",
        ipa: "/ˈstɑːtɪŋ ˈsæləri/",
        partOfSpeech: "noun",
        meaning: "Mức lương khởi điểm khi mới vào nghề",
        basicEquivalent: "first pay (Band 5)",
        synonyms: ["entry-level salary", "initial earnings", "commencing wage"],
        collocations: ["earn a starting salary", "modest starting salary"],
        modelSentence: "A novice high school instructor in Denmark received an entry-level starting salary of $45,000.",
        vietnameseSentence: "Một giáo viên trung học mới vào nghề tại Đan Mạch nhận mức lương khởi điểm là 45.000 USD."
      },
      {
        id: "t1-zim05-3",
        word: "inexperienced",
        ipa: "/ˌɪnɪkˈspɪəriənst/",
        partOfSpeech: "adjective",
        meaning: "Chưa có kinh nghiệm, mới vào nghề",
        basicEquivalent: "new worker (Band 5)",
        synonyms: ["novice", "entry-level", "unseasoned"],
        collocations: ["inexperienced teacher", "inexperienced candidate"],
        modelSentence: "Inexperienced educators in Australia drew the lowest baseline compensation in the dataset.",
        vietnameseSentence: "Các giáo viên chưa có kinh nghiệm ở Úc nhận mức thù lao cơ bản thấp nhất trong bộ số liệu."
      },
      {
        id: "t1-zim05-4",
        word: "seniority",
        ipa: "/ˌsiːniˈɒrəti/",
        partOfSpeech: "noun",
        meaning: "Thâm niên công tác lâu năm",
        basicEquivalent: "years of work (Band 5)",
        synonyms: ["tenure", "length of service", "professional experience"],
        collocations: ["accumulate seniority", "based on seniority"],
        modelSentence: "Salary increments were strictly determined by years of professional seniority.",
        vietnameseSentence: "Các bậc tăng lương được xác định nghiêm ngặt dựa theo số năm thâm niên nghề nghiệp."
      },
      {
        id: "t1-zim05-5",
        word: "salary ceiling",
        ipa: "/ˈsæləri ˈsiːlɪŋ/",
        partOfSpeech: "noun",
        meaning: "Mức lương tối đa kịch trần có thể đạt được",
        basicEquivalent: "highest money limit (Band 5)",
        synonyms: ["maximum salary", "upper pay threshold", "earnings cap"],
        collocations: ["reach the salary ceiling", "attain the maximum salary"],
        modelSentence: "Danish instructors reached their salary ceiling within a brisk nine-year span.",
        vietnameseSentence: "Các giảng viên Đan Mạch đã chạm mức lương tối đa của họ chỉ trong khoảng thời gian nhanh gọn 9 năm."
      },
      {
        id: "t1-zim05-6",
        word: "remuneration",
        ipa: "/rɪˌmjuːnəˈreɪʃn/",
        partOfSpeech: "noun",
        meaning: "Thù lao, tiền công chi trả cho người lao động",
        basicEquivalent: "payment / money (Band 5)",
        synonyms: ["compensation package", "financial reward", "earnings"],
        collocations: ["adequate remuneration", "generous remuneration"],
        modelSentence: "Educational authorities offered generous remuneration packages to attract talented educators.",
        vietnameseSentence: "Nhà chức trách giáo dục đã đưa ra các gói thù lao hậu hĩnh để thu hút các nhà giáo tài năng."
      },
      {
        id: "t1-zim05-7",
        word: "counterpart",
        ipa: "/ˈkaʊntəpɑːt/",
        partOfSpeech: "noun",
        meaning: "Đối tượng tương đương ở nước hoặc đơn vị khác",
        basicEquivalent: "the same person in another place (Band 5)",
        synonyms: ["equivalent colleague", "peer"],
        collocations: ["Asian counterparts", "European counterparts"],
        modelSentence: "Japanese teachers earned considerably more than their Australian counterparts after 15 years.",
        vietnameseSentence: "Giáo viên Nhật Bản kiếm được nhiều hơn đáng kể so với các đồng nghiệp tương đương ở Úc sau 15 năm."
      },
      {
        id: "t1-zim05-8",
        word: "disparity",
        ipa: "/dɪˈspærəti/",
        partOfSpeech: "noun",
        meaning: "Sự chênh lệch lớn giữa các đối tượng",
        basicEquivalent: "big difference (Band 5)",
        synonyms: ["gap", "divergence", "inequality"],
        collocations: ["wide wage disparity", "stark disparity"],
        modelSentence: "The table underlines a stark disparity in public education investments across the OECD.",
        vietnameseSentence: "Bảng số liệu nhấn mạnh sự chênh lệch rõ rệt trong đầu tư giáo dục công lập giữa các nước OECD."
      }
    ]
  },
  {
    id: "task1-zim-06-water-costs",
    name: "Table: Cost of Residential Water in 5 Australian Cities (27/07/2019)",
    vietnameseName: "Bảng số liệu: Chi phí sử dụng nước sinh hoạt tại 5 thành phố Úc (27/07/2019)",
    tag: "Task 1: Bảng số liệu (Table)",
    icon: "BarChart3",
    chartType: "image",
    imageUrl: "/charts/task1/task1_zim-06-water-costs.png",
    chartData: {
      title: "Table: Cost of Residential Water in 5 Australian Cities (27/07/2019)",
      imageUrl: "/charts/task1/task1_zim-06-water-costs.png",
      keyNotes: [
        "Hai khung định mức sử dụng: Mức tiêu thụ cơ bản dưới 125 KL và mức vượt định mức trên 125 KL cùng hóa đơn trung bình năm.",
        "Sự biến động giá nước: Perth có giá nước bậc 1 rẻ nhất ($0.42/KL) nhưng lại tăng vọt lên $1.50/KL cho lượng dùng vượt 125 KL. Sydney giữ mức giá cố định duy nhất ($0.98/KL cho cả 2 bậc).",
        "Hóa đơn trung bình hằng năm: Hộ gia đình tại Perth chi trả hóa đơn trung bình cao nhất ($332), bám sát là Sydney ($319), trong khi Melbourne thấp nhất ($253)."
]
    },
    ieltsPrompt: "The table shows the cost of water in 5 cities in Australia. Summarize the information by selecting and reporting the main features and make comparisons where relevant.",
    keyNotes: [
        "Hai khung định mức sử dụng: Mức tiêu thụ cơ bản dưới 125 KL và mức vượt định mức trên 125 KL cùng hóa đơn trung bình năm.",
        "Sự biến động giá nước: Perth có giá nước bậc 1 rẻ nhất ($0.42/KL) nhưng lại tăng vọt lên $1.50/KL cho lượng dùng vượt 125 KL. Sydney giữ mức giá cố định duy nhất ($0.98/KL cho cả 2 bậc).",
        "Hóa đơn trung bình hằng năm: Hộ gia đình tại Perth chi trả hóa đơn trung bình cao nhất ($332), bám sát là Sydney ($319), trong khi Melbourne thấp nhất ($253)."
],
    modelEssay: "The table compares the cost of domestic water across five major Australian cities, evaluating pricing under and over 125 kilolitres (KL) alongside the average annual household bill.\n\nOverall, while consumers in Perth faced the cheapest rate for baseline water consumption, their tariff surged drastically when exceeding 125 KL, resulting in the highest average annual bill. Conversely, Sydney implemented a uniform pricing system across both usage brackets.\n\nLooking first at unit tariffs, Perth provided the lowest entry rate at just $0.42 per kilolitre for usage up to 125 KL. However, for consumption beyond this threshold, the price soared more than threefold to $1.50 per KL. A similar progressive pricing tier was seen in Brisbane, where unit charges escalated from $0.81 to $1.22 per KL. By contrast, Sydney maintained an identical rate of $0.98 per kilolitre regardless of consumption volume.\n\nIn terms of average expenditure, households in Perth incurred the heftiest annual water expenses, amounting to $332. Sydney trailed closely behind with an average annual bill of $319, followed by Adelaide ($312) and Brisbane ($310). In contrast, residents of Melbourne enjoyed the most economical annual water expenses, paying an average of only $253.",
    vocabularies: [
      {
        id: "t1-zim06-1",
        word: "domestic water",
        ipa: "/dəˈmestɪk ˈwɔːtər/",
        partOfSpeech: "noun",
        meaning: "Nước dùng cho mục đích sinh hoạt gia đình",
        basicEquivalent: "home water (Band 5)",
        synonyms: ["residential water", "household water supply"],
        collocations: ["cost of domestic water", "domestic water consumption"],
        modelSentence: "Metropolitan tariffs on domestic water are designed to curb excessive waste during droughts.",
        vietnameseSentence: "Biểu giá đô thị đối với nước sinh hoạt được thiết kế nhằm hạn chế lãng phí quá mức trong mùa khô hạn."
      },
      {
        id: "t1-zim06-2",
        word: "progressive tariff",
        ipa: "/prəˈɡresɪv ˈtærɪf/",
        partOfSpeech: "noun",
        meaning: "Biểu giá lũy tiến (dùng càng nhiều giá càng tăng)",
        basicEquivalent: "tiered pricing (Band 5)",
        synonyms: ["tiered pricing structure", "stepped tariff"],
        collocations: ["implement a progressive tariff", "progressive water tariff"],
        modelSentence: "Perth utility companies enforce a steep progressive tariff to penalize high water consumers.",
        vietnameseSentence: "Các công ty cấp nước tại Perth áp dụng biểu giá lũy tiến dốc để phạt những người tiêu thụ nhiều nước."
      },
      {
        id: "t1-zim06-3",
        word: "consumption threshold",
        ipa: "/kənˈsʌmpʃn ˈθreʃhəʊld/",
        partOfSpeech: "noun",
        meaning: "Ngưỡng định mức tiêu thụ",
        basicEquivalent: "usage limit (Band 5)",
        synonyms: ["usage limit", "baseline quota", "allowance cap"],
        collocations: ["exceed the consumption threshold", "surpass the 125 KL threshold"],
        modelSentence: "Surpassing the 125-kilolitre consumption threshold automatically triggers punitive billing brackets.",
        vietnameseSentence: "Việc dùng vượt ngưỡng định mức 125 kilolít sẽ tự động kích hoạt khung giá lũy tiến cao hơn."
      },
      {
        id: "t1-zim06-4",
        word: "uniform rate",
        ipa: "/ˈjuːnɪfɔːm reɪt/",
        partOfSpeech: "noun",
        meaning: "Mức giá đồng nhất, cào bằng không phân tầng",
        basicEquivalent: "same price (Band 5)",
        synonyms: ["flat tariff", "constant pricing", "invariant rate"],
        collocations: ["charge a uniform rate", "maintain a uniform rate"],
        modelSentence: "Sydney opted for a uniform rate of $0.98 per kilolitre across all volumetric categories.",
        vietnameseSentence: "Sydney đã lựa chọn một mức giá đồng nhất là 0.98 USD mỗi kilolít cho tất cả các khối lượng sử dụng."
      },
      {
        id: "t1-zim06-5",
        word: "soar",
        ipa: "/sɔːr/",
        partOfSpeech: "verb",
        meaning: "Tăng vọt đột biến",
        basicEquivalent: "go up quickly (Band 5)",
        synonyms: ["surge", "escalate", "skyrocket"],
        collocations: ["tariffs soar", "costs soar drastically"],
        modelSentence: "Water expenditure soared dramatically once household consumption surpassed the benchmark.",
        vietnameseSentence: "Chi phí tiền nước tăng vọt đột biến một khi lượng tiêu thụ của hộ gia đình vượt qua mức chuẩn."
      },
      {
        id: "t1-zim06-6",
        word: "hefty",
        ipa: "/ˈhefti/",
        partOfSpeech: "adjective",
        meaning: "Lớn, đắt đỏ, nặng nề (về tiền bạc)",
        basicEquivalent: "big / high (Band 5)",
        synonyms: ["substantial", "sizeable", "burdensome"],
        collocations: ["hefty bill", "hefty financial commitment"],
        modelSentence: "Perth homeowners incurred the heftiest annual water bill among all five metropolises.",
        vietnameseSentence: "Các chủ hộ tại Perth phải gánh chịu hóa đơn tiền nước thường niên đắt đỏ nhất trong cả năm đô thị."
      },
      {
        id: "t1-zim06-7",
        word: "economical",
        ipa: "/ˌiːkəˈnɒmɪkl/",
        partOfSpeech: "adjective",
        meaning: "Tiết kiệm, ít tốn kém chi phí",
        basicEquivalent: "cheap (Band 5)",
        synonyms: ["cost-effective", "budget-friendly", "inexpensive"],
        collocations: ["most economical option", "economical water usage"],
        modelSentence: "Melbourne represented the most economical urban location regarding utility expenditures.",
        vietnameseSentence: "Melbourne là địa điểm đô thị tiết kiệm nhất xét về các khoản chi phí tiện ích sinh hoạt."
      },
      {
        id: "t1-zim06-8",
        word: "annual outlay",
        ipa: "/ˈænjuəl ˈaʊtleɪ/",
        partOfSpeech: "noun",
        meaning: "Khoản chi tiêu xuất quỹ hằng năm",
        basicEquivalent: "yearly spending (Band 5)",
        synonyms: ["annual expenditure", "yearly bill", "annual spending"],
        collocations: ["average annual outlay", "minimize annual outlay"],
        modelSentence: "The average annual outlay on residential water in Melbourne remained limited to $253.",
        vietnameseSentence: "Khoản chi tiêu hằng năm trung bình cho nước sinh hoạt tại Melbourne chỉ dừng lại ở mức 253 USD."
      }
    ]
  },
  {
    id: "task1-zim-07-city-evolution",
    name: "Maps: City Spatial Changes from 1950 to Present Day (14/12/2019)",
    vietnameseName: "Bản đồ quy hoạch: Sự biến đổi không gian thành phố từ 1950 đến nay (14/12/2019)",
    tag: "Task 1: Bản đồ quy hoạch (Maps)",
    icon: "MapPin",
    chartType: "image",
    imageUrl: "/charts/task1/task1_zim-07-city-evolution.png",
    chartData: {
      title: "Maps: City Spatial Changes from 1950 to Present Day (14/12/2019)",
      imageUrl: "/charts/task1/task1_zim-07-city-evolution.png",
      keyNotes: [
        "Tăng trưởng dân số bùng nổ: Dân số tăng gấp 10 lần, từ 20,000 người năm 1950 lên 200,000 người hiện nay.",
        "Mở rộng khu dân cư & hạ tầng: Khu dân cư (residential areas) lan rộng bao quanh trung tâm hành chính; xây mới cầu, đập thủy điện và hệ thống đường sá hiện đại.",
        "Các công trình giữ nguyên: Vị trí của sân bay (airport) và dòng sông (river) không thay đổi vị trí địa lý."
]
    },
    ieltsPrompt: "The maps show changes in a city in 1950 and now. Summarize the information by selecting and reporting the main features and make comparison where relevant.",
    keyNotes: [
        "Tăng trưởng dân số bùng nổ: Dân số tăng gấp 10 lần, từ 20,000 người năm 1950 lên 200,000 người hiện nay.",
        "Mở rộng khu dân cư & hạ tầng: Khu dân cư (residential areas) lan rộng bao quanh trung tâm hành chính; xây mới cầu, đập thủy điện và hệ thống đường sá hiện đại.",
        "Các công trình giữ nguyên: Vị trí của sân bay (airport) và dòng sông (river) không thay đổi vị trí địa lý."
],
    modelEssay: "The given maps illustrate a number of changes taking place in a city between 1950 and the present day.\n\nOverall, the most significant modification after nearly seven decades is the dramatic expansion of residential zones to accommodate a ten-fold population boom, along with upgraded infrastructure, while the river and airport remained in their original locations.\n\nIn 1950, the city was home to a modest population of 20,000 residents, with housing concentrated predominantly directly north and south of the commercial centre. By contrast, the present population has multiplied tenfold to 200,000. To support this growth, residential districts have sprawled substantially across both riverbanks, completely encircling the business and government quarters.\n\nRegarding transport and communal amenities, several major changes are noticeable. While there was only a solitary bridge crossing the river in 1950, additional road links and crossings have since been constructed. A modern dam has been established along the river to regulate water flow and form an artificial reservoir, whereas the airport situated on the northeastern fringe and the central government complex have retained their initial layouts.",
    vocabularies: [
      {
        id: "t1-zim07-1",
        word: "residential zone",
        ipa: "/ˌrezɪˈdenʃl zəʊn/",
        partOfSpeech: "noun",
        meaning: "Khu dân cư, khu nhà ở của người dân",
        basicEquivalent: "housing area (Band 5)",
        synonyms: ["housing district", "residential quarter", "suburb"],
        collocations: ["expansion of residential zones", "densely populated residential zone"],
        modelSentence: "Vast residential zones have expanded outward to cater to incoming urban migrants.",
        vietnameseSentence: "Các khu dân cư rộng lớn đã mở rộng ra bên ngoài để phục vụ lượng người di cư đến thành phố."
      },
      {
        id: "t1-zim07-2",
        word: "sprawl",
        ipa: "/sprɔːl/",
        partOfSpeech: "verb",
        meaning: "Lan rộng, bành trướng không gian (đô thị)",
        basicEquivalent: "grow bigger (Band 5)",
        synonyms: ["expand outward", "proliferate", "spread"],
        collocations: ["urban sprawl", "sprawl across both banks"],
        modelSentence: "Residential neighbourhoods have sprawled extensively across both sides of the waterway.",
        vietnameseSentence: "Các khu phố nhà ở đã lan rộng đáng kể sang cả hai bờ nguồn nước."
      },
      {
        id: "t1-zim07-3",
        word: "tenfold",
        ipa: "/ˈtenfəʊld/",
        partOfSpeech: "adverb",
        meaning: "Gấp 10 lần",
        basicEquivalent: "ten times (Band 5)",
        synonyms: ["by a factor of ten", "decavalent"],
        collocations: ["multiply tenfold", "a tenfold increase"],
        modelSentence: "The city experienced a staggering tenfold population growth from 20,000 to 200,000.",
        vietnameseSentence: "Thành phố chứng kiến mức tăng trưởng dân số kinh ngạc gấp mười lần từ 20.000 lên 200.000 người."
      },
      {
        id: "t1-zim07-4",
        word: "encircle",
        ipa: "/ɪnˈsɜːkl/",
        partOfSpeech: "verb",
        meaning: "Bao quanh, ôm trọn lấy khu vực",
        basicEquivalent: "surround (Band 5)",
        synonyms: ["encompass", "surround", "border"],
        collocations: ["encircle the city center", "completely encircle"],
        modelSentence: "Modern housing developments now almost completely encircle the historic commercial core.",
        vietnameseSentence: "Các khu đô thị mới hiện nay gần như bao bọc hoàn toàn khu lõi thương mại lịch sử."
      },
      {
        id: "t1-zim07-5",
        word: "retain its position",
        ipa: "/rɪˈteɪn ɪts pəˈzɪʃn/",
        partOfSpeech: "verb",
        meaning: "Duy trì nguyên vẹn vị trí, không thay đổi",
        basicEquivalent: "stay in the same place (Band 5)",
        synonyms: ["remain unchanged", "stay intact", "persist"],
        collocations: ["retain its initial layout", "retain geographic position"],
        modelSentence: "The municipal aerodrome retained its position on the northeastern periphery without structural alterations.",
        vietnameseSentence: "Sân bay đô thị vẫn giữ nguyên vị trí ở vùng ven đông bắc mà không có thay đổi kết cấu nào."
      },
      {
        id: "t1-zim07-6",
        word: "hydroelectric dam",
        ipa: "/ˌhaɪdrəʊɪˈlektrɪk dæm/",
        partOfSpeech: "noun",
        meaning: "Đập thủy điện / đập ngăn nước",
        basicEquivalent: "water dam (Band 5)",
        synonyms: ["water barrier", "weir", "impoundment"],
        collocations: ["construct a dam", "erect a modern dam"],
        modelSentence: "A downstream dam was erected along the river to guarantee consistent tap water supplies.",
        vietnameseSentence: "Một con đập ở hạ lưu đã được xây dựng dọc theo sông nhằm đảm bảo nguồn nước sinh hoạt ổn định."
      },
      {
        id: "t1-zim07-7",
        word: "arterial road",
        ipa: "/ɑːˈtɪəriəl rəʊd/",
        partOfSpeech: "noun",
        meaning: "Trục đường huyết mạch, đường giao thông chính",
        basicEquivalent: "main street (Band 5)",
        synonyms: ["thoroughfare", "major roadway", "arterial highway"],
        collocations: ["network of arterial roads", "widen arterial roads"],
        modelSentence: "Additional arterial roads were introduced to link peripheral settlements to downtown office towers.",
        vietnameseSentence: "Các trục đường huyết mạch bổ sung đã được mở để kết nối các khu dân cư ngoại vi với các tòa nhà văn phòng trung tâm."
      },
      {
        id: "t1-zim07-8",
        word: "metamorphosis",
        ipa: "/ˌmetəˈmɔːfəsɪs/",
        partOfSpeech: "noun",
        meaning: "Sự chuyển mình biến đổi hoàn toàn diện mạo",
        basicEquivalent: "big change (Band 5)",
        synonyms: ["transformation", "urban redevelopment", "structural evolution"],
        collocations: ["undergo a complete metamorphosis", "urban metamorphosis"],
        modelSentence: "The town underwent a profound spatial metamorphosis from a quiet outpost into a bustling metropolis.",
        vietnameseSentence: "Thị trấn đã trải qua một sự chuyển mình không gian sâu sắc từ một trạm tiền tiêu vắng vẻ thành một đại đô thị sầm uất."
      }
    ]
  },
  {
    id: "task1-zim-08-road-safety",
    name: "Maps: Road Redesign for Accident Reduction (23/05/2019)",
    vietnameseName: "Bản đồ nút giao: Hiện trạng & đề xuất quy hoạch giảm tai nạn giao thông (23/05/2019)",
    tag: "Task 1: Bản đồ cải tạo (Maps)",
    icon: "MapPin",
    chartType: "image",
    imageUrl: "/charts/task1/task1_zim-08-road-safety.png",
    chartData: {
      title: "Maps: Road Redesign for Accident Reduction (23/05/2019)",
      imageUrl: "/charts/task1/task1_zim-08-road-safety.png",
      keyNotes: [
        "Hiện trạng giao thông: Nút giao cắt giữa City Road và Low Lane thường xuyên xảy ra tai nạn do tầm nhìn khuất và thiếu hệ thống đèn tín hiệu điều tiết.",
        "Quy hoạch đề xuất: Thay thế giao lộ nguy hiểm bằng một bùng binh/vòng xuyến lớn (roundabout), lắp đặt hệ thống đèn giao thông (traffic lights), và xây dựng các lối qua đường an toàn cho người đi bộ.",
        "Mục tiêu cốt lõi: Giảm thiểu xung đột giữa các luồng xe chuyển hướng và bảo vệ an toàn cho cả người điều khiển phương tiện lẫn người đi bộ."
]
    },
    ieltsPrompt: "The maps show a road system as it is now and the proposed changes in the future to reduce the number of accidents. Summarize the information by selecting and reporting the main features and make comparison where relevant.",
    keyNotes: [
        "Hiện trạng giao thông: Nút giao cắt giữa City Road và Low Lane thường xuyên xảy ra tai nạn do tầm nhìn khuất và thiếu hệ thống đèn tín hiệu điều tiết.",
        "Quy hoạch đề xuất: Thay thế giao lộ nguy hiểm bằng một bùng binh/vòng xuyến lớn (roundabout), lắp đặt hệ thống đèn giao thông (traffic lights), và xây dựng các lối qua đường an toàn cho người đi bộ.",
        "Mục tiêu cốt lõi: Giảm thiểu xung đột giữa các luồng xe chuyển hướng và bảo vệ an toàn cho cả người điều khiển phương tiện lẫn người đi bộ."
],
    modelEssay: "The maps provide information about a current road system and proposed changes to increase the safety of its users.\n\nOverall, the main changes being proposed include the introduction of a major roundabout, the installation of several sets of traffic lights, and the restructuring of intersecting roadways to eliminate hazardous accident blackspots.\n\nCurrently, the intersection connecting City Road and Low Lane forms a high-risk junction without traffic control mechanisms, resulting in frequent vehicular collisions. Moreover, pedestrians crossing the roadway face considerable peril due to the lack of designated crossings and oncoming high-speed traffic.\n\nUnder the proposed urban development blueprint, a sizable roundabout will be constructed at the primary intersection to regulate vehicle speeds and smooth out traffic flow. Additionally, sets of automated traffic lights will be erected at strategic points along Low Lane and City Road to coordinate turning vehicles. Safe zebra crossings and pedestrian refuge islands will also be installed, thereby mitigating accident risks for commuters and local residents alike.",
    vocabularies: [
      {
        id: "t1-zim08-1",
        word: "accident blackspot",
        ipa: "/ˈæksɪdənt ˈblækspɒt/",
        partOfSpeech: "noun",
        meaning: "Điểm đen tai nạn giao thông",
        basicEquivalent: "dangerous road place (Band 5)",
        synonyms: ["hazardous intersection", "high-collision zone"],
        collocations: ["eliminate accident blackspots", "identify blackspots"],
        modelSentence: "The outdated crossroad had long been condemned as an notorious accident blackspot.",
        vietnameseSentence: "Giao lộ cũ kỹ từ lâu đã bị xem là một điểm đen tai nạn giao thông khét tiếng."
      },
      {
        id: "t1-zim08-2",
        word: "roundabout",
        ipa: "/ˈraʊndəbaʊt/",
        partOfSpeech: "noun",
        meaning: "Vòng xuyến, bùng binh giao thông",
        basicEquivalent: "circle road (Band 5)",
        synonyms: ["traffic circle", "rotary"],
        collocations: ["install a roundabout", "navigate the roundabout"],
        modelSentence: "Planners intend to replace the uncontrolled junction with a multi-lane roundabout.",
        vietnameseSentence: "Các nhà quy hoạch dự định thay thế ngã tư không kiểm soát bằng một vòng xuyến đa làn xe."
      },
      {
        id: "t1-zim08-3",
        word: "traffic lights",
        ipa: "/ˈtræfɪk laɪts/",
        partOfSpeech: "noun",
        meaning: "Hệ thống đèn tín hiệu giao thông",
        basicEquivalent: "stop lights (Band 5)",
        synonyms: ["automated traffic signals", "signaling system"],
        collocations: ["sets of traffic lights", "signalized intersection"],
        modelSentence: "Several sets of traffic lights will be strategically positioned to meter arterial traffic flows.",
        vietnameseSentence: "Nhiều cụm đèn tín hiệu giao thông sẽ được bố trí hợp lý để điều tiết lưu lượng xe cộ trên trục chính."
      },
      {
        id: "t1-zim08-4",
        word: "pedestrian crossing",
        ipa: "/pəˈdestriən ˈkrɒsɪŋ/",
        partOfSpeech: "noun",
        meaning: "Vạch kẻ / lối đi bộ an toàn qua đường",
        basicEquivalent: "walk path on road (Band 5)",
        synonyms: ["zebra crossing", "signalized crosswalk"],
        collocations: ["designated pedestrian crossing", "crosswalk safety"],
        modelSentence: "A dedicated pedestrian crossing ensures pupils can cross the boulevard without danger.",
        vietnameseSentence: "Một lối qua đường dành riêng cho người đi bộ đảm bảo học sinh có thể qua đại lộ mà không gặp nguy hiểm."
      },
      {
        id: "t1-zim08-5",
        word: "mitigate",
        ipa: "/ˈmɪtɪɡeɪt/",
        partOfSpeech: "verb",
        meaning: "Làm giảm bớt, xoa dịu mức độ nghiêm trọng",
        basicEquivalent: "reduce (Band 5)",
        synonyms: ["alleviate", "lessen", "curb"],
        collocations: ["mitigate risks", "mitigate traffic collisions"],
        modelSentence: "The infrastructural revamp aims primarily to mitigate fatal vehicular crashes.",
        vietnameseSentence: "Việc nâng cấp hạ tầng nhằm mục tiêu chủ yếu là giảm thiểu các vụ va chạm giao thông gây tử vong."
      },
      {
        id: "t1-zim08-6",
        word: "intersection",
        ipa: "/ˌɪntəˈsekʃn/",
        partOfSpeech: "noun",
        meaning: "Ngã ba, ngã tư giao nhau",
        basicEquivalent: "crossing (Band 5)",
        synonyms: ["junction", "crossroad"],
        collocations: ["busy intersection", "perilous intersection"],
        modelSentence: "Reconfiguring the blind intersection will substantially widen sightlines for motorists.",
        vietnameseSentence: "Việc tái cấu trúc lại ngã tư khuất tầm nhìn sẽ mở rộng đáng kể tầm quan sát cho người lái xe."
      },
      {
        id: "t1-zim08-7",
        word: "refuge island",
        ipa: "/ˈrefjuːdʒ ˈaɪlənd/",
        partOfSpeech: "noun",
        meaning: "Đảo dừng chân an toàn giữa lòng đường cho người đi bộ",
        basicEquivalent: "middle safety stop (Band 5)",
        synonyms: ["pedestrian island", "safety median"],
        collocations: ["install refuge islands", "central refuge island"],
        modelSentence: "Central refuge islands allow elderly pedestrians to cross wide roadways in two manageable stages.",
        vietnameseSentence: "Các đảo dừng chân giữa đường cho phép người cao tuổi qua đường phố rộng theo hai chặng an toàn."
      },
      {
        id: "t1-zim08-8",
        word: "restructure",
        ipa: "/ˌriːˈstrʌktʃər/",
        partOfSpeech: "verb",
        meaning: "Tổ chức lại, tái định hình cơ cấu mạng lưới",
        basicEquivalent: "change the system (Band 5)",
        synonyms: ["reconfigure", "remodel", "overhaul"],
        collocations: ["restructure the road layout", "reorganize traffic lanes"],
        modelSentence: "Engineers plan to restructure the adjoining slip roads to prevent bottleneck queues.",
        vietnameseSentence: "Các kỹ sư dự định tổ chức lại các nhánh đường nhánh phụ cận để chống ùn tắc kéo dài."
      }
    ]
  },
  {
    id: "task1-zim-09-rainwater",
    name: "Process: Rainwater Harvesting for Drinking in Australia (25/05/2019)",
    vietnameseName: "Quy trình: Thu gom và lọc nước mưa thành nước uống tại thị trấn Úc (25/05/2019)",
    tag: "Task 1: Quy trình sinh hoạt (Process)",
    icon: "Layers",
    chartType: "image",
    imageUrl: "/charts/task1/task1_zim-09-rainwater.png",
    chartData: {
      title: "Process: Rainwater Harvesting for Drinking in Australia (25/05/2019)",
      imageUrl: "/charts/task1/task1_zim-09-rainwater.png",
      keyNotes: [
        "Quy trình gồm 6 bước liên hoàn: Nước mưa rơi xuống mái nhà -> dẫn qua đường ống máng xối -> đi qua bộ lọc nước -> trữ tại bồn chứa -> bơm vào bồn xử lý hóa chất diệt khuẩn -> phân phối đến vòi nước hộ gia đình.",
        "Điểm then chốt: Nước được lọc thô trước khi vào bể chứa, sau đó mới được xử lý hóa chất để đạt chuẩn nước uống tinh khiết (potable drinking water).",
        "Mạng lưới khép kín: Sử dụng hệ thống máy bơm (pump) và đường ống ngầm liên kết tới từng hộ dân."
]
    },
    ieltsPrompt: "The diagram shows how rainwater is collected for the use of drinking water in an Australia town. Summarize the information by selecting and reporting the main features and make comparison where relevant.",
    keyNotes: [
        "Quy trình gồm 6 bước liên hoàn: Nước mưa rơi xuống mái nhà -> dẫn qua đường ống máng xối -> đi qua bộ lọc nước -> trữ tại bồn chứa -> bơm vào bồn xử lý hóa chất diệt khuẩn -> phân phối đến vòi nước hộ gia đình.",
        "Điểm then chốt: Nước được lọc thô trước khi vào bể chứa, sau đó mới được xử lý hóa chất để đạt chuẩn nước uống tinh khiết (potable drinking water).",
        "Mạng lưới khép kín: Sử dụng hệ thống máy bơm (pump) và đường ống ngầm liên kết tới từng hộ dân."
],
    modelEssay: "The diagram illustrates the process of harvesting rainwater in order to provide drinking water for residents in an Australian town.\n\nOverall, there are approximately six stages in the process of rainwater harvesting, beginning with the collection of rain on residential rooftops and culminating in the delivery of treated potable drinking water to household faucets.\n\nFirstly, rain is caught on the rooftops of houses and runs down through a system of connected gutter pipes which lead directly to a water filter. Once the water has been filtered to remove debris, it then moves through underground pipes into a large storage tank.\n\nWhen water is required by the community, it is transferred through another pipe into a water treatment tank where chemicals are added to sanitize and make it safe for human consumption. Finally, once the purification is complete, the potable water is pumped through another network of distribution pipes connecting to individual homes, where residents can access it directly via their kitchen taps.",
    vocabularies: [
      {
        id: "t1-zim09-1",
        word: "rainwater harvesting",
        ipa: "/ˈreɪnwɔːtər ˈhɑːvɪstɪŋ/",
        partOfSpeech: "noun",
        meaning: "Việc thu gom và lưu trữ nước mưa tự nhiên",
        basicEquivalent: "collecting rain water (Band 5)",
        synonyms: ["rain catchment", "precipitation collection"],
        collocations: ["rainwater harvesting system", "rooftop rainwater harvesting"],
        modelSentence: "Rooftop rainwater harvesting offers a sustainable solution for drought-prone rural settlements.",
        vietnameseSentence: "Thu gom nước mưa trên mái nhà đem lại giải pháp bền vững cho các khu định cư nông thôn dễ bị hạn hán."
      },
      {
        id: "t1-zim09-2",
        word: "potable water",
        ipa: "/ˈpəʊtəbl ˈwɔːtər/",
        partOfSpeech: "noun",
        meaning: "Nước uống được, an toàn cho sức khỏe",
        basicEquivalent: "drinkable water (Band 5)",
        synonyms: ["drinking water", "safe drinking supply"],
        collocations: ["generate potable water", "potable water standards"],
        modelSentence: "The multi-stage plant converts contaminated runoff into certified potable water.",
        vietnameseSentence: "Nhà máy đa công đoạn chuyển đổi dòng chảy ô nhiễm thành nước uống đạt chuẩn kiểm định."
      },
      {
        id: "t1-zim09-3",
        word: "drain pipe",
        ipa: "/dreɪn paɪp/",
        partOfSpeech: "noun",
        meaning: "Ống thoát nước, ống xả nước",
        basicEquivalent: "water tube (Band 5)",
        synonyms: ["gutter conduit", "downpipe", "drainage conduit"],
        collocations: ["connected drain pipes", "gutter and drain pipe"],
        modelSentence: "Water cascades down steep tiled roofs through heavy-duty drain pipes into the filtration unit.",
        vietnameseSentence: "Nước chảy tràn xuống mái ngói dốc qua các ống thoát nước chịu lực vào bộ phận lọc."
      },
      {
        id: "t1-zim09-4",
        word: "storage tank",
        ipa: "/ˈstɔːrɪdʒ tæŋk/",
        partOfSpeech: "noun",
        meaning: "Bể trữ nước, bồn chứa nước dung tích lớn",
        basicEquivalent: "water box (Band 5)",
        synonyms: ["cistern", "reservoir tank", "holding chamber"],
        collocations: ["large storage tank", "underground storage tank"],
        modelSentence: "Filtered runoff is safeguarded in a sealed storage tank to protect it against mosquito larvae.",
        vietnameseSentence: "Nước sau lọc được bảo quản an toàn trong bồn chứa kín để phòng ngừa ấu trùng muỗi."
      },
      {
        id: "t1-zim09-5",
        word: "chemical treatment",
        ipa: "/ˈkemɪkl ˈtriːtmənt/",
        partOfSpeech: "noun",
        meaning: "Xử lý bằng hóa chất (khử trùng, clo hóa)",
        basicEquivalent: "clean with chemicals (Band 5)",
        synonyms: ["chemical dosing", "chemical disinfection"],
        collocations: ["undergo chemical treatment", "water chemical treatment"],
        modelSentence: "During the chemical treatment phase, chlorine neutralizes pathogenic microbes.",
        vietnameseSentence: "Trong giai đoạn xử lý bằng hóa chất, clo sẽ tiêu diệt và vô hiệu hóa các vi khuẩn gây bệnh."
      },
      {
        id: "t1-zim09-6",
        word: "water faucet",
        ipa: "/ˈwɔːtər ˈfɔːsɪt/",
        partOfSpeech: "noun",
        meaning: "Vòi nước sinh hoạt",
        basicEquivalent: "water tap (Band 5)",
        synonyms: ["household tap", "water spigot"],
        collocations: ["domestic water faucet", "turn on the faucet"],
        modelSentence: "Treated pure water is finally pressurized and piped straight to kitchen water faucets.",
        vietnameseSentence: "Nước tinh khiết sau xử lý cuối cùng được tạo áp suất và dẫn thẳng tới vòi nước nhà bếp."
      },
      {
        id: "t1-zim09-7",
        word: "filtration unit",
        ipa: "/fɪlˈtreɪʃn ˈjuːnɪt/",
        partOfSpeech: "noun",
        meaning: "Bộ phận lọc, màng lọc cơ học",
        basicEquivalent: "filter machine (Band 5)",
        synonyms: ["screening filter", "purifying filter"],
        collocations: ["pass through a filtration unit", "water filter"],
        modelSentence: "The initial filtration unit strains out suspended sediment, airborne dust, and tree leaves.",
        vietnameseSentence: "Bộ phận lọc ban đầu giữ lại cặn lơ lửng, bụi trong không khí và lá cây rụng."
      },
      {
        id: "t1-zim09-8",
        word: "pump",
        ipa: "/pʌmp/",
        partOfSpeech: "verb",
        meaning: "Bơm, đẩy chất lỏng bằng máy bơm",
        basicEquivalent: "push water (Band 5)",
        synonyms: ["propel", "pressurize", "deliver via pumps"],
        collocations: ["pump through pipes", "pump to residential households"],
        modelSentence: "Electrical booster pumps pump treated liquid through municipal supply mains.",
        vietnameseSentence: "Các máy bơm tăng áp chạy điện bơm đẩy chất lỏng đã xử lý qua đường ống cấp nước của thành phố."
      }
    ]
  },
  {
    id: "task1-zim-10-stormwater",
    name: "Process: Stormwater Recycling in an Australian City (06/06/2019)",
    vietnameseName: "Quy trình: Tái chế nước bão đô thị tại thành phố Úc (06/06/2019)",
    tag: "Task 1: Quy trình sinh thái (Process)",
    icon: "Layers",
    chartType: "image",
    imageUrl: "/charts/task1/task1_zim-10-stormwater.png",
    chartData: {
      title: "Process: Stormwater Recycling in an Australian City (06/06/2019)",
      imageUrl: "/charts/task1/task1_zim-10-stormwater.png",
      keyNotes: [
        "Quy trình sinh thái phức tạp gồm 9 bước: Thu gom nước bão đô thị -> Lưới chắn rác -> Vùng đầm lầy sinh học (wetland bio-filter) -> Bể lắng -> Xử lý hóa chất/khử trùng clo -> Bơm nạp vào tầng ngậm nước ngầm (aquifer) -> Khai thác lại và tái phân phối.",
        "Điểm khác biệt so với nước mưa: Sử dụng đầm lầy tự nhiên để phân hủy sinh học chất ô nhiễm hữu cơ và lưu trữ trong tầng ngậm nước địa chất ngầm.",
        "Tái sử dụng đô thị: Nguồn nước sau tái chế được cấp cho tưới tiêu công viên, nhà máy và dội rửa vệ sinh đô thị."
]
    },
    ieltsPrompt: "The diagram below describes how storm water is recycled in an Australian city. Summarize the information by selecting and reporting the main features and make comparison where relevant.",
    keyNotes: [
        "Quy trình sinh thái phức tạp gồm 9 bước: Thu gom nước bão đô thị -> Lưới chắn rác -> Vùng đầm lầy sinh học (wetland bio-filter) -> Bể lắng -> Xử lý hóa chất/khử trùng clo -> Bơm nạp vào tầng ngậm nước ngầm (aquifer) -> Khai thác lại và tái phân phối.",
        "Điểm khác biệt so với nước mưa: Sử dụng đầm lầy tự nhiên để phân hủy sinh học chất ô nhiễm hữu cơ và lưu trữ trong tầng ngậm nước địa chất ngầm.",
        "Tái sử dụng đô thị: Nguồn nước sau tái chế được cấp cho tưới tiêu công viên, nhà máy và dội rửa vệ sinh đô thị."
],
    modelEssay: "The diagram illustrates the sequential stages involved in recycling urban stormwater within an Australian city.\n\nOverall, the stormwater reclamation process comprises nine comprehensive steps, which combine mechanical screening, biological wetland filtration, chemical disinfection, and underground aquifer storage before reclaimed water is returned to the municipal grid.\n\nThe procedure begins when heavy rain generates stormwater runoff across urban pavements. This runoff is channeled into drainage intakes fitted with coarse screen grates to trap bulky debris and trash. Next, the water flows into engineered constructed wetlands, where aquatic plants and microbes break down dissolved organic nutrients and heavy contaminants naturally.\n\nFollowing wetland bio-filtration, the water is routed into settlement basins before undergoing chemical chlorination to eliminate harmful bacteria and pathogens. Rather than being stored in exposed surface tanks, the purified liquid is pumped deep into subterranean geological aquifers for long-term safe storage. Whenever demand peaks, specialized pump stations extract this recycled water from underground aquifers and pump it into the city's auxiliary distribution grid for industrial cooling, irrigation, and municipal reuse.",
    vocabularies: [
      {
        id: "t1-zim10-1",
        word: "stormwater runoff",
        ipa: "/ˈstɔːmwɔːtər ˈrʌnɒf/",
        partOfSpeech: "noun",
        meaning: "Dòng nước mưa bão chảy tràn trên mặt đất đô thị",
        basicEquivalent: "storm water on streets (Band 5)",
        synonyms: ["urban runoff", "surface water discharge"],
        collocations: ["collect stormwater runoff", "filter stormwater runoff"],
        modelSentence: "Uncontrolled stormwater runoff frequently washes vehicular oil and litter into municipal gutters.",
        vietnameseSentence: "Dòng nước mưa bão chảy tràn mất kiểm soát thường cuốn dầu xe và rác thải vào các mương máng đô thị."
      },
      {
        id: "t1-zim10-2",
        word: "constructed wetland",
        ipa: "/kənˈstrʌktɪd ˈwetlænd/",
        partOfSpeech: "noun",
        meaning: "Vùng đất ngập nước / đầm lầy nhân tạo để lọc sinh học",
        basicEquivalent: "water pond with plants (Band 5)",
        synonyms: ["engineered reed bed", "bio-retention basin"],
        collocations: ["flow into constructed wetlands", "wetland bio-filter"],
        modelSentence: "Vegetation within the constructed wetland naturally digests hazardous nitrogen compounds.",
        vietnameseSentence: "Thực vật bên trong vùng đầm lầy nhân tạo phân hủy tự nhiên các hợp chất nitơ độc hại."
      },
      {
        id: "t1-zim10-3",
        word: "subterranean aquifer",
        ipa: "/ˌsʌbtəˈreɪniən ˈækwɪfər/",
        partOfSpeech: "noun",
        meaning: "Tầng ngậm nước ngầm dưới lòng đất",
        basicEquivalent: "underground water rock (Band 5)",
        synonyms: ["underground water reservoir", "deep geological aquifer"],
        collocations: ["injected into an aquifer", "pump from the aquifer"],
        modelSentence: "Surplus recycled storm runoff is injected into a deep subterranean aquifer to prevent evaporation.",
        vietnameseSentence: "Nước bão tái chế dư thừa được bơm nạp vào tầng ngậm nước ngầm sâu để chống bốc hơi thất thoát."
      },
      {
        id: "t1-zim10-4",
        word: "chlorination",
        ipa: "/ˌklɒrɪˈneɪʃn/",
        partOfSpeech: "noun",
        meaning: "Quá trình khử trùng bằng clo",
        basicEquivalent: "cleaning with chlorine (Band 5)",
        synonyms: ["chlorine disinfection", "chemical sanitization"],
        collocations: ["undergo chlorination", "water chlorination"],
        modelSentence: "Chlorination guarantees that remaining pathogenic bacteria are neutralized prior to aquifer storage.",
        vietnameseSentence: "Quá trình clo hóa đảm bảo vi khuẩn gây bệnh còn sót lại bị tiêu diệt trước khi đưa vào tầng ngậm nước."
      },
      {
        id: "t1-zim10-5",
        word: "reclamation",
        ipa: "/ˌrekləˈmeɪʃn/",
        partOfSpeech: "noun",
        meaning: "Sự tái tạo, thu hồi và tái sinh tài nguyên",
        basicEquivalent: "recycling (Band 5)",
        synonyms: ["water recycling", "resource recovery"],
        collocations: ["stormwater reclamation", "wastewater reclamation"],
        modelSentence: "The city established an ambitious stormwater reclamation scheme to counter chronic droughts.",
        vietnameseSentence: "Thành phố đã thiết lập chương trình tái sinh nước bão đầy tham vọng nhằm ứng phó với các đợt hạn hán kéo dài."
      },
      {
        id: "t1-zim10-6",
        word: "coarse screen",
        ipa: "/kɔːs skriːn/",
        partOfSpeech: "noun",
        meaning: "Lưới chắn rác thô",
        basicEquivalent: "trash net (Band 5)",
        synonyms: ["debris grating", "bar screen"],
        collocations: ["pass through a coarse screen", "coarse screen filter"],
        modelSentence: "The coarse screen captures plastic bags and tree branches before the fluid enters pipework.",
        vietnameseSentence: "Lưới chắn rác thô giữ lại túi nilon và cành cây trước khi chất lỏng đi vào hệ thống đường ống."
      },
      {
        id: "t1-zim10-7",
        word: "settlement basin",
        ipa: "/ˈsetlmənt ˈbeɪsn/",
        partOfSpeech: "noun",
        meaning: "Bể lắng cặn",
        basicEquivalent: "settling pool (Band 5)",
        synonyms: ["sedimentation tank", "clarifier basin"],
        collocations: ["drain into a settlement basin", "settlement chamber"],
        modelSentence: "Heavy silt and suspended grit settle by gravity at the base of the concrete settlement basin.",
        vietnameseSentence: "Bùn nặng và cát sạn lơ lửng lắng đọng nhờ trọng lực dưới đáy bể lắng bằng bê tông."
      },
      {
        id: "t1-zim10-8",
        word: "auxiliary grid",
        ipa: "/ɔːɡˈzɪliəri ɡrɪd/",
        partOfSpeech: "noun",
        meaning: "Hệ thống mạng lưới đường ống phụ trợ (dùng cho nước tưới/vệ sinh)",
        basicEquivalent: "second pipe network (Band 5)",
        synonyms: ["secondary distribution network", "dual reticulation network"],
        collocations: ["pipe into the auxiliary grid", "auxiliary water pipeline"],
        modelSentence: "Non-potable water is channeled via a purple auxiliary grid solely reserved for landscape irrigation.",
        vietnameseSentence: "Nước không dùng để uống được dẫn qua mạng lưới phụ trợ đường ống màu tím chuyên dành cho tưới cây cảnh quan."
      }
    ]
  },
  {
    id: "task1-zim-11-water-supply",
    name: "Diagram: Water Supply Evolution in Australia: Present vs Future (12/12/2019)",
    vietnameseName: "Sơ đồ công nghệ: Hệ thống cấp nước tại Úc hiện tại và tương lai (12/12/2019)",
    tag: "Task 1: Sơ đồ so sánh (Diagram)",
    icon: "Layers",
    chartType: "image",
    imageUrl: "/charts/task1/task1_zim-11-water-supply.png",
    chartData: {
      title: "Diagram: Water Supply Evolution in Australia: Present vs Future (12/12/2019)",
      imageUrl: "/charts/task1/task1_zim-11-water-supply.png",
      keyNotes: [
        "Mô hình hiện tại (Present System): Tuyến tính một chiều, phụ thuộc hoàn toàn vào đập/hồ chứa (dam/storage) và nhà máy nước truyền thống; nước mưa và nước thải xả thẳng ra sông gây lãng phí.",
        "Mô hình tương lai (Future System): Khép kín tuần hoàn; tích hợp nhà máy tái chế nước thải (waste water recycling) và hệ thống thu gom nước mưa (stormwater collection) để tái tạo nước sạch tuần hoàn cấp lại cho đô thị.",
        "Lợi ích cốt lõi: Giảm áp lực khai thác nước từ sông hồ tự nhiên, triệt tiêu ô nhiễm nguồn nước mặt và đảm bảo an ninh nguồn nước bền vững."
]
    },
    ieltsPrompt: "The diagrams below show the water supply system in Australia at present and in the future. Summarize the information by selecting and reporting the main features and make comparison where relevant.",
    keyNotes: [
        "Mô hình hiện tại (Present System): Tuyến tính một chiều, phụ thuộc hoàn toàn vào đập/hồ chứa (dam/storage) và nhà máy nước truyền thống; nước mưa và nước thải xả thẳng ra sông gây lãng phí.",
        "Mô hình tương lai (Future System): Khép kín tuần hoàn; tích hợp nhà máy tái chế nước thải (waste water recycling) và hệ thống thu gom nước mưa (stormwater collection) để tái tạo nước sạch tuần hoàn cấp lại cho đô thị.",
        "Lợi ích cốt lõi: Giảm áp lực khai thác nước từ sông hồ tự nhiên, triệt tiêu ô nhiễm nguồn nước mặt và đảm bảo an ninh nguồn nước bền vững."
],
    modelEssay: "The diagrams illustrate the current configuration of the water supply infrastructure in Australia alongside a projected blueprint for the future.\n\nOverall, the water network is forecasted to shift from a linear, disposable paradigm to an eco-friendly circular closed loop, incorporating extensive stormwater and wastewater recycling facilities.\n\nCurrently, the Australian water system relies solely on water accumulated in dams and reservoirs, which is processed by a conventional water treatment plant before being distributed as pure water to households, factories, and commercial shops across the city. After utilization, stormwater and wastewater are discharged directly into rivers, leading to substantial environmental discharge and squandered freshwater resources.\n\nIn the proposed future system, significant structural enhancements will be introduced. While pure water will continue to be supplied from storage dams, discharged wastewater from municipal and commercial premises will no longer be flushed into the river. Instead, it will be channeled into a cutting-edge wastewater recycling plant to be purified and returned directly to the city grid. Similarly, urban stormwater will also be captured, treated, and integrated back into the supply stream, effectively curtailing raw extraction from natural river basins.",
    vocabularies: [
      {
        id: "t1-zim11-1",
        word: "linear paradigm",
        ipa: "/ˈlɪniər ˈpærədaɪm/",
        partOfSpeech: "noun",
        meaning: "Mô hình tuyến tính một chiều (khai thác - sử dụng - thải bỏ)",
        basicEquivalent: "one-way system (Band 5)",
        synonyms: ["one-way flow", "unidirectional model"],
        collocations: ["shift from a linear paradigm", "traditional linear paradigm"],
        modelSentence: "The historic supply model was a linear paradigm where used water was casually abandoned into rivers.",
        vietnameseSentence: "Mô hình cấp nước trước đây là một mô hình tuyến tính, nơi nước đã qua sử dụng bị thải bỏ tự do ra sông ngòi."
      },
      {
        id: "t1-zim11-2",
        word: "circular loop",
        ipa: "/ˈsɜːkjələr luːp/",
        partOfSpeech: "noun",
        meaning: "Vòng tuần hoàn khép kín",
        basicEquivalent: "round recycling circle (Band 5)",
        synonyms: ["closed-loop system", "circular recycling circuit"],
        collocations: ["form a circular loop", "closed circular loop"],
        modelSentence: "Future urban engineering establishes a circular loop that continually purifies and recirculates effluents.",
        vietnameseSentence: "Kỹ thuật đô thị tương lai thiết lập một vòng tuần hoàn khép kín liên tục làm sạch và tái lưu thông nước thải."
      },
      {
        id: "t1-zim11-3",
        word: "wastewater recycling plant",
        ipa: "/ˈweɪstwɔːtər ˌriːˈsaɪklɪŋ plɑːnt/",
        partOfSpeech: "noun",
        meaning: "Nhà máy tái chế nước thải",
        basicEquivalent: "dirty water cleaning factory (Band 5)",
        synonyms: ["effluent reclamation facility", "sewage treatment plant"],
        collocations: ["build a wastewater recycling plant", "divert to the plant"],
        modelSentence: "The planned wastewater recycling plant will remove dissolved solids using reverse osmosis membranes.",
        vietnameseSentence: "Nhà máy tái chế nước thải trong quy hoạch sẽ loại bỏ các chất rắn hòa tan bằng màng lọc thẩm thấu ngược."
      },
      {
        id: "t1-zim11-4",
        word: "effluent",
        ipa: "/ˈefluənt/",
        partOfSpeech: "noun",
        meaning: "Nước thải từ các khu công nghiệp hoặc đô thị xả ra",
        basicEquivalent: "waste dirty water (Band 5)",
        synonyms: ["liquid waste", "discharge sewage", "spent water"],
        collocations: ["industrial effluents", "discharge untreated effluent"],
        modelSentence: "Discharging untreated municipal effluents into local rivers threatens fragile aquatic ecosystems.",
        vietnameseSentence: "Việc xả nước thải đô thị chưa qua xử lý ra các con sông địa phương đe dọa các hệ sinh thái thủy sinh mỏng manh."
      },
      {
        id: "t1-zim11-5",
        word: "storage dam",
        ipa: "/ˈstɔːrɪdʒ dæm/",
        partOfSpeech: "noun",
        meaning: "Đập trữ nước, hồ thủy lợi tích nước",
        basicEquivalent: "water reservoir (Band 5)",
        synonyms: ["holding reservoir", "water impoundment"],
        collocations: ["water accumulated in storage dams", "dam water levels"],
        modelSentence: "Rainfall collected behind the storage dam supplies high-pressure pipelines entering the city.",
        vietnameseSentence: "Lượng mưa tích tụ sau đập trữ nước cung cấp cho các đường ống áp lực cao dẫn vào đô thị."
      },
      {
        id: "t1-zim11-6",
        word: "curtail",
        ipa: "/kɜːˈteɪl/",
        partOfSpeech: "verb",
        meaning: "Cắt giảm, hạn chế đáng kể",
        basicEquivalent: "reduce / cut down (Band 5)",
        synonyms: ["diminish", "slash", "scale back"],
        collocations: ["curtail water extraction", "curtail reliance on rivers"],
        modelSentence: "Recycling greywater effectively curtails municipal extraction from environmentally stressed watersheds.",
        vietnameseSentence: "Tái chế nước thải sinh hoạt giúp cắt giảm hiệu quả lượng nước khai thác từ các lưu vực sông đang chịu áp lực môi trường."
      },
      {
        id: "t1-zim11-7",
        word: "recirculation",
        ipa: "/ˌriːˌsɜːkjəˈleɪʃn/",
        partOfSpeech: "noun",
        meaning: "Sự tái tuần hoàn, tái lưu thông",
        basicEquivalent: "flowing back again (Band 5)",
        synonyms: ["continuous recirculation", "recycling redistribution"],
        collocations: ["water recirculation", "continuous recirculation"],
        modelSentence: "Constant water recirculation shields cities from unpredictable drought spells.",
        vietnameseSentence: "Việc tái tuần hoàn nước liên tục bảo vệ các thành phố trước những đợt hạn hán thất thường."
      },
      {
        id: "t1-zim11-8",
        word: "blueprint",
        ipa: "/ˈbluːprɪnt/",
        partOfSpeech: "noun",
        meaning: "Bản vẽ thiết kế, kế hoạch định hướng tương lai",
        basicEquivalent: "plan map (Band 5)",
        synonyms: ["master plan", "architectural scheme", "strategic design"],
        collocations: ["future infrastructure blueprint", "engineering blueprint"],
        modelSentence: "The master blueprint envisages a zero-waste hydraulic framework for all major Australian conurbations.",
        vietnameseSentence: "Bản kế hoạch định hướng tổng thể dự kiến xây dựng khung thủy lực không rác thải cho mọi vùng đô thị lớn ở Úc."
      }
    ]
  },
  {
    id: "task1-zim-12-student-rooms",
    name: "Plans: University Student Single vs Double Room Floor Plans (25/07/2020)",
    vietnameseName: "Bản vẽ mặt bằng: Thiết kế phòng ký túc xá đơn và phòng đôi tại đại học (25/07/2020)",
    tag: "Task 1: Bản vẽ mặt bằng (Plans)",
    icon: "MapPin",
    chartType: "image",
    imageUrl: "/charts/task1/task1_zim-12-student-rooms.png",
    chartData: {
      title: "Plans: University Student Single vs Double Room Floor Plans (25/07/2020)",
      imageUrl: "/charts/task1/task1_zim-12-student-rooms.png",
      keyNotes: [
        "Diện tích & Giá thuê: Phòng đôi (Double room) rộng 6m x 4m (24 m²), giá $350/tuần. Phòng đơn (Single room) rộng 6m x 3m (18 m²), giá $200/tuần.",
        "Nội thất cơ bản: Cả hai phòng đều trang bị phòng tắm khép kín (bathroom), góc bếp nấu ăn (kitchenette) và khu vực học tập.",
        "Khác biệt bố trí: Phòng đôi được trang bị 2 bàn học, 2 giường đơn và một tủ quần áo ngăn đôi; phòng đơn chỉ có 1 giường và 1 bàn học rộng rãi cạnh cửa sổ."
]
    },
    ieltsPrompt: "The plans below show a student room for two people and a student room for one person at an Australian university. Summarize the information by selecting and reporting the main features and make comparisons where relevant.",
    keyNotes: [
        "Diện tích & Giá thuê: Phòng đôi (Double room) rộng 6m x 4m (24 m²), giá $350/tuần. Phòng đơn (Single room) rộng 6m x 3m (18 m²), giá $200/tuần.",
        "Nội thất cơ bản: Cả hai phòng đều trang bị phòng tắm khép kín (bathroom), góc bếp nấu ăn (kitchenette) và khu vực học tập.",
        "Khác biệt bố trí: Phòng đôi được trang bị 2 bàn học, 2 giường đơn và một tủ quần áo ngăn đôi; phòng đơn chỉ có 1 giường và 1 bàn học rộng rãi cạnh cửa sổ."
],
    modelEssay: "The plans show the layouts of a single room and a double room for students at an Australian University.\n\nOverall, it is clear that both room types provide very similar basic amenities; however, the double room offers a larger floor area and commands a substantially higher weekly rental fee than its single counterpart.\n\nIn terms of dimensions and pricing, the double room measures 6 metres by 4 metres, creating a total floor space of 24 square metres, and costs $350 per week. By comparison, the single room is narrower at 6 metres by 3 metres (18 square metres) and is more economical, costing $200 weekly.\n\nRegarding internal furnishings, both rooms contain an enclosed ensuite bathroom with a toilet and shower in the top corner, as well as an adjacent kitchenette counter. The double accommodation features two single beds placed along opposite walls, two separate study desks, and a partitioned wardrobe closet. In contrast, the single room accommodates a single bed, a lone study desk with television access positioned along the exterior window wall, and a smaller singular cupboard.",
    vocabularies: [
      {
        id: "t1-zim12-1",
        word: "floor plan",
        ipa: "/flɔː plæn/",
        partOfSpeech: "noun",
        meaning: "Bản vẽ mặt bằng kiến trúc nội thất",
        basicEquivalent: "room drawing (Band 5)",
        synonyms: ["architectural layout", "spatial blueprint"],
        collocations: ["examine the floor plan", "floor plan layout"],
        modelSentence: "The architectural floor plan clearly denotes the dimensions of both residential quarters.",
        vietnameseSentence: "Bản vẽ mặt bằng kiến trúc thể hiện rõ kích thước của cả hai không gian phòng ở."
      },
      {
        id: "t1-zim12-2",
        word: "ensuite bathroom",
        ipa: "/ˌɒn ˈswiːt ˈbɑːθruːm/",
        partOfSpeech: "noun",
        meaning: "Phòng tắm vệ sinh khép kín trong phòng ngủ",
        basicEquivalent: "private toilet (Band 5)",
        synonyms: ["private washroom", "attached bathroom"],
        collocations: ["fitted with an ensuite bathroom", "ensuite amenities"],
        modelSentence: "Each student accommodation module is outfitted with a private ensuite bathroom.",
        vietnameseSentence: "Mỗi mô-đun phòng ở của sinh viên đều được trang bị một phòng tắm vệ sinh khép kín riêng biệt."
      },
      {
        id: "t1-zim12-3",
        word: "kitchenette",
        ipa: "/ˌkɪtʃɪˈnet/",
        partOfSpeech: "noun",
        meaning: "Khu bếp nhỏ tự nấu ăn trong phòng",
        basicEquivalent: "small cooking corner (Band 5)",
        synonyms: ["cooking counter", "pantry alcove"],
        collocations: ["compact kitchenette", "equipped kitchenette"],
        modelSentence: "A compact kitchenette allows undergraduates to reheat meals and brew tea without leaving the room.",
        vietnameseSentence: "Một góc bếp nhỏ gọn cho phép sinh viên hâm nóng thức ăn và pha trà mà không cần ra khỏi phòng."
      },
      {
        id: "t1-zim12-4",
        word: "weekly rental fee",
        ipa: "/ˈwiːkli ˈrentl fiː/",
        partOfSpeech: "noun",
        meaning: "Giá thuê phòng theo tuần",
        basicEquivalent: "rent each week (Band 5)",
        synonyms: ["weekly rate", "leasing cost per week"],
        collocations: ["charge a weekly rental fee", "affordable rental fee"],
        modelSentence: "The weekly rental fee for the double occupancy room is fixed at $350 AUD.",
        vietnameseSentence: "Giá thuê phòng theo tuần đối với phòng đôi được quy định cố định ở mức 350 AUD."
      },
      {
        id: "t1-zim12-5",
        word: "furnishings",
        ipa: "/ˈfɜːnɪʃɪŋz/",
        partOfSpeech: "noun",
        meaning: "Đồ đạc nội thất trang bị trong phòng",
        basicEquivalent: "furniture (Band 5)",
        synonyms: ["interior fittings", "amenities", "room appointments"],
        collocations: ["standard furnishings", "interior furnishings"],
        modelSentence: "Internal furnishings in both living units follow a functional, space-saving arrangement.",
        vietnameseSentence: "Đồ đạc nội thất trong cả hai căn phòng đều tuân thủ cách bài trí tiện dụng và tiết kiệm không gian."
      },
      {
        id: "t1-zim12-6",
        word: "partitioned",
        ipa: "/pɑːˈtɪʃnd/",
        partOfSpeech: "adjective",
        meaning: "Được ngăn đôi, chia ngăn riêng biệt",
        basicEquivalent: "divided into two (Band 5)",
        synonyms: ["divided", "compartmentalized", "segregated"],
        collocations: ["partitioned wardrobe", "partitioned closet"],
        modelSentence: "The dual-occupant suite includes a partitioned wardrobe so each tenant possesses personal storage.",
        vietnameseSentence: "Phòng đôi bao gồm một tủ quần áo ngăn đôi để mỗi người thuê đều có không gian cất đồ cá nhân."
      },
      {
        id: "t1-zim12-7",
        word: "floor space",
        ipa: "/flɔː speɪs/",
        partOfSpeech: "noun",
        meaning: "Diện tích mặt sàn sử dụng",
        basicEquivalent: "room size (Band 5)",
        synonyms: ["surface area", "square meterage", "living area"],
        collocations: ["total floor space", "usable floor space"],
        modelSentence: "The double room provides 24 square metres of floor space, a third larger than the single unit.",
        vietnameseSentence: "Phòng đôi có 24 mét vuông diện tích mặt sàn, rộng hơn một phần ba so với căn phòng đơn."
      },
      {
        id: "t1-zim12-8",
        word: "adjacent to",
        ipa: "/əˈdʒeɪsnt tuː/",
        partOfSpeech: "adjective",
        meaning: "Nằm sát ngay cạnh bên",
        basicEquivalent: "next to (Band 5)",
        synonyms: ["adjoining", "bordering", "neighboring"],
        collocations: ["located adjacent to", "situated adjacent to the entrance"],
        modelSentence: "The sink and induction hob are situated adjacent to the primary entryway.",
        vietnameseSentence: "Bồn rửa và bếp từ được bố trí nằm sát ngay cạnh lối ra vào chính."
      }
    ]
  },
  {
    id: "task1-zim-13-stone-tools",
    name: "Diagram: Development of Stone Age Cutting Tools (28/11/2020)",
    vietnameseName: "Biểu đồ tiến hóa: Sự phát triển công cụ cắt gọt thời kỳ đồ đá (28/11/2020)",
    tag: "Task 1: Sơ đồ tiến hóa (Diagram)",
    icon: "Layers",
    chartType: "image",
    imageUrl: "/charts/task1/task1_zim-13-stone-tools.png",
    chartData: {
      title: "Diagram: Development of Stone Age Cutting Tools (28/11/2020)",
      imageUrl: "/charts/task1/task1_zim-13-stone-tools.png",
      keyNotes: [
        "Khoảng thời gian khảo cổ: So sánh Công cụ A (Tool A - cách đây 1.4 triệu năm) và Công cụ B (Tool B - cách đây 0.8 triệu năm).",
        "Công cụ A (1.4 triệu năm trước): Kích thước lớn, hình thù thô sơ, ghè đẽo góc cạnh đơn giản, bề mặt lồi lõm sần sùi và lưỡi cắt cùn.",
        "Công cụ B (0.8 triệu năm trước): Tiến hóa rõ rệt thành dạng hình giọt nước (teardrop shape), mài dẹp đối xứng hai bên, lưỡi cắt sắc bén và kỹ thuật chế tác tinh xảo vượt bậc."
]
    },
    ieltsPrompt: "The diagram below shows the development of the cutting tool in the Stone Age. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    keyNotes: [
        "Khoảng thời gian khảo cổ: So sánh Công cụ A (Tool A - cách đây 1.4 triệu năm) và Công cụ B (Tool B - cách đây 0.8 triệu năm).",
        "Công cụ A (1.4 triệu năm trước): Kích thước lớn, hình thù thô sơ, ghè đẽo góc cạnh đơn giản, bề mặt lồi lõm sần sùi và lưỡi cắt cùn.",
        "Công cụ B (0.8 triệu năm trước): Tiến hóa rõ rệt thành dạng hình giọt nước (teardrop shape), mài dẹp đối xứng hai bên, lưỡi cắt sắc bén và kỹ thuật chế tác tinh xảo vượt bậc."
],
    modelEssay: "The diagram illustrates the evolution of the cutting tool during the period from 1.4 million years ago to 0.8 million years ago in the Stone Age.\n\nIt can be seen that a number of upgrades were made in the shape, sharpness, and craftsmanship of the tool so that it could become a far more effective cutting instrument over 600,000 years of human evolution.\n\n1.4 million years ago, Tool A was primitive and rough in appearance. Viewed from the front and back, it had an irregular, bulbous oval outline with minimal intentional shaping. The side profile shows that the tool was relatively thick and bulky, featuring coarse, unevenly chipped edges that would have provided only limited cutting efficiency.\n\nBy contrast, Tool B, dating back 0.8 million years ago, displayed significant technological refinement. It had evolved into a streamlined teardrop shape with a tapered, pointed tip. When examined from the side, Tool B was noticeably flatter and thinner than Tool A, with symmetrically flaked edges that formed a continuous, sharp cutting rim along its perimeter, reflecting advanced prehistoric knapping techniques.",
    vocabularies: [
      {
        id: "t1-zim13-1",
        word: "primitive",
        ipa: "/ˈprɪmətɪv/",
        partOfSpeech: "adjective",
        meaning: "Nguyên thủy, thô sơ",
        basicEquivalent: "simple and old (Band 5)",
        synonyms: ["rudimentary", "crude", "archaic"],
        collocations: ["primitive tool", "primitive craftsmanship"],
        modelSentence: "Early hominids relied on primitive flaked stones for basic butchering chores.",
        vietnameseSentence: "Người vượn thời kỳ đầu dựa vào những hòn đá ghè đẽo thô sơ cho các công việc pha thịt cơ bản."
      },
      {
        id: "t1-zim13-2",
        word: "teardrop-shaped",
        ipa: "/ˈtɪədrɒp ʃeɪpt/",
        partOfSpeech: "adjective",
        meaning: "Có hình dáng giọt nước thon gọn",
        basicEquivalent: "water drop shape (Band 5)",
        synonyms: ["pear-shaped", "cordiform"],
        collocations: ["teardrop-shaped hand axe", "teardrop silhouette"],
        modelSentence: "The later artifact evolved into an iconic teardrop-shaped hand axe with balanced proportions.",
        vietnameseSentence: "Hiện vật thời kỳ sau đã tiến hóa thành chiếc rìu tay hình giọt nước mang tính biểu tượng với tỷ lệ cân đối."
      },
      {
        id: "t1-zim13-3",
        word: "pointed tip",
        ipa: "/ˈpɔɪntɪd tɪp/",
        partOfSpeech: "noun",
        meaning: "Mũi nhọn ở đỉnh đầu công cụ",
        basicEquivalent: "sharp point (Band 5)",
        synonyms: ["tapered apex", "sharp point"],
        collocations: ["feature a pointed tip", "sharp pointed tip"],
        modelSentence: "A distinct pointed tip enabled Paleolithic hunters to pierce tough animal hides effortlessly.",
        vietnameseSentence: "Một mũi nhọn rõ nét cho phép thợ săn thời kỳ đồ đá cũ đâm thủng da thú dai một cách dễ dàng."
      },
      {
        id: "t1-zim13-4",
        word: "craftsmanship",
        ipa: "/ˈkrɑːftsmənʃɪp/",
        partOfSpeech: "noun",
        meaning: "Tay nghề chế tác, kỹ thuật tinh xảo",
        basicEquivalent: "making skill (Band 5)",
        synonyms: ["artistry", "workmanship", "knapping skill"],
        collocations: ["flawless craftsmanship", "refine craftsmanship"],
        modelSentence: "The symmetry of Tool B highlights a monumental leap forward in cognitive craftsmanship.",
        vietnameseSentence: "Tính đối xứng của Công cụ B nêu bật một bước nhảy vọt vĩ đại về tư duy chế tác thủ công."
      },
      {
        id: "t1-zim13-5",
        word: "flaked edge",
        ipa: "/fleɪkt edʒ/",
        partOfSpeech: "noun",
        meaning: "Cạnh được ghè đẽo, gọt mài tạo lưỡi sắc",
        basicEquivalent: "cut side (Band 5)",
        synonyms: ["knapped rim", "beveled margin", "cutting edge"],
        collocations: ["symmetrically flaked edge", "sharp flaked edge"],
        modelSentence: "Carefully flaked edges surrounded the entire perimeter of the advanced implement.",
        vietnameseSentence: "Những cạnh được ghè đẽo cẩn thận bao quanh toàn bộ chu vi của công cụ cải tiến."
      },
      {
        id: "t1-zim13-6",
        word: "cutting rim",
        ipa: "/ˈkʌtɪŋ rɪm/",
        partOfSpeech: "noun",
        meaning: "Mép lưỡi cắt sắc bén",
        basicEquivalent: "sharp border (Band 5)",
        synonyms: ["blade edge", "cutting periphery"],
        collocations: ["continuous cutting rim", "sharpen the cutting rim"],
        modelSentence: "The continuous cutting rim vastly widened the practical utility of the tool.",
        vietnameseSentence: "Mép lưỡi cắt liền mạch đã mở rộng đáng kể công năng thực tế của dụng cụ."
      },
      {
        id: "t1-zim13-7",
        word: "side profile",
        ipa: "/saɪd ˈprəʊfaɪl/",
        partOfSpeech: "noun",
        meaning: "Góc nhìn nghiêng cạnh bên",
        basicEquivalent: "side view (Band 5)",
        synonyms: ["lateral perspective", "side cross-section"],
        collocations: ["revealed in the side profile", "tapered side profile"],
        modelSentence: "Viewed from the side profile, Tool B exhibits an exceptionally slim and aerodynamic contour.",
        vietnameseSentence: "Nhìn từ góc nghiêng cạnh bên, Công cụ B sở hữu đường nét cực kỳ mỏng và khí động học."
      },
      {
        id: "t1-zim13-8",
        word: "knapping technique",
        ipa: "/ˈnæpɪŋ tekˈniːk/",
        partOfSpeech: "noun",
        meaning: "Kỹ thuật ghè đẽo đá thời tiền sử",
        basicEquivalent: "stone making method (Band 5)",
        synonyms: ["lithic reduction technique", "flintknapping"],
        collocations: ["master knapping techniques", "sophisticated knapping technique"],
        modelSentence: "Sophisticated knapping techniques allowed artisans to shave off wafer-thin stone flakes.",
        vietnameseSentence: "Kỹ thuật ghè đẽo đá tinh vi cho phép những người thợ bóc tách những mảnh đá mỏng như cánh hoa."
      }
    ]
  }
,
  {
    id: "task1-top-01-tourist-arrivals",
    name: "Line Graph: International Tourist Arrivals in 5 Countries (1995-2010)",
    vietnameseName: "Biểu đồ đường: Lượng khách du lịch quốc tế tại 5 quốc gia (1995-2010)",
    tag: "Task 1: Biểu đồ đường (Line Graph)",
    icon: "TrendingUp",
    chartType: "image",
    imageUrl: "/charts/task1/task1_top-01-tourist-arrivals.png",
    chartData: {
      title: "Line Graph: International Tourist Arrivals in 5 Countries (1995-2010)",
      imageUrl: "/charts/task1/task1_top-01-tourist-arrivals.png",
      keyNotes: [
        "Hai điểm đến hàng đầu: Hoa Kỳ và Pháp thu hút lượng khách vượt trội so với các quốc gia còn lại, cùng tiến gần mốc 90 triệu lượt vào năm 2010.",
        "Tăng trưởng bứt phá của Pháp: Pháp tăng mạnh từ hơn 30 triệu (1995) lên gần 90 triệu (2010), trong khi Mỹ giảm nhẹ trong giai đoạn 2005-2010.",
        "Malaysia, Brazil & Ai Cập: Malaysia tăng đều đặn nhưng luôn dưới 50 triệu lượt; Brazil và Ai Cập có lượng khách thấp nhất (dưới 20 triệu lượt)."
]
    },
    ieltsPrompt: "The graph below gives information about international tourist arrivals in five countries. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    keyNotes: [
        "Hai điểm đến hàng đầu: Hoa Kỳ và Pháp thu hút lượng khách vượt trội so với các quốc gia còn lại, cùng tiến gần mốc 90 triệu lượt vào năm 2010.",
        "Tăng trưởng bứt phá của Pháp: Pháp tăng mạnh từ hơn 30 triệu (1995) lên gần 90 triệu (2010), trong khi Mỹ giảm nhẹ trong giai đoạn 2005-2010.",
        "Malaysia, Brazil & Ai Cập: Malaysia tăng đều đặn nhưng luôn dưới 50 triệu lượt; Brazil và Ai Cập có lượng khách thấp nhất (dưới 20 triệu lượt)."
],
    modelEssay: "The graph shows the overall numbers of tourist arrivals in five countries between 1995 and 2010.\n\nOverall, the United States and France were by far the two most popular tourist destinations throughout the 15-year period. While France experienced dramatic and sustained growth, the remaining countries recorded lower figures, with Brazil and Egypt attracting the smallest numbers of international visitors.\n\nIn 1995, over 70 million tourists visited the United States, which was more than twice the total recorded for France (around 30 million). Over the next decade, tourist numbers in the US fluctuated slightly before peaking at around 90 million in 2005, followed by a slight dip between 2005 and 2010. Conversely, arrivals in France surged steadily, culminating in a steep increase of nearly 20 million visitors between 2005 and 2010, so that by 2010 the arrivals in both countries leveled off at approximately 90 million each.\n\nTurning to the other three nations, inbound tourism in Malaysia rose consistently from around 10 million in 1995 to reach nearly 45 million in 2010. Meanwhile, Brazil and Egypt registered the fewest arrivals, tracking each other closely at roughly 5 million until 2000, after which Egypt saw faster growth to finish near 15 million, while Brazil plateaued below 10 million.",
    vocabularies: [
      {
        id: "t1-top01-1",
        word: "tourist arrivals",
        ipa: "/ˈtʊərɪst əˈraɪvlz/",
        partOfSpeech: "noun",
        meaning: "Lượt khách du lịch quốc tế nhập cảnh",
        basicEquivalent: "number of visitors (Band 5)",
        synonyms: ["inbound tourists", "incoming travelers", "visitor arrivals"],
        collocations: ["international tourist arrivals", "surge in tourist arrivals"],
        modelSentence: "International tourist arrivals in France surged dramatically over the final five-year timeframe.",
        vietnameseSentence: "Lượt khách du lịch quốc tế đến Pháp đã tăng vọt một cách ấn tượng trong khung thời gian 5 năm cuối."
      },
      {
        id: "t1-top01-2",
        word: "level off",
        ipa: "/ˈlevl ɒf/",
        partOfSpeech: "verb",
        meaning: "Chững lại, duy trì ở mức cân bằng ổn định",
        basicEquivalent: "stop rising (Band 5)",
        synonyms: ["plateau", "flatten out", "stabilize"],
        collocations: ["level off at approximately", "level off after rapid growth"],
        modelSentence: "Visitor numbers leveled off at roughly 90 million by the end of the survey period.",
        vietnameseSentence: "Lượng du khách đã chững lại ở mức xấp xỉ 90 triệu lượt vào cuối giai đoạn khảo sát."
      },
      {
        id: "t1-top01-3",
        word: "inbound tourism",
        ipa: "/ˈɪnbaʊnd ˈtʊərɪzəm/",
        partOfSpeech: "noun",
        meaning: "Du lịch quốc tế chiều vào (khách nước ngoài đến)",
        basicEquivalent: "foreign travel in (Band 5)",
        synonyms: ["incoming tourism", "foreign visitor traffic"],
        collocations: ["inbound tourism volume", "promote inbound tourism"],
        modelSentence: "Malaysia witnessed uninterrupted expansion in inbound tourism throughout the entire period.",
        vietnameseSentence: "Malaysia chứng kiến sự tăng trưởng không ngừng về lượng khách du lịch quốc tế nhập cảnh trong suốt giai đoạn."
      },
      {
        id: "t1-top01-4",
        word: "outstrip",
        ipa: "/aʊtˈstrɪp/",
        partOfSpeech: "verb",
        meaning: "Vượt xa, bỏ cách đối thủ phía sau",
        basicEquivalent: "be higher than (Band 5)",
        synonyms: ["eclipse", "exceed", "outpace"],
        collocations: ["outstrip competitors", "outstrip the next popular destination"],
        modelSentence: "In 1995, US tourist figures heavily outstripped those of all other competitor nations.",
        vietnameseSentence: "Vào năm 1995, các số liệu du khách của Mỹ đã bỏ xa số liệu của tất cả các quốc gia cạnh tranh khác."
      },
      {
        id: "t1-top01-5",
        word: "plateau",
        ipa: "/ˈplætəʊ/",
        partOfSpeech: "verb",
        meaning: "Dừng tăng và đi ngang ở mức nhất định",
        basicEquivalent: "stay at the same level (Band 5)",
        synonyms: ["reach a plateau", "stagnate", "remain flat"],
        collocations: ["plateau below 10 million", "reach a plateau"],
        modelSentence: "After modest gains, Brazilian arrivals plateaued at approximately seven million annually.",
        vietnameseSentence: "Sau những bước tăng khiêm tốn, lượng khách đến Brazil đã đi ngang ở mức khoảng 7 triệu lượt mỗi năm."
      },
      {
        id: "t1-top01-6",
        word: "culminate in",
        ipa: "/ˈkʌlmɪneɪt ɪn/",
        partOfSpeech: "verb",
        meaning: "Đạt tới đỉnh điểm hoặc kết thúc ở mức",
        basicEquivalent: "end with (Band 5)",
        synonyms: ["climax in", "conclude with", "reach an apex of"],
        collocations: ["culminate in a steep increase", "culminate at 90 million"],
        modelSentence: "The sustained advertising campaign culminated in a record influx of holidaymakers.",
        vietnameseSentence: "Chiến dịch quảng bá bền bỉ đã đạt đỉnh điểm với lượng khách nghỉ dưỡng đổ về cao kỷ lục."
      },
      {
        id: "t1-top01-7",
        word: "holidaymaker",
        ipa: "/ˈhɒlədeɪmeɪkər/",
        partOfSpeech: "noun",
        meaning: "Khách du lịch đi nghỉ mát",
        basicEquivalent: "tourist (Band 5)",
        synonyms: ["vacationer", "sightseer", "traveler"],
        collocations: ["influx of holidaymakers", "attract overseas holidaymakers"],
        modelSentence: "European holidaymakers demonstrated a marked preference for Mediterranean coastal resorts.",
        vietnameseSentence: "Những người đi nghỉ mát Châu Âu thể hiện sự ưu tiên rõ rệt cho các khu nghỉ dưỡng ven biển Địa Trung Hải."
      },
      {
        id: "t1-top01-8",
        word: "sustained growth",
        ipa: "/səˈsteɪnd ɡrəʊθ/",
        partOfSpeech: "noun",
        meaning: "Sự tăng trưởng liên tục và bền vững",
        basicEquivalent: "continuous rise (Band 5)",
        synonyms: ["steady expansion", "unbroken ascent"],
        collocations: ["register sustained growth", "experience sustained growth"],
        modelSentence: "France enjoyed sustained growth across all three five-year census intervals.",
        vietnameseSentence: "Nước Pháp đã có được mức tăng trưởng liên tục qua cả ba kỳ điều tra kéo dài 5 năm."
      }
    ]
  },
  {
    id: "task1-top-02-wave-power",
    name: "Process: Electricity Generation via Wave Power Turbine",
    vietnameseName: "Quy trình: Cơ chế phát điện bằng năng lượng sóng biển qua tuabin hai chiều",
    tag: "Task 1: Sơ đồ quy trình (Process)",
    icon: "Layers",
    chartType: "image",
    imageUrl: "/charts/task1/task1_top-02-wave-power.png",
    chartData: {
      title: "Process: Electricity Generation via Wave Power Turbine",
      imageUrl: "/charts/task1/task1_top-02-wave-power.png",
      keyNotes: [
        "Hệ thống hai chu kỳ: Chu kỳ sóng vào (dâng lên) và chu kỳ sóng rút (hạ xuống).",
        "Nguyên lý khí nén: Khi sóng tràn vào buồng kín, nước dâng lên đẩy khí qua tuabin; khi sóng rút, áp suất âm hút khí quay ngược lại.",
        "Cơ chế tuabin thông minh: Nhờ thiết kế cánh đặc biệt, tuabin luôn quay theo cùng một chiều (same direction) trong cả hai pha đẩy và hút để phát điện liên tục."
]
    },
    ieltsPrompt: "The diagram below shows how electricity is generated by wave power. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    keyNotes: [
        "Hệ thống hai chu kỳ: Chu kỳ sóng vào (dâng lên) và chu kỳ sóng rút (hạ xuống).",
        "Nguyên lý khí nén: Khi sóng tràn vào buồng kín, nước dâng lên đẩy khí qua tuabin; khi sóng rút, áp suất âm hút khí quay ngược lại.",
        "Cơ chế tuabin thông minh: Nhờ thiết kế cánh đặc biệt, tuabin luôn quay theo cùng một chiều (same direction) trong cả hai pha đẩy và hút để phát điện liên tục."
],
    modelEssay: "The diagram illustrates the process of generating electrical energy utilizing the force of ocean waves.\n\nOverall, the electricity generation cycle consists of two distinct stages: the rising wave phase and the receding wave phase. The most remarkable feature of the system is that the turbine rotates continuously in the same direction regardless of whether airflow is being pushed upward or drawn downward.\n\nIn the first stage, incoming ocean waves surge into a reinforced containment chamber built into a coastal cliff or seawall. As sea level rises inside the chamber, the water acts like a piston, forcing the trapped air column upward at high velocity. This compressed air streams through a narrow duct, spinning an air turbine connected to an electrical generator, thereby generating electric power.\n\nIn the second stage, as the ocean wave retreats and the water level falls, a vacuum is created within the chamber. Consequently, atmospheric air is drawn back downward from the top of the column to equalize pressure. Crucially, the specialized turbine blades continue rotating in the exact same direction under this reverse airflow, ensuring an uninterrupted supply of electricity to the local power grid.",
    vocabularies: [
      {
        id: "t1-top02-1",
        word: "containment chamber",
        ipa: "/kənˈteɪnmənt ˈtʃeɪmbər/",
        partOfSpeech: "noun",
        meaning: "Buồng kín chứa sóng và khí nén",
        basicEquivalent: "water box room (Band 5)",
        synonyms: ["air column chamber", "oscillating water chamber"],
        collocations: ["enter the containment chamber", "reinforced chamber"],
        modelSentence: "The wave surges into the reinforced containment chamber anchored to the sea wall.",
        vietnameseSentence: "Sóng biển dâng tràn vào buồng kín gia cố được cố định vào bờ kè chắn sóng."
      },
      {
        id: "t1-top02-2",
        word: "recede",
        ipa: "/rɪˈsiːd/",
        partOfSpeech: "verb",
        meaning: "Rút lui, hạ xuống, triều rút",
        basicEquivalent: "go back (Band 5)",
        synonyms: ["retreat", "subside", "withdraw"],
        collocations: ["waves recede", "receding water level"],
        modelSentence: "As the oceanic wave recedes, water retreats toward the open sea, reversing the airflow.",
        vietnameseSentence: "Khi sóng đại dương rút đi, nước rút ngược ra biển khơi, làm đảo chiều luồng không khí."
      },
      {
        id: "t1-top02-3",
        word: "uninterrupted",
        ipa: "/ˌʌnˌɪntəˈrʌptɪd/",
        partOfSpeech: "adjective",
        meaning: "Liên tục, không bị ngắt quãng",
        basicEquivalent: "continuous / nonstop (Band 5)",
        synonyms: ["continuous", "seamless", "perpetual"],
        collocations: ["uninterrupted power generation", "uninterrupted rotation"],
        modelSentence: "The innovative turbine configuration guarantees an uninterrupted supply of green energy.",
        vietnameseSentence: "Cấu hình tuabin đổi mới đảm bảo nguồn cung năng lượng xanh không bị gián đoạn."
      },
      {
        id: "t1-top02-4",
        word: "equalize pressure",
        ipa: "/ˈiːkwəlaɪz ˈpreʃər/",
        partOfSpeech: "verb",
        meaning: "Cân bằng áp suất",
        basicEquivalent: "make air pressure balance (Band 5)",
        synonyms: ["equilibrate air pressure", "balance pressure gradients"],
        collocations: ["drawn down to equalize pressure", "pressure equalization"],
        modelSentence: "Outside air rushes into the duct to equalize pressure within the subterranean void.",
        vietnameseSentence: "Không khí bên ngoài tràn vào đường ống để cân bằng áp suất bên trong khoảng trống dưới đất."
      },
      {
        id: "t1-top02-5",
        word: "bidirectional airflow",
        ipa: "/ˌbaɪdaɪˈrekʃənl ˈeəfləʊ/",
        partOfSpeech: "noun",
        meaning: "Luồng không khí hai chiều (vào và ra)",
        basicEquivalent: "two-way air movement (Band 5)",
        synonyms: ["two-way airflow", "reversing air currents"],
        collocations: ["harness bidirectional airflow", "drive by bidirectional airflow"],
        modelSentence: "The specialized Wells turbine harnesses bidirectional airflow without reversing its spin.",
        vietnameseSentence: "Tuabin Wells chuyên dụng tận dụng luồng không khí hai chiều mà không làm đảo chiều quay của nó."
      },
      {
        id: "t1-top02-6",
        word: "act like a piston",
        ipa: "/ækt laɪk ə ˈpɪstən/",
        partOfSpeech: "verb",
        meaning: "Hoạt động như một pít-tông nén khí",
        basicEquivalent: "push air like a pump (Band 5)",
        synonyms: ["function as a hydraulic ram", "compress air mechanically"],
        collocations: ["water column acts like a piston", "piston effect"],
        modelSentence: "Rising ocean water acts like a piston, driving air through the upper aperture at high speed.",
        vietnameseSentence: "Mực nước đại dương dâng lên hoạt động như một pít-tông, đẩy không khí qua khe hở phía trên với tốc độ cao."
      },
      {
        id: "t1-top02-7",
        word: "renewable harness",
        ipa: "/rɪˈnjuːəbl ˈhɑːnɪs/",
        partOfSpeech: "noun",
        meaning: "Sự khai thác năng lượng tái tạo",
        basicEquivalent: "getting clean power (Band 5)",
        synonyms: ["clean energy extraction", "marine power harvesting"],
        collocations: ["harness ocean power", "coastal kinetic energy"],
        modelSentence: "The facility illustrates efficient kinetic harnessing along turbulent coastal headlands.",
        vietnameseSentence: "Công trình minh họa cho việc khai thác động năng hiệu quả dọc theo các mũi đất ven biển nhiều sóng gió."
      },
      {
        id: "t1-top02-8",
        word: "narrow duct",
        ipa: "/ˈnærəʊ dʌkt/",
        partOfSpeech: "noun",
        meaning: "Đường ống dẫn khí hẹp tăng tốc áp suất",
        basicEquivalent: "small air pipe (Band 5)",
        synonyms: ["ventilation conduit", "constricted airway"],
        collocations: ["funneled through a narrow duct", "exhaust duct"],
        modelSentence: "Air is accelerated through a narrow duct to achieve optimal turbine rotational speed.",
        vietnameseSentence: "Không khí được tăng tốc qua một đường ống hẹp để đạt được vận tốc quay tối ưu của tuabin."
      }
    ]
  },
  {
    id: "task1-top-03-canterbury-map",
    name: "Maps: Town of Canterbury Proposed Sites for a New School",
    vietnameseName: "Bản đồ quy hoạch: Hai phương án vị trí xây trường học mới tại thị trấn Canterbury",
    tag: "Task 1: Bản đồ quy hoạch (Maps)",
    icon: "MapPin",
    chartType: "image",
    imageUrl: "/charts/task1/task1_top-03-canterbury-map.png",
    chartData: {
      title: "Maps: Town of Canterbury Proposed Sites for a New School",
      imageUrl: "/charts/task1/task1_top-03-canterbury-map.png",
      keyNotes: [
        "Vị trí S1 (Site 1): Nằm ở phía Đông Bắc thị trấn thuộc vùng đồng quê (countryside), giáp khu dân cư và tuyến đường chính đi thị trấn lân cận Sturry.",
        "Vị trí S2 (Site 2): Nằm ở phía Tây Nam gần lõi trung tâm thị trấn (town centre), bao quanh hoàn toàn bởi các khu nhà ở và tiếp giáp ga đường sắt Canterbury.",
        "Hạ tầng giao thông & Dân cư: S1 thuận lợi phục vụ học sinh từ các vùng nông thôn ngoại ô, trong khi S2 nằm giữa khu dân cư đông đúc nội thành nhưng có thể gây áp lực giao thông."
]
    },
    ieltsPrompt: "The map below is of the town of Canterbury. A new school (S) is planned for the area. The map shows two possible sites for the school. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    keyNotes: [
        "Vị trí S1 (Site 1): Nằm ở phía Đông Bắc thị trấn thuộc vùng đồng quê (countryside), giáp khu dân cư và tuyến đường chính đi thị trấn lân cận Sturry.",
        "Vị trí S2 (Site 2): Nằm ở phía Tây Nam gần lõi trung tâm thị trấn (town centre), bao quanh hoàn toàn bởi các khu nhà ở và tiếp giáp ga đường sắt Canterbury.",
        "Hạ tầng giao thông & Dân cư: S1 thuận lợi phục vụ học sinh từ các vùng nông thôn ngoại ô, trong khi S2 nằm giữa khu dân cư đông đúc nội thành nhưng có thể gây áp lực giao thông."
],
    modelEssay: "The map shows two proposed sites for a new school for the town of Canterbury and the surrounding area.\n\nOverall, the main difference between the two proposed locations is that Site 1 (S1) is located in a rural setting on the northeastern outskirts of the town, whereas Site 2 (S2) is positioned within an established urban residential neighborhood in the southwest.\n\nThe first site, S1, is situated in the countryside to the north-east of the town centre, immediately adjacent to a housing estate. It lies conveniently between the central town district and the outlying settlement of Sturry, which has a population of 7,000 residents. A major main road runs directly past S1, providing straightforward access for vehicles traveling from both Canterbury and Sturry. Additionally, the railway line passes nearby to the south, although there is no local railway station situated at this site.\n\nIn contrast, Site 2 (S2) is located in the southwestern portion of Canterbury, positioned much closer to the town centre. It is bordered almost entirely by residential housing, making it highly accessible on foot for local urban families. Transport links for S2 are equally strong: a main highway runs along its eastern edge, and it is located in close proximity to the central railway station, facilitating easy public transit connections.",
    vocabularies: [
      {
        id: "t1-top03-1",
        word: "northeastern outskirts",
        ipa: "/ˌnɔːθˈiːstən ˈaʊtskɜːts/",
        partOfSpeech: "noun",
        meaning: "Vùng ven ngoại ô phía đông bắc",
        basicEquivalent: "far corner of the town (Band 5)",
        synonyms: ["northeastern periphery", "outer fringes"],
        collocations: ["located on the northeastern outskirts", "rural outskirts"],
        modelSentence: "Site 1 occupies open countryside situated on the northeastern outskirts of the municipal boundary.",
        vietnameseSentence: "Khu đất 1 nằm trên vùng đồng quê thoáng đãng tại vùng ven ngoại ô phía đông bắc của ranh giới đô thị."
      },
      {
        id: "t1-top03-2",
        word: "residential neighborhood",
        ipa: "/ˌrezɪˈdenʃl ˈneɪbəhʊd/",
        partOfSpeech: "noun",
        meaning: "Khu phố dân cư sinh sống",
        basicEquivalent: "housing area (Band 5)",
        synonyms: ["housing district", "residential quarter"],
        collocations: ["established residential neighborhood", "densely populated neighborhood"],
        modelSentence: "Site 2 is embedded within an established residential neighborhood with thousands of family homes.",
        vietnameseSentence: "Khu đất 2 nằm trọn bên trong một khu phố dân cư lâu đời với hàng ngàn ngôi nhà của các gia đình."
      },
      {
        id: "t1-top03-3",
        word: "outlying settlement",
        ipa: "/ˈaʊtlaɪɪŋ ˈsetlmənt/",
        partOfSpeech: "noun",
        meaning: "Khu dân cư / thị trấn vệ tinh nằm xa bên ngoài",
        basicEquivalent: "village far away (Band 5)",
        synonyms: ["peripheral community", "neighboring satellite town"],
        collocations: ["serve outlying settlements", "commute from outlying settlements"],
        modelSentence: "Choosing S1 would conveniently cater to pupils commuting from the outlying settlement of Sturry.",
        vietnameseSentence: "Lựa chọn S1 sẽ phục vụ thuận tiện cho học sinh đi lại từ khu dân cư ngoại vi Sturry."
      },
      {
        id: "t1-top03-4",
        word: "close proximity",
        ipa: "/kləʊs prɒkˈsɪməti/",
        partOfSpeech: "noun",
        meaning: "Cự ly gần kề sát bên",
        basicEquivalent: "near to (Band 5)",
        synonyms: ["immediate vicinity", "close neighborhood"],
        collocations: ["in close proximity to the railway station", "located in close proximity"],
        modelSentence: "The southern location enjoys close proximity to both arterial bypasses and the rail terminus.",
        vietnameseSentence: "Vị trí phía nam có lợi thế nằm gần kề cả tuyến đường tránh huyết mạch và ga đầu mối đường sắt."
      },
      {
        id: "t1-top03-5",
        word: "public transit",
        ipa: "/ˈpʌblɪk ˈtrænzɪt/",
        partOfSpeech: "noun",
        meaning: "Hệ thống phương tiện giao thông công cộng",
        basicEquivalent: "bus and train (Band 5)",
        synonyms: ["mass transit", "public transportation"],
        collocations: ["public transit connectivity", "access to public transit"],
        modelSentence: "S2 offers seamless public transit access via the adjacent mainline railway interchange.",
        vietnameseSentence: "S2 mang lại khả năng kết nối giao thông công cộng liền mạch thông qua điểm giao cắt đường sắt chính bên cạnh."
      },
      {
        id: "t1-top03-6",
        word: "rural setting",
        ipa: "/ˈrʊərəl ˈsetɪŋ/",
        partOfSpeech: "noun",
        meaning: "Bối cảnh cảnh quan nông thôn, đồng quê",
        basicEquivalent: "country place (Band 5)",
        synonyms: ["countryside backdrop", "pastoral environment"],
        collocations: ["situated in a rural setting", "tranquil rural setting"],
        modelSentence: "A campus located in a rural setting affords ample playing fields and tranquil surroundings.",
        vietnameseSentence: "Một khuôn viên trường nằm trong bối cảnh nông thôn mang lại sân chơi rộng rãi và môi trường yên tĩnh."
      },
      {
        id: "t1-top03-7",
        word: "arterial bypass",
        ipa: "/ɑːˈtɪəriəl ˈbaɪpɑːs/",
        partOfSpeech: "noun",
        meaning: "Đường tránh huyết mạch bao quanh đô thị",
        basicEquivalent: "ring road (Band 5)",
        synonyms: ["ring road", "circumferential thoroughfare"],
        collocations: ["flanked by an arterial bypass", "direct bypass access"],
        modelSentence: "School buses could easily navigate the arterial bypass without entering clogged downtown streets.",
        vietnameseSentence: "Xe buýt trường học có thể dễ dàng lưu thông trên đường tránh huyết mạch mà không phải đi vào các phố trung tâm ùn tắc."
      },
      {
        id: "t1-top03-8",
        word: "accessible on foot",
        ipa: "/əkˈsesəbl ɒn fʊt/",
        partOfSpeech: "adjective",
        meaning: "Có thể tiếp cận dễ dàng bằng cách đi bộ",
        basicEquivalent: "easy to walk to (Band 5)",
        synonyms: ["pedestrian-friendly", "within walking distance"],
        collocations: ["highly accessible on foot", "accessible via footpaths"],
        modelSentence: "The compact layout makes the southern campus fully accessible on foot for hundreds of local children.",
        vietnameseSentence: "Cách bố trí quy hoạch gọn gàng giúp khuôn viên phía nam hoàn toàn có thể đi bộ tới đối với hàng trăm trẻ em địa phương."
      }
    ]
  },
  {
    id: "task1-top-04-further-education",
    name: "Bar Chart: British Further Education Enrolment by Gender (1970-1990)",
    vietnameseName: "Biểu đồ cột: Tỷ lệ nam và nữ theo học giáo dục thường xuyên tại Anh (1970-1990)",
    tag: "Task 1: Biểu đồ cột (Bar Chart)",
    icon: "BarChart3",
    chartType: "image",
    imageUrl: "/charts/task1/task1_top-04-further-education.png",
    chartData: {
      title: "Bar Chart: British Further Education Enrolment by Gender (1970-1990)",
      imageUrl: "/charts/task1/task1_top-04-further-education.png",
      keyNotes: [
        "Học bán thời gian áp đảo: Hình thức học bán thời gian (part-time) luôn chiếm ưu thế tuyệt đối so với học toàn thời gian (full-time) ở cả nam và nữ qua cả 3 thời kỳ.",
        "Tăng trưởng vượt bậc của nữ giới: Số lượng phụ nữ học part-time tăng mạnh mẽ từ hơn 700.000 lên hơn 1.1 triệu học viên, vượt qua số lượng nam giới (khoảng 900.000) vào năm 1990/91.",
        "Xu hướng học toàn thời gian: Cả nam và nữ học full-time đều tăng dần nhưng luôn giữ ở mức khiêm tốn, chỉ dao động từ 100.000 đến gần 300.000 người."
]
    },
    ieltsPrompt: "The chart below shows the number of men and women in further education in Britain in three periods and whether they were studying full-time or part-time. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    keyNotes: [
        "Học bán thời gian áp đảo: Hình thức học bán thời gian (part-time) luôn chiếm ưu thế tuyệt đối so với học toàn thời gian (full-time) ở cả nam và nữ qua cả 3 thời kỳ.",
        "Tăng trưởng vượt bậc của nữ giới: Số lượng phụ nữ học part-time tăng mạnh mẽ từ hơn 700.000 lên hơn 1.1 triệu học viên, vượt qua số lượng nam giới (khoảng 900.000) vào năm 1990/91.",
        "Xu hướng học toàn thời gian: Cả nam và nữ học full-time đều tăng dần nhưng luôn giữ ở mức khiêm tốn, chỉ dao động từ 100.000 đến gần 300.000 người."
],
    modelEssay: "The bar charts illustrate the numbers of male and female students enrolled in further education in the United Kingdom across three academic periods (1970/71, 1980/81, and 1990/91), categorised by full-time and part-time study modes.\n\nOverall, part-time education was consistently far more popular than full-time education for both genders throughout the period. Furthermore, while the number of men studying part-time fluctuated, female part-time participation experienced sustained growth, ultimately surpassing male enrolment by 1990/91.\n\nIn terms of part-time education, approximately 1,000,000 men were enrolled in 1970/71, compared to roughly 750,000 women. Over the subsequent two decades, male part-time numbers dipped to around 850,000 in 1980/81 before rebounding to just under 900,000. In stark contrast, female enrolment expanded dramatically, reaching roughly 900,000 in 1980/81 and peaking at over 1,100,000 in 1990/91, making women the majority in part-time studies.\n\nRegarding full-time education, student participation was significantly lower, with totals never exceeding 300,000 for either gender. Both male and female full-time enrolments followed steady upward trajectories, rising from roughly 100,000 in 1970/71 to approximately 220,000 for men and 280,000 for women by the end of the timeframe.",
    vocabularies: [
      {
        id: "t1-top04-1",
        word: "further education",
        ipa: "/ˈfɜːðər ˌedʒuˈkeɪʃn/",
        partOfSpeech: "noun",
        meaning: "Giáo dục thường xuyên, học sau phổ thông",
        basicEquivalent: "college study after school (Band 5)",
        synonyms: ["vocational education", "post-secondary training"],
        collocations: ["enrolled in further education", "further education college"],
        modelSentence: "The expansion of further education provided working adults with critical upskilling opportunities.",
        vietnameseSentence: "Sự mở rộng của giáo dục thường xuyên đã mang lại cho người lớn đi làm những cơ hội nâng cao kỹ năng quan trọng."
      },
      {
        id: "t1-top04-2",
        word: "part-time enrolment",
        ipa: "/ˌpɑːt ˈtaɪm ɪnˈrəʊlmənt/",
        partOfSpeech: "noun",
        meaning: "Số lượng đăng ký học bán thời gian",
        basicEquivalent: "part-time students (Band 5)",
        synonyms: ["part-time registration", "flexible attendance"],
        collocations: ["surge in part-time enrolment", "part-time enrolment figures"],
        modelSentence: "Female part-time enrolment climbed past the one-million milestone in the final decade.",
        vietnameseSentence: "Lượng nữ sinh viên đăng ký học bán thời gian đã vượt qua cột mốc một triệu học viên trong thập kỷ cuối."
      },
      {
        id: "t1-top04-3",
        word: "upward trajectory",
        ipa: "/ˈʌpwəd trəˈdʒektəri/",
        partOfSpeech: "noun",
        meaning: "Quỹ đạo tăng trưởng đi lên đều đặn",
        basicEquivalent: "rise / going up (Band 5)",
        synonyms: ["upward trend", "ascending course"],
        collocations: ["follow an upward trajectory", "steady upward trajectory"],
        modelSentence: "Full-time student numbers maintained a steady upward trajectory across the entire timeframe.",
        vietnameseSentence: "Số lượng sinh viên học toàn thời gian đã duy trì quỹ đạo đi lên vững chắc trong toàn bộ khung thời gian."
      },
      {
        id: "t1-top04-4",
        word: "stark contrast",
        ipa: "/stɑːk ˈkɒntrɑːst/",
        partOfSpeech: "noun",
        meaning: "Sự tương phản, đối nghịch hoàn toàn rõ nét",
        basicEquivalent: "big difference (Band 5)",
        synonyms: ["sharp divergence", "striking disparity"],
        collocations: ["stand in stark contrast to", "a stark contrast emerges"],
        modelSentence: "The massive volume of part-time learners stood in stark contrast to modest full-time cohorts.",
        vietnameseSentence: "Khối lượng khổng lồ học viên bán thời gian hoàn toàn tương phản với các nhóm học toàn thời gian khiêm tốn."
      },
      {
        id: "t1-top04-5",
        word: "rebound",
        ipa: "/rɪˈbaʊnd/",
        partOfSpeech: "verb",
        meaning: "Phục hồi trở lại sau khi suy giảm",
        basicEquivalent: "go up again (Band 5)",
        synonyms: ["recover", "rally", "bounce back"],
        collocations: ["rebound to just under", "rebound after a dip"],
        modelSentence: "Male registrations dropped in 1980 before rebounding slightly in the subsequent census.",
        vietnameseSentence: "Số lượng nam giới đăng ký giảm năm 1980 trước khi phục hồi nhẹ trong kỳ thống kê tiếp theo."
      },
      {
        id: "t1-top04-6",
        word: "surpass",
        ipa: "/səˈpɑːs/",
        partOfSpeech: "verb",
        meaning: "Vượt qua, soán ngôi dẫn đầu",
        basicEquivalent: "be more than (Band 5)",
        synonyms: ["overtake", "outstrip", "exceed"],
        collocations: ["surpass male figures", "surpass expectations"],
        modelSentence: "Women ultimately surpassed their male peers in further education participation by 1990.",
        vietnameseSentence: "Phụ nữ cuối cùng đã vượt qua các đồng nghiệp nam về mức độ tham gia giáo dục thường xuyên vào năm 1990."
      },
      {
        id: "t1-top04-7",
        word: "flexible study mode",
        ipa: "/ˈfleksəbl ˈstʌdi məʊd/",
        partOfSpeech: "noun",
        meaning: "Phương thức học tập linh hoạt (học tối, học buổi)",
        basicEquivalent: "easy time study (Band 5)",
        synonyms: ["modular study format", "part-time schedule"],
        collocations: ["adopt flexible study modes", "preference for flexible study modes"],
        modelSentence: "Working mothers heavily favored flexible study modes to reconcile career and household duties.",
        vietnameseSentence: "Các bà mẹ đi làm rất ưa chuộng các phương thức học tập linh hoạt để cân bằng sự nghiệp và công việc gia đình."
      },
      {
        id: "t1-top04-8",
        word: "academic cohort",
        ipa: "/ˌækəˈdemɪk ˈkəʊhɔːt/",
        partOfSpeech: "noun",
        meaning: "Nhóm khóa học sinh sinh viên cùng niên khóa",
        basicEquivalent: "student group (Band 5)",
        synonyms: ["student body", "enrolment group"],
        collocations: ["full-time academic cohort", "expand the cohort"],
        modelSentence: "Each successive academic cohort contained a progressively higher proportion of mature female entrants.",
        vietnameseSentence: "Mỗi nhóm học sinh qua các niên khóa kế tiếp đều chứa tỷ lệ ngày càng cao những phụ nữ trưởng thành theo học."
      }
    ]
  },
  {
    id: "task1-top-05-radio-tv-audiences",
    name: "Line Graph: UK Radio and TV Audience Patterns throughout the Day (1992)",
    vietnameseName: "Biểu đồ đường: Xu hướng khán thính giả nghe Radio và xem TV trong ngày tại Anh (1992)",
    tag: "Task 1: Biểu đồ đường (Line Graph)",
    icon: "TrendingUp",
    chartType: "image",
    imageUrl: "/charts/task1/task1_top-05-radio-tv-audiences.png",
    chartData: {
      title: "Line Graph: UK Radio and TV Audience Patterns throughout the Day (1992)",
      imageUrl: "/charts/task1/task1_top-05-radio-tv-audiences.png",
      keyNotes: [
        "Quy luật ngày và đêm: Radio thống trị buổi sáng từ 6:00 đến 13:00 (đỉnh điểm gần 30% lúc 8:30 sáng). Ngược lại, TV bùng nổ mạnh mẽ vào buổi tối từ 18:00 đến 23:00 (đỉnh điểm tới 45% lúc 20:00 - 22:00).",
        "Điểm giao nhau (Crossover Points): Khoảng 13:00 trưa và 16:00 chiều, tỷ lệ khán thính giả của hai phương tiện gần như ngang bằng nhau ở mức 15%.",
        "Đêm muộn và rạng sáng: Cả radio và TV đều chạm đáy dưới 5% từ 2:00 sáng đến 6:00 sáng khi người dân nghỉ ngơi."
]
    },
    ieltsPrompt: "The graph below shows radio and television audiences throughout the day in 1992. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    keyNotes: [
        "Quy luật ngày và đêm: Radio thống trị buổi sáng từ 6:00 đến 13:00 (đỉnh điểm gần 30% lúc 8:30 sáng). Ngược lại, TV bùng nổ mạnh mẽ vào buổi tối từ 18:00 đến 23:00 (đỉnh điểm tới 45% lúc 20:00 - 22:00).",
        "Điểm giao nhau (Crossover Points): Khoảng 13:00 trưa và 16:00 chiều, tỷ lệ khán thính giả của hai phương tiện gần như ngang bằng nhau ở mức 15%.",
        "Đêm muộn và rạng sáng: Cả radio và TV đều chạm đáy dưới 5% từ 2:00 sáng đến 6:00 sáng khi người dân nghỉ ngơi."
],
    modelEssay: "The line graph compares audience shares for radio and television over a 24-hour cycle in the United Kingdom between October and December 1992.\n\nOverall, radio and television viewership followed sharply contrasting chronological trends. Radio captured the vast majority of media consumers during morning hours, whereas television commanded a massive surge in the evening, achieving the highest audience percentage across the entire day.\n\nBeginning in the early morning, radio listening rose precipitously from under 5% at 6:00 AM to reach its daily zenith of approximately 27% at around 8:30 AM, coinciding with breakfast and the morning commute. After this morning peak, radio audiences experienced a steady downward slide, dropping to roughly 15% by 1:00 PM and hovering below 10% for the remainder of the evening.\n\nIn stark contrast, television audiences remained negligible throughout the morning, lingering beneath 5% until midday. However, television viewership began accelerating after 1:00 PM, surpassing radio at around 4:00 PM (15%). Viewership climbed steeply throughout prime-time evening hours, culminating in an impressive summit of 45% between 8:00 PM and 10:00 PM. Following 11:00 PM, both media channels suffered steep contractions, tapering off to under 3% by 3:00 AM.",
    vocabularies: [
      {
        id: "t1-top05-1",
        word: "audience share",
        ipa: "/ˈɔːdiəns ʃeər/",
        partOfSpeech: "noun",
        meaning: "Thị phần / tỷ lệ khán thính giả theo dõi",
        basicEquivalent: "number of watchers (Band 5)",
        synonyms: ["viewership proportion", "listenership percentage"],
        collocations: ["command a high audience share", "peak audience share"],
        modelSentence: "Television commanded an extraordinary 45% audience share during evening prime time.",
        vietnameseSentence: "Truyền hình đã nắm giữ thị phần khán giả phi thường 45% trong khung giờ vàng buổi tối."
      },
      {
        id: "t1-top05-2",
        word: "zenith",
        ipa: "/ˈzenɪθ/",
        partOfSpeech: "noun",
        meaning: "Điểm cao nhất, đỉnh cao tuyệt đối",
        basicEquivalent: "highest point (Band 5)",
        synonyms: ["peak", "apex", "culmination", "summit"],
        collocations: ["reach its daily zenith", "at its zenith"],
        modelSentence: "Radio listenership attained its daily zenith of 27% during the morning rush hour.",
        vietnameseSentence: "Lượng thính giả nghe radio đã đạt điểm cao nhất trong ngày là 27% vào khung giờ cao điểm buổi sáng."
      },
      {
        id: "t1-top05-3",
        word: "precipitously",
        ipa: "/prɪˈsɪpɪtəsli/",
        partOfSpeech: "adverb",
        meaning: "Một cách nhanh chóng và dốc đứng",
        basicEquivalent: "very fast up (Band 5)",
        synonyms: ["steeply", "sharply", "rapidly"],
        collocations: ["climb precipitously", "drop precipitously"],
        modelSentence: "Morning radio ratings climbed precipitously between dawn and eight-thirty in the morning.",
        vietnameseSentence: "Xếp hạng radio buổi sáng đã leo dốc nhanh chóng từ rạng đông cho đến 8 giờ 30 sáng."
      },
      {
        id: "t1-top05-4",
        word: "prime time",
        ipa: "/ˈpraɪm taɪm/",
        partOfSpeech: "noun",
        meaning: "Khung giờ vàng phát sóng (thu hút nhiều người xem nhất)",
        basicEquivalent: "popular evening hours (Band 5)",
        synonyms: ["peak viewing hours", "prime viewing slot"],
        collocations: ["evening prime time", "prime-time broadcasting"],
        modelSentence: "Families congregated around the television screen during traditional prime-time hours.",
        vietnameseSentence: "Các gia đình tụ họp quây quần bên màn hình tivi trong các khung giờ vàng truyền thống."
      },
      {
        id: "t1-top05-5",
        word: "taper off",
        ipa: "/ˈteɪpər ɒf/",
        partOfSpeech: "verb",
        meaning: "Giảm dần đều và nhỏ lại về cuối",
        basicEquivalent: "decrease slowly (Band 5)",
        synonyms: ["dwindle", "peter out", "subside gradually"],
        collocations: ["taper off to under 3%", "taper off past midnight"],
        modelSentence: "Broadcast viewership tapered off sharply once midnight programming drew to a close.",
        vietnameseSentence: "Lượng khán giả xem đài giảm dần đều rõ rệt một khi các chương trình nửa đêm kết thúc."
      },
      {
        id: "t1-top05-6",
        word: "chronological trend",
        ipa: "/ˌkrɒnəˈlɒdʒɪkl trend/",
        partOfSpeech: "noun",
        meaning: "Xu hướng biến thiên theo trình tự thời gian trong ngày",
        basicEquivalent: "change by time (Band 5)",
        synonyms: ["temporal pattern", "diurnal distribution"],
        collocations: ["follow chronological trends", "contrasting chronological trends"],
        modelSentence: "The two media forms displayed sharply conflicting chronological trends across the 24-hour cycle.",
        vietnameseSentence: "Hai loại hình truyền thông thể hiện những xu hướng theo trình tự thời gian xung đột rõ rệt trong chu kỳ 24 giờ."
      },
      {
        id: "t1-top05-7",
        word: "negligible",
        ipa: "/ˈneɡlɪdʒəbl/",
        partOfSpeech: "adjective",
        meaning: "Không đáng kể, cực kỳ nhỏ bé",
        basicEquivalent: "very small (Band 5)",
        synonyms: ["minimal", "insignificant", "marginal"],
        collocations: ["remain negligible", "negligible audience share"],
        modelSentence: "Television ratings remained practically negligible during early working hours.",
        vietnameseSentence: "Tỷ suất người xem truyền hình hầu như không đáng kể trong những giờ làm việc đầu buổi sáng."
      },
      {
        id: "t1-top05-8",
        word: "crossover point",
        ipa: "/ˈkrɒsəʊvər pɔɪnt/",
        partOfSpeech: "noun",
        meaning: "Điểm giao cắt giữa hai đường số liệu",
        basicEquivalent: "meeting point of lines (Band 5)",
        synonyms: ["intersection threshold", "junction point"],
        collocations: ["reach a crossover point", "crossover point at 4 PM"],
        modelSentence: "Around 4:00 PM, a critical crossover point occurred where television surpassed radio for good.",
        vietnameseSentence: "Vào khoảng 4 giờ chiều, một điểm giao cắt then chốt đã xuất hiện nơi truyền hình chính thức vượt qua radio."
      }
    ]
  },
  {
    id: "task1-top-06-worldwide-water-use",
    name: "Mixed: Worldwide Water Use by Sector and Country Disparity",
    vietnameseName: "Biểu đồ kết hợp: Nhu cầu sử dụng nước toàn cầu theo ngành và so sánh giữa các quốc gia",
    tag: "Task 1: Biểu đồ kết hợp (Line Graph & Table)",
    icon: "BarChart3",
    chartType: "image",
    imageUrl: "/charts/task1/task1_top-06-worldwide-water-use.png",
    chartData: {
      title: "Mixed: Worldwide Water Use by Sector and Country Disparity",
      imageUrl: "/charts/task1/task1_top-06-worldwide-water-use.png",
      keyNotes: [
        "Xu hướng toàn cầu theo ngành: Lượng nước sử dụng toàn cầu tăng vọt từ năm 1900 đến 2000. Nông nghiệp (Agriculture) luôn ngốn lượng nước áp đảo (vượt 3.000 km³ vào năm 2000), gấp gần ba lần công nghiệp và sinh hoạt cộng lại.",
        "Nước dùng cho công nghiệp và sinh hoạt: Bắt đầu tăng tốc sau năm 1950; công nghiệp đạt khoảng 1.000 km³, trong khi sinh hoạt gia đình thấp nhất (dưới 400 km³).",
        "So sánh hai quốc gia: Brazil (176 triệu dân, 26.500 km² đất tưới tiêu) tiêu thụ 359 m³ nước/người/năm, cao gấp gần 45 lần mức tiêu thụ của CHDC Congo (8 m³/người/năm) do sự chênh lệch hạ tầng tưới tiêu nông nghiệp."
]
    },
    ieltsPrompt: "The graph and table below give information about water use worldwide and water consumption in two different countries. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    keyNotes: [
        "Xu hướng toàn cầu theo ngành: Lượng nước sử dụng toàn cầu tăng vọt từ năm 1900 đến 2000. Nông nghiệp (Agriculture) luôn ngốn lượng nước áp đảo (vượt 3.000 km³ vào năm 2000), gấp gần ba lần công nghiệp và sinh hoạt cộng lại.",
        "Nước dùng cho công nghiệp và sinh hoạt: Bắt đầu tăng tốc sau năm 1950; công nghiệp đạt khoảng 1.000 km³, trong khi sinh hoạt gia đình thấp nhất (dưới 400 km³).",
        "So sánh hai quốc gia: Brazil (176 triệu dân, 26.500 km² đất tưới tiêu) tiêu thụ 359 m³ nước/người/năm, cao gấp gần 45 lần mức tiêu thụ của CHDC Congo (8 m³/người/năm) do sự chênh lệch hạ tầng tưới tiêu nông nghiệp."
],
    modelEssay: "The charts provide a comprehensive analysis of global freshwater extraction across three sectors from 1900 to 2000, along with a comparative breakdown of water consumption between Brazil and the Democratic Republic of Congo in the year 2000.\n\nOverall, global water consumption escalated dramatically over the twentieth century, with agriculture consistently demanding the overwhelming majority of water supplies. Furthermore, the table reveals a massive disparity in per capita water usage, with Brazil consuming vastly more water than Congo due to its extensive irrigated agricultural base.\n\nLooking at the line graph, total water consumption expanded more than threefold between 1900 and 2000. The agricultural sector was the primary driver of this growth, climbing steadily from approximately 500 km³ in 1900 to surpass 3,000 km³ by 2000. Industrial water use emerged as the second largest category after 1950, escalating to nearly 1,000 km³. In contrast, domestic consumption remained the lowest sector throughout, only rising modestly after 1950 to reach around 350 km³.\n\nThe accompanying table highlights sharp contrasts between Brazil and the Democratic Republic of Congo. Despite both nations having significant freshwater reserves, Brazil's population of 176 million utilised 26,500 km² of irrigated farmland, generating an annual consumption rate of 359 m³ per person. Conversely, Congo, with 5.2 million inhabitants and a minuscule 100 km² of irrigated agricultural land, registered an annual consumption of merely 8 m³ per person.",
    vocabularies: [
      {
        id: "t1-top06-1",
        word: "freshwater extraction",
        ipa: "/ˈfreʃwɔːtər ɪkˈstrækʃn/",
        partOfSpeech: "noun",
        meaning: "Việc khai thác và sử dụng nguồn nước ngọt",
        basicEquivalent: "taking water from rivers (Band 5)",
        synonyms: ["water withdrawal", "hydrological abstraction"],
        collocations: ["rates of freshwater extraction", "sustainable freshwater extraction"],
        modelSentence: "Global freshwater extraction accelerated exponentially following the mid-century agricultural boom.",
        vietnameseSentence: "Việc khai thác nước ngọt toàn cầu đã tăng tốc theo cấp số nhân sau sự bùng nổ nông nghiệp giữa thế kỷ."
      },
      {
        id: "t1-top06-2",
        word: "irrigated farmland",
        ipa: "/ˈɪrɪɡeɪtɪd ˈfɑːmlænd/",
        partOfSpeech: "noun",
        meaning: "Đất canh tác nông nghiệp có hệ thống tưới tiêu nhân tạo",
        basicEquivalent: "watered farm area (Band 5)",
        synonyms: ["irrigated agriculture", "water-fed cropland"],
        collocations: ["hectares of irrigated farmland", "expand irrigated farmland"],
        modelSentence: "Brazil maintains vast tracts of irrigated farmland to sustain industrial crop exports.",
        vietnameseSentence: "Brazil duy trì những dải đất canh tác có tưới tiêu rộng lớn để phục vụ xuất khẩu cây trồng công nghiệp."
      },
      {
        id: "t1-top06-3",
        word: "per capita consumption",
        ipa: "/pə ˈkæpɪtə kənˈsʌmpʃn/",
        partOfSpeech: "noun",
        meaning: "Mức tiêu thụ bình quân tính trên đầu người",
        basicEquivalent: "use per person (Band 5)",
        synonyms: ["per person usage", "individual consumption rate"],
        collocations: ["annual per capita consumption", "disparity in per capita consumption"],
        modelSentence: "The annual per capita consumption in Brazil eclipsed that of Congo by more than forty-fold.",
        vietnameseSentence: "Mức tiêu thụ bình quân đầu người hàng năm ở Brazil đã vượt xa Congo hơn bốn mươi lần."
      },
      {
        id: "t1-top06-4",
        word: "domestic water use",
        ipa: "/dəˈmestɪk ˈwɔːtər juːs/",
        partOfSpeech: "noun",
        meaning: "Nhu cầu dùng nước trong sinh hoạt gia đình",
        basicEquivalent: "household water (Band 5)",
        synonyms: ["residential consumption", "household water demand"],
        collocations: ["allocated to domestic water use", "curb domestic water use"],
        modelSentence: "Domestic water use accounted for the smallest slice of total global abstractions.",
        vietnameseSentence: "Nước dùng cho sinh hoạt gia đình chiếm tỷ trọng nhỏ nhất trong tổng lượng nước khai thác toàn cầu."
      },
      {
        id: "t1-top06-5",
        word: "exponential increase",
        ipa: "/ˌekspəˈnenʃl ˈɪŋkriːs/",
        partOfSpeech: "noun",
        meaning: "Sự gia tăng theo cấp số nhân phi mã",
        basicEquivalent: "very big fast increase (Band 5)",
        synonyms: ["skyrocketing surge", "dramatic escalation"],
        collocations: ["witness an exponential increase", "experience exponential growth"],
        modelSentence: "Irrigation experienced an exponential increase as populations grew and food demands escalated.",
        vietnameseSentence: "Hoạt động tưới tiêu chứng kiến sự gia tăng phi mã khi dân số tăng nhanh và nhu cầu lương thực leo thang."
      },
      {
        id: "t1-top06-6",
        word: "minuscule",
        ipa: "/ˈmɪnəskjuːl/",
        partOfSpeech: "adjective",
        meaning: "Vô cùng nhỏ bé, không đáng kể",
        basicEquivalent: "tiny / very small (Band 5)",
        synonyms: ["negligible", "infinitesimal", "minute"],
        collocations: ["minuscule portion", "minuscule land area"],
        modelSentence: "Congo possesses only a minuscule area of developed irrigation infrastructure.",
        vietnameseSentence: "Congo chỉ sở hữu một diện tích hạ tầng tưới tiêu phát triển vô cùng nhỏ bé."
      },
      {
        id: "t1-top06-7",
        word: "overwhelming majority",
        ipa: "/ˌəʊvəˈwelmɪŋ məˈdʒɒrəti/",
        partOfSpeech: "noun",
        meaning: "Đại đa số áp đảo hoàn toàn",
        basicEquivalent: "most of all (Band 5)",
        synonyms: ["lion's share", "vast preponderance"],
        collocations: ["command the overwhelming majority", "absorb the overwhelming majority"],
        modelSentence: "Farming practices absorbed the overwhelming majority of diverted fresh water worldwide.",
        vietnameseSentence: "Các hoạt động canh tác nông nghiệp đã hấp thụ đại đa số áp đảo lượng nước ngọt được chuyển hướng trên toàn cầu."
      },
      {
        id: "t1-top06-8",
        word: "hydrological reserves",
        ipa: "/ˌhaɪdrəˈlɒdʒɪkl rɪˈzɜːvz/",
        partOfSpeech: "noun",
        meaning: "Trữ lượng thủy văn, nguồn tài nguyên nước",
        basicEquivalent: "water supplies (Band 5)",
        synonyms: ["aquatic resources", "freshwater reserves"],
        collocations: ["abundant hydrological reserves", "protect hydrological reserves"],
        modelSentence: "Despite abundant natural hydrological reserves, lack of reticulation keeps usage low.",
        vietnameseSentence: "Dù có nguồn trữ lượng thủy văn tự nhiên dồi dào, sự thiếu thốn mạng lưới đường ống khiến mức sử dụng rất thấp."
      }
    ]
  }
,
  {
    id: "task1-roche-01-kpb-shares",
    name: "Line Graph: Stock Price Fluctuations of KPB (2006 - 2010)",
    vietnameseName: "Biểu đồ đường: Biến động giá cổ phiếu công ty KPB qua 5 năm (2006 - 2010)",
    tag: "Task 1: Biểu đồ đường (Line Graph)",
    icon: "TrendingDown",
    chartType: "image",
    imageUrl: "/charts/task1/task1_roche-01-kpb-shares.png",
    chartData: {
      title: "Line Graph: Stock Price Fluctuations of KPB (2006 - 2010)",
      imageUrl: "/charts/task1/task1_roche-01-kpb-shares.png",
      keyNotes: [
        "Biến động mạnh mẽ trong 5 năm: Giá cổ phiếu KPB trải qua nhiều chu kỳ tăng giảm liên tục từ 2006 đến 2010, nhưng xu hướng chung ghi nhận mức sụt giảm nhẹ khoảng 1 USD/cổ phiếu sau 5 năm.",
        "Đỉnh cao nhất cuối năm 2006: Khởi điểm ở mức 13 USD/cổ phiếu, giá tăng vọt đột ngột từ 21 USD lên đỉnh kỷ lục 31 USD/cổ phiếu vào cuối 2006.",
        "Đáy sâu năm 2008 & Hồi phục: Lao dốc mạnh từ giữa năm 2008 xuống đáy thấp nhất kỳ ở mức chỉ hơn 7 USD, trước khi hồi phục lên đỉnh thứ hai 17 USD vào đầu 2010 rồi thoái lui về 12 USD vào cuối 2010."
      ]
    },
    ieltsPrompt: "The graph shows the changes and the overall decline in the share price of KPB over a five-year period from 2006 to 2010. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    keyNotes: [
      "Biến động mạnh mẽ trong 5 năm: Giá cổ phiếu KPB trải qua nhiều chu kỳ tăng giảm liên tục từ 2006 đến 2010, nhưng xu hướng chung ghi nhận mức sụt giảm nhẹ khoảng 1 USD/cổ phiếu sau 5 năm.",
      "Đỉnh cao nhất cuối năm 2006: Khởi điểm ở mức 13 USD/cổ phiếu, giá tăng vọt đột ngột từ 21 USD lên đỉnh kỷ lục 31 USD/cổ phiếu vào cuối 2006.",
      "Đáy sâu năm 2008 & Hồi phục: Lao dốc mạnh từ giữa năm 2008 xuống đáy thấp nhất kỳ ở mức chỉ hơn 7 USD, trước khi hồi phục lên đỉnh thứ hai 17 USD vào đầu 2010 rồi thoái lui về 12 USD vào cuối 2010."
    ],
    modelEssay: "The graph shows the changes and the overall decline in the share price of KPB over a five-year period from 2006 to 2010.\n\nAt the beginning of the period the share price was at USD 13 per share. There were several fluctuations until late 2006 when there was a sudden increase from USD 21 to USD 31 per share. This higher price did not last long, however, and it fell before rising strongly again in 2008. From mid-2008 there was a sharp downward trend until the end of the year when it fell to the lowest point in this period at just over USD 7 per share. After that the share price recovered and, despite some fluctuations, continued to rise until it reached a peak of USD 17 in early 2010. Until late 2010 the trend was downward again, ending the year at just over USD 12.\n\nOverall, KPB made significant gains and losses during this period but registered a slight net decrease of around USD 1 per share over the five years.",
    vocabularies: [
      {
        id: "t1-r01-1",
        word: "share price fluctuations",
        ipa: "/ʃeə praɪs ˌflʌktʃuˈeɪʃnz/",
        partOfSpeech: "noun",
        meaning: "Sự biến động lên xuống của giá cổ phiếu",
        basicEquivalent: "stock price going up and down (Band 5)",
        synonyms: ["equity volatility", "stock market swings"],
        collocations: ["witness share price fluctuations", "undergo sharp fluctuations"],
        modelSentence: "The five-year survey revealed dramatic share price fluctuations driven by global financial volatility.",
        vietnameseSentence: "Cuộc khảo sát năm năm đã tiết lộ sự biến động giá cổ phiếu kịch tính do bất ổn tài chính toàn cầu."
      },
      {
        id: "t1-r01-2",
        word: "cyclical peak",
        ipa: "/ˈsɪklɪkl piːk/",
        partOfSpeech: "noun",
        meaning: "Đỉnh điểm cao nhất trong chu kỳ biến động",
        basicEquivalent: "highest point (Band 5)",
        synonyms: ["all-time high", "zenith of the cycle"],
        collocations: ["attain a cyclical peak", "touch a peak of"],
        modelSentence: "KPB stock attained a cyclical peak of 31 USD per share in late 2006 before undergoing a steep correction.",
        vietnameseSentence: "Cổ phiếu KPB đã đạt đỉnh chu kỳ ở mức 31 USD/cổ phiếu vào cuối năm 2006 trước khi trải qua đợt điều chỉnh sâu."
      },
      {
        id: "t1-r01-3",
        word: "cyclical nadir",
        ipa: "/ˈsɪklɪkl ˈneɪdɪə/",
        partOfSpeech: "noun",
        meaning: "Đáy sâu nhất, điểm thấp nhất trong chu kỳ",
        basicEquivalent: "lowest bottom point (Band 5)",
        synonyms: ["trough", "lowest ebb"],
        collocations: ["touch a cyclical nadir", "plunge to its nadir"],
        modelSentence: "The share price touched its cyclical nadir at slightly above seven dollars during the winter of 2008.",
        vietnameseSentence: "Giá cổ phiếu đã chạm đáy sâu nhất của chu kỳ ở mức chỉ hơn bảy đô la trong mùa đông năm 2008."
      },
      {
        id: "t1-r01-4",
        word: "downward slide",
        ipa: "/ˈdaʊnwəd slaɪd/",
        partOfSpeech: "noun",
        meaning: "Đà trượt dốc đều đặn qua các mốc thời gian",
        basicEquivalent: "falling down (Band 5)",
        synonyms: ["uninterrupted decline", "progressive contraction"],
        collocations: ["a steady downward slide", "halt the downward slide"],
        modelSentence: "From mid-2008, KPB equity recorded a sharp downward slide, touching its cyclical nadir at seven dollars.",
        vietnameseSentence: "Từ giữa năm 2008, cổ phiếu KPB ghi nhận một đà trượt dốc mạnh, chạm đáy chu kỳ ở mức bảy đô la."
      },
      {
        id: "t1-r01-5",
        word: "net decrease",
        ipa: "/net dɪˈkriːs/",
        partOfSpeech: "noun",
        meaning: "Mức giảm ròng tổng thể sau khi đã bù trừ tăng giảm",
        basicEquivalent: "overall smaller number (Band 5)",
        synonyms: ["overall contraction", "net loss"],
        collocations: ["register a net decrease", "suffer a net decrease of"],
        modelSentence: "Despite energetic intermittent rallies, the equity suffered a net decrease of approximately one dollar per share.",
        vietnameseSentence: "Dù có những đợt tăng điểm gián đoạn sôi nổi, cổ phiếu vẫn ghi nhận mức giảm ròng khoảng một đô la mỗi cổ phiếu."
      }
    ]
  },
  {
    id: "task1-roche-02-gulf-fertility",
    name: "Bar Chart: Fertility Rates per Woman in Six Gulf States (1990 vs 2000)",
    vietnameseName: "Biểu đồ cột: Tỷ lệ sinh con ở phụ nữ tại 6 quốc gia Vùng Vịnh (1990 vs 2000)",
    tag: "Task 1: Biểu đồ cột (Bar Chart)",
    icon: "BarChart2",
    chartType: "image",
    imageUrl: "/charts/task1/task1_roche-02-gulf-fertility.png",
    chartData: {
      title: "Bar Chart: Fertility Rates per Woman in Six Gulf States (1990 vs 2000)",
      imageUrl: "/charts/task1/task1_roche-02-gulf-fertility.png",
      keyNotes: [
        "Xu hướng suy giảm đồng loạt: Tỷ lệ sinh ở cả 6 quốc gia Vùng Vịnh (Saudi Arabia, Oman, UAE, Qatar, Kuwait, Bahrain) đều sụt giảm đáng kể trong thập kỷ 1990-2000.",
        "Nhóm sinh nở cao nhất: Oman và Saudi Arabia ghi nhận mức sinh cao ngất ngưởng trên 7 con/phụ nữ năm 1990, sau đó giảm 20% xuống còn 5.5 con năm 2000.",
        "Nhóm sinh nở thấp hơn: UAE, Bahrain và Kuwait giảm từ mức 3.75 - 4 con xuống dưới 3 con/phụ nữ vào năm 2000 (UAE giảm mạnh nhất trên 25%)."
      ]
    },
    ieltsPrompt: "The chart provides information regarding the fertility in births per woman in six Gulf states from 1990 to 2000. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    keyNotes: [
      "Xu hướng suy giảm đồng loạt: Tỷ lệ sinh ở cả 6 quốc gia Vùng Vịnh (Saudi Arabia, Oman, UAE, Qatar, Kuwait, Bahrain) đều sụt giảm đáng kể trong thập kỷ 1990-2000.",
      "Nhóm sinh nở cao nhất: Oman và Saudi Arabia ghi nhận mức sinh cao ngất ngưởng trên 7 con/phụ nữ năm 1990, sau đó giảm 20% xuống còn 5.5 con năm 2000.",
      "Nhóm sinh nở thấp hơn: UAE, Bahrain và Kuwait giảm từ mức 3.75 - 4 con xuống dưới 3 con/phụ nữ vào năm 2000 (UAE giảm mạnh nhất trên 25%)."
    ],
    modelEssay: "The chart represents changes in the fertility rates of female members of the population in six different Gulf countries, namely Saudi Arabia, Oman, the UAE, Kuwait, Bahrain and Qatar between 1990 and 2000.\n\nOverall, it can be seen that there were major falls in birth rates across all six nations, although some countries in the region retained significantly higher fertility rates than others throughout the period.\n\nFrom 1990 to 2000, there was a consistent contraction in the average number of children born per woman across the entire region. The most notable shifts occurred in two nations that already recorded comparatively low fertility at the beginning of the decade: the UAE and Bahrain. By 2000, rates in the UAE had contracted by over 25%, dropping below three births per woman, mirroring similar levels seen in Bahrain and Kuwait.\n\nIn contrast, wide regional variations remained evident. Oman and Saudi Arabia displayed the highest fertility rates in 1990, each exceeding seven births per woman. Although both nations experienced an approximate 20% reduction over the ten-year timeframe, their rates remained substantially elevated compared to their regional peers, standing at approximately 5.5 births per woman by the end of the timeframe.",
    vocabularies: [
      {
        id: "t1-r02-1",
        word: "fertility rate",
        ipa: "/fəˈtɪləti reɪt/",
        partOfSpeech: "noun",
        meaning: "Tỷ lệ sinh con tính trung bình trên mỗi phụ nữ",
        basicEquivalent: "number of babies per woman (Band 5)",
        synonyms: ["birth rate", "natality index"],
        collocations: ["declining fertility rate", "average fertility rate"],
        modelSentence: "Urbanization and female higher education contributed to a plummeting national fertility rate.",
        vietnameseSentence: "Đô thị hóa và giáo dục đại học cho phụ nữ đã góp phần làm tỷ lệ sinh quốc gia sụt giảm nhanh chóng."
      },
      {
        id: "t1-r02-2",
        word: "sustained contraction",
        ipa: "/səˈsteɪnd kənˈtrækʃn/",
        partOfSpeech: "noun",
        meaning: "Sự sụt giảm co hẹp liên tục trong thời gian dài",
        basicEquivalent: "continuous decrease (Band 5)",
        synonyms: ["prolonged decline", "unbroken downturn"],
        collocations: ["experience sustained contraction", "period of sustained contraction"],
        modelSentence: "All six Gulf states observed a sustained contraction in average fertility rates per female citizen.",
        vietnameseSentence: "Cả sáu quốc gia Vùng Vịnh đều chứng kiến sự co hẹp liên tục của tỷ lệ sinh trung bình tính trên mỗi nữ công dân."
      },
      {
        id: "t1-r02-3",
        word: "regional disparity",
        ipa: "/ˈriːdʒənl dɪˈspærəti/",
        partOfSpeech: "noun",
        meaning: "Sự phân hóa chênh lệch rõ nét giữa các quốc gia trong khu vực",
        basicEquivalent: "big difference between countries (Band 5)",
        synonyms: ["geographic inequality", "spatial divergence"],
        collocations: ["marked regional disparity", "highlight regional disparity"],
        modelSentence: "The chart highlights marked regional disparity, with Oman doubling the fertility figures of Bahrain.",
        vietnameseSentence: "Biểu đồ nêu bật sự chênh lệch khu vực rõ rệt, khi Oman có tỷ lệ sinh cao gấp đôi Bahrain."
      },
      {
        id: "t1-r02-4",
        word: "substantially elevated",
        ipa: "/səbˈstænʃəli ˈelɪveɪtɪd/",
        partOfSpeech: "phrase",
        meaning: "Duy trì ở mức cao vượt trội so với các đối tượng khác",
        basicEquivalent: "much higher (Band 5)",
        synonyms: ["considerably higher", "markedly superior"],
        collocations: ["remain substantially elevated", "rates were substantially elevated"],
        modelSentence: "Birth rates in Saudi Arabia remained substantially elevated despite widespread economic modernization.",
        vietnameseSentence: "Tỷ lệ sinh ở Ả Rập Xê Út vẫn duy trì ở mức cao vượt trội dù kinh tế hiện đại hóa sâu rộng."
      },
      {
        id: "t1-r02-5",
        word: "mirror similar levels",
        ipa: "/ˈmɪrə ˈsɪmələ ˈlevlz/",
        partOfSpeech: "phrase",
        meaning: "Phản ánh các mức độ số liệu tương đồng nhau",
        basicEquivalent: "look the same as (Band 5)",
        synonyms: ["exhibit comparable rates", "match figures"],
        collocations: ["trends mirror similar levels", "mirror the patterns"],
        modelSentence: "Fertility indices in the UAE mirrored similar levels seen in neighboring Bahrain by the end of the century.",
        vietnameseSentence: "Chỉ số sinh sản tại UAE phản ánh các mức tương đồng như tại nước láng giềng Bahrain vào cuối thế kỷ."
      }
    ]
  },
  {
    id: "task1-roche-03-uk-alcohol",
    name: "Multiple Charts: UK Alcohol Consumption - Adults Exceeding Limits vs Youth Trends",
    vietnameseName: "Biểu đồ kết hợp: Tỷ lệ người lớn Anh uống vượt ngưỡng an toàn vs Lượng cồn ở thiếu niên",
    tag: "Task 1: Biểu đồ kết hợp (Bar & Line)",
    icon: "Wine",
    chartType: "image",
    imageUrl: "/charts/task1/task1_roche-03-uk-alcohol.png",
    chartData: {
      title: "Multiple Charts: UK Alcohol Consumption - Adults Exceeding Limits vs Youth Trends",
      imageUrl: "/charts/task1/task1_roche-03-uk-alcohol.png",
      keyNotes: [
        "Hành vi uống quá liều ở người lớn: Gần 50% nam giới 18-44 tuổi uống vượt hướng dẫn an toàn; tỷ lệ ở nữ cùng tuổi là 39% nhưng nhóm 25-64 tuổi chỉ bằng một nửa nam giới. Nhóm người già (>65) uống ít nhất (nữ 5%, nam 20%).",
        "Mức tiêu thụ cồn ở thanh thiếu niên: Số đơn vị cồn trẻ em uống tăng gấp đôi từ 1990 đến 2004; tăng vọt mạnh nhất 1994-1998 (nam đạt >11 đơn vị, nữ đạt >8 đơn vị).",
        "Xu hướng thu hẹp khoảng cách giới tính: Sau năm 2000, lượng cồn của nam sinh giảm nhẹ trong khi nữ sinh tiếp tục tăng chạm đỉnh trên 10 đơn vị vào năm 2004."
      ]
    },
    ieltsPrompt: "The bar chart displays the percentage of British adults drinking more than the recommended guidelines on at least one day a week in 2004, while the line graph illustrates the average alcohol consumption of children in England, aged 11-15, who drank in the previous week between 1990 and 2004. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    keyNotes: [
      "Hành vi uống quá liều ở người lớn: Gần 50% nam giới 18-44 tuổi uống vượt hướng dẫn an toàn; tỷ lệ ở nữ cùng tuổi là 39% nhưng nhóm 25-64 tuổi chỉ bằng một nửa nam giới. Nhóm người già (>65) uống ít nhất (nữ 5%, nam 20%).",
      "Mức tiêu thụ cồn ở thanh thiếu niên: Số đơn vị cồn trẻ em uống tăng gấp đôi từ 1990 đến 2004; tăng vọt mạnh nhất 1994-1998 (nam đạt >11 đơn vị, nữ đạt >8 đơn vị).",
      "Xu hướng thu hẹp khoảng cách giới tính: Sau năm 2000, lượng cồn của nam sinh giảm nhẹ trong khi nữ sinh tiếp tục tăng chạm đỉnh trên 10 đơn vị vào năm 2004."
    ],
    modelEssay: "Both charts illustrate levels of alcohol consumption across different demographic groups in the United Kingdom.\n\nOverall, adult men were consistently more prone to exceeding recommended limits than women in 2004, particularly in younger cohorts. Concurrently, alcohol consumption among English children experienced a substantial expansion over the fourteen-year timeframe, with consumption levels among young girls steadily closing the gap with boys.\n\nLooking at adult drinking habits in 2004, nearly 50% of men aged 18 to 44 exceeded daily recommended alcohol thresholds. While the percentage was also comparatively elevated for women aged 18-24 (39%), figures for female cohorts aged 25-64 stood at roughly half the proportion of their male counterparts. Furthermore, consumption plummeted among senior citizens over 65, with only 5% of women and 20% of men drinking beyond guidelines.\n\nRegarding underage drinking between 1990 and 2004, the volume of alcohol consumed by children approximately doubled. The sharpest increase occurred between 1994 and 1998, with boy and girl intake escalating to over 11 and 8 units respectively. While boy consumption subsequently moderated after 2000, girls' intake maintained an upward trajectory, attaining a peak of just over 10 units in 2004.",
    vocabularies: [
      {
        id: "t1-r03-1",
        word: "recommended guidelines",
        ipa: "/ˌrekəˈmendɪd ˈɡaɪdlaɪnz/",
        partOfSpeech: "noun",
        meaning: "Các hướng dẫn tiêu chuẩn an toàn do cơ quan y tế khuyến cáo",
        basicEquivalent: "official health advice (Band 5)",
        synonyms: ["statutory thresholds", "advisory limits"],
        collocations: ["exceed recommended guidelines", "adhere to guidelines"],
        modelSentence: "Over forty percent of young male adults regularly exceeded recommended guidelines regarding alcohol intake.",
        vietnameseSentence: "Hơn bốn mươi phần trăm nam thanh niên thường xuyên vượt quá các hướng dẫn khuyến nghị về lượng cồn hấp thụ."
      },
      {
        id: "t1-r03-2",
        word: "underage drinking",
        ipa: "/ˌʌndərˈeɪdʒ ˈdrɪŋkɪŋ/",
        partOfSpeech: "noun",
        meaning: "Nạn uống rượu bia khi chưa đủ tuổi vị thành niên",
        basicEquivalent: "children drinking alcohol (Band 5)",
        synonyms: ["minor alcohol consumption", "adolescent drinking"],
        collocations: ["curb underage drinking", "rates of underage drinking"],
        modelSentence: "Public awareness campaigns were deployed in secondary schools to suppress underage drinking.",
        vietnameseSentence: "Các chiến dịch nâng cao nhận thức cộng đồng đã được triển khai tại các trường cấp hai để kiềm chế nạn uống rượu ở tuổi vị thành niên."
      },
      {
        id: "t1-r03-3",
        word: "reach a plateau",
        ipa: "/riːtʃ ə plæˈtəʊ/",
        partOfSpeech: "phrase",
        meaning: "Chạm ngưỡng đi ngang bình ổn sau một giai đoạn tăng trưởng",
        basicEquivalent: "stay flat / stop changing (Band 5)",
        synonyms: ["level off", "stabilize at"],
        collocations: ["consumption reached a plateau", "plateaued in 2000"],
        modelSentence: "Underage alcohol consumption reached a plateau after 2000 before girl intake experienced a secondary surge.",
        vietnameseSentence: "Lượng tiêu thụ cồn ở trẻ vị thành niên đã đi ngang bình ổn sau năm 2000 trước khi lượng uống của nữ sinh tăng trở lại."
      },
      {
        id: "t1-r03-4",
        word: "narrow the gender gap",
        ipa: "/ˈnærəʊ ðə ˈdʒendə ɡæp/",
        partOfSpeech: "phrase",
        meaning: "Thu hẹp khoảng cách chênh lệch giữa nam và nữ",
        basicEquivalent: "make the boy-girl difference smaller (Band 5)",
        synonyms: ["bridge the gender divide", "converge across genders"],
        collocations: ["succeed in narrowing the gender gap", "data narrow the gap"],
        modelSentence: "Escalating alcohol unit consumption among adolescent girls significantly narrowed the gender gap by 2004.",
        vietnameseSentence: "Mức tiêu thụ đơn vị cồn leo thang ở nữ sinh vị thành niên đã thu hẹp đáng kể khoảng cách giới tính vào năm 2004."
      },
      {
        id: "t1-r03-5",
        word: "senior cohorts",
        ipa: "/ˈsiːniə ˈkəʊhɔːts/",
        partOfSpeech: "noun",
        meaning: "Nhóm người thuộc độ tuổi người cao tuổi (>65)",
        basicEquivalent: "old people group (Band 5)",
        synonyms: ["elderly demographic", "retiree age bracket"],
        collocations: ["consumption among senior cohorts", "survey senior cohorts"],
        modelSentence: "Excessive alcohol consumption plummeted among senior cohorts aged sixty-five and over.",
        vietnameseSentence: "Việc tiêu thụ rượu bia quá mức đã tụt dốc ở nhóm người cao tuổi từ 65 tuổi trở lên."
      }
    ]
  },
  {
    id: "task1-roche-04-uk-spending",
    name: "Pie Charts: British Household Expenditure Allocation (1966 vs 1996)",
    vietnameseName: "Biểu đồ tròn: Cơ cấu chi tiêu hộ gia đình tại Anh (1966 vs 1996)",
    tag: "Task 1: Biểu đồ tròn (Pie Charts)",
    icon: "PieChart",
    chartType: "image",
    imageUrl: "/charts/task1/task1_roche-04-uk-spending.png",
    chartData: {
      title: "Pie Charts: British Household Expenditure Allocation (1966 vs 1996)",
      imageUrl: "/charts/task1/task1_roche-04-uk-spending.png",
      keyNotes: [
        "Sự đảo chiều giữa Thực phẩm và Ô tô: Thực phẩm và xe hơi luôn chiếm trên 50% tổng chi tiêu; tuy nhiên Thực phẩm co lại 2/3 (từ 44% xuống 14%), trong khi Ô tô tăng gần gấp đôi (từ 23% lên 45%).",
        "Tăng trưởng dịch vụ và máy tính: Ăn uống nhà hàng tăng gấp đôi từ 7% lên 14%; chi tiêu máy tính cá nhân bùng nổ gấp 10 lần (từ 1% lên 10%).",
        "Sụt giảm sách báo in ấn: Sách sụt giảm thê thảm từ 6% xuống chỉ còn 1%; chi phí xăng dầu và đồ nội thất duy trì ổn định không đổi."
      ]
    },
    ieltsPrompt: "The pie charts display changes in UK spending patterns across different expenditure categories from 1966 to 1996. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    keyNotes: [
      "Sự đảo chiều giữa Thực phẩm và Ô tô: Thực phẩm và xe hơi luôn chiếm trên 50% tổng chi tiêu; tuy nhiên Thực phẩm co lại 2/3 (từ 44% xuống 14%), trong khi Ô tô tăng gần gấp đôi (từ 23% lên 45%).",
      "Tăng trưởng dịch vụ và máy tính: Ăn uống nhà hàng tăng gấp đôi từ 7% lên 14%; chi tiêu máy tính cá nhân bùng nổ gấp 10 lần (từ 1% lên 10%).",
      "Sụt giảm sách báo in ấn: Sách sụt giảm thê thảm từ 6% xuống chỉ còn 1%; chi phí xăng dầu và đồ nội thất duy trì ổn định không đổi."
    ],
    modelEssay: "The pie charts display changes in United Kingdom household expenditure patterns between 1966 and 1996.\n\nOverall, the period witnessed dramatic structural reallocations of family budgets. Spending on motor cars, dining out, and computing experienced remarkable surges, largely at the expense of traditional necessities such as groceries and literature.\n\nIn both years, food and automotive transport accounted for over half of all household outlays. However, their trajectories diverged starkly: food comprised 44% of total expenditure in 1966 before shrinking by more than two-thirds to just 14% by 1996. Conversely, expenditure on cars doubled from 23% to 45%, establishing private vehicles as the single largest budget component.\n\nSubstantial shifts were also evident across leisure and modern technology. Dining in restaurants grew twofold from 7% to 14%, while spending on personal computers escalated tenfold from 1% to 10%. In sharp contrast, outlays on books plummeted from 6% down to a negligible 1%. Other areas, notably furniture and petrol, remained relatively stable across the three decades.",
    vocabularies: [
      {
        id: "t1-r04-1",
        word: "household outlay",
        ipa: "/ˈhaʊshəʊld ˈaʊtleɪ/",
        partOfSpeech: "noun",
        meaning: "Khoản tiền chi tiêu của hộ gia đình",
        basicEquivalent: "family spending (Band 5)",
        synonyms: ["domestic expenditure", "household budget allocation"],
        collocations: ["major household outlays", "total household outlay"],
        modelSentence: "Automotive expenses absorbed the vast majority of total household outlay by the close of the century.",
        vietnameseSentence: "Chi phí xe cộ đã hấp thụ đại đa số tổng chi tiêu hộ gia đình vào cuối thế kỷ."
      },
      {
        id: "t1-r04-2",
        word: "diverge starkly",
        ipa: "/daɪˈvɜːdʒ ˈstɑːkli/",
        partOfSpeech: "phrase",
        meaning: "Phân kỳ rẽ hướng đối lập nhau một cách vô cùng rõ rệt",
        basicEquivalent: "go opposite ways (Band 5)",
        synonyms: ["deviate radically", "exhibit sharp divergence"],
        collocations: ["trajectories diverged starkly", "trends diverged"],
        modelSentence: "Household allocations for food and private motoring diverged starkly over the surveyed three decades.",
        vietnameseSentence: "Phân bổ ngân sách gia đình cho thực phẩm và xe hơi cá nhân đã phân kỳ đối lập nhau một cách rõ rệt qua 3 thập kỷ."
      },
      {
        id: "t1-r04-3",
        word: "twofold increase",
        ipa: "/ˈtuːfəʊld ˈɪŋkriːs/",
        partOfSpeech: "noun",
        meaning: "Mức tăng trưởng gấp hai lần quy mô ban đầu",
        basicEquivalent: "doubling (Band 5)",
        synonyms: ["twofold expansion", "doubled volume"],
        collocations: ["witness a twofold increase", "represent a twofold surge"],
        modelSentence: "Restaurant dining experienced a twofold increase over the thirty-year timeframe, rising from 7% to 14%.",
        vietnameseSentence: "Ăn uống tại nhà hàng chứng kiến mức tăng gấp hai lần qua 30 năm, leo từ 7% lên 14% ngân sách."
      },
      {
        id: "t1-r04-4",
        word: "tenfold escalation",
        ipa: "/ˈtenfəʊld ˌeskəˈleɪʃn/",
        partOfSpeech: "noun",
        meaning: "Mức leo thang tăng vọt gấp mười lần",
        basicEquivalent: "ten times higher (Band 5)",
        synonyms: ["decifold rise", "tenfold multiplication"],
        collocations: ["tenfold escalation in sales", "record a tenfold escalation"],
        modelSentence: "Expenditure on domestic personal computing recorded a tenfold escalation from a modest 1% up to 10%.",
        vietnameseSentence: "Chi tiêu cho máy tính cá nhân gia đình ghi nhận mức tăng gấp mười lần từ mức khiêm tốn 1% lên tới 10%."
      },
      {
        id: "t1-r04-5",
        word: "plummet to negligible levels",
        ipa: "/ˈplʌmɪt tuː ˈneɡlɪdʒəbl ˈlevlz/",
        partOfSpeech: "phrase",
        meaning: "Tụt dốc không phanh xuống mức cực kỳ nhỏ bé không đáng kể",
        basicEquivalent: "drop down to almost zero (Band 5)",
        synonyms: ["collapse to marginal figures", "shrink to insignificance"],
        collocations: ["outlays plummeted to negligible levels", "plummet to a mere 1%"],
        modelSentence: "Household outlays on printed literature plummeted to negligible levels of barely one percent by 1996.",
        vietnameseSentence: "Khoản chi của gia đình cho sách báo in ấn đã tụt dốc xuống mức không đáng kể, vỏn vẹn một phần trăm vào năm 1996."
      }
    ]
  },
  {
    id: "task1-roche-05-consumer-spending",
    name: "Table: Proportions of Consumer Spending across Five European Countries (2002)",
    vietnameseName: "Bảng số liệu: Tỷ lệ chi tiêu tiêu dùng tại 5 quốc gia Châu Âu (2002)",
    tag: "Task 1: Bảng số liệu (Table)",
    icon: "Table",
    chartType: "image",
    imageUrl: "/charts/task1/task1_roche-05-consumer-spending.png",
    chartData: {
      title: "Table: Proportions of Consumer Spending across Five European Countries (2002)",
      imageUrl: "/charts/task1/task1_roche-05-consumer-spending.png",
      keyNotes: [
        "Thực phẩm/Đồ uống/Thuốc lá áp đảo: Luôn là khoản chi lớn nhất ở cả 5 nước; dẫn đầu là Thổ Nhĩ Kỳ (32.14%) và Ireland (~29%), thấp nhất là Thụy Điển (15.77%).",
        "Giải trí/Giáo dục khiêm tốn nhất: Chiếm tỷ lệ thấp nhất ở toàn bộ các nước (từ dưới 2% ở Tây Ban Nha đến 4.35% ở Thổ Nhĩ Kỳ).",
        "May mặc & Giày dép: Ý chi tiêu cao nhất cho thời trang (9%), vượt trội hẳn 4 nước còn lại (Thụy Điển chỉ 5.4%)."
      ]
    },
    ieltsPrompt: "The table reveals proportions of consumer spending for three categories of products and services in Italy, Spain, Sweden, Ireland, and Turkey in 2002. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    keyNotes: [
      "Thực phẩm/Đồ uống/Thuốc lá áp đảo: Luôn là khoản chi lớn nhất ở cả 5 nước; dẫn đầu là Thổ Nhĩ Kỳ (32.14%) và Ireland (~29%), thấp nhất là Thụy Điển (15.77%).",
      "Giải trí/Giáo dục khiêm tốn nhất: Chiếm tỷ lệ thấp nhất ở toàn bộ các nước (từ dưới 2% ở Tây Ban Nha đến 4.35% ở Thổ Nhĩ Kỳ).",
      "May mặc & Giày dép: Ý chi tiêu cao nhất cho thời trang (9%), vượt trội hẳn 4 nước còn lại (Thụy Điển chỉ 5.4%)."
    ],
    modelEssay: "The table reveals proportions of consumer spending across three broad categories of goods and services in Italy, Spain, Sweden, Ireland, and Turkey in the year 2002.\n\nOverall, food, drinks, and tobacco constituted the largest expenditure category across all five nations, whereas leisure and education consistently represented the smallest proportion of family budgets.\n\nConsumer expenditure on food, beverages, and tobacco was noticeably higher in developing and peripheral markets, led by Turkey at 32.14% and Ireland at nearly 29%. By contrast, Sweden dedicated the lowest proportion to sustenance items, at just 15.77%, with Italy and Spain registering intermediate shares of approximately 16% and 19% respectively.\n\nRegarding the remaining sectors, clothing and footwear absorbed 9% of consumer budgets in Italy, noticeably higher than any other nation surveyed. In contrast, recreation and educational services recorded the lowest allocations across the board, ranging from a mere 1.98% in Spain to a modest peak of 4.35% in Turkey.",
    vocabularies: [
      {
        id: "t1-r05-1",
        word: "consumer expenditure",
        ipa: "/kənˈsjuːmər ɪkˈspendɪtʃə/",
        partOfSpeech: "noun",
        meaning: "Tổng mức chi tiêu mua sắm của người tiêu dùng",
        basicEquivalent: "people's spending (Band 5)",
        synonyms: ["retail spending", "private consumption outlay"],
        collocations: ["track consumer expenditure", "aggregate consumer expenditure"],
        modelSentence: "Macroeconomic indicators track consumer expenditure to forecast future quarterly gross domestic product.",
        vietnameseSentence: "Các chỉ số kinh tế vĩ mô theo dõi chi tiêu của người tiêu dùng để dự báo tổng sản phẩm quốc nội quý tới."
      },
      {
        id: "t1-r05-2",
        word: "comprise the bulk of",
        ipa: "/kəmˈpraɪz ðə bʌlk əv/",
        partOfSpeech: "phrase",
        meaning: "Chiếm đại đa số tỷ trọng trong toàn bộ cơ cấu",
        basicEquivalent: "be the biggest part of (Band 5)",
        synonyms: ["constitute the vast majority of", "account for the lion's share"],
        collocations: ["comprise the bulk of expenditure", "comprise the bulk of sales"],
        modelSentence: "Food, drinks, and tobacco comprised the bulk of consumer budgets across developing European economies.",
        vietnameseSentence: "Thực phẩm, đồ uống và thuốc lá chiếm đại đa số tỷ trọng ngân sách người tiêu dùng tại các nền kinh tế châu Âu đang phát triển."
      },
      {
        id: "t1-r05-3",
        word: "sustenance items",
        ipa: "/ˈsʌstɪnəns ˈaɪtəmz/",
        partOfSpeech: "noun",
        meaning: "Các mặt hàng thiết yếu duy trì sự sống (thực phẩm, nước uống)",
        basicEquivalent: "basic food and drinks (Band 5)",
        synonyms: ["dietary staples", "essential nourishment"],
        collocations: ["spending on sustenance items", "procure sustenance items"],
        modelSentence: "Developing households inevitably dedicate higher budget proportions strictly to basic sustenance items.",
        vietnameseSentence: "Các hộ gia đình ở các nước đang phát triển tất yếu phải dành tỷ trọng ngân sách lớn hơn cho các mặt hàng sinh tồn cơ bản."
      },
      {
        id: "t1-r05-4",
        word: "negligible share",
        ipa: "/ˈneɡlɪdʒəbl ʃeər/",
        partOfSpeech: "noun",
        meaning: "Tỷ trọng nhỏ bé không đáng kể trong biểu đồ",
        basicEquivalent: "tiny part (Band 5)",
        synonyms: ["infinitesimal fraction", "marginal proportion"],
        collocations: ["represent a negligible share", "shrink to a negligible share"],
        modelSentence: "Expenditure on educational pastimes in Spain accounted for a negligible share of under two percent.",
        vietnameseSentence: "Chi tiêu cho giải trí giáo dục tại Tây Ban Nha chỉ chiếm một tỷ trọng nhỏ bé không đáng kể dưới hai phần trăm."
      },
      {
        id: "t1-r05-5",
        word: "absorb consumer budgets",
        ipa: "/əbˈzɔːb kənˈsjuːmə ˈbʌdʒɪts/",
        partOfSpeech: "phrase",
        meaning: "Hấp thụ, chiếm dụng phần lớn túi tiền của người dân",
        basicEquivalent: "take a lot of money (Band 5)",
        synonyms: ["command personal income", "exhaust disposable wages"],
        collocations: ["necessities absorb consumer budgets", "rent absorbs budgets"],
        modelSentence: "Designer apparel and footwear absorbed an impressive nine percent of Italian household expenditure.",
        vietnameseSentence: "Trang phục và giày dép hàng hiệu đã hấp thụ tới chín phần trăm ấn tượng trong chi tiêu gia đình người Ý."
      }
    ]
  },
  {
    id: "task1-roche-06-water-cycle",
    name: "Process: The Global Water Cycle and Groundwater Saltwater Intrusion",
    vietnameseName: "Quy trình: Vòng tuần hoàn nước tự nhiên và hiện tượng xâm nhập mặn ngầm ven biển",
    tag: "Task 1: Sơ đồ quy trình (Process Diagram)",
    icon: "Droplets",
    chartType: "image",
    imageUrl: "/charts/task1/task1_roche-06-water-cycle.png",
    chartData: {
      title: "Process: The Global Water Cycle and Groundwater Saltwater Intrusion",
      imageUrl: "/charts/task1/task1_roche-06-water-cycle.png",
      keyNotes: [
        "Bốc hơi & Ngưng tụ trên khí quyển: Nhiệt lượng mặt trời làm bốc hơi nước biển (chiếm khoảng 80% hơi ẩm); hơi nước bay lên cao gặp lạnh ngưng tụ thành các đám mây.",
        "Giáng thủy & Thấm lọc mặt đất: Mây tích tụ ngưng tụ tạo mưa và tuyết (precipitation) rơi xuống ao hồ hoặc thấm vào đất (absorption).",
        "Dòng chảy mặt & Xâm nhập mặn ngầm: Nước ngầm chảy tràn bề mặt (surface runoff) hồi quy về biển; song song đó nước mặn đại dương thấm ngược vào các tầng ngậm nước ngọt (saltwater intrusion)."
      ]
    },
    ieltsPrompt: "The diagram illustrates the natural water cycle and the movement of water between the oceans, atmosphere, and land. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    keyNotes: [
      "Bốc hơi & Ngưng tụ trên khí quyển: Nhiệt lượng mặt trời làm bốc hơi nước biển (chiếm khoảng 80% hơi ẩm); hơi nước bay lên cao gặp lạnh ngưng tụ thành các đám mây.",
      "Giáng thủy & Thấm lọc mặt đất: Mây tích tụ ngưng tụ tạo mưa và tuyết (precipitation) rơi xuống ao hồ hoặc thấm vào đất (absorption).",
      "Dòng chảy mặt & Xâm nhập mặn ngầm: Nước ngầm chảy tràn bề mặt (surface runoff) hồi quy về biển; song song đó nước mặn đại dương thấm ngược vào các tầng ngậm nước ngọt (saltwater intrusion)."
    ],
    modelEssay: "The diagram illustrates the sequential stages of the hydrological cycle, detailing the movement of water from oceanic reservoirs into the atmosphere, onto the terrestrial landscape, and back through surface and subterranean channels.\n\nOverall, the water cycle is a continuous cyclical mechanism driven by solar radiation, encompassing three primary phases: evaporation, precipitation, and terrestrial percolation returning to the sea, alongside subterranean saltwater intrusion.\n\nIn the initial phase, thermal energy from the sun heats surface waters, causing massive evaporation. Approximately 80% of all atmospheric moisture originates directly from oceans. As warm water vapor ascends into higher altitudes, it cools and condenses to formulate cloud systems. Once moisture accumulation reaches saturation, clouds discharge precipitation in the form of rainfall and snowfall.\n\nSubsequently, precipitation reaches the Earth's surface, filling freshwater bodies or permeating into porous soil layers. While a significant portion flows unimpeded back to the ocean via surface runoff, subterranean groundwater percolates downwards toward impervious bedrock. Concurrently, seawater seeps inland through porous coastal strata, resulting in saltwater intrusion into coastal freshwater aquifers.",
    vocabularies: [
      {
        id: "t1-r06-1",
        word: "hydrological cycle",
        ipa: "/ˌhaɪdrəˈlɒdʒɪkl ˈsaɪkl/",
        partOfSpeech: "noun",
        meaning: "Vòng tuần hoàn nước tự nhiên giữa đất liền, đại dương và khí quyển",
        basicEquivalent: "water cycle (Band 5)",
        synonyms: ["global water cycle", "aquatic circulation"],
        collocations: ["stages of the hydrological cycle", "driven by the hydrological cycle"],
        modelSentence: "Solar radiation serves as the primary energetic engine driving the planet's hydrological cycle.",
        vietnameseSentence: "Bức xạ mặt trời đóng vai trò là động cơ năng lượng chính vận hành vòng tuần hoàn nước của hành tinh."
      },
      {
        id: "t1-r06-2",
        word: "accumulate condensation",
        ipa: "/əˈkjuːmjəleɪt ˌkɒndenˈseɪʃn/",
        partOfSpeech: "phrase",
        meaning: "Tích tụ lượng hơi nước ngưng tụ tạo thành mây dày",
        basicEquivalent: "gather water drops into clouds (Band 5)",
        synonyms: ["build up condensed vapor", "gather precipitation moisture"],
        collocations: ["clouds accumulate condensation", "accumulate condensation rapidly"],
        modelSentence: "As moisture-laden updrafts accumulate condensation, extensive cumulonimbus precipitation systems develop.",
        vietnameseSentence: "Khi các luồng khí bốc lên mang hơi ẩm tích tụ ngưng tụ, các hệ thống mây tích mưa diện rộng sẽ phát triển."
      },
      {
        id: "t1-r06-3",
        word: "discharge precipitation",
        ipa: "/dɪsˈtʃɑːdʒ prɪˌsɪpɪˈteɪʃn/",
        partOfSpeech: "phrase",
        meaning: "Giáng thủy, trút nước mưa hoặc tuyết xuống bề mặt đất",
        basicEquivalent: "make rain or snow fall (Band 5)",
        synonyms: ["release rainfall", "unleash downpours"],
        collocations: ["clouds discharge precipitation", "discharge heavy precipitation"],
        modelSentence: "Saturated storm fronts discharge heavy precipitation over coastal mountain ranges.",
        vietnameseSentence: "Các khối không khí bão bão hòa trút những cơn mưa giáng thủy nặng hạt xuống các dãy núi ven biển."
      },
      {
        id: "t1-r06-4",
        word: "surface runoff",
        ipa: "/ˈsɜːfɪs ˈrʌnɒf/",
        partOfSpeech: "noun",
        meaning: "Dòng chảy tràn bề mặt của nước mưa đổ ra sông suối và biển",
        basicEquivalent: "water flowing on the ground (Band 5)",
        synonyms: ["overland flow", "stormwater discharge"],
        collocations: ["generate surface runoff", "prevent excessive surface runoff"],
        modelSentence: "Rainfall that fails to percolate through soil horizons drains back into marine reservoirs via surface runoff.",
        vietnameseSentence: "Nước mưa không kịp thấm qua các tầng đất sẽ thoát trở lại các hồ chứa đại dương qua dòng chảy tràn bề mặt."
      },
      {
        id: "t1-r06-5",
        word: "saltwater intrusion",
        ipa: "/ˈsɔːltwɔːtər ɪnˈtruːʒn/",
        partOfSpeech: "noun",
        meaning: "Hiện tượng xâm nhập mặn của nước biển vào tầng nước ngầm",
        basicEquivalent: "sea water going into drinking water (Band 5)",
        synonyms: ["saline seepage", "marine aquifer contamination"],
        collocations: ["prevent saltwater intrusion", "combat saltwater intrusion"],
        modelSentence: "Over-extracting fresh coastal aquifers accelerates saltwater intrusion from adjacent ocean depths.",
        vietnameseSentence: "Việc khai thác quá mức các túi nước ngọt ven biển sẽ đẩy nhanh hiện tượng xâm nhập mặn từ đại dương lân cận."
      }
    ]
  },
  {
    id: "task1-roche-07-island-tourism",
    name: "Maps: Development and Transformation of an Island for Tourism",
    vietnameseName: "Bản đồ quy hoạch: Sự biến đổi và phát triển của một hòn đảo phục vụ du lịch",
    tag: "Task 1: Bản đồ quy hoạch (Maps)",
    icon: "MapPin",
    chartType: "image",
    imageUrl: "/charts/task1/task1_roche-07-island-tourism.png",
    chartData: {
      title: "Maps: Development and Transformation of an Island for Tourism",
      imageUrl: "/charts/task1/task1_roche-07-island-tourism.png",
      keyNotes: [
        "Chuyển đổi từ đảo hoang thành khu nghỉ dưỡng: Đảo hoang sơ trước đây hoàn toàn không có công trình xây dựng, sau quy hoạch đã biến thành khu du lịch tiện nghi đầy đủ.",
        "Hệ thống bungalow lưu trú: Xây mới 15 căn nhà tròn (6 căn phía Tây, 9 căn ở trung tâm) kết nối bởi đường dạo bộ (footpaths) bao quanh quầy lễ tân và nhà hàng.",
        "Hạ tầng cầu tàu & khu giải trí: Bờ biển phía Nam xây dựng bến tàu (pier) nối đường xe cơ giới tới lễ tân; bãi biển phía Tây mở khu bơi lội an toàn ngoài khơi; cây cối tự nhiên vẫn được bảo tồn."
      ]
    },
    ieltsPrompt: "The two maps illustrate the changes which have taken place on a small island, before and after it was developed for tourism. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    keyNotes: [
      "Chuyển đổi từ đảo hoang thành khu nghỉ dưỡng: Đảo hoang sơ trước đây hoàn toàn không có công trình xây dựng, sau quy hoạch đã biến thành khu du lịch tiện nghi đầy đủ.",
      "Hệ thống bungalow lưu trú: Xây mới 15 căn nhà tròn (6 căn phía Tây, 9 căn ở trung tâm) kết nối bởi đường dạo bộ (footpaths) bao quanh quầy lễ tân và nhà hàng.",
      "Hạ tầng cầu tàu & khu giải trí: Bờ biển phía Nam xây dựng bến tàu (pier) nối đường xe cơ giới tới lễ tân; bãi biển phía Tây mở khu bơi lội an toàn ngoài khơi; cây cối tự nhiên vẫn được bảo tồn."
    ],
    modelEssay: "The two maps illustrate the transformation of a small uninhabited island before and after being redeveloped to support commercial tourism infrastructure.\n\nOverall, the island has been substantially modernized with the addition of comprehensive visitor accommodation and leisure amenities, while natural landscape elements, such as scattered palm trees, have been largely preserved.\n\nPrior to development, the island was entirely devoid of human structures, featuring solely sandy beaches along its western rim and sparse clusters of trees across its terrain. Following redevelopment, tourist accommodation was established through the construction of fifteen circular huts, with six located in the western quarter and nine situated around the central core. These residential quarters are interconnected via an organized network of pedestrian footpaths connecting to a central reception desk and a dining restaurant.\n\nTransportation and recreational access were also systematically enhanced. A vehicular road now links the reception building to a newly constructed marine pier along the southern coastline, facilitating boat transfers. Furthermore, a designated offshore swimming area was created off the western shore, while the natural flora was retained without extensive deforestation.",
    vocabularies: [
      {
        id: "t1-r07-1",
        word: "commercial redevelopment",
        ipa: "/kəˈmɜːʃl ˌriːdɪˈveləpmənt/",
        partOfSpeech: "noun",
        meaning: "Quy hoạch tái thiết vì mục đích thương mại dịch vụ",
        basicEquivalent: "building new business buildings (Band 5)",
        synonyms: ["tourism modernizing overhaul", "infrastructural transformation"],
        collocations: ["undergo commercial redevelopment", "plans for commercial redevelopment"],
        modelSentence: "The uninhabited islet underwent rapid commercial redevelopment to accommodate luxury eco-tourists.",
        vietnameseSentence: "Hòn đảo nhỏ không người ở đã trải qua quá trình tái thiết thương mại nhanh chóng để tiếp đón khách du lịch sinh thái cao cấp."
      },
      {
        id: "t1-r07-2",
        word: "ample accommodation",
        ipa: "/ˈæmpl əˌkɒməˈdeɪʃn/",
        partOfSpeech: "noun",
        meaning: "Cơ sở lưu trú dồi dào, phong phú cho du khách",
        basicEquivalent: "plenty of rooms to sleep (Band 5)",
        synonyms: ["plentiful lodging", "abundant guest quarters"],
        collocations: ["provide ample accommodation", "boast ample accommodation"],
        modelSentence: "Following intensive architectural redevelopment, the resort island now boasts ample accommodation for vacationers.",
        vietnameseSentence: "Sau khi tái thiết kiến trúc mạnh mẽ, hòn đảo nghỉ dưỡng nay tự hào sở hữu cơ sở lưu trú dồi dào cho du khách."
      },
      {
        id: "t1-r07-3",
        word: "pedestrian footpaths",
        ipa: "/pəˈdestriən ˈfʊtpɑːðz/",
        partOfSpeech: "noun",
        meaning: "Đường mòn dạo bộ dành riêng cho người đi bộ",
        basicEquivalent: "walking paths (Band 5)",
        synonyms: ["walkways", "foot trails", "pedestrian lanes"],
        collocations: ["network of pedestrian footpaths", "paved pedestrian footpaths"],
        modelSentence: "Guest accommodation chalets are interconnected by an organized grid of timber pedestrian footpaths.",
        vietnameseSentence: "Các căn nhà gỗ nghỉ dưỡng của khách được kết nối với nhau bởi mạng lưới đường dạo bộ bằng gỗ quy củ."
      },
      {
        id: "t1-r07-4",
        word: "marine pier",
        ipa: "/məˈriːn pɪə/",
        partOfSpeech: "noun",
        meaning: "Cầu cảng trên biển để tàu thuyền neo đậu cập bến",
        basicEquivalent: "dock for boats (Band 5)",
        synonyms: ["jetty", "boat landing terminal"],
        collocations: ["construct a marine pier", "ferries dock at the pier"],
        modelSentence: "A modern marine pier was constructed along the southern shoreline to allow passenger catamarans to dock safely.",
        vietnameseSentence: "Một cầu cảng biển hiện đại đã được xây dựng dọc theo bờ biển phía nam để tàu hai thân chở khách cập bến an toàn."
      },
      {
        id: "t1-r07-5",
        word: "designated swimming area",
        ipa: "/ˈdezɪɡneɪtɪd ˈswɪmɪŋ ˈeəriə/",
        partOfSpeech: "noun",
        meaning: "Khu vực bãi tắm được quy hoạch an toàn cho bơi lội",
        basicEquivalent: "safe place to swim (Band 5)",
        synonyms: ["marked bathing zone", "cordoned aquatic zone"],
        collocations: ["a designated swimming area offshore", "establish a designated swimming area"],
        modelSentence: "A designated swimming area was demarcated off the western beach to safeguard vacationers from coastal boat traffic.",
        vietnameseSentence: "Một khu vực bơi lội quy hoạch đã được khoanh vùng ngoài khơi bãi biển phía tây để bảo vệ du khách khỏi tàu thuyền ven bờ."
      }
    ]
  }
];
export const IELTS_TASK1_TOPICS = RAW_IELTS_TASK1_TOPICS.map(topic => ({
  ...topic,
  vocabularies: topic.vocabularies.map(v => enrichVocabulary(v, topic.name))
}));
