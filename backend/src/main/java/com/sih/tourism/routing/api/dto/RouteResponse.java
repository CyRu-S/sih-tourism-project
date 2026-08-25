package com.sih.tourism.routing.api.dto;

import java.util.List;

public class RouteResponse {
    private String provider;
    private Double distanceMeters;
    private Double durationSeconds;
    private Geometry geometry;
    private Boolean cached;

    public RouteResponse(String provider, Double distanceMeters, Double durationSeconds, Geometry geometry, Boolean cached) {
        this.provider = provider;
        this.distanceMeters = distanceMeters;
        this.durationSeconds = durationSeconds;
        this.geometry = geometry;
        this.cached = cached;
    }

    public String getProvider() { return provider; }
    public Double getDistanceMeters() { return distanceMeters; }
    public Double getDurationSeconds() { return durationSeconds; }
    public Geometry getGeometry() { return geometry; }
    public Boolean getCached() { return cached; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String provider;
        private Double distanceMeters;
        private Double durationSeconds;
        private Geometry geometry;
        private Boolean cached;
        public Builder provider(String provider) { this.provider = provider; return this; }
        public Builder distanceMeters(Double distanceMeters) { this.distanceMeters = distanceMeters; return this; }
        public Builder durationSeconds(Double durationSeconds) { this.durationSeconds = durationSeconds; return this; }
        public Builder geometry(Geometry geometry) { this.geometry = geometry; return this; }
        public Builder cached(Boolean cached) { this.cached = cached; return this; }
        public RouteResponse build() { return new RouteResponse(provider, distanceMeters, durationSeconds, geometry, cached); }
    }

    public static class Geometry {
        private String type;
        private List<List<Double>> coordinates;

        public Geometry(String type, List<List<Double>> coordinates) {
            this.type = type;
            this.coordinates = coordinates;
        }

        public String getType() { return type; }
        public List<List<Double>> getCoordinates() { return coordinates; }

        public static GeometryBuilder builder() { return new GeometryBuilder(); }

        public static class GeometryBuilder {
            private String type;
            private List<List<Double>> coordinates;
            public GeometryBuilder type(String type) { this.type = type; return this; }
            public GeometryBuilder coordinates(List<List<Double>> coordinates) { this.coordinates = coordinates; return this; }
            public Geometry build() { return new Geometry(type, coordinates); }
        }
    }
}
