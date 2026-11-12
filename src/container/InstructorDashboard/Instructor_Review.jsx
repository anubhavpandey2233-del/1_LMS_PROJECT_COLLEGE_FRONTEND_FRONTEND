
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import InstructorHeader from "./components/InstructorHeader";
import InstructorSidebar from "./components/InstructorSidebar";
import { useGetAllreviewQuery } from "../../redux/Api/review.api";

function Instructor_Review() {
    const auth = useSelector((state) => state.auth);
    const instructorId = String(auth?.user?.data?._id || "");

    const {
        data: reviewResponse,
        isLoading,
        isError,
        refetch
    } = useGetAllreviewQuery();

    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;

    const allReviews = Array.isArray(reviewResponse?.data)
        ? reviewResponse.data
        : [];

    // Only logged-in instructor's course reviews
    const instructorReviews = useMemo(() => {
        if (!instructorId) return [];

        return allReviews.filter((review) => {
            const courseInstructorId = String(
                review?.course?.intrucotor_id?._id ??
                review?.course?.intrucotor_id ??
                ""
            );

            return courseInstructorId === instructorId;
        });
    }, [allReviews, instructorId]);

    // Sort reviews
    const sortedReviews = useMemo(() => {
        const reviews = [...instructorReviews];

        if (sortBy === "highest") {
            reviews.sort((a, b) => Number(b.rating) - Number(a.rating));
        } else if (sortBy === "lowest") {
            reviews.sort((a, b) => Number(a.rating) - Number(b.rating));
        } else if (sortBy === "oldest") {
            reviews.sort(
                (a, b) =>
                    new Date(a.createdAt) - new Date(b.createdAt)
            );
        } else {
            reviews.sort(
                (a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
            );
        }

        return reviews;
    }, [instructorReviews, sortBy]);

    const totalReviews = sortedReviews.length;
    const totalPages = Math.ceil(totalReviews / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;

    const currentReviews = sortedReviews.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleSortChange = (value) => {
        setSortBy(value);
        setCurrentPage(1);
    };

    const getStudentImage = (student) => {
        const image = student?.pfp;

        if (Array.isArray(image)) {
            return image[0]?.url || "/assets/images/avatar/09.jpg";
        }

        return image?.url || "/assets/images/avatar/09.jpg";
    };

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map((star) => (
            <li className="list-inline-item me-0" key={star}>
                <i
                    className={
                        star <= Number(rating)
                            ? "fas fa-star text-warning"
                            : "far fa-star text-warning"
                    }
                />
            </li>
        ));
    };

    return (
        <main>
            <InstructorHeader />

            <section className="pt-0">
                <div className="container">
                    <div className="row">

                        <InstructorSidebar />

                        <div className="col-xl-9">

                            <div className="card border rounded-3">

                                {/* Header */}
                                <div className="card-header border-bottom">
                                    <div className="row justify-content-between align-items-center">

                                        <div className="col-sm-6">
                                            <h3 className="card-header-title mb-2 mb-sm-0">
                                                Student Reviews
                                            </h3>
                                            <small className="text-muted">
                                                Total Reviews: {totalReviews}
                                            </small>
                                        </div>

                                        <div className="col-sm-4">
                                            <select
                                                className="form-select bg-white"
                                                value={sortBy}
                                                onChange={(e) =>
                                                    handleSortChange(e.target.value)
                                                }
                                            >
                                                <option value="newest">
                                                    Newest First
                                                </option>
                                                <option value="oldest">
                                                    Oldest First
                                                </option>
                                                <option value="highest">
                                                    Highest Rating
                                                </option>
                                                <option value="lowest">
                                                    Lowest Rating
                                                </option>
                                            </select>
                                        </div>

                                    </div>
                                </div>

                                {/* Reviews */}
                                <div className="card-body mt-2 mt-sm-4">

                                    {isLoading ? (
                                        <div className="text-center py-5">
                                            <div
                                                className="spinner-border text-primary"
                                                role="status"
                                            />
                                            <p className="mt-3 mb-0">
                                                Loading student reviews...
                                            </p>
                                        </div>
                                    ) : isError ? (
                                        <div className="text-center py-5">
                                            <p className="text-danger">
                                                Unable to load reviews.
                                            </p>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => refetch()}
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    ) : !instructorId ? (
                                        <div className="text-center py-5">
                                            <p className="text-muted">
                                                Instructor information not found.
                                                Please login again.
                                            </p>
                                        </div>
                                    ) : currentReviews.length > 0 ? (

                                        currentReviews.map((review, index) => (
                                            <React.Fragment key={review._id}>

                                                <div className="d-sm-flex">

                                                    {/* Student Image */}
                                                    <img
                                                        className="avatar avatar-lg rounded-circle float-start me-3"
                                                        src={getStudentImage(review.user)}
                                                        alt="Student"
                                                        style={{
                                                            width: "55px",
                                                            height: "55px",
                                                            objectFit: "cover"
                                                        }}
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src =
                                                                "/assets/images/avatar/09.jpg";
                                                        }}
                                                    />

                                                    <div className="flex-grow-1">

                                                        {/* Student Name and Date */}
                                                        <div className="mb-3 d-sm-flex justify-content-sm-between align-items-center">

                                                            <div>
                                                                <h5 className="m-0">
                                                                    {review?.user?.name || "Student"}
                                                                </h5>

                                                                <span className="small text-muted">
                                                                    {review.createdAt
                                                                        ? new Date(
                                                                            review.createdAt
                                                                        ).toLocaleString()
                                                                        : "Date not available"}
                                                                </span>
                                                            </div>

                                                            {/* Rating */}
                                                            <ul className="list-inline mb-0 mt-2 mt-sm-0">
                                                                {renderStars(review.rating)}
                                                            </ul>

                                                        </div>

                                                        {/* Course Name */}
                                                        <h6>
                                                            <span className="text-body fw-light">
                                                                Review on:
                                                            </span>{" "}
                                                            {review?.course?.name || "Course"}
                                                        </h6>

                                                        {/* Review Description */}
                                                        <p className="mb-2">
                                                            {review?.description || "No review description."}
                                                        </p>

                                                    </div>
                                                </div>

                                                {index !== currentReviews.length - 1 && (
                                                    <hr />
                                                )}

                                            </React.Fragment>
                                        ))

                                    ) : (
                                        <div className="text-center py-5">
                                            <i className="fas fa-comment-alt fs-1 text-muted mb-3" />

                                            <h5>No Student Reviews Yet</h5>

                                            <p className="text-muted mb-0">
                                                Reviews submitted by students
                                                for your courses will appear here.
                                            </p>
                                        </div>
                                    )}

                                </div>

                                {/* Pagination */}
                                {!isLoading && !isError && totalReviews > 0 && (
                                    <div className="card-footer border-top">

                                        <div className="d-sm-flex justify-content-sm-between align-items-center">

                                            <p className="mb-2 mb-sm-0 text-center text-sm-start">
                                                Showing {startIndex + 1} to{" "}
                                                {Math.min(
                                                    startIndex + itemsPerPage,
                                                    totalReviews
                                                )}{" "}
                                                of {totalReviews} entries
                                            </p>

                                            <nav
                                                className="d-flex justify-content-center"
                                                aria-label="Review pagination"
                                            >
                                                <ul className="pagination pagination-sm pagination-primary-soft my-0 py-0">

                                                    <li
                                                        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="page-link"
                                                            disabled={currentPage === 1}
                                                            onClick={() =>
                                                                setCurrentPage((prev) =>
                                                                    Math.max(1, prev - 1)
                                                                )
                                                            }
                                                        >
                                                            <i className="fas fa-angle-left" />
                                                        </button>
                                                    </li>

                                                    {Array.from(
                                                        { length: totalPages },
                                                        (_, index) => index + 1
                                                    ).map((page) => (
                                                        <li
                                                            key={page}
                                                            className={`page-item ${currentPage === page ? "active" : ""}`}
                                                        >
                                                            <button
                                                                type="button"
                                                                className="page-link"
                                                                onClick={() =>
                                                                    setCurrentPage(page)
                                                                }
                                                            >
                                                                {page}
                                                            </button>
                                                        </li>
                                                    ))}

                                                    <li
                                                        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="page-link"
                                                            disabled={currentPage === totalPages}
                                                            onClick={() =>
                                                                setCurrentPage((prev) =>
                                                                    Math.min(totalPages, prev + 1)
                                                                )
                                                            }
                                                        >
                                                            <i className="fas fa-angle-right" />
                                                        </button>
                                                    </li>

                                                </ul>
                                            </nav>

                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}

export default Instructor_Review;
