package com.sih.tourism.configuration;

import com.sih.tourism.recommendation.domain.DefaultRecommendationEngine;
import com.sih.tourism.recommendation.domain.RecommendationEngine;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RecommendationConfiguration {
    @Bean
    RecommendationEngine recommendationEngine() {
        return new DefaultRecommendationEngine();
    }
}
