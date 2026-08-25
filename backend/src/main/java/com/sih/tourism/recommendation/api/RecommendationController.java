package com.sih.tourism.recommendation.api;

import com.sih.tourism.recommendation.api.dto.RecommendationRequest;
import com.sih.tourism.recommendation.api.dto.RecommendationResponse;
import com.sih.tourism.recommendation.application.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping
    public ResponseEntity<List<RecommendationResponse>> getRecommendations(
            @Valid @RequestBody RecommendationRequest request) {
        
        List<RecommendationResponse> responses = recommendationService.getRecommendations(request);
        return ResponseEntity.ok(responses);
    }
}
