
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

function InstructorHeader() {
  const auth = useSelector((state) => state.auth);
  const instructor = auth?.user?.data || {};

  const [dashboardStats, setDashboardStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    enrolledStudents: 0,
    averageRating: null,
    totalReviews: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchInstructorStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(false);

        const response = await fetch(
          'http://localhost:5000/api/v2/dashboard/instructor-stats',
          {
            method: 'GET',
            credentials: 'include',
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const result = await response.json();
        const data = result?.data ?? result;

        setDashboardStats({
          totalCourses: Number(data?.totalCourses ?? 0),
          totalStudents: Number(data?.totalStudents ?? 0),
          enrolledStudents: Number(data?.enrolledStudents ?? 0),
          averageRating: data?.averageRating ?? null,
          totalReviews: Number(data?.totalReviews ?? 0),
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Instructor header stats error:', error);
          setStatsError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setStatsLoading(false);
        }
      }
    };

    fetchInstructorStats();

    return () => controller.abort();
  }, []);

  const instructorName = instructor?.name || 'Instructor';

  const profileImage =
    instructor?.pfp?.[0]?.url ||
    '/assets/images/avatar/01.jpg';

  const showCount = (value) => {
    if (statsLoading) return '...';
    if (statsError) return '--';
    return Number(value || 0).toLocaleString();
  };

  const averageRating = statsLoading
    ? '...'
    : statsError
      ? '--'
      : dashboardStats.averageRating != null
        ? `${Number(dashboardStats.averageRating).toFixed(1)}/5.0`
        : 'No ratings';

  return (
    <section className="pt-0">
      <div className="container-fluid px-0">
        <div
          className="bg-blue h-100px h-md-200px rounded-0"
          style={{
            background: 'url(/assets/images/pattern/04.png) no-repeat center center',
            backgroundSize: 'cover',
          }}
        />
      </div>

      <div className="container mt-n4">
        <div className="row">
          <div className="col-12">
            <div className="card bg-transparent card-body p-0">
              <div className="row d-flex justify-content-between">
                <div className="col-auto mt-4 mt-md-0">
                  <div className="avatar avatar-xxl mt-n3">
                    <img
                      className="avatar-img rounded-circle border border-white border-3 shadow"
                      src={profileImage}
                      alt={instructorName}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/images/avatar/01.jpg';
                      }}
                    />
                  </div>
                </div>

                <div className="col d-md-flex justify-content-between align-items-center mt-4">
                  <div>
                    <h1 className="my-1 fs-4">
                      {instructorName}
                      <i className="bi bi-patch-check-fill text-info small ms-1" />
                    </h1>

                    <ul className="list-inline mb-0">
                      <li className="list-inline-item h6 fw-light me-3 mb-1 mb-sm-0">
                        <i className="fas fa-star text-warning me-2" />
                        {averageRating}
                      </li>

                      <li className="list-inline-item h6 fw-light me-3 mb-1 mb-sm-0">
                        <i className="fas fa-user-graduate text-orange me-2" />
                        {showCount(dashboardStats.enrolledStudents)} Enrolled Students
                      </li>

                      <li className="list-inline-item h6 fw-light me-3 mb-1 mb-sm-0">
                        <i className="fas fa-book text-purple me-2" />
                        {showCount(dashboardStats.totalCourses)} Courses
                      </li>
                    </ul>
                  </div>

                  <div className="d-flex align-items-center mt-2 mt-md-0">
                    <NavLink
  to="/admin/course"
  className="btn btn-success mb-0"
>
  <i className="bi bi-plus-circle fa-fw me-2" />
  Create a course
</NavLink>
                  </div>
                </div>
              </div>
            </div>

            <hr className="d-xl-none" />

            <div className="col-12 col-xl-3 d-flex justify-content-between align-items-center">
              <a
                className="h6 mb-0 fw-bold d-xl-none"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Menu
              </a>

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






// import React from 'react';
// import { useSelector } from 'react-redux';
// import { NavLink } from 'react-router-dom';

// function InstructorHeader({ dashboardStats, statsLoading }) {
//   const auth = useSelector((state) => state.auth);

//   const instructor = auth?.user?.data || {};

//   const instructorName = instructor?.name || 'Instructor';

//   const profileImage =
//     instructor?.pfp || '/assets/images/avatar/01.jpg';

//   const totalCourses = statsLoading
//     ? '...'
//     : Number(dashboardStats?.totalCourses || 0).toLocaleString();

//   const enrolledStudents = statsLoading
//     ? '...'
//     : Number(dashboardStats?.enrolledStudents || 0).toLocaleString();

//   return (
//     <section className="pt-0">
//       <div className="container-fluid px-0">
//         <div
//           className="bg-blue h-100px h-md-200px rounded-0"
//           style={{
//             background: 'url(/assets/images/pattern/04.png) no-repeat center center',
//             backgroundSize: 'cover',
//           }}
//         />
//       </div>

//       <div className="container mt-n4">
//         <div className="row">
//           <div className="col-12">
//             <div className="card bg-transparent card-body p-0">
//               <div className="row d-flex justify-content-between">

//                 <div className="col-auto mt-4 mt-md-0">
//                   <div className="avatar avatar-xxl mt-n3">
//                     <img
//                       className="avatar-img rounded-circle border border-white border-3 shadow"
//                       src={profileImage}
//                       alt={instructorName}
//                       onError={(e) => {
//                         e.currentTarget.onerror = null;
//                         e.currentTarget.src = '/assets/images/avatar/01.jpg';
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div className="col d-md-flex justify-content-between align-items-center mt-4">
//                   <div>
//                     <h1 className="my-1 fs-4">
//                       {instructorName}
//                       <i className="bi bi-patch-check-fill text-info small ms-1" />
//                     </h1>

//                     <ul className="list-inline mb-0">
//                       <li className="list-inline-item h6 fw-light me-3 mb-1 mb-sm-0">
//                         <i className="fas fa-star text-warning me-2" />
//                         —/5.0
//                       </li>

//                       <li className="list-inline-item h6 fw-light me-3 mb-1 mb-sm-0">
//                         <i className="fas fa-user-graduate text-orange me-2" />
//                         {enrolledStudents} Enrolled Students
//                       </li>

//                       <li className="list-inline-item h6 fw-light me-3 mb-1 mb-sm-0">
//                         <i className="fas fa-book text-purple me-2" />
//                         {totalCourses} Courses
//                       </li>
//                     </ul>
//                   </div>

//                   <div className="d-flex align-items-center mt-2 mt-md-0">
//                     <NavLink
//                       to="/Instructor_Create_Course"
//                       className="btn btn-success mb-0"
//                     >
//                       <i className="bi bi-graph-up fa-fw me-2" />
//                       Create a course
//                     </NavLink>
//                   </div>
//                 </div>

//               </div>
//             </div>

//             <hr className="d-xl-none" />

//             <div className="col-12 col-xl-3 d-flex justify-content-between align-items-center">
//               <a
//                 className="h6 mb-0 fw-bold d-xl-none"
//                 href="#"
//                 onClick={(e) => e.preventDefault()}
//               >
//                 Menu
//               </a>

//               <button
//                 className="btn btn-primary d-xl-none"
//                 type="button"
//                 data-bs-toggle="offcanvas"
//                 data-bs-target="#offcanvasNavbar"
//                 aria-controls="offcanvasNavbar"
//               >
//                 <i className="fas fa-sliders-h" />
//               </button>
//             </div>

//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default InstructorHeader;
