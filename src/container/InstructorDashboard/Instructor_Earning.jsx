import React from 'react';
import InstructorHeader from './components/InstructorHeader';
import InstructorSidebar from './components/InstructorSidebar';

function Instructor_Earning(props) {
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
          {/* Earning boxes START */}
          <div className="row g-4">
            {/* Earning item */}
            <div className="col-sm-6 col-lg-4">
              <div className="text-center p-4 bg-light rounded-3">
                <h6 className="text-body">Sales this month</h6>
                <h2 className="mb-0 fs-1">$899.95</h2>
              </div>
            </div>
            {/* Earning item */}
            <div className="col-sm-6 col-lg-4">
              <div className="text-center p-4 bg-light rounded-3">
                <h6 className="text-body">To be paid
                  <a tabIndex={0} className="h6 mb-0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="After US royalty withholding tax">
                    <i className="bi bi-info-circle-fill small" />
                  </a>
                </h6>
                <h2 className="mb-0 fs-1">$750.35</h2>
              </div>
            </div>
            {/* Earning item */}
            <div className="col-sm-6 col-lg-4">
              <div className="text-center p-4 bg-light rounded-3">
                <h6 className="text-body">Lifetime Earnings</h6>
                <h2 className="mb-0 fs-1">$4882.65</h2>
              </div>
            </div>
          </div>
          {/* Earning boxes END */}
          {/* Chart START */}
          <div className="card card-body rounded-top border overflow-hidden p-0 mt-5">
            <div className="row g-4 p-4">
              {/* Content */}
              <div className="col-sm-6 col-md-4">
                <span className="badge bg-dark text-white">Current Month</span>
                <h4 className="text-primary my-2">$35000</h4>
                <p className="mb-0"><span className="text-success me-1">0.20%<i className="bi bi-arrow-up" /></span>vs last month</p>
              </div>
              {/* Content */}
              <div className="col-sm-6 col-md-4">
                <span className="badge bg-dark text-white">Last Month</span>
                <h4 className="my-2">$28000</h4>
                <p className="mb-0"><span className="text-danger me-1">0.10%<i className="bi bi-arrow-down" /></span>Then last month</p>
              </div>
            </div>
            {/* Apex chart */}
            <div id="ChartPayoutEarning" />
          </div>
          {/* Chart END */}
          {/* Earning chart START */}
          <div className="card border rounded-3 mt-5">
            {/* Card title */}
            <div className="card-header">
              <h5 className="mb-0">Top five earning sources</h5>
            </div>
            {/* Card body */}
            <div className="card-body">
              <div className="row g-4 g-md-5 align-items-center">
                {/* Chart */}
                <div className="col-md-6">
                  <div id="ChartPageViews" />
                </div>
                {/* Content */}
                <div className="col-md-6">
                  <ul className="list-group list-group-borderless mb-3">
                    <li className="list-group-item"><h6 className="mb-0">Course Name</h6></li>
                    <li className="list-group-item"><i className="text-success fas fa-circle me-2" />The Complete Digital Marketing Course - 12 Courses in 1</li>
                    <li className="list-group-item"><i className="text-warning fas fa-circle me-2" />Google Ads Training: Become a PPC Expert</li>
                    <li className="list-group-item"><i className="text-danger fas fa-circle me-2" />Microsoft Excel - Excel from Beginner to Advanced</li>
                    <li className="list-group-item"><i className="text-primary fas fa-circle me-2" />Create a Design System in Figma</li>
                    <li className="list-group-item"><i className="text-secondary fas fa-circle me-2" />Deep Learning with React-Native</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Earning chart END */}
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

export default Instructor_Earning;