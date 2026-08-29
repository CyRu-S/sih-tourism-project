package com.sih.tourism.place.domain;

import java.util.LinkedHashSet;
import java.util.Set;

public class Place {
    private final Long id;
    private final String name;
    private final String description;
    private final String locality;
    private final String category;
    private final Double lat;
    private final Double lng;
    private final int hiddenScore;
    private final int popularityScore;
    private final int curationScore;
    private final String bestVisitTime;
    private final String imageUrl;
    private final String sourceName;
    private final String sourceRef;
    private final boolean wheelchairAccessible;
    private final boolean parkingAvailable;
    private final boolean publicTransport;
    private final String walkingDifficulty;
    private final String adminStatus;
    private final Set<String> tags;

    private Place(Builder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.description = builder.description;
        this.locality = builder.locality;
        this.category = builder.category;
        this.lat = builder.lat;
        this.lng = builder.lng;
        this.hiddenScore = builder.hiddenScore;
        this.popularityScore = builder.popularityScore;
        this.curationScore = builder.curationScore;
        this.bestVisitTime = builder.bestVisitTime;
        this.imageUrl = builder.imageUrl;
        this.sourceName = builder.sourceName;
        this.sourceRef = builder.sourceRef;
        this.wheelchairAccessible = builder.wheelchairAccessible;
        this.parkingAvailable = builder.parkingAvailable;
        this.publicTransport = builder.publicTransport;
        this.walkingDifficulty = builder.walkingDifficulty;
        this.adminStatus = builder.adminStatus != null ? builder.adminStatus : "NORMAL";
        this.tags = Set.copyOf(builder.tags);
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getLocality() { return locality; }
    public String getCategory() { return category; }
    public Double getLat() { return lat; }
    public Double getLng() { return lng; }
    public int getHiddenScore() { return hiddenScore; }
    public int getPopularityScore() { return popularityScore; }
    public int getCurationScore() { return curationScore; }
    public String getBestVisitTime() { return bestVisitTime; }
    public String getImageUrl() { return imageUrl; }
    public String getSourceName() { return sourceName; }
    public String getSourceRef() { return sourceRef; }
    public boolean isWheelchairAccessible() { return wheelchairAccessible; }
    public boolean isParkingAvailable() { return parkingAvailable; }
    public boolean isPublicTransport() { return publicTransport; }
    public String getWalkingDifficulty() { return walkingDifficulty; }
    public String getAdminStatus() { return adminStatus; }
    public Set<String> getTags() { return tags; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name;
        private String description;
        private String locality;
        private String category;
        private Double lat;
        private Double lng;
        private int hiddenScore;
        private int popularityScore;
        private int curationScore;
        private String bestVisitTime;
        private String imageUrl;
        private String sourceName;
        private String sourceRef;
        private boolean wheelchairAccessible;
        private boolean parkingAvailable;
        private boolean publicTransport;
        private String walkingDifficulty;
        private String adminStatus;
        private Set<String> tags = new LinkedHashSet<>();

        public Builder id(Long value) { id = value; return this; }
        public Builder name(String value) { name = value; return this; }
        public Builder description(String value) { description = value; return this; }
        public Builder locality(String value) { locality = value; return this; }
        public Builder category(String value) { category = value; return this; }
        public Builder lat(Double value) { lat = value; return this; }
        public Builder lng(Double value) { lng = value; return this; }
        public Builder hiddenScore(int value) { hiddenScore = value; return this; }
        public Builder popularityScore(int value) { popularityScore = value; return this; }
        public Builder curationScore(int value) { curationScore = value; return this; }
        public Builder bestVisitTime(String value) { bestVisitTime = value; return this; }
        public Builder imageUrl(String value) { imageUrl = value; return this; }
        public Builder sourceName(String value) { sourceName = value; return this; }
        public Builder sourceRef(String value) { sourceRef = value; return this; }
        public Builder wheelchairAccessible(boolean value) { wheelchairAccessible = value; return this; }
        public Builder parkingAvailable(boolean value) { parkingAvailable = value; return this; }
        public Builder publicTransport(boolean value) { publicTransport = value; return this; }
        public Builder walkingDifficulty(String value) { walkingDifficulty = value; return this; }
        public Builder adminStatus(String value) { adminStatus = value; return this; }
        public Builder tags(Set<String> value) { tags = value == null ? new LinkedHashSet<>() : new LinkedHashSet<>(value); return this; }
        public Place build() { return new Place(this); }
    }
}
