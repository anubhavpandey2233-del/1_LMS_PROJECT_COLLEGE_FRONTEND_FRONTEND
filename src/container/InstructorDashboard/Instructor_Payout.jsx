
import React, { useMemo, useState } from "react";
import InstructorHeader from "./components/InstructorHeader";
import InstructorSidebar from "./components/InstructorSidebar";

function Instructor_Payout() {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;

    // Real payout API connect hone ke baad yahan database data use hoga.
    const payouts = [];

    const filteredPayouts = useMemo(() => {
        let result = [...payouts];

        if (search.trim()) {
            result = result.filter((item) =>
                String(item.transactionId || "")
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        if (sortBy === "newest") {
            result.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );
        } else if (sortBy === "oldest") {
            result.sort(
                (a, b) => new Date(a.date) - new Date(b.date)
            );
        } else if (sortBy === "highest") {
            result.sort((a, b) => b.amount - a.amount);
        } else if (sortBy === "lowest") {
            result.sort((a, b) => a.amount - b.amount);
        }

        return result;
    }, [payouts, search, sortBy]);

    const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;

    const currentPayouts = filteredPayouts.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const formatAmount = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(amount || 0);

    const getStatusBadge = (status) => {
        switch (String(status || "").toLowerCase()) {
            case "paid":
                return "badge bg-success bg-opacity-10 text-success";
            case "pending":
                return "badge bg-warning bg-opacity-10 text-warning";
            case "cancelled":
            case "failed":
                return "badge bg-danger bg-opacity-10 text-danger";
            default:
                return "badge bg-secondary bg-opacity-10 text-secondary";
        }
    };

    return (
        <main>
            {/* Reusable Header */}
            <InstructorHeader />

            <section className="pt-0">
                <div className="container">
                    <div className="row">

                        {/* Reusable Sidebar */}
                        <InstructorSidebar />

                        {/* Main Content */}
                        <div className="col-xl-9">

                            {/* Payout Summary */}
                            <div className="row g-4 mb-4">

                                <div className="col-sm-6 col-md-4">
                                    <div className="border p-3 rounded-3 h-100">
                                        <div className="d-flex mb-1 justify-content-between align-items-center">
                                            <h6 className="mb-0">
                                                Last Month Payout
                                            </h6>
                                            <span className="badge bg-success bg-opacity-10 text-success">
                                                Paid
                                            </span>
                                        </div>

                                        <h2 className="mb-2 mt-2">
                                            --
                                        </h2>

                                        <span className="text-muted small">
                                            Previous month payout
                                        </span>
                                    </div>
                                </div>

                                <div className="col-sm-6 col-md-4">
                                    <div className="border p-3 rounded-3 h-100">
                                        <h6 className="mb-0">
                                            This Month Earning
                                        </h6>

                                        <h2 className="mb-2 mt-2">
                                            --
                                        </h2>

                                        <p className="mb-0 text-muted small">
                                            Current month earnings
                                        </p>
                                    </div>
                                </div>

                                <div className="col-sm-6 col-md-4">
                                    <div className="bg-primary bg-opacity-10 h-100 p-3 rounded-3">
                                        <h6 className="mb-0">
                                            Available Balance
                                        </h6>

                                        <h2 className="mb-2 mt-2">
                                            --
                                        </h2>

                                        <p className="mb-0 small text-muted">
                                            Available payout balance
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* Payout History */}
                            <div className="card border rounded-3">

                                <div className="card-header border-bottom">
                                    <h3 className="mb-0">
                                        Payout History
                                    </h3>
                                </div>

                                <div className="card-body">

                                    {/* Search and Sort */}
                                    <div className="row g-3 align-items-center justify-content-between mb-4">

                                        <div className="col-md-8">
                                            <div className="position-relative">
                                                <input
                                                    className="form-control pe-5 bg-transparent"
                                                    type="search"
                                                    placeholder="Search Transaction ID..."
                                                    aria-label="Search"
                                                    value={search}
                                                    onChange={(e) => {
                                                        setSearch(e.target.value);
                                                        setCurrentPage(1);
                                                    }}
                                                />

                                                <span className="position-absolute top-50 end-0 translate-middle-y me-3">
                                                    <i className="fas fa-search fs-6" />
                                                </span>
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <select
                                                className="form-select border-0 bg-transparent"
                                                value={sortBy}
                                                onChange={(e) => {
                                                    setSortBy(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                            >
                                                <option value="newest">
                                                    Newest First
                                                </option>
                                                <option value="oldest">
                                                    Oldest First
                                                </option>
                                                <option value="highest">
                                                    Highest Amount
                                                </option>
                                                <option value="lowest">
                                                    Lowest Amount
                                                </option>
                                            </select>
                                        </div>

                                    </div>

                                    {/* Payout Table */}
                                    <div className="table-responsive border-0">

                                        <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">

                                            <thead>
                                                <tr>
                                                    <th className="border-0 rounded-start">
                                                        Transaction ID
                                                    </th>
                                                    <th className="border-0">
                                                        Amount
                                                    </th>
                                                    <th className="border-0">
                                                        Status
                                                    </th>
                                                    <th className="border-0 rounded-end">
                                                        Date
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {currentPayouts.length > 0 ? (
                                                    currentPayouts.map((item) => (
                                                        <tr key={item._id}>
                                                            <td>
                                                                <h6 className="mb-0">
                                                                    {item.transactionId}
                                                                </h6>
                                                            </td>

                                                            <td>
                                                                {formatAmount(item.amount)}
                                                            </td>

                                                            <td>
                                                                <span className={getStatusBadge(item.status)}>
                                                                    {item.status}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                {item.date
                                                                    ? new Date(item.date).toLocaleDateString("en-IN")
                                                                    : "--"}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4">
                                                            <div className="text-center py-5">
                                                                <i className="fas fa-wallet fs-1 text-muted mb-3" />

                                                                <h5>
                                                                    No Payout Records Found
                                                                </h5>

                                                                <p className="text-muted mb-0">
                                                                    Your payout transactions
                                                                    will appear here once
                                                                    they are available.
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>

                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {filteredPayouts.length > 0 && (
                                        <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">

                                            <p className="mb-0 text-center text-sm-start">
                                                Showing {startIndex + 1} to{" "}
                                                {Math.min(
                                                    startIndex + itemsPerPage,
                                                    filteredPayouts.length
                                                )}{" "}
                                                of {filteredPayouts.length} entries
                                            </p>

                                            <nav
                                                className="d-flex justify-content-center"
                                                aria-label="Payout pagination"
                                            >
                                                <ul className="pagination pagination-sm pagination-primary-soft mb-0 pb-0">

                                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
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
                                                                onClick={() => setCurrentPage(page)}
                                                            >
                                                                {page}
                                                            </button>
                                                        </li>
                                                    ))}

                                                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
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
                                    )}

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Instructor_Payout;
