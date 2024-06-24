import React from "react";
import { Form, Button, Dropdown } from "react-bootstrap";
import PopupWrapper from "../popups/popupwrapper";
import csgo from "../../assets/tournament/csgo.png";
import profile from "../../assets/matchmaking/user-icon-red.png";
import { prestige } from "../../function/index";


const Filter = ({ props: { username, useravatar, errors, countriesWithLang, data, show, handleClose, JoinTeamFinder, setSelectData, dataFilterType, minRank, maxRank, filterCheckBoxes, FilterData, filterDatav, removeSelected } }) => {
  return (
    <div className="filter-page">
      <div className="join-team-finder">
        <div className="join-team-button">
          <button type="submit" className="btn btn-primary" onClick={handleClose}>
            Join Team Finder
        </button>
        </div>
        <div className="filter-role-section">
          <div className="match-format">
            <h4>Roles</h4>
            <Form>
              <div className="match-format-box">

                {filterCheckBoxes && filterCheckBoxes.map((el, i) => {
                  return <div className="filter-role" key={i}>
                    <input type="checkbox" id={`${i}`} checked={el.checked} onChange={() => FilterData('role', i)} />
                    <label for={`${i}`}>Toggle</label>
                    <h6>{el.role}</h6>
                  </div>
                })}


              </div>
              <div className="min-rank">
                <Form.Group controlId="exampleForm.ControlSelect2">
                  <DropDownItem type={'minrank'} ranks={minRank} FilterData={FilterData}  />
                </Form.Group>
              </div>
              <div className="min-rank">
                <Form.Group controlId="exampleForm.ControlSelect2">
                  <DropDownItem type={'maxrank'} ranks={maxRank} FilterData={FilterData} />
                </Form.Group>
              </div>
              <h4>Age</h4>
              <div className="match-format-box">
                <div className="filter-role">
                  <input type="checkbox" id="age" onChange={() => FilterData('age', 'agecheck')} />
                  <label for="age">Toggle</label>
                  <h6>Show 18+ Users Only</h6>
                </div>
              </div>
              <div className="min-rank">
                <Form.Group controlId="exampleForm.ControlSelect2">
                  <Form.Label>Country</Form.Label>
                  <Form.Control as="select" onChange={(e) => FilterData('country', e.target.value)}>
                    <option>Select Country</option>
                    {countriesWithLang && countriesWithLang.map((ellang, i) => {
                      return <option key={i}>{ellang.name}</option>
                    })}
                  </Form.Control>
                </Form.Group>
              </div>

              <div className="min-rank">
                <Form.Group controlId="exampleForm.ControlSelect2">
                  <Form.Label>Language</Form.Label>
                  <Form.Control as="select" onChange={(e) => FilterData('language', e.target.value)}>
                    <option>Select language</option>
                    {countriesWithLang && countriesWithLang.map((ellang, i) => {
                      return <option key={i}>{`${ellang.lang} (${ellang.name},${ellang.native})`}</option>
                    })}
                  </Form.Control>
                </Form.Group>
              </div>

              <div className="reset-filters">
                <button type="submit" className="btn btn-primary" onClick={(e) => filterDatav(e)}>
                  Apply Filters
                </button>
              </div>
            </Form>
          </div>
        </div>
        {show && <ScoutingPopup show={show} handleClose={handleClose} countriesWithLang={countriesWithLang} dataFilterType={dataFilterType} username={username} useravatar={useravatar} setSelectData={setSelectData} data={data} errors={errors} JoinTeamFinder={JoinTeamFinder} removeSelected={removeSelected} />}
      </div>
    </div>
  );
};
export default Filter;


const ScoutingPopup = ({
  show,
  handleClose,
  countriesWithLang,
  dataFilterType,
  username,
  useravatar,
  setSelectData,
  data: { description, language, roles },
  errors,
  JoinTeamFinder,
  removeSelected
}) => {
  return (
    <PopupWrapper
      show={show}
      handleClose={handleClose}
      defaultClass={" scouting-popup"}
    >
      <div className="closebtn">
        <i class="fa fa-times" aria-hidden="true" onClick={handleClose}></i>
      </div>
      <div className="spopup-header">
        <img src={csgo} alt="csgoiimg" />
        <h6>join the team finder</h6>
        <p>
          Fill in the details below to find a team . joininig the team finder
          will display your nationality.
        </p>
      </div>
      <div className="popup-account">
        <div className="game-account">
          <img src={useravatar ? useravatar : profile} alt="userimage" />
          <h6>{username}
            <i class="fa fa-check" aria-hidden="true"></i>
          </h6>
        </div>
      </div>
      <div className="popup-roles">
      <Form.Group controlId="exampleForm.ControlSelect2">
          <Form.Label>Post disappears </Form.Label>
          <Form.Control as="select" onChange={(e) => setSelectData('isdisappears', e.target.value)}>
               <option >--Select post disappears day--</option>
               <option  value="10">10 day</option>
               <option  value="15">15 day</option>
               <option  value="30">30 day</option>
          </Form.Control>
          {errors.isdisappears && <span style={{ color: 'red' }}>{errors.isdisappears}</span>}
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlSelect2">
          <Form.Label>Roles</Form.Label>
          <Form.Control as="select" onChange={(e) => setSelectData('roles', e.target.value)}>
            {dataFilterType.map((el, i) => {
              return <option key={i} value={el.role}>{el.role}</option>
            })}
          </Form.Control>
          <div className="selected-lang-div">
            {roles.map((ell, i) => {
              return <span className='selected-lang' key={i}>{ell} <i class="fa fa-times" aria-hidden="true" onClick={() => removeSelected('roles', i)}></i> </span>
            })}
          </div>
          {errors.roles && <span style={{ color: 'red' }}>{errors.roles}</span>}
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} name="description" value={description} onChange={(e) => setSelectData(e.target.name, e.target.value)} />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect2">
          <Form.Label>communiaction Language</Form.Label>
          <Form.Control as="select" onChange={(e) => setSelectData('language', e.target.value)}>
            {countriesWithLang && countriesWithLang.map((ellang, i) => {
              return <option key={i} value={i}>{`${ellang.lang} (${ellang.name},${ellang.native})`}</option>
            })}
          </Form.Control>
          <div className="selected-lang-div">
            {language.map((ell, i) => {
              return <span className='selected-lang' key={i}>{ell.lang}{`(${ell.name})`} <i class="fa fa-times" aria-hidden="true" onClick={() => removeSelected('language', i)}></i> </span>
            })}
          </div>
          {errors.language && <span style={{ color: 'red' }}>{errors.language}</span>}
        </Form.Group>

        <div className="spopup-btn">
          <Button type="submit" className="btn btn-primary" onClick={handleClose}>
            Cancel
</Button>
          <Button type="submit" className="btn btn-info" onClick={JoinTeamFinder}>
            join
</Button>
        </div>
      </div>

    </PopupWrapper>
  );
};


const DropDownItem = ({ type, ranks, FilterData }) => {
  return <div className="prestige-dropdown-cc">
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {type}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {ranks && ranks.map((el, i) => {
          return <Dropdown.Item key={i} onClick={() => FilterData(type, el.prestige,el.rank,el.prestigemax)}>{el.prestige} <span className='one-more-class'><img src={prestige(el.prestige)} alt="altimgae" /></span></Dropdown.Item>
        })}
      </Dropdown.Menu>
    </Dropdown>
  </div>
}