import React, { useState } from "react";
import {
  useGetcartQuery,
  useUpdatecartMutation,
} from "../../redux/Api/Cart.api";
import { useSelector } from "react-redux";
import { useGetallcourseQuery } from "../../redux/Api/Course.api";
import Carousel from "react-material-ui-carousel";
import {
  useAddCoupanMutation,
  useGetCoupanQuery,
  useUpdateCoupanMutation,
} from "../../redux/Api/coupan.api";
import Alert from "../../components/Alert/Alert";
import { useCreateOrderMutation, useGetpaymentQuery, useVerifyPaymentMutation } from "../../redux/Api/payment.api";

function Cart() {
  const [coupans, setCoupan] = useState();
  const [discount, setDiscount] = useState();
  const [discountAmount, setDiscountAmount] = useState();

  const { data: cart } = useGetcartQuery();
  const [updatecart] = useUpdatecartMutation();

  const { data: courses } = useGetallcourseQuery();

  const auth = useSelector((state) => state.auth);
  console.log("checklogin", auth?.user?.data);

  const cartdata = cart?.data?.find(
    (v) => v?.user_id === auth?.user?.data?._id && v?.status === "pending",
  );
  console.log("cartfinaldata", cartdata);

  const handledelete = (_id) => {
    console.log("iddddd", _id);

    const deletecart = cartdata?.items?.filter((v) => v._id !== _id);
    console.log("delereetee", deletecart);

    updatecart({
      _id: cartdata._id,
      user_id: auth?.user?.data?._id,
      items: deletecart,
    });
  };

  const totalcost = cartdata?.items?.reduce(
    (acc, v) => acc + Number(v.price),
    0,
  );
  console.log("total price", totalcost);

  const { data: coupan } = useGetCoupanQuery();
  console.log("coupan data", coupan?.data);

  const [updateCoupan] = useUpdateCoupanMutation();

  const handelcoupan = () => {
    console.log("coupannnn", coupans);

    const coupandiscount = coupan?.data?.find((v) => v.code === coupans);
    console.log("couspuasdakfcbykdufc ", coupandiscount);

    setDiscount(coupandiscount);

    const discountamount = coupandiscount?.discount;
    console.log("amicachdai", discountamount);

    setDiscountAmount(discountamount);
  };
  const price = (totalcost * discountAmount) / 100;
  console.log("prwfbcbh12222", price);
  const finalamount = totalcost - price;


  const { data : payment } = useGetpaymentQuery();
  const paymentdata = payment?.data?.find((v)=> v?.cart_id === cartdata?._id);
  console.log("payment final", paymentdata);

  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const handlecheckout = async () => {
    if (discount?.limit > discount?.use) {
      updateCoupan({
        _id: discount._id,
        use: discount.use + 1,
      });
    } else {
      console.log("Invalid Coupan Code");
    }

    const response = await createOrder({
      amount: finalamount || totalcost,
      cart_id: cartdata._id,
      user_id: auth?.user?.data?._id,
    });

    const order = await response?.data?.Order;

    
    // Open Razorpay Checkout
    const options = {
      key: response?.data?.key, // Replace with your Razorpay key_id
      amount: order?.amount, // Amount is in currency subunits.
      currency: order?.currency,
      name: "ELEVATE KNOWLEDGE",
      description: "Test Transaction",
      order_id: order?.id, // This is the order_id created in the backend
      prefill: {
        name: "Harsh Depani",
        email: "harshdepani2509@gmail.com",
        contact: "9601894287",
      },
      handler: async function (responce) {
        console.log("po111111111111111", responce);
        await verifyPayment(responce);
      }, 
      theme: {
        color: "#F37254",
      },
    };
    
    const rzp = new window.Razorpay(options);
    console.log("ertyuiytrewertyu", window.Razorpay, options);
    
    rzp.open();
    
    await updatecart({...cartdata, status:"compelet"})
    
    console.log("po111111111111111", order, response, options);
  };

  return (
    <main>
      {/* =======================
Page Banner START */}
      <section className="py-0">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="bg-light p-4 text-center rounded-3">
                <h1 className="m-0">My cart</h1>
                {/* Breadcrumb */}
                <div className="d-flex justify-content-center">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-dots mb-0">
                      <li className="breadcrumb-item">
                        <a href="#">Home</a>
                      </li>
                      <li className="breadcrumb-item">
                        <a href="#">Courses</a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Cart
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* =======================
Page Banner END */}
      {/* =======================
Page content START */}
      <section className="pt-5">
        <div className="container">
          <div className="row g-4 g-sm-5">
            {/* Main content START */}
            <div className="col-lg-8 mb-4 mb-sm-0">
              <div className="card card-body p-4 shadow">
                {/* Alert */}
                <div
                  className="alert alert-danger alert-dismissible d-flex justify-content-between align-items-center fade show py-3 pe-2"
                  role="alert"
                >
                  <div>
                    <span className="fs-5 me-1">🔥</span>
                    These courses are at a limited discount, please checkout
                    within
                    <strong className="text-danger ms-1">
                      2 days and 18 hours
                    </strong>
                  </div>
                  <button
                    type="button"
                    className="btn btn-link mb-0 text-end"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  >
                    <i className="bi bi-x-lg text-dark" />
                  </button>
                </div>
                <div className="table-responsive border-0 rounded-3">
                  {/* Table START */}
                  <table className="table align-middle p-4 mb-0">
                    {/* Table head */}
                    {/* Table body START */}

                    <>
                      {" "}
                      <tbody className="border-top-0">
                        {/* Table item */}
                        {cartdata?.items?.map((v) => {
                          console.log("vvvvvvvv", v);

                          const couresdata = courses?.data?.filter(
                            (c) => c._id === v.course_id,
                          );
                          console.log("couressssssss", couresdata);

                          return couresdata?.map((cart) => {
                            console.log("carttttttttt", cart);

                            return (
                              <tr>
                                {/* Course item */}
                                <td>
                                  <div className="d-lg-flex align-items-center">
                                    {/* Image */}
                                    <div className="w-100px w-md-80px mb-2 mb-md-0">
                                      {
                                        <Carousel>
                                          {cart.course_img.map((i) => (
                                            <img
                                              src={i?.url}
                                              className="rounded"
                                            />
                                          ))}
                                        </Carousel>
                                      }
                                    </div>
                                    {/* Title */}
                                    <h6 className="mb-0 ms-lg-3 mt-2 mt-lg-0">
                                      <a href="#">{cart.desciption}</a>
                                    </h6>
                                  </div>
                                </td>
                                {/* Amount item */}
                                <td>
                                  <h5 className="text-success mb-0">
                                    {cart.fees}
                                  </h5>
                                </td>
                                {/* Action item */}
                                <td>
                                  <button
                                    className="btn btn-sm btn-danger-soft px-2 mb-0"
                                    onClick={() => handledelete(v._id)}
                                  >
                                    <i className="fas fa-fw fa-times" />
                                  </button>
                                </td>
                              </tr>
                            );
                          });
                        })}
                      </tbody>
                    </>
                  </table>
                </div>
                {/* Coupon input and button */}
                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <div className="input-group">
                      <input
                        className="form-control form-control "
                        placeholder="COUPON CODE"
                        onChange={(e) => setCoupan(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handelcoupan()}
                      >
                        Apply coupon
                      </button>
                    </div>
                  </div>
                  {/* Update button */}
                  <div className="col-md-6 text-md-end">
                    <button className="btn btn-primary mb-0">
                      Update cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Main content END */}
            {/* Right sidebar START */}
            <div className="col-lg-4">
              {/* Card total START */}
              <div className="card card-body p-4 shadow">
                {/* Title */}
                <h4 className="mb-3">Cart Total</h4>
                {/* Price and detail */}
                <ul className="list-group list-group-borderless mb-2">
                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span className="h6 fw-light mb-0">Original Price</span>
                    <span className="h6 fw-light mb-0 fw-bold">
                      ${totalcost}
                    </span>
                  </li>
                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span className="h6 fw-light mb-0">Coupon Discount</span>
                    <span className="text-danger">-${price || 0}</span>
                  </li>
                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span className="h5 mb-0">Total</span>
                    <span className="h5 mb-0">${finalamount || totalcost}</span>
                  </li>
                </ul>
                {/* Button */}
                <div className="d-grid">
                  <a
                    // href="checkout.html"
                    className="btn btn-lg btn-success"
                    onClick={() => handlecheckout()}
                  >
                    Proceed to Checkout
                  </a>
                </div>
                {/* Content */}
                <p className="small mb-0 mt-2 text-center">
                  By completing your purchase, you agree to these{" "}
                  <a href="#">
                    <strong>Terms of Service</strong>
                  </a>
                </p>
              </div>
              {/* Card total END */}
            </div>
            {/* Right sidebar END */}
          </div>
          {/* Row END */}
        </div>
      </section>
      {/* =======================
Page content END */}
    </main>
  );
}

export default Cart;
