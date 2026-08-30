package com.sih.tourism.recommendation.api.dto;

import com.sih.tourism.crowd.domain.CrowdEstimate;

import java.util.List;
import java.util.Map;

public class RecommendationResponse {
    private final Long placeId;
    private final String name;
    private final String category;
    private final Location location;
    private final Double distanceKm;
    private final Integer score;
    private final CrowdEstimate estimatedCrowd;
    private final Map<String, Double> scoreBreakdown;
    private final String why;
    private final String description;
    private final List<String> tags;
    private final String bestVisitTime;
    private final String accessibility;
    private final Photo photo;
    private final String sourceAttribution;

    private RecommendationResponse(Builder builder) {
        placeId = builder.placeId;
        name = builder.name;
        category = builder.category;
        location = builder.location;
        distanceKm = builder.distanceKm;
        score = builder.score;
        estimatedCrowd = builder.estimatedCrowd;
        scoreBreakdown = builder.scoreBreakdown;
        why = builder.why;
        description = builder.description;
        tags = builder.tags;
        bestVisitTime = builder.bestVisitTime;
        accessibility = builder.accessibility;
        photo = builder.photo;
        sourceAttribution = builder.sourceAttribution;
    }

    public Long getPlaceId() { return placeId; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public Location getLocation() { return location; }
    public Double getDistanceKm() { return distanceKm; }
    public Integer getScore() { return score; }
    public CrowdEstimate getEstimatedCrowd() { return estimatedCrowd; }
    public Map<String, Double> getScoreBreakdown() { return scoreBreakdown; }
    public String getWhy() { return why; }
    public String getDescription() { return description; }
    public List<String> getTags() { return tags; }
    public String getBestVisitTime() { return bestVisitTime; }
    public String getAccessibility() { return accessibility; }
    public Photo getPhoto() { return photo; }
    public String getSourceAttribution() { return sourceAttribution; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long placeId;
        private String name;
        private String category;
        private Location location;
        private Double distanceKm;
        private Integer score;
        private CrowdEstimate estimatedCrowd;
        private Map<String, Double> scoreBreakdown;
        private String why;
        private String description;
        private List<String> tags = List.of();
        private String bestVisitTime;
        private String accessibility;
        private Photo photo;
        private String sourceAttribution;
        public Builder placeId(Long value) { placeId = value; return this; }
        public Builder name(String value) { name = value; return this; }
        public Builder category(String value) { category = value; return this; }
        public Builder location(Location value) { location = value; return this; }
        public Builder distanceKm(Double value) { distanceKm = value; return this; }
        public Builder score(Integer value) { score = value; return this; }
        public Builder estimatedCrowd(CrowdEstimate value) { estimatedCrowd = value; return this; }
        public Builder scoreBreakdown(Map<String, Double> value) { scoreBreakdown = value; return this; }
        public Builder why(String value) { why = value; return this; }
        public Builder description(String value) { description = value; return this; }
        public Builder tags(List<String> value) { tags = value == null ? List.of() : List.copyOf(value); return this; }
        public Builder bestVisitTime(String value) { bestVisitTime = value; return this; }
        public Builder accessibility(String value) { accessibility = value; return this; }
        public Builder photo(Photo value) { photo = value; return this; }
        public Builder sourceAttribution(String value) { sourceAttribution = value; return this; }
        public RecommendationResponse build() { return new RecommendationResponse(this); }
    }

    public record Location(Double lat, Double lng) { }
    public record Photo(String url, String credit, String source) { }
}
