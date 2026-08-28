package com.sih.tourism.crowd.infrastructure;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.time.ZonedDateTime;
import java.util.Optional;

@Repository
public class CrowdProfileRepository {
    private final JdbcTemplate jdbcTemplate;

    public CrowdProfileRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<Double> getCurrentCrowdIndex(Long placeId, ZonedDateTime now) {
        String dayType = isWeekend(now.getDayOfWeek()) ? "WEEKEND" : "WEEKDAY";
        String timeBucket = timeBucket(now.getHour());
        return jdbcTemplate.query(
                        "SELECT crowd_index FROM crowd_profiles WHERE place_id = ? AND day_type = ? AND time_bucket = ?",
                        (resultSet, rowNumber) -> resultSet.getDouble("crowd_index"), placeId, dayType, timeBucket)
                .stream().findFirst();
    }

    private boolean isWeekend(DayOfWeek day) {
        return day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY;
    }

    private String timeBucket(int hour) {
        if (hour >= 5 && hour < 12) return "MORNING";
        if (hour >= 12 && hour < 17) return "AFTERNOON";
        if (hour >= 17 && hour < 22) return "EVENING";
        return "NIGHT";
    }
}
