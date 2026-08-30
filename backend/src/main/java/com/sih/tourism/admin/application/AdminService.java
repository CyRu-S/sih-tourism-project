package com.sih.tourism.admin.application;

import com.sih.tourism.place.infrastructure.PlaceJpaEntity;
import com.sih.tourism.place.infrastructure.PlaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {
    private final PlaceRepository placeRepository;

    public AdminService(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    public Map<String, Object> getDashboardStats() {
        List<PlaceJpaEntity> allPlaces = placeRepository.findAll();
        
        long totalPlaces = allPlaces.size();
        // Mock logic for hackathon
        long pendingSubmissions = 7; 
        long recommendationsToday = 268;
        long verifiedVisitsToday = 91;
        long overexposed = allPlaces.stream().filter(p -> "REDUCE".equals(p.getAdminStatus())).count();
        long underexposed = allPlaces.stream().filter(p -> "PROMOTE".equals(p.getAdminStatus())).count();

        List<Map<String, Object>> placesData = allPlaces.stream().map(p -> {
            return Map.<String, Object>of(
                "id", p.getId(),
                "place", p.getName(),
                "crowd", p.getPopularityScore() != null && p.getPopularityScore() > 70 ? "High" : "Low",
                "recommended", (int)(Math.random() * 50),
                "visits", (int)(Math.random() * 30),
                "status", p.getAdminStatus() != null ? p.getAdminStatus() : "NORMAL"
            );
        }).collect(Collectors.toList());

        return Map.of(
            "stats", Map.of(
                "totalVerifiedPlaces", totalPlaces,
                "pendingSubmissions", pendingSubmissions,
                "recommendationsToday", recommendationsToday,
                "verifiedVisitsToday", verifiedVisitsToday,
                "overexposedDestinations", overexposed,
                "underexposedDestinations", underexposed
            ),
            "places", placesData
        );
    }

    @Transactional
    public void updatePlaceStatus(Long id, String status) {
        placeRepository.findById(id).ifPresent(place -> {
            place.setAdminStatus(status);
            placeRepository.save(place);
        });
    }
}
