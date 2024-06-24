import React from 'react';
import { Form, Button, Dropdown, Tabs, Tab } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import PopupWrapper from "../popups/popupwrapper";

const CreateLadder = ({ show, handleClose, errors, OnChange, values, selectLadderGameType, SelectDate, handleImageChange, handleCreateLadder }) => {
    return (
        <PopupWrapper show={show} handleClose={handleClose} heading={"Create Ladder"} defaultClass={"outlayed-popup team-popup group-popup"}>
            <Tabs defaultActiveKey="createladder" id="uncontrolled-tab-example">
                <Tab eventKey="createladder" title="Create Ladder">
                    <CreateLadderForm errors={errors} OnChange={OnChange} values={values} selectLadderGameType={selectLadderGameType} SelectDate={SelectDate} handleImageChange={handleImageChange} handleCreateLadder={handleCreateLadder} />
                </Tab>
            </Tabs>
        </PopupWrapper>
    );
};
export default CreateLadder;

const CreateLadderForm = ({ errors, OnChange, values, selectLadderGameType, SelectDate, handleImageChange, handleCreateLadder }) => {
    const { title, ladderPrize, playerNumbers, ladderStart, ladderEndDate, gameType, ladderType, banner } = values;
    return (
        <div className="create-team create-tournament">
            <Form >
                <Form.Group controlId="formBasicloginone">
                    <Form.Label>Ladder Name: </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ladder name"
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange={OnChange}
                    />
                    {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}
                </Form.Group>
                <Form.Group controlId="formBasicloginone">
                    <Form.Label>Ladder Prize {ladderType !== 'Normal' ? <i class="fa fa-eur" aria-hidden="true"></i> : ''} </Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Add Ladder prize"
                        name="ladderPrize"
                        autoComplete="off"
                        value={ladderPrize}
                        onChange={OnChange}
                    />
                    {errors.ladderPrize && <span style={{ color: 'red' }}>{errors.ladderPrize}</span>}
                </Form.Group>

                <Form.Group controlId="formBasicloginone">
                    <Form.Label>Set Max Players: </Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Set max Players"
                        name="playerNumbers"
                        autoComplete="off"
                        value={playerNumbers}
                        onChange={OnChange}
                    />
                    {errors.playerNumbers && <span style={{ color: 'red' }}>{errors.playerNumbers}</span>}
                </Form.Group>

                <Form.Group controlId="formBasicloginone">
                    <Form.Label>Start Date: </Form.Label>
                    <DateTimePicker
                        value={ladderStart}
                        selected={ladderStart}
                        onChange={(e) => SelectDate('ladderStart', e)}
                        minDate={new Date()}
                        className="start-date"
                    />
                    {errors.ladderStart && <span style={{ color: 'red' }}>{errors.ladderStart}</span>}
                </Form.Group>

                <Form.Group controlId="formBasicloginone">
                    <Form.Label>End Date: </Form.Label>
                    <DateTimePicker
                        value={ladderEndDate}
                        selected={ladderEndDate}
                        onChange={(e) => SelectDate('ladderEndDate', e)}
                        minDate={new Date()}
                        className="start-date"
                    />
                    {errors.ladderEndDate && <span style={{ color: 'red' }}>{errors.ladderEndDate}</span>}
                </Form.Group>

                <Form.Group controlId="formBasicloginone">
                    <Form.Label>Ladder type: </Form.Label>
                    <div className="tournament-typ-dropdown">
                        <DropDownItem ladderType={ladderType} selectLadderGameType={selectLadderGameType} />
                    </div>
                    {errors.type && <span style={{ color: 'red' }}>{errors.type}</span>}
                </Form.Group>

                <Form.Group controlId="formBasicloginone">
                    <div className="upload-image-team">
                        {banner && <img src={banner} alt="banner-img" />}
                        <Form.File id="exampleFormControlFile1" label="Ladder banner:" onChange={handleImageChange} />
                        {errors.imgurl && <span style={{ color: 'red' }} >{errors.imgurl}</span>}
                    </div>
                </Form.Group>

                <Form.Group controlId="formBasicloginone">
                    <Form.Check className="check-box" type="checkbox" checked={gameType === "5vs5" ? true : false} onChange={() => selectLadderGameType("gameType", "5vs5")} />
                    <p>5 vs 5</p>
                    <Form.Check className="check-box" type="checkbox" checked={gameType === "1vs1" ? true : false} onChange={() => selectLadderGameType("gameType", "1vs1")} />
                    <p>1 vs 1 </p>
                    {errors.gameType && <span style={{ color: 'red' }}>{errors.gameType}</span>}
                </Form.Group>

                <div className="team-popup-button">
                    <Button className="add-member-btn" onClick={(e) => handleCreateLadder(e)}>Create</Button>
                </div>

            </Form>
        </div>
    );
};


const DropDownItem = ({ ladderType, selectLadderGameType }) => {
    return <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
            {ladderType}
        </Dropdown.Toggle>

        <Dropdown.Menu>
            {['Premium', 'Premium/advanced', 'Normal'].map((el, i) => {
                return <Dropdown.Item key={i} onClick={() => selectLadderGameType("ladderType", el)}>{el}</Dropdown.Item>
            })}
        </Dropdown.Menu>
    </Dropdown>
}