import React from "react";
import "./matchmaking.css";
import { Link, NavLink } from "react-router-dom";

import Slider from "react-slick";
import slide1 from "../../assets/home/slider-1.jpg";
import slide2 from "../../assets/home/slider-2.jpg";
import slide3 from "../../assets/home/slider-3.jpg";


const FeaturedStreaming = () => {


    const feature = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ]
      };


    return (

        <div className="feature-streaming">

                <div className="feature-stream">
                        <h3>Featured streams <Link to="/">See more streamings</Link></h3>
                        

                        <div className="feature-slider">

                            <Slider {...feature}>
                                    <div className="home-slider-img">
                                        <img src={slide1} alt="" />
                                        <div className="feature-slider-info">
                                            <span>crisoW</span>
                                        </div>
                                    </div>
                                    <div className="home-slider-img">
                                        <img src={slide2} alt="" />
                                        <div className="feature-slider-info">
                                            <span>flipiN</span>
                                        </div>
                                    </div>
                                    <div className="home-slider-img">
                                        <img src={slide3} alt="" />
                                        <div className="feature-slider-info">
                                            <span>ratkiD</span>
                                        </div>
                                    </div>
                                    <div className="home-slider-img">
                                        <img src={slide1} alt="" />
                                        <div className="feature-slider-info">
                                            <span>peuroY</span>
                                        </div>
                                    </div>
                                </Slider>

                        </div>

                </div>

        </div>

    );
};
  
export default FeaturedStreaming;