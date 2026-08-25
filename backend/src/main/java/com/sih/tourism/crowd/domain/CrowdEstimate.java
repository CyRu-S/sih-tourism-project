package com.sih.tourism.crowd.domain;

public class CrowdEstimate {
    private String level;
    private Double index;
    private String confidence;

    public CrowdEstimate(String level, Double index, String confidence) {
        this.level = level;
        this.index = index;
        this.confidence = confidence;
    }

    public String getLevel() { return level; }
    public Double getIndex() { return index; }
    public String getConfidence() { return confidence; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String level;
        private Double index;
        private String confidence;
        public Builder level(String level) { this.level = level; return this; }
        public Builder index(Double index) { this.index = index; return this; }
        public Builder confidence(String confidence) { this.confidence = confidence; return this; }
        public CrowdEstimate build() { return new CrowdEstimate(level, index, confidence); }
    }
}
