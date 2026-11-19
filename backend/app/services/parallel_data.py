
import time
from time import perf_counter
from typing import Literal

from langchain_core.runnables import (
    RunnableLambda,
    RunnableParallel,
)

from app.schemas import (
    ParallelTravelRequest,
    ParallelTravelResponse,
)


# ==========================================
# 1. Demo configuration
# ==========================================

# Simulates latency from external APIs.
# This is NOT a real network request.
DEMO_DELAY_SECONDS = 0.5


# Demonstration data, NOT live travel data.
DEMO_CATALOG = {
    "new york": {
        "weather": "Sunny demo scenario",
        "attractions": [
            "Explore Central Park",
            "Visit an art museum",
            "Walk along the High Line",
        ],
        "restaurants": [
            "Explore local food markets",
            "Try neighborhood pizza spots",
            "Discover casual international cuisine",
        ],
    },

    "paris": {
        "weather": "Rainy demo scenario",
        "attractions": [
            "Explore a major art museum",
            "Walk through historic neighborhoods",
            "Visit architectural landmarks",
        ],
        "restaurants": [
            "Explore traditional French bistros",
            "Visit local bakeries",
            "Discover neighborhood cafes",
        ],
    },

    "tokyo": {
        "weather": "Cloudy demo scenario",
        "attractions": [
            "Explore technology districts",
            "Visit cultural museums",
            "Discover historic temples",
        ],
        "restaurants": [
            "Try local ramen shops",
            "Explore food markets",
            "Discover casual Japanese dining",
        ],
    },
}


DEFAULT_CATALOG = {
    "weather": "Variable weather demo scenario",
    "attractions": [
        "Explore local museums",
        "Visit public parks",
        "Discover historic landmarks",
    ],
    "restaurants": [
        "Explore local cuisine",
        "Visit neighborhood food markets",
        "Discover casual dining options",
    ],
}


def simulate_network_latency():
    """
    Artificial delay to demonstrate
    blocking I/O and parallel execution.
    """
    time.sleep(DEMO_DELAY_SECONDS)


def get_demo_catalog(destination: str):
    key = destination.strip().casefold()
    return DEMO_CATALOG.get(key, DEFAULT_CATALOG)


# ==========================================
# 2. Weather operation
# ==========================================

def weather_operation(payload: dict) -> dict:
    simulate_network_latency()

    catalog = get_demo_catalog(
        payload["destination"]
    )

    return {
        "scenario": catalog["weather"],
        "source": "mock",
        "note": (
            "Illustrative weather scenario only. "
            "Not a live forecast."
        ),
    }


# ==========================================
# 3. Attractions operation
# ==========================================

def attractions_operation(payload: dict) -> dict:
    simulate_network_latency()

    catalog = get_demo_catalog(
        payload["destination"]
    )

    return {
        "items": catalog["attractions"],
        "source": "mock",
    }


# ==========================================
# 4. Restaurants operation
# ==========================================

def restaurants_operation(payload: dict) -> dict:
    simulate_network_latency()

    catalog = get_demo_catalog(
        payload["destination"]
    )

    return {
        "items": catalog["restaurants"],
        "source": "mock",
    }


# ==========================================
# 5. Budget operation
# ==========================================

def budget_operation(payload: dict) -> dict:
    simulate_network_latency()

    budget = payload.get("budget")

    if budget is None:
        return {
            "breakdown": None,
            "source": "calculation",
            "note": (
                "No budget provided. "
                "An allocation cannot be calculated."
            ),
        }

    # Illustrative percentage allocation.
    # These are NOT actual travel costs.
    shares = {
        "Lodging": 0.35,
        "Food": 0.25,
        "Transportation": 0.15,
        "Activities": 0.20,
    }

    breakdown = {
        category: round(budget * share, 2)
        for category, share in shares.items()
    }

    # Assign remaining cents to the buffer.
    breakdown["Emergency buffer"] = round(
        budget - sum(breakdown.values()),
        2,
    )

    return {
        "breakdown": breakdown,
        "source": "calculation",
        "note": (
            "Illustrative allocation of the supplied "
            f"budget in {payload['currency']}. "
            "Not a price or cost estimate."
        ),
    }


# ==========================================
# 6. Build RunnableParallel
# ==========================================

def build_parallel_chain():
    """
    All four operations receive the same
    input dictionary.

    RunnableParallel executes independent
    branches concurrently.
    """

    return RunnableParallel(
        weather=RunnableLambda(
            weather_operation
        ),

        attractions=RunnableLambda(
            attractions_operation
        ),

        restaurants=RunnableLambda(
            restaurants_operation
        ),

        budget=RunnableLambda(
            budget_operation
        ),
    )


# ==========================================
# 7. Sequential baseline
# ==========================================

def run_sequential(payload: dict) -> dict:
    """
    Execute the same four operations one
    after another for comparison.
    """

    return {
        "weather": weather_operation(payload),
        "attractions": attractions_operation(payload),
        "restaurants": restaurants_operation(payload),
        "budget": budget_operation(payload),
    }


# ==========================================
# 8. Execute and measure performance
# ==========================================

def get_parallel_travel_data(
    request: ParallelTravelRequest,
    mode: Literal[
        "parallel",
        "sequential",
    ] = "parallel",
) -> ParallelTravelResponse:

    payload = request.model_dump()

    start = perf_counter()

    if mode == "parallel":
        chain = build_parallel_chain()

        results = chain.invoke(
            payload,
            config={"max_concurrency": 4},
        )

    elif mode == "sequential":
        results = run_sequential(payload)

    else:
        raise ValueError(
            "Invalid execution mode"
        )

    elapsed_ms = round(
        (perf_counter() - start) * 1000,
        2,
    )

    return ParallelTravelResponse(
        destination=request.destination,
        mode=mode,
        weather=results["weather"],
        attractions=results["attractions"],
        restaurants=results["restaurants"],
        budget=results["budget"],
        elapsed_ms=elapsed_ms,
    )
