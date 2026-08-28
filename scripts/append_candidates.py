import csv
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
RAW_FILE = PROJECT_ROOT / "data" / "raw" / "candidate_places.csv"


NEW_PLACES = [
    {
        "place_id": 16,
        "name": "Shah Nawaz Khan Tomb",
        "description": "A Mughal-era black stone mausoleum on the banks of the Utawali River, known locally as the Black Taj Mahal of Burhanpur.",
        "category": "heritage",
        "locality": "Burhanpur",
        "district": "Burhanpur",
        "latitude": 21.3177,
        "longitude": 76.2395,
        "tags_source": "heritage,history,mughal,architecture",
        "source_name": "Burhanpur District / MP Tourism",
        "source_ref": "Shah Nawaz Khan Tomb",
        "notes": "Offbeat heritage site; coordinate cross-reference used."
    },

    {
        "place_id": 17,
        "name": "Kheoni Wildlife Sanctuary",
        "description": "A lesser-known dry deciduous forest landscape between Dewas and Sehore known for wildlife, biodiversity and rugged natural surroundings.",
        "category": "wildlife",
        "locality": "Kheoni",
        "district": "Dewas",
        "latitude": 22.8373,
        "longitude": 76.8765,
        "tags_source": "wildlife,nature,forest,birds,offbeat",
        "source_name": "MP Tourism",
        "source_ref": "Kheoni Wildlife Sanctuary",
        "notes": "Protected wildlife area; access and activities should follow forest regulations."
    },

    {
        "place_id": 18,
        "name": "Umargohan Tourism Village",
        "description": "A tribal tourism village near Amarkantak surrounded by hills and waterfalls, offering lake activities, hiking, cycling, local food and homestay experiences.",
        "category": "local-culture",
        "locality": "Umargohan",
        "district": "Anuppur",
        "latitude": 22.76831,
        "longitude": 81.76929,
        "tags_source": "tribal,culture,village,nature,homestay",
        "source_name": "MP Tourism",
        "source_ref": "Tourism Village Umargohan",
        "notes": "Responsible Tourism Mission village."
    },

    {
        "place_id": 19,
        "name": "Chausath Yogini Temple, Mitawali",
        "description": "A distinctive circular hilltop temple in Morena associated with the Chausath Yogini tradition and known for its unusual architectural design.",
        "category": "heritage",
        "locality": "Mitawali",
        "district": "Morena",
        "latitude": 26.436382,
        "longitude": 78.23554,
        "tags_source": "heritage,temple,architecture,history",
        "source_name": "Government of India / Morena District",
        "source_ref": "Chausath Yogini Temple, Morena",
        "notes": "Approximately 100 steps lead to the hilltop temple."
    },

    {
        "place_id": 20,
        "name": "Aiti Tourism Village",
        "description": "A historically significant rural tourism village in Morena known for the Chausath Yogini and Ekattarso Mahadeva heritage traditions.",
        "category": "local-culture",
        "locality": "Aiti",
        "district": "Morena",
        "latitude": 26.39395,
        "longitude": 78.21743,
        "tags_source": "rural,heritage,culture,spiritual",
        "source_name": "MP Tourism",
        "source_ref": "Tourism Village Aiti",
        "notes": "Responsible Tourism Mission village."
    },

    {
        "place_id": 21,
        "name": "Khokhara & Thadipathar",
        "description": "A forest-fringed rural tourism area in Sidhi surrounded by mountains and caves, offering a quieter nature and village experience.",
        "category": "nature",
        "locality": "Khokhara",
        "district": "Sidhi",
        "latitude": 24.04509028,
        "longitude": 81.87283472,
        "tags_source": "nature,forest,village,caves,offbeat",
        "source_name": "MP Tourism / Sidhi District Survey",
        "source_ref": "Tourism Village Khokhara & Thadipathar",
        "notes": "Rural tourism destination; coordinate represents Khokhara village."
    },

    {
        "place_id": 22,
        "name": "Deogarh Fort",
        "description": "A historic Gond fort and former regional centre situated on a hilltop in the forested landscape of Chhindwara district.",
        "category": "heritage",
        "locality": "Deogarh",
        "district": "Chhindwara",
        "latitude": 21.88273,
        "longitude": 78.73288,
        "tags_source": "heritage,fort,gond,history,offbeat",
        "source_name": "ASI / MP Tourism",
        "source_ref": "Deogarh Fort",
        "notes": "Protected heritage monument."
    },

    {
        "place_id": 23,
        "name": "Chimtipur Tourism Village",
        "description": "A Gond tribal tourism village in Chhindwara offering rural experiences, traditional culture, local cuisine and access to the hilly Satpura landscape.",
        "category": "local-culture",
        "locality": "Chimtipur",
        "district": "Chhindwara",
        "latitude": 22.422405,
        "longitude": 78.814506,
        "tags_source": "tribal,culture,rural,nature,homestay",
        "source_name": "MP Tourism",
        "source_ref": "Tourism Village Chimtipur",
        "notes": "Responsible Tourism Mission village."
    },
]


def append_places():
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

    existing_ids = {
        int(row["place_id"])
        for row in rows
        if row.get("place_id")
    }

    added = 0

    for place in NEW_PLACES:

        if place["place_id"] in existing_ids:
            print(
                f"Skipped existing place_id: "
                f"{place['place_id']}"
            )
            continue

        row = {column: "" for column in columns}
        row.update(place)

        rows.append(row)
        added += 1

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

    print("Candidate dataset expanded successfully.")
    print(f"New places added: {added}")
    print(f"Total places: {len(rows)}")
    print(f"Output: {RAW_FILE}")


if __name__ == "__main__":
    append_places()