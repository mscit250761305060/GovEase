import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function AadhaarServices() {
  const services = [
    "New Aadhaar",
    "Name Update",
    "Address Update",
    "Date of Birth Update",
    "Gender Update",
    "Mobile Number Update",
    "Email Update",
    "Biometric Update",
    "Document Update",
  ];

  return (
    <div className="page">
      <Navbar />

      <section className="section">
        <div className="container">
          <h1 className="section-title">
            Aadhaar Services
          </h1>

          <div className="grid">
            {services.map((service) => (
              <div className="card" key={service}>
                <h3>{service}</h3>

                {service === "Name Update" ? (
                  <Link
                    to="/services/aadhaar/name-update"
                    className="btn btn-primary"
                  >
                    Start Service
                  </Link>
                ) : (
                  <button className="btn btn-secondary">
                    Demo Service
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AadhaarServices;
