"use client";

import { useState } from "react";

function Icon({
  name,
  size = 20,
}: {
  name: string;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "route":
      return (
        <svg {...common}>
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="6" r="3" />
          <path d="M9 18h2a4 4 0 0 0 4-4v-4a4 4 0 0 1 4-4" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
          <path d="M9 3v15M15 6v15" />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <path d="M3 6h11v12H3z" />
          <path d="M14 10h4l3 4v4h-7z" />
          <circle cx="7.5" cy="19" r="2" />
          <circle cx="17.5" cy="19" r="2" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <path d="m7 14 4-4 4 3 6-7" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-2 .8l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-2-.8l-1.7.7-1.4-2.4 1.4-1.1a8 8 0 0 1 0-2.1l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 2-.8l.3-1.8h2.8l.3 1.8a8 8 0 0 1 2 .8l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1 0 2z" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "fuel":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="10" height="18" rx="2" />
          <path d="M7 7h4v5H7zM14 8h2l3 3v6a2 2 0 0 0 4 0v-5l-3-3" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    default:
      return null;
  }
}

const navItems = [
  { label: "Route planner", icon: "route" },
  { label: "Route analytics", icon: "chart" },
  { label: "Vehicle profile", icon: "truck" },
];

export default function Home() {
  const [origin, setOrigin] = useState("Madrid, Spain");
  const [destination, setDestination] = useState("Berlin, Germany");
  const [weight, setWeight] = useState("40");
  const [height, setHeight] = useState("4.0");
  const [length, setLength] = useState("16.5");
  const [axles, setAxles] = useState("5");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackType, setFeedbackType] = useState<
    "success" | "error" | "info"
  >("info");

  const [apiResult, setApiResult] = useState<{
    calculation_status: string;
    message: string;
  } | null>(null);

  async function handlePlanRoute(
  event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) return;

    setStatus("");
    setApiResult(null);

    if (!origin.trim() || !destination.trim()) {
      setFeedbackType("error");
      setStatus("Enter both an origin and a destination.");
      return;
    }

    if (origin.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setFeedbackType("error");
      setStatus("Origin and destination must be different.");
      return;
    }

    function parseLocation(value: string) {
    const parts = value.split(",").map((part) => part.trim());

    if (
      parts.length < 2 ||
      !parts[0] ||
      !parts[parts.length - 1]
    ) {
      return null;
    }

    return {
      city: parts.slice(0, -1).join(", "),
      country: parts[parts.length - 1],
    };
    }

    const parsedOrigin = parseLocation(origin);
    const parsedDestination = parseLocation(destination);

    if (!parsedOrigin || !parsedDestination) {
      setFeedbackType("error");
      setStatus(
        "Use the format City, Country for both origin and destination."
      );
      return;
    }

    const numericWeight = Number(weight);
    const numericHeight = Number(height);
    const numericLength = Number(length);

    if (
      !Number.isFinite(numericWeight) ||
      numericWeight <= 0 ||
      numericWeight > 60 ||
      !Number.isFinite(numericHeight) ||
      numericHeight <= 0 ||
      numericHeight > 4.5 ||
      !Number.isFinite(numericLength) ||
      numericLength <= 0 ||
      numericLength > 25
    ) {
      setFeedbackType("error");
      setStatus(
        "Check the vehicle values. Weight must be at most 60 tonnes, height 4.5 metres and length 25 metres."
      );
      return;
    }

    if (numericWeight > 40) {
      setFeedbackType("error");
      setStatus(
        "The current API configuration limits standard trucks to 40 tonnes."
      );
      return;
    }

    const payload = {
      origin: parsedOrigin,
      destination: parsedDestination,
      truck: {
        vehicle_type: "standard",
        weight_tonnes: numericWeight,
        height_metres: numericHeight,
        length_metres: numericLength,
      },
    };

    setIsSubmitting(true);
    setFeedbackType("info");
    setStatus("Sending your request to the planning API...");

    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

      const response = await fetch(
        `${apiBaseUrl.replace(/\/$/, "")}/api/routes/plan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const detail =
          typeof data?.detail === "string"
            ? data.detail
            : `The API returned HTTP ${response.status}.`;

        setFeedbackType("error");
        setStatus(detail);
        return;
      }

      setApiResult({
        calculation_status: data.calculation_status,
        message: data.message,
      });

      if (data.calculation_status === "not_implemented") {
        setFeedbackType("success");
        setStatus(
          "Request accepted by the API. Real route calculation is not available yet."
        );
      } else {
        setFeedbackType("success");
        setStatus("The API returned a response successfully.");
      }
    } catch {
      setFeedbackType("error");
      setStatus(
        "Could not reach the planning API. Check that FastAPI is running and the API URL is correct."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="European Truck Route Optimizer home">
          <span className="brand-mark">
            <Icon name="route" size={25} />
          </span>
          <span className="brand-copy">
            <strong>ETRO</strong>
            <span>FREIGHT INTELLIGENCE</span>
          </span>
        </a>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item, index) => (
            <a
              key={item.label}
              className={`nav-item ${index === 0 ? "active" : ""}`}
              href={index === 0 ? "#planner" : "#analytics"}
              onClick={(event) => {
                if (index !== 0) {
                  event.preventDefault();
                  setStatus(
                    `${item.label} will be available in a future iteration.`
                  );
                }
              }}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
              {index === 0 && <span className="nav-indicator" />}
            </a>
          ))}
        </nav>

        <div className="sidebar-divider" />

        <div className="workspace-label">SYSTEM</div>
        <div className="system-status">
          <span className="status-dot" />
          <span>Frontend operational</span>
        </div>
        <div className="system-status muted">
          <span className="status-dot idle" />
          <span>Routing engine not connected</span>
        </div>

        <div className="sidebar-spacer" />

        <div className="sidebar-note">
          <div className="note-icon">
            <Icon name="shield" size={20} />
          </div>
          <strong>Built for European freight</strong>
          <p>
            Route decisions backed by transparent data and clearly stated
            assumptions.
          </p>
        </div>

        <div className="sidebar-footer">
          <span className="avatar">ET</span>
          <span className="footer-copy">
            <strong>Local workspace</strong>
            <span>Development environment</span>
          </span>
          <span className="version-tag">v0.1</span>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <Icon name="arrow" size={14} />
            <strong>Route planner</strong>
          </div>
          <div className="topbar-right">
            <span className="environment-pill">
              <span className="status-dot" />
              LOCAL ENVIRONMENT
            </span>
            <span className="topbar-divider" />
            <button
              className="icon-button"
              type="button"
              aria-label="Settings"
              onClick={() =>
                setStatus("Workspace settings will be added in a future iteration.")
              }
            >
              <Icon name="settings" size={19} />
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="page-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                FREIGHT OPERATIONS PLATFORM
              </div>
              <h1>Plan smarter.<br /><span>Move freight forward.</span></h1>
              <p className="page-description">
                Build a route plan for your vehicle. Compare distance, travel
                time and operating costs as routing data becomes available.
              </p>
            </div>
            <div className="heading-chip">
              <Icon name="shield" size={17} />
              <span>Data transparency by design</span>
            </div>
          </section>

          <section className="metric-grid" aria-label="Platform status">
            <article className="metric-card">
              <div className="metric-top">
                <span className="metric-label">ROUTING ENGINE</span>
                <span className="metric-icon neutral">
                  <Icon name="route" size={18} />
                </span>
              </div>
              <div className="metric-value">Not connected</div>
              <div className="metric-foot">
                <span className="mini-status" /> Integration pending
              </div>
            </article>
            <article className="metric-card">
              <div className="metric-top">
                <span className="metric-label">COST ANALYSIS</span>
                <span className="metric-icon teal">
                  <Icon name="chart" size={18} />
                </span>
              </div>
              <div className="metric-value">Ready to build</div>
              <div className="metric-foot">Fuel, tolls and operating costs</div>
            </article>
            <article className="metric-card">
              <div className="metric-top">
                <span className="metric-label">VEHICLE PROFILE</span>
                <span className="metric-icon blue">
                  <Icon name="truck" size={18} />
                </span>
              </div>
              <div className="metric-value">Configurable</div>
              <div className="metric-foot">Heavy goods vehicle parameters</div>
            </article>
            <article className="metric-card">
              <div className="metric-top">
                <span className="metric-label">DATA RELIABILITY</span>
                <span className="metric-icon amber">
                  <Icon name="shield" size={18} />
                </span>
              </div>
              <div className="metric-value">Source-aware</div>
              <div className="metric-foot">Unknown restrictions stay visible</div>
            </article>
          </section>

          <div className="section-heading" id="planner">
            <div>
              <h2>Route configuration</h2>
              <p>Define your journey and vehicle specifications.</p>
            </div>
            <span className="step-label">
              <span>01</span> PLAN YOUR JOURNEY
            </span>
          </div>

          <div className="planner-grid">
            <form className="panel route-form" onSubmit={handlePlanRoute}>
              <div className="panel-heading">
                <div className="panel-title-icon">
                  <Icon name="map" size={20} />
                </div>
                <div>
                  <h3>Journey details</h3>
                  <p>Where does your freight need to go?</p>
                </div>
              </div>

              <div className="route-fields">
                <div className="field">
                  <label htmlFor="origin">ORIGIN</label>
                  <div className="input-wrap">
                    <span className="field-marker origin-marker" />
                    <input
                      id="origin"
                      name="origin"
                      value={origin}
                      onChange={(event) => {
                        setOrigin(event.target.value);
                        setStatus("");
                      }}
                      placeholder="City, country or address"
                      required
                    />
                  </div>
                </div>

                <div className="route-connector">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="field">
                  <label htmlFor="destination">DESTINATION</label>
                  <div className="input-wrap">
                    <span className="field-marker destination-marker" />
                    <input
                      id="destination"
                      name="destination"
                      value={destination}
                      onChange={(event) => {
                        setDestination(event.target.value);
                        setStatus("");
                      }}
                      placeholder="City, country or address"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-divider" />

              <div className="subsection-heading">
                <div>
                  <h3>Vehicle specifications</h3>
                  <p>Used to assess suitable routing options.</p>
                </div>
                <Icon name="truck" size={20} />
              </div>

              <div className="vehicle-grid">
                <div className="field">
                  <label htmlFor="weight">GROSS WEIGHT</label>
                  <div className="unit-input">
                    <input
                      id="weight"
                      type="number"
                      min="0.1"
                      max="100"
                      step="0.1"
                      value={weight}
                      onChange={(event) => setWeight(event.target.value)}
                      required
                    />
                    <span>tonnes</span>
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="height">HEIGHT</label>
                  <div className="unit-input">
                    <input
                      id="height"
                      type="number"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={height}
                      onChange={(event) => setHeight(event.target.value)}
                      required
                    />
                    <span>metres</span>
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="length">LENGTH</label>
                  <div className="unit-input">
                    <input
                      id="length"
                      type="number"
                      min="0.1"
                      max="30"
                      step="0.1"
                      value={length}
                      onChange={(event) => setLength(event.target.value)}
                      required
                    />
                    <span>metres</span>
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="axles">AXLES</label>
                  <select
                    id="axles"
                    value={axles}
                    onChange={(event) => setAxles(event.target.value)}
                  >
                    <option value="2">2 axles</option>
                    <option value="3">3 axles</option>
                    <option value="4">4 axles</option>
                    <option value="5">5 axles</option>
                    <option value="6">6 axles</option>
                    <option value="7">7+ axles</option>
                  </select>
                </div>
              </div>

              <div className="form-note">
                <Icon name="shield" size={16} />
                <span>
                  Vehicle values are planning inputs, not confirmation of
                  legal route eligibility.
                </span>
              </div>

              <button
                className="primary-button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending request..." : "Send to planning API"}
                {!isSubmitting && <Icon name="arrow" size={18} />}
              </button>

              {status && (
                <div
                  className={`feedback-message feedback-${feedbackType}`}
                  role="status"
                  aria-live="polite"
                >
                  {feedbackType === "success" ? (
                    <Icon name="check" size={17} />
                  ) : (
                    <Icon name="shield" size={17} />
                  )}
                  <span>{status}</span>
                </div>
              )}

              {apiResult && (
                <div className="api-result">
                  <div className="api-result-header">
                    <span>PLANNING API RESPONSE</span>
                    <span className="api-result-status">HTTP 200</span>
                  </div>

                  <p>{apiResult.message}</p>

                  <div className="api-result-detail">
                    <span>Calculation status</span>
                    <strong>{apiResult.calculation_status}</strong>
                  </div>

                  {apiResult.calculation_status === "not_implemented" && (
                    <p className="api-result-note">
                      The request was validated, but no real route has been calculated.
                    </p>
                  )}
                </div>
              )}
            </form>

            <section className="panel map-panel" aria-label="Route map preview">
              <div className="map-panel-header">
                <div>
                  <div className="map-kicker">ROUTE OVERVIEW</div>
                  <h3>Journey workspace</h3>
                </div>
                <span className="preview-tag">PREVIEW</span>
              </div>

              <div className="map-canvas">
                <div className="map-grid" />
                <svg
                  className="map-art"
                  viewBox="0 0 540 390"
                  preserveAspectRatio="xMidYMid slice"
                  role="img"
                  aria-label="Illustrative European road network, not a calculated route"
                >
                  <path className="land-shape" d="M60 45 145 28 196 58 246 42 289 78 344 65 394 102 456 92 510 142 475 190 500 236 453 270 415 330 354 344 317 305 270 318 225 286 175 303 143 255 99 235 113 185 72 147Z" />
                  <path className="map-road" d="M28 98 Q120 142 166 98 T280 112 T395 136 T526 103" />
                  <path className="map-road" d="M66 255 Q145 220 199 255 T315 224 T486 264" />
                  <path className="map-road" d="M128 20 Q160 105 206 156 T244 275 T328 375" />
                  <path className="map-road" d="M368 25 Q330 120 360 175 T403 275 T455 370" />
                  <path className="map-road secondary" d="M45 178 Q155 160 242 196 T430 202 T535 180" />
                  <path className="map-road secondary" d="M180 24 Q260 80 278 150 T305 270 T390 365" />
                  <path className="route-line" d="M122 276 C145 245 165 225 193 211 S236 167 265 170 S324 140 344 116 S395 90 422 75" />
                  <circle className="route-halo" cx="122" cy="276" r="12" />
                  <circle className="route-point-start" cx="122" cy="276" r="5" />
                  <circle className="route-halo" cx="422" cy="75" r="12" />
                  <circle className="route-point-end" cx="422" cy="75" r="5" />
                  <text className="map-label" x="80" y="308">MADRID</text>
                  <text className="map-label" x="390" y="52">BERLIN</text>
                  <text className="map-country" x="210" y="132">FRANCE</text>
                  <text className="map-country" x="350" y="218">GERMANY</text>
                  <text className="map-country" x="112" y="188">SPAIN</text>
                </svg>
                <div className="map-legend">
                  <span><i className="legend-start" /> Origin</span>
                  <span><i className="legend-end" /> Destination</span>
                </div>
                <div className="map-disclaimer">
                  Illustrative preview · Not a calculated route
                </div>
              </div>

              <div className="map-footer">
                <div className="map-footer-icon">
                  <Icon name="pin" size={18} />
                </div>
                <div>
                  <strong>Ready for routing integration</strong>
                  <p>
                    A real road network and route geometry will appear here
                    once a routing provider is connected.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <section className="analytics-section" id="analytics">
            <div className="section-heading analytics-heading">
              <div>
                <h2>Route intelligence</h2>
                <p>Your decision-support workspace.</p>
              </div>
              <span className="coming-soon">NEXT DEVELOPMENT PHASE</span>
            </div>

            <div className="analytics-grid">
              <article className="panel analytics-card">
                <div className="analytics-card-top">
                  <span className="metric-icon teal">
                    <Icon name="route" size={19} />
                  </span>
                  <span className="coming-soon small">AWAITING DATA</span>
                </div>
                <h3>Route alternatives</h3>
                <p>
                  Compare viable paths by distance, estimated duration and
                  vehicle constraints.
                </p>
                <div className="skeleton-lines">
                  <span />
                  <span />
                  <span />
                </div>
              </article>

              <article className="panel analytics-card">
                <div className="analytics-card-top">
                  <span className="metric-icon blue">
                    <Icon name="fuel" size={19} />
                  </span>
                  <span className="coming-soon small">AWAITING DATA</span>
                </div>
                <h3>Operating cost</h3>
                <p>
                  Build a transparent estimate using fuel consumption,
                  tolls and other configurable costs.
                </p>
                <div className="cost-placeholder">
                  <span>Fuel</span><span>Tolls</span><span>Other</span>
                </div>
              </article>

              <article className="panel analytics-card">
                <div className="analytics-card-top">
                  <span className="metric-icon amber">
                    <Icon name="shield" size={19} />
                  </span>
                  <span className="coming-soon small">AWAITING DATA</span>
                </div>
                <h3>Restriction awareness</h3>
                <p>
                  Track confirmed constraints, warnings and unknowns without
                  overstating route compliance.
                </p>
                <div className="restriction-placeholder">
                  <span><i /> Confirmed data</span>
                  <span><i /> Warnings</span>
                  <span><i /> Unknowns</span>
                </div>
              </article>
            </div>
          </section>

          <footer className="page-footer">
            <span>EUROPEAN TRUCK ROUTE OPTIMIZER</span>
            <span>Open-source freight planning · Early development</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
