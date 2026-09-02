import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getAadhaarDetails } from "../services/auth";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [aadhaarData, setAadhaarData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
         const aadhaar = await getAadhaarDetails();
         setAadhaarData(aadhaar);
      } catch (err) {
        setError(err.message);
        localStorage.removeItem("govease_access_token");
      }
    }
    loadUser();
  }, []);

  if (error) {
    return (
      <div className="page">
        <Navbar />
        <div className="form-container">
          <div className="form-card">
            <h2>Session Expired</h2>
            <p>Please login again.</p>
            <Link to="/login" className="btn btn-primary">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />

      <section className="section">
        <div className="container">
          <h1>Welcome to MyAadhaar, {aadhaarData ? aadhaarData.name : "..."}</h1>
          <p style={{ margin: "10px 0 20px", color: "#64748b" }}>
            Access all your Aadhaar services in one place.
          </p>



          <div className="grid">
            <div className="card">
              <h3>Name Update</h3>
              <p>Correct or change your registered name.</p>
              <Link to="/services/aadhaar/name-update" className="btn btn-primary">Update Name</Link>
            </div>

            <div className="card">
              <h3>Address Update</h3>
              <p>Update your residential address in the database.</p>
              <button className="btn btn-secondary" disabled>Coming Soon</button>
            </div>

            <div className="card">
              <h3>Date of Birth Update</h3>
              <p>Correct your registered Date of Birth.</p>
              <button className="btn btn-secondary" disabled>Coming Soon</button>
            </div>

            <div className="card">
              <h3>Gender Update</h3>
              <p>Correct your registered gender.</p>
              <button className="btn btn-secondary" disabled>Coming Soon</button>
            </div>

            <div className="card">
              <h3>Mobile Update</h3>
              <p>Link a new mobile number to your Aadhaar.</p>
              <button className="btn btn-secondary" disabled>Coming Soon</button>
            </div>

            <div className="card">
              <h3>Email Update</h3>
              <p>Link or update your registered email address.</p>
              <button className="btn btn-secondary" disabled>Coming Soon</button>
            </div>

            <div className="card">
              <h3>Photo / Biometrics Update</h3>
              <p>Update your photograph and biometrics data.</p>
              <button className="btn btn-secondary" disabled>Coming Soon</button>
            </div>

            <div className="card">
              <h3>Virtual ID (VID) Generator</h3>
              <p>Generate or retrieve your Virtual ID.</p>
              <button className="btn btn-secondary" disabled>Coming Soon</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
