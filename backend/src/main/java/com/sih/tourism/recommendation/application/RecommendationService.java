package com.sih.tourism.recommendation.application;

import com.sih.tourism.crowd.application.CrowdService;
import com.sih.tourism.crowd.domain.CrowdEstimate;
import com.sih.tourism.place.application.PlaceService;
import com.sih.tourism.place.domain.Place;
import com.sih.tourism.recommendation.api.dto.RecommendationRequest;
import com.sih.tourism.recommendation.api.dto.RecommendationResponse;
import com.sih.tourism.recommendation.domain.AccessibilityNeed;
import com.sih.tourism.recommendation.domain.CrowdConfidence;
import com.sih.tourism.recommendation.domain.CrowdLevel;
import com.sih.tourism.recommendation.domain.CrowdPreference;
import com.sih.tourism.recommendation.domain.RecommendationCandidate;
import com.sih.tourism.recommendation.domain.RecommendationEngine;
import com.sih.tourism.recommendation.domain.RecommendationQuery;
import com.sih.tourism.recommendation.domain.RecommendationResult;
import com.sih.tourism.recommendation.domain.WalkingDifficulty;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class RecommendationService {
    private final PlaceService placeService;
    private final CrowdService crowdService;
    private final RecommendationEngine recommendationEngine;

    public RecommendationService(PlaceService placeService, CrowdService crowdService, RecommendationEngine recommendationEngine) {
        this.placeService = placeService;
        this.crowdService = crowdService;
        this.recommendationEngine = recommendationEngine;
    }

    public List<RecommendationResponse> getRecommendations(RecommendationRequest request) {
        int maxDistanceKm = request.getMaxDistanceKm() == null ? 15 : request.getMaxDistanceKm();
        int limit = request.getLimit() == null ? 5 : request.getLimit();
        List<Place> places = placeService.getActivePlaces()
                .stream().filter(place -> matchesCategory(place, request.getCategory())).toList();
        Map<Long, CrowdEstimate> crowds = places.stream()
                .collect(Collectors.toMap(Place::getId, place -> crowdService.estimateCrowd(place.getId())));
        Map<Long, Place> placesById = places.stream().collect(Collectors.toMap(Place::getId, Function.identity()));

        RecommendationQuery query = new RecommendationQuery(
                request.getLocation().getLat(), request.getLocation().getLng(), normalisedInterests(request.getInterests()),
                maxDistanceKm, crowdPreference(request.getCrowdPreference()), accessibilityNeeds(request.getAccessibilityNeeds()), limit);
        List<RecommendationCandidate> candidates = places.stream().map(place -> toCandidate(place, crowds.get(place.getId()))).toList();
        return recommendationEngine.rank(query, candidates).stream()
                .map(result -> toResponse(result, placesById.get(result.candidate().placeId()), crowds.get(result.candidate().placeId())))
                .toList();
    }

    private boolean matchesCategory(Place place, String category) {
        return category == null || category.isBlank() || "all".equalsIgnoreCase(category) || place.getCategory().equalsIgnoreCase(category);
    }

    private Set<String> normalisedInterests(List<String> interests) {
        if (interests == null) return Set.of();
        return interests.stream().filter(value -> value != null && !value.isBlank())
                .map(value -> value.trim().toLowerCase(Locale.ROOT)).collect(Collectors.toSet());
    }

    private CrowdPreference crowdPreference(String value) {
        return value == null ? CrowdPreference.ANY : CrowdPreference.valueOf(value);
    }

    private Set<AccessibilityNeed> accessibilityNeeds(List<String> values) {
        if (values == null) return Set.of();
        return values.stream().filter(value -> value != null && !value.isBlank()).flatMap(value -> {
            try { return java.util.stream.Stream.of(AccessibilityNeed.valueOf(value.trim().toUpperCase(Locale.ROOT))); }
            catch (IllegalArgumentException ignored) { return java.util.stream.Stream.empty(); }
        }).collect(Collectors.toSet());
    }

    private RecommendationCandidate toCandidate(Place place, CrowdEstimate crowd) {
        return new RecommendationCandidate(place.getId(), place.getName(), place.getCategory(), place.getTags(), place.getLat(), place.getLng(),
                place.getHiddenScore(), place.getPopularityScore(), place.getCurationScore(), place.isWheelchairAccessible(),
                place.isParkingAvailable(), place.isPublicTransport(), walkingDifficulty(place.getWalkingDifficulty()),
                new com.sih.tourism.recommendation.domain.CrowdEstimate(crowd.getIndex(), crowdLevel(crowd.getLevel()), CrowdConfidence.MEDIUM));
    }

    private WalkingDifficulty walkingDifficulty(String value) {
        try { return WalkingDifficulty.valueOf(value == null ? "MODERATE" : value); }
        catch (IllegalArgumentException ignored) { return WalkingDifficulty.MODERATE; }
    }

    private CrowdLevel crowdLevel(String value) {
        try { return CrowdLevel.valueOf(value); }
        catch (IllegalArgumentException ignored) { return CrowdLevel.MEDIUM; }
    }

    private RecommendationResponse toResponse(RecommendationResult result, Place place, CrowdEstimate crowd) {
        var score = result.scoreBreakdown();
        return RecommendationResponse.builder()
                .placeId(place.getId()).name(place.getName()).category(place.getCategory())
                .location(new RecommendationResponse.Location(place.getLat(), place.getLng()))
                .distanceKm(round(result.distanceKm())).score((int) Math.round(result.finalScore())).estimatedCrowd(crowd)
                .scoreBreakdown(Map.of("preference", score.preference(), "distance", score.distance(), "hiddenness", score.hiddenness(),
                        "crowdFit", score.crowdFit(), "accessibility", score.accessibility(), "curation", score.curation()))
                .why(result.explanation()).description(place.getDescription()).tags(place.getTags().stream().sorted().toList())
                .bestVisitTime(place.getBestVisitTime()).accessibility(accessibilityLabel(place))
                .photo(place.getImageUrl() == null ? null : new RecommendationResponse.Photo(place.getImageUrl(), place.getSourceName(), place.getSourceRef()))
                .sourceAttribution(place.getSourceName()).build();
    }

    private String accessibilityLabel(Place place) {
        String access = place.isWheelchairAccessible() ? "Wheelchair accessible" : "Limited wheelchair access";
        return place.getWalkingDifficulty() == null ? access : access + "; " + place.getWalkingDifficulty().toLowerCase(Locale.ROOT) + " walking";
    }

    private double round(double value) { return Math.round(value * 10.0) / 10.0; }
}
