import React, { useEffect, useState,useContext } from "react";
import Lightbox from "react-image-lightbox";
import { Form,Button } from "react-bootstrap";
import "react-image-lightbox/style.css";
import PopupWrapper from "../popups/popupwrapper";
import Layout from '../layout/layout';
import LeftSidebar from '../sidebar/leftsidebar';
import counterone from '../../assets/store/counter1.png';
import WeaponDetail from './storeDetail';
import './store.css';
import { userInstance } from "../../config/axios";
import UserContext from '../../context/context';
import {Notification,productReadmeValidation} from '../../function/index';
import { countries } from "countries-list";  
const Store = () => {
  const [weaponDetail, setWeaponDetail] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [allproduct, setStore] = useState([]);
  const [allproductCopy, setStoreCopy] = useState([]);
  const [lightboximage,setLightBoxImage]=useState('');
  const [categoryList, setCategoryList] = useState([]);
  const { loggedIn, userDetails} = useContext(UserContext);
  const [readmealert, setReadmeNotification] = useState(false);
  const [noticationMsg, SetnoticationMsg] = useState('');
  const [contactAdd, setcontactAdd] = useState(false);
  const [activeProduct, setActiveProduct] = useState({});  
  const [countriesList, setCountriesList] = useState([]);

  const [phone, setPhone] = useState("");
  const [town, setTown] = useState(); 
  const [province, setProvince] = useState("");
  const [direction, setDirection] = useState("");
  const [country, setCountry] = useState("");
  const [errors, setErrors] = useState({});
  const {
    coins,onsiteWallet
  } = userDetails;
  //console.log(onsiteWallet);
  const handleOpen = (img) => {
    setLightBoxImage(img);
    setIsOpen(!isOpen);
  }
  useEffect(() => {
    GetAllProducts();
    CategoryListData();
    getCountry();
  }, [])
  const getCountry = () => {
    let oldState = [];
    Object.keys(countries).forEach((element) => {
      oldState.push({
        lang: element,
        name: countries[element].name,
        native: countries[element].native,
      });
    });
    setCountriesList(oldState);
  };

  const GetAllProducts = async () => {
      const response = await userInstance().get("/showproduct");
      const {
        data: { code, allproducts },
      } = response;
      if (code === 200) {
        setStore(allproducts);
        setStoreCopy(allproducts);
      }
  };
  const CategoryListData = async () => {
    const response = await userInstance().get('/categoryslist');
    const { code, allcategorys } = response.data;
    if (code === 200) {
        setCategoryList(allcategorys);
    }
}
  const handleWeapondetail = () => {
    setWeaponDetail(!weaponDetail);
  };
  const handleActive =(id) =>{
    const oldState = [...categoryList];
    oldState.forEach(el => {
      if (el._id === id) {
      el.active = true;
      } else {
      el.active = false;
      }
   })
   const filteredData= allproductCopy.filter(el => el.catid._id === id);
   setStore(filteredData);
   setCategoryList(oldState);
  }
  const handleReadme = async (totalcoins,pid,type,steamcode,price,admin)=>{
    if(loggedIn){
     if( coins >= totalcoins){
      if(type ==='Steam code'){ 
        const  payload={
          totalcoins,
          pid,
          steamcode,
          admin
        }
        const response = await userInstance().post('/readmeProduct',payload);
        let {code,msg}=response.data;
        if(code === 200){
          Notification('success', msg);
        }
      }else{
        setActiveProduct({totalcoins,pid,steamcode,admin});
        setcontactAdd(!contactAdd);
      }
     }else{
      //let missingcoins= totalcoins-coins;
      //SetnoticationMsg("You are missing "+missingcoins+" coins to redeem this item.");
       setActiveProduct({price,pid,steamcode,admin});
       SetnoticationMsg('isnotenough');
      setReadmeNotification(!readmealert);
     }
    }else{
      //SetnoticationMsg("Please Login !");
      SetnoticationMsg('islogin');
      setReadmeNotification(!readmealert);
    }
  }
  const hardwareProductReadme = async(e) =>{
      let {totalcoins,pid,steamcode,admin}=activeProduct?activeProduct:'';
      const  payload={
        phone,
        direction,
        province,
        country,
        town,
        totalcoins,
        pid,
        steamcode,
        admin
      }
      const { isValid, errors } = productReadmeValidation(payload);
      if (!isValid) {
          console.log(errors);
          setErrors(errors);
          return;
      }
      const response = await userInstance().post('/readmeProduct',payload);
      let {code,msg}=response.data;
      if(code === 200){
        Notification('success', msg);
        setPhone('');
        setDirection('');
        setProvince('') 
        setCountry('');
        setTown('');
        setActiveProduct({});
        setcontactAdd(!contactAdd);
      }
  } 
 const redeemProductRealMony = async() =>{
  let {price,pid,steamcode,admin}=activeProduct?activeProduct:'';
  if(onsiteWallet >=price){
    const  payload={
      price,
      pid,
      steamcode,
      type:'realmoney',
      admin
    }
    const response = await userInstance().post('/readmeProduct',payload);
    let {code,msg}=response.data;
    if(code === 200){
      Notification('success', msg);
      setActiveProduct({});
      setReadmeNotification(!readmealert);
    }
  }else{
     setActiveProduct({});
     setReadmeNotification(!readmealert);
     Notification('danger', "You don't  enough balance redeem this product");
  }
 } 
  return (
    <Layout header={true} footer={true}>
      <div className="store-page">
        <div className="main-wrapper">
          <LeftSidebar
            mainmenu={true}
            increase={true}
            community={true}
            voiceserver={true}
          />
          <div className="middle-wrapper">
            <div className="store-main">
              <div className="tag">
                 {categoryList && categoryList.map((el,i)=>{
                  return <span  onClick={()=>handleActive(el._id)}><h6 className={el.active?'active':''}>{el.name}</h6></span>
                 })}
              </div>
              <div className="counter-section">
                <h2>Counter Strike: Global Offensive</h2>
                <div className="counter-list-area">
                  {allproduct && allproduct.map((e, i) => {
                   let {image,price,catid,title,content,_id,steamcode,quantity,createdby}=e?e:''
                   let totalpeice=price*500;
                   let type=catid?catid.name:'';
                    return <>
                    {(quantity >0)?<div
                      key={i}
                      className="counter-list"
                      onClick={() => handleOpen(image)}
                    >
                      <div className="counter-list-img">
                        <img src={e.image} alt="counter" />
                        <div className="tag">
                        <h6  onClick={() => handleReadme(totalpeice,_id,type,steamcode,price,createdby._id)} >Redeems </h6>
                          <h6 className="active">{catid?catid.name:'CSGO'}</h6>
                        </div>
                      </div>
                      <div>                    
                      </div>
                      
                      <div className="counter-content">
                        <h6>{title}</h6>
                        <p>CSGO Weapon</p>
                        <div className="counter-price">
                          <h5>
                            <span>F</span>
                            {price} <span>({price*500})</span>
                          </h5>
                          <div className="counter-desc">{content}</div>
                        </div>
                      </div>
                    </div>:''}
                      {/* {isOpen && (
                        <Lightbox
                          mainSrc={lightboximage?lightboximage:counterone}
                          nextSrc={lightboximage?lightboximage:counterone}
                          prevLabel={lightboximage?lightboximage:counterone}
                          onCloseRequest={() => setIsOpen(false)}
                          toolbarButtons={['Readme']}
                        />
                      )} */}
                  </> 
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <WeaponDetail show={weaponDetail} handleClose={handleWeapondetail} />
        <PopupWrapper show={readmealert} handleClose={setReadmeNotification}>
          <div className="store-popup">
        
          { noticationMsg === 'isnotenough' ?<div class="tag" onClick={()=>redeemProductRealMony()}>You don't have enough coin . click here to <h6 className="active">Redeems </h6> product  real money</div>  : noticationMsg === 'islogin' ? <p>Please Login !</p> : ''}
             
          </div>
        </PopupWrapper>
        <PopupWrapper show={contactAdd} handleClose={setcontactAdd}>
          <div className="store-popup">
          <Form.Group controlId="exampleForm.ControlSelect2">
                  <Form.Label>Country</Form.Label> 
                  <Form.Control as="select"  required={true} name="country" onChange={({target:{value}}) =>setCountry(value)}>
                    <option>Select Country</option>
                    {countriesList && countriesList.map((el, i) => {
                      return <option value={el.name}  key={i}>{el.name}</option>
                    })}
                  </Form.Control>
            {errors.country && <span style={{ color: 'red' }}>{errors.country}</span>}     
            </Form.Group>
          <Form.Group controlId="formBasicloginone">
            <Form.Label>Town</Form.Label>
            <Form.Control
              type="text"
              placeholder="Please enter town"
              name="town"
              required={true}
              autoComplete="off"
              value={town}
              onChange={(e) =>
             setTown(e.target.value)}
            />
              {errors.town && <span style={{ color: 'red' }}>{errors.town}</span>}
          </Form.Group> 
          <Form.Group controlId="formBasicloginone">
            <Form.Label>Province</Form.Label>
            <Form.Control type="text" name="province" placeholder="Please enter province" value={province}  required={true} 
             onChange={(e) =>setProvince(e.target.value)} />
               {errors.province && <span style={{ color: 'red' }}>{errors.province}</span>}
          </Form.Group>
          <Form.Group controlId="formBasicloginone">
            <Form.Label>Direction</Form.Label>
            <Form.Control
              type="text"
              placeholder="Please enter direction"
              name="direction"
              required={true}
              autoComplete="off"
              value={direction}
              onChange={(e) =>
             setDirection(e.target.value)}
            />
             {errors.direction && <span style={{ color: 'red' }}>{errors.direction}</span>} 
          </Form.Group> 
          <Form.Group controlId="formBasicloginone">
            <Form.Label>Telephone contact</Form.Label>
            <Form.Control type="Number" name="phone" placeholder="Please enter number" value={phone}  required={true} 
             onChange={(e) =>setPhone(e.target.value)} />
               {errors.phone && <span style={{ color: 'red' }}>{errors.phone}</span>}
          </Form.Group>
          <p><b>NOTE:</b> The redeemed product may take several weeks to arrive, for any questions, contact an administrator, thank you!</p>
          <div className="withdraw-bottom">
            <button onClick={()=>setcontactAdd()} className="btn btn-cancel">
                Cancel
            </button>
            <button type="submit" onClick={()=>hardwareProductReadme()}  className="btn btn-continue" >
              Confirm
            </button>
          </div>
        </div>
        </PopupWrapper>
      </div>
    </Layout>
  );
};
export default Store;
