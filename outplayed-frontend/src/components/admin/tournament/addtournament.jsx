import React, { useState, useRef, useEffect } from 'react'
import { Form, Button, Dropdown } from 'react-bootstrap'
import { adminInstance } from '../../../config/axios'
import { Notification, queryString } from '../../../function'
import AdminWrapper from '../adminwrapper/wrapper'
import history from '../../../config/history'
import DateTimePicker from "react-datetime-picker";
const Addtournament = () => {
  const [title, setTitle] = useState('') 
  const [price, setPrice] = useState('')
  const [startdate, setStartDate] = useState(new Date());
  const [check, setCheck] = useState(false)
  const [image, setimage] = useState('')
  const imgRef = useRef(null);
  const [playerNumbers, setPlayerNumbers] = useState('')
  const [gameType, setgameType] = useState('')
  const [tournamentType, setTournamenttype] = useState([{type:'Premium',active:false},{type:'Premium/advanced',active:false},{type:'Normal',active:false}]);
  const [TrnType, setTrntype] = useState('Normal');
  const [upoadimage, setUploadimage] = useState(false);
  const addProduct = async (e) => {
    e.preventDefault()
    const payload = {
      title,
      tournamentStart:startdate,
      tournamentPrize:price,
      playerNumbers,
      gameType,
      tournamentType:TrnType
    }
      let checkValid = imgRef.current.files[0].type.split('/')
      const checkValue = checkValid[1]
      if (checkValue === 'png' || checkValue === 'jpg' || checkValue === 'jpeg') {
        const data = new FormData()
        data.append('file', imgRef.current.files[0])
        const response = await adminInstance().post("/createTournament", data, {
          params: payload
          });
        const { code, msg } = response.data
        if (code === 200) {
          history.push('/admin/tournament')
          Notification('success', msg)
        }
      } else {
        Notification('warning', 'Please select png or jpg or jpeg type file')
      }
    }

  useEffect(() => {
    const { type, id } = queryString()
    if (type && id) {
      setCheck(true)
      GetStoreData()
    }
  }, [])
  const updateProducts = async (e) => {
    e.preventDefault()
    const { type, id } = queryString()
    if (type && id) {
      let checkValid = imgRef.current.files[0]
        ? imgRef.current.files[0].type.split('/')
        : false
      if (checkValid) {
        const checkValue = checkValid[1]
        if (
          checkValue === 'png' ||
          checkValue === 'jpg' ||
          checkValue === 'jpeg'
        ) {
          updateFromBoth(id)
        } else {
          Notification('warning', 'Please select png or jpg or jpeg type file')
        }
      } else {
        updateFromBoth(id)
      }
    }
  }
  const updateFromBoth = async (id) => {
    const data = new FormData()
    data.append('file', imgRef.current.files[0])
    const payload = {
      title,
      tournamentStart:startdate,
      tournamentPrize:price,
      playerNumbers,
      gameType,
      tournamentType:TrnType
    }
    const response = await adminInstance().patch(`/updateTurnament/${id}`, data, {
      params: payload,
    })
    const { code, msg } = response.data
    if (code === 200) {
      history.push('/admin/tournament')
      Notification('success', msg)
    } else {
      Notification('danger', msg)
    }
  }
  const GetStoreData = async () => {
    const { type, id } = queryString()
    if (type && id) {
      const response = await adminInstance().get(`/getTournamentById/${id}`)
      const { code, data } = response.data
      if (code === 200) {
        const {
          banner,
          gameType,
          playerNumbers,
          title,
          tournamentPrize,
          tournamentStart,
          tournamentType
        } = data
          setTitle(title);
          setPrice(tournamentPrize);
          setimage(banner);
          setPlayerNumbers(playerNumbers);
          setgameType(gameType);
          setTrntype(tournamentType);
       
          setStartDate(new Date(tournamentStart));
      }
    }
  }


  const selectTournamentType = (type) => {  
   const oldState = [...tournamentType];
   setTrntype(type);
   oldState.forEach(el => {
   if (el.type === type) {
      el.active = true;
   } else {
      el.active = false;
   }
   })
   setTournamenttype(oldState);
   }
  const selectTournamentGameType = (type) => {
    setgameType(type)
  }
  
  const SelectDate = (tournamentDate) => {
    setStartDate(tournamentDate)
}

  return (
    <AdminWrapper>
      <div className='user-list'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <h2>{check ? 'Update' : 'Add'} Tournament</h2>
              <Form onSubmit={check ? updateProducts : addProduct}>
                <Form.Group controlId='formBasicloginone'>
                  <Form.Label>Tournament Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='title'
                    name='title'
                    autoComplete='off'
                    value={title}
                    required={true}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId='formBasicloginone'>
                  <Form.Label>Tournament Prize</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Price'
                    name='price'
                    autoComplete='off'
                    value={price}
                    required={true}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId='formBasicloginone'>
                  <Form.Label>Set Max Teams</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Set max teams'
                    name='playerNumbers'
                    autoComplete='off'
                    value={playerNumbers}
                    required={true}
                    onChange={(e) => setPlayerNumbers(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicloginone">
                    <Form.Label>Start Date: </Form.Label><br/>
                    <DateTimePicker
                        value={startdate}
                        selected={startdate}
                        onChange={SelectDate}
                        minDate={new Date()}
                        className="start-date"
                    />
                </Form.Group>
                <Form.Group controlId='formBasicloginone'>
                  <Dropdown>
                    <Dropdown.Toggle variant='secondary' id='dropdown-basic'>                     
                      {TrnType?TrnType:'Tournament type'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {tournamentType &&
                        tournamentType.map((el, i) => {
                          return (
                            <Dropdown.Item
                              key={i}
                              active={el.active}
                              onClick={() => selectTournamentType(el.type)} >
                              {el.type}
                            </Dropdown.Item>
                          )
                        })}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
                <Form.Group
                  controlId='formBasicloginone'
                  className='inline-check'
                >
                  <div className='check-field'>
                    <input
                      type='checkbox'
                      name='type'
                      value='1vs1'
                      checked={gameType === '1vs1' ? true : false}
                      onChange={() => selectTournamentGameType('1vs1')}
                    />
                    1 vs 1
                    <input
                      type='checkbox'
                      name='type'
                      value='5vs5'
                      checked={gameType === '5vs5' ? true : false}
                      onChange={() => selectTournamentGameType('5vs5')}
                    />
                    5 vs 5
                  </div>
                </Form.Group>

                <div className=''>
                  {check && (
                    <div className='imagebox'>
                      <img src={image} className='imagesize' />
                    </div>
                  )}
                  <span>
                    <Form.File
                      id='exampleFormControlFile1'
                      label='Tournament banner'
                      ref={imgRef}
                      required={check ? false : true} ref={imgRef}
                    />
                  </span>
                  <div className='login-button'>
                    {check ? (
                      <Button type='submit' className='l-btn'>
                        Update
                      </Button>
                    ) : (
                      <Button type='submit' className='l-btn'>
                        ADD
                      </Button>
                    )}
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </AdminWrapper>
  )
}
export default Addtournament
