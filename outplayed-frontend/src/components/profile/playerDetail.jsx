import React, { useState, useEffect, useRef } from 'react';
import Helmet from 'react-helmet';
import Layout from '../layout/layout';
import { Form } from 'react-bootstrap';
import { socket, GetCommentData, GetCommentDataOff } from '../../socket';

import SocailPost from './postComponent';
import { userInstance } from '../../config/axios';
import { Notification } from '../../function';
import Loader from '../loader/loader';

const PlayerPosts = () => {
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState('');
  const [getmedia, setPostMedia] = useState([]);
  const limit = 5;
  const [data, setData] = useState([]);
  const [commenttext, setComment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [random, setRandom] = useState(Math.random());

  const [pageCounts, setPageCounts] = useState(0);

  const [skip, setSkip] = useState(0);

  const oldDataRef = useRef(data);

  const ValidatePost = (values) => {
    let errors = {};
    let isValid = true;
    if (!values.content) {
      errors.content = 'Content is required !';
      isValid = false;
    }
    return { isValid: isValid, errors: errors };
  };

  useEffect(() => {
    AllPost(limit, skip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, skip]);

  useEffect(() => {
    oldDataRef.current = data;
  });

  useEffect(() => {
    const handler = (message) => {
      messageHandler(message, oldDataRef.current, setData);
    };
    GetCommentData(handler);

    return () => {
      GetCommentDataOff(handler);
    };
  }, []);

  const messageHandler = (message, oldData, setData) => {
    oldData.forEach((el) => {
      const { postid, getCommentData } = message;
      if (el._id === postid) {
        el.comments.push(getCommentData);
      }
    });
    setData(oldData);
    setRandom(Math.random());
  };

  const AllPost = async (limit, skip) => {
    try {
      if (limit > 0) {
        const response = await userInstance().get(
          `/allpost?limit=${limit}&skip=${skip}`
        );
        let {
          data: { code, posts, postCounts },
        } = response;
        if (code === 200) {
          setData(posts);
          setPageCounts(postCounts);
        }
      }
    } catch (error) {
      return error;
    }
  };

  const addPost = async (e) => {
    if (e.key === 'Enter') {
      DirectPost(e);
    }
  };

  const DirectPost = async (e) => {
    try {
      e.preventDefault();
      const postObj = {
        content: content,
      };
      const validPost = ValidatePost(postObj);
      setErrors(validPost.errors);
      if (!validPost.isValid) {
        return;
      }
      const removeExtraSpace = (s) => s.trim().split(/ +/).join(' ');
      let contents = removeExtraSpace(content);
      if (validPost && contents !== '') {
        const data = new FormData();

        if (getmedia.length <= 4) {
          for (let i = 0; i < getmedia.length; i++) {
            data.append('file', getmedia[i].image);
          }
        } else {
          setFileError(
            'You cant add more then 5 images please remove some images to upload'
          );
          return;
        }
        setIsLoading(true);
        const saveData = await userInstance().post('/addpostv2', data, {
          params: postObj,
        });
        let { code, msg } = saveData.data;
        if (code === 200) {
          setIsLoading(false);
          AllPost(limit, skip);
          Notification('success', msg);
          setContent('');
          setPostMedia([]);
        } else {
          Notification('success', msg);
        }
      }
    } catch (error) {
      return;
    }
  };
  const addComment = async (e, postid) => {
    try {
      e.preventDefault();
      let webtoken = localStorage.getItem('webtoken').toString();
      if (commenttext && commenttext.trim()) {
        socket.emit('SendComment', { message: commenttext, postid, webtoken });
        setComment('');
      }
    } catch (error) {
      return error;
    }
  };

  const addPostReact = async (type, postid) => {
    try {
      const playload = { type, postid };
      const result = await userInstance().put('/addpostReact/', { playload });
      let { code } = result.data;
      if (code === 200) {
        AllPost(limit, skip);
      }
    } catch (error) {
      return;
    }
  };

  const handleSelectImages = (files) => {
    try {
      let oldState = [...getmedia];
      const validFileExtensions = [
        'jpg',
        'jpeg',
        'gif',
        'png',
        'mp4',
        'webm',
        'ogg',
      ];
      const imgValidExtensions = ['jpg', 'jpeg', 'gif', 'png'];
      const videoValidExtension = ['mp4', 'webm', 'ogg'];

      for (let i = 0; i < files.length; i++) {
        const extention = files[i].name.split('.').pop();

        if (validFileExtensions.includes(extention)) {
          if (
            imgValidExtensions.includes(extention) &&
            files[i].size > 1024 * 1024
          ) {
            setFileError('You can only post images less then 1 mb');
            continue;
          }

          if (
            videoValidExtension.includes(extention) &&
            files[i].size > 1024 * 1024 * 10
          ) {
            setFileError('You can only post video less then 5 mb');
            continue;
          }
          oldState.push({
            blobUrl: URL.createObjectURL(files[i]),
            image: files[i],
          });
        } else {
          setFileError('Invalid file type');
          continue;
        }
      }
      setPostMedia(oldState);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const cancelImage = (index) => {
    let oldState = [...getmedia];
    oldState.splice(index, 1);
    //To remove file error of more the 5 file
    if (oldState.length <= 5) {
      setFileError('');
    }
    setPostMedia(oldState);
  };

  // const handlePageClick = ({ selected }) => {
  //   setSkip(selected * limit);
  // };
  // const pageCount = Math.ceil(pageCounts / limit);

  const openCloseComment = (index) => {
    let oldState = [...data];
    const { selected } = oldState[index];
    oldState[index].selected = !selected;
    setData(oldState);
  };

  const functionProps = {
    openCloseComment,
    addPostReact,
    addComment,
    commenttext,
    setComment,
  };

  return (
    <>
      {isLoading && <Loader />}
      <Helmet>
        <body className="profile-main-page" />
      </Helmet>
      <Layout header={true} footer={true}>
        <div id={random}>
          <div className="new-post">
            <h6>NEW POST</h6>
            <div className="upload-section">
              <div className="msg-txt">
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className="textarea-without-resize"
                    value={content}
                    placeholder="Write here...."
                    onChange={(e) => setContent(e.target.value)}
                    onKeyPress={(e) => addPost(e)}
                  />
                  {errors.content && <p className="error">{errors.content}</p>}
                  {fileError && <p className="error">{fileError}</p>}
                </Form.Group>
              </div>

              <div className="file-upload">
                <div className="upload-new">
                  <div className="add-image">
                    <label for="exampleFormControlFile2">
                      {' '}
                      <span>
                        <i className="fa fa-plus" />
                      </span>
                      <span>Add Image</span>
                    </label>
                    <Form.File
                      id="exampleFormControlFile2"
                      className="browse-input"
                      label="Upload"
                      name="image"
                      multiple
                      onChange={(e) => handleSelectImages(e.target.files)}
                    />
                  </div>
                </div>
                <Form.Group>
                  <div className="browse-button">
                    <button className="drop-comment" onClick={DirectPost}>
                      POST
                    </button>
                  </div>
                </Form.Group>
              </div>
            </div>
            <div className="upload-btn">
              <div className="upload-more">
                <div className="upload-image-section">
                  {getmedia &&
                    getmedia.map((imgl, j) => {
                      return (
                        <div className="post-images" key={j}>
                          <i
                            className="fa fa-times"
                            onClick={() => cancelImage(j)}
                          />
                          <img
                            src={imgl.blobUrl}
                            alt="uploaded"
                            style={{ height: '50px', width: '50px' }}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {data &&
            data.map((el, i) => {
              return (
                <SocailPost element={el} index={i} functions={functionProps} />
              );
            })}
        </div>
      </Layout>
    </>
  );
};
export default PlayerPosts;
