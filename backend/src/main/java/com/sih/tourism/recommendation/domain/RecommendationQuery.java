package com.sih.tourism.recommendation.domain;

import java.util.Set;

public record RecommendationQuery(
        double latitude,
        double longitude,
        Set<String> interests,
        double maxDistanceKm,
        CrowdPreference crowdPreference,
        Set<AccessibilityNeed> accessibilityNeeds,
        int limit
) {
}