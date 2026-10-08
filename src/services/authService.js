import { supabase, isSupabaseConfigured } from './supabaseClient';
import { saveCurrentEmail } from './userService';

/**
 * Đăng ký tài khoản mới bằng Email và Mật khẩu
 */
export async function signUpWithEmail(email, password, fullName = '') {
  if (!isSupabaseConfigured || !supabase) {
    return {
      error: { message: "Supabase chưa được cấu hình. Vui lòng kết nối Supabase URL và Anon Key!" }
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: fullName.trim()
        }
      }
    });

    if (error) return { error };

    // Tự động tạo hồ sơ profile trong Supabase
    if (data?.user) {
      await upsertCloudProfile(data.user.id, {
        email: data.user.email,
        full_name: fullName.trim()
      });
      saveCurrentEmail(data.user.email);
    }

    return { data, error: null };
  } catch (err) {
    return { error: { message: err.message || "Lỗi không xác định khi đăng ký" } };
  }
}

/**
 * Đăng nhập bằng Email và Mật khẩu
 */
export async function signInWithEmail(email, password) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      error: { message: "Supabase chưa được cấu hình. Vui lòng kết nối Supabase URL và Anon Key!" }
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });

    if (error) return { error };

    if (data?.user?.email) {
      saveCurrentEmail(data.user.email);
    }

    return { data, error: null };
  } catch (err) {
    return { error: { message: err.message || "Lỗi không xác định khi đăng nhập" } };
  }
}

/**
 * Đăng nhập 1-chạm bằng Google (Google OAuth)
 */
export async function signInWithGoogle() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      error: { message: "Supabase chưa được cấu hình. Vui lòng kết nối Supabase URL và Anon Key!" }
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    return { data, error };
  } catch (err) {
    return { error: { message: err.message || "Lỗi khi đăng nhập bằng Google" } };
  }
}

/**
 * Đăng xuất khỏi tài khoản
 */
export async function signOut() {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Lỗi khi signOut từ Supabase:", e);
    }
  }
  // Giữ nguyên dữ liệu local hoặc reset
  return { success: true };
}

/**
 * Lấy User hiện tại từ session
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user || null;
  } catch {
    return null;
  }
}

/**
 * Lắng nghe thay đổi trạng thái đăng nhập (onAuthStateChange)
 */
export function onAuthStateChange(callback) {
  if (!isSupabaseConfigured || !supabase) {
    return { unsubscribe: () => {} };
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session?.user || null);
  });

  return subscription;
}

/**
 * Cập nhật hoặc tạo hồ sơ học viên trên đám mây (Cloud Database)
 */
export async function upsertCloudProfile(userId, profileData = {}) {
  if (!isSupabaseConfigured || !supabase || !userId) return null;

  try {
    const payload = {
      id: userId,
      email: profileData.email,
      target_band: profileData.targetBand || profileData.target_band || "7.0",
      selected_task: profileData.selectedTask || profileData.selected_task || "task2",
      full_name: profileData.full_name || profileData.fullName || "",
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.debug("Lỗi lưu cloud profile:", error);
      return null;
    }

    return data;
  } catch (e) {
    console.debug("Lỗi upsertCloudProfile:", e);
    return null;
  }
}

/**
 * Tải hồ sơ học viên từ đám mây (Cloud Database)
 */
export async function fetchCloudProfile(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Đồng bộ bài viết đã nộp lên Cloud
 */
export async function syncWritingToCloud(userId, writingEntry) {
  if (!isSupabaseConfigured || !supabase || !userId) return null;

  try {
    const payload = {
      user_id: userId,
      topic_id: writingEntry.topicId || writingEntry.topicName || '',
      task_type: writingEntry.type || writingEntry.activeTask || 'task2',
      sentence: writingEntry.sentence || writingEntry.sentenceB || '',
      target_band: writingEntry.targetBand || '7.0',
      scores: writingEntry.scores || {},
      created_at: writingEntry.timestamp || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('writing_history')
      .insert(payload);

    if (error) console.debug("Lỗi sync writing to cloud:", error);
    return data;
  } catch (e) {
    console.debug("Lỗi sync writing:", e);
    return null;
  }
}

/**
 * Tải lịch sử bài viết từ Cloud
 */
export async function fetchCloudWritingHistory(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) return [];

  try {
    const { data, error } = await supabase
      .from('writing_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}
