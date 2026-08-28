package com.sih.tourism.recommendation.domain;

public record RecommendationResult(
        RecommendationCandidate candidate,
        double distanceKm,
        double finalScore,
        ScoreBreakdown scoreBreakdown,
        String explanation
) {
}