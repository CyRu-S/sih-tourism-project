package com.sih.tourism.recommendation.api.dto;

import com.sih.tourism.crowd.domain.CrowdEstimate;

import java.util.Map;

public class RecommendationResponse {
    private Long placeId;
    private String name;
    private String category;
    private Location location;
    private Double distanceKm;
    private Integer score;
    private CrowdEstimate estimatedCrowd;
    private Map<String, Double> scoreBreakdown;
    private String why;

    public RecommendationResponse(Long placeId, String name, String category, Location location, Double distanceKm, Integer score, CrowdEstimate estimatedCrowd, Map<String, Double> scoreBreakdown, String why) {
        this.placeId = placeId;
        this.name = name;
        this.category = category;
        this.location = location;
        this.distanceKm = distanceKm;
        this.score = score;
        this.estimatedCrowd = estimatedCrowd;
        this.scoreBreakdown = scoreBreakdown;
        this.why = why;
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

        public Builder placeId(Long placeId) { this.placeId = placeId; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder location(Location location) { this.location = location; return this; }
        public Builder distanceKm(Double distanceKm) { this.distanceKm = distanceKm; return this; }
        public Builder score(Integer score) { this.score = score; return this; }
        public Builder estimatedCrowd(CrowdEstimate estimatedCrowd) { this.estimatedCrowd = estimatedCrowd; return this; }
        public Builder scoreBreakdown(Map<String, Double> scoreBreakdown) { this.scoreBreakdown = scoreBreakdown; return this; }
        public Builder why(String why) { this.why = why; return this; }
        
        public RecommendationResponse build() { 
            return new RecommendationResponse(placeId, name, category, location, distanceKm, score, estimatedCrowd, scoreBreakdown, why); 
        }
    }

    public static class Location {
        private Double lat;
        private Double lng;

        public Location(Double lat, Double lng) {
            this.lat = lat;
            this.lng = lng;
        }

        public Double getLat() { return lat; }
        public Double getLng() { return lng; }

        public static LocationBuilder builder() { return new LocationBuilder(); }

        public static class LocationBuilder {
            private Double lat;
            private Double lng;
            public LocationBuilder lat(Double lat) { this.lat = lat; return this; }
            public LocationBuilder lng(Double lng) { this.lng = lng; return this; }
            public Location build() { return new Location(lat, lng); }
        }
    }
}
