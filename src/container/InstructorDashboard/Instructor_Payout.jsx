import React from 'react';
import InstructorHeader from './components/InstructorHeader';
import InstructorSidebar from './components/InstructorSidebar';

function Instructor_Payout(props) {
    return (
     <main>
      {/* Reusable profile header banner */}
      <InstructorHeader />

      {/* Page content START */}
      <section className="pt-0">
        <div className="container">
          <div className="row">
            
            {/* Reusable navigation sidebar */}
            <InstructorSidebar />

            {/* Main content START */}
            <div className="col-xl-9">
          {/* Payout box START */}
          <div className="row g-4 mb-4">
            {/* Box item */}
            <div className="col-sm-6 col-md-4">
              <div className="border p-3 rounded-3 h-100">
                <div className="d-flex mb-1 justify-content-between align-items-center">
                  <h6 className="mb-0">Last month payout</h6>
                  <span className="badge bg-success bg-opacity-10 text-success ms-2 mb-0">Paid</span>
                </div>
                <h2 className="mb-2 mt-2">$12,825</h2>
                <a href="#">View transaction</a>
              </div>
            </div>
            {/* Box item */}
            <div className="col-sm-6 col-md-4">
              <div className="border p-3 rounded-3 h-100">
                <h6 className="mb-0">This month earning</h6>
                <h2 className="mb-2 mt-2">$15,356</h2>
                <p className="mb-0">Expected payout on 05/08/2021</p>
              </div>
            </div>
            {/* Box item */}
            <div className="col-sm-6 col-md-4">
              <div className="bg-primary bg-opacity-10 h-100 p-3 rounded-3">
                <h6 className="mb-0">Balance</h6>
                <h2 className="mb-2 mt-2">$8,485</h2>
                <a href="#" className="btn btn-sm btn-primary mb-0">Withdraw Earning</a>
              </div>
            </div>
          </div>
          {/* Payout box END */}
          <div className="card border rounded-3">
            {/* Card header START */}
            <div className="card-header border-bottom">
              <h3 className="mb-0">Payouts</h3>
            </div>
            {/* Card header END */}
            {/* Card body START */}
            <div className="card-body">
              {/* Title and select START */}
              <div className="row g-3 align-items-center justify-content-between mb-4">
                {/* Content */}
                <div className="col-md-8">
                  <form className="rounded position-relative">
                    <input className="form-control pe-5 bg-transparent" type="search" placeholder="Search" aria-label="Search" />
                    <button className="btn bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y" type="submit"><i className="fas fa-search fs-6 " /></button>
                  </form>
                </div>
                {/* Select option */}
                <div className="col-md-3">
                  {/* Short by filter */}
                  <form>
                    <select className="form-select js-choice border-0 z-index-9 bg-transparent" aria-label=".form-select-sm">
                      <option value>Sort by</option>
                      <option>Free</option>
                      <option>Newest</option>
                      <option>Oldest</option>
                    </select>
                  </form>
                </div>
              </div>
              {/* Title and select END */}
              {/* Payout list table START */}
              <div className="table-responsive border-0">
                <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                  {/* Table head */}
                  <thead>
                    <tr>
                      <th scope="col" className="border-0 rounded-start">Payout</th>
                      <th scope="col" className="border-0">Amount</th>
                      <th scope="col" className="border-0">Status</th>
                      <th scope="col" className="border-0 rounded-end">Date</th>
                    </tr>
                  </thead>
                  {/* Table body START */}
                  <tbody>
                    {/* Table item */}
                    <tr>
                      {/* Table data */}
                      <td>
                        <h6 className="mt-2 mt-lg-0 mb-0"><a href="#">Successful payout #102356</a></h6>
                      </td>
                      {/* Table data */}
                      <td>$3,999
                        {/* Drop down with id */}
                        <a href="#" className="h6 mb-0" role="button" id="dropdownShare" data-bs-toggle="dropdown" aria-expanded="false">
                          <i className="bi bi-info-circle-fill" />
                        </a>
                        <ul className="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded" aria-labelledby="dropdownShare">
                          <li>
                            <div className="d-flex justify-content-between">
                              <span className="small">Commission</span>
                              <span className="h6 mb-0 small">$86</span>
                            </div>
                            <hr className="my-1" />
                          </li>
                          {/* Divider */}
                          <li>
                            <div className="d-flex justify-content-between">
                              <span className="me-4 small">Us royalty withholding</span>
                              <span className="text-danger small">-$0.00</span>
                            </div>
                            <hr className="my-1" />
                          </li>
                          <li>
                            <div className="d-flex justify-content-between">
                              <span className="small">Earning</span>
                              <span className="h6 mb-0 small">$86</span>
                            </div>
                          </li>
                        </ul>
                      </td>
                      {/* Table data */}
                      <td className="text-center text-sm-start">
                        <span className="badge bg-success bg-opacity-10 text-success">Paid</span>
                      </td>
                      {/* Table data */}
                      <td>18/8/2021</td>
                    </tr>
                    {/* Table item */}
                    <tr>
                      {/* Table data */}
                      <td>
                        {/* Title */}
                        <h6 className="mt-2 mt-lg-0 mb-0"><a href="#">Successful payout #102589</a></h6>
                      </td>
                      {/* Table data */}
                      <td>$4,875
                        {/* Drop down with id */}
                        <a href="#" className="h6 mb-0" role="button" id="dropdownShare1" data-bs-toggle="dropdown" aria-expanded="false">
                          <i className="bi bi-info-circle-fill" />
                        </a>
                        <ul className="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded" aria-labelledby="dropdownShare1">
                          <li>
                            <div className="d-flex justify-content-between">
                              <span className="small">Commission</span>
                              <span className="h6 mb-0 small">$86</span>
                            </div>
                            <hr className="my-1" />
                          </li>
                          {/* Divider */}
                          <li>
                            <div className="d-flex justify-content-between">
                              <span className="me-4 small">Us royalty withholding</span>
                              <span className="text-danger small">-$0.00</span>
                            </div>
                            <hr className="my-1" />
                          </li>
                          <li>
                            <div className="d-flex justify-content-between">
                              <span className="small">Earning</span>
                              <span className="h6 mb-0 small">$86</span>
                            </div>
                          </li>
                        </ul>
                      </td>
                      {/* Table data */}
                      <td className="text-center text-sm-start">
                        <span className="badge bg-success bg-opacity-10 text-success">Paid</span>
                      </td>
                      {/* Table data */}
                      <td>12/8/2021</td>
                    </tr>
                    {/* Table item */}
                    <tr>
                      {/* Table data */}
                      <td>
                        <h6 className="mt-2 mt-lg-0 mb-0"><a href="#">Successful payout #108645</a></h6>
                      </td>
                      {/* Table data */}
                      <td>$1,800
                        {/* Drop down with id */}
                        <a href="#" className="h6 mb-0" role="button" id="dropdownShare2" data-bs-toggle="dropdown" aria-expanded="false">
                          <i className="bi bi-info-circle-fill" />
                        </a>
                        <ul className="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded" aria-labelledby="dropdownShare2">
                          <li>
                            <div className="d-flex justify-content-between">
                              <span className="small">Commission</span>
                              <span className="h6 mb-0 small">$86</span>
                            </div>
                            <hr className="my-1" />
                          </li>
                          {/* Divider */}
                          <li>
                            <div className="d-flex justify-content-between">
                              <span className="me-4 small">Us royalty withholding</span>
                              <span className="text-danger small">-$0.00</span>
                            </div>
                            <hr className="my-1" />
                          </li>
                          <li>
                            <div className="d-flex justify-content-between">
                              <span className="small">Earning</span>
                              <span className="h6 mb-0 small">$86</span>
                            </div>
                          </li>
                        </ul>
                      </td>
                      {/* Table data */}
                      <td className="text-center text-sm-start">
                        <span className="badge bg-danger bg-opacity-10 text-danger">Cancelled </span>
                      </td>
                      {/* Table data */}
                      <td>22/8/2021</td>
                    </tr>
                    {/* Table item */}
                    <tr>
                      {/* Table data */}
                      <td>
                        <h6 className="mt-2 mt-lg-0 mb-0"><a href="#">Successful payout #108645</a></h6>
                      </td>
                      {/* Table data */}
                      <td>$6,800
                        {/* Drop down with id */}
                        <a href="#" className="h6 mb-0" role="button" id="dropdownShare3" data-bs-toggle="dropdown" aria-expanded="false">
                          <i className="bi bi-info-circle-fill" />
                        </a>
                        <ul className="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded" aria-labelledby="dropdownShare3">
                          <li>
                            <div className="d-flex justify-content-between">
                              <span className="small">Commission</span>
                              <span className="h6 mb-0 small">$86</span>
                            </div>
                            <hr className="my-1" />
                          </li>
                          {/* Divider */}
                          <li>
                            <div className="d-flex justify-content-between">
                              <span className="me-4 small">Us royalty withholding</span>
                              <span className="text-danger small">-$0.00</span>
                            </div>
                            <hr className="my-1" />
                          </li>
                          <li>
                            <div className="d-flex justify-content-between">
                              <span className="small">Earning</span>
                              <span className="h6 mb-0 small">$86</span>
                            </div>
                          </li>
                        </ul>
                      </td>
                      {/* Table data */}
                      <td className="text-center text-sm-start">
                        <span className="badge bg-success bg-opacity-10 text-success">Paid</span>
                      </td>
                      {/* Table data */}
                      <td>28/8/2021</td>
                    </tr>
                    {/* Table item */}
                    <tr>
                      {/* Table data */}
                      <td>
                        {/* Title */}
                        <h6 className="mt-2 mt-lg-0 mb-0"><a href="#">Successful payout #108645</a></h6>
                      </td>
                      {/* Table data */}
                      <td>$3,576
                        {/* Drop down with id */}
                        <a href="#" className="h6 mb-0" role="button" id="dropdownShare4" data-bs-toggle="dropdown" aria-expanded="false">
                          <i className="bi bi-info-circle-fill" />
                        </a>
                        <ul className="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded" aria-labelledby="dropdownShare4">
                          <li>
                            <div className="d-flex justify-content-between">
                              <span className="small">Commission</span>
                              <span className="h6 mb-0 small">$86</span>
                            </div>
                            <hr className="my-1" />
                          </li>
                          {/* Divider */}
                          <li>
                            <div className="d-flex justify-content-between">
                              <span className="me-4 small">Us royalty withholding</span>
                              <span className="text-danger small">-$0.00</span>
                            </div>
                            <hr className="my-1" />
                          </li>
                          <li>
                            <div className="d-flex justify-content-between">
                              <span className="small">Earning</span>
                              <span className="h6 mb-0 small">$86</span>
                            </div>
                          </li>
                        </ul>
                      </td>
                      {/* Table data */}
                      <td className="text-center text-sm-start">
                        <span className="badge bg-orange bg-opacity-10 text-orange">Pending</span>
                      </td>
                      {/* Table data */}
                      <td>12/8/2021</td>
                    </tr>
                  </tbody>
                  {/* Table body END */}
                </table>
              </div>
              {/* Payout list table END */}
              {/* Pagination START */}
              <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
                {/* Content */}
                <p className="mb-0 text-center text-sm-start">Showing 1 to 8 of 20 entries</p>
                {/* Pagination */}
                <nav className="d-flex justify-content-center mb-0" aria-label="navigation">
                  <ul className="pagination pagination-sm pagination-primary-soft mb-0 pb-0">
                    <li className="page-item mb-0"><a className="page-link" href="#" tabIndex={-1}><i className="fas fa-angle-left" /></a></li>
                    <li className="page-item mb-0"><a className="page-link" href="#">1</a></li>
                    <li className="page-item mb-0 active"><a className="page-link" href="#">2</a></li>
                    <li className="page-item mb-0"><a className="page-link" href="#">3</a></li>
                    <li className="page-item mb-0"><a className="page-link" href="#"><i className="fas fa-angle-right" /></a></li>
                  </ul>
                </nav>
              </div>
              {/* Pagination END */}
            </div>
            {/* Card body START */}
          </div>
          {/* Payout END */}
        </div>
        {/* Main content END */}
      </div>{/* Row END */}
    </div>
  </section>
  {/* =======================
Page content END */}
</main>

    );
}

export default Instructor_Payout;