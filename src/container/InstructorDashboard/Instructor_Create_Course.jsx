import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import {
  useGetallcourseQuery,
  useDeletCourseMutation
} from '../../redux/Api/Course.api';
import InstructorHeader from './components/InstructorHeader';
import InstructorSidebar from './components/InstructorSidebar';

function Instructor_Create_Course() {
  const auth = useSelector(state => state.auth);
  const navigate = useNavigate();

  const [search, setSearch] = useState('');

  const user = auth?.user?.data;
  const instructorId = user?._id;
  const role = user?.logtype;

  const {
    data,
    isLoading,
    isError
  } = useGetallcourseQuery();

  const [
    deleteCourse,
    { isLoading: isDeleting }
  ] = useDeletCourseMutation();

  const courseData = data?.data || [];

  const InstructorCourse = courseData.filter((course) => {
    const courseInstructorId =
      course?.intrucotor_id?._id ||
      course?.intrucotor_id;

    const matchesSearch = course?.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    if (!matchesSearch) {
      return false;
    }

    // Admin can see all courses
    if (role?.toLowerCase() === 'admin') {
      return true;
    }

    // Teacher can see only his/her courses
    return (
      String(courseInstructorId) === String(instructorId)
    );
  });

const handleEdit = (courseId) => {
  if (!courseId) return;
  navigate(`/Instructor_Create_Course/${courseId}`);
};

  const handleDelete = async (courseId, courseName) => {
    if (!courseId) {
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${courseName}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteCourse(courseId).unwrap();

      alert('Course deleted successfully.');
    } catch (error) {
      console.error('Delete course error:', error);

      alert(
        error?.data?.Message ||
        error?.data?.message ||
        'Failed to delete course.'
      );
    }
  };

  return (
    <main>
      <InstructorHeader />

      <section className="pt-0">
        <div className="container">
          <div className="row">
            <InstructorSidebar />

            <div className="col-xl-9">
              <div className="card border rounded-3">

                <div className="card-header border-bottom">
                  <h3 className="mb-0">
                    My Courses List
                  </h3>
                </div>

                <div className="card-body">

                  <div className="row g-3 align-items-center justify-content-between mb-4">
                    <div className="col-md-8">
                      <input
                        className="form-control bg-transparent"
                        type="search"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) =>
                          setSearch(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="table-responsive-lg border-0">
                    <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">

                      <thead>
                        <tr>
                          <th className="border-0 rounded-start">
                            Course Title
                          </th>

                          <th className="border-0">
                            Enrolled
                          </th>

                          <th className="border-0">
                            Status
                          </th>

                          <th className="border-0">
                            Price
                          </th>

                          <th className="border-0 rounded-end">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>

                        {isLoading ? (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center py-4"
                            >
                              Loading courses...
                            </td>
                          </tr>

                        ) : isError ? (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center text-danger py-4"
                            >
                              Failed to load courses.
                            </td>
                          </tr>

                        ) : !user ? (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center py-4"
                            >
                              Please login to view courses.
                            </td>
                          </tr>

                        ) : role?.toLowerCase() !== 'admin' &&
                          !instructorId ? (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center py-4"
                            >
                              Instructor ID not found.
                            </td>
                          </tr>

                        ) : InstructorCourse.length === 0 ? (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center py-4"
                            >
                              No courses found.
                            </td>
                          </tr>

                        ) : (
                          InstructorCourse.map((v) => (
                            <tr key={v._id}>

                              <td>
                                <div className="d-flex align-items-center">

                                  <div className="w-100px me-2">

                                    {v.course_img?.length > 0 ? (

                                      <Carousel
                                        indicators={false}
                                        navButtonsAlwaysInvisible={true}
                                      >
                                        {v.course_img.map(
                                          (img, index) => (
                                            <img
                                              key={index}
                                              src={img?.url}
                                              style={{
                                                width: '70px',
                                                height: '70px',
                                                objectFit: 'cover',
                                                borderRadius: '6px'
                                              }}
                                              alt={
                                                v.name ||
                                                'Course image'
                                              }
                                            />
                                          )
                                        )}
                                      </Carousel>

                                    ) : (

                                      <div
                                        className="bg-light rounded d-flex align-items-center justify-content-center"
                                        style={{
                                          width: '70px',
                                          height: '70px'
                                        }}
                                      >
                                        <i className="fas fa-book fs-4 text-secondary" />
                                      </div>

                                    )}

                                  </div>

                                  <div className="mb-0">

                                    <h6 className="mb-1">
                                      {v.name}
                                    </h6>

                                    <p className="h6 fw-light mb-0 small">
                                      <i className="fas fa-clock text-orange me-2" />

                                      {v.duration ||
                                        'Not specified'}
                                    </p>

                                  </div>

                                </div>
                              </td>

                              <td className="text-center text-sm-start">
                                {v.totalStudents ?? 0}
                              </td>

                              <td>
                                <div
                                  className={`badge ${
                                    v.is_active
                                      ? 'bg-success bg-opacity-10 text-success'
                                      : 'bg-danger bg-opacity-10 text-danger'
                                  }`}
                                >
                                  {v.is_active
                                    ? 'Live'
                                    : 'Inactive'}
                                </div>
                              </td>

                              <td>
                                {v.fees === 0 || !v.fees
                                  ? 'Free'
                                  : `₹${v.fees}`}
                              </td>

                              <td>

                                {/* EDIT */}
                                <button
                                  type="button"
                                  className="btn btn-sm btn-success-soft btn-round me-1 mb-0"
                                  title="Edit Course"
                                  onClick={() =>
                                    handleEdit(v._id)
                                  }
                                >
                                  <i className="far fa-fw fa-edit" />
                                </button>

                                {/* DELETE */}
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger-soft btn-round mb-0"
                                  title="Delete Course"
                                  disabled={isDeleting}
                                  onClick={() =>
                                    handleDelete(
                                      v._id,
                                      v.name
                                    )
                                  }
                                >
                                  <i className="fas fa-fw fa-times" />
                                </button>

                              </td>

                            </tr>
                          ))
                        )}

                      </tbody>

                    </table>
                  </div>

                  <div className="mt-4">
                    <p className="mb-0">
                      Showing {InstructorCourse.length} courses
                    </p>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

export default Instructor_Create_Course;





// import React from 'react';
// import { NavLink, useParams } from 'react-router-dom';
// import Carousel from 'react-material-ui-carousel';
// import { useSelector } from 'react-redux';
// import { useGetallcourseQuery } from '../../redux/Api/Course.api';
// import InstructorHeader from './components/InstructorHeader';
// import InstructorSidebar from './components/InstructorSidebar';

// function Instructor_Create_Course(props) {

//   const { id } = useParams();
//   const auth = useSelector(state => state.auth);
  
//   // Fallback to the logged-in instructor's ID if no parameter is provided
//   const instructorId = id || auth?.user?.data?._id;
  
//   const { data } = useGetallcourseQuery();
//   let courseData = data?.data;
  
//   let InstructorCourse = courseData?.filter((v) => v.Instructor_id === instructorId);
//   console.log(InstructorCourse);
 
//   return (
//     <main>
//       {/* Reusable profile header banner */}
//       <InstructorHeader />

//       {/* Inner part START */}
//       <section className="pt-0">
//         <div className="container">
//           <div className="row">
            
//             {/* Reusable navigation sidebar */}
//             <InstructorSidebar />

//             {/* Main content START */}
//             <div className="col-xl-9">
//           {/* Card START */}
//           <div className="card border rounded-3">
//             {/* Card header START */}
//             <div className="card-header border-bottom">
//               <h3 className="mb-0">My Courses List</h3>
//             </div>
//             {/* Card header END */}
//             {/* Card body START */}
//             <div className="card-body">
//               {/* Search and select START */}
//               <div className="row g-3 align-items-center justify-content-between mb-4">
//                 {/* Search */}
//                 <div className="col-md-8">
//                   <form className="rounded position-relative">
//                     <input className="form-control pe-5 bg-transparent" type="search" placeholder="Search" aria-label="Search" />
//                     <button className="btn bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y" type="submit"><i className="fas fa-search fs-6 " /></button>
//                   </form>
//                 </div>
//                 {/* Select option */}
//                 <div className="col-md-3">
//                   {/* Short by filter */}
//                   <form>
//                     <select className="form-select js-choice border-0 z-index-9 bg-transparent" aria-label=".form-select-sm">
//                       <option value>Sort by</option>
//                       <option>Free</option>
//                       <option>Newest</option>
//                       <option>Most popular</option>
//                       <option>Most Viewed</option>
//                     </select>
//                   </form>
//                 </div>
//               </div>
//               {/* Search and select END */}
//               {/* Course list table START */}
//               <div className="table-responsive-lg border-0">
//                 <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
//                   {/* Table head */}
//                   <thead>
//                     <tr>
//                       <th scope="col" className="border-0 rounded-start">Course Title</th>
//                       <th scope="col" className="border-0">Enrolled</th>
//                       <th scope="col" className="border-0">Status</th>
//                       <th scope="col" className="border-0">Price</th>
//                       <th scope="col" className="border-0 rounded-end">Action</th>
//                     </tr>
//                   </thead>
//                   {/* Table body START */}
//                   <tbody>
//                     {/* Table item */}
//                   { InstructorCourse?.map((v)=>(
//                      <tr>
//                       {/* Course item */}

                      
//                       <td>
//                         <div className="d-flex align-items-center">
//                           {/* Image */}
//                           <div className="w-100px">
//                            <Carousel indicators={false}  navButtonsAlwaysInvisible={true}>
//                             {
//                                v.course_img.map(v1 => (  <img src={v1.url} style={{width:'70px',height:'70px',objectFit:'cover'}} alt />))
//                             }
                          
//                             </Carousel>
//                           </div>
//                           <div className="mb-0">
//                             {/* Title */}
//                             <h6><a href="#">{v.name}</a></h6>
//                             {/* Info */}
//                             <div className="d-sm-flex">
//                               <p className="h6 fw-light mb-0 small me-3"><i className="fas fa-table text-orange me-2" />18 lectures</p>
//                               <p className="h6 fw-light mb-0 small"><i className="fas fa-check-circle text-success me-2" />6 Completed</p>
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       {/* Enrolled item */}
//                       <td className="text-center text-sm-start">125</td>
//                       {/* Status item */}
//                       <td>
//                         <div className="badge bg-success bg-opacity-10 text-success">Live</div>
//                       </td>
//                       {/* Price item */}
//                       <td>{v.price}</td>
//                       {/* Action item */}
//                       <td>
//                         <a href="#" className="btn btn-sm btn-success-soft btn-round me-1 mb-0"><i className="far fa-fw fa-edit" /></a>
//                         <button className="btn btn-sm btn-danger-soft btn-round mb-0"><i className="fas fa-fw fa-times" /></button>
//                       </td>
//                     </tr>))}
                    
//                     {/* Table item */}
//                     <tr>
//                       {/* Course item */}
//                       <td>
//                         <div className="d-flex align-items-center">
//                           {/* Image */}
//                           <div className="w-100px">
//                             <img src="assets/images/courses/4by3/11.jpg" className="rounded" alt />
//                           </div>
//                           <div className="mb-0 ms-2">
//                             {/* Title */}
//                             <h6><a href="#">Build Responsive Websites with HTML</a></h6>
//                             {/* Info */}
//                             <div className="d-sm-flex">
//                               <p className="h6 fw-light mb-0 small me-3"><i className="fas fa-table text-orange me-2" />42 lectures</p>
//                               <p className="h6 fw-light mb-0 small"><i className="fas fa-check-circle text-success me-2" />25 Completed</p>
//                             </div>		
//                           </div>
//                         </div>
//                       </td>
//                       {/* Enrolled item */}
//                       <td className="text-center text-sm-start">345</td>
//                       {/* Status item */}
//                       <td>
//                         <div className="badge bg-success bg-opacity-10 text-success">Live</div>
//                       </td>
//                       {/* Price item */}
//                       <td>$222</td>
//                       {/* Action item */}
//                       <td>
//                         <a href="#" className="btn btn-sm btn-success-soft btn-round me-1 mb-0"><i className="far fa-fw fa-edit" /></a>
//                         <button className="btn btn-sm btn-danger-soft btn-round mb-0"><i className="fas fa-fw fa-times" /></button>
//                       </td>
//                     </tr>
//                   </tbody>
//                   {/* Table body END */}
//                 </table>
//               </div>
//               {/* Course list table END */}
//               {/* Pagination START */}
//               <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
//                 {/* Content */}
//                 <p className="mb-0 text-center text-sm-start">Showing 1 to 8 of 20 entries</p>
//                 {/* Pagination */}
//                 <nav className="d-flex justify-content-center mb-0" aria-label="navigation">
//                   <ul className="pagination pagination-sm pagination-primary-soft mb-0 pb-0">
//                     <li className="page-item mb-0"><a className="page-link" href="#" tabIndex={-1}><i className="fas fa-angle-left" /></a></li>
//                     <li className="page-item mb-0"><a className="page-link" href="#">1</a></li>
//                     <li className="page-item mb-0 active"><a className="page-link" href="#">2</a></li>
//                     <li className="page-item mb-0"><a className="page-link" href="#">3</a></li>
//                     <li className="page-item mb-0"><a className="page-link" href="#"><i className="fas fa-angle-right" /></a></li>
//                   </ul>
//                 </nav>
//               </div>
//               {/* Pagination END */}
//             </div>
//             {/* Card body START */}
//           </div>
//           {/* Card END */}
//         </div>
//         {/* Main content END */}
//       </div>{/* Row END */}
//     </div>
//   </section>
//   {/* =======================
// Inner part END */}
// </main>

//     );
// }

// export default Instructor_Create_Course;