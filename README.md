# AI Module

Plain Java implementation of the frozen SIH Hyper-Local Tourism recommendation contract.

The AI module depends only on `RecommendationQuery`, `RecommendationCandidate`, and the
other domain records in `com.sih.tourism.recommendation.domain`. It has no database,
Spring, HTTP, or network dependency.

Build and test with Java 17 and Maven:

```text
mvn test
```