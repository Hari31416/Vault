import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSavorScore } from "../context/SavorScoreContext";
import { Analytics } from "../types";

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { getAnalytics } = useSavorScore();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [search, setSearch] = useState("");
  const [minRatings, setMinRatings] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (e: any) {
        setError(e.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [getAnalytics]);

  const reload = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (e: any) {
      setError(e.message || "Failed to load analytics");
    } finally {
      setRefreshing(false);
    }
  };

  // Derived / filtered data
  const filteredRestaurantAverages = useMemo(() => {
    if (!analytics) return [];
    return analytics.restaurantAverages
      .filter((r) =>
        search
          ? r.restaurantName.toLowerCase().includes(search.toLowerCase())
          : true
      )
      .filter((r) => r.totalRatings >= minRatings)
      .sort((a, b) => b.averageScore - a.averageScore);
  }, [analytics, search, minRatings]);

  const dateInRange = (dateStr?: Date) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (startDate && d < new Date(startDate)) return false;
    if (endDate && d > new Date(endDate + "T23:59:59")) return false;
    return true;
  };

  const filteredTopDishes = useMemo(() => {
    if (!analytics) return [];
    return analytics.topDishes
      .filter((d) =>
        search
          ? (d.restaurantName || "")
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            (d.dishName || "").toLowerCase().includes(search.toLowerCase())
          : true
      )
      .filter((d) => (startDate || endDate ? dateInRange(d.dateVisited) : true))
      .slice(0, 10);
  }, [analytics, search, startDate, endDate]);

  const filteredRecentRatings = useMemo(() => {
    if (!analytics) return [];
    return analytics.recentRatings
      .filter((r) =>
        search
          ? (r.restaurantName || "")
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            (r.dishName || "").toLowerCase().includes(search.toLowerCase())
          : true
      )
      .filter((r) => (startDate || endDate ? dateInRange(r.dateVisited) : true))
      .slice(0, 15);
  }, [analytics, search, startDate, endDate]);

  const overallAverageScore = useMemo(() => {
    if (!analytics || analytics.restaurantAverages.length === 0) return null;
    const { sum, count } = analytics.restaurantAverages.reduce(
      (acc, r) => {
        acc.sum += r.averageScore * r.totalRatings;
        acc.count += r.totalRatings;
        return acc;
      },
      { sum: 0, count: 0 }
    );
    return count ? sum / count : null;
  }, [analytics]);

  // Export helpers
  const download = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      filters: { startDate, endDate, search, minRatings },
      summary: {
        totalRatings: analytics?.totalRatings,
        overallAverageScore: overallAverageScore || undefined,
      },
      restaurantAverages: filteredRestaurantAverages,
      topDishes: filteredTopDishes,
      recentRatings: filteredRecentRatings,
    };
    download(
      "savorscore-analytics.json",
      JSON.stringify(payload, null, 2),
      "application/json"
    );
  };

  const toCSV = (rows: any[], headers: string[]) => {
    const esc = (v: any) => {
      if (v === null || v === undefined) return "";
      const s = String(v).replace(/"/g, '""');
      return `"${s}` + `"`;
    };
    return [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => esc(r[h])).join(",")),
    ].join("\n");
  };

  const exportCSV = () => {
    const sections: string[] = [];
    sections.push("Restaurant Averages");
    sections.push(
      toCSV(
        filteredRestaurantAverages.map((r) => ({
          restaurantName: r.restaurantName,
          averageScore: r.averageScore.toFixed(2),
          totalRatings: r.totalRatings,
        })),
        ["restaurantName", "averageScore", "totalRatings"]
      )
    );
    sections.push("\nTop Dishes");
    sections.push(
      toCSV(
        filteredTopDishes.map((d) => ({
          dishName: d.dishName,
          restaurantName: d.restaurantName,
          averageScore: d.averageScore.toFixed(2),
        })),
        ["dishName", "restaurantName", "averageScore"]
      )
    );
    sections.push("\nRecent Ratings");
    sections.push(
      toCSV(
        filteredRecentRatings.map((r) => ({
          dishName: r.dishName,
          restaurantName: r.restaurantName,
          dateVisited: new Date(r.dateVisited).toLocaleDateString(),
          averageScore: r.averageScore.toFixed(2),
        })),
        ["dishName", "restaurantName", "dateVisited", "averageScore"]
      )
    );
    download("savorscore-analytics.csv", sections.join("\n"), "text/csv");
  };

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <button className="btn btn-link" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <div className="alert alert-danger mt-3">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-4 gap-2">
      {/* Header + Actions */}
      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left" /> Back
          </button>
          <h2 className="mb-0">Analytics</h2>
        </div>
        <div className="btn-group">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={reload}
            disabled={refreshing || loading}
          >
            {refreshing ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" />{" "}
                Refreshing
              </>
            ) : (
              <>
                {" "}
                <i className="bi bi-arrow-clockwise" /> Refresh
              </>
            )}
          </button>
          <button
            className="btn btn-outline-success btn-sm"
            onClick={exportCSV}
            disabled={!analytics}
          >
            <i className="bi bi-filetype-csv" /> CSV
          </button>
          <button
            className="btn btn-outline-success btn-sm"
            onClick={exportJSON}
            disabled={!analytics}
          >
            <i className="bi bi-file-earmark-code" /> JSON
          </button>
        </div>
      </div>

      {/* Filters */}
      {analytics && (
        <div className="card mb-4">
          <div className="card-body py-3">
            <form className="row g-3 align-items-end">
              <div className="col-12 col-md-3">
                <label className="form-label mb-1">
                  Search (restaurant / dish)
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Type to filter..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-6 col-md-2">
                <label className="form-label mb-1">Start Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col-6 col-md-2">
                <label className="form-label mb-1">End Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-2">
                <label className="form-label mb-1">
                  Min Ratings (Restaurant)
                </label>
                <input
                  type="number"
                  min={0}
                  className="form-control form-control-sm"
                  value={minRatings}
                  onChange={(e) => setMinRatings(Number(e.target.value) || 0)}
                />
              </div>
              <div className="col-12 col-md-3 d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary flex-fill"
                  onClick={() => {
                    setSearch("");
                    setStartDate("");
                    setEndDate("");
                    setMinRatings(0);
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!analytics ? (
        <p className="text-muted">No analytics data available.</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card shadow-sm h-100 border-0 bg-light">
                <div className="card-body text-center p-3">
                  <div className="fw-semibold text-uppercase small text-muted">
                    Total Ratings
                  </div>
                  <div className="display-6 fw-bold">
                    {analytics.totalRatings}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card shadow-sm h-100 border-0 bg-light">
                <div className="card-body text-center p-3">
                  <div className="fw-semibold text-uppercase small text-muted">
                    Restaurants
                  </div>
                  <div className="display-6 fw-bold">
                    {analytics.restaurantAverages.length}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card shadow-sm h-100 border-0 bg-light">
                <div className="card-body text-center p-3">
                  <div className="fw-semibold text-uppercase small text-muted">
                    Overall Avg
                  </div>
                  <div className="display-6 fw-bold">
                    {overallAverageScore !== null
                      ? overallAverageScore.toFixed(2)
                      : "-"}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card shadow-sm h-100 border-0 bg-light">
                <div className="card-body text-center p-3">
                  <div className="fw-semibold text-uppercase small text-muted">
                    Filtered Top Dishes
                  </div>
                  <div className="display-6 fw-bold">
                    {filteredTopDishes.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Averages */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="card-title mb-0">Average Score by Restaurant</h5>
                <small className="text-muted">
                  {filteredRestaurantAverages.length} shown
                </small>
              </div>
              {filteredRestaurantAverages.length === 0 ? (
                <p className="text-muted mb-0">No data matches filters.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Restaurant</th>
                        <th style={{ width: "160px" }}>Avg Score</th>
                        <th style={{ width: "130px" }}>Ratings</th>
                        <th>Quality</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRestaurantAverages.map((r) => {
                        const pct = (r.averageScore / 5) * 100; // scale out of 5
                        return (
                          <tr key={r._id}>
                            <td className="fw-medium">{r.restaurantName}</td>
                            <td>{r.averageScore.toFixed(2)}</td>
                            <td>
                              <span className="badge bg-secondary">
                                {r.totalRatings}
                              </span>
                            </td>
                            <td>
                              <div className="progress" style={{ height: 6 }}>
                                <div
                                  className="progress-bar bg-success"
                                  role="progressbar"
                                  style={{ width: pct + "%" }}
                                  aria-valuenow={r.averageScore}
                                  aria-valuemin={0}
                                  aria-valuemax={5}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Top Rated Dishes</h5>
                  {filteredTopDishes.length === 0 ? (
                    <p className="text-muted mb-0">No data matches filters.</p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {filteredTopDishes.map((d) => (
                        <li
                          key={d._id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <span className="fw-medium">{d.dishName}</span>{" "}
                            <small className="text-muted">
                              ({d.restaurantName})
                            </small>
                          </div>
                          <div className="text-end">
                            <span className="badge bg-success me-2">
                              {d.averageScore.toFixed(1)}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Recent Ratings</h5>
                  {filteredRecentRatings.length === 0 ? (
                    <p className="text-muted mb-0">No data matches filters.</p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {filteredRecentRatings.map((r) => (
                        <li
                          key={r._id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <span className="fw-medium">{r.dishName}</span>{" "}
                            <small className="text-muted">
                              ({r.restaurantName})
                            </small>
                          </div>
                          <div className="text-end small">
                            <div className="text-muted">
                              {new Date(r.dateVisited).toLocaleDateString()}
                            </div>
                            <span className="badge bg-primary">
                              {r.averageScore.toFixed(1)}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
