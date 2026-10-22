import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

/**
 * InstructorHeader component displays the cover image, instructor avatar,
 * name, student/course statistics, and the button to create a course.
 */
function InstructorHeader() {
  // Retrieve authentication state from Redux
  const auth = useSelector(state => state.auth);
  
  // Extract user details (normalized to be inside state.auth.user.data)
  const instructorName = auth?.user?.data?.name || "Lori Stevens";

  return (
    <section className="pt-0">
      {/* Cover image background banner */}
      <div className="container-fluid px-0">
        <div 
          className="bg-blue h-100px h-md-200px rounded-0" 
          style={{ 
            background: 'url(/assets/images/pattern/04.png) no-repeat center center', 
            backgroundSize: 'cover' 
          }}
        >
        </div>
      </div>
      
      {/* Banner profile info & CTA */}
      <div className="container mt-n4">
        <div className="row">
          <div className="col-12">
            <div className="card bg-transparent card-body p-0">
              <div className="row d-flex justify-content-between">
                
                {/* Avatar */}
                <div className="col-auto mt-4 mt-md-0">
                  <div className="avatar avatar-xxl mt-n3">
                    <img 
                      className="avatar-img rounded-circle border border-white border-3 shadow" 
                      src="/assets/images/avatar/01.jpg" 
                      alt="Instructor Avatar" 
                    />
                  </div>
                </div>
                
                {/* Profile info */}
                <div className="col d-md-flex justify-content-between align-items-center mt-4">
                  <div>
                    <h1 className="my-1 fs-4">
                      {instructorName} <i className="bi bi-patch-check-fill text-info small" />
                    </h1>
                    <ul className="list-inline mb-0">
                      <li className="list-inline-item h6 fw-light me-3 mb-1 mb-sm-0">
                        <i className="fas fa-star text-warning me-2" />4.5/5.0
                      </li>
                      <li className="list-inline-item h6 fw-light me-3 mb-1 mb-sm-0">
                        <i className="fas fa-user-graduate text-orange me-2" />12k Enrolled Students
                      </li>
                      <li className="list-inline-item h6 fw-light me-3 mb-1 mb-sm-0">
                        <i className="fas fa-book text-purple me-2" />25 Courses
                      </li>
                    </ul>
                  </div>
                  
                  {/* Redirect button to create a course in the Admin panel */}
                  <div className="d-flex align-items-center mt-2 mt-md-0">
                     <NavLink to="/admin/course" className="btn btn-success mb-0">
                       <i className="bi bi-graph-up fa-fw me-2" />Create a course
                     </NavLink>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Divider and responsive offcanvas sidebar trigger for mobile/tablet */}
            <hr className="d-xl-none" />
            <div className="col-12 col-xl-3 d-flex justify-content-between align-items-center">
              <a className="h6 mb-0 fw-bold d-xl-none" href="#">Menu</a>
              <button 
                className="btn btn-primary d-xl-none" 
                type="button" 
                data-bs-toggle="offcanvas" 
                data-bs-target="#offcanvasNavbar" 
                aria-controls="offcanvasNavbar"
              >
                <i className="fas fa-sliders-h" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InstructorHeader;
