package com.sih.tourism.recommendation.domain;

import java.util.List;

public interface RecommendationEngine {
    List<RecommendationResult> rank(
            RecommendationQuery query,
            List<RecommendationCandidate> candidates
    );
}