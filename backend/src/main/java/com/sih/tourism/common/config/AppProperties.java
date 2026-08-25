package com.sih.tourism.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private Routing routing = new Routing();

    public Routing getRouting() { return routing; }
    public void setRouting(Routing routing) { this.routing = routing; }

    public static class Routing {
        private String orsApiKey;
        public String getOrsApiKey() { return orsApiKey; }
        public void setOrsApiKey(String orsApiKey) { this.orsApiKey = orsApiKey; }
    }
}
