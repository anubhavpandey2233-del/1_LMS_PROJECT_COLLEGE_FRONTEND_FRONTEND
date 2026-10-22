import React from "react";
import { useGetallcourseQuery } from "../../redux/Api/Course.api";
import useSerch from "../../Hook/useSerch";
import Carousel from "react-material-ui-carousel";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddWhistlistMutation,
  useDeleteWhistlistMutation,
  useGetWhistlistQuery,
  useUpdateWhistlistMutation,
} from "../../redux/Api/wishlist.api";
import { useSelector } from "react-redux";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function Course(props) {
  const auth = useSelector((state) => state.auth);
  console.log("checklogin", auth?.user?.data);

  const categoryState = useSelector((state) => state.category);
  const categories = categoryState?.category || [];

  const { data, error, isLoading } = useGetallcourseQuery();
  console.log(data?.data);

  const navigate = useNavigate();

  const { search, setSeach, filterData } = useSerch(data?.data, [
    "name",
    "desciption",
  ]);
  console.log(search);

  const params = useParams();

  let course;
  if (params._id) {
    course = filterData.filter((v) => v.categories_id === params._id);
  } else {
    course = filterData;
  }

  console.log("courseeeeee", course);

  const handlecilck = (_id) => {
    navigate(`/course-details/${_id}`);
  };

  const { data: whistlist } = useGetWhistlistQuery();
  console.log(whistlist?.data);

  const [addWhistlist] = useAddWhistlistMutation();
  const [updateWhitlist] = useUpdateWhistlistMutation();

  const handlewhistlist = async (course_id) => {
    let whistlistUser = whistlist?.data?.find(
      (v) => v?.user_id === auth?.user?.data?._id,
    );

    let existData = whistlistUser?.items?.find((v) => v.course === course_id);
    console.log(existData);

    if (existData) {
      let deletdata = whistlistUser?.items.filter(
        (v) => v._id !== existData._id,
      );
      console.log(deletdata);

      await updateWhitlist({
        _id: whistlistUser._id,
        user_id: auth?.user?.data?._id,
        items: deletdata,
      });

      return;
    }

    const ItemsData = [...(whistlistUser?.items || [])];

    ItemsData.push({
      course: course_id,
    });

    console.log(ItemsData);

    //if user alredy exist obly
    if (whistlistUser) {
      await updateWhitlist({
        _id: whistlistUser._id,
        user_id: auth?.user?.data?._id,
        items: ItemsData,
      });
    } else {
      await addWhistlist({
        user_id: auth?.user?.data?._id,
        items: ItemsData,
      });
    }
  };

  return (
    <main>
      {/* =======================
Page Banner START */}
      <section
        className="bg-blue align-items-center d-flex"
        style={{
          background:
            "url(assets/images/pattern/04.png) no-repeat center center",
          backgroundSize: "cover",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              {/* Title */}
              <h1 className="text-white">Course Grid Classic</h1>
              {/* Breadcrumb */}
              <div className="d-flex justify-content-center">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb breadcrumb-dark breadcrumb-dots mb-0">
                    <li className="breadcrumb-item">
                      <a href="#">Home</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Courses classic
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* =======================
Page Banner END */}
      {/* =======================
Page content START */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            {/* Main content START */}
            <div className="col-lg-8 col-xl-9">
              {/* Search option START */}
              <div className="row mb-4 align-items-center">
                {/* Search bar */}
                <div className="col-xl-6">
                  <form className="bg-body shadow rounded p-2">
                    <div className="input-group input-borderless">
                      <input
                        className="form-control me-1"
                        type="search"
                        placeholder="Find your course"
                        onChange={(e) => setSeach(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-primary mb-0 rounded z-index-1"
                      >
                        <i className="fas fa-search" />
                      </button>
                    </div>
                  </form>
                </div>
                {/* Select option */}
                <div className="col-xl-3 mt-3 mt-xl-0">
                  <form className="bg-body shadow rounded p-2 input-borderless">
                    <select
                      className="form-select form-select-sm js-choice border-0"
                      aria-label=".form-select-sm"
                    >
                      <option value>Most Viewed</option>
                      <option>Recently search</option>
                      <option>Most popular</option>
                      <option>Top rated</option>
                    </select>
                  </form>
                </div>
                {/* Content */}
                <div className="col-12 col-xl-3 d-flex justify-content-between align-items-center mt-3 mt-xl-0">
                  {/* Advanced filter responsive toggler START */}
                  <button
                    className="btn btn-primary mb-0 d-lg-none"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasNavbar"
                    aria-controls="offcanvasNavbar"
                  >
                    <i className="fas fa-sliders-h me-1" /> Show filter
                  </button>
                  {/* Advanced filter responsive toggler END */}
                  <p className="mb-0 text-end">Showing 1-7 of 32 result</p>
                </div>
              </div>
              {/* Search option END */}
              {/* Course Grid START */}
              <div className="row g-4">
                {course?.map((v) => {
                  let whistlistUser = whistlist?.data?.find(
                    (v) => v.user_id === auth?.user?.data?._id,
                  );

                  let existData = whistlistUser?.items?.some(
                    (v2) => v2.course === v._id,
                  );
                  console.log(existData);

                  const imgUrl = v.course_img?.[0]?.url || "assets/images/courses/4by3/08.jpg";
                  const catObj = categories.find((c) => c._id === v.categories_id);
                  const catName = catObj ? catObj.name : "";

                  return (
                    <div key={v._id} className="col-sm-6 col-md-6 col-xl-4">
                      <div
                        className="card action-trigger-hover border-0 shadow-sm rounded-3 overflow-hidden h-100 position-relative cursor-pointer"
                        onClick={() => handlecilck(v._id)}
                      >
                        {/* Image overlay block */}
                        <div className="position-relative overflow-hidden" style={{ height: "200px" }}>
                          <img
                            src={imgUrl}
                            className="card-img-top w-100 h-100 object-fit-cover"
                            alt={v.name}
                            style={{ transition: "transform 0.4s ease" }}
                          />
                          {/* Category Badge overlay */}
                          {catName && (
                            <span className="badge bg-primary bg-opacity-10 text-primary position-absolute top-0 start-0 m-3 z-index-2">
                              {catName}
                            </span>
                          )}
                          {/* Wishlist Button Overlay */}
                          <button
                            className="btn btn-sm btn-white shadow rounded-circle position-absolute top-0 end-0 m-3 z-index-2 d-flex align-items-center justify-content-center"
                            style={{ width: "34px", height: "34px", border: "none" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlewhistlist(v._id);
                            }}
                          >
                            {existData ? (
                              <FavoriteIcon className="text-danger" style={{ fontSize: "18px" }} />
                            ) : (
                              <FavoriteBorderIcon className="text-muted" style={{ fontSize: "18px" }} />
                            )}
                          </button>
                        </div>

                        {/* Card body */}
                        <div className="card-body p-4 d-flex flex-column justify-content-between">
                          <div>
                            {/* Title */}
                            <h5 className="card-title fw-semibold text-dark hover-primary mb-2 line-clamp-2">
                              {v.name}
                            </h5>

                            {/* Description */}
                            <p className="card-text text-muted mb-3 line-clamp-2 small">
                              {v.description || v.desciption}
                            </p>

                            {/* Rating */}
                            <div className="d-flex align-items-center mb-3">
                              <ul className="list-inline mb-0 me-2 small">
                                <li className="list-inline-item me-0"><i className="fas fa-star text-warning" /></li>
                                <li className="list-inline-item me-0"><i className="fas fa-star text-warning" /></li>
                                <li className="list-inline-item me-0"><i className="fas fa-star text-warning" /></li>
                                <li className="list-inline-item me-0"><i className="fas fa-star text-warning" /></li>
                                <li className="list-inline-item me-0"><i className="far fa-star text-warning" /></li>
                              </ul>
                              <span className="small text-muted fw-light">(4.0)</span>
                            </div>
                          </div>

                          {/* Footer */}
                          <div>
                            <hr className="my-2 opacity-1" />
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="hstack gap-3 text-muted small">
                                <span>
                                  <i className="far fa-clock text-danger me-1" />
                                  {v.duration || "12h 56m"}
                                </span>
                                <span>
                                  <i className="fas fa-table text-orange me-1" />
                                  15 lectures
                                </span>
                              </div>
                              <span className="h6 text-success mb-0 fw-bold">
                                {v.fees === 0 || !v.fees ? "Free" : `$${v.fees}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Course Grid END */}
              {/* Pagination START */}
              <div className="col-12">
                <nav
                  className="mt-4 d-flex justify-content-center"
                  aria-label="navigation"
                >
                  <ul className="pagination pagination-primary-soft rounded mb-0">
                    <li className="page-item mb-0">
                      <a className="page-link" href="#" tabIndex={-1}>
                        <i className="fas fa-angle-double-left" />
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
                        ..
                      </a>
                    </li>
                    <li className="page-item mb-0">
                      <a className="page-link" href="#">
                        6
                      </a>
                    </li>
                    <li className="page-item mb-0">
                      <a className="page-link" href="#">
                        <i className="fas fa-angle-double-right" />
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
              {/* Pagination END */}
            </div>
            {/* Main content END */}
            {/* Right sidebar START */}
            <div className="col-lg-4 col-xl-3 pt-5 pt-lg-0">
              {/* Responsive offcanvas body START */}
              <nav className="navbar navbar-light navbar-expand-lg mx-0">
                <div
                  className="offcanvas offcanvas-end"
                  tabIndex={-1}
                  id="offcanvasNavbar"
                  aria-labelledby="offcanvasNavbarLabel"
                >
                  <div className="offcanvas-header bg-light">
                    <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                      Advance Filter
                    </h5>
                    <button
                      type="button"
                      className="btn-close text-reset"
                      data-bs-dismiss="offcanvas"
                      aria-label="Close"
                    />
                  </div>
                  <div className="offcanvas-body p-3 p-lg-0">
                    <form>
                      {/* Category START */}
                      <div className="card card-body shadow p-4 mb-4">
                        {/* Title */}
                        <h4 className="mb-3">Category</h4>
                        {/* Category group */}
                        <div className="col-12">
                          {/* Checkbox */}
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="flexCheckDefault9"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault9"
                              >
                                All
                              </label>
                            </div>
                            <span className="small">(1256)</span>
                          </div>
                          {/* Checkbox */}
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="flexCheckDefault10"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault10"
                              >
                                Development
                              </label>
                            </div>
                            <span className="small">(365)</span>
                          </div>
                          {/* Checkbox */}
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="flexCheckDefault11"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault11"
                              >
                                Design
                              </label>
                            </div>
                            <span className="small">(156)</span>
                          </div>
                          {/* Checkbox */}
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="flexCheckDefault12"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault12"
                              >
                                Accounting
                              </label>
                            </div>
                            <span className="small">(65)</span>
                          </div>
                          {/* Checkbox */}
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="flexCheckDefault17"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault17"
                              >
                                Translation
                              </label>
                            </div>
                            <span className="small">(245)</span>
                          </div>
                          {/* Checkbox */}
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="flexCheckDefault13"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault13"
                              >
                                Finance
                              </label>
                            </div>
                            <span className="small">(184)</span>
                          </div>
                          {/* Checkbox */}
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="flexCheckDefault14"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault14"
                              >
                                Legal
                              </label>
                            </div>
                            <span className="small">(65)</span>
                          </div>
                          {/* Checkbox */}
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="flexCheckDefault15"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault15"
                              >
                                Photography
                              </label>
                            </div>
                            <span className="small">(99)</span>
                          </div>
                          {/* Collapse body */}
                          <div
                            className="collapse multi-collapse"
                            id="multiCollapseExample1"
                          >
                            <div className="card card-body p-0">
                              {/* Checkbox */}
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    defaultValue
                                    id="flexCheckDefault16"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault16"
                                  >
                                    Writing
                                  </label>
                                </div>
                                <span className="small">(178)</span>
                              </div>
                              {/* Checkbox */}
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    defaultValue
                                    id="flexCheckDefault18"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault18"
                                  >
                                    Marketing
                                  </label>
                                </div>
                                <span className="small">(104)</span>
                              </div>
                            </div>
                          </div>
                          {/* Collapse button */}
                          <a
                            className=" p-0 mb-0 mt-2 btn-more d-flex align-items-center"
                            data-bs-toggle="collapse"
                            href="#multiCollapseExample1"
                            role="button"
                            aria-expanded="false"
                            aria-controls="multiCollapseExample1"
                          >
                            See <span className="see-more ms-1">more</span>
                            <span className="see-less ms-1">less</span>
                            <i className="fas fa-angle-down ms-2" />
                          </a>
                        </div>
                      </div>
                      {/* Category END */}
                      {/* Price START */}
                      <div className="card card-body shadow p-4 mb-4">
                        {/* Title */}
                        <h4 className="mb-3">Price Level</h4>
                        <ul className="list-inline mb-0">
                          {/* Rent */}
                          <li className="list-inline-item">
                            <input
                              type="radio"
                              className="btn-check"
                              name="options"
                              id="option1"
                            />
                            <label
                              className="btn btn-light btn-primary-soft-check"
                              htmlFor="option1"
                            >
                              All
                            </label>
                          </li>
                          {/* Sale */}
                          <li className="list-inline-item">
                            <input
                              type="radio"
                              className="btn-check"
                              name="options"
                              id="option2"
                            />
                            <label
                              className="btn btn-light btn-primary-soft-check"
                              htmlFor="option2"
                            >
                              Free
                            </label>
                          </li>
                          {/* Buy */}
                          <li className="list-inline-item">
                            <input
                              type="radio"
                              className="btn-check"
                              name="options"
                              id="option3"
                            />
                            <label
                              className="btn btn-light btn-primary-soft-check"
                              htmlFor="option3"
                            >
                              Paid
                            </label>
                          </li>
                        </ul>
                      </div>
                      {/* Price END */}
                      {/* Skill level START */}
                      <div className="card card-body shadow p-4 mb-4">
                        {/* Title */}
                        <h4 className="mb-3">Skill level</h4>
                        <ul className="list-inline mb-0">
                          {/* Item */}
                          <li className="list-inline-item mb-2">
                            <input
                              type="checkbox"
                              className="btn-check"
                              id="btn-check-12"
                            />
                            <label
                              className="btn btn-light btn-primary-soft-check"
                              htmlFor="btn-check-12"
                            >
                              All levels
                            </label>
                          </li>
                          {/* Item */}
                          <li className="list-inline-item mb-2">
                            <input
                              type="checkbox"
                              className="btn-check"
                              id="btn-check-9"
                            />
                            <label
                              className="btn btn-light btn-primary-soft-check"
                              htmlFor="btn-check-9"
                            >
                              Beginner
                            </label>
                          </li>
                          {/* Item */}
                          <li className="list-inline-item mb-2">
                            <input
                              type="checkbox"
                              className="btn-check"
                              id="btn-check-10"
                            />
                            <label
                              className="btn btn-light btn-primary-soft-check"
                              htmlFor="btn-check-10"
                            >
                              Intermediate
                            </label>
                          </li>
                          {/* Item */}
                          <li className="list-inline-item mb-2">
                            <input
                              type="checkbox"
                              className="btn-check"
                              id="btn-check-11"
                            />
                            <label
                              className="btn btn-light btn-primary-soft-check"
                              htmlFor="btn-check-11"
                            >
                              Advanced
                            </label>
                          </li>
                        </ul>
                      </div>
                      {/* Skill level END */}
                      {/* Language START */}
                      <div className="card card-body shadow p-4 mb-4">
                        {/* Title */}
                        <h4 className="mb-3">Language</h4>
                        <ul className="list-inline mb-0 g-3">
                          {/* Item */}
                          <li className="list-inline-item mb-2">
                            <input
                              type="checkbox"
                              className="btn-check"
                              id="btn-check-2"
                            />
                            <label
                              className="btn btn-light btn-primary-soft-check"
                              htmlFor="btn-check-2"
                            >
                              English
                            </label>
                          </li>
                          {/* Item */}
                          <li className="list-inline-item mb-2">
                            <input
                              type="checkbox"
                              className="btn-check"
                              id="btn-check-3"
                            />
                            <label
                              className="btn btn-light btn-primary-soft-check"
                              htmlFor="btn-check-3"
                            >
                              Francas
                            </label>
                          </li>
                          {/* Item */}
                          <li className="list-inline-item mb-2">
                            <input
                              type="checkbox"
                              className="btn-check"
                              id="btn-check-4"
                            />
                            <label
                              className="btn btn-light btn-primary-soft-check"
                              htmlFor="btn-check-4"
                            >
                              Hindi
                            </label>
                          </li>
                          {/* Item */}
                          <li className="list-inline-item mb-2">
                            <input
                              type="checkbox"
                              className="btn-check"
                              id="btn-check-5"
                            />
                            <label
                              className="btn btn-light btn-primary-soft-check"
                              htmlFor="btn-check-5"
                            >
                              Russian
                            </label>
                          </li>
                          {/* Item */}
                          <li className="list-inline-item mb-2">
                            <input
                              type="checkbox"
                              className="btn-check"
                              id="btn-check-6"
                            />
                            <label
                              className="btn btn-light btn-primary-soft-check"
                              htmlFor="btn-check-6"
                            >
                              Spanish
                            </label>
                          </li>
                          {/* Item */}
                          <li className="list-inline-item mb-2">
                            <input
                              type="checkbox"
                              className="btn-check"
                              id="btn-check-7"
                            />
                            <label
                              className="btn btn-light btn-primary-soft-check"
                              htmlFor="btn-check-7"
                            >
                              Bengali
                            </label>
                          </li>
                          {/* Item */}
                          <li className="list-inline-item mb-2">
                            <input
                              type="checkbox"
                              className="btn-check"
                              id="btn-check-8"
                            />
                            <label
                              className="btn btn-light btn-primary-soft-check"
                              htmlFor="btn-check-8"
                            >
                              Portuguese
                            </label>
                          </li>
                        </ul>
                      </div>
                      {/* Language END */}
                    </form>
                    {/* Form End */}
                  </div>
                  {/* Button */}
                  <div className="d-grid p-2 p-lg-0 text-center">
                    <button className="btn btn-primary mb-0">
                      Filter Results
                    </button>
                  </div>
                </div>
              </nav>
              {/* Responsive offcanvas body END */}
            </div>
            {/* Right sidebar END */}
          </div>
          {/* Row END */}
        </div>
      </section>
      {/* =======================
Page content END */}
      {/* =======================
Newsletter START */}
      <section className="pt-0">
        <div className="container position-relative overflow-hidden">
          {/* SVG decoration */}
          <figure className="position-absolute top-50 start-50 translate-middle ms-3">
            <svg>
              <path
                d="m496 22.999c0 10.493-8.506 18.999-18.999 18.999s-19-8.506-19-18.999 8.507-18.999 19-18.999 18.999 8.506 18.999 18.999z"
                fill="#fff"
                fillRule="evenodd"
                opacity=".502"
              />
              <path
                d="m775 102.5c0 5.799-4.701 10.5-10.5 10.5-5.798 0-10.499-4.701-10.499-10.5 0-5.798 4.701-10.499 10.499-10.499 5.799 0 10.5 4.701 10.5 10.499z"
                fill="#fff"
                fillRule="evenodd"
                opacity=".102"
              />
              <path
                d="m192 102c0 6.626-5.373 11.999-12 11.999s-11.999-5.373-11.999-11.999c0-6.628 5.372-12 11.999-12s12 5.372 12 12z"
                fill="#fff"
                fillRule="evenodd"
                opacity=".2"
              />
              <path
                d="m20.499 10.25c0 5.66-4.589 10.249-10.25 10.249-5.66 0-10.249-4.589-10.249-10.249-0-5.661 4.589-10.25 10.249-10.25 5.661-0 10.25 4.589 10.25 10.25z"
                fill="#fff"
                fillRule="evenodd"
                opacity=".2"
              />
            </svg>
          </figure>
          {/* Svg decoration */}
          <figure className="position-absolute bottom-0 end-0 mb-5 d-none d-sm-block">
            <svg
              className="rotate-130"
              width="258.7px"
              height="86.9px"
              viewBox="0 0 258.7 86.9"
            >
              <path
                stroke="white"
                fill="none"
                strokeWidth={2}
                d="M0,7.2c16,0,16,25.5,31.9,25.5c16,0,16-25.5,31.9-25.5c16,0,16,25.5,31.9,25.5c16,0,16-25.5,31.9-25.5 c16,0,16,25.5,31.9,25.5c16,0,16-25.5,31.9-25.5c16,0,16,25.5,31.9,25.5s16-25.5,31.9-25.5"
              />
              <path
                stroke="white"
                fill="none"
                strokeWidth={2}
                d="M0,57c16,0,16,25.5,31.9,25.5c16,0,16-25.5,31.9-25.5c16,0,16,25.5,31.9,25.5c16,0,16-25.5,31.9-25.5 c16,0,16,25.5,31.9,25.5c16,0,16-25.5,31.9-25.5c16,0,16,25.5,31.9,25.5s16-25.5,31.9-25.5"
              />
            </svg>
          </figure>
          <div className="bg-grad-pink p-3 p-sm-5 rounded-3">
            <div className="row justify-content-center position-relative">
              {/* SVG decoration */}
              <figure className="fill-white opacity-1 position-absolute top-50 start-0 translate-middle-y">
                <svg width="141px" height="141px">
                  <path d="M140.520,70.258 C140.520,109.064 109.062,140.519 70.258,140.519 C31.454,140.519 -0.004,109.064 -0.004,70.258 C-0.004,31.455 31.454,-0.003 70.258,-0.003 C109.062,-0.003 140.520,31.455 140.520,70.258 Z" />
                </svg>
              </figure>
              {/* Newsletter */}
              <div className="col-12 position-relative my-2 my-sm-3">
                <div className="row align-items-center">
                  {/* Title */}
                  <div className="col-lg-6">
                    <h3 className="text-white mb-3 mb-lg-0">
                      Are you ready for a more great Conversation?
                    </h3>
                  </div>
                  {/* Input item */}
                  <div className="col-lg-6 text-lg-end">
                    <form className="bg-body rounded p-2">
                      <div className="input-group">
                        <input
                          className="form-control border-0 me-1"
                          type="email"
                          placeholder="Type your email here"
                        />
                        <button
                          type="button"
                          className="btn btn-dark mb-0 rounded"
                        >
                          Subscribe
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* Row END */}
          </div>
        </div>
      </section>
      {/* =======================
Newsletter END */}
    </main>
  );
}
export default Course;
