package com.sih.tourism.place.api;

import com.sih.tourism.place.api.dto.PlaceDetailsResponse;
import com.sih.tourism.place.application.PlaceService;
import com.sih.tourism.place.domain.Place;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/places")
public class PlaceController {

    private final PlaceService placeService;

    public PlaceController(PlaceService placeService) {
        this.placeService = placeService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlaceDetailsResponse> getPlaceById(@PathVariable Long id) {
        Place place = placeService.getPlaceById(id);
        if (place == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(PlaceDetailsResponse.builder()
                .id(place.getId())
                .name(place.getName())
                .category(place.getCategory())
                .lat(place.getLat())
                .lng(place.getLng())
                .build());
    }
}
