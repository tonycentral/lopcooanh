// Service quản lý hồ sơ và cài đặt riêng cho từng học viên
// Lưu trữ persistent trong localStorage

const STORAGE_KEYS = {
  USERS_LIST: "lopcooanh_users_list",
  CURRENT_USER_ID: "lopcooanh_current_user_id"
};

const DEFAULT_USERS = [
  {
    id: "user_hocvien_1",
    name: "Minh Anh",
    targetBand: "7.0",
    selectedTask: "task2", // 'task1' | 'task2'
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    avatarColor: "from-indigo-500 to-purple-600"
  }
];

const AVATAR_COLORS = [
  "from-indigo-500 to-purple-600",
  "from-pink-500 to-rose-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-sky-500 to-blue-600",
  "from-violet-500 to-fuchsia-600"
];

function getRandomAvatarColor() {
  const index = Math.floor(Math.random() * AVATAR_COLORS.length);
  return AVATAR_COLORS[index];
}

/**
 * Lấy toàn bộ danh sách users từ localStorage
 */
export function getAllUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_USERS;
  } catch (e) {
    console.error("Lỗi đọc danh sách users:", e);
    return DEFAULT_USERS;
  }
}

/**
 * Lấy user hiện tại đang đăng nhập
 */
export function getCurrentUser() {
  try {
    const users = getAllUsers();
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    
    if (currentId) {
      const found = users.find(u => u.id === currentId);
      if (found) return found;
    }

    // Nếu chưa có, chọn user đầu tiên
    const defaultUser = users[0];
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, defaultUser.id);
    return defaultUser;
  } catch (e) {
    console.error("Lỗi lấy current user:", e);
    return DEFAULT_USERS[0];
  }
}

/**
 * Đổi user đang hoạt động
 */
export function setCurrentUserId(userId) {
  try {
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.lastActive = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
      return user;
    }
    return null;
  } catch (e) {
    console.error("Lỗi đổi user:", e);
    return null;
  }
}

/**
 * Cập nhật settings của user hiện tại (Band, Task, v.v.)
 */
export function updateCurrentUserSettings(settings) {
  try {
    const users = getAllUsers();
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || users[0].id;
    
    let updatedUser = null;
    const updatedUsers = users.map(user => {
      if (user.id === currentId) {
        updatedUser = {
          ...user,
          ...settings,
          lastActive: new Date().toISOString()
        };
        return updatedUser;
      }
      return user;
    });

    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(updatedUsers));
    return updatedUser;
  } catch (e) {
    console.error("Lỗi lưu settings cho user:", e);
    return null;
  }
}

/**
 * Đăng nhập hoặc tạo mới học viên theo tên
 */
export function loginOrCreateUser(name, initialBand = "7.0", initialTask = "task2") {
  try {
    const trimmedName = (name || "").trim();
    if (!trimmedName) return getCurrentUser();

    const users = getAllUsers();
    // Kiểm tra xem đã có học viên tên này chưa
    const existing = users.find(u => u.name.toLowerCase() === trimmedName.toLowerCase());
    
    if (existing) {
      existing.lastActive = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, existing.id);
      return existing;
    }

    // Tạo học viên mới
    const newUser = {
      id: "user_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      name: trimmedName,
      targetBand: initialBand,
      selectedTask: initialTask,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      avatarColor: getRandomAvatarColor()
    };

    const newUsersList = [newUser, ...users];
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(newUsersList));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
    return newUser;
  } catch (e) {
    console.error("Lỗi đăng nhập/tạo user:", e);
    return getCurrentUser();
  }
}

/**
 * Xóa một học viên khỏi danh sách
 */
export function deleteUser(userId) {
  try {
    const users = getAllUsers();
    if (users.length <= 1) {
      // Không xóa nếu chỉ còn 1 user
      return false;
    }

    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(filtered));
    
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (currentId === userId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, filtered[0].id);
    }
    return true;
  } catch (e) {
    console.error("Lỗi xóa user:", e);
    return false;
  }
}
