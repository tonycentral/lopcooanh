import { enrichVocabulary } from './vocabEnhancer.js';
import promptsData from './databank/prompts.json';
import vocabulariesData from './databank/vocabularies.json';

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
  }
];

const TOPIC_ICONS = {
  environment: 'Leaf',
  education: 'GraduationCap',
  technology: 'Cpu',
  society: 'Users',
  globalization: 'Globe',
  health: 'HeartPulse',
  work_career: 'Briefcase',
  crime_law: 'Scale',
  business: 'TrendingUp'
};

// Map vocabularies by topicId for fast access
const vocabsByTopic = {};
vocabulariesData.forEach(v => {
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

const allTask2TopicsRaw = task2Prompts.map(p => {
  const existing = findMatchingCuratedTopic(p);
  if (existing) {
    matchedCuratedIds.add(existing.id);
    return {
      ...existing,
      yearDate: p.yearDate || existing.yearDate || 'Kinh điển',
      topicCategory: p.topicId || existing.topicCategory || 'society',
      difficulty: p.difficulty || existing.difficulty || 'Trung bình (Band 6.5 - 7.0)',
      outlineHints: p.outlineHints || existing.outlineHints || '',
      sourceDetail: p.sourceDetail || existing.tag
    };
  }

  // Pick matching vocabularies from vocabulariesData
  const matchingVocabs = (vocabsByTopic[p.topicId] || []).slice(0, 8);
  let vocabs = [...matchingVocabs];
  if (vocabs.length < 5) {
    const backup = (vocabsByTopic['society'] || []).slice(0, 5 - vocabs.length);
    vocabs = [...vocabs, ...backup];
  }

  return {
    id: p.id,
    name: p.title,
    vietnameseName: p.title,
    tag: p.yearDate ? `${p.sourceType || 'IELTS'} ${p.yearDate}` : (p.sourceDetail || 'IELTS'),
    icon: TOPIC_ICONS[p.topicId] || 'BookOpen',
    ieltsPrompt: p.promptText,
    yearDate: p.yearDate || 'Kinh điển',
    topicCategory: p.topicId || 'society',
    difficulty: p.difficulty || 'Trung bình (Band 6.5 - 7.0)',
    outlineHints: p.outlineHints || '',
    sourceDetail: p.sourceDetail || '',
    vocabularies: vocabs.map((v, i) => ({
      id: `${p.id}-v${i + 1}`,
      word: v.word,
      ipa: v.ipa,
      partOfSpeech: v.partOfSpeech,
      meaning: v.meaning,
      basicEquivalent: v.basicEquivalent,
      synonyms: v.synonyms,
      collocations: v.collocations,
      modelSentence: v.exampleSentence,
      vietnameseSentence: v.meaning
    }))
  };
});

// Include foundational curated topics that may not have had a 1-to-1 prompt id match
const remainingCurated = RAW_IELTS_TOPICS.filter(t => !matchedCuratedIds.has(t.id)).map(t => ({
  ...t,
  yearDate: t.yearDate || 'Kinh điển',
  topicCategory: t.topicCategory || t.id
}));

const UNIFIED_RAW_TASK2_TOPICS = [
  ...allTask2TopicsRaw,
  ...remainingCurated
];

export const IELTS_TASK2_TOPICS = UNIFIED_RAW_TASK2_TOPICS.map(topic => ({
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
