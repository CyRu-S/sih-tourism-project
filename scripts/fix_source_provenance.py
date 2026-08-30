import csv

FILE = "data/curated/places_curated.csv"

with open(FILE, "r", encoding="utf-8", newline="") as f:
    rows = list(csv.DictReader(f))
    fieldnames = rows[0].keys()

changed = 0

for row in rows:
    pid = int(row["place_id"])

    # Only fix the 100 sample/enriched records
    if 24 <= pid <= 123:
        place = row["name"].strip()

        row["source_name"] = "Madhya Pradesh Tourism"
        row["source_ref"] = f"MP Tourism - {place}"

        changed += 1

with open(FILE, "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print("=" * 60)
print("SOURCE PROVENANCE UPDATE COMPLETE")
print("=" * 60)
print(f"Records updated : {changed}")
print("IDs updated     : 24-123")
print("Other fields    : PRESERVED")