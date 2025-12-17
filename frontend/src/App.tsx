import { useState } from "react";
import "./App.css";
import { getApiEndpoint, getWebSocketUrl } from "./config";
import {
  DeploymentResult,
  GenerateResponse,
  ProgressUpdate,
  UserRequest,
} from "./types";
import ParticleBackground from "./components/ParticleBackground";

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
        // If deployment URL is in the message, create result immediately
        if (update.deployment_url) {
          setResult({
            success: true,
            url: update.deployment_url,
            execution_time: update.execution_time_ms || 0,
            project_summary: {
              page_count: 0,
              component_count: 0,
              file_count: 0,
            },
          });
          setIsGenerating(false);
        } else {
          // Deployment completed but no URL - show status
          setResult({
            success: true,
            execution_time: update.execution_time_ms || 0,
            project_summary: {
              page_count: 0,
              component_count: 0,
              file_count: 0,
            },
          });
          setIsGenerating(false);
        }
        // Always fetch full result to get project summary
        fetchResult(sessionId);
      } else if (
        update.type === "error" &&
        update.message.includes("Workflow failed")
      ) {
        setError(update.message);
        setIsGenerating(false);
      }
      
      // Also check for deployment completion in progress updates
      if (
        update.type === "progress" &&
        update.agent === "deployer" &&
        update.status === "completed" &&
        update.details &&
        update.details.includes("Deployment URL:")
      ) {
        // Extract URL from details if present
        const urlMatch = update.details.match(/Deployment URL:\s*(https?:\/\/[^\s]+)/);
        if (urlMatch && urlMatch[1]) {
          setResult({
            success: true,
            url: urlMatch[1],
            execution_time: 0,
            project_summary: {
              page_count: 0,
              component_count: 0,
              file_count: 0,
            },
          });
          setIsGenerating(false);
          // Still fetch full result
          fetchResult(sessionId);
        }
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
      // Update result (merge with existing if URL was already set from WebSocket)
      setResult((prev) => ({
        ...data,
        // Preserve URL from WebSocket if it was already set
        url: prev?.url || data.url,
      }));
      setIsGenerating(false);

      if (!data.success && data.error) {
        setError(data.error);
      }
    } catch (err) {
      // If we already have a result with URL, don't show error
      if (!result?.url) {
        setError(err instanceof Error ? err.message : "Failed to fetch result");
        setIsGenerating(false);
      } else {
        // We have a URL, just mark as generating false
        setIsGenerating(false);
      }
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
    <div className="app-container">
      <ParticleBackground />
      
      <div className="main-content">
        <header className="header">
          <h1>AMAR MVP</h1>
          <p className="subtitle">Autonomous Memory Agentic Realms</p>
          <p className="description">
            Generate React applications from natural language descriptions
          </p>
        </header>

        <main style={{ width: '100%', maxWidth: '800px' }}>
          {/* User Input Form */}
          {!isGenerating && !result && (
            <div className="card fade-in">
              <h2 className="card-title">
                <span>✨</span>
                Describe Your Application
              </h2>
              <p className="card-description">
                Tell us what kind of web application you'd like to build. We'll
                plan, code, test, and deploy it for you automatically.
              </p>

              <form onSubmit={handleSubmit} className="form-container">
                <div className="textarea-wrapper">
                  <textarea
                    className={`textarea ${validationError ? 'error' : ''}`}
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
                    <div className="error-message">
                      <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {validationError}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={isGenerating || !description.trim()}
                >
                  <span>🚀</span>
                  <span>Generate Application</span>
                </button>
              </form>

              <div className="info-box info">
                <p>
                  <strong>💡 Note:</strong> Maximum 5 pages per application.
                  Generation typically takes 3-5 minutes.
                </p>
              </div>

              {error && (
                <div className="info-box error">
                  <p>
                    <strong>⚠️ Error:</strong> {error}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Real-time Progress Display */}
          {isGenerating && (
            <div className="card fade-in">
              <h2 className="card-title">
                <span>⚡</span>
                Generating Your Application
              </h2>
              <p className="card-description">
                Please wait while our agents plan, build, test, and deploy your
                application...
              </p>

              <div className="progress-container">
                {progressUpdates.map((update, index) => (
                  <div
                    key={index}
                    className={`progress-item ${update.status || 'running'}`}
                  >
                    <div className="progress-icon">
                      {update.status === "running" && (
                        <div className="spinner"></div>
                      )}
                      {update.status === "completed" && (
                        <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      {update.status === "failed" && (
                        <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="progress-content">
                      <p className="progress-message">
                        {update.agent && (
                          <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>
                            {update.agent} Agent:{" "}
                          </span>
                        )}
                        {update.message}
                      </p>
                      {update.details && (
                        <p className="progress-details">
                          {update.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="info-box error">
                  <p>
                    <strong>⚠️ Error:</strong> {error}
                  </p>
                  <button
                    onClick={handleReset}
                    className="btn btn-secondary"
                    style={{ marginTop: '1rem' }}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Deployment Result Display */}
          {result && !isGenerating && (
            <div className="card result-container">
              <h2 className="result-title">
                <span>{result.success ? "🎉" : "❌"}</span>
                {result.success
                  ? "Application Deployed!"
                  : "Deployment Failed"}
              </h2>

              {result.success && (
                <div style={{ marginBottom: '2rem' }}>
                  {result.url ? (
                    <>
                      <p className="card-description">
                        Your application has been successfully deployed and is now
                        live!
                      </p>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-full"
                        style={{ marginTop: '1.5rem' }}
                      >
                        <span>🌐</span>
                        <span>View Your Application</span>
                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <div className="result-url">
                        <span>🔗</span>
                        <span>{result.url}</span>
                      </div>
                    </>
                  ) : (
                    <div className="info-box warning">
                      <p>
                        <strong>⚠️ Deployment Status:</strong> Application has been generated and tested successfully, but deployment URL is not available. You can download the project files below to deploy manually.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {result.project_summary && (
                <div className="project-summary">
                  <div className="summary-item">
                    <div className="summary-label">Pages</div>
                    <div className="summary-value">{result.project_summary.page_count}</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Components</div>
                    <div className="summary-value">{result.project_summary.component_count}</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Files</div>
                    <div className="summary-value">{result.project_summary.file_count}</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Time</div>
                    <div className="summary-value">
                      {result.execution_time
                        ? `${(result.execution_time / 1000).toFixed(1)}s`
                        : "N/A"}
                    </div>
                  </div>
                </div>
              )}

              {/* Download Project Button */}
              {sessionId && (
                <div style={{ marginBottom: '2rem' }}>
                  <button
                    onClick={() => {
                      const downloadUrl = getApiEndpoint(
                        `/api/download/${sessionId}`
                      );
                      window.location.href = downloadUrl;
                    }}
                    className="btn btn-success btn-full"
                  >
                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download Project Files</span>
                  </button>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Download the complete project as a ZIP file to customize or
                    deploy manually
                  </p>
                </div>
              )}

              {!result.success && result.error && (
                <div className="info-box error">
                  <p>
                    <strong>❌ Error:</strong> {result.error}
                  </p>
                </div>
              )}

              <button
                onClick={handleReset}
                className="btn btn-secondary btn-full"
              >
                <span>🔄</span>
                <span>Generate Another Application</span>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
