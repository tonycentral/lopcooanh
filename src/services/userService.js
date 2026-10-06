// Service quản lý thông tin học viên dựa trên địa chỉ Email
// Tự động lưu cấu hình Band và Task riêng biệt cho từng email

const STORAGE_KEYS = {
  CURRENT_EMAIL: "lopcooanh_student_email",
  PROFILES_MAP: "lopcooanh_student_profiles"
};

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
