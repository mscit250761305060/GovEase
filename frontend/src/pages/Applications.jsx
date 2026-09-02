import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMyApplications } from "../services/applications";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, []);

  return (
    <div className="page">
      <Navbar />
      <section className="section">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h1 style={{ marginBottom: 0 }}>My Applications</h1>
            <Link to="/services" className="btn btn-primary">New Application</Link>
          </div>

          {loading && <p>Loading applications...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && !error && applications.length === 0 && (
            <div className="card text-center" style={{ padding: "60px 20px" }}>
              <h3 style={{ fontSize: "24px" }}>No applications yet</h3>
              <p style={{ maxWidth: "400px", margin: "0 auto", fontSize: "16px" }}>
                Your submitted government applications will appear here. Get started by exploring our services.
              </p>
              <Link to="/services" className="btn btn-primary mt-6">Explore Services</Link>
            </div>
          )}

          {!loading && applications.length > 0 && (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Application No.</th>
                    <th>Service ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td><strong>{application.application_number}</strong></td>
                      <td>{application.service_id}</td>
                      <td>{new Date().toLocaleDateString()}</td>
                      <td><span className={`badge ${application.status}`}>{application.status}</span></td>
                      <td>
                        <Link to={`/applications/${application.application_number}`} className="btn btn-secondary" style={{ padding: "8px 16px" }}>
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Applications;
