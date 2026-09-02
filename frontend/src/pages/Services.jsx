import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import { getServices } from "../services/api";


function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        setError(
          "Unable to load government services."
        );
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);


  return (
    <div className="page">
      <Navbar />

      <section className="section">
        <div className="container">

          <h1 className="section-title">
            Government Services
          </h1>

          {loading && (
            <p>Loading services...</p>
          )}

          {error && (
            <p>{error}</p>
          )}

          {!loading && !error && (
            <div className="grid">

              {services.map((service) => (
                <div
                  className="card"
                  key={service.id}
                >

                  <h3>
                    {service.name}
                  </h3>

                  <p>
                    {service.description}
                  </p>

                  <p
                    style={{
                      marginTop: "10px",
                      fontWeight: "600",
                    }}
                  >
                    Department: {service.department}
                  </p>

                  <p
                    style={{
                      marginTop: "5px",
                    }}
                  >
                    Demo Fee: ₹{service.fee}
                  </p>

                  {service.slug ===
                    "aadhaar-name-update" && (
                    <Link
                      to="/services/aadhaar/name-update"
                      className="btn btn-primary"
                      style={{
                        display: "inline-block",
                        marginTop: "18px",
                      }}
                    >
                      Start Service
                    </Link>
                  )}

                </div>
              ))}

            </div>
          )}

        </div>
      </section>
    </div>
  );
}

export default Services;
