import React from "react";
import "./hubs.css";
import { useTranslation} from 'react-i18next';
import { Link } from "react-router-dom";
import { GetPrestigeAccPoint } from "../../function";
import user from "../../assets/hubs/user.png";
import { Button, Form, FormControl, Tab, Table } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup'
import verified from "../../assets/hubs/verified.png";
import premium from "../../assets/hubs/premium.png";
import tick from "../../assets/hubs/tick.png";
import Tabs from 'react-bootstrap/Tabs';

const GameFinished = ({ userStats, comment, setComment, PostComment, commentList, errors }) => {
   const {t} = useTranslation();
    const mostMvp = userStats[0] ? userStats[0] : {}
    return (
        <div className="game-finished-content">
            <div className="mvp-button">
                <Button>{t('hub.game-finished.mvp')}</Button>
            </div>
            <HubResult mostMvp={mostMvp} t={t} />
            <Tabs defaultActiveKey="stats">
                <Tab eventKey="stats" title={t('hub.game-finished.player-stats')}>
                    <PlayerStats userStats={userStats} t= {t} />
                </Tab>
                <Tab eventKey="comments" title={t('hub.game-finished.comments')}>
                    <HubComments t={t} comment={comment} setComment={setComment} PostComment={PostComment} commentList={commentList} errors={errors} />
                </Tab>
            </Tabs>
        </div>
    );
};
export default GameFinished;
const HubResult = ({ mostMvp ,t }) => {
    const { username, useravatar, kills, deaths, kdr, prestige, headshot_per, assists } = mostMvp;
    return (
        <div className="hubs-result">
            <div className="player-image">
                <img src={useravatar ? useravatar : user} alt="user" />
                <h4>{username}</h4>
            </div>
            <div className="player-details">
                <ul>
                    <li>{t('hub.game-finished.kills')}: <span>{kills}</span></li>
                    <li>{t('hub.game-finished.deaths')}: <span>{deaths}</span></li>
                    <li>{t('hub.game-finished.assists')}: <span>{assists}</span></li>
                    <li>{t('hub.game-finished.headshot')}: <span>{headshot_per}%</span></li>
                    <li>{t('hub.game-finished.kda')}: <span>{kdr}</span></li>
                    <li>{t('hub.game-finished.prestige')}: <span><img src={GetPrestigeAccPoint(prestige ? prestige : 1000)} alt="prestige" /></span></li>
                </ul>
                <p><Link>{t('hub.game-finished.viewuser-profile')}</Link></p>
            </div>

        </div>
    );
};

const HubComments = ({ comment, setComment, PostComment, commentList, errors, t }) => {
    return (
        <div className="game-finished-comment">
            <Form onSubmit={PostComment}>
                <div className="comment-box-hub">
                    <InputGroup>
                        <FormControl value={comment} onChange={(e) => setComment(e.target.value)} />
                        {errors.comment && <span style={{ color: 'red' }}>{errors.comment}</span>}
                        <InputGroup.Append>
                            <Button type='submit'>{t('hub.send')}</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </div>
            </Form>

            <div className="hub-comment-list">

                <div className="hub-comment-box">
                    {commentList && commentList.map((el, i) => {
                        return <AllCommentsList element={el} index={i} />
                    })}
                </div>
            </div>
        </div>
    );
};

const PlayerStats = ({ userStats, t }) => {
    return (
        <div className="player-stats">
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{t('hub.game-finished.player')}</th>
                        <th>{t('hub.game-finished.kills')}</th>
                        <th>{t('hub.game-finished.assists')}</th>
                        <th>{t('hub.game-finished.deaths')}</th>
                        <th>{t('hub.game-finished.kdratio')}</th>
                    </tr>
                </thead>
                <tbody>
                    {userStats && userStats.map((el, index) => {
                        return <tr>
                            <td>{index + 1}</td>
                            <td>{el.username}</td>
                            <td>{el.kills}</td>
                            <td>{el.assists}</td>
                            <td>{el.deaths}</td>
                            <td>{el.kdr}</td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </div>
    );
};

const AllCommentsList = ({ element, index }) => {
    const { comment, date, commentby: { username, useravatar } } = element;
    return <React.Fragment key={index}>
        <div className="hub-comment-user">
            <ul>
                <li><Link to="/"><img src={verified} alt="verified" /></Link></li>
                <li><Link to="/"><img src={premium} alt="premium" /></Link></li>
                <li><Link to="/"><img src={tick} alt="tick" /></Link></li>
            </ul>
            <div className="user-box">
                <img src={useravatar ? useravatar : user} alt="user" />
                <span>{username}</span>
            </div>
        </div>
        <div className="hub-comment-content">
            <span>{new Date(date).toLocaleString()}</span>
            <p>{comment}</p>
        </div>
    </React.Fragment>
}