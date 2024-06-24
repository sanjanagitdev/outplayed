import React, { useContext } from "react";
import "./home.css";

import { Link } from "react-router-dom";
import {useTranslation} from 'react-i18next';
import Layout from "../layout/layout"
import Slider from "react-slick";
import slide1 from "../../assets/home/slider-1.jpg";
import slide2 from "../../assets/home/slider-2.jpg";
import slide3 from "../../assets/home/slider-3.jpg";

import feature1 from "../../assets/home/feature-icon-1.png";
import feature2 from "../../assets/home/feature-icon-2.png";
import feature3 from "../../assets/home/feature-icon-3.png";
import feature4 from "../../assets/home/feature-icon-4.png";
import LeftSidebar from "../sidebar/leftsidebar";
import RightSidebar from "../sidebar/rightsidebar";
import UserContext from '../../context/context';
import history from "../../config/history";


const Home = ({ }) => {
    const {t} = useTranslation();
    const user = useContext(UserContext);
    const { distributedStats: { SlideNews } } = user;
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
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
    const feature = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
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
        <Layout header={true} footer={true}>
            <div className="home">
                <div className="home-bg">
                    <div className="main-wrapper">
                        <LeftSidebar mainmenu={true} increase={true} community={true} voiceserver={true} />
                        <div className="middle-wrapper">
                            <div className="home-slider-section">
                                <h1> {t('home.mainhead')}</h1>
                                <h3>{t('home.registercompete')} <span>{t('home.prices')}</span></h3>
                                <div className="home-slider">
                                    <Slider {...settings}>
                                        {SlideNews && SlideNews.map((el, i) => {
                                            return <NewsSlider element={el} index={i} />
                                        })}
                                    </Slider>
                                </div>
                            </div>
                            {user.loggedIn ? <div className="feature-stream">
                                <h3>{t('home.featuredstream')}</h3>
                                <Link to="/">Ver más</Link>
                                <div className="feature-slider">
                                    <Slider {...feature}>
                                        <div className="home-slider-img">
                                            <img src={slide1} alt="" />
                                        </div>
                                        <div className="home-slider-img">
                                            <img src={slide2} alt="" />
                                        </div>
                                        <div className="home-slider-img">
                                            <img src={slide3} alt="" />
                                        </div>
                                    </Slider>
                                </div>
                            </div> : <div className="features-section">
                                    <div className="features">
                                        <div className="feature-box">
                                            <img src={feature1} alt="" />
                                            <h4>{t('home.anti-cheat')}</h4>
                                            <p>{t('home.innovative')} <span>{t('home.anti-fraud')}</span> {t('home.detect')}</p>
                                        </div>
                                        <div className="feature-box">
                                            <img src={feature2} alt="" />
                                            <h4>{t('home.complete-win')}</h4>
                                            <p>{t('home.complete-in')} <span>{t('home.hubs-match')}</span> {t('home.and')} <span>{t('home.ladders')}</span> {t('home.incredible')}</p>
                                        </div>
                                        <div className="feature-box">
                                            <img src={feature3} alt="" />
                                            <h4>{t('home.matchmaking')}</h4>
                                            <p>{t('home.pair')} <span>{t('home.players')}</span> {t('home.or')} <span>{t('home.friends')}</span> {t('home.and')} <span>{t('home.similar-level')}</span> </p>
                                        </div>
                                        <div className="feature-box">
                                            <img src={feature4} alt="" />
                                            <h4>{t('home.increase-level')}</h4>
                                            <p>{t('home.progress')} <span>{t('home.climb-positions')}</span> {t('home.enter-to')} <span>{t('scouting-area')}</span> {t('home.jump-professional')}</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <RightSidebar isLogin={user.loggedIn} />
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default Home;

const NewsSlider = ({ element, index }) => {
    const { content, imgurl, title, _id } = element;
    return <div className="home-slider-img" key={index}>
        <img src={imgurl ? imgurl : slide3} alt="tt" />
        <div className="slider-caption" onClick={() => history.push(`/newsdetail/?id=${_id}`)}>
            <h3>{title.substring(0, 40) + ".."}</h3>
            <p>{content.substring(0, 53) + ".."}</p>
        </div>
    </div>
}