import React from "react";
import { Button, Form } from 'react-bootstrap';
import search from "../../assets/header/search-icon.png";
import history from "../../config/history"




const LadderHeader = ({ handleClose, SearchLadders, searchData, running,isladders }) => {
    return (
        <div className="tournament-header">
            <div className="tournament-search">
                <Form>
                    <Form.Control
                        type="text"
                        placeholder="Search ladders..."
                        name="name"
                        autoComplete="off"
                        onChange={(e) => SearchLadders(e.target.value)}
                        value={searchData}
                    />
                    <img src={search} alt="Search" />
                </Form>
            </div>
            <div className="tournament-versus">
                <Button onClick={() => SearchLadders('1vs1')}>1vs1</Button>
                <Button onClick={() => SearchLadders('5vs5')}>5vs5</Button>
            </div>
            <div className="tournament-create">
                {(running && isladders) ? <Button onClick={handleClose}>Create Ladder</Button> : <Button onClick={() => history.goBack()}>Back</Button>}

            </div>
        </div>
    );
};
export default LadderHeader;