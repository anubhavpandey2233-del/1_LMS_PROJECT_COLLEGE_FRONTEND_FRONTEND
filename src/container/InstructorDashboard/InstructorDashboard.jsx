
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InstructorHeader from './components/InstructorHeader';
import InstructorSidebar from './components/InstructorSidebar';
import { useDeletCourseMutation } from '../../redux/Api/Course.api';

function InstructorDashboard() {
  const navigate = useNavigate();
  const [deleteCourse] = useDeletCourseMutation();

  const [dashboardStats, setDashboardStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    enrolledStudents: 0,
    totalEnrollments: 0,
    averageRating: null,
    totalReviews: 0,
    currentMonthEarning: 0,
    lastMonthEarning: 0,
    earningPercentage: null,
    mostSellingCourses: [],
  });

  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 8;

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDashboardStats() {
      try {
        setStatsLoading(true);
        setStatsError('');

        const response = await fetch(
          'http://localhost:5000/api/v2/dashboard/instructor-stats',
          {
            method: 'GET',
            credentials: 'include',
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Request failed: ${response.status}`
          );
        }

        const result = await response.json();
        const data = result?.data ?? result;

        setDashboardStats({
          totalCourses: Number(data?.totalCourses ?? 0),
          totalStudents: Number(data?.totalStudents ?? 0),
          enrolledStudents: Number(data?.enrolledStudents ?? 0),
          totalEnrollments: Number(data?.totalEnrollments ?? 0),
          averageRating: data?.averageRating ?? null,
          totalReviews: Number(data?.totalReviews ?? 0),
          currentMonthEarning: Number(data?.currentMonthEarning ?? 0),
          lastMonthEarning: Number(data?.lastMonthEarning ?? 0),
          earningPercentage: data?.earningPercentage ?? null,
          mostSellingCourses: Array.isArray(data?.mostSellingCourses)
            ? data.mostSellingCourses
            : [],
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Instructor dashboard stats error:', error);
          setStatsError(
            error.message || 'Dashboard data load nahi hua. Backend check karo.'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setStatsLoading(false);
        }
      }
    }

    fetchDashboardStats();

    return () => controller.abort();
  }, []);

  const courses = dashboardStats.mostSellingCourses;

  const totalEntries = courses.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / entriesPerPage));
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);

  const currentCourses = useMemo(
    () => courses.slice(startIndex, startIndex + entriesPerPage),
    [courses, startIndex]
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const showCount = (value) => {
    if (statsLoading) return '...';
    if (statsError) return '--';
    return Number(value || 0).toLocaleString('en-IN');
  };

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString('en-IN')}`;
  };

  const getCourseImage = (course) => {
    if (Array.isArray(course?.course_img) && course.course_img.length > 0) {
      return course.course_img[0]?.url || 'assets/images/courses/4by3/08.jpg';
    }

    if (typeof course?.course_img === 'string' && course.course_img) {
      return course.course_img;
    }

    return 'assets/images/courses/4by3/08.jpg';
  };

  const handleEdit = (courseId) => {
    if (!courseId) return;
    navigate(`/Instructor_Create_Course/${courseId}`);
  };

  const handleDelete = async (courseId, courseName) => {
    if (!courseId) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${courseName}"?`
    );

    if (!confirmed) return;

    try {
      await deleteCourse(courseId).unwrap();
      window.location.reload();
    } catch (error) {
      console.error('Delete course error:', error);
      alert(error?.data?.message || 'Course delete nahi hua.');
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const earningPercentage = Number(dashboardStats.earningPercentage || 0);
  const hasEarningComparison = dashboardStats.earningPercentage !== null &&
    dashboardStats.earningPercentage !== undefined;

  return (
    <main>
      <InstructorHeader
        dashboardStats={dashboardStats}
        statsLoading={statsLoading}
      />

      <section className="pt-0">
        <div className="container">
          <div className="row">
            <InstructorSidebar />

            <div className="col-xl-9">
              {/* Dashboard counters */}
              <div className="row g-4">
                <div className="col-sm-6 col-lg-4">
                  <div className="d-flex justify-content-center align-items-center p-4 bg-warning bg-opacity-15 rounded-3">
                    <span className="display-6 text-warning mb-0">
                      <i className="fas fa-tv fa-fw" />
                    </span>
                    <div className="ms-4">
                      <h5 className="mb-0 fw-bold">
                        {showCount(dashboardStats.totalCourses)}
                      </h5>
                      <span className="mb-0 h6 fw-light">
                        Total Courses
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 col-lg-4">
                  <div className="d-flex justify-content-center align-items-center p-4 bg-purple bg-opacity-10 rounded-3">
                    <span className="display-6 text-purple mb-0">
                      <i className="fas fa-user-graduate fa-fw" />
                    </span>
                    <div className="ms-4">
                      <h5 className="mb-0 fw-bold">
                        {showCount(dashboardStats.totalStudents)}
                      </h5>
                      <span className="mb-0 h6 fw-light">
                        Total Students
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 col-lg-4">
                  <div className="d-flex justify-content-center align-items-center p-4 bg-info bg-opacity-10 rounded-3">
                    <span className="display-6 text-info mb-0">
                      <i className="fas fa-gem fa-fw" />
                    </span>
                    <div className="ms-4">
                      <h5 className="mb-0 fw-bold">
                        {showCount(dashboardStats.enrolledStudents)}
                      </h5>
                      <span className="mb-0 h6 fw-light">
                        Enrolled Students
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {statsError && (
                <div className="alert alert-warning mt-3" role="alert">
                  {statsError}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-warning ms-3"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Earnings and Rating */}
              <div className="row mt-5">
                <div className="col-12">
                  <div className="card card-body border p-4 h-100">
                    <div className="row g-4">
                      <div className="col-sm-6 col-md-4">
                        <span className="badge bg-dark text-white">
                          Current Month
                        </span>
                        <h4 className="text-primary my-2">
                          {statsLoading
                            ? '...'
                            : formatCurrency(dashboardStats.currentMonthEarning)}
                        </h4>
                        <p className="mb-0">
                          {hasEarningComparison ? (
                            <span
                              className={`me-1 ${
                                earningPercentage >= 0
                                  ? 'text-success'
                                  : 'text-danger'
                              }`}
                            >
                              {Math.abs(earningPercentage).toFixed(2)}%
                              <i
                                className={`bi ${
                                  earningPercentage >= 0
                                    ? 'bi-arrow-up'
                                    : 'bi-arrow-down'
                                } ms-1`}
                              />
                            </span>
                          ) : (
                            <span className="text-muted me-1">--</span>
                          )}
                          vs last month
                        </p>
                      </div>

                      <div className="col-sm-6 col-md-4">
                        <span className="badge bg-dark text-white">
                          Last Month
                        </span>
                        <h4 className="my-2">
                          {statsLoading
                            ? '...'
                            : formatCurrency(dashboardStats.lastMonthEarning)}
                        </h4>
                        <p className="mb-0">Previous month earnings</p>
                      </div>

                      <div className="col-sm-6 col-md-4">
                        <span className="badge bg-dark text-white">
                          Instructor Rating
                        </span>
                        <h4 className="text-primary my-2">
                          {statsLoading
                            ? '...'
                            : dashboardStats.averageRating != null
                              ? `${Number(dashboardStats.averageRating).toFixed(1)}/5.0`
                              : 'No ratings'}
                        </h4>
                        <p className="mb-0">
                          {showCount(dashboardStats.totalReviews)} Reviews
                        </p>
                      </div>

                      <div className="col-sm-6 col-md-4">
                        <span className="badge bg-dark text-white">
                          Total Enrollments
                        </span>
                        <h4 className="my-2">
                          {showCount(dashboardStats.totalEnrollments)}
                        </h4>
                        <p className="mb-0">Across your courses</p>
                      </div>
                    </div>

                    <div id="ChartPayout" />
                  </div>
                </div>
              </div>

              {/* Most Selling Courses */}
              <div className="row">
                <div className="col-12">
                  <div className="card border rounded-3 mt-5">
                    <div className="card-header border-bottom">
                      <div className="d-sm-flex justify-content-sm-between align-items-center">
                        <h3 className="mb-2 mb-sm-0">
                          Most Selling Courses
                        </h3>

                        <button
                          type="button"
                          className="btn btn-sm btn-primary-soft mb-0"
                          onClick={() => navigate('/Instructor_Create_Course')}
                        >
                          View all
                        </button>
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="table-responsive-lg border-0 rounded-3">
                        <table className="table table-dark-gray align-middle p-4 mb-0">
                          <thead>
                            <tr>
                              <th className="border-0 rounded-start">
                                Course Name
                              </th>
                              <th className="border-0">Selling</th>
                              <th className="border-0">Amount</th>
                              <th className="border-0">Period</th>
                              <th className="border-0 rounded-end">Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {statsLoading ? (
                              <tr>
                                <td colSpan="5" className="text-center py-4">
                                  Loading courses...
                                </td>
                              </tr>
                            ) : statsError ? (
                              <tr>
                                <td colSpan="5" className="text-center py-4">
                                  Course data load nahi hua.
                                </td>
                              </tr>
                            ) : currentCourses.length > 0 ? (
                              currentCourses.map((course, index) => {
                                const courseId = course._id || course.id;
                                const courseName = course.name || 'Untitled Course';
                                const selling = Number(course.totalSelling ?? course.totalEnrollments ?? 0);
                                const amount = Number(
                                  course.totalAmount ?? course.fees ?? 0
                                );

                                return (
                                  <tr key={courseId || index}>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <div className="w-100px w-md-60px">
                                          <img
                                            src={getCourseImage(course)}
                                            className="rounded"
                                            alt={courseName}
                                            style={{
                                              width: '70px',
                                              height: '50px',
                                              objectFit: 'cover',
                                            }}
                                            onError={(event) => {
                                              event.currentTarget.src =
                                                'assets/images/courses/4by3/08.jpg';
                                            }}
                                          />
                                        </div>
                                        <h6 className="mb-0 ms-2">
                                          {courseName}
                                        </h6>
                                      </div>
                                    </td>

                                    <td>{selling}</td>

                                    <td>{formatCurrency(amount)}</td>

                                    <td>
                                      <span className="badge bg-primary bg-opacity-10 text-primary">
                                        {course.duration || 'N/A'}
                                      </span>
                                    </td>

                                    <td>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-success-soft btn-round me-1 mb-0"
                                        title="Edit Course"
                                        onClick={() => handleEdit(courseId)}
                                      >
                                        <i className="far fa-fw fa-edit" />
                                      </button>

                                      <button
                                        type="button"
                                        className="btn btn-sm btn-danger-soft btn-round mb-0"
                                        title="Delete Course"
                                        onClick={() =>
                                          handleDelete(courseId, courseName)
                                        }
                                      >
                                        <i className="fas fa-fw fa-times" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center py-4">
                                  No enrolled courses yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Entries and Pagination */}
                      <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-3">
                        <p className="mb-0 text-center text-sm-start">
                          Showing {totalEntries === 0 ? 0 : startIndex + 1} to{' '}
                          {endIndex} of {totalEntries} entries
                        </p>

                        <nav
                          className="d-flex justify-content-center mb-0"
                          aria-label="Course pagination"
                        >
                          <ul className="pagination pagination-sm pagination-primary-soft mb-0 pb-0">
                            <li
                              className={`page-item mb-0 ${
                                currentPage === 1 ? 'disabled' : ''
                              }`}
                            >
                              <button
                                type="button"
                                className="page-link"
                                disabled={currentPage === 1}
                                onClick={() =>
                                  handlePageChange(currentPage - 1)
                                }
                              >
                                <i className="fas fa-angle-left" />
                              </button>
                            </li>

                            {pageNumbers.map((page) => (
                              <li
                                key={page}
                                className={`page-item mb-0 ${
                                  currentPage === page ? 'active' : ''
                                }`}
                              >
                                <button
                                  type="button"
                                  className="page-link"
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </button>
                              </li>
                            ))}

                            <li
                              className={`page-item mb-0 ${
                                currentPage === totalPages ? 'disabled' : ''
                              }`}
                            >
                              <button
                                type="button"
                                className="page-link"
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                  handlePageChange(currentPage + 1)
                                }
                              >
                                <i className="fas fa-angle-right" />
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Most Selling Courses END */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default InstructorDashboard;







// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { NavLink } from 'react-router-dom';
// import InstructorHeader from './components/InstructorHeader';
// import InstructorSidebar from './components/InstructorSidebar';

// function InstructorDashboard() {
//   const auth = useSelector((state) => state.auth);
//   const instructorData = auth?.user?.data;

//   const [dashboardStats, setDashboardStats] = useState({
//     totalCourses: 0,
//     totalStudents: 0,
//     enrolledStudents: 0
//   });

//   const [statsLoading, setStatsLoading] = useState(true);
//   const [statsError, setStatsError] = useState('');

//   useEffect(() => {
//     const controller = new AbortController();

//     const fetchDashboardStats = async () => {
//       try {
//         setStatsLoading(true);
//         setStatsError('');

//         // Use the port shown in your backend terminal.
//         const response = await fetch(
//           'http://localhost:5000/api/v2/instructor/dashboard-stats',
//           {
//             method: 'GET',
//             credentials: 'include',
//             headers: {
//               Accept: 'application/json'
//             },
//             signal: controller.signal
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `Failed to fetch dashboard stats (${response.status})`
//           );
//         }

//         const result = await response.json();
//         const data = result?.data ?? result;

//         setDashboardStats({
//           totalCourses: Number(data?.totalCourses ?? 0),
//           totalStudents: Number(data?.totalStudents ?? 0),
//           enrolledStudents: Number(data?.enrolledStudents ?? 0)
//         });
//       } catch (error) {
//         if (error.name === 'AbortError') return;

//         console.error('Dashboard stats error:', error);
//         setStatsError(
//           'Dashboard statistics could not be loaded. Please try again.'
//         );
//       } finally {
//         if (!controller.signal.aborted) {
//           setStatsLoading(false);
//         }
//       }
//     };

//     fetchDashboardStats();

//     return () => controller.abort();
//   }, []);

//   const counterValue = (value) => {
//     if (statsLoading) return '...';
//     if (statsError) return '--';
//     return value.toLocaleString();
//   };

//   return (
//     <main>
//       <InstructorHeader />

//       <section className="pt-0">
//         <div className="container">
//           <div className="row">
//             <InstructorSidebar />

//             <div className="col-xl-9">
//               {/* Counter boxes START */}
//               <div className="row g-4">
//                 <div className="col-sm-6 col-lg-4">
//                   <div className="d-flex justify-content-center align-items-center p-4 bg-warning bg-opacity-15 rounded-3">
//                     <span className="display-6 text-warning mb-0">
//                       <i className="fas fa-tv fa-fw" />
//                     </span>
//                     <div className="ms-4">
//                       <div className="d-flex">
//                         <h5 className="mb-0 fw-bold">
//                           {counterValue(dashboardStats.totalCourses)}
//                         </h5>
//                       </div>
//                       <span className="mb-0 h6 fw-light">
//                         Total Courses
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="col-sm-6 col-lg-4">
//                   <div className="d-flex justify-content-center align-items-center p-4 bg-purple bg-opacity-10 rounded-3">
//                     <span className="display-6 text-purple mb-0">
//                       <i className="fas fa-user-graduate fa-fw" />
//                     </span>
//                     <div className="ms-4">
//                       <div className="d-flex">
//                         <h5 className="mb-0 fw-bold">
//                           {counterValue(dashboardStats.totalStudents)}
//                         </h5>
//                       </div>
//                       <span className="mb-0 h6 fw-light">
//                         Total Students
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="col-sm-6 col-lg-4">
//                   <div className="d-flex justify-content-center align-items-center p-4 bg-info bg-opacity-10 rounded-3">
//                     <span className="display-6 text-info mb-0">
//                       <i className="fas fa-gem fa-fw" />
//                     </span>
//                     <div className="ms-4">
//                       <div className="d-flex">
//                         <h5 className="mb-0 fw-bold">
//                           {counterValue(dashboardStats.enrolledStudents)}
//                         </h5>
//                       </div>
//                       <span className="mb-0 h6 fw-light">
//                         Enrolled Students
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {statsError && (
//                 <div className="alert alert-warning mt-3" role="alert">
//                   {statsError}
//                   <button
//                     type="button"
//                     className="btn btn-sm btn-outline-warning ms-3"
//                     onClick={() => window.location.reload()}
//                   >
//                     Retry
//                   </button>
//                 </div>
//               )}
//               {/* Counter boxes END */}

//               {/* Chart START */}
//               <div className="row mt-5">
//                 <div className="col-12">
//                   <div className="card card-body border p-4 h-100">
//                     <div className="row g-4">
//                       <div className="col-sm-6 col-md-4">
//                         <span className="badge bg-dark text-white">
//                           Current Month
//                         </span>
//                         <h4 className="text-primary my-2">$35000</h4>
//                         <p className="mb-0">
//                           <span className="text-success me-1">
//                             0.20% <i className="bi bi-arrow-up" />
//                           </span>
//                           vs last month
//                         </p>
//                       </div>

//                       <div className="col-sm-6 col-md-4">
//                         <span className="badge bg-dark text-white">
//                           Last Month
//                         </span>
//                         <h4 className="my-2">$28000</h4>
//                         <p className="mb-0">
//                           <span className="text-danger me-1">
//                             0.10% <i className="bi bi-arrow-down" />
//                           </span>
//                           Then last month
//                         </p>
//                       </div>
//                     </div>

//                     <div id="ChartPayout" />
//                   </div>
//                 </div>
//               </div>
//               {/* Chart END */}

//               {/* Course List table START */}
//               <div className="row">
//                 <div className="col-12">
//                   <div className="card border rounded-3 mt-5">
//                     <div className="card-header border-bottom">
//                       <div className="d-sm-flex justify-content-sm-between align-items-center">
//                         <h3 className="mb-2 mb-sm-0">
//                           Most Selling Courses
//                         </h3>
//                         <a
//                           href="#"
//                           className="btn btn-sm btn-primary-soft mb-0"
//                           onClick={(event) => event.preventDefault()}
//                         >
//                           View all
//                         </a>
//                       </div>
//                     </div>

//                     <div className="card-body">
//                       <div className="table-responsive-lg border-0 rounded-3">
//                         <table className="table table-dark-gray align-middle p-4 mb-0">
//                           <thead>
//                             <tr>
//                               <th scope="col" className="border-0 rounded-start">
//                                 Course Name
//                               </th>
//                               <th scope="col" className="border-0">
//                                 Selling
//                               </th>
//                               <th scope="col" className="border-0">
//                                 Amount
//                               </th>
//                               <th scope="col" className="border-0">
//                                 Period
//                               </th>
//                               <th scope="col" className="border-0 rounded-end">
//                                 Action
//                               </th>
//                             </tr>
//                           </thead>

//                           <tbody>
//                             <tr>
//                               <td>
//                                 <div className="d-flex align-items-center">
//                                   <div className="w-100px w-md-60px">
//                                     <img
//                                       src="assets/images/courses/4by3/08.jpg"
//                                       className="rounded"
//                                       alt=""
//                                     />
//                                   </div>
//                                   <h6 className="mb-0 ms-2">
//                                     <a href="#" onClick={(event) => event.preventDefault()}>
//                                       Building Scalable APIs with GraphQL
//                                     </a>
//                                   </h6>
//                                 </div>
//                               </td>
//                               <td>34</td>
//                               <td>$1,25,478</td>
//                               <td>
//                                 <span className="badge bg-primary bg-opacity-10 text-primary">
//                                   9 months
//                                 </span>
//                               </td>
//                               <td>
//                                 <a
//                                   href="#"
//                                   className="btn btn-sm btn-success-soft btn-round me-1 mb-0"
//                                   onClick={(event) => event.preventDefault()}
//                                 >
//                                   <i className="far fa-fw fa-edit" />
//                                 </a>
//                                 <button
//                                   type="button"
//                                   className="btn btn-sm btn-danger-soft btn-round mb-0"
//                                 >
//                                   <i className="fas fa-fw fa-times" />
//                                 </button>
//                               </td>
//                             </tr>

//                             <tr>
//                               <td>
//                                 <div className="d-flex align-items-center">
//                                   <div className="w-100px w-md-60px">
//                                     <img
//                                       src="assets/images/courses/4by3/10.jpg"
//                                       className="rounded"
//                                       alt=""
//                                     />
//                                   </div>
//                                   <h6 className="mb-0 ms-2">
//                                     <a href="#" onClick={(event) => event.preventDefault()}>
//                                       Bootstrap 5 From Scratch
//                                     </a>
//                                   </h6>
//                                 </div>
//                               </td>
//                               <td>45</td>
//                               <td>$2,85,478</td>
//                               <td>
//                                 <span className="badge bg-primary bg-opacity-10 text-primary">
//                                   6 months
//                                 </span>
//                               </td>
//                               <td>
//                                 <a
//                                   href="#"
//                                   className="btn btn-sm btn-success-soft btn-round me-1 mb-0"
//                                   onClick={(event) => event.preventDefault()}
//                                 >
//                                   <i className="far fa-fw fa-edit" />
//                                 </a>
//                                 <button
//                                   type="button"
//                                   className="btn btn-sm btn-danger-soft btn-round mb-0"
//                                 >
//                                   <i className="fas fa-fw fa-times" />
//                                 </button>
//                               </td>
//                             </tr>

//                             <tr>
//                               <td>
//                                 <div className="d-flex align-items-center">
//                                   <div className="w-100px w-md-60px">
//                                     <img
//                                       src="assets/images/courses/4by3/02.jpg"
//                                       className="rounded"
//                                       alt=""
//                                     />
//                                   </div>
//                                   <h6 className="mb-0 ms-2">
//                                     <a href="#" onClick={(event) => event.preventDefault()}>
//                                       Graphic Design Masterclass
//                                     </a>
//                                   </h6>
//                                 </div>
//                               </td>
//                               <td>21</td>
//                               <td>$85,478</td>
//                               <td>
//                                 <span className="badge bg-primary bg-opacity-10 text-primary">
//                                   4 months
//                                 </span>
//                               </td>
//                               <td>
//                                 <a
//                                   href="#"
//                                   className="btn btn-sm btn-success-soft btn-round me-1 mb-0"
//                                   onClick={(event) => event.preventDefault()}
//                                 >
//                                   <i className="far fa-fw fa-edit" />
//                                 </a>
//                                 <button
//                                   type="button"
//                                   className="btn btn-sm btn-danger-soft btn-round mb-0"
//                                 >
//                                   <i className="fas fa-fw fa-times" />
//                                 </button>
//                               </td>
//                             </tr>

//                             <tr>
//                               <td>
//                                 <div className="d-flex align-items-center">
//                                   <div className="w-100px w-md-60px">
//                                     <img
//                                       src="assets/images/courses/4by3/04.jpg"
//                                       className="rounded"
//                                       alt=""
//                                     />
//                                   </div>
//                                   <h6 className="mb-0 ms-2">
//                                     <a href="#" onClick={(event) => event.preventDefault()}>
//                                       Learn Invision
//                                     </a>
//                                   </h6>
//                                 </div>
//                               </td>
//                               <td>28</td>
//                               <td>$98,478</td>
//                               <td>
//                                 <span className="badge bg-primary bg-opacity-10 text-primary">
//                                   8 months
//                                 </span>
//                               </td>
//                               <td>
//                                 <a
//                                   href="#"
//                                   className="btn btn-sm btn-success-soft btn-round me-1 mb-0"
//                                   onClick={(event) => event.preventDefault()}
//                                 >
//                                   <i className="far fa-fw fa-edit" />
//                                 </a>
//                                 <button
//                                   type="button"
//                                   className="btn btn-sm btn-danger-soft btn-round mb-0"
//                                 >
//                                   <i className="fas fa-fw fa-times" />
//                                 </button>
//                               </td>
//                             </tr>

//                             <tr>
//                               <td>
//                                 <div className="d-flex align-items-center">
//                                   <div className="w-100px w-md-60px">
//                                     <img
//                                       src="assets/images/courses/4by3/06.jpg"
//                                       className="rounded"
//                                       alt=""
//                                     />
//                                   </div>
//                                   <h6 className="mb-0 ms-2">
//                                     <a href="#" onClick={(event) => event.preventDefault()}>
//                                       Angular – The Complete Guider
//                                     </a>
//                                   </h6>
//                                 </div>
//                               </td>
//                               <td>38</td>
//                               <td>$1,02,478</td>
//                               <td>
//                                 <span className="badge bg-primary bg-opacity-10 text-primary">
//                                   1 year
//                                 </span>
//                               </td>
//                               <td>
//                                 <a
//                                   href="#"
//                                   className="btn btn-sm btn-success-soft btn-round me-1 mb-0"
//                                   onClick={(event) => event.preventDefault()}
//                                 >
//                                   <i className="far fa-fw fa-edit" />
//                                 </a>
//                                 <button
//                                   type="button"
//                                   className="btn btn-sm btn-danger-soft btn-round mb-0"
//                                 >
//                                   <i className="fas fa-fw fa-times" />
//                                 </button>
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                       </div>

//                       <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-3">
//                         <p className="mb-0 text-center text-sm-start">
//                           Showing 1 to 8 of 20 entries
//                         </p>

//                         <nav
//                           className="d-flex justify-content-center mb-0"
//                           aria-label="navigation"
//                         >
//                           <ul className="pagination pagination-sm pagination-primary-soft mb-0 pb-0">
//                             <li className="page-item mb-0">
//                               <a
//                                 className="page-link"
//                                 href="#"
//                                 tabIndex={-1}
//                                 onClick={(event) => event.preventDefault()}
//                               >
//                                 <i className="fas fa-angle-left" />
//                               </a>
//                             </li>
//                             <li className="page-item mb-0">
//                               <a
//                                 className="page-link"
//                                 href="#"
//                                 onClick={(event) => event.preventDefault()}
//                               >
//                                 1
//                               </a>
//                             </li>
//                             <li className="page-item mb-0 active">
//                               <a
//                                 className="page-link"
//                                 href="#"
//                                 onClick={(event) => event.preventDefault()}
//                               >
//                                 2
//                               </a>
//                             </li>
//                             <li className="page-item mb-0">
//                               <a
//                                 className="page-link"
//                                 href="#"
//                                 onClick={(event) => event.preventDefault()}
//                               >
//                                 3
//                               </a>
//                             </li>
//                             <li className="page-item mb-0">
//                               <a
//                                 className="page-link"
//                                 href="#"
//                                 onClick={(event) => event.preventDefault()}
//                               >
//                                 <i className="fas fa-angle-right" />
//                               </a>
//                             </li>
//                           </ul>
//                         </nav>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* Course List table END */}
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// export default InstructorDashboard;
