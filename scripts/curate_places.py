import csv
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
RAW_FILE = PROJECT_ROOT / "data" / "raw" / "candidate_places.csv"


# --------------------------------------------------
# CURATION DATA
# --------------------------------------------------

CURATION_DATA = {
    1: {
        "hidden_score": 72,
        "popularity_score": 68,
        "curation_score": 94,
        "best_visit_time": "June-September",
        "wheelchair_access": "UNKNOWN",
        "parking_available": "UNKNOWN",
        "public_transport": "LIMITED",
        "walking_difficulty": "MODERATE",
    },

    2: {
        "hidden_score": 84,
        "popularity_score": 48,
        "curation_score": 96,
        "best_visit_time": "October-March",
        "wheelchair_access": "NO",
        "parking_available": "UNKNOWN",
        "public_transport": "LIMITED",
        "walking_difficulty": "HARD",
    },

    3: {
        "hidden_score": 91,
        "popularity_score": 25,
        "curation_score": 91,
        "best_visit_time": "October-March",
        "wheelchair_access": "NO",
        "parking_available": "LIMITED",
        "public_transport": "LIMITED",
        "walking_difficulty": "HARD",
    },

    4: {
        "hidden_score": 90,
        "popularity_score": 22,
        "curation_score": 89,
        "best_visit_time": "October-March",
        "wheelchair_access": "LIMITED",
        "parking_available": "UNKNOWN",
        "public_transport": "LIMITED",
        "walking_difficulty": "MODERATE",
    },

    5: {
        "hidden_score": 88,
        "popularity_score": 30,
        "curation_score": 92,
        "best_visit_time": "October-March",
        "wheelchair_access": "NO",
        "parking_available": "UNKNOWN",
        "public_transport": "LIMITED",
        "walking_difficulty": "HARD",
    },

    6: {
        "hidden_score": 82,
        "popularity_score": 45,
        "curation_score": 91,
        "best_visit_time": "October-March",
        "wheelchair_access": "LIMITED",
        "parking_available": "UNKNOWN",
        "public_transport": "LIMITED",
        "walking_difficulty": "MODERATE",
    },

    7: {
        "hidden_score": 87,
        "popularity_score": 35,
        "curation_score": 90,
        "best_visit_time": "October-March",
        "wheelchair_access": "UNKNOWN",
        "parking_available": "UNKNOWN",
        "public_transport": "LIMITED",
        "walking_difficulty": "EASY",
    },

    8: {
        "hidden_score": 62,
        "popularity_score": 65,
        "curation_score": 88,
        "best_visit_time": "October-March",
        "wheelchair_access": "UNKNOWN",
        "parking_available": "UNKNOWN",
        "public_transport": "YES",
        "walking_difficulty": "EASY",
    },

    9: {
        "hidden_score": 55,
        "popularity_score": 72,
        "curation_score": 90,
        "best_visit_time": "October-March",
        "wheelchair_access": "NO",
        "parking_available": "UNKNOWN",
        "public_transport": "LIMITED",
        "walking_difficulty": "HARD",
    },

    10: {
        "hidden_score": 76,
        "popularity_score": 52,
        "curation_score": 93,
        "best_visit_time": "October-March",
        "wheelchair_access": "UNKNOWN",
        "parking_available": "UNKNOWN",
        "public_transport": "LIMITED",
        "walking_difficulty": "EASY",
    },

    11: {
        "hidden_score": 58,
        "popularity_score": 70,
        "curation_score": 92,
        "best_visit_time": "November-January",
        "wheelchair_access": "UNKNOWN",
        "parking_available": "YES",
        "public_transport": "LIMITED",
        "walking_difficulty": "EASY",
    },

    12: {
        "hidden_score": 73,
        "popularity_score": 55,
        "curation_score": 87,
        "best_visit_time": "October-March",
        "wheelchair_access": "NO",
        "parking_available": "UNKNOWN",
        "public_transport": "LIMITED",
        "walking_difficulty": "HARD",
    },

    13: {
        "hidden_score": 65,
        "popularity_score": 63,
        "curation_score": 90,
        "best_visit_time": "July-October",
        "wheelchair_access": "UNKNOWN",
        "parking_available": "UNKNOWN",
        "public_transport": "LIMITED",
        "walking_difficulty": "EASY",
    },

    14: {
        "hidden_score": 42,
        "popularity_score": 82,
        "curation_score": 94,
        "best_visit_time": "October-March",
        "wheelchair_access": "LIMITED",
        "parking_available": "UNKNOWN",
        "public_transport": "LIMITED",
        "walking_difficulty": "MODERATE",
    },

        15: {
        "hidden_score": 79,
        "popularity_score": 40,
        "curation_score": 88,
        "best_visit_time": "October-March",
        "wheelchair_access": "UNKNOWN",
        "parking_available": "UNKNOWN",
        "public_transport": "YES",
        "walking_difficulty": "EASY",
    },

    16: {
        "hidden_score": 82,
        "popularity_score": 42,
        "curation_score": 89,
        "best_visit_time": "October-March",
        "wheelchair_access": "UNKNOWN",
        "parking_available": "UNKNOWN",
        "public_transport": "YES",
        "walking_difficulty": "EASY",
    },

    17: {
        "hidden_score": 78,
        "popularity_score": 38,
        "curation_score": 91,
        "best_visit_time": "October-March",
        "wheelchair_access": "UNKNOWN",
        "parking_available": "LIMITED",
        "public_transport": "LIMITED",
        "walking_difficulty": "MODERATE",
    },

    18: {
        "hidden_score": 93,
        "popularity_score": 20,
        "curation_score": 94,
        "best_visit_time": "October-March",
        "wheelchair_access": "LIMITED",
        "parking_available": "LIMITED",
        "public_transport": "LIMITED",
        "walking_difficulty": "MODERATE",
    },

    19: {
        "hidden_score": 74,
        "popularity_score": 58,
        "curation_score": 93,
        "best_visit_time": "October-March",
        "wheelchair_access": "NO",
        "parking_available": "LIMITED",
        "public_transport": "LIMITED",
        "walking_difficulty": "HARD",
    },

    20: {
        "hidden_score": 89,
        "popularity_score": 24,
        "curation_score": 90,
        "best_visit_time": "October-March",
        "wheelchair_access": "UNKNOWN",
        "parking_available": "LIMITED",
        "public_transport": "LIMITED",
        "walking_difficulty": "MODERATE",
    },

    21: {
        "hidden_score": 94,
        "popularity_score": 15,
        "curation_score": 90,
        "best_visit_time": "October-March",
        "wheelchair_access": "NO",
        "parking_available": "LIMITED",
        "public_transport": "LIMITED",
        "walking_difficulty": "HARD",
    },

    22: {
        "hidden_score": 81,
        "popularity_score": 35,
        "curation_score": 91,
        "best_visit_time": "October-March",
        "wheelchair_access": "NO",
        "parking_available": "LIMITED",
        "public_transport": "LIMITED",
        "walking_difficulty": "HARD",
    },

    23: {
        "hidden_score": 92,
        "popularity_score": 18,
        "curation_score": 91,
        "best_visit_time": "October-March",
        "wheelchair_access": "LIMITED",
        "parking_available": "LIMITED",
        "public_transport": "LIMITED",
        "walking_difficulty": "MODERATE",
    },
}

#     15: {
#         "hidden_score": 79,
#         "popularity_score": 40,
#         "curation_score": 88,
#         "best_visit_time": "October-March",
#         "wheelchair_access": "UNKNOWN",
#         "parking_available": "UNKNOWN",
#         "public_transport": "YES",
#         "walking_difficulty": "EASY",
#     },
# }


# --------------------------------------------------
# UPDATE RAW DATASET
# --------------------------------------------------

def update_curation_data():

    with open(
        RAW_FILE,
        "r",
        encoding="utf-8",
        newline=""
    ) as file:

        reader = csv.DictReader(file)
        rows = list(reader)
        columns = reader.fieldnames

    if not columns:
        raise ValueError("CSV header could not be read.")

    updated_count = 0

    for row in rows:

        place_id = int(row["place_id"])

        if place_id in CURATION_DATA:

            row.update(CURATION_DATA[place_id])
            updated_count += 1

    with open(
        RAW_FILE,
        "w",
        encoding="utf-8",
        newline=""
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=columns
        )

        writer.writeheader()
        writer.writerows(rows)

    print("Curation data updated successfully.")
    print(f"Places updated: {updated_count}")
    print(f"File: {RAW_FILE}")


# --------------------------------------------------
# PROGRAM ENTRY POINT
# --------------------------------------------------

if __name__ == "__main__":
    update_curation_data()