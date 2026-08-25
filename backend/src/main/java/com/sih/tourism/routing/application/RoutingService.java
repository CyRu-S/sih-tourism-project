package com.sih.tourism.routing.application;

import com.sih.tourism.common.config.AppProperties;
import com.sih.tourism.place.application.PlaceService;
import com.sih.tourism.place.domain.Place;
import com.sih.tourism.routing.api.dto.RouteResponse;
import com.sih.tourism.routing.infrastructure.OpenRouteServiceClient;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class RoutingService {

    private static final Logger log = LoggerFactory.getLogger(RoutingService.class);

    private final OpenRouteServiceClient openRouteServiceClient;
    private final AppProperties appProperties;
    private final PlaceService placeService;

    public RoutingService(OpenRouteServiceClient openRouteServiceClient, AppProperties appProperties, PlaceService placeService) {
        this.openRouteServiceClient = openRouteServiceClient;
        this.appProperties = appProperties;
        this.placeService = placeService;
    }

    @Cacheable(value = "routes", key = "#placeId + '-' + #originLat + '-' + #originLng + '-' + #mode")
    @CircuitBreaker(name = "orsCircuitBreaker", fallbackMethod = "routeFallback")
    public RouteResponse getRoute(Long placeId, Double originLat, Double originLng, String mode) {
        Place place = placeService.getPlaceById(placeId);
        if (place == null) {
            throw new IllegalArgumentException("Place not found");
        }
        
        String profile = "foot-walking";
        if ("cycling-regular".equals(mode)) profile = "cycling-regular";
        if ("driving-car".equals(mode)) profile = "driving-car";

        String start = originLng + "," + originLat;
        String end = place.getLng() + "," + place.getLat();

        String jsonResponse = openRouteServiceClient.getDirections(
                appProperties.getRouting().getOrsApiKey(), start, end, profile);
                
        return RouteResponse.builder()
                .provider("openrouteservice")
                .distanceMeters(1500.0) // Mocked from parsing
                .durationSeconds(900.0) // Mocked from parsing
                .geometry(RouteResponse.Geometry.builder()
                        .type("LineString")
                        .coordinates(Collections.emptyList()) // Mocked from parsing
                        .build())
                .cached(false)
                .build();
    }

    public RouteResponse routeFallback(Long placeId, Double originLat, Double originLng, String mode, Throwable t) {
        log.error("Routing failed, fallback activated: {}", t.getMessage());
        throw new RuntimeException("503 ROUTING_UNAVAILABLE");
    }
}
