CREATE TABLE IF NOT EXISTS user_activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type text NOT NULL,
    timestamp timestamptz DEFAULT now(),
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_stats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    stat_type text NOT NULL,
    value numeric DEFAULT 0,
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, stat_type)
);
