package com.sih.tourism.recommendation.application;

import com.sih.tourism.crowd.application.CrowdService;
import com.sih.tourism.crowd.domain.CrowdEstimate;
import com.sih.tourism.place.application.PlaceService;
import com.sih.tourism.place.domain.Place;
import com.sih.tourism.recommendation.api.dto.RecommendationRequest;
import com.sih.tourism.recommendation.api.dto.RecommendationResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final PlaceService placeService;
    private final CrowdService crowdService;

    public RecommendationService(PlaceService placeService, CrowdService crowdService) {
        this.placeService = placeService;
        this.crowdService = crowdService;
    }

    public List<RecommendationResponse> getRecommendations(RecommendationRequest request) {
        List<Place> candidates = placeService.getCandidatePlaces(
                request.getLocation().getLat(),
                request.getLocation().getLng(),
                request.getMaxDistanceKm() != null ? request.getMaxDistanceKm() : 15
        );

        return candidates.stream().map(place -> {
            CrowdEstimate estimate = crowdService.estimateCrowd(place.getId());
            // Mock Member 4 AI logic for demo purposes
            return RecommendationResponse.builder()
                    .placeId(place.getId())
                    .name(place.getName())
                    .category(place.getCategory())
                    .location(RecommendationResponse.Location.builder()
                            .lat(place.getLat())
                            .lng(place.getLng())
                            .build())
                    .distanceKm(6.2) // Mocked
                    .score(92) // Mocked
                    .estimatedCrowd(estimate)
                    .scoreBreakdown(Map.of(
                            "preference", 0.95,
                            "distance", 0.59,
                            "hiddenness", 0.88,
                            "crowdFit", 1.0,
                            "accessibility", 1.0,
                            "curation", 0.9
                    ))
                    .why("Fits photography and heritage, is nearby, highly hidden, and currently estimated low crowd.")
                    .build();
        }).limit(request.getLimit() != null ? request.getLimit() : 5).collect(Collectors.toList());
    }
}
