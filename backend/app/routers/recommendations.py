
from fastapi import APIRouter, HTTPException

from app.schemas import (
    RecommendationRequest,
    RecommendationResponse,
)

from app.services.recommendations import (
    generate_recommendations,
    RecommendationConfigurationError,
    RecommendationProviderError,
)


router = APIRouter(
    prefix="/api/v1",
    tags=["Travel Recommendations"],
)


@router.post(
    "/recommendations",
    response_model=RecommendationResponse,
)
def get_recommendations(
    request: RecommendationRequest,
) -> RecommendationResponse:

    try:
        recommendations = generate_recommendations(
            destination=request.destination,
            interests=request.interests,
            preferences=request.preferences,
        )

        return RecommendationResponse(
            destination=request.destination,
            recommendations=recommendations,
        )

    except RecommendationConfigurationError as exc:
        raise HTTPException(
            status_code=503,
            detail="Groq configuration is missing",
        ) from exc

    except RecommendationProviderError as exc:
        raise HTTPException(
            status_code=502,
            detail="Could not generate travel recommendations",
        ) from exc
