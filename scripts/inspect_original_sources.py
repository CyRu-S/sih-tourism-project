import csv
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent

ORIGINAL_FILE = PROJECT_ROOT / "data" / "curated" / "places_curated.csv"
UPDATED_FILE = PROJECT_ROOT / "places_curated_123.csv"

with open(ORIGINAL_FILE, "r", encoding="utf-8", newline="") as file:
    original_rows = {
        row["place_id"]: row
        for row in csv.DictReader(file)
    }

with open(UPDATED_FILE, "r", encoding="utf-8", newline="") as file:
    updated_rows = {
        row["place_id"]: row
        for row in csv.DictReader(file)
    }

print("=" * 80)
print("SOURCE INFORMATION FOR ORIGINAL PLACE IDs 1–15")
print("=" * 80)

for place_id in map(str, range(1, 16)):
    original = original_rows.get(place_id)
    updated = updated_rows.get(place_id)

    if original is None or updated is None:
        print(f"\nPlace ID {place_id}: RECORD NOT FOUND")
        continue

    print(f"\nPlace ID: {place_id}")
    print(f"Name: {original['name']}")
    print(f"Original tags_source: {repr(original['tags_source'])}")
    print(f"Updated tags_source:  {repr(updated['tags_source'])}")
    print(f"Original source_name: {repr(original['source_name'])}")
    print(f"Original source_ref:  {repr(original['source_ref'])}")
    print(f"Original notes:       {repr(original['notes'])}")
    print(f"Updated notes:        {repr(updated['notes'])}")