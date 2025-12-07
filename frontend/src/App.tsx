import { useState } from "react";
import "./App.css";
import { getApiEndpoint, getWebSocketUrl } from "./config";
import {
  DeploymentResult,
  GenerateResponse,
  ProgressUpdate,
  UserRequest,
} from "./types";

function App() {
  const [description, setDescription] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [result, setResult] = useState<DeploymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateInput = (input: string): boolean => {
    if (!input || input.trim().length === 0) {
      setValidationError("Description cannot be empty");
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    if (!validateInput(description)) {
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgressUpdates([]);
    setResult(null);

    try {
      // Call backend API to initiate generation
      const response = await fetch(getApiEndpoint("/api/generate"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description.trim(),
        } as UserRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to initiate generation");
      }

      const data: GenerateResponse = await response.json();
      setSessionId(data.session_id);

      // Connect to WebSocket for progress updates
      connectWebSocket(data.session_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsGenerating(false);
    }
  };

  const connectWebSocket = (sessionId: string) => {
    const wsUrl = getWebSocketUrl(`/ws/${sessionId}`);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const update: ProgressUpdate = JSON.parse(event.data);
      setProgressUpdates((prev) => [...prev, update]);

      // Check if workflow is complete
      if (update.type === "complete") {
        fetchResult(sessionId);
      } else if (
        update.type === "error" &&
        update.message.includes("Workflow failed")
      ) {
        setError(update.message);
        setIsGenerating(false);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("Connection error occurred");
      setIsGenerating(false);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };
  };

  const fetchResult = async (sessionId: string) => {
    try {
      const response = await fetch(getApiEndpoint(`/api/result/${sessionId}`));
      if (!response.ok) {
        throw new Error("Failed to fetch result");
      }

      const data: DeploymentResult = await response.json();
      setResult(data);
      setIsGenerating(false);

      if (!data.success && data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch result");
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setDescription("");
    setSessionId(null);
    setIsGenerating(false);
    setProgressUpdates([]);
    setResult(null);
    setError(null);
    setValidationError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AMAR MVP</h1>
          <p className="text-lg text-gray-600">
            Autonomous Memory Agentic Realms
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Generate React applications from natural language descriptions
          </p>
        </header>

        <main className="max-w-2xl mx-auto">
          {/* User Input Form - Subtask 13.1 */}
          {!isGenerating && !result && (
            <div className="bg-white rounded-lg shadow-md p-6 fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Describe Your Application
              </h2>
              <p className="text-gray-600 mb-4">
                Tell us what kind of web application you'd like to build. We'll
                plan, code, test, and deploy it for you automatically.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <textarea
                    className={`w-full h-32 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      validationError ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Example: Build a landing page for a coffee shop with a menu, about section, and contact form..."
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (validationError) {
                        validateInput(e.target.value);
                      }
                    }}
                    onBlur={() => validateInput(description)}
                  />
                  {validationError && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isGenerating || !description.trim()}
                >
                  Generate Application
                </button>
              </form>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Maximum 5 pages per application.
                  Generation typically takes 3-5 minutes.
                </p>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">
                    <strong>Error:</strong> {error}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Real-time Progress Display - Subtask 13.2 */}
          {isGenerating && (
            <div className="bg-white rounded-lg shadow-md p-6 fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Generating Your Application
              </h2>
              <p className="text-gray-600 mb-6">
                Please wait while our agents plan, build, test, and deploy your
                application...
              </p>

              <div className="space-y-3">
                {progressUpdates.map((update, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md border ${
                      update.status === "completed"
                        ? "bg-green-50 border-green-200"
                        : update.status === "failed"
                        ? "bg-red-50 border-red-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {update.status === "running" && (
                          <div className="spinner"></div>
                        )}
                        {update.status === "completed" && (
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {update.status === "failed" && (
                          <svg
                            className="w-5 h-5 text-red-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {update.agent && (
                            <span className="capitalize">
                              {update.agent} Agent:{" "}
                            </span>
                          )}
                          {update.message}
                        </p>
                        {update.details && (
                          <p className="mt-1 text-xs text-gray-600">
                            {update.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">
                    <strong>Error:</strong> {error}
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Deployment Result Display - Subtask 13.3 */}
          {result && !isGenerating && (
            <div className="bg-white rounded-lg shadow-md p-6 fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {result.success
                  ? "🎉 Application Deployed!"
                  : "❌ Deployment Failed"}
              </h2>

              {result.success && result.url && (
                <div className="mb-6">
                  <p className="text-gray-600 mb-3">
                    Your application has been successfully deployed and is now
                    live!
                  </p>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <span>View Your Application</span>
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Deployment URL:</p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all">
                      {result.url}
                    </code>
                  </div>
                </div>
              )}

              {result.project_summary && (
                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Project Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Pages</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {result.project_summary.page_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Components</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {result.project_summary.component_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Files Generated</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {result.project_summary.file_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Execution Time</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {result.execution_time
                          ? `${(result.execution_time / 1000).toFixed(1)}s`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!result.success && result.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">
                    <strong>Error:</strong> {result.error}
                  </p>
                </div>
              )}

              <button
                onClick={handleReset}
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-md font-medium hover:bg-gray-700 transition-colors"
              >
                Generate Another Application
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
