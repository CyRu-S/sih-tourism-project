package com.sih.tourism.recommendation.domain;

public final class RecommendationWeights {
    public static final double PREFERENCE = 0.35;
    public static final double DISTANCE = 0.20;
    public static final double HIDDENNESS = 0.20;
    public static final double CROWD_FIT = 0.15;
    public static final double ACCESSIBILITY = 0.05;
    public static final double CURATION = 0.05;

    private RecommendationWeights() {
    }
}