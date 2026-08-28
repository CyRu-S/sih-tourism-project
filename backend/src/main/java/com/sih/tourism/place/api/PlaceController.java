package com.sih.tourism.place.api;

import com.sih.tourism.crowd.application.CrowdService;
import com.sih.tourism.place.api.dto.PlaceDetailsResponse;
import com.sih.tourism.place.application.PlaceService;
import com.sih.tourism.place.domain.Place;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/places")
public class PlaceController {
    private static final double EARTH_RADIUS_KM = 6371.0088;
    private final PlaceService placeService;
    private final CrowdService crowdService;

    public PlaceController(PlaceService placeService, CrowdService crowdService) {
        this.placeService = placeService;
        this.crowdService = crowdService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlaceDetailsResponse> getPlaceById(@PathVariable Long id,
            @RequestParam(required = false) Double originLat, @RequestParam(required = false) Double originLng) {
        Place place = placeService.getPlaceById(id);
        if (place == null) return ResponseEntity.notFound().build();
        double distance = originLat == null || originLng == null ? 0 : haversine(originLat, originLng, place.getLat(), place.getLng());
        return ResponseEntity.ok(PlaceDetailsResponse.from(place, crowdService.estimateCrowd(id), distance));
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
