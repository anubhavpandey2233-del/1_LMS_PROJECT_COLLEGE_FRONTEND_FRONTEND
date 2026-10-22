import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { LogoutUser } from "../../../redux/slice/auth.slice";

function UserSildeBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(LogoutUser(auth?.user?.data?._id));
    navigate("/");
  };

  const getNavLinkClass = ({ isActive }) =>
    `list-group-item list-group-item-action ${
      isActive ? "active" : ""
    }`;

  return (
    <div className="col-xl-3">
      <nav className="navbar navbar-light navbar-expand-xl mx-0">
        <div
          className="offcanvas offcanvas-end"
          tabIndex={-1}
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header bg-light">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              My Profile
            </h5>

            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </div>

          <div className="offcanvas-body p-3 p-xl-0">
            <div className="bg-dark border rounded-3 p-3 pb-0 w-100 shadow-sm">
              <div className="list-group list-group-dark list-group-borderless">
                <NavLink
                  to="/user-dashboard"
                  className={getNavLinkClass}
                  end
                >
                  <i className="bi bi-ui-checks-grid fa-fw me-2" />
                  Dashboard
                </NavLink>

                <NavLink to="/user-course" className={getNavLinkClass}>
                  <i className="bi bi-basket fa-fw me-2" />
                  My Courses
                </NavLink>

                <NavLink to="/user-paymentinfo" className={getNavLinkClass}>
                  <i className="bi bi-credit-card-2-front fa-fw me-2" />
                  Payment Info
                </NavLink>

                <NavLink to="/user-wishlist" className={getNavLinkClass}>
                  <i className="bi bi-cart-check fa-fw me-2" />
                  Wishlist
                </NavLink>

                <NavLink to="/user-profilEdit" className={getNavLinkClass}>
                  <i className="bi bi-pencil-square fa-fw me-2" />
                  Edit Profile
                </NavLink>

                <button
                  type="button"
                  className="list-group-item list-group-item-action text-danger bg-danger-soft-hover"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt fa-fw me-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default UserSildeBar;
