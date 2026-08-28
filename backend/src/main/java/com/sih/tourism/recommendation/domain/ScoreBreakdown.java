package com.sih.tourism.recommendation.domain;

public record ScoreBreakdown(
        double preference,
        double distance,
        double hiddenness,
        double crowdFit,
        double accessibility,
        double curation,
        double finalScore
) {
}