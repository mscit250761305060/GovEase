import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getAadhaarApplications } from "../services/auth";

function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      const data = await getAadhaarApplications();
      setApplications(data);
    } catch (err) {
      setError(err.message);
      if (err.message.includes("Not authenticated")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status) {
    let color = "#eab308"; // yellow for pending
    let bg = "#fef08a";
    
    if (status.toLowerCase() === "approved") {
      color = "#16a34a"; // green
      bg = "#dcfce7";
    } else if (status.toLowerCase() === "rejected") {
      color = "#dc2626"; // red
      bg = "#fee2e2";
    }

    return (
      <span style={{
        padding: "4px 12px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "bold",
        color: color,
        backgroundColor: bg
      }}>
        {status}
      </span>
    );
  }

  function formatServiceType(type) {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  return (
    <div className="page" style={{ background: "var(--bg-light)" }}>
      <Navbar />

      <main className="container" style={{ padding: "40px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ color: "var(--text-main)", fontSize: "28px", marginBottom: "5px" }}>My Applications</h1>
            <p style={{ color: "var(--text-muted)" }}>View and track the status of all your update requests.</p>
          </div>
          <Link to="/dashboard" className="btn btn-outline" style={{ textDecoration: "none" }}>
            ← Back to Dashboard
          </Link>
        </div>

        {error && (
          <div style={{ background: "#fee2e2", color: "#dc2626", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Loading your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "12px", boxShadow: "var(--shadow)" }}>
            <h3 style={{ color: "var(--text-main)", marginBottom: "10px" }}>No applications found</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>You haven't submitted any update requests yet.</p>
            <Link to="/dashboard" className="btn btn-primary" style={{ textDecoration: "none" }}>
              Explore Services
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {applications.map((app) => (
              <div key={app.id} style={{ 
                background: "white", 
                padding: "24px", 
                borderRadius: "12px", 
                boxShadow: "var(--shadow)",
                borderLeft: "4px solid var(--primary)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                  <div>
                    <h3 style={{ color: "var(--text-main)", margin: "0 0 5px 0", fontSize: "18px" }}>
                      {formatServiceType(app.service_type)}
                    </h3>
                    <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>
                      Application ID: #{app.id.toString().padStart(6, '0')}
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(app.status)}
                  </div>
                </div>

                <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <span style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "3px" }}>Previous Record</span>
                      <strong style={{ color: "var(--text-main)", fontSize: "14px" }}>{app.old_value}</strong>
                    </div>
                    <div>
                      <span style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "3px" }}>Requested Change</span>
                      <strong style={{ color: "var(--primary)", fontSize: "14px" }}>{app.new_value}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: "15px" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    Applied on: {new Date(app.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span style={{ fontSize: "13px", color: "var(--primary)", fontWeight: "500", cursor: "pointer" }}>
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyApplications;
