import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getAadhaarDetails } from "../services/auth";

function Profile() {
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
          <h1 style={{marginBottom: "30px"}}>My Aadhaar Profile</h1>
          
          {!aadhaarData ? (
             <p>Loading your Aadhaar data...</p>
          ) : (
            <div className="aadhaar-card-ui" style={{ marginBottom: "40px", maxWidth: "600px", margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "25px" }}>
                <div style={{ width: "120px", flexShrink: 0 }}>
                   <img 
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
                      alt="User Photo" 
                      style={{width: "100%", borderRadius: "8px", border: "1px solid #cbd5e1", display: "block"}}
                   />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h2 style={{margin: "0 0 12px 0", fontSize: "24px", color: "var(--text-main)"}}>{aadhaarData.name}</h2>
                  <p style={{margin: "8px 0", fontFamily: "monospace", fontSize: "1.4rem", fontWeight: "700", letterSpacing: "2px", color: "var(--secondary)"}}>
                     {aadhaarData.aadhaar_number}
                  </p>
                  <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px"}}>
                      <p style={{margin: "0", color: "var(--text-muted)", fontSize: "15px"}}>
                         <strong>Gender:</strong><br/>{aadhaarData.gender}
                      </p>
                      <p style={{margin: "0", color: "var(--text-muted)", fontSize: "15px"}}>
                         <strong>DOB:</strong><br/>{aadhaarData.dob}
                      </p>
                      <p style={{margin: "0", color: "var(--text-muted)", fontSize: "15px"}}>
                         <strong>Mobile Number:</strong><br/>{aadhaarData.mobile || "Not registered"}
                      </p>
                      <p style={{margin: "0", color: "var(--text-muted)", fontSize: "15px"}}>
                         <strong>Email:</strong><br/>{aadhaarData.email || "Not registered"}
                      </p>
                      <p style={{margin: "0", color: "var(--text-muted)", fontSize: "15px", gridColumn: "span 2"}}>
                         <strong>Address:</strong><br/>{aadhaarData.address}
                      </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Profile;
