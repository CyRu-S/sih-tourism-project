package com.sih.tourism.routing.api;

import com.sih.tourism.routing.api.dto.RouteResponse;
import com.sih.tourism.routing.application.RoutingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/places")
public class RouteController {

    private final RoutingService routingService;

    public RouteController(RoutingService routingService) {
        this.routingService = routingService;
    }

    @GetMapping("/{id}/route")
    public ResponseEntity<?> getRoute(
            @PathVariable Long id,
            @RequestParam Double originLat,
            @RequestParam Double originLng,
            @RequestParam(defaultValue = "foot-walking") String mode) {
        
        try {
            RouteResponse response = routingService.getRoute(id, originLat, originLng, mode);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("ROUTING_UNAVAILABLE")) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(e.getMessage());
            }
            throw e;
        }
    }
}
