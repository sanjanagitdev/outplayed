import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Dropdown } from 'react-bootstrap';
import { adminInstance } from '../../../config/axios';
import { Notification, queryString } from '../../../function';
import AdminWrapper from "../adminwrapper/wrapper";
import history from '../../../config/history';
    const AddProduct = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [content, setContent] = useState("");
    const [check, setCheck] = useState(false);
    const [image, setimage] = useState('');
    const [Productmedia, setMedia] = useState();
    const imgRef = useRef(null);
    const [getProductMedia, setProductMedia] = useState([]);
    const [category, setcategory] = useState('');
    const [categoryID, setcategoryID] = useState('');
    const [categoryList, setCategoryList] = useState();
    const [steamcode, setSteamCode] = useState();
    const [steamcheck, setSteamCheck] = useState(false);
    const [steamcheckType, setSteamCheckType] = useState('Steam code');
    const [quantity, setQuantity] = useState("");
    
    const addProduct = async e => {
    e.preventDefault();
    let checkValid = imgRef.current.files[0].type.split('/');
    const checkValue = checkValid[1]
    if ((checkValue === 'png') || (checkValue === 'jpg') || (checkValue === 'jpeg')) {
    const data = new FormData();
    data.append("file", imgRef.current.files[0]);
    const payload = { title, content,price,media:getProductMedia,catid:categoryID,steamcode,quantity}
    const response = await adminInstance().post("/addProduct", data, {
    params: payload
    });                
    const { code, msg } = response.data;
    if (code === 200) {
    history.push('/admin/store');
    Notification('success', msg);
    }
    } else {
    Notification('warning', 'Please select png or jpg or jpeg type file');
    }
    };
    useEffect(() => {
    const { type, id } = queryString();
    CategoryListData();
    if (type && id) {
    setCheck(true);
    GetStoreData();
    }
    }, []);
    const CategoryListData = async () => {
        const response = await adminInstance().get('/categoryslist');
        const { code, allcategorys } = response.data;
        console.log(allcategorys);
        if (code === 200) {
            setCategoryList(allcategorys);
        }
    }

    const updateProducts = async (e) => {
    e.preventDefault();
    const { type, id } = queryString();
    if (type && id) {
    let checkValid = imgRef.current.files[0] ? imgRef.current.files[0].type.split('/') : false;
    if (checkValid) {
    const checkValue = checkValid[1]
    if ((checkValue === 'png') || (checkValue === 'jpg') || (checkValue === 'jpeg')) {
    updateFromBoth(id)
    } else {
    Notification('warning', 'Please select png or jpg or jpeg type file');
    }
    } else {
    updateFromBoth(id)
    }
    }
    }
    const updateFromBoth = async (id) => {
    const data = new FormData();
    data.append("file", imgRef.current.files[0]);
    const payload = { title, content,price,media:getProductMedia,catid:categoryID,steamcode,quantity}
    const response = await adminInstance().patch(`/updateProduct/${id}`, data, {
    params: payload
    });
    const { code, msg } = response.data;
    if (code === 200) {
    history.push('/admin/store');
    Notification('success', msg);
    } else {
    Notification('danger', msg);
    }
    }
    const GetStoreData = async () => {
    const { type, id } = queryString();
    if (type && id) {
    const response = await adminInstance().get(`/getProductById/${id}`);     
    const { code, data } = response.data; 
    if (code === 200) {
    const { title, content, image,price,media,catid,steamcode,quantity} = data;
    setTitle(title);
    setContent(content);
    setimage(image);
    setPrice(price);
    setMedia(media);
    setcategory(catid.name);
    setcategoryID(catid._id);
    setQuantity(quantity);
    if(steamcode){
      setSteamCheck(true);
      setSteamCode(steamcode);
    }
    }
    }
    }
    const handelChangeMedia = async (e) => {
    const data = new FormData();
    for (let i = 0; i < e.length; i++) {
    data.append("file", e[i]);
    }
    const saveMediaData = await adminInstance().post("/uploadMedia", data, {
    params: ""
    }); 
    const {code,fileArray} =  saveMediaData.data;
    if (code === 200) {
    setProductMedia(fileArray);
    }
    };
    const removeMedia = async (index) => { 
    const {id } = queryString();
    let oldState = [...Productmedia] // make a separate copy of the array
    const response = await adminInstance().put(`/deleteMedia/${index}/${id}`); 
    const { code,msg} = response.data;
    if (code === 200) {
    oldState.splice(index, 1);
    setMedia(oldState);
    Notification('success', msg);
    } else {
    Notification('danger', msg);
    } 
    }
    const selectcategoryList = (type) => {  
    const oldState = [...categoryList];
    setcategoryID(type);
    oldState.forEach(el => {
    if (el._id === type) {
    if(el.name === 'Steam code'){;
      setSteamCheck(true);
    }else{
      setSteamCheck(false);
    }   
    setcategory(el.name);
    el.active = true;
    } else {
    el.active = false;
    }
    })
    setCategoryList(oldState);
    }
return (
<AdminWrapper>
   <div className="user-list">
      <div className="container">
         <div className="row">
            <div className="col-md-12">
               <h2>{check ? 'Update' : 'Add'} Product</h2>
               <Form onSubmit={check ? updateProducts : addProduct}>
                  <Form.Group controlId="formBasicloginone">
                     <Form.Label>Title</Form.Label>
                     <Form.Control
                        type="text"
                        placeholder="title"
                        name="title"
                        autoComplete="off"
                        value={title}
                        required={true}
                        onChange={(e) =>
                     setTitle(e.target.value)}
                     />
                  </Form.Group>
                  <Form.Group controlId="formBasicloginone">
                     <Form.Label>Price</Form.Label>
                     <Form.Control
                        type="number"
                        placeholder="Price"
                        name="price"
                        autoComplete="off"
                        value={price}
                        required={true}
                        onChange={(e) =>
                     setPrice(e.target.value)}
                     />
                  </Form.Group>
                  <Form.Group controlId="formBasicloginone">
                     <Form.Label>Quantity</Form.Label>
                     <Form.Control
                        type="number"
                        placeholder="Quantity"
                        name="quantity"
                        autoComplete="off"
                        value={quantity}
                        required={true}
                        onChange={(e) =>
                        setQuantity(e.target.value)}
                     />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                     <Form.Label>Content</Form.Label>
                     <Form.Control
                        as="textarea" rows="5"
                        type="text"
                        placeholder="Content"
                        name="content"
                        autoComplete="off"
                        required={true}
                        value={content}
                        onChange={(e) =>
                     setContent(e.target.value)}
                     />
                  </Form.Group>
                  <Form.Group controlId="formBasicloginone">
                     <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                           {category?category:'Select category'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                           {categoryList && categoryList.map((el, i) => {
                           return (
                           <Dropdown.Item key={i} active={el.active} onClick={() => selectcategoryList(el._id)}>{el.name}</Dropdown.Item>
                           )
                           })}
                        </Dropdown.Menu>
                     </Dropdown>
                  </Form.Group>
                  <Form.Group controlId="formBasicloginone">
                    {steamcheck && <div>
                     <Form.Label>Steam code</Form.Label>
                      <input type="text"  name="steamcode" placeholder="Steam Code" value={steamcode} className="form-control" onChange={(e) =>
setSteamCode(e.target.value)} />
                    </div> }       
                  </Form.Group>
                  
                  <Form.Group controlId="formBasicloginone">
                     {check && 
                     <div>
                        {Productmedia && Productmedia.map((el, i) => { 
                        return <div className="imagebox"> <i class="fa fa-times deletemedia" aria-hidden="true"  
                           onClick={() => {
                           if (
                           window.confirm(
                           'Are you sure to delete this Image?'
                           )
                           ) {
                           removeMedia(i);
                           }
                           }}
                           ></i> <img src={el} className="imagesize" /> 
                        </div>
                        })}
                     </div>
                     }
                     <Form.Label>Select Product Media</Form.Label>
                     <Form.Control
                        type="file"
                        id="myfile"
                        name="image"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                     handelChangeMedia(e.target.files)}
                     />
                  </Form.Group>
                  <div className="">
                     {check && 
                     <div className="imagebox">
                        <img src={image} className="imagesize" />
                     </div>
                     }
                     <span>
                        <Form.File id="exampleFormControlFile1" label="Select Product Image" required={check ? false : true} ref={imgRef} />
                     </span>
                     <div className="login-button">
                        {check ? <Button type="submit" className="l-btn" >
                        Update
                        </Button> : <Button type="submit" className="l-btn" >
                        ADD
                        </Button>}
                     </div>
                  </div>
               </Form>
            </div>
         </div>
      </div>
   </div>
</AdminWrapper>
);
};
export default AddProduct;