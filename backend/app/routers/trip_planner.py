
from fastapi import APIRouter, HTTPException

from app.schemas import (
    TravelRequest,
    TripPreviewResponse,
)

from app.services.sequential_trip import (
    generate_trip_preview,
    MissingTripDetailsError,
    PlanningConfigurationError,
    PlanningModelError,
)

from app.services.travel_extractor import (
    LLMConfigurationError,
    LLMProviderError,
    LLMParsingError,
)

from app.services.recommendations import (
    RecommendationConfigurationError,
    RecommendationProviderError,
)


router = APIRouter(
    prefix="/api/v1",
    tags=["Sequential Trip Planning"],
)


@router.post(
    "/plan-trip-preview",
    response_model=TripPreviewResponse,
)
def plan_trip_preview(
    request: TravelRequest,
) -> TripPreviewResponse:

    try:
        return generate_trip_preview(
            request.message
        )

    except MissingTripDetailsError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc

    except (
        PlanningConfigurationError,
        LLMConfigurationError,
        RecommendationConfigurationError,
    ) as exc:
        raise HTTPException(
            status_code=503,
            detail="LLM configuration is missing",
        ) from exc

    except (
        PlanningModelError,
        LLMProviderError,
        LLMParsingError,
        RecommendationProviderError,
    ) as exc:
        raise HTTPException(
            status_code=502,
            detail="An AI planning stage failed",
        ) from exc
