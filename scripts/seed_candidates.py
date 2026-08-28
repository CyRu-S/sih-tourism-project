import csv
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
RAW_FILE = PROJECT_ROOT / "data" / "raw" / "candidate_places.csv"


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


PLACES = [
    {
        "place_id": 1,
        "name": "Tamia",
        "description": "A quiet hill destination in the Satpura region known for forested landscapes, viewpoints and access to Patalkot Valley.",
        "category": "nature",
        "locality": "Tamia",
        "district": "Chhindwara",
        "latitude": 22.34362,
        "longitude": 78.67082,
        "source_name": "MP Tourism",
        "source_ref": "MP Tourism - Tamia",
    },
    {
        "place_id": 2,
        "name": "Patalkot Valley",
        "description": "A deep horseshoe-shaped valley surrounded by forests and hills, with trekking and opportunities to experience local tribal culture.",
        "category": "nature",
        "locality": "Patalkot",
        "district": "Chhindwara",
        "latitude": 22.25000,
        "longitude": 78.46000,
        "source_name": "MP Tourism",
        "source_ref": "MP Tourism - Patalkot",
    },
    {
        "place_id": 3,
        "name": "Ghatlinga",
        "description": "A remote tourism village near Patalkot offering forest experiences, village life, trekking, camping and local cultural activities.",
        "category": "local-culture",
        "locality": "Ghatlinga",
        "district": "Chhindwara",
        "latitude": 22.399904,
        "longitude": 78.707216,
        "source_name": "MP Tourism",
        "source_ref": "MP Tourism - Tourism Village Ghatlinga",
    },
    {
        "place_id": 4,
        "name": "Dhusawani Village",
        "description": "A tribal village in the Satpura region offering rural experiences, traditional culture, homestays, farming activities and mountain views.",
        "category": "local-culture",
        "locality": "Dhusawani",
        "district": "Chhindwara",
        "latitude": 22.314767,
        "longitude": 78.635936,
        "source_name": "MP Tourism",
        "source_ref": "MP Tourism - Tourism Village Dhusawani",
    },
    {
        "place_id": 5,
        "name": "Chaturbhuj Nala Rock Shelters",
        "description": "A prehistoric rock-art site containing painted shelters and archaeological remains in the Mandsaur region.",
        "category": "heritage",
        "locality": "Bhanpura",
        "district": "Mandsaur",
        "latitude": 24.6825,
        "longitude": 75.66848,
        "source_name": "Wikidata / ASI reference",
        "source_ref": "Wikidata - Chaturbhujnath Nala Rock Art",
    },
    {
        "place_id": 6,
        "name": "Dharmrajeshwar Cave Temple",
        "description": "A rock-cut temple complex near Dhamnar featuring carved religious architecture and historic cave structures.",
        "category": "heritage",
        "locality": "Dhamnar",
        "district": "Mandsaur",
        "latitude": 24.19395,
        "longitude": 75.49889,
        "source_name": "Wikidata",
        "source_ref": "Wikidata - Dharmrajeshwar",
    },
    {
        "place_id": 7,
        "name": "Ahukhana",
        "description": "A historic deer park and Mughal-era site across the Tapti River from Burhanpur, associated with the Faruqi and Mughal periods.",
        "category": "heritage",
        "locality": "Burhanpur",
        "district": "Burhanpur",
        "latitude": 21.30888,
        "longitude": 76.24675,
        "source_name": "MP Tourism",
        "source_ref": "MP Tourism - Burhanpur",
    },
    {
        "place_id": 8,
        "name": "Dargah-e-Hakimi",
        "description": "A religious and heritage complex in Burhanpur set within landscaped grounds and associated with Saiyedi Abdul Hakimuddin.",
        "category": "heritage",
        "locality": "Burhanpur",
        "district": "Burhanpur",
        "latitude": 21.3344275,
        "longitude": 76.2169041,
        "source_name": "MP Tourism",
        "source_ref": "MP Tourism - Burhanpur",
    },
    {
        "place_id": 9,
        "name": "Asirgarh Fort",
        "description": "A historic hill fort in the Satpura range known for its strategic location, strong fortifications and ancient Shiva temple.",
        "category": "heritage",
        "locality": "Asirgarh",
        "district": "Burhanpur",
        "latitude": 21.47076,
        "longitude": 76.29376,
        "source_name": "Wikidata / ASI reference",
        "source_ref": "Wikidata - Asirgarh Fort",
    },
    {
        "place_id": 10,
        "name": "Sailani Island",
        "description": "A peaceful island retreat on the backwaters of the Omkareshwar Dam offering scenic surroundings and water-based activities.",
        "category": "nature",
        "locality": "Sailani",
        "district": "Khandwa",
        "latitude": 22.238279,
        "longitude": 76.173377,
        "source_name": "Government of India / MP Tourism",
        "source_ref": "CPCB report - Sailani Island",
    },
    {
        "place_id": 11,
        "name": "Hanuwantiya Island",
        "description": "An adventure destination on the Indira Sagar reservoir known for water sports, island experiences and the annual Jal Mahotsav.",
        "category": "adventure",
        "locality": "Hanuwantiya",
        "district": "Khandwa",
        "latitude": 22.1444,
        "longitude": 76.5876,
        "source_name": "MP Tourism",
        "source_ref": "MP Tourism - Hanuwantiya",
    },
    {
        "place_id": 12,
        "name": "Bawangaja",
        "description": "A Jain pilgrimage and heritage site in the Satpura region known for its large rock-cut statue and hilltop temple complex.",
        "category": "heritage",
        "locality": "Bawangaja",
        "district": "Barwani",
        "latitude": 21.996,
        "longitude": 74.862,
        "source_name": "Wikidata / map reference",
        "source_ref": "Map reference - Bawangaja",
    },
    {
        "place_id": 13,
        "name": "Tawa Reservoir",
        "description": "A large reservoir surrounded by forested landscapes and small islands, offering scenic nature experiences and boating opportunities.",
        "category": "nature",
        "locality": "Tawa",
        "district": "Narmadapuram",
        "latitude": 22.54109,
        "longitude": 77.96815,
        "source_name": "MP Tourism / map reference",
        "source_ref": "MP Tourism - Tawa Reservoir",
    },
    {
        "place_id": 14,
        "name": "Bhojeshwar Temple",
        "description": "An unfinished historic Shiva temple at Bhojpur featuring monumental architecture and one of the region's notable heritage structures.",
        "category": "heritage",
        "locality": "Bhojpur",
        "district": "Raisen",
        "latitude": 23.10028,
        "longitude": 77.57996,
        "source_name": "Wikidata / ASI reference",
        "source_ref": "Wikidata - Bhojeshwar Temple",
    },
    {
        "place_id": 15,
        "name": "Hammam Khana",
        "description": "A protected Mughal-era royal bath associated with the Shahi Qila complex in the historic city of Burhanpur.",
        "category": "heritage",
        "locality": "Burhanpur",
        "district": "Burhanpur",
        "latitude": 21.31083,
        "longitude": 76.23333,
        "source_name": "National Monuments Authority / MP Tourism",
        "source_ref": "NMA - Hammam Khana, Burhanpur",
    },
]


def write_candidates():
    RAW_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(
        RAW_FILE,
        "w",
        encoding="utf-8",
        newline=""
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=COLUMNS
        )

        writer.writeheader()

        for place in PLACES:
            row = {column: "" for column in COLUMNS}
            row.update(place)
            writer.writerow(row)

    print(f"Created candidate dataset with {len(PLACES)} places.")
    print(f"Output: {RAW_FILE}")


if __name__ == "__main__":
    write_candidates()