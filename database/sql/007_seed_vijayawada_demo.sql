-- Vijayawada-area demo records for physical-device testing.
-- These records are intentionally marked as demo content and do not replace Member 5 production data.
INSERT INTO places (
    id, name, description, locality, latitude, longitude, category,
    hidden_score, popularity_score, curation_score, best_visit_time,
    image_url, source_name, source_ref, wheelchair_accessible,
    parking_available, public_transport, walking_difficulty, active
) VALUES
    (301, 'Kanaka Durga Temple Viewpoint', 'A hilltop spiritual landmark above the Krishna River with broad city views and a lively temple approach.', 'Indrakeeladri, Vijayawada, Andhra Pradesh', 16.506700, 80.648000, 'spiritual', 58, 92, 91, '6:00-8:00 AM', 'https://images.unsplash.com/photo-1600100397608-f010735b40e0?auto=format&fit=crop&w=1200&q=80', 'Vijayawada demo dataset', 'Sample location for app testing', TRUE, TRUE, TRUE, 'MODERATE', TRUE),
    (302, 'Undavalli Caves', 'Rock-cut cave temples with carved halls and a peaceful hillside outlook close to the Krishna River.', 'Undavalli, Andhra Pradesh', 16.496600, 80.584700, 'heritage', 78, 72, 89, '8:00 AM-5:00 PM', 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80', 'Vijayawada demo dataset', 'Sample location for app testing', FALSE, TRUE, TRUE, 'MODERATE', TRUE),
    (303, 'Bhavani Island Riverside', 'A green riverside escape for relaxed walks, boating views and a quieter break from the city.', 'Krishna River, Vijayawada, Andhra Pradesh', 16.517400, 80.672300, 'nature', 74, 68, 86, '7:00-10:00 AM', 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=1200&q=80', 'Vijayawada demo dataset', 'Sample location for app testing', TRUE, TRUE, TRUE, 'EASY', TRUE),
    (304, 'Prakasam Barrage Promenade', 'A riverfront promenade with views of the Krishna River, city lights and the historic barrage.', 'Vijayawada, Andhra Pradesh', 16.506800, 80.665400, 'heritage', 66, 84, 88, 'Sunset', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80', 'Vijayawada demo dataset', 'Sample location for app testing', TRUE, TRUE, TRUE, 'EASY', TRUE),
    (305, 'Mangalagiri Temple Trail', 'A spiritual hill trail and temple precinct with regional craft, heritage and open views.', 'Mangalagiri, Andhra Pradesh', 16.430500, 80.558000, 'spiritual', 72, 70, 84, '6:00-9:00 AM', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80', 'Vijayawada demo dataset', 'Sample location for app testing', FALSE, TRUE, TRUE, 'MODERATE', TRUE),
    (306, 'Kondapalli Fort', 'A hill fort and village craft destination with rocky paths, broad views and a quieter historic setting.', 'Kondapalli, Andhra Pradesh', 16.619500, 80.542000, 'adventure', 88, 52, 82, '7:00-10:00 AM', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80', 'Vijayawada demo dataset', 'Sample location for app testing', FALSE, TRUE, FALSE, 'HARD', TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, description = EXCLUDED.description, locality = EXCLUDED.locality,
    latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude, category = EXCLUDED.category,
    hidden_score = EXCLUDED.hidden_score, popularity_score = EXCLUDED.popularity_score,
    curation_score = EXCLUDED.curation_score, best_visit_time = EXCLUDED.best_visit_time,
    image_url = EXCLUDED.image_url, source_name = EXCLUDED.source_name, source_ref = EXCLUDED.source_ref,
    wheelchair_accessible = EXCLUDED.wheelchair_accessible, parking_available = EXCLUDED.parking_available,
    public_transport = EXCLUDED.public_transport, walking_difficulty = EXCLUDED.walking_difficulty, active = EXCLUDED.active;

INSERT INTO place_tags (place_id, tag) VALUES
    (301, 'spiritual'), (301, 'heritage'), (301, 'photography'), (301, 'peaceful'),
    (302, 'heritage'), (302, 'architecture'), (302, 'photography'), (302, 'walking'),
    (303, 'nature'), (303, 'riverside'), (303, 'peaceful'), (303, 'walking'),
    (304, 'heritage'), (304, 'riverside'), (304, 'photography'), (304, 'walking'),
    (305, 'spiritual'), (305, 'heritage'), (305, 'craft'), (305, 'walking'),
    (306, 'adventure'), (306, 'heritage'), (306, 'photography'), (306, 'walking')
ON CONFLICT (place_id, tag) DO NOTHING;

WITH profile_base(place_id, crowd_index) AS (
    VALUES (301, 0.580::NUMERIC), (302, 0.320::NUMERIC), (303, 0.280::NUMERIC),
           (304, 0.460::NUMERIC), (305, 0.350::NUMERIC), (306, 0.220::NUMERIC)
), buckets(day_type, time_bucket) AS (
    VALUES ('WEEKDAY', 'MORNING'), ('WEEKDAY', 'AFTERNOON'), ('WEEKDAY', 'EVENING'), ('WEEKDAY', 'NIGHT'),
           ('WEEKEND', 'MORNING'), ('WEEKEND', 'AFTERNOON'), ('WEEKEND', 'EVENING'), ('WEEKEND', 'NIGHT')
)
INSERT INTO crowd_profiles (place_id, day_type, time_bucket, crowd_index)
SELECT profile_base.place_id, buckets.day_type, buckets.time_bucket, profile_base.crowd_index
FROM profile_base CROSS JOIN buckets
ON CONFLICT (place_id, day_type, time_bucket) DO UPDATE SET crowd_index = EXCLUDED.crowd_index;
