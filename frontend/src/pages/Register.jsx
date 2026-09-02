import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { registerUser } from "../services/auth";


function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  }


  async function handleSubmit(e) {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      await registerUser(form);

      navigate("/login");

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  }


  return (
    <div className="page">

      <Navbar />

      <div className="form-container">

        <div className="form-card">

          <h1>Create Citizen Account</h1>

          {error && (
            <p
              style={{
                color: "red",
                margin: "15px 0",
              }}
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </div>


            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>


            <div className="form-group">
              <label>Mobile Number</label>

              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                required
              />
            </div>


            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>


            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>


          <p style={{ marginTop: "20px" }}>
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}


export default Register;
