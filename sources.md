# Data Sources

## Overview

This document records the source and verification approach used for the tourism
places dataset prepared for the SIH tourism recommendation system.

The dataset contains curated information about tourism places in Madhya Pradesh,
including place names, descriptions, categories, locations, coordinates,
scores, accessibility information, visit timing, and source references.

## Dataset Files

### Raw Candidate Dataset

`data/raw/candidate_places.csv`

This file contains the collected candidate tourism places before the final
dataset generation and validation process.

### Curated Dataset

`data/curated/places_curated.csv`

This is the final curated dataset used by the recommendation engine.

It contains 23 tourism places and 20 attributes for each place.

## Source Information

Each place record includes dedicated fields for source documentation:

- `tags_source` — source or basis used for the place tags.
- `source_name` — name of the information source.
- `source_ref` — reference or link associated with the source.
- `notes` — additional verification or data-quality notes.

These fields are retained in the dataset so that individual place records
can be traced back to their supporting information.

## Data Verification

The collected place information was reviewed before inclusion in the curated
dataset.

The following attributes were considered during curation and validation:

- Place name
- Description
- Category
- Locality and district
- Latitude and longitude
- Hiddenness score
- Popularity score
- Curation score
- Best visit time
- Wheelchair accessibility
- Parking availability
- Public transport availability
- Walking difficulty
- Source information

Invalid category values and incomplete records were checked during the
dataset-building process.

## Dataset Generation

The curated dataset is generated using:

`scripts/build-dataset.py`

The supporting data preparation scripts are:

- `scripts/seed_candidates.py`
- `scripts/append_candidates.py`
- `scripts/curate_places.py`
- `scripts/build-dataset.py`

The final output is:

`data/curated/places_curated.csv`

## Recommendation Usage

The curated dataset is consumed by the recommendation module:

`scripts/recommend_places.py`

The recommendation engine uses the curated place attributes to rank places
according to user preferences such as category, hiddenness, and popularity.

## Data Quality Principle

Only information that can be reasonably supported by the collected source
information should be retained in the final dataset.

Source references should be maintained whenever additional places or
attributes are added to the dataset.