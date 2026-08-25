package com.sih.tourism.place.application;

import com.sih.tourism.place.domain.Place;
import com.sih.tourism.place.infrastructure.PlaceJpaEntity;
import com.sih.tourism.place.infrastructure.PlaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlaceService {

    private final PlaceRepository placeRepository;

    public PlaceService(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    public List<Place> getCandidatePlaces(double lat, double lng, double maxDistanceKm) {
        double latDelta = maxDistanceKm / 111.32;
        double lonDelta = maxDistanceKm / (111.32 * Math.cos(Math.toRadians(lat)));

        List<PlaceJpaEntity> entities = placeRepository.findCandidatesInBoundingBox(
                lat - latDelta, lat + latDelta,
                lng - lonDelta, lng + lonDelta
        );

        return entities.stream().map(this::mapToDomain).collect(Collectors.toList());
    }

    public Place getPlaceById(Long id) {
        return placeRepository.findById(id)
                .map(this::mapToDomain)
                .orElse(null);
    }

    private Place mapToDomain(PlaceJpaEntity entity) {
        return Place.builder()
                .id(entity.getId())
                .name(entity.getName())
                .category(entity.getCategory())
                .lat(entity.getLatitude())
                .lng(entity.getLongitude())
                .build();
    }
}
