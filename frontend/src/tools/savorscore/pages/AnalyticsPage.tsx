import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSavorScore } from "../context/SavorScoreContext";
import { Analytics } from "../types";

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { getAnalytics } = useSavorScore();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <button
        className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center"
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left"></i> Back
      </button>
      <h2 className="mb-4">Analytics</h2>
      {!analytics ? (
        <p className="text-muted">No analytics data available.</p>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-md-3 col-sm-6 mb-2">
              <div className="card bg-info text-white">
                <div className="card-body text-center">
                  <h4 className="card-title">{analytics.totalRatings}</h4>
                  <p className="card-text">Total Ratings</p>
                </div>
              </div>
            </div>
            <div className="col-md-9 mb-2">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Average Score by Restaurant</h5>
                  {analytics.restaurantAverages.length === 0 ? (
                    <p className="text-muted">No data yet.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Restaurant</th>
                            <th>Avg Score</th>
                            <th>Ratings</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.restaurantAverages.map((r) => (
                            <tr key={r._id}>
                              <td>{r.restaurantName}</td>
                              <td>{r.averageScore.toFixed(2)}</td>
                              <td>{r.totalRatings}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Top Rated Dishes</h5>
                  {analytics.topDishes.length === 0 ? (
                    <p className="text-muted">No data yet.</p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {analytics.topDishes.map((d) => (
                        <li
                          key={d._id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <span>
                            {d.dishName}{" "}
                            <small className="text-muted">
                              ({d.restaurantName})
                            </small>
                          </span>
                          <span className="badge bg-success">
                            {d.averageScore.toFixed(1)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Recent Ratings</h5>
                  {analytics.recentRatings.length === 0 ? (
                    <p className="text-muted">No data yet.</p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {analytics.recentRatings.map((r) => (
                        <li
                          key={r._id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <span>
                            {r.dishName}{" "}
                            <small className="text-muted">
                              ({r.restaurantName})
                            </small>
                          </span>
                          <span className="badge bg-primary">
                            {new Date(r.dateVisited).toLocaleDateString()}
                          </span>
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
