import csv
from pathlib import Path


# --------------------------------------------------
# PROJECT PATHS
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent

DATASET_FILE = (
    PROJECT_ROOT
    / "data"
    / "curated"
    / "places_curated.csv"
)


# --------------------------------------------------
# RECOMMENDATION SETTINGS
# --------------------------------------------------

MAX_RESULTS = 5


# --------------------------------------------------
# LOAD DATASET
# --------------------------------------------------

def load_places():
    """Load curated tourism places from CSV."""

    with open(
        DATASET_FILE,
        "r",
        encoding="utf-8",
        newline=""
    ) as file:

        reader = csv.DictReader(file)

        places = list(reader)

    return places


# --------------------------------------------------
# CONVERT CSV VALUES
# --------------------------------------------------

def to_number(value):
    """Convert a CSV value to float."""

    try:
        return float(value)
    except (ValueError, TypeError):
        return 0.0


# --------------------------------------------------
# CALCULATE RECOMMENDATION SCORE
# --------------------------------------------------

def calculate_score(place, preferences):
    """
    Calculate a recommendation score.

    Current weighting:
    - hiddenness: 30%
    - curation quality: 30%
    - popularity: 15%
    - category match: 25%
    """

    hidden_score = to_number(
        place["hidden_score"]
    )

    popularity_score = to_number(
        place["popularity_score"]
    )

    curation_score = to_number(
        place["curation_score"]
    )

    score = 0

    # Hiddenness preference
    if preferences.get("prefer_hidden", True):
        score += hidden_score * 0.30

    # Curation quality
    score += curation_score * 0.30

    # Category preference
    preferred_category = preferences.get(
        "category"
    )

    if (
        preferred_category
        and place["category"].lower()
        == preferred_category.lower()
    ):
        score += 25

    # Popularity preference
    if preferences.get("prefer_popular"):
        score += popularity_score * 0.15
    else:
        # Lower popularity is slightly preferred
        # when the user wants lesser-known places.
        score += (100 - popularity_score) * 0.15

    return round(score, 2)


# --------------------------------------------------
# RECOMMEND PLACES
# --------------------------------------------------

def recommend_places(preferences):
    """Return ranked tourism recommendations."""

    places = load_places()

    results = []

    for place in places:

        score = calculate_score(
            place,
            preferences
        )

        results.append(
            {
                "place": place,
                "score": score,
            }
        )

    results.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    return results[:MAX_RESULTS]


# --------------------------------------------------
# DISPLAY RESULTS
# --------------------------------------------------

def display_recommendations(results):

    print()
    print("=" * 60)
    print("RECOMMENDED PLACES")
    print("=" * 60)

    for index, result in enumerate(
        results,
        start=1
    ):

        place = result["place"]

        print()
        print(
            f"{index}. {place['name']}"
        )

        print(
            f"   Category: "
            f"{place['category']}"
        )

        print(
            f"   Location: "
            f"{place['locality']}, "
            f"{place['district']}"
        )

        print(
            f"   Hiddenness: "
            f"{place['hidden_score']}"
        )

        print(
            f"   Recommendation score: "
            f"{result['score']}"
        )

        print(
            f"   Visit time: "
            f"{place['best_visit_time']}"
        )


# --------------------------------------------------
# TEST RECOMMENDATION
# --------------------------------------------------

if __name__ == "__main__":

    preferences = {
        "category": "nature",
        "prefer_hidden": True,
        "prefer_popular": False,
        # "category": "heritage",
        # "prefer_hidden": False,
        # "prefer_popular": True,
    }

    results = recommend_places(
        preferences
    )

    display_recommendations(results)