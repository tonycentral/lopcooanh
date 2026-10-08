-- =========================================================================
-- SQL SCHEMA FOR LOP CO OANH IELTS APP (SUPABASE)
-- Hướng dẫn: Copy toàn bộ đoạn script này và dán vào Supabase SQL Editor -> bấm "Run"
-- =========================================================================

-- 1. Bảng hồ sơ học viên (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT DEFAULT '',
    target_band TEXT DEFAULT '7.0',
    selected_task TEXT DEFAULT 'task2',
    streak INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Kích hoạt Row Level Security (Bảo mật dòng dữ liệu)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 2. Bảng lịch sử viết câu và chấm điểm (writing_history)
CREATE TABLE IF NOT EXISTS public.writing_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    topic_id TEXT NOT NULL,
    task_type TEXT DEFAULT 'task2',
    sentence TEXT NOT NULL,
    target_band TEXT DEFAULT '7.0',
    scores JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.writing_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own writing history" 
ON public.writing_history FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own writing history" 
ON public.writing_history FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Bảng tiến độ học từ vựng Flashcard tương tác (flashcard_progress)
CREATE TABLE IF NOT EXISTS public.flashcard_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    mastered_word_ids JSONB DEFAULT '[]'::jsonb,
    needs_review_word_ids JSONB DEFAULT '[]'::jsonb,
    xp INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 1,
    last_active_date DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT flashcard_user_unique UNIQUE (user_id)
);

ALTER TABLE public.flashcard_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own flashcard progress" 
ON public.flashcard_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert their own flashcard progress" 
ON public.flashcard_progress FOR ALL 
USING (auth.uid() = user_id);

-- 4. Tự động tạo hồ sơ profile khi người dùng đăng ký tài khoản mới qua Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, target_band, selected_task)
    VALUES (
        new.id, 
        new.email, 
        COALESCE(new.raw_user_meta_data->>'full_name', ''), 
        '7.0', 
        'task2'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger thực thi hàm khi có bản ghi mới trong auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
