package com.sih.tourism.crowd.application;

import com.sih.tourism.crowd.domain.CrowdEstimate;
import com.sih.tourism.crowd.infrastructure.CrowdProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class CrowdService {

    private final CrowdProfileRepository crowdProfileRepository;

    public CrowdService(CrowdProfileRepository crowdProfileRepository) {
        this.crowdProfileRepository = crowdProfileRepository;
    }

    public CrowdEstimate estimateCrowd(Long placeId) {
        String profile = crowdProfileRepository.getProfile(placeId);
        
        return CrowdEstimate.builder()
                .level(profile)
                .index(0.28)
                .confidence("MEDIUM")
                .build();
    }
}
