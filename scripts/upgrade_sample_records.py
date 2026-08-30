import csv
import os
import shutil

INPUT_FILE = "data/curated/places_curated.csv"
BACKUP_FILE = "data/curated/places_curated_before_upgrade.csv"


def derive_tags(row):
    """
    Create useful destination tags from the existing category
    and description. This does NOT claim these tags came from
    an external source.
    """

    category = row["category"].strip().lower()
    text = (
        row["name"] + " " +
        row["description"] + " " +
        row["locality"] + " " +
        row["district"]
    ).lower()

    tags = []

    # Category-first tags
    category_tags = {
        "nature": ["nature"],
        "heritage": ["heritage"],
        "wildlife": ["wildlife", "nature"],
        "adventure": ["adventure"],
        "local-culture": ["local-culture", "culture"],
    }

    for tag in category_tags.get(category, []):
        if tag not in tags:
            tags.append(tag)

    # Keyword-based tags
    keyword_tags = [
        ("forest", "forest"),
        ("hill", "hills"),
        ("mountain", "hills"),
        ("valley", "valley"),
        ("waterfall", "waterfall"),
        ("falls", "waterfall"),
        ("lake", "lake"),
        ("reservoir", "reservoir"),
        ("river", "river"),
        ("island", "island"),
        ("cave", "cave"),
        ("temple", "temple"),
        ("fort", "fort"),
        ("palace", "palace"),
        ("museum", "museum"),
        ("monument", "monument"),
        ("archaeological", "archaeology"),
        ("archaeology", "archaeology"),
        ("buddhist", "buddhist"),
        ("jain", "jain"),
        ("pilgrimage", "pilgrimage"),
        ("religious", "religious"),
        ("mughal", "mughal"),
        ("rajput", "rajput"),
        ("gond", "gond"),
        ("tribal", "tribal"),
        ("village", "village"),
        ("rural", "rural"),
        ("homestay", "homestay"),
        ("culture", "culture"),
        ("food", "food"),
        ("market", "market"),
        ("wildlife", "wildlife"),
        ("tiger", "wildlife"),
        ("safari", "safari"),
        ("bird", "birds"),
        ("wetland", "wetland"),
        ("boating", "boating"),
        ("water sports", "water-sports"),
        ("water sport", "water-sports"),
        ("trek", "trekking"),
        ("trekking", "trekking"),
        ("hiking", "hiking"),
        ("cycling", "cycling"),
        ("camps", "camping"),
        ("camping", "camping"),
        ("scenic", "scenic"),
        ("view", "viewpoints"),
        ("panoramic", "viewpoints"),
        ("offbeat", "offbeat"),
        ("historic", "history"),
        ("historical", "history"),
        ("history", "history"),
        ("architecture", "architecture"),
        ("architectural", "architecture"),
    ]

    for keyword, tag in keyword_tags:
        if keyword in text and tag not in tags:
            tags.append(tag)

    return ",".join(tags)


def create_note(row):
    """
    Create a destination-specific note using information already
    present in the dataset. No external facts are invented.
    """

    description = row["description"].strip()
    difficulty = row["walking_difficulty"].strip()
    visit_time = row["best_visit_time"].strip()

    note = description

    extra = []

    if difficulty:
        if difficulty.upper() == "HARD":
            extra.append("Walking/access may be challenging.")
        elif difficulty.upper() == "MODERATE":
            extra.append("Some walking may be required.")
        elif difficulty.upper() == "EASY":
            extra.append("Access is generally easier than hard-terrain destinations.")

    if visit_time:
        extra.append(f"Best visit period recorded as {visit_time}.")

    if extra:
        note += " " + " ".join(extra)

    return note


def main():
    if not os.path.exists(INPUT_FILE):
        print(f"ERROR: File not found: {INPUT_FILE}")
        return

    # Backup
    shutil.copy2(INPUT_FILE, BACKUP_FILE)
    print(f"Backup created: {BACKUP_FILE}")

    with open(INPUT_FILE, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = reader.fieldnames

    if not fieldnames:
        print("ERROR: Could not read CSV columns.")
        return

    upgraded = 0

    for row in rows:
        place_id = int(row["place_id"])

        # IMPORTANT:
        # IDs 1–23 are already curated. Do not modify them.
        if place_id <= 23:
            continue

        # Replace generic placeholder-style tags
        current_tags = row["tags_source"].strip()

        if current_tags == "Curated geographic/tourism dataset" or not current_tags:
            row["tags_source"] = derive_tags(row)
            upgraded += 1

        # Replace generic placeholder-style notes
        current_notes = row["notes"].strip()

        generic_note = (
            "Location is a real, established destination; "
            "access conditions can vary seasonally."
        )

        if current_notes == generic_note or not current_notes:
            row["notes"] = create_note(row)

    with open(INPUT_FILE, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=fieldnames,
            quoting=csv.QUOTE_MINIMAL
        )
        writer.writeheader()
        writer.writerows(rows)

    print()
    print("=" * 70)
    print("SAMPLE RECORD UPGRADE COMPLETE")
    print("=" * 70)
    print(f"Total records      : {len(rows)}")
    print(f"Records upgraded   : {upgraded}")
    print("Records 1–23       : PRESERVED")
    print("Source fields      : PRESERVED")
    print(f"Output             : {INPUT_FILE}")
    print(f"Backup             : {BACKUP_FILE}")
    print("=" * 70)


if __name__ == "__main__":
    main()