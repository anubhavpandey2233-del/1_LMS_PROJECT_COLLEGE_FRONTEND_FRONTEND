import { useSelector } from "react-redux";
import useSerch from "../../Hook/useSerch";
import withReduxFeach from "../../hoc/withReduxFeach";
import { getCategory } from "../../redux/slice/CategorySlice";
import { NavLink, useParams, useNavigate } from "react-router-dom";

function Category({ category }) {
  const params = useParams();
  const navigate = useNavigate();

  let { search, setSeach, filterData } = useSerch(category, [
    "name",
    "desciption",
  ]);
  console.log(search);

  if (params._id) {
    const finaldata = filterData.filter((v) => v.parent_id === params._id);
    filterData = finaldata;
  }
  console.log("filerdata", filterData);

  const handleClick = (_id) => {
    const cat = category.some((v) => v.parent_id === _id);
    if (cat) {
      navigate(`/category/${_id}`);
    } else {
      navigate(`/course//${_id}`);
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
              <h1 className="text-white">Categories</h1>
              {/* Breadcrumb */}
              <div className="d-flex justify-content-center">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb breadcrumb-dark breadcrumb-dots mb-0">
                    <li className="breadcrumb-item">
                      <a href="#">Home</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Categories classic
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
        <div className="container px-4 px-lg-5">
          <div className="row">
            {/* Main content START */}
            <div className="col-12">
              {/* Search option START */}
              <div className="row mb-4 align-items-center">
                {/* Search bar */}
                <div className="col-xl-6">
                  <form className="bg-body shadow rounded p-2">
                    <div className="input-group input-borderless">
                      <input
                        className="form-control me-1"
                        type="search"
                        placeholder="Find your categories"
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
                <div className="col-12 col-xl-3 d-flex justify-content-end align-items-center mt-3 mt-xl-0">
                  <p className="mb-0 text-end">Showing 1-7 of 32 result</p>
                </div>
              </div>
              {/* Search option END */}
              {/* Course Grid START */}
              <div className="row g-4">
                {filterData?.map((v) => (
                  <div
                    className="col-sm-6 col-md-4 col-xl-3"
                    onClick={() => handleClick(v._id)}
                  >
                    <div className="text-decoration-none">
                      <div className="card shadow h-100">
                        {/* Image */}
                        <img
                          // key={i}
                          src={v?.category_img[0].url}
                          className="card-img-top"
                          alt="course"
                        />
                        {/* ))} */}
                        {/* Card body */}
                        <div className="card-body pb-0">
                          <div className="d-flex justify-content-between mb-2">
                            <a
                              href="#"
                              className="badge bg-purple bg-opacity-10 text-purple"
                            ></a>
                            <a href="#" className="h6 fw-light mb-0">
                              <i className="far fa-heart" />
                            </a>
                          </div>

                          <h5 className="card-title">
                            <a href="#">{v.name}</a>
                          </h5>
                        </div>
                        <div className="card-footer pt-0 pb-3">
                          <div className="d-flex justify-content-between">
                            <span className="h6 fw-light mb-0">
                              {v.desciption}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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

export default withReduxFeach(Category, getCategory, (state) => state.category);
