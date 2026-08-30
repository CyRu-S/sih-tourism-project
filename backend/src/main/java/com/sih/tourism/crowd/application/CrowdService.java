package com.sih.tourism.crowd.application;

import com.sih.tourism.crowd.domain.CrowdEstimate;
import com.sih.tourism.crowd.infrastructure.CrowdProfileRepository;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;

@Service
public class CrowdService {
    private static final ZoneId INDIA_TIME = ZoneId.of("Asia/Kolkata");
    private final CrowdProfileRepository crowdProfileRepository;

    public CrowdService(CrowdProfileRepository crowdProfileRepository) {
        this.crowdProfileRepository = crowdProfileRepository;
    }

    public CrowdEstimate estimateCrowd(Long placeId) {
        double index = crowdProfileRepository.getCurrentCrowdIndex(placeId, ZonedDateTime.now(INDIA_TIME)).orElse(0.5);
        return CrowdEstimate.builder().level(levelFor(index)).index(index).confidence("MEDIUM").build();
    }

    private String levelFor(double index) {
        if (index < 0.34) return "LOW";
        if (index < 0.67) return "MEDIUM";
        return "HIGH";
    }
}
