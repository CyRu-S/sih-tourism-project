import csv
from pathlib import Path
import shutil


# --------------------------------------------------
# PROJECT PATHS
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent

INPUT_FILE = PROJECT_ROOT / "places_curated_123.csv"
OUTPUT_FILE = PROJECT_ROOT / "data" / "curated" / "places_curated.csv"
BACKUP_FILE = PROJECT_ROOT / "data" / "curated" / "places_curated_backup.csv"


# --------------------------------------------------
# ENRICHMENT FOR ORIGINAL 15 RECORDS
# --------------------------------------------------

ENRICHMENTS = {
    "1": {
        "tags_source": "nature,hills,forest,viewpoints,offbeat",
        "notes": "Quiet hill destination with forested landscapes and viewpoints; access to Patalkot Valley.",
    },
    "2": {
        "tags_source": "nature,valley,forest,trekking,tribal,culture,offbeat",
        "notes": "Deep forested valley offering trekking and opportunities to experience local tribal culture; terrain is hard.",
    },
    "3": {
        "tags_source": "tribal,culture,village,nature,trekking,camping",
        "notes": "Remote tourism village offering village experiences, trekking, camping and local cultural activities.",
    },
    "4": {
        "tags_source": "tribal,culture,rural,village,homestay,nature",
        "notes": "Rural tourism experience featuring traditional culture, homestays, farming activities and mountain views.",
    },
    "5": {
        "tags_source": "heritage,prehistoric,rock-art,archaeology,offbeat",
        "notes": "Prehistoric rock-art site with painted shelters and archaeological remains; terrain is hard.",
    },
    "6": {
        "tags_source": "heritage,temple,cave,architecture,history",
        "notes": "Rock-cut temple complex featuring carved religious architecture and historic cave structures.",
    },
    "7": {
        "tags_source": "heritage,mughal,history,deer-park,burhanpur",
        "notes": "Historic deer park and Mughal-era site associated with the Faruqi and Mughal periods.",
    },
    "8": {
        "tags_source": "heritage,religious,culture,architecture,burhanpur",
        "notes": "Religious and heritage complex associated with Saiyedi Abdul Hakimuddin and set within landscaped grounds.",
    },
    "9": {
        "tags_source": "heritage,fort,history,architecture,shiva-temple,offbeat",
        "notes": "Historic hill fort known for its strategic location, fortifications and ancient Shiva temple; terrain is hard.",
    },
    "10": {
        "tags_source": "nature,island,reservoir,scenic,water-activities",
        "notes": "Peaceful island retreat on the Omkareshwar Dam backwaters offering scenic surroundings and water-based activities.",
    },
    "11": {
        "tags_source": "adventure,island,water-sports,reservoir,jal-mahotsav",
        "notes": "Adventure destination on the Indira Sagar reservoir known for water sports and the annual Jal Mahotsav.",
    },
    "12": {
        "tags_source": "heritage,jain,pilgrimage,rock-cut,temple,hills",
        "notes": "Jain pilgrimage and heritage site known for its large rock-cut statue and hilltop temple complex.",
    },
    "13": {
        "tags_source": "nature,reservoir,forest,island,scenic,boating",
        "notes": "Large reservoir surrounded by forests and islands, offering scenic nature experiences and boating opportunities.",
    },
    "14": {
        "tags_source": "heritage,temple,shiva,architecture,history,unfinished",
        "notes": "Unfinished historic Shiva temple featuring monumental architecture and notable heritage significance.",
    },
    "15": {
        "tags_source": "heritage,mughal,history,architecture,burhanpur",
        "notes": "Protected Mughal-era royal bath associated with the Shahi Qila complex in historic Burhanpur.",
    },
}


# --------------------------------------------------
# LOAD DATA
# --------------------------------------------------

with open(INPUT_FILE, "r", encoding="utf-8", newline="") as file:
    reader = csv.DictReader(file)
    rows = list(reader)
    fieldnames = reader.fieldnames


# --------------------------------------------------
# VALIDATION BEFORE MODIFICATION
# --------------------------------------------------

if fieldnames is None:
    raise ValueError("CSV has no header.")

if len(rows) != 123:
    raise ValueError(f"Expected 123 records, found {len(rows)}.")

if len(fieldnames) != 20:
    raise ValueError(f"Expected 20 columns, found {len(fieldnames)}.")

place_ids = [row["place_id"] for row in rows]

if len(set(place_ids)) != len(place_ids):
    raise ValueError("Duplicate place_id detected.")

expected_ids = {str(i) for i in range(1, 124)}

if set(place_ids) != expected_ids:
    raise ValueError("place_id values are not exactly 1–123.")


# --------------------------------------------------
# BACKUP CURRENT DATASET
# --------------------------------------------------

if OUTPUT_FILE.exists():
    shutil.copy2(OUTPUT_FILE, BACKUP_FILE)
    print(f"Backup created: {BACKUP_FILE}")


# --------------------------------------------------
# APPLY ENRICHMENT
# --------------------------------------------------

updated_count = 0

for row in rows:
    place_id = row["place_id"]

    if place_id in ENRICHMENTS:
        row["tags_source"] = ENRICHMENTS[place_id]["tags_source"]
        row["notes"] = ENRICHMENTS[place_id]["notes"]
        updated_count += 1


# --------------------------------------------------
# FINAL VALIDATION
# --------------------------------------------------

placeholders_remaining = []

for row in rows:
    if row["tags_source"] == "Not specified in source record":
        placeholders_remaining.append(
            (row["place_id"], "tags_source")
        )

    if row["notes"] == "No additional note provided in source record":
        placeholders_remaining.append(
            (row["place_id"], "notes")
        )

if placeholders_remaining:
    raise ValueError(
        f"Placeholder values remain: {placeholders_remaining}"
    )


# --------------------------------------------------
# WRITE FINAL DATASET
# --------------------------------------------------

OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8",
    newline=""
) as file:

    writer = csv.DictWriter(
        file,
        fieldnames=fieldnames
    )

    writer.writeheader()
    writer.writerows(rows)


# --------------------------------------------------
# RESULT
# --------------------------------------------------

print()
print("=" * 70)
print("DATASET ENRICHMENT COMPLETE")
print("=" * 70)
print(f"Records: {len(rows)}")
print(f"Columns: {len(fieldnames)}")
print(f"Records enriched: {updated_count}")
print(f"Output: {OUTPUT_FILE}")
print()
print("All 123 place IDs validated.")
print("No placeholder values remain.")
print("Existing records 16–123 were preserved.")