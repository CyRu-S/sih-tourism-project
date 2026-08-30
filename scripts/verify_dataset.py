import csv
from pathlib import Path


# --------------------------------------------------
# PROJECT PATHS
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent

UPDATED_FILE = (
    PROJECT_ROOT
    / "data"
    / "curated"
    / "places_curated.csv"
)

TEAMMATE_FILE = (
    PROJECT_ROOT
    / "places_curated_123.csv"
)


# --------------------------------------------------
# SETTINGS
# --------------------------------------------------

ENRICHED_FIELDS = {
    "source_name",
    "source_ref",
    "tags_source",
    "notes",
}

PLACEHOLDER_TEXT = {
    "Not specified in source record",
    "No additional note provided in source record",
}


# --------------------------------------------------
# LOAD CSV
# --------------------------------------------------

def load_csv(path):
    with open(
        path,
        "r",
        encoding="utf-8",
        newline=""
    ) as file:
        return list(csv.DictReader(file))


# --------------------------------------------------
# MAIN VERIFICATION
# --------------------------------------------------

updated = load_csv(UPDATED_FILE)
teammate = load_csv(TEAMMATE_FILE)

print("=" * 70)
print("FINAL DATASET VERIFICATION")
print("=" * 70)

# --------------------------------------------------
# RECORD COUNT
# --------------------------------------------------

print(f"Updated dataset records  : {len(updated)}")
print(f"Teammate dataset records : {len(teammate)}")

if len(updated) == 123 and len(teammate) == 123:
    print("PASS: Both datasets contain 123 records.")
else:
    print("FAIL: Record count mismatch.")


# --------------------------------------------------
# COLUMN CHECK
# --------------------------------------------------

columns = list(updated[0].keys())

print(f"Columns: {len(columns)}")

if len(columns) == 20:
    print("PASS: Dataset contains 20 columns.")
else:
    print("FAIL: Dataset does not contain 20 columns.")


# --------------------------------------------------
# PLACE ID CHECK
# --------------------------------------------------

expected_ids = list(range(1, 124))

updated_ids = [
    int(row["place_id"])
    for row in updated
]

if updated_ids == expected_ids:
    print("PASS: Place IDs 1–123 are present in correct order.")
else:
    print("FAIL: Place IDs are incorrect.")


# --------------------------------------------------
# PLACEHOLDER CHECK
# --------------------------------------------------

placeholder_found = False

for row in updated:
    for field in ["source_name", "source_ref", "tags_source", "notes"]:
        value = row.get(field, "").strip()

        if value in PLACEHOLDER_TEXT:
            print(
                f"FAIL: Placeholder remains in "
                f"ID {row['place_id']} field {field}"
            )
            placeholder_found = True

if not placeholder_found:
    print("PASS: No placeholder source text remains.")


# --------------------------------------------------
# COMPARE DATASETS
# --------------------------------------------------

updated_by_id = {
    int(row["place_id"]): row
    for row in updated
}

teammate_by_id = {
    int(row["place_id"]): row
    for row in teammate
}

unexpected_differences = []

for place_id in range(16, 124):

    current = updated_by_id[place_id]
    original = teammate_by_id[place_id]

    for field in columns:

        # These two fields were intentionally enriched.
        if field in ENRICHED_FIELDS:
            continue

        if current.get(field) != original.get(field):
            unexpected_differences.append(
                f"ID {place_id}: unexpected difference in {field}"
            )


# --------------------------------------------------
# REPORT DATASET DIFFERENCES
# --------------------------------------------------

if not unexpected_differences:
    print(
        "PASS: IDs 16–123 match teammate dataset "
        "in all non-enriched fields."
    )
else:
    print("FAIL: Unexpected differences found:")

    for difference in unexpected_differences:
        print(difference)


# --------------------------------------------------
# ENRICHMENT CHECK
# --------------------------------------------------

enriched_count = 0

for place_id in range(24, 124):

    row = updated_by_id[place_id]

    source_name = row.get("source_name", "").strip()
    source_ref = row.get("source_ref", "").strip()

    if (
        source_name
        and source_ref
        and source_name != "Official tourism / public geographic references"
        and not source_ref.startswith("Public reference record -")
    ):
        enriched_count += 1


if enriched_count == 100:
    print("PASS: Records 24–123 enriched: 100/100")
else:
    print(
        f"FAIL: Records 24–123 enriched: "
        f"{enriched_count}/100"
    )


# --------------------------------------------------
# DISPLAY ORIGINAL RECORDS
# --------------------------------------------------

print()
print("=" * 70)
print("CURATED ORIGINAL RECORDS — IDs 1–15")
print("=" * 70)

for place_id in range(1, 16):

    row = updated_by_id[place_id]

    print(
        f"{place_id:2} | "
        f"{row['name']} | "
        f"tags_source: {row['tags_source']} | "
        f"notes: {row['notes']}"
    )


# --------------------------------------------------
# FINAL STATUS
# --------------------------------------------------

print()
print("=" * 70)

if (
    len(updated) == 123
    and len(teammate) == 123
    and updated_ids == expected_ids
    and not placeholder_found
    and not unexpected_differences
    and enriched_count == 100
):
    print("FINAL VERIFICATION COMPLETE")
else:
    print("FINAL VERIFICATION FAILED")

print("=" * 70)