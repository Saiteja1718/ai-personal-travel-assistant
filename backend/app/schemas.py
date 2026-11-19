
from datetime import date

from pydantic import (
    BaseModel,
    Field,
    field_validator,
    model_validator,
)


class TravelRequest(BaseModel):
    message: str = Field(
        min_length=10,
        max_length=3000,
        description="Natural-language travel request",
    )

    @field_validator("message")
    @classmethod
    def validate_message(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Message cannot be empty")
        return value.strip()


class TravelDetails(BaseModel):
    destination: str | None = None

    start_date: date | None = None
    end_date: date | None = None

    duration_days: int | None = Field(
        default=None,
        ge=1,
        le=90,
    )

    budget: float | None = Field(
        default=None,
        ge=0,
    )

    currency: str | None = None

    travelers: int | None = Field(
        default=None,
        ge=1,
        le=100,
    )

    interests: list[str] = Field(default_factory=list)

    preferences: list[str] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.end_date:
            if self.end_date < self.start_date:
                raise ValueError(
                    "End date cannot be before start date"
                )

        return self


# -----------------------------------------
# Phase 3: Recommendation schemas
# -----------------------------------------

class RecommendationRequest(BaseModel):
    destination: str = Field(
        min_length=2,
        max_length=100,
    )

    interests: list[str] = Field(
        default_factory=list,
        max_length=12,
    )

    preferences: list[str] = Field(
        default_factory=list,
        max_length=12,
    )

    @field_validator("destination")
    @classmethod
    def clean_destination(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Destination cannot be empty")

        return value


class RecommendationResponse(BaseModel):
    destination: str
    recommendations: str



# ---------------------------------------
# Phase 4: Sequential Trip Planning
# ---------------------------------------

class TripPreviewResponse(BaseModel):
    details: TravelDetails

    preference_analysis: str

    recommendations: str

    preliminary_itinerary: str

    final_plan: str



# ==========================================
# Phase 5: Parallel Travel Data
# ==========================================

from typing import Literal


class ParallelTravelRequest(BaseModel):
    destination: str = Field(
        min_length=2,
        max_length=100,
    )

    duration_days: int = Field(
        default=2,
        ge=1,
        le=30,
    )

    travelers: int = Field(
        default=1,
        ge=1,
        le=20,
    )

    interests: list[str] = Field(
        default_factory=list,
        max_length=10,
    )

    budget: float | None = Field(
        default=None,
        ge=0,
    )

    currency: str = Field(
        default="USD",
        pattern=r"^[A-Z]{3}$",
    )

    @field_validator("destination")
    @classmethod
    def validate_destination(cls, value: str) -> str:
        value = value.strip()

        if len(value) < 2:
            raise ValueError("Invalid destination")

        return value


class WeatherScenario(BaseModel):
    scenario: str
    source: Literal["mock"] = "mock"
    note: str


class TravelSuggestions(BaseModel):
    items: list[str]
    source: Literal["mock"] = "mock"


class BudgetAllocation(BaseModel):
    breakdown: dict[str, float] | None
    source: Literal["calculation"] = "calculation"
    note: str


class ParallelTravelResponse(BaseModel):
    destination: str
    mode: Literal["parallel", "sequential"]

    weather: WeatherScenario
    attractions: TravelSuggestions
    restaurants: TravelSuggestions
    budget: BudgetAllocation

    elapsed_ms: float
