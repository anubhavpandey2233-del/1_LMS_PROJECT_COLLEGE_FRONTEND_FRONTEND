import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import { useSelector } from 'react-redux';
import { useGetallcourseQuery } from '../../redux/Api/Course.api';
import InstructorHeader from './components/InstructorHeader';
import InstructorSidebar from './components/InstructorSidebar';

function Instructor_Create_Course(props) {

  const { id } = useParams();
  const auth = useSelector(state => state.auth);
  
  // Fallback to the logged-in instructor's ID if no parameter is provided
  const instructorId = id || auth?.user?.data?._id;
  
  const { data } = useGetallcourseQuery();
  let courseData = data?.data;
  
  let InstructorCourse = courseData?.filter((v) => v.Instructor_id === instructorId);
  console.log(InstructorCourse);
 
  return (
    <main>
      {/* Reusable profile header banner */}
      <InstructorHeader />

      {/* Inner part START */}
      <section className="pt-0">
        <div className="container">
          <div className="row">
            
            {/* Reusable navigation sidebar */}
            <InstructorSidebar />

            {/* Main content START */}
            <div className="col-xl-9">
          {/* Card START */}
          <div className="card border rounded-3">
            {/* Card header START */}
            <div className="card-header border-bottom">
              <h3 className="mb-0">My Courses List</h3>
            </div>
            {/* Card header END */}
            {/* Card body START */}
            <div className="card-body">
              {/* Search and select START */}
              <div className="row g-3 align-items-center justify-content-between mb-4">
                {/* Search */}
                <div className="col-md-8">
                  <form className="rounded position-relative">
                    <input className="form-control pe-5 bg-transparent" type="search" placeholder="Search" aria-label="Search" />
                    <button className="btn bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y" type="submit"><i className="fas fa-search fs-6 " /></button>
                  </form>
                </div>
                {/* Select option */}
                <div className="col-md-3">
                  {/* Short by filter */}
                  <form>
                    <select className="form-select js-choice border-0 z-index-9 bg-transparent" aria-label=".form-select-sm">
                      <option value>Sort by</option>
                      <option>Free</option>
                      <option>Newest</option>
                      <option>Most popular</option>
                      <option>Most Viewed</option>
                    </select>
                  </form>
                </div>
              </div>
              {/* Search and select END */}
              {/* Course list table START */}
              <div className="table-responsive-lg border-0">
                <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                  {/* Table head */}
                  <thead>
                    <tr>
                      <th scope="col" className="border-0 rounded-start">Course Title</th>
                      <th scope="col" className="border-0">Enrolled</th>
                      <th scope="col" className="border-0">Status</th>
                      <th scope="col" className="border-0">Price</th>
                      <th scope="col" className="border-0 rounded-end">Action</th>
                    </tr>
                  </thead>
                  {/* Table body START */}
                  <tbody>
                    {/* Table item */}
                  { InstructorCourse?.map((v)=>(
                     <tr>
                      {/* Course item */}

                      
                      <td>
                        <div className="d-flex align-items-center">
                          {/* Image */}
                          <div className="w-100px">
                           <Carousel indicators={false}  navButtonsAlwaysInvisible={true}>
                            {
                               v.course_img.map(v1 => (  <img src={v1.url} style={{width:'70px',height:'70px',objectFit:'cover'}} alt />))
                            }
                          
                            </Carousel>
                          </div>
                          <div className="mb-0">
                            {/* Title */}
                            <h6><a href="#">{v.name}</a></h6>
                            {/* Info */}
                            <div className="d-sm-flex">
                              <p className="h6 fw-light mb-0 small me-3"><i className="fas fa-table text-orange me-2" />18 lectures</p>
                              <p className="h6 fw-light mb-0 small"><i className="fas fa-check-circle text-success me-2" />6 Completed</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Enrolled item */}
                      <td className="text-center text-sm-start">125</td>
                      {/* Status item */}
                      <td>
                        <div className="badge bg-success bg-opacity-10 text-success">Live</div>
                      </td>
                      {/* Price item */}
                      <td>{v.price}</td>
                      {/* Action item */}
                      <td>
                        <a href="#" className="btn btn-sm btn-success-soft btn-round me-1 mb-0"><i className="far fa-fw fa-edit" /></a>
                        <button className="btn btn-sm btn-danger-soft btn-round mb-0"><i className="fas fa-fw fa-times" /></button>
                      </td>
                    </tr>))}
                    
                    {/* Table item */}
                    <tr>
                      {/* Course item */}
                      <td>
                        <div className="d-flex align-items-center">
                          {/* Image */}
                          <div className="w-100px">
                            <img src="assets/images/courses/4by3/11.jpg" className="rounded" alt />
                          </div>
                          <div className="mb-0 ms-2">
                            {/* Title */}
                            <h6><a href="#">Build Responsive Websites with HTML</a></h6>
                            {/* Info */}
                            <div className="d-sm-flex">
                              <p className="h6 fw-light mb-0 small me-3"><i className="fas fa-table text-orange me-2" />42 lectures</p>
                              <p className="h6 fw-light mb-0 small"><i className="fas fa-check-circle text-success me-2" />25 Completed</p>
                            </div>		
                          </div>
                        </div>
                      </td>
                      {/* Enrolled item */}
                      <td className="text-center text-sm-start">345</td>
                      {/* Status item */}
                      <td>
                        <div className="badge bg-success bg-opacity-10 text-success">Live</div>
                      </td>
                      {/* Price item */}
                      <td>$222</td>
                      {/* Action item */}
                      <td>
                        <a href="#" className="btn btn-sm btn-success-soft btn-round me-1 mb-0"><i className="far fa-fw fa-edit" /></a>
                        <button className="btn btn-sm btn-danger-soft btn-round mb-0"><i className="fas fa-fw fa-times" /></button>
                      </td>
                    </tr>
                  </tbody>
                  {/* Table body END */}
                </table>
              </div>
              {/* Course list table END */}
              {/* Pagination START */}
              <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
                {/* Content */}
                <p className="mb-0 text-center text-sm-start">Showing 1 to 8 of 20 entries</p>
                {/* Pagination */}
                <nav className="d-flex justify-content-center mb-0" aria-label="navigation">
                  <ul className="pagination pagination-sm pagination-primary-soft mb-0 pb-0">
                    <li className="page-item mb-0"><a className="page-link" href="#" tabIndex={-1}><i className="fas fa-angle-left" /></a></li>
                    <li className="page-item mb-0"><a className="page-link" href="#">1</a></li>
                    <li className="page-item mb-0 active"><a className="page-link" href="#">2</a></li>
                    <li className="page-item mb-0"><a className="page-link" href="#">3</a></li>
                    <li className="page-item mb-0"><a className="page-link" href="#"><i className="fas fa-angle-right" /></a></li>
                  </ul>
                </nav>
              </div>
              {/* Pagination END */}
            </div>
            {/* Card body START */}
          </div>
          {/* Card END */}
        </div>
        {/* Main content END */}
      </div>{/* Row END */}
    </div>
  </section>
  {/* =======================
Inner part END */}
</main>

    );
}

export default Instructor_Create_Course;