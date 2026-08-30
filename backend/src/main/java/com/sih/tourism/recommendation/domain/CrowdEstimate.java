package com.sih.tourism.recommendation.domain;

public record CrowdEstimate(
        double index,
        CrowdLevel level,
        CrowdConfidence confidence
) {
}