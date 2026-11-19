
from fastapi.testclient import TestClient

from app.main import app
from app.schemas import ParallelTravelRequest

from app.services.parallel_data import (
    get_parallel_travel_data,
)


client = TestClient(app)


def make_request():
    return ParallelTravelRequest(
        destination="Paris",
        duration_days=2,
        travelers=2,
        interests=["art", "architecture"],
        budget=600,
        currency="USD",
    )


# ==========================================
# Test 1: Parallel results
# ==========================================

def test_parallel_results(monkeypatch):

    # Remove artificial latency during tests
    monkeypatch.setattr(
        "app.services.parallel_data.simulate_network_latency",
        lambda: None,
    )

    response = get_parallel_travel_data(
        make_request(),
        mode="parallel",
    )

    assert response.destination == "Paris"
    assert response.mode == "parallel"

    assert response.weather.source == "mock"

    assert len(response.attractions.items) > 0
    assert len(response.restaurants.items) > 0

    assert response.elapsed_ms >= 0


# ==========================================
# Test 2: Identical data in both modes
# ==========================================

def test_sequential_and_parallel_match(monkeypatch):

    monkeypatch.setattr(
        "app.services.parallel_data.simulate_network_latency",
        lambda: None,
    )

    request = make_request()

    sequential = get_parallel_travel_data(
        request,
        mode="sequential",
    )

    parallel = get_parallel_travel_data(
        request,
        mode="parallel",
    )

    assert sequential.weather == parallel.weather

    assert (
        sequential.attractions ==
        parallel.attractions
    )

    assert (
        sequential.restaurants ==
        parallel.restaurants
    )

    assert sequential.budget == parallel.budget


# ==========================================
# Test 3: Budget calculation
# ==========================================

def test_budget_allocation(monkeypatch):

    monkeypatch.setattr(
        "app.services.parallel_data.simulate_network_latency",
        lambda: None,
    )

    result = get_parallel_travel_data(
        make_request()
    )

    breakdown = result.budget.breakdown

    assert breakdown is not None
    assert round(sum(breakdown.values()), 2) == 600

    assert breakdown["Lodging"] == 210
    assert breakdown["Food"] == 150


# ==========================================
# Test 4: Missing budget
# ==========================================

def test_missing_budget(monkeypatch):

    monkeypatch.setattr(
        "app.services.parallel_data.simulate_network_latency",
        lambda: None,
    )

    request = ParallelTravelRequest(
        destination="Tokyo",
        budget=None,
    )

    result = get_parallel_travel_data(request)

    assert result.budget.breakdown is None


# ==========================================
# Test 5: FastAPI validation
# ==========================================

def test_invalid_travelers():

    response = client.post(
        "/api/v1/parallel-trip-data",
        json={
            "destination": "Paris",
            "travelers": 0,
        },
    )

    assert response.status_code == 422
