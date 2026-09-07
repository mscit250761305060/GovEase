import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function AadhaarServiceUpdate() {
  const navigate = useNavigate();
  const { serviceSlug } = useParams();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    aadhaar_number: "",
    old_value: "",
    new_value: "",
    dob: "",
    mobile: "",
    proof_name: "",
    document: null
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [proofConfigs, setProofConfigs] = useState([]);

  // Title and label mapping
  const serviceDetails = {
    "name-update": { title: "Aadhaar Name Update", currentLabel: "Current Name", newLabel: "New Name (as per proof)" },
    "address-update": { title: "Aadhaar Address Update", currentLabel: "Current Address", newLabel: "New Address (as per proof)" },
    "dob-update": { title: "Aadhaar Date of Birth Update", currentLabel: "Current Date of Birth", newLabel: "New Date of Birth (as per proof)" },
    "gender-update": { title: "Aadhaar Gender Update", currentLabel: "Current Gender", newLabel: "New Gender (as per proof)" },
    "mobile-update": { title: "Aadhaar Mobile Update", currentLabel: "Current Mobile Number", newLabel: "New Mobile Number" },
    "email-update": { title: "Aadhaar Email Update", currentLabel: "Current Email", newLabel: "New Email Address" },
    "biometric-update": { title: "Aadhaar Biometric Update", currentLabel: "Current Details", newLabel: "New Details" },
  };

  const details = serviceDetails[serviceSlug] || { title: "Aadhaar Update", currentLabel: "Current Value", newLabel: "New Value" };

  useEffect(() => {
    async function loadConfigs() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${apiUrl}/api/aadhaar/proof-configs?service_type=${serviceSlug}`);
        const data = await response.json();
        setProofConfigs(data);
      } catch (err) {
        console.error("Failed to load proof configs", err);
      }
    }
    loadConfigs();
  }, [serviceSlug]);

  function handleChange(e) {
    if (e.target.name === "document") {
      setForm({ ...form, document: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  }

  function handleStep1(e) {
    e.preventDefault();
    setStep(2);
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("govease_access_token");
      const formData = new FormData();
      formData.append("service_type", serviceSlug);
      formData.append("proof_name", form.proof_name);
      formData.append("new_value", form.new_value);
      formData.append("old_name", form.old_value);
      formData.append("dob", form.dob);
      formData.append("mobile", form.mobile);
      formData.append("aadhaar_number", form.aadhaar_number);
      formData.append("document", form.document);

      const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/api/aadhaar/process-update`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "Update failed");

      setMessage("Document verified by AI Agent and changes processed successfully! Proceeding to payment...");
      setStep(4);
    } catch (err) {
      setError(err.message);
      if (err.message.includes("upload the correct document") || err.message.includes("proof configuration found") || err.message.includes("upload a valid proof") || err.message.includes("format is not valid") || err.message.includes("available in English") || err.message.includes("does not match the information") || err.message.includes("fail the verification") || err.message.includes("fail")) {
        setStep(2);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handlePayment(e) {
    e.preventDefault();
    setLoading(true);

    // Mock Payment Gateway
    setTimeout(async () => {
      try {
        const token = localStorage.getItem("govease_access_token");
        const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
        await fetch(`${apiUrl}/api/aadhaar/send-sms`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message: `Your ${details.title} is complete.` })
        });
        
        setMessage("Payment successful! SMS notification sent.");
      } catch (err) {
        console.error("SMS notification failed", err);
        setMessage("Payment successful!");
      }
      
      setStep(5);
      setLoading(false);
    }, 2000);
  }

  return (
    <div className="page">
      <Navbar />

      <section className="section">
        <div className="container">
          <div className="form-card">
            <h1>{details.title}</h1>
            
            {/* Progress Bar */}
            <div style={{display:"flex", justifyContent:"space-between", marginBottom:"30px", fontSize:"0.8rem", color:"#64748b"}}>
               <span style={{fontWeight: step >= 1 ? "bold" : "normal", color: step >= 1 ? "#0284c7" : ""}}>1. Details</span>
               <span>→</span>
               <span style={{fontWeight: step >= 2 ? "bold" : "normal", color: step >= 2 ? "#0284c7" : ""}}>2. Upload Proof</span>
               <span>→</span>
               <span style={{fontWeight: step >= 3 ? "bold" : "normal", color: step >= 3 ? "#0284c7" : ""}}>3. Verification</span>
               <span>→</span>
               <span style={{fontWeight: step >= 4 ? "bold" : "normal", color: step >= 4 ? "#0284c7" : ""}}>4. Payment</span>
               <span>→</span>
               <span style={{fontWeight: step >= 5 ? "bold" : "normal", color: step >= 5 ? "#16a34a" : ""}}>5. Complete</span>
            </div>

            {error && <p style={{ color: "red", margin: "15px 0", background: "#fef2f2", padding: "10px", borderRadius: "5px" }}>{error}</p>}
            {message && <p style={{ color: "green", margin: "15px 0", background: "#f0fdf4", padding: "10px", borderRadius: "5px" }}>{message}</p>}

            {step === 1 && (
              <form onSubmit={handleStep1}>
                <div className="form-group">
                  <label>Aadhaar Number</label>
                  <input type="text" name="aadhaar_number" value={form.aadhaar_number} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>{details.currentLabel}</label>
                  <input type="text" name="old_value" value={form.old_value} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>{details.newLabel}</label>
                  <input type="text" name="new_value" value={form.new_value} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input type="text" name="mobile" value={form.mobile} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{width: "100%"}}>Next Step</button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                <div className="form-group">
                  <label>Select Proof Type</label>
                  <select name="proof_name" value={form.proof_name} onChange={handleChange} required style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #cbd5e1"}}>
                    <option value="">-- Select Proof Type --</option>
                    {proofConfigs.map(c => (
                      <option key={c.id} value={c.proof_name}>{c.proof_name}</option>
                    ))}
                    {/* Fallbacks if proofConfigs fail to load */}
                    {proofConfigs.length === 0 && (
                      <>
                        <option value="Passport">Passport</option>
                        <option value="Voter ID (EPIC)">Voter ID (EPIC)</option>
                        <option value="PAN Card">PAN Card</option>
                        <option value="Driving Licence">Driving Licence</option>
                        <option value="Birth Certificate">Birth Certificate</option>
                        <option value="Marriage Certificate">Marriage Certificate</option>
                        <option value="Gazette Notification">Gazette Notification</option>
                      </>
                    )}
                  </select>
                </div>
                
                {form.proof_name && proofConfigs.find(c => c.proof_name === form.proof_name)?.reference_image_path && (
                  <div style={{marginTop: "10px", marginBottom: "15px", background: "#f8fafc", padding: "10px", borderRadius: "5px", border: "1px solid #e2e8f0"}}>
                     <p style={{fontSize: "0.9rem", color: "#64748b", marginBottom: "10px"}}><strong>Format Reference:</strong> Ensure your document's layout matches this standard format:</p>
                     <img 
                       src={`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/${proofConfigs.find(c => c.proof_name === form.proof_name).reference_image_path}`} 
                       alt={`Demo ${form.proof_name}`} 
                       style={{maxWidth: "100%", maxHeight: "250px", border: "1px solid #cbd5e1", borderRadius: "5px", display: "block", margin: "0 auto"}} 
                     />
                  </div>
                )}

                <div className="form-group">
                  <label>Upload Document Image</label>
                  <input type="file" name="document" onChange={handleChange} accept=".jpg,.jpeg,.png,.pdf" required />
                </div>
                <div style={{display: "flex", gap: "10px"}}>
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{flex: 1}}>Back</button>
                  <button type="submit" className="btn btn-primary" style={{flex: 1}}>Upload Document</button>
                </div>
              </form>
            )}

            {step === 3 && (
               <div style={{textAlign: "center"}}>
                  <h2>AI Document Verification</h2>
                  <p>Our intelligent agent is analyzing your uploaded {form.proof_name}...</p>
                  <button onClick={handleVerify} className="btn btn-primary" disabled={loading} style={{marginTop: "20px"}}>
                    {loading ? "Verifying Document..." : "Start Verification"}
                  </button>
               </div>
            )}

            {step === 4 && (
              <div>
                <div style={{background: "#f8fafc", padding: "20px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #e2e8f0"}}>
                   <h3>Payment Details</h3>
                   <p style={{display:"flex", justifyContent:"space-between", margin:"10px 0"}}><span>Update Fee:</span> <strong>₹50.00</strong></p>
                   <p style={{display:"flex", justifyContent:"space-between", margin:"10px 0"}}><span>GST (18%):</span> <strong>₹0.00</strong></p>
                   <hr style={{borderTop:"1px solid #e2e8f0", margin:"15px 0"}}/>
                   <p style={{display:"flex", justifyContent:"space-between", margin:"10px 0", fontSize:"1.2rem"}}><span>Total Payable:</span> <strong>₹50.00</strong></p>
                </div>
                
                <button onClick={handlePayment} className="btn btn-primary" style={{width: "100%"}} disabled={loading}>
                  {loading ? "Processing Payment..." : "Pay ₹50.00 Now"}
                </button>
              </div>
            )}

            {step === 5 && (
               <div style={{textAlign: "center"}}>
                  <div style={{fontSize: "4rem", color: "#16a34a", marginBottom: "10px"}}>✓</div>
                  <h2>Update Successful!</h2>
                  <p>Your Aadhaar details have been instantly updated in the official database.</p>
                  <p>No 30-day waiting period required.</p>
                  <button onClick={() => navigate("/dashboard")} className="btn btn-primary" style={{marginTop: "20px"}}>
                    Return to Dashboard
                  </button>
               </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AadhaarServiceUpdate;
