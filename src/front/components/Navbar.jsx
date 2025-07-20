import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const navigate = useNavigate()
  const { store, dispatch } = useGlobalReducer()

  const handleLogout = () => {
    sessionStorage.removeItem("token")
    dispatch({ type: "logout" })
    navigate("/login")
  }

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
          <span className="navbar-brand mb-0 h1">Autenticación JWT con Flask y React.js</span>
				</Link>
        <div className="ml-auto d-flex gap-2">
          {!store.auth ? (
            <>
              <Link to="/signup">
                <button className="btn btn-outline-primary">Signup</button>
              </Link>
              <Link to="/login">
                <button className="btn btn-outline-success">Login</button>
              </Link>
            </>
          ) : (
              <button onClick={handleLogout} className="btn btn-secondary"><i className="fas fa-sign-out-alt me-2"></i></button>
          )}
        </div>
			</div>
		</nav>
	);
};