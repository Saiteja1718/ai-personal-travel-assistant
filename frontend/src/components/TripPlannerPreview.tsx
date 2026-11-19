
import { useState, type FormEvent } from "react";
import axios from "axios";

import {
  Sparkles,
  Loader2,
  AlertCircle,
  Route,
  Layers,
} from "lucide-react";

import {
  generateTripPreview,
  type TripPreviewResponse,
} from "../services/api";

import MarkdownContent from "./MarkdownContent";


function TripPlannerPreview() {

  // ---------------------------------------
  // 1. Form state
  // ---------------------------------------

  const [message, setMessage] = useState(
    "Plan a 3-day trip to New York for 2 people " +
    "with a $1000 budget. I enjoy museums, " +
    "sightseeing, and food. I prefer walking " +
    "and budget-friendly activities."
  );

  // ---------------------------------------
  // 2. Result and loading state
  // ---------------------------------------

  const [result, setResult] =
    useState<TripPreviewResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ---------------------------------------
  // 3. Submit request
  // ---------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (message.trim().length < 10) {
      setError("Please provide more travel details.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {

      const data = await generateTripPreview(
        message.trim()
      );

      setResult(data);

    } catch (err) {

      console.error("Trip planning failed:", err);

      if (axios.isAxiosError(err)) {

        const detail = err.response?.data?.detail;

        setError(
          typeof detail === "string"
            ? detail
            : "Unable to generate the trip plan."
        );

      } else {

        setError("An unexpected error occurred.");

      }

    } finally {
      setLoading(false);
    }
  }


  return (
    <section className="mb-12 rounded-2xl border border-slate-800 bg-slate-900 p-7">

      {/* ---------------------------------------
          Section header
      --------------------------------------- */}

      <div className="mb-6 flex items-center gap-3">

        <Route
          size={28}
          className="text-blue-400"
        />

        <div>

          <h3 className="text-xl font-semibold text-white">
            AI Trip Planner — Sequential Chains
          </h3>

          <p className="text-sm text-slate-400">
            Extraction → Analysis → Recommendations → Itinerary
          </p>

        </div>
      </div>


      {/* ---------------------------------------
          Travel request form
      --------------------------------------- */}

      <form onSubmit={handleSubmit}>

        <label
          htmlFor="trip-preview-message"
          className="mb-3 block text-sm text-slate-300"
        >
          Describe your complete travel request
        </label>

        <textarea
          id="trip-preview-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          maxLength={3000}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-blue-500"
          placeholder="Plan a trip to New York..."
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >

          {loading ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Sparkles size={18} />
          )}

          {loading
            ? "Generating trip plan..."
            : "Generate Complete Trip Preview"}

        </button>

      </form>


      {/* ---------------------------------------
          Error message
      --------------------------------------- */}

      {error && (

        <div
          role="alert"
          className="mt-6 flex items-center gap-3 rounded-lg border border-red-800 bg-red-950 p-4 text-red-300"
        >

          <AlertCircle size={20} />

          <span>{error}</span>

        </div>

      )}


      {/* ---------------------------------------
          Trip planning results
      --------------------------------------- */}

      {result && (

        <div className="mt-8 space-y-6">

          {/* Final formatted trip plan */}

          <div className="rounded-xl border border-slate-700 bg-slate-950 p-6">

            <MarkdownContent
              content={result.final_plan}
            />

          </div>


          {/* ---------------------------------------
              Intermediate chain outputs
          --------------------------------------- */}

          <details className="rounded-xl border border-slate-700 bg-slate-950 p-6">

            <summary className="cursor-pointer text-base font-semibold text-blue-300">
              View Intermediate Chain Outputs
            </summary>

            <div className="mt-7 space-y-8">

              {/* Stage 1 */}

              <section>

                <div className="mb-4 flex items-center gap-2">
                  <Layers size={18} className="text-blue-400" />

                  <h4 className="font-semibold text-white">
                    Stage 1 — Extracted Information
                  </h4>
                </div>

                <pre className="overflow-x-auto rounded-lg bg-slate-900 p-5 text-sm leading-7 text-green-300">
                  {JSON.stringify(result.details, null, 2)}
                </pre>

              </section>


              {/* Stage 2 */}

              <section className="border-t border-slate-800 pt-6">

                <h4 className="mb-4 font-semibold text-white">
                  Stage 2 — Preference Analysis
                </h4>

                <MarkdownContent
                  content={result.preference_analysis}
                />

              </section>


              {/* Stage 3 */}

              <section className="border-t border-slate-800 pt-6">

                <h4 className="mb-4 font-semibold text-white">
                  Stage 3 — Recommendations
                </h4>

                <MarkdownContent
                  content={result.recommendations}
                />

              </section>


              {/* Stage 4 */}

              <section className="border-t border-slate-800 pt-6">

                <h4 className="mb-4 font-semibold text-white">
                  Stage 4 — Itinerary
                </h4>

                <MarkdownContent
                  content={result.preliminary_itinerary}
                />

              </section>

            </div>

          </details>


          {/* Important disclaimer */}

          <p className="text-xs leading-6 text-slate-500">
            This is an AI-generated preliminary itinerary.
            Prices, operating hours, routes, weather,
            and availability are not verified.
          </p>

        </div>

      )}

    </section>
  );
}

export default TripPlannerPreview;
