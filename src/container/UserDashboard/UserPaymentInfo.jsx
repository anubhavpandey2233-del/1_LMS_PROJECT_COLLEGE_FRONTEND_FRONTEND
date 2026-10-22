import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../../redux/slice/auth.slice";
import { NavLink } from "react-router-dom";
import { useGetpaymentQuery } from "../../redux/Api/payment.api";
import { useGetallcourseQuery } from "../../redux/Api/Course.api";
import { useGetcartQuery } from "../../redux/Api/Cart.api";
import UserHeader from "./componets/UserHeader";
import UserSildeBar from "./componets/UserSildeBar";

function UserPaymentInfo(props) {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  console.log("checklogin", auth?.user?.data);

  const user = auth?.user?.data;

  const { data: payment } = useGetpaymentQuery();
  const { data: course } = useGetallcourseQuery();
  const { data: cart } = useGetcartQuery();

  const filterPayment = payment?.data?.filter(
    (item) => item?.user_id === user?._id,
  );

  const filterCart = cart?.data?.filter((cartItem) =>
    filterPayment?.some((paymentItem) => paymentItem?.cart_id === cartItem?._id),
  );

  const filterCourses = course?.data?.filter((courseItem) =>
    filterCart?.some((cartItem) =>
      cartItem?.items?.some((item) => item?.course_id === courseItem?._id),
    ),
  );

  console.log("payments:", filterPayment);
  console.log("carts:", filterCart);
  console.log("courses:", filterCourses);

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
                {/* Billing history START */}
                <div className="card border rounded-3">
                  {/* Card header START */}
                  <div className="card-header border-bottom">
                    <h3 className="mb-0">Billing history</h3>
                  </div>
                  {/* Card header END */}
                  {/* Card body START */}
                  <div className="card-body">
                    {/* Title and select START */}
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
                    {/* Title and select END */}
                    {/* Student list table START */}
                    <div className="table-responsive border-0">
                      <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                        {/* Table head */}
                        <thead>
                          <tr>
                            <th scope="col" className="border-0 rounded-start">
                              Date
                            </th>
                            <th scope="col" className="border-0">
                              Course name
                            </th>
                            <th scope="col" className="border-0">
                              Payment method
                            </th>
                            <th scope="col" className="border-0">
                              Status
                            </th>
                            <th scope="col" className="border-0">
                              Total
                            </th>
                            
                          </tr>
                        </thead>
                        {/* Table body */}
                        <tbody>
                          {!payment || !cart || !course ? (
                            <tr>
                              <td colSpan={6} className="text-center py-4 border-0">
                                Loading billing history...
                              </td>
                            </tr>
                          ) : filterPayment.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="text-center py-4">
                                No billing history found.
                              </td>
                            </tr>
                          ) : (
                            filterPayment.map((item, index) => {
                              const paymentCart = filterCart.find(
                                (cartItem) => cartItem?._id === item?.cart_id,
                              );

                              const cartCourses = filterCourses.filter(
                                (courseItem) =>
                                  paymentCart?.items?.some(
                                    (cartItem) =>
                                      cartItem?.course_id === courseItem?._id,
                                  ),
                              );

                              const status = item?.status ?? "Pending";
                              const normalizedStatus = status.toLowerCase();

                              const statusClass =
                                normalizedStatus === "paid"
                                  ? "bg-success text-success"
                                  : ["cancel", "cancelled"].includes(
                                        normalizedStatus,
                                      )
                                    ? "bg-danger text-danger"
                                    : "bg-warning text-warning";

                              return (
                                <tr key={item?._id ?? index}>
                                  <td>
                                    {item?.createdAt
                                      ? new Date(
                                          item.createdAt,
                                        ).toLocaleDateString()
                                      : "-"}
                                  </td>

                                  <td>
                                    {cartCourses.length > 0
                                      ? cartCourses.map((courseItem) => (
                                          <h6
                                            key={courseItem?._id}
                                            className="mb-1"
                                          >
                                            {courseItem?.title ??
                                              courseItem?.name ??
                                              "Course unavailable"}
                                          </h6>
                                        ))
                                      : "Course unavailable"}
                                  </td>

                                  <td>
                                    {item?.payment_method ??
                                      item?.paymentMethod ??
                                      "Online payment"}
                                  </td>

                                  <td>
                                    <span
                                      className={`badge bg-opacity-10 ${statusClass}`}
                                    >
                                      {status}
                                    </span>
                                  </td>

                                  <td>
                                    $
                                    {item?.total_amount ??
                                      item?.amount ??
                                      item?.total ??
                                      0}
                                  </td>

                                  
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                    {/* Student list table END */}
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
                {/* Billing history END */}
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

export default UserPaymentInfo;
