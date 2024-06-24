import React from 'react';
import { Form, Button, Dropdown, Tabs, Tab } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import PopupWrapper from "../popups/popupwrapper";

const CreateTournament = ({ show, handleClose, errors, OnChange, values, selectTournamentGameType, SelectDate, handleImageChange, HnadleCreateTournament }) => {
    return (
        <PopupWrapper show={show} handleClose={handleClose} heading={"Create Tournament"} defaultClass={"outlayed-popup team-popup group-popup"}>
            <Tabs defaultActiveKey="createtournament" id="uncontrolled-tab-example">
                <Tab eventKey="createtournament" title="Create Tournament">
                    <CreateTournamentForm errors={errors} OnChange={OnChange} values={values} selectTournamentGameType={selectTournamentGameType} SelectDate={SelectDate} handleImageChange={handleImageChange} HnadleCreateTournament={HnadleCreateTournament} />
                </Tab>
            </Tabs>
        </PopupWrapper>
    );
};
export default CreateTournament;

const CreateTournamentForm = ({ errors, OnChange, values, selectTournamentGameType, SelectDate, handleImageChange, HnadleCreateTournament }) => {
    const { title, tournamentPrize, playerNumbers, tournamentStart, gameType, tournamentType, banner } = values;
    return (
        <div className="create-team create-tournament">
            <Form >
                <Form.Group controlId="formBasicloginone">
                    <Form.Label>Tournament Name: </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Tournament name"
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange={OnChange}
                    />
                    {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}
                </Form.Group>
                <Form.Group controlId="formBasicloginone">
                    <Form.Label>Tournament Prize {tournamentType !== 'Normal' ? <i class="fa fa-eur" aria-hidden="true"></i> : ''} </Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Add tournament prize"
                        name="tournamentPrize"
                        autoComplete="off"
                        value={tournamentPrize}
                        onChange={OnChange}
                    />
                    {errors.tournamentPrize && <span style={{ color: 'red' }}>{errors.tournamentPrize}</span>}
                </Form.Group>

                <Form.Group controlId="formBasicloginone">
                    <Form.Label>Set Max Teams: </Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Set max teams"
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
                        value={tournamentStart}
                        selected={tournamentStart}
                        onChange={SelectDate}
                        minDate={new Date()}
                        className="start-date"
                    />
                    {errors.tournamentStart && <span style={{ color: 'red' }}>{errors.tournamentStart}</span>}
                </Form.Group>

                <Form.Group controlId="formBasicloginone">
                    <Form.Label>Tournament type: </Form.Label>
                    <div className="tournament-typ-dropdown">
                        <DropDownItem tournamentType={tournamentType} selectTournamentGameType={selectTournamentGameType} />
                    </div>
                    {errors.type && <span style={{ color: 'red' }}>{errors.type}</span>}
                </Form.Group>

                <Form.Group controlId="formBasicloginone">
                    <div className="upload-image-team">
                        {banner && <img src={banner} alt="banner-img" />}
                        <Form.File id="exampleFormControlFile1" label="Tournament banner:" onChange={handleImageChange} />
                        {errors.imgurl && <span style={{ color: 'red' }} >{errors.imgurl}</span>}
                    </div>
                </Form.Group>

                <Form.Group controlId="formBasicloginone">
                    <Form.Check className="check-box" type="checkbox" checked={gameType === "5vs5" ? true : false} onChange={() => selectTournamentGameType("gameType", "5vs5")} />
                    <p>5 vs 5</p>
                    <Form.Check className="check-box" type="checkbox" checked={gameType === "1vs1" ? true : false} onChange={() => selectTournamentGameType("gameType", "1vs1")} />
                    <p>1 vs 1 </p>
                    {errors.gameType && <span style={{ color: 'red' }}>{errors.gameType}</span>}
                </Form.Group>

                <div className="team-popup-button">
                    <Button className="add-member-btn" onClick={HnadleCreateTournament}>Create</Button>
                </div>

            </Form>
        </div>
    );
};


const DropDownItem = ({ tournamentType, selectTournamentGameType }) => {
    return <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
            {tournamentType}
        </Dropdown.Toggle>

        <Dropdown.Menu>
            {['Premium', 'Premium/advanced', 'Normal'].map((el, i) => {
                return <Dropdown.Item key={i} onClick={() => selectTournamentGameType("tournamentType", el)}>{el}</Dropdown.Item>
            })}
        </Dropdown.Menu>
    </Dropdown>
}