-- Seed Data for place_tags
-- Member 3: Demo tags for places (IDs 101-108)

INSERT INTO place_tags (place_id, tag) VALUES
-- Chand Baori (101)
(101, 'heritage'),
(101, 'architecture'),
(101, 'photography'),
(101, 'history'),
(101, 'stepwell'),

-- Auniati Satra (102)
(102, 'spiritual'),
(102, 'cultural'),
(102, 'monastery'),
(102, 'peaceful'),
(102, 'heritage'),

-- Pochampally Ikat Weaving Cluster (103)
(103, 'cultural'),
(103, 'handloom'),
(103, 'shopping'),
(103, 'crafts'),
(103, 'heritage'),

-- Bhadrawati Palace (104)
(104, 'heritage'),
(104, 'architecture'),
(104, 'palace'),
(104, 'luxury'),
(104, 'history'),

-- Majuli River Island (105)
(105, 'nature'),
(105, 'island'),
(105, 'cultural'),
(105, 'peaceful'),
(105, 'scenic'),

-- Muzhappilangad Drive-in Beach (106)
(106, 'beach'),
(106, 'adventure'),
(106, 'scenic'),
(106, 'drivable'),
(106, 'photography'),

-- Dzukou Valley (107)
(107, 'nature'),
(107, 'trekking'),
(107, 'scenic'),
(107, 'adventure'),
(107, 'valley'),

-- Gandikota Gorge (108)
(108, 'nature'),
(108, 'adventure'),
(108, 'scenic'),
(108, 'gorge'),
(108, 'photography')
ON CONFLICT (place_id, tag) DO NOTHING;
