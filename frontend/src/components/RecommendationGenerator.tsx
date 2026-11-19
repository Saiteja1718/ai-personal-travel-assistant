
import { useState, type FormEvent } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

import {
  Sparkles,
  Loader2,
  MapPin,
  AlertCircle,
} from "lucide-react";

import {
  getTravelRecommendations,
  type RecommendationResponse,
} from "../services/api";


function RecommendationGenerator() {
  // -----------------------------------------
  // 1. Form state
  // -----------------------------------------

  const [destination, setDestination] = useState("New York");

  const [interests, setInterests] = useState(
    "museums, food, sightseeing"
  );

  const [preferences, setPreferences] = useState(
    "budget-friendly, walking"
  );

  // -----------------------------------------
  // 2. Response and UI state
  // -----------------------------------------

  const [result, setResult] =
    useState<RecommendationResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // -----------------------------------------
  // 3. Convert comma-separated text to array
  // -----------------------------------------

  function parseList(value: string): string[] {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }


  // -----------------------------------------
  // 4. Submit request to FastAPI
  // -----------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (destination.trim().length < 2) {
      setError("Please enter a valid destination.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await getTravelRecommendations({
        destination: destination.trim(),
        interests: parseList(interests),
        preferences: parseList(preferences),
      });

      setResult(data);

    } catch (err) {
      console.error("Recommendation request failed", err);

      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;

        setError(
          typeof detail === "string"
            ? detail
            : "Unable to generate recommendations."
        );
      } else {
        setError("An unexpected error occurred.");
      }

    } finally {
      setLoading(false);
    }
  }


  // -----------------------------------------
  // 5. React UI
  // -----------------------------------------

  return (
    <section className="mb-12 rounded-2xl border border-slate-800 bg-slate-900 p-7">

      {/* Header */}

      <div className="mb-6 flex items-center gap-3">
        <Sparkles
          size={28}
          className="text-blue-400"
        />

        <div>
          <h3 className="text-xl font-semibold">
            Personalized Travel Recommendations
          </h3>

          <p className="text-sm text-slate-400">
            LangChain LCEL + Groq
          </p>
        </div>
      </div>


      {/* Travel recommendation form */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* Destination */}

        <div>
          <label
            htmlFor="recommendation-destination"
            className="mb-2 block text-sm text-slate-300"
          >
            Destination
          </label>

          <input
            id="recommendation-destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            maxLength={100}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
            placeholder="Enter your destination"
          />
        </div>


        {/* Interests */}

        <div>
          <label
            htmlFor="recommendation-interests"
            className="mb-2 block text-sm text-slate-300"
          >
            Interests (comma-separated)
          </label>

          <input
            id="recommendation-interests"
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="museums, food, sightseeing"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
          />
        </div>


        {/* Travel preferences */}

        <div>
          <label
            htmlFor="recommendation-preferences"
            className="mb-2 block text-sm text-slate-300"
          >
            Travel Preferences (comma-separated)
          </label>

          <input
            id="recommendation-preferences"
            type="text"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="budget-friendly, walking"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
          />
        </div>


        {/* Submit button */}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
            ? "Generating Recommendations..."
            : "Generate 5 Recommendations"}
        </button>

      </form>


      {/* Error message */}

      {error && (
        <div
          role="alert"
          className="mt-6 flex items-center gap-3 rounded-lg border border-red-800 bg-red-950 p-4 text-red-300"
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}


      {/* -----------------------------------------
          FORMATTED LLM RECOMMENDATIONS
      ----------------------------------------- */}

      {result && (
        <div className="mt-8 rounded-xl border border-slate-700 bg-slate-950 p-6">

          {/* Results header */}

          <div className="mb-6 flex items-center gap-3">
            <MapPin
              size={24}
              className="text-green-400"
            />

            <h4 className="text-xl font-semibold text-white">
              Recommendations for {result.destination}
            </h4>
          </div>


          {/* React Markdown Renderer */}

          <div className="text-sm text-slate-200">

            <ReactMarkdown
              components={{

                // Numbered recommendations
                ol: ({ children }) => (
                  <ol className="list-decimal space-y-6 pl-6">
                    {children}
                  </ol>
                ),

                // Bullet points
                ul: ({ children }) => (
                  <ul className="list-disc space-y-3 pl-6">
                    {children}
                  </ul>
                ),

                // List items
                li: ({ children }) => (
                  <li className="pl-2 leading-7">
                    {children}
                  </li>
                ),

                // Paragraphs
                p: ({ children }) => (
                  <p className="mb-3 leading-7 last:mb-0">
                    {children}
                  </p>
                ),

                // Bold text
                strong: ({ children }) => (
                  <strong className="font-semibold text-white">
                    {children}
                  </strong>
                ),

                // Italic text
                em: ({ children }) => (
                  <em className="text-slate-300">
                    {children}
                  </em>
                ),

                // Main headings
                h2: ({ children }) => (
                  <h2 className="mb-4 mt-5 text-xl font-bold text-white">
                    {children}
                  </h2>
                ),

                // Section headings
                h3: ({ children }) => (
                  <h3 className="mb-3 mt-4 text-lg font-semibold text-blue-300">
                    {children}
                  </h3>
                ),

              }}
            >
              {result.recommendations}
            </ReactMarkdown>

          </div>


          {/* Disclaimer */}

          <div className="mt-8 border-t border-slate-800 pt-4">
            <p className="text-xs leading-5 text-slate-500">
              AI-generated travel suggestions.
              Live availability, ticket prices,
              opening hours, and weather conditions
              have not been verified.
            </p>
          </div>

        </div>
      )}

    </section>
  );
}


export default RecommendationGenerator;
