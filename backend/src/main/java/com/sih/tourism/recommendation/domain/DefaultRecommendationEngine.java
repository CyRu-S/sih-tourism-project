package com.sih.tourism.recommendation.domain;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.StringJoiner;
import java.util.stream.Collectors;

public final class DefaultRecommendationEngine implements RecommendationEngine {
    private static final double EARTH_RADIUS_KM = 6371.0088;

    @Override
    public List<RecommendationResult> rank(
            RecommendationQuery query,
            List<RecommendationCandidate> candidates
    ) {
        if (query == null || candidates == null || query.limit() <= 0) {
            return List.of();
        }

        List<RecommendationResult> scored = candidates.stream()
                .filter(candidate -> candidate != null)
                .map(candidate -> score(query, candidate))
                .filter(result -> isEligible(query, result))
                .sorted(resultComparator())
                .toList();

        return diversify(scored, query.limit());
    }

    private RecommendationResult score(RecommendationQuery query, RecommendationCandidate candidate) {
        double distanceKm = haversineKm(
                query.latitude(), query.longitude(), candidate.latitude(), candidate.longitude());
        double preference = preference(query.interests(), candidate);
        double distance = distanceScore(distanceKm, query.maxDistanceKm());
        double hiddenness = normalized(candidate.hiddenScore());
        double crowdFit = crowdFit(query.crowdPreference(), candidate.crowdEstimate());
        double accessibility = accessibilityScore(query.accessibilityNeeds(), candidate);
        double curation = normalized(candidate.curationScore());
        double finalScore = 100 * (
                RecommendationWeights.PREFERENCE * preference
                        + RecommendationWeights.DISTANCE * distance
                        + RecommendationWeights.HIDDENNESS * hiddenness
                        + RecommendationWeights.CROWD_FIT * crowdFit
                        + RecommendationWeights.ACCESSIBILITY * accessibility
                        + RecommendationWeights.CURATION * curation);

        ScoreBreakdown breakdown = new ScoreBreakdown(
                preference, distance, hiddenness, crowdFit, accessibility, curation, finalScore);
        return new RecommendationResult(
                candidate, distanceKm, finalScore, breakdown, explanation(query, candidate, distanceKm, preference));
    }

    private boolean isEligible(RecommendationQuery query, RecommendationResult result) {
        boolean wheelchairRequired = query.accessibilityNeeds() != null
                && query.accessibilityNeeds().contains(AccessibilityNeed.WHEELCHAIR);
        return !wheelchairRequired || result.candidate().wheelchairAccessible();
    }

    private List<RecommendationResult> diversify(List<RecommendationResult> results, int limit) {
        List<RecommendationResult> remaining = new ArrayList<>(results);
        List<RecommendationResult> selected = new ArrayList<>();
        Set<String> categories = new HashSet<>();

        while (!remaining.isEmpty() && selected.size() < limit) {
            int nextIndex = -1;
            for (int index = 0; index < remaining.size(); index++) {
                if (!categories.contains(remaining.get(index).candidate().category())) {
                    nextIndex = index;
                    break;
                }
            }
            if (nextIndex < 0) {
                nextIndex = 0;
            }
            RecommendationResult next = remaining.remove(nextIndex);
            selected.add(next);
            categories.add(next.candidate().category());
        }
        return List.copyOf(selected);
    }

    private Comparator<RecommendationResult> resultComparator() {
        return Comparator.comparingDouble(RecommendationResult::finalScore)
                .reversed()
                .thenComparingDouble(RecommendationResult::distanceKm)
                .thenComparing(result -> result.candidate().placeId(), Comparator.nullsLast(Comparator.naturalOrder()));
    }

    private double preference(Set<String> interests, RecommendationCandidate candidate) {
        if (interests == null || interests.isEmpty()) {
            return 0;
        }
        Set<String> normalizedInterests = interests.stream()
                .filter(interest -> interest != null)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
        if (normalizedInterests.isEmpty()) {
            return 0;
        }
        Set<String> matches = new HashSet<>(candidate.tags() == null ? Set.of() : candidate.tags());
        matches.add(candidate.category());
        matches.retainAll(normalizedInterests);
        return clamp((double) matches.size() / normalizedInterests.size());
    }

    private double distanceScore(double distanceKm, double maxDistanceKm) {
        if (maxDistanceKm <= 0) {
            return 0;
        }
        return clamp(1 - distanceKm / maxDistanceKm);
    }

    private double crowdFit(CrowdPreference preference, CrowdEstimate estimate) {
        if (preference == null || preference == CrowdPreference.ANY || estimate == null) {
            return 1;
        }
        if (preference == CrowdPreference.LOW) {
            return switch (estimate.level()) {
                case LOW -> 1;
                case MEDIUM -> 0.5;
                case HIGH -> 0;
            };
        }
        return switch (estimate.level()) {
            case LOW -> 0.5;
            case MEDIUM -> 1;
            case HIGH -> 0.25;
        };
    }

    private double accessibilityScore(Set<AccessibilityNeed> needs, RecommendationCandidate candidate) {
        if (needs == null || needs.isEmpty()) {
            return 1;
        }
        int met = 0;
        if (needs.contains(AccessibilityNeed.WHEELCHAIR) && candidate.wheelchairAccessible()) {
            met++;
        }
        if (needs.contains(AccessibilityNeed.PARKING) && candidate.parkingAvailable()) {
            met++;
        }
        if (needs.contains(AccessibilityNeed.PUBLIC_TRANSPORT) && candidate.publicTransport()) {
            met++;
        }
        return clamp((double) met / needs.size());
    }

    private String explanation(
            RecommendationQuery query,
            RecommendationCandidate candidate,
            double distanceKm,
            double preference
    ) {
        StringJoiner explanation = new StringJoiner("; ");
        Set<String> interests = query.interests() == null ? Set.of() : query.interests();
        List<String> matches = interests.stream()
                .filter(interest -> interest != null && (interest.equalsIgnoreCase(candidate.category())
                        || (candidate.tags() != null && candidate.tags().stream()
                        .anyMatch(tag -> interest.equalsIgnoreCase(tag)))))
                .sorted()
                .toList();
        if (!matches.isEmpty()) {
            explanation.add("Matches " + String.join(", ", matches));
        }
        explanation.add(String.format(Locale.ROOT, "%.2f km away", distanceKm));
        if (candidate.crowdEstimate() != null) {
            explanation.add("Estimated crowd " + candidate.crowdEstimate().level().name().toLowerCase(Locale.ROOT));
        }
        if (preference == 0 && !interests.isEmpty()) {
            explanation.add("No requested interests matched");
        }
        if (candidate.hiddenScore() > 0) {
            explanation.add("Hiddenness score " + candidate.hiddenScore());
        }
        return explanation.toString();
    }

    private double normalized(int score) {
        return clamp(score / 100.0);
    }

    private double clamp(double value) {
        return Math.max(0, Math.min(1, value));
    }

    private double haversineKm(double latitude1, double longitude1, double latitude2, double longitude2) {
        double latitudeDistance = Math.toRadians(latitude2 - latitude1);
        double longitudeDistance = Math.toRadians(longitude2 - longitude1);
        double haversine = Math.sin(latitudeDistance / 2) * Math.sin(latitudeDistance / 2)
                + Math.cos(Math.toRadians(latitude1)) * Math.cos(Math.toRadians(latitude2))
                * Math.sin(longitudeDistance / 2) * Math.sin(longitudeDistance / 2);
        return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(haversine));
    }
}
