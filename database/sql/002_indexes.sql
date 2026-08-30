-- Database Indexes for SIH Hyper-Local Tourism Database
-- Member 3: Performance Optimization & Lookup Speedups

-- Index for filtering active places by category (highly utilized in recommendation queries)
CREATE INDEX IF NOT EXISTS idx_places_active_category ON places (active, category);

-- Geo-spatial indexes for bounding box and latitude/longitude queries
CREATE INDEX IF NOT EXISTS idx_places_latitude ON places (latitude);
CREATE INDEX IF NOT EXISTS idx_places_longitude ON places (longitude);

-- Index for searching tag associations quickly
CREATE INDEX IF NOT EXISTS idx_place_tags_tag ON place_tags (tag);

-- Composite index for fast lookups on place crowd profiles by day type and time bucket
CREATE INDEX IF NOT EXISTS idx_crowd_profile_lookup ON crowd_profiles (place_id, day_type, time_bucket);
