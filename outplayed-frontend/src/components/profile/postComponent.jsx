/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon } from 'react-share';
import player from '../../assets/header/user-icon.png';
import arrow from '../../assets/header/arrow-down.png';
import { client } from './../../config/keys';

const SocailPost = ({ element, index, functions }) => {
  const { content, createdAt, comments, likes, postedby, selected, _id } =
    element ? element : {};

  const [showRemainingImages, setshowRemainingImages] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);

  const { images } = element ? element : {};
  let [remainingImages, setremainingImages] = useState([]);

  useEffect(() => {
    if (images.length > 3) {
      setremainingImages([...images.splice(3, images.length)]);
    }
  }, []);

  const { username } = postedby ? postedby : {};
  const {
    openCloseComment,
    addPostReact,
    addComment,
    setComment,
    commenttext,
  } = functions
    ? functions
    : {
        openCloseComment: () => {},
        addPostReact: () => {},
        addComment: () => {},
      };

  const socialShareStyle = {
    position: 'absolute',
    left: '32%',
    transform: 'translateY(-62px)',
    width: '30%',
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '8px 0px',
    borderRadius: '8px',
  };

  const SocialShareExitStyle = {
    color: 'red',
    fontWeight: 'bolder',
    position: 'absolute',
    right: '-2%',
    top: '-25%',
    cursor: 'pointer',
    textShadow: '2px 0px #fff',
  };

  const showLikeUsers = () => {
         return (
          <div class='userLikeBox'>
          { likes.map((el,i) => {
              return (
                <>
                  {i < 5 ? 
                  <div>
                  <img src={el.useravatar ? el.useravatar : player} alt="profile" />
                  </div>
                  : null }
                </>
              )
          }) 
           }
       </div>
         )
  }

  return (
    <div className="main-wrapper" key={index ? index : 0}>
      <div className="middle-wrapper">
        <div className="main-profile-page main-detail-page">
          <div className="player-details-page">
            <div className="player-name">
              <h5>
                <img src={player} alt="username" />
                {username ? username : 'No Found'}
              </h5>
              <div className="player-chat">
                {content && content.length > 10
                  ? content.substring(0, 10) + '...'
                  : 'Not Found'}
                <div className="message-time">
                  <p>{new Date(createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {images.length > 0 ? (
              <div className="streaming-video">
                <div className="show-new-img">
                  <ul className="img-list d-flex flex-wrap">
                    {images.map((el) => (
                      <ImageAndVideoItem el={el} />
                    ))}
                  </ul>
                </div>

                <div className="show-btn d-flex justify-content-center align-items-center">
                  {remainingImages.length > 0 && !showRemainingImages ? (
                    <button
                      className="drop-comment"
                      onClick={() => setshowRemainingImages(true)}
                    >
                      Show remaining images
                    </button>
                  ) : null}
                </div>

                {showRemainingImages ? (
                  <>
                    <div className="less-img">
                      <ul className="img-list d-flex flex-wrap">
                        {remainingImages.map((el) => (
                          <ImageAndVideoItem el={el} />
                        ))}
                      </ul>
                      <div className="show-btn d-flex justify-content-center align-items-center">
                        <button
                          className="drop-comment"
                          onClick={() => setshowRemainingImages(false)}
                        >
                          Show less images
                        </button>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}

            {/*  <i class="fa fa-play" aria-hidden="true"></i> */}

            <div className="detail-description">
              <p>{content}</p>
              <div className="like-section">

               

                <div
                  className="like"
                  onClick={() => addPostReact('likes', _id)}
                >
                    {showLikeUsers()}
                  <i className="fa fa-thumbs-up" aria-hidden="true"></i> I like:{' '}
                  <span>{likes ? likes.length : 0}</span>
                </div>

                {/* ==========Social Share================ */}

                {showSocialShare ? (
                  <div style={socialShareStyle}>
                    <span
                      onClick={() => setShowSocialShare(!showSocialShare)}
                      style={SocialShareExitStyle}
                    >
                      X
                    </span>

                    <FacebookShareButton
                      url={`${client}/profile-detail`}
                      quote={content.slice(0, 20)}
                      description={content}
                      className="Demo__some-network__share-button"
                    >
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>

                    <TwitterShareButton
                      title={content}
                      url={`${client}/profile-detail`}
                      hashtags={['hashtag1', 'hashtag2']}
                    >
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                  </div>
                ) : null}

                <div
                  className="share"
                  onClick={() => setShowSocialShare(!showSocialShare)}
                >
                  to share
                </div>

                <div className="comment">
                  <i className="fa fa-comment" aria-hidden="true"></i> comment:{' '}
                  <span>{comments ? comments.length : 0}</span>
                </div>
                <div
                  className="more-option"
                  onClick={() => openCloseComment(index)}
                >
                  {selected ? (
                    <img
                      src={arrow}
                      alt="mre-option"
                      style={{ transform: 'rotate(180deg)' }}
                    />
                  ) : (
                    <img src={arrow} alt="mre-option" />
                  )}
                </div>
              </div>
            </div>

            {selected && (
              <React.Fragment>
                <div className="post-comment">
                  <div className="comment-text">
                    <Form.Group controlId="formBasicEmail">
                      <Form.Control
                        type="text"
                        name="comment"
                        placeholder="Post a Comment"
                        value={commenttext}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                  <div className="comment-btn">
                    <Button
                      className="drop-comment"
                      onClick={(e) => addComment(e, _id)}
                    >
                      POST
                    </Button>
                  </div>
                </div>

                {comments && comments.length > 0 ? (
                  <React.Fragment>
                    {comments.map((el, i) => {
                      return <CommentItem el={el} i={i} />;
                    })}
                  </React.Fragment>
                ) : (
                  <h6>No comments found</h6>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocailPost;

const CommentItem = ({ el, i }) => {
  const { comment, commentby, createdAt } = el;
  const { username, useravatar } = commentby ? commentby : {};
  return (
    <div className="message-bottom" key={i}>
      <div className="player-messages-section">
        <div className="player-messages">
          <div className="profile-name">
            <img src={useravatar ? useravatar : player} alt="profile" />
            {username ? username : 'Not found'}
          </div>
          <div className="playerchat">
            <h6>{comment}</h6>
            <p>
              {createdAt ? new Date(createdAt).toLocaleString() : 'Not found'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageAndVideoItem = ({ el }) => {
  const extention = el.split('.').pop();
  const validImageExtensions = ['jpg', 'jpeg', 'gif', 'png'];
  const videoValidExtension = ['mp4', 'webm', 'ogg'];

  if (validImageExtensions.includes(extention)) {
    return (
      <>
        <li>
          <img width="100" src={el} alt="imgh" />
        </li>
      </>
    );
  } else if (videoValidExtension.includes(extention)) {
    return (
      <>
        <li>
          <video width="320" height="240" controls>
            <source src={el} type="video/mp4" />
            <source src={el} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        </li>
      </>
    );
  }

  return <></>;
};
