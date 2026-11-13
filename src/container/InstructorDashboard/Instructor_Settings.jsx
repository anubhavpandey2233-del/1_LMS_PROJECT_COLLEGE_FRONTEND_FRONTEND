
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import InstructorHeader from './components/InstructorHeader';
import InstructorSidebar from './components/InstructorSidebar';
import { ThemeContext } from '../../context/ThemeContext';

function Instructor_Settings() {
  const auth = useSelector((state) => state.auth);
  const instructor = auth?.user?.data || {};

  const { theme, toggletheme } = useContext(ThemeContext);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [courseNotifications, setCourseNotifications] = useState(true);
  const [studentNotifications, setStudentNotifications] = useState(true);

  return (
    <>
      <InstructorHeader />

      <section className="pt-0">
        <div className="container">
          <div className="row">

            <InstructorSidebar />

            <div className="col-xl-9">
              <div className="card border rounded-3 mb-4">

                <div className="card-header border-bottom">
                  <h3 className="mb-1">Instructor Settings</h3>
                  <p className="text-muted mb-0">
                    Manage your account preferences and settings.
                  </p>
                </div>

                <div className="card-body">

                  {/* Account Settings */}
                  <div className="mb-4">
                    <h5>
                      <i className="bi bi-person-circle me-2 text-primary" />
                      Account Settings
                    </h5>
                    <hr />

                    <div className="row mb-3">
                      <div className="col-md-4 text-muted">Name</div>
                      <div className="col-md-8 fw-semibold">
                        {instructor?.name || 'Not available'}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 text-muted">Email</div>
                      <div className="col-md-8 fw-semibold">
                        {instructor?.email || 'Not available'}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4 text-muted">Phone Number</div>
                      <div className="col-md-8 fw-semibold">
                        {instructor?.phone_no || 'Not available'}
                      </div>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  {/* <div className="mb-4">
                    <h5>
                      <i className="bi bi-bell me-2 text-primary" />
                      Notification Settings
                    </h5>
                    <hr />

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6 className="mb-1">Email Notifications</h6>
                        <small className="text-muted">
                          Receive updates through email.
                        </small>
                      </div>

                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6 className="mb-1">Course Notifications</h6>
                        <small className="text-muted">
                          Get updates about your courses.
                        </small>
                      </div>

                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={courseNotifications}
                        onChange={(e) => setCourseNotifications(e.target.checked)}
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">Student Notifications</h6>
                        <small className="text-muted">
                          Get notified about student activity.
                        </small>
                      </div>

                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={studentNotifications}
                        onChange={(e) => setStudentNotifications(e.target.checked)}
                      />
                    </div>
                  </div> */}

                  {/* Privacy and Security */}
                  <div className="mb-4">
                    <h5>
                      <i className="bi bi-shield-lock me-2 text-primary" />
                      Privacy & Security
                    </h5>
                    <hr />

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">Password & Security</h6>
                        <small className="text-muted">
                          Keep your instructor account secure.
                        </small>
                      </div>

                      <span className="badge bg-light text-dark">
                        Account Protected
                      </span>
                    </div>
                  </div>

                  {/* Appearance */}
                  <div>
                    <h5>
                      <i className="bi bi-palette me-2 text-primary" />
                      Appearance
                    </h5>
                    <hr />

                    <label className="form-label fw-semibold">
                      Dashboard Theme
                    </label>

                    <select
                      className="form-select"
                      value={theme}
                     onChange={() => toggletheme(theme)}
                    >
                      <option value="light">Light Mode</option>
                      <option value="dark">Dark Mode</option>
                    </select>

                    <small className="text-muted">
                      Choose your preferred dashboard appearance.
                    </small>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

export default Instructor_Settings;
