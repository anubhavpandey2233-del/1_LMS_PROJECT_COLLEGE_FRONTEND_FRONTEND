
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useGetcontentQuery } from "../../redux/Api/Content.api";
import { useGetallcourseQuery } from "../../redux/Api/Course.api";
import { useGetAllSectionQuery } from "../../redux/Api/Section.api";

import {
  useAddprogessMutation,
  useGetAllprogessQuery,
  useUpdateprogessMutation,
} from "../../redux/Api/progess.api";

import { useGetenrollmentQuery } from "../../redux/Api/enrollment.api";

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return String(value._id ?? value.id ?? "");
  }

  return String(value);
};

const formatTime = (seconds) => {
  const value = Number(seconds);

  if (!Number.isFinite(value) || value < 0) return "0:00";

  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const remainingSeconds = Math.floor(value % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

function CourseVideoPlayer() {
  const { _id } = useParams();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  const userId = getId(auth?.user?.data?._id);

  const {
    data: courseResponse,
    isLoading: courseLoading,
    isError: courseError,
  } = useGetallcourseQuery();

  const {
    data: sectionResponse,
    isLoading: sectionLoading,
    isError: sectionError,
  } = useGetAllSectionQuery();

  const {
    data: contentResponse,
    isLoading: contentLoading,
    isError: contentError,
  } = useGetcontentQuery();

  const { data: enrollmentResponse } = useGetenrollmentQuery();
  const { data: progressResponse } = useGetAllprogessQuery();

  const [addProgress] = useAddprogessMutation();
  const [updateProgress] = useUpdateprogessMutation();

  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [savingProgress, setSavingProgress] = useState(false);
  const [message, setMessage] = useState("");

  const [selectedContentId, setSelectedContentId] = useState("");

  const courses = courseResponse?.data ?? [];
  const sections = sectionResponse?.data ?? [];
  const contents = contentResponse?.data ?? [];
  const enrollments = enrollmentResponse?.data ?? [];
  const progresses = progressResponse?.data ?? [];

  const routeContent = useMemo(
    () => contents.find((item) => getId(item._id) === String(_id)),
    [contents, _id]
  );

  const routeCourse = useMemo(
    () => courses.find((item) => getId(item._id) === String(_id)),
    [courses, _id]
  );

  const courseId = getId(routeCourse?._id) || getId(routeContent?.course_id);

  const courseSections = useMemo(
    () =>
      sections
        .filter((item) => getId(item.course_id) === courseId)
        .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0)),
    [sections, courseId]
  );

  const courseSectionIds = useMemo(
    () => courseSections.map((item) => getId(item._id)),
    [courseSections]
  );

  const courseContents = useMemo(
    () =>
      contents
        .filter(
          (item) =>
            getId(item.course_id) === courseId ||
            courseSectionIds.includes(getId(item.section_id))
        )
        .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0)),
    [contents, courseId, courseSectionIds]
  );

  useEffect(() => {
    if (!courseContents.length) return;

    const routeContentId = getId(routeContent?._id);

    if (routeContentId && courseContents.some((item) => getId(item._id) === routeContentId)) {
      setSelectedContentId(routeContentId);
      return;
    }

    setSelectedContentId((previous) => {
      if (previous && courseContents.some((item) => getId(item._id) === previous)) {
        return previous;
      }

      return getId(courseContents[0]?._id);
    });
  }, [courseContents, routeContent]);

  const activeContent = useMemo(
    () => courseContents.find((item) => getId(item._id) === selectedContentId),
    [courseContents, selectedContentId]
  );

  const activeContentId = getId(activeContent?._id);
  const sectionId = getId(activeContent?.section_id);

  const currentSection = useMemo(
    () => courseSections.find((item) => getId(item._id) === sectionId),
    [courseSections, sectionId]
  );

  const courseData = routeCourse || courses.find((item) => getId(item._id) === courseId);

  const enrollment = useMemo(
    () =>
      enrollments.find(
        (item) =>
          getId(item.user_id) === userId &&
          getId(item.course_id) === courseId
      ),
    [enrollments, userId, courseId]
  );

  const enrollmentId = getId(enrollment?._id);

  const currentProgress = useMemo(
    () =>
      progresses.find(
        (item) =>
          getId(item.content_id) === activeContentId &&
          getId(item.enrollment_id) === enrollmentId
      ),
    [progresses, activeContentId, enrollmentId]
  );

  const media = activeContent?.content_file?.[0];
  const mediaUrl = media?.url || "";
  const mediaType = String(media?.type || "").toLowerCase();

  const isVideo =
    mediaType.includes("video") ||
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(mediaUrl);

  const isImage =
    /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i.test(mediaUrl) ||
    mediaType.includes("image");

  useEffect(() => {
    setCurrentTime(0);
    setVideoDuration(0);
    setMessage("");
  }, [activeContentId]);

  const saveProgress = async ({ time, completed }) => {
    if (!enrollmentId || !activeContentId) {
      setMessage("Please enroll in this course before saving progress.");
      return;
    }

    const existingProgress = progresses.find(
      (item) =>
        getId(item.content_id) === activeContentId &&
        getId(item.enrollment_id) === enrollmentId
    );

    const payload = {
      enrollment_id: enrollmentId,
      content_id: activeContentId,
      duration: Math.floor(Number(time) || 0),
      is_completed: completed,
    };

    setSavingProgress(true);

    try {
      if (existingProgress?._id) {
        await updateProgress({
          _id: existingProgress._id,
          ...payload,
        }).unwrap();
      } else {
        await addProgress(payload).unwrap();
      }

      setMessage(completed ? "Lecture completed!" : "Progress saved.");
    } catch (error) {
      console.error("Progress save error:", error);
      setMessage("Progress save nahi hua. Please try again.");
    } finally {
      setSavingProgress(false);
    }
  };

  const handleTimeUpdate = (event) => {
    const video = event.currentTarget;
    const time = Math.floor(video.currentTime);

    setCurrentTime(time);

    if (activeContentId && userId) {
      localStorage.setItem(
        `video-${userId}-${activeContentId}`,
        String(time)
      );
    }
  };

  const handleLoadedMetadata = (event) => {
    const video = event.currentTarget;
    const duration = Number.isFinite(video.duration) ? video.duration : 0;

    setVideoDuration(duration);

    const savedTime = Number(
      localStorage.getItem(`video-${userId}-${activeContentId}`) ?? 0
    );

    const progressTime = Number(currentProgress?.duration ?? 0);

    if (savedTime > 0 && savedTime < duration) {
      video.currentTime = savedTime;
    } else if (
      progressTime > 0 &&
      progressTime < duration &&
      !currentProgress?.is_completed
    ) {
      video.currentTime = progressTime;
    }
  };

  const handlePause = async (event) => {
    const video = event.currentTarget;

    if (video.ended || !enrollmentId) return;

    await saveProgress({
      time: video.currentTime,
      completed: false,
    });
  };

  const handleVideoEnd = async (event) => {
    const video = event.currentTarget;

    localStorage.removeItem(`video-${userId}-${activeContentId}`);
    setCurrentTime(video.duration || videoDuration);

    await saveProgress({
      time: video.duration || videoDuration,
      completed: true,
    });
  };

  const handleMarkComplete = async () => {
    await saveProgress({
      time: currentProgress?.duration ?? currentTime,
      completed: true,
    });
  };

  const handleLectureSelect = (lectureId) => {
    setSelectedContentId(lectureId);
    navigate(`/course-video-player/${lectureId}`, { replace: true });
  };

  if (courseLoading || sectionLoading || contentLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" />
        <p className="mt-3">Loading course...</p>
      </div>
    );
  }

  if (courseError || sectionError || contentError) {
    return (
      <div className="container py-5 text-center">
        <h4>Course load nahi hua</h4>
        <p>Please check your API response and try again.</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="container py-5 text-center">
        <h4>Course not found</h4>
        <p>Course ID aur course API response check karo.</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  if (!courseContents.length || !activeContent) {
    return (
      <div className="container py-5 text-center">
        <h4>Lecture not found</h4>
        <p>
          Is course ke sections ya lectures API se nahi mile. Course ID,
          section_id aur course_id check karo.
        </p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const completedCount = courseContents.filter((item) =>
    progresses.some(
      (progressItem) =>
        getId(progressItem.content_id) === getId(item._id) &&
        getId(progressItem.enrollment_id) === enrollmentId &&
        progressItem.is_completed
    )
  ).length;

  return (
    <main className="container-fluid py-4">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="bg-dark rounded-top p-2">
              {mediaUrl ? (
                isVideo ? (
                  <video
                    key={activeContentId}
                    className="w-100"
                    style={{ maxHeight: "70vh", background: "#000" }}
                    controls
                    playsInline
                    preload="metadata"
                    src={mediaUrl}
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    onPause={handlePause}
                    onEnded={handleVideoEnd}
                  >
                    Your browser does not support HTML video.
                  </video>
                ) : isImage ? (
                  <div className="text-center py-3">
                    <img
                      src={mediaUrl}
                      alt={activeContent.name || "Course material"}
                      className="img-fluid rounded"
                      style={{ maxHeight: "65vh" }}
                    />
                  </div>
                ) : (
                  <div className="text-center text-white py-5">
                    <a
                      href={mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-light"
                    >
                      Open Course File
                    </a>
                  </div>
                )
              ) : (
                <div className="text-center text-white py-5">
                  <p className="mb-0">Is lecture ki file available nahi hai.</p>
                </div>
              )}
            </div>

            <div className="card-body">
              <p className="text-muted mb-1">
                {courseData?.name || "Course"}
                {currentSection?.name ? ` / ${currentSection.name}` : ""}
              </p>

              <h3 className="h4">
                {activeContent.name || "Course Lecture"}
              </h3>

              {isVideo && (
                <div className="d-flex justify-content-between small text-muted mb-3">
                  <span>Watched: {formatTime(currentTime)}</span>
                  <span>Duration: {formatTime(videoDuration)}</span>
                </div>
              )}

              {message && (
                <div className="alert alert-info py-2" role="status">
                  {message}
                </div>
              )}

              {!enrollmentId && (
                <div className="alert alert-warning py-2">
                  Is user ke liye course enrollment nahi mila. Progress save
                  karne ke liye enrollment zaroori hai.
                </div>
              )}

              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>

                {!currentProgress?.is_completed ? (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleMarkComplete}
                    disabled={savingProgress || !enrollmentId}
                  >
                    {savingProgress ? "Saving..." : "Mark as Complete"}
                  </button>
                ) : (
                  <span className="badge bg-success align-self-center">
                    Lecture Completed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-1">{courseData?.name || "Course Content"}</h5>
              <p className="small text-muted mb-0">
                {completedCount} of {courseContents.length} lectures completed
              </p>
            </div>

            <div className="card-body p-0">
              {courseSections.length > 0 ? (
                <div className="accordion accordion-flush">
                  {courseSections.map((sectionItem, index) => {
                    const sectionLectures = courseContents.filter(
                      (item) =>
                        getId(item.section_id) === getId(sectionItem._id)
                    );

                    const sectionIsCurrent =
                      getId(sectionItem._id) === sectionId;

                    return (
                      <div className="accordion-item" key={sectionItem._id}>
                        <h2 className="accordion-header">
                          <button
                            className={`accordion-button ${
                              sectionIsCurrent ? "" : "collapsed"
                            }`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#course-section-${index}`}
                            aria-expanded={sectionIsCurrent}
                            aria-controls={`course-section-${index}`}
                          >
                            <span className="fw-semibold">
                              {sectionItem.name || `Section ${index + 1}`}
                            </span>
                            <span className="ms-2 small text-muted">
                              ({sectionLectures.length})
                            </span>
                          </button>
                        </h2>

                        <div
                          id={`course-section-${index}`}
                          className={`accordion-collapse collapse ${
                            sectionIsCurrent ? "show" : ""
                          }`}
                        >
                          <div className="list-group list-group-flush">
                            {sectionLectures.length > 0 ? (
                              sectionLectures.map((lecture) => {
                                const lectureId = getId(lecture._id);

                                const completed = progresses.some(
                                  (item) =>
                                    getId(item.content_id) === lectureId &&
                                    getId(item.enrollment_id) === enrollmentId &&
                                    item.is_completed
                                );

                                const active = lectureId === activeContentId;

                                return (
                                  <button
                                    type="button"
                                    key={lectureId}
                                    onClick={() => handleLectureSelect(lectureId)}
                                    className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${
                                      active ? "active" : ""
                                    }`}
                                  >
                                    <span>
                                      {completed ? (
                                        <i className="fas fa-check-circle" />
                                      ) : (
                                        <i
                                          className={`fas ${
                                            active
                                              ? "fa-play-circle"
                                              : "fa-play"
                                          }`}
                                        />
                                      )}
                                    </span>

                                    <span className="text-start flex-grow-1">
                                      {lecture.name || "Untitled Lecture"}
                                    </span>

                                    {active && (
                                      <span className="small">Playing</span>
                                    )}
                                  </button>
                                );
                              })
                            ) : (
                              <div className="p-3 small text-muted">
                                Is section mein abhi koi lecture nahi hai.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="p-3 mb-0 text-muted">
                  Is course ke sections nahi mile.
                </p>
              )}
            </div>

            <div className="card-footer bg-white">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={() => navigate(-1)}
              >
                Back to Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CourseVideoPlayer;







// import React from "react";
// import { useParams } from "react-router-dom";
// import { useGetcontentQuery } from "../../redux/Api/Content.api";
// import { useGetallcourseQuery } from "../../redux/Api/Course.api";
// import { useGetAllSectionQuery } from "../../redux/Api/Section.api";
// import {
//   useAddprogessMutation,
//   useGetAllprogessQuery,
//   useUpdateprogessMutation,
// } from "../../redux/Api/progess.api";
// import { useAddenrollmentMutation, useGetenrollmentQuery } from "../../redux/Api/enrollment.api";
// import { useSelector } from "react-redux";

// function CourseVideoPlayer(props) {
//   const param = useParams();

//   const auth = useSelector((state) => state.auth);
//   console.log("checklogin", auth?.user?.data);

//   const { data: course } = useGetallcourseQuery();
//   const { data: section } = useGetAllSectionQuery();
//   const { data: content } = useGetcontentQuery();

//   const constentdata = content?.data?.find((v) => v._id === param._id);
//   console.log("constent data", constentdata);

//   const coursedata = course?.data?.find(
//     (v) => v._id === constentdata?.course_id,
//   );
//   console.log("cousre Data", coursedata);

//   const sectiondata = section?.data?.find(
//     (v) => v._id === constentdata?.section_id,
//   );
//   console.log("section data", sectiondata);

//   const onTimeUpdate = (e, id) => {
//     const currentTimeee = Math.floor(e.target.currentTime);
//     localStorage.setItem(id, currentTimeee);
//   };

//   const { data: enrollment } = useGetenrollmentQuery();

//     console.log(enrollment);

//     const [addEnrollment] = useAddenrollmentMutation();

//     const Enroll_USER = enrollment?.data?.find((v) => v?.user_id === auth?.user?.data?._id)

//     console.log(Enroll_USER);

//     const En_ID = Enroll_USER?._id

//     console.log(En_ID);


//   const { data: progress } = useGetAllprogessQuery();
//   const [addProgress] = useAddprogessMutation();
//   const [updateProgress] = useUpdateprogessMutation();

//   const handlecompelet= async () => {
//     const findProgress = progress?.data?.find(
//       (v) => v.content_id === param._id && v.enrollment_id === En_ID,
//     );

//     console.log(findProgress);

//     if (findProgress) {
//       await updateProgress({
//         _id: findProgress._id,
//         is_completed: true,
//       });
//     } else {
//       await addProgress({
//         enrollment_id: Enroll_USER._id,
//         content_id: param._id,
//         is_completed: true,
//       });
//     }
//   }

//   const handleVideoEnd = async (e, id) => {
//     const duration = e.target.duration;
//     const findProgress = progress?.data?.find(
//       (v) => v.content_id === id && v.enrollment_id === En_ID,
//     );

//     console.log(findProgress);

//     if (findProgress) {
//       await updateProgress({
//         _id: findProgress._id,
//         duration: duration,
//         is_completed: true,
//       });
//     } else {
//       await addProgress({
//         enrollment_id: Enroll_USER._id,
//         content_id: id,
//         duration: duration,
//         is_completed: true,
//       });
//     }
//   };

//   const handlePause = async (e, id) => {
//     const currentTime = e.target.currentTime;
//     const duration = e.target.duration;

//     const findProgress = progress?.data?.find(
//       (v) => v.content_id === id && v.enrollment_id === En_ID,
//     );

//     console.log(findProgress);

//     if (findProgress) {
//       await updateProgress({
//         _id: findProgress._id,
//         duration: currentTime,
//         is_completed: false,
//       });
//     } else {
//       await addProgress({
//         enrollment_id: Enroll_USER._id,
//         content_id: id,
//         duration: duration,
//       });
//     }
//   };

//   return (
//     <div>
//       {/* **************** MAIN CONTENT START **************** */}
//       <main>
//         <section className="py-0 bg-dark position-relative">
//           <div className="row g-0">
//             <div className="d-flex">
//               <div className="overflow-hidden fullscreen-video w-100">
//                 {/* Full screen video START */}
//                 <div className="video-player rounded-3">
//                   {constentdata?.content_file[0]?.type === "video" ? (
//                     <video
//                       controls
//                       crossOrigin="anonymous"
//                       playsInline
//                       src={constentdata?.content_file[0]?.url}
//                       onLoadedMetadata={(e) => {
//                         const saveTime = localStorage.getItem(
//                           constentdata?.content_file[0]._id,
//                         );

//                         if (saveTime) {
//                           e.target.currentTime = parseFloat(saveTime);
//                         }
//                       }}
//                       onTimeUpdate={(e) =>
//                         onTimeUpdate(e, constentdata?.content_file[0]._id)
//                       }
//                       onEnded={(e) =>
//                         handleVideoEnd(e, constentdata?.content_file[0]._id)
//                       }
//                       onPause={(e) =>
//                         handlePause(e, constentdata?.content_file[0]._id)
//                       }
//                     ></video>
//                   ) : (
//                     <>
//                       <span>
                        
//                           <a className="btn btn-outline-primary mb-0" href={constentdata?.content_file[0]?.url}>Open File</a>
//                         </span> <br /> <br />

//                         <a href="#" className="btn btn-success mb-0" onClick={() => handlecompelet() }>
//                             Marsk as Complet
//                           </a>
                    
//                     </>
//                   )}
//                 </div>
//                 {/* Full screen video END */}
//                 {/* Plyr resources and browser polyfills are specified in the pen settings */}
//               </div>
//               {/* Page content START */}
//               <div className="justify-content-end position-relative">
//                 {/* Collapse button START */}
//                 <button
//                   className="navbar-toggler btn btn-white mt-4 plyr-toggler"
//                   type="button"
//                   data-bs-toggle="collapse"
//                   data-bs-target="#collapseWidthExample"
//                   aria-expanded="false"
//                   aria-controls="collapseWidthExample"
//                 >
//                   <span className="navbar-toggler-animation">
//                     <span />
//                     <span />
//                     <span />
//                   </span>
//                 </button>
//                 {/* Collapse button END */}
//                 {/* Collapse body START */}
//                 <div
//                   className="collapse collapse-horizontal"
//                   id="collapseWidthExample"
//                 >
//                   <div className="card vh-100 overflow-auto rounded-0 w-280px w-sm-400px">
//                     {/* Title */}
//                     <div className="card-header bg-light rounded-0">
//                       <h1 className="mt-2 fs-5">{coursedata?.desciption}</h1>
//                       <h6 className="mb-0 fw-normal">
//                         <a href="#">By Jacqueline Miller</a>
//                       </h6>
//                     </div>
//                     {/* Course content START */}
//                     <div className="card-body">
//                       <h5>Course content</h5>
//                       <hr /> {/* Divider */}
//                       {/* Course START */}
//                       <div className="row">
//                         <div className="col-12">
//                           {/* Accordion START */}
//                           <div
//                             className="accordion accordion-flush-light accordion-flush"
//                             id="accordionExample"
//                           >
//                             {/* Item */}
//                             <div className="accordion-item">
//                               {section?.data?.map((v) => {
//                                 return (
//                                   <>
//                                     <h2
//                                       className="accordion-header"
//                                       id="headingOne"
//                                     >
//                                       <button
//                                         className="accordion-button collapsed"
//                                         type="button"
//                                         data-bs-toggle="collapse"
//                                         data-bs-target="#collapseOne"
//                                         aria-expanded="true"
//                                         aria-controls="collapseOne"
//                                       >
//                                         <span className="mb-0 fw-bold">
//                                           {v.name}
//                                         </span>
//                                       </button>
//                                     </h2>
//                                     <div
//                                       id="collapseOne"
//                                       className="accordion-collapse collapse show"
//                                       aria-labelledby="headingOne"
//                                       data-bs-parent="#accordionExample"
//                                     >
//                                       <div className="accordion-body px-3">
//                                         <div className="vstack gap-3">
//                                           {/* Course lecture */}
//                                           <div className="d-flex justify-content-between align-items-center">
//                                             <div className="position-relative d-flex align-items-center">
//                                               <a
//                                                 href="#"
//                                                 className="btn btn-danger-soft btn-round btn-sm mb-0 stretched-link position-static"
//                                               >
//                                                 <i className="fas fa-play me-0" />
//                                               </a>
//                                               <span className="d-inline-block text-truncate ms-2 mb-0 h6 fw-light w-100px w-sm-200px">
//                                                 Introduction
//                                               </span>
//                                             </div>
//                                             <p className="mb-0 text-truncate">
//                                               2m 10s
//                                             </p>
//                                           </div>
//                                           {/* Course lecture */}
//                                           <div className="d-flex justify-content-between align-items-center">
//                                             <div className="position-relative d-flex align-items-center">
//                                               <a
//                                                 href="#"
//                                                 className="btn btn-danger-soft btn-round btn-sm mb-0 stretched-link position-static"
//                                               >
//                                                 <i className="fas fa-play me-0" />
//                                               </a>
//                                               <span className="d-inline-block text-truncate ms-2 mb-0 h6 fw-light w-100px w-sm-200px">
//                                                 {" "}
//                                                 What is Digital Marketing What
//                                                 is Digital Marketing
//                                               </span>
//                                             </div>
//                                             <p className="mb-0 text-truncate">
//                                               15m 10s
//                                             </p>
//                                           </div>
//                                           {/* Course lecture */}
//                                           <div className="d-flex justify-content-between align-items-center">
//                                             <div className="position-relative d-flex align-items-center">
//                                               <a
//                                                 href="#"
//                                                 className="btn btn-danger-soft btn-round btn-sm mb-0 stretched-link position-static"
//                                               >
//                                                 <i className="fas fa-play me-0" />
//                                               </a>
//                                               <span className="d-inline-block text-truncate ms-2 mb-0 h6 fw-light w-100px w-sm-200px">
//                                                 Type of Digital Marketing
//                                               </span>
//                                             </div>
//                                             <p className="mb-0 text-truncate">
//                                               18m 10s
//                                             </p>
//                                           </div>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </>
//                                 );
//                               })}
//                             </div>
//                           </div>
//                           {/* Accordion END */}
//                         </div>
//                       </div>
//                       {/* Course END */}
//                     </div>
//                     {/* Course content END */}
//                     <div className="card-footer">
//                       <div className="d-grid">
//                         <a
//                           href="course-detail.html"
//                           className="btn btn-primary-soft mb-0"
//                         >
//                           Back to course
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 {/* Collapse body END */}
//               </div>
//               {/* Page content END */}
//             </div>
//           </div>
//         </section>
//       </main>
//       {/* **************** MAIN CONTENT END **************** */}
//     </div>
//   );
// }

// export default CourseVideoPlayer;
