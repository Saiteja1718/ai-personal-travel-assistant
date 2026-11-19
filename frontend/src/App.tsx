
import { useCallback, useEffect, useState } from "react";

import {
  Plane,
  MapPin,
  CloudSun,
  BrainCircuit,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Route,
} from "lucide-react";

import {
  getHealth,
  type HealthResponse,
} from "./services/api";

// Phase 2
import TravelExtractor from "./components/TravelExtractor";

// Phase 3
import RecommendationGenerator from "./components/RecommendationGenerator";

// Phase 4
import TripPlannerPreview from "./components/TripPlannerPreview";

// Phase 5
import ParallelTravelData from "./components/ParallelTravelData";


type ConnectionStatus =
  | "checking"
  | "connected"
  | "error";


const features = [
  {
    title: "AI Travel Planning",
    description: "Generate personalized travel itineraries.",
    icon: BrainCircuit,
  },
  {
    title: "Weather Insights",
    description: "Plan activities around weather conditions.",
    icon: CloudSun,
  },
  {
    title: "Travel Knowledge",
    description: "Retrieve information from travel guides using RAG.",
    icon: Database,
  },
  {
    title: "Smart Itineraries",
    description: "Organize activities into day-by-day plans.",
    icon: Route,
  },
];


function App() {
  const [status, setStatus] =
    useState<ConnectionStatus>("checking");

  const [health, setHealth] =
    useState<HealthResponse | null>(null);

  const [error, setError] = useState("");


  // ========================================
  // Phase 1: Backend connection
  // ========================================

  const checkConnection = useCallback(async () => {
    setStatus("checking");
    setError("");

    try {
      const result = await getHealth();

      setHealth(result);
      setStatus("connected");

    } catch {
      setHealth(null);
      setStatus("error");
      setError("Cannot connect to the FastAPI backend.");
    }
  }, []);


  useEffect(() => {
    void checkConnection();
  }, [checkConnection]);


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* ==================================
          HEADER
      ================================== */}

      <header className="border-b border-slate-800">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-600 p-2">
              <Plane size={24} />
            </div>

            <div>
              <h1 className="text-lg font-bold">
                AI Travel Assistant
              </h1>

              <p className="text-xs text-slate-400">
                Your intelligent travel companion
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 text-sm text-slate-300">
            <MapPin size={16} />
            New York
          </div>

        </div>
      </header>


      {/* ==================================
          MAIN CONTENT
      ================================== */}

      <main className="mx-auto max-w-6xl px-6 py-16">

        {/* Introduction */}

        <section className="mb-14 text-center">

          <div className="mb-5 inline-block rounded-full border border-blue-700 bg-blue-950 px-4 py-2 text-sm text-blue-300">
            AI-Powered Travel Planning
          </div>

          <h2 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
            Plan your next adventure
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Discover destinations, plan personalized trips,
            explore attractions, and organize your journey
            using artificial intelligence.
          </p>

        </section>


        {/* ==================================
            PHASE 1: BACKEND CONNECTION
        ================================== */}

        <section className="mb-12 rounded-2xl border border-slate-800 bg-slate-900 p-7">

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

            <h3 className="text-xl font-semibold">
              Backend Connection
            </h3>

            <button
              onClick={() => void checkConnection()}
              disabled={status === "checking"}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Check Connection
            </button>

          </div>


          {status === "checking" && (
            <p className="text-yellow-300">
              Checking FastAPI connection...
            </p>
          )}


          {status === "connected" && (
            <div className="flex items-start gap-3 text-green-400">

              <CheckCircle2 size={24} />

              <div>
                <p className="font-semibold">
                  Backend Connected Successfully
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  Service: {health?.service}
                </p>

                <p className="text-sm text-slate-300">
                  Status: {health?.status}
                </p>
              </div>

            </div>
          )}


          {status === "error" && (
            <div className="flex items-center gap-3 text-red-400">

              <AlertCircle size={22} />

              <p>{error}</p>

            </div>
          )}

        </section>


        {/* ==================================
            PHASE 2: LLM EXTRACTION
        ================================== */}

        <TravelExtractor />


        {/* ==================================
            PHASE 3: LCEL RECOMMENDATIONS
        ================================== */}

        <RecommendationGenerator />


        {/* ==================================
            PHASE 4: SEQUENTIAL CHAINS
        ================================== */}

        <TripPlannerPreview />


        {/* ==================================
            PHASE 5: PARALLEL CHAINS
        ================================== */}

        <ParallelTravelData />


        {/* ==================================
            UPCOMING FEATURES
        ================================== */}

        <section>

          <h3 className="mb-6 text-2xl font-semibold">
            What we're building
          </h3>

          <div className="grid gap-5 md:grid-cols-2">

            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >

                  <Icon
                    className="mb-4 text-blue-400"
                    size={30}
                  />

                  <h4 className="mb-2 text-lg font-semibold">
                    {feature.title}
                  </h4>

                  <p className="text-sm text-slate-400">
                    {feature.description}
                  </p>

                  <span className="mt-4 inline-block text-xs text-slate-500">
                    Coming in a later phase
                  </span>

                </div>
              );
            })}

          </div>

        </section>

      </main>


      {/* ==================================
          FOOTER
      ================================== */}

      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        AI Personal Travel Assistant — Phase 5
      </footer>

    </div>
  );
}

export default App;
