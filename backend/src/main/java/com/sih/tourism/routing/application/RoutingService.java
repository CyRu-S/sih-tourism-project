package com.sih.tourism.routing.application;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sih.tourism.common.config.AppProperties;
import com.sih.tourism.place.application.PlaceService;
import com.sih.tourism.place.domain.Place;
import com.sih.tourism.routing.api.dto.RouteResponse;
import com.sih.tourism.routing.infrastructure.OpenRouteServiceClient;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoutingService {
    private static final double EARTH_RADIUS_KM = 6371.0088;
    private final OpenRouteServiceClient openRouteServiceClient;
    private final AppProperties appProperties;
    private final PlaceService placeService;
    private final ObjectMapper objectMapper;

    public RoutingService(OpenRouteServiceClient openRouteServiceClient, AppProperties appProperties, PlaceService placeService, ObjectMapper objectMapper) {
        this.openRouteServiceClient = openRouteServiceClient;
        this.appProperties = appProperties;
        this.placeService = placeService;
        this.objectMapper = objectMapper;
    }

    @Cacheable(value = "routes", key = "#placeId + '-' + #originLat + '-' + #originLng + '-' + #mode")
    @CircuitBreaker(name = "orsCircuitBreaker", fallbackMethod = "routeFallback")
    public RouteResponse getRoute(Long placeId, Double originLat, Double originLng, String mode) {
        Place place = requiredPlace(placeId);
        String profile = profileFor(mode);
        if (appProperties.getRouting().getOrsApiKey() == null || appProperties.getRouting().getOrsApiKey().isBlank()) {
            return directRoute(place, originLat, originLng, profile, "straight-line-fallback");
        }
        String json = openRouteServiceClient.getDirections(appProperties.getRouting().getOrsApiKey(),
                originLng + "," + originLat, place.getLng() + "," + place.getLat(), profile);
        return parseRoute(json);
    }

    public RouteResponse routeFallback(Long placeId, Double originLat, Double originLng, String mode, Throwable throwable) {
        return directRoute(requiredPlace(placeId), originLat, originLng, profileFor(mode), "straight-line-fallback");
    }

    private Place requiredPlace(Long placeId) {
        Place place = placeService.getPlaceById(placeId);
        if (place == null) throw new IllegalArgumentException("Place not found");
        return place;
    }

    private RouteResponse parseRoute(String json) {
        try {
            JsonNode feature = objectMapper.readTree(json).path("features").path(0);
            JsonNode summary = feature.path("properties").path("summary");
            List<List<Double>> coordinates = new ArrayList<>();
            for (JsonNode coordinate : feature.path("geometry").path("coordinates")) {
                coordinates.add(List.of(coordinate.get(0).asDouble(), coordinate.get(1).asDouble()));
            }
            if (coordinates.size() < 2 || summary.isMissingNode()) throw new IllegalArgumentException("Invalid route response");
            return RouteResponse.builder().provider("openrouteservice")
                    .distanceMeters(summary.path("distance").asDouble()).durationSeconds(summary.path("duration").asDouble())
                    .geometry(RouteResponse.Geometry.builder().type("LineString").coordinates(coordinates).build()).cached(false).build();
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to parse the routing response", exception);
        }
    }

    private RouteResponse directRoute(Place place, double originLat, double originLng, String profile, String provider) {
        double distanceKm = haversine(originLat, originLng, place.getLat(), place.getLng());
        double speedKmh = switch (profile) {
            case "cycling-regular" -> 16.0;
            case "driving-car" -> 40.0;
            default -> 5.0;
        };
        return RouteResponse.builder().provider(provider).distanceMeters(distanceKm * 1000).durationSeconds(distanceKm / speedKmh * 3600)
                .geometry(RouteResponse.Geometry.builder().type("LineString")
                        .coordinates(List.of(List.of(originLng, originLat), List.of(place.getLng(), place.getLat()))).build())
                .cached(false).build();
    }

    private String profileFor(String mode) {
        return switch (mode) {
            case "driving-car", "drive" -> "driving-car";
            case "cycling-regular", "cycle" -> "cycling-regular";
            default -> "foot-walking";
        };
    }

    private double haversine(double lat1, double lng1, double lat2, double lng2) {
        double latitudeDistance = Math.toRadians(lat2 - lat1);
        double longitudeDistance = Math.toRadians(lng2 - lng1);
        double value = Math.sin(latitudeDistance / 2) * Math.sin(latitudeDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(longitudeDistance / 2) * Math.sin(longitudeDistance / 2);
        return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(value));
    }
}
