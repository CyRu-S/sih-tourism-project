package com.sih.tourism.crowd.infrastructure;

import org.springframework.stereotype.Repository;

@Repository
public class CrowdProfileRepository {
    // Mock for now based on hackathon doc
    public String getProfile(Long placeId) {
        return "LOW";
    }
}
