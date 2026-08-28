-- Frontend-compatible Kolkata records for the first live end-to-end demo.
-- These are demo records and do not replace the separate Member 5 production dataset.
INSERT INTO places (
    id, name, description, locality, latitude, longitude, category,
    hidden_score, popularity_score, curation_score, best_visit_time,
    image_url, source_name, source_ref, wheelchair_accessible,
    parking_available, public_transport, walking_difficulty, active
) VALUES
    (201, 'Kumartuli River Ghat', 'A quiet river edge behind the idol-makers where Kolkata wakes slowly among workshops, chai stalls and old river steps.', 'Kumartuli, Kolkata', 22.620100, 88.365400, 'heritage', 92, 55, 93, '6:00-8:00 AM', 'https://commons.wikimedia.org/wiki/Special:FilePath/Kumartuli%20Ghat%2001.jpg?width=1200', 'Wikimedia Commons', 'Kumartuli Ghat 01.jpg', FALSE, TRUE, TRUE, 'MODERATE', TRUE),
    (202, 'Bawali Rajbari Garden', 'An 18th-century estate surrounded by garden paths, verandas and atmospheric heritage details.', 'Bawali, West Bengal', 22.446500, 88.210700, 'heritage', 90, 60, 89, '3:00-5:00 PM', 'https://commons.wikimedia.org/wiki/Special:FilePath/Bawali%20Rajbari.jpg?width=1200', 'Wikimedia Commons', 'Bawali Rajbari.jpg', TRUE, TRUE, TRUE, 'EASY', TRUE),
    (203, 'Rabindra Sarobar East Walk', 'Take the east-side paths for quieter lake views, birdlife and a gentle walking route.', 'Dhakuria, Kolkata', 22.515400, 88.363300, 'nature', 65, 70, 88, '6:30-8:30 AM', 'https://commons.wikimedia.org/wiki/Special:FilePath/Rabindra%20Sarobar-Dhakuria%2CRabindra%20Sarobar%2CKolkata-West%20Bengal%20700029-DSC%200035%2001.jpg?width=1200', 'Wikimedia Commons', 'Rabindra Sarobar', TRUE, FALSE, TRUE, 'EASY', TRUE),
    (204, 'Burrabazar Spice Lane', 'A sensory lane of tea, spices and small vendors, best explored with time to wander.', 'Burrabazar, Kolkata', 22.585100, 88.351400, 'food', 79, 80, 81, '10:00 AM-Noon', 'https://commons.wikimedia.org/wiki/Special:FilePath/Burrabazar%20Market%20in%20Kolkata%2012.jpg?width=1200', 'Wikimedia Commons', 'Burrabazar Market in Kolkata', FALSE, FALSE, TRUE, 'MODERATE', TRUE),
    (205, 'Tolly Canal Kayak Point', 'A low-key waterside activity with a quieter feel than the city main promenades.', 'Tollygunge, Kolkata', 22.486400, 88.343300, 'adventure', 87, 45, 77, '7:00-9:00 AM', 'https://commons.wikimedia.org/wiki/Special:FilePath/Adi%20Ganga%20or%20Tolly%27s%20Nullah%2C%20Kalighat%20in%201865%20%2805%29.jpg?width=1200', 'Wikimedia Commons', 'Historic Tolly Nullah image', FALSE, FALSE, TRUE, 'MODERATE', TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, description = EXCLUDED.description, locality = EXCLUDED.locality,
    latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude, category = EXCLUDED.category,
    hidden_score = EXCLUDED.hidden_score, popularity_score = EXCLUDED.popularity_score,
    curation_score = EXCLUDED.curation_score, best_visit_time = EXCLUDED.best_visit_time,
    image_url = EXCLUDED.image_url, source_name = EXCLUDED.source_name, source_ref = EXCLUDED.source_ref,
    wheelchair_accessible = EXCLUDED.wheelchair_accessible, parking_available = EXCLUDED.parking_available,
    public_transport = EXCLUDED.public_transport, walking_difficulty = EXCLUDED.walking_difficulty, active = EXCLUDED.active;

INSERT INTO place_tags (place_id, tag) VALUES
    (201, 'heritage'), (201, 'photography'), (201, 'craft'), (201, 'riverside'),
    (202, 'heritage'), (202, 'architecture'), (202, 'garden'), (202, 'peaceful'),
    (203, 'nature'), (203, 'walking'), (203, 'birds'), (203, 'lake'),
    (204, 'food'), (204, 'street-food'), (204, 'market'), (204, 'local-life'),
    (205, 'adventure'), (205, 'water'), (205, 'outdoors'), (205, 'peaceful')
ON CONFLICT (place_id, tag) DO NOTHING;

WITH profile_base(place_id, crowd_index) AS (
    VALUES (201, 0.270::NUMERIC), (202, 0.330::NUMERIC), (203, 0.490::NUMERIC), (204, 0.610::NUMERIC), (205, 0.300::NUMERIC)
), buckets(day_type, time_bucket) AS (
    VALUES ('WEEKDAY', 'MORNING'), ('WEEKDAY', 'AFTERNOON'), ('WEEKDAY', 'EVENING'), ('WEEKDAY', 'NIGHT'),
           ('WEEKEND', 'MORNING'), ('WEEKEND', 'AFTERNOON'), ('WEEKEND', 'EVENING'), ('WEEKEND', 'NIGHT')
)
INSERT INTO crowd_profiles (place_id, day_type, time_bucket, crowd_index)
SELECT profile_base.place_id, buckets.day_type, buckets.time_bucket, profile_base.crowd_index
FROM profile_base CROSS JOIN buckets
ON CONFLICT (place_id, day_type, time_bucket) DO UPDATE SET crowd_index = EXCLUDED.crowd_index;
