import React from "react";
import { useParams } from "react-router-dom";
import { useGetcontentQuery } from "../../redux/Api/Content.api";
import { useGetallcourseQuery } from "../../redux/Api/Course.api";
import { useGetAllSectionQuery } from "../../redux/Api/Section.api";
import {
  useAddprogessMutation,
  useGetAllprogessQuery,
  useUpdateprogessMutation,
} from "../../redux/Api/progess.api";
import { useAddenrollmentMutation, useGetenrollmentQuery } from "../../redux/Api/enrollment.api";
import { useSelector } from "react-redux";

function CourseVideoPlayer(props) {
  const param = useParams();

  const auth = useSelector((state) => state.auth);
  console.log("checklogin", auth?.user?.data);

  const { data: course } = useGetallcourseQuery();
  const { data: section } = useGetAllSectionQuery();
  const { data: content } = useGetcontentQuery();

  const constentdata = content?.data?.find((v) => v._id === param._id);
  console.log("constent data", constentdata);

  const coursedata = course?.data?.find(
    (v) => v._id === constentdata?.course_id,
  );
  console.log("cousre Data", coursedata);

  const sectiondata = section?.data?.find(
    (v) => v._id === constentdata?.section_id,
  );
  console.log("section data", sectiondata);

  const onTimeUpdate = (e, id) => {
    const currentTimeee = Math.floor(e.target.currentTime);
    localStorage.setItem(id, currentTimeee);
  };

  const { data: enrollment } = useGetenrollmentQuery();

    console.log(enrollment);

    const [addEnrollment] = useAddenrollmentMutation();

    const Enroll_USER = enrollment?.data?.find((v) => v?.user_id === auth?.user?.data?._id)

    console.log(Enroll_USER);

    const En_ID = Enroll_USER?._id

    console.log(En_ID);


  const { data: progress } = useGetAllprogessQuery();
  const [addProgress] = useAddprogessMutation();
  const [updateProgress] = useUpdateprogessMutation();

  const handlecompelet= async () => {
    const findProgress = progress?.data?.find(
      (v) => v.content_id === param._id && v.enrollment_id === En_ID,
    );

    console.log(findProgress);

    if (findProgress) {
      await updateProgress({
        _id: findProgress._id,
        is_completed: true,
      });
    } else {
      await addProgress({
        enrollment_id: Enroll_USER._id,
        content_id: param._id,
        is_completed: true,
      });
    }
  }

  const handleVideoEnd = async (e, id) => {
    const duration = e.target.duration;
    const findProgress = progress?.data?.find(
      (v) => v.content_id === id && v.enrollment_id === En_ID,
    );

    console.log(findProgress);

    if (findProgress) {
      await updateProgress({
        _id: findProgress._id,
        duration: duration,
        is_completed: true,
      });
    } else {
      await addProgress({
        enrollment_id: Enroll_USER._id,
        content_id: id,
        duration: duration,
        is_completed: true,
      });
    }
  };

  const handlePause = async (e, id) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;

    const findProgress = progress?.data?.find(
      (v) => v.content_id === id && v.enrollment_id === En_ID,
    );

    console.log(findProgress);

    if (findProgress) {
      await updateProgress({
        _id: findProgress._id,
        duration: currentTime,
        is_completed: false,
      });
    } else {
      await addProgress({
        enrollment_id: Enroll_USER._id,
        content_id: id,
        duration: duration,
      });
    }
  };

  return (
    <div>
      {/* **************** MAIN CONTENT START **************** */}
      <main>
        <section className="py-0 bg-dark position-relative">
          <div className="row g-0">
            <div className="d-flex">
              <div className="overflow-hidden fullscreen-video w-100">
                {/* Full screen video START */}
                <div className="video-player rounded-3">
                  {constentdata?.content_file[0]?.type === "video" ? (
                    <video
                      controls
                      crossOrigin="anonymous"
                      playsInline
                      src={constentdata?.content_file[0]?.url}
                      onLoadedMetadata={(e) => {
                        const saveTime = localStorage.getItem(
                          constentdata?.content_file[0]._id,
                        );

                        if (saveTime) {
                          e.target.currentTime = parseFloat(saveTime);
                        }
                      }}
                      onTimeUpdate={(e) =>
                        onTimeUpdate(e, constentdata?.content_file[0]._id)
                      }
                      onEnded={(e) =>
                        handleVideoEnd(e, constentdata?.content_file[0]._id)
                      }
                      onPause={(e) =>
                        handlePause(e, constentdata?.content_file[0]._id)
                      }
                    ></video>
                  ) : (
                    <>
                      <span>
                        
                          <a className="btn btn-outline-primary mb-0" href={constentdata?.content_file[0]?.url}>Open File</a>
                        </span> <br /> <br />

                        <a href="#" className="btn btn-success mb-0" onClick={() => handlecompelet() }>
                            Marsk as Complet
                          </a>
                    
                    </>
                  )}
                </div>
                {/* Full screen video END */}
                {/* Plyr resources and browser polyfills are specified in the pen settings */}
              </div>
              {/* Page content START */}
              <div className="justify-content-end position-relative">
                {/* Collapse button START */}
                <button
                  className="navbar-toggler btn btn-white mt-4 plyr-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseWidthExample"
                  aria-expanded="false"
                  aria-controls="collapseWidthExample"
                >
                  <span className="navbar-toggler-animation">
                    <span />
                    <span />
                    <span />
                  </span>
                </button>
                {/* Collapse button END */}
                {/* Collapse body START */}
                <div
                  className="collapse collapse-horizontal"
                  id="collapseWidthExample"
                >
                  <div className="card vh-100 overflow-auto rounded-0 w-280px w-sm-400px">
                    {/* Title */}
                    <div className="card-header bg-light rounded-0">
                      <h1 className="mt-2 fs-5">{coursedata?.desciption}</h1>
                      <h6 className="mb-0 fw-normal">
                        <a href="#">By Jacqueline Miller</a>
                      </h6>
                    </div>
                    {/* Course content START */}
                    <div className="card-body">
                      <h5>Course content</h5>
                      <hr /> {/* Divider */}
                      {/* Course START */}
                      <div className="row">
                        <div className="col-12">
                          {/* Accordion START */}
                          <div
                            className="accordion accordion-flush-light accordion-flush"
                            id="accordionExample"
                          >
                            {/* Item */}
                            <div className="accordion-item">
                              {section?.data?.map((v) => {
                                return (
                                  <>
                                    <h2
                                      className="accordion-header"
                                      id="headingOne"
                                    >
                                      <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseOne"
                                        aria-expanded="true"
                                        aria-controls="collapseOne"
                                      >
                                        <span className="mb-0 fw-bold">
                                          {v.name}
                                        </span>
                                      </button>
                                    </h2>
                                    <div
                                      id="collapseOne"
                                      className="accordion-collapse collapse show"
                                      aria-labelledby="headingOne"
                                      data-bs-parent="#accordionExample"
                                    >
                                      <div className="accordion-body px-3">
                                        <div className="vstack gap-3">
                                          {/* Course lecture */}
                                          <div className="d-flex justify-content-between align-items-center">
                                            <div className="position-relative d-flex align-items-center">
                                              <a
                                                href="#"
                                                className="btn btn-danger-soft btn-round btn-sm mb-0 stretched-link position-static"
                                              >
                                                <i className="fas fa-play me-0" />
                                              </a>
                                              <span className="d-inline-block text-truncate ms-2 mb-0 h6 fw-light w-100px w-sm-200px">
                                                Introduction
                                              </span>
                                            </div>
                                            <p className="mb-0 text-truncate">
                                              2m 10s
                                            </p>
                                          </div>
                                          {/* Course lecture */}
                                          <div className="d-flex justify-content-between align-items-center">
                                            <div className="position-relative d-flex align-items-center">
                                              <a
                                                href="#"
                                                className="btn btn-danger-soft btn-round btn-sm mb-0 stretched-link position-static"
                                              >
                                                <i className="fas fa-play me-0" />
                                              </a>
                                              <span className="d-inline-block text-truncate ms-2 mb-0 h6 fw-light w-100px w-sm-200px">
                                                {" "}
                                                What is Digital Marketing What
                                                is Digital Marketing
                                              </span>
                                            </div>
                                            <p className="mb-0 text-truncate">
                                              15m 10s
                                            </p>
                                          </div>
                                          {/* Course lecture */}
                                          <div className="d-flex justify-content-between align-items-center">
                                            <div className="position-relative d-flex align-items-center">
                                              <a
                                                href="#"
                                                className="btn btn-danger-soft btn-round btn-sm mb-0 stretched-link position-static"
                                              >
                                                <i className="fas fa-play me-0" />
                                              </a>
                                              <span className="d-inline-block text-truncate ms-2 mb-0 h6 fw-light w-100px w-sm-200px">
                                                Type of Digital Marketing
                                              </span>
                                            </div>
                                            <p className="mb-0 text-truncate">
                                              18m 10s
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                            </div>
                          </div>
                          {/* Accordion END */}
                        </div>
                      </div>
                      {/* Course END */}
                    </div>
                    {/* Course content END */}
                    <div className="card-footer">
                      <div className="d-grid">
                        <a
                          href="course-detail.html"
                          className="btn btn-primary-soft mb-0"
                        >
                          Back to course
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Collapse body END */}
              </div>
              {/* Page content END */}
            </div>
          </div>
        </section>
      </main>
      {/* **************** MAIN CONTENT END **************** */}
    </div>
  );
}

export default CourseVideoPlayer;
