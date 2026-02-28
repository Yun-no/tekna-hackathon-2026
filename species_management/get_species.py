import math
from pyinaturalist import get_observation_species_counts

def area_to_radius_km(area_km2: float) -> float:
    return math.sqrt(area_km2 / math.pi)

def fetch_species(
    lat: float,
    lng: float,
    area_km2: float,
    threatened: bool | None = None,
    introduced: bool | None = None,
):
    radius = area_to_radius_km(area_km2)

    params = {
        "lat": lat,
        "lng": lng,
        "radius": radius,
        "quality_grade": "research",
        "per_page": 200,
        "page": "all",
    }

    if threatened is not None:
        params["threatened"] = threatened

    if introduced is not None:
        params["introduced"] = introduced

    resp = get_observation_species_counts(**params)

    return [
        {
            "taxon_id": r["taxon"]["id"],
            "scientific_name": r["taxon"]["name"],
            "common_name": r["taxon"].get("preferred_common_name"),
            "rank": r["taxon"]["rank"],
            "obs_count": r["count"],
        }
        for r in resp["results"]
    ]


if __name__ == "__main__":
    LAT = 59.9139
    LNG = 10.7522

    threatened = fetch_species(LAT, LNG, area_km2=10, threatened=True)
    introduced = fetch_species(LAT, LNG, area_km2=10, introduced=True)

    print("\nThreatened species:")
    for s in threatened:
        print(s["common_name"] or s["scientific_name"])

    print("\nIntroduced species:")
    for s in introduced:
        print(s["common_name"] or s["scientific_name"])