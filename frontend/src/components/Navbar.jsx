import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("govease_access_token");

  function handleLogout() {
    localStorage.removeItem("govease_access_token");
    navigate("/login");
  }

  return (
    <nav className="navbar" style={{borderBottom: "1px solid #e2e8f0", background: "#ffffff"}}>
      <div className="container navbar-inner" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <Link to="/" className="logo">
          Gov<span style={{color: "var(--text-main)"}}>Ease</span>
        </Link>

        <div className="nav-links">
          {token && (
            <>
              <Link to="/dashboard" style={{textDecoration: "none", color: "#333", fontWeight: "500", marginRight: "20px"}}>
                Dashboard
              </Link>
              <Link to="/applications" style={{textDecoration: "none", color: "#333", fontWeight: "500", marginRight: "20px"}}>
                My Applications
              </Link>
              <Link to="/profile" style={{textDecoration: "none", color: "#333", fontWeight: "500", marginRight: "20px"}}>
                Profile
              </Link>
            </>
          )}

          {!token ? (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          ) : (
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
