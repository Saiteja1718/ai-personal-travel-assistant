
import axios from "axios";

export interface HealthResponse {
  status: string;
  service: string;
}

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8000",

  timeout: 10000,
});

export async function getHealth(): Promise<HealthResponse> {
  const response = await api.get<HealthResponse>("/health");

  return response.data;
}


export interface TravelDetails {
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
  duration_days: number | null;
  budget: number | null;
  currency: string | null;
  travelers: number | null;
  interests: string[];
  preferences: string[];
}

export async function extractTravelDetails(
  message: string
): Promise<TravelDetails> {
  const response = await api.post<TravelDetails>(
    "/api/v1/extract-trip",
    { message }
  );

  return response.data;
}


// -----------------------------------------
// Phase 3: Travel Recommendations
// -----------------------------------------

export interface RecommendationRequest {
  destination: string;
  interests: string[];
  preferences: string[];
}

export interface RecommendationResponse {
  destination: string;
  recommendations: string;
}

export async function getTravelRecommendations(
  request: RecommendationRequest
): Promise<RecommendationResponse> {
  const response = await api.post<RecommendationResponse>(
    "/api/v1/recommendations",
    request
  );

  return response.data;
}


// ---------------------------------------
// Phase 4: Sequential Trip Planning
// ---------------------------------------

export interface TripPreviewResponse {
  details: TravelDetails;

  preference_analysis: string;

  recommendations: string;

  preliminary_itinerary: string;

  final_plan: string;
}

export async function generateTripPreview(
  message: string
): Promise<TripPreviewResponse> {
  const response = await api.post<TripPreviewResponse>(
    "/api/v1/plan-trip-preview",
    { message },
    {
      timeout: 120000,
    }
  );

  return response.data;
}


// ==========================================
// Phase 5: Parallel Travel Data
// ==========================================

export type ParallelMode =
  | "parallel"
  | "sequential";


export interface ParallelTravelRequest {
  destination: string;
  duration_days: number;
  travelers: number;
  interests: string[];
  budget: number | null;
  currency: string;
}


export interface WeatherScenario {
  scenario: string;
  source: "mock";
  note: string;
}


export interface TravelSuggestions {
  items: string[];
  source: "mock";
}


export interface BudgetAllocation {
  breakdown: Record<string, number> | null;
  source: "calculation";
  note: string;
}


export interface ParallelTravelResponse {
  destination: string;
  mode: ParallelMode;

  weather: WeatherScenario;
  attractions: TravelSuggestions;
  restaurants: TravelSuggestions;
  budget: BudgetAllocation;

  elapsed_ms: number;
}


export async function getParallelTravelData(
  request: ParallelTravelRequest,
  mode: ParallelMode
): Promise<ParallelTravelResponse> {

  const response = await api.post<ParallelTravelResponse>(
    "/api/v1/parallel-trip-data",
    request,
    {
      params: { mode },
      timeout: 30000,
    }
  );

  return response.data;
}
