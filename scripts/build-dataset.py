import csv
from pathlib import Path


# --------------------------------------------------
# PROJECT PATHS
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent

RAW_DIR = PROJECT_ROOT / "data" / "raw"
CURATED_DIR = PROJECT_ROOT / "data" / "curated"

RAW_FILE = RAW_DIR / "candidate_places.csv"
CURATED_FILE = CURATED_DIR / "places_curated.csv"


# --------------------------------------------------
# CURATED DATASET SCHEMA
# --------------------------------------------------

COLUMNS = [
    "place_id",
    "name",
    "description",
    "category",
    "locality",
    "district",
    "latitude",
    "longitude",
    "hidden_score",
    "popularity_score",
    "curation_score",
    "best_visit_time",
    "wheelchair_access",
    "parking_available",
    "public_transport",
    "walking_difficulty",
    "tags_source",
    "source_name",
    "source_ref",
    "notes",
]


# --------------------------------------------------
# VALIDATION RULES
# --------------------------------------------------

VALID_CATEGORIES = {
    "nature",
    "heritage",
    "photography",
    "food",
    "adventure",
    "peaceful",
    "local-culture",
    "wildlife",
}


VALID_WALKING_DIFFICULTIES = {
    "EASY",
    "MODERATE",
    "HARD",
}


REQUIRED_FIELDS = {
    "place_id",
    "name",
    "description",
    "category",
    "locality",
    "district",
    "latitude",
    "longitude",
}


# --------------------------------------------------
# VALIDATION FUNCTIONS
# --------------------------------------------------

def validate_place(place):
    """Validate one tourism place record."""

    # Required fields
    for field in REQUIRED_FIELDS:
        if not place.get(field):
            raise ValueError(
                f"Missing required field '{field}' "
                f"for place: {place.get('name', 'UNKNOWN')}"
            )

    # Place ID
    try:
        int(place["place_id"])
    except ValueError:
        raise ValueError(
            f"Invalid place_id for {place['name']}"
        )

    # Coordinates
    latitude = float(place["latitude"])
    longitude = float(place["longitude"])

    if not -90 <= latitude <= 90:
        raise ValueError(
            f"Invalid latitude for {place['name']}"
        )

    if not -180 <= longitude <= 180:
        raise ValueError(
            f"Invalid longitude for {place['name']}"
        )

    # Category
    if place["category"] not in VALID_CATEGORIES:
        raise ValueError(
            f"Invalid category '{place['category']}' "
            f"for {place['name']}"
        )

    # Scores
    for score_field in [
        "hidden_score",
        "popularity_score",
        "curation_score",
    ]:
        value = place.get(score_field)

        if value not in ("", None):
            score = float(value)

            if not 0 <= score <= 100:
                raise ValueError(
                    f"{score_field} must be between 0 and 100 "
                    f"for {place['name']}"
                )

    # Walking difficulty
    walking = place.get("walking_difficulty", "")

    if walking and walking not in VALID_WALKING_DIFFICULTIES:
        raise ValueError(
            f"Invalid walking difficulty '{walking}' "
            f"for {place['name']}"
        )


# --------------------------------------------------
# BUILD CURATED DATASET
# --------------------------------------------------

def build_curated_dataset():
    """Read raw candidates and create the curated CSV."""

    CURATED_DIR.mkdir(parents=True, exist_ok=True)

    with open(
        RAW_FILE,
        "r",
        encoding="utf-8",
        newline=""
    ) as file:

        reader = csv.DictReader(file)

        raw_columns = reader.fieldnames or []

        print("Raw columns detected:")
        print(raw_columns)

        places = []

        # for row in reader:

        #     # Create a clean record containing only
        #     # our approved schema fields.
        #     place = {
        #         column: row.get(column, "").strip()
        #         for column in COLUMNS
        #     }

        #     validate_place(place)

        #     places.append(place)

        for row in reader:

            # Support the earlier raw-file name
            # "candidate_id" while our final schema uses "place_id".
            if not row.get("place_id") and row.get("candidate_id"):
                row["place_id"] = row["candidate_id"]

            # Create a clean record containing only
            # our approved schema fields.
            place = {
                column: row.get(column, "").strip()
                for column in COLUMNS
            }

            validate_place(place)

            places.append(place)

    with open(
        CURATED_FILE,
        "w",
        encoding="utf-8",
        newline=""
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=COLUMNS
        )

        writer.writeheader()
        writer.writerows(places)

    print()
    print("Dataset successfully generated.")
    print(f"Records: {len(places)}")
    print(f"Output: {CURATED_FILE}")


# --------------------------------------------------
# PROGRAM ENTRY POINT
# --------------------------------------------------

if __name__ == "__main__":
    build_curated_dataset()