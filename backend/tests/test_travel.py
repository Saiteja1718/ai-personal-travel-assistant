
from fastapi.testclient import TestClient

from app.main import app
from app.schemas import TravelDetails


client = TestClient(app)


def test_extract_trip_success(monkeypatch):

    def fake_extraction(message: str):
        return TravelDetails(
            destination="New York",
            duration_days=3,
            budget=1000,
            currency="USD",
            travelers=2,
            interests=["museums", "food"],
        )

    monkeypatch.setattr(
        "app.routers.travel.extract_travel_details",
        fake_extraction,
    )

    response = client.post(
        "/api/v1/extract-trip",
        json={
            "message": (
                "Plan a 3-day trip to New York "
                "for 2 people with a $1000 budget"
            )
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["destination"] == "New York"
    assert data["duration_days"] == 3
    assert data["budget"] == 1000
    assert data["travelers"] == 2


def test_empty_message_rejected():

    response = client.post(
        "/api/v1/extract-trip",
        json={"message": ""},
    )

    assert response.status_code == 422


def test_invalid_traveler_count():

    try:
        TravelDetails(
            destination="Paris",
            travelers=-2,
        )

        assert False, "Expected validation error"

    except ValueError:
        pass
