import React, { useEffect } from "react";
import AdminWrapper from "../adminwrapper/wrapper";



const AdminDashboard = () => {
    return (
            <AdminWrapper>

                <div className="dashboard">

                  

                    <div className="container">
                    <h2 className="admin-title">Dashboard</h2>
                    <div className="row">
                        <div className="col-sm-6 col-md-6  col-lg-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h6 className="text-muted mb-2">
                                                Total Ads
                                            </h6>
                                            <span className="font-weight-600 h4 mb-0">
                                                12,125
                                            </span>
                                        </div>

                                        <div class="col-auto">
                                            <span class="fa fa-laptop text-muted"></span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6  col-lg-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h6 className="text-muted mb-2">
                                                Categories
                                            </h6>

                                            <span className="font-weight-600 h4 mb-0">
                                                569
                                            </span>
                                        </div>

                                        <div class="col-auto">
                                            <span class="fa fa-align-left text-muted"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6  col-lg-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h6 className="text-muted mb-2">
                                                Total Buy
                                            </h6>

                                            <span className="font-weight-600 h4 mb-0">
                                                35.5%
                                            </span>
                                        </div>

                                        <div class="col-auto">
                                            <span class="fa fa-laptop text-muted"></span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6  col-lg-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h6 className="text-muted mb-2">
                                                Total Sell
                                            </h6>

                                            <span className="font-weight-600 h4 mb-0">
                                                25.36%
                                            </span>
                                        </div>

                                        <div class="col-auto">
                                            <span class="fa fa-arrow-up text-muted"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="col-sm-6 col-md-6  col-lg-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h6 className="text-muted mb-2">
                                                Reviews
                                            </h6>
                                            <span className="font-weight-600 h4 mb-0">
                                                124
                                            </span>
                                        </div>

                                        <div class="col-auto">
                                            <span class="fa fa-thumbs-up text-muted"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6  col-lg-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h6 className="text-muted mb-2">
                                               Total Payout
                                            </h6>

                                            <span className="font-weight-600 h4 mb-0">
                                                $15,233
                                            </span>
                                        </div>

                                        <div class="col-auto">
                                            <span class="fa fa-money text-muted"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6  col-lg-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h6 className="text-muted mb-2">
                                                Total User
                                            </h6>

                                            <span className="font-weight-600 h4 mb-0">
                                               265
                                            </span>
                                        </div>

                                        <div class="col-auto">
                                            <span class="fa fa-user text-muted"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6  col-lg-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h6 className="text-muted mb-2">
                                                Block User
                                            </h6>

                                            <span className="font-weight-600 h4 mb-0">
                                                15
                                            </span>
                                        </div>
                                        <div class="col-auto">
                                            <span class="fa fa-ban text-muted"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>


                    </div>

                </div>
                  
            </AdminWrapper>      
       
    );
  };
  
export default AdminDashboard;