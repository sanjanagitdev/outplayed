import React, {useContext} from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import "./layout.css";
import UserContext from '../../context/context'
const Layout = ({ children, header, footer }) => {
  const {menutoggle}=useContext(UserContext)
  return (
    <div className={`wrapper ${menutoggle ? `wrapper-expand`:``}` }>

      <div className="header-wrapper">
          {header && <Header />}
      </div>

      <div className="main-content">
        {children}
      </div>
      
      <div className="footer-wrapper">
          {footer && <Footer />}
      </div>
     
    </div>
  );
};
export default Layout;
