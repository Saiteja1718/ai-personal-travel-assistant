
import { useState, type FormEvent } from "react";
import axios from "axios";

import {
  Sparkles,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  extractTravelDetails,
  type TravelDetails,
} from "../services/api";


function TravelExtractor() {
  const [message, setMessage] = useState(
    "Plan a 3-day trip to New York for 2 people with a $1000 budget. I like museums, sightseeing, and restaurants."
  );

  const [result, setResult] =
    useState<TravelDetails | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (message.trim().length < 10) {
      setError("Please enter a longer travel request.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await extractTravelDetails(message);

      setResult(data);

    } catch (err) {
      console.error("Travel extraction failed", err);

      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;

        setError(
          typeof detail === "string"
            ? detail
            : "Unable to process your request."
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

      <div className="mb-6 flex items-center gap-3">
        <Sparkles className="text-blue-400" size={28} />

        <div>
          <h3 className="text-xl font-semibold">
            AI Travel Request Extractor
          </h3>

          <p className="text-sm text-slate-400">
            Powered by Groq + Llama + LangChain
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label
          htmlFor="travel-message"
          className="mb-3 block text-sm text-slate-300"
        >
          Describe your travel plans
        </label>

        <textarea
          id="travel-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          maxLength={3000}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-slate-100 outline-none focus:border-blue-500"
          placeholder="Plan a trip to New York..."
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Send size={18} />
          )}

          {loading
            ? "Extracting travel details..."
            : "Extract Travel Details"}
        </button>
      </form>

      {error && (
        <div
          role="alert"
          className="mt-6 flex items-center gap-2 rounded-lg border border-red-800 bg-red-950 p-4 text-red-300"
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-8">

          <h4 className="mb-4 text-lg font-semibold text-green-400">
            Extracted Travel Information
          </h4>

          <div className="grid gap-4 md:grid-cols-2">
            <ResultItem
              label="Destination"
              value={result.destination}
            />

            <ResultItem
              label="Duration"
              value={
                result.duration_days == null
                  ? null
                  : `${result.duration_days} days`
              }
            />

            <ResultItem
              label="Budget"
              value={
                result.budget == null
                  ? null
                  : `${result.currency ?? ""} ${result.budget}`
              }
            />

            <ResultItem
              label="Travelers"
              value={result.travelers}
            />

            <ResultItem
              label="Start Date"
              value={result.start_date}
            />

            <ResultItem
              label="End Date"
              value={result.end_date}
            />
          </div>

          <div className="mt-5 rounded-xl bg-slate-950 p-5">
            <p className="mb-3 text-sm text-slate-400">
              Interests
            </p>

            <div className="flex flex-wrap gap-2">
              {result.interests.length > 0
                ? result.interests.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-lg bg-blue-950 px-3 py-2 text-sm text-blue-300"
                    >
                      {interest}
                    </span>
                  ))
                : <span>Not specified</span>}
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-950 p-5">
            <p className="mb-3 text-sm text-slate-400">
              Preferences
            </p>

            <p className="text-sm">
              {result.preferences.length > 0
                ? result.preferences.join(", ")
                : "Not specified"}
            </p>
          </div>

          <div className="mt-5">
            <h4 className="mb-3 font-semibold">
              Structured JSON Response
            </h4>

            <pre className="overflow-x-auto rounded-xl bg-slate-950 p-5 text-sm text-green-300">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}

    </section>
  );
}


function ResultItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="rounded-xl bg-slate-950 p-4">
      <p className="mb-2 text-xs text-slate-400">
        {label}
      </p>

      <p className="font-medium">
        {value ?? "Not specified"}
      </p>
    </div>
  );
}


export default TravelExtractor;
