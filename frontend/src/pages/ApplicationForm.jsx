import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function ApplicationForm() {
  const { serviceSlug } = useParams();
  const [submitted, setSubmitted] = useState(false);

  const formatTitle = (slug) => {
    if (!slug) return "Aadhaar Name Update";
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Application';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page">
        <Navbar />

        <div className="form-container">
          <div className="form-card">
            <h1>Application Submitted</h1>

            <p style={{ margin: "20px 0" }}>
              Your demo application has been submitted
              successfully.
            </p>

            <h3>Application ID</h3>

            <p style={{ marginTop: "10px" }}>
              AAD-2026-000001
            </p>

            <br />

            <p>✓ Application Submitted</p>
            <p>● Document Verification Pending</p>
            <p>○ Government Processing</p>
            <p>○ Completed</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />

      <div className="form-container">
        <div className="form-card">
          <h1>{formatTitle(serviceSlug)}</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Current Name</label>
              <input
                type="text"
                placeholder="Enter current name"
                required
              />
            </div>

            <div className="form-group">
              <label>New Name</label>
              <input
                type="text"
                placeholder="Enter new name"
                required
              />
            </div>

            <div className="form-group">
              <label>Aadhaar Number</label>
              <input
                type="text"
                placeholder="XXXX XXXX XXXX"
                maxLength="14"
                required
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" required />
            </div>

            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                placeholder="Enter mobile number"
                required
              />
            </div>

            <div className="form-group">
              <label>Supporting Document</label>
              <input type="file" required />
            </div>

            <button className="btn btn-primary" type="submit">
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ApplicationForm;
