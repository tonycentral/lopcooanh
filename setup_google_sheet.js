/**
 * GOOGLE APPS SCRIPT - IELTS WRITING & VOCABULARY DATABANK AUTOMATION
 * Dành riêng cho: Lớp Cô Oanh (IELTS WriteMaster Pro)
 * 
 * Hướng dẫn sử dụng:
 * 1. Trên Google Sheets, vào menu: Tiện ích mở rộng (Extensions) > Apps Script
 * 2. Xóa toàn bộ mã cũ và dán toàn bộ nội dung file này vào
 * 3. Bấm biểu tượng "Lưu" (Ctrl + S)
 * 4. Tại ô chọn hàm, chọn "setupAllSheets" rồi bấm "Chạy" (Run)
 * 5. Cấp quyền truy cập cho script (nếu Google hỏi lần đầu tiên)
 * 6. Hoàn tất! Bạn sẽ có đầy đủ cả 2 sheet "data" (Đề thi) và "vocabulary" (Từ vựng) chuẩn chỉnh!
 */

const DRIVE_FOLDER_ID = "1VTARhzKU_T5z7AEUA2j-1pYMuFn4Fvlp"; // Folder chứa ảnh đề Task 1 của cô Oanh

/**
 * Tự động tạo menu tùy chỉnh khi mở file Google Sheet
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎓 IELTS Bank Lớp Cô Oanh')
    .addItem('🚀 1. Thiết lập TẤT CẢ (Sheet "data" & "vocabulary")', 'setupAllSheets')
    .addSeparator()
    .addItem('📝 2. Chỉ thiết lập Sheet "data" (Đề thi)', 'setupIeltsBankSheet')
    .addItem('📖 3. Chỉ thiết lập Sheet "vocabulary" (Từ vựng)', 'setupVocabularySheet')
    .addSeparator()
    .addItem('🖼️ 4. Quét & Đồng bộ ảnh từ Google Drive Folder', 'syncImagesFromDrive')
    .addToUi();
}

/**
 * Chạy thiết lập tất cả các sheet trong 1 lần click
 */
function setupAllSheets() {
  setupIeltsBankSheet();
  setupVocabularySheet();
  SpreadsheetApp.getActiveSpreadsheet().toast('Đã thiết lập hoàn chỉnh cả 2 tab: "data" và "vocabulary"!', 'Thành công 🎉', 6);
}

/**
 * -------------------------------------------------------------
 * 1. HÀM THIẾT LẬP CẤU TRÚC SHEET "data" (NGÂN HÀNG ĐỀ THI)
 * -------------------------------------------------------------
 */
function setupIeltsBankSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("data");
  if (!sheet) {
    sheet = ss.insertSheet("data");
  }
  ss.setActiveSheet(sheet);

  const headers = [
    "Mã đề (id)", "Dạng Task (task_type)", "Cấu trúc dạng đề (question_type)",
    "Chủ đề (topic)", "Nguồn đề (source_type)", "Chi tiết nguồn (source_detail)",
    "Năm/Ngày thi (year_date)", "Tiêu đề đề bài (prompt_title)", "Nội dung đề bài (prompt_text)",
    "Link ảnh gốc Drive (image_url)", "Xem trước biểu đồ (image_preview)", "Độ khó (difficulty)",
    "Từ vựng trọng tâm (key_vocabulary)", "Gợi ý dàn ý (outline_hints)",
    "Bài mẫu Band 8+ (sample_band8)", "Trạng thái (status)", "Ghi chú (notes)"
  ];

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange
    .setBackground("#1e293b")
    .setFontColor("#ffffff")
    .setFontFamily("Roboto")
    .setFontSize(10)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setWrap(true);
  
  sheet.setRowHeight(1, 45);
  sheet.setFrozenRows(1);

  const colWidths = {
    1: 90, 2: 95, 3: 150, 4: 130, 5: 140, 6: 150, 7: 95, 8: 220,
    9: 350, 10: 160, 11: 150, 12: 120, 13: 250, 14: 250, 15: 200, 16: 110, 17: 150
  };
  for (let col in colWidths) {
    sheet.setColumnWidth(parseInt(col), colWidths[col]);
  }

  sheet.getRange("H2:I500").setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  sheet.getRange("M2:O500").setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  sheet.getRange("Q2:Q500").setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);

  sheet.getRange("A2:B500").setHorizontalAlignment("center").setVerticalAlignment("middle");
  sheet.getRange("G2:G500").setHorizontalAlignment("center").setVerticalAlignment("middle");
  sheet.getRange("K2:L500").setHorizontalAlignment("center").setVerticalAlignment("middle");
  sheet.getRange("P2:P500").setHorizontalAlignment("center").setVerticalAlignment("middle");

  // Dropdowns
  const taskRule = SpreadsheetApp.newDataValidation().requireValueInList(["Task 1", "Task 2"], true).build();
  sheet.getRange("B2:B500").setDataValidation(taskRule);

  const qRule = SpreadsheetApp.newDataValidation().requireValueInList([
    "Line Graph", "Bar Chart", "Pie Chart", "Table", "Mixed / Combination",
    "Map", "Process (Natural)", "Process (Man-made)", "Agree or Disagree",
    "Discuss Both Views", "Advantages & Disadvantages", "Causes & Solutions",
    "Causes & Effects", "Two-part Question"
  ], true).build();
  sheet.getRange("C2:C500").setDataValidation(qRule);

  const srcRule = SpreadsheetApp.newDataValidation().requireValueInList([
    "Thi thật (Actual Test)", "Cambridge IELTS", "Dự đoán (Forecast)", "Đề mẫu chuẩn (Official Sample)", "Sách khác"
  ], true).build();
  sheet.getRange("E2:E500").setDataValidation(srcRule);

  const diffRule = SpreadsheetApp.newDataValidation().requireValueInList([
    "Cơ bản (Band 5.0 - 6.0)", "Trung bình (Band 6.5 - 7.0)", "Nâng cao (Band 7.5+)"
  ], true).build();
  sheet.getRange("L2:L500").setDataValidation(diffRule);

  const statusRule = SpreadsheetApp.newDataValidation().requireValueInList([
    "Đã duyệt (Active)", "Bản nháp (Draft)", "Đang sử dụng", "Lưu trữ"
  ], true).build();
  sheet.getRange("P2:P500").setDataValidation(statusRule);

  // Mẫu dữ liệu
  const sample1 = [
    "T1_001", "Task 1", "Line Graph", "Energy & Resources", "Cambridge IELTS", "Cam 18 - Test 1", "2023",
    "Tiêu thụ năng lượng tái tạo tại 4 quốc gia (1990 - 2020)",
    "The graph below shows the percentage of renewable energy consumption in four different countries between 1990 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`,
    '=IF(ISBLANK(J2), "", IF(REGEXMATCH(J2, "/d/"), IMAGE("https://lh3.googleusercontent.com/d/" & REGEXEXTRACT(J2, "/d/([a-zA-Z0-9_-]+)"), 1), IMAGE(J2, 1)))',
    "Trung bình (Band 6.5 - 7.0)", "witness an upward trend; outstrip; register a significant surge",
    "Overview: Quốc gia A và B luôn dẫn đầu; Body 1: 1990-2005; Body 2: 2005-2020",
    "The provided line graph delineates the proportion of renewable energy...", "Đã duyệt (Active)", "Lưu ý thì quá khứ đơn"
  ];
  const sample2 = [
    "T2_001", "Task 2", "Agree or Disagree", "Education & Technology", "Thi thật (Actual Test)", "BC - 15/03/2024", "2024",
    "AI có thể thay thế giáo viên trong tương lai",
    "Some people believe that artificial intelligence will eventually replace teachers in classrooms. To what extent do you agree or disagree?",
    "", "", "Nâng cao (Band 7.5+)", "pedagogical empathy; autonomous learning; complement rather than supplant",
    "Thesis: Không đồng ý hoàn toàn. Body 1: AI cá nhân hóa tri thức; Body 2: Thầy cô định hướng cảm xúc và đạo đức.",
    "While artificial intelligence has undoubtedly revolutionized education...", "Đã duyệt (Active)", "Chủ đề xu hướng"
  ];

  if (sheet.getRange(2, 1).getValue() === "") {
    sheet.getRange(2, 1, 1, sample1.length).setValues([sample1]);
    sheet.setRowHeight(2, 110);
  }
  if (sheet.getRange(3, 1).getValue() === "") {
    sheet.getRange(3, 1, 1, sample2.length).setValues([sample2]);
    sheet.setRowHeight(3, 80);
  }

  // Màu sắc có điều kiện
  const rules = [
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Task 1").setBackground("#e0f2fe").setFontColor("#0369a1").setRanges([sheet.getRange("B2:B500")]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Task 2").setBackground("#fae8ff").setFontColor("#86198f").setRanges([sheet.getRange("B2:B500")]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Đã duyệt (Active)").setBackground("#dcfce7").setFontColor("#15803d").setRanges([sheet.getRange("P2:P500")]).build()
  ];
  sheet.setConditionalFormatRules(rules);
}

/**
 * -------------------------------------------------------------
 * 2. HÀM THIẾT LẬP CẤU TRÚC SHEET "vocabulary" (TỪ VỰNG CẦN NHỚ)
 * -------------------------------------------------------------
 */
function setupVocabularySheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("vocabulary");
  if (!sheet) {
    sheet = ss.insertSheet("vocabulary");
  }
  ss.setActiveSheet(sheet);

  const headers = [
    "Mã từ (vocab_id)",
    "Từ vựng / Cụm từ (word)",
    "Từ loại (part_of_speech)",
    "Phát âm IPA (ipa)",
    "Nghĩa tiếng Việt (meaning_vi)",
    "Định nghĩa học thuật (definition_en)",
    "Trình độ (cefr_band)",
    "Chủ đề IELTS (topic)",
    "Từ Band 6 tương đương (band6_word)",
    "Từ đồng nghĩa Band 8+ (band8_synonyms)",
    "Collocations / Chunks (collocations)",
    "Câu ví dụ IELTS mẫu (example_sentence)",
    "Gia đình từ (word_family)",
    "Trạng thái học (status)",
    "Tra từ điển (cambridge_dict)",
    "Ghi chú cách dùng (notes)"
  ];

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange
    .setBackground("#0f766e") // Xanh Teal sang trọng, phân biệt với sheet data
    .setFontColor("#ffffff")
    .setFontFamily("Roboto")
    .setFontSize(10)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setWrap(true);
  
  sheet.setRowHeight(1, 45);
  sheet.setFrozenRows(1);

  // Kích thước tối ưu cho bảng từ vựng
  const colWidths = {
    1: 85,   // Mã từ
    2: 150,  // Từ vựng
    3: 110,  // Từ loại
    4: 120,  // IPA
    5: 180,  // Nghĩa tiếng Việt
    6: 280,  // Định nghĩa tiếng Anh
    7: 120,  // Trình độ CEFR/Band
    8: 140,  // Chủ đề
    9: 150,  // Từ Band 6 thay thế
    10: 220, // Từ đồng nghĩa Band 8
    11: 260, // Collocations
    12: 350, // Ví dụ câu
    13: 150, // Word family
    14: 120, // Trạng thái học
    15: 100, // Link tra từ
    16: 200  // Ghi chú
  };
  for (let col in colWidths) {
    sheet.setColumnWidth(parseInt(col), colWidths[col]);
  }

  // Tự động ngắt dòng cho các cột giải nghĩa, collocations, ví dụ
  sheet.getRange("E2:F500").setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  sheet.getRange("J2:M500").setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  sheet.getRange("P2:P500").setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);

  // Căn chỉnh chữ
  sheet.getRange("A2:A500").setHorizontalAlignment("center").setVerticalAlignment("middle");
  sheet.getRange("C2:D500").setHorizontalAlignment("center").setVerticalAlignment("middle");
  sheet.getRange("G2:G500").setHorizontalAlignment("center").setVerticalAlignment("middle");
  sheet.getRange("N2:O500").setHorizontalAlignment("center").setVerticalAlignment("middle");

  // Dropdowns (Data Validation) cho sheet từ vựng
  const posList = [
    "verb", "noun", "adjective", "adverb", "collocation / idiom", "phrasal verb"
  ];
  sheet.getRange("C2:C500").setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(posList, true).build()
  );

  const bandList = [
    "B2 (Band 5.5 - 6.5)",
    "C1 (Band 7.0 - 8.0)",
    "C2 (Band 8.5+)"
  ];
  sheet.getRange("G2:G500").setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(bandList, true).build()
  );

  const topicList = [
    "Chung (General Academic)",
    "Education (Giáo dục)",
    "Environment (Môi trường)",
    "Technology & AI (Công nghệ)",
    "Work & Career (Công việc)",
    "Health & Medicine (Sức khỏe)",
    "Crime & Law (Tội phạm)",
    "Society & Culture (Xã hội)",
    "Economy & Business (Kinh tế)",
    "Task 1 Trends & Data (Biểu đồ)"
  ];
  sheet.getRange("H2:H500").setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(topicList, true).build()
  );

  const vocabStatusList = [
    "Chưa học (New)",
    "Đang học (Learning)",
    "Đã thuộc (Mastered)",
    "Cần ôn lại (Review)"
  ];
  sheet.getRange("N2:N500").setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(vocabStatusList, true).build()
  );

  // Dữ liệu từ vựng mẫu chuẩn Band 7.5 - 8.5
  const sampleV1 = [
    "V001",
    "exacerbate",
    "verb",
    "/ɪɡˈzæs.ə.beɪt/",
    "làm trầm trọng thêm, làm tồi tệ hơn",
    "to make something that is already bad even worse",
    "C1 (Band 7.0 - 8.0)",
    "Environment (Môi trường)",
    "make worse, worsen",
    "aggravate, intensify, compound",
    "exacerbate the environmental crisis; exacerbate existing inequalities",
    "Rapid industrialization has severely exacerbated air and water pollution across major metropolitan areas.",
    "exacerbation (n)",
    "Đang học (Learning)",
    '=HYPERLINK("https://dictionary.cambridge.org/dictionary/english/" & B2, "🔊 Tra từ")',
    "Thường đi với tân ngữ tiêu cực: problem, crisis, tension, symptom"
  ];

  const sampleV2 = [
    "V002",
    "ubiquitous",
    "adjective",
    "/juːˈbɪk.wɪ.təs/",
    "phổ biến khắp nơi, nhan nhản",
    "seeming to be everywhere at the same time",
    "C1 (Band 7.0 - 8.0)",
    "Technology & AI (Công nghệ)",
    "common, popular, everywhere",
    "omnipresent, pervasive, widespread",
    "become increasingly ubiquitous; ubiquitous presence of smartphones",
    "Smartphones have become ubiquitous in modern society, radically altering how young individuals communicate.",
    "ubiquity (n), ubiquitously (adv)",
    "Đã thuộc (Mastered)",
    '=HYPERLINK("https://dictionary.cambridge.org/dictionary/english/" & B3, "🔊 Tra từ")',
    "Dùng cực hay trong mở bài hoặc thân bài các đề về công nghệ số"
  ];

  const sampleV3 = [
    "V003",
    "dramatically",
    "adverb",
    "/drəˈmæt.ɪ.kli/",
    "đột ngột, đáng kể, mạnh mẽ",
    "in a very sudden or noticeable way",
    "B2 (Band 5.5 - 6.5)",
    "Task 1 Trends & Data (Biểu đồ)",
    "a lot, quickly, sharply",
    "substantially, considerably, exponentially",
    "increase dramatically; plunge dramatically; vary dramatically",
    "The consumption of renewable energy increased dramatically between 2010 and 2020.",
    "dramatic (adj)",
    "Đã thuộc (Mastered)",
    '=HYPERLINK("https://dictionary.cambridge.org/dictionary/english/" & B4, "🔊 Tra từ")',
    "Từ vựng 'kinh điển' cho Task 1 khi miêu tả xu hướng tăng/giảm mạnh"
  ];

  if (sheet.getRange(2, 1).getValue() === "") {
    sheet.getRange(2, 1, 1, sampleV1.length).setValues([sampleV1]);
    sheet.getRange(3, 1, 1, sampleV2.length).setValues([sampleV2]);
    sheet.getRange(4, 1, 1, sampleV3.length).setValues([sampleV3]);
    sheet.setRowHeight(2, 60);
    sheet.setRowHeight(3, 60);
    sheet.setRowHeight(4, 60);
  }

  // Định dạng màu có điều kiện cho trạng thái từ vựng
  const vRules = [
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Đã thuộc (Mastered)").setBackground("#dcfce7").setFontColor("#15803d").setRanges([sheet.getRange("N2:N500")]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Đang học (Learning)").setBackground("#fef9c3").setFontColor("#854d0e").setRanges([sheet.getRange("N2:N500")]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Cần ôn lại (Review)").setBackground("#fee2e2").setFontColor("#991b1b").setRanges([sheet.getRange("N2:N500")]).build()
  ];
  sheet.setConditionalFormatRules(vRules);
}

/**
 * -------------------------------------------------------------
 * 3. HÀM ĐỒNG BỘ ẢNH TỰ ĐỘNG TỪ GOOGLE DRIVE CHO TASK 1
 * -------------------------------------------------------------
 */
function syncImagesFromDrive() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("data");
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Không tìm thấy sheet "data"!');
    return;
  }

  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const files = folder.getFiles();
  const imagesMap = {};

  while (files.hasNext()) {
    const file = files.next();
    const fileName = file.getName();
    const fileId = file.getId();
    const baseId = fileName.replace(/\.[^/.]+$/, "").trim(); // VD: T1_001
    imagesMap[baseId.toUpperCase()] = {
      url: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
      thumbnailUrl: `https://lh3.googleusercontent.com/d/${fileId}`
    };
  }

  const lastRow = Math.max(sheet.getLastRow(), 2);
  const idValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  let updatedCount = 0;

  for (let i = 0; i < idValues.length; i++) {
    const rowId = String(idValues[i][0]).trim().toUpperCase();
    if (rowId && imagesMap[rowId]) {
      const rowIndex = i + 2;
      const img = imagesMap[rowId];
      sheet.getRange(rowIndex, 10).setValue(img.url);
      sheet.getRange(rowIndex, 11).setFormula(`=IMAGE("${img.thumbnailUrl}", 1)`);
      sheet.setRowHeight(rowIndex, 110);
      updatedCount++;
    }
  }

  SpreadsheetApp.getUi().alert(`Đã đồng bộ xong!\n- Tìm thấy: ${Object.keys(imagesMap).length} ảnh trong Folder.\n- Đã cập nhật ảnh cho: ${updatedCount} đề trùng mã.`);
}
