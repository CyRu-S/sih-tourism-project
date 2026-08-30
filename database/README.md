# Hyper-Local Tourism Database Documentation
This directory contains the database design, schema setup, performance optimization, and initial demo seed data for the SIH Hyper-Local Tourism project (implemented by Member 3).

## Purpose of the Database
The database serves as the foundation for storing and query-retrieving hyper-local tourist locations, user-generated tags, and crowd profile estimates.

## Database Engine
- **Engine:** PostgreSQL / Supabase
- **Special Note:** No PostGIS extension is required. Nearby and radius-based searches are performed using standard numeric latitude/longitude bounding-box filtering at the database layer (for candidate retrieval) and Haversine-based distance calculations at the application/backend service layer.

---

## Schema & Tables

### 1. `places`
Stores the core information of tourist places.
*   **`id`** (`BIGSERIAL PRIMARY KEY`): Unique place identifier.
*   **`name`** (`VARCHAR(140) NOT NULL`): The name of the tourism site.
*   **`description`** (`TEXT NOT NULL`): Detailed write-up/history of the place.
*   **`locality`** (`VARCHAR(120)`): Village/town and state info.
*   **`latitude`** (`NUMERIC(9,6) NOT NULL`): Latitudinal coordinate. (Constraint: `-90.000000` to `90.000000`)
*   **`longitude`** (`NUMERIC(9,6) NOT NULL`): Longitudinal coordinate. (Constraint: `-180.000000` to `180.000000`)
*   **`category`** (`VARCHAR(40) NOT NULL`): Category classification (e.g., `heritage`, `nature`, `spiritual`, `beach`).
*   **`hidden_score`** (`SMALLINT NOT NULL`): Measure of how hidden/undiscovered a place is. (Constraint: `0` to `100`)
*   **`popularity_score`** (`SMALLINT NOT NULL`): Tourism popularity. (Constraint: `0` to `100`)
*   **`curation_score`** (`SMALLINT NOT NULL`): Platform validation/curation rating. (Constraint: `0` to `100`)
*   **`best_visit_time`** (`VARCHAR(120)`): Recommended months or seasons.
*   **`image_url`** (`TEXT`): URL to a representative photo.
*   **`source_name`** (`VARCHAR(80)`): Government or tourism platform source name.
*   **`source_ref`** (`TEXT`): URL references or source documents.
*   **`wheelchair_accessible`** (`BOOLEAN DEFAULT FALSE`): Wheelchair access availability.
*   **`parking_available`** (`BOOLEAN DEFAULT FALSE`): Visitor vehicle parking availability.
*   **`public_transport`** (`BOOLEAN DEFAULT FALSE`): Availability of transit routes nearby.
*   **`walking_difficulty`** (`VARCHAR(20)`): Walking effort classification. (Constraint: `EASY`, `MODERATE`, `HARD`)
*   **`active`** (`BOOLEAN NOT NULL DEFAULT TRUE`): Status flag for active listings.
*   **`created_at`** (`TIMESTAMPTZ NOT NULL DEFAULT NOW()`): Insertion timestamp.

### 2. `place_tags`
Represents tag associations to categories or experiences.
*   **`place_id`** (`BIGINT NOT NULL`): References `places.id`.
*   **`tag`** (`VARCHAR(40) NOT NULL`): Descriptors like `photography`, `peaceful`, `trekking`.
*   **Primary Key:** Composite `(place_id, tag)`
*   **Foreign Key Constraint:** `place_id` references `places(id)` with `ON DELETE CASCADE`.

### 3. `crowd_profiles`
Maintains estimated crowd level indexing for weekly scheduling.
*   **`place_id`** (`BIGINT NOT NULL`): References `places.id`.
*   **`day_type`** (`VARCHAR(10) NOT NULL`): Day segment. (Constraint: `WEEKDAY`, `WEEKEND`)
*   **`time_bucket`** (`VARCHAR(15) NOT NULL`): Time segment. (Constraint: `MORNING`, `AFTERNOON`, `EVENING`, `NIGHT`)
*   **`crowd_index`** (`NUMERIC(4,3) NOT NULL`): Normalized crowd index. (Constraint: `0.000` to `1.000`)
*   **Primary Key:** Composite `(place_id, day_type, time_bucket)`
*   **Foreign Key Constraint:** `place_id` references `places(id)` with `ON DELETE CASCADE`.

---

## Indexing Strategy
The database contains optimized indexes to support fast, real-time lookups:
1.  **`idx_places_active_category`**: Speeds up queries requesting active places in a given category.
2.  **`idx_places_latitude`** & **`idx_places_longitude`**: Facilitates rapid bounding-box latitude/longitude filtering.
3.  **`idx_place_tags_tag`**: Accelerates searching for places matching a specific interest tag.
4.  **`idx_crowd_profile_lookup`**: Compound index that allows instantaneous lookup of crowd levels.

---

## Execution Order of SQL Scripts
When executing these scripts on a fresh database, run them in the following order:
1.  **`sql/001_schema.sql`**: Configures the tables and integrity constraints.
2.  **`sql/002_indexes.sql`**: Constructs the required query indexes.
3.  **`sql/003_seed_places.sql`**: Loads the core places (restarts the ID sequence correctly).
4.  **`sql/004_seed_tags.sql`**: Applies temporary tags.
5.  **`sql/005_seed_crowd_profiles.sql`**: Populates the time-based crowd indices.
6.  **`sql/006_seed_kolkata_demo.sql`**: Adds the frontend's Kolkata demo records so the live app has nearby results. This is not the Member 5 production dataset.
7.  **`sql/007_seed_vijayawada_demo.sql`**: Adds Vijayawada-area records for the physical Android device flow. This is not the Member 5 production dataset.

---

## Seed Data & CSV Files
All seed data is exported in the `seed/` directory:
-   `seed/places.csv`: The initial 8 demo places.
-   `seed/place_tags.csv`: Associated tags for each place.
-   `seed/crowd_profiles.csv`: Full list of 64 crowd combinations (8 places × 2 day types × 4 time buckets).

### Important Data Notice
> [!NOTE]
> The current 8-place dataset (IDs 101–108) and their associated tags and crowd indexes are **TEMPORARY DEMO DATA** designed to establish database state, test query logic, and support system validation.
>
> - Crowd profile values are **simulated/estimates** and do not represent real-world physical measurements.
> - **Member 5** is responsible for delivering the final curated production dataset, which will later replace this demo data.

---

## Security Guidelines
> [!CAUTION]
> **Secrets & Credentials:** Never commit database passwords, Supabase connection strings, API keys, `.env` files, or local configuration secrets to this repository. All credentials must be injected dynamically via environment variables or secret managers in staging and production environments.
