package com.sih.tourism.place.domain;

public class Place {
    private Long id;
    private String name;
    private String category;
    private Double lat;
    private Double lng;

    public Place(Long id, String name, String category, Double lat, Double lng) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.lat = lat;
        this.lng = lng;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public Double getLat() { return lat; }
    public Double getLng() { return lng; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name;
        private String category;
        private Double lat;
        private Double lng;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder lat(Double lat) { this.lat = lat; return this; }
        public Builder lng(Double lng) { this.lng = lng; return this; }
        public Place build() { return new Place(id, name, category, lat, lng); }
    }
}
