import React, { useState, useEffect, useContext } from 'react';
import './MysteryBagDisplay.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MysteryBagDisplay = () => {
  const { food_list, cartItem, addToCart, removeFromCart, url } = useContext(StoreContext);
  const [filter, setFilter] = useState('All');
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });

  // Filter mystery bags from food_list
  const mysteryBags = food_list.filter((item) => item.isMysteryBag);

  // Live countdown timer to simulate late-night surplus window
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      // Target midnight 23:45:00
      const target = new Date();
      target.setHours(23, 45, 0, 0);

      let diff = target - now;
      if (diff <= 0) {
        // If past target, show tomorrow's window or next active slot
        diff = 3 * 60 * 60 * 1000; // 3 hours fallback
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  const filteredBags = mysteryBags.filter((item) => {
    if (filter === 'All') return true;
    return (item.dietaryType || '').toLowerCase() === filter.toLowerCase();
  });

  if (mysteryBags.length === 0) {
    return null; // Don't render section if no mystery bags are listed
  }

  return (
    <div className="mystery-section" id="mystery-deals">
      <div className="mystery-banner">
        <div className="mystery-badge-row">
          <span className="badge-pill eco-pill">Good food, less waste</span>
          <span className="badge-pill flash-pill">Available tonight</span>
        </div>

        <div className="mystery-header-content">
          <div className="header-text">
            <h2>Mystery surplus bags</h2>
            <p className="mystery-tagline">
              Fresh food from local kitchens, packed at the end of the day for less.
              <strong> Save up to 75%.</strong>
            </p>
          </div>

          <div className="mystery-timer-box">
            <span className="timer-title">Tonight's window closes in</span>
            <div className="timer-digits">
              <div className="digit-block">
                <span>{formatNumber(timeLeft.hours)}</span>
                <label>HRS</label>
              </div>
              <span className="timer-sep">:</span>
              <div className="digit-block">
                <span>{formatNumber(timeLeft.minutes)}</span>
                <label>MIN</label>
              </div>
              <span className="timer-sep">:</span>
              <div className="digit-block">
                <span>{formatNumber(timeLeft.seconds)}</span>
                <label>SEC</label>
              </div>
            </div>
          </div>
        </div>

        <div className="mystery-filters">
          {['All', 'Veg', 'Non-Veg', 'Bakery'].map((tab) => (
            <button
              key={tab}
              className={`filter-btn ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab === 'All' ? 'All bags' : tab === 'Bakery' ? 'Bakery' : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mystery-cards-grid">
        {filteredBags.map((bag) => {
          const discountPct = bag.originalPrice && bag.originalPrice > bag.price
            ? Math.round(((bag.originalPrice - bag.price) / bag.originalPrice) * 100)
            : 65;

          const savedAmount = (bag.originalPrice || bag.price * 2.5) - bag.price;

          return (
            <div key={bag._id} className="mystery-card">
              <div className="mystery-card-img-wrapper">
                <img
                  src={url + '/images/' + bag.image}
                  alt={bag.name}
                  className="mystery-card-img"
                />
                
                <div className="discount-tag">
                  {discountPct}% OFF
                </div>

                <div className="mystery-badge-pill">Mystery bag</div>

                <div className={`dietary-badge ${bag.dietaryType?.toLowerCase()}`}>
                  {bag.dietaryType || 'Veg'}
                </div>

                <div className="mystery-cart-btn-wrapper">
                  {!cartItem[bag._id] ? (
                    <button
                      className="mystery-add-btn"
                      onClick={() => addToCart(bag._id)}
                      aria-label={`Add ${bag.name} to cart`}
                    >
                      <img src={assets.add_icon_white} alt="" />
                    </button>
                  ) : (
                    <div className="mystery-item-counter">
                      <img
                        onClick={() => removeFromCart(bag._id)}
                        src={assets.remove_icon_red}
                        alt="Remove"
                      />
                      <p>{cartItem[bag._id]}</p>
                      <img
                        onClick={() => addToCart(bag._id)}
                        src={assets.add_icon_green}
                        alt="Add"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mystery-card-body">
                <div className="card-top-info">
                  <span className="mystery-stock-pill">
                    {bag.stock || 4} bags left
                  </span>
                  <span className="mystery-window-time">
                    {bag.startTime || '9:00 PM'} - {bag.endTime || '11:45 PM'}
                  </span>
                </div>

                <h3 className="mystery-card-title">{bag.name}</h3>
                <p className="mystery-card-desc">{bag.description}</p>

                <div className="surprise-guarantee">
                  Fresh selection from today's kitchen surplus
                </div>

                <div className="mystery-pricing-row">
                  <div className="pricing-left">
                    <span className="final-price">₹{bag.price}</span>
                    {bag.originalPrice > bag.price && (
                      <span className="original-price">₹{bag.originalPrice}</span>
                    )}
                  </div>
                  <span className="savings-badge">
                    Save ₹{savedAmount}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mystery-how-it-works">
        <div className="how-step">
          <span className="step-icon">1</span>
          <div className="step-info">
            <h4>Choose a bag</h4>
            <p>See what local kitchens have left at the end of the day.</p>
          </div>
        </div>
        <div className="how-step">
          <span className="step-icon">2</span>
          <div className="step-info">
            <h4>Enjoy a lower price</h4>
            <p>Get good food for less while helping a local business.</p>
          </div>
        </div>
        <div className="how-step">
          <span className="step-icon">3</span>
          <div className="step-info">
            <h4>Help reduce waste</h4>
            <p>Your order gives surplus food a place at the table.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MysteryBagDisplay;
