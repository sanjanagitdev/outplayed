import React, { useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import player from '../../assets/header/user-icon.png';
import UserProfileContext from './../../context/profilecontext';

const Signature = () => {
  const {
    profileData,
    signatureBook,
    handleSubmitSignatureBook,
    handleSignatureBook,
  } = useContext(UserProfileContext);
  const { signatureBook: signatureBookArray } = profileData ? profileData : {};
  return (
    <div className="signature-page">
      <h6>signature book</h6>
      <div className="signature-box">
        <div className="messages">
          {signatureBookArray &&
            signatureBookArray.map((el, i) => {
              return <PlayerSignatureItem element={el} index={i} />;
            })}
        </div>
        <div className="send-message">
          <Button onClick={() => handleSubmitSignatureBook()}>Send</Button>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="Type your message"
              value={signatureBook}
              onChange={(e) => {
                handleSignatureBook(e);
              }}
            />
          </Form.Group>
        </div>
      </div>
    </div>
  );
};
export default Signature;

const PlayerSignatureItem = ({ element, index }) => {
  const { userid, message, signatureAt } = element ? element : {};
  const { username, useravatar } = userid ? userid : {};
  return (
    <div className="player-name" key={index}>
      <h5>
        <img src={useravatar ? useravatar : player} alt="alt-att" />
        {username}
      </h5>
      <div className="player-chat">
        {message}
        <div className="message-time">
          <p>{new Date(signatureAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
