import React from 'react';
import PopupWrapper from '../popups/popupwrapper';

const WeaponDetail = ({show,handleClose}) => {
     return(
        <PopupWrapper  show={show}
        handleClose={handleClose}
        defaultClass={"weapon-popup"}>
         <div className="weapon-detail">

         </div>
         </PopupWrapper>
     )
}
export default WeaponDetail