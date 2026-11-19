
import logging
from typing import Literal

from fastapi import (
    APIRouter,
    HTTPException,
    Query,
)

from app.schemas import (
    ParallelTravelRequest,
    ParallelTravelResponse,
)

from app.services.parallel_data import (
    get_parallel_travel_data,
)


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/v1",
    tags=["Parallel Travel Data"],
)


@router.post(
    "/parallel-trip-data",
    response_model=ParallelTravelResponse,
)
def parallel_trip_data(
    request: ParallelTravelRequest,
    mode: Literal[
        "parallel",
        "sequential",
    ] = Query(default="parallel"),
) -> ParallelTravelResponse:

    try:
        return get_parallel_travel_data(
            request=request,
            mode=mode,
        )

    except Exception as exc:
        logger.exception(
            "Parallel travel data workflow failed"
        )

        raise HTTPException(
            status_code=500,
            detail="Travel data processing failed",
        ) from exc
