import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="page">
      <Navbar />

      <section className="hero">
        <div className="container">
          <h1>
            Government Services,
            <br />
            Simplified.
          </h1>

          <p>
            Access eligible government services from one secure
            digital platform. Submit documents, verify information,
            make payments and track applications online.
          </p>

          <Link to="/services" className="btn btn-primary">
            Explore Services
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">
            Popular Government Services
          </h2>

          <div className="grid">
            <div className="card">
              <h3>Aadhaar</h3>
              <p>
                Update eligible Aadhaar information and track
                applications.
              </p>
            </div>

            <div className="card">
              <h3>PAN</h3>
              <p>
                Apply for PAN and access eligible correction
                services.
              </p>
            </div>

            <div className="card">
              <h3>Voter ID</h3>
              <p>
                Access registration and eligible voter record
                services.
              </p>
            </div>

            <div className="card">
              <h3>Driving Licence</h3>
              <p>
                Access eligible driving licence and RTO services.
              </p>
            </div>

            <div className="card">
              <h3>Certificates</h3>
              <p>
                Access supported government certificate services.
              </p>
            </div>

            <div className="card">
              <h3>Other Services</h3>
              <p>
                Explore additional government digital services.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
