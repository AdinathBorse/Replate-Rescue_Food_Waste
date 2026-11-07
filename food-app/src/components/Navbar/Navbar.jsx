import React, { useState } from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';


const Navbar = ({setShowLogin}) => {

        const [menu,setMenu]=useState("Home");
        const{getCartTotal,token,setToken} = useContext(StoreContext);
        const navigate = useNavigate();

        const logout = () => {
            localStorage.removeItem("token");
            setToken("");
            navigate("/")

        }

  return (
    <div className="navbar">
        <Link to='/'><img src={assets.Replate_logo} alt="" className="logo"/></Link>
        <ul className="navbar-menu">
            <Link to='/' onClick={()=>setMenu("Home")} className={menu==="Home"?"active":""}>Home</Link>
            <a href='#mystery-deals' onClick={()=>setMenu("Mystery")} className={menu==="Mystery"?"active mystery-nav-item":"mystery-nav-item"}>Mystery Bags</a>
            <a href='#explore-menu' onClick={()=>setMenu("Menu")} className={menu==="Menu"?"active":""}>Menu</a>
            <a href='#a-d' onClick={()=>setMenu("Mobile-app")} className={menu==="Mobile-app"?"active":""}>Mobile-app</a>
            <a href='#footer' onClick={()=>setMenu("Contact-us")} className={menu==="Contact-us"?"active":""}>Contact-us</a>
        </ul>
        <div className="nav-right">
           
            <div className="nav-search-icon">
               <Link to='/cart'> <img src="/basket_icon.png" alt=""  /></Link>
                <div className={getCartTotal()===0?"":"dot"}></div>
            </div>
            {!token ? <button onClick={()=>setShowLogin(true)}>sign in</button>
            :<div className='navbar-profile'>
                <img src={assets.profile_icon} alt="" />
                <ui className="nav-profile-dropdown">
                    <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                    <hr/>
                    <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
                </ui>
            </div>}
           
        </div>
    </div>
  )
}

export default Navbar
