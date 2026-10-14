// src/services/synonymService.js
// Quản lý kho từ vựng đồng nghĩa (Synonyms Databank & Dynamic Resolution)
// Cho phép bấm vào bất kỳ từ đồng nghĩa nào để mở ngay từ vựng mới đầy đủ IPA, nghĩa tiếng Việt, collocations, câu ví dụ & luyện tập 3 phần.

import { enrichVocabulary } from '../data/vocabEnhancer.js';
import vocabulariesData from '../data/databank/vocabularies.json';

// Bộ từ điển đồng nghĩa học thuật IELTS chất lượng cao (Curated Academic Synonym Bank)
const CURATED_SYNONYMS_DICTIONARY = {
  // === TASK 1 & TASK 2 CORE ACADEMIC VOCABULARY ===
  "earmark": {
    word: "earmark",
    ipa: "/ˈɪə.mɑːk/",
    partOfSpeech: "verb",
    meaning: "Dành riêng, phân bổ ngân sách hoặc nguồn lực cho mục đích cụ thể",
    basicEquivalent: "set aside / reserve for (Band 5)",
    synonyms: ["allocate", "apportion", "reserve", "designate"],
    collocations: ["earmark funds for", "earmark budget for education", "earmark resources"],
    modelSentence: "The municipal council agreed to earmark substantial revenue for public transit infrastructure.",
    vietnameseSentence: "Hội đồng thành phố đã đồng ý dành riêng nguồn thu đáng kể cho hạ tầng giao thông công cộng."
  },
  "apportion": {
    word: "apportion",
    ipa: "/əˈpɔː.ʃən/",
    partOfSpeech: "verb",
    meaning: "Phân chia, phân bổ tài nguyên theo tỉ lệ định sẵn",
    basicEquivalent: "divide / share out (Band 5)",
    synonyms: ["allocate", "earmark", "distribute", "allot"],
    collocations: ["apportion resources fairly", "apportion expenses among departments", "equitably apportion"],
    modelSentence: "Authorities must apportion medical expenditure equitably across urban and rural clinics.",
    vietnameseSentence: "Chính quyền phải phân bổ chi tiêu y tế một cách công bằng giữa các phòng khám đô thị và nông thôn."
  },
  "distribute": {
    word: "distribute",
    ipa: "/dɪˈstrɪb.juːt/",
    partOfSpeech: "verb",
    meaning: "Phân phát, phân phối đều khắp hoặc trải rộng",
    basicEquivalent: "give out / spread (Band 5)",
    synonyms: ["allocate", "disperse", "disseminate", "apportion"],
    collocations: ["distribute wealth evenly", "distribute funding proportionally", "unevenly distributed"],
    modelSentence: "Household budgets were distributed unevenly across housing, education, and leisure pursuits.",
    vietnameseSentence: "Ngân sách hộ gia đình được phân bổ không đồng đều giữa nhà ở, giáo dục và các hoạt động giải trí."
  },
  "excessively": {
    word: "excessively",
    ipa: "/ɪkˈses.ɪv.li/",
    partOfSpeech: "adverb",
    meaning: "Quá mức, vượt quá giới hạn hợp lý hoặc cân bằng",
    basicEquivalent: "too much (Band 5)",
    synonyms: ["disproportionately", "inordinately", "immoderately"],
    collocations: ["spend excessively on", "excessively high proportion", "excessively reliant on"],
    modelSentence: "Families in developing areas spent excessively on basic housing necessities relative to their income.",
    vietnameseSentence: "Các gia đình ở vùng đang phát triển đã chi tiêu quá mức cho các nhu cầu nhà ở cơ bản so với thu nhập."
  },
  "unevenly": {
    word: "unevenly",
    ipa: "/ʌnˈiː.vən.li/",
    partOfSpeech: "adverb",
    meaning: "Không đồng đều, lệch lạc về mặt tỉ lệ hoặc phân bố",
    basicEquivalent: "not equally (Band 5)",
    synonyms: ["disproportionately", "asymmetrically", "disparately"],
    collocations: ["unevenly distributed", "apportioned unevenly", "spread unevenly"],
    modelSentence: "Financial resources were distributed unevenly among the five surveyed nations throughout 2023.",
    vietnameseSentence: "Nguồn lực tài chính được phân bổ không đồng đều giữa 5 quốc gia được khảo sát trong suốt năm 2023."
  },
  "overwhelmingly": {
    word: "overwhelmingly",
    ipa: "/ˌəʊ.vəˈwel.mɪŋ.li/",
    partOfSpeech: "adverb",
    meaning: "Một cách áp đảo, chiếm ưu thế vượt trội hoàn toàn",
    basicEquivalent: "mostly / greatly (Band 5)",
    synonyms: ["predominantly", "massively", "disproportionately"],
    collocations: ["overwhelmingly dominant", "voted overwhelmingly", "overwhelmingly concentrated"],
    modelSentence: "Expenditure was overwhelmingly dominated by residential housing in the vast majority of countries.",
    vietnameseSentence: "Chi tiêu bị chiếm ưu thế áp đảo bởi nhà ở tại phần lớn các quốc gia."
  },
  "divergence": {
    word: "divergence",
    ipa: "/daɪˈvɜː.dʒəns/",
    partOfSpeech: "noun",
    meaning: "Sự phân kỳ, sự tách biệt hoặc khoảng cách khác biệt ngày càng lớn",
    basicEquivalent: "difference / separation (Band 5)",
    synonyms: ["disparity", "discrepancy", "gap", "variance"],
    collocations: ["sharp divergence between", "growing divergence in trends", "marked divergence"],
    modelSentence: "A sharp divergence was recorded between housing outlay and recreational leisure spending.",
    vietnameseSentence: "Một sự phân kỳ rõ nét đã được ghi nhận giữa chi tiêu nhà ở và chi tiêu giải trí."
  },
  "gap": {
    word: "gap",
    ipa: "/ɡæp/",
    partOfSpeech: "noun",
    meaning: "Khoảng cách, chênh lệch giữa hai đối tượng hoặc chỉ số",
    basicEquivalent: "difference (Band 5)",
    synonyms: ["disparity", "divergence", "divide", "imbalance"],
    collocations: ["widen the gap", "narrow the disparity gap", "sizeable expenditure gap"],
    modelSentence: "The sizeable gap between spending on education and leisure remained constant across all five nations.",
    vietnameseSentence: "Khoảng cách đáng kể giữa chi tiêu cho giáo dục và giải trí vẫn duy trì không đổi ở cả 5 quốc gia."
  },
  "imbalance": {
    word: "imbalance",
    ipa: "/ɪmˈbæl.əns/",
    partOfSpeech: "noun",
    meaning: "Sự mất cân bằng, tình trạng lệch tỉ trọng giữa các yếu tố",
    basicEquivalent: "unequal state (Band 5)",
    synonyms: ["disparity", "asymmetry", "inequality", "disproportion"],
    collocations: ["structural imbalance", "address the budgetary imbalance", "conspicuous imbalance"],
    modelSentence: "A conspicuous imbalance characterized the household budget allocation between Country A and Country E.",
    vietnameseSentence: "Một sự mất cân bằng rõ rệt đã đặc trưng cho cơ cấu phân bổ ngân sách hộ gia đình giữa Country A và Country E."
  },
  "inequality": {
    word: "inequality",
    ipa: "/ˌɪn.ɪˈkwɒl.ə.ti/",
    partOfSpeech: "noun",
    meaning: "Sự bất bình đẳng, không công bằng về phân phối",
    basicEquivalent: "unfairness (Band 5)",
    synonyms: ["disparity", "imbalance", "disproportion"],
    collocations: ["income inequality", "reduce social inequality", "disparity and inequality"],
    modelSentence: "Persistent economic inequality directly shapes how families allocate income to fundamental necessities.",
    vietnameseSentence: "Sự bất bình đẳng kinh tế kéo dài ảnh hưởng trực tiếp đến cách các gia đình phân bổ thu nhập cho các nhu cầu thiết yếu."
  },
  "account for": {
    word: "account for",
    ipa: "/əˈkaʊnt fɔːr/",
    partOfSpeech: "verb",
    meaning: "Chiếm tỉ lệ bao nhiêu % (trong biểu đồ, tổng thể)",
    basicEquivalent: "make up / be (Band 5)",
    synonyms: ["constitute", "represent", "comprise", "make up"],
    collocations: ["account for the lion's share", "account for precisely 38%", "account for a negligible portion"],
    modelSentence: "Housing costs accounted for more than a third of cumulative household spending in Country A.",
    vietnameseSentence: "Chi phí nhà ở chiếm hơn một phần ba tổng chi tiêu hộ gia đình tại Country A."
  },
  "make up": {
    word: "make up",
    ipa: "/meɪk ʌp/",
    partOfSpeech: "verb",
    meaning: "Tạo thành, chiếm phần trăm cơ cấu",
    basicEquivalent: "form / consist of (Band 5)",
    synonyms: ["constitute", "account for", "comprise"],
    collocations: ["make up a significant portion", "make up nearly 30%", "make up the remainder"],
    modelSentence: "Educational fees made up the second largest budgetary component in four of the evaluated countries.",
    vietnameseSentence: "Học phí giáo dục tạo thành thành phần ngân sách lớn thứ hai ở bốn trong số các quốc gia được đánh giá."
  },
  "represent": {
    word: "represent",
    ipa: "/ˌrep.rɪˈzent/",
    partOfSpeech: "verb",
    meaning: "Đại diện cho, chiếm tỉ lệ cụ thể trong tổng thể",
    basicEquivalent: "stand for / show (Band 5)",
    synonyms: ["constitute", "embody", "account for", "stand at"],
    collocations: ["represent the smallest share", "represent roughly a quarter", "represent a dominant figure"],
    modelSentence: "Recreational activities represented merely six percent of the overall budget in Country E.",
    vietnameseSentence: "Các hoạt động giải trí chỉ đại diện vỏn vẹn 6% trong toàn bộ ngân sách tại Country E."
  },
  "comprise": {
    word: "comprise",
    ipa: "/kəmˈpraɪz/",
    partOfSpeech: "verb",
    meaning: "Bao gồm, cấu thành nên một tổng thể",
    basicEquivalent: "consist of / include (Band 5)",
    synonyms: ["constitute", "encompass", "account for", "contain"],
    collocations: ["comprise the largest segment", "comprise three distinct categories", "be comprised of"],
    modelSentence: "Essential living expenses comprised the overwhelming majority of annual expenditures.",
    vietnameseSentence: "Các khoản chi sinh hoạt thiết yếu cấu thành phần lớn áp đảo trong tổng chi tiêu hàng năm."
  },
  "prevail": {
    word: "prevail",
    ipa: "/prɪˈveɪl/",
    partOfSpeech: "verb",
    meaning: "Chiếm ưu thế, thịnh hành hoặc lấn át các yếu tố khác",
    basicEquivalent: "be most common / win (Band 5)",
    synonyms: ["dominate", "predominate", "rule", "lead"],
    collocations: ["prevail over other categories", "prevail as the primary expenditure", "continue to prevail"],
    modelSentence: "Housing costs prevailed over both education and recreation across four out of five countries.",
    vietnameseSentence: "Chi phí nhà ở chiếm ưu thế vượt trên cả giáo dục lẫn giải trí tại 4 trên 5 quốc gia."
  },
  "command": {
    word: "command",
    ipa: "/kəˈmɑːnd/",
    partOfSpeech: "verb",
    meaning: "Nắm giữ vị trí then chốt, kiểm soát tỉ trọng lớn",
    basicEquivalent: "hold / control (Band 5)",
    synonyms: ["dominate", "lead", "occupy", "wield"],
    collocations: ["command a leading position", "command the highest percentage", "command substantial resources"],
    modelSentence: "Residential accommodation commanded the highest percentage of household funds in Country A.",
    vietnameseSentence: "Chỗ ở dân cư nắm giữ tỉ lệ phần trăm cao nhất trong quỹ tài chính hộ gia đình ở Country A."
  },
  "outlay": {
    word: "outlay",
    ipa: "/ˈaʊt.leɪ/",
    partOfSpeech: "noun",
    meaning: "Khoản tiền chi ra ban đầu hoặc tổng kinh phí đầu tư",
    basicEquivalent: "spending / money paid (Band 5)",
    synonyms: ["expenditure", "spending", "disbursement", "investment"],
    collocations: ["financial outlay", "capital outlay for housing", "annual outlay"],
    modelSentence: "The financial outlay allocated to schooling in Country E exceeded all other recorded parameters.",
    vietnameseSentence: "Khoản kinh phí chi trả dành cho học tập ở Country E đã vượt qua tất cả các thông số được ghi nhận khác."
  },
  "disbursement": {
    word: "disbursement",
    ipa: "/dɪsˈbɜːs.mənt/",
    partOfSpeech: "noun",
    meaning: "Sự giải ngân, khoản tiền được chi trả chính thức",
    basicEquivalent: "payment / paying out (Band 5)",
    synonyms: ["expenditure", "outlay", "allocation", "spending"],
    collocations: ["budgetary disbursement", "disbursement of public funds", "regular disbursements"],
    modelSentence: "Careful monitoring of household disbursement reveals distinct regional socioeconomic priorities.",
    vietnameseSentence: "Việc theo dõi cẩn thận sự giải ngân của các hộ gia đình làm sáng tỏ những ưu tiên kinh tế xã hội đặc trưng theo vùng."
  },
  "insignificant": {
    word: "insignificant",
    ipa: "/ˌɪn.sɪɡˈnɪf.ɪ.kənt/",
    partOfSpeech: "adjective",
    meaning: "Không đáng kể, quá nhỏ bé để tạo ra ảnh hưởng lớn",
    basicEquivalent: "unimportant / tiny (Band 5)",
    synonyms: ["negligible", "marginal", "trivial", "minor"],
    collocations: ["an insignificant proportion", "insignificant percentage", "virtually insignificant"],
    modelSentence: "At barely six percent, leisure was an insignificant expenditure item for families in Country E.",
    vietnameseSentence: "Chỉ vỏn vẹn 6%, giải trí là một mục chi tiêu không đáng kể đối với các gia đình ở Country E."
  },
  "marginal": {
    word: "marginal",
    ipa: "/ˈmɑː.dʒɪ.nəl/",
    partOfSpeech: "adjective",
    meaning: "Rất nhỏ, nằm bên lề, có tỉ trọng tối thiểu",
    basicEquivalent: "small / slight (Band 5)",
    synonyms: ["negligible", "minimal", "slight", "minor"],
    collocations: ["marginal difference", "marginal percentage of budget", "marginal increase"],
    modelSentence: "The data shows only marginal differences in recreational spending between Country C and Country B.",
    vietnameseSentence: "Dữ liệu cho thấy chỉ có những khác biệt rất nhỏ về chi tiêu giải trí giữa Country C và Country B."
  },
  "minimal": {
    word: "minimal",
    ipa: "/ˈmɪn.ɪ.məl/",
    partOfSpeech: "adjective",
    meaning: "Tối thiểu, ở mức thấp nhất có thể",
    basicEquivalent: "smallest (Band 5)",
    synonyms: ["negligible", "scant", "nominal", "modest"],
    collocations: ["minimal allocation", "keep costs minimal", "minimal impact"],
    modelSentence: "Recreation absorbed a minimal proportion of total household revenue throughout the entire period.",
    vietnameseSentence: "Giải trí chỉ chiếm một tỉ lệ tối thiểu trong tổng thu nhập hộ gia đình trong toàn bộ giai đoạn."
  },
  "outstrip": {
    word: "outstrip",
    ipa: "/aʊtˈstrɪp/",
    partOfSpeech: "verb",
    meaning: "Bỏ xa, vượt trội hơn hẳn về tốc độ hoặc quy mô",
    basicEquivalent: "go faster than / beat (Band 5)",
    synonyms: ["surpass", "exceed", "eclipse", "outperform"],
    collocations: ["outstrip inflation", "outstrip spending on leisure", "demand outstrips supply"],
    modelSentence: "Education expenditure in Country E easily outstripped spending on residential accommodation.",
    vietnameseSentence: "Chi tiêu giáo dục ở Country E đã dễ dàng bỏ xa chi tiêu cho chỗ ở cư trú."
  },
  "eclipse": {
    word: "eclipse",
    ipa: "/ɪˈklɪps/",
    partOfSpeech: "verb",
    meaning: "Lấn át, che mờ, làm lu mờ thứ khác do quy mô vượt trội",
    basicEquivalent: "overshadow / beat completely (Band 5)",
    synonyms: ["surpass", "outshine", "overshadow", "dominate"],
    collocations: ["eclipse all competitors", "eclipse other budget categories", "completely eclipsed by"],
    modelSentence: "Housing costs effectively eclipsed every other item on the balance sheet for families in Country A.",
    vietnameseSentence: "Chi phí nhà ở đã lấn át hoàn toàn mọi mục khác trong bảng cân đối của các gia đình ở Country A."
  },
  "alleviate": {
    word: "alleviate",
    ipa: "/əˈliː.vi.eɪt/",
    partOfSpeech: "verb",
    meaning: "Làm nhẹ bớt nỗi đau, giảm bớt áp lực hoặc khó khăn",
    basicEquivalent: "ease / make less bad (Band 5)",
    synonyms: ["mitigate", "lessen", "relieve", "ease"],
    collocations: ["alleviate poverty", "alleviate financial hardship", "alleviate traffic congestion"],
    modelSentence: "Targeted educational grants help alleviate the acute financial strain faced by low-income students.",
    vietnameseSentence: "Các khoản trợ cấp giáo dục có mục tiêu giúp làm giảm bớt gánh nặng tài chính gay gắt mà sinh viên thu nhập thấp phải đối mặt."
  },
  "aggravate": {
    word: "aggravate",
    ipa: "/ˈæɡ.rə.veɪt/",
    partOfSpeech: "verb",
    meaning: "Làm trầm trọng thêm, khiến tình hình thêm tồi tệ",
    basicEquivalent: "make worse (Band 5)",
    synonyms: ["exacerbate", "worsen", "compound", "intensify"],
    collocations: ["aggravate the housing crisis", "aggravate social tensions", "further aggravate"],
    modelSentence: "Skyrocketing property prices further aggravated the economic hardship borne by young citizens.",
    vietnameseSentence: "Giá bất động sản tăng phi mã đã làm trầm trọng thêm những khó khăn kinh tế mà giới trẻ phải gánh chịu."
  },
  "pervasive": {
    word: "pervasive",
    ipa: "/pəˈveɪ.sɪv/",
    partOfSpeech: "adjective",
    meaning: "Lan tỏa rộng khắp, thâm nhập vào mọi khía cạnh đời sống",
    basicEquivalent: "spreading everywhere (Band 5)",
    synonyms: ["prevalent", "ubiquitous", "omnipresent", "rampant"],
    collocations: ["pervasive influence", "pervasive problem", "pervasive economic pressure"],
    modelSentence: "Escalating living costs have exerted a pervasive impact on household spending patterns globally.",
    vietnameseSentence: "Chi phí sinh hoạt leo thang đã gây ra tác động lan tỏa rộng khắp lên các mô hình chi tiêu của hộ gia đình trên toàn cầu."
  },
  "ubiquitous": {
    word: "ubiquitous",
    ipa: "/juːˈbɪk.wɪ.təs/",
    partOfSpeech: "adjective",
    meaning: "Có mặt ở khắp nơi, phổ biến ở mọi ngóc ngách",
    basicEquivalent: "everywhere (Band 5)",
    synonyms: ["prevalent", "omnipresent", "pervasive", "widespread"],
    collocations: ["ubiquitous presence", "become ubiquitous", "ubiquitous mobile devices"],
    modelSentence: "Smartphones have become a ubiquitous facet of everyday life across modern society.",
    vietnameseSentence: "Điện thoại thông minh đã trở thành một khía cạnh phổ biến ở khắp nơi trong đời sống thường nhật của xã hội hiện đại."
  },
  "imperative": {
    word: "imperative",
    ipa: "/ɪmˈper.ə.tɪv/",
    partOfSpeech: "adjective",
    meaning: "Cực kỳ cấp bách, mang tính mệnh lệnh bắt buộc phải thực hiện",
    basicEquivalent: "very urgent / must-do (Band 5)",
    synonyms: ["vital", "crucial", "paramount", "indispensable", "essential"],
    collocations: ["an absolute imperative", "imperative to address", "moral imperative"],
    modelSentence: "It is an absolute imperative that policymakers subsidize higher education for disadvantaged youth.",
    vietnameseSentence: "Một điều tối quan trọng và cấp bách là các nhà hoạch định chính sách phải trợ cấp giáo dục đại học cho thanh niên có hoàn cảnh khó khăn."
  },
  "cultivate": {
    word: "cultivate",
    ipa: "/ˈkʌl.tɪ.veɪt/",
    partOfSpeech: "verb",
    meaning: "Nuôi dưỡng, trau dồi và phát triển một phẩm chất hay kỹ năng",
    basicEquivalent: "develop / grow (Band 5)",
    synonyms: ["foster", "nurture", "encourage", "promote"],
    collocations: ["cultivate critical thinking", "cultivate talent", "cultivate a reading habit"],
    modelSentence: "Educational institutions must actively cultivate analytical reasoning and collaborative teamwork.",
    vietnameseSentence: "Các cơ sở giáo dục phải chủ động trau dồi khả năng tư duy phản biện và làm việc nhóm gắn kết."
  },
  "plummet": {
    word: "plummet",
    ipa: "/ˈplʌm.ɪt/",
    partOfSpeech: "verb",
    meaning: "Lao dốc thẳng đứng, sụt giảm nhanh và đột ngột",
    basicEquivalent: "drop very quickly (Band 5)",
    synonyms: ["plummet", "slump", "nosedive", "tumble"],
    collocations: ["plummet sharply", "plummet to an all-time low", "temperatures plummeted"],
    modelSentence: "Expenditure on recreation plummeted to a historic low of barely six percent in Country E.",
    vietnameseSentence: "Chi tiêu cho giải trí đã lao dốc xuống mức thấp kỷ lục chỉ vỏn vẹn 6% ở Country E."
  },
  "skyrocket": {
    word: "skyrocket",
    ipa: "/ˈskaɪˌrɒk.ɪt/",
    partOfSpeech: "verb",
    meaning: "Tăng vọt lên trời, tăng với tốc độ chóng mặt",
    basicEquivalent: "go up very high and fast (Band 5)",
    synonyms: ["soar", "surge", "rocket", "escalate"],
    collocations: ["prices skyrocket", "costs have skyrocketed", "tuition fees skyrocketed"],
    modelSentence: "Tuition expenses have skyrocketed over recent years, exerting immense pressure on household income.",
    vietnameseSentence: "Chi phí học phí đã tăng vọt trong những năm gần đây, gây áp lực to lớn lên thu nhập của các hộ gia đình."
  }
};

// Build fast lookup cache from vocabularies.json databank
const DATABANK_WORD_MAP = new Map();
if (Array.isArray(vocabulariesData)) {
  for (const v of vocabulariesData) {
    if (v.word) {
      DATABANK_WORD_MAP.set(v.word.toLowerCase().trim(), v);
    }
  }
}

/**
 * Tra cứu hoặc khởi tạo một từ vựng hoàn chỉnh từ từ đồng nghĩa được click.
 * Đảm bảo 100% từ đồng nghĩa đều trả về object từ vựng có đủ:
 * id, word, ipa, partOfSpeech, meaning, collocations, modelSentence, vietnameseSentence,
 * vietnameseQuiz, sentencePractice (kèm Band upgrades 6.5-8.5), paragraphPractice (kèm PEEL paragraph).
 * 
 * @param {string} synonymWord - Từ đồng nghĩa được click (ví dụ: 'earmark')
 * @param {object} parentVocab - Từ vựng gốc đang hiển thị (ví dụ: 'allocate')
 * @param {string} topicName - Tên chủ đề đang mở
 * @returns {object} Object từ vựng hoàn chỉnh đã qua enrichVocabulary
 */
export function getSynonymVocab(synonymWord, parentVocab = {}, topicName = "IELTS Writing") {
  if (!synonymWord) return null;
  const cleanWord = synonymWord.trim();
  const lowerWord = cleanWord.toLowerCase();

  // 1. Kiểm tra trong Curated Synonyms Dictionary trước
  if (CURATED_SYNONYMS_DICTIONARY[lowerWord]) {
    const curated = CURATED_SYNONYMS_DICTIONARY[lowerWord];
    return enrichVocabulary({
      id: `syn-${lowerWord.replace(/\s+/g, '-')}`,
      word: curated.word,
      ipa: curated.ipa,
      partOfSpeech: curated.partOfSpeech,
      meaning: curated.meaning,
      basicEquivalent: curated.basicEquivalent,
      synonyms: curated.synonyms,
      collocations: curated.collocations,
      modelSentence: curated.modelSentence,
      vietnameseSentence: curated.vietnameseSentence,
      isFromSynonymBank: true,
      parentWord: parentVocab.word || ""
    }, topicName);
  }

  // 2. Kiểm tra trong Databank vocabularies.json
  if (DATABANK_WORD_MAP.has(lowerWord)) {
    const raw = DATABANK_WORD_MAP.get(lowerWord);
    const m = (raw.meaning || '').toLowerCase();
    if (!m.includes('thuật ngữ') && !m.includes('khái niệm giáo dục')) {
      return enrichVocabulary({
        ...raw,
        id: raw.id || `syn-db-${lowerWord.replace(/\s+/g, '-')}`,
        modelSentence: raw.exampleSentence || raw.modelSentence || "",
        vietnameseSentence: raw.vietnameseSentence || raw.meaning || "",
        isFromSynonymBank: true,
        parentWord: parentVocab.word || ""
      }, topicName);
    }
  }

  // 3. Fallback Dynamic Generator: Tạo từ vựng học thuật dựa trên từ vựng gốc
  const pos = parentVocab.partOfSpeech || inferPartOfSpeech(cleanWord);
  const ipa = inferIPA(cleanWord);
  const meaning = parentVocab.meaning 
    ? `${parentVocab.meaning} (sắc thái đồng nghĩa với "${parentVocab.word || cleanWord}")`
    : `Hiểu và áp dụng từ đồng nghĩa "${cleanWord}" chuẩn Band 7.5+`;
  
  const basicEq = parentVocab.basicEquivalent || "Band 5 - 6 equivalent";
  
  // Tạo câu mẫu chuẩn IELTS
  const modelSentence = generateModelSentenceForSynonym(cleanWord, pos, parentVocab);
  const vietnameseSentence = `Việc áp dụng từ vựng "${cleanWord}" một cách chính xác giúp bài viết IELTS diễn đạt chuẩn xác và đạt điểm Lexical Resource cao.`;

  const siblings = (parentVocab.synonyms || [])
    .filter(s => s.toLowerCase() !== lowerWord);
  if (parentVocab.word) {
    siblings.unshift(parentVocab.word);
  }

  const generatedItem = {
    id: `syn-gen-${lowerWord.replace(/\s+/g, '-')}`,
    word: cleanWord,
    ipa: ipa,
    partOfSpeech: pos,
    meaning: meaning,
    basicEquivalent: basicEq,
    synonyms: siblings.length > 0 ? siblings : ["parallel term"],
    collocations: [
      `${cleanWord} effectively`,
      `crucial to ${cleanWord}`,
      `significant ${cleanWord}`
    ],
    modelSentence: modelSentence,
    vietnameseSentence: vietnameseSentence,
    isFromSynonymBank: true,
    parentWord: parentVocab.word || ""
  };

  return enrichVocabulary(generatedItem, topicName);
}

/**
 * Dự đoán sơ bộ từ loại nếu không có sẵn
 */
function inferPartOfSpeech(word) {
  const w = word.toLowerCase();
  if (w.endsWith('ly')) return 'adverb';
  if (w.endsWith('tion') || w.endsWith('ment') || w.endsWith('ity') || w.endsWith('ness') || w.endsWith('ance') || w.endsWith('ence')) return 'noun';
  if (w.endsWith('able') || w.endsWith('ible') || w.endsWith('al') || w.endsWith('ive') || w.endsWith('ous') || w.endsWith('ic')) return 'adjective';
  if (w.endsWith('ize') || w.endsWith('ise') || w.endsWith('ate') || w.endsWith('ify')) return 'verb';
  return 'verb / noun';
}

/**
 * Ước lượng phiên âm sơ bộ cho từ chưa có IPA
 */
function inferIPA(word) {
  return `/${word.toLowerCase()}/`;
}

/**
 * Sinh câu IELTS mẫu tự nhiên tương ứng với từ đồng nghĩa
 */
function generateModelSentenceForSynonym(word, pos, parentVocab) {
  if (parentVocab.modelSentence && parentVocab.word) {
    const parentRegex = new RegExp(`\\b${parentVocab.word}\\b`, 'i');
    if (parentRegex.test(parentVocab.modelSentence)) {
      return parentVocab.modelSentence.replace(parentRegex, word);
    }
  }

  if (pos.includes('verb')) {
    return `Authorities and relevant stakeholders must actively ${word} comprehensive strategies to address modern challenges.`;
  } else if (pos.includes('noun')) {
    return `The continuous emergence of ${word} represents a pivotal consideration in contemporary socioeconomic discourse.`;
  } else if (pos.includes('adjective')) {
    return `Adopting an ${word} approach remains an indispensable prerequisite for sustainable institutional development.`;
  } else if (pos.includes('adverb')) {
    return `Statistical trends have shifted ${word} across key demographic sectors in recent years.`;
  }
  return `Employing the term "${word}" enriches academic discourse and enhances lexical cohesion in formal writing.`;
}

/**
 * Kiểm tra xem từ vựng đã tồn tại trong danh sách hay chưa (không phân biệt hoa thường)
 */
export function findVocabInList(word, list = []) {
  if (!word || !list || list.length === 0) return null;
  const q = word.toLowerCase().trim();
  return list.find(v => v.word && v.word.toLowerCase().trim() === q) || null;
}
