package com.sih.tourism.recommendation.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public class RecommendationRequest {
    @NotNull
    @Valid
    private Location location;
    private List<String> interests;
    private String category;
    @Min(1) @Max(50)
    private Integer maxDistanceKm;
    @Pattern(regexp = "^(LOW|MEDIUM|ANY)$")
    private String crowdPreference;
    private List<String> accessibilityNeeds;
    @Min(1) @Max(20)
    private Integer limit = 5;

    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }
    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Integer getMaxDistanceKm() { return maxDistanceKm; }
    public void setMaxDistanceKm(Integer maxDistanceKm) { this.maxDistanceKm = maxDistanceKm; }
    public String getCrowdPreference() { return crowdPreference; }
    public void setCrowdPreference(String crowdPreference) { this.crowdPreference = crowdPreference; }
    public List<String> getAccessibilityNeeds() { return accessibilityNeeds; }
    public void setAccessibilityNeeds(List<String> accessibilityNeeds) { this.accessibilityNeeds = accessibilityNeeds; }
    public Integer getLimit() { return limit; }
    public void setLimit(Integer limit) { this.limit = limit; }

    public static class Location {
        @NotNull @Min(-90) @Max(90)
        private Double lat;
        @NotNull @Min(-180) @Max(180)
        private Double lng;
        public Double getLat() { return lat; }
        public void setLat(Double lat) { this.lat = lat; }
        public Double getLng() { return lng; }
        public void setLng(Double lng) { this.lng = lng; }
    }
}
