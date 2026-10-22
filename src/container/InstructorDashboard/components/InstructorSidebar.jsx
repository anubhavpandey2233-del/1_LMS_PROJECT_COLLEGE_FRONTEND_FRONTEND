import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogoutUser } from '../../../redux/slice/auth.slice';

/**
 * InstructorSidebar component provides the navigation menu for all 
 * pages in the Instructor dashboard, including profile actions.
 */
function InstructorSidebar() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Trigger Redux thunk action to log out the user
  const handleLogout = () => {
    const userId = auth?.user?.data?._id || auth?.user?._id;
    if (userId) {
      dispatch(LogoutUser(userId));
    }
  };

  // Helper function to dynamically assign the active class to NavLinks
  const getLinkClass = ({ isActive }) => 
    `list-group-item${isActive ? ' active' : ''}`;

  return (
    <div className="col-xl-3">
      {/* Responsive offcanvas container for mobile views */}
      <nav className="navbar navbar-light navbar-expand-xl mx-0">
        <div 
          className="offcanvas offcanvas-end" 
          tabIndex={-1} 
          id="offcanvasNavbar" 
          aria-labelledby="offcanvasNavbarLabel"
        >
          {/* Header on mobile screens */}
          <div className="offcanvas-header bg-light">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">My profile</h5>
            <button 
              type="button" 
              className="btn-close text-reset" 
              data-bs-dismiss="offcanvas" 
              aria-label="Close" 
            />
          </div>
          
          {/* Sidebar Menu Body */}
          <div className="offcanvas-body p-3 p-xl-0">
            <div className="bg-dark border rounded-3 pb-0 p-3 w-100">
              <div className="list-group list-group-dark list-group-borderless">
                
                {/* Navigation Links */}
                <NavLink to="/instructor-dashboard" className={getLinkClass}>
                  <i className="bi bi-ui-checks-grid fa-fw me-2" />Dashboard
                </NavLink>
                
                <NavLink to="/Instructor_Create_Course" className={getLinkClass}>
                  <i className="bi bi-basket fa-fw me-2" />My course
                </NavLink>

                <NavLink to="/Instructor_Earning" className={getLinkClass}>
                  <i className="bi bi-graph-up fa-fw me-2" />Earnings
                </NavLink>
                
                <NavLink to="/Instructor_Student_list" className={getLinkClass}>
                  <i className="bi bi-people fa-fw me-2" />Students
                </NavLink>
                
                <NavLink to="/Instructor_Order" className={getLinkClass}>
                  <i className="bi bi-folder-check fa-fw me-2" />Orders
                </NavLink>
                
                <NavLink to="/Instructor_Review" className={getLinkClass}>
                  <i className="bi bi-star fa-fw me-2" />Reviews
                </NavLink>
                
                <NavLink to="/Instructor_Payout" className={getLinkClass}>
                  <i className="bi bi-wallet2 fa-fw me-2" />Payouts
                </NavLink>
                
                {/* Placeholder/Static Actions */}
                <a className="list-group-item cursor-pointer" href="#edit-profile-coming-soon">
                  <i className="bi bi-pencil-square fa-fw me-2" />Edit Profile
                </a>
                
                <a className="list-group-item cursor-pointer" href="#settings-coming-soon">
                  <i className="bi bi-gear fa-fw me-2" />Settings
                </a>
                
                <a className="list-group-item cursor-pointer" href="#delete-profile-coming-soon">
                  <i className="bi bi-trash fa-fw me-2" />Delete Profile
                </a>
                
                {/* Logout Trigger button */}
                <button 
                  onClick={handleLogout} 
                  className="list-group-item text-danger bg-danger-soft-hover border-0 text-start w-100"
                >
                  <i className="fas fa-sign-out-alt fa-fw me-2" />Sign Out
                </button>
                
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default InstructorSidebar;
