import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './news.css';
import { Link } from 'react-router-dom';
import Layout from '../layout/layout';
import LeftSidebar from '../sidebar/leftsidebar';
import news from '../../assets/news/news.png';
import eye from '../../assets/news/eye-icon.png';
import heart from '../../assets/news/heart-icon.png';
import heartred from '../../assets/news/heart-icon-red.png';
import NewsHeader from './newsheader';
import { NEWS_INSTANCE } from '../../config/axios';
import { showRedIcon } from '../../function';

const News = () => {
  const { t } = useTranslation();
  const [allnews, setNews] = useState([]);
  const [allnewsCopy, setNewsCopy] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Select category');
  const [categoryList, setCategoryList] = useState([
    { type: 'All', active: false },
    { type: 'Tournaments', active: false },
    { type: 'Ladders', active: false },
    { type: 'Gathers', active: false },
    { type: 'Matchmaking', active: false },
  ]);
  const [userid, setUserid] = useState('');
  const [limit, setLimit] = useState(8);
  const [skip, setSkip] = useState(0);

  const nextPage = () => {
    setSkip(skip + limit);
  };

  const previousPage = () => {
    setSkip(skip - limit);
  };
  useEffect(() => {
    NewsListData();
  }, [limit, skip]);
  const NewsListData = async () => {
    const response = await NEWS_INSTANCE().get(`/getnews/${skip}/${limit}`);

    const { code, allnews, userid } = response.data;
    console.log(code, allnews, userid);
    if (code === 200) {
      setNews(allnews);
      setNewsCopy(allnews);
      setUserid(userid);
    }
  };

  const searchCategory = (e) => {
    try {
      let { value } = e.target;
      const exp = new RegExp(value.toLowerCase());
      const filteredData = allnewsCopy.filter(
        (item) =>
          exp.test(item.title.toLowerCase()) ||
          exp.test(item.content.toLowerCase()) ||
          exp.test(item.category.toLowerCase())
      );
      setNews(filteredData);
      setSearch(value);
    } catch (e) {
      return 0;
    }
  };

  const searchByCategory = (type) => {
    try {
      const oldState = [...categoryList];
      const exp = new RegExp(type.toLowerCase());
      const filteredData = allnewsCopy.filter((item) =>
        exp.test(item.category.toLowerCase())
      );
      oldState.forEach((el) => {
        if (el.type === type) {
          setCategory(type);
          el.active = true;
        } else {
          el.active = false;
        }
      });
      setCategoryList(oldState);
      if (type === 'All') {
        setNews(allnewsCopy);
      } else {
        setNews(filteredData);
      }
    } catch (e) {
      return 0;
    }
  };
  const LikeDeslike = async (id) => {
    const response = await NEWS_INSTANCE().put(`/like/${id}`);
    const { code } = response.data;
    if (code === 200) {
      NewsListData();
    }
  };
  return (
    <Layout header={true} footer={true}>
      <div className="news">
        <div className="main-wrapper">
          <LeftSidebar
            mainmenu={true}
            increase={true}
            community={true}
            voiceserver={true}
          />
          <div className="middle-wrapper-full">
            <NewsHeader
              searchCategory={searchCategory}
              search={search}
              searchByCategory={searchByCategory}
              categoryList={categoryList}
              category={category}
              show={true}
            />
            <div className="news-list-content">
              {allnews.length > 0 ? (
                allnews.map((el, i) => (
                  <React.Fragment>
                    <NewsList
                      element={el}
                      index={i}
                      LikeDeslike={LikeDeslike}
                      userid={userid}
                    />
                  </React.Fragment>
                ))
              ) : (
                <div
                  className="news-list-not-found"
                  style={{ marginTop: '15%', marginLeft: '40%' }}
                >
                  <h4 style={{ color: 'white', fontSize: '35px' }}>
                    {t('global.no-data')}
                  </h4>
                </div>
              )}
              {allnews.length > 0 && (
                <div class="button-section">
                  <button
                    disabled={skip <= 0 ? true : false}
                    className="custom-button-css button-css"
                    onClick={() => previousPage()}
                  >
                    {t('global.previous')}
                  </button>{' '}
                  <button
                    disabled={allnews.length <= 0 ? true : false}
                    className="custom-button-css button-css"
                    onClick={() => nextPage()}
                  >
                    {t('global.next')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default News;

const NewsList = ({ element, index, LikeDeslike, userid }) => {
  const { _id, content, title, imgurl, likes, views, category } = element;
  const { t } = useTranslation();
  return (
    <div className="news-list" key={index + _id}>
      <div className="news-thumb">
        <img src={imgurl ? imgurl : news} alt="News" />
      </div>
      <div className="news-info">
        <h4>
          <Link to={`/newsdetail/?id=${_id}`}>
            {content.substring(0, 33) + '..'}
          </Link>
        </h4>
        <div className="news-info-action">
          <div className="news-action-box">
            <img src={eye} alt="eye" />
            {views.length}
            {views.length >= 1000 ? ',K' : null}
          </div>
          <div className="news-action-box">
            <img
              src={showRedIcon(likes, userid) ? heartred : heart}
              alt="heart"
              onClick={() => LikeDeslike(_id)}
              className="heartimg"
            />
            {likes.length}
            {likes.length >= 1000 ? ',K' : null}
          </div>
          <div className="news-action-box category-tag">
            {t('news.category-name')}:
            <span className="news-tag">#{category}</span>
          </div>
        </div>
      </div>
      <div className="news-title">
        <h3>{title.substring(0, 20) + '..'}</h3>
      </div>
    </div>
  );
};
