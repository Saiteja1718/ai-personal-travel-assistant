
from fastapi import APIRouter, HTTPException

from app.schemas import TravelRequest, TravelDetails

from app.services.travel_extractor import (
    extract_travel_details,
    LLMConfigurationError,
    LLMProviderError,
    LLMParsingError,
)


router = APIRouter(
    prefix="/api/v1",
    tags=["Travel AI"],
)


@router.post(
    "/extract-trip",
    response_model=TravelDetails,
)
def extract_trip(request: TravelRequest):

    try:
        return extract_travel_details(request.message)

    except LLMConfigurationError:
        raise HTTPException(
            status_code=503,
            detail="LLM configuration is missing",
        )

    except LLMProviderError:
        raise HTTPException(
            status_code=502,
            detail=(
                "The LLM provider request failed. "
                "Check model availability and API limits."
            ),
        )

    except LLMParsingError:
        raise HTTPException(
            status_code=502,
            detail=(
                "The LLM response could not be validated. "
                "Please try again."
            ),
        )
