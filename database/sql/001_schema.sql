-- Schema Definition for SIH Hyper-Local Tourism Database
-- Member 3: PostgreSQL/Supabase database foundation

-- 1. places table
CREATE TABLE IF NOT EXISTS places (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(140) NOT NULL,
    description TEXT NOT NULL,
    locality VARCHAR(120),
    latitude NUMERIC(9,6) NOT NULL CHECK (latitude >= -90.0 AND latitude <= 90.0),
    longitude NUMERIC(9,6) NOT NULL CHECK (longitude >= -180.0 AND longitude <= 180.0),
    category VARCHAR(40) NOT NULL,
    hidden_score SMALLINT NOT NULL CHECK (hidden_score >= 0 AND hidden_score <= 100),
    popularity_score SMALLINT NOT NULL CHECK (popularity_score >= 0 AND popularity_score <= 100),
    curation_score SMALLINT NOT NULL CHECK (curation_score >= 0 AND curation_score <= 100),
    best_visit_time VARCHAR(120),
    image_url TEXT,
    source_name VARCHAR(80),
    source_ref TEXT,
    wheelchair_accessible BOOLEAN DEFAULT FALSE,
    parking_available BOOLEAN DEFAULT FALSE,
    public_transport BOOLEAN DEFAULT FALSE,
    walking_difficulty VARCHAR(20) CHECK (walking_difficulty IN ('EASY', 'MODERATE', 'HARD')),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. place_tags table
CREATE TABLE IF NOT EXISTS place_tags (
    place_id BIGINT NOT NULL,
    tag VARCHAR(40) NOT NULL,
    PRIMARY KEY (place_id, tag),
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
);

-- 3. crowd_profiles table
CREATE TABLE IF NOT EXISTS crowd_profiles (
    place_id BIGINT NOT NULL,
    day_type VARCHAR(10) NOT NULL CHECK (day_type IN ('WEEKDAY', 'WEEKEND')),
    time_bucket VARCHAR(15) NOT NULL CHECK (time_bucket IN ('MORNING', 'AFTERNOON', 'EVENING', 'NIGHT')),
    crowd_index NUMERIC(4,3) NOT NULL CHECK (crowd_index >= 0.000 AND crowd_index <= 1.000),
    PRIMARY KEY (place_id, day_type, time_bucket),
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
);
