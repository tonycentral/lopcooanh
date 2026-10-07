// Service quản lý thông tin học viên dựa trên địa chỉ Email
// Tự động lưu cấu hình Band và Task riêng biệt cho từng email

const STORAGE_KEYS = {
  CURRENT_EMAIL: "lopcooanh_student_email",
  PROFILES_MAP: "lopcooanh_student_profiles",
  LAST_VISIT: "lopcooanh_last_visit_timestamp"
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 7 ngày = 604,800,000 ms

/**
 * Ghi nhận thời điểm truy cập hiện tại của người dùng
 */
export function recordUserVisit() {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_VISIT, Date.now().toString());
  } catch (e) {
    console.error("Lỗi khi lưu thời điểm truy cập:", e);
  }
}

/**
 * Kiểm tra xem có cần hiển thị Welcome Page hay không:
 * - Chỉ hiện ra nếu lâu quá (7 ngày) người dùng chưa truy cập web
 * - Hoặc người dùng mới hoàn toàn chưa từng vào web
 * - Nếu người dùng đã vào web trong vòng 7 ngày -> false (vào thẳng phần luyện tập)
 */
export function shouldShowWelcomePage() {
  try {
    const lastVisit = localStorage.getItem(STORAGE_KEYS.LAST_VISIT);

    if (!lastVisit) {
      // Nếu đã có email học viên từ trước -> người dùng cũ đang học -> vào thẳng practice
      const currentEmail = getSavedEmail();
      if (currentEmail) {
        const profile = getProfileByEmail(currentEmail);
        if (profile?.lastActive) {
          const lastActiveTime = new Date(profile.lastActive).getTime();
          if (!isNaN(lastActiveTime)) {
            const elapsed = Date.now() - lastActiveTime;
            return elapsed > SEVEN_DAYS_MS;
          }
        }
        return false;
      }
      // Người dùng mới hoàn toàn -> hiển thị Welcome Page
      return true;
    }

    const lastTime = parseInt(lastVisit, 10);
    if (isNaN(lastTime)) {
      return false;
    }

    const elapsed = Date.now() - lastTime;
    // Chỉ hiện Welcome Page nếu khoảng cách lớn hơn 7 ngày
    return elapsed > SEVEN_DAYS_MS;
  } catch {
    return false;
  }
}

/**
 * Kiểm tra định dạng email hợp lệ
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  // Chuẩn Regex RFC 5322 phổ thông
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmed);
}

/**
 * Lấy email hiện tại đã lưu
 */
export function getSavedEmail() {
  try {
    const email = localStorage.getItem(STORAGE_KEYS.CURRENT_EMAIL);
    return email && isValidEmail(email) ? email.trim().toLowerCase() : "";
  } catch {
    return "";
  }
}

/**
 * Lấy toàn bộ từ điển hồ sơ các email
 */
function getProfilesMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES_MAP);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Lấy hồ sơ (Band, Task) theo email cụ thể
 */
export function getProfileByEmail(email) {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();
  const map = getProfilesMap();
  
  if (map[cleanEmail]) {
    return map[cleanEmail];
  }

  // Mặc định cho học viên mới
  return {
    email: cleanEmail,
    targetBand: "7.0",
    selectedTask: "task2",
    createdAt: new Date().toISOString()
  };
}

/**
 * Lưu email học viên hiện tại và khởi tạo hồ sơ nếu chưa có
 */
export function saveCurrentEmail(email) {
  if (!isValidEmail(email)) return null;
  const cleanEmail = email.trim().toLowerCase();

  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_EMAIL, cleanEmail);

    const map = getProfilesMap();
    if (!map[cleanEmail]) {
      map[cleanEmail] = {
        email: cleanEmail,
        targetBand: "7.0",
        selectedTask: "task2",
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
    } else {
      map[cleanEmail].lastActive = new Date().toISOString();
    }

    localStorage.setItem(STORAGE_KEYS.PROFILES_MAP, JSON.stringify(map));
    return map[cleanEmail];
  } catch (e) {
    console.error("Lỗi khi lưu email học viên:", e);
    return null;
  }
}

/**
 * Cập nhật cấu hình (targetBand, selectedTask) cho email hiện tại
 */
export function updateSettingsForEmail(email, settings) {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();

  try {
    const map = getProfilesMap();
    const current = map[cleanEmail] || {
      email: cleanEmail,
      targetBand: "7.0",
      selectedTask: "task2",
      createdAt: new Date().toISOString()
    };

    const updated = {
      ...current,
      ...settings,
      lastActive: new Date().toISOString()
    };

    map[cleanEmail] = updated;
    localStorage.setItem(STORAGE_KEYS.PROFILES_MAP, JSON.stringify(map));
    return updated;
  } catch (e) {
    console.error("Lỗi khi cập nhật settings cho email:", e);
    return null;
  }
}

/**
 * Xóa thông tin email để người dùng có thể nhập email khác
 */
export function clearCurrentEmail() {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_EMAIL);
  } catch (e) {
    console.error("Lỗi khi xóa email:", e);
  }
}

/**
 * Lấy danh sách ID các từ học viên đã đánh dấu "Tôi đã biết"
 */
export function getKnownWords(email) {
  try {
    const cleanEmail = email ? email.trim().toLowerCase() : "default_student";
    const raw = localStorage.getItem(`lopcooanh_known_words_${cleanEmail}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Lỗi khi đọc danh sách từ đã biết:", e);
    return [];
  }
}

/**
 * Đảo trạng thái "Tôi đã biết" của một từ (bật/tắt)
 * @returns {string[]} Danh sách các ID từ đã biết sau khi cập nhật
 */
export function toggleKnownWord(email, wordId) {
  if (!wordId) return [];
  try {
    const cleanEmail = email ? email.trim().toLowerCase() : "default_student";
    const current = getKnownWords(cleanEmail);
    const index = current.indexOf(wordId);
    let updated;
    if (index >= 0) {
      updated = current.filter(id => id !== wordId);
    } else {
      updated = [...current, wordId];
    }
    localStorage.setItem(`lopcooanh_known_words_${cleanEmail}`, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Lỗi khi lưu từ đã biết:", e);
    return [];
  }
}

/**
 * Kiểm tra xem từ có thuộc danh sách "Tôi đã biết" hay không
 */
export function isWordKnown(email, wordId) {
  if (!wordId) return false;
  const list = getKnownWords(email);
  return list.includes(wordId);
}

/**
 * Đặt lại trạng thái "Tôi đã biết" cho toàn bộ các từ trong một chủ đề cụ thể (để học viên ôn tập lại)
 */
export function resetKnownWordsForTopic(email, wordIds = []) {
  if (!wordIds || wordIds.length === 0) return [];
  try {
    const cleanEmail = email ? email.trim().toLowerCase() : "default_student";
    const current = getKnownWords(cleanEmail);
    const updated = current.filter(id => !wordIds.includes(id));
    localStorage.setItem(`lopcooanh_known_words_${cleanEmail}`, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Lỗi khi reset từ đã biết cho chủ đề:", e);
    return [];
  }
}
