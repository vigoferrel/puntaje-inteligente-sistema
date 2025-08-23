-- =====================================================================================
-- ARSENAL EDUCATIVO - PLAYLISTS (SISTEMA SPOTIFY)
-- =====================================================================================

-- TABLA 5: EXERCISE PLAYLISTS
CREATE TABLE IF NOT EXISTS exercise_playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    playlist_type TEXT CHECK (playlist_type IN ('custom', 'recommended', 'adaptive', 'daily_mix', 'discovery')) DEFAULT 'custom',
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'mixed')) DEFAULT 'mixed',
    subject_focus TEXT[],
    total_exercises INTEGER DEFAULT 0,
    estimated_duration INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.0,
    engagement_score DECIMAL(5,2) DEFAULT 0.0,
    is_public BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    play_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA 6: PLAYLIST ITEMS
CREATE TABLE IF NOT EXISTS playlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID REFERENCES exercise_playlists(id) ON DELETE CASCADE,
    exercise_id UUID,
    position INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completion_time INTEGER,
    score_achieved DECIMAL(5,2),
    attempts_count INTEGER DEFAULT 0,
    adaptive_difficulty DECIMAL(3,2) DEFAULT 1.0,
    neural_feedback JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_playlist_position UNIQUE(playlist_id, position)
);
