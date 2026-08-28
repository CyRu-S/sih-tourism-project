package com.sih.tourism.recommendation.domain;

import java.util.Set;

public record RecommendationCandidate(
        Long placeId,
        String name,
        String category,
        Set<String> tags,
        double latitude,
        double longitude,
        int hiddenScore,
        int popularityScore,
        int curationScore,
        boolean wheelchairAccessible,
        boolean parkingAvailable,
        boolean publicTransport,
        WalkingDifficulty walkingDifficulty,
        CrowdEstimate crowdEstimate
) {
}