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
        double longitudeDivisor = 111.32 * Math.cos(Math.toRadians(lat));
        double lonDelta = Math.abs(longitudeDivisor) < 0.0001 ? 180 : maxDistanceKm / longitudeDivisor;
        return placeRepository.findCandidatesInBoundingBox(lat - latDelta, lat + latDelta, lng - lonDelta, lng + lonDelta).stream()
                .map(this::mapToDomain).collect(Collectors.toList());
    }

    public Place getPlaceById(Long id) {
        return placeRepository.findById(id).map(this::mapToDomain).orElse(null);
    }

    private Place mapToDomain(PlaceJpaEntity entity) {
        return Place.builder()
                .id(entity.getId()).name(entity.getName()).description(entity.getDescription())
                .locality(entity.getLocality()).category(entity.getCategory())
                .lat(entity.getLatitude()).lng(entity.getLongitude())
                .hiddenScore(zeroIfNull(entity.getHiddenScore())).popularityScore(zeroIfNull(entity.getPopularityScore()))
                .curationScore(zeroIfNull(entity.getCurationScore())).bestVisitTime(entity.getBestVisitTime())
                .imageUrl(entity.getImageUrl()).sourceName(entity.getSourceName()).sourceRef(entity.getSourceRef())
                .wheelchairAccessible(Boolean.TRUE.equals(entity.getWheelchairAccessible()))
                .parkingAvailable(Boolean.TRUE.equals(entity.getParkingAvailable()))
                .publicTransport(Boolean.TRUE.equals(entity.getPublicTransport()))
                .walkingDifficulty(entity.getWalkingDifficulty()).adminStatus(entity.getAdminStatus()).tags(entity.getTags()).build();
    }

    private int zeroIfNull(Integer value) { return value == null ? 0 : value; }
}
