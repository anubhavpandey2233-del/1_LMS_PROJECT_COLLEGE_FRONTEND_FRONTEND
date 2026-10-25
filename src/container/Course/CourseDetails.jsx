
import React, { useState } from "react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useGetallcourseQuery } from "../../redux/Api/Course.api";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useGetAllSectionQuery } from "../../redux/Api/Section.api";
import { useGetcontentQuery } from "../../redux/Api/Content.api";
import {
  useAddcartMutation,
  useGetcartQuery,
  useUpdatecartMutation,
} from "../../redux/Api/Cart.api";
import { useSelector } from "react-redux";
import Carousel from "react-material-ui-carousel";
import { useGetpaymentQuery } from "../../redux/Api/payment.api";
import {
  useAddprogessMutation,
  useGetAllprogessQuery,
  useUpdateprogessMutation,
} from "../../redux/Api/progess.api";
import {
  useAddenrollmentMutation,
  useGetenrollmentQuery,
  useUpdateenrollmentMutation,
} from "../../redux/Api/enrollment.api";
import { duration } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import Checkbox from "@mui/material/Checkbox";
import { useAddgenerateCertificateMutation } from "../../redux/Api/certificate.api";
import {
  useAddreviewMutation,
  useGetAllreviewQuery,
  useUpdatereviewMutation,
} from "../../redux/Api/review.api";
import { useFormik } from "formik";

function CourseDetails(props) {
  const [rating, setRating] = useState();
  const params = useParams();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const { data, isLoading } = useGetallcourseQuery();
  const { data: section } = useGetAllSectionQuery();
  const { data: content } = useGetcontentQuery();

  console.log("URL ID:", params._id);
  console.log("Sections:", section?.data);
  console.log("Content:", content?.data);

  console.log("checklogin", auth?.user?.data);

  const filerdata = data?.data?.find(
    (v) => String(v._id) === String(params._id)
  );
  console.log("course data", filerdata);

  const sectiondata =
    section?.data?.filter(
      (v) =>
        String(v.course_id?._id ?? v.course_id) === String(params._id)
    ) || [];

  console.log("Filtered sections:", sectiondata);

  const { data: Cart } = useGetcartQuery();
  console.log("cart", Cart?.data);

  const [addcart] = useAddcartMutation();
  const [updatecart] = useUpdatecartMutation();

  const handlecart = (product) => {
    const userId = auth?.user?.data?._id;

    if (!userId || !product?._id) return;

    const pendingCart = Cart?.data?.find(
      (cart) =>
        String(cart?.user_id?._id ?? cart?.user_id) === String(userId) &&
        cart?.status === "pending"
    );

    const newItem = {
      course_id: product._id,
      price: product?.fees,
    };

    const productExist = pendingCart?.items?.some(
      (item) =>
        String(item?.course_id?._id ?? item?.course_id) ===
        String(product._id)
    );

    if (productExist) {
      console.log("Already In Cart");
      return;
    }

    if (pendingCart) {
      updatecart({
        _id: pendingCart._id,
        user_id: userId,
        status: "pending",
        items: [...(pendingCart.items || []), newItem],
      });
    } else {
      addcart({
        user_id: userId,
        status: "pending",
        items: [newItem],
      });
    }
  };

  const { data: payment } = useGetpaymentQuery();
  console.log("payment", payment?.data);

  const PaymentUser = (payment?.data || []).filter(
    (item) =>
      String(item?.user_id?._id ?? item?.user_id) ===
      String(auth?.user?.data?._id)
  );

  const purCart = (Cart?.data || []).find((cart) =>
    PaymentUser.some(
      (paymentItem) =>
        String(paymentItem?.cart_id?._id ?? paymentItem?.cart_id) ===
          String(cart?._id) &&
        paymentItem?.status === "completed"
    )
  );

  const Pay_Course = Boolean(
    purCart?.items?.some(
      (item) =>
        String(item?.course_id?._id ?? item?.course_id) ===
        String(params._id)
    )
  );

  const { data: progress } = useGetAllprogessQuery();
  console.log("Progress:", progress?.data);

  const findProgress = progress?.data?.find(
    (v) => String(v.content_id?._id ?? v.content_id) === String(params._id)
  );
  console.log("Found progress:", findProgress);

  const [addProgress] = useAddprogessMutation();
  const [updateProgress] = useUpdateprogessMutation();

  const { data: enrollment } = useGetenrollmentQuery();
  console.log("Enrollment:", enrollment?.data);

  const [updateEnroll] = useUpdateenrollmentMutation();

  const Enroll_USER = enrollment?.data?.find(
    (v) =>
      String(v?.user_id?._id ?? v?.user_id) ===
      String(auth?.user?.data?._id)
  );

  const Enroll_id = Enroll_USER?._id;

  const sortedSections = [...sectiondata].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  const orderedLectures = [];

  sortedSections.forEach((sec) => {
    const secLectures =
      content?.data?.filter(
        (c) =>
          String(c.section_id?._id ?? c.section_id) === String(sec._id)
      ) || [];

    const sortedSecLectures = [...secLectures].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    orderedLectures.push(...sortedSecLectures);
  });

  const totalLecturesCount = orderedLectures.length;

  const lecturesWithCompletion = orderedLectures.map((cn) => {
    const file = cn.content_file?.[0];

    const isCompleted = progress?.data?.find(
      (p) =>
        (
          String(p.content_id?._id ?? p.content_id) === String(cn._id) ||
          (file?._id &&
            String(p.content_id?._id ?? p.content_id) === String(file._id))
        ) &&
        String(p.enrollment_id?._id ?? p.enrollment_id) ===
          String(Enroll_id)
    );

    return {
      ...cn,
      complete: isCompleted?.is_completed || false,
    };
  });

  const completedLecturesCount = lecturesWithCompletion.filter(
    (l) => l.complete
  ).length;

  const courseProgressPercentage =
    totalLecturesCount > 0
      ? Math.round(
          (completedLecturesCount / totalLecturesCount) * 100
        )
      : 0;

  const firstIncompleteLecture = lecturesWithCompletion.find(
    (l) => !l.complete
  );

  const firstIncompleteLectureId = firstIncompleteLecture?._id;
  const firstLectureId = lecturesWithCompletion[0]?._id;

  const [videoDur, setvideoTotalDuration] = useState({});

  const enrollmentProgress = Array.isArray(Enroll_USER?.progress)
    ? Enroll_USER.progress
    : [];

  const existingProgressIndex = enrollmentProgress.findIndex(
    (p) => String(p?.course_id?._id ?? p?.course_id) === String(filerdata?._id)
  );

  let updatedProgress = [];


  if (existingProgressIndex !== -1) {
    updatedProgress = enrollmentProgress.map((p, index) => {
      if (index === existingProgressIndex) {
        return {
          ...p,
          percentage: courseProgressPercentage,
          totalLecture: totalLecturesCount,
          completedLectures: completedLecturesCount,
        };
      }

      return p;
    });
  } else {
    updatedProgress = [
      ...enrollmentProgress,
      {
        course_id: filerdata?._id,
        percentage: courseProgressPercentage,
        totalLecture: totalLecturesCount,
        completedLectures: completedLecturesCount,
      },
    ];
  }

  const onTimeUpdate = async (e, id) => {
    const duration = e.target.duration;
    const currentTime = localStorage.getItem(id);
    console.log("duration:", duration);
    console.log("currentTime:", currentTime);

    const percentage = (currentTime / duration) * 100;

    console.log(percentage);

    setvideoTotalDuration((prev) => ({
      ...prev,
      [id]: duration,
    }));

    await updateEnroll({
      _id: Enroll_USER?._id,
      progress: updatedProgress,
    });
  };

  console.log(videoDur);

  const [addcertificate] = useAddgenerateCertificateMutation();

  const genratecertificate = async () => {
    const certificate = await addcertificate({
      course: filerdata?._id,
      user: auth?.user?.data?._id,
      grade: "A+",
      issue_date: Date.now(),
    }).unwrap();

    window.location.href = certificate.data;
  };

  const { data: review } = useGetAllreviewQuery();
  const [addreview] = useAddreviewMutation();
  const [updatereview] = useUpdatereviewMutation();

  const isUserreview = review?.data?.some(
    (v) => v?.user?._id === auth?.user?.data?._id,
  );
  console.log(isUserreview);

  const coursereview = review?.data?.filter((v) => v.course === params._id);
  // console.log(coursereview);

  let avarageRating =
    coursereview?.reduce((acc, v, i) => acc + v.rating, 0) /
    coursereview?.length;
  // console.log(avarageRating);

  const formik = useFormik({
    initialValues: {
      description: "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(values);

      let course_id = data?.data?.find((v) => v?._id === params._id);

      await addreview({
        user: auth?.user?.data?._id,
        description: values.description,
        course: course_id._id,
        rating: rating,
      });
    },
  });

  const handleEditReview = (val) => {
    console.log(val);
  };

  let filterReview = review?.data?.filter((v) => v.course === params._id);
  console.log(filterReview);

  let totalStars = 5;

  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    formik;
  if (isLoading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <main>
      {/* =======================
Page intro START */}
      <section className="bg-light py-4 py-sm-5 mt-4">
        <div className="container">
          <div className="row align-items-center">
            {/* Title and Description */}
            <div className="col-lg-7 mb-4 mb-lg-0">
              {/* Badge */}
              <h6 className="mb-3 font-base bg-primary text-white py-2 px-4 rounded-2 d-inline-block">
                {filerdata?.name}
              </h6>
              {/* Title */}
              <h1 className="mb-3">{filerdata?.desciption}</h1>
              <p className="mb-4">
                Satisfied conveying a dependent contented he gentleman agreeable
                do be. Warrant private blushes removed an in equally totally if.
                Delivered dejection necessary objection do Mr prevailed. Mr
                feeling does chiefly cordial in do.
              </p>
              {/* Content */}
              <ul className="list-inline mb-0">
                <li className="list-inline-item h6 me-3 mb-1 mb-sm-0">
                  <i className="fas fa-star text-warning me-2" />
                  4.5/5.0
                </li>
                <li className="list-inline-item h6 me-3 mb-1 mb-sm-0">
                  <i className="fas fa-user-graduate text-orange me-2" />
                  12k Enrolled
                </li>
                <li className="list-inline-item h6 me-3 mb-1 mb-sm-0">
                  <i className="fas fa-signal text-success me-2" />
                  All levels
                </li>
                <li className="list-inline-item h6 me-3 mb-1 mb-sm-0">
                  <i className="bi bi-patch-exclamation-fill text-danger me-2" />
                  Last updated 09/2021
                </li>
                <li className="list-inline-item h6 mb-0">
                  <i className="fas fa-globe text-info me-2" />
                  English
                </li>
              </ul>
            </div>

            {/* Image Carousel */}
            <div className="col-lg-5">
              {filerdata?.course_img && filerdata.course_img.length > 0 && (
                <Swiper
                  modules={[Autoplay, Scrollbar, A11y]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  className="rounded-3 shadow-sm overflow-hidden"
                >
                  {filerdata.course_img.map((v, i) => (
                    <SwiperSlide key={i}>
                      <div style={{ width: "100%", height: "350px" }}>
                        <img
                          src={v?.url}
                          alt="course"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* =======================
Page intro END */}
      {/* =======================
Page content START */}
      <section className="pb-0 py-lg-5">
        <div className="container">
          <div className="row">
            {/* Main content START */}
            <div className="col-lg-8">
              <div className="bg-body shadow rounded-2 p-4">
                {/* Tabs START */}
                <ul
                  className="nav nav-pills nav-tabs-line pt-0"
                  id="course-pills-tab"
                  role="tablist"
                >
                  {/* Tab item */}
                  <li className="nav-item me-2 me-sm-4" role="presentation">
                    <button
                      className="nav-link mb-2 mb-md-0 active"
                      id="course-pills-tab-1"
                      data-bs-toggle="pill"
                      data-bs-target="#course-pills-1"
                      type="button"
                      role="tab"
                      aria-controls="course-pills-1"
                      aria-selected="true"
                    >
                      Overview
                    </button>
                  </li>
                  {/* Tab item */}
                  <li className="nav-item me-2 me-sm-4" role="presentation">
                    <button
                      className="nav-link mb-2 mb-md-0"
                      id="course-pills-tab-2"
                      data-bs-toggle="pill"
                      data-bs-target="#course-pills-2"
                      type="button"
                      role="tab"
                      aria-controls="course-pills-2"
                      aria-selected="false"
                    >
                      Curriculum
                    </button>
                  </li>
                  {/* Tab item */}
                  <li className="nav-item me-2 me-sm-4" role="presentation">
                    <button
                      className="nav-link mb-2 mb-md-0"
                      id="course-pills-tab-3"
                      data-bs-toggle="pill"
                      data-bs-target="#course-pills-3"
                      type="button"
                      role="tab"
                      aria-controls="course-pills-3"
                      aria-selected="false"
                    >
                      Instructor
                    </button>
                  </li>
                  {/* Tab item */}
                  <li className="nav-item me-2 me-sm-4" role="presentation">
                    <button
                      className="nav-link mb-2 mb-md-0"
                      id="course-pills-tab-4"
                      data-bs-toggle="pill"
                      data-bs-target="#course-pills-4"
                      type="button"
                      role="tab"
                      aria-controls="course-pills-4"
                      aria-selected="false"
                    >
                      Reviews
                    </button>
                  </li>
                  {/* Tab item */}
                  <li className="nav-item me-2 me-sm-4" role="presentation">
                    <button
                      className="nav-link mb-2 mb-md-0"
                      id="course-pills-tab-5"
                      data-bs-toggle="pill"
                      data-bs-target="#course-pills-5"
                      type="button"
                      role="tab"
                      aria-controls="course-pills-5"
                      aria-selected="false"
                    >
                      FAQs{" "}
                    </button>
                  </li>
                </ul>
                <hr />
                {/* Tabs END */}
                {/* Tab contents START */}
                <div className="tab-content pt-2" id="course-pills-tabContent">
                  {/* Content START */}
                  <div
                    className="tab-pane fade show active"
                    id="course-pills-1"
                    role="tabpanel"
                    aria-labelledby="course-pills-tab-1"
                  >
                    {/* Course detail START */}
                    <h5 className="mb-3">Course Description</h5>
                    <p className="mb-3">
                      Welcome to the{" "}
                      <strong>
                        {" "}
                        Digital Marketing Ultimate Course Bundle - 12 Courses in
                        1 (Over 36 hours of content)
                      </strong>
                    </p>
                    <p className="mb-3">
                      In this practical hands-on training, you’re going to learn
                      to become a digital marketing expert with this{" "}
                      <strong>
                        {" "}
                        ultimate course bundle that includes 12 digital
                        marketing courses in 1!
                      </strong>
                    </p>
                    <p className="mb-3">
                      If you wish to find out the skills that should be covered
                      in a basic digital marketing course syllabus in India or
                      anywhere around the world, then reading this blog will
                      help. Before we delve into the advanced{" "}
                      <strong>
                        <a
                          href="#"
                          className="text-reset text-decoration-underline"
                        >
                          digital marketing course
                        </a>
                      </strong>{" "}
                      syllabus, let’s look at the scope of digital marketing and
                      what the future holds.
                    </p>
                    <p className="mb-0">
                      We focus a great deal on the understanding of behavioral
                      psychology and influence triggers which are crucial for
                      becoming a well rounded Digital Marketer. We understand
                      that theory is important to build a solid foundation, we
                      understand that theory alone isn’t going to get the job
                      done so that’s why this course is packed with practical
                      hands-on examples that you can follow step by step.
                    </p>
                    {/* List content */}
                    <h5 className="mt-4">What you’ll learn</h5>
                    <ul className="list-group list-group-borderless mb-3">
                      <li className="list-group-item h6 fw-light d-flex mb-0">
                        <i className="fas fa-check-circle text-success me-2" />
                        Digital marketing course introduction
                      </li>
                      <li className="list-group-item h6 fw-light d-flex mb-0">
                        <i className="fas fa-check-circle text-success me-2" />
                        Customer Life cycle
                      </li>
                      <li className="list-group-item h6 fw-light d-flex mb-0">
                        <i className="fas fa-check-circle text-success me-2" />
                        What is Search engine optimization(SEO)
                      </li>
                      <li className="list-group-item h6 fw-light d-flex mb-0">
                        <i className="fas fa-check-circle text-success me-2" />
                        Facebook ADS
                      </li>
                      <li className="list-group-item h6 fw-light d-flex mb-0">
                        <i className="fas fa-check-circle text-success me-2" />
                        Facebook Messenger Chatbot
                      </li>
                      <li className="list-group-item h6 fw-light d-flex mb-0">
                        <i className="fas fa-check-circle text-success me-2" />
                        Search engine optimization tools
                      </li>
                      <li className="list-group-item h6 fw-light d-flex mb-0">
                        <i className="fas fa-check-circle text-success me-2" />
                        Why SEO
                      </li>
                      <li className="list-group-item h6 fw-light d-flex mb-0">
                        <i className="fas fa-check-circle text-success me-2" />
                        URL Structure
                      </li>
                      <li className="list-group-item h6 fw-light d-flex mb-0">
                        <i className="fas fa-check-circle text-success me-2" />
                        Featured Snippet
                      </li>
                      <li className="list-group-item h6 fw-light d-flex mb-0">
                        <i className="fas fa-check-circle text-success me-2" />
                        SEO tips and tricks
                      </li>
                      <li className="list-group-item h6 fw-light d-flex mb-0">
                        <i className="fas fa-check-circle text-success me-2" />
                        Google tag manager
                      </li>
                    </ul>
                    <p className="mb-0">
                      As it so contrasted oh estimating instrument. Size like
                      body someone had. Are conduct viewing boy minutes warrant
                      the expense? Tolerably behavior may admit daughters
                      offending her ask own. Praise effect wishes change way and
                      any wanted. Lively use looked latter regard had. Do he it
                      part more last in.{" "}
                    </p>
                    {/* Course detail END */}
                  </div>
                  {/* Content END */}
                  {/* Content START */}
                  <div
                    className="tab-pane fade"
                    id="course-pills-2"
                    role="tabpanel"
                    aria-labelledby="course-pills-tab-2"
                  >
                    {/* Course accordion START */}
                    <div
                      className="accordion accordion-icon accordion-bg-light"
                      id="accordionExample2"
                    >
                      {/* Item */}
                      {sectiondata?.map((v, i) => {
                        const contentdata = content?.data?.filter(
                          (c) => c.section_id === v._id,
                        );
                        console.log("content final data", contentdata);

                        let Match_Con = content?.data?.filter(
                          (v1) => v1.Section_id === v._id,
                        );
                        console.log(Match_Con);

                        const sort = Match_Con?.sort(
                          (a, b) => a.order - b.order,
                        );
                        console.log(sort);

                        const totalContents = sort?.length;
                        console.log(totalContents);

                        const sectionProgress = progress?.data?.filter(
                          (p) =>
                            p.enrollment_id === Enroll_id &&
                            sort?.some((c) => c._id === p.content_id),
                        );
                        console.log(sectionProgress);

                        const completedContents = sectionProgress?.length || 0;
                        const percentage =
                          totalContents > 0
                            ? (
                              (completedContents / totalContents) *
                              100
                            ).toFixed(2)
                            : 0;
                        console.log(percentage);

                        return (
                          <div className="accordion-item mb-3">
                            <h6
                              className="accordion-header font-base"
                              id={"heading-" + i}
                            >
                              <button
                                className="accordion-button fw-bold rounded d-sm-flex d-inline-block collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={"#collapse-" + i}
                                aria-expanded="true"
                                aria-controls={"collapse-" + i}
                              >
                                {v.name}
                                <span className="small ms-0 ms-sm-2">
                                  (3 Lectures)
                                </span>
                              </button>
                            </h6>
                            <div
                              id={"collapse-" + i}
                              className="accordion-collapse collapse show"
                              aria-labelledby={"heading-" + i}
                              data-bs-parent="#accordionExample2"
                            >
                              <div className="accordion-body mt-3">
                                {/* Course lecture */}
                                {contentdata?.map((cn) => {
                                  console.log("cbbbbnnnnnnnnnnnnnnnnn", cn._id);

                                  const file = cn.content_file?.[0];
                                  console.log(file);
                                  console.log("type:", file?.type);

                                  const isCompleted = progress?.data?.find(
                                    (p) =>
                                      (p.content_id === cn._id ||
                                        p.content_id === file._id) &&
                                      p.enrollment_id === Enroll_id,
                                  );
                                  console.log(
                                    "123456789",
                                    isCompleted,
                                    cn._id,
                                    Enroll_id,
                                  );
                                  const complete = isCompleted?.is_completed;
                                  console.log("comp", complete);

                                  return (
                                    <>
                                      {file?.type === "video" ? (
                                        <video
                                          // ref={vRef}
                                          style={{ display: "none" }}
                                          onLoadedMetadata={(e) =>
                                            onTimeUpdate(e, cn._id)
                                          }
                                          src={file.url}
                                        ></video>
                                      ) : (
                                        ""
                                      )}
                                      <div className="d-flex justify-content-between align-items-center">
                                        <NavLink to={`/course-video-player/${cn._id}`}>
                                          <div>
                                            <span className="btn">
                                              <i className="fas fa-play me-0" />
                                            </span>
                                            <span>...</span>
                                          </div>
                                        </NavLink>
                                        {
                                          cn.type === "free" || Pay_Course ? (
                                            <div className="d-flex align-items-center">
                                              <NavLink
                                                style={{
                                                  backgroundColor: "blue",
                                                  color: "white",
                                                  borderRadius: "5px",
                                                  padding: "5px",
                                                }}
                                                to={`/course-video-player/${cn._id}`}
                                              >
                                                Preview
                                              </NavLink>
                                            </div>
                                          ) : (
                                            <button
                                              style={{
                                                backgroundColor: "red",
                                                borderRadius: "5px",
                                              }}
                                            >
                                              Locked
                                            </button>
                                          )
                                          // )
                                        }
                                        <p className="mb-0">
                                          {videoDur[cn._id]
                                            ? `${Math.floor(videoDur[cn._id] / 60)}
                                                  :${Math.floor(
                                              videoDur[cn._id] % 60,
                                            )
                                              .toString()
                                              .padStart(2, "0")}`
                                            : ""}
                                        </p>
                                      </div>
                                      <hr />
                                    </>
                                  );
                                })}
                                {/* Divider */}
                                {/* Course lecture */}
                                <div className="d-flex justify-content-between align-items-center">
                                  <NavLink to={`/quiz/${v._id}`}>
                                    <div className="position-relative d-flex align-items-center">
                                      <span
                                        className="btn btn-danger-soft btn-round btn-sm mb-0 stretched-link position-static"
                                      >
                                        <i className="fas fa-play me-0" />
                                      </span>
                                      <span className="d-inline-block text-truncate ms-2 mb-0 h6 fw-light w-100px w-sm-200px w-md-400px">
                                        Quiz
                                      </span>
                                    </div>
                                  </NavLink>
                                </div>
                                <hr /> {/* Divider */}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Course accordion END */}
                  </div>
                  {/* Content END */}
                  {/* Content START */}
                  <div
                    className="tab-pane fade"
                    id="course-pills-3"
                    role="tabpanel"
                    aria-labelledby="course-pills-tab-3"
                  >
                    {/* Card START */}
                    <div className="card mb-0 mb-md-4">
                      <div className="row g-0 align-items-center">
                        <div className="col-md-5">
                          {/* Image */}
                          <img
                            src="assets/images/instructor/01.jpg"
                            className="img-fluid rounded-3"
                            alt="instructor-image"
                          />
                        </div>
                        <div className="col-md-7">
                          {/* Card body */}
                          <div className="card-body">
                            {/* Title */}
                            <h3 className="card-title mb-0">Louis Ferguson</h3>
                            <p className="mb-2">Instructor of Marketing</p>
                            {/* Social button */}
                            <ul className="list-inline mb-3">
                              <li className="list-inline-item me-3">
                                <a href="#" className="fs-5 text-twitter">
                                  <i className="fab fa-twitter-square" />
                                </a>
                              </li>
                              <li className="list-inline-item me-3">
                                <a href="#" className="fs-5 text-instagram">
                                  <i className="fab fa-instagram-square" />
                                </a>
                              </li>
                              <li className="list-inline-item me-3">
                                <a href="#" className="fs-5 text-facebook">
                                  <i className="fab fa-facebook-square" />
                                </a>
                              </li>
                              <li className="list-inline-item me-3">
                                <a href="#" className="fs-5 text-linkedin">
                                  <i className="fab fa-linkedin" />
                                </a>
                              </li>
                              <li className="list-inline-item">
                                <a href="#" className="fs-5 text-youtube">
                                  <i className="fab fa-youtube-square" />
                                </a>
                              </li>
                            </ul>
                            {/* Info */}
                            <ul className="list-inline">
                              <li className="list-inline-item">
                                <div className="d-flex align-items-center me-3 mb-2">
                                  <span className="icon-md bg-orange bg-opacity-10 text-orange rounded-circle">
                                    <i className="fas fa-user-graduate" />
                                  </span>
                                  <span className="h6 fw-light mb-0 ms-2">
                                    9.1k
                                  </span>
                                </div>
                              </li>
                              <li className="list-inline-item">
                                <div className="d-flex align-items-center me-3 mb-2">
                                  <span className="icon-md bg-warning bg-opacity-15 text-warning rounded-circle">
                                    <i className="fas fa-star" />
                                  </span>
                                  <span className="h6 fw-light mb-0 ms-2">
                                    4.5
                                  </span>
                                </div>
                              </li>
                              <li className="list-inline-item">
                                <div className="d-flex align-items-center me-3 mb-2">
                                  <span className="icon-md bg-danger bg-opacity-10 text-danger rounded-circle">
                                    <i className="fas fa-play" />
                                  </span>
                                  <span className="h6 fw-light mb-0 ms-2">
                                    29 Courses
                                  </span>
                                </div>
                              </li>
                              <li className="list-inline-item">
                                <div className="d-flex align-items-center me-3 mb-2">
                                  <span className="icon-md bg-info bg-opacity-10 text-info rounded-circle">
                                    <i className="fas fa-comment-dots" />
                                  </span>
                                  <span className="h6 fw-light mb-0 ms-2">
                                    205
                                  </span>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Card END */}
                    {/* Instructor info */}
                    <h5 className="mb-3">About Instructor</h5>
                    <p className="mb-3">
                      Fulfilled direction use continual set him propriety
                      continued. Saw met applauded favorite deficient engrossed
                      concealed and her. Concluded boy perpetual old supposing.
                      Farther related bed and passage comfort civilly.
                      Dashboards see frankness objection abilities. As hastened
                      oh produced prospect formerly up am. Placing forming nay
                      looking old married few has. Margaret disposed of add
                      screened rendered six say his striking confined.{" "}
                    </p>
                    <p className="mb-3">
                      As it so contrasted oh estimating instrument. Size like
                      body someone had. Are conduct viewing boy minutes warrant
                      the expense? Tolerably behavior may admit daughters
                      offending her ask own. Praise effect wishes change way and
                      any wanted.
                    </p>
                    {/* Email address */}
                    <div className="col-12">
                      <ul className="list-group list-group-borderless mb-0">
                        <li className="list-group-item pb-0">
                          Mail ID:
                          <a href="#" className="ms-2">
                            hello@email.com
                          </a>
                        </li>
                        <li className="list-group-item pb-0">
                          Web:
                          <a href="#" className="ms-2">
                            https://eduport.com
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Content END */}
                  {/* Content START */}
                  <div
                    className="tab-pane fade"
                    id="course-pills-4"
                    role="tabpanel"
                    aria-labelledby="course-pills-tab-4"
                  >
                    {/* Review START */}
                    <div className="row mb-4">
                      <h5 className="mb-4">Our Student Reviews</h5>
                      {/* Rating info */}
                      <div className="col-md-4 mb-3 mb-md-0">
                        <div className="text-center">
                          {/* Info */}
                          <h2 className="mb-0">
                            {avarageRating ? avarageRating : 0}
                          </h2>
                          {/* Star */}
                          <div className="d-sm-flex mt-1 mt-md-0 align-items-center mx-6">
                            {[...Array(totalStars)].map((_, index) => {
                              return (
                                <ul className="list-inline mb-0">
                                  <i
                                    key={index}
                                    className={
                                      index < avarageRating
                                        ? "fas fa-star text-warning"
                                        : "far fa-star text-warning"
                                    }
                                  />
                                </ul>
                              );
                            })}
                          </div>
                          <p className="mb-0">(Based on Course review)</p>
                        </div>
                      </div>
                      {/* Progress-bar and star */}
                      <div className="col-md-8">
                        <div className="row align-items-center">
                          {/* Progress bar and Rating */}
                          <div className="col-6 col-sm-8">
                            {/* Progress item */}
                            <div className="progress progress-sm bg-warning bg-opacity-15">
                              <div
                                className="progress-bar bg-warning"
                                role="progressbar"
                                style={{ width: "100%" }}
                                aria-valuenow={100}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              />
                            </div>
                          </div>
                          <div className="col-6 col-sm-4">
                            {/* Star item */}
                            <ul className="list-inline mb-0">
                              <li className="list-inline-item me-0 small">
                                <i className="fas fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="fas fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="fas fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="fas fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="fas fa-star text-warning" />
                              </li>
                            </ul>
                          </div>
                          {/* Progress bar and Rating */}
                          <div className="col-6 col-sm-8">
                            {/* Progress item */}
                            <div className="progress progress-sm bg-warning bg-opacity-15">
                              <div
                                className="progress-bar bg-warning"
                                role="progressbar"
                                style={{ width: "80%" }}
                                aria-valuenow={80}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              />
                            </div>
                          </div>
                          <div className="col-6 col-sm-4">
                            {/* Star item */}
                            <ul className="list-inline mb-0">
                              <li className="list-inline-item me-0 small">
                                <i className="fas fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="fas fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="fas fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="fas fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="far fa-star text-warning" />
                              </li>
                            </ul>
                          </div>
                          {/* Progress bar and Rating */}
                          <div className="col-6 col-sm-8">
                            {/* Progress item */}
                            <div className="progress progress-sm bg-warning bg-opacity-15">
                              <div
                                className="progress-bar bg-warning"
                                role="progressbar"
                                style={{ width: "60%" }}
                                aria-valuenow={60}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              />
                            </div>
                          </div>
                          <div className="col-6 col-sm-4">
                            {/* Star item */}
                            <ul className="list-inline mb-0">
                              <li className="list-inline-item me-0 small">
                                <i className="fas fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="fas fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="fas fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="far fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="far fa-star text-warning" />
                              </li>
                            </ul>
                          </div>
                          {/* Progress bar and Rating */}
                          <div className="col-6 col-sm-8">
                            {/* Progress item */}
                            <div className="progress progress-sm bg-warning bg-opacity-15">
                              <div
                                className="progress-bar bg-warning"
                                role="progressbar"
                                style={{ width: "40%" }}
                                aria-valuenow={40}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              />
                            </div>
                          </div>
                          <div className="col-6 col-sm-4">
                            {/* Star item */}
                            <ul className="list-inline mb-0">
                              <li className="list-inline-item me-0 small">
                                <i className="fas fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="fas fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="far fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="far fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="far fa-star text-warning" />
                              </li>
                            </ul>
                          </div>
                          {/* Progress bar and Rating */}
                          <div className="col-6 col-sm-8">
                            {/* Progress item */}
                            <div className="progress progress-sm bg-warning bg-opacity-15">
                              <div
                                className="progress-bar bg-warning"
                                role="progressbar"
                                style={{ width: "20%" }}
                                aria-valuenow={20}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              />
                            </div>
                          </div>
                          <div className="col-6 col-sm-4">
                            {/* Star item */}
                            <ul className="list-inline mb-0">
                              <li className="list-inline-item me-0 small">
                                <i className="fas fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="far fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="far fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="far fa-star text-warning" />
                              </li>
                              <li className="list-inline-item me-0 small">
                                <i className="far fa-star text-warning" />
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Review END */}
                    {/* Student review START */}

                    {/* Student review END */}
                    {/* Leave Review START */}
                    {filterReview?.map((v) => {
                      const isMyReview = auth?.user?.data?._id === v?.user?._id;
                      return (
                        <div className="d-md-flex my-4">
                          {/* Avatar */}
                          <div className="avatar avatar-xl me-4 flex-shrink-0">
                            <img
                              className="avatar-img rounded-circle"
                              src="../assets/images/avatar/09.jpg"
                              alt="avatar"
                            />
                          </div>
                          {/* Text */}
                          <div>
                            <div className="d-sm-flex mt-1 mt-md-0 align-items-center">
                              <h5 className="me-3 mb-0">{v?.user?.name}</h5>
                              {/* Review star */}

                              {[...Array(totalStars)].map((_, index) => {
                                return (
                                  <ul className="list-inline mb-0">
                                    <i
                                      key={index}
                                      className={
                                        index < v.rating
                                          ? "fas fa-star text-warning"
                                          : "far fa-star text-warning"
                                      }
                                    />
                                  </ul>
                                );
                              })}
                              {/* <ul className="list-inline mb-0">
                                  <li className="list-inline-item me-0"><i className="fas fa-star text-warning" /></li>
                                  <li className="list-inline-item me-0"><i className="fas fa-star text-warning" /></li>
                                  <li className="list-inline-item me-0"><i className="fas fa-star text-warning" /></li>
                                  <li className="list-inline-item me-0"><i className="fas fa-star text-warning" /></li>
                                  <li className="list-inline-item me-0"><i className="far fa-star text-warning" /></li>
                                </ul> */}
                            </div>
                            {/* Info */}
                            <p className="small mb-2">2 days ago</p>
                            <p className="mb-2">{v.description}.</p>
                            {/* Like and dislike button */}
                            {/* {isMyReview && (
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleEditReview(v)}
                                  >
                                    Edit Review
                                  </button>


                                </div>
                              )} */}
                          </div>
                        </div>
                      );
                    })}
                    {isUserreview ? (
                      ""
                    ) : (
                      <div className="mt-2">
                        <h5 className="mb-4">Leave a Review For This Course</h5>
                        <div>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              onClick={() => setRating(star)}
                              style={{ cursor: "pointer", margin: "4px 42px" }}
                            >
                              <i
                                className={
                                  rating >= star
                                    ? "fas fa-star text-warning"
                                    : "far fa-star text-warning"
                                }
                                style={{
                                  fontSize: "40px",
                                  marginTop: "10px",
                                  marginBottom: "20px",
                                }}
                              />
                            </span>
                          ))}
                        </div>
                        {/* review */}
                        {rating ? (
                          <form className="row g-3" onSubmit={handleSubmit}>
                            {/* Name */}
                            {/* <div className="col-md-6 bg-light-input">
                          <input
                            type="text"
                            name='name'
                            className="form-control"
                            id="inputtext" placeholder="Name"
                            aria-label="First name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.name}
                          />
                        </div> */}
                            {/* Email */}
                            {/* <div className="col-md-6 bg-light-input">
                          <input
                            type="email"
                            name='email'
                            className="form-control"
                            placeholder="Email"
                            id="inputEmail4"
                             onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                          />
                        </div> */}
                            {/* Rating */}
                            {/* <div className="col-12 bg-light-input">
                          <select id="inputState2" className="form-select js-choice" >
                            <option selected >★★★★★ (5/5)</option>
                            <option value={4}>★★★★☆ (4/5)</option>
                            <option value={3}>★★★☆☆ (3/5)</option>
                            <option value={2}>★★☆☆☆ (2/5)</option>
                            <option value={1}>★☆☆☆☆ (1/5)</option>
                          </select>
                        </div> */}
                            {/* Message */}

                            <div className="col-12 bg-light-input">
                              <textarea
                                name="description"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.description}
                                className="form-control"
                                id="exampleFormControlTextarea1"
                                placeholder="Your review"
                                rows={3}
                                defaultValue={""}
                              />
                            </div>
                            {/* Button */}
                            <div className="col-12">
                              <button
                                type="submit"
                                className="btn btn-primary mb-0"
                              >
                                Post Review
                              </button>
                            </div>
                          </form>
                        ) : (
                          ""
                        )}
                      </div>
                    )}

                    {/* <div className="mt-2">
                      <h5 className="mb-4">Leave a Review</h5>
                      <form className="row g-3">
                        {/* Rating */}
                    {/* <div className="col-12 bg-light-input">
                          <select
                            id="inputState2"
                            className="form-select js-choice"
                          >
                            <option selected>★★★★★ (5/5)</option>
                            <option>★★★★☆ (4/5)</option>
                            <option>★★★☆☆ (3/5)</option>
                            <option>★★☆☆☆ (2/5)</option>
                            <option>★☆☆☆☆ (1/5)</option>
                          </select>
                        </div> */}
                    {/* Message
                        <div className="col-12 bg-light-input">
                          <textarea
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            placeholder="Your review"
                            rows={3}
                            defaultValue={""}
                          /> */}
                    {/* </div> */}
                    {/* Button */}
                    {/* <div className="col-12">
                          <button
                            type="submit"
                            className="btn btn-primary mb-0"
                          >
                            Post Review
                          </button>
                        </div>
                      </form> */}
                    {/* </div> */}
                    {/* Leave Review END */}
                  </div>
                  {/* Content END */}
                  {/* Content START */}
                  <div
                    className="tab-pane fade"
                    id="course-pills-5"
                    role="tabpanel"
                    aria-labelledby="course-pills-tab-5"
                  >
                    {/* Title */}
                    <h5 className="mb-3">Frequently Asked Questions</h5>
                    {/* Accordion START */}
                    <div
                      className="accordion accordion-flush"
                      id="accordionExample"
                    >
                      {/* Item */}
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseOne"
                            aria-expanded="true"
                            aria-controls="collapseOne"
                          >
                            <span className="text-secondary fw-bold me-3">
                              01
                            </span>
                            <span className="fw-bold">
                              How Digital Marketing Work?
                            </span>
                          </button>
                        </h2>
                        <div
                          id="collapseOne"
                          className="accordion-collapse collapse show"
                          aria-labelledby="headingOne"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body pt-0">
                            Comfort reached gay perhaps chamber his six detract
                            besides add. Moonlight newspaper up its enjoyment
                            agreeable depending. Timed voice share led him to
                            widen noisy young. At weddings believed laughing
                            although the material does the exercise of. Up
                            attempt offered ye civilly so sitting to. She new
                            course gets living within Elinor joy. She rapturous
                            suffering concealed.
                          </div>
                        </div>
                      </div>
                      {/* Item */}
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingTwo">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseTwo"
                            aria-expanded="false"
                            aria-controls="collapseTwo"
                          >
                            <span className="text-secondary fw-bold me-3">
                              02
                            </span>
                            <span className="fw-bold">What is SEO?</span>
                          </button>
                        </h2>
                        <div
                          id="collapseTwo"
                          className="accordion-collapse collapse"
                          aria-labelledby="headingTwo"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body pt-0">
                            Pleasure and so read the was hope entire first
                            decided the so must have as on was want up of I will
                            rival in came this touched got a physics to
                            travelling so all especially refinement monstrous
                            desk they was arrange the overall helplessly out of
                            particularly ill are purer.
                            <p className="mt-2">
                              Person she control of to beginnings view looked
                              eyes Than continues its and because and given and
                              shown creating curiously to more in are man were
                              smaller by we instead the these sighed Avoid in
                              the sufficient me real man longer of his how her
                              for countries to brains warned notch important
                              Finds be to the of on the increased explain noise
                              of power deep asking contribution this live of
                              suppliers goals bit separated poured sort several
                              the was organization the if relations go work
                              after mechanic But we've area wasn't everything
                              needs of and doctor where would.
                            </p>
                            Go he prisoners And mountains in just switching city
                            steps Might rung line what Mr Bulk; Was or between
                            towards the have phase were its world my samples are
                            the was royal he luxury the about trying And on he
                            to my enough is was the remember a although lead in
                            were through serving their assistant fame day have
                            for its after would cheek dull have what in go
                            feedback assignment Her of a any help if the a of
                            semantics is rational overhauls following in from
                            our hazardous and used more he themselves the
                            parents up just regulatory.
                          </div>
                        </div>
                      </div>
                      {/* Item */}
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingThree">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseThree"
                            aria-expanded="false"
                            aria-controls="collapseThree"
                          >
                            <span className="text-secondary fw-bold me-3">
                              03
                            </span>
                            <span className="fw-bold">
                              Who should join this course?
                            </span>
                          </button>
                        </h2>
                        <div
                          id="collapseThree"
                          className="accordion-collapse collapse"
                          aria-labelledby="headingThree"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body pt-0">
                            Post no so what deal evil rent by real in. But her
                            ready least set lived spite solid. September how men
                            saw tolerably two behavior arranging. She offices
                            for highest and replied one venture pasture.
                            Applauded no discovery in newspaper allowance am
                            northward. Frequently partiality possession
                            resolution at or appearance unaffected me. Engaged
                            its was the evident pleased husband. Ye goodness
                            felicity do disposal dwelling no. First am plate
                            jokes to began to cause a scale.{" "}
                            <strong>
                              Subjects he prospect elegance followed no overcame
                            </strong>{" "}
                            possible it on.
                          </div>
                        </div>
                      </div>
                      {/* Item */}
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingFour">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseFour"
                            aria-expanded="false"
                            aria-controls="collapseFour"
                          >
                            <span className="text-secondary fw-bold me-3">
                              04
                            </span>
                            <span className="fw-bold">
                              What are the T&amp;C for this program?
                            </span>
                          </button>
                        </h2>
                        <div
                          id="collapseFour"
                          className="accordion-collapse collapse"
                          aria-labelledby="headingFour"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body pt-0">
                            Night signs creeping yielding green Seasons together
                            man green fruitful make fish behold earth unto
                            you'll lights living moving sea open for fish day
                            multiply tree good female god had fruitful of
                            creature fill shall don't day fourth lesser he the
                            isn't let multiply may Creeping earth under was
                            You're without which image stars in Own creeping
                            night of wherein Heaven years their he over doesn't
                            whose won't kind seasons light Won't that fish him
                            whose won't also it dominion heaven fruitful Whales
                            created And likeness doesn't that Years without
                            divided saying morning creeping hath you'll seas
                            cattle in multiply under together in us said above
                            dry tree herb saw living darkness without have won't
                            for i behold meat brought winged Moving living
                            second beast Over fish place beast image very him
                            evening Thing they're fruit together forth day Seed
                            lights Land creature together Multiply waters form
                            brought.
                          </div>
                        </div>
                      </div>
                      {/* Item */}
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingFive">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseFive"
                            aria-expanded="false"
                            aria-controls="collapseFive"
                          >
                            <span className="text-secondary fw-bold me-3">
                              05
                            </span>
                            <span className="fw-bold">
                              What certificates will I be received for this
                              program?
                            </span>
                          </button>
                        </h2>
                        <div
                          id="collapseFive"
                          className="accordion-collapse collapse"
                          aria-labelledby="headingFive"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body pt-0">
                            Smile spoke total few great had never their too
                            Amongst moments do in arrived at my replied Fat
                            weddings servants but man believed prospect
                            Companions understood is as especially pianoforte
                            connection introduced Nay newspaper can sportsman
                            are admitting gentleman belonging his Is oppose no
                            he summer lovers twenty in Not his difficulty
                            boisterous surrounded bed Seems folly if in given
                            scale Sex contented dependent conveying advantage.
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Accordion END */}
                  </div>
                  {/* Content END */}
                </div>
                {/* Tab contents END */}
              </div>
            </div>
            {/* Main content END */}
            {/* Right sidebar START */}
            <div className="col-lg-4 pt-5 pt-lg-0">
              <div className="row mb-5 mb-lg-0">
                <div className="col-md-6 col-lg-12">
                  {/* Video START */}
                  {Pay_Course && (
                    <div className="card card-body shadow p-4 mb-4 z-index-9">
                      {/* Title */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">Your Progress</h4>
                      </div>

                      {/* Progress bar */}
                      <div
                        className="progress progress-sm bg-primary bg-opacity-15 mb-3"
                        style={{ height: "10px" }}
                      >
                        <div
                          className="progress-bar bg-primary animate-all"
                          role="progressbar"
                          style={{
                            width: `${courseProgressPercentage}%`,
                            transition:
                              "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                          aria-valuenow={courseProgressPercentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>

                      {/* Stats */}
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <span className="h6 fw-light mb-0 text-muted">
                          <i className="fas fa-book-open text-primary me-2" />
                          {completedLecturesCount} of {totalLecturesCount}{" "}
                          Lectures Completed
                        </span>
                        <span className="h6 mb-0 text-primary fw-bold">
                          {courseProgressPercentage}%
                        </span>
                      </div>

                      {courseProgressPercentage === 100 && (
                        <a
                          href="#"
                          className="btn btn-success mb-0"
                          onClick={() => genratecertificate()}
                        >
                          Certificate
                        </a>
                      )}
                    </div>
                  )}
                  {Pay_Course ? null : (
                    <div className="card shadow p-2 mb-4 z-index-9">
                      <div className="overflow-hidden rounded-3">
                        <Carousel>
                          {filerdata?.course_img?.map((v) => (
                            <img
                              src={v?.url}
                              className="card-img"
                              style={{ height: "300px", objectFit: "cover" }}
                            />
                          ))}
                        </Carousel>
                        {/* Overlay */}
                        <div className="bg-overlay bg-dark opacity-6" />
                        <div className="card-img-overlay d-flex align-items-start flex-column p-3">
                          {/* Video button and link */}
                          <div className="m-auto">
                            <a
                              // href="https://www.youtube.com/embed/tXHviS-4ygo"
                              className="btn btn-lg text-danger btn-round btn-white-shadow mb-0"
                              data-glightbox
                              data-gallery="course-video"
                            >
                              <i className="fas fa-play" />
                            </a>
                          </div>
                        </div>
                      </div>
                      {/* Card body */}
                      <div className="card-body px-3">
                        {/* Info */}
                        <div className="d-flex justify-content-between align-items-center">
                          {/* Price and time */}
                          <div>
                            <div className="d-flex align-items-center">
                              <h3 className="fw-bold mb-0 me-2">$150</h3>
                              <span className="text-decoration-line-through mb-0 me-2">
                                $350
                              </span>
                              <span className="badge bg-orange text-white mb-0">
                                60% off
                              </span>
                            </div>
                            <p className="mb-0 text-danger">
                              <i className="fas fa-stopwatch me-2" />5 days left
                              at this price
                            </p>
                          </div>
                          {/* Share button with dropdown */}
                          <div className="dropdown">
                            {/* Share button */}
                            <a
                              href="#"
                              className="btn btn-sm btn-light rounded small"
                              role="button"
                              id="dropdownShare"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="fas fa-fw fa-share-alt" />
                            </a>
                            {/* dropdown button */}
                            <ul
                              className="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded"
                              aria-labelledby="dropdownShare"
                            >
                              <li>
                                <a className="dropdown-item" href="#">
                                  <i className="fab fa-twitter-square me-2" />
                                  Twitter
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  <i className="fab fa-facebook-square me-2" />
                                  Facebook
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  <i className="fab fa-linkedin me-2" />
                                  LinkedIn
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  <i className="fas fa-copy me-2" />
                                  Copy link
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                        {/* Buttons */}
                        <div className="mt-3 d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-primary mb-0"
                            onClick={() => handlecart(filerdata)}
                          >
                            Add to Cart
                          </button>

                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              console.log("Course ID:", filerdata?._id);

                              if (filerdata?._id) {
                                navigate(`/course-video-player/${filerdata._id}`);
                              } else {
                                console.log("Course ID missing");
                              }
                            }}
                          >
                            Start Learning
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Video END */}
                  {/* Course info START */}
                  <div className="card card-body shadow p-4 mb-4">
                    {/* Title */}
                    <h4 className="mb-3">This course includes</h4>
                    <ul className="list-group list-group-borderless">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span className="h6 fw-light mb-0">
                          <i className="fas fa-fw fa-book-open text-primary" />
                          Lectures
                        </span>
                        <span>30</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span className="h6 fw-light mb-0">
                          <i className="fas fa-fw fa-clock text-primary" />
                          Duration
                        </span>
                        <span>4h 50m</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span className="h6 fw-light mb-0">
                          <i className="fas fa-fw fa-signal text-primary" />
                          Skills
                        </span>
                        <span>Beginner</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span className="h6 fw-light mb-0">
                          <i className="fas fa-fw fa-globe text-primary" />
                          Language
                        </span>
                        <span>English</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span className="h6 fw-light mb-0">
                          <i className="fas fa-fw fa-user-clock text-primary" />
                          Deadline
                        </span>
                        <span>Nov 30 2021</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span className="h6 fw-light mb-0">
                          <i className="fas fa-fw fa-medal text-primary" />
                          Certificate
                        </span>
                        <span>Yes</span>
                      </li>
                    </ul>
                  </div>
                  {/* Course info END */}
                </div>
                <div className="col-md-6 col-lg-12">
                  {/* Recently Viewed START */}
                  <div className="card card-body shadow p-4 mb-4">
                    {/* Title */}
                    <h4 className="mb-3">Recently Viewed</h4>
                    {/* Course item START */}
                    <div className="row gx-3 mb-3">
                      {/* Image */}
                      <div className="col-4">
                        <img
                          className="rounded"
                          src="assets/images/courses/4by3/21.jpg"
                          alt
                        />
                      </div>
                      {/* Info */}
                      <div className="col-8">
                        <h6 className="mb-0">
                          <a href="#">Fundamentals of Business Analysis</a>
                        </h6>
                        <ul className="list-group list-group-borderless mt-1 d-flex justify-content-between">
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="text-success">$130</span>
                            <span className="h6 fw-light">
                              4.5
                              <i className="fas fa-star text-warning ms-1" />
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/* Course item END */}
                    {/* Course item START */}
                    <div className="row gx-3">
                      {/* Image */}
                      <div className="col-4">
                        <img
                          className="rounded"
                          src="assets/images/courses/4by3/18.jpg"
                          alt
                        />
                      </div>
                      {/* Info */}
                      <div className="col-8">
                        <h6 className="mb-0">
                          <a href="#">The Complete Video Production Bootcamp</a>
                        </h6>
                        <ul className="list-group list-group-borderless mt-1 d-flex justify-content-between">
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="text-success">$150</span>
                            <span className="h6 fw-light">
                              4.0
                              <i className="fas fa-star text-warning ms-1" />
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/* Course item END */}
                  </div>
                  {/* Recently Viewed END */}
                  {/* Tags START */}
                  <div className="card card-body shadow p-4">
                    <h4 className="mb-3">Popular Tags</h4>
                    <ul className="list-inline mb-0">
                      <li className="list-inline-item">
                        {" "}
                        <a className="btn btn-outline-light btn-sm" href="#">
                          blog
                        </a>{" "}
                      </li>
                      <li className="list-inline-item">
                        {" "}
                        <a className="btn btn-outline-light btn-sm" href="#">
                          business
                        </a>{" "}
                      </li>
                      <li className="list-inline-item">
                        {" "}
                        <a className="btn btn-outline-light btn-sm" href="#">
                          theme
                        </a>{" "}
                      </li>
                      <li className="list-inline-item">
                        {" "}
                        <a className="btn btn-outline-light btn-sm" href="#">
                          bootstrap
                        </a>{" "}
                      </li>
                      <li className="list-inline-item">
                        {" "}
                        <a className="btn btn-outline-light btn-sm" href="#">
                          data science
                        </a>{" "}
                      </li>
                      <li className="list-inline-item">
                        {" "}
                        <a className="btn btn-outline-light btn-sm" href="#">
                          web development
                        </a>{" "}
                      </li>
                      <li className="list-inline-item">
                        {" "}
                        <a className="btn btn-outline-light btn-sm" href="#">
                          tips
                        </a>{" "}
                      </li>
                      <li className="list-inline-item">
                        {" "}
                        <a className="btn btn-outline-light btn-sm" href="#">
                          machine learning
                        </a>{" "}
                      </li>
                    </ul>
                  </div>
                  {/* Tags END */}
                </div>
              </div>
              {/* Row End */}
            </div>
            {/* Right sidebar END */}
          </div>
          {/* Row END */}
        </div>
      </section>
      {/* =======================
Page content END */}
      {/* =======================
Listed courses START */}

      {/* =======================
Listed courses END */}
    </main>
  );
}

export default CourseDetails;
