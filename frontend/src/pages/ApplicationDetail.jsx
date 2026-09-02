import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import {
  getApplication,
} from "../services/applications";


function ApplicationDetail() {

  const {
    applicationNumber,
  } = useParams();

  const [application, setApplication] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [docType, setDocType] = useState("identity_proof");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploadLoading(true);
    setUploadError("");
    try {
      // Need to import uploadDocument from applications service
      const { uploadDocument } = await import("../services/applications");
      await uploadDocument(applicationNumber, docType, selectedFile);
      
      // Reload application to get updated documents list
      const updatedApp = await getApplication(applicationNumber);
      setApplication(updatedApp);
      setSelectedFile(null);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      const { verifyApplication } = await import("../services/applications");
      const updatedApp = await verifyApplication(applicationNumber);
      setApplication(updatedApp);
      alert("Verification complete! See results in Application Details.");
    } catch (err) {
      alert("Verification failed: " + err.message);
    }
  };

  const handlePay = async () => {
    try {
      const { payApplication } = await import("../services/applications");
      await payApplication(applicationNumber);
      const updatedApp = await getApplication(applicationNumber);
      setApplication(updatedApp);
      alert("Payment successful!");
    } catch (err) {
      alert("Payment failed: " + err.message);
    }
  };


  useEffect(() => {

    async function loadApplication() {

      try {

        const data =
          await getApplication(
            applicationNumber
          );

        setApplication(data);

      } catch (err) {

        setError(err.message);

      } finally {

        setLoading(false);

      }

    }

    loadApplication();

  }, [applicationNumber]);


  return (
    <div className="page">

      <Navbar />

      <section className="section">

        <div className="container">

          <h1>
            Application Details
          </h1>


          {loading && (
            <p>
              Loading...
            </p>
          )}


          {error && (
            <p style={{ color: "red" }}>
              {error}
            </p>
          )}


          {application && (
            <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
              
              {/* Left Column - Details */}
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 style={{ fontSize: '28px', margin: 0 }}>{application.application_number}</h2>
                  <span className={`badge ${application.status}`}>{application.status}</span>
                </div>

                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Service ID</p>
                    <p style={{ fontWeight: '600', color: '#1e293b' }}>{application.service_id}</p>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Total Fee</p>
                    <p style={{ fontWeight: '600', color: '#1e293b' }}>₹{application.total_fee}</p>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Payment Status</p>
                    <p style={{ fontWeight: '600', color: application.payment_status === 'completed' ? '#059669' : '#d97706' }}>
                      {application.payment_status.toUpperCase()}
                    </p>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Submission Date</p>
                    <p style={{ fontWeight: '600', color: '#1e293b' }}>{new Date(application.created_at || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>

                {application.verification_result && (
                  <div style={{ padding: "16px", background: application.status === 'processing' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${application.status === 'processing' ? '#bbf7d0' : '#fecaca'}`, borderRadius: "8px", marginBottom: '32px' }}>
                    <h4 style={{ color: application.status === 'processing' ? '#166534' : '#991b1b', marginBottom: '8px' }}>Verification Result</h4>
                    <pre style={{ margin: "0", fontSize: '13px', color: '#475569', whiteSpace: 'pre-wrap' }}>{application.verification_result}</pre>
                  </div>
                )}

                <div style={{ marginBottom: "32px" }}>
                  <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>Required Documents</h3>
                  
                  {application.documents && application.documents.length > 0 ? (
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Filename</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {application.documents.map(doc => (
                            <tr key={doc.id}>
                              <td>{doc.document_type.replace('_', ' ').toUpperCase()}</td>
                              <td>{doc.original_filename}</td>
                              <td><span className={`badge ${doc.verification_status}`}>{doc.verification_status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '8px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                      <p style={{ color: '#64748b' }}>No documents uploaded yet.</p>
                    </div>
                  )}
                </div>

                {application.status === "submitted" && (
                  <div style={{ padding: "24px", background: "#f8fafc", borderRadius: "12px", border: '1px solid #e2e8f0', marginBottom: '32px' }}>
                    <h4 style={{ marginBottom: '16px' }}>Upload New Document</h4>
                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Document Type</label>
                        <select 
                          value={docType} 
                          onChange={(e) => setDocType(e.target.value)}
                        >
                          <option value="identity_proof">Identity Proof</option>
                          <option value="name_proof">Name Change Proof</option>
                          <option value="address_proof">Address Proof</option>
                          <option value="dob_proof">DOB Proof</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Select File</label>
                        <input 
                          type="file" 
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                          style={{ padding: '9px 12px' }}
                        />
                      </div>
                    </div>
                    <button 
                      className="btn btn-primary"
                      onClick={handleUpload}
                      disabled={!selectedFile || uploadLoading}
                      style={{ width: '100%' }}
                    >
                      {uploadLoading ? "Uploading..." : "Upload Document"}
                    </button>
                    {uploadError && <p style={{ color: "red", marginTop: "10px", fontSize: '14px' }}>{uploadError}</p>}
                  </div>
                )}
                
                <Link to="/applications" className="btn btn-secondary mt-4">
                  &larr; Back to Applications
                </Link>
              </div>

              {/* Right Column - Actions & Timeline */}
              <div>
                <div className="card" style={{ marginBottom: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Actions</h3>
                  
                  {application.status === "submitted" && application.documents?.length > 0 && (
                    <button 
                      className="btn btn-warning" 
                      onClick={handleVerify}
                      style={{ width: "100%", marginBottom: '12px' }}
                    >
                      Start Government Verification
                    </button>
                  )}

                  {application.status === "processing" && application.payment_status === "pending" && (
                    <button 
                      className="btn btn-success" 
                      onClick={handlePay}
                      style={{ width: "100%", marginBottom: '12px' }}
                    >
                      Pay ₹{application.total_fee}
                    </button>
                  )}
                  
                  {application.status === "draft" && (
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Complete your form to proceed.</p>
                  )}
                  {application.status === "approved" && (
                    <p style={{ color: '#059669', fontSize: '14px', fontWeight: '500' }}>Application has been approved.</p>
                  )}
                </div>

                <div className="timeline">
                  <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Application Progress</h3>
                  
                  <div className={`timeline-item ${application.status !== 'draft' ? 'completed' : 'active'}`}>
                    <div className="timeline-icon">✓</div>
                    <div>Application Submitted</div>
                  </div>
                  
                  <div className={`timeline-item ${application.status === 'processing' || application.status === 'approved' ? 'completed' : (application.status === 'submitted' ? 'active' : '')}`}>
                    <div className="timeline-icon">{application.status === 'processing' || application.status === 'approved' ? '✓' : '2'}</div>
                    <div>Document Verification</div>
                  </div>
                  
                  <div className={`timeline-item ${application.status === 'approved' ? 'completed' : (application.status === 'processing' ? 'active' : '')}`}>
                    <div className="timeline-icon">{application.status === 'approved' ? '✓' : '3'}</div>
                    <div>Processing & Payment</div>
                  </div>
                  
                  <div className={`timeline-item ${application.status === 'approved' ? 'completed' : ''}`}>
                    <div className="timeline-icon">4</div>
                    <div>Final Approval</div>
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


export default ApplicationDetail;
