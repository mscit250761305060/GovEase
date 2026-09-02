import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("govease_access_token");
      const response = await fetch("http://127.0.0.1:8000/api/admin/applications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to fetch applications");
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (appNumber, status) => {
    try {
      const token = localStorage.getItem("govease_access_token");
      const response = await fetch(`http://127.0.0.1:8000/api/admin/applications/${appNumber}/status?status=${status}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to update status");
      fetchApplications();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <section className="section">
        <div className="container">
          <h1>Admin Dashboard</h1>
          {loading && <p>Loading applications...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          
          <div className="table-container" style={{ marginTop: "32px" }}>
            <table>
              <thead>
                <tr>
                  <th>App Number</th>
                  <th>Service ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td><strong>{app.application_number}</strong></td>
                    <td>{app.service_id}</td>
                    <td><span className={`badge ${app.status}`}>{app.status}</span></td>
                    <td>
                      {app.status === 'processing' && (
                        <>
                          <button onClick={() => updateStatus(app.application_number, "approved")} className="btn btn-success" style={{ marginRight: "10px", padding: "8px 16px" }}>Approve</button>
                          <button onClick={() => updateStatus(app.application_number, "rejected")} className="btn btn-warning" style={{ padding: "8px 16px" }}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
