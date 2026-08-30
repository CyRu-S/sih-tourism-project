package com.sih.tourism.routing.api.dto;

import java.util.List;

public class RouteResponse {
    private final String provider;
    private final Double distanceMeters;
    private final Double durationSeconds;
    private final Geometry geometry;
    private final Boolean cached;

    private RouteResponse(Builder builder) {
        provider = builder.provider;
        distanceMeters = builder.distanceMeters;
        durationSeconds = builder.durationSeconds;
        geometry = builder.geometry;
        cached = builder.cached;
    }

    public String getProvider() { return provider; }
    public Double getDistanceMeters() { return distanceMeters; }
    public Double getDurationSeconds() { return durationSeconds; }
    public Double getDistanceKm() { return distanceMeters == null ? null : Math.round(distanceMeters / 100.0) / 10.0; }
    public Double getDurationMinutes() { return durationSeconds == null ? null : Math.round(durationSeconds / 6.0) / 10.0; }
    public Geometry getGeometry() { return geometry; }
    public Boolean getCached() { return cached; }
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String provider;
        private Double distanceMeters;
        private Double durationSeconds;
        private Geometry geometry;
        private Boolean cached;
        public Builder provider(String value) { provider = value; return this; }
        public Builder distanceMeters(Double value) { distanceMeters = value; return this; }
        public Builder durationSeconds(Double value) { durationSeconds = value; return this; }
        public Builder geometry(Geometry value) { geometry = value; return this; }
        public Builder cached(Boolean value) { cached = value; return this; }
        public RouteResponse build() { return new RouteResponse(this); }
    }

    public static class Geometry {
        private final String type;
        private final List<List<Double>> coordinates;
        private Geometry(GeometryBuilder builder) { type = builder.type; coordinates = builder.coordinates; }
        public String getType() { return type; }
        public List<List<Double>> getCoordinates() { return coordinates; }
        public static GeometryBuilder builder() { return new GeometryBuilder(); }
        public static class GeometryBuilder {
            private String type;
            private List<List<Double>> coordinates;
            public GeometryBuilder type(String value) { type = value; return this; }
            public GeometryBuilder coordinates(List<List<Double>> value) { coordinates = value; return this; }
            public Geometry build() { return new Geometry(this); }
        }
    }
}
