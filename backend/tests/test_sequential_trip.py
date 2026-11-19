
import pytest

from fastapi.testclient import TestClient
from langchain_core.runnables import RunnableLambda

from app.main import app
from app.schemas import TravelDetails

from app.services.sequential_trip import (
    build_sequential_trip_chain,
    MissingTripDetailsError,
)


client = TestClient(app)


# ---------------------------------------
# Test 1: Complete sequential execution
# ---------------------------------------

def test_sequential_chain(monkeypatch):
    execution_order = []

    def fake_extraction(message):
        execution_order.append("extract")

        return TravelDetails(
            destination="New York",
            duration_days=3,
            budget=1000,
            currency="USD",
            travelers=2,
            interests=["museums", "food"],
            preferences=["walking"],
        )

    def fake_recommendations(
        destination,
        interests,
        preferences,
    ):
        execution_order.append("recommendations")

        assert destination == "New York"
        assert "museums" in interests

        return (
            "1. Museum\n"
            "2. Park\n"
            "3. Food market\n"
            "4. Historic area\n"
            "5. Waterfront"
        )

    monkeypatch.setattr(
        "app.services.sequential_trip.extract_travel_details",
        fake_extraction,
    )

    monkeypatch.setattr(
        "app.services.sequential_trip.generate_recommendations",
        fake_recommendations,
    )

    def fake_preference_analysis(payload):
        execution_order.append("analysis")
        assert "New York" in payload["details_json"]
        return "Museums, food, walking, budget-friendly"

    def fake_itinerary(payload):
        execution_order.append("itinerary")
        assert payload["duration_days"] == 3

        return (
            "## Day 1\nMuseum\n\n"
            "## Day 2\nPark\n\n"
            "## Day 3\nFood exploration"
        )

    chain = build_sequential_trip_chain(
        preference_chain=RunnableLambda(
            fake_preference_analysis
        ),
        itinerary_chain=RunnableLambda(
            fake_itinerary
        ),
    )

    result = chain.invoke({
        "message": (
            "Plan a 3-day New York trip "
            "for two people with a $1000 budget."
        )
    })

    assert execution_order == [
        "extract",
        "analysis",
        "recommendations",
        "itinerary",
    ]

    assert result.details.destination == "New York"
    assert result.details.duration_days == 3

    assert "Day 3" in result.preliminary_itinerary

    assert "Preliminary Trip Plan" in result.final_plan


# ---------------------------------------
# Test 2: Reject incomplete trip details
# ---------------------------------------

def test_missing_duration(monkeypatch):

    def fake_extraction(message):
        return TravelDetails(
            destination="Paris",
            duration_days=None,
        )

    monkeypatch.setattr(
        "app.services.sequential_trip.extract_travel_details",
        fake_extraction,
    )

    unused_chain = RunnableLambda(
        lambda payload: "Not called"
    )

    chain = build_sequential_trip_chain(
        unused_chain,
        unused_chain,
    )

    with pytest.raises(
        MissingTripDetailsError,
        match="trip duration",
    ):
        chain.invoke({
            "message": "I want to visit Paris soon."
        })


# ---------------------------------------
# Test 3: FastAPI input validation
# ---------------------------------------

def test_invalid_trip_request():

    response = client.post(
        "/api/v1/plan-trip-preview",
        json={"message": "short"},
    )

    assert response.status_code == 422
