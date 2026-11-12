
import React, { useEffect, useMemo, useState } from "react";
import InstructorHeader from "./components/InstructorHeader";
import InstructorSidebar from "./components/InstructorSidebar";

function Instructor_Student_list() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const itemsPerPage = 8;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/v2/enrollment/instructor/students",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || result.Message || "Failed to fetch students");
        }

        setStudents(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        console.error("Instructor Students Error:", err);
        setError(err.message || "Unable to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    let result = [...students];

    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter((student) => {
        const name = student.name || "";
        const email = student.email || "";

        return (
          name.toLowerCase().includes(searchValue) ||
          email.toLowerCase().includes(searchValue)
        );
      });
    }

    if (sortBy === "Newest") {
      result.sort(
        (a, b) =>
          new Date(b.enrolledDate || 0) -
          new Date(a.enrolledDate || 0)
      );
    } else if (sortBy === "Oldest") {
      result.sort(
        (a, b) =>
          new Date(a.enrolledDate || 0) -
          new Date(b.enrolledDate || 0)
      );
    } else if (sortBy === "Free") {
      result = result.filter((student) =>
        student.courses?.some(
          (item) => Number(item.course?.fees || 0) === 0
        )
      );
    }

    return result;
  }, [students, search, sortBy]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentStudents = filteredStudents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleDateString("en-IN");
  };

  const getProgress = (progress) => {
    const value = Number(progress) || 0;
    return Math.min(100, Math.max(0, value));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <main>
        <InstructorHeader />

        <section className="pt-0">
          <div className="container">
            <div className="row">
              <InstructorSidebar />

              <div className="col-xl-9">
                <div className="card border rounded-3">
                  <div className="card-header border-bottom">
                    <h3 className="mb-0">My Students List</h3>
                  </div>

                  <div className="card-body">
                    {/* Search and Sort */}
                    <div className="row g-3 align-items-center justify-content-between mb-4">
                      <div className="col-md-8">
                        <form
                          className="rounded position-relative"
                          onSubmit={(e) => e.preventDefault()}
                        >
                          <input
                            className="form-control pe-5 bg-transparent"
                            type="search"
                            placeholder="Search student name or email"
                            aria-label="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />

                          <button
                            className="btn bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y"
                            type="submit"
                          >
                            <i className="fas fa-search fs-6" />
                          </button>
                        </form>
                      </div>

                      <div className="col-md-3">
                        <select
                          className="form-select js-choice border-0 z-index-9 bg-transparent"
                          aria-label="Sort students"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                        >
                          <option value="">Sort by</option>
                          <option value="Free">Free</option>
                          <option value="Newest">Newest</option>
                          <option value="Oldest">Oldest</option>
                        </select>
                      </div>
                    </div>

                    {/* Student Table */}
                    <div className="table-responsive border-0">
                      <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                        <thead>
                          <tr>
                            <th scope="col" className="border-0 rounded-start">
                              Student name
                            </th>
                            <th scope="col" className="border-0">
                              Progress
                            </th>
                            <th scope="col" className="border-0">
                              Courses
                            </th>
                            <th scope="col" className="border-0">
                              Enrolled date
                            </th>
                            <th scope="col" className="border-0 rounded-end">
                              Action
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {loading ? (
                            <tr>
                              <td colSpan="5" className="text-center py-5">
                                <div
                                  className="spinner-border text-primary"
                                  role="status"
                                />
                                <p className="mb-0 mt-2">
                                  Loading students...
                                </p>
                              </td>
                            </tr>
                          ) : error ? (
                            <tr>
                              <td
                                colSpan="5"
                                className="text-center text-danger py-5"
                              >
                                {error}
                              </td>
                            </tr>
                          ) : currentStudents.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center py-5">
                                No students found.
                              </td>
                            </tr>
                          ) : (
                            currentStudents.map((student) => {
                              const progress = getProgress(student.progress);

                              return (
                                <tr key={student._id}>
                                  <td>
                                    <div className="d-flex align-items-center position-relative">
                                      <div className="avatar avatar-md mb-2 mb-md-0">
                                        <img
                                          src={
                                            student.pfp ||
                                            student.profile_image ||
                                            student.avatar ||
                                            "assets/images/avatar/01.jpg"
                                          }
                                          className="rounded"
                                          alt={student.name || "Student"}
                                        />
                                      </div>

                                      <div className="mb-0 ms-2">
                                        <h6 className="mb-0">
                                          {student.name || "Student"}
                                        </h6>

                                        <span className="text-body small">
                                          {student.email || "-"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="text-center text-sm-start">
                                    <div className="overflow-hidden">
                                      <h6 className="mb-0">{progress}%</h6>

                                      <div className="progress progress-sm bg-primary bg-opacity-10">
                                        <div
                                          className="progress-bar bg-primary"
                                          role="progressbar"
                                          style={{ width: `${progress}%` }}
                                          aria-valuenow={progress}
                                          aria-valuemin={0}
                                          aria-valuemax={100}
                                        />
                                      </div>
                                    </div>
                                  </td>

                                  <td>{student.totalCourses || 0}</td>

                                  <td>{formatDate(student.enrolledDate)}</td>

                                  <td>
                                    {/* <a
                                      href={
                                        student.email
                                          ? `mailto:${student.email}`
                                          : "#"
                                      }
                                      className="btn btn-success-soft btn-round me-1 mb-0"
                                      title="Message"
                                    >
                                      <i className="far fa-envelope" />
                                    </a> */}

                                    <button
                                      type="button"
                                      className="btn btn-danger-soft btn-round mb-0"
                                      title="Block"
                                      onClick={() =>
                                        window.alert(
                                          "Block functionality is not connected yet."
                                        )
                                      }
                                    >
                                      <i className="fas fa-ban" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
                      <p className="mb-0 text-center text-sm-start">
                        Showing{" "}
                        {filteredStudents.length === 0 ? 0 : startIndex + 1} to{" "}
                        {Math.min(
                          startIndex + itemsPerPage,
                          filteredStudents.length
                        )}{" "}
                        of {filteredStudents.length} entries
                      </p>

                      <nav
                        className="d-flex justify-content-center mb-0"
                        aria-label="navigation"
                      >
                        <ul className="pagination pagination-sm pagination-primary-soft mb-0 pb-0">
                          <li
                            className={`page-item mb-0 ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              type="button"
                              disabled={currentPage === 1}
                              onClick={() =>
                                handlePageChange(currentPage - 1)
                              }
                            >
                              <i className="fas fa-angle-left" />
                            </button>
                          </li>

                          {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                          ).map((page) => (
                            <li
                              key={page}
                              className={`page-item mb-0 ${
                                currentPage === page ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                type="button"
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </button>
                            </li>
                          ))}

                          <li
                            className={`page-item mb-0 ${
                              currentPage === totalPages || totalPages === 0
                                ? "disabled"
                                : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              type="button"
                              disabled={
                                currentPage === totalPages || totalPages === 0
                              }
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
          </div>
        </section>
      </main>
    </div>
  );
}

export default Instructor_Student_list;






// import React from "react";
// import InstructorHeader from "./components/InstructorHeader";
// import InstructorSidebar from "./components/InstructorSidebar";

// function Instructor_Student_list(props) {
//   return (
//     <div>
//       <main>
//         {/* Reusable profile header banner */}
//         <InstructorHeader />

//         {/* Inner part START */}
//         <section className="pt-0">
//           <div className="container">
//             <div className="row">
              
//               {/* Reusable navigation sidebar */}
//               <InstructorSidebar />

//               {/* Main content START */}
//               <div className="col-xl-9">
//                 {/* Card START */}
//                 <div className="card border rounded-3">
//                   {/* Card header START */}
//                   <div className="card-header border-bottom">
//                     <h3 className="mb-0">My Students List</h3>
//                   </div>
//                   {/* Card header END */}
//                   {/* Card body START */}
//                   <div className="card-body">
//                     {/* Search and select START */}
//                     <div className="row g-3 align-items-center justify-content-between mb-4">
//                       {/* Search */}
//                       <div className="col-md-8">
//                         <form className="rounded position-relative">
//                           <input
//                             className="form-control pe-5 bg-transparent"
//                             type="search"
//                             placeholder="Search"
//                             aria-label="Search"
//                           />
//                           <button
//                             className="btn bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y"
//                             type="submit"
//                           >
//                             <i className="fas fa-search fs-6 " />
//                           </button>
//                         </form>
//                       </div>
//                       {/* Select option */}
//                       <div className="col-md-3">
//                         {/* Short by filter */}
//                         <form>
//                           <select
//                             className="form-select js-choice border-0 z-index-9 bg-transparent"
//                             aria-label=".form-select-sm"
//                           >
//                             <option value>Sort by</option>
//                             <option>Free</option>
//                             <option>Newest</option>
//                             <option>Oldest</option>
//                           </select>
//                         </form>
//                       </div>
//                     </div>
//                     {/* Search and select END */}
//                     {/* Student list table START */}
//                     <div className="table-responsive border-0">
//                       <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
//                         {/* Table head */}
//                         <thead>
//                           <tr>
//                             <th scope="col" className="border-0 rounded-start">
//                               Student name
//                             </th>
//                             <th scope="col" className="border-0">
//                               Progress
//                             </th>
//                             <th scope="col" className="border-0">
//                               Courses
//                             </th>
//                             <th scope="col" className="border-0">
//                               Enrolled date
//                             </th>
//                             <th scope="col" className="border-0 rounded-end">
//                               Action
//                             </th>
//                           </tr>
//                         </thead>
//                         {/* Table body START */}
//                         <tbody>
//                           {/* Table item */}
//                           <tr>
//                             {/* Table data */}
//                             <td>
//                               <div className="d-flex align-items-center position-relative">
//                                 {/* Image */}
//                                 <div className="avatar avatar-md mb-2 mb-md-0">
//                                   <img
//                                     src="assets/images/avatar/01.jpg"
//                                     className="rounded"
//                                     alt
//                                   />
//                                 </div>
//                                 <div className="mb-0 ms-2">
//                                   {/* Title */}
//                                   <h6 className="mb-0">
//                                     <a href="#" className="stretched-link">
//                                       Lori Stevens
//                                     </a>
//                                   </h6>
//                                   {/* Address */}
//                                   <span className="text-body small">
//                                     <i className="fas fa-fw fa-map-marker-alt me-1 mt-1" />
//                                     Mumbai
//                                   </span>
//                                 </div>
//                               </div>
//                             </td>
//                             {/* Table data */}
//                             <td className="text-center text-sm-start">
//                               <div className=" overflow-hidden">
//                                 <h6 className="mb-0">85%</h6>
//                                 <div className="progress progress-sm bg-primary bg-opacity-10">
//                                   <div
//                                     className="progress-bar bg-primary aos"
//                                     role="progressbar"
//                                     data-aos="slide-right"
//                                     data-aos-delay={200}
//                                     data-aos-duration={1000}
//                                     data-aos-easing="ease-in-out"
//                                     style={{ width: "85%" }}
//                                     aria-valuenow={85}
//                                     aria-valuemin={0}
//                                     aria-valuemax={100}
//                                   ></div>
//                                 </div>
//                               </div>
//                             </td>
//                             {/* Table data */}
//                             <td>10</td>
//                             {/* Table data */}
//                             <td>4/9/2021</td>
//                             {/* Table data */}
//                             <td>
//                               <a
//                                 href="#"
//                                 className="btn btn-success-soft btn-round me-1 mb-0"
//                                 data-bs-toggle="tooltip"
//                                 data-bs-placement="top"
//                                 title="Message"
//                               >
//                                 <i className="far fa-envelope" />
//                               </a>
//                               <button
//                                 className="btn btn-danger-soft btn-round mb-0"
//                                 data-bs-toggle="tooltip"
//                                 data-bs-placement="top"
//                                 title="Block"
//                               >
//                                 <i className="fas fa-ban" />
//                               </button>
//                             </td>
//                           </tr>
//                           {/* Table item */}
//                           <tr>
//                             {/* Table data */}
//                             <td>
//                               <div className="d-flex align-items-center position-relative">
//                                 {/* Image */}
//                                 <div className="avatar avatar-md mb-2 mb-md-0">
//                                   <img
//                                     src="assets/images/avatar/03.jpg"
//                                     className="rounded"
//                                     alt
//                                   />
//                                 </div>
//                                 <div className="mb-0 ms-2">
//                                   {/* Title */}
//                                   <h6 className="mb-0">
//                                     <a href="#" className="stretched-link">
//                                       Dennis Barrett
//                                     </a>
//                                   </h6>
//                                   {/* Address */}
//                                   <span className="text-body small">
//                                     <i className="fas fa-fw fa-map-marker-alt me-1 mt-1" />
//                                     New york
//                                   </span>
//                                 </div>
//                               </div>
//                             </td>
//                             {/* Table data */}
//                             <td className="text-center text-sm-start">
//                               <div className=" overflow-hidden">
//                                 <h6 className="mb-0">40%</h6>
//                                 <div className="progress progress-sm bg-primary bg-opacity-10">
//                                   <div
//                                     className="progress-bar bg-primary aos"
//                                     role="progressbar"
//                                     data-aos="slide-right"
//                                     data-aos-delay={200}
//                                     data-aos-duration={1000}
//                                     data-aos-easing="ease-in-out"
//                                     style={{ width: "40%" }}
//                                     aria-valuenow={40}
//                                     aria-valuemin={0}
//                                     aria-valuemax={100}
//                                   ></div>
//                                 </div>
//                               </div>
//                             </td>
//                             {/* Table data */}
//                             <td>12</td>
//                             {/* Table data */}
//                             <td>9/7/2021</td>
//                             {/* Table data */}
//                             <td>
//                               <a
//                                 href="#"
//                                 className="btn btn-success-soft btn-round me-1 mb-0"
//                                 data-bs-toggle="tooltip"
//                                 data-bs-placement="top"
//                                 title="Message"
//                               >
//                                 <i className="far fa-envelope" />
//                               </a>
//                               <button
//                                 className="btn btn-danger btn-round mb-0"
//                                 data-bs-toggle="tooltip"
//                                 data-bs-placement="top"
//                                 title="Unblock"
//                               >
//                                 <i className="fas fa-ban" />
//                               </button>
//                             </td>
//                           </tr>
//                           {/* Table item */}
//                           <tr>
//                             {/* Table data */}
//                             <td>
//                               <div className="d-flex align-items-center position-relative">
//                                 {/* Image */}
//                                 <div className="avatar avatar-md mb-2 mb-md-0">
//                                   <img
//                                     src="assets/images/avatar/04.jpg"
//                                     className="rounded"
//                                     alt
//                                   />
//                                 </div>
//                                 <div className="mb-0 ms-2">
//                                   {/* Title */}
//                                   <h6 className="mb-0">
//                                     <a href="#" className="stretched-link">
//                                       Billy Vasquez
//                                     </a>
//                                   </h6>
//                                   {/* Address */}
//                                   <span className="text-body small">
//                                     <i className="fas fa-fw fa-map-marker-alt me-1 mt-1" />
//                                     Paris
//                                   </span>
//                                 </div>
//                               </div>
//                             </td>
//                             {/* Table data */}
//                             <td className="text-center text-sm-start">
//                               <div className=" overflow-hidden">
//                                 <h6 className="mb-0">62%</h6>
//                                 <div className="progress progress-sm bg-primary bg-opacity-10">
//                                   <div
//                                     className="progress-bar bg-primary aos"
//                                     role="progressbar"
//                                     data-aos="slide-right"
//                                     data-aos-delay={200}
//                                     data-aos-duration={1000}
//                                     data-aos-easing="ease-in-out"
//                                     style={{ width: "62%" }}
//                                     aria-valuenow={62}
//                                     aria-valuemin={0}
//                                     aria-valuemax={100}
//                                   ></div>
//                                 </div>
//                               </div>
//                             </td>
//                             {/* Table data */}
//                             <td>08</td>
//                             {/* Table data */}
//                             <td>10/5/2021</td>
//                             {/* Table data */}
//                             <td>
//                               <a
//                                 href="#"
//                                 className="btn btn-success-soft btn-round me-1 mb-0"
//                                 data-bs-toggle="tooltip"
//                                 data-bs-placement="top"
//                                 title="Message"
//                               >
//                                 <i className="far fa-envelope" />
//                               </a>
//                               <button
//                                 className="btn btn-danger-soft btn-round mb-0"
//                                 data-bs-toggle="tooltip"
//                                 data-bs-placement="top"
//                                 title="Block"
//                               >
//                                 <i className="fas fa-ban" />
//                               </button>
//                             </td>
//                           </tr>
//                           {/* Table item */}
//                           <tr>
//                             {/* Table data */}
//                             <td>
//                               <div className="d-flex align-items-center position-relative">
//                                 {/* Image */}
//                                 <div className="avatar avatar-md mb-2 mb-md-0">
//                                   <img
//                                     src="assets/images/avatar/09.jpg"
//                                     className="rounded"
//                                     alt
//                                   />
//                                 </div>
//                                 <div className="mb-0 ms-2">
//                                   {/* Title */}
//                                   <h6 className="mb-0">
//                                     <a href="#" className="stretched-link">
//                                       Carolyn Ortiz
//                                     </a>
//                                   </h6>
//                                   {/* Address */}
//                                   <span className="text-body small">
//                                     <i className="fas fa-fw fa-map-marker-alt me-1 mt-1" />
//                                     Delhi
//                                   </span>
//                                 </div>
//                               </div>
//                             </td>
//                             {/* Table data */}
//                             <td className="text-center text-sm-start">
//                               <div className=" overflow-hidden">
//                                 <h6 className="mb-0">60%</h6>
//                                 <div className="progress progress-sm bg-primary bg-opacity-10">
//                                   <div
//                                     className="progress-bar bg-primary aos"
//                                     role="progressbar"
//                                     data-aos="slide-right"
//                                     data-aos-delay={200}
//                                     data-aos-duration={1000}
//                                     data-aos-easing="ease-in-out"
//                                     style={{ width: "60%" }}
//                                     aria-valuenow={60}
//                                     aria-valuemin={0}
//                                     aria-valuemax={100}
//                                   ></div>
//                                 </div>
//                               </div>
//                             </td>
//                             {/* Table data */}
//                             <td>06</td>
//                             {/* Table data */}
//                             <td>20/4/2021</td>
//                             {/* Table data */}
//                             <td>
//                               <a
//                                 href="#"
//                                 className="btn btn-success-soft btn-round me-1 mb-0"
//                                 data-bs-toggle="tooltip"
//                                 data-bs-placement="top"
//                                 title="Message"
//                               >
//                                 <i className="far fa-envelope" />
//                               </a>
//                               <button
//                                 className="btn btn-danger-soft btn-round mb-0"
//                                 data-bs-toggle="tooltip"
//                                 data-bs-placement="top"
//                                 title="Block"
//                               >
//                                 <i className="fas fa-ban" />
//                               </button>
//                             </td>
//                           </tr>
//                           {/* Table item */}
//                           <tr>
//                             {/* Table data */}
//                             <td>
//                               <div className="d-flex align-items-center position-relative">
//                                 {/* Image */}
//                                 <div className="avatar avatar-md mb-2 mb-md-0">
//                                   <img
//                                     src="assets/images/avatar/07.jpg"
//                                     className="rounded"
//                                     alt
//                                   />
//                                 </div>
//                                 <div className="mb-0 ms-2">
//                                   {/* Title */}
//                                   <h6 className="mb-0">
//                                     <a href="#" className="stretched-link">
//                                       Larry Lawson
//                                     </a>
//                                   </h6>
//                                   {/* Address */}
//                                   <span className="text-body small">
//                                     <i className="fas fa-fw fa-map-marker-alt me-1 mt-1" />
//                                     London
//                                   </span>
//                                 </div>
//                               </div>
//                             </td>
//                             {/* Table data */}
//                             <td className="text-center text-sm-start">
//                               <div className=" overflow-hidden">
//                                 <h6 className="mb-0">35%</h6>
//                                 <div className="progress progress-sm bg-primary bg-opacity-10">
//                                   <div
//                                     className="progress-bar bg-primary aos"
//                                     role="progressbar"
//                                     data-aos="slide-right"
//                                     data-aos-delay={200}
//                                     data-aos-duration={1000}
//                                     data-aos-easing="ease-in-out"
//                                     style={{ width: "35%" }}
//                                     aria-valuenow={35}
//                                     aria-valuemin={0}
//                                     aria-valuemax={100}
//                                   ></div>
//                                 </div>
//                               </div>
//                             </td>
//                             {/* Table data */}
//                             <td>04</td>
//                             {/* Table data */}
//                             <td>12/7/2021</td>
//                             {/* Table data */}
//                             <td>
//                               <a
//                                 href="#"
//                                 className="btn btn-success-soft btn-round me-1 mb-0"
//                                 data-bs-toggle="tooltip"
//                                 data-bs-placement="top"
//                                 title="Message"
//                               >
//                                 <i className="far fa-envelope" />
//                               </a>
//                               <button
//                                 className="btn btn-danger-soft btn-round mb-0"
//                                 data-bs-toggle="tooltip"
//                                 data-bs-placement="top"
//                                 title="Block"
//                               >
//                                 <i className="fas fa-ban" />
//                               </button>
//                             </td>
//                           </tr>
//                           {/* Table item */}
//                           <tr>
//                             {/* Table data */}
//                             <td>
//                               <div className="d-flex align-items-center position-relative">
//                                 {/* Image */}
//                                 <div className="avatar avatar-md mb-2 mb-md-0">
//                                   <img
//                                     src="assets/images/avatar/06.jpg"
//                                     className="rounded"
//                                     alt
//                                   />
//                                 </div>
//                                 <div className="mb-0 ms-2">
//                                   {/* Title */}
//                                   <h6 className="mb-0">
//                                     <a href="#" className="stretched-link">
//                                       Frances Guerrero
//                                     </a>
//                                   </h6>
//                                   {/* Address */}
//                                   <span className="text-body small">
//                                     <i className="fas fa-fw fa-map-marker-alt me-1 mt-1" />
//                                     Pune
//                                   </span>
//                                 </div>
//                               </div>
//                             </td>
//                             {/* Table data */}
//                             <td className="text-center text-sm-start">
//                               <div className=" overflow-hidden">
//                                 <h6 className="mb-0">42%</h6>
//                                 <div className="progress progress-sm bg-primary bg-opacity-10">
//                                   <div
//                                     className="progress-bar bg-primary aos"
//                                     role="progressbar"
//                                     data-aos="slide-right"
//                                     data-aos-delay={200}
//                                     data-aos-duration={1000}
//                                     data-aos-easing="ease-in-out"
//                                     style={{ width: "42%" }}
//                                     aria-valuenow={42}
//                                     aria-valuemin={0}
//                                     aria-valuemax={100}
//                                   ></div>
//                                 </div>
//                               </div>
//                             </td>
//                             {/* Table data */}
//                             <td>14</td>
//                             {/* Table data */}
//                             <td>8/8/2021</td>
//                             {/* Table data */}
//                             <td>
//                               <a
//                                 href="#"
//                                 className="btn btn-success-soft btn-round me-1 mb-0"
//                                 data-bs-toggle="tooltip"
//                                 data-bs-placement="top"
//                                 title="Message"
//                               >
//                                 <i className="far fa-envelope" />
//                               </a>
//                               <button
//                                 className="btn btn-danger-soft btn-round mb-0"
//                                 data-bs-toggle="tooltip"
//                                 data-bs-placement="top"
//                                 title="Block"
//                               >
//                                 <i className="fas fa-ban" />
//                               </button>
//                             </td>
//                           </tr>
//                         </tbody>
//                         {/* Table body END */}
//                       </table>
//                     </div>
//                     {/* Student list table END */}
//                     {/* Pagination START */}
//                     <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
//                       {/* Content */}
//                       <p className="mb-0 text-center text-sm-start">
//                         Showing 1 to 8 of 20 entries
//                       </p>
//                       {/* Pagination */}
//                       <nav
//                         className="d-flex justify-content-center mb-0"
//                         aria-label="navigation"
//                       >
//                         <ul className="pagination pagination-sm pagination-primary-soft mb-0 pb-0">
//                           <li className="page-item mb-0">
//                             <a className="page-link" href="#" tabIndex={-1}>
//                               <i className="fas fa-angle-left" />
//                             </a>
//                           </li>
//                           <li className="page-item mb-0">
//                             <a className="page-link" href="#">
//                               1
//                             </a>
//                           </li>
//                           <li className="page-item mb-0 active">
//                             <a className="page-link" href="#">
//                               2
//                             </a>
//                           </li>
//                           <li className="page-item mb-0">
//                             <a className="page-link" href="#">
//                               3
//                             </a>
//                           </li>
//                           <li className="page-item mb-0">
//                             <a className="page-link" href="#">
//                               <i className="fas fa-angle-right" />
//                             </a>
//                           </li>
//                         </ul>
//                       </nav>
//                     </div>
//                     {/* Pagination END */}
//                   </div>
//                   {/* Card body START */}
//                 </div>
//                 {/* Card END */}
//               </div>
//               {/* Main content END */}
//             </div>
//             {/* Row END */}
//           </div>
//         </section>
//         {/* =======================
// Inner part END */}
//       </main>
//     </div>
//   );
// }

// export default Instructor_Student_list;
