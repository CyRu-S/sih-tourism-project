package com.sih.tourism.place.infrastructure;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "places")
public class PlaceJpaEntity {
    @Id
    private Long id;
    private String name;
    private String description;
    private String locality;
    private String category;
    private Double latitude;
    private Double longitude;

    @Column(name = "hidden_score")
    private Integer hiddenScore;
    @Column(name = "popularity_score")
    private Integer popularityScore;
    @Column(name = "curation_score")
    private Integer curationScore;
    @Column(name = "best_visit_time")
    private String bestVisitTime;
    @Column(name = "image_url")
    private String imageUrl;
    @Column(name = "source_name")
    private String sourceName;
    @Column(name = "source_ref")
    private String sourceRef;
    @Column(name = "wheelchair_accessible")
    private Boolean wheelchairAccessible;
    @Column(name = "parking_available")
    private Boolean parkingAvailable;
    @Column(name = "public_transport")
    private Boolean publicTransport;
    @Column(name = "walking_difficulty")
    private String walkingDifficulty;
    private Boolean active;
    @Column(name = "admin_status")
    private String adminStatus = "NORMAL"; // PROMOTE, NORMAL, REDUCE, PAUSE

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "place_tags", joinColumns = @JoinColumn(name = "place_id"))
    @Column(name = "tag")
    private Set<String> tags = new LinkedHashSet<>();

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getLocality() { return locality; }
    public String getCategory() { return category; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public Integer getHiddenScore() { return hiddenScore; }
    public Integer getPopularityScore() { return popularityScore; }
    public Integer getCurationScore() { return curationScore; }
    public String getBestVisitTime() { return bestVisitTime; }
    public String getImageUrl() { return imageUrl; }
    public String getSourceName() { return sourceName; }
    public String getSourceRef() { return sourceRef; }
    public Boolean getWheelchairAccessible() { return wheelchairAccessible; }
    public Boolean getParkingAvailable() { return parkingAvailable; }
    public Boolean getPublicTransport() { return publicTransport; }
    public String getWalkingDifficulty() { return walkingDifficulty; }
    public Boolean getActive() { return active; }
    public String getAdminStatus() { return adminStatus; }
    public void setAdminStatus(String adminStatus) { this.adminStatus = adminStatus; }
    public Set<String> getTags() { return tags; }
}
