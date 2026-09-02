import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { sendAadhaarOtp, loginAadhaar } from "../services/auth";

function Login() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    aadhaar_number: "",
    otp: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    let val = e.target.value;
    if (e.target.name === 'aadhaar_number') {
        // format as 1234 5678 9012
        val = val.replace(/\D/g, '').substring(0, 12);
        val = val.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    }
    setForm({
      ...form,
      [e.target.name]: val,
    });
  }

  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await sendAadhaarOtp({ aadhaar_number: form.aadhaar_number });
      setMessage(res.message);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginAadhaar(form);
      localStorage.setItem("govease_access_token", result.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page" style={{ background: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)" }}>
      <Navbar />

      <div className="form-container" style={{ maxWidth: "450px", margin: "80px auto" }}>
        <div className="form-card" style={{ borderTop: "5px solid var(--primary)" }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
             <img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Aadhaar_Logo.svg/1200px-Aadhaar_Logo.svg.png" alt="Aadhaar" width="120" onError={(e) => e.target.style.display = 'none'} />
          </div>
          <h1 style={{textAlign: "center", fontSize: "24px", color: "var(--text-main)", marginBottom: "8px"}}>Login to MyAadhaar</h1>
          <p style={{textAlign: "center", marginBottom: "30px", color: "var(--text-muted)", fontSize: "14px"}}>Enter your 12-digit Aadhaar number to begin</p>

          {error && <p style={{ color: "red", margin: "15px 0", background: "#fef2f2", padding: "10px", borderRadius: "5px" }}>{error}</p>}
          {message && <p style={{ color: "green", margin: "15px 0", background: "#f0fdf4", padding: "10px", borderRadius: "5px" }}>{message}</p>}

          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label>Aadhaar Number</label>
                <input
                  type="text"
                  name="aadhaar_number"
                  placeholder="xxxx xxxx xxxx"
                  value={form.aadhaar_number}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="btn btn-primary" type="submit" disabled={loading} style={{width: "100%"}}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Enter OTP</label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={form.otp}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="btn btn-primary" type="submit" disabled={loading} style={{width: "100%"}}>
                {loading ? "Verifying..." : "Login"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
