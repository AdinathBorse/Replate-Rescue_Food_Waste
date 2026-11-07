import React from 'react'
import './Header.css'
const Header = () => {

    const goToMenu = () => {
    document.getElementById('explore-menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='header'>
        <div className="header-content">
            <h2>Best food waiting for your belly</h2>
            <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
            <button onClick={goToMenu}>View Menu</button>
        </div>
    </div>
  )
}

export default Header
