import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.Replate_logo} alt="logo" id='logo' />
                    <p>Replate brings you fresh, delicious meals from your favorite restaurants straight to your door. Fast delivery, easy ordering, and top-quality service – because great food should never wait.</p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.twitter_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+91-212-456-2345</li>
                        <li>contactus@replate.com</li>
                    </ul>
                </div>
            </div>
            
            <p className='p'>By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners
                2008-2025 © Replate™ Ltd. All rights reserved</p>
        </div>
    )
}

export default Footer
