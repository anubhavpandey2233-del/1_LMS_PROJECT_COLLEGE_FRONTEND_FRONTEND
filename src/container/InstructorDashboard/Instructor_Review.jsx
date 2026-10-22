import React from 'react';
import InstructorHeader from './components/InstructorHeader';
import InstructorSidebar from './components/InstructorSidebar';

function Instructor_Review(props) {
    return (
   <main>
      {/* Reusable profile header banner */}
      <InstructorHeader />

      {/* Inner part START */}
      <section className="pt-0">
        <div className="container">
          <div className="row">
            
            {/* Reusable navigation sidebar */}
            <InstructorSidebar />

            {/* Main content START */}
            <div className="col-xl-9">
          {/* Student review START */}
          <div className="card border rounded-3">
            {/* Header START */}
            <div className="card-header border-bottom">
              <div className="row justify-content-between align-middle">
                {/* Title */}
                <div className="col-sm-6">
                  <h3 className="card-header-title mb-2 mb-sm-0">Student review</h3>
                </div>
                {/* Short by filter */}
                <div className="col-sm-4">
                  <form>
                    <select className="form-select js-choice z-index-9 bg-white" aria-label=".form-select-sm">
                      <option value>Sort by</option>
                      <option>★★★★★ (5/5)</option>
                      <option>★★★★☆ (4/5)</option>
                      <option>★★★☆☆ (3/5)</option>
                      <option>★★☆☆☆ (2/5)</option>
                      <option>★☆☆☆☆ (1/5)</option>
                    </select>
                  </form>
                </div>
              </div>
            </div>
            {/* Header END */}
            {/* Reviews START */}
            <div className="card-body mt-2 mt-sm-4">
              {/* Review item START */}
              <div className="d-sm-flex">
                {/* Avatar image */}
                <img className="avatar avatar-lg rounded-circle float-start me-3" src="assets/images/avatar/01.jpg" alt="avatar" />
                <div>
                  <div className="mb-3 d-sm-flex justify-content-sm-between align-items-center">
                    {/* Title */}
                    <div>
                      <h5 className="m-0">Frances Guerrero</h5>
                      <span className="me-3 small">June 11, 2021 at 6:01 am </span>
                    </div>
                    {/* Review star */}
                    <ul className="list-inline mb-0">
                      <li className="list-inline-item me-0"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0"><i className="far fa-star text-warning" /></li>
                    </ul>	
                  </div>
                  {/* Content */}
                  <h6><span className="text-body fw-light">Review on:</span> How to implement sitemap on sass</h6>
                  <p>Satisfied conveying a dependent contented he gentleman agreeable do be. Warrant private blushes removed an in equally totally if. Delivered dejection necessary objection do Mr prevailed. Mr feeling does chiefly cordial in do. </p>
                  {/* Button */}
                  <div className="text-end">
                    <a href="#" className="btn btn-sm btn-primary-soft mb-1 mb-sm-0">Direct message</a>
                    <a className="btn btn-sm btn-light mb-0" data-bs-toggle="collapse" href="#collapseComment" role="button" aria-expanded="false" aria-controls="collapseComment">
                      Reply
                    </a>
                    {/* collapse textarea */}
                    <div className="collapse show" id="collapseComment">
                      <div className="d-flex mt-3">
                        <textarea className="form-control mb-0" placeholder="Add a comment..." rows={2} spellCheck="false" defaultValue={""} />
                        <button className="btn btn-sm btn-primary-soft ms-2 px-4 mb-0 flex-shrink-0"><i className="fas fa-paper-plane fs-5" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Divider */}
              <hr />
              {/* Review item END */}
              {/* Review item START */}
              <div className="d-sm-flex">
                {/* Avatar image */}
                <img className="avatar avatar-lg rounded-circle float-start me-3" src="assets/images/avatar/03.jpg" alt="avatar" />
                <div>
                  <div className="mb-3 d-sm-flex justify-content-sm-between align-items-center">
                    {/* Title */}
                    <div>
                      <h5 className="m-0">Louis Ferguson</h5>
                      <span className="me-3 small">June 18, 2021 at 11:55 am</span>
                    </div>
                    {/* Review star */}
                    <ul className="list-inline mb-0">
                      <li className="list-inline-item me-0 small"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0 small"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0 small"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0 small"><i className="fas fa-star-half-alt text-warning" /></li>
                      <li className="list-inline-item me-0 small"><i className="far fa-star text-warning" /></li>
                    </ul>
                  </div>
                  {/* Content */}
                  <h6><span className="text-body fw-light">Review on:</span> How does an Angular application work?</h6>
                  <p>Far advanced settling say finished raillery. Offered chiefly farther Satisfied conveying a dependent contented he gentleman agreeable do be. Warrant private blushes removed an in equally totally if. Delivered dejection necessary objection do Mr prevailed. Mr feeling does chiefly cordial in do. </p>
                  {/* Button */}
                  <div className="text-end">
                    <a href="#" className="btn btn-sm btn-primary-soft mb-0">Direct message</a>
                    <a href="#" className="btn btn-sm btn-light mb-0">Reply</a>
                  </div>
                </div>
              </div>
              {/* Divider */}
              <hr />
              {/* Review item END */}
              {/* Review item START */}
              <div className="d-sm-flex">
                {/* Avatar image */}
                <img className="avatar avatar-lg rounded-circle float-start me-3" src="assets/images/avatar/05.jpg" alt="avatar" />
                <div>
                  <div className="mb-3 d-sm-flex justify-content-sm-between align-items-center">
                    {/* Title */}
                    <div>
                      <h5 className="m-0">Carolyn Ortiz</h5>
                      <span className="me-3 small">August 28, 2021 at 3:08 pm</span>
                    </div>
                    {/* Review star */}
                    <ul className="list-inline mb-0">
                      <li className="list-inline-item me-0 small"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0 small"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0 small"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0 small"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0 small"><i className="far fa-star text-warning" /></li>
                    </ul>
                  </div>
                  {/* Content */}
                  <h6><span className="text-body fw-light">Review on:</span> What is Flexbox and describe any elaborate on its most used properties??</h6>
                  <p>Offered chiefly farther Satisfied conveying a dependent contented he gentleman agreeable do be. Warrant private blushes removed an in equally totally if. Delivered dejection necessary objection do Mr prevailed. Mr feeling does chiefly cordial in do. </p>
                  {/* Button */}
                  <div className="text-end">
                    <a href="#" className="btn btn-sm btn-primary-soft mb-0">Direct message</a>
                    <a href="#" className="btn btn-sm btn-light mb-0">Reply</a>
                  </div>
                </div>
              </div>
              {/* Divider */}
              <hr />
              {/* Review item END */}
              {/* Review item START */}
              <div className="d-sm-flex">
                {/* Avatar image */}
                <img className="avatar avatar-lg rounded-circle float-start me-3" src="assets/images/avatar/08.jpg" alt="avatar" />
                <div>
                  <div className="mb-3 d-sm-flex justify-content-sm-between align-items-center">
                    {/* Title */}
                    <div>
                      <h5 className="m-0">Dennis Barrett</h5>
                      <span className="me-3 small">August 29, 2021 at 5:35 pm</span>
                    </div>
                    {/* Review star */}
                    <ul className="list-inline mb-0">
                      <li className="list-inline-item me-0 small"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0 small"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0 small"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0 small"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0 small"><i className="far fa-star text-warning" /></li>
                    </ul>
                  </div>
                  {/* Content */}
                  <h6><span className="text-body fw-light">Review on:</span> What are the different data types present in javascript?</h6>
                  <p>Chiefly farther Satisfied conveying a dependent contented he gentleman agreeable do be. Warrant private blushes removed an in equally totally if. Delivered dejection necessary objection do Mr prevailed. Mr feeling does chiefly cordial in do. </p>
                  {/* Button */}
                  <div className="text-end">
                    <a href="#" className="btn btn-sm btn-primary-soft mb-0">Direct message</a>
                    <a href="#" className="btn btn-sm btn-light mb-0">Reply</a>
                  </div>
                </div>
              </div>
              {/* Divider */}
              <hr />
              {/* Review item END */}
              {/* Review item START */}
              <div className="d-sm-flex">
                {/* Avatar image */}
                <img className="avatar avatar-lg rounded-circle float-start me-3" src="assets/images/avatar/09.jpg" alt="avatar" />
                <div>
                  <div className="mb-3 d-sm-flex justify-content-sm-between align-items-center">
                    {/* Title */}
                    <div>
                      <h5 className="m-0">Carolyn Ortiz</h5>
                      <span className="me-3 small">September 15, 2021 at 8:28 am</span>
                    </div>
                    {/* Review star */}
                    <ul className="list-inline mb-0">
                      <li className="list-inline-item me-0 small"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0 small"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0 small"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0 small"><i className="fas fa-star text-warning" /></li>
                      <li className="list-inline-item me-0 small"><i className="far fa-star text-warning" /></li>
                    </ul>
                  </div>
                  {/* Content */}
                  <h6><span className="text-body fw-light">Review on:</span> What are object prototypes?</h6>
                  <p>Chiefly farther Satisfied conveying a dependent contented he gentleman agreeable do be. Warrant private blushes removed an in equally totally if. Delivered dejection necessary objection do Mr prevailed. Mr feeling does chiefly cordial in do. </p>
                  {/* Button */}
                  <div className="text-end">
                    <a href="#" className="btn btn-sm btn-primary-soft mb-0">Direct message</a>
                    <a href="#" className="btn btn-sm btn-light mb-0">Reply</a>
                  </div>
                </div>
              </div>
              {/* Review item END */}
            </div>
            {/* Reviews END */}
            <div className="card-footer border-top">
              {/* Pagination START */}
              <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                {/* Content */}
                <p className="mb-0 text-center text-sm-start">Showing 1 to 8 of 20 entries</p>
                {/* Pagination */}
                <nav className="d-flex justify-content-center mb-0" aria-label="navigation">
                  <ul className="pagination pagination-sm pagination-primary-soft my-0 py-0">
                    <li className="page-item my-0"><a className="page-link" href="#" tabIndex={-1}><i className="fas fa-angle-left" /></a></li>
                    <li className="page-item my-0"><a className="page-link" href="#">1</a></li>
                    <li className="page-item my-0 active"><a className="page-link" href="#">2</a></li>
                    <li className="page-item my-0"><a className="page-link" href="#">3</a></li>
                    <li className="page-item my-0"><a className="page-link" href="#"><i className="fas fa-angle-right" /></a></li>
                  </ul>
                </nav>
              </div>
              {/* Pagination END */}
            </div>
          </div>
          {/* Student review END */}
        </div>
        {/* Main content END */}
      </div>{/* Row END */}
    </div>
  </section>
  {/* =======================
Inner part END */}
</main>

    );
}

export default Instructor_Review;