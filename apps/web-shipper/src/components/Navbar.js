// import { red } from "@mui/material/colors";
// import { borderColor, color } from "@mui/system";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../redux/userRedux";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogoutClick = (e) => {
    e.preventDefault();
    dispatch(logout());
    localStorage.removeItem("persist:root");
    navigate("/login");
  };
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Smart Logistics
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li> */}
            <li className="nav-item">
              {/* <a className="nav-link" href="/">
                Link
              </a> */}
              {/* requestshipment */}
              <Link className="nav-link" to="/">
                Request Shipment
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/shipmentstatus">
                Status
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tracknormalshipments">
                Track Normal Shipments
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tracksharedshipments">
                Track Shared Shipments
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/payment">
                Payment
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link className="nav-link" to="/mappage">
                Map Page
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/testpage">
                Test Page
              </Link>
            </li> */}
          </ul>

          <li className="nav-item d-flex me-4">
            <div className="container  text-center">
              <div className="row">
                <div className="col">
                  <i class="bi bi-translate"></i>
                </div>

                <div className="col">
                  <div className="position-relative">
                    <i className="bi bi-bell"></i>
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                      style={{ backgroundColor: "maroon" }}
                    >
                      1
                    </span>
                  </div>
                </div>

                <div className="col">
                  <div className="position-relative">
                    <i class="bi bi-chat-left-text-fill"></i>
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                      style={{ backgroundColor: "maroon" }}
                    >
                      1
                    </span>
                  </div>
                </div>

                <div className="col">
                  <i class="bi bi-person-circle"></i>
                </div>

                {/* <div className="col">
                  <LogoutIcon />
                </div> */}
              </div>
            </div>
          </li>

          {/* <li className="nav-item d-flex me-4 position-relative">
            <i class="bi bi-translate"></i>
          </li>
          <li className="nav-item d-flex me-4 position-relative">
            <i className="bi bi-bell"></i>
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
              style={{ backgroundColor: "maroon" }}
            >
              1
            </span>
          </li>

          <li className="nav-item d-flex me-4 position-relative">
            <i class="bi bi-chat-left-text-fill"></i>
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
              style={{ backgroundColor: "maroon" }}
            >
              1
            </span>
          </li>

          <li className="nav-item d-flex me-4 position-relative">
            <i class="bi bi-person-circle"></i>
          </li> */}

          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button
              className="btn btn-outline-warning button-global"
              type="submit"
              //   style={{ borderColor: "maroon" }}
            >
              Search
            </button>
            <button className="btn" onClick={handleLogoutClick}>
              <LogoutIcon />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
