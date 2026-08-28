package com.sih.tourism.place.api.dto;

import com.sih.tourism.crowd.domain.CrowdEstimate;
import com.sih.tourism.place.domain.Place;
import com.sih.tourism.recommendation.api.dto.RecommendationResponse;

import java.util.List;
import java.util.Locale;

public class PlaceDetailsResponse {
    private final Long placeId;
    private final String name;
    private final String category;
    private final Location location;
    private final Double distanceKm;
    private final CrowdEstimate estimatedCrowd;
    private final String description;
    private final List<String> tags;
    private final String bestVisitTime;
    private final String accessibility;
    private final RecommendationResponse.Photo photo;
    private final String sourceAttribution;

    private PlaceDetailsResponse(Place place, CrowdEstimate crowd, double distanceKm) {
        this.placeId = place.getId();
        this.name = place.getName();
        this.category = place.getCategory();
        this.location = new Location(place.getLat(), place.getLng());
        this.distanceKm = Math.round(distanceKm * 10.0) / 10.0;
        this.estimatedCrowd = crowd;
        this.description = place.getDescription();
        this.tags = place.getTags().stream().sorted().toList();
        this.bestVisitTime = place.getBestVisitTime();
        this.accessibility = place.isWheelchairAccessible() ? "Wheelchair accessible" : "Limited wheelchair access";
        this.photo = place.getImageUrl() == null ? null : new RecommendationResponse.Photo(place.getImageUrl(), place.getSourceName(), place.getSourceRef());
        this.sourceAttribution = place.getSourceName();
    }

    public static PlaceDetailsResponse from(Place place, CrowdEstimate crowd, double distanceKm) {
        return new PlaceDetailsResponse(place, crowd, distanceKm);
    }
    public Long getPlaceId() { return placeId; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public Location getLocation() { return location; }
    public Double getDistanceKm() { return distanceKm; }
    public CrowdEstimate getEstimatedCrowd() { return estimatedCrowd; }
    public String getDescription() { return description; }
    public List<String> getTags() { return tags; }
    public String getBestVisitTime() { return bestVisitTime; }
    public String getAccessibility() { return accessibility; }
    public RecommendationResponse.Photo getPhoto() { return photo; }
    public String getSourceAttribution() { return sourceAttribution; }
    public record Location(Double lat, Double lng) { }
}
