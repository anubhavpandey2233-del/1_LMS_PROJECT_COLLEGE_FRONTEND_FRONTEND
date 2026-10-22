import React from "react";
import { useSelector } from "react-redux";

function UserHeader(props) {
  const auth = useSelector((state) => state.auth);
  console.log("checklogin", auth?.user?.data);

  const user = auth?.user?.data;
  return (
    <div>
      <section className="pt-0">
        <div className="container-fluid px-0">
          <div
            className="card bg-blue h-100px h-md-200px rounded-0"
            style={{
              background:
                "url(assets/images/pattern/04.png) no-repeat center center",
              backgroundSize: "cover",
            }}
          ></div>
        </div>
        <div className="container mt-n4">
          <div className="row">
            <div className="col-12">
              <div className="card bg-transparent card-body pb-0 ps-0 mt-2 mt-sm-0">
                <div className="row d-sm-flex justify-sm-content-between mt-2 mt-md-0">
                  {/* Avatar */}
                  <div className="col-auto">
                    <div className="avatar avatar-xxl position-relative mt-n3">
                      <img
                        className="avatar-img rounded-circle border border-white border-3 shadow"
                        src={auth?.user?.data?.pfp[0]?.url ||"assets/images/avatar/09.jpg"}
                        alt
                      />
                      <span className="badge bg-success text-white rounded-pill position-absolute top-50 start-100 translate-middle mt-4 mt-md-5 ms-n3 px-md-3">
                        Pro
                      </span>
                    </div>
                  </div>
                  {/* Profile info */}
                  <div className="col d-sm-flex justify-content-between align-items-center">
                    <div>
                      <h1 className="my-1 fs-4">{user?.name}</h1>
                      <h6>{user?.email}</h6>
                    </div>
                    
                  </div>
                </div>
              </div>
              {/* Advanced filter responsive toggler START */}
              {/* Divider */}
              <hr className="d-xl-none" />
              <div className="col-12 col-xl-3 d-flex justify-content-between align-items-center">
                <a className="h6 mb-0 fw-bold d-xl-none" href="#">
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
              {/* Advanced filter responsive toggler END */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UserHeader;
