import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../../redux/slice/auth.slice";
import { NavLink, useNavigate } from "react-router-dom";
import UserHeader from "./componets/UserHeader";
import UserSildeBar from "./componets/UserSildeBar";
import { useGetallcourseQuery } from "../../redux/Api/Course.api";
import { useGetenrollmentQuery } from "../../redux/Api/enrollment.api";
import { useGetAllprogessQuery } from "../../redux/Api/progess.api";
import Carousel from "react-material-ui-carousel";

function UserDashboard(props) {
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  console.log("checklogin", auth?.user?.data);

  const user = auth?.user?.data;

  const { data: course } = useGetallcourseQuery();
  const { data: enrollment } = useGetenrollmentQuery();
  const { data: progress } = useGetAllprogessQuery();

  const filterEnroll = enrollment?.data?.filter(
    (v) => v.user_id === auth?.user?.data?._id,
  );
  console.log("filter enrolll", filterEnroll);

  const purchasedCourseIds = filterEnroll?.flatMap((v) =>
    v.course.map((c) => c.course_id),
  );

  const filterCourses = course?.data?.filter((c) =>
    purchasedCourseIds?.includes(c._id),
  );
  console.log("Purchased Courses", filterCourses);

  const userProgress = filterEnroll?.flatMap((enroll) => enroll.progress);

  const completedLessons = userProgress?.reduce(
    (n, v) => n + Number(v.completedLectures),
    0,
  );

  const totalleactue = userProgress?.reduce((n,v) => n + Number(v.totalleactue),0)

  const achievedCertificates = userProgress?.filter(
    (v) => Number(v.prercentage) === 100,
  ).length;

  return (
    <div>
      <main>
        {/* =======================
Page Banner START */}
        <UserHeader />
        {/* =======================
Page Banner END */}
        {/* =======================
Page content START */}
        <section className="pt-0">
          <div className="container">
            <div className="row">
              {/* Right sidebar START */}
              <UserSildeBar />
              {/* Right sidebar END */}
              {/* Main content START */}
              <div className="col-xl-9">
                {/* Counter boxes START */}
                <div className="row mb-4">
                  {/* Counter item */}
                  <div className="col-sm-6 col-lg-4 mb-3 mb-lg-0">
                    <div className="d-flex justify-content-center align-items-center p-4 bg-orange bg-opacity-15 rounded-3">
                      <span className="display-6 lh-1 text-orange mb-0">
                        <i className="fas fa-tv fa-fw" />
                      </span>
                      <div className="ms-4">
                        <div className="d-flex">
                          <h5
                            className="purecounter mb-0 fw-bold"
                            data-purecounter-start={0}
                            data-purecounter-end={9}
                            data-purecounter-delay={200}
                          >
                            {filterCourses?.length}
                          </h5>
                        </div>
                        <p className="mb-0 h6 fw-light">Total Courses</p>
                      </div>
                    </div>
                  </div>
                  {/* Counter item */}
                  <div className="col-sm-6 col-lg-4 mb-3 mb-lg-0">
                    <div className="d-flex justify-content-center align-items-center p-4 bg-purple bg-opacity-15 rounded-3">
                      <span className="display-6 lh-1 text-purple mb-0">
                        <i className="fas fa-clipboard-check fa-fw" />
                      </span>
                      <div className="ms-4">
                        <div className="d-flex">
                          <h5
                            className="purecounter mb-0 fw-bold"
                            data-purecounter-start={0}
                            data-purecounter-end={52}
                            data-purecounter-delay={200}
                          >
                            {completedLessons}/{totalleactue}
                          </h5>
                        </div>
                        <p className="mb-0 h6 fw-light">Complete lessons</p>
                      </div>
                    </div>
                  </div>
                  {/* Counter item */}
                  <div className="col-sm-6 col-lg-4 mb-3 mb-lg-0">
                    <div className="d-flex justify-content-center align-items-center p-4 bg-success bg-opacity-10 rounded-3">
                      <span className="display-6 lh-1 text-success mb-0">
                        <i className="fas fa-medal fa-fw" />
                      </span>
                      <div className="ms-4">
                        <div className="d-flex">
                          <h5
                            className="purecounter mb-0 fw-bold"
                            data-purecounter-start={0}
                            data-purecounter-end={8}
                            data-purecounter-delay={300}
                          >
                            {achievedCertificates}
                          </h5>
                        </div>
                        <p className="mb-0 h6 fw-light">
                          Achieved Certificates
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Counter boxes END */}
                <div className="col-xl">
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
                        {/* Content */}
                        <div className="col-md-8">
                          <form className="rounded position-relative">
                            <input
                              className="form-control pe-5 bg-transparent"
                              type="search"
                              placeholder="Search"
                              aria-label="Search"
                            />
                            <button
                              className="btn bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y"
                              type="submit"
                            >
                              <i className="fas fa-search fs-6 " />
                            </button>
                          </form>
                        </div>
                      </div>
                      {/* Search and select END */}
                      {/* Course list table START */}
                      <div className="table-responsive border-0">
                        <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                          {/* Table head */}
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                className="border-0 rounded-start"
                              >
                                Course Title
                              </th>
                              <th scope="col" className="border-0">
                                Total Lectures
                              </th>
                              <th scope="col" className="border-0">
                                Completed Lecture
                              </th>
                              <th scope="col" className="border-0 rounded-end">
                                Action
                              </th>
                            </tr>
                          </thead>
                          {/* Table body START */}
                          <tbody>
                            {/* Table item */}
                            {filterCourses?.map((v) => {
                              const progess = filterEnroll?.map((p) =>
                                p.progress.find((c) => c.course_id === v._id),
                              );
                              console.log("progessss", progess[0]);

                              return (
                                <tr>
                                  {/* Table data */}
                                  <td>
                                    <div className="d-flex align-items-center">
                                      {/* Image */}
                                      <div className="w-100px">
                                        <Carousel>
                                          {v.course_img.map((i) => (
                                            <img
                                              src={i.url}
                                              className="rounded"
                                              alt
                                            />
                                          ))}
                                        </Carousel>
                                      </div>
                                      <div className="mb-0 ms-2">
                                        {/* Title */}
                                        <h6>
                                          <a href="#">{v.name}</a>
                                        </h6>
                                        {/* Info */}
                                        <div className="overflow-hidden">
                                          <h6 className="mb-0 text-end">
                                            {progess[0]?.prercentage}%
                                          </h6>
                                          {/* <div className="progress progress-sm bg-primary bg-opacity-10"> */}
                                          <div
                                            className="progress"
                                            style={{
                                              height: "10px",
                                              borderRadius: "50px",
                                              backgroundColor: "#e9ecef",
                                              overflow: "hidden",
                                            }}
                                          >
                                            <div
                                              className="progress-bar progress-bar-striped progress-bar-animated"
                                              role="progressbar"
                                              style={{
                                                width: `${progess?.[0]?.prercentage}%`,
                                              }}
                                              aria-valuenow={
                                                progess?.[0]?.prercentage || 0
                                              }
                                              aria-valuemin={0}
                                              aria-valuemax={100}
                                            />
                                          </div>
                                        </div>
                                        {/* </div> */}
                                      </div>
                                    </div>
                                  </td>
                                  {/* Table data */}
                                  <td>{progess[0]?.totalleactue}</td>
                                  {/* Table data */}
                                  <td>{progess[0]?.completedLectures}</td>
                                  {/* Table data */}
                                  <td>
                                    {progess[0]?.prercentage === 100 ? (
                                      <td>
                                        <button className="btn btn-sm btn-success me-1 mb-1 mb-x;-0 disabled">
                                          <i className="bi bi-check me-1" />
                                          Complete
                                        </button>
                                        <NavLink
                                          to={`/course-details/${v._id}`}
                                        >
                                          <a
                                            href="#"
                                            className="btn btn-sm btn-light me-1"
                                          >
                                            <i className="bi bi-arrow-repeat me-1" />
                                            Restart
                                          </a>
                                        </NavLink>
                                      </td>
                                    ) : (
                                      <NavLink to={`/course-details/${v._id}`}>
                                        <a
                                          href="#"
                                          className="btn btn-sm btn-primary-soft me-1 mb-1 mb-md-0"
                                        >
                                          <i className="bi bi-play-circle me-1" />
                                          Continue
                                        </a>
                                      </NavLink>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          {/* Table body END */}
                        </table>
                      </div>
                      {/* Course list table END */}
                      {/* Pagination START */}
                      <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
                        {/* Content */}
                        <p className="mb-0 text-center text-sm-start">
                          Showing 1 to 8 of 20 entries
                        </p>
                        {/* Pagination */}
                        <nav
                          className="d-flex justify-content-center mb-0"
                          aria-label="navigation"
                        >
                          <ul className="pagination pagination-sm pagination-primary-soft mb-0 pb-0">
                            <li className="page-item mb-0">
                              <a className="page-link" href="#" tabIndex={-1}>
                                <i className="fas fa-angle-left" />
                              </a>
                            </li>
                            <li className="page-item mb-0">
                              <a className="page-link" href="#">
                                1
                              </a>
                            </li>
                            <li className="page-item mb-0 active">
                              <a className="page-link" href="#">
                                2
                              </a>
                            </li>
                            <li className="page-item mb-0">
                              <a className="page-link" href="#">
                                3
                              </a>
                            </li>
                            <li className="page-item mb-0">
                              <a className="page-link" href="#">
                                <i className="fas fa-angle-right" />
                              </a>
                            </li>
                          </ul>
                        </nav>
                      </div>
                      {/* Pagination END */}
                    </div>
                    {/* Card body START */}
                  </div>
                </div>
                {/* Main content END */}
              </div>
              {/* Row END */}
            </div>
          </div>
        </section>
        {/* =======================
Page content END */}
      </main>
    </div>
  );
}

export default UserDashboard;
