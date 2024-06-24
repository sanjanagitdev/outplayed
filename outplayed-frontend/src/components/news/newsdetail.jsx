import React, { useState, useEffect } from 'react';
import { TwitterShareButton } from 'react-share';
import { useTranslation } from 'react-i18next';
import './news.css';
import Layout from '../layout/layout';
import LeftSidebar from '../sidebar/leftsidebar';
import NewsHeader from './newsheader';
import eye from '../../assets/news/eye-icon.png';
import heart from '../../assets/news/heart-icon.png';
import heartred from '../../assets/news/heart-icon-red.png';
import share from '../../assets/news/share-icon.png';
import twitter from '../../assets/social/twitter.png';
import user from '../../assets/hubs/user.png';
import { NEWS_INSTANCE } from '../../config/axios';
import {
  queryString,
  getTimeFormate,
  showRedIcon,
  Notification,
  validateComment,
} from '../../function';
import { client } from '../../config/keys';

const NewsDetail = () => {
  const { t } = useTranslation();
  const [newsdata, setNewsData] = useState({});
  const [shareUrl, setShareUrl] = useState('');
  const [comment, setComment] = useState('');
  const [userid, setUserid] = useState('');
  const [errors, setErrors] = useState({});

  const NewsDetailData = async () => {
    const { id } = queryString();
    if (id) {
      const response = await NEWS_INSTANCE().get(`/newsdetail/${id}`);
      const { code, newsData, userid } = response.data;
      if (code === 200) {
        setNewsData(newsData);
        setShareUrl(`${client}/newsdetail/?id=${id}`);
        setUserid(userid);
      }
    }
  };

  useEffect(() => {
    NewsDetailData();
  }, []);

  const postComment = async (e) => {
    const { id } = queryString();
    if (id) {
      let payload = {
        comment,
        news_id: id,
      };
      const { isValid, errors } = validateComment(payload);
      setErrors(errors);
      if (!isValid) {
        return;
      }
      let response = await NEWS_INSTANCE().post('/postcomment', payload);
      let { code, msg, saveComment } = response.data;
      if (code === 200) {
        const { comments } = { ...newsdata };
        comments.unshift(saveComment);
        setNewsData({ ...newsdata, comments: comments });
        setComment('');
      } else {
        Notification('danger', msg);
      }
    }
  };

  const LikeDeslike = async () => {
    const { id } = queryString();
    if (id) {
      const response = await NEWS_INSTANCE().put(`/like/${id}`);
      const { code } = response.data;
      if (code === 200) {
        NewsDetailData();
      }
    }
  };

  const shareTo = (e) => {
    console.log('come', e);
  };

  const { title, content, category, imgurl, likes, comments, views } = newsdata;
  return (
    <Layout header={true} footer={true}>
      <div className="news-detail">
        <div className="main-wrapper">
          <LeftSidebar
            mainmenu={true}
            increase={true}
            community={true}
            voiceserver={true}
          />
          <div className="middle-wrapper-full">
            <NewsHeader show={false} />
            <div className="news-detail-content">
              <div className="news-detail-image">
                <div className="social-share">
                  <div className="news-info-action">
                    <div className="news-action-box">
                      <img src={eye} alt="eye" />
                      {views && (
                        <React.Fragment>
                          {views.length}
                          {views.length >= 1000 ? ',K' : null}
                        </React.Fragment>
                      )}
                    </div>

                    <div className="news-action-box">
                      {likes && (
                        <img
                          src={showRedIcon(likes, userid) ? heartred : heart}
                          alt="heart"
                          onClick={LikeDeslike}
                        />
                      )}
                      {likes && (
                        <React.Fragment>
                          {likes.length}
                          {likes.length >= 1000 ? ',K' : null}
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                </div>
                <img className="news-cover" src={imgurl} alt="sssI" />
                <div className="detail-title">
                  <h2>{title}</h2>
                </div>
              </div>
              <div className="detail-news">
                <div className="news-share">
                  <div className="news-action-box category-tag">
                    {t('news.category-name')}:
                    <span className="news-tag">#{category}</span>
                  </div>
                  <div className="share-twitter">
                    <TwitterShareButton
                      url={shareUrl}
                      title={title}
                      className="Demo__some-network__share-button"
                      beforeOnClick={shareTo}
                    >
                      <img src={share} alt="share" />
                      <span>0</span>
                      <img src={twitter} alt="twitter" />
                    </TwitterShareButton>
                  </div>
                </div>
                <p>{content}</p>
              </div>
              <div className="comment-section">
                <div className="comment-content">
                  <div className="row">
                    <div className="col-md-12">
                      <h2>{t('news.comment')}</h2>
                      <div className="comment-box">
                        <div className="comment-pic">
                          <img src={user} alt="user" />
                        </div>
                        <div className="comment-detail post-comment">
                          <textarea
                            required={true}
                            placeholder={t('news.message')}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          >
                            {comment}
                          </textarea>
                          <p>
                            {errors.comment && (
                              <span style={{ color: 'red' }}>
                                {errors.comment}
                              </span>
                            )}
                          </p>
                          <button
                            type="submit"
                            className="drop-comment"
                            onClick={() => postComment()}
                          >
                            {t('news.dropcomment')}
                          </button>
                        </div>
                      </div>
                      {comments &&
                        comments.map((el, i) => {
                          return <CommentBox element={el} index={i} />;
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default NewsDetail;

const CommentBox = ({ element, index }) => {
  const {
    comment,
    date,
    commentby: { useravatar, username },
  } = element;
  return (
    <div className="comment-box1" key={index}>
      <div className="comment-pic1">
        <img
          src={useravatar ? useravatar : user}
          alt="user"
          className="comment-img"
        />
      </div>

      <div className="comment-detail">
        <h5>
          {username} <span>{getTimeFormate(new Date(date))}</span>
        </h5>
        <p>{comment}. </p>
      </div>
    </div>
  );
};
