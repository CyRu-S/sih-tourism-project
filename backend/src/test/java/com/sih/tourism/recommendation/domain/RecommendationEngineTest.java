package com.sih.tourism.recommendation.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;

class RecommendationEngineTest {
    private final RecommendationEngine engine = new DefaultRecommendationEngine();

    @Test
    void frozenExamplePrefersHiddenPeacefulLowCrowdPlace() {
        RecommendationQuery query = new RecommendationQuery(
                22.5726, 88.3639, Set.of("photography", "peaceful", "heritage"),
                15.0, CrowdPreference.LOW, Set.of(), 5);
        RecommendationCandidate hidden = candidate(1L, "Hidden Heritage Spot", "heritage",
                Set.of("heritage", "photography", "peaceful"), 22.60, 88.34,
                90, 25, 95, false, true, true, CrowdLevel.LOW, 0.25);
        RecommendationCandidate landmark = candidate(2L, "Popular City Landmark", "heritage",
                Set.of("heritage", "architecture", "photography"), 22.58, 88.36,
                15, 95, 98, true, true, true, CrowdLevel.HIGH, 0.82);

        List<RecommendationResult> results = engine.rank(query, List.of(landmark, hidden));

        assertEquals(1L, results.get(0).candidate().placeId());
        assertTrue(results.get(0).explanation().contains("Matches heritage, peaceful, photography"));
    }

    @Test
    void wheelchairNeedIsAHardFilterAndScoresAreNormalized() {
        RecommendationQuery query = new RecommendationQuery(
                0, 0, Set.of(), 100, CrowdPreference.ANY,
                Set.of(AccessibilityNeed.WHEELCHAIR), 5);
        RecommendationCandidate inaccessible = candidate(1L, "Inaccessible", "park", Set.of(), 0, 0.1,
                100, 100, 100, false, false, false, CrowdLevel.LOW, 0.1);
        RecommendationCandidate accessible = candidate(2L, "Accessible", "park", Set.of(), 0, 0.2,
                0, 0, 0, true, false, false, CrowdLevel.LOW, 0.1);

        List<RecommendationResult> results = engine.rank(query, List.of(inaccessible, accessible));

        assertEquals(List.of(2L), results.stream().map(result -> result.candidate().placeId()).toList());
        assertEquals(0.0, results.get(0).scoreBreakdown().hiddenness());
        assertTrue(results.get(0).scoreBreakdown().finalScore() >= 0
                && results.get(0).scoreBreakdown().finalScore() <= 100);
    }

    @Test
    void diversityPrefersASecondCategoryWhenScoresAreClose() {
        RecommendationQuery query = new RecommendationQuery(
                0, 0, Set.of("nature"), 10, CrowdPreference.ANY, Set.of(), 3);
        RecommendationCandidate first = candidate(1L, "Nature One", "nature", Set.of("nature"), 0, 0.01,
                80, 50, 80, true, true, true, CrowdLevel.LOW, 0.2);
        RecommendationCandidate second = candidate(2L, "Nature Two", "nature", Set.of("nature"), 0, 0.02,
                70, 50, 80, true, true, true, CrowdLevel.LOW, 0.2);
        RecommendationCandidate heritage = candidate(3L, "Heritage", "heritage", Set.of("nature"), 0, 0.03,
                60, 50, 80, true, true, true, CrowdLevel.LOW, 0.2);

        List<RecommendationResult> results = engine.rank(query, List.of(first, second, heritage));

        assertEquals(List.of(1L, 3L, 2L), results.stream().map(result -> result.candidate().placeId()).toList());
    }

    @Test
    void distantCandidatesRemainEligibleAndAreStillScored() {
        RecommendationQuery query = new RecommendationQuery(
                22.5726, 88.3639, Set.of("heritage"), 15, CrowdPreference.ANY, Set.of(), 5);
        RecommendationCandidate distant = candidate(99L, "Distant Heritage", "heritage", Set.of("heritage"), 27.0073, 76.6065,
                30, 85, 90, false, true, false, CrowdLevel.LOW, 0.25);

        List<RecommendationResult> results = engine.rank(query, List.of(distant));

        assertEquals(1, results.size());
        assertTrue(results.get(0).distanceKm() > 15);
        assertEquals(0.0, results.get(0).scoreBreakdown().distance());
    }

    private RecommendationCandidate candidate(
            Long id, String name, String category, Set<String> tags,
            double latitude, double longitude, int hidden, int popularity, int curation,
            boolean wheelchair, boolean parking, boolean transport, CrowdLevel crowd, double crowdIndex) {
        return new RecommendationCandidate(id, name, category, tags, latitude, longitude,
                hidden, popularity, curation, wheelchair, parking, transport,
                WalkingDifficulty.EASY,
                new CrowdEstimate(crowdIndex, crowd, CrowdConfidence.MEDIUM));
    }
}
