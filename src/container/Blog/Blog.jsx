import React, { useState } from "react";
import { useGetBlogQuery } from "../../redux/Api/blog.api";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useGettagQuery } from "../../redux/Api/tag.api";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const getMonthFromDate = (dateStr) => {
  if (!dateStr) return null;
  // Handle "DD/MM/YYYY" format from backend
  const parts = dateStr.split('/');
  if (parts && parts.length === 3) {
    const monthIndex = parseInt(parts[1], 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return monthIndex;
    }
  }
  // Fallback to standard JS Date
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.getMonth();
  }
  return null;
};

function Blog(props) {
  const param = useParams();
  const navigate = useNavigate();

  const { data: blog } = useGetBlogQuery();
  
  const { data: tag } = useGettagQuery();

  const [selectedTag, setSelectedTag] = useState([]);
  console.log("selectedtag", selectedTag);

  const [selectedMonths, setSelectedMonths] = useState([]);
  console.log("selectedMonths", selectedMonths);

  const handleTagChange = (tag) => {
    if (tag === "all") {
      setSelectedTag([]);
    } else {
      if (selectedTag.includes(tag)) {
        setSelectedTag(selectedTag.filter((id) => id !== tag));
      } else {
        setSelectedTag([...selectedTag, tag]);
      }
    }
  };

  const handleMonthChange = (month) => {
    if (month === "all") {
      setSelectedMonths([]);
    } else {
      if (selectedMonths.includes(month)) {
        setSelectedMonths(selectedMonths.filter((m) => m !== month));
      } else {
        setSelectedMonths([...selectedMonths, month]);
      }
    }
  };

  let filteredBlogs = blog?.data;

  if (selectedTag.length > 0) {
    filteredBlogs = filteredBlogs.filter((v) => selectedTag.includes(v.tag));
  } else if (param._id) {
    filteredBlogs = filteredBlogs.filter((v) => v.tag === param._id);
  }

  if (selectedMonths.length > 0) {
    filteredBlogs = filteredBlogs.filter((v) => {
      const i = getMonthFromDate(v.date);
      return i !== null && selectedMonths.includes(i);
    });
  }

  console.log(filteredBlogs);

  return (
    <div>
      <main>
        {/* =======================
Page Banner START */}
        <section className="py-5">
          <div className="container">
            <div className="row position-relative">
              {/* SVG decoration */}
              <figure className="position-absolute top-0 start-0 d-none d-sm-block">
                <svg width="22px" height="22px" viewBox="0 0 22 22">
                  <polygon
                    className="fill-purple"
                    points="22,8.3 13.7,8.3 13.7,0 8.3,0 8.3,8.3 0,8.3 0,13.7 8.3,13.7 8.3,22 13.7,22 13.7,13.7 22,13.7 "
                  />
                </svg>
              </figure>
              {/* Title and breadcrumb */}
              <div className="col-lg-10 mx-auto text-center position-relative">
                {/* SVG decoration */}
                <figure className="position-absolute top-50 end-0 translate-middle-y">
                  <svg width="27px" height="27px">
                    <path
                      className="fill-orange"
                      d="M13.122,5.946 L17.679,-0.001 L17.404,7.528 L24.661,5.946 L19.683,11.533 L26.244,15.056 L18.891,16.089 L21.686,23.068 L15.400,19.062 L13.122,26.232 L10.843,19.062 L4.557,23.068 L7.352,16.089 L-0.000,15.056 L6.561,11.533 L1.582,5.946 L8.839,7.528 L8.565,-0.001 L13.122,5.946 Z"
                    />
                  </svg>
                </figure>
                {/* Title */}
                <h1>Blog</h1>
                {/* Breadcrumb */}
                <div className="d-flex justify-content-center">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <a href="#">Home</a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Library
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
        <section className="position-relative pt-0">
          <div className="container">
            <div className="row g-4">
              {/* Main content START */}
              <div className="col-lg-8 col-xl-9">
                <div className="row g-4 filter-container overflow-hidden">
                  {/* Card item START */}
                  {filteredBlogs?.map((v) => {
                    const tagname = tag?.data?.find((v1) => v1._id === v.tag);

                    return (
                      <div
                        key={v._id}
                        className="col-sm-6 col-md-6 col-xl-4 grid-item"
                      >
                        <div className="card">
                          <div className="overflow-hidden rounded-3">
                            <img
                              src={v?.content_file[0]?.url}
                              className="card-img"
                              alt="course image"
                            />
                            {/* Overlay */}
                            <div className="bg-overlay bg-dark opacity-4" />
                            <div className="card-img-overlay d-flex align-items-start p-3">
                              {/* badge */}
                              <a
                                href="#"
                                className="badge bg-danger text-white"
                              >
                                {tagname?.tag || "Unknown"}
                              </a>
                            </div>
                          </div>
                          {/* Card body */}
                          <NavLink to={`/blog-details/${v._id}`}>
                            <div className="card-body px-3">
                              {/* Title */}
                              <h5 className="card-title">
                                <a href="#">{v.title}</a>
                              </h5>
                              <p className="text-truncate-2">{v.description}</p>
                              {/* Info */}
                              <div className="d-flex justify-content-between">
                                <h6 className="mb-0">
                                  <a href="#">{v.instructor.name}</a>
                                </h6>
                                <span className="small">{v.date}</span>
                              </div>
                            </div>
                          </NavLink>
                        </div>
                      </div>
                    );
                  })}
                  {/* Card item END */}
                </div>

                {/* Load more button START */}
                <div className="text-center mt-4">
                  <a href="#" className="btn btn-primary-soft mb-0">
                    Load more
                    <i className="fas fa-sync ms-2" />
                  </a>
                </div>
                {/* Load more button END */}
              </div>
              {/* Main content END */}

              {/* Sidebar START */}

              <div className="col-lg-4 col-xl-3 pt-5 pt-lg-0">
                {/* Tag Filter Card */}
                <div className="card card-body shadow p-4 mb-4">
                  {/* Title */}
                  <h4 className="mb-3">Tag</h4>
                  {/* Category group */}
                  <div className="col-12">
                    <ul className="list-inline mb-0">
                      {/* All Checkbox */}
                      <li className="list-inline-item mb-2">
                        <input
                          type="checkbox"
                          className="btn-check"
                          checked={selectedTag.length === 0}
                          onChange={() => (handleTagChange("all"),
                            navigate("/blog"))}
                          id="flexCheckDefaultAll"
                        />
                        <label
                          className="btn btn-light btn-primary-soft-check"
                          htmlFor="flexCheckDefaultAll"
                        >
                          All
                        </label>
                      </li>

                      {/* Dynamic Checkboxes */}
                      {tag?.data?.map((t) => {
                        const isChecked = selectedTag.includes(t._id);
                        return (
                          <li key={t._id} className="list-inline-item mb-2">
                            <input
                              type="checkbox"
                              className="btn-check"
                              checked={isChecked}
                              onChange={() => handleTagChange(t._id)}
                              id={`flexCheckDefault_${t._id}`}
                            />
                            <label
                              className="btn btn-light btn-primary-soft-check"
                              htmlFor={`flexCheckDefault_${t._id}`}
                            >
                              {t?.tag}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Month Filter Card */}
                <div className="card card-body shadow p-4 mb-4">
                  {/* Title */}
                  <h4 className="mb-3">Month</h4>
                  {/* Category group */}
                  <div className="col-12">
                    <ul className="list-inline mb-0">
                      {/* All Checkbox */}
                      <li className="list-inline-item mb-2">
                        <input
                          type="checkbox"
                          className="btn-check"
                          id="flexCheckMonthAll"
                          checked={selectedMonths.length === 0}
                          onChange={() => handleMonthChange("all")}
                        />
                        <label
                          className="btn btn-light btn-primary-soft-check"
                          htmlFor="flexCheckMonthAll"
                        >
                          All
                        </label>
                      </li>

                      {/* Dynamic Month Checkboxes */}
                      {monthNames.map((monthName, monthIdx) => {
                        const isChecked = selectedMonths.includes(monthIdx);
                        return (
                          <li key={monthIdx} className="list-inline-item mb-2">
                            <input
                              type="checkbox"
                              className="btn-check"
                              checked={isChecked}
                              onChange={() => handleMonthChange(monthIdx)}
                              id={`flexCheckMonth_${monthIdx}`}
                            />
                            <label
                              className="btn btn-light btn-primary-soft-check"
                              htmlFor={`flexCheckMonth_${monthIdx}`}
                            >
                              {monthName}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
              {/* Sidebar END */}
            </div>
          </div>
        </section>
        {/* =======================
Page content END */}
      </main>
    </div>
  );
}

export default Blog;
