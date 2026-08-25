package com.sih.tourism.routing.infrastructure;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "openRouteServiceClient", url = "https://api.openrouteservice.org")
public interface OpenRouteServiceClient {

    @GetMapping("/v2/directions/{profile}")
    String getDirections(
            @RequestHeader("Authorization") String apiKey,
            @RequestParam("start") String start,
            @RequestParam("end") String end,
            @org.springframework.web.bind.annotation.PathVariable("profile") String profile);
}
