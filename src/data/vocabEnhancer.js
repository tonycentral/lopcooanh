// Helper to enrich vocabulary with 3-part practice data (Comprehension quiz, Single sentence translation, Paragraph translation with cohesion)

const DEFAULT_LINKING_SUGGESTIONS = [
  "Consequently,", 
  "Therefore,", 
  "As a direct consequence,", 
  "In stark contrast,", 
  "Owing to this,"
];

/**
 * Generates Band-appropriate upgrades (6.5, 7.0, 7.5, 8.0, 8.5) strictly grounded
 * on the exact semantic meaning and context of the given Vietnamese/Model sentence.
 */
export function generateBandUpgrades(modelSentence, vocab = {}) {
  if (!modelSentence) return {};

  const clean = modelSentence.trim().replace(/\.+$/, '');

  // Band 7.5: The curated standard model sentence (gold-standard translation)
  const band75 = `${clean}.`;

  // Band 7.0: A clean, standard formal academic translation
  let band70 = clean;
  if (/^Governments?\s+must\s+/i.test(band70)) {
    band70 = band70.replace(/^Governments?\s+must\s+/i, 'Governments should ');
  } else if (/^Authorities\s+must\s+/i.test(band70)) {
    band70 = band70.replace(/^Authorities\s+must\s+/i, 'Authorities should ');
  } else if (/^Schools?\s+must\s+/i.test(band70)) {
    band70 = band70.replace(/^Schools?\s+must\s+/i, 'Schools should ');
  } else if (/^Teachers?\s+must\s+/i.test(band70)) {
    band70 = band70.replace(/^Teachers?\s+must\s+/i, 'Teachers should ');
  }
  band70 = `${band70}.`;

  // Band 6.5: Direct, clear foundational phrasing with simpler coordination
  let band65 = clean;
  if (/\barticulate complex arguments persuasively\b/i.test(band65)) {
    band65 = band65.replace(/\barticulate complex arguments persuasively\b/i, 'present complex arguments persuasively');
  } else if (/\b(detrimental effects|adverse effects)\b/i.test(band65)) {
    band65 = band65.replace(/\b(detrimental effects|adverse effects)\b/gi, 'negative effects');
  } else if (/\b(vital|imperative|paramount)\b/i.test(band65)) {
    band65 = band65.replace(/\b(vital|imperative|paramount)\b/gi, 'very important');
  } else if (/^Governments?\s+(must|should)\s+/i.test(band65)) {
    band65 = band65.replace(/^Governments?\s+(must|should)\s+/i, 'It is important for governments to ');
  }
  band65 = `${band65}.`;

  // Band 8.0: Complex grammatical elevation (Participle clause / Subjunctive / Gerund framing)
  let band80 = clean;
  if (/\b(and help|and helps|and enables?|and allows?)\b/i.test(clean)) {
    band80 = clean.replace(/\b(and help|and helps|and enables?|and allows?)\s+([a-zA-Z]+)\s+to\s+/i, ', thereby enabling $2 to ')
                  .replace(/\b(and help|and helps|and enables?|and allows?)\s+([a-zA-Z]+)\s+([a-z]+)\b/i, ', thereby enabling $2 to $3');
  } else if (/\band\s+(?:also\s+)?([a-z]+s|[a-z]+ed|[a-z]+)\b/i.test(clean) && !clean.includes(', thereby')) {
    const match = clean.match(/\band\s+(?:also\s+)?([a-z]+)\b/i);
    const v = match ? match[1] : null;
    if (v && !['the', 'a', 'an', 'their', 'its', 'our', 'more', 'less', 'not'].includes(v.toLowerCase())) {
      const gerund = v.endsWith('e') && !v.endsWith('ee') ? v.slice(0, -1) + 'ing' : v.endsWith('y') ? v + 'ing' : v.endsWith('ing') ? v : v + 'ing';
      band80 = clean.replace(new RegExp(`\\band\\s+(?:also\\s+)?${v}\\b`, 'i'), `, thereby ${gerund}`);
    }
  }

  if (band80 === clean) {
    if (/^Governments?\s+(must|should)\s+/i.test(clean)) {
      band80 = clean.replace(/^Governments?\s+(must|should)\s+/i, 'It is incumbent upon governments to ');
    } else if (/^(Schools?|Institutions?|Authorities|Organizations?|Teachers?)\s+(must|should)\s+/i.test(clean)) {
      band80 = clean.replace(/^(Schools?|Institutions?|Authorities|Organizations?|Teachers?)\s+(must|should)\s+/i, (m, p1) => `It is imperative that ${p1.toLowerCase()} `);
    } else if (/^While\b|^Although\b/i.test(clean)) {
      band80 = `${clean}, thereby reaffirming this fundamental principle`;
    } else if (/^[A-Z][a-z]+ing\b/.test(clean)) {
      band80 = `By actively ${clean.charAt(0).toLowerCase() + clean.slice(1)}, stakeholders can achieve more sustainable outcomes`;
    } else {
      band80 = `Evidence demonstrates that ${clean.charAt(0).toLowerCase() + clean.slice(1)}, thereby yielding substantial long-term benefits`;
    }
  }
  band80 = `${band80.replace(/\s+,/, ',')}.`;

  // Band 8.5: High academic register, nominalization, nuanced phrasing
  let band85 = clean;
  if (/^While\b|^Although\b/i.test(clean)) {
    band85 = `Notwithstanding prevailing conventions, ${clean.charAt(0).toLowerCase() + clean.slice(1)}, an outcome that serves as an indispensable prerequisite for systemic progress`;
  } else if (/^It is an absolute imperative that\b/i.test(clean)) {
    band85 = clean.replace(/^It is an absolute imperative that\b/i, 'The implementation of decisive policies has become an absolute imperative to ensure that');
  } else if (clean.toLowerCase().includes('classroom debates')) {
    band85 = 'Engaging rigorously in classroom debates serves to foster critical thinking, thereby empowering students to articulate complex arguments with formidable persuasive clarity';
  } else if (/^Governments?\s+(must|should)\s+/i.test(clean)) {
    band85 = clean.replace(/^Governments?\s+(must|should)\s+(\w+)\s+/i, (m, p1, vb) => `Enacting decisive institutional reforms to ${vb} `) + ' has become an imperative of paramount importance';
  } else if (/^[A-Z][a-z]+ing\b/.test(clean)) {
    band85 = `The strategic commitment to ${clean.charAt(0).toLowerCase() + clean.slice(1)} serves as an enduring cornerstone for institutional excellence`;
  } else {
    band85 = `Empirical academic discourse confirms that ${clean.charAt(0).toLowerCase() + clean.slice(1)}, thereby establishing a vital benchmark for enduring progress`;
  }
  band85 = `${band85.replace(/\s+,/, ',')}.`;

  return {
    "6.5": band65.replace(/\.+$/, '.'),
    "7.0": band70.replace(/\.+$/, '.'),
    "7.5": band75.replace(/\.+$/, '.'),
    "8.0": band80.replace(/\.+$/, '.'),
    "8.5": band85.replace(/\.+$/, '.')
  };
}

/**
 * Helper to build the core sentence containing the target word
 * respecting its actual part of speech and pre-existing model sentence.
 */
function getCoreSentence(vocab) {
  const word = vocab.word || "";
  const pos = (vocab.partOfSpeech || "noun").toLowerCase();
  const meaning = (vocab.meaning || "").trim();

  // If already curated with modelSentence / exampleSentence & vietnameseSentence, use them directly!
  const existingEn = vocab.modelSentence || vocab.exampleSentence;
  if (existingEn && vocab.vietnameseSentence) {
    return {
      en: existingEn.trim().replace(/\.+$/, '') + '.',
      vn: vocab.vietnameseSentence.trim().replace(/\.+$/, '') + '.'
    };
  }

  if (existingEn) {
    const en = existingEn.trim().replace(/\.+$/, '') + '.';
    let vn = "";
    if (pos.includes('noun')) {
      vn = `Các chuyên gia ghi nhận rằng ${meaning ? meaning.toLowerCase() : word} đóng vai trò quan trọng trong việc thúc đẩy sự phát triển chung.`;
    } else if (pos.includes('verb')) {
      vn = `Các bên liên quan cần tích cực phối hợp để ${meaning ? meaning.toLowerCase() : word} các thách thức hiện hữu một cách hiệu quả.`;
    } else if (pos.includes('adj')) {
      vn = `Yếu tố mang tính ${meaning ? meaning.toLowerCase() : word} này có ảnh hưởng sâu sắc đến sự thành công của các kế hoạch dài hạn.`;
    } else {
      vn = `Quá trình này diễn ra một cách ${meaning ? meaning.toLowerCase() : word}, tạo tiền đề cho những bước tiến bền vững tiếp theo.`;
    }
    return { en, vn };
  }

  // Grammatically sound fallback respecting Part of Speech
  let en = "";
  let vn = "";
  if (pos.includes('noun')) {
    vn = `Các nghiên cứu chỉ ra rằng ${meaning.toLowerCase()} đóng vai trò thiết yếu trong việc định hình kết quả dài hạn.`;
    en = `Research indicates that ${word} plays an essential role in determining long-term outcomes.`;
  } else if (pos.includes('verb')) {
    vn = `Các nhà hoạch định chính sách cần chủ động hành động để ${meaning.toLowerCase()} các thách thức hiện nay.`;
    en = `Policy makers must take proactive steps to ${word} contemporary challenges effectively.`;
  } else if (pos.includes('adj')) {
    vn = `Cách tiếp cận mang tính ${meaning.toLowerCase()} này mang lại những chuyển biến tích cực cho toàn hệ thống.`;
    en = `This ${word} approach delivers positive transformations across the broader system.`;
  } else {
    vn = `Các biện pháp cần được thực hiện một cách ${meaning.toLowerCase()} nhằm tối ưu hóa hiệu quả thực thi.`;
    en = `Measures should be executed ${word} in order to optimize operational outcomes.`;
  }

  return { en, vn };
}

// BỘ DỮ LIỆU CÂU LUYỆN TẬP ĐA DẠNG THEO TỪNG SESSION (Curated Sentence Variants)
const CURATED_SENTENCE_VARIANTS = {
  "disproportionately": [
    {
      domain: "📊 Dữ liệu Biểu đồ (Task 1)",
      vietnamesePrompt: "Chi tiêu cho giải trí chiếm một phần nhỏ không tương xứng trong tổng chi tiêu tại các quốc gia đang phát triển.",
      modelTranslation: "Recreational expenses accounted for a disproportionately small fraction of expenditure in developing nations."
    },
    {
      domain: "💼 Kinh tế & Thu nhập",
      vietnamesePrompt: "Các hộ gia đình thu nhập thấp chịu ảnh hưởng nặng nề không tương xứng bởi sự leo thang của giá nhà ở đô thị.",
      modelTranslation: "Low-income households are disproportionately impacted by the sharp escalation in urban housing costs."
    },
    {
      domain: "🎓 Giáo dục & Cơ hội",
      vietnamesePrompt: "Học sinh ở vùng nông thôn chịu thiệt thòi không tương xứng do hạn chế trong việc tiếp cận các nền tảng học tập số.",
      modelTranslation: "Students in rural areas remain disproportionately disadvantaged due to restricted access to digital educational platforms."
    },
    {
      domain: "🌱 Môi trường & Khí hậu",
      vietnamesePrompt: "Các quốc gia ven biển dễ bị tổn thương phải gánh chịu hậu quả nặng nề không tương xứng từ hiện tượng biến đổi khí hậu toàn cầu.",
      modelTranslation: "Vulnerable coastal nations bear a disproportionately severe burden from global climate change."
    },
    {
      domain: "🏥 Y tế & Sức khỏe",
      vietnamesePrompt: "Người cao tuổi đối mặt với nguy cơ biến chứng sức khỏe cao hơn một cách không tương xứng trong các đợt bùng phát dịch bệnh.",
      modelTranslation: "Elderly demographics face disproportionately elevated health risks during acute epidemic outbreaks."
    }
  ],
  "allocate": [
    {
      domain: "📊 Dữ liệu Biểu đồ (Task 1)",
      vietnamesePrompt: "Các hộ gia đình ở Country A phân bổ gần một phần ba tổng thu nhập cho học phí giáo dục.",
      modelTranslation: "Households in Country A allocated nearly a third of their total earnings to academic tuition."
    },
    {
      domain: "🏛️ Chính sách Công",
      vietnamesePrompt: "Chính phủ cần phân bổ một nguồn ngân sách lớn hơn để nâng cấp hệ thống hạ tầng giao thông công cộng.",
      modelTranslation: "Governments must allocate substantial budgetary resources to upgrading public transit infrastructure."
    },
    {
      domain: "🌱 Môi trường & Năng lượng",
      vietnamesePrompt: "Các thành phố lớn đang phân bổ thêm nhiều tài nguyên để nghiên cứu và triển khai các giải pháp năng lượng sạch.",
      modelTranslation: "Major cities are allocating substantial resources to research and deploy clean energy solutions."
    },
    {
      domain: "🎓 Giáo dục & Đào tạo",
      vietnamesePrompt: "Các trường đại học nên phân bổ kinh phí nghiên cứu đồng đều hơn giữa các ngành khoa học tự nhiên và khoa học xã hội.",
      modelTranslation: "Universities ought to allocate research funding more evenly between natural and social sciences."
    }
  ],
  "disparity": [
    {
      domain: "📊 Dữ liệu Biểu đồ (Task 1)",
      vietnamesePrompt: "Một khoảng cách chênh lệch đáng kể có thể quan sát được giữa cư dân thủ đô và các gia đình nông thôn về chi phí giáo dục.",
      modelTranslation: "A substantial disparity is observable between capital city dwellers and rural families regarding education outlay."
    },
    {
      domain: "👥 Xã hội & Thu nhập",
      vietnamesePrompt: "Khoảng cách chênh lệch giàu nghèo ngày càng gia tăng đang đe dọa sự gắn kết xã hội tại nhiều quốc gia.",
      modelTranslation: "The widening wealth disparity poses an acute threat to social cohesion across many nations."
    },
    {
      domain: "🎓 Giáo dục",
      vietnamesePrompt: "Sự chênh lệch lớn về điều kiện cơ sở vật chất giữa trường công và trường tư đòi hỏi sự hỗ trợ từ chính quyền.",
      modelTranslation: "The pronounced disparity in physical facilities between public and private institutions necessitates state intervention."
    },
    {
      domain: "🏥 Y tế & Chăm sóc sức khỏe",
      vietnamesePrompt: "Việc thu hẹp sự chênh lệch trong tiếp cận dịch vụ y tế kỹ thuật cao là mục tiêu hàng đầu của ngành y.",
      modelTranslation: "Narrowing the disparity in access to advanced medical services represents a primary priority for healthcare authorities."
    }
  ],
  "constitute": [
    {
      domain: "📊 Dữ liệu Biểu đồ (Task 1)",
      vietnamesePrompt: "Chi phí nhà ở cấu thành danh mục chi tiêu đơn lẻ lớn nhất ở Country A với 38%.",
      modelTranslation: "Housing costs constituted the single largest expenditure category in Country A at 38%."
    },
    {
      domain: "🌱 Môi trường Đô thị",
      vietnamesePrompt: "Khí thải từ các phương tiện giao thông cá nhân cấu thành nguồn gây ô nhiễm không khí chủ yếu tại các đô thị.",
      modelTranslation: "Emissions generated by private vehicles constitute the primary source of atmospheric pollution in metropolitan centers."
    },
    {
      domain: "💼 Kinh tế & Việc làm",
      vietnamesePrompt: "Thế hệ thanh niên năng động cấu thành lực lượng lao động nòng cốt thúc đẩy sự phát triển của nền kinh tế số.",
      modelTranslation: "Dynamic young professionals constitute the core labor force propelling the expansion of the digital economy."
    }
  ],
  "dominate": [
    {
      domain: "📊 Dữ liệu Biểu đồ (Task 1)",
      vietnamesePrompt: "Nhà ở rõ ràng chiếm ưu thế áp đảo trong phân bổ ngân sách ở 4 trên 5 quốc gia được đánh giá.",
      modelTranslation: "Housing clearly dominated the budgetary distribution across four out of the five evaluated nations."
    },
    {
      domain: "⚡ Năng lượng & Công nghiệp",
      vietnamesePrompt: "Nhiên liệu hóa thạch đã thống trị cơ cấu sản xuất điện năng trong suốt nửa thế kỷ qua.",
      modelTranslation: "Fossil fuels have dominated electricity generation across the globe throughout the past half century."
    },
    {
      domain: "🌐 Công nghệ Số",
      vietnamesePrompt: "Các nền tảng mạng xã hội đang thống trị phương thức tiếp nhận thông tin hàng ngày của giới trẻ.",
      modelTranslation: "Social media platforms increasingly dominate how younger generations consume daily news and information."
    }
  ],
  "expenditure": [
    {
      domain: "📊 Dữ liệu Biểu đồ (Task 1)",
      vietnamesePrompt: "Chi tiêu cho giải trí luôn duy trì dưới 15% ở tất cả các quốc gia được khảo sát.",
      modelTranslation: "Recreational expenditure remained beneath fifteen percent in all surveyed countries."
    },
    {
      domain: "🏛️ Chính sách Tài khóa",
      vietnamesePrompt: "Chính phủ cần giám sát chặt chẽ chi tiêu công để hạn chế lạm phát và thâm hụt ngân sách kéo dài.",
      modelTranslation: "Governments must rigorously supervise public expenditure to curb inflation and persistent fiscal deficits."
    },
    {
      domain: "💡 Đổi mới Sáng tạo",
      vietnamesePrompt: "Gia tăng chi tiêu cho hoạt động nghiên cứu và phát triển là động lực then chốt nâng cao năng lực cạnh tranh quốc gia.",
      modelTranslation: "Elevating expenditure on research and development represents an indispensable catalyst for bolstering national competitiveness."
    }
  ],
  "negligible": [
    {
      domain: "📊 Dữ liệu Biểu đồ (Task 1)",
      vietnamesePrompt: "Tại Country E, giải trí đại diện cho một tỉ lệ không đáng kể chỉ vỏn vẹn 6%.",
      modelTranslation: "In Country E, recreation represented a negligible proportion of only six percent."
    },
    {
      domain: "🌿 Giao thông Xanh",
      vietnamesePrompt: "Mức độ phát thải khí carbon từ các phương tiện chạy bằng pin là không đáng kể khi so sánh với xe chạy xăng.",
      modelTranslation: "Carbon emissions produced by electric vehicles remain virtually negligible when compared to conventional petrol automobiles."
    },
    {
      domain: "📚 Đánh giá Tác động",
      vietnamesePrompt: "Khoản chi phí bổ sung này mang lại tác động không đáng kể đối với tổng ngân sách dự án ban đầu.",
      modelTranslation: "This additional expenditure exerted a negligible impact on the overall budgetary forecast of the original project."
    }
  ],
  "surpass": [
    {
      domain: "📊 Dữ liệu Biểu đồ (Task 1)",
      vietnamesePrompt: "Ở Country E, đầu tư cho giáo dục là trường hợp duy nhất vượt qua chi phí nhà ở 8 điểm phần trăm.",
      modelTranslation: "In Country E, educational investment uniquely surpassed housing outlay by eight percentage points."
    },
    {
      domain: "☀️ Năng lượng Tái tạo",
      vietnamesePrompt: "Sản lượng điện từ năng lượng mặt trời được dự báo sẽ sớm vượt qua nhiệt điện than trong thập kỷ tới.",
      modelTranslation: "Solar power generation is projected to surpass coal-fired electricity production over the coming decade."
    },
    {
      domain: "📈 Kinh tế Thị trường",
      vietnamesePrompt: "Doanh thu từ thương mại điện tử đã nhanh chóng vượt qua bán lẻ truyền thống tại nhiều thị trường lớn.",
      modelTranslation: "Revenues derived from electronic commerce have rapidly surpassed traditional retail operations in several mature markets."
    }
  ],
  "earmark": [
    {
      domain: "📊 Dữ liệu & Ngân sách",
      vietnamesePrompt: "Hội đồng thành phố đã đồng ý dành riêng nguồn thu đáng kể cho hạ tầng giao thông công cộng.",
      modelTranslation: "The municipal council agreed to earmark substantial revenue for public transit infrastructure."
    },
    {
      domain: "🎓 Giáo dục & Học bổng",
      vietnamesePrompt: "Bộ giáo dục dự kiến dành riêng các gói kinh phí đặc biệt để tài trợ cho các sinh viên nghèo vượt khó.",
      modelTranslation: "The ministry plans to earmark dedicated financial grants to support underprivileged students excelling academically."
    },
    {
      domain: "🌿 Bảo tồn Sinh thái",
      vietnamesePrompt: "Chính phủ cam kết dành riêng một phần tư diện tích đất rừng ngập mặn cho các khu bảo tồn sinh quyển tự nhiên.",
      modelTranslation: "Authorities committed to earmark a quarter of the mangrove territory for specialized nature conservation zones."
    }
  ],
  "mitigate": [
    {
      domain: "🌱 Môi trường & Khí hậu",
      vietnamesePrompt: "Chính phủ cần ban hành các đạo luật môi trường nghiêm ngặt để giảm nhẹ các tác động tiêu cực của biến đổi khí hậu.",
      modelTranslation: "Governments must enforce stringent environmental laws to mitigate the detrimental effects of climate change."
    },
    {
      domain: "🏙️ Quy hoạch Đô thị",
      vietnamesePrompt: "Việc mở rộng các tuyến xe điện ngầm giúp giảm nhẹ tình trạng ùn tắc giao thông nghiêm trọng vào giờ cao điểm.",
      modelTranslation: "Expanding subway networks helps mitigate severe traffic congestion during peak commuting hours."
    },
    {
      domain: "💼 Kinh tế & Rủi ro",
      vietnamesePrompt: "Các doanh nghiệp đa dạng hóa nguồn cung ứng nhằm giảm nhẹ các rủi ro tài chính do gián đoạn chuỗi cung ứng toàn cầu.",
      modelTranslation: "Enterprises diversify supply chains to mitigate financial risks triggered by global trade disruptions."
    }
  ],
  "exacerbate": [
    {
      domain: "👥 Đô thị & Nhà ở",
      vietnamesePrompt: "Sự gia tăng dân số cơ học nhanh chóng càng làm trầm trọng thêm tình trạng thiếu hụt nhà ở giá rẻ tại các đô thị.",
      modelTranslation: "Rapid demographic influx further exacerbates the acute shortage of affordable housing in metropolitan areas."
    },
    {
      domain: "🌱 Môi trường & Khí hậu",
      vietnamesePrompt: "Nạn chặt phá rừng bừa bãi làm trầm trọng thêm hiện tượng xói mòn đất và suy thoái hệ sinh thái đầu nguồn.",
      modelTranslation: "Indiscriminate deforestation exacerbates soil erosion and the ecological degradation of upstream river basins."
    },
    {
      domain: "💼 Kinh tế & Xã hội",
      vietnamesePrompt: "Tình trạng lạm phát kéo dài có nguy cơ làm trầm trọng thêm hố sâu ngăn cách giữa các tầng lớp trong xã hội.",
      modelTranslation: "Persistent inflationary pressures threaten to exacerbate the socioeconomic divide between different demographic strata."
    }
  ],
  "prevalent": [
    {
      domain: "🏥 Y tế & Lối sống",
      vietnamesePrompt: "Lối sống ít vận động đang trở nên phổ biến ở thanh thiếu niên do thói quen sử dụng thiết bị điện tử quá mức.",
      modelTranslation: "Sedentary lifestyles are increasingly prevalent among teenagers owing to excessive electronic screen engagement."
    },
    {
      domain: "💼 Việc làm & Công nghệ",
      vietnamesePrompt: "Mô hình làm việc từ xa đã trở nên phổ biến tại hầu hết các công ty công nghệ đa quốc gia sau đại dịch.",
      modelTranslation: "Remote working arrangements have become remarkably prevalent across multinational technology firms following the pandemic."
    },
    {
      domain: "👥 Văn hóa Xã hội",
      vietnamesePrompt: "Văn hóa tiêu dùng nhanh ngày càng phổ biến trong xã hội hiện đại, gây áp lực lớn lên việc xử lý rác thải.",
      modelTranslation: "Fast-consumption culture is increasingly prevalent in modern societies, exerting severe pressure on waste management systems."
    }
  ]
};

/**
 * Sinh các biến thể câu học thuật tự động cho từ vựng dựa trên từ loại và ngữ nghĩa
 */
function generateAlgorithmicVariants(word, pos, meaning, vocab) {
  const cleanMeaning = meaning ? meaning.toLowerCase() : word;
  const col = vocab.collocations?.[0] || word;

  if (pos.includes('verb')) {
    return [
      {
        domain: "🏛️ Chính sách & Quản lý",
        vn: `Các cơ quan quản lý cần chủ động ${cleanMeaning} các nguồn lực trọng yếu nhằm đối phó với những thách thức cấp bách.`,
        en: `Regulatory authorities must proactively ${word} essential resources to tackle urgent societal challenges.`
      },
      {
        domain: "👥 Kinh tế & Đời sống",
        vn: `Nhiều tổ chức phi chính phủ đang nỗ lực ${cleanMeaning} điều kiện sống bền vững cho các cộng đồng yếu thế.`,
        en: `Non-governmental organizations are actively striving to ${word} sustainable living conditions for underprivileged communities.`
      },
      {
        domain: "🌱 Môi trường & Đổi mới",
        vn: `Các chuyên gia khuyến nghị các thành phố hiện đại nên ${cleanMeaning} các giải pháp xanh để hạn chế khí thải.`,
        en: `Specialists urge contemporary municipalities to ${word} eco-friendly initiatives to curb escalating carbon footprints.`
      }
    ];
  } else if (pos.includes('noun')) {
    return [
      {
        domain: "🏛️ Thể chế & Quản trị",
        vn: `Việc gia tăng ${cleanMeaning} đòi hỏi chính quyền phải ban hành các quy chế điều tiết kịp thời và minh bạch.`,
        en: `The notable escalation in ${word} necessitates timely and transparent regulatory frameworks enacted by governing bodies.`
      },
      {
        domain: "👥 Xã hội & Phát triển",
        vn: `Sự biến động của ${cleanMeaning} có tác động trực tiếp và lâu dài đến chất lượng cuộc sống của đa số người dân.`,
        en: `Fluctuations in ${word} exert a direct and enduring impact on the overall quality of life for the general populace.`
      },
      {
        domain: "💡 Khoa học & Công nghệ",
        vn: `Những đột phá khoa học đã tạo ra bước tiến vượt bậc liên quan đến ${cleanMeaning} trong thời đại số hóa.`,
        en: `Scientific breakthroughs have established pioneering progress concerning ${word} throughout the modern digital era.`
      }
    ];
  } else if (pos.includes('adj')) {
    return [
      {
        domain: "🏛️ Chính sách Công",
        vn: `Việc áp dụng một chiến lược mang tính ${cleanMeaning} đóng vai trò then chốt trong việc tối ưu hóa quản lý nhà nước.`,
        en: `Implementing a thoroughly ${word} strategy plays an indispensable role in optimizing public administrative efficacy.`
      },
      {
        domain: "👥 Giáo dục & Đào tạo",
        vn: `Kỹ năng tư duy phản biện là một phẩm chất ${cleanMeaning} giúp sinh viên tự tin thích ứng trong môi trường quốc tế.`,
        en: `Critical thinking constitutes an ${word} asset enabling students to adapt confidently within international professional landscapes.`
      },
      {
        domain: "🌱 Phát triển Bền vững",
        vn: `Cách tiếp cận mang tính ${cleanMeaning} đối với quy hoạch đô thị sẽ bảo vệ môi trường sống cho các thế hệ tương lai.`,
        en: `Adopting an ${word} stance toward urban planning safeguards vital living environments for future generations.`
      }
    ];
  } else {
    // Adverbs / Other
    return [
      {
        domain: "💼 Kinh tế & Xã hội",
        vn: `Các nhóm lao động thu nhập thấp chịu tác động một cách ${cleanMeaning} bởi tình trạng gia tăng chi phí sinh hoạt.`,
        en: `Low-income demographics are ${word} impacted by the steep escalation in essential living expenses.`
      },
      {
        domain: "🏛️ Chính sách & Quy hoạch",
        vn: `Nguồn vốn đầu tư vào cơ sở hạ tầng vẫn đang được phân bổ một cách ${cleanMeaning} giữa các vùng miền.`,
        en: `Infrastructure investment capital remains ${word} allocated across distinct geographic territories.`
      },
      {
        domain: "🏥 Y tế & Cộng đồng",
        vn: `Các bệnh nhân lớn tuổi đối mặt với nguy cơ biến chứng cao một cách ${cleanMeaning} nếu thiếu sự chăm sóc kịp thời.`,
        en: `Elderly patients encounter a ${word} elevated risk of medical complications without prompt healthcare intervention.`
      }
    ];
  }
}

/**
 * Sinh danh sách các biến thể câu dịch đa dạng (3-5 câu) cho một từ vựng
 * Giúp mỗi session học viên gặp một câu khác nhau, không bị trùng lặp nhàm chán
 */
export function generatePracticeSentenceVariants(vocab, topicName = "IELTS Writing") {
  if (!vocab) return [];
  const word = vocab.word || "";
  const cleanWord = word.trim();
  const lowerWord = cleanWord.toLowerCase();
  const ipa = vocab.ipa || "";
  const pos = (vocab.partOfSpeech || "noun").toLowerCase();
  const meaning = (vocab.meaning || "").trim();

  // 1. Biến thể chính (Primary Variant)
  const core = getCoreSentence(vocab);
  const primaryVn = vocab.vietnameseSentence || core.vn;
  const primaryEn = vocab.modelSentence || vocab.exampleSentence || core.en;
  const primaryBandUpgrades = vocab.bandUpgrades || generateBandUpgrades(primaryEn, vocab);

  const primaryVariant = {
    id: `${cleanWord}-var-primary`,
    vietnamesePrompt: primaryVn,
    targetWord: cleanWord,
    modelTranslation: primaryEn,
    domain: topicName || "Bối cảnh Trọng tâm",
    bandUpgrades: primaryBandUpgrades,
    upgradeDetails: vocab.upgradeDetails || [
      `Từ vựng mục tiêu: "${cleanWord}" ${ipa} (${pos}) - Nghĩa: ${meaning}.`,
      vocab.collocations?.[0]
        ? `Collocation chuẩn mực: "${vocab.collocations[0]}" (Cụm từ kết hợp tự nhiên C1/C2).`
        : `Sắc thái học thuật: Chuẩn mực C1/C2 nâng cao khả năng diễn đạt học thuật chính xác.`,
      `Ngữ pháp nâng cấp: Cấu trúc câu phức chuẩn Band mục tiêu, tối ưu hóa tính mạch lạc và độ chính xác ngữ pháp.`,
      `Sắc thái học thuật: Diễn đạt trang trọng, khách quan, sát nghĩa 100% với câu tiếng Việt gốc.`
    ]
  };

  const variants = [primaryVariant];

  // 2. Curated High-Frequency Variants nếu có
  if (CURATED_SENTENCE_VARIANTS[lowerWord]) {
    CURATED_SENTENCE_VARIANTS[lowerWord].forEach((item, idx) => {
      if (item.modelTranslation.toLowerCase().trim() === primaryEn.toLowerCase().trim()) return;
      const upgrades = generateBandUpgrades(item.modelTranslation, vocab);
      variants.push({
        id: `${cleanWord}-var-curated-${idx + 1}`,
        vietnamesePrompt: item.vietnamesePrompt,
        targetWord: cleanWord,
        modelTranslation: item.modelTranslation,
        domain: item.domain || "Học thuật Mở rộng",
        bandUpgrades: upgrades,
        upgradeDetails: [
          `Từ vựng mục tiêu: "${cleanWord}" ${ipa} (${pos}) - Nghĩa: ${meaning}.`,
          `Chủ đề ngữ cảnh: ${item.domain}.`,
          `Ngữ pháp học thuật: Cấu trúc câu diễn đạt đa dạng, nâng cao tính tự nhiên và ngữ cảnh thực tế.`,
          `Độ chính xác: Đáp ứng tiêu chí Lexical Resource & Grammatical Range chuẩn Band 7.5+.`
        ]
      });
    });
  }

  // 3. Algorithmic Contextual Generator nếu chưa đủ tối thiểu 4 biến thể câu
  if (variants.length < 4) {
    const algorithmicList = generateAlgorithmicVariants(cleanWord, pos, meaning, vocab);
    for (const alt of algorithmicList) {
      if (variants.length >= 5) break;
      if (variants.some(v => v.modelTranslation.toLowerCase().includes(alt.en.slice(0, 20).toLowerCase()))) continue;
      
      const upgrades = generateBandUpgrades(alt.en, vocab);
      variants.push({
        id: `${cleanWord}-var-algo-${variants.length}`,
        vietnamesePrompt: alt.vn,
        targetWord: cleanWord,
        modelTranslation: alt.en,
        domain: alt.domain,
        bandUpgrades: upgrades,
        upgradeDetails: [
          `Từ vựng mục tiêu: "${cleanWord}" ${ipa} (${pos}) - Nghĩa: ${meaning}.`,
          `Bối cảnh ứng dụng: ${alt.domain}.`,
          `Cấu trúc học thuật: Câu phức học thuật chuẩn C1, tối ưu hóa điểm Lexical Resource.`,
          `Sắc thái trang trọng: Thích hợp cho cả IELTS Writing Task 1 và Task 2.`
        ]
      });
    }
  }

  return variants;
}

/**
 * Generates full academic paragraph (3-4 sentences PEEL/TEEL) for Paragraph Practice.
 * Strictly context-aware, topic-grounded, and part-of-speech-aware.
 */
export function generateParagraphPractice(vocab, topicName = "IELTS Writing", activeSentence = null) {
  const word = vocab.word || "";
  const ipa = vocab.ipa || "";
  const pos = vocab.partOfSpeech || "từ vựng";
  const meaning = vocab.meaning || "";
  const collocation = vocab.collocations?.[0] || word;
  const topicLower = (topicName || "").toLowerCase();
  const wordFamilyLower = (vocab.wordFamily || "").toLowerCase();

  // 1. Get the authentic, grammatically correct core sentence containing the target word
  let exEN = "";
  let exVN = "";
  if (activeSentence && activeSentence.modelTranslation) {
    exEN = activeSentence.modelTranslation.trim().replace(/\.+$/, '') + '.';
    exVN = (activeSentence.vietnamesePrompt || vocab.vietnameseSentence || "").trim().replace(/\.+$/, '') + '.';
  } else {
    const core = getCoreSentence(vocab);
    exEN = core.en;
    exVN = core.vn;
  }

  // 2. Detect Context & Domain
  const isTask1 = topicLower.includes("chart") || 
                  topicLower.includes("graph") || 
                  topicLower.includes("table") || 
                  topicLower.includes("pie") || 
                  topicLower.includes("bar") || 
                  topicLower.includes("line") || 
                  topicLower.includes("task 1") || 
                  topicLower.includes("task1") || 
                  wordFamilyLower.includes("task 1") || 
                  wordFamilyLower.includes("task1") ||
                  topicLower.includes("export") ||
                  topicLower.includes("spending") ||
                  topicLower.includes("consumption") ||
                  topicLower.includes("proportion");

  let tsVN = "";
  let tsEN = "";
  let evVN = "";
  let csVN = "";
  let evEN = "";
  let csEN = "";

  if (isTask1) {
    // Task 1 / Data / Trade / Commodity / Statistical Reporting
    if (topicLower.includes("fruit") || topicLower.includes("export") || topicLower.includes("trade") || topicLower.includes("produce")) {
      tsVN = "Trong giai đoạn khảo sát, hoạt động thương mại và xuất nhập khẩu nông sản quốc tế đã ghi nhận nhiều biến động rõ nét.";
      tsEN = "Over the surveyed timeframe, international commercial shipments and trade in agricultural commodities exhibited notable developments.";
      evVN = "Cụ thể, các báo cáo số liệu phân tích chỉ ra rằng các quốc gia và khu vực dẫn đầu tiếp tục chiếm thị phần áp đảo trên thị trường thế giới.";
      evEN = "Specifically, analytical statistical records reveal that premier exporting nations consistently commanded dominant market shares across global destinations.";
      csVN = "Tóm lại, những biến động này khẳng định vai trò thiết yếu của các mặt hàng nông sản xuất khẩu đối với nền kinh tế.";
      csEN = "In summary, these dynamics underscore the vital economic contribution of primary agricultural commodities to global trade.";
    } else {
      tsVN = "Trong giai đoạn được khảo sát, các số liệu thống kê ghi nhận những xu hướng chuyển biến đáng chú ý trên các lĩnh vực then chốt.";
      tsEN = "Throughout the surveyed period, statistical indicators registered notable structural shifts across key monitored categories.";
      evVN = "Số liệu chi tiết chứng minh rằng các nhóm dẫn đầu luôn duy trì khoảng cách đáng kể so với các chỉ số còn lại.";
      evEN = "Empirical data confirms that the foremost categories maintained a substantial margin over the remaining surveyed sectors.";
      csVN = "Nhìn chung, những biến động này phản ánh bức tranh tổng thể về xu hướng vận động và tái phân bổ nguồn lực.";
      csEN = "Overall, these recorded variations illustrate a coherent overview of evolving distribution patterns and resource realignments.";
    }
  } else if (topicLower.includes("education") || topicLower.includes("giáo dục") || topicLower.includes("learning")) {
    tsVN = "Các phương pháp giáo dục hiện đại cần chuyển trọng tâm từ việc truyền thụ lý thuyết sang phát triển tư duy độc lập và kỹ năng thực tế.";
    tsEN = "Modern educational methodologies must shift focus from passive theoretical instruction to the active cultivation of independent critical thinking.";
    evVN = "Nhiều nghiên cứu thực nghiệm đã chứng minh rằng các mô hình học tập tương tác giúp học sinh tiếp thu kiến thức sâu sắc hơn.";
    evEN = "Substantial empirical evidence reveals that interactive learning frameworks significantly enhance learners' analytical depth and academic retention.";
    csVN = "Tóm lại, việc đổi mới giáo dục toàn diện chính là nền tảng cốt lõi để chuẩn bị năng lực vững vàng cho thế hệ trẻ.";
    csEN = "In conclusion, comprehensive pedagogical innovation constitutes an indispensable foundation for preparing a competitive future workforce.";
  } else if (topicLower.includes("environment") || topicLower.includes("môi trường") || topicLower.includes("climate")) {
    tsVN = "Bảo vệ môi trường và ứng phó với biến đổi khí hậu hiện là một trong những thách thức sống còn đối với sự phát triển bền vững.";
    tsEN = "Environmental preservation and climate mitigation represent urgent global priorities in contemporary developmental discourse.";
    evVN = "Thực tế tại nhiều quốc gia áp dụng năng lượng tái tạo và kiểm soát khí thải đã giảm thiểu rõ rệt nguy cơ ô nhiễm sinh thái.";
    evEN = "Precedents across developed jurisdictions demonstrate that renewable energy integration and stringent regulations effectively curtail severe ecological degradation.";
    csVN = "Nhìn chung, việc dung hòa giữa tăng trưởng kinh tế và gìn giữ tài nguyên thiên nhiên là mục tiêu tiên quyết của nhân loại.";
    csEN = "Ultimately, harmonizing economic expansion with environmental stewardship represents a paramount imperative for humanity.";
  } else if (topicLower.includes("tech") || topicLower.includes("công nghệ") || topicLower.includes("ai") || topicLower.includes("intelligence")) {
    tsVN = "Sự bùng nổ của trí tuệ nhân tạo và tự động hóa đang làm thay đổi căn bản phương thức vận hành của xã hội hiện đại.";
    tsEN = "The rapid proliferation of artificial intelligence and automation is fundamentally reshaping conventional professional and social paradigms.";
    evVN = "Các tổ chức tiên phong ứng dụng quy trình số hóa đã ghi nhận sự cải thiện vượt bậc về hiệu suất làm việc và độ chuẩn xác.";
    evEN = "Organizations pioneering algorithmic integration have realized substantial productivity enhancements while eliminating procedural redundancies.";
    csVN = "Có thể khẳng định rằng việc làm chủ công nghệ mới chính là chìa khóa then chốt mở ra tiềm năng phát triển đột phá.";
    csEN = "Undeniably, mastering technological breakthroughs serves as a definitive catalyst for transformative socioeconomic development.";
  } else if (topicLower.includes("health") || topicLower.includes("sức khỏe") || topicLower.includes("y tế")) {
    tsVN = "Chăm sóc sức khỏe thể chất và tinh thần đang trở thành mối quan tâm hàng đầu trước áp lực ngày càng tăng của nhịp sống đô thị.";
    tsEN = "Nurturing physical and psychological health has emerged as a paramount priority amidst escalating pressures of contemporary urban living.";
    evVN = "Các chương trình y tế dự phòng và lối sống điều độ đã giúp giảm thiểu đáng kể nguy cơ bùng phát các bệnh lý mãn tính.";
    evEN = "Community-based preventative health programs and balanced lifestyles have proven highly instrumental in curbing the incidence of chronic diseases.";
    csVN = "Tóm lại, ưu tiên đầu tư cho y tế dự phòng mang lại lợi ích lâu dài và giảm tải áp lực tài chính cho xã hội.";
    csEN = "In summary, prioritizing preventative healthcare yields enduring well-being dividends while mitigating acute strain on public infrastructure.";
  } else if (topicLower.includes("work") || topicLower.includes("công việc") || topicLower.includes("career")) {
    tsVN = "Thị trường lao động cạnh tranh khốc liệt đòi hỏi người lao động phải liên tục nâng cao kỹ năng và sự linh hoạt trong nghề nghiệp.";
    tsEN = "An intensely competitive global labor market necessitates continuous professional upskilling and career adaptability.";
    evVN = "Các doanh nghiệp chú trọng phát triển nhân sự và đãi ngộ công bằng luôn duy trì được mức độ gắn kết nhân viên vượt trội.";
    evEN = "Workplaces that champion meritocracy and continuous talent development consistently exhibit higher employee satisfaction and retention.";
    csVN = "Như vậy, sự gắn kết giữa quyền lợi của người lao động và mục tiêu của doanh nghiệp là yếu tố then chốt tạo nên thành công bền vững.";
    csEN = "Thus, aligning workforce development with strategic corporate objectives is vital for sustainable commercial prosperity.";
  } else if (topicLower.includes("society") || topicLower.includes("xã hội") || topicLower.includes("crime") || topicLower.includes("tội phạm")) {
    tsVN = "Việc giải quyết các bất bình đẳng xã hội là nền tảng cốt lõi để xây dựng một cộng đồng văn minh, an toàn và phát triển hài hòa.";
    tsEN = "Addressing socioeconomic disparities constitutes a fundamental prerequisite for cultivating safe, cohesive, and progressive communities.";
    evVN = "Các chính sách an sinh xã hội đồng bộ và mở rộng cơ hội việc làm đã góp phần giảm thiểu đáng kể các vấn đề phức tạp tại đô thị.";
    evEN = "Comprehensive social welfare policies and expanded vocational opportunities have contributed significantly to mitigating urban unrest.";
    csVN = "Tóm lại, củng cố sự công bằng và đoàn kết xã hội là giải pháp bền vững nhất cho sự ổn định lâu dài.";
    csEN = "In essence, fostering inclusive social equity remains the most enduring safeguard for long-term communal stability.";
  } else {
    // General Academic Discourse
    tsVN = "Những chuyển biến trong bối cảnh hiện đại đang đặt ra yêu cầu cấp thiết về việc hoàn thiện các chiến lược phát triển đồng bộ.";
    tsEN = "Contemporary socioeconomic shifts demand comprehensive strategic adaptations across key institutional domains.";
    evVN = "Các số liệu thực nghiệm khẳng định rằng những sáng kiến được chuẩn bị kỹ lưỡng luôn mang lại hiệu quả vượt trội và lâu dài.";
    evEN = "Empirical evidence consistently confirms that well-calibrated strategic initiatives yield superior outcomes and enduring resilience.";
    csVN = "Tóm lại, sự chủ động và linh hoạt chính là chìa khóa để đạt được sự tiến bộ bền vững trong tương lai.";
    csEN = "In conclusion, proactive adaptation serves as an indispensable cornerstone for sustainable long-term advancement.";
  }

  // Combine full paragraph
  const vietnamesePrompt = `${tsVN} ${exVN} ${evVN} ${csVN}`;
  const modelParagraph = `${tsEN} ${exEN} ${evEN} ${csEN}`;

  // Band upgrades must ALWAYS preserve exEN intact and elevate surrounding cohesion & complexity
  const cleanCore = exEN.trim().replace(/\.+$/, '');
  const cleanTS = tsEN.trim().replace(/\.+$/, '');

  const band65 = `Firstly, ${tsEN.charAt(0).toLowerCase() + tsEN.slice(1).replace(/\.$/, '')}. Furthermore, ${cleanCore.charAt(0).toLowerCase() + cleanCore.slice(1)}. For example, detailed records indicate that this trend has brought visible outcomes. In short, this development plays a significant role.`;
  const band70 = `${tsEN} Notably, ${cleanCore}. For instance, empirical findings confirm that these measures consistently enhance overall performance. Overall, this factor is vital for long-term progress.`;
  const band75 = modelParagraph;
  const band80 = `${tsEN} Specifically, ${cleanCore.charAt(0).toLowerCase() + cleanCore.slice(1)}, which serves as a compelling testament to broader structural evolution. Empirical data demonstrates that such strategic alignment delivers substantial benefits across diverse sectors.`;
  const band85 = `Academic discourse widely acknowledges that ${cleanTS.charAt(0).toLowerCase() + cleanTS.slice(1)}. Most notably, ${cleanCore.charAt(0).toLowerCase() + cleanCore.slice(1)}, thereby exemplifying a pivotal benchmark of systemic sophistication. In light of these empirical realities, such dynamics constitute an indispensable cornerstone for enduring institutional excellence.`;

  return {
    vietnamesePrompt,
    topicSentenceVN: tsVN,
    explanationVN: exVN,
    evidenceVN: evVN,
    conclusionVN: csVN,
    modelParagraph,
    targetWord: word,
    structure: {
      ts: tsEN,
      ex: exEN,
      ev: evEN,
      cs: csEN
    },
    linkingSuggestions: [
      "Consequently,", 
      "As a direct consequence,", 
      "Empirical evidence demonstrates that", 
      "For instance,", 
      "In light of these developments,"
    ],
    bandUpgrades: {
      "6.5": band65,
      "7.0": band70,
      "7.5": band75,
      "8.0": band80,
      "8.5": band85
    },
    upgradeDetails: [
      `Từ vựng mục tiêu: "${word}" ${ipa} (${pos}) - Nghĩa: ${meaning}.`,
      collocation !== word 
        ? `Collocation học thuật C1/C2: "${collocation}" kết hợp tự nhiên trong văn cảnh bài viết.`
        : `Sắc thái học thuật: Sử dụng từ ngữ chính xác, trang trọng, tương thích hoàn toàn với văn phong IELTS Writing.`,
      `Cấu trúc đoạn văn (PEEL Architecture): Topic Sentence (Luận điểm) &rarr; Explanation (Phân tích có từ vựng) &rarr; Evidence (Dẫn chứng/Hệ quả) &rarr; Conclusion (Đúc kết giải pháp).`,
      `Liên từ & Mạch lạc (Cohesive Devices): Sự phối hợp linh hoạt của 'Consequently', 'For instance', 'In summary' tạo dòng chảy lập luận chặt chẽ.`
    ]
  };
}

/**
 * Generates topic-appropriate 2-sentence context for Part 3 practice (backwards compatibility).
 */
function generatePart3Practice(vocab, topicName = "IELTS Writing") {
  const paragraph = generateParagraphPractice(vocab, topicName);
  return {
    sentence1Vietnamese: paragraph.topicSentenceVN,
    sentence2Vietnamese: paragraph.explanationVN,
    linkingSuggestions: paragraph.linkingSuggestions,
    modelTranslation: `${paragraph.structure.ts} ${paragraph.structure.ex}`,
    bandUpgrades: paragraph.bandUpgrades,
    upgradeDetails: paragraph.upgradeDetails
  };
}

export function enrichVocabulary(vocab, topicName = "IELTS Writing") {
  if (!vocab) return null;

  const word = vocab.word || "";
  const ipa = vocab.ipa || "";
  const meaning = vocab.meaning || "Hiểu nghĩa từ";
  const partOfSpeech = vocab.partOfSpeech || "từ vựng";

  // 1. Comprehension Quiz Data
  const quiz = vocab.vietnameseQuiz || {
    question: `Nghĩa tiếng Việt chuẩn xác nhất của từ "${word}" là gì?`,
    options: [
      meaning,
      "Làm gia tăng áp lực và rủi ro không lường trước",
      "Duy trì nguyên trạng mà không có sự đổi mới",
      "Bỏ qua hoặc coi nhẹ tính nghiêm trọng của vấn đề"
    ],
    correctIndex: 0
  };

  // 2. Single Sentence Translation Practice Data (Part 2) - Multi-Variant Session Engine
  const practiceSentences = vocab.practiceSentences || generatePracticeSentenceVariants(vocab, topicName);
  const sentencePractice = vocab.sentencePractice || practiceSentences[0];

  // 3. Paragraph Practice (PEEL Academic Paragraph - replacing 2-sentence practice)
  const paragraphPractice = vocab.paragraphPractice || generateParagraphPractice(vocab, topicName);
  const twoSentencePractice = vocab.twoSentencePractice || paragraphPractice;

  return {
    ...vocab,
    vietnameseQuiz: quiz,
    sentencePractice,
    practiceSentences,
    paragraphPractice,
    twoSentencePractice
  };
}
