import React from 'react';
import InstructorHeader from './components/InstructorHeader';
import InstructorSidebar from './components/InstructorSidebar';

function Instructor_Order(props) {
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
          {/* Card START */}
          <div className="card border rounded-3">
            {/* Card header START */}
            <div className="card-header border-bottom">
              <h3 className="mb-0">Order List</h3>
            </div>
            {/* Card header END */}
            {/* Card body START */}
            <div className="card-body">
              {/* Search and select START */}
              <div className="row g-3 align-items-center justify-content-between mb-4">
                {/* Search */}
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
              {/* Search and select END */}
              {/* Order list table START */}
              <div className="table-responsive border-0">
                {/* Table START */}
                <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                  {/* Table head */}
                  <thead>
                    <tr>
                      <th scope="col" className="border-0 rounded-start">Course name</th>
                      <th scope="col" className="border-0">Order ID</th>
                      <th scope="col" className="border-0">Date</th>
                      <th scope="col" className="border-0">Amount</th>
                      <th scope="col" className="border-0 rounded-end">Payment</th>
                    </tr>
                  </thead>
                  {/* Table body START */}
                  <tbody>
                    {/* Table item */}
                    <tr>
                      {/* Table data */}
                      <td>
                        <h6 className="mt-2 mt-lg-0 mb-0"><a href="#">The complete Digital Marketing Course - 8 Course in 1</a></h6>
                      </td>
                      {/* Table data */}
                      <td className="text-center text-sm-start text-primary-hover">
                        <a href="#" className="text-body"><u>#125489</u></a>
                      </td>
                      {/* Table data */}
                      <td>18/8/2021</td>
                      {/* Table data */}
                      <td>$356</td>
                      {/* Table data */}
                      <td>Credit Card</td>
                    </tr>
                    {/* Table item */}
                    <tr>
                      {/* Table data */}
                      <td>
                        <h6 className="mt-2 mt-lg-0 mb-0"><a href="#">Time Management Mastery: Do More, Stress Less</a></h6>
                      </td>
                      {/* Table data */}
                      <td className="text-center text-sm-start text-primary-hover">
                        <a href="#" className="text-body"><u>#235486</u></a>
                      </td>
                      {/* Table data */}
                      <td>25/7/2021</td>
                      {/* Table data */}
                      <td>$186</td>
                      {/* Table data */}
                      <td>Debit Card</td>
                    </tr>
                    {/* Table item */}
                    <tr>
                      {/* Table data */}
                      <td>
                        <h6 className="mt-2 mt-lg-0 mb-0"><a href="#">Building Scalable APIs with GraphQL</a></h6>
                      </td>
                      {/* Table data */}
                      <td className="text-center text-sm-start text-primary-hover">
                        <a href="#" className="text-body"><u>#0215789</u></a>
                      </td>
                      {/* Table data */}
                      <td>4/9/2020</td>
                      {/* Table data */}
                      <td>$450</td>
                      {/* Table data */}
                      <td>Paypal</td>
                    </tr>
                    {/* Table item */}
                    <tr>
                      {/* Table data */}
                      <td>
                        <h6 className="mt-2 mt-lg-0 mb-0"><a href="#">Sketch from A to Z: for app designer</a></h6>
                      </td>
                      {/* Table data */}
                      <td className="text-center text-sm-start text-primary-hover">
                        <a href="#" className="text-body"><u>#0135689</u></a>
                      </td>
                      {/* Table data */}
                      <td>5/6/2021</td>
                      {/* Table data */}
                      <td>$0</td>
                      {/* Table data */}
                      <td>Free</td>
                    </tr>
                    {/* Table item */}
                    <tr>
                      {/* Table data */}
                      <td>
                        <h6 className="mt-2 mt-lg-0 mb-0"><a href="#">Build Responsive Websites with HTML</a></h6>
                      </td>
                      {/* Table data */}
                      <td className="text-center text-sm-start text-primary-hover">
                        <a href="#" className="text-body"><u>#0587623</u></a>
                      </td>
                      {/* Table data */}
                      <td>2/6/2021</td>
                      {/* Table data */}
                      <td>$250</td>
                      {/* Table data */}
                      <td>Credit Card</td>
                    </tr>
                    {/* Table item */}
                    <tr>
                      {/* Table data */}
                      <td>
                        <h6 className="mt-2 mt-lg-0 mb-0"><a href="#">JavaScript: Full Understanding</a></h6>
                      </td>
                      {/* Table data */}
                      <td className="text-center text-sm-start text-primary-hover">
                        <a href="#" className="text-body"><u>#0215789</u></a>
                      </td>
                      {/* Table data */}
                      <td>14/1/2021</td>
                      {/* Table data */}
                      <td>$325</td>
                      {/* Table data */}
                      <td>Debit Card</td>
                    </tr>
                  </tbody>
                  {/* Table body END */}
                </table>
                {/* Table END */}
              </div>
              {/* Order list table END */}
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
          {/*Card END  */}
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

export default Instructor_Order;