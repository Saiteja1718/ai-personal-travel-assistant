
import { useState } from "react";
import axios from "axios";

import {
  CloudSun,
  MapPin,
  Utensils,
  Wallet,
  Zap,
  Clock,
  Loader2,
  AlertCircle,
  GitCompareArrows,
} from "lucide-react";

import {
  getParallelTravelData,
  type ParallelMode,
  type ParallelTravelResponse,
  type ParallelTravelRequest,
} from "../services/api";


function ParallelTravelData() {

  // ========================================
  // Form state
  // ========================================

  const [destination, setDestination] =
    useState("Paris");

  const [days, setDays] = useState(2);

  const [travelers, setTravelers] =
    useState(2);

  const [interests, setInterests] =
    useState("art, architecture");

  const [budget, setBudget] =
    useState("600");

  const [currency, setCurrency] =
    useState("USD");


  // ========================================
  // Result state
  // ========================================

  const [results, setResults] = useState<
    Partial<Record<ParallelMode, ParallelTravelResponse>>
  >({});

  const [loading, setLoading] =
    useState<ParallelMode | null>(null);

  const [error, setError] = useState("");


  // ========================================
  // Helpers
  // ========================================

  function clearResults() {
    setResults({});
    setError("");
  }

  function parseInterests(value: string): string[] {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }


  // ========================================
  // Execute backend workflow
  // ========================================

  async function runWorkflow(mode: ParallelMode) {

    if (destination.trim().length < 2) {
      setError("Please enter a valid destination.");
      return;
    }

    if (days < 1 || days > 30) {
      setError("Duration must be between 1 and 30 days.");
      return;
    }

    if (travelers < 1 || travelers > 20) {
      setError("Travelers must be between 1 and 20.");
      return;
    }

    if (
      budget.trim() !== "" &&
      (!Number.isFinite(Number(budget)) ||
        Number(budget) < 0)
    ) {
      setError("Enter a valid non-negative budget.");
      return;
    }

    const currencyCode = currency.trim().toUpperCase();

    if (!/^[A-Z]{3}$/.test(currencyCode)) {
      setError("Enter a three-letter currency code.");
      return;
    }

    const request: ParallelTravelRequest = {
      destination: destination.trim(),
      duration_days: days,
      travelers,
      interests: parseInterests(interests),
      budget:
        budget.trim() === ""
          ? null
          : Number(budget),
      currency: currencyCode,
    };

    setLoading(mode);
    setError("");

    try {
      const response = await getParallelTravelData(
        request,
        mode
      );

      setResults((previous) => ({
        ...previous,
        [mode]: response,
      }));

    } catch (err) {
      console.error("Parallel workflow failed:", err);

      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;

        setError(
          typeof detail === "string"
            ? detail
            : "Unable to retrieve travel demo data."
        );
      } else {
        setError("Unexpected application error.");
      }

    } finally {
      setLoading(null);
    }
  }


  const displayResult =
    results.parallel ?? results.sequential;

  const hasComparison =
    results.parallel !== undefined &&
    results.sequential !== undefined;

  const speedup = hasComparison
    ? results.sequential!.elapsed_ms /
      Math.max(results.parallel!.elapsed_ms, 0.01)
    : null;


  // ========================================
  // React interface
  // ========================================

  return (
    <section className="mb-12 rounded-2xl border border-slate-800 bg-slate-900 p-7">

      {/* Header */}

      <div className="mb-6 flex items-center gap-3">

        <GitCompareArrows
          size={28}
          className="text-blue-400"
        />

        <div>
          <h3 className="text-xl font-semibold">
            Parallel Travel Data Pipeline
          </h3>

          <p className="text-sm text-slate-400">
            LangChain RunnableParallel — Phase 5
          </p>
        </div>
      </div>


      {/* Demo disclaimer */}

      <div className="mb-6 rounded-lg border border-amber-800 bg-amber-950/30 p-4">
        <p className="text-sm text-amber-200">
          Learning demonstration: weather and place
          suggestions use simulated data. Budget
          amounts represent allocations, not actual
          travel costs or live prices.
        </p>
      </div>


      {/* Input fields */}

      <div className="grid gap-5 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm">
            Destination
          </label>

          <input
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              clearResults();
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Interests (comma-separated)
          </label>

          <input
            value={interests}
            onChange={(e) => {
              setInterests(e.target.value);
              clearResults();
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Duration (days)
          </label>

          <input
            type="number"
            min="1"
            max="30"
            value={days}
            onChange={(e) => {
              setDays(Number(e.target.value));
              clearResults();
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Number of Travelers
          </label>

          <input
            type="number"
            min="1"
            max="20"
            value={travelers}
            onChange={(e) => {
              setTravelers(Number(e.target.value));
              clearResults();
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Total Budget (optional)
          </label>

          <input
            type="number"
            min="0"
            value={budget}
            onChange={(e) => {
              setBudget(e.target.value);
              clearResults();
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Currency Code
          </label>

          <input
            value={currency}
            maxLength={3}
            onChange={(e) => {
              setCurrency(e.target.value);
              clearResults();
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
          />
        </div>

      </div>


      {/* Execution buttons */}

      <div className="mt-7 flex flex-wrap gap-3">

        <button
          type="button"
          disabled={loading !== null}
          onClick={() => void runWorkflow("sequential")}
          className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-5 py-3 font-medium hover:bg-slate-700 disabled:opacity-50"
        >
          {loading === "sequential" ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Clock size={18} />
          )}

          Run Sequential
        </button>

        <button
          type="button"
          disabled={loading !== null}
          onClick={() => void runWorkflow("parallel")}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading === "parallel" ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Zap size={18} />
          )}

          Run Parallel
        </button>

      </div>


      {/* Error message */}

      {error && (
        <div
          role="alert"
          className="mt-6 flex items-center gap-2 text-red-400"
        >
          <AlertCircle size={20} />
          {error}
        </div>
      )}


      {/* Performance comparison */}

      {(results.sequential || results.parallel) && (
        <div className="mt-8 rounded-xl border border-slate-700 bg-slate-950 p-6">

          <h4 className="mb-5 text-lg font-semibold">
            Execution Performance
          </h4>

          <div className="grid gap-4 md:grid-cols-2">

            <div className="rounded-lg bg-slate-900 p-4">
              <p className="mb-2 text-sm text-slate-400">
                Sequential
              </p>

              <p className="text-2xl font-bold">
                {results.sequential
                  ? `${results.sequential.elapsed_ms.toFixed(2)} ms`
                  : "Not run yet"}
              </p>
            </div>

            <div className="rounded-lg bg-slate-900 p-4">
              <p className="mb-2 text-sm text-slate-400">
                Parallel
              </p>

              <p className="text-2xl font-bold text-blue-400">
                {results.parallel
                  ? `${results.parallel.elapsed_ms.toFixed(2)} ms`
                  : "Not run yet"}
              </p>
            </div>

          </div>

          {speedup !== null && (
            <p className="mt-5 font-semibold text-green-400">
              Measured speedup: {speedup.toFixed(2)}x
            </p>
          )}

          <p className="mt-3 text-xs text-slate-500">
            Measured backend execution time for simulated
            operations. Results can vary between runs.
          </p>

        </div>
      )}


      {/* Travel information */}

      {displayResult && (
        <div className="mt-8">

          <h4 className="mb-5 text-lg font-semibold">
            Travel Data — {displayResult.destination}
          </h4>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Weather */}

            <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
              <div className="mb-3 flex items-center gap-2">
                <CloudSun className="text-blue-400" />
                <h5 className="font-semibold">
                  Weather Scenario
                </h5>
              </div>

              <p>{displayResult.weather.scenario}</p>

              <p className="mt-3 text-xs text-slate-500">
                {displayResult.weather.note}
              </p>
            </div>


            {/* Attractions */}

            <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
              <div className="mb-3 flex items-center gap-2">
                <MapPin className="text-blue-400" />
                <h5 className="font-semibold">
                  Attractions — Demo Suggestions
                </h5>
              </div>

              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
                {displayResult.attractions.items.map(
                  (item, index) => (
                    <li key={`${index}-${item}`}>
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>


            {/* Restaurants */}

            <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Utensils className="text-blue-400" />
                <h5 className="font-semibold">
                  Food — Demo Suggestions
                </h5>
              </div>

              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
                {displayResult.restaurants.items.map(
                  (item, index) => (
                    <li key={`${index}-${item}`}>
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>


            {/* Budget */}

            <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Wallet className="text-blue-400" />
                <h5 className="font-semibold">
                  Budget Allocation
                </h5>
              </div>

              {displayResult.budget.breakdown ? (
                <div className="space-y-2">
                  {Object.entries(
                    displayResult.budget.breakdown
                  ).map(([category, amount]) => (
                    <div
                      key={category}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <span className="text-slate-300">
                        {category}
                      </span>

                      <span className="font-medium">
                        {amount.toFixed(2)}{" "}
                        {currency.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No budget supplied.
                </p>
              )}

              <p className="mt-4 text-xs text-slate-500">
                {displayResult.budget.note}
              </p>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}

export default ParallelTravelData;
